import {
  DemandPredictionItem,
  SurplusItem,
  NGOProfile,
  RouteStop,
  FactoryStorageUnit,
  SpoilageBatch,
  MachineHealthRecord,
  NotificationAlert,
} from "./types";

export const INSTITUTIONS = {
  kitchen: {
    name: "IIT Delhi Central Mess (Aravali)",
    code: "IITD-MESS-01",
    city: "Hauz Khas, New Delhi",
    fssai: "FSSAI LIC: 10019011006542",
    diners: "2,400 Students & Staff",
    shift: "Afternoon Shift (Lunch Prep)",
  },
  factory: {
    name: "Haldiram's Food Processing Unit 3",
    code: "HLD-NGP-U03",
    city: "Butibori MIDC, Nagpur, Maharashtra",
    fssai: "FSSAI LIC: 10014022002891",
    intake: "45,000 kg / Day",
    activeBatches: 24,
  },
  ngo: {
    name: "Robin Hood Army — Delhi NCR Chapter",
    code: "RHA-DEL-04",
    city: "South Delhi Hub, New Delhi",
    fssai: "FSSAI Food Relief Reg: 23320003001872",
    volunteers: "142 Active Volunteers",
  },
};

// 14-day comparison of AI Predicted vs Actual Consumed
export const DEMAND_VS_ACTUAL_14DAYS = [
  { day: "Sep 08", predicted: 820, actual: 810, wasteKg: 18 },
  { day: "Sep 09", predicted: 845, actual: 835, wasteKg: 20 },
  { day: "Sep 10", predicted: 880, actual: 890, wasteKg: 15 },
  { day: "Sep 11", predicted: 910, actual: 895, wasteKg: 22 },
  { day: "Sep 12", predicted: 895, actual: 910, wasteKg: 19 },
  { day: "Sep 13", predicted: 760, actual: 745, wasteKg: 28 }, // Friday anomaly
  { day: "Sep 14", predicted: 680, actual: 690, wasteKg: 14 },
  { day: "Sep 15", predicted: 690, actual: 680, wasteKg: 16 },
  { day: "Sep 16", predicted: 830, actual: 820, wasteKg: 17 },
  { day: "Sep 17", predicted: 855, actual: 865, wasteKg: 18 },
  { day: "Sep 18", predicted: 890, actual: 875, wasteKg: 21 },
  { day: "Sep 19", predicted: 920, actual: 905, wasteKg: 24 },
  { day: "Sep 20", predicted: 780, actual: 755, wasteKg: 31 }, // Friday anomaly
  { day: "Sep 21", predicted: 847, actual: 820, wasteKg: 12 }, // Today
];

// Stacked Daily Waste by Category for last 7 days
export const WEEKLY_WASTE_BY_CATEGORY = [
  { day: "Mon", rice: 14, curry: 10, bread: 8, veg: 6, other: 4 },
  { day: "Tue", rice: 12, curry: 12, bread: 9, veg: 7, other: 3 },
  { day: "Wed", rice: 16, curry: 9, bread: 7, veg: 8, other: 5 },
  { day: "Thu", rice: 15, curry: 11, bread: 8, veg: 7, other: 4 },
  { day: "Fri", rice: 28, curry: 14, bread: 11, veg: 9, other: 6 }, // Rice spikes 15-20%
  { day: "Sat", rice: 11, curry: 8, bread: 6, veg: 5, other: 3 },
  { day: "Sun", rice: 10, curry: 7, bread: 7, veg: 4, other: 3 },
];

// Today's meal plan overview
export const TODAY_MEAL_PLAN = [
  {
    meal: "Breakfast",
    predicted: 420,
    prepared: 380,
    remaining: 15,
    status: "Completed",
    highlight: false,
  },
  {
    meal: "Lunch",
    predicted: 847,
    prepared: 820,
    remaining: 62,
    status: "In Progress",
    highlight: true, // orange highlight per instructions
  },
  {
    meal: "Dinner",
    predicted: 750,
    prepared: 0,
    remaining: 0,
    status: "Scheduled",
    highlight: false,
  },
];

