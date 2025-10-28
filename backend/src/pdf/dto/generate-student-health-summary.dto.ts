import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AllergyDto {
  @ApiProperty({ description: 'Name of the allergen' })
  @IsString()
  @IsNotEmpty()
  allergen: string;

  @ApiProperty({ description: 'Severity of the allergy' })
  @IsString()
  @IsNotEmpty()
  severity: string;

  @ApiPropertyOptional({ description: 'Reaction description' })
  @IsString()
  @IsOptional()
  reaction?: string;
}

export class MedicationDto {
  @ApiProperty({ description: 'Medication name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Dosage' })
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiProperty({ description: 'Frequency of administration' })
  @IsString()
  @IsNotEmpty()
  frequency: string;

  @ApiProperty({ description: 'Route of administration' })
  @IsString()
  @IsNotEmpty()
  route: string;
}

export class ChronicConditionDto {
  @ApiProperty({ description: 'Diagnosis name' })
  @IsString()
  @IsNotEmpty()
  diagnosisName: string;
}

export class GenerateStudentHealthSummaryDto {
  @ApiProperty({ description: 'Student ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Student first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Student last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Date of birth' })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiPropertyOptional({ description: 'Student grade' })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiPropertyOptional({ description: 'Student number' })
  @IsString()
  @IsOptional()
  studentNumber?: string;

  @ApiPropertyOptional({ description: 'List of allergies', type: [AllergyDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AllergyDto)
  allergies?: AllergyDto[];

  @ApiPropertyOptional({
    description: 'List of medications',
    type: [MedicationDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MedicationDto)
  medications?: MedicationDto[];

  @ApiPropertyOptional({
    description: 'List of chronic conditions',
    type: [ChronicConditionDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChronicConditionDto)
  chronicConditions?: ChronicConditionDto[];
}
