/**
 * LOC: INNO1234567
 * File: /reuse/consulting/innovation-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../config-management-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend innovation services
 *   - R&D management controllers
 *   - Portfolio optimization services
 */
/**
 * File: /reuse/consulting/innovation-management-kit.ts
 * Locator: WC-INNO-MGT-001
 * Purpose: Comprehensive Innovation Management & R&D Optimization Utilities
 *
 * Upstream: Error handling, validation, configuration management utilities
 * Downstream: ../backend/*, Innovation controllers, R&D services, portfolio managers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for stage-gate process, innovation funnels, portfolio management, R&D optimization
 *
 * LLM Context: Enterprise-grade innovation management system for managing innovation lifecycles.
 * Provides stage-gate process management, innovation funnel tracking, portfolio optimization, R&D resource allocation,
 * idea management, technology assessment, innovation metrics, governance frameworks, collaboration tools,
 * technology scouting, patent management, innovation roadmaps, and innovation ecosystem management.
 */
import { Sequelize } from 'sequelize';
interface InnovationIdea {
    ideaId: string;
    title: string;
    description: string;
    submittedBy: string;
    submittedAt: Date;
    category: 'PRODUCT' | 'PROCESS' | 'BUSINESS_MODEL' | 'TECHNOLOGY' | 'SERVICE';
    stage: 'IDEATION' | 'CONCEPT' | 'DEVELOPMENT' | 'TESTING' | 'LAUNCH' | 'RETIRED';
    status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    estimatedImpact: number;
    estimatedCost: number;
    estimatedROI: number;
    tags: string[];
    attachments: string[];
}
interface StageGatePhase {
    phaseId: string;
    phaseName: string;
    phaseNumber: number;
    gateType: 'DISCOVERY' | 'SCOPING' | 'BUSINESS_CASE' | 'DEVELOPMENT' | 'TESTING' | 'LAUNCH';
    criteria: Array<{
        criterion: string;
        weight: number;
        score: number;
    }>;
    requiredDocuments: string[];
    approvers: string[];
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
    duration: number;
    budget: number;
    completionDate?: Date;
}
interface InnovationPortfolio {
    portfolioId: string;
    portfolioName: string;
    strategy: 'CORE' | 'ADJACENT' | 'TRANSFORMATIONAL';
    totalBudget: number;
    allocatedBudget: number;
    numberOfProjects: number;
    projects: Array<{
        projectId: string;
        projectName: string;
        budget: number;
        expectedValue: number;
        riskLevel: string;
        stage: string;
    }>;
    performanceMetrics: {
        avgROI: number;
        successRate: number;
        timeToMarket: number;
    };
}
interface RDProject {
    projectId: string;
    projectName: string;
    projectType: 'BASIC_RESEARCH' | 'APPLIED_RESEARCH' | 'EXPERIMENTAL_DEVELOPMENT';
    leadResearcher: string;
    team: string[];
    budget: number;
    spentBudget: number;
    startDate: Date;
    endDate: Date;
    milestones: Array<{
        name: string;
        dueDate: Date;
        completed: boolean;
    }>;
    deliverables: string[];
    kpis: Array<{
        metric: string;
        target: number;
        actual: number;
    }>;
    risks: Array<{
        risk: string;
        severity: string;
        mitigation: string;
    }>;
}
interface InnovationMetric {
    metricId: string;
    metricName: string;
    metricType: 'INPUT' | 'OUTPUT' | 'OUTCOME' | 'IMPACT';
    category: 'EFFICIENCY' | 'EFFECTIVENESS' | 'QUALITY' | 'SPEED' | 'FINANCIAL';
    value: number;
    target: number;
    unit: string;
    period: string;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    benchmark: number;
}
interface TechnologyAssessment {
    assessmentId: string;
    technologyName: string;
    technologyType: string;
    maturityLevel: 'CONCEPT' | 'PROTOTYPE' | 'PILOT' | 'DEPLOYED' | 'MATURE';
    readinessLevel: number;
    strategicFit: number;
    technicalFeasibility: number;
    commercialViability: number;
    competitiveAdvantage: number;
    overallScore: number;
    recommendation: 'INVEST' | 'EXPLORE' | 'MONITOR' | 'DIVEST';
    assessedBy: string;
    assessedAt: Date;
}
interface InnovationFunnel {
    funnelId: string;
    stage: 'IDEATION' | 'SCREENING' | 'VALIDATION' | 'DEVELOPMENT' | 'SCALING';
    ideasCount: number;
    conversionRate: number;
    avgTimeInStage: number;
    dropoutRate: number;
    qualityScore: number;
}
interface InnovationGovernance {
    governanceId: string;
    policyName: string;
    policyType: 'APPROVAL' | 'FUNDING' | 'RESOURCE_ALLOCATION' | 'RISK_MANAGEMENT';
    decisionCriteria: string[];
    approvalLevels: Array<{
        level: string;
        threshold: number;
        approvers: string[];
    }>;
    reviewFrequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
    lastReview: Date;
    nextReview: Date;
}
interface CollaborationTeam {
    teamId: string;
    teamName: string;
    teamType: 'CROSS_FUNCTIONAL' | 'SPECIALIZED' | 'VIRTUAL' | 'EXTERNAL';
    members: Array<{
        userId: string;
        role: string;
        expertise: string[];
    }>;
    projects: string[];
    performanceScore: number;
    collaborationTools: string[];
}
export declare class CreateInnovationIdeaDto {
    title: string;
    description: string;
    category: string;
    estimatedImpact: number;
    estimatedCost: number;
    tags: string[];
}
export declare class UpdateStageGatePhaseDto {
    status: string;
    completionPercentage: number;
    comments?: string;
}
export declare class CreateRDProjectDto {
    projectName: string;
    projectType: string;
    leadResearcher: string;
    budget: number;
    startDate: Date;
    endDate: Date;
}
export declare class InnovationMetricDto {
    metricName: string;
    metricType: string;
    value: number;
    target: number;
    unit: string;
}
/**
 * Sequelize model for Innovation Ideas with full lifecycle tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InnovationIdea model
 *
 * @example
 * ```typescript
 * const InnovationIdea = createInnovationIdeaModel(sequelize);
 * const idea = await InnovationIdea.create({
 *   title: 'AI-Powered Scheduler',
 *   category: 'TECHNOLOGY',
 *   stage: 'IDEATION',
 *   status: 'SUBMITTED'
 * });
 * ```
 */
