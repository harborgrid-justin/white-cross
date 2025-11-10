/**
 * Schedule Conflict DTOs for managing schedule conflicts
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
  IsEmail,
  Matches,
} from 'class-validator';

export enum ConflictType {
  TIME_OVERLAP = 'time_overlap',
  SAME_COURSE = 'same_course',
  CAMPUS_LOCATION = 'campus_location',
  EXAM_CONFLICT = 'exam_conflict',
}

export enum ConflictSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum DayOfWeek {
  MONDAY = 'MON',
  TUESDAY = 'TUE',
  WEDNESDAY = 'WED',
  THURSDAY = 'THU',
  FRIDAY = 'FRI',
  SATURDAY = 'SAT',
  SUNDAY = 'SUN',
}

export class TimeSlotDto {
  @ApiProperty({
    description: 'Day of week',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  @IsEnum(DayOfWeek)
  day: DayOfWeek;

  @ApiProperty({
    description: 'Start time in HH:MM format',
    example: '09:00',
  })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  startTime: string;

  @ApiProperty({
    description: 'End time in HH:MM format',
    example: '10:30',
  })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  endTime: string;

  @ApiPropertyOptional({
    description: 'Meeting location',
    example: 'Science Building 101',
  })
  @IsOptional()
  @IsString()
  location?: string;
}

export class ScheduleConflictDetectionRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Course identifiers to check',
    type: [String],
    example: ['CRS-CS101', 'CRS-MATH201'],
  })
  @IsArray()
  @IsString({ each: true })
  courseIds: string[];

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiPropertyOptional({
    description: 'Section numbers',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sectionNumbers?: string[];
}

export class ScheduleConflictDto {
  @ApiProperty({
    description: 'Conflict identifier',
    example: 'CONFLICT-2024001',
  })
  conflictId: string;

  @ApiProperty({
    description: 'Conflict type',
    enum: ConflictType,
  })
  conflictType: ConflictType;

  @ApiProperty({
    description: 'Conflict severity',
    enum: ConflictSeverity,
  })
  severity: ConflictSeverity;

  @ApiProperty({
    description: 'First course identifier',
    example: 'CRS-CS101',
  })
  courseId1: string;

  @ApiProperty({
    description: 'First course title',
    example: 'Introduction to Computer Science',
  })
  courseTitle1: string;

  @ApiProperty({
    description: 'First course section',
    example: '01',
  })
  section1: string;

  @ApiProperty({
    description: 'Second course identifier',
    example: 'CRS-MATH201',
  })
  courseId2: string;

  @ApiProperty({
    description: 'Second course title',
    example: 'Calculus II',
  })
  courseTitle2: string;

  @ApiProperty({
    description: 'Second course section',
    example: '02',
  })
  section2: string;

  @ApiProperty({
    description: 'First course schedule',
    type: () => TimeSlotDto,
    isArray: true,
  })
  schedule1: TimeSlotDto[];

  @ApiProperty({
    description: 'Second course schedule',
    type: () => TimeSlotDto,
    isArray: true,
  })
  schedule2: TimeSlotDto[];

  @ApiProperty({
    description: 'Conflict description',
    example: 'Both courses meet on Monday and Wednesday from 10:00-11:30',
  })
  description: string;

  @ApiPropertyOptional({
    description: 'Conflict resolution options',
    type: 'array',
  })
  resolutionOptions?: Array<{
    option: string;
    alternativeCourseId: string;
    availableSections: string[];
  }>;
}

export class ScheduleConflictResponseDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Has conflicts',
    example: false,
  })
  hasConflicts: boolean;

  @ApiProperty({
    description: 'Total conflicts found',
    example: 0,
    minimum: 0,
  })
  conflictCount: number;

  @ApiPropertyOptional({
    description: 'Critical conflicts',
    type: 'array',
  })
  criticalConflicts?: ScheduleConflictDto[];

  @ApiPropertyOptional({
    description: 'Warning conflicts',
    type: 'array',
  })
  warningConflicts?: ScheduleConflictDto[];

  @ApiProperty({
    description: 'Can proceed with registration',
    example: true,
  })
  canProceed: boolean;

  @ApiProperty({
    description: 'Check timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  checkedAt: Date;
}

export class CourseScheduleDto {
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
    description: 'Instructor name',
    example: 'Dr. Jane Smith',
  })
  instructor: string;

  @ApiProperty({
    description: 'Schedule time slots',
    type: 'array',
    isArray: true,
  })
  timeSlots: TimeSlotDto[];

  @ApiProperty({
    description: 'Building location',
    example: 'Science Building',
  })
  building: string;

  @ApiProperty({
    description: 'Room number',
    example: '101',
  })
  room: string;

  @ApiProperty({
    description: 'Exam schedule',
    type: 'object',
  })
  examSchedule: {
    date: Date;
    time: string;
    location: string;
    duration: number;
  };
}

export class StudentScheduleDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Enrolled courses with schedules',
    type: 'array',
    isArray: true,
  })
  courses: CourseScheduleDto[];

  @ApiProperty({
    description: 'Weekly schedule matrix',
    type: 'object',
  })
  weeklyMatrix: Record<string, Array<{
    time: string;
    courseId: string;
    courseTitle: string;
    location: string;
  }>>;

  @ApiProperty({
    description: 'Exam schedule summary',
    type: 'array',
  })
  exams: Array<{
    courseId: string;
    courseTitle: string;
    date: Date;
    time: string;
    location: string;
  }>;
}

export class ConflictResolutionRequestDto {
  @ApiProperty({
    description: 'Conflict identifier',
    example: 'CONFLICT-2024001',
  })
  @IsString()
  @IsNotEmpty()
  conflictId: string;

  @ApiProperty({
    description: 'Course to drop',
    example: 'CRS-CS101',
  })
  @IsString()
  @IsNotEmpty()
  dropCourseId: string;

  @ApiProperty({
    description: 'Alternative course to add',
    example: 'CRS-CS102',
  })
  @IsString()
  @IsNotEmpty()
  alternativeCourseId: string;

  @ApiPropertyOptional({
    description: 'Preferred section',
    example: '02',
  })
  @IsOptional()
  @IsString()
  preferredSection?: string;

  @ApiPropertyOptional({
    description: 'Resolution notes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ScheduleConflictQueryDto {
  @ApiPropertyOptional({
    description: 'Student identifier filter',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Conflict type filter',
    enum: ConflictType,
  })
  @IsOptional()
  @IsEnum(ConflictType)
  conflictType?: ConflictType;

  @ApiPropertyOptional({
    description: 'Severity filter',
    enum: ConflictSeverity,
  })
  @IsOptional()
  @IsEnum(ConflictSeverity)
  severity?: ConflictSeverity;

  @ApiPropertyOptional({
    description: 'Academic term filter',
  })
  @IsOptional()
  @IsString()
  term?: string;

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
