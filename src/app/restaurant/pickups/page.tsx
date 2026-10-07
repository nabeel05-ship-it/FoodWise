"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { DonationItem } from "@/lib/types";
import DonationDetailsModal from "@/components/common/DonationDetailsModal";
import { useLang } from "@/context/LanguageContext";
import {
  Truck,
  CheckCircle2,
  Key,
  Clock,
  MapPin,
  Phone,
  Utensils,
  ShieldCheck,
} from "lucide-react";

export default function RestaurantPickupsPage() {
  const { donations, activeDonor, completeDonation } = useApp();
  const { t } = useLang();
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);

  const myPickups = donations.filter(
    (d) =>
      (d.donorId === activeDonor.id || d.donorType === "Restaurant") &&
      (d.status === "ACCEPTED" || d.status === "PICKUP" || d.status === "COMPLETED")
  );

  const activePickups = myPickups.filter((d) => d.status === "ACCEPTED" || d.status === "PICKUP");
  const pastPickups = myPickups.filter((d) => d.status === "COMPLETED");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#E8ECF3]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            {t("Pickups & Handovers")}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500">{activeDonor.name}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
          {t("Pickup & Handover Coordination")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {t("Manage volunteer vehicle collections, verify handover OTPs, and track completed deliveries.")}
        </p>
      </div>

      {/* Active Pickups */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-extrabold text-gray-900 flex items-center gap-2">
          <span>{t("Awaiting Volunteer Collection")}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
            {activePickups.length}
          </span>
        </h2>

        {activePickups.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300 text-xs text-gray-500">
            {t("No active pickups currently scheduled. When an NGO claims your surplus food, collection details and OTP will appear here.")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePickups.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-blue-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {t("Claimed by")} {item.acceptedBy}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      {t("Deadline:")} {item.pickupDeadline}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900">
                    {item.foodName}
                  </h3>
                  <div className="text-xs text-emerald-800 font-bold mt-0.5">
                    {item.quantityKg} kg • ~{item.servings} servings
                  </div>

                  {/* Driver Box */}
                  <div className="mt-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-blue-950 font-semibold">
                      <Truck className="w-3.5 h-3.5 text-blue-700" />
                      <span>{t("Driver:")} {item.driverName || t("Volunteer Driver")}</span>
                    </div>
                    {item.driverPhone && (
                      <div className="flex items-center gap-2 text-gray-600 text-[11px]">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{item.driverPhone}</span>
                      </div>
                    )}
                  </div>

                  {/* Verification Handover OTP */}
                  {item.otp && (
                    <div className="mt-3 p-2.5 bg-white border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                        <Key className="w-4 h-4 text-blue-700" />
                        <span>{t("Physical Handover OTP:")}</span>
                      </div>
                      <span className="text-xl font-black font-mono tracking-widest text-blue-900">
                        {item.otp}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedDonation(item)}
                    className="text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    {t("View Details")}
                  </button>
                  <button
                    onClick={() => completeDonation(item.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t("Confirm Handover Complete")}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed History */}
      {pastPickups.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-3">
          <h2 className="text-base font-extrabold text-gray-900">
            {t("Completed Handover History")}
          </h2>
          <div className="divide-y divide-gray-100">
            {pastPickups.map((p) => (
              <div
                key={p.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-bold text-gray-900 text-sm">{p.foodName}</div>
                  <div className="text-gray-500 mt-0.5">
                    {p.quantityKg} kg • {t("Handed over to")} <strong>{p.acceptedBy || "Partner NGO"}</strong>
                  </div>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 text-[11px] w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {t("Successfully Distributed")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          userRole="RESTAURANT"
          onClose={() => setSelectedDonation(null)}
          onCompleteDonation={(id) => completeDonation(id)}
        />
      )}
    </div>
  );
}
