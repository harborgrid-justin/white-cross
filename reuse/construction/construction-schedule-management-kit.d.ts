/**
 * LOC: CONST-SM-001
 * File: /reuse/construction/construction-schedule-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable construction utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Project scheduling modules
 *   - Resource management systems
 *   - Schedule analytics platforms
 */
/**
 * File: /reuse/construction/construction-schedule-management-kit.ts
 * Locator: WC-CONST-SM-001
 * Purpose: Enterprise-grade Construction Schedule Management - CPM scheduling, critical path analysis, resource leveling, schedule compression, risk analysis
 *
 * Upstream: Independent utility module for construction schedule operations
 * Downstream: ../backend/construction/*, schedule controllers, CPM engines, resource services, reporting modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ functions for schedule management competing with Primavera P6, Microsoft Project enterprise scheduling
 *
 * LLM Context: Comprehensive construction schedule management utilities for production-ready project management applications.
 * Provides CPM schedule development, critical path analysis, schedule updates, baseline comparison, look-ahead scheduling,
 * constraint analysis, resource leveling, schedule compression (crashing/fast-tracking), schedule risk analysis, float management,
 * milestone tracking, schedule performance metrics, delay analysis, and schedule recovery planning.
 */
import { Sequelize, Transaction } from 'sequelize';
import { ActivityRelationship } from './models/activity-relationship.model';
/**
 * Creates schedule activity with validation.
 *
 * @param {ScheduleActivityData} activityData - Activity data
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created activity
 *
 * @example
 * ```typescript
 * const activity = await createScheduleActivity({
 *   projectId: 'PRJ001',
 *   activityId: 'ACT001',
 *   activityCode: 'A1010',
 *   activityName: 'Site Mobilization',
 *   duration: 5,
 *   durationType: 'working_days',
 *   plannedStartDate: new Date(),
 *   status: 'not_started',
 *   percentComplete: 0
 * }, ScheduleActivity);
 * ```
 */
export declare const createScheduleActivity: (activityData: ScheduleActivityData, ScheduleActivity: any, transaction?: Transaction) => Promise<any>;
/**
 * Calculates finish date based on start date and duration.
 *
 * @param {Date} startDate - Start date
 * @param {number} duration - Duration
 * @param {string} durationType - Duration type
 * @returns {Date} Calculated finish date
 *
 * @example
 * ```typescript
 * const finish = calculateFinishDate(new Date(), 10, 'working_days');
 * console.log(`Finish date: ${finish.toISOString()}`);
 * ```
 */
export declare const calculateFinishDate: (startDate: Date, duration: number, durationType: string) => Date;
/**
 * Creates activity relationship (dependency).
 *
 * @param {ActivityRelationship} relationshipData - Relationship data
 * @param {Model} ActivityRelationship - ActivityRelationship model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created relationship
 *
 * @example
 * ```typescript
 * const rel = await createActivityRelationship({
 *   projectId: 'PRJ001',
 *   predecessorActivityId: 'ACT001',
 *   successorActivityId: 'ACT002',
 *   relationshipType: 'FS',
 *   lagDays: 2
 * }, ActivityRelationship);
 * ```
 */
export declare const createActivityRelationship: (relationshipData: ActivityRelationship, ActivityRelationship: any, transaction?: Transaction) => Promise<any>;
/**
 * Validates schedule network logic for loops and orphans.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Model} ActivityRelationship - ActivityRelationship model
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateScheduleNetwork('PRJ001', ScheduleActivity, ActivityRelationship);
 * if (!validation.valid) console.log('Errors:', validation.errors);
 * ```
 */
export declare const validateScheduleNetwork: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Builds schedule network graph for CPM analysis.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Model} ActivityRelationship - ActivityRelationship model
 * @returns {Promise<any>} Network graph structure
 *
 * @example
 * ```typescript
 * const network = await buildScheduleNetwork('PRJ001', ScheduleActivity, ActivityRelationship);
 * console.log(`Network has ${network.nodes.length} activities`);
 * ```
 */
