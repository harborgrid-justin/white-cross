/**
 * DTO for creating an advising session
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsBoolean,
  IsArray,
  IsOptional,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ValidateIf,
} from 'class-validator';

export enum AppointmentType {
  GENERAL = 'general',
  ACADEMIC_PLANNING = 'academic_planning',
  MAJOR_DECLARATION = 'major_declaration',
  REGISTRATION = 'registration',
  GRADUATION = 'graduation',
  CRISIS = 'crisis',
}

export enum MeetingFormat {
  IN_PERSON = 'in_person',
  VIRTUAL = 'virtual',
  PHONE = 'phone',
}

export class CreateAdvisingSessionDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU123',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  studentId: string;

  @ApiProperty({
    description: 'Advisor identifier',
    example: 'ADV456',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  advisorId: string;

  @ApiProperty({
    description: 'Type of advising appointment',
    enum: AppointmentType,
    example: AppointmentType.ACADEMIC_PLANNING,
  })
  @IsEnum(AppointmentType)
  @IsNotEmpty()
  appointmentType: AppointmentType;

  @ApiProperty({
    description: 'Scheduled start time (ISO 8601)',
    example: '2025-11-15T10:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  scheduledStart: Date;

  @ApiProperty({
    description: 'Scheduled end time (ISO 8601)',
    example: '2025-11-15T11:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  scheduledEnd: Date;

  @ApiProperty({
    description: 'Location of meeting',
    example: 'Advising Center Room 203',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  location: string;

  @ApiProperty({
    description: 'Meeting format',
    enum: MeetingFormat,
    example: MeetingFormat.IN_PERSON,
  })
  @IsEnum(MeetingFormat)
  @IsNotEmpty()
  meetingFormat: MeetingFormat;

  @ApiProperty({
    description: 'Discussion topics',
    type: [String],
    example: ['degree planning', 'course selection'],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  topics: string[];

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Student requested discussion about study abroad',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({
    description: 'Whether follow-up is required',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Follow-up date if required (ISO 8601)',
    example: '2025-11-22T10:00:00Z',
  })
  @IsOptional()
  @ValidateIf((o) => o.followUpRequired === true)
  @Type(() => Date)
  @IsDate()
  followUpDate?: Date;
}
