import { PartialType } from '@nestjs/swagger';
import { CreateFollowUpActionDto } from './create-follow-up-action.dto';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ActionStatus } from '../enums';

export class UpdateFollowUpActionDto extends PartialType(CreateFollowUpActionDto) {
  @ApiPropertyOptional({
    description: 'Action status',
    enum: ActionStatus,
  })
  @IsOptional()
  @IsEnum(ActionStatus)
  status?: ActionStatus;

  @ApiPropertyOptional({
    description: 'Completion notes',
    example: 'Parent contacted and satisfied with response',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Completed by user ID',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  completedBy?: string;
}
