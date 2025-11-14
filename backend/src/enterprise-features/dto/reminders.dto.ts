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
  @ApiProperty({
    description: 'Appointment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  appointmentId: string;

  @ApiProperty({
    description: 'Scheduled reminders for the appointment',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        timing: {
          type: 'string',
          enum: ['24h', '1h', '15m'],
          description: 'When the reminder will be sent',
        },
        channel: {
          type: 'string',
          enum: ['sms', 'email', 'push'],
          description: 'Communication channel',
        },
        sent: {
          type: 'boolean',
          description: 'Whether the reminder has been sent',
        },
        sentAt: {
          type: 'string',
          format: 'date-time',
          description: 'When the reminder was sent',
          nullable: true,
        },
      },
    },
    example: [
      { timing: '24h', channel: 'email', sent: false },
      { timing: '1h', channel: 'sms', sent: false },
    ],
  })
  reminders: Array<{
    timing: '24h' | '1h' | '15m';
    channel: 'sms' | 'email' | 'push';
    sent: boolean;
    sentAt?: Date;
  }>;
}
