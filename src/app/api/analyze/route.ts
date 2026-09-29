import { NextResponse } from 'next/server';
import { generateWithRetry } from '@/lib/gemini';
import { cleanAndParseJSON } from '@/lib/gemini-json';

export interface GenerationPlan {
  domain: string;
  locale: string;
  description: string;
  tables: Array<{
    name: string;
    rows: number;
    description: string;
    fields: Array<{
      name: string;
      type: string;
      primaryKey?: boolean;
      foreignKey?: string;
      nullable?: boolean;
      categories?: string[];
      description?: string;
    }>;
    relationships?: string[];
  }>;
  constraints: string[];
  edgeCases: string[];
}

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured.' },
      { status: 500 }
    );
  }

  try {
    const { prompt, locale } = await req.json();

    if (!prompt || prompt.trim() === '') {
      return NextResponse.json({ error: 'A natural language prompt is required.' }, { status: 400 });
    }

    const systemPrompt = `
You are a synthetic data architect. Convert the following natural language request into a structured generation plan.

User Request: "${prompt}"
Locale Hint: "${locale || 'en-US'}"

Output a single valid JSON object with this exact structure:
{
  "domain": "string (e.g. ecommerce, healthcare, banking, hr)",
  "locale": "string (e.g. en-US, pk)",
  "description": "string (brief summary of what will be generated)",
  "tables": [
    {
      "name": "string (PascalCase table name)",
      "rows": number (realistic row count based on request),
      "description": "string",
      "fields": [
        {
          "name": "string (snake_case)",
          "type": "string (one of: id, uuid, integer, float, boolean, string, name, first_name, last_name, email, phone, address, city, country, company, date, datetime, currency, price, salary, categorical, status, gender, role, description)",
          "primaryKey": true/false,
          "foreignKey": "TableName.fieldName or null",
          "nullable": true/false,
          "categories": ["array", "of", "valid", "values"] or null,
          "description": "string"
        }
      ],
      "relationships": ["e.g. Orders.customer_id → Customers.id"]
    }
  ],
  "constraints": ["array of business rule strings, e.g. total > 0, age >= 18"],
  "edgeCases": ["brief description of edge cases to consider"]
}

Rules:
- Always include at least one table with an 'id' primary key field
- If multiple tables, add foreign key fields to link them
- Row counts must be practical (not more than 1000 for demo)
- For Pakistani locale, use 'pk' as locale value
- Be specific about field types — use 'email' not 'string' for email fields
- Output ONLY the JSON object, no explanation.
`.trim();

    const raw = await generateWithRetry(systemPrompt, 2);
    const plan = cleanAndParseJSON<GenerationPlan>(raw);

    // Validate the plan has required structure
    if (!plan.tables || !Array.isArray(plan.tables) || plan.tables.length === 0) {
      throw new Error('AI returned an invalid generation plan — no tables defined.');
    }

    return NextResponse.json({ plan });

  } catch (error: any) {
    const message = error?.message || 'Failed to create generation plan';
    console.error('[/api/analyze] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
