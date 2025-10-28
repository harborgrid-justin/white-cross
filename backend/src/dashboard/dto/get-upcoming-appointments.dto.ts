import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Query parameters for upcoming appointments endpoint
 */
export class GetUpcomingAppointmentsDto {
  @ApiProperty({
    description: 'Maximum number of appointments to return',
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