export declare const buildScheduleNetwork: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any>;
/**
 * Performs forward pass CPM calculation (early dates).
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Model} ActivityRelationship - ActivityRelationship model
 * @returns {Promise<any[]>} Activities with early dates
 *
 * @example
 * ```typescript
 * const activities = await performForwardPass('PRJ001', ScheduleActivity, ActivityRelationship);
 * activities.forEach(a => console.log(`${a.activityId}: ES=${a.earlyStartDate}`));
 * ```
 */
export declare const performForwardPass: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any[]>;
/**
 * Performs backward pass CPM calculation (late dates).
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Model} ActivityRelationship - ActivityRelationship model
 * @returns {Promise<any[]>} Activities with late dates
 *
 * @example
 * ```typescript
 * const activities = await performBackwardPass('PRJ001', ScheduleActivity, ActivityRelationship);
 * activities.forEach(a => console.log(`${a.activityId}: LF=${a.lateFinishDate}`));
 * ```
 */
export declare const performBackwardPass: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any[]>;
/**
 * Calculates total float and free float for all activities.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Model} ActivityRelationship - ActivityRelationship model
 * @returns {Promise<any[]>} Activities with float values
 *
 * @example
 * ```typescript
 * const activities = await calculateFloat('PRJ001', ScheduleActivity, ActivityRelationship);
 * activities.forEach(a => console.log(`${a.activityId}: TF=${a.totalFloat}`));
 * ```
 */
export declare const calculateFloat: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any[]>;
/**
 * Identifies critical path through the schedule.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Model} ActivityRelationship - ActivityRelationship model
 * @returns {Promise<CriticalPathResult>} Critical path analysis
 *
 * @example
 * ```typescript
 * const cp = await identifyCriticalPath('PRJ001', ScheduleActivity, ActivityRelationship);
 * console.log(`Critical path: ${cp.criticalPath.join(' -> ')}`);
 * console.log(`Duration: ${cp.totalDuration} days`);
 * ```
 */
export declare const identifyCriticalPath: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<CriticalPathResult>;
/**
 * Analyzes driving relationships on critical path.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Model} ActivityRelationship - ActivityRelationship model
 * @returns {Promise<any[]>} Driving relationships
 *
 * @example
 * ```typescript
 * const driving = await analyzeDrivingRelationships('PRJ001', ScheduleActivity, ActivityRelationship);
 * ```
 */
export declare const analyzeDrivingRelationships: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any[]>;
/**
 * Updates activity progress and recalculates schedule.
 *
 * @param {string} activityId - Activity ID
 * @param {number} percentComplete - Percent complete
 * @param {Date} [actualStartDate] - Actual start date
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any>} Updated activity
 *
 * @example
 * ```typescript
 * const updated = await updateActivityProgress('ACT001', 50, new Date(), ScheduleActivity);
 * ```
 */
export declare const updateActivityProgress: (activityId: string, percentComplete: number, actualStartDate: Date | undefined, ScheduleActivity: any) => Promise<any>;
/**
 * Sets activity baseline from current schedule.
 *
 * @param {string} projectId - Project ID
 * @param {string} baselineName - Baseline name
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<number>} Number of activities baselined
 *
 * @example
 * ```typescript
 * const count = await setScheduleBaseline('PRJ001', 'Approved Baseline', ScheduleActivity);
 * console.log(`Baselined ${count} activities`);
 * ```
 */
export declare const setScheduleBaseline: (projectId: string, baselineName: string, ScheduleActivity: any) => Promise<number>;
/**
 * Compares current schedule to baseline.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await compareToBaseline('PRJ001', ScheduleActivity);
 * console.log(`Schedule variance: ${variance.totalVarianceDays} days`);
 * ```
 */
export declare const compareToBaseline: (projectId: string, ScheduleActivity: any) => Promise<any>;
/**
 * Forecasts project completion date based on current progress.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any>} Completion forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCompletion('PRJ001', ScheduleActivity);
 * console.log(`Forecast completion: ${forecast.forecastDate}`);
 * ```
 */
export declare const forecastCompletion: (projectId: string, ScheduleActivity: any) => Promise<any>;
/**
 * Recalculates entire schedule after updates.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Model} ActivityRelationship - ActivityRelationship model
 * @returns {Promise<any>} Recalculation results
 *
 * @example
 * ```typescript
 * const results = await recalculateSchedule('PRJ001', ScheduleActivity, ActivityRelationship);
 * console.log(`Recalculated ${results.activitiesUpdated} activities`);
 * ```
 */
