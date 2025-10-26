/**
 * useAudit Hook Tests
 * Comprehensive test suite for React audit logging hook
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAudit } from '../useAudit';
import { auditService } from '../AuditService';
import { AuditAction, AuditResourceType } from '../types';
import authReducer from '@/stores/slices/authSlice';
import { silenceConsole } from '@/__tests__/utils/testHelpers';

// Mock the audit service
vi.mock('../AuditService', () => ({
  auditService: {
    log: vi.fn(),
    logSuccess: vi.fn(),
    logFailure: vi.fn(),
    logPHIAccess: vi.fn(),
    logPHIModification: vi.fn(),
    logAccessDenied: vi.fn(),
    flush: vi.fn().mockResolvedValue(undefined),
    getStatus: vi.fn().mockReturnValue({
      isHealthy: true,
      queuedEvents: 0,
      failedEvents: 0,
      syncErrors: 0,
    }),
    getQueuedCount: vi.fn().mockReturnValue(0),
  },
  initializeAuditService: vi.fn(),
  cleanupAuditService: vi.fn(),
}));

describe('useAudit', () => {
  let store: ReturnType<typeof configureStore>;
  let consoleSpies: ReturnType<typeof silenceConsole>;

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpies = silenceConsole(['error']);

    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: {
            id: 'user-123',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'NURSE',
          },
          token: 'mock-token',
          loading: false,
          error: null,
        },
      },
    });
  });

  afterEach(() => {
    consoleSpies.restore();
  });

  describe('Hook Initialization', () => {
    it('should return audit methods', () => {
      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('log');
      expect(result.current).toHaveProperty('logSuccess');
      expect(result.current).toHaveProperty('logFailure');
      expect(result.current).toHaveProperty('logPHIAccess');
      expect(result.current).toHaveProperty('logPHIModification');
      expect(result.current).toHaveProperty('logAccessDenied');
      expect(result.current).toHaveProperty('flush');
      expect(result.current).toHaveProperty('getStatus');
      expect(result.current).toHaveProperty('getQueuedCount');
    });

    it('should initialize audit service with user context', () => {
      const { initializeAuditService } = require('../AuditService');

      renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      expect(initializeAuditService).toHaveBeenCalledWith({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'NURSE',
      });
    });

    it('should cleanup audit service when user logs out', () => {
      const { cleanupAuditService } = require('../AuditService');

      const { rerender } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      // Update store to logged out state
      store = configureStore({
        reducer: {
          auth: authReducer,
        },
        preloadedState: {
          auth: {
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: null,
          },
        },
      });

      rerender();

      expect(cleanupAuditService).toHaveBeenCalled();
    });
  });

  describe('Basic Logging Methods', () => {
    it('should log audit event', async () => {
      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      await result.current.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      expect(auditService.log).toHaveBeenCalledWith({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });
    });

    it('should log success event', async () => {
      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      await result.current.logSuccess({
        action: AuditAction.CREATE_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: 'med-1',
      });

      expect(auditService.logSuccess).toHaveBeenCalledWith({
        action: AuditAction.CREATE_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: 'med-1',
      });
    });

    it('should log failure event with error', async () => {
      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      const error = new Error('Operation failed');

      await result.current.logFailure({
        action: AuditAction.UPDATE_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: 'record-1',
      }, error);

      expect(auditService.logFailure).toHaveBeenCalledWith({
        action: AuditAction.UPDATE_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: 'record-1',
      }, error);
    });
  });

  describe('PHI Logging Methods', () => {
    it('should log PHI access', async () => {
      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      await result.current.logPHIAccess(
        AuditAction.VIEW_ALLERGIES,
        'student-123',
        AuditResourceType.ALLERGY,
        'allergy-456'
      );

      expect(auditService.logPHIAccess).toHaveBeenCalledWith(
        AuditAction.VIEW_ALLERGIES,
        'student-123',
        AuditResourceType.ALLERGY,
        'allergy-456'
      );
    });

    it('should log PHI modification with changes', async () => {
      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      const changes = [
        { field: 'severity', oldValue: 'MILD', newValue: 'SEVERE' },
      ];

      await result.current.logPHIModification(
        AuditAction.UPDATE_ALLERGY,
        'student-123',
        AuditResourceType.ALLERGY,
        'allergy-456',
        changes
      );

      expect(auditService.logPHIModification).toHaveBeenCalledWith(
        AuditAction.UPDATE_ALLERGY,
        'student-123',
        AuditResourceType.ALLERGY,
        'allergy-456',
        changes
      );
    });

    it('should log access denied', async () => {
      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      await result.current.logAccessDenied(
        AuditAction.DELETE_STUDENT,
        AuditResourceType.STUDENT,
        'student-1',
        'Insufficient permissions'
      );

      expect(auditService.logAccessDenied).toHaveBeenCalledWith(
        AuditAction.DELETE_STUDENT,
        AuditResourceType.STUDENT,
        'student-1',
        'Insufficient permissions'
      );
    });
  });

  describe('Utility Methods', () => {
    it('should flush pending events', async () => {
      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      await result.current.flush();

      expect(auditService.flush).toHaveBeenCalled();
    });

    it('should get service status', () => {
      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      const status = result.current.getStatus();

      expect(status).toBeDefined();
      expect(status.isHealthy).toBe(true);
      expect(auditService.getStatus).toHaveBeenCalled();
    });

    it('should get queued count', () => {
      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      const count = result.current.getQueuedCount();

      expect(count).toBe(0);
      expect(auditService.getQueuedCount).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle log errors gracefully', async () => {
      const mockedAuditService = vi.mocked(auditService);
      mockedAuditService.log = vi.fn().mockRejectedValue(new Error('Log error'));

      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      await expect(
        result.current.log({
          action: AuditAction.VIEW_STUDENT,
          resourceType: AuditResourceType.STUDENT,
          resourceId: 'student-1',
        })
      ).resolves.not.toThrow();
    });

    it('should handle flush errors gracefully', async () => {
      const mockedAuditService = vi.mocked(auditService);
      mockedAuditService.flush = vi.fn().mockRejectedValue(new Error('Flush error'));

      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.flush()).resolves.not.toThrow();
    });

    it('should handle PHI access errors gracefully', async () => {
      const mockedAuditService = vi.mocked(auditService);
      mockedAuditService.logPHIAccess = vi.fn().mockRejectedValue(new Error('PHI error'));

      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      await expect(
        result.current.logPHIAccess(
          AuditAction.VIEW_ALLERGIES,
          'student-123',
          AuditResourceType.ALLERGY
        )
      ).resolves.not.toThrow();
    });
  });

  describe('Component Lifecycle', () => {
    it('should flush on unmount', async () => {
      const { unmount } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      unmount();

      await waitFor(() => {
        expect(auditService.flush).toHaveBeenCalled();
      });
    });

    it('should update user context when user changes', () => {
      const { initializeAuditService } = require('../AuditService');

      const { rerender } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      // Update user in store
      store = configureStore({
        reducer: {
          auth: authReducer,
        },
        preloadedState: {
          auth: {
            isAuthenticated: true,
            user: {
              id: 'user-456',
              email: 'new@example.com',
              firstName: 'Jane',
              lastName: 'Smith',
              role: 'DOCTOR',
            },
            token: 'new-token',
            loading: false,
            error: null,
          },
        },
      });

      rerender();

      expect(initializeAuditService).toHaveBeenCalledWith({
        id: 'user-456',
        email: 'new@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'DOCTOR',
      });
    });
  });

  describe('Memoization', () => {
    it('should memoize audit methods', () => {
      const { result, rerender } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      const firstLog = result.current.log;
      const firstFlush = result.current.flush;

      rerender();

      expect(result.current.log).toBe(firstLog);
      expect(result.current.flush).toBe(firstFlush);
    });

    it('should return stable result object', () => {
      const { result, rerender } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      const firstResult = result.current;

      rerender();

      // Methods should be the same reference
      expect(result.current.log).toBe(firstResult.log);
      expect(result.current.logSuccess).toBe(firstResult.logSuccess);
      expect(result.current.flush).toBe(firstResult.flush);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle full workflow', async () => {
      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      // Log multiple events
      await result.current.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      await result.current.logPHIAccess(
        AuditAction.VIEW_HEALTH_RECORD,
        'student-1',
        AuditResourceType.HEALTH_RECORD
      );

      // Flush
      await result.current.flush();

      // Check status
      const status = result.current.getStatus();

      expect(status).toBeDefined();
      expect(auditService.log).toHaveBeenCalled();
      expect(auditService.logPHIAccess).toHaveBeenCalled();
      expect(auditService.flush).toHaveBeenCalled();
    });

    it('should handle authentication state changes', () => {
      const { initializeAuditService, cleanupAuditService } = require('../AuditService');

      const { rerender } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      // User is authenticated
      expect(initializeAuditService).toHaveBeenCalled();

      // User logs out
      store = configureStore({
        reducer: {
          auth: authReducer,
        },
        preloadedState: {
          auth: {
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: null,
          },
        },
      });

      rerender();

      expect(cleanupAuditService).toHaveBeenCalled();
    });

    it('should handle rapid event logging', async () => {
      const { result } = renderHook(() => useAudit(), {
        wrapper: createWrapper(),
      });

      // Log many events rapidly
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          result.current.log({
            action: AuditAction.VIEW_STUDENT,
            resourceType: AuditResourceType.STUDENT,
            resourceId: `student-${i}`,
          })
        );
      }

      await Promise.all(promises);

      expect(auditService.log).toHaveBeenCalledTimes(10);
    });
  });
});
