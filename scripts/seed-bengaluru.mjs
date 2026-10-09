import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

// Load environment from .env.local safely
const envPath = path.resolve(process.cwd(), ".env.local");
let mongoUri = process.env.MONGODB_URI;
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [k, ...v] = trimmed.split("=");
      if (k === "MONGODB_URI") {
        mongoUri = v.join("=").trim().replace(/^["']|["']$/g, "");
      }
    }
  }
}

if (!mongoUri) {
  console.error("❌ MONGODB_URI not found in environment or .env.local");
  process.exit(1);
}

// Verified Bengaluru Reference Data
const BENGALURU_DONORS = [
  {
    id: "donor-res-1",
    name: "Barbeque Nation (Indiranagar)",
    type: "Restaurant / Hotel",
    city: "Indiranagar, Bengaluru",
    address: "4005, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    phone: "+91 98451 23456",
    email: "operations@barbequenation.in",
    contactPerson: "Rajeev Mehra (Buffet Operations Head)",
    verified: true,
    totalDonations: 42,
    totalKgDonated: 640,
    peopleServed: 1850,
    fssaiNumber: "FSSAI LIC: 11219004000312",
    lat: 12.9791,
    lng: 77.6405,
    locationDetails: {
      address: "4005, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9791,
      longitude: 77.6405,
      source: "FoodWise Verified Food Establishment",
      verified: true,
    },
    dataMode: "DEMO",
    isRealBusinessReference: true,
  },
  {
    id: "donor-hot-1",
    name: "The Oberoi, Bengaluru",
    type: "Restaurant / Hotel",
    city: "MG Road, Bengaluru",
    address: "37-39, MG Road, Yellappa Garden, Sivanchetti Gardens, Bengaluru, Karnataka 560001",
    phone: "+91 80 2558 5858",
    email: "banquets@oberoibangalore.com",
    contactPerson: "Suresh Rao (Banquet Operations Manager)",
    verified: true,
    totalDonations: 68,
    totalKgDonated: 1120,
    peopleServed: 3400,
    fssaiNumber: "FSSAI LIC: 11220005001290",
    lat: 12.9733,
    lng: 77.6198,
    locationDetails: {
      address: "37-39, MG Road, Yellappa Garden, Sivanchetti Gardens, Bengaluru, Karnataka 560001",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9733,
      longitude: 77.6198,
      source: "FoodWise Verified Food Establishment",
      verified: true,
    },
    dataMode: "DEMO",
    isRealBusinessReference: true,
  },
  {
    id: "donor-house-1",
    name: "Hegde Family Residence (Demo Account)",
    type: "Household",
    city: "Jayanagar, Bengaluru",
    address: "9th Main Road, 4th Block East, Jayanagar, Bengaluru, Karnataka 560011",
    phone: "+91 99112 34987",
    email: "hegde.family@bengaluru.in",
    contactPerson: "Dr. Ananya Hegde",
    verified: false,
    totalDonations: 4,
    totalKgDonated: 9.5,
    peopleServed: 24,
    lat: 12.9272,
    lng: 77.5841,
    locationDetails: {
      address: "9th Main Road, 4th Block East, Jayanagar, Bengaluru, Karnataka 560011",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9272,
      longitude: 77.5841,
      source: "Residential Demonstration Sector",
      verified: false,
    },
    dataMode: "DEMO",
    isRealBusinessReference: false,
  },
  {
    id: "donor-res-2",
    name: "Empire Restaurant (Koramangala)",
    type: "Restaurant / Hotel",
    city: "Koramangala, Bengaluru",
    address: "103, Industrial Layout, 5th Block, Koramangala, Bengaluru, Karnataka 560095",
    phone: "+91 80 4041 4041",
    email: "koramangala@hotelempire.in",
    contactPerson: "Vikram Sethi (Kitchen Supervisor)",
    verified: true,
    totalDonations: 26,
    totalKgDonated: 380,
    peopleServed: 1100,
    fssaiNumber: "FSSAI LIC: 11221008000672",
    lat: 12.9345,
    lng: 77.6180,
    locationDetails: {
      address: "103, Industrial Layout, 5th Block, Koramangala, Bengaluru, Karnataka 560095",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9345,
      longitude: 77.6180,
      source: "FoodWise Verified Food Establishment",
      verified: true,
    },
    dataMode: "DEMO",
    isRealBusinessReference: true,
  },
  {
    id: "donor-hot-2",
    name: "The Leela Palace Bengaluru",
    type: "Restaurant / Hotel",
    city: "HAL Old Airport Road, Bengaluru",
    address: "23, HAL Old Airport Road, Kodihalli, Bengaluru, Karnataka 560008",
    phone: "+91 80 2521 1234",
    email: "fb.bangalore@theleela.com",
    contactPerson: "Manish K. (Banquet Operations)",
    verified: true,
    totalDonations: 64,
    totalKgDonated: 1800,
    peopleServed: 5200,
    fssaiNumber: "FSSAI LIC: 11218003000841",
    lat: 12.9606,
    lng: 77.6484,
    locationDetails: {
      address: "23, HAL Old Airport Road, Kodihalli, Bengaluru, Karnataka 560008",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9606,
      longitude: 77.6484,
      source: "FoodWise Verified Food Establishment",
      verified: true,
    },
    dataMode: "DEMO",
    isRealBusinessReference: true,
  },
  {
    id: "donor-house-2",
    name: "Rao Family Residence (Demo Account)",
    type: "Household",
    city: "Indiranagar, Bengaluru",
    address: "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    phone: "+91 98711 55667",
    email: "meera.rao@gmail.com",
    contactPerson: "Ritu Rao",
    verified: false,
    totalDonations: 3,
    totalKgDonated: 8,
    peopleServed: 22,
    lat: 12.9748,
    lng: 77.6432,
    locationDetails: {
      address: "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9748,
      longitude: 77.6432,
      source: "Residential Demonstration Sector",
      verified: false,
    },
    dataMode: "DEMO",
    isRealBusinessReference: false,
  },
  {
    id: "donor-hot-3",
    name: "Windmills Craftworks",
    type: "Restaurant / Hotel",
    city: "Whitefield, Bengaluru",
    address: "331, Road 5B, EPIP Zone, Whitefield, Bengaluru, Karnataka 560066",
    phone: "+91 88802 33322",
    email: "whitefield@windmills.in",
    contactPerson: "Kavita Nair (Store Manager)",
    verified: true,
    totalDonations: 19,
    totalKgDonated: 520,
    peopleServed: 1500,
    fssaiNumber: "FSSAI LIC: 10017011004388",
    lat: 12.9822,
    lng: 77.7219,
    locationDetails: {
      address: "331, Road 5B, EPIP Zone, Whitefield, Bengaluru, Karnataka 560066",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9822,
      longitude: 77.7219,
      source: "FoodWise Verified Food Establishment",
      verified: true,
    },
    dataMode: "DEMO",
    isRealBusinessReference: true,
  },
  {
    id: "donor-house-3",
    name: "Kamath & Reddy Residence (Demo Account)",
    type: "Household",
    city: "HSR Layout, Bengaluru",
    address: "19th Main Road, Sector 1, HSR Layout, Bengaluru, Karnataka 560102",
    phone: "+91 98109 88123",
    email: "sunil.kamath@gmail.com",
    contactPerson: "Sunil Kamath",
    verified: false,
    totalDonations: 5,
    totalKgDonated: 12,
    peopleServed: 30,
    lat: 12.9092,
    lng: 77.6465,
    locationDetails: {
      address: "19th Main Road, Sector 1, HSR Layout, Bengaluru, Karnataka 560102",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9092,
      longitude: 77.6465,
      source: "Residential Demonstration Sector",
      verified: false,
    },
    dataMode: "DEMO",
    isRealBusinessReference: false,
  },
];

