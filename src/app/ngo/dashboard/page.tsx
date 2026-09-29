"use client";

import React, { useState, Suspense, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { INSTITUTIONS } from "@/lib/mockData";
import {
  HeartHandshake,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  Filter,
  Check,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Navigation,
  AlertTriangle,
  CircleDot,
  Timer,
  Route,
  Zap,
  ExternalLink,
  PackageCheck,
  Layers,
  Search,
  Download,
  Key,
  X,
  Phone,
  User,
} from "lucide-react";
import confetti from "canvas-confetti";

interface SurplusFeedItem {
  id: string;
  institution: string;
  foodType: string;
  diet: "Vegetarian" | "Egg" | "Jain";
  quantityKg: number;
  location: string;
  distanceKm: number;
  safeUntil: string;
  hoursLeft: number;
  fssaiVerified: boolean;
  lat: number;
  lng: number;
  trafficStatus: "low" | "moderate" | "heavy";
  etaMinutes: number;
}

export interface ScheduledPickup {
  id: string;
  itemId?: string;
  institution: string;
  food: string;
  destination: string;
  driver: string;
  phone: string;
  otp: string;
  eta: string;
  status: string;
  lat?: number;
  lng?: number;
  quantityKg?: number;
  timestamp?: number;
}

const VOLUNTEER_DRIVERS = [
  { name: "Ramesh Kumar", vehicle: "Van DL-1L-4492", phone: "+91 98112 34567" },
  { name: "Satish Pal", vehicle: "E-Loader DL-4E-9021", phone: "+91 98770 12345" },
  { name: "Vikram Singh", vehicle: "Eco Van DL-2C-1108", phone: "+91 98104 56789" },
  { name: "Harpreet Singh", vehicle: "Refrigerated Van DL-3S-8821", phone: "+91 98188 44321" },
];

const RELIEF_DESTINATIONS = [
  { name: "Aasha Shelter Home, Malviya Nagar", capacity: "250 meals" },
  { name: "Nizamuddin Rain Basera Center", capacity: "180 meals" },
  { name: "Sarai Kale Khan Relief Center", capacity: "320 meals" },
  { name: "Kalkaji Community Food Bank", capacity: "150 meals" },
  { name: "Okhla Slum Children Relief", capacity: "200 meals" },
];

const DEFAULT_SCHEDULED_PICKUPS: ScheduledPickup[] = [
  {
    id: "sched-1",
    itemId: "feed-1",
    institution: "IIT Delhi Central Mess (Aravali)",
    food: "Dal Makhani & Steamed Rice (60 kg)",
    destination: "Aasha Shelter Home, Malviya Nagar",
    driver: "Ramesh Kumar (Van DL-1L-4492)",
    phone: "+91 98112 34567",
    otp: "8942",
    eta: "Arriving at Kitchen in 8 mins",
    status: "En Route to Kitchen",
    lat: 28.5459,
    lng: 77.1926,
    quantityKg: 60,
    timestamp: Date.now() - 1000 * 60 * 15,
  },
  {
    id: "sched-2",
    itemId: "feed-2",
    institution: "AIIMS Hospital Staff Cafeteria",
    food: "Mixed Veg Sabzi & 140 Phulkas (35 kg)",
    destination: "Nizamuddin Rain Basera Center",
    driver: "Satish Pal (E-Loader DL-4E-9021)",
    phone: "+91 98770 12345",
    otp: "4119",
    eta: "Loaded & In Transit to Shelter",
    status: "Delivering to Shelter",
    lat: 28.5672,
    lng: 77.2100,
    quantityKg: 35,
    timestamp: Date.now() - 1000 * 60 * 45,
  },
];

export interface PastPickupHistoryItem {
  id: string;
  date: string;
  institution: string;
  food: string;
  recipient: string;
  receipt: string;
  driver: string;
  status: string;
}

const INITIAL_PAST_HISTORY: PastPickupHistoryItem[] = [
  {
    id: "hist-1",
    date: "Yesterday, 3:30 PM",
    institution: "IIT Delhi Mess",
    food: "Rajma & Jeera Rice (75 kg)",
    recipient: "Aasha Shelter (220 meals)",
    receipt: "FSSAI-RELIEF-9041",
    driver: "Ramesh Kumar (Van DL-1L-4492)",
    status: "Delivered & Verified",
  },
  {
    id: "hist-2",
    date: "Sep 20, 2:15 PM",
    institution: "AIIMS Cafeteria",
    food: "Paneer Curry & Rotis (42 kg)",
    recipient: "Nizamuddin Night Shelter (130 meals)",
    receipt: "FSSAI-RELIEF-8992",
    driver: "Satish Pal (E-Rickshaw DL-4E-9021)",
    status: "Delivered & Verified",
  },
  {
    id: "hist-3",
    date: "Sep 19, 4:00 PM",
    institution: "The Oberoi Banquets",
    food: "Assorted Breads & Dal (55 kg)",
    recipient: "Sarai Kale Khan Center (160 meals)",
    receipt: "FSSAI-RELIEF-8951",
    driver: "Vikram Singh (Van DL-2C-1108)",
    status: "Delivered & Verified",
  },
];

const initialFeed: SurplusFeedItem[] = [
  {
    id: "feed-1",
    institution: "IIT Delhi Central Mess (Aravali)",
    foodType: "Dal Makhani & Steamed Rice",
    diet: "Vegetarian",
    quantityKg: 60,
    location: "Hauz Khas, New Delhi",
    distanceKm: 3.2,
    safeUntil: "5:00 PM Today",
    hoursLeft: 3.5,
    fssaiVerified: true,
    lat: 28.5459,
    lng: 77.1926,
    trafficStatus: "low",
    etaMinutes: 12,
  },
  {
    id: "feed-2",
    institution: "AIIMS Hospital Staff Cafeteria",
    foodType: "Mixed Veg Sabzi & 140 Phulkas",
    diet: "Vegetarian",
    quantityKg: 35,
    location: "Ansari Nagar, New Delhi",
    distanceKm: 4.8,
    safeUntil: "6:15 PM Today",
    hoursLeft: 4.8,
    fssaiVerified: true,
    lat: 28.5672,
    lng: 77.2100,
    trafficStatus: "moderate",
    etaMinutes: 22,
  },
  {
    id: "feed-3",
    institution: "The Oberoi Pantry & Banquet",
    foodType: "Paneer Lababdar & Jeera Rice",
    diet: "Vegetarian",
    quantityKg: 28,
    location: "Dr. Zakir Hussain Marg, New Delhi",
    distanceKm: 6.1,
    safeUntil: "7:00 PM Today",
    hoursLeft: 5.5,
    fssaiVerified: true,
    lat: 28.6024,
    lng: 77.2399,
    trafficStatus: "heavy",
    etaMinutes: 38,
  },
  {
    id: "feed-4",
    institution: "Bikanervala Central Kitchen",
    foodType: "Chana Masala & Puri",
    diet: "Vegetarian",
    quantityKg: 50,
    location: "Okhla Phase III, New Delhi",
    distanceKm: 7.4,
    safeUntil: "4:30 PM Today",
    hoursLeft: 3.0,
    fssaiVerified: true,
    lat: 28.5305,
    lng: 77.2707,
    trafficStatus: "heavy",
    etaMinutes: 45,
  },
];

function NgoDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTabFromUrl = searchParams.get("tab") || "overview";

  const { acceptedPickups, acceptNgoPickup } = useApp();
  const { t } = useLang();
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedPickup, setSelectedPickup] = useState<SurplusFeedItem | null>(null);
  const [mapMode, setMapMode] = useState<"google" | "corridor">("google");
  const [historySearch, setHistorySearch] = useState("");

  // Scheduled pickups state (with localStorage persistence)
  const [scheduledPickups, setScheduledPickups] = useState<ScheduledPickup[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("foodwise_ngo_scheduled_pickups");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_SCHEDULED_PICKUPS;
  });

  // Pickup delivery history state (with localStorage persistence)
  const [pickupHistory, setPickupHistory] = useState<PastPickupHistoryItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("foodwise_ngo_pickup_history");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_PAST_HISTORY;
  });

  // Schedule modal state
  const [scheduleModalItem, setScheduleModalItem] = useState<SurplusFeedItem | null>(null);
  const [selectedDriverIdx, setSelectedDriverIdx] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState(RELIEF_DESTINATIONS[0].name);
  const [generatedModalOtp, setGeneratedModalOtp] = useState("4821");

  // Rich success banner
  const [scheduleSuccess, setScheduleSuccess] = useState<{
    foodType: string;
    driver: string;
    otp: string;
    institution: string;
  } | null>(null);

  const handleOpenScheduleModal = (item: SurplusFeedItem) => {
    setScheduleModalItem(item);
    setGeneratedModalOtp(String(Math.floor(1000 + Math.random() * 9000)));
    setSelectedDriverIdx(0);
    setSelectedDestination(RELIEF_DESTINATIONS[0].name);
  };

  const handleScheduleConfirm = (
    item: SurplusFeedItem,
    driverIdx: number,
    destination: string,
    otp: string
  ) => {
    const driver = VOLUNTEER_DRIVERS[driverIdx] || VOLUNTEER_DRIVERS[0];
    const newPickup: ScheduledPickup = {
      id: `sched-${Date.now()}`,
      itemId: item.id,
      institution: item.institution,
      food: `${item.foodType} (${item.quantityKg} kg)`,
      destination,
      driver: `${driver.name} (${driver.vehicle})`,
      phone: driver.phone,
      otp,
      eta: `Arriving in ${item.etaMinutes} mins`,
      status: "En Route to Kitchen",
      lat: item.lat,
      lng: item.lng,
      quantityKg: item.quantityKg,
      timestamp: Date.now(),
    };

    const updated = [newPickup, ...scheduledPickups];
    setScheduledPickups(updated);
    try {
      localStorage.setItem("foodwise_ngo_scheduled_pickups", JSON.stringify(updated));
    } catch {}

    acceptNgoPickup(item.id);

    setScheduleModalItem(null);
    setScheduleSuccess({
      foodType: item.foodType,
      driver: driver.name,
      otp,
      institution: item.institution,
    });

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#10B981", "#059669", "#34D399"],
    });

    setTimeout(() => setScheduleSuccess(null), 8000);
  };

  const handleMarkDelivered = (pickup: ScheduledPickup) => {
    const newHistoryItem = {
      id: `hist-${Date.now()}`,
      date: "Just now",
      institution: pickup.institution,
      food: pickup.food,
      recipient: pickup.destination,
      receipt: `FSSAI-RELIEF-${pickup.otp}`,
      driver: pickup.driver,
      status: "Delivered & Verified",
    };

    const updatedHistory = [newHistoryItem, ...pickupHistory];
    const updatedScheduled = scheduledPickups.filter((p) => p.id !== pickup.id);

    setPickupHistory(updatedHistory);
    setScheduledPickups(updatedScheduled);

    try {
      localStorage.setItem("foodwise_ngo_pickup_history", JSON.stringify(updatedHistory));
      localStorage.setItem("foodwise_ngo_scheduled_pickups", JSON.stringify(updatedScheduled));
    } catch {}

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
      colors: ["#10B981", "#60A5FA"],
    });
  };

  const isItemAccepted = (itemId: string) => {
    return acceptedPickups.includes(itemId) || scheduledPickups.some((p) => p.itemId === itemId);
  };

  const filteredFeed = initialFeed.filter((item) => {
    if (filterType === "All") return true;
    if (filterType === "< 5 km") return item.distanceKm < 5;
    if (filterType === "> 40 kg") return item.quantityKg >= 40;
    if (filterType === "Urgent (< 4 hrs)") return item.hoursLeft <= 4;
    if (filterType === "Low Traffic") return item.trafficStatus === "low";
    return true;
  });

  const getTrafficColor = (status: string) => {
    switch (status) {
      case "low": return "#10B981";
      case "moderate": return "#F59E0B";
      case "heavy": return "#EF4444";
      default: return "#9CA3AF";
    }
  };

  const getTrafficLabel = (status: string) => {
    switch (status) {
      case "low": return t("ngo.dash.clear_roads");
      case "moderate": return t("ngo.dash.moderate_congestion");
      case "heavy": return t("ngo.dash.heavy_delays");
      default: return t("ngo.dash.unknown_traffic");
    }
  };

  const getTrafficBg = (status: string) => {
    switch (status) {
      case "low": return "#ECFDF5";
      case "moderate": return "#FFF8EB";
      case "heavy": return "#FEF2F2";
      default: return "#F9FAFB";
    }
  };

  const canDeliverInTime = (item: SurplusFeedItem) => {
    const safeMinutes = item.hoursLeft * 60;
    const bufferMinutes = 30; // 30 min buffer for loading/unloading
    return item.etaMinutes + bufferMinutes < safeMinutes;
  };

  const setTab = (newTab: string) => {
    if (newTab === "overview") {
      router.push("/ngo/dashboard");
    } else {
      router.push(`/ngo/dashboard?tab=${newTab}`);
    }
  };

  // Translate status strings at display time (stored values remain English)
  const tStatus = (s: string) => {
    const m: Record<string, string> = {
      "En Route to Kitchen": t("ngo.dash.status_en_route"),
      "Delivering to Shelter": t("ngo.dash.status_delivering"),
      "Delivered & Verified": t("ngo.dash.status_delivered"),
    };
    return m[s] || s;
  };

  // Translate ETA strings at display time
  const tEta = (s: string) => {
    const matchKitchen = s.match(/^Arriving at Kitchen in (\d+) mins$/);
    if (matchKitchen) return `${t("ngo.dash.arriving_kitchen_in")} ${matchKitchen[1]} ${t("ngo.dash.mins")}`;
    const matchArriving = s.match(/^Arriving in (\d+) mins$/);
    if (matchArriving) return `${t("ngo.dash.arriving_in")} ${matchArriving[1]} ${t("ngo.dash.mins")}`;
    if (s === "Loaded & In Transit to Shelter") return t("ngo.dash.in_transit_shelter");
    return s;
  };

  // Translate date display values
  const tDate = (s: string) => {
    if (s === "Just now") return t("common.just_now");
    return s;
  };

  // Filter options with translated labels
  const filterOptions = [
    { value: "All", label: t("ngo.dash.filter_all") },
    { value: "< 5 km", label: t("ngo.dash.filter_5km") },
    { value: "> 40 kg", label: t("ngo.dash.filter_40kg") },
    { value: "Urgent (< 4 hrs)", label: t("ngo.dash.filter_urgent") },
    { value: "Low Traffic", label: t("ngo.dash.filter_low_traffic") },
  ];

  return (
    <div className="space-y-6">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              <HeartHandshake className="w-3.5 h-3.5" />
              {t("ngo.dash.food_relief_network")}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500 font-semibold">{INSTITUTIONS.ngo.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            {activeTabFromUrl === "claims"
              ? t("ngo.dash.claims_title")
              : activeTabFromUrl === "routing"
              ? t("ngo.dash.routing_title")
              : activeTabFromUrl === "scheduled"
              ? t("ngo.dash.scheduled_title")
              : activeTabFromUrl === "history"
              ? t("ngo.dash.history_title")
              : t("ngo.dash.overview_title")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {t("ngo.dash.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
            <span className="w-2 h-2 rounded-full animate-pulse bg-emerald-500" />
            <span>{INSTITUTIONS.ngo.volunteers}</span>
          </div>
        </div>
      </div>

      {/* SECTION NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 text-xs font-bold">
        {[
          { id: "overview", label: t("ngo.dash.tab_overview"), icon: Layers },
          { id: "claims", label: `${t("ngo.dash.tab_live_claims")} (${initialFeed.length})`, icon: PackageCheck, badge: t("ngo.dash.badge_live") },
          { id: "routing", label: t("ngo.dash.tab_traffic_routing"), icon: Route },
          { id: "scheduled", label: `${t("ngo.dash.tab_scheduled_pickups")} (${scheduledPickups.length})`, icon: Truck },
          { id: "history", label: `${t("ngo.dash.tab_pickup_history")} (${pickupHistory.length})`, icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTabFromUrl === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && !isActive && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {scheduleSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-900">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <div>
              <span>
                {t("ngo.dash.pickup_success_for")} <strong>{scheduleSuccess.foodType}</strong> ({scheduleSuccess.institution})!
              </span>
              <p className="text-[11px] font-normal text-emerald-700 mt-0.5">
                {t("ngo.driver")} <strong>{scheduleSuccess.driver}</strong> {t("ngo.dash.dispatched_otp")}{" "}
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                  {scheduleSuccess.otp}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setTab("scheduled")}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
          >
            <span>{t("ngo.dash.view_in_scheduled")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTabFromUrl === "overview" && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="stat-card stat-card-green p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-gray-500">{t("ngo.available_surplus")}</span>
                <div className="icon-container icon-container-green"><Utensils className="w-5 h-5" /></div>
              </div>
              <div>
                <div className="text-[28px] font-extrabold font-mono-data text-gray-900 leading-none mb-1.5">{initialFeed.length} {t("ngo.dash.batches")}</div>
                <div className="text-[12px] font-medium text-emerald-600">173 {t("ngo.dash.verified_food_desc")}</div>
              </div>
            </div>

            <div className="stat-card stat-card-amber p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-gray-500">{t("ngo.dash.urgent_label")}</span>
                <div className="icon-container icon-container-amber"><Timer className="w-5 h-5" /></div>
              </div>
              <div>
                <div className="text-[28px] font-extrabold font-mono-data text-gray-900 leading-none mb-1.5">
                  {initialFeed.filter((i) => i.hoursLeft <= 4).length} {t("ngo.dash.batches")}
                </div>
                <div className="text-[12px] font-medium text-amber-600">{t("ngo.dash.rapid_dispatch")}</div>
              </div>
            </div>

            <div className="stat-card stat-card-emerald p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-gray-500">{t("ngo.dash.clear_routes")}</span>
                <div className="icon-container icon-container-green"><Navigation className="w-5 h-5" /></div>
              </div>
              <div>
                <div className="text-[28px] font-extrabold font-mono-data text-gray-900 leading-none mb-1.5">
                  {initialFeed.filter((i) => i.trafficStatus === "low").length} {t("ngo.dash.routes")}
                </div>
                <div className="text-[12px] font-medium text-emerald-600">{t("ngo.dash.fast_transit")}</div>
              </div>
            </div>

            <div className="stat-card stat-card-red p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-gray-500">{t("ngo.dash.traffic_risk_flag")}</span>
                <div className="icon-container icon-container-red"><AlertTriangle className="w-5 h-5" /></div>
              </div>
              <div>
                <div className="text-[28px] font-extrabold font-mono-data text-gray-900 leading-none mb-1.5">
                  {initialFeed.filter((i) => !canDeliverInTime(i)).length} {t("ngo.dash.high_risk")}
                </div>
                <div className="text-[12px] font-medium text-rose-600">{t("ngo.dash.heavy_congestion")}</div>
              </div>
            </div>
          </div>

          {/* Quick Split: Map + Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-emerald-600" />
                      {t("ngo.dash.traffic_map_title")}
                    </h3>
                    <p className="text-xs text-gray-500">{t("ngo.dash.traffic_map_desc")}</p>
                  </div>
                  {/* Merged 2-mode selector */}
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setMapMode("google")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        mapMode === "google" ? "bg-white text-emerald-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {t("ngo.dash.google_maps_live")}
                    </button>
                    <button
                      onClick={() => setMapMode("corridor")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        mapMode === "corridor" ? "bg-white text-emerald-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {t("ngo.dash.interactive_route")}
                    </button>
                  </div>
                </div>

                {mapMode === "google" ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 h-80">
                    <iframe
                      src={`https://maps.google.com/maps?saddr=28.5459,77.1926&daddr=${
                        selectedPickup ? `${selectedPickup.lat},${selectedPickup.lng}` : "28.5672,77.2100"
                      }&layer=t&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Google Maps Live Directions & Traffic"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {selectedPickup ? `${t("ngo.dash.route_to")} ${selectedPickup.institution}` : t("ngo.dash.google_traffic_active")}
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-80 p-4">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                      }}
                    />
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 320">
                      <line x1="50" y1="160" x2="550" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                      <line x1="300" y1="20" x2="300" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                      <ellipse cx="300" cy="160" rx="180" ry="110" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                      <line x1="300" y1="160" x2="160" y2="220" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
                      <line x1="300" y1="160" x2="230" y2="90" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                      <line x1="300" y1="160" x2="440" y2="80" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
                      <line x1="300" y1="160" x2="460" y2="240" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
                    </svg>

                    <div className="absolute left-[47%] top-[45%] flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg">
                        <HeartHandshake className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[9px] font-black text-white bg-black/70 px-1.5 py-0.5 rounded mt-0.5">{t("ngo.dash.ngo_hub")}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm p-2 rounded-xl text-[10px] text-white space-y-1">
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 rounded-full bg-emerald-400" /> Hauz Khas: 12 {t("ngo.dash.mins")} ({t("ngo.dash.clear_label")})</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 rounded-full bg-amber-400" /> AIIMS: 22 {t("ngo.dash.mins")} ({t("ngo.dash.moderate_label")})</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 rounded-full bg-rose-500" /> Oberoi / Okhla: 38-45 {t("ngo.dash.mins")} ({t("ngo.dash.heavy_traffic_label")})</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Claims Feed (Right 5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900">{t("ngo.dash.urgent_food_title")}</h3>
                <button onClick={() => setTab("claims")} className="text-xs font-bold text-emerald-600 hover:underline">
                  {t("ngo.dash.view_all")} ({initialFeed.length}) →
                </button>
              </div>

              <div className="space-y-2.5">
                {initialFeed.slice(0, 3).map((item) => {
                  const safe = canDeliverInTime(item);
                  const isAccepted = isItemAccepted(item.id);
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 transition-all shadow-xs flex items-center justify-between gap-3 overflow-hidden"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-900 truncate">{item.institution}</span>
                          <span className="shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono-data">
                            {item.quantityKg} kg
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.foodType}</p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1 truncate">
                          <span style={{ color: getTrafficColor(item.trafficStatus) }} className="shrink-0 font-medium">
                            ● {item.etaMinutes}{t("ngo.dash.m_eta")} ({getTrafficLabel(item.trafficStatus)})
                          </span>
                          <span className="shrink-0">•</span>
                          <span className="truncate">{t("ngo.dash.safe_until_colon")} {item.safeUntil}</span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        {isAccepted ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-bold text-emerald-700 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-1 whitespace-nowrap">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {t("ngo.dash.dispatched")}
                            </span>
                            <button
                              onClick={() => setTab("scheduled")}
                              className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer p-1"
                              title="View scheduled delivery"
                            >
                              {t("ngo.dash.view_arrow")}
                            </button>
                          </div>
                        ) : safe ? (
                          <button
                            onClick={() => handleOpenScheduleModal(item)}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1 whitespace-nowrap shrink-0"
                          >
                            <Truck className="w-3.5 h-3.5 shrink-0" /> {t("ngo.dash.claim")}
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-600 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 whitespace-nowrap shrink-0">
                            {t("ngo.dash.traffic_risk")}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEDICATED LIVE FOOD CLAIMS */}
      {activeTabFromUrl === "claims" && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-gray-200 rounded-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-400" />
              {filterOptions.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterType(f.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterType === f.value
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="text-xs font-semibold text-gray-500">
              {t("ngo.dash.showing")} {filteredFeed.length} {t("ngo.dash.verified_items")}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFeed.map((item) => {
              const isAccepted = isItemAccepted(item.id);
              const safe = canDeliverInTime(item);

              return (
                <div
                  key={item.id}
                  className="card p-5 bg-white border border-gray-200 hover:border-emerald-300 transition-all rounded-2xl shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-gray-900">{item.institution}</h3>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {item.diet}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {item.location} ({item.distanceKm} {t("ngo.dash.km_away")})
                      </p>
                    </div>

                    <span className="text-right">
                      <span className="text-xl font-black font-mono-data text-emerald-700 block">
                        {item.quantityKg} kg
                      </span>
                      <span className="text-[10px] text-gray-400">~{Math.round(item.quantityKg * 3.2)} {t("ngo.dash.meals")}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                    <span className="text-gray-400 block text-[11px] mb-0.5">{t("ngo.dash.food_desc_label")}</span>
                    <strong className="text-gray-900 font-semibold">{item.foodType}</strong>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-gray-400 block text-[10px]">{t("ngo.dash.safe_until")}</span>
                      <span className="font-bold text-gray-800">{item.safeUntil}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-gray-400 block text-[10px]">{t("ngo.dash.traffic_eta")}</span>
                      <span className="font-bold font-mono-data" style={{ color: getTrafficColor(item.trafficStatus) }}>
                        {item.etaMinutes} {t("ngo.dash.mins")}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-gray-400 block text-[10px]">{t("ngo.dash.transit_margin")}</span>
                      <span className={`font-bold ${safe ? "text-emerald-600" : "text-rose-600"}`}>
                        {safe ? t("ngo.dash.safe_window") : t("ngo.dash.high_risk_label")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=28.5459,77.1926&destination=${item.lat},${item.lng}&travelmode=driving`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> {t("ngo.dash.google_directions")}
                    </a>

                    {isAccepted ? (
                      <div className="flex items-center gap-2">
                        <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t("ngo.dash.claimed_scheduled")}
                        </span>
                        <button
                          onClick={() => setTab("scheduled")}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-300 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>{t("ngo.dash.view_pickup")}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : safe ? (
                      <button
                        onClick={() => handleOpenScheduleModal(item)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                      >
                        <Truck className="w-4 h-4" /> {t("ngo.dash.claim_batch")}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-200 text-gray-500 cursor-not-allowed"
                      >
                        {t("ngo.dash.high_congestion_risk")}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DEDICATED TRAFFIC & SAFE ROUTING */}
      {activeTabFromUrl === "routing" && (
        <div className="space-y-5">
          <div className="card p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                  <Route className="w-5 h-5 text-emerald-600" />
                  {t("ngo.dash.corridor_title")}
                </h3>
                <p className="text-xs text-gray-500">
                  {t("ngo.dash.corridor_desc")}
                </p>
              </div>

              {/* Mode switch */}
              <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-xl">
                <button
                  onClick={() => setMapMode("google")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mapMode === "google" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t("ngo.dash.google_satellite")}
                </button>
                <button
                  onClick={() => setMapMode("corridor")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mapMode === "corridor" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t("ngo.dash.interactive_corridor")}
                </button>
              </div>
            </div>

            {/* Map Area */}
            {mapMode === "google" ? (
              <div className="relative rounded-2xl overflow-hidden border border-gray-300 bg-gray-100 h-96">
                <iframe
                  src="https://maps.google.com/maps?saddr=28.5459,77.1926&daddr=28.5672,77.2100&layer=t&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Live Routing"
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-96 p-4">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 360">
                  <line x1="50" y1="180" x2="550" y2="180" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                  <line x1="300" y1="30" x2="300" y2="330" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                  <ellipse cx="300" cy="180" rx="200" ry="120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <line x1="300" y1="180" x2="160" y2="240" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
                  <line x1="300" y1="180" x2="230" y2="100" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
                  <line x1="300" y1="180" x2="440" y2="90" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
                  <line x1="300" y1="180" x2="470" y2="260" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
                </svg>

                <div className="absolute left-[47%] top-[45%] flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xl">
                    <HeartHandshake className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-black text-white bg-black/70 px-2 py-0.5 rounded mt-1">{t("ngo.dash.ngo_hub")}</span>
                </div>

                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-3 rounded-2xl text-xs text-white space-y-1.5 border border-white/10">
                  <div className="font-bold text-emerald-400 mb-1">{t("ngo.dash.congestion_feed")}</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-2 rounded-full bg-emerald-400" /> Hauz Khas: 12 {t("ngo.dash.mins")} {t("ngo.dash.margin_prefix")} +150 {t("ngo.dash.min_buffer")}</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-2 rounded-full bg-amber-400" /> AIIMS Flyover: 22 {t("ngo.dash.mins")} {t("ngo.dash.margin_prefix")} +230 {t("ngo.dash.min_buffer")}</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-2 rounded-full bg-rose-500" /> Mathura Road / Okhla: 45 {t("ngo.dash.mins")} ({t("ngo.dash.deficit_risk")})</div>
                </div>
              </div>
            )}

            {/* Corridor Safety Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {initialFeed.map((item) => {
                const safe = canDeliverInTime(item);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 truncate">{item.institution.split(" ")[0]}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: getTrafficBg(item.trafficStatus), color: getTrafficColor(item.trafficStatus) }}>
                        {item.etaMinutes}{t("ngo.dash.m_eta")}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {safe ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t("ngo.dash.safe_dispatch")}
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> {t("ngo.dash.delay_risk")}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DEDICATED SCHEDULED PICKUPS */}
      {activeTabFromUrl === "scheduled" && (
        <div className="space-y-4">
          <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  {t("ngo.dash.active_transit")} ({scheduledPickups.length})
                </h3>
                <p className="text-xs text-gray-500">
                  {t("ngo.dash.active_transit_desc")}
                </p>
              </div>

              <button
                onClick={() => setTab("claims")}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PackageCheck className="w-4 h-4" />
                <span>{t("ngo.dash.claim_more")}</span>
              </button>
            </div>

            {scheduledPickups.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-2xl space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Truck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">{t("ngo.dash.no_pickups")}</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  {t("ngo.dash.no_pickups_desc")}
                </p>
                <button
                  onClick={() => setTab("claims")}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer transition-all"
                >
                  {t("ngo.dash.browse_claims")}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledPickups.map((pickup) => (
                  <div
                    key={pickup.id}
                    className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:shadow-sm transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-gray-200">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {tStatus(pickup.status)}
                          </span>
                          <span className="text-xs text-gray-400 font-mono-data">• {tEta(pickup.eta)}</span>
                        </div>
                        <h4 className="font-extrabold text-base text-gray-900 mt-1">{pickup.institution}</h4>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono-data bg-gray-900 text-white px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs">
                          <Key className="w-3.5 h-3.5 text-amber-400" />
                          {t("ngo.dash.handover_otp")} <strong className="text-amber-400 text-sm">{pickup.otp}</strong>
                        </span>

                        <button
                          onClick={() => handleMarkDelivered(pickup)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t("ngo.dash.mark_delivered")}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-gray-100">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">{t("ngo.dash.food_batch")}</span>
                        <span className="font-semibold text-gray-900">{pickup.food}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-gray-100">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">{t("ngo.dash.dest_shelter")}</span>
                        <span className="font-semibold text-gray-900">{pickup.destination}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-gray-100">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">{t("ngo.dash.volunteer_driver")}</span>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">{pickup.driver}</span>
                          <a
                            href={`tel:${pickup.phone}`}
                            className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1 ml-1"
                          >
                            <Phone className="w-3 h-3" /> {t("ngo.dash.call")}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=28.5459,77.1926&destination=${pickup.lat || 28.5672},${pickup.lng || 77.2100}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 font-bold hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> {t("ngo.dash.open_directions")}
                      </a>
                      <span className="text-gray-400 text-[11px]">
                        {t("ngo.dash.driver_verified")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: DEDICATED PICKUP HISTORY & RECEIPTS */}
      {activeTabFromUrl === "history" && (
        <div className="space-y-4">
          <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  {t("ngo.dash.completed_title")} ({pickupHistory.length})
                </h3>
                <p className="text-xs text-gray-500">{t("ngo.dash.completed_desc")}</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("ngo.dash.search_placeholder")}
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              {pickupHistory
                .filter(
                  (h) =>
                    h.institution.toLowerCase().includes(historySearch.toLowerCase()) ||
                    h.recipient.toLowerCase().includes(historySearch.toLowerCase()) ||
                    h.receipt.toLowerCase().includes(historySearch.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">{item.institution}</span>
                        <span className="text-[10px] font-mono-data font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {item.receipt}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">{item.food} ➔ {item.recipient}</div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        {t("ngo.dash.delivered_on")} {tDate(item.date)} {t("ngo.dash.by")} {item.driver}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t("ngo.dash.verified_delivered")}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE PICKUP MODAL */}
      {scheduleModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  {t("ngo.dash.modal_title")}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t("ngo.dash.modal_desc")}
                </p>
              </div>
              <button
                onClick={() => setScheduleModalItem(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Food item preview */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-gray-900">{scheduleModalItem.institution}</span>
                <span className="text-xs font-black font-mono-data text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                  {scheduleModalItem.quantityKg} kg (~{Math.round(scheduleModalItem.quantityKg * 3.2)} {t("ngo.dash.meals")})
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-950">{scheduleModalItem.foodType}</p>
              <div className="flex items-center gap-3 text-[11px] text-gray-500 pt-1">
                <span>📍 {scheduleModalItem.location}</span>
                <span>•</span>
                <span>⏳ {t("ngo.dash.safe_until_colon")} {scheduleModalItem.safeUntil}</span>
              </div>
            </div>

            {/* Driver Assignment */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>{t("ngo.dash.assign_driver")}</span>
                <span className="text-[11px] font-normal text-emerald-600">{t("ngo.dash.active_fleet")}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VOLUNTEER_DRIVERS.map((driver, idx) => (
                  <button
                    type="button"
                    key={driver.name}
                    onClick={() => setSelectedDriverIdx(idx)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedDriverIdx === idx
                        ? "border-emerald-600 bg-emerald-50/60 shadow-xs"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="font-bold text-xs text-gray-900">{driver.name}</div>
                    <div className="text-[11px] text-gray-500">{driver.vehicle}</div>
                    <div className="text-[10px] text-emerald-700 mt-1 font-mono-data">{driver.phone}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Shelter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                {t("ngo.dash.dest_label")}
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {RELIEF_DESTINATIONS.map((dest) => (
                  <option key={dest.name} value={dest.name}>
                    {dest.name} ({t("ngo.dash.capacity_label")} {dest.capacity})
                  </option>
                ))}
              </select>
            </div>

            {/* OTP & Summary Note */}
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">{t("ngo.dash.auto_otp")}</span>
                <span className="text-xs text-gray-600">{t("ngo.dash.otp_instruction")}</span>
              </div>
              <span className="text-base font-black font-mono-data bg-gray-900 text-amber-400 px-3 py-1 rounded-xl tracking-wider">
                {generatedModalOtp}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setScheduleModalItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleScheduleConfirm(scheduleModalItem, selectedDriverIdx, selectedDestination, generatedModalOtp);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Truck className="w-4 h-4" />
                <span>{t("ngo.dash.confirm_dispatch")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NgoDashboardPage() {
  const { t } = useLang();
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">{t("ngo.dash.loading")}</div>}>
      <NgoDashboardContent />
    </Suspense>
  );
}
