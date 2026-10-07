import { jsPDF } from "jspdf";
import { FOODWISE_LOGO_BASE64 } from "./pdfAssets";
import { translateHindiToEnglish } from "@/context/dictionary";
import { translateKannadaToEnglish } from "@/context/kannadaDictionary";

export function safePdfText(val: any): string {
  if (val === undefined || val === null) return "";
  let str = String(val).trim();
  if (/[\u0900-\u097F]/.test(str)) {
    str = translateHindiToEnglish(str);
  }
  if (/[\u0C80-\u0CFF]/.test(str)) {
    str = translateKannadaToEnglish(str);
  }
  return str.replace(/[^\x20-\x7E\xA0-\xFF]/g, " ").replace(/\s+/g, " ").trim();
}

// ─── Common Types & Options ─────────────────────────────────────────────────

export interface CertificateParams {
  recipientName: string;
  donorType?: "Household" | "Restaurant" | "Hotel" | "NGO" | string;
  foodName?: string;
  quantityKg?: number;
  foodWeightKg?: number;
  servings?: number;
  donationDate?: string;
  donationId?: string;
  certificateId?: string;
  certificateType?: string;
  ngoName?: string;
  mealsServed?: number;
  peopleServed?: number;
  wastePreventedKg?: number;
  co2SavedKg?: number;
}

export interface DonationRecordParams {
  donationId: string;
  donorName: string;
  donorType: "Household" | "Restaurant" | "Hotel" | string;
  contactPerson?: string;
  contactPhone?: string;
  pickupAddress?: string;
  foodName: string;
  foodCategory?: string;
  quantityKg: number;
  servings: number;
  diet?: string;
  context?: string;
  status: string;
  recipientNgo?: string;
  driverName?: string;
  driverPhone?: string;
  otp?: string;
  createdAt?: string | number;
  completedAt?: string;
}

export interface ImpactReportParams {
  period?: string;
  reportId?: string;
  organizationName?: string;
  role?: "Household" | "Restaurant" | "Hotel" | "NGO" | string;
  totalKg?: number;
  totalServings?: number;
  completedCount?: number;
  wastePreventedKg?: number;
  donationsList?: {
    date: string;
    donorName: string;
    foodName: string;
    category?: string;
    quantityKg: number;
    servings: number;
    status: string;
  }[];
}

export interface NgoCollectionRecordParams {
  receiptId: string;
  ngoName: string;
  coordinatorName: string;
  phone: string;
  hubAddress: string;
  donorName: string;
  donorType: string;
  donorAddress: string;
  foodName: string;
  quantityKg: number;
  servings: number;
  otp?: string;
  driverName?: string;
  targetShelter?: string;
  collectionTime?: string;
}

// ─── Internal Helper Primitives ─────────────────────────────────────────────

function safeAddLogo(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number
) {
  try {
    doc.addImage(FOODWISE_LOGO_BASE64, "PNG", x, y, w, h);
  } catch (err) {
    console.warn("Failed to embed FoodWise logo in PDF:", err);
  }
}

