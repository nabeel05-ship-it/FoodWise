"use client";

import React, { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import {
  Route,
  Navigation,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Share2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Timer,
  CircleDot,
  Zap,
  ExternalLink,
  Phone,
  Sparkles,
} from "lucide-react";



// Route stop locations / NGOs in New Delhi
const DELIVERY_POINTS = [
  {
    id: 1,
    name: "Aasha Foundation Night Shelter",
    address: "Lodhi Road, New Delhi",
    lat: 28.5862,
    lng: 77.2278,
    food: "Dal Makhani & Rice (60 kg)",
    beneficiaries: 180,
    eta: 14,
    distance: 3.2,
    trafficStatus: "low" as const,
    trafficDelay: "+1 min (Free flow)",
    status: "delivered" as const,
    time: "1:30 PM",
    phone: "+91 98112 40291",
    corridor: "Via Sri Aurobindo Marg & Lodhi Rd",
  },
  {
    id: 2,
    name: "Nizamuddin Basti Community Kitchen",
    address: "Nizamuddin West, New Delhi",
    lat: 28.5908,
    lng: 77.2437,
    food: "Mixed Veg Sabzi & Phulkas (35 kg)",
    beneficiaries: 120,
    eta: 22,
    distance: 4.8,
    trafficStatus: "moderate" as const,
    trafficDelay: "+6 mins (Moderate congestion)",
    status: "en-route" as const,
    time: "2:15 PM",
    phone: "+91 99201 88374",
    corridor: "Via Outer Ring Rd & Mathura Rd",
  },
  {
    id: 3,
    name: "Sarai Kale Khan Relief Center",
    address: "Ring Road, New Delhi",
    lat: 28.5862,
    lng: 77.2590,
    food: "Paneer Curry & Rotis (28 kg)",
    beneficiaries: 90,
    eta: 35,
    distance: 6.1,
    trafficStatus: "heavy" as const,
    trafficDelay: "+14 mins (Ashram flyover slow)",
    status: "pending" as const,
    time: "3:00 PM",
    phone: "+91 98711 39201",
    corridor: "Via Ring Road Corridor (Bottleneck)",
  },
  {
    id: 4,
    name: "Okhla Phase III Workers Camp",
    address: "Okhla Industrial Area, New Delhi",
    lat: 28.5305,
    lng: 77.2707,
    food: "Chana Masala & Puri (50 kg)",
    beneficiaries: 160,
    eta: 45,
    distance: 7.4,
    trafficStatus: "heavy" as const,
    trafficDelay: "+18 mins (Heavy industrial transit)",
    status: "pending" as const,
    time: "3:45 PM",
    phone: "+91 97182 66320",
    corridor: "Via Captain Gaur Marg & Okhla Way",
  },
];

const NGO_HUB = {
  lat: 28.5459,
  lng: 77.1926,
  name: "FoodWise Kitchen Hub — Hauz Khas (IIT Delhi)",
};

function RoutesContent() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const initialNgoParam = searchParams ? searchParams.get("ngo") : null;
  const initialStopParam = searchParams ? searchParams.get("stop") : null;

  // Determine initial active stop from query or default to stop 1
  const getInitialStop = (): number => {
    if (initialStopParam) {
      const parsed = parseInt(initialStopParam);
      if (!isNaN(parsed) && DELIVERY_POINTS.some((p) => p.id === parsed)) return parsed;
    }
    if (initialNgoParam) {
      const found = DELIVERY_POINTS.find((p) =>
        p.name.toLowerCase().includes(initialNgoParam.toLowerCase())
      );
      if (found) return found.id;
    }
    return 1;
  };

  const [activeStop, setActiveStop] = useState<number>(getInitialStop());
  const [showTraffic, setShowTraffic] = useState(true);
  const [isDispatched, setIsDispatched] = useState(false);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const selectedPoint =
    DELIVERY_POINTS.find((p) => p.id === activeStop) || DELIVERY_POINTS[0];

  const getTrafficColor = (status: string) => {
    switch (status) {
      case "low":
        return "#10B981";
      case "moderate":
        return "#F59E0B";
      case "heavy":
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  const getTrafficLabel = (status: string) => {
    switch (status) {
      case "low":
        return t("kitchen.route.traffic_clear");
      case "moderate":
        return t("kitchen.route.traffic_moderate");
      case "heavy":
        return t("kitchen.route.traffic_heavy");
      default:
        return t("kitchen.route.traffic_normal");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "#10B981";
      case "en-route":
        return "#3B82F6";
      case "pending":
        return "#F59E0B";
      default:
        return "#9CA3AF";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return t("kitchen.route.delivered");
      case "en-route":
        return t("kitchen.route.en_route");
      case "pending":
        return t("kitchen.route.pending");
      default:
        return t("kitchen.route.pending");
    }
  };

  // Google Maps external navigation URL — opens real Google Maps with directions auto-set
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${NGO_HUB.lat},${NGO_HUB.lng}&destination=${selectedPoint.lat},${selectedPoint.lng}&travelmode=driving&dir_action=navigate`;

  // Google Maps embed URL — shows proper driving directions with route, time, distance
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${NGO_HUB.lat},${NGO_HUB.lng}&destination=${selectedPoint.lat},${selectedPoint.lng}&mode=driving&avoid=tolls`;

  // Fallback embed if API key doesn't work  
  const googleMapsFallbackUrl = `https://maps.google.com/maps?saddr=${NGO_HUB.lat},${NGO_HUB.lng}&daddr=${selectedPoint.lat},${selectedPoint.lng}&dirflg=d&layer=traffic&output=embed`;

  const handleSelectNgo = (id: number) => {
    setActiveStop(id);
    setMapLoading(true);
    // Smooth scroll to the map area so directions are visible immediately
    setTimeout(() => {
      mapContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setMapLoading(false);
    }, 400);
  };

  const handleDispatch = () => {
    setIsDispatched(true);
    setDispatchAlert(`${t("kitchen.route.dispatch_alert_prefix")} ${selectedPoint.name}!`);
    setTimeout(() => {
      setIsDispatched(false);
      setDispatchAlert(null);
    }, 4500);
  };

  const totalKg = DELIVERY_POINTS.reduce((s, p) => {
    const match = p.food.match(/(\d+)\s*kg/);
    return s + (match ? parseInt(match[1]) : 0);
  }, 0);

  const totalBeneficiaries = DELIVERY_POINTS.reduce((s, p) => s + p.beneficiaries, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4"
        style={{ borderBottom: "1px solid #E8ECF3" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider text-[#10B981] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]"
            >
              {t("kitchen.route.badge")}
            </span>
            <span style={{ color: "#D1D5DB" }}>•</span>
            <span className="text-xs text-[#6B7280]">
              {t("kitchen.route.sub_badge")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            {t("kitchen.route.title")}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            {t("kitchen.route.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-[#111827] border border-[#E8ECF3] shadow-sm hover:shadow transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#10B981]" />
            {t("kitchen.route.open_gmaps")}
          </a>

          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className="px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all shadow-sm"
            style={{
              background: showTraffic ? "#10B981" : "#FFFFFF",
              color: showTraffic ? "#FFFFFF" : "#6B7280",
              border: showTraffic ? "none" : "1px solid #E5E7EB",
            }}
          >
            <Layers className="w-4 h-4" />
            {showTraffic ? t("kitchen.route.traffic_on") : t("kitchen.route.traffic_off")}
          </button>
        </div>
      </div>

      {/* QUICK NGO SELECTOR STRIP */}
      <div className="p-3 bg-white rounded-2xl border border-[#E8ECF3] shadow-sm">
        <div className="text-[11px] font-bold text-[#6B7280] mb-2 px-1 flex items-center justify-between">
          <span>{t("kitchen.route.select_ngo")}</span>
          <span className="text-[#10B981] font-semibold">{t("kitchen.route.verified_hubs")}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {DELIVERY_POINTS.map((point) => {
            const isSelected = activeStop === point.id;
            return (
              <button
                key={point.id}
                type="button"
                onClick={() => handleSelectNgo(point.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? "bg-[#ECFDF5] border-[#10B981] shadow-sm ring-2 ring-[#10B981]/20"
                    : "bg-[#FAFBFC] border-[#E8ECF3] hover:border-[#D0D6E2] hover:bg-white"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ background: isSelected ? "#10B981" : "#6B7280" }}
                    >
                      {point.id}
                    </span>
                    <span
                      className={`text-xs font-bold truncate ${
                        isSelected ? "text-[#065F46]" : "text-[#111827]"
                      }`}
                    >
                      {point.name.split(" ")[0]} {point.name.split(" ")[1]}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#6B7280] ml-6 truncate">
                    {point.distance} {t("kitchen.route.km")} • {point.eta}{t("kitchen.route.min_eta")}
                  </div>
                </div>

                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                  style={{ background: getTrafficColor(point.trafficStatus) }}
                  title={`${point.trafficStatus} traffic`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* DISPATCH SUCCESS ALERT TOAST */}
      {dispatchAlert && (
        <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top duration-300 shadow-md">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            <span>{dispatchAlert}</span>
          </div>
          <span className="text-[10px] bg-[#10B981] text-white px-2 py-0.5 rounded font-mono-data">
            {t("kitchen.route.dispatched")}
          </span>
        </div>
      )}

      {/* ACTIVE DESTINATION HERO CONTROL CARD */}
      <div className="card p-5 border-[#A7F3D0] bg-gradient-to-r from-emerald-50/40 via-white to-white shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#10B981] text-white px-2.5 py-0.5 rounded-md">
                {t("kitchen.route.active_dest")}
              </span>
              <span className="text-xs font-bold text-[#111827]">{selectedPoint.name}</span>
              <span className="text-xs text-[#6B7280]">({selectedPoint.address})</span>
            </div>
            <div className="text-xs text-[#6B7280] flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
              <span>
                <strong>{t("kitchen.route.origin")}:</strong> {NGO_HUB.name}
              </span>
              <span className="text-[#9CA3AF]">➔</span>
              <span>
                <strong>{t("kitchen.route.corridor")}:</strong> {selectedPoint.corridor}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-4 rounded-xl bg-white hover:bg-emerald-50 text-[#059669] border border-[#A7F3D0] text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <ExternalLink className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>{t("kitchen.route.open_live_directions")}</span>
            </a>

            <button
              onClick={handleDispatch}
              disabled={isDispatched}
              className={`h-11 px-5 rounded-xl text-white text-xs font-bold shadow-md shadow-[#10B981]/20 flex items-center justify-center gap-2 whitespace-nowrap transition-colors shrink-0 ${
                isDispatched
                  ? "bg-[#059669] cursor-default opacity-90"
                  : "bg-[#10B981] hover:bg-[#059669] cursor-pointer"
              }`}
            >
              <Truck className="w-4 h-4 shrink-0" />
              <span>{isDispatched ? t("kitchen.route.route_dispatched") : t("kitchen.route.dispatch_van")}</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW FOR SELECTED NGO */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-center">
          <div className="p-3 rounded-xl bg-white border border-[#E8ECF3] shadow-sm">
            <div className="text-[11px] font-medium text-[#6B7280]">{t("kitchen.route.time_to_deliver")}</div>
            <div className="text-2xl font-extrabold text-[#111827] font-mono-data mt-0.5">
              {selectedPoint.eta} <span className="text-xs font-normal text-[#6B7280]">{t("kitchen.route.mins")}</span>
            </div>
            <div className="text-[10px] font-semibold text-[#10B981]">
              {t("kitchen.route.arrival_at")} {selectedPoint.time}
            </div>
          </div>

          <div
            className="p-3 rounded-xl border shadow-sm"
            style={{
              background:
                selectedPoint.trafficStatus === "low"
                  ? "#ECFDF5"
                  : selectedPoint.trafficStatus === "moderate"
                  ? "#FFFBEB"
                  : "#FEF2F2",
              borderColor:
                selectedPoint.trafficStatus === "low"
                  ? "#A7F3D0"
                  : selectedPoint.trafficStatus === "moderate"
                  ? "#FDE68A"
                  : "#FECACA",
            }}
          >
            <div className="text-[11px] font-medium text-[#6B7280]">{t("kitchen.route.traffic_status")}</div>
            <div
              className="text-sm sm:text-base font-bold mt-0.5 flex items-center justify-center gap-1.5"
              style={{ color: getTrafficColor(selectedPoint.trafficStatus) }}
            >
              <CircleDot className="w-3.5 h-3.5 animate-pulse" />
              <span>{getTrafficLabel(selectedPoint.trafficStatus)}</span>
            </div>
            <div className="text-[10px] font-semibold text-[#6B7280]">
              {selectedPoint.trafficDelay}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E8ECF3] shadow-sm">
            <div className="text-[11px] font-medium text-[#6B7280]">{t("kitchen.route.route_distance")}</div>
            <div className="text-2xl font-extrabold text-[#111827] font-mono-data mt-0.5">
              {selectedPoint.distance} <span className="text-xs font-normal text-[#6B7280]">{t("kitchen.route.km")}</span>
            </div>
            <div className="text-[10px] font-semibold text-[#6B7280]">{t("kitchen.route.direct_transit")}</div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E8ECF3] shadow-sm">
            <div className="text-[11px] font-medium text-[#6B7280]">{t("kitchen.route.food_payload")}</div>
            <div className="text-sm font-bold text-[#111827] mt-1 truncate" title={selectedPoint.food}>
              {selectedPoint.food}
            </div>
            <div className="text-[10px] font-bold text-[#059669]">
              {selectedPoint.beneficiaries} {t("kitchen.route.people_fed")}
            </div>
          </div>
        </div>
      </div>

      {/* MAP + STOPS LAYOUT */}
      <div ref={mapContainerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-4">
        {/* GOOGLE MAPS DIRECTIONS CONTAINER (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="card p-0 overflow-hidden shadow-md relative">
            {/* Loading overlay when switching NGO */}
            {mapLoading && (
              <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                <div className="flex items-center gap-3 text-[#10B981] font-semibold text-sm">
                  <span className="w-5 h-5 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                  {t("kitchen.route.setting_directions")} {selectedPoint.name}...
                </div>
              </div>
            )}

            {/* Header Bar above Map */}
            <div className="p-3 px-4 bg-gradient-to-r from-emerald-50 to-white border-b border-[#E8ECF3] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs font-bold text-[#111827]">
                  {t("kitchen.route.maps_driving_directions")} {selectedPoint.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1"
                  style={{
                    background: selectedPoint.trafficStatus === "low" ? "#ECFDF5" : selectedPoint.trafficStatus === "moderate" ? "#FFFBEB" : "#FEF2F2",
                    color: getTrafficColor(selectedPoint.trafficStatus),
                    border: `1px solid ${selectedPoint.trafficStatus === "low" ? "#A7F3D0" : selectedPoint.trafficStatus === "moderate" ? "#FDE68A" : "#FECACA"}`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: getTrafficColor(selectedPoint.trafficStatus) }} />
                  {getTrafficLabel(selectedPoint.trafficStatus)}
                </span>
                <span className="text-[11px] text-[#6B7280] font-mono-data">
                  {selectedPoint.eta} {t("kitchen.route.min")} • {selectedPoint.distance} {t("kitchen.route.km")}
                </span>
              </div>
            </div>

            <div
              ref={mapRef}
              className="w-full relative bg-[#F3F4F6]"
              style={{ height: "480px" }}
            >
              {/* Embedded Google Map with proper Directions mode — shows route, time, distance automatically */}
              <iframe
                key={`embed-${activeStop}-${showTraffic}`}
                src={googleMapsFallbackUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Google Maps Directions — ${NGO_HUB.name} to ${selectedPoint.name}`}
              />

              {/* Floating badges on map */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                <span className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-white/95 border border-[#E8ECF3] shadow-lg text-[#111827] flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#10B981]" />
                  {t("kitchen.route.driving_route_set")}
                </span>
              </div>

              <div className="absolute top-3 right-3 z-10">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#10B981] hover:bg-[#059669] text-white shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t("kitchen.route.open_gmaps")}
                </a>
              </div>

              {/* Bottom-left: From → To indicator */}
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <div className="px-3 py-2 rounded-xl bg-white/95 border border-[#E8ECF3] shadow-lg backdrop-blur-sm flex items-center gap-2 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0" />
                  <span className="font-bold text-[#3B82F6]">{t("kitchen.route.from")}:</span>
                  <span className="text-[#6B7280] truncate">IIT Delhi Hauz Khas</span>
                  <ArrowRight className="w-3 h-3 text-[#9CA3AF] shrink-0" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0" />
                  <span className="font-bold text-[#EF4444]">{t("kitchen.route.to")}:</span>
                  <span className="text-[#6B7280] truncate">{selectedPoint.name}</span>
                </div>
              </div>
            </div>

            {/* Traffic Legend + Route Info Bar */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#FAFBFC]"
              style={{ borderTop: "1px solid #E8ECF3" }}
            >
              <div className="flex items-center gap-4 text-[11px]">
                <span className="font-bold text-[#6B7280]">{t("kitchen.route.traffic_legend")}:</span>
                <span className="flex items-center gap-1.5 font-semibold text-[#059669]">
                  <span className="w-3 h-1.5 rounded-full bg-[#10B981]" /> {t("kitchen.route.legend_clear")}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-[#D97706]">
                  <span className="w-3 h-1.5 rounded-full bg-[#F59E0B]" /> {t("kitchen.route.legend_moderate")}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-[#DC2626]">
                  <span className="w-3 h-1.5 rounded-full bg-[#EF4444]" /> {t("kitchen.route.legend_heavy")}
                </span>
              </div>
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#10B981] hover:underline flex items-center gap-1"
              >
                {t("kitchen.route.open_full_nav")} <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* ═══ ROUTE DETAILS PANEL — Shows automatically when NGO is selected ═══ */}
          <div className="card p-4 border-l-4 shadow-sm" style={{ borderLeftColor: getTrafficColor(selectedPoint.trafficStatus) }}>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ background: getTrafficColor(selectedPoint.trafficStatus) }}
              >
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111827]">
                  {t("kitchen.route.route_details")} — {selectedPoint.name}
                </h4>
                <p className="text-[11px] text-[#6B7280]">
                  {selectedPoint.corridor}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E8ECF3] text-center">
                <Clock className="w-4 h-4 mx-auto text-[#6B7280] mb-1" />
                <div className="text-lg font-extrabold font-mono-data text-[#111827]">{selectedPoint.eta}<span className="text-[10px] font-normal text-[#6B7280]"> {t("kitchen.route.min")}</span></div>
                <div className="text-[10px] text-[#9CA3AF]">{t("kitchen.route.delivery_time")}</div>
              </div>
              <div
                className="p-2.5 rounded-xl border text-center"
                style={{
                  background: selectedPoint.trafficStatus === "low" ? "#ECFDF5" : selectedPoint.trafficStatus === "moderate" ? "#FFFBEB" : "#FEF2F2",
                  borderColor: selectedPoint.trafficStatus === "low" ? "#A7F3D0" : selectedPoint.trafficStatus === "moderate" ? "#FDE68A" : "#FECACA",
                }}
              >
                <CircleDot className="w-4 h-4 mx-auto animate-pulse mb-1" style={{ color: getTrafficColor(selectedPoint.trafficStatus) }} />
                <div className="text-xs font-bold" style={{ color: getTrafficColor(selectedPoint.trafficStatus) }}>{getTrafficLabel(selectedPoint.trafficStatus)}</div>
                <div className="text-[10px] text-[#6B7280]">{selectedPoint.trafficDelay}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E8ECF3] text-center">
                <MapPin className="w-4 h-4 mx-auto text-[#6B7280] mb-1" />
                <div className="text-lg font-extrabold font-mono-data text-[#111827]">{selectedPoint.distance}<span className="text-[10px] font-normal text-[#6B7280]"> {t("kitchen.route.km")}</span></div>
                <div className="text-[10px] text-[#9CA3AF]">{t("kitchen.route.distance")}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-center">
                <Sparkles className="w-4 h-4 mx-auto text-[#10B981] mb-1" />
                <div className="text-lg font-extrabold font-mono-data text-[#059669]">{selectedPoint.beneficiaries}</div>
                <div className="text-[10px] text-[#059669]">{t("kitchen.route.people_fed")}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6] text-xs">
              <div className="flex items-center gap-3 text-[#6B7280]">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  {selectedPoint.food}
                </span>
                {selectedPoint.phone && (
                  <a href={`tel:${selectedPoint.phone}`} className="flex items-center gap-1 text-[#3B82F6] hover:underline">
                    <Phone className="w-3 h-3" />
                    {selectedPoint.phone}
                  </a>
                )}
              </div>
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#10B981] hover:underline flex items-center gap-1"
              >
                {t("kitchen.route.navigate_now")} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* DELIVERY STOPS LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="section-title flex items-center gap-2 text-base font-bold text-[#111827]">
              <Route className="w-5 h-5 text-[#10B981]" />
              {t("kitchen.route.redistribution_stops")}
            </h3>
            <span className="badge badge-success font-mono-data">
              {DELIVERY_POINTS.filter((d) => d.status === "delivered").length}/
              {DELIVERY_POINTS.length} {t("kitchen.route.completed")}
            </span>
          </div>

          {/* Origin Card */}
          <div
            className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white bg-[#10B981] shrink-0"
              >
                🏠
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-[#065F46] truncate">
                  {t("kitchen.route.origin")}: {NGO_HUB.name}
                </div>
                <div className="text-[11px] text-[#6B7280]">
                  {t("kitchen.route.cold_storage_vehicle")}
                </div>
              </div>
            </div>
          </div>

          {/* Stops List */}
          {DELIVERY_POINTS.map((point, idx) => {
            const isCurrent = activeStop === point.id;
            return (
              <div
                key={point.id}
                className={`card p-4 cursor-pointer transition-all hover:shadow-md ${
                  isCurrent ? "ring-2 ring-[#10B981] shadow-md bg-emerald-50/20" : "bg-white"
                }`}
                style={{
                  borderLeft: `4px solid ${getTrafficColor(point.trafficStatus)}`,
                }}
                onClick={() => handleSelectNgo(point.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 shadow-sm"
                    style={{ background: getStatusColor(point.status) }}
                  >
                    {point.status === "delivered" ? "✓" : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-bold text-[#111827] truncate">
                        {point.name}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          background:
                            point.status === "delivered"
                              ? "#ECFDF5"
                              : point.status === "en-route"
                              ? "#EFF6FF"
                              : "#FFF8EB",
                          color: getStatusColor(point.status),
                        }}
                      >
                        {getStatusLabel(point.status)}
                      </span>
                    </div>

                    <div className="text-[11px] mb-2 text-[#6B7280] truncate">
                      {point.food}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] flex-wrap">
                      <span className="flex items-center gap-1 text-[#6B7280]">
                        <MapPin className="w-3 h-3" /> {point.distance} {t("kitchen.route.km")}
                      </span>
                      <span
                        className="flex items-center gap-1 font-bold"
                        style={{ color: getTrafficColor(point.trafficStatus) }}
                      >
                        <Navigation className="w-3 h-3" /> {point.eta} {t("kitchen.route.mins_eta")}
                      </span>
                      <span className="flex items-center gap-1 text-[#6B7280]">
                        <Clock className="w-3 h-3" /> {point.time}
                      </span>
                      <span className="font-mono-data font-bold text-[#111827]">
                        {point.beneficiaries} {t("kitchen.route.people")}
                      </span>
                    </div>

                    {/* Traffic Status Indicator */}
                    <div className="mt-2.5 pt-2 border-t border-[#F3F4F6] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <CircleDot
                          className="w-3 h-3"
                          style={{ color: getTrafficColor(point.trafficStatus) }}
                        />
                        <span
                          className="text-[10px] font-bold"
                          style={{ color: getTrafficColor(point.trafficStatus) }}
                        >
                          {getTrafficLabel(point.trafficStatus)}
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold text-[#10B981] group-hover:underline">
                        {isCurrent ? t("kitchen.route.active_route") : t("kitchen.route.click_to_route")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Route Totals Card */}
          <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E8ECF3] shadow-sm">
            <div className="grid grid-cols-3 gap-3 text-center text-[12px]">
              <div>
                <div className="text-[#9CA3AF]">{t("kitchen.route.total_distance")}</div>
                <div className="font-mono-data font-bold text-[16px] text-[#111827]">
                  21.5 {t("kitchen.route.km")}
                </div>
              </div>
              <div>
                <div className="text-[#9CA3AF]">{t("kitchen.route.fleet_transit_time")}</div>
                <div className="font-mono-data font-bold text-[16px] text-[#111827]">
                  1h 56m
                </div>
              </div>
              <div>
                <div className="text-[#9CA3AF]">Fuel Savings</div>
                <div className="font-mono-data font-bold text-[16px] text-[#059669]">
                  18%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KitchenRoutesPage() {
  const { t } = useLang();
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-[#10B981] font-semibold">
            <span className="w-5 h-5 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
            {t("kitchen.route.loading")}
          </div>
        </div>
      }
    >
      <RoutesContent />
    </Suspense>
  );
}
