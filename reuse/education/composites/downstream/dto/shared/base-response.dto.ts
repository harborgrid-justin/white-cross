/**
 * Shared base response DTOs for downstream composites
 * Used for consistent response structures across all services
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Success response DTO
 */
export class SuccessResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiPropertyOptional({
    description: 'Success message',
    example: 'Operation completed successfully',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Response timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  timestamp?: string;
}

/**
 * Create response DTO
 */
export class CreateResponseDto<T = any> {
  @ApiProperty({
    description: 'Whether the creation was successful',
    example: true,
  })
  created: boolean;

  @ApiProperty({
    description: 'Created resource ID',
    example: 'RES-1234567890',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'Created resource data',
  })
  data?: T;

  @ApiPropertyOptional({
    description: 'Creation timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  createdAt?: string;
}

/**
 * Update response DTO
 */
export class UpdateResponseDto<T = any> {
  @ApiProperty({
    description: 'Whether the update was successful',
    example: true,
  })
  updated: boolean;

  @ApiProperty({
    description: 'Updated resource ID',
    example: 'RES-1234567890',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'Updated resource data',
  })
  data?: T;

  @ApiPropertyOptional({
    description: 'Update timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  updatedAt?: string;
}

/**
 * Delete response DTO
 */
export class DeleteResponseDto {
  @ApiProperty({
    description: 'Whether the deletion was successful',
    example: true,
  })
  deleted: boolean;

  @ApiProperty({
    description: 'Deleted resource ID',
    example: 'RES-1234567890',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'Deletion timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  deletedAt?: string;
}

/**
 * Batch operation response DTO
 */
export class BatchOperationResponseDto {
  @ApiProperty({
    description: 'Total items processed',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Successfully processed items',
    example: 95,
  })
  successful: number;

  @ApiProperty({
    description: 'Failed items',
    example: 5,
  })
  failed: number;

  @ApiPropertyOptional({
    description: 'Array of error details for failed items',
    type: 'array',
  })
  errors?: Array<{
    itemId: string;
    error: string;
  }>;

  @ApiPropertyOptional({
    description: 'Processing timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  processedAt?: string;
}

/**
 * Operation status response DTO
 */
export class OperationStatusDto {
  @ApiProperty({
    description: 'Operation status',
    enum: ['pending', 'in_progress', 'completed', 'failed', 'cancelled'],
    example: 'completed',
  })
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

  @ApiPropertyOptional({
    description: 'Progress percentage (0-100)',
    minimum: 0,
    maximum: 100,
    example: 75,
  })
  progress?: number;

  @ApiPropertyOptional({
    description: 'Status message',
    example: 'Processing 75 of 100 items',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Started timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  startedAt?: string;

  @ApiPropertyOptional({
    description: 'Completed timestamp',
    example: '2025-11-10T12:05:00Z',
  })
  completedAt?: string;
}
