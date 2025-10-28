import { IsString, IsOptional, IsEnum, MinLength, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentStatus } from './update-document.dto';

/**
 * DTO for document search with filters
 */
export class SearchDocumentsDto {
  @ApiPropertyOptional({
    description: 'Search query (min 1 character)',
    example: 'consent form',
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  query?: string;

  @ApiPropertyOptional({
    description: 'Filter by document category',
    example: 'CONSENT_FORM',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter by document status',
    enum: DocumentStatus,
    example: DocumentStatus.APPROVED,
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiPropertyOptional({
    description: 'Filter by student ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Maximum results to return',
    example: 50,
    default: 50,
  })
  @IsOptional()
  limit?: number = 50;
}
