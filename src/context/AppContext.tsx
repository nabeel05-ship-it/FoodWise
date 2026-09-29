"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { InstitutionRole, NotificationAlert, SurplusItem } from "@/lib/types";
import { INITIAL_NOTIFICATIONS, SURPLUS_ITEMS } from "@/lib/mockData";

export interface DonorHotel {
  id: string;
  name: string;
  location: string;
  totalPoints: number;
  totalDonations: number;
  avgRating: number;
  totalRatings: number;
  lastDonation: string;
  specialBadges: string[];
  streak: number;
  fssaiVerified: boolean;
}

export interface FeedbackEntry {
  id: string;
  hotelId: string;
  hotelName: string;
  date: string;
  foodQuality: number;
  packaging: number;
  timeliness: number;
  quantity: number;
  overallRating: number;
  comment: string;
  pointsAwarded: number;
}

export type DonorTier = "Platinum" | "Gold" | "Silver" | "Bronze";

export function getDonorTier(points: number): DonorTier {
  if (points >= 5000) return "Platinum";
  if (points >= 2000) return "Gold";
  if (points >= 500) return "Silver";
  return "Bronze";
}

const INITIAL_HOTELS: DonorHotel[] = [
  {
    id: "h-1",
    name: "The Oberoi New Delhi",
    location: "Dr. Zakir Hussain Marg",
    totalPoints: 6840,
    totalDonations: 147,
    avgRating: 4.8,
    totalRatings: 89,
    lastDonation: "Today, 1:30 PM",
    specialBadges: ["Consistent Donor", "Top Quality", "Cold Chain Certified"],
    streak: 34,
    fssaiVerified: true,
  },
  {
    id: "h-2",
    name: "IIT Delhi Central Mess",
    location: "Hauz Khas, New Delhi",
    totalPoints: 4250,
    totalDonations: 210,
    avgRating: 4.5,
    totalRatings: 156,
    lastDonation: "Today, 12:00 PM",
    specialBadges: ["Bulk Contributor", "Consistent Donor", "Zero Waste Champion"],
    streak: 52,
    fssaiVerified: true,
  },
  {
    id: "h-3",
    name: "Bikanervala Central Kitchen",
    location: "Okhla Phase III",
    totalPoints: 3180,
    totalDonations: 98,
    avgRating: 4.3,
    totalRatings: 64,
    lastDonation: "Yesterday, 5:00 PM",
    specialBadges: ["Festival Support", "Rapid Response"],
    streak: 18,
    fssaiVerified: true,
  },
  {
    id: "h-4",
    name: "AIIMS Staff Cafeteria",
    location: "Ansari Nagar, New Delhi",
    totalPoints: 1850,
    totalDonations: 65,
    avgRating: 4.1,
    totalRatings: 42,
    lastDonation: "Sep 23, 3:30 PM",
    specialBadges: ["Weekend Hero"],
    streak: 8,
    fssaiVerified: true,
  },
  {
    id: "h-5",
    name: "Rajdhani Thali House",
    location: "Connaught Place",
    totalPoints: 920,
    totalDonations: 34,
    avgRating: 3.9,
    totalRatings: 22,
    lastDonation: "Sep 22, 6:00 PM",
    specialBadges: ["Rapid Response"],
    streak: 5,
    fssaiVerified: false,
  },
  {
    id: "h-6",
    name: "Street Food Collective — Chandni Chowk",
    location: "Chandni Chowk, Old Delhi",
    totalPoints: 380,
    totalDonations: 12,
    avgRating: 3.7,
    totalRatings: 8,
    lastDonation: "Sep 20, 4:15 PM",
    specialBadges: [],
    streak: 3,
    fssaiVerified: false,
  },
];

