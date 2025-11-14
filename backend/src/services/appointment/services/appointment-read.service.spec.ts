/**
 * @fileoverview Appointment Read Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { AppointmentReadService } from './appointment-read.service';
import { Appointment } from '@/database';
import { RequestContextService } from '@/common/context/request-context.service';

describe('AppointmentReadService', () => {
  let service: AppointmentReadService;
  let model: jest.Mocked<typeof Appointment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentReadService,
        { provide: getModelToken(Appointment), useValue: { findAndCountAll: jest.fn(), findByPk: jest.fn() } },
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<AppointmentReadService>(AppointmentReadService);
    model = module.get(getModelToken(Appointment));
  });

  it('should get appointments with pagination', async () => {
    model.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
    const result = await service.getAppointments({ page: 1, limit: 20 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('meta');
  });

  it('should get appointment by ID', async () => {
    const mockAppt = { id: 'appt-1', studentId: 'student-1' };
    model.findByPk.mockResolvedValue(mockAppt as Appointment);

    const result = await service.getAppointmentById('appt-1');

    expect(result).toEqual(mockAppt);
    expect(model.findByPk).toHaveBeenCalledWith('appt-1', expect.any(Object));
  });
});
