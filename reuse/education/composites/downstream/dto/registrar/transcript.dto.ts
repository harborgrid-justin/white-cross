/**
 * Transcript DTOs for registrar domain
 * Manages academic transcripts, course histories, and grade records
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
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export enum TranscriptStatus {
  DRAFT = 'draft',
  COMPLETE = 'complete',
  ARCHIVED = 'archived',
  VOIDED = 'voided',
}

export enum GradeScale {
  LETTER = 'letter',
  NUMERIC = 'numeric',
  PERCENTAGE = 'percentage',
  PASS_FAIL = 'pass_fail',
}

/**
 * Student transcript request DTO
 */
export class RequestTranscriptDto {
  @ApiProperty({
    description: 'Student ID',
    example: 'STU-2025001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Transcript type',
    enum: ['official', 'unofficial', 'honors'],
    example: 'official',
  })
  @IsString()
  @IsNotEmpty()
  transcriptType: 'official' | 'unofficial' | 'honors';

  @ApiPropertyOptional({
    description: 'Number of copies',
    example: 5,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  numberOfCopies?: number;

  @ApiPropertyOptional({
    description: 'Delivery method',
    enum: ['electronic', 'mail', 'pickup'],
    example: 'electronic',
  })
  @IsOptional()
  @IsString()
  deliveryMethod?: 'electronic' | 'mail' | 'pickup';

  @ApiPropertyOptional({
    description: 'Recipient email or address',
    example: 'recipient@example.com',
  })
  @IsOptional()
  @IsString()
  recipient?: string;
}

/**
 * Course grade entry DTO
 */
export class CourseGradeDto {
  @ApiProperty({
    description: 'Course code',
    example: 'CS101',
  })
  @IsString()
  @IsNotEmpty()
  courseCode: string;

  @ApiProperty({
    description: 'Course title',
    example: 'Introduction to Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  courseTitle: string;

  @ApiProperty({
    description: 'Grade received',
    example: 'A',
  })
  @IsString()
  @IsNotEmpty()
  grade: string;

  @ApiProperty({
    description: 'Numeric grade value',
    example: 4.0,
    minimum: 0,
    maximum: 4.0,
  })
  @IsNumber()
  @Min(0)
  @Max(4.0)
  gradePoints: number;

  @ApiProperty({
    description: 'Credit hours',
    example: 3,
    minimum: 0.5,
    maximum: 12,
  })
  @IsNumber()
  credits: number;

  @ApiPropertyOptional({
    description: 'Semester/term taken',
    example: 'Fall 2024',
  })
  @IsOptional()
  @IsString()
  semester?: string;

  @ApiPropertyOptional({
    description: 'Grade status',
    enum: ['completed', 'in_progress', 'incomplete'],
    example: 'completed',
  })
  @IsOptional()
  @IsEnum(['completed', 'in_progress', 'incomplete'])
  status?: string;
}

/**
 * Academic term transcript DTO
 */
export class TermTranscriptDto {
  @ApiProperty({
    description: 'Term/semester identifier',
    example: 'FALL2024',
  })
  @IsString()
  @IsNotEmpty()
  termCode: string;

  @ApiProperty({
    description: 'Term name',
    example: 'Fall 2024',
  })
  @IsString()
  @IsNotEmpty()
  termName: string;

  @ApiProperty({
    description: 'Courses taken in term',
    type: [CourseGradeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseGradeDto)
  courses: CourseGradeDto[];

  @ApiProperty({
    description: 'Term GPA',
    example: 3.85,
    minimum: 0,
    maximum: 4.0,
  })
  @IsNumber()
  @Min(0)
  @Max(4.0)
  termGpa: number;

  @ApiProperty({
    description: 'Total credits attempted',
    example: 15,
  })
  @IsNumber()
  totalCreditsAttempted: number;

  @ApiProperty({
    description: 'Total credits earned',
    example: 15,
  })
  @IsNumber()
  totalCreditsEarned: number;

  @ApiPropertyOptional({
    description: 'Academic standing',
    enum: ['good', 'warning', 'probation', 'dismissal'],
    example: 'good',
  })
  @IsOptional()
  @IsString()
  academicStanding?: string;
}

/**
 * Complete student transcript DTO
 */
export class StudentTranscriptDto {
  @ApiProperty({
    description: 'Transcript ID',
    example: 'TSC-2025001',
  })
  @IsString()
  @IsNotEmpty()
  transcriptId: string;

  @ApiProperty({
    description: 'Student ID',
    example: 'STU-2025001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Student full name',
    example: 'Jane Doe',
  })
  @IsString()
  @IsNotEmpty()
  studentName: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '1999-05-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'Enrollment degree program',
    example: 'Bachelor of Science in Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  degreeProgram: string;

  @ApiPropertyOptional({
    description: 'Major concentration',
    example: 'Artificial Intelligence',
  })
  @IsOptional()
  @IsString()
  major?: string;

  @ApiPropertyOptional({
    description: 'Minor concentration',
    example: 'Mathematics',
  })
  @IsOptional()
  @IsString()
  minor?: string;

  @ApiProperty({
    description: 'Cumulative GPA',
    example: 3.82,
    minimum: 0,
    maximum: 4.0,
  })
  @IsNumber()
  @Min(0)
  @Max(4.0)
  cumulativeGpa: number;

  @ApiProperty({
    description: 'Total credits completed',
    example: 120,
  })
  @IsNumber()
  totalCreditsCompleted: number;

  @ApiProperty({
    description: 'Academic record by term',
    type: [TermTranscriptDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TermTranscriptDto)
  termRecords: TermTranscriptDto[];

  @ApiProperty({
    description: 'Transcript status',
    enum: TranscriptStatus,
    example: TranscriptStatus.COMPLETE,
  })
  @IsEnum(TranscriptStatus)
  status: TranscriptStatus;

  @ApiPropertyOptional({
    description: 'Grade scale used',
    enum: GradeScale,
    example: GradeScale.LETTER,
  })
  @IsOptional()
  @IsEnum(GradeScale)
  gradeScale?: GradeScale;

  @ApiPropertyOptional({
    description: 'Generated timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  generatedAt?: Date;

  @ApiPropertyOptional({
    description: 'Honors/distinctions',
    type: [String],
    example: ['Cum Laude', 'Dean\'s List'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  honors?: string[];
}

/**
 * Transcript request status DTO
 */
export class TranscriptRequestStatusDto {
  @ApiProperty({
    description: 'Request ID',
    example: 'TREQ-2025001',
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({
    description: 'Request status',
    enum: ['pending', 'processing', 'ready', 'sent', 'failed'],
    example: 'ready',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({
    description: 'Progress percentage',
    example: 100,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({
    description: 'Status message',
    example: 'Transcript ready for pickup',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    description: 'Estimated completion date',
    example: '2025-11-15T17:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  estimatedCompletion?: Date;
}
