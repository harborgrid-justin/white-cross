/**
 * LOC: P0R1T2F3L4
 * File: /reuse/property/property-portfolio-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v8.0.5)
 *   - sequelize-typescript (v2.1.6)
 *   - sequelize (v6.37.1)
 *   - rxjs (v7.8.1)
 *   - decimal.js (v10.4.3)
 *
 * DOWNSTREAM (imported by):
 *   - Portfolio management services
 *   - Property acquisition modules
 *   - Real estate analytics dashboards
 *   - Investment analysis services
 *   - Property lifecycle management systems
 */
import { Transaction } from 'sequelize';
import Decimal from 'decimal.js';
/**
 * Property type enumeration
 */
export declare enum PropertyType {
    HOSPITAL = "hospital",
    CLINIC = "clinic",
    MEDICAL_OFFICE = "medical_office",
    OUTPATIENT_CENTER = "outpatient_center",
    SURGICAL_CENTER = "surgical_center",
    DIAGNOSTIC_CENTER = "diagnostic_center",
    REHABILITATION_FACILITY = "rehabilitation_facility",
    ADMINISTRATIVE_BUILDING = "administrative_building",
    LABORATORY = "laboratory",
    PHARMACY = "pharmacy",
    MIXED_USE = "mixed_use",
    LAND = "land"
}
/**
 * Property status enumeration
 */
export declare enum PropertyStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    UNDER_CONSTRUCTION = "under_construction",
    UNDER_RENOVATION = "under_renovation",
    PENDING_ACQUISITION = "pending_acquisition",
    PENDING_DISPOSITION = "pending_disposition",
    LEASED = "leased",
    SOLD = "sold",
    DEMOLISHED = "demolished"
}
/**
 * Property ownership type
 */
export declare enum OwnershipType {
    OWNED = "owned",
    LEASED = "leased",
    MANAGED = "managed",
    JOINT_VENTURE = "joint_venture",
    GROUND_LEASE = "ground_lease"
}
/**
 * Investment strategy enumeration
 */
export declare enum InvestmentStrategy {
    CORE = "core",
    CORE_PLUS = "core_plus",
    VALUE_ADD = "value_add",
    OPPORTUNISTIC = "opportunistic",
    DEVELOPMENT = "development"
}
/**
 * Property lifecycle stage
 */
export declare enum PropertyLifecycleStage {
    PLANNING = "planning",
    ACQUISITION = "acquisition",
    DEVELOPMENT = "development",
    STABILIZATION = "stabilization",
    OPERATION = "operation",
    OPTIMIZATION = "optimization",
    DISPOSITION = "disposition",
    POST_SALE = "post_sale"
}
/**
 * Property classification
 */
export interface PropertyClassification {
    propertyId: string;
    primaryType: PropertyType;
    secondaryTypes?: PropertyType[];
    ownershipType: OwnershipType;
    investmentStrategy: InvestmentStrategy;
    marketTier: 'tier_1' | 'tier_2' | 'tier_3';
    riskProfile: 'low' | 'medium' | 'high' | 'very_high';
    regulatoryClass?: string;
    certifications?: string[];
    metadata?: Record<string, any>;
}
/**
 * Portfolio summary statistics
 */
export interface PortfolioSummary {
    totalProperties: number;
    totalSquareFeet: number;
    totalValue: Decimal;
    totalAnnualRevenue: Decimal;
    averageOccupancyRate: number;
    portfolioYield: number;
    totalOperatingExpenses: Decimal;
    netOperatingIncome: Decimal;
    propertiesByType: Record<PropertyType, number>;
    propertiesByStatus: Record<PropertyStatus, number>;
    geographicDistribution: Array<{
        region: string;
        count: number;
        value: Decimal;
    }>;
    performanceMetrics: PortfolioPerformanceMetrics;
}
/**
 * Portfolio performance metrics
 */
export interface PortfolioPerformanceMetrics {
    totalReturn: number;
    capitalAppreciation: number;
    incomeReturn: number;
    occupancyRate: number;
    netOperatingIncomeMargin: number;
    debtServiceCoverageRatio: number;
    returnOnEquity: number;
    returnOnAssets: number;
    cashOnCashReturn: number;
    internalRateOfReturn: number;
}
/**
 * Property acquisition request
 */
export interface PropertyAcquisitionRequest {
    propertyId?: string;
    propertyName: string;
    propertyType: PropertyType;
    address: PropertyAddress;
    purchasePrice: Decimal;
    estimatedClosingDate: Date;
    dueDate: Date;
    financingType: 'cash' | 'mortgage' | 'seller_financing' | 'hybrid';
    downPaymentPercent?: number;
    investmentStrategy: InvestmentStrategy;
    expectedYield: number;
    businessCase: string;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    createdBy: string;
    tenantId: string;
}
/**
 * Property disposition request
 */
