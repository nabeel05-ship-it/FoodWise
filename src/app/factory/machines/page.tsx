"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { MACHINE_HEALTH } from "@/lib/mockData";
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Activity,
  FileText,
  UserCheck,
  TrendingDown,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";

export default function FactoryMachinesPage() {
  const { t } = useLang();
  const { isTechnicianAssigned, assignTechnician } = useApp();
  const [selectedMachineLog, setSelectedMachineLog] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              {t("factory.machines.header_label")}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs text-[#6B7280]">{t("factory.machines.line_info")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            {t("factory.machines.title")}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6B7280] font-mono-data bg-[#F9FAFB] px-3 py-1.5 rounded-xl border border-[#E8ECF3]">
            {t("factory.machines.sensor_nodes")}
          </span>
        </div>
      </div>

      {/* Philosophy Callout Alert */}
      <div className="p-3.5 rounded-xl bg-[#FAFBFC] border border-[#E8ECF3] text-xs text-[#6B7280] flex items-center gap-2.5">
        <Info className="w-4 h-4 text-[#10B981] shrink-0" />
        <span>
          <strong>{t("factory.machines.philosophy_label")}</strong> {t("factory.machines.philosophy_text")}
        </span>
      </div>

      {/* MACHINE CARDS GRID (2x3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MACHINE_HEALTH.map((machine) => {
          const isCheckRequired = machine.status === "CHECK_REQUIRED";
          const isWarning = machine.status === "WARNING";

          return (
            <div
              key={machine.id}
              className={`rounded-2xl p-6 transition-all flex flex-col justify-between ${
                isCheckRequired
                  ? "bg-amber-500/[0.07] border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 glow-warning"
                  : isWarning
                  ? "bg-amber-500/[0.03] border border-[#FDE68A]"
                  : "card border-[#E8ECF3] hover:border-[#D0D6E2]"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono-data text-xs text-[#6B7280] font-semibold">
                      {machine.machineId}
                    </span>
                    <h3 className="font-bold text-[#111827] text-base leading-tight">
                      {machine.name}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono-data ${
                      isCheckRequired
                        ? "bg-amber-500 text-white font-extrabold animate-pulse"
                        : isWarning
                        ? "bg-amber-100 text-amber-800 border border-amber-300 font-bold"
                        : "bg-emerald-50 text-[#065F46] border border-emerald-300 font-extrabold"
                    }`}
                  >
                    {isCheckRequired
                      ? `⚠️ ${t("factory.machines.check_required")}`
                      : isWarning
                      ? t("factory.machines.warning")
                      : t("factory.machines.optimal")}
                  </span>
                </div>

                {/* Efficiency metrics with circular preview */}
                <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-[#6B7280] font-medium">{t("factory.machines.yield_efficiency")}</div>
                    <div
                      className={`text-2xl font-black font-mono-data ${
                        isCheckRequired ? "text-amber-600" : "text-[#111827]"
                      }`}
                    >
                      {machine.efficiencyPct}%
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-[#6B7280] font-medium">{t("factory.machines.normal_range")}</div>
                    <div className="text-xs font-mono-data font-bold text-gray-800">
                      {machine.normalRange}
                    </div>
                  </div>
                </div>

                {/* ANOMALY CALLOUT (SPECIFIC TO PM-03 & SR-05) */}
                {machine.anomalyDetected && (
                  <div className="space-y-2.5 p-3.5 rounded-xl bg-amber-50/80 border-2 border-amber-300 text-xs text-amber-950 mb-4 shadow-xs">
                    <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      {t("factory.machines.anomaly_detected")}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] py-1 border-y border-amber-200 font-mono-data">
                      <div>
                        <span className="text-amber-800 font-medium">{t("factory.machines.current")}</span>
                        <div className="font-extrabold text-rose-700">{machine.currentValue}</div>
                      </div>
                      <div>
                        <span className="text-amber-800 font-medium">{t("factory.machines.benchmark")}</span>
                        <div className="font-bold text-gray-900">{machine.expectedValue}</div>
                      </div>
                    </div>

                    <div className="text-[11px] space-y-1">
                      <div className="text-amber-900 font-medium">
                        <strong className="font-bold text-amber-950">{t("factory.machines.extra_loss_rate")}</strong> {machine.lossRatePerHour}
                      </div>
                      <div className="text-rose-700 font-extrabold">
                        {t("factory.machines.estimated_waste")} ~{machine.estimatedExtraWasteKgPerHour} {t("factory.machines.kg_per_hour")}
                      </div>
                    </div>

                    {machine.possibleCause && (
                      <div className="text-[11px] text-amber-900 pt-1">
                        <strong>{t("factory.machines.possible_cause")}</strong> {machine.possibleCause}
                      </div>
                    )}

                    {machine.note && (
                      <div className="p-2 rounded-lg bg-amber-100/90 border border-amber-300 text-[11px] text-amber-950 font-medium italic">
                        ⚠️ {machine.note}
                      </div>
                    )}
                  </div>
                )}

                {/* Sparkline trend for optimal machines */}
                {!machine.anomalyDetected && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1.5">
                      <span className="font-medium">{t("factory.machines.shift_trend")}</span>
                      <span className="text-[#047857] font-bold">{t("factory.machines.in_spec")}</span>
                    </div>
                    <div className="flex items-end gap-1 h-8 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                      {machine.trend.map((val, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-emerald-500 rounded-t"
                          style={{ height: `${(val / 100) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E8ECF3] flex items-center gap-2">
                {isCheckRequired ? (
                  <>
                    {isTechnicianAssigned ? (
                      <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                        {t("factory.machines.tech_dispatched")}
                      </div>
                    ) : (
                      <button
                        onClick={assignTechnician}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-105"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        {t("factory.machines.assign_tech")}
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedMachineLog(machine.machineId)}
                      className="p-2 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] border border-[#E8ECF3] text-xs"
                      title={t("factory.machines.view_log")}
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedMachineLog(machine.machineId)}
                    className="w-full py-2 rounded-xl bg-[#FAFBFC] hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] font-medium text-xs border border-[#F3F4F6] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    {t("factory.machines.telemetry_diag")}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DIAGNOSTIC LOG MODAL */}
      {selectedMachineLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-white border border-gray-300 rounded-3xl p-6 shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                    {t("factory.machines.diag_log_title")} — {t("factory.machines.unit")} {selectedMachineLog}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t("factory.machines.live_link")}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500">{t("factory.machines.realtime_stream")}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMachineLog(null)}
                className="text-xs px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors cursor-pointer"
              >
                {t("factory.machines.close")} ✕
              </button>
            </div>

            {/* Visual HUD Telemetry Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">{t("factory.machines.rotor_speed")}</span>
                <span className="text-sm font-black font-mono-data text-gray-900">1,420 RPM</span>
                <span className="text-[10px] text-emerald-600 block font-semibold">{t("factory.machines.nominal")}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">{t("factory.machines.temperature")}</span>
                <span className="text-sm font-black font-mono-data text-gray-900">41.2°C</span>
                <span className="text-[10px] text-emerald-600 block font-semibold">{t("factory.machines.safe")}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">{t("factory.machines.vibration")}</span>
                <span className="text-sm font-black font-mono-data text-amber-600">2.4 mm/s</span>
                <span className="text-[10px] text-amber-700 block font-semibold">{t("factory.machines.mild_drift")}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">{t("factory.machines.peel_caliper")}</span>
                <span className="text-sm font-black font-mono-data text-rose-600">+1.2mm</span>
                <span className="text-[10px] text-rose-700 block font-semibold">{t("factory.machines.threshold_alert")}</span>
              </div>
            </div>

            {/* High-Contrast Live Terminal Console */}
            <div className="rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl bg-[#090D16]">
              {/* Terminal Titlebar */}
              <div className="px-4 py-2 bg-[#121A2B] border-b border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-mono text-[11px] text-slate-300 font-bold">
                    iot_edge_stream_unit_{selectedMachineLog.toLowerCase()}.log
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold animate-pulse">
                  ● {t("factory.machines.active_capture")}
                </span>
              </div>

              {/* Terminal Logs with High Contrast */}
              <div className="p-4 space-y-2.5 text-xs font-mono max-h-64 overflow-y-auto leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0 font-semibold">[14:22:04]</span>
                  <span className="text-emerald-400 font-bold">SENSOR_PING:</span>
                  <span className="text-slate-100">Optical gauge caliper connected. Sampling frequency: 50Hz.</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0 font-semibold">[14:24:12]</span>
                  <span className="text-emerald-400 font-bold">TELEMETRY_STREAM:</span>
                  <span className="text-slate-100">Current rotor RPM: 1,420 (Factory Baseline: 1,400-1,450).</span>
                </div>

                {selectedMachineLog === "PM-03" && (
                  <>
                    <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-400/50 space-y-1">
                      <div className="flex items-center gap-2 text-amber-300 font-bold">
                        <span className="text-amber-400 shrink-0">[14:25:31]</span>
                        <span>⚠️ ANOMALY_WARN:</span>
                        <span>Peel depth delta +1.2mm detected on Quadrant 2</span>
                      </div>
                      <div className="text-amber-200/90 pl-6 text-[11px]">
                        Loss calculation delta: +180 kg/hr raw potato pulp over baseline threshold.
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-400/50 flex items-start gap-2 text-emerald-300 font-bold">
                      <span className="text-emerald-400 shrink-0">[14:27:00]</span>
                      <span>🔧 PREVENTATIVE_FLAG:</span>
                      <span>Flagged for immediate technician blade realignment & calibration.</span>
                    </div>
                  </>
                )}

                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0 font-semibold">[14:28:15]</span>
                  <span className="text-indigo-400 font-bold">FSSAI_AUDIT_STAMP:</span>
                  <span className="text-slate-300">Telemetry packet SHA-256 hashed and ingested into tamper-proof factory ledger.</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-[11px] text-gray-500">
                {t("factory.machines.sensor_protocol")} Modbus TCP/IP (Node PB-PM03)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMachineLog(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  {t("factory.machines.close_terminal")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
