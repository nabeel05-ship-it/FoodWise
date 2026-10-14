"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShieldCheck, Sparkles, FileText, HelpCircle, Info } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="w-full border-t border-white/[0.06] bg-[#06200F]/90 backdrop-blur-md text-emerald-100/90 py-10 px-4 sm:px-6 lg:px-8 mt-10 z-20"
    >
      <div className="max-w-[1040px] mx-auto">
        {/* Top Grid: Brand & Navigation */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/[0.07]">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="FoodWise Logo"
              className="w-9 h-9 object-contain shrink-0 rounded-lg bg-white/[0.04] p-1 ring-1 ring-inset ring-white/10"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base tracking-tight text-white">
                  FoodWise<span className="text-emerald-400">™</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
                  Zero Waste
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5 leading-snug">
                Food Waste Reduction &amp; Redistribution Platform — Making every meal count.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-semibold"
          >
            <Link
              href="/about"
              className="text-emerald-100/75 hover:text-white transition-colors flex items-center gap-1.5 py-1 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>About</span>
            </Link>
            <Link
              href="/contact"
              className="text-emerald-100/75 hover:text-white transition-colors flex items-center gap-1.5 py-1 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contact &amp; Support</span>
            </Link>
            <Link
              href="/privacy-policy"
              className="text-emerald-100/75 hover:text-white transition-colors flex items-center gap-1.5 py-1 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy Policy</span>
            </Link>
            <Link
              href="/terms"
              className="text-emerald-100/75 hover:text-white transition-colors flex items-center gap-1.5 py-1 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Terms of Service</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Bar: Copyright, Trademark & Mission Disclaimer */}
        <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-emerald-300/70">
          <div className="space-y-1">
            <p>
              &copy; {currentYear} FoodWise. All rights reserved.
            </p>
            <p className="text-[10px] text-emerald-400/60 max-w-xl leading-normal">
              FoodWise™ is the name used for this food redistribution platform. Built to connect surplus edible food with verified relief organizations.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-200/80 bg-white/[0.04] px-3 py-1.5 rounded-full ring-1 ring-inset ring-white/[0.08] shrink-0">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Supporting SDG 2 &amp; SDG 12</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
