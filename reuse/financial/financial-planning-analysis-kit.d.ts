/**
 * ============================================================================
 * WHITE CROSS - FINANCIAL PLANNING & ANALYSIS KIT
 * ============================================================================
 *
 * Enterprise-grade FP&A (Financial Planning & Analysis) toolkit competing with
 * Anaplan, Workday Adaptive, and Planful. Comprehensive financial planning,
 * driver-based modeling, scenario analysis, rolling forecasts, and reporting.
 *
 * @module      reuse/financial/financial-planning-analysis-kit
 * @version     1.0.0
 * @since       2025-Q1
 * @status      Production-Ready
 * @locCode     FIN-FPA-001
 *
 * ============================================================================
 * CAPABILITIES
 * ============================================================================
 *
 * Financial Planning:
 * - Create multi-year financial plans with versioning
 * - Set financial targets and milestones
 * - Define assumptions for revenue, COGS, OpEx drivers
 * - Version control with rollback capability
 *
 * Driver-Based Planning:
 * - Define business drivers (headcount, revenue per user, COGS %, etc.)
 * - Link drivers to financial line items
 * - Model complex relationships with formulas
 * - Update and track driver changes
 *
 * Scenario Modeling:
 * - Create best case, worst case, and custom scenarios
 * - Compare multiple plans side-by-side
 * - What-if analysis with parameter changes
 * - Sensitivity testing across key assumptions
 *
 * Variance Analysis:
 * - Actual vs plan variance calculation and reporting
 * - Driver-based variance explanation
 * - Categorize variances by type and driver
 * - Executive reporting summaries
 *
 * KPI Management:
 * - Define KPIs with targets and thresholds
 * - Track KPI performance against targets
 * - Alert on threshold breaches
 * - KPI trend analysis
 *
 * Rolling Forecasts:
 * - Create rolling 12/24 month forecasts
 * - Monthly updates with new actuals
 * - Adjust assumptions dynamically
 * - Trend analysis and reforecasting
 *
 * Financial Modeling:
 * - Build complex financial models with dependencies
 * - Calculate key metrics (margins, ratios, etc.)
 * - Stress testing with parameter variations
 * - Optimization with constraints
 *
 * Capital Planning:
 * - Plan capital expenditures by project
 * - Prioritize projects by NPV, IRR, payback
 * - Track capex spending and commitments
 * - ROI analysis and business case tracking
 *
 * Headcount Planning:
 * - Plan headcount by department, level, location
 * - Calculate compensation and benefits costs
 * - Optimize allocation across functions
 * - Track vs plan variances
 *
 * FP&A Reporting:
 * - Generate management reports and dashboards
 * - Create board packages with variance analysis
 * - Investor relations reports and projections
 * - Executive dashboards with KPI tracking
 *
 * ============================================================================
 * TECHNICAL SPECIFICATIONS
 * ============================================================================
 *
 * Dependencies:
 * - NestJS 10.x (Dependency Injection, Services)
 * - Sequelize 6.x (ORM with complex queries)
 * - TypeScript 5.x (Type safety)
 * - decimal.js (High-precision financial math)
 *
 * Database Support:
 * - PostgreSQL 14+ (JSONB, Window Functions)
 * - MySQL 8.0+ (JSON support)
 * - SQL Server 2019+ (Enterprise compatibility)
 *
 * Performance Targets:
 * - Plan creation: < 500ms
 * - Scenario comparison: < 2s for 5 scenarios
 * - Variance analysis: < 3s for fiscal year
 * - Rolling forecast: < 5s for 24 months
 *
 * ============================================================================
 * COMPLIANCE & STANDARDS
 * ============================================================================
 *
 * - GAAP/IFRS financial reporting alignment
 * - SOX compliance for approvals and audit trails
 * - Multi-currency support with FX handling
 * - Role-based access control
 * - Full audit logging of changes
 *
 * ============================================================================
 * @author      White Cross Development Team
 * @copyright   2025 White Cross Platform
 * @license     Proprietary
 * ============================================================================
 */
import { Sequelize } from 'sequelize';
import { Decimal } from 'decimal.js';
/**
 * Financial plan status
 */
export declare enum PlanStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    APPROVED = "approved",
    ACTIVE = "active",
    ARCHIVED = "archived"
}
/**
 * Scenario types
 */
export declare enum ScenarioType {
    BEST_CASE = "best_case",
    WORST_CASE = "worst_case",
    MOST_LIKELY = "most_likely",
    CUSTOM = "custom"
}
/**
 * Financial plan interface
 */
export interface FinancialPlan {
    id?: string;
    name: string;
    organizationId: string;
    fiscalYear: number;
    status: PlanStatus;
    version: number;
    startDate: Date | string;
    endDate: Date | string;
    createdBy: string;
    approvedBy?: string;
    metadata?: Record<string, any>;
}
/**
 * Plan target
 */
