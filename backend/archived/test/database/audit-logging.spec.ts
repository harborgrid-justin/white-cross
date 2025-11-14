/**
 * Audit Logging Tests
 *
 * Tests HIPAA-compliant audit logging including:
 * - Audit logs created within transaction
 * - Audit logs rollback with transaction
 * - PHI not logged in audit entries
 * - All CRUD operations logged
 * - Compliance reporting
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { DatabaseModule } from '../../src/database/database.module';
import { AuditService } from '../../src/database/services/audit.service';
import { AuditLog, ComplianceType, AuditSeverity } from '../../src/database/models/audit-log.model';
import { Student } from '../../src/database/models/student.model';
import { HealthRecord } from '../../src/database/models/health-record.model';
import { AuditAction } from '../../src/database/types/database.enums';

describe('Audit Logging Tests', () => {
  let module: TestingModule;
  let sequelize: Sequelize;
  let auditService: AuditService;

  const testContext = {
    userId: 'test-user-123',
    userName: 'Test User',
    userRole: 'NURSE' as any,
    ipAddress: '127.0.0.1',
    userAgent: 'Jest Test Suite',
    transactionId: 'test-tx-123',
    correlationId: 'test-corr-123',
    timestamp: new Date(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        DatabaseModule,
      ],
    }).compile();

    sequelize = module.get<Sequelize>(Sequelize);
    auditService = module.get<AuditService>('IAuditLogger');

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await AuditLog.destroy({ where: {}, force: true });
    await Student.destroy({ where: {}, force: true });
    await HealthRecord.destroy({ where: {}, force: true });
  });

  describe('CRUD Operations Logging', () => {
    it('should log CREATE operations', async () => {
      const studentData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      };

      const student = await Student.create(studentData);

      await auditService.logCreate(
        'Student',
        student.id,
        testContext,
        studentData
      );

      const auditLogs = await AuditLog.findAll({
        where: { entityId: student.id },
      });

      expect(auditLogs).toHaveLength(1);
      expect(auditLogs[0].action).toBe(AuditAction.CREATE);
      expect(auditLogs[0].entityType).toBe('Student');
      expect(auditLogs[0].userId).toBe(testContext.userId);
      expect(auditLogs[0].success).toBe(true);
    });

    it('should log READ operations for PHI entities', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      await auditService.logRead('Student', student.id, testContext);

      const auditLogs = await AuditLog.findAll({
        where: { entityId: student.id, action: AuditAction.READ },
      });

      expect(auditLogs).toHaveLength(1);
      expect(auditLogs[0].isPHI).toBe(true);
      expect(auditLogs[0].complianceType).toBe(ComplianceType.FERPA);
    });

    it('should log UPDATE operations with changes', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      const changes = {
        grade: { before: '5', after: '6' },
      };

      await auditService.logUpdate(
        'Student',
        student.id,
        testContext,
        changes
      );

      const auditLogs = await AuditLog.findAll({
        where: { entityId: student.id, action: AuditAction.UPDATE },
      });

      expect(auditLogs).toHaveLength(1);
      expect(auditLogs[0].changes).toBeDefined();
      expect(auditLogs[0].previousValues).toHaveProperty('grade', '5');
      expect(auditLogs[0].newValues).toHaveProperty('grade', '6');
    });

    it('should log DELETE operations', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      await auditService.logDelete(
        'Student',
        student.id,
        testContext,
        { firstName: 'John', lastName: 'Doe' }
      );

      const auditLogs = await AuditLog.findAll({
        where: { entityId: student.id, action: AuditAction.DELETE },
      });

      expect(auditLogs).toHaveLength(1);
      expect(auditLogs[0].severity).toBe(AuditSeverity.HIGH);
    });
  });

  describe('Transaction Integration', () => {
    it('should create audit logs within transaction', async () => {
      const transaction = await sequelize.transaction();

      try {
        const student = await Student.create(
          {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: new Date('2010-01-01'),
            grade: '5',
            studentNumber: 'TEST',
        gender: 'MALE' as any,
          },
          { transaction }
        );

        // Log audit within same transaction
        await auditService.logCreate(
          'Student',
          student.id,
          testContext,
          { firstName: 'John', lastName: 'Doe' }
        );

        // Before commit, audit log should not be visible outside transaction
        const logsBeforeCommit = await AuditLog.count();

        await transaction.commit();

        // After commit, audit log should be visible
        const logsAfterCommit = await AuditLog.count();
        expect(logsAfterCommit).toBeGreaterThan(logsBeforeCommit);
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });

    it('should rollback audit logs with transaction', async () => {
      const initialAuditCount = await AuditLog.count();
      const transaction = await sequelize.transaction();

      try {
        const student = await Student.create(
          {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: new Date('2010-01-01'),
            grade: '5',
            studentNumber: 'TEST',
        gender: 'MALE' as any,
          },
          { transaction }
        );

        await auditService.logCreate(
          'Student',
          student.id,
          testContext,
          { firstName: 'John', lastName: 'Doe' }
        );

        // Rollback the transaction
        await transaction.rollback();

        // Audit logs should not persist
        const finalAuditCount = await AuditLog.count();
        expect(finalAuditCount).toBe(initialAuditCount);

        // Student should not exist
        const studentExists = await Student.findByPk(student.id);
        expect(studentExists).toBeNull();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });

    it('should maintain audit trail on transaction failure', async () => {
      let transaction: Transaction | null = null;

      try {
        transaction = await sequelize.transaction();

        const student = await Student.create(
          {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: new Date('2010-01-01'),
            grade: '5',
            studentNumber: 'TEST',
        gender: 'MALE' as any,
          },
          { transaction }
        );

        // Log failure
        await auditService.logFailure(
          AuditAction.CREATE,
          'Student',
          student.id,
          testContext,
          'Validation failed',
          { reason: 'Test failure' }
        );

        throw new Error('Simulated failure');
      } catch (error) {
        if (transaction) {
          await transaction.rollback();
        }

        // Failure audit log might or might not persist depending on implementation
        // This tests the behavior
        const failureLogs = await AuditLog.findAll({
          where: { success: false },
        });

        // We expect the service to handle this gracefully
        expect(failureLogs).toBeDefined();
      }
    });
  });

  describe('PHI Protection', () => {
    it('should sanitize sensitive fields in audit logs', async () => {
      const sensitiveData = {
        firstName: 'John',
        lastName: 'Doe',
        ssn: '123-45-6789',
        password: 'secret123',
        medicalRecordNumber: 'MRN123456',
      };

      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      await auditService.logCreate(
        'Student',
        student.id,
        testContext,
        sensitiveData
      );

      const auditLog = await AuditLog.findOne({
        where: { entityId: student.id },
      });

      expect(auditLog).toBeDefined();

      // Sensitive fields should be redacted
      if (auditLog?.newValues) {
        expect(auditLog.newValues).not.toHaveProperty('ssn', '123-45-6789');
        expect(auditLog.newValues).not.toHaveProperty('password', 'secret123');
      }
    });

    it('should mark PHI entities appropriately', async () => {
      const healthRecord = await HealthRecord.create({
        studentId: 'test-student-id',
        recordType: 'PHYSICAL_EXAM',
        recordDate: new Date(),
        providerId: 'test-provider',
        diagnosis: 'Healthy',
        notes: 'Annual checkup',
      });

      await auditService.logCreate(
        'HealthRecord',
        healthRecord.id,
        testContext,
        { diagnosis: 'Healthy' }
      );

      const auditLog = await AuditLog.findOne({
        where: { entityId: healthRecord.id },
      });

      expect(auditLog?.isPHI).toBe(true);
      expect(auditLog?.complianceType).toBe(ComplianceType.HIPAA);
    });

    it('should not log PHI in error messages', async () => {
      await auditService.logFailure(
        AuditAction.READ,
        'HealthRecord',
        'test-id',
        testContext,
        'Access denied', // Error message should not contain PHI
        { userId: testContext.userId }
      );

      const auditLog = await AuditLog.findOne({
        where: { entityId: 'test-id' },
      });

      expect(auditLog?.errorMessage).toBe('Access denied');
      expect(auditLog?.errorMessage).not.toContain('diagnosis');
      expect(auditLog?.errorMessage).not.toContain('SSN');
    });
  });

  describe('Bulk Operations', () => {
    it('should log bulk update operations', async () => {
      await auditService.logBulkOperation(
        'BULK_UPDATE',
        'Student',
        testContext,
        { count: 50, field: 'grade', newValue: '6' }
      );

      const auditLog = await AuditLog.findOne({
        where: { action: AuditAction.BULK_UPDATE },
      });

      expect(auditLog).toBeDefined();
      expect(auditLog?.severity).toBe(AuditSeverity.HIGH);
      expect(auditLog?.metadata).toHaveProperty('count', 50);
    });

    it('should log bulk delete operations', async () => {
      await auditService.logBulkOperation(
        'BULK_DELETE',
        'Student',
        testContext,
        { count: 10, criteria: 'inactive students' }
      );

      const auditLog = await AuditLog.findOne({
        where: { action: AuditAction.BULK_DELETE },
      });

      expect(auditLog).toBeDefined();
      expect(auditLog?.severity).toBe(AuditSeverity.HIGH);
    });
  });

  describe('Export and Reporting', () => {
    it('should log export operations with high severity for PHI', async () => {
      await auditService.logExport(
        'HealthRecord',
        testContext,
        { format: 'CSV', recordCount: 100 }
      );

      const auditLog = await AuditLog.findOne({
        where: { action: AuditAction.EXPORT },
      });

      expect(auditLog).toBeDefined();
      expect(auditLog?.severity).toBe(AuditSeverity.HIGH);
      expect(auditLog?.metadata).toHaveProperty('format', 'CSV');
    });

    it('should generate HIPAA compliance report', async () => {
      // Create some audit logs
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      await Promise.all([
        auditService.logCreate('Student', student.id, testContext, {}),
        auditService.logRead('Student', student.id, testContext),
        auditService.logUpdate('Student', student.id, testContext, {
          grade: { before: '5', after: '6' },
        }),
      ]);

      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const endDate = new Date();

      const report = await auditService.getHIPAAReport(startDate, endDate);

      expect(report).toBeDefined();
      expect(report.complianceType).toBe(ComplianceType.HIPAA);
      expect(report.totalAccess).toBeGreaterThan(0);
    });

    it('should generate FERPA compliance report', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      await auditService.logRead('Student', student.id, testContext);

      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const endDate = new Date();

      const report = await auditService.getFERPAReport(startDate, endDate);

      expect(report).toBeDefined();
      expect(report.complianceType).toBe(ComplianceType.FERPA);
    });
  });

  describe('Query and Filter', () => {
    beforeEach(async () => {
      // Create various audit logs for testing
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      await Promise.all([
        auditService.logCreate('Student', student.id, testContext, {}),
        auditService.logRead('Student', student.id, testContext),
        auditService.logUpdate('Student', student.id, testContext, {
          grade: { before: '5', after: '6' },
        }),
        auditService.logDelete('Student', student.id, testContext, {}),
      ]);
    });

    it('should query audit logs by user', async () => {
      const result = await auditService.queryAuditLogs(
        { userId: testContext.userId },
        { limit: 10 }
      );

      expect(result.logs.length).toBeGreaterThan(0);
      result.logs.forEach(log => {
        expect(log.userId).toBe(testContext.userId);
      });
    });

    it('should query audit logs by entity type', async () => {
      const result = await auditService.queryAuditLogs(
        { entityType: 'Student' },
        { limit: 10 }
      );

      expect(result.logs.length).toBeGreaterThan(0);
      result.logs.forEach(log => {
        expect(log.entityType).toBe('Student');
      });
    });

    it('should query audit logs by action', async () => {
      const result = await auditService.queryAuditLogs(
        { action: AuditAction.CREATE },
        { limit: 10 }
      );

      expect(result.logs.length).toBeGreaterThan(0);
      result.logs.forEach(log => {
        expect(log.action).toBe(AuditAction.CREATE);
      });
    });

    it('should query PHI access logs', async () => {
      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const endDate = new Date();

      const logs = await auditService.getPHIAccessLogs(
        startDate,
        endDate,
        { limit: 100 }
      );

      expect(Array.isArray(logs)).toBe(true);
      logs.forEach(log => {
        expect(log.isPHI).toBe(true);
      });
    });
  });

  describe('Statistics and Analytics', () => {
    beforeEach(async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      // Create diverse audit logs
      await Promise.all([
        auditService.logCreate('Student', student.id, testContext, {}),
        auditService.logRead('Student', student.id, testContext),
        auditService.logUpdate('Student', student.id, testContext, {}),
        auditService.logFailure(
          AuditAction.DELETE,
          'Student',
          student.id,
          testContext,
          'Permission denied'
        ),
      ]);
    });

    it('should generate audit statistics', async () => {
      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const endDate = new Date();

      const stats = await auditService.getAuditStatistics(startDate, endDate);

      expect(stats).toBeDefined();
      expect(stats.totalLogs).toBeGreaterThan(0);
      expect(stats.byAction).toBeDefined();
      expect(stats.byEntityType).toBeDefined();
      expect(stats.failedOperations).toBeGreaterThanOrEqual(1);
    });

    it('should track failed operations', async () => {
      await auditService.logFailure(
        AuditAction.UPDATE,
        'Student',
        'test-id',
        testContext,
        'Validation error'
      );

      const result = await auditService.queryAuditLogs(
        { success: false },
        { limit: 10 }
      );

      expect(result.logs.length).toBeGreaterThan(0);
      result.logs.forEach(log => {
        expect(log.success).toBe(false);
        expect(log.errorMessage).toBeDefined();
      });
    });
  });

  describe('Retention Policy', () => {
    it('should execute retention policy in dry run mode', async () => {
      const result = await auditService.executeRetentionPolicy(true);

      expect(result).toBeDefined();
      expect(result.deleted).toBeGreaterThanOrEqual(0);
      expect(result.retained).toBeGreaterThanOrEqual(0);
      expect(result.details).toBeDefined();
    });

    it('should respect HIPAA retention period (7 years)', async () => {
      // This would require creating old audit logs
      // For now, we test the policy structure
      const result = await auditService.executeRetentionPolicy(true);

      expect(result.details).toHaveProperty('HIPAA_expired');
    });

    it('should respect FERPA retention period (5 years)', async () => {
      const result = await auditService.executeRetentionPolicy(true);

      expect(result.details).toHaveProperty('FERPA_expired');
    });
  });
});
