import { IsString, IsObject } from 'class-validator';
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

  @ApiProperty({ description: 'Reminder preferences object' })
  @IsObject()
  preferences: any;
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
