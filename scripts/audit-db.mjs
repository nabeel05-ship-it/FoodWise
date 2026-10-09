import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

// Load .env.local
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

console.log("🔍 Connecting to MongoDB...");
const client = new MongoClient(mongoUri);

function isValidCoord(lat, lng) {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

async function runAudit() {
  try {
    await client.connect();
    const db = client.db();
    console.log(`✅ Connected successfully to database: "${db.databaseName}"\n`);

    const collectionsToCheck = [
      "donations",
      "donors",
      "ngos",
      "pickups",
      "pickup_history",
      "quality_reports",
      "notifications",
      "complaints",
      "feedback"
    ];

    for (const colName of collectionsToCheck) {
      const col = db.collection(colName);
      const count = await col.countDocuments();
      console.log(`📦 Collection [${colName}]: ${count} documents`);

      if (count > 0) {
        const sampleDocs = await col.find({}).limit(5).toArray();
        const idCounts = {};
        let duplicateCount = 0;
        let coordCheckCount = 0;
        let invalidCoords = 0;

        const allDocs = await col.find({}).toArray();
        for (const doc of allDocs) {
          if (doc.id) {
            idCounts[doc.id] = (idCounts[doc.id] || 0) + 1;
            if (idCounts[doc.id] > 1) duplicateCount++;
          }
          if ("lat" in doc || "lng" in doc) {
            coordCheckCount++;
            if (!isValidCoord(doc.lat, doc.lng)) {
              invalidCoords++;
              console.warn(`  ⚠️ Invalid coordinate in ${colName} (id: ${doc.id}): lat=${doc.lat}, lng=${doc.lng}`);
            }
          }
        }

        console.log(`  - Duplicate IDs: ${duplicateCount}`);
        if (coordCheckCount > 0) {
          console.log(`  - Geographic records: ${coordCheckCount} checked, ${invalidCoords} invalid`);
        }
      }
      console.log("");
    }

    console.log("✅ Audit script completed.");
  } catch (err) {
    console.error("❌ Audit failed:", err.message);
  } finally {
    await client.close();
  }
}

runAudit();
