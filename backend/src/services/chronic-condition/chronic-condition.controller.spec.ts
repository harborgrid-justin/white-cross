import { Test, TestingModule } from '@nestjs/testing';
import { ChronicConditionController } from './chronic-condition.controller';
import { ChronicConditionService } from './chronic-condition.service';
import { ChronicConditionCreateDto } from './dto/create-chronic-condition.dto';
import { ChronicConditionUpdateDto } from './dto/update-chronic-condition.dto';
import { ChronicConditionFiltersDto } from './dto/chronic-condition-filters.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateCarePlanDto } from './dto/update-care-plan.dto';
import { AccommodationType } from './enums/accommodation-type.enum';
import { ConditionStatus } from '@/database/models';

describe('ChronicConditionController', () => {
  let controller: ChronicConditionController;
  let service: jest.Mocked<ChronicConditionService>;

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
    lastReviewDate: new Date('2023-06-01'),
    nextReviewDate: new Date('2024-01-01'),
  };

  const mockService = {
    createChronicCondition: jest.fn(),
    getChronicConditionById: jest.fn(),
    getStudentChronicConditions: jest.fn(),
    updateChronicCondition: jest.fn(),
    deactivateChronicCondition: jest.fn(),
    deleteChronicCondition: jest.fn(),
    searchChronicConditions: jest.fn(),
    getConditionsRequiringReview: jest.fn(),
    getConditionsRequiringAccommodations: jest.fn(),
    getChronicConditionStatistics: jest.fn(),
    updateCarePlan: jest.fn(),
    bulkCreateChronicConditions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChronicConditionController],
      providers: [
        {
          provide: ChronicConditionService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ChronicConditionController>(ChronicConditionController);
    service = module.get(ChronicConditionService) as jest.Mocked<ChronicConditionService>;

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new chronic condition', async () => {
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
      };

      service.createChronicCondition.mockResolvedValue(mockChronicCondition as never);

      const result = await controller.create(dto);

      expect(service.createChronicCondition).toHaveBeenCalledWith(dto);
      expect(service.createChronicCondition).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockChronicCondition);
    });

    it('should handle service errors during creation', async () => {
      const dto: ChronicConditionCreateDto = {
        studentId: 'student-123',
        condition: 'Type 1 Diabetes',
        icdCode: 'E10',
        status: ConditionStatus.ACTIVE,
        diagnosedDate: '2023-01-01',
        diagnosedBy: 'Dr. Smith',
      };

      service.createChronicCondition.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(dto)).rejects.toThrow('Database error');
      expect(service.createChronicCondition).toHaveBeenCalledWith(dto);
    });
  });

  describe('findOne', () => {
    it('should retrieve a chronic condition by ID', async () => {
      service.getChronicConditionById.mockResolvedValue(mockChronicCondition as never);

      const result = await controller.findOne('test-id-123');

      expect(service.getChronicConditionById).toHaveBeenCalledWith('test-id-123');
      expect(result).toEqual(mockChronicCondition);
    });

    it('should handle not found errors', async () => {
      service.getChronicConditionById.mockRejectedValue(new Error('Chronic condition with ID invalid-id not found'));

      await expect(controller.findOne('invalid-id')).rejects.toThrow();
    });
  });

  describe('findByStudent', () => {
    it('should retrieve all chronic conditions for a student', async () => {
      const conditions = [mockChronicCondition];
      service.getStudentChronicConditions.mockResolvedValue(conditions as never);

      const result = await controller.findByStudent('student-123', undefined);

      expect(service.getStudentChronicConditions).toHaveBeenCalledWith('student-123', false);
      expect(result).toEqual(conditions);
    });

    it('should include inactive conditions when specified', async () => {
      const conditions = [mockChronicCondition, { ...mockChronicCondition, isActive: false }];
      service.getStudentChronicConditions.mockResolvedValue(conditions as never);

      const result = await controller.findByStudent('student-123', true);

      expect(service.getStudentChronicConditions).toHaveBeenCalledWith('student-123', true);
      expect(result).toEqual(conditions);
    });

    it('should handle string "true" for includeInactive parameter', async () => {
      service.getStudentChronicConditions.mockResolvedValue([mockChronicCondition] as never);

      await controller.findByStudent('student-123', 'true' as unknown as boolean);

      expect(service.getStudentChronicConditions).toHaveBeenCalledWith('student-123', true);
    });

    it('should return empty array for student with no conditions', async () => {
      service.getStudentChronicConditions.mockResolvedValue([]);

      const result = await controller.findByStudent('student-without-conditions', false);

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a chronic condition', async () => {
      const dto: ChronicConditionUpdateDto = {
        carePlan: 'Updated care plan',
        status: ConditionStatus.MONITORING,
      };
      const updatedCondition = { ...mockChronicCondition, ...dto };

      service.updateChronicCondition.mockResolvedValue(updatedCondition as never);

      const result = await controller.update('test-id-123', dto);

      expect(service.updateChronicCondition).toHaveBeenCalledWith('test-id-123', dto);
      expect(result).toEqual(updatedCondition);
    });

    it('should handle update of non-existent condition', async () => {
      const dto: ChronicConditionUpdateDto = { carePlan: 'New plan' };
      service.updateChronicCondition.mockRejectedValue(new Error('Chronic condition with ID invalid not found'));

      await expect(controller.update('invalid', dto)).rejects.toThrow();
    });
  });

  describe('deactivate', () => {
    it('should deactivate a chronic condition', async () => {
      service.deactivateChronicCondition.mockResolvedValue({ success: true });

      const result = await controller.deactivate('test-id-123');

      expect(service.deactivateChronicCondition).toHaveBeenCalledWith('test-id-123');
      expect(result).toEqual({ success: true });
    });

    it('should handle deactivation of non-existent condition', async () => {
      service.deactivateChronicCondition.mockRejectedValue(new Error('Chronic condition with ID invalid not found'));

      await expect(controller.deactivate('invalid')).rejects.toThrow();
    });
  });

  describe('permanentDelete', () => {
    it('should permanently delete a chronic condition', async () => {
      service.deleteChronicCondition.mockResolvedValue({ success: true });

      const result = await controller.permanentDelete('test-id-123');

      expect(service.deleteChronicCondition).toHaveBeenCalledWith('test-id-123');
      expect(result).toEqual({ success: true });
    });
  });

  describe('search', () => {
    it('should search chronic conditions with filters and pagination', async () => {
      const filters: ChronicConditionFiltersDto = {
        studentId: 'student-123',
        status: ConditionStatus.ACTIVE,
      };
      const pagination: PaginationDto = { page: 1, limit: 20 };
      const searchResult = {
        conditions: [mockChronicCondition],
        total: 1,
        page: 1,
        pages: 1,
      };

      service.searchChronicConditions.mockResolvedValue(searchResult as never);

      const result = await controller.search(filters, pagination);

      expect(service.searchChronicConditions).toHaveBeenCalledWith(filters, pagination);
      expect(result).toEqual(searchResult);
    });

    it('should handle search with no results', async () => {
      const filters: ChronicConditionFiltersDto = { studentId: 'non-existent' };
      const pagination: PaginationDto = { page: 1, limit: 20 };
      const searchResult = {
        conditions: [],
        total: 0,
        page: 1,
        pages: 0,
      };

      service.searchChronicConditions.mockResolvedValue(searchResult as never);

      const result = await controller.search(filters, pagination);

      expect(result.conditions).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle complex search criteria', async () => {
      const filters: ChronicConditionFiltersDto = {
        searchTerm: 'diabetes',
        requiresIEP: true,
        isActive: true,
        reviewDueSoon: true,
      };
      const pagination: PaginationDto = { page: 2, limit: 10 };

      service.searchChronicConditions.mockResolvedValue({
        conditions: [mockChronicCondition],
        total: 15,
        page: 2,
        pages: 2,
      } as never);

      const result = await controller.search(filters, pagination);

      expect(service.searchChronicConditions).toHaveBeenCalledWith(filters, pagination);
      expect(result.page).toBe(2);
    });
  });

  describe('getReviewsDue', () => {
    it('should get conditions requiring review with default days ahead', async () => {
      service.getConditionsRequiringReview.mockResolvedValue([mockChronicCondition] as never);

      const result = await controller.getReviewsDue(undefined);

      expect(service.getConditionsRequiringReview).toHaveBeenCalledWith(30);
      expect(result).toEqual([mockChronicCondition]);
    });

    it('should get conditions requiring review with custom days ahead', async () => {
      service.getConditionsRequiringReview.mockResolvedValue([mockChronicCondition] as never);

      const result = await controller.getReviewsDue(60);

      expect(service.getConditionsRequiringReview).toHaveBeenCalledWith(60);
    });

    it('should handle string days ahead parameter', async () => {
      service.getConditionsRequiringReview.mockResolvedValue([mockChronicCondition] as never);

      await controller.getReviewsDue('45' as unknown as number);

      expect(service.getConditionsRequiringReview).toHaveBeenCalledWith(45);
    });
  });

  describe('getAccommodations', () => {
    it('should get conditions requiring IEP accommodations', async () => {
      service.getConditionsRequiringAccommodations.mockResolvedValue([mockChronicCondition] as never);

      const result = await controller.getAccommodations(AccommodationType.IEP);

      expect(service.getConditionsRequiringAccommodations).toHaveBeenCalledWith(AccommodationType.IEP);
      expect(result).toEqual([mockChronicCondition]);
    });

    it('should get conditions requiring 504 accommodations', async () => {
      const condition504 = { ...mockChronicCondition, requiresIEP: false, requires504: true };
      service.getConditionsRequiringAccommodations.mockResolvedValue([condition504] as never);

      const result = await controller.getAccommodations(AccommodationType.PLAN_504);

      expect(service.getConditionsRequiringAccommodations).toHaveBeenCalledWith(AccommodationType.PLAN_504);
    });

    it('should get conditions requiring both accommodations', async () => {
      service.getConditionsRequiringAccommodations.mockResolvedValue([mockChronicCondition] as never);

      await controller.getAccommodations(AccommodationType.BOTH);

      expect(service.getConditionsRequiringAccommodations).toHaveBeenCalledWith(AccommodationType.BOTH);
    });
  });

  describe('getStatistics', () => {
    it('should get chronic condition statistics', async () => {
      const stats = {
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
      };

      service.getChronicConditionStatistics.mockResolvedValue(stats);

      const result = await controller.getStatistics(undefined);

      expect(service.getChronicConditionStatistics).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(stats);
    });

    it('should get statistics with filters', async () => {
      const filters: ChronicConditionFiltersDto = { studentId: 'student-123' };
      const stats = {
        total: 2,
        byStatus: { [ConditionStatus.ACTIVE]: 2 },
        requiresIEP: 1,
        requires504: 0,
        reviewDueSoon: 1,
        activeConditions: 2,
      };

      service.getChronicConditionStatistics.mockResolvedValue(stats);

      const result = await controller.getStatistics(filters);

      expect(service.getChronicConditionStatistics).toHaveBeenCalledWith(filters);
      expect(result).toEqual(stats);
    });
  });

  describe('updateCarePlan', () => {
    it('should update care plan for a chronic condition', async () => {
      const dto: UpdateCarePlanDto = { carePlan: 'New comprehensive care plan' };
      const updatedCondition = { ...mockChronicCondition, carePlan: dto.carePlan };

      service.updateCarePlan.mockResolvedValue(updatedCondition as never);

      const result = await controller.updateCarePlan('test-id-123', dto);

      expect(service.updateCarePlan).toHaveBeenCalledWith('test-id-123', dto.carePlan);
      expect(result).toEqual(updatedCondition);
    });

    it('should handle update care plan for non-existent condition', async () => {
      const dto: UpdateCarePlanDto = { carePlan: 'New care plan' };
      service.updateCarePlan.mockRejectedValue(new Error('Chronic condition with ID invalid not found'));

      await expect(controller.updateCarePlan('invalid', dto)).rejects.toThrow();
    });
  });

  describe('bulkCreate', () => {
    it('should bulk create multiple chronic conditions', async () => {
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

      const createdConditions = conditions.map((dto, index) => ({
        id: `condition-${index}`,
        ...dto,
        diagnosedDate: new Date(dto.diagnosedDate),
        isActive: true,
      }));

      service.bulkCreateChronicConditions.mockResolvedValue(createdConditions as never);

      const result = await controller.bulkCreate(conditions);

      expect(service.bulkCreateChronicConditions).toHaveBeenCalledWith(conditions);
      expect(result).toHaveLength(2);
    });

    it('should handle empty bulk create array', async () => {
      service.bulkCreateChronicConditions.mockResolvedValue([]);

      const result = await controller.bulkCreate([]);

      expect(service.bulkCreateChronicConditions).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
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

      service.bulkCreateChronicConditions.mockRejectedValue(new Error('Bulk insert failed'));

      await expect(controller.bulkCreate(conditions)).rejects.toThrow('Bulk insert failed');
    });
  });
});
