"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  Hotel,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function HotelProfilePage() {
  const { activeDonor } = useApp();
  const { t } = useLang();
  const [name, setName] = useState(activeDonor.name);
  const [contact, setContact] = useState(activeDonor.contactPerson || "Suresh Rao (Banquet Manager)");
  const [phone, setPhone] = useState(activeDonor.phone || "+91 98450 87654");
  const [address, setAddress] = useState(activeDonor.address || "14/2, Station Main Road, Opp. City Park");
  const [city, setCity] = useState(activeDonor.city || "Bangalore / Shimoga");
  const [fssai, setFssai] = useState(activeDonor.fssaiNumber || "11220005001290");
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
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <Hotel className="w-3.5 h-3.5" />
            {t("Hotel & Resort Profile")}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
          {t("Hotel Profile & Logistics Info")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {t("Keep your hotel details and banquet operations contacts up to date.")}
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
            🏨
          </div>
          <div>
            <h2 className="text-base font-extrabold text-gray-950">{name}</h2>
            <div className="flex items-center gap-2 text-gray-500 mt-0.5">
              <span>{city}</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {t("Verified Hotel Partner")}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-700 mb-1">
              {t("Hotel / Resort Name")}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              {t("Banquet Manager / Operations Lead")}
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              {t("Direct Contact Phone")}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-700 mb-1">
              {t("Hotel & Loading Dock Address")}
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
            <label className="block font-bold text-gray-700 mb-1">{t("City / Region")}</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              {t("FSSAI Food License Number")}
            </label>
            <input
              type="text"
              value={fssai}
              onChange={(e) => setFssai(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between">
          {saved && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t("Hotel profile updated successfully!")}
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-white shadow-md hover:brightness-110 active:scale-95 cursor-pointer ml-auto"
            style={{ background: "#164A31" }}
          >
            {t("Save Changes")}
          </button>
        </div>
      </form>
    </div>
  );
}
