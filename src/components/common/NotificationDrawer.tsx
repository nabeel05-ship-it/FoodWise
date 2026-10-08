"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";
import { X, Bell, AlertTriangle, AlertCircle, CheckCircle2, Info, ArrowRight, Check, Clock, BellOff } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotificationDrawer() {
  const {
    notifications,
    isNotificationOpen,
    setIsNotificationOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadCount,
  } = useApp();
  const { t } = useLang();
  const pathname = usePathname() || "";

  const [now, setNow] = useState<number>(Date.now());

  const currentSection = pathname.split('/')[1];
  const knownSections = ['ngo', 'restaurant', 'hotel', 'household', 'kitchen'];

  const filteredNotifications = notifications.filter(notif => {
    if (!currentSection || !knownSections.includes(currentSection)) return true;
    const actionDomain = notif.actionUrl?.split('/')[1];
    if (actionDomain && knownSections.includes(actionDomain)) {
      return actionDomain === currentSection;
    }
    return true; // Fallback: show if we can't determine
  });

  const displayUnreadCount = filteredNotifications.filter(n => !n.read).length;

  const closeDrawer = useCallback(() => setIsNotificationOpen(false), [setIsNotificationOpen]);

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
    setNow(Date.now());
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 15000);
    return () => clearInterval(interval);
  }, [isNotificationOpen]);

  if (!isNotificationOpen) return null;

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
      const exactTime = new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

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
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      onClick={closeDrawer}
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
    >
      <div
        className="w-full max-w-md h-full bg-white border-l border-[#E8ECF3] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8ECF3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-[#111827] text-base flex items-center gap-2">
                {t("notif.title")}
                {displayUnreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-200">
                    {displayUnreadCount} {t("notif.new")}
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#6B7280]">{t("notif.subtitle")}</p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close notifications"
            className="p-2 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions Bar */}
        <div className="px-5 py-2.5 bg-[#FAFBFC] border-b border-[#E8ECF3] flex items-center justify-between text-xs">
          <span className="text-[#6B7280]">{filteredNotifications.length} {t("notif.total_alerts")}</span>
          {displayUnreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-emerald-600 hover:underline flex items-center gap-1 font-medium"
            >
              <Check className="w-3.5 h-3.5" /> {t("common.mark_all_read")}
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-4">
                <BellOff className="w-7 h-7 text-[#9CA3AF]" />
              </div>
              <p className="text-sm font-semibold text-[#374151] mb-1">{t("notif.empty_title")}</p>
              <p className="text-xs text-[#6B7280] max-w-[240px]">{t("notif.empty_desc")}</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") markNotificationAsRead(notif.id); }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  notif.read
                    ? "bg-white border-[#E8ECF3] opacity-70"
                    : "bg-emerald-50/30 border-emerald-100 hover:border-emerald-200 shadow-sm"
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
                    {notif.actionLabel && notif.actionUrl && (
                      <Link
                        href={notif.actionUrl}
                        onClick={closeDrawer}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200"
                      >
                        {t(notif.actionLabel)}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8ECF3] bg-[#FAFBFC] flex items-center justify-between text-xs text-[#6B7280]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t("notif.live_monitoring")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
