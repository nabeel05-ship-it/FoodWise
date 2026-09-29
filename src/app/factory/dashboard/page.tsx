"use client";

import React, { useState } from "react";
import Link from "next/link";
import { downloadFactoryAuditPdf } from "@/lib/pdfGenerator";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  INSTITUTIONS,
  FACTORY_STORAGE_UNITS,
} from "@/lib/mockData";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  ThermometerSnowflake,
  Activity,
  RefreshCw,
  TrendingDown,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Check,
  Calendar,
  ChevronDown,
  FileText,
  Flame,
  Package,
  Zap,
  Bell,
  Smartphone,
} from "lucide-react";
import FactoryNotificationStatus from "@/components/factory/FactoryNotificationStatus";

export default function FactoryDashboardPage() {
  const { isBatchPrioritized, prioritizeBatch } = useApp();
  const { t } = useLang();
  const [timePeriod, setTimePeriod] = useState<"Today" | "This Week" | "This Month">("Today");
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);

  // Map internal period keys to translation keys
  const periodTranslationKeys: Record<string, string> = {
    "Today": "factory.period_today",
    "This Week": "factory.period_this_week",
    "This Month": "factory.period_this_month",
  };

  // Period-based dynamic metrics
  const PERIOD_DATA = {
    Today: {
      rawMaterial: "34.5K",
      rawSub: t("factory.raw_sub_today"),
      atRisk: 3,
      atRiskHigh: 1,
      atRiskMed: 2,
      atRiskSafe: 12,
      efficiency: "84.2",
      efficiencyTrend: t("factory.eff_trend_today"),
      efficiencyIsUp: false,
      valorized: "1,840",
      valorizedTrend: t("factory.val_trend_today"),
      subTitle: t("factory.subtitle_today"),
    },
    "This Week": {
      rawMaterial: "241.5K",
      rawSub: t("factory.raw_sub_week"),
      atRisk: 7,
      atRiskHigh: 2,
      atRiskMed: 5,
      atRiskSafe: 38,
      efficiency: "88.6",
      efficiencyTrend: t("factory.eff_trend_week"),
      efficiencyIsUp: true,
      valorized: "12,880",
      valorizedTrend: t("factory.val_trend_week"),
      subTitle: t("factory.subtitle_week"),
    },
    "This Month": {
      rawMaterial: "980.2K",
      rawSub: t("factory.raw_sub_month"),
      atRisk: 19,
      atRiskHigh: 4,
      atRiskMed: 15,
      atRiskSafe: 142,
      efficiency: "89.9",
      efficiencyTrend: t("factory.eff_trend_month"),
      efficiencyIsUp: true,
      valorized: "54,320",
      valorizedTrend: t("factory.val_trend_month"),
      subTitle: t("factory.subtitle_month"),
    },
  };

  const currentStats = PERIOD_DATA[timePeriod];

  return (
    <div className="space-y-6">
      {/* ═══ TOP HEADER ═══ */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight" style={{ color: "#111827" }}>
            {t("common.dashboard")}
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            {currentStats.subTitle}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Time Period Selector */}
          <div className="relative">
            <button
              onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all hover:bg-gray-50"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8ECF3",
                color: "#374151",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{t(periodTranslationKeys[timePeriod])}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] transition-transform ${isPeriodDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isPeriodDropdownOpen && (
              <div
                className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-[#E8ECF3] py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {(["Today", "This Week", "This Month"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setTimePeriod(period);
                      setIsPeriodDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${
                      timePeriod === period ? "text-emerald-600 bg-emerald-50/50 font-bold" : "text-[#4B5563]"
                    }`}
                  >
                    <span>{t(periodTranslationKeys[period])}</span>
                    {timePeriod === period && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/factory/spoilage"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all"
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "#EF4444" }}
            />
            {t("factory.spoilage_engine")}
          </Link>

          <a
            href="#factory-notifications"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-bold transition-all bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300"
          >
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>{t("Factory Notification Status")}</span>
          </a>

          <button
            onClick={() => downloadFactoryAuditPdf({ title: `${t("factory.audit_title")} (${t(periodTranslationKeys[timePeriod])})` })}
            className="btn-primary cursor-pointer active:scale-95 transition-all"
          >
            <FileText className="w-4 h-4" />
            {t("common.export_report")}
          </button>
        </div>
      </div>

      {/* ═══ CRITICAL ALERT BANNER ═══ */}
      <div
        className="p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: "#FEF2F2",
          border: "1px solid #FECACA",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#FEE2E2", color: "#DC2626" }}
          >
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded font-mono-data"
                style={{ background: "#DC2626", color: "#FFFFFF" }}
              >
                {t("factory.critical_alert")}
              </span>
              <span className="text-[12px] font-mono-data" style={{ color: "#991B1B" }}>
                {t("factory.alert_batch")}
              </span>
            </div>
            <p className="text-[13px] font-medium" style={{ color: "#991B1B" }}>
              {t("factory.alert_desc")}{" "}
              <strong className="font-mono-data">{t("factory.alert_hours")}</strong> {t("factory.alert_temp_drift")}{" "}
              <span className="underline font-bold">{t("factory.alert_high")}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {isBatchPrioritized ? (
            <span
              className="px-4 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-1.5 whitespace-nowrap"
              style={{
                background: "#ECFDF5",
                color: "#059669",
                border: "1px solid #A7F3D0",
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              {t("factory.prioritized_line")}
            </span>
          ) : (
            <button
              onClick={prioritizeBatch}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all flex items-center justify-center gap-2 whitespace-nowrap hover:scale-105"
              style={{
                background: "#DC2626",
                color: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
              }}
            >
              <span>{t("factory.prioritize_production")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <Link
            href="/factory/spoilage"
            className="btn-secondary whitespace-nowrap"
          >
            {t("factory.details")}
          </Link>
        </div>
      </div>

      {/* ═══ KPI STAT CARDS (4 CARDS) ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Raw Material */}
        <div id="raw-materials" className="stat-card stat-card-indigo p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>
                {t("factory.raw_material")}
              </span>
              <div className="icon-container icon-container-indigo">
                <Boxes className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[28px] font-extrabold font-mono-data mb-1" style={{ color: "#111827" }}>
              {currentStats.rawMaterial} <span className="text-[16px] font-bold" style={{ color: "#6B7280" }}>{t("common.kg")}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="trend-up">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {currentStats.rawSub}
            </span>
          </div>
        </div>

        {/* Card 2: At-Risk Batches */}
        <div className="stat-card stat-card-red p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>
                {t("factory.at_risk_batches")}
              </span>
              <div className="icon-container icon-container-red">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[28px] font-extrabold font-mono-data mb-1" style={{ color: "#111827" }}>
              {currentStats.atRisk}
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-2 text-[11px] font-medium mt-2">
            <span style={{ color: "#DC2626" }}>● {currentStats.atRiskHigh} {t("factory.high")}</span>
            <span style={{ color: "#D97706" }}>● {currentStats.atRiskMed} {t("factory.medium")}</span>
            <span style={{ color: "#059669" }}>● {currentStats.atRiskSafe} {t("factory.safe")}</span>
          </div>
        </div>

        {/* Card 3: Processing Efficiency */}
        <div className="stat-card stat-card-amber p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>
                {t("factory.efficiency")}
              </span>
              <div className="icon-container icon-container-amber">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[28px] font-extrabold font-mono-data mb-1" style={{ color: "#111827" }}>
              {currentStats.efficiency}<span className="text-[16px] font-bold" style={{ color: "#6B7280" }}>%</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className={currentStats.efficiencyIsUp ? "trend-up" : "trend-down"}>
              {currentStats.efficiencyIsUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {currentStats.efficiencyTrend}
            </span>
          </div>
        </div>

        {/* Card 4: Waste Valorized */}
        <div id="byproduct-recovery" className="stat-card stat-card-green p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>
                {t("factory.waste_valorized")}
              </span>
              <div className="icon-container icon-container-green">
                <RefreshCw className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[28px] font-extrabold font-mono-data mb-1" style={{ color: "#111827" }}>
              {currentStats.valorized} <span className="text-[16px] font-bold" style={{ color: "#6B7280" }}>{t("common.kg")}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="trend-up">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {currentStats.valorizedTrend}
            </span>
          </div>
        </div>
      </div>

      {/* ═══ MATERIAL FLOW + STORAGE UNITS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Material Flow (7 cols) */}
        <div id="material-flow" className="lg:col-span-7 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="section-title flex items-center gap-2">
                <Layers className="w-5 h-5" style={{ color: "#10B981" }} />
                {t("factory.material_flow")}
              </h3>
              <p className="section-subtitle">
                {t("factory.material_flow_desc")}
              </p>
            </div>
            <span className="badge badge-indigo font-mono-data">
              {t("factory.batch_size")}
            </span>
          </div>

          <div className="space-y-3 text-[13px]">
            {/* Stage 1 */}
            <div
              className="p-3.5 rounded-xl"
              style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold flex items-center gap-2" style={{ color: "#111827" }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#10B981" }} />
                  {t("factory.stage1")}
                </span>
                <span className="font-mono-data font-bold" style={{ color: "#111827" }}>
                  {t("factory.stage1_qty")}
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: "#E5E7EB" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: "100%", background: "#10B981" }}
                />
              </div>
            </div>

            {/* Minor loss */}
            <div
              className="pl-5 ml-4 py-1 flex items-center justify-between text-[12px]"
              style={{ borderLeft: "2px solid #E5E7EB", color: "#9CA3AF" }}
            >
              <span>{t("factory.washing_loss")}</span>
              <span className="font-mono-data font-semibold" style={{ color: "#374151" }}>
                {t("factory.washing_loss_qty")}
              </span>
            </div>

            {/* Stage 2: Peeling ⚠️ */}
            <div
              className="p-3.5 rounded-xl"
              style={{ background: "#FFF8EB", border: "1px solid #FDE68A" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold flex items-center gap-2" style={{ color: "#92400E" }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: "#D97706" }} />
                  {t("factory.stage2")}
                </span>
                <span className="font-mono-data font-bold" style={{ color: "#D97706" }}>
                  {t("factory.stage2_qty")}
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: "#FDE68A" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: "85%", background: "#F59E0B" }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] mt-2" style={{ color: "#92400E" }}>
                <span>{t("factory.stage2_benchmark")}</span>
                <Link
                  href="/factory/machines"
                  className="underline font-bold"
                  style={{ color: "#D97706" }}
                >
                  {t("factory.view_machine_telemetry")}
                </Link>
              </div>
            </div>

            {/* Minor loss */}
            <div
              className="pl-5 ml-4 py-1 flex items-center justify-between text-[12px]"
              style={{ borderLeft: "2px solid #E5E7EB", color: "#9CA3AF" }}
            >
              <span>{t("factory.slicing_loss")}</span>
              <span className="font-mono-data font-semibold" style={{ color: "#374151" }}>
                {t("factory.slicing_loss_qty")}
              </span>
            </div>

            {/* Stage 3: Frying */}
            <div
              className="p-3.5 rounded-xl"
              style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold" style={{ color: "#111827" }}>
                  {t("factory.stage3")}
                </span>
                <span className="font-mono-data font-semibold" style={{ color: "#374151" }}>
                  {t("factory.stage3_qty")}
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: "#E5E7EB" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: "25%", background: "#10B981" }}
                />
              </div>
            </div>

            {/* Stage 4: Rejection ⚠️ */}
            <div
              className="p-3.5 rounded-xl"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold flex items-center gap-2" style={{ color: "#991B1B" }}>
                  <AlertCircle className="w-4 h-4" style={{ color: "#DC2626" }} />
                  {t("factory.stage4")}
                </span>
                <span className="font-mono-data font-bold" style={{ color: "#DC2626" }}>
                  {t("factory.stage4_qty")}
                </span>
              </div>
              <div className="text-[11px]" style={{ color: "#991B1B" }}>
                {t("factory.stage4_desc")}
              </div>
            </div>

            {/* Final Output */}
            <div
              className="p-4 rounded-xl flex items-center justify-between"
              style={{
                background: "#ECFDF5",
                border: "1px solid #A7F3D0",
              }}
            >
              <div>
                <div className="font-bold text-[15px]" style={{ color: "#111827" }}>
                  {t("factory.final_output")}
                </div>
                <div className="text-[12px]" style={{ color: "#059669" }}>
                  {t("factory.ready_dispatch")}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono-data text-[18px] font-bold" style={{ color: "#059669" }}>
                  {t("factory.final_qty")}
                </div>
                <div className="text-[11px]" style={{ color: "#9CA3AF" }}>
                  {t("factory.target_gap")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Units (5 cols) */}
        <div id="storage-units" className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="section-title flex items-center gap-2">
                <ThermometerSnowflake className="w-5 h-5" style={{ color: "#3B82F6" }} />
                {t("factory.cold_storage_monitors")}
              </h3>
              <p className="section-subtitle">{t("factory.live_sensors")}</p>
            </div>
            <span className="badge badge-success font-mono-data">{t("factory.units_online")}</span>
          </div>

          <div className="space-y-3">
            {FACTORY_STORAGE_UNITS.map((unit) => {
              const isWarning = unit.status === "ATTENTION_NEEDED";
              return (
                <div
                  key={unit.id}
                  className="p-4 rounded-2xl transition-all"
                  style={{
                    background: isWarning ? "#FFF8EB" : "#FFFFFF",
                    border: isWarning ? "1px solid #FDE68A" : "1px solid #E8ECF3",
                    boxShadow: isWarning
                      ? "0 2px 8px rgba(245,158,11,0.1)"
                      : "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{unit.icon}</span>
                      <div>
                        <h4 className="font-bold text-[14px]" style={{ color: "#111827" }}>
                          {unit.name}
                        </h4>
                        <div className="text-[11px]" style={{ color: "#9CA3AF" }}>
                          {unit.crop}
                        </div>
                      </div>
                    </div>

                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase font-mono-data"
                      style={{
                        background: isWarning ? "#FDE68A" : "#D1FAE5",
                        color: isWarning ? "#92400E" : "#059669",
                      }}
                    >
                      {isWarning ? t("factory.status_attention") : t("factory.status_good")}
                    </span>
                  </div>

                  <div
                    className="grid grid-cols-3 gap-2 p-3 rounded-xl text-[12px] text-center mb-3"
                    style={{ background: isWarning ? "#FEF3C7" : "#F9FAFB", border: "1px solid " + (isWarning ? "#FDE68A" : "#F3F4F6") }}
                  >
                    <div>
                      <div className="text-[10px]" style={{ color: "#9CA3AF" }}>{t("factory.stock")}</div>
                      <div className="font-mono-data font-bold" style={{ color: "#111827" }}>
                        {unit.stockKg.toLocaleString()} {t("common.kg")}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px]" style={{ color: "#9CA3AF" }}>{t("factory.temp")}</div>
                      <div
                        className="font-mono-data font-bold"
                        style={{ color: isWarning ? "#D97706" : "#059669" }}
                      >
                        {unit.tempCelsius}°C {isWarning ? "⚠️" : "✅"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px]" style={{ color: "#9CA3AF" }}>{t("factory.shelf_life")}</div>
                      <div
                        className="font-mono-data font-bold"
                        style={{
                          color: unit.shelfLifeDays <= 5 ? "#D97706" : "#374151",
                        }}
                      >
                        {unit.shelfLifeDays} {t("factory.days")}
                      </div>
                    </div>
                  </div>

                  {isWarning && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-semibold" style={{ color: "#92400E" }}>
                        {t("factory.temp_exceeded")}
                      </span>
                      <Link
                        href="/factory/spoilage"
                        className="px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors"
                        style={{
                          background: "#F59E0B",
                          color: "#FFFFFF",
                        }}
                      >
                        {t("factory.view_spoilage_risk")}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ FACTORY PUSH NOTIFICATION STATUS & MOBILE SIMULATOR ═══ */}
      <FactoryNotificationStatus />
    </div>
  );
}
