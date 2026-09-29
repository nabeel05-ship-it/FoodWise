"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  BrainCircuit,
  Calendar,
  Sparkles,
  Lightbulb,
  Save,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useLang } from "@/context/LanguageContext";

export default function KitchenPredictionPage() {
  const { t } = useLang();
  const {
    managerOverride,
    isOverrideActive,
    saveManagerOverride,
    clearManagerOverride,
  } = useApp();

  // Initialize to current date
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [overrideMeals, setOverrideMeals] = useState<number>(
    managerOverride ? managerOverride.meals : 840
  );
  const [overrideReason, setOverrideReason] = useState(
    managerOverride ? managerOverride.reason : "Known attendance change"
  );
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  // Sync inputs when managerOverride is loaded from DB or localStorage
  useEffect(() => {
    if (managerOverride) {
      setOverrideMeals(managerOverride.meals);
      if (managerOverride.reason) {
        setOverrideReason(managerOverride.reason);
      }
    }
  }, [managerOverride]);

  // Compute date details dynamically
  const { dayOfWeek, formattedDate, isToday, isTomorrow, dateTitle } = useMemo(() => {
    try {
      const [year, month, day] = selectedDate.split("-").map(Number);
      const parsed = new Date(year, month - 1, day);
      const dow = parsed.toLocaleDateString("en-US", { weekday: "long" });
      const fDate = parsed.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];
      const tomorrowObj = new Date(now);
      tomorrowObj.setDate(tomorrowObj.getDate() + 1);
      const tomorrowStr = tomorrowObj.toISOString().split("T")[0];

      const todayMatch = selectedDate === todayStr;
      const tomorrowMatch = selectedDate === tomorrowStr;

      let title = fDate;
      if (todayMatch) title = `${t("kitchen.pred.today")} (${fDate})`;
      else if (tomorrowMatch) title = `${t("kitchen.pred.tomorrow")} (${fDate})`;

      return {
        dayOfWeek: dow,
        formattedDate: fDate,
        isToday: todayMatch,
        isTomorrow: tomorrowMatch,
        dateTitle: title,
      };
    } catch {
      return {
        dayOfWeek: "Friday",
        formattedDate: "Sep 25, 2026",
        isToday: true,
        isTomorrow: false,
        dateTitle: `${t("kitchen.pred.today")} (Sep 25, 2026)`,
      };
    }
  }, [selectedDate, t]);

  // Dynamic forecast calculations based on day of week
  const dayForecast = useMemo(() => {
    // Variations based on day of week
    const dow = dayOfWeek.toLowerCase();
    let breakfast = 580;
    let lunch = 863;
    let snacks = 390;
    let dinner = 790;
    let factors = [
      `📅 ${dayOfWeek}`,
      "🔄 Standard Term",
      "🏫 Campus Active",
    ];
    let confidence = 89;

    if (dow === "friday") {
      lunch = 890;
      dinner = 690;
      breakfast = 560;
      factors = [
        "📅 Friday",
        "🍛 Special Lunch Biryani (+15%)",
        "🚶 Evening Outing (-14% dinner)",
        "🌧️ Clear Weather",
      ];
      confidence = 91;
    } else if (dow === "saturday") {
      breakfast = 410;
      lunch = 580;
      snacks = 320;
      dinner = 510;
      factors = [
        "📅 Saturday Weekend",
        "💤 Late Breakfast (-28%)",
        "🏖️ Off-Campus Excursions",
        "🎉 Evening Student Club Events",
      ];
      confidence = 85;
    } else if (dow === "sunday") {
      breakfast = 460;
      lunch = 640;
      snacks = 310;
      dinner = 620;
      factors = [
        "📅 Sunday Weekend",
        "🥞 Extended Brunch Buffet",
        "🎒 Hostel Return Influx (Evening)",
        "🔄 Prep for Monday Cycle",
      ];
      confidence = 86;
    } else if (dow === "monday") {
      breakfast = 610;
      lunch = 880;
      snacks = 410;
      dinner = 820;
      factors = [
        "📅 Monday",
        "🔄 Post-weekend Peak Attendance",
        "📚 Full Laboratory Schedules",
        "🏫 100% Hostel Occupancy",
      ];
      confidence = 94;
    } else {
      // Tue, Wed, Thu
      lunch = 855;
      dinner = 800;
      factors = [
        `📅 ${dayOfWeek}`,
        "📚 Mid-week Lecture Timetables",
        "📝 Continuous Internal Assessments",
        "🥗 Balanced Standard Menu",
      ];
      confidence = 90;
    }

    const effectiveLunch = isOverrideActive && managerOverride ? managerOverride.meals : lunch;
    const totalTarget = breakfast + effectiveLunch + snacks + dinner;
    const breakdown = [
      {
        meal: "Breakfast (07:30 - 09:30)",
        predicted: breakfast,
        lastWeek: breakfast - 15,
        suggestion: "Standard idli/sambar batching",
      },
      {
        meal: "Lunch (12:30 - 14:30)",
        predicted: effectiveLunch,
        lastWeek: lunch + 20,
        suggestion: isOverrideActive && managerOverride
          ? `Manager Override: ${managerOverride.reason}`
          : dow === "friday"
          ? "Prep 10% lower rice volume"
          : "Full buffet deployment",
      },
      {
        meal: "Evening Snacks (17:00 - 18:00)",
        predicted: snacks,
        lastWeek: snacks - 10,
        suggestion: "On-demand tea & samosa rolling",
      },
      {
        meal: "Dinner (19:30 - 21:30)",
        predicted: dinner,
        lastWeek: dinner + 35,
        suggestion: dow === "friday" ? "Anticipate student dine-outs" : "Standard roti/dal count",
      },
    ];

    return {
      lunchTarget: lunch,
      totalTarget,
      factors,
      confidence,
      breakdown,
    };
  }, [dayOfWeek, isOverrideActive, managerOverride]);

  // Friday pattern mini data
  const fridayPatternData = [
    { friday: "Aug 29", wastePct: 14 },
    { friday: "Sep 05", wastePct: 16 },
    { friday: "Sep 12", wastePct: 15 },
    { friday: "Sep 19", wastePct: 18 },
  ];

  const handleToggleOverride = (checked: boolean) => {
    if (!checked) {
      clearManagerOverride();
    } else {
      saveManagerOverride(overrideMeals, overrideReason);
    }
  };

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    saveManagerOverride(overrideMeals, overrideReason);
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 4000);
  };

  const displayedLunchMeals = isOverrideActive && managerOverride
    ? managerOverride.meals
    : dayForecast.lunchTarget;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4"
        style={{ borderBottom: "1px solid #E8ECF3" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#10B981" }}
            >
              {t("kitchen.pred.ai_demand_engine")}
            </span>
            <span style={{ color: "#D1D5DB" }}>•</span>
            <span className="text-xs" style={{ color: "#9CA3AF" }}>
              {t("kitchen.pred.iit_delhi_mess")}
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: "#111827" }}
          >
            {t("kitchen.pred.daily_forecaster")}
          </h1>
        </div>

        {/* Date Selector */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8ECF3",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-[#6B7280]">{t("kitchen.pred.forecast_date")}</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) {
                setSelectedDate(e.target.value);
              }
            }}
            className="bg-transparent font-semibold focus:outline-none cursor-pointer text-sm text-[#111827]"
          />
        </div>
      </div>

      {/* TOP SECTION — CURRENT PREDICTION BIG CARD */}
      <div
        className="card p-6 sm:p-8 relative overflow-hidden"
        style={{ borderLeft: "4px solid #10B981" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span
                className="badge badge-indigo flex items-center gap-1.5"
                style={{ padding: "4px 12px" }}
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                {t("kitchen.pred.dl_model")}
              </span>
              <span className="text-xs" style={{ color: "#9CA3AF" }}>
                {t("kitchen.pred.live_telemetry")} • {formattedDate}
              </span>
            </div>

            <div>
              <h2
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ color: "#111827" }}
              >
                {dateTitle}:{" "}
                <span className="font-mono-data" style={{ color: "#10B981" }}>
                  {displayedLunchMeals} {t("kitchen.pred.lunch_meals")}
                </span>{" "}
                {isOverrideActive && managerOverride ? (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 ml-2 uppercase tracking-wider align-middle">
                    {t("kitchen.pred.manager_override_badge")}
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 ml-2 uppercase tracking-wider align-middle">
                    {t("kitchen.pred.ai_forecast_badge")}
                  </span>
                )}
              </h2>
              <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                {t("kitchen.pred.calculated_desc")}
              </p>
            </div>

            {/* Factors Pills */}
            <div>
              <div
                className="text-xs font-semibold mb-2 uppercase tracking-wider"
                style={{ color: "#9CA3AF" }}
              >
                {t("kitchen.pred.influencing_factors")} {dayOfWeek}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {dayForecast.factors.map((factor, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg font-medium"
                    style={{
                      background: idx === 1 ? "#FFF8EB" : "#F9FAFB",
                      border: idx === 1 ? "1px solid #FDE68A" : "1px solid #E5E7EB",
                      color: idx === 1 ? "#92400E" : "#374151",
                    }}
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Confidence Gauge */}
          <div
            className="lg:col-span-4 p-5 rounded-2xl text-center space-y-3"
            style={{ background: "#F9FAFB", border: "1px solid #E8ECF3" }}
          >
            <div className="text-xs font-semibold" style={{ color: "#9CA3AF" }}>
              {t("kitchen.pred.confidence_score")}
            </div>
            <div
              className="text-4xl font-black font-mono-data"
              style={{ color: "#111827" }}
            >
              {dayForecast.confidence}%
            </div>
            <div
              className="w-full rounded-full h-2.5 overflow-hidden"
              style={{ background: "#E5E7EB" }}
            >
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${dayForecast.confidence}%`,
                  background: "linear-gradient(90deg, #10B981, #059669)",
                }}
              />
            </div>
            <div
              className="text-[11px] flex items-center justify-between"
              style={{ color: "#9CA3AF" }}
            >
              <span>{t("kitchen.pred.low_variance")}</span>
              <span className="font-semibold" style={{ color: "#059669" }}>
                {t("kitchen.pred.high_precision")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PREDICTION BREAKDOWN TABLE */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">{t("kitchen.pred.meal_breakdown")}</h3>
            <p className="section-subtitle">
              {t("kitchen.pred.granular_forecast")} {dayOfWeek}, {formattedDate} {t("kitchen.pred.compared_baseline")}
            </p>
          </div>
          <span className="badge badge-success font-mono-data">
            {t("kitchen.pred.total_target")} {dayForecast.totalTarget.toLocaleString()} {t("kitchen.pred.meals")}
          </span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>{t("kitchen.pred.meal_service")}</th>
              <th>{t("kitchen.pred.predicted_diners")}</th>
              <th>{t("kitchen.pred.last_week_same_day")}</th>
              <th>{t("kitchen.pred.ai_chef_suggestion")}</th>
              <th style={{ textAlign: "right" }}>{t("kitchen.pred.variance")}</th>
            </tr>
          </thead>
          <tbody>
            {dayForecast.breakdown.map((row) => (
              <tr key={row.meal}>
                <td className="font-bold" style={{ color: "#111827" }}>
                  {row.meal}
                </td>
                <td
                  className="font-mono-data font-semibold"
                  style={{ color: "#111827" }}
                >
                  {row.predicted}
                </td>
                <td className="font-mono-data" style={{ color: "#9CA3AF" }}>
                  {row.lastWeek}
                </td>
                <td>
                  <span className="badge badge-success">{row.suggestion}</span>
                </td>
                <td
                  className="font-mono-data text-right"
                  style={{ color: row.predicted >= row.lastWeek ? "#059669" : "#D97706" }}
                >
                  {row.predicted >= row.lastWeek
                    ? `+${row.predicted - row.lastWeek} ${t("kitchen.pred.meals")}`
                    : `${row.predicted - row.lastWeek} ${t("kitchen.pred.meals")}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TWO COLUMN ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MANAGER OVERRIDE (7 cols) */}
        <div className="lg:col-span-7 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title flex items-center gap-2">
                {t("kitchen.pred.manager_manual_override")}
                {isOverrideActive && (
                  <span className="badge badge-warning">{t("kitchen.pred.active_override")}</span>
                )}
              </h3>
              <p className="section-subtitle">
                {t("kitchen.pred.empower_human")}
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isOverrideActive}
                onChange={(e) => handleToggleOverride(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"
                style={{ background: isOverrideActive ? "#10B981" : "#D1D5DB" }}
              />
            </label>
          </div>

          {isOverrideActive ? (
            <form onSubmit={handleSaveOverride} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#6B7280" }}
                  >
                    {t("kitchen.pred.adjusted_lunch")} ({dayOfWeek})
                  </label>
                  <input
                    type="number"
                    value={overrideMeals}
                    onChange={(e) => setOverrideMeals(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl font-mono-data text-sm focus:outline-none"
                    style={{
                      background: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      color: "#111827",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#6B7280" }}
                  >
                    {t("kitchen.pred.override_justification")}
                  </label>
                  <select
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none"
                    style={{
                      background: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      color: "#111827",
                    }}
                  >
                    <option value="Known attendance change">{t("kitchen.pred.reason_attendance")}</option>
                    <option value="Special event">{t("kitchen.pred.reason_event")}</option>
                    <option value="Holiday">{t("kitchen.pred.reason_holiday")}</option>
                    <option value="Other">{t("kitchen.pred.reason_other")}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] max-w-sm" style={{ color: "#9CA3AF" }}>
                  ℹ️ {t("kitchen.pred.retrain_note")}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => clearManagerOverride()}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                  >
                    {t("kitchen.pred.turn_off_override")}
                  </button>
                  <button type="submit" className="btn-primary">
                    <Save className="w-3.5 h-3.5" />
                    {t("kitchen.pred.save_override")}
                  </button>
                </div>
              </div>

              {feedbackSaved && (
                <div className="alert-banner alert-banner-success">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0"
                      style={{ color: "#059669" }}
                    />
                    <span>
                      {t("kitchen.pred.override_success_prefix")} {overrideMeals} {t("kitchen.pred.override_success_suffix")}
                    </span>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div
              className="p-6 rounded-xl text-center space-y-2"
              style={{ background: "#F9FAFB", border: "1px dashed #E5E7EB" }}
            >
              <Sparkles
                className="w-6 h-6 mx-auto opacity-70"
                style={{ color: "#10B981" }}
              />
              <div
                className="text-xs font-semibold"
                style={{ color: "#111827" }}
              >
                {t("kitchen.pred.autonomous_active")}
              </div>
              <p
                className="text-[11px] max-w-md mx-auto"
                style={{ color: "#9CA3AF" }}
              >
                {t("kitchen.pred.toggle_hint")}
              </p>
            </div>
          )}
        </div>

        {/* AI INSIGHT PANEL (5 cols) */}
        <div
          className="lg:col-span-5 card p-6"
          style={{
            background: "linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)",
            borderColor: "#A7F3D0",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5" style={{ color: "#F59E0B" }} />
            <h3 className="text-sm font-bold" style={{ color: "#111827" }}>
              {t("kitchen.pred.pattern_engine")}
            </h3>
          </div>

          <div
            className="p-4 rounded-xl space-y-2 mb-4"
            style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}
          >
            <div
              className="text-xs font-bold flex items-center gap-1.5"
              style={{ color: "#111827" }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "#F59E0B" }}
              />
              {t("kitchen.pred.pattern_detected")}
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
              {t("kitchen.pred.friday_rice_desc")}{" "}
              <strong style={{ color: "#D97706" }}>{t("kitchen.pred.friday_rice_pct")}</strong>{" "}
              {t("kitchen.pred.friday_rice_reason")}
            </p>
            <div className="pt-1 text-xs font-semibold" style={{ color: "#10B981" }}>
              💡 {t("kitchen.pred.suggestion_reduce")}
            </div>
          </div>

          <div
            className="text-xs font-semibold mb-2"
            style={{ color: "#9CA3AF" }}
          >
            {t("kitchen.pred.last_4_fridays")}
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fridayPatternData}>
                <XAxis
                  dataKey="friday"
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickLine={false}
                  unit="%"
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1B2138",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "#F1F5F9",
                  }}
                />
                <Bar
                  dataKey="wastePct"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  name={t("kitchen.pred.rice_waste_pct")}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
