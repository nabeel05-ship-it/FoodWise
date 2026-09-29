import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET all donor hotels
export async function GET() {
  try {
    const db = await getDb();
    const hotels = await db.collection("donor_hotels").find({}).sort({ totalPoints: -1 }).toArray();
    return NextResponse.json({ success: true, data: hotels });
  } catch (error) {
    console.error("Donors GET error:", error);
    return NextResponse.json({ error: "Failed to fetch donor hotels" }, { status: 500 });
  }
}

// PATCH — update donor hotel points/rating after feedback
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();

    if (!body.hotelId) {
      return NextResponse.json({ error: "hotelId is required" }, { status: 400 });
    }

    const hotel = await db.collection("donor_hotels").findOne({ hotelId: body.hotelId });
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const updateFields: Record<string, unknown> = {};
    if (body.addPoints) {
      updateFields.totalPoints = (hotel.totalPoints || 0) + body.addPoints;
    }
    if (body.newAvgRating !== undefined) {
      updateFields.avgRating = body.newAvgRating;
    }
    if (body.incrementRatings) {
      updateFields.totalRatings = (hotel.totalRatings || 0) + 1;
    }
    updateFields.lastDonation = body.lastDonation || "Just now";

    await db.collection("donor_hotels").updateOne(
      { hotelId: body.hotelId },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true, message: "Donor hotel updated" });
  } catch (error) {
    console.error("Donors PATCH error:", error);
    return NextResponse.json({ error: "Failed to update donor hotel" }, { status: 500 });
  }
}