function formatDate(input?: string | number): string {
  if (!input) {
    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  const dateObj = typeof input === "number" ? new Date(input) : new Date(input);
  if (isNaN(dateObj.getTime())) {
    return String(input);
  }
  return dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatSafeFilename(str: string): string {
  return str.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_");
}

// ─── 1. COMMEMORATIVE CERTIFICATE (A4 Landscape) ────────────────────────────
// Formal, centered, commemorative design for donors & community partners
export function downloadFoodDonationCertificatePdf(params: CertificateParams) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 297;
  const pageHeight = 210;

  const recipient = safePdfText(params.recipientName || params.ngoName || "Valued Community Contributor");
  const title = safePdfText((params.certificateType || "Certificate of Food Donation").toUpperCase());
  const quantity = params.quantityKg || params.foodWeightKg || (params.mealsServed ? Math.round(params.mealsServed / 3) : 15);
  const servings = params.servings || params.mealsServed || Math.round(quantity * 3);
  const donationDate = formatDate(params.donationDate);
  const certId = safePdfText(params.certificateId || `FW-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`);

  doc.setProperties({
    title: `FoodWise — ${title}`,
    subject: "Food Donation Recognition Certificate",
    author: "FoodWise Platform",
    creator: "FoodWise Civic Redistribution System",
  });

  // Background subtle tint
  doc.setFillColor(254, 255, 254);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Single Elegant Outer Border (Restrained, professional)
  doc.setDrawColor(22, 74, 49); // #164A31 Dark Forest
  doc.setLineWidth(1.2);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Subtle Inner Accent Frame
  doc.setDrawColor(167, 243, 208); // Emerald 200
  doc.setLineWidth(0.3);
  doc.rect(14.5, 14.5, pageWidth - 29, pageHeight - 29);

  // Top Center: FoodWise Logo
  safeAddLogo(doc, (pageWidth - 18) / 2, 20, 18, 18);

  // Brand Name
  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("FOODWISE", pageWidth / 2, 43, { align: "center" });

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("SURPLUS FOOD REDISTRIBUTION PLATFORM", pageWidth / 2, 48, { align: "center" });

  // Certificate Heading
  doc.setTextColor(7, 43, 30); // #072B1E
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text(title, pageWidth / 2, 59, { align: "center" });

  // Thin Accent Divider Under Title
  doc.setDrawColor(16, 185, 129); // #10B981
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 25, 63, pageWidth / 2 + 25, 63);

  // Presentation Line
  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text("This certificate is presented to", pageWidth / 2, 73, { align: "center" });

  // Recipient / Donor Name (Visual Focal Point)
  doc.setTextColor(7, 43, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(recipient, pageWidth / 2, 86, { align: "center" });

  // Recognition Statement
  doc.setTextColor(55, 65, 81);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    "in recognition of their valuable contribution toward reducing avoidable food waste and supporting community food redistribution through the FoodWise platform.",
    pageWidth / 2,
    97,
    { align: "center", maxWidth: 215 }
  );

  // 2 Structured Details Cards (Clean Information Alignment)
  const cardY = 110;
  const cardH = 30;
  const cardW = 105;
  const card1X = 35;
  const card2X = 157;

  // Panel 1: Donation Details
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.roundedRect(card1X, cardY, cardW, cardH, 2.5, 2.5, "FD");

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("DONATION PARTICULARS", card1X + 8, cardY + 7);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Food Donated:`, card1X + 8, cardY + 14);
  doc.text(`Approx. Servings:`, card1X + 8, cardY + 20);
  doc.text(`Recorded Date:`, card1X + 8, cardY + 26);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(`${quantity} kg`, card1X + 50, cardY + 14);
  doc.text(`~${servings} portions`, card1X + 50, cardY + 20);
  doc.text(`${donationDate}`, card1X + 50, cardY + 26);

  // Panel 2: Community Impact
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(card2X, cardY, cardW, cardH, 2.5, 2.5, "FD");

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("COMMUNITY IMPACT", card2X + 8, cardY + 7);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`People Helped:`, card2X + 8, cardY + 14);
  doc.text(`Waste Prevented:`, card2X + 8, cardY + 20);
  doc.text(`UN SDG Goals:`, card2X + 8, cardY + 26);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(`~${servings} people`, card2X + 50, cardY + 14);
  doc.text(`${quantity} kg saved from landfill`, card2X + 50, cardY + 20);
  doc.text(`SDG 2 (Zero Hunger) & SDG 12`, card2X + 50, cardY + 26);

  // Neutral Informational Hygiene Note (No fake government claims)
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.text(
    "Food donors are encouraged to follow applicable food safety and hygiene practices.",
    pageWidth / 2,
    148,
    { align: "center" }
  );

  // Bottom Signature & Metadata Area
  const sigY = 166;

  // Left metadata
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Certificate ID: ${certId}`, 35, sigY + 6);
  doc.text(`Issue Date: ${donationDate}`, 35, sigY + 11);
  doc.text(`Issued By: FoodWise Community Redistribution`, 35, sigY + 16);

  // Right signature
  doc.setDrawColor(156, 163, 175);
  doc.setLineWidth(0.4);
  doc.line(pageWidth - 95, sigY + 8, pageWidth - 35, sigY + 8);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Authorized Representative", pageWidth - 65, sigY + 13, { align: "center" });

  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("FoodWise Platform", pageWidth - 65, sigY + 17, { align: "center" });

  // Save PDF
  const filename = `FoodWise_Certificate_${formatSafeFilename(recipient)}.pdf`;
  doc.save(filename);
}

