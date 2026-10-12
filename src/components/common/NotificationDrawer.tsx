"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import {
  X,
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowRight,
  Clock,
  BellOff,
  CheckCheck,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { MOTION_SPRINGS, MOTION_DURATIONS } from "@/lib/motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function resolveNotificationActionUrl(url?: string, userRole?: string): string | undefined {
  if (!url) return undefined;
  // Resolve legacy/faulty impact routes to appropriate role-scoped destination
  if (url === "/dashboard/impact" || url === "/impact") {
    if (userRole === "NGO") return "/ngo/impact";
    if (userRole === "HOUSEHOLD") return "/household/impact";
    return "/hotel/impact";
  }
  // Resolve legacy /restaurant/* paths to /hotel/*
  if (url.startsWith("/restaurant/")) {
    return url.replace("/restaurant/", "/hotel/");
  }
  // Resolve legacy /ngo/completed to the NGO redistribution history tab
  if (url === "/ngo/completed") {
    return "/ngo/dashboard?tab=history";
  }
  return url;
}

export default function NotificationDrawer() {
  const {
    scopedNotifications,
    unreadCount,
    isNotificationOpen,
    setIsNotificationOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    userRole,
  } = useApp();
  const { t } = useLang();
  const prefersReduced = useReducedMotion();

  const [now, setNow] = useState<number>(() => Date.now());
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notifListRef] = useAutoAnimate<HTMLDivElement>();

  const closeDrawer = useCallback(() => {
    setIsNotificationOpen(false);
    setErrorMsg(null);
  }, [setIsNotificationOpen]);

  useEffect(() => {
    if (!isNotificationOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isNotificationOpen, closeDrawer]);

  useEffect(() => {
    if (!isNotificationOpen) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 15000);
    return () => clearInterval(interval);
  }, [isNotificationOpen]);

  const handleMarkAllRead = async () => {
    if (unreadCount === 0 || isMarkingAllRead) return;
    setIsMarkingAllRead(true);
    setErrorMsg(null);
    try {
      await markAllNotificationsAsRead();
    } catch {
      setErrorMsg(t("Failed to update notifications. Please try again."));
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "urgent":
        return <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "urgent":
        return "bg-red-50 text-red-600 border-red-200";
      case "warning":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "success":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      default:
        return "bg-blue-50 text-blue-600 border-blue-200";
    }
  };

  const formatNotificationTime = (time: string, createdAt?: number | string) => {
    let timestamp: number | null = null;
    if (typeof createdAt === "number" && !isNaN(createdAt)) {
      timestamp = createdAt;
    } else if (typeof createdAt === "string" && !isNaN(new Date(createdAt).getTime())) {
      timestamp = new Date(createdAt).getTime();
    } else if (time && !isNaN(new Date(time).getTime())) {
      timestamp = new Date(time).getTime();
    }

    if (timestamp) {
      const diffMs = now - timestamp;
      const diffSec = Math.max(0, Math.floor(diffMs / 1000));

      if (diffSec < 45) return t("common.just_now");
      const diffMins = Math.floor(diffSec / 60);
      if (diffMins < 60) return `${diffMins} ${t("minutes ago")}`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} ${t("hours ago")}`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return t("common.yesterday");
      return `${diffDays} ${t("days ago")}`;
    }

    return time === "Just now" ? t("common.just_now") : t(time);
  };

  return (
    <AnimatePresence>
      {isNotificationOpen && (
        <motion.div
          key="notification-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: MOTION_DURATIONS.fast }}
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs"
          onClick={closeDrawer}
          role="dialog"
          aria-modal="true"
          aria-label="Notifications"
        >
          <motion.div
            key="notification-panel"
            initial={prefersReduced ? { opacity: 0 } : { x: "100%" }}
            animate={prefersReduced ? { opacity: 1 } : { x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { x: "100%" }}
            transition={prefersReduced ? { duration: MOTION_DURATIONS.fast } : MOTION_SPRINGS.natural}
            className="w-full max-w-md h-full bg-white border-l border-[#E8ECF3] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-[#E8ECF3] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-[#111827] text-base flex items-center gap-2">
                    {t("notif.title")}
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-200">
                        {unreadCount} {t("notif.new")}
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-[#6B7280]">{t("notif.subtitle")}</p>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                type="button"
                aria-label="Close notifications"
                className="p-2 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions Bar with functional Mark All As Read */}
            <div className="px-5 py-2.5 bg-[#FAFBFC] border-b border-[#E8ECF3] flex items-center justify-between text-xs gap-3">
              <span className="text-[#6B7280] font-medium shrink-0">
                {scopedNotifications.length} {t("notif.total_alerts")}
              </span>
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0 || isMarkingAllRead}
                aria-label={t("common.mark_all_read") || "Mark all as read"}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 focus-visible:outline-offset-1 ${
                  unreadCount > 0 && !isMarkingAllRead
                    ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 active:scale-95 shadow-2xs"
                    : "text-[#9CA3AF] bg-transparent border border-transparent cursor-not-allowed opacity-60"
                }`}
              >
                {isMarkingAllRead ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>{t("common.saving") || "Updating..."}</span>
                  </>
                ) : (
                  <>
                    <CheckCheck className={`w-3.5 h-3.5 ${unreadCount > 0 ? "text-emerald-600" : "text-[#9CA3AF]"}`} />
                    <span>{t("common.mark_all_read") || "Mark all as read"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message if persistence fails */}
            {errorMsg && (
              <div className="px-5 py-2 bg-red-50 text-red-700 text-xs border-b border-red-200 flex items-center justify-between">
                <span>{errorMsg}</span>
                <button
                  type="button"
                  onClick={() => setErrorMsg(null)}
                  className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* List */}
            <div ref={notifListRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {scopedNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-4">
                    <BellOff className="w-7 h-7 text-[#9CA3AF]" />
                  </div>
                  <p className="text-sm font-semibold text-[#374151] mb-1">{t("notif.empty_title")}</p>
                  <p className="text-xs text-[#6B7280] max-w-[240px]">{t("notif.empty_desc")}</p>
                </div>
              ) : (
                scopedNotifications.map((notif, index) => {
                  const resolvedUrl = resolveNotificationActionUrl(notif.actionUrl, userRole);
                  return (
                    <motion.div
                      key={`${notif.id}-${index}`}
                      initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: MOTION_DURATIONS.fast }}
                      whileHover={prefersReduced ? undefined : { y: -1 }}
                      whileTap={prefersReduced ? undefined : { scale: 0.99 }}
                      onClick={() => markNotificationAsRead(notif.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          markNotificationAsRead(notif.id);
                        }
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        notif.read
                          ? "bg-white border-[#E8ECF3] opacity-75"
                          : "bg-emerald-50/30 border-emerald-100 hover:border-emerald-200 shadow-xs"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(notif.severity)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                            <span
                              className={`text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getSeverityBadge(
                                notif.severity
                              )}`}
                            >
                              {t(notif.category) || notif.category}
                            </span>
                            <span className="text-[11px] text-[#6B7280] font-medium flex items-center gap-1 shrink-0">
                              <Clock className="w-3 h-3" />
                              {formatNotificationTime(notif.time, notif.createdAt)}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-[#111827] mb-1">
                            {t(notif.title, notif.titleParams)}
                          </h3>
                          <p className="text-xs text-[#6B7280] leading-relaxed mb-3">
                            {t(notif.message, notif.messageParams)}
                          </p>
                          {notif.actionLabel && resolvedUrl && (
                            <Link
                              href={resolvedUrl}
                              onClick={(e) => {
                                e.stopPropagation();
                                markNotificationAsRead(notif.id);
                                closeDrawer();
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200 cursor-pointer"
                            >
                              {t(notif.actionLabel)}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E8ECF3] bg-[#FAFBFC] flex items-center justify-between text-xs text-[#6B7280]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t("notif.live_monitoring")}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
