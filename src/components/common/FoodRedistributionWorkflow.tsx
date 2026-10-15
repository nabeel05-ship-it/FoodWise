"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSafeReducedMotion } from "@/lib/useHydrated";
import {
  Utensils,
  HeartHandshake,
  Key,
  Truck,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { MOTION_DURATIONS, MOTION_EASINGS, runSafeGsap } from "@/lib/motion";

export interface WorkflowStep {
  id: number;
  badge: string;
  title: string;
  shortDesc: string;
  detail: string;
  metric: string;
  metricLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  accent: string;
  locationContext: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    badge: "Stage 01 • Origin",
    title: "Surplus Declared",
    shortDesc: "Commercial kitchens & donors list edible surplus.",
    detail: "Hoteliers and commercial kitchens log excess banquet or meal portions with storage conditions, dietary tags, and FSSAI hygiene certification.",
    metric: "45 kg",
    metricLabel: "Surplus Recorded",
    icon: Utensils,
    tag: "FSSAI Verified",
    accent: "emerald",
    locationContext: "The Oberoi • MG Road Kitchens",
  },
  {
    id: 2,
    badge: "Stage 02 • Intelligence",
    title: "Smart Matching",
    shortDesc: "Instant proximity match with verified relief partners.",
    detail: "FoodWise's matching engine pairs the donation with nearby accredited food banks based on dietary need, travel distance, and capacity.",
    metric: "< 8 mins",
    metricLabel: "Average Matching Time",
    icon: HeartHandshake,
    tag: "Real-Time Pairing",
    accent: "blue",
    locationContext: "Matched to Bangalore Food Bank",
  },
  {
    id: 3,
    badge: "Stage 03 • Protocol",
    title: "Dock Handover & OTP",
    shortDesc: "Two-party authorization at the loading bay.",
    detail: "The assigned driver arrives at the service bay. A single-use 4-digit security code guarantees that the verified NGO receives the shipment.",
    metric: "OTP: 6482",
    metricLabel: "Encrypted Dock Verification",
    icon: Key,
    tag: "Secure Handover",
    accent: "amber",
    locationContext: "Service Gate 3 • Dock Handover",
  },
  {
    id: 4,
    badge: "Stage 04 • Logistics",
    title: "Temperature-Safe Transit",
    shortDesc: "Fleet coordinates thermal delivery directly to shelters.",
    detail: "Insulated food carriers ensure meals remain within HACCP temperature guidelines as the driver heads toward designated community shelters.",
    metric: "~24 mins",
    metricLabel: "Transit Window",
    icon: Truck,
    tag: "Fleet In Transit",
    accent: "teal",
    locationContext: "En route to Rajajinagar Community Hub",
  },
  {
    id: 5,
    badge: "Stage 05 • Verification",
    title: "Community Impact Verified",
    shortDesc: "Zero food to landfill, authenticated ESG ledger.",
    detail: "Redistribution confirmed. Impact metrics update in real time with exact meals served, kg diverted from municipal waste, and CO₂e saved.",
    metric: "140 Meals",
    metricLabel: "Nourished with Dignity",
    icon: Sparkles,
    tag: "SDG 2 & 12 Recorded",
    accent: "emerald",
    locationContext: "Verified & Added to Community Ledger",
  },
];

