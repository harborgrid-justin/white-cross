/**
 * Advising Note DTOs for documenting student interactions
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsArray,
  IsOptional,
  IsDate,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';

export enum NoteType {
  SESSION = 'session',
  PHONE_CALL = 'phone_call',
  EMAIL = 'email',
  WALK_IN = 'walk_in',
  GROUP = 'group',
  OTHER = 'other',
}

export class ActionItemDto {
  @ApiProperty({ description: 'Action item description', example: 'Register for MATH301' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  item: string;

  @ApiPropertyOptional({ description: 'Due date for action item' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiProperty({ description: 'Whether action item is completed', example: false })
  @IsBoolean()
  completed: boolean;
}

export class CreateAdvisingNoteDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  studentId: string;

  @ApiProperty({ description: 'Advisor identifier', example: 'ADV456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  advisorId: string;

  @ApiPropertyOptional({ description: 'Related session identifier', example: 'SESSION-789' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sessionId?: string;

  @ApiProperty({ description: 'Note type', enum: NoteType })
  @IsEnum(NoteType)
  @IsNotEmpty()
  noteType: NoteType;

  @ApiProperty({ description: 'Note subject', example: 'Academic planning discussion', minLength: 5, maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  subject: string;

  @ApiProperty({ description: 'Note content', example: 'Discussed fall course selection and degree requirements', minLength: 10, maxLength: 5000 })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(5000)
  content: string;

  @ApiPropertyOptional({ description: 'Action items', type: [ActionItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionItemDto)
  actionItems?: ActionItemDto[];

  @ApiProperty({ description: 'Whether note is confidential', example: false })
  @IsBoolean()
  confidential: boolean;

  @ApiPropertyOptional({ description: 'Staff members to share note with', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sharedWith?: string[];
}

export class UpdateAdvisingNoteDto {
  @ApiPropertyOptional({ description: 'Updated subject', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;

  @ApiPropertyOptional({ description: 'Updated content', maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;

  @ApiPropertyOptional({ description: 'Updated action items', type: [ActionItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionItemDto)
  actionItems?: ActionItemDto[];

  @ApiPropertyOptional({ description: 'Updated confidentiality status' })
  @IsOptional()
  @IsBoolean()
  confidential?: boolean;

  @ApiPropertyOptional({ description: 'Updated shared with list', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sharedWith?: string[];
}

export class AdvisingNoteResponseDto {
  @ApiProperty({ description: 'Note identifier', example: 'NOTE-1234567890' })
  noteId: string;

  @ApiProperty({ description: 'Student identifier', example: 'STU123' })
  studentId: string;

  @ApiProperty({ description: 'Student name', example: 'John Doe' })
  studentName: string;

  @ApiProperty({ description: 'Advisor identifier', example: 'ADV456' })
  advisorId: string;

  @ApiProperty({ description: 'Advisor name', example: 'Dr. Jane Smith' })
  advisorName: string;

  @ApiPropertyOptional({ description: 'Session identifier' })
  sessionId?: string;

  @ApiProperty({ description: 'Note date' })
  noteDate: Date;

  @ApiProperty({ description: 'Note type', enum: NoteType })
  noteType: NoteType;

  @ApiProperty({ description: 'Note subject' })
  subject: string;

  @ApiProperty({ description: 'Note content' })
  content: string;

  @ApiProperty({ description: 'Action items', type: [ActionItemDto] })
  actionItems: ActionItemDto[];

  @ApiProperty({ description: 'Is confidential', example: false })
  confidential: boolean;

  @ApiProperty({ description: 'Shared with', type: [String] })
  sharedWith: string[];

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}

export class ShareAdvisingNotesResponseDto {
  @ApiProperty({ description: 'Whether sharing was successful', example: true })
  shared: boolean;

  @ApiProperty({ description: 'Staff members note was shared with', type: [String] })
  sharedWith: string[];

  @ApiProperty({ description: 'Number of notifications sent', example: 2 })
  notificationsSent: number;
}
