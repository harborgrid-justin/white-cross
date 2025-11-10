/**
 * Grade Submission DTOs for submitting student grades
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
  Matches,
} from 'class-validator';

export enum GradeType {
  LETTER = 'letter',
  NUMERIC = 'numeric',
  PASS_FAIL = 'pass_fail',
  SATISFACTORY_UNSATISFACTORY = 'satisfactory_unsatisfactory',
}

export enum SubmissionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  FINALIZED = 'finalized',
}

export enum LetterGrade {
  A_PLUS = 'A+',
  A = 'A',
  A_MINUS = 'A-',
  B_PLUS = 'B+',
  B = 'B',
  B_MINUS = 'B-',
  C_PLUS = 'C+',
  C = 'C',
  C_MINUS = 'C-',
  D_PLUS = 'D+',
  D = 'D',
  D_MINUS = 'D-',
  F = 'F',
  INCOMPLETE = 'I',
  WITHDRAWN = 'W',
}

export class StudentGradeDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Student full name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  studentName: string;

  @ApiProperty({
    description: 'Enrollment identifier',
    example: 'ENR-2024001',
  })
  @IsString()
  @IsNotEmpty()
  enrollmentId: string;

  @ApiProperty({
    description: 'Letter grade',
    enum: LetterGrade,
    example: LetterGrade.A,
  })
  @IsEnum(LetterGrade)
  letterGrade: LetterGrade;

  @ApiProperty({
    description: 'Numeric grade (0-100)',
    example: 92.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  numericGrade: number;

  @ApiPropertyOptional({
    description: 'Grade points earned',
    example: 4.0,
    minimum: 0,
    maximum: 4,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4)
  gradePoints?: number;

  @ApiPropertyOptional({
    description: 'Grade notes or comments',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class GradeSubmissionRequestDto {
  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: 'Course title',
    example: 'Introduction to Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  courseTitle: string;

  @ApiProperty({
    description: 'Section number',
    example: '01',
  })
  @IsString()
  @IsNotEmpty()
  sectionNumber: string;

  @ApiProperty({
    description: 'Instructor identifier',
    example: 'INSTR-2024001',
  })
  @IsString()
  @IsNotEmpty()
  instructorId: string;

  @ApiProperty({
    description: 'Instructor name',
    example: 'Dr. Jane Smith',
  })
  @IsString()
  @IsNotEmpty()
  instructorName: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({
    description: 'Grade type',
    enum: GradeType,
  })
  @IsEnum(GradeType)
  gradeType: GradeType;

  @ApiProperty({
    description: 'Student grades to submit',
    type: 'array',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentGradeDto)
  grades: StudentGradeDto[];

  @ApiPropertyOptional({
    description: 'Submission notes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  submissionNotes?: string;
}

export class GradeSubmissionResponseDto {
  @ApiProperty({
    description: 'Grade submission identifier',
    example: 'GRAD-SUBM-2024001',
  })
  submissionId: string;

  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  courseId: string;

  @ApiProperty({
    description: 'Section number',
    example: '01',
  })
  sectionNumber: string;

  @ApiProperty({
    description: 'Instructor identifier',
    example: 'INSTR-2024001',
  })
  instructorId: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Submission status',
    enum: SubmissionStatus,
  })
  status: SubmissionStatus;

  @ApiProperty({
    description: 'Total grades in submission',
    example: 30,
    minimum: 0,
  })
  totalGrades: number;

  @ApiProperty({
    description: 'Submitted date',
    example: '2025-12-10T14:30:00Z',
  })
  @Type(() => Date)
  submittedDate: Date;

  @ApiPropertyOptional({
    description: 'Review date',
    example: '2025-12-11T10:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  reviewDate?: Date;

  @ApiPropertyOptional({
    description: 'Finalized date',
    example: '2025-12-11T16:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  finalizedDate?: Date;

  @ApiPropertyOptional({
    description: 'Submission validation errors',
    type: [String],
  })
  @IsOptional()
  errors?: string[];

  @ApiPropertyOptional({
    description: 'Submission validation warnings',
    type: [String],
  })
  @IsOptional()
  warnings?: string[];
}

export class BulkGradeSubmissionDto {
  @ApiProperty({
    description: 'Grade submissions',
    type: 'array',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GradeSubmissionRequestDto)
  submissions: GradeSubmissionRequestDto[];

  @ApiPropertyOptional({
    description: 'Process in parallel',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  parallel?: boolean;
}

export class GradeSubmissionQueryDto {
  @ApiPropertyOptional({
    description: 'Instructor identifier filter',
  })
  @IsOptional()
  @IsString()
  instructorId?: string;

  @ApiPropertyOptional({
    description: 'Course identifier filter',
  })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({
    description: 'Academic term filter',
  })
  @IsOptional()
  @IsString()
  term?: string;

  @ApiPropertyOptional({
    description: 'Submission status filter',
    enum: SubmissionStatus,
  })
  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

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

export class GradeStatisticsDto {
  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  courseId: string;

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
    description: 'Total students',
    example: 30,
    minimum: 0,
  })
  totalStudents: number;

  @ApiProperty({
    description: 'Class average',
    example: 86.5,
    minimum: 0,
    maximum: 100,
  })
  classAverage: number;

  @ApiProperty({
    description: 'Highest grade',
    example: 98,
    minimum: 0,
    maximum: 100,
  })
  highestGrade: number;

  @ApiProperty({
    description: 'Lowest grade',
    example: 68,
    minimum: 0,
    maximum: 100,
  })
  lowestGrade: number;

  @ApiProperty({
    description: 'Grade distribution',
    type: 'object',
  })
  distribution: Record<LetterGrade, number>;

  @ApiProperty({
    description: 'Standard deviation',
    example: 8.5,
    minimum: 0,
  })
  standardDeviation: number;
}

export class StudentCourseGradeDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

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
    description: 'Letter grade',
    enum: LetterGrade,
  })
  letterGrade: LetterGrade;

  @ApiProperty({
    description: 'Numeric grade',
    example: 92.5,
    minimum: 0,
    maximum: 100,
  })
  numericGrade: number;

  @ApiProperty({
    description: 'Grade points',
    example: 4.0,
    minimum: 0,
    maximum: 4,
  })
  gradePoints: number;

  @ApiProperty({
    description: 'Course credits',
    example: 3,
    minimum: 0,
  })
  credits: number;

  @ApiProperty({
    description: 'Grade posted date',
    example: '2025-12-15T00:00:00Z',
  })
  @Type(() => Date)
  gradePostedDate: Date;
}
