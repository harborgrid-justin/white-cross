/**
 * Test Client Helper
 * Provides authenticated API client for integration tests
 */

import { test as base, expect, APIRequestContext, request } from '@playwright/test';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface TestFixtures {
  apiContext: APIRequestContext;
  authenticatedContext: APIRequestContext;
  nurseContext: APIRequestContext;
  adminContext: APIRequestContext;
  authTokens: AuthTokens;
}

/**
 * Extended test with authenticated contexts
 */
export const test = base.extend<TestFixtures>({
  // Base API context (no auth)
  apiContext: async ({ playwright }, use) => {
    const context = await request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3001',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
    await use(context);
    await context.dispose();
  },

  // Auth tokens for default test user
  authTokens: async ({ apiContext }, use) => {
    const response = await apiContext.post('/api/v1/auth/login', {
      data: {
        email: 'nurse@schooltest.com',
        password: 'TestPassword123!',
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    await use(data);
  },

  // Authenticated context (default nurse user)
  authenticatedContext: async ({ playwright, authTokens }, use) => {
    const context = await request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3001',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.accessToken}`,
      },
    });
    await use(context);
    await context.dispose();
  },

  // Nurse context
  nurseContext: async ({ playwright }, use) => {
    const loginContext = await request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3001',
    });

    const response = await loginContext.post('/api/v1/auth/login', {
      data: {
        email: 'nurse@schooltest.com',
        password: 'TestPassword123!',
      },
    });

    const data = await response.json();
    await loginContext.dispose();

    const context = await request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3001',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.accessToken}`,
      },
    });

    await use(context);
    await context.dispose();
  },

  // Admin context
  adminContext: async ({ playwright }, use) => {
    const loginContext = await request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3001',
    });

    const response = await loginContext.post('/api/v1/auth/login', {
      data: {
        email: 'admin@schooltest.com',
        password: 'TestPassword123!',
      },
    });

    const data = await response.json();
    await loginContext.dispose();

    const context = await request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3001',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.accessToken}`,
      },
    });

    await use(context);
    await context.dispose();
  },
});

export { expect };

/**
 * Helper to create a test student
 */
export async function createTestStudent(context: APIRequestContext) {
  const response = await context.post('/api/v1/students', {
    data: {
      firstName: 'Test',
      lastName: 'Student',
      dateOfBirth: '2010-01-01',
      grade: '5',
      schoolId: 'SCHOOL001',
      status: 'active',
    },
  });

  expect(response.ok()).toBeTruthy();
  return await response.json();
}

/**
 * Helper to create a test medication
 */
export async function createTestMedication(context: APIRequestContext, studentId: string) {
  const response = await context.post('/api/v1/medications', {
    data: {
      studentId,
      medicationName: 'Test Medication',
      dosage: '10mg',
      frequency: 'daily',
      route: 'oral',
      startDate: new Date().toISOString(),
      prescribedBy: 'Dr. Test',
      instructions: 'Take with food',
    },
  });

  expect(response.ok()).toBeTruthy();
  return await response.json();
}

/**
 * Helper to create a test appointment
 */
export async function createTestAppointment(context: APIRequestContext, studentId: string) {
  const appointmentDate = new Date();
  appointmentDate.setHours(appointmentDate.getHours() + 1);

  const response = await context.post('/api/v1/appointments', {
    data: {
      studentId,
      appointmentType: 'routine_checkup',
      scheduledDateTime: appointmentDate.toISOString(),
      duration: 30,
      notes: 'Test appointment',
    },
  });

  expect(response.ok()).toBeTruthy();
  return await response.json();
}

/**
 * Helper to create a test health record
 */
export async function createTestHealthRecord(context: APIRequestContext, studentId: string) {
  const response = await context.post('/api/v1/health-records', {
    data: {
      studentId,
      recordType: 'vital_signs',
      recordDate: new Date().toISOString(),
      vitalSigns: {
        temperature: 98.6,
        heartRate: 72,
        bloodPressure: '120/80',
      },
      notes: 'Test health record',
    },
  });

  expect(response.ok()).toBeTruthy();
  return await response.json();
}

/**
 * Helper to create a test incident
 */
export async function createTestIncident(context: APIRequestContext, studentId: string) {
  const response = await context.post('/api/v1/incidents', {
    data: {
      studentId,
      incidentType: 'minor_injury',
      incidentDate: new Date().toISOString(),
      location: 'Playground',
      description: 'Test incident',
      severity: 'minor',
    },
  });

  expect(response.ok()).toBeTruthy();
  return await response.json();
}

/**
 * Helper to cleanup test data
 */
export async function cleanupTestStudent(context: APIRequestContext, studentId: string) {
  await context.delete(`/api/v1/students/${studentId}`);
}

/**
 * Helper to verify audit log entry
 */
export async function verifyAuditLog(
  context: APIRequestContext,
  entityType: string,
  entityId: string,
  action: string
) {
  const response = await context.get('/api/v1/audit-logs', {
    params: {
      entityType,
      entityId,
      action,
      limit: 1,
    },
  });

  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.logs.length).toBeGreaterThan(0);

  const log = data.logs[0];
  expect(log.entityType).toBe(entityType);
  expect(log.entityId).toBe(entityId);
  expect(log.action).toBe(action);

  return log;
}

/**
 * Helper to measure API response time
 */
export async function measureResponseTime(
  context: APIRequestContext,
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any
): Promise<number> {
  const start = Date.now();

  let response;
  if (method === 'get') {
    response = await context.get(url);
  } else if (method === 'post') {
    response = await context.post(url, { data });
  } else if (method === 'put') {
    response = await context.put(url, { data });
  } else {
    response = await context.delete(url);
  }

  const duration = Date.now() - start;
  expect(response.ok()).toBeTruthy();

  return duration;
}
