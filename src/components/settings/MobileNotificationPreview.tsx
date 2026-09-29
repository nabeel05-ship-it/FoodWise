"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  MapPin,
  ExternalLink,
  Sparkles,
  Wifi,
  Battery,
  ShieldCheck,
  ChevronRight,
  Send,
  Volume2,
  Layers,
  Smartphone,
} from "lucide-react";

export type AlertType =
  // Kitchen alerts
  | "surplus"
  | "spoilage"
  | "expiry"
  // Factory alerts
  | "factory_spoilage"
  | "factory_machine"
  | "factory_coldchain"
  | "factory_byproduct";

export type SectorType = "all" | "kitchen" | "factory";

interface AlertConfig {
  id: AlertType;
  sector: "kitchen" | "factory";
  tabLabel: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  emoji: string;
  title: string;
  quantityHighlight?: string;
  details: {
    label: string;
    value: string;
    icon?: string;
  }[];
  location: string;
  ctaText: string;
  quickAction1: string;
  quickAction2: string;
  categoryTag: string;
}

const ALERT_PREVIEWS: Record<AlertType, AlertConfig> = {
  // ─── Commercial Kitchen Alerts ───
  surplus: {
    id: "surplus",
    sector: "kitchen",
    tabLabel: "Surplus Alert",
    badge: "SURPLUS ALERT",
    badgeColor: "text-rose-400",
    badgeBg: "bg-rose-500/20",
    badgeBorder: "border-rose-500/30",
    emoji: "🚨",
    title: "45kg Basmati Rice available",
    quantityHighlight: "45kg",
    details: [
      { label: "Pickup by", value: "6:30 PM", icon: "⏰" },
    ],
    location: "IIT Delhi Mess",
    ctaText: "Tap to claim →",
    quickAction1: "Claim Now",
    quickAction2: "View Route",
    categoryTag: "Live Redistribution",
  },
  spoilage: {
    id: "spoilage",
    sector: "kitchen",
    tabLabel: "Spoilage Warning",
    badge: "SPOILAGE WARNING",
    badgeColor: "text-amber-400",
    badgeBg: "bg-amber-500/20",
    badgeBorder: "border-amber-500/30",
    emoji: "⚠️",
    title: "12kg cooked rice may spoil soon.",
    quantityHighlight: "12kg",
    details: [
      { label: "Action required by", value: "5:00 PM", icon: "⏳" },
    ],
    location: "IIT Delhi Mess",
    ctaText: "Tap to inspect & prioritize →",
    quickAction1: "Prioritize Batch",
    quickAction2: "Log Reading",
    categoryTag: "Weibull Spoilage Engine",
  },
  expiry: {
    id: "expiry",
    sector: "kitchen",
    tabLabel: "Expiry Alert",
    badge: "EXPIRY ALERT",
    badgeColor: "text-orange-400",
    badgeBg: "bg-orange-500/20",
    badgeBorder: "border-orange-500/30",
    emoji: "⏰",
    title: "20kg food items are approaching their expiry date.",
    quantityHighlight: "20kg",
    details: [
      { label: "Recommended action", value: "Please take action today", icon: "📋" },
    ],
    location: "Cold Storage Unit 2",
    ctaText: "Tap to reassign →",
    quickAction1: "Reassign to NGO",
    quickAction2: "Audit Stock",
    categoryTag: "Inventory Safety",
  },

  // ─── Industrial Agro-Factory Alerts ───
  factory_spoilage: {
    id: "factory_spoilage",
    sector: "factory",
    tabLabel: "Batch Spoilage",
    badge: "CRITICAL BATCH ALERT",
    badgeColor: "text-rose-400",
    badgeBg: "bg-rose-500/20",
    badgeBorder: "border-rose-500/30",
    emoji: "🚨",
    title: "Batch TOM-2024-0234 (3,200kg Tomatoes) requires priority processing",
    quantityHighlight: "3,200kg",
    details: [
      { label: "Action required by", value: "Within 8 hours (Salvage 2,800kg)", icon: "⏳" },
      { label: "Spoilage Risk", value: "88% Weibull Probability", icon: "📈" },
    ],
    location: "Plant 4 — Silo C Processing Line",
    ctaText: "Tap to prioritize batch →",
    quickAction1: "Prioritize Batch",
    quickAction2: "View Weibull Curve",
    categoryTag: "Weibull Spoilage Engine",
  },
  factory_machine: {
    id: "factory_machine",
    sector: "factory",
    tabLabel: "Machine Anomaly",
    badge: "MACHINE ANOMALY FLAG",
    badgeColor: "text-amber-400",
    badgeBg: "bg-amber-500/20",
    badgeBorder: "border-amber-500/30",
    emoji: "⚙️",
    title: "Peeling Drum PM-03 peel thickness exceeds limit by +1.2mm",
    quantityHighlight: "+6% Loss Rate",
    details: [
      { label: "Telemetry Anomaly", value: "Excess peel waste (+6% loss rate)", icon: "⚠️" },
      { label: "Recommended", value: "Preventative blade replacement", icon: "🛠️" },
    ],
    location: "Plant 4 — Processing Bay A",
    ctaText: "Tap to inspect telemetry →",
    quickAction1: "Inspect Telemetry",
    quickAction2: "Schedule Service",
    categoryTag: "IoT Machine Health",
  },
  factory_coldchain: {
    id: "factory_coldchain",
    sector: "factory",
    tabLabel: "Cold Chain Drift",
    badge: "STORAGE TEMP SPIKE",
    badgeColor: "text-blue-400",
    badgeBg: "bg-blue-500/20",
    badgeBorder: "border-blue-500/30",
    emoji: "❄️",
    title: "Cold Unit 3 temperature spike to 8.2°C (Safe Cutoff 4.0°C)",
    quantityHighlight: "5,400kg",
    details: [
      { label: "Stock at Risk", value: "5,400kg Chilled Purees & Dairy", icon: "📦" },
      { label: "Shelf-Life Cutoff", value: "2.1 days remaining", icon: "⏳" },
    ],
    location: "Central Warehouse Unit 3",
    ctaText: "Tap to adjust chiller →",
    quickAction1: "Recalibrate Chiller",
    quickAction2: "Audit Unit 3",
    categoryTag: "Cold Chain Telemetry",
  },
  factory_byproduct: {
    id: "factory_byproduct",
    sector: "factory",
    tabLabel: "Byproduct Valorization",
    badge: "BYPRODUCT READY",
    badgeColor: "text-emerald-400",
    badgeBg: "bg-emerald-500/20",
    badgeBorder: "border-emerald-500/30",
    emoji: "♻️",
    title: "1,840kg Potato Slurry ready for Biogas Valorization",
    quantityHighlight: "1,840kg",
    details: [
      { label: "Ready Volume", value: "1,840kg Potato Slurry", icon: "⚖️" },
      { label: "Destination", value: "Bio-Enzymatic Digester Bay 2", icon: "⚡" },
    ],
    location: "Discharge Buffer 1 (Bio-Digester)",
    ctaText: "Tap to dispatch transfer →",
    quickAction1: "Dispatch Tanker",
    quickAction2: "Log Recovery",
    categoryTag: "Circular Economy Valorization",
  },
};

