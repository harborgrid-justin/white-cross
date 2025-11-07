/**
 * Share Document DTO
 * Data transfer object for sharing documents with users
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  IsUUID,
} from 'class-validator';

export class ShareDocumentDto {
  @ApiProperty({
    description: 'Array of user IDs to share document with (max 50)',
    type: [String],
    minItems: 1,
    maxItems: 50,
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  sharedWith: string[];
}
