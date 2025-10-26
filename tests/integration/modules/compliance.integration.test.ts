/**
 * Compliance Module Integration Tests
 * Tests audit logging, compliance reports, and policy tracking
 */

import { test, expect } from '../helpers/test-client';
import { createTestStudent, verifyAuditLog } from '../helpers/test-client';
import { getPastDate } from '../helpers/test-data';

test.describe('Compliance Module Integration', () => {
  test.describe('Audit Log Operations', () => {
    test('should create audit log for PHI access', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // Access student record (should generate audit log)
      await authenticatedContext.get(`/api/v1/students/${student.id}`);

      // Verify audit log
      const auditLog = await verifyAuditLog(
        authenticatedContext,
        'student',
        student.id,
        'view'
      );

      expect(auditLog).toBeDefined();
      expect(auditLog.entityType).toBe('student');
      expect(auditLog.action).toBe('view');
    });

    test('should retrieve audit logs with pagination', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          page: 1,
          limit: 20,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.logs).toBeDefined();
      expect(Array.isArray(data.logs)).toBeTruthy();
      expect(data.pagination).toBeDefined();
    });

    test('should filter audit logs by entity type', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          entityType: 'medication',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      data.logs.forEach((log: any) => {
        expect(log.entityType).toBe('medication');
      });
    });

    test('should filter audit logs by action', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          action: 'create',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      data.logs.forEach((log: any) => {
        expect(log.action).toBe('create');
      });
    });

    test('should filter audit logs by date range', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/audit-logs', {
        params: {
          startDate: getPastDate(7),
          endDate: new Date().toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.logs)).toBeTruthy();
    });

    test('should filter audit logs by user', async ({ authenticatedContext, authTokens }) => {
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

    test('should export audit logs to CSV', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.post('/api/v1/audit-logs/export', {
        data: {
          format: 'csv',
          startDate: getPastDate(30),
          endDate: new Date().toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      expect(response.headers()['content-type']).toContain('csv');
    });
  });

  test.describe('Compliance Reports', () => {
    test('should generate HIPAA compliance report', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/compliance/reports/hipaa', {
        params: {
          startDate: getPastDate(30),
          endDate: new Date().toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.reportDate).toBeDefined();
      expect(report.phiAccessCount).toBeDefined();
      expect(report.auditLogCount).toBeDefined();
      expect(report.complianceScore).toBeDefined();
    });

    test('should generate medication compliance report', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get(
        '/api/v1/compliance/reports/medications',
        {
          params: {
            startDate: getPastDate(30),
            endDate: new Date().toISOString(),
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.totalPrescriptions).toBeDefined();
      expect(report.administrationCompliance).toBeDefined();
      expect(report.missedDoses).toBeDefined();
    });

    test('should generate immunization compliance report', async ({
      authenticatedContext,
    }) => {
      const response = await authenticatedContext.get(
        '/api/v1/compliance/reports/immunizations'
      );

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.totalStudents).toBeDefined();
      expect(report.compliantStudents).toBeDefined();
      expect(report.complianceRate).toBeDefined();
      expect(report.missingVaccines).toBeDefined();
    });

    test('should generate incident reporting compliance', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get(
        '/api/v1/compliance/reports/incidents',
        {
          params: {
            startDate: getPastDate(90),
            endDate: new Date().toISOString(),
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.totalIncidents).toBeDefined();
      expect(report.reportedWithin24Hours).toBeDefined();
      expect(report.parentNotificationRate).toBeDefined();
    });

    test('should generate emergency contact compliance', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get(
        '/api/v1/compliance/reports/emergency-contacts'
      );

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.totalStudents).toBeDefined();
      expect(report.studentsWithContacts).toBeDefined();
      expect(report.complianceRate).toBeDefined();
    });
  });

  test.describe('Policy Management', () => {
    test('should create policy document', async ({ authenticatedContext }) => {
      const policyData = {
        policyName: 'Medication Administration Policy',
        policyNumber: 'MED-001',
        category: 'medication',
        description: 'Guidelines for medication administration',
        effectiveDate: new Date().toISOString(),
        reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      };

      const response = await authenticatedContext.post('/api/v1/policies', {
        data: policyData,
      });

      expect(response.ok()).toBeTruthy();
      const policy = await response.json();

      expect(policy.id).toBeDefined();
      expect(policy.policyName).toBe('Medication Administration Policy');
      expect(policy.status).toBe('active');
    });

    test('should list all policies', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/policies');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.policies)).toBeTruthy();
    });

    test('should filter policies by category', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/policies', {
        params: {
          category: 'medication',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      data.policies.forEach((policy: any) => {
        expect(policy.category).toBe('medication');
      });
    });

    test('should retrieve policies due for review', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/policies/due-for-review');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.policies)).toBeTruthy();
    });

    test('should update policy status', async ({ authenticatedContext }) => {
      // Create policy
      const createResponse = await authenticatedContext.post('/api/v1/policies', {
        data: {
          policyName: 'Test Policy',
          policyNumber: 'TEST-001',
          category: 'general',
          description: 'Test policy',
          effectiveDate: new Date().toISOString(),
          status: 'draft',
        },
      });
      const policy = await createResponse.json();

      // Update status
      const response = await authenticatedContext.put(`/api/v1/policies/${policy.id}`, {
        data: {
          status: 'active',
        },
      });

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.status).toBe('active');
    });
  });

  test.describe('Certification Tracking', () => {
    test('should track staff certifications', async ({ authenticatedContext, authTokens }) => {
      const certificationData = {
        userId: authTokens.user.id,
        certificationType: 'First Aid',
        issuingOrganization: 'Red Cross',
        certificationNumber: 'FA-123456',
        issueDate: getPastDate(30),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      };

      const response = await authenticatedContext.post('/api/v1/certifications', {
        data: certificationData,
      });

      expect(response.ok()).toBeTruthy();
      const certification = await response.json();

      expect(certification.id).toBeDefined();
      expect(certification.certificationType).toBe('First Aid');
    });

    test('should list expiring certifications', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/certifications/expiring', {
        params: {
          days: 60,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.certifications)).toBeTruthy();
    });

    test('should list expired certifications', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/certifications/expired');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.certifications)).toBeTruthy();
    });
  });

  test.describe('Compliance Dashboard', () => {
    test('should retrieve compliance dashboard metrics', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/compliance/dashboard');

      expect(response.ok()).toBeTruthy();
      const dashboard = await response.json();

      expect(dashboard.overallComplianceScore).toBeDefined();
      expect(dashboard.medicationCompliance).toBeDefined();
      expect(dashboard.immunizationCompliance).toBeDefined();
      expect(dashboard.auditLogHealth).toBeDefined();
      expect(dashboard.policyCompliance).toBeDefined();
    });

    test('should retrieve compliance trends', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/compliance/trends', {
        params: {
          period: 'monthly',
          months: 6,
        },
      });

      expect(response.ok()).toBeTruthy();
      const trends = await response.json();

      expect(Array.isArray(trends)).toBeTruthy();
      trends.forEach((trend: any) => {
        expect(trend.month).toBeDefined();
        expect(trend.complianceScore).toBeDefined();
      });
    });
  });

  test.describe('Data Retention', () => {
    test('should verify audit log retention policy', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/compliance/retention-status');

      expect(response.ok()).toBeTruthy();
      const status = await response.json();

      expect(status.auditLogRetentionYears).toBeDefined();
      expect(status.oldestAuditLog).toBeDefined();
      expect(status.complianceStatus).toBe('compliant');
    });

    test('should list data eligible for archival', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/compliance/archival-eligible');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.totalRecords).toBeDefined();
      expect(data.recordsByType).toBeDefined();
    });
  });
});
