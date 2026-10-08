"use client";

import React, { useState } from "react";
import { downloadFoodDonationCertificatePdf } from "@/lib/pdfGenerator";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  HeartHandshake,
  Users,
  Download,
  Sparkles,
  Utensils,
  Hotel,
  Home,
  CheckCircle2,
  Building,
  Leaf,
  Globe2,
  Truck,
  PackageCheck,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MONTHLY_COMMUNITY_TREND = [
  { month: "May", foodKg: 420, mealsServed: 1350 },
  { month: "Jun", foodKg: 580, mealsServed: 1820 },
  { month: "Jul", foodKg: 740, mealsServed: 2350 },
  { month: "Aug", foodKg: 890, mealsServed: 2840 },
  { month: "Sep", foodKg: 1120, mealsServed: 3580 },
  { month: "Oct", foodKg: 1380, mealsServed: 4410 },
];

export default function ImpactDashboard({ role }: { role: "HOUSEHOLD" | "RESTAURANT" | "HOTEL" | "NGO" }) {
  const { activeDonor, activeNgo, donations, communityMetrics } = useApp();
  const { t } = useLang();
  const [viewMode, setViewMode] = useState<"role" | "community">("role");

  const isHousehold = role === "HOUSEHOLD";
  const isRestaurant = role === "RESTAURANT";
  const isHotel = role === "HOTEL";
  const isNgo = role === "NGO";

  // Filter role-specific donations
  const myDonations = isNgo
    ? donations.filter((d) => d.status === "COMPLETED")
    : donations.filter(
        (d) =>
          d.donorId === activeDonor.id ||
          d.donorName === activeDonor.name ||
          d.donorType.toUpperCase() === role
      );

  const completedDonations = myDonations.filter((d) => d.status === "COMPLETED");

  // Realistic Role-Specific Totals
  const roleFoodKg =
    completedDonations.reduce((acc, curr) => acc + (curr.quantityKg || 0), 0) ||
    (isHousehold
      ? activeDonor.totalKgDonated || 9.5
      : isRestaurant
      ? activeDonor.totalKgDonated || 480
      : isHotel
      ? activeDonor.totalKgDonated || 920
      : 1250);

  const rolePeopleServed =
    completedDonations.reduce((acc, curr) => acc + (curr.servings || 0), 0) ||
    (isHousehold
      ? activeDonor.peopleServed || 24
      : isRestaurant
      ? activeDonor.peopleServed || 1450
      : isHotel
      ? activeDonor.peopleServed || 2750
      : 3800);

  const roleCompletedCount =
    completedDonations.length ||
    (isHousehold
      ? activeDonor.totalDonations || 4
      : isRestaurant
      ? activeDonor.totalDonations || 38
      : isHotel
      ? activeDonor.totalDonations || 42
      : 34);

  // Overall Community totals
  const totalCommunityKg =
    donations.reduce((acc, curr) => acc + (curr.quantityKg || 0), 0) || communityMetrics.totalKg;
  const totalCommunityServings =
    donations.reduce((acc, curr) => acc + (curr.servings || 0), 0) || communityMetrics.totalServings;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Community Project • SDG 2 &amp; SDG 12 Alignment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950">
            {isHousehold
              ? "Household Food Sharing Impact"
              : isRestaurant
              ? "Restaurant Surplus & Impact Ledger"
              : isHotel
              ? "Hotel & Banquet Redistribution Impact"
              : "NGO Relief & Distribution Impact"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {isHousehold && `Personal impact for ${activeDonor?.name || "your family"} • Sharing extra food with local people in need.`}
            {isRestaurant && `Commercial redistribution ledger for ${activeDonor?.name || "your restaurant"} • Reducing kitchen waste.`}
            {isHotel && `Banquet and meal rescue impact for ${activeDonor?.name || "your property"} • Zero buffet food to landfill.`}
            {isNgo && `Distribution summary for ${activeNgo?.name || "your organization"} • Delivering donor surplus to communities.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex items-center shadow-2xs">
            <button
              onClick={() => setViewMode("role")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "role"
                  ? "bg-[#164A31] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-950"
              }`}
            >
              My Impact
            </button>
            <button
              onClick={() => setViewMode("community")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "community"
                  ? "bg-[#164A31] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-950"
              }`}
            >
              Community Overview
            </button>
          </div>

          <button
            onClick={() =>
              downloadFoodDonationCertificatePdf({
                recipientName: isNgo
                  ? activeNgo?.name || "Robin Hood Army (Delhi Chapter)"
                  : activeDonor?.name || "Valued FoodWise Contributor",
                certificateType: isHousehold
                  ? "Certificate of Food Donation"
                  : isRestaurant
                  ? "Donor Appreciation Certificate"
                  : isHotel
                  ? "Hospitality Food Rescue Certificate"
                  : "Community Relief Participation Certificate",
                quantityKg: viewMode === "role" ? roleFoodKg : totalCommunityKg,
                servings: viewMode === "role" ? rolePeopleServed : totalCommunityServings,
                donorType: role,
                donationDate: "October 2026",
              })
            }
            className="px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2 cursor-pointer hover:brightness-110 active:scale-95"
            style={{ background: "#164A31" }}
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t("impact.download_certificate")}</span>
          </button>
        </div>
      </div>

      {/* ═══ ROLE-SPECIFIC IMPACT VIEW ═══ */}
      {viewMode === "role" && (
        <div className="space-y-6">
          {/* 4 Realistic Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {isNgo ? t("impact.food_received") : t("impact.food_donated")}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-800 mt-1">
                {roleFoodKg} <span className="text-xs font-semibold text-gray-500">kg</span>
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                {isHousehold
                  ? t("impact.wholesome_home")
                  : isRestaurant
                  ? t("impact.fresh_kitchen")
                  : isHotel
                  ? t("impact.banquet_rescued")
                  : t("impact.collected_distributed")}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {isNgo ? t("impact.completed_pickups") : t("impact.completed_donations")}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-gray-900 mt-1">
                {roleCompletedCount}
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                {isNgo ? t("impact.safe_handovers") : t("impact.delivered_verified")}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {isHousehold ? t("impact.people_helped") : isNgo ? t("impact.people_served") : t("impact.people_served")}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-900 mt-1">
                ~{rolePeopleServed}
              </div>
              <span className="text-[11px] text-emerald-700 mt-1 block">
                Nutritious portions provided
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {isNgo ? t("impact.active_donors") : t("impact.food_waste_prevented")}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700 mt-1">
                {isNgo ? t("impact.three_donors") : `${roleFoodKg} kg`}
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                {isNgo ? t("impact.restaurants_hotels") : t("impact.kept_out_waste")}
              </span>
            </div>
          </div>

          {/* ═══ CONTEXTUALIZED SDG 2 & SDG 12 ALIGNMENT ═══ */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8ECF3] shadow-xs space-y-4">
            <div className="border-b border-[#E8ECF3] pb-3">
              <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-emerald-700" />
                <span>{t("impact.how_contributes")}</span>
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                FoodWise connects your donations to global Sustainable Development Goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* SDG 2 Card */}
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-600 text-white shadow-2xs">
                    SDG 2
                  </span>
                  <h3 className="text-sm font-bold text-gray-950">{t("impact.sdg2_title")}</h3>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed">
                  {isHousehold && t("impact.sdg2_household")}
                  {isRestaurant && t("impact.sdg2_restaurant")}
                  {isHotel && t("impact.sdg2_hotel")}
                  {isNgo && t("impact.sdg2_ngo")}
                </p>
              </div>

              {/* SDG 12 Card */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-700 text-white shadow-2xs">
                    SDG 12
                  </span>
                  <h3 className="text-sm font-bold text-gray-950">{t("impact.sdg12_title")}</h3>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed">
                  {isHousehold && t("impact.sdg12_household")}
                  {isRestaurant && t("impact.sdg12_restaurant")}
                  {isHotel && t("impact.sdg12_hotel")}
                  {isNgo && t("impact.sdg12_ngo")}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Completed Rescues Ledger */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8ECF3] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{t("impact.verified_history")}</span>
            </h3>

            {completedDonations.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {completedDonations.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-gray-950">{item.foodName}</div>
                      <div className="text-gray-500 text-[11px] mt-0.5">
                        {item.quantityKg} kg • ~{item.servings} servings • {item.acceptedBy || t("impact.verified_ngo_partner")}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200">
                      Delivered
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 py-3">
                {t("impact.lifetime_record")} <strong>{roleCompletedCount} Completed</strong>{t("impact.totaling")}<strong>{roleFoodKg} kg</strong>. {t("impact.newly_posted")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ COMMUNITY OVERVIEW VIEW ═══ */}
      {viewMode === "community" && (
        <div className="space-y-6">
          {/* Aggregate 4 Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Total Food Donated
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-800 mt-1">
                {totalCommunityKg} <span className="text-xs font-semibold text-gray-500">kg</span>
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">{t("impact.across_donors")}</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-rose-100 shadow-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                People Fed / Servings
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-700 mt-1">
                ~{totalCommunityServings}
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">{t("impact.meals_distributed")}</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-amber-100 shadow-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {t("impact.food_waste_prevented")}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700 mt-1">
                {totalCommunityKg} <span className="text-xs font-semibold text-gray-500">kg</span>
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">{t("impact.diverted_landfills")}</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {t("impact.emissions_averted")}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-700 mt-1">
                {Math.round(totalCommunityKg * 2.5)} <span className="text-xs font-semibold text-gray-500">kg CO₂e</span>
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">{t("impact.co2_saved")}</span>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="bg-white rounded-3xl border border-[#E8ECF3] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>{t("impact.monthly_growth")}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Cumulative surplus food preserved and meals served across all donor partners.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                Verified Community Ledger
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_COMMUNITY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="foodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      fontSize: "12px",
                    }}
                    formatter={(value: any, name: any) => [
                      name === "foodKg" ? `${value} ` + t('impact.kg_surplus') : `${value} ` + t('impact.portions'),
                      name === "foodKg" ? t("impact.food_rescued") : t("impact.meals_provided"),
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="foodKg"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#foodGrad)"
                    name="foodKg"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
