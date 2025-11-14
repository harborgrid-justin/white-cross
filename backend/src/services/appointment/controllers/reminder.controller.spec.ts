/**
 * @fileoverview Reminder Controller Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ReminderController } from './reminder.controller';
import { AppointmentService } from '../appointment.service';

describe('ReminderController', () => {
  let controller: ReminderController;
  let service: jest.Mocked<AppointmentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReminderController],
      providers: [
        {
          provide: AppointmentService,
          useValue: {
            scheduleReminder: jest.fn(),
            getAppointmentReminders: jest.fn(),
            cancelReminder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReminderController>(ReminderController);
    service = module.get(AppointmentService);
  });

  it('should schedule reminder', async () => {
    service.scheduleReminder.mockResolvedValue({ reminder: { id: 'r1' } });
    const result = await controller.schedule({
      appointmentId: 'appt-1',
      sendAt: new Date(),
      type: 'EMAIL',
    });
    expect(result).toHaveProperty('reminder');
  });

  it('should get reminders', async () => {
    service.getAppointmentReminders.mockResolvedValue({ reminders: [] });
    const result = await controller.getReminders('appt-1');
    expect(result).toHaveProperty('reminders');
  });

  it('should cancel reminder', async () => {
    service.cancelReminder.mockResolvedValue({ reminder: { id: 'r1' } });
    const result = await controller.cancel('r1');
    expect(result).toHaveProperty('reminder');
  });
});