export interface PropertyDispositionRequest {
    propertyId: string;
    dispositionType: 'sale' | 'lease_termination' | 'demolition' | 'donation';
    askingPrice?: Decimal;
    expectedClosingDate: Date;
    reason: string;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    marketingPlan?: string;
    createdBy: string;
    tenantId: string;
}
/**
 * Property address
 */
export interface PropertyAddress {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
}
/**
 * Property financial metrics
 */
export interface PropertyFinancialMetrics {
    propertyId: string;
    currentValue: Decimal;
    purchasePrice: Decimal;
    appreciationAmount: Decimal;
    appreciationPercent: number;
    annualRevenue: Decimal;
    annualOperatingExpenses: Decimal;
    netOperatingIncome: Decimal;
    capitalizationRate: number;
    cashFlow: Decimal;
    debtService?: Decimal;
    debtServiceCoverageRatio?: number;
    returnOnInvestment: number;
    asOfDate: Date;
}
/**
 * Property comparison criteria
 */
export interface PropertyComparisonCriteria {
    metrics: Array<keyof PropertyFinancialMetrics | 'occupancyRate' | 'squareFeet'>;
    propertyIds: string[];
    benchmarkType?: 'peer_group' | 'market_average' | 'portfolio_average';
    includeIndustryBenchmarks?: boolean;
}
/**
 * Property comparison result
 */
export interface PropertyComparisonResult {
    propertyId: string;
    propertyName: string;
    metrics: Record<string, number | Decimal>;
    rankByMetric: Record<string, number>;
    performanceVsBenchmark: Record<string, {
        value: number;
        variance: number;
        percentile: number;
    }>;
}
/**
 * Investment analysis input
 */
export interface InvestmentAnalysisInput {
    propertyId?: string;
    purchasePrice: Decimal;
    closingCosts: Decimal;
    renovationCosts?: Decimal;
    annualRevenue: Decimal;
    annualExpenses: Decimal;
    appreciationRate: number;
    holdingPeriod: number;
    discountRate: number;
    exitCapRate?: number;
    financingAmount?: Decimal;
    interestRate?: number;
    loanTerm?: number;
}
/**
 * Investment analysis result
 */
export interface InvestmentAnalysisResult {
    totalInvestment: Decimal;
    netPresentValue: Decimal;
    internalRateOfReturn: number;
    cashOnCashReturn: number;
    equityMultiple: number;
    paybackPeriod: number;
    profitabilityIndex: number;
    breakEvenOccupancy: number;
    annualCashFlows: Array<{
        year: number;
        cashFlow: Decimal;
        cumulativeCashFlow: Decimal;
    }>;
    recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'avoid';
    riskScore: number;
}
/**
 * Property hierarchy node
 */
export interface PropertyHierarchyNode {
    nodeId: string;
    nodeName: string;
    nodeType: 'portfolio' | 'region' | 'market' | 'property' | 'building' | 'floor' | 'unit';
    parentNodeId?: string;
    properties?: string[];
    children?: PropertyHierarchyNode[];
    aggregatedMetrics?: {
        totalValue: Decimal;
        totalSquareFeet: number;
        propertyCount: number;
        averageOccupancy: number;
    };
    metadata?: Record<string, any>;
}
/**
 * Portfolio report configuration
 */
export interface PortfolioReportConfig {
    reportType: 'executive_summary' | 'performance' | 'valuation' | 'operational' | 'compliance' | 'investment';
    reportPeriod: {
        startDate: Date;
        endDate: Date;
    };
    includeProperties?: string[];
    excludeProperties?: string[];
    groupBy?: 'type' | 'region' | 'ownership' | 'strategy';
    metrics?: string[];
    format: 'json' | 'pdf' | 'excel' | 'csv';
    includeCharts?: boolean;
    includeBenchmarks?: boolean;
    recipientEmails?: string[];
    tenantId: string;
    createdBy: string;
}
/**
 * HIPAA audit log entry for property transactions
 */
export interface PropertyAuditLog {
    logId: string;
    eventType: 'property_access' | 'acquisition' | 'disposition' | 'update' | 'transfer' | 'valuation_change';
    propertyId: string;
    userId: string;
    tenantId: string;
    timestamp: Date;
    ipAddress?: string;
    changes?: Record<string, {
        oldValue: any;
        newValue: any;
    }>;
    reason?: string;
    complianceFlags?: string[];
}
/**
 * Generates comprehensive portfolio summary with real-time analytics.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {Date} asOfDate - Date for snapshot
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<PortfolioSummary>} Portfolio summary with all metrics
 *
 * @example
 * ```typescript
 * const summary = await generatePortfolioSummary(
 *   'tenant-123',
 *   new Date(),
 *   transaction
 * );
 * console.log(`Total Portfolio Value: $${summary.totalValue.toString()}`);
 * ```
 */
