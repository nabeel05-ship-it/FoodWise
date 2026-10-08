"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, X, CheckCircle2, BellRing } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

type PromptStatus = "loading" | "ask" | "granted" | "denied" | "unsupported" | "hidden";

export default function PushNotificationPrompt() {
  const { t } = useLang();
  const [status, setStatus] = useState<PromptStatus>("loading");

  const registerServiceWorker = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        console.warn("FoodWise: VAPID key missing — push won't work");
        return;
      }

      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        }));

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      console.log("FoodWise: Push subscription registered");
    } catch (err) {
      console.error("FoodWise: Push registration failed:", err);
    }
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || typeof Notification === "undefined") {
      setTimeout(() => setStatus("unsupported"), 0);
      return;
    }

    if (Notification.permission === "granted" || Notification.permission === "denied") {
      if (Notification.permission === "granted") registerServiceWorker();
      setTimeout(() => setStatus("hidden"), 0);
      return;
    }

    // Check if dismissed in this session
    try {
      if (sessionStorage.getItem("foodwise_push_prompt_dismissed") === "true") {
        setTimeout(() => setStatus("hidden"), 0);
        return;
      }
    } catch {}

    // Permission is "default" — show the prompt after a short delay
    const timer = setTimeout(() => setStatus("ask"), 2500);
    return () => clearTimeout(timer);
  }, [registerServiceWorker]);

  const handleEnable = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setStatus("granted");
        await registerServiceWorker();
        try { sessionStorage.setItem("foodwise_push_prompt_dismissed", "true"); } catch {}
        setTimeout(() => setStatus("hidden"), 3000);
      } else {
        setStatus("denied");
        try { sessionStorage.setItem("foodwise_push_prompt_dismissed", "true"); } catch {}
        setTimeout(() => setStatus("hidden"), 3000);
      }
    } catch {
      setStatus("denied");
    }
  };

  const handleDismiss = () => {
    setStatus("hidden");
    try {
      sessionStorage.setItem("foodwise_push_prompt_dismissed", "true");
    } catch {}
  };

  // Don't show anything while loading, if hidden, or if unsupported
  if (status === "loading" || status === "hidden" || status === "unsupported") return null;

  return (
    <div className="fixed bottom-4 right-4 z-[45] w-[320px] max-w-[calc(100vw-2rem)]" style={{ animation: "slideUp 0.3s ease-out" }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E8ECF3] p-4">
        {status === "granted" ? (
          <div className="flex items-center gap-3 text-emerald-600">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <p className="text-sm font-bold">{t("push.enabled")}</p>
              <p className="text-xs text-[#6B7280]">{t("push.enabled_desc")}</p>
            </div>
          </div>
        ) : status === "denied" ? (
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 shrink-0 text-[#9CA3AF]" />
            <div>
              <p className="text-sm font-bold text-[#374151]">{t("push.blocked")}</p>
              <p className="text-xs text-[#6B7280]">{t("push.blocked_desc")}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <BellRing className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#111827]">{t("push.title")}</h3>
                  <button
                    onClick={handleDismiss}
                    aria-label="Dismiss"
                    className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F3F4F6] transition-colors -mt-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                  {t("push.desc")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 ml-[52px]">
              <button
                onClick={handleEnable}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                {t("common.enable")}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#6B7280] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                {t("common.not_now")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
