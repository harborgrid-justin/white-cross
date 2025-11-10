/**
 * Early Alert DTOs for at-risk student identification and intervention
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export enum AlertType {
  ATTENDANCE = 'attendance',
  PERFORMANCE = 'performance',
  BEHAVIOR = 'behavior',
  PARTICIPATION = 'participation',
  OTHER = 'other',
}

export enum AlertPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum AlertStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated',
}

export class CreateEarlyAlertDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  studentId: string;

  @ApiProperty({
    description: 'Course identifier',
    example: 'CS301',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  courseId: string;

  @ApiProperty({
    description: 'Faculty member creating alert',
    example: 'FAC456',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  facultyId: string;

  @ApiProperty({
    description: 'Type of alert',
    enum: AlertType,
    example: AlertType.PERFORMANCE,
  })
  @IsEnum(AlertType)
  @IsNotEmpty()
  alertType: AlertType;

  @ApiProperty({
    description: 'Alert priority level',
    enum: AlertPriority,
    example: AlertPriority.HIGH,
  })
  @IsEnum(AlertPriority)
  @IsNotEmpty()
  priority: AlertPriority;

  @ApiProperty({
    description: 'Detailed description of concern',
    example: 'Student is failing midterm exam with score of 45%',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional({
    description: 'Due date for response (ISO 8601)',
    example: '2025-11-20T23:59:59Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Staff member to assign alert to',
    example: 'ADV789',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  assignedTo?: string;
}

export class UpdateEarlyAlertDto {
  @ApiPropertyOptional({
    description: 'Updated alert status',
    enum: AlertStatus,
    example: AlertStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;

  @ApiPropertyOptional({
    description: 'Updated priority level',
    enum: AlertPriority,
    example: AlertPriority.URGENT,
  })
  @IsOptional()
  @IsEnum(AlertPriority)
  priority?: AlertPriority;

  @ApiPropertyOptional({
    description: 'Updated assigned staff',
    example: 'ADV789',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  assignedTo?: string;

  @ApiPropertyOptional({
    description: 'Intervention taken',
    example: 'Referred to tutoring center, scheduled follow-up meeting',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  interventionTaken?: string;

  @ApiPropertyOptional({
    description: 'Outcome of intervention',
    example: 'Student attending tutoring, grades improving',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  outcome?: string;
}

export class EarlyAlertResponseDto {
  @ApiProperty({
    description: 'Alert identifier',
    example: 'ALERT-1234567890',
  })
  alertId: string;

  @ApiProperty({ description: 'Student identifier', example: 'STU123' })
  studentId: string;

  @ApiProperty({ description: 'Student name', example: 'John Doe' })
  studentName: string;

  @ApiProperty({ description: 'Course identifier', example: 'CS301' })
  courseId: string;

  @ApiProperty({ description: 'Course name', example: 'Data Structures' })
  courseName: string;

  @ApiProperty({ description: 'Faculty identifier', example: 'FAC456' })
  facultyId: string;

  @ApiProperty({ description: 'Faculty name', example: 'Prof. Smith' })
  facultyName: string;

  @ApiProperty({ description: 'Alert type', enum: AlertType })
  alertType: AlertType;

  @ApiProperty({ description: 'Priority level', enum: AlertPriority })
  priority: AlertPriority;

  @ApiProperty({ description: 'Alert status', enum: AlertStatus })
  status: AlertStatus;

  @ApiProperty({ description: 'Description of concern' })
  description: string;

  @ApiProperty({ description: 'Alert created date' })
  createdDate: Date;

  @ApiProperty({ description: 'Alert due date' })
  dueDate: Date;

  @ApiPropertyOptional({ description: 'Assigned staff member' })
  assignedTo?: string;

  @ApiPropertyOptional({ description: 'Intervention taken' })
  interventionTaken?: string;

  @ApiPropertyOptional({ description: 'Outcome' })
  outcome?: string;

  @ApiPropertyOptional({ description: 'Resolved date' })
  resolvedDate?: Date;
}

export class ProcessEarlyAlertResponseDto {
  @ApiProperty({ description: 'Whether alert was routed successfully', example: true })
  routed: boolean;

  @ApiProperty({ description: 'Assigned staff member', example: 'ADV456' })
  assignedTo: string;

  @ApiProperty({ description: 'Whether notification was sent', example: true })
  notificationSent: boolean;
}

export class ResolveEarlyAlertResponseDto {
  @ApiProperty({ description: 'Whether alert was resolved', example: true })
  resolved: boolean;

  @ApiProperty({ description: 'Outcome description', example: 'Student grades improved' })
  outcome: string;

  @ApiProperty({ description: 'Whether follow-up is required', example: false })
  followUpRequired: boolean;
}
