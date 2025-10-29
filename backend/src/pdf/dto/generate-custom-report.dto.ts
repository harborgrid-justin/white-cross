import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomReportTableDto {
  @ApiPropertyOptional({ description: 'Table title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Table headers' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  headers: string[];

  @ApiProperty({ description: 'Table rows' })
  @IsArray()
  @IsNotEmpty()
  rows: any[][];
}

export class PdfGenerateCustomReportDto {
  @ApiProperty({ description: 'Report title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Report subtitle' })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Report metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Report tables',
    type: [CustomReportTableDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CustomReportTableDto)
  tables?: CustomReportTableDto[];
}
