"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

interface PublicHeaderProps {
  currentPage?: string;
}

export default function PublicHeader({ currentPage }: PublicHeaderProps) {
  return (
    <header className="w-full border-b border-emerald-900/40 bg-[#072417]/95 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5">
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
            className="w-8 h-8 object-contain shrink-0 rounded-lg bg-emerald-950/60 p-1 border border-emerald-700/30 group-hover:border-emerald-500/50 transition-colors"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-200 transition-colors">
                FoodWise<span className="text-emerald-400">™</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 hidden sm:inline-block">
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
            <span className="text-xs font-semibold text-emerald-300/80 hidden md:inline-block px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40">
              {currentPage}
            </span>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 hover:text-white border border-emerald-700/40 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
