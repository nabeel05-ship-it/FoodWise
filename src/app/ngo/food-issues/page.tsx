"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, Search, ArrowRight, Eye, Camera, Utensils, Upload, X } from "lucide-react";
import { FoodQualityIssueType, QualityReportSeverity } from "@/lib/types";

export default function FoodIssuesPage() {
  const { donations, qualityReports, createQualityReport, activeNgo } = useApp();
  const [activeTab, setActiveTab] = useState<"report" | "track">("report");
  
  // Reporting state
  const [selectedDonationId, setSelectedDonationId] = useState<string>("");
  const [issueType, setIssueType] = useState<FoodQualityIssueType>("Spoiled / rotten food");
  const [severity, setSeverity] = useState<QualityReportSeverity>("MEDIUM");
  const [description, setDescription] = useState("");
  const [evidenceImage, setEvidenceImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Eligible donations for reporting (status COMPLETED and not already reported)
  const eligibleDonations = donations.filter(
    (d) => d.status === "COMPLETED" && !d.qualityReportId
  );

  const selectedDonation = eligibleDonations.find(d => d.id === selectedDonationId);

  const handleSubmit = () => {
    if (!selectedDonation) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      createQualityReport({
        donationId: selectedDonation.id,
        donorId: selectedDonation.donorId,
        donorName: selectedDonation.donorName,
        donorType: selectedDonation.donorType,
        foodName: selectedDonation.foodName,
        quantity: selectedDonation.quantity,
        quantityKg: selectedDonation.quantityKg,
        ngoId: activeNgo?.id || "ngo-1",
        ngoName: activeNgo?.name || selectedDonation.acceptedBy || "Akshaya Patra Foundation",
        issueType,
        severity,
        description,
        photoUrl: evidenceImage || undefined,
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setEvidenceImage(null);
    }, 800);
  };

  const getSeverityColor = (sev: QualityReportSeverity) => {
    switch (sev) {
      case "HIGH": return "text-red-700 bg-red-50 border-red-200";
      case "MEDIUM": return "text-amber-700 bg-amber-50 border-amber-200";
      case "LOW": return "text-blue-700 bg-blue-50 border-blue-200";
      default: return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REPORTED": return "text-blue-700 bg-blue-50 border-blue-200";
      case "UNDER REVIEW": return "text-amber-700 bg-amber-50 border-amber-200";
      case "RESOLVED": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      default: return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
          Food Issues & Quality
        </h1>
        <p className="text-gray-600 mt-2">
          Report quality or delivery-related issues for donations you have recently received. 
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
        <button
          onClick={() => { setActiveTab("report"); setSubmitSuccess(false); }}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "report"
              ? "bg-emerald-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Report New Issue
        </button>
        <button
          onClick={() => setActiveTab("track")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "track"
              ? "bg-emerald-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Search className="w-4 h-4" />
          Issue Tracking ({qualityReports.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "report" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {submitSuccess ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Reported Successfully</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your report has been securely submitted and flagged for review by the FoodWise administrative team. We will investigate the issue with the donor.
              </p>
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setSelectedDonationId("");
                  setDescription("");
                }}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
              >
                Report Another Issue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Step 1: Select Donation */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">1</span>
                  Select Received Donation
                </h3>
                
                {eligibleDonations.length === 0 ? (
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
                    <Utensils className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium text-sm">No eligible donations to report.</p>
                    <p className="text-xs text-gray-500 mt-1">Issues can only be reported for donations that have been marked as received.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {eligibleDonations.map(d => (
                      <div 
                        key={d.id}
                        onClick={() => setSelectedDonationId(d.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedDonationId === d.id 
                            ? "border-emerald-500 bg-emerald-50/30" 
                            : "border-gray-200 hover:border-emerald-300 bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900">{d.foodName}</h4>
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            {d.quantityKg} kg
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium text-gray-800">Donor:</span> {d.donorName}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Received: {d.completedAt || "Recently"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2: Issue Details */}
              <div className={`space-y-5 transition-opacity ${!selectedDonationId ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">2</span>
                  Issue Details
                </h3>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Issue Type</label>
                  <select 
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value as FoodQualityIssueType)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50"
                  >
                    <option value="Spoiled / rotten food">Food appears spoiled or rotten</option>
                    <option value="Unusual smell">Unusual or foul smell</option>
                    <option value="Suspected contamination">Suspected contamination</option>
                    <option value="Damaged packaging">Severely damaged or open packaging</option>
                    <option value="Poor storage condition">Arrived at unsafe temperature</option>
                    <option value="Food quality does not match description">Does not match description</option>
                    <option value="Other">Other issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Severity Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["LOW", "MEDIUM", "HIGH"] as QualityReportSeverity[]).map(sev => (
                      <button
                        key={sev}
                        onClick={() => setSeverity(sev)}
                        className={`py-2 rounded-xl text-xs font-bold border-2 transition-colors ${
                          severity === sev 
                            ? getSeverityColor(sev) + " border-current"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Additional Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide observational details (e.g., 'The rice had a sour smell and packaging was compromised upon opening.')"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50 resize-none text-sm"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Photo Evidence (Optional)</label>
                  {!evidenceImage ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 font-medium">Click to upload an image</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  ) : (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                      <img src={evidenceImage} alt="Evidence" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setEvidenceImage(null)}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-black/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !description.trim()}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5" />
                      Submit Quality Report
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "track" && (
        <div className="space-y-4">
          {qualityReports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Issues Reported</h3>
              <p className="text-gray-500 text-sm">You haven&apos;t reported any food quality issues yet.</p>
            </div>
          ) : (
            qualityReports.map(report => (
              <div key={report.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {report.id}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900">{report.foodName}</h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getSeverityColor(report.severity)}`}>
                      {report.severity} SEVERITY
                    </span>
                    <div className="text-xs text-gray-500 mt-1.5">{report.dateStr}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Reported Issue</div>
                    <div className="text-sm font-medium text-gray-900 mb-2">{report.issueType}</div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      &quot;{report.description}&quot;
                    </div>
                    {report.photoUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 max-w-[200px]">
                        <img src={report.photoUrl} alt="Evidence" className="w-full h-auto object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                     <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Donor Details</div>
                     <div className="text-sm font-medium text-gray-900">{report.donorName}</div>
                     <div className="text-xs text-gray-500">
                       {report.donorType === "Restaurant" || report.donorType === "Hotel" || report.donorType === "Restaurant / Hotel"
                         ? "Restaurant / Hotel"
                         : report.donorType} • {report.quantityKg} kg affected
                     </div>
                     
                     {report.statusNote && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <div className="text-xs font-bold text-blue-800 mb-1">Admin Note</div>
                          <div className="text-xs text-blue-700">{report.statusNote}</div>
                        </div>
                     )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
