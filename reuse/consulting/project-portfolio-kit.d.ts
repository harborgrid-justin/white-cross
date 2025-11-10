/**
 * LOC: CONSPPM12345
 * File: /reuse/consulting/project-portfolio-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend consulting services
 *   - Portfolio management controllers
 *   - Resource allocation engines
 *   - Strategic planning services
 */
/**
 * File: /reuse/consulting/project-portfolio-kit.ts
 * Locator: WC-CONS-PPM-001
 * Purpose: Comprehensive Project Portfolio Management Utilities - Enterprise-grade PPM framework
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Portfolio controllers, resource services, capacity planning, strategic alignment
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for portfolio management, project prioritization, resource allocation, capacity planning
 *
 * LLM Context: Enterprise-grade project portfolio management system for consulting organizations.
 * Provides complete portfolio lifecycle management, strategic alignment, project prioritization,
 * resource capacity planning, portfolio optimization, risk-adjusted portfolio valuation, governance,
 * benefits realization, dependency management, portfolio reporting, investment analysis, stage-gate reviews,
 * portfolio balancing, scenario analysis, what-if modeling, roadmap planning.
 */
import { Sequelize } from 'sequelize';
/**
 * Portfolio status
 */
export declare enum PortfolioStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    UNDER_REVIEW = "under_review",
    ARCHIVED = "archived",
    CLOSED = "closed"
}
/**
 * Project priority levels
 */
export declare enum ProjectPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    ON_HOLD = "on_hold"
}
/**
 * Strategic alignment categories
 */
export declare enum StrategicAlignment {
    REVENUE_GROWTH = "revenue_growth",
    COST_REDUCTION = "cost_reduction",
    MARKET_EXPANSION = "market_expansion",
    DIGITAL_TRANSFORMATION = "digital_transformation",
    OPERATIONAL_EXCELLENCE = "operational_excellence",
    CUSTOMER_SATISFACTION = "customer_satisfaction",
    INNOVATION = "innovation",
    COMPLIANCE = "compliance"
}
/**
 * Project stage
 */
export declare enum ProjectStage {
    IDEATION = "ideation",
    EVALUATION = "evaluation",
    APPROVAL = "approval",
    PLANNING = "planning",
    EXECUTION = "execution",
    MONITORING = "monitoring",
    CLOSING = "closing",
    COMPLETED = "completed"
}
/**
 * Resource allocation status
 */
export declare enum AllocationStatus {
    PROPOSED = "proposed",
    CONFIRMED = "confirmed",
    ACTIVE = "active",
    RELEASED = "released",
    OVERALLOCATED = "overallocated"
}
/**
 * Portfolio health status
 */
export declare enum PortfolioHealth {
    GREEN = "green",
    YELLOW = "yellow",
    RED = "red",
    CRITICAL = "critical"
}
/**
 * Investment category
 */
export declare enum InvestmentCategory {
    TRANSFORMATIONAL = "transformational",
    STRATEGIC = "strategic",
    OPERATIONAL = "operational",
    MAINTENANCE = "maintenance",
    INNOVATION = "innovation"
}
/**
 * Risk level
 */
export declare enum RiskLevel {
    VERY_LOW = "very_low",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    VERY_HIGH = "very_high"
}
/**
 * Portfolio interface
 */
export interface Portfolio {
    id: string;
    portfolioName: string;
    portfolioCode: string;
    description: string;
    organizationId: string;
    ownerId: string;
    status: PortfolioStatus;
    strategicObjectives: string[];
    totalBudget: number;
    allocatedBudget: number;
    availableBudget: number;
    projectCount: number;
    activeProjectCount: number;
    targetROI: number;
    actualROI: number;
    healthStatus: PortfolioHealth;
    startDate: Date;
    endDate?: Date;
    fiscalYear: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
}
/**
 * Portfolio project interface
 */
