"use client";

import React from "react";
import { useLang } from "@/context/LanguageContext";
import { DonationItem, DonorType } from "@/lib/types";
import {
  Clock,
  MapPin,
  Utensils,
  Hotel,
  Home,
  Truck,
  CheckCircle2,
  Key,
  HeartHandshake,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

interface DonationCardProps {
  donation: DonationItem;
  userRole?: "RESTAURANT" | "HOTEL" | "HOUSEHOLD" | "NGO" | "restaurant" | "hotel" | "household" | "ngo";
  onViewDetails: (item: DonationItem) => void;
  onRequestClaim?: (item: DonationItem) => void;
  onRequestFood?: (item: DonationItem) => void;
  onCompleteHandover?: (item: DonationItem) => void;
  onDonateAgain?: (item: DonationItem) => void;
}

export default function DonationCard({
  donation,
  userRole = "RESTAURANT",
  onViewDetails,
  onRequestClaim,
  onRequestFood,
  onCompleteHandover,
  onDonateAgain,
}: DonationCardProps) {
  const { t } = useLang();
  const isAvailable = donation.status === "AVAILABLE";
  const isAccepted = donation.status === "ACCEPTED" || donation.status === "PICKUP";
  const isCompleted = donation.status === "COMPLETED";
  const isFlagged = donation.status === "FLAGGED_FOR_REVIEW" || Boolean(donation.qualityFlag);

  const DonorIcon =
    donation.donorType === "Hotel" ? Hotel : donation.donorType === "Household" ? Home : Utensils;

  const isNgo = userRole?.toUpperCase() === "NGO";
  const handleRequest = onRequestFood || onRequestClaim;

  return (
    <div
      onClick={() => onViewDetails(donation)}
      className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between ${
        isFlagged
          ? "border-amber-300 hover:border-amber-400 bg-amber-50/20"
          : isAvailable
          ? "border-emerald-200 hover:border-emerald-400"
          : isAccepted
          ? "border-blue-200 hover:border-blue-400 bg-blue-50/15"
          : "border-gray-200 opacity-90"
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <DonorIcon className="w-3 h-3" />
              <span>{t(donation.donorType) || donation.donorType}</span>
            </span>
            {donation.diet && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  donation.diet === "Vegetarian"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : donation.diet === "Vegan"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {t(donation.diet) || donation.diet}
              </span>
            )}
            {donation.source && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {t(donation.source) || donation.source}
              </span>
            )}
            {donation.reason && donation.reason !== "Normal household surplus" && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {t(donation.reason) || donation.reason}
              </span>
            )}
            {donation.serviceShift && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {t(donation.serviceShift) || donation.serviceShift}
              </span>
            )}
          </div>

          {/* Status Badge */}
          {isFlagged ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full shrink-0">
              <AlertTriangle className="w-3 h-3 text-amber-700" />
              <span>Flagged for Review</span>
            </span>
          ) : isAvailable ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t("dash.card_available")}
            </span>
          ) : isAccepted ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full shrink-0">
              <Truck className="w-3 h-3" />
              {t("dash.card_accepted")}
            </span>
          ) : isCompleted ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {t("dash.card_completed")}
            </span>
          ) : null}
        </div>

        {/* Food Name & Donor info */}
        <h3 className="font-extrabold text-base text-gray-950 leading-snug">
          {donation.foodName}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">
          {t("dash.card_by")} <strong className="text-gray-800 font-semibold">{donation.donorName}</strong>
        </p>

        {/* Quantity & Servings highlight */}
        <div className="mt-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">{t("dash.card_quantity")}</span>
            <span className="font-extrabold text-emerald-900 text-sm">
              {donation.quantityKg ? `${donation.quantityKg} ${t("common.kg")}` : donation.quantity}
            </span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">{t("dash.card_serves")}</span>
            <span className="font-extrabold text-gray-900 text-sm">
              ~{donation.servings} {t("dash.card_people")}
            </span>
          </div>
        </div>

        {/* Location & Time details */}
        <div className="mt-3 space-y-1.5 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              {t("dash.card_available_until")} <strong className="text-gray-900">{donation.pickupDeadline}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{donation.location || donation.city}</span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
        {/* Left Status info / OTP */}
        <div>
          {isFlagged ? (
            <span className="text-amber-800 font-semibold text-[11px] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Quality Review</span>
            </span>
          ) : isAccepted && donation.otp ? (
            <div className="flex items-center gap-1.5 text-blue-900 bg-blue-100 px-2 py-0.5 rounded-lg font-mono font-bold text-[11px]">
              <Key className="w-3 h-3 text-blue-700" />
              <span>OTP: {donation.otp}</span>
            </div>
          ) : isCompleted ? (
            <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {t("dash.card_distributed")}
            </span>
          ) : (
            <span className="text-gray-400 text-[11px]">{t("dash.card_ready_pickup")}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {isNgo && isAvailable && handleRequest && (
            <button
              onClick={() => handleRequest(donation)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{t("dash.card_request")}</span>
            </button>
          )}

          {!isNgo && isAccepted && onCompleteHandover && (
            <button
              onClick={() => onCompleteHandover(donation)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t("dash.card_verify")}</span>
            </button>
          )}

          {!isNgo && isCompleted && onDonateAgain && (
            <button
              onClick={() => onDonateAgain(donation)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-1 border border-emerald-200"
              title="Post similar surplus donation"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t("dash.card_donate_again")}</span>
            </button>
          )}

          <button
            onClick={() => onViewDetails(donation)}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 px-2 py-1 cursor-pointer"
          >
            {t("common.details")} →
          </button>
        </div>
      </div>
    </div>
  );
}