// Kitchen Active Alerts
export const KITCHEN_ALERTS = [
  {
    id: "ka-1",
    title: "Lunch Rice Surplus",
    message: "Lunch rice — 62 kg surplus — 4 hours remaining",
    severity: "urgent",
    actionLabel: "ACTION",
    actionUrl: "/kitchen/surplus",
  },
  {
    id: "ka-2",
    title: "Cold Storage Alert",
    message: "Refrigerator Unit B — temp 9.2°C (target 4-8°C)",
    severity: "warning",
    actionLabel: "VIEW",
    actionUrl: "/kitchen/surplus",
  },
  {
    id: "ka-3",
    title: "Upcoming Holiday",
    message: "Tomorrow: Festival — attendance may vary ±15%",
    severity: "info",
    actionLabel: "INFO",
    actionUrl: "/kitchen/prediction",
  },
];

// Kitchen Prediction Breakdown
export const PREDICTION_BREAKDOWN: DemandPredictionItem[] = [
  {
    meal: "Breakfast",
    predicted: 380,
    lastWeek: 365,
    suggestion: "Prepare 390 (+buffer)",
  },
  {
    meal: "Lunch",
    predicted: 863,
    lastWeek: 891,
    suggestion: "Prepare 875",
  },
  {
    meal: "Dinner",
    predicted: 720,
    lastWeek: 744,
    suggestion: "Prepare 730",
  },
];

// Kitchen Active Surplus Table
export const SURPLUS_ITEMS: SurplusItem[] = [
  {
    id: "sur-01",
    item: "Dal Makhani",
    quantityKg: 45,
    preparedAt: "12:30 PM",
    safeUntil: "6:30 PM",
    hoursRemaining: 5.5,
    status: "SAFE",
    prepRecorded: true,
    tempCelsius: 4.2,
    coveredHygienic: true,
    eligible: true,
  },
  {
    id: "sur-02",
    item: "Steamed Basmati Rice",
    quantityKg: 62,
    preparedAt: "1:00 PM",
    safeUntil: "5:00 PM",
    hoursRemaining: 4.0,
    status: "EXPIRING_SOON",
    prepRecorded: true,
    tempCelsius: 5.1,
    coveredHygienic: true,
    eligible: true,
  },
  {
    id: "sur-03",
    item: "Mixed Veg Curry",
    quantityKg: 18,
    preparedAt: "11:45 AM",
    safeUntil: "3:45 PM",
    hoursRemaining: 1.5,
    status: "CANNOT_REDISTRIBUTE",
    prepRecorded: true,
    tempCelsius: 11.4, // over 8C
    coveredHygienic: false,
    eligible: false,
  },
];

// Matched Verified NGOs
export const MATCHED_NGOS: NGOProfile[] = [
  {
    id: "ngo-1",
    name: "Aasha Shelter & Orphanage",
    verified: true,
    distanceKm: 3.2,
    capacityKg: 80,
    etaMinutes: 18,
    rating: 4.8,
    location: "Kalu Sarai, New Delhi",
    phone: "+91 98112 40291",
  },
  {
    id: "ngo-2",
    name: "Robin Hood Army — Green Park Unit",
    verified: true,
    distanceKm: 4.8,
    capacityKg: 150,
    etaMinutes: 25,
    rating: 4.9,
    location: "Green Park Main, New Delhi",
    phone: "+91 99201 88374",
  },
  {
    id: "ngo-3",
    name: "Roti Bank Foundation Delhi",
    verified: true,
    distanceKm: 5.5,
    capacityKg: 100,
    etaMinutes: 32,
    rating: 4.7,
    location: "Safdarjung Enclave, New Delhi",
    phone: "+91 98711 39201",
  },
];

// Kitchen Delivery Route Stops
export const ROUTE_STOPS: RouteStop[] = [
  {
    stopNumber: 1,
    recipient: "Aasha Shelter",
    items: "Rice + Dal Makhani",
    quantityKg: 60,
    eta: "2:45 PM",
    status: "Confirmed",
    coordinates: { x: 35, y: 45 },
  },
  {
    stopNumber: 2,
    recipient: "City Food Bank",
    items: "Veg Curry + Chapati",
    quantityKg: 47,
    eta: "3:10 PM",
    status: "Pending",
    coordinates: { x: 70, y: 72 },
  },
];

