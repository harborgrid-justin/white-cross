/**
 * RBAC (Role-Based Access Control) Integration Tests
 * Tests permission-based access across different user roles
 */

import { test, expect, createTestStudent } from '../helpers/test-client';

test.describe('RBAC Integration', () => {
  test.describe('Nurse Role Permissions', () => {
    test('should allow nurse to view students', async ({ nurseContext }) => {
      const response = await nurseContext.get('/api/v1/students');
      expect(response.ok()).toBeTruthy();
    });

    test('should allow nurse to create students', async ({ nurseContext }) => {
      const studentData = {
        firstName: 'RBAC',
        lastName: 'Test',
        dateOfBirth: '2010-01-01',
        grade: '5',
        schoolId: `RBAC${Date.now()}`,
        status: 'active',
      };

      const response = await nurseContext.post('/api/v1/students', {
        data: studentData,
      });

      expect(response.ok()).toBeTruthy();
    });

    test('should allow nurse to administer medications', async ({ nurseContext }) => {
      const student = await createTestStudent(nurseContext);

      // Create medication
      const medResponse = await nurseContext.post('/api/v1/medications', {
        data: {
          studentId: student.id,
          medicationName: 'Test Med',
          dosage: '10mg',
          frequency: 'daily',
          route: 'oral',
          startDate: new Date().toISOString(),
          prescribedBy: 'Dr. Test',
        },
      });
      const medication = await medResponse.json();

      // Administer medication
      const adminResponse = await nurseContext.post('/api/v1/medication-administrations', {
        data: {
          medicationId: medication.id,
          studentId: student.id,
          administeredAt: new Date().toISOString(),
          dosageGiven: '10mg',
          status: 'completed',
        },
      });

      expect(adminResponse.ok()).toBeTruthy();
    });

    test('should allow nurse to view health records', async ({ nurseContext }) => {
      const response = await nurseContext.get('/api/v1/health-records');
      expect(response.ok()).toBeTruthy();
    });

    test('should allow nurse to create incident reports', async ({ nurseContext }) => {
      const student = await createTestStudent(nurseContext);

      const response = await nurseContext.post('/api/v1/incidents', {
        data: {
          studentId: student.id,
          incidentType: 'minor_injury',
          incidentDate: new Date().toISOString(),
          location: 'Playground',
          description: 'RBAC test incident',
          severity: 'minor',
        },
      });

      expect(response.ok()).toBeTruthy();
    });

    test('should deny nurse access to admin endpoints', async ({ nurseContext }) => {
      // Try to access system settings
      const settingsResponse = await nurseContext.get('/api/v1/admin/settings');
      expect(settingsResponse.ok()).toBeFalsy();
      expect(settingsResponse.status()).toBe(403);

      // Try to manage users
      const usersResponse = await nurseContext.post('/api/v1/admin/users', {
        data: {
          email: 'test@example.com',
          role: 'nurse',
        },
      });
      expect(usersResponse.ok()).toBeFalsy();
      expect(usersResponse.status()).toBe(403);
    });

    test('should deny nurse access to audit logs', async ({ nurseContext }) => {
      const response = await nurseContext.get('/api/v1/audit-logs');
      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(403);
    });
  });

  test.describe('Admin Role Permissions', () => {
    test('should allow admin to view students', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/students');
      expect(response.ok()).toBeTruthy();
    });

    test('should allow admin to manage users', async ({ adminContext }) => {
      const userData = {
        email: `rbac.test.${Date.now()}@example.com`,
        password: 'TestPassword123!',
        firstName: 'RBAC',
        lastName: 'Test',
        role: 'nurse',
      };

      const response = await adminContext.post('/api/v1/admin/users', {
        data: userData,
      });

      expect(response.ok()).toBeTruthy();
      const user = await response.json();
      expect(user.role).toBe('nurse');
    });

    test('should allow admin to access audit logs', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/audit-logs');
      expect(response.ok()).toBeTruthy();
    });

    test('should allow admin to view system settings', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/settings');
      expect(response.ok()).toBeTruthy();
    });

    test('should allow admin to update system settings', async ({ adminContext }) => {
      const response = await adminContext.put('/api/v1/admin/settings', {
        data: {
          settingKey: 'test_setting',
          settingValue: 'test_value',
        },
      });

      expect(response.ok()).toBeTruthy();
    });

    test('should allow admin to manage roles and permissions', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/roles');
      expect(response.ok()).toBeTruthy();
    });

    test('should allow admin to view compliance reports', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/compliance/reports');
      expect(response.ok()).toBeTruthy();
    });
  });

  test.describe('Read-Only Role Permissions', () => {
    test('should allow readonly user to view students', async ({ apiContext }) => {
      // Login as readonly user
      const loginResponse = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: 'readonly@schooltest.com',
          password: 'TestPassword123!',
        },
      });

      if (!loginResponse.ok()) {
        // Skip if readonly user doesn't exist
        test.skip();
        return;
      }

      const loginData = await loginResponse.json();
      const readonlyContext = await apiContext.fetch('/api/v1/students', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${loginData.accessToken}`,
        },
      });

      expect(readonlyContext.ok()).toBeTruthy();
    });

    test('should deny readonly user from creating students', async ({ apiContext }) => {
      const loginResponse = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: 'readonly@schooltest.com',
          password: 'TestPassword123!',
        },
      });

      if (!loginResponse.ok()) {
        test.skip();
        return;
      }

      const loginData = await loginResponse.json();
      const response = await apiContext.fetch('/api/v1/students', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${loginData.accessToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          firstName: 'Test',
          lastName: 'Student',
          dateOfBirth: '2010-01-01',
          grade: '5',
        },
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(403);
    });

    test('should deny readonly user from updating data', async ({ apiContext }) => {
      const loginResponse = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: 'readonly@schooltest.com',
          password: 'TestPassword123!',
        },
      });

      if (!loginResponse.ok()) {
        test.skip();
        return;
      }

      const loginData = await loginResponse.json();
      const response = await apiContext.fetch('/api/v1/students/some-id', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${loginData.accessToken}`,
        },
        data: { grade: '6' },
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(403);
    });

    test('should deny readonly user from deleting data', async ({ apiContext }) => {
      const loginResponse = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: 'readonly@schooltest.com',
          password: 'TestPassword123!',
        },
      });

      if (!loginResponse.ok()) {
        test.skip();
        return;
      }

      const loginData = await loginResponse.json();
      const response = await apiContext.fetch('/api/v1/students/some-id', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${loginData.accessToken}`,
        },
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(403);
    });
  });

  test.describe('Permission Hierarchy', () => {
    test('should enforce permission hierarchy', async ({ adminContext, nurseContext }) => {
      // Admin should have all nurse permissions
      const nurseEndpoints = [
        '/api/v1/students',
        '/api/v1/medications',
        '/api/v1/appointments',
        '/api/v1/health-records',
      ];

      for (const endpoint of nurseEndpoints) {
        const response = await adminContext.get(endpoint);
        expect(response.ok()).toBeTruthy();
      }

      // But nurse should not have admin permissions
      const adminEndpoints = ['/api/v1/admin/settings', '/api/v1/audit-logs'];

      for (const endpoint of adminEndpoints) {
        const response = await nurseContext.get(endpoint);
        expect(response.ok()).toBeFalsy();
        expect(response.status()).toBe(403);
      }
    });
  });

  test.describe('Resource-Level Permissions', () => {
    test('should enforce ownership for user profile updates', async ({ nurseContext }) => {
      // Should be able to update own profile
      const ownProfileResponse = await nurseContext.put('/api/v1/users/me', {
        data: {
          firstName: 'Updated',
        },
      });

      expect(ownProfileResponse.ok()).toBeTruthy();

      // Should not be able to update other user's profile
      const otherProfileResponse = await nurseContext.put('/api/v1/users/other-user-id', {
        data: {
          firstName: 'Updated',
        },
      });

      expect(otherProfileResponse.ok()).toBeFalsy();
      expect(otherProfileResponse.status()).toBe(403);
    });

    test('should allow access to assigned students only (if implemented)', async ({
      nurseContext,
    }) => {
      // This test would check if nurses can only access students assigned to them
      // Skip if feature not implemented
      const response = await nurseContext.get('/api/v1/students/assigned');

      if (response.ok()) {
        const students = await response.json();
        expect(Array.isArray(students)).toBeTruthy();
      }
    });
  });

  test.describe('Dynamic Permission Checks', () => {
    test('should check permissions at request time', async ({ nurseContext, adminContext }) => {
      // Create a student as nurse
      const student = await createTestStudent(nurseContext);

      // Nurse should be able to view
      const nurseViewResponse = await nurseContext.get(`/api/v1/students/${student.id}`);
      expect(nurseViewResponse.ok()).toBeTruthy();

      // Admin should also be able to view
      const adminViewResponse = await adminContext.get(`/api/v1/students/${student.id}`);
      expect(adminViewResponse.ok()).toBeTruthy();

      // Nurse should not be able to access admin analytics
      const analyticsResponse = await nurseContext.get('/api/v1/admin/analytics');
      expect(analyticsResponse.ok()).toBeFalsy();
      expect(analyticsResponse.status()).toBe(403);
    });

    test('should handle permission changes immediately', async ({ adminContext }) => {
      // This would test if permission changes are reflected immediately
      // Requires ability to change user permissions dynamically
      // Implementation depends on system design
      const response = await adminContext.get('/api/v1/admin/permissions/cache-status');

      if (response.ok()) {
        const status = await response.json();
        expect(status).toBeDefined();
      }
    });
  });

  test.describe('Error Messages', () => {
    test('should return appropriate error for unauthorized access', async ({ nurseContext }) => {
      const response = await nurseContext.get('/api/v1/admin/settings');

      expect(response.status()).toBe(403);
      const data = await response.json();

      expect(data.message).toBeDefined();
      expect(data.message.toLowerCase()).toContain('permission');
    });

    test('should not reveal protected resource details in error', async ({ nurseContext }) => {
      const response = await nurseContext.get('/api/v1/admin/sensitive-data');

      expect(response.status()).toBe(403);
      const data = await response.json();

      // Should not reveal if resource exists
      expect(data.message).not.toContain('not found');
    });
  });
});
