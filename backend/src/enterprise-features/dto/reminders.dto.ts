import { IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleRemindersDto {
  @ApiProperty({ description: 'Appointment ID' })
  @IsString()
  appointmentId: string;
}

export class CustomizeReminderPreferencesDto {
  @ApiProperty({ description: 'Student ID' })
  @IsString()
  studentId: string;

  @ApiProperty({
    description: 'Reminder preferences object',
    type: 'object',
    properties: {
      emailEnabled: { type: 'boolean' },
      smsEnabled: { type: 'boolean' },
      pushEnabled: { type: 'boolean' },
      advanceNotice: { enum: ['24h', '1h', '15m'] },
      quietHours: {
        type: 'object',
        properties: {
          start: { type: 'string' },
          end: { type: 'string' },
        },
      },
    },
  })
  @IsObject()
  preferences: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    advanceNotice: '24h' | '1h' | '15m';
    quietHours?: {
      start: string;
      end: string;
    };
  };
}

export class ReminderScheduleResponseDto {
  appointmentId: string;
  reminders: Array<{
    timing: '24h' | '1h' | '15m';
    channel: 'sms' | 'email' | 'push';
    sent: boolean;
    sentAt?: Date;
  }>;
}
