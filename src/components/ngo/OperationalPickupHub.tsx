"use client";

import React, { useState } from "react";
import { DonationItem } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { calculateSmartDonationMatch } from "@/lib/smartMatching";
import { downloadDonationRecordPdf } from "@/lib/pdfGenerator";
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Key,
  ShieldCheck,
  Hotel,
  Home,
  Download,
  Flame,
  ThermometerSnowflake,
  Sparkles,
  ChevronDown,
  ChevronUp,
  PackageCheck,
  Check,
  Copy,
} from "lucide-react";

interface OperationalPickupHubProps {
  selectedItem: DonationItem | null;
  allItems: DonationItem[];
  onSelectItem: (item: DonationItem) => void;
  onRequestClaim: (item: DonationItem) => void;
}

export default function OperationalPickupHub({
  selectedItem,
  allItems,
  onSelectItem,
  onRequestClaim,
}: OperationalPickupHubProps) {
  const { activeNgo, completeDonation } = useApp();
  const [showMatchReasons, setShowMatchReasons] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Pick first item if none selected
  const activeItem = selectedItem || allItems[0] || null;

  if (!activeItem) {
    return (
      <div className="card p-6 bg-white border border-gray-200 rounded-3xl text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
          <Truck className="w-6 h-6" />
        </div>
        <h3 className="font-extrabold text-sm text-gray-900">
          No Surplus Batches Available
        </h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          All surplus food in this cycle has been collected and redistributed. Check back shortly for new listings.
        </p>
      </div>
    );
  }

  const matchData = calculateSmartDonationMatch(activeItem, activeNgo);
  const urgency = matchData.urgency;
  const isAvailable = activeItem.status === "AVAILABLE";
  const isClaimed = activeItem.status === "ACCEPTED" || activeItem.status === "PICKUP" || activeItem.status === "PICKUP_IN_PROGRESS";
  const isCompleted = activeItem.status === "COMPLETED";

  const isCommercial =
    activeItem.donorType === "Hotel" ||
    activeItem.donorType === "Restaurant" ||
    activeItem.donorType === "Restaurant / Hotel";

  const DonorIcon = isCommercial ? Hotel : Home;

  const handleCopyOtp = (otp: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(otp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  const handleDownloadPdf = () => {
    downloadDonationRecordPdf({
      donationId: activeItem.id,
      donorName: activeItem.donorName,
      donorType: activeItem.donorType,
      contactPerson: activeItem.contactPerson || "Authorized Dispatch Coordinator",
      contactPhone: activeItem.phone,
      pickupAddress: activeItem.location ? `${activeItem.location}${activeItem.city ? ', ' + activeItem.city : ''}` : undefined,
      foodName: activeItem.foodName,
      foodCategory: activeItem.foodCategory,
      quantityKg: activeItem.quantityKg,
      servings: activeItem.servings,
      diet: activeItem.diet,
      status: activeItem.status,
      recipientNgo: activeItem.acceptedBy || activeNgo?.name || "Verified Relief Partner",
      driverName: activeItem.driverName || "Assigned Relief Volunteer",
      driverPhone: activeItem.driverPhone || "+91 98451 00000",
      otp: activeItem.otp,
      completedAt: activeItem.completedAt || new Date().toISOString(),
    });
  };

  return (
    <div className="card p-5 sm:p-6 bg-white border border-gray-200 rounded-3xl shadow-xs space-y-5">
      {/* Top Header & Fast Batch Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-gray-950 flex items-center gap-1.5">
                <span>Operational Pickup Coordination Hub</span>
              </h3>
              <p className="text-[11px] text-gray-500">
                Text-based collection coordination, vehicle assignment & tamper-evident handover verification
              </p>
            </div>
          </div>
        </div>

        {/* Batch Quick Switcher */}
        {allItems.length > 1 && (
          <div className="flex items-center gap-1.5 shrink-0">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden sm:inline">
              Select Batch:
            </label>
            <select
              value={activeItem.id}
              onChange={(e) => {
                const found = allItems.find((it) => it.id === e.target.value);
                if (found) onSelectItem(found);
              }}
              className="text-xs font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-2.5 py-1.5 outline-hidden transition-colors cursor-pointer max-w-[220px] truncate"
            >
              {allItems.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.foodName} ({it.quantityKg} kg) — {it.donorName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Selected Batch Primary Hero Box */}
      <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-emerald-900/10 space-y-3.5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
              <DonorIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {isCommercial ? "Commercial Partner" : "Household Contributor"}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-semibold text-gray-600">
                  {activeItem.donorName}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-gray-950 mt-0.5">
                {activeItem.foodName}
              </h4>
            </div>
          </div>

          {/* Urgency Badge */}
          <div className="flex items-center gap-2">
            <span
              style={{
                color: urgency.color,
                backgroundColor: urgency.bgColor,
                borderColor: urgency.borderColor,
              }}
              className="px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-2xs"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{urgency.badgeLabel}: {urgency.timeLabel}</span>
            </span>
          </div>
        </div>

        {/* Quantities & Diet summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-white border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Quantity</span>
            <span className="text-sm font-extrabold text-gray-900 font-mono-data">{activeItem.quantityKg} kg</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Servings</span>
            <span className="text-sm font-extrabold text-gray-900 font-mono-data">~{activeItem.servings} meals</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Diet Category</span>
            <span className="text-xs font-bold text-emerald-800">{activeItem.diet}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Smart Match</span>
            <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{matchData.matchScore}% Match</span>
            </span>
          </div>
        </div>
      </div>

      {/* Text-Based Pickup Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Pickup Address & Access Details */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pickup Address & Facility Access</span>
          </div>
          <p className="text-gray-700 font-medium leading-relaxed pl-6">
            {activeItem.location}
            {activeItem.city ? `, ${activeItem.city}` : ""}
          </p>
          <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 pl-6 space-y-1">
            <div>
              <strong className="text-gray-700">Dock Instructions: </strong>
              {activeItem.pickupInstructions || "Report to security gate / reception for meal handover handover box."}
            </div>
            <div>
              <strong className="text-gray-700">Ready Time: </strong>
              {activeItem.preparationTime || "Ready for immediate collection"}
            </div>
            <div>
              <strong className="text-gray-700">Deadline: </strong>
              <span className="text-amber-700 font-semibold">{activeItem.pickupDeadline}</span>
            </div>
          </div>
        </div>

        {/* Authorized Donor Contact & Privacy */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Authorized Donor Contact</span>
          </div>
          <div className="pl-6 space-y-1">
            <div className="text-gray-900 font-bold text-sm">
              {activeItem.contactPerson || activeItem.donorName}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeItem.phone}`}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 font-mono-data"
              >
                {activeItem.phone}
              </a>
              <span className="text-[10px] text-gray-400">• Verified Contact</span>
            </div>
            <p className="text-[11px] text-gray-500 pt-1 leading-normal">
              Direct line authorized for active collection dispatch and security gate clearance only.
            </p>
          </div>
        </div>
      </div>

      {/* Storage Conditions & Food Hygiene Requirements */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          {activeItem.storageCondition?.includes("Hot") ? (
            <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <ThermometerSnowflake className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-extrabold text-gray-900">
              Storage Standard: {activeItem.storageCondition || "Ambient / Clean Dry Holding"}
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5">
              {matchData.requiresSpecialTransport || "Transport in food-grade covered bins with lids tightly secured."}
              {activeItem.allergens && activeItem.allergens.length > 0 && (
                <span className="ml-1 text-amber-800 font-semibold">
                  • Declared Allergens: {activeItem.allergens.join(", ")}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Smart Match Reasons Accordion */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 space-y-2">
        <button
          type="button"
          onClick={() => setShowMatchReasons(!showMatchReasons)}
          className="w-full flex items-center justify-between text-xs font-bold text-emerald-950 hover:text-emerald-800 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Why this batch matches your NGO ({matchData.matchScore}% Match Score)</span>
          </span>
          {showMatchReasons ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showMatchReasons && (
          <ul className="text-[11px] text-gray-700 space-y-1.5 pt-2 border-t border-emerald-200/60 pl-2">
            {matchData.reasons.map((r, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Handover & Status Logistics Bar */}
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-xs text-gray-900">
              Collection Status:{" "}
              <span className="text-emerald-700 uppercase tracking-wider">
                {activeItem.status === "AVAILABLE"
                  ? "Awaiting NGO Claim"
                  : activeItem.status === "ACCEPTED"
                  ? "Assigned & In Logistics Pipeline"
                  : activeItem.status}
              </span>
            </span>
          </div>

          {activeItem.otp && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
              <Key className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-gray-600">Handover OTP:</span>
              <span className="font-mono text-sm font-extrabold text-blue-900 tracking-wider">
                {activeItem.otp}
              </span>
              <button
                type="button"
                onClick={() => handleCopyOtp(activeItem.otp!)}
                className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                title="Copy OTP"
              >
                {copiedOtp ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          )}
        </div>

        {/* Assigned Volunteer Fleet */}
        {isClaimed && (
          <div className="text-xs text-gray-600 bg-white p-2.5 rounded-xl border border-gray-200/80 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="font-bold text-gray-900">Assigned Team: </span>
              <span>{activeItem.driverName || "Volunteer Dispatch"}</span>
              {activeItem.driverPhone && (
                <span className="font-mono text-gray-500 ml-1">({activeItem.driverPhone})</span>
              )}
            </div>
            <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Vehicle Dispatched
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="text-xs font-bold text-gray-700 hover:text-gray-900 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Download Dispatch PDF</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            {isAvailable && (
              <button
                type="button"
                disabled={urgency.isExpired}
                onClick={() => onRequestClaim(activeItem)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  urgency.isExpired
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95"
                }`}
              >
                <PackageCheck className="w-4 h-4" />
                <span>{urgency.isExpired ? "Window Expired" : "Claim & Assign Volunteer Fleet"}</span>
              </button>
            )}

            {isClaimed && (
              <button
                type="button"
                onClick={() => completeDonation(activeItem.id)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Handover & Delivery</span>
              </button>
            )}

            {isCompleted && (
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Delivered to Beneficiaries</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
