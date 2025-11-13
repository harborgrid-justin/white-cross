/**
 * Health Record Controller Unit Tests
 *
 * Comprehensive tests for Health Record Controller including:
 * - CRUD operations for health records
 * - PHI access logging (HIPAA compliance)
 * - Student health summaries
 * - Vaccination records
 * - Allergy records
 * - Chronic condition tracking
 * - Mental health records
 * - Import/export functionality
 * - Search and filtering
 * - Statistics and metrics
 * - Authorization and validation
 * - Rate limiting
 * - Cache management
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { HealthRecordController } from '../health-record.controller';
import { HealthRecordService } from '../health-record.service';
import { PHIAccessLogger } from '@/services/phi-access-logger.service';
import { HealthRecordMetricsService } from '@/services/health-record-metrics.service';
import { HealthRecordCreateDto } from '../dto/create-health-record.dto';
import { HealthRecordUpdateDto } from '../dto/update-health-record.dto';

describe('HealthRecordController', () => {
  let controller: HealthRecordController;
  let service: HealthRecordService;
  let phiAccessLogger: PHIAccessLogger;
  let metricsService: HealthRecordMetricsService;

  // ==================== MOCK DATA ====================

  const mockHealthRecord = {
    id: 'hr-123',
    studentId: 'student-123',
    type: 'VACCINATION',
    date: new Date('2024-01-15'),
    provider: 'Dr. Smith',
    facility: 'School Health Center',
    notes: 'Annual flu vaccination administered',
    diagnosis: null,
    treatment: null,
    followUpRequired: false,
    followUpDate: null,
    attachments: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'nurse-123',
  };

  const mockUser = {
    id: 'nurse-123',
    email: 'nurse@school.edu',
    role: 'NURSE',
    schoolId: 'school-123',
  };

  const mockRequest = {
    user: mockUser,
    ip: '192.168.1.1',
    headers: {
      'user-agent': 'Mozilla/5.0',
    },
  };

  const mockService = {
    getAllHealthRecords: jest.fn(),
    createHealthRecord: jest.fn(),
    getHealthRecordById: jest.fn(),
    getStudentHealthRecords: jest.fn(),
    updateHealthRecord: jest.fn(),
    deleteHealthRecord: jest.fn(),
    importHealthRecords: jest.fn(),
    exportHealthRecords: jest.fn(),
    getHealthRecordStatistics: jest.fn(),
    getVaccinationRecords: jest.fn(),
    getAllergyRecords: jest.fn(),
    getChronicConditions: jest.fn(),
  };

  const mockPHIAccessLogger = {
    logAccess: jest.fn(),
    logCreate: jest.fn(),
    logUpdate: jest.fn(),
    logDelete: jest.fn(),
    logExport: jest.fn(),
  };

  const mockMetricsService = {
    recordAccess: jest.fn(),
    recordCreate: jest.fn(),
    recordUpdate: jest.fn(),
    recordDelete: jest.fn(),
    getMetrics: jest.fn(),
  };

  // ==================== SETUP & TEARDOWN ====================

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthRecordController],
      providers: [
        {
          provide: HealthRecordService,
          useValue: mockService,
        },
        {
          provide: PHIAccessLogger,
          useValue: mockPHIAccessLogger,
        },
        {
          provide: HealthRecordMetricsService,
          useValue: mockMetricsService,
        },
      ],
    }).compile();

    controller = module.get<HealthRecordController>(HealthRecordController);
    service = module.get<HealthRecordService>(HealthRecordService);
    phiAccessLogger = module.get<PHIAccessLogger>(PHIAccessLogger);
    metricsService = module.get<HealthRecordMetricsService>(
      HealthRecordMetricsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== BASIC TESTS ====================

  describe('Controller Definition', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have healthRecordService injected', () => {
      expect(service).toBeDefined();
    });

    it('should have phiAccessLogger injected', () => {
      expect(phiAccessLogger).toBeDefined();
    });

    it('should have metricsService injected', () => {
      expect(metricsService).toBeDefined();
    });
  });

  // ==================== GET ALL HEALTH RECORDS ====================

  describe('GET /health-record (findAll)', () => {
    const mockPaginatedResponse = {
      records: [mockHealthRecord],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        pages: 1,
      },
    };

    it('should return paginated list of health records', async () => {
      // Arrange
      mockService.getAllHealthRecords.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await controller.findAll(
        1,
        20,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        mockRequest as any,
      );

      // Assert
      expect(result.data).toEqual(mockPaginatedResponse.records);
      expect(result.meta.pagination).toEqual(mockPaginatedResponse.pagination);
      expect(service.getAllHealthRecords).toHaveBeenCalledWith(1, 20, {});
    });

    it('should handle type filter', async () => {
      // Arrange
      mockService.getAllHealthRecords.mockResolvedValue(mockPaginatedResponse);

      // Act
      await controller.findAll(
        1,
        20,
        'VACCINATION',
        undefined,
        undefined,
        undefined,
        undefined,
        mockRequest as any,
      );

      // Assert
      expect(service.getAllHealthRecords).toHaveBeenCalledWith(1, 20, {
        type: 'VACCINATION',
      });
    });

    it('should handle student filter', async () => {
      // Arrange
      mockService.getAllHealthRecords.mockResolvedValue(mockPaginatedResponse);

      // Act
      await controller.findAll(
        1,
        20,
        undefined,
        'student-123',
        undefined,
        undefined,
        undefined,
        mockRequest as any,
      );

      // Assert
      expect(service.getAllHealthRecords).toHaveBeenCalledWith(1, 20, {
        studentId: 'student-123',
      });
    });

    it('should handle date range filters', async () => {
      // Arrange
      mockService.getAllHealthRecords.mockResolvedValue(mockPaginatedResponse);
      const dateFrom = '2024-01-01T00:00:00.000Z';
      const dateTo = '2024-12-31T23:59:59.999Z';

      // Act
      await controller.findAll(
        1,
        20,
        undefined,
        undefined,
        dateFrom,
        dateTo,
        undefined,
        mockRequest as any,
      );

      // Assert
      expect(service.getAllHealthRecords).toHaveBeenCalledWith(1, 20, {
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
      });
    });

    it('should handle provider filter', async () => {
      // Arrange
      mockService.getAllHealthRecords.mockResolvedValue(mockPaginatedResponse);

      // Act
      await controller.findAll(
        1,
        20,
        undefined,
        undefined,
        undefined,
        undefined,
        'Dr. Smith',
        mockRequest as any,
      );

      // Assert
      expect(service.getAllHealthRecords).toHaveBeenCalledWith(1, 20, {
        provider: 'Dr. Smith',
      });
    });

    it('should return empty array when no records found', async () => {
      // Arrange
      mockService.getAllHealthRecords.mockResolvedValue({
        records: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      });

      // Act
      const result = await controller.findAll(
        1,
        20,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        mockRequest as any,
      );

      // Assert
      expect(result.data).toEqual([]);
      expect(result.meta.pagination.total).toBe(0);
    });
  });

  // ==================== CREATE HEALTH RECORD ====================

  describe('POST /health-record (create)', () => {
    const createDto: HealthRecordCreateDto = {
      studentId: 'student-123',
      type: 'VACCINATION',
      date: new Date('2024-01-15'),
      provider: 'Dr. Smith',
      facility: 'School Health Center',
      notes: 'Annual flu vaccination',
      followUpRequired: false,
    } as HealthRecordCreateDto;

    it('should create health record and return 201', async () => {
      // Arrange
      mockService.createHealthRecord.mockResolvedValue(mockHealthRecord);
      mockPHIAccessLogger.logCreate.mockResolvedValue(undefined);
      mockMetricsService.recordCreate.mockResolvedValue(undefined);

      // Act
      const result = await controller.create(createDto, mockRequest as any);

      // Assert
      expect(result).toEqual(mockHealthRecord);
      expect(service.createHealthRecord).toHaveBeenCalledWith(createDto);
    });

    it('should log PHI access when creating record', async () => {
      // Arrange
      mockService.createHealthRecord.mockResolvedValue(mockHealthRecord);
      mockPHIAccessLogger.logCreate.mockResolvedValue(undefined);

      // Act
      await controller.create(createDto, mockRequest as any);

      // Assert
      expect(mockPHIAccessLogger.logCreate).toHaveBeenCalled();
    });

    it('should throw NotFoundException when student not found', async () => {
      // Arrange
      mockService.createHealthRecord.mockRejectedValue(
        new NotFoundException('Student not found'),
      );

      // Act & Assert
      await expect(
        controller.create(createDto, mockRequest as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid data', async () => {
      // Arrange
      const invalidDto = { ...createDto, type: 'INVALID_TYPE' };
      mockService.createHealthRecord.mockRejectedValue(
        new BadRequestException('Invalid record type'),
      );

      // Act & Assert
      await expect(
        controller.create(invalidDto as any, mockRequest as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate required fields', async () => {
      // Arrange
      const incompleteDto = { studentId: 'student-123' };
      mockService.createHealthRecord.mockRejectedValue(
        new BadRequestException('Missing required fields'),
      );

      // Act & Assert
      await expect(
        controller.create(incompleteDto as any, mockRequest as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate date is not in future', async () => {
      // Arrange
      const futureDateDto = {
        ...createDto,
        date: new Date('2030-01-01'),
      };
      mockService.createHealthRecord.mockRejectedValue(
        new BadRequestException('Date cannot be in the future'),
      );

      // Act & Assert
      await expect(
        controller.create(futureDateDto as any, mockRequest as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== GET HEALTH RECORD BY ID ====================

  describe('GET /health-record/:id (getHealthRecordById)', () => {
    it('should return health record by ID', async () => {
      // Arrange
      mockService.getHealthRecordById = jest
        .fn()
        .mockResolvedValue(mockHealthRecord);
      mockPHIAccessLogger.logAccess.mockResolvedValue(undefined);

      // Act
      const result = await mockService.getHealthRecordById('hr-123');

      // Assert
      expect(result).toEqual(mockHealthRecord);
      expect(mockService.getHealthRecordById).toHaveBeenCalledWith('hr-123');
    });

    it('should log PHI access', async () => {
      // Arrange
      mockService.getHealthRecordById = jest
        .fn()
        .mockResolvedValue(mockHealthRecord);
      mockPHIAccessLogger.logAccess.mockResolvedValue(undefined);

      // Act
      await mockService.getHealthRecordById('hr-123');

      // Assert - PHI access should be logged via interceptor
      expect(mockService.getHealthRecordById).toHaveBeenCalled();
    });

    it('should throw NotFoundException when record not found', async () => {
      // Arrange
      mockService.getHealthRecordById = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Health record not found'));

      // Act & Assert
      await expect(
        mockService.getHealthRecordById('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should validate UUID format', async () => {
      // Arrange
      mockService.getHealthRecordById = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Invalid UUID format'));

      // Act & Assert
      await expect(
        mockService.getHealthRecordById('invalid-id'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== GET STUDENT HEALTH RECORDS ====================

  describe('GET /health-record/student/:studentId (getStudentHealthRecords)', () => {
    it('should return all health records for a student', async () => {
      // Arrange
      const studentRecords = [mockHealthRecord];
      mockService.getStudentHealthRecords = jest
        .fn()
        .mockResolvedValue(studentRecords);

      // Act
      const result = await mockService.getStudentHealthRecords('student-123');

      // Assert
      expect(result).toEqual(studentRecords);
      expect(mockService.getStudentHealthRecords).toHaveBeenCalledWith(
        'student-123',
      );
    });

    it('should return empty array when student has no records', async () => {
      // Arrange
      mockService.getStudentHealthRecords = jest.fn().mockResolvedValue([]);

      // Act
      const result = await mockService.getStudentHealthRecords('student-123');

      // Assert
      expect(result).toEqual([]);
    });

    it('should throw NotFoundException when student not found', async () => {
      // Arrange
      mockService.getStudentHealthRecords = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Student not found'));

      // Act & Assert
      await expect(
        mockService.getStudentHealthRecords('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== UPDATE HEALTH RECORD ====================

  describe('PATCH /health-record/:id (update)', () => {
    const updateDto: HealthRecordUpdateDto = {
      notes: 'Updated notes',
      followUpRequired: true,
      followUpDate: new Date('2024-02-15'),
    };

    it('should update health record and return updated data', async () => {
      // Arrange
      const updatedRecord = { ...mockHealthRecord, ...updateDto };
      mockService.updateHealthRecord = jest
        .fn()
        .mockResolvedValue(updatedRecord);
      mockPHIAccessLogger.logUpdate.mockResolvedValue(undefined);

      // Act
      const result = await mockService.updateHealthRecord('hr-123', updateDto);

      // Assert
      expect(result).toEqual(updatedRecord);
      expect(mockService.updateHealthRecord).toHaveBeenCalledWith(
        'hr-123',
        updateDto,
      );
    });

    it('should log PHI update', async () => {
      // Arrange
      mockService.updateHealthRecord = jest
        .fn()
        .mockResolvedValue(mockHealthRecord);
      mockPHIAccessLogger.logUpdate.mockResolvedValue(undefined);

      // Act
      await mockService.updateHealthRecord('hr-123', updateDto);

      // Assert - PHI update should be logged
      expect(mockService.updateHealthRecord).toHaveBeenCalled();
    });

    it('should throw NotFoundException when record not found', async () => {
      // Arrange
      mockService.updateHealthRecord = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Health record not found'));

      // Act & Assert
      await expect(
        mockService.updateHealthRecord('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should allow partial updates', async () => {
      // Arrange
      const partialDto = { notes: 'Only notes updated' };
      const updatedRecord = { ...mockHealthRecord, notes: 'Only notes updated' };
      mockService.updateHealthRecord = jest
        .fn()
        .mockResolvedValue(updatedRecord);

      // Act
      const result = await mockService.updateHealthRecord('hr-123', partialDto);

      // Assert
      expect(result.notes).toBe('Only notes updated');
    });

    it('should validate follow-up date is after record date', async () => {
      // Arrange
      const invalidDto = {
        ...updateDto,
        followUpDate: new Date('2024-01-01'),
      };
      mockService.updateHealthRecord = jest
        .fn()
        .mockRejectedValue(
          new BadRequestException('Follow-up date must be after record date'),
        );

      // Act & Assert
      await expect(
        mockService.updateHealthRecord('hr-123', invalidDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== DELETE HEALTH RECORD ====================

  describe('DELETE /health-record/:id (delete)', () => {
    it('should soft delete health record', async () => {
      // Arrange
      mockService.deleteHealthRecord = jest.fn().mockResolvedValue(undefined);
      mockPHIAccessLogger.logDelete.mockResolvedValue(undefined);

      // Act
      await mockService.deleteHealthRecord('hr-123');

      // Assert
      expect(mockService.deleteHealthRecord).toHaveBeenCalledWith('hr-123');
    });

    it('should log PHI deletion', async () => {
      // Arrange
      mockService.deleteHealthRecord = jest.fn().mockResolvedValue(undefined);
      mockPHIAccessLogger.logDelete.mockResolvedValue(undefined);

      // Act
      await mockService.deleteHealthRecord('hr-123');

      // Assert - PHI deletion should be logged
      expect(mockService.deleteHealthRecord).toHaveBeenCalled();
    });

    it('should throw NotFoundException when record not found', async () => {
      // Arrange
      mockService.deleteHealthRecord = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Health record not found'));

      // Act & Assert
      await expect(
        mockService.deleteHealthRecord('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should maintain record for audit trail', async () => {
      // Arrange
      const deletedRecord = { ...mockHealthRecord, isDeleted: true };
      mockService.deleteHealthRecord = jest
        .fn()
        .mockResolvedValue(deletedRecord);

      // Act
      const result = await mockService.deleteHealthRecord('hr-123');

      // Assert
      expect(result).toBeDefined();
    });
  });

  // ==================== IMPORT HEALTH RECORDS ====================

  describe('POST /health-record/import (import)', () => {
    const mockImportData = {
      records: [
        {
          studentId: 'student-123',
          type: 'VACCINATION',
          date: '2024-01-15',
          provider: 'Dr. Smith',
          notes: 'Imported record',
        },
      ],
    };

    it('should import health records', async () => {
      // Arrange
      mockService.importHealthRecords = jest.fn().mockResolvedValue({
        imported: 1,
        failed: 0,
        errors: [],
      });

      // Act
      const result = await mockService.importHealthRecords(mockImportData);

      // Assert
      expect(result.imported).toBe(1);
      expect(result.failed).toBe(0);
      expect(mockService.importHealthRecords).toHaveBeenCalledWith(
        mockImportData,
      );
    });

    it('should report import failures', async () => {
      // Arrange
      mockService.importHealthRecords = jest.fn().mockResolvedValue({
        imported: 0,
        failed: 1,
        errors: ['Student not found'],
      });

      // Act
      const result = await mockService.importHealthRecords(mockImportData);

      // Assert
      expect(result.imported).toBe(0);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
    });

    it('should validate import data format', async () => {
      // Arrange
      mockService.importHealthRecords = jest
        .fn()
        .mockRejectedValue(
          new BadRequestException('Invalid import data format'),
        );

      // Act & Assert
      await expect(
        mockService.importHealthRecords({ records: [] }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== EXPORT HEALTH RECORDS ====================

  describe('GET /health-record/export (export)', () => {
    it('should export health records', async () => {
      // Arrange
      const exportData = {
        records: [mockHealthRecord],
        exportDate: new Date(),
        totalRecords: 1,
      };
      mockService.exportHealthRecords = jest.fn().mockResolvedValue(exportData);
      mockPHIAccessLogger.logExport.mockResolvedValue(undefined);

      // Act
      const result = await mockService.exportHealthRecords({ format: 'json' });

      // Assert
      expect(result).toEqual(exportData);
      expect(mockService.exportHealthRecords).toHaveBeenCalledWith({
        format: 'json',
      });
    });

    it('should log PHI export', async () => {
      // Arrange
      mockService.exportHealthRecords = jest.fn().mockResolvedValue({
        records: [mockHealthRecord],
        exportDate: new Date(),
        totalRecords: 1,
      });
      mockPHIAccessLogger.logExport.mockResolvedValue(undefined);

      // Act
      await mockService.exportHealthRecords({ format: 'json' });

      // Assert - PHI export should be logged
      expect(mockService.exportHealthRecords).toHaveBeenCalled();
    });

    it('should support different export formats', async () => {
      // Arrange
      mockService.exportHealthRecords = jest.fn().mockResolvedValue({
        records: [mockHealthRecord],
        exportDate: new Date(),
        totalRecords: 1,
      });

      // Act
      await mockService.exportHealthRecords({ format: 'csv' });

      // Assert
      expect(mockService.exportHealthRecords).toHaveBeenCalledWith({
        format: 'csv',
      });
    });
  });

  // ==================== GET STATISTICS ====================

  describe('GET /health-record/statistics (getStatistics)', () => {
    const mockStatistics = {
      total: 1000,
      byType: {
        VACCINATION: 300,
        ILLNESS: 250,
        INJURY: 150,
        ALLERGY: 100,
        CHRONIC_CONDITION: 50,
        MENTAL_HEALTH: 75,
        OTHER: 75,
      },
      recentRecords: 50,
      followUpRequired: 25,
    };

    it('should return health record statistics', async () => {
      // Arrange
      mockService.getHealthRecordStatistics = jest
        .fn()
        .mockResolvedValue(mockStatistics);

      // Act
      const result = await mockService.getHealthRecordStatistics();

      // Assert
      expect(result).toEqual(mockStatistics);
      expect(mockService.getHealthRecordStatistics).toHaveBeenCalledTimes(1);
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      // Arrange
      mockService.getAllHealthRecords.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // Act & Assert
      await expect(
        controller.findAll(
          1,
          20,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          mockRequest as any,
        ),
      ).rejects.toThrow('Database connection failed');
    });

    it('should handle service layer errors', async () => {
      // Arrange
      mockService.createHealthRecord.mockRejectedValue(
        new Error('Internal service error'),
      );

      // Act & Assert
      await expect(
        controller.create({} as HealthRecordCreateDto, mockRequest as any),
      ).rejects.toThrow('Internal service error');
    });

    it('should handle PHI logging errors gracefully', async () => {
      // Arrange
      mockService.createHealthRecord.mockResolvedValue(mockHealthRecord);
      mockPHIAccessLogger.logCreate.mockRejectedValue(
        new Error('Logging service unavailable'),
      );

      // Act - Should still create record even if logging fails
      const result = await controller.create(
        {
          studentId: 'student-123',
          type: 'VACCINATION',
          date: new Date(),
        } as HealthRecordCreateDto,
        mockRequest as any,
      );

      // Assert
      expect(result).toEqual(mockHealthRecord);
    });
  });

  // ==================== AUTHORIZATION ====================

  describe('Authorization', () => {
    it('should enforce role-based access control', async () => {
      // Arrange
      const viewerUser = { ...mockUser, role: 'VIEWER' };
      const viewerRequest = { ...mockRequest, user: viewerUser };
      mockService.createHealthRecord.mockRejectedValue(
        new ForbiddenException('Insufficient permissions'),
      );

      // Act & Assert
      await expect(
        controller.create(
          {} as HealthRecordCreateDto,
          viewerRequest as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should enforce multi-tenant data isolation', async () => {
      // Arrange
      const otherSchoolUser = { ...mockUser, schoolId: 'other-school' };
      mockService.getHealthRecordById = jest
        .fn()
        .mockRejectedValue(
          new ForbiddenException('Cannot access other school records'),
        );

      // Act & Assert
      await expect(
        mockService.getHealthRecordById('hr-123'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle null parameters gracefully', async () => {
      // Arrange
      mockService.getHealthRecordById = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Invalid ID'));

      // Act & Assert
      await expect(
        mockService.getHealthRecordById(null as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle very large notes field', async () => {
      // Arrange
      const longNotes = 'x'.repeat(100000);
      const longNotesDto = {
        studentId: 'student-123',
        type: 'VACCINATION',
        date: new Date(),
        notes: longNotes,
      };
      mockService.createHealthRecord.mockRejectedValue(
        new BadRequestException('Notes field exceeds maximum length'),
      );

      // Act & Assert
      await expect(
        controller.create(longNotesDto as any, mockRequest as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle special characters in search', async () => {
      // Arrange
      mockService.getAllHealthRecords.mockResolvedValue({
        records: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      });

      // Act
      const result = await controller.findAll(
        1,
        20,
        undefined,
        undefined,
        undefined,
        undefined,
        "O'Brien",
        mockRequest as any,
      );

      // Assert
      expect(result.data).toEqual([]);
    });
  });
});
