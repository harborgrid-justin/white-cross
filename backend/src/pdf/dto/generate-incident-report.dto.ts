import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateIncidentReportDto {
  @ApiProperty({ description: 'Incident ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: 'Incident date and time' })
  @IsDateString()
  @IsNotEmpty()
  incidentDateTime!: string;

  @ApiProperty({ description: 'Location of incident' })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({ description: 'Severity of incident' })
  @IsString()
  @IsNotEmpty()
  severity!: string;

  @ApiProperty({ description: 'Student name' })
  @IsString()
  @IsNotEmpty()
  studentName!: string;

  @ApiPropertyOptional({ description: 'Student grade' })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiProperty({ description: 'Incident description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({ description: 'Actions taken' })
  @IsString()
  @IsOptional()
  actionsTaken?: string;
}
