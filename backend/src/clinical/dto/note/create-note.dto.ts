import { IsString, IsUUID, IsArray, IsOptional, IsEnum, IsBoolean } from 'class-validator';
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

  @ApiProperty({ description: 'Note title', example: 'Follow-up Visit Note' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Note content' })
  @IsString()
  content: string;

  // SOAP note components (required if type is SOAP)
  @ApiPropertyOptional({ description: 'Subjective findings (SOAP note)', example: 'Patient reports headache for 2 days' })
  @IsString()
  @IsOptional()
  subjective?: string;

  @ApiPropertyOptional({ description: 'Objective findings (SOAP note)', example: 'BP 120/80, Temp 98.6°F' })
  @IsString()
  @IsOptional()
  objective?: string;

  @ApiPropertyOptional({ description: 'Assessment (SOAP note)', example: 'Tension headache likely' })
  @IsString()
  @IsOptional()
  assessment?: string;

  @ApiPropertyOptional({ description: 'Plan (SOAP note)', example: 'OTC pain relief, follow up in 1 week' })
  @IsString()
  @IsOptional()
  plan?: string;

  @ApiPropertyOptional({ description: 'Tags for categorization', example: ['headache', 'follow-up'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Is this note confidential?', default: false })
  @IsBoolean()
  @IsOptional()
  isConfidential?: boolean;
}
