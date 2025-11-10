/**
 * Grade Change DTOs for requesting and managing grade changes
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';

export enum GradeChangeStatus {
  REQUESTED = 'requested',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DENIED = 'denied',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum GradeChangeReason {
  GRADING_ERROR = 'grading_error',
  MISSING_ASSESSMENT = 'missing_assessment',
  INCOMPLETE_RESOLUTION = 'incomplete_resolution',
  GRADE_APPEAL = 'grade_appeal',
  CALCULATION_ERROR = 'calculation_error',
  ADMINISTRATIVE_ERROR = 'administrative_error',
  OTHER = 'other',
}

export class GradeChangeRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: 'Section number',
    example: '01',
  })
  @IsString()
  @IsNotEmpty()
  sectionNumber: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({
    description: 'Current grade',
    example: 'B+',
  })
  @IsString()
  @IsNotEmpty()
  currentGrade: string;

  @ApiProperty({
    description: 'Requested new grade',
    example: 'A-',
  })
  @IsString()
  @IsNotEmpty()
  requestedGrade: string;

  @ApiProperty({
    description: 'Reason for change',
    enum: GradeChangeReason,
  })
  @IsEnum(GradeChangeReason)
  reason: GradeChangeReason;

  @ApiProperty({
    description: 'Detailed explanation',
    example: 'Grading rubric was incorrectly applied to final exam',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  explanation: string;

  @ApiPropertyOptional({
    description: 'Supporting documentation',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  supportingDocs?: string[];

  @ApiPropertyOptional({
    description: 'Request priority',
    enum: ['low', 'medium', 'high'],
    example: 'high',
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';
}

export class GradeChangeResponseDto {
  @ApiProperty({
    description: 'Grade change request identifier',
    example: 'GCHG-2024001',
  })
  requestId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Student name',
    example: 'John Doe',
  })
  studentName: string;

  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  courseId: string;

  @ApiProperty({
    description: 'Course title',
    example: 'Introduction to Computer Science',
  })
  courseTitle: string;

  @ApiProperty({
    description: 'Section number',
    example: '01',
  })
  sectionNumber: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Current grade',
    example: 'B+',
  })
  currentGrade: string;

  @ApiProperty({
    description: 'Requested new grade',
    example: 'A-',
  })
  requestedGrade: string;

  @ApiPropertyOptional({
    description: 'Final grade after approval',
    example: 'A-',
  })
  @IsOptional()
  finalGrade?: string;

  @ApiProperty({
    description: 'Change status',
    enum: GradeChangeStatus,
  })
  status: GradeChangeStatus;

  @ApiProperty({
    description: 'Change reason',
    enum: GradeChangeReason,
  })
  reason: GradeChangeReason;

  @ApiProperty({
    description: 'Request created date',
    example: '2025-12-15T10:00:00Z',
  })
  @Type(() => Date)
  createdDate: Date;

  @ApiPropertyOptional({
    description: 'Review started date',
    example: '2025-12-16T09:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  reviewStartDate?: Date;

  @ApiPropertyOptional({
    description: 'Decision date',
    example: '2025-12-17T14:30:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  decisionDate?: Date;

  @ApiPropertyOptional({
    description: 'Instructor comment',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  instructorComment?: string;

  @ApiPropertyOptional({
    description: 'Reviewer name',
    example: 'Dr. Jane Smith',
  })
  @IsOptional()
  @IsString()
  reviewerName?: string;

  @ApiPropertyOptional({
    description: 'Denial reason',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  denialReason?: string;
}

export class BulkGradeChangeRequestDto {
  @ApiProperty({
    description: 'Grade change requests',
    type: 'array',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GradeChangeRequestDto)
  requests: GradeChangeRequestDto[];

  @ApiPropertyOptional({
    description: 'Process in parallel',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  parallel?: boolean;
}

export class GradeChangeQueryDto {
  @ApiPropertyOptional({
    description: 'Student identifier filter',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Course identifier filter',
  })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({
    description: 'Change status filter',
    enum: GradeChangeStatus,
  })
  @IsOptional()
  @IsEnum(GradeChangeStatus)
  status?: GradeChangeStatus;

  @ApiPropertyOptional({
    description: 'Change reason filter',
    enum: GradeChangeReason,
  })
  @IsOptional()
  @IsEnum(GradeChangeReason)
  reason?: GradeChangeReason;

  @ApiPropertyOptional({
    description: 'Academic term filter',
  })
  @IsOptional()
  @IsString()
  term?: string;

  @ApiPropertyOptional({
    description: 'Priority filter',
    enum: ['low', 'medium', 'high'],
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';

  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class IncompleteResolutionDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: 'Incomplete work deadline',
    example: '2026-02-15T23:59:00Z',
  })
  @Type(() => Date)
  deadline: Date;

  @ApiProperty({
    description: 'Work completion status',
    example: 'completed',
    enum: ['pending', 'completed', 'extended'],
  })
  @IsEnum(['pending', 'completed', 'extended'])
  status: 'pending' | 'completed' | 'extended';

  @ApiPropertyOptional({
    description: 'Resolved grade after completion',
    example: 'B+',
  })
  @IsOptional()
  @IsString()
  resolvedGrade?: string;

  @ApiPropertyOptional({
    description: 'Resolution date',
    example: '2026-02-10T14:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  resolutionDate?: Date;
}

export class GradeChangeHistoryDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Grade change requests',
    type: 'array',
  })
  requests: Array<{
    requestId: string;
    courseId: string;
    currentGrade: string;
    requestedGrade: string;
    status: GradeChangeStatus;
    createdDate: Date;
    decisionDate?: Date;
    finalGrade?: string;
  }>;

  @ApiProperty({
    description: 'Total requests',
    example: 3,
    minimum: 0,
  })
  totalRequests: number;

  @ApiProperty({
    description: 'Approved requests',
    example: 2,
    minimum: 0,
  })
  approvedRequests: number;

  @ApiProperty({
    description: 'Denied requests',
    example: 1,
    minimum: 0,
  })
  deniedRequests: number;
}

export class GradeChangeStatisticsDto {
  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Total change requests',
    example: 245,
    minimum: 0,
  })
  totalRequests: number;

  @ApiProperty({
    description: 'Approved requests',
    example: 189,
    minimum: 0,
  })
  approved: number;

  @ApiProperty({
    description: 'Denied requests',
    example: 45,
    minimum: 0,
  })
  denied: number;

  @ApiProperty({
    description: 'Pending requests',
    example: 11,
    minimum: 0,
  })
  pending: number;

  @ApiProperty({
    description: 'Average review time (days)',
    example: 4.5,
    minimum: 0,
  })
  averageReviewTime: number;

  @ApiProperty({
    description: 'Approval rate percentage',
    example: 77.1,
    minimum: 0,
    maximum: 100,
  })
  approvalRate: number;

  @ApiProperty({
    description: 'Requests by reason',
    type: 'object',
  })
  byReason: Record<GradeChangeReason, number>;
}
