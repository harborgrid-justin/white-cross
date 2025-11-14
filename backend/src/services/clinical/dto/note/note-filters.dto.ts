import { IsBoolean, IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { NoteType } from '../../enums/note-type.enum';

/**
 * DTO for filtering clinical notes
 */
export class NoteFiltersDto {
  @ApiPropertyOptional({ description: 'Filter by student ID' })
  @IsUUID()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({ description: 'Filter by clinic visit ID' })
  @IsUUID()
  @IsOptional()
  visitId?: string;

  @ApiPropertyOptional({ description: 'Filter by note type', enum: NoteType })
  @IsEnum(NoteType)
  @IsOptional()
  type?: NoteType;

  @ApiPropertyOptional({ description: 'Filter by creator' })
  @IsUUID()
  @IsOptional()
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Show only signed notes',
    default: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  signedOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Show only unsigned notes',
    default: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  unsignedOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Number of results to return',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Number of results to skip',
    minimum: 0,
    default: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
}
