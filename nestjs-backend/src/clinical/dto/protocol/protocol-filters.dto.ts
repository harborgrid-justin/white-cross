import { IsOptional, IsEnum, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProtocolStatus } from '../../enums/protocol-status.enum';

/**
 * DTO for filtering clinical protocols
 */
export class ProtocolFiltersDto {
  @ApiPropertyOptional({ description: 'Filter by status', enum: ProtocolStatus })
  @IsEnum(ProtocolStatus)
  @IsOptional()
  status?: ProtocolStatus;

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Search by name (partial match)' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by tag' })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({ description: 'Show only active protocols', default: false })
  @Type(() => Boolean)
  @IsOptional()
  activeOnly?: boolean;

  @ApiPropertyOptional({ description: 'Number of results to return', minimum: 1, maximum: 100, default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Number of results to skip', minimum: 0, default: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
}
