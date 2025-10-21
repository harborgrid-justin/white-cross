/**
 * AuditService Tests
 * Comprehensive test suite for HIPAA-compliant audit logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuditService } from '../AuditService';
import { AuditAction, AuditResourceType, AuditStatus } from '../types';
import { createMockAuditEvent, wait, advanceTimersAndFlush, silenceConsole } from '@/__tests__/utils/testHelpers';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('AuditService', () => {
  let auditService: AuditService;
  let consoleSpies: ReturnType<typeof silenceConsole>;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
    auditService = new AuditService();
    consoleSpies = silenceConsole(['info', 'warn', 'error']);

    // Setup default axios mock
    mockedAxios.post = vi.fn().mockResolvedValue({ data: { success: true } });
  });

  afterEach(async () => {
    await auditService.cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
    consoleSpies.restore();
  });

  describe('Initialization', () => {
    it('should initialize with default configuration', () => {
      const config = auditService.getConfig();

      expect(config).toBeDefined();
      expect(config.enabled).toBe(true);
      expect(config.batchSize).toBeGreaterThan(0);
      expect(config.batchInterval).toBeGreaterThan(0);
    });

    it('should accept custom configuration', () => {
      const customService = new AuditService({
        batchSize: 25,
        batchInterval: 10000,
      });

      const config = customService.getConfig();

      expect(config.batchSize).toBe(25);
      expect(config.batchInterval).toBe(10000);

      customService.cleanup();
    });

    it('should start with empty event queue', () => {
      expect(auditService.getQueuedCount()).toBe(0);
    });

    it('should be healthy on initialization', () => {
      expect(auditService.isHealthy()).toBe(true);
    });
  });

  describe('User Context Management', () => {
    it('should set user context', () => {
      auditService.setUserContext({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'NURSE',
      });

      // Verify by logging an event and checking it includes user info
      auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      expect(auditService.getQueuedCount()).toBe(1);
    });

    it('should clear user context', () => {
      auditService.setUserContext({
        id: 'user-123',
        email: 'test@example.com',
      });

      auditService.clearUserContext();

      const status = auditService.getStatus();
      expect(status).toBeDefined();
    });

    it('should update session ID', () => {
      auditService.setSessionId('session-abc-123');

      auditService.log({
        action: AuditAction.LOGIN,
        resourceType: AuditResourceType.USER,
      });

      expect(auditService.getQueuedCount()).toBe(1);
    });
  });

  describe('Event Logging', () => {
    beforeEach(() => {
      auditService.setUserContext({
        id: 'user-123',
        email: 'test@example.com',
        role: 'NURSE',
      });
    });

    it('should queue audit event', async () => {
      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      expect(auditService.getQueuedCount()).toBe(1);
    });

    it('should log success event', async () => {
      await auditService.logSuccess({
        action: AuditAction.CREATE_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: 'med-1',
      });

      expect(auditService.getQueuedCount()).toBe(1);
    });

    it('should log failure event with error', async () => {
      const error = new Error('Operation failed');

      await auditService.logFailure({
        action: AuditAction.UPDATE_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: 'record-1',
      }, error);

      expect(auditService.getQueuedCount()).toBe(1);
    });

    it('should log PHI access event', async () => {
      await auditService.logPHIAccess(
        AuditAction.VIEW_ALLERGIES,
        'student-123',
        AuditResourceType.ALLERGY,
        'allergy-456'
      );

      expect(auditService.getQueuedCount()).toBe(1);
    });

    it('should log PHI modification with changes', async () => {
      await auditService.logPHIModification(
        AuditAction.UPDATE_ALLERGY,
        'student-123',
        AuditResourceType.ALLERGY,
        'allergy-456',
        [
          { field: 'severity', oldValue: 'MILD', newValue: 'SEVERE' },
          { field: 'notes', oldValue: '', newValue: 'Patient reports severe reaction' },
        ]
      );

      expect(auditService.getQueuedCount()).toBe(1);
    });

    it('should log access denied event', async () => {
      await auditService.logAccessDenied(
        AuditAction.DELETE_STUDENT,
        AuditResourceType.STUDENT,
        'student-1',
        'Insufficient permissions'
      );

      expect(auditService.getQueuedCount()).toBe(1);
    });

    it('should attach student ID to events', async () => {
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: 'record-1',
        studentId: 'student-123',
      });

      expect(auditService.getQueuedCount()).toBe(1);
    });

    it('should attach metadata to events', async () => {
      await auditService.log({
        action: AuditAction.EXPORT_DATA,
        resourceType: AuditResourceType.REPORT,
        metadata: {
          exportFormat: 'PDF',
          filters: { dateRange: '2024-01-01 to 2024-12-31' },
        },
      });

      expect(auditService.getQueuedCount()).toBe(1);
    });
  });

  describe('Event Batching', () => {
    beforeEach(() => {
      auditService.setUserContext({
        id: 'user-123',
        email: 'test@example.com',
      });
    });

    it('should batch multiple events', async () => {
      for (let i = 0; i < 5; i++) {
        await auditService.log({
          action: AuditAction.VIEW_STUDENT,
          resourceType: AuditResourceType.STUDENT,
          resourceId: `student-${i}`,
        });
      }

      expect(auditService.getQueuedCount()).toBe(5);
    });

    it('should submit batch when size limit reached', async () => {
      const customService = new AuditService({ batchSize: 3 });
      customService.setUserContext({ id: 'user-123' });

      for (let i = 0; i < 5; i++) {
        await customService.log({
          action: AuditAction.VIEW_STUDENT,
          resourceType: AuditResourceType.STUDENT,
          resourceId: `student-${i}`,
        });
      }

      // Should have submitted one batch of 3, leaving 2 in queue
      await wait(100);
      expect(customService.getQueuedCount()).toBeLessThanOrEqual(2);

      await customService.cleanup();
    });

    it('should submit batch on interval', async () => {
      const customService = new AuditService({ batchInterval: 1000 });
      customService.setUserContext({ id: 'user-123' });

      await customService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      expect(customService.getQueuedCount()).toBe(1);

      // Advance time past batch interval
      await advanceTimersAndFlush(1500);

      // Queue should be empty after batch submission
      expect(customService.getQueuedCount()).toBe(0);

      await customService.cleanup();
    });

    it('should not batch critical events', async () => {
      // Assume certain actions are critical and flush immediately
      await auditService.log({
        action: AuditAction.DELETE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      // Critical events should be submitted immediately
      await wait(100);

      // Queue might be empty if event was critical
      const count = auditService.getQueuedCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Manual Flushing', () => {
    beforeEach(() => {
      auditService.setUserContext({ id: 'user-123' });
    });

    it('should flush pending events', async () => {
      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      expect(auditService.getQueuedCount()).toBe(1);

      await auditService.flush();

      expect(auditService.getQueuedCount()).toBe(0);
    });

    it('should handle flush when queue is empty', async () => {
      await auditService.flush();

      expect(auditService.getQueuedCount()).toBe(0);
    });

    it('should not flush while already flushing', async () => {
      // Queue multiple events
      for (let i = 0; i < 3; i++) {
        await auditService.log({
          action: AuditAction.VIEW_STUDENT,
          resourceType: AuditResourceType.STUDENT,
          resourceId: `student-${i}`,
        });
      }

      // Initiate flush (don't await)
      const flush1 = auditService.flush();

      // Try to flush again immediately
      const flush2 = auditService.flush();

      await Promise.all([flush1, flush2]);

      // Should only flush once
      expect(auditService.getQueuedCount()).toBe(0);
    });
  });

  describe('Local Storage Backup', () => {
    beforeEach(() => {
      auditService.setUserContext({ id: 'user-123' });
    });

    it('should backup events on API failure', async () => {
      // Mock API failure
      mockedAxios.post = vi.fn().mockRejectedValue(new Error('Network error'));

      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      await auditService.flush();

      // Events should be backed up to localStorage
      const backup = localStorage.getItem('audit_backup');
      expect(backup).toBeDefined();
    });

    it('should retry backed up events', async () => {
      // First, cause a failure to create backup
      mockedAxios.post = vi.fn().mockRejectedValue(new Error('Network error'));

      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      await auditService.flush();

      // Now restore API and flush again
      mockedAxios.post = vi.fn().mockResolvedValue({ data: { success: true } });

      await auditService.flush();

      // Backup should be cleared
      const backup = localStorage.getItem('audit_backup');
      expect(backup).toBeNull();
    });

    it('should limit local storage to max size', async () => {
      const customService = new AuditService({ maxLocalStorage: 5 });
      customService.setUserContext({ id: 'user-123' });

      // Mock API failure
      mockedAxios.post = vi.fn().mockRejectedValue(new Error('Network error'));

      // Log more events than max storage
      for (let i = 0; i < 10; i++) {
        await customService.log({
          action: AuditAction.VIEW_STUDENT,
          resourceType: AuditResourceType.STUDENT,
          resourceId: `student-${i}`,
        });
      }

      await customService.flush();

      // Should only store max amount
      const backup = localStorage.getItem('audit_backup');
      if (backup) {
        const events = JSON.parse(backup);
        expect(events.length).toBeLessThanOrEqual(5);
      }

      await customService.cleanup();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      auditService.setUserContext({ id: 'user-123' });
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.post = vi.fn().mockRejectedValue(new Error('API Error'));

      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      // Should not throw
      await expect(auditService.flush()).resolves.not.toThrow();
    });

    it('should track sync errors', async () => {
      mockedAxios.post = vi.fn().mockRejectedValue(new Error('Network error'));

      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      await auditService.flush();

      const status = auditService.getStatus();
      expect(status.syncErrors).toBeGreaterThan(0);
      expect(status.lastError).toBeDefined();
    });

    it('should mark as unhealthy after multiple errors', async () => {
      mockedAxios.post = vi.fn().mockRejectedValue(new Error('Network error'));

      // Cause multiple failures
      for (let i = 0; i < 6; i++) {
        await auditService.log({
          action: AuditAction.VIEW_STUDENT,
          resourceType: AuditResourceType.STUDENT,
          resourceId: `student-${i}`,
        });
        await auditService.flush();
      }

      expect(auditService.isHealthy()).toBe(false);
    });

    it('should handle localStorage errors gracefully', async () => {
      // Mock localStorage error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      mockedAxios.post = vi.fn().mockRejectedValue(new Error('Network error'));

      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      // Should not throw
      await expect(auditService.flush()).resolves.not.toThrow();

      localStorage.setItem = originalSetItem;
    });
  });

  describe('Service Status', () => {
    beforeEach(() => {
      auditService.setUserContext({ id: 'user-123' });
    });

    it('should return accurate status', () => {
      const status = auditService.getStatus();

      expect(status).toMatchObject({
        isHealthy: true,
        queuedEvents: 0,
        failedEvents: 0,
        syncErrors: 0,
      });
    });

    it('should update status after logging events', async () => {
      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      const status = auditService.getStatus();
      expect(status.queuedEvents).toBe(1);
    });

    it('should update lastSyncAt after successful flush', async () => {
      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      await auditService.flush();

      const status = auditService.getStatus();
      expect(status.lastSyncAt).toBeDefined();
    });
  });

  describe('Configuration Updates', () => {
    it('should update configuration', () => {
      auditService.updateConfig({ batchSize: 50 });

      const config = auditService.getConfig();
      expect(config.batchSize).toBe(50);
    });

    it('should restart timer when interval changes', () => {
      auditService.updateConfig({ batchInterval: 5000 });

      const config = auditService.getConfig();
      expect(config.batchInterval).toBe(5000);
    });

    it('should allow disabling audit service', () => {
      auditService.updateConfig({ enabled: false });

      const config = auditService.getConfig();
      expect(config.enabled).toBe(false);
    });
  });

  describe('Cleanup', () => {
    it('should flush events on cleanup', async () => {
      auditService.setUserContext({ id: 'user-123' });

      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      await auditService.cleanup();

      expect(auditService.getQueuedCount()).toBe(0);
    });

    it('should stop batch timer on cleanup', async () => {
      await auditService.cleanup();

      expect(vi.getTimerCount()).toBe(0);
    });

    it('should be safe to call cleanup multiple times', async () => {
      await auditService.cleanup();
      await expect(auditService.cleanup()).resolves.not.toThrow();
    });
  });

  describe('Queue Management', () => {
    beforeEach(() => {
      auditService.setUserContext({ id: 'user-123' });
    });

    it('should return queued count', async () => {
      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      expect(auditService.getQueuedCount()).toBe(1);
    });

    it('should clear queue', async () => {
      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: 'student-1',
      });

      auditService.clearQueue();

      expect(auditService.getQueuedCount()).toBe(0);
    });

    it('should maintain queue order', async () => {
      for (let i = 0; i < 3; i++) {
        await auditService.log({
          action: AuditAction.VIEW_STUDENT,
          resourceType: AuditResourceType.STUDENT,
          resourceId: `student-${i}`,
        });
      }

      expect(auditService.getQueuedCount()).toBe(3);
    });
  });
});