export declare const recalculateSchedule: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any>;
/**
 * Generates look-ahead schedule for upcoming period.
 *
 * @param {string} projectId - Project ID
 * @param {number} weeksAhead - Number of weeks to look ahead
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<LookAheadSchedule[]>} Look-ahead schedules by week
 *
 * @example
 * ```typescript
 * const lookahead = await generateLookAheadSchedule('PRJ001', 4, ScheduleActivity);
 * lookahead.forEach(week => {
 *   console.log(`Week ${week.weekStartDate}: ${week.activities.length} activities`);
 * });
 * ```
 */
export declare const generateLookAheadSchedule: (projectId: string, weeksAhead: number, ScheduleActivity: any) => Promise<LookAheadSchedule[]>;
/**
 * Identifies constraints affecting upcoming work.
 *
 * @param {string} projectId - Project ID
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<ScheduleConstraint[]>} Identified constraints
 *
 * @example
 * ```typescript
 * const constraints = await identifyUpcomingConstraints('PRJ001', startDate, endDate, ScheduleActivity);
 * ```
 */
export declare const identifyUpcomingConstraints: (projectId: string, startDate: Date, endDate: Date, ScheduleActivity: any) => Promise<ScheduleConstraint[]>;
/**
 * Analyzes resource availability for look-ahead period.
 *
 * @param {string} projectId - Project ID
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} ResourceAssignment - ResourceAssignment model
 * @returns {Promise<any[]>} Resource availability analysis
 *
 * @example
 * ```typescript
 * const availability = await analyzeResourceAvailability('PRJ001', startDate, endDate, ResourceAssignment);
 * ```
 */
export declare const analyzeResourceAvailability: (projectId: string, startDate: Date, endDate: Date, ResourceAssignment: any) => Promise<any[]>;
/**
 * Creates weekly work plan from look-ahead schedule.
 *
 * @param {LookAheadSchedule} lookahead - Look-ahead data
 * @returns {string} Formatted work plan
 *
 * @example
 * ```typescript
 * const workPlan = createWeeklyWorkPlan(lookaheadData);
 * console.log(workPlan);
 * ```
 */
export declare const createWeeklyWorkPlan: (lookahead: LookAheadSchedule) => string;
/**
 * Tracks lookahead planning reliability metrics.
 *
 * @param {string} projectId - Project ID
 * @param {number} weeks - Number of weeks to analyze
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any>} Reliability metrics
 *
 * @example
 * ```typescript
 * const reliability = await trackLookaheadReliability('PRJ001', 4, ScheduleActivity);
 * console.log(`PPC: ${reliability.percentPlanComplete}%`);
 * ```
 */
export declare const trackLookaheadReliability: (projectId: string, weeks: number, ScheduleActivity: any) => Promise<any>;
/**
 * Performs resource leveling to resolve overallocations.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Model} ResourceAssignment - ResourceAssignment model
 * @returns {Promise<ResourceLevelingResult>} Leveling results
 *
 * @example
 * ```typescript
 * const leveling = await performResourceLeveling('PRJ001', ScheduleActivity, ResourceAssignment);
 * console.log(`Leveling delayed schedule by ${leveling.scheduleImpact} days`);
 * ```
 */
export declare const performResourceLeveling: (projectId: string, ScheduleActivity: any, ResourceAssignment: any) => Promise<ResourceLevelingResult>;
/**
 * Identifies resource overallocations in schedule.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ResourceAssignment - ResourceAssignment model
 * @returns {Promise<any[]>} Overallocated resources
 *
 * @example
 * ```typescript
 * const overallocations = await identifyResourceOverallocations('PRJ001', ResourceAssignment);
 * ```
 */
export declare const identifyResourceOverallocations: (projectId: string, ResourceAssignment: any) => Promise<any[]>;
/**
 * Generates resource histogram for visualization.
 *
 * @param {string} projectId - Project ID
 * @param {string} resourceId - Resource ID
 * @param {Model} ResourceAssignment - ResourceAssignment model
 * @returns {Promise<any[]>} Histogram data points
 *
 * @example
 * ```typescript
 * const histogram = await generateResourceHistogram('PRJ001', 'RES001', ResourceAssignment);
 * ```
 */
