import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum AdministrationRoute {
  ORAL = 'oral',
  SUBLINGUAL = 'sublingual',
  BUCCAL = 'buccal',
  INTRAVENOUS = 'intravenous',
  INTRAMUSCULAR = 'intramuscular',
  SUBCUTANEOUS = 'subcutaneous',
  TOPICAL = 'topical',
  INHALATION = 'inhalation',
  RECTAL = 'rectal',
  OPHTHALMIC = 'ophthalmic',
  OTIC = 'otic',
  NASAL = 'nasal',
}

/**
 * Five Rights Verification Data DTO
 * Used to verify the Five Rights of Medication Administration before allowing administration
 */
export class FiveRightsDataDto {
  @ApiProperty({
    description: 'Student barcode scanned from ID badge',
    example: 'STU-123456',
  })
  @IsString()
  studentBarcode: string;

  @ApiProperty({
    description: 'Confirmation that patient photo was visually verified',
    example: true,
  })
  @IsBoolean()
  patientPhotoConfirmed: boolean;

  @ApiProperty({
    description: 'Medication NDC (National Drug Code) scanned from package',
    example: '12345-678-90',
  })
  @IsString()
  medicationNDC: string;

  @ApiProperty({
    description: 'Medication barcode scanned from package',
    example: '312345678901',
  })
  @IsString()
  medicationBarcode: string;

  @ApiProperty({
    description:
      'Confirmation that LASA (Look-Alike Sound-Alike) warnings were reviewed',
    example: true,
  })
  @IsBoolean()
  lasaConfirmed: boolean;

  @ApiProperty({
    description: 'Dose scanned or measured for administration',
    example: '200mg',
  })
  @IsString()
  scannedDose: string;

  @ApiProperty({
    description: 'Calculated dose based on patient weight/age (if applicable)',
    example: '200mg',
    required: false,
  })
  @IsOptional()
  @IsString()
  calculatedDose?: string;

  @ApiProperty({
    description: 'Whether dose calculator was used for calculation',
    example: false,
  })
  @IsBoolean()
  doseCalculatorUsed: boolean;

  @ApiProperty({
    description: 'Route of administration',
    enum: AdministrationRoute,
    example: AdministrationRoute.ORAL,
  })
  @IsEnum(AdministrationRoute)
  route: AdministrationRoute;

  @ApiProperty({
    description: 'Actual time of administration',
    example: '2025-11-04T10:30:00Z',
  })
  @IsDateString()
  administrationTime: string;

  @ApiProperty({
    description: 'Whether administration time is within scheduled window',
    example: true,
  })
  @IsBoolean()
  withinWindow: boolean;

  @ApiProperty({
    description: 'Reason for time override if outside window',
    example: 'Student was in class, administered as soon as they arrived',
    required: false,
  })
  @IsOptional()
  @IsString()
  timeOverrideReason?: string;

  @ApiProperty({
    description:
      'Confirmation that allergy warnings were reviewed and acknowledged',
    example: true,
  })
  @IsBoolean()
  allergyAcknowledged: boolean;

  @ApiProperty({
    description: 'List of allergy warnings displayed to administrator',
    type: [String],
    required: false,
    example: ['Penicillin allergy on file', 'No known interactions'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergyWarnings?: string[];
}

/**
 * Request DTO for verifying Five Rights
 */
export class VerifyFiveRightsDto {
  @ApiProperty({
    description: 'Administration session ID from initiation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: 'Five Rights verification data',
    type: FiveRightsDataDto,
  })
  fiveRightsData: FiveRightsDataDto;
}

/**
 * Response DTO for Five Rights verification result
 */
export class FiveRightsVerificationResultDto {
  @ApiProperty({
    description: 'Whether all Five Rights verification passed',
    example: true,
  })
  valid: boolean;

  @ApiProperty({
    description: 'List of validation errors',
    type: [String],
    example: [],
  })
  errors: string[];

  @ApiProperty({
    description: 'List of non-critical warnings',
    type: [String],
    example: ['Administration slightly outside scheduled window'],
  })
  warnings: string[];

  @ApiProperty({
    description: 'List of critical warnings requiring immediate attention',
    type: [String],
    example: [],
  })
  criticalWarnings: string[];

  @ApiProperty({
    description: 'Whether administration can proceed',
    example: true,
  })
  canProceed: boolean;

  @ApiProperty({
    description: 'Whether supervisor override is required to proceed',
    example: false,
  })
  requiresOverride: boolean;

  @ApiProperty({
    description: 'Override requirements if override needed',
    required: false,
  })
  overrideRequirements?: {
    supervisorApproval: boolean;
    documentation: string[];
  };
}
