import {
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
  IsDateString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActionPriority } from '../enums';

export class CreateFollowUpActionDto {
  @ApiProperty({
    description: 'Action description (minimum 5 characters)',
    example: 'Follow up with parent about injury',
  })
  @IsString()
  @MinLength(5, { message: 'Follow-up action must be at least 5 characters' })
  action: string;

  @ApiProperty({
    description: 'Due date (must be in the future)',
    example: '2025-10-29T10:00:00Z',
  })
  @IsDateString()
  dueDate: Date;

  @ApiProperty({
    description: 'Priority level',
    enum: ActionPriority,
    example: ActionPriority.HIGH,
  })
  @IsEnum(ActionPriority)
  priority: ActionPriority;

  @ApiPropertyOptional({
    description: 'Assigned to user ID',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;
}
