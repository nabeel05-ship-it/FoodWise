import React from "react";
import type { Metadata } from "next";
import PublicHeader from "@/components/common/PublicHeader";
import Footer from "@/components/common/Footer";
import { HelpCircle, Mail, MessageSquare, Globe, AlertTriangle, ShieldCheck, Sparkles, Phone, MapPin, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Support — FoodWise Platform",
  description:
    "Get support, file technical questions, or connect with the FoodWise food redistribution network administration.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#111827] flex flex-col justify-between">
      <PublicHeader currentPage="Contact & Support" />

      <main className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Document Header */}
        <div className="border-b border-emerald-900/10 pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Support &amp; Community Channels</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Contact &amp; Support
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            Need help with surplus donation listings, NGO partner onboarding, or platform technical questions? Here is how to connect with the FoodWise team.
          </p>
        </div>

        {/* Support Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Card 1: Official Repository & Bug Reporting */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-900/10 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-gray-900">
                Open Source &amp; Issue Tracking
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Report technical issues, inspect changelogs, or submit feature requests through our official GitHub repository.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <a
                href="https://github.com/nabeel05-ship-it/FoodWise/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:underline"
              >
                <span>Open GitHub Issues &rarr;</span>
              </a>
            </div>
          </div>

          {/* Card 2: In-App Foodie AI Assistant */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-900/10 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-gray-900">
                Foodie AI Assistant
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Have questions about donation packaging, food safety protocols, or claiming procedures? Use the built-in Foodie AI assistant available in the bottom-right corner of the platform.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Available 24/7 on all dashboards</span>
              </span>
            </div>
          </div>
        </div>

        {/* Section: Operational Helpline & Owner Configuration Placeholders */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-xs space-y-5 mb-8">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-gray-900">
              Platform Administration Details
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            For production deployments, the platform owner should replace the designated configuration placeholders below with real monitored communication channels:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2 font-bold text-gray-800 mb-1">
                <Mail className="w-4 h-4 text-emerald-700" />
                <span>Direct Support Email</span>
              </div>
              <div className="font-mono text-emerald-900 bg-white p-2 rounded border border-gray-200 mt-1.5 text-[11px] break-all">
                [CONFIG: support@foodwise.example]
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2 font-bold text-gray-800 mb-1">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>Operational Hotline / Desk</span>
              </div>
              <div className="font-mono text-emerald-900 bg-white p-2 rounded border border-gray-200 mt-1.5 text-[11px]">
                [CONFIG: +91 80 XXXX XXXX (Helpline)]
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 sm:col-span-2">
              <div className="flex items-center gap-2 font-bold text-gray-800 mb-1">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Operating City &amp; Regional Focus</span>
              </div>
              <div className="text-gray-700 mt-1">
                Primary active deployment focus: <strong>Bengaluru Urban, Karnataka, India</strong>. Connecting commercial kitchens, banquets, hotels, and local relief partners.
              </div>
            </div>
          </div>
        </div>

        {/* Section: Urgent Food Safety Escalations */}
        <div className="rounded-2xl p-5 bg-amber-50/70 border border-amber-200 text-amber-950 text-xs sm:text-sm leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Reporting Immediate Food Quality or Pickup Issues</span>
          </div>
          <p>
            If you are an active relief NGO and notice compromised food temperatures, packaging leaks, or spoilage during pickup:
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-xs text-amber-900">
            <li>Do not load or distribute the compromised batch.</li>
            <li>Open the active donation in your Relief NGO Portal and click <strong>&quot;Report Food Issue&quot;</strong>.</li>
            <li>Attach a photo and select the discrepancy category to instantly log the event in the system audit trail.</li>
          </ol>
        </div>
      </main>

      <Footer />
    </div>
  );
}
