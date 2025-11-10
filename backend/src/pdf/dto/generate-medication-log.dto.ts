import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MedicationAdministrationDto {
  @ApiProperty({ description: 'Administration date and time' })
  @IsDateString()
  @IsNotEmpty()
  administeredAt!: string;

  @ApiProperty({ description: 'Name of person who administered' })
  @IsString()
  @IsNotEmpty()
  administeredBy!: string;

  @ApiPropertyOptional({ description: 'Name of person who verified' })
  @IsString()
  @IsOptional()
  verifiedBy?: string;

  @ApiPropertyOptional({ description: 'Administration notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class GenerateMedicationLogDto {
  @ApiProperty({ description: 'Medication ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: 'Medication name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Student name' })
  @IsString()
  @IsNotEmpty()
  studentName!: string;

  @ApiProperty({ description: 'Dosage' })
  @IsString()
  @IsNotEmpty()
  dosage!: string;

  @ApiProperty({ description: 'Route of administration' })
  @IsString()
  @IsNotEmpty()
  route!: string;

  @ApiProperty({ description: 'Frequency of administration' })
  @IsString()
  @IsNotEmpty()
  frequency!: string;

  @ApiPropertyOptional({
    description: 'Administration records',
    type: [MedicationAdministrationDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MedicationAdministrationDto)
  administrations?: MedicationAdministrationDto[];
}
