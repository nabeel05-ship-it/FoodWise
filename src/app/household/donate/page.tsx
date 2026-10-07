"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  HeartHandshake,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowLeft,
  Sparkles,
  Info,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

const HOUSEHOLD_CATEGORIES = [
  "Cooked Home Meal",
  "Fresh Fruits & Vegetables",
  "Bakery & Bread",
  "Packaged & Dry Groceries",
  "Rice & Dal",
  "Snacks & Sweets",
  "Other Homemade Items",
];

const HOUSEHOLD_REASONS = [
  "Normal household surplus",
  "Family gathering",
  "Celebration",
  "Community event",
  "Other",
];

export default function HouseholdDonatePage() {
  const router = useRouter();
  const { addDonation, activeDonor } = useApp();
  const { t } = useLang();

  const [foodName, setFoodName] = useState("Vegetable Pulao & Dal");
  const [foodCategory, setFoodCategory] = useState(HOUSEHOLD_CATEGORIES[0]);
  const [surplusReason, setSurplusReason] = useState(HOUSEHOLD_REASONS[0]);
  const [diet, setDiet] = useState<"Vegetarian" | "Non-Vegetarian">("Vegetarian");
  const [quantityKg, setQuantityKg] = useState("2.5");
  const [servings, setServings] = useState("6");
  const [preparationTime, setPreparationTime] = useState("Prepared 1-2 hours ago");
  const [pickupHours, setPickupHours] = useState("4");
  const [location, setLocation] = useState(
    activeDonor?.address || "Flat 402, Green Avenue, Hauz Khas"
  );
  const [description, setDescription] = useState("Extra home-cooked portions packed in clean food-safe containers.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleQuickPreFill = (type: "pulao" | "roti" | "gathering") => {
    if (type === "pulao") {
      setFoodName("Vegetable Pulao & Yellow Dal Tadka");
      setFoodCategory("Cooked Home Meal");
      setSurplusReason("Normal household surplus");
      setQuantityKg("2.5");
      setServings("6");
      setDiet("Vegetarian");
      setDescription("Extra freshly cooked dinner from today. Packed in clean food-safe containers with lids.");
    } else if (type === "roti") {
      setFoodName("15 Fresh Chapatis & Mixed Vegetable Curry");
      setFoodCategory("Cooked Home Meal");
      setSurplusReason("Normal household surplus");
      setQuantityKg("2");
      setServings("5");
      setDiet("Vegetarian");
      setDescription("Warm chapatis wrapped in silver foil with a bowl of homemade mixed vegetable curry.");
    } else {
      setFoodName("Celebration Surplus: Matar Paneer, Pulao & 20 Chapatis");
      setFoodCategory("Cooked Home Meal");
      setSurplusReason("Family gathering");
      setQuantityKg("5");
      setServings("14");
      setDiet("Vegetarian");
      setDescription("Surplus from family anniversary celebration. Completely untouched, kept covered and packed fresh.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const expiryDate = new Date(
      now.getTime() + parseFloat(pickupHours || "4") * 60 * 60 * 1000
    );
    const deadlineStr = `${expiryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}, ${expiryDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    setTimeout(() => {
      addDonation({
        donorId: activeDonor.id || "donor-household-01",
        donorName: activeDonor.name || "Sharma Family Residence",
        donorType: "Household",
        foodName: foodName.trim(),
        foodCategory,
        reason: surplusReason,
        diet,
        quantity: `${quantityKg} kg`,
        quantityKg: parseFloat(quantityKg) || 2.5,
        servings: parseInt(servings, 10) || 6,
        description: description || "Freshly cooked household food packed hygienically.",
        preparationTime,
        pickupDeadline: deadlineStr,
        location,
        city: activeDonor.city || "New Delhi",
        phone: activeDonor.phone || "+91 98112 34567",
        foodCondition: "Freshly Cooked / Food Safe",
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-950">{t("Food Donation Listed!")}</h1>
          <p className="text-sm text-gray-600">
            {t("Thank you for sharing with your community. Nearby verified volunteers have been notified to collect your food.")}
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-3">
          <Link
            href="/household/dashboard"
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all"
          >
            {t("Go to Home")}
          </Link>
          <button
            onClick={() => {
              setFoodName("");
              setDescription("");
              setIsSuccess(false);
            }}
            className="px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all hover:brightness-110"
            style={{ background: "#164A31" }}
          >
            {t("Donate Another Item")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button & Header */}
      <div>
        <Link
          href="/household/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("Back to Home")}</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-950 tracking-tight">{t("Donate Surplus Food")}</h1>
            <p className="text-xs text-gray-600">
              {t("Simple 1-minute listing to share extra food with verified volunteers.")}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Donate 1-Click Pre-fill */}
      <div className="p-3.5 rounded-2xl bg-[#FBF9F4] border border-emerald-200">
        <span className="text-xs font-bold text-emerald-950 block mb-1.5">
          {t("Quick Donate 1-Click Samples:")}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleQuickPreFill("pulao")}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 cursor-pointer shadow-2xs"
          >
            🍲 2.5 kg Veg Pulao &amp; Dal (~6 people)
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreFill("roti")}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 cursor-pointer shadow-2xs"
          >
            🍛 15 Chapatis &amp; Sabzi (~5 people)
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreFill("gathering")}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 cursor-pointer shadow-2xs"
          >
            🎉 5 kg Family Gathering Surplus (~14 people)
          </button>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-[#E8ECF3] p-6 sm:p-8 shadow-xs space-y-6"
      >
        {/* Food Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            {t("Food Name / What are you sharing? *")}
          </label>
          <input
            type="text"
            required
            placeholder={t("e.g. Vegetable Pulao & Yellow Dal Tadka")}
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        {/* Category & Reason for Surplus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              {t("Category")}
            </label>
            <select
              value={foodCategory}
              onChange={(e) => setFoodCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
            >
              {HOUSEHOLD_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {t(cat) || cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              {t("Reason for Surplus (Optional Context)")}
            </label>
            <select
              value={surplusReason}
              onChange={(e) => setSurplusReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
            >
              {HOUSEHOLD_REASONS.map((r) => (
                <option key={r} value={r}>
                  {t(r) || r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            {t("Dietary Type")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDiet("Vegetarian")}
              className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                diet === "Vegetarian"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {t("Vegetarian")}
            </button>
            <button
              type="button"
              onClick={() => setDiet("Non-Vegetarian")}
              className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                diet === "Non-Vegetarian"
                  ? "bg-amber-50 text-amber-900 border-amber-300 shadow-xs"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {t("Non-Vegetarian")}
            </button>
          </div>
        </div>

        {/* Quantity & Servings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              {t("Approximate Weight (kg)")}
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              required
              value={quantityKg}
              onChange={(e) => setQuantityKg(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              {t("Approx. Servings (People)")}
            </label>
            <input
              type="number"
              min="1"
              required
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Prepared At & Available Until */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>{t("Prepared When")}</span>
            </label>
            <input
              type="text"
              placeholder={t("e.g. Prepared 1-2 hours ago")}
              value={preparationTime}
              onChange={(e) => setPreparationTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>{t("Available For Pickup Within")}</span>
            </label>
            <select
              value={pickupHours}
              onChange={(e) => setPickupHours(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
            >
              <option value="2">{t("Next 2 hours")}</option>
              <option value="4">{t("Next 4 hours (Recommended)")}</option>
              <option value="6">{t("Next 6 hours")}</option>
              <option value="12">{t("Next 12 hours")}</option>
            </select>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gray-500" />
            <span>{t("Pickup Address / Doorstep Location *")}</span>
          </label>
          <input
            type="text"
            required
            placeholder={t("Flat / House No., Apartment, Street, Locality")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Description / Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            {t("Notes for Volunteer (Optional)")}
          </label>
          <textarea
            rows={2}
            placeholder={t("e.g. Ring the bell on 4th floor. Packed in reusable clean containers.")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
          style={{ background: "#164A31" }}
        >
          {isSubmitting ? (
            <span>{t("Publishing Listing...")}</span>
          ) : (
            <>
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>{t("Publish Food Donation")}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