// Factory Storage Units
export const FACTORY_STORAGE_UNITS: FactoryStorageUnit[] = [
  {
    id: "unit-a",
    name: "Storage Unit A — Potatoes",
    crop: "Potatoes (Kufri Chipsona)",
    icon: "🥔",
    stockKg: 22400,
    tempCelsius: 6.2,
    targetTemp: "4 - 8°C",
    humidityPct: 92,
    targetHumidity: "85 - 95%",
    shelfLifeDays: 18,
    status: "GOOD",
  },
  {
    id: "unit-b",
    name: "Storage Unit B — Tomatoes",
    crop: "Processing Tomatoes (Roma VF)",
    icon: "🍅",
    stockKg: 8200,
    tempCelsius: 13.1, // Warning
    targetTemp: "7 - 10°C",
    humidityPct: 87, // Warning
    targetHumidity: "90 - 95%",
    shelfLifeDays: 4,
    status: "ATTENTION_NEEDED",
    isUrgent: true,
  },
  {
    id: "unit-c",
    name: "Storage Unit C — Onions",
    crop: "Red Nashik Onions",
    icon: "🧅",
    stockKg: 4300,
    tempCelsius: 18.4,
    targetTemp: "15 - 20°C",
    humidityPct: 65,
    targetHumidity: "60 - 70%",
    shelfLifeDays: 24,
    status: "GOOD",
  },
  {
    id: "unit-d",
    name: "Storage Unit D — Seasonings & Spices",
    crop: "Red Chilli Powder & Herbs",
    icon: "🌶️",
    stockKg: 1200,
    tempCelsius: 16.0,
    targetTemp: "14 - 18°C",
    humidityPct: 52,
    targetHumidity: "50 - 55%",
    shelfLifeDays: 45,
    status: "GOOD",
  },
];

