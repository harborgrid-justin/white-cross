/**
 * @fileoverview Appointment Statistics Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { AppointmentStatisticsService } from './appointment-statistics.service';
import { Appointment } from '@/database';
import { RequestContextService } from '@/common/context/request-context.service';

describe('AppointmentStatisticsService', () => {
  let service: AppointmentStatisticsService;
  let model: jest.Mocked<typeof Appointment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentStatisticsService,
        { provide: getModelToken(Appointment), useValue: { findAll: jest.fn(), count: jest.fn() } },
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<AppointmentStatisticsService>(AppointmentStatisticsService);
    model = module.get(getModelToken(Appointment));
  });

  it('should get statistics', async () => {
    model.count.mockResolvedValue(100);
    const result = await service.getStatistics({});
    expect(result).toHaveProperty('total');
  });

  it('should get appointment trends', async () => {
    model.findAll.mockResolvedValue([]);
    const result = await service.getAppointmentTrends('2024-01-01', '2024-01-31', 'day');
    expect(result).toHaveProperty('trends');
    expect(Array.isArray(result.trends)).toBe(true);
  });

  it('should get no-show stats', async () => {
    model.findAll.mockResolvedValue([]);
    const result = await service.getNoShowStats('nurse-1', '2024-01-01', '2024-01-31');
    expect(result).toBeDefined();
  });

  it('should get no-show count for student', async () => {
    model.count.mockResolvedValue(3);
    const result = await service.getNoShowCount('student-1', 90);
    expect(typeof result).toBe('number');
  });
});
