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
  IsArray,
  IsOptional,
  MaxLength,
} from 'class-validator';

export enum AlertType {
  HEALTH = 'health',
  MEDICATION = 'medication',
  APPOINTMENT = 'appointment',
  VACCINATION = 'vaccination',
  INCIDENT = 'incident',
  SYSTEM = 'system',
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}

export class CreateAlertDto {
  @ApiProperty({
    description: 'User ID to send alert to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId: string;

  @ApiProperty({
    description: 'Alert type',
    enum: AlertType,
    example: AlertType.MEDICATION,
  })
  @IsNotEmpty({ message: 'Alert type is required' })
  @IsEnum(AlertType, { message: 'Invalid alert type' })
  alertType: AlertType;

  @ApiProperty({
    description: 'Alert severity',
    enum: AlertSeverity,
    example: AlertSeverity.WARNING,
  })
  @IsNotEmpty({ message: 'Severity is required' })
  @IsEnum(AlertSeverity, { message: 'Invalid severity' })
  severity: AlertSeverity;

  @ApiProperty({
    description: 'Alert title',
    example: 'Medication Reminder',
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  title: string;

  @ApiProperty({
    description: 'Alert message',
    example: 'Student John Doe needs to take asthma medication at 2:00 PM',
    maxLength: 1000,
  })
  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  @MaxLength(1000, { message: 'Message cannot exceed 1000 characters' })
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
}
