/**
 * @fileoverview Appointment Statistics Controller Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentStatisticsController } from './appointment-statistics.controller';
import { AppointmentService } from '../appointment.service';

describe('AppointmentStatisticsController', () => {
  let controller: AppointmentStatisticsController;
  let service: jest.Mocked<AppointmentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentStatisticsController],
      providers: [
        {
          provide: AppointmentService,
          useValue: {
            getStatistics: jest.fn(),
            getAppointmentTrends: jest.fn(),
            getNoShowStats: jest.fn(),
            exportCalendar: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentStatisticsController>(AppointmentStatisticsController);
    service = module.get(AppointmentService);
  });

  it('should get statistics', async () => {
    service.getStatistics.mockResolvedValue({ total: 100 });
    const result = await controller.getStatistics({});
    expect(result).toHaveProperty('total');
  });

  it('should get trends', async () => {
    service.getAppointmentTrends.mockResolvedValue({ trends: [] });
    const result = await controller.getTrends({ from: '2024-01-01', to: '2024-01-31' });
    expect(result).toHaveProperty('trends');
  });

  it('should export calendar', async () => {
    service.exportCalendar.mockResolvedValue('icalendar-data');
    const result = await controller.exportCalendar('nurse-1', '2024-01-01', '2024-01-31');
    expect(typeof result).toBe('string');
  });
});
