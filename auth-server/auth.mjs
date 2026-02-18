import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { expo } from "@better-auth/expo";
import { Pool } from "pg";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const issuer = process.env.BETTER_AUTH_ISSUER_URL || baseURL;
const audience = process.env.BETTER_AUTH_AUDIENCE || "convex";
const databaseUrl = process.env.DATABASE_URL;

let database;
if (databaseUrl) {
  const useSsl = process.env.DATABASE_SSL !== "false";
  const rejectUnauthorized =
    process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false";
  database = new Pool({
    connectionString: databaseUrl,
    ssl: useSsl ? { rejectUnauthorized } : undefined,
  });
} else if (process.env.NODE_ENV === "production") {
  throw new Error(
    "DATABASE_URL is required in production. Better Auth persistence cannot run without a database."
  );
} else {
  console.warn(
    "DATABASE_URL is not set. Better Auth will use in-memory storage in development only."
  );
}

const socialProviders = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  appName: "Moment",
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database,
  // Faster /get-session lookups with relational databases like Postgres.
  experimental: { joins: true },
  trustedOrigins: [
    "moment://",
    "exp://**",
    "http://localhost:*",
    "https://localhost:*",
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders,
  plugins: [
    expo(),
    jwt({
      jwks: {
        keyPairConfig: {
          alg: "RS256",
        },
      },
      jwt: {
        issuer,
        audience,
        expirationTime: "15m",
      },
    }),
  ],
});
