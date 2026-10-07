"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { DonationItem } from "@/lib/types";
import DonationCard from "@/components/common/DonationCard";
import DonationDetailsModal from "@/components/common/DonationDetailsModal";
import {
  CheckCircle2,
  PackageCheck,
  Search,
  Users,
  Sparkles,
  Calendar,
  Building2,
  Download,
} from "lucide-react";
import { downloadDonationImpactReportPdf } from "@/lib/pdfGenerator";

export default function NgoCompletedPage() {
  const { donations, activeNgo } = useApp();
  const { t } = useLang();
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const completedItems = donations.filter((d) => d.status === "COMPLETED");

  const filteredItems = completedItems.filter(
    (item) =>
      !searchTerm.trim() ||
      item.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalKg = completedItems.reduce((acc, curr) => acc + (curr.quantityKg || 0), 0);
  const totalServings = completedItems.reduce((acc, curr) => acc + (curr.servings || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t("Relief Distribution Logbook")}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">{activeNgo?.name || "Robin Hood Army"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950">
            {t("Completed Food Deliveries")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t("Historical audit log of verified food rescues delivered to local shelters and hunger relief centers.")}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              downloadDonationImpactReportPdf({
                period: "October 2026",
                organizationName: activeNgo?.name || "Robin Hood Army (Delhi Chapter)",
                role: "Relief NGO Partner",
                totalKg,
                totalServings,
                completedCount: completedItems.length,
                donationsList: completedItems.map((d) => ({
                  date: "07 Oct 2026",
                  donorName: d.donorName,
                  foodName: d.foodName,
                  category: d.foodCategory,
                  quantityKg: d.quantityKg,
                  servings: d.servings || Math.round(d.quantityKg * 3),
                  status: "Delivered",
                })),
              });
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-emerald-950 font-bold text-xs bg-white border border-emerald-200 transition-all shadow-2xs hover:bg-emerald-50 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>{t("common.export_report")}</span>
          </button>

          <Link
            href="/ngo/find"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer hover:brightness-110"
            style={{ background: "#164A31" }}
          >
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>{t("Find Available Food")}</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("Completed Rescues")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1 font-mono">
            {completedItems.length}
          </div>
          <span className="text-[11px] text-gray-500 font-medium mt-1 block">
            {t("Verified food shipments")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("Surplus Diverted")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1 font-mono">
            {totalKg} <span className="text-xs font-semibold text-gray-500">kg</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {t("Safely fed to community")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("Beneficiaries Reached")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1 font-mono">
            {totalServings}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {t("Meals served at shelters")}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-[#E8ECF3] p-3.5 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("Search completed deliveries by food item, donor, or location...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-gray-900 text-xs focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* List */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <DonationCard
              key={item.id}
              donation={item}
              userRole="NGO"
              onViewDetails={setSelectedDonation}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-950">
            {t("No completed food deliveries recorded yet.")}
          </h3>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            {t("Once you accept donations and complete OTP handovers with donors, your delivery receipts will be logged here.")}
          </p>
        </div>
      )}

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
