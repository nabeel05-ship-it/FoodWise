import { NextResponse } from "next/server";
import { getDonors, updateDonor } from "@/lib/dataService";

// GET all donor entities
export async function GET() {
  try {
    const donors = await getDonors();
    return NextResponse.json({ success: true, data: donors });
  } catch (error) {
    console.error("Donors GET error:", error);
    return NextResponse.json({ error: "Failed to fetch donors" }, { status: 500 });
  }
}

// PATCH — update donor points/rating
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.hotelId && !body.donorId) {
      return NextResponse.json({ error: "donorId or hotelId is required" }, { status: 400 });
    }

    const id = body.donorId || body.hotelId;
    await updateDonor(id, {
      totalPoints: body.addPoints ? (body.currentPoints || 0) + body.addPoints : undefined,
      avgRating: body.newAvgRating,
    });

    return NextResponse.json({ success: true, message: "Donor updated successfully" });
  } catch (error) {
    console.error("Donors PATCH error:", error);
    return NextResponse.json({ error: "Failed to update donor" }, { status: 500 });
  }
}
