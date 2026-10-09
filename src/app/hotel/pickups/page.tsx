"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { DonationItem } from "@/lib/types";
import DonationDetailsModal from "@/components/common/DonationDetailsModal";
import { useLang } from "@/context/LanguageContext";
import { downloadDonationRecordPdf } from "@/lib/pdfGenerator";
import {
  Truck,
  CheckCircle2,
  Key,
  Hotel,
  Phone,
  ShieldCheck,
  Copy,
  Check,
  Download,
  Clock,
  ThermometerSnowflake,
  ClipboardCheck,
} from "lucide-react";

export default function HotelPickupsPage() {
  const { donations, activeDonor, completeDonation } = useApp();
  const { t } = useLang();
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [copiedOtpId, setCopiedOtpId] = useState<string | null>(null);

  const commercialPickups = donations.filter(
    (d) =>
      (d.donorId === activeDonor.id || d.donorType === "Hotel" || d.donorType === "Restaurant") &&
      (d.status === "ACCEPTED" || d.status === "PICKUP" || d.status === "COMPLETED")
  );

  const activePickups = commercialPickups.filter((d) => d.status === "ACCEPTED" || d.status === "PICKUP");
  const pastPickups = commercialPickups.filter((d) => d.status === "COMPLETED");

  const handleCopyOtp = (otp: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(otp);
      setCopiedOtpId(id);
      setTimeout(() => setCopiedOtpId(null), 2000);
    }
  };

  const handleDownloadRecordPdf = (d: DonationItem) => {
    downloadDonationRecordPdf({
      donationId: d.id,
      donorName: activeDonor.name,
      donorType: "Restaurant / Hotel",
      contactPerson: activeDonor.contactPerson || "Operations Lead",
      contactPhone: activeDonor.phone || "+91 98450 87654",
      pickupAddress: d.location || activeDonor.address || "Loading Dock 2",
      foodName: d.foodName,
      foodCategory: d.foodCategory,
      quantityKg: d.quantityKg,
      servings: d.servings,
      diet: d.diet,
      status: d.status,
      recipientNgo: d.acceptedBy || "Verified Relief NGO",
      driverName: d.driverName,
      driverPhone: d.driverPhone,
      otp: d.otp,
      completedAt: d.completedAt || new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#E8ECF3]">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wider bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200 flex items-center gap-1.5 shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-blue-700" />
            <span>{t("Loading Dock & Dispatch Logistics")}</span>
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500">{activeDonor.name}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
          {t("Scheduled NGO Collections & Dock Handover")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {t("Coordinate security gate access, driver vehicle authentication, and tamper-evident OTP verification for commercial batches.")}
        </p>
      </div>

      {/* Dock Security & Verification Checklist Advisory */}
      <div className="p-4 rounded-3xl bg-linear-to-r from-blue-50 to-indigo-50/50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-950 uppercase tracking-wider">
              {t("Gate & Loading Dock Handover Standard")}
            </div>
            <p className="text-xs text-blue-900 mt-0.5">
              {t("Ensure thermal container seals remain unbroken until handover. Confirm driver phone and vehicle ID before sharing the security OTP.")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-blue-800 bg-white px-3 py-1.5 rounded-xl border border-blue-200 self-end sm:self-auto shrink-0 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>{t("100% Authorized Relief Fleet")}</span>
        </div>
      </div>

      {/* Active Pickups */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-extrabold text-gray-900 flex items-center gap-2">
          <span>{t("Active Fleet Collections")}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono font-bold">
            {activePickups.length}
          </span>
        </h2>

        {activePickups.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-300 text-xs text-gray-500">
            <Truck className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
            <h3 className="font-bold text-gray-800 text-sm">{t("No active collections en route")}</h3>
            <p className="mt-1 max-w-md mx-auto text-gray-500">
              {t("When an NGO accepts your listed food, driver credentials, vehicle details, and the dock handover OTP will appear here in real time.")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePickups.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-blue-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                      <Truck className="w-3 h-3 text-blue-600" />
                      <span>{t("Claimed by")} {item.acceptedBy}</span>
                    </span>
                    <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.pickupDeadline}</span>
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-950">
                    {item.foodName}
                  </h3>
                  <div className="text-xs text-emerald-800 font-bold mt-1">
                    {item.quantityKg} kg • ~{item.servings} {t("portions")}
                  </div>

                  {/* Driver Logistics Info */}
                  <div className="mt-3.5 p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-950 font-bold">
                        <Truck className="w-3.5 h-3.5 text-blue-700" />
                        <span>{t("Driver:")} {item.driverName || t("Designated Relief Driver")}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                        {t("Verified Vehicle")}
                      </span>
                    </div>

                    {item.driverPhone && (
                      <div className="flex items-center gap-2 text-gray-600 text-[11px] pt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{t("Driver Phone:")}</span>
                        <a
                          href={`tel:${item.driverPhone}`}
                          className="text-blue-900 font-bold underline hover:text-blue-950"
                        >
                          {item.driverPhone}
                        </a>
                      </div>
                    )}

                    {item.location && (
                      <div className="text-[11px] text-gray-500 pt-1 border-t border-blue-100/80">
                        <strong>{t("Bay:")}</strong> {item.location}
                      </div>
                    )}
                  </div>

                  {/* Handover OTP */}
                  {item.otp && (
                    <div className="mt-3.5 p-3 bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                        <Key className="w-4 h-4 text-blue-700" />
                        <div>
                          <div>{t("Dock Security OTP:")}</div>
                          <div className="text-[10px] font-normal text-blue-700">{t("Verify before loading")}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black font-mono tracking-widest text-blue-950 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-2xs">
                          {item.otp}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyOtp(item.otp!, item.id)}
                          className="p-2 rounded-xl bg-white border border-blue-200 text-blue-800 hover:bg-blue-50 transition-all cursor-pointer shadow-2xs"
                          title="Copy OTP"
                        >
                          {copiedOtpId === item.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedDonation(item)}
                    className="text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    {t("View Details")}
                  </button>
                  <button
                    onClick={() => completeDonation(item.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t("Confirm Dock Handover")}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed History */}
      {pastPickups.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                {t("Completed Commercial Dispatches")}
              </h2>
              <p className="text-xs text-gray-500">
                {t("Archived records of successfully handed over surplus batches.")}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-gray-500">
              {pastPickups.length} {t("dispatches")}
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {pastPickups.map((p) => (
              <div
                key={p.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-bold text-gray-950 text-sm flex items-center gap-2">
                    <span>{p.foodName}</span>
                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {p.quantityKg} kg
                    </span>
                  </div>
                  <div className="text-gray-500 mt-0.5 text-[11px]">
                    {t("Collected by")} <strong className="text-gray-700">{p.acceptedBy || t("Partner NGO")}</strong> • {p.pickupDeadline || t("Delivered")}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 text-[11px] w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t("Handover Completed")}</span>
                  </span>

                  <button
                    onClick={() => handleDownloadRecordPdf(p)}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
                    title="Download Dispatch Receipt (PDF)"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          userRole="HOTEL"
          onClose={() => setSelectedDonation(null)}
          onCompleteDonation={(id) => completeDonation(id)}
        />
      )}
    </div>
  );
}