export declare function generatePortfolioSummary(tenantId: string, asOfDate?: Date, transaction?: Transaction): Promise<PortfolioSummary>;
/**
 * Calculates real-time portfolio performance metrics and KPIs.
 *
 * @param {any[]} properties - Array of property objects
 * @returns {Promise<PortfolioPerformanceMetrics>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePortfolioPerformance(portfolioProperties);
 * console.log(`Portfolio ROE: ${metrics.returnOnEquity}%`);
 * ```
 */
export declare function calculatePortfolioPerformance(properties: any[]): Promise<PortfolioPerformanceMetrics>;
/**
 * Creates portfolio dashboard with customizable widgets and real-time updates.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {string[]} widgetTypes - Types of widgets to include
 * @param {Date} asOfDate - Date for data snapshot
 * @returns {Promise<object>} Dashboard configuration and data
 *
 * @example
 * ```typescript
 * const dashboard = await createPortfolioDashboard(
 *   'tenant-123',
 *   ['summary', 'performance', 'occupancy', 'revenue'],
 *   new Date()
 * );
 * ```
 */
export declare function createPortfolioDashboard(tenantId: string, widgetTypes: string[], asOfDate?: Date): Promise<object>;
/**
 * Retrieves portfolio performance trends over specified period.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {number} months - Number of months to analyze
 * @returns {Promise<Array<{ month: string; metrics: PortfolioPerformanceMetrics }>>} Monthly trends
 *
 * @example
 * ```typescript
 * const trends = await getPortfolioPerformanceTrends('tenant-123', 12);
 * console.log('12-month performance trend:', trends);
 * ```
 */
export declare function getPortfolioPerformanceTrends(tenantId: string, months?: number): Promise<Array<{
    month: string;
    metrics: PortfolioPerformanceMetrics;
}>>;
/**
 * Calculates occupancy metrics across portfolio with breakdowns.
 *
 * @param {string} tenantId - Tenant identifier
 * @returns {Promise<object>} Occupancy analysis with breakdowns
 *
 * @example
 * ```typescript
 * const occupancy = await calculateOccupancyMetrics('tenant-123');
 * console.log(`Overall occupancy: ${occupancy.overallRate}%`);
 * ```
 */
export declare function calculateOccupancyMetrics(tenantId: string): Promise<object>;
/**
 * Creates property acquisition request with approval workflow.
 *
 * @param {PropertyAcquisitionRequest} request - Acquisition request details
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<string>} Acquisition request ID
 *
 * @example
 * ```typescript
 * const requestId = await createPropertyAcquisitionRequest({
 *   propertyName: 'Westside Medical Center',
 *   propertyType: PropertyType.HOSPITAL,
 *   purchasePrice: new Decimal(15000000),
 *   investmentStrategy: InvestmentStrategy.CORE_PLUS,
 *   ...
 * }, transaction);
 * ```
 */
export declare function createPropertyAcquisitionRequest(request: PropertyAcquisitionRequest, transaction?: Transaction): Promise<string>;
/**
 * Processes property acquisition with due diligence workflow.
 *
 * @param {string} acquisitionId - Acquisition request ID
 * @param {string} userId - User processing acquisition
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processPropertyAcquisition('acq-123', 'user-456', transaction);
 * ```
 */
export declare function processPropertyAcquisition(acquisitionId: string, userId: string, transaction?: Transaction): Promise<void>;
/**
 * Creates property disposition request with approval workflow.
 *
 * @param {PropertyDispositionRequest} request - Disposition request details
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<string>} Disposition request ID
 *
 * @example
 * ```typescript
 * const requestId = await createPropertyDispositionRequest({
 *   propertyId: 'prop-123',
 *   dispositionType: 'sale',
 *   askingPrice: new Decimal(12000000),
 *   reason: 'Portfolio optimization',
 *   ...
 * }, transaction);
 * ```
 */
export declare function createPropertyDispositionRequest(request: PropertyDispositionRequest, transaction?: Transaction): Promise<string>;
/**
 * Analyzes acquisition opportunity with financial modeling.
 *
 * @param {InvestmentAnalysisInput} input - Investment analysis parameters
 * @returns {Promise<InvestmentAnalysisResult>} Comprehensive investment analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeAcquisitionOpportunity({
 *   purchasePrice: new Decimal(10000000),
 *   annualRevenue: new Decimal(1200000),
 *   annualExpenses: new Decimal(400000),
 *   holdingPeriod: 10,
 *   discountRate: 0.08,
 * });
 * ```
 */
