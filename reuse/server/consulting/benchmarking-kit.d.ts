/**
 * LOC: CONS-BENCH-001
 * File: /reuse/server/consulting/benchmarking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/benchmarking.service.ts
 *   - backend/consulting/performance-analytics.controller.ts
 *   - backend/consulting/competitive-intelligence.service.ts
 */
/**
 * File: /reuse/server/consulting/benchmarking-kit.ts
 * Locator: WC-CONS-BENCH-001
 * Purpose: Enterprise-grade Benchmarking Kit - peer comparison, best practice identification, maturity models, performance gap analysis
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, benchmarking controllers, competitive analysis processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 40 production-ready functions for benchmarking competing with McKinsey, BCG, Bain consulting tools
 *
 * LLM Context: Comprehensive benchmarking utilities for production-ready management consulting applications.
 * Provides peer comparison, best practice identification, maturity model assessment, performance gap analysis,
 * competitive benchmarking, functional benchmarking, KPI benchmarking, industry standards comparison,
 * capability assessment, quartile analysis, and performance radar charts.
 */
import { Sequelize } from 'sequelize';
/**
 * Benchmark types
 */
export declare enum BenchmarkType {
    COMPETITIVE = "competitive",
    FUNCTIONAL = "functional",
    INTERNAL = "internal",
    GENERIC = "generic",
    STRATEGIC = "strategic",
    OPERATIONAL = "operational"
}
/**
 * Performance quartiles
 */
export declare enum PerformanceQuartile {
    TOP = "top",
    SECOND = "second",
    THIRD = "third",
    BOTTOM = "bottom"
}
/**
 * Maturity levels
 */
export declare enum MaturityLevel {
    INITIAL = "initial",
    DEVELOPING = "developing",
    DEFINED = "defined",
    MANAGED = "managed",
    OPTIMIZING = "optimizing"
}
/**
 * Gap severity levels
 */
export declare enum GapSeverity {
    CRITICAL = "critical",
    SIGNIFICANT = "significant",
    MODERATE = "moderate",
    MINOR = "minor",
    NONE = "none"
}
/**
 * Benchmark scope
 */
export declare enum BenchmarkScope {
    GLOBAL = "global",
    REGIONAL = "regional",
    INDUSTRY = "industry",
    PEER_GROUP = "peer_group",
    CUSTOM = "custom"
}
/**
 * Metric categories
 */
export declare enum MetricCategory {
    FINANCIAL = "financial",
    OPERATIONAL = "operational",
    CUSTOMER = "customer",
    EMPLOYEE = "employee",
    INNOVATION = "innovation",
    QUALITY = "quality"
}
/**
 * Benchmark data interface
 */
export interface BenchmarkData {
    benchmarkId: string;
    name: string;
    benchmarkType: BenchmarkType;
    scope: BenchmarkScope;
    industry: string;
    geography: string;
    peerGroupSize: number;
    metrics: Array<{
        name: string;
        category: MetricCategory;
        value: number;
        unit: string;
    }>;
    period: string;
    dataSource: string;
    confidence: number;
    metadata: Record<string, any>;
}
/**
 * Peer comparison data
 */
export interface PeerComparisonData {
    comparisonId: string;
    organizationId: string;
    peerOrganizations: string[];
    metrics: Array<{
        metric: string;
        organizationValue: number;
        peerAverage: number;
        peerMedian: number;
        percentile: number;
        quartile: PerformanceQuartile;
    }>;
    overallRanking: number;
    strengths: string[];
    weaknesses: string[];
}
/**
 * Best practice data
 */
export interface BestPracticeData {
    practiceId: string;
    name: string;
    category: string;
    description: string;
    benefits: string[];
    implementationComplexity: string;
    adoptionRate: number;
    impact: string;
    examples: Array<{
        organization: string;
        implementation: string;
        results: string;
    }>;
}
/**
 * Maturity assessment data
 */
export interface MaturityAssessmentData {
    assessmentId: string;
    organizationId: string;
    framework: string;
    dimensions: Array<{
        dimension: string;
        currentLevel: MaturityLevel;
        targetLevel: MaturityLevel;
        score: number;
        gap: number;
    }>;
    overallMaturity: MaturityLevel;
    maturityScore: number;
    roadmap: string[];
}
/**
 * Performance gap data
 */
