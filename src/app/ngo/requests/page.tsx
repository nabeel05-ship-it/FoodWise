"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { DonationItem } from "@/lib/types";
import DonationCard from "@/components/common/DonationCard";
import DonationDetailsModal from "@/components/common/DonationDetailsModal";
import { useLang } from "@/context/LanguageContext";
import {
  Clock,
  PackageCheck,
  Search,
  CheckCircle2,
  ArrowRight,
  Truck,
  AlertCircle,
} from "lucide-react";

export default function NgoRequestsPage() {
  const { donations, activeNgo } = useApp();
  const { t } = useLang();
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);

  // Filter requests that are claimed / requested by this NGO or in progress
  const requestedItems = donations.filter(
    (d) => d.status === "REQUESTED" || (d.status === "ACCEPTED" && !d.otp)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {t("Claim Pipeline")}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">{activeNgo?.name || "Robin Hood Army"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950">
            {t("Pending Food Requests")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t("Track claims waiting for kitchen confirmation before dispatching volunteer drivers.")}
          </p>
        </div>

        <Link
          href="/ngo/find"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer hover:brightness-110"
          style={{ background: "#164A31" }}
        >
          <PackageCheck className="w-4 h-4 text-emerald-400" />
          <span>{t("Find Available Food")}</span>
        </Link>
      </div>

      {/* List */}
      {requestedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {requestedItems.map((item) => (
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
          <Clock className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-950">
            {t("No pending requests at the moment.")}
          </h3>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            {t("You don't have any pending claims waiting for donor confirmation. Explore the live food feed to request fresh surplus.")}
          </p>
          <div className="pt-2">
            <Link
              href="/ngo/find"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer hover:brightness-110"
              style={{ background: "#164A31" }}
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t("Explore Available Food")}</span>
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
