export default {
    providers: [
        {
            // Better Auth issuer URL (example: https://auth.stillmoment.dev)
            type: "customJwt",
            issuer: process.env.BETTER_AUTH_ISSUER_URL,
            // Better Auth JWKS endpoint (example: https://auth.stillmoment.dev/api/auth/jwks)
            jwks: process.env.BETTER_AUTH_JWKS_URL,
            // Convex currently supports RS256/ES256 for custom JWT providers.
            algorithm: "RS256",
            applicationID: process.env.BETTER_AUTH_AUDIENCE || "convex",
        },
    ],
};
