// TypeScript Interfaces for FoodWise

export type InstitutionRole = 
  | "KITCHEN_MANAGER" 
  | "FACTORY_MANAGER" 
  | "NGO_PARTNER" 
  | "LOGISTICS" 
  | "ADMIN";

export interface Institution {
  id: string;
  name: string;
  type: "KITCHEN" | "FACTORY" | "NGO";
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
  message: string;
  time: string;
  createdAt?: number | string;
  severity: "urgent" | "warning" | "info" | "success";
  category: "Kitchen" | "Factory" | "Redistribution" | "IoT";
  actionLabel?: string;
  actionUrl?: string;
  read: boolean;
}
