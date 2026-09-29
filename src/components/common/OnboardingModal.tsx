"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  X,
  Building2,
  Factory,
  Cpu,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Wifi,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function OnboardingModal() {
  const { isOnboardingOpen, setIsOnboardingOpen, setCurrentRole } = useApp();
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [institutionType, setInstitutionType] = useState<"kitchen" | "factory">("kitchen");
  const [orgName, setOrgName] = useState("IIT Delhi Central Mess");
  const [city, setCity] = useState("New Delhi");
  const [fssai, setFssai] = useState("10019011006542");
  const [iotDevices, setIotDevices] = useState([
    { id: "iot-1", name: "Cold Storage Sensor A-01", type: "Temperature & Humidity", connected: true },
    { id: "iot-2", name: "Weighing Scale WS-04", type: "Continuous Mass Telemetry", connected: true },
    { id: "iot-3", name: "Steam Jacket Fryer Sensor", type: "Thermal Gradient", connected: false },
  ]);

  const closeModal = useCallback(() => {
    setIsOnboardingOpen(false);
    setStep(1);
  }, [setIsOnboardingOpen]);

  useEffect(() => {
    if (!isOnboardingOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOnboardingOpen, closeModal]);

  if (!isOnboardingOpen) return null;

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
      if (step === 4) {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!prefersReducedMotion) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } else {
      if (institutionType === "kitchen") {
        setCurrentRole("KITCHEN_MANAGER");
      } else {
        setCurrentRole("FACTORY_MANAGER");
      }
      setIsOnboardingOpen(false);
      setStep(1);
    }
  };

  const toggleDevice = (id: string) => {
    setIotDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, connected: !d.connected } : d))
    );
  };

  const stepLabels = [t("onboard.organization"), t("onboard.details"), t("onboard.iot_sensors"), t("onboard.ngo_network"), t("onboard.complete_label")];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-label="FoodWise Onboarding"
    >
      <div
        className="w-full max-w-2xl bg-white border border-[#E8ECF3] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8ECF3] flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827]">{t("onboard.title")}</h2>
              <p className="text-xs text-[#6B7280]">{t("onboard.step")} {step} {t("onboard.of")} 5 — {stepLabels[step - 1]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {step < 5 && (
              <button
                onClick={closeModal}
                className="text-xs font-medium text-[#6B7280] hover:text-[#111827] px-3 py-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
              >
                {t("common.skip")}
              </button>
            )}
            <button
              onClick={closeModal}
              aria-label="Close onboarding"
              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step indicators */}
        <div className="px-6 py-3 bg-[#FAFBFC] border-b border-[#E8ECF3] flex items-center gap-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => { if (i + 1 < step) setStep(i + 1); }}
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  i + 1 === step
                    ? "bg-emerald-500 text-white shadow-sm"
                    : i + 1 < step
                    ? "bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200"
                    : "bg-[#E8ECF3] text-[#9CA3AF]"
                }`}
              >
                {i + 1 < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </button>
              {i < stepLabels.length - 1 && (
                <div className={`flex-1 h-0.5 rounded ${i + 1 < step ? "bg-emerald-300" : "bg-[#E8ECF3]"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111827]">{t("onboard.org_type")}</h3>
              <p className="text-sm text-[#6B7280]">
                {t("onboard.org_desc")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() => setInstitutionType("kitchen")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setInstitutionType("kitchen"); }}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    institutionType === "kitchen"
                      ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500"
                      : "bg-white border-[#E8ECF3] hover:border-[#D1D5DB]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#111827] mb-1">{t("onboard.kitchen_title")}</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {t("onboard.kitchen_desc")}
                  </p>
                </div>

                <div
                  onClick={() => setInstitutionType("factory")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setInstitutionType("factory"); }}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    institutionType === "factory"
                      ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500"
                      : "bg-white border-[#E8ECF3] hover:border-[#D1D5DB]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <Factory className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#111827] mb-1">{t("onboard.factory_title")}</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {t("onboard.factory_desc")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111827]">{t("onboard.facility_details")}</h3>
              <p className="text-sm text-[#6B7280]">
                {t("onboard.facility_desc")}
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    {t("onboard.facility_label")}
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">{t("onboard.city")}</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">{t("onboard.fssai_license")}</label>
                    <input
                      type="text"
                      value={fssai}
                      onChange={(e) => setFssai(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111827]">{t("onboard.iot_title")}</h3>
              <p className="text-sm text-[#6B7280]">
                {t("onboard.iot_desc")}
              </p>

              <div className="space-y-2.5 pt-2">
                {iotDevices.map((device) => (
                  <div
                    key={device.id}
                    className="p-3 rounded-xl border border-[#E8ECF3] bg-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center text-[#6B7280]">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#111827]">{device.name}</div>
                        <div className="text-xs text-[#6B7280]">{device.type}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleDevice(device.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                        device.connected
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB] hover:bg-[#E8ECF3]"
                      }`}
                    >
                      <Wifi className="w-3 h-3" />
                      {device.connected ? t("common.connected") : t("common.connect")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#111827]">{t("onboard.ngo_title")}</h3>
              <p className="text-sm text-[#6B7280]">
                {t("onboard.ngo_desc")}
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HeartHandshake className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-sm font-semibold text-[#111827]">Robin Hood Army — Delhi NCR</div>
                      <div className="text-xs text-[#6B7280]">3.2 km away — 150 kg capacity</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">{t("common.linked")}</span>
                </div>

                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HeartHandshake className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-sm font-semibold text-[#111827]">Aasha Shelter & Orphanage</div>
                      <div className="text-xs text-[#6B7280]">4.8 km away — 80 kg capacity</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">{t("common.linked")}</span>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">{t("onboard.complete")}</h3>
              <p className="text-sm text-[#6B7280] max-w-md mx-auto leading-relaxed">
                FoodWise has been configured for <span className="text-[#111827] font-semibold">{orgName}</span>. {t("onboard.complete_desc")}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8ECF3] bg-[#FAFBFC] flex items-center justify-between">
          {step > 1 && step < 5 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> {t("common.back")}
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/25 transition-all"
          >
            {step === 5 ? t("onboard.launch") : t("common.continue")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
