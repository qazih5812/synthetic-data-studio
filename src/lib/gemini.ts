import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
    console.error('CRITICAL: GEMINI_API_KEY is missing in .env.local — all generation requests will fail.');
}

export const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Ordered list of models to try, from most preferred to fallback.
 * If the primary model is overloaded/unavailable, we automatically try the next.
 */
const MODEL_PRIORITY = [
    'gemini-3.8-flash',
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
] as const;

/** Sleep for a given number of milliseconds */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Classifies an error message into a retry category.
 */
function classifyError(msg: string): 'retryable' | 'skip_model' | 'fatal' {
    const m = msg.toLowerCase();

    // Model retired / not found → skip to next model immediately
    if (msg.includes('[404]') || msg.includes('404 Not Found') || m.includes('no longer available')) {
        return 'skip_model';
    }

    // Transient overload / rate-limit / unreachable → retry with backoff
    if (
        msg.includes('[503]') || msg.includes('503 Service') ||
        msg.includes('[429]') || msg.includes('429 Too Many') ||
        msg.includes('[500]') || msg.includes('500 Internal') ||
        m.includes('high demand') ||
        m.includes('rate limit') ||
        m.includes('quota exceeded') ||
        m.includes('unreachable') ||
        m.includes('unavailable') ||
        m.includes('econnreset') ||
        m.includes('econnrefused') ||
        m.includes('network') ||
        m.includes('timeout') ||
        m.includes('fetch failed')
    ) {
        return 'retryable';
    }

    return 'fatal';
}

/**
 * generateWithRetry — Calls Gemini with automatic retry + exponential backoff.
 *
 * Error handling:
 *   - 503 / 429 / 500 / unreachable / network errors → retry with 2s/4s/8s backoff
 *   - 404 / model retired → skip immediately to the next fallback model
 *   - Other errors → skip to next model after logging
 *
 * @param prompt      The prompt string to send to Gemini.
 * @param maxRetries  Max retry attempts per model (default: 3).
 */
export async function generateWithRetry(
    prompt: string,
    maxRetries = 3,
    jsonMode = false
): Promise<string> {
    let lastError: Error | null = null;

    for (const modelName of MODEL_PRIORITY) {
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                maxOutputTokens: 8192,
                ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
            },
        });

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`[Gemini] model="${modelName}" attempt=${attempt}`);
                const result = await model.generateContent(prompt);
                const text = result.response.text();

                if (text && text.trim().length > 2) { // >2 to avoid empty {} or []
                    console.log(`[Gemini] ✓ Success model="${modelName}" chars=${text.length}`);
                    return text;
                }
                throw new Error('Model returned an empty response');

            } catch (err: any) {
                lastError = err;
                const msg: string = err?.message || String(err);
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

                // fatal or exhausted retries → try next model
                break;
            }
        }
    }

    const base = lastError?.message || 'All Gemini models are currently unreachable.';
    throw new Error(`${base} Please wait a moment and try again.`);
}