import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import Footer from "@/components/common/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#111827] flex flex-col justify-between">
      {/* Top Simple Header */}
      <header className="w-full border-b border-emerald-900/10 bg-[#072417] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-[1040px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="FoodWise Logo"
              className="w-8 h-8 object-contain shrink-0 rounded-lg bg-emerald-950 p-1 border border-emerald-700/30"
            />
            <span className="font-extrabold text-base tracking-tight text-white">
              FoodWise<span className="text-emerald-400">™</span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700/40 text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </header>

      {/* Main 404 Content */}
      <main className="max-w-[600px] mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 mx-auto flex items-center justify-center text-emerald-800">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300">
            Error 404 &bull; Page Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight pt-2">
            This Page Doesn&apos;t Exist
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            The page you requested could not be located. It may have been moved, renamed, or is currently unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F2A1C] hover:bg-[#143826] text-white text-xs font-bold transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Page</span>
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-bold transition-all"
          >
            <span>Contact Support</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
