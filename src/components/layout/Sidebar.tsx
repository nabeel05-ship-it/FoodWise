"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
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

interface SidebarProps {
  type: "restaurant" | "hotel" | "household" | "ngo" | "kitchen";
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

  // Resolve role: "restaurant" | "hotel" | "household" | "ngo"
  const role: "restaurant" | "hotel" | "household" | "ngo" =
    type === "restaurant" || type === "hotel" || type === "household" || type === "ngo"
      ? type
      : userRole === "HOTEL" || activeDonor?.type === "Hotel"
      ? "hotel"
      : userRole === "HOUSEHOLD" || activeDonor?.type === "Household"
      ? "household"
      : userRole === "NGO"
      ? "ngo"
      : "restaurant";

  const institution =
    role === "restaurant"
      ? {
          name: activeDonor?.name || "Green Leaf Restaurant",
          city: activeDonor?.city || "Connaught Place, New Delhi",
          fssai: activeDonor?.fssaiNumber || "Verified Food Partner",
          code: "RESTAURANT-DONOR",
          category: t("Restaurant Donor"),
        }
      : role === "hotel"
      ? {
          name: activeDonor?.name || "Hotel Mayura Grand",
          city: activeDonor?.city || "Bangalore / Shimoga",
          fssai: activeDonor?.fssaiNumber || "Verified Banquet Partner",
          code: "HOTEL-DONOR",
          category: t("Hotel & Banquet Donor"),
        }
      : role === "household"
      ? {
          name: activeDonor?.name || "Sharma Family Residence",
          city: activeDonor?.city || "Hauz Khas, New Delhi",
          fssai: "Verified Community Contributor",
          code: "HOUSEHOLD-DONOR",
          category: t("Household Donor"),
        }
      : {
          name: activeNgo?.name || "Robin Hood Army (Delhi Chapter)",
          city: activeNgo?.city || "South & Central Delhi",
          fssai: activeNgo?.registrationNumber || "NGO DARPAN Verified Partner",
          code: "NGO-RELIEF-HUB",
          category: t("Relief NGO Partner"),
        };

  // 1. Restaurant Navigation
  const restaurantNav: NavItem[] = [
    { label: t("nav.dashboard"), href: "/restaurant/dashboard", icon: LayoutDashboard },
    { label: t("nav.donate_food"), href: "/restaurant/donate", icon: HeartHandshake, badge: t("nav.post_food"), highlight: true },
    { label: t("nav.my_donations"), href: "/restaurant/donations", icon: PackageCheck },
    { label: t("nav.pickup_handover"), href: "/restaurant/pickups", icon: Truck },
    { label: t("nav.impact"), href: "/restaurant/impact", icon: Sparkles },
    { label: t("nav.profile"), href: "/restaurant/profile", icon: Users },
  ];

