/**
 * Feature Flags Configuration
 * 
 * Control which features are available in different environments.
 * Use this to hide experimental features from production.
 */

type Environment = 'development' | 'preview' | 'production';

const ENV = (process.env.EXPO_PUBLIC_ENV || 'development') as Environment;

// Feature flags per environment
const featureFlags: Record<Environment, Record<string, boolean>> = {
  development: {
    // Experimental features enabled in dev
    gyroscopeMeditation: true,
    debugMode: true,
    mockData: true,
    devTools: true,
    analyticsDebug: true,
  },
  preview: {
    // Preview/testing builds
    gyroscopeMeditation: true,
    debugMode: true,
    mockData: false,
    devTools: false,
    analyticsDebug: true,
  },
  production: {
    // Production - only stable features
    gyroscopeMeditation: false, // Hide until ready
    debugMode: false,
    mockData: false,
    devTools: false,
    analyticsDebug: false,
  },
};

/**
 * Check if a feature is enabled in the current environment
 */
export function isFeatureEnabled(feature: keyof typeof featureFlags.development): boolean {
  return featureFlags[ENV]?.[feature] ?? false;
}

/**
 * Get current environment
 */
export function getEnvironment(): Environment {
  return ENV;
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return ENV === 'development';
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return ENV === 'production';
}

// Export individual feature checks for convenience
export const Features = {
  gyroscopeMeditation: () => isFeatureEnabled('gyroscopeMeditation'),
  debugMode: () => isFeatureEnabled('debugMode'),
  mockData: () => isFeatureEnabled('mockData'),
  devTools: () => isFeatureEnabled('devTools'),
  analyticsDebug: () => isFeatureEnabled('analyticsDebug'),
};

