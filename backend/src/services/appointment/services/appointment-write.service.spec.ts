/**
 * @fileoverview Appointment Write Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { AppointmentWriteService } from './appointment-write.service';
import { Appointment } from '@/database';
import { RequestContextService } from '@/common/context/request-context.service';

describe('AppointmentWriteService', () => {
  let service: AppointmentWriteService;
  let model: jest.Mocked<typeof Appointment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentWriteService,
        { provide: getModelToken(Appointment), useValue: { create: jest.fn(), findByPk: jest.fn() } },
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<AppointmentWriteService>(AppointmentWriteService);
    model = module.get(getModelToken(Appointment));
  });

  it('should create appointment', async () => {
    const createDto = { studentId: 's1', nurseId: 'n1', type: 'CHECKUP' as const, startTime: '2024-01-15T10:00:00Z', duration: 30, reason: 'Test' };
    model.create.mockResolvedValue({ id: 'appt-1', ...createDto } as Appointment);

    const result = await service.createAppointment(createDto);

    expect(result).toHaveProperty('id');
    expect(model.create).toHaveBeenCalled();
  });

  it('should update appointment', async () => {
    const mockAppt = { id: 'appt-1', save: jest.fn() };
    model.findByPk.mockResolvedValue(mockAppt as unknown as Appointment);

    await service.updateAppointment('appt-1', { duration: 45 });

    expect(model.findByPk).toHaveBeenCalledWith('appt-1');
  });

  it('should cancel appointment', async () => {
    const mockAppt = { id: 'appt-1', status: 'SCHEDULED', save: jest.fn() };
    model.findByPk.mockResolvedValue(mockAppt as unknown as Appointment);

    await service.cancelAppointment('appt-1', 'Test');

    expect(mockAppt.save).toHaveBeenCalled();
  });
});
