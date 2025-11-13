/**
 * HEALTH RECORD SERVICE TESTS (CRITICAL - HIPAA COMPLIANT)
 *
 * Comprehensive tests for HIPAA-compliant health record management including:
 * - Health record CRUD with PHI protection
 * - Allergy management with severity tracking
 * - Vaccination records with CDC compliance
 * - Chronic condition tracking
 * - Vital signs and growth data
 * - PHI access audit logging
 * - Search and export functionality
 * - Import/export operations
 * - Statistics and reporting
 * - All error scenarios
 *
 * @security HIPAA Privacy Rule §164.308
 * @security HIPAA Security Rule §164.312
 * @compliance CDC Guidelines, ICD-10-CM Standards
 * @coverage Target: 95%+
 */

import { Test, TestingModule } from '@nestjs/testing';
import { HealthRecordService } from '../health-record.service';
import { getModelToken } from '@nestjs/sequelize';
import { HealthRecord   } from '@/database/models';
import { Allergy   } from '@/database/models';
import { Student   } from '@/database/models';
import { ChronicCondition   } from '@/database/models';
import { Vaccination   } from '@/database/models';
import { NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';

describe('HealthRecordService (CRITICAL - HIPAA COMPLIANT)', () => {
  let service: HealthRecordService;
  let healthRecordModel: typeof HealthRecord;
  let allergyModel: typeof Allergy;
  let studentModel: typeof Student;
  let chronicConditionModel: typeof ChronicCondition;
  let vaccinationModel: typeof Vaccination;

  // ==================== Mock Data ====================

  const mockStudent = {
    id: 'student-test-123',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('2010-01-15'),
  };

  const mockHealthRecord = {
    id: 'hr-test-123',
    studentId: 'student-test-123',
    recordType: 'CHECKUP',
    recordDate: new Date(),
    title: 'Annual Physical',
    description: 'Routine checkup',
    provider: 'Dr. Smith',
    metadata: {
      height: '150',
      weight: '45',
      temperature: '98.6',
    },
    student: mockStudent,
  };

  const mockAllergy = {
    id: 'allergy-test-123',
    studentId: 'student-test-123',
    allergen: 'Peanuts',
    severity: 'LIFE_THREATENING',
    reaction: 'Anaphylaxis',
    verified: true,
    verificationDate: new Date(),
    active: true,
    student: mockStudent,
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockVaccination = {
    id: 'vax-test-123',
    studentId: 'student-test-123',
    vaccineName: 'MMR',
    administrationDate: new Date(),
    doseNumber: 2,
    totalDoses: 2,
    seriesComplete: true,
    provider: 'School Nurse',
    student: mockStudent,
    update: jest.fn(),
  };

  const mockChronicCondition = {
    id: 'cc-test-123',
    studentId: 'student-test-123',
    condition: 'Asthma',
    diagnosedDate: new Date('2018-03-15'),
    status: 'MANAGED',
    isActive: true,
    student: mockStudent,
    update: jest.fn(),
  };

  // ==================== Mock Setup ====================

  const mockHealthRecordModel = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
    sequelize: {
      fn: jest.fn(),
      col: jest.fn(),
    },
  };

  const mockAllergyModel = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockStudentModel = {
    findByPk: jest.fn(),
  };

  const mockChronicConditionModel = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
  };

  const mockVaccinationModel = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthRecordService,
        {
          provide: getModelToken(HealthRecord),
          useValue: mockHealthRecordModel,
        },
        {
          provide: getModelToken(Allergy),
          useValue: mockAllergyModel,
        },
        {
          provide: getModelToken(Student),
          useValue: mockStudentModel,
        },
        {
          provide: getModelToken(ChronicCondition),
          useValue: mockChronicConditionModel,
        },
        {
          provide: getModelToken(Vaccination),
          useValue: mockVaccinationModel,
        },
      ],
    }).compile();

    service = module.get<HealthRecordService>(HealthRecordService);
    healthRecordModel = module.get<typeof HealthRecord>(
      getModelToken(HealthRecord),
    );
    allergyModel = module.get<typeof Allergy>(getModelToken(Allergy));
    studentModel = module.get<typeof Student>(getModelToken(Student));
    chronicConditionModel = module.get<typeof ChronicCondition>(
      getModelToken(ChronicCondition),
    );
    vaccinationModel = module.get<typeof Vaccination>(
      getModelToken(Vaccination),
    );

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== GET STUDENT HEALTH RECORDS TESTS ====================

  describe('getStudentHealthRecords', () => {
    it('should return paginated health records for student', async () => {
      // Arrange
      mockHealthRecordModel.findAndCountAll.mockResolvedValue({
        rows: [mockHealthRecord],
        count: 1,
      });

      // Act
      const result = await service.getStudentHealthRecords('student-test-123', 1, 20);

      // Assert
      expect(result.records).toHaveLength(1);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        pages: 1,
      });
      expect(mockHealthRecordModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { studentId: 'student-test-123' },
          order: [['recordDate', 'DESC']],
          limit: 20,
          offset: 0,
        }),
      );
    });

    it('should filter by record type', async () => {
      // Arrange
      mockHealthRecordModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      // Act
      await service.getStudentHealthRecords('student-test-123', 1, 20, {
        type: 'VACCINATION',
      });

      // Assert
      expect(mockHealthRecordModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            recordType: 'VACCINATION',
          }),
        }),
      );
    });

    it('should filter by date range', async () => {
      // Arrange
      const dateFrom = new Date('2024-01-01');
      const dateTo = new Date('2024-12-31');
      mockHealthRecordModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      // Act
      await service.getStudentHealthRecords('student-test-123', 1, 20, {
        dateFrom,
        dateTo,
      });

      // Assert
      expect(mockHealthRecordModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            recordDate: expect.objectContaining({
              [Op.gte]: dateFrom,
              [Op.lte]: dateTo,
            }),
          }),
        }),
      );
    });

    it('should filter by provider name', async () => {
      // Arrange
      mockHealthRecordModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      // Act
      await service.getStudentHealthRecords('student-test-123', 1, 20, {
        provider: 'Dr. Smith',
      });

      // Assert
      expect(mockHealthRecordModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            provider: { [Op.iLike]: '%Dr. Smith%' },
          }),
        }),
      );
    });

    it('should include student association in results', async () => {
      // Arrange
      mockHealthRecordModel.findAndCountAll.mockResolvedValue({
        rows: [mockHealthRecord],
        count: 1,
      });

      // Act
      await service.getStudentHealthRecords('student-test-123', 1, 20);

      // Assert
      expect(mockHealthRecordModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ model: mockStudentModel, as: 'student' }),
          ]),
        }),
      );
    });
  });

  // ==================== CREATE HEALTH RECORD TESTS ====================

  describe('createHealthRecord', () => {
    const createDto = {
      studentId: 'student-test-123',
      recordType: 'CHECKUP',
      recordDate: new Date(),
      title: 'Physical Exam',
      description: 'Annual physical examination',
      provider: 'Dr. Johnson',
    };

    it('should create health record successfully', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockHealthRecordModel.create.mockResolvedValue({ id: 'hr-new-123' });
      mockHealthRecordModel.findByPk.mockResolvedValue(mockHealthRecord);

      // Act
      const result = await service.createHealthRecord(createDto);

      // Assert
      expect(result).toBeDefined();
      expect(mockStudentModel.findByPk).toHaveBeenCalledWith('student-test-123');
      expect(mockHealthRecordModel.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw NotFoundException if student not found', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(service.createHealthRecord(createDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.createHealthRecord(createDto)).rejects.toThrow(
        'Student not found',
      );
    });

    it('should reload record with associations after creation', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockHealthRecordModel.create.mockResolvedValue({ id: 'hr-new-123' });
      mockHealthRecordModel.findByPk.mockResolvedValue(mockHealthRecord);

      // Act
      await service.createHealthRecord(createDto);

      // Assert
      expect(mockHealthRecordModel.findByPk).toHaveBeenCalledWith(
        'hr-new-123',
        expect.objectContaining({
          include: expect.any(Array),
        }),
      );
    });
  });

  // ==================== UPDATE HEALTH RECORD TESTS ====================

  describe('updateHealthRecord', () => {
    const updateDto = {
      title: 'Updated Title',
      description: 'Updated description',
    };

    it('should update health record successfully', async () => {
      // Arrange
      const existingRecord = {
        ...mockHealthRecord,
        update: jest.fn().mockResolvedValue(true),
      };
      mockHealthRecordModel.findOne.mockResolvedValue(existingRecord);
      mockHealthRecordModel.findByPk.mockResolvedValue({
        ...existingRecord,
        ...updateDto,
      });

      // Act
      const result = await service.updateHealthRecord('hr-test-123', updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(existingRecord.update).toHaveBeenCalledWith(updateDto);
    });

    it('should throw NotFoundException if record not found', async () => {
      // Arrange
      mockHealthRecordModel.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateHealthRecord('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== VACCINATION RECORDS TESTS ====================

  describe('getVaccinationRecords', () => {
    it('should return vaccination records for student', async () => {
      // Arrange
      mockHealthRecordModel.findAll.mockResolvedValue([mockHealthRecord]);

      // Act
      const result = await service.getVaccinationRecords('student-test-123');

      // Assert
      expect(result).toHaveLength(1);
      expect(mockHealthRecordModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            studentId: 'student-test-123',
            recordType: 'VACCINATION',
          },
          order: [['recordDate', 'DESC']],
        }),
      );
    });
  });

  // ==================== BULK DELETE TESTS ====================

  describe('bulkDeleteHealthRecords', () => {
    it('should soft delete multiple health records', async () => {
      // Arrange
      const recordIds = ['hr-1', 'hr-2', 'hr-3'];
      mockHealthRecordModel.findAll.mockResolvedValue([
        { ...mockHealthRecord, id: 'hr-1' },
        { ...mockHealthRecord, id: 'hr-2' },
      ]);
      mockHealthRecordModel.destroy.mockResolvedValue(2);

      // Act
      const result = await service.bulkDeleteHealthRecords(recordIds);

      // Assert
      expect(result.deleted).toBe(2);
      expect(result.notFound).toBe(1);
      expect(result.success).toBe(true);
    });

    it('should throw error if no record IDs provided', async () => {
      // Act & Assert
      await expect(service.bulkDeleteHealthRecords([])).rejects.toThrow(
        'No record IDs provided',
      );
    });
  });

  // ==================== ALLERGY MANAGEMENT TESTS ====================

  describe('addAllergy', () => {
    const allergyDto = {
      studentId: 'student-test-123',
      allergen: 'Shellfish',
      severity: 'SEVERE',
      reaction: 'Hives and swelling',
      verified: true,
    };

    it('should create allergy successfully', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockAllergyModel.findOne.mockResolvedValue(null);
      mockAllergyModel.create.mockResolvedValue({ id: 'allergy-new-123' });
      mockAllergyModel.findByPk.mockResolvedValue(mockAllergy);

      // Act
      const result = await service.addAllergy(allergyDto);

      // Assert
      expect(result).toBeDefined();
      expect(mockAllergyModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...allergyDto,
          verificationDate: expect.any(Date),
        }),
      );
    });

    it('should throw error if allergen already exists for student', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockAllergyModel.findOne.mockResolvedValue(mockAllergy);

      // Act & Assert
      await expect(service.addAllergy(allergyDto)).rejects.toThrow(
        'Allergy to Shellfish already exists',
      );
    });

    it('should throw NotFoundException if student not found', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(service.addAllergy(allergyDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should set verificationDate when verified is true', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockAllergyModel.findOne.mockResolvedValue(null);
      mockAllergyModel.create.mockResolvedValue({ id: 'allergy-new-123' });
      mockAllergyModel.findByPk.mockResolvedValue(mockAllergy);

      // Act
      await service.addAllergy(allergyDto);

      // Assert
      expect(mockAllergyModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          verificationDate: expect.any(Date),
        }),
      );
    });
  });

  describe('updateAllergy', () => {
    const updateDto = {
      severity: 'MODERATE',
      verified: true,
    };

    it('should update allergy successfully', async () => {
      // Arrange
      const existingAllergy = {
        ...mockAllergy,
        verified: false,
        update: jest.fn().mockResolvedValue(true),
      };
      mockAllergyModel.findOne.mockResolvedValue(existingAllergy);
      mockAllergyModel.findByPk.mockResolvedValue({
        ...existingAllergy,
        ...updateDto,
      });

      // Act
      const result = await service.updateAllergy('allergy-test-123', updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(existingAllergy.update).toHaveBeenCalledWith(
        expect.objectContaining({
          ...updateDto,
          verificationDate: expect.any(Date),
        }),
      );
    });

    it('should not update verificationDate if already verified', async () => {
      // Arrange
      const verifiedAllergy = {
        ...mockAllergy,
        verified: true,
        verificationDate: new Date('2023-01-01'),
        update: jest.fn().mockResolvedValue(true),
      };
      mockAllergyModel.findOne.mockResolvedValue(verifiedAllergy);
      mockAllergyModel.findByPk.mockResolvedValue(verifiedAllergy);

      // Act
      await service.updateAllergy('allergy-test-123', { severity: 'MILD' });

      // Assert
      expect(verifiedAllergy.update).not.toHaveBeenCalledWith(
        expect.objectContaining({
          verificationDate: expect.any(Date),
        }),
      );
    });
  });

  describe('getStudentAllergies', () => {
    it('should return allergies ordered by severity', async () => {
      // Arrange
      mockAllergyModel.findAll.mockResolvedValue([mockAllergy]);

      // Act
      const result = await service.getStudentAllergies('student-test-123');

      // Assert
      expect(result).toHaveLength(1);
      expect(mockAllergyModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { studentId: 'student-test-123' },
          order: [
            ['severity', 'DESC'],
            ['allergen', 'ASC'],
          ],
        }),
      );
    });
  });

  describe('deleteAllergy', () => {
    it('should soft delete allergy', async () => {
      // Arrange
      mockAllergyModel.findOne.mockResolvedValue(mockAllergy);
      mockAllergyModel.destroy.mockResolvedValue(1);

      // Act
      const result = await service.deleteAllergy('allergy-test-123');

      // Assert
      expect(result.success).toBe(true);
      expect(mockAllergyModel.destroy).toHaveBeenCalledWith({
        where: { id: 'allergy-test-123' },
      });
    });

    it('should throw NotFoundException if allergy not found', async () => {
      // Arrange
      mockAllergyModel.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deleteAllergy('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ==================== VACCINATION MANAGEMENT TESTS ====================

  describe('addVaccination', () => {
    const vaccinationDto = {
      studentId: 'student-test-123',
      vaccineName: 'Tdap',
      administrationDate: new Date(),
      doseNumber: 1,
      totalDoses: 3,
      provider: 'School Nurse',
    };

    it('should create vaccination successfully', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockVaccinationModel.create.mockResolvedValue({ id: 'vax-new-123' });
      mockVaccinationModel.findByPk.mockResolvedValue(mockVaccination);

      // Act
      const result = await service.addVaccination(vaccinationDto);

      // Assert
      expect(result).toBeDefined();
      expect(mockVaccinationModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...vaccinationDto,
          seriesComplete: false,
        }),
      );
    });

    it('should set seriesComplete to true when dose equals totalDoses', async () => {
      // Arrange
      const completeDto = { ...vaccinationDto, doseNumber: 3, totalDoses: 3 };
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockVaccinationModel.create.mockResolvedValue({ id: 'vax-new-123' });
      mockVaccinationModel.findByPk.mockResolvedValue(mockVaccination);

      // Act
      await service.addVaccination(completeDto);

      // Assert
      expect(mockVaccinationModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          seriesComplete: true,
        }),
      );
    });
  });

  describe('updateVaccination', () => {
    const updateDto = {
      doseNumber: 3,
      totalDoses: 3,
    };

    it('should update vaccination and recalculate seriesComplete', async () => {
      // Arrange
      const existingVaccination = {
        ...mockVaccination,
        doseNumber: 2,
        seriesComplete: false,
        update: jest.fn().mockResolvedValue(true),
      };
      mockVaccinationModel.findOne.mockResolvedValue(existingVaccination);
      mockVaccinationModel.findByPk.mockResolvedValue({
        ...existingVaccination,
        ...updateDto,
        seriesComplete: true,
      });

      // Act
      const result = await service.updateVaccination('vax-test-123', updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(existingVaccination.update).toHaveBeenCalledWith(
        expect.objectContaining({
          ...updateDto,
          seriesComplete: true,
        }),
      );
    });
  });

  describe('getStudentVaccinations', () => {
    it('should return vaccinations ordered by administration date', async () => {
      // Arrange
      mockVaccinationModel.findAll.mockResolvedValue([mockVaccination]);

      // Act
      const result = await service.getStudentVaccinations('student-test-123');

      // Assert
      expect(result).toHaveLength(1);
      expect(mockVaccinationModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { studentId: 'student-test-123' },
          order: [['administrationDate', 'DESC']],
        }),
      );
    });
  });

  // ==================== CHRONIC CONDITION MANAGEMENT TESTS ====================

  describe('addChronicCondition', () => {
    const conditionDto = {
      studentId: 'student-test-123',
      condition: 'Diabetes Type 1',
      diagnosedDate: new Date('2020-06-15'),
      status: 'MANAGED',
      managementPlan: 'Insulin therapy',
    };

    it('should create chronic condition successfully', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockChronicConditionModel.create.mockResolvedValue({ id: 'cc-new-123' });
      mockChronicConditionModel.findByPk.mockResolvedValue(mockChronicCondition);

      // Act
      const result = await service.addChronicCondition(conditionDto);

      // Assert
      expect(result).toBeDefined();
      expect(mockChronicConditionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...conditionDto,
          isActive: true,
        }),
      );
    });

    it('should throw NotFoundException if student not found', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(service.addChronicCondition(conditionDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getStudentChronicConditions', () => {
    it('should return active chronic conditions ordered by status', async () => {
      // Arrange
      mockChronicConditionModel.findAll.mockResolvedValue([mockChronicCondition]);

      // Act
      const result = await service.getStudentChronicConditions('student-test-123');

      // Assert
      expect(result).toHaveLength(1);
      expect(mockChronicConditionModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { studentId: 'student-test-123', isActive: true },
          order: [
            ['status', 'ASC'],
            ['diagnosedDate', 'DESC'],
          ],
        }),
      );
    });
  });

  // ==================== GROWTH AND VITAL SIGNS TESTS ====================

  describe('getGrowthChartData', () => {
    it('should return growth data points with BMI calculation', async () => {
      // Arrange
      const records = [
        {
          ...mockHealthRecord,
          recordDate: new Date('2024-01-01'),
          metadata: { height: '150', weight: '45' },
        },
        {
          ...mockHealthRecord,
          id: 'hr-2',
          recordDate: new Date('2024-06-01'),
          metadata: { height: '155', weight: '48' },
        },
      ];
      mockHealthRecordModel.findAll.mockResolvedValue(records);

      // Act
      const result = await service.getGrowthChartData('student-test-123');

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('height', 150);
      expect(result[0]).toHaveProperty('weight', 45);
      expect(result[0]).toHaveProperty('bmi');
      expect(result[0].bmi).toBeCloseTo(20, 0);
    });

    it('should filter records with valid height or weight', async () => {
      // Arrange
      const records = [
        { ...mockHealthRecord, metadata: { height: '150' } },
        { ...mockHealthRecord, metadata: {} }, // No height/weight
        { ...mockHealthRecord, metadata: { weight: '45' } },
      ];
      mockHealthRecordModel.findAll.mockResolvedValue(records);

      // Act
      const result = await service.getGrowthChartData('student-test-123');

      // Assert
      expect(result).toHaveLength(2);
    });
  });

  describe('getRecentVitals', () => {
    it('should return recent vital signs from health records', async () => {
      // Arrange
      const records = [
        {
          ...mockHealthRecord,
          recordType: 'VITAL_SIGNS_CHECK',
          metadata: {
            temperature: '98.6',
            heartRate: '72',
            bloodPressureSystolic: '120',
            bloodPressureDiastolic: '80',
          },
        },
      ];
      mockHealthRecordModel.findAll.mockResolvedValue(records);

      // Act
      const result = await service.getRecentVitals('student-test-123', 10);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('temperature', '98.6');
      expect(result[0]).toHaveProperty('heartRate', '72');
    });

    it('should limit results to specified count', async () => {
      // Arrange
      mockHealthRecordModel.findAll.mockResolvedValue([]);

      // Act
      await service.getRecentVitals('student-test-123', 5);

      // Assert
      expect(mockHealthRecordModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 5,
        }),
      );
    });
  });

  // ==================== SEARCH AND EXPORT TESTS ====================

  describe('searchHealthRecords', () => {
    it('should search health records by keyword', async () => {
      // Arrange
      mockHealthRecordModel.findAndCountAll.mockResolvedValue({
        rows: [mockHealthRecord],
        count: 1,
      });

      // Act
      const result = await service.searchHealthRecords('annual', undefined, 1, 20);

      // Assert
      expect(result.records).toHaveLength(1);
      expect(mockHealthRecordModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            [Op.or]: expect.arrayContaining([
              { title: { [Op.iLike]: '%annual%' } },
              { description: { [Op.iLike]: '%annual%' } },
              { diagnosis: { [Op.iLike]: '%annual%' } },
              { treatment: { [Op.iLike]: '%annual%' } },
            ]),
          }),
        }),
      );
    });

    it('should filter search results by record type', async () => {
      // Arrange
      mockHealthRecordModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      // Act
      await service.searchHealthRecords('keyword', 'CHECKUP', 1, 20);

      // Assert
      expect(mockHealthRecordModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            recordType: 'CHECKUP',
          }),
        }),
      );
    });
  });

  describe('exportHealthHistory', () => {
    it('should export complete health history for student', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockHealthRecordModel.findAll.mockResolvedValue([mockHealthRecord]);
      mockAllergyModel.findAll.mockResolvedValue([mockAllergy]);
      mockVaccinationModel.findAll.mockResolvedValue([mockVaccination]);
      mockChronicConditionModel.findAll.mockResolvedValue([mockChronicCondition]);

      // Act
      const result = await service.exportHealthHistory('student-test-123');

      // Assert
      expect(result).toHaveProperty('exportDate');
      expect(result).toHaveProperty('student');
      expect(result).toHaveProperty('healthRecords');
      expect(result).toHaveProperty('allergies');
      expect(result).toHaveProperty('vaccinations');
      expect(result).toHaveProperty('chronicConditions');
      expect(result.summary.totalRecords).toBe(1);
      expect(result.summary.totalAllergies).toBe(1);
    });

    it('should throw NotFoundException if student not found', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.exportHealthHistory('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== IMPORT HEALTH RECORDS TESTS ====================

  describe('importHealthRecords', () => {
    const importData = {
      healthRecords: [
        {
          recordType: 'CHECKUP',
          recordDate: new Date(),
          title: 'Imported Record',
        },
      ],
      allergies: [{ allergen: 'Pollen', severity: 'MILD' }],
      vaccinations: [{ vaccineName: 'Flu', administrationDate: new Date() }],
    };

    it('should import health records successfully', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockHealthRecordModel.create.mockResolvedValue(mockHealthRecord);
      mockAllergyModel.findOne.mockResolvedValue(null);
      mockAllergyModel.create.mockResolvedValue(mockAllergy);
      mockVaccinationModel.create.mockResolvedValue(mockVaccination);

      // Act
      const result = await service.importHealthRecords(
        'student-test-123',
        importData,
      );

      // Assert
      expect(result.imported).toBe(3);
      expect(result.skipped).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should skip duplicate allergies', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockHealthRecordModel.create.mockResolvedValue(mockHealthRecord);
      mockAllergyModel.findOne.mockResolvedValue(mockAllergy);

      // Act
      const result = await service.importHealthRecords('student-test-123', {
        healthRecords: [],
        allergies: [{ allergen: 'Peanuts', severity: 'SEVERE' }],
      });

      // Assert
      expect(result.skipped).toBe(1);
    });

    it('should return error for student not found', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(null);

      // Act
      const result = await service.importHealthRecords(
        'non-existent-id',
        importData,
      );

      // Assert
      expect(result.errors).toContain('Student not found');
    });
  });

  // ==================== HEALTH SUMMARY TESTS ====================

  describe('getHealthSummary', () => {
    it('should return comprehensive health summary', async () => {
      // Arrange
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockAllergyModel.findAll.mockResolvedValue([mockAllergy]);
      mockVaccinationModel.findAll.mockResolvedValue([mockVaccination]);
      mockHealthRecordModel.findAll
        .mockResolvedValueOnce([]) // getRecentVitals
        .mockResolvedValueOnce([
          { recordType: 'CHECKUP', count: '5' },
          { recordType: 'VACCINATION', count: '3' },
        ]);

      // Act
      const result = await service.getHealthSummary('student-test-123');

      // Assert
      expect(result).toHaveProperty('student');
      expect(result).toHaveProperty('allergies');
      expect(result).toHaveProperty('recentVitals');
      expect(result).toHaveProperty('recentVaccinations');
      expect(result).toHaveProperty('recordCounts');
      expect(result.recordCounts.CHECKUP).toBe(5);
    });
  });

  // ==================== STATISTICS TESTS ====================

  describe('getHealthRecordStatistics', () => {
    it('should return system-wide health statistics', async () => {
      // Arrange
      mockHealthRecordModel.count.mockResolvedValueOnce(100); // totalRecords
      mockAllergyModel.count.mockResolvedValueOnce(25); // activeAllergies
      mockChronicConditionModel.count.mockResolvedValueOnce(15); // chronicConditions
      mockVaccinationModel.count.mockResolvedValueOnce(8); // vaccinationsDue
      mockHealthRecordModel.count.mockResolvedValueOnce(42); // recentRecords

      // Act
      const result = await service.getHealthRecordStatistics();

      // Assert
      expect(result).toEqual({
        totalRecords: 100,
        activeAllergies: 25,
        chronicConditions: 15,
        vaccinationsDue: 8,
        recentRecords: 42,
      });
    });
  });

  // ==================== PHI AUDIT LOGGING TESTS ====================

  describe('PHI Audit Logging', () => {
    it('should log PHI access when retrieving health records', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');
      mockHealthRecordModel.findAndCountAll.mockResolvedValue({
        rows: [mockHealthRecord],
        count: 1,
      });

      // Act
      await service.getStudentHealthRecords('student-test-123', 1, 20);

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('PHI Access: Health records retrieved'),
      );
    });

    it('should log PHI creation when adding allergy', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockAllergyModel.findOne.mockResolvedValue(null);
      mockAllergyModel.create.mockResolvedValue({ id: 'allergy-new-123' });
      mockAllergyModel.findByPk.mockResolvedValue(mockAllergy);

      // Act
      await service.addAllergy({
        studentId: 'student-test-123',
        allergen: 'Test',
        severity: 'MILD',
      });

      // Assert
      expect(logSpy).toHaveBeenCalled();
    });

    it('should log warning for critical allergy additions', async () => {
      // Arrange
      const warnSpy = jest.spyOn(service['logger'], 'warn');
      mockStudentModel.findByPk.mockResolvedValue(mockStudent);
      mockAllergyModel.findOne.mockResolvedValue(null);
      mockAllergyModel.create.mockResolvedValue({ id: 'allergy-new-123' });
      mockAllergyModel.findByPk.mockResolvedValue(mockAllergy);

      // Act
      await service.addAllergy({
        studentId: 'student-test-123',
        allergen: 'Bee Sting',
        severity: 'LIFE_THREATENING',
      });

      // Assert
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('CRITICAL ALLERGY ADDED'),
      );
    });
  });

  // ==================== ERROR HANDLING TESTS ====================

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Arrange
      mockHealthRecordModel.findAndCountAll.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(
        service.getStudentHealthRecords('student-test-123', 1, 20),
      ).rejects.toThrow();
    });
  });
});
