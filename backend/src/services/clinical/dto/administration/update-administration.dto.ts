import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum FollowUpStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class UpdateAdministrationDto {
  @ApiPropertyOptional({
    description: 'Additional notes about the administration',
    example: 'Student reported mild nausea after administration',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Follow-up status',
    enum: FollowUpStatus,
    example: FollowUpStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(FollowUpStatus)
  followUpStatus?: FollowUpStatus;

  @ApiPropertyOptional({
    description: 'Student response or feedback',
    example: 'Student tolerated medication well',
  })
  @IsOptional()
  @IsString()
  studentResponse?: string;
}
