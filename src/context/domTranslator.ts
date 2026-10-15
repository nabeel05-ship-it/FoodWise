"use client";

import { useEffect } from "react";
import { useLang, Language } from "./LanguageContext";
import {
  translateDynamicEnglishToHindi,
  translateHindiToEnglish,
  isDevanagari,
} from "./dictionary";
import {
  translateDynamicEnglishToKannada,
  translateKannadaToEnglish,
  isKannada,
} from "./kannadaDictionary";

// Text nodes remember their English source so switching languages can restore it
type TranslatableNode = Node & { __fw_orig?: string };

// Tracks translated nodes in current session
let translatedNodes = new WeakSet<Node>();

export function useDomAutoTranslator() {
  const { lang } = useLang();

  useEffect(() => {
    if (typeof window === "undefined") return;

    translatedNodes = new WeakSet<Node>();

    if (lang === "en") {
      // Restore all text nodes to their English original
      const doRestore = () => {
        restoreEnglish(document.body);
      };

      doRestore();
      const rafId = requestAnimationFrame(doRestore);
      const timerId = setTimeout(doRestore, 80);

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timerId);
      };
    }

    if (lang === "hi" || lang === "kn") {
      // Step 1: Restore English baseline first to prevent cross-language contamination
      restoreEnglish(document.body);

      // Step 2: Translate to target language
      const doTranslate = () => {
        translateTree(document.body, lang);
      };

      doTranslate();
      const rafId = requestAnimationFrame(doTranslate);
      const timerId = setTimeout(doTranslate, 80);

      // Observe DOM mutations (for modals, dialogs, drawers, live cards)
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "attributes") {
            translateAttributes(mutation.target as HTMLElement, lang);
          } else if (mutation.type === "characterData") {
            translateTextNode(mutation.target as Text, lang);
          } else if (mutation.type === "childList") {
            for (const addedNode of Array.from(mutation.addedNodes)) {
              if (addedNode.nodeType === Node.ELEMENT_NODE) {
                translateTree(addedNode as HTMLElement, lang);
              } else if (addedNode.nodeType === Node.TEXT_NODE) {
                translateTextNode(addedNode as Text, lang);
              }
            }
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true,
        attributes: true,
        attributeFilter: [...TRANSLATED_ATTRS],
      });

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timerId);
        observer.disconnect();
      };
    }
  }, [lang]);
}

function shouldSkipElement(element: HTMLElement): boolean {
  const tagName = element.tagName?.toLowerCase();
  if (
    tagName === "script" ||
    tagName === "style" ||
    tagName === "code" ||
    tagName === "pre" ||
    tagName === "svg"
  ) {
    return true;
  }
  if (element.closest('[data-no-translate="true"]')) {
    return true;
  }
  return false;
}

function isIndianScript(text: string): boolean {
  return isDevanagari(text) || isKannada(text);
}

function getSourceEnglish(raw: string, cachedOrig?: string): string {
  if (cachedOrig && !isIndianScript(cachedOrig)) {
    return cachedOrig;
  }
  if (!isIndianScript(raw)) {
    return raw;
  }
  if (isDevanagari(raw)) {
    return translateHindiToEnglish(raw);
  }
  if (isKannada(raw)) {
    return translateKannadaToEnglish(raw);
  }
  return raw;
}