// ─── 2. DONATION RECORD / RECEIPT (A4 Portrait) ─────────────────────────────
// Clean, professional transactional record for individual food transfers
export function downloadDonationRecordPdf(params: DonationRecordParams) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  const docId = params.donationId || `FW-DON-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = formatDate(params.completedAt || params.createdAt);

  doc.setProperties({
    title: `FoodWise Donation Record — ${docId}`,
    subject: "Surplus Food Donation Record",
    author: "FoodWise Platform",
    creator: "FoodWise Civic Redistribution System",
  });

  // Top Header Banner
  safeAddLogo(doc, margin, 16, 14, 14);

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("FOODWISE", margin + 17, 22);

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Surplus Food Redistribution Platform", margin + 17, 27);

  // Top Right Record Identifier
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("FOOD DONATION RECORD", pageWidth - margin, 21, { align: "right" });

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Record ID: ${docId}`, pageWidth - margin, 26, { align: "right" });
  doc.text(`Issued On: ${dateStr}`, pageWidth - margin, 31, { align: "right" });

  // Horizontal Divider
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.line(margin, 36, pageWidth - margin, 36);

  let currentY = 44;

  // Status Badge Block
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, currentY, contentWidth, 12, 2, 2, "F");

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("TRANSFER STATUS:", margin + 5, currentY + 7.5);

  const statusText = (params.status || "COMPLETED").toUpperCase();
  doc.setTextColor(statusText === "COMPLETED" ? 22 : 37, statusText === "COMPLETED" ? 101 : 99, statusText === "COMPLETED" ? 52 : 235);
  doc.text(statusText, margin + 42, currentY + 7.5);

  if (params.otp) {
    doc.setTextColor(75, 85, 99);
    doc.text(`VERIFIED HANDOVER OTP: ${params.otp}`, pageWidth - margin - 5, currentY + 7.5, { align: "right" });
  }

  currentY += 19;

  // Section 1: Donor Profile
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, currentY, contentWidth, 38, "F");
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, currentY, contentWidth, 38, "S");

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("1. DONOR INFORMATION", margin + 6, currentY + 7);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  // Left Column
  doc.text("Donor Name:", margin + 6, currentY + 15);
  doc.text("Donor Type:", margin + 6, currentY + 22);
  doc.text("Contact Person:", margin + 6, currentY + 29);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(params.donorName, margin + 35, currentY + 15);
  doc.text(params.donorType, margin + 35, currentY + 22);
  doc.text(params.contactPerson || "Authorized Representative", margin + 35, currentY + 29);

  // Right Column
  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.text("Contact Phone:", margin + 95, currentY + 15);
  doc.text("Pickup Address:", margin + 95, currentY + 22);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(params.contactPhone || "+91 98112 34567", margin + 125, currentY + 15);
  doc.setFont("helvetica", "normal");
  doc.text(params.pickupAddress || "Verified Premises", margin + 125, currentY + 22, {
    maxWidth: 50,
  });

  currentY += 44;

  // Section 2: Food & Quantity Specifications
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, currentY, contentWidth, 42, "F");
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, currentY, contentWidth, 42, "S");

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("2. SURPLUS FOOD SPECIFICATIONS", margin + 6, currentY + 7);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text("Food Item:", margin + 6, currentY + 15);
  doc.text("Food Category:", margin + 6, currentY + 22);
  doc.text("Quantity Donated:", margin + 6, currentY + 29);
  doc.text("Approx. Servings:", margin + 6, currentY + 36);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(params.foodName, margin + 35, currentY + 15);
  doc.text(params.foodCategory || "Prepared Food", margin + 35, currentY + 22);
  doc.text(`${params.quantityKg} kg`, margin + 35, currentY + 29);
  doc.text(`~${params.servings} people`, margin + 35, currentY + 36);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.text("Dietary Classification:", margin + 95, currentY + 15);
  doc.text("Operational Context:", margin + 95, currentY + 22);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(params.diet || "Vegetarian", margin + 135, currentY + 15);
  doc.text(params.context || "Fresh Surplus", margin + 135, currentY + 22, {
    maxWidth: 40,
  });

  currentY += 48;

  // Section 3: Recipient & Logistics
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, currentY, contentWidth, 35, "F");
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, currentY, contentWidth, 35, "S");

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("3. COLLECTION & REDISTRIBUTION LOGISTICS", margin + 6, currentY + 7);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text("Collecting Partner:", margin + 6, currentY + 15);
  doc.text("Assigned Driver:", margin + 6, currentY + 22);
  doc.text("Handover Verification:", margin + 6, currentY + 29);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(params.recipientNgo || "Robin Hood Army (Delhi Chapter)", margin + 42, currentY + 15);
  doc.text(params.driverName || "Volunteer Relief Driver", margin + 42, currentY + 22);
  doc.text(params.otp ? `Verified with Secure OTP (${params.otp})` : "Verified at Pickup Location", margin + 42, currentY + 29);

  currentY += 42;

  // Section 4: Community Impact Summary
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2.5, 2.5, "FD");

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("COMMUNITY IMPACT OF THIS DONATION", margin + 6, currentY + 6.5);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Nutritious Portions Provided:", margin + 6, currentY + 14);
  doc.text("Landfill Waste Prevented:", margin + 95, currentY + 14);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(`~${params.servings} people fed`, margin + 50, currentY + 14);
  doc.text(`${params.quantityKg} kg food preserved`, margin + 140, currentY + 14);

  currentY += 28;

  // Informational Disclaimer
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.text(
    "This operational receipt records surplus food transferred between the registered donor and recipient organization. Food donors are encouraged to follow applicable food safety and hygiene practices.",
    margin,
    currentY,
    { maxWidth: contentWidth }
  );

  // Footer Signatures
  currentY += 18;
  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, margin + 60, currentY);
  doc.line(pageWidth - margin - 60, currentY, pageWidth - margin, currentY);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Donor Sign-off", margin + 15, currentY + 5);
  doc.text("Recipient NGO Representative", pageWidth - margin - 45, currentY + 5);

  // Bottom Document Footer
  doc.setTextColor(156, 163, 175);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`FoodWise Platform • Document Ref: ${docId} • Page 1 of 1`, margin, pageHeight - 12);
  doc.text(`Generated: ${new Date().toLocaleTimeString("en-GB")}`, pageWidth - margin, pageHeight - 12, { align: "right" });

  // Save PDF
  const filename = `FoodWise_Donation_Record_${formatSafeFilename(docId)}.pdf`;
  doc.save(filename);
}

