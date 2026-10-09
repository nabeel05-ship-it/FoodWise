"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  Hotel,
  Utensils,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
  Truck,
  Flame,
  ThermometerSnowflake,
  PackageCheck,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { calculateUrgency } from "@/lib/smartMatching";

function HotelDonateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addDonation, activeDonor } = useApp();
  const { t } = useLang();

  const [establishmentType, setEstablishmentType] = useState("Restaurant & Commercial Kitchen");
  const [mealType, setMealType] = useState(searchParams.get("repeatCategory") || "Banquet / Event Surplus");
  const [source, setSource] = useState("Banquet / Buffet Service");
  const [serviceShift, setServiceShift] = useState("Dinner Service / Closing Shift");
  const [foodName, setFoodName] = useState(
    searchParams.get("repeatFood") || "Corporate Banquet Buffet: Dal Makhani, Paneer Gravy & 150 Rotis"
  );
  const [quantityKg, setQuantityKg] = useState(searchParams.get("repeatKg") || "25");
  const [servings, setServings] = useState(searchParams.get("repeatServings") || "75");
  const [diet, setDiet] = useState<"Vegetarian" | "Non-Vegetarian" | "Vegan">(
    (searchParams.get("repeatDiet") as "Vegetarian" | "Non-Vegetarian" | "Vegan") || "Vegetarian"
  );
  const [holdingMethod, setHoldingMethod] = useState("Hot Holding (>65°C / 149°F in Thermal Cambros)");
  const [packagingType, setPackagingType] = useState("Insulated Food-Grade Thermal Cambro Boxes");
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [preparationTime, setPreparationTime] = useState("Dinner Service Concluded (10:15 PM)");
  const [pickupDeadline, setPickupDeadline] = useState("Tonight, 11:45 PM");
  const [location, setLocation] = useState(
    activeDonor.address || "37-39, MG Road, Bengaluru"
  );
  const [city, setCity] = useState(activeDonor.city || "Bengaluru");
  const [phone, setPhone] = useState(activeDonor.phone || "+91 81822 22588");
  const [dockInstructions, setDockInstructions] = useState(
    "Report to Service Gate / Loading Bay 2. Security will guide driver to service elevator with pre-packed thermal containers."
  );
  const [vehicleRecommendation, setVehicleRecommendation] = useState("Auto / Cargo 3-Wheeler (15-60kg)");
  const [safetyConfirmed, setSafetyConfirmed] = useState(true);

  // Sync servings when kg changes (approx 3 adult meals per kg)
  const handleKgChange = (newKg: string) => {
    setQuantityKg(newKg);
    const parsed = parseFloat(newKg);
    if (!isNaN(parsed) && parsed > 0) {
      setServings(String(Math.round(parsed * 3)));
    }
  };

  const handlePreFill = (type: "banquet" | "restaurant" | "breakfast" | "bakery") => {
    if (type === "banquet") {
      setEstablishmentType("Hotel Banquet & Grand Ballroom");
      setMealType("Banquet / Event Surplus");
      setSource("Banquet / Buffet Service");
      setServiceShift("Dinner Service / Closing Shift");
      setFoodName("Grand Wedding Buffet: Shahi Paneer, Pulao, Dal Makhani & 200 Naans");
      setQuantityKg("35");
      setServings("110");
      setDiet("Vegetarian");
      setHoldingMethod("Hot Holding (>65°C / 149°F in Thermal Cambros)");
      setPackagingType("Insulated Food-Grade Thermal Cambro Boxes");
      setPreparationTime("Wedding Buffet Closed (10:30 PM)");
      setPickupDeadline("Tonight, 11:45 PM");
      setDockInstructions("Loading Bay 2 behind main hotel tower. Service elevator open for volunteers.");
      setVehicleRecommendation("Mini Van / Insulated Tempo (>60kg)");
    } else if (type === "restaurant") {
      setEstablishmentType("Restaurant & Commercial Kitchen");
      setMealType("Dinner Buffet / A La Carte");
      setSource("Commercial Kitchen");
      setServiceShift("Dinner Service / Closing Shift");
      setFoodName("Fresh Kitchen Surplus: Chicken Dum Biryani, Mixed Veg Gravy & 80 Chapatis");
      setQuantityKg("18");
      setServings("55");
      setDiet("Non-Vegetarian");
      setHoldingMethod("Hot Holding (>65°C / 149°F in Thermal Cambros)");
      setPackagingType("Tamper-Evident Biodegradable Meal Boxes");
      setPreparationTime("Kitchen Service Closed (10:45 PM)");
      setPickupDeadline("Tonight, 11:30 PM");
      setDockInstructions("Restaurant back door pantry exit. Enter via commercial service alley.");
      setVehicleRecommendation("Auto / Cargo 3-Wheeler (15-60kg)");
    } else if (type === "breakfast") {
      setEstablishmentType("Hotel All-Day Dining");
      setMealType("Breakfast Buffet");
      setSource("Buffet Service");
      setServiceShift("Morning Breakfast Shift");
      setFoodName("Morning Buffet Surplus: Steamed Idli, Medu Vada, Sambhar & Chutney");
      setQuantityKg("20");
      setServings("65");
      setDiet("Vegetarian");
      setHoldingMethod("Hot Holding (>65°C / 149°F in Thermal Cambros)");
      setPackagingType("Sealed Stainless Steel Gastro-Norm Inserts");
      setPreparationTime("Breakfast Service Closed (10:30 AM)");
      setPickupDeadline("Today, 11:45 AM");
      setDockInstructions("Pantry service entrance next to coffee shop receiving bay.");
      setVehicleRecommendation("Auto / Cargo 3-Wheeler (15-60kg)");
    } else {
      setEstablishmentType("Café & Bakery Production");
      setMealType("Bakery / Prepared Items");
      setSource("Bakery & Patisserie");
      setServiceShift("Daily Production Batch");
      setFoodName("Artisan Bakery Surplus: Sourdough Loaves, Croissants & Sweet Muffins");
      setQuantityKg("14");
      setServings("45");
      setDiet("Vegetarian");
      setHoldingMethod("Ambient / Room Temp (Dry Bakery & Breads)");
      setPackagingType("Food-Grade Corrugated Dispatch Cartons");
      setPreparationTime("Baking Cycle Concluded (4:00 PM)");
      setPickupDeadline("Today, 7:00 PM");
      setDockInstructions("Bakery dispatch counter at rear delivery gate.");
      setVehicleRecommendation("2-Wheeler / Bike (Small <15kg)");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !quantityKg || !servings || !pickupDeadline || !location) {
      alert(t("Please fill in all mandatory fields."));
      return;
    }

    const parsedKg = parseFloat(quantityKg);
    if (isNaN(parsedKg) || parsedKg <= 0) {
      alert(t("Surplus quantity must be a positive number greater than 0 kg."));
      return;
    }

    const urgency = calculateUrgency(pickupDeadline);
    if (urgency.isExpired) {
      alert(t("Collection deadline cannot be in the past or expired. Please set a valid pickup window."));
      return;
    }

    let mappedStorage: "Ambient" | "Refrigerated (< 4°C)" | "Frozen (< -18°C)" | "Hot Holding (> 60°C)" = "Hot Holding (> 60°C)";
    if (holdingMethod.includes("Refrigerat") || holdingMethod.includes("Chilled")) mappedStorage = "Refrigerated (< 4°C)";
    else if (holdingMethod.includes("Freeze") || holdingMethod.includes("Frozen")) mappedStorage = "Frozen (< -18°C)";
    else if (holdingMethod.includes("Ambient") || holdingMethod.includes("Room")) mappedStorage = "Ambient";

    addDonation({
      donorId: activeDonor.id,
      donorName: activeDonor.name,
      donorType: activeDonor.type || "Hotel",
      foodName: foodName.trim(),
      foodCategory: mealType,
      source: `${establishmentType} — ${source}`,
      serviceShift,
      diet,
      quantity: `${parsedKg} kg`,
      quantityKg: parsedKg,
      servings: parseInt(servings, 10) || Math.round(parsedKg * 3),
      description: `${mealType} [${holdingMethod}] • Packed in: ${packagingType} • Instructions: ${dockInstructions}`,
      preparationTime,
      pickupDeadline,
      location,
      city,
      phone,
      contactPerson: activeDonor.contactPerson || "Banquet / Kitchen Dispatch Desk",
      pickupInstructions: dockInstructions,
      storageCondition: mappedStorage,
      allergens: selectedAllergens,
      lat: activeDonor.lat || 12.9733,
      lng: activeDonor.lng || 77.6198,
      foodCondition: `Fresh commercial food. ${holdingMethod}. Packaged in ${packagingType}.`,
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
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
            <Hotel className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t("Restaurant & Hotel Surplus Posting")}</span>
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500">{activeDonor.name}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
          {t("Post Commercial Surplus Food")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {t("Publish bulk edible surplus from banquets, hotel buffets, and restaurant kitchens for authorized NGO collection fleets.")}
        </p>
      </div>

      {/* Quick 1-Click Operations Presets */}
      <div className="p-4 rounded-3xl bg-linear-to-r from-[#FBF9F4] to-[#F3FAF6] border border-emerald-200 space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("Fast 1-Click Kitchen & Banquet Presets:")}</span>
          </span>
          <span className="text-[10px] text-gray-500 font-medium">
            {t("Pre-fills all FSSAI holding & quantity details")}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handlePreFill("banquet")}
            className="p-2.5 rounded-xl text-left bg-white border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="font-bold text-xs text-emerald-950 group-hover:text-emerald-700">
              🍛 {t("35kg Grand Banquet Dinner")}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              {t("Paneer, Dal, Pulao, 200 Naans (~110 meals)")}
            </div>
          </button>

          <button
            type="button"
            onClick={() => handlePreFill("restaurant")}
            className="p-2.5 rounded-xl text-left bg-white border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="font-bold text-xs text-emerald-950 group-hover:text-emerald-700">
              🍽️ {t("18kg Restaurant Kitchen Batch")}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              {t("Dum Biryani, Curries, 80 Chapatis (~55 meals)")}
            </div>
          </button>

          <button
            type="button"
            onClick={() => handlePreFill("breakfast")}
            className="p-2.5 rounded-xl text-left bg-white border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="font-bold text-xs text-emerald-950 group-hover:text-emerald-700">
              🥞 {t("20kg Breakfast Buffet Surplus")}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              {t("Idli, Medu Vada, Sambhar & Chutney (~65 meals)")}
            </div>
          </button>

          <button
            type="button"
            onClick={() => handlePreFill("bakery")}
            className="p-2.5 rounded-xl text-left bg-white border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="font-bold text-xs text-emerald-950 group-hover:text-emerald-700">
              🥐 {t("14kg Artisan Bakery & Bread")}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              {t("Sourdough loaves, Croissants, Muffins (~45 portions)")}
            </div>
          </button>
        </div>
      </div>

      {/* Main Commercial Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4 text-xs">
        {/* Section 1: Facility & Category */}
        <div className="border-b border-gray-100 pb-3">
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-2.5">
            {t("1. Establishment & Operational Context")}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-gray-800 mb-1">
                {t("Establishment / Facility Type *")}
              </label>
              <select
                value={establishmentType}
                onChange={(e) => setEstablishmentType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-semibold"
              >
                <option value="Restaurant & Commercial Kitchen">{t("Restaurant & Commercial Kitchen")}</option>
                <option value="Hotel Banquet & Grand Ballroom">{t("Hotel Banquet & Grand Ballroom")}</option>
                <option value="Hotel All-Day Dining">{t("Hotel All-Day Dining / Buffet")}</option>
                <option value="Catering & Private Event">{t("Outdoor / Event Catering")}</option>
                <option value="Café & Bakery Production">{t("Café & Bakery Production")}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                {t("Meal Category / Course *")}
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-semibold"
              >
                <option value="Banquet / Event Surplus">{t("Banquet / Event Surplus")}</option>
                <option value="Dinner Buffet / A La Carte">{t("Dinner Buffet / A La Carte")}</option>
                <option value="Lunch Service">{t("Lunch Service")}</option>
                <option value="Breakfast Buffet">{t("Breakfast Buffet")}</option>
                <option value="Packed Meal Boxes">{t("Packed Meal Boxes")}</option>
                <option value="Bakery / Prepared Items">{t("Bakery / Prepared Items")}</option>
                <option value="Raw / Prep Kitchen Surplus">{t("Raw / Prep Kitchen Ingredients")}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                {t("Kitchen Service Shift *")}
              </label>
              <select
                value={serviceShift}
                onChange={(e) => setServiceShift(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
              >
                <option value="Dinner Service / Closing Shift">{t("Dinner Service / Closing Shift (Night)")}</option>
                <option value="Lunch Service Cutoff">{t("Lunch Service Cutoff (Afternoon)")}</option>
                <option value="Morning Breakfast Shift">{t("Morning Breakfast Shift")}</option>
                <option value="Midnight Event Wrap-up">{t("Midnight Event Wrap-up")}</option>
                <option value="Daily Production Batch">{t("Daily Production / Prep Batch")}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                {t("Dietary Classification *")}
              </label>
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value as typeof diet)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-medium"
              >
                <option value="Vegetarian">{t("Pure Vegetarian (Veg)")}</option>
                <option value="Non-Vegetarian">{t("Non-Vegetarian (Non-Veg)")}</option>
                <option value="Vegan">{t("Vegan (Plant-Based)")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Food Description & Quantities */}
        <div className="border-b border-gray-100 pb-3">
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-2.5">
            {t("2. Surplus Details & Quantities")}
          </span>
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">
                {t("Surplus Food Item Description *")}
              </label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder={t("e.g. Banquet Buffet: Shahi Paneer, Dal Makhani, Jeera Pulao & 150 Rotis")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  {t("Total Weight (kg) *")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={quantityKg}
                    onChange={(e) => handleKgChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-bold"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    kg
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  {t("Estimated Portions (Servings) *")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    required
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-bold"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    {t("people")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Food Safety & Holding Protocol */}
        <div className="border-b border-gray-100 pb-3">
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-2.5">
            {t("3. Food Safety, Holding & Packaging (FSSAI Compliance)")}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-gray-800 mb-1">
                {t("Temperature Holding Method *")}
              </label>
              <select
                value={holdingMethod}
                onChange={(e) => setHoldingMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
              >
                <option value="Hot Holding (>65°C / 149°F in Thermal Cambros)">
                  🔥 {t("Hot Holding (>65°C / 149°F in Thermal Cambros)")}
                </option>
                <option value="Chilled Refrigeration (<5°C / 41°F in Food-grade Pans)">
                  ❄️ {t("Chilled (<5°C / 41°F in Clean Stainless Inserts)")}
                </option>
                <option value="Ambient / Room Temp (Dry Bakery & Breads)">
                  🍞 {t("Ambient Room Temp (Dry Bakery & Breads)")}
                </option>
                <option value="Deep Freeze (-18°C)">
                  🧊 {t("Deep Freeze (-18°C Raw / Prep Surplus)")}
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                {t("Packaging & Dispatch Format *")}
              </label>
              <select
                value={packagingType}
                onChange={(e) => setPackagingType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
              >
                <option value="Insulated Food-Grade Thermal Cambro Boxes">
                  {t("Insulated Food-Grade Thermal Cambro Boxes")}
                </option>
                <option value="Sealed Stainless Steel Gastro-Norm Inserts">
                  {t("Sealed Stainless Steel Gastro-Norm Inserts")}
                </option>
                <option value="Tamper-Evident Biodegradable Meal Boxes">
                  {t("Tamper-Evident Biodegradable Meal Boxes")}
                </option>
                <option value="Food-Grade Corrugated Dispatch Cartons">
                  {t("Food-Grade Corrugated Dispatch Cartons (Bakery)")}
                </option>
                <option value="Foil Trays with Thermal Cling Wrap">
                  {t("Foil Trays with Thermal Cling Wrap")}
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                {t("Service Conclusion / Prep Time")}
              </label>
              <input
                type="text"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                placeholder={t("e.g. Dinner Ended (10:15 PM)")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                {t("Pickup Deadline *")}
              </label>
              <input
                type="text"
                required
                value={pickupDeadline}
                onChange={(e) => setPickupDeadline(e.target.value)}
                placeholder={t("e.g. Tonight, 11:45 PM")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-bold"
              />
            </div>
          </div>

          {/* Allergen Declaration Sub-Section */}
          <div className="mt-3.5 pt-3 border-t border-gray-100">
            <label className="block font-bold text-gray-800 text-xs mb-1.5">
              {t("Known Allergen Declarations (Select all present):")}
            </label>
            <div className="flex flex-wrap gap-2">
              {["Dairy / Milk", "Peanuts & Tree Nuts", "Gluten / Wheat", "Soy / Soya", "Eggs", "Mustard", "Allergen Free / None"].map((allergen) => {
                const isSelected = selectedAllergens.includes(allergen);
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => {
                      if (allergen === "Allergen Free / None") {
                        setSelectedAllergens(isSelected ? [] : ["Allergen Free / None"]);
                      } else {
                        setSelectedAllergens((prev) =>
                          isSelected
                            ? prev.filter((a) => a !== allergen)
                            : [...prev.filter((a) => a !== "Allergen Free / None"), allergen]
                        );
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-100 border-amber-400 text-amber-950 font-bold"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {allergen}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 4: Loading Dock & Logistics */}
        <div>
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-2.5">
            {t("4. Loading Bay & Vehicle Logistics")}
          </span>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  {t("Pickup Gate / Dock Location *")}
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t("e.g. Service Gate 2 / Loading Dock, The Oberoi")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  {t("Recommended Vehicle Capacity")}
                </label>
                <select
                  value={vehicleRecommendation}
                  onChange={(e) => setVehicleRecommendation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                >
                  <option value="2-Wheeler / Bike (Small <15kg)">{t("2-Wheeler / Bike (Small <15kg)")}</option>
                  <option value="Auto / Cargo 3-Wheeler (15-60kg)">{t("Auto / Cargo 3-Wheeler (15-60kg)")}</option>
                  <option value="Mini Van / Insulated Tempo (>60kg)">{t("Mini Van / Insulated Tempo (>60kg)")}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                {t("Loading Dock & Security Gate Instructions")}
              </label>
              <textarea
                rows={2}
                value={dockInstructions}
                onChange={(e) => setDockInstructions(e.target.value)}
                placeholder={t("e.g. Enter via Service Gate 2. Inform security guard of FoodWise NGO pickup. Elevator 4 accessible.")}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Food Safety & Hygiene Declaration */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5">
          <input
            type="checkbox"
            id="hotel-safe-confirm"
            required
            checked={safetyConfirmed}
            onChange={(e) => setSafetyConfirmed(e.target.checked)}
            className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="hotel-safe-confirm" className="text-[11px] text-amber-950 leading-snug cursor-pointer">
            <strong>{t("FSSAI Commercial Food Safety & Hygiene Declaration:")}</strong>{" "}
            {t("I certify on behalf of this establishment that this surplus food was prepared under standard hygiene practices, stored within temperature safety limits, packaged in food-safe containers, and is safe for dignified community redistribution.")}
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
            className="px-6 py-2.5 rounded-xl font-bold text-white shadow-md hover:brightness-110 active:scale-95 cursor-pointer flex items-center gap-2"
            style={{ background: "#164A31" }}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{t("Publish Batch to NGO Fleet")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function HotelDonatePage() {
  const { t } = useLang();
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">{t("Loading donation form...")}</div>}>
      <HotelDonateForm />
    </Suspense>
  );
}
