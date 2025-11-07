/**
 * LOC: EMERGENCY-BROADCAST-DTO-CREATE-001
 * DTO for creating emergency broadcast
 */

import {
  IsEnum,
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  ArrayMinSize,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EmergencyType,
  EmergencyPriority,
  BroadcastAudience,
  CommunicationChannel,
} from '@/emergency-broadcast';

export class CreateEmergencyBroadcastDto {
  @ApiProperty({
    description: 'Type of emergency',
    enum: EmergencyType,
    example: EmergencyType.MEDICAL_EMERGENCY,
  })
  @IsEnum(EmergencyType)
  @IsNotEmpty()
  type: EmergencyType;

  @ApiPropertyOptional({
    description: 'Priority level of the emergency',
    enum: EmergencyPriority,
    example: EmergencyPriority.HIGH,
  })
  @IsEnum(EmergencyPriority)
  @IsOptional()
  priority?: EmergencyPriority;

  @ApiProperty({
    description: 'Brief title of the emergency broadcast',
    example: 'Medical Emergency - Building A',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Detailed message content',
    example:
      'A medical emergency is in progress in Building A. Please avoid this area and follow staff instructions.',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;

  @ApiProperty({
    description: 'Target audience for the broadcast',
    enum: BroadcastAudience,
    isArray: true,
    example: [BroadcastAudience.ALL_PARENTS, BroadcastAudience.ALL_STAFF],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(BroadcastAudience, { each: true })
  audience: BroadcastAudience[];

  // Targeting filters
  @ApiPropertyOptional({
    description: 'Filter to specific school (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  schoolId?: string;

  @ApiPropertyOptional({
    description: 'Filter to specific grade level',
    example: '3rd Grade',
  })
  @IsString()
  @IsOptional()
  gradeLevel?: string;

  @IsString()
  @IsOptional()
  classId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  groupIds?: string[];

  // Delivery options
  @IsArray()
  @IsEnum(CommunicationChannel, { each: true })
  @IsOptional()
  channels?: CommunicationChannel[];

  @IsBoolean()
  @IsOptional()
  requiresAcknowledgment?: boolean;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expiresAt?: Date;

  @IsString()
  @IsNotEmpty()
  sentBy: string;

  // Follow-up
  @IsBoolean()
  @IsOptional()
  followUpRequired?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  followUpInstructions?: string;
}
