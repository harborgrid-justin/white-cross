import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Message delivery types for reminders
 */
export enum MessageType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  VOICE = 'VOICE',
}

/**
 * Reminder delivery status
 */
export enum ReminderStatus {
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * DTO for scheduling appointment reminders
 */
export class CreateReminderDto {
  @ApiProperty({
    description: 'Appointment UUID to create reminder for',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  appointmentId: string;

  @ApiProperty({
    description: 'Type of message delivery channel',
    enum: MessageType,
    example: MessageType.EMAIL,
  })
  @IsEnum(MessageType)
  @IsNotEmpty()
  type: MessageType;

  @ApiProperty({
    description: 'When to send the reminder',
    example: '2025-10-27T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  scheduleTime: Date;

  @ApiPropertyOptional({
    description:
      'Custom reminder message (optional - default message will be used if not provided)',
    example:
      'Reminder: You have an appointment tomorrow at 10:30 AM with Nurse Johnson.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  message?: string;
}

/**
 * DTO for bulk reminder processing results
 */
export class ReminderProcessingResultDto {
  @ApiProperty({
    description: 'Total number of reminders processed',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Number of reminders successfully sent',
    example: 23,
  })
  sent: number;

  @ApiProperty({
    description: 'Number of reminders that failed to send',
    example: 2,
  })
  failed: number;

  @ApiPropertyOptional({
    description: 'Details of failed reminders',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        reminderId: { type: 'string', format: 'uuid' },
        error: { type: 'string' },
      },
    },
  })
  errors?: Array<{
    reminderId: string;
    error: string;
  }>;
}