export declare function analyzeAcquisitionOpportunity(input: InvestmentAnalysisInput): Promise<InvestmentAnalysisResult>;
/**
 * Validates acquisition request for completeness and business rules.
 *
 * @param {PropertyAcquisitionRequest} request - Acquisition request to validate
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * validateAcquisitionRequest(acquisitionRequest);
 * ```
 */
export declare function validateAcquisitionRequest(request: PropertyAcquisitionRequest): void;
/**
 * Manages operations across multiple properties in portfolio.
 *
 * @param {string[]} propertyIds - Array of property IDs
 * @param {string} operationType - Type of operation to perform
 * @param {Record<string, any>} operationParams - Operation parameters
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Array<{ propertyId: string; success: boolean; error?: string }>>} Operation results
 *
 * @example
 * ```typescript
 * const results = await manageMultipleProperties(
 *   ['prop-1', 'prop-2', 'prop-3'],
 *   'update_rent',
 *   { increasePercent: 3.5 },
 *   transaction
 * );
 * ```
 */
export declare function manageMultipleProperties(propertyIds: string[], operationType: string, operationParams: Record<string, any>, transaction?: Transaction): Promise<Array<{
    propertyId: string;
    success: boolean;
    error?: string;
}>>;
/**
 * Synchronizes property data across multiple systems and databases.
 *
 * @param {string[]} propertyIds - Properties to synchronize
 * @param {string[]} targetSystems - Target systems for sync
 * @returns {Promise<object>} Synchronization report
 *
 * @example
 * ```typescript
 * const syncReport = await synchronizePropertyData(
 *   ['prop-1', 'prop-2'],
 *   ['accounting', 'facilities', 'compliance']
 * );
 * ```
 */
export declare function synchronizePropertyData(propertyIds: string[], targetSystems: string[]): Promise<object>;
/**
 * Aggregates metrics across multiple properties with rollup calculations.
 *
 * @param {string[]} propertyIds - Properties to aggregate
 * @param {string[]} metrics - Metrics to calculate
 * @returns {Promise<Record<string, Decimal | number>>} Aggregated metrics
 *
 * @example
 * ```typescript
 * const aggregated = await aggregateMultiPropertyMetrics(
 *   portfolioProperties,
 *   ['totalValue', 'noi', 'occupancy', 'revenue']
 * );
 * ```
 */
export declare function aggregateMultiPropertyMetrics(propertyIds: string[], metrics: string[]): Promise<Record<string, Decimal | number>>;
/**
 * Executes bulk updates across multiple properties with validation.
 *
 * @param {Array<{ propertyId: string; updates: Record<string, any> }>} updates - Property updates
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await bulkUpdateProperties([
 *   { propertyId: 'prop-1', updates: { status: PropertyStatus.ACTIVE } },
 *   { propertyId: 'prop-2', updates: { occupancyRate: 95 } }
 * ], transaction);
 * ```
 */
export declare function bulkUpdateProperties(updates: Array<{
    propertyId: string;
    updates: Record<string, any>;
}>, transaction?: Transaction): Promise<void>;
/**
 * Classifies property based on multiple criteria and algorithms.
 *
 * @param {string} propertyId - Property to classify
 * @param {Partial<PropertyClassification>} classification - Classification criteria
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<PropertyClassification>} Complete classification
 *
 * @example
 * ```typescript
 * const classification = await classifyProperty('prop-123', {
 *   primaryType: PropertyType.HOSPITAL,
 *   ownershipType: OwnershipType.OWNED,
 *   investmentStrategy: InvestmentStrategy.CORE
 * }, transaction);
 * ```
 */
export declare function classifyProperty(propertyId: string, classification: Partial<PropertyClassification>, transaction?: Transaction): Promise<PropertyClassification>;
/**
 * Categorizes properties into groups based on characteristics.
 *
 * @param {string[]} propertyIds - Properties to categorize
 * @param {string} categorizationStrategy - Strategy for categorization
 * @returns {Promise<Map<string, string[]>>} Categories with property IDs
 *
 * @example
 * ```typescript
 * const categories = await categorizeProperties(
 *   allPropertyIds,
 *   'by_performance'
 * );
 * console.log('High performers:', categories.get('high_performance'));
 * ```
 */
export declare function categorizeProperties(propertyIds: string[], categorizationStrategy: string): Promise<Map<string, string[]>>;
/**
 * Assigns property to investment strategy tier with justification.
 *
 * @param {string} propertyId - Property ID
 * @param {InvestmentStrategy} strategy - Investment strategy
 * @param {string} justification - Strategy assignment justification
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await assignPropertyInvestmentStrategy(
 *   'prop-123',
 *   InvestmentStrategy.VALUE_ADD,
 *   'Property requires moderate renovations with strong upside potential',
 *   transaction
 * );
 * ```
 */
