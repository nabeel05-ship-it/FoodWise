import { jsPDF } from "jspdf";
import { FOODWISE_LOGO_BASE64, FSSAI_BADGE_BASE64 } from "./pdfAssets";

// Safe helper to add image without throwing if format or context fails
function safeAddImage(
  doc: jsPDF,
  imageData: string,
  format: "PNG" | "JPEG",
  x: number,
  y: number,
  w: number,
  h: number
) {
  try {
    doc.addImage(imageData, format, x, y, w, h);
  } catch (err) {
    console.warn("Failed to embed image in PDF:", err);
  }
}

// ─── 1. Kitchen Audit & Compliance Report ─────────────────────────────────
export function downloadKitchenAuditPdf(params: {
  period?: string;
  facilityName?: string;
  facilityCode?: string;
  mealsServed?: number;
  wasteReduction?: string;
  fssaiCompliance?: string;
}) {
  const doc = new jsPDF();
  const period = params.period || "Current Cycle";
  const facility = params.facilityName || "IIT Delhi Central Dining Mess";
  const code = params.facilityCode || "DL-KIT-001";

  // Header Banner
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.rect(0, 0, 210, 36, "F");

  // FoodWise Logo & FSSAI Badge
  safeAddImage(doc, FOODWISE_LOGO_BASE64, "PNG", 12, 5, 24, 24);
  safeAddImage(doc, FSSAI_BADGE_BASE64, "JPEG", 174, 5, 24, 24);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("FOODWISE — KITCHEN AUDIT & COMPLIANCE REPORT", 40, 16);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Official Facility Audit • FSSAI Food Hygiene Framework • Cycle: ${period}`,
    40,
    23
  );

  // Tagline Banner
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("TAGLINE: EVERY MEAL COUNTS • Predict Less Waste. Feed More Lives.", 40, 30);

  // Facility Info Block
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("FACILITY METADATA & COMPLIANCE TIER", 14, 46);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Facility Name: ${facility}`, 14, 53);
  doc.text(`Registration Code: ${code} • FSSAI Lic: 10019011006542`, 14, 59);
  doc.text(
    `Generated On: ${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })} ${new Date().toLocaleTimeString("en-IN")}`,
    14,
    65
  );
  doc.text(`Lead Auditor / Warden: Dr. S.R. Sharma (Mess Committee)`, 14, 71);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 76, 196, 76);

  // Key KPI Summary Boxes
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 81, 55, 26, 3, 3, "F");
  doc.roundedRect(74, 81, 55, 26, 3, 3, "F");
  doc.roundedRect(134, 81, 62, 26, 3, 3, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text("MEALS FORECAST & SERVED", 18, 89);
  doc.text("WASTE REDUCTION RATE", 78, 89);
  doc.text("FSSAI SAFETY COMPLIANCE", 138, 89);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(params.mealsServed ? params.mealsServed.toLocaleString() : "8,420 Meals", 18, 100);
  doc.setTextColor(16, 185, 129);
  doc.text(params.wasteReduction || "32.4% Cut", 78, 100);
  doc.setTextColor(37, 99, 235);
  doc.text(params.fssaiCompliance || "99.8% Passed", 138, 100);

  // Audit Logs Table
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("DAILY SHIFT PRODUCTION & SURPLUS AUDIT LOG", 14, 119);

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 124, 182, 8, "F");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("DATE", 18, 129);
  doc.text("SHIFT", 48, 129);
  doc.text("PREPARED", 78, 129);
  doc.text("CONSUMED", 108, 129);
  doc.text("SURPLUS REDISTRIBUTED", 138, 129);
  doc.text("TEMP (°C)", 178, 129);

  // Table Rows
  const rows = [
    ["Today", "Morning Breakfast", "820 meals", "805 meals", "15 meals (Aasha Shelter)", "68.2°C"],
    ["Today", "Lunch Service", "1,240 meals", "1,180 meals", "60 meals (Feeding India)", "71.4°C"],
    ["Yesterday", "Dinner Service", "1,150 meals", "1,110 meals", "40 meals (Robin Hood Army)", "69.1°C"],
    ["Yesterday", "Lunch Service", "1,220 meals", "1,175 meals", "45 meals (Aasha Shelter)", "70.5°C"],
    ["2 days ago", "Dinner Service", "1,100 meals", "1,070 meals", "30 meals (Goonj Mess)", "68.9°C"],
  ];

  let yPos = 138;
  rows.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, yPos - 5, 182, 7, "F");
    }
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(row[0], 18, yPos);
    doc.text(row[1], 48, yPos);
    doc.text(row[2], 78, yPos);
    doc.text(row[3], 108, yPos);
    doc.text(row[4], 138, yPos);
    doc.text(row[5], 178, yPos);
    yPos += 8;
  });

  // Regulatory Compliance Declaration
  yPos += 8;
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(14, yPos, 182, 30, 2, 2, "FD");

  doc.setTextColor(6, 95, 70);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("FSSAI FOOD SAFETY & RECOVERY DECLARATION • EVERY MEAL COUNTS", 18, yPos + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "All surplus food documented in this audit report was maintained above 65°C hot holding, packed in tamper-evident food-grade containers, and transferred to authorized partner NGOs within 60 minutes of post-shift audit under Safe Food Share regulations. Verified under FSSAI Surplus Food Regulations, 2019.",
    18,
    yPos + 14,
    { maxWidth: 174 }
  );

  // Signatures
  yPos += 45;
  doc.setDrawColor(148, 163, 184);
  doc.line(18, yPos, 80, yPos);
  doc.line(130, yPos, 192, yPos);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.text("Dr. S.R. Sharma", 18, yPos + 5);
  doc.text("Warden & Head of Dining Operations", 18, yPos + 9);
  doc.text("IIT Delhi Central Dining Mess", 18, yPos + 13);

  doc.text("Verified FoodWise Platform Auditor", 130, yPos + 5);
  doc.text("Digital Blockchain Signature: FW-AUTH-9842-DL", 130, yPos + 9);
  doc.text("FSSAI Safe Food Share Endorsement: VERIFIED CLEAN", 130, yPos + 13);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "FoodWise AI Platform • 'Every Meal Counts' Initiative • FSSAI Food Hygiene Framework • Page 1 of 1",
    14,
    285
  );

  doc.save(`FoodWise_Kitchen_Audit_${facility.replace(/\s+/g, "_")}.pdf`);
}

