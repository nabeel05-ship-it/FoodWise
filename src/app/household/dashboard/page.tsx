"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { DonationItem } from "@/lib/types";
import DonationCard from "@/components/common/DonationCard";
import DonationDetailsModal from "@/components/common/DonationDetailsModal";
import {
  Home,
  PlusCircle,
  PackageCheck,
  CheckCircle2,
  Users,
  Clock,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function HouseholdDashboard() {
  const { donations, activeDonor } = useApp();
  const { t } = useLang();
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);

  // Filter household donations
  const myDonations = donations.filter(
    (d) =>
      d.donorId === activeDonor.id ||
      d.donorType === "Household" ||
      d.donorName === activeDonor.name
  );

  const activeDonations = myDonations.filter(
    (d) => d.status === "AVAILABLE" || d.status === "ACCEPTED" || d.status === "PICKUP"
  );

  const completedDonations = myDonations.filter((d) => d.status === "COMPLETED");

  const totalKg = myDonations
    .filter((d) => d.status !== "CANCELLED")
    .reduce((acc, curr) => acc + (curr.quantityKg || 0), 0);

  const totalServings = myDonations
    .filter((d) => d.status !== "CANCELLED")
    .reduce((acc, curr) => acc + (curr.servings || Math.round((curr.quantityKg || 2) * 3)), 0);

  return (
    <div className="space-y-6">
      {/* ═══ HOUSEHOLD HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              {t("household.donor")}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">{activeDonor.city || "New Delhi"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950">
            {t("household.title")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t("common.welcome_back")}, <strong>{activeDonor.name}</strong> • {t("household.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/household/donate"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md shadow-emerald-950/20 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
            style={{ background: "#164A31" }}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>{t("household.donate_btn")}</span>
          </Link>
        </div>
      </div>

      {/* ═══ 4 LIGHTWEIGHT KPI CARDS ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("dash.active_donations")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1 font-mono">
            {activeDonations.length}
          </div>
          <span className="text-[11px] text-gray-500 font-medium mt-1 block">
            {t("dash.available_scheduled")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("dash.completed_rescues")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 font-mono">
            {completedDonations.length}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {t("dash.collected_volunteers")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("dash.food_donated")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1 font-mono">
            {totalKg} <span className="text-xs font-semibold text-gray-500">{t("common.kg")}</span>
          </div>
          <span className="text-[11px] text-gray-500 font-medium mt-1 block">
            {t("dash.surplus_saved")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("dash.people_helped")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1 font-mono">
            {totalServings}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {t("dash.nutritious_portions")}
          </span>
        </div>
      </div>

      {/* ═══ ACTIVE DONATIONS SECTION ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-700" />
              <span>{t("household.my_active_donations")}</span>
            </h2>
            <Link
              href="/household/donations"
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold inline-flex items-center gap-1"
            >
              <span>{t("common.view_all")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeDonations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDonations.map((item) => (
                <DonationCard
                  key={item.id}
                  donation={item}
                  userRole="HOUSEHOLD"
                  onViewDetails={setSelectedDonation}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-950">
                {t("household.no_donations")}
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                {t("household.no_donations_desc")}
              </p>
              <div className="pt-2">
                <Link
                  href="/household/donate"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:brightness-110"
                  style={{ background: "#164A31" }}
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t("household.donate_food")}</span>
                </Link>
              </div>
            </div>
          )}

          {/* Past Donations (if any) */}
          {completedDonations.length > 0 && (
            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{t("household.recent_completed")}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedDonations.slice(0, 2).map((item) => (
                  <DonationCard
                    key={item.id}
                    donation={item}
                    userRole="HOUSEHOLD"
                    onViewDetails={setSelectedDonation}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ═══ RIGHT COLUMN: HOUSEHOLD TIPS ═══ */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E8ECF3] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>{t("household.safety_checklist")}</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>{t("household.safety_1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>{t("household.safety_2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>{t("household.safety_3")}</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200/70 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>{t("household.how_it_works")}</span>
            </div>
            <div className="space-y-2.5 text-xs text-gray-700">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-950 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                <span>{t("household.step_1")}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-950 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                <span>{t("household.step_2")}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-950 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                <span>{t("household.step_3")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          isOpen={!!selectedDonation}
          onClose={() => setSelectedDonation(null)}
        />
      )}
    </div>
  );
}
