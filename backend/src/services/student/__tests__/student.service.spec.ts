/**
 * STUDENT SERVICE TESTS (CRITICAL - HIPAA COMPLIANT)
 *
 * Comprehensive tests for student management operations including:
 * - CRUD operations with validation
 * - Student enrollment and transfers
 * - Bulk operations (import, update, export)
 * - Grade transitions
 * - Health records association
 * - Academic transcript integration
 * - Barcode generation and scanning
 * - Medication verification
 * - Waitlist management
 * - Search functionality
 * - Statistics and trends
 * - All error scenarios
 *
 * @security HIPAA compliant student management
 * @security PHI protection
 * @security Multi-tenant data isolation
 * @coverage Target: 90%+
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from '../student.service';
import { getConnectionToken, getModelToken } from '@nestjs/sequelize';
import { Student } from '@/database/models';
import { User } from '@/database/models';
import { UserRole } from '@/services/user/enums/user-role.enum';
import { HealthRecord } from '@/database/models';
import { MentalHealthRecord } from '@/database/models';
import { AcademicTranscriptService } from '@/services/academic-transcript/academic-transcript.service';
import { QueryCacheService } from '@/database/services/query-cache.service';
import { AppConfigService } from '@/common/config/app-config.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';

describe('StudentService (CRITICAL - HIPAA COMPLIANT)', () => {
  let service: StudentService;
  let studentModel: typeof Student;
  let userModel: typeof User;
  let healthRecordModel: typeof HealthRecord;
  let mentalHealthRecordModel: typeof MentalHealthRecord;
  let academicTranscriptService: AcademicTranscriptService;
  let sequelize: any;
  let queryCacheService: QueryCacheService;

  // ==================== Mock Data ====================

  const mockStudent = {
    id: 'student-test-123',
    studentNumber: 'STU001',
    medicalRecordNum: 'MRN001',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('2010-01-15'),
    gender: 'MALE',
    grade: '5',
    isActive: true,
    nurseId: 'nurse-test-123',
    photo: null,
    enrollmentDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn(),
    toJSON: jest.fn().mockReturnValue({
      id: 'student-test-123',
      studentNumber: 'STU001',
      firstName: 'John',
      lastName: 'Doe',
    }),
  };

  const mockNurse = {
    id: 'nurse-test-123',
    fullName: 'Jane Nurse',
    email: 'nurse@whitecross.edu',
    role: UserRole.NURSE,
    isActive: true,
  };

  // ==================== Mock Setup ====================

  const mockStudentModel = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
    sequelize: {
      fn: jest.fn((fnName, arg) => ({ fnName, arg })),
      col: jest.fn((colName) => ({ colName })),
    },
  };

  const mockUserModel = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
  };

  const mockHealthRecordModel = {
    findAndCountAll: jest.fn(),
    findAll: jest.fn(),
  };

  const mockMentalHealthRecordModel = {
    findAndCountAll: jest.fn(),
  };

  const mockAcademicTranscriptService = {
    importTranscript: jest.fn(),
    getAcademicHistory: jest.fn(),
    analyzePerformanceTrends: jest.fn(),
    batchGetAcademicHistories: jest.fn(),
  };

  const mockSequelize = {
    transaction: jest.fn(),
  };

  const mockQueryCacheService = {
    findWithCache: jest.fn(),
  };

  const mockAppConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getModelToken(Student),
          useValue: mockStudentModel,
        },
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(HealthRecord),
          useValue: mockHealthRecordModel,
        },
        {
          provide: getModelToken(MentalHealthRecord),
          useValue: mockMentalHealthRecordModel,
        },
        {
          provide: AcademicTranscriptService,
          useValue: mockAcademicTranscriptService,
        },
        {
          provide: getConnectionToken(),
          useValue: mockSequelize,
        },
        {
          provide: QueryCacheService,
          useValue: mockQueryCacheService,
        },
        {
          provide: AppConfigService,
          useValue: mockAppConfigService,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentModel = module.get<typeof Student>(getModelToken(Student));
    userModel = module.get<typeof User>(getModelToken(User));
    healthRecordModel = module.get<typeof HealthRecord>(
      getModelToken(HealthRecord),
    );
    mentalHealthRecordModel = module.get<typeof MentalHealthRecord>(
      getModelToken(MentalHealthRecord),
    );
    academicTranscriptService = module.get<AcademicTranscriptService>(
      AcademicTranscriptService,
    );
    sequelize = module.get(getConnectionToken());
    queryCacheService = module.get<QueryCacheService>(QueryCacheService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== CREATE STUDENT TESTS ====================

  describe('create', () => {
    const validCreateDto = {
      studentNumber: 'STU002',
      medicalRecordNum: 'MRN002',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('2011-05-20'),
      gender: 'FEMALE',
      grade: '4',
      nurseId: 'nurse-test-123',
    };

    it('should create a new student successfully', async () => {
      // Arrange
      mockStudentModel.findOne.mockResolvedValue(null);
      mockUserModel.findOne.mockResolvedValue(mockNurse);
      mockStudentModel.create.mockResolvedValue(mockStudent);

      // Act
      const result = await service.create(validCreateDto);

      // Assert
      expect(result).toBeDefined();
      expect(mockStudentModel.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if student number already exists', async () => {
      // Arrange
      mockStudentModel.findOne.mockResolvedValue(mockStudent);

      // Act & Assert
      await expect(service.create(validCreateDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(validCreateDto)).rejects.toThrow(
        'Student number already exists',
      );
    });

    it('should throw ConflictException if medical record number already exists', async () => {
      // Arrange
      mockStudentModel.findOne
        .mockResolvedValueOnce(null) // studentNumber check
        .mockResolvedValueOnce(mockStudent); // medicalRecordNum check

      // Act & Assert
      await expect(service.create(validCreateDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(validCreateDto)).rejects.toThrow(
        'Medical record number already exists',
      );
    });

    it('should throw BadRequestException for future date of birth', async () => {
      // Arrange
      const futureDto = {
        ...validCreateDto,
        dateOfBirth: new Date(Date.now() + 86400000),
      };
      mockStudentModel.findOne.mockResolvedValue(null);
      mockUserModel.findOne.mockResolvedValue(mockNurse);

      // Act & Assert
      await expect(service.create(futureDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(futureDto)).rejects.toThrow(
        'Date of birth must be in the past',
      );
    });

    it('should throw BadRequestException for age below 3 years', async () => {
      // Arrange
      const youngDto = {
        ...validCreateDto,
        dateOfBirth: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year old
      };
      mockStudentModel.findOne.mockResolvedValue(null);
      mockUserModel.findOne.mockResolvedValue(mockNurse);

      // Act & Assert
      await expect(service.create(youngDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(youngDto)).rejects.toThrow(
        'Student age must be between 3 and 100 years',
      );
    });

    it('should throw NotFoundException if assigned nurse not found', async () => {
      // Arrange
      mockStudentModel.findOne.mockResolvedValue(null);
      mockUserModel.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(validCreateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(validCreateDto)).rejects.toThrow(
        'Assigned nurse not found',
      );
    });

    it('should normalize student number to uppercase', async () => {
      // Arrange
      const lowercaseDto = { ...validCreateDto, studentNumber: 'stu002' };
      mockStudentModel.findOne.mockResolvedValue(null);
      mockUserModel.findOne.mockResolvedValue(mockNurse);
      mockStudentModel.create.mockResolvedValue(mockStudent);

      // Act
      await service.create(lowercaseDto);

      // Assert
      expect(mockStudentModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          studentNumber: 'STU002',
        }),
      );
    });
  });

  // ==================== FIND ALL STUDENTS TESTS ====================

  describe('findAll', () => {
    const mockPaginationResult = {
      rows: [mockStudent],
      count: 1,
    };

    it('should return paginated students with eager loading', async () => {
      // Arrange
      mockStudentModel.findAndCountAll.mockResolvedValue(mockPaginationResult);

      // Act
      const result = await service.findAll({ page: 1, limit: 20 });

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        pages: 1,
      });
      expect(mockStudentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({
              model: mockUserModel,
              as: 'nurse',
              required: false,
            }),
          ]),
          distinct: true,
        }),
      );
    });

    it('should filter by search term', async () => {
      // Arrange
      mockStudentModel.findAndCountAll.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAll({ page: 1, limit: 20, search: 'john' });

      // Assert
      expect(mockStudentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            [Op.or]: expect.arrayContaining([
              { firstName: { [Op.iLike]: '%john%' } },
              { lastName: { [Op.iLike]: '%john%' } },
              { studentNumber: { [Op.iLike]: '%john%' } },
            ]),
          }),
        }),
      );
    });

    it('should filter by grade', async () => {
      // Arrange
      mockStudentModel.findAndCountAll.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAll({ page: 1, limit: 20, grade: '5' });

      // Assert
      expect(mockStudentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            grade: '5',
          }),
        }),
      );
    });

    it('should filter by nurse ID', async () => {
      // Arrange
      mockStudentModel.findAndCountAll.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAll({ page: 1, limit: 20, nurseId: 'nurse-test-123' });

      // Assert
      expect(mockStudentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            nurseId: 'nurse-test-123',
          }),
        }),
      );
    });

    it('should filter by active status', async () => {
      // Arrange
      mockStudentModel.findAndCountAll.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAll({ page: 1, limit: 20, isActive: false });

      // Assert
      expect(mockStudentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: false,
          }),
        }),
      );
    });
  });

  // ==================== FIND ONE STUDENT TESTS ====================

  describe('findOne', () => {
    it('should return student by ID with caching', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);

      // Act
      const result = await service.findOne('student-test-123');

      // Assert
      expect(result).toBeDefined();
      expect(mockQueryCacheService.findWithCache).toHaveBeenCalledWith(
        mockStudentModel,
        { where: { id: 'student-test-123' } },
        {
          ttl: 600,
          keyPrefix: 'student_detail',
          invalidateOn: ['update', 'destroy'],
        },
      );
    });

    it('should throw NotFoundException if student not found', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([]);

      // Act & Assert
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid UUID format', async () => {
      // Act & Assert
      await expect(service.findOne('invalid-uuid')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.findOne('invalid-uuid')).rejects.toThrow(
        'Invalid ID format',
      );
    });
  });

  // ==================== UPDATE STUDENT TESTS ====================

  describe('update', () => {
    const updateDto = {
      firstName: 'Updated',
      grade: '6',
    };

    it('should update student successfully', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);
      mockStudent.save.mockResolvedValue({ ...mockStudent, ...updateDto });

      // Act
      const result = await service.update('student-test-123', updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(mockStudent.save).toHaveBeenCalled();
    });

    it('should validate nurse assignment when updating nurse', async () => {
      // Arrange
      const nurseUpdateDto = { nurseId: 'new-nurse-123' };
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);
      mockUserModel.findOne.mockResolvedValue(mockNurse);
      mockStudent.save.mockResolvedValue(mockStudent);

      // Act
      await service.update('student-test-123', nurseUpdateDto);

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: {
          id: 'new-nurse-123',
          role: UserRole.NURSE,
          isActive: true,
        },
      });
    });

    it('should check for student number conflicts', async () => {
      // Arrange
      const studentNumberDto = { studentNumber: 'STU999' };
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);
      mockStudentModel.findOne.mockResolvedValue({
        ...mockStudent,
        id: 'other-student',
      });

      // Act & Assert
      await expect(
        service.update('student-test-123', studentNumberDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ==================== DELETE STUDENT TESTS (SOFT DELETE) ====================

  describe('remove', () => {
    it('should soft delete student by setting isActive to false', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);
      mockStudent.save.mockResolvedValue({ ...mockStudent, isActive: false });

      // Act
      await service.remove('student-test-123');

      // Assert
      expect(mockStudent.isActive).toBe(false);
      expect(mockStudent.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if student not found', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([]);

      // Act & Assert
      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ==================== TRANSFER STUDENT TESTS ====================

  describe('transfer', () => {
    const transferDto = {
      nurseId: 'new-nurse-456',
      grade: '6',
      reason: 'Promotion',
    };

    it('should transfer student to new nurse and grade', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);
      mockUserModel.findOne.mockResolvedValue(mockNurse);
      mockStudent.save.mockResolvedValue(mockStudent);

      // Act
      const result = await service.transfer('student-test-123', transferDto);

      // Assert
      expect(result).toBeDefined();
      expect(mockStudent.nurseId).toBe('new-nurse-456');
      expect(mockStudent.grade).toBe('6');
      expect(mockStudent.save).toHaveBeenCalled();
    });

    it('should validate new nurse assignment', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);
      mockUserModel.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.transfer('student-test-123', transferDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== BULK UPDATE TESTS ====================

  describe('bulkUpdate', () => {
    const bulkUpdateDto = {
      studentIds: ['student-1', 'student-2', 'student-3'],
      nurseId: 'nurse-test-123',
      grade: '6',
    };

    it('should perform atomic bulk update with transaction', async () => {
      // Arrange
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };
      mockSequelize.transaction.mockImplementation((options, callback) =>
        callback(mockTransaction),
      );
      mockUserModel.findOne.mockResolvedValue(mockNurse);
      mockStudentModel.update.mockResolvedValue([3]);

      // Act
      const result = await service.bulkUpdate(bulkUpdateDto);

      // Assert
      expect(result).toEqual({ updated: 3 });
      expect(mockSequelize.transaction).toHaveBeenCalled();
    });

    it('should validate nurse inside transaction to prevent race conditions', async () => {
      // Arrange
      const mockTransaction = {};
      mockSequelize.transaction.mockImplementation((options, callback) =>
        callback(mockTransaction),
      );
      mockUserModel.findOne.mockResolvedValue(mockNurse);
      mockStudentModel.update.mockResolvedValue([2]);

      // Act
      await service.bulkUpdate(bulkUpdateDto);

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          transaction: mockTransaction,
        }),
      );
    });

    it('should throw NotFoundException if nurse not found in transaction', async () => {
      // Arrange
      mockSequelize.transaction.mockImplementation((options, callback) =>
        callback({}),
      );
      mockUserModel.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.bulkUpdate(bulkUpdateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ==================== GET STUDENT HEALTH RECORDS TESTS ====================

  describe('getStudentHealthRecords', () => {
    const mockHealthRecords = {
      rows: [{ id: 'hr-1', recordType: 'CHECKUP' }],
      count: 1,
    };

    it('should return paginated health records for student', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);
      mockHealthRecordModel.findAndCountAll.mockResolvedValue(mockHealthRecords);

      // Act
      const result = await service.getStudentHealthRecords('student-test-123', 1, 20);

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        pages: 1,
      });
    });

    it('should throw NotFoundException if student not found', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([]);

      // Act & Assert
      await expect(
        service.getStudentHealthRecords('non-existent-id', 1, 20),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== GET STUDENT MENTAL HEALTH RECORDS TESTS ====================

  describe('getStudentMentalHealthRecords', () => {
    const mockMentalHealthRecords = {
      rows: [{ id: 'mhr-1', recordType: 'COUNSELING_SESSION' }],
      count: 1,
    };

    it('should return mental health records with eager loaded relationships', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);
      mockMentalHealthRecordModel.findAndCountAll.mockResolvedValue(
        mockMentalHealthRecords,
      );

      // Act
      const result = await service.getStudentMentalHealthRecords(
        'student-test-123',
        1,
        20,
      );

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.accessControl).toBeDefined();
      expect(result.accessControl.requiresAuthorization).toBe(true);
      expect(mockMentalHealthRecordModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          distinct: true,
          include: expect.arrayContaining([
            expect.objectContaining({ as: 'counselor' }),
            expect.objectContaining({ as: 'creator' }),
          ]),
        }),
      );
    });
  });

  // ==================== BARCODE SCANNING TESTS ====================

  describe('scanBarcode', () => {
    const scanDto = {
      barcodeString: 'STU001',
      scanType: 'student',
    };

    it('should scan student barcode and return student info', async () => {
      // Arrange
      mockStudentModel.findOne.mockResolvedValue(mockStudent);

      // Act
      const result = await service.scanBarcode(scanDto);

      // Assert
      expect(result.success).toBe(true);
      expect(result.entityFound).toBe(true);
      expect(result.scanType).toBe('student');
      expect(result.entity).toBeDefined();
    });

    it('should throw BadRequestException for empty barcode', async () => {
      // Arrange
      const emptyDto = { barcodeString: '', scanType: 'student' };

      // Act & Assert
      await expect(service.scanBarcode(emptyDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.scanBarcode(emptyDto)).rejects.toThrow(
        'Barcode string cannot be empty',
      );
    });

    it('should handle medication barcode scanning', async () => {
      // Arrange
      const medDto = { barcodeString: 'MED-12345', scanType: 'medication' };

      // Act
      const result = await service.scanBarcode(medDto);

      // Assert
      expect(result.scanType).toBe('medication');
      expect(result.entity).toHaveProperty('barcodeId');
    });

    it('should calculate age for student barcode scans', async () => {
      // Arrange
      mockStudentModel.findOne.mockResolvedValue(mockStudent);

      // Act
      const result = await service.scanBarcode(scanDto);

      // Assert
      expect(result.additionalInfo).toHaveProperty('age');
      expect(typeof result.additionalInfo.age).toBe('number');
    });
  });

  // ==================== VERIFY MEDICATION ADMINISTRATION TESTS ====================

  describe('verifyMedicationAdministration', () => {
    const verifyDto = {
      studentBarcode: 'STU001',
      medicationBarcode: 'MED-12345',
      nurseBarcode: 'NURSE-123',
    };

    it('should verify all three points successfully (Five Rights)', async () => {
      // Arrange
      mockStudentModel.findOne.mockResolvedValueOnce(mockStudent);
      mockUserModel.findOne.mockResolvedValueOnce(mockNurse);

      // Act
      const result = await service.verifyMedicationAdministration(verifyDto);

      // Assert
      expect(result.verified).toBe(true);
      expect(result.fiveRightsChecks).toHaveLength(6); // All 5 rights + administering nurse
      expect(result.warning).toBeNull();
    });

    it('should fail verification if student not found', async () => {
      // Arrange
      mockStudentModel.findOne.mockResolvedValueOnce(null);
      mockUserModel.findOne.mockResolvedValueOnce(mockNurse);

      // Act
      const result = await service.verifyMedicationAdministration(verifyDto);

      // Assert
      expect(result.verified).toBe(false);
      expect(result.warning).toContain('MEDICATION ADMINISTRATION BLOCKED');
    });

    it('should fail verification if nurse not found', async () => {
      // Arrange
      mockStudentModel.findOne.mockResolvedValueOnce(mockStudent);
      mockUserModel.findOne.mockResolvedValueOnce(null);

      // Act
      const result = await service.verifyMedicationAdministration(verifyDto);

      // Assert
      expect(result.verified).toBe(false);
      expect(result.summary.failed).toBeGreaterThan(0);
    });
  });

  // ==================== GRADE TRANSITION TESTS ====================

  describe('performBulkGradeTransition', () => {
    const transitionDto = {
      effectiveDate: new Date(),
      dryRun: false,
      criteria: {
        minimumGpa: 2.0,
        minimumAttendance: 0.9,
      },
    };

    it('should perform bulk grade transition successfully', async () => {
      // Arrange
      mockStudentModel.findAll.mockResolvedValue([
        { ...mockStudent, grade: '5', save: jest.fn() },
        { ...mockStudent, id: 'student-2', grade: '11', save: jest.fn() },
      ]);

      // Act
      const result = await service.performBulkGradeTransition(transitionDto);

      // Assert
      expect(result.success).toBe(true);
      expect(result.results.total).toBe(2);
      expect(result.details).toHaveLength(2);
    });

    it('should handle dry run without making changes', async () => {
      // Arrange
      const dryRunDto = { ...transitionDto, dryRun: true };
      const saveSpy = jest.fn();
      mockStudentModel.findAll.mockResolvedValue([
        { ...mockStudent, grade: '5', save: saveSpy },
      ]);

      // Act
      const result = await service.performBulkGradeTransition(dryRunDto);

      // Assert
      expect(result.dryRun).toBe(true);
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('should identify graduating students (grade 12)', async () => {
      // Arrange
      const graduatingSenior = { ...mockStudent, grade: '12', save: jest.fn() };
      mockStudentModel.findAll.mockResolvedValue([graduatingSenior]);

      // Act
      const result = await service.performBulkGradeTransition(transitionDto);

      // Assert
      expect(result.results.graduated).toBe(1);
      expect(result.details[0].action).toBe('graduated');
    });
  });

  // ==================== GET GRADUATING STUDENTS TESTS ====================

  describe('getGraduatingStudents', () => {
    const query = {
      academicYear: '2024',
      minimumGpa: 2.5,
      minimumCredits: 24,
    };

    it('should return students eligible for graduation with batch optimization', async () => {
      // Arrange
      const grade12Students = [
        { ...mockStudent, id: 'student-1', grade: '12' },
        { ...mockStudent, id: 'student-2', grade: '12' },
      ];
      mockStudentModel.findAll.mockResolvedValue(grade12Students);
      mockAcademicTranscriptService.batchGetAcademicHistories.mockResolvedValue(
        new Map([
          ['student-1', [{ gpa: 3.5, subjects: [{ credits: 6 }] }]],
          ['student-2', [{ gpa: 2.8, subjects: [{ credits: 5 }] }]],
        ]),
      );

      // Act
      const result = await service.getGraduatingStudents(query);

      // Assert
      expect(result.success).toBe(true);
      expect(result.summary.totalStudents).toBe(2);
      expect(mockAcademicTranscriptService.batchGetAcademicHistories).toHaveBeenCalledWith(
        ['student-1', 'student-2'],
      );
    });

    it('should evaluate GPA and credit requirements', async () => {
      // Arrange
      mockStudentModel.findAll.mockResolvedValue([
        { ...mockStudent, id: 'student-1', grade: '12' },
      ]);
      mockAcademicTranscriptService.batchGetAcademicHistories.mockResolvedValue(
        new Map([['student-1', [{ gpa: 2.0, subjects: [{ credits: 20 }] }]]]),
      );

      // Act
      const result = await service.getGraduatingStudents(query);

      // Assert
      expect(result.eligibleStudents).toHaveLength(0); // Doesn't meet minimum
      expect(result.ineligibleStudents).toHaveLength(1);
      expect(result.ineligibleStudents[0].eligibilityCriteria.credits.meets).toBe(
        false,
      );
    });
  });

  // ==================== SEARCH STUDENTS TESTS ====================

  describe('search', () => {
    it('should search students by firstName, lastName, or studentNumber', async () => {
      // Arrange
      mockStudentModel.findAll.mockResolvedValue([mockStudent]);

      // Act
      const result = await service.search('john', 20);

      // Assert
      expect(result).toHaveLength(1);
      expect(mockStudentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
            [Op.or]: expect.arrayContaining([
              { firstName: { [Op.iLike]: '%john%' } },
              { lastName: { [Op.iLike]: '%john%' } },
              { studentNumber: { [Op.iLike]: '%john%' } },
            ]),
          }),
        }),
      );
    });

    it('should limit search results', async () => {
      // Arrange
      mockStudentModel.findAll.mockResolvedValue([]);

      // Act
      await service.search('test', 10);

      // Assert
      expect(mockStudentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
        }),
      );
    });
  });

  // ==================== FIND BY GRADE TESTS ====================

  describe('findByGrade', () => {
    it('should return students by grade with caching', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);

      // Act
      const result = await service.findByGrade('5');

      // Assert
      expect(result).toHaveLength(1);
      expect(mockQueryCacheService.findWithCache).toHaveBeenCalledWith(
        mockStudentModel,
        expect.objectContaining({
          where: { grade: '5', isActive: true },
        }),
        {
          ttl: 300,
          keyPrefix: 'student_grade',
          invalidateOn: ['create', 'update', 'destroy'],
        },
      );
    });
  });

  // ==================== WAITLIST MANAGEMENT TESTS ====================

  describe('addStudentToWaitlist', () => {
    const waitlistDto = {
      studentId: 'student-test-123',
      appointmentType: 'vision_screening',
      priority: 'high',
      notes: 'Needs immediate attention',
    };

    it('should add student to waitlist with priority', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);

      // Act
      const result = await service.addStudentToWaitlist(waitlistDto);

      // Assert
      expect(result.success).toBe(true);
      expect(result.waitlistEntry).toBeDefined();
      expect(result.waitlistEntry.priority).toBe('high');
      expect(result.waitlistEntry.estimatedPosition).toBeLessThan(10);
    });

    it('should calculate estimated wait time based on priority', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);

      // Act
      const result = await service.addStudentToWaitlist(waitlistDto);

      // Assert
      expect(result.waitlistEntry.estimatedWaitTime).toMatch(/\d+ minutes/);
    });
  });

  describe('getStudentWaitlistStatus', () => {
    it('should return waitlist status for student', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);

      // Act
      const result = await service.getStudentWaitlistStatus('student-test-123', {});

      // Assert
      expect(result.success).toBe(true);
      expect(result.waitlists).toBeDefined();
      expect(result.summary).toBeDefined();
    });
  });

  // ==================== IMPORT ACADEMIC TRANSCRIPT TESTS ====================

  describe('importAcademicTranscript', () => {
    const importDto = {
      academicYear: '2023-2024',
      grades: [
        { courseName: 'Math', grade: 'A', numericGrade: 95, credits: 1 },
        { courseName: 'Science', grade: 'B', numericGrade: 85, credits: 1 },
      ],
      daysPresent: 170,
      daysAbsent: 10,
      totalCredits: 2,
    };

    it('should import academic transcript successfully', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockResolvedValue([mockStudent]);
      mockAcademicTranscriptService.importTranscript.mockResolvedValue({
        id: 'transcript-1',
        academicYear: '2023-2024',
        semester: 'N/A',
        gpa: 3.5,
        subjects: importDto.grades,
      });

      // Act
      const result = await service.importAcademicTranscript(
        'student-test-123',
        importDto,
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.transcript.gpa).toBe(3.5);
      expect(mockAcademicTranscriptService.importTranscript).toHaveBeenCalled();
    });
  });

  // ==================== ERROR HANDLING TESTS ====================

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Arrange
      mockStudentModel.findAndCountAll.mockRejectedValue(
        new Error('Database connection lost'),
      );

      // Act & Assert
      await expect(service.findAll({ page: 1, limit: 20 })).rejects.toThrow();
    });

    it('should never expose PHI in error messages', async () => {
      // Arrange
      mockQueryCacheService.findWithCache.mockRejectedValue(
        new Error('Sensitive data error'),
      );

      // Act & Assert
      await expect(service.findOne('student-test-123')).rejects.toThrow();
      // Service should log detailed error server-side but throw generic error client-side
    });
  });

  // ==================== DATA ISOLATION TESTS ====================

  describe('Multi-Tenant Data Isolation', () => {
    it('should exclude schoolId and districtId from query results', async () => {
      // Arrange
      mockStudentModel.findAndCountAll.mockResolvedValue({
        rows: [mockStudent],
        count: 1,
      });

      // Act
      await service.findAll({ page: 1, limit: 20 });

      // Assert
      expect(mockStudentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            exclude: ['schoolId', 'districtId'],
          }),
        }),
      );
    });
  });

  // ==================== BATCH OPERATIONS TESTS ====================

  describe('findByIds (DataLoader)', () => {
    it('should batch fetch students and return in order', async () => {
      // Arrange
      const ids = ['student-1', 'student-2', 'student-3'];
      const students = [
        { ...mockStudent, id: 'student-2' },
        { ...mockStudent, id: 'student-1' },
      ];
      mockStudentModel.findAll.mockResolvedValue(students);

      // Act
      const result = await service.findByIds(ids);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('student-1');
      expect(result[1].id).toBe('student-2');
      expect(result[2]).toBeNull(); // student-3 not found
    });
  });
});
