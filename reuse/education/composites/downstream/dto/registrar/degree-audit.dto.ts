/**
 * Degree Audit DTOs for registrar domain
 * Manages degree progress, requirements completion, and graduation eligibility
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsDate,
  IsBoolean,
  Min,
} from 'class-validator';

export enum RequirementStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  WAIVED = 'waived',
  EXEMPTED = 'exempted',
}

export enum GraduationStatus {
  NOT_ELIGIBLE = 'not_eligible',
  ELIGIBLE = 'eligible',
  GRADUATED = 'graduated',
  DIPLOMA_ISSUED = 'diploma_issued',
}

/**
 * Requirement progress DTO
 */
export class RequirementProgressDto {
  @ApiProperty({
    description: 'Requirement ID',
    example: 'REQ-101',
  })
  @IsString()
  @IsNotEmpty()
  requirementId: string;

  @ApiProperty({
    description: 'Requirement name',
    example: 'Core Mathematics',
  })
  @IsString()
  @IsNotEmpty()
  requirementName: string;

  @ApiPropertyOptional({
    description: 'Requirement category',
    example: 'General Education',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Requirement status',
    enum: RequirementStatus,
    example: RequirementStatus.IN_PROGRESS,
  })
  @IsEnum(RequirementStatus)
  status: RequirementStatus;

  @ApiProperty({
    description: 'Credits required',
    example: 12,
  })
  @IsNumber()
  @Min(0)
  creditsRequired: number;

  @ApiProperty({
    description: 'Credits completed',
    example: 8,
  })
  @IsNumber()
  @Min(0)
  creditsCompleted: number;