const INITIAL_FEEDBACK: FeedbackEntry[] = [
  {
    id: "fb-1",
    hotelId: "h-1",
    hotelName: "The Oberoi New Delhi",
    date: "Sep 24, 2026",
    foodQuality: 5,
    packaging: 5,
    timeliness: 4,
    quantity: 5,
    overallRating: 4.8,
    comment: "Excellent quality food, well-packaged in insulated containers. Arrived fresh and warm.",
    pointsAwarded: 85,
  },
  {
    id: "fb-2",
    hotelId: "h-2",
    hotelName: "IIT Delhi Central Mess",
    date: "Sep 24, 2026",
    foodQuality: 4,
    packaging: 4,
    timeliness: 5,
    quantity: 5,
    overallRating: 4.5,
    comment: "Large quantity, always on time. Good basic food that feeds many people.",
    pointsAwarded: 70,
  },
  {
    id: "fb-3",
    hotelId: "h-3",
    hotelName: "Bikanervala Central Kitchen",
    date: "Sep 23, 2026",
    foodQuality: 5,
    packaging: 3,
    timeliness: 4,
    quantity: 4,
    overallRating: 4.0,
    comment: "Great food quality. Packaging could be improved — some containers leaked during transport.",
    pointsAwarded: 55,
  },
];

interface AppContextType {
  currentRole: InstitutionRole;
  setCurrentRole: (role: InstitutionRole) => void;
  notifications: NotificationAlert[];
  unreadCount: number;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isOverrideActive: boolean;
  setIsOverrideActive: (active: boolean) => void;
  clearManagerOverride: () => void;
  surplusList: SurplusItem[];
  requestNgoPickup: (surplusId: string, ngoName: string) => void;
  isBatchPrioritized: boolean;
  prioritizeBatch: () => void;
  isTechnicianAssigned: boolean;
  assignTechnician: () => void;
  managerOverride: { meals: number; reason: string } | null;
  saveManagerOverride: (meals: number, reason: string) => void;
  acceptedPickups: string[];
  acceptNgoPickup: (itemId: string) => void;
  isApiInspectorOpen: boolean;
  setIsApiInspectorOpen: (open: boolean) => void;
  // Donor feedback & points
  donorHotels: DonorHotel[];
  donorFeedback: FeedbackEntry[];
  rankedHotels: DonorHotel[];
  submitDonorFeedback: (hotelId: string, ratings: { foodQuality: number; packaging: number; timeliness: number; quantity: number }, comment: string) => number;
  getHotelRank: (hotelId: string) => number;
  // Database connection status
  dbConnected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper: fire-and-forget API call (no await needed in handlers)
function apiCall(url: string, options?: RequestInit) {
  fetch(url, options).catch((err) => console.error(`API call to ${url} failed:`, err));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<InstitutionRole>("KITCHEN_MANAGER");
  const [notifications, setNotifications] = useState<NotificationAlert[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [surplusList, setSurplusList] = useState<SurplusItem[]>(SURPLUS_ITEMS);
  const [isBatchPrioritized, setIsBatchPrioritized] = useState(false);
  const [isTechnicianAssigned, setIsTechnicianAssigned] = useState(false);
  const [managerOverride, setManagerOverride] = useState<{ meals: number; reason: string } | null>(null);
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  const [acceptedPickups, setAcceptedPickups] = useState<string[]>([]);
  const [isApiInspectorOpen, setIsApiInspectorOpen] = useState(false);
  const [donorHotels, setDonorHotels] = useState<DonorHotel[]>(INITIAL_HOTELS);
  const [donorFeedback, setDonorFeedback] = useState<FeedbackEntry[]>(INITIAL_FEEDBACK);
  const [dbConnected, setDbConnected] = useState(false);

  // ─── Load data from MongoDB on mount ───────────────────────────────
  useEffect(() => {
    async function loadFromDb() {
      try {
        const res = await fetch("/api/data");
        const json = await res.json();

        if (json.success && json.data) {
          setDbConnected(true);
          const d = json.data;

          // Hydrate notifications from DB
          if (d.notifications?.length > 0) {
            setNotifications(
              d.notifications.map((n: Record<string, unknown>) => ({
                id: (n.notifId as string) || (n._id as string),
                title: n.title as string,
                message: n.message as string,
                time: n.time as string,
                createdAt: n.createdAt
                  ? typeof n.createdAt === "number"
                    ? n.createdAt
                    : new Date(n.createdAt as string).getTime()
                  : undefined,
                severity: n.severity as string,
                category: n.category as string,
                actionLabel: n.actionLabel as string | undefined,
                actionUrl: n.actionUrl as string | undefined,
                read: n.read as boolean,
              }))
            );
          }

          // Hydrate surplus from DB
          if (d.surplusItems?.length > 0) {
            setSurplusList(
              d.surplusItems.map((s: Record<string, unknown>) => ({
                id: (s.surplusId as string) || (s._id as string),
                item: s.item as string,
                quantityKg: s.quantityKg as number,
                preparedAt: s.preparedAt as string,
                safeUntil: s.safeUntil as string,
                hoursRemaining: s.hoursRemaining as number,
                status: s.status as string,
                prepRecorded: s.prepRecorded as boolean,
                tempCelsius: s.tempCelsius as number,
                coveredHygienic: s.coveredHygienic as boolean,
                eligible: s.eligible as boolean,
                matchedNgo: s.matchedNgo as string | undefined,
              }))
            );
          }

          // Hydrate donor hotels from DB
          if (d.donorHotels?.length > 0) {
            setDonorHotels(
              d.donorHotels.map((h: Record<string, unknown>) => ({
                id: (h.hotelId as string) || (h._id as string),
                name: h.name as string,
                location: h.location as string,
                totalPoints: h.totalPoints as number,
                totalDonations: h.totalDonations as number,
                avgRating: h.avgRating as number,
                totalRatings: h.totalRatings as number,
                lastDonation: h.lastDonation as string,
                specialBadges: (h.specialBadges as string[]) || [],
                streak: h.streak as number,
                fssaiVerified: h.fssaiVerified as boolean,
              }))
            );
          }

          // Hydrate donor feedback from DB
          if (d.donorFeedback?.length > 0) {
            setDonorFeedback(
              d.donorFeedback.map((f: Record<string, unknown>) => ({
                id: (f.feedbackId as string) || (f._id as string),
                hotelId: f.hotelId as string,
                hotelName: f.hotelName as string,
                date: f.date as string,
                foodQuality: f.foodQuality as number,
                packaging: f.packaging as number,
                timeliness: f.timeliness as number,
                quantity: f.quantity as number,
                overallRating: f.overallRating as number,
                comment: f.comment as string,
                pointsAwarded: f.pointsAwarded as number,
              }))
            );
          }

          // Hydrate manager override from DB
          if (d.managerOverride && d.managerOverride.active !== false) {
            const ov = {
              meals: Number(d.managerOverride.meals),
              reason: (d.managerOverride.reason as string) || "Known attendance change",
            };
            setManagerOverride(ov);
            setIsOverrideActive(true);
            try {
              localStorage.setItem("foodwise_manager_override", JSON.stringify({ ...ov, active: true }));
            } catch {
              // ignore
            }
          } else if (d.managerOverride === null) {
            setManagerOverride(null);
            setIsOverrideActive(false);
            try {
              localStorage.removeItem("foodwise_manager_override");
            } catch {
              // ignore
            }
          }

          console.log("✅ FoodWise: Data loaded from MongoDB");
        }
      } catch (err) {
        console.warn("⚠️ FoodWise: Could not load from MongoDB, using local mock data.", err);
      }
    }

    // Immediately restore manager override from localStorage on initial render
    try {
      const stored = localStorage.getItem("foodwise_manager_override");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.meals === "number" && parsed.active) {
          setManagerOverride({ meals: parsed.meals, reason: parsed.reason || "Known attendance change" });
          setIsOverrideActive(true);
        }
      }
    } catch {
      // ignore
    }

    loadFromDb();
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // Persist to MongoDB
    apiCall("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notifId: id }),
    });
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // Persist to MongoDB
    apiCall("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
  }, []);

