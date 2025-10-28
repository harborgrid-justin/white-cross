import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for updating device notification preferences
 */
export class UpdatePreferencesDto {
  @ApiProperty({ description: 'Allow notifications', required: false })
  @IsBoolean()
  @IsOptional()
  allowNotifications?: boolean;

  @ApiProperty({ description: 'Allow notification sound', required: false })
  @IsBoolean()
  @IsOptional()
  allowSound?: boolean;

  @ApiProperty({ description: 'Allow badge updates', required: false })
  @IsBoolean()
  @IsOptional()
  allowBadge?: boolean;
}
