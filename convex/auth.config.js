// Clerk authentication configuration for Convex
// Set CLERK_ISSUER_URL in Convex Dashboard for production

export default {
    providers: [
        {
            // Development: https://sweeping-glider-40.clerk.accounts.dev
            // Production: Set CLERK_ISSUER_URL env var in Convex Dashboard
            domain: process.env.CLERK_ISSUER_URL || "https://sweeping-glider-40.clerk.accounts.dev",
            applicationID: "convex",
        },
    ],
};