export interface PortfolioProject {
    id: string;
    portfolioId: string;
    projectCode: string;
    projectName: string;
    description: string;
    priority: ProjectPriority;
    stage: ProjectStage;
    strategicAlignment: StrategicAlignment[];
    investmentCategory: InvestmentCategory;
    estimatedBudget: number;
    actualBudget: number;
    estimatedBenefit: number;
    actualBenefit: number;
    npv: number;
    irr: number;
    paybackPeriod: number;
    riskScore: number;
    riskLevel: RiskLevel;
    complexityScore: number;
    strategicValue: number;
    priorityScore: number;
    resourceRequirements: ResourceRequirement[];
    dependencies: ProjectDependency[];
    milestones: ProjectMilestone[];
    startDate: Date;
    endDate: Date;
    status: string;
    healthStatus: PortfolioHealth;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Resource requirement interface
 */
export interface ResourceRequirement {
    id: string;
    projectId: string;
    resourceType: string;
    skillSet: string[];
    requiredFTE: number;
    startDate: Date;
    endDate: Date;
    priority: ProjectPriority;
    fulfillment: number;
}
/**
 * Resource allocation interface
 */
export interface ResourceAllocation {
    id: string;
    resourceId: string;
    resourceName: string;
    projectId: string;
    projectName: string;
    allocationPercentage: number;
    startDate: Date;
    endDate: Date;
    status: AllocationStatus;
    role: string;
    costRate: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Capacity planning interface
 */
export interface CapacityPlan {
    id: string;
    portfolioId: string;
    planningPeriod: string;
    totalCapacity: number;
    allocatedCapacity: number;
    availableCapacity: number;
    utilizationRate: number;
    demandForecast: number;
    supplyForecast: number;
    capacityGap: number;
    resourceBreakdown: CapacityBreakdown[];
    recommendations: string[];
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Capacity breakdown interface
 */
export interface CapacityBreakdown {
    resourceType: string;
    totalCapacity: number;
    allocated: number;
    available: number;
    utilizationRate: number;
}
/**
 * Project dependency interface
 */
export interface ProjectDependency {
    id: string;
    sourceProjectId: string;
    targetProjectId: string;
    dependencyType: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
    lag: number;
    isCritical: boolean;
    description: string;
}
/**
 * Project milestone interface
 */
export interface ProjectMilestone {
    id: string;
    projectId: string;
    milestoneName: string;
    targetDate: Date;
    actualDate?: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'delayed';
    deliverables: string[];
}
/**
 * Portfolio optimization result interface
 */
export interface PortfolioOptimization {
    portfolioId: string;
    optimizationDate: Date;
    constraints: OptimizationConstraints;
    recommendedProjects: string[];
    rejectedProjects: string[];
    totalValue: number;
    totalCost: number;
    totalRisk: number;
    utilizationRate: number;
    strategicFit: number;
    recommendations: string[];
}
/**
 * Optimization constraints interface
 */
export interface OptimizationConstraints {
    maxBudget: number;
    maxRisk: number;
    minROI: number;
    requiredStrategicAlignment: StrategicAlignment[];
    resourceConstraints: Record<string, number>;
}
/**
 * Benefits realization interface
 */
export interface BenefitsRealization {
    id: string;
    projectId: string;
    benefitType: string;
    description: string;
    estimatedValue: number;
    actualValue: number;
    realizationDate: Date;
    measurementMethod: string;
    status: 'planned' | 'in_progress' | 'realized' | 'at_risk';
    metadata: Record<string, any>;
}
/**
 * Stage gate review interface
 */
export interface StageGateReview {
    id: string;
    projectId: string;
    stage: ProjectStage;
    reviewDate: Date;
    reviewers: string[];
    criteria: ReviewCriterion[];
    overallScore: number;
    decision: 'approved' | 'conditional' | 'rejected' | 'cancelled';
    conditions: string[];
    recommendations: string[];
    nextReviewDate?: Date;
    metadata: Record<string, any>;
}
/**
 * Review criterion interface
 */
export interface ReviewCriterion {
    criterionName: string;
    weight: number;
    score: number;
    maxScore: number;
    comments: string;
}
/**
 * Portfolio scenario interface
 */
export interface PortfolioScenario {
    id: string;
    portfolioId: string;
    scenarioName: string;
    description: string;
    assumptions: string[];
    projectSelections: string[];
    totalBudget: number;
    totalBenefit: number;
    totalRisk: number;
    strategicAlignment: number;
    npv: number;
    roi: number;
    createdAt: Date;
    createdBy: string;
}
/**
 * Create portfolio DTO
 */
export declare class CreatePortfolioDto {
    portfolioName: string;
    description: string;
    organizationId: string;
    ownerId: string;
    totalBudget: number;
    targetROI: number;
    fiscalYear: number;
    strategicObjectives: string[];
}
/**
 * Add project to portfolio DTO
 */
export declare class AddProjectToPortfolioDto {
    portfolioId: string;
    projectName: string;
    description: string;
    priority: ProjectPriority;
    strategicAlignment: StrategicAlignment[];
    investmentCategory: InvestmentCategory;
    estimatedBudget: number;
    estimatedBenefit: number;
    startDate: Date;
    endDate: Date;
}
/**
 * Prioritize projects DTO
 */
export declare class PrioritizeProjectsDto {
    portfolioId: string;
    strategicWeight: number;
    financialWeight: number;
    riskWeight: number;
    resourceWeight: number;
}
/**
 * Allocate resource DTO
 */
export declare class AllocateResourceDto {
    resourceId: string;
    projectId: string;
    allocationPercentage: number;
    startDate: Date;
    endDate: Date;
    role: string;
    costRate: number;
}
/**
 * Create stage gate review DTO
 */
export declare class CreateStageGateReviewDto {
    projectId: string;
    stage: ProjectStage;
    reviewers: string[];
    reviewDate: Date;
    overallScore: number;
    decision: 'approved' | 'conditional' | 'rejected' | 'cancelled';
}
/**
 * Create portfolio scenario DTO
 */
export declare class CreatePortfolioScenarioDto {
    portfolioId: string;
    scenarioName: string;
    description: string;
    projectSelections: string[];
    assumptions: string[];
}
/**
 * Sequelize model for Portfolio.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Portfolio model
 *
 * @example
 * ```typescript
 * const Portfolio = createPortfolioModel(sequelize);
 * const portfolio = await Portfolio.create({
 *   portfolioName: 'Digital Transformation 2025',
 *   organizationId: 'org-uuid',
 *   totalBudget: 5000000,
 *   fiscalYear: 2025
 * });
 * ```
 */
export declare const createPortfolioModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        portfolioName: string;
        portfolioCode: string;
        description: string;
        organizationId: string;
        ownerId: string;
        status: string;
        strategicObjectives: string[];
        totalBudget: number;
        allocatedBudget: number;
        availableBudget: number;
        projectCount: number;
        activeProjectCount: number;
        targetROI: number;
        actualROI: number;
        healthStatus: string;
        startDate: Date;
        endDate: Date | null;
        fiscalYear: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Portfolio Project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PortfolioProject model
 *
 * @example
 * ```typescript
 * const PortfolioProject = createPortfolioProjectModel(sequelize);
 * const project = await PortfolioProject.create({
 *   portfolioId: 'portfolio-uuid',
 *   projectName: 'ERP Implementation',
 *   estimatedBudget: 1200000,
 *   priority: 'high'
 * });
 * ```
 */
export declare const createPortfolioProjectModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        portfolioId: string;
        projectCode: string;
        projectName: string;
        description: string;
        priority: string;
        stage: string;
        strategicAlignment: string[];
        investmentCategory: string;
        estimatedBudget: number;
        actualBudget: number;
        estimatedBenefit: number;
        actualBenefit: number;
        npv: number;
        irr: number;
        paybackPeriod: number;
        riskScore: number;
        riskLevel: string;
        complexityScore: number;
        strategicValue: number;
        priorityScore: number;
        resourceRequirements: any[];
        dependencies: any[];
        milestones: any[];
        startDate: Date;
        endDate: Date;
        status: string;
        healthStatus: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Resource Allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ResourceAllocation model
 *
 * @example
 * ```typescript
 * const ResourceAllocation = createResourceAllocationModel(sequelize);
 * const allocation = await ResourceAllocation.create({
 *   resourceId: 'res-uuid',
 *   projectId: 'proj-uuid',
 *   allocationPercentage: 50
 * });
 * ```
 */
export declare const createResourceAllocationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        resourceId: string;
        resourceName: string;
        projectId: string;
        projectName: string;
        allocationPercentage: number;
        startDate: Date;
        endDate: Date;
        status: string;
        role: string;
        costRate: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new portfolio with strategic objectives.
 *
 * @param {any} portfolioData - Portfolio creation data
 * @param {string} userId - User creating portfolio
 * @returns {Promise<Portfolio>} Created portfolio
 *
 * @example
 * ```typescript
 * const portfolio = await createPortfolio({
 *   portfolioName: 'Digital Transformation 2025',
 *   organizationId: 'org-123',
 *   totalBudget: 5000000,
 *   targetROI: 25,
 *   fiscalYear: 2025,
 *   strategicObjectives: ['Revenue Growth', 'Customer Experience']
 * }, 'user-456');
 * ```
 */
export declare const createPortfolio: (portfolioData: any, userId: string) => Promise<Portfolio>;
/**
 * Activates portfolio for active management.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {string} userId - User activating portfolio
 * @returns {Promise<Portfolio>} Activated portfolio
 *
 * @example
 * ```typescript
 * const activated = await activatePortfolio('portfolio-123', 'user-456');
 * ```
 */
export declare const activatePortfolio: (portfolioId: string, userId: string) => Promise<Portfolio>;
/**
 * Adds a project to portfolio with financial analysis.
 *
 * @param {any} projectData - Project data
 * @param {string} userId - User adding project
 * @returns {Promise<PortfolioProject>} Created project
 *
 * @example
 * ```typescript
 * const project = await addProjectToPortfolio({
 *   portfolioId: 'portfolio-123',
 *   projectName: 'CRM Implementation',
 *   estimatedBudget: 500000,
 *   estimatedBenefit: 1200000,
 *   priority: 'high',
 *   strategicAlignment: ['revenue_growth', 'customer_satisfaction']
 * }, 'user-456');
 * ```
 */
export declare const addProjectToPortfolio: (projectData: any, userId: string) => Promise<PortfolioProject>;
/**
 * Calculates project priority scores based on multiple factors.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} weights - Weighting factors for prioritization
 * @returns {Promise<PortfolioProject[]>} Projects with calculated priority scores
 *
 * @example
 * ```typescript
 * const prioritized = await calculateProjectPriorityScores('portfolio-123', {
 *   strategicWeight: 0.4,
 *   financialWeight: 0.35,
 *   riskWeight: 0.15,
 *   resourceWeight: 0.1
 * });
 * ```
 */
export declare const calculateProjectPriorityScores: (portfolioId: string, weights: any) => Promise<PortfolioProject[]>;
/**
 * Prioritizes projects using weighted scoring model.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} criteria - Prioritization criteria
 * @returns {Promise<PortfolioProject[]>} Sorted projects by priority
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizeProjects('portfolio-123', {
 *   strategicFit: 0.4,
 *   financialReturn: 0.35,
 *   riskProfile: 0.15,
 *   resourceAvailability: 0.1
 * });
 * ```
 */
export declare const prioritizeProjects: (portfolioId: string, criteria: any) => Promise<PortfolioProject[]>;
/**
 * Performs portfolio balancing analysis.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Portfolio balance analysis
 *
 * @example
 * ```typescript
 * const balance = await analyzePortfolioBalance('portfolio-123');
 * // Returns investment category distribution, risk distribution, etc.
 * ```
 */
export declare const analyzePortfolioBalance: (portfolioId: string) => Promise<any>;
/**
 * Allocates resource to project.
 *
 * @param {any} allocationData - Allocation data
 * @param {string} userId - User creating allocation
 * @returns {Promise<ResourceAllocation>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateResourceToProject({
 *   resourceId: 'res-123',
 *   projectId: 'proj-456',
 *   allocationPercentage: 50,
 *   role: 'Senior Consultant',
 *   costRate: 150
 * }, 'user-789');
 * ```
 */
export declare const allocateResourceToProject: (allocationData: any, userId: string) => Promise<ResourceAllocation>;
/**
 * Checks resource availability for allocation.
 *
 * @param {string} resourceId - Resource identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Availability analysis
 *
 * @example
 * ```typescript
 * const availability = await checkResourceAvailability(
 *   'res-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-06-30')
 * );
 * ```
 */
export declare const checkResourceAvailability: (resourceId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Calculates capacity utilization for portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {Promise<CapacityPlan>} Capacity plan
 *
 * @example
 * ```typescript
 * const capacity = await calculateCapacityUtilization(
 *   'portfolio-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 * ```
 */
export declare const calculateCapacityUtilization: (portfolioId: string, startDate: Date, endDate: Date) => Promise<CapacityPlan>;
/**
 * Identifies resource conflicts and overallocations.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any[]>} Resource conflicts
 *
 * @example
 * ```typescript
 * const conflicts = await identifyResourceConflicts('portfolio-123');
 * ```
 */
export declare const identifyResourceConflicts: (portfolioId: string) => Promise<any[]>;
/**
 * Optimizes resource allocation across portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} constraints - Optimization constraints
 * @returns {Promise<any>} Optimization results
 *
 * @example
 * ```typescript
 * const optimized = await optimizeResourceAllocation('portfolio-123', {
 *   maxUtilization: 85,
 *   priorityProjects: ['proj-1', 'proj-2']
 * });
 * ```
 */
export declare const optimizeResourceAllocation: (portfolioId: string, constraints: any) => Promise<any>;
/**
 * Forecasts resource demand for planning period.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {number} monthsAhead - Months to forecast
 * @returns {Promise<any>} Demand forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastResourceDemand('portfolio-123', 12);
 * ```
 */
export declare const forecastResourceDemand: (portfolioId: string, monthsAhead: number) => Promise<any>;
/**
 * Performs portfolio optimization using constraints.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {OptimizationConstraints} constraints - Optimization constraints
 * @returns {Promise<PortfolioOptimization>} Optimization results
 *
 * @example
 * ```typescript
 * const optimized = await optimizePortfolio('portfolio-123', {
 *   maxBudget: 5000000,
 *   maxRisk: 60,
 *   minROI: 20,
 *   requiredStrategicAlignment: ['revenue_growth', 'innovation'],
 *   resourceConstraints: { 'Senior Consultant': 10 }
 * });
 * ```
 */
export declare const optimizePortfolio: (portfolioId: string, constraints: OptimizationConstraints) => Promise<PortfolioOptimization>;
/**
 * Analyzes portfolio risk profile.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Risk analysis
 *
 * @example
 * ```typescript
 * const riskProfile = await analyzePortfolioRisk('portfolio-123');
 * ```
 */
export declare const analyzePortfolioRisk: (portfolioId: string) => Promise<any>;
/**
 * Calculates portfolio value metrics (NPV, IRR, ROI).
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Value metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePortfolioValue('portfolio-123');
 * ```
 */
export declare const calculatePortfolioValue: (portfolioId: string) => Promise<any>;
/**
 * Performs what-if scenario analysis.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} scenarioParameters - Scenario parameters
 * @returns {Promise<any>} Scenario analysis results
 *
 * @example
 * ```typescript
 * const whatIf = await performWhatIfAnalysis('portfolio-123', {
 *   budgetIncrease: 10,
 *   resourceIncrease: 5,
 *   riskTolerance: 'high'
 * });
 * ```
 */
export declare const performWhatIfAnalysis: (portfolioId: string, scenarioParameters: any) => Promise<any>;
/**
 * Creates portfolio scenario for comparison.
 *
 * @param {any} scenarioData - Scenario data
 * @param {string} userId - User creating scenario
 * @returns {Promise<PortfolioScenario>} Created scenario
 *
 * @example
 * ```typescript
 * const scenario = await createPortfolioScenario({
 *   portfolioId: 'portfolio-123',
 *   scenarioName: 'Aggressive Growth',
 *   projectSelections: ['proj-1', 'proj-2', 'proj-3'],
 *   assumptions: ['15% budget increase', 'Additional 5 resources']
 * }, 'user-456');
 * ```
 */
export declare const createPortfolioScenario: (scenarioData: any, userId: string) => Promise<PortfolioScenario>;
/**
 * Compares multiple portfolio scenarios.
 *
 * @param {string[]} scenarioIds - Scenario identifiers
 * @returns {Promise<any>} Comparison analysis
 *
 * @example
 * ```typescript
 * const comparison = await comparePortfolioScenarios([
 *   'scenario-1', 'scenario-2', 'scenario-3'
 * ]);
 * ```
 */
export declare const comparePortfolioScenarios: (scenarioIds: string[]) => Promise<any>;
/**
 * Assesses strategic alignment of projects.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {string[]} strategicObjectives - Strategic objectives
 * @returns {Promise<any>} Alignment assessment
 *
 * @example
 * ```typescript
 * const alignment = await assessStrategicAlignment('portfolio-123', [
 *   'Revenue Growth', 'Customer Satisfaction', 'Innovation'
 * ]);
 * ```
 */
export declare const assessStrategicAlignment: (portfolioId: string, strategicObjectives: string[]) => Promise<any>;
/**
 * Creates stage gate review for project.
 *
 * @param {any} reviewData - Review data
 * @param {string} userId - User creating review
 * @returns {Promise<StageGateReview>} Created review
 *
 * @example
 * ```typescript
 * const review = await createStageGateReview({
 *   projectId: 'proj-123',
 *   stage: 'approval',
 *   overallScore: 85,
 *   decision: 'approved',
 *   reviewers: ['user-1', 'user-2']
 * }, 'user-456');
 * ```
 */
export declare const createStageGateReview: (reviewData: any, userId: string) => Promise<StageGateReview>;
/**
 * Tracks benefits realization for project.
 *
 * @param {any} benefitData - Benefit data
 * @param {string} userId - User tracking benefit
 * @returns {Promise<BenefitsRealization>} Benefit record
 *
 * @example
 * ```typescript
 * const benefit = await trackBenefitsRealization({
 *   projectId: 'proj-123',
 *   benefitType: 'Revenue Increase',
 *   estimatedValue: 500000,
 *   actualValue: 550000
 * }, 'user-456');
 * ```
 */
export declare const trackBenefitsRealization: (benefitData: any, userId: string) => Promise<BenefitsRealization>;
/**
 * Generates portfolio governance report.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Governance report
 *
 * @example
 * ```typescript
 * const report = await generateGovernanceReport('portfolio-123');
 * ```
 */
export declare const generateGovernanceReport: (portfolioId: string) => Promise<any>;
/**
 * Monitors portfolio health indicators.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Health indicators
 *
 * @example
 * ```typescript
 * const health = await monitorPortfolioHealth('portfolio-123');
 * ```
 */
export declare const monitorPortfolioHealth: (portfolioId: string) => Promise<any>;
/**
 * Generates comprehensive portfolio dashboard.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generatePortfolioDashboard('portfolio-123');
 * ```
 */
export declare const generatePortfolioDashboard: (portfolioId: string) => Promise<any>;
/**
 * Generates executive portfolio summary report.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateExecutiveSummary('portfolio-123');
 * ```
 */
export declare const generateExecutiveSummary: (portfolioId: string) => Promise<any>;
/**
 * Analyzes portfolio trends over time.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {number} months - Number of months to analyze
 * @returns {Promise<any>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzePortfolioTrends('portfolio-123', 12);
 * ```
 */
export declare const analyzePortfolioTrends: (portfolioId: string, months: number) => Promise<any>;
/**
 * Generates portfolio performance metrics report.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any>} Performance report
 *
 * @example
 * ```typescript
 * const performance = await generatePerformanceReport(
 *   'portfolio-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-03-31')
 * );
 * ```
 */
export declare const generatePerformanceReport: (portfolioId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Exports portfolio data for external analysis.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {string} format - Export format (json, csv, excel)
 * @returns {Promise<any>} Exported data
 *
 * @example
 * ```typescript
 * const exported = await exportPortfolioData('portfolio-123', 'json');
 * ```
 */
export declare const exportPortfolioData: (portfolioId: string, format: string) => Promise<any>;
/**
 * Analyzes project dependencies.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Dependency analysis
 *
 * @example
 * ```typescript
 * const dependencies = await analyzeProjectDependencies('portfolio-123');
 * ```
 */
export declare const analyzeProjectDependencies: (portfolioId: string) => Promise<any>;
/**
 * Identifies critical path through portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Critical path analysis
 *
 * @example
 * ```typescript
 * const criticalPath = await identifyCriticalPath('portfolio-123');
 * ```
 */
export declare const identifyCriticalPath: (portfolioId: string) => Promise<any>;
/**
 * Creates portfolio roadmap.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {number} timeHorizonMonths - Roadmap time horizon
 * @returns {Promise<any>} Portfolio roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await createPortfolioRoadmap('portfolio-123', 24);
 * ```
 */
export declare const createPortfolioRoadmap: (portfolioId: string, timeHorizonMonths: number) => Promise<any>;
/**
 * Validates portfolio schedule feasibility.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<any>} Feasibility analysis
 *
 * @example
 * ```typescript
 * const feasibility = await validateScheduleFeasibility('portfolio-123');
 * ```
 */
export declare const validateScheduleFeasibility: (portfolioId: string) => Promise<any>;
/**
 * Manages project interdependencies and constraints.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {ProjectDependency[]} dependencies - Project dependencies
 * @returns {Promise<any>} Dependency management result
 *
 * @example
 * ```typescript
 * const managed = await manageProjectInterdependencies('portfolio-123', [
 *   {
 *     sourceProjectId: 'proj-1',
 *     targetProjectId: 'proj-2',
 *     dependencyType: 'finish_to_start',
 *     isCritical: true
 *   }
 * ]);
 * ```
 */
export declare const manageProjectInterdependencies: (portfolioId: string, dependencies: ProjectDependency[]) => Promise<any>;
//# sourceMappingURL=project-portfolio-kit.d.ts.map