export declare const createInnovationIdeaModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        ideaId: string;
        title: string;
        description: string;
        submittedBy: string;
        submittedAt: Date;
        category: string;
        stage: string;
        status: string;
        priority: string;
        estimatedImpact: number;
        estimatedCost: number;
        estimatedROI: number;
        actualImpact: number | null;
        actualCost: number | null;
        actualROI: number | null;
        tags: string[];
        attachments: string[];
        votes: number;
        comments: number;
        assignedTo: string | null;
        implementedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for R&D Projects with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RDProject model
 *
 * @example
 * ```typescript
 * const RDProject = createRDProjectModel(sequelize);
 * const project = await RDProject.create({
 *   projectName: 'Quantum Computing Research',
 *   projectType: 'BASIC_RESEARCH',
 *   budget: 2000000,
 *   leadResearcher: 'dr.johnson'
 * });
 * ```
 */
export declare const createRDProjectModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        projectId: string;
        projectName: string;
        projectType: string;
        leadResearcher: string;
        team: string[];
        budget: number;
        spentBudget: number;
        startDate: Date;
        endDate: Date;
        actualEndDate: Date | null;
        status: string;
        completionPercentage: number;
        milestones: Record<string, any>;
        deliverables: string[];
        kpis: Record<string, any>;
        risks: Record<string, any>;
        publications: number;
        patents: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Innovation Portfolio Management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InnovationPortfolio model
 *
 * @example
 * ```typescript
 * const InnovationPortfolio = createInnovationPortfolioModel(sequelize);
 * const portfolio = await InnovationPortfolio.create({
 *   portfolioName: 'Digital Transformation',
 *   strategy: 'TRANSFORMATIONAL',
 *   totalBudget: 10000000
 * });
 * ```
 */
export declare const createInnovationPortfolioModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        portfolioId: string;
        portfolioName: string;
        strategy: string;
        totalBudget: number;
        allocatedBudget: number;
        numberOfProjects: number;
        projects: Record<string, any>;
        performanceMetrics: Record<string, any>;
        balanceScore: number;
        riskScore: number;
        owner: string;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new stage-gate process for innovation project.
 *
 * @param {string} projectId - Project ID
 * @param {string} projectName - Project name
 * @param {number} numberOfGates - Number of gates (typically 5-7)
 * @returns {Promise<Array<StageGatePhase>>} Stage-gate phases
 *
 * @example
 * ```typescript
 * const phases = await createStageGateProcess('PROJ-001', 'New Product Launch', 5);
 * ```
 */
export declare const createStageGateProcess: (projectId: string, projectName: string, numberOfGates?: number) => Promise<Array<StageGatePhase>>;
/**
 * Evaluates gate criteria and determines if project can proceed.
 *
 * @param {string} phaseId - Phase ID
 * @param {Array<{ criterion: string; score: number }>} criteriaScores - Scored criteria
 * @param {number} [passingThreshold=70] - Minimum passing score
 * @returns {Promise<{ passed: boolean; totalScore: number; feedback: string[] }>} Gate evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateGateCriteria('PROJ-001-GATE-1', [
 *   { criterion: 'Market Potential', score: 85 },
 *   { criterion: 'Technical Feasibility', score: 75 }
 * ], 70);
 * ```
 */
export declare const evaluateGateCriteria: (phaseId: string, criteriaScores: Array<{
    criterion: string;
    score: number;
}>, passingThreshold?: number) => Promise<{
    passed: boolean;
    totalScore: number;
    feedback: string[];
}>;
/**
 * Advances project to next stage-gate phase.
 *
 * @param {string} projectId - Project ID
 * @param {number} currentPhase - Current phase number
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<{ nextPhase: number; message: string }>} Advancement result
 *
 * @example
 * ```typescript
 * const result = await advanceToNextGate('PROJ-001', 1, 'manager.smith');
 * ```
 */
