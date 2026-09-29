"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Navigation,
  MapPin,
  Clock,
  Truck,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Layers,
  Sparkles,
  Phone,
} from "lucide-react";

export interface NgoDirectionData {
  id: string;
  name: string;
  location: string;
  distanceKm: number;
  etaMinutes: number;
  trafficStatus: "low" | "moderate" | "heavy";
  rating?: number;
  phone?: string;
  capacityKg?: number;
  lat: number;
  lng: number;
  foodItem?: string;
  quantityKg?: number;
}

interface NgoDirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ngo: NgoDirectionData | null;
  onConfirmPickup?: (ngoName: string) => void;
}

export default function NgoDirectionModal({
  isOpen,
  onClose,
  ngo,
  onConfirmPickup,
}: NgoDirectionModalProps) {
  const [activeTab, setActiveTab] = useState<"map" | "steps">("map");
  const [isDispatched, setIsDispatched] = useState(false);

  if (!isOpen || !ngo) return null;

  const origin = {
    name: "IIT Delhi Central Mess Hub (Hauz Khas)",
    lat: 28.5459,
    lng: 77.1926,
  };

  const getTrafficInfo = (status: "low" | "moderate" | "heavy") => {
    switch (status) {
      case "low":
        return {
          label: "Clear Roads (Fastest Route)",
          delayText: "+1 min delay",
          color: "#10B981",
          bgColor: "#ECFDF5",
          borderColor: "#A7F3D0",
          speed: "42 km/h avg",
          description: "Traffic is flowing freely via Sri Aurobindo Marg. Ideal dispatch window.",
        };
      case "moderate":
        return {
          label: "Moderate Traffic (Minor Delay)",
          delayText: "+6 mins delay",
          color: "#F59E0B",
          bgColor: "#FFFBEB",
          borderColor: "#FDE68A",
          speed: "28 km/h avg",
          description: "Slow traffic near Ring Road intersection. Delivery time adjusted accordingly.",
        };
      case "heavy":
        return {
          label: "Heavy Traffic Congestion",
          delayText: "+14 mins delay",
          color: "#EF4444",
          bgColor: "#FEF2F2",
          borderColor: "#FECACA",
          speed: "16 km/h avg",
          description: "Heavy congestion near flyover corridor. Immediate dispatch recommended to protect cold-chain.",
        };
    }
  };

  const traffic = getTrafficInfo(ngo.trafficStatus);

  // Exact Google Maps Direction URL for direct external navigation
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${ngo.lat},${ngo.lng}&travelmode=driving`;

  // Google Maps embed with source and destination addresses + traffic overlay
  const googleMapsEmbedUrl = `https://maps.google.com/maps?saddr=${origin.lat},${origin.lng}&daddr=${ngo.lat},${ngo.lng}&layer=t&output=embed`;

  const handleDispatch = () => {
    setIsDispatched(true);
    if (onConfirmPickup) {
      onConfirmPickup(ngo.name);
    }
    setTimeout(() => {
      setIsDispatched(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E8ECF3] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-[#E8ECF3] flex items-center justify-between bg-gradient-to-r from-[#F9FAFB] to-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                  Google Maps Route & Traffic Intelligence
                </span>
                <span className="text-xs text-[#9CA3AF]">•</span>
                <span className="text-xs text-[#6B7280]">Live Directions</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#111827] mt-0.5">
                Route to {ngo.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* METRICS STRIP: TIME TO DELIVER + TRAFFIC + DISTANCE */}
        <div className="p-4 bg-[#F9FAFB] border-b border-[#E8ECF3] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-white border border-[#E8ECF3] shadow-sm">
            <div className="text-[11px] font-medium text-[#6B7280]">Time to Deliver Food</div>
            <div className="text-2xl font-extrabold text-[#111827] font-mono-data mt-0.5 flex items-center justify-center gap-1">
              <span>{ngo.etaMinutes}</span>
              <span className="text-xs font-semibold text-[#6B7280]">mins</span>
            </div>
            <div className="text-[10px] font-semibold text-[#10B981]">
              Arrival in ~{ngo.etaMinutes}m
            </div>
          </div>

          <div
            className="p-3 rounded-xl border shadow-sm"
            style={{
              background: traffic.bgColor,
              borderColor: traffic.borderColor,
            }}
          >
            <div className="text-[11px] font-medium text-[#6B7280]">Traffic Condition</div>
            <div
              className="text-base font-bold mt-1 flex items-center justify-center gap-1"
              style={{ color: traffic.color }}
            >
              <CircleDot className="w-4 h-4 animate-pulse" />
              <span className="capitalize">{ngo.trafficStatus} Traffic</span>
            </div>
            <div className="text-[10px] font-semibold text-[#6B7280]">
              {traffic.delayText}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E8ECF3] shadow-sm">
            <div className="text-[11px] font-medium text-[#6B7280]">Total Distance</div>
            <div className="text-2xl font-extrabold text-[#111827] font-mono-data mt-0.5 flex items-center justify-center gap-1">
              <span>{ngo.distanceKm}</span>
              <span className="text-xs font-semibold text-[#6B7280]">km</span>
            </div>
            <div className="text-[10px] font-semibold text-[#6B7280]">Direct Transit Line</div>
          </div>

          <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] shadow-sm">
            <div className="text-[11px] font-medium text-[#059669]">Food Safety Window</div>
            <div className="text-2xl font-extrabold text-[#10B981] font-mono-data mt-0.5">
              100%
            </div>
            <div className="text-[10px] font-bold text-[#059669] flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> FSSAI Verified Safe
            </div>
          </div>
        </div>

        {/* MAP CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-[#E8ECF3] shadow-inner relative bg-[#F3F4F6]">
            {/* Live Traffic Badge on top of Map */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span
                className="px-3 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                style={{
                  background: traffic.bgColor,
                  color: traffic.color,
                  border: `1px solid ${traffic.borderColor}`,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ background: traffic.color }}
                />
                Live Traffic: {traffic.label}
              </span>
            </div>

            <div className="absolute top-3 right-3 z-10">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/95 hover:bg-white text-[#111827] border border-[#E8ECF3] shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#10B981]" />
                Open in Google Maps
              </a>
            </div>

            {/* Embedded Google Maps Directions with Live Traffic layer */}
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Google Map Directions to ${ngo.name}`}
              className="w-full h-[360px] sm:h-[400px]"
            />

            {/* Bottom Map Status Bar */}
            <div className="p-3 bg-white border-t border-[#E8ECF3] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#10B981] shrink-0" />
                <span className="text-[#111827] font-semibold">Origin:</span>
                <span className="text-[#6B7280]">{origin.name}</span>
                <span className="text-[#9CA3AF]">➔</span>
                <span className="text-[#111827] font-semibold">Destination:</span>
                <span className="text-[#6B7280] font-medium">{ngo.name} ({ngo.location})</span>
              </div>
              <div className="text-[11px] text-[#6B7280]">
                Avg Speed: <span className="font-semibold text-[#111827]">{traffic.speed}</span>
              </div>
            </div>
          </div>

          {/* TURN-BY-TURN & TRANSIT INTELLIGENCE */}
          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E8ECF3] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#10B981]" />
                Transit Route Corridor & Traffic Breakdown
              </h4>
              <span className="text-[11px] font-mono-data text-[#6B7280]">
                Delivery Vehicle: DL-01-AB-1234
              </span>
            </div>

            <p className="text-xs text-[#6B7280] leading-relaxed">
              {traffic.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-[#E8ECF3]">
                <div className="text-[10px] text-[#9CA3AF]">Step 1 • Departure</div>
                <div className="font-semibold text-[#111827] mt-0.5">IIT Delhi Main Gate</div>
                <div className="text-[11px] text-[#6B7280]">Sri Aurobindo Marg (0.8 km)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#E8ECF3]">
                <div className="text-[10px] text-[#9CA3AF]">Step 2 • Main Transit</div>
                <div className="font-semibold text-[#111827] mt-0.5">Outer Ring Rd / Flyover</div>
                <div className="text-[11px] text-[#6B7280] flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: traffic.color }}
                  />
                  {traffic.label.split("(")[0]}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#E8ECF3]">
                <div className="text-[10px] text-[#9CA3AF]">Step 3 • Arrival</div>
                <div className="font-semibold text-[#111827] mt-0.5">{ngo.name}</div>
                <div className="text-[11px] text-[#10B981] font-semibold">Drop-off Point Safe</div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-[#E8ECF3] bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#E8ECF3] bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#111827] text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#10B981]" />
              Open Live Directions in Google Maps
            </a>

            <Link
              href={`/kitchen/routes?ngo=${encodeURIComponent(ngo.name)}`}
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5] text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              Route Optimizer View
            </Link>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {ngo.phone && (
              <a
                href={`tel:${ngo.phone}`}
                className="px-3 py-2.5 rounded-xl border border-[#E8ECF3] text-[#6B7280] hover:text-[#111827] text-xs font-semibold flex items-center gap-1.5"
                title={`Call ${ngo.phone}`}
              >
                <Phone className="w-3.5 h-3.5" />
                Call NGO
              </a>
            )}

            <button
              onClick={handleDispatch}
              disabled={isDispatched}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-lg shadow-[#10B981]/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              {isDispatched ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Route Dispatched!
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  Dispatch Van & Lock Route ({ngo.etaMinutes}m)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
