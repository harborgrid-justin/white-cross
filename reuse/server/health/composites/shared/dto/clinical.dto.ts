/**
 * LOC: DTO-CLINICAL-001
 * File: /reuse/server/health/composites/shared/dto/clinical.dto.ts
 * Purpose: Clinical decision support and medical record DTOs
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsDateString,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityDto, ClinicalCodeDto, AllergyDto, VitalSignsDto } from './common.dto';

/**
 * Clinical context for CDS Hooks
 */
export class ClinicalContextDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiProperty({ description: 'Patient diagnoses' })
  @ValidateNested({ each: true })
  @Type(() => ClinicalCodeDto)
  @IsArray()
  diagnoses: ClinicalCodeDto[];

  @ApiProperty({ description: 'Current medications' })
  @IsArray()
  @IsString({ each: true })
  medications: string[];

  @ApiProperty({ description: 'Lab results' })
  @ValidateNested({ each: true })
  @Type(() => LabResultDto)
  @IsArray()
  labResults: LabResultDto[];

  @ApiProperty({ description: 'Patient allergies' })
  @ValidateNested({ each: true })
  @Type(() => AllergyDto)
  @IsArray()
  allergies: AllergyDto[];

  @ApiPropertyOptional({ description: 'Vital signs' })
  @ValidateNested()
  @Type(() => VitalSignsDto)
  @IsOptional()
  vitals?: VitalSignsDto;

  @ApiPropertyOptional({ description: 'Patient age in years' })
  @IsNumber()
  @Min(0)
  @Max(150)
  @IsOptional()
  age?: number;

  @ApiPropertyOptional({ description: 'Patient gender' })
  @IsEnum(['male', 'female', 'other', 'unknown'])
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ description: 'Current encounter ID' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  encounterId?: string;
}

/**
 * Lab result DTO
 */
