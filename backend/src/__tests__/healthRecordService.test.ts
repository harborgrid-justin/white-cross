import { HealthRecordService } from '../services/healthRecordService';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    healthRecord: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    allergy: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    chronicCondition: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    student: {
      findUnique: jest.fn(),
    },
  })),
}));

describe('HealthRecordService', () => {
  describe('Core Health Record Methods', () => {
    test('should have getStudentHealthRecords method', () => {
      expect(typeof HealthRecordService.getStudentHealthRecords).toBe('function');
    });

    test('should have createHealthRecord method', () => {
      expect(typeof HealthRecordService.createHealthRecord).toBe('function');
    });

    test('should have updateHealthRecord method', () => {
      expect(typeof HealthRecordService.updateHealthRecord).toBe('function');
    });
  });

  describe('Allergy Management', () => {
    test('should have addAllergy method', () => {
      expect(typeof HealthRecordService.addAllergy).toBe('function');
    });

    test('should have getStudentAllergies method', () => {
      expect(typeof HealthRecordService.getStudentAllergies).toBe('function');
    });

    test('should have updateAllergy method', () => {
      expect(typeof HealthRecordService.updateAllergy).toBe('function');
    });

    test('should have deleteAllergy method', () => {
      expect(typeof HealthRecordService.deleteAllergy).toBe('function');
    });
  });

  describe('Chronic Condition Management', () => {
    test('should have addChronicCondition method', () => {
      expect(typeof HealthRecordService.addChronicCondition).toBe('function');
    });

    test('should have getStudentChronicConditions method', () => {
      expect(typeof HealthRecordService.getStudentChronicConditions).toBe('function');
    });

    test('should have updateChronicCondition method', () => {
      expect(typeof HealthRecordService.updateChronicCondition).toBe('function');
    });

    test('should have deleteChronicCondition method', () => {
      expect(typeof HealthRecordService.deleteChronicCondition).toBe('function');
    });
  });

  describe('Vaccination Tracking', () => {
    test('should have getVaccinationRecords method', () => {
      expect(typeof HealthRecordService.getVaccinationRecords).toBe('function');
    });
  });

  describe('Growth Chart Tracking', () => {
    test('should have getGrowthChartData method', () => {
      expect(typeof HealthRecordService.getGrowthChartData).toBe('function');
    });
  });

  describe('Vital Signs', () => {
    test('should have getRecentVitals method', () => {
      expect(typeof HealthRecordService.getRecentVitals).toBe('function');
    });
  });

  describe('Health Summary', () => {
    test('should have getHealthSummary method', () => {
      expect(typeof HealthRecordService.getHealthSummary).toBe('function');
    });
  });

  describe('Search Functionality', () => {
    test('should have searchHealthRecords method', () => {
      expect(typeof HealthRecordService.searchHealthRecords).toBe('function');
    });
  });

  describe('Import/Export Functionality', () => {
    test('should have exportHealthHistory method', () => {
      expect(typeof HealthRecordService.exportHealthHistory).toBe('function');
    });

    test('should have importHealthRecords method', () => {
      expect(typeof HealthRecordService.importHealthRecords).toBe('function');
    });
  });
});
