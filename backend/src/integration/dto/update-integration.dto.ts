import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateIntegrationDto } from './create-integration.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateIntegrationDto extends PartialType(CreateIntegrationDto) {
  @ApiPropertyOptional({ description: 'Whether the integration is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
