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
          if (mutation.type === "childList") {
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
        subtree: true,
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
  if (element.getAttribute("data-no-translate") === "true") {
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

function translateTextNode(textNode: Text, targetLang: Language) {
  if (translatedNodes.has(textNode)) return;

  const raw = textNode.nodeValue;
  if (!raw || !raw.trim()) return;

  // Don't translate pure numbers or short symbols
  if (/^[0-9\s.,:%°/\\()\-–—+*#@]+$/.test(raw)) return;

  // Check parent
  const parent = textNode.parentElement;
  if (parent && shouldSkipElement(parent)) return;

  // Cache original English if clean
  if ((textNode as any).__fw_orig === undefined && !isIndianScript(raw)) {
    (textNode as any).__fw_orig = raw;
  }

  const sourceText = getSourceEnglish(raw, (textNode as any).__fw_orig);

  let translated = "";
  if (targetLang === "hi") {
    translated = translateDynamicEnglishToHindi(sourceText);
  } else if (targetLang === "kn") {
    translated = translateDynamicEnglishToKannada(sourceText);
  }

  if (translated && translated !== raw) {
    translatedNodes.add(textNode);
    textNode.nodeValue = translated;
  }
}

function translateTree(root: HTMLElement | Node, targetLang: Language) {
  if (!root) return;

  if (root.nodeType === Node.ELEMENT_NODE && shouldSkipElement(root as HTMLElement)) {
    return;
  }

  // Translate placeholders and titles on inputs and elements
  if (root.nodeType === Node.ELEMENT_NODE) {
    const el = root as HTMLElement;
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      const input = el as HTMLInputElement;
      if (input.placeholder && input.placeholder.trim()) {
        if (!input.dataset.fwOrigPlaceholder && !isIndianScript(input.placeholder)) {
          input.dataset.fwOrigPlaceholder = input.placeholder;
        }
        const sourcePlaceholder = getSourceEnglish(
          input.placeholder,
          input.dataset.fwOrigPlaceholder
        );
        if (targetLang === "hi") {
          input.placeholder = translateDynamicEnglishToHindi(sourcePlaceholder);
        } else if (targetLang === "kn") {
          input.placeholder = translateDynamicEnglishToKannada(sourcePlaceholder);
        }
      }
    }

    if (el.title && el.title.trim()) {
      if (!el.dataset.fwOrigTitle && !isIndianScript(el.title)) {
        el.dataset.fwOrigTitle = el.title;
      }
      const sourceTitle = getSourceEnglish(el.title, el.dataset.fwOrigTitle);
      if (targetLang === "hi") {
        el.title = translateDynamicEnglishToHindi(sourceTitle);
      } else if (targetLang === "kn") {
        el.title = translateDynamicEnglishToKannada(sourceTitle);
      }
    }
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
    const orig = (currentNode as any).__fw_orig;

    if (orig && typeof orig === "string" && !isIndianScript(orig)) {
      if (currentVal !== orig) {
        currentNode.nodeValue = orig;
      }
    } else if (isDevanagari(currentVal)) {
      const englishRestored = translateHindiToEnglish(currentVal);
      if (englishRestored && englishRestored !== currentVal) {
        currentNode.nodeValue = englishRestored;
        (currentNode as any).__fw_orig = englishRestored;
      }
    } else if (isKannada(currentVal)) {
      const englishRestored = translateKannadaToEnglish(currentVal);
      if (englishRestored && englishRestored !== currentVal) {
        currentNode.nodeValue = englishRestored;
        (currentNode as any).__fw_orig = englishRestored;
      }
    }
    currentNode = walker.nextNode();
  }

  // Restore placeholders
  const inputs = root.querySelectorAll<HTMLInputElement>("input, textarea");
  inputs.forEach((input) => {
    if (input.dataset.fwOrigPlaceholder && !isIndianScript(input.dataset.fwOrigPlaceholder)) {
      input.placeholder = input.dataset.fwOrigPlaceholder;
    } else if (isDevanagari(input.placeholder)) {
      input.placeholder = translateHindiToEnglish(input.placeholder);
    } else if (isKannada(input.placeholder)) {
      input.placeholder = translateKannadaToEnglish(input.placeholder);
    }
  });

  // Restore titles
  const elementsWithTitle = root.querySelectorAll<HTMLElement>("[title]");
  elementsWithTitle.forEach((el) => {
    if (el.dataset.fwOrigTitle && !isIndianScript(el.dataset.fwOrigTitle)) {
      el.title = el.dataset.fwOrigTitle;
    } else if (isDevanagari(el.title)) {
      el.title = translateHindiToEnglish(el.title);
    } else if (isKannada(el.title)) {
      el.title = translateKannadaToEnglish(el.title);
    }
  });
}

/**
 * Headless component mounted inside LanguageProvider
 */
export default function DomAutoTranslator() {
  useDomAutoTranslator();
  return null;
}
