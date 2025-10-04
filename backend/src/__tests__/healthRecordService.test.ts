import { HealthRecordService } from '../services/healthRecordService';
import { testPrisma, createTestStudent, cleanupDatabase } from './setup';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => testPrisma),
  Prisma: {
    JsonNull: null
  }
}));

// Mock logger
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('HealthRecordService', () => {
  beforeEach(async () => {
    await cleanupDatabase();
    jest.clearAllMocks();
  });

  describe('getStudentHealthRecords', () => {
    it('should return paginated health records without filters', async () => {
      const mockRecords = [
        {
          id: 'record-1',
          type: 'CHECKUP',
          date: new Date(),
          description: 'Annual checkup',
          student: { id: 'student-1', firstName: 'John', lastName: 'Doe', studentNumber: '123' }
        },
        {
          id: 'record-2',
          type: 'VACCINATION',
          date: new Date(),
          description: 'Flu shot',
          student: { id: 'student-1', firstName: 'John', lastName: 'Doe', studentNumber: '123' }
        }
      ];

      testPrisma.healthRecord.findMany = jest.fn().mockResolvedValue(mockRecords);
      testPrisma.healthRecord.count = jest.fn().mockResolvedValue(2);

      const result = await HealthRecordService.getStudentHealthRecords('student-1', 1, 10);

      expect(testPrisma.healthRecord.findMany).toHaveBeenCalledWith({
        where: { studentId: 'student-1' },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { date: 'desc' }
      });
      expect(result.records).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should apply type filter correctly', async () => {
      const filters = { type: 'VACCINATION' as const };
      testPrisma.healthRecord.findMany = jest.fn().mockResolvedValue([]);
      testPrisma.healthRecord.count = jest.fn().mockResolvedValue(0);

      await HealthRecordService.getStudentHealthRecords('student-1', 1, 10, filters);

      expect(testPrisma.healthRecord.findMany).toHaveBeenCalledWith({
        where: {
          studentId: 'student-1',
          type: 'VACCINATION'
        },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { date: 'desc' }
      });
    });

    it('should apply date range filter correctly', async () => {
      const filters = {
        dateFrom: new Date('2024-01-01'),
        dateTo: new Date('2024-12-31')
      };
      testPrisma.healthRecord.findMany = jest.fn().mockResolvedValue([]);
      testPrisma.healthRecord.count = jest.fn().mockResolvedValue(0);

      await HealthRecordService.getStudentHealthRecords('student-1', 1, 10, filters);

      expect(testPrisma.healthRecord.findMany).toHaveBeenCalledWith({
        where: {
          studentId: 'student-1',
          date: {
            gte: filters.dateFrom,
            lte: filters.dateTo
          }
        },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { date: 'desc' }
      });
    });

    it('should apply provider filter correctly', async () => {
      const filters = { provider: 'Dr. Smith' };
      testPrisma.healthRecord.findMany = jest.fn().mockResolvedValue([]);
      testPrisma.healthRecord.count = jest.fn().mockResolvedValue(0);

      await HealthRecordService.getStudentHealthRecords('student-1', 1, 10, filters);

      expect(testPrisma.healthRecord.findMany).toHaveBeenCalledWith({
        where: {
          studentId: 'student-1',
          provider: { contains: 'Dr. Smith', mode: 'insensitive' }
        },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { date: 'desc' }
      });
    });
  });

  describe('createHealthRecord', () => {
    it('should create health record successfully', async () => {
      const recordData = {
        studentId: 'student-1',
        type: 'CHECKUP' as const,
        date: new Date(),
        description: 'Annual physical exam',
        vital: {
          height: 150,
          weight: 50,
          temperature: 98.6,
          bloodPressureSystolic: 120,
          bloodPressureDiastolic: 80
        },
        provider: 'Dr. Smith',
        notes: 'Student is healthy'
      };

      const mockStudent = createTestStudent({ id: 'student-1' });

      testPrisma.student.findUnique = jest.fn().mockResolvedValue(mockStudent);
      testPrisma.healthRecord.create = jest.fn().mockResolvedValue({
        id: 'record-1',
        ...recordData,
        vital: {
          ...recordData.vital,
          bmi: 22.2 // Should be calculated
        },
        student: {
          id: mockStudent.id,
          firstName: mockStudent.firstName,
          lastName: mockStudent.lastName,
          studentNumber: mockStudent.studentNumber
        }
      });

      const result = await HealthRecordService.createHealthRecord(recordData);

      expect(testPrisma.healthRecord.create).toHaveBeenCalledWith({
        data: {
          ...recordData,
          vital: {
            ...recordData.vital,
            bmi: 22.2
          }
        },
        include: expect.any(Object)
      });
      expect(result.description).toBe(recordData.description);
    });

    it('should throw error when student not found', async () => {
      testPrisma.student.findUnique = jest.fn().mockResolvedValue(null);

      await expect(HealthRecordService.createHealthRecord({
        studentId: 'nonexistent',
        type: 'CHECKUP',
        date: new Date(),
        description: 'Test record'
      })).rejects.toThrow('Student not found');
    });

    it('should calculate BMI correctly when height and weight provided', async () => {
      const recordData = {
        studentId: 'student-1',
        type: 'CHECKUP' as const,
        date: new Date(),
        description: 'BMI calculation test',
        vital: {
          height: 175, // 175 cm
          weight: 70   // 70 kg
        }
      };

      const mockStudent = createTestStudent({ id: 'student-1' });

      testPrisma.student.findUnique = jest.fn().mockResolvedValue(mockStudent);
      testPrisma.healthRecord.create = jest.fn().mockImplementation((data) => {
        // Verify BMI calculation: 70 / (1.75 * 1.75) = 22.86, rounded to 22.9
        expect((data.data.vital as any).bmi).toBe(22.9);
        return Promise.resolve({
          id: 'record-1',
          ...data.data,
          student: mockStudent
        });
      });

      await HealthRecordService.createHealthRecord(recordData);
    });
  });

  describe('updateHealthRecord', () => {
    it('should update health record successfully', async () => {
      const existingRecord = {
        id: 'record-1',
        studentId: 'student-1',
        type: 'CHECKUP',
        vital: { height: 150, weight: 50 }
      };

      const updateData = {
        description: 'Updated description',
        vital: {
          height: 155,
          weight: 52
        }
      };

      testPrisma.healthRecord.findUnique = jest.fn().mockResolvedValue(existingRecord);
      testPrisma.healthRecord.update = jest.fn().mockResolvedValue({
        id: 'record-1',
        ...existingRecord,
        ...updateData,
        vital: {
          height: 155,
          weight: 52,
          bmi: 21.6 // Should be recalculated
        },
        student: createTestStudent(),
        createdAt: new Date(),
        updatedAt: new Date(),
        studentId: 'student-1',
        provider: 'Dr. Smith',
        notes: 'Updated notes',
        attachments: []
      });

      const result = await HealthRecordService.updateHealthRecord('record-1', updateData);

      expect(testPrisma.healthRecord.update).toHaveBeenCalledWith({
        where: { id: 'record-1' },
        data: {
          ...updateData,
          vital: {
            height: 155,
            weight: 52,
            bmi: 21.6
          }
        },
        include: expect.any(Object)
      });
      expect(result.description).toBe(updateData.description);
    });

    it('should throw error when record not found', async () => {
      testPrisma.healthRecord.findUnique = jest.fn().mockResolvedValue(null);

      await expect(HealthRecordService.updateHealthRecord('nonexistent', {
        description: 'Updated'
      })).rejects.toThrow('Health record not found');
    });
  });

  describe('addAllergy', () => {
    it('should add allergy successfully', async () => {
      const allergyData = {
        studentId: 'student-1',
        allergen: 'Peanuts',
        severity: 'SEVERE' as const,
        reaction: 'Anaphylaxis',
        treatment: 'EpiPen',
        verified: true,
        verifiedBy: 'Dr. Smith'
      };

      const mockStudent = createTestStudent({ id: 'student-1' });

      testPrisma.student.findUnique = jest.fn().mockResolvedValue(mockStudent);
      testPrisma.allergy.findFirst = jest.fn().mockResolvedValue(null);
      testPrisma.allergy.create = jest.fn().mockResolvedValue({
        id: 'allergy-1',
        ...allergyData,
        verifiedAt: new Date(),
        student: {
          id: mockStudent.id,
          firstName: mockStudent.firstName,
          lastName: mockStudent.lastName,
          studentNumber: mockStudent.studentNumber
        }
      });

      const result = await HealthRecordService.addAllergy(allergyData);

      expect(testPrisma.allergy.create).toHaveBeenCalledWith({
        data: {
          ...allergyData,
          verifiedAt: new Date()
        },
        include: expect.any(Object)
      });
      expect(result.allergen).toBe(allergyData.allergen);
    });

    it('should throw error when student not found', async () => {
      testPrisma.student.findUnique = jest.fn().mockResolvedValue(null);

      await expect(HealthRecordService.addAllergy({
        studentId: 'nonexistent',
        allergen: 'Test',
        severity: 'MILD'
      })).rejects.toThrow('Student not found');
    });

    it('should throw error when allergy already exists', async () => {
      testPrisma.student.findUnique = jest.fn().mockResolvedValue(createTestStudent());
      testPrisma.allergy.findFirst = jest.fn().mockResolvedValue({
        id: 'existing-allergy',
        allergen: 'Peanuts'
      });

      await expect(HealthRecordService.addAllergy({
        studentId: 'student-1',
        allergen: 'Peanuts',
        severity: 'MILD'
      })).rejects.toThrow('Allergy already exists for this student');
    });
  });

  describe('updateAllergy', () => {
    it('should update allergy successfully', async () => {
      const existingAllergy = {
        id: 'allergy-1',
        studentId: 'student-1',
        allergen: 'Peanuts',
        verified: false,
        student: createTestStudent()
      };

      const updateData = {
        severity: 'MODERATE' as const,
        verified: true
      };

      testPrisma.allergy.findUnique = jest.fn().mockResolvedValue(existingAllergy);
      testPrisma.allergy.update = jest.fn().mockResolvedValue({
        id: 'allergy-1',
        ...existingAllergy,
        ...updateData,
        verifiedAt: new Date(),
        student: createTestStudent()
      });

      const result = await HealthRecordService.updateAllergy('allergy-1', updateData);

      expect(testPrisma.allergy.update).toHaveBeenCalledWith({
        where: { id: 'allergy-1' },
        data: {
          ...updateData,
          verifiedAt: new Date()
        },
        include: expect.any(Object)
      });
      expect(result.severity).toBe(updateData.severity);
    });

    it('should throw error when allergy not found', async () => {
      testPrisma.allergy.findUnique = jest.fn().mockResolvedValue(null);

      await expect(HealthRecordService.updateAllergy('nonexistent', {
        severity: 'MILD'
      })).rejects.toThrow('Allergy not found');
    });
  });

  describe('getStudentAllergies', () => {
    it('should return student allergies ordered by severity', async () => {
      const mockAllergies = [
        {
          id: 'allergy-1',
          allergen: 'Peanuts',
          severity: 'SEVERE',
          student: createTestStudent()
        },
        {
          id: 'allergy-2',
          allergen: 'Milk',
          severity: 'MILD',
          student: createTestStudent()
        }
      ];

      testPrisma.allergy.findMany = jest.fn().mockResolvedValue(mockAllergies);

      const result = await HealthRecordService.getStudentAllergies('student-1');

      expect(testPrisma.allergy.findMany).toHaveBeenCalledWith({
        where: { studentId: 'student-1' },
        include: expect.any(Object),
        orderBy: [
          { severity: 'desc' },
          { allergen: 'asc' }
        ]
      });
      expect(result).toHaveLength(2);
      expect(result[0].severity).toBe('SEVERE'); // Most severe first
    });
  });

  describe('deleteAllergy', () => {
    it('should delete allergy successfully', async () => {
      const mockAllergy = {
        id: 'allergy-1',
        allergen: 'Peanuts',
        student: { firstName: 'John', lastName: 'Doe' }
      };

      testPrisma.allergy.findUnique = jest.fn().mockResolvedValue(mockAllergy);
      testPrisma.allergy.delete = jest.fn().mockResolvedValue(mockAllergy);

      const result = await HealthRecordService.deleteAllergy('allergy-1');

      expect(testPrisma.allergy.delete).toHaveBeenCalledWith({
        where: { id: 'allergy-1' }
      });
      expect(result.success).toBe(true);
    });

    it('should throw error when allergy not found', async () => {
      testPrisma.allergy.findUnique = jest.fn().mockResolvedValue(null);

      await expect(HealthRecordService.deleteAllergy('nonexistent'))
        .rejects.toThrow('Allergy not found');
    });
  });

  describe('getVaccinationRecords', () => {
    it('should return vaccination records for student', async () => {
      const mockVaccinations = [
        {
          id: 'vacc-1',
          type: 'VACCINATION',
          description: 'Flu shot 2024',
          date: new Date(),
          student: createTestStudent()
        },
        {
          id: 'vacc-2',
          type: 'VACCINATION',
          description: 'COVID-19 vaccine',
          date: new Date(),
          student: createTestStudent()
        }
      ];

      testPrisma.healthRecord.findMany = jest.fn().mockResolvedValue(mockVaccinations);

      const result = await HealthRecordService.getVaccinationRecords('student-1');

      expect(testPrisma.healthRecord.findMany).toHaveBeenCalledWith({
        where: {
          studentId: 'student-1',
          type: 'VACCINATION'
        },
        include: expect.any(Object),
        orderBy: { date: 'desc' }
      });
      expect(result).toHaveLength(2);
    });
  });

  describe('getGrowthChartData', () => {
    it('should return growth chart data with height and weight', async () => {
      const mockRecords = [
        {
          id: 'record-1',
          date: new Date('2024-01-01'),
          vital: { height: 150, weight: 50, bmi: 22.2 },
          type: 'CHECKUP'
        },
        {
          id: 'record-2',
          date: new Date('2024-06-01'),
          vital: { height: 155, weight: 52, bmi: 21.6 },
          type: 'CHECKUP'
        }
      ];

      testPrisma.healthRecord.findMany = jest.fn().mockResolvedValue(mockRecords);

      const result = await HealthRecordService.getGrowthChartData('student-1');

      expect(result).toHaveLength(2);
      expect(result[0].height).toBe(150);
      expect(result[0].weight).toBe(50);
      expect(result[0].bmi).toBe(22.2);
      expect(result[1].height).toBe(155);
      expect(result[1].weight).toBe(52);
    });

    it('should filter out records without height or weight data', async () => {
      const mockRecords = [
        {
          id: 'record-1',
          date: new Date(),
          vital: { temperature: 98.6 }, // No height/weight
          type: 'ILLNESS'
        },
        {
          id: 'record-2',
          date: new Date(),
          vital: { height: 150, weight: 50 },
          type: 'CHECKUP'
        }
      ];

      testPrisma.healthRecord.findMany = jest.fn().mockResolvedValue(mockRecords);

      const result = await HealthRecordService.getGrowthChartData('student-1');

      expect(result).toHaveLength(1);
      expect(result[0].height).toBe(150);
    });
  });

  describe('getRecentVitals', () => {
    it('should return recent vital signs', async () => {
      const mockRecords = [
        {
          id: 'record-1',
          date: new Date(),
          vital: { height: 150, weight: 50, temperature: 98.6 },
          type: 'CHECKUP',
          provider: 'Dr. Smith'
        }
      ];

      testPrisma.healthRecord.findMany = jest.fn().mockResolvedValue(mockRecords);

      const result = await HealthRecordService.getRecentVitals('student-1', 5);

      expect(testPrisma.healthRecord.findMany).toHaveBeenCalledWith({
        where: {
          studentId: 'student-1',
          vital: { not: null }
        },
        select: expect.any(Object),
        orderBy: { date: 'desc' },
        take: 5
      });
      expect(result).toHaveLength(1);
      expect(result[0].vital.height).toBe(150);
    });
  });

  describe('getHealthSummary', () => {
    it('should return comprehensive health summary', async () => {
      const mockStudent = createTestStudent({ id: 'student-1' });
      const mockAllergies = [
        { id: 'allergy-1', allergen: 'Peanuts', severity: 'SEVERE' }
      ];
      const mockVitals = [
        { id: 'vital-1', vital: { height: 150, weight: 50 } }
      ];
      const mockVaccinations = [
        { id: 'vacc-1', description: 'Flu shot' }
      ];

      testPrisma.student.findUnique = jest.fn().mockResolvedValue(mockStudent);
      testPrisma.healthRecord.groupBy = jest.fn().mockResolvedValue([
        { type: 'CHECKUP', _count: { type: 3 } },
        { type: 'VACCINATION', _count: { type: 2 } }
      ]);

      // Mock the individual service methods
      jest.spyOn(HealthRecordService, 'getStudentAllergies').mockResolvedValue([
        {
          id: 'allergy-1',
          allergen: 'Peanuts',
          severity: 'SEVERE',
          createdAt: new Date(),
          updatedAt: new Date(),
          studentId: 'student-1',
          reaction: null,
          treatment: null,
          verified: false,
          verifiedBy: null,
          verifiedAt: null,
          student: {
            id: 'student-1',
            studentNumber: '123',
            firstName: 'John',
            lastName: 'Doe'
          }
        }
      ]);
      jest.spyOn(HealthRecordService, 'getRecentVitals').mockResolvedValue(mockVitals);
      jest.spyOn(HealthRecordService, 'getVaccinationRecords').mockResolvedValue([
        {
          id: 'vacc-1',
          type: 'VACCINATION',
          date: new Date(),
          description: 'Flu shot',
          vital: null,
          provider: null,
          notes: null,
          attachments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          studentId: 'student-1',
          student: {
            id: 'student-1',
            studentNumber: '123',
            firstName: 'John',
            lastName: 'Doe'
          }
        }
      ]);

      const result = await HealthRecordService.getHealthSummary('student-1');

      expect(result.student).toEqual(mockStudent);
      expect(result.allergies).toEqual(mockAllergies);
      expect(result.recentVitals).toEqual(mockVitals);
      expect(result.recentVaccinations).toEqual([mockVaccinations[0]]);
      expect(result.recordCounts.CHECKUP).toBe(3);
      expect(result.recordCounts.VACCINATION).toBe(2);
    });

    it('should throw error when student not found', async () => {
      testPrisma.student.findUnique = jest.fn().mockResolvedValue(null);

      await expect(HealthRecordService.getHealthSummary('nonexistent'))
        .rejects.toThrow('Student not found');
    });
  });

  describe('searchHealthRecords', () => {
    it('should search health records across all students', async () => {
      const mockRecords = [
        {
          id: 'record-1',
          description: 'Annual checkup',
          student: { id: 'student-1', firstName: 'John', lastName: 'Doe', studentNumber: '123', grade: '10' }
        }
      ];

      testPrisma.healthRecord.findMany = jest.fn().mockResolvedValue(mockRecords);
      testPrisma.healthRecord.count = jest.fn().mockResolvedValue(1);

      const result = await HealthRecordService.searchHealthRecords('checkup', undefined, 1, 10);

      expect(testPrisma.healthRecord.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { description: { contains: 'checkup', mode: 'insensitive' } },
            { notes: { contains: 'checkup', mode: 'insensitive' } },
            { provider: { contains: 'checkup', mode: 'insensitive' } },
            {
              student: {
                OR: [
                  { firstName: { contains: 'checkup', mode: 'insensitive' } },
                  { lastName: { contains: 'checkup', mode: 'insensitive' } },
                  { studentNumber: { contains: 'checkup', mode: 'insensitive' } }
                ]
              }
            }
          ]
        },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { date: 'desc' }
      });
      expect(result.records).toHaveLength(1);
    });

    it('should filter by type when specified', async () => {
      testPrisma.healthRecord.findMany = jest.fn().mockResolvedValue([]);
      testPrisma.healthRecord.count = jest.fn().mockResolvedValue(0);

      await HealthRecordService.searchHealthRecords('test', 'VACCINATION', 1, 10);

      expect(testPrisma.healthRecord.findMany).toHaveBeenCalledWith({
        where: {
          OR: expect.any(Array),
          type: 'VACCINATION'
        },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { date: 'desc' }
      });
    });
  });

  describe('addChronicCondition', () => {
    it('should add chronic condition successfully', async () => {
      const conditionData = {
        studentId: 'student-1',
        condition: 'Asthma',
        diagnosedDate: new Date('2023-01-01'),
        status: 'ACTIVE',
        severity: 'MODERATE',
        notes: 'Exercise-induced asthma',
        carePlan: 'Use inhaler before PE',
        medications: ['Albuterol'],
        restrictions: ['No running in PE without inhaler'],
        triggers: ['Exercise', 'Cold air'],
        diagnosedBy: 'Dr. Smith',
        lastReviewDate: new Date('2024-01-01'),
        nextReviewDate: new Date('2024-07-01')
      };

      const mockStudent = createTestStudent({ id: 'student-1' });

      testPrisma.student.findUnique = jest.fn().mockResolvedValue(mockStudent);
      testPrisma.chronicCondition.create = jest.fn().mockResolvedValue({
        id: 'condition-1',
        ...conditionData,
        status: 'ACTIVE',
        medications: ['Albuterol'],
        restrictions: ['No running in PE without inhaler'],
        triggers: ['Exercise', 'Cold air'],
        student: {
          id: mockStudent.id,
          firstName: mockStudent.firstName,
          lastName: mockStudent.lastName,
          studentNumber: mockStudent.studentNumber
        }
      });

      const result = await HealthRecordService.addChronicCondition(conditionData);

      expect(testPrisma.chronicCondition.create).toHaveBeenCalledWith({
        data: {
          ...conditionData,
          status: 'ACTIVE',
          medications: ['Albuterol'],
          restrictions: ['No running in PE without inhaler'],
          triggers: ['Exercise', 'Cold air']
        },
        include: expect.any(Object)
      });
      expect(result.condition).toBe(conditionData.condition);
    });

    it('should throw error when student not found', async () => {
      testPrisma.student.findUnique = jest.fn().mockResolvedValue(null);

      await expect(HealthRecordService.addChronicCondition({
        studentId: 'nonexistent',
        condition: 'Test condition',
        diagnosedDate: new Date()
      })).rejects.toThrow('Student not found');
    });
  });

  describe('getStudentChronicConditions', () => {
    it('should return chronic conditions ordered by status and name', async () => {
      const mockConditions = [
        {
          id: 'condition-1',
          condition: 'Asthma',
          status: 'INACTIVE',
          student: createTestStudent()
        },
        {
          id: 'condition-2',
          condition: 'Diabetes',
          status: 'ACTIVE',
          student: createTestStudent()
        }
      ];

      testPrisma.chronicCondition.findMany = jest.fn().mockResolvedValue(mockConditions);

      const result = await HealthRecordService.getStudentChronicConditions('student-1');

      expect(testPrisma.chronicCondition.findMany).toHaveBeenCalledWith({
        where: { studentId: 'student-1' },
        include: expect.any(Object),
        orderBy: [
          { status: 'asc' },
          { condition: 'asc' }
        ]
      });
      expect(result).toHaveLength(2);
      expect(result[0].status).toBe('ACTIVE'); // Active conditions first
      expect(result[1].status).toBe('INACTIVE');
    });
  });

  describe('updateChronicCondition', () => {
    it('should update chronic condition successfully', async () => {
      const existingCondition = {
        id: 'condition-1',
        condition: 'Asthma',
        student: createTestStudent()
      };

      const updateData = {
        status: 'INACTIVE',
        notes: 'Condition resolved'
      };

      testPrisma.chronicCondition.findUnique = jest.fn().mockResolvedValue(existingCondition);
      testPrisma.chronicCondition.update = jest.fn().mockResolvedValue({
        id: 'condition-1',
        ...existingCondition,
        ...updateData,
        student: createTestStudent()
      });

      const result = await HealthRecordService.updateChronicCondition('condition-1', updateData);

      expect(testPrisma.chronicCondition.update).toHaveBeenCalledWith({
        where: { id: 'condition-1' },
        data: updateData,
        include: expect.any(Object)
      });
      expect(result.status).toBe(updateData.status);
    });

    it('should throw error when condition not found', async () => {
      testPrisma.chronicCondition.findUnique = jest.fn().mockResolvedValue(null);

      await expect(HealthRecordService.updateChronicCondition('nonexistent', {
        status: 'INACTIVE'
      })).rejects.toThrow('Chronic condition not found');
    });
  });

  describe('deleteChronicCondition', () => {
    it('should delete chronic condition successfully', async () => {
      const mockCondition = {
        id: 'condition-1',
        condition: 'Asthma',
        student: { firstName: 'John', lastName: 'Doe' }
      };

      testPrisma.chronicCondition.findUnique = jest.fn().mockResolvedValue(mockCondition);
      testPrisma.chronicCondition.delete = jest.fn().mockResolvedValue(mockCondition);

      const result = await HealthRecordService.deleteChronicCondition('condition-1');

      expect(testPrisma.chronicCondition.delete).toHaveBeenCalledWith({
        where: { id: 'condition-1' }
      });
      expect(result.success).toBe(true);
    });

    it('should throw error when condition not found', async () => {
      testPrisma.chronicCondition.findUnique = jest.fn().mockResolvedValue(null);

      await expect(HealthRecordService.deleteChronicCondition('nonexistent'))
        .rejects.toThrow('Chronic condition not found');
    });
  });

  describe('exportHealthHistory', () => {
    it('should export complete health history', async () => {
      const mockStudent = createTestStudent({ id: 'student-1' });
      const mockRecords = [{ id: 'record-1', type: 'CHECKUP' }];
      const mockAllergies = [{ id: 'allergy-1', allergen: 'Peanuts' }];
      const mockConditions = [{ id: 'condition-1', condition: 'Asthma' }];
      const mockVaccinations = [{ id: 'vacc-1', description: 'Flu shot' }];
      const mockGrowthData = [{ date: new Date(), height: 150, weight: 50 }];

      testPrisma.student.findUnique = jest.fn().mockResolvedValue(mockStudent);

      // Mock all the service methods
      jest.spyOn(HealthRecordService, 'getStudentHealthRecords').mockResolvedValue({
        records: mockRecords,
        pagination: { page: 1, limit: 1000, total: 1, pages: 1 }
      });
      jest.spyOn(HealthRecordService, 'getStudentAllergies').mockResolvedValue([
        {
          id: 'allergy-1',
          allergen: 'Peanuts',
          severity: 'SEVERE',
          createdAt: new Date(),
          updatedAt: new Date(),
          studentId: 'student-1',
          reaction: null,
          treatment: null,
          verified: false,
          verifiedBy: null,
          verifiedAt: null,
          student: {
            id: 'student-1',
            studentNumber: '123',
            firstName: 'John',
            lastName: 'Doe'
          }
        }
      ]);
      jest.spyOn(HealthRecordService, 'getStudentChronicConditions').mockResolvedValue([
        {
          id: 'condition-1',
          condition: 'Asthma',
          status: 'INACTIVE',
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          studentId: 'student-1',
          diagnosedDate: new Date(),
          severity: 'MODERATE',
          carePlan: null,
          medications: [],
          restrictions: [],
          triggers: [],
          diagnosedBy: null,
          lastReviewDate: null,
          nextReviewDate: null,
          attachments: [],
          student: {
            id: 'student-1',
            studentNumber: '123',
            firstName: 'John',
            lastName: 'Doe'
          }
        }
      ]);
      jest.spyOn(HealthRecordService, 'getVaccinationRecords').mockResolvedValue([
        {
          id: 'vacc-1',
          type: 'VACCINATION',
          date: new Date(),
          description: 'Flu shot',
          vital: null,
          provider: null,
          notes: null,
          attachments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          studentId: 'student-1',
          student: {
            id: 'student-1',
            studentNumber: '123',
            firstName: 'John',
            lastName: 'Doe'
          }
        }
      ]);
      jest.spyOn(HealthRecordService, 'getGrowthChartData').mockResolvedValue([
        {
          date: new Date(),
          height: 150,
          weight: 50,
          bmi: 22.2,
          recordType: 'CHECKUP'
        }
      ]);

      const result = await HealthRecordService.exportHealthHistory('student-1');

      expect(result.student).toEqual(mockStudent);
      expect(result.healthRecords).toEqual(mockRecords);
      expect(result.allergies).toEqual(mockAllergies);
      expect(result.chronicConditions).toEqual(mockConditions);
      expect(result.vaccinations).toEqual(mockVaccinations);
      expect(result.growthData).toEqual(mockGrowthData);
      expect(result.exportDate).toBeDefined();
    });

    it('should throw error when student not found', async () => {
      testPrisma.student.findUnique = jest.fn().mockResolvedValue(null);

      await expect(HealthRecordService.exportHealthHistory('nonexistent'))
        .rejects.toThrow('Student not found');
    });
  });

  describe('importHealthRecords', () => {
    it('should import health records successfully', async () => {
      const mockStudent = createTestStudent({ id: 'student-1' });
      const importData = {
        healthRecords: [
          {
            type: 'CHECKUP',
            date: '2024-01-01',
            description: 'Imported checkup',
            vital: { height: 150, weight: 50 }
          }
        ]
      };

      testPrisma.student.findUnique = jest.fn().mockResolvedValue(mockStudent);

      // Mock the createHealthRecord method
      jest.spyOn(HealthRecordService, 'createHealthRecord').mockResolvedValue({
        id: 'imported-record',
        type: 'CHECKUP',
        date: new Date('2024-01-01'),
        description: 'Imported checkup',
        student: mockStudent
      });

      const result = await HealthRecordService.importHealthRecords('student-1', importData);

      expect(result.imported).toBe(1);
      expect(result.skipped).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle import errors gracefully', async () => {
      const mockStudent = createTestStudent({ id: 'student-1' });
      const importData = {
        healthRecords: [
          {
            type: 'CHECKUP',
            date: '2024-01-01',
            description: 'Valid record',
            vital: { height: 150, weight: 50 }
          },
          {
            type: 'CHECKUP',
            date: '2024-01-02',
            description: 'Invalid record - missing required fields'
            // Missing required fields
          }
        ]
      };

      testPrisma.student.findUnique = jest.fn().mockResolvedValue(mockStudent);

      // Mock createHealthRecord to succeed for first record, fail for second
      jest.spyOn(HealthRecordService, 'createHealthRecord')
        .mockResolvedValueOnce({
          id: 'imported-record',
          type: 'CHECKUP',
          date: new Date('2024-01-01'),
          description: 'Imported checkup',
          student: mockStudent
        })
        .mockRejectedValueOnce(new Error('Missing required fields'));

      const result = await HealthRecordService.importHealthRecords('student-1', importData);

      expect(result.imported).toBe(1);
      expect(result.skipped).toBe(1);
      expect(result.errors).toHaveLength(1);
    });

    it('should throw error when student not found', async () => {
      testPrisma.student.findUnique = jest.fn().mockResolvedValue(null);

      await expect(HealthRecordService.importHealthRecords('nonexistent', {
        healthRecords: []
      })).rejects.toThrow('Student not found');
    });
  });

  describe('bulkDeleteHealthRecords', () => {
    it('should delete multiple health records successfully', async () => {
      const recordIds = ['record-1', 'record-2', 'record-3'];

      const mockRecords = [
        {
          id: 'record-1',
          type: 'CHECKUP',
          student: { firstName: 'John', lastName: 'Doe', studentNumber: '123' }
        },
        {
          id: 'record-2',
          type: 'VACCINATION',
          student: { firstName: 'Jane', lastName: 'Smith', studentNumber: '456' }
        }
      ];

      testPrisma.healthRecord.findMany = jest.fn().mockResolvedValue(mockRecords);
      testPrisma.healthRecord.deleteMany = jest.fn().mockResolvedValue({ count: 2 });

      const result = await HealthRecordService.bulkDeleteHealthRecords(recordIds);

      expect(testPrisma.healthRecord.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: recordIds }
        }
      });
      expect(result.deleted).toBe(2);
      expect(result.notFound).toBe(1); // 3 requested, 2 found
      expect(result.success).toBe(true);
    });

    it('should throw error when no record IDs provided', async () => {
      await expect(HealthRecordService.bulkDeleteHealthRecords([]))
        .rejects.toThrow('No record IDs provided');
    });
  });
});
