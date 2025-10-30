import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
  IsUrl,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Conversation type enumeration
 */
export enum ConversationType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
  CHANNEL = 'CHANNEL',
}

/**
 * Participant DTO for conversation creation
 */
export class CreateConversationParticipantDto {
  @ApiProperty({
    description: 'User ID of the participant',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({
    description: 'Role of the participant',
    enum: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'],
    default: 'MEMBER',
  })
  @IsOptional()
  @IsEnum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'])
  role?: string;
}

/**
 * DTO for creating new conversations
 *
 * Supports three types of conversations:
 * - DIRECT: One-to-one conversation (requires exactly 2 participants)
 * - GROUP: Small group conversation (2-100 participants)
 * - CHANNEL: Large broadcast channel (unlimited participants)
 */
export class CreateConversationDto {
  @ApiProperty({
    description: 'Type of conversation',
    enum: ConversationType,
    example: ConversationType.GROUP,
  })
  @IsEnum(ConversationType)
  type: ConversationType;

  @ApiPropertyOptional({
    description: 'Conversation name (required for GROUP and CHANNEL)',
    minLength: 1,
    maxLength: 255,
    example: 'Project Team Discussion',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Conversation description',
    maxLength: 1000,
    example: 'Discussion space for project collaboration',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Avatar/profile image URL',
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiProperty({
    description: 'Initial participants (must include at least one participant)',
    type: [CreateConversationParticipantDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateConversationParticipantDto)
  participants: CreateConversationParticipantDto[];

  @ApiPropertyOptional({
    description: 'Additional metadata for the conversation',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
