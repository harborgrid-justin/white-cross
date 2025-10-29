import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsUUID,
  IsArray,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for searching messages with full-text search
 *
 * Supports:
 * - Full-text search across message content
 * - Filter by conversation
 * - Filter by date range
 * - Filter by sender
 * - Filter by attachments
 * - Pagination
 */
export class SearchMessagesDto {
  @ApiProperty({
    description: 'Search query string',
    minLength: 1,
    maxLength: 500,
    example: 'project update',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  query: string;

  @ApiPropertyOptional({
    description: 'Filter by conversation ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  conversationId?: string;

  @ApiPropertyOptional({
    description: 'Filter by sender user ID',
    example: '456e7890-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  senderId?: string;

  @ApiPropertyOptional({
    description: 'Filter by multiple conversation IDs',
    type: [String],
    example: ['conv-id-1', 'conv-id-2'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  conversationIds?: string[];

  @ApiPropertyOptional({
    description: 'Filter messages after this date (ISO 8601)',
    example: '2025-10-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter messages before this date (ISO 8601)',
    example: '2025-10-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Only search messages with attachments',
    default: false,
  })
  @IsOptional()
  hasAttachments?: boolean;

  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