export declare function assignPropertyInvestmentStrategy(propertyId: string, strategy: InvestmentStrategy, justification: string, transaction?: Transaction): Promise<void>;
/**
 * Auto-classifies properties using machine learning algorithms.
 *
 * @param {string[]} propertyIds - Properties to auto-classify
 * @param {string[]} classificationDimensions - Dimensions for classification
 * @returns {Promise<Map<string, PropertyClassification>>} Classifications by property ID
 *
 * @example
 * ```typescript
 * const classifications = await autoClassifyProperties(
 *   newPropertyIds,
 *   ['risk', 'performance', 'market_tier']
 * );
 * ```
 */
export declare function autoClassifyProperties(propertyIds: string[], classificationDimensions: string[]): Promise<Map<string, PropertyClassification>>;
/**
 * Tracks property through complete lifecycle from acquisition to disposition.
 *
 * @param {string} propertyId - Property ID
 * @returns {Promise<Array<{ stage: PropertyLifecycleStage; startDate: Date; endDate?: Date; events: any[] }>>} Lifecycle history
 *
 * @example
 * ```typescript
 * const lifecycle = await trackPropertyLifecycle('prop-123');
 * console.log('Current stage:', lifecycle[lifecycle.length - 1].stage);
 * ```
 */
export declare function trackPropertyLifecycle(propertyId: string): Promise<Array<{
    stage: PropertyLifecycleStage;
    startDate: Date;
    endDate?: Date;
    events: any[];
}>>;
/**
 * Transitions property to new lifecycle stage with validation.
 *
 * @param {string} propertyId - Property ID
 * @param {PropertyLifecycleStage} newStage - Target lifecycle stage
 * @param {string} userId - User initiating transition
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await transitionPropertyLifecycleStage(
 *   'prop-123',
 *   PropertyLifecycleStage.OPERATION,
 *   'user-456',
 *   transaction
 * );
 * ```
 */
export declare function transitionPropertyLifecycleStage(propertyId: string, newStage: PropertyLifecycleStage, userId: string, transaction?: Transaction): Promise<void>;
/**
 * Manages property lifecycle milestones and triggers automated workflows.
 *
 * @param {string} propertyId - Property ID
 * @param {string} milestone - Milestone identifier
 * @param {Record<string, any>} milestoneData - Milestone data
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await managePropertyLifecycleMilestone(
 *   'prop-123',
 *   'construction_complete',
 *   { completionDate: new Date(), finalCost: new Decimal(5000000) },
 *   transaction
 * );
 * ```
 */
export declare function managePropertyLifecycleMilestone(propertyId: string, milestone: string, milestoneData: Record<string, any>, transaction?: Transaction): Promise<void>;
/**
 * Generates lifecycle stage recommendations based on property metrics.
 *
 * @param {string} propertyId - Property ID
 * @returns {Promise<{ recommendedStage: PropertyLifecycleStage; confidence: number; reasoning: string }>} Recommendation
 *
 * @example
 * ```typescript
 * const recommendation = await recommendLifecycleStageTransition('prop-123');
 * console.log(`Recommend: ${recommendation.recommendedStage} (${recommendation.confidence}% confidence)`);
 * ```
 */
export declare function recommendLifecycleStageTransition(propertyId: string): Promise<{
    recommendedStage: PropertyLifecycleStage;
    confidence: number;
    reasoning: string;
}>;
/**
 * Calculates comprehensive property-level performance metrics.
 *
 * @param {string} propertyId - Property ID
 * @param {Date} asOfDate - Date for metric calculation
 * @returns {Promise<PropertyFinancialMetrics>} Financial metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePropertyPerformanceMetrics('prop-123', new Date());
 * console.log(`NOI: $${metrics.netOperatingIncome.toString()}`);
 * ```
 */
export declare function calculatePropertyPerformanceMetrics(propertyId: string, asOfDate?: Date): Promise<PropertyFinancialMetrics>;
/**
 * Tracks performance metrics over time with trend analysis.
 *
 * @param {string} propertyId - Property ID
 * @param {Date} startDate - Start of tracking period
 * @param {Date} endDate - End of tracking period
 * @returns {Promise<Array<{ date: Date; metrics: PropertyFinancialMetrics }>>} Time series metrics
 *
 * @example
 * ```typescript
 * const trends = await trackPropertyPerformanceOverTime(
 *   'prop-123',
 *   new Date('2024-01-01'),
 *   new Date('2025-01-01')
 * );
 * ```
 */
