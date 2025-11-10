/**
 * Intervention Plan DTOs for at-risk student support
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { RiskLevel } from './progress-summary.dto';

export enum GoalStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum InterventionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class InterventionGoalDto {
  @ApiProperty({ description: 'Goal description', example: 'Raise GPA to 2.5' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  goal: string;

  @ApiProperty({ description: 'Target date for goal completion' })
  @Type(() => Date)
  @IsDate()
  targetDate: Date;

  @ApiProperty({ description: 'Progress percentage (0-100)', example: 50, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @ApiProperty({ description: 'Goal status', enum: GoalStatus })
  @IsEnum(GoalStatus)
  status: GoalStatus;
}

export class InterventionActionDto {
  @ApiProperty({ description: 'Intervention action', example: 'Weekly tutoring sessions' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  intervention: string;

  @ApiProperty({ description: 'Responsible party', example: 'Tutoring Center' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  responsible: string;

  @ApiProperty({ description: 'Frequency of intervention', example: 'Weekly' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  frequency: string;

  @ApiProperty({ description: 'Intervention status', enum: InterventionStatus })
  @IsEnum(InterventionStatus)
  status: InterventionStatus;
}

export class CreateInterventionPlanDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  studentId: string;

  @ApiProperty({ description: 'Staff member creating plan', example: 'ADV456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  createdBy: string;

  @ApiProperty({ description: 'Risk level', enum: RiskLevel })
  @IsEnum(RiskLevel)
  @IsNotEmpty()
  riskLevel: RiskLevel;

  @ApiProperty({ description: 'Concerns identified', type: [String], example: ['Low GPA', 'Course failures'] })
  @IsArray()
  @IsString({ each: true })
  concerns: string[];

  @ApiProperty({ description: 'Goals for improvement', type: [InterventionGoalDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterventionGoalDto)
  goals: InterventionGoalDto[];

  @ApiProperty({ description: 'Intervention actions', type: [InterventionActionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterventionActionDto)
  interventions: InterventionActionDto[];

  @ApiProperty({ description: 'Plan review date' })
  @Type(() => Date)
  @IsDate()
  reviewDate: Date;
}

export class InterventionPlanResponseDto {
  @ApiProperty({ description: 'Plan identifier', example: 'PLAN-1234567890' })
  planId: string;

  @ApiProperty({ description: 'Student identifier', example: 'STU123' })
  studentId: string;

  @ApiProperty({ description: 'Student name', example: 'John Doe' })
  studentName: string;

  @ApiProperty({ description: 'Created by', example: 'ADV456' })
  createdBy: string;

  @ApiProperty({ description: 'Creation date' })
  createdDate: Date;

  @ApiProperty({ description: 'Risk level', enum: RiskLevel })
  riskLevel: RiskLevel;

  @ApiProperty({ description: 'Concerns', type: [String] })
  concerns: string[];

  @ApiProperty({ description: 'Goals', type: [InterventionGoalDto] })
  goals: InterventionGoalDto[];

  @ApiProperty({ description: 'Interventions', type: [InterventionActionDto] })
  interventions: InterventionActionDto[];

  @ApiProperty({ description: 'Review date' })
  reviewDate: Date;

  @ApiPropertyOptional({ description: 'Outcome summary' })
  outcome?: string;
}

export class InterventionEffectivenessResponseDto {
  @ApiProperty({ description: 'Effectiveness score (0-1)', example: 0.75, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  effectiveness: number;

  @ApiProperty({ description: 'Progress details', type: 'object' })
  progress: {
    goalsCompleted: number;
    goalsInProgress: number;
    goalsNotStarted: number;
  };

  @ApiProperty({ description: 'Recommended adjustments', type: [String] })
  adjustments: string[];

  @ApiPropertyOptional({ description: 'Last review date' })
  lastReviewDate?: Date;
}

export class EscalateConcernResponseDto {
  @ApiProperty({ description: 'Whether concern was escalated', example: true })
  escalated: boolean;

  @ApiProperty({ description: 'Case number', example: 'CASE-1234567890' })
  caseNumber: string;

  @ApiProperty({ description: 'Contact timestamp' })
  contactedAt: Date;

  @ApiProperty({ description: 'Escalated to', example: 'Counseling Center' })
  escalatedTo: string;
}
