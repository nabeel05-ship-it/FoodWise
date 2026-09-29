"use client";

import React, { useState } from "react";
import { useApp, getDonorTier, DonorHotel } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  Star,
  Award,
  Trophy,
  MessageSquare,
  CheckCircle2,
  Building2,
  Utensils,
  ShieldCheck,
  Clock,
  Sparkles,
  Crown,
  Medal,
  Gem,
  Heart,
  Send,
  BarChart3,
  Zap,
  Target,
} from "lucide-react";
import confetti from "canvas-confetti";

const TIER_CONFIG = {
  Platinum: { color: "#818CF8", bg: "#EEF2FF", border: "#C7D2FE", icon: Crown, gradient: "linear-gradient(135deg, #818CF8, #6366F1)", minPoints: 5000 },
  Gold: { color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", icon: Trophy, gradient: "linear-gradient(135deg, #F59E0B, #D97706)", minPoints: 2000 },
  Silver: { color: "#9CA3AF", bg: "#F9FAFB", border: "#E5E7EB", icon: Medal, gradient: "linear-gradient(135deg, #9CA3AF, #6B7280)", minPoints: 500 },
  Bronze: { color: "#D97706", bg: "#FFF8EB", border: "#FDE68A", icon: Gem, gradient: "linear-gradient(135deg, #D97706, #B45309)", minPoints: 0 },
};

const BADGE_STYLES: Record<string, { emoji: string; color: string }> = {
  "Consistent Donor": { emoji: "🔄", color: "#059669" },
  "Top Quality": { emoji: "⭐", color: "#F59E0B" },
  "Rapid Response": { emoji: "⚡", color: "#2563EB" },
  "Bulk Contributor": { emoji: "📦", color: "#9333EA" },
  "Weekend Hero": { emoji: "🦸", color: "#DC2626" },
  "Festival Support": { emoji: "🎪", color: "#EC4899" },
  "Cold Chain Certified": { emoji: "❄️", color: "#06B6D4" },
  "Zero Waste Champion": { emoji: "♻️", color: "#10B981" },
};

export default function NgoFeedbackPage() {
  const { rankedHotels, donorFeedback, submitDonorFeedback } = useApp();
  const { t } = useLang();

  const [activeTab, setActiveTab] = useState<"leaderboard" | "feedback" | "history">("leaderboard");
  const [selectedHotel, setSelectedHotel] = useState<DonorHotel | null>(null);
  const [ratings, setRatings] = useState({ foodQuality: 0, packaging: 0, timeliness: 0, quantity: 0 });
  const [comment, setComment] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedPoints, setSubmittedPoints] = useState(0);

  const handleSubmitFeedback = () => {
    if (!selectedHotel || Object.values(ratings).some((r) => r === 0)) return;
    const points = submitDonorFeedback(selectedHotel.id, ratings, comment);
    setSubmittedPoints(points);
    setSubmitSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10B981", "#F59E0B", "#818CF8"],
    });
  };

  const resetFeedback = () => {
    setSelectedHotel(null);
    setRatings({ foodQuality: 0, packaging: 0, timeliness: 0, quantity: 0 });
    setComment("");
    setSubmitSuccess(false);
    setSubmittedPoints(0);
  };

  const calculatePreviewPoints = () => {
    const total = ratings.foodQuality + ratings.packaging + ratings.timeliness + ratings.quantity;
    const avg = total / 4;
    if (avg >= 4.5) return 85;
    if (avg >= 4.0) return 70;
    if (avg >= 3.5) return 55;
    if (avg >= 3.0) return 40;
    if (avg >= 2.0) return 25;
    return 10;
  };

  const renderStars = (category: keyof typeof ratings) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRatings((prev) => ({ ...prev, [category]: star }))}
            className="transition-all hover:scale-125"
          >
            <Star
              className="w-7 h-7"
              style={{
                color: star <= ratings[category] ? "#F59E0B" : "#E5E7EB",
                fill: star <= ratings[category] ? "#F59E0B" : "none",
              }}
            />
          </button>
        ))}
        <span className="ml-2 text-[13px] font-bold font-mono-data" style={{ color: ratings[category] > 0 ? "#F59E0B" : "#D1D5DB" }}>
          {ratings[category] > 0 ? ratings[category] : "—"}/5
        </span>
      </div>
    );
  };

  const renderStaticStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-3.5 h-3.5"
            style={{
              color: star <= Math.round(rating) ? "#F59E0B" : "#E5E7EB",
              fill: star <= Math.round(rating) ? "#F59E0B" : "none",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: "1px solid #E8ECF3" }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "#F59E0B" }}>
              <Award className="w-3.5 h-3.5" />
              {t("ngo.feedback.donor_recognition")}
            </span>
            <span style={{ color: "#D1D5DB" }}>&bull;</span>
            <span className="text-xs" style={{ color: "#9CA3AF" }}>{t("ngo.feedback.points_system")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "#111827" }}>
            {t("ngo.feedback.title")}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {t("ngo.feedback.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: "#FFFBEB", border: "1px solid #FDE68A", color: "#D97706" }}>
            <Trophy className="w-3.5 h-3.5" />
            {rankedHotels.length} {t("ngo.feedback.rated_donors")}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {[
          { key: "leaderboard", label: t("ngo.feedback.leaderboard"), icon: Trophy, color: "#F59E0B" },
          { key: "feedback", label: t("ngo.feedback.rate_donor"), icon: Star, color: "#10B981" },
          { key: "history", label: t("ngo.feedback.past_feedback"), icon: MessageSquare, color: "#2563EB" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
              style={{
                background: isActive ? `linear-gradient(135deg, ${tab.color}, ${tab.color}CC)` : "#FFFFFF",
                color: isActive ? "#FFFFFF" : "#6B7280",
                border: isActive ? "none" : "1px solid #E5E7EB",
                boxShadow: isActive ? `0 4px 14px ${tab.color}40` : "none",
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* LEADERBOARD TAB */}
      {activeTab === "leaderboard" && (
        <div className="space-y-5">
          {/* Points Info Banner */}
          <div className="card p-4" style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", border: "1px solid #FDE68A" }}>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: "#F59E0B" }} />
                <span className="text-[13px] font-bold" style={{ color: "#92400E" }}>{t("ngo.feedback.how_earn_points")}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]" style={{ color: "#78350F" }}>
                <span className="flex items-center gap-1"><Star className="w-3 h-3" style={{ color: "#F59E0B" }} /> {t("ngo.feedback.quality_rating_pts")}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" style={{ color: "#F59E0B" }} /> {t("ngo.feedback.ontime_pts")}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Target className="w-3 h-3" style={{ color: "#F59E0B" }} /> {t("ngo.feedback.streak_pts")}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" style={{ color: "#F59E0B" }} /> {t("ngo.feedback.quantity_pts")}</span>
              </div>
            </div>
          </div>

          {/* Tier Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.entries(TIER_CONFIG) as [keyof typeof TIER_CONFIG, typeof TIER_CONFIG[keyof typeof TIER_CONFIG]][]).map(([tier, config]) => {
              const Icon = config.icon;
              return (
                <div key={tier} className="p-3 rounded-xl text-center" style={{ background: config.bg, border: `1px solid ${config.border}` }}>
                  <Icon className="w-5 h-5 mx-auto mb-1" style={{ color: config.color }} />
                  <div className="text-[13px] font-bold" style={{ color: config.color }}>{tier}</div>
                  <div className="text-[10px]" style={{ color: "#6B7280" }}>{config.minPoints}+ pts</div>
                </div>
              );
            })}
          </div>

          {/* Hotel Cards */}
          <div className="space-y-3">
            {rankedHotels.map((hotel, idx) => {
              const tierName = getDonorTier(hotel.totalPoints);
              const tier = TIER_CONFIG[tierName];
              const TierIcon = tier.icon;
              return (
                <div key={hotel.id} className="card p-5 transition-all hover:shadow-md" style={{ borderLeft: `4px solid ${tier.color}` }}>
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[16px] font-extrabold shrink-0"
                      style={{
                        background: idx < 3 ? tier.gradient : "#F3F4F6",
                        color: idx < 3 ? "#FFFFFF" : "#6B7280",
                        boxShadow: idx < 3 ? `0 4px 12px ${tier.color}40` : "none",
                      }}
                    >
                      #{idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-[15px] font-bold" style={{ color: "#111827" }}>{hotel.name}</h3>
                        {hotel.fssaiVerified && <ShieldCheck className="w-4 h-4" style={{ color: "#059669" }} />}
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                          style={{ background: tier.bg, color: tier.color, border: `1px solid ${tier.border}` }}
                        >
                          <TierIcon className="w-3 h-3" /> {tierName}
                        </span>
                      </div>

                      <div className="text-[11px] mb-2" style={{ color: "#6B7280" }}>{hotel.location}</div>

                      <div className="flex items-center gap-4 flex-wrap mb-2">
                        <div className="flex items-center gap-1">
                          {renderStaticStars(hotel.avgRating)}
                          <span className="text-[12px] font-bold ml-1" style={{ color: "#F59E0B" }}>{hotel.avgRating}</span>
                          <span className="text-[10px]" style={{ color: "#9CA3AF" }}>({hotel.totalRatings})</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px]" style={{ color: "#6B7280" }}>
                          <Utensils className="w-3 h-3" /> {hotel.totalDonations} {t("ngo.feedback.donations")}
                        </div>
                        <div className="flex items-center gap-1 text-[11px]" style={{ color: "#059669" }}>
                          <Zap className="w-3 h-3" /> {hotel.streak}{t("ngo.feedback.day_streak")}
                        </div>
                        <div className="flex items-center gap-1 text-[11px]" style={{ color: "#9CA3AF" }}>
                          <Clock className="w-3 h-3" /> {hotel.lastDonation}
                        </div>
                      </div>

                      {/* Badges */}
                      {hotel.specialBadges.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {hotel.specialBadges.map((badge) => {
                            const style = BADGE_STYLES[badge] || { emoji: "🏷️", color: "#6B7280" };
                            return (
                              <span
                                key={badge}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                                style={{ background: `${style.color}12`, color: style.color, border: `1px solid ${style.color}30` }}
                              >
                                {style.emoji} {badge}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Points */}
                    <div className="text-right shrink-0">
                      <div className="text-xl font-extrabold font-mono-data" style={{ color: tier.color }}>{hotel.totalPoints.toLocaleString()}</div>
                      <div className="text-[10px] font-semibold" style={{ color: "#9CA3AF" }}>{t("ngo.feedback.points")}</div>
                      <button
                        onClick={() => { setSelectedHotel(hotel); setActiveTab("feedback"); }}
                        className="mt-2 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ background: "#10B981", color: "#FFFFFF" }}
                      >
                        {t("ngo.feedback.rate_btn")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FEEDBACK TAB */}
      {activeTab === "feedback" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left — Feedback Form */}
          <div className="lg:col-span-7 space-y-5">
            {submitSuccess ? (
              <div className="card p-8 text-center" style={{ border: "2px solid #A7F3D0" }}>
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: "#059669" }}>{t("ngo.feedback.success_title")}</h2>
                <p className="text-sm mb-3" style={{ color: "#6B7280" }}>
                  {t("ngo.feedback.thank_you")} <strong>{selectedHotel?.name}</strong>
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl mb-4" style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", border: "1px solid #FDE68A" }}>
                  <Trophy className="w-5 h-5" style={{ color: "#F59E0B" }} />
                  <span className="text-lg font-extrabold" style={{ color: "#D97706" }}>+{submittedPoints} {t("ngo.feedback.points_awarded")}</span>
                </div>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  {t("ngo.feedback.points_live")}
                </p>
                <button
                  onClick={resetFeedback}
                  className="mt-5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                  style={{ background: "#10B981", color: "#FFFFFF", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
                >
                  {t("ngo.feedback.rate_another")}
                </button>
              </div>
            ) : (
              <>
                {/* Select Hotel */}
                <div className="card p-5">
                  <h3 className="text-[15px] font-bold mb-3 flex items-center gap-2" style={{ color: "#111827" }}>
                    <Building2 className="w-4 h-4" style={{ color: "#6B7280" }} />
                    {t("ngo.feedback.select_hotel")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {rankedHotels.map((h) => {
                      const isSelected = selectedHotel?.id === h.id;
                      const tierName = getDonorTier(h.totalPoints);
                      const tc = TIER_CONFIG[tierName];
                      return (
                        <button
                          key={h.id}
                          onClick={() => setSelectedHotel(h)}
                          className="p-3 rounded-xl text-left transition-all hover:scale-[1.01]"
                          style={{
                            background: isSelected ? `${tc.color}12` : "#F9FAFB",
                            border: `2px solid ${isSelected ? tc.color : "#E5E7EB"}`,
                          }}
                        >
                          <div className="text-[12px] font-bold" style={{ color: isSelected ? tc.color : "#374151" }}>{h.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px]" style={{ color: "#9CA3AF" }}>{h.location}</span>
                            <span className="text-[10px] font-bold font-mono-data" style={{ color: tc.color }}>{h.totalPoints.toLocaleString()} pts</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedHotel && (
                  <>
                    {/* Rating Categories */}
                    <div className="card p-5">
                      <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2" style={{ color: "#111827" }}>
                        <Star className="w-4 h-4" style={{ color: "#F59E0B" }} />
                        {t("ngo.feedback.rate_donation")}
                      </h3>
                      <div className="space-y-5">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-[13px] font-semibold" style={{ color: "#374151" }}>{"🍽️"} {t("ngo.feedback.food_quality")}</label>
                            <span className="text-[10px]" style={{ color: "#9CA3AF" }}>{t("ngo.feedback.food_quality_desc")}</span>
                          </div>
                          {renderStars("foodQuality")}
                        </div>
                        <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "16px" }}>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-[13px] font-semibold" style={{ color: "#374151" }}>{"📦"} {t("ngo.feedback.packaging")}</label>
                            <span className="text-[10px]" style={{ color: "#9CA3AF" }}>{t("ngo.feedback.packaging_desc")}</span>
                          </div>
                          {renderStars("packaging")}
                        </div>
                        <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "16px" }}>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-[13px] font-semibold" style={{ color: "#374151" }}>{"⏰"} {t("ngo.feedback.timeliness")}</label>
                            <span className="text-[10px]" style={{ color: "#9CA3AF" }}>{t("ngo.feedback.timeliness_desc")}</span>
                          </div>
                          {renderStars("timeliness")}
                        </div>
                        <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "16px" }}>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-[13px] font-semibold" style={{ color: "#374151" }}>{"📊"} {t("ngo.feedback.quantity_accuracy")}</label>
                            <span className="text-[10px]" style={{ color: "#9CA3AF" }}>{t("ngo.feedback.quantity_accuracy_desc")}</span>
                          </div>
                          {renderStars("quantity")}
                        </div>
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="card p-5">
                      <h3 className="text-[15px] font-bold mb-3 flex items-center gap-2" style={{ color: "#111827" }}>
                        <MessageSquare className="w-4 h-4" style={{ color: "#6B7280" }} />
                        {t("ngo.feedback.additional_comments")}
                      </h3>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t("ngo.feedback.comment_placeholder")}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all focus:ring-2 resize-none"
                        style={{ border: "1px solid #E5E7EB", background: "#FAFAFA" }}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Right — Points Preview & Submit */}
          <div className="lg:col-span-5 space-y-5">
            {selectedHotel && !submitSuccess && (
              <>
                {/* Selected Hotel Card */}
                {(() => {
                  const tierName = getDonorTier(selectedHotel.totalPoints);
                  const tierCfg = TIER_CONFIG[tierName];
                  return (
                    <div className="card p-5" style={{ borderTop: `3px solid ${tierCfg.color}` }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: tierCfg.gradient }}
                        >
                          {React.createElement(tierCfg.icon, { className: "w-6 h-6 text-white" })}
                        </div>
                        <div>
                          <h3 className="text-[14px] font-bold" style={{ color: "#111827" }}>{selectedHotel.name}</h3>
                          <div className="flex items-center gap-2 text-[11px]" style={{ color: "#6B7280" }}>
                            <span>{tierName} {t("ngo.feedback.tier_label")}</span>
                            <span>&bull;</span>
                            <span>{selectedHotel.totalPoints.toLocaleString()} pts</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-lg" style={{ background: "#F9FAFB" }}>
                          <div className="text-[14px] font-bold font-mono-data" style={{ color: "#111827" }}>{selectedHotel.totalDonations}</div>
                          <div className="text-[9px]" style={{ color: "#9CA3AF" }}>{t("ngo.feedback.donations_label")}</div>
                        </div>
                        <div className="p-2 rounded-lg" style={{ background: "#F9FAFB" }}>
                          <div className="text-[14px] font-bold font-mono-data" style={{ color: "#F59E0B" }}>{selectedHotel.avgRating}</div>
                          <div className="text-[9px]" style={{ color: "#9CA3AF" }}>{t("ngo.feedback.avg_rating")}</div>
                        </div>
                        <div className="p-2 rounded-lg" style={{ background: "#F9FAFB" }}>
                          <div className="text-[14px] font-bold font-mono-data" style={{ color: "#059669" }}>{selectedHotel.streak}</div>
                          <div className="text-[9px]" style={{ color: "#9CA3AF" }}>{t("ngo.feedback.day_streak_label")}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Points Preview */}
                <div className="card p-5" style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", border: "1px solid #FDE68A" }}>
                  <div className="text-center">
                    <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: "#F59E0B" }} />
                    <div className="text-[13px] font-bold mb-1" style={{ color: "#92400E" }}>{t("ngo.feedback.points_preview")}</div>
                    <div className="text-3xl font-extrabold font-mono-data" style={{ color: "#D97706" }}>
                      +{Object.values(ratings).some((r) => r > 0) ? calculatePreviewPoints() : "—"}
                    </div>
                    <div className="text-[10px] mt-1" style={{ color: "#78350F" }}>
                      {t("ngo.feedback.based_on_rating")}
                    </div>
                    <div className="mt-3 space-y-1 text-[10px]" style={{ color: "#92400E" }}>
                      <div className="flex items-center justify-between px-4">
                        <span>5.0 avg → 85 pts</span>
                        <span>4.0 avg → 70 pts</span>
                      </div>
                      <div className="flex items-center justify-between px-4">
                        <span>3.5 avg → 55 pts</span>
                        <span>3.0 avg → 40 pts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmitFeedback}
                  disabled={Object.values(ratings).some((r) => r === 0)}
                  className="w-full py-4 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: Object.values(ratings).some((r) => r === 0)
                      ? "#D1D5DB"
                      : "linear-gradient(135deg, #10B981, #059669)",
                    color: "#FFFFFF",
                    boxShadow: Object.values(ratings).some((r) => r === 0)
                      ? "none"
                      : "0 6px 20px rgba(16, 185, 129, 0.35)",
                  }}
                >
                  <Send className="w-5 h-5" />
                  {t("ngo.feedback.submit_feedback")}
                </button>

                {Object.values(ratings).some((r) => r === 0) && (
                  <div className="text-center text-[11px]" style={{ color: "#9CA3AF" }}>
                    {t("ngo.feedback.rate_all_4")}
                  </div>
                )}
              </>
            )}

            {!selectedHotel && !submitSuccess && (
              <div className="card p-8 text-center">
                <Star className="w-10 h-10 mx-auto mb-3" style={{ color: "#E5E7EB" }} />
                <div className="text-[14px] font-semibold" style={{ color: "#6B7280" }}>{t("ngo.feedback.select_donor")}</div>
                <div className="text-[12px] mt-1" style={{ color: "#9CA3AF" }}>
                  {t("ngo.feedback.select_donor_desc")}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="card p-4" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5" style={{ color: "#059669" }} />
              <div>
                <span className="text-[13px] font-bold" style={{ color: "#059669" }}>
                  {donorFeedback.length} {t("ngo.feedback.submissions")}
                </span>
                <span className="text-[12px] ml-2" style={{ color: "#6B7280" }}>
                  {t("ngo.feedback.total_points_awarded")} <strong className="font-mono-data">{donorFeedback.reduce((sum, f) => sum + f.pointsAwarded, 0)}</strong>
                </span>
              </div>
            </div>
          </div>

          {donorFeedback.map((fb) => (
            <div key={fb.id} className="card p-5 transition-all hover:shadow-md" style={{ borderLeft: "4px solid #F59E0B" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[14px] font-bold" style={{ color: "#111827" }}>{fb.hotelName}</h3>
                    {renderStaticStars(fb.overallRating)}
                    <span className="text-[12px] font-bold" style={{ color: "#F59E0B" }}>{fb.overallRating}</span>
                  </div>
                  <div className="text-[12px] mb-2" style={{ color: "#6B7280" }}>{fb.comment}</div>
                  <div className="flex items-center gap-3 text-[10px]" style={{ color: "#9CA3AF" }}>
                    <span>{"🍽️"} {t("ngo.feedback.quality_short")} {fb.foodQuality}/5</span>
                    <span>{"📦"} {t("ngo.feedback.packaging_short")} {fb.packaging}/5</span>
                    <span>{"⏰"} {t("ngo.feedback.timeliness_short")} {fb.timeliness}/5</span>
                    <span>{"📊"} {t("ngo.feedback.quantity_short")} {fb.quantity}/5</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px]" style={{ color: "#9CA3AF" }}>
                    <Clock className="w-3 h-3" /> {fb.date}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[16px] font-extrabold font-mono-data" style={{ color: "#059669" }}>+{fb.pointsAwarded}</div>
                  <div className="text-[10px]" style={{ color: "#9CA3AF" }}>{t("ngo.feedback.pts_awarded")}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
