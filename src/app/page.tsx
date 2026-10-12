"use client";

import React, { useState } from "react";
import { flushSync } from "react-dom";
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
  HeartHandshake,
  Utensils,
  Hotel,
  Home,
  Truck,
  ShieldCheck,
  Building2,
  User,
  Phone,
  MapPin,
  Check,
  Copy,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { MOTION_SPRINGS, MOTION_DURATIONS, tabSpringTransition, buttonPressProps } from "@/lib/motion";
import SmoothScrollWrapper from "@/components/common/SmoothScrollWrapper";
import FoodRedistributionWorkflow from "@/components/common/FoodRedistributionWorkflow";

type AuthType = "DONOR" | "NGO";
type DonorCategory = "HOTEL" | "HOUSEHOLD";

export default function LoginPage() {
  const router = useRouter();
  const { login, registerDonor, registerNgo } = useApp();
  const { t: _t } = useLang();
  const prefersReduced = useReducedMotion();

  // Redistribution workflow visibility state
  const [isWorkflowRevealed, setIsWorkflowRevealed] = useState(false);

  // Reveal workflow if hidden, then scroll smoothly to it
  const handleScrollToWorkflow = () => {
    if (!isWorkflowRevealed) {
      flushSync(() => {
        setIsWorkflowRevealed(true);
      });
    }
    const target = document.getElementById("how-it-works");
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });
  };

  // Auth flow states
  const [authType, setAuthType] = useState<AuthType>("DONOR");
  const [isRegistering, setIsRegistering] = useState(false);
  const [donorCategory, setDonorCategory] = useState<DonorCategory>("HOTEL");

  // Sign In inputs
  const [email, setEmail] = useState("banquets@oberoibangalore.com");
  const [password, setPassword] = useState("FoodWise@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <SmoothScrollWrapper>
      <div
        className="min-h-screen flex flex-col items-center justify-between px-3 sm:px-6 pt-3 sm:pt-4 lg:pt-5 xl:pt-6 pb-3 sm:pb-4 lg:pb-5 relative overflow-x-hidden"
        style={{
          background: "radial-gradient(ellipse at center, #18422A 0%, #0F2A1C 60%, #091D13 100%)",
        }}
      >
      {/* Decorative organic glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Viewport Presentation (Login Card + Discovery Button) */}
      <div className="w-full max-w-[1040px] flex-1 flex flex-col items-center justify-start lg:justify-center lg:my-auto z-10">
        {/* Main Centered Authentication Card */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, scale: 0.98, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={MOTION_SPRINGS.natural}
          className="w-full max-w-[1040px] bg-[#FBF9F4] rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-emerald-800/30 relative z-10 grid grid-cols-1 lg:grid-cols-12"
        >
          {/* LEFT COLUMN: Clean Authentication (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-5 lg:px-7 lg:py-5 hero-card-left flex flex-col justify-between bg-[#FBF9F4]">
          <div>
            {/* Top Logo & Brand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="FoodWise Logo"
                  className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 object-contain shrink-0"
                />
                <div>
                  <span className="font-extrabold text-lg sm:text-xl text-[#143826] tracking-tight block leading-tight">
                    FoodWise
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-800 tracking-wide block">
                    Food Waste Reduction & Redistribution Platform
                  </span>
                </div>
              </div>
            </div>

            {/* Header Message */}
            <div className="my-2 sm:my-2.5 lg:my-3 xl:my-3.5">
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: MOTION_DURATIONS.fast }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] sm:text-[11px] font-bold mb-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Zero Waste Initiative
              </motion.div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight leading-tight">
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
              <p className="text-xs sm:text-[13px] text-gray-600 mt-0.5 leading-relaxed">
                {isRegistering
                  ? "Join our verified Bengaluru food rescue network and prevent edible food waste."
                  : "Connecting commercial kitchens, luxury hotels, and households with verified relief NGOs."}
              </p>
            </div>

            {/* PRIMARY AUTH TABS: DONOR LOGIN vs NGO / RELIEF LOGIN */}
            <div className="p-1 rounded-2xl bg-gray-200/80 border border-gray-300/70 grid grid-cols-2 gap-1 mb-2.5 sm:mb-3 lg:mb-3.5 relative">
              <button
                type="button"
                onClick={() => handleAuthTypeChange("DONOR")}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative z-10 ${
                  authType === "DONOR"
                    ? "text-emerald-950"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {authType === "DONOR" && (
                  <motion.div
                    layoutId="authTypeActiveCapsule"
                    transition={tabSpringTransition}
                    className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                  />
                )}
                <Utensils className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isRegistering ? "Donor Portal" : "Donor Login"}</span>
              </button>
              <button
                type="button"
                onClick={() => handleAuthTypeChange("NGO")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative z-10 ${
                  authType === "NGO"
                    ? "text-emerald-950"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {authType === "NGO" && (
                  <motion.div
                    layoutId="authTypeActiveCapsule"
                    transition={tabSpringTransition}
                    className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                  />
                )}
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isRegistering ? "NGO / Relief Portal" : "Relief NGO Partner Login"}</span>
              </button>
            </div>

            {/* IF DONOR: Choose Donor Type Pills */}
            <AnimatePresence mode="wait">
              {authType === "DONOR" && (
                <motion.div
                  key="donor-category-picker"
                  initial={prefersReduced ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: MOTION_DURATIONS.fast }}
                  className="mb-2.5 sm:mb-3 lg:mb-3.5"
                >
                  <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
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
                          className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer active:scale-98 ${
                            isSelected
                              ? "border-emerald-700 bg-emerald-50/80 text-emerald-950 shadow-xs ring-1 ring-emerald-600/30"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 mb-1 ${isSelected ? "text-emerald-700" : "text-gray-400"}`} />
                          <div className="font-bold text-xs leading-tight">{item.label}</div>
                          <div className="text-[10px] text-gray-500 leading-tight mt-0.5">{item.hint}</div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ════ VIEW A vs VIEW B ANIMATED TOGGLE ════ */}
            <AnimatePresence mode="wait">
              {!isRegistering ? (
                /* VIEW A: SIGN IN FORM */
                <motion.form
                  key="sign-in-form"
                  initial={prefersReduced ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: MOTION_DURATIONS.fast }}
                  onSubmit={handleSignIn}
                  className="space-y-2.5 sm:space-y-3 lg:space-y-3.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-xs font-semibold text-gray-700">
                        Organization / Account Email
                      </label>
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="banquets@oberoibangalore.com"
                        className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-medium text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 shadow-2xs font-mono transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-xs font-semibold text-gray-700">
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2 sm:py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-medium text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 shadow-2xs transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={prefersReduced ? undefined : { scale: 1.015 }}
                    whileTap={prefersReduced ? undefined : { scale: 0.985 }}
                    className="w-full py-2.5 sm:py-2.5 mt-1 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-110"
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
                  </motion.button>

                  {/* Registration toggle prompt */}
                  <div className="pt-1.5 text-center text-xs text-gray-600">
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
                </motion.form>
              ) : (
                /* VIEW B: REGISTRATION FLOW */
                <motion.div
                  key="registration-form"
                  initial={prefersReduced ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: MOTION_DURATIONS.fast }}
                >
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
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 transition-colors"
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
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 transition-colors"
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
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 transition-colors"
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
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            value={regCity}
                            onChange={(e) => setRegCity(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 transition-colors"
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
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 transition-colors"
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
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 transition-colors"
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
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 transition-colors"
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
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 transition-colors"
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
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Coverage / Service Area</label>
                          <input
                            type="text"
                            value={ngoCoverage}
                            onChange={(e) => setNgoCoverage(e.target.value)}
                            placeholder="e.g. Rajajinagar, Malleshwaram & Central Bengaluru"
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">NGO DARPAN Registration / 12A / 80G No.</label>
                          <input
                            type="text"
                            value={ngoRegNo}
                            onChange={(e) => setNgoRegNo(e.target.value)}
                            placeholder="e.g. NGO-DARPAN-KA-2019-02114"
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none focus:border-emerald-600 transition-colors"
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: Role Details & Impact (5 cols) */}
        <div className="lg:col-span-5 bg-[#F5F2EB] p-4 sm:p-5 lg:px-6 lg:py-5 hero-card-right flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-gray-200">
          <div className="space-y-2 sm:space-y-2.5 lg:space-y-3 relative z-10">
            {/* Top capability badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 text-[10px] sm:text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                {authType === "NGO"
                  ? "NGO Food Relief Network"
                  : donorCategory === "HOTEL"
                  ? "Restaurant & Hotel Surplus"
                  : "Household Food Sharing"}
              </span>
            </div>

            {/* Mission Statement */}
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug">
                Good Food Deserves Another Chance
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5 leading-relaxed">
                Connect surplus food with organizations that can put it to good use, helping reduce avoidable waste and support communities in need.
              </p>
            </div>

            {/* 3 Compact Feature Benefit Cards */}
            <div className="space-y-1.5 sm:space-y-2 lg:space-y-2 xl:space-y-2.5 pt-0.5">
              <motion.div
                whileHover={prefersReduced ? undefined : { y: -2 }}
                className="bg-white/90 border border-emerald-900/10 rounded-xl p-2 sm:p-2.5 lg:p-2.5 xl:p-3 shadow-2xs transition-shadow"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
                    <Utensils className="w-3 h-3 text-emerald-800" />
                  </div>
                  <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-900 tracking-tight">EASY FOOD DONATION</h3>
                </div>
                <p className="text-[10px] sm:text-[10.5px] text-gray-600 leading-snug pl-7">
                  List available surplus food with essential quantity, timing, and collection information.
                </p>
              </motion.div>

              <motion.div
                whileHover={prefersReduced ? undefined : { y: -2 }}
                className="bg-white/90 border border-emerald-900/10 rounded-xl p-2 sm:p-2.5 lg:p-2.5 xl:p-3 shadow-2xs transition-shadow"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-3 h-3 text-emerald-800" />
                  </div>
                  <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-900 tracking-tight">NGO REDISTRIBUTION</h3>
                </div>
                <p className="text-[10px] sm:text-[10.5px] text-gray-600 leading-snug pl-7">
                  Help relief partners discover available donations and coordinate collection and delivery.
                </p>
              </motion.div>

              <motion.div
                whileHover={prefersReduced ? undefined : { y: -2 }}
                className="bg-white/90 border border-emerald-900/10 rounded-xl p-2 sm:p-2.5 lg:p-2.5 xl:p-3 shadow-2xs transition-shadow"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
                    <Truck className="w-3 h-3 text-emerald-800" />
                  </div>
                  <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-900 tracking-tight">TRANSPARENT TRACKING</h3>
                </div>
                <p className="text-[10px] sm:text-[10.5px] text-gray-600 leading-snug pl-7">
                  Follow donation statuses and maintain a clear history of redistribution activities.
                </p>
              </motion.div>
            </div>

            {/* Redistribution Journey Flow with interactive workflow discovery link */}
            <div
              onClick={handleScrollToWorkflow}
              className="bg-white/85 hover:bg-white border border-emerald-900/10 hover:border-emerald-600/40 rounded-xl p-2 sm:p-2.5 lg:p-2.5 xl:p-3 cursor-pointer transition-all shadow-2xs hover:shadow-xs group"
              title="Click to view the full interactive 5-stage redistribution workflow"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Redistribution Journey
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-emerald-700 group-hover:text-emerald-900 flex items-center gap-1 transition-colors">
                  <span>Interactive Workflow</span>
                  <ChevronDown className="w-3 h-3 text-emerald-600 group-hover:translate-y-0.5 transition-transform" />
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center">
                <div className="flex flex-col items-center">
                  <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold flex items-center justify-center mb-0.5">
                    1
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-gray-700 leading-tight">List Surplus</span>
                </div>
                <div className="flex flex-col items-center relative">
                  <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold flex items-center justify-center mb-0.5">
                    2
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-gray-700 leading-tight">Connect NGO</span>
                </div>
                <div className="flex flex-col items-center relative">
                  <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold flex items-center justify-center mb-0.5">
                    3
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-gray-700 leading-tight">Coordinate Pickup</span>
                </div>
                <div className="flex flex-col items-center relative">
                  <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold flex items-center justify-center mb-0.5">
                    4
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-gray-700 leading-tight">Confirm Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sustainable Food Logistics Illustration */}
          <div className="mt-2 sm:mt-2.5 lg:mt-3 -mx-4 -mb-4 sm:-mx-5 -mb-5 sm:-mx-6 sm:-mb-6 lg:-mx-6 lg:-mb-5 hero-card-right relative flex justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/login-illustration.png"
              alt="FoodWise Sustainable Surplus Food Redistribution"
              className="w-full max-h-[75px] sm:max-h-[82px] lg:max-h-[85px] hero-illustration object-cover object-bottom opacity-95 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </motion.div>

      {/* Scroll Discovery Cue */}
      <div className="w-full max-w-[1040px] flex justify-center mt-2.5 sm:mt-3 lg:mt-3.5 hero-cue-spacing z-20">
        <motion.button
          type="button"
          onClick={handleScrollToWorkflow}
          initial={prefersReduced ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={prefersReduced ? undefined : { y: 2, scale: 1.02 }}
          whileTap={prefersReduced ? undefined : { scale: 0.98 }}
          className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0A261A]/95 hover:bg-[#0E3524] text-emerald-200 hover:text-white border border-emerald-500/35 shadow-lg shadow-black/30 text-xs font-bold tracking-wide transition-all cursor-pointer backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 group"
          aria-label="Discover how FoodWise rescues surplus food"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Discover How FoodWise Works</span>
          </span>
          <motion.span
            animate={prefersReduced ? undefined : { y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500/30"
          >
            <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
          </motion.span>
        </motion.button>
      </div>
      </div>

      {/* Interactive Food Redistribution Showcase */}
      {isWorkflowRevealed && (
        <motion.div
          id="how-it-works"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...MOTION_SPRINGS.gentle, delay: 0.1 }}
          className="w-full max-w-[1040px] mt-6 sm:mt-8 z-10 scroll-mt-6 sm:scroll-mt-8"
        >
          <FoodRedistributionWorkflow />
        </motion.div>
      )}

      {/* Footer Branding */}
      <div className="mt-4 sm:mt-6 lg:mt-auto pt-2 sm:pt-3 text-center text-xs text-emerald-300/80 font-medium z-10">
        FoodWise Community Platform — Making every meal count
      </div>
    </div>
    </SmoothScrollWrapper>
  );
}
