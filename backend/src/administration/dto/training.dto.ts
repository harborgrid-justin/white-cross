import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsArray,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { TrainingCategory } from '../enums/administration.enums';

/**
 * DTO for creating a training module
 */
export class CreateTrainingModuleDto {
  @ApiProperty({
    description: 'Training module title',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Training module description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Training content (HTML, Markdown, etc.)' })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Duration in minutes',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiProperty({
    description: 'Training category',
    enum: TrainingCategory,
  })
  @IsEnum(TrainingCategory)
  category: TrainingCategory;

  @ApiPropertyOptional({
    description: 'Is this training required for all staff',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Display order in training list',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiPropertyOptional({
    description: 'URLs to attachment files',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}

/**
 * DTO for updating a training module
 */
export class UpdateTrainingModuleDto extends PartialType(
  CreateTrainingModuleDto,
) {}

/**
 * DTO for querying training modules
 */
export class TrainingQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by category',
    enum: TrainingCategory,
  })
  @IsOptional()
  @IsEnum(TrainingCategory)
  category?: TrainingCategory;

  @ApiPropertyOptional({ description: 'Filter by required status' })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 20,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}
