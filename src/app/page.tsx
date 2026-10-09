"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { DonorType } from "@/lib/types";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HeartHandshake,
  Utensils,
  Hotel,
  Home,
  Truck,
  Globe2,
  ShieldCheck,
  Building2,
  User,
  Phone,
  MapPin,
  Check,
  Copy,
  KeyRound,
} from "lucide-react";

type AuthType = "DONOR" | "NGO";
type DonorCategory = "HOTEL" | "HOUSEHOLD";

export default function LoginPage() {
  const router = useRouter();
  const { login, registerDonor, registerNgo } = useApp();
  const { t } = useLang();

  // Auth flow states
  const [authType, setAuthType] = useState<AuthType>("DONOR");
  const [isRegistering, setIsRegistering] = useState(false);
  const [donorCategory, setDonorCategory] = useState<DonorCategory>("HOTEL");

  // Sign In inputs
  const [email, setEmail] = useState("banquets@oberoibangalore.com");
  const [password, setPassword] = useState("FoodWise@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Donor Registration inputs
  const [regName, setRegName] = useState("");
  const [regContact, setRegContact] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regCity, setRegCity] = useState("Bengaluru");
  const [regFssai, setRegFssai] = useState("");

  // NGO Registration inputs
  const [ngoName, setNgoName] = useState("");
  const [ngoLead, setNgoLead] = useState("");
  const [ngoPhone, setNgoPhone] = useState("");
  const [ngoEmail, setNgoEmail] = useState("");
  const [ngoAddress, setNgoAddress] = useState("");
  const [ngoCity, setNgoCity] = useState("Bengaluru");
  const [ngoCoverage, setNgoCoverage] = useState("Rajajinagar, Malleshwaram & Central Bengaluru");
  const [ngoRegNo, setNgoRegNo] = useState("");



  // Switch between Donor types
  const handleDonorCategorySelect = (cat: DonorCategory) => {
    setDonorCategory(cat);
    if (cat === "HOTEL") {
      setEmail("banquets@oberoibangalore.com");
    } else {
      setEmail("resident@bengaluru.in");
    }
    setPassword("FoodWise@2026");
  };

  // Switch between Donor and NGO tabs
  const handleAuthTypeChange = (type: AuthType) => {
    setAuthType(type);
    setIsRegistering(false);
    if (type === "NGO") {
      setEmail("relief@bangalorefoodbank.org");
      setPassword("FoodWise@2026");
    } else {
      handleDonorCategorySelect(donorCategory);
    }
  };

  // Handle Login submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (authType === "NGO") {
      login("NGO", email);
      setTimeout(() => {
        router.push("/ngo/dashboard");
      }, 350);
    } else {
      login(donorCategory, email);
      setTimeout(() => {
        if (donorCategory === "HOTEL") {
          router.push("/hotel/dashboard");
        } else {
          router.push("/household/dashboard");
        }
      }, 350);
    }
  };

  // Handle Donor Registration submission
  const handleDonorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regAddress) {
      alert("Please provide the required fields.");
      return;
    }
    setIsLoading(true);

    const typeMap: Record<DonorCategory, DonorType> = {
      HOTEL: "Hotel",
      HOUSEHOLD: "Household",
    };

    registerDonor({
      type: typeMap[donorCategory],
      name: regName,
      contactPerson: regContact || regName,
      phone: regPhone,
      email: regEmail || `${regName.toLowerCase().replace(/[^a-z0-9]/g, "")}@foodwise.in`,
      address: regAddress,
      city: regCity || "Bengaluru",
      fssaiNumber: regFssai || undefined,
    });

    setTimeout(() => {
      if (donorCategory === "HOTEL") {
        router.push("/hotel/dashboard");
      } else {
        router.push("/household/dashboard");
      }
    }, 400);
  };

  // Handle NGO Registration submission
  const handleNgoRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ngoName || !ngoLead || !ngoPhone || !ngoAddress) {
      alert("Please provide the required fields.");
      return;
    }
    setIsLoading(true);

    registerNgo({
      name: ngoName,
      lead: ngoLead,
      phone: ngoPhone,
      email: ngoEmail || `${ngoName.toLowerCase().replace(/[^a-z0-9]/g, "")}@relief.org`,
      address: ngoAddress,
      city: ngoCity || "Bengaluru",
      coverageArea: ngoCoverage || "Bengaluru City-wide",
      registrationNumber: ngoRegNo || undefined,
    });

    setTimeout(() => {
      router.push("/ngo/dashboard");
    }, 400);
  };

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {}
  };



  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-3 sm:p-6 lg:p-10 relative overflow-x-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #18422A 0%, #0F2A1C 60%, #091D13 100%)",
      }}
    >
      {/* Decorative organic glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Authentication Card */}
      <div className="w-full max-w-[1080px] bg-[#FBF9F4] rounded-[32px] shadow-2xl overflow-hidden border border-emerald-800/30 relative z-10 grid grid-cols-1 lg:grid-cols-12 animate-in fade-in zoom-in-95 duration-200 mt-4 sm:mt-8">
        {/* LEFT COLUMN: Clean Authentication (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#FBF9F4]">
          <div>
            {/* Top Logo & Brand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="FoodWise Logo"
                  className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0"
                />
                <div>
                  <span className="font-extrabold text-xl text-[#143826] tracking-tight block leading-tight">
                    FoodWise
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-800 tracking-wide block">
                    Food Waste Reduction & Redistribution Platform
                  </span>
                </div>
              </div>
            </div>

            {/* Header Message */}
            <div className="my-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold mb-2">
                <Sparkles className="w-3 h-3 text-emerald-700" />
                Zero Waste Initiative
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight leading-tight">
                {isRegistering
                  ? authType === "DONOR"
                    ? `Register as a ${
                        donorCategory === "HOTEL"
                          ? "Restaurant & Hotel"
                          : "Household"
                      } Donor`
                    : "Register Relief NGO Organization"
                  : "Sign In to FoodWise"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                {isRegistering
                  ? "Join our verified Bengaluru food rescue network and prevent edible food waste."
                  : "Connecting commercial kitchens, luxury hotels, and households with verified relief NGOs."}
              </p>
            </div>

            {/* PRIMARY AUTH TABS: DONOR LOGIN vs NGO / RELIEF LOGIN */}
            <div className="p-1 rounded-2xl bg-gray-200/80 border border-gray-300/70 grid grid-cols-2 gap-1 mb-4">
              <button
                type="button"
                onClick={() => handleAuthTypeChange("DONOR")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authType === "DONOR"
                    ? "bg-white text-emerald-950 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Utensils className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isRegistering ? "Donor Portal" : "Donor Login"}</span>
              </button>
              <button
                type="button"
                onClick={() => handleAuthTypeChange("NGO")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authType === "NGO"
                    ? "bg-white text-emerald-950 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isRegistering ? "NGO / Relief Portal" : "Relief NGO Partner Login"}</span>
              </button>
            </div>

            {/* IF DONOR: Choose Donor Type Pills */}
            {authType === "DONOR" && (
              <div className="mb-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Donor Establishment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "HOTEL" as const, label: "Restaurant/Hotel/Banquets", icon: Hotel, hint: "Commercial Kitchens & Events" },
                    { id: "HOUSEHOLD" as const, label: "Household", icon: Home, hint: "Everyday Residents" },
                  ].map((item) => {
                    const isSelected = donorCategory === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleDonorCategorySelect(item.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-emerald-700 bg-emerald-50/80 text-emerald-950 shadow-xs ring-1 ring-emerald-600/30"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 ${isSelected ? "text-emerald-700" : "text-gray-400"}`} />
                        <div className="font-bold text-xs">{item.label}</div>
                        <div className="text-[10px] text-gray-500 leading-tight">{item.hint}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ════ VIEW A: SIGN IN FORM ════ */}
            {!isRegistering ? (
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Organization / Account Email
                    </label>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="banquets@oberoibangalore.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-medium text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 shadow-2xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Password
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Demo: FoodWise@2026
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-medium text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-2 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] hover:brightness-110"
                  style={{ background: "#164A31" }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {authType === "NGO"
                          ? "Enter NGO Logistics Dashboard"
                          : `Enter ${donorCategory === "HOTEL" ? "Restaurant/Hotel" : "Household"} Dashboard`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Registration toggle prompt */}
                <div className="pt-2 text-center text-xs text-gray-600">
                  {authType === "DONOR" ? (
                    <span>
                      Need a new donor profile?{" "}
                      <button
                        type="button"
                        onClick={() => setIsRegistering(true)}
                        className="font-bold text-emerald-800 hover:underline cursor-pointer"
                      >
                        Register as a donor
                      </button>
                    </span>
                  ) : (
                    <span>
                      New relief organization?{" "}
                      <button
                        type="button"
                        onClick={() => setIsRegistering(true)}
                        className="font-bold text-emerald-800 hover:underline cursor-pointer"
                      >
                        Register your NGO
                      </button>
                    </span>
                  )}
                </div>
              </form>
            ) : (
              /* ════ VIEW B: REGISTRATION FLOW ════ */
              <div>
                {authType === "DONOR" ? (
                  /* Donor Registration Form */
                  <form onSubmit={handleDonorRegister} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-gray-700 mb-1">
                          {donorCategory === "HOTEL"
                            ? "Restaurant / Hotel / Banquet Name *"
                            : "Household / Family Name *"}
                        </label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder={
                            donorCategory === "HOTEL"
                              ? "e.g. The Oberoi, Bengaluru"
                              : "e.g. Sharma Family Residence"
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          required
                          value={regContact}
                          onChange={(e) => setRegContact(e.target.value)}
                          placeholder="e.g. Rajeev Mehra / Dr. Ananya Sharma"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+91 98451 23456"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-gray-700 mb-1">Pickup Address & Location</label>
                        <input
                          type="text"
                          required
                          value={regAddress}
                          onChange={(e) => setRegAddress(e.target.value)}
                          placeholder="e.g. 4005, 100 Feet Road, Indiranagar, Bengaluru"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={regCity}
                          onChange={(e) => setRegCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                        />
                      </div>

                      {donorCategory !== "HOUSEHOLD" && (
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">FSSAI License Number (Optional)</label>
                          <input
                            type="text"
                            value={regFssai}
                            onChange={(e) => setRegFssai(e.target.value)}
                            placeholder="e.g. FSSAI LIC: 11219004000312"
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                          />
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setIsRegistering(false)}
                        className="px-4 py-2 font-semibold text-gray-600 hover:underline cursor-pointer"
                      >
                        Back to Login
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-xl font-bold text-white shadow-md hover:brightness-110 active:scale-95 cursor-pointer"
                        style={{ background: "#164A31" }}
                      >
                        {isLoading ? "Creating Account..." : "Register & Open Portal"}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* NGO Registration Form */
                  <form onSubmit={handleNgoRegister} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-gray-700 mb-1">
                          NGO / Relief Organization Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={ngoName}
                          onChange={(e) => setNgoName(e.target.value)}
                          placeholder="e.g. Bangalore Food Bank (Bengaluru Hub)"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Coordinator / Lead Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={ngoLead}
                          onChange={(e) => setNgoLead(e.target.value)}
                          placeholder="e.g. Pooja Verma"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={ngoPhone}
                          onChange={(e) => setNgoPhone(e.target.value)}
                          placeholder="+91 80 2315 4029"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-gray-700 mb-1">Distribution Center Address *</label>
                        <input
                          type="text"
                          required
                          value={ngoAddress}
                          onChange={(e) => setNgoAddress(e.target.value)}
                          placeholder="e.g. 5th Main Road, Industrial Suburb, Rajajinagar, Bengaluru"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Coverage / Service Area</label>
                        <input
                          type="text"
                          value={ngoCoverage}
                          onChange={(e) => setNgoCoverage(e.target.value)}
                          placeholder="e.g. Rajajinagar, Malleshwaram & Central Bengaluru"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">NGO DARPAN Registration / 12A / 80G No.</label>
                        <input
                          type="text"
                          value={ngoRegNo}
                          onChange={(e) => setNgoRegNo(e.target.value)}
                          placeholder="e.g. NGO-DARPAN-KA-2019-02114"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setIsRegistering(false)}
                        className="px-4 py-2 font-semibold text-gray-600 hover:underline cursor-pointer"
                      >
                        Back to Login
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-xl font-bold text-white shadow-md hover:brightness-110 active:scale-95 cursor-pointer"
                        style={{ background: "#164A31" }}
                      >
                        {isLoading ? "Registering..." : "Register & Open NGO Portal"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Role Details & Impact (5 cols) */}
        <div className="lg:col-span-5 bg-[#F5F2EB] p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-gray-200">
          <div className="space-y-4 relative z-10">
            {/* Top capability badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                {authType === "NGO"
                  ? "NGO Food Relief Network"
                  : donorCategory === "HOTEL"
                  ? "Restaurant & Hotel Surplus"
                  : "Household Food Sharing"}
              </span>
            </div>

            {/* Role Title & Tagline */}
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug">
                {authType === "NGO"
                  ? "Food Relief Organizations"
                  : donorCategory === "HOTEL"
                  ? "Commercial Kitchens & Luxury Banquets"
                  : "Everyday Households"}
              </h2>
              <p className="text-xs font-semibold text-emerald-800 mt-1">
                {authType === "NGO"
                  ? "Discover nearby available surplus food and coordinate volunteer vehicle collections."
                  : donorCategory === "HOTEL"
                  ? "Coordinate large-scale banquet spreads, buffets, and restaurant surplus with scheduled pickup."
                  : "Easily share extra home-cooked food with local community care homes."}
              </p>
            </div>

            {/* Role-specific Feature Highlights */}
            <div className="space-y-2 pt-1">
              {(authType === "NGO"
                ? [
                    "Live catalog of available surplus filtered by location and servings",
                    "Claim donations with assigned driver and volunteer vehicle",
                    "Secure 4-digit OTP handover handshake ensuring food safety",
                  ]
                : donorCategory === "HOTEL"
                ? [
                    "Commercial kitchen, buffet, and large-scale banquet surplus redistribution",
                    "Cold-chain & thermal cambro tracking with packaging guidelines",
                    "Direct handover coordination and loading dock instructions for volunteers",
                  ]
                : [
                    "Super simple 1-minute donation form for home cooking",
                    "Friendly status updates when a local NGO claims your food",
                    "Help nearby shelters and orphanages in your neighbourhood",
                  ]
              ).map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>

            {/* 3 Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[
                { val: "2,200+", label: "Meals Rescued" },
                { val: "680 kg", label: "Surplus Donated" },
                { val: "100%", label: "Landfill Free" },
              ].map((m, i) => (
                <div key={i} className="bg-white/85 border border-emerald-200/80 rounded-xl p-2.5 text-center shadow-xs">
                  <div className="text-xs sm:text-sm font-extrabold text-emerald-900">{m.val}</div>
                  <div className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>


          </div>

          {/* Sustainable Food Logistics Illustration */}
          <div className="mt-4 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 lg:-mx-10 lg:-mb-10 relative flex justify-end">
            <img
              src="/login-illustration.png"
              alt="FoodWise Sustainable Surplus Food Redistribution"
              className="w-full max-h-[200px] object-cover object-bottom opacity-95 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>


      {/* Footer Branding */}
      <div className="mt-8 text-center text-xs text-emerald-300/80 font-medium">
        FoodWise Community Platform — Making every meal count
      </div>
    </div>
  );
}
