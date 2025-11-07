import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportDefinitionDto {
  @ApiProperty({ description: 'Report name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Data source identifier' })
  @IsString()
  dataSource: string;

  @ApiProperty({ description: 'Fields to include in report', type: [String] })
  @IsArray()
  @IsString({ each: true })
  fields: string[];

  @ApiProperty({ description: 'Filter criteria' })
  @IsArray()
  filters: any[];

  @ApiProperty({ description: 'Grouping fields', type: [String] })
  @IsArray()
  @IsString({ each: true })
  grouping: string[];

  @ApiProperty({ description: 'Sorting fields', type: [String] })
  @IsArray()
  @IsString({ each: true })
  sorting: string[];

  @ApiProperty({
    enum: ['table', 'chart', 'graph'],
    description: 'Visualization type',
  })
  @IsEnum(['table', 'chart', 'graph'])
  visualization: 'table' | 'chart' | 'graph';

  @ApiPropertyOptional({ description: 'Schedule configuration' })
  @IsOptional()
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
}

export class ExecuteReportDto {
  @ApiProperty({ description: 'Report ID' })
  @IsString()
  reportId: string;
}

export class ExportReportDto {
  @ApiProperty({ description: 'Report ID' })
  @IsString()
  reportId: string;

  @ApiProperty({ enum: ['pdf', 'excel', 'csv'], description: 'Export format' })
  @IsEnum(['pdf', 'excel', 'csv'])
  format: 'pdf' | 'excel' | 'csv';
}

export class ReportDefinitionResponseDto {
  id: string;
  name: string;
  dataSource: string;
  fields: string[];
  filters: any[];
  grouping: string[];
  sorting: string[];
  visualization: 'table' | 'chart' | 'graph';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
}
