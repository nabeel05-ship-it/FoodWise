import { NextResponse } from "next/server";
import { isMongoConfigured, getDatabase, diagnoseMongoConnection, MongoDiagnosticReport } from "@/lib/mongodb";

export async function GET() {
  const mongoConfigured = isMongoConfigured();
  let dbStatus = "unconfigured";
  let pingOk = false;
  let diagnostics: MongoDiagnosticReport | undefined = undefined;

  if (mongoConfigured) {
    try {
      const db = await getDatabase();
      await db.command({ ping: 1 });
      dbStatus = "connected";
      pingOk = true;
      diagnostics = {
        databaseName: db.databaseName,
      };
    } catch (err) {
      dbStatus = "connection_error";
      const error = err as Error;
      console.error("[Health Check] MongoDB ping error:", error.message);
      diagnostics = await diagnoseMongoConnection(error);
    }
  }

  return NextResponse.json({
    success: true,
    status: pingOk || !mongoConfigured ? "healthy" : "degraded",
    database: {
      provider: "mongodb",
      configured: mongoConfigured,
      status: dbStatus,
      ...(diagnostics ? { diagnostics } : {}),
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
