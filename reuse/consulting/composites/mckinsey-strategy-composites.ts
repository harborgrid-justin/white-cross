/**
 * LOC: MCKSTRAT12345
 * File: /reuse/consulting/composites/mckinsey-strategy-composites.ts
 *
 * UPSTREAM (imports from):
 *   - ../strategic-planning-kit.ts
 *   - ../business-transformation-kit.ts
 *   - ../digital-strategy-kit.ts
 *   - ../project-portfolio-kit.ts
 *   - ../risk-management-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend McKinsey-style strategy services
 *   - Strategic consulting controllers
 *   - Executive advisory dashboards
 *   - Transformation management platforms
 */

/**
 * File: /reuse/consulting/composites/mckinsey-strategy-composites.ts
 * Locator: WC-MCKINSEY-STRATEGY-001
 * Purpose: McKinsey-Level Strategic Planning & Transformation Composites
 *
 * Upstream: Strategic planning, transformation, digital strategy, portfolio, risk management utilities
 * Downstream: ../backend/*, McKinsey-style consulting services, strategy controllers, C-suite dashboards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45 composite functions for McKinsey-level strategy, transformation, and organizational change
 *
 * LLM Context: Production-grade McKinsey-style strategic consulting composite module.
 * Combines strategic frameworks (SWOT, Porter's Five Forces, BCG Matrix, Ansoff Matrix, Balanced Scorecard),
 * transformation methodologies (Kotter's 8-Step, ADKAR, Lean Six Sigma), digital maturity assessment,
 * portfolio optimization, risk management, and executive-level strategic advisory capabilities.
 * Designed for enterprise C-suite decision-making and large-scale transformation initiatives.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ============================================================================
// STRATEGIC PLANNING IMPORTS (SWOT, Porter, BCG, Ansoff, BSC)
// ============================================================================

import {
  createSWOTAnalysis,
  generateCrossFactorAnalysis,
  generateSWOTRecommendations,
  createPorterFiveForcesAnalysis,
  calculateIndustryAttractiveness,
  createBCGMatrixAnalysis,
  determineBCGPosition,
  getBCGStrategy,
  getInvestmentPriority,
  generatePortfolioRecommendations as generateBCGPortfolioRecommendations,
  calculateResourceAllocation as calculateBCGResourceAllocation,
  identifyStrategicGaps,
  createAnsoffMatrixAnalysis,
  assessAnsoffRisk,
  createBalancedScorecard,
  buildStrategyMap,
  calculateBalancedScorecardPerformance,
  trackMeasurePerformance,
  createScenarioPlanningAnalysis,
  generateEarlyWarningIndicators,
  generateContingencyPlans,
  assessScenarioProbability,
  createValueChainAnalysis,
  identifyCostDrivers,
  identifyValueDrivers,
  identifyCompetitiveAdvantages,
  calculateValueChainMargin,
  benchmarkValueChainActivities,
  generateStrategicRoadmap,
  performStakeholderAnalysis,
  calculateStrategicFitScore,
  optimizePortfolioAllocation,
  conductPESTELAnalysis,
  analyzeCoreCompetencies,
  calculateMarketAttractiveness,
  performGapAnalysis,
  simulateStrategicScenarios,
  prioritizeStrategicInitiatives,
  trackStrategicKPIs,
  generateStrategyExecutionDashboard,
  analyzeStrategicDependencies,
  calculateStrategicMomentum,
  assessStrategicAgility,
  forecastStrategicOutcomes,
  generateExecutiveStrategySummary,
  SWOTAnalysis,
  SWOTItem,
  CrossFactorAnalysis,
  PorterFiveForcesAnalysis,
  ForceAnalysis,
  ForceFactor,
  BCGMatrixAnalysis,
  BCGBusinessUnit,
  PortfolioRecommendation,
  ResourceAllocation,
  AnsoffMatrixAnalysis,
  GrowthInitiative,
  BalancedScorecard,
  PerspectiveMetrics,
  StrategicObjective,
  PerformanceMeasure,
  Scenario,
  ValueChainAnalysis,
  ValueActivity,
  StrategyContext,
  StrategyFramework,
  StrategicPosition,
  StrategyPriority,
  InitiativeStatus,
  CompetitiveIntensity,
  GrowthStrategy,
  StrategicRiskLevel,
} from '../strategic-planning-kit';

// ============================================================================
// BUSINESS TRANSFORMATION IMPORTS (Kotter, ADKAR, LSS, Digital Transformation)
// ============================================================================

import {
  createKotterChangeModel,
  calculateKotterProgress,
  createADKARChangeModel,
  calculateADKARReadiness,
  identifyADKARBarriers,
  createLeanSixSigmaProject,
  calculateProcessCapability,
  calculateDPMO,
  createDigitalTransformationRoadmap,
  assessDigitalMaturity,
  prioritizeDigitalInitiatives,
  createChangeReadinessAssessment,
  analyzeStakeholderResistance,
  generateCommunicationPlan,
  calculateTransformationROI,
  assessChangeImpact,
  generateTrainingPlan,
  trackTransformationRisks,
  calculateChangeVelocity,
  identifyQuickWins,
  assessCulturalAlignment,
  generateGovernanceReports,
  forecastTransformationTimeline,
  KotterChangeModel,
  KotterStep,
  ADKARChangeModel,
  ADKARPhase,
  LeanSixSigmaProject,
  DMAICPhase,
  DigitalTransformationRoadmap,
  DigitalMaturityAssessment,
  DigitalInitiative,
  ChangeReadinessAssessment,
  ReadinessDimension,
  StakeholderReadiness,
  CulturalReadiness,
  TransformationContext,
  TransformationFramework,
  ChangeStage,
  TransformationStatus,
  ResistanceLevel,
  ReadinessLevel,
  TransformationPriority,
  ProcessMaturityLevel,
  DigitalMaturityLevel,
} from '../business-transformation-kit';

// ============================================================================
// DIGITAL STRATEGY IMPORTS (Maturity Assessment, Technology Roadmap)
// ============================================================================

import {
  conductDigitalMaturityAssessment,
  calculateDimensionMaturityScore,
  benchmarkDigitalMaturity,
  identifyCriticalCapabilityGaps,
  generateTransformationRoadmap as generateDigitalTransformationRoadmap,
  trackMaturityProgress,
  generateMaturityExecutiveSummary,
  calculateDigitalQuotient,
  createTechnologyRoadmap,
  optimizeRoadmapSequencing,
  validateRoadmapFeasibility,
  calculateRoadmapROI,
  identifyRoadmapCriticalPath,
  trackRoadmapProgress,
} from '../digital-strategy-kit';

// ============================================================================
// PORTFOLIO MANAGEMENT IMPORTS (Portfolio Optimization, Resource Allocation)
// ============================================================================

import {
  createPortfolio,
  prioritizeProjects,
  analyzePortfolioBalance,
  optimizePortfolio,
  analyzePortfolioRisk,
  calculatePortfolioValue,
  performWhatIfAnalysis,
  createPortfolioScenario,
  comparePortfolioScenarios,
  assessStrategicAlignment,
  generatePortfolioDashboard,
  generateExecutiveSummary as generatePortfolioExecutiveSummary,
  analyzePortfolioTrends,
  createPortfolioRoadmap,
} from '../project-portfolio-kit';

// ============================================================================
// RISK MANAGEMENT IMPORTS (COSO, ISO 31000, Risk Assessment)
// ============================================================================

import {
  calculateInherentRiskScore,
  calculateResidualRiskScore,
  generateRiskMatrix,
  generateRiskHeatMap,
  assessCOSOCompliance,
  assessISO31000Compliance,
  performMonteCarloRiskSimulation,
  performBowTieAnalysis,
  performFMEA,
  calculateRPN,
  performRootCauseAnalysis,
  assessThreeLinesOfDefense,
  defineRiskAppetite,
  Risk,
  RiskRegister,
  RiskScore,
  RiskControl,
  RiskMatrix,
  RiskHeatMap,
  COSOAssessment,
  ISO31000Assessment,
  MonteCarloRiskSimulation,
  BowTieAnalysis,
  FMEAAnalysis,
  RiskAppetite,
  RiskFramework,
  RiskCategory,
  RiskLevel,
  RiskStatus,
  RiskTreatment,
} from '../risk-management-kit';

// ============================================================================
// RE-EXPORT ALL STRATEGIC PLANNING FUNCTIONS (15 functions)
// ============================================================================

/**
 * Function 1: Create comprehensive SWOT analysis
 * McKinsey-style strategic analysis for strengths, weaknesses, opportunities, and threats
 *
 * @param context - Strategy context
 * @param data - SWOT analysis data
 * @param transaction - Database transaction
 * @returns Created SWOT analysis
 *
 * @example
 * ```typescript
 * const swot = await createSWOTAnalysis(context, {
 *   organizationId: 'org-123',
 *   analysisName: 'Q1 2025 Strategic Review',
 *   strengths: [...],
 *   weaknesses: [...],
 *   opportunities: [...],
 *   threats: [...]
 * });
 * ```
 */
