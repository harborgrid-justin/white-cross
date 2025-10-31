/**
 * Test Data Factories for White Cross Healthcare Platform
 *
 * Provides factory functions to generate synthetic test data for:
 * - Users (healthcare staff)
 * - Students (synthetic patient data)
 * - Medications
 * - Appointments
 * - Health records
 * - Audit logs
 *
 * HIPAA Compliance Note:
 * All data generated is synthetic and does not represent real patients or PHI.
 * Faker.js is mocked in jest.setup.ts for deterministic test data.
 *
 * @module tests/utils/test-factories
 */

import type { User } from '@/stores/slices/authSlice';

/**
 * Student type for testing (synthetic patient data)
 */
export interface TestStudent {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  allergies?: string[];
  medications?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

/**
 * Medication type for testing
 */
export interface TestMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  studentId: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
}

/**
 * Audit log entry for testing
 */
export interface TestAuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
}

/**
 * Creates a synthetic user for testing
 *
 * @param overrides - Partial user properties to override defaults
 * @returns Synthetic user object
 *
 * @example
 * ```typescript
 * const nurse = createTestUser({ role: 'nurse' });
 * const admin = createTestUser({ role: 'admin', email: 'admin@test.com' });
 * ```
 */
export function createTestUser(overrides: Partial<User> = {}): User {
  return {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'nurse',
    permissions: ['students:view', 'medications:administer'],
    ...overrides,
  };
}

/**
 * Creates a synthetic student (patient) for testing
 *
 * @param overrides - Partial student properties to override defaults
 * @returns Synthetic student object
 *
 * @example
 * ```typescript
 * const student = createTestStudent({ grade: '5th' });
 * ```
 */
export function createTestStudent(overrides: Partial<TestStudent> = {}): TestStudent {
  return {
    id: '123e4567-e89b-12d3-a456-426614174001',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2010-05-15',
    grade: '6th',
    guardianName: 'Jane Doe',
    guardianPhone: '555-0123',
    guardianEmail: 'guardian@example.com',
    allergies: [],
    medications: [],
    emergencyContact: {
      name: 'Jane Doe',
      phone: '555-0123',
      relationship: 'Mother',
    },
    ...overrides,
  };
}

/**
 * Creates a synthetic medication record for testing
 *
 * @param overrides - Partial medication properties to override defaults
 * @returns Synthetic medication object
 */
export function createTestMedication(overrides: Partial<TestMedication> = {}): TestMedication {
  return {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Test Medication',
    dosage: '10mg',
    frequency: 'Daily',
    studentId: '123e4567-e89b-12d3-a456-426614174001',
    prescribedBy: 'Dr. Smith',
    startDate: '2024-01-15',
    instructions: 'Take with food',
    ...overrides,
  };
}

/**
 * Creates a synthetic audit log entry for testing
 *
 * @param overrides - Partial audit log properties to override defaults
 * @returns Synthetic audit log entry
 */
export function createTestAuditLogEntry(
  overrides: Partial<TestAuditLogEntry> = {}
): TestAuditLogEntry {
  return {
    id: '123e4567-e89b-12d3-a456-426614174003',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    action: 'VIEW',
    resource: 'student',
    resourceId: '123e4567-e89b-12d3-a456-426614174001',
    timestamp: new Date('2024-01-15T10:00:00Z').toISOString(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    details: {},
    ...overrides,
  };
}

/**
 * Creates an array of test users
 *
 * @param count - Number of users to create
 * @param overrides - Factory function or partial overrides
 * @returns Array of synthetic users
 */
export function createTestUsers(
  count: number,
  overrides?: Partial<User> | ((index: number) => Partial<User>)
): User[] {
  return Array.from({ length: count }, (_, index) => {
    const override = typeof overrides === 'function' ? overrides(index) : overrides;
    return createTestUser({ ...override, id: `user-${index}` });
  });
}

/**
 * Creates an array of test students
 *
 * @param count - Number of students to create
 * @param overrides - Factory function or partial overrides
 * @returns Array of synthetic students
 */
export function createTestStudents(
  count: number,
  overrides?: Partial<TestStudent> | ((index: number) => Partial<TestStudent>)
): TestStudent[] {
  return Array.from({ length: count }, (_, index) => {
    const override = typeof overrides === 'function' ? overrides(index) : overrides;
    return createTestStudent({ ...override, id: `student-${index}` });
  });
}

// Aliases for backward compatibility and brevity
export const createUser = createTestUser;
export const createStudent = createTestStudent;
export const createMedication = createTestMedication;
export const createAuditLogEntry = createTestAuditLogEntry;

/**
 * Creates a nurse user for testing
 */
export const createNurse = (overrides: Partial<User> = {}) =>
  createTestUser({ role: 'nurse', permissions: ['students:view', 'medications:administer'], ...overrides });

/**
 * Creates an admin user for testing
 */
export const createAdmin = (overrides: Partial<User> = {}) =>
  createTestUser({ role: 'admin', permissions: ['*'], ...overrides });

/**
 * Creates a doctor user for testing
 */
export const createDoctor = (overrides: Partial<User> = {}) =>
  createTestUser({ role: 'doctor', permissions: ['students:view', 'medications:prescribe'], ...overrides });