export declare const advanceToNextGate: (projectId: string, currentPhase: number, approvedBy: string) => Promise<{
    nextPhase: number;
    message: string;
}>;
/**
 * Generates comprehensive stage-gate report.
 *
 * @param {string} projectId - Project ID
 * @returns {Promise<object>} Stage-gate report
 *
 * @example
 * ```typescript
 * const report = await generateStageGateReport('PROJ-001');
 * ```
 */
export declare const generateStageGateReport: (projectId: string) => Promise<any>;
/**
 * Calculates stage-gate cycle time metrics.
 *
 * @param {string} projectId - Project ID
 * @returns {Promise<{ avgTimePerPhase: number; totalCycleTime: number; bottlenecks: string[] }>} Cycle time metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateStageGateCycleTime('PROJ-001');
 * ```
 */
export declare const calculateStageGateCycleTime: (projectId: string) => Promise<{
    avgTimePerPhase: number;
    totalCycleTime: number;
    bottlenecks: string[];
}>;
/**
 * Tracks ideas through innovation funnel stages.
 *
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<InnovationFunnel[]>} Funnel stage data
 *
 * @example
 * ```typescript
 * const funnel = await trackInnovationFunnel(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const trackInnovationFunnel: (startDate: Date, endDate: Date) => Promise<InnovationFunnel[]>;
/**
 * Calculates funnel conversion rates between stages.
 *
 * @param {InnovationFunnel[]} funnelData - Funnel stage data
 * @returns {Promise<Array<{ fromStage: string; toStage: string; rate: number }>>} Conversion rates
 *
 * @example
 * ```typescript
 * const rates = await calculateFunnelConversionRates(funnelData);
 * ```
 */
export declare const calculateFunnelConversionRates: (funnelData: InnovationFunnel[]) => Promise<Array<{
    fromStage: string;
    toStage: string;
    rate: number;
}>>;
/**
 * Identifies funnel bottlenecks and improvement opportunities.
 *
 * @param {InnovationFunnel[]} funnelData - Funnel stage data
 * @returns {Promise<Array<{ stage: string; issue: string; recommendation: string }>>} Identified bottlenecks
 *
 * @example
 * ```typescript
 * const bottlenecks = await identifyFunnelBottlenecks(funnelData);
 * ```
 */
export declare const identifyFunnelBottlenecks: (funnelData: InnovationFunnel[]) => Promise<Array<{
    stage: string;
    issue: string;
    recommendation: string;
}>>;
/**
 * Optimizes funnel stage criteria based on historical data.
 *
 * @param {string} stage - Funnel stage
 * @param {object} historicalData - Historical performance data
 * @returns {Promise<{ optimizedCriteria: string[]; expectedImprovement: number }>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = await optimizeFunnelCriteria('SCREENING', historicalData);
 * ```
 */
export declare const optimizeFunnelCriteria: (stage: string, historicalData: any) => Promise<{
    optimizedCriteria: string[];
    expectedImprovement: number;
}>;
/**
 * Generates funnel velocity dashboard.
 *
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<object>} Funnel velocity metrics
 *
 * @example
 * ```typescript
 * const velocity = await generateFunnelVelocityDashboard(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const generateFunnelVelocityDashboard: (startDate: Date, endDate: Date) => Promise<any>;
/**
 * Creates innovation portfolio with strategic allocation.
 *
 * @param {string} portfolioName - Portfolio name
 * @param {number} totalBudget - Total budget
 * @param {object} strategyAllocation - Budget allocation by strategy
 * @returns {Promise<InnovationPortfolio>} Created portfolio
 *
 * @example
 * ```typescript
 * const portfolio = await createInnovationPortfolio('2025 Innovation', 10000000, {
 *   CORE: 0.70,
 *   ADJACENT: 0.20,
 *   TRANSFORMATIONAL: 0.10
 * });
 * ```
 */
export declare const createInnovationPortfolio: (portfolioName: string, totalBudget: number, strategyAllocation: Record<string, number>) => Promise<InnovationPortfolio>;
/**
 * Balances portfolio across risk, return, and strategic fit.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {object} constraints - Portfolio constraints
 * @returns {Promise<{ rebalanced: boolean; changes: any[] }>} Rebalancing result
 *
 * @example
 * ```typescript
 * const result = await balanceInnovationPortfolio('PORT-001', {
 *   maxRiskScore: 6.0,
 *   minROI: 15,
 *   strategicAlignment: 0.70
 * });
 * ```
 */
export declare const balanceInnovationPortfolio: (portfolioId: string, constraints: any) => Promise<{
    rebalanced: boolean;
    changes: any[];
}>;
/**
 * Evaluates portfolio performance and health.
 *
 * @param {string} portfolioId - Portfolio ID
 * @returns {Promise<object>} Portfolio performance metrics
 *
 * @example
 * ```typescript
 * const performance = await evaluatePortfolioPerformance('PORT-001');
 * ```
 */
