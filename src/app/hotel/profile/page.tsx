"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  Hotel,
  ShieldCheck,
  CheckCircle2,
  Utensils,
  Clock,
  MapPin,
  ThermometerSnowflake,
  Sparkles,
} from "lucide-react";

export default function HotelProfilePage() {
  const { activeDonor } = useApp();
  const { t } = useLang();
  const [name, setName] = useState(activeDonor.name);
  const [establishmentCategory, setEstablishmentCategory] = useState("Hotel & Banquet Operations");
  const [contact, setContact] = useState(activeDonor.contactPerson || "Suresh Rao (Banquet & Kitchen Manager)");
  const [phone, setPhone] = useState(activeDonor.phone || "+91 80 2558 5858");
  const [email, setEmail] = useState(activeDonor.email || "banquets@oberoibangalore.com");
  const [address, setAddress] = useState(activeDonor.address || "37-39, MG Road, Yellappa Garden, Sivanchetti Gardens, Bengaluru, Karnataka 560001");
  const [city, setCity] = useState(activeDonor.city || "Bengaluru");
  const [fssai, setFssai] = useState(activeDonor.fssaiNumber || "11220005001290");
  const [operatingHours, setOperatingHours] = useState("07:00 AM – 11:45 PM Daily");
  const [thermalCambrosAvailable, setThermalCambrosAvailable] = useState(true);
  const [coldRoomStorageAvailable, setColdRoomStorageAvailable] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#E8ECF3]">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
            <Hotel className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t("Restaurant / Hotel Profile")}</span>
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500">{activeDonor.city || "Commercial Entity"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
          {t("Establishment Profile & Logistics Credentials")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {t("Keep your commercial property details, FSSAI licensing, and banquet dispatch gate instructions up to date.")}
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5 text-xs">
        <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-200 flex items-center justify-center font-black text-2xl shadow-xs">
            🏨
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-950">{name}</h2>
            <div className="flex items-center gap-2 text-gray-500 mt-0.5 flex-wrap">
              <span>{city}</span>
              <span>•</span>
              <span className="text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>{t("Verified Food Safety Partner")}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-800 mb-1">
              {t("Restaurant / Hotel Establishment Name *")}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Commercial Category *")}
            </label>
            <select
              value={establishmentCategory}
              onChange={(e) => setEstablishmentCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-medium"
            >
              <option value="Hotel & Banquet Operations">{t("Hotel & Banquet Operations")}</option>
              <option value="Restaurant & Fine Dining">{t("Restaurant & Fine Dining")}</option>
              <option value="All-Day Dining & Buffet">{t("All-Day Dining & Buffet")}</option>
              <option value="Event Catering & Banquet Hall">{t("Event Catering & Banquet Hall")}</option>
              <option value="Café & Commercial Bakery">{t("Café & Commercial Bakery")}</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Operations / Banquet Manager Name *")}
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Direct Phone Number *")}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Operations Email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-800 mb-1">
              {t("Loading Dock & Dispatch Gate Address *")}
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("City / Region *")}
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("FSSAI Commercial License Number")}
            </label>
            <input
              type="text"
              value={fssai}
              onChange={(e) => setFssai(e.target.value)}
              placeholder="e.g. 11220005001290"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-800 mb-1">
              {t("Kitchen Operating Hours")}
            </label>
            <input
              type="text"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Cold-chain capability toggles */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
            {t("Logistics & Preservation Readiness")}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-gray-800">
                {t("Thermal Cambro Warmers Available")}
              </span>
              <input
                type="checkbox"
                checked={thermalCambrosAvailable}
                onChange={(e) => setThermalCambrosAvailable(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </label>

            <label className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-gray-800">
                {t("Walk-In Cold Storage (<5°C)")}
              </span>
              <input
                type="checkbox"
                checked={coldRoomStorageAvailable}
                onChange={(e) => setColdRoomStorageAvailable(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between">
          {saved && (
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t("Establishment profile saved successfully!")}</span>
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-white shadow-md hover:brightness-110 active:scale-95 cursor-pointer ml-auto flex items-center gap-1.5"
            style={{ background: "#164A31" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t("Save Changes")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
