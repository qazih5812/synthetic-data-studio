import { NextResponse } from 'next/server';
import { validateTabularData, validateRelationalData, validateDocumentData, type FieldSchema } from '@/lib/deterministic-generator';

export async function POST(req: Request) {
  try {
    const { data, mode, schema, constraints, fkMap } = await req.json();

    if (!data) {
      return NextResponse.json({ error: 'No data provided for validation.' }, { status: 400 });
    }

    let result;

    if (mode === 'relational' && typeof data === 'object' && !Array.isArray(data)) {
      result = validateRelationalData(data, fkMap || {});
    } else if (mode === 'document' || mode === 'invoice' || mode === 'bank-statement') {
      result = validateDocumentData(data, mode);
    } else {
      const fieldSchemas: FieldSchema[] = (schema?.fields || []).map((f: any) => ({
        name: f.name,
        type: f.type || 'string',
        primaryKey: f.primaryKey || false,
        nullable: f.nullable || false,
      }));

      // If no schema provided, infer minimal schema from data
      if (fieldSchemas.length === 0 && Array.isArray(data) && data.length > 0) {
        Object.keys(data[0]).forEach(key => {
          fieldSchemas.push({
            name: key,
            type: 'string',
            primaryKey: key === 'id',
          });
        });
      }

      result = validateTabularData(
        Array.isArray(data) ? data : Object.values(data).flat(),
        { fields: fieldSchemas },
        constraints || []
      );
    }

    return NextResponse.json({ validation: result });

  } catch (error: any) {
    console.error('[/api/validate] Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
