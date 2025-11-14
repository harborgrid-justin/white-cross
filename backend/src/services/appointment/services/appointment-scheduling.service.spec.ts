/**
 * @fileoverview Appointment Scheduling Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { AppointmentSchedulingService } from './appointment-scheduling.service';
import { Appointment } from '@/database';
import { RequestContextService } from '@/common/context/request-context.service';

describe('AppointmentSchedulingService', () => {
  let service: AppointmentSchedulingService;
  let model: jest.Mocked<typeof Appointment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentSchedulingService,
        { provide: getModelToken(Appointment), useValue: { findAll: jest.fn() } },
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<AppointmentSchedulingService>(AppointmentSchedulingService);
    model = module.get(getModelToken(Appointment));
  });

  it('should check availability', async () => {
    model.findAll.mockResolvedValue([]);
    const result = await service.checkAvailability('nurse-1', new Date(), 30);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should get available slots', async () => {
    model.findAll.mockResolvedValue([]);
    const result = await service.getAvailableSlots('nurse-1', new Date(), 30);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should check conflicts', async () => {
    model.findAll.mockResolvedValue([]);
    const result = await service.checkConflicts('nurse-1', '2024-01-15T10:00:00Z', 30);
    expect(result).toHaveProperty('hasConflict');
    expect(result).toHaveProperty('conflicts');
  });
});
