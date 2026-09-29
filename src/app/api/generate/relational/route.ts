import { NextResponse } from 'next/server';
import { generateTable, validateRelationalData, type TableSchema, type FieldSchema } from '@/lib/deterministic-generator';

/**
 * POST /api/generate/relational
 *
 * Deterministic relational data generation with guaranteed PK/FK integrity.
 * Parents are generated first, then children reference parent PKs.
 *
 * Body:
 *   tables: TableSchema[] — from wizard/plan, or simple text
 *   schema: string — simple text schema (alternative)
 *   rowCount: number
 *   locale: string
 *   seed: number
 *   injectEdgeCases: boolean
 */
export async function POST(req: Request) {
  try {
    const { tables, schema, rowCount, locale, seed, injectEdgeCases } = await req.json();

    const baseRows = Math.min(Math.max(1, rowCount || 10), 200);
    const localeStr = locale || 'en-US';
    const baseSeed = seed ?? 42;

    // ── Build table schemas ────────────────────────────────────────────────────
    let tableSchemas: TableSchema[];

    if (Array.isArray(tables) && tables.length > 0) {
      // Structured input from wizard
      tableSchemas = tables.map((t: any, i: number) => ({
        name: t.name,
        fields: t.fields || [],
        rows: t.rows || baseRows,
        seed: baseSeed + i,
      }));
    } else {
      // Parse text schema like: "Customers(id, name, email), Orders(id, customer_id, total)"
      tableSchemas = parseTextRelationalSchema(schema || '', baseRows, baseSeed, injectEdgeCases);
    }

    if (tableSchemas.length === 0) {
      return NextResponse.json(
        { error: 'No valid tables could be parsed. Use format: TableName(field1, field2), ...' },
        { status: 400 }
      );
    }

    // ── Generate in dependency order (parents first) ────────────────────────
    const allData: Record<string, any[]> = {};
    const fkMap: Record<string, string> = {};

    // Collect FK relationships from field definitions
    for (const ts of tableSchemas) {
      for (const field of ts.fields) {
        if (field.foreignKey) {
          fkMap[`${ts.name}.${field.name}`] = field.foreignKey;
        }
      }
    }

    // Topological sort — generate tables with no FK deps first
    const order = topoSort(tableSchemas, fkMap);

    for (const tableName of order) {
      const ts = tableSchemas.find(t => t.name === tableName)!;
      const rows = generateTable(ts, localeStr, allData);
      allData[tableName] = rows;
    }

    // ── Validate ────────────────────────────────────────────────────────────
    const validation = validateRelationalData(allData, fkMap);

    return NextResponse.json({ data: allData, validation, tables: Object.keys(allData) });

  } catch (error: any) {
    console.error('[/api/generate/relational] Error:', error.message);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Parse: "Customers(id, name, email), Orders(id, customer_id, total, date)"
 */
function parseTextRelationalSchema(text: string, baseRows: number, seed: number, edgeCases?: boolean): TableSchema[] {
  const tablePattern = /(\w+)\s*\(([^)]+)\)/g;
  const tableSchemas: TableSchema[] = [];
  let match;
  let tableIndex = 0;

  while ((match = tablePattern.exec(text)) !== null) {
    const tableName = match[1];
    const fieldList = match[2].split(',').map(f => f.trim()).filter(Boolean);

    const fields: FieldSchema[] = fieldList.map((fieldSpec, fieldIndex) => {
      const [rawName, rawType] = fieldSpec.split(':').map(s => s.trim());
      const name = rawName;
      const typeLower = (rawType || '').toLowerCase();

      // Auto-detect FK pattern: field_id → likely references another table
      const fkMatch = name.toLowerCase().match(/^([a-z]+)_id$/);
      let foreignKey: string | undefined;
      if (fkMatch && name.toLowerCase() !== 'id') {
        const refTable = capitalize(fkMatch[1]) + 's';
        foreignKey = `${refTable}.id`;
      }

      const isPK = name.toLowerCase() === 'id' || fieldIndex === 0 && name.toLowerCase().endsWith('id') && !foreignKey;

      const typeMap: Record<string, FieldSchema['type']> = {
        'name': 'name', 'email': 'email', 'phone': 'phone', 'date': 'date',
        'datetime': 'datetime', 'status': 'status', 'price': 'price',
        'total': 'price', 'amount': 'price', 'currency': 'currency',
        'salary': 'salary', 'string': 'string', 'integer': 'integer', 'int': 'integer',
        'float': 'float', 'boolean': 'boolean', 'bool': 'boolean',
        'address': 'address', 'city': 'city', 'country': 'country', 'company': 'company',
        'description': 'description', 'role': 'role', 'gender': 'gender',
        'url': 'url', 'uuid': 'uuid',
      };

      const type: FieldSchema['type'] = isPK ? 'id'
        : foreignKey ? 'integer'
        : (typeMap[typeLower] || typeMap[name.toLowerCase()] || 'string');

      return {
        name,
        type,
        primaryKey: isPK,
        unique: isPK,
        foreignKey: foreignKey && !isPK ? foreignKey : undefined,
        nullable: !isPK && (edgeCases ?? false),
        nullRate: !isPK && edgeCases ? 0.05 : 0,
      };
    });

    // Scale rows by table position (child tables have more rows)
    const rowMultiplier = tableIndex === 0 ? 1 : 3;
    tableSchemas.push({
      name: tableName,
      fields,
      rows: Math.min(baseRows * rowMultiplier, 200),
      seed: seed + tableIndex,
    });
    tableIndex++;
  }

  return tableSchemas;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Sort tables so parents come before children */
function topoSort(tables: TableSchema[], fkMap: Record<string, string>): string[] {
  const names = tables.map(t => t.name);
  const visited = new Set<string>();
  const result: string[] = [];

  function visit(name: string) {
    if (visited.has(name)) return;
    visited.add(name);

    // Visit parents first
    for (const [fkPath, pkPath] of Object.entries(fkMap)) {
      const [fkTable] = fkPath.split('.');
      const [pkTable] = pkPath.split('.');
      if (fkTable === name) visit(pkTable);
    }

    result.push(name);
  }

  for (const name of names) visit(name);
  return result;
}