export { createSWOTAnalysis };

/**
 * Function 2: Generate cross-factor SWOT analysis
 * SO, WO, ST, WT strategy combinations for strategic planning
 *
 * @param swotAnalysis - SWOT analysis
 * @returns Cross-factor strategies (SO, WO, ST, WT)
 */
export { generateCrossFactorAnalysis };

/**
 * Function 3: Generate SWOT-based strategic recommendations
 * Actionable recommendations based on SWOT findings
 *
 * @param swotAnalysis - SWOT analysis
 * @returns Strategic recommendations with priorities
 */
export { generateSWOTRecommendations };

/**
 * Function 4: Create Porter's Five Forces competitive analysis
 * Industry attractiveness and competitive positioning analysis
 *
 * @param context - Strategy context
 * @param data - Five Forces data
 * @param transaction - Database transaction
 * @returns Created Porter's Five Forces analysis
 */
export { createPorterFiveForcesAnalysis };

/**
 * Function 5: Calculate industry attractiveness score
 * Weighted scoring of all five competitive forces
 *
 * @param forces - All five forces analyses
 * @returns Industry attractiveness score (1-10)
 */
export { calculateIndustryAttractiveness };

/**
 * Function 6: Create BCG Matrix portfolio analysis
 * Stars, Cash Cows, Question Marks, Dogs positioning
 *
 * @param context - Strategy context
 * @param data - BCG matrix data
 * @param transaction - Database transaction
 * @returns Created BCG Matrix analysis
 */
