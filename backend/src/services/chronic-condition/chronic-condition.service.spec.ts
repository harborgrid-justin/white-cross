import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { ChronicConditionService } from './chronic-condition.service';
import { ChronicCondition, ConditionStatus, AccommodationType } from '@/database/models';
import { ChronicConditionCreateDto } from './dto/create-chronic-condition.dto';
import { ChronicConditionUpdateDto } from './dto/update-chronic-condition.dto';
import { ChronicConditionFiltersDto } from './dto/chronic-condition-filters.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Op } from 'sequelize';

describe('ChronicConditionService', () => {
  let service: ChronicConditionService;
  let mockModel: {
    create: jest.Mock;
    findOne: jest.Mock;
    findAll: jest.Mock;
    findAndCountAll: jest.Mock;
    count: jest.Mock;
    bulkCreate: jest.Mock;
    sequelize: {
      query: jest.Mock;
    };
  };

  const mockChronicCondition = {
    id: 'test-id-123',
    studentId: 'student-123',
    condition: 'Type 1 Diabetes',
    icdCode: 'E10',
    status: ConditionStatus.ACTIVE,
    diagnosedDate: new Date('2023-01-01'),
    diagnosedBy: 'Dr. Smith',
    carePlan: 'Monitor blood glucose levels',
    isActive: true,
    requiresIEP: true,
    requires504: false,
    medications: ['Insulin'],
    restrictions: ['No sugar'],
    triggers: ['Stress'],
    accommodations: ['Emergency glucose'],
    lastReviewDate: new Date('2023-06-01'),
    nextReviewDate: new Date('2024-01-01'),
    update: jest.fn(),
    reload: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    mockModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      count: jest.fn(),
      bulkCreate: jest.fn(),
      sequelize: {
        query: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChronicConditionService,
        {
          provide: getModelToken(ChronicCondition),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ChronicConditionService>(ChronicConditionService);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('createChronicCondition', () => {
    it('should create a chronic condition with complete data', async () => {
      const dto: ChronicConditionCreateDto = {
        studentId: 'student-123',
        condition: 'Type 1 Diabetes',
        icdCode: 'E10',
        status: ConditionStatus.ACTIVE,
        diagnosedDate: '2023-01-01',
        diagnosedBy: 'Dr. Smith',
        carePlan: 'Monitor blood glucose levels',
        requiresIEP: true,
        requires504: false,
        medications: ['Insulin'],
        restrictions: ['No sugar'],
        triggers: ['Stress'],
        accommodations: ['Emergency glucose'],
        lastReviewDate: '2023-06-01',
        nextReviewDate: '2024-01-01',
      };

      mockModel.create.mockResolvedValue(mockChronicCondition);

      const result = await service.createChronicCondition(dto);

      expect(mockModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          studentId: dto.studentId,
          condition: dto.condition,
          icdCode: dto.icdCode,
          status: dto.status,
          diagnosedBy: dto.diagnosedBy,
          carePlan: dto.carePlan,
          requiresIEP: dto.requiresIEP,
          requires504: dto.requires504,
          medications: dto.medications,
          restrictions: dto.restrictions,
          triggers: dto.triggers,
          accommodations: dto.accommodations,
          isActive: true,
        })
      );
      expect(result).toEqual(mockChronicCondition);
    });

    it('should create chronic condition with minimal data', async () => {
      const dto: ChronicConditionCreateDto = {
        studentId: 'student-123',
        condition: 'Asthma',
        icdCode: 'J45',
        status: ConditionStatus.ACTIVE,
        diagnosedDate: '2023-01-01',
        diagnosedBy: 'Dr. Smith',
      };

      const minimalCondition = {
        ...mockChronicCondition,
        ...dto,
        medications: [],
        restrictions: [],
        triggers: [],
        accommodations: [],
      };

      mockModel.create.mockResolvedValue(minimalCondition);

      const result = await service.createChronicCondition(dto);

      expect(mockModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          medications: [],
          restrictions: [],
          triggers: [],
          accommodations: [],
          isActive: true,
        })
      );
      expect(result).toEqual(minimalCondition);
    });

    it('should handle date string conversions', async () => {
      const dto: ChronicConditionCreateDto = {
        studentId: 'student-123',
        condition: 'Diabetes',
        icdCode: 'E10',
        status: ConditionStatus.ACTIVE,
        diagnosedDate: '2023-01-01T00:00:00.000Z',
        diagnosedBy: 'Dr. Smith',
        lastReviewDate: '2023-06-01T00:00:00.000Z',
        nextReviewDate: '2024-01-01T00:00:00.000Z',
      };

      mockModel.create.mockResolvedValue(mockChronicCondition);

      await service.createChronicCondition(dto);

      expect(mockModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          diagnosedDate: expect.any(Date),
          lastReviewDate: expect.any(Date),
          nextReviewDate: expect.any(Date),
        })
      );
    });

    it('should handle creation errors', async () => {
      const dto: ChronicConditionCreateDto = {
        studentId: 'student-123',
        condition: 'Diabetes',
        icdCode: 'E10',
        status: ConditionStatus.ACTIVE,
        diagnosedDate: '2023-01-01',
        diagnosedBy: 'Dr. Smith',
      };

      mockModel.create.mockRejectedValue(new Error('Database constraint violation'));

      await expect(service.createChronicCondition(dto)).rejects.toThrow('Database constraint violation');
    });
  });

  describe('getChronicConditionById', () => {
    it('should retrieve a chronic condition by ID', async () => {
      mockModel.findOne.mockResolvedValue(mockChronicCondition);

      const result = await service.getChronicConditionById('test-id-123');

      expect(mockModel.findOne).toHaveBeenCalledWith({ where: { id: 'test-id-123' } });
      expect(result).toEqual(mockChronicCondition);
    });

    it('should throw NotFoundException when condition not found', async () => {
      mockModel.findOne.mockResolvedValue(null);

      await expect(service.getChronicConditionById('non-existent')).rejects.toThrow(NotFoundException);
      await expect(service.getChronicConditionById('non-existent')).rejects.toThrow(
        'Chronic condition with ID non-existent not found'
      );
    });
  });

  describe('getStudentChronicConditions', () => {
    it('should retrieve all active conditions for a student', async () => {
      const conditions = [mockChronicCondition];
      mockModel.findAll.mockResolvedValue(conditions);

      const result = await service.getStudentChronicConditions('student-123', false);

      expect(mockModel.findAll).toHaveBeenCalledWith({
        where: { studentId: 'student-123', isActive: true },
        order: [
          ['status', 'ASC'],
          ['diagnosedDate', 'DESC'],
        ],
      });
      expect(result).toEqual(conditions);
    });

    it('should include inactive conditions when specified', async () => {
      const conditions = [mockChronicCondition, { ...mockChronicCondition, isActive: false }];
      mockModel.findAll.mockResolvedValue(conditions);

      const result = await service.getStudentChronicConditions('student-123', true);

      expect(mockModel.findAll).toHaveBeenCalledWith({
        where: { studentId: 'student-123' },
        order: [
          ['status', 'ASC'],
          ['diagnosedDate', 'DESC'],
        ],
      });
      expect(result).toEqual(conditions);
    });

    it('should return empty array for student with no conditions', async () => {
      mockModel.findAll.mockResolvedValue([]);

      const result = await service.getStudentChronicConditions('student-without-conditions');

      expect(result).toEqual([]);
    });
  });

  describe('updateChronicCondition', () => {
    it('should update a chronic condition', async () => {
      const dto: ChronicConditionUpdateDto = {
        carePlan: 'Updated care plan',
        status: ConditionStatus.MONITORING,
      };

      mockModel.findOne.mockResolvedValue(mockChronicCondition);
      mockChronicCondition.update.mockResolvedValue(undefined);
      mockChronicCondition.reload.mockResolvedValue({
        ...mockChronicCondition,
        ...dto,
      });

      const result = await service.updateChronicCondition('test-id-123', dto);

      expect(mockModel.findOne).toHaveBeenCalledWith({ where: { id: 'test-id-123' } });
      expect(mockChronicCondition.update).toHaveBeenCalledWith(dto);
      expect(mockChronicCondition.reload).toHaveBeenCalled();
    });

    it('should handle date conversions in updates', async () => {
      const dto: ChronicConditionUpdateDto = {
        diagnosedDate: '2023-02-01',
        lastReviewDate: '2023-07-01',
        nextReviewDate: '2024-02-01',
      };

      mockModel.findOne.mockResolvedValue(mockChronicCondition);
      mockChronicCondition.update.mockResolvedValue(undefined);
      mockChronicCondition.reload.mockResolvedValue(mockChronicCondition);

      await service.updateChronicCondition('test-id-123', dto);

      expect(mockChronicCondition.update).toHaveBeenCalledWith({
        diagnosedDate: expect.any(Date),
        lastReviewDate: expect.any(Date),
        nextReviewDate: expect.any(Date),
      });
    });

    it('should throw NotFoundException for non-existent condition', async () => {
      mockModel.findOne.mockResolvedValue(null);

      await expect(
        service.updateChronicCondition('non-existent', { carePlan: 'New plan' })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivateChronicCondition', () => {
    it('should deactivate a chronic condition', async () => {
      mockModel.findOne.mockResolvedValue(mockChronicCondition);
      mockChronicCondition.update.mockResolvedValue(undefined);

      const result = await service.deactivateChronicCondition('test-id-123');

      expect(mockChronicCondition.update).toHaveBeenCalledWith({
        status: ConditionStatus.RESOLVED,
        isActive: false,
      });
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException for non-existent condition', async () => {
      mockModel.findOne.mockResolvedValue(null);

      await expect(service.deactivateChronicCondition('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteChronicCondition', () => {
    it('should permanently delete a chronic condition', async () => {
      mockModel.findOne.mockResolvedValue(mockChronicCondition);
      mockChronicCondition.destroy.mockResolvedValue(undefined);

      const result = await service.deleteChronicCondition('test-id-123');

      expect(mockChronicCondition.destroy).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException for non-existent condition', async () => {
      mockModel.findOne.mockResolvedValue(null);

      await expect(service.deleteChronicCondition('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchChronicConditions', () => {
    it('should search with filters and pagination', async () => {
      const filters: ChronicConditionFiltersDto = {
        studentId: 'student-123',
        status: ConditionStatus.ACTIVE,
      };
      const pagination: PaginationDto = { page: 1, limit: 20 };

      mockModel.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [mockChronicCondition],
      });

      const result = await service.searchChronicConditions(filters, pagination);

      expect(mockModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          studentId: 'student-123',
          status: ConditionStatus.ACTIVE,
        },
        order: [
          ['status', 'ASC'],
          ['nextReviewDate', 'ASC'],
          ['diagnosedDate', 'DESC'],
        ],
        offset: 0,
        limit: 20,
      });
      expect(result).toEqual({
        conditions: [mockChronicCondition],
        total: 1,
        page: 1,
        pages: 1,
      });
    });

    it('should handle search with text term', async () => {
      const filters: ChronicConditionFiltersDto = {
        searchTerm: 'diabetes',
      };
      const pagination: PaginationDto = { page: 1, limit: 20 };

      mockModel.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [mockChronicCondition],
      });

      await service.searchChronicConditions(filters, pagination);

      expect(mockModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            [Op.or]: expect.arrayContaining([
              { condition: { [Op.iLike]: '%diabetes%' } },
              { icdCode: { [Op.iLike]: '%diabetes%' } },
              { notes: { [Op.iLike]: '%diabetes%' } },
              { carePlan: { [Op.iLike]: '%diabetes%' } },
            ]),
          }),
        })
      );
    });

    it('should handle reviewDueSoon filter', async () => {
      const filters: ChronicConditionFiltersDto = {
        reviewDueSoon: true,
      };
      const pagination: PaginationDto = { page: 1, limit: 20 };

      mockModel.findAndCountAll.mockResolvedValue({
        count: 0,
        rows: [],
      });

      await service.searchChronicConditions(filters, pagination);

      expect(mockModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            nextReviewDate: expect.objectContaining({
              [Op.between]: expect.any(Array),
            }),
          }),
        })
      );
    });

    it('should handle pagination correctly', async () => {
      const filters: ChronicConditionFiltersDto = {};
      const pagination: PaginationDto = { page: 3, limit: 10 };

      mockModel.findAndCountAll.mockResolvedValue({
        count: 25,
        rows: [],
      });

      const result = await service.searchChronicConditions(filters, pagination);

      expect(mockModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          offset: 20, // (page 3 - 1) * limit 10
          limit: 10,
        })
      );
      expect(result.pages).toBe(3); // ceil(25 / 10)
    });
  });

  describe('getConditionsRequiringReview', () => {
    it('should get conditions due for review within default days', async () => {
      mockModel.findAll.mockResolvedValue([mockChronicCondition]);

      const result = await service.getConditionsRequiringReview(30);

      expect(mockModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
            nextReviewDate: {
              [Op.between]: expect.any(Array),
            },
          }),
          order: [['nextReviewDate', 'ASC']],
        })
      );
      expect(result).toEqual([mockChronicCondition]);
    });

    it('should handle custom days ahead', async () => {
      mockModel.findAll.mockResolvedValue([]);

      await service.getConditionsRequiringReview(60);

      expect(mockModel.findAll).toHaveBeenCalled();
    });
  });

  describe('getConditionsRequiringAccommodations', () => {
    it('should get conditions requiring IEP', async () => {
      mockModel.findAll.mockResolvedValue([mockChronicCondition]);

      const result = await service.getConditionsRequiringAccommodations(AccommodationType.IEP);

      expect(mockModel.findAll).toHaveBeenCalledWith({
        where: { isActive: true, requiresIEP: true },
        order: [['condition', 'ASC']],
      });
      expect(result).toEqual([mockChronicCondition]);
    });

    it('should get conditions requiring 504 plan', async () => {
      mockModel.findAll.mockResolvedValue([]);

      await service.getConditionsRequiringAccommodations(AccommodationType.PLAN_504);

      expect(mockModel.findAll).toHaveBeenCalledWith({
        where: { isActive: true, requires504: true },
        order: [['condition', 'ASC']],
      });
    });

    it('should get conditions requiring both accommodations', async () => {
      mockModel.findAll.mockResolvedValue([mockChronicCondition]);

      await service.getConditionsRequiringAccommodations(AccommodationType.BOTH);

      expect(mockModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
            [Op.or]: [{ requiresIEP: true }, { requires504: true }],
          }),
        })
      );
    });
  });

  describe('getChronicConditionStatistics', () => {
    it('should get comprehensive statistics', async () => {
      mockModel.count.mockResolvedValueOnce(10); // total
      mockModel.sequelize.query.mockResolvedValue([
        [
          { status: ConditionStatus.ACTIVE, count: '7' },
          { status: ConditionStatus.MONITORING, count: '2' },
          { status: ConditionStatus.RESOLVED, count: '1' },
        ],
      ]);
      mockModel.count.mockResolvedValueOnce(5); // requiresIEP
      mockModel.count.mockResolvedValueOnce(3); // requires504
      mockModel.count.mockResolvedValueOnce(2); // reviewDueSoon
      mockModel.count.mockResolvedValueOnce(7); // activeConditions

      const result = await service.getChronicConditionStatistics();

      expect(result).toEqual({
        total: 10,
        byStatus: {
          [ConditionStatus.ACTIVE]: 7,
          [ConditionStatus.MONITORING]: 2,
          [ConditionStatus.RESOLVED]: 1,
        },
        requiresIEP: 5,
        requires504: 3,
        reviewDueSoon: 2,
        activeConditions: 7,
      });
    });

    it('should get statistics with student filter', async () => {
      const filters: ChronicConditionFiltersDto = { studentId: 'student-123' };

      mockModel.count.mockResolvedValue(2);
      mockModel.sequelize.query.mockResolvedValue([[{ status: ConditionStatus.ACTIVE, count: '2' }]]);

      await service.getChronicConditionStatistics(filters);

      expect(mockModel.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('AND student_id = $studentId'),
        expect.objectContaining({
          bind: { studentId: 'student-123' },
        })
      );
    });
  });

  describe('updateCarePlan', () => {
    it('should update care plan and set last review date', async () => {
      mockModel.findOne.mockResolvedValue(mockChronicCondition);
      mockChronicCondition.update.mockResolvedValue(undefined);
      mockChronicCondition.reload.mockResolvedValue({
        ...mockChronicCondition,
        carePlan: 'New care plan',
      });

      const result = await service.updateCarePlan('test-id-123', 'New care plan');

      expect(mockChronicCondition.update).toHaveBeenCalledWith(
        expect.objectContaining({
          carePlan: 'New care plan',
          lastReviewDate: expect.any(String),
        })
      );
    });
  });

  describe('bulkCreateChronicConditions', () => {
    it('should bulk create multiple conditions', async () => {
      const conditions: ChronicConditionCreateDto[] = [
        {
          studentId: 'student-1',
          condition: 'Asthma',
          icdCode: 'J45',
          status: ConditionStatus.ACTIVE,
          diagnosedDate: '2023-01-01',
          diagnosedBy: 'Dr. Smith',
        },
        {
          studentId: 'student-2',
          condition: 'Epilepsy',
          icdCode: 'G40',
          status: ConditionStatus.ACTIVE,
          diagnosedDate: '2023-02-01',
          diagnosedBy: 'Dr. Jones',
        },
      ];

      const createdConditions = conditions.map((dto) => ({
        ...mockChronicCondition,
        ...dto,
      }));

      mockModel.bulkCreate.mockResolvedValue(createdConditions);

      const result = await service.bulkCreateChronicConditions(conditions);

      expect(mockModel.bulkCreate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            studentId: 'student-1',
            condition: 'Asthma',
            isActive: true,
          }),
          expect.objectContaining({
            studentId: 'student-2',
            condition: 'Epilepsy',
            isActive: true,
          }),
        ])
      );
      expect(result).toHaveLength(2);
    });

    it('should handle bulk create errors', async () => {
      const conditions: ChronicConditionCreateDto[] = [
        {
          studentId: 'student-1',
          condition: 'Asthma',
          icdCode: 'J45',
          status: ConditionStatus.ACTIVE,
          diagnosedDate: '2023-01-01',
          diagnosedBy: 'Dr. Smith',
        },
      ];

      mockModel.bulkCreate.mockRejectedValue(new Error('Bulk insert failed'));

      await expect(service.bulkCreateChronicConditions(conditions)).rejects.toThrow('Bulk insert failed');
    });
  });

  describe('findByIds', () => {
    it('should batch find conditions by IDs in correct order', async () => {
      const ids = ['id-1', 'id-2', 'id-3'];
      const conditions = [
        { ...mockChronicCondition, id: 'id-2' },
        { ...mockChronicCondition, id: 'id-1' },
      ];

      mockModel.findAll.mockResolvedValue(conditions);

      const result = await service.findByIds(ids);

      expect(mockModel.findAll).toHaveBeenCalledWith({
        where: { id: { [Op.in]: ids } },
      });
      expect(result).toHaveLength(3);
      expect(result[0]?.id).toBe('id-1');
      expect(result[1]?.id).toBe('id-2');
      expect(result[2]).toBeNull();
    });

    it('should handle empty IDs array', async () => {
      mockModel.findAll.mockResolvedValue([]);

      const result = await service.findByIds([]);

      expect(result).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      mockModel.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.findByIds(['id-1'])).rejects.toThrow('Failed to batch fetch chronic conditions');
    });
  });

  describe('findByStudentIds', () => {
    it('should batch find conditions by student IDs', async () => {
      const studentIds = ['student-1', 'student-2'];
      const conditions = [
        { ...mockChronicCondition, studentId: 'student-1' },
        { ...mockChronicCondition, studentId: 'student-1' },
        { ...mockChronicCondition, studentId: 'student-2' },
      ];

      mockModel.findAll.mockResolvedValue(conditions);

      const result = await service.findByStudentIds(studentIds);

      expect(mockModel.findAll).toHaveBeenCalledWith({
        where: { studentId: { [Op.in]: studentIds }, isActive: true },
        order: [
          ['status', 'ASC'],
          ['diagnosedDate', 'DESC'],
        ],
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(2); // student-1 has 2 conditions
      expect(result[1]).toHaveLength(1); // student-2 has 1 condition
    });

    it('should return empty arrays for students with no conditions', async () => {
      mockModel.findAll.mockResolvedValue([]);

      const result = await service.findByStudentIds(['student-no-conditions']);

      expect(result).toEqual([[]]);
    });

    it('should handle errors gracefully', async () => {
      mockModel.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.findByStudentIds(['student-1'])).rejects.toThrow(
        'Failed to batch fetch chronic conditions by student IDs'
      );
    });
  });
});
