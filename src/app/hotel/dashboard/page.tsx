"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { DonationItem } from "@/lib/types";
import DonationCard from "@/components/common/DonationCard";
import DonationDetailsModal from "@/components/common/DonationDetailsModal";
import { downloadDonationImpactReportPdf, downloadDonationRecordPdf } from "@/lib/pdfGenerator";
import {
  Hotel,
  Utensils,
  PlusCircle,
  Truck,
  CheckCircle2,
  Users,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Download,
  Copy,
  Check,
  Clock,
  Phone,
  ThermometerSnowflake,
  Flame,
  ArrowRight,
} from "lucide-react";

export default function HotelDashboard() {
  const router = useRouter();
  const { donations, activeDonor, completeDonation, cancelDonation } = useApp();
  const { t } = useLang();
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "AVAILABLE" | "EN_ROUTE">("ALL");
  const [copiedOtpId, setCopiedOtpId] = useState<string | null>(null);

  // Filter donations for commercial kitchen domain (Hotel + Restaurant)
  const commercialDonations = donations.filter(
    (d) =>
      d.donorId === activeDonor.id ||
      d.donorType === "Hotel" ||
      d.donorType === "Restaurant"
  );

  const activeDonations = commercialDonations.filter(
    (d) => d.status === "AVAILABLE" || d.status === "ACCEPTED" || d.status === "PICKUP"
  );

  const upcomingPickups = commercialDonations.filter(
    (d) => d.status === "ACCEPTED" || d.status === "PICKUP"
  );

  const completedDonations = commercialDonations.filter((d) => d.status === "COMPLETED");

  const totalKg = commercialDonations
    .filter((d) => d.status !== "CANCELLED")
    .reduce((acc, curr) => acc + (curr.quantityKg || 0), 0);

  const totalPeopleServed = commercialDonations
    .filter((d) => d.status === "COMPLETED")
    .reduce((acc, curr) => acc + (curr.servings || 0), 0);

  const filteredActiveDonations = activeDonations.filter((item) => {
    if (activeTab === "AVAILABLE") return item.status === "AVAILABLE";
    if (activeTab === "EN_ROUTE") return item.status === "ACCEPTED" || item.status === "PICKUP";
    return true;
  });

  const handleDonateAgain = (item: DonationItem) => {
    const query = new URLSearchParams({
      repeatFood: item.foodName,
      repeatCategory: item.foodCategory || "Buffet",
      repeatKg: String(item.quantityKg || 25),
      repeatServings: String(item.servings || 80),
      repeatDiet: item.diet || "Vegetarian",
    }).toString();
    router.push(`/hotel/donate?${query}`);
  };

  const handleCopyOtp = (otp: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(otp);
      setCopiedOtpId(id);
      setTimeout(() => setCopiedOtpId(null), 2000);
    }
  };

  const handleDownloadImpactPdf = () => {
    downloadDonationImpactReportPdf({
      organizationName: activeDonor.name || "Restaurant & Hotel Food Donor",
      role: "Restaurant / Hotel",
      totalKg,
      totalServings: totalPeopleServed || 1200,
      completedCount: completedDonations.length,
      period: "Current Operational Cycle",
      donationsList: completedDonations.map((d) => ({
        date: typeof d.createdAt === "string" ? d.createdAt : new Date(d.createdAt).toLocaleDateString(),
        donorName: activeDonor.name,
        foodName: d.foodName,
        category: d.foodCategory,
        quantityKg: d.quantityKg,
        servings: d.servings,
        status: d.status,
      })),
    });
  };

  const handleDownloadRecordPdf = (d: DonationItem) => {
    downloadDonationRecordPdf({
      donationId: d.id,
      donorName: activeDonor.name,
      donorType: "Restaurant / Hotel",
      contactPerson: activeDonor.contactPerson || "Operations Lead",
      contactPhone: activeDonor.phone || "+91 98450 87654",
      pickupAddress: d.location || activeDonor.address || "Main Service Gate",
      foodName: d.foodName,
      foodCategory: d.foodCategory,
      quantityKg: d.quantityKg,
      servings: d.servings,
      diet: d.diet,
      status: d.status,
      recipientNgo: d.acceptedBy || "Verified Partner NGO",
      driverName: d.driverName,
      driverPhone: d.driverPhone,
      otp: d.otp,
      completedAt: d.completedAt || new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* ═══ RESTAURANT / HOTEL UNIFIED HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
              <Hotel className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t("Restaurant / Hotel Portal")}</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-600 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{activeDonor.fssaiNumber || "FSSAI Verified Commercial Kitchen"}</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">
              {activeDonor.address || activeDonor.city || "Bengaluru, Karnataka"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950">
            {t("Restaurant & Hotel Operations Hub")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t("Commercial surplus management for")} <strong>{activeDonor.name}</strong> • {t("Coordinating large-scale kitchen & banquet rescues with authorized NGOs.")}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/hotel/donate"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md shadow-emerald-950/20 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
            style={{ background: "#164A31" }}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>{t("+ Post Surplus Food")}</span>
          </Link>
        </div>
      </div>

      {/* ═══ 5 FOCUSED COMMERCIAL STATS ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("Total Surplus Listed")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1 font-mono">
            {totalKg} <span className="text-xs font-semibold text-gray-500">{t("common.kg")}</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {t("Banquet & Kitchen Volume")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("Active Listings")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1 font-mono">
            {activeDonations.length}
          </div>
          <span className="text-[11px] text-gray-500 font-medium mt-1 block">
            {t("Ready at Loading Bay")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
            {t("Scheduled Pickups")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-800 mt-1 font-mono">
            {upcomingPickups.length}
          </div>
          <span className="text-[11px] text-blue-700 font-medium mt-1 block">
            {t("NGO Fleet In Transit")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("Completed Rescues")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 font-mono">
            {completedDonations.length}
          </div>
          <span className="text-[11px] text-gray-500 font-medium mt-1 block">
            {t("Delivered to Shelters")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("People Nourished")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1 font-mono">
            {totalPeopleServed || activeDonor.peopleServed || 0}+
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {t("Zero Landfill Waste")}
          </span>
        </div>
      </div>

      {/* ═══ OPERATIONAL SHIFT & FOOD SAFETY PROTOCOL BANNER ═══ */}
      <div className="rounded-2xl p-4 sm:p-5 bg-linear-to-r from-emerald-900 to-[#072B1E] text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {t("Commercial Service Protocol")}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-200/90 font-medium">
                {t("HACCP & FSSAI Compliant Handover")}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5 max-w-2xl">
              {t("Cooked hot-held surplus must be dispatched or cooled within 4 hours. Keep thermal containers sealed at Service Dock until driver OTP verification.")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-200 font-mono">
            {t("Average NGO Arrival: ~28 mins")}
          </div>
          <Link
            href="/hotel/donate"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer shadow-xs"
          >
            {t("Post Batch →")}
          </Link>
        </div>
      </div>

      {/* ═══ UPCOMING PICKUP ALERT (IF ANY) ═══ */}
      {upcomingPickups.length > 0 && (
        <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md shadow-blue-500/20">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                    {t("Scheduled Collection by")} {upcomingPickups[0].acceptedBy || t("Authorized Relief Partner")}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-200/80 text-blue-900">
                    {t("In Progress")}
                  </span>
                </div>
                <p className="text-xs text-blue-800 mt-0.5">
                  <strong>{upcomingPickups[0].foodName}</strong> ({upcomingPickups[0].quantityKg} {t("common.kg")} • ~{upcomingPickups[0].servings} {t("portions")})
                </p>
                <div className="flex items-center gap-3 text-[11px] text-blue-700 mt-1">
                  <span>{t("Driver:")} <strong>{upcomingPickups[0].driverName || t("Designated Relief Driver")}</strong></span>
                  {upcomingPickups[0].driverPhone && (
                    <a
                      href={`tel:${upcomingPickups[0].driverPhone}`}
                      className="text-blue-900 font-semibold underline flex items-center gap-1 hover:text-blue-950"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{upcomingPickups[0].driverPhone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {upcomingPickups[0].otp && (
              <div className="flex items-center gap-2.5 bg-white p-2 sm:p-2.5 rounded-xl border border-blue-200 shadow-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">
                    {t("Security Handover OTP")}
                  </span>
                  <span className="text-base sm:text-lg font-black font-mono tracking-widest text-blue-950">
                    {upcomingPickups[0].otp}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyOtp(upcomingPickups[0].otp!, upcomingPickups[0].id)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
                  title="Copy OTP for Security Gate"
                >
                  {copiedOtpId === upcomingPickups[0].id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => completeDonation(upcomingPickups[0].id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 cursor-pointer shadow-xs transition-all active:scale-95"
                >
                  {t("Confirm Dock Handover")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ ACTIVE COMMERCIAL DONATIONS ═══ */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
              {t("Active Restaurant & Hotel Donations")}
            </h2>
            <p className="text-xs text-gray-500">
              {t("Manage live surplus listings waiting for NGO collection at your service bays.")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-gray-100 border border-gray-200 rounded-xl text-xs">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === "ALL" ? "bg-white text-emerald-950 shadow-xs font-bold" : "text-gray-600"
                }`}
              >
                {t("All")} ({activeDonations.length})
              </button>
              <button
                onClick={() => setActiveTab("AVAILABLE")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === "AVAILABLE" ? "bg-white text-emerald-950 shadow-xs font-bold" : "text-gray-600"
                }`}
              >
                {t("Awaiting Claim")} ({activeDonations.filter((d) => d.status === "AVAILABLE").length})
              </button>
              <button
                onClick={() => setActiveTab("EN_ROUTE")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === "EN_ROUTE" ? "bg-white text-emerald-950 shadow-xs font-bold" : "text-gray-600"
                }`}
              >
                {t("Pickup En Route")} ({upcomingPickups.length})
              </button>
            </div>

            <Link
              href="/hotel/donations"
              className="text-xs font-bold text-emerald-800 hover:underline shrink-0"
            >
              {t("View All")} →
            </Link>
          </div>
        </div>

        {filteredActiveDonations.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-300">
            <Hotel className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
            <h3 className="text-sm font-bold text-gray-800">{t("No active surplus listings")}</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {t("All kitchen and banquet surplus have either been collected or no active batch is posted.")}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2.5">
              <Link
                href="/hotel/donate"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t("Post Surplus Meals")}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActiveDonations.map((item) => (
              <DonationCard
                key={item.id}
                donation={item}
                userRole="HOTEL"
                onViewDetails={(d) => setSelectedDonation(d)}
                onCompleteHandover={(d) => completeDonation(d.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══ RECENT BANQUET & RESTAURANT DONATIONS WITH FAST REPEAT & AUDIT ═══ */}
      {completedDonations.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-gray-900">
                {t("Recent Banquet & Kitchen Dispatches")}
              </h2>
              <p className="text-xs text-gray-500">
                {t("Historical rescue logs. Click Repeat Batch to re-list identical menu items or download tax-ready receipts.")}
              </p>
            </div>
            <button
              onClick={handleDownloadImpactPdf}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t("Export Complete Audit Record")}</span>
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {completedDonations.slice(0, 5).map((d) => (
              <div
                key={d.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-gray-950 text-sm flex items-center gap-2">
                    <span>{d.foodName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {d.foodCategory || "Commercial"}
                    </span>
                  </div>
                  <div className="text-gray-500 text-[11px] mt-0.5">
                    {d.quantityKg} {t("common.kg")} (~{d.servings} {t("portions")}) • {t("Collected by")}{" "}
                    <strong className="text-gray-700">{d.acceptedBy || t("Authorized Relief NGO")}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t("Verified Handover")}</span>
                  </span>

                  <button
                    onClick={() => handleDownloadRecordPdf(d)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all flex items-center gap-1 cursor-pointer"
                    title="Download Official Record PDF"
                  >
                    <Download className="w-3 h-3 text-gray-600" />
                    <span>{t("Receipt")}</span>
                  </button>

                  <button
                    onClick={() => handleDonateAgain(d)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t("Repeat Batch")}</span>
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
          onCancelDonation={(id) => cancelDonation(id)}
          onCompleteDonation={(id) => completeDonation(id)}
        />
      )}
    </div>
  );
}