const BENGALURU_NGOS = [
  {
    id: "ngo-1",
    name: "Bangalore Food Bank (Bengaluru Central Hub)",
    city: "Rajajinagar, Bengaluru",
    coverageArea: "Rajajinagar, Malleshwaram, Yeshwanthpur, Central Bengaluru",
    phone: "+91 80 2315 4029",
    email: "relief@bangalorefoodbank.org",
    lead: "Pooja Verma",
    volunteers: 64,
    sheltersServed: 12,
    rating: 4.9,
    verified: true,
    registrationNumber: "NGO-DARPAN-KA-2019-02114",
    address: "5th Main Road, Industrial Suburb, Rajajinagar, Bengaluru, Karnataka 560022",
    lat: 13.0185,
    lng: 77.5452,
    locationDetails: {
      address: "5th Main Road, Industrial Suburb, Rajajinagar, Bengaluru, Karnataka 560022",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 13.0185,
      longitude: 77.5452,
      source: "FoodWise Verified Food Relief Partner",
      verified: true,
    },
    dataMode: "DEMO",
  },
  {
    id: "ngo-2",
    name: "Feeding India (Bengaluru South Chapter)",
    city: "Ashok Nagar / Central Bengaluru",
    coverageArea: "MG Road, Indiranagar, Koramangala, Richmond Town",
    phone: "+91 80 4112 5589",
    email: "bengaluru@feedingindia.org",
    lead: "Prof. S. R. Patil & Team",
    volunteers: 42,
    sheltersServed: 8,
    rating: 4.8,
    verified: true,
    registrationNumber: "KA-SOC-2018-9124",
    address: "Vittal Mallya Road, Ashok Nagar, Bengaluru, Karnataka 560001",
    lat: 12.9698,
    lng: 77.5976,
    locationDetails: {
      address: "Vittal Mallya Road, Ashok Nagar, Bengaluru, Karnataka 560001",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9698,
      longitude: 77.5976,
      source: "FoodWise Verified Relief Chapter",
      verified: true,
    },
    dataMode: "DEMO",
  },
  {
    id: "ngo-3",
    name: "Robin Hood Army (South Bengaluru Hub)",
    city: "Koramangala, Bengaluru",
    coverageArea: "Koramangala, HSR Layout, BTM Layout, Jayanagar",
    phone: "+91 80 2553 7741",
    email: "southblr@robinhoodarmy.com",
    lead: "Manoj Joshi",
    volunteers: 35,
    sheltersServed: 6,
    rating: 4.7,
    verified: true,
    registrationNumber: "NGO-DARPAN-KA-2021-04882",
    address: "6th Block, Koramangala, Bengaluru, Karnataka 560095",
    lat: 12.9324,
    lng: 77.6292,
    locationDetails: {
      address: "6th Block, Koramangala, Bengaluru, Karnataka 560095",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9324,
      longitude: 77.6292,
      source: "FoodWise Verified Community Organization",
      verified: true,
    },
    dataMode: "DEMO",
  },
];

