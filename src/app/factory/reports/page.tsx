"use client";

import React, { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { downloadFactoryAuditPdf } from "@/lib/pdfGenerator";
import {
  Factory,
  Layers,
  Cpu,
  RefreshCw,
  TrendingUp,
  Download,
  FileCheck2,
  AlertOctagon,
  CheckCircle2,
  Boxes,
  ThermometerSnowflake,
  Zap,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";

export default function FactoryReportsPage() {
  const { t } = useLang();
  const [selectedLine, setSelectedLine] = useState<"ALL" | "Line 1" | "Line 2" | "Line 3">("ALL");
  const [timePeriod, setTimePeriod] = useState<"Weekly Mass Balance" | "Monthly Audit" | "Annual ESG">("Weekly Mass Balance");
  const [downloading, setDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Time period display labels
  const timePeriodLabels: Record<string, string> = {
    "Weekly Mass Balance": t("factory.report.weekly_mass_balance"),
    "Monthly Audit": t("factory.report.monthly_audit"),
    "Annual ESG": t("factory.report.annual_esg"),
  };

  // Line filter display labels
  const lineLabels: Record<string, string> = {
    "ALL": t("factory.report.all_lines"),
    "Line 1": t("factory.report.line1_label"),
    "Line 2": t("factory.report.line2_label"),
    "Line 3": t("factory.report.line3_label"),
  };

  // Mass Balance Waterfall Stages
  const massBalanceStages = [
    { stage: "Raw Intake", inputMT: 148.4, outputMT: 148.4, lossMT: 0, efficiency: "100%" },
    { stage: "Wash & Optical Sort", inputMT: 148.4, outputMT: 144.2, lossMT: 4.2, efficiency: "97.2%" },
    { stage: "Peeling & Trim", inputMT: 144.2, outputMT: 133.5, lossMT: 10.7, efficiency: "92.6%" },
    { stage: "Flash Pasteurization", inputMT: 133.5, outputMT: 128.8, lossMT: 4.7, efficiency: "96.5%" },
    { stage: "Aseptic Packaging", inputMT: 128.8, outputMT: 126.2, lossMT: 2.6, efficiency: "98.0%" },
  ];

  // Daily yield vs scrap trend
  const yieldTrendData = [
    { day: "Mon", yieldPct: 91.2, scrapPct: 8.8, targetYield: 90.0, energyKwh: 420 },
    { day: "Tue", yieldPct: 92.5, scrapPct: 7.5, targetYield: 90.0, energyKwh: 395 },
    { day: "Wed", yieldPct: 89.8, scrapPct: 10.2, targetYield: 90.0, energyKwh: 450 },
    { day: "Thu", yieldPct: 93.1, scrapPct: 6.9, targetYield: 90.0, energyKwh: 380 },
    { day: "Fri", yieldPct: 92.8, scrapPct: 7.2, targetYield: 90.0, energyKwh: 390 },
    { day: "Sat", yieldPct: 94.0, scrapPct: 6.0, targetYield: 90.0, energyKwh: 360 },
    { day: "Sun", yieldPct: 93.5, scrapPct: 6.5, targetYield: 90.0, energyKwh: 375 },
  ];

  // Machine OEE & Anomaly Logs
  const machineAuditLogs = [
    {
      machineId: "PM-01 (Continuous Steam Peeler)",
      line: "Line 1",
      oee: "94.2%",
      vibrationMmS: "1.8 mm/s (Normal)",
      spoilageRisk: "Low",
      preventiveAction: "Thermal seals calibrated on shift change",
      status: "Optimal",
    },
    {
      machineId: "PM-03 (High-Speed Rotary Slicer)",
      line: "Line 1",
      oee: "88.6%",
      vibrationMmS: "4.2 mm/s (Elevated)",
      spoilageRisk: "Medium",
      preventiveAction: "Work Order #WO-891 assigned to Senior Mechanic Rajesh Kumar",
      status: "Under Watch",
    },
    {
      machineId: "PM-02 (Flash Pasteurizer Unit)",
      line: "Line 2",
      oee: "96.4%",
      vibrationMmS: "1.2 mm/s (Normal)",
      spoilageRisk: "Low",
      preventiveAction: "CIP sterilization cycle verified compliant",
      status: "Optimal",
    },
    {
      machineId: "PM-04 (Aseptic Tetra Fill Line)",
      line: "Line 3",
      oee: "92.0%",
      vibrationMmS: "2.1 mm/s (Normal)",
      spoilageRisk: "Low",
      preventiveAction: "Vacuum seal pressure checked every 30 minutes",
      status: "Optimal",
    },
  ];

  const handleExport = (type: string) => {
    setDownloading(true);
    if (type.includes("PDF")) {
      downloadFactoryAuditPdf({
        title: type,
        facilityName: "Punjab Agro Processing Facility #4",
        plantCode: "PB-IND-004",
      });
    } else {
      const csvContent = "data:text/csv;charset=utf-8," +
        "MachineId,Line,OEE,Vibration,SpoilageRisk,PreventiveAction,Status\n" +
        machineAuditLogs.map(m => `"${m.machineId}","${m.line}","${m.oee}","${m.vibrationMmS}","${m.spoilageRisk}","${m.preventiveAction}","${m.status}"`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "FoodWise_Factory_Audit.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setTimeout(() => {
      setDownloading(false);
      setToastMessage(`${type} ${t("factory.report.compiled_downloaded")}`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#10B981] text-white px-4 py-3 rounded-xl shadow-xl text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              {t("factory.report.badge")}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500 font-medium">
              {t("factory.report.plant_id")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            {t("factory.report.title")}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            {t("factory.report.subtitle")}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white border border-[#E5E7EB] rounded-xl p-1 shadow-sm text-xs font-semibold text-[#374151]">
            {(["Weekly Mass Balance", "Monthly Audit", "Annual ESG"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  timePeriod === period
                    ? "bg-[#10B981] text-white shadow-xs"
                    : "hover:bg-gray-100 text-[#6B7280]"
                }`}
              >
                {timePeriodLabels[period]}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleExport("ISO 22000 Mass Balance Audit (PDF)")}
            disabled={downloading}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#111827] text-xs font-semibold border border-[#E5E7EB] shadow-sm transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#10B981]" />
            {downloading ? t("factory.report.exporting") : t("factory.report.iso_audit")}
          </button>

          <button
            onClick={() => handleExport("CPCB Industrial Scrap Summary (CSV)")}
            className="px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            CPCB CSV
          </button>
        </div>
      </div>

      {/* 4 FACTORY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Conversion Yield */}
        <div className="stat-card stat-card-indigo p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#6B7280]">
              {t("factory.report.overall_conversion_yield")}
            </span>
            <div className="icon-container icon-container-indigo">
              <Factory className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data text-[#111827] mb-1">
            92.4%
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="trend-up flex items-center gap-0.5 text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {t("factory.report.vs_industry_baseline")}
            </span>
            <span className="text-gray-400">• {t("factory.report.high_conversion")}</span>
          </div>
        </div>

        {/* Card 2: Raw Biomass Processed */}
        <div className="stat-card stat-card-emerald p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#6B7280]">
              {t("factory.report.biomass_processed_week")}
            </span>
            <div className="icon-container icon-container-emerald">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data text-[#111827] mb-1">
            148.4 <span className="text-base font-normal text-gray-500">MT</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-700 font-semibold">
              126.2 MT {t("factory.report.finished_goods")}
            </span>
            <span className="text-gray-400">• 0 {t("factory.report.landfill")}</span>
          </div>
        </div>

        {/* Card 3: Valorization Rate */}
        <div className="stat-card stat-card-cyan p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#6B7280]">
              {t("factory.report.byproduct_valorization")}
            </span>
            <div className="icon-container icon-container-cyan">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data text-[#111827] mb-1">
            88.6%
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-cyan-700 font-semibold">
              22.2 MT {t("factory.report.diverted")}
            </span>
            <span className="text-gray-400">• {t("factory.report.animal_feed_biogas")}</span>
          </div>
        </div>

        {/* Card 4: Financial Loss Avoidance */}
        <div className="stat-card stat-card-amber p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#6B7280]">
              {t("factory.report.prevented_downtime_cost")}
            </span>
            <div className="icon-container icon-container-amber">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data text-[#111827] mb-1">
            ₹4,20,000
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="trend-up flex items-center gap-0.5 text-amber-700 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              {t("factory.report.downtime_avoided")}
            </span>
          </div>
        </div>
      </div>

      {/* STAGE-WISE MASS BALANCE & YIELD CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Waterfall Mass Balance Table (6 cols) */}
        <div className="lg:col-span-6 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">{t("factory.report.stage_wise_title")}</h3>
              <p className="section-subtitle">
                {t("factory.report.material_flow_desc")}
              </p>
            </div>
            <span className="badge badge-success font-mono-data">{t("factory.report.batch")} #TOM-2024-0234</span>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>{t("factory.report.processing_stage")}</th>
                  <th>{t("factory.report.inflow_mt")}</th>
                  <th>{t("factory.report.outflow_mt")}</th>
                  <th>{t("factory.report.loss_scrap")}</th>
                  <th>{t("factory.report.efficiency")}</th>
                </tr>
              </thead>
              <tbody>
                {massBalanceStages.map((stage) => (
                  <tr key={stage.stage}>
                    <td className="font-semibold text-gray-900">{stage.stage}</td>
                    <td className="font-mono-data text-gray-700">{stage.inputMT}</td>
                    <td className="font-mono-data text-gray-900 font-bold">{stage.outputMT}</td>
                    <td className="font-mono-data text-rose-600">
                      {stage.lossMT > 0 ? `-${stage.lossMT} MT` : "0.0 MT"}
                    </td>
                    <td>
                      <span className="font-mono-data text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {stage.efficiency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
            <span>{t("factory.report.overall_shrinkage")} <strong>15.0%</strong></span>
            <span className="text-emerald-700 font-semibold">{t("factory.report.scrap_redirected")}</span>
          </div>
        </div>

        {/* Daily Yield % and Energy Efficiency Chart (6 cols) */}
        <div className="lg:col-span-6 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">{t("factory.report.weekly_yield_title")}</h3>
              <p className="section-subtitle">{t("factory.report.yield_subtitle")}</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-gray-700">
                <span className="w-3 h-3 rounded-sm bg-[#10B981]" /> {t("factory.report.daily_yield_pct")}
              </span>
              <span className="flex items-center gap-1.5 text-gray-700">
                <span className="w-3 h-1 bg-[#6366F1]" /> {t("factory.report.target_label")} (90%)
              </span>
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="factoryYieldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[85, 96]} stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderRadius: "12px",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="yieldPct" name={t("factory.report.yield_pct")} stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#factoryYieldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
            <span>{t("factory.report.peak_yield")} <strong>94.0% ({t("factory.report.saturday")})</strong></span>
            <span className="text-emerald-700 font-semibold">{t("factory.report.avg_scrap_rate")}</span>
          </div>
        </div>
      </div>

      {/* MACHINE TELEMETRY & PREVENTIVE LOSS AUDIT */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="section-title">{t("factory.report.machinery_audit_title")}</h3>
            <p className="section-subtitle">
              {t("factory.report.machinery_audit_subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">{t("factory.report.filter_line")}</span>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value as any)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none"
            >
              <option value="ALL">{t("factory.report.all_lines")}</option>
              <option value="Line 1">{t("factory.report.line1_label")}</option>
              <option value="Line 2">{t("factory.report.line2_label")}</option>
              <option value="Line 3">{t("factory.report.line3_label")}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>{t("factory.report.machine_asset_id")}</th>
                <th>{t("factory.report.line")}</th>
                <th>{t("factory.report.oee_index")}</th>
                <th>{t("factory.report.vibration_telemetry")}</th>
                <th>{t("factory.report.spoilage_risk")}</th>
                <th>{t("factory.report.preventive_action")}</th>
                <th>{t("factory.report.status")}</th>
              </tr>
            </thead>
            <tbody>
              {machineAuditLogs
                .filter((m) => selectedLine === "ALL" || m.line === selectedLine)
                .map((m) => (
                  <tr key={m.machineId}>
                    <td className="font-bold text-gray-900">{m.machineId}</td>
                    <td className="text-xs text-gray-600">{m.line}</td>
                    <td className="font-mono-data font-semibold text-gray-900">{m.oee}</td>
                    <td className="font-mono-data text-xs">{m.vibrationMmS}</td>
                    <td>
                      <span
                        className={`text-xs font-bold ${
                          m.spoilageRisk === "Low" ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {m.spoilageRisk} {t("factory.report.risk")}
                      </span>
                    </td>
                    <td className="text-xs text-gray-600 max-w-xs">{m.preventiveAction}</td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border ${
                          m.status === "Optimal"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {m.status === "Optimal" ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <AlertOctagon className="w-3 h-3 text-amber-600" />
                        )}
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            {t("factory.report.certification_label")} <strong>IND-FS-884920</strong> • {t("factory.report.recertification")}
          </div>
          <button
            onClick={() => handleExport("Preventive Maintenance & Loss Log (PDF)")}
            className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2"
          >
            {t("factory.report.download_vibration_log")}
          </button>
        </div>
      </div>
    </div>
  );
}
