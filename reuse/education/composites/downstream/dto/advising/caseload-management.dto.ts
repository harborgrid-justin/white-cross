/**
 * Caseload Management DTOs for advisor workload tracking
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsDate,
  IsOptional,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { RiskLevel } from './progress-summary.dto';

export class AdvisorCaseloadResponseDto {
  @ApiProperty({ description: 'Advisor identifier', example: 'ADV456' })
  advisorId: string;

  @ApiProperty({ description: 'Advisor name', example: 'Dr. Jane Smith' })
  advisorName: string;

  @ApiProperty({ description: 'Total students in caseload', example: 150, minimum: 0 })
  @IsNumber()
  @Min(0)
  totalStudents: number;

  @ApiProperty({ description: 'Active students', example: 142, minimum: 0 })
  @IsNumber()
  @Min(0)
  activeStudents: number;

  @ApiProperty({ description: 'At-risk students', example: 12, minimum: 0 })
  @IsNumber()
  @Min(0)
  atRiskStudents: number;

  @ApiProperty({ description: 'Upcoming appointments', example: 8, minimum: 0 })
  @IsNumber()
  @Min(0)
  upcomingAppointments: number;

  @ApiProperty({ description: 'Overdue follow-ups', example: 3, minimum: 0 })
  @IsNumber()
  @Min(0)
  overdueFollowUps: number;

  @ApiProperty({ description: 'Average sessions per student', example: 2.5, minimum: 0 })
  @IsNumber()
  @Min(0)
  averageSessionsPerStudent: number;

  @ApiProperty({ description: 'Caseload capacity', example: 200, minimum: 0 })
  @IsNumber()
  @Min(0)
  caseloadCapacity: number;

  @ApiProperty({ description: 'Utilization rate (0-1)', example: 0.75, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  utilizationRate: number;
}

export class AssignStudentsDto {
  @ApiProperty({ description: 'Student identifiers to assign', type: [String], example: ['STU1', 'STU2', 'STU3'] })
  @IsArray()
  @IsString({ each: true })
  studentIds: string[];

  @ApiProperty({ description: 'Advisor identifier', example: 'ADV456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  advisorId: string;
}

export class AssignStudentsResponseDto {
  @ApiProperty({ description: 'Number of students assigned', example: 3 })
  @IsNumber()
  @Min(0)
  assigned: number;

  @ApiProperty({ description: 'Conflicting student IDs', type: [String] })
  @IsArray()
  conflicts: string[];

  @ApiPropertyOptional({ description: 'Assignment details' })
  details?: {
    successful: string[];
    failed: string[];
  };
}

export class TransferStudentDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  studentId: string;

  @ApiProperty({ description: 'New advisor identifier', example: 'ADV789' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  newAdvisorId: string;

  @ApiProperty({ description: 'Reason for transfer', example: 'Major change', minLength: 5, maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  reason: string;
}

export class TransferStudentResponseDto {
  @ApiProperty({ description: 'Whether transfer was successful', example: true })
  transferred: boolean;

  @ApiProperty({ description: 'Effective date of transfer' })
  @Type(() => Date)
  @IsDate()
  effectiveDate: Date;

  @ApiPropertyOptional({ description: 'Previous advisor ID' })
  previousAdvisorId?: string;

  @ApiPropertyOptional({ description: 'New advisor ID' })
  newAdvisorId?: string;
}

export class BalanceCaseloadsDto {
  @ApiProperty({ description: 'Advisor identifiers to balance', type: [String], example: ['ADV1', 'ADV2', 'ADV3'] })
  @IsArray()
  @IsString({ each: true })
  advisorIds: string[];
}

export class CaseloadBalanceResultDto {
  @ApiProperty({ description: 'Advisor identifier', example: 'ADV456' })
  advisorId: string;

  @ApiProperty({ description: 'Students before balancing', example: 150 })
  before: number;

  @ApiProperty({ description: 'Students after balancing', example: 145 })
  after: number;

  @ApiProperty({ description: 'Net change', example: -5 })
  change: number;
}

export class BalanceCaseloadsResponseDto {
  @ApiProperty({ description: 'Balance results', type: [CaseloadBalanceResultDto] })
  results: CaseloadBalanceResultDto[];

  @ApiProperty({ description: 'Total students redistributed', example: 15 })
  totalRedistributed: number;
}

export class AtRiskStudentDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU123' })
  studentId: string;

  @ApiProperty({ description: 'Student name', example: 'John Doe' })
  studentName: string;

  @ApiProperty({ description: 'Risk level', enum: RiskLevel })
  riskLevel: RiskLevel;

  @ApiProperty({ description: 'Risk factors', type: [String], example: ['Low GPA', 'Multiple absences'] })
  factors: string[];

  @ApiPropertyOptional({ description: 'Last contact date' })
  lastContactDate?: Date;

  @ApiPropertyOptional({ description: 'Next scheduled appointment' })
  nextAppointment?: Date;
}

export class CaseloadReportResponseDto {
  @ApiProperty({ description: 'Caseload statistics', type: AdvisorCaseloadResponseDto })
  caseload: AdvisorCaseloadResponseDto;

  @ApiProperty({ description: 'Trend data', type: 'object' })
  trends: {
    averageGPA: number;
    retentionRate: number;
    graduationRate: number;
  };

  @ApiProperty({ description: 'Recommendations', type: [String] })
  recommendations: string[];

  @ApiPropertyOptional({ description: 'Report generation date' })
  generatedAt?: Date;
}

export class AdvisorAvailabilityDto {
  @ApiProperty({ description: 'Date' })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'Whether advisor is available', example: true })
  available: boolean;

  @ApiProperty({ description: 'Number of booked time slots', example: 6, minimum: 0 })
  @IsNumber()
  @Min(0)
  bookedSlots: number;

  @ApiPropertyOptional({ description: 'Total available slots', example: 8 })
  totalSlots?: number;
}

export class AdvisorAvailabilityQueryDto {
  @ApiProperty({ description: 'Advisor identifier', example: 'ADV456' })
  @IsString()
  @IsNotEmpty()
  advisorId: string;

  @ApiProperty({ description: 'Start date for availability check' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'End date for availability check' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
