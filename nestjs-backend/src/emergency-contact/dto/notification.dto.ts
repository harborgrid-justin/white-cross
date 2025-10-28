/**
 * Notification DTO
 *
 * Data Transfer Object for sending notifications to emergency contacts.
 */
import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  IsUUID,
  MinLength,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationChannel } from '../../contact/enums';

export enum NotificationType {
  EMERGENCY = 'emergency',
  HEALTH = 'health',
  MEDICATION = 'medication',
  GENERAL = 'general',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class NotificationDto {
  @ApiProperty({
    description: 'Notification message content',
    example: 'Your child has a minor injury and is in the nurse\'s office.',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  message: string;

  @ApiProperty({
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.EMERGENCY,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Priority level',
    enum: NotificationPriority,
    example: NotificationPriority.HIGH,
  })
  @IsEnum(NotificationPriority)
  priority: NotificationPriority;

  @ApiProperty({
    description: 'Student ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Notification channels to use',
    example: ['sms', 'email'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  channels: NotificationChannel[];

  @ApiPropertyOptional({
    description: 'File attachments (URLs or paths)',
    example: ['https://example.com/document.pdf'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
