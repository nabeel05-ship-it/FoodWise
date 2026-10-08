"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  Hotel,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
  Truck,
} from "lucide-react";
import confetti from "canvas-confetti";

function HotelDonateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addDonation, activeDonor } = useApp();
  const { t } = useLang();

  const [mealType, setMealType] = useState("Buffet");
  const [source, setSource] = useState("Buffet");
  const [foodName, setFoodName] = useState("Corporate Banquet Buffet: Dal Makhani, Paneer & 150 Rotis");
  const [quantityKg, setQuantityKg] = useState("25");
  const [servings, setServings] = useState("75");
  const [diet, setDiet] = useState<"Vegetarian" | "Non-Vegetarian" | "Vegan">("Vegetarian");
  const [banquetEndTime, setBanquetEndTime] = useState("Dinner Service Ended (10:15 PM)");
  const [pickupDeadline, setPickupDeadline] = useState("Tonight, 11:30 PM");
  const [location, setLocation] = useState(
    activeDonor.address || "14/2, Station Main Road, Opp. City Park"
  );
  const [city, setCity] = useState(activeDonor.city || "Bangalore");
  const [phone, setPhone] = useState(activeDonor.phone || "+91 98450 87654");
  const [dockInstructions, setDockInstructions] = useState(
    "Report to Service Gate / Loading Bay 2. Security will guide driver to service elevator with pre-packed thermal containers."
  );
  const [safetyConfirmed, setSafetyConfirmed] = useState(true);

  // Check URL params for repeat donation
  useEffect(() => {
    const repeatFood = searchParams.get("repeatFood");
    if (repeatFood) setFoodName(repeatFood);
    const repeatCat = searchParams.get("repeatCategory");
    if (repeatCat) setMealType(repeatCat);
    const repeatKg = searchParams.get("repeatKg");
    if (repeatKg) setQuantityKg(repeatKg);
    const repeatServings = searchParams.get("repeatServings");
    if (repeatServings) setServings(repeatServings);
    const repeatDiet = searchParams.get("repeatDiet");
    if (repeatDiet) setDiet(repeatDiet as typeof diet);
  }, [searchParams]);

  const handlePreFill = (type: "buffet" | "breakfast" | "bakery") => {
    if (type === "buffet") {
      setMealType("Banquet / Event Surplus");
      setSource("Banquet");
      setFoodName("Grand Wedding Buffet: Shahi Paneer, Pulao, Dal & 200 Naans");
      setQuantityKg("35");
      setServings("120");
      setDiet("Vegetarian");
      setDockInstructions("Loading Bay 2 behind main hotel tower. Service elevator ready.");
      setPickupDeadline("Tonight, 11:45 PM");
    } else if (type === "breakfast") {
      setMealType("Breakfast");
      setSource("Buffet");
      setFoodName("Morning Buffet Surplus: Idli, Vada, Sambhar & Upma");
      setQuantityKg("20");
      setServings("70");
      setDiet("Vegetarian");
      setDockInstructions("Coffee shop pantry exit. Insulated warmers provided.");
      setPickupDeadline("Today, 12:30 PM");
    } else {
      setMealType("Bakery / Prepared Items");
      setSource("Regular Kitchen");
      setFoodName("Pastry & Bakery Batch: Assorted Bread Loaves & Muffins");
      setQuantityKg("15");
      setServings("50");
      setDiet("Vegetarian");
      setDockInstructions("Bakery kitchen dispatch area. Pre-boxed in cardboard cartons.");
      setPickupDeadline("Today, 6:00 PM");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !quantityKg || !servings || !pickupDeadline || !location) {
      alert(t("Please fill in all mandatory fields."));
      return;
    }

    addDonation({
      donorId: activeDonor.id,
      donorName: activeDonor.name,
      donorType: "Hotel",
      foodName,
      foodCategory: mealType,
      source,
      diet,
      quantity: `${quantityKg} kg`,
      quantityKg: parseFloat(quantityKg) || 25,
      servings: parseInt(servings, 10) || 75,
      description: `${mealType} (${source}) — ${dockInstructions}`,
      preparationTime: banquetEndTime,
      pickupDeadline,
      location,
      city,
      phone,
      foodCondition: "Pristine buffet surplus, packed in insulated thermal containers.",
    });

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch { }

    router.push("/hotel/donations");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#E8ECF3]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <Hotel className="w-3.5 h-3.5" />
            {t("Hotel Surplus Posting")}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500">{activeDonor.name}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
          {t("Donate Buffet & Banquet Surplus")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {t("Coordinate large-volume meal donations directly with authorized NGO relief fleets.")}
        </p>
      </div>

      {/* Quick Test Pre-fill */}
      <div className="p-3.5 rounded-2xl bg-[#FBF9F4] border border-emerald-200">
        <span className="text-xs font-bold text-emerald-950 block mb-1.5">
          {t("Fast Demo 1-Click Pre-fill:")}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handlePreFill("buffet")}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 cursor-pointer shadow-2xs"
          >
            {t("🍛 35kg Wedding Banquet Buffet")}
          </button>
          <button
            type="button"
            onClick={() => handlePreFill("breakfast")}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 cursor-pointer shadow-2xs"
          >
            {t("🥞 20kg Breakfast Buffet (Idli/Vada)")}
          </button>
          <button
            type="button"
            onClick={() => handlePreFill("bakery")}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 cursor-pointer shadow-2xs"
          >
            {t("🥐 15kg Bakery & Bread Cartons")}
          </button>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Meal Type Category */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Meal Type / Category *")}
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-semibold"
            >
              <option value="Breakfast Buffet">{t("Breakfast Buffet")}</option>
              <option value="Lunch Service">{t("Lunch Service")}</option>
              <option value="Dinner Buffet">{t("Dinner Buffet")}</option>
              <option value="Banquet / Event Surplus">{t("Banquet / Event Surplus")}</option>
              <option value="Packed Meals">{t("Packed Meal Boxes")}</option>
              <option value="Bakery / Prepared Items">{t("Bakery / Prepared Items")}</option>
              <option value="Other">{t("Other Surplus Food")}</option>
            </select>
          </div>

          {/* Surplus Source / Event Context */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Surplus Source / Event Context *")}
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-semibold"
            >
              <option value="Buffet">{t("Buffet Service")}</option>
              <option value="Banquet">{t("Banquet Hall")}</option>
              <option value="Conference">{t("Conference / Seminar")}</option>
              <option value="Event">{t("Special Event / Wedding")}</option>
              <option value="Regular Kitchen">{t("Hotel Main Kitchen")}</option>
              <option value="Catering">{t("Outdoor / Private Catering")}</option>
              <option value="Other">{t("Other Facility Area")}</option>
            </select>
          </div>

          {/* Diet */}
          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-800 mb-1">
              {t("Dietary Classification")}
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

          {/* Food Name */}
          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-800 mb-1">
              {t("Surplus Meals Description *")}
            </label>
            <input
              type="text"
              required
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder={t("e.g. Banquet Dinner Buffet: Dal Makhani, Paneer, Mixed Veg & 150 Rotis")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-semibold"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Total Quantity (kg) *")}
            </label>
            <input
              type="number"
              step="1"
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
              {t("Approximate Servings (People) *")}
            </label>
            <input
              type="number"
              min="5"
              required
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-bold"
            />
          </div>

          {/* Banquet End Time */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Banquet / Buffet Completion Time")}
            </label>
            <input
              type="text"
              value={banquetEndTime}
              onChange={(e) => setBanquetEndTime(e.target.value)}
              placeholder={t("e.g. Dinner Ended (10:15 PM)")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>

          {/* Pickup Deadline */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {t("Pickup Deadline *")}
            </label>
            <input
              type="text"
              required
              value={pickupDeadline}
              onChange={(e) => setPickupDeadline(e.target.value)}
              placeholder={t("e.g. Tonight, 11:30 PM")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-medium"
            />
          </div>

          {/* Location */}
          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-800 mb-1">
              {t("Hotel & Loading Bay Pickup Address *")}
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t("Hotel name, gate number, and full address")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>

          {/* Special Dock / Loading Instructions */}
          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-800 mb-1">
              {t("Loading Bay & Logistics Instructions")}
            </label>
            <textarea
              rows={2}
              value={dockInstructions}
              onChange={(e) => setDockInstructions(e.target.value)}
              placeholder={t("e.g. Vehicle entry via Gate 3 loading dock. Contact banquet shift supervisor.")}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 resize-none"
            />
          </div>
        </div>

        {/* Safety Declaration */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
          <input
            type="checkbox"
            id="hotel-safe-confirm"
            required
            checked={safetyConfirmed}
            onChange={(e) => setSafetyConfirmed(e.target.checked)}
            className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="hotel-safe-confirm" className="text-[11px] text-amber-950 leading-snug cursor-pointer">
            <strong>{t("Hotel Food Safety Declaration:")}</strong> {t("I confirm this buffet surplus was maintained under food hygiene standards, packed in clean insulated food-grade containers, and is ready for safe community redistribution.")}
          </label>
        </div>

        {/* Submit Actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-white shadow-md hover:brightness-110 active:scale-95 cursor-pointer flex items-center gap-1.5"
            style={{ background: "#164A31" }}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t("Publish Meals to NGOs")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function HotelDonatePage() {
  const { t } = useLang();
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">{t("Loading hotel donation form...")}</div>}>
      <HotelDonateForm />
    </Suspense>
  );
}
