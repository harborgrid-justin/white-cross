/**
 * LOC: DTO-MEDICATION-001
 * File: /reuse/server/health/composites/shared/dto/medication.dto.ts
 * Purpose: Medication and prescription DTOs
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
  MinLength,
  MaxLength,
  Matches,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityDto, ClinicalCodeDto, ProviderIdentifierDto } from './common.dto';

/**
 * Medication frequency/route enums
 */
export enum MedicationRoute {
  ORAL = 'oral',
  IV = 'intravenous',
  IM = 'intramuscular',
  SC = 'subcutaneous',
  TOPICAL = 'topical',
  INHALATION = 'inhalation',
  SUBLINGUAL = 'sublingual',
  RECTAL = 'rectal',
  OPHTHALMIC = 'ophthalmic',
  OTIC = 'otic',
  NASAL = 'nasal',
  TRANSDERMAL = 'transdermal',
}

export enum MedicationFrequency {
  QD = 'once_daily',
  BID = 'twice_daily',
  TID = 'three_times_daily',
  QID = 'four_times_daily',
  Q4H = 'every_4_hours',
  Q6H = 'every_6_hours',
  Q8H = 'every_8_hours',
  Q12H = 'every_12_hours',
  PRN = 'as_needed',
  STAT = 'immediately',
  QHS = 'at_bedtime',
  QAM = 'in_morning',
}

export enum DEASchedule {
  SCHEDULE_I = 'I',
  SCHEDULE_II = 'II',
  SCHEDULE_III = 'III',
  SCHEDULE_IV = 'IV',
  SCHEDULE_V = 'V',
  NON_CONTROLLED = 'non_controlled',
}

/**
 * Prescription creation DTO
 */
