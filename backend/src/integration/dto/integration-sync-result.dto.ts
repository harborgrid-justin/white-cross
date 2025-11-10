import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IntegrationSyncResultDto {
  @ApiProperty({ description: 'Whether the sync was successful' })
  success!: boolean;

  @ApiProperty({ description: 'Number of records processed' })
  recordsProcessed!: number;

  @ApiProperty({ description: 'Number of records succeeded' })
  recordsSucceeded!: number;

  @ApiProperty({ description: 'Number of records failed' })
  recordsFailed!: number;

  @ApiProperty({ description: 'Sync duration in milliseconds' })
  duration!: number;

  @ApiPropertyOptional({ description: 'Array of error messages' })
  errors?: string[];
}
