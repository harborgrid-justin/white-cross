/**
 * LOC: CONS-COST-RED-001
 * File: /reuse/server/consulting/cost-reduction-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/cost-optimization.service.ts
 *   - backend/consulting/efficiency.controller.ts
 *   - backend/consulting/procurement.service.ts
 */
/**
 * File: /reuse/server/consulting/cost-reduction-kit.ts
 * Locator: WC-CONS-COSTRED-001
 * Purpose: Enterprise-grade Cost Reduction Kit - zero-based budgeting, process automation ROI, vendor optimization, cost benchmarking
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, cost optimization controllers, procurement processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 44 production-ready functions for cost reduction strategy competing with McKinsey, BCG, Bain consulting tools
 *
 * LLM Context: Comprehensive cost reduction utilities for production-ready management consulting applications.
 * Provides zero-based budgeting frameworks, process automation ROI analysis, vendor consolidation and optimization,
 * cost benchmarking, spend analysis, waste elimination, efficiency improvement initiatives, cost-to-serve modeling,
 * indirect spend optimization, and total cost of ownership analysis.
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * Cost category types
 */
export declare enum CostCategory {
    LABOR = "labor",
    TECHNOLOGY = "technology",
    FACILITIES = "facilities",
    MARKETING = "marketing",
    OPERATIONS = "operations",
    SALES = "sales",
    RD = "rd",
    ADMIN = "admin",
    TRAVEL = "travel",
    PROFESSIONAL_SERVICES = "professional_services"
}
/**
 * Cost reduction approaches
 */
export declare enum ReductionApproach {
    PROCESS_IMPROVEMENT = "process_improvement",
    AUTOMATION = "automation",
    VENDOR_OPTIMIZATION = "vendor_optimization",
    CONSOLIDATION = "consolidation",
    ELIMINATION = "elimination",
    OUTSOURCING = "outsourcing",
    INSOURCING = "insourcing",
    RENEGOTIATION = "renegotiation"
}
/**
 * Spend types
 */
export declare enum SpendType {
    DIRECT = "direct",
    INDIRECT = "indirect",
    CAPITAL = "capital",
    OPERATING = "operating"
}
/**
 * Vendor tier classifications
 */
export declare enum VendorTier {
    STRATEGIC = "strategic",
    PREFERRED = "preferred",
    APPROVED = "approved",
    TRANSACTIONAL = "transactional"
}
/**
 * Process efficiency levels
 */
export declare enum EfficiencyLevel {
    OPTIMIZED = "optimized",
    EFFICIENT = "efficient",
    AVERAGE = "average",
    INEFFICIENT = "inefficient",
    CRITICAL = "critical"
}
/**
 * Automation maturity levels
 */
export declare enum AutomationMaturity {
    MANUAL = "manual",
    PARTIAL = "partial",
    MOSTLY_AUTOMATED = "mostly_automated",
    FULLY_AUTOMATED = "fully_automated",
    INTELLIGENT = "intelligent"
}
/**
 * Waste types
 */
export declare enum WasteType {
    OVERPRODUCTION = "overproduction",
    WAITING = "waiting",
    TRANSPORTATION = "transportation",
    OVERPROCESSING = "overprocessing",
    INVENTORY = "inventory",
    MOTION = "motion",
    DEFECTS = "defects",
    UNDERUTILIZATION = "underutilization"
}
/**
 * Benchmarking types
 */
