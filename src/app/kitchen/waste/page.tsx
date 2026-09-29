"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  WEEKLY_WASTE_BY_CATEGORY,
} from "@/lib/mockData";
import {
  Trash2,
  TrendingDown,
  TrendingUp,
  Scale,
  Sparkles,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Calendar,
  ChevronDown,
  FileText,
  PieChart as PieIcon,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Utensils,
  Leaf,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const WASTE_CATEGORIES = [
  { name: "Rice & Grains", value: 38, kg: 27.7, color: "#10B981", reduction: "-12%" },
  { name: "Dal & Curries", value: 27, kg: 19.7, color: "#F59E0B", reduction: "-8%" },
  { name: "Vegetables & Greens", value: 22, kg: 16.1, color: "#3B82F6", reduction: "-15%" },
  { name: "Bread & Roti", value: 13, kg: 9.5, color: "#EC4899", reduction: "+4%" },
];

const IOT_SCALES = [
  {
    id: "WS-01",
    name: "Student Plate Return Scraping Station",
    location: "Dining Hall Exit",
    currentWeight: 14.8,
    dailyTotal: 42.5,
    status: "ACTIVE",
    lastPing: "Just now",
  },
  {
    id: "WS-02",
    name: "Prep Kitchen Vegetable Trimming Table",
    location: "Central Prep Area",
    currentWeight: 6.2,
    dailyTotal: 18.2,
    status: "ACTIVE",
    lastPing: "1 min ago",
  },
  {
    id: "WS-03",
    name: "Bulk Buffet Leftover Scale",
    location: "Serving Counter B",
    currentWeight: 0.0,
    dailyTotal: 12.3,
    status: "STANDBY",
    lastPing: "4 mins ago",
  },
];

export default function KitchenWasteTrackingPage() {
  const { t } = useLang();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logCategory, setLogCategory] = useState("Rice & Grains");
  const [logWeight, setLogWeight] = useState<number>(5.5);
  const [logStation, setLogStation] = useState("WS-01");
  const [logNotes, setLogNotes] = useState("Over-prepared Friday lunch basmati rice");
  const [logSuccess, setLogSuccess] = useState(false);

  const [recentLogs, setRecentLogs] = useState([
    {
      id: "WL-901",
      time: "14:15 Today",
      category: "Rice & Grains",
      weightKg: 8.4,
      source: "Buffet Counter",
      divertedTo: "Feeding India (NGO)",
      verified: true,
    },
    {
      id: "WL-900",
      time: "13:45 Today",
      category: "Dal & Curries",
      weightKg: 6.1,
      source: "Preparation Pot 2",
      divertedTo: "Robin Hood Army",
      verified: true,
    },
    {
      id: "WL-899",
      time: "09:30 Today",
      category: "Bread & Roti",
      weightKg: 4.2,
      source: "Breakfast Line",
      divertedTo: "Campus Biogas Digester",
      verified: true,
    },
  ]);

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: `WL-${Math.floor(1000 + Math.random() * 9000)}`,
      time: "Just now",
      category: logCategory,
      weightKg: Number(logWeight),
      source: logStation === "WS-01" ? "Plate Scraping" : logStation === "WS-02" ? "Vegetable Trimming" : "Buffet Counter",
      divertedTo: "Pending Redistribution",
      verified: true,
    };
    setRecentLogs([newEntry, ...recentLogs]);
    setLogSuccess(true);
    setTimeout(() => {
      setLogSuccess(false);
      setIsLogModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              {t("kitchen.waste.badge")}
            </span>
            <span className="text-[#D1D5DB]">•</span>
            <span className="text-xs text-[#9CA3AF]">{t("kitchen.waste.sub_badge")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            {t("kitchen.waste.title")}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            {t("kitchen.waste.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            {t("kitchen.waste.log_waste_entry")}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card stat-card-indigo p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("kitchen.waste.todays_recorded_waste")}</span>
            <div className="icon-container icon-container-indigo">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-[#111827]">
            73.0 <span className="text-sm font-bold text-[#6B7280]">{t("kitchen.waste.kg")}</span>
          </div>
          <div className="text-[11px] text-[#059669] font-semibold mt-1">
            {t("kitchen.waste.vs_campus_avg")}
          </div>
        </div>

        <div className="stat-card stat-card-green p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("kitchen.waste.landfill_diversion_rate")}</span>
            <div className="icon-container icon-container-green">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-[#059669]">
            91.4%
          </div>
          <div className="text-[11px] text-[#6B7280] mt-1">
            {t("kitchen.waste.surplus_to_ngos")}
          </div>
        </div>

        <div className="stat-card stat-card-amber p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("kitchen.waste.plate_waste_per_diner")}</span>
            <div className="icon-container icon-container-amber">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-amber-600">
            52 <span className="text-sm font-bold text-[#6B7280]">{t("kitchen.waste.grams")}</span>
          </div>
          <div className="text-[11px] text-[#6B7280] mt-1">
            {t("kitchen.waste.target_benchmark")}
          </div>
        </div>

        <div className="stat-card stat-card-emerald p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("kitchen.waste.active_iot_scales")}</span>
            <div className="icon-container" style={{ background: "#ECFDF5", color: "#059669" }}>
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-[#111827]">
            3 / 3 <span className="text-sm font-bold text-[#059669]">{t("kitchen.waste.online")}</span>
          </div>
          <div className="text-[11px] text-[#6B7280] mt-1">
            {t("kitchen.waste.calibrated_ble")}
          </div>
        </div>
      </div>

      {/* IoT Scales Live Grid */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              {t("kitchen.waste.connected_iot_scales")}
            </h3>
            <p className="section-subtitle">{t("kitchen.waste.realtime_weight_logs")}</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {t("kitchen.waste.auto_sync")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {IOT_SCALES.map((scale) => (
            <div
              key={scale.id}
              className="p-4 rounded-2xl border border-[#E8ECF3] bg-gradient-to-b from-white to-[#FAFBFC] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono-data">
                    {scale.id}
                  </span>
                  <h4 className="text-sm font-bold text-[#111827] mt-1">{scale.name}</h4>
                  <p className="text-[11px] text-[#6B7280]">{scale.location}</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-1" />
              </div>

              <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#9CA3AF] uppercase block font-semibold">{t("kitchen.waste.live_load")}</span>
                  <span className="text-lg font-black font-mono-data text-[#111827]">
                    {scale.currentWeight} {t("kitchen.waste.kg")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#9CA3AF] uppercase block font-semibold">{t("kitchen.waste.today_total")}</span>
                  <span className="text-lg font-black font-mono-data text-emerald-600">
                    {scale.dailyTotal} {t("kitchen.waste.kg")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Waste Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend (8 cols) */}
        <div className="lg:col-span-8 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">{t("kitchen.waste.weekly_waste_title")}</h3>
              <p className="section-subtitle">{t("kitchen.waste.weekly_waste_subtitle")}</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_WASTE_BY_CATEGORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
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
                <Bar dataKey="grains" name={t("kitchen.waste.chart_rice_grains")} fill="#10B981" stackId="a" />
                <Bar dataKey="curry" name={t("kitchen.waste.chart_dal_curry")} fill="#F59E0B" stackId="a" />
                <Bar dataKey="vegetables" name={t("kitchen.waste.chart_vegetables")} fill="#3B82F6" stackId="a" />
                <Bar dataKey="other" name={t("kitchen.waste.chart_bread_other")} fill="#D1D5DB" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Breakdown (4 cols) */}
        <div className="lg:col-span-4 card p-6">
          <div className="mb-3">
            <h3 className="section-title">{t("kitchen.waste.waste_composition")}</h3>
            <p className="section-subtitle">{t("kitchen.waste.waste_composition_subtitle")}</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={WASTE_CATEGORIES}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {WASTE_CATEGORIES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-3 text-xs">
            {WASTE_CATEGORIES.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                  <span className="text-[#374151] font-medium">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-data text-[#6B7280]">{cat.kg} {t("kitchen.waste.kg")}</span>
                  <span className="font-bold text-[#111827] font-mono-data">{cat.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Waste Logs Ledger */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">{t("kitchen.waste.ledger_title")}</h3>
            <p className="section-subtitle">{t("kitchen.waste.ledger_subtitle")}</p>
          </div>
          <span className="text-xs text-[#6B7280]">{t("kitchen.waste.entries_logged_today")}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8ECF3] text-[11px] uppercase tracking-wider text-[#6B7280]">
                <th className="py-2.5 px-3 font-bold">{t("kitchen.waste.th_log_ref")}</th>
                <th className="py-2.5 px-3 font-bold">{t("kitchen.waste.th_timestamp")}</th>
                <th className="py-2.5 px-3 font-bold">{t("kitchen.waste.th_category")}</th>
                <th className="py-2.5 px-3 font-bold">{t("kitchen.waste.th_weight")}</th>
                <th className="py-2.5 px-3 font-bold">{t("kitchen.waste.th_origin_station")}</th>
                <th className="py-2.5 px-3 font-bold">{t("kitchen.waste.th_disposition_stream")}</th>
                <th className="py-2.5 px-3 font-bold text-right">{t("kitchen.waste.th_verification")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {recentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 px-3 font-mono-data font-bold text-emerald-700">{log.id}</td>
                  <td className="py-3 px-3 text-[#6B7280]">{log.time}</td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">{log.category}</td>
                  <td className="py-3 px-3 font-mono-data font-bold text-[#111827]">{log.weightKg} {t("kitchen.waste.kg")}</td>
                  <td className="py-3 px-3 text-[#4B5563]">{log.source}</td>
                  <td className="py-3 px-3 text-emerald-700 font-medium">{log.divertedTo}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {t("kitchen.waste.fssai_verified")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E8ECF3]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8ECF3] mb-4">
              <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-emerald-600" />
                {t("kitchen.waste.modal_title")}
              </h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#111827]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">{t("kitchen.waste.food_category")}</label>
                <select
                  value={logCategory}
                  onChange={(e) => setLogCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none"
                >
                  <option value="Rice & Grains">{t("kitchen.waste.opt_rice_grains")}</option>
                  <option value="Dal & Curries">{t("kitchen.waste.opt_dal_curries")}</option>
                  <option value="Vegetables & Greens">{t("kitchen.waste.opt_vegetables")}</option>
                  <option value="Bread & Roti">{t("kitchen.waste.opt_bread_roti")}</option>
                  <option value="Dairy / Dessert">{t("kitchen.waste.opt_dairy_desserts")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">{t("kitchen.waste.measured_weight")}</label>
                <input
                  type="number"
                  step="0.1"
                  value={logWeight}
                  onChange={(e) => setLogWeight(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-mono-data text-[#111827] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">{t("kitchen.waste.scale_station")}</label>
                <select
                  value={logStation}
                  onChange={(e) => setLogStation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none"
                >
                  <option value="WS-01">{t("kitchen.waste.station_ws01")}</option>
                  <option value="WS-02">{t("kitchen.waste.station_ws02")}</option>
                  <option value="WS-03">{t("kitchen.waste.station_ws03")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">{t("kitchen.waste.notes_reason")}</label>
                <input
                  type="text"
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder={t("kitchen.waste.notes_placeholder")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none"
                />
              </div>

              {logSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t("kitchen.waste.success_message")}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#6B7280]"
                >
                  {t("kitchen.waste.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25"
                >
                  {t("kitchen.waste.save_entry")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