export class CreatePrescriptionDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiProperty({ description: 'Medication name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  medicationName: string;

  @ApiPropertyOptional({ description: 'NDC (National Drug Code)' })
  @IsString()
  @IsOptional()
  @Matches(/^\d{5}-\d{4}-\d{2}$|^\d{11}$/, { message: 'Invalid NDC format' })
  ndcCode?: string;

  @ApiProperty({ description: 'Dosage (e.g., "500mg", "10ml")' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  dosage: string;

  @ApiProperty({ description: 'Route of administration', enum: MedicationRoute })
  @IsEnum(MedicationRoute)
  route: MedicationRoute;

  @ApiProperty({ description: 'Frequency', enum: MedicationFrequency })
  @IsEnum(MedicationFrequency)
  frequency: MedicationFrequency;

  @ApiProperty({ description: 'Quantity to dispense' })
  @IsNumber()
  @Min(1)
  @Max(10000)
  quantity: number;

  @ApiProperty({ description: 'Number of refills allowed' })
  @IsNumber()
  @Min(0)
  @Max(12)
  refills: number;

  @ApiPropertyOptional({ description: 'Days supply' })
  @IsNumber()
  @Min(1)
  @Max(365)
  @IsOptional()
  daysSupply?: number;

  @ApiPropertyOptional({ description: 'Special instructions for patient' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  instructions?: string;

  @ApiPropertyOptional({ description: 'Indication/reason for prescription' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  indication?: string;

  @ApiProperty({ description: 'Is this a controlled substance?', default: false })
  @IsBoolean()
  @IsOptional()
  isControlledSubstance?: boolean = false;

  @ApiPropertyOptional({ description: 'DEA schedule if controlled substance', enum: DEASchedule })
  @IsEnum(DEASchedule)
  @IsOptional()
  deaSchedule?: DEASchedule;

  @ApiPropertyOptional({ description: 'Start date' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Allow generic substitution', default: true })
  @IsBoolean()
  @IsOptional()
  allowGenericSubstitution?: boolean = true;

  @ApiPropertyOptional({ description: 'Pharmacy ID' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  pharmacyId?: string;

  @ApiPropertyOptional({ description: 'Pharmacy NCPDP ID' })
  @IsString()
  @IsOptional()
  @Matches(/^\d{7}$/, { message: 'NCPDP must be 7 digits' })
  ncpdpId?: string;

  @ApiPropertyOptional({ description: 'Clinical codes associated with prescription' })
  @ValidateNested({ each: true })
  @Type(() => ClinicalCodeDto)
  @IsArray()
  @IsOptional()
  diagnoses?: ClinicalCodeDto[];

  @ApiProperty({ description: 'Reason for prescription (required for audit)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  prescriptionReason: string;
}

/**
 * EPCS (Electronic Prescribing of Controlled Substances) DTO
 */
export class EPCSPrescriptionDto extends CreatePrescriptionDto {
  @ApiProperty({ description: 'Two-factor authentication token' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(10)
  twoFactorToken: string;

  @ApiProperty({ description: 'Provider DEA number' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}\d{7}$/, { message: 'Invalid DEA number format' })
  deaNumber: string;

  @ApiProperty({ description: 'Provider NPI' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: 'NPI must be 10 digits' })
  npi: string;

  @ApiProperty({ description: 'EPCS digital signature' })
  @IsString()
  @IsNotEmpty()
  digitalSignature: string;

  @ApiProperty({ description: 'This is a controlled substance', default: true })
  @IsBoolean()
  isControlledSubstance: boolean = true;

  @ApiProperty({ description: 'DEA schedule (required for controlled substances)', enum: DEASchedule })
  @IsEnum(DEASchedule)
  deaSchedule: DEASchedule;
}

/**
 * Medication administration record DTO
 */
export class MedicationAdministrationDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiProperty({ description: 'Medication order ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  orderId: string;

  @ApiProperty({ description: 'Medication name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  medicationName: string;

  @ApiProperty({ description: 'Dosage administered' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  dosageAdministered: string;

  @ApiProperty({ description: 'Route of administration', enum: MedicationRoute })
  @IsEnum(MedicationRoute)
  route: MedicationRoute;

  @ApiProperty({ description: 'Administration timestamp' })
  @IsDateString()
  administeredAt: string;

  @ApiProperty({ description: 'Administering nurse/provider ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  administeredBy: string;

  @ApiPropertyOptional({ description: 'Patient barcode scanned' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  patientBarcode?: string;

  @ApiPropertyOptional({ description: 'Medication barcode scanned' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  medicationBarcode?: string;

  @ApiProperty({ description: 'Five rights check completed', default: false })
  @IsBoolean()
  fiveRightsVerified: boolean;

  @ApiPropertyOptional({ description: 'Site of administration (for injections)' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  administrationSite?: string;

  @ApiPropertyOptional({ description: 'Patient response/notes' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({ description: 'Witness ID (for controlled substances)' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  witnessId?: string;

  @ApiProperty({ description: 'Is this a controlled substance?', default: false })
  @IsBoolean()
  @IsOptional()
  isControlledSubstance?: boolean = false;

  @ApiProperty({ description: 'Administration reason (for PRN medications)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  administrationReason: string;
}

/**
 * Barcode verification DTO
 */
export class BarcodeVerificationDto {
  @ApiProperty({ description: 'Patient barcode' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  patientBarcode: string;

  @ApiProperty({ description: 'Medication barcode' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  medicationBarcode: string;

  @ApiProperty({ description: 'Order ID to verify against' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  orderId: string;

  @ApiProperty({ description: 'Scanning user ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  scanningUserId: string;
}

/**
 * Medication refill request DTO
 */
export class RefillRequestDto {
  @ApiProperty({ description: 'Prescription ID to refill' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  prescriptionId: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiPropertyOptional({ description: 'Pharmacy ID for pickup' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  pharmacyId?: string;

  @ApiPropertyOptional({ description: 'Reason for refill request' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  reason?: string;

  @ApiProperty({ description: 'Request date' })
  @IsDateString()
  requestDate: string;
}

/**
 * Medication discontinuation DTO
 */
export class DiscontinueMedicationDto {
  @ApiProperty({ description: 'Prescription/Order ID to discontinue' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  prescriptionId: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiProperty({ description: 'Reason for discontinuation' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  discontinuationReason: string;

  @ApiProperty({ description: 'Discontinuing provider ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  discontinuedBy: string;

  @ApiProperty({ description: 'Discontinuation date' })
  @IsDateString()
  discontinuedAt: string;

  @ApiPropertyOptional({ description: 'Alternative medication prescribed' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  alternativeMedication?: string;
}

/**
 * Drug interaction check DTO
 */
export class DrugInteractionCheckDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiProperty({ description: 'New medication to check' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  newMedication: string;

  @ApiPropertyOptional({ description: 'Current medications list' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  currentMedications?: string[];

  @ApiPropertyOptional({ description: 'Patient allergies' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[];

  @ApiPropertyOptional({ description: 'Check severity levels', default: ['major', 'contraindicated'] })
  @IsArray()
  @IsEnum(['minor', 'moderate', 'major', 'contraindicated'], { each: true })
  @IsOptional()
  severityLevels?: string[] = ['major', 'contraindicated'];
}

/**
 * Medication history query DTO
 */
export class MedicationHistoryQueryDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiPropertyOptional({ description: 'Include inactive medications', default: false })
  @IsBoolean()
  @IsOptional()
  includeInactive?: boolean = false;

  @ApiPropertyOptional({ description: 'Start date for history' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for history' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Include controlled substances only' })
  @IsBoolean()
  @IsOptional()
  controlledSubstancesOnly?: boolean = false;
}
