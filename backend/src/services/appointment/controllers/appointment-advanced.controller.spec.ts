/**
 * @fileoverview Appointment Advanced Controller Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentAdvancedController } from './appointment-advanced.controller';
import { AppointmentService } from '../appointment.service';

describe('AppointmentAdvancedController', () => {
  let controller: AppointmentAdvancedController;
  let service: jest.Mocked<AppointmentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentAdvancedController],
      providers: [
        {
          provide: AppointmentService,
          useValue: {
            createRecurringAppointments: jest.fn(),
            bulkCancelAppointments: jest.fn(),
            searchAppointments: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentAdvancedController>(AppointmentAdvancedController);
    service = module.get(AppointmentService);
  });

  it('should create recurring appointments', async () => {
    const createDto = {
      studentId: 's1',
      nurseId: 'n1',
      type: 'CHECKUP' as const,
      startTime: '2024-01-15T10:00:00Z',
      duration: 30,
      reason: 'Weekly',
      recurrence: { frequency: 'WEEKLY' as const, interval: 1, count: 4 },
    };
    service.createRecurringAppointments.mockResolvedValue({ appointments: [], count: 4 });
    const result = await controller.createRecurring(createDto);
    expect(result).toHaveProperty('count');
  });

  it('should bulk cancel appointments', async () => {
    service.bulkCancelAppointments.mockResolvedValue({ cancelled: 5, failed: 0 });
    const result = await controller.bulkCancel({ appointmentIds: ['a1', 'a2'], reason: 'Test' });
    expect(result).toHaveProperty('cancelled');
  });
});