export default function FoodRedistributionWorkflow({
  compact = false,
}: {
  compact?: boolean;
}) {
  const prefersReduced = useSafeReducedMotion();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(!prefersReduced);
  const [isInView, setIsInView] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor visibility in viewport using IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Automatic continuous playback loop across all 5 stages
  useEffect(() => {
    if (!isPlaying || prefersReduced || !isInView) return;

    // 2.6 seconds per stage: brisk but still readable pacing
    const intervalTime = 2600;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev >= WORKFLOW_STEPS.length ? 1 : prev + 1));
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, prefersReduced, isInView, activeStep]);

  // Handle Play/Pause toggle
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Handle Restart: return to Stage 1 and immediately resume autoplay
  const handleRestart = useCallback(() => {
    setActiveStep(1);
    if (!prefersReduced) {
      setIsPlaying(true);
    }
  }, [prefersReduced]);

  // Handle manual stage selection: user actively focuses on a stage
  const handleStepSelect = useCallback((stepId: number) => {
    setActiveStep(stepId);
    // Pause autoplay so user can inspect the selected stage without automatic advance
    setIsPlaying(false);
  }, []);

  // Handle "Next Stage" button inside detail card
  const handleNextStep = useCallback(() => {
    setActiveStep((prev) => (prev >= WORKFLOW_STEPS.length ? 1 : prev + 1));
    setIsPlaying(false);
  }, []);

  // Safe GSAP subtle ambient telemetry card pulse on container mount
  useEffect(() => {
    if (prefersReduced || !containerRef.current) return;
    let cleanup: (() => void) | undefined;

    runSafeGsap(containerRef, ({ gsap }) => {
      gsap.fromTo(
        ".workflow-metric-card",
        { borderColor: "rgba(16, 185, 129, 0.25)" },
        {
          borderColor: "rgba(52, 211, 153, 0.55)",
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }
      );
    }).then((res) => {
      cleanup = res;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [prefersReduced]);

  const current = WORKFLOW_STEPS[activeStep - 1];
  const StepIcon = current.icon;

  // Percentage of the progress rail connecting Circle 1 (at 0%) to Circle 5 (at 100%)
  const progressPercent = ((activeStep - 1) / (WORKFLOW_STEPS.length - 1)) * 100;

  return (
    <div
      ref={containerRef}
      className={`w-full rounded-3xl bg-[#0B2519] text-white border border-emerald-500/20 shadow-xl overflow-hidden relative ${
        compact ? "p-4 sm:p-5" : "p-5 sm:p-7 lg:p-8"
      }`}
    >
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar with controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-emerald-500/20 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Verified Chain of Custody
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            How FoodWise Rescues Surplus Food
          </h3>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            Transparent 5-stage lifecycle from commercial kitchen handover to verified community meal delivery.
          </p>
        </div>

        {/* Play/Pause & Restart controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause automatic workflow cycle" : "Resume automatic workflow cycle"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 hover:text-white text-xs font-semibold hover:bg-emerald-800/80 transition-colors cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs">Autoplay</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            aria-label="Restart workflow at Stage 1"
            className="p-2 rounded-xl bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition-colors cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            title="Restart from Stage 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5-Step interactive timeline */}
      <div className="my-6 sm:my-7 relative z-10">
        <div className="relative">
          {/* 
            SHARED TIMELINE GEOMETRY:
            - 5 equal columns: Column centers are at 10%, 30%, 50%, 70%, 90% of total width.
            - The connector rail connects the center of Column 1 (10%) to the center of Column 5 (90%).
            - Vertical center: Circle heights are 36px (mobile) / 44px (desktop) centered inside h-10 (40px) / h-12 (48px).
            - The rail vertical center is placed at exactly top-5 (20px) / sm:top-6 (24px) -translate-y-1/2,
              passing through the exact center of every circular stage indicator.
          */}
          <div
            className="absolute top-5 sm:top-6 -translate-y-1/2 h-1 bg-emerald-950/90 rounded-full overflow-hidden z-0"
            style={{ left: "10%", right: "10%" }}
            aria-hidden="true"
          >
            {/* Active progress track terminating precisely at the active stage center */}
            <div
              className="h-full bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>

          {/* Stepper Node Columns */}
          <div className="grid grid-cols-5 relative z-10" role="tablist" aria-label="Workflow Stages">
            {WORKFLOW_STEPS.map((step) => {
              const isCurrent = step.id === activeStep;
              const isPast = step.id < activeStep;
              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Stage ${step.id}: ${step.title}`}
                  onClick={() => handleStepSelect(step.id)}
                  className="flex flex-col items-center text-center group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl p-1"
                >
                  {/* Circle Node Container: Fixed height guarantees rail passes through exact center */}
                  <div className="h-10 sm:h-12 w-full flex items-center justify-center relative">
                    <motion.div
                      whileHover={prefersReduced ? undefined : { scale: 1.08 }}
                      whileTap={prefersReduced ? undefined : { scale: 0.94 }}
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        isCurrent
                          ? "bg-emerald-500 border-2 border-white text-gray-950 shadow-xl shadow-emerald-500/40 ring-4 ring-emerald-400/30 font-bold"
                          : isPast
                          ? "bg-[#0B3822] border-2 border-emerald-400 text-emerald-300 shadow-sm"
                          : "bg-[#081F14] border-2 border-emerald-800/80 text-emerald-600 hover:border-emerald-600 hover:text-emerald-400"
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                      ) : (
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </motion.div>
                  </div>

                  {/* Stage Title Label: Dedicated row with fixed min-height to prevent vertical layout shifts */}
                  <div className="mt-1.5 sm:mt-2 text-center min-h-[30px] sm:min-h-[34px] flex items-start justify-center w-full px-0.5">
                    <span
                      className={`text-[10px] sm:text-xs leading-tight transition-colors line-clamp-2 ${
                        isCurrent
                          ? "text-emerald-300 font-extrabold"
                          : isPast
                          ? "text-emerald-100/90 font-semibold"
                          : "text-emerald-700/80 font-medium group-hover:text-emerald-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Stage Detail Hero Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={prefersReduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: MOTION_DURATIONS.fast, ease: MOTION_EASINGS.apple }}
          className="bg-emerald-950/70 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
        >
          {/* Left info (8 cols) */}
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {current.badge}
              </span>
              <span className="text-[10px] text-emerald-200/80 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{current.locationContext}</span>
              </span>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
                <StepIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {current.title}
                </h4>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mt-0.5">
                  {current.detail}
                </p>
              </div>
            </div>
          </div>

          {/* Right metric card (4 cols) */}
          <div className="workflow-metric-card md:col-span-4 bg-[#061B12] rounded-xl p-3.5 border border-emerald-500/25 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                {current.metricLabel}
              </span>
              <div className="text-xl sm:text-2xl font-black font-display tabular-nums text-white mt-0.5 tracking-tight">
                {current.metric}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-300 font-semibold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{current.tag}</span>
              </span>
              <button
                type="button"
                onClick={handleNextStep}
                className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded-md px-1"
                aria-label="Advance to next workflow stage"
              >
                <span>Next</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
