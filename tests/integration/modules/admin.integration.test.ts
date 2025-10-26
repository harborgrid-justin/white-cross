/**
 * Admin Module Integration Tests
 * Tests user management, system settings, and administrative functions
 */

import { test, expect } from '../helpers/test-client';
import { generateTestEmail } from '../helpers/test-data';

test.describe('Admin Module Integration', () => {
  test.describe('User Management', () => {
    test('should create new user', async ({ adminContext }) => {
      const userData = {
        email: generateTestEmail(),
        firstName: 'Test',
        lastName: 'User',
        role: 'nurse',
        password: 'TestPassword123!',
        active: true,
      };

      const response = await adminContext.post('/api/v1/users', {
        data: userData,
      });

      expect(response.ok()).toBeTruthy();
      const user = await response.json();

      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe('nurse');
      expect(user.password).toBeUndefined(); // Password should not be returned
    });

    test('should retrieve user by ID', async ({ adminContext }) => {
      // Create user
      const createResponse = await adminContext.post('/api/v1/users', {
        data: {
          email: generateTestEmail(),
          firstName: 'John',
          lastName: 'Doe',
          role: 'nurse',
          password: 'TestPassword123!',
        },
      });
      const created = await createResponse.json();

      // Retrieve user
      const response = await adminContext.get(`/api/v1/users/${created.id}`);

      expect(response.ok()).toBeTruthy();
      const user = await response.json();

      expect(user.id).toBe(created.id);
      expect(user.email).toBe(created.email);
    });

    test('should update user details', async ({ adminContext }) => {
      // Create user
      const createResponse = await adminContext.post('/api/v1/users', {
        data: {
          email: generateTestEmail(),
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'nurse',
          password: 'TestPassword123!',
        },
      });
      const created = await createResponse.json();

      // Update user
      const updateData = {
        firstName: 'Janet',
        lastName: 'Smith-Jones',
      };

      const response = await adminContext.put(`/api/v1/users/${created.id}`, {
        data: updateData,
      });

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.firstName).toBe('Janet');
      expect(updated.lastName).toBe('Smith-Jones');
    });

    test('should deactivate user', async ({ adminContext }) => {
      // Create user
      const createResponse = await adminContext.post('/api/v1/users', {
        data: {
          email: generateTestEmail(),
          firstName: 'Test',
          lastName: 'Deactivate',
          role: 'nurse',
          password: 'TestPassword123!',
        },
      });
      const created = await createResponse.json();

      // Deactivate user
      const response = await adminContext.put(`/api/v1/users/${created.id}`, {
        data: {
          active: false,
        },
      });

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.active).toBe(false);
    });

    test('should list all users with pagination', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/users', {
        params: {
          page: 1,
          limit: 20,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.users).toBeDefined();
      expect(Array.isArray(data.users)).toBeTruthy();
      expect(data.pagination).toBeDefined();
    });

    test('should filter users by role', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/users', {
        params: {
          role: 'nurse',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      data.users.forEach((user: any) => {
        expect(user.role).toBe('nurse');
      });
    });

    test('should filter users by status', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/users', {
        params: {
          active: true,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      data.users.forEach((user: any) => {
        expect(user.active).toBe(true);
      });
    });

    test('should search users by name or email', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/users/search', {
        params: {
          query: 'nurse',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.users)).toBeTruthy();
    });
  });

  test.describe('Role Management', () => {
    test('should list all roles', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/roles');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.roles)).toBeTruthy();
      expect(data.roles.length).toBeGreaterThan(0);
    });

    test('should retrieve role permissions', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/roles/nurse/permissions');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.role).toBe('nurse');
      expect(data.permissions).toBeDefined();
      expect(Array.isArray(data.permissions)).toBeTruthy();
    });

    test('should update role permissions', async ({ adminContext }) => {
      const updateData = {
        permissions: ['students.view', 'students.create', 'medications.view'],
      };

      const response = await adminContext.put('/api/v1/roles/custom-role/permissions', {
        data: updateData,
      });

      expect(response.ok() || response.status() === 404).toBeTruthy();
    });
  });

  test.describe('System Settings', () => {
    test('should retrieve all system settings', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/settings');

      expect(response.ok()).toBeTruthy();
      const settings = await response.json();

      expect(settings).toBeDefined();
      expect(typeof settings).toBe('object');
    });

    test('should update system setting', async ({ adminContext }) => {
      const updateData = {
        key: 'medication_reminder_window',
        value: '30',
        description: 'Minutes before medication due to send reminder',
      };

      const response = await adminContext.put('/api/v1/settings', {
        data: updateData,
      });

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.key).toBe('medication_reminder_window');
      expect(updated.value).toBe('30');
    });

    test('should retrieve setting by key', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/settings/appointment_duration');

      expect(response.ok() || response.status() === 404).toBeTruthy();
    });

    test('should list settings by category', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/settings', {
        params: {
          category: 'notifications',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.settings)).toBeTruthy();
    });
  });

  test.describe('School Management', () => {
    test('should create school', async ({ adminContext }) => {
      const schoolData = {
        schoolName: 'Test Elementary School',
        schoolCode: `TEST${Date.now()}`,
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        phoneNumber: '555-0100',
        active: true,
      };

      const response = await adminContext.post('/api/v1/schools', {
        data: schoolData,
      });

      expect(response.ok()).toBeTruthy();
      const school = await response.json();

      expect(school.id).toBeDefined();
      expect(school.schoolName).toBe('Test Elementary School');
    });

    test('should list all schools', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/schools');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.schools)).toBeTruthy();
    });

    test('should update school details', async ({ adminContext }) => {
      // Create school
      const createResponse = await adminContext.post('/api/v1/schools', {
        data: {
          schoolName: 'Update Test School',
          schoolCode: `UPD${Date.now()}`,
          address: '456 Update Ave',
          city: 'Update City',
          state: 'UC',
          zipCode: '54321',
        },
      });
      const created = await createResponse.json();

      // Update school
      const updateData = {
        phoneNumber: '555-9999',
        email: 'updated@school.edu',
      };

      const response = await adminContext.put(`/api/v1/schools/${created.id}`, {
        data: updateData,
      });

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.phoneNumber).toBe('555-9999');
    });
  });

  test.describe('System Monitoring', () => {
    test('should retrieve system health status', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/system/health');

      expect(response.ok()).toBeTruthy();
      const health = await response.json();

      expect(health.status).toBeDefined();
      expect(health.database).toBeDefined();
      expect(health.cache).toBeDefined();
    });

    test('should retrieve system statistics', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/system/statistics');

      expect(response.ok()).toBeTruthy();
      const stats = await response.json();

      expect(stats.totalUsers).toBeDefined();
      expect(stats.totalStudents).toBeDefined();
      expect(stats.totalRecords).toBeDefined();
      expect(stats.storageUsed).toBeDefined();
    });

    test('should retrieve active sessions', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/sessions/active');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.sessions)).toBeTruthy();
    });

    test('should revoke user session', async ({ adminContext }) => {
      // Get active sessions
      const sessionsResponse = await adminContext.get('/api/v1/admin/sessions/active');
      const sessionsData = await sessionsResponse.json();

      if (sessionsData.sessions.length > 0) {
        const sessionId = sessionsData.sessions[0].id;

        // Revoke session
        const response = await adminContext.delete(`/api/v1/admin/sessions/${sessionId}`);

        expect(response.ok()).toBeTruthy();
      }
    });
  });

  test.describe('Database Management', () => {
    test('should retrieve database statistics', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/database/statistics');

      expect(response.ok()).toBeTruthy();
      const stats = await response.json();

      expect(stats.tables).toBeDefined();
      expect(stats.totalRecords).toBeDefined();
      expect(stats.databaseSize).toBeDefined();
    });

    test('should check database integrity', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/database/integrity-check');

      expect(response.ok()).toBeTruthy();
      const result = await response.json();

      expect(result.status).toBeDefined();
      expect(result.issues).toBeDefined();
    });
  });

  test.describe('Backup and Restore', () => {
    test('should list available backups', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/backups');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.backups)).toBeTruthy();
    });

    test('should create backup', async ({ adminContext }) => {
      const backupData = {
        backupType: 'full',
        description: 'Manual test backup',
      };

      const response = await adminContext.post('/api/v1/admin/backups', {
        data: backupData,
      });

      expect(response.ok()).toBeTruthy();
      const backup = await response.json();

      expect(backup.id).toBeDefined();
      expect(backup.status).toBeDefined();
    });

    test('should retrieve backup status', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/backups/latest');

      expect(response.ok()).toBeTruthy();
      const backup = await response.json();

      expect(backup.status).toBeDefined();
    });
  });

  test.describe('Audit and Logs', () => {
    test('should retrieve system logs', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/logs', {
        params: {
          level: 'error',
          limit: 50,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.logs)).toBeTruthy();
    });

    test('should retrieve admin activity log', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/activity-log');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.activities)).toBeTruthy();
    });
  });

  test.describe('Integration Management', () => {
    test('should list available integrations', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/integrations');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.integrations)).toBeTruthy();
    });

    test('should test integration connection', async ({ adminContext }) => {
      const testData = {
        integrationType: 'sis',
        configuration: {
          apiUrl: 'https://test.sis.example.com',
          apiKey: 'test-key',
        },
      };

      const response = await adminContext.post('/api/v1/admin/integrations/test', {
        data: testData,
      });

      expect(response.ok() || response.status() === 400).toBeTruthy();
    });
  });

  test.describe('Notification Management', () => {
    test('should retrieve notification settings', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/notifications/settings');

      expect(response.ok()).toBeTruthy();
      const settings = await response.json();

      expect(settings).toBeDefined();
    });

    test('should update notification settings', async ({ adminContext }) => {
      const updateData = {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
      };

      const response = await adminContext.put('/api/v1/admin/notifications/settings', {
        data: updateData,
      });

      expect(response.ok()).toBeTruthy();
    });

    test('should send test notification', async ({ adminContext }) => {
      const testData = {
        notificationType: 'email',
        recipient: 'test@example.com',
        subject: 'Test Notification',
        body: 'This is a test notification',
      };

      const response = await adminContext.post('/api/v1/admin/notifications/test', {
        data: testData,
      });

      expect(response.ok() || response.status() === 400).toBeTruthy();
    });
  });

  test.describe('Permission Checks', () => {
    test('should deny access to non-admin user', async ({ nurseContext }) => {
      const response = await nurseContext.get('/api/v1/users');

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(403);
    });

    test('should allow admin access to all endpoints', async ({ adminContext }) => {
      const response = await adminContext.get('/api/v1/admin/system/health');

      expect(response.ok()).toBeTruthy();
    });
  });
});
