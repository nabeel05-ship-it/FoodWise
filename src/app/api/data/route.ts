import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET all data for a collection, or specific collection by query param
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get("collection");

    const db = await getDb();

    if (collection) {
      const data = await db.collection(collection).find({}).toArray();
      return NextResponse.json({ success: true, collection, count: data.length, data });
    }

    // Return all key collections
    const [
      institutions,
      demandHistory,
      wasteRecords,
      mealPlans,
      kitchenAlerts,
      predictions,
      surplusItems,
      ngoProfiles,
      routeStops,
      factoryStorage,
      spoilageBatches,
      machines,
      esgData,
      notifications,
      donorHotels,
      donorFeedback,
      complaints,
      managerOverride,
    ] = await Promise.all([
      db.collection("institutions").find({}).toArray(),
      db.collection("demand_history").find({}).toArray(),
      db.collection("waste_records").find({}).toArray(),
      db.collection("meal_plans").find({}).toArray(),
      db.collection("kitchen_alerts").find({}).toArray(),
      db.collection("predictions").find({}).toArray(),
      db.collection("surplus_items").find({}).toArray(),
      db.collection("ngo_profiles").find({}).toArray(),
      db.collection("route_stops").find({}).toArray(),
      db.collection("factory_storage").find({}).toArray(),
      db.collection("spoilage_batches").find({}).toArray(),
      db.collection("machines").find({}).toArray(),
      db.collection("esg_data").find({}).toArray(),
      db.collection("notifications").find({}).sort({ createdAt: -1 }).toArray(),
      db.collection("donor_hotels").find({}).toArray(),
      db.collection("donor_feedback").find({}).sort({ createdAt: -1 }).toArray(),
      db.collection("complaints").find({}).sort({ createdAt: -1 }).toArray(),
      db.collection("manager_overrides").findOne({ active: true }, { sort: { createdAt: -1 } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        institutions,
        demandHistory,
        wasteRecords,
        mealPlans,
        kitchenAlerts,
        predictions,
        surplusItems,
        ngoProfiles,
        routeStops,
        factoryStorage,
        spoilageBatches,
        machines,
        esgData: esgData[0] || null,
        notifications,
        donorHotels,
        donorFeedback,
        complaints,
        managerOverride: managerOverride
          ? {
              meals: managerOverride.meals,
              reason: managerOverride.reason,
              active: managerOverride.active ?? true,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Database GET error:", error);
    return NextResponse.json({ error: "Failed to fetch data from database" }, { status: 500 });
  }
}
