/**
 * @fileoverview Appointment Query Controller Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentQueryController } from './appointment-query.controller';
import { AppointmentService } from '../appointment.service';

describe('AppointmentQueryController', () => {
  let controller: AppointmentQueryController;
  let service: jest.Mocked<AppointmentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentQueryController],
      providers: [
        {
          provide: AppointmentService,
          useValue: {
            getUpcomingAppointments: jest.fn(),
            getAppointmentsByDate: jest.fn(),
            getAppointmentHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentQueryController>(AppointmentQueryController);
    service = module.get(AppointmentService);
  });

  it('should get upcoming appointments', async () => {
    service.getUpcomingAppointments.mockResolvedValue([]);
    const result = await controller.getUpcoming('nurse-1', 10);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should get appointments by date', async () => {
    service.getAppointmentsByDate.mockResolvedValue({ data: [] });
    const result = await controller.getByDate('2024-01-15');
    expect(result).toHaveProperty('data');
  });
});
