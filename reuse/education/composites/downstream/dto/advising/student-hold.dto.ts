/**
 * Student Hold DTOs for managing registration and administrative holds
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsBoolean,
  IsArray,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export enum HoldType {
  ACADEMIC = 'academic',
  FINANCIAL = 'financial',
  CONDUCT = 'conduct',
  REGISTRATION = 'registration',
  IMMUNIZATION = 'immunization',
  ADMINISTRATIVE = 'administrative',
}

export class CreateStudentHoldDto {
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
    description: 'Type of hold',
    enum: HoldType,
    example: HoldType.FINANCIAL,
  })
  @IsEnum(HoldType)
  @IsNotEmpty()
  holdType: HoldType;

  @ApiProperty({
    description: 'Hold description',
    example: 'Unpaid tuition balance',
    minLength: 5,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Reason for hold',
    example: 'Outstanding balance of $5,000 from Fall 2024 semester',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  reason: string;

  @ApiProperty({
    description: 'Staff member placing hold',
    example: 'BURSAR-01',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  placedBy: string;

  @ApiProperty({
    description: 'Restrictions applied',
    type: [String],
    example: ['Cannot register for classes', 'Cannot receive transcript'],
  })
  @IsArray()
  @IsString({ each: true })
  restrictionsApplied: string[];

  @ApiProperty({
    description: 'Whether student can register for classes',
    example: false,
  })
  @IsBoolean()
  canRegister: boolean;

  @ApiProperty({
    description: 'Whether student can graduate',
    example: true,
  })
  @IsBoolean()
  canGraduate: boolean;

  @ApiProperty({
    description: 'Whether student can receive transcript',
    example: false,
  })
  @IsBoolean()
  canReceiveTranscript: boolean;
}

export class StudentHoldResponseDto {
  @ApiProperty({ description: 'Hold identifier', example: 'HOLD-1234567890' })
  holdId: string;

  @ApiProperty({ description: 'Student identifier', example: 'STU123' })
  studentId: string;

  @ApiProperty({ description: 'Student name', example: 'John Doe' })
  studentName: string;

  @ApiProperty({ description: 'Hold type', enum: HoldType })
  holdType: HoldType;

  @ApiProperty({ description: 'Hold description', example: 'Unpaid tuition balance' })
  description: string;

  @ApiProperty({ description: 'Date hold was placed' })
  placedDate: Date;

  @ApiProperty({ description: 'Staff member who placed hold', example: 'BURSAR-01' })
  placedBy: string;

  @ApiProperty({ description: 'Reason for hold' })
  reason: string;

  @ApiProperty({ description: 'Restrictions applied', type: [String] })
  restrictionsApplied: string[];

  @ApiProperty({ description: 'Can register for classes', example: false })
  canRegister: boolean;

  @ApiProperty({ description: 'Can graduate', example: true })
  canGraduate: boolean;

  @ApiProperty({ description: 'Can receive transcript', example: false })
  canReceiveTranscript: boolean;

  @ApiPropertyOptional({ description: 'Date hold was resolved' })
  resolvedDate?: Date;

  @ApiPropertyOptional({ description: 'Staff member who resolved hold' })
  resolvedBy?: string;
}

export class ResolveStudentHoldResponseDto {
  @ApiProperty({ description: 'Whether hold was resolved successfully', example: true })
  resolved: boolean;

  @ApiProperty({ description: 'Resolution date' })
  resolvedDate: Date;

  @ApiProperty({ description: 'Whether student notification was sent', example: true })
  notificationSent: boolean;
}

export class ValidateHoldRestrictionsResponseDto {
  @ApiProperty({ description: 'Whether action is allowed', example: false })
  allowed: boolean;

  @ApiProperty({ description: 'Blocking holds', type: [StudentHoldResponseDto] })
  blockingHolds: StudentHoldResponseDto[];

  @ApiProperty({ description: 'Whether override is possible', example: false })
  override: boolean;

  @ApiPropertyOptional({ description: 'Override reason required' })
  overrideReasonRequired?: boolean;
}

export class HoldResolutionWorkflowResponseDto {
  @ApiProperty({ description: 'Resolution steps', type: [String] })
  steps: string[];

  @ApiProperty({ description: 'Responsible parties', type: [String] })
  responsibleParties: string[];

  @ApiProperty({ description: 'Estimated resolution time', example: '2-3 business days' })
  estimatedTime: string;
}
