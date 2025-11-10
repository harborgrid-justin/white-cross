/**
 * LOC: SECROI1234567890
 * File: /reuse/threat/security-roi-analysis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - @nestjs/config
 *   - sequelize
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Security ROI analysis services
 *   - Investment tracking modules
 *   - Risk reduction measurement services
 *   - Executive reporting modules
 *   - Budget optimization services
 *   - Security metrics aggregation platforms
 */
/**
 * Security Investment
 */
export interface SecurityInvestment {
    id: string;
    name: string;
    category: InvestmentCategory;
    type: InvestmentType;
    cost: InvestmentCost;
    implementation: ImplementationDetails;
    benefits: SecurityBenefit[];
    risks: RiskReduction[];
    timeline: InvestmentTimeline;
    metrics: InvestmentMetrics;
    status: InvestmentStatus;
    approvalChain: ApprovalRecord[];
    metadata?: Record<string, any>;
}
/**
 * Investment Categories
 */
export declare enum InvestmentCategory {
    PREVENTIVE = "PREVENTIVE",
    DETECTIVE = "DETECTIVE",
    CORRECTIVE = "CORRECTIVE",
    TECHNOLOGY = "TECHNOLOGY",
    PEOPLE = "PEOPLE",
    PROCESS = "PROCESS",
    COMPLIANCE = "COMPLIANCE",
    INFRASTRUCTURE = "INFRASTRUCTURE"
}
/**
 * Investment Types
 */
export declare enum InvestmentType {
    CAPEX = "CAPEX",// Capital Expenditure
    OPEX = "OPEX",// Operational Expenditure
    HYBRID = "HYBRID"
}
/**
 * Investment Cost Structure
 */
export interface InvestmentCost {
    initial: number;
    recurring: RecurringCost[];
    maintenance: number;
    training: number;
    integration: number;
    decommissioning: number;
    totalCost: number;
    currency: string;
    costBreakdown: CostItem[];
}
/**
 * Recurring Cost
 */
export interface RecurringCost {
    type: 'monthly' | 'quarterly' | 'annual';
    amount: number;
    description: string;
    startDate: Date;
    endDate?: Date;
}
/**
 * Cost Item
 */
export interface CostItem {
    category: string;
    description: string;
    amount: number;
    percentage: number;
}
/**
 * Implementation Details
 */
export interface ImplementationDetails {
    startDate: Date;
    completionDate?: Date;
    estimatedDuration: number;
    actualDuration?: number;
    resources: Resource[];
    milestones: Milestone[];
    dependencies: string[];
}
/**
 * Resource
 */
export interface Resource {
    type: 'personnel' | 'technology' | 'consultant' | 'other';
    name: string;
    allocation: number;
    cost: number;
}
/**
 * Milestone
 */
export interface Milestone {
    id: string;
    name: string;
    targetDate: Date;
    completedDate?: Date;
    status: 'pending' | 'in-progress' | 'completed' | 'delayed';
    deliverables: string[];
}
/**
 * Security Benefit
 */
export interface SecurityBenefit {
    id: string;
    type: BenefitType;
    description: string;
    quantified: boolean;
    value: number;
    timeframe: string;
    confidence: number;
    calculationMethod: string;
    assumptions: string[];
}
/**
 * Benefit Types
 */
export declare enum BenefitType {
    RISK_REDUCTION = "RISK_REDUCTION",
    COST_AVOIDANCE = "COST_AVOIDANCE",
    EFFICIENCY_GAIN = "EFFICIENCY_GAIN",
    COMPLIANCE = "COMPLIANCE",
    REPUTATION = "REPUTATION",
    BUSINESS_ENABLEMENT = "BUSINESS_ENABLEMENT",
    INCIDENT_REDUCTION = "INCIDENT_REDUCTION",
    PRODUCTIVITY = "PRODUCTIVITY"
}
/**
 * Risk Reduction
 */
export interface RiskReduction {
    id: string;
    riskId: string;
    riskName: string;
    category: string;
    currentRiskScore: number;
    targetRiskScore: number;
    actualRiskScore?: number;
    reductionPercentage: number;
    financialImpact: number;
    confidence: number;
    measuredAt?: Date;
}
/**
 * Investment Timeline
 */
export interface InvestmentTimeline {
    planningPhase: TimelinePhase;
    procurementPhase: TimelinePhase;
    implementationPhase: TimelinePhase;
    optimizationPhase: TimelinePhase;
    totalDuration: number;
}
/**
 * Timeline Phase
 */
