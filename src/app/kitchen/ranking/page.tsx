"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp, getDonorTier, DonorHotel, DonorTier } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { downloadDonorRankingPdf } from "@/lib/pdfGenerator";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  Flame,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Building2,
  MapPin,
  Award,
  Search,
  Share2,
  Download,
  Info,
  Calendar,
  Utensils,
  Gem,
  ArrowRight,
  ThumbsUp,
  Heart,
  ChevronRight,
  Eye,
  X,
} from "lucide-react";

const TIER_CONFIG: Record<
  DonorTier,
  {
    color: string;
    bg: string;
    border: string;
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    minPoints: number;
    nextTier?: DonorTier;
    nextMin?: number;
  }
> = {
  Platinum: {
    color: "#6366F1",
    bg: "#EEF2FF",
    border: "#C7D2FE",
    icon: Crown,
    gradient: "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)",
    minPoints: 5000,
  },
  Gold: {
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    icon: Trophy,
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    minPoints: 2000,
    nextTier: "Platinum",
    nextMin: 5000,
  },
  Silver: {
    color: "#4B5563",
    bg: "#F3F4F6",
    border: "#D1D5DB",
    icon: Medal,
    gradient: "linear-gradient(135deg, #9CA3AF 0%, #4B5563 100%)",
    minPoints: 500,
    nextTier: "Gold",
    nextMin: 2000,
  },
  Bronze: {
    color: "#B45309",
    bg: "#FFF8EB",
    border: "#FDE68A",
    icon: Gem,
    gradient: "linear-gradient(135deg, #D97706 0%, #92400E 100%)",
    minPoints: 0,
    nextTier: "Silver",
    nextMin: 500,
  },
};

const BADGE_STYLES: Record<string, { emoji: string; color: string; bg: string }> = {
  "Consistent Donor": { emoji: "🔄", color: "#065F46", bg: "#ECFDF5" },
  "Top Quality": { emoji: "⭐", color: "#92400E", bg: "#FEF3C7" },
  "Rapid Response": { emoji: "⚡", color: "#1E40AF", bg: "#EFF6FF" },
  "Bulk Contributor": { emoji: "📦", color: "#6B21A8", bg: "#F3E8FF" },
  "Weekend Hero": { emoji: "🦸", color: "#991B1B", bg: "#FEE2E2" },
  "Festival Support": { emoji: "🎪", color: "#9D174D", bg: "#FCE7F3" },
  "Cold Chain Certified": { emoji: "❄️", color: "#155E75", bg: "#ECFEFF" },
  "Zero Waste Champion": { emoji: "♻️", color: "#065F46", bg: "#D1FAE5" },
};