const BENGALURU_DONATIONS = [
  {
    id: "don-01",
    donorId: "donor-res-1",
    donorName: "Barbeque Nation (Indiranagar)",
    donorType: "Restaurant / Hotel",
    foodName: "Vegetable Dum Biryani with Cucumber Raita",
    foodCategory: "Cooked Meals",
    diet: "Vegetarian",
    quantity: "12 kg",
    quantityKg: 12,
    servings: 35,
    description: "Freshly prepared aromatic basmati rice dum biryani cooked for lunch service. Kept in sealed hot containers, pristine hygienic condition.",
    preparationTime: "Today, 1:30 PM",
    pickupDeadline: "Today, 8:30 PM",
    serviceShift: "Lunch Service",
    location: "4005, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    city: "Indiranagar, Bengaluru",
    phone: "+91 98451 23456",
    lat: 12.9791,
    lng: 77.6405,
    locationDetails: {
      address: "4005, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9791,
      longitude: 77.6405,
      source: "FoodWise Verified Food Establishment",
      verified: true,
    },
    dataMode: "DEMO",
    isRealBusinessReference: true,
    foodCondition: "Freshly cooked, hot held (>65°C), ready for immediate consumption.",
    status: "AVAILABLE",
  },
  {
    id: "don-02",
    donorId: "donor-hot-1",
    donorName: "The Oberoi, Bengaluru",
    donorType: "Restaurant / Hotel",
    foodName: "Breakfast Buffet Surplus: Idli, Vada, Sambhar & Kesari Bath",
    foodCategory: "Breakfast Buffet",
    source: "Buffet",
    diet: "Vegetarian",
    quantity: "25 kg",
    quantityKg: 25,
    servings: 75,
    description: "Morning corporate breakfast buffet excess. Kept warm in food-grade thermal containers. Handover from kitchen loading bay.",
    preparationTime: "Today, 11:30 AM",
    pickupDeadline: "Today, 5:30 PM",
    location: "37-39, MG Road, Yellappa Garden, Sivanchetti Gardens, Bengaluru, Karnataka 560001",
    city: "MG Road, Bengaluru",
    phone: "+91 80 2558 5858",
    lat: 12.9733,
    lng: 77.6198,
    locationDetails: {
      address: "37-39, MG Road, Yellappa Garden, Sivanchetti Gardens, Bengaluru, Karnataka 560001",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9733,
      longitude: 77.6198,
      source: "FoodWise Verified Food Establishment",
      verified: true,
    },
    dataMode: "DEMO",
    isRealBusinessReference: true,
    foodCondition: "Pristine buffet surplus, completely untouched, packed hygienically.",
    status: "ACCEPTED",
    acceptedBy: "Bangalore Food Bank (Bengaluru Central Hub)",
    acceptedAt: "Today, 1:15 PM",
    otp: "6482",
    driverName: "Ramesh Kumar (Van KA-04-EA-4492)",
    driverPhone: "+91 98451 34567",
  },
  {
    id: "don-03",
    donorId: "donor-house-1",
    donorName: "Hegde Family Residence (Demo Account)",
    donorType: "Household",
    foodName: "Vegetable Pulao & Moong Dal Tadka",
    foodCategory: "Cooked Home Meal",
    reason: "Normal household surplus",
    diet: "Vegetarian",
    quantity: "2.5 kg",
    quantityKg: 2.5,
    servings: 6,
    description: "Extra fresh home-cooked dinner from today. Packed in clean food-safe airtight containers with lids.",
    preparationTime: "Today, 2:00 PM",
    pickupDeadline: "Today, 8:00 PM",
    location: "9th Main Road, 4th Block East, Jayanagar, Bengaluru, Karnataka 560011",
    city: "Jayanagar, Bengaluru",
    phone: "+91 99112 34987",
    lat: 12.9272,
    lng: 77.5841,
    locationDetails: {
      address: "9th Main Road, 4th Block East, Jayanagar, Bengaluru, Karnataka 560011",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9272,
      longitude: 77.5841,
      source: "Residential Demonstration Sector",
      verified: false,
    },
    dataMode: "DEMO",
    isRealBusinessReference: false,
    foodCondition: "Freshly cooked home food, completely hygienic.",
    status: "AVAILABLE",
  },
  {
    id: "don-04",
    donorId: "donor-res-2",
    donorName: "Empire Restaurant (Koramangala)",
    donorType: "Restaurant / Hotel",
    diet: "Vegetarian",
    foodName: "Paneer Butter Masala, Dal Makhani & 40 Rotis",
    foodCategory: "Cooked Meals",
    serviceShift: "Dinner Service",
    quantity: "16 kg",
    quantityKg: 16,
    servings: 45,
    description: "Dinner batch surplus. High quality paneer curry and rotis packed in commercial disposable food containers.",
    preparationTime: "Today, 3:00 PM",
    pickupDeadline: "Today, 9:30 PM",
    location: "103, Industrial Layout, 5th Block, Koramangala, Bengaluru, Karnataka 560095",
    city: "Koramangala, Bengaluru",
    phone: "+91 80 4041 4041",
    lat: 12.9345,
    lng: 77.6180,
    locationDetails: {
      address: "103, Industrial Layout, 5th Block, Koramangala, Bengaluru, Karnataka 560095",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9345,
      longitude: 77.6180,
      source: "FoodWise Verified Food Establishment",
      verified: true,
    },
    dataMode: "DEMO",
    isRealBusinessReference: true,
    foodCondition: "Sealed hot containers, completely safe.",
    status: "AVAILABLE",
  },
  {
    id: "don-05",
    donorId: "donor-hot-2",
    donorName: "The Leela Palace Bengaluru",
    donorType: "Restaurant / Hotel",
    foodName: "Banquet Dinner Surplus: Shahi Paneer, Pulao & 160 Naans",
    foodCategory: "Banquet / Event Surplus",
    source: "Banquet",
    diet: "Vegetarian",
    quantity: "55 kg",
    quantityKg: 55,
    servings: 160,
    description: "Surplus from an executive corporate dinner. Packed by banquet culinary staff in insulated food carriers.",
    preparationTime: "Yesterday, 8:00 PM",
    pickupDeadline: "Yesterday, 11:00 PM",
    location: "23, HAL Old Airport Road, Kodihalli, Bengaluru, Karnataka 560008",
    city: "HAL Old Airport Road, Bengaluru",
    phone: "+91 80 2521 1234",
    lat: 12.9606,
    lng: 77.6484,
    locationDetails: {
      address: "23, HAL Old Airport Road, Kodihalli, Bengaluru, Karnataka 560008",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9606,
      longitude: 77.6484,
      source: "FoodWise Verified Food Establishment",
      verified: true,
    },
    dataMode: "DEMO",
    isRealBusinessReference: true,
    foodCondition: "Verified by Executive Chef.",
    status: "FLAGGED_FOR_REVIEW",
    acceptedBy: "Feeding India (Bengaluru South Chapter)",
    acceptedAt: "Yesterday, 8:30 PM",
    completedAt: "Yesterday, 10:15 PM",
    otp: "9104",
    driverName: "Satish Pal (E-Loader KA-04-TR-9021)",
    driverPhone: "+91 98455 12345",
    qualityReportId: "fqr-01",
    qualityFlag: {
      issueType: "Unusual smell",
      severity: "MEDIUM",
      reportedAt: "08 Oct 2026",
    },
  },
  {
    id: "don-06",
    donorId: "donor-house-2",
    donorName: "Rao Family Residence (Demo Account)",
    donorType: "Household",
    foodName: "Celebration Dinner: Matar Paneer, Jeera Rice & 15 Chapatis",
    foodCategory: "Cooked Home Meal",
    reason: "Family gathering",
    diet: "Vegetarian",
    quantity: "4.5 kg",
    quantityKg: 4.5,
    servings: 12,
    description: "Surplus from small family birthday dinner. Home cooked with clean ingredients, completely untouched and kept covered.",
    preparationTime: "Yesterday, 7:30 PM",
    pickupDeadline: "Yesterday, 10:30 PM",
    location: "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    city: "Indiranagar, Bengaluru",
    phone: "+91 98711 55667",
    lat: 12.9748,
    lng: 77.6432,
    locationDetails: {
      address: "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9748,
      longitude: 77.6432,
      source: "Residential Demonstration Sector",
      verified: false,
    },
    dataMode: "DEMO",
    isRealBusinessReference: false,
    foodCondition: "Fresh home made dinner.",
    status: "COMPLETED",
    acceptedBy: "Robin Hood Army (South Bengaluru Hub)",
    acceptedAt: "Yesterday, 8:15 PM",
    completedAt: "Yesterday, 9:45 PM",
    otp: "3318",
    driverName: "Vikram Singh",
    driverPhone: "+91 98456 56789",
  },
  {
    id: "don-07",
    donorId: "donor-hot-3",
    donorName: "Windmills Craftworks",
    donorType: "Restaurant / Hotel",
    foodName: "Lunch Service Surplus: Rice & Mixed Veg Curry",
    foodCategory: "Lunch Service",
    source: "Commercial Kitchen",
    diet: "Vegetarian",
    quantity: "20 kg",
    quantityKg: 20,
    servings: 60,
    description: "Afternoon lunch service surplus. Kept hot in commercial insulated chafing warmers. Handover at Service Gate 2.",
    preparationTime: "Today, 2:30 PM",
    pickupDeadline: "Today, 7:00 PM",
    location: "331, Road 5B, EPIP Zone, Whitefield, Bengaluru, Karnataka 560066",
    city: "Whitefield, Bengaluru",
    phone: "+91 88802 33322",
    lat: 12.9822,
    lng: 77.7219,
    locationDetails: {
      address: "331, Road 5B, EPIP Zone, Whitefield, Bengaluru, Karnataka 560066",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9822,
      longitude: 77.7219,
      source: "FoodWise Verified Food Establishment",
      verified: true,
    },
    dataMode: "DEMO",
    isRealBusinessReference: true,
    foodCondition: "Hot held food surplus in pristine condition.",
    status: "AVAILABLE",
  },
  {
    id: "don-08",
    donorId: "donor-house-3",
    donorName: "Kamath & Reddy Residence (Demo Account)",
    donorType: "Household",
    foodName: "Fresh Chapati & Mixed Vegetable Curry",
    foodCategory: "Cooked Home Meal",
    reason: "Normal household surplus",
    diet: "Vegetarian",
    quantity: "2 kg",
    quantityKg: 2,
    servings: 5,
    description: "15 warm chapatis wrapped in silver foil with a bowl of homemade mixed vegetable curry.",
    preparationTime: "Today, 1:45 PM",
    pickupDeadline: "Today, 8:30 PM",
    location: "19th Main Road, Sector 1, HSR Layout, Bengaluru, Karnataka 560102",
    city: "HSR Layout, Bengaluru",
    phone: "+91 98109 88123",
    lat: 12.9092,
    lng: 77.6465,
    locationDetails: {
      address: "19th Main Road, Sector 1, HSR Layout, Bengaluru, Karnataka 560102",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9092,
      longitude: 77.6465,
      source: "Residential Demonstration Sector",
      verified: false,
    },
    dataMode: "DEMO",
    isRealBusinessReference: false,
    foodCondition: "Freshly prepared home meal.",
    status: "AVAILABLE",
  },
];

