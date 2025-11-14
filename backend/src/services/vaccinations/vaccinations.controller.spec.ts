import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationsController } from './vaccinations.controller';
import { VaccinationsService } from './vaccinations.service';

describe('VaccinationsController', () => {
  let controller: VaccinationsController;
  let vaccinationsService: jest.Mocked<VaccinationsService>;

  const mockVaccinationResult = {
    vaccinations: [
      {
        id: 'vaccination-123',
        studentId: 'student-123',
        vaccineType: 'MMR',
        nextDueDate: '2025-12-01',
        seriesComplete: false,
        status: 'due',
      },
    ],
    total: 1,
    page: 1,
    limit: 50,
    statusFilter: 'due',
  };

  const mockPaginatedVaccinations = {
    data: [
      {
        id: 'vaccination-123',
        studentId: 'student-123',
        vaccineType: 'MMR',
        nextDueDate: '2025-12-01',
        seriesComplete: false,
      },
    ],
    total: 1,
    page: 1,
    limit: 20,
  };

  beforeEach(async () => {
    const mockVaccinationsService: Partial<jest.Mocked<VaccinationsService>> = {
      getVaccinationsByStatus: jest.fn(),
      getOverdueVaccinations: jest.fn(),
      getDueVaccinations: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaccinationsController],
      providers: [
        {
          provide: VaccinationsService,
          useValue: mockVaccinationsService,
        },
      ],
    }).compile();

    controller = module.get<VaccinationsController>(VaccinationsController);
    vaccinationsService = module.get(VaccinationsService);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should inject VaccinationsService', () => {
      expect(vaccinationsService).toBeDefined();
    });
  });

  describe('getDueVaccinations', () => {
    it('should get due vaccinations with default status', async () => {
      const query = {};

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(mockVaccinationResult);

      const result = await controller.getDueVaccinations(query);

      expect(result).toEqual(mockVaccinationResult);
      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledWith(['due'], {});
      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledTimes(1);
    });

    it('should handle status parameter "due"', async () => {
      const query = { status: 'due' };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(mockVaccinationResult);

      const result = await controller.getDueVaccinations(query);

      expect(result).toEqual(mockVaccinationResult);
      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledWith(['due'], {});
    });

    it('should handle status parameter "overdue"', async () => {
      const query = { status: 'overdue' };
      const overdueResult = {
        ...mockVaccinationResult,
        vaccinations: [{ ...mockVaccinationResult.vaccinations[0], status: 'overdue' }],
        statusFilter: 'overdue',
      };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(overdueResult);

      const result = await controller.getDueVaccinations(query);

      expect(result).toEqual(overdueResult);
      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledWith(['overdue'], {});
    });

    it('should handle combined status "due,overdue"', async () => {
      const query = { status: 'due,overdue' };
      const combinedResult = {
        vaccinations: [
          { ...mockVaccinationResult.vaccinations[0], status: 'due' },
          { ...mockVaccinationResult.vaccinations[0], id: 'vaccination-456', status: 'overdue' },
        ],
        total: 2,
        page: 1,
        limit: 50,
        statusFilter: 'due,overdue',
      };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(combinedResult);

      const result = await controller.getDueVaccinations(query);

      expect(result).toEqual(combinedResult);
      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledWith(['due', 'overdue'], {});
    });

    it('should pass pagination parameters', async () => {
      const query = { status: 'due', page: 2, limit: 10 };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue({
        ...mockVaccinationResult,
        page: 2,
        limit: 10,
      });

      const result = await controller.getDueVaccinations(query);

      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledWith(['due'], {
        page: 2,
        limit: 10,
      });
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
    });

    it('should pass studentId filter', async () => {
      const query = { status: 'due', studentId: 'student-123' };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(mockVaccinationResult);

      await controller.getDueVaccinations(query);

      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledWith(['due'], {
        studentId: 'student-123',
      });
    });

    it('should pass vaccineType filter', async () => {
      const query = { status: 'due', vaccineType: 'MMR' };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(mockVaccinationResult);

      await controller.getDueVaccinations(query);

      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledWith(['due'], {
        vaccineType: 'MMR',
      });
    });

    it('should handle multiple filters combined', async () => {
      const query = {
        status: 'due',
        page: 2,
        limit: 25,
        studentId: 'student-123',
        vaccineType: 'Hepatitis',
      };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(mockVaccinationResult);

      await controller.getDueVaccinations(query);

      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledWith(['due'], {
        page: 2,
        limit: 25,
        studentId: 'student-123',
        vaccineType: 'Hepatitis',
      });
    });

    it('should trim status values', async () => {
      const query = { status: ' due , overdue ' };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(mockVaccinationResult);

      await controller.getDueVaccinations(query);

      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledWith(['due', 'overdue'], {});
    });

    it('should handle lowercase status values', async () => {
      const query = { status: 'DUE' };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(mockVaccinationResult);

      await controller.getDueVaccinations(query);

      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledWith(['due'], {});
    });

    it('should handle non-string status parameter', async () => {
      const query = { status: 123 };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(mockVaccinationResult);

      await controller.getDueVaccinations(query);

      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledWith(['due'], {});
    });

    it('should handle empty results', async () => {
      const query = { status: 'due' };
      const emptyResult = {
        vaccinations: [],
        total: 0,
        page: 1,
        limit: 50,
        statusFilter: 'due',
      };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(emptyResult);

      const result = await controller.getDueVaccinations(query);

      expect(result.vaccinations).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle service errors', async () => {
      const query = { status: 'due' };
      const error = new Error('Database error');

      vaccinationsService.getVaccinationsByStatus.mockRejectedValue(error);

      await expect(controller.getDueVaccinations(query)).rejects.toThrow('Database error');
    });

    it('should handle invalid studentId UUID', async () => {
      const query = { status: 'due', studentId: 'invalid-uuid' };
      const error = new Error('Invalid UUID format');

      vaccinationsService.getVaccinationsByStatus.mockRejectedValue(error);

      await expect(controller.getDueVaccinations(query)).rejects.toThrow('Invalid UUID format');
    });
  });

  describe('getOverdueVaccinations', () => {
    it('should get overdue vaccinations', async () => {
      const query = {};

      vaccinationsService.getOverdueVaccinations.mockResolvedValue(mockPaginatedVaccinations);

      const result = await controller.getOverdueVaccinations(query);

      expect(result).toEqual(mockPaginatedVaccinations);
      expect(vaccinationsService.getOverdueVaccinations).toHaveBeenCalledWith({});
      expect(vaccinationsService.getOverdueVaccinations).toHaveBeenCalledTimes(1);
    });

    it('should pass pagination parameters', async () => {
      const query = { page: 2, limit: 10 };

      vaccinationsService.getOverdueVaccinations.mockResolvedValue({
        ...mockPaginatedVaccinations,
        page: 2,
        limit: 10,
      });

      const result = await controller.getOverdueVaccinations(query);

      expect(vaccinationsService.getOverdueVaccinations).toHaveBeenCalledWith(query);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
    });

    it('should pass studentId filter', async () => {
      const query = { studentId: 'student-456' };

      vaccinationsService.getOverdueVaccinations.mockResolvedValue(mockPaginatedVaccinations);

      await controller.getOverdueVaccinations(query);

      expect(vaccinationsService.getOverdueVaccinations).toHaveBeenCalledWith({
        studentId: 'student-456',
      });
    });

    it('should pass vaccineType filter', async () => {
      const query = { vaccineType: 'Hepatitis B' };

      vaccinationsService.getOverdueVaccinations.mockResolvedValue(mockPaginatedVaccinations);

      await controller.getOverdueVaccinations(query);

      expect(vaccinationsService.getOverdueVaccinations).toHaveBeenCalledWith({
        vaccineType: 'Hepatitis B',
      });
    });

    it('should handle multiple filters', async () => {
      const query = {
        page: 3,
        limit: 15,
        studentId: 'student-789',
        vaccineType: 'DTaP',
      };

      vaccinationsService.getOverdueVaccinations.mockResolvedValue(mockPaginatedVaccinations);

      await controller.getOverdueVaccinations(query);

      expect(vaccinationsService.getOverdueVaccinations).toHaveBeenCalledWith(query);
    });

    it('should handle empty overdue vaccinations', async () => {
      const query = {};
      const emptyResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 20,
      };

      vaccinationsService.getOverdueVaccinations.mockResolvedValue(emptyResult);

      const result = await controller.getOverdueVaccinations(query);

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle service errors', async () => {
      const query = {};
      const error = new Error('Service unavailable');

      vaccinationsService.getOverdueVaccinations.mockRejectedValue(error);

      await expect(controller.getOverdueVaccinations(query)).rejects.toThrow('Service unavailable');
    });

    it('should handle large result sets', async () => {
      const query = { page: 1, limit: 100 };
      const largeResult = {
        data: Array.from({ length: 100 }, (_, i) => ({
          id: `vaccination-${i}`,
          studentId: `student-${i}`,
          vaccineType: 'MMR',
          nextDueDate: '2025-10-01',
          seriesComplete: false,
        })),
        total: 500,
        page: 1,
        limit: 100,
      };

      vaccinationsService.getOverdueVaccinations.mockResolvedValue(largeResult);

      const result = await controller.getOverdueVaccinations(query);

      expect(result.data).toHaveLength(100);
      expect(result.total).toBe(500);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle undefined query parameters', async () => {
      const query = { status: undefined };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(mockVaccinationResult);

      await controller.getDueVaccinations(query);

      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledWith(['due'], {});
    });

    it('should handle empty string status', async () => {
      const query = { status: '' };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(mockVaccinationResult);

      await controller.getDueVaccinations(query);

      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalled();
    });

    it('should handle malformed status string', async () => {
      const query = { status: ',,due,,' };

      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(mockVaccinationResult);

      await controller.getDueVaccinations(query);

      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalled();
    });

    it('should handle concurrent requests', async () => {
      vaccinationsService.getVaccinationsByStatus.mockResolvedValue(mockVaccinationResult);
      vaccinationsService.getOverdueVaccinations.mockResolvedValue(mockPaginatedVaccinations);

      const promises = [
        controller.getDueVaccinations({ status: 'due' }),
        controller.getDueVaccinations({ status: 'overdue' }),
        controller.getOverdueVaccinations({}),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(vaccinationsService.getVaccinationsByStatus).toHaveBeenCalledTimes(2);
      expect(vaccinationsService.getOverdueVaccinations).toHaveBeenCalledTimes(1);
    });

    it('should handle network timeout errors', async () => {
      const query = { status: 'due' };
      const error = new Error('Network timeout');

      vaccinationsService.getVaccinationsByStatus.mockRejectedValue(error);

      await expect(controller.getDueVaccinations(query)).rejects.toThrow('Network timeout');
    });

    it('should handle database connection errors', async () => {
      const query = {};
      const error = new Error('Database connection failed');

      vaccinationsService.getOverdueVaccinations.mockRejectedValue(error);

      await expect(controller.getOverdueVaccinations(query)).rejects.toThrow(
        'Database connection failed'
      );
    });
  });
});
