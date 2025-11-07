import { IsUUID, IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for completing a follow-up appointment
 */
export class CompleteFollowUpDto {
  @ApiProperty({ description: 'Clinic visit ID from completed appointment' })
  @IsUUID()
  completedVisitId: string;

  @ApiProperty({
    description: 'Completion timestamp',
    example: '2025-11-15T14:30:00Z',
  })
  @Type(() => Date)
  @IsDate()
  completedAt: Date;

  @ApiPropertyOptional({ description: 'Completion notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
