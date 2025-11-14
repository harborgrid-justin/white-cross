import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ScreeningService } from './screening.service';

describe('ScreeningService', () => {
  let service: ScreeningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScreeningService],
    }).compile();

    service = module.get<ScreeningService>(ScreeningService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStudentScreenings', () => {
    it('should return screenings for a student', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';

      const result = await service.getStudentScreenings(studentId);

      expect(Array.isArray(result)).toBe(true);
    });

    it('should return screenings sorted by date descending', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const screening1 = {
        id: 's1',
        studentId,
        screeningType: 'VISION',
        screeningDate: new Date('2025-01-01'),
      };
      const screening2 = {
        id: 's2',
        studentId,
        screeningType: 'HEARING',
        screeningDate: new Date('2025-01-15'),
      };

      // Add test screenings (in mock data store)
      (service as unknown as { screenings: Map<string, unknown> }).screenings.set('s1', screening1);
      (service as unknown as { screenings: Map<string, unknown> }).screenings.set('s2', screening2);

      const result = await service.getStudentScreenings(studentId);

      expect(result.length).toBeGreaterThanOrEqual(2);
      if (result.length >= 2) {
        expect(new Date(result[0].screeningDate).getTime()).toBeGreaterThanOrEqual(
          new Date(result[1].screeningDate).getTime(),
        );
      }
    });
  });

  describe('batchCreate', () => {
    it('should create multiple screenings successfully', async () => {
      const screenings = [
        {
          studentId: '123e4567-e89b-12d3-a456-426614174000',
          screeningType: 'VISION',
          screeningDate: new Date(),
          result: 'PASS',
        },
        {
          studentId: '223e4567-e89b-12d3-a456-426614174000',
          screeningType: 'HEARING',
          screeningDate: new Date(),
          result: 'PASS',
        },
      ];

      const result = await service.batchCreate(screenings);

      expect(result.successCount).toBe(2);
      expect(result.errorCount).toBe(0);
      expect(result.createdIds.length).toBe(2);
    });

    it('should handle partial failures in batch', async () => {
      const screenings = [
        {
          studentId: '123e4567-e89b-12d3-a456-426614174000',
          screeningType: 'VISION',
          screeningDate: new Date(),
          result: 'PASS',
        },
        {
          studentId: '', // Invalid
          screeningType: 'HEARING',
          screeningDate: new Date(),
          result: 'PASS',
        },
      ];

      const result = await service.batchCreate(screenings);

      expect(result.successCount).toBe(1);
      expect(result.errorCount).toBe(1);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('getOverdueScreenings', () => {
    it('should return overdue screenings', async () => {
      const query = { schoolId: 'school-1' };

      const result = await service.getOverdueScreenings(query);

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getScreeningSchedule', () => {
    it('should return schedule for grade level', () => {
      const query = { gradeLevel: 'K', stateCode: 'CA' };

      const result = service.getScreeningSchedule(query);

      expect(result.gradeLevel).toBe('K');
      expect(result.schedules).toBeDefined();
      expect(Array.isArray(result.schedules)).toBe(true);
    });

    it('should return all grades when no grade specified', () => {
      const query = { stateCode: 'CA' };

      const result = service.getScreeningSchedule(query);

      expect(result.schedules.length).toBeGreaterThan(0);
    });
  });

  describe('createReferral', () => {
    it('should create referral for screening', async () => {
      const screeningId = 'screening-123';
      const studentId = '123e4567-e89b-12d3-a456-426614174000';

      // Add screening to mock data
      (service as unknown as { screenings: Map<string, unknown> }).screenings.set(screeningId, {
        id: screeningId,
        studentId,
        screeningType: 'VISION',
      });

      const referralData = {
        providerName: 'Dr. Smith',
        reason: 'Failed vision screening',
        urgency: 'ROUTINE',
      };

      const result = await service.createReferral(screeningId, referralData);

      expect(result.screeningId).toBe(screeningId);
      expect(result.providerName).toBe('Dr. Smith');
    });

    it('should throw NotFoundException for nonexistent screening', async () => {
      const screeningId = 'nonexistent';
      const referralData = { providerName: 'Dr. Smith', reason: 'Test' };

      await expect(service.createReferral(screeningId, referralData)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getScreeningStatistics', () => {
    it('should return screening statistics', async () => {
      const query = {
        schoolId: 'school-1',
        startDate: '2025-01-01',
        endDate: '2025-01-31',
      };

      const result = await service.getScreeningStatistics(query);

      expect(result.totalScreenings).toBeDefined();
      expect(result.byType).toBeDefined();
      expect(result.compliance).toBeDefined();
    });
  });
});
