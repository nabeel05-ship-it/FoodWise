"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  X,
  Settings,
  Bell,
  Building,
  BrainCircuit,
  CheckCircle2,
  Save,
  ShieldCheck,
  Smartphone,
  Sliders,
  Sparkles,
  RefreshCw,
  LogOut,
} from "lucide-react";
import MobileNotificationPreview, { AlertType } from "@/components/settings/MobileNotificationPreview";
import LanguageToggle from "@/components/common/LanguageToggle";

export default function SettingsModal() {
  const router = useRouter();
  const { isSettingsOpen, setIsSettingsOpen, currentRole } = useApp();
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<"profile" | "alerts" | "ai">("profile");

  const handleLogout = () => {
    setIsSettingsOpen(false);
    router.push("/");
  };

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

  // Alert State
  const [enableSurplusAlerts, setEnableSurplusAlerts] = useState(true);
  const [enableSpoilageWarnings, setEnableSpoilageWarnings] = useState(true);
  const [enableExpiryAlerts, setEnableExpiryAlerts] = useState(true);
  const [enablePushNotifications, setEnablePushNotifications] = useState(true);
  const [enableSms, setEnableSms] = useState(false);
  const [enableAudioChime, setEnableAudioChime] = useState(true);
  const [enableDailyDigest, setEnableDailyDigest] = useState(true);
  const [autoDispatchThreshold, setAutoDispatchThreshold] = useState(40);
  const [previewAlertType, setPreviewAlertType] = useState<AlertType>(
    currentRole === "FACTORY_MANAGER" ? "factory_spoilage" : "surplus"
  );

  // AI State
  const [confidenceCutoff, setConfidenceCutoff] = useState(85);
  const [modelMode, setModelMode] = useState<"conservative" | "balanced" | "aggressive">("balanced");

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!isSettingsOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSettingsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsOpen, setIsSettingsOpen]);

  if (!isSettingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsSettingsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="System Settings"
    >
      <div
        className={`w-full ${
          activeTab === "alerts" ? "max-w-4xl" : "max-w-2xl"
        } bg-white rounded-3xl shadow-2xl border border-[#E8ECF3] overflow-hidden flex flex-col max-h-[92vh] transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8ECF3] flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#111827]">{t("settings.title")}</h2>
              <p className="text-xs text-[#6B7280]">{t("settings.subtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle
              compact
              className="bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
            />
            <button
              onClick={() => setIsSettingsOpen(false)}
              aria-label="Close settings"
              className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8ECF3] px-6 bg-[#FAFBFC] gap-2 pt-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "profile"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            {t("settings.facility_profile")}
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "alerts"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            {t("settings.alerts")}
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "ai"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            {t("settings.ai_automation")}
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  {t("settings.facility_name")}
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
                    {t("settings.fssai_license")}
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
                    {t("settings.officer")}
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
                    {t("settings.phone")}
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
                    {t("settings.email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-900">{t("settings.fssai_verified")}</div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {t("settings.fssai_verified_desc")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-6">
              {/* Header and Core Alert Toggles */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      <span>Notifications & Alerts</span>
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      Configure which real-time push alerts FoodWise dispatches to your device.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    4 Active Channels
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Surplus Alerts */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E8ECF3] bg-white hover:border-emerald-300 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                        🚨
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                          <span>Surplus Alerts</span>
                          {enableSurplusAlerts && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#6B7280]">
                          Instant notices when kitchens log surplus food
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
                      <div className="w-10 h-5 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {/* Spoilage Warnings */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E8ECF3] bg-white hover:border-emerald-300 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                        ⚠️
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                          <span>Spoilage Warnings</span>
                          {enableSpoilageWarnings && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#6B7280]">
                          Weibull decay alerts & cold-chain deviations
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
                      <div className="w-10 h-5 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {/* Expiry Alerts */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E8ECF3] bg-white hover:border-emerald-300 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 w-6 h-6 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                        ⏰
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                          <span>Expiry Alerts</span>
                          {enableExpiryAlerts && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#6B7280]">
                          Stock approaching shelf-life cutoff date
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
                      <div className="w-10 h-5 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E8ECF3] bg-white hover:border-emerald-300 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                        📱
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                          <span>Push Notifications</span>
                          {enablePushNotifications && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#6B7280]">
                          Real-time delivery to mobile & browser
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={enablePushNotifications}
                          onChange={(e) => setEnablePushNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Options (Threshold & Audio Chime) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF3]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#111827]">Audio Chimes</div>
                    <p className="text-[10.5px] text-[#64748B]">Audible ring for urgent dispatch</p>
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

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#111827]">Auto-Alert Threshold</span>
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

              {/* ─── NOTIFICATION PREVIEW SECTION ─── */}
              <div className="pt-2 border-t border-[#E8ECF3]">
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                    <span>📱 Notification Preview</span>
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Interactive demonstration of FoodWise mobile push notifications as seen by cafeteria managers, NGO drivers, and plant operators. (Native app push; no WhatsApp or SMS styling).
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

          {activeTab === "ai" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-[#E8ECF3] bg-white">
                <label className="block text-xs font-bold text-[#374151] mb-2">
                  {t("settings.model_mode")}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["conservative", "balanced", "aggressive"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setModelMode(mode)}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                        modelMode === mode
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                          : "border-[#E5E7EB] text-[#4B5563] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#6B7280] mt-2">
                  {modelMode === "conservative" && t("settings.conservative_desc")}
                  {modelMode === "balanced" && t("settings.balanced_desc")}
                  {modelMode === "aggressive" && t("settings.aggressive_desc")}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#E8ECF3] bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#111827]">{t("settings.confidence_cutoff")}</span>
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
                  {t("settings.confidence_desc")}
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E8ECF3] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                title="End current session and return to Login page"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t("common.logout")}</span>
              </button>

              {savedSuccess ? (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  {t("settings.saved")}
                </div>
              ) : (
                <span className="text-[11px] text-[#9CA3AF] hidden sm:inline">{t("settings.settings_apply")}</span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#6B7280] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                {t("common.save")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
