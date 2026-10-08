"use client";

import React, { useState } from "react";
import {
  DonationItem,
  FoodQualityIssueType,
  QualityReportSeverity,
  FoodQualityReport,
} from "@/lib/types";
import { useApp } from "@/context/AppContext";
import {
  AlertTriangle,
  X,
  UploadCloud,
  CheckCircle2,
  ShieldAlert,
  Info,
  Calendar,
  Building2,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

export interface FoodQualityReportModalProps {
  donation: DonationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (report: FoodQualityReport) => void;
}

const ISSUE_CATEGORIES: FoodQualityIssueType[] = [
  "Spoiled / rotten food",
  "Unusual smell",
  "Suspected contamination",
  "Expired / unsafe date",
  "Damaged packaging",
  "Poor storage condition",
  "Food quality does not match description",
  "Other",
];

export default function FoodQualityReportModal({
  donation,
  isOpen,
  onClose,
  onSuccess,
}: FoodQualityReportModalProps) {
  const { createQualityReport, activeNgo } = useApp();

  const [issueType, setIssueType] = useState<FoodQualityIssueType>("Spoiled / rotten food");
  const [severity, setSeverity] = useState<QualityReportSeverity>("HIGH");
  const [description, setDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<FoodQualityReport | null>(null);

  if (!donation || !isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPhoto = () => {
    setPhotoPreview(null);
    setPhotoName(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newReport = createQualityReport({
        donationId: donation.id,
        donorId: donation.donorId || "donor-unknown",
        donorName: donation.donorName,
        donorType: donation.donorType,
        foodName: donation.foodName,
        quantity: `${donation.quantityKg} kg`,
        quantityKg: donation.quantityKg,
        ngoId: activeNgo?.id || "ngo-1",
        ngoName: activeNgo?.name || "Robin Hood Army (Relief Partner)",
        issueType,
        severity,
        description: description.trim(),
        photoUrl: photoPreview || undefined,
      });

      setSubmittedReport(newReport);
      if (onSuccess) {
        onSuccess(newReport);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedReport(null);
    setDescription("");
    setPhotoPreview(null);
    setPhotoName(null);
    setSeverity("HIGH");
    setIssueType("Spoiled / rotten food");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-xl w-full overflow-hidden p-6 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
        {submittedReport ? (
          /* Confirmation State */
          <div className="space-y-5 py-2 text-center animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-gray-950 tracking-tight">
                Food quality report submitted.
              </h3>
              <p className="text-sm font-semibold text-amber-700">
                The donation has been flagged for review.
              </p>
              <p className="text-xs text-gray-500 max-w-md mx-auto pt-1 leading-relaxed">
                Report reference: <span className="font-mono font-bold text-gray-800">{submittedReport.id}</span>.
                A quality concern notification has been dispatched to {donation.donorName}. This batch is marked to ensure safe handling.
              </p>
            </div>

            {/* Reported Details Summary */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-200 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
                <span className="text-gray-500 font-medium">Donation Reference</span>
                <span className="font-mono font-bold text-gray-900">#{donation.id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
                <span className="text-gray-500 font-medium">Donor Organization</span>
                <span className="font-bold text-gray-900">{donation.donorName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
                <span className="text-gray-500 font-medium">Reported Concern</span>
                <span className="font-bold text-amber-900">{submittedReport.issueType}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
                <span className="text-gray-500 font-medium">Severity Level</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    submittedReport.severity === "HIGH"
                      ? "bg-rose-100 text-rose-800"
                      : submittedReport.severity === "MEDIUM"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {submittedReport.severity}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Report Status</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {submittedReport.status}
                </span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-95 cursor-pointer"
              style={{ background: "#164A31" }}
            >
              Done & Return to Donations
            </button>
          </div>
        ) : (
          /* Report Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-950 tracking-tight">
                    Report Food Issue
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Flag an observed quality concern for platform & donor review
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Auto-identified Donation Details */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between font-medium text-gray-500 text-[11px]">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-800">
                  <Building2 className="w-3.5 h-3.5" />
                  {donation.donorName}
                </span>
                <span className="font-mono text-gray-600">ID: #{donation.id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="pt-1 flex items-baseline justify-between">
                <span className="text-sm font-extrabold text-gray-900">{donation.foodName}</span>
                <span className="font-mono font-bold text-gray-600">
                  {donation.quantityKg} kg • ~{donation.servings} Servings
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200/60">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Received / Handover: {donation.acceptedAt || donation.completedAt || "Recent pickup"}
                </span>
                {donation.driverName && (
                  <span>Driver: {donation.driverName}</span>
                )}
              </div>
            </div>

            {/* Issue Category (Required) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                Issue Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as FoodQualityIssueType)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white shadow-2xs"
              >
                {ISSUE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                Severity Level <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSeverity("LOW")}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    severity === "LOW"
                      ? "border-blue-500 bg-blue-50/70 text-blue-950 ring-1 ring-blue-500"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="text-xs font-extrabold">LOW</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                    Minor concern, no immediate safety risk
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSeverity("MEDIUM")}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    severity === "MEDIUM"
                      ? "border-amber-500 bg-amber-50/70 text-amber-950 ring-1 ring-amber-500"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="text-xs font-extrabold">MEDIUM</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                    Hold from distribution until reviewed
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSeverity("HIGH")}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    severity === "HIGH"
                      ? "border-rose-500 bg-rose-50 text-rose-950 ring-1 ring-rose-500"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="text-xs font-extrabold text-rose-600">HIGH</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                    Potentially unsafe / suspected hazard
                  </div>
                </button>
              </div>

              {severity === "HIGH" && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[11px] flex items-center gap-2 mt-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    High reports immediately mark the donation as <strong>Flagged for Review</strong> and notify the donor.
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                Describe the issue
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what you observed (e.g. temperature, color, smell, broken seal)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none shadow-2xs"
              />
            </div>

            {/* Photo Evidence Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center justify-between">
                <span>Add Photo Evidence (Optional)</span>
                <span className="text-[10px] font-normal text-gray-500">Food, packaging, or label photos</span>
              </label>

              {photoPreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 p-2 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Photo evidence preview"
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-gray-900 truncate">{photoName || "Photo evidence attached"}</p>
                    <p className="text-[11px] text-gray-500">Image attached to report record</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-gray-200 bg-[#F8FAFC] hover:bg-gray-100/70 transition-colors cursor-pointer group">
                  <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-emerald-700 transition-colors mb-1" />
                  <span className="text-xs font-bold text-gray-700">Click to upload photo evidence</span>
                  <span className="text-[10px] text-gray-500">PNG, JPG, or WEBP up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Prudent Notice */}
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-[11px] flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
              <span>
                Submission records an observed quality concern for review. It flags the donation to prevent distribution until verified.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                style={{ background: "#164A31" }}
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
