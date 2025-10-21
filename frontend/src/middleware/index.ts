/**
 * Enterprise Middleware Index
 * 
 * Centralized exports for all enterprise middleware following Service-Oriented Architecture (SOA) principles.
 * Organized by concern and responsibility for maximum maintainability and scalability.
 * 
 * @module middleware
 */

// ==========================================
// REDUX MIDDLEWARE
// ==========================================
export * from './redux';

// ==========================================
// HTTP MIDDLEWARE  
// ==========================================
export * from './http';

// ==========================================
// INTEGRATION MIDDLEWARE
// ==========================================
export * from './integration';

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================
export * from './security';

// ==========================================
// MONITORING MIDDLEWARE
// ==========================================
export * from './monitoring';

// ==========================================
// MIDDLEWARE FACTORY
// ==========================================

import { Middleware, configureStore } from '@reduxjs/toolkit';
import { createStateSyncMiddleware } from './redux';
import { createHttpMonitoringMiddleware } from './http';
import { createServiceIntegrationMiddleware, createCacheSyncMiddleware } from './integration';
import { 
  createAuthMiddleware, 
  createAuthorizationMiddleware, 
  createSecurityMonitoringMiddleware 
} from './security';
import {
  createPerformanceMonitoringMiddleware,
  createErrorTrackingMiddleware,
  createAnalyticsMiddleware,
  createHealthMonitoringMiddleware
} from './monitoring';
import type { SecurityPolicy } from './security';
import type { QueryClient } from '@tanstack/react-query';

/**
 * Middleware configuration options
 */
export interface MiddlewareConfig {
  // Redux State Sync
  enableStateSync?: boolean;
  stateSyncConfig?: any;

  // HTTP
  enableHttpMonitoring?: boolean;

  // Integration
  enableServiceIntegration?: boolean;
  enableCacheSync?: boolean;
  queryClient?: QueryClient;

  // Security
  enableAuth?: boolean;
  enableAuthorization?: boolean;
  enableSecurityMonitoring?: boolean;
  securityPolicy?: Partial<SecurityPolicy>;

  // Monitoring
  enablePerformanceMonitoring?: boolean;
  enableErrorTracking?: boolean;
  enableAnalytics?: boolean;
  enableHealthMonitoring?: boolean;

  // Development
  isDevelopment?: boolean;
}

/**
 * Enterprise middleware factory
 * Creates a complete middleware stack following SOA principles
 */
export function createEnterpriseMiddleware(config: MiddlewareConfig = {}): Middleware[] {
  const middleware: Middleware[] = [];

  // Redux State Synchronization
  if (config.enableStateSync !== false) {
    const stateSyncMiddleware = createStateSyncMiddleware(config.stateSyncConfig || {});
    middleware.push(stateSyncMiddleware as Middleware);
  }

  // HTTP Monitoring
  if (config.enableHttpMonitoring !== false) {
    middleware.push(createHttpMonitoringMiddleware());
  }

  // Service Integration
  if (config.enableServiceIntegration !== false) {
    middleware.push(createServiceIntegrationMiddleware());
  }

  // Cache Synchronization (requires QueryClient)
  if (config.enableCacheSync && config.queryClient) {
    middleware.push(createCacheSyncMiddleware(config.queryClient));
  }

  // Security Middleware
  if (config.enableAuth !== false) {
    middleware.push(createAuthMiddleware(config.securityPolicy));
  }

  if (config.enableAuthorization !== false) {
    middleware.push(createAuthorizationMiddleware());
  }

  if (config.enableSecurityMonitoring !== false) {
    middleware.push(createSecurityMonitoringMiddleware());
  }

  // Monitoring Middleware
  if (config.enablePerformanceMonitoring !== false) {
    middleware.push(createPerformanceMonitoringMiddleware());
  }

  if (config.enableErrorTracking !== false) {
    middleware.push(createErrorTrackingMiddleware());
  }

  if (config.enableAnalytics !== false) {
    middleware.push(createAnalyticsMiddleware());
  }

  if (config.enableHealthMonitoring !== false) {
    middleware.push(createHealthMonitoringMiddleware());
  }

  return middleware;
}

/**
 * Pre-configured middleware sets for different environments
 */