export declare const evaluatePortfolioPerformance: (portfolioId: string) => Promise<any>;
/**
 * Optimizes resource allocation across portfolio projects.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {number} availableResources - Available resource pool
 * @returns {Promise<Array<{ projectId: string; allocation: number; justification: string }>>} Optimized allocation
 *
 * @example
 * ```typescript
 * const allocation = await optimizePortfolioResourceAllocation('PORT-001', 50);
 * ```
 */
export declare const optimizePortfolioResourceAllocation: (portfolioId: string, availableResources: number) => Promise<Array<{
    projectId: string;
    allocation: number;
    justification: string;
}>>;
/**
 * Generates portfolio strategy recommendations.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {object} marketData - Market trends and opportunities
 * @returns {Promise<Array<{ recommendation: string; rationale: string; priority: string }>>} Strategic recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generatePortfolioRecommendations('PORT-001', marketData);
 * ```
 */
export declare const generatePortfolioRecommendations: (portfolioId: string, marketData: any) => Promise<Array<{
    recommendation: string;
    rationale: string;
    priority: string;
}>>;
/**
 * Optimizes R&D project selection and prioritization.
 *
 * @param {RDProject[]} candidateProjects - Candidate R&D projects
 * @param {number} budgetConstraint - Available budget
 * @param {object} criteria - Selection criteria
 * @returns {Promise<Array<{ project: RDProject; score: number; selected: boolean }>>} Optimized selection
 *
 * @example
 * ```typescript
 * const selection = await optimizeRDProjectSelection(projects, 5000000, {
 *   strategicFit: 0.30,
 *   technicalFeasibility: 0.25,
 *   commercialPotential: 0.25,
 *   riskLevel: 0.20
 * });
 * ```
 */
export declare const optimizeRDProjectSelection: (candidateProjects: RDProject[], budgetConstraint: number, criteria: any) => Promise<Array<{
    project: RDProject;
    score: number;
    selected: boolean;
}>>;
/**
 * Allocates R&D budget across projects and phases.
 *
 * @param {string[]} projectIds - Project IDs
 * @param {number} totalBudget - Total R&D budget
 * @param {string} allocationMethod - Allocation method
 * @returns {Promise<Array<{ projectId: string; allocation: number; percentage: number }>>} Budget allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateRDBudget(['PROJ-001', 'PROJ-002'], 5000000, 'STRATEGIC_PRIORITY');
 * ```
 */
export declare const allocateRDBudget: (projectIds: string[], totalBudget: number, allocationMethod: string) => Promise<Array<{
    projectId: string;
    allocation: number;
    percentage: number;
}>>;
/**
 * Tracks R&D project milestones and deliverables.
 *
 * @param {string} projectId - Project ID
 * @returns {Promise<object>} Milestone tracking data
 *
 * @example
 * ```typescript
 * const tracking = await trackRDMilestones('PROJ-001');
 * ```
 */
export declare const trackRDMilestones: (projectId: string) => Promise<any>;
/**
 * Measures R&D productivity and efficiency.
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<object>} R&D productivity metrics
 *
 * @example
 * ```typescript
 * const productivity = await measureRDProductivity(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const measureRDProductivity: (startDate: Date, endDate: Date) => Promise<any>;
/**
 * Forecasts R&D outcomes and success probability.
 *
 * @param {string} projectId - Project ID
 * @param {object} historicalData - Historical project data
 * @returns {Promise<{ successProbability: number; expectedOutcomes: any[]; risks: any[] }>} Forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastRDOutcomes('PROJ-001', historicalData);
 * ```
 */
export declare const forecastRDOutcomes: (projectId: string, historicalData: any) => Promise<{
    successProbability: number;
    expectedOutcomes: any[];
    risks: any[];
}>;
/**
 * Calculates comprehensive innovation metrics.
 *
 * @param {Date} startDate - Calculation start date
 * @param {Date} endDate - Calculation end date
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<InnovationMetric[]>} Innovation metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateInnovationMetrics(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const calculateInnovationMetrics: (startDate: Date, endDate: Date, organizationCode?: string) => Promise<InnovationMetric[]>;
/**
 * Tracks innovation pipeline health.
 *
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<object>} Pipeline health metrics
 *
 * @example
 * ```typescript
 * const health = await trackInnovationPipelineHealth();
 * ```
 */
export declare const trackInnovationPipelineHealth: (organizationCode?: string) => Promise<any>;
/**
 * Measures innovation culture and capability maturity.
 *
 * @param {string} organizationCode - Organization code
 * @returns {Promise<object>} Culture and capability assessment
 *
 * @example
 * ```typescript
 * const assessment = await measureInnovationCulture('ORG-001');
 * ```
 */