// Spoilage Batches with 72-hour degradation curves
export const SPOILAGE_BATCHES: SpoilageBatch[] = [
  {
    id: "batch-tom-0234",
    batchCode: "TOM-2024-0234",
    crop: "Tomatoes (Processing Grade A)",
    quantityKg: 3200,
    storageUnit: "Cold Storage Unit B",
    ageDays: 6,
    spoilageEstHours: 31,
    confidencePct: 82,
    riskLevel: "HIGH",
    factors: [
      "Temperature exceeded 10°C threshold 3x today (peak 13.1°C)",
      "Relative humidity dipped to 87% (below 92% baseline)",
      "Batch age (6 days) approaching maximum holding threshold (7 days)",
      "Historical similarity: Batch TOM-2024-0198 spoiled in 28 hrs under identical thermal curve",
    ],
    recommendation:
      "Prioritize this batch for processing today. Estimated 2,800 kg can be salvaged if processed within next 8 hours for Ketchup Line 2.",
    salvageableKg: 2800,
    degradationCurve: [
      { hour: 0, quality: 78, threshold: 45 },
      { hour: 6, quality: 72, threshold: 45 },
      { hour: 12, quality: 64, threshold: 45 },
      { hour: 18, quality: 57, threshold: 45 },
      { hour: 24, quality: 50, threshold: 45 },
      { hour: 31, quality: 44, threshold: 45 }, // crosses threshold
      { hour: 48, quality: 28, threshold: 45 },
      { hour: 72, quality: 10, threshold: 45 },
    ],
  },
  {
    id: "batch-pot-1182",
    batchCode: "POT-2024-1182",
    crop: "Potatoes (Chipsona Line 1)",
    quantityKg: 6400,
    storageUnit: "Cold Storage Unit A",
    ageDays: 12,
    spoilageEstHours: 94,
    confidencePct: 76,
    riskLevel: "MEDIUM",
    factors: [
      "Slight condensation detected in sub-quadrant A3",
      "Sugar conversion rate within 1.2x of threshold for crisping",
    ],
    recommendation:
      "Queue for processing within 48-72 hours. Blend with fresh harvest batch POT-2024-1205 to maintain starch profile.",
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
    id: "batch-oni-0941",
    batchCode: "ONI-2024-0941",
    crop: "Red Onions (Powder / Paste)",
    quantityKg: 4300,
    storageUnit: "Storage Unit C",
    ageDays: 14,
    spoilageEstHours: 168,
    confidencePct: 91,
    riskLevel: "LOW",
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
];

// Factory Machine Health Records
export const MACHINE_HEALTH: MachineHealthRecord[] = [
  {
    id: "mach-1",
    machineId: "PM-03",
    name: "Industrial Peeling Machine",
    status: "CHECK_REQUIRED",
    efficiencyPct: 82,
    normalRange: "95 - 97%",
    anomalyDetected: true,
    anomalyTitle: "Excessive Peel Thickness & Yield Drop",
    currentValue: "Peel thickness: 2.8mm",
    expectedValue: "Expected: 1.4 - 1.6mm",
    lossRatePerHour: "+6% loss per hour",
    estimatedExtraWasteKgPerHour: 180,
    possibleCause:
      "Blade alignment off-center on Rotary Drum #2 or dull abrasive lining.",
    note: "This is a predictive anomaly flag for preventative inspection, not a confirmed catastrophic fault.",
    assignedTechnician: "Rajesh Kumar (Senior Line Mechanic)",
    trend: [96, 95, 94, 91, 86, 82],
  },
  {
    id: "mach-2",
    machineId: "SL-02",
    name: "Centrifugal Slicing Unit",
    status: "OPTIMAL",
    efficiencyPct: 96.5,
    normalRange: "95 - 98%",
    anomalyDetected: false,
    trend: [96, 96, 97, 96, 97, 96.5],
  },
  {
    id: "mach-3",
    machineId: "FY-01",
    name: "Continuous Multi-Zone Fryer",
    status: "OPTIMAL",
    efficiencyPct: 94.8,
    normalRange: "93 - 96%",
    anomalyDetected: false,
    trend: [94, 95, 95, 94, 95, 94.8],
  },
  {
    id: "mach-4",
    machineId: "PK-04",
    name: "Nitrogen Flush Packaging Line",
    status: "OPTIMAL",
    efficiencyPct: 98.2,
    normalRange: "96 - 99%",
    anomalyDetected: false,
    trend: [98, 98, 99, 98, 98, 98.2],
  },
  {
    id: "mach-5",
    machineId: "SR-05",
    name: "Optical Defect Sorting Robot",
    status: "WARNING",
    efficiencyPct: 89.1,
    normalRange: "92 - 97%",
    anomalyDetected: true,
    anomalyTitle: "Optical Sensor Dust Accumulation",
    currentValue: "Spectral clarity: 79%",
    expectedValue: "Target: >90%",
    lossRatePerHour: "+1.8% false reject",
    estimatedExtraWasteKgPerHour: 45,
    possibleCause: "Steam vapor residue on camera lens hood.",
    note: "Clean aperture during 3:00 PM shift changeover.",
    trend: [95, 94, 92, 91, 89.1],
  },
  {
    id: "mach-6",
    machineId: "BL-01",
    name: "Hydro-Thermal Blanching Unit",
    status: "OPTIMAL",
    efficiencyPct: 95.0,
    normalRange: "94 - 97%",
    anomalyDetected: false,
    trend: [95, 95, 94, 95, 95.0],
  },
];

// ESG Sustainability Data
export const ESG_DATA = {
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
};

// Initial Notifications (with real timestamps)
export const INITIAL_NOTIFICATIONS: NotificationAlert[] = [
  {
    id: "notif-1",
    title: "Urgent Batch Spoilage Warning",
    message: "Batch TOM-2024-0234 (Tomatoes, 3,200 kg) requires priority processing within 8 hours to salvage 2,800 kg.",
    time: "10m ago",
    createdAt: Date.now() - 10 * 60 * 1000,
    severity: "urgent",
    category: "Factory",
    actionLabel: "Prioritize Batch",
    actionUrl: "/factory/spoilage",
    read: false,
  },
  {
    id: "notif-2",
    title: "AI Demand Recommendation Updated",
    message: "Tomorrow's lunch recommended at 863 meals (was 891). 28 meal buffer reduction suggested.",
    time: "25m ago",
    createdAt: Date.now() - 25 * 60 * 1000,
    severity: "warning",
    category: "Kitchen",
    actionLabel: "Review Forecast",
    actionUrl: "/kitchen/prediction",
    read: false,
  },
  {
    id: "notif-3",
    title: "Surplus Matched: Aasha Shelter",
    message: "60 kg Lunch surplus successfully matched with Aasha Shelter. Driver dispatched, ETA 18 mins.",
    time: "42m ago",
    createdAt: Date.now() - 42 * 60 * 1000,
    severity: "success",
    category: "Redistribution",
    actionLabel: "Track Delivery",
    actionUrl: "/kitchen/routes",
    read: false,
  },
  {
    id: "notif-4",
    title: "Machine Anomaly Flag: Peeling Drum PM-03",
    message: "Peel thickness exceeds threshold by 1.2mm (+6% loss rate). Preventative blade check recommended.",
    time: "1h ago",
    createdAt: Date.now() - 65 * 60 * 1000,
    severity: "warning",
    category: "IoT",
    actionLabel: "View Telemetry",
    actionUrl: "/factory/machines",
    read: true,
  },
];
