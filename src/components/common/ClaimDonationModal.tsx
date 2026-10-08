"use client";

import React, { useState } from "react";
import { DonationItem } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { HeartHandshake, X, Truck, User, Phone, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { useLang } from "@/context/LanguageContext";
import * as motion from "motion/react-client";

export interface ClaimDonationModalProps {
  donation: DonationItem | null;
  isOpen?: boolean;
  activeNgoName?: string;
  onClose: () => void;
  onConfirmClaim?: (donationId: string, ngoName: string, driver: { name: string; phone: string }) => void;
  onSuccess?: (claimedItem: DonationItem) => void;
}

export default function ClaimDonationModal({
  donation,
  isOpen = true,
  activeNgoName,
  onClose,
  onConfirmClaim,
  onSuccess,
}: ClaimDonationModalProps) {
    const { t } = useLang();
  const { acceptDonation, activeNgo } = useApp();
  const [driverName, setDriverName] = useState("Rajesh Kumar (Volunteer)");
  const [driverPhone, setDriverPhone] = useState("+91 98765 23412");

  if (!donation || !isOpen) return null;

  const resolvedNgoName = activeNgoName || activeNgo?.name || "Robin Hood Army";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName || !driverPhone) {
      alert("Please enter the volunteer driver contact details.");
      return;
    }

    if (onConfirmClaim) {
      onConfirmClaim(donation.id, resolvedNgoName, {
        name: driverName,
        phone: driverPhone,
      });
    } else {
      acceptDonation(donation.id, resolvedNgoName, {
        name: driverName,
        phone: driverPhone,
      });
    }

    try {
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    } catch {}

    if (onSuccess) {
      onSuccess({
        ...donation,
        status: "ACCEPTED",
        acceptedBy: resolvedNgoName,
        driverName,
        driverPhone,
        otp: donation.otp || String(Math.floor(1000 + Math.random() * 9000)),
      });
    } else {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
        className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden p-6 sm:p-7 space-y-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-950 tracking-tight">
                {t("modal_claim.request_claim_food")}</h3>
              <p className="text-xs text-gray-500 font-medium">
                {t("modal_claim.dispatch_volunteer_d")}{donation.donorName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Donation Summary Card */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-200/80 space-y-1.5">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            {donation.donorType} {t("modal_claim.listing")}{donation.foodCategory}
          </div>
          <div className="text-base font-bold text-gray-900">{donation.foodName}</div>
          <div className="text-xs text-gray-600 font-medium">
            {t("modal_claim.quantity")}<strong>{donation.quantityKg} {t("modal_claim.kg")}</strong> ({donation.servings} {t("modal_claim.estimated_servings")}</div>
          <div className="text-xs text-gray-500">
            {t("modal_claim.pickup_location")}<strong>{donation.location}</strong>
          </div>
        </div>

        {/* Dispatch Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-500" />
              <span>{t("modal_claim.assigned_volunteer_d")}</span>
            </label>
            <input
              type="text"
              required
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder={t("modal_claim.e_g_ramesh_kumar")}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              <span>{t("modal_claim.driver_contact_mobil")}</span>
            </label>
            <input
              type="tel"
              required
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              placeholder="+91 98123 45678"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              {t("modal_claim.a_4_digit_handover_o")}</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {t("modal_claim.cancel")}</button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              style={{ background: "#164A31" }}
            >
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t("modal_claim.confirm_dispatch")}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