export { createBCGMatrixAnalysis };

/**
 * Function 7: Determine BCG position for business unit
 * Calculate Star, Cash Cow, Question Mark, or Dog position
 *
 * @param marketGrowthRate - Market growth rate percentage
 * @param relativeMarketShare - Relative market share ratio
 * @returns BCG position (STAR, CASH_COW, QUESTION_MARK, DOG)
 */
export { determineBCGPosition };

/**
 * Function 8: Get BCG strategy recommendation
 * Investment strategy based on BCG position
 *
 * @param unit - BCG business unit
 * @returns Strategy recommendation string
 */
export { getBCGStrategy };

/**
 * Function 9: Get BCG investment priority
 * Priority level for resource allocation
 *
 * @param unit - BCG business unit
 * @returns Investment priority (CRITICAL, HIGH, MEDIUM, LOW)
 */
export { getInvestmentPriority };

/**
 * Function 10: Identify strategic gaps in BCG portfolio
 * Detect missing positions or imbalances
 *
 * @param units - BCG business units
 * @returns Strategic gap descriptions
 */
export { identifyStrategicGaps };

/**
 * Function 11: Create Ansoff Matrix growth analysis
 * Market penetration, market development, product development, diversification
 *
 * @param context - Strategy context
 * @param data - Ansoff matrix data
 * @param transaction - Database transaction
 * @returns Created Ansoff Matrix analysis
 */
export { createAnsoffMatrixAnalysis };

/**
 * Function 12: Assess Ansoff strategy risk
 * Risk evaluation for growth strategies
 *
 * @param initiative - Growth initiative
 * @returns Risk assessment with mitigation strategies
 */
export { assessAnsoffRisk };

/**
 * Function 13: Create Balanced Scorecard
 * Financial, Customer, Internal Process, Learning & Growth perspectives
 *
 * @param context - Strategy context
 * @param data - Balanced scorecard data
 * @param transaction - Database transaction
 * @returns Created Balanced Scorecard
 */