// Dynamic labels (countdowns, serving counts) can't be whole-phrase dictionary entries
const DYNAMIC_PATTERNS: { re: RegExp; hi: string; kn: string }[] = [
  { re: /^(\d+) mins? (?:remaining|left)$/, hi: "$1 मिनट शेष", kn: "$1 ನಿಮಿಷ ಉಳಿದಿದೆ" },
  { re: /^(\d+)h (\d+)m left$/, hi: "$1 घं $2 मि शेष", kn: "$1 ಗಂ $2 ನಿ ಉಳಿದಿದೆ" },
  { re: /^(\d+) hrs safe buffer$/, hi: "$1 घंटे सुरक्षित समय", kn: "$1 ಗಂಟೆ ಸುರಕ್ಷಿತ ಅವಧಿ" },
  { re: /^Serves ~(\d+) people$/, hi: "~$1 लोगों के लिए", kn: "~$1 ಜನರಿಗೆ" },
  { re: /^(\d+) Active Volunteers$/, hi: "$1 सक्रिय स्वयंसेवक", kn: "$1 ಸಕ್ರಿಯ ಸ್ವಯಂಸೇವಕರು" },
  { re: /^Today, (\d{1,2}:\d{2} [AP]M)$/, hi: "आज, $1", kn: "ಇಂದು, $1" },
  { re: /^Tonight, (\d{1,2}:\d{2} [AP]M)$/, hi: "आज रात, $1", kn: "ಇಂದು ರಾತ್ರಿ, $1" },
  { re: /^Tomorrow, (\d{1,2}:\d{2} [AP]M)$/, hi: "कल, $1", kn: "ನಾಳೆ, $1" },
  { re: /^Yesterday, (\d{1,2}:\d{2} [AP]M)$/, hi: "बीता कल, $1", kn: "ನಿನ್ನೆ, $1" },
  { re: /^Stage (\d+) of (\d+)$/, hi: "चरण $1 / $2", kn: "ಹಂತ $1 / $2" },
  { re: /^\+(\d+) points$/, hi: "+$1 अंक", kn: "+$1 ಅಂಕಗಳು" },
  { re: /^~(\d+) servings$/, hi: "~$1 सर्विंग", kn: "~$1 ಊಟದ ಪಾಲುಗಳು" },
  { re: /^(\d+) mins$/, hi: "$1 मिनट", kn: "$1 ನಿಮಿಷ" },
  { re: /^(\d+) hrs$/, hi: "$1 घंटे", kn: "$1 ಗಂಟೆ" },
  {
    re: /^Personal impact for (.+) • Sharing extra food with local people in need\.$/,
    hi: "$1 का व्यक्तिगत प्रभाव • ज़रूरतमंद स्थानीय लोगों के साथ अतिरिक्त भोजन साझा करना।",
    kn: "$1 ಅವರ ವೈಯಕ್ತಿಕ ಪರಿಣಾಮ • ಅಗತ್ಯವಿರುವ ಸ್ಥಳೀಯರೊಂದಿಗೆ ಹೆಚ್ಚುವರಿ ಆಹಾರ ಹಂಚಿಕೆ.",
  },
  {
    re: /^Commercial kitchen and banquet rescue impact for (.+) • Zero food to landfill\.$/,
    hi: "$1 का वाणिज्यिक रसोई और भोज बचाव प्रभाव • लैंडफ़िल में शून्य भोजन।",
    kn: "$1 ಅವರ ವಾಣಿಜ್ಯ ಅಡುಗೆಮನೆ ಮತ್ತು ಔತಣಕೂಟ ಆಹಾರ ಉಳಿತಾಯದ ಪರಿಣಾಮ • ಭೂಭರ್ತಿಗೆ ಶೂನ್ಯ ಆಹಾರ.",
  },
  {
    re: /^Distribution summary for (.+) • Delivering donor surplus to communities\.$/,
    hi: "$1 का वितरण सारांश • दाताओं का अतिरिक्त भोजन समुदायों तक पहुँचाना।",
    kn: "$1 ಅವರ ವಿತರಣಾ ಸಾರಾಂಶ • ದಾನಿಗಳ ಹೆಚ್ಚುವರಿ ಆಹಾರವನ್ನು ಸಮುದಾಯಗಳಿಗೆ ತಲುಪಿಸುವುದು.",
  },
];

function translateDynamicPattern(text: string, targetLang: Language): string | null {
  const trimmed = text.trim();
  for (const p of DYNAMIC_PATTERNS) {
    if (p.re.test(trimmed)) {
      return text.replace(trimmed, trimmed.replace(p.re, targetLang === "hi" ? p.hi : p.kn));
    }
  }
  return null;
}