  // 2. Hotel Navigation
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
    role === "restaurant"
      ? restaurantNav
      : role === "hotel"
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
        role === "restaurant"
          ? t("Restaurant Lead")
          : role === "hotel"
          ? t("Banquet Manager")
          : t("Household Contributor"),
    };
  };

  const profile = getUserProfile();

  return (
    <>
      {/* Mobile Top Header Bar */}
      <header className="md:hidden sticky top-0 z-30 w-full bg-[#072B1E] border-b border-emerald-500/20 px-3.5 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="p-2 rounded-xl bg-emerald-900/50 text-emerald-300 hover:text-white border border-emerald-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FoodWise Logo" className="w-7 h-7 object-contain shrink-0" />
            <div>
              <span className="font-extrabold text-sm text-white block leading-tight">FoodWise</span>
              <span className="text-[9px] font-semibold text-emerald-300 block capitalize">{type} Portal</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsNotificationOpen(true)}
            aria-label="Notifications"
            className="relative p-2 rounded-xl bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Settings"
            className="p-2 rounded-xl bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="relative w-[285px] max-w-[85vw] h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200 border-r border-emerald-500/20"
            style={{
              background: "linear-gradient(180deg, #072B1E 0%, #052117 60%, #031710 100%)",
            }}
          >
            {/* Top Drawer Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-emerald-500/20 shrink-0">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="FoodWise Logo" className="w-8 h-8 object-contain shrink-0" />
                <div>
                  <div className="text-sm font-extrabold text-white">FoodWise</div>
                  <div className="text-[10px] text-emerald-300 font-medium">{t("app.slogan")}</div>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/40 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Role Identity */}
            <div className="px-3 pt-3 pb-2 shrink-0">
              <div className="p-2 rounded-xl flex items-center gap-2 border border-emerald-500/20 bg-black/30">
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
                        ? "bg-[#10B981] text-white shadow-md shadow-emerald-950/60"
                        : "text-emerald-200 hover:bg-emerald-500/15 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-emerald-500/20 bg-black/25 space-y-2 shrink-0">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>{t("common.logout")}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex sticky top-0 h-screen shrink-0 z-20 flex-col transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[272px]"
        } border-r border-[#10B981]/20`}
        style={{
          background: "linear-gradient(180deg, #072B1E 0%, #052117 60%, #031710 100%)",
        }}
      >
      {/* Brand / Logo Area */}
      <div
        className="flex items-center gap-3 px-4 h-16 border-b"
        style={{ borderColor: "rgba(16, 185, 129, 0.18)" }}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="FoodWise Logo"
            className="w-9 h-9 object-contain group-hover:scale-105 transition-transform shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-[15px] font-extrabold text-white tracking-tight whitespace-nowrap">
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
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: "rgba(16, 185, 129, 0.15)" }}
      >
        {!collapsed ? (
          <div>
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
            className="text-[10px] font-bold uppercase tracking-widest mb-2 px-3"
            style={{ color: "#6EE7B7" }}
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
              className={`group flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all relative ${
                collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
              }`}
              style={{
                background: isActive
                  ? "linear-gradient(90deg, rgba(16, 185, 129, 0.28) 0%, rgba(16, 185, 129, 0.1) 100%)"
                  : item.highlight
                  ? "rgba(239, 68, 68, 0.15)"
                  : "transparent",
                color: isActive
                  ? "#FFFFFF"
                  : item.highlight
                  ? "#FCA5A5"
                  : "#D1FAE5",
                borderLeft: isActive ? "3px solid #10B981" : "3px solid transparent",
                boxShadow: isActive ? "inset 0 0 12px rgba(16, 185, 129, 0.15)" : "none",
              }}
              title={collapsed ? item.label : undefined}
              onMouseEnter={(e) => {
                if (!isActive && !item.highlight) {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(16, 185, 129, 0.18)";
                  (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive && !item.highlight) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#D1FAE5";
                }
              }}
            >
              <Icon
                className="w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110"
                style={{
                  color: isActive
                    ? "#34D399"
                    : item.highlight
                    ? "#FCA5A5"
                    : "#6EE7B7",
                }}
              />
              {!collapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono-data"
                      style={{
                        background: item.highlight
                          ? "rgba(239,68,68,0.25)"
                          : "rgba(16,185,129,0.25)",
                        color: item.highlight ? "#FCA5A5" : "#A7F3D0",
                        border: item.highlight
                          ? "1px solid rgba(239,68,68,0.4)"
                          : "1px solid rgba(16,185,129,0.3)",
                      }}
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
      <div
        className="px-3 py-2 border-t space-y-0.5"
        style={{ borderColor: "rgba(16, 185, 129, 0.15)" }}
      >
        <button
          onClick={() => setIsNotificationOpen(true)}
          className={`w-full flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
            collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
          }`}
          style={{ color: "#A7F3D0" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(16, 185, 129, 0.18)";
            (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#A7F3D0";
          }}
          title={collapsed ? "Notifications" : undefined}
        >
          <div className="relative">
            <Bell className="w-[18px] h-[18px] text-emerald-400" />
            {unreadCount > 0 && collapsed && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 flex items-center justify-between">
              <span>{t("common.notifications")}</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {unreadCount}
                </span>
              )}
            </div>
          )}
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`w-full flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
            collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
          }`}
          style={{ color: "#A7F3D0" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(16, 185, 129, 0.18)";
            (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#A7F3D0";
          }}
          title={collapsed ? t("common.settings") : undefined}
        >
          <Settings className="w-[18px] h-[18px] text-emerald-400" />
          {!collapsed && <span>{t("common.settings")}</span>}
        </button>
      </div>

      {/* User Profile + Collapse Toggle */}
      <div
        className="px-3 py-3 border-t"
        style={{
          borderColor: "rgba(16, 185, 129, 0.18)",
          background: "rgba(0, 0, 0, 0.25)",
        }}
      >
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold text-white shadow-md shadow-emerald-950/50 shrink-0"
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
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold text-white shadow-md shadow-emerald-950/50"
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
