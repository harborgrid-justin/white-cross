/**
 * LOC: TEST-AUDIT-001
 * Unit Tests for AuditLogService
 * HIPAA Compliance Testing - Audit Trail Verification
 *
 * Tests cover:
 * - Audit log creation and retrieval
 * - HIPAA compliance logging
 * - Error handling and fail-safe behavior
 * - PHI access tracking
 */

import { AuditLogService } from '../auditLogService';
import { AuditAction } from '../../../database/types/enums';
import { createMockAuditEntry, createMockRepository } from '../../../__tests__/setup';

// ============================================================================
// MOCKS
// ============================================================================

// Mock the AuditLog model
const mockAuditLogRepository = createMockRepository<any>();

jest.mock('../../../database/models', () => ({
  AuditLog: mockAuditLogRepository,
}));

// Mock logger (already mocked in setup)
import { logger } from '../../../shared/logging/logger';

describe('AuditLogService - HIPAA Compliance', () => {
  beforeEach(() => {
    // Clear repository between tests
    mockAuditLogRepository._reset();
    jest.clearAllMocks();
  });

  // ==========================================================================
  // AUDIT LOG CREATION TESTS
  // ==========================================================================

  describe('logAction()', () => {
    it('should create audit log entry successfully', async () => {
      const entry = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'READ',
        entityType: 'Student',
        entityId: '123e4567-e89b-12d3-a456-426614174001',
        changes: { field: 'dateOfBirth', oldValue: null, newValue: '2010-01-01' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      };

      await AuditLogService.logAction(entry);

      // Verify audit log was created
      expect(mockAuditLogRepository.create).toHaveBeenCalledTimes(1);
      expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: entry.userId,
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
        })
      );

      // Verify logger was called
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Audit: READ on Student')
      );
    });

    it('should log PHI access for HIPAA compliance', async () => {
      const entry = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'READ',
        entityType: 'HealthRecord',
        entityId: '123e4567-e89b-12d3-a456-426614174002',
        changes: { accessType: 'PHI_VIEW', dataAccessed: ['diagnosis', 'treatment'] },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      };

      await AuditLogService.logAction(entry);

      expect(mockAuditLogRepository.create).toHaveBeenCalledTimes(1);
      expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          entityType: 'HealthRecord',
          changes: expect.objectContaining({
            accessType: 'PHI_VIEW',
            dataAccessed: ['diagnosis', 'treatment'],
          }),
        })
      );
    });

    it('should handle system actions without userId', async () => {
      const entry = {
        userId: null,
        action: 'SYSTEM_BACKUP',
        entityType: 'Database',
        entityId: null,
        changes: { backupType: 'FULL', status: 'COMPLETED' },
        ipAddress: '127.0.0.1',
        userAgent: 'System Cron Job',
      };

      await AuditLogService.logAction(entry);

      expect(mockAuditLogRepository.create).toHaveBeenCalledTimes(1);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('by user SYSTEM')
      );
    });

    it('should include success flag in changes', async () => {
      const entry = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'UPDATE',
        entityType: 'Student',
        entityId: '123e4567-e89b-12d3-a456-426614174001',
        success: true,
        changes: { field: 'gradeLevel', oldValue: '9', newValue: '10' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      };

      await AuditLogService.logAction(entry);

      expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          changes: expect.objectContaining({
            success: true,
            details: entry.changes,
          }),
        })
      );
    });

    it('should log failed operations with error message', async () => {
      const entry = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'DELETE',
        entityType: 'Medication',
        entityId: '123e4567-e89b-12d3-a456-426614174003',
        success: false,
        errorMessage: 'Cannot delete medication currently in use',
        changes: {},
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      };

      await AuditLogService.logAction(entry);

      expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          changes: expect.objectContaining({
            success: false,
            errorMessage: 'Cannot delete medication currently in use',
          }),
        })
      );
    });

    it('should NOT throw error if audit logging fails (fail-safe)', async () => {
      // Mock database error
      mockAuditLogRepository.create.mockRejectedValueOnce(
        new Error('Database connection lost')
      );

      const entry = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'READ',
        entityType: 'Student',
        entityId: '123e4567-e89b-12d3-a456-426614174001',
        changes: {},
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      };

      // Should NOT throw
      await expect(AuditLogService.logAction(entry)).resolves.not.toThrow();

      // Should log the error
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to create audit log:',
        expect.any(Error)
      );
    });
  });

  // ==========================================================================
  // AUDIT LOG RETRIEVAL TESTS
  // ==========================================================================

  describe('getAuditLogById()', () => {
    it('should retrieve audit log by ID', async () => {
      const mockLog = createMockAuditEntry();
      mockAuditLogRepository.store.push(mockLog);

      const result = await AuditLogService.getAuditLogById(mockLog.id);

      expect(mockAuditLogRepository.findByPk).toHaveBeenCalledWith(mockLog.id);
      expect(result).toEqual(mockLog);
    });

    it('should return null if audit log not found', async () => {
      const result = await AuditLogService.getAuditLogById('non-existent-id');

      expect(result).toBeNull();
    });

    it('should throw error on database failure', async () => {
      mockAuditLogRepository.findByPk.mockRejectedValueOnce(
        new Error('Database connection lost')
      );

      await expect(
        AuditLogService.getAuditLogById('some-id')
      ).rejects.toThrow('Failed to fetch audit log');

      expect(logger.error).toHaveBeenCalledWith(
        'Error fetching audit log by ID:',
        expect.any(Error)
      );
    });
  });

  describe('getRecentAuditLogs()', () => {
    it('should retrieve recent audit logs with default limit', async () => {
      // Create 10 mock logs
      for (let i = 0; i < 10; i++) {
        mockAuditLogRepository.store.push(createMockAuditEntry());
      }

      const result = await AuditLogService.getRecentAuditLogs();

      expect(mockAuditLogRepository.findAll).toHaveBeenCalledWith({
        limit: 50,
        order: [['createdAt', 'DESC']],
      });
      expect(result).toHaveLength(10);
    });

    it('should retrieve recent audit logs with custom limit', async () => {
      for (let i = 0; i < 20; i++) {
        mockAuditLogRepository.store.push(createMockAuditEntry());
      }

      const result = await AuditLogService.getRecentAuditLogs(10);

      expect(mockAuditLogRepository.findAll).toHaveBeenCalledWith({
        limit: 10,
        order: [['createdAt', 'DESC']],
      });
    });

    it('should handle empty result set', async () => {
      const result = await AuditLogService.getRecentAuditLogs();

      expect(result).toEqual([]);
    });

    it('should throw error on database failure', async () => {
      mockAuditLogRepository.findAll.mockRejectedValueOnce(
        new Error('Database connection lost')
      );

      await expect(
        AuditLogService.getRecentAuditLogs()
      ).rejects.toThrow('Failed to fetch recent audit logs');

      expect(logger.error).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // HIPAA COMPLIANCE SCENARIO TESTS
  // ==========================================================================

  describe('HIPAA Compliance Scenarios', () => {
    it('should log PHI data access (READ operation)', async () => {
      const entry = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'READ',
        entityType: 'HealthRecord',
        entityId: '123e4567-e89b-12d3-a456-426614174002',
        changes: {
          phiAccessed: true,
          fieldsViewed: ['diagnosis', 'treatment', 'medications'],
          accessReason: 'Medical consultation',
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      };

      await AuditLogService.logAction(entry);

      expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'READ',
          entityType: 'HealthRecord',
          changes: expect.objectContaining({
            phiAccessed: true,
            fieldsViewed: ['diagnosis', 'treatment', 'medications'],
          }),
        })
      );
    });

    it('should log PHI data modification (UPDATE operation)', async () => {
      const entry = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'UPDATE',
        entityType: 'HealthRecord',
        entityId: '123e4567-e89b-12d3-a456-426614174002',
        changes: {
          field: 'diagnosis',
          oldValue: 'Flu',
          newValue: 'Pneumonia',
          modificationReason: 'Updated based on test results',
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      };

      await AuditLogService.logAction(entry);

      expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'UPDATE',
          changes: expect.objectContaining({
            field: 'diagnosis',
            oldValue: 'Flu',
            newValue: 'Pneumonia',
          }),
        })
      );
    });

    it('should log medication administration with witness (controlled substance)', async () => {
      const entry = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'MEDICATION_ADMINISTERED',
        entityType: 'MedicationAdministration',
        entityId: '123e4567-e89b-12d3-a456-426614174003',
        changes: {
          medicationName: 'Ritalin',
          dosageGiven: '10mg',
          isControlled: true,
          deaSchedule: 'II',
          witnessId: '123e4567-e89b-12d3-a456-426614174004',
          witnessName: 'Jane Smith, RN',
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      };

      await AuditLogService.logAction(entry);

      expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          changes: expect.objectContaining({
            isControlled: true,
            deaSchedule: 'II',
            witnessId: '123e4567-e89b-12d3-a456-426614174004',
          }),
        })
      );
    });

    it('should log unauthorized access attempts', async () => {
      const entry = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'UNAUTHORIZED_ACCESS',
        entityType: 'HealthRecord',
        entityId: '123e4567-e89b-12d3-a456-426614174002',
        success: false,
        errorMessage: 'User does not have permission to access this record',
        changes: {},
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      };

      await AuditLogService.logAction(entry);

      expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'UNAUTHORIZED_ACCESS',
          changes: expect.objectContaining({
            success: false,
            errorMessage: 'User does not have permission to access this record',
          }),
        })
      );
    });

    it('should log PHI export/download operations', async () => {
      const entry = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'EXPORT',
        entityType: 'HealthRecord',
        entityId: null, // Bulk export
        changes: {
          exportType: 'PDF',
          recordCount: 150,
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          downloadReason: 'Annual compliance review',
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      };

      await AuditLogService.logAction(entry);

      expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'EXPORT',
          changes: expect.objectContaining({
            exportType: 'PDF',
            recordCount: 150,
          }),
        })
      );
    });
  });

  // ==========================================================================
  // EDGE CASES AND ERROR HANDLING
  // ==========================================================================

  describe('Edge Cases', () => {
    it('should handle missing optional fields gracefully', async () => {
      const entry = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'READ',
        entityType: 'Student',
        // entityId missing
        // changes missing
        // ipAddress missing
        // userAgent missing
      };

      await expect(
        AuditLogService.logAction(entry as any)
      ).resolves.not.toThrow();

      expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: entry.userId,
          action: entry.action,
          entityType: entry.entityType,
        })
      );
    });

    it('should handle large change objects', async () => {
      const largeChanges = {
        field1: 'a'.repeat(1000),
        field2: 'b'.repeat(1000),
        field3: { nested: { deep: { value: 'c'.repeat(1000) } } },
      };

      const entry = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'UPDATE',
        entityType: 'Student',
        entityId: '123e4567-e89b-12d3-a456-426614174001',
        changes: largeChanges,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      };

      await expect(AuditLogService.logAction(entry)).resolves.not.toThrow();
    });

    it('should handle concurrent audit log creation', async () => {
      const entries = Array.from({ length: 10 }, (_, i) => ({
        userId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'READ',
        entityType: 'Student',
        entityId: `123e4567-e89b-12d3-a456-42661417400${i}`,
        changes: {},
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      }));

      // Create 10 audit logs concurrently
      await Promise.all(entries.map(entry => AuditLogService.logAction(entry)));

      expect(mockAuditLogRepository.create).toHaveBeenCalledTimes(10);
    });
  });
});