function translateTextNode(textNode: Text, targetLang: Language) {
  const raw = textNode.nodeValue;
  if (!raw || !raw.trim()) return;

  // Fresh English written by React (e.g. a counter or status update) becomes the new source text
  if (!isIndianScript(raw)) {
    (textNode as TranslatableNode).__fw_orig = raw;
    translatedNodes.delete(textNode);
  }
  if (translatedNodes.has(textNode)) return;

  // Don't translate pure numbers or short symbols
  if (/^[0-9\s.,:%°/\\()\-–—+*#@]+$/.test(raw)) return;

  // Check parent
  const parent = textNode.parentElement;
  if (parent && shouldSkipElement(parent)) return;

  const sourceText = getSourceEnglish(raw, (textNode as TranslatableNode).__fw_orig);

  let translated = "";
  if (targetLang === "hi") {
    translated = translateDynamicEnglishToHindi(sourceText);
  } else if (targetLang === "kn") {
    translated = translateDynamicEnglishToKannada(sourceText);
  }

  if (!translated || translated === sourceText) {
    translated = translateDynamicPattern(sourceText, targetLang) || translated;
  }

  if (translated && translated !== raw) {
    translatedNodes.add(textNode);
    textNode.nodeValue = translated;
  }
}

const TRANSLATED_ATTRS = ["placeholder", "title", "aria-label"] as const;
const ATTR_SELECTOR = "[placeholder], [title], [aria-label]";
// data-* key holding each attribute's English source, e.g. aria-label -> fwOrigAriaLabel
const origKey = (attr: string) => "fwOrig" + attr.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());

function translateString(text: string, targetLang: Language): string {
  let translated = targetLang === "hi" ? translateDynamicEnglishToHindi(text) : translateDynamicEnglishToKannada(text);
  if (!translated || translated === text) translated = translateDynamicPattern(text, targetLang) || text;
  return translated;
}

function translateAttributes(el: HTMLElement, targetLang: Language) {
  if (shouldSkipElement(el)) return;
  for (const attr of TRANSLATED_ATTRS) {
    const value = el.getAttribute(attr);
    if (!value || !value.trim()) continue;
    const key = origKey(attr);
    // Fresh English from React replaces the cached source
    if (!isIndianScript(value)) el.dataset[key] = value;
    const source = getSourceEnglish(value, el.dataset[key]);
    const translated = translateString(source, targetLang);
    if (translated !== value) el.setAttribute(attr, translated);
  }
}

function restoreAttributes(root: HTMLElement) {
  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>(ATTR_SELECTOR))];
  for (const el of elements) {
    for (const attr of TRANSLATED_ATTRS) {
      const value = el.getAttribute?.(attr);
      if (!value) continue;
      const orig = el.dataset?.[origKey(attr)];
      if (orig && !isIndianScript(orig)) {
        if (value !== orig) el.setAttribute(attr, orig);
      } else if (isDevanagari(value)) {
        el.setAttribute(attr, translateHindiToEnglish(value));
      } else if (isKannada(value)) {
        el.setAttribute(attr, translateKannadaToEnglish(value));
      }
    }
  }
}

function translateTree(root: HTMLElement | Node, targetLang: Language) {
  if (!root) return;

  if (root.nodeType === Node.ELEMENT_NODE && shouldSkipElement(root as HTMLElement)) {
    return;
  }

  // Translate placeholders, tooltips and accessibility labels on the root and every descendant
  if (root.nodeType === Node.ELEMENT_NODE) {
    const el = root as HTMLElement;
    translateAttributes(el, targetLang);
    el.querySelectorAll<HTMLElement>(ATTR_SELECTOR).forEach((child) => translateAttributes(child, targetLang));
  }

  // Walk text nodes
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const p = node.parentElement;
      if (p && shouldSkipElement(p)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let currentNode: Node | null = walker.nextNode();
  while (currentNode) {
    translateTextNode(currentNode as Text, targetLang);
    currentNode = walker.nextNode();
  }
}

function restoreEnglish(root: HTMLElement) {
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let currentNode: Node | null = walker.nextNode();
  while (currentNode) {
    const currentVal = currentNode.nodeValue || "";
    const orig = (currentNode as TranslatableNode).__fw_orig;

    if (orig && typeof orig === "string" && !isIndianScript(orig)) {
      if (currentVal !== orig) {
        currentNode.nodeValue = orig;
      }
    } else if (isDevanagari(currentVal)) {
      const englishRestored = translateHindiToEnglish(currentVal);
      if (englishRestored && englishRestored !== currentVal) {
        currentNode.nodeValue = englishRestored;
        (currentNode as TranslatableNode).__fw_orig = englishRestored;
      }
    } else if (isKannada(currentVal)) {
      const englishRestored = translateKannadaToEnglish(currentVal);
      if (englishRestored && englishRestored !== currentVal) {
        currentNode.nodeValue = englishRestored;
        (currentNode as TranslatableNode).__fw_orig = englishRestored;
      }
    }
    currentNode = walker.nextNode();
  }

  restoreAttributes(root);
}

/**
 * Headless component mounted inside LanguageProvider
 */
export default function DomAutoTranslator() {
  useDomAutoTranslator();
  return null;
}
