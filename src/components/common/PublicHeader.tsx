"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

interface PublicHeaderProps {
  currentPage?: string;
}

export default function PublicHeader({ currentPage }: PublicHeaderProps) {
  return (
    <header className="w-full border-b border-white/[0.06] bg-[#072417]/95 backdrop-blur-xl backdrop-saturate-150 shadow-[0_1px_0_rgba(0,0,0,0.2),0_8px_24px_-12px_rgba(0,0,0,0.35)] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="max-w-[1040px] mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg p-1"
          aria-label="FoodWise Home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="FoodWise Logo"
            className="w-8 h-8 object-contain shrink-0 rounded-lg bg-white/[0.04] p-1 ring-1 ring-inset ring-white/10 group-hover:ring-emerald-400/40 transition-all"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base tracking-tight text-white group-hover:text-emerald-200 transition-colors">
                FoodWise<span className="text-emerald-400">™</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/20 hidden sm:inline-block">
                Zero Waste Initiative
              </span>
            </div>
            <span className="text-[11px] text-emerald-300/70 hidden sm:block">
              Food Waste Reduction &amp; Redistribution Platform
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {currentPage && (
            <span className="text-xs font-medium text-emerald-200/80 hidden md:inline-block px-2.5 py-1 rounded-full bg-white/[0.04] ring-1 ring-inset ring-white/[0.08]">
              {currentPage}
            </span>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-emerald-100 hover:text-white ring-1 ring-inset ring-white/10 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