export { createBalancedScorecard };

/**
 * Function 14: Build strategy map from objectives
 * Visual representation of objective relationships
 *
 * @param objectives - Strategic objectives
 * @returns Strategy map nodes with linkages
 */
export { buildStrategyMap };

/**
 * Function 15: Calculate Balanced Scorecard overall performance
 * Weighted performance across all four perspectives
 *
 * @param scorecard - Balanced scorecard
 * @returns Overall performance score (0-100)
 */
export { calculateBalancedScorecardPerformance };

// ============================================================================
// RE-EXPORT TRANSFORMATION FUNCTIONS (15 functions)
// ============================================================================

/**
 * Function 16: Create Kotter's 8-Step change model
 * Structured change management using Kotter methodology
 *
 * @param context - Transformation context
 * @param data - Kotter change model data
 * @param transaction - Database transaction
 * @returns Created Kotter change model
 */
export { createKotterChangeModel };

/**
 * Function 17: Calculate Kotter overall progress
 * Weighted progress across all 8 steps
 *
 * @param model - Kotter change model
 * @returns Overall progress percentage (0-100)
 */
export { calculateKotterProgress };

/**
 * Function 18: Create ADKAR change model
 * Awareness, Desire, Knowledge, Ability, Reinforcement framework
 *
 * @param context - Transformation context
 * @param data - ADKAR change model data
 * @param transaction - Database transaction
 * @returns Created ADKAR change model
 */
export { createADKARChangeModel };

/**
 * Function 19: Calculate ADKAR readiness score
 * Overall change readiness across all ADKAR phases
 *
 * @param model - ADKAR change model
 * @returns Readiness score (1-5)
 */
export { calculateADKARReadiness };

/**
 * Function 20: Identify ADKAR barriers
 * Detect barriers in each ADKAR phase
 *
 * @param model - ADKAR change model
 * @returns Identified change barriers
 */
export { identifyADKARBarriers };

/**
 * Function 21: Create Lean Six Sigma DMAIC project
 * Define, Measure, Analyze, Improve, Control methodology
 *
 * @param context - Transformation context
 * @param data - Lean Six Sigma project data
 * @param transaction - Database transaction
 * @returns Created Lean Six Sigma project
 */
export { createLeanSixSigmaProject };

/**
 * Function 22: Calculate Six Sigma process capability
 * Cp, Cpk, and sigma level calculations
 *
 * @param data - Process data points
 * @param lowerSpecLimit - Lower specification limit
 * @param upperSpecLimit - Upper specification limit
 * @returns Process capability metrics (cp, cpk, sigma)
 */
export { calculateProcessCapability };

/**
 * Function 23: Calculate defects per million opportunities
 * Six Sigma quality metric calculation
 *
 * @param defects - Number of defects
 * @param units - Number of units
 * @param opportunities - Opportunities per unit
 * @returns DPMO value
 */
export { calculateDPMO };

/**
 * Function 24: Create digital transformation roadmap
 * Comprehensive digital transformation planning
 *
 * @param context - Transformation context
 * @param data - Digital transformation roadmap data
 * @param transaction - Database transaction
 * @returns Created digital transformation roadmap
 */
export { createDigitalTransformationRoadmap };

/**
 * Function 25: Assess digital maturity
 * Current digital maturity level evaluation
 *
 * @param dimensions - Maturity dimensions
 * @returns Digital maturity assessment
 */
export { assessDigitalMaturity };

/**
 * Function 26: Prioritize digital initiatives
 * Value vs complexity prioritization
 *
 * @param initiatives - Digital initiatives
 * @returns Prioritized initiatives
 */
export { prioritizeDigitalInitiatives };

/**
 * Function 27: Create change readiness assessment
 * Organizational readiness for transformation
 *
 * @param context - Transformation context
 * @param data - Change readiness data
 * @param transaction - Database transaction
 * @returns Created change readiness assessment
 */
export { createChangeReadinessAssessment };

/**
 * Function 28: Analyze stakeholder resistance
 * Resistance patterns and levels across stakeholders
 *
 * @param stakeholders - Stakeholder list
 * @returns Resistance analysis (high resistance, supportive, neutral counts)
 */
