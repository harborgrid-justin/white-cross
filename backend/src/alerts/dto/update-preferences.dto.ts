/**
 * @fileoverview Update Preferences DTO
 * @module alerts/dto/update-preferences.dto
 * @description DTO for updating notification preferences
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional } from 'class-validator';

export class AlertsUpdatePreferencesDto {
  @ApiProperty({
    description: 'Enable email notifications',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiProperty({
    description: 'Enable in-app notifications',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  inAppNotifications?: boolean;

  @ApiProperty({
    description: 'Enable SMS notifications',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  @ApiProperty({
    description: 'Alert type preferences',
    required: false,
    example: {
      health: true,
      medication: true,
      appointment: true,
      vaccination: false,
    },
  })
  @IsOptional()
  @IsObject()
  alertTypePreferences?: Record<string, boolean>;
}
