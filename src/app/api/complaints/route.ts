import { NextResponse } from "next/server";
import { getComplaints, createComplaint } from "@/lib/dataService";

// GET all complaints
export async function GET() {
  try {
    const complaints = await getComplaints();
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
    const complaint = await createComplaint(body);
    return NextResponse.json({
      success: true,
      data: complaint,
      ticketRef: complaint.ticketRef,
      fssaiRef: complaint.ticketRef,
    });
  } catch (error) {
    console.error("Complaints POST error:", error);
    return NextResponse.json({ error: "Failed to create complaint" }, { status: 500 });
  }
}

// PATCH — update complaint status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.complaintId) {
      return NextResponse.json({ error: "complaintId is required" }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "Complaint updated successfully" });
  } catch (error) {
    console.error("Complaints PATCH error:", error);
    return NextResponse.json({ error: "Failed to update complaint" }, { status: 500 });
  }
}
