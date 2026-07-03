import { translateStaticText, type LangCode } from "@/lib/i18n";

/**
 * Professional offline UI localization helper.
 * It only translates approved app phrases from the i18n dictionary, so the UI no
 * longer feels like a live web translator and never calls a translation API.
 */
export async function translateDOM(root: HTMLElement, lang: string) {
  const target = lang as LangCode;
  if (!target || target === "en") return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      const tag = p.tagName;
      if (["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "INPUT", "TEXTAREA"].includes(tag)) return NodeFilter.FILTER_REJECT;
      if (p.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      const value = node.nodeValue || "";
      const trimmed = value.trim();
      if (!trimmed || trimmed.length < 2) return NodeFilter.FILTER_REJECT;
      if (/^[\d\s.,:;$€¥₹%+\-–—/·•|()#*]+$/.test(trimmed)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const t = n as Text;
    if (!(t as any).__origEn) (t as any).__origEn = t.nodeValue || "";
    const original = (t as any).__origEn as string;
    const translated = translateStaticText(original, target);
    if (translated !== original) t.nodeValue = translated;
  }
}

export function restoreDOM(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const t = n as Text;
    if ((t as any).__origEn) t.nodeValue = (t as any).__origEn;
  }
}