export declare function trackPropertyPerformanceOverTime(propertyId: string, startDate: Date, endDate: Date): Promise<Array<{
    date: Date;
    metrics: PropertyFinancialMetrics;
}>>;
/**
 * Benchmarks property performance against portfolio and market averages.
 *
 * @param {string} propertyId - Property ID
 * @param {string} benchmarkType - Type of benchmark
 * @returns {Promise<object>} Benchmark comparison results
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkPropertyPerformance(
 *   'prop-123',
 *   'portfolio_average'
 * );
 * console.log('Performance vs average:', benchmark.variance);
 * ```
 */
export declare function benchmarkPropertyPerformance(propertyId: string, benchmarkType: string): Promise<object>;
/**
 * Generates property performance scorecards with multiple dimensions.
 *
 * @param {string} propertyId - Property ID
 * @returns {Promise<object>} Performance scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generatePropertyPerformanceScorecard('prop-123');
 * console.log('Overall score:', scorecard.overallScore);
 * ```
 */
export declare function generatePropertyPerformanceScorecard(propertyId: string): Promise<object>;
/**
 * Compares multiple properties across specified metrics and criteria.
 *
 * @param {PropertyComparisonCriteria} criteria - Comparison criteria
 * @returns {Promise<PropertyComparisonResult[]>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareProperties({
 *   propertyIds: ['prop-1', 'prop-2', 'prop-3'],
 *   metrics: ['currentValue', 'netOperatingIncome', 'capitalizationRate'],
 *   benchmarkType: 'portfolio_average'
 * });
 * ```
 */
export declare function compareProperties(criteria: PropertyComparisonCriteria): Promise<PropertyComparisonResult[]>;
/**
 * Ranks properties based on performance metrics and criteria.
 *
 * @param {string[]} propertyIds - Properties to rank
 * @param {string} rankingMetric - Metric for ranking
 * @param {'asc' | 'desc'} order - Sort order
 * @returns {Promise<Array<{ rank: number; propertyId: string; value: number | Decimal }>>} Ranked properties
 *
 * @example
 * ```typescript
 * const rankings = await rankProperties(
 *   allPropertyIds,
 *   'netOperatingIncome',
 *   'desc'
 * );
 * console.log('Top performer:', rankings[0]);
 * ```
 */
export declare function rankProperties(propertyIds: string[], rankingMetric: string, order?: 'asc' | 'desc'): Promise<Array<{
    rank: number;
    propertyId: string;
    value: number | Decimal;
}>>;
/**
 * Benchmarks properties against industry standards and best practices.
 *
 * @param {string[]} propertyIds - Properties to benchmark
 * @param {string} industrySegment - Industry segment for comparison
 * @returns {Promise<Map<string, object>>} Benchmark results by property
 *
 * @example
 * ```typescript
 * const benchmarks = await benchmarkAgainstIndustryStandards(
 *   hospitalProperties,
 *   'acute_care_hospitals'
 * );
 * ```
 */
export declare function benchmarkAgainstIndustryStandards(propertyIds: string[], industrySegment: string): Promise<Map<string, object>>;
/**
 * Identifies top and bottom performing properties in portfolio.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {number} topN - Number of top/bottom performers to return
 * @returns {Promise<{ topPerformers: any[]; bottomPerformers: any[] }>} Performance outliers
 *
 * @example
 * ```typescript
 * const outliers = await identifyPerformanceOutliers('tenant-123', 5);
 * console.log('Top 5 performers:', outliers.topPerformers);
 * ```
 */
export declare function identifyPerformanceOutliers(tenantId: string, topN?: number): Promise<{
    topPerformers: any[];
    bottomPerformers: any[];
}>;
/**
 * Performs comprehensive investment analysis with NPV, IRR, and sensitivity.
 *
 * @param {InvestmentAnalysisInput} input - Investment parameters
 * @returns {Promise<InvestmentAnalysisResult>} Complete analysis results
 *
 * @example
 * ```typescript
 * const analysis = await performInvestmentAnalysis({
 *   purchasePrice: new Decimal(15000000),
 *   annualRevenue: new Decimal(1800000),
 *   annualExpenses: new Decimal(600000),
 *   holdingPeriod: 10,
 *   discountRate: 0.085
 * });
 * ```
 */
export declare function performInvestmentAnalysis(input: InvestmentAnalysisInput): Promise<InvestmentAnalysisResult>;
/**
 * Calculates return on investment with multiple methodologies.
 *
 * @param {string} propertyId - Property ID
 * @param {'simple' | 'annualized' | 'irr' | 'equity_multiple'} methodology - ROI calculation method
 * @returns {Promise<number>} ROI percentage or multiple
 *
 * @example
 * ```typescript
 * const roi = await calculateReturnOnInvestment('prop-123', 'irr');
 * console.log(`IRR: ${roi}%`);
 * ```
 */
