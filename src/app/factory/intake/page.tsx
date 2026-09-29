"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import {
  Boxes,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  Filter,
  Plus,
  Thermometer,
  ShieldCheck,
  ArrowRight,
  FileCheck2,
} from "lucide-react";

interface ShipmentBatch {
  id: string;
  truckNo: string;
  crop: string;
  supplier: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  moisturePct: number;
  arrivalTempC: number;
  qualityGrade: "Grade A" | "Grade B" | "Grade C";
  status: "ACCEPTED" | "QUARANTINED" | "IN_INSPECTION";
  arrivalTime: string;
  assignedColdZone: string;
}

const INTAKE_BATCHES: ShipmentBatch[] = [
  {
    id: "LOT-2026-0891",
    truckNo: "DL-1L-4492",
    crop: "Kufri Chipsona Potatoes",
    supplier: "AgroFarms Punjab Cooperative",
    grossWeightKg: 18450,
    tareWeightKg: 8450,
    netWeightKg: 10000,
    moisturePct: 78.4,
    arrivalTempC: 11.2,
    qualityGrade: "Grade A",
    status: "ACCEPTED",
    arrivalTime: "10:30 AM Today",
    assignedColdZone: "Cold Zone A-1",
  },
  {
    id: "LOT-2026-0892",
    truckNo: "HR-38-9901",
    crop: "Processing Tomatoes (Roma)",
    supplier: "Sonipat Horticultural FPO",
    grossWeightKg: 11200,
    tareWeightKg: 8000,
    netWeightKg: 3200,
    moisturePct: 91.2,
    arrivalTempC: 13.8,
    qualityGrade: "Grade B",
    status: "QUARANTINED",
    arrivalTime: "11:45 AM Today",
    assignedColdZone: "Cold Zone B (Alert)",
  },
  {
    id: "LOT-2026-0893",
    truckNo: "UP-16-7782",
    crop: "Table Carrots (Orange)",
    supplier: "Meerut Organic Cluster",
    grossWeightKg: 14600,
    tareWeightKg: 8200,
    netWeightKg: 6400,
    moisturePct: 84.1,
    arrivalTempC: 9.8,
    qualityGrade: "Grade A",
    status: "ACCEPTED",
    arrivalTime: "01:15 PM Today",
    assignedColdZone: "Cold Zone C-2",
  },
  {
    id: "LOT-2026-0894",
    truckNo: "DL-1M-2219",
    crop: "Onions (Nasik Red)",
    supplier: "Maharashtra Agro Mandi",
    grossWeightKg: 16800,
    tareWeightKg: 8300,
    netWeightKg: 8500,
    moisturePct: 82.0,
    arrivalTempC: 12.1,
    qualityGrade: "Grade A",
    status: "IN_INSPECTION",
    arrivalTime: "02:00 PM Today",
    assignedColdZone: "Weighbridge Dock 2",
  },
];

