/**
 * Environment Configuration
 * 
 * Centralized environment variables with type safety.
 */

type Environment = 'development' | 'preview' | 'production';

export const ENV = {
  // Current environment
  environment: (process.env.EXPO_PUBLIC_ENV || 'development') as Environment,
  
  // Convex
  convexUrl: process.env.EXPO_PUBLIC_CONVEX_URL!,

  // Better Auth
  betterAuthUrl: process.env.EXPO_PUBLIC_BETTER_AUTH_URL || "",
  betterAuthAudience: process.env.EXPO_PUBLIC_BETTER_AUTH_AUDIENCE || "convex",
  
  // Computed values
  isDevelopment: (process.env.EXPO_PUBLIC_ENV || 'development') === 'development',
  isProduction: process.env.EXPO_PUBLIC_ENV === 'production',
  isPreview: process.env.EXPO_PUBLIC_ENV === 'preview',
};

