import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsUUID } from 'class-validator';

/**
 * Recent activity item for dashboard feed
 */
export class RecentActivityDto {
  @ApiProperty({
    description: 'Activity unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Activity type',
    enum: ['medication', 'incident', 'appointment'],
    example: 'medication',
  })
  @IsIn(['medication', 'incident', 'appointment'])
  type: 'medication' | 'incident' | 'appointment';

  @ApiProperty({
    description: 'Human-readable activity message',
    example: 'Administered Amoxicillin to John Doe',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Relative time string',
    example: '5 minutes ago',
  })
  @IsString()
  time: string;

  @ApiProperty({
    description: 'Activity status',
    enum: ['completed', 'pending', 'warning', 'upcoming'],
    example: 'completed',
  })
  @IsIn(['completed', 'pending', 'warning', 'upcoming'])
  status: 'completed' | 'pending' | 'warning' | 'upcoming';
}
