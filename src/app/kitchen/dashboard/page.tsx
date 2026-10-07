"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { downloadKitchenAuditPdf } from "@/lib/pdfGenerator";
import { MATCHED_NGOS } from "@/lib/mockData";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Trophy,
  CheckCircle2,
  Calendar,
  Utensils,
  Hotel,
  Home,
  Check,
  FileText,
  ChevronDown,
  ArrowUpRight,
  Package,
  HeartHandshake,
  Star,
  MapPin,
  Truck,
  Clock,
  PlusCircle,
  Key,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import NgoDirectionModal, { NgoDirectionData } from "@/components/common/NgoDirectionModal";

// Weekly surplus redistribution trend
const WEEKLY_DONATION_TREND = [
  { day: "Mon", foodKg: 28, peopleFed: 90 },
  { day: "Tue", foodKg: 35, peopleFed: 110 },
  { day: "Wed", foodKg: 42, peopleFed: 135 },
  { day: "Thu", foodKg: 30, peopleFed: 95 },
  { day: "Fri", foodKg: 52, peopleFed: 165 },
  { day: "Sat", foodKg: 68, peopleFed: 215 },
  { day: "Sun", foodKg: 60, peopleFed: 190 },
];

export default function KitchenDashboardPage() {
  const {
    activeDonor,
    donations,
    communityMetrics,
    rankedHotels,
    allDonors,
    setActiveDonorId,
  } = useApp();
  const { t } = useLang();

  const [timePeriod, setTimePeriod] = useState<"Today" | "This Week" | "This Month">("This Week");
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [selectedNgoDirection, setSelectedNgoDirection] = useState<NgoDirectionData | null>(null);

  // Filter donations for the active donor
  const donorDonations = donations.filter((d) => d.donorId === activeDonor.id || !d.donorId);
  const displayDonations = donorDonations.length > 0 ? donorDonations : donations;

  const activeDonationsCount = displayDonations.filter((d) => d.status === "AVAILABLE").length;
  const acceptedDonationsCount = displayDonations.filter((d) => d.status === "ACCEPTED" || d.status === "PICKUP").length;
  const completedDonationsCount = displayDonations.filter((d) => d.status === "COMPLETED").length;

  const totalFoodDonated = displayDonations.reduce((sum, d) => sum + (Number(d.quantityKg) || 0), 0);
  const totalPeopleFed = displayDonations.reduce((sum, d) => sum + (Number(d.servings) || 0), 0);

  const DonorIcon = activeDonor?.type === "Restaurant" ? Utensils : activeDonor?.type === "Hotel" ? Hotel : Home;

  return (
    <div className="space-y-6">
      {/* ═══ TOP HEADER BAR ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {activeDonor.type} Donor Portal
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-[#6B7280]">Community Food Redistribution</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
            {activeDonor.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            {activeDonor.address} • Contact: {activeDonor.contactPerson} ({activeDonor.phone})
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Donate CTA */}
          <Link
            href="/kitchen/surplus"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md shadow-emerald-900/20 transition-all hover:brightness-110 active:scale-95"
            style={{ background: "#164A31" }}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ Donate Food</span>
          </Link>

          {/* Time Period Selector */}
          <div className="relative">
            <button
              onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all hover:bg-gray-50 bg-white border border-[#E8ECF3] text-gray-700 shadow-xs"
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{timePeriod}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isPeriodDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isPeriodDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-[#E8ECF3] py-1 z-30 animate-in fade-in slide-in-from-top-1">
                {(["Today", "This Week", "This Month"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setTimePeriod(period);
                      setIsPeriodDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${
                      timePeriod === period ? "text-emerald-600 bg-emerald-50/50 font-bold" : "text-gray-600"
                    }`}
                  >
                    <span>{period}</span>
                    {timePeriod === period && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Report */}
          <button
            onClick={() => downloadKitchenAuditPdf({ period: timePeriod })}
            className="btn-primary cursor-pointer active:scale-95 transition-all text-xs flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Audit PDF</span>
          </button>
        </div>
      </div>

      {/* ═══ ACTIVE DONOR INFO ROW ═══ */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E8ECF3] shadow-xs flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800">{activeDonor.name}</span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
            {activeDonor.type} Donor
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500">{activeDonor.city}</span>
        </div>
        {activeDonor.fssaiNumber && (
          <div className="text-gray-500 font-medium text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{activeDonor.fssaiNumber}</span>
          </div>
        )}
      </div>

      {/* ═══ 4 KPI STAT CARDS ROW ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Donations */}
        <div className="stat-card stat-card-indigo p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Available for Pickup</span>
            <div className="icon-container icon-container-indigo">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-gray-900 mb-1">
            {activeDonationsCount} Batches
          </div>
          <p className="text-[11px] text-gray-500">Ready for nearby NGO collection</p>
        </div>

        {/* Card 2: Accepted Donations */}
        <div className="stat-card stat-card-amber p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">In Transit / Claimed</span>
            <div className="icon-container icon-container-amber">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-gray-900 mb-1">
            {acceptedDonationsCount} Active Pickups
          </div>
          <p className="text-[11px] text-blue-700 font-medium">Driver dispatched with OTP</p>
        </div>

        {/* Card 3: Total Food Donated */}
        <div className="stat-card stat-card-emerald p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Food Waste Prevented</span>
            <div className="icon-container icon-container-green">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-emerald-900 mb-1">
            {totalFoodDonated}{" "}
            <span className="text-sm font-bold text-emerald-700">kg</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>100% Edible Surplus Rescued</span>
          </div>
        </div>

        {/* Card 4: People Fed */}
        <div className="stat-card stat-card-green p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">People Served (SDG 2)</span>
            <div className="icon-container" style={{ background: "#ECFDF5", color: "#059669" }}>
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-gray-900 mb-1">
            ~{totalPeopleFed.toLocaleString()}{" "}
            <span className="text-sm font-bold text-gray-500">meals</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">Distributed across shelters</p>
        </div>
      </div>

      {/* ═══ MAIN SECTION: REDISTRIBUTION CHART & ACTIVE CLAIMS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weekly Food Donation Impact Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E8ECF3] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Weekly Food Rescued vs. Meals Fed</h2>
              <p className="text-xs text-gray-500">
                Tracking daily surplus redirection from {activeDonor.name}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              SDG 12.3 Metric
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DONATION_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="foodKg" name="Food Donated (kg)" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="peopleFed" name="Meals Provided" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Peak donation day: <strong>Saturday (Banquets/Buffet)</strong></span>
            <Link href="/dashboard/impact" className="text-emerald-700 font-bold hover:underline">
              View Multi-Facility SDG Report →
            </Link>
          </div>
        </div>

        {/* Right Column: Donor Recognition & Tiers (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E8ECF3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold text-gray-900">Donor Recognition Tier</h2>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Gold Partner
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {activeDonor.name} has prevented <strong>{totalFoodDonated} kg</strong> of edible food waste and nourished <strong>{totalPeopleFed} people</strong>.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Community Impact Rank</span>
                <span className="font-extrabold text-emerald-800">#2 in New Delhi</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">FSSAI Hygiene Adherence</span>
                <span className="font-extrabold text-emerald-800">100% Certified</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Average Pickup Response</span>
                <span className="font-extrabold text-gray-900">22 mins</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <Link
              href="/kitchen/ranking"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>View City Donor Leaderboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ RECENT DONATIONS LISTING TABLE ═══ */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8ECF3] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Recent Surplus Food Donations</h2>
            <p className="text-xs text-gray-500">Live lifecycle of surplus food items from listing to handover</p>
          </div>

          <Link
            href="/kitchen/surplus"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1"
          >
            <span>Manage All Donations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="pb-3 font-semibold">Food Item</th>
                <th className="pb-3 font-semibold">Quantity</th>
                <th className="pb-3 font-semibold">Est. Servings</th>
                <th className="pb-3 font-semibold">Pickup Deadline</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Partner NGO</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayDonations.slice(0, 5).map((item) => {
                const isAvailable = item.status === "AVAILABLE";
                const isAccepted = item.status === "ACCEPTED" || item.status === "PICKUP";
                const isCompleted = item.status === "COMPLETED";

                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{item.foodName}</span>
                    </td>
                    <td className="py-3 font-mono text-gray-900 font-semibold">{item.quantityKg} kg</td>
                    <td className="py-3 text-gray-600">~{item.servings} people</td>
                    <td className="py-3 text-gray-600">{item.pickupDeadline}</td>
                    <td className="py-3">
                      {isAvailable && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Available
                        </span>
                      )}
                      {isAccepted && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                          Accepted
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">
                          Completed
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-gray-700 font-medium">
                      {item.acceptedBy || <span className="text-gray-400 italic">Pending claim</span>}
                    </td>
                    <td className="py-3 text-right">
                      {isAccepted && item.otp ? (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <Key className="w-3 h-3" /> OTP: {item.otp}
                        </span>
                      ) : (
                        <Link
                          href="/kitchen/surplus"
                          className="text-xs font-semibold text-emerald-700 hover:underline"
                        >
                          View →
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direction Modal */}
      {selectedNgoDirection && (
        <NgoDirectionModal
          isOpen={Boolean(selectedNgoDirection)}
          ngo={selectedNgoDirection}
          onClose={() => setSelectedNgoDirection(null)}
        />
      )}
    </div>
  );
}
