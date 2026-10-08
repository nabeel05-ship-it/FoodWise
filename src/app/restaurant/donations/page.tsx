"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { DonationItem } from "@/lib/types";
import DonationCard from "@/components/common/DonationCard";
import DonationDetailsModal from "@/components/common/DonationDetailsModal";
import { Utensils, PlusCircle, Search } from "lucide-react";

export default function RestaurantDonationsPage() {
  const router = useRouter();
  const { donations, activeDonor, completeDonation, cancelDonation } = useApp();
  const { t } = useLang();

  const [filterStatus, setFilterStatus] = useState<"ALL" | "AVAILABLE" | "ACCEPTED" | "COMPLETED" | "FLAGGED_FOR_REVIEW">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);

  // Filter for this restaurant
  const myDonations = donations.filter(
    (d) => d.donorId === activeDonor.id || d.donorType === "Restaurant"
  );

  const filtered = myDonations.filter((item) => {
    const matchesFilter =
      filterStatus === "ALL" ||
      item.status === filterStatus ||
      (filterStatus === "ACCEPTED" && (item.status === "ACCEPTED" || item.status === "PICKUP")) ||
      (filterStatus === "FLAGGED_FOR_REVIEW" && (item.status === "FLAGGED_FOR_REVIEW" || Boolean(item.qualityFlag)));

    const matchesSearch =
      item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.acceptedBy || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleDonateAgain = (item: DonationItem) => {
    const query = new URLSearchParams({
      repeatFood: item.foodName,
      repeatCategory: item.foodCategory || "Cooked Meals",
      repeatKg: String(item.quantityKg || 10),
      repeatServings: String(item.servings || 40),
      repeatDiet: item.diet || "Vegetarian",
    }).toString();
    router.push(`/restaurant/donate?${query}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5" />
              {t("Restaurant Portal")}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">{activeDonor.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
            {t("My Donations")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t("Track your surplus food listings, NGO claims, and distribution history.")}
          </p>
        </div>

        <Link
          href="/restaurant/donate"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md shadow-emerald-950/20 hover:brightness-110 active:scale-95"
          style={{ background: "#164A31" }}
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>{t("+ Post New Donation")}</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "ALL", label: `${t("All")} (${myDonations.length})` },
            { id: "AVAILABLE", label: t("Available") },
            { id: "ACCEPTED", label: t("Accepted by NGO") },
            { id: "COMPLETED", label: t("Completed") },
            {
              id: "FLAGGED_FOR_REVIEW",
              label: `Flagged for Review (${myDonations.filter((d) => d.status === "FLAGGED_FOR_REVIEW" || Boolean(d.qualityFlag)).length})`,
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

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Search donations...")}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid of cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
          <Utensils className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-800">{t("No donations found")}</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? t("No food donations matched your search filter.")
              : t("You do not have any donations in this category yet.")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <DonationCard
              key={item.id}
              donation={item}
              userRole="RESTAURANT"
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
          userRole="RESTAURANT"
          onClose={() => setSelectedDonation(null)}
          onCancelDonation={(id) => cancelDonation(id)}
          onCompleteDonation={(id) => completeDonation(id)}
        />
      )}
    </div>
  );
}
