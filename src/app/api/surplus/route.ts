import { NextResponse } from "next/server";
import {
  getDonations,
  createDonation,
  updateDonation,
  claimDonationAtomic,
  completeDonationAtomic,
  deleteDonation,
  createNotification,
} from "@/lib/dataService";
import { calculateUrgency } from "@/lib/smartMatching";
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

    const foodName = (body.foodName || body.item || "").trim();
    if (!foodName) {
      return NextResponse.json(
        { error: "Food item name is mandatory and cannot be empty" },
        { status: 400 }
      );
    }

    const quantityKg = Number(body.quantityKg);
    if (!quantityKg || isNaN(quantityKg) || quantityKg <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a positive number greater than 0 kg" },
        { status: 400 }
      );
    }

    const pickupDeadline = body.pickupDeadline || body.safeUntil || "Today, 8:00 PM";
    const urgency = calculateUrgency(pickupDeadline);
    if (urgency.isExpired) {
      return NextResponse.json(
        { error: "Collection deadline has already passed. Cannot post expired food." },
        { status: 400 }
      );
    }

    const item = await createDonation({
      id: body.id,
      donorId: body.donorId || "donor-res-1",
      donorName: body.donorName || body.institution || "Kitchen Partner",
      donorType: body.donorType || "Restaurant",
      foodName,
      foodCategory: body.foodCategory || body.category || "Cooked Meals",
      diet: body.diet || "Vegetarian",
      quantity: body.quantity || `${quantityKg} kg`,
      quantityKg,
      servings: Number(body.servings) > 0 ? Number(body.servings) : Math.round(quantityKg * 3),
      description: body.description || "Prepared surplus meals.",
      preparationTime: body.preparationTime || body.preparedAt || "Today",
      pickupDeadline,
      location: body.location || "Indiranagar, Bengaluru",
      city: body.city || "Bengaluru",
      phone: body.phone || "+91 98451 23456",
      contactPerson: body.contactPerson,
      pickupInstructions: body.pickupInstructions,
      storageCondition: body.storageCondition || "Ambient",
      allergens: body.allergens || [],
      lat: typeof body.lat === "number" ? body.lat : (body.locationDetails?.lat ?? 12.9716),
      lng: typeof body.lng === "number" ? body.lng : (body.locationDetails?.lng ?? 77.5946),
      locationDetails: body.locationDetails,
      dataMode: body.dataMode || "DEMO",
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

    // 1. NGO Claim / Acceptance (Enforce atomic concurrency protection)
    if (body.status === "ACCEPTED") {
      const ngoName = body.acceptedBy || body.matchedNgo || "NGO Partner";
      const claimResult = await claimDonationAtomic(id, {
        ngoName,
        driverName: body.driverName,
        driverPhone: body.driverPhone,
        otp: body.otp,
      });

      if (!claimResult.success) {
        return NextResponse.json(
          { error: claimResult.error },
          { status: claimResult.status || 400 }
        );
      }

      await createNotification({
        title: "Redistribution Pickup Dispatched",
        message: `Pickup scheduled with ${ngoName} for donation batch. Authorized volunteer dispatched.`,
        severity: "success",
        category: "Redistribution",
      });

      return NextResponse.json({
        success: true,
        data: claimResult.donation,
        message: "Donation successfully accepted and locked for collection.",
      });
    }

    // 2. NGO Delivery Confirmation (Enforce valid state transition)
    if (body.status === "COMPLETED") {
      const completeResult = await completeDonationAtomic(id, body.completedBy || body.acceptedBy);

      if (!completeResult.success) {
        return NextResponse.json(
          { error: completeResult.error },
          { status: completeResult.status || 400 }
        );
      }

      await createNotification({
        title: "Food Successfully Delivered",
        message: `Donation batch has been delivered to beneficiaries and verified.`,
        severity: "success",
        category: "Redistribution",
      });

      return NextResponse.json({
        success: true,
        data: completeResult.donation,
        message: "Donation successfully delivered and logged.",
      });
    }

    // 3. General Updates (Storage, description, location, quality flags)
    const updates: Partial<DonationItem> = {};
    if (body.status !== undefined) updates.status = body.status;
    if (body.acceptedBy !== undefined) updates.acceptedBy = body.acceptedBy;
    if (body.acceptedAt !== undefined) updates.acceptedAt = body.acceptedAt;
    if (body.completedAt !== undefined) updates.completedAt = body.completedAt;
    if (body.otp !== undefined) updates.otp = body.otp;
    if (body.driverName !== undefined) updates.driverName = body.driverName;
    if (body.driverPhone !== undefined) updates.driverPhone = body.driverPhone;
    if (body.qualityReportId !== undefined) updates.qualityReportId = body.qualityReportId;
    if (body.qualityFlag !== undefined) updates.qualityFlag = body.qualityFlag;
    if (body.foodCondition !== undefined) updates.foodCondition = body.foodCondition;
    if (body.storageCondition !== undefined) updates.storageCondition = body.storageCondition;
    if (body.allergens !== undefined) updates.allergens = body.allergens;
    if (typeof body.lat === "number") updates.lat = body.lat;
    if (typeof body.lng === "number") updates.lng = body.lng;
    if (body.locationDetails !== undefined) updates.locationDetails = body.locationDetails;

    const updated = await updateDonation(id, updates);

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
