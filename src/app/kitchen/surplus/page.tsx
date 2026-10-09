"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { DonorType, DonationItem } from "@/lib/types";
import {
  HeartHandshake,
  PlusCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Utensils,
  Hotel,
  Home,
  ShieldCheck,
  AlertCircle,
  Truck,
  Sparkles,
  Search,
  Filter,
  X,
  Phone,
  Key,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function KitchenSurplusPage() {
  const {
    donations,
    addDonation,
    activeDonor,
    setActiveDonorId,
    allDonors,
    completeDonation,
    cancelDonation,
  } = useApp();
  const { t } = useLang();

  // Create Donation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "AVAILABLE" | "ACCEPTED" | "COMPLETED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDonationDetails, setSelectedDonationDetails] = useState<DonationItem | null>(null);

  // Form State
  const [donorType, setDonorType] = useState<DonorType>(activeDonor?.type || "Restaurant");
  const [foodName, setFoodName] = useState("Vegetable Biryani");
  const [foodCategory, setFoodCategory] = useState("Cooked Meals");
  const [diet, setDiet] = useState<"Vegetarian" | "Non-Vegetarian" | "Vegan">("Vegetarian");
  const [quantityKg, setQuantityKg] = useState("10");
  const [servings, setServings] = useState("40");
  const [preparationTime, setPreparationTime] = useState("Today, 1:30 PM");
  const [pickupDeadline, setPickupDeadline] = useState("Today, 8:00 PM");
  const [location, setLocation] = useState(activeDonor?.address || "37-39, MG Road, Bengaluru");
  const [city, setCity] = useState(activeDonor?.city || "Bengaluru");
  const [phone, setPhone] = useState(activeDonor?.phone || "+91 80 2558 5858");
  const [description, setDescription] = useState(
    "Freshly prepared food, suitable for immediate consumption. Packed in hygienic sealed thermal containers."
  );
  const [foodCondition, setFoodCondition] = useState(
    "Freshly cooked, kept hot (>65°C), completely untouched."
  );
  const [hygieneConfirmed, setHygieneConfirmed] = useState(true);

  // Handle donor change
  const handleDonorSelect = (donorId: string) => {
    setActiveDonorId(donorId);
    const found = allDonors.find((d) => d.id === donorId);
    if (found) {
      setDonorType(found.type);
      setLocation(found.address);
      setCity(found.city);
      setPhone(found.phone);
    }
  };

  const handlePreFillSample = (sampleType: "biryani" | "dal" | "home") => {
    if (sampleType === "biryani") {
      setFoodName("Vegetable Dum Biryani with Raita");
      setQuantityKg("12");
      setServings("35");
      setDescription("Aromatic basmati rice dum biryani cooked fresh for lunch service. Hot held in sealed stainless steel containers.");
      setPickupDeadline("Today, 8:30 PM");
      setDiet("Vegetarian");
    } else if (sampleType === "dal") {
      setFoodName("Dal Makhani, Mix Veg & Rotis");
      setQuantityKg("25");
      setServings("75");
      setDescription("Banquet buffet surplus. Pristine condition, wrapped in food-grade foil containers.");
      setPickupDeadline("Today, 7:00 PM");
      setDiet("Vegetarian");
    } else {
      setFoodName("Vegetable Pulao & Dal");
      setQuantityKg("2.5");
      setServings("6");
      setDescription("Freshly cooked family dinner surplus. Untouched and packed in clean boxes.");
      setPickupDeadline("Today, 8:00 PM");
      setDiet("Vegetarian");
    }
  };

  const handleCreateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !quantityKg || !servings || !pickupDeadline || !location) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    const created = addDonation({
      donorId: activeDonor?.id || "donor-res-1",
      donorName: activeDonor?.name || "Green Leaf Restaurant",
      donorType: activeDonor?.type || donorType,
      foodName,
      foodCategory,
      diet,
      quantity: `${quantityKg} kg`,
      quantityKg: parseFloat(quantityKg) || 10,
      servings: parseInt(servings, 10) || 30,
      description,
      preparationTime,
      pickupDeadline,
      location,
      city,
      phone,
      lat: activeDonor?.lat || 13.9351265,
      lng: activeDonor?.lng || 75.5684887,
      foodCondition,
    });

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setIsModalOpen(false);
    setSelectedDonationDetails(created);
  };

  // Filtered donations
  const filteredDonations = donations.filter((item) => {
    const matchesFilter =
      filterStatus === "ALL" ||
      item.status === filterStatus ||
      (filterStatus === "ACCEPTED" && (item.status === "ACCEPTED" || item.status === "PICKUP"));

    const matchesSearch =
      item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Community Food Donation
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-[#6B7280]">SDG 2 &amp; SDG 12 Aligned</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
            Surplus Food Donation Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Logged in as: <strong>{activeDonor?.name}</strong> ({activeDonor?.type}) • {activeDonor?.city}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md shadow-emerald-900/20 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
            style={{ background: "#164A31" }}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ Post Surplus Food</span>
          </button>
        </div>
      </div>

      {/* ═══ ACTIVE DONOR IDENTITY BAR ═══ */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8ECF3] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            {activeDonor.type === "Restaurant" ? "🍽️" : activeDonor.type === "Hotel" ? "🏨" : "🏠"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900">{activeDonor.name}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                {activeDonor.type} Account
              </span>
            </div>
            <p className="text-[11px] text-gray-500">{activeDonor.address || activeDonor.city}</p>
          </div>
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>FSSAI Safe Food Donation Guideline Active</span>
        </div>
      </div>

      {/* ═══ FILTER & SEARCH ROW ═══ */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "ALL", label: "All Donations" },
            { id: "AVAILABLE", label: "Available for Pickup" },
            { id: "ACCEPTED", label: "Accepted by NGO" },
            { id: "COMPLETED", label: "Completed" },
          ].map((tab) => {
            const isTabActive = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isTabActive
                    ? "bg-white text-emerald-900 shadow-xs font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food, donor or city..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* ═══ DONATIONS LISTING GRID / TABLE ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDonations.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
            <Utensils className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-800">No surplus food donations found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Click &quot;+ Post Surplus Food&quot; above to create a new donation from your restaurant, hotel, or household.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
            >
              Post First Donation
            </button>
          </div>
        ) : (
          filteredDonations.map((item) => {
            const isAvailable = item.status === "AVAILABLE";
            const isAccepted = item.status === "ACCEPTED" || item.status === "PICKUP";
            const isCompleted = item.status === "COMPLETED";

            return (
              <div
                key={item.id}
                onClick={() => setSelectedDonationDetails(item)}
                className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between ${
                  isAvailable
                    ? "border-emerald-200 hover:border-emerald-400"
                    : isAccepted
                    ? "border-blue-200 hover:border-blue-400 bg-blue-50/20"
                    : "border-gray-200 opacity-90"
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.donorType}
                    </span>

                    {/* Status Badge */}
                    {isAvailable && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available for Pickup
                      </span>
                    )}
                    {isAccepted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                        <Truck className="w-3 h-3" />
                        Accepted by NGO
                      </span>
                    )}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Completed
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 leading-snug">
                    {item.foodName}
                  </h3>
                  <div className="text-xs text-gray-500 mt-0.5 font-medium">
                    Donor: <span className="text-gray-800 font-semibold">{item.donorName}</span>
                  </div>

                  {/* Quantity & Servings highlight */}
                  <div className="mt-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Quantity</span>
                      <span className="font-extrabold text-emerald-800 text-sm">{item.quantityKg} kg</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Estimated Servings</span>
                      <span className="font-extrabold text-gray-900 text-sm">~{item.servings} people</span>
                    </div>
                  </div>

                  {/* Location & Time */}
                  <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Available until: <strong className="text-gray-900">{item.pickupDeadline}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  {isAccepted && item.otp ? (
                    <div className="flex items-center gap-1.5 text-blue-800 bg-blue-100 px-2.5 py-1 rounded-lg font-mono font-bold">
                      <Key className="w-3 h-3" />
                      <span>Pickup OTP: {item.otp}</span>
                    </div>
                  ) : isCompleted ? (
                    <span className="text-emerald-700 font-semibold text-[11px]">
                      Delivered &amp; Verified
                    </span>
                  ) : (
                    <span className="text-gray-400 text-[11px]">Waiting for nearby NGO claim</span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDonationDetails(item);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ═══ CREATE SURPLUS DONATION MODAL ═══ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  New Surplus Listing
                </span>
                <h2 className="text-xl font-black text-gray-950">
                  Donate Surplus Food
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Demo Pre-fill helper */}
            <div className="mt-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <span className="text-[11px] font-bold text-emerald-900 block mb-1">
                Fast Demo Pre-Fill (1-Click Test):
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handlePreFillSample("biryani")}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                >
                  🍲 12kg Biryani (Restaurant)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreFillSample("dal")}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                >
                  🍛 25kg Buffet Dal &amp; Roti (Hotel)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreFillSample("home")}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                >
                  🏠 2.5kg Pulao & Dal (Household)
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateDonation} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Food Name */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Food Item Name *</label>
                  <input
                    type="text"
                    required
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="e.g. Vegetable Biryani, Dal Makhani"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Quantity (in kg) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    placeholder="10"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-semibold"
                  />
                </div>

                {/* Servings */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Estimated Servings (People) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    placeholder="40"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-semibold"
                  />
                </div>

                {/* Diet category */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Dietary Classification</label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value as typeof diet)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>

                {/* Pickup Deadline */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Available Until (Pickup Deadline) *</label>
                  <input
                    type="text"
                    required
                    value={pickupDeadline}
                    onChange={(e) => setPickupDeadline(e.target.value)}
                    placeholder="e.g. Today, 8:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                {/* Location */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Pickup Address &amp; Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Block B, Radial Road 3, Connaught Place, New Delhi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Food Description &amp; Packaging</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Freshly prepared food, suitable for immediate consumption."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 resize-none"
                  />
                </div>
              </div>

              {/* Food safety declaration checkbox */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="safety-confirm"
                  required
                  checked={hygieneConfirmed}
                  onChange={(e) => setHygieneConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="safety-confirm" className="text-[11px] text-amber-900 leading-snug cursor-pointer">
                  <strong>Food Safety Confirmation:</strong> I confirm this surplus food was prepared under hygienic conditions, is safe for immediate human consumption, and is kept covered in clean containers.
                </label>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white shadow-md hover:brightness-110 active:scale-95 cursor-pointer flex items-center gap-1.5"
                  style={{ background: "#164A31" }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Donation to NGOs</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ DONATION DETAILS VIEW MODAL ═══ */}
      {selectedDonationDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                  {selectedDonationDetails.donorType} Surplus
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-1">
                  {selectedDonationDetails.foodName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDonationDetails(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 my-4 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-2xl">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Quantity</span>
                  <span className="font-extrabold text-base text-emerald-800">
                    {selectedDonationDetails.quantityKg} kg
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Feed Capacity</span>
                  <span className="font-extrabold text-base text-gray-900">
                    ~{selectedDonationDetails.servings} people
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800">Pickup Address:</span>
                    <p className="text-gray-600">{selectedDonationDetails.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800">Availability Window:</span>
                    <p className="text-gray-600">Available until {selectedDonationDetails.pickupDeadline}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800">Donor Contact:</span>
                    <p className="text-gray-600">{selectedDonationDetails.phone} ({selectedDonationDetails.donorName})</p>
                  </div>
                </div>
              </div>

              {/* Status info box */}
              {selectedDonationDetails.status === "ACCEPTED" || selectedDonationDetails.status === "PICKUP" ? (
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-blue-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-blue-600" />
                      Claimed by {selectedDonationDetails.acceptedBy}
                    </span>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-200 px-2 py-0.5 rounded">
                      In Transit
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-800 mt-1">
                    Volunteer driver assigned: <strong>{selectedDonationDetails.driverName || "Volunteer Driver"}</strong>
                  </p>
                  {selectedDonationDetails.otp && (
                    <div className="mt-2.5 p-2 bg-white rounded-xl border border-blue-300 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-600">Verification Handover OTP:</span>
                      <span className="text-base font-black tracking-widest text-blue-800 font-mono">
                        {selectedDonationDetails.otp}
                      </span>
                    </div>
                  )}
                </div>
              ) : selectedDonationDetails.status === "COMPLETED" ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <div className="font-extrabold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Handover Completed &amp; Verified
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    This donation reached people in need through <strong>{selectedDonationDetails.acceptedBy || "Partner NGO"}</strong>.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Listed as live. Any nearby registered NGO can claim this donation.</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              {selectedDonationDetails.status === "AVAILABLE" && (
                <button
                  type="button"
                  onClick={() => {
                    cancelDonation(selectedDonationDetails.id);
                    setSelectedDonationDetails(null);
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                >
                  Cancel Donation
                </button>
              )}

              {selectedDonationDetails.status === "ACCEPTED" && (
                <button
                  type="button"
                  onClick={() => {
                    completeDonation(selectedDonationDetails.id);
                    setSelectedDonationDetails(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer ml-auto"
                >
                  Confirm Handover Complete
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedDonationDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
