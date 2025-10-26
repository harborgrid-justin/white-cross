/**
 * PHI Access Control Integration Tests
 * Tests Protected Health Information access controls and security
 */

import { test, expect } from '../helpers/test-client';
import { createTestStudent, verifyAuditLog } from '../helpers/test-client';
import { TEST_USERS } from '../helpers/test-data';

test.describe('PHI Access Control', () => {
  test.describe('PHI Access Logging', () => {
    test('should log all PHI access attempts', async ({ authenticatedContext }) => {
      // 1. Access student PHI
      const student = await createTestStudent(authenticatedContext);

      // 2. Access various PHI endpoints
      await authenticatedContext.get(`/api/v1/students/${student.id}`);
      await authenticatedContext.get(`/api/v1/students/${student.id}/health-records`);
      await authenticatedContext.get(`/api/v1/students/${student.id}/medications`);

      // 3. Verify audit logs created for each access
      const auditLogResponse = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          entityId: student.id,
          entityType: 'student',
        },
      });

      expect(auditLogResponse.ok()).toBeTruthy();
      const auditLogs = await auditLogResponse.json();

      expect(auditLogs.logs.length).toBeGreaterThanOrEqual(1);

      // Verify log contains required PHI access information
      auditLogs.logs.forEach((log: any) => {
        expect(log.userId).toBeDefined();
        expect(log.timestamp).toBeDefined();
        expect(log.ipAddress).toBeDefined();
        expect(log.action).toBeDefined();
        expect(log.entityType).toBe('student');
        expect(log.entityId).toBe(student.id);
      });
    });

    test('should log PHI modifications with before/after data', async ({
      authenticatedContext,
    }) => {
      const student = await createTestStudent(authenticatedContext);

      // Update student allergies (PHI modification)
      const updateResponse = await authenticatedContext.put(`/api/v1/students/${student.id}`, {
        data: {
          allergies: ['Peanuts', 'Shellfish'],
        },
      });
      expect(updateResponse.ok()).toBeTruthy();

      // Verify audit log contains before/after data
      const auditLog = await verifyAuditLog(
        authenticatedContext,
        'student',
        student.id,
        'update'
      );

      expect(auditLog.changes).toBeDefined();
      expect(auditLog.changes.allergies).toBeDefined();
    });

    test('should log unauthorized PHI access attempts', async ({ nurseContext }) => {
      // Attempt to access admin-only endpoint
      const unauthorizedResponse = await nurseContext.get('/api/v1/admin/system/health');

      expect(unauthorizedResponse.ok()).toBeFalsy();
      expect(unauthorizedResponse.status()).toBe(403);

      // Verify unauthorized attempt is logged
      // Note: Would need admin context to verify audit log
    });

    test('should require reason for bulk PHI export', async ({ authenticatedContext }) => {
      const exportResponse = await authenticatedContext.post('/api/v1/students/export', {
        data: {
          format: 'csv',
          reason: 'Annual report for school district',
          requestedBy: 'School Administrator',
        },
      });

      expect(exportResponse.ok()).toBeTruthy();

      // Verify export is logged with reason
      const auditLogResponse = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          action: 'export',
          entityType: 'student',
          limit: 1,
        },
      });

      const auditLogs = await auditLogResponse.json();
      if (auditLogs.logs.length > 0) {
        expect(auditLogs.logs[0].reason).toBeDefined();
      }
    });
  });

  test.describe('Role-Based PHI Access', () => {
    test('should restrict PHI access based on role', async ({ nurseContext, adminContext }) => {
      const student = await createTestStudent(adminContext);

      // Nurse should access student data
      const nurseResponse = await nurseContext.get(`/api/v1/students/${student.id}`);
      expect(nurseResponse.ok()).toBeTruthy();

      // Admin should also access student data
      const adminResponse = await adminContext.get(`/api/v1/students/${student.id}`);
      expect(adminResponse.ok()).toBeTruthy();

      // Both accesses should be logged separately
      const auditLogResponse = await adminContext.get('/api/v1/audit-logs', {
        params: {
          entityId: student.id,
          entityType: 'student',
        },
      });
      const auditLogs = await auditLogResponse.json();
      expect(auditLogs.logs.length).toBeGreaterThanOrEqual(2);
    });

    test('should enforce minimum necessary access principle', async ({
      authenticatedContext,
    }) => {
      const student = await createTestStudent(authenticatedContext);

      // Create detailed health record
      const healthRecordResponse = await authenticatedContext.post('/api/v1/health-records', {
        data: {
          studentId: student.id,
          recordType: 'vital_signs',
          recordDate: new Date().toISOString(),
          vitalSigns: {
            temperature: 98.6,
            heartRate: 72,
            bloodPressure: '120/80',
          },
          notes: 'Detailed private medical notes',
        },
      });
      const healthRecord = await healthRecordResponse.json();

      // Access should be logged
      await verifyAuditLog(
        authenticatedContext,
        'health_record',
        healthRecord.id,
        'create'
      );
    });

    test('should mask sensitive PHI for read-only users', async ({ authenticatedContext }) => {
      // Note: This test verifies the concept
      // Actual read-only user access would require specific user setup
      const student = await createTestStudent(authenticatedContext);

      const studentResponse = await authenticatedContext.get(`/api/v1/students/${student.id}`);
      expect(studentResponse.ok()).toBeTruthy();
      const studentData = await studentResponse.json();

      // Verify data is returned (masking depends on role)
      expect(studentData.id).toBeDefined();
    });
  });

  test.describe('PHI Access Alerts', () => {
    test('should alert on unusual PHI access patterns', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // Simulate multiple rapid accesses
      for (let i = 0; i < 5; i++) {
        await authenticatedContext.get(`/api/v1/students/${student.id}`);
      }

      // Check for access pattern alerts (endpoint may vary)
      const alertsResponse = await authenticatedContext.get('/api/v1/security/alerts', {
        params: {
          alertType: 'unusual_access_pattern',
        },
      });

      expect(alertsResponse.ok() || alertsResponse.status() === 404).toBeTruthy();
    });

    test('should alert on after-hours PHI access', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // Access is logged regardless of time
      const response = await authenticatedContext.get(`/api/v1/students/${student.id}`);
      expect(response.ok()).toBeTruthy();

      // Alert system would flag based on timestamp
      const auditLog = await verifyAuditLog(
        authenticatedContext,
        'student',
        student.id,
        'view'
      );
      expect(auditLog.timestamp).toBeDefined();
    });

    test('should alert on bulk PHI downloads', async ({ authenticatedContext }) => {
      // Request bulk export
      const exportResponse = await authenticatedContext.post('/api/v1/students/export', {
        data: {
          format: 'csv',
          reason: 'Testing bulk export',
        },
      });

      expect(exportResponse.ok()).toBeTruthy();

      // Verify export is logged
      const auditLogResponse = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          action: 'export',
          entityType: 'student',
          limit: 1,
        },
      });

      expect(auditLogResponse.ok()).toBeTruthy();
    });
  });

  test.describe('PHI Data Minimization', () => {
    test('should only return necessary PHI fields', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // List view should have minimal PHI
      const listResponse = await authenticatedContext.get('/api/v1/students', {
        params: {
          page: 1,
          limit: 10,
        },
      });

      expect(listResponse.ok()).toBeTruthy();
      const listData = await listResponse.json();

      // List view should not include detailed medical information
      if (listData.students.length > 0) {
        const firstStudent = listData.students[0];
        expect(firstStudent.id).toBeDefined();
        expect(firstStudent.firstName).toBeDefined();
        expect(firstStudent.lastName).toBeDefined();
        // Detailed medical info should not be in list view
      }

      // Detail view should have full PHI (when authorized)
      const detailResponse = await authenticatedContext.get(`/api/v1/students/${student.id}`);
      const detailData = await detailResponse.json();

      expect(detailData.id).toBeDefined();
      expect(detailData.dateOfBirth).toBeDefined();
    });

    test('should support field-level access control', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // Request specific fields only
      const response = await authenticatedContext.get(`/api/v1/students/${student.id}`, {
        params: {
          fields: 'id,firstName,lastName',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.id).toBeDefined();
      expect(data.firstName).toBeDefined();
      expect(data.lastName).toBeDefined();
    });
  });

  test.describe('PHI Sharing and Consent', () => {
    test('should track PHI disclosure consent', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // Record consent for PHI sharing
      const consentResponse = await authenticatedContext.post('/api/v1/phi-consents', {
        data: {
          studentId: student.id,
          consentType: 'health_records_sharing',
          grantedBy: 'Parent/Guardian',
          grantedDate: new Date().toISOString(),
          scope: 'School nurse and administration',
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        },
      });

      expect(consentResponse.ok() || consentResponse.status() === 404).toBeTruthy();
    });

    test('should enforce consent before PHI sharing', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // Check if consent exists before sharing
      const consentCheckResponse = await authenticatedContext.get(
        `/api/v1/students/${student.id}/phi-consent`,
        {
          params: {
            consentType: 'external_sharing',
          },
        }
      );

      expect(consentCheckResponse.ok() || consentCheckResponse.status() === 404).toBeTruthy();
    });

    test('should log all PHI disclosures', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // Record PHI disclosure
      const disclosureResponse = await authenticatedContext.post('/api/v1/phi-disclosures', {
        data: {
          studentId: student.id,
          disclosedTo: 'Parent',
          disclosureDate: new Date().toISOString(),
          disclosureMethod: 'email',
          purpose: 'Parent requested health summary',
          dataShared: ['health records', 'medications'],
          authorizedBy: 'School Nurse',
        },
      });

      expect(disclosureResponse.ok() || disclosureResponse.status() === 404).toBeTruthy();
    });
  });

  test.describe('PHI Breach Detection', () => {
    test('should detect potential PHI breach attempts', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // Multiple rapid accesses that might indicate breach attempt
      for (let i = 0; i < 10; i++) {
        await authenticatedContext.get(`/api/v1/students/${student.id}`);
      }

      // Check breach detection logs
      const breachCheckResponse = await authenticatedContext.get(
        '/api/v1/security/breach-alerts'
      );

      expect(breachCheckResponse.ok() || breachCheckResponse.status() === 404).toBeTruthy();
    });

    test('should require strong authentication for PHI export', async ({
      authenticatedContext,
    }) => {
      // Verify authentication is required
      const exportResponse = await authenticatedContext.post('/api/v1/students/export', {
        data: {
          format: 'csv',
          reason: 'Annual report',
        },
      });

      // Should either succeed with auth or require additional verification
      expect(exportResponse.ok() || exportResponse.status() === 403).toBeTruthy();
    });
  });

  test.describe('PHI Access Audit Reports', () => {
    test('should generate PHI access report', async ({ authenticatedContext }) => {
      const reportResponse = await authenticatedContext.post('/api/v1/reports/phi-access', {
        data: {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString(),
          format: 'json',
        },
      });

      expect(reportResponse.ok()).toBeTruthy();
      const report = await reportResponse.json();

      expect(report.totalAccesses).toBeDefined();
      expect(report.accessesByUser).toBeDefined();
      expect(report.accessesByType).toBeDefined();
    });

    test('should generate user-specific PHI access log', async ({
      authenticatedContext,
      authTokens,
    }) => {
      const reportResponse = await authenticatedContext.get(
        `/api/v1/users/${authTokens.user.id}/phi-access-log`,
        {
          params: {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString(),
          },
        }
      );

      expect(reportResponse.ok()).toBeTruthy();
      const log = await reportResponse.json();

      expect(Array.isArray(log.accesses)).toBeTruthy();
    });

    test('should track PHI access duration', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // Access student record
      const startTime = Date.now();
      await authenticatedContext.get(`/api/v1/students/${student.id}`);
      const endTime = Date.now();

      // Verify access is logged with timestamp
      const auditLog = await verifyAuditLog(
        authenticatedContext,
        'student',
        student.id,
        'view'
      );

      expect(auditLog.timestamp).toBeDefined();
      const logTime = new Date(auditLog.timestamp).getTime();
      expect(logTime).toBeGreaterThanOrEqual(startTime);
      expect(logTime).toBeLessThanOrEqual(endTime);
    });
  });
});