  @ApiPropertyOptional({
    description: 'Satisfying courses',
    type: [String],
    example: ['MATH101', 'MATH102'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  courses?: string[];

  @ApiPropertyOptional({
    description: 'Remaining courses needed',
    type: [String],
    example: ['MATH201'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  remainingCourses?: string[];

  @ApiPropertyOptional({
    description: 'Notes or restrictions',
    example: 'Must maintain minimum 2.0 GPA',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * Concentration/specialization progress DTO
 */
export class ConcentrationProgressDto {
  @ApiProperty({
    description: 'Concentration ID',
    example: 'CONC-AI',
  })
  @IsString()
  @IsNotEmpty()
  concentrationId: string;

  @ApiProperty({
    description: 'Concentration name',
    example: 'Artificial Intelligence',
  })
  @IsString()
  @IsNotEmpty()
  concentrationName: string;

  @ApiProperty({
    description: 'Concentration type',
    enum: ['major', 'minor', 'concentration', 'specialization'],
    example: 'major',
  })
  @IsEnum(['major', 'minor', 'concentration', 'specialization'])
  type: string;

  @ApiProperty({
    description: 'Progress percentage',
    example: 65,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  progressPercentage: number;

  @ApiProperty({
    description: 'Requirements within this concentration',
    type: [RequirementProgressDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequirementProgressDto)
  requirements: RequirementProgressDto[];

  @ApiPropertyOptional({
    description: 'Concentration GPA',
    example: 3.7,
  })
  @IsOptional()
  @IsNumber()
  gpa?: number;
}

/**
 * Student degree audit report DTO
 */
export class DegreeAuditDto {
  @ApiProperty({
    description: 'Audit ID',
    example: 'AUD-2025001',
  })
  @IsString()
  @IsNotEmpty()
  auditId: string;

  @ApiProperty({
    description: 'Student ID',
    example: 'STU-2025001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Student name',
    example: 'John Smith',
  })
  @IsString()
  @IsNotEmpty()
  studentName: string;

  @ApiProperty({
    description: 'Degree program',
    example: 'Bachelor of Science in Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  degreeProgram: string;

  @ApiProperty({
    description: 'Catalog year',
    example: '2022-2023',
  })
  @IsString()
  @IsNotEmpty()
  catalogYear: string;

  @ApiProperty({
    description: 'Major concentration',
    example: 'Software Engineering',
  })
  @IsString()
  @IsNotEmpty()
  major: string;

  @ApiPropertyOptional({
    description: 'Secondary concentrations',
    type: [ConcentrationProgressDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConcentrationProgressDto)
  concentrations?: ConcentrationProgressDto[];

  @ApiProperty({
    description: 'Core requirements',
    type: [RequirementProgressDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequirementProgressDto)
  coreRequirements: RequirementProgressDto[];

  @ApiProperty({
    description: 'General education requirements',
    type: [RequirementProgressDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequirementProgressDto)
  generalEducationRequirements: RequirementProgressDto[];

  @ApiPropertyOptional({
    description: 'Elective requirements',
    type: [RequirementProgressDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequirementProgressDto)
  electiveRequirements?: RequirementProgressDto[];

  @ApiProperty({
    description: 'Overall degree completion percentage',
    example: 78,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  completionPercentage: number;

  @ApiProperty({
    description: 'Cumulative GPA',
    example: 3.72,
  })
  @IsNumber()
  cumulativeGpa: number;

  @ApiProperty({
    description: 'Graduation status',
    enum: GraduationStatus,
    example: GraduationStatus.ELIGIBLE,
  })
  @IsEnum(GraduationStatus)
  graduationStatus: GraduationStatus;

  @ApiPropertyOptional({
    description: 'Projected graduation date',
    example: '2025-05-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  projectedGraduationDate?: Date;

  @ApiPropertyOptional({
    description: 'Issues or alerts',
    type: [String],
    example: ['Missing prerequisite for MATH301'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alerts?: string[];

  @ApiPropertyOptional({
    description: 'Audit generation timestamp',
    example: '2025-11-10T10:30:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  generatedAt?: Date;

  @ApiPropertyOptional({
    description: 'Academic advisor notes',
    example: 'Student on track for May graduation',
  })
  @IsOptional()
  @IsString()
  advisorNotes?: string;
}

/**
 * What-if degree audit scenario DTO
 */
export class WhatIfScenarioDto {
  @ApiProperty({
    description: 'Scenario ID',
    example: 'SCENARIO-001',
  })
  @IsString()
  @IsNotEmpty()
  scenarioId: string;

  @ApiProperty({
    description: 'Proposed major change',
    example: 'Data Science',
  })
  @IsString()
  @IsNotEmpty()
  proposedMajor: string;

  @ApiPropertyOptional({
    description: 'Proposed minor change',
    example: 'Statistics',
  })
  @IsOptional()
  @IsString()
  proposedMinor?: string;

  @ApiPropertyOptional({
    description: 'Additional courses to simulate',
    type: [String],
    example: ['CS401', 'CS402'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionsCourses?: string[];

  @ApiProperty({
    description: 'Projected impact on graduation date',
    example: 'Fall 2026',
  })
  @IsString()
  projectedCompletion: string;

  @ApiPropertyOptional({
    description: 'Additional requirements needed',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalRequirements?: string[];

  @ApiPropertyOptional({
    description: 'Feasibility assessment',
    enum: ['feasible', 'challenging', 'not_feasible'],
    example: 'feasible',
  })
  @IsOptional()
  @IsEnum(['feasible', 'challenging', 'not_feasible'])
  feasibility?: string;
}

/**
 * Graduation eligibility check DTO
 */
export class GraduationEligibilityDto {
  @ApiProperty({
    description: 'Student ID',
    example: 'STU-2025001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Is student eligible to graduate',
    example: true,
  })
  @IsBoolean()
  isEligible: boolean;

  @ApiPropertyOptional({
    description: 'Reasons for ineligibility',
    type: [String],
    example: ['Incomplete core requirements', 'Below minimum GPA'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ineligibilityReasons?: string[];

  @ApiPropertyOptional({
    description: 'Required actions to become eligible',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredActions?: string[];

  @ApiPropertyOptional({
    description: 'Estimated time to eligibility (semesters)',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedSemesters?: number;

  @ApiPropertyOptional({
    description: 'Check timestamp',
    example: '2025-11-10T14:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  checkedAt?: Date;
}
