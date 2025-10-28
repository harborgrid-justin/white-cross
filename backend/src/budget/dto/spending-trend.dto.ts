import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for spending trend response
 */
export class SpendingTrendDto {
  @ApiProperty({
    description: 'Month for this spending trend data point',
    example: '2025-10-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  month: Date;

  @ApiProperty({
    description: 'Total amount spent during this month in dollars',
    example: 12450.75,
  })
  totalSpent: number;

  @ApiProperty({
    description: 'Number of transactions in this month',
    example: 38,
  })
  transactionCount: number;
}
