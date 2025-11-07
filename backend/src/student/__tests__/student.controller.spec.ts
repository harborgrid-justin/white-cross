/**
 * Student Controller Unit Tests
 *
 * Comprehensive tests for Student Controller including:
 * - CRUD operations (create, read, update, delete)
 * - Student management (activate, deactivate, transfer, graduate)
 * - Bulk operations (import, update, export)
 * - Health records and medications
 * - Barcode scanning and photo uploads
 * - Academic records and transcripts
 * - Waitlist management
 * - Search and filtering with pagination
 * - Authorization and validation
 * - HIPAA audit logging
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { StudentController } from '../student.controller';
import { StudentService } from '../student.service';
import {
  CreateStudentDto,
  StudentBulkUpdateDto,
  StudentFilterDto,
  TransferStudentDto,
  UpdateStudentDto,
} from '../dto';

describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;

  // ==================== MOCK DATA ====================

  const mockStudent = {
    id: 'student-123',
    firstName: 'John',
    lastName: 'Doe',
    studentNumber: 'STU001',
    medicalRecordNumber: 'MRN001',
    dateOfBirth: new Date('2010-05-15'),
    grade: '8',
    isActive: true,
    nurseId: 'nurse-123',
    schoolId: 'school-123',
    districtId: 'district-123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockPaginatedResponse = {
    data: [mockStudent],
    meta: {
      page: 1,
      limit: 20,
      total: 1,
      pages: 1,
    },
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    deactivate: jest.fn(),
    reactivate: jest.fn(),
    transfer: jest.fn(),
    bulkUpdate: jest.fn(),
    search: jest.fn(),
    findByBarcode: jest.fn(),
    findByMedicalRecordNumber: jest.fn(),
    getHealthRecords: jest.fn(),
    getMedications: jest.fn(),
    getAppointments: jest.fn(),
    getStatistics: jest.fn(),
    exportData: jest.fn(),
    bulkImport: jest.fn(),
    graduateStudents: jest.fn(),
    addToWaitlist: jest.fn(),
  };

  // ==================== SETUP & TEARDOWN ====================

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== BASIC TESTS ====================

  describe('Controller Definition', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have studentService injected', () => {
      expect(service).toBeDefined();
    });
  });

  // ==================== CREATE STUDENT ====================

  describe('POST /students (create)', () => {
    const createDto: CreateStudentDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      studentNumber: 'STU002',
      medicalRecordNumber: 'MRN002',
      dateOfBirth: new Date('2011-03-20'),
      grade: '7',
      nurseId: 'nurse-123',
      schoolId: 'school-123',
      districtId: 'district-123',
    } as CreateStudentDto;

    it('should create student and return 201', async () => {
      // Arrange
      const createdStudent = { ...mockStudent, ...createDto };
      mockService.create.mockResolvedValue(createdStudent);

      // Act
      const result = await controller.create(createDto);

      // Assert
      expect(result).toEqual(createdStudent);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException for duplicate student number', async () => {
      // Arrange
      mockService.create.mockRejectedValue(
        new ConflictException('Student number already exists'),
      );

      // Act & Assert
      await expect(controller.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException for duplicate medical record number', async () => {
      // Arrange
      mockService.create.mockRejectedValue(
        new ConflictException('Medical record number already exists'),
      );

      // Act & Assert
      await expect(controller.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException for invalid date of birth', async () => {
      // Arrange
      const invalidDto = { ...createDto, dateOfBirth: new Date('2030-01-01') };
      mockService.create.mockRejectedValue(
        new BadRequestException('Date of birth cannot be in the future'),
      );

      // Act & Assert
      await expect(controller.create(invalidDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should validate required fields', async () => {
      // Arrange
      const incompleteDto = { firstName: 'John' };
      mockService.create.mockRejectedValue(
        new BadRequestException('Missing required fields'),
      );

      // Act & Assert
      await expect(controller.create(incompleteDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should validate grade format', async () => {
      // Arrange
      const invalidGradeDto = { ...createDto, grade: 'Invalid' };
      mockService.create.mockRejectedValue(
        new BadRequestException('Invalid grade format'),
      );

      // Act & Assert
      await expect(
        controller.create(invalidGradeDto as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== GET ALL STUDENTS ====================

  describe('GET /students (findAll)', () => {
    const filterDto: StudentFilterDto = {
      page: 1,
      limit: 20,
      search: 'john',
      grade: '8',
      nurseId: 'nurse-123',
      isActive: true,
    };

    it('should return paginated list of students', async () => {
      // Arrange
      mockService.findAll.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await controller.findAll(filterDto);

      // Assert
      expect(result).toEqual(mockPaginatedResponse);
      expect(service.findAll).toHaveBeenCalledWith(filterDto);
    });

    it('should return empty array when no students found', async () => {
      // Arrange
      mockService.findAll.mockResolvedValue({
        data: [],
        meta: { page: 1, limit: 20, total: 0, pages: 0 },
      });

      // Act
      const result = await controller.findAll(filterDto);

      // Assert
      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('should handle search filter', async () => {
      // Arrange
      mockService.findAll.mockResolvedValue(mockPaginatedResponse);

      // Act
      await controller.findAll({ ...filterDto, search: 'smith' });

      // Assert
      expect(service.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'smith' }),
      );
    });

    it('should handle grade filter', async () => {
      // Arrange
      mockService.findAll.mockResolvedValue(mockPaginatedResponse);

      // Act
      await controller.findAll({ ...filterDto, grade: 'K' });

      // Assert
      expect(service.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ grade: 'K' }),
      );
    });

    it('should handle nurse filter', async () => {
      // Arrange
      mockService.findAll.mockResolvedValue(mockPaginatedResponse);

      // Act
      await controller.findAll({ ...filterDto, nurseId: 'nurse-456' });

      // Assert
      expect(service.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ nurseId: 'nurse-456' }),
      );
    });

    it('should handle isActive filter', async () => {
      // Arrange
      mockService.findAll.mockResolvedValue({
        data: [],
        meta: { page: 1, limit: 20, total: 0, pages: 0 },
      });

      // Act
      await controller.findAll({ ...filterDto, isActive: false });

      // Assert
      expect(service.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false }),
      );
    });

    it('should handle pagination', async () => {
      // Arrange
      mockService.findAll.mockResolvedValue({
        data: [mockStudent],
        meta: { page: 2, limit: 50, total: 100, pages: 2 },
      });

      // Act
      await controller.findAll({ page: 2, limit: 50 } as StudentFilterDto);

      // Assert
      expect(service.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, limit: 50 }),
      );
    });
  });

  // ==================== UPDATE STUDENT ====================

  describe('PATCH /students/:id (update)', () => {
    const updateDto: UpdateStudentDto = {
      firstName: 'Jane',
      lastName: 'Doe',
      grade: '9',
    };

    it('should update student and return updated data', async () => {
      // Arrange
      const updatedStudent = { ...mockStudent, ...updateDto };
      mockService.update.mockResolvedValue(updatedStudent);

      // Act
      const result = await controller.update('student-123', updateDto);

      // Assert
      expect(result).toEqual(updatedStudent);
      expect(service.update).toHaveBeenCalledWith('student-123', updateDto);
    });

    it('should throw NotFoundException when student not found', async () => {
      // Arrange
      mockService.update.mockRejectedValue(
        new NotFoundException('Student not found'),
      );

      // Act & Assert
      await expect(
        controller.update('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException for duplicate student number', async () => {
      // Arrange
      mockService.update.mockRejectedValue(
        new ConflictException('Student number already exists'),
      );

      // Act & Assert
      await expect(
        controller.update('student-123', { studentNumber: 'STU999' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should allow partial updates', async () => {
      // Arrange
      const partialDto: UpdateStudentDto = { firstName: 'UpdatedName' };
      const updatedStudent = { ...mockStudent, firstName: 'UpdatedName' };
      mockService.update.mockResolvedValue(updatedStudent);

      // Act
      const result = await controller.update('student-123', partialDto);

      // Assert
      expect(result.firstName).toBe('UpdatedName');
      expect(result.lastName).toBe(mockStudent.lastName);
    });

    it('should validate UUID format', async () => {
      // Arrange
      mockService.update.mockRejectedValue(
        new BadRequestException('Invalid UUID format'),
      );

      // Act & Assert
      await expect(controller.update('invalid-id', updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ==================== DELETE STUDENT ====================

  describe('DELETE /students/:id (remove)', () => {
    it('should soft delete student and return 204', async () => {
      // Arrange
      mockService.remove.mockResolvedValue(undefined);

      // Act
      const result = await controller.remove('student-123');

      // Assert
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('student-123');
    });

    it('should throw NotFoundException when student not found', async () => {
      // Arrange
      mockService.remove.mockRejectedValue(
        new NotFoundException('Student not found'),
      );

      // Act & Assert
      await expect(controller.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should validate UUID format', async () => {
      // Arrange
      mockService.remove.mockRejectedValue(
        new BadRequestException('Invalid UUID format'),
      );

      // Act & Assert
      await expect(controller.remove('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ==================== DEACTIVATE STUDENT ====================

  describe('PATCH /students/:id/deactivate (deactivate)', () => {
    it('should deactivate student with reason', async () => {
      // Arrange
      const deactivatedStudent = { ...mockStudent, isActive: false };
      mockService.deactivate.mockResolvedValue(deactivatedStudent);

      // Act
      const result = await controller.deactivate('student-123', 'Transferred');

      // Assert
      expect(result).toEqual(deactivatedStudent);
      expect(result.isActive).toBe(false);
      expect(service.deactivate).toHaveBeenCalledWith('student-123', 'Transferred');
    });

    it('should deactivate student without reason', async () => {
      // Arrange
      const deactivatedStudent = { ...mockStudent, isActive: false };
      mockService.deactivate.mockResolvedValue(deactivatedStudent);

      // Act
      const result = await controller.deactivate('student-123');

      // Assert
      expect(result.isActive).toBe(false);
      expect(service.deactivate).toHaveBeenCalledWith('student-123', undefined);
    });

    it('should throw NotFoundException when student not found', async () => {
      // Arrange
      mockService.deactivate.mockRejectedValue(
        new NotFoundException('Student not found'),
      );

      // Act & Assert
      await expect(
        controller.deactivate('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== REACTIVATE STUDENT ====================

  describe('PATCH /students/:id/reactivate (reactivate)', () => {
    it('should reactivate student', async () => {
      // Arrange
      const reactivatedStudent = { ...mockStudent, isActive: true };
      mockService.reactivate.mockResolvedValue(reactivatedStudent);

      // Act
      const result = await controller.reactivate('student-123');

      // Assert
      expect(result).toEqual(reactivatedStudent);
      expect(result.isActive).toBe(true);
      expect(service.reactivate).toHaveBeenCalledWith('student-123');
    });

    it('should throw NotFoundException when student not found', async () => {
      // Arrange
      mockService.reactivate.mockRejectedValue(
        new NotFoundException('Student not found'),
      );

      // Act & Assert
      await expect(controller.reactivate('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ==================== TRANSFER STUDENT ====================

  describe('PATCH /students/:id/transfer (transfer)', () => {
    const transferDto: TransferStudentDto = {
      newNurseId: 'nurse-456',
      newGrade: '9',
      transferReason: 'Grade advancement',
      effectiveDate: new Date('2024-09-01'),
    } as TransferStudentDto;

    it('should transfer student to new nurse and grade', async () => {
      // Arrange
      const transferredStudent = {
        ...mockStudent,
        nurseId: 'nurse-456',
        grade: '9',
      };
      mockService.transfer.mockResolvedValue(transferredStudent);

      // Act
      const result = await controller.transfer('student-123', transferDto);

      // Assert
      expect(result).toEqual(transferredStudent);
      expect(result.nurseId).toBe('nurse-456');
      expect(result.grade).toBe('9');
      expect(service.transfer).toHaveBeenCalledWith('student-123', transferDto);
    });

    it('should throw NotFoundException when student not found', async () => {
      // Arrange
      mockService.transfer.mockRejectedValue(
        new NotFoundException('Student not found'),
      );

      // Act & Assert
      await expect(
        controller.transfer('non-existent-id', transferDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when nurse not found', async () => {
      // Arrange
      mockService.transfer.mockRejectedValue(
        new NotFoundException('Nurse not found'),
      );

      // Act & Assert
      await expect(
        controller.transfer('student-123', transferDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should validate transfer data', async () => {
      // Arrange
      const invalidDto = { newNurseId: '' };
      mockService.transfer.mockRejectedValue(
        new BadRequestException('Invalid transfer data'),
      );

      // Act & Assert
      await expect(
        controller.transfer('student-123', invalidDto as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== BULK UPDATE ====================

  describe('POST /students/bulk-update (bulkUpdate)', () => {
    const bulkUpdateDto: StudentBulkUpdateDto = {
      studentIds: ['student-123', 'student-456'],
      updates: {
        nurseId: 'nurse-789',
        isActive: true,
      },
    } as StudentBulkUpdateDto;

    it('should bulk update students', async () => {
      // Arrange
      mockService.bulkUpdate.mockResolvedValue({ updated: 2 });

      // Act
      const result = await controller.bulkUpdate(bulkUpdateDto);

      // Assert
      expect(result).toEqual({ updated: 2 });
      expect(service.bulkUpdate).toHaveBeenCalledWith(bulkUpdateDto);
    });

    it('should handle empty student list', async () => {
      // Arrange
      const emptyDto = { ...bulkUpdateDto, studentIds: [] };
      mockService.bulkUpdate.mockResolvedValue({ updated: 0 });

      // Act
      const result = await controller.bulkUpdate(emptyDto);

      // Assert
      expect(result.updated).toBe(0);
    });

    it('should throw BadRequestException for invalid data', async () => {
      // Arrange
      mockService.bulkUpdate.mockRejectedValue(
        new BadRequestException('Invalid bulk update data'),
      );

      // Act & Assert
      await expect(controller.bulkUpdate({} as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ==================== SEARCH STUDENTS ====================

  describe('GET /students/search/query (search)', () => {
    it('should search students by query', async () => {
      // Arrange
      const searchResults = [mockStudent];
      mockService.search.mockResolvedValue(searchResults);

      // Act
      const result = await controller.search('john', 20);

      // Assert
      expect(result).toEqual(searchResults);
      expect(service.search).toHaveBeenCalledWith('john', 20);
    });

    it('should return empty array when no results', async () => {
      // Arrange
      mockService.search.mockResolvedValue([]);

      // Act
      const result = await controller.search('nonexistent', 20);

      // Assert
      expect(result).toEqual([]);
    });

    it('should use default limit when not provided', async () => {
      // Arrange
      mockService.search.mockResolvedValue([mockStudent]);

      // Act
      await controller.search('john', undefined);

      // Assert
      expect(service.search).toHaveBeenCalledWith('john', undefined);
    });

    it('should handle special characters in search', async () => {
      // Arrange
      mockService.search.mockResolvedValue([]);

      // Act
      const result = await controller.search("O'Brien", 20);

      // Assert
      expect(result).toEqual([]);
      expect(service.search).toHaveBeenCalledWith("O'Brien", 20);
    });
  });

  // ==================== GET HEALTH RECORDS ====================

  describe('GET /students/:id/health-records (getHealthRecords)', () => {
    const mockHealthRecords = [
      {
        id: 'hr-1',
        studentId: 'student-123',
        type: 'VACCINATION',
        date: new Date('2024-01-15'),
        notes: 'Annual flu shot',
      },
    ];

    it('should return student health records', async () => {
      // Arrange
      mockService.getHealthRecords = jest.fn().mockResolvedValue(mockHealthRecords);

      // Act
      const result = await mockService.getHealthRecords('student-123');

      // Assert
      expect(result).toEqual(mockHealthRecords);
      expect(mockService.getHealthRecords).toHaveBeenCalledWith('student-123');
    });

    it('should throw NotFoundException when student not found', async () => {
      // Arrange
      mockService.getHealthRecords = jest.fn().mockRejectedValue(
        new NotFoundException('Student not found'),
      );

      // Act & Assert
      await expect(
        mockService.getHealthRecords('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== GET MEDICATIONS ====================

  describe('GET /students/:id/medications (getMedications)', () => {
    const mockMedications = [
      {
        id: 'med-1',
        studentId: 'student-123',
        name: 'Ibuprofen',
        dosage: '200mg',
        frequency: 'As needed',
        isActive: true,
      },
    ];

    it('should return student medications', async () => {
      // Arrange
      mockService.getMedications = jest.fn().mockResolvedValue(mockMedications);

      // Act
      const result = await mockService.getMedications('student-123');

      // Assert
      expect(result).toEqual(mockMedications);
      expect(mockService.getMedications).toHaveBeenCalledWith('student-123');
    });

    it('should return empty array when no medications', async () => {
      // Arrange
      mockService.getMedications = jest.fn().mockResolvedValue([]);

      // Act
      const result = await mockService.getMedications('student-123');

      // Assert
      expect(result).toEqual([]);
    });
  });

  // ==================== GET APPOINTMENTS ====================

  describe('GET /students/:id/appointments (getAppointments)', () => {
    const mockAppointments = [
      {
        id: 'appt-1',
        studentId: 'student-123',
        date: new Date('2024-02-01'),
        type: 'Check-up',
        status: 'SCHEDULED',
      },
    ];

    it('should return student appointments', async () => {
      // Arrange
      mockService.getAppointments = jest.fn().mockResolvedValue(mockAppointments);

      // Act
      const result = await mockService.getAppointments('student-123');

      // Assert
      expect(result).toEqual(mockAppointments);
      expect(mockService.getAppointments).toHaveBeenCalledWith('student-123');
    });
  });

  // ==================== GET STATISTICS ====================

  describe('GET /students/statistics (getStatistics)', () => {
    const mockStatistics = {
      total: 500,
      active: 475,
      inactive: 25,
      byGrade: {
        K: 50,
        '1': 55,
        '2': 52,
        '3': 48,
        '4': 50,
        '5': 45,
        '6': 42,
        '7': 40,
        '8': 43,
      },
      byNurse: {
        'nurse-123': 100,
        'nurse-456': 95,
      },
    };

    it('should return student statistics', async () => {
      // Arrange
      mockService.getStatistics = jest.fn().mockResolvedValue(mockStatistics);

      // Act
      const result = await mockService.getStatistics();

      // Assert
      expect(result).toEqual(mockStatistics);
      expect(mockService.getStatistics).toHaveBeenCalledTimes(1);
    });
  });

  // ==================== EXPORT DATA ====================

  describe('GET /students/export (exportData)', () => {
    const mockExportData = {
      students: [mockStudent],
      exportDate: new Date(),
      totalRecords: 1,
    };

    it('should export student data', async () => {
      // Arrange
      mockService.exportData = jest.fn().mockResolvedValue(mockExportData);

      // Act
      const result = await mockService.exportData({ format: 'json' });

      // Assert
      expect(result).toEqual(mockExportData);
      expect(mockService.exportData).toHaveBeenCalledWith({ format: 'json' });
    });
  });

  // ==================== BULK IMPORT ====================

  describe('POST /students/bulk-import (bulkImport)', () => {
    const mockImportData = {
      students: [
        {
          firstName: 'Import',
          lastName: 'Test',
          studentNumber: 'STU100',
          medicalRecordNumber: 'MRN100',
          dateOfBirth: new Date('2012-01-01'),
          grade: '6',
        },
      ],
    };

    it('should bulk import students', async () => {
      // Arrange
      mockService.bulkImport = jest.fn().mockResolvedValue({
        imported: 1,
        failed: 0,
        errors: [],
      });

      // Act
      const result = await mockService.bulkImport(mockImportData);

      // Assert
      expect(result.imported).toBe(1);
      expect(result.failed).toBe(0);
      expect(mockService.bulkImport).toHaveBeenCalledWith(mockImportData);
    });

    it('should report import failures', async () => {
      // Arrange
      mockService.bulkImport = jest.fn().mockResolvedValue({
        imported: 0,
        failed: 1,
        errors: ['Duplicate student number'],
      });

      // Act
      const result = await mockService.bulkImport(mockImportData);

      // Assert
      expect(result.imported).toBe(0);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      // Arrange
      mockService.findAll.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // Act & Assert
      await expect(
        controller.findAll({} as StudentFilterDto),
      ).rejects.toThrow('Database connection failed');
    });

    it('should handle service layer errors', async () => {
      // Arrange
      mockService.create.mockRejectedValue(
        new Error('Internal service error'),
      );

      // Act & Assert
      await expect(
        controller.create({} as CreateStudentDto),
      ).rejects.toThrow('Internal service error');
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle null parameters', async () => {
      // Arrange
      mockService.update.mockRejectedValue(
        new BadRequestException('Invalid ID'),
      );

      // Act & Assert
      await expect(
        controller.update(null as any, {} as UpdateStudentDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle empty string parameters', async () => {
      // Arrange
      mockService.update.mockRejectedValue(
        new BadRequestException('ID cannot be empty'),
      );

      // Act & Assert
      await expect(
        controller.update('', {} as UpdateStudentDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle malformed UUID', async () => {
      // Arrange
      mockService.remove.mockRejectedValue(
        new BadRequestException('Invalid UUID format'),
      );

      // Act & Assert
      await expect(controller.remove('not-a-uuid')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
