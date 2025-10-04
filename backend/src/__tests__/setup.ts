import { PrismaClient } from '@prisma/client';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_CqE9oPepJl8t@ep-young-queen-ad5sfxae-pooler.c-2.us-east-1.aws.neon.tech/jestdb?sslmode=require&channel_binding=require';

// Create a test database instance
export const testPrisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Test utilities
export const createTestUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'NURSE' as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createTestStudent = (overrides = {}) => ({
  id: 'test-student-id',
  firstName: 'Test',
  lastName: 'Student',
  studentNumber: '12345',
  grade: '10',
  dateOfBirth: new Date('2005-01-01'),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createTestMedication = (overrides = {}) => ({
  id: 'test-medication-id',
  name: 'Test Medication',
  dosage: '10mg',
  frequency: 'twice daily',
  instructions: 'Take with food',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Cleanup after each test
export const cleanupDatabase = async () => {
  if (testPrisma) {
    await testPrisma.user.deleteMany({});
    await testPrisma.student.deleteMany({});
    await testPrisma.medication.deleteMany({});
    await testPrisma.healthRecord.deleteMany({});
    await testPrisma.appointment.deleteMany({});
    await testPrisma.incidentReport.deleteMany({});
  }
};

// Setup before all tests
beforeAll(async () => {
  // Ensure database connection
  await testPrisma.$connect();
});

// Cleanup after each test
afterEach(async () => {
  await cleanupDatabase();
});

// Cleanup after all tests
afterAll(async () => {
  await testPrisma.$disconnect();
});
