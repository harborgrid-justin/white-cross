import {
  IsUUID,
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
  IsDate,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentType } from './create-appointment.dto';

/**
 * Waitlist priority levels
 */
export enum WaitlistPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/**
 * Waitlist status tracking
 */
export enum WaitlistStatus {
  WAITING = 'WAITING',
  NOTIFIED = 'NOTIFIED',
  SCHEDULED = 'SCHEDULED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

/**
 * DTO for adding student to appointment waitlist
 */
export class CreateWaitlistEntryDto {
  @ApiProperty({
    description: 'Student UUID to add to waitlist',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiPropertyOptional({
    description:
      'Preferred nurse UUID (optional - any available nurse if not specified)',
    example: '987fcdeb-51a2-43d1-b456-426614174001',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  nurseId?: string;

  @ApiProperty({
    description: 'Type of appointment needed',
    enum: AppointmentType,
    example: AppointmentType.ROUTINE_CHECKUP,
  })
  @IsEnum(AppointmentType)
  @IsNotEmpty()
  type: AppointmentType;

  @ApiProperty({
    description: 'Reason for the appointment',
    example: 'Student needs medication administration',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({
    description: 'Priority level for waitlist positioning',
    enum: WaitlistPriority,
    example: WaitlistPriority.NORMAL,
    default: WaitlistPriority.NORMAL,
  })
  @IsOptional()
  @IsEnum(WaitlistPriority)
  priority?: WaitlistPriority;

  @ApiPropertyOptional({
    description: 'Preferred appointment date',
    example: '2025-10-28',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  preferredDate?: Date;

  @ApiPropertyOptional({
    description: 'Preferred appointment duration in minutes',
    example: 30,
    minimum: 15,
    maximum: 120,
    default: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(120)
  duration?: number;

  @ApiPropertyOptional({
    description: 'Additional notes for the waitlist entry',
    example: 'Student available only in afternoons',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * DTO for filtering waitlist entries
 */
export class WaitlistFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by nurse UUID',
    example: '987fcdeb-51a2-43d1-b456-426614174001',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  nurseId?: string;

  @ApiPropertyOptional({
    description: 'Filter by student UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Filter by waitlist status',
    enum: WaitlistStatus,
    example: WaitlistStatus.WAITING,
  })
  @IsOptional()
  @IsEnum(WaitlistStatus)
  status?: WaitlistStatus;

  @ApiPropertyOptional({
    description: 'Filter by priority level',
    enum: WaitlistPriority,
    example: WaitlistPriority.NORMAL,
  })
  @IsOptional()
  @IsEnum(WaitlistPriority)
  priority?: WaitlistPriority;

  @ApiPropertyOptional({
    description: 'Filter by appointment type',
    enum: AppointmentType,
    example: AppointmentType.ROUTINE_CHECKUP,
  })
  @IsOptional()
  @IsEnum(AppointmentType)
  type?: AppointmentType;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

/**
 * DTO for updating waitlist entry priority
 */
export class UpdateWaitlistPriorityDto {
  @ApiProperty({
    description: 'New priority level',
    enum: WaitlistPriority,
    example: WaitlistPriority.HIGH,
  })
  @IsEnum(WaitlistPriority)
  @IsNotEmpty()
  priority: WaitlistPriority;
}

/**
 * DTO for removing from waitlist
 */
export class RemoveFromWaitlistDto {
  @ApiPropertyOptional({
    description: 'Reason for removing from waitlist',
    example: 'Student no longer needs appointment',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

/**
 * DTO for notifying waitlist entry
 */
export class NotifyWaitlistEntryDto {
  @ApiPropertyOptional({
    description: 'Custom notification message',
    example: 'An appointment slot has become available for tomorrow at 2:00 PM',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
