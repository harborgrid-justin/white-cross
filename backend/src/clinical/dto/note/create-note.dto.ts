import { IsString, IsUUID, IsArray, IsOptional, IsEnum, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NoteType } from '../../enums/note-type.enum';

/**
 * DTO for creating a new clinical note
 */
export class CreateNoteDto {
  @ApiProperty({ description: 'Student ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  studentId: string;

  @ApiPropertyOptional({ description: 'Associated clinic visit ID' })
  @IsUUID()
  @IsOptional()
  visitId?: string;

  @ApiProperty({ description: 'Note type', enum: NoteType, default: NoteType.GENERAL })
  @IsEnum(NoteType)
  type: NoteType;

  @ApiProperty({ description: 'Staff member creating note' })
  @IsUUID()
  createdBy: string;

  @ApiProperty({ description: 'Note title', example: 'Follow-up Visit Note', maxLength: 500 })
  @IsString()
  @MaxLength(500, { message: 'Note title cannot exceed 500 characters' })
  title: string;

  @ApiProperty({ description: 'Note content', maxLength: 10000 })
  @IsString()
  @MaxLength(10000, { message: 'Note content cannot exceed 10000 characters' })
  content: string;

  // SOAP note components (required if type is SOAP)
  @ApiPropertyOptional({ description: 'Subjective findings (SOAP note)', example: 'Patient reports headache for 2 days', maxLength: 5000 })
  @IsString()
  @IsOptional()
  @MaxLength(5000, { message: 'Subjective findings cannot exceed 5000 characters' })
  subjective?: string;

  @ApiPropertyOptional({ description: 'Objective findings (SOAP note)', example: 'BP 120/80, Temp 98.6°F', maxLength: 5000 })
  @IsString()
  @IsOptional()
  @MaxLength(5000, { message: 'Objective findings cannot exceed 5000 characters' })
  objective?: string;

  @ApiPropertyOptional({ description: 'Assessment (SOAP note)', example: 'Tension headache likely', maxLength: 5000 })
  @IsString()
  @IsOptional()
  @MaxLength(5000, { message: 'Assessment cannot exceed 5000 characters' })
  assessment?: string;

  @ApiPropertyOptional({ description: 'Plan (SOAP note)', example: 'OTC pain relief, follow up in 1 week', maxLength: 5000 })
  @IsString()
  @IsOptional()
  @MaxLength(5000, { message: 'Plan cannot exceed 5000 characters' })
  plan?: string;

  @ApiPropertyOptional({ description: 'Tags for categorization', example: ['headache', 'follow-up'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true, message: 'Each tag cannot exceed 50 characters' })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Is this note confidential?', default: false })
  @IsBoolean()
  @IsOptional()
  isConfidential?: boolean;
}
