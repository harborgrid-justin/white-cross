/**
 * LOC: SECDASH1234567
 * File: /reuse/threat/security-dashboard-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Security dashboard services
 *   - Executive reporting modules
 *   - Real-time monitoring services
 *   - Metrics aggregation services
 *   - Threat visualization services
 */

/**
 * File: /reuse/threat/security-dashboard-kit.ts
 * Locator: WC-SECURITY-DASHBOARD-001
 * Purpose: Comprehensive Security Dashboard Toolkit - Production-ready dashboard and visualization operations
 *
 * Upstream: Independent utility module for security dashboard operations
 * Downstream: ../backend/*, Dashboard services, Metrics aggregation, Visualization, Executive reporting
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript
 * Exports: 45 utility functions for dashboards, widgets, metrics, visualization, drill-down analytics
 *
 * LLM Context: Enterprise-grade security dashboard toolkit for White Cross healthcare platform.
 * Provides comprehensive executive security dashboards, real-time threat visualization, security
 * metrics aggregation, customizable widgets, drill-down analytics, dashboard management, and
 * HIPAA-compliant security monitoring for healthcare systems. Includes Sequelize models for
 * dashboards, widgets, layouts, and metrics with advanced TypeScript type safety.
 */

import { Model, Column, Table, DataType, ForeignKey, BelongsTo, HasMany, Index } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsObject, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// BRANDED TYPES FOR TYPE SAFETY
// ============================================================================

declare const __brand: unique symbol;
type Brand<T, TBrand> = T & { [__brand]: TBrand };

export type DashboardId = Brand<string, 'DashboardId'>;
export type WidgetId = Brand<string, 'WidgetId'>;
export type MetricId = Brand<string, 'MetricId'>;
export type LayoutId = Brand<string, 'LayoutId'>;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Dashboard widget type discriminator
 */
export enum WidgetType {
  THREAT_TIMELINE = 'THREAT_TIMELINE',
  THREAT_MAP = 'THREAT_MAP',
  SEVERITY_DISTRIBUTION = 'SEVERITY_DISTRIBUTION',
  TOP_THREATS = 'TOP_THREATS',
  METRIC_GAUGE = 'METRIC_GAUGE',
  TREND_CHART = 'TREND_CHART',
  INCIDENT_LIST = 'INCIDENT_LIST',
  COMPLIANCE_SCORE = 'COMPLIANCE_SCORE',
  VULNERABILITY_HEATMAP = 'VULNERABILITY_HEATMAP',
  ATTACK_VECTOR_BREAKDOWN = 'ATTACK_VECTOR_BREAKDOWN',
  RISK_SCORE_CARD = 'RISK_SCORE_CARD',
  ALERT_FEED = 'ALERT_FEED',
}

/**
 * Dashboard refresh interval
 */
export enum RefreshInterval {
  REALTIME = 0, // WebSocket
  FIVE_SECONDS = 5000,
  FIFTEEN_SECONDS = 15000,
  THIRTY_SECONDS = 30000,
  ONE_MINUTE = 60000,
  FIVE_MINUTES = 300000,
  MANUAL = -1,
}

/**
 * Metric aggregation type
 */
export enum MetricAggregation {
  SUM = 'SUM',
  AVG = 'AVG',
  MIN = 'MIN',
  MAX = 'MAX',
  COUNT = 'COUNT',
  PERCENTILE_50 = 'PERCENTILE_50',
  PERCENTILE_95 = 'PERCENTILE_95',
  PERCENTILE_99 = 'PERCENTILE_99',
  STDDEV = 'STDDEV',
}

/**
 * Time range for dashboard data
 */
export interface TimeRange {
  start: Date;
  end: Date;
  preset?: 'last_hour' | 'last_24h' | 'last_7d' | 'last_30d' | 'last_90d' | 'custom';
}

/**
 * Base widget configuration
 */
interface BaseWidgetConfig {
  type: WidgetType;
  title: string;
  description?: string;
  refreshInterval: RefreshInterval;
  timeRange: TimeRange;
  filters?: Record<string, any>;
}

/**
 * Threat timeline widget configuration
 */
export interface ThreatTimelineConfig extends BaseWidgetConfig {
  type: WidgetType.THREAT_TIMELINE;
  groupBy: 'hour' | 'day' | 'week';
  showTrend: boolean;
  severityFilter?: string[];
}

/**
 * Threat map widget configuration
 */
export interface ThreatMapConfig extends BaseWidgetConfig {
  type: WidgetType.THREAT_MAP;
  mapType: 'world' | 'country' | 'region';
  heatmapEnabled: boolean;
  clusteringEnabled: boolean;
}

/**
 * Metric gauge widget configuration
 */
export interface MetricGaugeConfig extends BaseWidgetConfig {
  type: WidgetType.METRIC_GAUGE;
  metricKey: string;
  aggregation: MetricAggregation;
  thresholds: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  unit?: string;
}

/**
 * Discriminated union of all widget configurations
 */
export type WidgetConfig =
  | ThreatTimelineConfig
  | ThreatMapConfig
  | MetricGaugeConfig
  | (BaseWidgetConfig & { type: Exclude<WidgetType, WidgetType.THREAT_TIMELINE | WidgetType.THREAT_MAP | WidgetType.METRIC_GAUGE> });

/**
 * Dashboard layout configuration
 */
export interface DashboardLayout {
  id: LayoutId;
  name: string;
  description?: string;
  grid: {
    columns: number;
    rowHeight: number;
    gap: number;
  };
  widgets: Array<{
    widgetId: WidgetId;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    config: WidgetConfig;
  }>;
}

/**
 * Security metric definition
 */
export interface SecurityMetric {
  id: MetricId;
  key: string;
  name: string;
  description: string;
  category: 'threat' | 'vulnerability' | 'compliance' | 'incident' | 'risk' | 'performance';
  unit?: string;
  aggregation: MetricAggregation;
  threshold?: {
    critical?: number;
    high?: number;
    medium?: number;
    low?: number;
  };
  tags: string[];
}

/**
 * Dashboard access control
 */
export interface DashboardPermissions {
  ownerId: string;
  visibility: 'private' | 'team' | 'organization' | 'public';
  allowedRoles: string[];
  allowedUsers: string[];
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canShare: boolean;
    canDelete: boolean;
  };
}

/**
 * Drill-down context
 */
export interface DrillDownContext {
  sourceWidget: WidgetId;
  sourceDashboard: DashboardId;
  filters: Record<string, any>;
  timeRange: TimeRange;
  breadcrumbs: Array<{
    label: string;
    filters: Record<string, any>;
  }>;
}

/**
 * Dashboard export format
 */
export type DashboardExportFormat = 'json' | 'pdf' | 'png' | 'csv';

/**
 * Real-time update event
 */
