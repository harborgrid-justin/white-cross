import { Test, TestingModule } from '@nestjs/testing';
import { ScreeningController } from './screening.controller';
import { ScreeningService } from './screening.service';

describe('ScreeningController', () => {
  let controller: ScreeningController;
  let service: jest.Mocked<ScreeningService>;

  const mockScreeningService = {
    getStudentScreenings: jest.fn(),
    batchCreate: jest.fn(),
    getOverdueScreenings: jest.fn(),
    getScreeningSchedule: jest.fn(),
    createReferral: jest.fn(),
    getScreeningStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScreeningController],
      providers: [
        {
          provide: ScreeningService,
          useValue: mockScreeningService,
        },
      ],
    }).compile();

    controller = module.get<ScreeningController>(ScreeningController);
    service = module.get(ScreeningService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStudentScreenings', () => {
    it('should retrieve student screenings', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const screenings = [
        { id: 's1', studentId, screeningType: 'VISION', passed: true },
      ];
      mockScreeningService.getStudentScreenings.mockResolvedValue(screenings as never);

      const result = await controller.getStudentScreenings(studentId);

      expect(service.getStudentScreenings).toHaveBeenCalledWith(studentId);
      expect(result).toEqual(screenings);
    });

    it('should validate UUID format', async () => {
      const invalidId = 'invalid-uuid';

      await expect(controller.getStudentScreenings(invalidId)).rejects.toThrow();
    });
  });

  describe('batchCreate', () => {
    it('should batch create screenings', async () => {
      const dto = {
        screenings: [
          { studentId: '123', screeningType: 'VISION', screeningDate: new Date() },
        ],
      };
      const result = { successCount: 1, errorCount: 0, createdIds: ['s1'], errors: [] };
      mockScreeningService.batchCreate.mockResolvedValue(result);

      const response = await controller.batchCreate(dto as never);

      expect(service.batchCreate).toHaveBeenCalledWith(dto.screenings);
      expect(response.successCount).toBe(1);
    });
  });

  describe('getOverdueScreenings', () => {
    it('should retrieve overdue screenings', async () => {
      const query = { schoolId: 'school-1', gradeLevel: 'K' };
      const overdueScreenings = [
        { studentId: 's1', screeningType: 'VISION', daysOverdue: 30 },
      ];
      mockScreeningService.getOverdueScreenings.mockResolvedValue(overdueScreenings);

      const result = await controller.getOverdueScreenings(query as never);

      expect(service.getOverdueScreenings).toHaveBeenCalledWith(query);
      expect(result).toEqual(overdueScreenings);
    });
  });

  describe('getScreeningSchedule', () => {
    it('should retrieve screening schedule', async () => {
      const query = { gradeLevel: 'K', stateCode: 'CA' };
      const schedule = {
        gradeLevel: 'K',
        stateCode: 'CA',
        schedules: [
          { grade: 'K', required: ['VISION', 'HEARING'], frequency: 'Annual' },
        ],
      };
      mockScreeningService.getScreeningSchedule.mockReturnValue(schedule);

      const result = await controller.getScreeningSchedule(query as never);

      expect(service.getScreeningSchedule).toHaveBeenCalledWith(query);
      expect(result.gradeLevel).toBe('K');
    });
  });

  describe('createReferral', () => {
    it('should create screening referral', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = {
        providerName: 'Dr. Smith',
        reason: 'Failed vision screening',
        urgency: 'ROUTINE',
      };
      const referral = { id: 'ref-1', screeningId: id, ...dto };
      mockScreeningService.createReferral.mockResolvedValue(referral);

      const result = await controller.createReferral(id, dto as never);

      expect(service.createReferral).toHaveBeenCalledWith(id, dto);
      expect(result.providerName).toBe('Dr. Smith');
    });
  });

  describe('getStatistics', () => {
    it('should retrieve screening statistics', async () => {
      const query = {
        schoolId: 'school-1',
        startDate: '2025-01-01',
        endDate: '2025-01-31',
      };
      const stats = {
        totalScreenings: 100,
        byType: { VISION: 50, HEARING: 50 },
        compliance: { compliant: 90, nonCompliant: 10 },
      };
      mockScreeningService.getScreeningStatistics.mockResolvedValue(stats);

      const result = await controller.getStatistics(query as never);

      expect(service.getScreeningStatistics).toHaveBeenCalledWith(query);
      expect(result.totalScreenings).toBe(100);
    });
  });
});
