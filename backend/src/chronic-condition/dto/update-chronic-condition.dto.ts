import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateChronicConditionDto } from './create-chronic-condition.dto';

/**
 * DTO for updating an existing chronic condition record.
 *
 * Extends CreateChronicConditionDto with partial semantics, allowing selective
 * field updates. Includes isActive flag for deactivation control.
 */
export class UpdateChronicConditionDto extends PartialType(
  CreateChronicConditionDto,
) {
  @ApiPropertyOptional({
    description: 'Flag to activate/deactivate condition record',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
