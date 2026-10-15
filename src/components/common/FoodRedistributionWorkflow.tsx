"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { useSafeReducedMotion } from "@/lib/useHydrated";
import {
  Utensils,
  Gauge,
  HeartHandshake,
  KeyRound,
  ClipboardCheck,
  BarChart3,
  CheckCircle2,
  Check,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Bell,
  Truck,
  Star,
  AlertTriangle,
  FileText,
  Download,
  Phone,
  User,
  Clock,
  Info,
} from "lucide-react";
import CountUp from "@/components/common/CountUp";
import { MOTION_EASINGS } from "@/lib/motion";

// How long each stage stays on screen during autoplay — long enough to read the copy and watch the demo play out
const STAGE_DWELL_MS = 6500;

/**
 * One donation followed through every stage. Mirrors the seeded demo listing
 * (see mockData) so the walkthrough matches what users see in the portals.
 */
const EXAMPLE = {
  donor: "Barbeque Nation (Indiranagar)",
  food: "Vegetable Dum Biryani with Cucumber Raita",
  category: "Cooked Meals",
  diet: "Vegetarian",
  kg: 12,
  servings: 35,
  deadline: "Today, 8:30 PM",
  ngo: "Bangalore Food Bank",
  volunteer: "Rajesh Kumar (Volunteer)",
  volunteerPhone: "+91 98765 23412",
  otp: "4827",
  donorPoints: 5120,
  // calculatePoints(): average rating ≥ 4.5 → 85 points
  pointsAwarded: 85,
  // ImpactDashboard estimate: ~2.5 kg CO₂e avoided per kg of food diverted
  co2PerKg: 2.5,
};

type Actor = "Donor" | "NGO" | "Donor & Volunteer" | "FoodWise";
type Status = "AVAILABLE" | "ACCEPTED" | "PICKUP" | "COMPLETED" | "FLAGGED_FOR_REVIEW";

interface Stage {
  id: number;
  short: string;
  // One-word label for narrow screens where six columns can't fit `short`
  tiny: string;
  title: string;
  actor: Actor;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  records: string[];
  status: { from?: Status; via?: Status; to: Status; note: string };
  Visual: React.ComponentType<{ reduced: boolean }>;
}

// ─── Shared animation variants ───────────────────────────────────────────────

const detailCardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: MOTION_EASINGS.apple, staggerChildren: 0.07, delayChildren: 0.04 },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18, ease: MOTION_EASINGS.appleAccelerate } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: MOTION_EASINGS.apple } },
};

// Demo panels play their own, slightly slower sequence
const demoVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.25 } },
};

const popVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 420, damping: 18 } },
};

// ─── Small building blocks ───────────────────────────────────────────────────

const ACTOR_STYLES: Record<Actor, string> = {
  Donor: "bg-amber-400/10 text-amber-200 ring-amber-300/30",
  NGO: "bg-sky-400/10 text-sky-200 ring-sky-300/30",
  "Donor & Volunteer": "bg-violet-400/10 text-violet-200 ring-violet-300/30",
  FoodWise: "bg-emerald-400/10 text-emerald-200 ring-emerald-300/30",
};

const STATUS_STYLES: Record<Status, string> = {
  AVAILABLE: "bg-emerald-400/15 text-emerald-200 ring-emerald-300/35",
  ACCEPTED: "bg-sky-400/15 text-sky-200 ring-sky-300/35",
  PICKUP: "bg-violet-400/15 text-violet-200 ring-violet-300/35",
  COMPLETED: "bg-teal-300/20 text-teal-100 ring-teal-200/40",
  FLAGGED_FOR_REVIEW: "bg-amber-400/15 text-amber-200 ring-amber-300/35",
};