export interface TimelinePhase {
    startDate: Date;
    endDate: Date;
    status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
    durationDays: number;
    keyActivities: string[];
}
/**
 * Investment Metrics
 */
export interface InvestmentMetrics {
    roi: number;
    npv: number;
    irr: number;
    paybackPeriod: number;
    costBenefitRatio: number;
    riskReductionScore: number;
    effectivenessScore: number;
    utilizationRate: number;
    calculatedAt: Date;
}
/**
 * Investment Status
 */
export declare enum InvestmentStatus {
    PROPOSED = "PROPOSED",
    APPROVED = "APPROVED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    OPERATIONAL = "OPERATIONAL",
    DECOMMISSIONED = "DECOMMISSIONED",
    REJECTED = "REJECTED",
    ON_HOLD = "ON_HOLD"
}
/**
 * Approval Record
 */
export interface ApprovalRecord {
    approver: string;
    role: string;
    decision: 'approved' | 'rejected' | 'pending';
    date?: Date;
    comments?: string;
    conditions?: string[];
}
/**
 * Security Incident Cost
 */
export interface IncidentCost {
    id: string;
    incidentId: string;
    incidentType: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    occurredAt: Date;
    detectedAt: Date;
    resolvedAt?: Date;
    costs: IncidentCostBreakdown;
    impactedSystems: string[];
    rootCause?: string;
    preventedBy?: string[];
}
/**
 * Incident Cost Breakdown
 */
export interface IncidentCostBreakdown {
    detection: number;
    containment: number;
    investigation: number;
    remediation: number;
    recovery: number;
    legalFees: number;
    regulatoryFines: number;
    notificationCosts: number;
    creditMonitoring: number;
    reputationDamage: number;
    businessDisruption: number;
    lostRevenue: number;
    total: number;
}
/**
 * ROI Analysis Result
 */
export interface ROIAnalysis {
    investmentId: string;
    investmentName: string;
    analysisDate: Date;
    period: AnalysisPeriod;
    financial: FinancialMetrics;
    risk: RiskMetrics;
    operational: OperationalMetrics;
    qualitative: QualitativeMetrics;
    overall: OverallAssessment;
    recommendations: string[];
}
/**
 * Analysis Period
 */
export interface AnalysisPeriod {
    startDate: Date;
    endDate: Date;
    durationMonths: number;
}
/**
 * Financial Metrics
 */
export interface FinancialMetrics {
    totalInvestment: number;
    totalBenefits: number;
    netBenefit: number;
    roi: number;
    npv: number;
    irr: number;
    paybackPeriod: number;
    costBenefitRatio: number;
    annualSavings: number;
}
/**
 * Risk Metrics
 */
export interface RiskMetrics {
    risksAddressed: number;
    avgRiskReduction: number;
    totalRiskReduction: number;
    incidentsPrevented: number;
    incidentCostAvoided: number;
    complianceRisksAddressed: number;
}
/**
 * Operational Metrics
 */
export interface OperationalMetrics {
    implementationTime: number;
    utilizationRate: number;
    efficiencyGain: number;
    automationLevel: number;
    falsePositiveRate: number;
    meanTimeToDetect: number;
    meanTimeToRespond: number;
}
/**
 * Qualitative Metrics
 */
export interface QualitativeMetrics {
    userSatisfaction: number;
    teamConfidence: number;
    stakeholderSupport: number;
    complianceImprovement: number;
    culturalImpact: number;
}
/**
 * Overall Assessment
 */
export interface OverallAssessment {
    score: number;
    rating: 'excellent' | 'good' | 'fair' | 'poor';
    confidence: number;
    recommendation: 'continue' | 'optimize' | 'review' | 'discontinue';
    keyFindings: string[];
}
/**
 * Security Metrics Dashboard
 */
export interface SecurityMetricsDashboard {
    organizationId: string;
    generatedAt: Date;
    period: AnalysisPeriod;
    executive: ExecutiveSummary;
    financial: DashboardFinancialMetrics;
    risk: DashboardRiskMetrics;
    operational: DashboardOperationalMetrics;
    compliance: ComplianceMetrics;
    trends: TrendAnalysis[];
}
/**
 * Executive Summary
 */
export interface ExecutiveSummary {
    totalSecuritySpend: number;
    securityROI: number;
    incidentsBlocked: number;
    costAvoidance: number;
    riskPosture: 'strong' | 'moderate' | 'weak';
    complianceStatus: 'compliant' | 'partial' | 'non-compliant';
    keyAchievements: string[];
    criticalConcerns: string[];
}
/**
 * Dashboard Financial Metrics
 */
