"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  Settings,
  Bell,
  Building,
  BrainCircuit,
  CheckCircle2,
  Save,
  ShieldCheck,
  Send,
  Smartphone,
  Sliders,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import MobileNotificationPreview, { AlertType } from "@/components/settings/MobileNotificationPreview";
import LanguageToggle from "@/components/common/LanguageToggle";

export default function SettingsPage() {
  const { currentRole } = useApp();
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<"alerts" | "profile" | "ai">("alerts");

  // Form State
  const [orgName, setOrgName] = useState(
    currentRole === "KITCHEN_MANAGER"
      ? "IIT Delhi Central Mess (Aravali)"
      : currentRole === "FACTORY_MANAGER"
      ? "AgroPure Foods Ltd. — Plant 4"
      : "Feeding India Food Relief Hub"
  );
  const [fssaiLicense, setFssaiLicense] = useState("10019011006542");
  const [managerName, setManagerName] = useState(
    currentRole === "KITCHEN_MANAGER"
      ? "Dr. S.R. Sharma"
      : currentRole === "FACTORY_MANAGER"
      ? "Amit Kumar"
      : "Pooja Verma"
  );
  const [phone, setPhone] = useState("+91 98112 45890");
  const [email, setEmail] = useState("ops.management@foodwise.org");

  // Notifications & Alerts state
  const [enableSurplusAlerts, setEnableSurplusAlerts] = useState(true);
  const [enableSpoilageWarnings, setEnableSpoilageWarnings] = useState(true);
  const [enableExpiryAlerts, setEnableExpiryAlerts] = useState(true);
  const [enablePushNotifications, setEnablePushNotifications] = useState(true);
  const [enableAudioChime, setEnableAudioChime] = useState(true);
  const [autoDispatchThreshold, setAutoDispatchThreshold] = useState(40);
  const [previewAlertType, setPreviewAlertType] = useState<AlertType>(
    currentRole === "FACTORY_MANAGER" ? "factory_spoilage" : "surplus"
  );

  // AI State
  const [confidenceCutoff, setConfidenceCutoff] = useState(85);
  const [modelMode, setModelMode] = useState<"conservative" | "balanced" | "aggressive">("balanced");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E8ECF3]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-xs text-[#6B7280]">
              Configure real-time mobile push notifications, facility profile, and AI automation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <LanguageToggle
            compact
            className="bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50 px-3 py-2 text-xs"
          />
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully and synced with cloud database.</span>
        </div>
      )}

      {/* ═══ Tab Navigation ═══ */}
      <div className="flex border-b border-[#E8ECF3] gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("alerts")}
          className={`pb-3 px-4 text-sm font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "alerts"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications & Alerts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-4 text-sm font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "profile"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Facility Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className={`pb-3 px-4 text-sm font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "ai"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>AI & Automation</span>
        </button>
      </div>

      {/* ═══ Tab 1: Notifications & Alerts ═══ */}
      {activeTab === "alerts" && (
        <div className="space-y-6">
          {/* Section: Checklist Toggles */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8ECF3] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8ECF3]">
              <div>
                <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-600" />
                  <span>Notifications & Alerts</span>
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Select which real-time push alerts FoodWise sends to your mobile app and browser.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full">
                Push Gateway Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ✅ Surplus Alerts */}
              <div className="p-4 rounded-2xl border border-[#E8ECF3] bg-white hover:border-emerald-300 transition-all flex items-center justify-between shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm shrink-0 border border-rose-100">
                    🚨
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
                      <span>Surplus Alerts</span>
                      {enableSurplusAlerts && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Instant broadcast when kitchens log edible surplus meals
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={enableSurplusAlerts}
                    onChange={(e) => {
                      setEnableSurplusAlerts(e.target.checked);
                      if (e.target.checked) setPreviewAlertType("surplus");
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* ✅ Spoilage Warnings */}
              <div className="p-4 rounded-2xl border border-[#E8ECF3] bg-white hover:border-emerald-300 transition-all flex items-center justify-between shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-100">
                    ⚠️
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
                      <span>Spoilage Warnings</span>
                      {enableSpoilageWarnings && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Weibull decay alerts & cold-chain temperature deviations
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={enableSpoilageWarnings}
                    onChange={(e) => {
                      setEnableSpoilageWarnings(e.target.checked);
                      if (e.target.checked) setPreviewAlertType("spoilage");
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* ✅ Expiry Alerts */}
              <div className="p-4 rounded-2xl border border-[#E8ECF3] bg-white hover:border-emerald-300 transition-all flex items-center justify-between shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0 border border-orange-100">
                    ⏰
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
                      <span>Expiry Alerts</span>
                      {enableExpiryAlerts && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Proactive notice for items approaching consumption cutoff
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={enableExpiryAlerts}
                    onChange={(e) => {
                      setEnableExpiryAlerts(e.target.checked);
                      if (e.target.checked) setPreviewAlertType("expiry");
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* ✅ Push Notifications */}
              <div className="p-4 rounded-2xl border border-[#E8ECF3] bg-white hover:border-emerald-300 transition-all flex items-center justify-between shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-100">
                    📱
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
                      <span>Push Notifications</span>
                      {enablePushNotifications && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Direct device push notification service (No WhatsApp/SMS)
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={enablePushNotifications}
                    onChange={(e) => setEnablePushNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>

            {/* Threshold & Audio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#E8ECF3]">
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF3] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#111827]">In-Browser Audio Chimes</div>
                  <p className="text-[11px] text-[#64748B]">Play sound tone on priority notification</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableAudioChime}
                    onChange={(e) => setEnableAudioChime(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF3]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#111827]">Surplus Auto-Alert Threshold</span>
                  <span className="font-extrabold text-emerald-600 font-mono-data">{autoDispatchThreshold} kg</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={autoDispatchThreshold}
                  onChange={(e) => setAutoDispatchThreshold(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5"
                />
              </div>
            </div>
          </div>

          {/* ═══ Section: 📱 Notification Preview ═══ */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8ECF3] shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
                <span>📱 Notification Preview</span>
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Experience what cafeteria staff, NGO volunteers, and factory technicians see when the FoodWise app sends a push notification.
              </p>
            </div>

            <MobileNotificationPreview
              initialSector={currentRole === "FACTORY_MANAGER" ? "factory" : "all"}
              selectedAlert={previewAlertType}
              onSelectAlert={(alert) => setPreviewAlertType(alert)}
              showSectorToggle={true}
            />
          </div>
        </div>
      )}

      {/* ═══ Tab 2: Facility Profile ═══ */}
      {activeTab === "profile" && (
        <div className="p-6 rounded-3xl bg-white border border-[#E8ECF3] shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            <span>Registered Facility Information</span>
          </h2>

          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1">
                Facility / Institution Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  FSSAI License / Registration
                </label>
                <input
                  type="text"
                  value={fssaiLicense}
                  onChange={(e) => setFssaiLicense(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] font-mono-data focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Officer In-Charge
                </label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Phone / SMS Emergency
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Alert Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-emerald-900">Verified FSSAI Compliance Tier 1</div>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  This facility is certified under Indian Surplus Food Recovery Regulations 2019. Audit certificates are generated with digital cryptographic verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Tab 3: AI & Automation ═══ */}
      {activeTab === "ai" && (
        <div className="p-6 rounded-3xl bg-white border border-[#E8ECF3] shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-600" />
            <span>AI Demand Model & Telemetry Gates</span>
          </h2>

          <div className="space-y-4 max-w-2xl">
            <div className="p-4 rounded-2xl border border-[#E8ECF3] bg-white">
              <label className="block text-xs font-bold text-[#374151] mb-2">
                Demand Forecasting Model Rigor
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["conservative", "balanced", "aggressive"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setModelMode(mode)}
                    className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                      modelMode === mode
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs"
                        : "border-[#E5E7EB] text-[#4B5563] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#6B7280] mt-2">
                {modelMode === "conservative" && "Prioritizes zero meal shortages with higher safety buffer (6-8%)."}
                {modelMode === "balanced" && "Balanced waste reduction with dynamic 3-4% safety margin."}
                {modelMode === "aggressive" && "Ultra-lean production minimizing all waste down to 1-2%."}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#E8ECF3] bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#111827]">Anomaly Confidence Cutoff</span>
                <span className="text-sm font-extrabold text-emerald-600 font-mono-data">{confidenceCutoff}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                step="5"
                value={confidenceCutoff}
                onChange={(e) => setConfidenceCutoff(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-[#9CA3AF] mt-1">
                IoT anomaly threshold for optical caliper blade clearance and cold-storage humidity spikes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