export const middlewarePresets = {
  /**
   * Development middleware stack
   */
  development: (config: Partial<MiddlewareConfig> = {}): Middleware[] => {
    return createEnterpriseMiddleware({
      enableStateSync: true,
      enableHttpMonitoring: true,
      enableServiceIntegration: true,
      enableAuth: true,
      enableAuthorization: true,
      enableSecurityMonitoring: true,
      enablePerformanceMonitoring: true,
      enableErrorTracking: true,
      enableAnalytics: true,
      enableHealthMonitoring: true,
      isDevelopment: true,
      ...config,
    });
  },

  /**
   * Production middleware stack
   */
  production: (config: Partial<MiddlewareConfig> = {}): Middleware[] => {
    return createEnterpriseMiddleware({
      enableStateSync: true,
      enableHttpMonitoring: true,
      enableServiceIntegration: true,
      enableAuth: true,
      enableAuthorization: true,
      enableSecurityMonitoring: true,
      enablePerformanceMonitoring: true,
      enableErrorTracking: true,
      enableAnalytics: true,
      enableHealthMonitoring: true,
      isDevelopment: false,
      ...config,
    });
  },

  /**
   * Testing middleware stack (minimal)
   */
  testing: (config: Partial<MiddlewareConfig> = {}): Middleware[] => {
    return createEnterpriseMiddleware({
      enableStateSync: false,
      enableHttpMonitoring: false,
      enableServiceIntegration: true,
      enableAuth: false,
      enableAuthorization: false,
      enableSecurityMonitoring: false,
      enablePerformanceMonitoring: false,
      enableErrorTracking: false,
      enableAnalytics: false,
      enableHealthMonitoring: false,
      isDevelopment: true,
      ...config,
    });
  },

  /**
   * Security-focused middleware stack
   */
  secure: (config: Partial<MiddlewareConfig> = {}): Middleware[] => {
    return createEnterpriseMiddleware({
      enableStateSync: true,
      enableHttpMonitoring: true,
      enableServiceIntegration: true,
      enableAuth: true,
      enableAuthorization: true,
      enableSecurityMonitoring: true,
      enablePerformanceMonitoring: false,
      enableErrorTracking: true,
      enableAnalytics: false,
      enableHealthMonitoring: true,
      securityPolicy: {
        sessionTimeoutMs: 15 * 60 * 1000, // 15 minutes
        maxLoginAttempts: 3,
        lockoutDurationMs: 30 * 60 * 1000, // 30 minutes
        requireMFA: true,
        csrfProtection: true,
        secureHeaders: true,
      },
      ...config,
    });
  },
};

/**
 * Middleware utilities
 */
export const middlewareUtils = {
  /**
   * Create a Redux store with enterprise middleware
   */
  createStoreWithMiddleware: (
    reducer: any,
    middlewareConfig: MiddlewareConfig = {},
    storeConfig: any = {}
  ) => {
    const middleware = createEnterpriseMiddleware(middlewareConfig);
    
    return configureStore({
      reducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            // Ignore non-serializable values in specific action types
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          },
        }).concat(middleware),
      devTools: middlewareConfig.isDevelopment !== false,
      ...storeConfig,
    });
  },

  /**
   * Get middleware configuration for environment
   */
  getConfigForEnvironment: (env: 'development' | 'production' | 'testing'): MiddlewareConfig => {
    const baseConfig: MiddlewareConfig = {
      isDevelopment: env === 'development',
    };

    switch (env) {
      case 'production':
        return {
          ...baseConfig,
          enableStateSync: true,
          enableHttpMonitoring: true,
          enableServiceIntegration: true,
          enableAuth: true,
          enableAuthorization: true,
          enableSecurityMonitoring: true,
          enablePerformanceMonitoring: true,
          enableErrorTracking: true,
          enableAnalytics: true,
          enableHealthMonitoring: true,
        };
      case 'testing':
        return {
          ...baseConfig,
          enableStateSync: false,
          enableHttpMonitoring: false,
          enableServiceIntegration: true,
          enableAuth: false,
          enableAuthorization: false,
          enableSecurityMonitoring: false,
          enablePerformanceMonitoring: false,
          enableErrorTracking: false,
          enableAnalytics: false,
          enableHealthMonitoring: false,
        };
      default: // development
        return {
          ...baseConfig,
          enableStateSync: true,
          enableHttpMonitoring: true,
          enableServiceIntegration: true,
          enableAuth: true,
          enableAuthorization: true,
          enableSecurityMonitoring: true,
          enablePerformanceMonitoring: true,
          enableErrorTracking: true,
          enableAnalytics: true,
          enableHealthMonitoring: true,
        };
    }
  },
};