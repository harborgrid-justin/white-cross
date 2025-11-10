/**
 * Student Progress Tracking DTOs
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsArray,
  Min,
  Max,
} from 'class-validator';

export enum AcademicStanding {
  GOOD = 'good',
  WARNING = 'warning',
  PROBATION = 'probation',
  SUSPENSION = 'suspension',
}

export enum RiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class ProgressSummaryResponseDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU123' })
  studentId: string;

  @ApiProperty({ description: 'Student name', example: 'John Doe' })
  studentName: string;

  @ApiProperty({ description: 'Overall GPA', example: 3.5, minimum: 0, maximum: 4.0 })
  @IsNumber()
  @Min(0)
  @Max(4.0)
  overallGPA: number;

  @ApiProperty({ description: 'Credits completed', example: 60, minimum: 0 })
  @IsNumber()
  @Min(0)
  creditsCompleted: number;

  @ApiProperty({ description: 'Credits in progress', example: 15, minimum: 0 })
  @IsNumber()
  @Min(0)
  creditsInProgress: number;

  @ApiProperty({ description: 'Credits remaining', example: 45, minimum: 0 })
  @IsNumber()
  @Min(0)
  creditsRemaining: number;

  @ApiProperty({ description: 'Percent towards degree', example: 62, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentTowardsDegree: number;

  @ApiProperty({ description: 'Expected graduation date' })
  @Type(() => Date)
  @IsDate()
  expectedGraduation: Date;

  @ApiProperty({ description: 'Academic standing', enum: AcademicStanding })
  @IsEnum(AcademicStanding)
  academicStanding: AcademicStanding;

  @ApiProperty({ description: 'Risk level', enum: RiskLevel })
  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;

  @ApiProperty({ description: 'Risk factors', type: [String] })
  @IsArray()
  riskFactors: string[];

  @ApiProperty({ description: 'Student strengths', type: [String] })
  @IsArray()
  strengths: string[];

  @ApiProperty({ description: 'Recommendations', type: [String] })
  @IsArray()
  recommendations: string[];
}

export class StudentMilestoneDto {
  @ApiProperty({ description: 'Milestone description', example: 'Complete general education' })
  milestone: string;

  @ApiProperty({ description: 'Whether milestone is completed', example: true })
  completed: boolean;

  @ApiPropertyOptional({ description: 'Completion date' })
  completedDate?: Date;

  @ApiPropertyOptional({ description: 'Target date' })
  targetDate?: Date;
}

export class PerformanceTrendsResponseDto {
  @ApiProperty({ description: 'GPA trend by term', type: [Number], example: [3.3, 3.4, 3.5, 3.5] })
  gpaTrend: number[];

  @ApiProperty({ description: 'Credits trend by term', type: [Number], example: [15, 15, 15, 15] })
  creditsTrend: number[];

  @ApiProperty({ description: 'Analysis of trends', example: 'Consistent upward trend in GPA' })
  analysis: string;

  @ApiPropertyOptional({ description: 'Terms analyzed', type: [String] })
  terms?: string[];
}

export class DegreeProgressValidationDto {
  @ApiProperty({ description: 'Whether student is on track', example: true })
  onTrack: boolean;

  @ApiProperty({ description: 'Issues identified', type: [String] })
  issues: string[];

  @ApiProperty({ description: 'Suggestions for improvement', type: [String] })
  suggestions: string[];

  @ApiPropertyOptional({ description: 'Required courses remaining', type: [String] })
  requiredCoursesRemaining?: string[];
}

export class CohortComparisonResponseDto {
  @ApiProperty({ description: 'Student metrics', type: 'object' })
  studentMetrics: {
    gpa: number;
    credits: number;
    termGPA: number;
  };

  @ApiProperty({ description: 'Cohort averages', type: 'object' })
  cohortAverages: {
    gpa: number;
    credits: number;
    termGPA: number;
  };

  @ApiProperty({ description: 'Student percentile (0-100)', example: 75, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentile: number;

  @ApiPropertyOptional({ description: 'Cohort size', example: 450 })
  cohortSize?: number;
}