export declare const measureInnovationCulture: (organizationCode: string) => Promise<any>;
/**
 * Benchmarks innovation performance against industry.
 *
 * @param {InnovationMetric[]} metrics - Organization metrics
 * @param {string} industry - Industry code
 * @returns {Promise<Array<{ metric: string; position: string; percentile: number }>>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkInnovationPerformance(metrics, 'TECH-001');
 * ```
 */
export declare const benchmarkInnovationPerformance: (metrics: InnovationMetric[], industry: string) => Promise<Array<{
    metric: string;
    position: string;
    percentile: number;
}>>;
/**
 * Generates innovation scorecard dashboard.
 *
 * @param {Date} startDate - Dashboard start date
 * @param {Date} endDate - Dashboard end date
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<object>} Innovation scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateInnovationScorecard(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const generateInnovationScorecard: (startDate: Date, endDate: Date, organizationCode?: string) => Promise<any>;
/**
 * Captures and validates innovation ideas.
 *
 * @param {Partial<InnovationIdea>} ideaData - Idea data
 * @returns {Promise<InnovationIdea>} Created idea
 *
 * @example
 * ```typescript
 * const idea = await captureInnovationIdea({
 *   title: 'Automated Testing Platform',
 *   description: 'AI-driven test automation',
 *   category: 'TECHNOLOGY',
 *   estimatedImpact: 85
 * });
 * ```
 */
export declare const captureInnovationIdea: (ideaData: Partial<InnovationIdea>) => Promise<InnovationIdea>;
/**
 * Scores and prioritizes ideas using weighted criteria.
 *
 * @param {string} ideaId - Idea ID
 * @param {object} scoringCriteria - Scoring criteria with weights
 * @returns {Promise<{ totalScore: number; ranking: string; recommendation: string }>} Idea score
 *
 * @example
 * ```typescript
 * const score = await scoreInnovationIdea('IDEA-001', {
 *   marketPotential: { weight: 0.30, score: 85 },
 *   technicalFeasibility: { weight: 0.25, score: 75 },
 *   strategicFit: { weight: 0.25, score: 90 },
 *   resourceRequirements: { weight: 0.20, score: 70 }
 * });
 * ```
 */
export declare const scoreInnovationIdea: (ideaId: string, scoringCriteria: Record<string, {
    weight: number;
    score: number;
}>) => Promise<{
    totalScore: number;
    ranking: string;
    recommendation: string;
}>;
/**
 * Facilitates crowdsourced idea evaluation.
 *
 * @param {string} ideaId - Idea ID
 * @param {Array<{ userId: string; rating: number; comments: string }>} evaluations - User evaluations
 * @returns {Promise<{ avgRating: number; totalVotes: number; sentiment: string }>} Crowdsourced evaluation
 *
 * @example
 * ```typescript
 * const evaluation = await crowdsourceIdeaEvaluation('IDEA-001', [
 *   { userId: 'user1', rating: 8, comments: 'Great potential' },
 *   { userId: 'user2', rating: 9, comments: 'Solves real problem' }
 * ]);
 * ```
 */
export declare const crowdsourceIdeaEvaluation: (ideaId: string, evaluations: Array<{
    userId: string;
    rating: number;
    comments: string;
}>) => Promise<{
    avgRating: number;
    totalVotes: number;
    sentiment: string;
}>;
/**
 * Merges similar or duplicate ideas.
 *
 * @param {string[]} ideaIds - Idea IDs to merge
 * @param {string} primaryIdeaId - Primary idea to keep
 * @returns {Promise<{ mergedIdeaId: string; consolidatedTags: string[]; combinedScore: number }>} Merge result
 *
 * @example
 * ```typescript
 * const merged = await mergeSimilarIdeas(['IDEA-001', 'IDEA-002', 'IDEA-003'], 'IDEA-001');
 * ```
 */
export declare const mergeSimilarIdeas: (ideaIds: string[], primaryIdeaId: string) => Promise<{
    mergedIdeaId: string;
    consolidatedTags: string[];
    combinedScore: number;
}>;
/**
 * Generates idea portfolio heatmap.
 *
 * @param {string} [category] - Optional category filter
 * @returns {Promise<Array<{ idea: string; impact: number; feasibility: number; priority: string }>>} Heatmap data
 *
 * @example
 * ```typescript
 * const heatmap = await generateIdeaHeatmap('TECHNOLOGY');
 * ```
 */
export declare const generateIdeaHeatmap: (category?: string) => Promise<Array<{
    idea: string;
    impact: number;
    feasibility: number;
    priority: string;
}>>;
/**
 * Assesses technology readiness level (TRL).
 *
 * @param {string} technologyId - Technology ID
 * @param {object} assessmentCriteria - Assessment criteria
 * @returns {Promise<{ trl: number; maturity: string; gaps: string[]; roadmap: any[] }>} TRL assessment
 *
 * @example
 * ```typescript
 * const assessment = await assessTechnologyReadiness('TECH-001', criteria);
 * ```
 */
