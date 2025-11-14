/**
 * @fileoverview Appointment Query Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { AppointmentQueryService } from './appointment-query.service';
import { Appointment } from '@/database';
import { RequestContextService } from '@/common/context/request-context.service';

describe('AppointmentQueryService', () => {
  let service: AppointmentQueryService;
  let model: jest.Mocked<typeof Appointment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentQueryService,
        { provide: getModelToken(Appointment), useValue: { findAll: jest.fn(), findAndCountAll: jest.fn() } },
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<AppointmentQueryService>(AppointmentQueryService);
    model = module.get(getModelToken(Appointment));
  });

  it('should get upcoming appointments', async () => {
    model.findAll.mockResolvedValue([]);
    const result = await service.getUpcomingAppointments('nurse-1', 10);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should get appointments by date', async () => {
    model.findAll.mockResolvedValue([]);
    const result = await service.getAppointmentsByDate('2024-01-15');
    expect(result).toHaveProperty('data');
  });

  it('should get appointment history', async () => {
    model.findAll.mockResolvedValue([]);
    const result = await service.getAppointmentHistory('student-1', 50);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should search appointments', async () => {
    model.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
    const result = await service.searchAppointments({ query: 'test', page: 1, limit: 20 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('meta');
  });
});
