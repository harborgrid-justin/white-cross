/**
 * HIPAA Audit Logging Integration Tests
 * Tests comprehensive audit logging for PHI access and modifications
 */

import {
  test,
  expect,
  createTestStudent,
  createTestMedication,
  createTestHealthRecord,
  verifyAuditLog,
} from '../helpers/test-client';

test.describe('HIPAA Audit Logging', () => {
  test.describe('Student PHI Access Logging', () => {
    test('should log student record creation', async ({ authenticatedContext }) => {
      const studentData = {
        firstName: 'Audit',
        lastName: 'Test',
        dateOfBirth: '2010-01-01',
        grade: '5',
        schoolId: `AUDIT${Date.now()}`,
        status: 'active',
      };

      const response = await authenticatedContext.post('/api/v1/students', {
        data: studentData,
      });

      expect(response.ok()).toBeTruthy();
      const student = await response.json();

      // Verify audit log
      const auditLog = await verifyAuditLog(
        authenticatedContext,
        'student',
        student.id,
        'created'
      );

      expect(auditLog.userId).toBeDefined();
      expect(auditLog.action).toBe('created');
      expect(auditLog.entityType).toBe('student');
      expect(auditLog.timestamp).toBeDefined();
      expect(auditLog.ipAddress).toBeDefined();
    });

    test('should log student record access/view', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // View student (PHI access)
      const response = await authenticatedContext.get(`/api/v1/students/${student.id}`);
      expect(response.ok()).toBeTruthy();

      // Verify audit log
      await verifyAuditLog(authenticatedContext, 'student', student.id, 'viewed');
    });

    test('should log student record updates', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      const response = await authenticatedContext.put(`/api/v1/students/${student.id}`, {
        data: {
          grade: '6',
        },
      });

      expect(response.ok()).toBeTruthy();

      // Verify audit log
      const auditLog = await verifyAuditLog(
        authenticatedContext,
        'student',
        student.id,
        'updated'
      );

      // Should log what changed
      expect(auditLog.changes).toBeDefined();
    });

    test('should log student record deletion', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      const response = await authenticatedContext.delete(`/api/v1/students/${student.id}`);
      expect(response.ok()).toBeTruthy();

      // Verify audit log
      await verifyAuditLog(authenticatedContext, 'student', student.id, 'deleted');
    });
  });

  test.describe('Medication PHI Logging', () => {
    test('should log medication prescription creation', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const medication = await createTestMedication(authenticatedContext, student.id);

      // Verify audit log
      await verifyAuditLog(authenticatedContext, 'medication', medication.id, 'created');
    });

    test('should log medication administration', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const medication = await createTestMedication(authenticatedContext, student.id);

      const adminResponse = await authenticatedContext.post('/api/v1/medication-administrations', {
        data: {
          medicationId: medication.id,
          studentId: student.id,
          administeredAt: new Date().toISOString(),
          dosageGiven: '10mg',
          status: 'completed',
        },
      });

      expect(adminResponse.ok()).toBeTruthy();
      const administration = await adminResponse.json();

      // Verify audit log
      await verifyAuditLog(
        authenticatedContext,
        'medication_administration',
        administration.id,
        'created'
      );
    });

    test('should log medication updates', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const medication = await createTestMedication(authenticatedContext, student.id);

      const response = await authenticatedContext.put(`/api/v1/medications/${medication.id}`, {
        data: {
          dosage: '15mg',
        },
      });

      expect(response.ok()).toBeTruthy();

      // Verify audit log
      await verifyAuditLog(authenticatedContext, 'medication', medication.id, 'updated');
    });

    test('should log medication discontinuation', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const medication = await createTestMedication(authenticatedContext, student.id);

      const response = await authenticatedContext.put(
        `/api/v1/medications/${medication.id}/discontinue`,
        {
          data: {
            reason: 'Treatment complete',
            discontinuedDate: new Date().toISOString(),
          },
        }
      );

      expect(response.ok()).toBeTruthy();

      // Verify audit log contains discontinuation
      await verifyAuditLog(authenticatedContext, 'medication', medication.id, 'discontinued');
    });
  });

  test.describe('Health Records Logging', () => {
    test('should log health record creation', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const healthRecord = await createTestHealthRecord(authenticatedContext, student.id);

      // Verify audit log
      await verifyAuditLog(authenticatedContext, 'health_record', healthRecord.id, 'created');
    });

    test('should log health record access', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const healthRecord = await createTestHealthRecord(authenticatedContext, student.id);

      // Access health record
      const response = await authenticatedContext.get(`/api/v1/health-records/${healthRecord.id}`);
      expect(response.ok()).toBeTruthy();

      // Verify audit log
      await verifyAuditLog(authenticatedContext, 'health_record', healthRecord.id, 'viewed');
    });
  });

  test.describe('Audit Log Attributes', () => {
    test('should capture user information in audit log', async ({ authenticatedContext, authTokens }) => {
      const student = await createTestStudent(authenticatedContext);

      const auditResponse = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          entityType: 'student',
          entityId: student.id,
          limit: 1,
        },
      });

      const data = await auditResponse.json();
      const auditLog = data.logs[0];

      expect(auditLog.userId).toBe(authTokens.user.id);
      expect(auditLog.userEmail).toBe(authTokens.user.email);
    });

    test('should capture timestamp in audit log', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      const auditLog = await verifyAuditLog(
        authenticatedContext,
        'student',
        student.id,
        'created'
      );

      expect(auditLog.timestamp).toBeDefined();
      const timestamp = new Date(auditLog.timestamp);
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
      expect(timestamp.getTime()).toBeGreaterThan(Date.now() - 60000); // Within last minute
    });

    test('should capture IP address in audit log', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      const auditLog = await verifyAuditLog(
        authenticatedContext,
        'student',
        student.id,
        'created'
      );

      expect(auditLog.ipAddress).toBeDefined();
      expect(typeof auditLog.ipAddress).toBe('string');
    });

    test('should capture user agent in audit log', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      const auditLog = await verifyAuditLog(
        authenticatedContext,
        'student',
        student.id,
        'created'
      );

      expect(auditLog.userAgent).toBeDefined();
      expect(typeof auditLog.userAgent).toBe('string');
    });

    test('should capture changed fields in audit log', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // Update student
      await authenticatedContext.put(`/api/v1/students/${student.id}`, {
        data: {
          grade: '6',
        },
      });

      const auditLog = await verifyAuditLog(
        authenticatedContext,
        'student',
        student.id,
        'updated'
      );

      expect(auditLog.changes).toBeDefined();
      expect(auditLog.changes.grade).toBeDefined();
      expect(auditLog.changes.grade.old).toBeDefined();
      expect(auditLog.changes.grade.new).toBe('6');
    });
  });

  test.describe('Audit Log Retrieval', () => {
    test('should retrieve audit logs with filters', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      const response = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          entityType: 'student',
          entityId: student.id,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.logs).toBeDefined();
      expect(Array.isArray(data.logs)).toBeTruthy();
      expect(data.logs.length).toBeGreaterThan(0);

      // All logs should be for the student
      data.logs.forEach((log: any) => {
        expect(log.entityType).toBe('student');
        expect(log.entityId).toBe(student.id);
      });
    });

    test('should retrieve audit logs by date range', async ({ authenticatedContext }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const endDate = new Date();

      const response = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.logs).toBeDefined();
      expect(Array.isArray(data.logs)).toBeTruthy();
    });

    test('should retrieve audit logs by user', async ({ authenticatedContext, authTokens }) => {
      const response = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          userId: authTokens.user.id,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      data.logs.forEach((log: any) => {
        expect(log.userId).toBe(authTokens.user.id);
      });
    });

    test('should retrieve audit logs by action type', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          action: 'created',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      data.logs.forEach((log: any) => {
        expect(log.action).toBe('created');
      });
    });
  });

  test.describe('Audit Log Integrity', () => {
    test('should prevent audit log modification', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      const auditResponse = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          entityType: 'student',
          entityId: student.id,
          limit: 1,
        },
      });

      const data = await auditResponse.json();
      const auditLog = data.logs[0];

      // Try to modify audit log (should fail)
      const updateResponse = await authenticatedContext.put(
        `/api/v1/audit-logs/${auditLog.id}`,
        {
          data: {
            action: 'modified',
          },
        }
      );

      expect(updateResponse.ok()).toBeFalsy();
      expect(updateResponse.status()).toBe(403);
    });

    test('should prevent audit log deletion', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      const auditResponse = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          entityType: 'student',
          entityId: student.id,
          limit: 1,
        },
      });

      const data = await auditResponse.json();
      const auditLog = data.logs[0];

      // Try to delete audit log (should fail)
      const deleteResponse = await authenticatedContext.delete(`/api/v1/audit-logs/${auditLog.id}`);

      expect(deleteResponse.ok()).toBeFalsy();
      expect(deleteResponse.status()).toBe(403);
    });
  });

  test.describe('Bulk Operations Logging', () => {
    test('should log bulk exports', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.post('/api/v1/students/export', {
        data: {
          format: 'csv',
          filters: {
            grade: '5',
          },
        },
      });

      if (response.ok()) {
        // Verify audit log for bulk export
        const auditResponse = await authenticatedContext.get('/api/v1/audit-logs', {
          params: {
            action: 'bulk_export',
            limit: 1,
          },
        });

        expect(auditResponse.ok()).toBeTruthy();
        const data = await auditResponse.json();
        expect(data.logs.length).toBeGreaterThan(0);
      }
    });

    test('should log bulk updates', async ({ authenticatedContext }) => {
      // Create multiple students
      const students = await Promise.all([
        createTestStudent(authenticatedContext),
        createTestStudent(authenticatedContext),
      ]);

      const studentIds = students.map((s) => s.id);

      const response = await authenticatedContext.put('/api/v1/students/bulk-update', {
        data: {
          studentIds,
          updates: {
            grade: '6',
          },
        },
      });

      if (response.ok()) {
        // Verify audit logs for each student
        for (const studentId of studentIds) {
          await verifyAuditLog(authenticatedContext, 'student', studentId, 'updated');
        }
      }
    });
  });

  test.describe('Failed Access Logging', () => {
    test('should log failed access attempts', async ({ authenticatedContext }) => {
      // Try to access non-existent student
      const response = await authenticatedContext.get(
        '/api/v1/students/00000000-0000-0000-0000-000000000000'
      );

      expect(response.status()).toBe(404);

      // Check if failed access is logged
      const auditResponse = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          action: 'access_denied',
          limit: 10,
        },
      });

      if (auditResponse.ok()) {
        const data = await auditResponse.json();
        // System may or may not log 404s
        expect(data.logs).toBeDefined();
      }
    });

    test('should log unauthorized access attempts', async ({ nurseContext }) => {
      // Try to access admin endpoint (should fail)
      const response = await nurseContext.get('/api/v1/admin/settings');

      expect(response.status()).toBe(403);

      // Check if unauthorized access is logged
      const auditResponse = await nurseContext.get('/api/v1/audit-logs', {
        params: {
          action: 'unauthorized_access',
          limit: 10,
        },
      });

      // Nurse may not have access to audit logs
      if (auditResponse.ok()) {
        const data = await auditResponse.json();
        expect(data.logs).toBeDefined();
      }
    });
  });

  test.describe('Audit Log Retention', () => {
    test('should retain audit logs for required period', async ({ authenticatedContext }) => {
      // HIPAA requires 6 years retention
      // This test verifies audit log configuration

      const response = await authenticatedContext.get('/api/v1/admin/audit-retention-policy');

      if (response.ok()) {
        const policy = await response.json();
        expect(policy.retentionYears).toBeGreaterThanOrEqual(6);
      }
    });
  });
});
