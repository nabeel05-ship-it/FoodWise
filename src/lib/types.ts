// TypeScript Interfaces for FoodWise

export type InstitutionRole = 
  | "KITCHEN_MANAGER" 
  | "FACTORY_MANAGER" 
  | "NGO_PARTNER" 
  | "LOGISTICS" 
  | "ADMIN"
  | "DONOR"
  | "NGO";

export type DonorType = "Restaurant" | "Hotel" | "Household" | "Restaurant / Hotel";

export type DonationStatus = 
  | "AVAILABLE" 
  | "REQUESTED" 
  | "ACCEPTED" 
  | "PICKUP" 
  | "PICKUP_IN_PROGRESS"
  | "COMPLETED" 
  | "CANCELLED"
  | "FLAGGED_FOR_REVIEW";

export type FoodQualityIssueType =
  | "Spoiled / rotten food"
  | "Unusual smell"
  | "Suspected contamination"
  | "Expired / unsafe date"
  | "Damaged packaging"
  | "Poor storage condition"
  | "Food quality does not match description"
  | "Other";

export type QualityReportSeverity = "LOW" | "MEDIUM" | "HIGH";

export type QualityReportStatus = "REPORTED" | "UNDER REVIEW" | "RESOLVED";

export interface FoodQualityReport {
  id: string;
  donationId: string;
  donorId: string;
  donorName: string;
  donorType: DonorType;
  foodName: string;
  quantity: string;
  quantityKg: number;
  ngoId: string;
  ngoName: string;
  issueType: FoodQualityIssueType;
  severity: QualityReportSeverity;
  description: string;
  photoUrl?: string;
  createdAt: string | number;
  dateStr: string;
  status: QualityReportStatus;
  statusNote?: string;
}

export interface LocationDetails {
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  source: string;
  verified: boolean;
}

export type DonationEventAction = 
  | "CREATED" 
  | "EDITED" 
  | "REQUESTED" 
  | "ACCEPTED" 
  | "SCHEDULED" 
  | "COLLECTED" 
  | "DELIVERED" 
  | "QUALITY_ISSUE_REPORTED" 
  | "CANCELLED" 
  | "EXPIRED";

export interface DonationTimelineEvent {
  id: string;
  action: DonationEventAction;
  timestamp: string;
  actor: string;
  details?: string;
}

export interface DonationItem {
  id: string;
  donorId: string;
  donorName: string;
  donorType: DonorType;
  foodName: string;
  foodCategory: string;
  diet: "Vegetarian" | "Non-Vegetarian" | "Vegan" | "Egg" | "Jain";
  quantity: string;
  quantityKg: number;
  servings: number;
  description: string;
  preparationTime: string;
  pickupDeadline: string;
  location: string;
  city: string;
  phone: string;
  contactPerson?: string;
  pickupInstructions?: string;
  storageCondition?: "Ambient" | "Refrigerated (< 4°C)" | "Frozen (< -18°C)" | "Hot Holding (> 60°C)";
  allergens?: string[];
  lat?: number;
  lng?: number;
  locationDetails?: LocationDetails;
  dataMode?: "DEMO" | "VERIFIED_REFERENCE";
  isRealBusinessReference?: boolean;
  foodCondition: string;
  status: DonationStatus;
  imageUrl?: string;
  createdAt: string | number;
  acceptedBy?: string;
  acceptedAt?: string;
  completedAt?: string;
  otp?: string;
  driverName?: string;
  driverPhone?: string;
  reason?: string;
  source?: string;
  serviceShift?: string;
  qualityReportId?: string;
  qualityFlag?: {
    issueType: string;
    severity: QualityReportSeverity;
    reportedAt: string;
  };
  timeline?: DonationTimelineEvent[];
  urgencyLevel?: "CRITICAL" | "URGENT" | "STANDARD" | "EXPIRED";
}

export interface Institution {
  id: string;
  name: string;
  type: "KITCHEN" | "FACTORY" | "NGO" | "RESTAURANT" | "HOTEL" | "HOUSEHOLD";
  location: string;
  fssaiNumber: string;
  badge: string;
}

export interface DemandPredictionItem {
  meal: "Breakfast" | "Lunch" | "Dinner";
  predicted: number;
  lastWeek: number;
  suggestion: string;
  actual?: number;
}

export interface SurplusItem {
  id: string;
  item: string;
  quantityKg: number;
  preparedAt: string;
  safeUntil: string;
  hoursRemaining: number;
  status: "SAFE" | "EXPIRING_SOON" | "URGENT" | "CANNOT_REDISTRIBUTE";
  prepRecorded: boolean;
  tempCelsius: number;
  coveredHygienic: boolean;
  eligible: boolean;
  matchedNgo?: string;
}

export interface NGOProfile {
  id: string;
  name: string;
  verified: boolean;
  distanceKm: number;
  capacityKg: number;
  etaMinutes: number;
  rating: number;
  location: string;
  phone: string;
}

export interface RouteStop {
  stopNumber: number;
  recipient: string;
  items: string;
  quantityKg: number;
  eta: string;
  status: "Confirmed" | "Pending" | "En Route" | "Completed";
  coordinates: { x: number; y: number };
}

export interface FactoryStorageUnit {
  id: string;
  name: string;
  crop: string;
  icon: string;
  stockKg: number;
  tempCelsius: number;
  targetTemp: string;
  humidityPct: number;
  targetHumidity: string;
  shelfLifeDays: number;
  status: "GOOD" | "ATTENTION_NEEDED" | "CRITICAL";
  isUrgent?: boolean;
}

export interface SpoilageBatch {
  id: string;
  batchCode: string;
  crop: string;
  quantityKg: number;
  storageUnit: string;
  ageDays: number;
  spoilageEstHours: number;
  confidencePct: number;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  factors: string[];
  recommendation: string;
  salvageableKg: number;
  degradationCurve: { hour: number; quality: number; threshold: number }[];
}

export interface MachineHealthRecord {
  id: string;
  machineId: string;
  name: string;
  status: "OPTIMAL" | "WARNING" | "CHECK_REQUIRED";
  efficiencyPct: number;
  normalRange: string;
  anomalyDetected: boolean;
  anomalyTitle?: string;
  currentValue?: string;
  expectedValue?: string;
  lossRatePerHour?: string;
  estimatedExtraWasteKgPerHour?: number;
  possibleCause?: string;
  note?: string;
  assignedTechnician?: string;
  trend: number[];
}

export interface NotificationAlert {
  id: string;
  title: string;
  titleParams?: Record<string, string | number>;
  message: string;
  messageParams?: Record<string, string | number>;
  time: string;
  createdAt?: number | string;
  severity: "urgent" | "warning" | "info" | "success";
  category: "Kitchen" | "Factory" | "Redistribution" | "IoT" | "Donation" | "Logistics";
  actionLabel?: string;
  actionUrl?: string;
  read: boolean;
}

export interface ScheduledPickup {
  id: string;
  itemId?: string;
  institution: string;
  food: string;
  destination: string;
  driver: string;
  phone: string;
  otp: string;
  eta: string;
  status: string;
  lat: number;
  lng: number;
  quantityKg?: number;
  timestamp?: number;
  locationDetails?: LocationDetails;
  dataMode?: "DEMO" | "VERIFIED_REFERENCE";
}

export interface PastPickupHistoryItem {
  id: string;
  date: string;
  institution: string;
  food: string;
  recipient: string;
  receipt: string;
  driver: string;
  status: string;
  completedAt?: string | number;
}
