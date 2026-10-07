import { NextResponse } from "next/server";
import {
  getDonations,
  createDonation,
  updateDonation,
  createNotification,
} from "@/lib/dataService";

// GET all surplus items
export async function GET() {
  try {
    const items = await getDonations();
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
    const item = await createDonation({
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
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Surplus POST error:", error);
    return NextResponse.json({ error: "Failed to create surplus item" }, { status: 500 });
  }
}

// PATCH — update surplus item (e.g. matched with NGO, status update)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || body.surplusId;

    if (!id) {
      return NextResponse.json({ error: "Donation ID is required" }, { status: 400 });
    }

    const updated = await updateDonation(id, {
      status: body.status,
      acceptedBy: body.matchedNgo || body.acceptedBy,
    });

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
    console.error("Surplus PATCH error:", error);
    return NextResponse.json({ error: "Failed to update surplus item" }, { status: 500 });
  }
}