export declare enum BenchmarkType {
    INDUSTRY = "industry",
    PEER = "peer",
    BEST_IN_CLASS = "best_in_class",
    INTERNAL = "internal",
    FUNCTIONAL = "functional"
}
interface ZeroBasedBudgetData {
    budgetId: string;
    organizationId: string;
    fiscalYear: string;
    category: CostCategory;
    proposedBudget: number;
    justification: string[];
    businessDrivers: string[];
    alternatives: string[];
    expectedOutcomes: Record<string, any>;
    minimumViableSpend: number;
    incrementalValue: Array<{
        increment: number;
        value: string;
    }>;
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: 'draft' | 'review' | 'approved' | 'rejected';
}
interface ProcessAutomationROI {
    automationId: string;
    processName: string;
    currentState: {
        laborHours: number;
        laborCost: number;
        errorRate: number;
        cycleTime: number;
    };
    futureState: {
        laborHours: number;
        laborCost: number;
        errorRate: number;
        cycleTime: number;
    };
    implementationCost: number;
    annualSavings: number;
    paybackPeriod: number;
    roi: number;
    npv: number;
    qualitativeBenefits: string[];
    risks: string[];
    priority: number;
}
interface VendorOptimizationData {
    vendorId: string;
    vendorName: string;
    tier: VendorTier;
    annualSpend: number;
    contractValue: number;
    contractExpiration: Date;
    performanceScore: number;
    complianceScore: number;
    riskScore: number;
    consolidationOpportunity: number;
    renegotiationPotential: number;
    alternativeVendors: Array<{
        name: string;
        estimatedCost: number;
        switchingCost: number;
    }>;
    recommendations: string[];
}
interface CostBenchmarkData {
    benchmarkId: string;
    category: CostCategory;
    metric: string;
    organizationValue: number;
    industryMedian: number;
    industryTopQuartile: number;
    peerAverage: number;
    bestInClass: number;
    gap: number;
    gapPercentage: number;
    potentialSavings: number;
    type: BenchmarkType;
    dataSource: string;
    asOfDate: Date;
}
interface SpendAnalysisData {
    analysisId: string;
    organizationId: string;
    period: string;
    totalSpend: number;
    spendByCategory: Record<CostCategory, number>;
    spendByVendor: Record<string, number>;
    spendByDepartment: Record<string, number>;
    spendType: Record<SpendType, number>;
    topVendors: Array<{
        vendor: string;
        spend: number;
        share: number;
    }>;
    savingsOpportunities: Array<{
        area: string;
        potential: number;
        confidence: number;
    }>;
    trends: Record<string, number>;
}
interface WasteEliminationData {
    wasteId: string;
    processArea: string;
    wasteType: WasteType;
    annualCost: number;
    rootCauses: string[];
    eliminationApproach: string;
    implementationCost: number;
    expectedSavings: number;
    timeToImplement: number;
    difficulty: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    priority: number;
}
interface EfficiencyImprovementData {
    improvementId: string;
    processName: string;
    currentEfficiency: number;
    targetEfficiency: number;
    currentLevel: EfficiencyLevel;
    targetLevel: EfficiencyLevel;
    initiatives: string[];
    investmentRequired: number;
    annualBenefit: number;
    roi: number;
    timeframe: number;
    kpis: Record<string, {
        current: number;
        target: number;
    }>;
}
interface CostToServeAnalysis {
    customerId: string;
    customerSegment: string;
    revenue: number;
    directCosts: number;
    indirectCosts: number;
    totalCost: number;
    costToServe: number;
    profitability: number;
    profitMargin: number;
    costDrivers: Record<string, number>;
    optimizationOpportunities: string[];
    recommendedActions: string[];
}
interface IndirectSpendOptimization {
    categoryId: string;
    category: string;
    currentSpend: number;
    numberOfVendors: number;
    numberOfTransactions: number;
    averageTransactionSize: number;
    complianceRate: number;
    catalogAdoption: number;
    savingsOpportunity: number;
    consolidationPotential: number;
    processImprovements: string[];
}
interface TotalCostOfOwnership {
    assetId: string;
    assetName: string;
    assetType: string;
    acquisitionCost: number;
    operatingCosts: {
        annual: number;
        breakdown: Record<string, number>;
    };
    maintenanceCosts: number;
    trainingCosts: number;
    supportCosts: number;
    disposalCost: number;
    lifespan: number;
    tco: number;
    annualizedTCO: number;
    alternatives: Array<{
        name: string;
        tco: number;
        differential: number;
    }>;
}
interface BudgetVarianceAnalysis {
    varianceId: string;
    category: CostCategory;
    department: string;
    period: string;
    budgeted: number;
    actual: number;
    variance: number;
    variancePercentage: number;
    favorableUnfavorable: 'favorable' | 'unfavorable';
    rootCauses: string[];
    correctiveActions: string[];
    forecast: number;
}
interface VendorConsolidationPlan {
    planId: string;
    category: string;
    currentVendorCount: number;
    targetVendorCount: number;
    currentSpend: number;
    projectedSpend: number;
    estimatedSavings: number;
    implementationCost: number;
    timeframe: number;
    risks: string[];
    mitigationStrategies: string[];
    vendorsToConsolidate: string[];
    preferredVendors: string[];
}
interface ProcessRedesignOpportunity {
    opportunityId: string;
    processName: string;
    department: string;
    currentCost: number;
    currentCycleTime: number;
    currentQuality: number;
    targetCost: number;
    targetCycleTime: number;
    targetQuality: number;
    redesignApproach: string;
    expectedBenefits: Record<string, number>;
    implementationEffort: 'low' | 'medium' | 'high';
    priority: number;
}
interface OutsourcingAnalysis {
    analysisId: string;
    function: string;
    currentCost: number;
    currentQuality: number;
    currentFlexibility: number;
    outsourcedCost: number;
    outsourcedQuality: number;
    outsourcedFlexibility: number;
    transitionCost: number;
    ongoingManagementCost: number;
    totalCostComparison: number;
    recommendation: 'outsource' | 'keep_insource' | 'hybrid';
    strategicFit: number;
    riskAssessment: Record<string, string>;
}
interface CostAvoidanceInitiative {
    initiativeId: string;
    name: string;
    description: string;
    category: CostCategory;
    avoidedCost: number;
    baseline: string;
    rationale: string;
    verificationMethod: string;
    timeframe: string;
    status: 'proposed' | 'approved' | 'implemented' | 'verified';
}
interface CapacityOptimization {
    resourceId: string;
    resourceType: string;
    currentCapacity: number;
    utilization: number;
    optimalCapacity: number;
    excessCapacity: number;
    costPerUnit: number;
    savingsPotential: number;
    rightsizingRecommendation: string;
    implementationComplexity: 'low' | 'medium' | 'high';
}
interface ProcurementEfficiency {
    categoryId: string;
    category: string;
    processEfficiency: number;
    cycleTime: number;
    complianceRate: number;
    savingsRealized: number;
}
/**
 * Zero-Based Budget DTO
 */
