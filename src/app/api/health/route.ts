import { NextResponse } from "next/server";
import { isMongoConfigured, getDatabase } from "@/lib/mongodb";

export async function GET() {
  const mongoConfigured = isMongoConfigured();
  let dbStatus = "unconfigured";
  let pingOk = false;

  if (mongoConfigured) {
    try {
      const db = await getDatabase();
      await db.command({ ping: 1 });
      dbStatus = "connected";
      pingOk = true;
    } catch (err) {
      dbStatus = "connection_error";
      console.error("[Health Check] MongoDB ping error:", (err as Error).message);
    }
  }

  return NextResponse.json({
    success: true,
    status: pingOk || !mongoConfigured ? "healthy" : "degraded",
    database: {
      provider: "mongodb",
      configured: mongoConfigured,
      status: dbStatus,
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
