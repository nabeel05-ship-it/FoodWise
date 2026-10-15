"use client";

import React from "react";
import { motion } from "motion/react";
import { Languages } from "lucide-react";
import { useLang, type Language } from "@/context/LanguageContext";

interface LanguageToggleProps {
  /** Short labels (EN / हिं / ಕನ್) for tight spaces such as the sidebar */
  compact?: boolean;
  /** "dark" for green surfaces (sidebar, public header), "light" for white cards */
  tone?: "dark" | "light";
  className?: string;
}

const OPTIONS: { code: Language; short: string; full: string; title: string }[] = [
  { code: "en", short: "EN", full: "English", title: "Switch to English" },
  { code: "hi", short: "हिं", full: "हिंदी", title: "हिंदी में बदलें (Switch to Hindi)" },
  { code: "kn", short: "ಕನ್", full: "ಕನ್ನಡ", title: "ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ (Switch to Kannada)" },
];

export default function LanguageToggle({ compact = false, tone = "dark", className = "" }: LanguageToggleProps) {
  const { lang, setLang } = useLang();
  const dark = tone === "dark";
  // Unique per tone/size so multiple toggles on one page animate independently
  const indicatorId = `lang-indicator-${tone}-${compact ? "c" : "f"}`;

  return (
    <div
      role="group"
      aria-label="Language"
      data-no-translate="true"
      className={`inline-flex items-center gap-0.5 p-0.5 rounded-xl select-none ring-1 ring-inset ${
        dark ? "bg-white/[0.06] ring-white/10" : "bg-[#F1F3F2] ring-black/[0.06]"
      } ${className}`}
    >
      {!compact && (
        <Languages className={`w-3.5 h-3.5 mx-1.5 shrink-0 ${dark ? "text-emerald-300/80" : "text-gray-400"}`} aria-hidden="true" />
      )}
      {OPTIONS.map((opt) => {
        const active = lang === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLang(opt.code)}
            aria-pressed={active}
            title={opt.title}
            lang={opt.code}
            className={`relative px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
              active
                ? dark
                  ? "text-emerald-950"
                  : "text-white"
                : dark
                ? "text-emerald-100/75 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {active && (
              <motion.span
                layoutId={indicatorId}
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
                className={`absolute inset-0 rounded-lg -z-0 ${
                  dark ? "bg-emerald-300 shadow-sm" : "bg-[#164A31] shadow-sm"
                }`}
              />
            )}
            <span className="relative">{compact ? opt.short : opt.full}</span>
          </button>
        );
      })}
    </div>
  );
}
