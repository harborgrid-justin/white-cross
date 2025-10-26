/**
 * @fileoverview Tests for Service Initialization
 * @module services/core/__tests__/initialize.test
 *
 * Test suite for service initialization and lifecycle management.
 * Verifies ServiceManager integration, cleanup, and error handling.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  initializeServices,
  cleanupServices,
  reinitializeServices,
  isServicesInitialized,
  getInitializationStatus,
} from '../initialize';
import { ServiceManager } from '../ServiceManager';

describe('Service Initialization', () => {
  // Reset services before each test
  beforeEach(async () => {
    const sm = ServiceManager.getInstance();
    if (sm.isInitialized()) {
      await sm.cleanup();
    }
    await sm.reset();
  });

  afterEach(async () => {
    const sm = ServiceManager.getInstance();
    if (sm.isInitialized()) {
      await sm.cleanup();
    }
  });

  describe('initializeServices', () => {
    it('should initialize all services successfully', async () => {
      await initializeServices();

      expect(isServicesInitialized()).toBe(true);

      const sm = ServiceManager.getInstance();
      expect(sm.isInitialized()).toBe(true);
    });

    it('should be idempotent (safe to call multiple times)', async () => {
      await initializeServices();
      await initializeServices(); // Second call should be no-op
      await initializeServices(); // Third call should be no-op

      expect(isServicesInitialized()).toBe(true);
    });

    it('should allow skipping specific services', async () => {
      await initializeServices({
        skipServices: ['auditService'],
      });

      expect(isServicesInitialized()).toBe(true);

      const sm = ServiceManager.getInstance();
      expect(sm.has('apiClient')).toBe(true);
      expect(sm.has('tokenManager')).toBe(true);
    });

    it('should enable debug mode when requested', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await initializeServices({ debug: true });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('getInitializationStatus', () => {
    it('should return correct status before initialization', () => {
      const status = getInitializationStatus();

      expect(status.initialized).toBe(false);
      expect(status.initializing).toBe(false);
    });

    it('should return correct status after initialization', async () => {
      await initializeServices();

      const status = getInitializationStatus();

      expect(status.initialized).toBe(true);
      expect(status.initializing).toBe(false);
    });
  });

  describe('cleanupServices', () => {
    it('should cleanup all services', async () => {
      await initializeServices();
      expect(isServicesInitialized()).toBe(true);

      await cleanupServices();

      expect(isServicesInitialized()).toBe(false);

      const sm = ServiceManager.getInstance();
      expect(sm.isInitialized()).toBe(false);
    });

    it('should be safe to call when services not initialized', async () => {
      // Should not throw error
      await expect(cleanupServices()).resolves.not.toThrow();
    });

    it('should be safe to call multiple times', async () => {
      await initializeServices();

      await cleanupServices();
      await cleanupServices(); // Second call should be no-op
      await cleanupServices(); // Third call should be no-op

      expect(isServicesInitialized()).toBe(false);
    });
  });

  describe('reinitializeServices', () => {
    it('should cleanup and reinitialize services', async () => {
      await initializeServices();
      expect(isServicesInitialized()).toBe(true);

      await reinitializeServices();

      expect(isServicesInitialized()).toBe(true);
    });

    it('should work even if services not initialized', async () => {
      await reinitializeServices();

      expect(isServicesInitialized()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization errors gracefully', async () => {
      // Mock ServiceManager to throw error
      const sm = ServiceManager.getInstance();
      const initSpy = vi.spyOn(sm, 'initialize').mockRejectedValueOnce(
        new Error('Initialization failed')
      );

      await expect(initializeServices()).rejects.toThrow('Initialization failed');

      expect(isServicesInitialized()).toBe(false);

      initSpy.mockRestore();
    });
  });

  describe('Lifecycle Integration', () => {
    it('should integrate with ServiceManager lifecycle', async () => {
      await initializeServices();

      const sm = ServiceManager.getInstance();
      const status = sm.getStatus();

      expect(status.initialized).toBe(true);
      expect(status.serviceCount).toBeGreaterThan(0);
    });
  });
});

/**
 * INTEGRATION TESTING NOTES:
 *
 * For full integration testing, you should:
 *
 * 1. Test cleanup handlers:
 * ```typescript
 * it('should cleanup on beforeunload', () => {
 *   const event = new Event('beforeunload');
 *   window.dispatchEvent(event);
 *   // Verify cleanup was called
 * });
 * ```
 *
 * 2. Test with real ServiceManager:
 * ```typescript
 * it('should initialize all registered services', async () => {
 *   await initializeServices();
 *   const sm = ServiceManager.getInstance();
 *
 *   expect(sm.has('apiClient')).toBe(true);
 *   expect(sm.has('tokenManager')).toBe(true);
 *   expect(sm.has('cacheManager')).toBe(true);
 * });
 * ```
 *
 * 3. Test error recovery:
 * ```typescript
 * it('should recover from failed initialization', async () => {
 *   // Force first initialization to fail
 *   // Then verify reinitializeServices works
 * });
 * ```
 *
 * 4. Test performance:
 * ```typescript
 * it('should initialize quickly', async () => {
 *   const start = performance.now();
 *   await initializeServices();
 *   const duration = performance.now() - start;
 *
 *   expect(duration).toBeLessThan(1000); // Should take less than 1 second
 * });
 * ```
 *
 * For comprehensive testing examples, see:
 * - frontend/src/services/cache/CacheManager.test.ts
 */
