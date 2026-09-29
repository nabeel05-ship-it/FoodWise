"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Sparkles,
  Utensils,
  Factory,
  BarChart3,
  HeartHandshake,
  Bell,
  LogIn,
  Layers,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { unreadCount, setIsNotificationOpen } = useApp();

  const navLinks = [
    { label: "Overview", href: "/" },
    { label: "Kitchen Mess", href: "/kitchen/dashboard", icon: Utensils },
    { label: "Factory Line", href: "/factory/dashboard", icon: Factory },
    { label: "ESG & Impact", href: "/dashboard/impact", icon: BarChart3 },
    { label: "NGO Network", href: "/ngo/dashboard", icon: HeartHandshake },
  ];

  return (
    <header
      className="sticky top-0 z-30 w-full backdrop-blur-xl"
      style={{
        background: "rgba(255,255,255,0.85)",
        borderBottom: "1px solid #E8ECF3",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
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
                AI Live
              </span>
            </div>
            <p className="text-[11px] font-medium hidden sm:block" style={{ color: "#9CA3AF" }}>
              Predict Less Waste. Feed More Lives.
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-xl transition-colors"
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: "#F4F6FA",
              border: "1px solid #E8ECF3",
              color: "#374151",
            }}
          >
            <LogIn className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
            <span className="hidden sm:inline">Sign In</span>
          </Link>

          <Link
            href="/kitchen/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
            style={{
              background: "#10B981",
              color: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            }}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Launch App</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