export default function KitchenRankingPage() {
  const { rankedHotels, donorFeedback, getHotelRank } = useApp();
  const { t } = useLang();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [onlyMyKitchen, setOnlyMyKitchen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Kitchen's own profile - IIT Delhi Central Mess is h-2
  const kitchenHotelId = "h-2";
  const myKitchen = rankedHotels.find((h) => h.id === kitchenHotelId);
  const myRank = getHotelRank ? getHotelRank(kitchenHotelId) : rankedHotels.findIndex((h) => h.id === kitchenHotelId) + 1;
  const myTier = myKitchen ? getDonorTier(myKitchen.totalPoints) : "Silver";
  const myTierInfo = TIER_CONFIG[myTier];

  // Feedback received specifically by this kitchen
  const myKitchenFeedback = useMemo(() => {
    return donorFeedback.filter(
      (f) => f.hotelId === kitchenHotelId || f.hotelName.toLowerCase().includes("iit delhi")
    );
  }, [donorFeedback, kitchenHotelId]);

  // Points progress calculation
  const nextTierPoints = myTierInfo.nextMin || 5000;
  const currentPoints = myKitchen?.totalPoints || 0;
  const pointsToNext = Math.max(0, nextTierPoints - currentPoints);
  const progressPercent = Math.min(
    100,
    Math.round(
      ((currentPoints - myTierInfo.minPoints) / (nextTierPoints - myTierInfo.minPoints)) * 100
    )
  );

  // Filtered leaderboard
  const filteredHotels = useMemo(() => {
    return rankedHotels.filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
      const tier = getDonorTier(hotel.totalPoints);
      const matchesTier = selectedTier === "ALL" || tier === selectedTier;
      const matchesMyKitchen = !onlyMyKitchen || hotel.id === kitchenHotelId;
      return matchesSearch && matchesTier && matchesMyKitchen;
    });
  }, [rankedHotels, searchQuery, selectedTier, onlyMyKitchen, kitchenHotelId]);

  // Top 3 Podium
  const top3 = rankedHotels.slice(0, 3);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `🏆 Our Kitchen ranks #${myRank} on the FoodWise Donor Leaderboard with ${currentPoints.toLocaleString()} points (${myTier} Tier)!`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* ═══ TOP BREADCRUMB & HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold mb-1" style={{ color: "#059669" }}>
            <Link href="/kitchen/dashboard" className="hover:underline flex items-center gap-1">
              {t("kitchen.rank.breadcrumb_kitchen")}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-600 font-bold">{t("kitchen.rank.breadcrumb_rankings")}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "#111827" }}>
              {t("kitchen.rank.page_title")}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t("kitchen.rank.live_badge")}
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {t("kitchen.rank.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleShare}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 active:scale-95"
          >
            {copiedLink ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">{t("kitchen.rank.rank_copied")}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-gray-500" />
                <span>{t("kitchen.rank.share_standing")}</span>
              </>
            )}
          </button>
          <button
            onClick={() => setShowCertModal(true)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm border border-emerald-500/30 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 active:scale-95 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>{t("kitchen.rank.view_certificate")}</span>
          </button>
          <button
            onClick={() =>
              downloadDonorRankingPdf({
                donorName: myKitchen?.name || "IIT Delhi Central Dining Mess",
                rank: myRank,
                totalPoints: currentPoints,
                tier: myTier,
                location: myKitchen?.location || "Hauz Khas, New Delhi",
              })
            }
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t("kitchen.rank.download_cert")}</span>
          </button>
        </div>
      </div>

      {/* ═══ HERO SPOTLIGHT: YOUR KITCHEN REPUTATION CARD ═══ */}
      {myKitchen && (
        <div
          className="relative overflow-hidden rounded-3xl p-6 lg:p-8 border shadow-lg"
          style={{
            background: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)",
            borderColor: "#10B981",
          }}
        >
          {/* Subtle background ornamentation */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-emerald-300/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/30">
                  {t("kitchen.rank.your_institution")}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                  style={{ background: myTierInfo.bg, color: myTierInfo.color, border: `1px solid ${myTierInfo.border}` }}
                >
                  <myTierInfo.icon className="w-3.5 h-3.5" />
                  {myTier} {t("kitchen.rank.tier_donor")}
                </span>
                {myKitchen.fssaiVerified && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 bg-emerald-950/60 text-emerald-200 border border-emerald-400/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {t("kitchen.rank.fssai_verified")}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {myKitchen.name}
                </h2>
                <p className="text-emerald-100/90 text-xs sm:text-sm flex items-center gap-1.5 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                  {myKitchen.location} • {t("kitchen.rank.ranked")} #{myRank} {t("kitchen.rank.across_all")} {rankedHotels.length} {t("kitchen.rank.certified_donors")}
                </p>
              </div>

              {/* Tier Progress Bar */}
              {myTierInfo.nextTier && (
                <div className="bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-400/20 backdrop-blur-sm space-y-2">
                  <div className="flex items-center justify-between text-xs text-emerald-100 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      {t("kitchen.rank.target_reach")} {myTierInfo.nextTier} {t("kitchen.rank.tier")} ({nextTierPoints.toLocaleString()} {t("kitchen.rank.pts")})
                    </span>
                    <span className="text-amber-300 font-bold font-mono-data">
                      {pointsToNext.toLocaleString()} {t("kitchen.rank.pts_remaining")}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-400/20">
                    <div
                      className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-amber-400 to-emerald-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-200/80">
                    <span>{currentPoints.toLocaleString()} {t("kitchen.rank.pts")}</span>
                    <span>{progressPercent}% {t("kitchen.rank.towards_next")}</span>
                    <span>{nextTierPoints.toLocaleString()} {t("kitchen.rank.pts")}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 w-full lg:w-auto">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-0.5">
                  {t("kitchen.rank.current_rank")}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono-data">
                  #{myRank}
                </div>
                <div className="text-[10px] text-emerald-200/80 mt-0.5">{t("kitchen.rank.city_standing")}</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-0.5">
                  {t("kitchen.rank.total_points")}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono-data">
                  {currentPoints.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-200/80 mt-0.5">{t("kitchen.rank.reputation_pts")}</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-0.5">
                  {t("kitchen.rank.donation_streak")}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-300 font-mono-data flex items-center justify-center gap-1">
                  <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
                  {myKitchen.streak}
                </div>
                <div className="text-[10px] text-emerald-200/80 mt-0.5">{t("kitchen.rank.consecutive_days")}</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-0.5">
                  {t("kitchen.rank.ngo_rating")}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono-data flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                  {myKitchen.avgRating}
                </div>
                <div className="text-[10px] text-emerald-200/80 mt-0.5">({myKitchen.totalRatings} {t("kitchen.rank.ratings")})</div>
              </div>
            </div>
          </div>

          {/* Badges Earned Ribbon */}
          <div className="mt-6 pt-5 border-t border-emerald-400/20 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-emerald-200 mr-2 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-300" />
              {t("kitchen.rank.verified_badges_earned")}
            </span>
            {myKitchen.specialBadges.map((badge) => {
              const style = BADGE_STYLES[badge] || { emoji: "🎖️", color: "#065F46", bg: "#ECFDF5" };
              return (
                <span
                  key={badge}
                  className="px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
                  style={{ background: style.bg, color: style.color }}
                >
                  <span>{style.emoji}</span>
                  <span>{badge}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TOP 3 PODIUM SHOWCASE ═══ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: "#111827" }}>
            <Trophy className="w-5 h-5 text-amber-500" />
            {t("kitchen.rank.podium_title")}
          </h2>
          <span className="text-xs text-gray-500">{t("kitchen.rank.updated_realtime")}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((hotel, idx) => {
            const tier = getDonorTier(hotel.totalPoints);
            const isYou = hotel.id === kitchenHotelId;
            const rankConfig = [
              {
                title: t("kitchen.rank.place_1st"),
                crownColor: "#F59E0B",
                gradient: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                badgeBorder: "#F59E0B",
                ribbon: `🥇 ${t("kitchen.rank.ribbon_gold")}`,
              },
              {
                title: t("kitchen.rank.place_2nd"),
                crownColor: "#9CA3AF",
                gradient: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
                badgeBorder: "#9CA3AF",
                ribbon: `🥈 ${t("kitchen.rank.ribbon_silver")}`,
              },
              {
                title: t("kitchen.rank.place_3rd"),
                crownColor: "#D97706",
                gradient: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
                badgeBorder: "#D97706",
                ribbon: `🥉 ${t("kitchen.rank.ribbon_bronze")}`,
              },
            ][idx];

            return (
              <div
                key={hotel.id}
                className="relative rounded-2xl p-5 border transition-all hover:shadow-md"
                style={{
                  background: isYou ? "#F0FDF4" : "#FFFFFF",
                  borderColor: isYou ? "#10B981" : rankConfig.badgeBorder,
                  borderWidth: isYou ? "2px" : "1px",
                }}
              >
                {isYou && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                    {t("kitchen.rank.your_kitchen")}
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg text-gray-700 bg-gray-100">
                    {rankConfig.ribbon}
                  </span>
                  <span
                    className="text-xs font-black px-2.5 py-0.5 rounded-full"
                    style={{
                      background: TIER_CONFIG[tier].bg,
                      color: TIER_CONFIG[tier].color,
                      border: `1px solid ${TIER_CONFIG[tier].border}`,
                    }}
                  >
                    {tier}
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm shrink-0"
                    style={{ background: rankConfig.gradient, color: rankConfig.crownColor }}
                  >
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm truncate" style={{ color: "#111827" }}>
                      {hotel.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {hotel.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 text-center">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">{t("kitchen.rank.col_points")}</div>
                    <div className="text-sm font-black font-mono-data text-gray-900">
                      {hotel.totalPoints.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">{t("kitchen.rank.col_rating")}</div>
                    <div className="text-sm font-black font-mono-data text-amber-600 flex items-center justify-center gap-0.5">
                      ⭐ {hotel.avgRating}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">{t("kitchen.rank.col_streak")}</div>
                    <div className="text-sm font-black font-mono-data text-emerald-600">
                      {hotel.streak}d
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {hotel.specialBadges.slice(0, 2).map((b) => (
                    <span
                      key={b}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700"
                    >
                      {BADGE_STYLES[b]?.emoji || "🎖️"} {b}
                    </span>
                  ))}
                  {hotel.specialBadges.length > 2 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500">
                      +{hotel.specialBadges.length - 2}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ LEADERBOARD TABLE + FILTERS ═══ */}
      <div className="card p-6" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#111827" }}>
              {t("kitchen.rank.leaderboard_title")}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {t("kitchen.rank.showing")} {filteredHotels.length} {t("kitchen.rank.of")} {rankedHotels.length} {t("kitchen.rank.institutions_cycle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t("kitchen.rank.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50"
              />
            </div>

            {/* Toggle My Kitchen */}
            <button
              onClick={() => setOnlyMyKitchen((prev) => !prev)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                onlyMyKitchen
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              📍 {t("kitchen.rank.my_kitchen_only")}
            </button>
          </div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 pb-3 border-b border-gray-100">
          {["ALL", "Platinum", "Gold", "Silver", "Bronze"].map((tier) => {
            const count =
              tier === "ALL"
                ? rankedHotels.length
                : rankedHotels.filter((h) => getDonorTier(h.totalPoints) === tier).length;
            const isSelected = selectedTier === tier;
            return (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{tier === "ALL" ? t("kitchen.rank.all_tiers") : tier}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/60">
                <th className="py-3 px-3">{t("kitchen.rank.th_rank")}</th>
                <th className="py-3 px-3">{t("kitchen.rank.th_donor_institution")}</th>
                <th className="py-3 px-3">{t("kitchen.rank.th_tier")}</th>
                <th className="py-3 px-3">{t("kitchen.rank.th_reputation_points")}</th>
                <th className="py-3 px-3">{t("kitchen.rank.th_ngo_rating")}</th>
                <th className="py-3 px-3">{t("kitchen.rank.th_streak")}</th>
                <th className="py-3 px-3">{t("kitchen.rank.th_total_donations")}</th>
                <th className="py-3 px-3">{t("kitchen.rank.th_key_badges")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredHotels.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    {t("kitchen.rank.no_results")}
                  </td>
                </tr>
              ) : (
                filteredHotels.map((hotel) => {
                  const rank = rankedHotels.findIndex((h) => h.id === hotel.id) + 1;
                  const tier = getDonorTier(hotel.totalPoints);
                  const isYou = hotel.id === kitchenHotelId;
                  const tierData = TIER_CONFIG[tier];

                  return (
                    <tr
                      key={hotel.id}
                      className={`transition-colors ${
                        isYou
                          ? "bg-emerald-50/70 font-semibold"
                          : "hover:bg-gray-50/80"
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                              rank === 1
                                ? "bg-amber-400 text-amber-950 font-black"
                                : rank === 2
                                ? "bg-gray-300 text-gray-900"
                                : rank === 3
                                ? "bg-amber-700 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {rank}
                          </span>
                        </div>
                      </td>

                      {/* Institution Name & Location */}
                      <td className="py-3.5 px-3">
                        <div>
                          <div className="font-bold flex items-center gap-2 text-gray-900">
                            {hotel.name}
                            {isYou && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                                {t("kitchen.rank.you")}
                              </span>
                            )}
                            {hotel.fssaiVerified && (
                              <span title={t("kitchen.rank.fssai_verified")}>
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {hotel.location}
                          </div>
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3.5 px-3">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black"
                          style={{
                            background: tierData.bg,
                            color: tierData.color,
                            border: `1px solid ${tierData.border}`,
                          }}
                        >
                          <tierData.icon className="w-3 h-3" />
                          {tier}
                        </span>
                      </td>

                      {/* Points */}
                      <td className="py-3.5 px-3">
                        <span className="font-black font-mono-data text-sm text-gray-900">
                          {hotel.totalPoints.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-400 ml-1">{t("kitchen.rank.pts")}</span>
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-amber-600 font-mono-data">
                            ⭐ {hotel.avgRating}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            ({hotel.totalRatings})
                          </span>
                        </div>
                      </td>

                      {/* Streak */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-emerald-700 bg-emerald-100/70">
                          <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {hotel.streak} {t("kitchen.rank.days")}
                        </span>
                      </td>

                      {/* Donations count */}
                      <td className="py-3.5 px-3">
                        <div className="text-gray-800 font-medium">
                          {hotel.totalDonations} {t("kitchen.rank.dispatches")}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {t("kitchen.rank.last_prefix")} {hotel.lastDonation}
                        </div>
                      </td>

                      {/* Badges */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {hotel.specialBadges.map((badge) => (
                            <span
                              key={badge}
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 whitespace-nowrap"
                            >
                              {BADGE_STYLES[badge]?.emoji || "🎖️"} {badge}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ REPUTATION METRICS & NGO FEEDBACK SECTION ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: How Scoring & Perks Work */}
        <div className="space-y-4">
          <div className="card p-5" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: "#111827" }}>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              {t("kitchen.rank.how_points_work")}
            </h3>
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100">
                <span>{t("kitchen.rank.score_5star")}</span>
                <span className="font-extrabold text-emerald-700 font-mono-data">+85 {t("kitchen.rank.pts")}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100">
                <span>{t("kitchen.rank.score_4star")}</span>
                <span className="font-extrabold text-amber-700 font-mono-data">+70 {t("kitchen.rank.pts")}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100">
                <span>{t("kitchen.rank.score_7day_streak")}</span>
                <span className="font-extrabold text-indigo-700 font-mono-data">+50 {t("kitchen.rank.pts")}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100">
                <span>{t("kitchen.rank.score_fast_handover")}</span>
                <span className="font-extrabold text-emerald-700 font-mono-data">+25 {t("kitchen.rank.pts")}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100">
                <span>{t("kitchen.rank.score_zero_complaint")}</span>
                <span className="font-extrabold text-emerald-700 font-mono-data">+40 {t("kitchen.rank.pts")}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-900 mb-2">{t("kitchen.rank.tier_unlocks")}</h4>
              <ul className="text-[11px] text-gray-600 space-y-1.5 list-disc pl-4">
                <li><strong className="text-indigo-900">{t("kitchen.rank.perk_platinum_label")}</strong> {t("kitchen.rank.perk_platinum_desc")}</li>
                <li><strong className="text-amber-900">{t("kitchen.rank.perk_gold_label")}</strong> {t("kitchen.rank.perk_gold_desc")}</li>
                <li><strong className="text-gray-900">{t("kitchen.rank.perk_silver_label")}</strong> {t("kitchen.rank.perk_silver_desc")}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right 2 cols: Recent NGO Feedback For Your Kitchen */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "#111827" }}>
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  {t("kitchen.rank.recent_feedback_title")}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t("kitchen.rank.recent_feedback_subtitle")}
                </p>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {myKitchenFeedback.length} {t("kitchen.rank.verified_reviews")}
              </span>
            </div>

            {myKitchenFeedback.length === 0 ? (
              <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                {t("kitchen.rank.no_feedback")}
              </div>
            ) : (
              <div className="space-y-3">
                {myKitchenFeedback.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs text-gray-900 flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          <span>{t("kitchen.rank.recipient_ngo_feedback")}</span>
                          <span className="text-[10px] font-normal text-gray-400">
                            • {fb.date}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 mt-1 italic">
                          &ldquo;{fb.comment}&rdquo;
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 font-mono-data">
                          +{fb.pointsAwarded} {t("kitchen.rank.pts")}
                        </span>
                        <div className="text-[11px] font-bold text-amber-600 mt-1">
                          ⭐ {fb.overallRating.toFixed(1)} / 5.0
                        </div>
                      </div>
                    </div>

                    {/* Metric pills */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-200/60 text-center text-[10px]">
                      <div className="p-1.5 rounded-lg bg-white border border-gray-100">
                        <span className="text-gray-400 block font-medium">{t("kitchen.rank.fb_quality")}</span>
                        <span className="font-bold text-gray-900">{fb.foodQuality}★</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white border border-gray-100">
                        <span className="text-gray-400 block font-medium">{t("kitchen.rank.fb_packaging")}</span>
                        <span className="font-bold text-gray-900">{fb.packaging}★</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white border border-gray-100">
                        <span className="text-gray-400 block font-medium">{t("kitchen.rank.fb_timeliness")}</span>
                        <span className="font-bold text-gray-900">{fb.timeliness}★</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white border border-gray-100">
                        <span className="text-gray-400 block font-medium">{t("kitchen.rank.fb_quantity")}</span>
                        <span className="font-bold text-gray-900">{fb.quantity}★</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ CERTIFICATE PREVIEW MODAL ═══ */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FBF7EE] text-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full border-4 border-amber-500/90 p-6 sm:p-10 relative max-h-[92vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Inner certificate frame */}
            <div className="border-2 border-emerald-600/40 rounded-2xl p-6 sm:p-8 bg-white/95 relative shadow-inner">
              {/* Header with Logos */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="FoodWise Logo"
                    className="w-16 h-16 object-contain drop-shadow"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("kitchen.rank.cert_official_credential")}</span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">{t("kitchen.rank.cert_foodwise_network")}</h3>
                  </div>
                </div>

                {/* Center Title */}
                <div className="text-center order-3 sm:order-2 flex-1">
                  <h2 className="text-xs sm:text-sm font-black tracking-wider text-amber-800 uppercase">
                    {t("kitchen.rank.cert_title")}
                  </h2>
                  <p className="text-xs font-bold text-amber-600">
                    {t("kitchen.rank.cert_subtitle")} • {myTier.toUpperCase()} {t("kitchen.rank.tier")}
                  </p>
                </div>

                {/* FSSAI Badge */}
                <div className="flex items-center gap-3 order-2 sm:order-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">{t("kitchen.rank.cert_govt_india")}</span>
                    <span className="text-xs font-black text-emerald-900">{t("kitchen.rank.cert_fssai_certified")}</span>
                  </div>
                  <img
                    src="/fssai-badge.jpg"
                    alt="FSSAI Verified Seal"
                    className="w-16 h-16 object-contain rounded-full shadow-md border-2 border-emerald-500/30"
                  />
                </div>
              </div>

              {/* Tagline Ribbon Banner */}
              <div className="my-3 py-2 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                <span className="text-xs sm:text-sm font-extrabold tracking-wide text-amber-900">
                  {t("kitchen.rank.cert_tagline")}
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {t("kitchen.rank.cert_compliance")}
                </p>
              </div>

              {/* Recipient */}
              <div className="text-center my-6 space-y-2">
                <p className="text-xs text-slate-500 font-medium">{t("kitchen.rank.cert_conferred_upon")}</p>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  {myKitchen?.name || "IIT Delhi Central Dining Mess"}
                </h1>
                <p className="text-xs font-semibold text-emerald-800">
                  {myKitchen?.location || "Hauz Khas, New Delhi"} • {t("kitchen.rank.cert_kitchen_partner")}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed pt-1">
                  {t("kitchen.rank.cert_recognition_text")}
                </p>
              </div>

              {/* 4 Standing KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">{t("kitchen.rank.cert_city_rank")}</span>
                  <span className="text-lg font-black text-slate-900">#{myRank} {t("kitchen.rank.cert_in_city")}</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">{t("kitchen.rank.th_reputation_points")}</span>
                  <span className="text-lg font-black text-amber-700">{currentPoints.toLocaleString()} {t("kitchen.rank.pts")}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">{t("kitchen.rank.cert_donor_tier")}</span>
                  <span className="text-lg font-black text-emerald-800">{myTier} {t("kitchen.rank.tier")}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">{t("kitchen.rank.cert_fssai_rating")}</span>
                  <span className="text-lg font-black text-emerald-800">{t("kitchen.rank.cert_safe_score")}</span>
                </div>
              </div>

              {/* Verification & Signatures */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center items-center text-xs text-slate-600">
                <div>
                  <div className="font-bold text-slate-800">{t("kitchen.rank.cert_governing_council")}</div>
                  <div className="text-[11px] text-slate-500">{t("kitchen.rank.cert_recovery_initiative")}</div>
                </div>

                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-emerald-900 text-[11px]">{t("kitchen.rank.cert_safety_endorsed")}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">{t("kitchen.rank.cert_zero_waste")}</div>
                </div>

                <div>
                  <div className="font-bold text-slate-800">{t("kitchen.rank.cert_ngo_coalition")}</div>
                  <div className="text-[11px] text-slate-500">Ref: FW-DONOR-{myRank}00{currentPoints}</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={() => setShowCertModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {t("kitchen.rank.close")}
              </button>
              <button
                onClick={() => {
                  downloadDonorRankingPdf({
                    donorName: myKitchen?.name || "IIT Delhi Central Dining Mess",
                    rank: myRank,
                    totalPoints: currentPoints,
                    tier: myTier,
                    location: myKitchen?.location || "Hauz Khas, New Delhi",
                  });
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t("kitchen.rank.download_official_cert")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
