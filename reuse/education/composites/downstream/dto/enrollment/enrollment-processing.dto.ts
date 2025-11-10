/**
 * Enrollment Processing DTOs for backend enrollment services
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsNumber,
  IsDate,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export enum EnrollmentStatus {
  ENROLLED = 'enrolled',
  WITHDRAWN = 'withdrawn',
  GRADUATED = 'graduated',
  LEAVE_OF_ABSENCE = 'leave_of_absence',
  SUSPENDED = 'suspended',
}

export enum StudentLevel {
  FRESHMAN = 'freshman',
  SOPHOMORE = 'sophomore',
  JUNIOR = 'junior',
  SENIOR = 'senior',
  GRADUATE = 'graduate',
}

export class ProcessEnrollmentBatchDto {
  @ApiProperty({ description: 'Enrollments to process', type: 'array' })
  @IsArray()
  enrollments: Array<{
    studentId: string;
    termId: string;
    courseIds: string[];
  }>;
}

export class EnrollmentDataDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU-123456' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Term identifier', example: 'FALL2025' })
  @IsString()
  @IsNotEmpty()
  termId: string;

  @ApiProperty({ description: 'Enrollment status', enum: EnrollmentStatus })
  @IsEnum(EnrollmentStatus)
  status: EnrollmentStatus;

  @ApiProperty({ description: 'Credits enrolled', example: 15, minimum: 0, maximum: 24 })
  @IsNumber()
  @Min(0)
  @Max(24)
  credits: number;

  @ApiPropertyOptional({ description: 'Student level', enum: StudentLevel })
  @IsOptional()
  @IsEnum(StudentLevel)
  studentLevel?: StudentLevel;
}

export class CalculateEnrollmentCensusDto {
  @ApiProperty({ description: 'Term identifier', example: 'FALL2025' })
  @IsString()
  @IsNotEmpty()
  termId: string;

  @ApiPropertyOptional({ description: 'Census date (defaults to 10th day)' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  censusDate?: Date;
}

export class EnrollmentCensusResponseDto {
  @ApiProperty({ description: 'Term identifier', example: 'FALL2025' })
  termId: string;

  @ApiProperty({ description: 'Census date' })
  censusDate: Date;

  @ApiProperty({ description: 'Total enrolled students', example: 5000 })
  totalStudents: number;

  @ApiProperty({ description: 'Full-time students', example: 4200 })
  fullTimeStudents: number;

  @ApiProperty({ description: 'Part-time students', example: 800 })
  partTimeStudents: number;

  @ApiProperty({ description: 'Enrollment by level', type: 'object' })
  byLevel: Record<StudentLevel, number>;
}

export class FTEReportDto {
  @ApiProperty({ description: 'Term identifier', example: 'FALL2025' })
  termId: string;

  @ApiProperty({ description: 'Total FTE', example: 4750.5 })
  totalFTE: number;

  @ApiProperty({ description: 'Undergraduate FTE', example: 4200.0 })
  undergraduateFTE: number;

  @ApiProperty({ description: 'Graduate FTE', example: 550.5 })
  graduateFTE: number;

  @ApiProperty({ description: 'FTE by college/school', type: 'object' })
  byCollege: Record<string, number>;
}

export class EnrollmentTrendsResponseDto {
  @ApiProperty({ description: 'Historical enrollment data', type: 'array' })
  trends: Array<{
    term: string;
    enrollment: number;
    change: number;
  }>;

  @ApiProperty({ description: 'Year-over-year change percentage', example: 2.5 })
  yoyChangePercent: number;
}

export class EnrollmentForecastDto {
  @ApiProperty({ description: 'Term identifier', example: 'FALL2025' })
  termId: string;

  @ApiProperty({ description: 'Forecasted enrollment', example: 5250 })
  forecastedEnrollment: number;

  @ApiProperty({ description: 'Confidence interval lower bound', example: 5000 })
  lowerBound: number;

  @ApiProperty({ description: 'Confidence interval upper bound', example: 5500 })
  upperBound: number;
}

export class RetentionMetricsResponseDto {
  @ApiProperty({ description: 'Overall retention rate', example: 0.92 })
  overallRetentionRate: number;

  @ApiProperty({ description: 'Freshman retention rate', example: 0.88 })
  freshmanRetentionRate: number;

  @ApiProperty({ description: 'Retention by cohort', type: 'object' })
  byCohort: Record<string, number>;
}

export class ProcessWithdrawalDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU-123456' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Term identifier', example: 'FALL2025' })
  @IsString()
  @IsNotEmpty()
  termId: string;

  @ApiProperty({ description: 'Withdrawal date' })
  @Type(() => Date)
  @IsDate()
  withdrawalDate: Date;

  @ApiProperty({ description: 'Withdrawal reason', minLength: 5, maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ description: 'Course IDs to withdraw from', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  courseIds?: string[];
}

export class WithdrawalResponseDto {
  @ApiProperty({ description: 'Withdrawal processed successfully', example: true })
  processed: boolean;

  @ApiProperty({ description: 'Refund amount calculated', example: 2500.0 })
  refundAmount: number;

  @ApiProperty({ description: 'Academic impact', type: 'object' })
  academicImpact: {
    coursesWithdrawn: number;
    creditsLost: number;
    gpaImpact: string;
  };
}

export class EnrollmentVerificationDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU-123456' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Term identifier', example: 'FALL2025' })
  @IsString()
  @IsNotEmpty()
  termId: string;

  @ApiPropertyOptional({ description: 'Verification purpose', example: 'Loan deferment' })
  @IsOptional()
  @IsString()
  purpose?: string;
}

export class EnrollmentVerificationResponseDto {
  @ApiProperty({ description: 'Verification ID', example: 'VER-789' })
  verificationId: string;

  @ApiProperty({ description: 'Student enrolled', example: true })
  enrolled: boolean;

  @ApiProperty({ description: 'Enrollment status', enum: EnrollmentStatus })
  status: EnrollmentStatus;

  @ApiProperty({ description: 'Credits enrolled', example: 15 })
  credits: number;

  @ApiProperty({ description: 'Full-time status', example: true })
  fullTime: boolean;

  @ApiProperty({ description: 'Expected graduation date' })
  expectedGraduation: Date;
}
