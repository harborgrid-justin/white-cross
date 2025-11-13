/**
 * @fileoverview Waitlist Status Query DTO
 * @module student/dto
 * @description Query parameters for retrieving student waitlist status
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * Waitlist Status Query DTO
 *
 * Used for querying waitlist status:
 * - Current position in queue
 * - Estimated wait time
 * - All active waitlists for student
 * - Waitlist history
 *
 * Can filter by appointment type to get specific waitlist status
 */
export class WaitlistStatusDto {
  @ApiPropertyOptional({
    description: 'Filter by specific appointment type',
    example: 'vision_screening',
  })
  @IsOptional()
  @IsString()
  appointmentType?: string;
}
