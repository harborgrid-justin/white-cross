/**
 * LOC: BCGOPS234567
 * File: /reuse/consulting/composites/bcg-operations-composites.ts
 *
 * UPSTREAM (imports from):
 *   - ../business-transformation-kit.ts
 *   - ../project-portfolio-kit.ts
 *   - ../risk-management-kit.ts
 *   - ../financial-modeling-kit.ts
 *   - ../strategic-planning-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend BCG-style operations services
 *   - Process excellence controllers
 *   - Operational efficiency dashboards
 *   - Performance optimization platforms
 */

/**
 * File: /reuse/consulting/composites/bcg-operations-composites.ts
 * Locator: WC-BCG-OPERATIONS-001
 * Purpose: BCG-Level Operations Excellence & Process Improvement Composites
 *
 * Upstream: Business transformation, portfolio management, risk management, financial modeling utilities
 * Downstream: ../backend/*, BCG-style operations services, process controllers, efficiency dashboards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 42 composite functions for BCG-level operations, process improvement, and efficiency optimization
 *
 * LLM Context: Production-grade BCG-style operations consulting composite module.
 * Combines Lean Six Sigma methodologies, process improvement frameworks, portfolio management,
 * resource optimization, capacity planning, benefits realization tracking, operational risk management,
 * and performance metrics. Designed for operational excellence and continuous improvement initiatives.
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
// LEAN SIX SIGMA & PROCESS IMPROVEMENT IMPORTS
// ============================================================================

import {
  createLeanSixSigmaProject,
  calculateProcessCapability,
  calculateDPMO,
  assessChangeImpact,
  identifyQuickWins,
  calculateChangeVelocity,
  trackTransformationRisks,
  generateTrainingPlan,
  assessCulturalAlignment,
  generateGovernanceReports,
  forecastTransformationTimeline,
  LeanSixSigmaProject,
  DMAICPhase,
  ProcessState,
  ProcessStep,
  ImprovementOpportunity,
  ProcessImprovementInitiative,
  ProcessBenefit,
  ProcessRisk,
  TransformationContext,
  TransformationFramework,
  TransformationStatus,
  TransformationRisk,
  TrainingActivity,
  CultureProfile,
  Milestone,
  FinancialImpact,
} from '../business-transformation-kit';

// ============================================================================
// PORTFOLIO & RESOURCE MANAGEMENT IMPORTS
// ============================================================================

import {
  createPortfolio,
  activatePortfolio,
  addProjectToPortfolio,
  calculateProjectPriorityScores,
  prioritizeProjects,
  analyzePortfolioBalance,
  allocateResourceToProject,
  checkResourceAvailability,
  calculateCapacityUtilization,
  identifyResourceConflicts,
  optimizeResourceAllocation,
  forecastResourceDemand,
  optimizePortfolio,
  analyzePortfolioRisk,
  calculatePortfolioValue,
  assessStrategicAlignment,
  createStageGateReview,
  trackBenefitsRealization,
  generateGovernanceReport,
  monitorPortfolioHealth,
  generatePortfolioDashboard,
  generateExecutiveSummary,
  generatePerformanceReport,
  analyzeProjectDependencies,
  identifyCriticalPath,
  createPortfolioRoadmap,
  validateScheduleFeasibility,
  Portfolio,
  PortfolioProject,
  ResourceAllocation,
  ResourceRequirement,
  CapacityPlan,
  CapacityBreakdown,
  ProjectDependency,
  ProjectMilestone,
  PortfolioOptimization,
  OptimizationConstraints,
  BenefitsRealization,
  StageGateReview,
  ReviewCriterion,
  PortfolioScenario,
  PortfolioStatus,
  ProjectPriority,
  ProjectStage,
  AllocationStatus,
  PortfolioHealth,
} from '../project-portfolio-kit';

// ============================================================================
// RISK MANAGEMENT IMPORTS
// ============================================================================

import {
  calculateInherentRiskScore,
  calculateResidualRiskScore,
  generateRiskMatrix,
  performFMEA,
  calculateRPN,
  performRootCauseAnalysis,
  Risk,
  RiskScore,
  RiskControl,
  RiskMatrix,
  FMEAAnalysis,
  FailureMode,
  RootCauseAnalysis,
  RiskLevel,
  RiskStatus,
  ControlType,
  ControlEffectiveness,
} from '../risk-management-kit';

// ============================================================================
// STRATEGIC PLANNING IMPORTS
// ============================================================================

import {
  createValueChainAnalysis,
  identifyCostDrivers,
  identifyValueDrivers,
  identifyCompetitiveAdvantages,
  calculateValueChainMargin,
  benchmarkValueChainActivities,
  performGapAnalysis,
  trackStrategicKPIs,
  ValueChainAnalysis,
  ValueActivity,
  CompetitiveAdvantage,
  StrategicObjective,
  PerformanceMeasure,
} from '../strategic-planning-kit';

// ============================================================================
// RE-EXPORT LEAN SIX SIGMA & PROCESS FUNCTIONS (12 functions)
// ============================================================================

/**
 * Function 1: Create Lean Six Sigma DMAIC project
 * Define, Measure, Analyze, Improve, Control process improvement methodology
 *
 * @param context - Transformation context
 * @param data - Lean Six Sigma project data
 * @param transaction - Database transaction
 * @returns Created Lean Six Sigma project
 *
 * @example
 * ```typescript
 * const lssProject = await createLeanSixSigmaProject(context, {
 *   organizationId: 'org-123',
 *   projectName: 'Order Processing Optimization',
 *   projectType: 'DMAIC',
 *   problemStatement: 'High defect rate in order processing',
 *   goalStatement: 'Reduce defects by 50% within 6 months'
 * });
 * ```
 */
