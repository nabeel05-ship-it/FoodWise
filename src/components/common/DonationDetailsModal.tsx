"use client";

import React, { useState } from "react";
import { DonationItem } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import {
  X,
  MapPin,
  Clock,
  Phone,
  Truck,
  CheckCircle2,
  Key,
  ShieldCheck,
  Utensils,
  Hotel,
  Home,
  HeartHandshake,
  Download,
  AlertTriangle,
} from "lucide-react";
import { downloadDonationRecordPdf } from "@/lib/pdfGenerator";
import { useLang } from "@/context/LanguageContext";

export interface DonationDetailsModalProps {
  donation: DonationItem | null;
  isOpen?: boolean;
  userRole?: "RESTAURANT" | "HOTEL" | "HOUSEHOLD" | "NGO" | "restaurant" | "hotel" | "household" | "ngo";
  onClose: () => void;
  onCancelDonation?: (id: string) => void;
  onCompleteDonation?: (id: string) => void;
  onRequestFood?: (item: DonationItem) => void;
}

export default function DonationDetailsModal({
  donation,
  isOpen = true,
  userRole,
  onClose,
  onCancelDonation,
  onCompleteDonation,
  onRequestFood,
}: DonationDetailsModalProps) {
  const { t } = useLang();
  const { userRole: globalUserRole } = useApp();
  if (!donation || !isOpen) return null;

  const effectiveRole = userRole || globalUserRole || "RESTAURANT";
  const normalizedRole = effectiveRole.toUpperCase() as "RESTAURANT" | "HOTEL" | "HOUSEHOLD" | "NGO";
  const isAvailable = donation.status === "AVAILABLE";
  const isAccepted = donation.status === "ACCEPTED" || donation.status === "PICKUP";
  const isCompleted = donation.status === "COMPLETED";
  const isFlagged = donation.status === "FLAGGED_FOR_REVIEW" || Boolean(donation.qualityFlag);

  const DonorIcon =
    donation.donorType === "Restaurant"
      ? Utensils
      : donation.donorType === "Hotel"
      ? Hotel
      : Home;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 shrink-0">
              <DonorIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {t(donation.donorType)} {t("Listing")}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-semibold text-gray-500">
                  {t(donation.foodCategory || "")}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-gray-950 tracking-tight">
                {donation.foodName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Pill */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isFlagged
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : isAvailable
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : isAccepted
                  ? "bg-blue-50 text-blue-800 border border-blue-200"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {isFlagged
                ? "Flagged for Review"
                : donation.status === "AVAILABLE"
                ? t("Available For Pickup")
                : donation.status === "ACCEPTED"
                ? t("Volunteer Claimed")
                : t(donation.status)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {t(donation.diet)}
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-gray-500">
            {donation.quantityKg} kg • ~{donation.servings} {t("Servings")}
          </span>
        </div>

        {/* Quality Concern Banner (Visible transparently) */}
        {isFlagged && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-amber-950 font-bold">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Food Quality Concern Reported</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-950 border border-amber-300">
                {donation.qualityFlag?.severity || "Under Review"} Severity
              </span>
            </div>
            <div className="text-amber-900 space-y-1 pt-1 border-t border-amber-200/60">
              <div className="flex items-center justify-between">
                <span className="text-amber-800 font-medium">Reported Issue:</span>
                <strong className="text-amber-950 font-bold">{donation.qualityFlag?.issueType || "Observed Quality Concern"}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-800 font-medium">Reported Date:</span>
                <span className="text-amber-950 font-semibold">{donation.qualityFlag?.reportedAt || "Recently"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-800 font-medium">Status:</span>
                <span className="text-amber-950 font-semibold">Flagged for Review (Held from distribution)</span>
              </div>
            </div>
            <p className="text-[11px] text-amber-800/90 pt-1 leading-relaxed">
              Reported by receiving partner for quality verification. Food is held back from distribution pending review.
            </p>
          </div>
        )}

        {/* Description / Notes */}
        {donation.description && (
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700 leading-relaxed">
            {donation.description}
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-gray-100 space-y-1">
            <span className="text-gray-500 font-medium">{t("Donor Organization")}</span>
            <div className="font-bold text-gray-900">{donation.donorName}</div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-gray-100 space-y-1">
            <span className="text-gray-500 font-medium">{t("Pickup Deadline")}</span>
            <div className="font-bold text-gray-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{donation.pickupDeadline}</span>
            </div>
          </div>

          {(donation.source || donation.reason || donation.serviceShift) && (
            <div className="col-span-2 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between text-xs">
              <span className="text-emerald-900 font-medium">{t("Surplus Context:")}</span>
              <strong className="text-emerald-950 font-bold">
                {donation.source ? `${t("Source:")} ${donation.source}` : donation.reason ? `${t("Reason:")} ${donation.reason}` : `${t("Shift:")} ${donation.serviceShift}`}
              </strong>
            </div>
          )}
        </div>

        {/* Location & Contact */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-gray-100 space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900">{t("Pickup Address:")}</span>
              <p className="text-gray-600 mt-0.5">{donation.location}</p>
            </div>
          </div>

          {donation.phone && (
            <div className="flex items-center gap-2 pt-1 border-t border-gray-200/60">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-600">{t("Contact:")}</span>
              <strong className="text-gray-900">{donation.phone}</strong>
            </div>
          )}
        </div>

        {/* In-Transit Info (if claimed) */}
        {isAccepted && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-bold">
              <Truck className="w-4 h-4 text-blue-700" />
              <span>{t("Pickup Assigned to")} {donation.acceptedBy || t("Relief Volunteer")}</span>
            </div>
            {donation.driverName && (
              <p className="text-blue-800 text-[11px]">
                {t("Driver:")} <strong>{donation.driverName}</strong> ({donation.driverPhone})
              </p>
            )}
            {donation.otp && (
              <div className="flex items-center justify-between pt-1 border-t border-blue-200/60">
                <span className="text-blue-900 font-semibold">{t("Handover Verification OTP:")}</span>
                <span className="px-3 py-1 rounded bg-white border border-blue-300 font-mono font-bold text-blue-900">
                  {donation.otp}
                </span>
              </div>
            )}
          </div>
        )}

        {/* PDF Download Action */}
        <div>
          <button
            type="button"
            onClick={() => {
              downloadDonationRecordPdf({
                donationId: donation.id,
                donorName: donation.donorName,
                donorType: donation.donorType,
                pickupAddress: donation.location ? `${donation.location}${donation.city ? ', ' + donation.city : ''}` : undefined,
                foodName: donation.foodName,
                foodCategory: donation.foodCategory,
                quantityKg: donation.quantityKg,
                servings: donation.servings || Math.round(donation.quantityKg * 3),
                diet: donation.diet,
                context: donation.serviceShift || donation.source || donation.reason,
                status: donation.status,
                recipientNgo: donation.acceptedBy,
                driverName: donation.driverName,
                driverPhone: donation.driverPhone,
                otp: donation.otp,
                createdAt: donation.createdAt,
                completedAt: donation.completedAt,
              });
            }}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>{t("Download Donation Record (PDF)")}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            {t("common.close")}
          </button>

          {normalizedRole === "NGO" && isAvailable && onRequestFood && (
            <button
              onClick={() => {
                onRequestFood(donation);
              }}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              style={{ background: "#164A31" }}
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>{t("Request Food")}</span>
            </button>
          )}

          {normalizedRole !== "NGO" && isAccepted && onCompleteDonation && (
            <button
              onClick={() => {
                onCompleteDonation(donation.id);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t("Confirm Handover")}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
