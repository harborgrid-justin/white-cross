import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

/**
 * Trend data with percentage change and direction
 */
export class TrendDataDto {
  @ApiProperty({
    description: 'Metric value as string',
    example: '125',
  })
  @IsString()
  value: string;

  @ApiProperty({
    description: 'Percentage change with sign',
    example: '+12.5%',
  })
  @IsString()
  change: string;

  @ApiProperty({
    description: 'Type of change direction',
    enum: ['positive', 'negative', 'neutral'],
    example: 'positive',
  })
  @IsIn(['positive', 'negative', 'neutral'])
  changeType: 'positive' | 'negative' | 'neutral';
}