export interface DashboardFinancialMetrics {
    totalInvestments: number;
    budgetUtilization: number;
    costPerUser: number;
    costPerAsset: number;
    preventedLosses: number;
    savingsRealized: number;
    forecastedROI: number;
}
/**
 * Dashboard Risk Metrics
 */
export interface DashboardRiskMetrics {
    currentRiskScore: number;
    riskTrend: 'improving' | 'stable' | 'degrading';
    highRiskItems: number;
    mitigatedRisks: number;
    residualRisk: number;
    riskAppetite: number;
    riskVelocity: number;
}
/**
 * Dashboard Operational Metrics
 */
export interface DashboardOperationalMetrics {
    securityIncidents: number;
    meanTimeToDetect: number;
    meanTimeToRespond: number;
    meanTimeToRecover: number;
    automationRate: number;
    toolEffectiveness: number;
    teamProductivity: number;
}
/**
 * Compliance Metrics
 */
export interface ComplianceMetrics {
    frameworks: ComplianceFrameworkStatus[];
    overallCompliance: number;
    controlsCovered: number;
    controlsGaps: number;
    auditFindings: number;
    remediationRate: number;
}
/**
 * Compliance Framework Status
 */
export interface ComplianceFrameworkStatus {
    framework: string;
    compliance: number;
    controls: number;
    gaps: number;
    lastAssessment: Date;
    nextAssessment?: Date;
}
/**
 * Trend Analysis
 */
export interface TrendAnalysis {
    metric: string;
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dataPoints: TrendDataPoint[];
    trend: 'upward' | 'downward' | 'stable';
    percentageChange: number;
    forecast?: number[];
}
/**
 * Trend Data Point
 */
export interface TrendDataPoint {
    date: Date;
    value: number;
    label?: string;
}
/**
 * Budget Optimization Recommendation
 */
export interface BudgetOptimization {
    currentAllocation: BudgetAllocation[];
    recommendedAllocation: BudgetAllocation[];
    potentialSavings: number;
    expectedROIImprovement: number;
    riskImpact: string;
    rationale: string[];
    actions: OptimizationAction[];
}
/**
 * Budget Allocation
 */
export interface BudgetAllocation {
    category: InvestmentCategory;
    amount: number;
    percentage: number;
    effectiveness: number;
}
/**
 * Optimization Action
 */
export interface OptimizationAction {
    action: 'increase' | 'decrease' | 'reallocate' | 'eliminate';
    category: InvestmentCategory;
    amount: number;
    expectedImpact: string;
    priority: 'high' | 'medium' | 'low';
    timeframe: string;
}
/**
 * Validates security investment configuration
 */
export declare function validateSecurityInvestment(investment: SecurityInvestment): {
    valid: boolean;
    errors: string[];
};
/**
 * Validates ROI analysis period
 */
export declare function validateAnalysisPeriod(period: AnalysisPeriod): {
    valid: boolean;
    errors: string[];
};
/**
 * Calculates Return on Investment (ROI)
 */
export declare function calculateROI(totalBenefits: number, totalCost: number): number;
/**
 * Calculates Net Present Value (NPV)
 */
export declare function calculateNPV(initialInvestment: number, cashFlows: number[], discountRate: number): number;
/**
 * Calculates Internal Rate of Return (IRR)
 */
export declare function calculateIRR(initialInvestment: number, cashFlows: number[], precision?: number): number;
/**
 * Calculates payback period in months
 */
export declare function calculatePaybackPeriod(initialInvestment: number, monthlyCashFlows: number[]): number;
/**
 * Calculates cost-benefit ratio
 */
export declare function calculateCostBenefitRatio(totalBenefits: number, totalCost: number): number;
/**
 * Calculates total cost of ownership over period
 */
export declare function calculateTotalCostOfOwnership(cost: InvestmentCost, durationYears: number): number;
/**
 * Generates cash flow projections
 */
export declare function generateCashFlowProjections(investment: SecurityInvestment, years: number): number[];
/**
 * Creates security investment record
 */
export declare function createSecurityInvestment(config: {
    name: string;
    category: InvestmentCategory;
    type: InvestmentType;
    initialCost: number;
    startDate: Date;
    estimatedDuration: number;
    benefits?: SecurityBenefit[];
}): SecurityInvestment;
/**
 * Adds recurring cost to investment
 */
