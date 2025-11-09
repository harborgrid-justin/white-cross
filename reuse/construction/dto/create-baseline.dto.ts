
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsDate,
  IsUUID,
  Min,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBaselineDto {
  @ApiProperty({ description: 'Project ID (UUID). Should match the URL parameter.' })
  @IsUUID()
  @IsOptional() // Will be populated from URL param in controller
  projectId: string;

  @ApiProperty({ enum: ['INITIAL', 'REVISED', 'RE_BASELINE'], example: 'INITIAL' })
  @IsEnum(['INITIAL', 'REVISED', 'RE_BASELINE'])
  baselineType: 'INITIAL' | 'REVISED' | 'RE_BASELINE';

  @ApiProperty({ description: 'Baseline budget amount', example: 5000000 })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({ description: 'Baseline schedule completion date', example: '2026-12-31' })
  @Type(() => Date)
  @IsDate()
  schedule: Date;

  @ApiProperty({ description: 'High-level scope description for this baseline', example: 'Complete renovation of west wing, 3rd floor, as per drawings A1-A5.'})
  @IsString()
  @MaxLength(2000)
  scope: string;
}
