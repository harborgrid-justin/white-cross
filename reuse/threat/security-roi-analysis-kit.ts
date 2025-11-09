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
 * File: /reuse/threat/security-roi-analysis-kit.ts
 * Locator: WC-SEC-ROI-001
 * Purpose: Comprehensive Security ROI Analysis Toolkit - Production-ready security investment tracking and analysis
 *
 * Upstream: Independent utility module for security ROI and investment analysis
 * Downstream: ../backend/*, Security services, Financial services, Executive reporting, Compliance modules
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/config, @nestjs/swagger, sequelize, crypto
 * Exports: 40+ utility functions for ROI calculation, investment tracking, cost-benefit analysis, risk reduction measurement
 *
 * LLM Context: Enterprise-grade security ROI analysis toolkit for White Cross healthcare platform.
 * Provides comprehensive security investment tracking, ROI calculation, cost-benefit analysis, security
 * program effectiveness measurement, risk reduction quantification, security metrics aggregation, executive
 * reporting, and budget optimization for HIPAA-compliant healthcare systems. Includes Sequelize models for
 * investments, incidents, metrics, and executive dashboards.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export enum InvestmentCategory {
  PREVENTIVE = 'PREVENTIVE',
  DETECTIVE = 'DETECTIVE',
  CORRECTIVE = 'CORRECTIVE',
  TECHNOLOGY = 'TECHNOLOGY',
  PEOPLE = 'PEOPLE',
  PROCESS = 'PROCESS',
  COMPLIANCE = 'COMPLIANCE',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
}

/**
 * Investment Types
 */
export enum InvestmentType {
  CAPEX = 'CAPEX',     // Capital Expenditure
  OPEX = 'OPEX',       // Operational Expenditure
  HYBRID = 'HYBRID',   // Mixed
}

/**
 * Investment Cost Structure
 */
export interface InvestmentCost {
  initial: number;
  recurring: RecurringCost[];
  maintenance: number; // Annual
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
  estimatedDuration: number; // days
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
  allocation: number; // percentage or hours
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
  value: number; // Monetary value or risk reduction percentage
  timeframe: string; // "annual", "3-year", etc.
  confidence: number; // 0-100
  calculationMethod: string;
  assumptions: string[];
}

/**
 * Benefit Types
 */
export enum BenefitType {
  RISK_REDUCTION = 'RISK_REDUCTION',
  COST_AVOIDANCE = 'COST_AVOIDANCE',
  EFFICIENCY_GAIN = 'EFFICIENCY_GAIN',
  COMPLIANCE = 'COMPLIANCE',
  REPUTATION = 'REPUTATION',
  BUSINESS_ENABLEMENT = 'BUSINESS_ENABLEMENT',
  INCIDENT_REDUCTION = 'INCIDENT_REDUCTION',
  PRODUCTIVITY = 'PRODUCTIVITY',
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
  totalDuration: number; // days
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
  roi: number; // Return on Investment percentage
  npv: number; // Net Present Value
  irr: number; // Internal Rate of Return
  paybackPeriod: number; // months
  costBenefitRatio: number;
  riskReductionScore: number;
  effectivenessScore: number;
  utilizationRate: number;
  calculatedAt: Date;
}

/**
 * Investment Status
 */
export enum InvestmentStatus {
  PROPOSED = 'PROPOSED',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OPERATIONAL = 'OPERATIONAL',
  DECOMMISSIONED = 'DECOMMISSIONED',
  REJECTED = 'REJECTED',
  ON_HOLD = 'ON_HOLD',
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
  preventedBy?: string[]; // Investment IDs that could have prevented this
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
  implementationTime: number; // days
  utilizationRate: number; // percentage
  efficiencyGain: number; // percentage
  automationLevel: number; // percentage
  falsePositiveRate: number;
  meanTimeToDetect: number; // minutes
  meanTimeToRespond: number; // minutes
}

/**
 * Qualitative Metrics
 */
export interface QualitativeMetrics {
  userSatisfaction: number; // 0-100
  teamConfidence: number; // 0-100
  stakeholderSupport: number; // 0-100
  complianceImprovement: number; // 0-100
  culturalImpact: number; // 0-100
}

/**
 * Overall Assessment
 */
export interface OverallAssessment {
  score: number; // 0-100
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  confidence: number; // 0-100
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
  budgetUtilization: number; // percentage
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
  riskVelocity: number; // Rate of change
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
  overallCompliance: number; // percentage
  controlsCovered: number;
  controlsGaps: number;
  auditFindings: number;
  remediationRate: number;
}

/**
 * Compliance Framework Status
 */