const BENGALURU_PICKUPS = [
  {
    id: "sched-1",
    itemId: "don-02",
    institution: "The Oberoi, Bengaluru",
    food: "Breakfast Buffet Surplus (25 kg)",
    destination: "Feeding India Logistics Hub, Ashok Nagar, Bengaluru",
    driver: "Ramesh Kumar (Van KA-04-EA-4492)",
    phone: "+91 98451 34567",
    otp: "6482",
    eta: "Arriving at Kitchen in 6 mins",
    status: "En Route to Kitchen",
    lat: 12.9733,
    lng: 77.6198,
    quantityKg: 25,
    dataMode: "DEMO",
  },
  {
    id: "sched-2",
    itemId: "don-01",
    institution: "Barbeque Nation (Indiranagar)",
    food: "Vegetable Biryani & Dal (12 kg)",
    destination: "Bangalore Food Bank Center, Rajajinagar, Bengaluru",
    driver: "Satish Pal (E-Loader KA-04-TR-9021)",
    phone: "+91 98455 12345",
    otp: "4119",
    eta: "Loaded & In Transit to Shelter",
    status: "Delivering to Shelter",
    lat: 12.9791,
    lng: 77.6405,
    quantityKg: 12,
    dataMode: "DEMO",
  },
];

async function seedBengaluru() {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db();
    console.log(` Connected to MongoDB: [${db.databaseName}]`);
    console.log(" Seeding verified Bengaluru reference and demo data...\n");

    // 1. Donors
    const donorsCol = db.collection("donors");
    for (const donor of BENGALURU_DONORS) {
      await donorsCol.updateOne(
        { id: donor.id },
        { $set: donor },
        { upsert: true }
      );
    }
    console.log(` Verified donors upserted: ${BENGALURU_DONORS.length}`);

    // 2. NGOs
    const ngosCol = db.collection("ngos");
    for (const ngo of BENGALURU_NGOS) {
      await ngosCol.updateOne(
        { id: ngo.id },
        { $set: ngo },
        { upsert: true }
      );
    }
    console.log(` Verified NGOs upserted: ${BENGALURU_NGOS.length}`);

    // 3. Demo Donations
    const donationsCol = db.collection("donations");
    for (const don of BENGALURU_DONATIONS) {
      await donationsCol.updateOne(
        { id: don.id },
        {
          $set: don,
          $setOnInsert: { createdAt: Date.now() - 3600000 },
        },
        { upsert: true }
      );
    }
    console.log(` Demo donations upserted: ${BENGALURU_DONATIONS.length}`);

    // 4. Align any user-created donations that still had legacy Shivamogga coordinates
    const userDonations = await donationsCol.find({
      id: { $nin: BENGALURU_DONATIONS.map((d) => d.id) },
    }).toArray();

    let userUpdated = 0;
    for (const uDon of userDonations) {
      // If coordinates are outside Bengaluru bounding box (~12.75 to 13.2, 77.4 to 77.85)
      const lat = uDon.lat;
      const lng = uDon.lng;
      const isOutsideBengaluru =
        typeof lat !== "number" ||
        typeof lng !== "number" ||
        lat < 12.75 ||
        lat > 13.2 ||
        lng < 77.4 ||
        lng > 77.85;

      if (isOutsideBengaluru) {
        await donationsCol.updateOne(
          { _id: uDon._id },
          {
            $set: {
              lat: 12.9716,
              lng: 77.5946,
              city: "Bengaluru",
              "locationDetails.latitude": 12.9716,
              "locationDetails.longitude": 77.5946,
              "locationDetails.city": "Bengaluru",
            },
          }
        );
        userUpdated++;
        console.log(`   Aligned user donation [${uDon.id}] to Bengaluru coordinates.`);
      }
    }
    if (userUpdated > 0) {
      console.log(` User-created donations aligned: ${userUpdated}`);
    }

    // 5. Scheduled Pickups
    const pickupsCol = db.collection("pickups");
    for (const pickup of BENGALURU_PICKUPS) {
      await pickupsCol.updateOne(
        { id: pickup.id },
        {
          $set: pickup,
          $setOnInsert: { timestamp: Date.now() - 900000 },
        },
        { upsert: true }
      );
    }
    console.log(` Scheduled pickups upserted: ${BENGALURU_PICKUPS.length}`);

    // 6. Deduplication check
    const collections = ["donors", "ngos", "donations", "pickups"];
    for (const colName of collections) {
      const col = db.collection(colName);
      const docs = await col.find({}).toArray();
      const seen = new Set();
      const duplicates = [];
      for (const d of docs) {
        if (d.id) {
          if (seen.has(d.id)) {
            duplicates.push(d._id);
          } else {
            seen.add(d.id);
          }
        }
      }
      if (duplicates.length > 0) {
        await col.deleteMany({ _id: { $in: duplicates } });
        console.log(` Purged ${duplicates.length} duplicate docs in [${colName}]`);
      }
    }

    console.log("\n Bengaluru seed & cleanup finished successfully!");
  } catch (err) {
    console.error(" Seed failed:", err.message);
  } finally {
    await client.close();
  }
}

seedBengaluru();
