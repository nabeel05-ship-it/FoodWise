import { DonationItem } from "./types";
import { CommunityNgo } from "./mockData";

export type UrgencyLevel = "CRITICAL" | "URGENT" | "STANDARD" | "EXPIRED";

export interface UrgencyInfo {
  urgency: UrgencyLevel;
  hoursRemaining: number;
  minutesRemaining: number;
  timeLabel: string;
  badgeLabel: string;
  isExpired: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface SmartMatchResult {
  matchScore: number; // 0 - 100
  matchLevel: "EXCELLENT" | "HIGH" | "GOOD" | "MODERATE";
  reasons: string[];
  urgency: UrgencyInfo;
  requiresSpecialTransport?: string;
}

/**
 * Calculates time remaining and urgency tier from a pickup deadline string or timestamp
 */
export function calculateUrgency(pickupDeadline: string | number | Date): UrgencyInfo {
  const now = new Date();
  let deadlineDate: Date;

  if (typeof pickupDeadline === "number") {
    deadlineDate = new Date(pickupDeadline);
  } else if (pickupDeadline instanceof Date) {
    deadlineDate = pickupDeadline;
  } else {
    // Try standard parsing
    const parsed = Date.parse(pickupDeadline);
    if (!isNaN(parsed)) {
      deadlineDate = new Date(parsed);
    } else {
      // Heuristic parsing for formats like "Today, 8:00 PM", "Tonight, 11:30 PM", "Tomorrow, 10:00 AM"
      const lower = pickupDeadline.toLowerCase();
      const timeMatch = lower.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const isPM = timeMatch[3].toLowerCase() === "pm";
        if (isPM && hours < 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;

        deadlineDate = new Date(now);
        if (lower.includes("tomorrow")) {
          deadlineDate.setDate(deadlineDate.getDate() + 1);
        }
        deadlineDate.setHours(hours, minutes, 0, 0);

        // If time today has passed and no day specified, assume it was today earlier or default buffer
        if (!lower.includes("tomorrow") && !lower.includes("yesterday") && deadlineDate < now) {
          // If less than 6 hours in the past, treat as expired; otherwise assume same day evening
        }
      } else {
        // Fallback default: assume 4 hours from creation or now
        deadlineDate = new Date(now.getTime() + 4 * 60 * 60 * 1000);
      }
    }
  }

  const diffMs = deadlineDate.getTime() - now.getTime();
  const totalMinutes = Math.round(diffMs / (60 * 1000));
  const totalHours = diffMs / (60 * 60 * 1000);

  if (totalMinutes <= 0) {
    return {
      urgency: "EXPIRED",
      hoursRemaining: 0,
      minutesRemaining: 0,
      timeLabel: "Safe window expired",
      badgeLabel: "Expired",
      isExpired: true,
      color: "#6B7280",
      bgColor: "#F3F4F6",
      borderColor: "#E5E7EB",
    };
  }

  if (totalHours < 2) {
    return {
      urgency: "CRITICAL",
      hoursRemaining: Math.max(0, Math.floor(totalHours)),
      minutesRemaining: totalMinutes,
      timeLabel: `${totalMinutes} mins remaining`,
      badgeLabel: "Critical Deadline",
      isExpired: false,
      color: "#DC2626",
      bgColor: "#FEF2F2",
      borderColor: "#FECACA",
    };
  }

  if (totalHours <= 5) {
    const hrs = Math.floor(totalHours);
    const mins = totalMinutes % 60;
    return {
      urgency: "URGENT",
      hoursRemaining: Math.round(totalHours * 10) / 10,
      minutesRemaining: totalMinutes,
      timeLabel: hrs > 0 ? `${hrs}h ${mins}m left` : `${mins} mins left`,
      badgeLabel: "Urgent Collection",
      isExpired: false,
      color: "#D97706",
      bgColor: "#FFFBEB",
      borderColor: "#FDE68A",
    };
  }

  const hrs = Math.floor(totalHours);
  return {
    urgency: "STANDARD",
    hoursRemaining: Math.round(totalHours * 10) / 10,
    minutesRemaining: totalMinutes,
    timeLabel: `${hrs} hrs safe buffer`,
    badgeLabel: "Safe Buffer",
    isExpired: false,
    color: "#059669",
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  };
}

/**
 * Checks whether a donation deadline has already elapsed
 */
export function isDonationExpired(pickupDeadline?: string | number | Date): boolean {
  if (!pickupDeadline) return false;
  const urgency = calculateUrgency(pickupDeadline);
  return urgency.isExpired;
}

/**
 * FEATURE A: SMART DONATION MATCHING
 * Transparent, deterministic matching algorithm between a surplus donation and an NGO.
 */
export function calculateSmartDonationMatch(
  donation: DonationItem,
  ngo?: CommunityNgo | null
): SmartMatchResult {
  const urgency = calculateUrgency(donation.pickupDeadline);
  let score = 75; // baseline valid donation
  const reasons: string[] = [];

  // 1. Urgency & Time Window Factor
  if (urgency.isExpired) {
    return {
      matchScore: 0,
      matchLevel: "MODERATE",
      reasons: ["Safe consumption window has expired. Not eligible for redistribution."],
      urgency,
    };
  } else if (urgency.urgency === "CRITICAL") {
    score += 15;
    reasons.push(`High Priority: Safe window under 2 hours (${urgency.timeLabel}) — requires immediate vehicle dispatch.`);
  } else if (urgency.urgency === "URGENT") {
    score += 10;
    reasons.push(`Actionable: Pickup window is active with ${urgency.timeLabel} remaining.`);
  } else {
    reasons.push(`Comfortable logistics buffer with ${urgency.timeLabel} remaining.`);
  }

  // 2. Quantity & NGO Distribution Capacity
  const qty = donation.quantityKg || 10;
  if (qty >= 10 && qty <= 100) {
    score += 10;
    reasons.push(`Optimal Batch Size: ${qty} kg fits standard NGO 3-wheeler or tempo van without cargo split.`);
  } else if (qty > 100) {
    score += 5;
    reasons.push(`Bulk Surplus (${qty} kg): Requires multi-trip coordination or heavy relief van.`);
  } else {
    reasons.push(`Compact Batch (${qty} kg): Suitable for single two-wheeler or local neighborhood delivery.`);
  }

  // 3. Category & Dietary Alignment
  const category = donation.foodCategory?.toLowerCase() || "";
  if (category.includes("cooked") || category.includes("buffet") || category.includes("meal")) {
    score += 5;
    reasons.push(`Immediate Relief: Prepared hot/cooked meals can be served directly at community shelters.`);
  } else if (category.includes("bakery") || category.includes("dry") || category.includes("grocer")) {
    score += 5;
    reasons.push(`Stable Shelf-Life: Packaged or bakery goods have predictable distribution flexibility.`);
  }

  if (donation.diet === "Vegetarian" || donation.diet === "Vegan" || donation.diet === "Jain") {
    score += 5;
    reasons.push(`Broad Acceptance: ${donation.diet} food meets the dietary requirements of all partner shelters.`);
  }

  // 4. Storage & Temperature Requirements
  let specialTransport: string | undefined;
  if (donation.storageCondition?.includes("Hot") || donation.foodCondition?.toLowerCase().includes("hot")) {
    specialTransport = "Insulated hot thermal box required";
    reasons.push("Hot Holding: Retains food temperature >60°C. Transport in thermal Cambro containers.");
  } else if (donation.storageCondition?.includes("Refrigerat") || donation.foodCondition?.toLowerCase().includes("cold")) {
    specialTransport = "Cold-chain or insulated chill box required";
    reasons.push("Cold-Chain: Maintain <4°C during transport to prevent microbial growth.");
  }

  // 5. Donor Verification & NGO Coverage Alignment
  if (donation.donorType === "Hotel" || donation.donorType === "Restaurant") {
    reasons.push("Commercial Kitchen: Produced under commercial kitchen hygiene protocols.");
  }

  if (ngo) {
    if (ngo.coverageArea && donation.location && ngo.coverageArea.toLowerCase().split(",").some((area) => donation.location.toLowerCase().includes(area.trim().toLowerCase()))) {
      score += 5;
      reasons.push(`Geographic Sector Match: Within ${ngo.name}'s active collection area.`);
    }
  }

  // Clamp score between 60 and 99
  const finalScore = Math.min(99, Math.max(50, score));

  let matchLevel: "EXCELLENT" | "HIGH" | "GOOD" | "MODERATE" = "GOOD";
  if (finalScore >= 90) matchLevel = "EXCELLENT";
  else if (finalScore >= 80) matchLevel = "HIGH";
  else if (finalScore >= 65) matchLevel = "GOOD";
  else matchLevel = "MODERATE";

  return {
    matchScore: finalScore,
    matchLevel,
    reasons,
    urgency,
    requiresSpecialTransport: specialTransport,
  };
}
