import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImmunizationStudentDto {
  @ApiProperty({ description: 'Student first name' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ description: 'Student last name' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiPropertyOptional({ description: 'Student grade' })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiProperty({ description: 'Whether student is compliant' })
  @IsBoolean()
  @IsNotEmpty()
  compliant!: boolean;

  @ApiPropertyOptional({ description: 'List of missing vaccines' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  missingVaccines?: string[];
}

export class GenerateImmunizationReportDto {
  @ApiProperty({ description: 'Organization name' })
  @IsString()
  @IsNotEmpty()
  organizationName!: string;

  @ApiProperty({ description: 'Total number of students' })
  @IsNumber()
  @IsNotEmpty()
  totalStudents!: number;

  @ApiProperty({ description: 'Number of compliant students' })
  @IsNumber()
  @IsNotEmpty()
  compliantStudents!: number;

  @ApiProperty({ description: 'Compliance rate percentage' })
  @IsNumber()
  @IsNotEmpty()
  complianceRate!: number;

  @ApiPropertyOptional({
    description: 'List of students',
    type: [ImmunizationStudentDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ImmunizationStudentDto)
  students?: ImmunizationStudentDto[];
}
