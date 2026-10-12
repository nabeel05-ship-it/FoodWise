import React from "react";
import type { Metadata } from "next";
import PublicHeader from "@/components/common/PublicHeader";
import Footer from "@/components/common/Footer";
import { FileText, AlertTriangle, ShieldCheck, HeartHandshake, Utensils, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — FoodWise Platform",
  description:
    "Terms and conditions governing the use of the FoodWise surplus food donation and redistribution platform.",
};

export default function TermsPage() {
  const lastUpdated = "October 2026";

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#111827] flex flex-col justify-between">
      <PublicHeader currentPage="Terms of Service" />

      <main className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Document Header */}
        <div className="border-b border-emerald-900/10 pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 text-xs font-bold mb-3">
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Platform Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            FoodWise Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            Effective Date: {lastUpdated} &bull; Platform Version 2.0
          </p>
          <div className="mt-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Administrative Notice:</span> These terms articulate operational obligations for surplus food donors and relief partners. Legal operating entity names, arbitration clauses, and governing jurisdictions are indicated as configuration items (<code>[CONFIG: ...]</code>) to be completed by the platform owner upon formal legal incorporation.
            </div>
          </div>
        </div>

        {/* Terms Body */}
        <div className="space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <span>Acceptance of Terms</span>
            </h2>
            <p>
              By accessing, registering with, or utilizing the FoodWise platform (&quot;Service&quot;, &quot;FoodWise&quot;), whether as a donor establishment (commercial kitchen, hotel, banquet hall, or household) or as an authorized relief partner (NGO, shelter, or community pantry), you agree to be bound by these Terms of Service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <span>Purpose of the Service</span>
            </h2>
            <p>
              FoodWise is a technology coordination platform built to facilitate the rescue and dignified redistribution of surplus, unexpired, edible food. The platform enables donors to post available surplus and verified non-governmental organizations to discover, claim, and coordinate collection.
            </p>
            <p className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-medium">
              FoodWise operates exclusively for food waste reduction and humanitarian hunger relief. Reselling, commercial trading, or profiting from food claimed through FoodWise is strictly prohibited.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <span>Donor Responsibilities &amp; Food Quality Standards</span>
            </h2>
            <p>
              All participating food donors agree to maintain strict food hygiene and truthful declarations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Edibility &amp; Freshness:</strong> Donors may only list food that is fit for human consumption, properly prepared in compliant food environments, and within safe consumption timeframes.
              </li>
              <li>
                <strong>Accurate Descriptions:</strong> Donors must accurately declare food categories (Cooked, Raw, Packaged), preparation timestamps, allergens, and recommended temperature control (Ambient or Refrigerated).
              </li>
              <li>
                <strong>Hygiene &amp; Packaging:</strong> Food must be stored in clean, food-grade containers and held at appropriate temperatures until handoff to the collection team.
              </li>
              <li>
                <strong>Prompt Handover:</strong> Donors agree to have the declared quantities available at the designated pickup window and location.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">4</span>
              <span>Relief Partner (NGO) Responsibilities</span>
            </h2>
            <p>
              Relief organizations, charities, and community kitchens claiming food through FoodWise agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Timely Pickup:</strong> Dispatch vehicles and volunteers within the agreed collection window to preserve thermal stability and food quality.
              </li>
              <li>
                <strong>Safe Transport:</strong> Utilize suitable transport (thermal cambros, insulated crates, or refrigerated vehicles where required) to transport perishable food.
              </li>
              <li>
                <strong>Visual &amp; Sensory Inspection:</strong> Conduct a basic sensory check upon arrival before accepting custody. If food exhibits spoilage or improper temperature, relief partners must reject the batch and log a Food Issue Report in FoodWise.
              </li>
              <li>
                <strong>Beneficiary Distribution:</strong> Distribute the food promptly and free of charge to vulnerable populations and community members in need.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">5</span>
              <span>Handover Verification &amp; Chain of Custody</span>
            </h2>
            <p>
              FoodWise implements a digital 4-digit One-Time Passcode (OTP) verification handshake:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The collecting volunteer presents the active OTP upon arrival at the donor establishment.</li>
              <li>The donor confirms the OTP before handing over physical custody of the food.</li>
              <li>Completing this verification officially transitions custody in platform logs and updates the live redistribution tracker.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">6</span>
              <span>Platform Role &amp; Limitation of Liability</span>
            </h2>
            <div className="p-3.5 rounded-xl bg-gray-100 border border-gray-300 space-y-2 text-gray-800">
              <div className="flex items-center gap-2 font-bold text-gray-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Important Food Safety &amp; Intermediary Disclaimer</span>
              </div>
              <p>
                FoodWise provides digital communications, routing matching, and record-keeping software. FoodWise does not manufacture, prepare, package, inspect, transport, or deliver food items directly.
              </p>
              <p>
                Physical handling, storage conditions, and edible verification remain the direct responsibility of the respective donating establishment and receiving relief organization. To the maximum extent permitted by applicable law, FoodWise and its developers shall not be liable for damages resulting from food spoilage, transit delays, or third-party handling beyond platform software operations.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">7</span>
              <span>Account Termination &amp; Suspension</span>
            </h2>
            <p>
              FoodWise reserves the right to suspend or revoke access for any account found to have:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Listed expired, unhygienic, or unsafe food.</li>
              <li>Repeatedly failed to fulfill claimed pickups or donation commitments.</li>
              <li>Attempted to sell, monetize, or commercialize donated items.</li>
              <li>Misrepresented organizational credentials or volunteer authorization.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">8</span>
              <span>Governing Jurisdiction &amp; Legal Placeholders</span>
            </h2>
            <p>
              These terms shall be governed in accordance with applicable local laws:
            </p>
            <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2 text-xs">
              <div>
                <span className="font-semibold text-gray-800">Governing Jurisdiction:</span>{" "}
                <span className="font-mono text-emerald-800">[CONFIG: Bengaluru Urban / Karnataka, India or Designated Platform Jurisdiction]</span>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Operating Entity:</span>{" "}
                <span className="font-mono text-gray-800">[CONFIG: FoodWise Community Initiative / Legal Entity Name]</span>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Official Inquiries:</span>{" "}
                <span className="font-mono text-emerald-800">[CONFIG: legal@foodwise.example / official communication channel]</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
