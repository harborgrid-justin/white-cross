import { IsString, IsArray, IsEnum, IsOptional, IsObject, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { NotificationCategory, NotificationPriority } from '../enums';

/**
 * Notification Action DTO
 */
export class NotificationActionDto {
  @ApiProperty({ description: 'Action label' })
  @IsString()
  label: string;

  @ApiProperty({ description: 'Action identifier' })
  @IsString()
  action: string;

  @ApiProperty({ description: 'Action icon URL', required: false })
  @IsString()
  @IsOptional()
  icon?: string;
}

/**
 * DTO for sending push notifications
 */
export class SendNotificationDto {
  @ApiProperty({ description: 'Array of user IDs to send notification to' })
  @IsArray()
  @IsString({ each: true })
  userIds: string[];

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification body text' })
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Notification category',
    enum: NotificationCategory
  })
  @IsEnum(NotificationCategory)
  category: NotificationCategory;

  @ApiProperty({
    description: 'Notification priority',
    enum: NotificationPriority,
    required: false,
    default: NotificationPriority.NORMAL
  })
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @ApiProperty({ description: 'Additional data payload', required: false })
  @IsObject()
  @IsOptional()
  data?: Record<string, string>;

  @ApiProperty({ description: 'Notification actions', required: false, type: [NotificationActionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationActionDto)
  @IsOptional()
  actions?: NotificationActionDto[];

  @ApiProperty({ description: 'Image URL', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'Sound name', required: false })
  @IsString()
  @IsOptional()
  sound?: string;

  @ApiProperty({ description: 'Badge count', required: false })
  @IsNumber()
  @IsOptional()
  badge?: number;

  @ApiProperty({ description: 'Scheduled delivery time', required: false })
  @IsOptional()
  scheduledFor?: Date;
}
