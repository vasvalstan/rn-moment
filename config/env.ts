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
  
  // Clerk
  clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 
    'pk_test_c3dlZXBpbmctZ2xpZGVyLTQwLmNsZXJrLmFjY291bnRzLmRldiQ',
  
  // Computed values
  isDevelopment: (process.env.EXPO_PUBLIC_ENV || 'development') === 'development',
  isProduction: process.env.EXPO_PUBLIC_ENV === 'production',
  isPreview: process.env.EXPO_PUBLIC_ENV === 'preview',
};

// Clerk domains per environment (for Convex auth config)
export const CLERK_DOMAINS = {
  development: 'https://sweeping-glider-40.clerk.accounts.dev',
  preview: 'https://sweeping-glider-40.clerk.accounts.dev',
  // Production Clerk domain (stillmoment.dev)
  production: 'https://clerk.stillmoment.dev',
};

export function getClerkDomain(): string {
  return CLERK_DOMAINS[ENV.environment] || CLERK_DOMAINS.development;
}