export declare function calculateReturnOnInvestment(propertyId: string, methodology?: 'simple' | 'annualized' | 'irr' | 'equity_multiple'): Promise<number>;
/**
 * Performs sensitivity analysis on investment scenarios.
 *
 * @param {InvestmentAnalysisInput} baseCase - Base case scenario
 * @param {Record<string, number[]>} variables - Variables to stress test
 * @returns {Promise<object>} Sensitivity analysis results
 *
 * @example
 * ```typescript
 * const sensitivity = await performSensitivityAnalysis(baseCase, {
 *   occupancyRate: [0.85, 0.90, 0.95, 1.00],
 *   appreciationRate: [0.02, 0.03, 0.04, 0.05]
 * });
 * ```
 */
export declare function performSensitivityAnalysis(baseCase: InvestmentAnalysisInput, variables: Record<string, number[]>): Promise<object>;
/**
 * Evaluates portfolio diversification and risk concentration.
 *
 * @param {string} tenantId - Tenant identifier
 * @returns {Promise<object>} Diversification analysis
 *
 * @example
 * ```typescript
 * const diversification = await evaluatePortfolioDiversification('tenant-123');
 * console.log('Concentration risk:', diversification.concentrationScore);
 * ```
 */
export declare function evaluatePortfolioDiversification(tenantId: string): Promise<object>;
/**
 * Creates hierarchical property organization structure.
 *
 * @param {PropertyHierarchyNode} rootNode - Root node of hierarchy
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<string>} Hierarchy ID
 *
 * @example
 * ```typescript
 * const hierarchyId = await createPropertyHierarchy({
 *   nodeId: 'portfolio-main',
 *   nodeName: 'Main Healthcare Portfolio',
 *   nodeType: 'portfolio',
 *   children: [regionNodes...]
 * }, transaction);
 * ```
 */
export declare function createPropertyHierarchy(rootNode: PropertyHierarchyNode, transaction?: Transaction): Promise<string>;
/**
 * Navigates property hierarchy and retrieves nodes at specified level.
 *
 * @param {string} hierarchyId - Hierarchy identifier
 * @param {number} level - Hierarchy level to retrieve
 * @returns {Promise<PropertyHierarchyNode[]>} Nodes at specified level
 *
 * @example
 * ```typescript
 * const regions = await navigatePropertyHierarchy('hier-123', 1);
 * console.log('Regional divisions:', regions);
 * ```
 */
export declare function navigatePropertyHierarchy(hierarchyId: string, level: number): Promise<PropertyHierarchyNode[]>;
/**
 * Aggregates metrics up property hierarchy with rollup calculations.
 *
 * @param {string} nodeId - Node ID to aggregate from
 * @returns {Promise<object>} Aggregated metrics
 *
 * @example
 * ```typescript
 * const aggregated = await aggregateHierarchyMetrics('region-northeast');
 * console.log('Regional total value:', aggregated.totalValue);
 * ```
 */
export declare function aggregateHierarchyMetrics(nodeId: string): Promise<object>;
/**
 * Reorganizes property hierarchy with drag-and-drop support.
 *
 * @param {string} nodeId - Node to move
 * @param {string} newParentId - New parent node ID
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reorganizePropertyHierarchy(
 *   'property-123',
 *   'region-southeast',
 *   transaction
 * );
 * ```
 */
export declare function reorganizePropertyHierarchy(nodeId: string, newParentId: string, transaction?: Transaction): Promise<void>;
/**
 * Generates comprehensive portfolio reports with customizable templates.
 *
 * @param {PortfolioReportConfig} config - Report configuration
 * @returns {Promise<object>} Generated report
 *
 * @example
 * ```typescript
 * const report = await generatePortfolioReport({
 *   reportType: 'executive_summary',
 *   reportPeriod: { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') },
 *   format: 'pdf',
 *   tenantId: 'tenant-123',
 *   createdBy: 'user-456'
 * });
 * ```
 */
export declare function generatePortfolioReport(config: PortfolioReportConfig): Promise<object>;
/**
 * Extracts actionable insights from portfolio data using analytics.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {string[]} insightTypes - Types of insights to generate
 * @returns {Promise<Array<{ type: string; priority: string; insight: string; recommendation: string }>>} Insights
 *
 * @example
 * ```typescript
 * const insights = await extractPortfolioInsights('tenant-123', [
 *   'underperforming_properties',
 *   'optimization_opportunities',
 *   'market_trends'
 * ]);
 * ```
 */
export declare function extractPortfolioInsights(tenantId: string, insightTypes: string[]): Promise<Array<{
    type: string;
    priority: string;
    insight: string;
    recommendation: string;
}>>;
/**
 * Creates executive dashboard with KPIs and visualizations.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {Date} asOfDate - Date for dashboard data
 * @returns {Promise<object>} Executive dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await createExecutiveDashboard('tenant-123', new Date());
 * ```
 */
