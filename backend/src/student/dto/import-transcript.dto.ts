/**
 * @fileoverview Import Academic Transcript DTO
 * @module student/dto
 * @description DTO for importing student academic transcripts
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Course Grade Item
 * Individual course grade entry in transcript
 */
export class CourseGrade {
  @ApiProperty({
    description: 'Course name or code',
    example: 'MATH-101',
  })
  @IsNotEmpty()
  @IsString()
  courseName!: string;

  @ApiProperty({
    description: 'Letter grade or numeric grade',
    example: 'A',
  })
  @IsNotEmpty()
  @IsString()
  grade!: string;

  @ApiPropertyOptional({
    description: 'Numeric grade value (0-100)',
    example: 95,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  numericGrade?: number;

  @ApiPropertyOptional({
    description: 'Credit hours for this course',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  credits?: number;
}

/**
 * Import Academic Transcript DTO
 *
 * Used for importing academic transcripts:
 * - Course grades and credits
 * - GPA calculations
 * - Attendance records
 * - Academic achievements
 *
 * PHI Protected: Academic records are sensitive educational information
 */
export class ImportTranscriptDto {
  @ApiProperty({
    description: 'School year or semester identifier',
    example: '2024-2025 Fall',
  })
  @IsNotEmpty()
  @IsString()
  academicYear!: string;

  @ApiProperty({
    description: 'Array of course grades',
    type: [CourseGrade],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseGrade)
  grades!: CourseGrade[];

  @ApiPropertyOptional({
    description: 'Cumulative GPA (0.0 to 4.0 scale)',
    example: 3.75,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4.0)
  cumulativeGpa?: number;

  @ApiPropertyOptional({
    description: 'Semester GPA (0.0 to 4.0 scale)',
    example: 3.85,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4.0)
  semesterGpa?: number;

  @ApiPropertyOptional({
    description: 'Total credits earned',
    example: 24,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalCredits?: number;

  @ApiPropertyOptional({
    description: 'Attendance record (days present)',
    example: 165,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  daysPresent?: number;

  @ApiPropertyOptional({
    description: 'Attendance record (days absent)',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  daysAbsent?: number;

  @ApiPropertyOptional({
    description: 'Academic achievements and awards',
    example: ['Honor Roll', 'Perfect Attendance'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @ApiPropertyOptional({
    description: 'Additional notes about the transcript',
    example: 'Transferred from XYZ School District',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
