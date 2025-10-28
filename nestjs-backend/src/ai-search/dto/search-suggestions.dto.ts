/**
 * @fileoverview Search Suggestions DTOs
 * @module ai-search/dto/search-suggestions.dto
 * @description DTOs for intelligent search suggestions and autocomplete
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class SearchSuggestionsDto {
  @ApiProperty({
    description: 'Partial search query for suggestions',
    example: 'asth',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  partial: string;

  @ApiProperty({
    description: 'User ID for personalized suggestions',
    example: 'uuid-123',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