export { createLeanSixSigmaProject };

/**
 * Function 2: Calculate Six Sigma process capability
 * Cp, Cpk, and sigma level calculations for process quality
 *
 * @param data - Process measurement data
 * @param lowerSpecLimit - Lower specification limit
 * @param upperSpecLimit - Upper specification limit
 * @returns Process capability metrics (cp, cpk, sigma)
 */
export { calculateProcessCapability };

/**
 * Function 3: Calculate defects per million opportunities (DPMO)
 * Six Sigma quality metric for defect rate measurement
 *
 * @param defects - Number of defects
 * @param units - Number of units processed
 * @param opportunities - Defect opportunities per unit
 * @returns DPMO value
 */
export { calculateDPMO };

/**
 * Function 4: Assess change impact on operations
 * Impact assessment for process changes (high, medium, low)
 *
 * @param initiative - Process improvement initiative
 * @returns Impact level assessment
 */
export { assessChangeImpact };

/**
 * Function 5: Identify quick wins for rapid improvement
 * Low-effort, high-ROI improvement opportunities
 *
 * @param opportunities - Improvement opportunities
 * @returns Prioritized quick wins (top 5)
 */
export { identifyQuickWins };

/**
 * Function 6: Calculate change velocity
 * Progress rate measurement for transformation initiatives
 *
 * @param completedMilestones - Completed milestones
 * @param totalMilestones - Total milestones
 * @returns Change velocity percentage
 */
export { calculateChangeVelocity };

/**
 * Function 7: Track transformation risks
 * Risk monitoring and categorization
 *
 * @param risks - Transformation risks
 * @returns Risk tracking metrics (critical, high, open counts)
 */
export { trackTransformationRisks };

/**
 * Function 8: Generate training plan for process improvement
 * Training program for new process capabilities
 *
 * @param targetAudience - Training audience
 * @param requiredSkills - Required skill set
 * @returns Training activity plan
 */
export { generateTrainingPlan };

