/**
 * Robust JSON Cleaning, Truncation Recovery, and Parsing Utility for LLM / Gemini Responses.
 * Handles: markdown fences, preamble/postamble notes, unescaped tokens, trailing commas,
 * and — critically — truncated responses where the JSON is cut off mid-stream.
 */

export function cleanAndParseJSON<T = any>(rawText: string): T {
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
  const repair = (s: string) => {
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
    return JSON.parse(cleaned) as T;
  } catch {
    // Continue to repair
  }

  // 5. Try after repair
  const repaired = repair(cleaned);
  try {
    return JSON.parse(repaired) as T;
  } catch {
    // Continue to truncation recovery
  }

  // 6. TRUNCATION RECOVERY — This handles "position 11092" style errors.
  // If the JSON was cut off mid-stream (hit token limit), try to salvage
  // all complete objects/elements that were fully generated before the cut.
  const recovered = tryRecoverTruncated(repaired);
  if (recovered !== null) {
    try {
      return JSON.parse(recovered) as T;
    } catch {
      // fall through to final error
    }
  }

  // 7. Final error with diagnostics
  console.error('Failed to parse Gemini JSON output after all repair attempts:', {
    rawLength: rawText.length,
    cleanedSnippet: cleaned.slice(0, 500),
  });
  throw new Error(
    `JSON parse error from Gemini output: The response appears to be malformed. ` +
    `Try reducing the row count to get a smaller response.`
  );
}

/**
 * Attempts to recover a valid JSON value from a truncated string.
 * Strategy: walk backwards from the end of the string, finding the last
 * position that closes a complete JSON object or array element, then
 * properly close the outer container.
 */
function tryRecoverTruncated(s: string): string | null {
  const trimmed = s.trim();
  if (!trimmed) return null;

  const isArray = trimmed.startsWith('[');
  const isObject = trimmed.startsWith('{');
  if (!isArray && !isObject) return null;

  const closeChar = isArray ? ']' : '}';

  // Walk backwards from end to find last complete element boundary
  // We look for },  or },\n or }  then try closing the outer container
  for (let i = trimmed.length - 1; i > 0; i--) {
    const ch = trimmed[i];
    // Valid closing positions: after a }, ], string ", number, boolean, null
    if (ch === '}' || ch === ']' || ch === '"' || /\d/.test(ch) || 
        trimmed.slice(Math.max(0, i - 3), i + 1).match(/(true|false|null)$/)) {
      const candidate = trimmed.slice(0, i + 1).replace(/,\s*$/, '') + closeChar;
      try {
        JSON.parse(candidate);
        console.warn(`[cleanAndParseJSON] Recovered truncated JSON at position ${i + 1} of ${trimmed.length}`);
        return candidate;
      } catch {
        // keep scanning backwards
        continue;
      }
    }
  }

  return null;
}
