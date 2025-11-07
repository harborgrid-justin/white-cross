import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

/**
 * DTO for updating existing conversations
 *
 * Allows updating conversation metadata without changing participants.
 * Only owners and admins can update conversation details.
 */
export class UpdateConversationDto {
  @ApiPropertyOptional({
    description: 'Updated conversation name',
    minLength: 1,
    maxLength: 255,
    example: 'Updated Team Discussion',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated conversation description',
    maxLength: 1000,
    example: 'Updated description for the conversation',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated avatar/profile image URL',
    example: 'https://example.com/new-avatar.png',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Whether to archive the conversation',
  })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiPropertyOptional({
    description: 'Additional metadata for the conversation',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