/**
 * Function 9: Assess cultural alignment for process change
 * Cultural readiness and alignment scoring
 *
 * @param current - Current culture profile
 * @param target - Target culture profile
 * @returns Cultural alignment score (0-100)
 */
export { assessCulturalAlignment };

/**
 * Function 10: Generate governance reports for transformation
 * Regular governance reporting for transformation oversight
 *
 * @param model - Change model (Kotter)
 * @param frequency - Report frequency (weekly/monthly)
 * @returns Governance report data
 */
export { generateGovernanceReports };

/**
 * Function 11: Forecast transformation timeline
 * Predict completion based on current velocity
 *
 * @param currentProgress - Current progress percentage
 * @param targetDate - Target completion date
 * @param velocity - Progress velocity
 * @returns Timeline forecast (on track status, estimated completion, variance)
 */
export { forecastTransformationTimeline };

/**
 * Function 12: Perform failure mode and effects analysis (FMEA)
 * Systematic risk analysis for process failures
 *
 * @param process - Process name
 * @param failureModes - Potential failure modes
 * @returns FMEA analysis with risk priority numbers
 */
export { performFMEA };

// ============================================================================
// RE-EXPORT PORTFOLIO & RESOURCE MANAGEMENT FUNCTIONS (20 functions)
// ============================================================================

/**
 * Function 13: Create operational portfolio
 * Portfolio setup for operational initiatives
 *
 * @param portfolioData - Portfolio data
 * @param userId - User ID
 * @returns Created portfolio
 */
export { createPortfolio };

/**
 * Function 14: Activate portfolio for execution
 * Portfolio activation and resource assignment
 *
 * @param portfolioId - Portfolio ID
 * @param userId - User ID
 * @returns Activated portfolio
 */
export { activatePortfolio };

/**
 * Function 15: Add project to operational portfolio
 * Project addition with priority scoring
 *
 * @param projectData - Project data
 * @param userId - User ID
 * @returns Added portfolio project
 */
export { addProjectToPortfolio };

/**
 * Function 16: Calculate project priority scores
 * Multi-criteria priority calculation
 *
 * @param project - Portfolio project
 * @param criteria - Scoring criteria
 * @returns Priority scores by criterion
 */
export { calculateProjectPriorityScores };

/**
 * Function 17: Prioritize operational projects
 * Rank projects by strategic value and urgency
 *
 * @param portfolioId - Portfolio ID
 * @param criteria - Prioritization criteria
 * @returns Prioritized project list
 */
export { prioritizeProjects };

/**
 * Function 18: Analyze portfolio balance
 * Risk, return, and strategic balance analysis
 *
 * @param portfolioId - Portfolio ID
 * @returns Balance analysis (risk score, strategic alignment, diversification)
 */
export { analyzePortfolioBalance };

/**
 * Function 19: Allocate resource to operational project
 * Resource assignment and allocation tracking
 *
 * @param allocationData - Allocation data
 * @param userId - User ID
 * @returns Created resource allocation
 */
export { allocateResourceToProject };

/**
 * Function 20: Check resource availability
 * Real-time resource capacity checking
 *
 * @param resourceId - Resource ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Availability details (allocated, available, conflicts)
 */
export { checkResourceAvailability };

/**
 * Function 21: Calculate capacity utilization
 * Resource and capacity utilization metrics
 *
 * @param portfolioId - Portfolio ID
 * @param resourceType - Optional resource type filter
 * @returns Capacity utilization data
 */
export { calculateCapacityUtilization };

/**
 * Function 22: Identify resource conflicts
 * Detect over-allocation and scheduling conflicts
 *
 * @param portfolioId - Portfolio ID
 * @returns Resource conflict list
 */
export { identifyResourceConflicts };

/**
 * Function 23: Optimize resource allocation
 * Automated resource optimization across portfolio
 *
 * @param portfolioId - Portfolio ID
 * @param constraints - Optimization constraints
 * @returns Optimized allocation plan
 */
export { optimizeResourceAllocation };