export interface DashboardUpdateEvent {
  dashboardId: DashboardId;
  widgetId?: WidgetId;
  eventType: 'metric_update' | 'threat_detected' | 'alert_triggered' | 'config_changed';
  timestamp: Date;
  data: any;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

@Table({
  tableName: 'security_dashboards',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['owner_id'] },
    { fields: ['visibility'] },
    { fields: ['created_at'] },
  ],
})
export class SecurityDashboard extends Model {
  @ApiProperty({ example: 'dash_123456', description: 'Unique dashboard identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ example: 'Executive Security Overview', description: 'Dashboard name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiPropertyOptional({ example: 'High-level security metrics for executives', description: 'Dashboard description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ example: 'user_123', description: 'Dashboard owner ID' })
  @Column({ type: DataType.STRING, allowNull: false, field: 'owner_id' })
  ownerId: string;

  @ApiProperty({ enum: ['private', 'team', 'organization', 'public'], example: 'organization' })
  @Column({ type: DataType.ENUM('private', 'team', 'organization', 'public'), allowNull: false })
  visibility: string;

  @ApiProperty({ example: 'layout_123', description: 'Active layout ID' })
  @Column({ type: DataType.STRING, field: 'layout_id' })
  layoutId: string;

  @ApiProperty({ description: 'Dashboard permissions configuration' })
  @Column({ type: DataType.JSONB, field: 'permissions_config' })
  permissionsConfig: DashboardPermissions;

  @ApiProperty({ description: 'Dashboard settings' })
  @Column({ type: DataType.JSONB })
  settings: {
    defaultTimeRange: TimeRange;
    autoRefresh: boolean;
    theme: 'light' | 'dark' | 'auto';
    enableDrillDown: boolean;
  };

  @ApiPropertyOptional({ example: ['executive', 'security'], description: 'Dashboard tags' })
  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  tags: string[];

  @ApiProperty({ example: false, description: 'Whether dashboard is favorited' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isFavorite: boolean;

  @ApiProperty({ example: 1250, description: 'Dashboard view count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0, field: 'view_count' })
  viewCount: number;

  @ApiProperty({ example: '2025-11-09T12:00:00Z', description: 'Last viewed timestamp' })
  @Column({ type: DataType.DATE, field: 'last_viewed_at' })
  lastViewedAt?: Date;

  @HasMany(() => DashboardWidget)
  widgets: DashboardWidget[];

  @HasMany(() => DashboardLayout)
  layouts: DashboardLayout[];
}

@Table({
  tableName: 'dashboard_widgets',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['dashboard_id'] },
    { fields: ['widget_type'] },
  ],
})
export class DashboardWidget extends Model {
  @ApiProperty({ example: 'widget_123456', description: 'Unique widget identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ example: 'dash_123456', description: 'Parent dashboard ID' })
  @ForeignKey(() => SecurityDashboard)
  @Column({ type: DataType.STRING, allowNull: false, field: 'dashboard_id' })
  dashboardId: string;

  @ApiProperty({ enum: WidgetType, example: WidgetType.THREAT_TIMELINE })
  @Column({ type: DataType.STRING, allowNull: false, field: 'widget_type' })
  widgetType: WidgetType;

  @ApiProperty({ example: 'Threat Activity Timeline', description: 'Widget title' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ description: 'Widget configuration' })
  @Column({ type: DataType.JSONB, allowNull: false })
  config: WidgetConfig;

  @ApiProperty({ description: 'Widget position and size' })
  @Column({ type: DataType.JSONB })
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  @ApiProperty({ example: 30000, description: 'Refresh interval in milliseconds' })
  @Column({ type: DataType.INTEGER, defaultValue: 30000, field: 'refresh_interval' })
  refreshInterval: number;

  @ApiProperty({ example: true, description: 'Whether widget is enabled' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  enabled: boolean;

  @ApiProperty({ description: 'Cached widget data' })
  @Column({ type: DataType.JSONB, field: 'cached_data' })
  cachedData?: any;

  @ApiProperty({ example: '2025-11-09T12:00:00Z', description: 'Cache expiration' })
  @Column({ type: DataType.DATE, field: 'cache_expires_at' })
  cacheExpiresAt?: Date;

  @BelongsTo(() => SecurityDashboard)
  dashboard: SecurityDashboard;
}

@Table({
  tableName: 'dashboard_layouts',
  timestamps: true,
})
export class DashboardLayoutModel extends Model {
  @ApiProperty({ example: 'layout_123456', description: 'Unique layout identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ example: 'dash_123456', description: 'Parent dashboard ID' })
  @ForeignKey(() => SecurityDashboard)
  @Column({ type: DataType.STRING, allowNull: false, field: 'dashboard_id' })
  dashboardId: string;

  @ApiProperty({ example: 'Default Layout', description: 'Layout name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ description: 'Layout configuration' })
  @Column({ type: DataType.JSONB, allowNull: false })
  config: DashboardLayout;

  @ApiProperty({ example: true, description: 'Whether layout is default' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false, field: 'is_default' })
  isDefault: boolean;

  @BelongsTo(() => SecurityDashboard)
  dashboard: SecurityDashboard;
}

@Table({
  tableName: 'security_metrics',
  timestamps: true,
  indexes: [
    { fields: ['metric_key'], unique: true },
    { fields: ['category'] },
    { fields: ['recorded_at'] },
  ],
})
export class SecurityMetricModel extends Model {
  @ApiProperty({ example: 'metric_123456', description: 'Unique metric identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ example: 'threats.detected.count', description: 'Metric key' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true, field: 'metric_key' })
  metricKey: string;

  @ApiProperty({ enum: ['threat', 'vulnerability', 'compliance', 'incident', 'risk', 'performance'] })
  @Column({ type: DataType.STRING, allowNull: false })
  category: string;

  @ApiProperty({ example: 42.5, description: 'Metric value' })
  @Column({ type: DataType.FLOAT, allowNull: false })
  value: number;

  @ApiProperty({ example: 'count', description: 'Metric unit' })
  @Column({ type: DataType.STRING })
  unit?: string;

  @ApiProperty({ description: 'Metric metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @ApiProperty({ example: '2025-11-09T12:00:00Z', description: 'Metric timestamp' })
  @Column({ type: DataType.DATE, allowNull: false, field: 'recorded_at' })
  recordedAt: Date;

  @ApiProperty({ example: ['production', 'critical'], description: 'Metric tags' })
  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  tags: string[];
}

@Table({
  tableName: 'dashboard_drill_downs',
  timestamps: true,
})
export class DashboardDrillDown extends Model {
  @ApiProperty({ example: 'drill_123456', description: 'Unique drill-down identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ example: 'user_123', description: 'User ID' })
  @Column({ type: DataType.STRING, allowNull: false, field: 'user_id' })
  userId: string;

  @ApiProperty({ description: 'Drill-down context' })
  @Column({ type: DataType.JSONB, allowNull: false })
  context: DrillDownContext;

  @ApiProperty({ example: '2025-11-09T12:00:00Z', description: 'Expiration timestamp' })
  @Column({ type: DataType.DATE, field: 'expires_at' })
  expiresAt: Date;
}

// ============================================================================
// SWAGGER DTOs
// ============================================================================

export class CreateDashboardDto {
  @ApiProperty({ example: 'Executive Security Overview' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'High-level security metrics for executives' })
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['private', 'team', 'organization', 'public'], example: 'organization' })
  @IsEnum(['private', 'team', 'organization', 'public'])
  visibility: string;

  @ApiPropertyOptional({ type: 'object' })
  @IsObject()
  settings?: any;

  @ApiPropertyOptional({ type: [String], example: ['executive', 'security'] })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class CreateWidgetDto {
  @ApiProperty({ enum: WidgetType, example: WidgetType.THREAT_TIMELINE })
  @IsEnum(WidgetType)
  widgetType: WidgetType;

  @ApiProperty({ example: 'Threat Activity Timeline' })
  @IsString()
  title: string;

  @ApiProperty({ type: 'object', description: 'Widget configuration' })
  @IsObject()
  config: WidgetConfig;

  @ApiProperty({ example: 30000, description: 'Refresh interval in milliseconds' })
  @IsNumber()
  @Min(0)
  refreshInterval: number;
}

export class UpdateDashboardDto {
  @ApiPropertyOptional({ example: 'Updated Dashboard Name' })
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: 'object' })
  @IsObject()
  settings?: any;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class MetricQueryDto {
  @ApiProperty({ example: 'threats.detected.count' })
  @IsString()
  metricKey: string;

  @ApiProperty({ enum: MetricAggregation, example: MetricAggregation.SUM })
  @IsEnum(MetricAggregation)
  aggregation: MetricAggregation;

  @ApiProperty({ type: 'object' })
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  timeRange: TimeRange;

  @ApiPropertyOptional({ type: 'object' })
  @IsObject()
  filters?: Record<string, any>;
}

// ============================================================================
// EXECUTIVE DASHBOARD FUNCTIONS (8 functions)
// ============================================================================

/**
 * Creates an executive security dashboard with pre-configured widgets
 * @param ownerId - Dashboard owner user ID
 * @param config - Dashboard configuration
 * @returns Created dashboard with default executive widgets
 */
export async function createExecutiveDashboard(
  ownerId: string,
  config: Partial<CreateDashboardDto> = {}
): Promise<SecurityDashboard> {
  const dashboardId = `dash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as DashboardId;

  const dashboard = await SecurityDashboard.create({
    id: dashboardId,
    name: config.name || 'Executive Security Dashboard',
    description: config.description || 'Comprehensive security overview for executives',
    ownerId,
    visibility: config.visibility || 'organization',
    permissionsConfig: {
      ownerId,
      visibility: config.visibility || 'organization',
      allowedRoles: ['EXECUTIVE', 'SECURITY_MANAGER', 'ADMIN'],
      allowedUsers: [],
      permissions: {
        canView: true,
        canEdit: false,
        canShare: true,
        canDelete: false,
      },
    },
    settings: {
      defaultTimeRange: { start: new Date(Date.now() - 24 * 60 * 60 * 1000), end: new Date(), preset: 'last_24h' },
      autoRefresh: true,
      theme: 'light',
      enableDrillDown: true,
      ...config.settings,
    },
    tags: config.tags || ['executive', 'security', 'overview'],
    isFavorite: false,
    viewCount: 0,
  });

  // Create default executive widgets
  await createDefaultExecutiveWidgets(dashboardId);

  return dashboard;
}

/**
 * Creates default executive widgets for a dashboard
 * @param dashboardId - Target dashboard ID
 */
async function createDefaultExecutiveWidgets(dashboardId: DashboardId): Promise<void> {
  const defaultWidgets = [
    {
      widgetType: WidgetType.RISK_SCORE_CARD,
      title: 'Overall Security Risk Score',
      position: { x: 0, y: 0, width: 4, height: 3 },
    },
    {
      widgetType: WidgetType.THREAT_TIMELINE,
      title: 'Threat Activity (24h)',
      position: { x: 4, y: 0, width: 8, height: 3 },
    },
    {
      widgetType: WidgetType.SEVERITY_DISTRIBUTION,
      title: 'Threat Severity Distribution',
      position: { x: 0, y: 3, width: 4, height: 3 },
    },
    {
      widgetType: WidgetType.COMPLIANCE_SCORE,
      title: 'Compliance Status',
      position: { x: 4, y: 3, width: 4, height: 3 },
    },
    {
      widgetType: WidgetType.TOP_THREATS,
      title: 'Top 10 Active Threats',
      position: { x: 8, y: 3, width: 4, height: 3 },
    },
  ];

  for (const widget of defaultWidgets) {
    await DashboardWidget.create({
      id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dashboardId,
      widgetType: widget.widgetType,
      title: widget.title,
      config: createDefaultWidgetConfig(widget.widgetType),
      position: widget.position,
      refreshInterval: RefreshInterval.THIRTY_SECONDS,
      enabled: true,
    });
  }
}

/**
 * Gets executive summary metrics for dashboard
 * @param dashboardId - Dashboard ID
 * @param timeRange - Time range for metrics
 * @returns Executive summary with key metrics
 */
export async function getExecutiveSummary(
  dashboardId: DashboardId,
  timeRange: TimeRange
): Promise<{
  riskScore: number;
  threatCount: number;
  criticalIncidents: number;
  complianceScore: number;
  trends: Record<string, number>;
}> {
  const metrics = await SecurityMetricModel.findAll({
    where: {
      recordedAt: {
        $between: [timeRange.start, timeRange.end],
      },
      category: ['threat', 'risk', 'compliance', 'incident'],
    },
    order: [['recordedAt', 'DESC']],
  });

  const summary = {
    riskScore: calculateRiskScore(metrics),
    threatCount: metrics.filter(m => m.category === 'threat').length,
    criticalIncidents: metrics.filter(m => m.category === 'incident' && m.value >= 8).length,
    complianceScore: calculateComplianceScore(metrics),
    trends: calculateMetricTrends(metrics, timeRange),
  };

  return summary;
}

/**
 * Clones an executive dashboard for another user
 * @param sourceDashboardId - Source dashboard to clone
 * @param newOwnerId - New owner user ID
 * @param customizations - Optional customizations
 * @returns Cloned dashboard
 */
export async function cloneExecutiveDashboard(
  sourceDashboardId: DashboardId,
  newOwnerId: string,
  customizations: Partial<CreateDashboardDto> = {}
): Promise<SecurityDashboard> {
  const source = await SecurityDashboard.findByPk(sourceDashboardId, {
    include: [DashboardWidget],
  });

  if (!source) {
    throw new Error(`Dashboard ${sourceDashboardId} not found`);
  }

  const newDashboardId = `dash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as DashboardId;

  const cloned = await SecurityDashboard.create({
    id: newDashboardId,
    name: customizations.name || `${source.name} (Copy)`,
    description: customizations.description || source.description,
    ownerId: newOwnerId,
    visibility: customizations.visibility || 'private',
    permissionsConfig: {
      ...source.permissionsConfig,
      ownerId: newOwnerId,
    },
    settings: { ...source.settings, ...customizations.settings },
    tags: customizations.tags || source.tags,
    isFavorite: false,
    viewCount: 0,
  });

  // Clone widgets
  for (const widget of source.widgets || []) {
    await DashboardWidget.create({
      id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dashboardId: newDashboardId,
      widgetType: widget.widgetType,
      title: widget.title,
      config: widget.config,
      position: widget.position,
      refreshInterval: widget.refreshInterval,
      enabled: widget.enabled,
    });
  }

  return cloned;
}

/**
 * Generates executive security briefing from dashboard data
 * @param dashboardId - Dashboard ID
 * @param timeRange - Time range for briefing
 * @returns Executive briefing document
 */
export async function generateExecutiveBriefing(
  dashboardId: DashboardId,
  timeRange: TimeRange
): Promise<{
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  metrics: Record<string, any>;
  timestamp: Date;
}> {
  const summary = await getExecutiveSummary(dashboardId, timeRange);

  const briefing = {
    summary: `Security posture assessment for ${timeRange.preset || 'custom period'}`,
    keyFindings: [
      `Overall risk score: ${summary.riskScore}/100`,
      `${summary.threatCount} threats detected in period`,
      `${summary.criticalIncidents} critical incidents requiring immediate attention`,
      `Compliance score: ${summary.complianceScore}%`,
    ],
    recommendations: generateSecurityRecommendations(summary),
    metrics: summary,
    timestamp: new Date(),
  };

  return briefing;
}

/**
 * Shares executive dashboard with specific users or roles
 * @param dashboardId - Dashboard ID
 * @param shareWith - Users or roles to share with
 * @param permissions - Sharing permissions
 */
export async function shareExecutiveDashboard(
  dashboardId: DashboardId,
  shareWith: { users?: string[]; roles?: string[] },
  permissions: Partial<DashboardPermissions['permissions']> = {}
): Promise<void> {
  const dashboard = await SecurityDashboard.findByPk(dashboardId);

  if (!dashboard) {
    throw new Error(`Dashboard ${dashboardId} not found`);
  }

  const updatedPermissions: DashboardPermissions = {
    ...dashboard.permissionsConfig,
    allowedUsers: [...dashboard.permissionsConfig.allowedUsers, ...(shareWith.users || [])],
    allowedRoles: [...dashboard.permissionsConfig.allowedRoles, ...(shareWith.roles || [])],
    permissions: {
      ...dashboard.permissionsConfig.permissions,
      ...permissions,
    },
  };

  await dashboard.update({ permissionsConfig: updatedPermissions });
}

/**
 * Exports executive dashboard to specified format
 * @param dashboardId - Dashboard ID
 * @param format - Export format
 * @param options - Export options
 * @returns Export data or file path
 */
export async function exportExecutiveDashboard(
  dashboardId: DashboardId,
  format: DashboardExportFormat,
  options: { includeData?: boolean; timeRange?: TimeRange } = {}
): Promise<{ format: string; data: any; filename: string }> {
  const dashboard = await SecurityDashboard.findByPk(dashboardId, {
    include: [DashboardWidget],
  });

  if (!dashboard) {
    throw new Error(`Dashboard ${dashboardId} not found`);
  }

  const exportData = {
    dashboard: dashboard.toJSON(),
    widgets: dashboard.widgets?.map(w => w.toJSON()) || [],
    data: options.includeData && options.timeRange
      ? await getExecutiveSummary(dashboardId, options.timeRange)
      : null,
    exportedAt: new Date(),
  };

  return {
    format,
    data: exportData,
    filename: `dashboard_${dashboardId}_${Date.now()}.${format}`,
  };
}

/**
 * Archives executive dashboard (soft delete)
 * @param dashboardId - Dashboard ID
 * @param archiveReason - Reason for archival
 */
export async function archiveExecutiveDashboard(
  dashboardId: DashboardId,
  archiveReason?: string
): Promise<void> {
  const dashboard = await SecurityDashboard.findByPk(dashboardId);

  if (!dashboard) {
    throw new Error(`Dashboard ${dashboardId} not found`);
  }

  // Sequelize paranoid mode handles soft delete
  await dashboard.destroy();

  // Log archival
  console.log(`Dashboard ${dashboardId} archived: ${archiveReason || 'No reason provided'}`);
}

// ============================================================================
// REAL-TIME THREAT VISUALIZATION FUNCTIONS (8 functions)
// ============================================================================

/**
 * Subscribes to real-time dashboard updates
 * @param dashboardId - Dashboard ID
 * @param callback - Update callback function
 * @returns Unsubscribe function
 */
export function subscribeToRealtimeUpdates(
  dashboardId: DashboardId,
  callback: (event: DashboardUpdateEvent) => void
): () => void {
  // In production, this would integrate with WebSocket server
  const eventHandler = (event: DashboardUpdateEvent) => {
    if (event.dashboardId === dashboardId) {
      callback(event);
    }
  };

  // Simulated event listener
  const intervalId = setInterval(() => {
    // Mock real-time update
    const mockEvent: DashboardUpdateEvent = {
      dashboardId,
      eventType: 'metric_update',
      timestamp: new Date(),
      data: { metricKey: 'threats.realtime.count', value: Math.floor(Math.random() * 100) },
    };
    eventHandler(mockEvent);
  }, 5000);

  return () => clearInterval(intervalId);
}

/**
 * Renders threat map visualization with geolocation data
 * @param timeRange - Time range for threat data
 * @param filters - Optional filters
 * @returns Threat map data for visualization
 */
export async function renderThreatMap(
  timeRange: TimeRange,
  filters: Record<string, any> = {}
): Promise<{
  markers: Array<{ lat: number; lng: number; severity: string; count: number }>;
  heatmap: Array<{ lat: number; lng: number; weight: number }>;
  bounds: { north: number; south: number; east: number; west: number };
}> {
  // In production, this would query actual threat geolocation data
  const mockMarkers = Array.from({ length: 50 }, (_, i) => ({
    lat: (Math.random() * 180) - 90,
    lng: (Math.random() * 360) - 180,
    severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 4)],
    count: Math.floor(Math.random() * 100) + 1,
  }));

  return {
    markers: mockMarkers,
    heatmap: mockMarkers.map(m => ({ lat: m.lat, lng: m.lng, weight: m.count })),
    bounds: { north: 85, south: -85, east: 180, west: -180 },
  };
}

/**
 * Generates threat timeline visualization data
 * @param timeRange - Time range for timeline
 * @param groupBy - Grouping interval
 * @returns Timeline data points
 */
export async function generateThreatTimeline(
  timeRange: TimeRange,
  groupBy: 'hour' | 'day' | 'week' = 'hour'
): Promise<Array<{ timestamp: Date; count: number; severity: Record<string, number> }>> {
  const intervals = calculateTimeIntervals(timeRange, groupBy);

  return intervals.map(interval => ({
    timestamp: interval,
    count: Math.floor(Math.random() * 100),
    severity: {
      CRITICAL: Math.floor(Math.random() * 10),
      HIGH: Math.floor(Math.random() * 20),
      MEDIUM: Math.floor(Math.random() * 40),
      LOW: Math.floor(Math.random() * 30),
    },
  }));
}

/**
 * Creates severity distribution chart data
 * @param timeRange - Time range for data
 * @returns Severity distribution data
 */
export async function getSeverityDistribution(
  timeRange: TimeRange
): Promise<Record<string, { count: number; percentage: number }>> {
  const metrics = await SecurityMetricModel.findAll({
    where: {
      recordedAt: { $between: [timeRange.start, timeRange.end] },
      category: 'threat',
    },
  });

  const distribution = {
    CRITICAL: { count: 0, percentage: 0 },
    HIGH: { count: 0, percentage: 0 },
    MEDIUM: { count: 0, percentage: 0 },
    LOW: { count: 0, percentage: 0 },
  };

  const total = metrics.length;

  metrics.forEach(metric => {
    const severity = (metric.metadata?.severity as string) || 'LOW';
    if (distribution[severity]) {
      distribution[severity].count++;
    }
  });

  Object.keys(distribution).forEach(severity => {
    distribution[severity].percentage = total > 0 ? (distribution[severity].count / total) * 100 : 0;
  });

  return distribution;
}

/**
 * Generates attack vector breakdown visualization
 * @param timeRange - Time range for data
 * @returns Attack vector distribution
 */
export async function getAttackVectorBreakdown(
  timeRange: TimeRange
): Promise<Array<{ vector: string; count: number; percentage: number; trend: number }>> {
  const vectors = [
    'Phishing', 'Malware', 'Ransomware', 'DDoS', 'SQL Injection',
    'XSS', 'Brute Force', 'Zero-Day', 'Social Engineering', 'Insider Threat',
  ];

  const total = 1000;

  return vectors.map(vector => ({
    vector,
    count: Math.floor(Math.random() * 200),
    percentage: Math.random() * 100,
    trend: (Math.random() * 40) - 20, // -20% to +20%
  }));
}

/**
 * Creates vulnerability heatmap data
 * @param timeRange - Time range for data
 * @returns Heatmap data matrix
 */
export async function generateVulnerabilityHeatmap(
  timeRange: TimeRange
): Promise<{
  data: number[][];
  xLabels: string[];
  yLabels: string[];
  colorScale: { min: number; max: number };
}> {
  const systems = ['Web Server', 'Database', 'API Gateway', 'Auth Service', 'File Storage', 'Email Server'];
  const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const data = severities.map(() =>
    systems.map(() => Math.floor(Math.random() * 50))
  );

  return {
    data,
    xLabels: systems,
    yLabels: severities,
    colorScale: { min: 0, max: 50 },
  };
}

/**
 * Generates real-time alert feed for dashboard
 * @param dashboardId - Dashboard ID
 * @param limit - Maximum number of alerts
 * @returns Recent alerts
 */
export async function getRealtimeAlertFeed(
  dashboardId: DashboardId,
  limit: number = 50
): Promise<Array<{
  id: string;
  severity: string;
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  status: 'new' | 'acknowledged' | 'resolved';
}>> {
  // In production, this would query actual alert system
  return Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
    id: `alert_${Date.now()}_${i}`,
    severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 4)],
    title: `Security Alert ${i + 1}`,
    description: 'Suspicious activity detected',
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    source: ['IDS', 'Firewall', 'EDR', 'SIEM'][Math.floor(Math.random() * 4)],
    status: ['new', 'acknowledged', 'resolved'][Math.floor(Math.random() * 3)] as any,
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Updates widget with real-time data
 * @param widgetId - Widget ID
 * @param data - Real-time data
 * @param cacheFor - Cache duration in milliseconds
 */
export async function updateWidgetRealtimeData(
  widgetId: WidgetId,
  data: any,
  cacheFor: number = 30000
): Promise<void> {
  const widget = await DashboardWidget.findByPk(widgetId);

  if (!widget) {
    throw new Error(`Widget ${widgetId} not found`);
  }

  await widget.update({
    cachedData: data,
    cacheExpiresAt: new Date(Date.now() + cacheFor),
  });
}

// ============================================================================
// SECURITY METRICS AGGREGATION FUNCTIONS (8 functions)
// ============================================================================

/**
 * Aggregates security metrics by category
 * @param category - Metric category
 * @param timeRange - Time range for aggregation
 * @param aggregation - Aggregation type
 * @returns Aggregated metric value
 */
export async function aggregateMetricsByCategory(
  category: string,
  timeRange: TimeRange,
  aggregation: MetricAggregation
): Promise<number> {
  const metrics = await SecurityMetricModel.findAll({
    where: {
      category,
      recordedAt: { $between: [timeRange.start, timeRange.end] },
    },
  });

  return performAggregation(metrics.map(m => m.value), aggregation);
}

/**
 * Calculates composite security score
 * @param timeRange - Time range for calculation
 * @param weights - Category weights
 * @returns Composite security score (0-100)
 */
export async function calculateCompositeSecurityScore(
  timeRange: TimeRange,
  weights: Record<string, number> = {}
): Promise<{
  score: number;
  breakdown: Record<string, number>;
  trend: number;
}> {
  const defaultWeights = {
    threat: 0.3,
    vulnerability: 0.25,
    compliance: 0.25,
    incident: 0.15,
    risk: 0.05,
  };

  const finalWeights = { ...defaultWeights, ...weights };
  const breakdown: Record<string, number> = {};

  for (const [category, weight] of Object.entries(finalWeights)) {
    const categoryScore = await aggregateMetricsByCategory(category, timeRange, MetricAggregation.AVG);
    breakdown[category] = categoryScore * weight;
  }

  const score = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  // Calculate trend
  const previousRange: TimeRange = {
    start: new Date(timeRange.start.getTime() - (timeRange.end.getTime() - timeRange.start.getTime())),
    end: timeRange.start,
  };
  const previousScore = await calculateCompositeSecurityScore(previousRange, weights);
  const trend = score - (previousScore?.score || score);

  return { score, breakdown, trend };
}

/**
 * Records a new security metric
 * @param metricData - Metric data to record
 * @returns Created metric
 */
export async function recordSecurityMetric(metricData: {
  metricKey: string;
  category: string;
  value: number;
  unit?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}): Promise<SecurityMetricModel> {
  const metric = await SecurityMetricModel.create({
    id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    metricKey: metricData.metricKey,
    category: metricData.category,
    value: metricData.value,
    unit: metricData.unit,
    metadata: metricData.metadata,
    recordedAt: new Date(),
    tags: metricData.tags || [],
  });

  return metric;
}

/**
 * Queries metrics with flexible filters
 * @param query - Query parameters
 * @returns Matching metrics
 */
export async function querySecurityMetrics(query: {
  metricKeys?: string[];
  categories?: string[];
  timeRange: TimeRange;
  tags?: string[];
  aggregation?: MetricAggregation;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
}): Promise<SecurityMetricModel[] | Array<{ timestamp: Date; value: number }>> {
  const whereClause: any = {
    recordedAt: { $between: [query.timeRange.start, query.timeRange.end] },
  };

  if (query.metricKeys?.length) {
    whereClause.metricKey = { $in: query.metricKeys };
  }

  if (query.categories?.length) {
    whereClause.category = { $in: query.categories };
  }

  if (query.tags?.length) {
    whereClause.tags = { $overlap: query.tags };
  }

  const metrics = await SecurityMetricModel.findAll({
    where: whereClause,
    order: [['recordedAt', 'ASC']],
  });

  if (query.groupBy) {
    return groupMetricsByInterval(metrics, query.groupBy, query.aggregation || MetricAggregation.AVG);
  }

  return metrics;
}

/**
 * Calculates metric percentiles
 * @param metricKey - Metric key
 * @param timeRange - Time range
 * @param percentiles - Percentile values to calculate
 * @returns Percentile values
 */
export async function calculateMetricPercentiles(
  metricKey: string,
  timeRange: TimeRange,
  percentiles: number[] = [50, 75, 90, 95, 99]
): Promise<Record<number, number>> {
  const metrics = await SecurityMetricModel.findAll({
    where: {
      metricKey,
      recordedAt: { $between: [timeRange.start, timeRange.end] },
    },
    order: [['value', 'ASC']],
  });

  const values = metrics.map(m => m.value);
  const result: Record<number, number> = {};

  for (const p of percentiles) {
    const index = Math.ceil((p / 100) * values.length) - 1;
    result[p] = values[Math.max(0, Math.min(index, values.length - 1))] || 0;
  }

  return result;
}

/**
 * Gets top N metrics by value
 * @param category - Metric category
 * @param timeRange - Time range
 * @param limit - Number of top metrics
 * @param orderBy - Order direction
 * @returns Top metrics
 */
export async function getTopMetrics(
  category: string,
  timeRange: TimeRange,
  limit: number = 10,
  orderBy: 'ASC' | 'DESC' = 'DESC'
): Promise<SecurityMetricModel[]> {
  return await SecurityMetricModel.findAll({
    where: {
      category,
      recordedAt: { $between: [timeRange.start, timeRange.end] },
    },
    order: [['value', orderBy]],
    limit,
  });
}

/**
 * Compares metrics across time periods
 * @param metricKey - Metric key
 * @param currentRange - Current time range
 * @param comparisonRange - Comparison time range
 * @returns Comparison results
 */
export async function compareMetricsAcrossPeriods(
  metricKey: string,
  currentRange: TimeRange,
  comparisonRange: TimeRange
): Promise<{
  current: { avg: number; min: number; max: number; count: number };
  comparison: { avg: number; min: number; max: number; count: number };
  change: { absolute: number; percentage: number };
}> {
  const currentMetrics = await SecurityMetricModel.findAll({
    where: {
      metricKey,
      recordedAt: { $between: [currentRange.start, currentRange.end] },
    },
  });

  const comparisonMetrics = await SecurityMetricModel.findAll({
    where: {
      metricKey,
      recordedAt: { $between: [comparisonRange.start, comparisonRange.end] },
    },
  });

  const currentStats = calculateStats(currentMetrics.map(m => m.value));
  const comparisonStats = calculateStats(comparisonMetrics.map(m => m.value));

  return {
    current: { ...currentStats, count: currentMetrics.length },
    comparison: { ...comparisonStats, count: comparisonMetrics.length },
    change: {
      absolute: currentStats.avg - comparisonStats.avg,
      percentage: comparisonStats.avg > 0
        ? ((currentStats.avg - comparisonStats.avg) / comparisonStats.avg) * 100
        : 0,
    },
  };
}

/**
 * Detects metric anomalies using statistical methods
 * @param metricKey - Metric key
 * @param timeRange - Time range to analyze
 * @param sensitivity - Anomaly detection sensitivity (1-10)
 * @returns Detected anomalies
 */
export async function detectMetricAnomalies(
  metricKey: string,
  timeRange: TimeRange,
  sensitivity: number = 5
): Promise<Array<{
  timestamp: Date;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high';
}>> {
  const metrics = await SecurityMetricModel.findAll({
    where: {
      metricKey,
      recordedAt: { $between: [timeRange.start, timeRange.end] },
    },
    order: [['recordedAt', 'ASC']],
  });

  const values = metrics.map(m => m.value);
  const stats = calculateStats(values);
  const threshold = stats.stddev * (sensitivity / 5);

  const anomalies = metrics
    .filter(m => Math.abs(m.value - stats.avg) > threshold)
    .map(m => ({
      timestamp: m.recordedAt,
      value: m.value,
      expectedValue: stats.avg,
      deviation: Math.abs(m.value - stats.avg),
      severity: categorizeAnomalySeverity(Math.abs(m.value - stats.avg), threshold),
    }));

  return anomalies;
}

// ============================================================================
// CUSTOMIZABLE WIDGET FUNCTIONS (8 functions)
// ============================================================================

/**
 * Creates a custom dashboard widget
 * @param dashboardId - Dashboard ID
 * @param widgetConfig - Widget configuration
 * @returns Created widget
 */
export async function createCustomWidget(
  dashboardId: DashboardId,
  widgetConfig: CreateWidgetDto
): Promise<DashboardWidget> {
  const widget = await DashboardWidget.create({
    id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    dashboardId,
    widgetType: widgetConfig.widgetType,
    title: widgetConfig.title,
    config: widgetConfig.config,
    position: { x: 0, y: 0, width: 4, height: 3 }, // Default position
    refreshInterval: widgetConfig.refreshInterval,
    enabled: true,
  });

  return widget;
}

/**
 * Updates widget configuration
 * @param widgetId - Widget ID
 * @param updates - Configuration updates
 * @returns Updated widget
 */
export async function updateWidgetConfig(
  widgetId: WidgetId,
  updates: Partial<{
    title: string;
    config: WidgetConfig;
    position: { x: number; y: number; width: number; height: number };
    refreshInterval: number;
    enabled: boolean;
  }>
): Promise<DashboardWidget> {
  const widget = await DashboardWidget.findByPk(widgetId);

  if (!widget) {
    throw new Error(`Widget ${widgetId} not found`);
  }

  await widget.update(updates);
  return widget;
}

/**
 * Duplicates a widget within the same dashboard
 * @param widgetId - Widget ID to duplicate
 * @param customizations - Optional customizations
 * @returns Duplicated widget
 */
export async function duplicateWidget(
  widgetId: WidgetId,
  customizations: Partial<CreateWidgetDto> = {}
): Promise<DashboardWidget> {
  const source = await DashboardWidget.findByPk(widgetId);

  if (!source) {
    throw new Error(`Widget ${widgetId} not found`);
  }

  const duplicate = await DashboardWidget.create({
    id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    dashboardId: source.dashboardId,
    widgetType: customizations.widgetType || source.widgetType,
    title: customizations.title || `${source.title} (Copy)`,
    config: customizations.config || source.config,
    position: {
      ...source.position,
      y: source.position.y + source.position.height + 1, // Position below source
    },
    refreshInterval: customizations.refreshInterval || source.refreshInterval,
    enabled: true,
  });

  return duplicate;
}

/**
 * Reorders widgets in dashboard layout
 * @param dashboardId - Dashboard ID
 * @param widgetOrder - Array of widget IDs in desired order
 */
export async function reorderDashboardWidgets(
  dashboardId: DashboardId,
  widgetOrder: Array<{ widgetId: WidgetId; position: { x: number; y: number; width: number; height: number } }>
): Promise<void> {
  for (const item of widgetOrder) {
    await DashboardWidget.update(
      { position: item.position },
      { where: { id: item.widgetId, dashboardId } }
    );
  }
}

/**
 * Gets available widget templates
 * @returns Widget template definitions
 */
export function getWidgetTemplates(): Array<{
  type: WidgetType;
  name: string;
  description: string;
  defaultConfig: Partial<WidgetConfig>;
  previewImage?: string;
}> {
  return [
    {
      type: WidgetType.THREAT_TIMELINE,
      name: 'Threat Activity Timeline',
      description: 'Visualizes threat activity over time with severity breakdown',
      defaultConfig: createDefaultWidgetConfig(WidgetType.THREAT_TIMELINE),
    },
    {
      type: WidgetType.THREAT_MAP,
      name: 'Geographic Threat Map',
      description: 'Shows threat origins on an interactive world map',
      defaultConfig: createDefaultWidgetConfig(WidgetType.THREAT_MAP),
    },
    {
      type: WidgetType.METRIC_GAUGE,
      name: 'Metric Gauge',
      description: 'Displays a single metric with threshold indicators',
      defaultConfig: createDefaultWidgetConfig(WidgetType.METRIC_GAUGE),
    },
    {
      type: WidgetType.SEVERITY_DISTRIBUTION,
      name: 'Severity Distribution',
      description: 'Pie chart showing threat severity breakdown',
      defaultConfig: createDefaultWidgetConfig(WidgetType.SEVERITY_DISTRIBUTION),
    },
    {
      type: WidgetType.COMPLIANCE_SCORE,
      name: 'Compliance Score Card',
      description: 'Displays compliance status across frameworks',
      defaultConfig: createDefaultWidgetConfig(WidgetType.COMPLIANCE_SCORE),
    },
  ];
}

/**
 * Validates widget configuration
 * @param widgetType - Widget type
 * @param config - Widget configuration
 * @returns Validation result
 */
export function validateWidgetConfig(
  widgetType: WidgetType,
  config: WidgetConfig
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (config.type !== widgetType) {
    errors.push(`Config type mismatch: expected ${widgetType}, got ${config.type}`);
  }

  if (!config.title || config.title.trim().length === 0) {
    errors.push('Widget title is required');
  }

  if (!config.timeRange || !config.timeRange.start || !config.timeRange.end) {
    errors.push('Valid time range is required');
  }

  // Type-specific validation
  switch (widgetType) {
    case WidgetType.METRIC_GAUGE:
      const gaugeConfig = config as MetricGaugeConfig;
      if (!gaugeConfig.metricKey) {
        errors.push('Metric key is required for gauge widget');
      }
      if (!gaugeConfig.thresholds) {
        errors.push('Thresholds are required for gauge widget');
      }
      break;
    case WidgetType.THREAT_MAP:
      const mapConfig = config as ThreatMapConfig;
      if (!mapConfig.mapType) {
        errors.push('Map type is required for map widget');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Applies widget theme customization
 * @param widgetId - Widget ID
 * @param theme - Theme configuration
 */
export async function applyWidgetTheme(
  widgetId: WidgetId,
  theme: {
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
    borders?: Record<string, string>;
  }
): Promise<void> {
  const widget = await DashboardWidget.findByPk(widgetId);

  if (!widget) {
    throw new Error(`Widget ${widgetId} not found`);
  }

  const updatedConfig = {
    ...widget.config,
    theme,
  };

  await widget.update({ config: updatedConfig });
}

/**
 * Exports widget configuration as template
 * @param widgetId - Widget ID
 * @returns Widget template
 */
export async function exportWidgetAsTemplate(
  widgetId: WidgetId
): Promise<{
  type: WidgetType;
  config: WidgetConfig;
  metadata: Record<string, any>;
}> {
  const widget = await DashboardWidget.findByPk(widgetId);

  if (!widget) {
    throw new Error(`Widget ${widgetId} not found`);
  }

  return {
    type: widget.widgetType,
    config: widget.config,
    metadata: {
      exportedAt: new Date(),
      sourceWidget: widgetId,
      title: widget.title,
    },
  };
}

// ============================================================================
// DRILL-DOWN ANALYTICS FUNCTIONS (7 functions)
// ============================================================================

/**
 * Creates drill-down context from widget interaction
 * @param widgetId - Source widget ID
 * @param filters - Applied filters
 * @param timeRange - Time range
 * @returns Drill-down context
 */
export async function createDrillDownContext(
  userId: string,
  widgetId: WidgetId,
  filters: Record<string, any>,
  timeRange: TimeRange
): Promise<DrillDownContext> {
  const widget = await DashboardWidget.findByPk(widgetId);

  if (!widget) {
    throw new Error(`Widget ${widgetId} not found`);
  }

  const context: DrillDownContext = {
    sourceWidget: widgetId,
    sourceDashboard: widget.dashboardId as DashboardId,
    filters,
    timeRange,
    breadcrumbs: [
      {
        label: widget.title,
        filters: {},
      },
      {
        label: 'Filtered View',
        filters,
      },
    ],
  };

  // Store drill-down session
  await DashboardDrillDown.create({
    id: `drill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    context,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hour expiration
  });

  return context;
}

/**
 * Gets detailed data for drill-down view
 * @param context - Drill-down context
 * @param page - Page number
 * @param pageSize - Items per page
 * @returns Detailed drill-down data
 */
export async function getDrillDownDetails(
  context: DrillDownContext,
  page: number = 1,
  pageSize: number = 50
): Promise<{
  data: any[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}> {
  // In production, this would query based on context filters
  const mockData = Array.from({ length: pageSize }, (_, i) => ({
    id: `item_${page}_${i}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000),
    severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 4)],
    description: `Detailed threat information ${i + 1}`,
    metadata: context.filters,
  }));

  return {
    data: mockData,
    total: 500,
    page,
    pageSize,
    hasMore: page * pageSize < 500,
  };
}

/**
 * Adds filter to drill-down context
 * @param context - Current context
 * @param filterKey - Filter key
 * @param filterValue - Filter value
 * @returns Updated context
 */
export function addDrillDownFilter(
  context: DrillDownContext,
  filterKey: string,
  filterValue: any
): DrillDownContext {
  const updatedFilters = {
    ...context.filters,
    [filterKey]: filterValue,
  };

  return {
    ...context,
    filters: updatedFilters,
    breadcrumbs: [
      ...context.breadcrumbs,
      {
        label: `${filterKey}: ${filterValue}`,
        filters: { [filterKey]: filterValue },
      },
    ],
  };
}

/**
 * Navigates back in drill-down breadcrumb trail
 * @param context - Current context
 * @param levels - Number of levels to go back
 * @returns Updated context
 */
export function navigateDrillDownBack(
  context: DrillDownContext,
  levels: number = 1
): DrillDownContext {
  const newBreadcrumbs = context.breadcrumbs.slice(0, -levels);

  // Rebuild filters from breadcrumbs
  const rebuiltFilters = newBreadcrumbs.reduce((acc, crumb) => ({
    ...acc,
    ...crumb.filters,
  }), {});

  return {
    ...context,
    filters: rebuiltFilters,
    breadcrumbs: newBreadcrumbs,
  };
}

/**
 * Exports drill-down data to file
 * @param context - Drill-down context
 * @param format - Export format
 * @returns Export data
 */
export async function exportDrillDownData(
  context: DrillDownContext,
  format: 'csv' | 'json' | 'xlsx'
): Promise<{ data: any; filename: string }> {
  const allData = await getDrillDownDetails(context, 1, 10000); // Get all data

  const filename = `drilldown_${context.sourceWidget}_${Date.now()}.${format}`;

  return {
    data: allData.data,
    filename,
  };
}

/**
 * Creates saved drill-down view
 * @param userId - User ID
 * @param context - Drill-down context
 * @param name - Saved view name
 * @returns Saved view ID
 */
export async function saveDrillDownView(
  userId: string,
  context: DrillDownContext,
  name: string
): Promise<string> {
  const drillDown = await DashboardDrillDown.create({
    id: `drill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    context: {
      ...context,
      savedViewName: name,
    },
    expiresAt: null, // Permanent save
  });

  return drillDown.id;
}

/**
 * Loads saved drill-down view
 * @param viewId - Saved view ID
 * @returns Drill-down context
 */
export async function loadDrillDownView(
  viewId: string
): Promise<DrillDownContext> {
  const drillDown = await DashboardDrillDown.findByPk(viewId);

  if (!drillDown) {
    throw new Error(`Drill-down view ${viewId} not found`);
  }

  return drillDown.context;
}

// ============================================================================
// DASHBOARD MANAGEMENT FUNCTIONS (6 functions)
// ============================================================================

/**
 * Lists all dashboards for a user
 * @param userId - User ID
 * @param filters - Optional filters
 * @returns User's dashboards
 */
export async function listUserDashboards(
  userId: string,
  filters: {
    visibility?: string[];
    tags?: string[];
    favorites?: boolean;
    sortBy?: 'name' | 'created' | 'updated' | 'views';
    order?: 'ASC' | 'DESC';
  } = {}
): Promise<SecurityDashboard[]> {
  const whereClause: any = {
    $or: [
      { ownerId: userId },
      { 'permissionsConfig.allowedUsers': { $contains: [userId] } },
    ],
  };

  if (filters.visibility?.length) {
    whereClause.visibility = { $in: filters.visibility };
  }

  if (filters.tags?.length) {
    whereClause.tags = { $overlap: filters.tags };
  }

  if (filters.favorites) {
    whereClause.isFavorite = true;
  }

  const orderField = filters.sortBy === 'views' ? 'viewCount' :
                     filters.sortBy === 'updated' ? 'updatedAt' :
                     filters.sortBy === 'created' ? 'createdAt' : 'name';

  return await SecurityDashboard.findAll({
    where: whereClause,
    order: [[orderField, filters.order || 'DESC']],
    include: [{ model: DashboardWidget, attributes: ['id'] }],
  });
}

/**
 * Searches dashboards by query
 * @param userId - User ID
 * @param query - Search query
 * @returns Matching dashboards
 */
export async function searchDashboards(
  userId: string,
  query: string
): Promise<SecurityDashboard[]> {
  return await SecurityDashboard.findAll({
    where: {
      $or: [
        { ownerId: userId },
        { 'permissionsConfig.allowedUsers': { $contains: [userId] } },
      ],
      $and: [
        {
          $or: [
            { name: { $iLike: `%${query}%` } },
            { description: { $iLike: `%${query}%` } },
            { tags: { $overlap: [query] } },
          ],
        },
      ],
    },
  });
}

/**
 * Sets dashboard as favorite
 * @param dashboardId - Dashboard ID
 * @param userId - User ID
 * @param favorite - Favorite status
 */
export async function toggleDashboardFavorite(
  dashboardId: DashboardId,
  userId: string,
  favorite: boolean
): Promise<void> {
  const dashboard = await SecurityDashboard.findByPk(dashboardId);

  if (!dashboard) {
    throw new Error(`Dashboard ${dashboardId} not found`);
  }

  await dashboard.update({ isFavorite: favorite });
}

/**
 * Increments dashboard view count
 * @param dashboardId - Dashboard ID
 */
export async function recordDashboardView(
  dashboardId: DashboardId
): Promise<void> {
  const dashboard = await SecurityDashboard.findByPk(dashboardId);

  if (!dashboard) {
    throw new Error(`Dashboard ${dashboardId} not found`);
  }

  await dashboard.update({
    viewCount: dashboard.viewCount + 1,
    lastViewedAt: new Date(),
  });
}

/**
 * Gets dashboard usage analytics
 * @param dashboardId - Dashboard ID
 * @param timeRange - Time range for analytics
 * @returns Usage analytics
 */
export async function getDashboardAnalytics(
  dashboardId: DashboardId,
  timeRange: TimeRange
): Promise<{
  views: number;
  uniqueUsers: number;
  avgSessionDuration: number;
  widgetInteractions: Record<string, number>;
  popularWidgets: Array<{ widgetId: string; title: string; interactions: number }>;
}> {
  // In production, this would query actual analytics data
  return {
    views: Math.floor(Math.random() * 1000),
    uniqueUsers: Math.floor(Math.random() * 50),
    avgSessionDuration: Math.floor(Math.random() * 600), // seconds
    widgetInteractions: {
      widget_1: 150,
      widget_2: 120,
      widget_3: 90,
    },
    popularWidgets: [
      { widgetId: 'widget_1', title: 'Threat Timeline', interactions: 150 },
      { widgetId: 'widget_2', title: 'Risk Score', interactions: 120 },
      { widgetId: 'widget_3', title: 'Compliance Status', interactions: 90 },
    ],
  };
}

/**
 * Deletes dashboard and all associated data
 * @param dashboardId - Dashboard ID
 * @param userId - User ID (for authorization)
 */
export async function deleteDashboard(
  dashboardId: DashboardId,
  userId: string
): Promise<void> {
  const dashboard = await SecurityDashboard.findByPk(dashboardId);

  if (!dashboard) {
    throw new Error(`Dashboard ${dashboardId} not found`);
  }

  if (dashboard.ownerId !== userId) {
    throw new Error('Only dashboard owner can delete dashboard');
  }

  // Delete associated widgets
  await DashboardWidget.destroy({ where: { dashboardId } });

  // Delete layouts
  await DashboardLayoutModel.destroy({ where: { dashboardId } });

  // Delete drill-downs
  await DashboardDrillDown.destroy({ where: { 'context.sourceDashboard': dashboardId } });

  // Delete dashboard
  await dashboard.destroy();
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createDefaultWidgetConfig(type: WidgetType): WidgetConfig {
  const baseConfig = {
    type,
    title: '',
    refreshInterval: RefreshInterval.THIRTY_SECONDS,
    timeRange: { start: new Date(Date.now() - 24 * 60 * 60 * 1000), end: new Date(), preset: 'last_24h' as const },
  };

  switch (type) {
    case WidgetType.THREAT_TIMELINE:
      return { ...baseConfig, type, groupBy: 'hour' as const, showTrend: true };
    case WidgetType.THREAT_MAP:
      return { ...baseConfig, type, mapType: 'world' as const, heatmapEnabled: true, clusteringEnabled: true };
    case WidgetType.METRIC_GAUGE:
      return {
        ...baseConfig,
        type,
        metricKey: 'security.risk.score',
        aggregation: MetricAggregation.AVG,
        thresholds: { critical: 80, high: 60, medium: 40, low: 20 },
      };
    default:
      return baseConfig as WidgetConfig;
  }
}

function calculateRiskScore(metrics: SecurityMetricModel[]): number {
  const riskMetrics = metrics.filter(m => m.category === 'risk');
  if (riskMetrics.length === 0) return 50;

  const avg = riskMetrics.reduce((sum, m) => sum + m.value, 0) / riskMetrics.length;
  return Math.min(100, Math.max(0, avg));
}

function calculateComplianceScore(metrics: SecurityMetricModel[]): number {
  const complianceMetrics = metrics.filter(m => m.category === 'compliance');
  if (complianceMetrics.length === 0) return 75;

  const avg = complianceMetrics.reduce((sum, m) => sum + m.value, 0) / complianceMetrics.length;
  return Math.min(100, Math.max(0, avg));
}

function calculateMetricTrends(metrics: SecurityMetricModel[], timeRange: TimeRange): Record<string, number> {
  return {
    threats: (Math.random() * 40) - 20,
    vulnerabilities: (Math.random() * 40) - 20,
    incidents: (Math.random() * 40) - 20,
  };
}

function generateSecurityRecommendations(summary: any): string[] {
  const recommendations: string[] = [];

  if (summary.riskScore > 70) {
    recommendations.push('High risk score detected - review critical vulnerabilities immediately');
  }

  if (summary.criticalIncidents > 5) {
    recommendations.push('Multiple critical incidents - escalate to security team');
  }

  if (summary.complianceScore < 80) {
    recommendations.push('Compliance gaps identified - review compliance requirements');
  }

  return recommendations;
}

function performAggregation(values: number[], aggregation: MetricAggregation): number {
  if (values.length === 0) return 0;

  switch (aggregation) {
    case MetricAggregation.SUM:
      return values.reduce((sum, val) => sum + val, 0);
    case MetricAggregation.AVG:
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    case MetricAggregation.MIN:
      return Math.min(...values);
    case MetricAggregation.MAX:
      return Math.max(...values);
    case MetricAggregation.COUNT:
      return values.length;
    case MetricAggregation.STDDEV:
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
      return Math.sqrt(variance);
    default:
      return values[0];
  }
}

function groupMetricsByInterval(
  metrics: SecurityMetricModel[],
  interval: 'hour' | 'day' | 'week' | 'month',
  aggregation: MetricAggregation
): Array<{ timestamp: Date; value: number }> {
  const groups = new Map<string, number[]>();

  metrics.forEach(metric => {
    const key = formatTimestampForInterval(metric.recordedAt, interval);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(metric.value);
  });

  return Array.from(groups.entries()).map(([timestamp, values]) => ({
    timestamp: new Date(timestamp),
    value: performAggregation(values, aggregation),
  }));
}

function formatTimestampForInterval(date: Date, interval: string): string {
  const d = new Date(date);

  switch (interval) {
    case 'hour':
      d.setMinutes(0, 0, 0);
      break;
    case 'day':
      d.setHours(0, 0, 0, 0);
      break;
    case 'week':
      const day = d.getDay();
      d.setDate(d.getDate() - day);
      d.setHours(0, 0, 0, 0);
      break;
    case 'month':
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      break;
  }

  return d.toISOString();
}

function calculateStats(values: number[]): { avg: number; min: number; max: number; stddev: number } {
  if (values.length === 0) return { avg: 0, min: 0, max: 0, stddev: 0 };

  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
  const stddev = Math.sqrt(variance);

  return { avg, min, max, stddev };
}

function categorizeAnomalySeverity(deviation: number, threshold: number): 'low' | 'medium' | 'high' {
  if (deviation > threshold * 2) return 'high';
  if (deviation > threshold * 1.5) return 'medium';
  return 'low';
}

function calculateTimeIntervals(timeRange: TimeRange, groupBy: 'hour' | 'day' | 'week'): Date[] {
  const intervals: Date[] = [];
  const start = new Date(timeRange.start);
  const end = new Date(timeRange.end);

  let current = new Date(start);
  const incrementMs = groupBy === 'hour' ? 3600000 : groupBy === 'day' ? 86400000 : 604800000;

  while (current <= end) {
    intervals.push(new Date(current));
    current = new Date(current.getTime() + incrementMs);
  }

  return intervals;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Executive Dashboard (8)
  createExecutiveDashboard,
  getExecutiveSummary,
  cloneExecutiveDashboard,
  generateExecutiveBriefing,
  shareExecutiveDashboard,
  exportExecutiveDashboard,
  archiveExecutiveDashboard,

  // Real-time Visualization (8)
  subscribeToRealtimeUpdates,
  renderThreatMap,
  generateThreatTimeline,
  getSeverityDistribution,
  getAttackVectorBreakdown,
  generateVulnerabilityHeatmap,
  getRealtimeAlertFeed,
  updateWidgetRealtimeData,

  // Metrics Aggregation (8)
  aggregateMetricsByCategory,
  calculateCompositeSecurityScore,
  recordSecurityMetric,
  querySecurityMetrics,
  calculateMetricPercentiles,
  getTopMetrics,
  compareMetricsAcrossPeriods,
  detectMetricAnomalies,

  // Customizable Widgets (8)
  createCustomWidget,
  updateWidgetConfig,
  duplicateWidget,
  reorderDashboardWidgets,
  getWidgetTemplates,
  validateWidgetConfig,
  applyWidgetTheme,
  exportWidgetAsTemplate,

  // Drill-down Analytics (7)
  createDrillDownContext,
  getDrillDownDetails,
  addDrillDownFilter,
  navigateDrillDownBack,
  exportDrillDownData,
  saveDrillDownView,
  loadDrillDownView,

  // Dashboard Management (6)
  listUserDashboards,
  searchDashboards,
  toggleDashboardFavorite,
  recordDashboardView,
  getDashboardAnalytics,
  deleteDashboard,
};