  const addNotification = useCallback((notif: NotificationAlert) => {
    const createdAtNum = typeof notif.createdAt === "number"
      ? notif.createdAt
      : notif.createdAt
      ? new Date(notif.createdAt).getTime()
      : Date.now();
    const exactTime = new Date(createdAtNum).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

    const enrichedNotif: NotificationAlert = {
      ...notif,
      createdAt: createdAtNum,
      time: notif.time && notif.time !== "Just now" ? notif.time : `Just now • ${exactTime}`,
    };
    setNotifications((prev) => [enrichedNotif, ...prev]);
    // Persist to MongoDB
    apiCall("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notifId: enrichedNotif.id,
        title: enrichedNotif.title,
        message: enrichedNotif.message,
        time: enrichedNotif.time,
        createdAt: new Date(createdAtNum).toISOString(),
        severity: enrichedNotif.severity,
        category: enrichedNotif.category,
        actionLabel: enrichedNotif.actionLabel,
        actionUrl: enrichedNotif.actionUrl,
      }),
    });

    // Send browser push notification
    apiCall("/api/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `FoodWise — ${enrichedNotif.category || "Alert"}`,
        body: enrichedNotif.title,
        url: enrichedNotif.actionUrl || "/",
        tag: enrichedNotif.id,
      }),
    });
  }, []);

  const requestNgoPickup = useCallback((surplusId: string, ngoName: string) => {
    setSurplusList((prev) =>
      prev.map((item) =>
        item.id === surplusId
          ? {
              ...item,
              matchedNgo: ngoName,
              status: "SAFE" as const,
            }
          : item
      )
    );

    // Persist to MongoDB
    apiCall("/api/surplus", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surplusId, matchedNgo: ngoName, status: "SAFE" }),
    });

    // Add notification (this also persists to MongoDB)
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: "Redistribution Pickup Dispatched",
      message: `Pickup scheduled with ${ngoName} for ${
        surplusList.find((s) => s.id === surplusId)?.item || "Surplus"
      }. Driver dispatched.`,
      time: "Just now",
      severity: "success",
      category: "Redistribution",
      read: false,
    };
    addNotification(newNotif);
  }, [surplusList, addNotification]);

  const prioritizeBatch = useCallback(() => {
    setIsBatchPrioritized(true);

    // Persist to MongoDB
    apiCall("/api/spoilage", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batchCode: "TOM-2024-0234", prioritized: true }),
    });

    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: "Batch TOM-2024-0234 Prioritized",
      message: "Batch moved to Front of Line for Ketchup Processing Unit 2. Production rerouted to salvage 2,800 kg.",
      time: "Just now",
      severity: "success",
      category: "Factory",
      read: false,
    };
    addNotification(newNotif);
  }, [addNotification]);

  const assignTechnician = useCallback(() => {
    setIsTechnicianAssigned(true);

    // Persist to MongoDB
    apiCall("/api/machines", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        machineId: "PM-03",
        assignedTechnician: "Rajesh Kumar (Senior Line Mechanic)",
      }),
    });

    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: "Technician Dispatched for PM-03",
      message: "Work Order #WO-891 assigned to Rajesh Kumar. Abrasive drum & blade alignment scheduled at 3:00 PM shift change.",
      time: "Just now",
      severity: "info",
      category: "IoT",
      read: false,
    };
    addNotification(newNotif);
  }, [addNotification]);

  const saveManagerOverride = useCallback((meals: number, reason: string) => {
    const numMeals = Number(meals);
    setManagerOverride({ meals: numMeals, reason });
    setIsOverrideActive(true);

    try {
      localStorage.setItem("foodwise_manager_override", JSON.stringify({ meals: numMeals, reason, active: true }));
    } catch {
      // ignore
    }

    // Persist to MongoDB
    apiCall("/api/overrides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meals: numMeals, reason }),
    });

    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: "Prediction Human Override Applied",
      message: `Manager adjusted target to ${numMeals} meals (Reason: ${reason}). Model feedback recorded for continuous learning.`,
      time: "Just now",
      severity: "info",
      category: "Kitchen",
      read: false,
    };
    addNotification(newNotif);
  }, [addNotification]);

  const clearManagerOverride = useCallback(() => {
    setManagerOverride(null);
    setIsOverrideActive(false);

    try {
      localStorage.removeItem("foodwise_manager_override");
    } catch {
      // ignore
    }

    // Deactivate in MongoDB
    apiCall("/api/overrides", {
      method: "DELETE",
    });

    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: "Autonomous AI Prediction Restored",
      message: "Manager manual override disabled. Deep Learning Demand Model v4.2 autonomous forecast reinstated.",
      time: "Just now",
      severity: "info",
      category: "Kitchen",
      read: false,
    };
    addNotification(newNotif);
  }, [addNotification]);

  const handleSetIsOverrideActive = useCallback((active: boolean) => {
    if (!active) {
      clearManagerOverride();
    } else {
      setIsOverrideActive(true);
      if (managerOverride) {
        saveManagerOverride(managerOverride.meals, managerOverride.reason);
      }
    }
  }, [clearManagerOverride, managerOverride, saveManagerOverride]);

  const acceptNgoPickup = useCallback((itemId: string) => {
    setAcceptedPickups((prev) => [...prev, itemId]);
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: "Pickup Confirmed by NGO",
      message: "Your volunteer driver assigned. Verification OTP generated. Thank you for preventing waste!",
      time: "Just now",
      severity: "success",
      category: "Redistribution",
      read: false,
    };
    addNotification(newNotif);
  }, [addNotification]);

  // Calculate points from ratings
  const calculatePoints = (ratings: { foodQuality: number; packaging: number; timeliness: number; quantity: number }) => {
    const total = ratings.foodQuality + ratings.packaging + ratings.timeliness + ratings.quantity;
    const avg = total / 4;
    if (avg >= 4.5) return 85;
    if (avg >= 4.0) return 70;
    if (avg >= 3.5) return 55;
    if (avg >= 3.0) return 40;
    if (avg >= 2.0) return 25;
    return 10;
  };

  const submitDonorFeedback = useCallback((
    hotelId: string,
    ratings: { foodQuality: number; packaging: number; timeliness: number; quantity: number },
    comment: string
  ): number => {
    const points = calculatePoints(ratings);
    const avg = (ratings.foodQuality + ratings.packaging + ratings.timeliness + ratings.quantity) / 4;
    const hotel = donorHotels.find((h) => h.id === hotelId);
    if (!hotel) return 0;

    // Update hotel points and rating locally
    setDonorHotels((prev) =>
      prev.map((h) => {
        if (h.id !== hotelId) return h;
        const newTotalRatings = h.totalRatings + 1;
        const newAvgRating = Math.round(((h.avgRating * h.totalRatings + avg) / newTotalRatings) * 10) / 10;
        return {
          ...h,
          totalPoints: h.totalPoints + points,
          totalRatings: newTotalRatings,
          avgRating: newAvgRating,
          lastDonation: "Just now",
        };
      })
    );

    // Add feedback entry locally
    const newFeedback: FeedbackEntry = {
      id: `fb-${Date.now()}`,
      hotelId,
      hotelName: hotel.name,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      foodQuality: ratings.foodQuality,
      packaging: ratings.packaging,
      timeliness: ratings.timeliness,
      quantity: ratings.quantity,
      overallRating: Math.round(avg * 10) / 10,
      comment,
      pointsAwarded: points,
    };
    setDonorFeedback((prev) => [newFeedback, ...prev]);

    // Persist feedback to MongoDB (this also updates hotel points in DB)
    apiCall("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelId,
        foodQuality: ratings.foodQuality,
        packaging: ratings.packaging,
        timeliness: ratings.timeliness,
        quantity: ratings.quantity,
        comment,
      }),
    });

    // Add notification
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: `+${points} Points Awarded to ${hotel.name}`,
      message: `NGO feedback submitted: ${avg.toFixed(1)}/5 avg rating. ${points} points added to donor leaderboard.`,
      time: "Just now",
      severity: "success",
      category: "Redistribution",
      read: false,
    };
    addNotification(newNotif);

    return points;
  }, [donorHotels, addNotification]);

  // Sorted by points (descending) for ranking
  const rankedHotels = useMemo(
    () => [...donorHotels].sort((a, b) => b.totalPoints - a.totalPoints),
    [donorHotels]
  );

  const getHotelRank = useCallback((hotelId: string): number => {
    const idx = rankedHotels.findIndex((h) => h.id === hotelId);
    return idx >= 0 ? idx + 1 : -1;
  }, [rankedHotels]);

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        notifications,
        unreadCount,
        isNotificationOpen,
        setIsNotificationOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isOnboardingOpen,
        setIsOnboardingOpen,
        surplusList,
        requestNgoPickup,
        isBatchPrioritized,
        prioritizeBatch,
        isTechnicianAssigned,
        assignTechnician,
        managerOverride,
        isOverrideActive,
        setIsOverrideActive: handleSetIsOverrideActive,
        saveManagerOverride,
        clearManagerOverride,
        acceptedPickups,
        acceptNgoPickup,
        isApiInspectorOpen,
        setIsApiInspectorOpen,
        donorHotels,
        donorFeedback,
        rankedHotels,
        submitDonorFeedback,
        getHotelRank,
        dbConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
