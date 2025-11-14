/**
 * @fileoverview Appointment Core Controller Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentCoreController } from './appointment-core.controller';
import { AppointmentService } from '../appointment.service';

describe('AppointmentCoreController', () => {
  let controller: AppointmentCoreController;
  let service: jest.Mocked<AppointmentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentCoreController],
      providers: [
        {
          provide: AppointmentService,
          useValue: {
            getAppointments: jest.fn(),
            getAppointmentById: jest.fn(),
            createAppointment: jest.fn(),
            updateAppointment: jest.fn(),
            cancelAppointment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentCoreController>(AppointmentCoreController);
    service = module.get(AppointmentService);
  });

  it('should get all appointments', async () => {
    service.getAppointments.mockResolvedValue({ data: [], meta: { page: 1, limit: 20, total: 0, pages: 0 } });
    const result = await controller.findAll({});
    expect(result).toHaveProperty('data');
  });

  it('should create appointment', async () => {
    const createDto = { studentId: 's1', nurseId: 'n1', type: 'CHECKUP' as const, startTime: '2024-01-15T10:00:00Z', duration: 30, reason: 'Test' };
    service.createAppointment.mockResolvedValue({ id: 'appt-1' } as never);
    const result = await controller.create(createDto);
    expect(result).toHaveProperty('id');
  });

  it('should update appointment', async () => {
    service.updateAppointment.mockResolvedValue({ id: 'appt-1' } as never);
    const result = await controller.update('appt-1', { duration: 45 });
    expect(result).toHaveProperty('id');
  });
});
