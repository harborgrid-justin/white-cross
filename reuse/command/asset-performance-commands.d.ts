/**
 * ASSET PERFORMANCE MANAGEMENT COMMANDS
 *
 * Comprehensive asset performance monitoring and KPI tracking toolkit.
 * Provides 45 specialized functions covering:
 * - Performance metrics tracking and monitoring
 * - KPI (Key Performance Indicator) management
 * - OEE (Overall Equipment Effectiveness) calculations
 * - Asset availability and uptime monitoring
 * - Utilization rate tracking and analysis
 * - Efficiency calculations and benchmarking
 * - Performance trend analysis and forecasting
 * - Performance alert generation and management
 * - SLA (Service Level Agreement) compliance tracking
 * - Performance dashboards and reporting
 * - MTBF (Mean Time Between Failures) analysis
 * - MTTR (Mean Time To Repair) tracking
 * - Capacity planning and optimization
 *
 * @module AssetPerformanceCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @performance Optimized for high-frequency performance data collection
 * @scalability Supports millions of performance data points with aggregation
 *
 * @example
 * ```typescript
 * import {
 *   createPerformanceRecord,
 *   calculateOEE,
 *   trackAvailability,
 *   generatePerformanceAlert,
 *   PerformanceMetric,
 *   OEECalculation
 * } from './asset-performance-commands';
 *
 * // Create performance record
 * const record = await createPerformanceRecord({
 *   assetId: 'asset-001',
 *   metricType: 'uptime',
 *   value: 98.5,
 *   recordedAt: new Date()
 * });
 *
 * // Calculate OEE
 * const oee = await calculateOEE('asset-001', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Performance metric types
 */
export declare enum PerformanceMetricType {
    UPTIME = "uptime",
    DOWNTIME = "downtime",
    AVAILABILITY = "availability",
    UTILIZATION = "utilization",
    EFFICIENCY = "efficiency",
    THROUGHPUT = "throughput",
    CYCLE_TIME = "cycle_time",
    QUALITY_RATE = "quality_rate",
    PERFORMANCE_RATE = "performance_rate",
    OEE = "oee",
    MTBF = "mtbf",
    MTTR = "mttr",
    CAPACITY = "capacity",
    OUTPUT = "output"
}
/**
 * Performance status
 */
export declare enum PerformanceStatus {
    EXCELLENT = "excellent",
    GOOD = "good",
    ACCEPTABLE = "acceptable",
    POOR = "poor",
    CRITICAL = "critical",
    UNKNOWN = "unknown"
}
/**
 * KPI status
 */
export declare enum KPIStatus {
    ABOVE_TARGET = "above_target",
    ON_TARGET = "on_target",
    BELOW_TARGET = "below_target",
    CRITICAL = "critical",
    NOT_MEASURED = "not_measured"
}
/**
 * Alert severity levels
 */
export declare enum AlertSeverity {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical"
}
/**
 * Alert status
 */
export declare enum AlertStatus {
    OPEN = "open",
    ACKNOWLEDGED = "acknowledged",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed",
    ESCALATED = "escalated"
}
/**
 * Trend direction
 */
export declare enum TrendDirection {
    IMPROVING = "improving",
    STABLE = "stable",
    DECLINING = "declining",
    VOLATILE = "volatile"
}
/**
 * SLA compliance status
 */
export declare enum SLAComplianceStatus {
    COMPLIANT = "compliant",
    AT_RISK = "at_risk",
    NON_COMPLIANT = "non_compliant",
    BREACHED = "breached"
}
/**
 * Performance record data
 */
export interface PerformanceRecordData {
    assetId: string;
    metricType: PerformanceMetricType;
    value: number;
    unit?: string;
    recordedAt: Date;
    recordedBy?: string;
    metadata?: Record<string, any>;
    notes?: string;
}
/**
 * KPI definition data
 */
export interface KPIDefinitionData {
    name: string;
    description?: string;
    metricType: PerformanceMetricType;
    targetValue: number;
    warningThreshold?: number;
    criticalThreshold?: number;
    unit: string;
    calculationMethod?: string;
    measurementFrequency?: string;
    assetTypeId?: string;
    departmentId?: string;
    isActive: boolean;
}
/**
 * OEE calculation parameters
 */
export interface OEECalculationParams {
    startDate: Date;
    endDate: Date;
    plannedProductionTime?: number;
    targetCycleTime?: number;
    targetQuality?: number;
}
/**
 * OEE calculation result
 */