/**
 * Function 24: Forecast resource demand
 * Future resource demand projection
 *
 * @param portfolioId - Portfolio ID
 * @param monthsAhead - Forecast horizon in months
 * @returns Resource demand forecast
 */
export { forecastResourceDemand };

/**
 * Function 25: Optimize operational portfolio
 * Portfolio optimization under constraints
 *
 * @param portfolioId - Portfolio ID
 * @param constraints - Optimization constraints
 * @returns Optimization results (recommended projects, rejected projects, total value)
 */
export { optimizePortfolio };

/**
 * Function 26: Analyze portfolio risk
 * Comprehensive portfolio risk assessment
 *
 * @param portfolioId - Portfolio ID
 * @returns Risk analysis (overall risk, risk by category, top risks)
 */
export { analyzePortfolioRisk };

/**
 * Function 27: Calculate portfolio value
 * Total portfolio value and ROI calculation
 *
 * @param portfolioId - Portfolio ID
 * @returns Portfolio value metrics (total value, NPV, IRR, payback period)
 */
export { calculatePortfolioValue };

/**
 * Function 28: Assess strategic alignment of portfolio
 * Alignment with strategic objectives
 *
 * @param portfolioId - Portfolio ID
 * @param strategicObjectives - Strategic objectives
 * @returns Alignment assessment
 */
export { assessStrategicAlignment };

/**
 * Function 29: Create stage-gate review
 * Gate review and approval process
 *
 * @param reviewData - Review data
 * @param userId - User ID
 * @returns Created stage-gate review
 */
export { createStageGateReview };

/**
 * Function 30: Track benefits realization
 * Benefits tracking and measurement
 *
 * @param benefitData - Benefit data
 * @param userId - User ID
 * @returns Benefits realization tracking
 */
export { trackBenefitsRealization };

/**
 * Function 31: Generate portfolio governance report
 * Governance and oversight reporting
 *
 * @param portfolioId - Portfolio ID
 * @returns Governance report
 */
export { generateGovernanceReport };

/**
 * Function 32: Monitor portfolio health
 * Real-time portfolio health monitoring
 *
 * @param portfolioId - Portfolio ID
 * @returns Health metrics (overall health, budget variance, schedule variance, risk score)
 */
export { monitorPortfolioHealth };

// ============================================================================
// RE-EXPORT VALUE CHAIN & PERFORMANCE FUNCTIONS (10 functions)
// ============================================================================

/**
 * Function 33: Create value chain analysis
 * Primary and support activities analysis
 *
 * @param context - Strategy context
 * @param data - Value chain data
 * @param transaction - Database transaction
 * @returns Created value chain analysis
 */
export { createValueChainAnalysis };

/**
 * Function 34: Identify cost drivers in value chain
 * Cost driver analysis across activities
 *
 * @param activities - Value chain activities
 * @returns Identified cost drivers
 */
export { identifyCostDrivers };

/**
 * Function 35: Identify value drivers in operations
 * Value creation driver analysis
 *
 * @param activities - Value chain activities
 * @returns Identified value drivers
 */
export { identifyValueDrivers };

/**
 * Function 36: Identify competitive advantages
 * Competitive differentiation analysis
 *
 * @param activities - Value chain activities
 * @returns Competitive advantages
 */
export { identifyCompetitiveAdvantages };

/**
 * Function 37: Calculate value chain margin
 * Overall margin calculation across value chain
 *
 * @param analysis - Value chain analysis
 * @returns Value chain margin percentage
 */
export { calculateValueChainMargin };

/**
 * Function 38: Benchmark value chain activities
 * Industry benchmarking for activities
 *
 * @param activities - Value chain activities
 * @param industry - Industry code
 * @returns Benchmark comparison
 */
export { benchmarkValueChainActivities };

/**
 * Function 39: Perform operational gap analysis
 * Current vs target state gap identification
 *
 * @param currentState - Current state metrics
 * @param targetState - Target state metrics
 * @returns Gap analysis with closure actions
 */
