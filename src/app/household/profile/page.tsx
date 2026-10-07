"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  Users,
  MapPin,
  Phone,
  Mail,
  Home,
  ShieldCheck,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function HouseholdProfilePage() {
  const { activeDonor } = useApp();
  const { t } = useLang();

  const [name, setName] = useState(activeDonor?.name || "Sharma Family Residence");
  const [contactPerson, setContactPerson] = useState(
    activeDonor?.contactPerson || "Vikram Sharma"
  );
  const [phone, setPhone] = useState(activeDonor?.phone || "+91 98112 34567");
  const [email, setEmail] = useState("sharma.family@gmail.com");
  const [address, setAddress] = useState(
    activeDonor?.address || "Flat 402, Green Avenue, Hauz Khas"
  );
  const [city, setCity] = useState(activeDonor?.city || "New Delhi");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#E8ECF3]">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
          <Home className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-950">{t("Household Profile")}</h1>
          <p className="text-xs text-gray-600">
            {t("Manage your family or residential contact details for pickup coordination.")}
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{t("Profile changes saved successfully.")}</span>
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-[#E8ECF3] p-6 sm:p-8 shadow-xs space-y-5"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            {t("Household / Family Name")}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              {t("Primary Contact Person")}
            </label>
            <input
              type="text"
              required
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              {t("Phone Number")}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            {t("Email Address")}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            {t("Residential Address (For Handover)")}
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            {t("City / Locality")}
          </label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
            style={{ background: "#164A31" }}
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>{t("Save Profile")}</span>
          </button>
        </div>
      </form>

      {/* Trust & Safety info */}
      <div className="p-4 rounded-xl bg-white border border-[#E8ECF3] text-gray-600 text-xs flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
        <span>
          {t("Your address is only shared with verified relief coordinators once you confirm a pickup request.")}
        </span>
      </div>
    </div>
  );
}