export interface OEECalculationResult {
    assetId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    availability: number;
    performance: number;
    quality: number;
    oee: number;
    plannedProductionTime: number;
    actualProductionTime: number;
    downtime: number;
    idealCycleTime: number;
    actualCycleTime: number;
    totalUnits: number;
    goodUnits: number;
    defectiveUnits: number;
    status: PerformanceStatus;
    calculatedAt: Date;
}
/**
 * Availability metrics
 */
export interface AvailabilityMetrics {
    assetId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    totalTime: number;
    uptime: number;
    downtime: number;
    plannedDowntime: number;
    unplannedDowntime: number;
    availability: number;
    reliability: number;
    mtbf: number;
    mttr: number;
    failureCount: number;
}
/**
 * Utilization metrics
 */
export interface UtilizationMetrics {
    assetId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    totalCapacity: number;
    usedCapacity: number;
    utilizationRate: number;
    idleTime: number;
    activeTime: number;
    peakUsage: number;
    averageUsage: number;
    efficiencyScore: number;
}
/**
 * Performance benchmark data
 */
export interface PerformanceBenchmarkData {
    assetId: string;
    assetTypeId: string;
    metricType: PerformanceMetricType;
    value: number;
    industryAverage?: number;
    bestInClass?: number;
    percentile?: number;
    benchmarkedAt: Date;
}
/**
 * Performance trend analysis
 */
export interface PerformanceTrendAnalysis {
    assetId: string;
    metricType: PerformanceMetricType;
    period: {
        startDate: Date;
        endDate: Date;
    };
    currentValue: number;
    previousValue: number;
    changePercent: number;
    trend: TrendDirection;
    movingAverage: number;
    forecast: number[];
    anomalies: AnomalyDetection[];
}
/**
 * Anomaly detection result
 */
export interface AnomalyDetection {
    timestamp: Date;
    value: number;
    expectedValue: number;
    deviation: number;
    severity: AlertSeverity;
    confidence: number;
}
/**
 * Performance alert data
 */
export interface PerformanceAlertData {
    assetId: string;
    alertType: string;
    severity: AlertSeverity;
    metricType: PerformanceMetricType;
    currentValue: number;
    threshold: number;
    message: string;
    metadata?: Record<string, any>;
}
/**
 * SLA definition data
 */
export interface SLADefinitionData {
    name: string;
    description?: string;
    assetId?: string;
    assetTypeId?: string;
    metricType: PerformanceMetricType;
    targetValue: number;
    minimumValue: number;
    measurementPeriod: string;
    penaltyAmount?: number;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
}
/**
 * SLA compliance result
 */
export interface SLAComplianceResult {
    slaId: string;
    assetId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    targetValue: number;
    actualValue: number;
    compliance: number;
    status: SLAComplianceStatus;
    violations: SLAViolation[];
    penalties: number;
}
/**
 * SLA violation record
 */
export interface SLAViolation {
    timestamp: Date;
    duration: number;
    targetValue: number;
    actualValue: number;
    severity: AlertSeverity;
    penaltyAmount?: number;
}
/**
 * Performance dashboard data
 */
export interface PerformanceDashboardData {
    assetId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    overallStatus: PerformanceStatus;
    oee: OEECalculationResult;
    availability: AvailabilityMetrics;
    utilization: UtilizationMetrics;
    kpis: KPIValue[];
    alerts: PerformanceAlert[];
    trends: PerformanceTrendAnalysis[];
    slaCompliance: SLAComplianceResult[];
}
/**
 * KPI value result
 */
export interface KPIValue {
    kpiId: string;
    name: string;
    metricType: PerformanceMetricType;
    currentValue: number;
    targetValue: number;
    unit: string;
    status: KPIStatus;
    trend: TrendDirection;
    lastUpdated: Date;
}
/**
 * Performance metric database model
 */
