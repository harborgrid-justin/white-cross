/**
 * @fileoverview Toggle Feature DTO
 * @module features/dto/toggle-feature.dto
 * @description DTO for toggling feature flags
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean } from 'class-validator';

export class ToggleFeatureDto {
  @ApiProperty({
    description: 'Enable or disable the feature',
    example: true,
  })
  @IsNotEmpty({ message: 'Enabled flag is required' })
  @IsBoolean({ message: 'Enabled must be a boolean' })
  enabled: boolean;
}