// ─── 2. Factory Audit & Mass Balance Report ──────────────────────────────
export function downloadFactoryAuditPdf(params: {
  title?: string;
  facilityName?: string;
  plantCode?: string;
  batchId?: string;
}) {
  const doc = new jsPDF();
  const title = params.title || "ISO 22000 Mass Balance & Spoilage Audit";
  const plant = params.facilityName || "Punjab Agro Processing Facility #4";
  const code = params.plantCode || "PB-IND-004";

  // Header Banner
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(0, 0, 210, 36, "F");

  // FoodWise Logo & FSSAI Badge
  safeAddImage(doc, FOODWISE_LOGO_BASE64, "PNG", 12, 5, 24, 24);
  safeAddImage(doc, FSSAI_BADGE_BASE64, "JPEG", 174, 5, 24, 24);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text(`FOODWISE FACTORY — ${title.toUpperCase()}`, 40, 16);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Industrial Processing Audit • Mass Balance, IoT Telemetry & Spoilage Prevention`,
    40,
    23
  );

  // Tagline Banner
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("TAGLINE: EVERY MEAL COUNTS • Predict Less Waste. Feed More Lives.", 40, 30);

  // Facility Metadata
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PLANT AUDIT SPECIFICATIONS & FSSAI MANUFACTURING COMPLIANCE", 14, 46);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Processing Facility: ${plant}`, 14, 53);
  doc.text(`Industrial Code: ${code} • FSSAI Food Processor Reg: 10014022002891`, 14, 59);
  doc.text(`Active Batch Identifier: ${params.batchId || "TOM-2024-0234 (Tomatoes, 3,200 kg)"}`, 14, 65);
  doc.text(`Timestamp: ${new Date().toLocaleString("en-IN")}`, 14, 71);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 76, 196, 76);

  // Metrics
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 81, 55, 24, 2, 2, "F");
  doc.roundedRect(74, 81, 55, 24, 2, 2, "F");
  doc.roundedRect(134, 81, 62, 24, 2, 2, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text("RAW INTAKE VOLUME", 18, 88);
  doc.text("FINISHED PRODUCT YIELD", 78, 88);
  doc.text("BYPRODUCT SALVAGED", 138, 88);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("18,500 kg", 18, 98);
  doc.setTextColor(16, 185, 129);
  doc.text("91.8% Yield", 78, 98);
  doc.setTextColor(37, 99, 235);
  doc.text("1,420 kg Value-Add", 138, 98);

  // Telemetry Log Sample
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("MACHINERY TELEMETRY & LOSS LOG SUMMARY", 14, 116);

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, 121, 182, 60, 2, 2, "F");
  doc.setTextColor(52, 211, 153);
  doc.setFont("courier", "bold");
  doc.setFontSize(8);
  doc.text("[14:22:04] SENSOR_PING: Optical gauge caliper connected. Freq: 50Hz", 18, 129);
  doc.text("[14:24:12] TELEMETRY_STREAM: Current rotor RPM: 1,420 (Spec: 1,400-1,450)", 18, 136);
  doc.setTextColor(251, 191, 36);
  doc.text("[14:25:31] ANOMALY_WARN: Peel depth delta +1.2mm detected on quadrant 2.", 18, 143);
  doc.text("[14:26:02] LOSS_RATE: Calculated waste delta: 180 kg/hr over baseline.", 18, 150);
  doc.setTextColor(52, 211, 153);
  doc.text("[14:27:00] PREVENTATIVE_FLAG: Flagged for preventative blade realignment.", 18, 157);
  doc.setTextColor(148, 163, 184);
  doc.text("[14:28:15] FSSAI_AUDIT_STAMP: Ingested to secure industrial audit ledger.", 18, 164);
  doc.text("[14:30:00] BYPRODUCT_RECOVERY: Lycopene extraction line operating at 94.2% efficiency.", 18, 171);

  // Signatures
  doc.setFont("helvetica", "normal");
  const yPos = 210;
  doc.setDrawColor(148, 163, 184);
  doc.line(18, yPos, 80, yPos);
  doc.line(130, yPos, 192, yPos);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.text("Amit Kumar", 18, yPos + 5);
  doc.text("Plant Quality & Operations Director", 18, yPos + 9);
  doc.text(plant, 18, yPos + 13);

  doc.text("Verified Autonomous IoT Engine", 130, yPos + 5);
  doc.text("Certificate ID: FW-PLANT-ISO-2026-992", 130, yPos + 9);
  doc.text("Status: COMPLIANT WITH FSSAI & ISO 22000:2018", 130, yPos + 13);

  doc.save(`FoodWise_Factory_Report_${code}.pdf`);
}

