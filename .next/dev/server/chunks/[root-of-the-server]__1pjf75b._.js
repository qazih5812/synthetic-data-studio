module.exports = [
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
"[project]/src/app/api/generate/relational/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/gemini.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gemini$2d$json$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/gemini-json.ts [app-route] (ecmascript)");
;
;
;
// Keep primary entity count small per call to stay under free-tier output limits.
const MAX_PRIMARY_ENTITIES = 15;
async function POST(req) {
    if (!process.env.GEMINI_API_KEY) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Server configuration error: GEMINI_API_KEY is not set in .env.local'
        }, {
            status: 500
        });
    }
    try {
        const { schema, rowCount, locale, injectEdgeCases } = await req.json();
        if (!schema || schema.trim() === '') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Tables configuration is required'
            }, {
                status: 400
            });
        }
        const primaryEntities = Math.min(Math.max(1, rowCount || 10), MAX_PRIMARY_ENTITIES);
        const prompt = `
You are a database architect generating a realistic relational dataset. Output ONLY valid JSON — no markdown, no explanation.

Tables: ${schema}

Rules:
- Generate exactly ${primaryEntities} primary entities with appropriate related child rows.
- Maintain strict referential integrity (all foreign keys must reference existing primary keys).
- Locale: ${locale || 'en-US'}
- Edge cases: ${injectEdgeCases ? 'Include nulls where allowed, some outliers.' : 'Clean data only.'}

Output a single JSON object where each key is a table name and value is an array of row objects.
Start with { and end with }.

Example: { "Users": [{...}], "Orders": [{...}] }
`.trim();
        const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateWithRetry"])(prompt);
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gemini$2d$json$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanAndParseJSON"])(raw);
        if (typeof data !== 'object' || Array.isArray(data) || data === null) {
            throw new Error('AI returned an unexpected format — expected a JSON object with table names as keys.');
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data
        });
    } catch (error) {
        const message = error?.errorDetails?.[0]?.message || error?.message || 'Internal Server Error';
        console.error('[/api/generate/relational] Error:', message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
}),
"[project]/src/lib/gemini-json.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Robust JSON Cleaning, Truncation Recovery, and Parsing Utility for LLM / Gemini Responses.
 * Handles: markdown fences, preamble/postamble notes, unescaped tokens, trailing commas,
 * and — critically — truncated responses where the JSON is cut off mid-stream.
 */ __turbopack_context__.s([
    "cleanAndParseJSON",
    ()=>cleanAndParseJSON
]);
function cleanAndParseJSON(rawText) {
    if (!rawText || typeof rawText !== 'string') {
        throw new Error('Empty or invalid response received from Gemini model');
    }
    let cleaned = rawText.trim();
    // 1. Strip markdown code fences (```json ... ``` or ``` ... ```)
    const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
        cleaned = codeBlockMatch[1].trim();
    }
    // 2. Extract JSON boundary from first { or [ to last } or ]
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let startIdx = -1;
    if (firstBrace !== -1 && firstBracket !== -1) {
        startIdx = Math.min(firstBrace, firstBracket);
    } else if (firstBrace !== -1) {
        startIdx = firstBrace;
    } else if (firstBracket !== -1) {
        startIdx = firstBracket;
    }
    if (startIdx !== -1) {
        const lastBrace = cleaned.lastIndexOf('}');
        const lastBracket = cleaned.lastIndexOf(']');
        const endIdx = Math.max(lastBrace, lastBracket);
        if (endIdx > startIdx) {
            cleaned = cleaned.substring(startIdx, endIdx + 1);
        }
    }
    // 3. Common LLM syntax repairs
    // Remove trailing commas before } or ]
    const repair = (s)=>{
        let r = s.replace(/,\s*([}\]])/g, '$1');
        // Replace Python-style literals
        r = r.replace(/\bTrue\b/g, 'true');
        r = r.replace(/\bFalse\b/g, 'false');
        r = r.replace(/\bNone\b/g, 'null');
        // Replace single-quoted strings with double-quoted (basic heuristic)
        r = r.replace(/:\s*'([^'\\]*)'/g, ': "$1"');
        return r;
    };
    // 4. Fast direct parse attempt
    try {
        return JSON.parse(cleaned);
    } catch  {
    // Continue to repair
    }
    // 5. Try after repair
    const repaired = repair(cleaned);
    try {
        return JSON.parse(repaired);
    } catch  {
    // Continue to truncation recovery
    }
    // 6. TRUNCATION RECOVERY — This handles "position 11092" style errors.
    // If the JSON was cut off mid-stream (hit token limit), try to salvage
    // all complete objects/elements that were fully generated before the cut.
    const recovered = tryRecoverTruncated(repaired);
    if (recovered !== null) {
        try {
            return JSON.parse(recovered);
        } catch  {
        // fall through to final error
        }
    }
    // 7. Final error with diagnostics
    console.error('Failed to parse Gemini JSON output after all repair attempts:', {
        rawLength: rawText.length,
        cleanedSnippet: cleaned.slice(0, 500)
    });
    throw new Error(`JSON parse error from Gemini output: The response appears to be malformed. ` + `Try reducing the row count to get a smaller response.`);
}
/**
 * Attempts to recover a valid JSON value from a truncated string.
 * Strategy: walk backwards from the end of the string, finding the last
 * position that closes a complete JSON object or array element, then
 * properly close the outer container.
 */ function tryRecoverTruncated(s) {
    const trimmed = s.trim();
    if (!trimmed) return null;
    const isArray = trimmed.startsWith('[');
    const isObject = trimmed.startsWith('{');
    if (!isArray && !isObject) return null;
    const closeChar = isArray ? ']' : '}';
    // Walk backwards from end to find last complete element boundary
    // We look for },  or },\n or }  then try closing the outer container
    for(let i = trimmed.length - 1; i > 0; i--){
        const ch = trimmed[i];
        // Valid closing positions: after a }, ], string ", number, boolean, null
        if (ch === '}' || ch === ']' || ch === '"' || /\d/.test(ch) || trimmed.slice(Math.max(0, i - 3), i + 1).match(/(true|false|null)$/)) {
            const candidate = trimmed.slice(0, i + 1).replace(/,\s*$/, '') + closeChar;
            try {
                JSON.parse(candidate);
                console.warn(`[cleanAndParseJSON] Recovered truncated JSON at position ${i + 1} of ${trimmed.length}`);
                return candidate;
            } catch  {
                continue;
            }
        }
    }
    return null;
}
}),
"[project]/src/lib/gemini.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "genAI",
    ()=>genAI,
    "generateWithRetry",
    ()=>generateWithRetry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