export declare const generateResourceHistogram: (projectId: string, resourceId: string, ResourceAssignment: any) => Promise<any[]>;
/**
 * Optimizes resource utilization across activities.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Model} ResourceAssignment - ResourceAssignment model
 * @returns {Promise<any>} Optimization results
 *
 * @example
 * ```typescript
 * const optimization = await optimizeResourceUtilization('PRJ001', ScheduleActivity, ResourceAssignment);
 * ```
 */
export declare const optimizeResourceUtilization: (projectId: string, ScheduleActivity: any, ResourceAssignment: any) => Promise<any>;
/**
 * Exports resource loading report.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ResourceAssignment - ResourceAssignment model
 * @returns {Promise<string>} CSV formatted report
 *
 * @example
 * ```typescript
 * const report = await exportResourceLoadingReport('PRJ001', ResourceAssignment);
 * fs.writeFileSync('resource-loading.csv', report);
 * ```
 */
export declare const exportResourceLoadingReport: (projectId: string, ResourceAssignment: any) => Promise<string>;
/**
 * Analyzes schedule compression options (crashing/fast-tracking).
 *
 * @param {string} projectId - Project ID
 * @param {number} targetDuration - Target duration reduction (days)
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<ScheduleCompressionAnalysis>} Compression analysis
 *
 * @example
 * ```typescript
 * const compression = await analyzeScheduleCompression('PRJ001', 30, ScheduleActivity);
 * console.log(`Cost impact: $${compression.totalCostImpact}`);
 * ```
 */
export declare const analyzeScheduleCompression: (projectId: string, targetDuration: number, ScheduleActivity: any) => Promise<ScheduleCompressionAnalysis>;
/**
 * Applies crashing to critical path activities.
 *
 * @param {string} projectId - Project ID
 * @param {string[]} activityIds - Activities to crash
 * @param {number[]} durationReductions - Duration reductions per activity
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any[]>} Crashed activities
 *
 * @example
 * ```typescript
 * const crashed = await crashActivities('PRJ001', ['ACT001', 'ACT002'], [3, 5], ScheduleActivity);
 * ```
 */
export declare const crashActivities: (projectId: string, activityIds: string[], durationReductions: number[], ScheduleActivity: any) => Promise<any[]>;
/**
 * Identifies fast-tracking opportunities (parallel activities).
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Model} ActivityRelationship - ActivityRelationship model
 * @returns {Promise<any[]>} Fast-tracking opportunities
 *
 * @example
 * ```typescript
 * const opportunities = await identifyFastTrackingOpportunities('PRJ001', ScheduleActivity, ActivityRelationship);
 * ```
 */
export declare const identifyFastTrackingOpportunities: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any[]>;
/**
 * Calculates cost-time tradeoff for compression.
 *
 * @param {number} originalCost - Original activity cost
 * @param {number} originalDuration - Original duration
 * @param {number} crashedCost - Crashed cost
 * @param {number} crashedDuration - Crashed duration
 * @returns {any} Tradeoff analysis
 *
 * @example
 * ```typescript
 * const tradeoff = calculateCostTimeTradeoff(100000, 20, 150000, 15);
 * console.log(`Cost slope: $${tradeoff.costSlope}/day`);
 * ```
 */
export declare const calculateCostTimeTradeoff: (originalCost: number, originalDuration: number, crashedCost: number, crashedDuration: number) => any;
/**
 * Simulates schedule compression impact on project.
 *
 * @param {string} projectId - Project ID
 * @param {ScheduleCompressionAnalysis} compressionPlan - Compression plan
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any>} Simulation results
 *
 * @example
 * ```typescript
 * const simulation = await simulateCompressionImpact('PRJ001', compressionPlan, ScheduleActivity);
 * ```
 */
export declare const simulateCompressionImpact: (projectId: string, compressionPlan: ScheduleCompressionAnalysis, ScheduleActivity: any) => Promise<any>;
/**
 * Identifies schedule risks and uncertainties.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<ScheduleRisk[]>} Identified risks
 *
 * @example
 * ```typescript
 * const risks = await identifyScheduleRisks('PRJ001', ScheduleActivity);
 * risks.forEach(r => console.log(`Risk: ${r.description}, Score: ${r.riskScore}`));
 * ```
 */
