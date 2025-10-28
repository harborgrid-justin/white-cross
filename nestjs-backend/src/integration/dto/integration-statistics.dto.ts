import { ApiProperty } from '@nestjs/swagger';

export class IntegrationStatsByTypeDto {
  @ApiProperty({ description: 'Number of successful syncs' })
  success: number;

  @ApiProperty({ description: 'Number of failed syncs' })
  failed: number;

  @ApiProperty({ description: 'Total syncs' })
  total: number;
}

export class SyncStatisticsDto {
  @ApiProperty({ description: 'Total number of syncs' })
  totalSyncs: number;

  @ApiProperty({ description: 'Number of successful syncs' })
  successfulSyncs: number;

  @ApiProperty({ description: 'Number of failed syncs' })
  failedSyncs: number;

  @ApiProperty({ description: 'Success rate percentage' })
  successRate: number;

  @ApiProperty({ description: 'Total records processed' })
  totalRecordsProcessed: number;

  @ApiProperty({ description: 'Total records succeeded' })
  totalRecordsSucceeded: number;

  @ApiProperty({ description: 'Total records failed' })
  totalRecordsFailed: number;
}

export class IntegrationStatisticsDto {
  @ApiProperty({ description: 'Total number of integrations' })
  totalIntegrations: number;

  @ApiProperty({ description: 'Number of active integrations' })
  activeIntegrations: number;

  @ApiProperty({ description: 'Number of inactive integrations' })
  inactiveIntegrations: number;

  @ApiProperty({ description: 'Sync statistics' })
  syncStatistics: SyncStatisticsDto;

  @ApiProperty({ description: 'Statistics by integration type' })
  statsByType: Record<string, IntegrationStatsByTypeDto>;
}
