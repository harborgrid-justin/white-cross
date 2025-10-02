import { MedicationService } from '../services/medicationService';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    medication: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    studentMedication: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    medicationLog: {
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    medicationInventory: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    student: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    incidentReport: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  })),
}));

describe('MedicationService', () => {
  test('should have getMedications method', () => {
    expect(typeof MedicationService.getMedications).toBe('function');
  });

  test('should have createMedication method', () => {
    expect(typeof MedicationService.createMedication).toBe('function');
  });

  test('should have assignMedicationToStudent method', () => {
    expect(typeof MedicationService.assignMedicationToStudent).toBe('function');
  });

  test('should have logMedicationAdministration method', () => {
    expect(typeof MedicationService.logMedicationAdministration).toBe('function');
  });

  test('should have getStudentMedicationLogs method', () => {
    expect(typeof MedicationService.getStudentMedicationLogs).toBe('function');
  });

  test('should have addToInventory method', () => {
    expect(typeof MedicationService.addToInventory).toBe('function');
  });

  test('should have getInventoryWithAlerts method', () => {
    expect(typeof MedicationService.getInventoryWithAlerts).toBe('function');
  });

  test('should have getMedicationSchedule method', () => {
    expect(typeof MedicationService.getMedicationSchedule).toBe('function');
  });

  test('should have updateInventoryQuantity method', () => {
    expect(typeof MedicationService.updateInventoryQuantity).toBe('function');
  });

  test('should have deactivateStudentMedication method', () => {
    expect(typeof MedicationService.deactivateStudentMedication).toBe('function');
  });

  test('should have getMedicationReminders method', () => {
    expect(typeof MedicationService.getMedicationReminders).toBe('function');
  });

  test('should have reportAdverseReaction method', () => {
    expect(typeof MedicationService.reportAdverseReaction).toBe('function');
  });

  test('should have getAdverseReactions method', () => {
    expect(typeof MedicationService.getAdverseReactions).toBe('function');
  });
});
