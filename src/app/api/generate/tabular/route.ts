import { NextResponse } from 'next/server';
import { generateTable, inferFieldType, validateTabularData, type TableSchema, type FieldSchema } from '@/lib/deterministic-generator';

/**
 * POST /api/generate/tabular
 *
 * Uses the deterministic generator for fast, reproducible, type-correct data.
 * No LLM calls during row generation — fast and free.
 *
 * Body:
 *   schema: string — comma-separated field specs like "id:id, name:name, email:email"
 *           OR array of FieldSchema objects (from the wizard/plan)
 *   rowCount: number
 *   locale: string
 *   seed: number (optional)
 *   injectEdgeCases: boolean
 *   nullRate: number (0-1)
 *   constraints: string[] (for validation pass)
 */
export async function POST(req: Request) {
  try {
    const { schema, rowCount, locale, seed, injectEdgeCases, nullRate, constraints } = await req.json();

    if (!schema) {
      return NextResponse.json({ error: 'Schema definition is required' }, { status: 400 });
    }

    const totalRows = Math.min(Math.max(1, rowCount || 10), 500);

    // ── Parse schema ──────────────────────────────────────────────────────────
    let fields: FieldSchema[];

    if (Array.isArray(schema)) {
      // From wizard/plan — already structured
      fields = schema as FieldSchema[];
    } else if (typeof schema === 'string') {
      // From manual text input: "id:id, name:name, email:email, salary:salary"
      fields = parseTextSchema(schema, injectEdgeCases, nullRate);
    } else if (typeof schema === 'object' && schema.fields) {
      fields = schema.fields as FieldSchema[];
    } else {
      return NextResponse.json({ error: 'Schema must be a string spec or array of field objects.' }, { status: 400 });
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No valid fields could be parsed from the schema.' }, { status: 400 });
    }

    // Apply edge case settings
    if (injectEdgeCases) {
      fields = fields.map(f => ({
        ...f,
        nullRate: f.primaryKey ? 0 : (nullRate ?? 0.05),
      }));
    }

    const tableSchema: TableSchema = {
      name: 'GeneratedTable',
      fields,
      rows: totalRows,
      seed: seed ?? 42,
    };

    // ── Generate ──────────────────────────────────────────────────────────────
    const data = generateTable(tableSchema, locale || 'en-US');

    // ── Validate ──────────────────────────────────────────────────────────────
    const validation = validateTabularData(data, { fields }, constraints || []);

    return NextResponse.json({ data, validation, rowCount: data.length });

  } catch (error: any) {
    console.error('[/api/generate/tabular] Error:', error.message);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Parse a simple text schema like:
 *   "id:id, name:name, email:email, age:integer, status:status"
 * into FieldSchema objects.
 */
function parseTextSchema(text: string, injectEdgeCases?: boolean, nullRate?: number): FieldSchema[] {
  return text
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)
    .map((part, index) => {
      const colonIdx = part.indexOf(':');
      let name: string, typeHint: string;

      if (colonIdx !== -1) {
        name = part.slice(0, colonIdx).trim().replace(/\s+/g, '_');
        typeHint = part.slice(colonIdx + 1).trim().toLowerCase();
      } else {
        name = part.trim().replace(/\s+/g, '_');
        typeHint = inferFieldType(name, []).toString();
      }

      const isPK = name.toLowerCase() === 'id' || (index === 0 && name.toLowerCase().endsWith('id'));

      return {
        name,
        type: mapTypeHint(typeHint, name),
        primaryKey: isPK,
        unique: isPK,
        nullable: !isPK && (injectEdgeCases ?? false),
        nullRate: !isPK && injectEdgeCases ? (nullRate ?? 0.05) : 0,
      } as FieldSchema;
    });
}

function mapTypeHint(hint: string, name: string): FieldSchema['type'] {
  const map: Record<string, FieldSchema['type']> = {
    'id': 'id', 'integer': 'integer', 'int': 'integer', 'number': 'integer',
    'float': 'float', 'decimal': 'float', 'double': 'float',
    'string': 'string', 'text': 'string', 'varchar': 'string',
    'boolean': 'boolean', 'bool': 'boolean',
    'name': 'name', 'fullname': 'name', 'full_name': 'name',
    'first_name': 'first_name', 'firstname': 'first_name',
    'last_name': 'last_name', 'lastname': 'last_name',
    'email': 'email', 'mail': 'email',
    'phone': 'phone', 'mobile': 'phone', 'tel': 'phone',
    'address': 'address', 'city': 'city', 'country': 'country',
    'company': 'company', 'employer': 'company',
    'date': 'date', 'datetime': 'datetime', 'timestamp': 'datetime',
    'price': 'price', 'currency': 'currency', 'amount': 'currency',
    'salary': 'salary', 'wage': 'salary',
    'status': 'status', 'gender': 'gender', 'role': 'role',
    'categorical': 'categorical', 'category': 'categorical',
    'url': 'url', 'ip': 'ip', 'description': 'description',
    'uuid': 'uuid',
  };

  if (map[hint]) return map[hint];

  // Fall back to name-based inference
  return inferFieldType(name, []) as FieldSchema['type'];
}
