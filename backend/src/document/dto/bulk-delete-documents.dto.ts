/**
 * Bulk Delete Documents DTO
 * Data transfer object for deleting multiple documents at once
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class BulkDeleteDocumentsDto {
  @ApiProperty({
    description: 'Array of document IDs to delete (max 100)',
    type: [String],
    minItems: 1,
    maxItems: 100,
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsNotEmpty({ each: true })
  documentIds: string[];
}
