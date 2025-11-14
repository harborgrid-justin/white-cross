/**
 * @fileoverview Appointment Recurring Service Tests
 * @module appointment/services/appointment-recurring.service.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { AppointmentRecurringService } from './appointment-recurring.service';
import { Appointment } from '@/database';
import { RequestContextService } from '@/common/context/request-context.service';

describe('AppointmentRecurringService', () => {
  let service: AppointmentRecurringService;
  let appointmentModel: jest.Mocked<typeof Appointment>;

  beforeEach(async () => {
    const mockModel = {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentRecurringService,
        { provide: getModelToken(Appointment), useValue: mockModel },
        {
          provide: RequestContextService,
          useValue: { requestId: 'test', getLogContext: jest.fn(), getAuditContext: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AppointmentRecurringService>(AppointmentRecurringService);
    appointmentModel = module.get(getModelToken(Appointment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRecurringAppointments', () => {
    it('should create recurring appointments successfully', async () => {
      const createDto = {
        studentId: 'student-1',
        nurseId: 'nurse-1',
        type: 'CHECKUP' as const,
        startTime: '2024-01-15T10:00:00Z',
        duration: 30,
        reason: 'Weekly checkup',
        recurrence: { frequency: 'WEEKLY' as const, interval: 1, count: 4 },
      };
      const mockCreateFn = jest.fn().mockResolvedValue({ id: 'appt-1' });

      const result = await service.createRecurringAppointments(createDto, mockCreateFn);

      expect(result).toHaveProperty('appointments');
      expect(result).toHaveProperty('count');
      expect(Array.isArray(result.appointments)).toBe(true);
    });
  });

  describe('bulkCancelAppointments', () => {
    it('should bulk cancel appointments successfully', async () => {
      const bulkDto = {
        appointmentIds: ['appt-1', 'appt-2'],
        reason: 'School closure',
      };
      appointmentModel.update.mockResolvedValue([2, []]);

      const result = await service.bulkCancelAppointments(bulkDto);

      expect(result).toHaveProperty('cancelled');
      expect(result).toHaveProperty('failed');
    });
  });
});
