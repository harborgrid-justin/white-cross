import { IsUUID, IsString, IsInt, IsDate, IsOptional, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FollowUpStatus } from '../../enums/follow-up-status.enum';

/**
 * DTO for scheduling a follow-up appointment
 */
export class ScheduleFollowUpDto {
  @ApiProperty({ description: 'Student ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  studentId: string;

  @ApiPropertyOptional({ description: 'Original clinic visit ID that triggered follow-up' })
  @IsUUID()
  @IsOptional()
  originalVisitId?: string;

  @ApiProperty({ description: 'Staff member scheduling the follow-up' })
  @IsUUID()
  scheduledBy: string;

  @ApiProperty({ description: 'Scheduled date and time', example: '2025-11-15T14:00:00Z' })
  @Type(() => Date)
  @IsDate()
  scheduledDate: Date;

  @ApiPropertyOptional({ description: 'Duration in minutes', example: 30, minimum: 15, default: 30 })
  @IsInt()
  @Min(15)
  @IsOptional()
  durationMinutes?: number = 30;

  @ApiProperty({ description: 'Reason for follow-up', example: 'Recheck blood pressure' })
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Follow-up type', example: 'routine' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: 'Initial status', enum: FollowUpStatus, default: FollowUpStatus.SCHEDULED })
  @IsEnum(FollowUpStatus)
  @IsOptional()
  status?: FollowUpStatus;

  @ApiPropertyOptional({ description: 'Assign to specific staff member' })
  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({ description: 'Priority level', example: 'normal' })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