export default function RawMaterialIntakePage() {
  const { t } = useLang();
  const [filter, setFilter] = useState<string>("ALL");
  const [batches, setBatches] = useState<ShipmentBatch[]>(INTAKE_BATCHES);

  const filteredBatches = batches.filter((b) => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  const handleAcceptQuarantined = (id: string) => {
    setBatches(
      batches.map((b) =>
        b.id === id ? { ...b, status: "ACCEPTED", assignedColdZone: "Cold Zone B (Prioritized)" } : b
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              {t("factory.intake.subtitle_label")}
            </span>
            <span className="text-[#D1D5DB]">•</span>
            <span className="text-xs text-[#9CA3AF]">{t("factory.intake.dock_telemetry")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            {t("factory.intake.title")}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            {t("factory.intake.description")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/factory/spoilage"
            className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            {t("factory.intake.check_spoilage")}
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card stat-card-indigo p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("factory.intake.kpi_total_intake")}</span>
            <div className="icon-container icon-container-indigo">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-[#111827]">
            28.1 <span className="text-sm font-bold text-[#6B7280]">{t("factory.intake.tons")}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {t("factory.intake.trucks_processed")}
          </div>
        </div>

        <div className="stat-card stat-card-green p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("factory.intake.kpi_grade_a_rate")}</span>
            <div className="icon-container icon-container-green">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-emerald-600">
            92.8%
          </div>
          <div className="text-[11px] text-[#6B7280] mt-1">
            {t("factory.intake.iso_compliance")}
          </div>
        </div>

        <div className="stat-card stat-card-red p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("factory.intake.kpi_quarantined")}</span>
            <div className="icon-container icon-container-red">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-rose-600">
            1 <span className="text-sm font-bold text-[#6B7280]">{t("factory.intake.batch_3_2t")}</span>
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">
            {t("factory.intake.tomatoes_high_temp")}
          </div>
        </div>

        <div className="stat-card stat-card-amber p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("factory.intake.kpi_avg_moisture")}</span>
            <div className="icon-container icon-container-amber">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-[#111827]">
            83.9%
          </div>
          <div className="text-[11px] text-[#6B7280] mt-1">
            {t("factory.intake.optimum_dehydration")}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E8ECF3] rounded-xl text-xs font-semibold">
          {(["ALL", "ACCEPTED", "QUARANTINED", "IN_INSPECTION"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === st
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              {st === "ALL" ? t("factory.intake.filter_all") : st === "IN_INSPECTION" ? t("factory.intake.filter_inspection") : st === "ACCEPTED" ? t("factory.intake.filter_accepted") : t("factory.intake.filter_quarantined")}
            </button>
          ))}
        </div>
      </div>

      {/* Batches Table */}
      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8ECF3] text-[11px] uppercase tracking-wider text-[#6B7280]">
                <th className="py-2.5 px-3 font-bold">{t("factory.intake.col_lot_truck")}</th>
                <th className="py-2.5 px-3 font-bold">{t("factory.intake.col_crop")}</th>
                <th className="py-2.5 px-3 font-bold">{t("factory.intake.col_supplier")}</th>
                <th className="py-2.5 px-3 font-bold">{t("factory.intake.col_net_weight")}</th>
                <th className="py-2.5 px-3 font-bold">{t("factory.intake.col_moisture_temp")}</th>
                <th className="py-2.5 px-3 font-bold">{t("factory.intake.col_quality")}</th>
                <th className="py-2.5 px-3 font-bold">{t("factory.intake.col_assigned_storage")}</th>
                <th className="py-2.5 px-3 font-bold text-right">{t("factory.intake.col_status_action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredBatches.map((b) => (
                <tr key={b.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-mono-data font-bold text-[#111827]">{b.id}</div>
                    <div className="text-[11px] text-[#6B7280] flex items-center gap-1 mt-0.5">
                      <Truck className="w-3 h-3 text-[#9CA3AF]" />
                      {b.truckNo}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#111827]">{b.crop}</td>
                  <td className="py-3 px-3 text-[#4B5563]">{b.supplier}</td>
                  <td className="py-3 px-3 font-mono-data font-bold text-[#111827]">
                    {b.netWeightKg.toLocaleString()} {t("common.kg")}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-mono-data text-[#374151]">{b.moisturePct}% RH</div>
                    <div className="text-[11px] text-[#6B7280] flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-emerald-600" />
                      {b.arrivalTempC}°C
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      b.qualityGrade === "Grade A"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {b.qualityGrade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#4B5563] font-medium">{b.assignedColdZone}</td>
                  <td className="py-3 px-3 text-right">
                    {b.status === "ACCEPTED" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        {t("factory.intake.status_accepted")}
                      </span>
                    )}
                    {b.status === "QUARANTINED" && (
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {t("factory.intake.status_quarantined")}
                        </span>
                        <button
                          onClick={() => handleAcceptQuarantined(b.id)}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                        >
                          {t("factory.intake.prioritize")}
                        </button>
                      </div>
                    )}
                    {b.status === "IN_INSPECTION" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {t("factory.intake.status_inspecting")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