export interface PlanTarget {
    planId: string;
    metric: string;
    targetValue: string | Decimal;
    period: string;
    threshold?: string | Decimal;
    notes?: string;
}
/**
 * Business driver
 */
export interface BusinessDriver {
    id?: string;
    planId: string;
    name: string;
    category: string;
    baseValue: string | Decimal;
    unit: string;
    formula?: string;
    metadata?: Record<string, any>;
}
/**
 * Driver linkage to financials
 */
export interface DriverLinkage {
    driverId: string;
    lineItemId: string;
    multiplier: string | Decimal;
    relationship: string;
}
/**
 * Scenario
 */
export interface PlanScenario {
    id?: string;
    planId: string;
    name: string;
    type: ScenarioType;
    assumptions: Record<string, any>;
    probability?: number;
}
/**
 * KPI definition
 */
export interface KPIDefinition {
    id?: string;
    planId: string;
    name: string;
    metric: string;
    target: string | Decimal;
    threshold: string | Decimal;
    period: string;
}
/**
 * Variance explanation
 */
export interface VarianceExplanation {
    metric: string;
    planned: Decimal;
    actual: Decimal;
    variance: Decimal;
    drivers: Array<{
        driver: string;
        impact: Decimal;
    }>;
}
/**
 * Create a new financial plan with version tracking.
 * @param sequelize - Sequelize instance
 * @param params - Plan parameters
 * @returns Created plan
 */
export declare function createFinancialPlan(sequelize: Sequelize, params: FinancialPlan): Promise<any>;
/**
 * Set financial targets for plan metrics.
 * @param sequelize - Sequelize instance
 * @param targets - Array of targets
 * @returns Number of targets created
 */
export declare function setFinancialTargets(sequelize: Sequelize, targets: PlanTarget[]): Promise<number>;
/**
 * Define planning assumptions (revenue growth, COGS %, etc.).
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param assumptions - Key-value assumptions
 * @returns Assumption record
 */
export declare function defineAssumptions(sequelize: Sequelize, planId: string, assumptions: Record<string, any>): Promise<any>;
/**
 * Version plan for change tracking and rollback.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID to version
 * @param changeDescription - What changed
 * @returns New version record
 */
export declare function versionPlan(sequelize: Sequelize, planId: string, changeDescription: string): Promise<any>;
/**
 * Define business drivers for model-based planning.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param drivers - Drivers array
 * @returns Created drivers
 */
export declare function defineBusinessDrivers(sequelize: Sequelize, planId: string, drivers: Partial<BusinessDriver>[]): Promise<any[]>;
/**
 * Link business drivers to financial line items.
 * @param sequelize - Sequelize instance
 * @param linkages - Driver-to-lineitem mappings
 * @returns Number of linkages created
 */
export declare function linkDriversToFinancials(sequelize: Sequelize, linkages: DriverLinkage[]): Promise<number>;
/**
 * Model relationships between drivers and calculate impacts.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @returns Relationship model with calculations
 */
export declare function modelDriverRelationships(sequelize: Sequelize, planId: string): Promise<Record<string, any>>;
/**
 * Update driver values and cascade impacts.
 * @param sequelize - Sequelize instance
 * @param driverId - Driver ID
 * @param newValue - New value
 * @returns Updated driver with cascaded impacts
 */
export declare function updateDriver(sequelize: Sequelize, driverId: string, newValue: string | Decimal): Promise<any>;
/**
 * Create scenario with distinct assumptions.
 * @param sequelize - Sequelize instance
 * @param scenario - Scenario parameters
 * @returns Created scenario
 */
export declare function createScenario(sequelize: Sequelize, scenario: PlanScenario): Promise<any>;
/**
 * Compare multiple plans side-by-side.
 * @param sequelize - Sequelize instance
 * @param planIds - Array of plan IDs
 * @param metric - Metric to compare
 * @returns Comparison matrix
 */
export declare function comparePlans(sequelize: Sequelize, planIds: string[], metric: string): Promise<Record<string, any>>;
/**
 * Perform what-if analysis by changing assumptions.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param assumptions - Assumptions to modify
 * @returns Impact analysis
 */
export declare function whatIfAnalysis(sequelize: Sequelize, planId: string, assumptions: Record<string, any>): Promise<Record<string, any>>;
/**
 * Sensitivity analysis across key drivers.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param variationPercentage - Percentage to vary (+/-)
 * @returns Sensitivity table
 */
export declare function sensitivityAnalysis(sequelize: Sequelize, planId: string, variationPercentage?: number): Promise<Record<string, any>>;
/**
 * Calculate actual vs plan variance.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param period - Period to analyze
 * @returns Variance analysis
 */
