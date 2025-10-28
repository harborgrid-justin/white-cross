import { IsUUID, IsInt, IsNumber, IsString, IsBoolean, IsArray, IsOptional, IsDate, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for recording vital signs
 */
export class RecordVitalsDto {
  @ApiProperty({ description: 'Student ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  studentId: string;

  @ApiPropertyOptional({ description: 'Associated clinic visit ID' })
  @IsUUID()
  @IsOptional()
  visitId?: string;

  @ApiProperty({ description: 'Staff member recording vitals' })
  @IsUUID()
  recordedBy: string;

  @ApiProperty({ description: 'Recording timestamp', example: '2025-10-28T10:00:00Z' })
  @Type(() => Date)
  @IsDate()
  recordedAt: Date;

  // Blood Pressure
  @ApiPropertyOptional({ description: 'Systolic blood pressure (mmHg)', example: 120, minimum: 60, maximum: 250 })
  @IsInt()
  @Min(60)
  @Max(250)
  @IsOptional()
  systolicBP?: number;

  @ApiPropertyOptional({ description: 'Diastolic blood pressure (mmHg)', example: 80, minimum: 40, maximum: 150 })
  @IsInt()
  @Min(40)
  @Max(150)
  @IsOptional()
  diastolicBP?: number;

  @ApiPropertyOptional({ description: 'Patient position during BP reading', example: 'sitting' })
  @IsString()
  @IsOptional()
  bpPosition?: string;

  // Heart Rate
  @ApiPropertyOptional({ description: 'Heart rate (bpm)', example: 72, minimum: 30, maximum: 220 })
  @IsInt()
  @Min(30)
  @Max(220)
  @IsOptional()
  heartRate?: number;

  // Temperature
  @ApiPropertyOptional({ description: 'Temperature (°F)', example: 98.6, minimum: 90, maximum: 110 })
  @IsNumber()
  @Min(90)
  @Max(110)
  @IsOptional()
  temperature?: number;

  @ApiPropertyOptional({ description: 'Temperature measurement method', example: 'oral' })
  @IsString()
  @IsOptional()
  tempMethod?: string;

  // Respiratory Rate
  @ApiPropertyOptional({ description: 'Respiratory rate (breaths/min)', example: 16, minimum: 8, maximum: 60 })
  @IsInt()
  @Min(8)
  @Max(60)
  @IsOptional()
  respiratoryRate?: number;

  // Oxygen Saturation
  @ApiPropertyOptional({ description: 'Oxygen saturation (%)', example: 98, minimum: 70, maximum: 100 })
  @IsInt()
  @Min(70)
  @Max(100)
  @IsOptional()
  oxygenSaturation?: number;

  @ApiPropertyOptional({ description: 'Is patient on supplemental oxygen?', default: false })
  @IsBoolean()
  @IsOptional()
  onOxygen?: boolean;

  @ApiPropertyOptional({ description: 'Oxygen flow rate (L/min)', example: 2 })
  @IsNumber()
  @IsOptional()
  oxygenFlowRate?: number;

  // Height and Weight
  @ApiPropertyOptional({ description: 'Height (inches)', example: 68 })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ description: 'Weight (pounds)', example: 150 })
  @IsNumber()
  @IsOptional()
  weight?: number;

  // Pain Scale
  @ApiPropertyOptional({ description: 'Pain scale (0-10)', example: 3, minimum: 0, maximum: 10 })
  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  painScale?: number;

  @ApiPropertyOptional({ description: 'Location of pain', example: 'lower back' })
  @IsString()
  @IsOptional()
  painLocation?: string;

  // Additional
  @ApiPropertyOptional({ description: 'Head circumference (cm)', example: 55 })
  @IsNumber()
  @IsOptional()
  headCircumference?: number;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Abnormal vital sign flags', example: ['high_bp', 'fever'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  abnormalFlags?: string[];
}
