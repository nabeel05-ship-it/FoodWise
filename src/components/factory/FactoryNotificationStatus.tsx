"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Cpu,
  ThermometerSnowflake,
  RefreshCw,
  Smartphone,
  Radio,
  Wifi,
  ShieldCheck,
  Send,
  Sliders,
  Check,
  Zap,
} from "lucide-react";
import MobileNotificationPreview, { AlertType } from "@/components/settings/MobileNotificationPreview";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";

export default function FactoryNotificationStatus({
  className = "",
}: {
  className?: string;
}) {
  const { isBatchPrioritized, prioritizeBatch } = useApp();
  const { t } = useLang();

  // Channel toggle states
  const [enableSpoilage, setEnableSpoilage] = useState(true);
  const [enableMachine, setEnableMachine] = useState(true);
  const [enableColdChain, setEnableColdChain] = useState(true);
  const [enableByproduct, setEnableByproduct] = useState(true);

  // Selected preview alert
  const [selectedAlert, setSelectedAlert] = useState<AlertType>("factory_spoilage");
  const [lastDispatchedTime, setLastDispatchedTime] = useState<string>("Just now");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setLastDispatchedTime("Just now");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTestChannel = (alertType: AlertType, channelName: string) => {
    setSelectedAlert(alertType);
    triggerToast(`⚡ Test push dispatched for: ${channelName}`);
  };

  const activeChannelsCount = [
    enableSpoilage,
    enableMachine,
    enableColdChain,
    enableByproduct,
  ].filter(Boolean).length;

  return (
    <div
      id="factory-notifications"
      className={`rounded-3xl bg-white border border-[#E8ECF3] shadow-xs overflow-hidden ${className}`}
    >
      {/* ═══ Header ═══ */}
      <div className="p-6 border-b border-[#E8ECF3] bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono-data">
                LIVE TELEMETRY BROADCAST
              </span>
              <span className="text-white/40 text-xs">•</span>
              <span className="text-xs text-slate-300">W3C WebPush Protocol</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Factory Push Notification Status & Dispatch</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Real-time push notifications dispatched to plant supervisors, line technicians, and automated SCADA batch controllers.
            </p>
          </div>
        </div>

        {/* Live Channel Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{activeChannelsCount}/4 Channels Active</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono-data font-bold">
            140ms Latency
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono-data">HTTP 201 Delivered</span>
        </div>
      )}

      {/* ═══ 4 Factory Channels Configuration Grid ═══ */}
      <div className="p-6 border-b border-[#E8ECF3] bg-[#F8FAFC]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Plant Notification Channels & SCADA Triggers</span>
            </h3>
            <p className="text-xs text-[#6B7280]">
              Toggle notification dispatch thresholds and trigger test pushes to the mobile simulator below.
            </p>
          </div>
          <span className="text-xs font-medium text-[#6B7280] hidden sm:inline">
            Dispatched: <strong className="text-[#111827] font-mono-data">{lastDispatchedTime}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Channel 1: Batch Spoilage */}
          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-full ${
              selectedAlert === "factory_spoilage"
                ? "bg-rose-50/60 border-rose-300 shadow-xs ring-1 ring-rose-400/20"
                : "bg-white border-[#E8ECF3] hover:border-rose-200"
            }`}
            onClick={() => setSelectedAlert("factory_spoilage")}
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shrink-0">
                  🚨
                </div>
                <label
                  className="relative inline-flex items-center cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={enableSpoilage}
                    onChange={(e) => setEnableSpoilage(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-4.5 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>
              <div className="font-bold text-xs text-[#111827] flex items-center gap-1">
                <span>Batch Spoilage Alert</span>
                {enableSpoilage && <Check className="w-3 h-3 text-rose-600" />}
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1 leading-normal">
                Weibull decay alert when batch salvage window falls below 8 hours.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E8ECF3] flex items-center justify-between text-[11px]">
              <span className="font-mono-data text-rose-600 font-bold">3,200 kg At Risk</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTestChannel("factory_spoilage", "Batch Spoilage Alert");
                }}
                className="text-[10px] font-bold text-rose-700 hover:text-rose-900 bg-rose-100/70 px-2 py-0.5 rounded-md hover:bg-rose-200 transition-colors"
              >
                Test Push →
              </button>
            </div>
          </div>

          {/* Channel 2: Machine Anomaly */}
          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-full ${
              selectedAlert === "factory_machine"
                ? "bg-amber-50/60 border-amber-300 shadow-xs ring-1 ring-amber-400/20"
                : "bg-white border-[#E8ECF3] hover:border-amber-200"
            }`}
            onClick={() => setSelectedAlert("factory_machine")}
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                  ⚙️
                </div>
                <label
                  className="relative inline-flex items-center cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={enableMachine}
                    onChange={(e) => setEnableMachine(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-4.5 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
              <div className="font-bold text-xs text-[#111827] flex items-center gap-1">
                <span>Machine Anomaly Flag</span>
                {enableMachine && <Check className="w-3 h-3 text-amber-600" />}
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1 leading-normal">
                IoT edge alerts for peel blade thickness drift and motor vibration.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E8ECF3] flex items-center justify-between text-[11px]">
              <span className="font-mono-data text-amber-600 font-bold">+6% Peel Loss</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTestChannel("factory_machine", "Machine Anomaly Flag");
                }}
                className="text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md hover:bg-amber-200 transition-colors"
              >
                Test Push →
              </button>
            </div>
          </div>

          {/* Channel 3: Cold Storage Sensor Spike */}
          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-full ${
              selectedAlert === "factory_coldchain"
                ? "bg-blue-50/60 border-blue-300 shadow-xs ring-1 ring-blue-400/20"
                : "bg-white border-[#E8ECF3] hover:border-blue-200"
            }`}
            onClick={() => setSelectedAlert("factory_coldchain")}
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                  ❄️
                </div>
                <label
                  className="relative inline-flex items-center cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={enableColdChain}
                    onChange={(e) => setEnableColdChain(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-4.5 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              <div className="font-bold text-xs text-[#111827] flex items-center gap-1">
                <span>Cold Storage Drift</span>
                {enableColdChain && <Check className="w-3 h-3 text-blue-600" />}
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1 leading-normal">
                Temperature deviations &gt;4.0°C across central silos and warehouse.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E8ECF3] flex items-center justify-between text-[11px]">
              <span className="font-mono-data text-blue-600 font-bold">8.2°C Detected</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTestChannel("factory_coldchain", "Cold Storage Drift");
                }}
                className="text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded-md hover:bg-blue-200 transition-colors"
              >
                Test Push →
              </button>
            </div>
          </div>

          {/* Channel 4: Byproduct Valorization */}
          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-full ${
              selectedAlert === "factory_byproduct"
                ? "bg-emerald-50/60 border-emerald-300 shadow-xs ring-1 ring-emerald-400/20"
                : "bg-white border-[#E8ECF3] hover:border-emerald-200"
            }`}
            onClick={() => setSelectedAlert("factory_byproduct")}
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                  ♻️
                </div>
                <label
                  className="relative inline-flex items-center cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={enableByproduct}
                    onChange={(e) => setEnableByproduct(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-4.5 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <div className="font-bold text-xs text-[#111827] flex items-center gap-1">
                <span>Byproduct Valorization</span>
                {enableByproduct && <Check className="w-3 h-3 text-emerald-600" />}
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1 leading-normal">
                Notifies bio-methane digester partners when slurry buffer hits capacity.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E8ECF3] flex items-center justify-between text-[11px]">
              <span className="font-mono-data text-emerald-600 font-bold">1,840 kg Ready</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTestChannel("factory_byproduct", "Byproduct Valorization");
                }}
                className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded-md hover:bg-emerald-200 transition-colors"
              >
                Test Push →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Realistic Mobile Push Preview (Embedded) ═══ */}
      <div className="p-6">
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Interactive Factory Mobile Push Simulator</span>
            </h3>
            <p className="text-xs text-[#6B7280]">
              Test how plant supervisors and field engineers experience high-priority push alerts on their mobile devices.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Target Role:</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
              Plant Supervisor / Line Lead
            </span>
          </div>
        </div>

        <MobileNotificationPreview
          initialSector="factory"
          selectedAlert={selectedAlert}
          onSelectAlert={(alert) => setSelectedAlert(alert)}
          showSectorToggle={true}
        />
      </div>
    </div>
  );
}
