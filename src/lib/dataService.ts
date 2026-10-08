/**
 * FoodWise MongoDB Persistence Data Layer
 * 
 * Replaces the prototype in-memory state with a production-ready
 * MongoDB persistence layer, with automatic initial collection bootstrapping,
 * server-side only data access, and connection caching.
 */

import { getDatabase, isMongoConfigured } from "./mongodb";
import {
  DonationItem,
  DonationStatus,
  NotificationAlert,
  FoodQualityReport,
  ScheduledPickup,
  PastPickupHistoryItem,
} from "./types";
import {
  INITIAL_COMMUNITY_DONATIONS,
  COMMUNITY_DONORS,
  COMMUNITY_NGOS,
  INITIAL_NOTIFICATIONS,
  INITIAL_QUALITY_REPORTS,
  DEFAULT_SCHEDULED_PICKUPS,
  INITIAL_PAST_HISTORY,
  SURPLUS_ITEMS,
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

// Default initial complaints & feedback
const INITIAL_COMPLAINTS: ComplaintRecord[] = [
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
    createdAt: new Date("2026-09-23T09:45:00Z").toISOString(),
  },
];

const INITIAL_FEEDBACK: FeedbackRecord[] = [
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
    createdAt: new Date("2026-09-24T10:30:00Z").toISOString(),
  },
];

// Fallback in-memory copies for local development if MONGODB_URI is not yet provided
let memDonations: DonationItem[] = [...INITIAL_COMMUNITY_DONATIONS];
const memDonors: CommunityDonor[] = [...COMMUNITY_DONORS];
const memNgos: CommunityNgo[] = [...COMMUNITY_NGOS];
let memNotifications: NotificationAlert[] = [...INITIAL_NOTIFICATIONS];
let memComplaints: ComplaintRecord[] = [...INITIAL_COMPLAINTS];
let memFeedback: FeedbackRecord[] = [...INITIAL_FEEDBACK];
let memPickups: ScheduledPickup[] = [...DEFAULT_SCHEDULED_PICKUPS];
let memPickupHistory: PastPickupHistoryItem[] = [...INITIAL_PAST_HISTORY];
let memQualityReports: FoodQualityReport[] = [...INITIAL_QUALITY_REPORTS];

// Helper to remove MongoDB internal _id from results
function cleanDoc<T>(doc: unknown): T {
  if (!doc || typeof doc !== "object") return doc as T;
  const copy = { ...(doc as Record<string, unknown>) };
  delete copy._id;
  return copy as T;
}

// Track collections seeded during process lifetime
const seededCollections = new Set<string>();

/**
 * Ensures initial seed data exists in a MongoDB collection if empty
 */