export interface PerformanceGapData {
    gapId: string;
    metric: string;
    current: number;
    target: number;
    benchmark: number;
    gap: number;
    gapPercent: number;
    severity: GapSeverity;
    rootCauses: string[];
    recommendations: string[];
    closurePlan: string;
}
/**
 * KPI benchmark data
 */
export interface KPIBenchmarkData {
    kpiId: string;
    kpiName: string;
    category: MetricCategory;
    currentValue: number;
    industryAverage: number;
    topQuartile: number;
    topDecile: number;
    percentileRank: number;
    trend: string;
    targetValue: number;
}
/**
 * Create Benchmark DTO
 */
export declare class CreateBenchmarkDto {
    name: string;
    benchmarkType: BenchmarkType;
    scope: BenchmarkScope;
    industry: string;
    geography: string;
    peerGroupSize: number;
    period: string;
    dataSource: string;
    confidence: number;
    metadata?: Record<string, any>;
}
/**
 * Create Peer Comparison DTO
 */
export declare class CreatePeerComparisonDto {
    organizationId: string;
    peerOrganizations: string[];
    metrics: string[];
}
/**
 * Create Best Practice DTO
 */
export declare class CreateBestPracticeDto {
    name: string;
    category: string;
    description: string;
    benefits: string[];
    implementationComplexity: 'low' | 'medium' | 'high' | 'very_high';
    adoptionRate: number;
    impact: 'low' | 'medium' | 'high' | 'transformational';
}
/**
 * Create Maturity Assessment DTO
 */
export declare class CreateMaturityAssessmentDto {
    organizationId: string;
    framework: string;
    dimensions: string[];
}
/**
 * Create Performance Gap DTO
 */
export declare class CreatePerformanceGapDto {
    metric: string;
    current: number;
    target: number;
    benchmark: number;
    rootCauses: string[];
}
/**
 * Create KPI Benchmark DTO
 */
export declare class CreateKPIBenchmarkDto {
    kpiName: string;
    category: MetricCategory;
    currentValue: number;
    industryAverage: number;
    topQuartile: number;
    topDecile: number;
}
/**
 * Benchmark Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Benchmark:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         benchmarkId:
 *           type: string
 *         name:
 *           type: string
 *         benchmarkType:
 *           type: string
 *           enum: [competitive, functional, internal, generic, strategic, operational]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Benchmark model
 */
export declare const createBenchmarkModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        benchmarkId: string;
        name: string;
        benchmarkType: string;
        scope: string;
        industry: string;
        geography: string;
        peerGroupSize: number;
        metrics: any[];
        period: string;
        dataSource: string;
        confidence: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Peer Comparison Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PeerComparison model
 */
