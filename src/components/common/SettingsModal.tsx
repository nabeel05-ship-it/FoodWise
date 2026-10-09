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
  Home,
  Utensils,
  Hotel,
  Users,
  CheckCircle2,
  Save,
  ShieldCheck,
  MapPin,
  KeyRound,
  LogOut,
} from "lucide-react";

export default function SettingsModal() {
  const router = useRouter();
  const { isSettingsOpen, setIsSettingsOpen, userRole, activeDonor, activeNgo, logout } = useApp();
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<"location" | "notifications" | "security">("location");

  const isHousehold = userRole === "HOUSEHOLD";
  const isHotel = userRole === "HOTEL";
  const isNgo = userRole === "NGO";

  // Form State: Location & Pickup
  const [address, setAddress] = useState(
    isNgo
      ? activeNgo?.address || "5th Main Road, Industrial Suburb, Rajajinagar, Bengaluru"
      : activeDonor?.address || (isHousehold ? "9th Main Road, 4th Block East, Jayanagar, Bengaluru" : "37-39 MG Road, Bengaluru")
  );
  const [city, setCity] = useState(isNgo ? activeNgo?.city || "Bengaluru" : activeDonor?.city || "Bengaluru");
  const [coverageArea, setCoverageArea] = useState(
    isNgo ? activeNgo?.coverageArea || "Rajajinagar, Malleshwaram, Central Bengaluru" : ""
  );
  const [pickupInstructions, setPickupInstructions] = useState(
    isHousehold
      ? "Ring flat bell 402, elevator accessible. Food pre-packed in clean containers."
      : isHotel
      ? "Enter via Banquet Service Gate 3. Loading bay 2. Security will guide volunteer vehicle."
      : "Open 9:00 AM to 9:00 PM for food drop-offs and volunteer dispatch."
  );

  // Form State: Notifications
  const [notifyRequests, setNotifyRequests] = useState(true);
  const [notifyPickups, setNotifyPickups] = useState(true);
  const [notifyCompleted, setNotifyCompleted] = useState(true);
  const [enableAudioChime, setEnableAudioChime] = useState(true);

  // Form State: Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    setIsSettingsOpen(false);
    logout();
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-3xl border border-[#E8ECF3] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8ECF3] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-950/20"
              style={{ background: "#164A31" }}
            >
              <Settings className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {isHousehold
                    ? t("Household Settings")
                    : isHotel
                    ? t("Hotel & Banquet Settings")
                    : t("NGO Settings")}
                </span>
              </div>
              <h2 className="text-lg font-black text-gray-950">{t("Settings & Preferences")}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t("Settings updated successfully.")}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#E8ECF3] flex gap-2 overflow-x-auto shrink-0 bg-[#F9FAFB]">
          <button
            type="button"
            onClick={() => setActiveTab("location")}
            className={`py-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "location"
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{isNgo ? t("Service Hub") : t("Pickup Location")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`py-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "notifications"
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{t("Alerts")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`py-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "security"
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{t("Security & Logout")}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === "location" && (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  {isHousehold ? t("Residence Address") : isNgo ? t("Main Food Hub Address") : t("Address & Entrance")}
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-gray-950 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">{t("City")}</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-gray-950 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                {isNgo && (
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">{t("Coverage Areas")}</label>
                    <input
                      type="text"
                      value={coverageArea}
                      onChange={(e) => setCoverageArea(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-gray-950 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">{t("Pickup Coordination Notes")}</label>
                <textarea
                  rows={3}
                  value={pickupInstructions}
                  onChange={(e) => setPickupInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-gray-950 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer hover:brightness-110"
                  style={{ background: "#164A31" }}
                >
                  {t("Save Location")}
                </button>
              </div>
            </form>
          )}

          {activeTab === "notifications" && (
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">
                    {isNgo ? t("New Surplus Available Nearby") : t("Donation Requests from NGOs")}
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    {isNgo
                      ? t("Notify immediately when a restaurant, hotel, or household posts surplus food.")
                      : t("Notify when a verified relief organization submits a request to collect your food.")}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyRequests}
                  onChange={(e) => setNotifyRequests(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">
                    {isNgo ? t("Donor Acceptance & Schedule Updates") : t("Volunteer Pickup Schedules")}
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    {isNgo
                      ? t("Alert when a donor approves your pickup request with collection times and instructions.")
                      : t("Notify when a volunteer driver confirms pickup time and vehicle information.")}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyPickups}
                  onChange={(e) => setNotifyPickups(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">{t("Delivery & Handover Confirmation")}</div>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    {t("Receive verified OTP receipt when food is delivered.")}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyCompleted}
                  onChange={(e) => setNotifyCompleted(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">{t("In-Browser Audio Tone")}</div>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    {t("Play gentle chime on priority donation notifications.")}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enableAudioChime}
                  onChange={(e) => setEnableAudioChime(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer hover:brightness-110"
                  style={{ background: "#164A31" }}
                >
                  {t("Save Notification Preferences")}
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <div className="space-y-4 text-xs">
              <form onSubmit={handleSave} className="space-y-3">
                <div className="font-bold text-gray-900">{t("Change Password")}</div>
                <div>
                  <label className="block text-gray-700 mb-1">{t("Current Password")}</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">{t("New Password")}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer hover:brightness-110"
                  style={{ background: "#164A31" }}
                >
                  {t("Update Password")}
                </button>
              </form>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">{t("Sign Out")}</div>
                  <div className="text-[11px] text-gray-500">{t("End your current session")}</div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t("common.logout")}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
