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
import {
  EmergencyType,
  EmergencyPriority,
  BroadcastAudience,
  CommunicationChannel,
} from '../emergency-broadcast.enums';

export class CreateEmergencyBroadcastDto {
  @IsEnum(EmergencyType)
  @IsNotEmpty()
  type: EmergencyType;

  @IsEnum(EmergencyPriority)
  @IsOptional()
  priority?: EmergencyPriority;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(BroadcastAudience, { each: true })
  audience: BroadcastAudience[];

  // Targeting filters
  @IsString()
  @IsOptional()
  schoolId?: string;

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
