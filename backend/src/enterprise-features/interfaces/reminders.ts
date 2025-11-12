import { ReminderTiming, CommunicationChannel } from './enums';

export interface ReminderSchedule {
  appointmentId: string;
  reminders: Array<{
    timing: ReminderTiming;
    channel: CommunicationChannel;
    sent: boolean;
    sentAt?: Date;
  }>;
}

export interface ReminderPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  advanceNotice: ReminderTiming;
  quietHours?: {
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
}