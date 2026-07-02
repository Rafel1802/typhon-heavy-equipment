/* Runtime DOM auto-translator.
   Walks visible text nodes and replaces English text with the target language
   via Google's public translate endpoint (no API key). Caches all results in
   localStorage so subsequent renders are instant and offline-friendly. */

const CACHE_KEY = "typhon.tx.cache.v1";
type Cache = Record<string, Record<string, string>>; // lang -> { text -> translated }

function loadCache(): Cache {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}") || {}; } catch { return {}; }
}
function saveCache(c: Cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
}

const inflight = new Set<string>();

async function translateBatch(texts: string[], lang: string): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  await Promise.all(texts.map(async (t) => {
    const key = `${lang}::${t}`;
    if (inflight.has(key)) return;
    inflight.add(key);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(lang)}&dt=t&q=${encodeURIComponent(t)}`;
      const res = await fetch(url);
      const j: any = await res.json();
      const translated = (j?.[0] || []).map((seg: any[]) => seg?.[0] || "").join("");
      if (translated) out[t] = translated;
    } catch { /* offline / blocked — keep original */ }
    finally { inflight.delete(key); }
  }));
  return out;
}

/** Walk the DOM below `root` and translate every English text node into `lang`. */
export async function translateDOM(root: HTMLElement, lang: string) {
  if (!lang || lang === "en") return;
  const cache = loadCache();
  const langCache = cache[lang] || (cache[lang] = {});

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      const tag = p.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "CODE" || tag === "PRE") return NodeFilter.FILTER_REJECT;
      if (p.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      const v = node.nodeValue?.trim();
      if (!v || v.length < 2) return NodeFilter.FILTER_REJECT;
      // Skip numeric/currency/code strings
      if (/^[\d\s.,:;$€¥₹%+\-–—/·•|()#*]+$/.test(v)) return NodeFilter.FILTER_REJECT;
      // Skip if not Latin (already translated / contains non-english characters like Chinese)
      if (!/[a-zA-Z]/.test(v)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  const originals: string[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const t = n as Text;
    const orig = t.nodeValue!;
    if (!(t as any).__origEn) (t as any).__origEn = orig;
    const src: string = (t as any).__origEn;
    const trimmed = src.trim();
    if (langCache[trimmed]) {
      const lead = src.match(/^\s*/)?.[0] || "";
      const tail = src.match(/\s*$/)?.[0] || "";
      t.nodeValue = lead + langCache[trimmed] + tail;
    } else {
      nodes.push(t);
      originals.push(trimmed);
    }
  }

  if (originals.length === 0) return;

  // Batch requests: unique texts only
  const unique = Array.from(new Set(originals));
  const chunkSize = 20;
  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    const result = await translateBatch(chunk.filter(t => !langCache[t]), lang);
    Object.assign(langCache, result);
  }
  saveCache(cache);

  // Apply
  for (let i = 0; i < nodes.length; i++) {
    const t = nodes[i];
    const src: string = (t as any).__origEn;
    const trimmed = src.trim();
    if (langCache[trimmed]) {
      const lead = src.match(/^\s*/)?.[0] || "";
      const tail = src.match(/\s*$/)?.[0] || "";
      t.nodeValue = lead + langCache[trimmed] + tail;
    }
  }
}

/** Restore all text nodes to their original English. */
export function restoreDOM(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const t = n as Text;
    if ((t as any).__origEn && t.nodeValue !== (t as any).__origEn) {
      t.nodeValue = (t as any).__origEn;
    }
  }
}
