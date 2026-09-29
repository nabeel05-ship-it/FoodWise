"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  Utensils,
  Factory,
  HeartHandshake,
  BarChart3,
  Bell,
  ChevronUp,
  ChevronDown,
  Wand2,
  Terminal,
  X,
} from "lucide-react";
import LanguageToggle from "@/components/common/LanguageToggle";

export default function JudgeDemoBar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentRole,
    setCurrentRole,
    unreadCount,
    setIsNotificationOpen,
    setIsOnboardingOpen,
    setIsApiInspectorOpen,
  } = useApp();
  const { t } = useLang();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-4 right-4 z-40 w-10 h-10 rounded-full bg-emerald-500 text-white shadow-lg flex items-center justify-center hover:bg-emerald-600 transition-colors"
        aria-label="Show demo bar"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
    );
  }

  const quickLinks = [
    { label: t("nav.kitchen"), href: "/kitchen/dashboard", icon: Utensils },
    { label: t("demo.ai_forecast"), href: "/kitchen/prediction", icon: Wand2 },
    { label: t("demo.surplus"), href: "/kitchen/surplus", icon: BarChart3 },
    { label: t("nav.factory"), href: "/factory/dashboard", icon: Factory },
    { label: t("demo.spoilage"), href: "/factory/spoilage", icon: Factory },
    { label: t("demo.machines"), href: "/factory/machines", icon: Factory },
    { label: t("demo.impact"), href: "/dashboard/impact", icon: BarChart3 },
    { label: t("demo.ngo_portal"), href: "/ngo/dashboard", icon: HeartHandshake },
  ];

  const handleRoleChange = (role: typeof currentRole, targetUrl: string) => {
    setCurrentRole(role);
    router.push(targetUrl);
  };

  return (
    <aside aria-label="Demo Navigation Bar" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-5xl w-[96%] px-2 pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-[#E5E7EB] rounded-2xl shadow-xl p-2.5 transition-all duration-300">
        {/* Top bar with role switcher */}
        <div className="flex items-center justify-between gap-2 px-2 pb-2 border-b border-[#E8ECF3]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-bold text-[#111827] text-xs tracking-wide">{t("demo.title")}</span>

            {/* Role Switcher — now visible on all screens */}
            <div className="flex items-center bg-[#F3F4F6] rounded-lg p-0.5 border border-[#E8ECF3] text-[11px] sm:text-xs">
              <button
                onClick={() => handleRoleChange("KITCHEN_MANAGER", "/kitchen/dashboard")}
                className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors ${
                  currentRole === "KITCHEN_MANAGER"
                    ? "bg-emerald-500 text-white font-bold shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                {t("nav.kitchen")}
              </button>
              <button
                onClick={() => handleRoleChange("FACTORY_MANAGER", "/factory/dashboard")}
                className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors ${
                  currentRole === "FACTORY_MANAGER"
                    ? "bg-emerald-500 text-white font-bold shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                {t("nav.factory")}
              </button>
              <button
                onClick={() => handleRoleChange("NGO_PARTNER", "/ngo/dashboard")}
                className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors ${
                  currentRole === "NGO_PARTNER"
                    ? "bg-emerald-500 text-white font-bold shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                {t("nav.ngo")}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-2 py-1 text-[11px] rounded-lg bg-[#F3F4F6] hover:bg-[#E8ECF3] text-[#374151] font-medium border border-[#E8ECF3] hidden sm:flex items-center gap-1 transition-colors"
            >
              <Wand2 className="w-3 h-3 text-emerald-500" />
              {t("demo.setup")}
            </button>

            <button
              onClick={() => setIsApiInspectorOpen(true)}
              className="px-2 py-1 text-[11px] rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 hidden sm:flex items-center gap-1 transition-colors"
              title="Test live REST AI microservices"
            >
              <Terminal className="w-3 h-3" />
              {t("demo.apis")}
            </button>

            <LanguageToggle
              compact
              className="bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
            />

            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-1.5 rounded-lg bg-[#F3F4F6] hover:bg-[#E8ECF3] text-[#374151] border border-[#E8ECF3] transition-colors"
              aria-label="Open notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
              aria-label={isExpanded ? "Collapse demo bar" : "Expand demo bar"}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
              aria-label="Dismiss demo bar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick links row */}
        {isExpanded && (
          <div className="flex items-center gap-1.5 pt-2 overflow-x-auto scrollbar-none text-xs">
            {quickLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 font-medium transition-all text-xs ${
                    isActive
                      ? "bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20"
                      : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#9CA3AF]"}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