function StatusChip({ status, className = "" }: { status: Status; className?: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold tracking-wide ring-1 ring-inset ${STATUS_STYLES[status]} ${className}`}
    >
      {status}
    </span>
  );
}

/** Dark "app window" that frames each stage demo */
function DemoFrame({
  title,
  meta,
  icon: Icon,
  children,
}: {
  title: string;
  meta: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-[#051710] ring-1 ring-inset ring-emerald-400/20 overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span className="text-[11px] font-semibold text-emerald-50 truncate">{title}</span>
        </div>
        <span className="text-[10px] text-emerald-200/60 truncate">{meta}</span>
      </div>
      <div className="p-3.5 flex-1">{children}</div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.06] text-emerald-50/90 ring-1 ring-inset ring-white/10">
      {children}
    </span>
  );
}

// ─── Stage demos ─────────────────────────────────────────────────────────────

function ListingDemo({ reduced }: { reduced: boolean }) {
  return (
    <DemoFrame title="New surplus listing" meta={EXAMPLE.donor} icon={Utensils}>
      <motion.div variants={demoVariants} initial={reduced ? false : "hidden"} animate="visible" className="space-y-2.5">
        <motion.div variants={itemVariants}>
          <span className="block text-[10px] uppercase tracking-wider text-emerald-200/55 font-semibold">Food item</span>
          <span className="block text-[13px] font-semibold text-white leading-snug">{EXAMPLE.food}</span>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-wrap gap-1.5">
          <Chip>{EXAMPLE.kg} kg</Chip>
          <Chip>~{EXAMPLE.servings} servings</Chip>
          <Chip>{EXAMPLE.diet}</Chip>
          <Chip>{EXAMPLE.category}</Chip>
        </motion.div>
        <motion.div variants={itemVariants} className="flex items-center gap-1.5 text-[11px] text-emerald-50/85">
          <Clock className="w-3.5 h-3.5 text-amber-300" />
          <span>
            Pickup by <strong className="text-white">{EXAMPLE.deadline}</strong>
          </span>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 text-[11px] text-emerald-50/85 p-2 rounded-lg bg-white/[0.03] ring-1 ring-inset ring-white/[0.06]"
        >
          <motion.span
            variants={popVariants}
            className="w-4 h-4 rounded bg-emerald-400 text-emerald-950 flex items-center justify-center shrink-0"
          >
            <Check className="w-3 h-3" strokeWidth={3} />
          </motion.span>
          <span>Food-safety declaration confirmed</span>
        </motion.div>
        <motion.div variants={itemVariants} className="pt-1 flex items-center justify-between gap-2">
          <motion.div variants={popVariants} className="relative">
            {!reduced && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-md ring-2 ring-emerald-300/60"
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 1.35 }}
                transition={{ duration: 1.4, delay: 1.3, repeat: Infinity, repeatDelay: 0.8 }}
              />
            )}
            <StatusChip status="AVAILABLE" />
          </motion.div>
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-200/80">
            <Bell className="w-3.5 h-3.5 text-emerald-300" />
            NGOs notified
          </span>
        </motion.div>
      </motion.div>
    </DemoFrame>
  );
}

// Mirrors calculateSmartDonationMatch() for the example listing
const MATCH_BREAKDOWN = [
  { label: "Base score", value: "75" },
  { label: "Urgent pickup window", value: "+10" },
  { label: "12 kg fits one vehicle", value: "+10" },
  { label: "Cooked meal", value: "+5" },
  { label: "Vegetarian", value: "+5" },
];

function MatchDemo({ reduced }: { reduced: boolean }) {
  const feed = [
    { name: "Local Resident (Demo)", kg: "2.5 kg", tier: "Critical", time: "45 mins", tone: "text-rose-300 bg-rose-400/10 ring-rose-300/30", selected: false },
    { name: EXAMPLE.donor, kg: `${EXAMPLE.kg} kg`, tier: "Urgent", time: "2h 10m", tone: "text-amber-200 bg-amber-400/10 ring-amber-300/30", selected: true },
    { name: "The Oberoi, Bengaluru", kg: "25 kg", tier: "Safe buffer", time: "6 hrs", tone: "text-emerald-200 bg-emerald-400/10 ring-emerald-300/30", selected: false },
  ];
  return (
    <DemoFrame title="NGO live feed" meta="Sorted by urgency" icon={Gauge}>
      <motion.div variants={demoVariants} initial={reduced ? false : "hidden"} animate="visible" className="space-y-3">
        <div className="space-y-1.5">
          {feed.map((row) => (
            <motion.div
              key={row.name}
              variants={itemVariants}
              className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg ring-1 ring-inset ${
                row.selected ? "bg-emerald-400/10 ring-emerald-300/50" : "bg-white/[0.03] ring-white/[0.06]"
              }`}
            >
              <span className={`text-[11px] truncate ${row.selected ? "text-white font-semibold" : "text-emerald-50/75"}`}>
                {row.name} <span className="text-emerald-200/60 font-normal">· {row.kg}</span>
              </span>
              <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ring-1 ring-inset ${row.tone}`}>
                {row.tier} · {row.time}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="flex items-center gap-3.5 pt-0.5">
          <div className="relative w-[68px] h-[68px] shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
              <motion.circle
                cx="32"
                cy="32"
                r="27"
                fill="none"
                stroke="url(#matchGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 0.99 }}
                transition={{ duration: 1.4, delay: 0.9, ease: MOTION_EASINGS.apple }}
              />
              <defs>
                <linearGradient id="matchGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6EE7B7" />
                  <stop offset="100%" stopColor="#2DD4BF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold font-display text-white leading-none">
                <CountUp value={99} duration={1400} />
              </span>
              <span className="text-[8px] uppercase tracking-wider text-emerald-200/60 mt-0.5">match</span>
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            {MATCH_BREAKDOWN.map((row) => (
              <div key={row.label} className="flex items-center justify-between text-[10.5px]">
                <span className="text-emerald-50/70 truncate">{row.label}</span>
                <span className="font-mono text-emerald-200 tabular-nums">{row.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-[10.5px] pt-0.5 border-t border-white/[0.07]">
              <span className="text-emerald-50/70">Total 105, capped at</span>
              <span className="font-mono font-semibold text-white">99</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DemoFrame>
  );
}

function ClaimDemo({ reduced }: { reduced: boolean }) {
  return (
    <DemoFrame title="Claim batch" meta={EXAMPLE.ngo} icon={HeartHandshake}>
      <motion.div variants={demoVariants} initial={reduced ? false : "hidden"} animate="visible" className="space-y-2.5">
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-white/[0.03] ring-1 ring-inset ring-white/[0.06]">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-200/55 font-semibold">
              <User className="w-3 h-3" /> Volunteer driver
            </span>
            <span className="block text-[11px] font-semibold text-white truncate mt-0.5">{EXAMPLE.volunteer}</span>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.03] ring-1 ring-inset ring-white/[0.06]">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-200/55 font-semibold">
              <Phone className="w-3 h-3" /> Phone
            </span>
            <span className="block text-[11px] font-semibold text-white truncate mt-0.5">{EXAMPLE.volunteerPhone}</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="w-full py-2 rounded-lg text-[11px] font-bold text-emerald-950 bg-linear-to-b from-emerald-300 to-emerald-400 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
        >
          Confirm claim
        </motion.div>

        <motion.div variants={itemVariants} className="pt-0.5">
          <span className="block text-[10px] uppercase tracking-wider text-emerald-200/55 font-semibold mb-1.5">
            Handover OTP generated
          </span>
          <div className="flex gap-1.5" style={{ perspective: 400 }}>
            {EXAMPLE.otp.split("").map((digit, i) => (
              <motion.span
                key={i}
                initial={reduced ? false : { rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ delay: 1.15 + i * 0.12, type: "spring", stiffness: 300, damping: 20 }}
                className="w-9 h-10 rounded-lg bg-white/[0.06] ring-1 ring-inset ring-emerald-300/40 flex items-center justify-center font-mono text-lg font-bold text-white"
              >
                {digit}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-between gap-2 pt-1">
          <span className="flex items-center gap-1.5">
            <StatusChip status="AVAILABLE" className="opacity-50" />
            <ArrowRight className="w-3 h-3 text-emerald-200/50" />
            <motion.span variants={popVariants}>
              <StatusChip status="ACCEPTED" />
            </motion.span>
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-200/80">
            <Bell className="w-3.5 h-3.5 text-emerald-300" />
            Donor notified
          </span>
        </motion.div>
      </motion.div>
    </DemoFrame>
  );
}

function HandoverDemo({ reduced }: { reduced: boolean }) {
  const digits = EXAMPLE.otp.split("");
  return (
    <DemoFrame title="Pickup & handover" meta="Pickup gate" icon={KeyRound}>
      <motion.div variants={demoVariants} initial={reduced ? false : "hidden"} animate="visible" className="space-y-3">
        <motion.div variants={itemVariants} className="relative h-12">
          <span className="absolute left-0 top-0 text-[9px] uppercase tracking-wider text-emerald-200/50">NGO hub</span>
          <span className="absolute right-0 top-0 text-[9px] uppercase tracking-wider text-emerald-200/50">Donor</span>
          <div className="absolute left-2 right-2 bottom-4 border-t-2 border-dashed border-emerald-300/25" />
          <motion.div
            className="absolute bottom-0 w-8 h-8 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center shadow-[0_0_16px_rgba(52,211,153,0.6)]"
            initial={reduced ? false : { left: "0%" }}
            animate={{ left: "calc(100% - 2rem)" }}
            transition={{ duration: 1.2, delay: 0.3, ease: MOTION_EASINGS.apple }}
          >
            <Truck className="w-4 h-4" />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative flex items-stretch gap-2">
          <div className="flex-1 min-w-0 p-2.5 rounded-lg bg-white/[0.03] ring-1 ring-inset ring-white/[0.07] text-center">
            <span className="block text-[10px] uppercase tracking-wider text-emerald-200/55 font-semibold">Volunteer shows</span>
            <span className="block font-mono text-xl font-bold tracking-[0.3em] pl-[0.3em] mt-1 text-white">{EXAMPLE.otp}</span>
          </div>
          <div className="flex-1 min-w-0 p-2.5 rounded-lg bg-white/[0.03] ring-1 ring-inset ring-white/[0.07] text-center">
            <span className="block text-[10px] uppercase tracking-wider text-emerald-200/55 font-semibold">Donor enters</span>
            <span className="flex justify-center gap-1 mt-1">
              {digits.map((digit, i) => (
                <span
                  key={i}
                  className="w-6 h-7 rounded-md bg-white/[0.06] ring-1 ring-inset ring-emerald-300/30 flex items-center justify-center font-mono text-base font-bold text-emerald-200"
                >
                  <motion.span
                    initial={reduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.16, duration: 0.2 }}
                  >
                    {digit}
                  </motion.span>
                </span>
              ))}
            </span>
          </div>
          <motion.span
            initial={reduced ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, type: "spring", stiffness: 420, damping: 16 }}
            className="absolute left-1/2 top-1/2 -ml-3.5 -mt-3.5 w-7 h-7 rounded-full bg-emerald-400 text-emerald-950 ring-4 ring-[#051710] flex items-center justify-center"
          >
            <Check className="w-4 h-4" strokeWidth={3} />
          </motion.span>
        </motion.div>

        <motion.div variants={itemVariants} className="text-[11px] text-emerald-50/85 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
          Codes match · food released · NGO confirms delivery
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center gap-1.5 flex-wrap">
          <StatusChip status="ACCEPTED" className="opacity-50" />
          <ArrowRight className="w-3 h-3 text-emerald-200/50" />
          <motion.span
            initial={reduced ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2, type: "spring", stiffness: 420, damping: 18 }}
          >
            <StatusChip status="PICKUP" />
          </motion.span>
          <ArrowRight className="w-3 h-3 text-emerald-200/50" />
          <motion.span
            initial={reduced ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.7, type: "spring", stiffness: 420, damping: 18 }}
          >
            <StatusChip status="COMPLETED" />
          </motion.span>
        </motion.div>
      </motion.div>
    </DemoFrame>
  );
}

const RATINGS = [
  { label: "Food quality", value: 5 },
  { label: "Packaging", value: 5 },
  { label: "Timeliness", value: 4 },
  { label: "Quantity", value: 5 },
];

function QualityDemo({ reduced }: { reduced: boolean }) {
  return (
    <DemoFrame title="Rate donor" meta={EXAMPLE.donor} icon={ClipboardCheck}>
      <motion.div variants={demoVariants} initial={reduced ? false : "hidden"} animate="visible" className="space-y-2.5">
        <div className="space-y-1.5">
          {RATINGS.map((r, rowIdx) => (
            <motion.div key={r.label} variants={itemVariants} className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-emerald-50/80">{r.label}</span>
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={reduced ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.35 + rowIdx * 0.18 + i * 0.05, type: "spring", stiffness: 500, damping: 20 }}
                  >
                    <Star className={`w-3.5 h-3.5 ${i < r.value ? "fill-amber-300 text-amber-300" : "text-white/20"}`} />
                  </motion.span>
                ))}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between gap-2 p-2 rounded-lg bg-emerald-400/10 ring-1 ring-inset ring-emerald-300/30"
        >
          <span className="text-[11px] text-emerald-50/85">Average 4.75 →</span>
          <motion.span variants={popVariants} className="text-[13px] font-bold text-emerald-200">
            +{EXAMPLE.pointsAwarded} points
          </motion.span>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-between text-[11px] text-emerald-50/80">
          <span>Donor total</span>
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-white tabular-nums">
              <CountUp value={EXAMPLE.donorPoints + EXAMPLE.pointsAwarded} duration={1600} />
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-400/15 text-indigo-200 ring-1 ring-inset ring-indigo-300/30">
              Platinum
            </span>
          </span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-start gap-2 p-2 rounded-lg bg-amber-400/[0.07] ring-1 ring-inset ring-amber-300/20 text-[10.5px] text-amber-100/85 leading-snug"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-px" />
          <span>
            Problem with the food? A Medium or High severity report sets the listing to{" "}
            <span className="font-mono text-amber-200">FLAGGED_FOR_REVIEW</span>.
          </span>
        </motion.div>
      </motion.div>
    </DemoFrame>
  );
}

function ImpactDemo({ reduced }: { reduced: boolean }) {
  const tiles = [
    { label: "Food diverted", value: EXAMPLE.kg, suffix: " kg" },
    { label: "Servings (est.)", value: EXAMPLE.servings, prefix: "~" },
    { label: "CO₂e avoided (est.)", value: EXAMPLE.kg * EXAMPLE.co2PerKg, suffix: " kg" },
  ];
  return (
    <DemoFrame title="Impact dashboard" meta="Donor & NGO" icon={BarChart3}>
      <motion.div variants={demoVariants} initial={reduced ? false : "hidden"} animate="visible" className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {tiles.map((tile) => (
            <motion.div
              key={tile.label}
              variants={itemVariants}
              className="p-2.5 rounded-lg bg-white/[0.04] ring-1 ring-inset ring-white/[0.07]"
            >
              <span className="block text-lg font-bold font-display text-white leading-tight">
                <CountUp value={tile.value} prefix={tile.prefix} suffix={tile.suffix} duration={1500} />
              </span>
              <span className="block text-[9.5px] text-emerald-200/65 leading-tight mt-0.5">{tile.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="space-y-1">
          <div className="flex items-end gap-1 h-12">
            {[30, 42, 38, 55, 48, 64, 72].map((h, i) => (
              <motion.span
                key={i}
                className={`flex-1 rounded-t ${i === 6 ? "bg-emerald-300" : "bg-emerald-400/30"}`}
                initial={reduced ? false : { height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.9 + i * 0.06, duration: 0.6, ease: MOTION_EASINGS.apple }}
              />
            ))}
          </div>
          <span className="block text-[10px] text-emerald-200/55">Completed donations add to each dashboard</span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/[0.03] ring-1 ring-inset ring-white/[0.06]"
        >
          <span className="flex items-center gap-2 text-[11px] text-emerald-50/85">
            <FileText className="w-3.5 h-3.5 text-emerald-300" />
            Donation record &amp; certificate
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-200">
            <Download className="w-3 h-3" /> PDF
          </span>
        </motion.div>
      </motion.div>
    </DemoFrame>
  );
}

// ─── Stage content (mirrors real app behaviour) ──────────────────────────────

const STAGES: Stage[] = [
  {
    id: 1,
    short: "List Surplus",
    tiny: "List",
    title: "A donor lists surplus food",
    actor: "Donor",
    icon: Utensils,
    description:
      "A household, restaurant or hotel posts what's left over: what it is, how much, and when it must be collected. Commercial donors also confirm a food-safety declaration before publishing.",
    records: [
      "Food item, weight (kg) and estimated servings",
      "Diet, allergens and holding method (ambient, chilled, frozen or hot)",
      "Pickup deadline, address and gate instructions",
    ],
    status: { to: "AVAILABLE", note: "Listing goes live and NGOs are notified" },
    Visual: ListingDemo,
  },
  {
    id: 2,
    short: "Discover & Match",
    tiny: "Match",
    title: "NGOs discover and assess it",
    actor: "NGO",
    icon: Gauge,
    description:
      "The listing appears in the NGO live feed, ordered by how soon it must be collected. A rule-based match score summarises how well the batch suits the NGO, to guide (not replace) their judgement.",
    records: [
      "Urgency: Critical under 2 h, Urgent up to 5 h, otherwise Safe buffer",
      "Match score from pickup window, batch size, food type, diet and coverage area",
      "Expired listings can't be claimed",
    ],
    status: { from: "AVAILABLE", to: "AVAILABLE", note: "Still open to every NGO" },
    Visual: MatchDemo,
  },
  {
    id: 3,
    short: "Claim & Assign",
    tiny: "Claim",
    title: "An NGO claims the batch",
    actor: "NGO",
    icon: HeartHandshake,
    description:
      "The NGO claims the donation and names the volunteer driver who will collect it. FoodWise issues a one-time 4-digit handover code to the NGO's volunteer and notifies the donor.",
    records: [
      "Claiming NGO and time of claim",
      "Volunteer driver name and phone number",
      "4-digit handover code, held by the volunteer",
    ],
    status: { from: "AVAILABLE", to: "ACCEPTED", note: "Reserved for the claiming NGO" },
    Visual: ClaimDemo,
  },
  {
    id: 4,
    short: "OTP Handover",
    tiny: "OTP",
    title: "Verified pickup and delivery",
    actor: "Donor & Volunteer",
    icon: KeyRound,
    description:
      "At pickup the volunteer shows their 4-digit code and the donor enters it. A matching code releases the food; once it reaches a shelter, the NGO confirms delivery and the donation completes.",
    records: [
      "Donor enters the volunteer's code; a wrong code is rejected",
      "Collection and delivery recorded on the donation's timeline",
      "Donation record available as a PDF",
    ],
    status: { from: "ACCEPTED", via: "PICKUP", to: "COMPLETED", note: "Donor and NGO are notified at each step" },
    Visual: HandoverDemo,
  },
  {
    id: 5,
    short: "Quality & Feedback",
    tiny: "Quality",
    title: "Quality checks and donor feedback",
    actor: "NGO",
    icon: ClipboardCheck,
    description:
      "If something is wrong, like spoiled food, damaged packaging or a mismatch with the listing, the NGO files a quality report. Good donations are rated, and ratings earn the donor points.",
    records: [
      "Issue type, severity and optional photo, reviewed from Reported to Resolved",
      "Ratings for food quality, packaging, timeliness and quantity",
      "Points toward Bronze, Silver, Gold and Platinum donor tiers",
    ],
    status: { to: "FLAGGED_FOR_REVIEW", note: "Only when a Medium or High severity issue is reported" },
    Visual: QualityDemo,
  },
  {
    id: 6,
    short: "Impact & Records",
    tiny: "Impact",
    title: "Impact is recorded",
    actor: "FoodWise",
    icon: BarChart3,
    description:
      "Every completed donation adds to the donor's and NGO's impact dashboards. Figures come from FoodWise records and are estimates, not audited measurements.",
    records: [
      "Food diverted (kg) and estimated servings",
      "Estimated CO₂e avoided (about 2.5 kg per kg of food)",
      "PDF donation records, certificates and impact reports",
    ],
    status: { from: "COMPLETED", to: "COMPLETED", note: "Counted in impact dashboards" },
    Visual: ImpactDemo,
  },
];

// ─── Main component ──────────────────────────────────────────────────────────

export default function FoodRedistributionWorkflow({
  compact = false,
}: {
  compact?: boolean;
}) {
  const prefersReduced = useSafeReducedMotion();
  const reduced = Boolean(prefersReduced);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isInView, setIsInView] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Track visibility so autoplay only runs while the section is substantially on screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.5,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Autoplay advances while visible and not hovered; hovering pauses so a stage can be read
  const isAutoplayOn = isPlaying && !reduced;
  const isAutoAdvancing = isAutoplayOn && isInView && !isHovered;

  useEffect(() => {
    if (!isAutoAdvancing) return;
    const timer = setTimeout(() => {
      setActiveStep((prev) => (prev >= STAGES.length ? 1 : prev + 1));
    }, STAGE_DWELL_MS);
    return () => clearTimeout(timer);
  }, [isAutoAdvancing, activeStep]);

  const handleTogglePlay = useCallback(() => setIsPlaying((prev) => !prev), []);

  const handleRestart = useCallback(() => {
    setActiveStep(1);
    setIsPlaying(true);
  }, []);

  // Manual navigation pauses autoplay so the chosen stage stays put
  const goTo = useCallback((stepId: number) => {
    setActiveStep(((stepId - 1 + STAGES.length) % STAGES.length) + 1);
    setIsPlaying(false);
  }, []);

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? activeStep + 1 : activeStep - 1;
    const wrapped = ((next - 1 + STAGES.length) % STAGES.length) + 1;
    goTo(wrapped);
    tabRefs.current[wrapped - 1]?.focus();
  };

  const current = STAGES[activeStep - 1];
  const StepIcon = current.icon;
  const Visual = current.Visual;

  // Rail runs between the first and last column centres (1/12 → 11/12 of the width)
  const progressPercent = ((activeStep - 1) / (STAGES.length - 1)) * 100;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full rounded-3xl bg-linear-to-b from-[#0F3324] to-[#0A2117] text-white ring-1 ring-inset ring-white/10 shadow-2xl shadow-black/30 overflow-hidden relative ${
        compact ? "p-4 sm:p-5" : "p-5 sm:p-7 lg:p-8"
      }`}
    >
      {/* Background ambient glow */}
      <div className="absolute -top-20 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-5 border-b border-white/[0.08] relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-200 ring-1 ring-inset ring-emerald-300/25 text-[11px] font-bold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Donation lifecycle
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">How FoodWise Rescues Surplus Food</h3>
          <p className="text-xs sm:text-[13px] text-emerald-100/75 mt-1 max-w-xl">
            Follow one donation through the six stages FoodWise tracks, from a kitchen&apos;s listing to the impact it records.
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {(["Donor", "NGO", "Donor & Volunteer", "FoodWise"] as Actor[]).map((actor) => (
              <span
                key={actor}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ring-inset ${ACTOR_STYLES[actor]}`}
              >
                {actor === "Donor & Volunteer" ? "Volunteer" : actor}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isAutoplayOn ? "Pause automatic walkthrough" : "Play automatic walkthrough"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] ring-1 ring-inset ring-white/10 text-emerald-100 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {isAutoplayOn ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-300" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-300" />
                <span>Autoplay</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleRestart}
            aria-label="Restart walkthrough from stage 1"
            title="Restart from stage 1"
            className="p-2 rounded-xl bg-white/[0.06] ring-1 ring-inset ring-white/10 text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="my-6 sm:my-7 relative z-10">
        <div className="relative">
          <div
            className="absolute top-5 sm:top-6 -translate-y-1/2 h-1 bg-white/10 rounded-full overflow-hidden z-0"
            style={{ left: "8.333%", right: "8.333%" }}
            aria-hidden="true"
          >
            <div
              className="h-full bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.6)] transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div
            className="grid grid-cols-6 relative z-10"
            role="tablist"
            aria-label="Donation lifecycle stages"
            onKeyDown={handleTabKeyDown}
          >
            {STAGES.map((stage, idx) => {
              const isCurrent = stage.id === activeStep;
              const isPast = stage.id < activeStep;
              const Icon = stage.icon;
              return (
                <button
                  key={stage.id}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`lifecycle-tab-${stage.id}`}
                  aria-selected={isCurrent}
                  aria-controls="lifecycle-panel"
                  tabIndex={isCurrent ? 0 : -1}
                  onClick={() => goTo(stage.id)}
                  className="flex flex-col items-center text-center group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl p-1"
                >
                  <div className="h-10 sm:h-12 w-full flex items-center justify-center relative">
                    {isCurrent && !reduced && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-emerald-400/40"
                        initial={{ scale: 1, opacity: 0.55 }}
                        animate={{ scale: 1.55, opacity: 0 }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                    <motion.div
                      animate={{ scale: isCurrent ? 1.1 : 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}
                      whileHover={reduced ? undefined : { scale: isCurrent ? 1.14 : 1.08 }}
                      whileTap={reduced ? undefined : { scale: 0.94 }}
                      className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 ${
                        isCurrent
                          ? "bg-linear-to-b from-emerald-300 to-emerald-500 border-2 border-white text-emerald-950 shadow-lg shadow-emerald-500/40"
                          : isPast
                          ? "bg-[#145A3A] border-2 border-emerald-300 text-emerald-100 shadow-sm"
                          : "bg-[#163F2C] border-2 border-emerald-400/45 text-emerald-100/85 group-hover:border-emerald-300 group-hover:text-white"
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />
                      ) : (
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </motion.div>
                  </div>
                  <div className="mt-1.5 sm:mt-2 min-h-[30px] sm:min-h-[34px] flex items-start justify-center w-full px-0.5">
                    <span
                      className={`text-[10px] sm:text-xs leading-tight transition-colors line-clamp-2 ${
                        isCurrent
                          ? "text-emerald-200 font-extrabold"
                          : isPast
                          ? "text-emerald-100/90 font-semibold"
                          : "text-emerald-100/55 font-medium group-hover:text-emerald-100"
                      }`}
                    >
                      <span className="sm:hidden">{stage.tiny}</span>
                      <span className="hidden sm:inline">{stage.short}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          id="lifecycle-panel"
          role="tabpanel"
          aria-labelledby={`lifecycle-tab-${current.id}`}
          variants={detailCardVariants}
          initial={reduced ? false : "hidden"}
          animate="visible"
          exit={reduced ? undefined : "exit"}
          className="bg-[#072016]/80 border border-emerald-400/20 rounded-2xl p-4 sm:p-5 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 md:min-h-[392px] overflow-hidden"
        >
          {/* Time until autoplay advances */}
          {isAutoAdvancing && (
            <motion.span
              key={`dwell-${current.id}`}
              aria-hidden="true"
              className="absolute left-0 top-0 h-0.5 bg-linear-to-r from-emerald-400 to-teal-300"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: STAGE_DWELL_MS / 1000, ease: "linear" }}
            />
          )}

          {/* Narrative */}
          <div className="md:col-span-6 flex flex-col gap-3">
            <motion.div variants={itemVariants} className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                Stage {String(current.id).padStart(2, "0")} of {String(STAGES.length).padStart(2, "0")}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ring-inset ${ACTOR_STYLES[current.actor]}`}>
                {current.actor}
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-b from-emerald-400/30 to-emerald-500/15 ring-1 ring-inset ring-emerald-300/50 shadow-[0_0_18px_-4px_rgba(52,211,153,0.55)] flex items-center justify-center text-emerald-100 shrink-0">
                <StepIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">{current.title}</h4>
                <p className="text-xs sm:text-[13px] text-emerald-100/85 leading-relaxed mt-1">{current.description}</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300/70">
                What FoodWise records
              </span>
              <ul className="space-y-1.5">
                {current.records.map((record) => (
                  <li key={record} className="flex items-start gap-2 text-[12px] text-emerald-50/85 leading-snug">
                    <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{record}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3 border-t border-white/[0.07]"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/70 mr-0.5">Status</span>
              {current.status.from && current.status.from !== current.status.to && (
                <>
                  <StatusChip status={current.status.from} className="opacity-55" />
                  <ArrowRight className="w-3 h-3 text-emerald-200/50" />
                </>
              )}
              {current.status.via && (
                <>
                  <StatusChip status={current.status.via} className="opacity-80" />
                  <ArrowRight className="w-3 h-3 text-emerald-200/50" />
                </>
              )}
              <StatusChip status={current.status.to} />
              <span className="text-[11px] text-emerald-100/65 basis-full sm:basis-auto">{current.status.note}</span>
            </motion.div>
          </div>

          {/* Live demo */}
          <motion.div variants={itemVariants} className="md:col-span-6 min-h-[290px]">
            <Visual reduced={reduced} />
          </motion.div>

          {/* Navigation */}
          <motion.div variants={itemVariants} className="md:col-span-12 flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => goTo(activeStep - 1)}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200/80 hover:text-white transition-colors cursor-pointer rounded-md px-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
              aria-label="Previous stage"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>{STAGES[(activeStep - 2 + STAGES.length) % STAGES.length].short}</span>
            </button>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {STAGES.map((stage) => (
                <span
                  key={stage.id}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    stage.id === activeStep ? "w-5 bg-emerald-300" : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => goTo(activeStep + 1)}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200/80 hover:text-white transition-colors cursor-pointer rounded-md px-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
              aria-label="Next stage"
            >
              <span>{STAGES[activeStep % STAGES.length].short}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Accuracy footnote, consistent with the platform's documented limits */}
      <p className="relative z-10 mt-4 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-emerald-100/50">
        <Info className="w-3 h-3 shrink-0 mt-0.5" />
        <span>
          Example uses a demo listing; times are illustrative. Match scores are rule-based guidance, the OTP coordinates the
          handover but doesn&apos;t verify identity or certify food safety, and impact figures are estimates.
        </span>
      </p>
    </div>
  );
}
