/**
 * FoodWise In-Memory Data Service Layer
 * 
 * NOTE FOR FUTURE DATABASE INTEGRATION:
 * This service module acts as the isolated data layer for the FoodWise prototype.
 * Currently, it serves in-memory & mock data so the application runs completely
 * independently of any database cluster or credentials.
 * 
 * When ready to integrate a fresh MongoDB Atlas database:
 * Simply replace the internal storage arrays and functions here with your
 * MongoDB client queries (e.g. `db.collection('donations').find()`), without
 * needing to alter UI components or page layouts.
 */

import {
  DonationItem,
  DonationStatus,
  NotificationAlert,
} from "./types";
import {
  INITIAL_COMMUNITY_DONATIONS,
  COMMUNITY_DONORS,
  COMMUNITY_NGOS,
  INITIAL_NOTIFICATIONS,
  SURPLUS_ITEMS,
  INSTITUTIONS,
  DEMAND_VS_ACTUAL_14DAYS,
  WEEKLY_WASTE_BY_CATEGORY,
  TODAY_MEAL_PLAN,
  KITCHEN_ALERTS,
  PREDICTION_BREAKDOWN,
  MATCHED_NGOS,
  ROUTE_STOPS,
  FACTORY_STORAGE_UNITS,
  SPOILAGE_BATCHES,
  MACHINE_HEALTH,
  ESG_DATA,
  CommunityDonor,
  CommunityNgo,
} from "./mockData";

export interface ComplaintRecord {
  complaintId: string;
  date: string;
  establishment: string;
  location: string;
  category: string;
  severity: string;
  status: string;
  ticketRef: string;
  fssaiRef?: string;
  description: string;
  contactPhone?: string;
  hasImage?: boolean;
  adminAssigned: string;
  resolutionEta: string;
  createdAt: string | Date;
}

export interface FeedbackRecord {
  feedbackId: string;
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
  createdAt: string | Date;
}