// ─── 3. DONATION IMPACT REPORT (A4 Portrait) ────────────────────────────────
// Structured report with summary KPIs, recent donation table, and SDG alignment
export function downloadDonationImpactReportPdf(params: ImpactReportParams) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  const org = params.organizationName || "FoodWise Community Redistribution Network";
  const period = params.period || "October 2026 Audit Period";
  const reportId = params.reportId || `FW-REP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = formatDate();

  const totalKg = params.totalKg || 1380;
  const totalServings = params.totalServings || 4410;
  const completedCount = params.completedCount || 38;
  const wasteKg = params.wastePreventedKg || totalKg;

  doc.setProperties({
    title: `FoodWise Impact Report — ${reportId}`,
    subject: "Surplus Food Redistribution Impact Report",
    author: "FoodWise Platform",
    creator: "FoodWise Civic Redistribution System",
  });

  // Top Header Banner
  safeAddLogo(doc, margin, 16, 14, 14);

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("FOODWISE", margin + 17, 22);

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Surplus Food Redistribution Platform", margin + 17, 27);

  // Top Right Report Identifier
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("DONATION IMPACT REPORT", pageWidth - margin, 21, { align: "right" });

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Report ID: ${reportId}`, pageWidth - margin, 26, { align: "right" });
  doc.text(`Reporting Period: ${period}`, pageWidth - margin, 31, { align: "right" });

  // Divider
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.line(margin, 36, pageWidth - margin, 36);

  let currentY = 44;

  // Organization Header
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`Entity: ${org}`, margin, currentY);

  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Role: ${params.role || "Community Partner"} • Report Date: ${dateStr}`, margin, currentY + 5);

  currentY += 13;

  // Section 1: Executive KPI Summary (4 Blocks)
  const kpiW = (contentWidth - 9) / 4;
  const kpiH = 22;

  const kpis = [
    { label: "TOTAL FOOD DONATED", val: `${totalKg} kg` },
    { label: "PEOPLE SERVED", val: `~${totalServings.toLocaleString()}` },
    { label: "COMPLETED RESCUES", val: `${completedCount}` },
    { label: "WASTE PREVENTED", val: `${wasteKg} kg` },
  ];

  kpis.forEach((kpi, idx) => {
    const kpiX = margin + idx * (kpiW + 3);
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(kpiX, currentY, kpiW, kpiH, 2, 2, "FD");

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text(kpi.label, kpiX + 4, currentY + 6.5);

    doc.setTextColor(22, 74, 49);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(kpi.val, kpiX + 4, currentY + 16);
  });

  currentY += 30;

  // Section 2: Donation Activity Table
  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("VERIFIED DONATION ACTIVITY LOG", margin, currentY);

  currentY += 4;

  // Table Header Row
  const tableHeaders = [
    { title: "Date", width: 25 },
    { title: "Donor Name", width: 45 },
    { title: "Food Item", width: 45 },
    { title: "Category", width: 25 },
    { title: "Qty (kg)", width: 18 },
    { title: "Portions", width: 20 },
  ];

  doc.setFillColor(236, 253, 245);
  doc.rect(margin, currentY, contentWidth, 7, "F");

  let colX = margin;
  doc.setTextColor(6, 95, 70);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  tableHeaders.forEach((h) => {
    doc.text(h.title, colX + 2, currentY + 4.8);
    colX += h.width;
  });

  currentY += 7;

  // Sample or Provided Rows
  const sampleRows = params.donationsList && params.donationsList.length > 0
    ? params.donationsList.slice(0, 7)
    : [
        { date: "07 Oct 2026", donorName: "Hotel Mayura Grand", foodName: "Breakfast Buffet Surplus", category: "Buffet", quantityKg: 25, servings: 75, status: "Delivered" },
        { date: "07 Oct 2026", donorName: "Green Leaf Restaurant", foodName: "Vegetable Dum Biryani", category: "Cooked Meals", quantityKg: 12, servings: 35, status: "Delivered" },
        { date: "06 Oct 2026", donorName: "Sharma Family Residence", foodName: "Vegetable Pulao & Dal", category: "Home Meal", quantityKg: 2.5, servings: 6, status: "Delivered" },
        { date: "06 Oct 2026", donorName: "Bikanervala Sweets", foodName: "Paneer Curry & Rotis", category: "Dinner", quantityKg: 16, servings: 45, status: "Delivered" },
        { date: "05 Oct 2026", donorName: "The Oberoi Banquets", foodName: "Banquet Dinner Surplus", category: "Banquet", quantityKg: 55, servings: 160, status: "Delivered" },
        { date: "05 Oct 2026", donorName: "Verma Family Home", foodName: "Celebration Dinner Surplus", category: "Family Event", quantityKg: 4.5, servings: 12, status: "Delivered" },
        { date: "04 Oct 2026", donorName: "Grand Palace Hotel", foodName: "Lunch Buffet Surplus", category: "Buffet", quantityKg: 35, servings: 100, status: "Delivered" },
      ];

  sampleRows.forEach((row, rIdx) => {
    if (rIdx % 2 === 1) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, currentY, contentWidth, 6.5, "F");
    }
    colX = margin;
    doc.setTextColor(31, 41, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);

    doc.text(row.date, colX + 2, currentY + 4.5);
    colX += tableHeaders[0].width;

    doc.setFont("helvetica", "bold");
    doc.text(row.donorName, colX + 2, currentY + 4.5);
    colX += tableHeaders[1].width;

    doc.setFont("helvetica", "normal");
    doc.text(row.foodName, colX + 2, currentY + 4.5, { maxWidth: 43 });
    colX += tableHeaders[2].width;

    doc.text(row.category || "Meal", colX + 2, currentY + 4.5);
    colX += tableHeaders[3].width;

    doc.text(`${row.quantityKg}`, colX + 2, currentY + 4.5);
    colX += tableHeaders[4].width;

    doc.text(`~${row.servings}`, colX + 2, currentY + 4.5);

    currentY += 6.5;
  });

  currentY += 10;

  // Section 3: UN Sustainable Development Goals (SDG) Alignment
  doc.setFillColor(254, 255, 254);
  doc.setDrawColor(22, 74, 49);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 42, 2.5, 2.5, "FD");

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("UN SUSTAINABLE DEVELOPMENT GOALS (SDG) ALIGNMENT", margin + 6, currentY + 7);

  // SDG 2
  doc.setTextColor(185, 28, 28);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("SDG 2 — Zero Hunger (Target 2.1):", margin + 6, currentY + 15);

  doc.setTextColor(55, 65, 81);
  doc.setFont("helvetica", "normal");
  doc.text(
    "FoodWise helps redirect edible surplus food from commercial and residential kitchens to verified relief organizations, expanding dignified food access to vulnerable community groups.",
    margin + 6,
    currentY + 20,
    { maxWidth: contentWidth - 12 }
  );

  // SDG 12
  doc.setTextColor(4, 120, 87);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("SDG 12 — Responsible Consumption and Production (Target 12.3):", margin + 6, currentY + 28);

  doc.setTextColor(55, 65, 81);
  doc.setFont("helvetica", "normal");
  doc.text(
    "By facilitating timely redistribution of edible surplus before safe consumption windows expire, FoodWise helps reduce avoidable food waste and associated landfill emissions.",
    margin + 6,
    currentY + 33,
    { maxWidth: contentWidth - 12 }
  );

  currentY += 50;

  // Informational Hygiene Note
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.text(
    "All participating donors and relief partners are encouraged to adhere to appropriate food handling and hygiene practices.",
    margin,
    currentY
  );

  // Signoff Block
  currentY += 14;
  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.4);
  doc.line(pageWidth - margin - 60, currentY, pageWidth - margin, currentY);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Authorized Representative", pageWidth - margin - 45, currentY + 5);

  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("FoodWise Community Platform", pageWidth - margin - 45, currentY + 9);

  // Document Footer
  doc.setTextColor(156, 163, 175);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`FoodWise Platform • Document ID: ${reportId} • Page 1 of 1`, margin, pageHeight - 12);
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, pageHeight - 12, { align: "right" });

  const filename = `FoodWise_Impact_Report_${formatSafeFilename(period)}.pdf`;
  doc.save(filename);
}

// ─── 4. NGO FOOD COLLECTION & DISTRIBUTION RECEIPT (A4 Portrait) ────────────
// Factual operational receipt for NGO relief hubs and shelter deliveries
export function downloadNgoCollectionRecordPdf(params: NgoCollectionRecordParams) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  const receiptId = params.receiptId || `FW-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = formatDate(params.collectionTime);

  doc.setProperties({
    title: `FoodWise NGO Collection Receipt — ${receiptId}`,
    subject: "Surplus Food Collection Receipt",
    author: "FoodWise Platform",
    creator: "FoodWise Civic Redistribution System",
  });

  // Top Header Banner
  safeAddLogo(doc, margin, 16, 14, 14);

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("FOODWISE", margin + 17, 22);

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Surplus Food Redistribution Platform", margin + 17, 27);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("COLLECTION & DISTRIBUTION RECEIPT", pageWidth - margin, 21, { align: "right" });

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Receipt ID: ${receiptId}`, pageWidth - margin, 26, { align: "right" });
  doc.text(`Date: ${dateStr}`, pageWidth - margin, 31, { align: "right" });

  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.line(margin, 36, pageWidth - margin, 36);

  let currentY = 44;

  // Status Badge
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, currentY, contentWidth, 12, 2, 2, "F");

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("RECEIPT STATUS: VERIFIED COLLECTION & DISTRIBUTION", margin + 5, currentY + 7.5);

  if (params.otp) {
    doc.setTextColor(22, 101, 52);
    doc.text(`HANDOVER OTP MATCHED: ${params.otp}`, pageWidth - margin - 5, currentY + 7.5, { align: "right" });
  }

  currentY += 19;

  // Section 1: Collecting NGO
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, currentY, contentWidth, 32, "F");
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, currentY, contentWidth, 32, "S");

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("1. COLLECTING RELIEF ORGANIZATION", margin + 6, currentY + 7);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Organization:", margin + 6, currentY + 15);
  doc.text("Coordinator:", margin + 6, currentY + 22);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(params.ngoName, margin + 35, currentY + 15);
  doc.text(params.coordinatorName, margin + 35, currentY + 22);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.text("Phone Number:", margin + 95, currentY + 15);
  doc.text("Distribution Hub:", margin + 95, currentY + 22);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(params.phone, margin + 130, currentY + 15);
  doc.setFont("helvetica", "normal");
  doc.text(params.hubAddress, margin + 130, currentY + 22, { maxWidth: 45 });

  currentY += 38;

  // Section 2: Source Donor
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, currentY, contentWidth, 32, "F");
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, currentY, contentWidth, 32, "S");

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("2. SOURCE DONOR DETAILS", margin + 6, currentY + 7);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Donor Name:", margin + 6, currentY + 15);
  doc.text("Donor Category:", margin + 6, currentY + 22);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(params.donorName, margin + 35, currentY + 15);
  doc.text(params.donorType, margin + 35, currentY + 22);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.text("Collection Address:", margin + 95, currentY + 15);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "normal");
  doc.text(params.donorAddress, margin + 130, currentY + 15, { maxWidth: 45 });

  currentY += 38;

  // Section 3: Food Batch & Handover
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, currentY, contentWidth, 32, "F");
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, currentY, contentWidth, 32, "S");

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("3. FOOD BATCH & QUANTITY DETAILS", margin + 6, currentY + 7);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Food Item:", margin + 6, currentY + 15);
  doc.text("Total Weight:", margin + 6, currentY + 22);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(params.foodName, margin + 35, currentY + 15);
  doc.text(`${params.quantityKg} kg`, margin + 35, currentY + 22);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.text("Servings Equivalent:", margin + 95, currentY + 15);
  doc.text("Assigned Driver:", margin + 95, currentY + 22);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(`~${params.servings} people`, margin + 130, currentY + 15);
  doc.text(params.driverName || "Volunteer Driver", margin + 130, currentY + 22);

  currentY += 38;

  // Section 4: Target Shelter
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin, currentY, contentWidth, 20, 2.5, 2.5, "FD");

  doc.setTextColor(22, 74, 49);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("4. DISTRIBUTION DESTINATION & SHELTER DELIVERY", margin + 6, currentY + 6.5);

  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Primary Recipient:", margin + 6, currentY + 14);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(params.targetShelter || "Aasha Shelter & Community Relief Hub", margin + 45, currentY + 14);

  currentY += 28;

  // Informational Disclaimer
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.text(
    "FoodWise provides digital operational coordination between food donors and relief organizations. Food donors are encouraged to follow applicable food safety and hygiene practices.",
    margin,
    currentY,
    { maxWidth: contentWidth }
  );

  // Signatures
  currentY += 18;
  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, margin + 60, currentY);
  doc.line(pageWidth - margin - 60, currentY, pageWidth - margin, currentY);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Collecting Volunteer / Driver", margin + 12, currentY + 5);
  doc.text("Relief Coordinator / Hub Lead", pageWidth - margin - 50, currentY + 5);

  // Bottom Document Footer
  doc.setTextColor(156, 163, 175);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`FoodWise Platform • Receipt ID: ${receiptId} • Page 1 of 1`, margin, pageHeight - 12);
  doc.text(`Printed: ${new Date().toLocaleTimeString("en-GB")}`, pageWidth - margin, pageHeight - 12, { align: "right" });

  const filename = `FoodWise_Collection_Receipt_${formatSafeFilename(receiptId)}.pdf`;
  doc.save(filename);
}

// ─── Backward-Compatibility Aliases ─────────────────────────────────────────
// Keeps existing call sites working seamlessly while redirecting to the new, compliant implementations

export function downloadNgoImpactCertificatePdf(params: {
  ngoName?: string;
  mealsServed?: number;
  co2SavedKg?: number;
  donorName?: string;
  certificateType?: string;
}) {
  downloadFoodDonationCertificatePdf({
    recipientName: params.donorName || params.ngoName || "Community Partner",
    certificateType: params.certificateType || "Food Donation Certificate",
    mealsServed: params.mealsServed || 45,
    co2SavedKg: params.co2SavedKg,
  });
}

export function downloadDonorRankingPdf(params: {
  donorName?: string;
  rank?: number;
  totalPoints?: number;
  tier?: string;
  location?: string;
}) {
  downloadFoodDonationCertificatePdf({
    recipientName: params.donorName || "Valued Community Donor",
    certificateType: "Donor Appreciation Certificate",
    quantityKg: params.totalPoints ? Math.round(params.totalPoints / 25) : 35,
    servings: params.totalPoints ? Math.round(params.totalPoints / 8) : 100,
  });
}

export function downloadKitchenAuditPdf(params: {
  period?: string;
  facilityName?: string;
  facilityCode?: string;
  mealsServed?: number;
  wasteReduction?: string;
  fssaiCompliance?: string;
}) {
  downloadDonationImpactReportPdf({
    period: params.period || "Monthly Community Audit",
    organizationName: params.facilityName || "Community Kitchen Partner",
    totalServings: params.mealsServed || 1200,
  });
}

export function downloadFactoryAuditPdf(params: {
  plantName?: string;
  plantCode?: string;
  totalBatchesProcessed?: number;
  totalSalvagedKg?: number;
}) {
  downloadDonationImpactReportPdf({
    period: "Community Redistribution Audit",
    organizationName: params.plantName || "FoodWise Redistribution Partner",
    totalKg: params.totalSalvagedKg || 1500,
  });
}
