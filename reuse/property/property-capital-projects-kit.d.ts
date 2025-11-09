/**
 * Capital Projects Management Kit
 *
 * Enterprise-grade utilities for managing capital projects including:
 * - Project initiation and planning
 * - Budget management and forecasting
 * - Milestone tracking and timeline management
 * - Resource allocation and cost control
 * - Change order and risk management
 * - Stakeholder communication and closeout procedures
 *
 * @module PropertyCapitalProjectsKit
 */
import { Transaction } from 'sequelize';
export declare enum ProjectStatus {
    PLANNING = "PLANNING",
    APPROVED = "APPROVED",
    IN_PROGRESS = "IN_PROGRESS",
    ON_HOLD = "ON_HOLD",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare enum ProjectPriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
export declare enum ProjectType {
    NEW_CONSTRUCTION = "NEW_CONSTRUCTION",
    RENOVATION = "RENOVATION",
    MAINTENANCE = "MAINTENANCE",
    INFRASTRUCTURE = "INFRASTRUCTURE",
    TECHNOLOGY = "TECHNOLOGY",
    ENVIRONMENTAL = "ENVIRONMENTAL"
}
export declare enum MilestoneStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    DELAYED = "DELAYED",
    CANCELLED = "CANCELLED"
}
export declare enum ChangeOrderStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    IMPLEMENTED = "IMPLEMENTED"
}
export declare enum RiskLevel {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
export declare enum ResourceType {
    LABOR = "LABOR",
    EQUIPMENT = "EQUIPMENT",
    MATERIAL = "MATERIAL",
    CONTRACTOR = "CONTRACTOR",
    CONSULTANT = "CONSULTANT"
}
export declare enum CommunicationType {
    EMAIL = "EMAIL",
    MEETING = "MEETING",
    REPORT = "REPORT",
    NOTIFICATION = "NOTIFICATION",
    PRESENTATION = "PRESENTATION"
}
export declare class CreateCapitalProjectDto {
    name: string;
    description: string;
    projectType: ProjectType;
    priority: ProjectPriority;
    propertyId: string;
    totalBudget: number;
    plannedStartDate: Date;
    plannedEndDate: Date;
    projectManagerId?: string;
    department?: string;
}
export declare class ProjectBudgetDto {
    category: string;
    allocatedAmount: number;
    spentAmount?: number;
    committedAmount?: number;
}
export declare class ProjectMilestoneDto {
    name: string;
    description: string;
    targetDate: Date;
    dependencies?: string[];
    completionPercentage?: number;
}
export declare class ResourceAllocationDto {
    resourceType: ResourceType;
    resourceName: string;
    quantity: number;
    unitCost: number;
    startDate: Date;
    endDate: Date;
    notes?: string;
}
export declare class ChangeOrderDto {
    title: string;
    description: string;
    reason: string;
    costImpact: number;
    scheduleImpact: number;
    requestedBy?: string;
    attachments?: string[];
}
export declare class ProjectRiskDto {
    title: string;
    description: string;
    riskLevel: RiskLevel;
    probability: number;
    costImpact: number;
    mitigationStrategy?: string;
    ownerId?: string;
}
export declare class StakeholderCommunicationDto {
    communicationType: CommunicationType;
    subject: string;
    content: string;
    recipients: string[];
    scheduledDate?: Date;
    attachments?: string[];
}
export declare class ProjectCloseoutDto {
    actualCompletionDate: Date;
    finalCost: number;
    projectSummary: string;
    lessonsLearned?: string;
    deliverables?: string[];
    evaluationScore?: number;
}
export declare class BudgetForecastDto {
    periodStart: Date;
    periodEnd: Date;
    projectedSpending: number;
    confidenceLevel?: number;
    assumptions?: string;
}
export interface ProjectMetrics {
    budgetUtilization: number;
    scheduleVariance: number;
    costVariance: number;
    completionPercentage: number;
    totalChangeOrders: number;
    activeRisks: number;
}
export interface BudgetAnalysis {
    totalBudget: number;
    totalSpent: number;
    totalCommitted: number;
    remainingBudget: number;
    utilizationPercentage: number;
    categoryBreakdown: Array<{
        category: string;
        allocated: number;
        spent: number;
        remaining: number;
    }>;
}
export interface TimelineAnalysis {
    plannedDuration: number;
    actualDuration: number;
    remainingDuration: number;
    isOnSchedule: boolean;
    delayedMilestones: number;
    completedMilestones: number;
    totalMilestones: number;
}
export interface ResourceUtilization {
    resourceType: ResourceType;
    totalAllocated: number;
    totalCost: number;
    utilizationRate: number;
    peakUsagePeriod: {
        start: Date;
        end: Date;
    };
}
export interface RiskAssessment {
    totalRisks: number;
    criticalRisks: number;
    highRisks: number;
    expectedCostImpact: number;
    topRisks: Array<{
        title: string;
        riskScore: number;
        mitigationStatus: string;
    }>;
}
/**
 * Creates a new capital project with comprehensive initialization
 */
export declare function createCapitalProject(projectData: CreateCapitalProjectDto, transaction?: Transaction): Promise<any>;
/**
 * Generates a detailed project charter with scope and objectives
 */
export declare function generateProjectCharter(projectId: string, scope: string, objectives: string[], constraints: string[], assumptions: string[], transaction?: Transaction): Promise<any>;
/**
 * Creates a work breakdown structure (WBS) for the project
 */
export declare function createWorkBreakdownStructure(projectId: string, phases: Array<{
    name: string;
    description: string;
    tasks: Array<{
        name: string;
        estimatedHours: number;
        dependencies?: string[];
    }>;
}>, transaction?: Transaction): Promise<any>;
/**
 * Performs feasibility analysis for a capital project
 */
export declare function performFeasibilityAnalysis(projectId: string, estimatedROI: number, estimatedPaybackPeriod: number, technicalFeasibility: number, operationalFeasibility: number, economicFeasibility: number, transaction?: Transaction): Promise<any>;
/**
 * Approves a project and moves it from planning to approved status
 */
export declare function approveProject(projectId: string, approvedBy: string, approvalNotes: string, approvedBudget?: number, transaction?: Transaction): Promise<any>;
/**
 * Allocates budget to different categories within a project
 */
export declare function allocateProjectBudget(projectId: string, budgetAllocations: ProjectBudgetDto[], transaction?: Transaction): Promise<any>;
/**
 * Tracks project expenditures and updates budget status
 */
export declare function trackProjectExpenditure(projectId: string, category: string, amount: number, description: string, expenseDate: Date, vendorName?: string, transaction?: Transaction): Promise<any>;
/**
 * Generates budget forecast based on current spending trends
 */
export declare function generateBudgetForecast(projectId: string, forecastData: BudgetForecastDto, transaction?: Transaction): Promise<any>;
/**
 * Analyzes current budget status and generates comprehensive report
 */
export declare function analyzeBudgetStatus(projectId: string, totalBudget: number, budgetAllocations: Array<{
    category: string;
    allocated: number;
    spent: number;
    committed: number;
}>, transaction?: Transaction): Promise<BudgetAnalysis>;
/**
 * Manages budget contingency reserves and releases
 */
export declare function manageContingencyReserve(projectId: string, reserveAmount: number, action: 'ALLOCATE' | 'RELEASE' | 'ADJUST', reason: string, requestedBy: string, transaction?: Transaction): Promise<any>;
/**
 * Creates project milestones with dependencies
 */
export declare function createProjectMilestone(projectId: string, milestoneData: ProjectMilestoneDto, transaction?: Transaction): Promise<any>;
/**
 * Updates milestone progress and completion status
 */
export declare function updateMilestoneProgress(milestoneId: string, completionPercentage: number, statusUpdate: string, updatedBy: string, transaction?: Transaction): Promise<any>;
/**
 * Validates milestone dependencies and critical path
 */
export declare function validateMilestoneDependencies(projectId: string, milestones: Array<{
    id: string;
    name: string;
    targetDate: Date;
    dependencies: string[];
    status: MilestoneStatus;
}>, transaction?: Transaction): Promise<any>;
/**
 * Generates milestone completion report
 */
export declare function generateMilestoneReport(projectId: string, milestones: Array<{
    name: string;
    targetDate: Date;
    actualCompletionDate?: Date;
    status: MilestoneStatus;
    completionPercentage: number;
}>, transaction?: Transaction): Promise<any>;
/**
 * Adjusts milestone timelines based on project delays
 */
export declare function adjustMilestoneTimelines(projectId: string, milestoneIds: string[], daysToAdjust: number, reason: string, adjustedBy: string, transaction?: Transaction): Promise<any>;
/**
 * Allocates resources to a capital project
 */
export declare function allocateProjectResource(projectId: string, resourceData: ResourceAllocationDto, transaction?: Transaction): Promise<any>;
/**
 * Tracks resource utilization and availability
 */
export declare function trackResourceUtilization(resourceId: string, projectId: string, hoursUsed: number, utilizationDate: Date, transaction?: Transaction): Promise<any>;
/**
 * Generates resource utilization analysis
 */
export declare function analyzeResourceUtilization(projectId: string, resources: Array<{
    id: string;
    resourceType: ResourceType;
    totalAllocatedHours: number;
    totalUsedHours: number;
    totalCost: number;
}>, transaction?: Transaction): Promise<ResourceUtilization[]>;
/**
 * Optimizes resource allocation across multiple projects
 */
export declare function optimizeResourceAllocation(resources: Array<{
    id: string;
    name: string;
    type: ResourceType;
    availableCapacity: number;
    currentAllocations: Array<{
        projectId: string;
        allocatedCapacity: number;
        priority: ProjectPriority;
    }>;
}>, transaction?: Transaction): Promise<any>;
/**
 * Forecasts future resource needs based on project pipeline
 */
export declare function forecastResourceNeeds(projectId: string, upcomingPhases: Array<{
    name: string;
    startDate: Date;
    endDate: Date;
    requiredResources: Array<{
        type: ResourceType;
        quantity: number;
    }>;
}>, transaction?: Transaction): Promise<any>;
/**
 * Tracks and analyzes cost variance from baseline
 */
export declare function analyzeCostVariance(projectId: string, plannedCost: number, actualCost: number, earnedValue: number, transaction?: Transaction): Promise<any>;
/**
 * Generates estimate at completion (EAC) projection
 */
export declare function calculateEstimateAtCompletion(projectId: string, budgetAtCompletion: number, actualCost: number, earnedValue: number, estimateMethod: 'CPI' | 'SPI_CPI' | 'MANUAL', manualEstimate?: number, transaction?: Transaction): Promise<any>;
/**
 * Implements earned value management (EVM) analysis
 */
export declare function performEarnedValueAnalysis(projectId: string, plannedValue: number, earnedValue: number, actualCost: number, budgetAtCompletion: number, transaction?: Transaction): Promise<any>;
/**
 * Tracks and controls project cost baselines
 */
export declare function manageCostBaseline(projectId: string, action: 'CREATE' | 'UPDATE' | 'REBASELINE', baselineCost: number, reason: string, approvedBy: string, transaction?: Transaction): Promise<any>;
/**
 * Creates a change order for the project
 */
export declare function createChangeOrder(projectId: string, changeOrderData: ChangeOrderDto, transaction?: Transaction): Promise<any>;
/**
 * Reviews and approves/rejects change orders
 */
export declare function reviewChangeOrder(changeOrderId: string, action: 'APPROVE' | 'REJECT', reviewedBy: string, reviewComments: string, transaction?: Transaction): Promise<any>;
/**
 * Analyzes change order impact on project scope, budget, and timeline
 */
export declare function analyzeChangeOrderImpact(projectId: string, changeOrders: Array<{
    costImpact: number;
    scheduleImpact: number;
    status: ChangeOrderStatus;
}>, currentBudget: number, currentEndDate: Date, transaction?: Transaction): Promise<any>;
/**
 * Tracks change order implementation and closeout
 */
export declare function trackChangeOrderImplementation(changeOrderId: string, implementationStatus: 'STARTED' | 'IN_PROGRESS' | 'COMPLETED', implementationNotes: string, actualCostImpact?: number, actualScheduleImpact?: number, transaction?: Transaction): Promise<any>;
/**
 * Creates and manages project schedules
 */
export declare function createProjectSchedule(projectId: string, startDate: Date, endDate: Date, workingDaysPerWeek: number, holidays: Date[], transaction?: Transaction): Promise<any>;
/**
 * Analyzes schedule performance and identifies delays
 */
export declare function analyzeSchedulePerformance(projectId: string, plannedStartDate: Date, plannedEndDate: Date, actualStartDate: Date | null, currentDate: Date, completionPercentage: number, transaction?: Transaction): Promise<TimelineAnalysis>;
/**
 * Calculates critical path for project activities
 */
export declare function calculateCriticalPath(projectId: string, activities: Array<{
    id: string;
    name: string;
    duration: number;
    dependencies: string[];
}>, transaction?: Transaction): Promise<any>;
/**
 * Generates project timeline reports and visualizations
 */
export declare function generateTimelineReport(projectId: string, plannedStartDate: Date, plannedEndDate: Date, actualStartDate: Date | null, milestones: Array<{
    name: string;
    targetDate: Date;
    actualDate: Date | null;
    status: MilestoneStatus;
}>, transaction?: Transaction): Promise<any>;
/**
 * Registers a new risk for the project
 */
export declare function registerProjectRisk(projectId: string, riskData: ProjectRiskDto, transaction?: Transaction): Promise<any>;
/**
 * Performs comprehensive risk assessment
 */
export declare function performRiskAssessment(projectId: string, risks: Array<{
    title: string;
    riskLevel: RiskLevel;
    probability: number;
    costImpact: number;
    mitigationStrategy: string | null;
    status: string;
}>, transaction?: Transaction): Promise<RiskAssessment>;
/**
 * Creates and tracks risk mitigation plans
 */
export declare function createRiskMitigationPlan(riskId: string, mitigationStrategy: string, actionItems: Array<{
    description: string;
    assignedTo: string;
    dueDate: Date;
}>, estimatedCost: number, transaction?: Transaction): Promise<any>;
/**
 * Monitors and updates risk status
 */
export declare function updateRiskStatus(riskId: string, newStatus: 'ACTIVE' | 'MITIGATED' | 'REALIZED' | 'CLOSED', statusNotes: string, actualImpact?: number, transaction?: Transaction): Promise<any>;
/**
 * Generates risk matrix and heat map
 */
export declare function generateRiskMatrix(projectId: string, risks: Array<{
    id: string;
    title: string;
    probability: number;
    impact: number;
    riskLevel: RiskLevel;
}>, transaction?: Transaction): Promise<any>;
/**
 * Creates stakeholder communication records
 */
export declare function createStakeholderCommunication(projectId: string, communicationData: StakeholderCommunicationDto, transaction?: Transaction): Promise<any>;
/**
 * Generates project status reports for stakeholders
 */
export declare function generateStakeholderStatusReport(projectId: string, reportingPeriod: {
    start: Date;
    end: Date;
}, metrics: ProjectMetrics, highlights: string[], concerns: string[], nextSteps: string[], transaction?: Transaction): Promise<any>;
/**
 * Manages stakeholder engagement and feedback
 */
export declare function trackStakeholderEngagement(projectId: string, stakeholderId: string, engagementType: 'MEETING' | 'EMAIL' | 'PRESENTATION' | 'WORKSHOP', engagementDate: Date, topics: string[], feedback: string, actionItems?: Array<{
    description: string;
    assignedTo: string;
}>, transaction?: Transaction): Promise<any>;
/**
 * Distributes project communications to stakeholders
 */
export declare function distributeProjectCommunication(communicationId: string, distributionMethod: 'EMAIL' | 'PORTAL' | 'SMS', scheduledDate?: Date, transaction?: Transaction): Promise<any>;
/**
 * Initiates project closeout process
 */
export declare function initiateProjectCloseout(projectId: string, closeoutData: ProjectCloseoutDto, transaction?: Transaction): Promise<any>;
/**
 * Conducts final project audit and variance analysis
 */
export declare function conductFinalProjectAudit(projectId: string, plannedBudget: number, actualCost: number, plannedEndDate: Date, actualEndDate: Date, plannedScope: string, deliveredScope: string, transaction?: Transaction): Promise<any>;
/**
 * Archives project documentation and records
 */
export declare function archiveProjectDocumentation(projectId: string, documentCategories: Array<{
    category: string;
    documents: Array<{
        name: string;
        url: string;
        type: string;
    }>;
}>, archiveLocation: string, retentionPeriodYears: number, transaction?: Transaction): Promise<any>;
/**
 * Captures lessons learned and best practices
 */
export declare function captureLessonsLearned(projectId: string, successFactors: string[], challenges: string[], improvements: string[], bestPractices: string[], teamFeedback: Array<{
    contributor: string;
    feedback: string;
}>, transaction?: Transaction): Promise<any>;
/**
 * Service class for dependency injection
 */
export declare class CapitalProjectsService {
    private readonly logger;
    createCapitalProject(data: CreateCapitalProjectDto, transaction?: Transaction): Promise<any>;
    generateProjectCharter(projectId: string, scope: string, objectives: string[], constraints: string[], assumptions: string[], transaction?: Transaction): Promise<any>;
    createWorkBreakdownStructure(projectId: string, phases: Array<{
        name: string;
        description: string;
        tasks: Array<{
            name: string;
            estimatedHours: number;
            dependencies?: string[];
        }>;
    }>, transaction?: Transaction): Promise<any>;
    performFeasibilityAnalysis(projectId: string, estimatedROI: number, estimatedPaybackPeriod: number, technicalFeasibility: number, operationalFeasibility: number, economicFeasibility: number, transaction?: Transaction): Promise<any>;
    approveProject(projectId: string, approvedBy: string, approvalNotes: string, approvedBudget?: number, transaction?: Transaction): Promise<any>;
    allocateProjectBudget(projectId: string, budgetAllocations: ProjectBudgetDto[], transaction?: Transaction): Promise<any>;
    trackProjectExpenditure(projectId: string, category: string, amount: number, description: string, expenseDate: Date, vendorName?: string, transaction?: Transaction): Promise<any>;
    generateBudgetForecast(projectId: string, forecastData: BudgetForecastDto, transaction?: Transaction): Promise<any>;
    analyzeBudgetStatus(projectId: string, totalBudget: number, budgetAllocations: Array<{
        category: string;
        allocated: number;
        spent: number;
        committed: number;
    }>, transaction?: Transaction): Promise<BudgetAnalysis>;
    manageContingencyReserve(projectId: string, reserveAmount: number, action: 'ALLOCATE' | 'RELEASE' | 'ADJUST', reason: string, requestedBy: string, transaction?: Transaction): Promise<any>;
    createProjectMilestone(projectId: string, milestoneData: ProjectMilestoneDto, transaction?: Transaction): Promise<any>;
    updateMilestoneProgress(milestoneId: string, completionPercentage: number, statusUpdate: string, updatedBy: string, transaction?: Transaction): Promise<any>;
    allocateProjectResource(projectId: string, resourceData: ResourceAllocationDto, transaction?: Transaction): Promise<any>;
    analyzeCostVariance(projectId: string, plannedCost: number, actualCost: number, earnedValue: number, transaction?: Transaction): Promise<any>;
    createChangeOrder(projectId: string, changeOrderData: ChangeOrderDto, transaction?: Transaction): Promise<any>;
    registerProjectRisk(projectId: string, riskData: ProjectRiskDto, transaction?: Transaction): Promise<any>;
    createStakeholderCommunication(projectId: string, communicationData: StakeholderCommunicationDto, transaction?: Transaction): Promise<any>;
    initiateProjectCloseout(projectId: string, closeoutData: ProjectCloseoutDto, transaction?: Transaction): Promise<any>;
    captureLessonsLearned(projectId: string, successFactors: string[], challenges: string[], improvements: string[], bestPractices: string[], teamFeedback: Array<{
        contributor: string;
        feedback: string;
    }>, transaction?: Transaction): Promise<any>;
}
//# sourceMappingURL=property-capital-projects-kit.d.ts.map