export declare const assessTechnologyReadiness: (technologyId: string, assessmentCriteria: any) => Promise<{
    trl: number;
    maturity: string;
    gaps: string[];
    roadmap: any[];
}>;
/**
 * Evaluates technology strategic fit.
 *
 * @param {string} technologyId - Technology ID
 * @param {object} strategicGoals - Organization strategic goals
 * @returns {Promise<{ fitScore: number; alignment: string; opportunities: string[] }>} Strategic fit evaluation
 *
 * @example
 * ```typescript
 * const fit = await evaluateTechnologyStrategicFit('TECH-001', strategicGoals);
 * ```
 */
export declare const evaluateTechnologyStrategicFit: (technologyId: string, strategicGoals: any) => Promise<{
    fitScore: number;
    alignment: string;
    opportunities: string[];
}>;
/**
 * Analyzes technology competitive landscape.
 *
 * @param {string} technologyType - Technology type
 * @param {string[]} competitors - Competitor list
 * @returns {Promise<object>} Competitive analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeTechnologyLandscape('AI_PLATFORM', ['CompA', 'CompB']);
 * ```
 */
export declare const analyzeTechnologyLandscape: (technologyType: string, competitors: string[]) => Promise<any>;
/**
 * Forecasts technology adoption and diffusion.
 *
 * @param {string} technologyId - Technology ID
 * @param {object} marketData - Market and adoption data
 * @returns {Promise<{ adoptionCurve: any[]; peakAdoption: Date; marketPenetration: number }>} Adoption forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastTechnologyAdoption('TECH-001', marketData);
 * ```
 */
export declare const forecastTechnologyAdoption: (technologyId: string, marketData: any) => Promise<{
    adoptionCurve: any[];
    peakAdoption: Date;
    marketPenetration: number;
}>;
/**
 * Generates technology investment recommendations.
 *
 * @param {TechnologyAssessment[]} assessments - Technology assessments
 * @param {number} budgetConstraint - Available budget
 * @returns {Promise<Array<{ technology: string; recommendation: string; investment: number; rationale: string }>>} Investment recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generateTechnologyInvestmentRecommendations(assessments, 5000000);
 * ```
 */
export declare const generateTechnologyInvestmentRecommendations: (assessments: TechnologyAssessment[], budgetConstraint: number) => Promise<Array<{
    technology: string;
    recommendation: string;
    investment: number;
    rationale: string;
}>>;
/**
 * Defines innovation governance framework.
 *
 * @param {object} governanceStructure - Governance structure definition
 * @returns {Promise<InnovationGovernance>} Created governance framework
 *
 * @example
 * ```typescript
 * const governance = await defineInnovationGovernance({
 *   policyName: 'Innovation Approval Process',
 *   policyType: 'APPROVAL',
 *   decisionCriteria: ['Strategic fit', 'ROI > 15%', 'Risk level < 6']
 * });
 * ```
 */
export declare const defineInnovationGovernance: (governanceStructure: any) => Promise<InnovationGovernance>;
/**
 * Routes innovation decisions to appropriate approvers.
 *
 * @param {string} itemId - Item ID (idea, project, etc.)
 * @param {string} itemType - Item type
 * @param {number} requestedAmount - Requested amount
 * @returns {Promise<{ approvalLevel: string; approvers: string[]; timeline: number }>} Routing decision
 *
 * @example
 * ```typescript
 * const routing = await routeInnovationDecision('IDEA-001', 'FUNDING', 500000);
 * ```
 */
export declare const routeInnovationDecision: (itemId: string, itemType: string, requestedAmount: number) => Promise<{
    approvalLevel: string;
    approvers: string[];
    timeline: number;
}>;
/**
 * Tracks innovation decision-making effectiveness.
 *
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<object>} Decision effectiveness metrics
 *
 * @example
 * ```typescript
 * const effectiveness = await trackInnovationDecisionEffectiveness(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const trackInnovationDecisionEffectiveness: (startDate: Date, endDate: Date) => Promise<any>;
/**
 * Implements innovation review boards and committees.
 *
 * @param {object} boardConfig - Board configuration
 * @returns {Promise<{ boardId: string; members: any[]; schedule: any }>} Created board
 *
 * @example
 * ```typescript
 * const board = await implementInnovationBoard({
 *   boardName: 'Technology Review Board',
 *   members: ['cto', 'vp-engineering', 'director-innovation'],
 *   meetingFrequency: 'MONTHLY'
 * });
 * ```
 */
export declare const implementInnovationBoard: (boardConfig: any) => Promise<any>;
/**
 * Generates innovation governance compliance report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<object>} Governance compliance report
 *
 * @example
 * ```typescript
 * const report = await generateGovernanceComplianceReport(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const generateGovernanceComplianceReport: (startDate: Date, endDate: Date) => Promise<any>;
/**
 * Forms cross-functional innovation teams.
 *
 * @param {string} projectId - Project ID
 * @param {string[]} requiredSkills - Required skills
 * @param {number} teamSize - Desired team size
 * @returns {Promise<CollaborationTeam>} Formed team
 *
 * @example
 * ```typescript
 * const team = await formInnovationTeam('PROJ-001', ['AI', 'UX', 'Product'], 5);
 * ```
 */
