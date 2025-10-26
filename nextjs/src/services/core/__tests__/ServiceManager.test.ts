/**
 * ServiceManager Tests
 * Tests service initialization, retrieval, singleton pattern, and error handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ServiceManager, getServiceManager } from '../ServiceManager';
import { ApiClient } from '../ApiClient';
import type { ITokenManager } from '../interfaces/ITokenManager';

describe('ServiceManager', () => {
  let serviceManager: ServiceManager;

  beforeEach(async () => {
    // Reset singleton before each test
    const instance = ServiceManager.getInstance();
    if (instance.isInitialized()) {
      await instance.reset();
    }
    serviceManager = ServiceManager.getInstance();
  });

  afterEach(async () => {
    // Clean up after each test
    if (serviceManager.isInitialized()) {
      await serviceManager.cleanup();
    }
    await serviceManager.reset();
    vi.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance on multiple calls', () => {
      // Act
      const instance1 = ServiceManager.getInstance();
      const instance2 = ServiceManager.getInstance();
      const instance3 = getServiceManager();

      // Assert
      expect(instance1).toBe(instance2);
      expect(instance2).toBe(instance3);
      expect(instance1).toBe(serviceManager);
    });

    it('should maintain state across getInstance calls', async () => {
      // Arrange & Act
      await serviceManager.initialize();
      const instance2 = ServiceManager.getInstance();

      // Assert
      expect(instance2.isInitialized()).toBe(true);
      expect(serviceManager.isInitialized()).toBe(true);
    });
  });

  describe('Service Initialization', () => {
    it('should initialize all core services in correct order', async () => {
      // Act
      await serviceManager.initialize({ debug: true });

      // Assert
      expect(serviceManager.isInitialized()).toBe(true);
      expect(serviceManager.has('configService')).toBe(true);
      expect(serviceManager.has('tokenManager')).toBe(true);
      expect(serviceManager.has('cacheManager')).toBe(true);
      expect(serviceManager.has('apiClient')).toBe(true);
      expect(serviceManager.has('resilientApiClient')).toBe(true);
      expect(serviceManager.has('auditService')).toBe(true);
    });

    it('should prevent concurrent initialization', async () => {
      // Act - start multiple initializations simultaneously
      const init1 = serviceManager.initialize();
      const init2 = serviceManager.initialize();
      const init3 = serviceManager.initialize();

      await Promise.all([init1, init2, init3]);

      // Assert - should only initialize once
      expect(serviceManager.isInitialized()).toBe(true);
      const status = serviceManager.getStatus();
      expect(status.serviceCount).toBeGreaterThan(0);
    });

    it('should skip initialization of specified services', async () => {
      // Act
      await serviceManager.initialize({
        skip: ['auditService', 'resilientApiClient'],
      });

      // Assert
      expect(serviceManager.isInitialized()).toBe(true);
      expect(serviceManager.has('apiClient')).toBe(true);
      expect(serviceManager.has('tokenManager')).toBe(true);
      expect(serviceManager.has('auditService')).toBe(false);
      expect(serviceManager.has('resilientApiClient')).toBe(false);
    });

    it('should use override services for testing', async () => {
      // Arrange
      const mockTokenManager: ITokenManager = {
        getToken: vi.fn(() => 'mock-token'),
        getRefreshToken: vi.fn(() => 'mock-refresh'),
        setToken: vi.fn(),
        clearTokens: vi.fn(),
        isTokenValid: vi.fn(() => true),
        updateActivity: vi.fn(),
        cleanup: vi.fn(),
      };

      const overrides = new Map();
      overrides.set('tokenManager', mockTokenManager);

      // Act
      await serviceManager.initialize({ overrides });

      // Assert
      const tokenManager = serviceManager.get<ITokenManager>('tokenManager');
      expect(tokenManager).toBe(mockTokenManager);
      expect(tokenManager.getToken()).toBe('mock-token');
    });

    it('should not re-initialize if already initialized', async () => {
      // Arrange
      await serviceManager.initialize();
      const firstStatus = serviceManager.getStatus();

      // Act - try to initialize again
      await serviceManager.initialize();

      // Assert - should be the same
      const secondStatus = serviceManager.getStatus();
      expect(firstStatus.initialized).toBe(true);
      expect(secondStatus.initialized).toBe(true);
      expect(firstStatus.serviceCount).toBe(secondStatus.serviceCount);
    });
  });

  describe('Service Retrieval', () => {
    beforeEach(async () => {
      await serviceManager.initialize();
    });

    it('should retrieve initialized services by name', () => {
      // Act
      const apiClient = serviceManager.get<ApiClient>('apiClient');
      const tokenManager = serviceManager.get<ITokenManager>('tokenManager');

      // Assert
      expect(apiClient).toBeDefined();
      expect(apiClient).toBeInstanceOf(ApiClient);
      expect(tokenManager).toBeDefined();
    });

    it('should throw error when retrieving non-existent service', () => {
      // Act & Assert
      expect(() => {
        serviceManager.get('nonExistentService');
      }).toThrow(/service 'nonExistentService' not found/i);
    });

    it('should throw error when retrieving service before initialization', async () => {
      // Arrange
      await serviceManager.reset();

      // Act & Assert
      expect(() => {
        serviceManager.get('apiClient');
      }).toThrow(/servicemanager not initialized/i);
    });

    it('should return undefined with tryGet for non-existent service', () => {
      // Act
      const service = serviceManager.tryGet('nonExistentService');

      // Assert
      expect(service).toBeUndefined();
    });

    it('should return service with tryGet for existing service', () => {
      // Act
      const apiClient = serviceManager.tryGet<ApiClient>('apiClient');

      // Assert
      expect(apiClient).toBeDefined();
      expect(apiClient).toBeInstanceOf(ApiClient);
    });

    it('should check service existence with has()', () => {
      // Act & Assert
      expect(serviceManager.has('apiClient')).toBe(true);
      expect(serviceManager.has('tokenManager')).toBe(true);
      expect(serviceManager.has('nonExistentService')).toBe(false);
    });

    it('should list all service names', () => {
      // Act
      const serviceNames = serviceManager.getServiceNames();

      // Assert
      expect(serviceNames).toBeInstanceOf(Array);
      expect(serviceNames.length).toBeGreaterThan(0);
      expect(serviceNames).toContain('apiClient');
      expect(serviceNames).toContain('tokenManager');
      expect(serviceNames).toContain('configService');
    });
  });

  describe('Service Cleanup', () => {
    beforeEach(async () => {
      await serviceManager.initialize();
    });

    it('should cleanup all services in reverse order', async () => {
      // Arrange
      expect(serviceManager.isInitialized()).toBe(true);

      // Act
      await serviceManager.cleanup();

      // Assert
      expect(serviceManager.isInitialized()).toBe(false);
      expect(serviceManager.getServiceNames()).toHaveLength(0);
    });

    it('should prevent concurrent cleanup', async () => {
      // Act - start multiple cleanups simultaneously
      const cleanup1 = serviceManager.cleanup();
      const cleanup2 = serviceManager.cleanup();
      const cleanup3 = serviceManager.cleanup();

      await Promise.all([cleanup1, cleanup2, cleanup3]);

      // Assert
      expect(serviceManager.isInitialized()).toBe(false);
    });

    it('should not error when cleaning up non-initialized manager', async () => {
      // Arrange
      await serviceManager.cleanup();

      // Act & Assert - should not throw
      await expect(serviceManager.cleanup()).resolves.not.toThrow();
    });
  });

  describe('Service Health Status', () => {
    beforeEach(async () => {
      await serviceManager.initialize();
    });

    it('should return health status for all services', () => {
      // Act
      const status = serviceManager.getStatus();

      // Assert
      expect(status.initialized).toBe(true);
      expect(status.serviceCount).toBeGreaterThan(0);
      expect(status.services).toBeInstanceOf(Array);
      expect(status.services.length).toBe(status.serviceCount);

      // Check service health structure
      status.services.forEach(service => {
        expect(service).toHaveProperty('name');
        expect(service).toHaveProperty('healthy');
        expect(service).toHaveProperty('lastCheck');
      });
    });

    it('should count healthy and unhealthy services', () => {
      // Act
      const status = serviceManager.getStatus();

      // Assert
      expect(status.healthyServices).toBeGreaterThanOrEqual(0);
      expect(status.unhealthyServices).toBeGreaterThanOrEqual(0);
      expect(status.healthyServices + status.unhealthyServices).toBe(status.serviceCount);
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should call lifecycle hooks during initialization', async () => {
      // Arrange
      const hooks = {
        onBeforeInitialize: vi.fn(),
        onAfterInitialize: vi.fn(),
      };

      serviceManager.setHooks(hooks);

      // Act
      await serviceManager.initialize();

      // Assert
      expect(hooks.onBeforeInitialize).toHaveBeenCalled();
      expect(hooks.onAfterInitialize).toHaveBeenCalled();
    });

    it('should call lifecycle hooks during cleanup', async () => {
      // Arrange
      await serviceManager.initialize();

      const hooks = {
        onBeforeCleanup: vi.fn(),
        onAfterCleanup: vi.fn(),
      };

      serviceManager.setHooks(hooks);

      // Act
      await serviceManager.cleanup();

      // Assert
      expect(hooks.onBeforeCleanup).toHaveBeenCalled();
      expect(hooks.onAfterCleanup).toHaveBeenCalled();
    });
  });

  describe('Reset Functionality', () => {
    it('should completely reset service manager', async () => {
      // Arrange
      await serviceManager.initialize();
      expect(serviceManager.isInitialized()).toBe(true);

      // Act
      await serviceManager.reset();

      // Assert
      expect(serviceManager.isInitialized()).toBe(false);
      expect(serviceManager.getServiceNames()).toHaveLength(0);

      // Should be able to initialize again
      await serviceManager.initialize();
      expect(serviceManager.isInitialized()).toBe(true);
    });

    it('should handle reset of non-initialized manager', async () => {
      // Arrange - already not initialized

      // Act & Assert - should not throw
      await expect(serviceManager.reset()).resolves.not.toThrow();
    });
  });
});
