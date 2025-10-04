import { MedicationService } from '../services/medicationService';
import { testPrisma, createTestUser, createTestStudent, createTestMedication, cleanupDatabase } from './setup';

// Mock Prisma
jest.mock('@prisma/client');

// Mock logger
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('MedicationService', () => {
  beforeEach(async () => {
    await cleanupDatabase();
    jest.clearAllMocks();
  });

  describe('getMedications', () => {
    it('should return paginated medications without search', async () => {
      const mockMedications = [
        createTestMedication({ id: '1', name: 'Aspirin', strength: '100mg' }),
        createTestMedication({ id: '2', name: 'Ibuprofen', strength: '200mg' }),
      ];

      testPrisma.medication.findMany = jest.fn().mockResolvedValue(mockMedications);
      testPrisma.medication.count = jest.fn().mockResolvedValue(2);

      const result = await MedicationService.getMedications(1, 10);

      expect(testPrisma.medication.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { name: 'asc' }
      });
      expect(result.medications).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should apply search filter correctly', async () => {
      const search = 'aspirin';
      testPrisma.medication.findMany = jest.fn().mockResolvedValue([]);
      testPrisma.medication.count = jest.fn().mockResolvedValue(0);

      await MedicationService.getMedications(1, 10, search);

      expect(testPrisma.medication.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'aspirin', mode: 'insensitive' } },
            { genericName: { contains: 'aspirin', mode: 'insensitive' } },
            { manufacturer: { contains: 'aspirin', mode: 'insensitive' } }
          ]
        },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { name: 'asc' }
      });
    });
  });

  describe('createMedication', () => {
    it('should create medication successfully', async () => {
      const medicationData = {
        name: 'Test Medication',
        genericName: 'Test Generic',
        dosageForm: 'Tablet',
        strength: '100mg',
        manufacturer: 'Test Pharma',
        ndc: '12345-678-90',
        isControlled: false
      };

      testPrisma.medication.findFirst = jest.fn().mockResolvedValue(null);
      testPrisma.medication.findUnique = jest.fn().mockResolvedValue(null);
      testPrisma.medication.create = jest.fn().mockResolvedValue({
        id: 'new-med-id',
        ...medicationData,
        inventory: [],
        _count: { studentMedications: 0 }
      });

      const result = await MedicationService.createMedication(medicationData);

      expect(testPrisma.medication.create).toHaveBeenCalledWith({
        data: medicationData,
        include: expect.any(Object)
      });
      expect(result.name).toBe(medicationData.name);
    });

    it('should throw error when medication with same name, strength, and dosage form exists', async () => {
      const medicationData = {
        name: 'Existing Med',
        dosageForm: 'Tablet',
        strength: '100mg'
      };

      testPrisma.medication.findFirst = jest.fn().mockResolvedValue(createTestMedication());

      await expect(MedicationService.createMedication(medicationData))
        .rejects.toThrow('Medication with same name, strength, and dosage form already exists');
    });

    it('should throw error when NDC already exists', async () => {
      const medicationData = {
        name: 'New Med',
        dosageForm: 'Tablet',
        strength: '100mg',
        ndc: 'existing-ndc'
      };

      testPrisma.medication.findFirst = jest.fn().mockResolvedValue(null);
      testPrisma.medication.findUnique = jest.fn().mockResolvedValue(createTestMedication());

      await expect(MedicationService.createMedication(medicationData))
        .rejects.toThrow('Medication with this NDC already exists');
    });
  });

  describe('assignMedicationToStudent', () => {
    it('should assign medication to student successfully', async () => {
      const assignData = {
        studentId: 'student-1',
        medicationId: 'med-1',
        dosage: '10mg',
        frequency: 'twice daily',
        route: 'oral',
        instructions: 'Take with food',
        startDate: new Date(),
        prescribedBy: 'Dr. Smith'
      };

      const mockStudent = createTestStudent({ id: 'student-1' });
      const mockMedication = createTestMedication({ id: 'med-1' });

      testPrisma.student.findUnique = jest.fn().mockResolvedValue(mockStudent);
      testPrisma.medication.findUnique = jest.fn().mockResolvedValue(mockMedication);
      testPrisma.studentMedication.findFirst = jest.fn().mockResolvedValue(null);
      testPrisma.studentMedication.create = jest.fn().mockResolvedValue({
        id: 'assignment-1',
        ...assignData,
        medication: mockMedication,
        student: {
          id: mockStudent.id,
          firstName: mockStudent.firstName,
          lastName: mockStudent.lastName,
          studentNumber: mockStudent.studentNumber
        }
      });

      const result = await MedicationService.assignMedicationToStudent(assignData);

      expect(testPrisma.studentMedication.create).toHaveBeenCalledWith({
        data: assignData,
        include: expect.any(Object)
      });
      expect(result.dosage).toBe(assignData.dosage);
    });

    it('should throw error when student not found', async () => {
      testPrisma.student.findUnique = jest.fn().mockResolvedValue(null);

      await expect(MedicationService.assignMedicationToStudent({
        studentId: 'nonexistent',
        medicationId: 'med-1',
        dosage: '10mg',
        frequency: 'daily',
        route: 'oral',
        startDate: new Date(),
        prescribedBy: 'Dr. Smith'
      })).rejects.toThrow('Student not found');
    });

    it('should throw error when medication not found', async () => {
      testPrisma.student.findUnique = jest.fn().mockResolvedValue(createTestStudent());
      testPrisma.medication.findUnique = jest.fn().mockResolvedValue(null);

      await expect(MedicationService.assignMedicationToStudent({
        studentId: 'student-1',
        medicationId: 'nonexistent',
        dosage: '10mg',
        frequency: 'daily',
        route: 'oral',
        startDate: new Date(),
        prescribedBy: 'Dr. Smith'
      })).rejects.toThrow('Medication not found');
    });

    it('should throw error when student already has active prescription', async () => {
      const mockStudent = createTestStudent();
      const mockMedication = createTestMedication();

      testPrisma.student.findUnique = jest.fn().mockResolvedValue(mockStudent);
      testPrisma.medication.findUnique = jest.fn().mockResolvedValue(mockMedication);
      testPrisma.studentMedication.findFirst = jest.fn().mockResolvedValue({
        id: 'existing-prescription',
        isActive: true
      });

      await expect(MedicationService.assignMedicationToStudent({
        studentId: mockStudent.id,
        medicationId: mockMedication.id,
        dosage: '10mg',
        frequency: 'daily',
        route: 'oral',
        startDate: new Date(),
        prescribedBy: 'Dr. Smith'
      })).rejects.toThrow('Student already has an active prescription for this medication');
    });
  });

  describe('logMedicationAdministration', () => {
    it('should log medication administration successfully', async () => {
      const logData = {
        studentMedicationId: 'student-med-1',
        nurseId: 'nurse-1',
        dosageGiven: '10mg',
        timeGiven: new Date(),
        notes: 'Administered successfully'
      };

      const mockStudentMedication = {
        id: 'student-med-1',
        isActive: true,
        medication: { name: 'Test Med' },
        student: { firstName: 'John', lastName: 'Doe', studentNumber: '123' }
      };

      const mockNurse = createTestUser({ id: 'nurse-1', firstName: 'Nurse', lastName: 'Smith' });

      testPrisma.studentMedication.findUnique = jest.fn().mockResolvedValue(mockStudentMedication);
      testPrisma.user.findUnique = jest.fn().mockResolvedValue(mockNurse);
      testPrisma.medicationLog.create = jest.fn().mockResolvedValue({
        id: 'log-1',
        ...logData,
        administeredBy: 'Nurse Smith',
        nurse: {
          firstName: 'Nurse',
          lastName: 'Smith'
        },
        studentMedication: {
          medication: { name: 'Test Med' },
          student: { firstName: 'John', lastName: 'Doe', studentNumber: '123' }
        }
      });

      const result = await MedicationService.logMedicationAdministration(logData);

      expect(testPrisma.medicationLog.create).toHaveBeenCalledWith({
        data: {
          ...logData,
          administeredBy: 'Nurse Smith',
          studentMedicationId: 'student-med-1',
          nurseId: 'nurse-1',
          dosageGiven: '10mg',
          timeGiven: logData.timeGiven,
          notes: 'Administered successfully',
          sideEffects: undefined
        },
        include: expect.any(Object)
      });
      expect(result.dosageGiven).toBe(logData.dosageGiven);
    });

    it('should throw error when student medication not found', async () => {
      testPrisma.studentMedication.findUnique = jest.fn().mockResolvedValue(null);

      await expect(MedicationService.logMedicationAdministration({
        studentMedicationId: 'nonexistent',
        nurseId: 'nurse-1',
        dosageGiven: '10mg',
        timeGiven: new Date()
      })).rejects.toThrow('Student medication prescription not found');
    });

    it('should throw error when prescription is not active', async () => {
      testPrisma.studentMedication.findUnique = jest.fn().mockResolvedValue({
        id: 'student-med-1',
        isActive: false
      });

      await expect(MedicationService.logMedicationAdministration({
        studentMedicationId: 'student-med-1',
        nurseId: 'nurse-1',
        dosageGiven: '10mg',
        timeGiven: new Date()
      })).rejects.toThrow('Medication prescription is not active');
    });

    it('should throw error when nurse not found', async () => {
      testPrisma.studentMedication.findUnique = jest.fn().mockResolvedValue({
        id: 'student-med-1',
        isActive: true
      });
      testPrisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(MedicationService.logMedicationAdministration({
        studentMedicationId: 'student-med-1',
        nurseId: 'nonexistent',
        dosageGiven: '10mg',
        timeGiven: new Date()
      })).rejects.toThrow('Nurse not found');
    });
  });

  describe('getStudentMedicationLogs', () => {
    it('should return student medication logs with pagination', async () => {
      const mockLogs = [
        {
          id: 'log-1',
          dosageGiven: '10mg',
          timeGiven: new Date(),
          nurse: { firstName: 'Nurse', lastName: 'Smith' },
          studentMedication: { medication: { name: 'Test Med' } }
        }
      ];

      testPrisma.medicationLog.findMany = jest.fn().mockResolvedValue(mockLogs);
      testPrisma.medicationLog.count = jest.fn().mockResolvedValue(1);

      const result = await MedicationService.getStudentMedicationLogs('student-1', 1, 10);

      expect(testPrisma.medicationLog.findMany).toHaveBeenCalledWith({
        where: {
          studentMedication: {
            studentId: 'student-1'
          }
        },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { timeGiven: 'desc' }
      });
      expect(result.logs).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('addToInventory', () => {
    it('should add medication to inventory successfully', async () => {
      const inventoryData = {
        medicationId: 'med-1',
        batchNumber: 'BATCH123',
        expirationDate: new Date('2025-12-31'),
        quantity: 100,
        reorderLevel: 10,
        costPerUnit: 5.50,
        supplier: 'Test Supplier'
      };

      const mockMedication = createTestMedication({ id: 'med-1' });

      testPrisma.medication.findUnique = jest.fn().mockResolvedValue(mockMedication);
      testPrisma.medicationInventory.create = jest.fn().mockResolvedValue({
        id: 'inventory-1',
        ...inventoryData,
        medication: mockMedication
      });

      const result = await MedicationService.addToInventory(inventoryData);

      expect(testPrisma.medicationInventory.create).toHaveBeenCalledWith({
        data: inventoryData,
        include: expect.any(Object)
      });
      expect(result.batchNumber).toBe(inventoryData.batchNumber);
    });

    it('should throw error when medication not found', async () => {
      testPrisma.medication.findUnique = jest.fn().mockResolvedValue(null);

      await expect(MedicationService.addToInventory({
        medicationId: 'nonexistent',
        batchNumber: 'BATCH123',
        expirationDate: new Date(),
        quantity: 100
      })).rejects.toThrow('Medication not found');
    });
  });

  describe('getInventoryWithAlerts', () => {
    it('should return inventory with categorized alerts', async () => {
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);

      const mockInventory = [
        {
          id: 'inv-1',
          quantity: 5,
          reorderLevel: 10,
          expirationDate: thirtyDaysFromNow,
          medication: { name: 'Near Expiry Med' }
        },
        {
          id: 'inv-2',
          quantity: 15,
          reorderLevel: 10,
          expirationDate: new Date('2020-01-01'),
          medication: { name: 'Expired Med' }
        }
      ];

      testPrisma.medicationInventory.findMany = jest.fn().mockResolvedValue(mockInventory);

      const result = await MedicationService.getInventoryWithAlerts();

      expect(result.inventory).toHaveLength(2);
      expect(result.alerts.lowStock).toHaveLength(1);
      expect(result.alerts.nearExpiry).toHaveLength(1);
      expect(result.alerts.expired).toHaveLength(1);
    });
  });

  describe('getMedicationSchedule', () => {
    it('should return medication schedule for date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const mockSchedule = [
        {
          id: 'med-1',
          isActive: true,
          medication: { name: 'Test Med' },
          student: { id: 'student-1', firstName: 'John', lastName: 'Doe', studentNumber: '123', grade: '10' },
          logs: []
        }
      ];

      testPrisma.studentMedication.findMany = jest.fn().mockResolvedValue(mockSchedule);

      const result = await MedicationService.getMedicationSchedule(startDate, endDate);

      expect(testPrisma.studentMedication.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          startDate: { lte: endDate },
          OR: [
            { endDate: null },
            { endDate: { gte: startDate } }
          ]
        },
        include: expect.any(Object),
        orderBy: expect.any(Array)
      });
      expect(result).toHaveLength(1);
    });

    it('should filter by nurse when nurseId provided', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const nurseId = 'nurse-1';

      testPrisma.studentMedication.findMany = jest.fn().mockResolvedValue([]);

      await MedicationService.getMedicationSchedule(startDate, endDate, nurseId);

      expect(testPrisma.studentMedication.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          startDate: { lte: endDate },
          OR: [
            { endDate: null },
            { endDate: { gte: startDate } }
          ],
          student: {
            nurseId
          }
        },
        include: expect.any(Object),
        orderBy: expect.any(Array)
      });
    });
  });

  describe('updateInventoryQuantity', () => {
    it('should update inventory quantity successfully', async () => {
      const mockInventory = {
        id: 'inv-1',
        quantity: 50,
        medication: { name: 'Test Med' }
      };

      testPrisma.medicationInventory.update = jest.fn().mockResolvedValue(mockInventory);

      const result = await MedicationService.updateInventoryQuantity('inv-1', 75, 'Stock adjustment');

      expect(testPrisma.medicationInventory.update).toHaveBeenCalledWith({
        where: { id: 'inv-1' },
        data: { quantity: 75 },
        include: expect.any(Object)
      });
      expect(result.quantity).toBe(50);
    });
  });

  describe('deactivateStudentMedication', () => {
    it('should deactivate student medication successfully', async () => {
      const mockStudentMedication = {
        id: 'student-med-1',
        medication: { name: 'Test Med' },
        student: { firstName: 'John', lastName: 'Doe' }
      };

      testPrisma.studentMedication.update = jest.fn().mockResolvedValue({
        ...mockStudentMedication,
        isActive: false,
        endDate: new Date()
      });

      const result = await MedicationService.deactivateStudentMedication('student-med-1', 'Treatment completed');

      expect(testPrisma.studentMedication.update).toHaveBeenCalledWith({
        where: { id: 'student-med-1' },
        data: {
          isActive: false,
          endDate: new Date()
        },
        include: expect.any(Object)
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe('getMedicationReminders', () => {
    it('should return medication reminders for the day', async () => {
      const testDate = new Date('2024-01-15T10:00:00Z');

      const mockMedications = [
        {
          id: 'med-1',
          isActive: true,
          frequency: 'twice daily',
          dosage: '10mg',
          startDate: new Date('2024-01-01'),
          endDate: null,
          medication: { name: 'Test Med' },
          student: { firstName: 'John', lastName: 'Doe' },
          logs: []
        }
      ];

      testPrisma.studentMedication.findMany = jest.fn().mockResolvedValue(mockMedications);

      const result = await MedicationService.getMedicationReminders(testDate);

      expect(result).toHaveLength(2); // twice daily = 2 reminders
      expect(result[0].medicationName).toBe('Test Med');
      expect(result[0].studentName).toBe('John Doe');
      expect(result[0].status).toBe('MISSED'); // Past time
      expect(result[1].status).toBe('PENDING'); // Future time
    });

    it('should mark completed doses correctly', async () => {
      const testDate = new Date('2024-01-15T10:00:00Z');

      const mockMedications = [
        {
          id: 'med-1',
          isActive: true,
          frequency: 'once daily',
          dosage: '10mg',
          startDate: new Date('2024-01-01'),
          endDate: null,
          medication: { name: 'Test Med' },
          student: { firstName: 'John', lastName: 'Doe' },
          logs: [
            {
              timeGiven: new Date('2024-01-15T09:30:00Z') // Within 1 hour of 9 AM
            }
          ]
        }
      ];

      testPrisma.studentMedication.findMany = jest.fn().mockResolvedValue(mockMedications);

      const result = await MedicationService.getMedicationReminders(testDate);

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('COMPLETED');
    });
  });

  describe('reportAdverseReaction', () => {
    it('should report adverse reaction successfully', async () => {
      const reactionData = {
        studentMedicationId: 'student-med-1',
        reportedBy: 'nurse-1',
        severity: 'MODERATE' as const,
        reaction: 'Rash and itching',
        actionTaken: 'Discontinued medication, administered antihistamine',
        notes: 'Parent notified',
        reportedAt: new Date()
      };

      const mockStudentMedication = {
        id: 'student-med-1',
        medication: { name: 'Test Med' },
        student: { firstName: 'John', lastName: 'Doe' },
        studentId: 'student-1'
      };

      const mockNurse = createTestUser({ id: 'nurse-1' });

      testPrisma.studentMedication.findUnique = jest.fn().mockResolvedValue(mockStudentMedication);
      testPrisma.user.findUnique = jest.fn().mockResolvedValue(mockNurse);
      testPrisma.incidentReport.create = jest.fn().mockResolvedValue({
        id: 'incident-1',
        type: 'ALLERGIC_REACTION',
        severity: 'MODERATE',
        description: 'Adverse reaction to Test Med: Rash and itching',
        student: { firstName: 'John', lastName: 'Doe' },
        reportedBy: { firstName: 'Nurse', lastName: 'Smith' }
      });

      const result = await MedicationService.reportAdverseReaction(reactionData);

      expect(testPrisma.incidentReport.create).toHaveBeenCalledWith({
        data: {
          type: 'ALLERGIC_REACTION',
          severity: 'MODERATE',
          description: 'Adverse reaction to Test Med: Rash and itching',
          location: 'School Nurse Office',
          witnesses: [],
          actionsTaken: 'Discontinued medication, administered antihistamine',
          parentNotified: false,
          followUpRequired: true,
          followUpNotes: 'Parent notified',
          attachments: [],
          occurredAt: reactionData.reportedAt,
          studentId: 'student-1',
          reportedById: 'nurse-1'
        },
        include: expect.any(Object)
      });
      expect(result.type).toBe('ALLERGIC_REACTION');
    });

    it('should throw error when student medication not found', async () => {
      testPrisma.studentMedication.findUnique = jest.fn().mockResolvedValue(null);

      await expect(MedicationService.reportAdverseReaction({
        studentMedicationId: 'nonexistent',
        reportedBy: 'nurse-1',
        severity: 'MILD',
        reaction: 'Test reaction',
        actionTaken: 'Test action',
        reportedAt: new Date()
      })).rejects.toThrow('Student medication not found');
    });

    it('should throw error when reporter not found', async () => {
      testPrisma.studentMedication.findUnique = jest.fn().mockResolvedValue({
        id: 'student-med-1',
        medication: { name: 'Test Med' },
        student: { firstName: 'John', lastName: 'Doe' },
        studentId: 'student-1'
      });
      testPrisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(MedicationService.reportAdverseReaction({
        studentMedicationId: 'student-med-1',
        reportedBy: 'nonexistent',
        severity: 'MILD',
        reaction: 'Test reaction',
        actionTaken: 'Test action',
        reportedAt: new Date()
      })).rejects.toThrow('Reporter not found');
    });
  });

  describe('getAdverseReactions', () => {
    it('should return adverse reactions without filters', async () => {
      const mockReports = [
        {
          id: 'report-1',
          type: 'ALLERGIC_REACTION',
          student: { firstName: 'John', lastName: 'Doe' },
          reportedBy: { firstName: 'Nurse', lastName: 'Smith' }
        }
      ];

      testPrisma.incidentReport.findMany = jest.fn().mockResolvedValue(mockReports);

      const result = await MedicationService.getAdverseReactions();

      expect(testPrisma.incidentReport.findMany).toHaveBeenCalledWith({
        where: {
          type: 'ALLERGIC_REACTION'
        },
        include: expect.any(Object),
        orderBy: { occurredAt: 'desc' }
      });
      expect(result).toHaveLength(1);
    });

    it('should filter by student when studentId provided', async () => {
      testPrisma.incidentReport.findMany = jest.fn().mockResolvedValue([]);

      await MedicationService.getAdverseReactions(undefined, 'student-1');

      expect(testPrisma.incidentReport.findMany).toHaveBeenCalledWith({
        where: {
          type: 'ALLERGIC_REACTION',
          studentId: 'student-1'
        },
        include: expect.any(Object),
        orderBy: { occurredAt: 'desc' }
      });
    });

    it('should filter by medication when medicationId provided', async () => {
      const mockReports = [
        {
          id: 'report-1',
          type: 'ALLERGIC_REACTION',
          student: {
            firstName: 'John',
            lastName: 'Doe',
            medications: [{ medication: { name: 'Test Med' } }]
          }
        }
      ];

      testPrisma.incidentReport.findMany = jest.fn().mockResolvedValue(mockReports);

      const result = await MedicationService.getAdverseReactions('med-1');

      expect(result).toHaveLength(1);
    });
  });

  describe('parseFrequencyToTimes (private method)', () => {
    it('should parse "once daily" correctly', () => {
      const times = (MedicationService as any).parseFrequencyToTimes('once daily');
      expect(times).toEqual([{ hour: 9, minute: 0 }]);
    });

    it('should parse "twice daily" correctly', () => {
      const times = (MedicationService as any).parseFrequencyToTimes('twice daily');
      expect(times).toEqual([
        { hour: 9, minute: 0 },
        { hour: 21, minute: 0 }
      ]);
    });

    it('should parse "3 times daily" correctly', () => {
      const times = (MedicationService as any).parseFrequencyToTimes('3 times daily');
      expect(times).toEqual([
        { hour: 8, minute: 0 },
        { hour: 14, minute: 0 },
        { hour: 20, minute: 0 }
      ]);
    });

    it('should parse "every 8 hours" correctly', () => {
      const times = (MedicationService as any).parseFrequencyToTimes('every 8 hours');
      expect(times).toEqual([
        { hour: 8, minute: 0 },
        { hour: 16, minute: 0 },
        { hour: 0, minute: 0 }
      ]);
    });

    it('should default to once daily for unknown frequency', () => {
      const times = (MedicationService as any).parseFrequencyToTimes('unknown frequency');
      expect(times).toEqual([{ hour: 9, minute: 0 }]);
    });
  });
});
