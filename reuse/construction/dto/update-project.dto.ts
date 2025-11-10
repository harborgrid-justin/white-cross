
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProjectProgressDto {
  @ApiProperty({ description: 'Progress percentage (0-100)', example: 45.5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  progressPercentage: number;

  @ApiProperty({ description: 'Actual cost incurred to date', example: 2250000 })
  @IsNumber()
  @Min(0)
  actualCost: number;

  @ApiProperty({ description: 'Notes on progress', required: false, example: 'Foundation work completed ahead of schedule.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
