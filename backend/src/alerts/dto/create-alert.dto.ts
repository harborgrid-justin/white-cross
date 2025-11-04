/**
 * @fileoverview Create Alert DTO
 * @module alerts/dto/create-alert.dto
 * @description DTO for creating alerts/notifications
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsObject,
  MaxLength,
} from 'class-validator';

export enum AlertSeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY',
}

export enum AlertCategory {
  HEALTH = 'HEALTH',
  SAFETY = 'SAFETY',
  COMPLIANCE = 'COMPLIANCE',
  SYSTEM = 'SYSTEM',
  MEDICATION = 'MEDICATION',
  APPOINTMENT = 'APPOINTMENT',
}

export class CreateAlertDto {
  @ApiProperty({
    description: 'Alert definition ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Definition ID must be a valid UUID' })
  definitionId?: string;

  @ApiProperty({
    description: 'Alert severity',
    enum: AlertSeverity,
    example: AlertSeverity.HIGH,
  })
  @IsNotEmpty({ message: 'Severity is required' })
  @IsEnum(AlertSeverity, { message: 'Invalid severity' })
  severity: AlertSeverity;

  @ApiProperty({
    description: 'Alert category',
    enum: AlertCategory,
    example: AlertCategory.MEDICATION,
  })
  @IsNotEmpty({ message: 'Category is required' })
  @IsEnum(AlertCategory, { message: 'Invalid category' })
  category: AlertCategory;

  @ApiProperty({
    description: 'Alert title',
    example: 'Medication Reminder',
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(500, { message: 'Title cannot exceed 500 characters' })
  title: string;

  @ApiProperty({
    description: 'Alert message',
    example: 'Student John Doe needs to take asthma medication at 2:00 PM',
    maxLength: 5000,
  })
  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  @MaxLength(5000, { message: 'Message cannot exceed 5000 characters' })
  message: string;

  @ApiProperty({
    description: 'Related student ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Student ID must be a valid UUID' })
  studentId?: string;

  @ApiProperty({
    description: 'User ID to send alert to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId?: string;

  @ApiProperty({
    description: 'School ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'School ID must be a valid UUID' })
  schoolId?: string;

  @ApiProperty({
    description: 'Additional metadata',
    example: { medicationId: '123', dose: '10mg' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Expiration date',
    example: '2023-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @ApiProperty({
    description: 'Auto-escalate after minutes',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  autoEscalateAfter?: number;

  @ApiProperty({
    description: 'Requires acknowledgment',
    example: true,
    default: false,
  })
  @IsNotEmpty({ message: 'Requires acknowledgment is required' })
  @IsBoolean()
  requiresAcknowledgment: boolean;
}
