import { MongoClient, Db, MongoClientOptions } from "mongodb";
import dns from "dns/promises";

/**
 * MongoDB Connection Utility for Next.js / Serverless
 * 
 * - Server-side only
 * - Connection pooling with reuse across hot-reloads (dev) and requests (prod)
 * - Error recovery: resets failed promise so subsequent requests can retry
 * - Safe credential handling (zero browser exposure)
 * - Safe database resolution (defaults to 'foodwise' instead of 'test')
 */

const options: MongoClientOptions = {
  maxPoolSize: 5, // Keep modest in serverless to prevent connection exhaustion across concurrent lambdas
  minPoolSize: 0,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

// Extend globalThis in development & production serverless to prevent duplicate connection pools
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * Check if MONGODB_URI is configured without throwing
 */
export function isMongoConfigured(): boolean {
  if (typeof window !== "undefined") {
    return false;
  }
  const uri = process.env.MONGODB_URI;
  return Boolean(uri && uri.trim().length > 0);
}

/**
 * Retrieves the cached MongoClient promise with automatic error recovery
 */
export function getMongoClientPromise(): Promise<MongoClient> {
  if (typeof window !== "undefined") {
    throw new Error("MongoDB connection must only be used on the server.");
  }

  const currentUri = process.env.MONGODB_URI;
  if (!currentUri || !currentUri.trim()) {
    throw new Error(
      "MONGODB_URI is not configured. Please define MONGODB_URI in your environment or .env.local file."
    );
  }

  if (!global._mongoClientPromise) {
    const client = new MongoClient(currentUri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      // Clear failed promise so subsequent requests can retry rather than caching the rejection
      global._mongoClientPromise = undefined;
      throw err;
    });
  }

  return global._mongoClientPromise;
}

/**
 * Retrieves the MongoDB database instance.
 * Uses target dbName, or MONGODB_DB_NAME, or database from URI, or default 'foodwise'.
 */
export async function getDatabase(dbName?: string): Promise<Db> {
  const client = await getMongoClientPromise();
  const uriDbName = client.options?.dbName && client.options.dbName !== "test" ? client.options.dbName : undefined;
  const targetDb = dbName || process.env.MONGODB_DB_NAME || uriDbName || "foodwise";
  return client.db(targetDb);
}

export interface MongoDiagnosticReport {
  errorName?: string;
  errorMessage?: string;
  hostDomain?: string;
  dnsResolution?: "success" | "failed" | "skipped";
  dnsError?: string;
  resolvedNodesCount?: number;
  hasDatabaseSpecified?: boolean;
  databaseName?: string;
  credentialEncodingIssue?: boolean;
  recommendedAction?: string;
}

/**
 * Safely inspects the MongoDB configuration and error state without exposing secrets
 */
export async function diagnoseMongoConnection(err?: Error): Promise<MongoDiagnosticReport> {
  const rawUri = process.env.MONGODB_URI || "";
  const report: MongoDiagnosticReport = {};

  if (err) {
    report.errorName = err.name;
    report.errorMessage = err.message.replace(/mongodb(?:\+srv)?:\/\/[^@]+@/g, "mongodb+srv://[REDACTED]@");
  }

  if (!rawUri.trim()) {
    report.recommendedAction = "Configure MONGODB_URI in Vercel project environment variables.";
    return report;
  }

  // Check for unencoded special characters in credentials
  const atCount = (rawUri.match(/@/g) || []).length;
  if (atCount > 1) {
    report.credentialEncodingIssue = true;
  }

  // Safely extract hostname
  try {
    const hostMatch = rawUri.match(/@([^/?#]+)/);
    if (hostMatch) {
      report.hostDomain = hostMatch[1];
    }
  } catch {
    // ignore
  }

  // Check if database name is in the URI path
  try {
    const afterAt = rawUri.split("@")[1] || "";
    const slashIdx = afterAt.indexOf("/");
    if (slashIdx !== -1) {
      const pathAndQuery = afterAt.substring(slashIdx);
      const pathOnly = pathAndQuery.split("?")[0].replace(/^\//, "");
      if (pathOnly && pathOnly.length > 0) {
        report.hasDatabaseSpecified = true;
        report.databaseName = pathOnly;
      } else {
        report.hasDatabaseSpecified = false;
        report.databaseName = process.env.MONGODB_DB_NAME || "foodwise";
      }
    } else {
      report.hasDatabaseSpecified = false;
      report.databaseName = process.env.MONGODB_DB_NAME || "foodwise";
    }
  } catch {
    // ignore
  }

  // Check DNS resolution for Atlas SRV
  if (report.hostDomain && rawUri.startsWith("mongodb+srv://")) {
    try {
      const records = await dns.resolveSrv(`_mongodb._tcp.${report.hostDomain}`);
      report.dnsResolution = "success";
      report.resolvedNodesCount = records.length;
    } catch (dnsErr) {
      report.dnsResolution = "failed";
      report.dnsError = (dnsErr as Error).message;
    }
  } else {
    report.dnsResolution = "skipped";
  }

  // Recommend specific action based on findings
  if (report.dnsResolution === "failed") {
    report.recommendedAction = `Atlas cluster domain (${report.hostDomain}) could not be resolved via DNS. Check cluster address in MONGODB_URI.`;
  } else if (report.credentialEncodingIssue) {
    report.recommendedAction = "Password in MONGODB_URI appears to contain an unencoded '@' character. URL-encode it as '%40'.";
  } else if (err?.message?.includes("SSL alert number 80") || err?.message?.includes("tlsv1 alert internal error")) {
    report.recommendedAction = "MongoDB Atlas rejected the TLS handshake (SSL alert 80). In MongoDB Atlas Dashboard > Network Access, add IP '0.0.0.0/0' (Allow access from anywhere). Vercel serverless functions connect from dynamic AWS IPs and will be blocked without this entry.";
  } else if (err?.message?.includes("Authentication failed") || err?.message?.includes("bad auth")) {
    report.recommendedAction = "Authentication failed. Check database username and password in MONGODB_URI.";
  } else {
    report.recommendedAction = "Check MongoDB Atlas Network Access (0.0.0.0/0) and MONGODB_URI configuration.";
  }

  return report;
}