export declare function addRecurringCost(investment: SecurityInvestment, cost: RecurringCost): SecurityInvestment;
/**
 * Tracks investment milestone completion
 */
export declare function updateMilestoneStatus(investment: SecurityInvestment, milestoneId: string, status: 'completed' | 'delayed', completedDate?: Date): SecurityInvestment;
/**
 * Calculates investment utilization rate
 */
export declare function calculateUtilizationRate(investment: SecurityInvestment, actualUsage: number, maxCapacity: number): number;
/**
 * Performs comprehensive cost-benefit analysis
 */
export declare function performCostBenefitAnalysis(investment: SecurityInvestment, period: AnalysisPeriod, discountRate?: number): ROIAnalysis;
/**
 * Calculates avoided costs from prevented incidents
 */
export declare function calculateAvoidedCosts(preventedIncidents: IncidentCost[]): number;
/**
 * Estimates benefit value from risk reduction
 */
export declare function estimateBenefitFromRiskReduction(riskReduction: RiskReduction): SecurityBenefit;
/**
 * Calculates total quantified benefits
 */
export declare function calculateTotalBenefits(benefits: SecurityBenefit[], years?: number): number;
/**
 * Creates risk reduction record
 */
export declare function createRiskReduction(config: {
    riskId: string;
    riskName: string;
    category: string;
    currentRiskScore: number;
    targetRiskScore: number;
    financialImpact: number;
    confidence: number;
}): RiskReduction;
/**
 * Measures actual risk reduction
 */
export declare function measureRiskReduction(riskReduction: RiskReduction, actualRiskScore: number): RiskReduction;
/**
 * Calculates aggregate risk reduction score
 */
export declare function calculateAggregateRiskReduction(reductions: RiskReduction[]): number;
/**
 * Calculates risk velocity (rate of risk change)
 */
export declare function calculateRiskVelocity(historicalScores: TrendDataPoint[]): number;
/**
 * Aggregates security metrics for dashboard
 */
export declare function aggregateSecurityMetrics(investments: SecurityInvestment[], incidents: IncidentCost[], period: AnalysisPeriod): SecurityMetricsDashboard;
/**
 * Calculates mean time to detect
 */
export declare function calculateMTTD(incidents: IncidentCost[]): number;
/**
 * Calculates mean time to respond
 */
export declare function calculateMTTR(incidents: IncidentCost[]): number;
/**
 * Generates trend analysis
 */
export declare function generateTrendAnalysis(metric: string, dataPoints: TrendDataPoint[], period: 'daily' | 'weekly' | 'monthly' | 'quarterly'): TrendAnalysis;
/**
 * Generates executive summary report
 */
export declare function generateExecutiveSummary(dashboard: SecurityMetricsDashboard): ExecutiveSummary;
/**
 * Creates executive dashboard view
 */
export declare function createExecutiveDashboardView(metrics: SecurityMetricsDashboard): {
    kpis: Array<{
        name: string;
        value: string;
        trend: string;
        status: 'good' | 'warning' | 'critical';
    }>;
    charts: Array<{
        type: string;
        title: string;
        data: any;
    }>;
};
/**
 * Analyzes budget allocation effectiveness
 */
export declare function analyzeBudgetAllocation(investments: SecurityInvestment[]): BudgetAllocation[];
/**
 * Generates budget optimization recommendations
 */
export declare function generateBudgetOptimization(currentAllocation: BudgetAllocation[], targetROI: number): BudgetOptimization;
/**
 * Exports configuration examples
 */
export declare const ROI_CONFIG_EXAMPLES: {
    investment: {
        name: string;
        category: InvestmentCategory;
        type: InvestmentType;
        initialCost: number;
        startDate: Date;
        estimatedDuration: number;
    };
    recurringCost: {
        type: "annual";
        amount: number;
        description: string;
        startDate: Date;
    };
    benefit: {
        type: BenefitType;
        description: string;
        quantified: boolean;
        value: number;
        timeframe: string;
        confidence: number;
        calculationMethod: string;
        assumptions: string[];
    };
    riskReduction: {
        riskId: string;
        riskName: string;
        category: string;
        currentRiskScore: number;
        targetRiskScore: number;
        financialImpact: number;
        confidence: number;
    };
};
/**
 * Default configuration for development
 */
export declare const DEFAULT_ROI_CONFIG: {
    discountRate: number;
    analysisYears: number;
    minimumROI: number;
    targetPaybackMonths: number;
    confidenceThreshold: number;
    currency: string;
};
//# sourceMappingURL=security-roi-analysis-kit.d.ts.map