export class LabResultDto {
  @ApiProperty({ description: 'Lab test name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  testName: string;

  @ApiPropertyOptional({ description: 'LOINC code' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  loincCode?: string;

  @ApiProperty({ description: 'Result value' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  value: string;

  @ApiProperty({ description: 'Unit of measure' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  unit: string;

  @ApiPropertyOptional({ description: 'Reference range' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  referenceRange?: string;

  @ApiPropertyOptional({ description: 'Abnormal flag' })
  @IsEnum(['normal', 'high', 'low', 'critical_high', 'critical_low'])
  @IsOptional()
  abnormalFlag?: string;

  @ApiProperty({ description: 'Result date' })
  @IsDateString()
  resultDate: string;

  @ApiPropertyOptional({ description: 'Ordering provider ID' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  orderingProviderId?: string;
}

/**
 * CDS recommendation request DTO
 */
export class CDSRecommendationRequestDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiProperty({ description: 'Clinical context' })
  @ValidateNested()
  @Type(() => ClinicalContextDto)
  clinicalContext: ClinicalContextDto;

  @ApiPropertyOptional({ description: 'CDS Hook ID to invoke' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  hookId?: string;

  @ApiPropertyOptional({ description: 'Access reason for PHI' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  accessReason?: string;
}

/**
 * Order validation request DTO
 */
export class OrderValidationRequestDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiProperty({ description: 'Order type' })
  @IsEnum(['medication', 'lab', 'imaging', 'procedure', 'referral'])
  orderType: string;

  @ApiProperty({ description: 'Order details (medication name, test name, etc.)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  orderDetails: string;

  @ApiPropertyOptional({ description: 'Clinical indication/diagnosis codes' })
  @ValidateNested({ each: true })
  @Type(() => ClinicalCodeDto)
  @IsArray()
  @IsOptional()
  diagnoses?: ClinicalCodeDto[];

  @ApiProperty({ description: 'Clinical context' })
  @ValidateNested()
  @Type(() => ClinicalContextDto)
  clinicalContext: ClinicalContextDto;

  @ApiProperty({ description: 'Ordering provider ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  orderingProviderId: string;

  @ApiProperty({ description: 'Reason for order' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  orderReason: string;
}

/**
 * Diagnosis DTO
 */
export class DiagnosisDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiProperty({ description: 'Diagnosis code (ICD-10)' })
  @ValidateNested()
  @Type(() => ClinicalCodeDto)
  diagnosisCode: ClinicalCodeDto;

  @ApiPropertyOptional({ description: 'Diagnosis type' })
  @IsEnum(['primary', 'secondary', 'admitting', 'discharge'])
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ description: 'Diagnosis status' })
  @IsEnum(['active', 'resolved', 'inactive'])
  @IsOptional()
  status?: string = 'active';

  @ApiPropertyOptional({ description: 'Onset date' })
  @IsDateString()
  @IsOptional()
  onsetDate?: string;

  @ApiPropertyOptional({ description: 'Resolved date' })
  @IsDateString()
  @IsOptional()
  resolvedDate?: string;

  @ApiProperty({ description: 'Diagnosing provider ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  providerId: string;

  @ApiPropertyOptional({ description: 'Clinical notes' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  notes?: string;
}

/**
 * Clinical note DTO
 */
export class ClinicalNoteDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiProperty({ description: 'Encounter ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  encounterId: string;

  @ApiProperty({ description: 'Note type' })
  @IsEnum([
    'progress_note',
    'admission_note',
    'discharge_summary',
    'operative_note',
    'consultation',
    'history_and_physical',
  ])
  noteType: string;

  @ApiProperty({ description: 'Note content' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50000)
  content: string;

  @ApiProperty({ description: 'Author provider ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  authorId: string;

  @ApiProperty({ description: 'Note date' })
  @IsDateString()
  noteDate: string;

  @ApiPropertyOptional({ description: 'Is note signed/finalized' })
  @IsBoolean()
  @IsOptional()
  isSigned?: boolean = false;

  @ApiPropertyOptional({ description: 'Cosigner provider ID' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  cosignerId?: string;
}

/**
 * Imaging order DTO
 */
export class ImagingOrderDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiProperty({ description: 'Imaging type' })
  @IsEnum(['xray', 'ct', 'mri', 'ultrasound', 'pet', 'nuclear_medicine', 'mammogram'])
  imagingType: string;

  @ApiProperty({ description: 'Body part/region' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  bodyPart: string;

  @ApiPropertyOptional({ description: 'With contrast' })
  @IsBoolean()
  @IsOptional()
  withContrast?: boolean = false;

  @ApiProperty({ description: 'Clinical indication' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  clinicalIndication: string;

  @ApiPropertyOptional({ description: 'Diagnosis codes' })
  @ValidateNested({ each: true })
  @Type(() => ClinicalCodeDto)
  @IsArray()
  @IsOptional()
  diagnoses?: ClinicalCodeDto[];

  @ApiProperty({ description: 'Ordering provider ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  orderingProviderId: string;

  @ApiProperty({ description: 'Priority' })
  @IsEnum(['routine', 'urgent', 'stat'])
  priority: string;

  @ApiPropertyOptional({ description: 'Preferred facility' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  facility?: string;
}

/**
 * Lab order DTO
 */
export class LabOrderDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiProperty({ description: 'Lab tests to order' })
  @ValidateNested({ each: true })
  @Type(() => LabTestDto)
  @IsArray()
  @ArrayMinSize(1)
  tests: LabTestDto[];

  @ApiProperty({ description: 'Clinical indication' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  clinicalIndication: string;

  @ApiPropertyOptional({ description: 'Diagnosis codes' })
  @ValidateNested({ each: true })
  @Type(() => ClinicalCodeDto)
  @IsArray()
  @IsOptional()
  diagnoses?: ClinicalCodeDto[];

  @ApiProperty({ description: 'Ordering provider ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  orderingProviderId: string;

  @ApiProperty({ description: 'Priority' })
  @IsEnum(['routine', 'urgent', 'stat'])
  priority: string;

  @ApiPropertyOptional({ description: 'Fasting required' })
  @IsBoolean()
  @IsOptional()
  fastingRequired?: boolean = false;

  @ApiPropertyOptional({ description: 'Collection date/time' })
  @IsDateString()
  @IsOptional()
  collectionDateTime?: string;
}

/**
 * Lab test DTO
 */
export class LabTestDto {
  @ApiProperty({ description: 'Test name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  testName: string;

  @ApiPropertyOptional({ description: 'LOINC code' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  loincCode?: string;

  @ApiPropertyOptional({ description: 'Specimen type' })
  @IsEnum(['blood', 'urine', 'serum', 'plasma', 'csf', 'tissue', 'swab', 'other'])
  @IsOptional()
  specimenType?: string;

  @ApiPropertyOptional({ description: 'Specimen collection site' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  collectionSite?: string;
}

/**
 * Procedure order DTO
 */
export class ProcedureOrderDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiProperty({ description: 'Procedure name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  procedureName: string;

  @ApiPropertyOptional({ description: 'CPT code' })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  cptCode?: string;

  @ApiProperty({ description: 'Clinical indication' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  clinicalIndication: string;

  @ApiPropertyOptional({ description: 'Diagnosis codes' })
  @ValidateNested({ each: true })
  @Type(() => ClinicalCodeDto)
  @IsArray()
  @IsOptional()
  diagnoses?: ClinicalCodeDto[];

  @ApiProperty({ description: 'Ordering provider ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  orderingProviderId: string;

  @ApiPropertyOptional({ description: 'Performing provider ID' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  performingProviderId?: string;

  @ApiProperty({ description: 'Priority' })
  @IsEnum(['routine', 'urgent', 'emergent'])
  priority: string;

  @ApiPropertyOptional({ description: 'Scheduled date/time' })
  @IsDateString()
  @IsOptional()
  scheduledDateTime?: string;

  @ApiPropertyOptional({ description: 'Location/facility' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ description: 'Special instructions' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  instructions?: string;
}
