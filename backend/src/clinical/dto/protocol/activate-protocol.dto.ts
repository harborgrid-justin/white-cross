import { IsUUID, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for activating a clinical protocol
 */
export class ActivateProtocolDto {
  @ApiProperty({ description: 'Staff member approving the protocol' })
  @IsUUID()
  approvedBy: string;

  @ApiProperty({ description: 'Approval date', example: '2025-10-28T10:00:00Z' })
  @Type(() => Date)
  @IsDate()
  approvedDate: Date;

  @ApiPropertyOptional({ description: 'Effective date (defaults to approval date if not provided)' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  effectiveDate?: Date;
}
