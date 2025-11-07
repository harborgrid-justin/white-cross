import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AdministrationRoute,
  FiveRightsDataDto,
} from './five-rights-verification.dto';

export enum StudentResponse {
  NORMAL = 'normal',
  UNUSUAL = 'unusual',
  ADVERSE = 'adverse',
}

/**
 * Vital Signs DTO
 */
export class VitalSignsDto {
  @ApiProperty({
    description: 'Blood pressure reading',
    example: '120/80',
    required: false,
  })
  @IsOptional()
  @IsString()
  bloodPressure?: string;

  @ApiProperty({
    description: 'Heart rate in beats per minute',
    example: 75,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  heartRate?: number;

  @ApiProperty({
    description: 'Temperature in Fahrenheit',
    example: 98.6,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiProperty({
    description: 'Respiratory rate in breaths per minute',
    example: 16,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  respiratoryRate?: number;

  @ApiProperty({
    description: 'Oxygen saturation percentage',
    example: 98,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  oxygenSaturation?: number;
}

/**
 * Record Medication Administration DTO
 * Used to record actual medication administration after Five Rights verification
 */
export class RecordAdministrationDto {
  @ApiProperty({
    description: 'Administration session ID from initiation and verification',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: 'Prescription ID being administered',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  prescriptionId: string;

  @ApiProperty({
    description: 'Student ID receiving medication',
    example: '770e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  studentId: string;

  @ApiProperty({
    description: 'Medication ID being administered',
    example: '880e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  medicationId: string;

  @ApiProperty({
    description: 'Actual dosage administered',
    example: '200mg',
  })
  @IsString()
  dosageAdministered: string;

  @ApiProperty({
    description: 'Route of administration',
    enum: AdministrationRoute,
    example: AdministrationRoute.ORAL,
  })
  @IsEnum(AdministrationRoute)
  route: AdministrationRoute;

  @ApiProperty({
    description: 'Timestamp when medication was administered',
    example: '2025-11-04T10:30:00Z',
  })
  @IsString()
  administeredAt: string;

  @ApiProperty({
    description: 'User ID of administrator (nurse)',
    example: '990e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  administeredBy: string;

  @ApiProperty({
    description: 'Five Rights verification data',
    type: FiveRightsDataDto,
  })
  @ValidateNested()
  @Type(() => FiveRightsDataDto)
  fiveRightsData: FiveRightsDataDto;

  @ApiProperty({
    description: 'Witness ID for controlled substances',
    example: 'aa0e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsString()
  witnessId?: string;

  @ApiProperty({
    description: 'Witness signature for controlled substances',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
    required: false,
  })
  @IsOptional()
  @IsString()
  witnessSignature?: string;

  @ApiProperty({
    description: 'Additional notes about administration',
    example: 'Student took medication without difficulty',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Vital signs taken at time of administration',
    type: VitalSignsDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => VitalSignsDto)
  vitalSigns?: VitalSignsDto;

  @ApiProperty({
    description: 'Student response to medication',
    enum: StudentResponse,
    example: StudentResponse.NORMAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(StudentResponse)
  studentResponse?: StudentResponse;

  @ApiProperty({
    description: 'Whether follow-up is required',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @ApiProperty({
    description: 'Notes for follow-up if required',
    example: 'Monitor for rash in next 2 hours',
    required: false,
  })
  @IsOptional()
  @IsString()
  followUpNotes?: string;
}

/**
 * Initiate Administration Session DTO
 */
export class InitiateAdministrationDto {
  @ApiProperty({
    description: 'Prescription ID to initiate administration for',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  prescriptionId: string;
}