async function ensureSeeded<T extends object>(
  collectionName: string,
  initialData: T[]
): Promise<void> {
  if (seededCollections.has(collectionName)) return;
  try {
    const db = await getDatabase();
    const col = db.collection(collectionName);
    const count = await col.countDocuments({}, { limit: 1 });
    if (count === 0 && initialData.length > 0) {
      await col.insertMany(initialData.map((d) => ({ ...(d as Record<string, unknown>) })));
    }
    seededCollections.add(collectionName);
  } catch (err) {
    console.error(`[MongoDB] Failed to check/seed ${collectionName}:`, (err as Error).message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. DONATIONS CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function getDonations(): Promise<DonationItem[]> {
  if (!isMongoConfigured()) {
    return [...memDonations];
  }
  try {
    await ensureSeeded("donations", INITIAL_COMMUNITY_DONATIONS);
    const db = await getDatabase();
    const docs = await db
      .collection("donations")
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map((d) => cleanDoc<DonationItem>(d));
  } catch (error) {
    console.error("[MongoDB] getDonations error:", (error as Error).message);
    return [...memDonations];
  }
}

export async function getDonationById(id: string): Promise<DonationItem | null> {
  if (!isMongoConfigured()) {
    const item = memDonations.find((d) => d.id === id);
    return item ? { ...item } : null;
  }
  try {
    const db = await getDatabase();
    const doc = await db
      .collection("donations")
      .findOne({ id }, { projection: { _id: 0 } });
    return doc ? cleanDoc<DonationItem>(doc) : null;
  } catch (error) {
    console.error("[MongoDB] getDonationById error:", (error as Error).message);
    const item = memDonations.find((d) => d.id === id);
    return item ? { ...item } : null;
  }
}

export async function createDonation(
  data: Partial<DonationItem>
): Promise<DonationItem> {
  const newDonation: DonationItem = {
    donorId: data.donorId || "donor-res-1",
    donorName: data.donorName || "Kitchen Partner",
    donorType: data.donorType || "Restaurant",
    foodName: data.foodName || "Surplus Food",
    foodCategory: data.foodCategory || "Cooked Meals",
    diet: data.diet || "Vegetarian",
    quantity: data.quantity || `${data.quantityKg || 10} kg`,
    quantityKg: Number(data.quantityKg) || 10,
    servings: Number(data.servings) || 30,
    description: data.description || "Prepared surplus meals.",
    preparationTime: data.preparationTime || "Today",
    pickupDeadline: data.pickupDeadline || "Today, 8:00 PM",
    location: data.location || "Connaught Place, New Delhi",
    city: data.city || "New Delhi",
    phone: data.phone || "+91 98101 23456",
    foodCondition: data.foodCondition || "Freshly Cooked",
    id: data.id || `don-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: (data.status as DonationStatus) || "AVAILABLE",
    imageUrl: data.imageUrl,
    createdAt: data.createdAt || Date.now(),
    acceptedBy: data.acceptedBy,
    acceptedAt: data.acceptedAt,
    completedAt: data.completedAt,
    otp: data.otp,
    driverName: data.driverName,
    driverPhone: data.driverPhone,
    reason: data.reason,
    source: data.source,
    serviceShift: data.serviceShift,
  };

  if (!isMongoConfigured()) {
    memDonations = [newDonation, ...memDonations];
    return newDonation;
  }

  try {
    const db = await getDatabase();
    await db.collection("donations").insertOne({ ...newDonation });
    return newDonation;
  } catch (error) {
    console.error("[MongoDB] createDonation error:", (error as Error).message);
    memDonations = [newDonation, ...memDonations];
    return newDonation;
  }
}

export async function updateDonation(
  id: string,
  updates: Partial<DonationItem>
): Promise<DonationItem | null> {
  if (!isMongoConfigured()) {
    const index = memDonations.findIndex((d) => d.id === id);
    if (index === -1) return null;
    memDonations[index] = { ...memDonations[index], ...updates };
    return memDonations[index];
  }

  try {
    const db = await getDatabase();
    const cleanUpdates = { ...updates };
    delete (cleanUpdates as Record<string, unknown>)._id;

    await db.collection("donations").updateOne({ id }, { $set: cleanUpdates });
    const updated = await db
      .collection("donations")
      .findOne({ id }, { projection: { _id: 0 } });
    return updated ? cleanDoc<DonationItem>(updated) : null;
  } catch (error) {
    console.error("[MongoDB] updateDonation error:", (error as Error).message);
    const index = memDonations.findIndex((d) => d.id === id);
    if (index === -1) return null;
    memDonations[index] = { ...memDonations[index], ...updates };
    return memDonations[index];
  }
}

export async function deleteDonation(id: string): Promise<boolean> {
  if (!isMongoConfigured()) {
    const before = memDonations.length;
    memDonations = memDonations.filter((d) => d.id !== id);
    return memDonations.length < before;
  }

  try {
    const db = await getDatabase();
    const res = await db.collection("donations").deleteOne({ id });
    return res.deletedCount > 0;
  } catch (error) {
    console.error("[MongoDB] deleteDonation error:", (error as Error).message);
    const before = memDonations.length;
    memDonations = memDonations.filter((d) => d.id !== id);
    return memDonations.length < before;
  }
}

export async function claimDonation(
  donationId: string,
  claimDetails: {
    ngoName: string;
    driverName?: string;
    driverPhone?: string;
    otp?: string;
  }
): Promise<DonationItem | null> {
  const nowTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return updateDonation(donationId, {
    status: "ACCEPTED",
    acceptedBy: claimDetails.ngoName,
    acceptedAt: `Today, ${nowTime}`,
    driverName: claimDetails.driverName || "Ramesh Kumar (Volunteer)",
    driverPhone: claimDetails.driverPhone || "+91 98112 34567",
    otp: claimDetails.otp || Math.floor(1000 + Math.random() * 9000).toString(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SCHEDULED PICKUPS & HISTORY (Claims logistics persistence)
// ─────────────────────────────────────────────────────────────────────────────

export async function getScheduledPickups(): Promise<ScheduledPickup[]> {
  if (!isMongoConfigured()) {
    return [...memPickups];
  }
  try {
    await ensureSeeded("pickups", DEFAULT_SCHEDULED_PICKUPS);
    const db = await getDatabase();
    const docs = await db
      .collection("pickups")
      .find({}, { projection: { _id: 0 } })
      .sort({ timestamp: -1 })
      .toArray();
    return docs.map((d) => cleanDoc<ScheduledPickup>(d));
  } catch (error) {
    console.error("[MongoDB] getScheduledPickups error:", (error as Error).message);
    return [...memPickups];
  }
}

export async function schedulePickup(pickup: ScheduledPickup): Promise<ScheduledPickup> {
  const item: ScheduledPickup = {
    ...pickup,
    id: pickup.id || `sched-${Date.now()}`,
    timestamp: pickup.timestamp || Date.now(),
  };

  if (!isMongoConfigured()) {
    memPickups = [item, ...memPickups];
    return item;
  }

  try {
    const db = await getDatabase();
    await db.collection("pickups").insertOne({ ...item });
    return item;
  } catch (error) {
    console.error("[MongoDB] schedulePickup error:", (error as Error).message);
    memPickups = [item, ...memPickups];
    return item;
  }
}

export async function updateScheduledPickup(
  id: string,
  updates: Partial<ScheduledPickup>
): Promise<ScheduledPickup | null> {
  if (!isMongoConfigured()) {
    const idx = memPickups.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    memPickups[idx] = { ...memPickups[idx], ...updates };
    return memPickups[idx];
  }

  try {
    const db = await getDatabase();
    const cleanUpdates = { ...updates };
    delete (cleanUpdates as Record<string, unknown>)._id;
    await db.collection("pickups").updateOne({ id }, { $set: cleanUpdates });
    const updated = await db
      .collection("pickups")
      .findOne({ id }, { projection: { _id: 0 } });
    return updated ? cleanDoc<ScheduledPickup>(updated) : null;
  } catch (error) {
    console.error("[MongoDB] updateScheduledPickup error:", (error as Error).message);
    const idx = memPickups.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    memPickups[idx] = { ...memPickups[idx], ...updates };
    return memPickups[idx];
  }
}

export async function deleteScheduledPickup(id: string): Promise<boolean> {
  if (!isMongoConfigured()) {
    const before = memPickups.length;
    memPickups = memPickups.filter((p) => p.id !== id);
    return memPickups.length < before;
  }

  try {
    const db = await getDatabase();
    const res = await db.collection("pickups").deleteOne({ id });
    return res.deletedCount > 0;
  } catch (error) {
    console.error("[MongoDB] deleteScheduledPickup error:", (error as Error).message);
    const before = memPickups.length;
    memPickups = memPickups.filter((p) => p.id !== id);
    return memPickups.length < before;
  }
}

export async function getPickupHistory(): Promise<PastPickupHistoryItem[]> {
  if (!isMongoConfigured()) {
    return [...memPickupHistory];
  }
  try {
    await ensureSeeded("pickup_history", INITIAL_PAST_HISTORY);
    const db = await getDatabase();
    const docs = await db
      .collection("pickup_history")
      .find({}, { projection: { _id: 0 } })
      .toArray();
    return docs.map((d) => cleanDoc<PastPickupHistoryItem>(d));
  } catch (error) {
    console.error("[MongoDB] getPickupHistory error:", (error as Error).message);
    return [...memPickupHistory];
  }
}

export async function createPickupHistory(
  item: PastPickupHistoryItem
): Promise<PastPickupHistoryItem> {
  const newHist: PastPickupHistoryItem = {
    ...item,
    id: item.id || `hist-${Date.now()}`,
    completedAt: item.completedAt || Date.now(),
  };

  if (!isMongoConfigured()) {
    memPickupHistory = [newHist, ...memPickupHistory];
    return newHist;
  }

  try {
    const db = await getDatabase();
    await db.collection("pickup_history").insertOne({ ...newHist });
    return newHist;
  } catch (error) {
    console.error("[MongoDB] createPickupHistory error:", (error as Error).message);
    memPickupHistory = [newHist, ...memPickupHistory];
    return newHist;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. QUALITY REPORTS
// ─────────────────────────────────────────────────────────────────────────────

export async function getQualityReports(): Promise<FoodQualityReport[]> {
  if (!isMongoConfigured()) {
    return [...memQualityReports];
  }
  try {
    await ensureSeeded("quality_reports", INITIAL_QUALITY_REPORTS);
    const db = await getDatabase();
    const docs = await db
      .collection("quality_reports")
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map((d) => cleanDoc<FoodQualityReport>(d));
  } catch (error) {
    console.error("[MongoDB] getQualityReports error:", (error as Error).message);
    return [...memQualityReports];
  }
}

export async function createQualityReport(
  report: FoodQualityReport
): Promise<FoodQualityReport> {
  if (!isMongoConfigured()) {
    memQualityReports = [report, ...memQualityReports];
    return report;
  }
  try {
    const db = await getDatabase();
    await db.collection("quality_reports").insertOne({ ...report });
    return report;
  } catch (error) {
    console.error("[MongoDB] createQualityReport error:", (error as Error).message);
    memQualityReports = [report, ...memQualityReports];
    return report;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DONORS & NGOS
// ─────────────────────────────────────────────────────────────────────────────

export async function getDonors(): Promise<CommunityDonor[]> {
  if (!isMongoConfigured()) {
    return [...memDonors];
  }
  try {
    await ensureSeeded("donors", COMMUNITY_DONORS);
    const db = await getDatabase();
    const docs = await db
      .collection("donors")
      .find({}, { projection: { _id: 0 } })
      .toArray();
    return docs.map((d) => cleanDoc<CommunityDonor>(d));
  } catch (error) {
    console.error("[MongoDB] getDonors error:", (error as Error).message);
    return [...memDonors];
  }
}

export async function getNgos(): Promise<CommunityNgo[]> {
  if (!isMongoConfigured()) {
    return [...memNgos];
  }
  try {
    await ensureSeeded("ngos", COMMUNITY_NGOS);
    const db = await getDatabase();
    const docs = await db
      .collection("ngos")
      .find({}, { projection: { _id: 0 } })
      .toArray();
    return docs.map((d) => cleanDoc<CommunityNgo>(d));
  } catch (error) {
    console.error("[MongoDB] getNgos error:", (error as Error).message);
    return [...memNgos];
  }
}

export async function updateDonor(
  id: string,
  updates: Partial<CommunityDonor>
): Promise<CommunityDonor | null> {
  if (!isMongoConfigured()) {
    const index = memDonors.findIndex((d) => d.id === id);
    if (index === -1) return null;
    memDonors[index] = { ...memDonors[index], ...updates };
    return memDonors[index];
  }

  try {
    const db = await getDatabase();
    const cleanUpdates = { ...updates };
    delete (cleanUpdates as Record<string, unknown>)._id;
    await db.collection("donors").updateOne({ id }, { $set: cleanUpdates });
    const updated = await db
      .collection("donors")
      .findOne({ id }, { projection: { _id: 0 } });
    return updated ? cleanDoc<CommunityDonor>(updated) : null;
  } catch (error) {
    console.error("[MongoDB] updateDonor error:", (error as Error).message);
    const index = memDonors.findIndex((d) => d.id === id);
    if (index === -1) return null;
    memDonors[index] = { ...memDonors[index], ...updates };
    return memDonors[index];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function getNotifications(): Promise<NotificationAlert[]> {
  if (!isMongoConfigured()) {
    return [...memNotifications];
  }
  try {
    await ensureSeeded("notifications", INITIAL_NOTIFICATIONS);
    const db = await getDatabase();
    const docs = await db
      .collection("notifications")
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map((d) => cleanDoc<NotificationAlert>(d));
  } catch (error) {
    console.error("[MongoDB] getNotifications error:", (error as Error).message);
    return [...memNotifications];
  }
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
    category:
      (notif.category as
        | "Kitchen"
        | "Factory"
        | "Redistribution"
        | "IoT"
        | "Donation"
        | "Logistics") || "Redistribution",
    actionLabel: notif.actionLabel,
    actionUrl: notif.actionUrl,
    titleParams: notif.titleParams,
    messageParams: notif.messageParams,
    read: false,
    createdAt: notif.createdAt || Date.now(),
  };

  if (!isMongoConfigured()) {
    memNotifications = [newNotif, ...memNotifications];
    return newNotif;
  }

  try {
    const db = await getDatabase();
    await db.collection("notifications").insertOne({ ...newNotif });
    return newNotif;
  } catch (error) {
    console.error("[MongoDB] createNotification error:", (error as Error).message);
    memNotifications = [newNotif, ...memNotifications];
    return newNotif;
  }
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  if (!isMongoConfigured()) {
    const notif = memNotifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  try {
    const db = await getDatabase();
    const res = await db
      .collection("notifications")
      .updateOne({ id }, { $set: { read: true } });
    return res.modifiedCount > 0;
  } catch (error) {
    console.error("[MongoDB] markNotificationAsRead error:", (error as Error).message);
    const notif = memNotifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }
}

export async function markAllNotificationsAsRead(): Promise<boolean> {
  if (!isMongoConfigured()) {
    memNotifications = memNotifications.map((n) => ({ ...n, read: true }));
    return true;
  }

  try {
    const db = await getDatabase();
    await db.collection("notifications").updateMany({}, { $set: { read: true } });
    return true;
  } catch (error) {
    console.error("[MongoDB] markAllNotificationsAsRead error:", (error as Error).message);
    memNotifications = memNotifications.map((n) => ({ ...n, read: true }));
    return true;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. COMPLAINTS & FEEDBACK
// ─────────────────────────────────────────────────────────────────────────────

export async function getComplaints(): Promise<ComplaintRecord[]> {
  if (!isMongoConfigured()) {
    return [...memComplaints];
  }
  try {
    await ensureSeeded("complaints", INITIAL_COMPLAINTS);
    const db = await getDatabase();
    const docs = await db
      .collection("complaints")
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map((d) => cleanDoc<ComplaintRecord>(d));
  } catch (error) {
    console.error("[MongoDB] getComplaints error:", (error as Error).message);
    return [...memComplaints];
  }
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

  if (!isMongoConfigured()) {
    memComplaints = [complaint, ...memComplaints];
    return complaint;
  }

  try {
    const db = await getDatabase();
    await db.collection("complaints").insertOne({ ...complaint });
    return complaint;
  } catch (error) {
    console.error("[MongoDB] createComplaint error:", (error as Error).message);
    memComplaints = [complaint, ...memComplaints];
    return complaint;
  }
}

export async function getFeedback(): Promise<FeedbackRecord[]> {
  if (!isMongoConfigured()) {
    return [...memFeedback];
  }
  try {
    await ensureSeeded("feedback", INITIAL_FEEDBACK);
    const db = await getDatabase();
    const docs = await db
      .collection("feedback")
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map((d) => cleanDoc<FeedbackRecord>(d));
  } catch (error) {
    console.error("[MongoDB] getFeedback error:", (error as Error).message);
    return [...memFeedback];
  }
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

  if (!isMongoConfigured()) {
    memFeedback = [entry, ...memFeedback];
    return { feedback: entry, pointsAwarded: points };
  }

  try {
    const db = await getDatabase();
    await db.collection("feedback").insertOne({ ...entry });
    return { feedback: entry, pointsAwarded: points };
  } catch (error) {
    console.error("[MongoDB] createFeedback error:", (error as Error).message);
    memFeedback = [entry, ...memFeedback];
    return { feedback: entry, pointsAwarded: points };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. COMPREHENSIVE AGGREGATED DATA (Used by /api/data)
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllData() {
  const [
    donations,
    notifications,
    donorHotels,
    donorFeedback,
    complaints,
    scheduledPickups,
    pickupHistory,
    qualityReports,
  ] = await Promise.all([
    getDonations(),
    getNotifications(),
    getDonors(),
    getFeedback(),
    getComplaints(),
    getScheduledPickups(),
    getPickupHistory(),
    getQualityReports(),
  ]);

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
    // Dynamic collections persisted in MongoDB:
    donations,
    notifications,
    donorHotels,
    donorFeedback,
    complaints,
    scheduledPickups,
    pickupHistory,
    qualityReports,
    managerOverride: null,
  };
}
