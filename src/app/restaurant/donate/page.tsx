"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  Utensils,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
  Flame,
} from "lucide-react";
import confetti from "canvas-confetti";

function RestaurantDonateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addDonation, activeDonor } = useApp();
  const { t } = useLang();

  const [foodName, setFoodName] = useState("Vegetable Dum Biryani with Raita");
  const [foodCategory, setFoodCategory] = useState("Cooked Meals");
  const [serviceShift, setServiceShift] = useState("Lunch Service");
  const [diet, setDiet] = useState<"Vegetarian" | "Non-Vegetarian" | "Vegan">("Vegetarian");
  const [quantityKg, setQuantityKg] = useState("12");
  const [servings, setServings] = useState("35");
  const [preparationTime, setPreparationTime] = useState("Lunch Service (1:30 PM)");
  const [pickupDeadline, setPickupDeadline] = useState("Today, 8:30 PM");
  const [location, setLocation] = useState(
    activeDonor.address || "Block B, Radial Road 3, Connaught Place"
  );
  const [city, setCity] = useState(activeDonor.city || "New Delhi");
  const [phone, setPhone] = useState(activeDonor.phone || "+91 98101 23456");
  const [instructions, setInstructions] = useState(
    "Hot held in food-grade insulated thermal containers (>65°C). Handover from kitchen back entrance."
  );
  const [safetyConfirmed, setSafetyConfirmed] = useState(true);

  // Support repeat donation from URL search params
  useEffect(() => {
    const repeatFood = searchParams.get("repeatFood");
    if (repeatFood) setFoodName(repeatFood);
    const repeatCat = searchParams.get("repeatCategory");
    if (repeatCat) setFoodCategory(repeatCat);
    const repeatKg = searchParams.get("repeatKg");
    if (repeatKg) setQuantityKg(repeatKg);
    const repeatServings = searchParams.get("repeatServings");
    if (repeatServings) setServings(repeatServings);
    const repeatDiet = searchParams.get("repeatDiet");
    if (repeatDiet) setDiet(repeatDiet as typeof diet);
  }, [searchParams]);

  const handlePreFill = (type: "biryani" | "dal" | "roti") => {
    if (type === "biryani") {
      setFoodName("Vegetable Dum Biryani & Cucumber Raita");
      setQuantityKg("12");
      setServings("35");
      setServiceShift("Lunch Service");
      setDiet("Vegetarian");
      setInstructions("Freshly prepared for lunch rush. Stored hot in food-grade thermal vessels.");
      setPickupDeadline("Today, 8:30 PM");
    } else if (type === "dal") {
      setFoodName("Dal Makhani, Mix Vegetable & Jeera Rice");
      setQuantityKg("18");
      setServings("50");
      setServiceShift("Dinner Service");
      setDiet("Vegetarian");
      setInstructions("Packed in sealed aluminium containers. Ready for immediate NGO distribution.");
      setPickupDeadline("Today, 9:00 PM");
    } else {
      setFoodName("Chicken Tikka Curry & 40 Tandoori Rotis");
      setQuantityKg("15");
      setServings("40");
      setServiceShift("Dinner Service");
      setDiet("Non-Vegetarian");
      setInstructions("Kept covered in clean insulated boxes. Non-veg label attached.");
      setPickupDeadline("Today, 8:00 PM");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !quantityKg || !servings || !pickupDeadline || !location) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    addDonation({
      donorId: activeDonor.id,
      donorName: activeDonor.name,
      donorType: "Restaurant",
      foodName,
      foodCategory,
      serviceShift,
      diet,
      quantity: `${quantityKg} kg`,
      quantityKg: parseFloat(quantityKg) || 12,
      servings: parseInt(servings, 10) || 35,
      description: instructions,
      preparationTime,
      pickupDeadline,
      location,
      city,
      phone,
      foodCondition: "Freshly cooked, hot held >65°C, untouched.",
    });

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {}

    router.push("/restaurant/donations");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#E8ECF3]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5" />
            {t("Restaurant Donation Form")}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500">{activeDonor.name}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
          {t("Donate Surplus Kitchen Food")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {t("List surplus batch meals from today's service for verified NGO volunteer collection.")}
        </p>
      </div>

      {/* Quick Test Sample Helper */}
      <div className="p-3.5 rounded-2xl bg-[#FBF9F4] border border-emerald-200">
        <span className="text-xs font-bold text-emerald-950 block mb-1.5">
          {t("Fast Demo 1-Click Pre-fill:")}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handlePreFill("biryani")}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 cursor-pointer shadow-2xs"
          >
            🍲 12kg Veg Biryani &amp; Raita
          </button>
          <button
            type="button"
            onClick={() => handlePreFill("dal")}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 cursor-pointer shadow-2xs"
          >
            🍛 18kg Dal Makhani &amp; Rice
          </button>
          <button
            type="button"
            onClick={() => handlePreFill("roti")}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 cursor-pointer shadow-2xs"
          >
            🍗 15kg Chicken Curry &amp; Rotis
          </button>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Food Name */}
          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-800 mb-1">
              {t("Food Item / Batch Name *")}
            </label>
            <input
              type="text"
              required
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder={t("e.g. Vegetable Dum Biryani, Mixed Veg & 50 Rotis")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-semibold"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Quantity (kg) *")}
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              required
              value={quantityKg}
              onChange={(e) => setQuantityKg(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-bold"
            />
          </div>

          {/* Servings */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Estimated Servings (People) *")}
            </label>
            <input
              type="number"
              min="1"
              required
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-bold"
            />
          </div>

          {/* Service Shift / Timing */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Service Shift / Timing")}
            </label>
            <select
              value={serviceShift}
              onChange={(e) => setServiceShift(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-semibold"
            >
              <option value="Lunch Service">{t("Lunch Service")}</option>
              <option value="Dinner Service">{t("Dinner Service")}</option>
              <option value="Daily Closing Time">{t("Daily Closing Time")}</option>
              <option value="Catering & Takeaway Excess">{t("Catering & Takeaway Excess")}</option>
              <option value="Other Kitchen Surplus">{t("Other Kitchen Surplus")}</option>
            </select>
          </div>

          {/* Diet */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Dietary Tag")}
            </label>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value as typeof diet)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            >
              <option value="Vegetarian">{t("Vegetarian")}</option>
              <option value="Non-Vegetarian">{t("Non-Vegetarian")}</option>
              <option value="Vegan">{t("Vegan")}</option>
            </select>
          </div>

          {/* Preparation Time */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Preparation Service Time")}
            </label>
            <input
              type="text"
              value={preparationTime}
              onChange={(e) => setPreparationTime(e.target.value)}
              placeholder={t("e.g. Lunch Service (1:30 PM)")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>

          {/* Pickup Deadline */}
          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-800 mb-1">
              {t("Available Until (Pickup Deadline) *")}
            </label>
            <input
              type="text"
              required
              value={pickupDeadline}
              onChange={(e) => setPickupDeadline(e.target.value)}
              placeholder={t("e.g. Today, 8:30 PM")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-medium"
            />
          </div>

          {/* Location */}
          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-800 mb-1">
              {t("Kitchen Pickup Address *")}
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t("Kitchen street address and landmark")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>

          {/* Packaging / Pickup Instructions */}
          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-800 mb-1">
              {t("Packaging & Handover Instructions")}
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={t("e.g. Hot held in sealed stainless steel containers. Enter via kitchen back door.")}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 resize-none"
            />
          </div>
        </div>

        {/* Safety Declaration */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
          <input
            type="checkbox"
            id="rest-safe-confirm"
            required
            checked={safetyConfirmed}
            onChange={(e) => setSafetyConfirmed(e.target.checked)}
            className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="rest-safe-confirm" className="text-[11px] text-amber-950 leading-snug cursor-pointer">
            <strong>{t("FSSAI Safe Food Donation Confirmation:")} </strong>{t("I confirm this batch was prepared under hygienic conditions, is safe for immediate consumption, and has been kept properly covered.")}
          </label>
        </div>

        {/* Submit Actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-white shadow-md hover:brightness-110 active:scale-95 cursor-pointer flex items-center gap-1.5"
            style={{ background: "#164A31" }}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t("Publish Donation to NGOs")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function RestaurantDonatePage() {
  const { t } = useLang();
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">{t("Loading donation form...")}</div>}>
      <RestaurantDonateForm />
    </Suspense>
  );
}
