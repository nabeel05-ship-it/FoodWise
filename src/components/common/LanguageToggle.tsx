"use client";

import React from "react";
import { useLang } from "@/context/LanguageContext";
import { Languages } from "lucide-react";

interface LanguageToggleProps {
  compact?: boolean;
  className?: string;
}

export default function LanguageToggle({
  compact = false,
  className = "",
}: LanguageToggleProps) {
  const { lang, setLang } = useLang();

  if (compact) {
    return (
      <div
        className={`inline-flex items-center p-0.5 rounded-xl border bg-black/20 backdrop-blur-sm select-none shadow-xs ${className}`}
        style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}
      >
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            lang === "en"
              ? "bg-emerald-500 text-white shadow-sm font-extrabold"
              : "text-emerald-200/80 hover:text-white hover:bg-white/10"
          }`}
          title="Switch to English"
        >
          🇬🇧 EN
        </button>
        <button
          type="button"
          onClick={() => setLang("hi")}
          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            lang === "hi"
              ? "bg-emerald-500 text-white shadow-sm font-extrabold"
              : "text-emerald-200/80 hover:text-white hover:bg-white/10"
          }`}
          title="हिंदी में बदलें (Switch to Hindi)"
        >
          🇮🇳 हिं
        </button>
        <button
          type="button"
          onClick={() => setLang("kn")}
          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            lang === "kn"
              ? "bg-emerald-500 text-white shadow-sm font-extrabold"
              : "text-emerald-200/80 hover:text-white hover:bg-white/10"
          }`}
          title="ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ (Switch to Kannada)"
        >
          🇮🇳 ಕನ್
        </button>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-1 rounded-2xl border bg-white shadow-xs select-none ${className}`}
      style={{ borderColor: "#E8ECF3" }}
    >
      <div className="flex items-center gap-1 px-1.5 text-slate-400">
        <Languages className="w-3.5 h-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          lang === "en"
            ? "bg-emerald-500 text-white shadow-sm font-extrabold"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
      >
        🇬🇧 English
      </button>
      <button
        type="button"
        onClick={() => setLang("hi")}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          lang === "hi"
            ? "bg-emerald-500 text-white shadow-sm font-extrabold"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
      >
        🇮🇳 हिंदी
      </button>
      <button
        type="button"
        onClick={() => setLang("kn")}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          lang === "kn"
            ? "bg-emerald-500 text-white shadow-sm font-extrabold"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
      >
        🇮🇳 ಕನ್ನಡ
      </button>
    </div>
  );
}
