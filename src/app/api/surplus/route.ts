import { NextResponse } from "next/server";
import {
  getDonations,
  createDonation,
  updateDonation,
  deleteDonation,
  createNotification,
} from "@/lib/dataService";
import { DonationItem } from "@/lib/types";

// GET all surplus / donation items
export async function GET() {
  try {
    const items = await getDonations();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Surplus GET error:", (error as Error).message);
    return NextResponse.json({ error: "Failed to fetch surplus items" }, { status: 500 });
  }
}

// POST a new surplus / donation item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await createDonation({
      id: body.id,
      donorId: body.donorId || "donor-res-1",
      donorName: body.donorName || body.institution || "Kitchen Partner",
      donorType: body.donorType || "Restaurant",
      foodName: body.foodName || body.item || "Surplus Food",
      foodCategory: body.foodCategory || body.category || "Cooked Meals",
      diet: body.diet || "Vegetarian",
      quantity: body.quantity || `${body.quantityKg || 10} kg`,
      quantityKg: Number(body.quantityKg) || 10,
      servings: Number(body.servings) || 30,
      description: body.description || "Prepared surplus meals.",
      preparationTime: body.preparationTime || body.preparedAt || "Today",
      pickupDeadline: body.pickupDeadline || body.safeUntil || "Today, 8:00 PM",
      location: body.location || "Connaught Place, New Delhi",
      city: body.city || "New Delhi",
      phone: body.phone || "+91 98101 23456",
      foodCondition: body.foodCondition || "Freshly Cooked",
      status: body.status || "AVAILABLE",
      source: body.source,
      reason: body.reason,
      serviceShift: body.serviceShift,
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Surplus POST error:", (error as Error).message);
    return NextResponse.json({ error: "Failed to create surplus item" }, { status: 500 });
  }
}

// PATCH — update surplus item (e.g. matched with NGO, status update, driver dispatch)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || body.surplusId;

    if (!id) {
      return NextResponse.json({ error: "Donation ID is required" }, { status: 400 });
    }

    const updates: Partial<DonationItem> = {};
    if (body.status !== undefined) updates.status = body.status;
    if (body.acceptedBy !== undefined || body.matchedNgo !== undefined) {
      updates.acceptedBy = body.matchedNgo || body.acceptedBy;
    }
    if (body.acceptedAt !== undefined) updates.acceptedAt = body.acceptedAt;
    if (body.completedAt !== undefined) updates.completedAt = body.completedAt;
    if (body.otp !== undefined) updates.otp = body.otp;
    if (body.driverName !== undefined) updates.driverName = body.driverName;
    if (body.driverPhone !== undefined) updates.driverPhone = body.driverPhone;
    if (body.qualityReportId !== undefined) updates.qualityReportId = body.qualityReportId;
    if (body.qualityFlag !== undefined) updates.qualityFlag = body.qualityFlag;
    if (body.foodCondition !== undefined) updates.foodCondition = body.foodCondition;

    const updated = await updateDonation(id, updates);

    if (body.matchedNgo) {
      await createNotification({
        title: "Redistribution Pickup Dispatched",
        message: `Pickup scheduled with ${body.matchedNgo} for donation batch. Driver dispatched.`,
        severity: "success",
        category: "Redistribution",
      });
    }

    return NextResponse.json({ success: true, data: updated, message: "Surplus item updated" });
  } catch (error) {
    console.error("Surplus PATCH error:", (error as Error).message);
    return NextResponse.json({ error: "Failed to update surplus item" }, { status: 500 });
  }
}

// DELETE — remove surplus / donation item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Donation ID is required" }, { status: 400 });
    }
    const success = await deleteDonation(id);
    return NextResponse.json({ success, message: "Donation removed" });
  } catch (error) {
    console.error("Surplus DELETE error:", (error as Error).message);
    return NextResponse.json({ error: "Failed to delete surplus item" }, { status: 500 });
  }
}
