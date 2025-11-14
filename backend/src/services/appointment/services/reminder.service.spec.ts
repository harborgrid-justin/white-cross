/**
 * @fileoverview Reminder Service Tests
 * @module appointment/services/reminder.service.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ReminderService } from './reminder.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('ReminderService', () => {
  let service: ReminderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReminderService,
        {
          provide: RequestContextService,
          useValue: {
            requestId: 'test',
            userId: 'user-1',
            getLogContext: jest.fn(),
            getAuditContext: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReminderService>(ReminderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processPendingReminders', () => {
    it('should process pending reminders successfully', async () => {
      const result = await service.processPendingReminders();
      expect(result).toHaveProperty('processed');
      expect(result).toHaveProperty('sent');
      expect(result).toHaveProperty('failed');
    });
  });

  describe('scheduleReminder', () => {
    it('should schedule reminder successfully', async () => {
      const createDto = {
        appointmentId: 'appt-1',
        sendAt: new Date(Date.now() + 86400000),
        type: 'EMAIL' as const,
      };
      const result = await service.scheduleReminder(createDto);
      expect(result).toHaveProperty('reminder');
    });
  });

  describe('cancelReminder', () => {
    it('should cancel reminder successfully', async () => {
      const result = await service.cancelReminder('reminder-1');
      expect(result).toHaveProperty('reminder');
    });
  });

  describe('getAppointmentReminders', () => {
    it('should get appointment reminders successfully', async () => {
      const result = await service.getAppointmentReminders('appt-1');
      expect(result).toHaveProperty('reminders');
      expect(Array.isArray(result.reminders)).toBe(true);
    });
  });
});
