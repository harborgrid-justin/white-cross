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

import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Model, Transaction, Op, fn, col, literal } from 'sequelize';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsDate,
  IsOptional,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

// =====================================================================
// ENUMS
// =====================================================================

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ProjectPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum ProjectType {
  NEW_CONSTRUCTION = 'NEW_CONSTRUCTION',
  RENOVATION = 'RENOVATION',
  MAINTENANCE = 'MAINTENANCE',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  TECHNOLOGY = 'TECHNOLOGY',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
}

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED',
}

export enum ChangeOrderStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IMPLEMENTED = 'IMPLEMENTED',
}

export enum RiskLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum ResourceType {
  LABOR = 'LABOR',
  EQUIPMENT = 'EQUIPMENT',
  MATERIAL = 'MATERIAL',
  CONTRACTOR = 'CONTRACTOR',
  CONSULTANT = 'CONSULTANT',
}

export enum CommunicationType {
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  REPORT = 'REPORT',
  NOTIFICATION = 'NOTIFICATION',
  PRESENTATION = 'PRESENTATION',
}

// =====================================================================
// DTOS
// =====================================================================

export class CreateCapitalProjectDto {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Project description' })
  @IsString()
  description: string;

  @ApiProperty({ enum: ProjectType, description: 'Type of capital project' })
  @IsEnum(ProjectType)
  projectType: ProjectType;

  @ApiProperty({ enum: ProjectPriority, description: 'Project priority level' })
  @IsEnum(ProjectPriority)
  priority: ProjectPriority;

  @ApiProperty({ description: 'Property ID associated with the project' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ description: 'Total budget allocated' })
  @IsNumber()
  @Min(0)
  totalBudget: number;

  @ApiProperty({ description: 'Planned start date' })
  @IsDate()
  @Type(() => Date)
  plannedStartDate: Date;

  @ApiProperty({ description: 'Planned completion date' })
  @IsDate()
  @Type(() => Date)
  plannedEndDate: Date;

  @ApiPropertyOptional({ description: 'Project manager ID' })
  @IsOptional()
  @IsUUID()
  projectManagerId?: string;

  @ApiPropertyOptional({ description: 'Department or business unit' })
  @IsOptional()
  @IsString()
  department?: string;
}