;
const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
    console.error('CRITICAL: GEMINI_API_KEY is missing in .env.local — all generation requests will fail.');
}
const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](apiKey);
/**
 * Ordered list of models to try, from most preferred to fallback.
 * If the primary model is overloaded/unavailable, we automatically try the next.
 */ const MODEL_PRIORITY = [
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-1.5-flash'
];
/** Sleep for a given number of milliseconds */ const sleep = (ms)=>new Promise((resolve)=>setTimeout(resolve, ms));
/**
 * Classifies an error message into a retry category.
 */ function classifyError(msg) {
    const m = msg.toLowerCase();
    // Model retired / not found → skip to next model immediately
    if (msg.includes('[404]') || msg.includes('404 Not Found') || m.includes('no longer available')) {
        return 'skip_model';
    }
    // Transient overload / rate-limit / unreachable → retry with backoff
    if (msg.includes('[503]') || msg.includes('503 Service') || msg.includes('[429]') || msg.includes('429 Too Many') || msg.includes('[500]') || msg.includes('500 Internal') || m.includes('high demand') || m.includes('rate limit') || m.includes('quota exceeded') || m.includes('unreachable') || m.includes('unavailable') || m.includes('econnreset') || m.includes('econnrefused') || m.includes('network') || m.includes('timeout') || m.includes('fetch failed')) {
        return 'retryable';
    }
    return 'fatal';
}
async function generateWithRetry(prompt, maxRetries = 3) {
    let lastError = null;
    for (const modelName of MODEL_PRIORITY){
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                maxOutputTokens: 8192
            }
        });
        for(let attempt = 1; attempt <= maxRetries; attempt++){
            try {
                console.log(`[Gemini] model="${modelName}" attempt=${attempt}`);
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                if (text && text.trim().length > 2) {
                    console.log(`[Gemini] ✓ Success model="${modelName}" chars=${text.length}`);
                    return text;
                }
                throw new Error('Model returned an empty response');
            } catch (err) {
                lastError = err;
                const msg = err?.message || String(err);
                const kind = classifyError(msg);
                console.warn(`[Gemini] ${kind} error on "${modelName}" attempt=${attempt}: ${msg.slice(0, 140)}`);
                if (kind === 'skip_model') {
                    break; // immediately try next model
                }
                if (kind === 'retryable' && attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
                    console.warn(`[Gemini] Retrying in ${delay}ms...`);
                    await sleep(delay);
                    continue;
                }
                break;
            }
        }
    }
    const base = lastError?.message || 'All Gemini models are currently unreachable.';
    throw new Error(`${base} Please wait a moment and try again.`);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1pjf75b._.js.map