// ─── 3. NGO Relief & Impact Certificate (Landscape) ──────────────────────
export function downloadNgoImpactCertificatePdf(params: {
  ngoName?: string;
  mealsServed?: number;
  co2SavedKg?: number;
  donorName?: string;
  certificateType?: string;
}) {
  const doc = new jsPDF("landscape");
  const ngo = params.ngoName || "Robin Hood Army & Feeding India Coalition";
  const meals = params.mealsServed || 24800;
  const co2 = params.co2SavedKg || 12400;
  const certType = params.certificateType || "80G CSR Social Impact Certificate";

  // Outer Decorative Borders
  doc.setDrawColor(16, 185, 129); // Emerald 500
  doc.setLineWidth(3);
  doc.rect(8, 8, 281, 194);

  doc.setDrawColor(245, 158, 11); // Amber 500 gold inner accent
  doc.setLineWidth(1);
  doc.rect(11, 11, 275, 188);

  doc.setDrawColor(209, 250, 229); // Mint highlight line
  doc.setLineWidth(0.5);
  doc.rect(13, 13, 271, 184);

  // Embed FoodWise Logo (Top-Left) & FSSAI Official Emblem (Top-Right)
  safeAddImage(doc, FOODWISE_LOGO_BASE64, "PNG", 18, 16, 26, 26);
  safeAddImage(doc, FSSAI_BADGE_BASE64, "JPEG", 253, 16, 26, 26);

  // Top Center Header
  doc.setTextColor(6, 95, 70);
  doc.setFontSize(21);
  doc.setFont("helvetica", "bold");
  doc.text("FOODWISE RELIEF & REDISTRIBUTION NETWORK", 148, 24, { align: "center" });

  doc.setTextColor(16, 185, 129);
  doc.setFontSize(13);
  doc.text(certType.toUpperCase(), 148, 32, { align: "center" });

  // Official Tagline Banner (Prominent "EVERY MEAL COUNTS")
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(56, 36, 184, 9, 2, 2, "FD");

  doc.setTextColor(6, 95, 70);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("★ TAGLINE: EVERY MEAL COUNTS • PREDICT LESS WASTE. FEED MORE LIVES. ★", 148, 42, {
    align: "center",
  });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Verified Under FSSAI (Recovery & Distribution of Surplus Food) Regulations, 2019 • Section 80G Compliant",
    148,
    49,
    { align: "center" }
  );

  // Certificate Citation Body
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.text(
    "This is to formally certify and commend the impactful humanitarian relief delivered by:",
    148,
    63,
    { align: "center" }
  );

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(ngo, 148, 77, { align: "center" });

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Through the automated FoodWise Surplus & Logistics Matching Network and in strict compliance with the Food Safety and Standards Authority of India (FSSAI) hygiene guidelines, this organization has successfully rescued, verified, and distributed nutritious surplus meals to shelter homes, migrant relief centres, and underprivileged families across the Delhi-NCR territory.`,
    148,
    89,
    { align: "center", maxWidth: 226 }
  );

  // Impact Metric Cards
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(26, 109, 56, 26, 3, 3, "F");
  doc.roundedRect(88, 109, 56, 26, 3, 3, "F");
  doc.roundedRect(150, 109, 56, 26, 3, 3, "F");
  doc.roundedRect(212, 109, 58, 26, 3, 3, "F");

  doc.setTextColor(6, 95, 70);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("MEALS DELIVERED", 54, 116, { align: "center" });
  doc.text("GHG EMISSIONS CUT", 116, 116, { align: "center" });
  doc.text("WATER CONSERVED", 178, 116, { align: "center" });
  doc.text("FSSAI SAFETY COMPLIANCE", 241, 116, { align: "center" });

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(15);
  doc.text(`${meals.toLocaleString()}`, 54, 127, { align: "center" });
  doc.setTextColor(16, 185, 129);
  doc.text(`${(co2 / 1000).toFixed(1)} MT CO2e`, 116, 127, { align: "center" });
  doc.setTextColor(37, 99, 235);
  doc.text(`${(meals * 140).toLocaleString()} L`, 178, 127, { align: "center" });
  doc.setTextColor(6, 95, 70);
  doc.text("100% Passed", 241, 127, { align: "center" });

  // Verification & Signatures
  const y = 160;
  doc.setDrawColor(148, 163, 184);
  doc.line(30, y, 95, y);
  doc.line(200, y, 265, y);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8.5);
  doc.text("Pooja Verma", 62, y + 4, { align: "center" });
  doc.text("Logistics Lead • Food Relief NGO Operations", 62, y + 8, { align: "center" });

  // Center Seal Text
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(108, y - 6, 80, 20, 2, 2, "F");
  doc.setTextColor(6, 95, 70);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("FSSAI SAFE FOOD SHARE", 148, y + 1, { align: "center" });
  doc.setFontSize(7.5);
  doc.text("EVERY MEAL COUNTS VERIFIED", 148, y + 6, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Auth Code: FW-FSSAI-80G-2026", 148, y + 10, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("FoodWise Social Impact Authority", 232, y + 4, { align: "center" });
  doc.text("Certificate Ref: FW-CSR-80G-2026", 232, y + 8, { align: "center" });

  // Footer Tagline Stamp
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "FoodWise • Predict Less Waste. Feed More Lives. — Official Tagline: Every Meal Counts • FSSAI Food Hygiene Framework",
    148,
    192,
    { align: "center" }
  );

  doc.save(`FoodWise_Impact_Certificate_${ngo.replace(/\s+/g, "_")}.pdf`);
}

// ─── 4. Sustainable Donor Recognition Certificate (Landscape) ─────────────
export function downloadDonorRankingPdf(params: {
  donorName?: string;
  rank?: number;
  totalPoints?: number;
  tier?: string;
  location?: string;
}) {
  const doc = new jsPDF("landscape");
  const donor = params.donorName || "IIT Delhi Central Dining Mess";
  const rank = params.rank || 2;
  const points = params.totalPoints || 2840;
  const tier = params.tier || "Gold";
  const location = params.location || "Hauz Khas, New Delhi";

  // Outer Gold Decorative Borders
  doc.setDrawColor(217, 119, 6); // Amber 600
  doc.setLineWidth(3);
  doc.rect(8, 8, 281, 194);

  doc.setDrawColor(16, 185, 129); // Emerald inner accent
  doc.setLineWidth(1);
  doc.rect(11, 11, 275, 188);

  doc.setDrawColor(254, 243, 199); // Gold inner frame
  doc.setLineWidth(0.5);
  doc.rect(13, 13, 271, 184);

  // Embed FoodWise Logo (Top-Left) & FSSAI Official Emblem (Top-Right)
  safeAddImage(doc, FOODWISE_LOGO_BASE64, "PNG", 18, 16, 26, 26);
  safeAddImage(doc, FSSAI_BADGE_BASE64, "JPEG", 253, 16, 26, 26);

  // Top Center Header
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("FOODWISE SUSTAINABLE INSTITUTIONAL DONOR RECOGNITION", 148, 24, {
    align: "center",
  });

  doc.setTextColor(217, 119, 6);
  doc.setFontSize(13);
  doc.text(
    `ANNUAL GREEN DONOR CERTIFICATE OF EXCELLENCE • ${tier.toUpperCase()} TIER`,
    148,
    32,
    { align: "center" }
  );

  // Official Tagline Banner (Prominent "EVERY MEAL COUNTS")
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(217, 119, 6);
  doc.roundedRect(56, 36, 184, 9, 2, 2, "FD");

  doc.setTextColor(146, 64, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("★ TAGLINE: EVERY MEAL COUNTS • PREDICT LESS WASTE. FEED MORE LIVES. ★", 148, 42, {
    align: "center",
  });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Certified Compliant With FSSAI Food Hygiene & Safe Food Share Standards • Govt of India Framework",
    148,
    49,
    { align: "center" }
  );

  // Citation Body
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.text("This prestigious credential is conferred upon:", 148, 63, { align: "center" });

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(23);
  doc.setFont("helvetica", "bold");
  doc.text(donor, 148, 77, { align: "center" });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.text(`${location} • FSSAI Food Safe Verified Kitchen Partner`, 148, 85, {
    align: "center",
  });

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(10);
  doc.text(
    `In recognition of exceptional dedication to Zero Hunger and Food Waste Mitigation under the FoodWise motto "Every Meal Counts". Having maintained an uninterrupted daily donation streak, 99.8% FSSAI food quality safety score, and active redistribution coordination with certified NGO relief partners.`,
    148,
    96,
    { align: "center", maxWidth: 226 }
  );

  // Standing KPI Cards
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(26, 111, 56, 26, 3, 3, "F");
  doc.roundedRect(88, 111, 56, 26, 3, 3, "F");
  doc.roundedRect(150, 111, 56, 26, 3, 3, "F");
  doc.roundedRect(212, 111, 58, 26, 3, 3, "F");

  doc.setTextColor(146, 64, 14);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("CITY RANK", 54, 118, { align: "center" });
  doc.text("REPUTATION POINTS", 116, 118, { align: "center" });
  doc.text("DONOR TIER", 178, 118, { align: "center" });
  doc.text("FSSAI SAFETY RATING", 241, 118, { align: "center" });

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(15);
  doc.text(`#${rank} in City`, 54, 129, { align: "center" });
  doc.setTextColor(217, 119, 6);
  doc.text(`${points.toLocaleString()} pts`, 116, 129, { align: "center" });
  doc.setTextColor(16, 185, 129);
  doc.text(`${tier} Tier`, 178, 129, { align: "center" });
  doc.setTextColor(16, 185, 129);
  doc.text("99.8% Safe", 241, 129, { align: "center" });

  // Signatures & Endorsements
  const y = 160;
  doc.setDrawColor(148, 163, 184);
  doc.line(30, y, 95, y);
  doc.line(200, y, 265, y);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8.5);
  doc.text("FoodWise Governing Council", 62, y + 4, { align: "center" });
  doc.text("National Food Recovery Initiative", 62, y + 8, { align: "center" });

  // Center Seal
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(108, y - 6, 80, 20, 2, 2, "F");
  doc.setTextColor(146, 64, 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("FSSAI FOOD SAFETY ENDORSED", 148, y + 1, { align: "center" });
  doc.setFontSize(7.5);
  doc.text("EVERY MEAL COUNTS • ZERO WASTE", 148, y + 6, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`Issued: ${new Date().toLocaleDateString("en-IN")}`, 148, y + 10, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Verified NGO Coalition Endorsement", 232, y + 4, { align: "center" });
  doc.text(`Certificate ID: FW-DONOR-${rank}00${points}`, 232, y + 8, { align: "center" });

  // Footer Tagline Stamp
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "FoodWise • Predict Less Waste. Feed More Lives. — Official Tagline: Every Meal Counts • FSSAI Food Hygiene Framework",
    148,
    192,
    { align: "center" }
  );

  doc.save(`FoodWise_Donor_Recognition_${donor.replace(/\s+/g, "_")}.pdf`);
}
