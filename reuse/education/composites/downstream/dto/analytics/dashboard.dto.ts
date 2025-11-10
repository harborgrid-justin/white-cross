/**
 * Dashboard DTOs for analytics domain
 * Manages dashboard configurations and visualizations
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsDate,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export enum VisualizationType {
  LINE_CHART = 'line_chart',
  BAR_CHART = 'bar_chart',
  PIE_CHART = 'pie_chart',
  SCATTER_PLOT = 'scatter_plot',
  HEATMAP = 'heatmap',
  TABLE = 'table',
  GAUGE = 'gauge',
  KPI_CARD = 'kpi_card',
}

export enum DashboardAccess {
  PRIVATE = 'private',
  DEPARTMENT = 'department',
  INSTITUTIONAL = 'institutional',
  PUBLIC = 'public',
}

/**
 * Dashboard widget DTO
 */
export class DashboardWidgetDto {
  @ApiProperty({
    description: 'Widget ID',
    example: 'WIDGET-001',
  })
  @IsString()
  @IsNotEmpty()
  widgetId: string;

  @ApiProperty({
    description: 'Widget title',
    example: 'Enrollment Trends',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Visualization type',
    enum: VisualizationType,
    example: VisualizationType.LINE_CHART,
  })
  @IsEnum(VisualizationType)
  visualizationType: VisualizationType;

  @ApiPropertyOptional({
    description: 'Data source query',
    example: 'SELECT semester, count(*) FROM enrollments GROUP BY semester',
  })
  @IsOptional()
  @IsString()
  dataSource?: string;

