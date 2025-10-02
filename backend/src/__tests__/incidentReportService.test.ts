import { IncidentReportService } from '../services/incidentReportService';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    incidentReport: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    witnessStatement: {
      create: jest.fn(),
      update: jest.fn(),
    },
    followUpAction: {
      create: jest.fn(),
      update: jest.fn(),
    },
    student: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  })),
}));

describe('IncidentReportService', () => {
  describe('Core Methods', () => {
    test('should have getIncidentReports method', () => {
      expect(typeof IncidentReportService.getIncidentReports).toBe('function');
    });

    test('should have getIncidentReportById method', () => {
      expect(typeof IncidentReportService.getIncidentReportById).toBe('function');
    });

    test('should have createIncidentReport method', () => {
      expect(typeof IncidentReportService.createIncidentReport).toBe('function');
    });

    test('should have updateIncidentReport method', () => {
      expect(typeof IncidentReportService.updateIncidentReport).toBe('function');
    });
  });

  describe('Witness Statement Methods', () => {
    test('should have addWitnessStatement method', () => {
      expect(typeof IncidentReportService.addWitnessStatement).toBe('function');
    });

    test('should have verifyWitnessStatement method', () => {
      expect(typeof IncidentReportService.verifyWitnessStatement).toBe('function');
    });
  });

  describe('Follow-up Action Methods', () => {
    test('should have addFollowUpAction method', () => {
      expect(typeof IncidentReportService.addFollowUpAction).toBe('function');
    });

    test('should have updateFollowUpAction method', () => {
      expect(typeof IncidentReportService.updateFollowUpAction).toBe('function');
    });
  });

  describe('Evidence Management Methods', () => {
    test('should have addEvidence method', () => {
      expect(typeof IncidentReportService.addEvidence).toBe('function');
    });
  });

  describe('Insurance and Compliance Methods', () => {
    test('should have updateInsuranceClaim method', () => {
      expect(typeof IncidentReportService.updateInsuranceClaim).toBe('function');
    });

    test('should have updateComplianceStatus method', () => {
      expect(typeof IncidentReportService.updateComplianceStatus).toBe('function');
    });
  });

  describe('Parent Notification Methods', () => {
    test('should have markParentNotified method', () => {
      expect(typeof IncidentReportService.markParentNotified).toBe('function');
    });

    test('should have notifyParent method', () => {
      expect(typeof IncidentReportService.notifyParent).toBe('function');
    });
  });

  describe('Document Generation', () => {
    test('should have generateIncidentReportDocument method', () => {
      expect(typeof IncidentReportService.generateIncidentReportDocument).toBe('function');
    });
  });

  describe('Statistics and Search', () => {
    test('should have getIncidentStatistics method', () => {
      expect(typeof IncidentReportService.getIncidentStatistics).toBe('function');
    });

    test('should have searchIncidentReports method', () => {
      expect(typeof IncidentReportService.searchIncidentReports).toBe('function');
    });

    test('should have getIncidentsRequiringFollowUp method', () => {
      expect(typeof IncidentReportService.getIncidentsRequiringFollowUp).toBe('function');
    });

    test('should have getStudentRecentIncidents method', () => {
      expect(typeof IncidentReportService.getStudentRecentIncidents).toBe('function');
    });
  });
});