export declare class PerformanceMetric extends Model {
    id: string;
    assetId: string;
    metricType: PerformanceMetricType;
    value: number;
    unit: string;
    recordedAt: Date;
    recordedBy: string;
    metadata: Record<string, any>;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * KPI definition database model
 */
export declare class KPIDefinition extends Model {
    id: string;
    name: string;
    description: string;
    metricType: PerformanceMetricType;
    targetValue: number;
    warningThreshold: number;
    criticalThreshold: number;
    unit: string;
    calculationMethod: string;
    measurementFrequency: string;
    assetTypeId: string;
    departmentId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * OEE calculation database model
 */
export declare class OEECalculation extends Model {
    id: string;
    assetId: string;
    periodStart: Date;
    periodEnd: Date;
    availability: number;
    performance: number;
    quality: number;
    oee: number;
    plannedProductionTime: number;
    actualProductionTime: number;
    downtime: number;
    totalUnits: number;
    goodUnits: number;
    defectiveUnits: number;
    status: PerformanceStatus;
    calculatedAt: Date;
    calculatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Performance alert database model
 */
export declare class PerformanceAlert extends Model {
    id: string;
    assetId: string;
    alertType: string;
    severity: AlertSeverity;
    metricType: PerformanceMetricType;
    currentValue: number;
    threshold: number;
    message: string;
    status: AlertStatus;
    acknowledgedBy: string;
    acknowledgedAt: Date;
    resolvedBy: string;
    resolvedAt: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * SLA definition database model
 */
export declare class SLADefinition extends Model {
    id: string;
    name: string;
    description: string;
    assetId: string;
    assetTypeId: string;
    metricType: PerformanceMetricType;
    targetValue: number;
    minimumValue: number;
    measurementPeriod: string;
    penaltyAmount: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * SLA compliance tracking database model
 */
export declare class SLACompliance extends Model {
    id: string;
    slaId: string;
    sla: SLADefinition;
    assetId: string;
    periodStart: Date;
    periodEnd: Date;
    targetValue: number;
    actualValue: number;
    compliance: number;
    status: SLAComplianceStatus;
    violations: SLAViolation[];
    penalties: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Create performance record DTO
 */
export declare class CreatePerformanceRecordDto {
    assetId: string;
    metricType: PerformanceMetricType;
    value: number;
    unit?: string;
    recordedAt: Date;
    recordedBy?: string;
    metadata?: Record<string, any>;
    notes?: string;
}
/**
 * Create KPI definition DTO
 */
export declare class CreateKPIDefinitionDto {
    name: string;
    description?: string;
    metricType: PerformanceMetricType;
    targetValue: number;
    warningThreshold?: number;
    criticalThreshold?: number;
    unit: string;
    calculationMethod?: string;
    measurementFrequency?: string;
    assetTypeId?: string;
    departmentId?: string;
    isActive: boolean;
}
/**
 * Calculate OEE DTO
 */
export declare class CalculateOEEDto {
    assetId: string;
    startDate: Date;
    endDate: Date;
    plannedProductionTime?: number;
    targetCycleTime?: number;
    targetQuality?: number;
}
/**
 * Create performance alert DTO
 */
export declare class CreatePerformanceAlertDto {
    assetId: string;
    alertType: string;
    severity: AlertSeverity;
    metricType?: PerformanceMetricType;
    currentValue?: number;
    threshold?: number;
    message: string;
    metadata?: Record<string, any>;
}
/**
 * Create SLA definition DTO
 */
export declare class CreateSLADefinitionDto {
    name: string;
    description?: string;
    assetId?: string;
    assetTypeId?: string;
    metricType: PerformanceMetricType;
    targetValue: number;
    minimumValue: number;
    measurementPeriod: string;
    penaltyAmount?: number;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
}
/**
 * Create a new performance record
 *
 * @param data - Performance record data
 * @param transaction - Optional database transaction
 * @returns Created performance metric
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const record = await createPerformanceRecord({
 *   assetId: 'asset-001',
 *   metricType: 'uptime',
 *   value: 98.5,
 *   recordedAt: new Date()
 * });
 * ```
 */
export declare function createPerformanceRecord(data: PerformanceRecordData, transaction?: Transaction): Promise<PerformanceMetric>;
/**
 * Get performance record by ID
 *
 * @param id - Performance metric ID
 * @returns Performance metric or null
 *
 * @example
 * ```typescript
 * const record = await getPerformanceRecordById('metric-001');
 * ```
 */
export declare function getPerformanceRecordById(id: string): Promise<PerformanceMetric | null>;
/**
 * Get performance records for an asset
 *
 * @param assetId - Asset ID
 * @param metricType - Optional metric type filter
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @param limit - Maximum number of records to return
 * @returns Array of performance metrics
 *
 * @example
 * ```typescript
 * const records = await getAssetPerformanceRecords(
 *   'asset-001',
 *   'uptime',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare function getAssetPerformanceRecords(assetId: string, metricType?: PerformanceMetricType, startDate?: Date, endDate?: Date, limit?: number): Promise<PerformanceMetric[]>;
/**
 * Update performance record
 *
 * @param id - Performance metric ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated performance metric
 * @throws NotFoundException if metric not found
 *
 * @example
 * ```typescript
 * const updated = await updatePerformanceRecord('metric-001', {
 *   value: 99.0,
 *   notes: 'Corrected value'
 * });
 * ```
 */
export declare function updatePerformanceRecord(id: string, updates: Partial<PerformanceRecordData>, transaction?: Transaction): Promise<PerformanceMetric>;
/**
 * Delete performance record
 *
 * @param id - Performance metric ID
 * @param transaction - Optional database transaction
 * @throws NotFoundException if metric not found
 *
 * @example
 * ```typescript
 * await deletePerformanceRecord('metric-001');
 * ```
 */
export declare function deletePerformanceRecord(id: string, transaction?: Transaction): Promise<void>;
/**
 * Calculate OEE (Overall Equipment Effectiveness) for an asset
 *
 * @param assetId - Asset ID
 * @param params - OEE calculation parameters
 * @param transaction - Optional database transaction
 * @returns OEE calculation result
 * @throws BadRequestException if calculation fails
 *
 * @example
 * ```typescript
 * const oee = await calculateOEE('asset-001', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 *   plannedProductionTime: 20000
 * });
 * ```
 */
export declare function calculateOEE(assetId: string, params: OEECalculationParams, transaction?: Transaction): Promise<OEECalculationResult>;
/**
 * Get OEE calculation history for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @param limit - Maximum number of records
 * @returns Array of OEE calculations
 *
 * @example
 * ```typescript
 * const history = await getOEEHistory('asset-001', new Date('2024-01-01'));
 * ```
 */
export declare function getOEEHistory(assetId: string, startDate?: Date, endDate?: Date, limit?: number): Promise<OEECalculation[]>;
/**
 * Calculate availability metrics for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Availability metrics
 *
 * @example
 * ```typescript
 * const availability = await calculateAvailability(
 *   'asset-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare function calculateAvailability(assetId: string, startDate: Date, endDate: Date): Promise<AvailabilityMetrics>;
/**
 * Calculate utilization metrics for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @param totalCapacity - Total capacity for the period
 * @returns Utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = await calculateUtilization(
 *   'asset-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   10000
 * );
 * ```
 */
export declare function calculateUtilization(assetId: string, startDate: Date, endDate: Date, totalCapacity: number): Promise<UtilizationMetrics>;
/**
 * Create a KPI definition
 *
 * @param data - KPI definition data
 * @param transaction - Optional database transaction
 * @returns Created KPI definition
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const kpi = await createKPIDefinition({
 *   name: 'Asset Uptime',
 *   metricType: 'uptime',
 *   targetValue: 95,
 *   unit: '%',
 *   isActive: true
 * });
 * ```
 */
export declare function createKPIDefinition(data: KPIDefinitionData, transaction?: Transaction): Promise<KPIDefinition>;
/**
 * Get KPI definition by ID
 *
 * @param id - KPI definition ID
 * @returns KPI definition or null
 *
 * @example
 * ```typescript
 * const kpi = await getKPIDefinitionById('kpi-001');
 * ```
 */
export declare function getKPIDefinitionById(id: string): Promise<KPIDefinition | null>;
/**
 * Get all active KPI definitions
 *
 * @param filters - Optional filters (assetTypeId, departmentId)
 * @returns Array of KPI definitions
 *
 * @example
 * ```typescript
 * const kpis = await getActiveKPIs({ assetTypeId: 'type-001' });
 * ```
 */
export declare function getActiveKPIs(filters?: {
    assetTypeId?: string;
    departmentId?: string;
}): Promise<KPIDefinition[]>;
/**
 * Update KPI definition
 *
 * @param id - KPI definition ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated KPI definition
 * @throws NotFoundException if KPI not found
 *
 * @example
 * ```typescript
 * const updated = await updateKPIDefinition('kpi-001', {
 *   targetValue: 98,
 *   warningThreshold: 95
 * });
 * ```
 */
export declare function updateKPIDefinition(id: string, updates: Partial<KPIDefinitionData>, transaction?: Transaction): Promise<KPIDefinition>;
/**
 * Calculate KPI value for an asset
 *
 * @param assetId - Asset ID
 * @param kpiId - KPI definition ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns KPI value result
 * @throws NotFoundException if KPI definition not found
 *
 * @example
 * ```typescript
 * const kpiValue = await calculateKPIValue(
 *   'asset-001',
 *   'kpi-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare function calculateKPIValue(assetId: string, kpiId: string, startDate: Date, endDate: Date): Promise<KPIValue>;
/**
 * Create a performance alert
 *
 * @param data - Performance alert data
 * @param transaction - Optional database transaction
 * @returns Created performance alert
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const alert = await createPerformanceAlert({
 *   assetId: 'asset-001',
 *   alertType: 'low_uptime',
 *   severity: 'warning',
 *   message: 'Asset uptime below threshold'
 * });
 * ```
 */
export declare function createPerformanceAlert(data: PerformanceAlertData, transaction?: Transaction): Promise<PerformanceAlert>;
/**
 * Get performance alert by ID
 *
 * @param id - Alert ID
 * @returns Performance alert or null
 *
 * @example
 * ```typescript
 * const alert = await getPerformanceAlertById('alert-001');
 * ```
 */
export declare function getPerformanceAlertById(id: string): Promise<PerformanceAlert | null>;
/**
 * Get active alerts for an asset
 *
 * @param assetId - Asset ID
 * @param severity - Optional severity filter
 * @returns Array of active alerts
 *
 * @example
 * ```typescript
 * const alerts = await getActiveAlertsForAsset('asset-001', 'critical');
 * ```
 */
export declare function getActiveAlertsForAsset(assetId: string, severity?: AlertSeverity): Promise<PerformanceAlert[]>;
/**
 * Acknowledge a performance alert
 *
 * @param id - Alert ID
 * @param userId - User ID acknowledging the alert
 * @param transaction - Optional database transaction
 * @returns Updated alert
 * @throws NotFoundException if alert not found
 *
 * @example
 * ```typescript
 * const alert = await acknowledgePerformanceAlert('alert-001', 'user-001');
 * ```
 */
export declare function acknowledgePerformanceAlert(id: string, userId: string, transaction?: Transaction): Promise<PerformanceAlert>;
/**
 * Resolve a performance alert
 *
 * @param id - Alert ID
 * @param userId - User ID resolving the alert
 * @param transaction - Optional database transaction
 * @returns Updated alert
 * @throws NotFoundException if alert not found
 *
 * @example
 * ```typescript
 * const alert = await resolvePerformanceAlert('alert-001', 'user-001');
 * ```
 */
export declare function resolvePerformanceAlert(id: string, userId: string, transaction?: Transaction): Promise<PerformanceAlert>;
/**
 * Generate performance alerts based on KPI thresholds
 *
 * @param assetId - Asset ID
 * @param transaction - Optional database transaction
 * @returns Array of generated alerts
 *
 * @example
 * ```typescript
 * const alerts = await generatePerformanceAlertsForAsset('asset-001');
 * ```
 */
export declare function generatePerformanceAlertsForAsset(assetId: string, transaction?: Transaction): Promise<PerformanceAlert[]>;
/**
 * Create an SLA definition
 *
 * @param data - SLA definition data
 * @param transaction - Optional database transaction
 * @returns Created SLA definition
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const sla = await createSLADefinition({
 *   name: 'Critical Asset Uptime',
 *   metricType: 'availability',
 *   targetValue: 99.9,
 *   minimumValue: 99.0,
 *   measurementPeriod: 'monthly',
 *   startDate: new Date(),
 *   isActive: true
 * });
 * ```
 */
export declare function createSLADefinition(data: SLADefinitionData, transaction?: Transaction): Promise<SLADefinition>;
/**
 * Get SLA definition by ID
 *
 * @param id - SLA definition ID
 * @returns SLA definition or null
 *
 * @example
 * ```typescript
 * const sla = await getSLADefinitionById('sla-001');
 * ```
 */
export declare function getSLADefinitionById(id: string): Promise<SLADefinition | null>;
/**
 * Get active SLAs for an asset
 *
 * @param assetId - Asset ID
 * @returns Array of active SLA definitions
 *
 * @example
 * ```typescript
 * const slas = await getActiveSLAsForAsset('asset-001');
 * ```
 */
export declare function getActiveSLAsForAsset(assetId: string): Promise<SLADefinition[]>;
/**
 * Track SLA compliance for an asset
 *
 * @param slaId - SLA definition ID
 * @param assetId - Asset ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @param transaction - Optional database transaction
 * @returns SLA compliance result
 * @throws NotFoundException if SLA not found
 *
 * @example
 * ```typescript
 * const compliance = await trackSLACompliance(
 *   'sla-001',
 *   'asset-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare function trackSLACompliance(slaId: string, assetId: string, startDate: Date, endDate: Date, transaction?: Transaction): Promise<SLAComplianceResult>;
/**
 * Get SLA compliance history for an asset
 *
 * @param assetId - Asset ID
 * @param slaId - Optional SLA definition ID filter
 * @param limit - Maximum number of records
 * @returns Array of SLA compliance records
 *
 * @example
 * ```typescript
 * const history = await getSLAComplianceHistory('asset-001', 'sla-001');
 * ```
 */
export declare function getSLAComplianceHistory(assetId: string, slaId?: string, limit?: number): Promise<SLACompliance[]>;
/**
 * Get comprehensive performance dashboard data for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Performance dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await getPerformanceDashboard(
 *   'asset-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare function getPerformanceDashboard(assetId: string, startDate: Date, endDate: Date): Promise<PerformanceDashboardData>;
/**
 * Generate performance report for multiple assets
 *
 * @param assetIds - Array of asset IDs
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Array of performance dashboard data
 *
 * @example
 * ```typescript
 * const report = await generatePerformanceReport(
 *   ['asset-001', 'asset-002'],
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare function generatePerformanceReport(assetIds: string[], startDate: Date, endDate: Date): Promise<PerformanceDashboardData[]>;
declare const _default: {
    createPerformanceRecord: typeof createPerformanceRecord;
    getPerformanceRecordById: typeof getPerformanceRecordById;
    getAssetPerformanceRecords: typeof getAssetPerformanceRecords;
    updatePerformanceRecord: typeof updatePerformanceRecord;
    deletePerformanceRecord: typeof deletePerformanceRecord;
    calculateOEE: typeof calculateOEE;
    getOEEHistory: typeof getOEEHistory;
    calculateAvailability: typeof calculateAvailability;
    calculateUtilization: typeof calculateUtilization;
    createKPIDefinition: typeof createKPIDefinition;
    getKPIDefinitionById: typeof getKPIDefinitionById;
    getActiveKPIs: typeof getActiveKPIs;
    updateKPIDefinition: typeof updateKPIDefinition;
    calculateKPIValue: typeof calculateKPIValue;
    createPerformanceAlert: typeof createPerformanceAlert;
    getPerformanceAlertById: typeof getPerformanceAlertById;
    getActiveAlertsForAsset: typeof getActiveAlertsForAsset;
    acknowledgePerformanceAlert: typeof acknowledgePerformanceAlert;
    resolvePerformanceAlert: typeof resolvePerformanceAlert;
    generatePerformanceAlertsForAsset: typeof generatePerformanceAlertsForAsset;
    createSLADefinition: typeof createSLADefinition;
    getSLADefinitionById: typeof getSLADefinitionById;
    getActiveSLAsForAsset: typeof getActiveSLAsForAsset;
    trackSLACompliance: typeof trackSLACompliance;
    getSLAComplianceHistory: typeof getSLAComplianceHistory;
    getPerformanceDashboard: typeof getPerformanceDashboard;
    generatePerformanceReport: typeof generatePerformanceReport;
    PerformanceMetric: typeof PerformanceMetric;
    KPIDefinition: typeof KPIDefinition;
    OEECalculation: typeof OEECalculation;
    PerformanceAlert: typeof PerformanceAlert;
    SLADefinition: typeof SLADefinition;
    SLACompliance: typeof SLACompliance;
    CreatePerformanceRecordDto: typeof CreatePerformanceRecordDto;
    CreateKPIDefinitionDto: typeof CreateKPIDefinitionDto;
    CalculateOEEDto: typeof CalculateOEEDto;
    CreatePerformanceAlertDto: typeof CreatePerformanceAlertDto;
    CreateSLADefinitionDto: typeof CreateSLADefinitionDto;
    PerformanceMetricType: typeof PerformanceMetricType;
    PerformanceStatus: typeof PerformanceStatus;
    KPIStatus: typeof KPIStatus;
    AlertSeverity: typeof AlertSeverity;
    AlertStatus: typeof AlertStatus;
    TrendDirection: typeof TrendDirection;
    SLAComplianceStatus: typeof SLAComplianceStatus;
};
export default _default;
//# sourceMappingURL=asset-performance-commands.d.ts.map