import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import PublicHeader from "@/components/common/PublicHeader";
import Footer from "@/components/common/Footer";
import { Sparkles, Utensils, HeartHandshake, Truck, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About FoodWise — Food Waste Reduction & Redistribution",
  description:
    "Discover how FoodWise bridges surplus food from commercial kitchens, hotels, and households with verified relief NGOs.",
};

export default function AboutPage() {
  const steps = [
    {
      num: "01",
      title: "Surplus Logging & Smart Expiry",
      desc: "Donors list excess prepared meals, raw ingredients, or bakery items with exact portions, prep timestamps, and safe consumption windows.",
      icon: Utensils,
    },
    {
      num: "02",
      title: "Instant Relief Partner Matching",
      desc: "Nearby verified NGOs and community shelters are automatically alerted based on geographic proximity, vehicle capacity, and beneficiary demand.",
      icon: HeartHandshake,
    },
    {
      num: "03",
      title: "Coordinated Pickup & Handover",
      desc: "Relief teams coordinate pickup windows, dispatch volunteers, and confirm handover with a secure code while keeping cold-chain and thermal storage requirements intact.",
      icon: Truck,
    },
    {
      num: "04",
      title: "Secure 4-Digit OTP Handover",
      desc: "A verified digital OTP handshake between the kitchen manager and collecting volunteer guarantees authorized chain-of-custody transfer.",
      icon: ShieldCheck,
    },
    {
      num: "05",
      title: "Dignified Community Distribution",
      desc: "Edible food reaches community care homes, shelters, and families in need before quality degrades, diverting good food from landfills.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#111827] flex flex-col justify-between">
      <PublicHeader currentPage="About FoodWise" />

      <main className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Document Header */}
        <div className="border-b border-emerald-900/10 pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Mission &amp; Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            About FoodWise
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
            Every day, tons of safe, edible food from commercial kitchens, luxury hotels, banquets, and households are discarded simply due to timing and logistics gaps. FoodWise is engineered to close that gap.
          </p>
        </div>

        {/* Mission Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F2A1C] to-[#072417] text-white shadow-lg mb-10 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="FoodWise Watermark" className="w-64 h-64 object-contain" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-700/50 inline-block mb-3">
            Our Core Mission
          </span>
          <h2 className="text-lg sm:text-xl font-bold leading-snug max-w-xl">
            Connecting surplus food with people who need it, transparently and safely.
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-2.5 max-w-2xl leading-relaxed">
            FoodWise provides an open, modern coordination platform that empowers restaurants, catering banquets, and everyday households to declare unserved surplus food in seconds—allowing verified relief NGOs to claim, collect, and redistribute meals before they spoil.
          </p>
        </div>

        {/* 5-Stage Redistribution Journey */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-950">
                The 5-Stage Food Rescue Journey
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                How surplus edible food travels safely from donor kitchens to community beneficiaries.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-4 rounded-xl bg-white border border-emerald-900/10 shadow-2xs flex items-start gap-3.5 hover:border-emerald-700/30 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-900 flex items-center justify-center shrink-0 font-extrabold text-xs">
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sustainable Goals Alignment */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-900/10 shadow-xs mb-10">
          <h2 className="text-sm font-bold text-gray-900 mb-2">
            Aligned with Global Sustainability Initiatives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-emerald-950">
              <div className="font-bold mb-0.5 text-emerald-900">
                UN SDG 2: Zero Hunger
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Helping channel nutritious, unserved food directly to community kitchens, care shelters, and vulnerable neighbors.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-emerald-950">
              <div className="font-bold mb-0.5 text-emerald-900">
                UN SDG 12: Responsible Consumption
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Diverting avoidable organic waste away from municipal landfills, curbing greenhouse methane emissions.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-emerald-950">
              Ready to Join the Redistribution Network?
            </h3>
            <p className="text-xs text-emerald-800/80 mt-0.5">
              Sign in as a donor kitchen or register your relief organization today.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F2A1C] hover:bg-[#143826] text-white text-xs font-bold transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