export { analyzeStakeholderResistance };

/**
 * Function 29: Calculate transformation ROI
 * Return on investment for transformation initiatives
 *
 * @param financial - Financial impact data
 * @returns ROI percentage
 */
export { calculateTransformationROI };

/**
 * Function 30: Forecast transformation timeline
 * Predict completion date based on velocity
 *
 * @param currentProgress - Current progress percentage
 * @param targetDate - Target completion date
 * @param velocity - Progress velocity
 * @returns Timeline forecast (on track, estimated completion, variance)
 */
export { forecastTransformationTimeline };

// ============================================================================
// RE-EXPORT DIGITAL STRATEGY & PORTFOLIO FUNCTIONS (15 functions)
// ============================================================================

/**
 * Function 31: Conduct digital maturity assessment
 * Comprehensive digital capability evaluation
 *
 * @param organizationId - Organization ID
 * @param assessmentData - Assessment data
 * @returns Digital maturity assessment
 */
export { conductDigitalMaturityAssessment };

/**
 * Function 32: Calculate dimension maturity score
 * Score for individual maturity dimension
 *
 * @param dimension - Dimension name
 * @param indicators - Maturity indicators
 * @returns Dimension maturity score
 */
export { calculateDimensionMaturityScore };

/**
 * Function 33: Benchmark digital maturity
 * Compare against industry benchmarks
 *
 * @param assessment - Digital maturity assessment
 * @param industry - Industry code
 * @returns Benchmark comparison
 */
export { benchmarkDigitalMaturity };

/**
 * Function 34: Identify critical capability gaps
 * High-priority gaps requiring attention
 *
 * @param assessment - Digital maturity assessment
 * @returns Critical capability gaps
 */
export { identifyCriticalCapabilityGaps };

/**
 * Function 35: Create technology roadmap
 * Technology evolution and adoption planning
 *
 * @param roadmapData - Technology roadmap data
 * @returns Created technology roadmap
 */
export { createTechnologyRoadmap };

/**
 * Function 36: Optimize roadmap sequencing
 * Optimal initiative sequencing based on dependencies
 *
 * @param roadmap - Technology roadmap
 * @param constraints - Sequencing constraints
 * @returns Optimized roadmap
 */
export { optimizeRoadmapSequencing };

/**
 * Function 37: Validate roadmap feasibility
 * Check resource and timeline feasibility
 *
 * @param roadmap - Technology roadmap
 * @returns Feasibility validation results
 */
export { validateRoadmapFeasibility };

/**
 * Function 38: Create strategic portfolio
 * Portfolio creation and initialization
 *
 * @param portfolioData - Portfolio data
 * @param userId - User ID
 * @returns Created portfolio
 */
export { createPortfolio };

/**
 * Function 39: Prioritize portfolio projects
 * Multi-criteria project prioritization
 *
 * @param portfolioId - Portfolio ID
 * @param criteria - Prioritization criteria
 * @returns Prioritized projects
 */
export { prioritizeProjects };

/**
 * Function 40: Analyze portfolio balance
 * Risk, return, and strategic balance analysis
 *
 * @param portfolioId - Portfolio ID
 * @returns Portfolio balance analysis
 */
export { analyzePortfolioBalance };

/**
 * Function 41: Optimize portfolio allocation
 * Resource and budget optimization
 *
 * @param portfolioId - Portfolio ID
 * @param constraints - Optimization constraints
 * @returns Optimized portfolio
 */
export { optimizePortfolio };

/**
 * Function 42: Perform portfolio what-if analysis
 * Scenario-based portfolio simulation
 *
 * @param portfolioId - Portfolio ID
 * @param scenarioParameters - Scenario parameters
 * @returns What-if analysis results
 */
export { performWhatIfAnalysis };

/**
 * Function 43: Generate portfolio executive summary
 * C-suite level portfolio summary
 *
 * @param portfolioId - Portfolio ID
 * @returns Executive summary
 */
export { generatePortfolioExecutiveSummary };

/**
 * Function 44: Analyze portfolio trends
 * Historical trend analysis
 *
 * @param portfolioId - Portfolio ID
 * @param months - Number of months to analyze
 * @returns Trend analysis
 */
