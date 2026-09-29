import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'HackDataV2 Synthetic Data Studio',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    ai: process.env.GEMINI_API_KEY ? 'configured' : 'missing — set GEMINI_API_KEY in .env.local',
    endpoints: [
      'GET  /api/health',
      'POST /api/upload',
      'POST /api/analyze',
      'POST /api/generate/tabular',
      'POST /api/generate/relational',
      'POST /api/generate/document',
      'POST /api/generate/invoice',
      'POST /api/generate/bank-statement',
      'POST /api/validate',
      'POST /api/documentation/generate',
      'GET  /api/documentation/generate',
    ],
  });
}