export declare function calculateActualVsPlan(sequelize: Sequelize, planId: string, period: string): Promise<Record<string, any>>;
/**
 * Explain variance drivers and root causes.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param metric - Metric to explain
 * @returns Variance explanation
 */
export declare function explainVariance(sequelize: Sequelize, planId: string, metric: string): Promise<VarianceExplanation>;
/**
 * Categorize variance drivers (volume, price, mix, etc).
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @returns Driver categorization
 */
export declare function categorizeVarianceDrivers(sequelize: Sequelize, planId: string): Promise<Record<string, any>>;
/**
 * Generate variance report for stakeholders.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param period - Period
 * @returns Report data
 */
export declare function reportVariance(sequelize: Sequelize, planId: string, period: string): Promise<Record<string, any>>;
/**
 * Define KPIs with targets and thresholds.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param kpis - KPI definitions
 * @returns Created KPIs
 */
export declare function defineKPIs(sequelize: Sequelize, planId: string, kpis: Partial<KPIDefinition>[]): Promise<any[]>;
/**
 * Track KPI performance against targets.
 * @param sequelize - Sequelize instance
 * @param kpiId - KPI ID
 * @param actualValue - Actual value
 * @returns Performance record
 */
export declare function trackKPIPerformance(sequelize: Sequelize, kpiId: string, actualValue: string | Decimal): Promise<any>;
/**
 * Set/update KPI thresholds for alerts.
 * @param sequelize - Sequelize instance
 * @param kpiId - KPI ID
 * @param threshold - New threshold value
 * @returns Updated KPI
 */
export declare function setKPIThreshold(sequelize: Sequelize, kpiId: string, threshold: string | Decimal): Promise<any>;
/**
 * Alert on KPI threshold breaches.
 * @param sequelize - Sequelize instance
 * @param kpiId - KPI ID
 * @returns Alert if threshold breached
 */
export declare function checkKPIAlert(sequelize: Sequelize, kpiId: string): Promise<any | null>;
/**
 * Create rolling forecast (12/24 months).
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param months - Number of months
 * @returns Created forecast
 */
export declare function createRollingForecast(sequelize: Sequelize, planId: string, months?: number): Promise<any>;
/**
 * Update forecast monthly with new actuals and reforecasted periods.
 * @param sequelize - Sequelize instance
 * @param forecastId - Forecast ID
 * @param updates - Period updates
 * @returns Updated forecast
 */
export declare function updateRollingForecast(sequelize: Sequelize, forecastId: string, updates: Record<string, any>): Promise<any>;
/**
 * Adjust forecast assumptions based on new information.
 * @param sequelize - Sequelize instance
 * @param forecastId - Forecast ID
 * @param assumptions - Updated assumptions
 * @returns Updated forecast
 */
export declare function adjustForecastAssumptions(sequelize: Sequelize, forecastId: string, assumptions: Record<string, any>): Promise<any>;
/**
 * Analyze forecast trends and deviations.
 * @param sequelize - Sequelize instance
 * @param forecastId - Forecast ID
 * @returns Trend analysis
 */
export declare function analyzeForecastTrends(sequelize: Sequelize, forecastId: string): Promise<Record<string, any>>;
/**
 * Build financial model with formulas and dependencies.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param modelSpec - Model specification
 * @returns Model record
 */
export declare function buildFinancialModel(sequelize: Sequelize, planId: string, modelSpec: Record<string, any>): Promise<any>;
/**
 * Calculate financial metrics (margins, ratios, etc).
 * @param sequelize - Sequelize instance
 * @param modelId - Model ID
 * @param period - Period to calculate
 * @returns Calculated metrics
 */
export declare function calculateFinancialMetrics(sequelize: Sequelize, modelId: string, period: string): Promise<Record<string, any>>;
/**
 * Stress test model with parameter variations.
 * @param sequelize - Sequelize instance
 * @param modelId - Model ID
 * @param stressParams - Parameters to stress
 * @returns Stress test results
 */
export declare function stressTestModel(sequelize: Sequelize, modelId: string, stressParams: Record<string, number>): Promise<Record<string, any>>;
/**
 * Optimize model parameters subject to constraints.
 * @param sequelize - Sequelize instance
 * @param modelId - Model ID
 * @param objective - Objective function
 * @param constraints - Constraint definitions
 * @returns Optimized parameters
 */
export declare function optimizeModel(sequelize: Sequelize, modelId: string, objective: string, constraints: Record<string, any>): Promise<Record<string, any>>;
/**
 * Plan capital expenditures by project.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param projectId - Project ID
 * @param capex - Capex amount
 * @returns Capex record
 */
export declare function planCapex(sequelize: Sequelize, planId: string, projectId: string, capex: string | Decimal): Promise<any>;
/**
 * Prioritize projects by NPV, IRR, payback, ROI.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @returns Prioritized projects
 */
