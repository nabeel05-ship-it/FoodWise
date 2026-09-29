"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import LanguageToggle from "@/components/common/LanguageToggle";
import { InstitutionRole } from "@/lib/types";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BrainCircuit,
  TrendingDown,
  Layers,
  HeartHandshake,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { setCurrentRole } = useApp();
  const { t } = useLang();

  const [selectedRole, setSelectedRole] = useState<InstitutionRole>("KITCHEN_MANAGER");
  const [email, setEmail] = useState("warden.mess@iitd.ac.in");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: "KITCHEN_MANAGER" as InstitutionRole,
      label: "As Kitchen / Mess",
      badge: "IIT Delhi Warden",
      defaultEmail: "warden.mess@iitd.ac.in",
      destination: "/kitchen/dashboard",
      facility: "Institutional Mess & Commercial Kitchens",
      tagline: "Autonomous Demand Forecasting & Zero Surplus Waste",
      features: [
        "AI Meal Demand & Headcount Forecaster (±4% error margin)",
        "Automated First-In-First-Out (FIFO) Spoilage Watchdog",
        "1-Click NGO Surplus Matching & Safe Transit Dispatch",
      ],
      metrics: [
        { label: "Meals Rescued", val: "38,400+" },
        { label: "Prediction Accuracy", val: "94.2%" },
        { label: "Cost Rescued", val: "₹14.8L" },
      ],
    },
    {
      id: "FACTORY_MANAGER" as InstitutionRole,
      label: "As Factory Plant",
      badge: "Haldirams Unit 3",
      defaultEmail: "ops.head@haldirams.com",
      destination: "/factory/dashboard",
      facility: "Agro-Processing & Industrial Production Plant",
      tagline: "Adaptive Quality Monitoring & Machine Health Analytics",
      features: [
        "Produce-Specific AI Adaptive Storage (Ethylene, Temp, RH)",
        "Early Machine Anomaly Detection via Telemetry & Acoustics",
        "Industrial Byproduct Valorization & Circular Mass Balance",
      ],
      metrics: [
        { label: "Line Yield", val: "+18.5%" },
        { label: "Downtime Prevented", val: "142 hrs" },
        { label: "Spoilage Risk", val: "-62%" },
      ],
    },
    {
      id: "NGO_PARTNER" as InstitutionRole,
      label: "As Relief NGO",
      badge: "Robin Hood Army",
      defaultEmail: "relief@robinhoodarmy.com",
      destination: "/ngo/dashboard",
      facility: "Community Relief Hub & Cold-Chain Logistics",
      tagline: "Rapid Food Claiming, Traffic-Aware Routing & Verification",
      features: [
        "Real-Time Push Alerts for Verified Edible Food Donations",
        "Traffic & Heat-Aware Safe Routing with Dynamic Buffer Times",
        "Digital FSSAI Golden-Hour Temperature & Safety Audit Logs",
      ],
      metrics: [
        { label: "Avg Delivery", val: "19 mins" },
        { label: "Shelters Fed", val: "48+" },
        { label: "Food Quality", val: "100% Safe" },
      ],
    },
  ];

  const currentRoleConfig = roles.find((r) => r.id === selectedRole) || roles[0];

  const handleRoleChange = (roleId: InstitutionRole) => {
    setSelectedRole(roleId);
    const target = roles.find((r) => r.id === roleId);
    if (target) {
      setEmail(target.defaultEmail);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentRole(selectedRole);

    setTimeout(() => {
      router.push(currentRoleConfig.destination);
    }, 450);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #18422A 0%, #0F2A1C 60%, #091D13 100%)",
      }}
    >
      {/* Subtle organic decorative glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Floating Card */}
      <div className="w-full max-w-[1040px] bg-[#FBF9F4] rounded-[32px] shadow-2xl overflow-hidden border border-emerald-800/30 relative z-10 grid grid-cols-1 lg:grid-cols-12 animate-in fade-in zoom-in-95 duration-200">
        {/* LEFT COLUMN: Sign In Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#FBF9F4]">
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
                  {t("app.slogan")}
                </span>
              </div>
            </div>
            <LanguageToggle compact className="bg-emerald-50 text-emerald-800 border-emerald-300/60 hover:bg-emerald-100" />
          </div>

          {/* Form Content */}
          <div className="my-6 space-y-5">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {t("login.sign_in")}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-emerald-800 mt-1 italic tracking-wide">
                &ldquo;{t("app.slogan")}&rdquo;
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {t("login.subtitle")}
              </p>
            </div>

            {/* Role Radio Pill Selectors (Reference design style) */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap pt-1">
              {roles.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleChange(r.id)}
                    className="flex items-center gap-2 text-xs font-semibold cursor-pointer py-1 px-2 rounded-lg transition-colors hover:bg-gray-100"
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                        isSelected ? "border-emerald-700 bg-white" : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#164A31]" />}
                    </span>
                    <span className={isSelected ? "text-gray-900 font-bold" : "text-gray-600"}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>



            {/* Email & Password Form */}
            <form onSubmit={handleSignIn} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t("login.email")} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-xs sm:text-sm font-medium text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    {t("login.password")} *
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Pre-configured Demo Mode: Direct sign-in is enabled for testing all modules.")}
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
                  >
                    {t("login.forgot_password")}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-200 bg-white text-xs sm:text-sm font-medium text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all shadow-2xs"
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
                className="w-full py-3 mt-1 rounded-full font-bold text-sm text-white shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] hover:brightness-110"
                style={{
                  background: "#164A31",
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t("login.sign_in")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-1">
              <span className="text-xs text-gray-500">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => alert("Demo Access: All 3 roles (Kitchen, Factory, NGO) are pre-unlocked. Select any role above to enter.")}
                  className="font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  {t("login.sign_up")}
                </button>
              </span>
            </div>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between flex-wrap gap-2 text-[11px] text-gray-400">
            <span>{t("login.demo_credentials")}</span>
            <div className="flex items-center gap-2 font-semibold">
              <Link href="/kitchen/dashboard" className="text-emerald-700 hover:underline">Kitchen</Link>
              <span>•</span>
              <Link href="/factory/dashboard" className="text-amber-700 hover:underline">Factory</Link>
              <span>•</span>
              <Link href="/ngo/dashboard" className="text-blue-700 hover:underline">NGO</Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Intelligence & Capabilities (5 cols) */}
        <div className="lg:col-span-5 bg-[#F5F2EB] p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-gray-200">
          <div className="space-y-4 relative z-10">
            {/* Top capability badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                AI Circular Infrastructure
              </span>
            </div>

            {/* Role Facility Title & Tagline */}
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug">
                {currentRoleConfig.facility}
              </h2>
              <p className="text-xs font-semibold text-emerald-800 mt-1">
                {currentRoleConfig.tagline}
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-2 pt-1">
              {currentRoleConfig.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {currentRoleConfig.metrics.map((m, i) => (
                <div key={i} className="bg-white/85 border border-emerald-200/80 rounded-xl p-2.5 text-center shadow-xs">
                  <div className="text-xs sm:text-sm font-extrabold text-emerald-900">{m.val}</div>
                  <div className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Illustration */}
          <div className="mt-4 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 lg:-mx-10 lg:-mb-10 relative flex justify-end">
            <img
              src="/login-illustration.png"
              alt="FoodWise Sustainable Kitchen & Food Logistics"
              className="w-full max-h-[250px] object-cover object-bottom opacity-95 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-6 text-center text-xs text-emerald-300/70 font-medium">
        FoodWise • Food Waste Prevention & Redistribution • <span className="italic font-semibold text-emerald-200">&ldquo;Making every meal count&rdquo;</span>
      </div>
    </div>
  );
}
