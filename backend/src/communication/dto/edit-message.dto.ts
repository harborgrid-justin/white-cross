import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * DTO for editing existing messages
 *
 * Only the message sender can edit their messages.
 * Editing history is tracked via isEdited and editedAt fields.
 * Original content is preserved for audit purposes.
 */
export class EditMessageDto {
  @ApiProperty({
    description: 'Updated message content',
    minLength: 1,
    maxLength: 10000,
    example: 'Updated message content',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  content: string;

  @ApiPropertyOptional({
    description: 'Updated attachments (replaces existing attachments)',
    type: [String],
    maxItems: 10,
    example: ['https://example.com/updated-file.pdf'],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  attachments?: string[];

  @ApiPropertyOptional({
    description: 'Additional metadata for the edit',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