export declare const identifyScheduleRisks: (projectId: string, ScheduleActivity: any) => Promise<ScheduleRisk[]>;
/**
 * Performs Monte Carlo schedule risk simulation.
 *
 * @param {string} projectId - Project ID
 * @param {number} iterations - Number of simulation iterations
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any>} Simulation results
 *
 * @example
 * ```typescript
 * const simulation = await performMonteCarloSimulation('PRJ001', 1000, ScheduleActivity);
 * console.log(`P50 completion: ${simulation.p50CompletionDate}`);
 * ```
 */
export declare const performMonteCarloSimulation: (projectId: string, iterations: number, ScheduleActivity: any) => Promise<any>;
/**
 * Calculates schedule risk exposure.
 *
 * @param {ScheduleRisk[]} risks - Identified risks
 * @returns {any} Risk exposure calculation
 *
 * @example
 * ```typescript
 * const exposure = calculateScheduleRiskExposure(risks);
 * console.log(`Total exposure: ${exposure.totalExposureDays} days`);
 * ```
 */
export declare const calculateScheduleRiskExposure: (risks: ScheduleRisk[]) => any;
/**
 * Develops risk mitigation strategies for schedule.
 *
 * @param {ScheduleRisk[]} risks - Identified risks
 * @param {string} projectId - Project ID
 * @returns {any[]} Mitigation strategies
 *
 * @example
 * ```typescript
 * const strategies = developRiskMitigationStrategies(risks, 'PRJ001');
 * ```
 */
export declare const developRiskMitigationStrategies: (risks: ScheduleRisk[], projectId: string) => any[];
/**
 * Tracks risk mitigation effectiveness over time.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any>} Mitigation tracking
 *
 * @example
 * ```typescript
 * const tracking = await trackRiskMitigationEffectiveness('PRJ001', ScheduleActivity);
 * ```
 */
export declare const trackRiskMitigationEffectiveness: (projectId: string, ScheduleActivity: any) => Promise<any>;
/**
 * Creates project milestone with dependencies.
 *
 * @param {MilestoneData} milestoneData - Milestone data
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any>} Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await createMilestone({
 *   projectId: 'PRJ001',
 *   milestoneId: 'MS001',
 *   milestoneName: 'Foundation Complete',
 *   plannedDate: new Date('2024-06-30'),
 *   importance: 'critical',
 *   contractual: true
 * }, ScheduleActivity);
 * ```
 */
export declare const createMilestone: (milestoneData: MilestoneData, ScheduleActivity: any) => Promise<any>;
/**
 * Tracks milestone achievement status.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any[]>} Milestone statuses
 *
 * @example
 * ```typescript
 * const milestones = await trackMilestones('PRJ001', ScheduleActivity);
 * milestones.forEach(m => console.log(`${m.milestoneName}: ${m.status}`));
 * ```
 */
export declare const trackMilestones: (projectId: string, ScheduleActivity: any) => Promise<any[]>;
/**
 * Generates milestone trend analysis.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any>} Trend analysis
 *
 * @example
 * ```typescript
 * const trend = await generateMilestoneTrendAnalysis('PRJ001', ScheduleActivity);
 * console.log(`On-time rate: ${trend.onTimeRate}%`);
 * ```
 */
export declare const generateMilestoneTrendAnalysis: (projectId: string, ScheduleActivity: any) => Promise<any>;
/**
 * Forecasts upcoming milestone dates.
 *
 * @param {string} projectId - Project ID
 * @param {number} daysAhead - Days to forecast
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any[]>} Forecasted milestones
 *
 * @example
 * ```typescript
 * const upcoming = await forecastMilestoneDates('PRJ001', 90, ScheduleActivity);
 * ```
 */
export declare const forecastMilestoneDates: (projectId: string, daysAhead: number, ScheduleActivity: any) => Promise<any[]>;
/**
 * Generates milestone report for stakeholders.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<string>} Milestone report
 *
 * @example
 * ```typescript
 * const report = await generateMilestoneReport('PRJ001', ScheduleActivity);
 * console.log(report);
 * ```
 */
