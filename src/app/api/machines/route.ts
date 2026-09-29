import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET all machines
export async function GET() {
  try {
    const db = await getDb();
    const machines = await db.collection("machines").find({}).toArray();
    return NextResponse.json({ success: true, data: machines });
  } catch (error) {
    console.error("Machines GET error:", error);
    return NextResponse.json({ error: "Failed to fetch machines" }, { status: 500 });
  }
}

// PATCH — update machine (e.g. assign technician)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();

    if (!body.machineId) {
      return NextResponse.json({ error: "machineId is required" }, { status: 400 });
    }

    const updateFields: Record<string, unknown> = {};
    if (body.assignedTechnician !== undefined) updateFields.assignedTechnician = body.assignedTechnician;
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.anomalyDetected !== undefined) updateFields.anomalyDetected = body.anomalyDetected;

    await db.collection("machines").updateOne(
      { machineId: body.machineId },
      { $set: updateFields }
    );

    // Create notification if technician assigned
    if (body.assignedTechnician) {
      await db.collection("notifications").insertOne({
        notifId: `notif-${Date.now()}`,
        title: `Technician Dispatched for ${body.machineId}`,
        message: `Work Order assigned to ${body.assignedTechnician}. Inspection scheduled at next shift change.`,
        time: "Just now",
        severity: "info",
        category: "IoT",
        read: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, message: "Machine updated" });
  } catch (error) {
    console.error("Machines PATCH error:", error);
    return NextResponse.json({ error: "Failed to update machine" }, { status: 500 });
  }
}