  @ApiProperty({
    description: 'Widget position row',
    example: 1,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  row: number;

  @ApiProperty({
    description: 'Widget position column',
    example: 1,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  column: number;

  @ApiProperty({
    description: 'Widget width (grid units)',
    example: 6,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  width: number;

  @ApiProperty({
    description: 'Widget height (grid units)',
    example: 4,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  height: number;

  @ApiPropertyOptional({
    description: 'Widget refresh interval (seconds)',
    example: 300,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  refreshInterval?: number;

  @ApiPropertyOptional({
    description: 'Custom widget styling',
    type: 'object',
  })
  @IsOptional()
  customStyling?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Widget is enabled',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional({
    description: 'Drill-down configuration',
    type: 'object',
  })
  @IsOptional()
  drillDownConfig?: Record<string, any>;
}

/**
 * Dashboard configuration DTO
 */
export class DashboardConfigDto {
  @ApiProperty({
    description: 'Dashboard ID',
    example: 'DASH-2025001',
  })
  @IsString()
  @IsNotEmpty()
  dashboardId: string;

  @ApiProperty({
    description: 'Dashboard name',
    example: 'Institutional Analytics Dashboard',
  })
  @IsString()
  @IsNotEmpty()
  dashboardName: string;

  @ApiPropertyOptional({
    description: 'Dashboard description',
    example: 'Executive-level analytics for institutional performance monitoring',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Dashboard owner/creator',
    example: 'analytics@institution.edu',
  })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({
    description: 'Access level',
    enum: DashboardAccess,
    example: DashboardAccess.INSTITUTIONAL,
  })
  @IsEnum(DashboardAccess)
  accessLevel: DashboardAccess;

  @ApiPropertyOptional({
    description: 'Allowed viewers/roles',
    type: [String],
    example: ['Director', 'Provost', 'Dean'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedRoles?: string[];

  @ApiProperty({
    description: 'Grid columns for layout',
    example: 12,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  gridColumns: number;

  @ApiProperty({
    description: 'Widgets in dashboard',
    type: [DashboardWidgetDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DashboardWidgetDto)
  widgets: DashboardWidgetDto[];

  @ApiPropertyOptional({
    description: 'Global filters for dashboard',
    type: 'object',
    example: { semester: 'Fall2025', department: 'All' },
  })
  @IsOptional()
  globalFilters?: Record<string, any>;

  @ApiProperty({
    description: 'Dashboard is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Dashboard creation date',
    example: '2025-01-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdDate?: Date;

  @ApiPropertyOptional({
    description: 'Last modified date',
    example: '2025-11-10',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastModifiedDate?: Date;

  @ApiPropertyOptional({
    description: 'Last modified by user',
    example: 'admin@institution.edu',
  })
  @IsOptional()
  @IsString()
  lastModifiedBy?: string;

  @ApiPropertyOptional({
    description: 'Theme/color scheme',
    enum: ['light', 'dark', 'custom'],
    example: 'light',
  })
  @IsOptional()
  @IsEnum(['light', 'dark', 'custom'])
  theme?: string;

  @ApiPropertyOptional({
    description: 'Enable auto-refresh',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enableAutoRefresh?: boolean;

  @ApiPropertyOptional({
    description: 'Auto-refresh interval (seconds)',
    example: 300,
  })
  @IsOptional()
  @IsNumber()
  @Min(30)
  autoRefreshInterval?: number;
}

/**
 * KPI (Key Performance Indicator) card DTO
 */
export class KpiCardDto {
  @ApiProperty({
    description: 'KPI card ID',
    example: 'KPI-001',
  })
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @ApiProperty({
    description: 'KPI metric name',
    example: 'Fall 2025 Enrollment',
  })
  @IsString()
  @IsNotEmpty()
  metricName: string;

  @ApiProperty({
    description: 'Current KPI value',
    example: 5234,
  })
  @IsNumber()
  currentValue: number;

  @ApiPropertyOptional({
    description: 'Previous period value for comparison',
    example: 5100,
  })
  @IsOptional()
  @IsNumber()
  previousValue?: number;

  @ApiPropertyOptional({
    description: 'Target value',
    example: 5500,
  })
  @IsOptional()
  @IsNumber()
  targetValue?: number;

  @ApiPropertyOptional({
    description: 'Unit of measurement',
    example: 'Students',
  })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({
    description: 'Percentage change from previous period',
    example: 2.6,
  })
  @IsOptional()
  @IsNumber()
  percentageChange?: number;

  @ApiPropertyOptional({
    description: 'Status indicator',
    enum: ['on_track', 'at_risk', 'off_track', 'excellent'],
    example: 'on_track',
  })
  @IsOptional()
  @IsEnum(['on_track', 'at_risk', 'off_track', 'excellent'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Icon or symbol',
    example: 'trending-up',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Custom color',
    example: '#4CAF50',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    description: 'Last updated timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastUpdated?: Date;
}

/**
 * Dashboard template DTO
 */
export class DashboardTemplateDto {
  @ApiProperty({
    description: 'Template ID',
    example: 'TEMPLATE-001',
  })
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({
    description: 'Template name',
    example: 'Enrollment Analytics Template',
  })
  @IsString()
  @IsNotEmpty()
  templateName: string;

  @ApiProperty({
    description: 'Template description',
    example: 'Pre-configured dashboard for enrollment analysis',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Category/classification',
    example: 'Enrollment',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Widget configurations in template',
    type: [DashboardWidgetDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DashboardWidgetDto)
  widgetConfigs: DashboardWidgetDto[];

  @ApiProperty({
    description: 'Template is available for use',
    example: true,
  })
  @IsBoolean()
  isAvailable: boolean;

  @ApiPropertyOptional({
    description: 'Number of dashboards using this template',
    example: 8,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  usageCount?: number;

  @ApiPropertyOptional({
    description: 'Created by user',
    example: 'admin@institution.edu',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Creation date',
    example: '2025-06-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdDate?: Date;
}

/**
 * Dashboard filter DTO
 */
export class DashboardFilterDto {
  @ApiProperty({
    description: 'Filter ID',
    example: 'FILTER-001',
  })
  @IsString()
  @IsNotEmpty()
  filterId: string;

  @ApiProperty({
    description: 'Filter name',
    example: 'Academic Year',
  })
  @IsString()
  @IsNotEmpty()
  filterName: string;

  @ApiProperty({
    description: 'Filter type',
    enum: ['dropdown', 'date_range', 'multi_select', 'text', 'numeric'],
    example: 'dropdown',
  })
  @IsEnum(['dropdown', 'date_range', 'multi_select', 'text', 'numeric'])
  filterType: string;

  @ApiProperty({
    description: 'Available filter options',
    type: [String],
    example: ['2024-2025', '2025-2026', '2026-2027'],
  })
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    description: 'Default selected value(s)',
    example: '2025-2026',
  })
  @IsNotEmpty()
  defaultValue: any;

  @ApiProperty({
    description: 'Filter is required',
    example: true,
  })
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty({
    description: 'Applies filter to these widgets',
    type: [String],
    example: ['WIDGET-001', 'WIDGET-002'],
  })
  @IsArray()
  @IsString({ each: true })
  appliesTo: string[];
}
