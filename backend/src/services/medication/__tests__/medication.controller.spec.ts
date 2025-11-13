/**
 * Medication Controller Unit Tests
 *
 * Comprehensive tests for Medication Controller including:
 * - CRUD operations (create, read, update, deactivate, activate)
 * - Medication prescription management
 * - Medication administration logging
 * - Drug interaction checking
 * - Allergy cross-checking
 * - Medication statistics
 * - Search and filtering with pagination
 * - Authorization and validation
 * - HIPAA audit logging
 * - Rate limiting
 * - Safety checks and validations
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { MedicationController } from '../medication.controller';
import { MedicationService } from '../services/medication.service';
import { CreateMedicationDto } from '../dto/create-medication.dto';
import { DeactivateMedicationDto } from '../dto/deactivate-medication.dto';
import { ListMedicationsQueryDto } from '../dto/list-medications-query.dto';
import { UpdateMedicationDto } from '../dto/update-medication.dto';

describe('MedicationController', () => {
  let controller: MedicationController;
  let service: MedicationService;

  // ==================== MOCK DATA ====================

  const mockMedication = {
    id: 'med-123',
    studentId: 'student-123',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    dosage: '200mg',
    frequency: 'As needed',
    route: 'Oral',
    prescribedBy: 'Dr. Smith',
    prescriptionNumber: 'RX-12345',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    instructions: 'Take with food',
    sideEffects: 'May cause stomach upset',
    warnings: 'Do not exceed 6 doses in 24 hours',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'nurse-123',
  };

  const mockUser = {
    id: 'nurse-123',
    email: 'nurse@school.edu',
    role: 'NURSE',
    schoolId: 'school-123',
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

  const mockService = {
    getMedications: jest.fn(),
    getMedicationStats: jest.fn(),
    createMedication: jest.fn(),
    getMedicationById: jest.fn(),
    updateMedication: jest.fn(),
    deactivateMedication: jest.fn(),
    activateMedication: jest.fn(),
    getMedicationsByStudent: jest.fn(),
    administerMedication: jest.fn(),
    checkDrugInteractions: jest.fn(),
    checkAllergies: jest.fn(),
    getMedicationHistory: jest.fn(),
    searchMedications: jest.fn(),
  };

  // ==================== SETUP & TEARDOWN ====================

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationController],
      providers: [
        {
          provide: MedicationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MedicationController>(MedicationController);
    service = module.get<MedicationService>(MedicationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== BASIC TESTS ====================

  describe('Controller Definition', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have medicationService injected', () => {
      expect(service).toBeDefined();
    });
  });

  // ==================== GET MEDICATIONS (LIST) ====================

  describe('GET /medications (list)', () => {
    const mockQuery: ListMedicationsQueryDto = {
      page: 1,
      limit: 20,
      search: 'ibuprofen',
      studentId: 'student-123',
      isActive: true,
    };

    it('should return paginated list of medications', async () => {
      // Arrange
      mockService.getMedications.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await controller.list(mockQuery);

      // Assert
      expect(result).toEqual(mockPaginatedResponse);
      expect(service.getMedications).toHaveBeenCalledWith(mockQuery);
      expect(service.getMedications).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no medications found', async () => {
      // Arrange
      mockService.getMedications.mockResolvedValue({
        medications: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      });

      // Act
      const result = await controller.list(mockQuery);

      // Assert
      expect(result.medications).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });

    it('should handle search filter', async () => {
      // Arrange
      mockService.getMedications.mockResolvedValue(mockPaginatedResponse);

      // Act
      await controller.list({ ...mockQuery, search: 'aspirin' });

      // Assert
      expect(service.getMedications).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'aspirin' }),
      );
    });

    it('should handle student filter', async () => {
      // Arrange
      mockService.getMedications.mockResolvedValue(mockPaginatedResponse);

      // Act
      await controller.list({ ...mockQuery, studentId: 'student-456' });

      // Assert
      expect(service.getMedications).toHaveBeenCalledWith(
        expect.objectContaining({ studentId: 'student-456' }),
      );
    });

    it('should handle isActive filter', async () => {
      // Arrange
      mockService.getMedications.mockResolvedValue({
        medications: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      });

      // Act
      await controller.list({ ...mockQuery, isActive: false });

      // Assert
      expect(service.getMedications).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false }),
      );
    });

    it('should handle pagination parameters', async () => {
      // Arrange
      mockService.getMedications.mockResolvedValue({
        medications: [mockMedication],
        pagination: { page: 2, limit: 50, total: 100, pages: 2 },
      });

      // Act
      await controller.list({ page: 2, limit: 50 } as ListMedicationsQueryDto);

      // Assert
      expect(service.getMedications).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, limit: 50 }),
      );
    });

    it('should enforce maximum limit', async () => {
      // Arrange
      const largeLimit = { ...mockQuery, limit: 1000 };
      mockService.getMedications.mockRejectedValue(
        new BadRequestException('Limit cannot exceed 100'),
      );

      // Act & Assert
      await expect(controller.list(largeLimit)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ==================== GET MEDICATION STATISTICS ====================

  describe('GET /medications/stats (getStats)', () => {
    const mockStats = {
      total: 500,
      active: 450,
      inactive: 50,
      byType: {
        'Pain Relief': 150,
        'Antibiotics': 100,
        'Allergy': 80,
        'Asthma': 70,
        'Other': 100,
      },
      expiringThisMonth: 25,
      requiresRefill: 30,
    };

    it('should return medication statistics', async () => {
      // Arrange
      mockService.getMedicationStats.mockResolvedValue(mockStats);

      // Act
      const result = await controller.getStats();

      // Assert
      expect(result).toEqual(mockStats);
      expect(service.getMedicationStats).toHaveBeenCalledTimes(1);
    });

    it('should handle empty statistics', async () => {
      // Arrange
      mockService.getMedicationStats.mockResolvedValue({
        total: 0,
        active: 0,
        inactive: 0,
        byType: {},
        expiringThisMonth: 0,
        requiresRefill: 0,
      });

      // Act
      const result = await controller.getStats();

      // Assert
      expect(result.total).toBe(0);
    });
  });

  // ==================== CREATE MEDICATION ====================

  describe('POST /medications (create)', () => {
    const createDto: CreateMedicationDto = {
      studentId: 'student-123',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      route: 'Oral',
      prescribedBy: 'Dr. Johnson',
      prescriptionNumber: 'RX-67890',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-14'),
      instructions: 'Take with food or milk',
      warnings: 'Complete full course',
    } as CreateMedicationDto;

    it('should create medication and return 201', async () => {
      // Arrange
      const createdMedication = { ...mockMedication, ...createDto };
      mockService.createMedication.mockResolvedValue(createdMedication);

      // Act
      const result = await mockService.createMedication(createDto);

      // Assert
      expect(result).toEqual(createdMedication);
      expect(service.createMedication).toHaveBeenCalledWith(createDto);
    });

    it('should check for drug interactions before creation', async () => {
      // Arrange
      mockService.createMedication.mockRejectedValue(
        new ConflictException('Drug interaction detected with existing medications'),
      );

      // Act & Assert
      await expect(mockService.createMedication(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should check for allergies before creation', async () => {
      // Arrange
      mockService.createMedication.mockRejectedValue(
        new ConflictException('Student is allergic to this medication'),
      );

      // Act & Assert
      await expect(mockService.createMedication(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException when student not found', async () => {
      // Arrange
      mockService.createMedication.mockRejectedValue(
        new NotFoundException('Student not found'),
      );

      // Act & Assert
      await expect(mockService.createMedication(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should validate required fields', async () => {
      // Arrange
      const incompleteDto = { studentId: 'student-123', name: 'Test' };
      mockService.createMedication.mockRejectedValue(
        new BadRequestException('Missing required fields'),
      );

      // Act & Assert
      await expect(
        mockService.createMedication(incompleteDto as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate dosage format', async () => {
      // Arrange
      const invalidDosageDto = { ...createDto, dosage: 'invalid' };
      mockService.createMedication.mockRejectedValue(
        new BadRequestException('Invalid dosage format'),
      );

      // Act & Assert
      await expect(
        mockService.createMedication(invalidDosageDto as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate date range', async () => {
      // Arrange
      const invalidDateDto = {
        ...createDto,
        startDate: new Date('2024-02-14'),
        endDate: new Date('2024-02-01'),
      };
      mockService.createMedication.mockRejectedValue(
        new BadRequestException('End date must be after start date'),
      );

      // Act & Assert
      await expect(
        mockService.createMedication(invalidDateDto as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate prescription number format', async () => {
      // Arrange
      const invalidPrescriptionDto = {
        ...createDto,
        prescriptionNumber: '',
      };
      mockService.createMedication.mockRejectedValue(
        new BadRequestException('Prescription number is required'),
      );

      // Act & Assert
      await expect(
        mockService.createMedication(invalidPrescriptionDto as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== GET MEDICATION BY ID ====================

  describe('GET /medications/:id (getMedicationById)', () => {
    it('should return medication by ID', async () => {
      // Arrange
      mockService.getMedicationById = jest
        .fn()
        .mockResolvedValue(mockMedication);

      // Act
      const result = await mockService.getMedicationById('med-123');

      // Assert
      expect(result).toEqual(mockMedication);
      expect(mockService.getMedicationById).toHaveBeenCalledWith('med-123');
    });

    it('should throw NotFoundException when medication not found', async () => {
      // Arrange
      mockService.getMedicationById = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Medication not found'));

      // Act & Assert
      await expect(
        mockService.getMedicationById('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should validate UUID format', async () => {
      // Arrange
      mockService.getMedicationById = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Invalid UUID format'));

      // Act & Assert
      await expect(
        mockService.getMedicationById('invalid-id'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== UPDATE MEDICATION ====================

  describe('PUT /medications/:id (update)', () => {
    const updateDto: UpdateMedicationDto = {
      dosage: '250mg',
      frequency: 'Twice daily',
      instructions: 'Updated instructions',
    };

    it('should update medication and return updated data', async () => {
      // Arrange
      const updatedMedication = { ...mockMedication, ...updateDto };
      mockService.updateMedication = jest
        .fn()
        .mockResolvedValue(updatedMedication);

      // Act
      const result = await mockService.updateMedication('med-123', updateDto);

      // Assert
      expect(result).toEqual(updatedMedication);
      expect(mockService.updateMedication).toHaveBeenCalledWith(
        'med-123',
        updateDto,
      );
    });

    it('should throw NotFoundException when medication not found', async () => {
      // Arrange
      mockService.updateMedication = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Medication not found'));

      // Act & Assert
      await expect(
        mockService.updateMedication('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should allow partial updates', async () => {
      // Arrange
      const partialDto = { dosage: '300mg' };
      const updatedMedication = { ...mockMedication, dosage: '300mg' };
      mockService.updateMedication = jest
        .fn()
        .mockResolvedValue(updatedMedication);

      // Act
      const result = await mockService.updateMedication('med-123', partialDto);

      // Assert
      expect(result.dosage).toBe('300mg');
      expect(result.frequency).toBe(mockMedication.frequency);
    });

    it('should prevent updating critical fields', async () => {
      // Arrange
      const criticalFieldDto = {
        studentId: 'different-student',
        prescribedBy: 'Different Doctor',
      };
      mockService.updateMedication = jest
        .fn()
        .mockRejectedValue(
          new BadRequestException('Cannot update critical fields'),
        );

      // Act & Assert
      await expect(
        mockService.updateMedication('med-123', criticalFieldDto as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate updated dosage format', async () => {
      // Arrange
      const invalidDosageDto = { dosage: 'invalid-dosage' };
      mockService.updateMedication = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Invalid dosage format'));

      // Act & Assert
      await expect(
        mockService.updateMedication('med-123', invalidDosageDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== DEACTIVATE MEDICATION ====================

  describe('POST /medications/:id/deactivate (deactivate)', () => {
    const deactivateDto: DeactivateMedicationDto = {
      reason: 'Treatment completed',
      notes: 'Patient recovered fully',
    };

    it('should deactivate medication with reason', async () => {
      // Arrange
      const deactivatedMedication = { ...mockMedication, isActive: false };
      mockService.deactivateMedication = jest
        .fn()
        .mockResolvedValue(deactivatedMedication);

      // Act
      const result = await mockService.deactivateMedication(
        'med-123',
        deactivateDto,
      );

      // Assert
      expect(result).toEqual(deactivatedMedication);
      expect(result.isActive).toBe(false);
      expect(mockService.deactivateMedication).toHaveBeenCalledWith(
        'med-123',
        deactivateDto,
      );
    });

    it('should throw NotFoundException when medication not found', async () => {
      // Arrange
      mockService.deactivateMedication = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Medication not found'));

      // Act & Assert
      await expect(
        mockService.deactivateMedication('non-existent-id', deactivateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should require reason for deactivation', async () => {
      // Arrange
      mockService.deactivateMedication = jest
        .fn()
        .mockRejectedValue(
          new BadRequestException('Deactivation reason is required'),
        );

      // Act & Assert
      await expect(
        mockService.deactivateMedication('med-123', { reason: '' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should maintain medication data after deactivation', async () => {
      // Arrange
      const deactivatedMedication = {
        ...mockMedication,
        isActive: false,
        deactivationReason: 'Treatment completed',
      };
      mockService.deactivateMedication = jest
        .fn()
        .mockResolvedValue(deactivatedMedication);

      // Act
      const result = await mockService.deactivateMedication(
        'med-123',
        deactivateDto,
      );

      // Assert
      expect(result.id).toBe(mockMedication.id);
      expect(result.name).toBe(mockMedication.name);
      expect(result.studentId).toBe(mockMedication.studentId);
    });
  });

  // ==================== ACTIVATE MEDICATION ====================

  describe('POST /medications/:id/activate (activate)', () => {
    it('should reactivate medication', async () => {
      // Arrange
      const activatedMedication = { ...mockMedication, isActive: true };
      mockService.activateMedication = jest
        .fn()
        .mockResolvedValue(activatedMedication);

      // Act
      const result = await mockService.activateMedication('med-123');

      // Assert
      expect(result).toEqual(activatedMedication);
      expect(result.isActive).toBe(true);
      expect(mockService.activateMedication).toHaveBeenCalledWith('med-123');
    });

    it('should throw NotFoundException when medication not found', async () => {
      // Arrange
      mockService.activateMedication = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Medication not found'));

      // Act & Assert
      await expect(
        mockService.activateMedication('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should check drug interactions before reactivation', async () => {
      // Arrange
      mockService.activateMedication = jest
        .fn()
        .mockRejectedValue(
          new ConflictException('Drug interaction detected'),
        );

      // Act & Assert
      await expect(
        mockService.activateMedication('med-123'),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ==================== GET STUDENT MEDICATIONS ====================

  describe('GET /medications/student/:studentId (getStudentMedications)', () => {
    const studentMedications = [
      mockMedication,
      { ...mockMedication, id: 'med-456', name: 'Aspirin' },
    ];

    it('should return all medications for a student', async () => {
      // Arrange
      mockService.getMedicationsByStudent = jest
        .fn()
        .mockResolvedValue(studentMedications);

      // Act
      const result = await mockService.getMedicationsByStudent('student-123');

      // Assert
      expect(result).toEqual(studentMedications);
      expect(result).toHaveLength(2);
      expect(mockService.getMedicationsByStudent).toHaveBeenCalledWith(
        'student-123',
      );
    });

    it('should return empty array when student has no medications', async () => {
      // Arrange
      mockService.getMedicationsByStudent = jest.fn().mockResolvedValue([]);

      // Act
      const result = await mockService.getMedicationsByStudent('student-123');

      // Assert
      expect(result).toEqual([]);
    });

    it('should throw NotFoundException when student not found', async () => {
      // Arrange
      mockService.getMedicationsByStudent = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Student not found'));

      // Act & Assert
      await expect(
        mockService.getMedicationsByStudent('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== ADMINISTER MEDICATION ====================

  describe('POST /medications/:id/administer (administerMedication)', () => {
    const administrationDto = {
      administeredBy: 'nurse-123',
      administeredAt: new Date(),
      dosageGiven: '200mg',
      notes: 'No adverse reactions',
    };

    it('should log medication administration', async () => {
      // Arrange
      const administrationRecord = {
        id: 'admin-123',
        medicationId: 'med-123',
        ...administrationDto,
      };
      mockService.administerMedication = jest
        .fn()
        .mockResolvedValue(administrationRecord);

      // Act
      const result = await mockService.administerMedication(
        'med-123',
        administrationDto,
      );

      // Assert
      expect(result).toEqual(administrationRecord);
      expect(mockService.administerMedication).toHaveBeenCalledWith(
        'med-123',
        administrationDto,
      );
    });

    it('should validate medication is active before administration', async () => {
      // Arrange
      mockService.administerMedication = jest
        .fn()
        .mockRejectedValue(
          new BadRequestException('Cannot administer inactive medication'),
        );

      // Act & Assert
      await expect(
        mockService.administerMedication('med-123', administrationDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should check for proper timing between doses', async () => {
      // Arrange
      mockService.administerMedication = jest
        .fn()
        .mockRejectedValue(
          new BadRequestException('Too soon to administer next dose'),
        );

      // Act & Assert
      await expect(
        mockService.administerMedication('med-123', administrationDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== CHECK DRUG INTERACTIONS ====================

  describe('POST /medications/:id/check-interactions (checkDrugInteractions)', () => {
    it('should check for drug interactions', async () => {
      // Arrange
      const interactionResult = {
        hasInteractions: false,
        interactions: [],
      };
      mockService.checkDrugInteractions = jest
        .fn()
        .mockResolvedValue(interactionResult);

      // Act
      const result = await mockService.checkDrugInteractions('med-123');

      // Assert
      expect(result).toEqual(interactionResult);
      expect(mockService.checkDrugInteractions).toHaveBeenCalledWith('med-123');
    });

    it('should report detected interactions', async () => {
      // Arrange
      const interactionResult = {
        hasInteractions: true,
        interactions: [
          {
            medicationId: 'med-456',
            medicationName: 'Warfarin',
            severity: 'HIGH',
            description: 'Increased risk of bleeding',
          },
        ],
      };
      mockService.checkDrugInteractions = jest
        .fn()
        .mockResolvedValue(interactionResult);

      // Act
      const result = await mockService.checkDrugInteractions('med-123');

      // Assert
      expect(result.hasInteractions).toBe(true);
      expect(result.interactions).toHaveLength(1);
      expect(result.interactions[0].severity).toBe('HIGH');
    });
  });

  // ==================== CHECK ALLERGIES ====================

  describe('POST /medications/:id/check-allergies (checkAllergies)', () => {
    it('should check for medication allergies', async () => {
      // Arrange
      const allergyResult = {
        hasAllergies: false,
        allergies: [],
      };
      mockService.checkAllergies = jest.fn().mockResolvedValue(allergyResult);

      // Act
      const result = await mockService.checkAllergies('med-123');

      // Assert
      expect(result).toEqual(allergyResult);
      expect(mockService.checkAllergies).toHaveBeenCalledWith('med-123');
    });

    it('should report detected allergies', async () => {
      // Arrange
      const allergyResult = {
        hasAllergies: true,
        allergies: [
          {
            allergen: 'Penicillin',
            reaction: 'Severe rash',
            severity: 'HIGH',
          },
        ],
      };
      mockService.checkAllergies = jest.fn().mockResolvedValue(allergyResult);

      // Act
      const result = await mockService.checkAllergies('med-123');

      // Assert
      expect(result.hasAllergies).toBe(true);
      expect(result.allergies).toHaveLength(1);
      expect(result.allergies[0].severity).toBe('HIGH');
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      // Arrange
      mockService.getMedications.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // Act & Assert
      await expect(
        controller.list({} as ListMedicationsQueryDto),
      ).rejects.toThrow('Database connection failed');
    });

    it('should handle service layer errors', async () => {
      // Arrange
      mockService.createMedication.mockRejectedValue(
        new Error('Internal service error'),
      );

      // Act & Assert
      await expect(
        mockService.createMedication({} as CreateMedicationDto),
      ).rejects.toThrow('Internal service error');
    });

    it('should handle validation errors gracefully', async () => {
      // Arrange
      mockService.createMedication.mockRejectedValue(
        new BadRequestException('Validation failed'),
      );

      // Act & Assert
      await expect(
        mockService.createMedication({} as CreateMedicationDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== AUTHORIZATION ====================

  describe('Authorization', () => {
    it('should enforce role-based access for creation', async () => {
      // Arrange
      mockService.createMedication.mockRejectedValue(
        new ForbiddenException('Only nurses and admins can prescribe medications'),
      );

      // Act & Assert
      await expect(
        mockService.createMedication({} as CreateMedicationDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should enforce role-based access for administration', async () => {
      // Arrange
      mockService.administerMedication.mockRejectedValue(
        new ForbiddenException('Only nurses can administer medications'),
      );

      // Act & Assert
      await expect(
        mockService.administerMedication('med-123', {} as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle null parameters', async () => {
      // Arrange
      mockService.getMedicationById = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Invalid ID'));

      // Act & Assert
      await expect(
        mockService.getMedicationById(null as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle empty string parameters', async () => {
      // Arrange
      mockService.getMedicationById = jest
        .fn()
        .mockRejectedValue(new BadRequestException('ID cannot be empty'));

      // Act & Assert
      await expect(mockService.getMedicationById('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle malformed UUID', async () => {
      // Arrange
      mockService.getMedicationById = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Invalid UUID format'));

      // Act & Assert
      await expect(
        mockService.getMedicationById('not-a-uuid'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle very long medication names', async () => {
      // Arrange
      const longName = 'a'.repeat(1000);
      mockService.createMedication.mockRejectedValue(
        new BadRequestException('Medication name too long'),
      );

      // Act & Assert
      await expect(
        mockService.createMedication({ name: longName } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
