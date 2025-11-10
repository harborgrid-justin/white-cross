/**
 * Housing Application DTOs for student housing applications
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

export enum HousingApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DENIED = 'denied',
  WAITLIST = 'waitlist',
  CANCELLED = 'cancelled',
  HOUSING_ASSIGNED = 'housing_assigned',
}

export enum HousingPreference {
  ON_CAMPUS_RESIDENCE_HALL = 'on_campus_residence_hall',
  MARRIED_HOUSING = 'married_housing',
  GRADUATE_HOUSING = 'graduate_housing',
  APARTMENT = 'apartment',
}

export enum MealPlanType {
  UNLIMITED = 'unlimited',
  ENHANCED_PLUS = 'enhanced_plus',
  ENHANCED = 'enhanced',
  STANDARD = 'standard',
  BASIC = 'basic',
  NONE = 'none',
}

export enum StudentStatus {
  FRESHMAN = 'freshman',
  SOPHOMORE = 'sophomore',
  JUNIOR = 'junior',
  SENIOR = 'senior',
  GRADUATE = 'graduate',
  NON_TRADITIONAL = 'non_traditional',
}

export class HousingApplicationRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({
    description: 'Student class year',
    enum: StudentStatus,
  })
  @IsEnum(StudentStatus)
  classYear: StudentStatus;

  @ApiProperty({
    description: 'Student contact phone',
    example: '+1-555-123-4567',
  })
  @IsString()
  @Matches(/^\+?[\d\s\-()]+$/)
  phone: string;

  @ApiProperty({
    description: 'Housing preference',
    enum: HousingPreference,
  })
  @IsEnum(HousingPreference)
  housingPreference: HousingPreference;

  @ApiProperty({
    description: 'Meal plan preference',
    enum: MealPlanType,
  })
  @IsEnum(MealPlanType)
  mealPlanPreference: MealPlanType;

  @ApiPropertyOptional({
    description: 'Special housing requests',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiPropertyOptional({
    description: 'Accessibility accommodations needed',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  needsAccessibility?: boolean;

  @ApiPropertyOptional({
    description: 'Accessibility details',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  accessibilityDetails?: string;

  @ApiPropertyOptional({
    description: 'Roommate preference (student ID)',
    example: 'STU-2024002',
  })
  @IsOptional()
  @IsString()
  roommatePreference?: string;

  @ApiPropertyOptional({
    description: 'Early move-in needed',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  earlyMoveInNeeded?: boolean;

  @ApiPropertyOptional({
    description: 'On-campus housing commitment',
    example: 2,
    minimum: 1,
    maximum: 4,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  commitmentYears?: number;
}

export class HousingApplicationResponseDto {
  @ApiProperty({
    description: 'Housing application identifier',
    example: 'HOUSE-APP-2024001',
  })
  applicationId: string;

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
    description: 'Student email',
    example: 'john.doe@university.edu',
  })
  studentEmail: string;

  @ApiProperty({
    description: 'Application status',
    enum: HousingApplicationStatus,
  })
  status: HousingApplicationStatus;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Student class year',
    enum: StudentStatus,
  })
  classYear: StudentStatus;

  @ApiProperty({
    description: 'Housing preference',
    enum: HousingPreference,
  })
  housingPreference: HousingPreference;

  @ApiProperty({
    description: 'Meal plan preference',
    enum: MealPlanType,
  })
  mealPlanPreference: MealPlanType;

  @ApiProperty({
    description: 'Application submitted date',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  submittedDate: Date;

  @ApiPropertyOptional({
    description: 'Housing assigned date',
    example: '2025-11-20T14:30:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  assignmentDate?: Date;

  @ApiPropertyOptional({
    description: 'Application review status',
    example: 'under_review',
    enum: ['submitted', 'under_review', 'approved', 'denied', 'waitlist'],
  })
  @IsOptional()
  reviewStatus?: string;

  @ApiPropertyOptional({
    description: 'Reviewer notes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  reviewerNotes?: string;

  @ApiPropertyOptional({
    description: 'Waitlist position (if applicable)',
    example: 25,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  waitlistPosition?: number;

  @ApiPropertyOptional({
    description: 'Housing assignment details',
    type: 'object',
  })
  @IsOptional()
  assignment?: {
    residenceHall: string;
    room: string;
    floor: string;
    roommateAssigned: string;
    moveInDate: Date;
    moveOutDate: Date;
  };
}

export class BulkHousingApplicationDto {
  @ApiProperty({
    description: 'Student identifiers',
    type: [String],
    example: ['STU-2024001', 'STU-2024002'],
  })
  @IsArray()
  @IsString({ each: true })
  studentIds: string[];

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiPropertyOptional({
    description: 'Notification of status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  notifyStudents?: boolean;
}

export class HousingApplicationQueryDto {
  @ApiPropertyOptional({
    description: 'Student identifier filter',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Application status filter',
    enum: HousingApplicationStatus,
  })
  @IsOptional()
  @IsEnum(HousingApplicationStatus)
  status?: HousingApplicationStatus;

  @ApiPropertyOptional({
    description: 'Academic term filter',
  })
  @IsOptional()
  @IsString()
  term?: string;

  @ApiPropertyOptional({
    description: 'Class year filter',
    enum: StudentStatus,
  })
  @IsOptional()
  @IsEnum(StudentStatus)
  classYear?: StudentStatus;

  @ApiPropertyOptional({
    description: 'Housing preference filter',
    enum: HousingPreference,
  })
  @IsOptional()
  @IsEnum(HousingPreference)
  housingPreference?: HousingPreference;

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

export class HousingApplicationStatisticsDto {
  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Total applications received',
    example: 3500,
    minimum: 0,
  })
  totalApplications: number;

  @ApiProperty({
    description: 'Applications approved',
    example: 3200,
    minimum: 0,
  })
  approved: number;

  @ApiProperty({
    description: 'Applications denied',
    example: 50,
    minimum: 0,
  })
  denied: number;

  @ApiProperty({
    description: 'On waitlist',
    example: 250,
    minimum: 0,
  })
  waitlist: number;

  @ApiProperty({
    description: 'Applications by housing preference',
    type: 'object',
  })
  byPreference: Record<HousingPreference, number>;

  @ApiProperty({
    description: 'Applications by class year',
    type: 'object',
  })
  byClassYear: Record<StudentStatus, number>;

  @ApiProperty({
    description: 'Average processing time (days)',
    example: 7.5,
    minimum: 0,
  })
  averageProcessingTime: number;

  @ApiProperty({
    description: 'Approval rate',
    example: 91.4,
    minimum: 0,
    maximum: 100,
  })
  approvalRate: number;
}

export class StudentHousingHistoryDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Housing history records',
    type: 'array',
  })
  history: Array<{
    term: string;
    residenceHall: string;
    room: string;
    mealPlan: MealPlanType;
    moveInDate: Date;
    moveOutDate: Date;
    status: HousingApplicationStatus;
  }>;

  @ApiProperty({
    description: 'Current housing assignment',
    type: 'object',
  })
  currentAssignment: {
    term: string;
    residenceHall: string;
    room: string;
    floor: string;
    mealPlan: MealPlanType;
    moveInDate: Date;
    moveOutDate: Date;
  };

  @ApiProperty({
    description: 'Housing years completed',
    example: 2,
    minimum: 0,
  })
  yearsInHousing: number;
}
