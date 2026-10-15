"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useAnimationControls } from "motion/react";
import { KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";

interface HandoverCodeFormProps {
  donationId: string;
  /** Called after the code is verified (status moves ACCEPTED → PICKUP) */
  onVerified?: () => void;
  className?: string;
}

/**
 * Donor-side pickup check: the volunteer shows the 4-digit code issued when the NGO
 * claimed the donation, and the donor enters it here to release the food.
 */
export default function HandoverCodeForm({ donationId, onVerified, className = "" }: HandoverCodeFormProps) {
  const { verifyHandover } = useApp();
  const { t } = useLang();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const shake = useAnimationControls();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = verifyHandover(donationId, code);
    if (result.ok) {
      setError(null);
      setVerified(true);
      onVerified?.();
      return;
    }
    setError(result.error);
    shake.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } });
  };

  if (verified) {
    return (
      <div
        role="status"
        className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 animate-success-in ${className}`}
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-check-pop" />
        <span>{t("handover.verified")}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-1.5 ${className}`} noValidate>
      <label htmlFor={`handover-${donationId}`} className="block text-[10px] uppercase font-bold tracking-wider text-gray-500">
        {t("handover.enter_code")}
      </label>
      <div className="flex items-center gap-2">
        <motion.div animate={shake} className="relative">
          <KeyRound className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            id={`handover-${donationId}`}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{4}"
            maxLength={4}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, "").slice(0, 4));
              setError(null);
            }}
            placeholder="••••"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `handover-${donationId}-error` : undefined}
            className={`w-28 pl-8 pr-2 py-2 rounded-xl border bg-white font-mono text-base font-bold tracking-[0.35em] text-gray-950 outline-none transition-colors focus:ring-4 ${
              error
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                : "border-gray-200 hover:border-gray-300 focus:border-emerald-600 focus:ring-emerald-600/10"
            }`}
          />
        </motion.div>
        <button
          type="submit"
          disabled={code.length !== 4}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-white btn-brand cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
          <span>{t("handover.verify_button")}</span>
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`handover-${donationId}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-600"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
