import { IsDate, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PrescriptionStatus } from '../../enums/prescription-status.enum';

/**
 * DTO for creating a new prescription
 */
export class CreatePrescriptionDto {
  @ApiProperty({
    description: 'Student ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  studentId: string;

  @ApiPropertyOptional({ description: 'Associated clinic visit ID' })
  @IsUUID()
  @IsOptional()
  visitId?: string;

  @ApiPropertyOptional({ description: 'Associated treatment plan ID' })
  @IsUUID()
  @IsOptional()
  treatmentPlanId?: string;

  @ApiProperty({
    description: 'Prescribing physician/provider',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  prescribedBy: string;

  @ApiProperty({ description: 'Drug name', example: 'Amoxicillin' })
  @IsString()
  drugName: string;

  @ApiPropertyOptional({
    description: 'Drug code (NDC, etc.)',
    example: '00093-4155-73',
  })
  @IsString()
  @IsOptional()
  drugCode?: string;

  @ApiProperty({ description: 'Dosage amount', example: '500mg' })
  @IsString()
  dosage: string;

  @ApiProperty({
    description: 'Frequency of administration',
    example: 'Three times daily',
  })
  @IsString()
  frequency: string;

  @ApiProperty({ description: 'Route of administration', example: 'Oral' })
  @IsString()
  route: string;

  @ApiProperty({ description: 'Quantity to dispense', example: 30, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Number of refills authorized',
    example: 2,
    minimum: 0,
    default: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  refillsAuthorized?: number = 0;

  @ApiProperty({ description: 'Start date', example: '2025-10-28' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({ description: 'End date (if applicable)' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Special instructions for patient' })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiPropertyOptional({
    description: 'Initial status',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.PENDING,
  })
  @IsEnum(PrescriptionStatus)
  @IsOptional()
  status?: PrescriptionStatus;

  @ApiPropertyOptional({ description: 'Pharmacy name' })
  @IsString()
  @IsOptional()
  pharmacyName?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
