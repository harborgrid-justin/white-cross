/**
 * @fileoverview Appointment Status Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { AppointmentStatusService } from './appointment-status.service';
import { Appointment } from '@/database';
import { RequestContextService } from '@/common/context/request-context.service';

describe('AppointmentStatusService', () => {
  let service: AppointmentStatusService;
  let model: jest.Mocked<typeof Appointment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentStatusService,
        { provide: getModelToken(Appointment), useValue: { findByPk: jest.fn() } },
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<AppointmentStatusService>(AppointmentStatusService);
    model = module.get(getModelToken(Appointment));
  });

  it('should start appointment', async () => {
    const mockAppt = { id: 'appt-1', status: 'SCHEDULED', save: jest.fn() };
    model.findByPk.mockResolvedValue(mockAppt as unknown as Appointment);

    await service.startAppointment('appt-1');

    expect(mockAppt.save).toHaveBeenCalled();
  });

  it('should complete appointment', async () => {
    const mockAppt = { id: 'appt-1', status: 'IN_PROGRESS', save: jest.fn() };
    model.findByPk.mockResolvedValue(mockAppt as unknown as Appointment);

    await service.completeAppointment('appt-1', { notes: 'Completed' });

    expect(mockAppt.save).toHaveBeenCalled();
  });

  it('should mark as no-show', async () => {
    const mockAppt = { id: 'appt-1', status: 'SCHEDULED', save: jest.fn() };
    model.findByPk.mockResolvedValue(mockAppt as unknown as Appointment);

    await service.markNoShow('appt-1');

    expect(mockAppt.save).toHaveBeenCalled();
  });
});
