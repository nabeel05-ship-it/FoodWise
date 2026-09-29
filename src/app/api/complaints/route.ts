import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET all complaints
export async function GET() {
  try {
    const db = await getDb();
    const complaints = await db.collection("complaints").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: complaints });
  } catch (error) {
    console.error("Complaints GET error:", error);
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
  }
}

// POST a new complaint
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();

    const ticketRef = `FW-SUPPORT-2026-${Math.floor(80000 + Math.random() * 10000)}`;

    const complaint = {
      complaintId: `cmp-${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      establishment: body.establishment,
      location: body.location,
      category: body.category,
      severity: body.severity || "High",
      status: "Under Review by Admin",
      ticketRef,
      fssaiRef: ticketRef, // backwards compatibility
      description: body.description,
      contactPhone: body.contactPhone,
      hasImage: body.hasImage || false,
      adminAssigned: "FoodWise Incident Ops Desk",
      resolutionEta: "Within 30 mins",
      createdAt: new Date(),
    };

    await db.collection("complaints").insertOne(complaint);
    return NextResponse.json({ success: true, data: complaint, ticketRef, fssaiRef: ticketRef });
  } catch (error) {
    console.error("Complaints POST error:", error);
    return NextResponse.json({ error: "Failed to create complaint" }, { status: 500 });
  }
}

// PATCH — update complaint status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();

    if (!body.complaintId) {
      return NextResponse.json({ error: "complaintId is required" }, { status: 400 });
    }

    await db.collection("complaints").updateOne(
      { complaintId: body.complaintId },
      { $set: { status: body.status } }
    );

    return NextResponse.json({ success: true, message: "Complaint updated" });
  } catch (error) {
    console.error("Complaints PATCH error:", error);
    return NextResponse.json({ error: "Failed to update complaint" }, { status: 500 });
  }
}