export declare const createPeerComparisonModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        comparisonId: string;
        organizationId: string;
        peerOrganizations: string[];
        metrics: any[];
        overallRanking: number;
        strengths: string[];
        weaknesses: string[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Best Practice Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BestPractice model
 */
export declare const createBestPracticeModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        practiceId: string;
        name: string;
        category: string;
        description: string;
        benefits: string[];
        implementationComplexity: string;
        adoptionRate: number;
        impact: string;
        examples: any[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Maturity Assessment Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} MaturityAssessment model
 */
export declare const createMaturityAssessmentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        assessmentId: string;
        organizationId: string;
        framework: string;
        dimensions: any[];
        overallMaturity: string;
        maturityScore: number;
        roadmap: string[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Performance Gap Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PerformanceGap model
 */
export declare const createPerformanceGapModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        gapId: string;
        metric: string;
        current: number;
        target: number;
        benchmark: number;
        gap: number;
        gapPercent: number;
        severity: string;
        rootCauses: string[];
        recommendations: string[];
        closurePlan: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * KPI Benchmark Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} KPIBenchmark model
 */
export declare const createKPIBenchmarkModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        kpiId: string;
        kpiName: string;
        category: string;
        currentValue: number;
        industryAverage: number;
        topQuartile: number;
        topDecile: number;
        percentileRank: number;
        trend: string;
        targetValue: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new benchmark.
 *
 * @param {Partial<BenchmarkData>} data - Benchmark data
 * @returns {Promise<BenchmarkData>} Created benchmark
 *
 * @example
 * ```typescript
 * const benchmark = await createBenchmark({
 *   name: 'Healthcare Operational Excellence',
 *   benchmarkType: BenchmarkType.COMPETITIVE,
 *   scope: BenchmarkScope.INDUSTRY,
 *   ...
 * });
 * ```
 */
export declare function createBenchmark(data: Partial<BenchmarkData>): Promise<BenchmarkData>;
/**
 * Aggregates benchmark data from multiple sources.
 *
 * @param {string[]} sourceIds - Data source identifiers
 * @param {string[]} metrics - Metrics to aggregate
 * @returns {Promise<{ aggregatedMetrics: any[]; sourceCount: number; confidence: number }>} Aggregated data
 *
 * @example
 * ```typescript
 * const aggregated = await aggregateBenchmarkData(sources, metrics);
 * ```
 */
export declare function aggregateBenchmarkData(sourceIds: string[], metrics: string[]): Promise<{
    aggregatedMetrics: any[];
    sourceCount: number;
    confidence: number;
}>;
/**
 * Normalizes benchmark data for comparison.
 *
 * @param {Array<{ metric: string; value: number; unit: string }>} data - Raw benchmark data
 * @returns {Promise<Array<{ metric: string; normalizedValue: number; scale: string }>>} Normalized data
 *
 * @example
 * ```typescript
 * const normalized = await normalizeBenchmarkData(rawData);
 * ```
 */
export declare function normalizeBenchmarkData(data: Array<{
    metric: string;
    value: number;
    unit: string;
}>): Promise<Array<{
    metric: string;
    normalizedValue: number;
    scale: string;
}>>;
/**
 * Validates benchmark data quality.
 *
 * @param {BenchmarkData} benchmark - Benchmark to validate
 * @returns {Promise<{ isValid: boolean; issues: string[]; qualityScore: number }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateBenchmarkQuality(benchmark);
 * ```
 */
export declare function validateBenchmarkQuality(benchmark: BenchmarkData): Promise<{
    isValid: boolean;
    issues: string[];
    qualityScore: number;
}>;
/**
 * Generates benchmark summary statistics.
 *
 * @param {BenchmarkData} benchmark - Benchmark data
 * @returns {Promise<{ mean: number; median: number; stdDev: number; range: [number, number] }>} Summary statistics
 *
 * @example
 * ```typescript
 * const stats = await generateBenchmarkStatistics(benchmark);
 * ```
 */
export declare function generateBenchmarkStatistics(benchmark: BenchmarkData): Promise<{
    mean: number;
    median: number;
    stdDev: number;
    range: [number, number];
}>;
/**
 * Identifies benchmark outliers.
 *
 * @param {BenchmarkData} benchmark - Benchmark data
 * @param {number} threshold - Outlier threshold (standard deviations)
 * @returns {Promise<Array<{ metric: string; value: number; deviation: number }>>} Outliers
 *
 * @example
 * ```typescript
 * const outliers = await identifyBenchmarkOutliers(benchmark, 2);
 * ```
 */
export declare function identifyBenchmarkOutliers(benchmark: BenchmarkData, threshold: number): Promise<Array<{
    metric: string;
    value: number;
    deviation: number;
}>>;
/**
 * Filters benchmarks by criteria.
 *
 * @param {BenchmarkData[]} benchmarks - Array of benchmarks
 * @param {Record<string, any>} filters - Filter criteria
 * @returns {Promise<BenchmarkData[]>} Filtered benchmarks
 *
 * @example
 * ```typescript
 * const filtered = await filterBenchmarks(all, { industry: 'Healthcare', scope: 'industry' });
 * ```
 */
export declare function filterBenchmarks(benchmarks: BenchmarkData[], filters: Record<string, any>): Promise<BenchmarkData[]>;
/**
 * Merges multiple benchmarks into composite.
 *
 * @param {BenchmarkData[]} benchmarks - Benchmarks to merge
 * @returns {Promise<BenchmarkData>} Composite benchmark
 *
 * @example
 * ```typescript
 * const composite = await mergeBenchmarks([bm1, bm2, bm3]);
 * ```
 */
export declare function mergeBenchmarks(benchmarks: BenchmarkData[]): Promise<BenchmarkData>;
/**
 * Calculates benchmark confidence intervals.
 *
 * @param {BenchmarkData} benchmark - Benchmark data
 * @param {number} confidenceLevel - Confidence level (e.g., 95)
 * @returns {Promise<Array<{ metric: string; lowerBound: number; upperBound: number }>>} Confidence intervals
 *
 * @example
 * ```typescript
 * const intervals = await calculateConfidenceIntervals(benchmark, 95);
 * ```
 */
export declare function calculateConfidenceIntervals(benchmark: BenchmarkData, confidenceLevel: number): Promise<Array<{
    metric: string;
    lowerBound: number;
    upperBound: number;
}>>;
/**
 * Generates benchmark trend analysis.
 *
 * @param {BenchmarkData[]} historicalBenchmarks - Historical benchmarks
 * @param {string} metric - Metric to analyze
 * @returns {Promise<{ trend: string; changeRate: number; forecast: number }>} Trend analysis
 *
 * @example
 * ```typescript
 * const trend = await analyzeBenchmarkTrends(historical, 'Revenue Growth');
 * ```
 */
export declare function analyzeBenchmarkTrends(historicalBenchmarks: BenchmarkData[], metric: string): Promise<{
    trend: string;
    changeRate: number;
    forecast: number;
}>;
/**
 * Creates peer comparison analysis.
 *
 * @param {Partial<PeerComparisonData>} data - Comparison data
 * @returns {Promise<PeerComparisonData>} Peer comparison
 *
 * @example
 * ```typescript
 * const comparison = await createPeerComparison({
 *   organizationId: 'uuid-org',
 *   peerOrganizations: ['peer1', 'peer2'],
 *   ...
 * });
 * ```
 */
export declare function createPeerComparison(data: Partial<PeerComparisonData>): Promise<PeerComparisonData>;
/**
 * Calculates percentile rankings.
 *
 * @param {number} value - Value to rank
 * @param {number[]} peerValues - Peer values
 * @returns {Promise<{ percentile: number; quartile: PerformanceQuartile; rank: number }>} Ranking
 *
 * @example
 * ```typescript
 * const ranking = await calculatePercentileRank(75000, peerValues);
 * ```
 */
export declare function calculatePercentileRank(value: number, peerValues: number[]): Promise<{
    percentile: number;
    quartile: PerformanceQuartile;
    rank: number;
}>;
/**
 * Identifies competitive strengths vs peers.
 *
 * @param {PeerComparisonData} comparison - Peer comparison
 * @returns {Promise<Array<{ metric: string; advantage: number; significance: string }>>} Strengths
 *
 * @example
 * ```typescript
 * const strengths = await identifyCompetitiveStrengths(comparison);
 * ```
 */
export declare function identifyCompetitiveStrengths(comparison: PeerComparisonData): Promise<Array<{
    metric: string;
    advantage: number;
    significance: string;
}>>;
/**
 * Identifies competitive weaknesses vs peers.
 *
 * @param {PeerComparisonData} comparison - Peer comparison
 * @returns {Promise<Array<{ metric: string; disadvantage: number; urgency: string }>>} Weaknesses
 *
 * @example
 * ```typescript
 * const weaknesses = await identifyCompetitiveWeaknesses(comparison);
 * ```
 */
export declare function identifyCompetitiveWeaknesses(comparison: PeerComparisonData): Promise<Array<{
    metric: string;
    disadvantage: number;
    urgency: string;
}>>;
/**
 * Generates competitive positioning map.
 *
 * @param {PeerComparisonData} comparison - Peer comparison
 * @param {string} xMetric - X-axis metric
 * @param {string} yMetric - Y-axis metric
 * @returns {Promise<{ positions: Array<{ org: string; x: number; y: number }> }>} Positioning map
 *
 * @example
 * ```typescript
 * const map = await generateCompetitivePositioningMap(comparison, 'Cost', 'Quality');
 * ```
 */
export declare function generateCompetitivePositioningMap(comparison: PeerComparisonData, xMetric: string, yMetric: string): Promise<{
    positions: Array<{
        org: string;
        x: number;
        y: number;
    }>;
}>;
/**
 * Calculates peer group statistics.
 *
 * @param {number[]} peerValues - Peer metric values
 * @returns {Promise<{ min: number; q1: number; median: number; q3: number; max: number }>} Statistics
 *
 * @example
 * ```typescript
 * const stats = await calculatePeerGroupStatistics(values);
 * ```
 */
export declare function calculatePeerGroupStatistics(peerValues: number[]): Promise<{
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
}>;
/**
 * Generates peer comparison spider/radar chart data.
 *
 * @param {PeerComparisonData} comparison - Peer comparison
 * @returns {Promise<{ axes: string[]; organizationScores: number[]; peerAverageScores: number[] }>} Radar data
 *
 * @example
 * ```typescript
 * const radar = await generatePeerRadarChart(comparison);
 * ```
 */
export declare function generatePeerRadarChart(comparison: PeerComparisonData): Promise<{
    axes: string[];
    organizationScores: number[];
    peerAverageScores: number[];
}>;
/**
 * Identifies peer outliers (exceptionally high or low performers).
 *
 * @param {PeerComparisonData} comparison - Peer comparison
 * @param {string} metric - Metric to analyze
 * @returns {Promise<Array<{ organization: string; value: number; deviation: string }>>} Outliers
 *
 * @example
 * ```typescript
 * const outliers = await identifyPeerOutliers(comparison, 'Revenue Growth');
 * ```
 */
export declare function identifyPeerOutliers(comparison: PeerComparisonData, metric: string): Promise<Array<{
    organization: string;
    value: number;
    deviation: string;
}>>;
/**
 * Creates best practice entry.
 *
 * @param {Partial<BestPracticeData>} data - Best practice data
 * @returns {Promise<BestPracticeData>} Best practice
 *
 * @example
 * ```typescript
 * const practice = await createBestPractice({
 *   name: 'Lean Six Sigma',
 *   category: 'Operational Excellence',
 *   ...
 * });
 * ```
 */
export declare function createBestPractice(data: Partial<BestPracticeData>): Promise<BestPracticeData>;
/**
 * Identifies relevant best practices for organization.
 *
 * @param {string} industry - Industry
 * @param {string[]} challenges - Organizational challenges
 * @returns {Promise<BestPracticeData[]>} Relevant practices
 *
 * @example
 * ```typescript
 * const practices = await identifyRelevantBestPractices('Healthcare', challenges);
 * ```
 */
export declare function identifyRelevantBestPractices(industry: string, challenges: string[]): Promise<BestPracticeData[]>;
/**
 * Assesses best practice applicability.
 *
 * @param {BestPracticeData} practice - Best practice
 * @param {Record<string, any>} organizationContext - Organization context
 * @returns {Promise<{ applicability: number; barriers: string[]; enablers: string[] }>} Applicability assessment
 *
 * @example
 * ```typescript
 * const assessment = await assessBestPracticeApplicability(practice, context);
 * ```
 */
export declare function assessBestPracticeApplicability(practice: BestPracticeData, organizationContext: Record<string, any>): Promise<{
    applicability: number;
    barriers: string[];
    enablers: string[];
}>;
/**
 * Generates best practice implementation roadmap.
 *
 * @param {BestPracticeData} practice - Best practice
 * @returns {Promise<{ phases: Array<{ phase: string; duration: string; activities: string[] }> }>} Implementation roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await generateImplementationRoadmap(practice);
 * ```
 */
export declare function generateImplementationRoadmap(practice: BestPracticeData): Promise<{
    phases: Array<{
        phase: string;
        duration: string;
        activities: string[];
    }>;
}>;
/**
 * Benchmarks best practice adoption rates.
 *
 * @param {string} category - Practice category
 * @param {string} industry - Industry
 * @returns {Promise<Array<{ practice: string; adoptionRate: number; trend: string }>>} Adoption benchmarks
 *
 * @example
 * ```typescript
 * const adoption = await benchmarkBestPracticeAdoption('Operational Excellence', 'Healthcare');
 * ```
 */
export declare function benchmarkBestPracticeAdoption(category: string, industry: string): Promise<Array<{
    practice: string;
    adoptionRate: number;
    trend: string;
}>>;
/**
 * Measures best practice impact.
 *
 * @param {string} practiceId - Practice identifier
 * @param {Record<string, number>} beforeMetrics - Metrics before implementation
 * @param {Record<string, number>} afterMetrics - Metrics after implementation
 * @returns {Promise<{ improvements: Array<{ metric: string; change: number; impact: string }> }>} Impact measurement
 *
 * @example
 * ```typescript
 * const impact = await measureBestPracticeImpact(practiceId, before, after);
 * ```
 */
export declare function measureBestPracticeImpact(practiceId: string, beforeMetrics: Record<string, number>, afterMetrics: Record<string, number>): Promise<{
    improvements: Array<{
        metric: string;
        change: number;
        impact: string;
    }>;
}>;
/**
 * Generates best practice case studies.
 *
 * @param {string} practiceId - Practice identifier
 * @param {number} limit - Number of case studies
 * @returns {Promise<Array<{ organization: string; challenge: string; solution: string; results: string }>>} Case studies
 *
 * @example
 * ```typescript
 * const cases = await generateBestPracticeCaseStudies('BP-001', 3);
 * ```
 */
export declare function generateBestPracticeCaseStudies(practiceId: string, limit: number): Promise<Array<{
    organization: string;
    challenge: string;
    solution: string;
    results: string;
}>>;
/**
 * Creates maturity assessment.
 *
 * @param {Partial<MaturityAssessmentData>} data - Assessment data
 * @returns {Promise<MaturityAssessmentData>} Maturity assessment
 *
 * @example
 * ```typescript
 * const assessment = await createMaturityAssessment({
 *   organizationId: 'uuid-org',
 *   framework: 'CMMI',
 *   ...
 * });
 * ```
 */
export declare function createMaturityAssessment(data: Partial<MaturityAssessmentData>): Promise<MaturityAssessmentData>;
/**
 * Assesses organizational maturity level.
 *
 * @param {string} dimension - Dimension to assess
 * @param {Record<string, number>} criteria - Assessment criteria scores
 * @returns {Promise<{ level: MaturityLevel; score: number; strengths: string[]; gaps: string[] }>} Maturity assessment
 *
 * @example
 * ```typescript
 * const maturity = await assessMaturityLevel('Process', criteria);
 * ```
 */
export declare function assessMaturityLevel(dimension: string, criteria: Record<string, number>): Promise<{
    level: MaturityLevel;
    score: number;
    strengths: string[];
    gaps: string[];
}>;
/**
 * Generates maturity improvement roadmap.
 *
 * @param {MaturityAssessmentData} assessment - Maturity assessment
 * @returns {Promise<Array<{ phase: string; targetLevel: MaturityLevel; initiatives: string[]; duration: string }>>} Improvement roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await generateMaturityRoadmap(assessment);
 * ```
 */
export declare function generateMaturityRoadmap(assessment: MaturityAssessmentData): Promise<Array<{
    phase: string;
    targetLevel: MaturityLevel;
    initiatives: string[];
    duration: string;
}>>;
/**
 * Benchmarks maturity against industry.
 *
 * @param {MaturityAssessmentData} assessment - Organization assessment
 * @param {string} industry - Industry
 * @returns {Promise<{ industryAverage: MaturityLevel; percentile: number; leaders: MaturityLevel }>} Maturity benchmark
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkMaturity(assessment, 'Healthcare');
 * ```
 */
export declare function benchmarkMaturity(assessment: MaturityAssessmentData, industry: string): Promise<{
    industryAverage: MaturityLevel;
    percentile: number;
    leaders: MaturityLevel;
}>;
/**
 * Identifies maturity gaps and priorities.
 *
 * @param {MaturityAssessmentData} assessment - Maturity assessment
 * @returns {Promise<Array<{ dimension: string; gap: number; priority: string; quickWins: string[] }>>} Gap analysis
 *
 * @example
 * ```typescript
 * const gaps = await identifyMaturityGaps(assessment);
 * ```
 */
export declare function identifyMaturityGaps(assessment: MaturityAssessmentData): Promise<Array<{
    dimension: string;
    gap: number;
    priority: string;
    quickWins: string[];
}>>;
/**
 * Creates performance gap analysis.
 *
 * @param {Partial<PerformanceGapData>} data - Gap data
 * @returns {Promise<PerformanceGapData>} Performance gap
 *
 * @example
 * ```typescript
 * const gap = await createPerformanceGap({
 *   metric: 'Customer Satisfaction',
 *   current: 72,
 *   target: 85,
 *   ...
 * });
 * ```
 */
export declare function createPerformanceGap(data: Partial<PerformanceGapData>): Promise<PerformanceGapData>;
/**
 * Performs root cause analysis for gaps.
 *
 * @param {PerformanceGapData} gap - Performance gap
 * @param {string[]} potentialCauses - Potential root causes
 * @returns {Promise<Array<{ cause: string; likelihood: number; impact: string }>>} Root cause analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeGapRootCauses(gap, causes);
 * ```
 */
export declare function analyzeGapRootCauses(gap: PerformanceGapData, potentialCauses: string[]): Promise<Array<{
    cause: string;
    likelihood: number;
    impact: string;
}>>;
/**
 * Prioritizes performance gaps.
 *
 * @param {PerformanceGapData[]} gaps - Array of gaps
 * @returns {Promise<Array<{ gapId: string; metric: string; priority: number; rationale: string }>>} Prioritized gaps
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizePerformanceGaps(gaps);
 * ```
 */
export declare function prioritizePerformanceGaps(gaps: PerformanceGapData[]): Promise<Array<{
    gapId: string;
    metric: string;
    priority: number;
    rationale: string;
}>>;
/**
 * Generates gap closure action plan.
 *
 * @param {PerformanceGapData} gap - Performance gap
 * @returns {Promise<{ actions: Array<{ action: string; owner: string; timeline: string; metrics: string[] }> }>} Action plan
 *
 * @example
 * ```typescript
 * const plan = await generateGapClosurePlan(gap);
 * ```
 */
export declare function generateGapClosurePlan(gap: PerformanceGapData): Promise<{
    actions: Array<{
        action: string;
        owner: string;
        timeline: string;
        metrics: string[];
    }>;
}>;
/**
 * Tracks gap closure progress.
 *
 * @param {string} gapId - Gap identifier
 * @param {number} currentValue - Current metric value
 * @param {number} targetValue - Target metric value
 * @returns {Promise<{ progress: number; onTrack: boolean; eta: string; velocity: number }>} Progress tracking
 *
 * @example
 * ```typescript
 * const progress = await trackGapClosureProgress('GAP-001', 75, 85);
 * ```
 */
export declare function trackGapClosureProgress(gapId: string, currentValue: number, targetValue: number): Promise<{
    progress: number;
    onTrack: boolean;
    eta: string;
    velocity: number;
}>;
/**
 * Creates KPI benchmark.
 *
 * @param {Partial<KPIBenchmarkData>} data - KPI benchmark data
 * @returns {Promise<KPIBenchmarkData>} KPI benchmark
 *
 * @example
 * ```typescript
 * const kpi = await createKPIBenchmark({
 *   kpiName: 'Revenue per Employee',
 *   category: MetricCategory.FINANCIAL,
 *   ...
 * });
 * ```
 */
export declare function createKPIBenchmark(data: Partial<KPIBenchmarkData>): Promise<KPIBenchmarkData>;
/**
 * Generates KPI dashboard data.
 *
 * @param {KPIBenchmarkData[]} kpis - Array of KPIs
 * @returns {Promise<{ summary: any; alerts: string[]; insights: string[] }>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateKPIDashboard(kpis);
 * ```
 */
export declare function generateKPIDashboard(kpis: KPIBenchmarkData[]): Promise<{
    summary: any;
    alerts: string[];
    insights: string[];
}>;
/**
 * Identifies KPI improvement opportunities.
 *
 * @param {KPIBenchmarkData[]} kpis - Array of KPIs
 * @returns {Promise<Array<{ kpi: string; opportunity: number; priority: string; actions: string[] }>>} Opportunities
 *
 * @example
 * ```typescript
 * const opportunities = await identifyKPIOpportunities(kpis);
 * ```
 */
export declare function identifyKPIOpportunities(kpis: KPIBenchmarkData[]): Promise<Array<{
    kpi: string;
    opportunity: number;
    priority: string;
    actions: string[];
}>>;
/**
 * Generates KPI trend analysis.
 *
 * @param {string} kpiId - KPI identifier
 * @param {Array<{ period: string; value: number }>} historicalData - Historical values
 * @returns {Promise<{ trend: string; growth: number; forecast: number; volatility: number }>} Trend analysis
 *
 * @example
 * ```typescript
 * const trend = await analyzeKPITrend('KPI-001', historical);
 * ```
 */
export declare function analyzeKPITrend(kpiId: string, historicalData: Array<{
    period: string;
    value: number;
}>): Promise<{
    trend: string;
    growth: number;
    forecast: number;
    volatility: number;
}>;
/**
 * Compares KPIs across time periods.
 *
 * @param {KPIBenchmarkData} currentPeriod - Current period KPI
 * @param {KPIBenchmarkData} previousPeriod - Previous period KPI
 * @returns {Promise<{ change: number; changePercent: number; significance: string; interpretation: string }>} Period comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareKPIPeriods(current, previous);
 * ```
 */
export declare function compareKPIPeriods(currentPeriod: KPIBenchmarkData, previousPeriod: KPIBenchmarkData): Promise<{
    change: number;
    changePercent: number;
    significance: string;
    interpretation: string;
}>;
//# sourceMappingURL=benchmarking-kit.d.ts.map