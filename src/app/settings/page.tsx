"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
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
  Globe,
  LogOut,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { userRole, activeDonor, activeNgo, logout } = useApp();
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<"profile" | "location" | "notifications" | "security">("profile");

  // Determine role context
  const isHousehold = userRole === "HOUSEHOLD";
  const isRestaurant = userRole === "RESTAURANT";
  const isHotel = userRole === "HOTEL";
  const isNgo = userRole === "NGO";

  // Form State: Profile
  const [entityName, setEntityName] = useState(
    isNgo
      ? activeNgo?.name || "Robin Hood Army (Delhi Chapter)"
      : activeDonor?.name || (isHousehold ? "Sharma Family Residence" : isHotel ? "Hotel Mayura Grand" : "Green Leaf Restaurant")
  );
  const [contactPerson, setContactPerson] = useState(
    isNgo
      ? activeNgo?.lead || "Pooja Verma"
      : activeDonor?.contactPerson || (isHousehold ? "Vikram Sharma" : isHotel ? "Suresh Rao" : "Rajeev Mehra")
  );
  const [phone, setPhone] = useState(
    isNgo
      ? activeNgo?.phone || "+91 98112 45890"
      : activeDonor?.phone || (isHousehold ? "+91 98112 34567" : isHotel ? "+91 98450 87654" : "+91 98101 23456")
  );
  const [email, setEmail] = useState(
    isNgo
      ? activeNgo?.email || "delhi.chapter@robinhoodarmy.com"
      : activeDonor?.email || (isHousehold ? "sharma.family@gmail.com" : isHotel ? "banquets@mayuragrand.com" : "greenleaf.cp@gmail.com")
  );
  const [regNumber, setRegNumber] = useState(
    isNgo
      ? activeNgo?.registrationNumber || "DARPAN: DL/2021/029841"
      : activeDonor?.fssaiNumber || (isHousehold ? "Community Contributor #HH-01" : isHotel ? "FSSAI LIC: 11220005001290" : "FSSAI LIC: 13321008000412")
  );

  // Form State: Location & Pickup
  const [address, setAddress] = useState(
    isNgo
      ? activeNgo?.address || "Community Center, Sector 4, RK Puram"
      : activeDonor?.address || (isHousehold ? "Flat 402, Green Avenue, Hauz Khas" : isHotel ? "14/2, Station Main Road, Opp. City Park" : "Block B, Radial Road 3, Connaught Place")
  );
  const [city, setCity] = useState(
    isNgo ? activeNgo?.city || "New Delhi" : activeDonor?.city || "New Delhi"
  );
  const [coverageArea, setCoverageArea] = useState(
    isNgo ? activeNgo?.coverageArea || "South Delhi, Central Delhi, Hauz Khas, Okhla" : ""
  );
  const [pickupInstructions, setPickupInstructions] = useState(
    isHousehold
      ? "Ring flat bell 402, elevator accessible. Food pre-packed in clean containers."
      : isHotel
      ? "Enter via Banquet Service Gate 3. Loading bay 2. Security will guide volunteer vehicle."
      : isRestaurant
      ? "Use service entrance behind Block B. Ask for kitchen supervisor."
      : "Open 9:00 AM to 9:00 PM for food drop-offs and volunteer dispatch."
  );

  // Form State: Notifications (Practical events only)
  const [notifyRequests, setNotifyRequests] = useState(true);
  const [notifyPickups, setNotifyPickups] = useState(true);
  const [notifyCompleted, setNotifyCompleted] = useState(true);
  const [enableAudioChime, setEnableAudioChime] = useState(true);

  // Form State: Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when active donor/ngo changes
  useEffect(() => {
    if (isNgo) {
      setEntityName(activeNgo?.name || "Robin Hood Army (Delhi Chapter)");
      setContactPerson(activeNgo?.lead || "Pooja Verma");
      setPhone(activeNgo?.phone || "+91 98112 45890");
      setEmail(activeNgo?.email || "delhi.chapter@robinhoodarmy.com");
      setAddress(activeNgo?.address || "Community Center, Sector 4, RK Puram");
      setCity(activeNgo?.city || "New Delhi");
    } else if (activeDonor) {
      setEntityName(activeDonor.name);
      setContactPerson(activeDonor.contactPerson || "");
      setPhone(activeDonor.phone || "");
      setAddress(activeDonor.address || "");
      setCity(activeDonor.city || "");
    }
  }, [activeDonor, activeNgo, isNgo]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-950/20"
            style={{ background: "#164A31" }}
          >
            <Settings className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {isHousehold
                  ? "Household Settings"
                  : isHotel
                  ? "Hotel & Banquet Settings"
                  : isRestaurant
                  ? "Restaurant Settings"
                  : "NGO Settings"}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight mt-0.5">
              {t("settings_page.account_amp_platform")}</h1>
            <p className="text-xs text-gray-600">
              {t("settings_page.manage_your_contact")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSave}
            className="px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all cursor-pointer hover:brightness-110 active:scale-95"
            style={{ background: "#164A31" }}
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>{t("settings_page.save_changes")}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t("settings_page.your_settings_and_pr")}</span>
        </div>
      )}

      {/* ═══ Tab Navigation (Only Real Practical Tabs) ═══ */}
      <div className="flex border-b border-[#E8ECF3] gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "profile"
              ? "border-emerald-700 text-emerald-800"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          {isHousehold ? (
            <Home className="w-4 h-4" />
          ) : isRestaurant ? (
            <Utensils className="w-4 h-4" />
          ) : isHotel ? (
            <Hotel className="w-4 h-4" />
          ) : (
            <Building className="w-4 h-4" />
          )}
          <span>
            {isHousehold
              ? t("Household Profile")
              : isRestaurant
              ? t("Restaurant Profile")
              : isHotel
              ? t("Hotel Profile")
              : t("Organization Profile")}
          </span>
        </button>

          <button
            type="button"
            onClick={() => setActiveTab("location")}
            className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "location"
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{isNgo ? t("Service Hub & Area") : t("Address & Pickup Notes")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "notifications"
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>{t("settings_page.notification_prefere")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "security"
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>{t("settings_page.security_amp_account")}</span>
          </button>
        </div>

        {/* ═══ TAB 1: PROFILE & CONTACT ═══ */}
        {activeTab === "profile" && (
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E8ECF3] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8ECF3]">
              <h2 className="text-sm font-bold text-gray-950 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>
                  {isHousehold
                    ? t("Family & Contact Details")
                    : isRestaurant
                    ? t("Restaurant & Kitchen Contact")
                    : isHotel
                    ? t("Hotel & Banquet Management")
                    : t("Relief Organization Details")}
                </span>
              </h2>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {t("settings_page.verified_partner")}</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isHousehold
                    ? t("Household / Family Name")
                    : isRestaurant
                    ? t("Restaurant Name")
                    : isHotel
                    ? t("Hotel & Property Name")
                    : t("NGO / Relief Organization Name")}
                </label>
                <input
                  type="text"
                  required
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-950 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isHousehold
                      ? t("Primary Contact Person")
                      : isRestaurant
                      ? t("Head Chef / Kitchen Manager")
                      : isHotel
                      ? t("Banquet / Operations Manager")
                      : t("Relief Coordinator / Lead")}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-950 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isHousehold
                      ? t("Donor Reference ID")
                      : isNgo
                      ? t("NGO Registration / DARPAN ID")
                      : t("FSSAI License / Registration")}
                  </label>
                  <input
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono text-gray-950 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {t("settings_page.phone_mobile_number")}</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-950 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {t("settings_page.official_email_addre")}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-950 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer hover:brightness-110"
                style={{ background: "#164A31" }}
              >
                {t("settings_page.save_profile")}</button>
            </div>
          </div>
        </form>
      )}

      {/* ═══ TAB 2: ADDRESS & PICKUP NOTES ═══ */}
      {activeTab === "location" && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E8ECF3] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8ECF3]">
            <h2 className="text-sm font-bold text-gray-950 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>
                {isNgo
                  ? t("Distribution Hub & Service Coverage")
                  : t("Pickup Address & Access Details")}
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                {isHousehold
                  ? t("Home / Residence Address")
                  : isNgo
                  ? t("Main Food Distribution Center / Hub")
                  : t("Property / Kitchen Street Address")}
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-950 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {t("settings_page.city_state")}</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-950 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {isNgo && (
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {t("settings_page.coverage_areas_pinco")}</label>
                  <input
                    type="text"
                    value={coverageArea}
                    onChange={(e) => setCoverageArea(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-950 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                {isHousehold
                  ? t("Doorbell & Floor Instructions for Volunteer")
                  : isHotel
                  ? t("Loading Dock & Banquet Service Access Notes")
                  : isRestaurant
                  ? t("Backdoor / Kitchen Handover Instructions")
                  : t("Hub Operating Hours & Drop-off Notes")}
              </label>
              <textarea
                rows={3}
                value={pickupInstructions}
                onChange={(e) => setPickupInstructions(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-950 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer hover:brightness-110"
                style={{ background: "#164A31" }}
              >
                {t("settings_page.save_location_detail")}</button>
            </div>
          </div>
        </form>
      )}

      {/* ═══ TAB 3: NOTIFICATION PREFERENCES (REAL EVENTS ONLY) ═══ */}
      {activeTab === "notifications" && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E8ECF3] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8ECF3]">
            <div>
              <h2 className="text-sm font-bold text-gray-950 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-700" />
                <span>{t("settings_page.donation_amp_pickup")}</span>
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                {t("settings_page.configure_notificati")}</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Toggle 1 */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-900">
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

            {/* Toggle 2 */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-900">
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

            {/* Toggle 3 */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-900">
                  {t("settings_page.delivery_handover_am")}</div>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  {t("settings_page.receive_verified_con")}</p>
              </div>
              <input
                type="checkbox"
                checked={notifyCompleted}
                onChange={(e) => setNotifyCompleted(e.target.checked)}
                className="w-4 h-4 accent-emerald-700 cursor-pointer"
              />
            </div>

            {/* Toggle 4: Audio Chimes */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-900">
                  {t("settings_page.in_browser_audio_ale")}</div>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  {t("settings_page.play_a_gentle_audio")}</p>
              </div>
              <input
                type="checkbox"
                checked={enableAudioChime}
                onChange={(e) => setEnableAudioChime(e.target.checked)}
                className="w-4 h-4 accent-emerald-700 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer hover:brightness-110"
                style={{ background: "#164A31" }}
              >
                {t("settings_page.save_preferences")}</button>
            </div>
          </div>
        </form>
      )}

      {/* ═══ TAB 4: SECURITY & ACCOUNT ═══ */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E8ECF3] p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-950 flex items-center gap-2 pb-3 border-b border-[#E8ECF3]">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              <span>{t("settings_page.change_password")}</span>
            </h2>

            <div className="space-y-3 max-w-md">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">{t("settings_page.current_password")}</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">{t("settings_page.new_password")}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">{t("settings_page.confirm_new_password")}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer hover:brightness-110"
                  style={{ background: "#164A31" }}
                >
                  {t("settings_page.update_password")}</button>
              </div>
            </div>
          </form>

          {/* Account Session & Logout */}
          <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-gray-950">{t("settings_page.active_session")}</div>
              <p className="text-xs text-gray-600 mt-0.5">
                {t("settings_page.signed_in_as")}<strong>{entityName}</strong> ({userRole})
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("settings_page.log_out_of_foodwise")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
