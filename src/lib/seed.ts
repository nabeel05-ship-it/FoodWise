// Seed script: Populates MongoDB with all initial data from mockData
// Run with: npx tsx src/lib/seed.ts

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://anshu402pandey_db_user:JLV6hPbo5uN6CPBs@cluster0.0qcpfne.mongodb.net/foodwise?retryWrites=true&w=majority";

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");

    const db = client.db("foodwise");

    // ─── 1. Institutions ───────────────────────────────────────────────
    const institutionsCol = db.collection("institutions");
    await institutionsCol.deleteMany({});
    await institutionsCol.insertMany([
      {
        code: "IITD-MESS-01",
        name: "IIT Delhi Central Mess (Aravali)",
        type: "KITCHEN",
        city: "Hauz Khas, New Delhi",
        fssai: "FSSAI LIC: 10019011006542",
        diners: "2,400 Students & Staff",
        shift: "Afternoon Shift (Lunch Prep)",
        esgScore: 78.0,
        createdAt: new Date(),
      },
      {
        code: "HLD-NGP-U03",
        name: "Haldiram's Food Processing Unit 3",
        type: "FACTORY",
        city: "Butibori MIDC, Nagpur, Maharashtra",
        fssai: "FSSAI LIC: 10014022002891",
        intake: "45,000 kg / Day",
        activeBatches: 24,
        esgScore: 78.0,
        createdAt: new Date(),
      },
      {
        code: "RHA-DEL-04",
        name: "Robin Hood Army — Delhi NCR Chapter",
        type: "NGO",
        city: "South Delhi Hub, New Delhi",
        fssai: "FSSAI Food Relief Reg: 23320003001872",
        volunteers: "142 Active Volunteers",
        esgScore: 78.0,
        createdAt: new Date(),
      },
    ]);
    console.log("✅ Seeded institutions");

    // ─── 2. Demand vs Actual (14 days) ─────────────────────────────────
    const demandCol = db.collection("demand_history");
    await demandCol.deleteMany({});
    await demandCol.insertMany([
      { day: "Sep 08", predicted: 820, actual: 810, wasteKg: 18 },
      { day: "Sep 09", predicted: 845, actual: 835, wasteKg: 20 },
      { day: "Sep 10", predicted: 880, actual: 890, wasteKg: 15 },
      { day: "Sep 11", predicted: 910, actual: 895, wasteKg: 22 },
      { day: "Sep 12", predicted: 895, actual: 910, wasteKg: 19 },
      { day: "Sep 13", predicted: 760, actual: 745, wasteKg: 28 },
      { day: "Sep 14", predicted: 680, actual: 690, wasteKg: 14 },
      { day: "Sep 15", predicted: 690, actual: 680, wasteKg: 16 },
      { day: "Sep 16", predicted: 830, actual: 820, wasteKg: 17 },
      { day: "Sep 17", predicted: 855, actual: 865, wasteKg: 18 },
      { day: "Sep 18", predicted: 890, actual: 875, wasteKg: 21 },
      { day: "Sep 19", predicted: 920, actual: 905, wasteKg: 24 },
      { day: "Sep 20", predicted: 780, actual: 755, wasteKg: 31 },
      { day: "Sep 21", predicted: 847, actual: 820, wasteKg: 12 },
    ]);
    console.log("✅ Seeded demand_history");

    // ─── 3. Weekly Waste by Category ───────────────────────────────────
    const wasteCol = db.collection("waste_records");
    await wasteCol.deleteMany({});
    await wasteCol.insertMany([
      { day: "Mon", rice: 14, curry: 10, bread: 8, veg: 6, other: 4 },
      { day: "Tue", rice: 12, curry: 12, bread: 9, veg: 7, other: 3 },
      { day: "Wed", rice: 16, curry: 9, bread: 7, veg: 8, other: 5 },
      { day: "Thu", rice: 15, curry: 11, bread: 8, veg: 7, other: 4 },
      { day: "Fri", rice: 28, curry: 14, bread: 11, veg: 9, other: 6 },
      { day: "Sat", rice: 11, curry: 8, bread: 6, veg: 5, other: 3 },
      { day: "Sun", rice: 10, curry: 7, bread: 7, veg: 4, other: 3 },
    ]);
    console.log("✅ Seeded waste_records");

    // ─── 4. Today's Meal Plan ──────────────────────────────────────────
    const mealPlanCol = db.collection("meal_plans");
    await mealPlanCol.deleteMany({});
    await mealPlanCol.insertMany([
      { meal: "Breakfast", predicted: 420, prepared: 380, remaining: 15, status: "Completed", highlight: false },
      { meal: "Lunch", predicted: 847, prepared: 820, remaining: 62, status: "In Progress", highlight: true },
      { meal: "Dinner", predicted: 750, prepared: 0, remaining: 0, status: "Scheduled", highlight: false },
    ]);
    console.log("✅ Seeded meal_plans");

    // ─── 5. Kitchen Alerts ─────────────────────────────────────────────
    const alertsCol = db.collection("kitchen_alerts");
    await alertsCol.deleteMany({});
    await alertsCol.insertMany([
      { alertId: "ka-1", title: "Lunch Rice Surplus", message: "Lunch rice — 62 kg surplus — 4 hours remaining", severity: "urgent", actionLabel: "ACTION", actionUrl: "/kitchen/surplus" },
      { alertId: "ka-2", title: "Cold Storage Alert", message: "Refrigerator Unit B — temp 9.2°C (target 4-8°C)", severity: "warning", actionLabel: "VIEW", actionUrl: "/kitchen/surplus" },
      { alertId: "ka-3", title: "Upcoming Holiday", message: "Tomorrow: Festival — attendance may vary ±15%", severity: "info", actionLabel: "INFO", actionUrl: "/kitchen/prediction" },
    ]);
    console.log("✅ Seeded kitchen_alerts");

    // ─── 6. Prediction Breakdown ───────────────────────────────────────
    const predictionsCol = db.collection("predictions");
    await predictionsCol.deleteMany({});
    await predictionsCol.insertMany([
      { meal: "Breakfast", predicted: 380, lastWeek: 365, suggestion: "Prepare 390 (+buffer)" },
      { meal: "Lunch", predicted: 863, lastWeek: 891, suggestion: "Prepare 875" },
      { meal: "Dinner", predicted: 720, lastWeek: 744, suggestion: "Prepare 730" },
    ]);
    console.log("✅ Seeded predictions");

    // ─── 7. Surplus Items ──────────────────────────────────────────────
    const surplusCol = db.collection("surplus_items");
    await surplusCol.deleteMany({});
    await surplusCol.insertMany([
      {
        surplusId: "sur-01", item: "Dal Makhani", quantityKg: 45,
        preparedAt: "12:30 PM", safeUntil: "6:30 PM", hoursRemaining: 5.5,
        status: "SAFE", prepRecorded: true, tempCelsius: 4.2, coveredHygienic: true, eligible: true,
      },
      {
        surplusId: "sur-02", item: "Steamed Basmati Rice", quantityKg: 62,
        preparedAt: "1:00 PM", safeUntil: "5:00 PM", hoursRemaining: 4.0,
        status: "EXPIRING_SOON", prepRecorded: true, tempCelsius: 5.1, coveredHygienic: true, eligible: true,
      },
      {
        surplusId: "sur-03", item: "Mixed Veg Curry", quantityKg: 18,
        preparedAt: "11:45 AM", safeUntil: "3:45 PM", hoursRemaining: 1.5,
        status: "CANNOT_REDISTRIBUTE", prepRecorded: true, tempCelsius: 11.4, coveredHygienic: false, eligible: false,
      },
    ]);
    console.log("✅ Seeded surplus_items");

    // ─── 8. NGO Profiles ───────────────────────────────────────────────
    const ngosCol = db.collection("ngo_profiles");
    await ngosCol.deleteMany({});
    await ngosCol.insertMany([
      { ngoId: "ngo-1", name: "Aasha Shelter & Orphanage", verified: true, distanceKm: 3.2, capacityKg: 80, etaMinutes: 18, rating: 4.8, location: "Kalu Sarai, New Delhi", phone: "+91 98112 40291" },
      { ngoId: "ngo-2", name: "Robin Hood Army — Green Park Unit", verified: true, distanceKm: 4.8, capacityKg: 150, etaMinutes: 25, rating: 4.9, location: "Green Park Main, New Delhi", phone: "+91 99201 88374" },
      { ngoId: "ngo-3", name: "Roti Bank Foundation Delhi", verified: true, distanceKm: 5.5, capacityKg: 100, etaMinutes: 32, rating: 4.7, location: "Safdarjung Enclave, New Delhi", phone: "+91 98711 39201" },
    ]);
    console.log("✅ Seeded ngo_profiles");

    // ─── 9. Route Stops ────────────────────────────────────────────────
    const routesCol = db.collection("route_stops");
    await routesCol.deleteMany({});
    await routesCol.insertMany([
      { stopNumber: 1, recipient: "Aasha Shelter", items: "Rice + Dal Makhani", quantityKg: 60, eta: "2:45 PM", status: "Confirmed", coordinates: { x: 35, y: 45 } },
      { stopNumber: 2, recipient: "City Food Bank", items: "Veg Curry + Chapati", quantityKg: 47, eta: "3:10 PM", status: "Pending", coordinates: { x: 70, y: 72 } },
    ]);
    console.log("✅ Seeded route_stops");

    // ─── 10. Factory Storage Units ─────────────────────────────────────
    const storageCol = db.collection("factory_storage");
    await storageCol.deleteMany({});
    await storageCol.insertMany([
      { unitId: "unit-a", name: "Storage Unit A — Potatoes", crop: "Potatoes (Kufri Chipsona)", icon: "🥔", stockKg: 22400, tempCelsius: 6.2, targetTemp: "4 - 8°C", humidityPct: 92, targetHumidity: "85 - 95%", shelfLifeDays: 18, status: "GOOD" },
      { unitId: "unit-b", name: "Storage Unit B — Tomatoes", crop: "Processing Tomatoes (Roma VF)", icon: "🍅", stockKg: 8200, tempCelsius: 13.1, targetTemp: "7 - 10°C", humidityPct: 87, targetHumidity: "90 - 95%", shelfLifeDays: 4, status: "ATTENTION_NEEDED", isUrgent: true },
      { unitId: "unit-c", name: "Storage Unit C — Onions", crop: "Red Nashik Onions", icon: "🧅", stockKg: 4300, tempCelsius: 18.4, targetTemp: "15 - 20°C", humidityPct: 65, targetHumidity: "60 - 70%", shelfLifeDays: 24, status: "GOOD" },
      { unitId: "unit-d", name: "Storage Unit D — Seasonings & Spices", crop: "Red Chilli Powder & Herbs", icon: "🌶️", stockKg: 1200, tempCelsius: 16.0, targetTemp: "14 - 18°C", humidityPct: 52, targetHumidity: "50 - 55%", shelfLifeDays: 45, status: "GOOD" },
    ]);
    console.log("✅ Seeded factory_storage");

    // ─── 11. Spoilage Batches ──────────────────────────────────────────
    const spoilageCol = db.collection("spoilage_batches");
    await spoilageCol.deleteMany({});
    await spoilageCol.insertMany([
      {
        batchId: "batch-tom-0234", batchCode: "TOM-2024-0234",
        crop: "Tomatoes (Processing Grade A)", quantityKg: 3200,
        storageUnit: "Cold Storage Unit B", ageDays: 6,
        spoilageEstHours: 31, confidencePct: 82, riskLevel: "HIGH",
        factors: [
          "Temperature exceeded 10°C threshold 3x today (peak 13.1°C)",
          "Relative humidity dipped to 87% (below 92% baseline)",
          "Batch age (6 days) approaching maximum holding threshold (7 days)",
          "Historical similarity: Batch TOM-2024-0198 spoiled in 28 hrs under identical thermal curve",
        ],
        recommendation: "Prioritize this batch for processing today. Estimated 2,800 kg can be salvaged if processed within next 8 hours for Ketchup Line 2.",
        salvageableKg: 2800,
        degradationCurve: [
          { hour: 0, quality: 78, threshold: 45 },
          { hour: 6, quality: 72, threshold: 45 },
          { hour: 12, quality: 64, threshold: 45 },
          { hour: 18, quality: 57, threshold: 45 },
          { hour: 24, quality: 50, threshold: 45 },
          { hour: 31, quality: 44, threshold: 45 },
          { hour: 48, quality: 28, threshold: 45 },
          { hour: 72, quality: 10, threshold: 45 },
        ],
      },
      {
        batchId: "batch-pot-1182", batchCode: "POT-2024-1182",
        crop: "Potatoes (Chipsona Line 1)", quantityKg: 6400,
        storageUnit: "Cold Storage Unit A", ageDays: 12,
        spoilageEstHours: 94, confidencePct: 76, riskLevel: "MEDIUM",
        factors: [
          "Slight condensation detected in sub-quadrant A3",
          "Sugar conversion rate within 1.2x of threshold for crisping",
        ],
        recommendation: "Queue for processing within 48-72 hours. Blend with fresh harvest batch POT-2024-1205 to maintain starch profile.",
        salvageableKg: 6100,
        degradationCurve: [
          { hour: 0, quality: 89, threshold: 45 },
          { hour: 12, quality: 85, threshold: 45 },
          { hour: 24, quality: 81, threshold: 45 },
          { hour: 48, quality: 73, threshold: 45 },
          { hour: 72, quality: 62, threshold: 45 },
          { hour: 94, quality: 45, threshold: 45 },
        ],
      },
      {
        batchId: "batch-oni-0941", batchCode: "ONI-2024-0941",
        crop: "Red Onions (Powder / Paste)", quantityKg: 4300,
        storageUnit: "Storage Unit C", ageDays: 14,
        spoilageEstHours: 168, confidencePct: 91, riskLevel: "LOW",
        factors: [
          "Ventilation airflow optimal at 1.8 m/s",
          "Skin integrity index 94%",
        ],
        recommendation: "Stable. Maintain ambient dehumidification.",
        salvageableKg: 4250,
        degradationCurve: [
          { hour: 0, quality: 96, threshold: 45 },
          { hour: 24, quality: 93, threshold: 45 },
          { hour: 48, quality: 90, threshold: 45 },
          { hour: 72, quality: 86, threshold: 45 },
        ],
      },
    ]);
    console.log("✅ Seeded spoilage_batches");

    // ─── 12. Machine Health ────────────────────────────────────────────
    const machinesCol = db.collection("machines");
    await machinesCol.deleteMany({});
    await machinesCol.insertMany([
      {
        machId: "mach-1", machineId: "PM-03", name: "Industrial Peeling Machine",
        status: "CHECK_REQUIRED", efficiencyPct: 82, normalRange: "95 - 97%",
        anomalyDetected: true, anomalyTitle: "Excessive Peel Thickness & Yield Drop",
        currentValue: "Peel thickness: 2.8mm", expectedValue: "Expected: 1.4 - 1.6mm",
        lossRatePerHour: "+6% loss per hour", estimatedExtraWasteKgPerHour: 180,
        possibleCause: "Blade alignment off-center on Rotary Drum #2 or dull abrasive lining.",
        note: "This is a predictive anomaly flag for preventative inspection, not a confirmed catastrophic fault.",
        assignedTechnician: "Rajesh Kumar (Senior Line Mechanic)",
        trend: [96, 95, 94, 91, 86, 82],
      },
      {
        machId: "mach-2", machineId: "SL-02", name: "Centrifugal Slicing Unit",
        status: "OPTIMAL", efficiencyPct: 96.5, normalRange: "95 - 98%",
        anomalyDetected: false, trend: [96, 96, 97, 96, 97, 96.5],
      },
      {
        machId: "mach-3", machineId: "FY-01", name: "Continuous Multi-Zone Fryer",
        status: "OPTIMAL", efficiencyPct: 94.8, normalRange: "93 - 96%",
        anomalyDetected: false, trend: [94, 95, 95, 94, 95, 94.8],
      },
      {
        machId: "mach-4", machineId: "PK-04", name: "Nitrogen Flush Packaging Line",
        status: "OPTIMAL", efficiencyPct: 98.2, normalRange: "96 - 99%",
        anomalyDetected: false, trend: [98, 98, 99, 98, 98, 98.2],
      },
      {
        machId: "mach-5", machineId: "SR-05", name: "Optical Defect Sorting Robot",
        status: "WARNING", efficiencyPct: 89.1, normalRange: "92 - 97%",
        anomalyDetected: true, anomalyTitle: "Optical Sensor Dust Accumulation",
        currentValue: "Spectral clarity: 79%", expectedValue: "Target: >90%",
        lossRatePerHour: "+1.8% false reject", estimatedExtraWasteKgPerHour: 45,
        possibleCause: "Steam vapor residue on camera lens hood.",
        note: "Clean aperture during 3:00 PM shift changeover.",
        trend: [95, 94, 92, 91, 89.1],
      },
      {
        machId: "mach-6", machineId: "BL-01", name: "Hydro-Thermal Blanching Unit",
        status: "OPTIMAL", efficiencyPct: 95.0, normalRange: "94 - 97%",
        anomalyDetected: false, trend: [95, 95, 94, 95, 95.0],
      },
    ]);
    console.log("✅ Seeded machines");

    // ─── 13. ESG Data ──────────────────────────────────────────────────
    const esgCol = db.collection("esg_data");
    await esgCol.deleteMany({});
    await esgCol.insertOne({
      overallScore: 78,
      environmentalScore: 82,
      socialScore: 71,
      governanceScore: 80,
      environmental: {
        co2PreventedTons: 2847,
        co2Methodology: "EPA WARM Model: 2.5 kg CO₂e prevented per kg food waste diverted",
        waterSavedLiters: "8.4 Million Liters",
        energyOptimizedKwh: "1.2 Million kWh",
        wasteDivertedTons: 847,
      },
      social: {
        mealsRedistributed: 47832,
        peopleBenefited: "~12,000 People",
        activeNgoPartners: 34,
        communitiesReached: "18 Districts across Delhi-NCR & Maharashtra",
      },
      governance: {
        fssaiCompliancePct: 98.4,
        auditLogsRecorded: 1420,
        dataCompletenessPct: 99.6,
        traceabilityCoveragePct: 99.1,
      },
      monthlyCo2Trend: [
        { month: "Oct 25", co2Tons: 165, meals: 2900 },
        { month: "Nov 25", co2Tons: 190, meals: 3200 },
        { month: "Dec 25", co2Tons: 215, meals: 3600 },
        { month: "Jan 26", co2Tons: 230, meals: 3850 },
        { month: "Feb 26", co2Tons: 245, meals: 4100 },
        { month: "Mar 26", co2Tons: 260, meals: 4300 },
        { month: "Apr 26", co2Tons: 275, meals: 4450 },
        { month: "May 26", co2Tons: 250, meals: 4100 },
        { month: "Jun 26", co2Tons: 280, meals: 4600 },
        { month: "Jul 26", co2Tons: 295, meals: 4900 },
        { month: "Aug 26", co2Tons: 310, meals: 5200 },
        { month: "Sep 26", co2Tons: 327, meals: 5532 },
      ],
    });
    console.log("✅ Seeded esg_data");

    // ─── 14. Notifications ─────────────────────────────────────────────
    const notifCol = db.collection("notifications");
    await notifCol.deleteMany({});
    await notifCol.insertMany([
      {
        notifId: "notif-1", title: "Urgent Batch Spoilage Warning",
        message: "Batch TOM-2024-0234 (Tomatoes, 3,200 kg) requires priority processing within 8 hours to salvage 2,800 kg.",
        time: "10 mins ago", severity: "urgent", category: "Factory",
        actionLabel: "Prioritize Batch", actionUrl: "/factory/spoilage", read: false,
        createdAt: new Date(),
      },
      {
        notifId: "notif-2", title: "AI Demand Recommendation Updated",
        message: "Tomorrow's lunch recommended at 863 meals (was 891). 28 meal buffer reduction suggested.",
        time: "25 mins ago", severity: "warning", category: "Kitchen",
        actionLabel: "Review Forecast", actionUrl: "/kitchen/prediction", read: false,
        createdAt: new Date(),
      },
      {
        notifId: "notif-3", title: "Surplus Matched: Aasha Shelter",
        message: "60 kg Lunch surplus successfully matched with Aasha Shelter. Driver dispatched, ETA 18 mins.",
        time: "42 mins ago", severity: "success", category: "Redistribution",
        actionLabel: "Track Delivery", actionUrl: "/kitchen/routes", read: false,
        createdAt: new Date(),
      },
      {
        notifId: "notif-4", title: "Machine Anomaly Flag: Peeling Drum PM-03",
        message: "Peel thickness exceeds threshold by 1.2mm (+6% loss rate). Preventative blade check recommended.",
        time: "1 hour ago", severity: "warning", category: "IoT",
        actionLabel: "View Telemetry", actionUrl: "/factory/machines", read: true,
        createdAt: new Date(),
      },
    ]);
    console.log("✅ Seeded notifications");

    // ─── 15. Donor Hotels ──────────────────────────────────────────────
    const hotelsCol = db.collection("donor_hotels");
    await hotelsCol.deleteMany({});
    await hotelsCol.insertMany([
      {
        hotelId: "h-1", name: "The Oberoi New Delhi", location: "Dr. Zakir Hussain Marg",
        totalPoints: 6840, totalDonations: 147, avgRating: 4.8, totalRatings: 89,
        lastDonation: "Today, 1:30 PM",
        specialBadges: ["Consistent Donor", "Top Quality", "Cold Chain Certified"],
        streak: 34, fssaiVerified: true,
      },
      {
        hotelId: "h-2", name: "IIT Delhi Central Mess", location: "Hauz Khas, New Delhi",
        totalPoints: 4250, totalDonations: 210, avgRating: 4.5, totalRatings: 156,
        lastDonation: "Today, 12:00 PM",
        specialBadges: ["Bulk Contributor", "Consistent Donor", "Zero Waste Champion"],
        streak: 52, fssaiVerified: true,
      },
      {
        hotelId: "h-3", name: "Bikanervala Central Kitchen", location: "Okhla Phase III",
        totalPoints: 3180, totalDonations: 98, avgRating: 4.3, totalRatings: 64,
        lastDonation: "Yesterday, 5:00 PM",
        specialBadges: ["Festival Support", "Rapid Response"],
        streak: 18, fssaiVerified: true,
      },
      {
        hotelId: "h-4", name: "AIIMS Staff Cafeteria", location: "Ansari Nagar, New Delhi",
        totalPoints: 1850, totalDonations: 65, avgRating: 4.1, totalRatings: 42,
        lastDonation: "Sep 23, 3:30 PM",
        specialBadges: ["Weekend Hero"],
        streak: 8, fssaiVerified: true,
      },
      {
        hotelId: "h-5", name: "Rajdhani Thali House", location: "Connaught Place",
        totalPoints: 920, totalDonations: 34, avgRating: 3.9, totalRatings: 22,
        lastDonation: "Sep 22, 6:00 PM",
        specialBadges: ["Rapid Response"],
        streak: 5, fssaiVerified: false,
      },
      {
        hotelId: "h-6", name: "Street Food Collective — Chandni Chowk", location: "Chandni Chowk, Old Delhi",
        totalPoints: 380, totalDonations: 12, avgRating: 3.7, totalRatings: 8,
        lastDonation: "Sep 20, 4:15 PM",
        specialBadges: [],
        streak: 3, fssaiVerified: false,
      },
    ]);
    console.log("✅ Seeded donor_hotels");

    // ─── 16. Donor Feedback ────────────────────────────────────────────
    const feedbackCol = db.collection("donor_feedback");
    await feedbackCol.deleteMany({});
    await feedbackCol.insertMany([
      {
        feedbackId: "fb-1", hotelId: "h-1", hotelName: "The Oberoi New Delhi",
        date: "Sep 24, 2026", foodQuality: 5, packaging: 5, timeliness: 4, quantity: 5,
        overallRating: 4.8, comment: "Excellent quality food, well-packaged in insulated containers. Arrived fresh and warm.",
        pointsAwarded: 85, createdAt: new Date(),
      },
      {
        feedbackId: "fb-2", hotelId: "h-2", hotelName: "IIT Delhi Central Mess",
        date: "Sep 24, 2026", foodQuality: 4, packaging: 4, timeliness: 5, quantity: 5,
        overallRating: 4.5, comment: "Large quantity, always on time. Good basic food that feeds many people.",
        pointsAwarded: 70, createdAt: new Date(),
      },
      {
        feedbackId: "fb-3", hotelId: "h-3", hotelName: "Bikanervala Central Kitchen",
        date: "Sep 23, 2026", foodQuality: 5, packaging: 3, timeliness: 4, quantity: 4,
        overallRating: 4.0, comment: "Great food quality. Packaging could be improved — some containers leaked during transport.",
        pointsAwarded: 55, createdAt: new Date(),
      },
    ]);
    console.log("✅ Seeded donor_feedback");

    // ─── 17. Complaints ────────────────────────────────────────────────
    const complaintsCol = db.collection("complaints");
    await complaintsCol.deleteMany({});
    await complaintsCol.insertMany([
      {
        complaintId: "cmp-1",
        date: "Sep 24, 2026 • 4:15 PM",
        establishment: "Roadside Dhaba — Sarai Kale Khan",
        category: "Unhygienic Preparation",
        severity: "High",
        status: "Under Review",
        fssaiRef: "FSSAI-CMP-2026-84921",
        description: "Open cooking without gloves, flies around food prep area. Food being served to daily wage workers.",
        hasImage: true,
        createdAt: new Date(),
      },
      {
        complaintId: "cmp-2",
        date: "Sep 22, 2026 • 11:30 AM",
        establishment: "Sharma Sweets & Namkeen — Lajpat Nagar",
        category: "Expired / Unsafe Food Served",
        severity: "Critical",
        status: "Action Taken",
        fssaiRef: "FSSAI-CMP-2026-84856",
        description: "Expired packaged sweets (best before: Aug 2026) being sold. Multiple packets with fungal growth spotted.",
        hasImage: true,
        createdAt: new Date(),
      },
      {
        complaintId: "cmp-3",
        date: "Sep 18, 2026 • 2:00 PM",
        establishment: "Green Valley Caterers — Dwarka",
        category: "Temperature Violation",
        severity: "Medium",
        status: "Resolved",
        fssaiRef: "FSSAI-CMP-2026-84702",
        description: "Buffet food kept at room temperature for 5+ hours during an event. No chafing dishes or heating arrangement.",
        hasImage: false,
        createdAt: new Date(),
      },
    ]);
    console.log("✅ Seeded complaints");

    // ─── Create indexes for frequently-queried fields ──────────────────
    await institutionsCol.createIndex({ code: 1 }, { unique: true });
    await surplusCol.createIndex({ surplusId: 1 }, { unique: true });
    await ngosCol.createIndex({ ngoId: 1 }, { unique: true });
    await machinesCol.createIndex({ machineId: 1 });
    await spoilageCol.createIndex({ batchCode: 1 }, { unique: true });
    await hotelsCol.createIndex({ hotelId: 1 }, { unique: true });
    await feedbackCol.createIndex({ hotelId: 1 });
    await notifCol.createIndex({ createdAt: -1 });
    await complaintsCol.createIndex({ createdAt: -1 });
    console.log("✅ Created indexes");

    console.log("\n🎉 All data seeded successfully into MongoDB Atlas!");
    console.log("   Database: foodwise");
    console.log("   Collections: 17");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("🔒 Connection closed");
  }
}

seed();