export default function MobileNotificationPreview({
  initialSector = "all",
  selectedAlert,
  onSelectAlert,
  className = "",
  showSectorToggle = true,
}: {
  initialSector?: SectorType;
  selectedAlert?: AlertType;
  onSelectAlert?: (alert: AlertType) => void;
  className?: string;
  showSectorToggle?: boolean;
}) {
  const [activeSector, setActiveSector] = useState<"kitchen" | "factory">(
    initialSector === "factory" ? "factory" : "kitchen"
  );

  const defaultForSector = (sec: "kitchen" | "factory"): AlertType =>
    sec === "factory" ? "factory_spoilage" : "surplus";

  const [internalAlert, setInternalAlert] = useState<AlertType>(
    selectedAlert || defaultForSector(activeSector)
  );

  const currentAlertKey = onSelectAlert ? (selectedAlert || internalAlert) : internalAlert;
  const currentAlert = ALERT_PREVIEWS[currentAlertKey] || ALERT_PREVIEWS.surplus;

  const [isPushing, setIsPushing] = useState(false);
  const [pushDelivered, setPushDelivered] = useState(false);
  const [claimedSuccess, setClaimedSuccess] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleSelect = (type: AlertType) => {
    if (onSelectAlert) {
      onSelectAlert(type);
    } else {
      setInternalAlert(type);
    }
    // trigger push animation
    setIsPushing(true);
    setTimeout(() => setIsPushing(false), 350);
  };

  const handleSectorChange = (sec: "kitchen" | "factory") => {
    setActiveSector(sec);
    const newAlert = defaultForSector(sec);
    handleSelect(newAlert);
  };

  const handleSimulatePush = () => {
    setIsPushing(true);
    setPushDelivered(true);
    setTimeout(() => setIsPushing(false), 450);
    setTimeout(() => setPushDelivered(false), 3000);
  };

  const handleClaim = () => {
    setClaimedSuccess(true);
    if (currentAlert.sector === "factory") {
      setActionFeedback("✓ Factory Action Confirmed & Dispatched to Line SCADA!");
    } else {
      setActionFeedback("✓ Claim Verified & Volunteer Driver Dispatched!");
    }
    setTimeout(() => {
      setClaimedSuccess(false);
      setActionFeedback(null);
    }, 2800);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Sector Switcher & Top Controls Bar */}
      <div className="space-y-2.5 pb-3 border-b border-[#E8ECF3]">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {showSectorToggle ? (
            <div className="inline-flex items-center p-1 bg-slate-200/70 rounded-xl text-xs font-bold shadow-inner">
              <button
                type="button"
                onClick={() => handleSectorChange("kitchen")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSector === "kitchen"
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🍲</span>
                <span>Commercial Kitchen</span>
              </button>
              <button
                type="button"
                onClick={() => handleSectorChange("factory")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSector === "factory"
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🏭</span>
                <span>Industrial Factory</span>
              </button>
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-700 capitalize flex items-center gap-1.5">
              <span>{activeSector === "factory" ? "🏭 Industrial Factory" : "🍲 Commercial Kitchen"}</span>
              <span className="text-[10px] text-slate-400 font-normal">Push Presets</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSimulatePush}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0 ml-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPushing ? "Delivering Push..." : "Simulate Incoming Push"}</span>
          </button>
        </div>

        {/* Sub-tabs for the current sector presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-[#F1F5F9] rounded-xl scrollbar-none">
          {(Object.keys(ALERT_PREVIEWS) as AlertType[])
            .filter((key) => ALERT_PREVIEWS[key].sector === activeSector)
            .map((key) => {
              const item = ALERT_PREVIEWS[key];
              const isActive = currentAlertKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelect(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    isActive
                      ? "bg-white text-[#0F172A] shadow-xs font-bold ring-1 ring-emerald-500/20"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/50"
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.tabLabel}</span>
                </button>
              );
            })}
        </div>
      </div>

      {actionFeedback && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {pushDelivered && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Simulated WebPush delivered to mock mobile device</span>
          </div>
          <span className="text-[10px] font-mono-data bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-900">
            HTTP 201 Created
          </span>
        </div>
      )}

      {/* Main Container: Phone Centered with Context Box */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50/40 border border-slate-200">
        
        {/* ─── REALISTIC PHONE FRAME (HTML/CSS) ─── */}
        <div className="relative group shrink-0">
          
          {/* External Physical Buttons (Volume + Power) */}
          <div className="absolute -left-[9px] top-24 w-[4px] h-9 bg-slate-700 rounded-l-md shadow-xs" />
          <div className="absolute -left-[9px] top-36 w-[4px] h-9 bg-slate-700 rounded-l-md shadow-xs" />
          <div className="absolute -left-[9px] top-14 w-[4px] h-6 bg-slate-600 rounded-l-md shadow-xs" />
          <div className="absolute -right-[9px] top-28 w-[4px] h-14 bg-slate-700 rounded-r-md shadow-xs" />

          {/* Outer Phone Chassis */}
          <div className="w-[305px] h-[585px] bg-[#0B0F19] rounded-[48px] p-3 shadow-2xl border-[7px] border-slate-900 relative ring-1 ring-white/10 ring-offset-2 ring-offset-slate-900 overflow-hidden flex flex-col justify-between">
            
            {/* Screen Wallpaper (Dark Luxury Emerald & Slate Gradient) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#064E3B] via-[#022C22] to-[#0A0F1D] opacity-95 pointer-events-none" />
            
            {/* Ambient Aurora Orbs */}
            <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-emerald-500/25 blur-2xl pointer-events-none" />
            <div className="absolute top-1/2 -left-20 w-48 h-48 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 right-0 w-40 h-40 rounded-full bg-teal-500/20 blur-2xl pointer-events-none" />

            {/* Subtle Screen Grid lines */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* ─── Top Phone Area: Dynamic Island & Status Bar ─── */}
            <div className="relative z-20 pt-1 px-3">
              {/* Dynamic Island Pill */}
              <div className="w-24 h-5 bg-black rounded-full mx-auto flex items-center justify-between px-2 shadow-md border border-white/5">
                <div className="w-2 h-2 rounded-full bg-[#111827] ring-1 ring-slate-800 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-indigo-950" />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 animate-pulse" />
              </div>

              {/* Status Bar: Time & Connectivity */}
              <div className="flex items-center justify-between text-white text-[11px] font-semibold mt-1 px-1">
                <span>9:41</span>
                <div className="flex items-center gap-1.5 text-white/90">
                  <span className="text-[9px] font-bold tracking-tight">5G</span>
                  <Wifi className="w-3 h-3" />
                  <div className="flex items-center">
                    <Battery className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Middle Area: Lockscreen Clock & PUSH NOTIFICATION ─── */}
            <div className="relative z-10 px-2 flex-1 flex flex-col justify-start pt-6 space-y-4">
              
              {/* Lockscreen Time & Date */}
              <div className="text-center text-white select-none">
                <div className="text-[11px] font-medium tracking-wide text-white/70">
                  Monday, September 29
                </div>
                <div className="text-5xl font-extrabold tracking-tight text-white/95 mt-0.5 font-sans">
                  09:41
                </div>
              </div>

              {/* ─── REALISTIC FOODWISE APP NOTIFICATION ─── */}
              <div
                className={`transition-all duration-300 transform ${
                  isPushing
                    ? "-translate-y-3 scale-95 opacity-50"
                    : "translate-y-0 scale-100 opacity-100"
                }`}
              >
                <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl p-3 shadow-2xl text-white relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                  
                  {/* Subtle Top Accent Sheen */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

                  {/* App Header (FoodWise Brand) */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-[4px] bg-emerald-600 flex items-center justify-center shadow-xs overflow-hidden">
                        <img
                          src="/logo.png"
                          alt="FoodWise"
                          className="w-3.5 h-3.5 object-contain"
                          onError={(e) => {
                            // Fallback if logo not loaded
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-white tracking-tight">
                          FoodWise
                        </span>
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                    </div>
                    <span className="text-[9.5px] text-white/50 font-medium">now</span>
                  </div>

                  {/* Alert Tag Badge */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-xs">{currentAlert.emoji}</span>
                    <span
                      className={`text-[10px] font-extrabold tracking-wide uppercase px-1.5 py-0.5 rounded-md border ${currentAlert.badgeBg} ${currentAlert.badgeColor} ${currentAlert.badgeBorder}`}
                    >
                      {currentAlert.badge}
                    </span>
                  </div>

                  {/* Notification Headline */}
                  <div className="text-[12.5px] font-bold text-white leading-tight mb-2">
                    {currentAlert.title}
                  </div>

                  {/* Notification Details (Quantity, Time, Location) */}
                  <div className="space-y-1 bg-black/35 rounded-xl p-2 border border-white/10 text-[11px] text-white/80 mb-2">
                    {currentAlert.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-white/60 text-[10px] flex items-center gap-1">
                          {detail.icon && <span>{detail.icon}</span>}
                          <span>{detail.label}:</span>
                        </span>
                        <span className="font-bold text-white text-[10.5px]">
                          {detail.value}
                        </span>
                      </div>
                    ))}

                    <div className="flex items-center gap-1 pt-0.5 border-t border-white/10 text-white/90">
                      <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                      <span className="font-medium truncate text-[10.5px]">
                        {currentAlert.location}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Call-to-Action */}
                  <button
                    type="button"
                    onClick={handleClaim}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-all shadow-xs shadow-emerald-500/30 cursor-pointer active:scale-98"
                  >
                    <span>{claimedSuccess ? "✓ Claim Verified!" : currentAlert.ctaText}</span>
                  </button>

                  {/* Quick Action Pills (Simulating iOS/Android native response buttons) */}
                  <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleClaim}
                      className="py-1 px-2 rounded-md bg-white/10 hover:bg-white/20 text-white/90 text-[9.5px] font-semibold text-center transition-colors cursor-pointer"
                    >
                      {currentAlert.quickAction1}
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Details opened for: ${currentAlert.title}`)}
                      className="py-1 px-2 rounded-md bg-white/10 hover:bg-white/20 text-white/90 text-[9.5px] font-semibold text-center transition-colors cursor-pointer"
                    >
                      {currentAlert.quickAction2}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Bottom Area: Quick Toggles & Home Bar ─── */}
            <div className="relative z-20 pb-2 px-6">
              {/* Lockscreen Quick Action Circles (Flashlight & Camera) */}
              <div className="flex items-center justify-between text-white/80 mb-3 px-2">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-xs border border-white/10 shadow-xs">
                  🔦
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-xs border border-white/10 shadow-xs">
                  📷
                </div>
              </div>

              {/* Home Indicator Bar */}
              <div className="w-24 h-1 bg-white/60 rounded-full mx-auto" />
            </div>
          </div>
        </div>

        {/* ─── Informational Panel & Live Specs ─── */}
        <div className="flex-1 max-w-sm space-y-3.5">
          <div className="p-4 rounded-2xl bg-white border border-[#E8ECF3] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Native Push Protocol Specs</span>
            </div>
            
            <p className="text-xs text-[#64748B] leading-relaxed">
              This preview renders the official mobile push payload generated by the{" "}
              <strong className="text-[#0F172A]">FoodWise Notification Service</strong>. FoodWise delivers high-priority alerts directly to cafeteria wardens, plant technicians, line supervisors, and volunteer drivers without relying on third-party WhatsApp or SMS gateways.
            </p>

            <div className="space-y-2 pt-2 border-t border-[#E8ECF3] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Payload Delivery:</span>
                <span className="font-mono-data font-bold text-emerald-700">W3C Push API / WebPush</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Average Latency:</span>
                <span className="font-mono-data font-bold text-[#0F172A]">
                  {activeSector === "factory" ? "140ms" : "180ms"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Alert Priority:</span>
                <span className="font-mono-data font-bold text-rose-600">
                  {activeSector === "factory" ? "Critical (Line SCADA + Audio)" : "Urgent (Vibrate + Sound)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Action Handshake:</span>
                <span className="font-mono-data font-bold text-[#0F172A]">
                  {activeSector === "factory" ? "1-Tap Line Batch Dispatch" : "1-Tap Claim with OTP"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-emerald-900 leading-normal">
              {activeSector === "factory" ? (
                <>
                  <strong>ISO 22000 & FSSAI Batch Compliance:</strong> Every factory alert is timestamped and synchronized with processing silo telemetry. Prioritizing a batch within 8 hours salvages up to 88% of raw material value before biological decay sets in.
                </>
              ) : (
                <>
                  <strong>FSSAI 2-Hour Window Notice:</strong> Every surplus push notification carries a live countdown timer. When an NGO taps <em className="font-semibold text-emerald-700">"Tap to claim →"</em>, the delivery route is locked and volunteer transit begins immediately.
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
