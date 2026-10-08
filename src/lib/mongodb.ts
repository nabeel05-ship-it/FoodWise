import { MongoClient, Db, MongoClientOptions } from "mongodb";

/**
 * MongoDB Connection Utility for Next.js / Serverless
 * 
 * - Server-side only
 * - Connection pooling with reuse across hot-reloads (dev) and requests (prod)
 * - Safe credential handling (zero browser exposure)
 * - Graceful error when MONGODB_URI is not configured
 */

const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let clientPromise: Promise<MongoClient> | null = null;

// Extend globalThis in development to prevent multiple connection pools during HMR
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
 * Retrieves the cached MongoClient promise
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

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(currentUri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      const client = new MongoClient(currentUri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

/**
 * Retrieves the MongoDB database instance.
 * Uses the database name from the connection URI, or MONGODB_DB_NAME, or default 'foodwise'.
 */
export async function getDatabase(dbName?: string): Promise<Db> {
  const client = await getMongoClientPromise();
  const targetDb = dbName || process.env.MONGODB_DB_NAME || undefined;
  return client.db(targetDb);
}
