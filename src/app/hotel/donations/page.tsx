"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { DonationItem } from "@/lib/types";
import DonationCard from "@/components/common/DonationCard";
import DonationDetailsModal from "@/components/common/DonationDetailsModal";
import { downloadDonationImpactReportPdf, downloadDonationRecordPdf } from "@/lib/pdfGenerator";
import {
  Hotel,
  PlusCircle,
  Search,
  Download,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export default function HotelDonationsPage() {
  const router = useRouter();
  const { donations, activeDonor, completeDonation, cancelDonation } = useApp();
  const { t } = useLang();

  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "AVAILABLE" | "ACCEPTED" | "COMPLETED" | "FLAGGED_FOR_REVIEW"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);

  // Filter donations for commercial kitchen domain (Hotel + Restaurant)
  const commercialDonations = donations.filter(
    (d) =>
      d.donorId === activeDonor.id ||
      d.donorType === "Hotel" ||
      d.donorType === "Restaurant"
  );

  const filtered = commercialDonations.filter((item) => {
    const matchesFilter =
      filterStatus === "ALL" ||
      item.status === filterStatus ||
      (filterStatus === "ACCEPTED" && (item.status === "ACCEPTED" || item.status === "PICKUP")) ||
      (filterStatus === "FLAGGED_FOR_REVIEW" && (item.status === "FLAGGED_FOR_REVIEW" || Boolean(item.qualityFlag)));

    const matchesSearch =
      item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.acceptedBy || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.foodCategory || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleDonateAgain = (item: DonationItem) => {
    const query = new URLSearchParams({
      repeatFood: item.foodName,
      repeatCategory: item.foodCategory || "Banquet / Event Surplus",
      repeatKg: String(item.quantityKg || 25),
      repeatServings: String(item.servings || 80),
      repeatDiet: item.diet || "Vegetarian",
    }).toString();
    router.push(`/hotel/donate?${query}`);
  };

  const handleExportAllPdf = () => {
    const totalKg = commercialDonations
      .filter((d) => d.status !== "CANCELLED")
      .reduce((acc, curr) => acc + (curr.quantityKg || 0), 0);
    const totalServings = commercialDonations
      .filter((d) => d.status === "COMPLETED")
      .reduce((acc, curr) => acc + (curr.servings || 0), 0);
    const completedCount = commercialDonations.filter((d) => d.status === "COMPLETED").length;

    downloadDonationImpactReportPdf({
      organizationName: activeDonor.name,
      role: "Restaurant / Hotel",
      totalKg,
      totalServings,
      completedCount,
      period: "Current Operational Record",
      donationsList: commercialDonations.map((d) => ({
        date: typeof d.createdAt === "string" ? d.createdAt : new Date(d.createdAt).toLocaleDateString(),
        donorName: activeDonor.name,
        foodName: d.foodName,
        category: d.foodCategory,
        quantityKg: d.quantityKg,
        servings: d.servings,
        status: d.status,
      })),
    });
  };

  const flaggedCount = commercialDonations.filter(
    (d) => d.status === "FLAGGED_FOR_REVIEW" || Boolean(d.qualityFlag)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
              <Hotel className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t("Restaurant / Hotel Portal")}</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">{activeDonor.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
            {t("Restaurant & Hotel Food Donations")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t("Comprehensive register of commercial banquet, buffet, and restaurant surplus batches distributed to verified NGOs.")}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportAllPdf}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t("Export Ledger (PDF)")}</span>
          </button>

          <Link
            href="/hotel/donate"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md shadow-emerald-950/20 hover:brightness-110 active:scale-95 cursor-pointer"
            style={{ background: "#164A31" }}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>{t("+ Post New Surplus Batch")}</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "ALL", label: `${t("All")} (${commercialDonations.length})` },
            { id: "AVAILABLE", label: `${t("Available")} (${commercialDonations.filter((d) => d.status === "AVAILABLE").length})` },
            {
              id: "ACCEPTED",
              label: `${t("Accepted by NGO")} (${commercialDonations.filter((d) => d.status === "ACCEPTED" || d.status === "PICKUP").length})`,
            },
            { id: "COMPLETED", label: `${t("Completed")} (${commercialDonations.filter((d) => d.status === "COMPLETED").length})` },
            {
              id: "FLAGGED_FOR_REVIEW",
              label: `${t("Flagged for Review")} (${flaggedCount})`,
            },
          ].map((tab) => {
            const isTabActive = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isTabActive
                    ? "bg-white text-emerald-950 shadow-xs font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Search by food, menu, or NGO...")}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Grid of cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
          <Hotel className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-800">{t("No commercial donations found")}</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? t("No food donations matched your search filter.")
              : t("Post banquet, restaurant, or buffet surplus to start distributing to community relief partners.")}
          </p>
          <div className="mt-4">
            <Link
              href="/hotel/donate"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t("Post Surplus Food")}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <DonationCard
              key={item.id}
              donation={item}
              userRole="HOTEL"
              onViewDetails={(d) => setSelectedDonation(d)}
              onCompleteHandover={(d) => completeDonation(d.id)}
              onDonateAgain={(d) => handleDonateAgain(d)}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          userRole="HOTEL"
          onClose={() => setSelectedDonation(null)}
          onCancelDonation={(id) => cancelDonation(id)}
          onCompleteDonation={(id) => completeDonation(id)}
        />
      )}
    </div>
  );
}