export { analyzePortfolioTrends };

/**
 * Function 45: Generate strategy execution dashboard
 * Real-time strategy execution monitoring
 *
 * @param strategicObjectives - Strategic objectives
 * @param kpis - Key performance indicators
 * @returns Strategy execution dashboard
 */
export { generateStrategyExecutionDashboard };

// ============================================================================
// RE-EXPORT TYPES AND ENUMS
// ============================================================================

export type {
  SWOTAnalysis,
  SWOTItem,
  CrossFactorAnalysis,
  PorterFiveForcesAnalysis,
  ForceAnalysis,
  ForceFactor,
  BCGMatrixAnalysis,
  BCGBusinessUnit,
  PortfolioRecommendation,
  ResourceAllocation,
  AnsoffMatrixAnalysis,
  GrowthInitiative,
  BalancedScorecard,
  PerspectiveMetrics,
  StrategicObjective,
  PerformanceMeasure,
  Scenario,
  ValueChainAnalysis,
  ValueActivity,
  StrategyContext,
  KotterChangeModel,
  KotterStep,
  ADKARChangeModel,
  ADKARPhase,
  LeanSixSigmaProject,
  DMAICPhase,
  DigitalTransformationRoadmap,
  DigitalMaturityAssessment,
  DigitalInitiative,
  ChangeReadinessAssessment,
  ReadinessDimension,
  StakeholderReadiness,
  CulturalReadiness,
  TransformationContext,
  Risk,
  RiskRegister,
  RiskScore,
  RiskControl,
  RiskMatrix,
  RiskHeatMap,
  COSOAssessment,
  ISO31000Assessment,
  MonteCarloRiskSimulation,
  BowTieAnalysis,
  FMEAAnalysis,
  RiskAppetite,
};

export {
  StrategyFramework,
  StrategicPosition,
  StrategyPriority,
  InitiativeStatus,
  CompetitiveIntensity,
  GrowthStrategy,
  StrategicRiskLevel,
  TransformationFramework,
  ChangeStage,
  TransformationStatus,
  ResistanceLevel,
  ReadinessLevel,
  TransformationPriority,
  ProcessMaturityLevel,
  DigitalMaturityLevel,
  RiskFramework,
  RiskCategory,
  RiskLevel,
  RiskStatus,
  RiskTreatment,
};

/**
 * Default export with all McKinsey strategy composite utilities
 */
export default {
  // Strategic Planning (SWOT, Porter, BCG, Ansoff, BSC)
  createSWOTAnalysis,
  generateCrossFactorAnalysis,
  generateSWOTRecommendations,
  createPorterFiveForcesAnalysis,
  calculateIndustryAttractiveness,
  createBCGMatrixAnalysis,
  determineBCGPosition,
  getBCGStrategy,
  getInvestmentPriority,
  identifyStrategicGaps,
  createAnsoffMatrixAnalysis,
  assessAnsoffRisk,
  createBalancedScorecard,
  buildStrategyMap,
  calculateBalancedScorecardPerformance,

  // Business Transformation (Kotter, ADKAR, LSS, Digital)
  createKotterChangeModel,
  calculateKotterProgress,
  createADKARChangeModel,
  calculateADKARReadiness,
  identifyADKARBarriers,
  createLeanSixSigmaProject,
  calculateProcessCapability,
  calculateDPMO,
  createDigitalTransformationRoadmap,
  assessDigitalMaturity,
  prioritizeDigitalInitiatives,
  createChangeReadinessAssessment,
  analyzeStakeholderResistance,
  calculateTransformationROI,
  forecastTransformationTimeline,

  // Digital Strategy & Portfolio
  conductDigitalMaturityAssessment,
  calculateDimensionMaturityScore,
  benchmarkDigitalMaturity,
  identifyCriticalCapabilityGaps,
  createTechnologyRoadmap,
  optimizeRoadmapSequencing,
  validateRoadmapFeasibility,
  createPortfolio,
  prioritizeProjects,
  analyzePortfolioBalance,
  optimizePortfolio,
  performWhatIfAnalysis,
  generatePortfolioExecutiveSummary,
  analyzePortfolioTrends,
  generateStrategyExecutionDashboard,
};
