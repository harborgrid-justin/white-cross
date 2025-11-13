import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationPlatform } from '../enums';

/**
 * DTO for registering a mobile device
 */
export class RegisterDeviceDto {
  @ApiProperty({ description: 'Unique device identifier' })
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @ApiProperty({
    description: 'Notification platform',
    enum: NotificationPlatform,
  })
  @IsEnum(NotificationPlatform)
  platform!: NotificationPlatform;

  @ApiProperty({ description: 'Device push notification token' })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ description: 'Device name', required: false })
  @IsString()
  @IsOptional()
  deviceName?: string;

  @ApiProperty({ description: 'Device model', required: false })
  @IsString()
  @IsOptional()
  deviceModel?: string;

  @ApiProperty({ description: 'OS version', required: false })
  @IsString()
  @IsOptional()
  osVersion?: string;

  @ApiProperty({ description: 'App version', required: false })
  @IsString()
  @IsOptional()
  appVersion?: string;
}
