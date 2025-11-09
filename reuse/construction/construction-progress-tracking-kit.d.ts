/**
 * CONSTRUCTION PROGRESS TRACKING KIT
 *
 * Comprehensive progress monitoring and earned value management system for construction projects.
 * Provides 40 specialized functions covering:
 * - Physical progress measurement and verification
 * - Earned value management (EVM) analysis
 * - Schedule performance index (SPI) tracking
 * - Cost performance index (CPI) tracking
 * - Milestone tracking and validation
 * - Completion percentage calculation
 * - Progress photography and documentation
 * - Daily construction reports
 * - Weekly progress reports
 * - S-curve generation and analysis
 * - Trend analysis and forecasting
 * - Variance analysis (schedule and cost)
 * - Critical path impact analysis
 * - Progress payment processing
 * - NestJS injectable services with DI
 * - Swagger API documentation
 * - Full validation and error handling
 *
 * @module ConstructionProgressTrackingKit
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.1.0
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires @faker-js/faker ^9.4.0
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @example
 * ```typescript
 * import {
 *   recordProgressMeasurement,
 *   calculateEarnedValue,
 *   generateSCurve,
 *   createDailyReport,
 *   trackMilestoneProgress
 * } from './construction-progress-tracking-kit';
 *
 * // Record progress
 * const progress = await recordProgressMeasurement({
 *   activityId: 'act-123',
 *   percentComplete: 75,
 *   quantityCompleted: 850,
 *   verifiedBy: 'inspector-456'
 * });
 *
 * // Calculate earned value
 * const evm = await calculateEarnedValue('proj-123', new Date());
 * ```
 */
import { Model } from 'sequelize-typescript';
/**
 * Progress measurement method
 */
export declare enum MeasurementMethod {
    PERCENT_COMPLETE = "percent_complete",
    QUANTITY_COMPLETE = "quantity_complete",
    WEIGHTED_MILESTONE = "weighted_milestone",
    EARNED_VALUE = "earned_value",
    LEVEL_OF_EFFORT = "level_of_effort"
}
/**
 * Activity status
 */
export declare enum ActivityStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    ON_HOLD = "on_hold",
    CANCELLED = "cancelled"
}
/**
 * Milestone status
 */
export declare enum MilestoneStatus {
    UPCOMING = "upcoming",
    ON_TRACK = "on_track",
    AT_RISK = "at_risk",
    LATE = "late",
    COMPLETED = "completed"
}
/**
 * Progress report type
 */
export declare enum ReportType {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    MILESTONE = "milestone"
}
/**
 * Weather condition
 */
export declare enum WeatherCondition {
    CLEAR = "clear",
    PARTLY_CLOUDY = "partly_cloudy",
    CLOUDY = "cloudy",
    RAIN = "rain",
    HEAVY_RAIN = "heavy_rain",
    SNOW = "snow",
    EXTREME_HEAT = "extreme_heat",
    EXTREME_COLD = "extreme_cold"
}
/**
 * Performance trend
 */
export declare enum PerformanceTrend {
    IMPROVING = "improving",
    STABLE = "stable",
    DECLINING = "declining"
}
/**
 * Variance category
 */
export declare enum VarianceCategory {
    FAVORABLE = "favorable",
    ACCEPTABLE = "acceptable",
    UNFAVORABLE = "unfavorable",
    CRITICAL = "critical"
}
/**
 * Progress Measurement Model - Sequelize
 * Tracks physical progress of construction activities
 */
