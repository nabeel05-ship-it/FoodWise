"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Trash2,
  PackageCheck,
  HeartHandshake,
  Route,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Utensils,
  ThermometerSnowflake,
  ShieldCheck,
  Star,
  Bell,
  Sparkles,
  Truck,
  Clock,
  Trophy,
  LucideIcon,
  Menu,
  X,
  LogOut,
  Users,
  CheckCircle2,
} from "lucide-react";
import { INSTITUTIONS } from "@/lib/mockData";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { tabSpringTransition, badgePopVariants } from "@/lib/motion";
import LanguageToggle from "@/components/common/LanguageToggle";

interface SidebarProps {
  type: "hotel" | "household" | "ngo" | "kitchen";
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  highlight?: boolean;
}

function SidebarContent({ type }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { unreadCount, setIsNotificationOpen, setIsSettingsOpen, activeDonor, activeNgo, logout, userRole } = useApp();
  const { t } = useLang();

  // Resolve role: "hotel" | "household" | "ngo"
  const role: "hotel" | "household" | "ngo" =
    type === "hotel" || type === "household" || type === "ngo"
      ? type
      : userRole === "HOTEL" || activeDonor?.type === "Hotel"
      ? "hotel"
      : userRole === "HOUSEHOLD" || activeDonor?.type === "Household"
      ? "household"
      : userRole === "NGO"
      ? "ngo"
      : "hotel";

  const institution =
    role === "hotel"
      ? {
          name: activeDonor?.name || "The Oberoi, Bengaluru",
          city: activeDonor?.city || "MG Road, Bengaluru",
          fssai: activeDonor?.fssaiNumber || "Verified Commercial Partner",
          code: "COMMERCIAL-DONOR",
          category: t("Restaurant / Hotel Partner"),
        }
      : role === "household"
      ? {
          name: activeDonor?.name || "Local Resident (Demo Account)",
          city: activeDonor?.city || "Jayanagar, Bengaluru",
          fssai: "Verified Community Contributor",
          code: "HOUSEHOLD-DONOR",
          category: t("Household Donor"),
        }
      : {
          name: activeNgo?.name || "Bangalore Food Bank (Bengaluru Central Hub)",
          city: activeNgo?.city || "Rajajinagar, Bengaluru",
          fssai: activeNgo?.registrationNumber || "NGO DARPAN Verified Partner",
          code: "NGO-RELIEF-HUB",
          category: t("Relief NGO Partner"),
        };

  // 1 & 2. Unified Restaurant / Hotel Navigation
  const hotelNav: NavItem[] = [
    { label: t("nav.dashboard"), href: "/hotel/dashboard", icon: LayoutDashboard },
    { label: t("nav.donate_food"), href: "/hotel/donate", icon: HeartHandshake, badge: t("nav.post_meals"), highlight: true },
    { label: t("nav.my_donations"), href: "/hotel/donations", icon: PackageCheck },
    { label: t("nav.pickup_handover"), href: "/hotel/pickups", icon: Truck },
    { label: t("nav.impact"), href: "/hotel/impact", icon: Sparkles },
    { label: t("nav.profile"), href: "/hotel/profile", icon: Users },
  ];

  // 3. Household Navigation (Simple & lightweight)
  const householdNav: NavItem[] = [
    { label: t("nav.home"), href: "/household/dashboard", icon: LayoutDashboard },
    { label: t("nav.donate_food"), href: "/household/donate", icon: HeartHandshake, badge: t("nav.share_food"), highlight: true },
    { label: t("nav.my_donations"), href: "/household/donations", icon: PackageCheck },
    { label: t("nav.impact"), href: "/household/impact", icon: Sparkles },
    { label: t("nav.profile"), href: "/household/profile", icon: Users },
  ];

  // 4. NGO Navigation
  const ngoNav: NavItem[] = [
    { label: t("nav.dashboard"), href: "/ngo/dashboard", icon: LayoutDashboard },
    { label: t("nav.find_food"), href: "/ngo/dashboard?tab=claims", icon: PackageCheck, badge: t("nav.live_feed"), highlight: true },
    { label: t("nav.accepted_donations"), href: "/ngo/dashboard?tab=scheduled", icon: Truck },
    { label: t("nav.completed"), href: "/ngo/dashboard?tab=history", icon: CheckCircle2 },
    { label: "Food Issues", href: "/ngo/food-issues", icon: ShieldCheck, highlight: true },
    { label: t("nav.impact"), href: "/ngo/impact", icon: Sparkles },
    { label: t("nav.profile"), href: "/ngo/profile", icon: Users },
  ];

  const navItems =
    role === "hotel"
      ? hotelNav
      : role === "household"
      ? householdNav
      : ngoNav;

  const accentColor = "#10B981";

  const getInstitutionCategory = () => institution.category;

  const getUserProfile = () => {
    if (role === "ngo") {
      return {
        initials: "PV",
        name: activeNgo?.lead || "Pooja Verma",
        role: t("NGO Relief Coordinator"),
      };
    }
    const initials = activeDonor?.name
      ? activeDonor.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "DN";
    return {
      initials,
      name: activeDonor?.contactPerson || activeDonor?.name || "Donor Manager",
      role:
        role === "hotel"
          ? t("Operations & Banquet Lead")
          : t("Household Contributor"),
    };
  };

  const profile = getUserProfile();

  return (
    <>
      {/* Mobile Top Header Bar */}
      <header className="md:hidden sticky top-0 z-30 w-full bg-[#072B1E]/95 backdrop-blur-md border-b border-white/[0.06] px-3.5 py-2.5 flex items-center justify-between shadow-lg shadow-black/10">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="p-2 rounded-xl bg-white/[0.06] text-emerald-200 hover:text-white hover:bg-white/10 ring-1 ring-inset ring-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FoodWise Logo" className="w-7 h-7 object-contain shrink-0" />
            <div>
              <span className="font-extrabold text-sm text-white block leading-tight">FoodWise</span>
              <span className="text-[9px] font-semibold text-emerald-300 block capitalize">
                {type === "hotel" ? "Restaurant / Hotel Portal" : `${type} Portal`}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsNotificationOpen(true)}
            aria-label="Notifications"
            className="relative p-2 rounded-xl bg-white/[0.06] text-emerald-200 hover:text-white hover:bg-white/10 ring-1 ring-inset ring-white/10 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  key={unreadCount}
                  variants={badgePopVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center leading-none ring-2 ring-[#072B1E] tabular-nums"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Settings"
            className="p-2 rounded-xl bg-white/[0.06] text-emerald-200 hover:text-white hover:bg-white/10 ring-1 ring-inset ring-white/10 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-[#03140C]/65 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="relative w-[285px] max-w-[85vw] h-full flex flex-col z-10 shadow-2xl border-r border-white/[0.06]"
              style={{
                background:
                  "radial-gradient(120% 45% at 0% 0%, rgba(16, 185, 129, 0.16) 0%, transparent 60%), linear-gradient(180deg, #072B1E 0%, #052117 60%, #031710 100%)",
              }}
            >
              {/* Top Drawer Header */}
              <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06] shrink-0">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="FoodWise Logo" className="w-8 h-8 object-contain shrink-0" />
                  <div>
                    <div className="text-sm font-extrabold text-white">FoodWise</div>
                    <div className="text-[10px] text-emerald-300 font-medium">{t("app.slogan")}</div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/40 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current Role Identity */}
              <div className="px-3 pt-3 pb-2 shrink-0">
                <div className="p-2.5 rounded-xl flex items-center gap-2 bg-white/[0.04] ring-1 ring-inset ring-white/[0.07]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white truncate">{institution.name}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-300 ml-auto tracking-wider">
                    {institution.category}
                  </span>
                </div>
              </div>

              {/* Nav items list */}
              <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href.includes("?tab=") && searchParams.get("tab") === item.href.split("tab=")[1]);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-linear-to-r from-emerald-400/25 to-emerald-400/5 text-white ring-1 ring-inset ring-emerald-300/20"
                          : "text-emerald-100/80 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-emerald-300" : item.highlight ? "text-amber-300" : "text-emerald-400/90"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-400/10 text-amber-200 ring-1 ring-inset ring-amber-300/25">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="p-3 border-t border-white/[0.06] bg-black/20 space-y-2 shrink-0">
                <LanguageToggle compact tone="dark" className="w-full justify-between" />
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>{t("common.logout")}</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex sticky top-0 h-screen shrink-0 z-20 flex-col transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[272px]"
        } border-r border-white/[0.06] shadow-[1px_0_0_rgba(0,0,0,0.25)]`}
        style={{
          background:
            "radial-gradient(120% 40% at 0% 0%, rgba(16, 185, 129, 0.16) 0%, transparent 60%), linear-gradient(180deg, #072B1E 0%, #052117 60%, #031710 100%)",
        }}
      >
      {/* Brand / Logo Area */}
      <div
        className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="FoodWise Logo"
            className="w-9 h-9 object-contain group-hover:scale-105 transition-transform shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-display text-[15px] font-extrabold text-white tracking-tight whitespace-nowrap">
                FoodWise
              </div>
              <div
                className="text-[10px] font-medium whitespace-nowrap"
                style={{ color: "#A7F3D0" }}
              >
                {t("app.tagline")}
              </div>
            </div>
          )}
        </Link>
      </div>


      {/* Institution Identity */}
      <div className="px-3 pt-3 pb-1">
        {!collapsed ? (
          <div className="rounded-xl px-3 py-2.5 bg-white/[0.04] ring-1 ring-inset ring-white/[0.07]">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: accentColor }}
              />
              <span
                className="text-[10px] uppercase font-bold tracking-wider"
                style={{ color: "#34D399" }}
              >
                {getInstitutionCategory()}
              </span>
            </div>
            <h2 className="text-[13px] font-bold text-white leading-tight line-clamp-1">
              {institution.name}
            </h2>
            <div
              className="flex items-center gap-1.5 mt-1.5 text-[10px]"
              style={{ color: "#A7F3D0" }}
            >
              <ShieldCheck className="w-3 h-3" style={{ color: "#10B981" }} />
              <span>{t("inst.fssai_verified")}</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
              <span
                className="font-mono-data"
                style={{ color: "rgba(167, 243, 208, 0.7)" }}
              >
                {institution.code}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(16, 185, 129, 0.2)",
                color: accentColor,
              }}
            >
              {type === "kitchen" ? (
                <Utensils className="w-4.5 h-4.5" />
              ) : (
                <HeartHandshake className="w-4.5 h-4.5" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto sidebar-scroll">
        {!collapsed && (
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2 px-3"
            style={{ color: "rgba(167, 243, 208, 0.55)" }}
          >
            {t("nav.navigation")}
          </div>
        )}
        {navItems.map((item) => {
          const tab = searchParams?.get("tab");
          let isActive = false;
          if (item.href.includes("?tab=")) {
            const itemTab = item.href.split("?tab=")[1];
            isActive = pathname === "/ngo/dashboard" && tab === itemTab;
          } else if (item.href === "/ngo/dashboard") {
            isActive = pathname === "/ngo/dashboard" && !tab;
          } else {
            isActive = pathname === item.href;
          }
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl text-[13px] transition-colors relative ${
                collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
              } ${
                isActive
                  ? "text-white font-semibold"
                  : "text-emerald-50/75 font-medium hover:text-white hover:bg-white/[0.045]"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="desktopSidebarActiveIndicator"
                  transition={tabSpringTransition}
                  className="absolute inset-0 rounded-xl bg-linear-to-r from-emerald-400/20 via-emerald-400/[0.08] to-transparent ring-1 ring-inset ring-emerald-300/15 pointer-events-none -z-10"
                >
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.6)]" />
                </motion.div>
              )}
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110 ${
                  isActive
                    ? "text-emerald-300"
                    : item.highlight
                    ? "text-amber-300"
                    : "text-emerald-400/80 group-hover:text-emerald-300"
                }`}
              />
              {!collapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`shrink-0 text-[9.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ring-1 ring-inset ${
                        item.highlight
                          ? "bg-amber-400/10 text-amber-200 ring-amber-300/25"
                          : "bg-emerald-400/10 text-emerald-200 ring-emerald-300/25"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - Notifications + Settings */}
      <div className="px-3 py-2 border-t border-white/[0.06] space-y-0.5">
        {!collapsed && (
          <div className="px-1 pt-1 pb-1.5">
            <LanguageToggle compact tone="dark" className="w-full justify-between" />
          </div>
        )}
        <button
          onClick={() => setIsNotificationOpen(true)}
          className={`w-full flex items-center gap-3 rounded-xl text-[13px] font-medium transition-colors cursor-pointer text-emerald-50/75 hover:text-white hover:bg-white/[0.045] ${
            collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
          }`}
          title={collapsed ? "Notifications" : undefined}
        >
          <div className="relative">
            <Bell className="w-[18px] h-[18px] text-emerald-400/80" />
            {unreadCount > 0 && collapsed && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 flex items-center justify-between">
              <span>{t("common.notifications")}</span>
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    key={unreadCount}
                    variants={badgePopVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-bold leading-none bg-rose-500 text-white shadow-[0_0_0_3px_rgba(244,63,94,0.15)] tabular-nums"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`w-full flex items-center gap-3 rounded-xl text-[13px] font-medium transition-colors cursor-pointer text-emerald-50/75 hover:text-white hover:bg-white/[0.045] ${
            collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
          }`}
          title={collapsed ? t("common.settings") : undefined}
        >
          <Settings className="w-[18px] h-[18px] text-emerald-400/80" />
          {!collapsed && <span>{t("common.settings")}</span>}
        </button>
      </div>

      {/* User Profile + Collapse Toggle */}
      <div
        className="px-3 py-3 border-t border-white/[0.06] bg-black/20"
      >
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold text-white shadow-md shadow-emerald-950/50 ring-1 ring-inset ring-white/20 shrink-0"
                style={{
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                }}
              >
                {profile.initials}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-white leading-tight truncate">
                  {profile.name}
                </div>
                <div className="text-[10px] truncate" style={{ color: "#A7F3D0" }}>
                  {profile.role}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="p-1.5 rounded-lg text-emerald-300 hover:text-red-300 hover:bg-red-500/20 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 rounded-lg transition-colors cursor-pointer text-emerald-300 hover:text-white hover:bg-emerald-500/20"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold text-white shadow-md shadow-emerald-950/50 ring-1 ring-inset ring-white/20"
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              }}
              title={`${profile.name} (${profile.role})`}
            >
              {profile.initials}
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-red-300 hover:bg-red-500/20 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg transition-colors cursor-pointer text-emerald-300 hover:text-white hover:bg-emerald-500/20"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <Suspense fallback={<aside className="sticky top-0 h-screen shrink-0 z-20 w-[260px] bg-[#072B1E]" />}>
      <SidebarContent {...props} />
    </Suspense>
  );
}
