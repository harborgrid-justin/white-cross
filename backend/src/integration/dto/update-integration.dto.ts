import { PartialType } from '@nestjs/swagger';
import { CreateIntegrationDto } from './create-integration.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateIntegrationDto extends PartialType(CreateIntegrationDto) {
  @ApiPropertyOptional({ description: 'Whether the integration is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