export declare function createExecutiveDashboard(tenantId: string, asOfDate?: Date): Promise<object>;
/**
 * Schedules automated portfolio reports with delivery options.
 *
 * @param {PortfolioReportConfig} config - Report configuration
 * @param {string} schedule - Cron schedule expression
 * @returns {Promise<string>} Scheduled report ID
 *
 * @example
 * ```typescript
 * const scheduleId = await scheduleAutomatedReport({
 *   reportType: 'performance',
 *   format: 'pdf',
 *   recipientEmails: ['exec@company.com'],
 *   tenantId: 'tenant-123',
 *   createdBy: 'user-456'
 * }, '0 8 1 * *'); // Monthly on 1st at 8 AM
 * ```
 */
export declare function scheduleAutomatedReport(config: PortfolioReportConfig, schedule: string): Promise<string>;
/**
 * Analyzes portfolio trends and forecasts future performance.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {number} forecastMonths - Number of months to forecast
 * @returns {Promise<object>} Trend analysis and forecasts
 *
 * @example
 * ```typescript
 * const forecast = await analyzePortfolioTrends('tenant-123', 12);
 * console.log('Projected 12-month value:', forecast.projectedValue);
 * ```
 */
export declare function analyzePortfolioTrends(tenantId: string, forecastMonths?: number): Promise<object>;
declare const _default: {
    generatePortfolioSummary: typeof generatePortfolioSummary;
    calculatePortfolioPerformance: typeof calculatePortfolioPerformance;
    createPortfolioDashboard: typeof createPortfolioDashboard;
    getPortfolioPerformanceTrends: typeof getPortfolioPerformanceTrends;
    calculateOccupancyMetrics: typeof calculateOccupancyMetrics;
    createPropertyAcquisitionRequest: typeof createPropertyAcquisitionRequest;
    processPropertyAcquisition: typeof processPropertyAcquisition;
    createPropertyDispositionRequest: typeof createPropertyDispositionRequest;
    analyzeAcquisitionOpportunity: typeof analyzeAcquisitionOpportunity;
    validateAcquisitionRequest: typeof validateAcquisitionRequest;
    manageMultipleProperties: typeof manageMultipleProperties;
    synchronizePropertyData: typeof synchronizePropertyData;
    aggregateMultiPropertyMetrics: typeof aggregateMultiPropertyMetrics;
    bulkUpdateProperties: typeof bulkUpdateProperties;
    classifyProperty: typeof classifyProperty;
    categorizeProperties: typeof categorizeProperties;
    assignPropertyInvestmentStrategy: typeof assignPropertyInvestmentStrategy;
    autoClassifyProperties: typeof autoClassifyProperties;
    trackPropertyLifecycle: typeof trackPropertyLifecycle;
    transitionPropertyLifecycleStage: typeof transitionPropertyLifecycleStage;
    managePropertyLifecycleMilestone: typeof managePropertyLifecycleMilestone;
    recommendLifecycleStageTransition: typeof recommendLifecycleStageTransition;
    calculatePropertyPerformanceMetrics: typeof calculatePropertyPerformanceMetrics;
    trackPropertyPerformanceOverTime: typeof trackPropertyPerformanceOverTime;
    benchmarkPropertyPerformance: typeof benchmarkPropertyPerformance;
    generatePropertyPerformanceScorecard: typeof generatePropertyPerformanceScorecard;
    compareProperties: typeof compareProperties;
    rankProperties: typeof rankProperties;
    benchmarkAgainstIndustryStandards: typeof benchmarkAgainstIndustryStandards;
    identifyPerformanceOutliers: typeof identifyPerformanceOutliers;
    performInvestmentAnalysis: typeof performInvestmentAnalysis;
    calculateReturnOnInvestment: typeof calculateReturnOnInvestment;
    performSensitivityAnalysis: typeof performSensitivityAnalysis;
    evaluatePortfolioDiversification: typeof evaluatePortfolioDiversification;
    createPropertyHierarchy: typeof createPropertyHierarchy;
    navigatePropertyHierarchy: typeof navigatePropertyHierarchy;
    aggregateHierarchyMetrics: typeof aggregateHierarchyMetrics;
    reorganizePropertyHierarchy: typeof reorganizePropertyHierarchy;
    generatePortfolioReport: typeof generatePortfolioReport;
    extractPortfolioInsights: typeof extractPortfolioInsights;
    createExecutiveDashboard: typeof createExecutiveDashboard;
    scheduleAutomatedReport: typeof scheduleAutomatedReport;
    analyzePortfolioTrends: typeof analyzePortfolioTrends;
};
export default _default;
//# sourceMappingURL=property-portfolio-management-kit.d.ts.map