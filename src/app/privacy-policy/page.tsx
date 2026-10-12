import React from "react";
import type { Metadata } from "next";
import PublicHeader from "@/components/common/PublicHeader";
import Footer from "@/components/common/Footer";
import { ShieldCheck, Lock, Database, Sparkles, UserCheck, Bell, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — FoodWise Platform",
  description:
    "Learn how FoodWise collects, manages, and protects donor and relief organization information during surplus food redistribution.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 2026";

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#111827] flex flex-col justify-between">
      <PublicHeader currentPage="Privacy Policy" />

      <main className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Document Header */}
        <div className="border-b border-emerald-900/10 pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Operational Data Protection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            FoodWise Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            Effective Date: {lastUpdated} &bull; Platform Version 2.0
          </p>
          <div className="mt-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Administrative Notice:</span> This policy accurately documents the technical data handling, storage mechanisms, and external integrations implemented in the FoodWise codebase. Specific legal entity identification and designated contact inboxes are marked as configuration items (<code>[CONFIG: ...]</code>) to be finalized by the platform operator.
            </div>
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <span>Overview &amp; Scope</span>
            </h2>
            <p>
              FoodWise is a digital platform designed to bridge surplus edible food from commercial kitchens, hotels, banquet halls, and households with verified non-governmental organizations (NGOs) and community relief partners.
            </p>
            <p>
              This Privacy Policy explains what personal and organizational details are collected, how they are utilized to coordinate food rescue operations, how data is stored, and your rights concerning your information.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <span>Information Collected by FoodWise</span>
            </h2>
            <p>
              FoodWise collects only the information necessary to authenticate users, list surplus food donations, match relief partners, and coordinate physical handovers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Donor Account Data:</strong> Establishment name (restaurant, hotel, banquet, or household residence), designated contact person name, telephone number, pickup address, email address, and authentication credentials.
              </li>
              <li>
                <strong>Relief NGO Partner Data:</strong> Organization name, registration identification (e.g. 12A/80G or local operational ID), authorized representative name, contact telephone, service radius, and distribution facility address.
              </li>
              <li>
                <strong>Food Donation Listings:</strong> Food category (Cooked, Raw Ingredients, Packaged/Bakery), estimated quantity or servings, preparation time, safe consumption window, storage requirements (Ambient or Refrigerated), and dispatch notes.
              </li>
              <li>
                <strong>Handover &amp; Dispatch Coordination Data:</strong> Claim status timestamps, driver/volunteer assignments, vehicle identifiers (where submitted), and one-time 4-digit verification passcodes (OTPs) used to validate physical handovers.
              </li>
              <li>
                <strong>Quality &amp; Discrepancy Reports:</strong> Feedback ratings, notes on packaging integrity, temperature observations, and photographic evidence submitted through the Food Issue Reporting module.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <span>How We Use Operational Data</span>
            </h2>
            <p>
              Information collected through FoodWise is used exclusively for platform operations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Facilitating surplus food donation listings and matching nearby relief NGOs based on proximity and vehicle capacity.</li>
              <li>Transmitting pickup instructions, contact details, and route timing to assigned recovery personnel.</li>
              <li>Verifying chain-of-custody at handover through single-use OTP validation.</li>
              <li>Maintaining an auditable history of redistributed meals and food-waste diversion metrics.</li>
              <li>Dispatching operational alerts regarding pending expirations, accepted claims, and driver arrivals.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">4</span>
              <span>Data Persistence &amp; Storage Mechanisms</span>
            </h2>
            <p>
              FoodWise employs standard multi-tier data storage:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Server-Side Database (MongoDB):</strong> When connected via environment configuration (<code>MONGODB_URI</code>), donation records, user profiles, claims, and notification states are persisted securely in a MongoDB database cluster.
              </li>
              <li>
                <strong>Browser Local Storage:</strong> For demonstration workflows and offline resilience, client browsers store active role identifiers (<code>foodwise_user_role</code>), active profile keys, read notification states, and local demonstration logs. No tracking cookies or advertising identifiers are placed in local storage.
              </li>
              <li>
                <strong>Web Push Notifications:</strong> If you explicitly grant browser push permissions, push subscriptions are saved solely to deliver time-critical food claim notifications.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">5</span>
              <span>Third-Party Services &amp; AI Integrations</span>
            </h2>
            <p>
              FoodWise does not sell, lease, or monetize user data. External services are integrated strictly for core technical capabilities:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Foodie AI (Groq SDK):</strong> FoodWise includes an interactive guidance assistant powered by Groq. When users submit inquiries to Foodie AI, message prompts and current user role context are transmitted securely to Groq APIs to generate context-sensitive guidance. Prompts are not used to train proprietary third-party commercial advertising models.
              </li>
              <li>
                <strong>Hosting &amp; Edge Infrastructure:</strong> Application front-end and serverless API endpoints are deployed on Vercel.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">6</span>
              <span>Information Sharing Between Donors &amp; NGOs</span>
            </h2>
            <p>
              To complete physical food handovers, specific operational data is shared directly between the matched donor and recipient organization:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>When an NGO claims a donation, the donor receives the claiming organization&apos;s name and assigned volunteer details.</li>
              <li>The claiming NGO receives the donor&apos;s pickup address, contact person phone number, and special gate/kitchen instructions.</li>
              <li>Public visitors cannot view donor telephone numbers, exact street addresses, or individual contact details.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">7</span>
              <span>Data Retention &amp; User Rights</span>
            </h2>
            <p>
              Donors and relief organizations may inspect, correct, or request deletion of their profile records at any time:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Profile Updates:</strong> Organizations can adjust their addresses, contact details, and category configurations directly within platform settings.
              </li>
              <li>
                <strong>Account &amp; Data Deletion:</strong> You may request the deletion of your account and un-linked operational logs by contacting the platform operator at the designated support channel.
              </li>
              <li>
                <strong>Browser Storage Clearing:</strong> Users can clear local browser data at any time via browser settings or the platform reset option.
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">8</span>
              <span>Operator Contact &amp; Governance Details</span>
            </h2>
            <p>
              For privacy inquiries, data deletion requests, or technical governance questions regarding FoodWise, please reach out via:
            </p>
            <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2">
              <div className="font-semibold text-gray-900">
                FoodWise Platform Administration
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium text-gray-700">Designated Privacy Inbox:</span>{" "}
                <span className="font-mono text-emerald-800">[CONFIG: privacy@foodwise.example / platform owner support email]</span>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium text-gray-700">Project Repository &amp; Issue Tracking:</span>{" "}
                <a
                  href="https://github.com/nabeel05-ship-it/FoodWise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline font-medium"
                >
                  github.com/nabeel05-ship-it/FoodWise
                </a>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium text-gray-700">Legal Operating Entity:</span>{" "}
                <span className="font-mono text-gray-800">[CONFIG: FoodWise Community Project / Registered Operator Entity]</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
