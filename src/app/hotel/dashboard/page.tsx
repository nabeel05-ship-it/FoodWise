"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { DonationItem } from "@/lib/types";
import DonationCard from "@/components/common/DonationCard";
import DonationDetailsModal from "@/components/common/DonationDetailsModal";
import {
  Hotel,
  PlusCircle,
  Truck,
  CheckCircle2,
  Users,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function HotelDashboard() {
  const router = useRouter();
  const { donations, activeDonor, completeDonation, cancelDonation } = useApp();
  const { t } = useLang();
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);

  // Filter donations for hotels
  const hotelDonations = donations.filter(
    (d) => d.donorId === activeDonor.id || d.donorType === "Hotel"
  );

  const activeDonations = hotelDonations.filter(
    (d) => d.status === "AVAILABLE" || d.status === "ACCEPTED" || d.status === "PICKUP"
  );

  const upcomingPickups = hotelDonations.filter(
    (d) => d.status === "ACCEPTED" || d.status === "PICKUP"
  );

  const completedDonations = hotelDonations.filter((d) => d.status === "COMPLETED");

  const totalKg = hotelDonations
    .filter((d) => d.status !== "CANCELLED")
    .reduce((acc, curr) => acc + (curr.quantityKg || 0), 0);

  const totalPeopleServed = hotelDonations
    .filter((d) => d.status === "COMPLETED")
    .reduce((acc, curr) => acc + (curr.servings || 0), 0);

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

  return (
    <div className="space-y-6">
      {/* ═══ HOTEL HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Hotel className="w-3.5 h-3.5" />
              {t("hotel.portal")}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">{activeDonor.city}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950">
            {t("hotel.dashboard_title")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t("common.logged_in_as")} <strong>{activeDonor.name}</strong> • {t("hotel.manage_surplus")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/hotel/donate"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md shadow-emerald-950/20 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
            style={{ background: "#164A31" }}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>{t("hotel.donate_btn")}</span>
          </Link>
        </div>
      </div>

      {/* ═══ 5 FOCUSED HOTEL STATS ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("hotel.todays_surplus")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1 font-mono">
            {totalKg} <span className="text-xs font-semibold text-gray-500">{t("common.kg")}</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {t("hotel.banquet_volume")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("dash.active_donations")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1 font-mono">
            {activeDonations.length}
          </div>
          <span className="text-[11px] text-gray-500 font-medium mt-1 block">
            {t("hotel.ready_loading_bay")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
            {t("hotel.scheduled_pickups")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-800 mt-1 font-mono">
            {upcomingPickups.length}
          </div>
          <span className="text-[11px] text-blue-700 font-medium mt-1 block">
            {t("hotel.ngo_vehicle_enroute")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("dash.completed_rescues")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 font-mono">
            {completedDonations.length}
          </div>
          <span className="text-[11px] text-gray-500 font-medium mt-1 block">
            {t("dash.distributed_shelters")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("dash.people_served")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1 font-mono">
            {totalPeopleServed || activeDonor.peopleServed || 0}+
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {t("hotel.zero_landfill")}
          </span>
        </div>
      </div>

      {/* ═══ SCHEDULED PICKUP BANNER (IF ANY) ═══ */}
      {upcomingPickups.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                {t("hotel.scheduled_collection_by")} {upcomingPickups[0].acceptedBy || t("ngo.partner")}
              </div>
              <p className="text-xs text-blue-800 mt-0.5">
                {upcomingPickups[0].foodName} ({upcomingPickups[0].quantityKg} {t("common.kg")}) • {t("dash.driver")}:{" "}
                <strong>{upcomingPickups[0].driverName || t("dash.volunteer_driver")}</strong>
              </p>
            </div>
          </div>
          {upcomingPickups[0].otp && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-900">{t("hotel.dock_handover_otp")}:</span>
              <span className="px-3 py-1 bg-white border border-blue-300 rounded-xl font-mono font-bold text-blue-900 text-sm">
                {upcomingPickups[0].otp}
              </span>
              <button
                onClick={() => completeDonation(upcomingPickups[0].id)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 cursor-pointer"
              >
                {t("hotel.confirm_complete")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ ACTIVE HOTEL DONATIONS ═══ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
              {t("hotel.active_food_donations")}
            </h2>
            <p className="text-xs text-gray-500">
              {t("hotel.active_donations_desc")}
            </p>
          </div>
          <Link
            href="/hotel/donations"
            className="text-xs font-bold text-emerald-800 hover:underline"
          >
            {t("common.view_all")} ({hotelDonations.length}) →
          </Link>
        </div>

        {activeDonations.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
            <Hotel className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-gray-800">{t("hotel.no_active_donations")}</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {t("hotel.no_active_donations_desc")}
            </p>
            <Link
              href="/hotel/donate"
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t("hotel.donate_btn")}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeDonations.map((item) => (
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

      {/* ═══ RECENT BANQUET DONATIONS & REPEAT FEATURE ═══ */}
      {completedDonations.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <h2 className="text-sm sm:text-base font-extrabold text-gray-900 mb-1">
            {t("hotel.recent_banquet")}
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            {t("hotel.recent_banquet_desc")}
          </p>

          <div className="divide-y divide-gray-100">
            {completedDonations.slice(0, 4).map((d) => (
              <div
                key={d.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-bold text-gray-900 text-sm">{d.foodName}</div>
                  <div className="text-gray-500 text-[11px] mt-0.5">
                    {d.quantityKg} {t("common.kg")} (~{d.servings} {t("dash.card_serves")}) • {t("hotel.handed_over_to")}{" "}
                    <strong>{d.acceptedBy || t("ngo.partner")}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {t("dash.card_distributed")}
                  </span>
                  <button
                    onClick={() => handleDonateAgain(d)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t("hotel.repeat_donation")}</span>
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
