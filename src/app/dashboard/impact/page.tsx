"use client";

import React, { useEffect } from "react";
import { downloadNgoImpactCertificatePdf } from "@/lib/pdfGenerator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { ESG_DATA } from "@/lib/mockData";
import CountUp from "@/components/common/CountUp";
import {
  ShieldCheck,
  Trees,
  Droplets,
  Zap,
  Trash2,
  HeartHandshake,
  Users,
  Building,
  FileCheck2,
  Download,
  Share2,
  TrendingUp,
  Globe,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function SustainabilityImpactPage() {
  const { currentRole } = useApp();
  const router = useRouter();
  const { t } = useLang();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("view") !== "all") {
        if (currentRole === "FACTORY_MANAGER") {
          router.replace("/factory/reports");
        } else if (currentRole === "NGO_PARTNER") {
          router.replace("/ngo/reports");
        } else if (currentRole === "KITCHEN_MANAGER") {
          router.replace("/kitchen/reports");
        }
      }
    }
  }, [currentRole, router]);

  return (
    <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#059669] text-xs font-bold uppercase tracking-wider mb-2 border border-[#10B981]/30">
              <Sparkles className="w-3.5 h-3.5" />
              {t("impact.badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
              {t("impact.title")}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              {t("impact.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                downloadNgoImpactCertificatePdf({
                  certificateType: "FoodWise National ESG Audit Certificate (PDF)",
                  mealsServed: 342190,
                  co2SavedKg: 171095,
                  ngoName: "FoodWise National Food Recovery Coalition",
                })
              }
              className="px-4 py-2.5 rounded-xl bg-[#F3F4F6] hover:bg-white/[0.1] text-[#111827] text-xs font-semibold border border-[#E5E7EB] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#10B981]" />
              {t("impact.export_esg")}
            </button>
          </div>
        </div>

        {/* SECTION-SPECIFIC REPORTS QUICK SWITCHER */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#E8ECF3] shadow-xs">
          <span className="text-xs font-bold text-gray-500 px-3 py-1">{t("impact.view_dept_audits")}</span>
          <Link
            href="/kitchen/reports"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
          >
            🍳 {t("impact.kitchen_waste_audit")}
          </Link>
          <Link
            href="/factory/reports"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5"
          >
            🏭 {t("impact.factory_mass_balance")}
          </Link>
          <Link
            href="/ngo/reports"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1.5"
          >
            ❤️ {t("impact.ngo_relief")}
          </Link>
          <span className="ml-auto text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-600 text-white">
            ⭐ {t("impact.multi_facility_esg")}
          </span>
        </div>

        {/* ESG SCORE CARD (PROMINENT GAUGE) */}
        <div className="card p-6 sm:p-8 border-[#A7F3D0] bg-gradient-to-r from-white/[0.04] via-[#00D4AA]/[0.02] to-[#10B981]/[0.02]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Circular Gauge Representation */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#F9FAFB] border border-[#E8ECF3] text-center relative">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="url(#esgGrad)"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - ESG_DATA.overallScore / 100)}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="esgGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00D4AA" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-[#111827] font-mono-data">
                    {ESG_DATA.overallScore}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-[#6B7280] font-bold">
                    {t("impact.out_of_100")}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm font-bold text-[#10B981]">{t("impact.composite_esg_rating")}</div>
                <div className="text-[11px] text-[#6B7280]">{t("impact.sebi_brsr_gri")}</div>
              </div>
            </div>

            {/* Three Sub-Scores */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">{t("impact.esg_performance_title")}</h2>
                <p className="text-xs text-[#6B7280]">
                  {t("impact.esg_performance_desc")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Environmental */}
                <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#059669]">{t("impact.environmental_e")}</span>
                    <span className="text-lg font-mono-data font-bold text-[#111827]">
                      {ESG_DATA.environmentalScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${ESG_DATA.environmentalScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#6B7280]">
                    {t("impact.environmental_desc")}
                  </p>
                </div>

                {/* Social */}
                <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#10B981]">{t("impact.social_s")}</span>
                    <span className="text-lg font-mono-data font-bold text-[#111827]">
                      {ESG_DATA.socialScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-[#34D399] h-full rounded-full"
                      style={{ width: `${ESG_DATA.socialScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#6B7280]">
                    {t("impact.social_desc")}
                  </p>
                </div>

                {/* Governance */}
                <div className="p-4 rounded-xl bg-[#FFF8EB] border border-[#FDE68A]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400">{t("impact.governance_g")}</span>
                    <span className="text-lg font-mono-data font-bold text-[#111827]">
                      {ESG_DATA.governanceScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${ESG_DATA.governanceScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#6B7280]">
                    {t("impact.governance_desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: ENVIRONMENTAL METRICS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <Trees className="w-5 h-5 text-[#059669]" />
                {t("impact.env_ledger_title")}
              </h2>
              <p className="text-xs text-[#6B7280]">
                {t("impact.env_ledger_desc")}
              </p>
            </div>
            <span className="text-xs text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-emerald-500/20 font-mono-data">
              {t("impact.epa_methodology")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">{t("impact.co2_prevented")}</div>
              <div className="text-2xl font-black text-[#059669] font-mono-data mb-1">
                <CountUp end={2847} suffix={` ${t("impact.tons")}`} />
              </div>
              <div className="text-[11px] text-[#6B7280] leading-tight">
                {t("impact.co2_equivalent")}
              </div>
            </div>

            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">{t("impact.water_conserved")}</div>
              <div className="text-2xl font-black text-[#38BDF8] font-mono-data mb-1">
                {ESG_DATA.environmental.waterSavedLiters}
              </div>
              <div className="text-[11px] text-[#6B7280] leading-tight">
                {t("impact.water_desc")}
              </div>
            </div>

            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">{t("impact.energy_optimized")}</div>
              <div className="text-2xl font-black text-[#10B981] font-mono-data mb-1">
                {ESG_DATA.environmental.energyOptimizedKwh}
              </div>
              <div className="text-[11px] text-[#6B7280] leading-tight">
                {t("impact.energy_desc")}
              </div>
            </div>

            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">{t("impact.diverted_landfill")}</div>
              <div className="text-2xl font-black text-amber-400 font-mono-data mb-1">
                {ESG_DATA.environmental.wasteDivertedTons} {t("impact.tons")}
              </div>
              <div className="text-[11px] text-[#6B7280] leading-tight">
                {t("impact.diverted_desc")}
              </div>
            </div>
          </div>

          {/* Area Chart: Monthly CO2 Prevention Trend (12 Months) */}
          <div className="card p-6 border-[#E8ECF3]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#111827]">{t("impact.monthly_co2_title")}</h3>
                <p className="text-xs text-[#6B7280]">{t("impact.monthly_co2_desc")}</p>
              </div>
              <span className="text-xs text-[#059669] font-semibold font-mono-data">
                {t("impact.co2_growth")}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ESG_DATA.monthlyCo2Trend}>
                  <defs>
                    <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit=" T" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1B2138",
                      borderColor: "rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      color: "#F1F5F9",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="co2Tons"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#co2Grad)"
                    name={t("impact.co2_chart_name")}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION 2: SOCIAL METRICS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-400" />
                {t("impact.social_title")}
              </h2>
              <p className="text-xs text-[#6B7280]">
                {t("impact.social_subtitle")}
              </p>
            </div>
            <span className="text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20 font-mono-data">
              {t("impact.sdg2")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">{t("impact.meals_redistributed")}</div>
              <div className="text-2xl font-black text-rose-400 font-mono-data mb-1">
                <CountUp end={ESG_DATA.social.mealsRedistributed} />
              </div>
              <div className="text-[11px] text-[#6B7280]">{t("impact.meals_desc")}</div>
            </div>

            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">{t("impact.people_benefited")}</div>
              <div className="text-2xl font-black text-[#111827] font-mono-data mb-1">
                {ESG_DATA.social.peopleBenefited}
              </div>
              <div className="text-[11px] text-[#6B7280]">{t("impact.people_desc")}</div>
            </div>

            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">{t("impact.active_ngo")}</div>
              <div className="text-2xl font-black text-[#10B981] font-mono-data mb-1">
                {ESG_DATA.social.activeNgoPartners}
              </div>
              <div className="text-[11px] text-[#6B7280]">{t("impact.ngo_desc")}</div>
            </div>

            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">{t("impact.communities_reached")}</div>
              <div className="text-2xl font-black text-[#10B981] font-mono-data mb-1">
                {t("impact.districts")}
              </div>
              <div className="text-[11px] text-[#6B7280]">{t("impact.regions")}</div>
            </div>
          </div>

          {/* Bar Chart: Monthly Meals Trend */}
          <div className="card p-6 border-[#E8ECF3]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#111827]">{t("impact.monthly_meals_title")}</h3>
                <p className="text-xs text-[#6B7280]">{t("impact.monthly_meals_desc")}</p>
              </div>
              <span className="text-xs text-rose-400 font-semibold font-mono-data">
                {t("impact.meals_last_month")}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ESG_DATA.monthlyCo2Trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1B2138",
                      borderColor: "rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      color: "#F1F5F9",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="meals"
                    name={t("impact.meals_chart_name")}
                    fill="#EC4899"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION 3: GOVERNANCE & FSSAI COMPLIANCE */}
        <div className="card p-6 border-[#E8ECF3]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                {t("impact.governance_title")}
              </h2>
              <p className="text-xs text-[#6B7280]">
                {t("impact.governance_subtitle")}
              </p>
            </div>
            <span className="text-xs font-mono-data text-[#059669] font-bold">
              {t("impact.verifiable")}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#F3F4F6]">
              <div className="text-xs text-[#6B7280] mb-1">{t("impact.fssai_compliance")}</div>
              <div className="text-2xl font-bold text-[#059669] font-mono-data">
                {ESG_DATA.governance.fssaiCompliancePct}%
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">{t("impact.zero_violations")}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#F3F4F6]">
              <div className="text-xs text-[#6B7280] mb-1">{t("impact.audit_logs")}</div>
              <div className="text-2xl font-bold text-[#111827] font-mono-data">
                {ESG_DATA.governance.auditLogsRecorded}
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">{t("impact.crypto_hashes")}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#F3F4F6]">
              <div className="text-xs text-[#6B7280] mb-1">{t("impact.data_completeness")}</div>
              <div className="text-2xl font-bold text-[#10B981] font-mono-data">
                {ESG_DATA.governance.dataCompletenessPct}%
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">{t("impact.telemetry_uptime")}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#F3F4F6]">
              <div className="text-xs text-[#6B7280] mb-1">{t("impact.traceability")}</div>
              <div className="text-2xl font-bold text-[#10B981] font-mono-data">
                {ESG_DATA.governance.traceabilityCoveragePct}%
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">{t("impact.farm_to_consumer")}</div>
            </div>
          </div>
        </div>
    </div>
  );
}