export class ProjectBudgetDto {
  @ApiProperty({ description: 'Budget category name' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Allocated amount' })
  @IsNumber()
  @Min(0)
  allocatedAmount: number;

  @ApiPropertyOptional({ description: 'Spent amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  spentAmount?: number;

  @ApiPropertyOptional({ description: 'Committed amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  committedAmount?: number;
}

export class ProjectMilestoneDto {
  @ApiProperty({ description: 'Milestone name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Milestone description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Target completion date' })
  @IsDate()
  @Type(() => Date)
  targetDate: Date;

  @ApiPropertyOptional({ description: 'Milestone dependencies (milestone IDs)' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  dependencies?: string[];

  @ApiPropertyOptional({ description: 'Completion percentage' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  completionPercentage?: number;
}

export class ResourceAllocationDto {
  @ApiProperty({ enum: ResourceType, description: 'Type of resource' })
  @IsEnum(ResourceType)
  resourceType: ResourceType;

  @ApiProperty({ description: 'Resource name or identifier' })
  @IsString()
  resourceName: string;

  @ApiProperty({ description: 'Quantity allocated' })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: 'Unit cost' })
  @IsNumber()
  @Min(0)
  unitCost: number;

  @ApiProperty({ description: 'Start date for allocation' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date for allocation' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiPropertyOptional({ description: 'Notes about the resource' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ChangeOrderDto {
  @ApiProperty({ description: 'Change order title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Change order description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Reason for change' })
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Cost impact (can be negative)' })
  @IsNumber()
  costImpact: number;

  @ApiProperty({ description: 'Schedule impact in days (can be negative)' })
  @IsNumber()
  scheduleImpact: number;

  @ApiPropertyOptional({ description: 'Requested by (user ID)' })
  @IsOptional()
  @IsUUID()
  requestedBy?: string;

  @ApiPropertyOptional({ description: 'Supporting documentation URLs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}

export class ProjectRiskDto {
  @ApiProperty({ description: 'Risk title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Risk description' })
  @IsString()
  description: string;

  @ApiProperty({ enum: RiskLevel, description: 'Risk severity level' })
  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;

  @ApiProperty({ description: 'Probability of occurrence (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  probability: number;

  @ApiProperty({ description: 'Potential cost impact' })
  @IsNumber()
  @Min(0)
  costImpact: number;

  @ApiPropertyOptional({ description: 'Mitigation strategy' })
  @IsOptional()
  @IsString()
  mitigationStrategy?: string;

  @ApiPropertyOptional({ description: 'Risk owner (user ID)' })
  @IsOptional()
  @IsUUID()
  ownerId?: string;
}

export class StakeholderCommunicationDto {
  @ApiProperty({ enum: CommunicationType, description: 'Type of communication' })
  @IsEnum(CommunicationType)
  communicationType: CommunicationType;

  @ApiProperty({ description: 'Communication subject' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Communication content' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Recipient IDs or emails' })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  recipients: string[];

  @ApiPropertyOptional({ description: 'Scheduled send date/time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  scheduledDate?: Date;

  @ApiPropertyOptional({ description: 'Attachment URLs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}

export class ProjectCloseoutDto {
  @ApiProperty({ description: 'Actual completion date' })
  @IsDate()
  @Type(() => Date)
  actualCompletionDate: Date;

  @ApiProperty({ description: 'Final project cost' })
  @IsNumber()
  @Min(0)
  finalCost: number;

  @ApiProperty({ description: 'Project summary' })
  @IsString()
  projectSummary: string;

  @ApiPropertyOptional({ description: 'Lessons learned' })
  @IsOptional()
  @IsString()
  lessonsLearned?: string;

  @ApiPropertyOptional({ description: 'Final deliverables URLs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deliverables?: string[];

  @ApiPropertyOptional({ description: 'Post-project evaluation score (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  evaluationScore?: number;
}

export class BudgetForecastDto {
  @ApiProperty({ description: 'Forecast period start date' })
  @IsDate()
  @Type(() => Date)
  periodStart: Date;

  @ApiProperty({ description: 'Forecast period end date' })
  @IsDate()
  @Type(() => Date)
  periodEnd: Date;

  @ApiProperty({ description: 'Projected spending amount' })
  @IsNumber()
  @Min(0)
  projectedSpending: number;

  @ApiPropertyOptional({ description: 'Confidence level (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  confidenceLevel?: number;

  @ApiPropertyOptional({ description: 'Assumptions and notes' })
  @IsOptional()
  @IsString()
  assumptions?: string;
}

// =====================================================================
// INTERFACES
// =====================================================================

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
  peakUsagePeriod: { start: Date; end: Date };
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

// =====================================================================
// 1. PROJECT INITIATION AND PLANNING (5 functions)
// =====================================================================

/**
 * Creates a new capital project with comprehensive initialization
 */
export async function createCapitalProject(
  projectData: CreateCapitalProjectDto,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('createCapitalProject');

  try {
    // Validate date logic
    if (projectData.plannedEndDate <= projectData.plannedStartDate) {
      throw new BadRequestException('Planned end date must be after start date');
    }

    // Calculate planned duration
    const plannedDuration = Math.ceil(
      (projectData.plannedEndDate.getTime() - projectData.plannedStartDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const project = {
      ...projectData,
      status: ProjectStatus.PLANNING,
      plannedDuration,
      actualStartDate: null,
      actualEndDate: null,
      currentBudget: projectData.totalBudget,
      spentBudget: 0,
      completionPercentage: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    logger.log(`Capital project created: ${project.name} with budget $${project.totalBudget}`);

    return project;
  } catch (error) {
    logger.error(`Failed to create capital project: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generates a detailed project charter with scope and objectives
 */
export async function generateProjectCharter(
  projectId: string,
  scope: string,
  objectives: string[],
  constraints: string[],
  assumptions: string[],
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('generateProjectCharter');

  try {
    if (!objectives || objectives.length === 0) {
      throw new BadRequestException('At least one objective is required for project charter');
    }

    const charter = {
      projectId,
      scope,
      objectives,
      constraints: constraints || [],
      assumptions: assumptions || [],
      generatedDate: new Date(),
      version: 1,
      status: 'DRAFT',
      approvals: [],
    };

    logger.log(`Project charter generated for project ${projectId} with ${objectives.length} objectives`);

    return charter;
  } catch (error) {
    logger.error(`Failed to generate project charter: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Creates a work breakdown structure (WBS) for the project
 */
export async function createWorkBreakdownStructure(
  projectId: string,
  phases: Array<{
    name: string;
    description: string;
    tasks: Array<{ name: string; estimatedHours: number; dependencies?: string[] }>;
  }>,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('createWorkBreakdownStructure');

  try {
    if (!phases || phases.length === 0) {
      throw new BadRequestException('At least one phase is required for WBS');
    }

    const totalTasks = phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
    const totalEstimatedHours = phases.reduce(
      (sum, phase) => sum + phase.tasks.reduce((taskSum, task) => taskSum + task.estimatedHours, 0),
      0,
    );

    const wbs = {
      projectId,
      phases: phases.map((phase, index) => ({
        ...phase,
        phaseNumber: index + 1,
        taskCount: phase.tasks.length,
        estimatedHours: phase.tasks.reduce((sum, task) => sum + task.estimatedHours, 0),
      })),
      totalPhases: phases.length,
      totalTasks,
      totalEstimatedHours,
      createdAt: new Date(),
      version: 1,
    };

    logger.log(`WBS created for project ${projectId}: ${phases.length} phases, ${totalTasks} tasks`);

    return wbs;
  } catch (error) {
    logger.error(`Failed to create work breakdown structure: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Performs feasibility analysis for a capital project
 */
export async function performFeasibilityAnalysis(
  projectId: string,
  estimatedROI: number,
  estimatedPaybackPeriod: number,
  technicalFeasibility: number,
  operationalFeasibility: number,
  economicFeasibility: number,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('performFeasibilityAnalysis');

  try {
    // Validate feasibility scores (0-100)
    const scores = [technicalFeasibility, operationalFeasibility, economicFeasibility];
    if (scores.some(score => score < 0 || score > 100)) {
      throw new BadRequestException('Feasibility scores must be between 0 and 100');
    }

    const overallFeasibility = (technicalFeasibility + operationalFeasibility + economicFeasibility) / 3;

    let recommendation: string;
    if (overallFeasibility >= 80 && estimatedROI > 15) {
      recommendation = 'HIGHLY_RECOMMENDED';
    } else if (overallFeasibility >= 60 && estimatedROI > 10) {
      recommendation = 'RECOMMENDED';
    } else if (overallFeasibility >= 40) {
      recommendation = 'CONDITIONAL';
    } else {
      recommendation = 'NOT_RECOMMENDED';
    }

    const analysis = {
      projectId,
      estimatedROI,
      estimatedPaybackPeriod,
      technicalFeasibility,
      operationalFeasibility,
      economicFeasibility,
      overallFeasibility,
      recommendation,
      analysisDate: new Date(),
      isViable: overallFeasibility >= 60,
    };

    logger.log(`Feasibility analysis completed for project ${projectId}: ${recommendation} (${overallFeasibility.toFixed(1)}%)`);

    return analysis;
  } catch (error) {
    logger.error(`Failed to perform feasibility analysis: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Approves a project and moves it from planning to approved status
 */
export async function approveProject(
  projectId: string,
  approvedBy: string,
  approvalNotes: string,
  approvedBudget?: number,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('approveProject');

  try {
    const approval = {
      projectId,
      approvedBy,
      approvalNotes,
      approvedBudget,
      approvalDate: new Date(),
      status: ProjectStatus.APPROVED,
      conditions: [],
    };

    logger.log(`Project ${projectId} approved by ${approvedBy}`);

    return approval;
  } catch (error) {
    logger.error(`Failed to approve project: ${error.message}`, error.stack);
    throw error;
  }
}

// =====================================================================
// 2. BUDGET MANAGEMENT AND FORECASTING (5 functions)
// =====================================================================

/**
 * Allocates budget to different categories within a project
 */
export async function allocateProjectBudget(
  projectId: string,
  budgetAllocations: ProjectBudgetDto[],
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('allocateProjectBudget');

  try {
    const totalAllocated = budgetAllocations.reduce((sum, allocation) => sum + allocation.allocatedAmount, 0);

    const allocations = budgetAllocations.map(allocation => ({
      ...allocation,
      projectId,
      spentAmount: allocation.spentAmount || 0,
      committedAmount: allocation.committedAmount || 0,
      remainingAmount: allocation.allocatedAmount - (allocation.spentAmount || 0) - (allocation.committedAmount || 0),
      createdAt: new Date(),
    }));

    logger.log(`Budget allocated for project ${projectId}: ${budgetAllocations.length} categories, total $${totalAllocated}`);

    return {
      projectId,
      allocations,
      totalAllocated,
      allocationDate: new Date(),
    };
  } catch (error) {
    logger.error(`Failed to allocate project budget: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Tracks project expenditures and updates budget status
 */
export async function trackProjectExpenditure(
  projectId: string,
  category: string,
  amount: number,
  description: string,
  expenseDate: Date,
  vendorName?: string,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('trackProjectExpenditure');

  try {
    if (amount <= 0) {
      throw new BadRequestException('Expenditure amount must be greater than zero');
    }

    const expenditure = {
      projectId,
      category,
      amount,
      description,
      expenseDate,
      vendorName,
      recordedDate: new Date(),
      approvalStatus: 'PENDING',
      receiptUrl: null,
    };

    logger.log(`Expenditure tracked for project ${projectId}: $${amount} in category ${category}`);

    return expenditure;
  } catch (error) {
    logger.error(`Failed to track project expenditure: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generates budget forecast based on current spending trends
 */
export async function generateBudgetForecast(
  projectId: string,
  forecastData: BudgetForecastDto,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('generateBudgetForecast');

  try {
    if (forecastData.periodEnd <= forecastData.periodStart) {
      throw new BadRequestException('Forecast period end must be after start');
    }

    const periodDays = Math.ceil(
      (forecastData.periodEnd.getTime() - forecastData.periodStart.getTime()) / (1000 * 60 * 60 * 24),
    );

    const dailyBurnRate = forecastData.projectedSpending / periodDays;

    const forecast = {
      projectId,
      ...forecastData,
      periodDays,
      dailyBurnRate,
      confidenceLevel: forecastData.confidenceLevel || 75,
      generatedAt: new Date(),
      forecastMethod: 'TREND_ANALYSIS',
    };

    logger.log(`Budget forecast generated for project ${projectId}: $${forecastData.projectedSpending} over ${periodDays} days`);

    return forecast;
  } catch (error) {
    logger.error(`Failed to generate budget forecast: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Analyzes current budget status and generates comprehensive report
 */
export async function analyzeBudgetStatus(
  projectId: string,
  totalBudget: number,
  budgetAllocations: Array<{
    category: string;
    allocated: number;
    spent: number;
    committed: number;
  }>,
  transaction?: Transaction,
): Promise<BudgetAnalysis> {
  const logger = new Logger('analyzeBudgetStatus');

  try {
    const totalSpent = budgetAllocations.reduce((sum, alloc) => sum + alloc.spent, 0);
    const totalCommitted = budgetAllocations.reduce((sum, alloc) => sum + alloc.committed, 0);
    const remainingBudget = totalBudget - totalSpent - totalCommitted;
    const utilizationPercentage = ((totalSpent + totalCommitted) / totalBudget) * 100;

    const categoryBreakdown = budgetAllocations.map(alloc => ({
      category: alloc.category,
      allocated: alloc.allocated,
      spent: alloc.spent,
      remaining: alloc.allocated - alloc.spent - alloc.committed,
    }));

    const analysis: BudgetAnalysis = {
      totalBudget,
      totalSpent,
      totalCommitted,
      remainingBudget,
      utilizationPercentage,
      categoryBreakdown,
    };

    logger.log(`Budget analysis completed for project ${projectId}: ${utilizationPercentage.toFixed(1)}% utilized`);

    return analysis;
  } catch (error) {
    logger.error(`Failed to analyze budget status: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Manages budget contingency reserves and releases
 */
export async function manageContingencyReserve(
  projectId: string,
  reserveAmount: number,
  action: 'ALLOCATE' | 'RELEASE' | 'ADJUST',
  reason: string,
  requestedBy: string,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('manageContingencyReserve');

  try {
    if (reserveAmount <= 0 && action !== 'RELEASE') {
      throw new BadRequestException('Reserve amount must be greater than zero');
    }

    const reserveAction = {
      projectId,
      action,
      amount: reserveAmount,
      reason,
      requestedBy,
      actionDate: new Date(),
      approvalRequired: reserveAmount > 10000,
      status: reserveAmount > 10000 ? 'PENDING_APPROVAL' : 'APPROVED',
    };

    logger.log(`Contingency reserve ${action.toLowerCase()} for project ${projectId}: $${reserveAmount}`);

    return reserveAction;
  } catch (error) {
    logger.error(`Failed to manage contingency reserve: ${error.message}`, error.stack);
    throw error;
  }
}

// =====================================================================
// 3. PROJECT MILESTONE TRACKING (5 functions)
// =====================================================================

/**
 * Creates project milestones with dependencies
 */
export async function createProjectMilestone(
  projectId: string,
  milestoneData: ProjectMilestoneDto,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('createProjectMilestone');

  try {
    const milestone = {
      projectId,
      ...milestoneData,
      status: MilestoneStatus.PENDING,
      completionPercentage: milestoneData.completionPercentage || 0,
      actualCompletionDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    logger.log(`Milestone created for project ${projectId}: ${milestone.name}`);

    return milestone;
  } catch (error) {
    logger.error(`Failed to create project milestone: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Updates milestone progress and completion status
 */
export async function updateMilestoneProgress(
  milestoneId: string,
  completionPercentage: number,
  statusUpdate: string,
  updatedBy: string,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('updateMilestoneProgress');

  try {
    if (completionPercentage < 0 || completionPercentage > 100) {
      throw new BadRequestException('Completion percentage must be between 0 and 100');
    }

    let status = MilestoneStatus.IN_PROGRESS;
    if (completionPercentage === 100) {
      status = MilestoneStatus.COMPLETED;
    } else if (completionPercentage === 0) {
      status = MilestoneStatus.PENDING;
    }

    const update = {
      milestoneId,
      completionPercentage,
      status,
      statusUpdate,
      updatedBy,
      updatedAt: new Date(),
      actualCompletionDate: completionPercentage === 100 ? new Date() : null,
    };

    logger.log(`Milestone ${milestoneId} updated: ${completionPercentage}% complete`);

    return update;
  } catch (error) {
    logger.error(`Failed to update milestone progress: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Validates milestone dependencies and critical path
 */
export async function validateMilestoneDependencies(
  projectId: string,
  milestones: Array<{
    id: string;
    name: string;
    targetDate: Date;
    dependencies: string[];
    status: MilestoneStatus;
  }>,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('validateMilestoneDependencies');

  try {
    const validationResults = {
      projectId,
      isValid: true,
      conflicts: [] as Array<{ milestoneId: string; issue: string }>,
      criticalPath: [] as string[],
      validatedAt: new Date(),
    };

    // Check for circular dependencies
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    function hasCycle(milestoneId: string): boolean {
      visited.add(milestoneId);
      recursionStack.add(milestoneId);

      const milestone = milestones.find(m => m.id === milestoneId);
      if (milestone && milestone.dependencies) {
        for (const depId of milestone.dependencies) {
          if (!visited.has(depId)) {
            if (hasCycle(depId)) return true;
          } else if (recursionStack.has(depId)) {
            return true;
          }
        }
      }

      recursionStack.delete(milestoneId);
      return false;
    }

    // Validate each milestone
    for (const milestone of milestones) {
      if (hasCycle(milestone.id)) {
        validationResults.isValid = false;
        validationResults.conflicts.push({
          milestoneId: milestone.id,
          issue: 'Circular dependency detected',
        });
      }

      // Check if dependencies are completed before this milestone can start
      for (const depId of milestone.dependencies || []) {
        const dependency = milestones.find(m => m.id === depId);
        if (dependency && dependency.targetDate >= milestone.targetDate) {
          validationResults.isValid = false;
          validationResults.conflicts.push({
            milestoneId: milestone.id,
            issue: `Dependency ${dependency.name} target date is after this milestone`,
          });
        }
      }
    }

    logger.log(`Milestone dependencies validated for project ${projectId}: ${validationResults.conflicts.length} conflicts found`);

    return validationResults;
  } catch (error) {
    logger.error(`Failed to validate milestone dependencies: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generates milestone completion report
 */
export async function generateMilestoneReport(
  projectId: string,
  milestones: Array<{
    name: string;
    targetDate: Date;
    actualCompletionDate?: Date;
    status: MilestoneStatus;
    completionPercentage: number;
  }>,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('generateMilestoneReport');

  try {
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length;
    const delayedMilestones = milestones.filter(
      m => m.status === MilestoneStatus.DELAYED || (m.targetDate < new Date() && m.status !== MilestoneStatus.COMPLETED),
    ).length;

    const averageCompletion = milestones.reduce((sum, m) => sum + m.completionPercentage, 0) / totalMilestones;

    const report = {
      projectId,
      totalMilestones,
      completedMilestones,
      delayedMilestones,
      inProgressMilestones: milestones.filter(m => m.status === MilestoneStatus.IN_PROGRESS).length,
      pendingMilestones: milestones.filter(m => m.status === MilestoneStatus.PENDING).length,
      averageCompletion,
      completionRate: (completedMilestones / totalMilestones) * 100,
      generatedAt: new Date(),
      upcomingMilestones: milestones
        .filter(m => m.targetDate > new Date() && m.status !== MilestoneStatus.COMPLETED)
        .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime())
        .slice(0, 5),
    };

    logger.log(`Milestone report generated for project ${projectId}: ${completedMilestones}/${totalMilestones} completed`);

    return report;
  } catch (error) {
    logger.error(`Failed to generate milestone report: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Adjusts milestone timelines based on project delays
 */
export async function adjustMilestoneTimelines(
  projectId: string,
  milestoneIds: string[],
  daysToAdjust: number,
  reason: string,
  adjustedBy: string,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('adjustMilestoneTimelines');

  try {
    if (milestoneIds.length === 0) {
      throw new BadRequestException('At least one milestone must be specified');
    }

    const adjustments = milestoneIds.map(milestoneId => ({
      milestoneId,
      daysAdjusted: daysToAdjust,
      reason,
      adjustedBy,
      adjustedAt: new Date(),
    }));

    logger.log(`Timeline adjusted for ${milestoneIds.length} milestones in project ${projectId}: ${daysToAdjust} days`);

    return {
      projectId,
      adjustments,
      totalMilestonesAdjusted: milestoneIds.length,
      daysAdjusted: daysToAdjust,
    };
  } catch (error) {
    logger.error(`Failed to adjust milestone timelines: ${error.message}`, error.stack);
    throw error;
  }
}

// =====================================================================
// 4. RESOURCE ALLOCATION (5 functions)
// =====================================================================

/**
 * Allocates resources to a capital project
 */
export async function allocateProjectResource(
  projectId: string,
  resourceData: ResourceAllocationDto,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('allocateProjectResource');

  try {
    if (resourceData.endDate <= resourceData.startDate) {
      throw new BadRequestException('Resource end date must be after start date');
    }

    const totalCost = resourceData.quantity * resourceData.unitCost;
    const durationDays = Math.ceil(
      (resourceData.endDate.getTime() - resourceData.startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const allocation = {
      projectId,
      ...resourceData,
      totalCost,
      durationDays,
      status: 'ALLOCATED',
      utilizationPercentage: 0,
      createdAt: new Date(),
    };

    logger.log(`Resource allocated for project ${projectId}: ${resourceData.resourceName} (${resourceData.resourceType})`);

    return allocation;
  } catch (error) {
    logger.error(`Failed to allocate project resource: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Tracks resource utilization and availability
 */
export async function trackResourceUtilization(
  resourceId: string,
  projectId: string,
  hoursUsed: number,
  utilizationDate: Date,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('trackResourceUtilization');

  try {
    if (hoursUsed < 0) {
      throw new BadRequestException('Hours used cannot be negative');
    }

    const utilization = {
      resourceId,
      projectId,
      hoursUsed,
      utilizationDate,
      recordedAt: new Date(),
    };

    logger.log(`Resource utilization tracked: ${hoursUsed} hours for resource ${resourceId}`);

    return utilization;
  } catch (error) {
    logger.error(`Failed to track resource utilization: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generates resource utilization analysis
 */
export async function analyzeResourceUtilization(
  projectId: string,
  resources: Array<{
    id: string;
    resourceType: ResourceType;
    totalAllocatedHours: number;
    totalUsedHours: number;
    totalCost: number;
  }>,
  transaction?: Transaction,
): Promise<ResourceUtilization[]> {
  const logger = new Logger('analyzeResourceUtilization');

  try {
    const utilizationByType = new Map<ResourceType, ResourceUtilization>();

    for (const resource of resources) {
      if (!utilizationByType.has(resource.resourceType)) {
        utilizationByType.set(resource.resourceType, {
          resourceType: resource.resourceType,
          totalAllocated: 0,
          totalCost: 0,
          utilizationRate: 0,
          peakUsagePeriod: { start: new Date(), end: new Date() },
        });
      }

      const typeData = utilizationByType.get(resource.resourceType)!;
      typeData.totalAllocated += resource.totalAllocatedHours;
      typeData.totalCost += resource.totalCost;
    }

    // Calculate utilization rates
    for (const [type, data] of utilizationByType) {
      const totalUsed = resources
        .filter(r => r.resourceType === type)
        .reduce((sum, r) => sum + r.totalUsedHours, 0);
      data.utilizationRate = data.totalAllocated > 0 ? (totalUsed / data.totalAllocated) * 100 : 0;
    }

    const analysis = Array.from(utilizationByType.values());

    logger.log(`Resource utilization analyzed for project ${projectId}: ${analysis.length} resource types`);

    return analysis;
  } catch (error) {
    logger.error(`Failed to analyze resource utilization: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Optimizes resource allocation across multiple projects
 */
export async function optimizeResourceAllocation(
  resources: Array<{
    id: string;
    name: string;
    type: ResourceType;
    availableCapacity: number;
    currentAllocations: Array<{ projectId: string; allocatedCapacity: number; priority: ProjectPriority }>;
  }>,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('optimizeResourceAllocation');

  try {
    const recommendations: Array<{
      resourceId: string;
      resourceName: string;
      isOverallocated: boolean;
      utilizationRate: number;
      suggestedActions: string[];
    }> = [];

    for (const resource of resources) {
      const totalAllocated = resource.currentAllocations.reduce((sum, alloc) => sum + alloc.allocatedCapacity, 0);
      const utilizationRate = (totalAllocated / resource.availableCapacity) * 100;
      const isOverallocated = totalAllocated > resource.availableCapacity;

      const suggestedActions: string[] = [];

      if (isOverallocated) {
        suggestedActions.push('Reduce allocation from low-priority projects');
        suggestedActions.push('Consider hiring additional resources');

        // Identify low-priority allocations
        const lowPriorityAllocations = resource.currentAllocations.filter(
          alloc => alloc.priority === ProjectPriority.LOW || alloc.priority === ProjectPriority.MEDIUM,
        );

        if (lowPriorityAllocations.length > 0) {
          suggestedActions.push(`Consider reallocating from ${lowPriorityAllocations.length} lower priority projects`);
        }
      } else if (utilizationRate < 70) {
        suggestedActions.push('Resource underutilized - consider additional project assignments');
      }

      recommendations.push({
        resourceId: resource.id,
        resourceName: resource.name,
        isOverallocated,
        utilizationRate,
        suggestedActions,
      });
    }

    const overallocatedCount = recommendations.filter(r => r.isOverallocated).length;

    logger.log(`Resource optimization completed: ${overallocatedCount} overallocated resources identified`);

    return {
      recommendations,
      overallocatedResources: overallocatedCount,
      totalResourcesAnalyzed: resources.length,
      optimizationDate: new Date(),
    };
  } catch (error) {
    logger.error(`Failed to optimize resource allocation: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Forecasts future resource needs based on project pipeline
 */
export async function forecastResourceNeeds(
  projectId: string,
  upcomingPhases: Array<{
    name: string;
    startDate: Date;
    endDate: Date;
    requiredResources: Array<{ type: ResourceType; quantity: number }>;
  }>,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('forecastResourceNeeds');

  try {
    const resourceForecast = new Map<ResourceType, Array<{ date: Date; quantity: number }>>();

    for (const phase of upcomingPhases) {
      for (const resource of phase.requiredResources) {
        if (!resourceForecast.has(resource.type)) {
          resourceForecast.set(resource.type, []);
        }

        resourceForecast.get(resource.type)!.push({
          date: phase.startDate,
          quantity: resource.quantity,
        });
      }
    }

    const forecast = Array.from(resourceForecast.entries()).map(([type, demands]) => ({
      resourceType: type,
      peakDemand: Math.max(...demands.map(d => d.quantity)),
      averageDemand: demands.reduce((sum, d) => sum + d.quantity, 0) / demands.length,
      demandPeriods: demands.sort((a, b) => a.date.getTime() - b.date.getTime()),
    }));

    logger.log(`Resource forecast generated for project ${projectId}: ${forecast.length} resource types`);

    return {
      projectId,
      forecast,
      forecastPeriod: {
        start: Math.min(...upcomingPhases.map(p => p.startDate.getTime())),
        end: Math.max(...upcomingPhases.map(p => p.endDate.getTime())),
      },
      generatedAt: new Date(),
    };
  } catch (error) {
    logger.error(`Failed to forecast resource needs: ${error.message}`, error.stack);
    throw error;
  }
}

// =====================================================================
// 5. PROJECT COST CONTROL (4 functions)
// =====================================================================

/**
 * Tracks and analyzes cost variance from baseline
 */
export async function analyzeCostVariance(
  projectId: string,
  plannedCost: number,
  actualCost: number,
  earnedValue: number,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('analyzeCostVariance');

  try {
    if (plannedCost <= 0) {
      throw new BadRequestException('Planned cost must be greater than zero');
    }

    const costVariance = earnedValue - actualCost;
    const costVariancePercentage = (costVariance / earnedValue) * 100;
    const costPerformanceIndex = earnedValue / actualCost;
    const scheduleVariance = earnedValue - plannedCost;
    const schedulePerformanceIndex = earnedValue / plannedCost;

    let status: string;
    if (costPerformanceIndex >= 1 && schedulePerformanceIndex >= 1) {
      status = 'ON_TRACK';
    } else if (costPerformanceIndex < 0.9 || schedulePerformanceIndex < 0.9) {
      status = 'CRITICAL';
    } else {
      status = 'AT_RISK';
    }

    const analysis = {
      projectId,
      plannedCost,
      actualCost,
      earnedValue,
      costVariance,
      costVariancePercentage,
      costPerformanceIndex,
      scheduleVariance,
      schedulePerformanceIndex,
      status,
      isOverBudget: costVariance < 0,
      isBehindSchedule: scheduleVariance < 0,
      analysisDate: new Date(),
    };

    logger.log(`Cost variance analyzed for project ${projectId}: CPI ${costPerformanceIndex.toFixed(2)}, SPI ${schedulePerformanceIndex.toFixed(2)}`);

    return analysis;
  } catch (error) {
    logger.error(`Failed to analyze cost variance: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generates estimate at completion (EAC) projection
 */
export async function calculateEstimateAtCompletion(
  projectId: string,
  budgetAtCompletion: number,
  actualCost: number,
  earnedValue: number,
  estimateMethod: 'CPI' | 'SPI_CPI' | 'MANUAL',
  manualEstimate?: number,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('calculateEstimateAtCompletion');

  try {
    let estimateAtCompletion: number;
    const costPerformanceIndex = earnedValue / actualCost;
    const schedulePerformanceIndex = earnedValue / budgetAtCompletion;

    switch (estimateMethod) {
      case 'CPI':
        estimateAtCompletion = budgetAtCompletion / costPerformanceIndex;
        break;
      case 'SPI_CPI':
        estimateAtCompletion = budgetAtCompletion / (costPerformanceIndex * schedulePerformanceIndex);
        break;
      case 'MANUAL':
        if (!manualEstimate) {
          throw new BadRequestException('Manual estimate required for MANUAL method');
        }
        estimateAtCompletion = manualEstimate;
        break;
      default:
        throw new BadRequestException('Invalid estimate method');
    }

    const estimateToComplete = estimateAtCompletion - actualCost;
    const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;
    const toCompletePerformanceIndex = estimateToComplete / (budgetAtCompletion - earnedValue);

    const projection = {
      projectId,
      budgetAtCompletion,
      estimateAtCompletion,
      estimateToComplete,
      varianceAtCompletion,
      toCompletePerformanceIndex,
      estimateMethod,
      isProjectedOverBudget: estimateAtCompletion > budgetAtCompletion,
      projectedOverage: Math.max(0, estimateAtCompletion - budgetAtCompletion),
      calculatedAt: new Date(),
    };

    logger.log(`EAC calculated for project ${projectId}: $${estimateAtCompletion.toFixed(2)} (${estimateMethod})`);

    return projection;
  } catch (error) {
    logger.error(`Failed to calculate estimate at completion: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Implements earned value management (EVM) analysis
 */
export async function performEarnedValueAnalysis(
  projectId: string,
  plannedValue: number,
  earnedValue: number,
  actualCost: number,
  budgetAtCompletion: number,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('performEarnedValueAnalysis');

  try {
    const scheduleVariance = earnedValue - plannedValue;
    const costVariance = earnedValue - actualCost;
    const schedulePerformanceIndex = earnedValue / plannedValue;
    const costPerformanceIndex = earnedValue / actualCost;

    const estimateAtCompletion = budgetAtCompletion / costPerformanceIndex;
    const estimateToComplete = estimateAtCompletion - actualCost;
    const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;
    const toCompletePerformanceIndex = (budgetAtCompletion - earnedValue) / (budgetAtCompletion - actualCost);

    const percentComplete = (earnedValue / budgetAtCompletion) * 100;
    const percentSpent = (actualCost / budgetAtCompletion) * 100;

    const analysis = {
      projectId,
      plannedValue,
      earnedValue,
      actualCost,
      budgetAtCompletion,
      scheduleVariance,
      costVariance,
      schedulePerformanceIndex,
      costPerformanceIndex,
      estimateAtCompletion,
      estimateToComplete,
      varianceAtCompletion,
      toCompletePerformanceIndex,
      percentComplete,
      percentSpent,
      performanceStatus: {
        schedule: schedulePerformanceIndex >= 1 ? 'ON_TRACK' : 'BEHIND',
        cost: costPerformanceIndex >= 1 ? 'UNDER_BUDGET' : 'OVER_BUDGET',
        overall: schedulePerformanceIndex >= 0.95 && costPerformanceIndex >= 0.95 ? 'HEALTHY' : 'AT_RISK',
      },
      analysisDate: new Date(),
    };

    logger.log(`EVM analysis completed for project ${projectId}: ${analysis.performanceStatus.overall}`);

    return analysis;
  } catch (error) {
    logger.error(`Failed to perform earned value analysis: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Tracks and controls project cost baselines
 */
export async function manageCostBaseline(
  projectId: string,
  action: 'CREATE' | 'UPDATE' | 'REBASELINE',
  baselineCost: number,
  reason: string,
  approvedBy: string,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('manageCostBaseline');

  try {
    if (baselineCost <= 0) {
      throw new BadRequestException('Baseline cost must be greater than zero');
    }

    const baseline = {
      projectId,
      action,
      baselineCost,
      reason,
      approvedBy,
      effectiveDate: new Date(),
      version: action === 'CREATE' ? 1 : undefined,
      requiresApproval: action === 'REBASELINE',
    };

    logger.log(`Cost baseline ${action.toLowerCase()} for project ${projectId}: $${baselineCost}`);

    return baseline;
  } catch (error) {
    logger.error(`Failed to manage cost baseline: ${error.message}`, error.stack);
    throw error;
  }
}

// =====================================================================
// 6. CHANGE ORDER MANAGEMENT (4 functions)
// =====================================================================

/**
 * Creates a change order for the project
 */
export async function createChangeOrder(
  projectId: string,
  changeOrderData: ChangeOrderDto,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('createChangeOrder');

  try {
    const changeOrder = {
      projectId,
      ...changeOrderData,
      status: ChangeOrderStatus.DRAFT,
      changeOrderNumber: `CO-${Date.now()}`,
      submittedDate: new Date(),
      approvedDate: null,
      implementedDate: null,
      createdAt: new Date(),
    };

    logger.log(`Change order created for project ${projectId}: ${changeOrder.title} (${changeOrderData.costImpact >= 0 ? '+' : ''}$${changeOrderData.costImpact})`);

    return changeOrder;
  } catch (error) {
    logger.error(`Failed to create change order: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Reviews and approves/rejects change orders
 */
export async function reviewChangeOrder(
  changeOrderId: string,
  action: 'APPROVE' | 'REJECT',
  reviewedBy: string,
  reviewComments: string,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('reviewChangeOrder');

  try {
    const status = action === 'APPROVE' ? ChangeOrderStatus.APPROVED : ChangeOrderStatus.REJECTED;

    const review = {
      changeOrderId,
      action,
      status,
      reviewedBy,
      reviewComments,
      reviewDate: new Date(),
      approvalLevel: 'MANAGER',
    };

    logger.log(`Change order ${changeOrderId} ${action.toLowerCase()}ed by ${reviewedBy}`);

    return review;
  } catch (error) {
    logger.error(`Failed to review change order: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Analyzes change order impact on project scope, budget, and timeline
 */
export async function analyzeChangeOrderImpact(
  projectId: string,
  changeOrders: Array<{
    costImpact: number;
    scheduleImpact: number;
    status: ChangeOrderStatus;
  }>,
  currentBudget: number,
  currentEndDate: Date,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('analyzeChangeOrderImpact');

  try {
    const approvedChangeOrders = changeOrders.filter(
      co => co.status === ChangeOrderStatus.APPROVED || co.status === ChangeOrderStatus.IMPLEMENTED,
    );

    const totalCostImpact = approvedChangeOrders.reduce((sum, co) => sum + co.costImpact, 0);
    const totalScheduleImpact = approvedChangeOrders.reduce((sum, co) => sum + co.scheduleImpact, 0);

    const newBudget = currentBudget + totalCostImpact;
    const newEndDate = new Date(currentEndDate.getTime() + totalScheduleImpact * 24 * 60 * 60 * 1000);

    const budgetImpactPercentage = (totalCostImpact / currentBudget) * 100;
    const scheduleImpactPercentage = (totalScheduleImpact / 365) * 100; // Assuming 1 year baseline

    const analysis = {
      projectId,
      totalChangeOrders: changeOrders.length,
      approvedChangeOrders: approvedChangeOrders.length,
      totalCostImpact,
      totalScheduleImpact,
      currentBudget,
      newBudget,
      budgetImpactPercentage,
      currentEndDate,
      newEndDate,
      scheduleImpactPercentage,
      requiresRebaseline: Math.abs(budgetImpactPercentage) > 10 || Math.abs(totalScheduleImpact) > 30,
      analysisDate: new Date(),
    };

    logger.log(`Change order impact analyzed for project ${projectId}: ${approvedChangeOrders.length} approved, $${totalCostImpact} impact`);

    return analysis;
  } catch (error) {
    logger.error(`Failed to analyze change order impact: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Tracks change order implementation and closeout
 */
export async function trackChangeOrderImplementation(
  changeOrderId: string,
  implementationStatus: 'STARTED' | 'IN_PROGRESS' | 'COMPLETED',
  implementationNotes: string,
  actualCostImpact?: number,
  actualScheduleImpact?: number,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('trackChangeOrderImplementation');

  try {
    const implementation = {
      changeOrderId,
      implementationStatus,
      implementationNotes,
      actualCostImpact,
      actualScheduleImpact,
      updatedAt: new Date(),
      completedDate: implementationStatus === 'COMPLETED' ? new Date() : null,
      status: implementationStatus === 'COMPLETED' ? ChangeOrderStatus.IMPLEMENTED : ChangeOrderStatus.APPROVED,
    };

    logger.log(`Change order ${changeOrderId} implementation updated: ${implementationStatus}`);

    return implementation;
  } catch (error) {
    logger.error(`Failed to track change order implementation: ${error.message}`, error.stack);
    throw error;
  }
}

// =====================================================================
// 7. PROJECT TIMELINE MANAGEMENT (4 functions)
// =====================================================================

/**
 * Creates and manages project schedules
 */
export async function createProjectSchedule(
  projectId: string,
  startDate: Date,
  endDate: Date,
  workingDaysPerWeek: number,
  holidays: Date[],
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('createProjectSchedule');

  try {
    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    if (workingDaysPerWeek < 1 || workingDaysPerWeek > 7) {
      throw new BadRequestException('Working days per week must be between 1 and 7');
    }

    const totalCalendarDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.ceil(totalCalendarDays / 7);
    const estimatedWorkingDays = totalWeeks * workingDaysPerWeek - holidays.length;

    const schedule = {
      projectId,
      startDate,
      endDate,
      workingDaysPerWeek,
      holidays,
      totalCalendarDays,
      estimatedWorkingDays,
      createdAt: new Date(),
      version: 1,
    };

    logger.log(`Project schedule created for ${projectId}: ${estimatedWorkingDays} working days`);

    return schedule;
  } catch (error) {
    logger.error(`Failed to create project schedule: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Analyzes schedule performance and identifies delays
 */
export async function analyzeSchedulePerformance(
  projectId: string,
  plannedStartDate: Date,
  plannedEndDate: Date,
  actualStartDate: Date | null,
  currentDate: Date,
  completionPercentage: number,
  transaction?: Transaction,
): Promise<TimelineAnalysis> {
  const logger = new Logger('analyzeSchedulePerformance');

  try {
    const plannedDuration = Math.ceil((plannedEndDate.getTime() - plannedStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = actualStartDate
      ? Math.ceil((currentDate.getTime() - actualStartDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const expectedCompletion = (elapsedDays / plannedDuration) * 100;
    const scheduleVariance = completionPercentage - expectedCompletion;
    const isOnSchedule = scheduleVariance >= -5; // Within 5% tolerance

    const estimatedDaysRemaining = ((100 - completionPercentage) / completionPercentage) * elapsedDays;
    const projectedEndDate = actualStartDate
      ? new Date(actualStartDate.getTime() + (elapsedDays + estimatedDaysRemaining) * 24 * 60 * 60 * 1000)
      : plannedEndDate;

    const analysis: TimelineAnalysis = {
      plannedDuration,
      actualDuration: elapsedDays,
      remainingDuration: estimatedDaysRemaining,
      isOnSchedule,
      delayedMilestones: 0,
      completedMilestones: 0,
      totalMilestones: 0,
    };

    logger.log(`Schedule performance analyzed for project ${projectId}: ${isOnSchedule ? 'On schedule' : 'Delayed'}`);

    return analysis;
  } catch (error) {
    logger.error(`Failed to analyze schedule performance: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculates critical path for project activities
 */
export async function calculateCriticalPath(
  projectId: string,
  activities: Array<{
    id: string;
    name: string;
    duration: number;
    dependencies: string[];
  }>,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('calculateCriticalPath');

  try {
    // Build activity map
    const activityMap = new Map(activities.map(a => [a.id, { ...a, earlyStart: 0, earlyFinish: 0, lateStart: 0, lateFinish: 0 }]));

    // Forward pass - calculate early start and early finish
    const visited = new Set<string>();

    function calculateEarlyDates(activityId: string): void {
      if (visited.has(activityId)) return;

      const activity = activityMap.get(activityId)!;
      let maxEarlyFinish = 0;

      for (const depId of activity.dependencies) {
        calculateEarlyDates(depId);
        const dep = activityMap.get(depId)!;
        maxEarlyFinish = Math.max(maxEarlyFinish, dep.earlyFinish);
      }

      activity.earlyStart = maxEarlyFinish;
      activity.earlyFinish = activity.earlyStart + activity.duration;
      visited.add(activityId);
    }

    // Calculate early dates for all activities
    for (const activity of activities) {
      calculateEarlyDates(activity.id);
    }

    // Find project completion time
    const projectDuration = Math.max(...Array.from(activityMap.values()).map(a => a.earlyFinish));

    // Backward pass - calculate late start and late finish
    for (const activity of Array.from(activityMap.values()).reverse()) {
      // Find successors
      const successors = activities.filter(a => a.dependencies.includes(activity.id));

      if (successors.length === 0) {
        activity.lateFinish = projectDuration;
      } else {
        activity.lateFinish = Math.min(...successors.map(s => activityMap.get(s.id)!.lateStart));
      }

      activity.lateStart = activity.lateFinish - activity.duration;
    }

    // Identify critical path (activities with zero float)
    const criticalActivities = Array.from(activityMap.values())
      .filter(a => a.earlyStart === a.lateStart)
      .map(a => ({ id: a.id, name: a.name, duration: a.duration }));

    const result = {
      projectId,
      projectDuration,
      criticalPath: criticalActivities,
      criticalPathLength: criticalActivities.reduce((sum, a) => sum + a.duration, 0),
      totalFloat: Array.from(activityMap.values()).reduce((sum, a) => sum + (a.lateStart - a.earlyStart), 0),
      calculatedAt: new Date(),
    };

    logger.log(`Critical path calculated for project ${projectId}: ${criticalActivities.length} critical activities, ${projectDuration} days duration`);

    return result;
  } catch (error) {
    logger.error(`Failed to calculate critical path: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generates project timeline reports and visualizations
 */
export async function generateTimelineReport(
  projectId: string,
  plannedStartDate: Date,
  plannedEndDate: Date,
  actualStartDate: Date | null,
  milestones: Array<{
    name: string;
    targetDate: Date;
    actualDate: Date | null;
    status: MilestoneStatus;
  }>,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('generateTimelineReport');

  try {
    const currentDate = new Date();
    const projectStatus = !actualStartDate
      ? 'NOT_STARTED'
      : currentDate > plannedEndDate
      ? 'OVERDUE'
      : 'IN_PROGRESS';

    const completedMilestones = milestones.filter(m => m.status === MilestoneStatus.COMPLETED);
    const delayedMilestones = milestones.filter(
      m => m.targetDate < currentDate && m.status !== MilestoneStatus.COMPLETED,
    );

    const upcomingMilestones = milestones
      .filter(m => m.targetDate > currentDate && m.status !== MilestoneStatus.COMPLETED)
      .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime())
      .slice(0, 5);

    const report = {
      projectId,
      projectStatus,
      plannedStartDate,
      plannedEndDate,
      actualStartDate,
      totalMilestones: milestones.length,
      completedMilestones: completedMilestones.length,
      delayedMilestones: delayedMilestones.length,
      upcomingMilestones,
      milestoneCompletionRate: (completedMilestones.length / milestones.length) * 100,
      averageDelay: delayedMilestones.length > 0
        ? delayedMilestones.reduce((sum, m) => {
            const delay = Math.ceil((currentDate.getTime() - m.targetDate.getTime()) / (1000 * 60 * 60 * 24));
            return sum + delay;
          }, 0) / delayedMilestones.length
        : 0,
      generatedAt: new Date(),
    };

    logger.log(`Timeline report generated for project ${projectId}: ${projectStatus}, ${completedMilestones.length}/${milestones.length} milestones completed`);

    return report;
  } catch (error) {
    logger.error(`Failed to generate timeline report: ${error.message}`, error.stack);
    throw error;
  }
}

// =====================================================================
// 8. RISK ASSESSMENT AND MITIGATION (5 functions)
// =====================================================================

/**
 * Registers a new risk for the project
 */
export async function registerProjectRisk(
  projectId: string,
  riskData: ProjectRiskDto,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('registerProjectRisk');

  try {
    // Calculate risk score (probability * impact)
    const riskScore = (riskData.probability / 100) * riskData.costImpact;

    const risk = {
      projectId,
      ...riskData,
      riskScore,
      status: 'ACTIVE',
      identifiedDate: new Date(),
      mitigatedDate: null,
      createdAt: new Date(),
    };

    logger.log(`Risk registered for project ${projectId}: ${risk.title} (${risk.riskLevel}, score: ${riskScore.toFixed(2)})`);

    return risk;
  } catch (error) {
    logger.error(`Failed to register project risk: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Performs comprehensive risk assessment
 */
export async function performRiskAssessment(
  projectId: string,
  risks: Array<{
    title: string;
    riskLevel: RiskLevel;
    probability: number;
    costImpact: number;
    mitigationStrategy: string | null;
    status: string;
  }>,
  transaction?: Transaction,
): Promise<RiskAssessment> {
  const logger = new Logger('performRiskAssessment');

  try {
    const activeRisks = risks.filter(r => r.status === 'ACTIVE');
    const criticalRisks = activeRisks.filter(r => r.riskLevel === RiskLevel.CRITICAL).length;
    const highRisks = activeRisks.filter(r => r.riskLevel === RiskLevel.HIGH).length;

    const expectedCostImpact = activeRisks.reduce((sum, risk) => {
      const expectedValue = (risk.probability / 100) * risk.costImpact;
      return sum + expectedValue;
    }, 0);

    const topRisks = activeRisks
      .map(risk => ({
        title: risk.title,
        riskScore: (risk.probability / 100) * risk.costImpact,
        mitigationStatus: risk.mitigationStrategy ? 'PLANNED' : 'NO_MITIGATION',
      }))
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);

    const assessment: RiskAssessment = {
      totalRisks: activeRisks.length,
      criticalRisks,
      highRisks,
      expectedCostImpact,
      topRisks,
    };

    logger.log(`Risk assessment completed for project ${projectId}: ${activeRisks.length} active risks, $${expectedCostImpact.toFixed(2)} expected impact`);

    return assessment;
  } catch (error) {
    logger.error(`Failed to perform risk assessment: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Creates and tracks risk mitigation plans
 */
export async function createRiskMitigationPlan(
  riskId: string,
  mitigationStrategy: string,
  actionItems: Array<{ description: string; assignedTo: string; dueDate: Date }>,
  estimatedCost: number,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('createRiskMitigationPlan');

  try {
    if (!actionItems || actionItems.length === 0) {
      throw new BadRequestException('At least one action item is required for mitigation plan');
    }

    const plan = {
      riskId,
      mitigationStrategy,
      actionItems: actionItems.map((item, index) => ({
        ...item,
        actionNumber: index + 1,
        status: 'PENDING',
        completedDate: null,
      })),
      estimatedCost,
      totalActionItems: actionItems.length,
      completedActionItems: 0,
      planStatus: 'ACTIVE',
      createdAt: new Date(),
    };

    logger.log(`Risk mitigation plan created for risk ${riskId}: ${actionItems.length} action items, $${estimatedCost} estimated cost`);

    return plan;
  } catch (error) {
    logger.error(`Failed to create risk mitigation plan: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Monitors and updates risk status
 */
export async function updateRiskStatus(
  riskId: string,
  newStatus: 'ACTIVE' | 'MITIGATED' | 'REALIZED' | 'CLOSED',
  statusNotes: string,
  actualImpact?: number,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('updateRiskStatus');

  try {
    const update = {
      riskId,
      previousStatus: 'ACTIVE',
      newStatus,
      statusNotes,
      actualImpact,
      updatedAt: new Date(),
      closedDate: newStatus === 'CLOSED' || newStatus === 'MITIGATED' ? new Date() : null,
    };

    logger.log(`Risk ${riskId} status updated to ${newStatus}`);

    return update;
  } catch (error) {
    logger.error(`Failed to update risk status: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generates risk matrix and heat map
 */
export async function generateRiskMatrix(
  projectId: string,
  risks: Array<{
    id: string;
    title: string;
    probability: number;
    impact: number;
    riskLevel: RiskLevel;
  }>,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('generateRiskMatrix');

  try {
    // Create risk matrix (5x5 grid)
    const matrix: Array<Array<Array<{ id: string; title: string }>>> = Array(5)
      .fill(null)
      .map(() => Array(5).fill(null).map(() => []));

    for (const risk of risks) {
      // Map probability and impact to matrix coordinates (0-4)
      const probIndex = Math.min(Math.floor(risk.probability / 20), 4);
      const impactIndex = Math.min(Math.floor(risk.impact / 20000), 4); // Assuming max impact of 100k

      matrix[probIndex][impactIndex].push({
        id: risk.id,
        title: risk.title,
      });
    }

    // Calculate risk distribution
    const distribution = {
      critical: risks.filter(r => r.riskLevel === RiskLevel.CRITICAL).length,
      high: risks.filter(r => r.riskLevel === RiskLevel.HIGH).length,
      medium: risks.filter(r => r.riskLevel === RiskLevel.MEDIUM).length,
      low: risks.filter(r => r.riskLevel === RiskLevel.LOW).length,
    };

    const result = {
      projectId,
      matrix,
      distribution,
      totalRisks: risks.length,
      generatedAt: new Date(),
      riskConcentration: {
        highProbabilityHighImpact: matrix[3][3].length + matrix[3][4].length + matrix[4][3].length + matrix[4][4].length,
        lowProbabilityHighImpact: matrix[0][3].length + matrix[0][4].length + matrix[1][3].length + matrix[1][4].length,
      },
    };

    logger.log(`Risk matrix generated for project ${projectId}: ${risks.length} risks plotted`);

    return result;
  } catch (error) {
    logger.error(`Failed to generate risk matrix: ${error.message}`, error.stack);
    throw error;
  }
}

// =====================================================================
// 9. STAKEHOLDER COMMUNICATION (4 functions)
// =====================================================================

/**
 * Creates stakeholder communication records
 */
export async function createStakeholderCommunication(
  projectId: string,
  communicationData: StakeholderCommunicationDto,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('createStakeholderCommunication');

  try {
    const communication = {
      projectId,
      ...communicationData,
      status: 'DRAFT',
      sentDate: null,
      deliveryStatus: {},
      createdAt: new Date(),
    };

    logger.log(`Stakeholder communication created for project ${projectId}: ${communication.subject} (${communicationData.recipients.length} recipients)`);

    return communication;
  } catch (error) {
    logger.error(`Failed to create stakeholder communication: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generates project status reports for stakeholders
 */
export async function generateStakeholderStatusReport(
  projectId: string,
  reportingPeriod: { start: Date; end: Date },
  metrics: ProjectMetrics,
  highlights: string[],
  concerns: string[],
  nextSteps: string[],
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('generateStakeholderStatusReport');

  try {
    let overallStatus: 'GREEN' | 'YELLOW' | 'RED';

    if (metrics.scheduleVariance < -10 || metrics.costVariance < -10 || metrics.activeRisks > 5) {
      overallStatus = 'RED';
    } else if (metrics.scheduleVariance < -5 || metrics.costVariance < -5 || metrics.activeRisks > 2) {
      overallStatus = 'YELLOW';
    } else {
      overallStatus = 'GREEN';
    }

    const report = {
      projectId,
      reportingPeriod,
      generatedDate: new Date(),
      overallStatus,
      metrics,
      highlights: highlights || [],
      concerns: concerns || [],
      nextSteps: nextSteps || [],
      summary: `Project is ${metrics.completionPercentage}% complete with ${overallStatus} status`,
    };

    logger.log(`Stakeholder status report generated for project ${projectId}: ${overallStatus} status`);

    return report;
  } catch (error) {
    logger.error(`Failed to generate stakeholder status report: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Manages stakeholder engagement and feedback
 */
export async function trackStakeholderEngagement(
  projectId: string,
  stakeholderId: string,
  engagementType: 'MEETING' | 'EMAIL' | 'PRESENTATION' | 'WORKSHOP',
  engagementDate: Date,
  topics: string[],
  feedback: string,
  actionItems?: Array<{ description: string; assignedTo: string }>,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('trackStakeholderEngagement');

  try {
    const engagement = {
      projectId,
      stakeholderId,
      engagementType,
      engagementDate,
      topics,
      feedback,
      actionItems: actionItems || [],
      recordedAt: new Date(),
    };

    logger.log(`Stakeholder engagement tracked for project ${projectId}: ${engagementType} with ${topics.length} topics`);

    return engagement;
  } catch (error) {
    logger.error(`Failed to track stakeholder engagement: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Distributes project communications to stakeholders
 */
export async function distributeProjectCommunication(
  communicationId: string,
  distributionMethod: 'EMAIL' | 'PORTAL' | 'SMS',
  scheduledDate?: Date,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('distributeProjectCommunication');

  try {
    const distribution = {
      communicationId,
      distributionMethod,
      scheduledDate: scheduledDate || new Date(),
      status: scheduledDate && scheduledDate > new Date() ? 'SCHEDULED' : 'SENT',
      sentDate: scheduledDate && scheduledDate > new Date() ? null : new Date(),
      deliveryMetrics: {
        sent: 0,
        delivered: 0,
        failed: 0,
        opened: 0,
      },
    };

    logger.log(`Communication ${communicationId} ${distribution.status.toLowerCase()} via ${distributionMethod}`);

    return distribution;
  } catch (error) {
    logger.error(`Failed to distribute project communication: ${error.message}`, error.stack);
    throw error;
  }
}

// =====================================================================
// 10. PROJECT CLOSEOUT PROCEDURES (4 functions)
// =====================================================================

/**
 * Initiates project closeout process
 */
export async function initiateProjectCloseout(
  projectId: string,
  closeoutData: ProjectCloseoutDto,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('initiateProjectCloseout');

  try {
    const closeout = {
      projectId,
      ...closeoutData,
      closeoutStatus: 'INITIATED',
      closeoutInitiatedDate: new Date(),
      closeoutCompletedDate: null,
      outstandingItems: [],
      approvals: [],
    };

    logger.log(`Project closeout initiated for ${projectId}: final cost $${closeoutData.finalCost}`);

    return closeout;
  } catch (error) {
    logger.error(`Failed to initiate project closeout: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Conducts final project audit and variance analysis
 */
export async function conductFinalProjectAudit(
  projectId: string,
  plannedBudget: number,
  actualCost: number,
  plannedEndDate: Date,
  actualEndDate: Date,
  plannedScope: string,
  deliveredScope: string,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('conductFinalProjectAudit');

  try {
    const budgetVariance = actualCost - plannedBudget;
    const budgetVariancePercentage = (budgetVariance / plannedBudget) * 100;

    const scheduleVarianceDays = Math.ceil(
      (actualEndDate.getTime() - plannedEndDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const performanceRating = calculatePerformanceRating(
      budgetVariancePercentage,
      scheduleVarianceDays,
    );

    const audit = {
      projectId,
      plannedBudget,
      actualCost,
      budgetVariance,
      budgetVariancePercentage,
      plannedEndDate,
      actualEndDate,
      scheduleVarianceDays,
      plannedScope,
      deliveredScope,
      scopeMetPercentage: 100, // Could be calculated based on detailed scope comparison
      performanceRating,
      auditDate: new Date(),
      recommendations: generateAuditRecommendations(budgetVariancePercentage, scheduleVarianceDays),
    };

    logger.log(`Final project audit completed for ${projectId}: ${performanceRating} performance`);

    return audit;
  } catch (error) {
    logger.error(`Failed to conduct final project audit: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Archives project documentation and records
 */
export async function archiveProjectDocumentation(
  projectId: string,
  documentCategories: Array<{
    category: string;
    documents: Array<{ name: string; url: string; type: string }>;
  }>,
  archiveLocation: string,
  retentionPeriodYears: number,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('archiveProjectDocumentation');

  try {
    const totalDocuments = documentCategories.reduce((sum, cat) => sum + cat.documents.length, 0);

    const archiveRecord = {
      projectId,
      documentCategories,
      archiveLocation,
      retentionPeriodYears,
      archiveDate: new Date(),
      expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + retentionPeriodYears)),
      totalDocuments,
      totalCategories: documentCategories.length,
      archiveStatus: 'COMPLETED',
    };

    logger.log(`Project documentation archived for ${projectId}: ${totalDocuments} documents in ${archiveLocation}`);

    return archiveRecord;
  } catch (error) {
    logger.error(`Failed to archive project documentation: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Captures lessons learned and best practices
 */
export async function captureLessonsLearned(
  projectId: string,
  successFactors: string[],
  challenges: string[],
  improvements: string[],
  bestPractices: string[],
  teamFeedback: Array<{ contributor: string; feedback: string }>,
  transaction?: Transaction,
): Promise<any> {
  const logger = new Logger('captureLessonsLearned');

  try {
    const lessonsLearned = {
      projectId,
      successFactors: successFactors || [],
      challenges: challenges || [],
      improvements: improvements || [],
      bestPractices: bestPractices || [],
      teamFeedback: teamFeedback || [],
      capturedDate: new Date(),
      status: 'DRAFT',
      reviewedBy: null,
      publishedDate: null,
    };

    const totalInsights =
      successFactors.length +
      challenges.length +
      improvements.length +
      bestPractices.length;

    logger.log(`Lessons learned captured for project ${projectId}: ${totalInsights} insights from ${teamFeedback.length} contributors`);

    return lessonsLearned;
  } catch (error) {
    logger.error(`Failed to capture lessons learned: ${error.message}`, error.stack);
    throw error;
  }
}

// =====================================================================
// HELPER FUNCTIONS
// =====================================================================

/**
 * Calculates performance rating based on variance metrics
 */
function calculatePerformanceRating(budgetVariancePercentage: number, scheduleVarianceDays: number): string {
  if (Math.abs(budgetVariancePercentage) <= 5 && Math.abs(scheduleVarianceDays) <= 7) {
    return 'EXCELLENT';
  } else if (Math.abs(budgetVariancePercentage) <= 10 && Math.abs(scheduleVarianceDays) <= 14) {
    return 'GOOD';
  } else if (Math.abs(budgetVariancePercentage) <= 15 && Math.abs(scheduleVarianceDays) <= 30) {
    return 'SATISFACTORY';
  } else {
    return 'NEEDS_IMPROVEMENT';
  }
}

/**
 * Generates audit recommendations based on variance analysis
 */
function generateAuditRecommendations(budgetVariancePercentage: number, scheduleVarianceDays: number): string[] {
  const recommendations: string[] = [];

  if (budgetVariancePercentage > 10) {
    recommendations.push('Implement more rigorous cost control measures');
    recommendations.push('Review and improve budget estimation processes');
    recommendations.push('Enhance change order management procedures');
  } else if (budgetVariancePercentage < -10) {
    recommendations.push('Review if scope was fully delivered despite under-budget performance');
    recommendations.push('Consider if cost savings can be applied to future projects');
  }

  if (scheduleVarianceDays > 14) {
    recommendations.push('Improve project timeline estimation methodology');
    recommendations.push('Implement better milestone tracking and early warning systems');
    recommendations.push('Review resource allocation efficiency');
  }

  if (recommendations.length === 0) {
    recommendations.push('Continue applying current project management practices');
    recommendations.push('Document successful strategies for future reference');
  }

  return recommendations;
}

/**
 * Service class for dependency injection
 */
@Injectable()
export class CapitalProjectsService {
  private readonly logger = new Logger(CapitalProjectsService.name);

  // Project Initiation and Planning
  async createCapitalProject(data: CreateCapitalProjectDto, transaction?: Transaction) {
    return createCapitalProject(data, transaction);
  }

  async generateProjectCharter(
    projectId: string,
    scope: string,
    objectives: string[],
    constraints: string[],
    assumptions: string[],
    transaction?: Transaction,
  ) {
    return generateProjectCharter(projectId, scope, objectives, constraints, assumptions, transaction);
  }

  async createWorkBreakdownStructure(
    projectId: string,
    phases: Array<{
      name: string;
      description: string;
      tasks: Array<{ name: string; estimatedHours: number; dependencies?: string[] }>;
    }>,
    transaction?: Transaction,
  ) {
    return createWorkBreakdownStructure(projectId, phases, transaction);
  }

  async performFeasibilityAnalysis(
    projectId: string,
    estimatedROI: number,
    estimatedPaybackPeriod: number,
    technicalFeasibility: number,
    operationalFeasibility: number,
    economicFeasibility: number,
    transaction?: Transaction,
  ) {
    return performFeasibilityAnalysis(
      projectId,
      estimatedROI,
      estimatedPaybackPeriod,
      technicalFeasibility,
      operationalFeasibility,
      economicFeasibility,
      transaction,
    );
  }

  async approveProject(
    projectId: string,
    approvedBy: string,
    approvalNotes: string,
    approvedBudget?: number,
    transaction?: Transaction,
  ) {
    return approveProject(projectId, approvedBy, approvalNotes, approvedBudget, transaction);
  }

  // Budget Management
  async allocateProjectBudget(projectId: string, budgetAllocations: ProjectBudgetDto[], transaction?: Transaction) {
    return allocateProjectBudget(projectId, budgetAllocations, transaction);
  }

  async trackProjectExpenditure(
    projectId: string,
    category: string,
    amount: number,
    description: string,
    expenseDate: Date,
    vendorName?: string,
    transaction?: Transaction,
  ) {
    return trackProjectExpenditure(projectId, category, amount, description, expenseDate, vendorName, transaction);
  }

  async generateBudgetForecast(projectId: string, forecastData: BudgetForecastDto, transaction?: Transaction) {
    return generateBudgetForecast(projectId, forecastData, transaction);
  }

  async analyzeBudgetStatus(
    projectId: string,
    totalBudget: number,
    budgetAllocations: Array<{
      category: string;
      allocated: number;
      spent: number;
      committed: number;
    }>,
    transaction?: Transaction,
  ) {
    return analyzeBudgetStatus(projectId, totalBudget, budgetAllocations, transaction);
  }

  async manageContingencyReserve(
    projectId: string,
    reserveAmount: number,
    action: 'ALLOCATE' | 'RELEASE' | 'ADJUST',
    reason: string,
    requestedBy: string,
    transaction?: Transaction,
  ) {
    return manageContingencyReserve(projectId, reserveAmount, action, reason, requestedBy, transaction);
  }

  // Milestone Tracking
  async createProjectMilestone(projectId: string, milestoneData: ProjectMilestoneDto, transaction?: Transaction) {
    return createProjectMilestone(projectId, milestoneData, transaction);
  }

  async updateMilestoneProgress(
    milestoneId: string,
    completionPercentage: number,
    statusUpdate: string,
    updatedBy: string,
    transaction?: Transaction,
  ) {
    return updateMilestoneProgress(milestoneId, completionPercentage, statusUpdate, updatedBy, transaction);
  }

  // Resource Allocation
  async allocateProjectResource(projectId: string, resourceData: ResourceAllocationDto, transaction?: Transaction) {
    return allocateProjectResource(projectId, resourceData, transaction);
  }

  // Cost Control
  async analyzeCostVariance(
    projectId: string,
    plannedCost: number,
    actualCost: number,
    earnedValue: number,
    transaction?: Transaction,
  ) {
    return analyzeCostVariance(projectId, plannedCost, actualCost, earnedValue, transaction);
  }

  // Change Orders
  async createChangeOrder(projectId: string, changeOrderData: ChangeOrderDto, transaction?: Transaction) {
    return createChangeOrder(projectId, changeOrderData, transaction);
  }

  // Risk Management
  async registerProjectRisk(projectId: string, riskData: ProjectRiskDto, transaction?: Transaction) {
    return registerProjectRisk(projectId, riskData, transaction);
  }

  // Stakeholder Communication
  async createStakeholderCommunication(
    projectId: string,
    communicationData: StakeholderCommunicationDto,
    transaction?: Transaction,
  ) {
    return createStakeholderCommunication(projectId, communicationData, transaction);
  }

  // Project Closeout
  async initiateProjectCloseout(projectId: string, closeoutData: ProjectCloseoutDto, transaction?: Transaction) {
    return initiateProjectCloseout(projectId, closeoutData, transaction);
  }

  async captureLessonsLearned(
    projectId: string,
    successFactors: string[],
    challenges: string[],
    improvements: string[],
    bestPractices: string[],
    teamFeedback: Array<{ contributor: string; feedback: string }>,
    transaction?: Transaction,
  ) {
    return captureLessonsLearned(
      projectId,
      successFactors,
      challenges,
      improvements,
      bestPractices,
      teamFeedback,
      transaction,
    );
  }
}
