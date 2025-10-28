/**
 * MEDICATIONS CONTROLLER UNIT TESTS
 * Test suite for medication management, administration, and inventory
 */

import { MedicationsController } from '../healthcare/controllers/medications.controller';
import { MedicationService } from '../../../services/medication';

// Mock dependencies
jest.mock('../../../services/medication');

describe('MedicationsController', () => {
  let mockRequest: any;
  let mockH: any;

  beforeEach(() => {
    mockRequest = {
      query: {},
      params: {},
      payload: {},
      auth: {
        credentials: {
          userId: 'nurse-123',
          email: 'nurse@example.com',
          role: 'NURSE'
        }
      }
    };

    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return paginated medications list', async () => {
      mockRequest.query = { page: '1', limit: '20', search: 'aspirin' };

      (MedicationService.getMedications as jest.Mock).mockResolvedValue({
        medications: [
          { id: '1', name: 'Aspirin 81mg', dosageForm: 'Tablet' },
          { id: '2', name: 'Aspirin 325mg', dosageForm: 'Tablet' }
        ],
        total: 2
      });

      await MedicationsController.list(mockRequest, mockH);

      expect(MedicationService.getMedications).toHaveBeenCalledWith(1, 20, 'aspirin');
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({ name: 'Aspirin 81mg' })
        ]),
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1
        }
      });
    });
  });

  describe('create', () => {
    it('should create new medication', async () => {
      mockRequest.payload = {
        name: 'Ibuprofen 200mg',
        dosageForm: 'Tablet',
        strength: '200mg',
        isControlled: false
      };

      (MedicationService.createMedication as jest.Mock).mockResolvedValue({
        id: 'med-123',
        name: 'Ibuprofen 200mg',
        dosageForm: 'Tablet'
      });

      await MedicationsController.create(mockRequest, mockH);

      expect(MedicationService.createMedication).toHaveBeenCalledWith(mockRequest.payload);
      expect(mockH.code).toHaveBeenCalledWith(201);
    });
  });

  describe('assignToStudent', () => {
    it('should assign medication to student with date conversion', async () => {
      mockRequest.payload = {
        studentId: 'student-123',
        medicationId: 'med-456',
        dosage: '200mg',
        frequency: 'twice daily',
        startDate: '2025-01-15',
        endDate: '2025-02-15'
      };

      (MedicationService.assignMedicationToStudent as jest.Mock).mockResolvedValue({
        id: 'assignment-789',
        studentId: 'student-123',
        medicationId: 'med-456'
      });

      await MedicationsController.assignToStudent(mockRequest, mockH);

      expect(MedicationService.assignMedicationToStudent).toHaveBeenCalledWith(
        expect.objectContaining({
          studentId: 'student-123',
          medicationId: 'med-456',
          startDate: expect.any(Date),
          endDate: expect.any(Date)
        })
      );
      expect(mockH.code).toHaveBeenCalledWith(201);
    });
  });

  describe('logAdministration', () => {
    it('should log medication administration with nurse ID', async () => {
      mockRequest.payload = {
        studentMedicationId: 'assignment-123',
        timeGiven: '2025-10-21T10:30:00Z',
        dosageGiven: '200mg'
      };

      (MedicationService.logMedicationAdministration as jest.Mock).mockResolvedValue({
        id: 'log-123',
        nurseId: 'nurse-123'
      });

      await MedicationsController.logAdministration(mockRequest, mockH);

      expect(MedicationService.logMedicationAdministration).toHaveBeenCalledWith(
        expect.objectContaining({
          nurseId: 'nurse-123',
          timeGiven: expect.any(Date)
        })
      );
      expect(mockH.code).toHaveBeenCalledWith(201);
    });
  });

  describe('getStudentLogs', () => {
    it('should return paginated medication logs for student', async () => {
      mockRequest.params = { studentId: 'student-123' };
      mockRequest.query = { page: '1', limit: '20' };

      (MedicationService.getStudentMedicationLogs as jest.Mock).mockResolvedValue({
        logs: [
          { id: '1', dosageGiven: '200mg', timeGiven: '2025-10-21' },
          { id: '2', dosageGiven: '200mg', timeGiven: '2025-10-20' }
        ],
        total: 15
      });

      await MedicationsController.getStudentLogs(mockRequest, mockH);

      expect(MedicationService.getStudentMedicationLogs).toHaveBeenCalledWith('student-123', 1, 20);
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          pagination: expect.objectContaining({ total: 15 })
        })
      );
    });
  });

  describe('getInventory', () => {
    it('should return inventory with alerts', async () => {
      (MedicationService.getInventoryWithAlerts as jest.Mock).mockResolvedValue({
        inventory: [{ id: '1', quantity: 50 }],
        alerts: [{ type: 'LOW_STOCK', medicationId: 'med-1' }]
      });

      await MedicationsController.getInventory(mockRequest, mockH);

      expect(MedicationService.getInventoryWithAlerts).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          inventory: expect.any(Array),
          alerts: expect.any(Array)
        })
      });
    });
  });

  describe('reportAdverseReaction', () => {
    it('should report adverse reaction with reporter ID', async () => {
      mockRequest.payload = {
        studentMedicationId: 'assignment-123',
        severity: 'MODERATE',
        symptoms: 'Nausea and headache',
        reportedAt: '2025-10-21T14:00:00Z'
      };

      (MedicationService.reportAdverseReaction as jest.Mock).mockResolvedValue({
        id: 'reaction-123',
        reportedBy: 'nurse-123'
      });

      await MedicationsController.reportAdverseReaction(mockRequest, mockH);

      expect(MedicationService.reportAdverseReaction).toHaveBeenCalledWith(
        expect.objectContaining({
          reportedBy: 'nurse-123',
          reportedAt: expect.any(Date)
        })
      );
      expect(mockH.code).toHaveBeenCalledWith(201);
    });
  });

  describe('getStatistics', () => {
    it('should return medication statistics', async () => {
      (MedicationService.getMedicationStats as jest.Mock).mockResolvedValue({
        totalMedications: 150,
        activePrescriptions: 75,
        administeredToday: 45,
        adverseReactions: 3
      });

      await MedicationsController.getStatistics(mockRequest, mockH);

      expect(MedicationService.getMedicationStats).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          totalMedications: 150
        })
      });
    });
  });
});
