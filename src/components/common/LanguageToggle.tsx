"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { useLang, type Language } from "@/context/LanguageContext";

interface LanguageToggleProps {
  /** Smaller trigger for tight spaces such as the sidebar and headers */
  compact?: boolean;
  /** "dark" for green surfaces (sidebar, public header), "light" for white cards */
  tone?: "dark" | "light";
  className?: string;
}

const OPTIONS: { code: Language; native: string; english: string; badge: string }[] = [
  { code: "en", native: "English", english: "English", badge: "EN" },
  { code: "hi", native: "हिंदी", english: "Hindi", badge: "हि" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", badge: "ಕ" },
];

// Height of the open menu; used to decide whether it fits below the trigger
const MENU_HEIGHT = 150;

export default function LanguageToggle({ compact = false, tone = "dark", className = "" }: LanguageToggleProps) {
  const { lang, setLang } = useLang();
  const dark = tone === "dark";
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  const current = OPTIONS.find((o) => o.code === lang) ?? OPTIONS[0];

  const openMenu = (index = OPTIONS.findIndex((o) => o.code === lang)) => {
    const rect = triggerRef.current?.getBoundingClientRect();
    setOpenUp(!!rect && window.innerHeight - rect.bottom < MENU_HEIGHT + 12 && rect.top > MENU_HEIGHT);
    setFocusIndex(Math.max(0, index));
    setOpen(true);
  };

  const choose = (code: Language) => {
    setLang(code);
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Move focus to the highlighted option while the menu is open
  useEffect(() => {
    if (open) optionRefs.current[focusIndex]?.focus();
  }, [open, focusIndex]);

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openMenu();
    }
  };

  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusIndex((i) => (i + 1) % OPTIONS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusIndex((i) => (i - 1 + OPTIONS.length) % OPTIONS.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setFocusIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setFocusIndex(OPTIONS.length - 1);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} data-no-translate="true" className={`relative inline-flex select-none ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onTriggerKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Language: ${current.english}. Choose language`}
        title="Choose language"
        className={`group inline-flex w-full items-center gap-2 rounded-xl ring-1 ring-inset font-bold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 ${
          compact ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-xs"
        } ${
          dark
            ? "bg-white/[0.06] ring-white/10 text-emerald-50 hover:bg-white/[0.1] focus-visible:outline-emerald-300"
            : "bg-white ring-black/[0.08] text-gray-800 hover:bg-gray-50 shadow-xs focus-visible:outline-emerald-700"
        }`}
      >
        <Languages className={`w-3.5 h-3.5 shrink-0 ${dark ? "text-emerald-300/85" : "text-emerald-700"}`} aria-hidden="true" />
        <span lang={current.code} className="truncate">{current.native}</span>
        <ChevronDown
          aria-hidden="true"
          className={`w-3.5 h-3.5 ml-auto shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${
            dark ? "text-emerald-200/70" : "text-gray-400"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="listbox"
            aria-label="Choose language"
            onKeyDown={onMenuKey}
            initial={{ opacity: 0, y: openUp ? 6 : -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUp ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: openUp ? "bottom" : "top" }}
            className={`absolute z-[80] min-w-[11rem] w-full p-1 rounded-xl bg-white text-gray-800 shadow-xl shadow-black/15 ring-1 ring-black/[0.07] ${
              openUp ? "bottom-full mb-1.5" : "top-full mt-1.5"
            } ${className.includes("w-full") ? "left-0" : "right-0"}`}
          >
            {OPTIONS.map((opt, i) => {
              const active = opt.code === lang;
              return (
                <button
                  key={opt.code}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={active}
                  data-lang-option={opt.code}
                  onClick={() => choose(opt.code)}
                  onMouseEnter={() => setFocusIndex(i)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer outline-none ${
                    active ? "bg-emerald-50 text-emerald-900" : "hover:bg-gray-50 focus:bg-gray-50"
                  }`}
                >
                  <span
                    lang={opt.code}
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                      active ? "bg-[#164A31] text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {opt.badge}
                  </span>
                  <span className="flex flex-col leading-tight min-w-0">
                    <span lang={opt.code} className="font-bold truncate">{opt.native}</span>
                    {opt.code !== "en" && <span className="text-[10px] text-gray-500">{opt.english}</span>}
                  </span>
                  {active && <Check className="w-3.5 h-3.5 ml-auto text-emerald-700 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
