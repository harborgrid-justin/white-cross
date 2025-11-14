import { Test, TestingModule } from '@nestjs/testing';
import { RemindersController } from './reminders.controller';
import { ReminderSchedulerService } from '../reminder-scheduler.service';
import {
  CustomizeReminderPreferencesDto,
  ReminderScheduleResponseDto,
  ScheduleRemindersDto,
} from '../dto';

describe('RemindersController', () => {
  let controller: RemindersController;
  let service: jest.Mocked<ReminderSchedulerService>;

  const mockReminderService = {
    scheduleReminders: jest.fn(),
    sendDueReminders: jest.fn(),
    updatePreferences: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemindersController],
      providers: [
        {
          provide: ReminderSchedulerService,
          useValue: mockReminderService,
        },
      ],
    }).compile();

    controller = module.get<RemindersController>(RemindersController);
    service = module.get(ReminderSchedulerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('scheduleReminders', () => {
    it('should schedule reminders for appointment', async () => {
      const dto: ScheduleRemindersDto = {
        appointmentId: 'appt-123',
      };

      const expectedResult: Partial<ReminderScheduleResponseDto> = {
        appointmentId: dto.appointmentId,
        remindersScheduled: 3,
        schedules: [
          { when: '24_HOURS_BEFORE', scheduledFor: '2025-01-19T10:00:00.000Z' },
          { when: '1_HOUR_BEFORE', scheduledFor: '2025-01-20T09:00:00.000Z' },
        ],
      };

      mockReminderService.scheduleReminders.mockResolvedValue(expectedResult);

      const result = await controller.scheduleReminders(dto);

      expect(service.scheduleReminders).toHaveBeenCalledWith(dto.appointmentId);
      expect(result.remindersScheduled).toBe(3);
    });
  });

  describe('sendDueReminders', () => {
    it('should send all due reminders', async () => {
      const expectedResult = {
        remindersSent: 15,
        failed: 1,
        timestamp: new Date().toISOString(),
      };

      mockReminderService.sendDueReminders.mockResolvedValue(expectedResult);

      const result = await controller.sendDueReminders();

      expect(service.sendDueReminders).toHaveBeenCalled();
      expect(result.remindersSent).toBe(15);
    });
  });

  describe('customizeReminderPreferences', () => {
    it('should update reminder preferences', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const dto: CustomizeReminderPreferencesDto = {
        preferences: {
          enabled: true,
          channels: ['EMAIL', 'SMS'],
          timings: ['24_HOURS_BEFORE', '1_HOUR_BEFORE'],
        },
      };

      const expectedResult = {
        studentId,
        preferences: dto.preferences,
        updated: true,
      };

      mockReminderService.updatePreferences.mockResolvedValue(expectedResult);

      const result = await controller.customizeReminderPreferences(studentId, dto);

      expect(service.updatePreferences).toHaveBeenCalledWith(
        studentId,
        dto.preferences,
      );
      expect(result.updated).toBe(true);
    });
  });
});
