"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import {
  RefreshCw,
  Zap,
  Leaf,
  DollarSign,
  TrendingUp,
  Sparkles,
  Flame,
  CheckCircle2,
  Factory,
  BarChart3,
  ArrowRight,
  ShieldCheck,
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

const BYPRODUCT_STREAMS = [
  {
    id: "STREAM-01",
    name: "Biogas Anaerobic Digester (Unit 1 & 2)",
    inputFeedstock: "Potato peels, sludge & sorting scrap",
    dailyFeedKg: 1200,
    outputType: "Methane Biogas (Electricity & Boiler Steam)",
    dailyYield: "480 kWh",
    monthlyRevenue: "₹86,400 (Grid Offset)",
    co2AbatedTons: 1.4,
    status: "OPTIMAL",
  },
  {
    id: "STREAM-02",
    name: "Cattle Feed Pelletizing Line",
    inputFeedstock: "Dewatered potato pulp & fibrous peel solids",
    dailyFeedKg: 450,
    outputType: "High-Protein Animal Nutrition Pellets",
    dailyYield: "210 kg Pellets",
    monthlyRevenue: "₹63,000 (Local Dairy Coops)",
    co2AbatedTons: 0.6,
    status: "ACTIVE",
  },
  {
    id: "STREAM-03",
    name: "Industrial Starch Recovery Flume",
    inputFeedstock: "Slicing bath washwater leachate",
    dailyFeedKg: 190,
    outputType: "Technical Grade Starch Powder (Dry)",
    dailyYield: "85 kg Starch",
    monthlyRevenue: "₹38,250 (Corrugated Box Industry)",
    co2AbatedTons: 0.3,
    status: "ACTIVE",
  },
];

const MONTHLY_VALORIZATION = [
  { month: "May", biogasKg: 32000, feedPelletsKg: 12000, starchKg: 5200 },
  { month: "Jun", biogasKg: 34500, feedPelletsKg: 13100, starchKg: 5800 },
  { month: "Jul", biogasKg: 36000, feedPelletsKg: 13500, starchKg: 6100 },
  { month: "Aug", biogasKg: 38200, feedPelletsKg: 14200, starchKg: 6400 },
  { month: "Sep", biogasKg: 40500, feedPelletsKg: 15100, starchKg: 6800 },
];

export default function ByproductRecoveryPage() {
  const { t } = useLang();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              {t("factory.byproduct.subtitle_label")}
            </span>
            <span className="text-[#D1D5DB]">•</span>
            <span className="text-xs text-[#9CA3AF]">{t("factory.byproduct.zero_landfill")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            {t("factory.byproduct.title")}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            {t("factory.byproduct.description")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/factory/reports"
            className="px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            {t("factory.byproduct.view_reports")}
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card stat-card-green p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("factory.byproduct.kpi_waste_diverted")}</span>
            <div className="icon-container icon-container-green">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-[#111827]">
            1,840 <span className="text-sm font-bold text-[#6B7280]">{t("common.kg")}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {t("factory.byproduct.landfill_diversion_rate")}
          </div>
        </div>

        <div className="stat-card stat-card-amber p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("factory.byproduct.kpi_energy_generated")}</span>
            <div className="icon-container icon-container-amber">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-amber-600">
            480 <span className="text-sm font-bold text-[#6B7280]">{t("factory.byproduct.kwh_per_day")}</span>
          </div>
          <div className="text-[11px] text-[#6B7280] mt-1">
            {t("factory.byproduct.powers_lighting")}
          </div>
        </div>

        <div className="stat-card stat-card-emerald p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("factory.byproduct.kpi_circular_revenue")}</span>
            <div className="icon-container" style={{ background: "#ECFDF5", color: "#059669" }}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-[#059669]">
            ₹1,87,650
          </div>
          <div className="text-[11px] text-[#6B7280] mt-1">
            {t("factory.byproduct.biogas_pellet_starch")}
          </div>
        </div>

        <div className="stat-card stat-card-indigo p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("factory.byproduct.kpi_carbon_offset")}</span>
            <div className="icon-container icon-container-indigo">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-[#111827]">
            69.0 <span className="text-sm font-bold text-[#6B7280]">{t("factory.byproduct.tons_co2e")}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {t("factory.byproduct.equivalent_cars")}
          </div>
        </div>
      </div>

      {/* Circular Valorization Streams Cards */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              {t("factory.byproduct.streams_title")}
            </h3>
            <p className="section-subtitle">{t("factory.byproduct.streams_subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BYPRODUCT_STREAMS.map((st) => (
            <div
              key={st.id}
              className="p-5 rounded-2xl border border-[#E8ECF3] bg-gradient-to-b from-white to-[#FAFBFC] hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold font-mono-data text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {st.id}
                  </span>
                  <h4 className="font-bold text-sm text-[#111827] mt-1">{st.name}</h4>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-1" />
              </div>

              <div className="text-xs text-[#6B7280]">
                <strong>{t("factory.byproduct.feedstock")}:</strong> {st.inputFeedstock}
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">{t("factory.byproduct.daily_intake")}</span>
                  <span className="font-bold font-mono-data text-[#111827]">{st.dailyFeedKg} {t("common.kg")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">{t("factory.byproduct.output_yield")}</span>
                  <span className="font-bold font-mono-data text-emerald-600">{st.dailyYield}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">{t("factory.byproduct.monthly_value")}</span>
                  <span className="font-bold font-mono-data text-[#111827]">{st.monthlyRevenue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">{t("factory.byproduct.monthly_chart_title")}</h3>
            <p className="section-subtitle">{t("factory.byproduct.monthly_chart_subtitle")}</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 font-mono-data">{t("factory.byproduct.yield_growth")}</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_VALORIZATION}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit=" kg" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1B2138",
                  borderColor: "rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  color: "#F1F5F9",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Bar dataKey="biogasKg" name={t("factory.byproduct.legend_biogas")} fill="#10B981" stackId="a" />
              <Bar dataKey="feedPelletsKg" name={t("factory.byproduct.legend_feed")} fill="#F59E0B" stackId="a" />
              <Bar dataKey="starchKg" name={t("factory.byproduct.legend_starch")} fill="#3B82F6" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
