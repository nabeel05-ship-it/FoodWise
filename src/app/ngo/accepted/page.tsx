"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { DonationItem } from "@/lib/types";
import DonationCard from "@/components/common/DonationCard";
import DonationDetailsModal from "@/components/common/DonationDetailsModal";
import { useLang } from "@/context/LanguageContext";
import {
  Truck,
  PackageCheck,
  CheckCircle2,
  Clock,
  Phone,
  ShieldCheck,
  MapPin,
  Check,
  AlertTriangle,
} from "lucide-react";

export default function NgoAcceptedPage() {
  const { donations, completeDonation, activeNgo } = useApp();
  const { t } = useLang();
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completedSuccess, setCompletedSuccess] = useState<string | null>(null);

  // Accepted or in-progress pickups
  const acceptedItems = donations.filter(
    (d) => d.status === "ACCEPTED" || d.status === "PICKUP" || d.status === "PICKUP_IN_PROGRESS"
  );

  const handleCompletePickup = (id: string, foodName: string) => {
    setCompletingId(id);
    setTimeout(() => {
      completeDonation(id);
      setCompletingId(null);
      setCompletedSuccess(`Successfully verified handover for "${foodName}". Delivered to shelter.`);
      setTimeout(() => setCompletedSuccess(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              {t("Active Dispatch Logistics")}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">{activeNgo?.name || "Robin Hood Army"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950">
            {t("Accepted Donations & Pickups")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t("Track volunteer drivers en route to kitchens, verify handovers with OTP, and confirm safe delivery.")}
          </p>
        </div>

        <Link
          href="/ngo/find"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer hover:brightness-110"
          style={{ background: "#164A31" }}
        >
          <PackageCheck className="w-4 h-4 text-emerald-400" />
          <span>{t("Find More Food")}</span>
        </Link>
      </div>

      {/* Success Notification */}
      {completedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{completedSuccess}</span>
        </div>
      )}

      {/* List */}
      {acceptedItems.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {acceptedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-blue-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                      {t("In-Transit Pickup")}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {item.pickupDeadline}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-gray-950 tracking-tight">
                    {item.foodName}
                  </h3>
                  <p className="text-xs text-gray-600 font-semibold mt-0.5">
                    {item.quantityKg} kg • ~{item.servings} {t("Servings")} • {item.donorName}
                  </p>

                  {/* Location */}
                  <div className="flex items-start gap-1.5 text-xs text-gray-600 mt-3 bg-gray-50 p-2.5 rounded-xl">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{item.location}</span>
                  </div>

                  {/* Driver & OTP Box */}
                  <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{t("Assigned Driver:")}</span>
                      <strong className="text-gray-900">{item.driverName || t("Volunteer Driver")}</strong>
                    </div>
                    {item.otp && (
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-blue-200/60">
                        <span className="text-blue-900 font-semibold">{t("Handover OTP:")}</span>
                        <span className="px-2.5 py-0.5 rounded bg-white border border-blue-300 font-mono font-bold text-blue-900">
                          {item.otp}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDonation(item)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  >
                    {t("View Details")}
                  </button>
                  <button
                    onClick={() => handleCompletePickup(item.id, item.foodName)}
                    disabled={completingId === item.id}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    {completingId === item.id ? (
                      <span>{t("Verifying...")}</span>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t("Confirm Pickup")}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-3">
          <Truck className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-950">
            {t("No active pickups in progress.")}
          </h3>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            {t("Once you claim a food listing from a restaurant, hotel, or household, volunteer coordination and handover OTPs will appear here.")}
          </p>
          <div className="pt-2">
            <Link
              href="/ngo/find"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer hover:brightness-110"
              style={{ background: "#164A31" }}
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t("Browse Food Feed")}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          isOpen={!!selectedDonation}
          userRole="NGO"
          onClose={() => setSelectedDonation(null)}
        />
      )}

    </div>
  );
}
