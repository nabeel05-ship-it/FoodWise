"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { FACTORY_STORAGE_UNITS } from "@/lib/mockData";
import {
  ThermometerSnowflake,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Activity,
  Wind,
  ShieldAlert,
  Flame,
  Clock,
  RefreshCw,
  Sliders,
  Sparkles,
  Camera,
  Scale,
  FlaskConical,
  Eye,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Cpu,
  Info,
  Check,
  AlertCircle,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── 1. PRODUCE-SPECIFIC CONFIGURABLE PROFILES ─────────────────────────────
export type ProduceType = "tomato" | "potato" | "mango" | "onion" | "carrot";

interface ProduceProfileConfig {
  id: ProduceType;
  name: string;
  variety: string;
  icon: string;
  storageUnitId: string;
  activeParametersSummary: string;
  idealTempMin: number;
  idealTempMax: number;
  idealHumidityMin: number;
  idealHumidityMax: number;
  hasPh: boolean;
  idealPhMin?: number;
  idealPhMax?: number;
  weightLossThreshold: number; // max acceptable % loss
  visionParams: { key: string; label: string; unit: string }[];
  batches: {
    batchCode: string;
    description: string;
    isWarning: boolean;
    temp: number;
    humidity: number;
    ph?: number;
    weightLossPct: number;
    visionScores: Record<string, number>; // key -> value percentage
    stockKg: number;
    ageDays: number;
    shelfLifeDisplay: string;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    qualityScore: number;
    recommendation: "Continue Storage" | "Monitor Closely" | "Prioritize Processing" | "Immediate Processing" | "Quality Inspection Required";
    insightText: string;
  }[];
}

const PRODUCE_PROFILES: Record<ProduceType, ProduceProfileConfig> = {
  tomato: {
    id: "tomato",
    name: "Tomato",
    variety: "Roma VF / Processing Grade A",
    icon: "🍅",
    storageUnitId: "unit-b",
    activeParametersSummary: "Temperature • Humidity • pH • Weight Loss • Visual Quality (Ripeness & Surface Defect)",
    idealTempMin: 7,
    idealTempMax: 10,
    idealHumidityMin: 88,
    idealHumidityMax: 95,
    hasPh: true,
    idealPhMin: 4.2,
    idealPhMax: 4.6,
    weightLossThreshold: 2.5,
    visionParams: [
      { key: "ripeness", label: "Ripeness Index", unit: "%" },
      { key: "surfaceDefect", label: "Surface Softening / Defect", unit: "%" },
    ],
    batches: [
      {
        batchCode: "TOM-2024-0234",
        description: "Cold Storage Unit B — Thermal Drift Excursion",
        isWarning: true,
        temp: 13.1, // High
        humidity: 87, // Slightly Low
        ph: 4.65, // Rising pH indicates microbial softening
        weightLossPct: 3.4, // Above 2.5% threshold
        visionScores: { ripeness: 88, surfaceDefect: 8.2 },
        stockKg: 3200,
        ageDays: 6,
        shelfLifeDisplay: "31 Hours",
        riskLevel: "HIGH",
        qualityScore: 54,
        recommendation: "Prioritize Processing",
        insightText:
          "Thermal drift (+3.1°C) combined with elevated weight loss (3.4%) and 8.2% visible surface softening indicates rapid pectolytic breakdown. Spoilage cutoff predicted in 31 hours. AI recommends immediate rerouting to Ketchup Line 2.",
      },
      {
        batchCode: "TOM-2041-A",
        description: "Intake Bay 2 — Controlled Fresh Harvest",
        isWarning: false,
        temp: 8.4,
        humidity: 92,
        ph: 4.38,
        weightLossPct: 1.1,
        visionScores: { ripeness: 74, surfaceDefect: 1.5 },
        stockKg: 5000,
        ageDays: 2,
        shelfLifeDisplay: "7 Days",
        riskLevel: "LOW",
        qualityScore: 92,
        recommendation: "Continue Storage",
        insightText:
          "Tomato batch TOM-2041-A is in prime physiological condition. Cell turgor pressure is intact, pH is optimal at 4.38, and surface integrity is 98.5% defect-free. Maintain current cold parameters.",
      },
    ],
  },
  potato: {
    id: "potato",
    name: "Potato",
    variety: "Kufri Chipsona (Low Sugar Processing)",
    icon: "🥔",
    storageUnitId: "unit-a",
    activeParametersSummary: "Temperature • Humidity • pH • Weight Loss • Sprouting • Rot & Blight",
    idealTempMin: 4,
    idealTempMax: 8,
    idealHumidityMin: 88,
    idealHumidityMax: 95,
    hasPh: true,
    idealPhMin: 5.6,
    idealPhMax: 6.2,
    weightLossThreshold: 2.0,
    visionParams: [
      { key: "sprouting", label: "Sprouting / Bud Emergence", unit: "%" },
      { key: "rot", label: "Soft Rot / Blight Defect", unit: "%" },
    ],
    batches: [
      {
        batchCode: "POT-2024-1182",
        description: "Cold Storage Unit A — Chipsona Batch 1",
        isWarning: false,
        temp: 6.2,
        humidity: 92,
        ph: 5.85,
        weightLossPct: 1.4,
        visionScores: { sprouting: 0.4, rot: 0.1 },
        stockKg: 6400,
        ageDays: 12,
        shelfLifeDisplay: "18 Days",
        riskLevel: "LOW",
        qualityScore: 91,
        recommendation: "Continue Storage",
        insightText:
          "Potato batch POT-2024-1182 is physiologically stable. Cold holding at 6.2°C prevents sugar accumulation for potato crisps while CIPC dormancy suppresses sprout growth (<0.5%).",
      },
      {
        batchCode: "POT-2024-1094",
        description: "Cold Storage Unit A — Sub-Quadrant 3 Condensation",
        isWarning: true,
        temp: 9.4,
        humidity: 96,
        ph: 6.35,
        weightLossPct: 2.2,
        visionScores: { sprouting: 3.8, rot: 2.4 },
        stockKg: 4100,
        ageDays: 22,
        shelfLifeDisplay: "5 Days",
        riskLevel: "MEDIUM",
        qualityScore: 68,
        recommendation: "Monitor Closely",
        insightText:
          "Slight condensation in sub-quadrant A3 has increased humidity to 96%, triggering 3.8% eye sprout emergence. Sugar conversion risk is rising. Queue for dehydration line within 48-72 hours.",
      },
    ],
  },
  mango: {
    id: "mango",
    name: "Mango",
    variety: "Totapuri Pulping Grade",
    icon: "🥭",
    storageUnitId: "unit-d",
    activeParametersSummary: "Temperature • Humidity • pH • Weight Loss • Ripeness • Color Development",
    idealTempMin: 11,
    idealTempMax: 13,
    idealHumidityMin: 85,
    idealHumidityMax: 90,
    hasPh: true,
    idealPhMin: 4.0,
    idealPhMax: 4.8,
    weightLossThreshold: 3.0,
    visionParams: [
      { key: "ripeness", label: "Pulp Softening / Ripeness", unit: "%" },
      { key: "color", label: "Skin Color Uniformity (Brix)", unit: "%" },
    ],
    batches: [
      {
        batchCode: "MAN-2024-0512",
        description: "Controlled Ripening Chamber 2",
        isWarning: false,
        temp: 12.2,
        humidity: 88,
        ph: 4.45,
        weightLossPct: 2.1,
        visionScores: { ripeness: 82, color: 89 },
        stockKg: 4800,
        ageDays: 4,
        shelfLifeDisplay: "4 Days",
        riskLevel: "LOW",
        qualityScore: 89,
        recommendation: "Continue Storage",
        insightText:
          "Mango batch MAN-2024-0512 has reached 82% pulping ripeness with uniform carotene coloration. Acidity and Brix ratios are optimal for aseptic mango puree processing.",
      },
      {
        batchCode: "MAN-2024-0498",
        description: "Intake Staging Line — High Ethylene Exposure",
        isWarning: true,
        temp: 15.8,
        humidity: 82,
        ph: 4.95,
        weightLossPct: 4.2,
        visionScores: { ripeness: 96, color: 94 },
        stockKg: 2900,
        ageDays: 8,
        shelfLifeDisplay: "18 Hours",
        riskLevel: "HIGH",
        qualityScore: 48,
        recommendation: "Immediate Processing",
        insightText:
          "Over-ripening detected. Ripeness is at 96% with high skin translucency. Ethylene release has accelerated senescent breakdown. Immediate pulping required to salvage 2,500 kg.",
      },
    ],
  },
  onion: {
    id: "onion",
    name: "Onion",
    variety: "Red Nashik Storage Bulbs",
    icon: "🧅",
    storageUnitId: "unit-c",
    activeParametersSummary: "Temperature • Humidity • Weight Loss • Basal Sprouting • Neck Rot & Mold",
    idealTempMin: 15,
    idealTempMax: 20,
    idealHumidityMin: 60,
    idealHumidityMax: 70,
    hasPh: false, // Onions judged by cure, scales, rot rather than juice pH
    weightLossThreshold: 2.5,
    visionParams: [
      { key: "sprouting", label: "Basal Plate Sprouting", unit: "%" },
      { key: "rot", label: "Black Mold / Neck Rot", unit: "%" },
    ],
    batches: [
      {
        batchCode: "ONI-2024-0941",
        description: "Ambient Ventilated Unit C — Stack 4",
        isWarning: false,
        temp: 18.4,
        humidity: 65,
        weightLossPct: 1.2,
        visionScores: { sprouting: 0.2, rot: 0.1 },
        stockKg: 4300,
        ageDays: 14,
        shelfLifeDisplay: "24 Days",
        riskLevel: "LOW",
        qualityScore: 94,
        recommendation: "Continue Storage",
        insightText:
          "Onion batch ONI-2024-0941 shows tight dry outer papery tunic scales. Humidity of 65% is optimal to inhibit Aspergillus niger mold. Sprout dormancy is 100% stable.",
      },
      {
        batchCode: "ONI-2024-0899",
        description: "Unit C — Near Humid Evaporator Return",
        isWarning: true,
        temp: 21.2,
        humidity: 78,
        weightLossPct: 3.1,
        visionScores: { sprouting: 4.2, rot: 3.8 },
        stockKg: 3100,
        ageDays: 28,
        shelfLifeDisplay: "6 Days",
        riskLevel: "MEDIUM",
        qualityScore: 65,
        recommendation: "Monitor Closely",
        insightText:
          "Excessive relative humidity (78%) near the evaporator return has softened neck tissues, promoting 3.8% fungal mold spores. Recommend drying cycle or fast-tracking to Onion Powder line.",
      },
    ],
  },
  carrot: {
    id: "carrot",
    name: "Carrot",
    variety: "Kuroda Deep Orange (Dehydration Grade)",
    icon: "🥕",
    storageUnitId: "unit-a",
    activeParametersSummary: "Temperature • Humidity • pH • Weight Loss • Color Saturation • Surface Wilting",
    idealTempMin: 1,
    idealTempMax: 4,
    idealHumidityMin: 92,
    idealHumidityMax: 98,
    hasPh: true,
    idealPhMin: 5.8,
    idealPhMax: 6.4,
    weightLossThreshold: 2.0,
    visionParams: [
      { key: "color", label: "Carotene Color Depth", unit: "%" },
      { key: "wilting", label: "Root Wilting / Flaccidity", unit: "%" },
    ],
    batches: [
      {
        batchCode: "CAR-2024-0318",
        description: "Hydrocooled Deep Storage Bin 3",
        isWarning: false,
        temp: 2.6,
        humidity: 95,
        ph: 6.12,
        weightLossPct: 0.8,
        visionScores: { color: 94, wilting: 0.6 },
        stockKg: 5200,
        ageDays: 5,
        shelfLifeDisplay: "21 Days",
        riskLevel: "LOW",
        qualityScore: 93,
        recommendation: "Continue Storage",
        insightText:
          "Carrot batch CAR-2024-0318 maintains peak cellular crispness. High relative humidity (95%) prevents root desiccation and lignin hardening. Carotene pigment saturation is excellent at 94%.",
      },
      {
        batchCode: "CAR-2024-0290",
        description: "Buffer Staging Cold Dock",
        isWarning: true,
        temp: 5.8,
        humidity: 84,
        ph: 6.55,
        weightLossPct: 3.6,
        visionScores: { color: 82, wilting: 6.4 },
        stockKg: 2400,
        ageDays: 14,
        shelfLifeDisplay: "4 Days",
        riskLevel: "HIGH",
        qualityScore: 61,
        recommendation: "Prioritize Processing",
        insightText:
          "Low humidity (84%) has caused 3.6% moisture loss, resulting in 6.4% root flaccidity and surface wrinkling. Reroute to Vegetable Dehydration Line 3 before irreversible fibrous degradation occurs.",
      },
    ],
  },
};

// 24-hour temperature trend dataset
const HOURLY_TEMP_TREND = [
  { time: "00:00", unitA: 6.1, unitB: 9.8, unitC: 18.2 },
  { time: "04:00", unitA: 6.0, unitB: 10.4, unitC: 18.0 },
  { time: "08:00", unitA: 6.2, unitB: 11.6, unitC: 18.3 },
  { time: "12:00", unitA: 6.5, unitB: 13.1, unitC: 18.5 },
  { time: "16:00", unitA: 6.3, unitB: 12.9, unitC: 18.4 },
  { time: "20:00", unitA: 6.2, unitB: 13.1, unitC: 18.4 },
];

export default function StorageMonitorPage() {
  const { t } = useLang();
  const { isBatchPrioritized, prioritizeBatch } = useApp();

  // Selected produce and batch
  const [selectedProduce, setSelectedProduce] = useState<ProduceType>("tomato");
  const [selectedBatchCode, setSelectedBatchCode] = useState<string>("TOM-2024-0234");
  const [chillTriggered, setChillTriggered] = useState(false);
  const [manualScanRunning, setManualScanRunning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Active configuration
  const currentProfile = PRODUCE_PROFILES[selectedProduce];
  const activeBatch =
    currentProfile.batches.find((b) => b.batchCode === selectedBatchCode) ||
    currentProfile.batches[0];

  const handleSelectProduce = (type: ProduceType) => {
    setSelectedProduce(type);
    setSelectedBatchCode(PRODUCE_PROFILES[type].batches[0].batchCode);
  };

  const handleTriggerBlastChill = () => {
    setChillTriggered(true);
    setTimeout(() => setChillTriggered(false), 4000);
  };

  const handleTriggerManualVisionScan = () => {
    setManualScanRunning(true);
    setTimeout(() => {
      setManualScanRunning(false);
      setScanMessage(`${t("factory.storage.vision_complete")} ${activeBatch.batchCode}. ${t("factory.storage.patches_validated")}`);
      setTimeout(() => setScanMessage(null), 4000);
    }, 1400);
  };

  // Helper color for recommendation badge
  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case "Continue Storage":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: CheckCircle2,
        };
      case "Monitor Closely":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: AlertTriangle,
        };
      case "Prioritize Processing":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-200",
          icon: Flame,
        };
      case "Immediate Processing":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          icon: ShieldAlert,
        };
      default:
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: Info,
        };
    }
  };

  const recBadge = getRecommendationBadge(activeBatch.recommendation);
  const RecIcon = recBadge.icon;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {scanMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#10B981] text-white px-4 py-3 rounded-xl shadow-xl text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          {scanMessage}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {t("factory.storage.adaptive_monitor")}
            </span>
            <span className="text-[#D1D5DB]">•</span>
            <span className="text-xs text-[#9CA3AF]">{t("factory.storage.plant_id")}</span>
            <span className="text-[#D1D5DB]">•</span>
            {/* Simulation Mode Badge */}
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              {t("factory.storage.simulation_mode")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
            {t("factory.storage.title")}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            {t("factory.storage.description")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/factory/spoilage"
            className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            {t("factory.storage.spoilage_engine_link")}
          </Link>
        </div>
      </div>

      {/* ─── PRODUCE & BATCH SELECTOR TOOLBAR ─────────────────────────────── */}
      <div className="card p-4 sm:p-5 bg-white border border-[#E8ECF3] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Produce selector tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              {t("factory.storage.step1_label")}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(PRODUCE_PROFILES) as ProduceType[]).map((type) => {
                const p = PRODUCE_PROFILES[type];
                const isActive = selectedProduce === type;
                return (
                  <button
                    key={type}
                    onClick={() => handleSelectProduce(type)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                      isActive
                        ? "bg-[#10B981] text-white border-[#10B981] shadow-xs"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                    }`}
                  >
                    <span className="text-base">{p.icon}</span>
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Batch selector dropdown */}
          <div className="space-y-1.5 min-w-[280px]">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              {t("factory.storage.step2_label")}
            </label>
            <select
              value={selectedBatchCode}
              onChange={(e) => setSelectedBatchCode(e.target.value)}
              className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {currentProfile.batches.map((b) => (
                <option key={b.batchCode} value={b.batchCode}>
                  {b.batchCode} — {b.description} ({b.riskLevel} {t("factory.storage.risk")})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CORE INNOVATION CALLOUT: AI ADAPTIVE QUALITY PROFILE */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded text-[10px]">
              {t("factory.storage.adaptive_profile")}
            </span>
            <span className="font-bold text-gray-900">
              {currentProfile.name} ({currentProfile.variety})
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 hidden md:inline">
              {t("factory.storage.parameters")}: <span className="font-mono-data font-semibold text-emerald-700">{currentProfile.activeParametersSummary}</span>
            </span>
          </div>

          <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-gray-400" />
            <span>{t("factory.storage.params_adjust")}</span>
          </div>
        </div>
      </div>

      {/* ─── MAIN 3-SECTION EVALUATION GRID ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* SECTION 1: STORAGE CONDITIONS (4 cols) */}
        <div className="lg:col-span-4 card p-6 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="section-title flex items-center gap-2">
                  <ThermometerSnowflake className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{t("factory.storage.storage_conditions")}</span>
                </h3>
                <p className="section-subtitle truncate">{t("factory.storage.realtime_microclimate")}</p>
              </div>
              <span className="text-[10px] font-mono-data font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded shrink-0">
                {t("factory.storage.iot_sensor")}
              </span>
            </div>

            {/* Temperature Sensor Card */}
            <div className="p-3.5 rounded-xl bg-[#FAFBFC] border border-[#E8ECF3] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">{t("factory.storage.temperature")}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono-data ${
                  activeBatch.temp > currentProfile.idealTempMax || activeBatch.temp < currentProfile.idealTempMin
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {activeBatch.temp > currentProfile.idealTempMax
                  ? t("factory.storage.excursion_high")
                  : activeBatch.temp < currentProfile.idealTempMin
                  ? t("factory.storage.excursion_low")
                  : t("factory.storage.normal")}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-black font-mono-data ${
                  activeBatch.temp > currentProfile.idealTempMax
                    ? "text-amber-600"
                    : "text-[#111827]"
                }`}
              >
                {activeBatch.temp.toFixed(1)}°C
              </span>
              <span className="text-xs text-gray-500">
                {t("factory.storage.target")}: {currentProfile.idealTempMin}°C - {currentProfile.idealTempMax}°C
              </span>
            </div>
          </div>

          {/* Humidity Sensor Card */}
          <div className="p-3.5 rounded-xl bg-[#FAFBFC] border border-[#E8ECF3] space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium">{t("factory.storage.relative_humidity")}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono-data ${
                  activeBatch.humidity < currentProfile.idealHumidityMin || activeBatch.humidity > currentProfile.idealHumidityMax
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {activeBatch.humidity < currentProfile.idealHumidityMin
                  ? t("factory.storage.low")
                  : activeBatch.humidity > currentProfile.idealHumidityMax
                  ? t("factory.storage.high")
                  : t("factory.storage.normal")}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono-data text-[#111827]">
                {activeBatch.humidity}%
              </span>
              <span className="text-xs text-gray-500">
                {t("factory.storage.target")}: {currentProfile.idealHumidityMin}% - {currentProfile.idealHumidityMax}%
              </span>
            </div>
          </div>

          {/* Ethylene / Air Circulation Card */}
          <div className="p-3.5 rounded-xl bg-[#FAFBFC] border border-[#E8ECF3] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{t("factory.storage.ethylene_gas")}</span>
              <span className="font-mono-data font-bold text-amber-600">
                {selectedProduce === "tomato" ? `0.42 ppm (${t("factory.storage.elevated")})` : `0.08 ppm (${t("factory.storage.normal")})`}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
              <span className="text-gray-600">{t("factory.storage.hvac_load")}</span>
              <span className="font-mono-data font-bold text-emerald-600">{t("factory.storage.running")}</span>
            </div>
          </div>
        </div>

        {/* Blast chill trigger button */}
        <div className="pt-2">
          {chillTriggered ? (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t("factory.storage.compressor_activated")}
            </div>
          ) : (
            <button
              onClick={handleTriggerBlastChill}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              {t("factory.storage.trigger_blast_chill")} {currentProfile.name}
            </button>
          )}
        </div>
      </div>

      {/* SECTION 2: AI QUALITY PARAMETERS (PRODUCE-SPECIFIC) (4 cols) */}
      <div className="lg:col-span-4 card p-6 flex flex-col justify-between h-full space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="section-title flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">{t("factory.storage.ai_quality_params")}</span>
              </h3>
              <p className="section-subtitle truncate">{t("factory.storage.specific_to_biology")} {currentProfile.name}</p>
            </div>
            <span className="text-[10px] font-mono-data font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded shrink-0">
              {t("factory.storage.adaptive_matrix")}
            </span>
          </div>

          <div className="space-y-3">
            {/* pH Sensor Reading (if produce uses pH) */}
            {currentProfile.hasPh && (
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-700 block">{t("factory.storage.juice_tissue_ph")}</span>
                  <span className="text-[11px] text-gray-500">
                    {t("factory.storage.ideal")}: {currentProfile.idealPhMin} - {currentProfile.idealPhMax}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black font-mono-data text-gray-900 block">
                    {activeBatch.ph?.toFixed(2)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono-data ${
                      activeBatch.ph && (activeBatch.ph > (currentProfile.idealPhMax || 5) || activeBatch.ph < (currentProfile.idealPhMin || 4))
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {activeBatch.ph && (activeBatch.ph > (currentProfile.idealPhMax || 5) || activeBatch.ph < (currentProfile.idealPhMin || 4))
                      ? t("factory.storage.shifted")
                      : t("factory.storage.normal")}
                  </span>
                </div>
              </div>
            )}

            {/* Weight Loss (Bulk load-cell scale drift) */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-700 block">{t("factory.storage.weight_loss")}</span>
                <span className="text-[11px] text-gray-500">
                  {t("factory.storage.threshold")}: &lt; {currentProfile.weightLossThreshold}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black font-mono-data text-gray-900 block">
                  {activeBatch.weightLossPct}%
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono-data ${
                    activeBatch.weightLossPct > currentProfile.weightLossThreshold
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {activeBatch.weightLossPct > currentProfile.weightLossThreshold ? t("factory.storage.high") : t("factory.storage.normal")}
                </span>
              </div>
            </div>

            {/* Produce-specific camera/vision parameters */}
            {currentProfile.visionParams.map((vp) => {
              const val = activeBatch.visionScores[vp.key] ?? 0;
              const isBad =
                vp.key === "surfaceDefect" || vp.key === "rot" || vp.key === "sprouting" || vp.key === "wilting"
                  ? val > 5
                  : false;

              return (
                <div key={vp.key} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-700 block">{vp.label}</span>
                    <span className="text-[11px] text-gray-500">{t("factory.storage.camera_vision_sim")}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black font-mono-data text-gray-900 block">
                      {val}{vp.unit}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono-data ${
                        isBad ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {isBad ? t("factory.storage.attention") : t("factory.storage.good")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <span>
            {t("factory.storage.crop_metrics_note")}
          </span>
        </div>
      </div>

        {/* SECTION 3: AI QUALITY ANALYSIS & RECOMMENDATION (4 cols) */}
        <div className="lg:col-span-4 card p-6 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="section-title flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{t("factory.storage.ai_quality_analysis")}</span>
                </h3>
                <p className="section-subtitle truncate">{t("factory.storage.batch_triage")}</p>
              </div>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full font-mono-data shrink-0 ml-2 ${
                  activeBatch.riskLevel === "HIGH"
                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                    : activeBatch.riskLevel === "MEDIUM"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}
              >
                {activeBatch.riskLevel} {t("factory.storage.risk")}
              </span>
            </div>

            {/* Quality Score & Shelf Life Big Widget */}
            <div className="grid grid-cols-2 gap-3 my-4">
              {/* Quality Score */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  {t("factory.storage.quality_score")}
                </span>
                <span
                  className={`text-3xl font-black font-mono-data block my-1 ${
                    activeBatch.qualityScore < 60
                      ? "text-rose-600"
                      : activeBatch.qualityScore < 75
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                >
                  {activeBatch.qualityScore}%
                </span>
                <span className="text-[10px] font-bold text-gray-600">
                  {activeBatch.qualityScore >= 80 ? t("factory.storage.optimal") : activeBatch.qualityScore >= 60 ? t("factory.storage.degrading") : t("factory.storage.critical")}
                </span>
              </div>

              {/* Shelf Life */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  {t("factory.storage.est_shelf_life")}
                </span>
                <span className="text-2xl font-black font-mono-data text-gray-900 block my-1">
                  {activeBatch.shelfLifeDisplay}
                </span>
                <span className="text-[10px] text-gray-500 block">
                  {t("factory.storage.until_quality_cutoff")}
                </span>
              </div>
            </div>

            {/* AI Recommendation Box */}
            <div className={`p-4 rounded-2xl border ${recBadge.bg} ${recBadge.border} space-y-1.5`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                {t("factory.storage.ai_recommendation")}:
              </div>
              <div className={`text-base font-extrabold flex items-center gap-2 ${recBadge.text}`}>
                <RecIcon className="w-5 h-5 shrink-0" />
                <span>{activeBatch.recommendation}</span>
              </div>
              <p className="text-[11px] text-gray-600 pt-1">
                {t("factory.storage.batch")}: <strong>{activeBatch.batchCode}</strong> ({activeBatch.stockKg.toLocaleString()} kg) • {t("factory.storage.age")}: {activeBatch.ageDays} {t("factory.storage.days")}
              </p>
            </div>
          </div>

          {/* Action button: Connected directly to Spoilage Engine */}
          <div className="pt-2">
            {isBatchPrioritized && activeBatch.batchCode === "TOM-2024-0234" ? (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t("factory.storage.batch_rerouted")}
              </div>
            ) : activeBatch.riskLevel === "HIGH" ? (
              <button
                onClick={prioritizeBatch}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" />
                {t("factory.storage.prioritize_batch")}
              </button>
            ) : (
              <Link
                href="/factory/spoilage"
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                {t("factory.storage.view_degradation_curve")} →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ─── AI QUALITY INSIGHT BANNER ───────────────────────────────────── */}
      <div className="card p-5 border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50/40 via-white to-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                {t("factory.storage.ai_quality_insight")} {currentProfile.name} ({activeBatch.batchCode})
              </div>
              <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
                {activeBatch.insightText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTriggerManualVisionScan}
              disabled={manualScanRunning}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold border border-gray-200 shadow-xs transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${manualScanRunning ? "animate-spin" : ""}`} />
              {manualScanRunning ? t("factory.storage.scanning") : t("factory.storage.reevaluate_batch")}
            </button>
          </div>
        </div>
      </div>

      {/* ─── AI VISION — SIMULATION SECTION (CAMERA INSPECTION) ──────────── */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="section-title flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                {t("factory.storage.visual_quality_inspection")}
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                {t("factory.storage.ai_vision_simulation")}
              </span>
            </div>
            <p className="section-subtitle">
              {t("factory.storage.rgb_nir_desc")}
            </p>
          </div>

          <span className="text-xs font-mono-data text-gray-500">
            {t("factory.storage.camera_node")}: <strong>CAM-ZONE-0{selectedProduce === "tomato" ? "2" : "1"}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Simulated Viewfinder Box (6 cols) */}
          <div className="lg:col-span-6 p-5 rounded-2xl bg-gray-900 text-white relative overflow-hidden flex flex-col justify-between h-[220px]">
            {/* Viewfinder crosshairs */}
            <div className="flex items-center justify-between text-[11px] font-mono-data text-emerald-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {t("factory.storage.optical_scan_active")}
              </span>
              <span>1080p • 60 FPS ({t("factory.storage.simulated")})</span>
            </div>

            <div className="text-center my-auto">
              <span className="text-5xl block mb-2">{currentProfile.icon}</span>
              <span className="text-xs font-bold text-gray-300">
                {t("factory.storage.batch")}: {activeBatch.batchCode} • {currentProfile.variety}
              </span>
              <span className="block text-[11px] text-emerald-400 font-mono-data mt-0.5">
                {t("factory.storage.target_bounding_confidence")}: 96.8%
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono-data border-t border-gray-800 pt-2">
              <span>FOV: {t("factory.storage.bulk_conveyor")} #2</span>
              <span>{t("factory.storage.calibration_matrix")}: v2.4</span>
            </div>
          </div>

          {/* Visual Parameters breakdown (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {t("factory.storage.extracted_visual_params")}:
            </h4>

            {currentProfile.visionParams.map((vp) => {
              const val = activeBatch.visionScores[vp.key] ?? 0;
              const isBad =
                vp.key === "surfaceDefect" || vp.key === "rot" || vp.key === "sprouting" || vp.key === "wilting"
                  ? val > 5
                  : false;

              return (
                <div key={vp.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700">{vp.label}</span>
                    <span className="font-mono-data font-bold text-gray-900">
                      {val}{vp.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isBad ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(val, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-2 text-[11px] text-gray-500">
              ℹ️ <em>{t("factory.storage.disclaimer")}:</em> {t("factory.storage.disclaimer_text")}
            </div>
          </div>
        </div>
      </div>

      {/* ─── EXISTING 4 COLD STORAGE UNITS SUMMARY ────────────────────────── */}
      <div>
        <div className="mb-3">
          <h3 className="section-title">{t("factory.storage.cold_storage_overview")}</h3>
          <p className="section-subtitle">{t("factory.storage.cold_storage_subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FACTORY_STORAGE_UNITS.map((unit) => {
            const isWarning = unit.status === "ATTENTION_NEEDED";

            return (
              <div
                key={unit.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isWarning
                    ? "border-amber-200 bg-amber-50/30"
                    : "border-[#E8ECF3] bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{unit.icon}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono-data ${
                      isWarning
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isWarning ? t("factory.storage.excursion") : t("factory.storage.optimal")}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#111827]">{unit.name}</h4>
                <p className="text-xs text-[#6B7280]">{unit.crop}</p>

                <div className="mt-4 pt-3 border-t border-[#F3F4F6] grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#9CA3AF] uppercase block font-semibold">{t("factory.storage.temperature")}</span>
                    <span
                      className={`text-lg font-black font-mono-data ${
                        isWarning ? "text-amber-600" : "text-[#111827]"
                      }`}
                    >
                      {unit.tempCelsius}°C
                    </span>
                    <span className="text-[10px] text-[#9CA3AF] block">{unit.targetTemp}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9CA3AF] uppercase block font-semibold">{t("factory.storage.humidity")}</span>
                    <span className="text-lg font-black font-mono-data text-[#111827]">
                      {unit.humidityPct}%
                    </span>
                    <span className="text-[10px] text-[#9CA3AF] block">{unit.targetHumidity}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── EXISTING 24-HOUR THERMAL GRADIENT CHART ───────────────────────── */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">{t("factory.storage.thermal_gradient_title")}</h3>
            <p className="section-subtitle">{t("factory.storage.thermal_gradient_subtitle")}</p>
          </div>
          <span className="text-xs font-mono-data text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
            {t("factory.storage.telemetry_freq")}
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={HOURLY_TEMP_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="°C" domain={[4, 20]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1B2138",
                  borderColor: "rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  color: "#F1F5F9",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="unitA"
                name={t("factory.storage.legend_unit_a")}
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="unitB"
                name={t("factory.storage.legend_unit_b")}
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="unitC"
                name={t("factory.storage.legend_unit_c")}
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
