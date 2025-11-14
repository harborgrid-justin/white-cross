/**
 * @fileoverview Appointment Status Controller Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentStatusController } from './appointment-status.controller';
import { AppointmentService } from '../appointment.service';

describe('AppointmentStatusController', () => {
  let controller: AppointmentStatusController;
  let service: jest.Mocked<AppointmentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentStatusController],
      providers: [
        {
          provide: AppointmentService,
          useValue: {
            startAppointment: jest.fn(),
            completeAppointment: jest.fn(),
            markNoShow: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentStatusController>(AppointmentStatusController);
    service = module.get(AppointmentService);
  });

  it('should start appointment', async () => {
    service.startAppointment.mockResolvedValue({ id: 'appt-1', status: 'IN_PROGRESS' } as never);
    const result = await controller.start('appt-1');
    expect(result).toHaveProperty('id');
  });

  it('should complete appointment', async () => {
    service.completeAppointment.mockResolvedValue({ id: 'appt-1', status: 'COMPLETED' } as never);
    const result = await controller.complete('appt-1', { notes: 'Done' });
    expect(result).toHaveProperty('id');
  });

  it('should mark no-show', async () => {
    service.markNoShow.mockResolvedValue({ id: 'appt-1', status: 'NO_SHOW' } as never);
    const result = await controller.markNoShow('appt-1');
    expect(result).toHaveProperty('id');
  });
});