export { performGapAnalysis };

/**
 * Function 40: Track operational KPIs
 * Key performance indicator monitoring
 *
 * @param objectives - Strategic objectives
 * @param period - Tracking period
 * @returns KPI tracking data
 */
export { trackStrategicKPIs };

/**
 * Function 41: Calculate risk priority number (RPN)
 * FMEA risk priority calculation
 *
 * @param severity - Severity score (1-10)
 * @param occurrence - Occurrence score (1-10)
 * @param detection - Detection score (1-10)
 * @returns Risk Priority Number
 */
export { calculateRPN };

/**
 * Function 42: Perform root cause analysis
 * Systematic root cause identification
 *
 * @param problem - Problem description
 * @param method - Analysis method (5-WHY, FISHBONE, PARETO)
 * @param data - Supporting data
 * @returns Root cause analysis results
 */
export { performRootCauseAnalysis };

// ============================================================================
// RE-EXPORT TYPES AND ENUMS
// ============================================================================

export type {
  LeanSixSigmaProject,
  DMAICPhase,
  ProcessState,
  ProcessStep,
  ImprovementOpportunity,
  ProcessImprovementInitiative,
  ProcessBenefit,
  ProcessRisk,
  TransformationContext,
  TransformationRisk,
  TrainingActivity,
  CultureProfile,
  Milestone,
  FinancialImpact,
  Portfolio,
  PortfolioProject,
  ResourceAllocation,
  ResourceRequirement,
  CapacityPlan,
  CapacityBreakdown,
  ProjectDependency,
  ProjectMilestone,
  PortfolioOptimization,
  OptimizationConstraints,
  BenefitsRealization,
  StageGateReview,
  ReviewCriterion,
  PortfolioScenario,
  Risk,
  RiskScore,
  RiskControl,
  RiskMatrix,
  FMEAAnalysis,
  FailureMode,
  RootCauseAnalysis,
  ValueChainAnalysis,
  ValueActivity,
  CompetitiveAdvantage,
  StrategicObjective,
  PerformanceMeasure,
};

export {
  TransformationFramework,
  TransformationStatus,
  PortfolioStatus,
  ProjectPriority,
  ProjectStage,
  AllocationStatus,
  PortfolioHealth,
  RiskLevel,
  RiskStatus,
  ControlType,
  ControlEffectiveness,
};

/**
 * Default export with all BCG operations composite utilities
 */
export default {
  // Lean Six Sigma & Process Improvement
  createLeanSixSigmaProject,
  calculateProcessCapability,
  calculateDPMO,
  assessChangeImpact,
  identifyQuickWins,
  calculateChangeVelocity,
  trackTransformationRisks,
  generateTrainingPlan,
  assessCulturalAlignment,
  generateGovernanceReports,
  forecastTransformationTimeline,
  performFMEA,

  // Portfolio & Resource Management
  createPortfolio,
  activatePortfolio,
  addProjectToPortfolio,
  calculateProjectPriorityScores,
  prioritizeProjects,
  analyzePortfolioBalance,
  allocateResourceToProject,
  checkResourceAvailability,
  calculateCapacityUtilization,
  identifyResourceConflicts,
  optimizeResourceAllocation,
  forecastResourceDemand,
  optimizePortfolio,
  analyzePortfolioRisk,
  calculatePortfolioValue,
  assessStrategicAlignment,
  createStageGateReview,
  trackBenefitsRealization,
  generateGovernanceReport,
  monitorPortfolioHealth,

  // Value Chain & Performance
  createValueChainAnalysis,
  identifyCostDrivers,
  identifyValueDrivers,
  identifyCompetitiveAdvantages,
  calculateValueChainMargin,
  benchmarkValueChainActivities,
  performGapAnalysis,
  trackStrategicKPIs,
  calculateRPN,
  performRootCauseAnalysis,
};
