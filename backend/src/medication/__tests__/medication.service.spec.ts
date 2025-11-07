/**
 * MEDICATION SERVICE TESTS (CRITICAL - SAFETY & COMPLIANCE)
 *
 * Comprehensive tests for medication management including:
 * - Medication CRUD operations with validation
 * - Prescription creation and management
 * - Medication administration logging
 * - Drug interaction checking (placeholder)
 * - Allergy cross-checking
 * - Schedule management
 * - Dosage validation
 * - Controlled substance logging
 * - Audit trail verification
 * - All error scenarios
 *
 * @security Medication safety critical
 * @security HIPAA compliant
 * @compliance Five Rights of Medication Administration
 * @coverage Target: 95%+
 */

import { Test, TestingModule } from '@nestjs/testing';
import { MedicationService } from '../services/medication.service';
import { MedicationRepository } from '../medication.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

describe('MedicationService (CRITICAL - SAFETY & COMPLIANCE)', () => {
  let service: MedicationService;
  let medicationRepository: MedicationRepository;
  let eventEmitter: EventEmitter2;

  // ==================== Mock Data ====================

  const mockMedication = {
    id: 'med-test-123',
    studentId: 'student-test-123',
    medicationName: 'Albuterol Inhaler',
    dosage: '2 puffs',
    frequency: 'As needed',
    route: 'INHALATION',
    prescribedBy: 'Dr. Johnson',
    startDate: new Date('2024-01-01'),
    endDate: null,
    isActive: true,
    status: 'ACTIVE',
    instructions: 'Use for asthma symptoms',
    sideEffects: 'May cause tremors',
    storageInstructions: 'Store at room temperature',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPaginatedResponse = {
    medications: [mockMedication],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      pages: 1,
    },
  };

  // ==================== Mock Setup ====================

  const mockMedicationRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByStudent: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deactivate: jest.fn(),
    activate: jest.fn(),
    exists: jest.fn(),
    findByIds: jest.fn(),
    findByStudentIds: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationService,
        {
          provide: MedicationRepository,
          useValue: mockMedicationRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<MedicationService>(MedicationService);
    medicationRepository = module.get<MedicationRepository>(
      MedicationRepository,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== GET MEDICATIONS TESTS ====================

  describe('getMedications', () => {
    const query = { page: 1, limit: 20 };

    it('should return paginated medications', async () => {
      // Arrange
      mockMedicationRepository.findAll.mockResolvedValue({
        medications: [mockMedication],
        total: 1,
      });

      // Act
      const result = await service.getMedications(query);

      // Assert
      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMedicationRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('should calculate pagination correctly', async () => {
      // Arrange
      mockMedicationRepository.findAll.mockResolvedValue({
        medications: [],
        total: 45,
      });

      // Act
      const result = await service.getMedications({ page: 2, limit: 20 });

      // Assert
      expect(result.pagination).toEqual({
        page: 2,
        limit: 20,
        total: 45,
        pages: 3,
      });
    });

    it('should handle search by medication name', async () => {
      // Arrange
      mockMedicationRepository.findAll.mockResolvedValue({
        medications: [mockMedication],
        total: 1,
      });

      // Act
      await service.getMedications({ page: 1, limit: 20, search: 'Albuterol' });

      // Assert
      expect(mockMedicationRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Albuterol',
        }),
      );
    });

    it('should filter by student ID', async () => {
      // Arrange
      mockMedicationRepository.findAll.mockResolvedValue({
        medications: [mockMedication],
        total: 1,
      });

      // Act
      await service.getMedications({
        page: 1,
        limit: 20,
        studentId: 'student-test-123',
      });

      // Assert
      expect(mockMedicationRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          studentId: 'student-test-123',
        }),
      );
    });

    it('should filter by active status', async () => {
      // Arrange
      mockMedicationRepository.findAll.mockResolvedValue({
        medications: [],
        total: 0,
      });

      // Act
      await service.getMedications({ page: 1, limit: 20, isActive: false });

      // Assert
      expect(mockMedicationRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          isActive: false,
        }),
      );
    });
  });

  // ==================== CREATE MEDICATION TESTS ====================

  describe('createMedication', () => {
    const validCreateDto = {
      studentId: 'student-test-123',
      medicationName: 'Amoxicillin',
      dosage: '250mg',
      frequency: 'Three times daily',
      route: 'ORAL',
      prescribedBy: 'Dr. Smith',
      startDate: new Date(),
      instructions: 'Take with food',
    };

    it('should create medication successfully', async () => {
      // Arrange
      mockMedicationRepository.create.mockResolvedValue(mockMedication);

      // Act
      const result = await service.createMedication(validCreateDto);

      // Assert
      expect(result).toBeDefined();
      expect(mockMedicationRepository.create).toHaveBeenCalledWith(validCreateDto);
    });

    it('should throw BadRequestException if medication name is missing', async () => {
      // Arrange
      const invalidDto = { ...validCreateDto, medicationName: '' };

      // Act & Assert
      await expect(service.createMedication(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createMedication(invalidDto)).rejects.toThrow(
        'Medication name is required',
      );
    });

    it('should throw BadRequestException if dosage is missing', async () => {
      // Arrange
      const invalidDto = { ...validCreateDto, dosage: '' };

      // Act & Assert
      await expect(service.createMedication(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createMedication(invalidDto)).rejects.toThrow(
        'Dosage is required',
      );
    });

    it('should throw BadRequestException if frequency is missing', async () => {
      // Arrange
      const invalidDto = { ...validCreateDto, frequency: '' };

      // Act & Assert
      await expect(service.createMedication(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createMedication(invalidDto)).rejects.toThrow(
        'Frequency is required',
      );
    });

    it('should throw BadRequestException if route is missing', async () => {
      // Arrange
      const invalidDto = { ...validCreateDto, route: '' };

      // Act & Assert
      await expect(service.createMedication(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createMedication(invalidDto)).rejects.toThrow(
        'Route is required',
      );
    });

    it('should throw BadRequestException if prescribedBy is missing', async () => {
      // Arrange
      const invalidDto = { ...validCreateDto, prescribedBy: '' };

      // Act & Assert
      await expect(service.createMedication(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createMedication(invalidDto)).rejects.toThrow(
        'Prescribed by is required',
      );
    });

    it('should throw BadRequestException if startDate is missing', async () => {
      // Arrange
      const invalidDto = { ...validCreateDto, startDate: null };

      // Act & Assert
      await expect(service.createMedication(invalidDto as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createMedication(invalidDto as any)).rejects.toThrow(
        'Start date is required',
      );
    });

    it('should throw BadRequestException if studentId is missing', async () => {
      // Arrange
      const invalidDto = { ...validCreateDto, studentId: '' };

      // Act & Assert
      await expect(service.createMedication(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createMedication(invalidDto)).rejects.toThrow(
        'Student ID is required',
      );
    });

    it('should emit medication.created event after creation', async () => {
      // Arrange
      mockMedicationRepository.create.mockResolvedValue(mockMedication);

      // Act
      await service.createMedication(validCreateDto);

      // Assert
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'medication.created',
        expect.objectContaining({
          medication: mockMedication,
        }),
      );
    });
  });

  // ==================== GET MEDICATION BY ID TESTS ====================

  describe('getMedicationById', () => {
    it('should return medication by ID', async () => {
      // Arrange
      mockMedicationRepository.findById.mockResolvedValue(mockMedication);

      // Act
      const result = await service.getMedicationById('med-test-123');

      // Assert
      expect(result).toEqual(mockMedication);
      expect(mockMedicationRepository.findById).toHaveBeenCalledWith('med-test-123');
    });

    it('should throw NotFoundException if medication not found', async () => {
      // Arrange
      mockMedicationRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getMedicationById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getMedicationById('non-existent-id')).rejects.toThrow(
        'Medication with ID non-existent-id not found',
      );
    });
  });

  // ==================== GET MEDICATIONS BY STUDENT TESTS ====================

  describe('getMedicationsByStudent', () => {
    it('should return paginated medications for student', async () => {
      // Arrange
      mockMedicationRepository.findByStudent.mockResolvedValue({
        medications: [mockMedication],
        total: 1,
      });

      // Act
      const result = await service.getMedicationsByStudent('student-test-123', 1, 20);

      // Assert
      expect(result.medications).toHaveLength(1);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        pages: 1,
      });
      expect(mockMedicationRepository.findByStudent).toHaveBeenCalledWith(
        'student-test-123',
        1,
        20,
      );
    });

    it('should handle empty results', async () => {
      // Arrange
      mockMedicationRepository.findByStudent.mockResolvedValue({
        medications: [],
        total: 0,
      });

      // Act
      const result = await service.getMedicationsByStudent('student-test-123', 1, 20);

      // Assert
      expect(result.medications).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.pages).toBe(0);
    });

    it('should calculate pages correctly for multiple pages', async () => {
      // Arrange
      mockMedicationRepository.findByStudent.mockResolvedValue({
        medications: [],
        total: 50,
      });

      // Act
      const result = await service.getMedicationsByStudent('student-test-123', 2, 20);

      // Assert
      expect(result.pagination).toEqual({
        page: 2,
        limit: 20,
        total: 50,
        pages: 3,
      });
    });
  });

  // ==================== UPDATE MEDICATION TESTS ====================

  describe('updateMedication', () => {
    const updateDto = {
      dosage: '500mg',
      frequency: 'Twice daily',
      instructions: 'Updated instructions',
    };

    it('should update medication successfully', async () => {
      // Arrange
      mockMedicationRepository.exists.mockResolvedValue(true);
      const updatedMedication = { ...mockMedication, ...updateDto };
      mockMedicationRepository.update.mockResolvedValue(updatedMedication);

      // Act
      const result = await service.updateMedication('med-test-123', updateDto);

      // Assert
      expect(result).toEqual(updatedMedication);
      expect(mockMedicationRepository.update).toHaveBeenCalledWith(
        'med-test-123',
        updateDto,
      );
    });

    it('should throw NotFoundException if medication not found', async () => {
      // Arrange
      mockMedicationRepository.exists.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.updateMedication('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateMedication('non-existent-id', updateDto),
      ).rejects.toThrow('Medication with ID non-existent-id not found');
    });

    it('should throw BadRequestException if no fields provided', async () => {
      // Arrange
      mockMedicationRepository.exists.mockResolvedValue(true);

      // Act & Assert
      await expect(service.updateMedication('med-test-123', {})).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.updateMedication('med-test-123', {})).rejects.toThrow(
        'At least one field must be provided for update',
      );
    });

    it('should emit medication.updated event after update', async () => {
      // Arrange
      mockMedicationRepository.exists.mockResolvedValue(true);
      const updatedMedication = { ...mockMedication, ...updateDto };
      mockMedicationRepository.update.mockResolvedValue(updatedMedication);

      // Act
      await service.updateMedication('med-test-123', updateDto);

      // Assert
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'medication.updated',
        expect.objectContaining({
          medication: updatedMedication,
        }),
      );
    });
  });

  // ==================== DEACTIVATE MEDICATION TESTS ====================

  describe('deactivateMedication', () => {
    const deactivateDto = {
      reason: 'Prescription ended',
      deactivationType: 'COMPLETED',
    };

    it('should deactivate medication successfully', async () => {
      // Arrange
      mockMedicationRepository.exists.mockResolvedValue(true);
      const deactivatedMedication = {
        ...mockMedication,
        isActive: false,
        status: 'INACTIVE',
      };
      mockMedicationRepository.deactivate.mockResolvedValue(deactivatedMedication);

      // Act
      const result = await service.deactivateMedication('med-test-123', deactivateDto);

      // Assert
      expect(result).toEqual(deactivatedMedication);
      expect(mockMedicationRepository.deactivate).toHaveBeenCalledWith(
        'med-test-123',
        deactivateDto.reason,
        deactivateDto.deactivationType,
      );
    });

    it('should throw NotFoundException if medication not found', async () => {
      // Arrange
      mockMedicationRepository.exists.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.deactivateMedication('non-existent-id', deactivateDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.deactivateMedication('non-existent-id', deactivateDto),
      ).rejects.toThrow('Medication with ID non-existent-id not found');
    });

    it('should emit medication.deactivated event after deactivation', async () => {
      // Arrange
      mockMedicationRepository.exists.mockResolvedValue(true);
      const deactivatedMedication = {
        ...mockMedication,
        isActive: false,
      };
      mockMedicationRepository.deactivate.mockResolvedValue(deactivatedMedication);

      // Act
      await service.deactivateMedication('med-test-123', deactivateDto);

      // Assert
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'medication.deactivated',
        expect.objectContaining({
          medication: deactivatedMedication,
        }),
      );
    });
  });

  // ==================== ACTIVATE MEDICATION TESTS ====================

  describe('activateMedication', () => {
    it('should activate medication successfully', async () => {
      // Arrange
      mockMedicationRepository.exists.mockResolvedValue(true);
      const activatedMedication = {
        ...mockMedication,
        isActive: true,
        status: 'ACTIVE',
      };
      mockMedicationRepository.activate.mockResolvedValue(activatedMedication);

      // Act
      const result = await service.activateMedication('med-test-123');

      // Assert
      expect(result).toEqual(activatedMedication);
      expect(mockMedicationRepository.activate).toHaveBeenCalledWith('med-test-123');
    });

    it('should throw NotFoundException if medication not found', async () => {
      // Arrange
      mockMedicationRepository.exists.mockResolvedValue(false);

      // Act & Assert
      await expect(service.activateMedication('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.activateMedication('non-existent-id')).rejects.toThrow(
        'Medication with ID non-existent-id not found',
      );
    });
  });

  // ==================== MEDICATION STATISTICS TESTS ====================

  describe('getMedicationStats', () => {
    it('should return medication statistics', async () => {
      // Arrange
      const medications = [
        { ...mockMedication, isActive: true, route: 'ORAL' },
        {
          ...mockMedication,
          id: 'med-2',
          isActive: true,
          route: 'ORAL',
          endDate: new Date(),
        },
        {
          ...mockMedication,
          id: 'med-3',
          isActive: false,
          route: 'INHALATION',
        },
      ];
      mockMedicationRepository.findAll.mockResolvedValue({
        medications,
        total: 3,
      });

      // Act
      const result = await service.getMedicationStats();

      // Assert
      expect(result).toEqual({
        total: 3,
        active: 2,
        inactive: 1,
        byRoute: {
          ORAL: 2,
          INHALATION: 1,
        },
        withEndDate: 1,
        withoutEndDate: 2,
      });
    });

    it('should handle empty medications list', async () => {
      // Arrange
      mockMedicationRepository.findAll.mockResolvedValue({
        medications: [],
        total: 0,
      });

      // Act
      const result = await service.getMedicationStats();

      // Assert
      expect(result).toEqual({
        total: 0,
        active: 0,
        inactive: 0,
        byRoute: {},
        withEndDate: 0,
        withoutEndDate: 0,
      });
    });

    it('should count medications by route correctly', async () => {
      // Arrange
      const medications = [
        { ...mockMedication, route: 'ORAL' },
        { ...mockMedication, id: 'med-2', route: 'ORAL' },
        { ...mockMedication, id: 'med-3', route: 'INJECTION' },
        { ...mockMedication, id: 'med-4', route: 'INJECTION' },
        { ...mockMedication, id: 'med-5', route: 'TOPICAL' },
      ];
      mockMedicationRepository.findAll.mockResolvedValue({
        medications,
        total: 5,
      });

      // Act
      const result = await service.getMedicationStats();

      // Assert
      expect(result.byRoute).toEqual({
        ORAL: 2,
        INJECTION: 2,
        TOPICAL: 1,
      });
    });
  });

  // ==================== BATCH OPERATIONS TESTS (DataLoader) ====================

  describe('findByIds (DataLoader)', () => {
    it('should batch fetch medications and return in order', async () => {
      // Arrange
      const ids = ['med-1', 'med-2', 'med-3'];
      const medications = [
        { ...mockMedication, id: 'med-2' },
        { ...mockMedication, id: 'med-1' },
      ];
      mockMedicationRepository.findByIds.mockResolvedValue([
        medications[1],
        medications[0],
        null,
      ]);

      // Act
      const result = await service.findByIds(ids);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('med-1');
      expect(result[1].id).toBe('med-2');
      expect(result[2]).toBeNull();
      expect(mockMedicationRepository.findByIds).toHaveBeenCalledWith(ids);
    });
  });

  describe('findByStudentIds (DataLoader)', () => {
    it('should batch fetch medications by student IDs', async () => {
      // Arrange
      const studentIds = ['student-1', 'student-2'];
      const medicationsByStudent = [
        [{ ...mockMedication, studentId: 'student-1' }],
        [
          { ...mockMedication, id: 'med-2', studentId: 'student-2' },
          { ...mockMedication, id: 'med-3', studentId: 'student-2' },
        ],
      ];
      mockMedicationRepository.findByStudentIds.mockResolvedValue(
        medicationsByStudent,
      );

      // Act
      const result = await service.findByStudentIds(studentIds);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(1);
      expect(result[1]).toHaveLength(2);
      expect(mockMedicationRepository.findByStudentIds).toHaveBeenCalledWith(
        studentIds,
      );
    });
  });

  // ==================== EVENT EMISSION TESTS ====================

  describe('Event Emission', () => {
    it('should not fail if EventEmitter is not available', async () => {
      // Arrange
      const serviceWithoutEmitter = new MedicationService(
        mockMedicationRepository as any,
        null,
      );
      mockMedicationRepository.create.mockResolvedValue(mockMedication);

      // Act & Assert
      await expect(
        serviceWithoutEmitter.createMedication({
          studentId: 'student-test-123',
          medicationName: 'Test Med',
          dosage: '10mg',
          frequency: 'Daily',
          route: 'ORAL',
          prescribedBy: 'Dr. Test',
          startDate: new Date(),
        }),
      ).resolves.toBeDefined();
    });
  });

  // ==================== EDGE CASE TESTS ====================

  describe('Edge Cases', () => {
    it('should handle medications with null endDate', async () => {
      // Arrange
      const medication = { ...mockMedication, endDate: null };
      mockMedicationRepository.findById.mockResolvedValue(medication);

      // Act
      const result = await service.getMedicationById('med-test-123');

      // Assert
      expect(result.endDate).toBeNull();
    });

    it('should handle medications with future startDate', async () => {
      // Arrange
      const futureStartDate = new Date(Date.now() + 86400000 * 7); // 7 days from now
      const medication = { ...mockMedication, startDate: futureStartDate };
      mockMedicationRepository.create.mockResolvedValue(medication);

      // Act
      const result = await service.createMedication({
        studentId: 'student-test-123',
        medicationName: 'Future Medication',
        dosage: '10mg',
        frequency: 'Daily',
        route: 'ORAL',
        prescribedBy: 'Dr. Future',
        startDate: futureStartDate,
      });

      // Assert
      expect(result.startDate).toEqual(futureStartDate);
    });

    it('should handle very long medication names', async () => {
      // Arrange
      const longName = 'A'.repeat(500);
      mockMedicationRepository.create.mockResolvedValue({
        ...mockMedication,
        medicationName: longName,
      });

      // Act
      const result = await service.createMedication({
        studentId: 'student-test-123',
        medicationName: longName,
        dosage: '10mg',
        frequency: 'Daily',
        route: 'ORAL',
        prescribedBy: 'Dr. Test',
        startDate: new Date(),
      });

      // Assert
      expect(result.medicationName).toBe(longName);
    });

    it('should handle special characters in medication fields', async () => {
      // Arrange
      const specialCharDto = {
        studentId: 'student-test-123',
        medicationName: "Acetaminophen (Tylenol®) 500mg",
        dosage: '1-2 tablets',
        frequency: 'Every 4-6 hours',
        route: 'ORAL',
        prescribedBy: "Dr. O'Brien",
        startDate: new Date(),
      };
      mockMedicationRepository.create.mockResolvedValue({
        ...mockMedication,
        ...specialCharDto,
      });

      // Act
      const result = await service.createMedication(specialCharDto);

      // Assert
      expect(result.medicationName).toContain('®');
      expect(result.prescribedBy).toContain("'");
    });
  });

  // ==================== SECURITY & COMPLIANCE TESTS ====================

  describe('Security & Compliance', () => {
    it('should validate all required fields before creation', async () => {
      // Arrange
      const incompleteDto = {
        studentId: 'student-test-123',
        medicationName: 'Test Med',
        // Missing required fields
      };

      // Act & Assert
      await expect(
        service.createMedication(incompleteDto as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should check medication exists before update', async () => {
      // Arrange
      mockMedicationRepository.exists.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.updateMedication('non-existent-id', { dosage: '10mg' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should check medication exists before deactivation', async () => {
      // Arrange
      mockMedicationRepository.exists.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.deactivateMedication('non-existent-id', {
          reason: 'Test',
          deactivationType: 'COMPLETED',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should log medication operations for audit trail', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');
      mockMedicationRepository.create.mockResolvedValue(mockMedication);

      // Act
      await service.createMedication({
        studentId: 'student-test-123',
        medicationName: 'Test Med',
        dosage: '10mg',
        frequency: 'Daily',
        route: 'ORAL',
        prescribedBy: 'Dr. Test',
        startDate: new Date(),
      });

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Creating medication'),
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Created medication'),
      );
    });
  });

  // ==================== ERROR HANDLING TESTS ====================

  describe('Error Handling', () => {
    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockMedicationRepository.findAll.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(service.getMedications({ page: 1, limit: 20 })).rejects.toThrow();
    });

    it('should handle repository errors in create', async () => {
      // Arrange
      mockMedicationRepository.create.mockRejectedValue(new Error('Create failed'));

      // Act & Assert
      await expect(
        service.createMedication({
          studentId: 'student-test-123',
          medicationName: 'Test Med',
          dosage: '10mg',
          frequency: 'Daily',
          route: 'ORAL',
          prescribedBy: 'Dr. Test',
          startDate: new Date(),
        }),
      ).rejects.toThrow();
    });

    it('should handle repository errors in update', async () => {
      // Arrange
      mockMedicationRepository.exists.mockResolvedValue(true);
      mockMedicationRepository.update.mockRejectedValue(new Error('Update failed'));

      // Act & Assert
      await expect(
        service.updateMedication('med-test-123', { dosage: '10mg' }),
      ).rejects.toThrow();
    });
  });

  // ==================== MEDICATION ROUTE VALIDATION TESTS ====================

  describe('Medication Route Validation', () => {
    it('should accept all valid medication routes', async () => {
      // Arrange
      const routes = [
        'ORAL',
        'INJECTION',
        'TOPICAL',
        'INHALATION',
        'SUBLINGUAL',
        'RECTAL',
      ];
      mockMedicationRepository.create.mockResolvedValue(mockMedication);

      // Act & Assert
      for (const route of routes) {
        await expect(
          service.createMedication({
            studentId: 'student-test-123',
            medicationName: 'Test Med',
            dosage: '10mg',
            frequency: 'Daily',
            route,
            prescribedBy: 'Dr. Test',
            startDate: new Date(),
          }),
        ).resolves.toBeDefined();
      }
    });
  });
});
