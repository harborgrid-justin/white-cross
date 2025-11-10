import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Screening types as per state requirements
 */
export enum ScreeningType {
  VISION = 'VISION',
  HEARING = 'HEARING',
  BMI = 'BMI',
  DENTAL = 'DENTAL',
  SCOLIOSIS = 'SCOLIOSIS',
  TB = 'TB',
  DEVELOPMENTAL = 'DEVELOPMENTAL',
}

/**
 * Screening result status
 */
export enum ScreeningResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  REFER = 'REFER',
  INCOMPLETE = 'INCOMPLETE',
}

/**
 * DTO for creating a screening record
 */
export class CreateScreeningDto {
  @ApiProperty({
    description: 'Student UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Type of screening',
    enum: ScreeningType,
    example: ScreeningType.VISION,
  })
  @IsEnum(ScreeningType)
  screeningType: ScreeningType;

  @ApiProperty({
    description: 'Date screening was performed',
    example: '2024-11-04',
  })
  @IsDateString()
  screeningDate: string;

  @ApiProperty({
    description: 'Screening result',
    enum: ScreeningResult,
    example: ScreeningResult.PASS,
  })
  @IsEnum(ScreeningResult)
  result: ScreeningResult;

  @ApiPropertyOptional({
    description: 'Screener name',
    example: 'Nurse Johnson',
  })
  @IsOptional()
  @IsString()
  screenerName?: string;

  @ApiPropertyOptional({
    description: 'Screening notes and observations',
    example: 'Vision 20/20 in both eyes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Follow-up required',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Follow-up notes',
    example: 'Refer to ophthalmologist',
  })
  @IsOptional()
  @IsString()
  followUpNotes?: string;
}

/**
 * DTO for batch screening import
 */
export class BatchScreeningDto {
  @ApiProperty({
    description: 'Array of screening records to import',
    type: [CreateScreeningDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScreeningDto)
  screenings: CreateScreeningDto[];
}

/**
 * DTO for creating a screening referral
 */
export class CreateReferralDto {
  @ApiProperty({
    description: 'Referral provider name',
    example: 'Dr. Sarah Johnson, MD - Ophthalmology',
  })
  @IsString()
  providerName: string;

  @ApiProperty({
    description: 'Referral reason',
    example: 'Failed vision screening - requires comprehensive eye exam',
  })
  @IsString()
  reason: string;

  @ApiPropertyOptional({
    description: 'Referral urgency level',
    enum: ['ROUTINE', 'URGENT', 'EMERGENCY'],
    example: 'ROUTINE',
  })
  @IsOptional()
  @IsEnum(['ROUTINE', 'URGENT', 'EMERGENCY'])
  urgency?: string;

  @ApiPropertyOptional({
    description: 'Parent/guardian notified',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  parentNotified?: boolean;

  @ApiPropertyOptional({
    description: 'Notification date',
    example: '2024-11-04',
  })
  @IsOptional()
  @IsDateString()
  notificationDate?: string;
}

/**
 * DTO for querying overdue screenings
 */
export class OverdueScreeningsQueryDto {
  @ApiPropertyOptional({
    description: 'School ID to filter',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  schoolId?: string;

  @ApiPropertyOptional({
    description: 'Grade level to filter',
    example: '5',
  })
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @ApiPropertyOptional({
    description: 'Screening type to filter',
    enum: ScreeningType,
  })
  @IsOptional()
  @IsEnum(ScreeningType)
  screeningType?: ScreeningType;
}

/**
 * DTO for screening schedule query
 */
export class ScreeningScheduleQueryDto {
  @ApiPropertyOptional({
    description: 'Grade level',
    example: '5',
  })
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @ApiPropertyOptional({
    description: 'State code for state-specific requirements',
    example: 'CA',
  })
  @IsOptional()
  @IsString()
  stateCode?: string;
}

/**
 * DTO for screening statistics query
 */
export class ScreeningStatisticsQueryDto {
  @ApiPropertyOptional({
    description: 'School ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  schoolId?: string;

  @ApiPropertyOptional({
    description: 'Start date for statistics',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for statistics',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Screening type to filter',
    enum: ScreeningType,
  })
  @IsOptional()
  @IsEnum(ScreeningType)
  screeningType?: ScreeningType;
}
