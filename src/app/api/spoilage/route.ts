import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET all spoilage batches
export async function GET() {
  try {
    const db = await getDb();
    const batches = await db.collection("spoilage_batches").find({}).toArray();
    return NextResponse.json({ success: true, data: batches });
  } catch (error) {
    console.error("Spoilage batches GET error:", error);
    return NextResponse.json({ error: "Failed to fetch spoilage batches" }, { status: 500 });
  }
}

// PATCH — prioritize a batch
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();

    if (!body.batchCode) {
      return NextResponse.json({ error: "batchCode is required" }, { status: 400 });
    }

    const updateFields: Record<string, unknown> = {};
    if (body.prioritized !== undefined) updateFields.prioritized = body.prioritized;
    if (body.status !== undefined) updateFields.status = body.status;

    await db.collection("spoilage_batches").updateOne(
      { batchCode: body.batchCode },
      { $set: updateFields }
    );

    // Create notification
    if (body.prioritized) {
      await db.collection("notifications").insertOne({
        notifId: `notif-${Date.now()}`,
        title: `Batch ${body.batchCode} Prioritized`,
        message: "Batch moved to Front of Line for processing. Production rerouted to maximize salvage.",
        time: "Just now",
        severity: "success",
        category: "Factory",
        read: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, message: "Batch updated" });
  } catch (error) {
    console.error("Spoilage batches PATCH error:", error);
    return NextResponse.json({ error: "Failed to update batch" }, { status: 500 });
  }
}
