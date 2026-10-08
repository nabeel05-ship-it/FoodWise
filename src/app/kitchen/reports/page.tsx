"use client";

import React, { useState, useMemo } from "react";
import { useLang } from "@/context/LanguageContext";
import { downloadKitchenAuditPdf } from "@/lib/pdfGenerator";
import {
  BarChart3,
  Calendar,
  Download,
  Printer,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Scale,
  UtensilsCrossed,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  HeartHandshake,
  DollarSign,
  FileSpreadsheet,
  Layers,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function KitchenReportsPage() {
  const { t } = useLang();
  const [timeRange, setTimeRange] = useState<"This Week" | "This Month" | "Last 30 Days">("This Week");
  const [selectedMeal, setSelectedMeal] = useState<"ALL" | "Breakfast" | "Lunch" | "Dinner">("ALL");
  const [downloading, setDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Weekly Audit Data
  const dailyAuditData = [
    { day: "Mon", prepWaste: 18, plateWaste: 24, total: 42, target: 45, saved: 14 },
    { day: "Tue", prepWaste: 16, plateWaste: 21, total: 37, target: 45, saved: 18 },
    { day: "Wed", prepWaste: 19, plateWaste: 26, total: 45, target: 45, saved: 12 },
    { day: "Thu", prepWaste: 14, plateWaste: 19, total: 33, target: 45, saved: 22 },
    { day: "Fri", prepWaste: 15, plateWaste: 22, total: 37, target: 45, saved: 20 },
    { day: "Sat", prepWaste: 12, plateWaste: 18, total: 30, target: 40, saved: 19 },
    { day: "Sun", prepWaste: 13, plateWaste: 17, total: 30, target: 40, saved: 21 },
  ];

  // Category breakdown
  const categoryData = [
    { name: "Cooked Rice & Biryani", value: 34, color: "#10B981" },
    { name: "Roti & Naan Breads", value: 26, color: "#6366F1" },
    { name: "Dal & Curry Gravies", value: 20, color: "#F59E0B" },
    { name: "Prep Peels & Trimmings", value: 12, color: "#8B5CF6" },
    { name: "Salads & Perishables", value: 8, color: "#EC4899" },
  ];

  // Meal service performance logs
  const mealLogs = [
    {
      date: "Sep 25, 2026",
      meal: "Lunch",
      dinersServed: 842,
      plannedMeals: 850,
      variance: "-0.9%",
      prepWasteKg: 5.2,
      plateWasteKg: 8.6,
      surplusDonatedKg: 14.5,
      fssaiTemp: "69.4°C",
      status: "Compliant",
    },
    {
      date: "Sep 25, 2026",
      meal: "Breakfast",
      dinersServed: 564,
      plannedMeals: 580,
      variance: "-2.7%",
      prepWasteKg: 3.8,
      plateWasteKg: 5.4,
      surplusDonatedKg: 8.0,
      fssaiTemp: "71.2°C",
      status: "Compliant",
    },
    {
      date: "Sep 24, 2026",
      meal: "Dinner",
      dinersServed: 788,
      plannedMeals: 790,
      variance: "-0.2%",
      prepWasteKg: 6.1,
      plateWasteKg: 9.2,
      surplusDonatedKg: 18.0,
      fssaiTemp: "68.8°C",
      status: "Compliant",
    },
    {
      date: "Sep 24, 2026",
      meal: "Lunch",
      dinersServed: 865,
      plannedMeals: 860,
      variance: "+0.6%",
      prepWasteKg: 4.9,
      plateWasteKg: 7.8,
      surplusDonatedKg: 12.0,
      fssaiTemp: "70.1°C",
      status: "Compliant",
    },
    {
      date: "Sep 23, 2026",
      meal: "Dinner",
      dinersServed: 770,
      plannedMeals: 800,
      variance: "-3.7%",
      prepWasteKg: 5.8,
      plateWasteKg: 8.9,
      surplusDonatedKg: 22.0,
      fssaiTemp: "67.9°C",
      status: "Compliant",
    },
  ];

  const handleExport = (type: "PDF" | "CSV") => {
    setDownloading(true);
    if (type === "PDF") {
      downloadKitchenAuditPdf({
        period: "Monthly Warden Audit",
        facilityName: "IIT Delhi Central Mess",
        facilityCode: "DL-KIT-001",
      });
    } else {
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Date,MealService,PlannedMeals,DinersServed,SurplusKg,FssaiTemp,Status\n" +
        mealLogs.map(r => `"${r.date}","${r.meal}","${r.plannedMeals}","${r.dinersServed}","${r.surplusDonatedKg}","${r.fssaiTemp}","${r.status}"`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "FoodWise_Kitchen_Audit.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setTimeout(() => {
      setDownloading(false);
      setToastMessage(t("kitchen.report.downloadSuccess").replace("{type}", type));
      setTimeout(() => setToastMessage(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
            <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
              {t("kitchen.report.badge")}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500 font-medium">
              {t("kitchen.report.facilityInfo")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            {t("kitchen.report.pageTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            {t("kitchen.report.pageSubtitle")}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white border border-[#E5E7EB] rounded-xl p-1 shadow-sm text-xs font-semibold text-[#374151]">
            {(["This Week", "This Month", "Last 30 Days"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  timeRange === range
                    ? "bg-[#10B981] text-white shadow-xs"
                    : "hover:bg-gray-100 text-[#6B7280]"
                }`}
              >
                {range === "This Week" ? t("kitchen.report.thisWeek") : range === "This Month" ? t("kitchen.report.thisMonth") : t("kitchen.report.last30Days")}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleExport("PDF")}
            disabled={downloading}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#111827] text-xs font-semibold border border-[#E5E7EB] shadow-sm transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#10B981]" />
            {downloading ? t("kitchen.report.exporting") : t("kitchen.report.auditPdf")}
          </button>

          <button
            onClick={() => handleExport("CSV")}
            className="px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            {t("kitchen.report.exportCsv")}
          </button>
        </div>
      </div>

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Waste */}
        <div className="stat-card stat-card-emerald p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#6B7280]">
              {t("kitchen.report.totalKitchenWaste")}
            </span>
            <div className="icon-container icon-container-emerald">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data text-[#111827] mb-1">
            254 <span className="text-base font-normal text-gray-500">{t("kitchen.report.kg")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="trend-down flex items-center gap-0.5 text-emerald-600 font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {t("kitchen.report.vsLastWeek")}
            </span>
            <span className="text-gray-400">• {t("kitchen.report.goalKg")}</span>
          </div>
        </div>

        {/* Card 2: Portion Planning Accuracy */}
        <div className="stat-card stat-card-indigo p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#6B7280]">
              Planning Accuracy
            </span>
            <div className="icon-container icon-container-indigo">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data text-[#111827] mb-1">
            97.4%
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="trend-up flex items-center gap-0.5 text-indigo-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {t("kitchen.report.improvement")}
            </span>
            <span className="text-gray-400">• {t("kitchen.report.varianceThreshold")}</span>
          </div>
        </div>

        {/* Card 3: Surplus Meals Rescued */}
        <div className="stat-card stat-card-amber p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#6B7280]">
              {t("kitchen.report.mealsDonated")}
            </span>
            <div className="icon-container icon-container-amber">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data text-[#111827] mb-1">
            1,480 <span className="text-base font-normal text-gray-500">{t("kitchen.report.meals")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-amber-700 font-semibold">
              {t("kitchen.report.edibleFoodSaved")}
            </span>
            <span className="text-gray-400">• {t("kitchen.report.zeroLandfill")}</span>
          </div>
        </div>

        {/* Card 4: Financial Savings */}
        <div className="stat-card stat-card-cyan p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#6B7280]">
              {t("kitchen.report.monthlyCostAvoidance")}
            </span>
            <div className="icon-container icon-container-cyan">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data text-[#111827] mb-1">
            ₹84,350
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="trend-up flex items-center gap-0.5 text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              {t("kitchen.report.vsBudget")}
            </span>
            <span className="text-gray-400">• {t("kitchen.report.rationOptimization")}</span>
          </div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Prep vs Plate Waste Chart (8 cols) */}
        <div className="lg:col-span-8 card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="section-title">{t("kitchen.report.dailyWasteAuditTitle")}</h3>
              <p className="section-subtitle">
                {t("kitchen.report.dailyWasteAuditSubtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                <span className="w-3 h-3 rounded-sm bg-[#10B981]" /> {t("kitchen.report.prepWaste")}
              </span>
              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" /> {t("kitchen.report.plateScraps")}
              </span>
              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                <span className="w-3 h-1 bg-[#EF4444]" /> {t("kitchen.report.thresholdTarget")}
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyAuditData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderRadius: "12px",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  }}
                />
                <Bar dataKey="prepWaste" name={t("kitchen.report.prepWasteKg")} stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="plateWaste" name={t("kitchen.report.plateScrapsKg")} stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t("kitchen.report.belowLimit")}</span>
            </div>
            <span className="font-semibold text-emerald-700">{t("kitchen.report.weeklyTotal")}</span>
          </div>
        </div>

        {/* Waste Category Breakdown (4 cols) */}
        <div className="lg:col-span-4 card p-6 flex flex-col justify-between">
          <div>
            <h3 className="section-title">{t("kitchen.report.wastedFoodComposition")}</h3>
            <p className="section-subtitle">{t("kitchen.report.categoricalBreakdown")}</p>

            <div className="h-[180px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-gray-700 font-medium">{cat.name}</span>
                  </div>
                  <span className="font-mono-data font-bold text-gray-900">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>{t("kitchen.report.insight")}</strong> {t("kitchen.report.insightText")}
            </span>
          </div>
        </div>
      </div>

      {/* MEAL-BY-MEAL AUDIT LOG TABLE */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="section-title">{t("kitchen.report.officialLogbook")}</h3>
            <p className="section-subtitle">
              {t("kitchen.report.logbookSubtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">{t("kitchen.report.filterMeal")}</span>
            <select
              value={selectedMeal}
              onChange={(e) => setSelectedMeal(e.target.value as "ALL" | "Breakfast" | "Lunch" | "Dinner")}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none"
            >
              <option value="ALL">{t("kitchen.report.allMeals")}</option>
              <option value="Breakfast">{t("kitchen.report.breakfast")}</option>
              <option value="Lunch">{t("kitchen.report.lunch")}</option>
              <option value="Dinner">{t("kitchen.report.dinner")}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>{t("kitchen.report.serviceDatetime")}</th>
                <th>{t("kitchen.report.dinersServed")}</th>
                <th>Planned Meals</th>
                <th>{t("kitchen.report.variance")}</th>
                <th>{t("kitchen.report.prepWaste")}</th>
                <th>{t("kitchen.report.plateWaste")}</th>
                <th>{t("kitchen.report.donatedSurplus")}</th>
                <th>{t("kitchen.report.fssaiSafeTemp")}</th>
                <th>{t("kitchen.report.complianceStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {mealLogs
                .filter((log) => selectedMeal === "ALL" || log.meal === selectedMeal)
                .map((log, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="font-bold text-gray-900">{log.meal}</div>
                      <div className="text-[11px] text-gray-500">{log.date}</div>
                    </td>
                    <td className="font-mono-data font-semibold text-gray-900">{log.dinersServed}</td>
                    <td className="font-mono-data text-gray-500">{log.plannedMeals}</td>
                    <td>
                      <span
                        className={`text-xs font-bold font-mono-data ${
                          log.variance.startsWith("-") ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {log.variance}
                      </span>
                    </td>
                    <td className="font-mono-data text-gray-700">{log.prepWasteKg} {t("kitchen.report.kg")}</td>
                    <td className="font-mono-data text-gray-700">{log.plateWasteKg} {t("kitchen.report.kg")}</td>
                    <td>
                      <span className="badge badge-success font-mono-data">
                        +{log.surplusDonatedKg} {t("kitchen.report.kg")}
                      </span>
                    </td>
                    <td className="font-mono-data font-semibold text-emerald-700">{log.fssaiTemp}</td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {t("kitchen.report.compliant")}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            {t("kitchen.report.fssaiLicense")}
          </div>
          <button
            onClick={() => handleExport("PDF")}
            className="text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2"
          >
            {t("kitchen.report.downloadWardenReport")}
          </button>
        </div>
      </div>
    </div>
  );
}
