import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __fitoraAuthMongoClient: MongoClient | undefined;
}

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/fitora";

const client: MongoClient =
  global.__fitoraAuthMongoClient ??
  new MongoClient(uri, {
    serverSelectionTimeoutMS: 15000,
    maxPoolSize: 10,
  });

if (process.env.NODE_ENV !== "production") {
  global.__fitoraAuthMongoClient = client;
}

const db = client.db("fitora-auth");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    process.env.JWT_SECRET ||
    "fitora_secret_auth_key_2026_super_secure",
  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      preference: {
        type: "string",
        defaultValue: "Maintenance",
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "FITORA_GOOGLE_CLIENT_ID_DEV",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "FITORA_GOOGLE_CLIENT_SECRET_DEV",
    },
  },
});