// In-Memory Storage Singletons (Persists across hot reloads in memory)
let inMemoryDonations: DonationItem[] = [...INITIAL_COMMUNITY_DONATIONS];
const inMemoryDonors: CommunityDonor[] = [...COMMUNITY_DONORS];
const inMemoryNgos: CommunityNgo[] = [...COMMUNITY_NGOS];
let inMemoryNotifications: NotificationAlert[] = [...INITIAL_NOTIFICATIONS];
let inMemoryComplaints: ComplaintRecord[] = [
  {
    complaintId: "cmp-1",
    date: "Sep 23, 2026, 3:15 PM",
    establishment: "Bikanervala Central Kitchen",
    location: "Okhla Phase III",
    category: "Packaging & Leakage",
    severity: "Medium",
    status: "Under Review by Admin",
    ticketRef: "FW-SUPPORT-2026-88412",
    description: "Containers received were not sealed with thermal foil during afternoon dispatch.",
    contactPhone: "+91 98112 40291",
    adminAssigned: "FoodWise Incident Ops Desk",
    resolutionEta: "Within 30 mins",
    createdAt: new Date().toISOString(),
  },
];
let inMemoryFeedback: FeedbackRecord[] = [
  {
    feedbackId: "fb-1",
    hotelId: "donor-hot-1",
    hotelName: "Hotel Mayura Grand",
    date: "Sep 24, 2026",
    foodQuality: 5,
    packaging: 5,
    timeliness: 4,
    quantity: 5,
    overallRating: 4.8,
    comment: "Excellent quality food, well-packaged in insulated containers. Arrived fresh and warm.",
    pointsAwarded: 85,
    createdAt: new Date().toISOString(),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. DONATIONS CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function getDonations(): Promise<DonationItem[]> {
  return [...inMemoryDonations];
}

export async function getDonationById(id: string): Promise<DonationItem | null> {
  const item = inMemoryDonations.find((d) => d.id === id);
  return item ? { ...item } : null;
}

export async function createDonation(
  data: Omit<DonationItem, "id" | "status" | "createdAt">
): Promise<DonationItem> {
  const newDonation: DonationItem = {
    ...data,
    id: `don-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: "AVAILABLE",
    createdAt: Date.now(),
  };
  inMemoryDonations = [newDonation, ...inMemoryDonations];
  return newDonation;
}

export async function updateDonation(
  id: string,
  updates: Partial<DonationItem>
): Promise<DonationItem | null> {
  const index = inMemoryDonations.findIndex((d) => d.id === id);
  if (index === -1) return null;

  inMemoryDonations[index] = {
    ...inMemoryDonations[index],
    ...updates,
  };
  return inMemoryDonations[index];
}

export async function deleteDonation(id: string): Promise<boolean> {
  const before = inMemoryDonations.length;
  inMemoryDonations = inMemoryDonations.filter((d) => d.id !== id);
  return inMemoryDonations.length < before;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. DONORS & NGOS
// ─────────────────────────────────────────────────────────────────────────────

export async function getDonors(): Promise<CommunityDonor[]> {
  return [...inMemoryDonors];
}

export async function getNgos(): Promise<CommunityNgo[]> {
  return [...inMemoryNgos];
}

export async function updateDonor(
  id: string,
  updates: Partial<CommunityDonor>
): Promise<CommunityDonor | null> {
  const index = inMemoryDonors.findIndex((d) => d.id === id);
  if (index === -1) return null;
  inMemoryDonors[index] = { ...inMemoryDonors[index], ...updates };
  return inMemoryDonors[index];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function getNotifications(): Promise<NotificationAlert[]> {
  return [...inMemoryNotifications];
}

export async function createNotification(
  notif: Partial<NotificationAlert>
): Promise<NotificationAlert> {
  const newNotif: NotificationAlert = {
    id: notif.id || `notif-${crypto.randomUUID()}`,
    title: notif.title || "Notification",
    message: notif.message || "",
    time: notif.time || "Just now",
    severity: (notif.severity as "info" | "warning" | "urgent" | "success") || "info",
    category: (notif.category as "Kitchen" | "Factory" | "Redistribution" | "IoT") || "Redistribution",
    actionLabel: notif.actionLabel,
    actionUrl: notif.actionUrl,
    titleParams: notif.titleParams,
    messageParams: notif.messageParams,
    read: false,
    createdAt: Date.now(),
  };
  inMemoryNotifications = [newNotif, ...inMemoryNotifications];
  return newNotif;
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  const notif = inMemoryNotifications.find((n) => n.id === id);
  if (notif) {
    notif.read = true;
    return true;
  }
  return false;
}

export async function markAllNotificationsAsRead(): Promise<boolean> {
  inMemoryNotifications = inMemoryNotifications.map((n) => ({ ...n, read: true }));
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMPLAINTS & FEEDBACK
// ─────────────────────────────────────────────────────────────────────────────

export async function getComplaints(): Promise<ComplaintRecord[]> {
  return [...inMemoryComplaints];
}

export async function createComplaint(
  data: Partial<ComplaintRecord>
): Promise<ComplaintRecord> {
  const ticketRef = `FW-SUPPORT-2026-${Math.floor(80000 + Math.random() * 10000)}`;
  const complaint: ComplaintRecord = {
    complaintId: `cmp-${Date.now()}`,
    date: new Date().toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    establishment: data.establishment || "Food Donor",
    location: data.location || "Delhi NCR",
    category: data.category || "General Inquiry",
    severity: data.severity || "Medium",
    status: "Under Review by Admin",
    ticketRef,
    fssaiRef: ticketRef,
    description: data.description || "",
    contactPhone: data.contactPhone,
    hasImage: data.hasImage || false,
    adminAssigned: "FoodWise Incident Ops Desk",
    resolutionEta: "Within 30 mins",
    createdAt: new Date().toISOString(),
  };
  inMemoryComplaints = [complaint, ...inMemoryComplaints];
  return complaint;
}

export async function getFeedback(): Promise<FeedbackRecord[]> {
  return [...inMemoryFeedback];
}

export async function createFeedback(
  data: Partial<FeedbackRecord>
): Promise<{ feedback: FeedbackRecord; pointsAwarded: number }> {
  const avg =
    ((data.foodQuality || 5) +
      (data.packaging || 5) +
      (data.timeliness || 4) +
      (data.quantity || 5)) /
    4;

  let points = 10;
  if (avg >= 4.5) points = 85;
  else if (avg >= 4.0) points = 70;
  else if (avg >= 3.5) points = 55;
  else if (avg >= 3.0) points = 40;
  else if (avg >= 2.0) points = 25;

  const entry: FeedbackRecord = {
    feedbackId: `fb-${Date.now()}`,
    hotelId: data.hotelId || "donor-1",
    hotelName: data.hotelName || "Donor Kitchen",
    date: new Date().toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    foodQuality: data.foodQuality || 5,
    packaging: data.packaging || 5,
    timeliness: data.timeliness || 4,
    quantity: data.quantity || 5,
    overallRating: Math.round(avg * 10) / 10,
    comment: data.comment || "Good quality surplus received.",
    pointsAwarded: points,
    createdAt: new Date().toISOString(),
  };

  inMemoryFeedback = [entry, ...inMemoryFeedback];
  return { feedback: entry, pointsAwarded: points };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. COMPREHENSIVE INITIAL DATA DUMP (Used by /api/data)
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllData() {
  return {
    institutions: [
      {
        code: "IITD-MESS-01",
        name: "IIT Delhi Central Mess (Aravali)",
        type: "KITCHEN",
        city: "Hauz Khas, New Delhi",
        fssai: "FSSAI LIC: 10019011006542",
        diners: "2,400 Students & Staff",
        shift: "Afternoon Shift (Lunch Prep)",
        esgScore: 78.0,
      },
    ],
    demandHistory: DEMAND_VS_ACTUAL_14DAYS,
    wasteRecords: WEEKLY_WASTE_BY_CATEGORY,
    mealPlans: TODAY_MEAL_PLAN,
    kitchenAlerts: KITCHEN_ALERTS,
    predictions: PREDICTION_BREAKDOWN,
    surplusItems: SURPLUS_ITEMS,
    ngoProfiles: MATCHED_NGOS,
    routeStops: ROUTE_STOPS,
    factoryStorage: FACTORY_STORAGE_UNITS,
    spoilageBatches: SPOILAGE_BATCHES,
    machines: MACHINE_HEALTH,
    esgData: ESG_DATA,
    notifications: inMemoryNotifications,
    donorHotels: inMemoryDonors,
    donorFeedback: inMemoryFeedback,
    complaints: inMemoryComplaints,
    managerOverride: null,
  };
}
