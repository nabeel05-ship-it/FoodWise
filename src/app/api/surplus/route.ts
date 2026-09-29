import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET all surplus items
export async function GET() {
  try {
    const db = await getDb();
    const items = await db.collection("surplus_items").find({}).toArray();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Surplus GET error:", error);
    return NextResponse.json({ error: "Failed to fetch surplus items" }, { status: 500 });
  }
}

// POST a new surplus item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();

    const item = {
      surplusId: `sur-${Date.now()}`,
      item: body.item,
      quantityKg: body.quantityKg,
      preparedAt: body.preparedAt,
      safeUntil: body.safeUntil,
      hoursRemaining: body.hoursRemaining,
      status: body.status || "SAFE",
      prepRecorded: body.prepRecorded ?? true,
      tempCelsius: body.tempCelsius,
      coveredHygienic: body.coveredHygienic ?? true,
      eligible: body.eligible ?? true,
      createdAt: new Date(),
    };

    await db.collection("surplus_items").insertOne(item);
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Surplus POST error:", error);
    return NextResponse.json({ error: "Failed to create surplus item" }, { status: 500 });
  }
}

// PATCH — update surplus item (e.g. match with NGO)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();

    if (!body.surplusId) {
      return NextResponse.json({ error: "surplusId is required" }, { status: 400 });
    }

    const updateFields: Record<string, unknown> = {};
    if (body.matchedNgo !== undefined) updateFields.matchedNgo = body.matchedNgo;
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.pickupStatus !== undefined) updateFields.pickupStatus = body.pickupStatus;

    await db.collection("surplus_items").updateOne(
      { surplusId: body.surplusId },
      { $set: updateFields }
    );

    // Also add a notification for the pickup
    if (body.matchedNgo) {
      const surplus = await db.collection("surplus_items").findOne({ surplusId: body.surplusId });
      await db.collection("notifications").insertOne({
        notifId: `notif-${Date.now()}`,
        title: "Redistribution Pickup Dispatched",
        message: `Pickup scheduled with ${body.matchedNgo} for ${surplus?.item || "Surplus"}. Driver dispatched.`,
        time: "Just now",
        severity: "success",
        category: "Redistribution",
        read: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, message: "Surplus item updated" });
  } catch (error) {
    console.error("Surplus PATCH error:", error);
    return NextResponse.json({ error: "Failed to update surplus item" }, { status: 500 });
  }
}