export declare const generateMilestoneReport: (projectId: string, ScheduleActivity: any) => Promise<string>;
/**
 * Calculates overall schedule performance metrics.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Model} ActivityRelationship - ActivityRelationship model
 * @returns {Promise<SchedulePerformanceMetrics>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateSchedulePerformance('PRJ001', ScheduleActivity, ActivityRelationship);
 * console.log(`SPI: ${metrics.schedulePerformanceIndex}`);
 * ```
 */
export declare const calculateSchedulePerformance: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<SchedulePerformanceMetrics>;
/**
 * Generates schedule performance index (SPI) trend.
 *
 * @param {string} projectId - Project ID
 * @param {number} periods - Number of periods
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any[]>} SPI trend data
 *
 * @example
 * ```typescript
 * const trend = await generateSPITrend('PRJ001', 12, ScheduleActivity);
 * ```
 */
export declare const generateSPITrend: (projectId: string, periods: number, ScheduleActivity: any) => Promise<any[]>;
/**
 * Analyzes schedule variance by discipline.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any[]>} Variance by discipline
 *
 * @example
 * ```typescript
 * const variance = await analyzeScheduleVarianceByDiscipline('PRJ001', ScheduleActivity);
 * ```
 */
export declare const analyzeScheduleVarianceByDiscipline: (projectId: string, ScheduleActivity: any) => Promise<any[]>;
/**
 * Exports comprehensive schedule performance report.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @param {Model} ActivityRelationship - ActivityRelationship model
 * @returns {Promise<string>} Performance report
 *
 * @example
 * ```typescript
 * const report = await exportSchedulePerformanceReport('PRJ001', ScheduleActivity, ActivityRelationship);
 * fs.writeFileSync('schedule-performance.txt', report);
 * ```
 */
export declare const exportSchedulePerformanceReport: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<string>;
/**
 * Generates schedule recovery plan for delayed projects.
 *
 * @param {string} projectId - Project ID
 * @param {number} targetRecoveryDays - Days to recover
 * @param {Model} ScheduleActivity - ScheduleActivity model
 * @returns {Promise<any>} Recovery plan
 *
 * @example
 * ```typescript
 * const recovery = await generateScheduleRecoveryPlan('PRJ001', 15, ScheduleActivity);
 * console.log('Recovery actions:', recovery.actions);
 * ```
 */
export declare const generateScheduleRecoveryPlan: (projectId: string, targetRecoveryDays: number, ScheduleActivity: any) => Promise<any>;
/**
 * NestJS Injectable service for Construction Schedule Management.
 *
 * @example
 * ```typescript
 * @Controller('schedule')
 * export class ScheduleController {
 *   constructor(private readonly scheduleService: ScheduleManagementService) {}
 *
 *   @Post('activities')
 *   async createActivity(@Body() data: ScheduleActivityData) {
 *     return this.scheduleService.createActivity(data);
 *   }
 * }
 * ```
 */
export declare class ScheduleManagementService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createActivity(data: ScheduleActivityData): Promise<any>;
    calculateCPM(projectId: string): Promise<CriticalPathResult>;
    generateLookahead(projectId: string, weeks: number): Promise<LookAheadSchedule[]>;
    analyzePerformance(projectId: string): Promise<SchedulePerformanceMetrics>;
}
/**
 * Default export with all schedule management utilities.
 */
