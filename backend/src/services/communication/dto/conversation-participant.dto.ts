import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * Participant role enumeration
 */
export enum ParticipantRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

/**
 * Notification preference enumeration
 */
export enum NotificationPreference {
  ALL = 'ALL',
  MENTIONS = 'MENTIONS',
  NONE = 'NONE',
}

/**
 * DTO for adding a participant to a conversation
 */
export class AddParticipantDto {
  @ApiProperty({
    description: 'User ID to add to the conversation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({
    description: 'Role to assign to the participant',
    enum: ParticipantRole,
    default: ParticipantRole.MEMBER,
  })
  @IsOptional()
  @IsEnum(ParticipantRole)
  role?: ParticipantRole;
}

/**
 * DTO for updating participant settings
 */
export class UpdateParticipantDto {
  @ApiPropertyOptional({
    description: 'Update participant role',
    enum: ParticipantRole,
  })
  @IsOptional()
  @IsEnum(ParticipantRole)
  role?: ParticipantRole;

  @ApiPropertyOptional({
    description: 'Whether to mute notifications',
  })
  @IsOptional()
  @IsBoolean()
  isMuted?: boolean;

  @ApiPropertyOptional({
    description: 'Whether to pin the conversation',
  })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiPropertyOptional({
    description: 'Custom display name for this participant',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  customName?: string;

  @ApiPropertyOptional({
    description: 'Notification preference',
    enum: NotificationPreference,
  })
  @IsOptional()
  @IsEnum(NotificationPreference)
  notificationPreference?: NotificationPreference;
}
