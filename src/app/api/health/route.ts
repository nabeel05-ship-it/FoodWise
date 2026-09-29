import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();

    // Ping the database
    const adminDb = db.client.db("admin");
    await adminDb.command({ ping: 1 });

    // Count documents in all collections
    const collections = [
      "institutions", "demand_history", "waste_records", "meal_plans",
      "kitchen_alerts", "predictions", "surplus_items", "ngo_profiles",
      "route_stops", "factory_storage", "spoilage_batches", "machines",
      "esg_data", "notifications", "donor_hotels", "donor_feedback", "complaints",
    ];

    const counts: Record<string, number> = {};
    for (const col of collections) {
      counts[col] = await db.collection(col).countDocuments();
    }

    const totalDocs = Object.values(counts).reduce((sum, c) => sum + c, 0);

    return NextResponse.json({
      success: true,
      status: "connected",
      database: "foodwise",
      cluster: "cluster0.0qcpfne.mongodb.net",
      totalCollections: collections.length,
      totalDocuments: totalDocs,
      collections: counts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { success: false, status: "disconnected", error: String(error) },
      { status: 500 }
    );
  }
}
