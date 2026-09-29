"use client";

import { useEffect } from "react";
import { useLang } from "./LanguageContext";
import {
  translateDynamicEnglishToHindi,
  translateHindiToEnglish,
  isDevanagari,
} from "./dictionary";

// Tracks translated nodes in current session
let translatedNodes = new WeakSet<Node>();

export function useDomAutoTranslator() {
  const { lang } = useLang();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (lang === "en") {
      // Restore all text nodes to their English original
      const doRestore = () => {
        restoreEnglish(document.body);
        translatedNodes = new WeakSet<Node>();
      };

      doRestore();
      const rafId = requestAnimationFrame(doRestore);
      const timerId = setTimeout(doRestore, 80);

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timerId);
      };
    }

    if (lang === "hi") {
      // Translate all text nodes in the DOM after React finishes its commit
      const doTranslate = () => {
        translateTree(document.body);
      };

      doTranslate();
      const rafId = requestAnimationFrame(doTranslate);
      const timerId = setTimeout(doTranslate, 80);

      // Observe only childList (for newly opened modals, dropdowns, and tabs)
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            for (const addedNode of Array.from(mutation.addedNodes)) {
              if (addedNode.nodeType === Node.ELEMENT_NODE) {
                translateTree(addedNode as HTMLElement);
              } else if (addedNode.nodeType === Node.TEXT_NODE) {
                translateTextNode(addedNode as Text);
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

function translateTextNode(textNode: Text) {
  if (translatedNodes.has(textNode)) return;

  const raw = textNode.nodeValue;
  if (!raw || !raw.trim()) return;

  // Don't translate pure numbers or short symbols
  if (/^[0-9\s.,:%°/\\()\-–—+]+$/.test(raw)) return;

  // Check parent
  const parent = textNode.parentElement;
  if (parent && shouldSkipElement(parent)) return;

  // CRITICAL: Only store as English original if it doesn't contain Devanagari/Hindi characters!
  if ((textNode as any).__fw_orig === undefined && !isDevanagari(raw)) {
    (textNode as any).__fw_orig = raw;
  }

  // If already Hindi and we don't have English original, reverse-translate to get English base
  const sourceText =
    (textNode as any).__fw_orig ||
    (!isDevanagari(raw) ? raw : translateHindiToEnglish(raw));

  const translated = translateDynamicEnglishToHindi(sourceText);

  if (translated && translated !== raw) {
    translatedNodes.add(textNode);
    textNode.nodeValue = translated;
  }
}

function translateTree(root: HTMLElement | Node) {
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
        if (!input.dataset.fwOrigPlaceholder && !isDevanagari(input.placeholder)) {
          input.dataset.fwOrigPlaceholder = input.placeholder;
        }
        const sourcePlaceholder =
          input.dataset.fwOrigPlaceholder ||
          (!isDevanagari(input.placeholder)
            ? input.placeholder
            : translateHindiToEnglish(input.placeholder));
        input.placeholder = translateDynamicEnglishToHindi(sourcePlaceholder);
      }
    }

    if (el.title && el.title.trim()) {
      if (!el.dataset.fwOrigTitle && !isDevanagari(el.title)) {
        el.dataset.fwOrigTitle = el.title;
      }
      const sourceTitle =
        el.dataset.fwOrigTitle ||
        (!isDevanagari(el.title) ? el.title : translateHindiToEnglish(el.title));
      el.title = translateDynamicEnglishToHindi(sourceTitle);
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
    translateTextNode(currentNode as Text);
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

    // 1. If we have a verified English original, restore it
    if (orig && typeof orig === "string" && !isDevanagari(orig)) {
      if (currentVal !== orig) {
        currentNode.nodeValue = orig;
      }
    } else if (isDevanagari(currentVal)) {
      // 2. If the current text is in Hindi/Devanagari, reverse-translate it to English!
      const englishRestored = translateHindiToEnglish(currentVal);
      if (englishRestored && englishRestored !== currentVal) {
        currentNode.nodeValue = englishRestored;
        (currentNode as any).__fw_orig = englishRestored;
      }
    }
    currentNode = walker.nextNode();
  }

  // Restore placeholders
  const inputs = root.querySelectorAll<HTMLInputElement>(
    "input, textarea"
  );
  inputs.forEach((input) => {
    if (input.dataset.fwOrigPlaceholder && !isDevanagari(input.dataset.fwOrigPlaceholder)) {
      input.placeholder = input.dataset.fwOrigPlaceholder;
    } else if (isDevanagari(input.placeholder)) {
      input.placeholder = translateHindiToEnglish(input.placeholder);
    }
  });

  // Restore titles
  const elementsWithTitle = root.querySelectorAll<HTMLElement>("[title]");
  elementsWithTitle.forEach((el) => {
    if (el.dataset.fwOrigTitle && !isDevanagari(el.dataset.fwOrigTitle)) {
      el.title = el.dataset.fwOrigTitle;
    } else if (isDevanagari(el.title)) {
      el.title = translateHindiToEnglish(el.title);
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