export declare const formInnovationTeam: (projectId: string, requiredSkills: string[], teamSize: number) => Promise<CollaborationTeam>;
/**
 * Facilitates innovation collaboration sessions.
 *
 * @param {string} sessionType - Session type (brainstorming, design thinking, etc.)
 * @param {string[]} participants - Participant user IDs
 * @param {object} sessionConfig - Session configuration
 * @returns {Promise<{ sessionId: string; agenda: any[]; outputs: any }>} Collaboration session
 *
 * @example
 * ```typescript
 * const session = await facilitateCollaborationSession('DESIGN_THINKING', ['user1', 'user2'], {
 *   duration: 120,
 *   facilitator: 'facilitator1'
 * });
 * ```
 */
export declare const facilitateCollaborationSession: (sessionType: string, participants: string[], sessionConfig: any) => Promise<any>;
/**
 * Manages innovation knowledge sharing and documentation.
 *
 * @param {string} projectId - Project ID
 * @param {object} knowledgeAssets - Knowledge assets to capture
 * @returns {Promise<{ repository: string; assets: any[]; accessibility: string }>} Knowledge management
 *
 * @example
 * ```typescript
 * const knowledge = await manageInnovationKnowledge('PROJ-001', {
 *   documents: ['design-doc.pdf', 'research-findings.pdf'],
 *   lessons: ['Technical challenges', 'Market insights']
 * });
 * ```
 */
export declare const manageInnovationKnowledge: (projectId: string, knowledgeAssets: any) => Promise<any>;
/**
 * Measures team innovation performance.
 *
 * @param {string} teamId - Team ID
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<object>} Team performance metrics
 *
 * @example
 * ```typescript
 * const performance = await measureTeamInnovationPerformance('TEAM-001', new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const measureTeamInnovationPerformance: (teamId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Generates innovation collaboration network analysis.
 *
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<object>} Network analysis
 *
 * @example
 * ```typescript
 * const network = await generateCollaborationNetworkAnalysis();
 * ```
 */
