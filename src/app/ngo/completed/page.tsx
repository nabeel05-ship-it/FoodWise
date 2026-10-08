"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { DonationItem, FoodQualityReport } from "@/lib/types";
import DonationCard from "@/components/common/DonationCard";
import DonationDetailsModal from "@/components/common/DonationDetailsModal";
import {
  CheckCircle2,
  PackageCheck,
  Search,
  Users,
  Sparkles,
  Calendar,
  Building2,
  Download,
  AlertTriangle,
  ShieldAlert,
  Eye,
  X,
  FileText,
  Clock,
} from "lucide-react";
import { downloadDonationImpactReportPdf } from "@/lib/pdfGenerator";

export default function NgoCompletedPage() {
  const { donations, activeNgo, qualityReports } = useApp();
  const { t } = useLang();
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [viewingReport, setViewingReport] = useState<FoodQualityReport | null>(null);
  const [activeTab, setActiveTab] = useState<"deliveries" | "reports">("deliveries");
  const [searchTerm, setSearchTerm] = useState("");

  const completedItems = donations.filter((d) => d.status === "COMPLETED");

  const filteredItems = completedItems.filter(
    (item) =>
      !searchTerm.trim() ||
      item.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReports = qualityReports.filter(
    (rep) =>
      !searchTerm.trim() ||
      rep.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.issueType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalKg = completedItems.reduce((acc, curr) => acc + (curr.quantityKg || 0), 0);
  const totalServings = completedItems.reduce((acc, curr) => acc + (curr.servings || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t("Relief Distribution Logbook")}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">{activeNgo?.name || "Robin Hood Army"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950">
            {t("Completed Food Deliveries")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Historical audit log of verified food rescues and partner food quality reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              downloadDonationImpactReportPdf({
                period: "October 2026",
                organizationName: activeNgo?.name || "Robin Hood Army (Delhi Chapter)",
                role: "Relief NGO Partner",
                totalKg,
                totalServings,
                completedCount: completedItems.length,
                donationsList: completedItems.map((d) => ({
                  date: "07 Oct 2026",
                  donorName: d.donorName,
                  foodName: d.foodName,
                  category: d.foodCategory,
                  quantityKg: d.quantityKg,
                  servings: d.servings || Math.round(d.quantityKg * 3),
                  status: "Delivered",
                })),
              });
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-emerald-950 font-bold text-xs bg-white border border-emerald-200 transition-all shadow-2xs hover:bg-emerald-50 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>{t("common.export_report")}</span>
          </button>

          <Link
            href="/ngo/find"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer hover:brightness-110"
            style={{ background: "#164A31" }}
          >
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>{t("Find Available Food")}</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards (Including Reported Quality Concerns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("Completed Rescues")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1 font-mono">
            {completedItems.length}
          </div>
          <span className="text-[11px] text-gray-500 font-medium mt-1 block">
            {t("Verified food shipments")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("Surplus Diverted")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1 font-mono">
            {totalKg} <span className="text-xs font-semibold text-gray-500">kg</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {t("Safely fed to community")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            {t("Beneficiaries Reached")}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1 font-mono">
            {totalServings}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {t("Meals served at shelters")}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200 bg-amber-50/30 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block flex items-center justify-between">
            <span>Reported Quality Concerns</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-1 font-mono">
            {qualityReports.length}
          </div>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">
            Flagged for review
          </span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("deliveries")}
          className={`pb-3 px-1 text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "deliveries"
              ? "border-emerald-700 text-emerald-900"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Verified Deliveries ({completedItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`pb-3 px-1 text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "reports"
              ? "border-amber-600 text-amber-900"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Food Quality Reports ({qualityReports.length})</span>
          {qualityReports.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E8ECF3] p-3.5 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === "deliveries"
                ? "Search completed deliveries by food item, donor, or location..."
                : "Search food quality reports by donor, food item, or issue category..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-gray-900 text-xs focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Tab 1: Completed Deliveries */}
      {activeTab === "deliveries" && (
        <>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => (
                <DonationCard
                  key={item.id}
                  donation={item}
                  userRole="NGO"
                  onViewDetails={setSelectedDonation}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-base font-bold text-gray-950">
                {t("No completed food deliveries recorded yet.")}
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                {t("Once you accept donations and complete OTP handovers with donors, your delivery receipts will be logged here.")}
              </p>
            </div>
          )}
        </>
      )}

      {/* Tab 2: Food Quality Reports History Table */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          {filteredReports.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-950">Food Quality Reports</h3>
                  <p className="text-xs text-gray-500">
                    Audit log of observed food condition concerns reported by relief partner teams.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-gray-500">
                  Total: {qualityReports.length} {qualityReports.length === 1 ? "report" : "reports"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Donor</th>
                      <th className="py-3 px-4">Food Item</th>
                      <th className="py-3 px-4">Observed Issue</th>
                      <th className="py-3 px-4">Date Reported</th>
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-800">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-gray-950">{report.donorName}</div>
                          <span className="text-[10px] text-gray-500 font-medium">{report.donorType}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900">{report.foodName}</div>
                          <span className="text-[11px] text-gray-500 font-mono">{report.quantity}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-gray-900 block">{report.issueType}</span>
                          {report.description && (
                            <span className="text-[11px] text-gray-500 line-clamp-1 italic">
                              &ldquo;{report.description}&rdquo;
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-600">
                          {report.dateStr}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                              report.severity === "HIGH"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : report.severity === "MEDIUM"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {report.severity}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                              report.status === "REPORTED"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : report.status === "UNDER REVIEW"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setViewingReport(report)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-base font-bold text-gray-950">
                No food quality reports found.
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                When relief partners observe food with unusual smell, packaging damage, or quality concerns, submitted reports will appear here for audit tracking.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Details Modal for Donation */}
      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          isOpen={!!selectedDonation}
          userRole="NGO"
          onClose={() => setSelectedDonation(null)}
        />
      )}

      {/* Report Details Viewer Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden p-6 sm:p-7 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-950 tracking-tight">
                    Food Quality Report Details
                  </h3>
                  <p className="text-xs font-mono text-gray-500">
                    Ref: {viewingReport.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingReport(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Content */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
                <span className="text-gray-500 font-medium">Donor</span>
                <span className="font-bold text-gray-900">{viewingReport.donorName} ({viewingReport.donorType})</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
                <span className="text-gray-500 font-medium">Food Item</span>
                <span className="font-bold text-gray-900">{viewingReport.foodName} ({viewingReport.quantity})</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
                <span className="text-gray-500 font-medium">Observed Issue</span>
                <span className="font-extrabold text-amber-950">{viewingReport.issueType}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
                <span className="text-gray-500 font-medium">Severity</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    viewingReport.severity === "HIGH"
                      ? "bg-rose-100 text-rose-800"
                      : viewingReport.severity === "MEDIUM"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {viewingReport.severity}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
                <span className="text-gray-500 font-medium">Date Reported</span>
                <span className="font-mono font-bold text-gray-900">{viewingReport.dateStr}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Report Status</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {viewingReport.status}
                </span>
              </div>
            </div>

            {/* Description & Notes */}
            {viewingReport.description && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Partner Observation Note
                </span>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 leading-relaxed italic">
                  &ldquo;{viewingReport.description}&rdquo;
                </div>
              </div>
            )}

            {/* Photo Evidence if attached */}
            {viewingReport.photoUrl && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Attached Evidence
                </span>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={viewingReport.photoUrl}
                    alt="Photo evidence"
                    className="w-full max-h-48 object-cover"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => setViewingReport(null)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
