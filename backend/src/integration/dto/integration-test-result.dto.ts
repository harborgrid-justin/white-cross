import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { IntegrationTestDetails } from '../types/test-details.types';

export class IntegrationTestResultDto {
  @ApiProperty({ description: 'Whether the test was successful' })
  success!: boolean;

  @ApiProperty({ description: 'Test result message' })
  message!: string;

  @ApiPropertyOptional({ description: 'Response time in milliseconds' })
  responseTime?: number;

  @ApiPropertyOptional({ description: 'Additional test details' })
  details?: IntegrationTestDetails;
}
