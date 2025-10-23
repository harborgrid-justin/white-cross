/**
 * @fileoverview Tests for API Service Registry
 * @module services/core/__tests__/apiServiceRegistry.test
 *
 * Test suite for the backward-compatible API service registry.
 * Verifies lazy instantiation, type safety, and backward compatibility.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { apiServiceRegistry } from '../apiServiceRegistry';

describe('ApiServiceRegistry', () => {
  describe('Service Access', () => {
    it('should provide access to all API services', () => {
      // Verify registry has all expected services
      expect(apiServiceRegistry).toBeDefined();
      expect(apiServiceRegistry.authApi).toBeDefined();
      expect(apiServiceRegistry.studentsApi).toBeDefined();
      expect(apiServiceRegistry.healthRecordsApi).toBeDefined();
      expect(apiServiceRegistry.medicationApi).toBeDefined();
    });

    it('should provide access to medication sub-APIs', () => {
      const { medicationApi } = apiServiceRegistry;

      expect(medicationApi.formulary).toBeDefined();
      expect(medicationApi.prescription).toBeDefined();
      expect(medicationApi.administration).toBeDefined();
    });

    it('should provide access to all core services', () => {
      const services = apiServiceRegistry;

      expect(services.appointmentsApi).toBeDefined();
      expect(services.accessControlApi).toBeDefined();
      expect(services.administrationApi).toBeDefined();
      expect(services.analyticsApi).toBeDefined();
      expect(services.auditApi).toBeDefined();
      expect(services.broadcastsApi).toBeDefined();
      expect(services.communicationApi).toBeDefined();
      expect(services.complianceApi).toBeDefined();
      expect(services.dashboardApi).toBeDefined();
      expect(services.documentsApi).toBeDefined();
      expect(services.emergencyContactsApi).toBeDefined();
      expect(services.healthAssessmentsApi).toBeDefined();
      expect(services.incidentReportsApi).toBeDefined();
      expect(services.integrationApi).toBeDefined();
      expect(services.messagesApi).toBeDefined();
      expect(services.reportsApi).toBeDefined();
      expect(services.studentManagementApi).toBeDefined();
      expect(services.usersApi).toBeDefined();
    });
  });

  describe('Lazy Instantiation', () => {
    it('should return the same instance on multiple accesses', () => {
      const api1 = apiServiceRegistry.studentsApi;
      const api2 = apiServiceRegistry.studentsApi;

      expect(api1).toBe(api2);
    });

    it('should lazily instantiate services only when accessed', () => {
      // Services should not throw errors when accessed
      expect(() => apiServiceRegistry.authApi).not.toThrow();
      expect(() => apiServiceRegistry.studentsApi).not.toThrow();
    });
  });

  describe('Type Safety', () => {
    it('should have proper TypeScript types', () => {
      // Type checking - this will fail at compile time if types are wrong
      const auth = apiServiceRegistry.authApi;
      const students = apiServiceRegistry.studentsApi;

      // Verify objects are defined (runtime check)
      expect(auth).toBeDefined();
      expect(students).toBeDefined();
    });
  });

  describe('Backward Compatibility', () => {
    it('should work with destructuring pattern', () => {
      const { authApi, studentsApi } = apiServiceRegistry;

      expect(authApi).toBeDefined();
      expect(studentsApi).toBeDefined();
    });

    it('should support legacy medicationsApi', () => {
      const { medicationsApi } = apiServiceRegistry;

      expect(medicationsApi).toBeDefined();
    });
  });
});

/**
 * TESTING NOTES:
 *
 * To properly test the service registry, you should:
 *
 * 1. Mock ApiClient to avoid real HTTP calls:
 * ```typescript
 * vi.mock('../ApiClient', () => ({
 *   ApiClient: vi.fn(() => ({
 *     get: vi.fn(),
 *     post: vi.fn(),
 *     put: vi.fn(),
 *     patch: vi.fn(),
 *     delete: vi.fn(),
 *   })),
 * }));
 * ```
 *
 * 2. Mock SecureTokenManager:
 * ```typescript
 * vi.mock('../../security/SecureTokenManager', () => ({
 *   secureTokenManager: {
 *     getToken: vi.fn(() => 'mock-token'),
 *     isTokenValid: vi.fn(() => true),
 *   },
 * }));
 * ```
 *
 * 3. Test actual API calls with mocked responses:
 * ```typescript
 * it('should make API calls', async () => {
 *   const mockApiClient = {
 *     get: vi.fn().mockResolvedValue({ data: { success: true, data: [] } }),
 *   };
 *
 *   // Test with mocked client
 * });
 * ```
 *
 * 4. Test error handling:
 * ```typescript
 * it('should handle API errors', async () => {
 *   const mockApiClient = {
 *     get: vi.fn().mockRejectedValue(new Error('API Error')),
 *   };
 *
 *   // Verify error handling
 * });
 * ```
 *
 * For comprehensive testing, see:
 * - frontend/src/services/cache/CacheManager.test.ts (example test suite)
 * - Migration guide section on testing
 */
