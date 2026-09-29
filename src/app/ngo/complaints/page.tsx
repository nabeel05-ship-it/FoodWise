"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLang } from "@/context/LanguageContext";
import {
  Camera,
  Upload,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  X,
  ImageIcon,
  Building2,
  Phone,
  Eye,
  Flame,
  Bug,
  Droplets,
  ThermometerSun,
  PackageX,
  LifeBuoy,
  MessageSquare,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface Complaint {
  id: string;
  date: string;
  establishment: string;
  category: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Under Review by Admin" | "Donor Penalized" | "Resolved & Replaced" | "Investigating";
  ticketRef: string;
  description: string;
  hasImage: boolean;
  adminAssigned?: string;
  resolutionNote?: string;
}

const COMPLAINT_CATEGORIES = [
  { label: "Spoiled / Sour / Smelling Food", tKey: "ngo.complaints.cat_spoiled", icon: Bug, color: "#DC2626" },
  { label: "Donor No-Show / Severe Delay", tKey: "ngo.complaints.cat_noshow", icon: Clock, color: "#EA580C" },
  { label: "Unhygienic / Open Packaging", tKey: "ngo.complaints.cat_unhygienic", icon: Droplets, color: "#D97706" },
  { label: "Temperature Abuse (Cold)", tKey: "ngo.complaints.cat_temperature", icon: ThermometerSun, color: "#F59E0B" },
  { label: "Quantity Mismatch (Shortage)", tKey: "ngo.complaints.cat_quantity", icon: PackageX, color: "#9333EA" },
  { label: "Diet Mismatch (Non-Veg Mix)", tKey: "ngo.complaints.cat_diet", icon: Flame, color: "#DC2626" },
];

const SEVERITY_LEVELS = [
  { label: "Critical", tKey: "ngo.complaints.sev_critical", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", desc: "Immediate health risk / completely inedible — Emergency replacement dispatched", descKey: "ngo.complaints.sev_critical_desc" },
  { label: "High", tKey: "ngo.complaints.sev_high", color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA", desc: "Serious quality defect — Donor reputation docked -50 pts", descKey: "ngo.complaints.sev_high_desc" },
  { label: "Medium", tKey: "ngo.complaints.sev_medium", color: "#D97706", bg: "#FFF8EB", border: "#FDE68A", desc: "Packaging or delay concern — Official warning issued to kitchen", descKey: "ngo.complaints.sev_medium_desc" },
  { label: "Low", tKey: "ngo.complaints.sev_low", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", desc: "Minor discrepancy — Documented in donor's monthly audit scorecard", descKey: "ngo.complaints.sev_low_desc" },
];

const STATUS_KEYS: Record<string, string> = {
  "Under Review by Admin": "ngo.complaints.status_under_review",
  "Investigating": "ngo.complaints.status_investigating",
  "Donor Penalized": "ngo.complaints.status_penalized",
  "Resolved & Replaced": "ngo.complaints.status_resolved",
};

const SEVERITY_DISPLAY_KEYS: Record<string, string> = {
  "Critical": "ngo.complaints.sev_critical",
  "High": "ngo.complaints.sev_high",
  "Medium": "ngo.complaints.sev_medium",
  "Low": "ngo.complaints.sev_low",
};

const CATEGORY_DISPLAY_KEYS: Record<string, string> = {
  "Spoiled / Sour / Smelling Food": "ngo.complaints.cat_spoiled",
  "Donor No-Show / Severe Delay": "ngo.complaints.cat_noshow",
  "Unhygienic / Open Packaging": "ngo.complaints.cat_unhygienic",
  "Temperature Abuse (Cold)": "ngo.complaints.cat_temperature",
  "Quantity Mismatch (Shortage)": "ngo.complaints.cat_quantity",
  "Diet Mismatch (Non-Veg Mix)": "ngo.complaints.cat_diet",
};

const FALLBACK_COMPLAINTS: Complaint[] = [
  {
    id: "cmp-1",
    date: "Sep 24, 2026 • 4:15 PM",
    establishment: "IIT Delhi Central Mess — Aravali Dining",
    category: "Temperature Abuse (Cold)",
    severity: "High",
    status: "Investigating",
    ticketRef: "FW-SUPPORT-2026-84921",
    description: "Cooked rice container arrived at 38°C (below mandatory 65°C holding guideline). Admin contacted mess warden.",
    hasImage: true,
    adminAssigned: "Priya Sharma (FoodWise Incident Ops)",
    resolutionNote: "Donor kitchen issued warning notice. Re-heating protocol audit scheduled.",
  },
  {
    id: "cmp-2",
    date: "Sep 22, 2026 • 11:30 AM",
    establishment: "Bikanervala Central Kitchen — Okhla",
    category: "Quantity Mismatch (Shortage)",
    severity: "Medium",
    status: "Resolved & Replaced",
    ticketRef: "FW-SUPPORT-2026-84856",
    description: "Claimed surplus was 50 kg but physical handoff was only 28 kg. 70 shelter children short of lunch.",
    hasImage: true,
    adminAssigned: "Rahul Verma (Admin Lead)",
    resolutionNote: "Emergency 25 kg khichdi routed from nearby AIIMS mess within 22 mins. Donor penalized -40 pts.",
  },
  {
    id: "cmp-3",
    date: "Sep 18, 2026 • 2:00 PM",
    establishment: "The Oberoi Banquets & Catering",
    category: "Unhygienic / Open Packaging",
    severity: "Low",
    status: "Resolved & Replaced",
    ticketRef: "FW-SUPPORT-2026-84702",
    description: "Gravy containers were improperly taped, leading to 15% spillage in delivery van.",
    hasImage: false,
    adminAssigned: "FoodWise Auto-Bot",
    resolutionNote: "Donor supplied heavy-duty leakproof crates for all future pickups.",
  },
];

export default function NgoComplaintsPage() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<"file" | "track">("file");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [severity, setSeverity] = useState<string>("High");
  const [establishment, setEstablishment] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [pastComplaints, setPastComplaints] = useState<Complaint[]>(FALLBACK_COMPLAINTS);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load complaints from API on mount
  useEffect(() => {
    async function loadComplaints() {
      try {
        const res = await fetch("/api/complaints");
        const json = await res.json();
        if (json.success && json.data?.length > 0) {
          setPastComplaints(
            json.data.map((c: Record<string, unknown>) => ({
              id: (c.complaintId as string) || (c._id as string),
              date: c.date as string,
              establishment: c.establishment as string,
              category: c.category as string,
              severity: (c.severity as Complaint["severity"]) || "High",
              status: ((c.status as string) === "Submitted" ? "Under Review by Admin" : c.status as Complaint["status"]) || "Under Review by Admin",
              ticketRef: (c.ticketRef as string) || (c.fssaiRef as string) || `FW-SUPPORT-2026-${Math.floor(80000 + Math.random() * 10000)}`,
              description: c.description as string,
              hasImage: c.hasImage as boolean,
              adminAssigned: (c.adminAssigned as string) || "FoodWise Incident Ops",
              resolutionNote: (c.resolutionNote as string) || "Admin review in progress (<30m SLA).",
            }))
          );
        }
      } catch {
        // Fallback to local
      }
    }
    loadComplaints();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch {
      alert(t("ngo.complaints.camera_denied"));
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !establishment || !description) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          severity,
          establishment,
          location,
          description,
          contactPhone,
          hasImage: !!capturedImage,
        }),
      });
      const json = await res.json();

      const ticketRef = json.ticketRef || json.fssaiRef || `FW-SUPPORT-2026-${Math.floor(80000 + Math.random() * 10000)}`;

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setGeneratedRef(ticketRef);

      setPastComplaints((prev) => [
        {
          id: json.data?.complaintId || `cmp-${Date.now()}`,
          date: json.data?.date || "Just now",
          establishment,
          category: selectedCategory,
          severity: severity as Complaint["severity"],
          status: "Under Review by Admin",
          ticketRef,
          description,
          hasImage: !!capturedImage,
          adminAssigned: "Priya Sharma (Incident Ops)",
          resolutionNote: "Ticket dispatched to FoodWise Admin Desk. Review underway.",
        },
        ...prev,
      ]);
    } catch {
      const ref = `FW-SUPPORT-2026-${Math.floor(80000 + Math.random() * 10000)}`;
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setGeneratedRef(ref);
      }, 1000);
    }
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setSeverity("High");
    setEstablishment("");
    setLocation("");
    setDescription("");
    setContactPhone("");
    setCapturedImage(null);
    setSubmitSuccess(false);
    setGeneratedRef("");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Under Review by Admin":
        return { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" };
      case "Investigating":
        return { bg: "#FFF8EB", color: "#D97706", border: "#FDE68A" };
      case "Donor Penalized":
        return { bg: "#FFF1F2", color: "#DC2626", border: "#FECACA" };
      case "Resolved & Replaced":
        return { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" };
      default:
        return { bg: "#F9FAFB", color: "#6B7280", border: "#E5E7EB" };
    }
  };

  const getSeverityStyle = (sev: string) => {
    const found = SEVERITY_LEVELS.find((s) => s.label === sev);
    return found || SEVERITY_LEVELS[1];
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
              <LifeBuoy className="w-3.5 h-3.5" />
              {t("ngo.complaints.helpdesk")}
            </span>
            <span className="text-gray-300">&bull;</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ⚡ {t("ngo.complaints.sla_badge")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            {t("ngo.complaints.title")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t("ngo.complaints.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
            <Phone className="w-3.5 h-3.5" />
            <span>{t("ngo.complaints.admin_helpline")}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700">
            <span>{pastComplaints.length} {t("ngo.complaints.open_incidents")}</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("file")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "file"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          {t("ngo.complaints.raise_issue")}
        </button>
        <button
          onClick={() => setActiveTab("track")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "track"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Eye className="w-4 h-4" />
          {t("ngo.complaints.live_tickets")} ({pastComplaints.length})
        </button>
      </div>

      {/* SUCCESS STATE */}
      {submitSuccess && (
        <div className="card p-8 text-center bg-white border-2 border-emerald-300 shadow-xl rounded-3xl">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
            {t("ngo.complaints.success_title")}
          </h2>
          <p className="text-sm text-gray-600 max-w-lg mx-auto mb-4">
            {t("ngo.complaints.success_desc")}
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl mb-4 bg-emerald-50 border border-emerald-200">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-extrabold text-emerald-900 font-mono-data">
              {t("ngo.complaints.admin_ticket_label")} {generatedRef}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto my-4 text-left text-xs bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
            <div>
              <span className="text-gray-400 block font-medium">{t("ngo.complaints.assigned_lead")}</span>
              <span className="font-bold text-gray-900">Priya Sharma (Ops)</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">{t("ngo.complaints.review_eta")}</span>
              <span className="font-bold text-emerald-600">{t("ngo.complaints.less_30_min")}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">{t("ngo.complaints.donor_status")}</span>
              <span className="font-bold text-amber-600">{t("ngo.complaints.points_frozen")}</span>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all cursor-pointer active:scale-95"
          >
            {t("ngo.complaints.report_another")}
          </button>
        </div>
      )}

      {/* FILE COMPLAINT FORM */}
      {activeTab === "file" && !submitSuccess && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column — Form */}
          <div className="lg:col-span-7 space-y-5">
            {/* Category Selection */}
            <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
              <h3 className="text-[15px] font-bold text-gray-900 mb-1">
                {t("ngo.complaints.what_issue")}
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                {t("ngo.complaints.select_category")}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {COMPLAINT_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.label;
                  return (
                    <button
                      key={cat.label}
                      onClick={() => setSelectedCategory(cat.label)}
                      className="p-3.5 rounded-xl text-left transition-all hover:scale-[1.02] cursor-pointer"
                      style={{
                        background: isSelected ? `${cat.color}15` : "#F9FAFB",
                        border: `2px solid ${isSelected ? cat.color : "#E5E7EB"}`,
                      }}
                    >
                      <Icon className="w-5 h-5 mb-2" style={{ color: cat.color }} />
                      <div className="text-[12px] font-bold leading-tight" style={{ color: isSelected ? cat.color : "#374151" }}>
                        {t(cat.tKey)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Establishment Details */}
            <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
              <h3 className="text-[15px] font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                {t("ngo.complaints.donor_details")}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[12px] font-bold block mb-1 text-gray-700">
                    {t("ngo.complaints.donor_name_label")}
                  </label>
                  <input
                    type="text"
                    value={establishment}
                    onChange={(e) => setEstablishment(e.target.value)}
                    placeholder={t("ngo.complaints.donor_name_placeholder")}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold block mb-1 text-gray-700">
                    <MapPin className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                    {t("ngo.complaints.pickup_location")}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t("ngo.complaints.pickup_placeholder")}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold block mb-1 text-gray-700">
                    <Phone className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                    {t("ngo.complaints.callback_label")}
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder={t("ngo.complaints.callback_placeholder")}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-gray-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
              <h3 className="text-[15px] font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                {t("ngo.complaints.describe_incident")}
              </h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("ngo.complaints.describe_placeholder")}
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none bg-gray-50/50"
              />
              <div className="text-[11px] text-gray-400 mt-1">
                {description.length}/500 {t("ngo.complaints.char_hint")}
              </div>
            </div>

            {/* Severity */}
            <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
              <h3 className="text-[15px] font-bold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                {t("ngo.complaints.severity_urgency")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SEVERITY_LEVELS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSeverity(s.label)}
                    className="p-3 rounded-xl text-left transition-all cursor-pointer"
                    style={{
                      background: severity === s.label ? s.bg : "#F9FAFB",
                      border: `2px solid ${severity === s.label ? s.color : "#E5E7EB"}`,
                    }}
                  >
                    <div className="text-[13px] font-bold" style={{ color: s.color }}>{t(s.tKey)}</div>
                    <div className="text-[11px] mt-0.5 text-gray-600">{t(s.descKey)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Photo + Admin SLA */}
          <div className="lg:col-span-5 space-y-5">
            {/* Photo Evidence */}
            <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
              <h3 className="text-[15px] font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                {t("ngo.complaints.upload_photo")}
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                {t("ngo.complaints.upload_photo_desc")}
              </p>

              {showCamera && (
                <div className="relative rounded-xl overflow-hidden mb-4 border-2 border-indigo-600">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-xl"
                    style={{ maxHeight: "280px", objectFit: "cover" }}
                  />
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                    <button
                      onClick={capturePhoto}
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 bg-rose-600 text-white border-4 border-white shadow-lg cursor-pointer"
                    >
                      <Camera className="w-6 h-6" />
                    </button>
                    <button
                      onClick={stopCamera}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-black/70 text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              {capturedImage ? (
                <div className="relative rounded-xl overflow-hidden mb-4 border-2 border-emerald-500">
                  <img src={capturedImage} alt="Evidence" className="w-full rounded-xl" style={{ maxHeight: "260px", objectFit: "cover" }} />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-black/60 text-white hover:bg-black/80 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-bold text-white">{t("ngo.complaints.photo_attached")}</span>
                  </div>
                </div>
              ) : !showCamera ? (
                <div className="space-y-3">
                  <button
                    onClick={startCamera}
                    className="w-full py-5 rounded-xl flex flex-col items-center gap-1.5 transition-all hover:scale-[1.01] cursor-pointer bg-indigo-50 border-2 border-dashed border-indigo-300"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-600 text-white">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-indigo-700">{t("ngo.complaints.take_photo")}</span>
                    <span className="text-[10px] text-gray-500">{t("ngo.complaints.live_snap")}</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-gray-100 cursor-pointer bg-gray-50 border border-gray-300"
                  >
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-bold text-gray-700">{t("ngo.complaints.upload_gallery")}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              ) : null}
            </div>

            {/* How FoodWise Admin Resolves */}
            <div className="card p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <Zap className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <div className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
                    {t("ngo.complaints.resolution_guarantee")}
                  </div>
                  <ul className="text-[11px] mt-2 space-y-1.5 text-amber-900 font-medium">
                    <li>&bull; <strong>{t("ngo.complaints.guarantee_response")}</strong> {t("ngo.complaints.guarantee_response_desc")}</li>
                    <li>&bull; <strong>{t("ngo.complaints.guarantee_replacement")}</strong> {t("ngo.complaints.guarantee_replacement_desc")}</li>
                    <li>&bull; <strong>{t("ngo.complaints.guarantee_penalty")}</strong> {t("ngo.complaints.guarantee_penalty_desc")}</li>
                    <li>&bull; <strong>{t("ngo.complaints.guarantee_no_blame")}</strong> {t("ngo.complaints.guarantee_no_blame_desc")}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedCategory || !establishment || !description || isSubmitting}
              className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("ngo.complaints.dispatching")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t("ngo.complaints.submit_btn")}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TRACK COMPLAINTS */}
      {activeTab === "track" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card p-4 text-center bg-white border border-gray-200 rounded-2xl border-t-4 border-t-indigo-600">
              <div className="text-2xl font-extrabold font-mono-data text-gray-900">{pastComplaints.length}</div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mt-0.5">{t("ngo.complaints.total_tickets")}</div>
            </div>
            <div className="card p-4 text-center bg-white border border-gray-200 rounded-2xl border-t-4 border-t-blue-500">
              <div className="text-2xl font-extrabold font-mono-data text-blue-600">
                {pastComplaints.filter((c) => c.status === "Under Review by Admin").length}
              </div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mt-0.5">{t("ngo.complaints.under_review")}</div>
            </div>
            <div className="card p-4 text-center bg-white border border-gray-200 rounded-2xl border-t-4 border-t-amber-500">
              <div className="text-2xl font-extrabold font-mono-data text-amber-600">
                {pastComplaints.filter((c) => c.status === "Investigating").length}
              </div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mt-0.5">{t("ngo.complaints.investigating")}</div>
            </div>
            <div className="card p-4 text-center bg-white border border-gray-200 rounded-2xl border-t-4 border-t-emerald-500">
              <div className="text-2xl font-extrabold font-mono-data text-emerald-600">
                {pastComplaints.filter((c) => c.status.includes("Resolved")).length}
              </div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mt-0.5">{t("ngo.complaints.resolved")}</div>
            </div>
          </div>

          {/* Tickets List */}
          {pastComplaints.map((cmp) => {
            const statusStyle = getStatusStyle(cmp.status);
            const sevStyle = getSeverityStyle(cmp.severity);
            return (
              <div
                key={cmp.id}
                className="card p-5 transition-all bg-white border border-gray-200 rounded-2xl hover:shadow-md space-y-3"
                style={{ borderLeft: `5px solid ${sevStyle.color}` }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono-data font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                      {cmp.ticketRef}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900">{cmp.establishment}</h3>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: sevStyle.bg, color: sevStyle.color, border: `1px solid ${sevStyle.border}` }}
                    >
                      {t(SEVERITY_DISPLAY_KEYS[cmp.severity] || cmp.severity)} {t("ngo.complaints.priority")}
                    </span>
                  </div>
                  <span
                    className="text-[11px] font-black px-2.5 py-1 rounded-xl"
                    style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}
                  >
                    ● {t(STATUS_KEYS[cmp.status] || cmp.status)}
                  </span>
                </div>

                <div className="text-xs text-gray-700 leading-relaxed">
                  {cmp.description}
                </div>

                {cmp.resolutionNote && (
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                    <span className="font-bold text-gray-900 block mb-0.5">
                      {t("ngo.complaints.admin_action")} ({cmp.adminAssigned || t("ngo.complaints.incident_ops")}):
                    </span>
                    <span className="text-gray-600">{cmp.resolutionNote}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{cmp.date}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{t(CATEGORY_DISPLAY_KEYS[cmp.category] || cmp.category)}</span>
                  </div>
                  {cmp.hasImage && (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <ImageIcon className="w-3.5 h-3.5" /> {t("ngo.complaints.photo_attached")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
