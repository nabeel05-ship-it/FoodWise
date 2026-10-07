"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { DonationItem } from "@/lib/types";
import DonationCard from "@/components/common/DonationCard";
import DonationDetailsModal from "@/components/common/DonationDetailsModal";
import {
  PackageCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  Filter,
} from "lucide-react";

export default function HouseholdDonationsPage() {
  const { donations, activeDonor } = useApp();
  const { t } = useLang();
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);

  const householdDonations = donations.filter(
    (d) =>
      d.donorId === activeDonor.id ||
      d.donorType === "Household" ||
      d.donorName === activeDonor.name
  );

  const filteredItems = householdDonations.filter((d) => {
    if (filter === "ACTIVE") return d.status === "AVAILABLE" || d.status === "ACCEPTED" || d.status === "PICKUP";
    if (filter === "COMPLETED") return d.status === "COMPLETED";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-emerald-700" />
            <span>{t("My Food Donations")}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t("Keep track of all surplus meals you have shared with community relief organizations.")}
          </p>
        </div>

        <Link
          href="/household/donate"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-xs transition-all shadow-md active:scale-95 self-start sm:self-auto cursor-pointer hover:brightness-110"
          style={{ background: "#164A31" }}
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>{t("New Food Donation")}</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "ALL"
              ? "bg-[#164A31] text-white shadow-xs"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {t("All Donations")} ({householdDonations.length})
        </button>
        <button
          onClick={() => setFilter("ACTIVE")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "ACTIVE"
              ? "bg-[#164A31] text-white shadow-xs"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {t("Active / In Progress")} (
          {
            householdDonations.filter(
              (d) => d.status === "AVAILABLE" || d.status === "ACCEPTED" || d.status === "PICKUP"
            ).length
          }
          )
        </button>
        <button
          onClick={() => setFilter("COMPLETED")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "COMPLETED"
              ? "bg-[#164A31] text-white shadow-xs"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {t("Completed")} (
          {householdDonations.filter((d) => d.status === "COMPLETED").length})
        </button>
      </div>

      {/* List */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              userRole="HOUSEHOLD"
              onViewDetails={setSelectedDonation}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-3">
          <PackageCheck className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-950">
            {filter === "ALL"
              ? t("You haven't donated any food yet.")
              : t("No donations match this filter.")}
          </h3>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            {t("Whenever you have excess food from a family event or batch cooking, you can post it here in moments.")}
          </p>
          <div className="pt-2">
            <Link
              href="/household/donate"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer hover:brightness-110"
              style={{ background: "#164A31" }}
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t("nav.donate_food")}</span>
            </Link>
          </div>
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