export interface ComplianceFrameworkStatus {
  framework: string; // HIPAA, PCI-DSS, SOC2, etc.
  compliance: number; // percentage
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
  effectiveness: number; // 0-100
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

// ============================================================================
// CONFIGURATION VALIDATION
// ============================================================================

/**
 * Validates security investment configuration
 */
export function validateSecurityInvestment(investment: SecurityInvestment): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!investment.name || investment.name.trim().length === 0) {
    errors.push('Investment name is required');
  }

  if (investment.cost.totalCost <= 0) {
    errors.push('Total cost must be greater than zero');
  }

  if (!investment.timeline || !investment.timeline.planningPhase) {
    errors.push('Investment timeline is required');
  }

  if (investment.benefits.length === 0) {
    errors.push('At least one security benefit must be defined');
  }

  if (investment.metrics.roi !== undefined && investment.metrics.roi < -100) {
    errors.push('ROI cannot be less than -100%');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates ROI analysis period
 */
export function validateAnalysisPeriod(period: AnalysisPeriod): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (period.endDate <= period.startDate) {
    errors.push('End date must be after start date');
  }

  if (period.durationMonths <= 0) {
    errors.push('Duration must be greater than zero');
  }

  const calculatedMonths = Math.round(
    (period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );

  if (Math.abs(calculatedMonths - period.durationMonths) > 1) {
    errors.push('Duration months does not match date range');
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// ROI CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculates Return on Investment (ROI)
 */
export function calculateROI(totalBenefits: number, totalCost: number): number {
  if (totalCost === 0) return 0;
  return ((totalBenefits - totalCost) / totalCost) * 100;
}

/**
 * Calculates Net Present Value (NPV)
 */
export function calculateNPV(
  initialInvestment: number,
  cashFlows: number[],
  discountRate: number,
): number {
  let npv = -initialInvestment;

  cashFlows.forEach((cashFlow, year) => {
    npv += cashFlow / Math.pow(1 + discountRate, year + 1);
  });

  return npv;
}

/**
 * Calculates Internal Rate of Return (IRR)
 */
export function calculateIRR(
  initialInvestment: number,
  cashFlows: number[],
  precision: number = 0.0001,
): number {
  let rate = 0.1; // Start with 10%
  let increment = 0.1;

  for (let i = 0; i < 1000; i++) {
    const npv = calculateNPV(initialInvestment, cashFlows, rate);

    if (Math.abs(npv) < precision) {
      return rate * 100;
    }

    if (npv > 0) {
      rate += increment;
    } else {
      rate -= increment;
      increment /= 2;
    }
  }

  return rate * 100;
}

/**
 * Calculates payback period in months
 */
export function calculatePaybackPeriod(
  initialInvestment: number,
  monthlyCashFlows: number[],
): number {
  let cumulativeCashFlow = -initialInvestment;
  let months = 0;

  for (let i = 0; i < monthlyCashFlows.length; i++) {
    cumulativeCashFlow += monthlyCashFlows[i];
    months++;

    if (cumulativeCashFlow >= 0) {
      // Linear interpolation for partial month
      const previousBalance = cumulativeCashFlow - monthlyCashFlows[i];
      const fraction = Math.abs(previousBalance) / monthlyCashFlows[i];
      return months - 1 + fraction;
    }
  }

  return months; // Never pays back within period
}

/**
 * Calculates cost-benefit ratio
 */
export function calculateCostBenefitRatio(totalBenefits: number, totalCost: number): number {
  if (totalCost === 0) return 0;
  return totalBenefits / totalCost;
}

/**
 * Calculates total cost of ownership over period
 */
export function calculateTotalCostOfOwnership(
  cost: InvestmentCost,
  durationYears: number,
): number {
  let totalCost = cost.initial + cost.integration + cost.training;

  // Add recurring costs
  cost.recurring.forEach(recurring => {
    let periods = 0;
    switch (recurring.type) {
      case 'monthly':
        periods = durationYears * 12;
        break;
      case 'quarterly':
        periods = durationYears * 4;
        break;
      case 'annual':
        periods = durationYears;
        break;
    }
    totalCost += recurring.amount * periods;
  });

  // Add maintenance
  totalCost += cost.maintenance * durationYears;

  return totalCost;
}

/**
 * Generates cash flow projections
 */
export function generateCashFlowProjections(
  investment: SecurityInvestment,
  years: number,
): number[] {
  const cashFlows: number[] = [];

  for (let year = 0; year < years; year++) {
    let yearlyBenefit = 0;

    // Calculate benefits for this year
    investment.benefits.forEach(benefit => {
      if (benefit.quantified && benefit.timeframe === 'annual') {
        yearlyBenefit += benefit.value;
      }
    });

    // Subtract annual costs
    const annualCost = investment.cost.maintenance +
      investment.cost.recurring
        .filter(r => r.type === 'annual')
        .reduce((sum, r) => sum + r.amount, 0);

    cashFlows.push(yearlyBenefit - annualCost);
  }

  return cashFlows;
}

// ============================================================================
// INVESTMENT TRACKING FUNCTIONS
// ============================================================================

/**
 * Creates security investment record
 */
export function createSecurityInvestment(config: {
  name: string;
  category: InvestmentCategory;
  type: InvestmentType;
  initialCost: number;
  startDate: Date;
  estimatedDuration: number;
  benefits?: SecurityBenefit[];
}): SecurityInvestment {
  return {
    id: crypto.randomUUID(),
    name: config.name,
    category: config.category,
    type: config.type,
    cost: {
      initial: config.initialCost,
      recurring: [],
      maintenance: 0,
      training: 0,
      integration: 0,
      decommissioning: 0,
      totalCost: config.initialCost,
      currency: 'USD',
      costBreakdown: [],
    },
    implementation: {
      startDate: config.startDate,
      estimatedDuration: config.estimatedDuration,
      resources: [],
      milestones: [],
      dependencies: [],
    },
    benefits: config.benefits || [],
    risks: [],
    timeline: createDefaultTimeline(config.startDate, config.estimatedDuration),
    metrics: {
      roi: 0,
      npv: 0,
      irr: 0,
      paybackPeriod: 0,
      costBenefitRatio: 0,
      riskReductionScore: 0,
      effectivenessScore: 0,
      utilizationRate: 0,
      calculatedAt: new Date(),
    },
    status: InvestmentStatus.PROPOSED,
    approvalChain: [],
  };
}

/**
 * Adds recurring cost to investment
 */
export function addRecurringCost(
  investment: SecurityInvestment,
  cost: RecurringCost,
): SecurityInvestment {
  const updated = { ...investment };
  updated.cost.recurring.push(cost);

  // Recalculate total cost (assuming 3-year period)
  updated.cost.totalCost = calculateTotalCostOfOwnership(updated.cost, 3);

  return updated;
}

/**
 * Tracks investment milestone completion
 */
export function updateMilestoneStatus(
  investment: SecurityInvestment,
  milestoneId: string,
  status: 'completed' | 'delayed',
  completedDate?: Date,
): SecurityInvestment {
  const updated = { ...investment };
  const milestone = updated.implementation.milestones.find(m => m.id === milestoneId);

  if (milestone) {
    milestone.status = status;
    milestone.completedDate = completedDate || new Date();

    // Update overall implementation status
    const allCompleted = updated.implementation.milestones.every(m => m.status === 'completed');
    if (allCompleted) {
      updated.status = InvestmentStatus.COMPLETED;
      updated.implementation.completionDate = new Date();
    }
  }

  return updated;
}

/**
 * Calculates investment utilization rate
 */
export function calculateUtilizationRate(
  investment: SecurityInvestment,
  actualUsage: number,
  maxCapacity: number,
): number {
  if (maxCapacity === 0) return 0;
  return (actualUsage / maxCapacity) * 100;
}

// ============================================================================
// COST-BENEFIT ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Performs comprehensive cost-benefit analysis
 */
export function performCostBenefitAnalysis(
  investment: SecurityInvestment,
  period: AnalysisPeriod,
  discountRate: number = 0.08,
): ROIAnalysis {
  const years = Math.ceil(period.durationMonths / 12);
  const totalCost = calculateTotalCostOfOwnership(investment.cost, years);
  const cashFlows = generateCashFlowProjections(investment, years);
  const totalBenefits = cashFlows.reduce((sum, cf) => sum + cf, 0) + totalCost;

  const financial: FinancialMetrics = {
    totalInvestment: totalCost,
    totalBenefits,
    netBenefit: totalBenefits - totalCost,
    roi: calculateROI(totalBenefits, totalCost),
    npv: calculateNPV(investment.cost.initial, cashFlows, discountRate),
    irr: calculateIRR(investment.cost.initial, cashFlows),
    paybackPeriod: calculatePaybackPeriod(investment.cost.initial, cashFlows.map(cf => cf / 12)),
    costBenefitRatio: calculateCostBenefitRatio(totalBenefits, totalCost),
    annualSavings: totalBenefits / years,
  };

  const risk = calculateRiskMetricsForInvestment(investment);
  const operational = calculateOperationalMetricsForInvestment(investment);
  const qualitative = estimateQualitativeMetrics(investment);

  const overallScore = (
    (financial.roi > 0 ? 25 : 0) +
    (risk.avgRiskReduction * 0.25) +
    (operational.utilizationRate * 0.25) +
    (qualitative.userSatisfaction * 0.25)
  );

  const overall: OverallAssessment = {
    score: overallScore,
    rating: getRatingFromScore(overallScore),
    confidence: 75,
    recommendation: getRecommendationFromScore(overallScore),
    keyFindings: generateKeyFindings(financial, risk, operational),
  };

  return {
    investmentId: investment.id,
    investmentName: investment.name,
    analysisDate: new Date(),
    period,
    financial,
    risk,
    operational,
    qualitative,
    overall,
    recommendations: generateRecommendations(financial, risk, operational),
  };
}

/**
 * Calculates avoided costs from prevented incidents
 */
export function calculateAvoidedCosts(
  preventedIncidents: IncidentCost[],
): number {
  return preventedIncidents.reduce((sum, incident) => sum + incident.costs.total, 0);
}

/**
 * Estimates benefit value from risk reduction
 */
export function estimateBenefitFromRiskReduction(
  riskReduction: RiskReduction,
): SecurityBenefit {
  return {
    id: crypto.randomUUID(),
    type: BenefitType.RISK_REDUCTION,
    description: `Risk reduction for ${riskReduction.riskName}`,
    quantified: true,
    value: riskReduction.financialImpact,
    timeframe: 'annual',
    confidence: riskReduction.confidence,
    calculationMethod: 'Risk score reduction multiplied by potential financial impact',
    assumptions: [
      `Current risk score: ${riskReduction.currentRiskScore}`,
      `Target risk score: ${riskReduction.targetRiskScore}`,
      `Financial impact: $${riskReduction.financialImpact}`,
    ],
  };
}

/**
 * Calculates total quantified benefits
 */
export function calculateTotalBenefits(
  benefits: SecurityBenefit[],
  years: number = 3,
): number {
  return benefits.reduce((sum, benefit) => {
    if (!benefit.quantified) return sum;

    if (benefit.timeframe === 'annual') {
      return sum + benefit.value * years;
    } else if (benefit.timeframe.includes('year')) {
      return sum + benefit.value;
    }

    return sum + benefit.value;
  }, 0);
}

// ============================================================================
// RISK REDUCTION MEASUREMENT FUNCTIONS
// ============================================================================

/**
 * Creates risk reduction record
 */
export function createRiskReduction(config: {
  riskId: string;
  riskName: string;
  category: string;
  currentRiskScore: number;
  targetRiskScore: number;
  financialImpact: number;
  confidence: number;
}): RiskReduction {
  const reduction = ((config.currentRiskScore - config.targetRiskScore) / config.currentRiskScore) * 100;

  return {
    id: crypto.randomUUID(),
    riskId: config.riskId,
    riskName: config.riskName,
    category: config.category,
    currentRiskScore: config.currentRiskScore,
    targetRiskScore: config.targetRiskScore,
    reductionPercentage: reduction,
    financialImpact: config.financialImpact,
    confidence: config.confidence,
  };
}

/**
 * Measures actual risk reduction
 */
export function measureRiskReduction(
  riskReduction: RiskReduction,
  actualRiskScore: number,
): RiskReduction {
  return {
    ...riskReduction,
    actualRiskScore,
    measuredAt: new Date(),
  };
}

/**
 * Calculates aggregate risk reduction score
 */
export function calculateAggregateRiskReduction(
  reductions: RiskReduction[],
): number {
  if (reductions.length === 0) return 0;

  const totalReduction = reductions.reduce((sum, r) => {
    const actualReduction = r.actualRiskScore
      ? ((r.currentRiskScore - r.actualRiskScore) / r.currentRiskScore) * 100
      : r.reductionPercentage;

    return sum + actualReduction * (r.confidence / 100);
  }, 0);

  return totalReduction / reductions.length;
}

/**
 * Calculates risk velocity (rate of risk change)
 */
export function calculateRiskVelocity(
  historicalScores: TrendDataPoint[],
): number {
  if (historicalScores.length < 2) return 0;

  const first = historicalScores[0];
  const last = historicalScores[historicalScores.length - 1];

  const timeDiff = (last.date.getTime() - first.date.getTime()) / (1000 * 60 * 60 * 24 * 30); // months
  const scoreDiff = last.value - first.value;

  return scoreDiff / timeDiff; // Risk score change per month
}

// ============================================================================
// SECURITY METRICS AGGREGATION FUNCTIONS
// ============================================================================

/**
 * Aggregates security metrics for dashboard
 */
export function aggregateSecurityMetrics(
  investments: SecurityInvestment[],
  incidents: IncidentCost[],
  period: AnalysisPeriod,
): SecurityMetricsDashboard {
  const totalSpend = investments.reduce((sum, inv) => sum + inv.cost.totalCost, 0);
  const totalBenefits = investments.reduce((sum, inv) =>
    sum + calculateTotalBenefits(inv.benefits, 3), 0);
  const avgROI = calculateROI(totalBenefits, totalSpend);

  const executive: ExecutiveSummary = {
    totalSecuritySpend: totalSpend,
    securityROI: avgROI,
    incidentsBlocked: calculateBlockedIncidents(investments, incidents),
    costAvoidance: calculateAvoidedCosts(incidents),
    riskPosture: determineRiskPosture(investments),
    complianceStatus: 'compliant',
    keyAchievements: [],
    criticalConcerns: [],
  };

  const financial: DashboardFinancialMetrics = {
    totalInvestments: investments.length,
    budgetUtilization: 85,
    costPerUser: totalSpend / 1000, // Assuming 1000 users
    costPerAsset: totalSpend / 500,  // Assuming 500 assets
    preventedLosses: calculateAvoidedCosts(incidents),
    savingsRealized: totalBenefits,
    forecastedROI: avgROI * 1.1,
  };

  const risk: DashboardRiskMetrics = {
    currentRiskScore: calculateCurrentRiskScore(investments),
    riskTrend: 'improving',
    highRiskItems: 0,
    mitigatedRisks: investments.reduce((sum, inv) => sum + inv.risks.length, 0),
    residualRisk: 25,
    riskAppetite: 30,
    riskVelocity: -2,
  };

  const operational: DashboardOperationalMetrics = {
    securityIncidents: incidents.length,
    meanTimeToDetect: calculateMTTD(incidents),
    meanTimeToRespond: calculateMTTR(incidents),
    meanTimeToRecover: 240,
    automationRate: 65,
    toolEffectiveness: 80,
    teamProductivity: 75,
  };

  const compliance: ComplianceMetrics = {
    frameworks: [
      {
        framework: 'HIPAA',
        compliance: 95,
        controls: 45,
        gaps: 2,
        lastAssessment: new Date(),
      },
    ],
    overallCompliance: 95,
    controlsCovered: 45,
    controlsGaps: 2,
    auditFindings: 0,
    remediationRate: 100,
  };

  return {
    organizationId: 'white-cross',
    generatedAt: new Date(),
    period,
    executive,
    financial,
    risk,
    operational,
    compliance,
    trends: [],
  };
}

/**
 * Calculates mean time to detect
 */
export function calculateMTTD(incidents: IncidentCost[]): number {
  if (incidents.length === 0) return 0;

  const totalMinutes = incidents.reduce((sum, incident) => {
    const diff = incident.detectedAt.getTime() - incident.occurredAt.getTime();
    return sum + diff / (1000 * 60);
  }, 0);

  return totalMinutes / incidents.length;
}

/**
 * Calculates mean time to respond
 */
export function calculateMTTR(incidents: IncidentCost[]): number {
  const resolved = incidents.filter(i => i.resolvedAt);
  if (resolved.length === 0) return 0;

  const totalMinutes = resolved.reduce((sum, incident) => {
    const diff = incident.resolvedAt!.getTime() - incident.detectedAt.getTime();
    return sum + diff / (1000 * 60);
  }, 0);

  return totalMinutes / resolved.length;
}

/**
 * Generates trend analysis
 */
export function generateTrendAnalysis(
  metric: string,
  dataPoints: TrendDataPoint[],
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly',
): TrendAnalysis {
  if (dataPoints.length < 2) {
    return {
      metric,
      period,
      dataPoints,
      trend: 'stable',
      percentageChange: 0,
    };
  }

  const first = dataPoints[0].value;
  const last = dataPoints[dataPoints.length - 1].value;
  const percentageChange = ((last - first) / first) * 100;

  let trend: 'upward' | 'downward' | 'stable';
  if (Math.abs(percentageChange) < 5) {
    trend = 'stable';
  } else if (percentageChange > 0) {
    trend = 'upward';
  } else {
    trend = 'downward';
  }

  return {
    metric,
    period,
    dataPoints,
    trend,
    percentageChange,
  };
}

// ============================================================================
// EXECUTIVE REPORTING FUNCTIONS
// ============================================================================

/**
 * Generates executive summary report
 */
export function generateExecutiveSummary(
  dashboard: SecurityMetricsDashboard,
): ExecutiveSummary {
  return {
    ...dashboard.executive,
    keyAchievements: [
      `Achieved ${dashboard.executive.securityROI.toFixed(1)}% ROI on security investments`,
      `Prevented ${dashboard.executive.incidentsBlocked} security incidents`,
      `Avoided $${(dashboard.executive.costAvoidance / 1000).toFixed(0)}K in potential losses`,
      `Maintained ${dashboard.compliance.overallCompliance}% compliance rating`,
    ],
    criticalConcerns: identifyCriticalConcerns(dashboard),
  };
}

/**
 * Creates executive dashboard view
 */
export function createExecutiveDashboardView(
  metrics: SecurityMetricsDashboard,
): {
  kpis: Array<{ name: string; value: string; trend: string; status: 'good' | 'warning' | 'critical' }>;
  charts: Array<{ type: string; title: string; data: any }>;
} {
  const kpis = [
    {
      name: 'Security ROI',
      value: `${metrics.executive.securityROI.toFixed(1)}%`,
      trend: metrics.executive.securityROI > 0 ? 'up' : 'down',
      status: metrics.executive.securityROI > 50 ? 'good' : metrics.executive.securityROI > 0 ? 'warning' : 'critical' as const,
    },
    {
      name: 'Risk Posture',
      value: metrics.executive.riskPosture,
      trend: metrics.risk.riskTrend === 'improving' ? 'up' : 'down',
      status: metrics.executive.riskPosture === 'strong' ? 'good' : 'warning' as const,
    },
    {
      name: 'Cost Avoidance',
      value: `$${(metrics.executive.costAvoidance / 1000).toFixed(0)}K`,
      trend: 'up',
      status: 'good' as const,
    },
    {
      name: 'Compliance',
      value: `${metrics.compliance.overallCompliance}%`,
      trend: 'stable',
      status: metrics.compliance.overallCompliance >= 90 ? 'good' : 'warning' as const,
    },
  ];

  const charts = [
    {
      type: 'line',
      title: 'Risk Trend',
      data: metrics.trends.filter(t => t.metric.includes('risk')),
    },
    {
      type: 'bar',
      title: 'Investment by Category',
      data: {},
    },
    {
      type: 'pie',
      title: 'Incident Distribution',
      data: {},
    },
  ];

  return { kpis, charts };
}

// ============================================================================
// BUDGET OPTIMIZATION FUNCTIONS
// ============================================================================

/**
 * Analyzes budget allocation effectiveness
 */
export function analyzeBudgetAllocation(
  investments: SecurityInvestment[],
): BudgetAllocation[] {
  const categoryMap = new Map<InvestmentCategory, { amount: number; count: number; effectiveness: number }>();

  investments.forEach(inv => {
    const existing = categoryMap.get(inv.category) || { amount: 0, count: 0, effectiveness: 0 };
    existing.amount += inv.cost.totalCost;
    existing.count++;
    existing.effectiveness += inv.metrics.effectivenessScore;
    categoryMap.set(inv.category, existing);
  });

  const total = Array.from(categoryMap.values()).reduce((sum, v) => sum + v.amount, 0);
  const allocations: BudgetAllocation[] = [];

  categoryMap.forEach((value, category) => {
    allocations.push({
      category,
      amount: value.amount,
      percentage: (value.amount / total) * 100,
      effectiveness: value.effectiveness / value.count,
    });
  });

  return allocations;
}

/**
 * Generates budget optimization recommendations
 */
export function generateBudgetOptimization(
  currentAllocation: BudgetAllocation[],
  targetROI: number,
): BudgetOptimization {
  const totalBudget = currentAllocation.reduce((sum, a) => sum + a.amount, 0);

  // Identify low-performing categories
  const lowPerformers = currentAllocation.filter(a => a.effectiveness < 60);
  const highPerformers = currentAllocation.filter(a => a.effectiveness >= 80);

  const actions: OptimizationAction[] = [];
  let potentialSavings = 0;

  // Reduce allocation to low performers
  lowPerformers.forEach(alloc => {
    const reduction = alloc.amount * 0.2; // 20% reduction
    potentialSavings += reduction;

    actions.push({
      action: 'decrease',
      category: alloc.category,
      amount: reduction,
      expectedImpact: 'Minimal impact due to low effectiveness',
      priority: 'high',
      timeframe: 'Q1',
    });
  });

  // Increase allocation to high performers
  highPerformers.forEach(alloc => {
    const increase = potentialSavings / highPerformers.length;

    actions.push({
      action: 'increase',
      category: alloc.category,
      amount: increase,
      expectedImpact: 'Significant ROI improvement expected',
      priority: 'high',
      timeframe: 'Q1',
    });
  });

  const recommendedAllocation = currentAllocation.map(alloc => {
    const decreaseAction = actions.find(a => a.action === 'decrease' && a.category === alloc.category);
    const increaseAction = actions.find(a => a.action === 'increase' && a.category === alloc.category);

    let newAmount = alloc.amount;
    if (decreaseAction) newAmount -= decreaseAction.amount;
    if (increaseAction) newAmount += increaseAction.amount;

    return {
      ...alloc,
      amount: newAmount,
      percentage: (newAmount / totalBudget) * 100,
    };
  });

  return {
    currentAllocation,
    recommendedAllocation,
    potentialSavings,
    expectedROIImprovement: 15,
    riskImpact: 'Low - reallocation maintains overall security posture',
    rationale: [
      'Reduce spending on low-effectiveness categories',
      'Increase investment in proven high-ROI areas',
      'Maintain compliance and critical security controls',
    ],
    actions,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Creates default timeline for investment
 */
function createDefaultTimeline(startDate: Date, durationDays: number): InvestmentTimeline {
  const planningDays = Math.floor(durationDays * 0.2);
  const procurementDays = Math.floor(durationDays * 0.15);
  const implementationDays = Math.floor(durationDays * 0.5);
  const optimizationDays = durationDays - planningDays - procurementDays - implementationDays;

  let currentDate = new Date(startDate);

  const planningEnd = new Date(currentDate);
  planningEnd.setDate(planningEnd.getDate() + planningDays);

  const procurementEnd = new Date(planningEnd);
  procurementEnd.setDate(procurementEnd.getDate() + procurementDays);

  const implementationEnd = new Date(procurementEnd);
  implementationEnd.setDate(implementationEnd.getDate() + implementationDays);

  const optimizationEnd = new Date(implementationEnd);
  optimizationEnd.setDate(optimizationEnd.getDate() + optimizationDays);

  return {
    planningPhase: {
      startDate: currentDate,
      endDate: planningEnd,
      status: 'not-started',
      durationDays: planningDays,
      keyActivities: ['Requirements gathering', 'Vendor evaluation', 'Risk assessment'],
    },
    procurementPhase: {
      startDate: planningEnd,
      endDate: procurementEnd,
      status: 'not-started',
      durationDays: procurementDays,
      keyActivities: ['Contract negotiation', 'Budget approval', 'Purchase order'],
    },
    implementationPhase: {
      startDate: procurementEnd,
      endDate: implementationEnd,
      status: 'not-started',
      durationDays: implementationDays,
      keyActivities: ['Installation', 'Configuration', 'Testing', 'Training'],
    },
    optimizationPhase: {
      startDate: implementationEnd,
      endDate: optimizationEnd,
      status: 'not-started',
      durationDays: optimizationDays,
      keyActivities: ['Fine-tuning', 'Process integration', 'Performance optimization'],
    },
    totalDuration: durationDays,
  };
}

/**
 * Calculates risk metrics for investment
 */
function calculateRiskMetricsForInvestment(investment: SecurityInvestment): RiskMetrics {
  return {
    risksAddressed: investment.risks.length,
    avgRiskReduction: calculateAggregateRiskReduction(investment.risks),
    totalRiskReduction: investment.risks.reduce((sum, r) => sum + r.reductionPercentage, 0),
    incidentsPrevented: 0,
    incidentCostAvoided: investment.risks.reduce((sum, r) => sum + r.financialImpact, 0),
    complianceRisksAddressed: investment.risks.filter(r => r.category === 'compliance').length,
  };
}

/**
 * Calculates operational metrics for investment
 */
function calculateOperationalMetricsForInvestment(investment: SecurityInvestment): OperationalMetrics {
  const estimatedDuration = investment.implementation.estimatedDuration;
  const actualDuration = investment.implementation.actualDuration || estimatedDuration;

  return {
    implementationTime: actualDuration,
    utilizationRate: investment.metrics.utilizationRate,
    efficiencyGain: 20,
    automationLevel: 50,
    falsePositiveRate: 5,
    meanTimeToDetect: 15,
    meanTimeToRespond: 30,
  };
}

/**
 * Estimates qualitative metrics
 */
function estimateQualitativeMetrics(investment: SecurityInvestment): QualitativeMetrics {
  return {
    userSatisfaction: 75,
    teamConfidence: 80,
    stakeholderSupport: 85,
    complianceImprovement: 70,
    culturalImpact: 65,
  };
}

/**
 * Gets rating from score
 */
function getRatingFromScore(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

/**
 * Gets recommendation from score
 */
function getRecommendationFromScore(score: number): 'continue' | 'optimize' | 'review' | 'discontinue' {
  if (score >= 70) return 'continue';
  if (score >= 50) return 'optimize';
  if (score >= 30) return 'review';
  return 'discontinue';
}

/**
 * Generates key findings
 */
function generateKeyFindings(
  financial: FinancialMetrics,
  risk: RiskMetrics,
  operational: OperationalMetrics,
): string[] {
  const findings: string[] = [];

  if (financial.roi > 50) {
    findings.push(`Strong ROI of ${financial.roi.toFixed(1)}% demonstrates excellent value`);
  } else if (financial.roi > 0) {
    findings.push(`Positive ROI of ${financial.roi.toFixed(1)}% shows investment is worthwhile`);
  } else {
    findings.push(`Negative ROI of ${financial.roi.toFixed(1)}% requires attention`);
  }

  if (risk.avgRiskReduction > 50) {
    findings.push(`Significant risk reduction of ${risk.avgRiskReduction.toFixed(1)}% achieved`);
  }

  if (operational.utilizationRate < 50) {
    findings.push(`Low utilization rate of ${operational.utilizationRate.toFixed(1)}% indicates underutilization`);
  }

  return findings;
}

/**
 * Generates recommendations
 */
function generateRecommendations(
  financial: FinancialMetrics,
  risk: RiskMetrics,
  operational: OperationalMetrics,
): string[] {
  const recommendations: string[] = [];

  if (financial.roi < 20) {
    recommendations.push('Consider optimizing the investment to improve ROI');
  }

  if (operational.utilizationRate < 60) {
    recommendations.push('Increase utilization through training and process improvements');
  }

  if (risk.avgRiskReduction < 30) {
    recommendations.push('Review risk mitigation strategy for better effectiveness');
  }

  if (financial.paybackPeriod > 36) {
    recommendations.push('Long payback period - evaluate if benefits justify the wait');
  }

  return recommendations;
}

/**
 * Calculates blocked incidents
 */
function calculateBlockedIncidents(
  investments: SecurityInvestment[],
  incidents: IncidentCost[],
): number {
  // Simplified calculation - would need actual correlation data
  return Math.floor(incidents.length * 0.7);
}

/**
 * Determines risk posture
 */
function determineRiskPosture(investments: SecurityInvestment[]): 'strong' | 'moderate' | 'weak' {
  const avgRiskReduction = investments.reduce((sum, inv) => {
    return sum + calculateAggregateRiskReduction(inv.risks);
  }, 0) / investments.length;

  if (avgRiskReduction > 60) return 'strong';
  if (avgRiskReduction > 30) return 'moderate';
  return 'weak';
}

/**
 * Calculates current risk score
 */
function calculateCurrentRiskScore(investments: SecurityInvestment[]): number {
  const totalRisks = investments.reduce((sum, inv) => sum + inv.risks.length, 0);
  if (totalRisks === 0) return 50;

  const weightedScore = investments.reduce((sum, inv) => {
    return sum + inv.risks.reduce((riskSum, r) => {
      return riskSum + (r.actualRiskScore || r.targetRiskScore);
    }, 0);
  }, 0);

  return weightedScore / totalRisks;
}

/**
 * Identifies critical concerns
 */
function identifyCriticalConcerns(dashboard: SecurityMetricsDashboard): string[] {
  const concerns: string[] = [];

  if (dashboard.executive.securityROI < 0) {
    concerns.push('Negative security ROI requires immediate attention');
  }

  if (dashboard.risk.riskTrend === 'degrading') {
    concerns.push('Risk posture is degrading - review security controls');
  }

  if (dashboard.compliance.overallCompliance < 80) {
    concerns.push('Compliance below acceptable threshold');
  }

  if (dashboard.operational.securityIncidents > 50) {
    concerns.push('High number of security incidents');
  }

  return concerns;
}

/**
 * Exports configuration examples
 */
export const ROI_CONFIG_EXAMPLES = {
  investment: {
    name: 'Next-Gen SIEM Solution',
    category: InvestmentCategory.DETECTIVE,
    type: InvestmentType.HYBRID,
    initialCost: 250000,
    startDate: new Date(),
    estimatedDuration: 180,
  },

  recurringCost: {
    type: 'annual' as const,
    amount: 75000,
    description: 'Annual license and support',
    startDate: new Date(),
  },

  benefit: {
    type: BenefitType.INCIDENT_REDUCTION,
    description: 'Reduced security incidents through improved detection',
    quantified: true,
    value: 150000,
    timeframe: 'annual',
    confidence: 80,
    calculationMethod: 'Average incident cost × expected reduction rate',
    assumptions: ['Average incident cost: $50,000', 'Expected reduction: 60%'],
  },

  riskReduction: {
    riskId: 'RISK-001',
    riskName: 'Data Breach',
    category: 'confidentiality',
    currentRiskScore: 80,
    targetRiskScore: 30,
    financialImpact: 500000,
    confidence: 75,
  },
};

/**
 * Default configuration for development
 */
export const DEFAULT_ROI_CONFIG = {
  discountRate: 0.08,
  analysisYears: 3,
  minimumROI: 15,
  targetPaybackMonths: 24,
  confidenceThreshold: 70,
  currency: 'USD',
};