export declare class ZeroBasedBudgetDto {
    organizationId: string;
    fiscalYear: string;
    category: CostCategory;
    proposedBudget: number;
    justification: string[];
    businessDrivers: string[];
    minimumViableSpend: number;
    priority: 'critical' | 'high' | 'medium' | 'low';
}
/**
 * Process Automation ROI DTO
 */
export declare class ProcessAutomationROIDto {
    processName: string;
    currentLaborHours: number;
    laborCost: number;
    currentErrorRate: number;
    laborReduction: number;
    implementationCost: number;
}
/**
 * Vendor Optimization DTO
 */
export declare class VendorOptimizationDto {
    vendorId: string;
    vendorName: string;
    tier: VendorTier;
    annualSpend: number;
    contractValue: number;
    contractExpiration: Date;
    performanceScore: number;
}
/**
 * Cost Benchmark DTO
 */
export declare class CostBenchmarkDto {
    category: CostCategory;
    metric: string;
    organizationValue: number;
    industryMedian: number;
    type: BenchmarkType;
}
/**
 * Spend Analysis DTO
 */
export declare class SpendAnalysisDto {
    organizationId: string;
    period: string;
    totalSpend: number;
}
/**
 * Waste Elimination DTO
 */
export declare class WasteEliminationDto {
    processArea: string;
    wasteType: WasteType;
    annualCost: number;
    implementationCost: number;
    expectedSavings: number;
}
/**
 * Efficiency Improvement DTO
 */
export declare class EfficiencyImprovementDto {
    processName: string;
    currentEfficiency: number;
    targetEfficiency: number;
    investmentRequired: number;
    annualBenefit: number;
}
/**
 * Cost-to-Serve DTO
 */
export declare class CostToServeDto {
    customerId: string;
    customerSegment: string;
    revenue: number;
    directCosts: number;
    indirectCosts: number;
}
/**
 * TCO Analysis DTO
 */
