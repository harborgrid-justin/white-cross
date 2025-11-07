import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEnum, IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RiskFactorDto } from './risk-factor.dto';

/**
 * Risk level enumeration
 */
export enum RiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * DTO for health risk assessment score response.
 * Contains comprehensive risk analysis for a student.
 */
export class HealthRiskScoreDto {
  @ApiProperty({
    description: 'UUID of the student',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Overall risk score (0-100, higher = higher risk)',
    example: 65,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  overallScore: number;

  @ApiProperty({
    description: 'Categorized risk level',
    enum: RiskLevel,
    example: RiskLevel.HIGH,
  })
  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;

  @ApiProperty({
    description: 'Array of contributing risk factors',
    type: [RiskFactorDto],
  })
  @IsArray()
  @Type(() => RiskFactorDto)
  factors: RiskFactorDto[];

  @ApiProperty({
    description: 'Recommended actions based on risk assessment',
    example: [
      'Schedule immediate consultation with school nurse',
      'Ensure emergency action plans are up to date',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  recommendations: string[];

  @ApiProperty({
    description: 'Timestamp when assessment was calculated',
    example: '2024-10-28T02:24:00Z',
  })
  @IsDate()
  @Type(() => Date)
  calculatedAt: Date;
}
