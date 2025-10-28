import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IntegrationTestResultDto {
  @ApiProperty({ description: 'Whether the test was successful' })
  success: boolean;

  @ApiProperty({ description: 'Test result message' })
  message: string;

  @ApiPropertyOptional({ description: 'Response time in milliseconds' })
  responseTime?: number;

  @ApiPropertyOptional({ description: 'Additional test details' })
  details?: Record<string, any>;
}