export declare const generateCollaborationNetworkAnalysis: (organizationCode?: string) => Promise<any>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createInnovationIdeaModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            ideaId: string;
            title: string;
            description: string;
            submittedBy: string;
            submittedAt: Date;
            category: string;
            stage: string;
            status: string;
            priority: string;
            estimatedImpact: number;
            estimatedCost: number;
            estimatedROI: number;
            actualImpact: number | null;
            actualCost: number | null;
            actualROI: number | null;
            tags: string[];
            attachments: string[];
            votes: number;
            comments: number;
            assignedTo: string | null;
            implementedAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createRDProjectModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            projectId: string;
            projectName: string;
            projectType: string;
            leadResearcher: string;
            team: string[];
            budget: number;
            spentBudget: number;
            startDate: Date;
            endDate: Date;
            actualEndDate: Date | null;
            status: string;
            completionPercentage: number;
            milestones: Record<string, any>;
            deliverables: string[];
            kpis: Record<string, any>;
            risks: Record<string, any>;
            publications: number;
            patents: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createInnovationPortfolioModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            portfolioId: string;
            portfolioName: string;
            strategy: string;
            totalBudget: number;
            allocatedBudget: number;
            numberOfProjects: number;
            projects: Record<string, any>;
            performanceMetrics: Record<string, any>;
            balanceScore: number;
            riskScore: number;
            owner: string;
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createStageGateProcess: (projectId: string, projectName: string, numberOfGates?: number) => Promise<Array<StageGatePhase>>;
    evaluateGateCriteria: (phaseId: string, criteriaScores: Array<{
        criterion: string;
        score: number;
    }>, passingThreshold?: number) => Promise<{
        passed: boolean;
        totalScore: number;
        feedback: string[];
    }>;
    advanceToNextGate: (projectId: string, currentPhase: number, approvedBy: string) => Promise<{
        nextPhase: number;
        message: string;
    }>;
    generateStageGateReport: (projectId: string) => Promise<any>;
    calculateStageGateCycleTime: (projectId: string) => Promise<{
        avgTimePerPhase: number;
        totalCycleTime: number;
        bottlenecks: string[];
    }>;
    trackInnovationFunnel: (startDate: Date, endDate: Date) => Promise<InnovationFunnel[]>;
    calculateFunnelConversionRates: (funnelData: InnovationFunnel[]) => Promise<Array<{
        fromStage: string;
        toStage: string;
        rate: number;
    }>>;
    identifyFunnelBottlenecks: (funnelData: InnovationFunnel[]) => Promise<Array<{
        stage: string;
        issue: string;
        recommendation: string;
    }>>;
    optimizeFunnelCriteria: (stage: string, historicalData: any) => Promise<{
        optimizedCriteria: string[];
        expectedImprovement: number;
    }>;
    generateFunnelVelocityDashboard: (startDate: Date, endDate: Date) => Promise<any>;
    createInnovationPortfolio: (portfolioName: string, totalBudget: number, strategyAllocation: Record<string, number>) => Promise<InnovationPortfolio>;
    balanceInnovationPortfolio: (portfolioId: string, constraints: any) => Promise<{
        rebalanced: boolean;
        changes: any[];
    }>;
    evaluatePortfolioPerformance: (portfolioId: string) => Promise<any>;
    optimizePortfolioResourceAllocation: (portfolioId: string, availableResources: number) => Promise<Array<{
        projectId: string;
        allocation: number;
        justification: string;
    }>>;
    generatePortfolioRecommendations: (portfolioId: string, marketData: any) => Promise<Array<{
        recommendation: string;
        rationale: string;
        priority: string;
    }>>;
    optimizeRDProjectSelection: (candidateProjects: RDProject[], budgetConstraint: number, criteria: any) => Promise<Array<{
        project: RDProject;
        score: number;
        selected: boolean;
    }>>;
    allocateRDBudget: (projectIds: string[], totalBudget: number, allocationMethod: string) => Promise<Array<{
        projectId: string;
        allocation: number;
        percentage: number;
    }>>;
    trackRDMilestones: (projectId: string) => Promise<any>;
    measureRDProductivity: (startDate: Date, endDate: Date) => Promise<any>;
    forecastRDOutcomes: (projectId: string, historicalData: any) => Promise<{
        successProbability: number;
        expectedOutcomes: any[];
        risks: any[];
    }>;
    calculateInnovationMetrics: (startDate: Date, endDate: Date, organizationCode?: string) => Promise<InnovationMetric[]>;
    trackInnovationPipelineHealth: (organizationCode?: string) => Promise<any>;
    measureInnovationCulture: (organizationCode: string) => Promise<any>;
    benchmarkInnovationPerformance: (metrics: InnovationMetric[], industry: string) => Promise<Array<{
        metric: string;
        position: string;
        percentile: number;
    }>>;
    generateInnovationScorecard: (startDate: Date, endDate: Date, organizationCode?: string) => Promise<any>;
    captureInnovationIdea: (ideaData: Partial<InnovationIdea>) => Promise<InnovationIdea>;
    scoreInnovationIdea: (ideaId: string, scoringCriteria: Record<string, {
        weight: number;
        score: number;
    }>) => Promise<{
        totalScore: number;
        ranking: string;
        recommendation: string;
    }>;
    crowdsourceIdeaEvaluation: (ideaId: string, evaluations: Array<{
        userId: string;
        rating: number;
        comments: string;
    }>) => Promise<{
        avgRating: number;
        totalVotes: number;
        sentiment: string;
    }>;
    mergeSimilarIdeas: (ideaIds: string[], primaryIdeaId: string) => Promise<{
        mergedIdeaId: string;
        consolidatedTags: string[];
        combinedScore: number;
    }>;
    generateIdeaHeatmap: (category?: string) => Promise<Array<{
        idea: string;
        impact: number;
        feasibility: number;
        priority: string;
    }>>;
    assessTechnologyReadiness: (technologyId: string, assessmentCriteria: any) => Promise<{
        trl: number;
        maturity: string;
        gaps: string[];
        roadmap: any[];
    }>;
    evaluateTechnologyStrategicFit: (technologyId: string, strategicGoals: any) => Promise<{
        fitScore: number;
        alignment: string;
        opportunities: string[];
    }>;
    analyzeTechnologyLandscape: (technologyType: string, competitors: string[]) => Promise<any>;
    forecastTechnologyAdoption: (technologyId: string, marketData: any) => Promise<{
        adoptionCurve: any[];
        peakAdoption: Date;
        marketPenetration: number;
    }>;
    generateTechnologyInvestmentRecommendations: (assessments: TechnologyAssessment[], budgetConstraint: number) => Promise<Array<{
        technology: string;
        recommendation: string;
        investment: number;
        rationale: string;
    }>>;
    defineInnovationGovernance: (governanceStructure: any) => Promise<InnovationGovernance>;
    routeInnovationDecision: (itemId: string, itemType: string, requestedAmount: number) => Promise<{
        approvalLevel: string;
        approvers: string[];
        timeline: number;
    }>;
    trackInnovationDecisionEffectiveness: (startDate: Date, endDate: Date) => Promise<any>;
    implementInnovationBoard: (boardConfig: any) => Promise<any>;
    generateGovernanceComplianceReport: (startDate: Date, endDate: Date) => Promise<any>;
    formInnovationTeam: (projectId: string, requiredSkills: string[], teamSize: number) => Promise<CollaborationTeam>;
    facilitateCollaborationSession: (sessionType: string, participants: string[], sessionConfig: any) => Promise<any>;
    manageInnovationKnowledge: (projectId: string, knowledgeAssets: any) => Promise<any>;
    measureTeamInnovationPerformance: (teamId: string, startDate: Date, endDate: Date) => Promise<any>;
    generateCollaborationNetworkAnalysis: (organizationCode?: string) => Promise<any>;
};
export default _default;
//# sourceMappingURL=innovation-management-kit.d.ts.map