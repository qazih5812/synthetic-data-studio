import { NextResponse } from 'next/server';
import { inferFieldType, inferPrimaryKey, inferForeignKeys } from '@/lib/deterministic-generator';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided. Send a CSV as multipart/form-data with field name "file".' }, { status: 400 });
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv')) {
      return NextResponse.json({ error: 'Only CSV files are supported. Please upload a .csv file.' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.trim().split('\n');

    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV must have at least a header row and one data row.' }, { status: 400 });
    }

    // Parse CSV header
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));

    if (headers.length === 0 || headers.every(h => !h)) {
      return NextResponse.json({ error: 'Could not parse CSV headers. Ensure the first row contains column names.' }, { status: 400 });
    }

    // Parse up to 100 sample rows for inference
    const sampleRows: Record<string, any>[] = [];
    const maxSample = Math.min(lines.length - 1, 100);

    for (let i = 1; i <= maxSample; i++) {
      const cells = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      const row: Record<string, any> = {};
      headers.forEach((h, idx) => {
        const raw = cells[idx] ?? '';
        // Try to parse as number
        if (raw !== '' && !isNaN(Number(raw))) {
          row[h] = Number(raw);
        } else if (raw.toLowerCase() === 'true') {
          row[h] = true;
        } else if (raw.toLowerCase() === 'false') {
          row[h] = false;
        } else {
          row[h] = raw || null;
        }
      });
      sampleRows.push(row);
    }

    // Infer field types
    const fields = headers.map(h => {
      const samples = sampleRows.map(r => r[h]).filter(v => v !== null && v !== undefined);
      const type = inferFieldType(h, samples);
      const pkName = inferPrimaryKey(headers);

      // Calculate null rate from sample
      const nullCount = sampleRows.filter(r => r[h] === null || r[h] === '').length;
      const nullRate = sampleRows.length > 0 ? nullCount / sampleRows.length : 0;

      return {
        name: h,
        type,
        primaryKey: h === pkName,
        nullable: nullRate > 0,
        nullRate: parseFloat(nullRate.toFixed(3)),
        sampleValues: samples.slice(0, 3),
      };
    });

    // Detect potential FK relationships (single-table upload)
    const tableName = file.name.replace(/\.csv$/i, '').replace(/[^a-zA-Z0-9_]/g, '_');

    const schema = {
      tableName,
      rowCount: lines.length - 1,
      fields,
      detectedRelationships: [] as string[],
    };

    // Look for FK-like patterns within the same file
    const fkFields = headers.filter(h => h.toLowerCase().endsWith('_id') && h.toLowerCase() !== 'id');
    if (fkFields.length > 0) {
      schema.detectedRelationships = fkFields.map(f => `${f} may reference another table`);
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      schema,
      preview: sampleRows.slice(0, 5),
      message: `Inferred schema from ${sampleRows.length} sample rows across ${headers.length} columns.`,
    });

  } catch (error: any) {
    console.error('[/api/upload] Error:', error.message);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}
