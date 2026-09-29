import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { TechnicalDocumentationService } from '@/lib/technical-documentation-service';

/**
 * POST /api/documentation/generate
 *
 * Dedicated Technical Project Documentation endpoint.
 * Calls TechnicalDocumentationService exclusively.
 * NEVER routes to or invokes the Invoice or Synthetic Business Document generators.
 */
export async function POST(req: Request) {
  try {
    const result = await TechnicalDocumentationService.generateTechnicalDocumentation();

    return NextResponse.json({
      success: true,
      documentType: 'technical_project_documentation',
      format: 'pdf',
      title: result.title,
      version: result.version,
      generatedAt: result.generatedAt,
      sectionsCount: result.sectionsCount,
      file: result.filePath,
      status: 'generated',
      markdown: result.markdown,
    });
  } catch (error: any) {
    console.error('[/api/documentation/generate] Error:', error.message);
    return NextResponse.json(
      { success: false, error: `Documentation generation failed: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * GET /api/documentation/generate
 *
 * Direct download or metadata retrieval for the technical project documentation PDF.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const download = url.searchParams.get('download');

  const pdfPath = path.join(process.cwd(), 'docs', 'HackDataV2_Technical_Documentation.pdf');

  // If PDF doesn't exist yet, generate it first
  if (!fs.existsSync(pdfPath)) {
    await TechnicalDocumentationService.generateTechnicalDocumentation();
  }

  if (download === 'pdf') {
    const fileBuffer = fs.readFileSync(pdfPath);
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="HackDataV2_Technical_Documentation.pdf"',
      },
    });
  }

  const result = await TechnicalDocumentationService.generateTechnicalDocumentation();
  return NextResponse.json({
    success: true,
    documentType: 'technical_project_documentation',
    format: 'pdf',
    title: result.title,
    version: result.version,
    sectionsCount: result.sectionsCount,
    file: result.filePath,
    status: 'ready',
    downloadUrl: '/api/documentation/generate?download=pdf',
  });
}
