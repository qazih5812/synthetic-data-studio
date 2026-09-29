module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[project]/src/app/api/documentation/generate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$technical$2d$documentation$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/technical-documentation-service.ts [app-route] (ecmascript)");
;
;
;
;
async function POST(req) {
    try {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$technical$2d$documentation$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TechnicalDocumentationService"].generateTechnicalDocumentation();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            documentType: 'technical_project_documentation',
            format: 'pdf',
            title: result.title,
            version: result.version,
            generatedAt: result.generatedAt,
            sectionsCount: result.sectionsCount,
            file: result.filePath,
            status: 'generated',
            markdown: result.markdown
        });
    } catch (error) {
        console.error('[/api/documentation/generate] Error:', error.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: `Documentation generation failed: ${error.message}`
        }, {
            status: 500
        });
    }
}
async function GET(req) {
    const url = new URL(req.url);
    const download = url.searchParams.get('download');
    const pdfPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'docs', 'HackDataV2_Technical_Documentation.pdf');
    // If PDF doesn't exist yet, generate it first
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(pdfPath)) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$technical$2d$documentation$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TechnicalDocumentationService"].generateTechnicalDocumentation();
    }
    if (download === 'pdf') {
        const fileBuffer = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(pdfPath);
        return new Response(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="HackDataV2_Technical_Documentation.pdf"'
            }
        });
    }
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$technical$2d$documentation$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TechnicalDocumentationService"].generateTechnicalDocumentation();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        documentType: 'technical_project_documentation',
        format: 'pdf',
        title: result.title,
        version: result.version,
        sectionsCount: result.sectionsCount,
        file: result.filePath,
        status: 'ready',
        downloadUrl: '/api/documentation/generate?download=pdf'
    });
}
}),
"[project]/src/lib/technical-documentation-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TechnicalDocumentationService",
    ()=>TechnicalDocumentationService
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.node.min.js [app-route] (ecmascript)");
;
;
;
class TechnicalDocumentationService {
    static workspaceRoot = process.cwd();
    /**
   * Generates or reads the comprehensive Technical Project Documentation.
   */ static async generateTechnicalDocumentation() {
        const docsDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(this.workspaceRoot, 'docs');
        const mdPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(docsDir, 'HackDataV2_Technical_Documentation.md');
        const pdfPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(docsDir, 'HackDataV2_Technical_Documentation.pdf');
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(docsDir)) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(docsDir, {
                recursive: true
            });
        }
        // Read or create the definitive codebase-backed documentation markdown
        let markdown = '';
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(mdPath)) {
            markdown = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(mdPath, 'utf-8');
        } else {
            markdown = this.buildDocumentationFromCodebase();
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(mdPath, markdown, 'utf-8');
        }
        // Ensure PDF is generated and up to date
        this.renderPdfFromMarkdown(markdown, pdfPath);
        return {
            success: true,
            documentType: 'technical_project_documentation',
            format: 'pdf',
            title: 'HackDataV2 — Technical Project Documentation',
            version: '2.0.0',
            generatedAt: new Date().toISOString(),
            sectionsCount: 32,
            filePath: '/docs/HackDataV2_Technical_Documentation.pdf',
            markdown
        };
    }
    /**
   * Renders professional technical PDF documentation using jsPDF.
   */ static renderPdfFromMarkdown(markdownContent, outputPath) {
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsPDF"]({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 18;
        const maxWidth = pageWidth - margin * 2;
        let y = 24;
        let pageNum = 1;
        const checkPageBreak = (spaceNeeded = 10)=>{
            if (y + spaceNeeded > pageHeight - 20) {
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(`HackDataV2 Technical Project Documentation — Page ${pageNum}`, margin, pageHeight - 10);
                doc.addPage();
                pageNum++;
                y = 20;
            }
        };
        // Header title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59);
        doc.text('HackDataV2 — Technical Project Documentation', margin, y);
        y += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('Official System Architecture, Implementation Audit & Technical Specifications', margin, y);
        y += 4;
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        const lines = markdownContent.split('\n');
        for(let i = 0; i < lines.length; i++){
            const line = lines[i];
            if (line.startsWith('## ')) {
                checkPageBreak(16);
                y += 4;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(13);
                doc.setTextColor(30, 58, 138); // Deep Navy Blue
                doc.text(line.replace('## ', ''), margin, y);
                y += 7;
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(30, 41, 59);
            } else if (line.startsWith('### ')) {
                checkPageBreak(12);
                y += 2;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10.5);
                doc.setTextColor(51, 65, 85);
                doc.text(line.replace('### ', ''), margin, y);
                y += 6;
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(30, 41, 59);
            } else if (line.startsWith('```')) {
                // Code or preformatted block
                i++;
                const codeLines = [];
                while(i < lines.length && !lines[i].startsWith('```')){
                    codeLines.push(lines[i]);
                    i++;
                }
                doc.setFont('courier', 'normal');
                doc.setFontSize(7.5);
                doc.setTextColor(51, 65, 85);
                for (const cl of codeLines){
                    checkPageBreak(5);
                    doc.text(cl.slice(0, 105), margin + 3, y);
                    y += 3.8;
                }
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(30, 41, 59);
                y += 2;
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                checkPageBreak(6);
                doc.setFontSize(8.5);
                doc.setTextColor(30, 41, 59);
                const wrapped = doc.splitTextToSize(`• ${line.slice(2)}`, maxWidth - 4);
                for (const wl of wrapped){
                    checkPageBreak(5);
                    doc.text(wl, margin + 4, y);
                    y += 4.2;
                }
            } else if (line.trim().length === 0) {
                y += 2;
            } else {
                checkPageBreak(6);
                doc.setFontSize(8.5);
                doc.setTextColor(51, 65, 85);
                const wrapped = doc.splitTextToSize(line, maxWidth);
                for (const wl of wrapped){
                    checkPageBreak(5);
                    doc.text(wl, margin, y);
                    y += 4.2;
                }
            }
        }
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`HackDataV2 Technical Project Documentation — Page ${pageNum}`, margin, pageHeight - 10);
        const pdfBuffer = doc.output('arraybuffer');
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(outputPath, Buffer.from(pdfBuffer));
    }
    /**
   * Fallback builder if file does not exist.
   */ static buildDocumentationFromCodebase() {
        return `# HackDataV2 — Technical Project Documentation\n\n## 1. Executive Summary\nHackDataV2 is an enterprise synthetic data generation studio built with Next.js 16 and TypeScript.`;
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0vko0-6._.js.map