/**
 * @fileoverview Chronic Condition Service Unit Tests
 * @module chronic-condition/__tests__
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { ChronicConditionService } from '../chronic-condition.service';
import { ChronicCondition, ConditionStatus } from '@/database/models';

describe('ChronicConditionService', () => {
  let service: ChronicConditionService;
  let mockChronicConditionModel: any;

  const mockCondition = {
    id: 'condition-1',
    studentId: 'student-1',
    condition: 'Asthma',
    diagnosedDate: new Date('2023-01-15'),
    diagnosedBy: 'Dr. Smith',
    status: ConditionStatus.ACTIVE,
    severity: 'Moderate',
    medications: ['Albuterol Inhaler'],
    restrictions: ['No outdoor activity during high pollen count'],
    triggers: ['Exercise', 'Pollen'],
    accommodations: ['Access to inhaler at all times'],
    isActive: true,
    lastReviewDate: new Date('2024-06-01'),
    nextReviewDate: new Date('2025-06-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockChronicConditionModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      findAndCountAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChronicConditionService,
        {
          provide: getModelToken(ChronicCondition),
          useValue: mockChronicConditionModel,
        },
      ],
    }).compile();

    service = module.get<ChronicConditionService>(ChronicConditionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Definition', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('createChronicCondition', () => {
    it('should create a chronic condition successfully', async () => {
      const createDto = {
        studentId: 'student-1',
        condition: 'Asthma',
        diagnosedDate: '2023-01-15',
        diagnosedBy: 'Dr. Smith',
        status: ConditionStatus.ACTIVE,
        severity: 'Moderate',
        medications: ['Albuterol Inhaler'],
        restrictions: ['No outdoor activity during high pollen count'],
        triggers: ['Exercise', 'Pollen'],
        accommodations: ['Access to inhaler at all times'],
      };

      mockChronicConditionModel.create.mockResolvedValueOnce(mockCondition);

      const result = await service.createChronicCondition(createDto);

      expect(mockChronicConditionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          studentId: 'student-1',
          condition: 'Asthma',
          isActive: true,
        })
      );
      expect(result).toEqual(mockCondition);
    });

    it('should handle date conversion for diagnosedDate', async () => {
      const createDto = {
        studentId: 'student-1',
        condition: 'Diabetes Type 1',
        diagnosedDate: '2022-05-10',
        diagnosedBy: 'Dr. Johnson',
        status: ConditionStatus.ACTIVE,
        severity: 'High',
      };

      mockChronicConditionModel.create.mockResolvedValueOnce(mockCondition);

      await service.createChronicCondition(createDto);

      expect(mockChronicConditionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          diagnosedDate: expect.any(Date),
        })
      );
    });

    it('should set default empty arrays for optional fields', async () => {
      const createDto = {
        studentId: 'student-1',
        condition: 'Epilepsy',
        diagnosedDate: '2023-03-20',
        diagnosedBy: 'Dr. Williams',
        status: ConditionStatus.ACTIVE,
        severity: 'Moderate',
      };

      mockChronicConditionModel.create.mockResolvedValueOnce(mockCondition);

      await service.createChronicCondition(createDto);

      expect(mockChronicConditionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          medications: [],
          restrictions: [],
          triggers: [],
          accommodations: [],
        })
      );
    });

    it('should handle creation errors', async () => {
      const createDto = {
        studentId: 'student-1',
        condition: 'Asthma',
        diagnosedDate: '2023-01-15',
        diagnosedBy: 'Dr. Smith',
        status: ConditionStatus.ACTIVE,
        severity: 'Moderate',
      };

      mockChronicConditionModel.create.mockRejectedValueOnce(
        new Error('Database error')
      );

      await expect(service.createChronicCondition(createDto)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getChronicConditionById', () => {
    it('should retrieve a chronic condition by ID', async () => {
      mockChronicConditionModel.findOne.mockResolvedValueOnce(mockCondition);

      const result = await service.getChronicConditionById('condition-1');

      expect(mockChronicConditionModel.findOne).toHaveBeenCalledWith({
        where: { id: 'condition-1' },
      });
      expect(result).toEqual(mockCondition);
    });

    it('should throw NotFoundException when condition not found', async () => {
      mockChronicConditionModel.findOne.mockResolvedValueOnce(null);

      await expect(
        service.getChronicConditionById('non-existent-id')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStudentChronicConditions', () => {
    it('should retrieve all active conditions for a student', async () => {
      const conditions = [mockCondition];
      mockChronicConditionModel.findAll.mockResolvedValueOnce(conditions);

      const result = await service.getStudentChronicConditions('student-1');

      expect(mockChronicConditionModel.findAll).toHaveBeenCalledWith({
        where: { studentId: 'student-1', isActive: true },
      });
      expect(result).toEqual(conditions);
    });

    it('should retrieve all conditions including inactive when specified', async () => {
      const conditions = [mockCondition];
      mockChronicConditionModel.findAll.mockResolvedValueOnce(conditions);

      const result = await service.getStudentChronicConditions('student-1', true);

      expect(mockChronicConditionModel.findAll).toHaveBeenCalledWith({
        where: { studentId: 'student-1' },
      });
      expect(result).toEqual(conditions);
    });
  });

  describe('updateChronicCondition', () => {
    it('should update a chronic condition successfully', async () => {
      const updateDto = {
        severity: 'High',
        medications: ['Albuterol Inhaler', 'Montelukast'],
        lastReviewDate: '2024-11-01',
      };

      const updatedCondition = { ...mockCondition, ...updateDto };
      mockChronicConditionModel.findOne.mockResolvedValueOnce(mockCondition);
      mockChronicConditionModel.update.mockResolvedValueOnce([1]);
      mockChronicConditionModel.findOne.mockResolvedValueOnce(updatedCondition);

      const result = await service.updateChronicCondition('condition-1', updateDto);

      expect(mockChronicConditionModel.update).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'High',
        }),
        { where: { id: 'condition-1' } }
      );
      expect(result).toEqual(updatedCondition);
    });

    it('should throw NotFoundException when updating non-existent condition', async () => {
      mockChronicConditionModel.findOne.mockResolvedValueOnce(null);

      await expect(
        service.updateChronicCondition('non-existent-id', { severity: 'High' })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchChronicConditions', () => {
    it('should search conditions with filters', async () => {
      const filters = {
        condition: 'Asthma',
        status: ConditionStatus.ACTIVE,
        severity: 'Moderate',
      };

      const mockResults = {
        rows: [mockCondition],
        count: 1,
      };

      mockChronicConditionModel.findAndCountAll.mockResolvedValueOnce(mockResults);

      const result = await service.searchChronicConditions(filters, { page: 1, limit: 10 });

      expect(mockChronicConditionModel.findAndCountAll).toHaveBeenCalled();
      expect(result.data).toEqual([mockCondition]);
      expect(result.total).toBe(1);
    });

    it('should handle empty search results', async () => {
      const filters = { condition: 'Rare Disease' };

      mockChronicConditionModel.findAndCountAll.mockResolvedValueOnce({
        rows: [],
        count: 0,
      });

      const result = await service.searchChronicConditions(filters, { page: 1, limit: 10 });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('deactivateChronicCondition', () => {
    it('should deactivate a chronic condition', async () => {
      mockChronicConditionModel.findOne.mockResolvedValueOnce(mockCondition);
      mockChronicConditionModel.update.mockResolvedValueOnce([1]);

      const deactivated = { ...mockCondition, isActive: false };
      mockChronicConditionModel.findOne.mockResolvedValueOnce(deactivated);

      const result = await service.deactivateChronicCondition('condition-1', 'Condition resolved');

      expect(mockChronicConditionModel.update).toHaveBeenCalledWith(
        expect.objectContaining({
          isActive: false,
          status: ConditionStatus.RESOLVED,
        }),
        { where: { id: 'condition-1' } }
      );
      expect(result.isActive).toBe(false);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics for conditions', async () => {
      mockChronicConditionModel.count.mockResolvedValueOnce(50); // Total active
      mockChronicConditionModel.findAll.mockResolvedValueOnce([
        { condition: 'Asthma', count: 20 },
        { condition: 'Diabetes', count: 15 },
        { condition: 'Epilepsy', count: 10 },
      ]);
      mockChronicConditionModel.count.mockResolvedValueOnce(25); // Needs review

      const stats = await service.getStatistics();

      expect(stats).toHaveProperty('totalActive');
      expect(stats).toHaveProperty('conditionBreakdown');
      expect(stats).toHaveProperty('needsReview');
    });
  });

  describe('bulkImport', () => {
    it('should import multiple chronic conditions', async () => {
      const conditions = [
        {
          studentId: 'student-1',
          condition: 'Asthma',
          diagnosedDate: '2023-01-15',
          diagnosedBy: 'Dr. Smith',
          status: ConditionStatus.ACTIVE,
          severity: 'Moderate',
        },
        {
          studentId: 'student-2',
          condition: 'Diabetes',
          diagnosedDate: '2022-06-20',
          diagnosedBy: 'Dr. Johnson',
          status: ConditionStatus.ACTIVE,
          severity: 'High',
        },
      ];

      mockChronicConditionModel.create
        .mockResolvedValueOnce({ ...conditions[0], id: 'condition-1' })
        .mockResolvedValueOnce({ ...conditions[1], id: 'condition-2' });

      const result = await service.bulkImportChronicConditions(conditions);

      expect(result.successful).toBe(2);
      expect(result.failed).toBe(0);
      expect(result.total).toBe(2);
    });

    it('should handle partial failures in bulk import', async () => {
      const conditions = [
        {
          studentId: 'student-1',
          condition: 'Asthma',
          diagnosedDate: '2023-01-15',
          diagnosedBy: 'Dr. Smith',
          status: ConditionStatus.ACTIVE,
          severity: 'Moderate',
        },
        {
          studentId: 'student-2',
          condition: 'Invalid',
          diagnosedDate: '2022-06-20',
          diagnosedBy: 'Dr. Johnson',
          status: ConditionStatus.ACTIVE,
          severity: 'High',
        },
      ];

      mockChronicConditionModel.create
        .mockResolvedValueOnce({ ...conditions[0], id: 'condition-1' })
        .mockRejectedValueOnce(new Error('Validation error'));

      const result = await service.bulkImportChronicConditions(conditions);

      expect(result.successful).toBe(1);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
    });
  });
});
