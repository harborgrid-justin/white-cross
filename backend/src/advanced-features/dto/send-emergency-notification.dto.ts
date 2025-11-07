/**
 * @fileoverview Send Emergency Notification DTO
 * @module advanced-features/dto/send-emergency-notification.dto
 * @description DTO for sending emergency notifications
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export enum EmergencyType {
  MEDICAL = 'medical',
  SAFETY = 'safety',
  EVACUATION = 'evacuation',
  LOCKDOWN = 'lockdown',
  WEATHER = 'weather',
  OTHER = 'other',
}

export enum EmergencySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class SendEmergencyNotificationDto {
  @ApiProperty({
    description: 'Student ID (if student-specific emergency)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: 'Student ID must be a valid UUID' })
  studentId?: string;

  @ApiProperty({
    description: 'Emergency type',
    enum: EmergencyType,
    example: EmergencyType.MEDICAL,
  })
  @IsNotEmpty({ message: 'Emergency type is required' })
  @IsEnum(EmergencyType, { message: 'Invalid emergency type' })
  emergencyType: EmergencyType;

  @ApiProperty({
    description: 'Emergency severity',
    enum: EmergencySeverity,
    example: EmergencySeverity.HIGH,
  })
  @IsNotEmpty({ message: 'Severity is required' })
  @IsEnum(EmergencySeverity, { message: 'Invalid severity' })
  severity: EmergencySeverity;

  @ApiProperty({
    description: 'Emergency title',
    example: 'Medical Emergency - Room 201',
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  title: string;

  @ApiProperty({
    description: 'Emergency message',
    example: 'Student requires immediate medical attention',
    maxLength: 1000,
  })
  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  @MaxLength(1000, { message: 'Message cannot exceed 1000 characters' })
  message: string;

  @ApiProperty({
    description: 'Location of emergency',
    example: 'Building A, Room 201',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Recipient user IDs (if not broadcasting)',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true, message: 'Each recipient ID must be a valid UUID' })
  recipientIds?: string[];
}
