import { NextResponse } from "next/server";
import { getQualityReports, createQualityReport, updateQualityReport } from "@/lib/dataService";
import type { FoodQualityReport, QualityReportStatus } from "@/lib/types";

const REVIEW_STATUSES: QualityReportStatus[] = ["REPORTED", "UNDER REVIEW", "RESOLVED"];

// GET all food quality reports
export async function GET() {
  try {
    const reports = await getQualityReports();
    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    console.error("Quality reports GET error:", (error as Error).message);
    return NextResponse.json({ error: "Failed to fetch quality reports" }, { status: 500 });
  }
}

// POST a new food quality report
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FoodQualityReport;
    if (!body.id || !body.donationId || !body.issueType || !body.severity) {
      return NextResponse.json({ error: "id, donationId, issueType and severity are required" }, { status: 400 });
    }
    const report = await createQualityReport({ ...body, status: body.status || "REPORTED" });
    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error("Quality reports POST error:", (error as Error).message);
    return NextResponse.json({ error: "Failed to create quality report" }, { status: 500 });
  }
}

// PATCH — move a report through review: REPORTED → UNDER REVIEW → RESOLVED
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !REVIEW_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "id and a valid review status are required" }, { status: 400 });
    }
    const updated = await updateQualityReport(body.id, {
      status: body.status,
      ...(body.statusNote ? { statusNote: String(body.statusNote).slice(0, 500) } : {}),
    });
    if (!updated) {
      return NextResponse.json({ error: "Quality report not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Quality reports PATCH error:", (error as Error).message);
    return NextResponse.json({ error: "Failed to update quality report" }, { status: 500 });
  }
}
