import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for importing configurations from JSON
 */
export class ImportConfigurationsDto {
  @ApiProperty({ description: 'JSON string containing configuration array' })
  @IsString()
  configsJson: string;

  @ApiProperty({ description: 'User ID performing the import' })
  @IsString()
  changedBy: string;

  @ApiPropertyOptional({
    description: 'Whether to overwrite existing configurations',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  overwrite?: boolean;
}
