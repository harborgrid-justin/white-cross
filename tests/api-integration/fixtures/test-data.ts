/**
 * Test Data Fixtures
 * Provides consistent test data for API integration tests
 */

export const TEST_USERS = {
  nurse: {
    email: 'nurse@test.com',
    password: 'Test@1234',
    role: 'NURSE',
  },
  admin: {
    email: 'admin@test.com',
    password: 'Admin@1234',
    role: 'ADMIN',
  },
  schoolAdmin: {
    email: 'school.admin@test.com',
    password: 'School@1234',
    role: 'SCHOOL_ADMIN',
  },
};

export const TEST_STUDENT = {
  firstName: 'Test',
  lastName: 'Student',
  dateOfBirth: '2010-01-01',
  grade: '5',
  gender: 'M',
  studentId: 'TEST001',
};

export const TEST_HEALTH_RECORD = {
  type: 'CHECKUP',
  date: new Date().toISOString(),
  description: 'Annual physical examination',
  provider: 'Dr. Test',
  vital: {
    temperature: 98.6,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    heartRate: 72,
    weight: 100,
    height: 60,
  },
};

export const TEST_MEDICATION = {
  name: 'Test Medication',
  dosage: '500mg',
  frequency: 'Daily',
  startDate: new Date().toISOString(),
  prescribedBy: 'Dr. Test',
  instructions: 'Take with food',
};

export const TEST_APPOINTMENT = {
  type: 'CHECKUP',
  date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  duration: 30,
  reason: 'Annual checkup',
  status: 'SCHEDULED',
};

export const TEST_DOCUMENT = {
  name: 'test-document.pdf',
  type: 'MEDICAL_FORM',
  description: 'Test medical form',
};

export const TEST_MESSAGE = {
  subject: 'Test Message',
  body: 'This is a test message',
  priority: 'NORMAL',
};

export const TEST_BROADCAST = {
  subject: 'Test Broadcast',
  body: 'This is a test broadcast message',
  priority: 'HIGH',
  audienceType: 'ALL_PARENTS',
};

/**
 * Generate unique test data with timestamp
 */
export function generateUniqueTestData<T extends Record<string, any>>(
  baseData: T,
  identifier: string
): T {
  const timestamp = Date.now();
  return {
    ...baseData,
    [identifier]: `${baseData[identifier]}_${timestamp}`,
  };
}

/**
 * Wait for a specified duration
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
