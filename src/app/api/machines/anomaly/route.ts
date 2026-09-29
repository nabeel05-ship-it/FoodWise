import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { machineId = "PM-03", peelThicknessMm = 2.8 } = body;

    const normalThicknessMax = 1.6;
    const isAnomaly = peelThicknessMm > normalThicknessMax;

    const result = {
      machineId,
      status: isAnomaly ? "CHECK_REQUIRED" : "OPTIMAL",
      anomalyDetected: isAnomaly,
      metrics: {
        currentPeelThicknessMm: peelThicknessMm,
        benchmarkMaxMm: normalThicknessMax,
        excessLossRatePerHourPct: isAnomaly ? 6.0 : 0.0,
        estimatedExtraWasteKgPerHour: isAnomaly ? 180 : 0,
      },
      flag: {
        severity: "WARNING",
        probableCause: "Blade alignment off-center on Rotary Drum #2",
        actionRequired: "Preventative inspection during shift changeover",
      },
    };

    // Log anomaly check to MongoDB
    const db = await getDb();
    await db.collection("anomaly_checks_log").insertOne({
      machineId,
      peelThicknessMm,
      isAnomaly,
      result,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json({ error: "Failed to evaluate machinery telemetry" }, { status: 500 });
  }
}
