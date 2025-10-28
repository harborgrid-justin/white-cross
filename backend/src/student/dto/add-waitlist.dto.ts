/**
 * @fileoverview Add Student to Waitlist DTO
 * @module student/dto
 * @description DTO for adding students to appointment waitlists
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';

/**
 * Waitlist Priority Levels
 */
export enum WaitlistPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Add Student to Waitlist DTO
 *
 * Used for adding students to appointment waitlists:
 * - Waitlist for specific appointment types
 * - Priority-based queuing
 * - Automatic notifications when slots become available
 *
 * Priority Levels:
 * - LOW: Non-urgent routine care
 * - MEDIUM: Standard appointments
 * - HIGH: Important but not emergency
 * - URGENT: Near-emergency, needs quick attention
 */
export class AddWaitlistDto {
  @ApiProperty({
    description: 'Student UUID to add to waitlist',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID('4')
  studentId: string;

  @ApiProperty({
    description: 'Type of appointment needed',
    example: 'vision_screening',
  })
  @IsNotEmpty()
  @IsString()
  appointmentType: string;

  @ApiPropertyOptional({
    description: 'Priority level for waitlist placement',
    enum: WaitlistPriority,
    example: WaitlistPriority.MEDIUM,
    default: WaitlistPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(WaitlistPriority)
  priority?: WaitlistPriority = WaitlistPriority.MEDIUM;

  @ApiPropertyOptional({
    description: 'Additional notes about waitlist request',
    example: 'Student needs vision screening before returning to class',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
