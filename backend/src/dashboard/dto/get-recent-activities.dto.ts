import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Query parameters for recent activities endpoint
 */
export class GetRecentActivitiesDto {
  @ApiProperty({
    description: 'Maximum number of activities to return',
    minimum: 1,
    maximum: 50,
    default: 5,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 5;
}