export declare class ProgressMeasurement extends Model {
    id: string;
    activityId: string;
    projectId: string;
    measurementDate: Date;
    percentComplete: number;
    quantityCompleted: number;
    plannedQuantity: number;
    measurementMethod: MeasurementMethod;
    earnedValue: number;
    plannedValue: number;
    actualCost: number;
    verifiedBy: string;
    notes: string;
    photos: Array<{
        url: string;
        caption: string;
        timestamp: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Daily Report Model - Sequelize
 * Captures daily construction progress and site conditions
 */
export declare class DailyReport extends Model {
    id: string;
    projectId: string;
    reportDate: Date;
    weatherCondition: WeatherCondition;
    temperatureHigh: number;
    temperatureLow: number;
    workersOnSite: number;
    visitorsOnSite: number;
    workPerformed: string;
    equipmentUsed: string;
    materialsDelivered: string;
    issues: string;
    safetyIncidents: string;
    delayHours: number;
    delayReasons: string;
    progressPhotos: Array<{
        url: string;
        caption: string;
        location: string;
    }>;
    submittedBy: string;
    approvedBy: string;
    approvedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Construction Milestone Model - Sequelize
 * Tracks major project milestones and completion criteria
 */
export declare class ConstructionMilestone extends Model {
    id: string;
    projectId: string;
    milestoneName: string;
    description: string;
    plannedDate: Date;
    forecastDate: Date;
    actualDate: Date;
    status: MilestoneStatus;
    budgetedValue: number;
    earnedValue: number;
    percentComplete: number;
    completionCriteria: Array<{
        criterion: string;
        isMet: boolean;
    }>;
    deliverables: Array<{
        name: string;
        isComplete: boolean;
    }>;
    completedBy: string;
    completionNotes: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Earned value metrics interface
 */
export interface EarnedValueMetrics {
    projectId: string;
    asOfDate: Date;
    budgetAtCompletion: number;
    plannedValue: number;
    earnedValue: number;
    actualCost: number;
    scheduleVariance: number;
    costVariance: number;
    schedulePerformanceIndex: number;
    costPerformanceIndex: number;
    estimateAtCompletion: number;
    estimateToComplete: number;
    varianceAtCompletion: number;
    toCompletePerformanceIndex: number;
    percentScheduled: number;
    percentComplete: number;
    percentSpent: number;
}
/**
 * S-curve data point interface
 */
export interface SCurveDataPoint {
    date: Date;
    plannedValue: number;
    earnedValue: number;
    actualCost: number;
    plannedValueCumulative: number;
    earnedValueCumulative: number;
    actualCostCumulative: number;
}
/**
 * Progress trend interface
 */
export interface ProgressTrend {
    period: string;
    percentComplete: number;
    earnedValue: number;
    plannedValue: number;
    scheduleVariance: number;
    costVariance: number;
    trend: PerformanceTrend;
}
/**
 * Variance analysis interface
 */
export interface VarianceAnalysis {
    category: string;
    budgeted: number;
    actual: number;
    variance: number;
    variancePercentage: number;
    varianceCategory: VarianceCategory;
    explanation?: string;
    correctiveAction?: string;
}
/**
 * Progress payment interface
 */
export interface ProgressPayment {
    id: string;
    projectId: string;
    paymentNumber: number;
    periodEnding: Date;
    scheduleOfValues: Array<{
        lineItem: string;
        scheduledValue: number;
        previouslyCompleted: number;
        currentCompleted: number;
        totalCompleted: number;
        percentComplete: number;
        currentAmount: number;
    }>;
    totalScheduledValue: number;
    totalCompleted: number;
    percentComplete: number;
    currentPaymentAmount: number;
    retainage: number;
    netPayment: number;
    approvedBy?: string;
    approvedAt?: Date;
}
/**
 * Record progress measurement DTO
 */
export declare class RecordProgressDto {
    activityId: string;
    projectId: string;
    measurementDate: Date;
    percentComplete: number;
    quantityCompleted?: number;
    measurementMethod: MeasurementMethod;
    verifiedBy: string;
    notes?: string;
}
/**
 * Create daily report DTO
 */
export declare class CreateDailyReportDto {
    projectId: string;
    reportDate: Date;
    weatherCondition: WeatherCondition;
    temperatureHigh: number;
    temperatureLow: number;
    workersOnSite: number;
    workPerformed: string;
    equipmentUsed?: string;
    issues?: string;
}
/**
 * Create milestone DTO
 */
export declare class CreateMilestoneDto {
    projectId: string;
    milestoneName: string;
    description: string;
    plannedDate: Date;
    budgetedValue: number;
    completionCriteria?: Array<{
        criterion: string;
        isMet: boolean;
    }>;
}
/**
 * Update milestone progress DTO
 */
export declare class UpdateMilestoneProgressDto {
    percentComplete: number;
    forecastDate?: Date;
    completionNotes?: string;
}
/**
 * Add progress photo DTO
 */
export declare class AddProgressPhotoDto {
    url: string;
    caption: string;
    location?: string;
}
/**
 * Records physical progress measurement for an activity
 *
 * @param measurementData - Progress measurement data
 * @returns Created progress measurement
 *
 * @example
 * ```typescript
 * const progress = await recordProgressMeasurement({
 *   activityId: 'act-123',
 *   projectId: 'proj-456',
 *   measurementDate: new Date(),
 *   percentComplete: 75,
 *   quantityCompleted: 850,
 *   measurementMethod: MeasurementMethod.QUANTITY_COMPLETE,
 *   verifiedBy: 'inspector-789'
 * });
 * ```
 */
export declare function recordProgressMeasurement(measurementData: {
    activityId: string;
    projectId: string;
    measurementDate: Date;
    percentComplete: number;
    quantityCompleted?: number;
    plannedQuantity?: number;
    measurementMethod: MeasurementMethod;
    verifiedBy: string;
    notes?: string;
}): Promise<ProgressMeasurement>;
/**
 * Calculates earned value for an activity
 *
 * @param activityId - Activity identifier
 * @param percentComplete - Completion percentage
 * @param budgetedCost - Budgeted cost for activity
 * @returns Earned value amount
 *
 * @example
 * ```typescript
 * const ev = calculateActivityEarnedValue('act-123', 75, 100000);
 * // Returns: 75000
 * ```
 */
export declare function calculateActivityEarnedValue(activityId: string, percentComplete: number, budgetedCost: number): number;
/**
 * Verifies progress measurement against quality standards
 *
 * @param measurementId - Measurement identifier
 * @param verificationData - Verification details
 * @returns Verification result
 *
 * @example
 * ```typescript
 * await verifyProgressMeasurement('meas-123', {
 *   inspectorId: 'user-456',
 *   qualityChecklist: {...},
 *   isApproved: true
 * });
 * ```
 */
export declare function verifyProgressMeasurement(measurementId: string, verificationData: {
    inspectorId: string;
    qualityChecklist?: Record<string, boolean>;
    isApproved: boolean;
    notes?: string;
}): Promise<{
    measurementId: string;
    verifiedBy: string;
    verifiedAt: Date;
    isApproved: boolean;
}>;
/**
 * Gets activity progress history
 *
 * @param activityId - Activity identifier
 * @returns Progress measurement history
 *
 * @example
 * ```typescript
 * const history = await getActivityProgressHistory('act-123');
 * ```
 */
export declare function getActivityProgressHistory(activityId: string): Promise<ProgressMeasurement[]>;
/**
 * Calculates comprehensive earned value metrics for project
 *
 * @param projectId - Project identifier
 * @param asOfDate - Calculation date
 * @returns Complete EVM metrics
 *
 * @example
 * ```typescript
 * const evm = await calculateEarnedValue('proj-123', new Date());
 * ```
 */
export declare function calculateEarnedValue(projectId: string, asOfDate: Date): Promise<EarnedValueMetrics>;
/**
 * Calculates schedule performance index
 *
 * @param earnedValue - Earned value
 * @param plannedValue - Planned value
 * @returns SPI and interpretation
 *
 * @example
 * ```typescript
 * const spi = calculateSchedulePerformanceIndex(2200000, 2500000);
 * ```
 */
export declare function calculateSchedulePerformanceIndex(earnedValue: number, plannedValue: number): {
    spi: number;
    scheduleVariance: number;
    performance: 'ahead' | 'on_schedule' | 'behind';
    interpretation: string;
};
/**
 * Calculates cost performance index
 *
 * @param earnedValue - Earned value
 * @param actualCost - Actual cost
 * @returns CPI and interpretation
 *
 * @example
 * ```typescript
 * const cpi = calculateCostPerformanceIndex(2200000, 2350000);
 * ```
 */
export declare function calculateCostPerformanceIndex(earnedValue: number, actualCost: number): {
    cpi: number;
    costVariance: number;
    performance: 'under_budget' | 'on_budget' | 'over_budget';
    interpretation: string;
};
/**
 * Forecasts estimate at completion using EVM
 *
 * @param budgetAtCompletion - Total project budget
 * @param earnedValue - Current earned value
 * @param actualCost - Current actual cost
 * @returns EAC forecast with multiple methods
 *
 * @example
 * ```typescript
 * const forecast = forecastEstimateAtCompletion(5000000, 2200000, 2350000);
 * ```
 */
export declare function forecastEstimateAtCompletion(budgetAtCompletion: number, earnedValue: number, actualCost: number): {
    eacCPI: number;
    eacCPISPI: number;
    eacBudget: number;
    recommendedEAC: number;
    varianceAtCompletion: number;
};
/**
 * Creates a construction milestone
 *
 * @param milestoneData - Milestone creation data
 * @returns Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await createMilestone({
 *   projectId: 'proj-123',
 *   milestoneName: 'Foundation Complete',
 *   plannedDate: new Date('2025-03-15'),
 *   budgetedValue: 500000
 * });
 * ```
 */
export declare function createMilestone(milestoneData: {
    projectId: string;
    milestoneName: string;
    description?: string;
    plannedDate: Date;
    budgetedValue: number;
    completionCriteria?: Array<{
        criterion: string;
        isMet: boolean;
    }>;
}): Promise<ConstructionMilestone>;
/**
 * Updates milestone progress
 *
 * @param milestoneId - Milestone identifier
 * @param progressData - Progress update data
 * @returns Updated milestone
 *
 * @example
 * ```typescript
 * await updateMilestoneProgress('mile-123', {
 *   percentComplete: 85,
 *   forecastDate: new Date('2025-03-18')
 * });
 * ```
 */
export declare function updateMilestoneProgress(milestoneId: string, progressData: {
    percentComplete: number;
    forecastDate?: Date;
    completionNotes?: string;
}): Promise<ConstructionMilestone>;
/**
 * Completes a milestone
 *
 * @param milestoneId - Milestone identifier
 * @param completionData - Completion details
 * @returns Completed milestone
 *
 * @example
 * ```typescript
 * await completeMilestone('mile-123', {
 *   completedBy: 'user-456',
 *   actualDate: new Date(),
 *   completionNotes: 'All criteria met, inspections passed'
 * });
 * ```
 */
export declare function completeMilestone(milestoneId: string, completionData: {
    completedBy: string;
    actualDate: Date;
    completionNotes?: string;
}): Promise<ConstructionMilestone>;
/**
 * Gets upcoming milestones
 *
 * @param projectId - Project identifier
 * @param daysAhead - Days to look ahead
 * @returns Upcoming milestones
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingMilestones('proj-123', 30);
 * ```
 */
export declare function getUpcomingMilestones(projectId: string, daysAhead?: number): Promise<ConstructionMilestone[]>;
/**
 * Tracks milestone completion percentage
 *
 * @param projectId - Project identifier
 * @returns Milestone completion summary
 *
 * @example
 * ```typescript
 * const summary = await trackMilestoneCompletion('proj-123');
 * ```
 */
export declare function trackMilestoneCompletion(projectId: string): Promise<{
    totalMilestones: number;
    completedMilestones: number;
    onTrackMilestones: number;
    atRiskMilestones: number;
    lateMilestones: number;
    completionPercentage: number;
}>;
/**
 * Creates a daily construction report
 *
 * @param reportData - Daily report data
 * @returns Created daily report
 *
 * @example
 * ```typescript
 * const report = await createDailyReport({
 *   projectId: 'proj-123',
 *   reportDate: new Date(),
 *   weatherCondition: WeatherCondition.CLEAR,
 *   temperatureHigh: 75,
 *   temperatureLow: 58,
 *   workersOnSite: 45,
 *   workPerformed: 'Completed foundation formwork on north wing...'
 * });
 * ```
 */
export declare function createDailyReport(reportData: {
    projectId: string;
    reportDate: Date;
    weatherCondition: WeatherCondition;
    temperatureHigh: number;
    temperatureLow: number;
    workersOnSite: number;
    visitorsOnSite?: number;
    workPerformed: string;
    equipmentUsed?: string;
    materialsDelivered?: string;
    issues?: string;
    safetyIncidents?: string;
    delayHours?: number;
    delayReasons?: string;
    submittedBy: string;
}): Promise<DailyReport>;
/**
 * Adds progress photos to daily report
 *
 * @param reportId - Report identifier
 * @param photos - Photo data
 * @returns Updated report
 *
 * @example
 * ```typescript
 * await addProgressPhotos('report-123', [
 *   { url: 'https://...', caption: 'Foundation work', location: 'North Wing' }
 * ]);
 * ```
 */
export declare function addProgressPhotos(reportId: string, photos: Array<{
    url: string;
    caption: string;
    location?: string;
}>): Promise<DailyReport>;
/**
 * Generates weekly progress summary
 *
 * @param projectId - Project identifier
 * @param weekEnding - Week ending date
 * @returns Weekly summary
 *
 * @example
 * ```typescript
 * const summary = await generateWeeklyProgressSummary('proj-123', new Date());
 * ```
 */
export declare function generateWeeklyProgressSummary(projectId: string, weekEnding: Date): Promise<{
    projectId: string;
    weekEnding: Date;
    percentComplete: number;
    progressThisWeek: number;
    scheduleVariance: number;
    costVariance: number;
    workersAverage: number;
    weatherDelays: number;
    safetyIncidents: number;
    majorActivities: string[];
    issuesEncountered: string[];
    plannedNextWeek: string[];
}>;
/**
 * Approves daily report
 *
 * @param reportId - Report identifier
 * @param approverId - Approver user ID
 * @returns Approved report
 *
 * @example
 * ```typescript
 * await approveDailyReport('report-123', 'manager-456');
 * ```
 */
export declare function approveDailyReport(reportId: string, approverId: string): Promise<DailyReport>;
/**
 * Generates S-curve data for project
 *
 * @param projectId - Project identifier
 * @param startDate - Project start date
 * @param endDate - Project end date
 * @returns S-curve data points
 *
 * @example
 * ```typescript
 * const sCurve = await generateSCurve('proj-123', startDate, endDate);
 * ```
 */
export declare function generateSCurve(projectId: string, startDate: Date, endDate: Date): Promise<SCurveDataPoint[]>;
/**
 * Analyzes S-curve trends
 *
 * @param sCurveData - S-curve data points
 * @returns Trend analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeSCurveTrends(sCurveData);
 * ```
 */
export declare function analyzeSCurveTrends(sCurveData: SCurveDataPoint[]): {
    currentSPI: number;
    currentCPI: number;
    trendDirection: PerformanceTrend;
    projectedCompletion: Date;
    projectedCost: number;
    recommendations: string[];
};
/**
 * Generates progress trend analysis
 *
 * @param projectId - Project identifier
 * @param periods - Number of periods to analyze
 * @returns Trend data
 *
 * @example
 * ```typescript
 * const trends = await generateProgressTrends('proj-123', 12);
 * ```
 */
export declare function generateProgressTrends(projectId: string, periods?: number): Promise<ProgressTrend[]>;
/**
 * Forecasts project completion date
 *
 * @param projectId - Project identifier
 * @param currentProgress - Current progress data
 * @returns Completion forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCompletionDate('proj-123', {
 *   percentComplete: 45,
 *   spi: 0.92
 * });
 * ```
 */
export declare function forecastCompletionDate(projectId: string, currentProgress: {
    percentComplete: number;
    spi: number;
}): Promise<{
    originalDate: Date;
    forecastDate: Date;
    daysDifference: number;
    confidence: 'high' | 'medium' | 'low';
}>;
/**
 * Analyzes performance trends
 *
 * @param trends - Historical trend data
 * @returns Trend analysis results
 *
 * @example
 * ```typescript
 * const analysis = analyzePerformanceTrends(trendData);
 * ```
 */
export declare function analyzePerformanceTrends(trends: ProgressTrend[]): {
    overallTrend: PerformanceTrend;
    averageSPI: number;
    averageCPI: number;
    volatility: 'stable' | 'moderate' | 'high';
    recommendation: string;
};
/**
 * Performs comprehensive variance analysis
 *
 * @param projectId - Project identifier
 * @param period - Analysis period
 * @returns Variance analysis by category
 *
 * @example
 * ```typescript
 * const analysis = await performVarianceAnalysis('proj-123', '2025-01');
 * ```
 */
export declare function performVarianceAnalysis(projectId: string, period: string): Promise<VarianceAnalysis[]>;
/**
 * Calculates schedule variance impact
 *
 * @param scheduleVariance - Schedule variance in days
 * @param dailyBurnRate - Daily cost burn rate
 * @returns Impact analysis
 *
 * @example
 * ```typescript
 * const impact = calculateScheduleVarianceImpact(-15, 50000);
 * ```
 */
export declare function calculateScheduleVarianceImpact(scheduleVariance: number, dailyBurnRate: number): {
    varianceDays: number;
    costImpact: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    mitigation: string;
};
/**
 * Generates progress payment application
 *
 * @param projectId - Project identifier
 * @param periodEnding - Period ending date
 * @returns Progress payment application
 *
 * @example
 * ```typescript
 * const payment = await generateProgressPayment('proj-123', new Date());
 * ```
 */
export declare function generateProgressPayment(projectId: string, periodEnding: Date): Promise<ProgressPayment>;
/**
 * Approves progress payment
 *
 * @param paymentId - Payment identifier
 * @param approverId - Approver user ID
 * @returns Approved payment
 *
 * @example
 * ```typescript
 * await approveProgressPayment('payment-123', 'user-456');
 * ```
 */
export declare function approveProgressPayment(paymentId: string, approverId: string): Promise<ProgressPayment>;
/**
 * Calculates retainage amounts
 *
 * @param totalValue - Total contract value
 * @param completedValue - Completed work value
 * @param retainageRate - Retainage percentage
 * @returns Retainage calculation
 *
 * @example
 * ```typescript
 * const retainage = calculateRetainage(5000000, 2200000, 0.10);
 * ```
 */
export declare function calculateRetainage(totalValue: number, completedValue: number, retainageRate?: number): {
    retainageRate: number;
    retainageHeld: number;
    retainageReleased: number;
    retainageBalance: number;
    percentComplete: number;
};
/**
 * Progress Tracking Controller
 * Provides RESTful API endpoints for construction progress management
 */
export declare class ProgressTrackingController {
    recordProgress(dto: RecordProgressDto): Promise<ProgressMeasurement>;
    getEarnedValue(projectId: string, asOfDate?: string): Promise<EarnedValueMetrics>;
    createMilestoneEndpoint(dto: CreateMilestoneDto): Promise<ConstructionMilestone>;
    updateMilestone(id: string, dto: UpdateMilestoneProgressDto): Promise<ConstructionMilestone>;
    createReport(dto: CreateDailyReportDto): Promise<DailyReport>;
    addPhotos(id: string, photos: AddProgressPhotoDto[]): Promise<DailyReport>;
    getSCurve(projectId: string, startDate: string, endDate: string): Promise<SCurveDataPoint[]>;
    getTrends(projectId: string, periods?: number): Promise<ProgressTrend[]>;
    getVariance(projectId: string, period: string): Promise<VarianceAnalysis[]>;
    generatePayment(projectId: string, periodEnding: string): Promise<ProgressPayment>;
    getWeeklySummary(projectId: string, weekEnding: string): Promise<{
        projectId: string;
        weekEnding: Date;
        percentComplete: number;
        progressThisWeek: number;
        scheduleVariance: number;
        costVariance: number;
        workersAverage: number;
        weatherDelays: number;
        safetyIncidents: number;
        majorActivities: string[];
        issuesEncountered: string[];
        plannedNextWeek: string[];
    }>;
}
declare const _default: {
    recordProgressMeasurement: typeof recordProgressMeasurement;
    calculateActivityEarnedValue: typeof calculateActivityEarnedValue;
    verifyProgressMeasurement: typeof verifyProgressMeasurement;
    getActivityProgressHistory: typeof getActivityProgressHistory;
    calculateEarnedValue: typeof calculateEarnedValue;
    calculateSchedulePerformanceIndex: typeof calculateSchedulePerformanceIndex;
    calculateCostPerformanceIndex: typeof calculateCostPerformanceIndex;
    forecastEstimateAtCompletion: typeof forecastEstimateAtCompletion;
    createMilestone: typeof createMilestone;
    updateMilestoneProgress: typeof updateMilestoneProgress;
    completeMilestone: typeof completeMilestone;
    getUpcomingMilestones: typeof getUpcomingMilestones;
    trackMilestoneCompletion: typeof trackMilestoneCompletion;
    createDailyReport: typeof createDailyReport;
    addProgressPhotos: typeof addProgressPhotos;
    generateWeeklyProgressSummary: typeof generateWeeklyProgressSummary;
    approveDailyReport: typeof approveDailyReport;
    generateSCurve: typeof generateSCurve;
    analyzeSCurveTrends: typeof analyzeSCurveTrends;
    generateProgressTrends: typeof generateProgressTrends;
    forecastCompletionDate: typeof forecastCompletionDate;
    analyzePerformanceTrends: typeof analyzePerformanceTrends;
    performVarianceAnalysis: typeof performVarianceAnalysis;
    calculateScheduleVarianceImpact: typeof calculateScheduleVarianceImpact;
    generateProgressPayment: typeof generateProgressPayment;
    approveProgressPayment: typeof approveProgressPayment;
    calculateRetainage: typeof calculateRetainage;
    ProgressMeasurement: typeof ProgressMeasurement;
    DailyReport: typeof DailyReport;
    ConstructionMilestone: typeof ConstructionMilestone;
    ProgressTrackingController: typeof ProgressTrackingController;
};
export default _default;
//# sourceMappingURL=construction-progress-tracking-kit.d.ts.map