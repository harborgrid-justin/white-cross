import { ArrayMinSize, IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Check-In DTO
 * Used for checking a student into the clinic
 */
export class CheckInDto {
  @ApiProperty({
    description: 'Student ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  studentId: string;

  @ApiProperty({
    description: 'Reasons for visit',
    example: ['Headache', 'Nausea'],
    type: [String],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one reason for visit is required' })
  @IsString({ each: true })
  reasonForVisit: string[];

  @ApiPropertyOptional({
    description: 'Symptoms reported',
    example: ['Fever', 'Fatigue', 'Body aches'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @ApiProperty({
    description: 'ID of the healthcare provider attending',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID('4')
  attendedBy: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the visit',
    example: 'Student appears pale and has elevated temperature',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
