"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import LanguageToggle from "@/components/common/LanguageToggle";
import {
  Sparkles,
  Utensils,
  BarChart3,
  Bell,
  LogIn,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { unreadCount, setIsNotificationOpen, userRole, activeDonor } = useApp();
  const { t } = useLang();

  const isHotel = userRole === "HOTEL" || activeDonor?.type === "Hotel";
  const isHousehold = userRole === "HOUSEHOLD" || activeDonor?.type === "Household";
  const isNgo = userRole === "NGO";

  const dashboardHref = isHotel
    ? "/hotel/dashboard"
    : isHousehold
    ? "/household/dashboard"
    : isNgo
    ? "/ngo/dashboard"
    : "/restaurant/dashboard";

  const donateOrFindHref = isNgo
    ? "/ngo/find"
    : isHotel
    ? "/hotel/donate"
    : isHousehold
    ? "/household/donate"
    : "/restaurant/donate";

  const navLinks = [
    { label: t("common.overview"), href: "/" },
    {
      label: t("nav.dashboard"),
      href: dashboardHref,
      icon: Utensils,
    },
    {
      label: isNgo ? t("nav.find_food") : t("nav.donate_food"),
      href: donateOrFindHref,
      icon: Sparkles,
    },
    { label: t("nav.impact"), href: "/dashboard/impact", icon: BarChart3 },
  ];

  return (
    <header
      className="sticky top-0 z-30 w-full backdrop-blur-xl"
      style={{
        background: "rgba(255,255,255,0.85)",
        borderBottom: "1px solid #E8ECF3",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <img
            src="/logo.png"
            alt="FoodWise Logo"
            className="w-9 h-9 object-contain group-hover:scale-105 transition-transform shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight" style={{ color: "#111827" }}>
                FoodWise
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{
                  background: "#ECFDF5",
                  color: "#10B981",
                  border: "1px solid #A7F3D0",
                }}
              >
                {t("nav.community_platform")}
              </span>
            </div>
            <p className="text-[11px] font-medium hidden sm:block" style={{ color: "#9CA3AF" }}>
              {t("nav.dont_let_good_food")}
            </p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav
          className="hidden md:flex items-center gap-1 p-1 rounded-xl"
          style={{ background: "#F4F6FA", border: "1px solid #E8ECF3" }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                style={{
                  background: isActive ? "#10B981" : "transparent",
                  color: isActive ? "#FFFFFF" : "#6B7280",
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <LanguageToggle compact className="bg-slate-100/90 text-slate-800 border-slate-200" />

          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-xl transition-colors shrink-0"
            style={{
              background: "#F4F6FA",
              border: "1px solid #E8ECF3",
              color: "#6B7280",
            }}
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{ background: "#EF4444" }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0"
            style={{
              background: "#F4F6FA",
              border: "1px solid #E8ECF3",
              color: "#374151",
            }}
          >
            <LogIn className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
            <span className="hidden sm:inline">{t("nav.sign_in")}</span>
          </Link>

          <Link
            href={donateOrFindHref}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 shrink-0"
            style={{
              background: "#10B981",
              color: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isNgo
                ? t("nav.find_food")
                : t("nav.donate_food")}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
