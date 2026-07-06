import type { ChatMsg } from "@/lib/typhon-store";

type GeminiCall = {
  apiKey: string;
  model: string;
  system: string;
  history?: Pick<ChatMsg, "role" | "text" | "image">[];
  userText: string;
  imageDataUrl?: string | null;
};

type GeminiResult = { text: string; model: string };

const FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite", "gemini-1.5-flash", "gemini-1.5-flash-8b"];

function cleanModel(model: string) {
  return (model || "gemini-2.0-flash").trim().replace(/^models\//, "");
}

function dataUrlToInlinePart(dataUrl: string) {
  const [meta, data] = dataUrl.split(",");
  const mime = meta?.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  return { inlineData: { mimeType: mime, data } };
}

function buildUserText(history: GeminiCall["history"], userText: string, imageDataUrl?: string | null) {
  const transcript = (history ?? [])
    .filter(m => m.text && !m.image)
    .slice(-10)
    .map(m => `${m.role === "ai" ? "TYPHON AI" : "Customer"}: ${m.text}`)
    .join("\n");
  const current = userText || (imageDataUrl ? "Please analyze this uploaded image for TYPHON machinery context." : "Hello");
  return [
    transcript ? `Recent conversation:\n${transcript}` : "",
    `Customer message:\n${current}`,
  ].filter(Boolean).join("\n\n");
}

function buildContents(call: GeminiCall, includeSystemInUser = false) {
  const parts: any[] = [];
  if (call.imageDataUrl) parts.push(dataUrlToInlinePart(call.imageDataUrl));
  const text = buildUserText(call.history, call.userText, call.imageDataUrl);
  parts.push({ text: includeSystemInUser ? `${call.system}\n\n${text}` : text });
  // A single user turn avoids Gemini 400 errors caused by saved chats that start with a model greeting.
  return [{ role: "user", parts }];
}

async function postGemini(call: GeminiCall, model: string, useSystemInstruction: boolean): Promise<GeminiResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(call.apiKey.trim())}`;
  const body = useSystemInstruction
    ? {
        systemInstruction: { parts: [{ text: call.system }] },
        contents: buildContents(call),
        generationConfig: { temperature: 0.35, topP: 0.9, maxOutputTokens: 1200 },
      }
    : {
        contents: buildContents(call, true),
        generationConfig: { temperature: 0.35, topP: 0.9, maxOutputTokens: 1200 },
      };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.error?.message || `Google AI HTTP ${res.status}`;
    throw new Error(msg);
  }
  const text = json?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || "").join("").trim();
  if (!text) {
    const reason = json?.promptFeedback?.blockReason || json?.candidates?.[0]?.finishReason || "empty response";
    throw new Error(`Google AI returned no text (${reason}).`);
  }
  return { text, model };
}

export async function callGeminiApi(call: GeminiCall): Promise<GeminiResult> {
  if (!call.apiKey.trim()) throw new Error("Google API key is missing.");
  const preferred = cleanModel(call.model);
  const models = Array.from(new Set([preferred, ...FALLBACK_MODELS.filter(m => m !== preferred)]));
  const errors: string[] = [];
  let quotaHit = false;

  for (const model of models) {
    for (const useSystemInstruction of [true, false]) {
      try {
        return await postGemini(call, model, useSystemInstruction);
      } catch (e: any) {
        const message = e?.message || String(e);
        errors.push(`${model}: ${message}`);
        if (/quota|rate.?limit|429|exceeded/i.test(message)) { quotaHit = true; break; } // try next model
        const recoverable = /not found|not supported|system|role|contents|invalid/i.test(message);
        if (!recoverable) throw new Error(message);
      }
    }
  }
  if (quotaHit) throw new Error("Google Gemini quota exceeded on every model for this API key. Wait a minute and try again, or use a key from a paid Google AI Studio project.");
  throw new Error(errors[0] || "Google AI connection failed.");
}

export async function testGeminiConnection(apiKey: string, model: string): Promise<GeminiResult> {
  return callGeminiApi({
    apiKey,
    model,
    system: "You are a connection test for TYPHON Machinery admin. Reply only with: OK TYPHON",
    userText: "Reply only with: OK TYPHON",
    history: [],
  });
}