declare const _default: {
    createScheduleActivityModel: any;
    createActivityRelationshipModel: any;
    createResourceAssignmentModel: any;
    createScheduleActivity: (activityData: ScheduleActivityData, ScheduleActivity: any, transaction?: Transaction) => Promise<any>;
    calculateFinishDate: (startDate: Date, duration: number, durationType: string) => Date;
    createActivityRelationship: (relationshipData: ActivityRelationship, ActivityRelationship: any, transaction?: Transaction) => Promise<any>;
    validateScheduleNetwork: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    buildScheduleNetwork: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any>;
    performForwardPass: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any[]>;
    performBackwardPass: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any[]>;
    calculateFloat: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any[]>;
    identifyCriticalPath: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<CriticalPathResult>;
    analyzeDrivingRelationships: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any[]>;
    updateActivityProgress: (activityId: string, percentComplete: number, actualStartDate: Date | undefined, ScheduleActivity: any) => Promise<any>;
    setScheduleBaseline: (projectId: string, baselineName: string, ScheduleActivity: any) => Promise<number>;
    compareToBaseline: (projectId: string, ScheduleActivity: any) => Promise<any>;
    forecastCompletion: (projectId: string, ScheduleActivity: any) => Promise<any>;
    recalculateSchedule: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any>;
    generateLookAheadSchedule: (projectId: string, weeksAhead: number, ScheduleActivity: any) => Promise<LookAheadSchedule[]>;
    identifyUpcomingConstraints: (projectId: string, startDate: Date, endDate: Date, ScheduleActivity: any) => Promise<ScheduleConstraint[]>;
    analyzeResourceAvailability: (projectId: string, startDate: Date, endDate: Date, ResourceAssignment: any) => Promise<any[]>;
    createWeeklyWorkPlan: (lookahead: LookAheadSchedule) => string;
    trackLookaheadReliability: (projectId: string, weeks: number, ScheduleActivity: any) => Promise<any>;
    performResourceLeveling: (projectId: string, ScheduleActivity: any, ResourceAssignment: any) => Promise<ResourceLevelingResult>;
    identifyResourceOverallocations: (projectId: string, ResourceAssignment: any) => Promise<any[]>;
    generateResourceHistogram: (projectId: string, resourceId: string, ResourceAssignment: any) => Promise<any[]>;
    optimizeResourceUtilization: (projectId: string, ScheduleActivity: any, ResourceAssignment: any) => Promise<any>;
    exportResourceLoadingReport: (projectId: string, ResourceAssignment: any) => Promise<string>;
    analyzeScheduleCompression: (projectId: string, targetDuration: number, ScheduleActivity: any) => Promise<ScheduleCompressionAnalysis>;
    crashActivities: (projectId: string, activityIds: string[], durationReductions: number[], ScheduleActivity: any) => Promise<any[]>;
    identifyFastTrackingOpportunities: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<any[]>;
    calculateCostTimeTradeoff: (originalCost: number, originalDuration: number, crashedCost: number, crashedDuration: number) => any;
    simulateCompressionImpact: (projectId: string, compressionPlan: ScheduleCompressionAnalysis, ScheduleActivity: any) => Promise<any>;
    identifyScheduleRisks: (projectId: string, ScheduleActivity: any) => Promise<ScheduleRisk[]>;
    performMonteCarloSimulation: (projectId: string, iterations: number, ScheduleActivity: any) => Promise<any>;
    calculateScheduleRiskExposure: (risks: ScheduleRisk[]) => any;
    developRiskMitigationStrategies: (risks: ScheduleRisk[], projectId: string) => any[];
    trackRiskMitigationEffectiveness: (projectId: string, ScheduleActivity: any) => Promise<any>;
    createMilestone: (milestoneData: MilestoneData, ScheduleActivity: any) => Promise<any>;
    trackMilestones: (projectId: string, ScheduleActivity: any) => Promise<any[]>;
    generateMilestoneTrendAnalysis: (projectId: string, ScheduleActivity: any) => Promise<any>;
    forecastMilestoneDates: (projectId: string, daysAhead: number, ScheduleActivity: any) => Promise<any[]>;
    generateMilestoneReport: (projectId: string, ScheduleActivity: any) => Promise<string>;
    calculateSchedulePerformance: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<SchedulePerformanceMetrics>;
    generateSPITrend: (projectId: string, periods: number, ScheduleActivity: any) => Promise<any[]>;
    analyzeScheduleVarianceByDiscipline: (projectId: string, ScheduleActivity: any) => Promise<any[]>;
    exportSchedulePerformanceReport: (projectId: string, ScheduleActivity: any, ActivityRelationship: any) => Promise<string>;
    generateScheduleRecoveryPlan: (projectId: string, targetRecoveryDays: number, ScheduleActivity: any) => Promise<any>;
    ScheduleManagementService: typeof ScheduleManagementService;
};
export default _default;
//# sourceMappingURL=construction-schedule-management-kit.d.ts.map