export declare function prioritizeProjects(sequelize: Sequelize, planId: string): Promise<any[]>;
/**
 * Track capital spending vs plan.
 * @param sequelize - Sequelize instance
 * @param projectId - Project ID
 * @returns Spending summary
 */
export declare function trackCapexSpending(sequelize: Sequelize, projectId: string): Promise<Record<string, any>>;
/**
 * Calculate ROI for capital projects.
 * @param sequelize - Sequelize instance
 * @param projectId - Project ID
 * @returns ROI analysis
 */
export declare function calculateProjectROI(sequelize: Sequelize, projectId: string): Promise<Record<string, any>>;
/**
 * Plan headcount by department, level, location.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param headcountPlan - Headcount plan data
 * @returns Created plan
 */
export declare function planHeadcount(sequelize: Sequelize, planId: string, headcountPlan: Record<string, any>): Promise<any>;
/**
 * Calculate headcount-related costs (salary, benefits, taxes).
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @returns Cost calculation
 */
export declare function calculateHeadcountCosts(sequelize: Sequelize, planId: string): Promise<Record<string, any>>;
/**
 * Optimize headcount allocation across functions.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param constraints - Allocation constraints
 * @returns Optimized allocation
 */
export declare function optimizeHeadcountAllocation(sequelize: Sequelize, planId: string, constraints: Record<string, any>): Promise<Record<string, any>>;
/**
 * Track actual headcount vs plan.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param period - Period
 * @returns Headcount variance
 */
export declare function trackHeadcountVariance(sequelize: Sequelize, planId: string, period: string): Promise<Record<string, any>>;
/**
 * Generate management reports with variance and trends.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @param period - Report period
 * @returns Management report
 */
export declare function generateManagementReport(sequelize: Sequelize, planId: string, period: string): Promise<Record<string, any>>;
/**
 * Create board package with executive summary and KPIs.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @returns Board package
 */
export declare function createBoardPackage(sequelize: Sequelize, planId: string): Promise<Record<string, any>>;
/**
 * Generate investor relations report with projections.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @returns Investor report
 */
export declare function generateInvestorReport(sequelize: Sequelize, planId: string): Promise<Record<string, any>>;
/**
 * Create executive dashboard with KPI tracking and trends.
 * @param sequelize - Sequelize instance
 * @param planId - Plan ID
 * @returns Dashboard data
 */
export declare function createDashboard(sequelize: Sequelize, planId: string): Promise<Record<string, any>>;
declare const _default: {
    createFinancialPlan: typeof createFinancialPlan;
    setFinancialTargets: typeof setFinancialTargets;
    defineAssumptions: typeof defineAssumptions;
    versionPlan: typeof versionPlan;
    defineBusinessDrivers: typeof defineBusinessDrivers;
    linkDriversToFinancials: typeof linkDriversToFinancials;
    modelDriverRelationships: typeof modelDriverRelationships;
    updateDriver: typeof updateDriver;
    createScenario: typeof createScenario;
    comparePlans: typeof comparePlans;
    whatIfAnalysis: typeof whatIfAnalysis;
    sensitivityAnalysis: typeof sensitivityAnalysis;
    calculateActualVsPlan: typeof calculateActualVsPlan;
    explainVariance: typeof explainVariance;
    categorizeVarianceDrivers: typeof categorizeVarianceDrivers;
    reportVariance: typeof reportVariance;
    defineKPIs: typeof defineKPIs;
    trackKPIPerformance: typeof trackKPIPerformance;
    setKPIThreshold: typeof setKPIThreshold;
    checkKPIAlert: typeof checkKPIAlert;
    createRollingForecast: typeof createRollingForecast;
    updateRollingForecast: typeof updateRollingForecast;
    adjustForecastAssumptions: typeof adjustForecastAssumptions;
    analyzeForecastTrends: typeof analyzeForecastTrends;
    buildFinancialModel: typeof buildFinancialModel;
    calculateFinancialMetrics: typeof calculateFinancialMetrics;
    stressTestModel: typeof stressTestModel;
    optimizeModel: typeof optimizeModel;
    planCapex: typeof planCapex;
    prioritizeProjects: typeof prioritizeProjects;
    trackCapexSpending: typeof trackCapexSpending;
    calculateProjectROI: typeof calculateProjectROI;
    planHeadcount: typeof planHeadcount;
    calculateHeadcountCosts: typeof calculateHeadcountCosts;
    optimizeHeadcountAllocation: typeof optimizeHeadcountAllocation;
    trackHeadcountVariance: typeof trackHeadcountVariance;
    generateManagementReport: typeof generateManagementReport;
    createBoardPackage: typeof createBoardPackage;
    generateInvestorReport: typeof generateInvestorReport;
    createDashboard: typeof createDashboard;
};
export default _default;
//# sourceMappingURL=financial-planning-analysis-kit.d.ts.map