import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WatermarkPdfDto {
  @ApiProperty({ description: 'Base64-encoded PDF buffer' })
  @IsString()
  @IsNotEmpty()
  pdfBuffer!: string;

  @ApiProperty({ description: 'Watermark text' })
  @IsString()
  @IsNotEmpty()
  watermarkText!: string;

  @ApiPropertyOptional({ description: 'X position', default: 'center' })
  @IsNumber()
  @IsOptional()
  x?: number;

  @ApiPropertyOptional({ description: 'Y position', default: 'center' })
  @IsNumber()
  @IsOptional()
  y?: number;

  @ApiPropertyOptional({ description: 'Font size', default: 50 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(200)
  size?: number;

  @ApiPropertyOptional({ description: 'Opacity (0-1)', default: 0.3 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  opacity?: number;

  @ApiPropertyOptional({ description: 'Rotation angle', default: 45 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(360)
  rotate?: number;
}
