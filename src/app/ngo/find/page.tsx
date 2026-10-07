"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { DonationItem, DonorType } from "@/lib/types";
import DonationCard from "@/components/common/DonationCard";
import DonationDetailsModal from "@/components/common/DonationDetailsModal";
import ClaimDonationModal from "@/components/common/ClaimDonationModal";
import { useLang } from "@/context/LanguageContext";
import {
  PackageCheck,
  Search,
  Filter,
  MapPin,
  Utensils,
  Hotel,
  Home,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function NgoFindFoodPage() {
  const { donations, activeNgo } = useApp();
  const { t } = useLang();
  const [searchQuery, setSearchQuery] = useState("");
  const [donorFilter, setDonorFilter] = useState<string>("ALL");
  const [dietFilter, setDietFilter] = useState<string>("ALL");

  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [claimingDonation, setClaimingDonation] = useState<DonationItem | null>(null);
  const [successClaim, setSuccessClaim] = useState<DonationItem | null>(null);

  // Available donations
  const availableDonations = donations.filter((d) => d.status === "AVAILABLE");

  // Filtered donations
  const filteredDonations = availableDonations.filter((d) => {
    // Search query
    const matchSearch =
      !searchQuery.trim() ||
      d.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.foodCategory.toLowerCase().includes(searchQuery.toLowerCase());

    // Donor Type
    const matchDonor =
      donorFilter === "ALL" ||
      d.donorType?.toLowerCase() === donorFilter.toLowerCase();

    // Dietary
    const matchDiet =
      dietFilter === "ALL" ||
      d.diet?.toLowerCase() === dietFilter.toLowerCase();

    return matchSearch && matchDonor && matchDiet;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {t("Surplus Discovery Feed")}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">{activeNgo?.city || "New Delhi NCR"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950">
            {t("Find Surplus Food")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t("Discover available food donations near your relief organization. Request immediately before pickup deadlines.")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/ngo/requests"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
          >
            {t("My Active Requests")}
          </Link>
          <Link
            href="/ngo/accepted"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all hover:brightness-110 cursor-pointer"
            style={{ background: "#164A31" }}
          >
            {t("In-Transit Pickups")}
          </Link>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successClaim && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong>{t("Food Request Placed!")}</strong> {t("You claimed")}{" "}
              <span className="font-bold underline">{successClaim.foodName}</span> {t("from")}{" "}
              {successClaim.donorName}. {t(". A volunteer driver has been scheduled.")}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-emerald-300 text-emerald-800 font-bold">
              OTP: {successClaim.otp}
            </span>
            <Link
              href="/ngo/accepted"
              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px]"
            >
              {t("Track Pickup →")}
            </Link>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E8ECF3] p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("Search food name, dish, restaurant, hotel, or neighborhood...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 placeholder:text-gray-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Donor Type */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1">
              {t("Donor:")}
            </span>
            {[
              { id: "ALL", label: t("All Donors") },
              { id: "restaurant", label: t("Restaurants"), icon: Utensils },
              { id: "hotel", label: t("Hotels & Banquets"), icon: Hotel },
              { id: "household", label: t("Households"), icon: Home },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setDonorFilter(btn.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  donorFilter === btn.id
                    ? "bg-[#164A31] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {btn.icon && <btn.icon className="w-3 h-3" />}
                <span>{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Diet Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1">
              {t("Diet:")}
            </span>
            {[
              { id: "ALL", label: t("All") },
              { id: "vegetarian", label: t("Vegetarian") },
              { id: "non-vegetarian", label: t("Non-Veg") },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setDietFilter(btn.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  dietFilter === btn.id
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            {t("Showing")} {filteredDonations.length} {t("available donations near you")}
          </span>
        </div>

        {filteredDonations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDonations.map((item) => (
              <DonationCard
                key={item.id}
                donation={item}
                userRole="NGO"
                onViewDetails={setSelectedDonation}
                onRequestFood={(d: DonationItem) => setClaimingDonation(d)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-3">
            <PackageCheck className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-gray-950">
              {t("No food donations available nearby right now.")}
            </h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              {t("Try again later or expand your search criteria. New food donations from restaurants, hotels, and households appear throughout the day.")}
            </p>
            {(searchQuery || donorFilter !== "ALL" || dietFilter !== "ALL") && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setDonorFilter("ALL");
                    setDietFilter("ALL");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                >
                  {t("Clear Filters")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Claim Modal */}
      {claimingDonation && (
        <ClaimDonationModal
          donation={claimingDonation}
          isOpen={!!claimingDonation}
          onClose={() => setClaimingDonation(null)}
          onSuccess={(claimed: DonationItem) => {
            setClaimingDonation(null);
            setSuccessClaim(claimed);
          }}
        />
      )}

      {/* Details Modal */}
      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          isOpen={!!selectedDonation}
          onClose={() => setSelectedDonation(null)}
          onRequestFood={(d: DonationItem) => {
            setSelectedDonation(null);
            setClaimingDonation(d);
          }}
        />
      )}
    </div>
  );
}