export declare class TCOAnalysisDto {
    assetId: string;
    assetName: string;
    assetType: string;
    acquisitionCost: number;
    annualOperatingCosts: number;
    lifespan: number;
}
/**
 * Zero-Based Budget Sequelize Model
 */
export declare class ZeroBasedBudgetModel extends Model {
    budgetId: string;
    organizationId: string;
    fiscalYear: string;
    category: CostCategory;
    proposedBudget: number;
    justification: string[];
    businessDrivers: string[];
    alternatives: string[];
    expectedOutcomes: Record<string, any>;
    minimumViableSpend: number;
    priority: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare function initZeroBasedBudgetModel(sequelize: Sequelize): typeof ZeroBasedBudgetModel;
/**
 * Vendor Optimization Sequelize Model
 */
export declare class VendorOptimizationModel extends Model {
    vendorId: string;
    vendorName: string;
    tier: VendorTier;
    annualSpend: number;
    contractValue: number;
    contractExpiration: Date;
    performanceScore: number;
    complianceScore: number;
    riskScore: number;
    consolidationOpportunity: number;
    renegotiationPotential: number;
    recommendations: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare function initVendorOptimizationModel(sequelize: Sequelize): typeof VendorOptimizationModel;
/**
 * Creates zero-based budget proposal.
 *
 * @swagger
 * @openapi
 * /api/cost-reduction/zero-based-budget:
 *   post:
 *     tags:
 *       - Cost Reduction
 *     summary: Create zero-based budget
 *     description: Develops zero-based budget proposal with justification and incremental value analysis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ZeroBasedBudgetDto'
 *     responses:
 *       201:
 *         description: Zero-based budget created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 budgetId:
 *                   type: string
 *                 proposedBudget:
 *                   type: number
 *                 minimumViableSpend:
 *                   type: number
 *
 * @param {Partial<ZeroBasedBudgetData>} data - Budget data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ZeroBasedBudgetData>} Created budget
 *
 * @example
 * ```typescript
 * const budget = await createZeroBasedBudget({
 *   organizationId: 'org-123',
 *   fiscalYear: 'FY2024',
 *   category: CostCategory.TECHNOLOGY,
 *   proposedBudget: 1000000,
 *   minimumViableSpend: 500000
 * });
 * console.log(`Budget ${budget.budgetId}: $${budget.proposedBudget}`);
 * ```
 */
export declare function createZeroBasedBudget(data: Partial<ZeroBasedBudgetData>, transaction?: Transaction): Promise<ZeroBasedBudgetData>;
/**
 * Calculates ROI for process automation initiatives.
 *
 * @swagger
 * @openapi
 * /api/cost-reduction/automation-roi:
 *   post:
 *     tags:
 *       - Cost Reduction
 *     summary: Calculate automation ROI
 *     description: Analyzes return on investment for process automation including labor savings, error reduction, and cycle time improvements
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProcessAutomationROIDto'
 *     responses:
 *       200:
 *         description: Automation ROI analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 annualSavings:
 *                   type: number
 *                 paybackPeriod:
 *                   type: number
 *                 roi:
 *                   type: number
 *
 * @param {Partial<ProcessAutomationROI>} data - Automation ROI data
 * @returns {Promise<ProcessAutomationROI>} ROI analysis
 *
 * @example
 * ```typescript
 * const roi = await calculateAutomationROI({
 *   processName: 'Invoice Processing',
 *   currentLaborHours: 2000,
 *   laborCost: 50,
 *   currentErrorRate: 0.05,
 *   laborReduction: 0.80,
 *   implementationCost: 100000
 * });
 * console.log(`ROI: ${roi.roi}%, Payback: ${roi.paybackPeriod} months`);
 * ```
 */
export declare function calculateAutomationROI(data: Partial<ProcessAutomationROI>): Promise<ProcessAutomationROI>;
/**
 * Analyzes vendor optimization opportunities.
 *
 * @swagger
 * @openapi
 * /api/cost-reduction/vendor-optimization/{vendorId}:
 *   get:
 *     tags:
 *       - Cost Reduction
 *     summary: Analyze vendor optimization
 *     description: Evaluates vendor performance, identifies consolidation opportunities, and estimates renegotiation potential
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor optimization analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 consolidationOpportunity:
 *                   type: number
 *                 renegotiationPotential:
 *                   type: number
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: string
 *
 * @param {Partial<VendorOptimizationData>} data - Vendor data
 * @returns {Promise<VendorOptimizationData>} Vendor optimization analysis
 *
 * @example
 * ```typescript
 * const optimization = await analyzeVendorOptimization({
 *   vendorId: 'vendor-123',
 *   annualSpend: 500000,
 *   performanceScore: 85,
 *   tier: VendorTier.STRATEGIC
 * });
 * console.log(`Savings potential: $${optimization.consolidationOpportunity + optimization.renegotiationPotential}`);
 * ```
 */
export declare function analyzeVendorOptimization(data: Partial<VendorOptimizationData>): Promise<VendorOptimizationData>;
/**
 * Performs cost benchmarking analysis.
 *
 * @swagger
 * @openapi
 * /api/cost-reduction/benchmark:
 *   post:
 *     tags:
 *       - Cost Reduction
 *     summary: Benchmark costs
 *     description: Compares costs against industry benchmarks and identifies savings opportunities
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CostBenchmarkDto'
 *     responses:
 *       200:
 *         description: Cost benchmark analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gap:
 *                   type: number
 *                 gapPercentage:
 *                   type: number
 *                 potentialSavings:
 *                   type: number
 *
 * @param {Partial<CostBenchmarkData>} data - Benchmark data
 * @returns {Promise<CostBenchmarkData>} Benchmark analysis
 *
 * @example
 * ```typescript
 * const benchmark = await performCostBenchmarking({
 *   category: CostCategory.TECHNOLOGY,
 *   metric: 'IT Spend as % of Revenue',
 *   organizationValue: 5.5,
 *   industryMedian: 4.2
 * });
 * console.log(`Gap: ${benchmark.gapPercentage}%, Savings: $${benchmark.potentialSavings}`);
 * ```
 */
export declare function performCostBenchmarking(data: Partial<CostBenchmarkData>): Promise<CostBenchmarkData>;
/**
 * Analyzes organizational spend patterns.
 *
 * @swagger
 * @openapi
 * /api/cost-reduction/spend-analysis:
 *   post:
 *     tags:
 *       - Cost Reduction
 *     summary: Analyze spend
 *     description: Comprehensive spend analysis across categories, vendors, and departments with savings identification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpendAnalysisDto'
 *     responses:
 *       200:
 *         description: Spend analysis results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSpend:
 *                   type: number
 *                 topVendors:
 *                   type: array
 *                 savingsOpportunities:
 *                   type: array
 *
 * @param {Partial<SpendAnalysisData>} data - Spend analysis data
 * @returns {Promise<SpendAnalysisData>} Spend analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeSpendPatterns({
 *   organizationId: 'org-123',
 *   period: '2024-Q1',
 *   totalSpend: 10000000
 * });
 * console.log(`Total spend: $${analysis.totalSpend}, Opportunities: ${analysis.savingsOpportunities.length}`);
 * ```
 */
export declare function analyzeSpendPatterns(data: Partial<SpendAnalysisData>): Promise<SpendAnalysisData>;
/**
 * Identifies waste elimination opportunities.
 *
 * @swagger
 * @openapi
 * /api/cost-reduction/waste-elimination:
 *   post:
 *     tags:
 *       - Cost Reduction
 *     summary: Identify waste
 *     description: Identifies and quantifies waste using lean methodology (8 wastes framework)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WasteEliminationDto'
 *     responses:
 *       200:
 *         description: Waste elimination opportunities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 annualCost:
 *                   type: number
 *                 expectedSavings:
 *                   type: number
 *                 priority:
 *                   type: number
 *
 * @param {Partial<WasteEliminationData>} data - Waste elimination data
 * @returns {Promise<WasteEliminationData>} Waste elimination opportunity
 *
 * @example
 * ```typescript
 * const waste = await identifyWasteElimination({
 *   processArea: 'Manufacturing',
 *   wasteType: WasteType.WAITING,
 *   annualCost: 250000,
 *   implementationCost: 50000
 * });
 * console.log(`Waste cost: $${waste.annualCost}, Savings: $${waste.expectedSavings}`);
 * ```
 */
export declare function identifyWasteElimination(data: Partial<WasteEliminationData>): Promise<WasteEliminationData>;
/**
 * Develops efficiency improvement initiatives.
 *
 * @swagger
 * @openapi
 * /api/cost-reduction/efficiency-improvement:
 *   post:
 *     tags:
 *       - Cost Reduction
 *     summary: Plan efficiency improvements
 *     description: Identifies efficiency improvement opportunities with ROI and implementation roadmap
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EfficiencyImprovementDto'
 *     responses:
 *       200:
 *         description: Efficiency improvement plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roi:
 *                   type: number
 *                 annualBenefit:
 *                   type: number
 *                 initiatives:
 *                   type: array
 *
 * @param {Partial<EfficiencyImprovementData>} data - Efficiency improvement data
 * @returns {Promise<EfficiencyImprovementData>} Efficiency improvement plan
 *
 * @example
 * ```typescript
 * const improvement = await developEfficiencyImprovement({
 *   processName: 'Order Fulfillment',
 *   currentEfficiency: 0.65,
 *   targetEfficiency: 0.85,
 *   investmentRequired: 150000,
 *   annualBenefit: 300000
 * });
 * console.log(`ROI: ${improvement.roi}%, Timeframe: ${improvement.timeframe} months`);
 * ```
 */
export declare function developEfficiencyImprovement(data: Partial<EfficiencyImprovementData>): Promise<EfficiencyImprovementData>;
/**
 * Analyzes cost-to-serve by customer.
 *
 * @swagger
 * @openapi
 * /api/cost-reduction/cost-to-serve/{customerId}:
 *   get:
 *     tags:
 *       - Cost Reduction
 *     summary: Analyze cost-to-serve
 *     description: Calculates full cost-to-serve for customers and identifies optimization opportunities
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cost-to-serve analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 costToServe:
 *                   type: number
 *                 profitMargin:
 *                   type: number
 *                 optimizationOpportunities:
 *                   type: array
 *
 * @param {Partial<CostToServeAnalysis>} data - Cost-to-serve data
 * @returns {Promise<CostToServeAnalysis>} Cost-to-serve analysis
 *
 * @example
 * ```typescript
 * const cts = await analyzeCostToServe({
 *   customerId: 'cust-123',
 *   revenue: 500000,
 *   directCosts: 200000,
 *   indirectCosts: 100000
 * });
 * console.log(`Cost-to-serve: $${cts.costToServe}, Margin: ${cts.profitMargin}%`);
 * ```
 */
export declare function analyzeCostToServe(data: Partial<CostToServeAnalysis>): Promise<CostToServeAnalysis>;
/**
 * Optimizes indirect spend categories.
 *
 * @swagger
 * @openapi
 * /api/cost-reduction/indirect-spend:
 *   post:
 *     tags:
 *       - Cost Reduction
 *     summary: Optimize indirect spend
 *     description: Analyzes indirect spend categories and identifies consolidation and process improvement opportunities
 *     responses:
 *       200:
 *         description: Indirect spend optimization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 savingsOpportunity:
 *                   type: number
 *                 consolidationPotential:
 *                   type: number
 *
 * @param {Partial<IndirectSpendOptimization>} data - Indirect spend data
 * @returns {Promise<IndirectSpendOptimization>} Optimization opportunities
 *
 * @example
 * ```typescript
 * const optimization = await optimizeIndirectSpend({
 *   category: 'Office Supplies',
 *   currentSpend: 500000,
 *   numberOfVendors: 25,
 *   complianceRate: 0.60
 * });
 * console.log(`Savings: $${optimization.savingsOpportunity}`);
 * ```
 */
export declare function optimizeIndirectSpend(data: Partial<IndirectSpendOptimization>): Promise<IndirectSpendOptimization>;
/**
 * Calculates total cost of ownership.
 *
 * @swagger
 * @openapi
 * /api/cost-reduction/tco-analysis:
 *   post:
 *     tags:
 *       - Cost Reduction
 *     summary: Calculate TCO
 *     description: Computes comprehensive total cost of ownership including acquisition, operations, maintenance, and disposal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TCOAnalysisDto'
 *     responses:
 *       200:
 *         description: TCO analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tco:
 *                   type: number
 *                 annualizedTCO:
 *                   type: number
 *
 * @param {Partial<TotalCostOfOwnership>} data - TCO data
 * @returns {Promise<TotalCostOfOwnership>} TCO analysis
 *
 * @example
 * ```typescript
 * const tco = await calculateTotalCostOfOwnership({
 *   assetName: 'Enterprise CRM System',
 *   acquisitionCost: 500000,
 *   annualOperatingCosts: 100000,
 *   lifespan: 5
 * });
 * console.log(`TCO: $${tco.tco}, Annualized: $${tco.annualizedTCO}`);
 * ```
 */
export declare function calculateTotalCostOfOwnership(data: Partial<TotalCostOfOwnership>): Promise<TotalCostOfOwnership>;
/**
 * Analyzes budget variance and identifies root causes.
 *
 * @swagger
 * @openapi
 * /api/cost-reduction/budget-variance:
 *   get:
 *     tags:
 *       - Cost Reduction
 *     summary: Analyze budget variance
 *     description: Identifies budget variances, root causes, and recommends corrective actions
 *     responses:
 *       200:
 *         description: Budget variance analysis
 *
 * @param {Partial<BudgetVarianceAnalysis>} data - Variance data
 * @returns {Promise<BudgetVarianceAnalysis>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await analyzeBudgetVariance({
 *   category: CostCategory.TECHNOLOGY,
 *   budgeted: 1000000,
 *   actual: 1200000
 * });
 * console.log(`Variance: ${variance.variancePercentage}% (${variance.favorableUnfavorable})`);
 * ```
 */
export declare function analyzeBudgetVariance(data: Partial<BudgetVarianceAnalysis>): Promise<BudgetVarianceAnalysis>;
/**
 * Develops vendor consolidation plan.
 *
 * @swagger
 * @openapi
 * /api/cost-reduction/vendor-consolidation:
 *   post:
 *     tags:
 *       - Cost Reduction
 *     summary: Plan vendor consolidation
 *     description: Creates vendor consolidation strategy with savings estimates and risk mitigation
 *
 * @param {Partial<VendorConsolidationPlan>} data - Consolidation plan data
 * @returns {Promise<VendorConsolidationPlan>} Consolidation plan
 *
 * @example
 * ```typescript
 * const plan = await developVendorConsolidationPlan({
 *   category: 'IT Services',
 *   currentVendorCount: 15,
 *   targetVendorCount: 5,
 *   currentSpend: 2000000
 * });
 * console.log(`Estimated savings: $${plan.estimatedSavings}`);
 * ```
 */
export declare function developVendorConsolidationPlan(data: Partial<VendorConsolidationPlan>): Promise<VendorConsolidationPlan>;
/**
 * Identifies process redesign opportunities.
 *
 * @param {Partial<ProcessRedesignOpportunity>} data - Process redesign data
 * @returns {Promise<ProcessRedesignOpportunity>} Redesign opportunity
 */
export declare function identifyProcessRedesign(data: Partial<ProcessRedesignOpportunity>): Promise<ProcessRedesignOpportunity>;
/**
 * Analyzes outsourcing vs insourcing decision.
 *
 * @param {Partial<OutsourcingAnalysis>} data - Outsourcing analysis data
 * @returns {Promise<OutsourcingAnalysis>} Outsourcing analysis
 */
export declare function analyzeOutsourcing(data: Partial<OutsourcingAnalysis>): Promise<OutsourcingAnalysis>;
/**
 * Tracks cost avoidance initiatives.
 *
 * @param {Partial<CostAvoidanceInitiative>} data - Cost avoidance data
 * @returns {Promise<CostAvoidanceInitiative>} Cost avoidance initiative
 */
export declare function trackCostAvoidance(data: Partial<CostAvoidanceInitiative>): Promise<CostAvoidanceInitiative>;
/**
 * Optimizes capacity utilization.
 *
 * @param {Partial<CapacityOptimization>} data - Capacity data
 * @returns {Promise<CapacityOptimization>} Capacity optimization
 */
export declare function optimizeCapacity(data: Partial<CapacityOptimization>): Promise<CapacityOptimization>;
/**
 * Analyzes procurement efficiency.
 *
 * @param {Partial<ProcurementEfficiency>} data - Procurement data
 * @returns {Promise<ProcurementEfficiency>} Procurement efficiency analysis
 */
export declare function analyzeProcurementEfficiency(data: Partial<ProcurementEfficiency>): Promise<ProcurementEfficiency>;
/**
 * Calculates cost per unit.
 *
 * @param {number} totalCost - Total cost
 * @param {number} units - Number of units
 * @returns {number} Cost per unit
 */
export declare function calculateCostPerUnit(totalCost: number, units: number): number;
/**
 * Calculates cost variance percentage.
 *
 * @param {number} actual - Actual cost
 * @param {number} budgeted - Budgeted cost
 * @returns {number} Variance percentage
 */
export declare function calculateCostVariance(actual: number, budgeted: number): number;
/**
 * Calculates cost savings percentage.
 *
 * @param {number} baseline - Baseline cost
 * @param {number} current - Current cost
 * @returns {number} Savings percentage
 */
export declare function calculateSavingsPercentage(baseline: number, current: number): number;
/**
 * Calculates break-even point.
 *
 * @param {number} fixedCosts - Fixed costs
 * @param {number} pricePerUnit - Price per unit
 * @param {number} variableCostPerUnit - Variable cost per unit
 * @returns {number} Break-even units
 */
export declare function calculateBreakEven(fixedCosts: number, pricePerUnit: number, variableCostPerUnit: number): number;
/**
 * Calculates efficiency ratio.
 *
 * @param {number} output - Output value
 * @param {number} input - Input value
 * @returns {number} Efficiency ratio (0-1)
 */
export declare function calculateEfficiencyRatio(output: number, input: number): number;
/**
 * Calculates utilization rate.
 *
 * @param {number} actualUsage - Actual usage
 * @param {number} availableCapacity - Available capacity
 * @returns {number} Utilization rate (0-1)
 */
export declare function calculateUtilizationRate(actualUsage: number, availableCapacity: number): number;
/**
 * Calculates cost reduction target.
 *
 * @param {number} currentCost - Current cost
 * @param {number} targetPercentage - Target reduction percentage
 * @returns {number} Target cost
 */
export declare function calculateCostReductionTarget(currentCost: number, targetPercentage: number): number;
/**
 * Calculates annualized savings.
 *
 * @param {number} monthlySavings - Monthly savings
 * @returns {number} Annualized savings
 */
export declare function calculateAnnualizedSavings(monthlySavings: number): number;
/**
 * Calculates cost avoidance value.
 *
 * @param {number} baselineCost - Baseline cost
 * @param {number} avoidedIncrease - Avoided increase percentage
 * @returns {number} Cost avoidance value
 */
export declare function calculateCostAvoidance(baselineCost: number, avoidedIncrease: number): number;
/**
 * Calculates productivity improvement.
 *
 * @param {number} currentProductivity - Current productivity
 * @param {number} improvedProductivity - Improved productivity
 * @returns {number} Improvement percentage
 */
export declare function calculateProductivityImprovement(currentProductivity: number, improvedProductivity: number): number;
/**
 * Calculates fully loaded cost.
 *
 * @param {number} directCost - Direct cost
 * @param {number} overheadRate - Overhead rate as decimal
 * @returns {number} Fully loaded cost
 */
export declare function calculateFullyLoadedCost(directCost: number, overheadRate: number): number;
/**
 * Ranks cost reduction initiatives by impact/effort.
 *
 * @param {Array<{impact: number, effort: number}>} initiatives - List of initiatives
 * @returns {Array<{impact: number, effort: number, score: number}>} Ranked initiatives
 */
export declare function rankCostReductionInitiatives(initiatives: Array<{
    impact: number;
    effort: number;
}>): Array<{
    impact: number;
    effort: number;
    score: number;
}>;
export {};
//# sourceMappingURL=cost-reduction-kit.d.ts.map