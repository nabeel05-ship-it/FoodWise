import { NextResponse } from "next/server";
import {
  getScheduledPickups,
  schedulePickup,
  updateScheduledPickup,
  deleteScheduledPickup,
  getPickupHistory,
  createPickupHistory,
} from "@/lib/dataService";

// GET scheduled pickups & delivery history
export async function GET() {
  try {
    const [scheduled, history] = await Promise.all([
      getScheduledPickups(),
      getPickupHistory(),
    ]);
    return NextResponse.json({
      success: true,
      data: {
        scheduledPickups: scheduled,
        pickupHistory: history,
      },
    });
  } catch (error) {
    console.error("Pickups GET error:", (error as Error).message);
    return NextResponse.json({ error: "Failed to fetch pickup records" }, { status: 500 });
  }
}

// POST new scheduled pickup or history item
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.isHistory || body.recipient) {
      const historyItem = await createPickupHistory({
        id: body.id,
        date: body.date || "Just now",
        institution: body.institution,
        food: body.food,
        recipient: body.recipient || body.destination,
        receipt: body.receipt || `FW-RELIEF-${body.otp || Math.floor(1000 + Math.random() * 9000)}`,
        driver: body.driver,
        status: body.status || "Delivered & Verified",
      });
      return NextResponse.json({ success: true, data: historyItem, type: "history" });
    }

    const scheduled = await schedulePickup({
      id: body.id,
      itemId: body.itemId,
      institution: body.institution,
      food: body.food,
      destination: body.destination,
      driver: body.driver,
      phone: body.phone,
      otp: body.otp,
      eta: body.eta || "Arriving in 15 mins",
      status: body.status || "En Route to Kitchen",
      lat: body.lat,
      lng: body.lng,
      quantityKg: body.quantityKg,
      timestamp: body.timestamp || Date.now(),
    });

    return NextResponse.json({ success: true, data: scheduled, type: "scheduled" });
  } catch (error) {
    console.error("Pickups POST error:", (error as Error).message);
    return NextResponse.json({ error: "Failed to save pickup record" }, { status: 500 });
  }
}

// PATCH update scheduled pickup status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Pickup ID is required" }, { status: 400 });
    }
    const updated = await updateScheduledPickup(body.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Pickups PATCH error:", (error as Error).message);
    return NextResponse.json({ error: "Failed to update pickup record" }, { status: 500 });
  }
}

// DELETE remove scheduled pickup
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Pickup ID is required" }, { status: 400 });
    }
    const success = await deleteScheduledPickup(id);
    return NextResponse.json({ success, message: "Scheduled pickup removed" });
  } catch (error) {
    console.error("Pickups DELETE error:", (error as Error).message);
    return NextResponse.json({ error: "Failed to remove pickup record" }, { status: 500 });
  }
}
