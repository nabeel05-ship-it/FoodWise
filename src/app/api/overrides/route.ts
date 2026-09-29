import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// POST — save manager override for demand prediction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { meals, reason } = body;

    if (!meals || !reason) {
      return NextResponse.json({ error: "meals and reason are required" }, { status: 400 });
    }

    const db = await getDb();

    // Deactivate previous overrides so only the latest is active
    await db.collection("manager_overrides").updateMany({ active: true }, { $set: { active: false } });

    const override = {
      meals: Number(meals),
      reason: String(reason),
      active: true,
      createdAt: new Date(),
    };

    await db.collection("manager_overrides").insertOne(override);

    // Create notification
    await db.collection("notifications").insertOne({
      notifId: `notif-${Date.now()}`,
      title: "Prediction Human Override Applied",
      message: `Manager adjusted target to ${meals} meals (Reason: ${reason}). Model feedback recorded for continuous learning.`,
      time: "Just now",
      severity: "info",
      category: "Kitchen",
      read: false,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, data: override });
  } catch (error) {
    console.error("Override POST error:", error);
    return NextResponse.json({ error: "Failed to save override" }, { status: 500 });
  }
}

// GET — retrieve latest active override
export async function GET() {
  try {
    const db = await getDb();
    const override = await db.collection("manager_overrides").findOne({ active: true }, { sort: { createdAt: -1 } });
    return NextResponse.json({ success: true, data: override || null });
  } catch (error) {
    console.error("Override GET error:", error);
    return NextResponse.json({ error: "Failed to fetch override" }, { status: 500 });
  }
}

// DELETE — deactivate/clear manager overrides
export async function DELETE() {
  try {
    const db = await getDb();
    await db.collection("manager_overrides").updateMany({ active: true }, { $set: { active: false, deactivatedAt: new Date() } });
    return NextResponse.json({ success: true, message: "Overrides deactivated" });
  } catch (error) {
    console.error("Override DELETE error:", error);
    return NextResponse.json({ error: "Failed to clear overrides" }, { status: 500 });
  }
}
