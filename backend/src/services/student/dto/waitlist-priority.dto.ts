/**
 * @fileoverview Waitlist Priority Update DTO
 * @module student/dto
 * @description DTO for updating waitlist priority levels
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { WaitlistPriority } from './add-waitlist.dto';

export class WaitlistPriorityDto {
  @ApiProperty({
    description: 'New priority level for the waitlist entry',
    enum: WaitlistPriority,
    example: WaitlistPriority.HIGH,
  })
  @IsNotEmpty()
  @IsEnum(WaitlistPriority)
  priority: WaitlistPriority;

  @ApiProperty({
    description: 'Reason for priority change',
    example: 'Medical emergency requiring immediate attention',
  })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({
    description: 'Additional notes about the priority update',
    example: 'Sibling of current patient needs urgent care',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}