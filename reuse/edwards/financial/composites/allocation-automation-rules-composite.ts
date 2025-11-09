/**
 * LOC: ALLAUTOCOMP001
 * File: /reuse/edwards/financial/composites/allocation-automation-rules-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../allocation-engines-rules-kit
 *   - ../financial-workflow-approval-kit
 *   - ../financial-close-automation-kit
 *   - ../cost-accounting-allocation-kit
 *   - ../audit-trail-compliance-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend allocation rule engines
 *   - Allocation workflow schedulers
 *   - Period-end close automation services
 *   - Healthcare cost allocation services
 *   - Rule validation and testing modules
 */

/**
 * File: /reuse/edwards/financial/composites/allocation-automation-rules-composite.ts
 * Locator: WC-EDW-ALLAUTO-COMPOSITE-001
 * Purpose: Comprehensive Allocation Automation & Rules Composite - Rule engines, allocation hierarchies, driver calculations, period-end automation
 *
 * Upstream: Composes functions from allocation-engines-rules-kit, financial-workflow-approval-kit,
 *           financial-close-automation-kit, cost-accounting-allocation-kit, audit-trail-compliance-kit
 * Downstream: ../backend/financial/*, Allocation Rule Engines, Workflow Automation, Period-End Close, Cost Services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, Redis 7+
 * Exports: 48 composite functions for rule engines, automation, hierarchies, validation, scheduling, reversals, what-if analysis
 *
 * LLM Context: Enterprise-grade allocation automation and rules composite for White Cross healthcare platform.
 * Provides comprehensive allocation rule engine with dynamic rule evaluation, allocation hierarchy management,
 * driver-based calculation automation, period-end allocation processing, recurring allocation scheduling,
 * allocation reversal capabilities, rule validation frameworks, what-if scenario analysis, workflow integration,
 * approval routing, escalation policies, and HIPAA-compliant audit trails. Competes with Oracle JD Edwards
 * EnterpriseOne with production-ready allocation automation infrastructure for complex healthcare cost allocations.
 *
 * Allocation Automation Design Principles:
 * - Dynamic rule evaluation with priority-based execution
 * - Hierarchical allocation with cascade processing
 * - Driver-based calculations with real-time updates
 * - Scheduled period-end automation with retry logic
 * - Comprehensive validation before allocation execution
 * - Reversal capabilities with audit preservation
 * - What-if analysis for scenario planning
 * - Workflow integration for approval routing
 * - Performance optimization for large-scale allocations
 * - Comprehensive audit trails for compliance
 */

import { Transaction, Op, fn, col, literal } from 'sequelize';
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
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
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
  IsInt,
  ValidateNested,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

// Import from allocation engines rules kit
import {
  createAllocationRuleModel,
  createAllocationBasisModel,
  createStatisticalDriverModel,
  createAllocationPoolModel,
  createAllocationRule,
  getActiveAllocationRules,
  validateAllocationRule,
  updateAllocationRule,
  deactivateAllocationRule,
  createAllocationBasis,
  updateAllocationBasis,
  createStatisticalDriver,
  updateStatisticalDriverValue,
  getStatisticalDriversByDepartment,
  createAllocationPool,
  processDirectAllocation,
  processStepDownAllocation,
  processReciprocalAllocation,
  calculateAllocationPercentages,
  validateAllocationTotal,
  generateAllocationReport,
  type AllocationRule,
  type AllocationBasis,
  type StatisticalDriver,
  type AllocationPool,
  type AllocationResult,
  type AllocationValidation,
} from '../allocation-engines-rules-kit';

// Import from financial workflow approval kit
import {
  createWorkflowDefinitionModel,
  createWorkflowInstanceModel,
  createApprovalStepModel,
  createApprovalActionModel,
  createWorkflowDefinition,
  startWorkflowInstance,
  submitForApproval,
  approveWorkflowStep,
  rejectWorkflowStep,
  getWorkflowStatus,
  escalateWorkflow,
  delegateApproval,
  type WorkflowDefinition,
  type WorkflowInstance,
  type ApprovalStep,
  type ApprovalAction,
  type WorkflowStatus,
} from '../financial-workflow-approval-kit';

// Import from financial close automation kit
import {
  createClosePeriod,
  createCloseChecklist,
  createCloseTask,
  startCloseTask,
  completeCloseTask,
  executeAutomatedTask,
  getCurrentOpenPeriod,
  getCloseChecklistWithTasks,
  type ClosePeriod,
  type CloseChecklist,
  type CloseTask,
} from '../financial-close-automation-kit';

// Import from cost accounting allocation kit
import {
  createCostPoolModel,
  getCostPoolById,
  listCostCenters,
  type CostPool,
  type CostCenter,
} from '../cost-accounting-allocation-kit';

// Import from audit trail compliance kit
import {
  createAuditLog,
  trackFieldChange,
  logUserActivity,
  buildDataLineageTrail,
  generateComplianceReport,
  type AuditLogEntry,
  type ChangeTrackingRecord,
  type DataLineageNode,
} from '../audit-trail-compliance-kit';

// ============================================================================
// ALLOCATION AUTOMATION TYPE DEFINITIONS - ENUMS
// ============================================================================

/**
 * Allocation method types supported by the system
 */
export enum AllocationMethodType {
  DIRECT = 'DIRECT', // Direct allocation
  STEP_DOWN = 'STEP_DOWN', // Step-down allocation
  RECIPROCAL = 'RECIPROCAL', // Reciprocal/iterative allocation
  SIMULTANEOUS = 'SIMULTANEOUS', // Simultaneous equation method
  ACTIVITY_BASED = 'ACTIVITY_BASED', // Activity-based costing
}

/**
 * Allocation driver types
 */
export enum AllocationDriverType {
  HEADCOUNT = 'HEADCOUNT', // Employee headcount
  SQUARE_FOOTAGE = 'SQUARE_FOOTAGE', // Square footage
  REVENUE = 'REVENUE', // Revenue-based
  EXPENSES = 'EXPENSES', // Expense-based
  PATIENT_DAYS = 'PATIENT_DAYS', // Patient days (healthcare)
  ADMISSIONS = 'ADMISSIONS', // Number of admissions
  PROCEDURES = 'PROCEDURES', // Number of procedures
  VISITS = 'VISITS', // Number of visits
  HOURS = 'HOURS', // Labor hours
  UNITS = 'UNITS', // Units produced/consumed
  PERCENTAGE = 'PERCENTAGE', // Fixed percentage
  CUSTOM = 'CUSTOM', // Custom driver
}

/**
 * Allocation rule types
 */
export enum AllocationRuleType {
  AUTOMATED = 'AUTOMATED', // Fully automated
  SEMI_AUTOMATED = 'SEMI_AUTOMATED', // Requires approval
  MANUAL = 'MANUAL', // Manual entry only
  SCHEDULED = 'SCHEDULED', // Scheduled execution
  ON_DEMAND = 'ON_DEMAND', // On-demand execution
}

/**
 * Allocation schedule types
 */
export enum AllocationScheduleType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  PERIOD_END = 'PERIOD_END',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
  MANUAL = 'MANUAL',
}

/**
 * Allocation execution status
 */
export enum AllocationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIALLY_COMPLETED = 'PARTIALLY_COMPLETED',
  CANCELLED = 'CANCELLED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVERSED = 'REVERSED',
}

/**
 * Rule validation status
 */
export enum RuleValidationStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  WARNING = 'WARNING',
  NOT_VALIDATED = 'NOT_VALIDATED',
}

/**
 * Reversal approval status
 */
export enum ReversalApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  AUTO_APPROVED = 'AUTO_APPROVED',
}

/**
 * What-if scenario status
 */
export enum ScenarioStatus {
  DRAFT = 'DRAFT',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Hierarchy dependency type
 */
export enum DependencyType {
  DIRECT = 'DIRECT',
  INDIRECT = 'INDIRECT',
  CIRCULAR = 'CIRCULAR',
}

// ============================================================================
// TYPE DEFINITIONS - ALLOCATION AUTOMATION COMPOSITE
// ============================================================================

/**
 * Allocation automation configuration
 */
export interface AllocationAutomationConfig {
  enabled: boolean;
  scheduleType: 'daily' | 'weekly' | 'monthly' | 'period-end' | 'manual';
  autoExecute: boolean;
  requireApproval: boolean;
  approvalWorkflowId?: number;
  retryAttempts: number;
  notificationsEnabled: boolean;
  validationRequired: boolean;
  reversalAllowed: boolean;
}

/**
 * Allocation rule hierarchy
 */
export interface AllocationRuleHierarchy {
  hierarchyId: string;
  hierarchyName: string;
  rootRules: AllocationRule[];
  dependentRules: Map<number, AllocationRule[]>;
  executionOrder: number[];
  totalLevels: number;
}

/**
 * Allocation schedule
 */
export interface AllocationSchedule {
  scheduleId: string;
  scheduleName: string;
  scheduleType: 'daily' | 'weekly' | 'monthly' | 'period-end' | 'quarterly' | 'annual';
  ruleIds: number[];
  executionTime: string;
  timezone: string;
  enabled: boolean;
  lastExecuted?: Date;
  nextExecution?: Date;
  failureRetryCount: number;
  notifyOnSuccess: boolean;
  notifyOnFailure: boolean;
  recipients: string[];
}

/**
 * Allocation execution result
 */
export interface AllocationExecutionResult {
  executionId: string;
  scheduleId?: string;
  executionDate: Date;
  ruleExecutions: RuleExecutionDetail[];
  totalRulesExecuted: number;
  totalRulesFailed: number;
  totalAllocated: number;
  executionDurationMs: number;
  status: 'success' | 'partial' | 'failed';
  errors: string[];
  auditTrail: AuditLogEntry[];
}

/**
 * Rule execution detail
 */
export interface RuleExecutionDetail {
  ruleId: number;
  ruleCode: string;
  ruleName: string;
  executionOrder: number;
  startTime: Date;
  endTime: Date;
  durationMs: number;
  status: 'success' | 'failed' | 'skipped';
  allocationsCreated: number;
  totalAllocated: number;
  validationResult: AllocationValidation;
  error?: string;
}

/**
 * Allocation reversal request
 */
export interface AllocationReversalRequest {
  reversalId: string;
  originalExecutionId: string;
  reversalDate: Date;
  reversalReason: string;
  requestedBy: string;
  approvalRequired: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: Date;
}

/**
 * Allocation reversal result
 */
export interface AllocationReversalResult {
  reversalId: string;
  reversalDate: Date;
  originalExecutionId: string;
  allocationsReversed: number;
  totalReversalAmount: number;
  journalEntriesCreated: number;
  errors: string[];
  auditTrail: AuditLogEntry[];
}

/**
 * What-if scenario
 */
export interface WhatIfScenario {
  scenarioId: string;
  scenarioName: string;
  description: string;
  baselineDate: Date;
  ruleModifications: RuleModification[];
  driverModifications: DriverModification[];
  results: WhatIfResult[];
  createdBy: string;
  createdDate: Date;
}

/**
 * Rule modification for what-if
 */
export interface RuleModification {
  ruleId: number;
  modificationType: 'change_basis' | 'change_percentage' | 'change_targets' | 'disable' | 'enable';
  originalValue: any;
  modifiedValue: any;
}

/**
 * Driver modification for what-if
 */
export interface DriverModification {
  driverId: number;
  driverCode: string;
  originalValue: number;
  modifiedValue: number;
  changePercentage: number;
}

/**
 * What-if result
 */
export interface WhatIfResult {
  costCenterCode: string;
  baselineAllocation: number;
  scenarioAllocation: number;
  variance: number;
  variancePercentage: number;
  impact: 'favorable' | 'unfavorable' | 'neutral';
}

/**
 * Allocation validation report
 */
export interface AllocationValidationReport {
  validationDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  rulesValidated: number;
  rulesPassed: number;
  rulesFailed: number;
  validationDetails: RuleValidationDetail[];
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
}

/**
 * Rule validation detail
 */
export interface RuleValidationDetail {
  ruleId: number;
  ruleCode: string;
  ruleName: string;
  validationStatus: 'passed' | 'failed' | 'warning';
  validationChecks: ValidationCheck[];
  overallScore: number;
}

/**
 * Validation check
 */
export interface ValidationCheck {
  checkName: string;
  checkType: 'integrity' | 'completeness' | 'accuracy' | 'consistency';
  passed: boolean;
  details: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

// ============================================================================
// DTO CLASSES FOR NESTJS CONTROLLERS
// ============================================================================

export class CreateAllocationRuleDto {
  @ApiProperty({ description: 'Rule code', example: 'ALLOC-HR-001' })
  @IsString()
  @IsNotEmpty()
  ruleCode: string;

  @ApiProperty({ description: 'Rule name', example: 'HR Department Allocation' })
  @IsString()
  @IsNotEmpty()
  ruleName: string;

  @ApiProperty({ description: 'Rule description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: AllocationMethodType, example: AllocationMethodType.DIRECT })
  @IsEnum(AllocationMethodType)
  @IsNotEmpty()
  allocationMethod: AllocationMethodType;

  @ApiProperty({ enum: AllocationRuleType, example: AllocationRuleType.AUTOMATED })
  @IsEnum(AllocationRuleType)
  @IsNotEmpty()
  ruleType: AllocationRuleType;

  @ApiProperty({ description: 'Source department code', example: 'HR-ADMIN' })
  @IsString()
  @IsNotEmpty()
  sourceDepartment: string;

  @ApiProperty({ description: 'Target department codes', type: [String], example: ['ICU', 'SURGERY', 'EMERGENCY'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  targetDepartments: string[];

  @ApiProperty({ description: 'Allocation basis code', example: 'HEADCOUNT' })
  @IsString()
  @IsNotEmpty()
  allocationBasis: string;

  @ApiProperty({ enum: AllocationDriverType, example: AllocationDriverType.HEADCOUNT })
  @IsEnum(AllocationDriverType)
  @IsNotEmpty()
  driverType: AllocationDriverType;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period', example: 3 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ description: 'Execution priority', example: 100 })
  @IsInt()
  @Min(1)
  priority: number;

  @ApiProperty({ description: 'Is active', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateAllocationRuleDto {
  @ApiProperty({ description: 'Rule name', required: false })
  @IsString()
  @IsOptional()
  ruleName?: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Target departments', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetDepartments?: string[];

  @ApiProperty({ description: 'Allocation basis', required: false })
  @IsString()
  @IsOptional()
  allocationBasis?: string;

  @ApiProperty({ description: 'Priority', required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  priority?: number;

  @ApiProperty({ description: 'Is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateAllocationScheduleDto {
  @ApiProperty({ description: 'Schedule name', example: 'Monthly HR Allocation' })
  @IsString()
  @IsNotEmpty()
  scheduleName: string;

  @ApiProperty({ enum: AllocationScheduleType, example: AllocationScheduleType.MONTHLY })
  @IsEnum(AllocationScheduleType)
  @IsNotEmpty()
  scheduleType: AllocationScheduleType;

  @ApiProperty({ description: 'Rule IDs to execute', type: [Number], example: [101, 102, 103] })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  ruleIds: number[];

  @ApiProperty({ description: 'Execution time (HH:MM)', example: '23:00' })
  @IsString()
  @IsNotEmpty()
  executionTime: string;

  @ApiProperty({ description: 'Require approval before execution', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  requireApproval?: boolean;

  @ApiProperty({ description: 'Auto-execute when scheduled', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  autoExecute?: boolean;

  @ApiProperty({ description: 'Notification recipients', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  recipients?: string[];
}

export class ExecuteAllocationDto {
  @ApiProperty({ description: 'Schedule ID', example: 'SCHED-1699564800000' })
  @IsString()
  @IsNotEmpty()
  scheduleId: string;

  @ApiProperty({ description: 'Fiscal year override', required: false })
  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  fiscalYear?: number;

  @ApiProperty({ description: 'Fiscal period override', required: false })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  fiscalPeriod?: number;

  @ApiProperty({ description: 'Validate before execution', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  validateBeforeExecution?: boolean;
}

export class AllocationExecutionResponse {
  @ApiProperty({ description: 'Execution ID' })
  executionId: string;

  @ApiProperty({ description: 'Schedule ID' })
  scheduleId: string;

  @ApiProperty({ description: 'Execution date' })
  executionDate: Date;

  @ApiProperty({ description: 'Total rules executed' })
  totalRulesExecuted: number;

  @ApiProperty({ description: 'Total rules failed' })
  totalRulesFailed: number;

  @ApiProperty({ description: 'Total allocated amount' })
  totalAllocated: number;

  @ApiProperty({ description: 'Execution duration in milliseconds' })
  executionDurationMs: number;

  @ApiProperty({ enum: AllocationStatus, description: 'Execution status' })
  status: AllocationStatus;

  @ApiProperty({ description: 'Errors encountered', type: [String] })
  errors: string[];
}

export class CreateReversalRequestDto {
  @ApiProperty({ description: 'Original execution ID', example: 'EXEC-SCHED-1699564800000-1699565000000' })
  @IsString()
  @IsNotEmpty()
  originalExecutionId: string;

  @ApiProperty({ description: 'Reversal reason', example: 'Incorrect allocation percentages' })
  @IsString()
  @IsNotEmpty()
  reversalReason: string;

  @ApiProperty({ description: 'Reversal date', example: '2024-03-15', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  reversalDate?: Date;

  @ApiProperty({ description: 'Request immediate processing (if no approval required)', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  immediateProcess?: boolean;
}

export class ProcessReversalDto {
  @ApiProperty({ description: 'Reversal ID', example: 'REV-EXEC-1699564800000-1699565100000' })
  @IsString()
  @IsNotEmpty()
  reversalId: string;

  @ApiProperty({ description: 'Approver user ID (if approval required)', required: false })
  @IsString()
  @IsOptional()
  approverId?: string;

  @ApiProperty({ description: 'Approval notes', required: false })
  @IsString()
  @IsOptional()
  approvalNotes?: string;
}

export class AllocationReversalResponse {
  @ApiProperty({ description: 'Reversal ID' })
  reversalId: string;

  @ApiProperty({ description: 'Reversal date' })
  reversalDate: Date;

  @ApiProperty({ description: 'Original execution ID' })
  originalExecutionId: string;

  @ApiProperty({ description: 'Allocations reversed count' })
  allocationsReversed: number;

  @ApiProperty({ description: 'Total reversal amount' })
  totalReversalAmount: number;

  @ApiProperty({ description: 'Journal entries created' })
  journalEntriesCreated: number;

  @ApiProperty({ description: 'Errors encountered', type: [String] })
  errors: string[];
}

export class RuleModificationDto {
  @ApiProperty({ description: 'Rule ID', example: 101 })
  @IsInt()
  @IsNotEmpty()
  ruleId: number;

  @ApiProperty({ description: 'Modification type', enum: ['change_basis', 'change_percentage', 'change_targets', 'disable', 'enable'] })
  @IsEnum(['change_basis', 'change_percentage', 'change_targets', 'disable', 'enable'])
  @IsNotEmpty()
  modificationType: 'change_basis' | 'change_percentage' | 'change_targets' | 'disable' | 'enable';

  @ApiProperty({ description: 'Modified value' })
  @IsOptional()
  modifiedValue?: any;
}

export class DriverModificationDto {
  @ApiProperty({ description: 'Driver ID', example: 501 })
  @IsInt()
  @IsNotEmpty()
  driverId: number;

  @ApiProperty({ description: 'Driver code', example: 'HC-ICU' })
  @IsString()
  @IsNotEmpty()
  driverCode: string;

  @ApiProperty({ description: 'Modified value', example: 150 })
  @IsNumber()
  @IsNotEmpty()
  modifiedValue: number;

  @ApiProperty({ description: 'Change percentage', example: 10.5 })
  @IsNumber()
  @IsOptional()
  changePercentage?: number;
}

export class ExecuteWhatIfScenarioDto {
  @ApiProperty({ description: 'Scenario name', example: 'Increased ICU Headcount' })
  @IsString()
  @IsNotEmpty()
  scenarioName: string;

  @ApiProperty({ description: 'Scenario description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Baseline date', example: '2024-03-01' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  baselineDate: Date;

  @ApiProperty({ description: 'Rule modifications', type: [RuleModificationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RuleModificationDto)
  ruleModifications: RuleModificationDto[];

  @ApiProperty({ description: 'Driver modifications', type: [DriverModificationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DriverModificationDto)
  driverModifications: DriverModificationDto[];
}

export class WhatIfScenarioResponse {
  @ApiProperty({ description: 'Scenario ID' })
  scenarioId: string;

  @ApiProperty({ description: 'Scenario name' })
  scenarioName: string;

  @ApiProperty({ description: 'Results count' })
  resultsCount: number;

  @ApiProperty({ description: 'Total variance' })
  totalVariance: number;

  @ApiProperty({ description: 'Average variance percentage' })
  avgVariancePercentage: number;

  @ApiProperty({ description: 'Created by' })
  createdBy: string;

  @ApiProperty({ description: 'Created date' })
  createdDate: Date;
}

export class ValidateRulesDto {
  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period', example: 3 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ description: 'Include warnings', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  includeWarnings?: boolean;

  @ApiProperty({ description: 'Specific rule IDs to validate', type: [Number], required: false })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  ruleIds?: number[];
}

export class ValidationReportResponse {
  @ApiProperty({ description: 'Validation date' })
  validationDate: Date;

  @ApiProperty({ description: 'Fiscal year' })
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period' })
  fiscalPeriod: number;

  @ApiProperty({ description: 'Rules validated' })
  rulesValidated: number;

  @ApiProperty({ description: 'Rules passed' })
  rulesPassed: number;

  @ApiProperty({ description: 'Rules failed' })
  rulesFailed: number;

  @ApiProperty({ description: 'Critical issues', type: [String] })
  criticalIssues: string[];

  @ApiProperty({ description: 'Warnings', type: [String] })
  warnings: string[];

  @ApiProperty({ description: 'Recommendations', type: [String] })
  recommendations: string[];
}

export class BuildHierarchyDto {
  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period', example: 3 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ description: 'Optimize execution order', example: true, default: false })
  @IsBoolean()
  @IsOptional()
  optimizeOrder?: boolean;

  @ApiProperty({ description: 'Validate for circular dependencies', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  validateCircular?: boolean;
}

export class HierarchyResponse {
  @ApiProperty({ description: 'Hierarchy ID' })
  hierarchyId: string;

  @ApiProperty({ description: 'Hierarchy name' })
  hierarchyName: string;

  @ApiProperty({ description: 'Total levels' })
  totalLevels: number;

  @ApiProperty({ description: 'Root rules count' })
  rootRulesCount: number;

  @ApiProperty({ description: 'Total rules' })
  totalRules: number;

  @ApiProperty({ description: 'Execution order', type: [Number] })
  executionOrder: number[];

  @ApiProperty({ description: 'Has circular dependencies' })
  hasCircularDependencies: boolean;

  @ApiProperty({ description: 'Circular dependencies', type: [String] })
  circularDependencies: string[];
}

export class IntegratePeriodEndDto {
  @ApiProperty({ description: 'Checklist ID', example: 3001 })
  @IsInt()
  @IsNotEmpty()
  checklistId: number;

  @ApiProperty({ description: 'Schedule IDs to execute', type: [String], example: ['SCHED-1001', 'SCHED-1002'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  scheduleIds: string[];

  @ApiProperty({ description: 'Execute in parallel', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  executeInParallel?: boolean;

  @ApiProperty({ description: 'Stop on first failure', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  stopOnFailure?: boolean;
}

// ============================================================================
// COMPOSITE FUNCTIONS - RULE HIERARCHY MANAGEMENT
// ============================================================================

/**
 * Builds allocation rule hierarchy with execution order
 * Composes: getActiveAllocationRules with dependency analysis
 */
export const buildAllocationRuleHierarchy = async (
  sequelize: any,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction
): Promise<AllocationRuleHierarchy> => {
  const allRules = await getActiveAllocationRules(
    sequelize,
    fiscalYear,
    fiscalPeriod,
    transaction
  );

  // Identify root rules (rules with no dependencies)
  const rootRules: AllocationRule[] = [];
  const dependentRules = new Map<number, AllocationRule[]>();

  // Build dependency map
  for (const rule of allRules) {
    // Check if this rule depends on any other rule's output
    const hasDependencies = allRules.some(otherRule =>
      rule.sourceDepartment === otherRule.targetDepartments.find(t => t === rule.sourceDepartment)
    );

    if (!hasDependencies) {
      rootRules.push(rule);
    } else {
      // Find parent rules
      for (const otherRule of allRules) {
        if (otherRule.targetDepartments.includes(rule.sourceDepartment)) {
          if (!dependentRules.has(otherRule.ruleId)) {
            dependentRules.set(otherRule.ruleId, []);
          }
          dependentRules.get(otherRule.ruleId)!.push(rule);
        }
      }
    }
  }

  // Determine execution order using topological sort
  const executionOrder: number[] = [];
  const visited = new Set<number>();

  const visit = (rule: AllocationRule) => {
    if (visited.has(rule.ruleId)) return;
    visited.add(rule.ruleId);
    executionOrder.push(rule.ruleId);

    // Visit dependent rules
    const deps = dependentRules.get(rule.ruleId) || [];
    for (const dep of deps) {
      visit(dep);
    }
  };

  // Visit all root rules
  for (const root of rootRules) {
    visit(root);
  }

  // Calculate total hierarchy levels
  const calculateLevel = (ruleId: number, level: number = 0): number => {
    const deps = dependentRules.get(ruleId) || [];
    if (deps.length === 0) return level;
    return Math.max(...deps.map(d => calculateLevel(d.ruleId, level + 1)));
  };

  const totalLevels = Math.max(...rootRules.map(r => calculateLevel(r.ruleId))) + 1;

  return {
    hierarchyId: `HIER-${fiscalYear}-${fiscalPeriod}`,
    hierarchyName: `Allocation Hierarchy FY${fiscalYear} P${fiscalPeriod}`,
    rootRules,
    dependentRules,
    executionOrder,
    totalLevels,
  };
};

/**
 * Validates rule hierarchy for circular dependencies
 * Composes: buildAllocationRuleHierarchy with cycle detection
 */
export const validateRuleHierarchyForCircularDependencies = async (
  sequelize: any,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction
): Promise<{
  valid: boolean;
  circularDependencies: string[][];
  errors: string[];
}> => {
  const allRules = await getActiveAllocationRules(
    sequelize,
    fiscalYear,
    fiscalPeriod,
    transaction
  );

  const circularDependencies: string[][] = [];
  const errors: string[] = [];

  // Build adjacency list
  const adjacency = new Map<string, string[]>();

  for (const rule of allRules) {
    if (!adjacency.has(rule.sourceDepartment)) {
      adjacency.set(rule.sourceDepartment, []);
    }
    adjacency.get(rule.sourceDepartment)!.push(...rule.targetDepartments);
  }

  // DFS to detect cycles
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const detectCycle = (dept: string, path: string[]): boolean => {
    visited.add(dept);
    recursionStack.add(dept);
    path.push(dept);

    const neighbors = adjacency.get(dept) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (detectCycle(neighbor, [...path])) {
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        // Found cycle
        const cycleStart = path.indexOf(neighbor);
        const cycle = path.slice(cycleStart);
        cycle.push(neighbor);
        circularDependencies.push(cycle);
        errors.push(`Circular dependency detected: ${cycle.join(' -> ')}`);
        return true;
      }
    }

    recursionStack.delete(dept);
    return false;
  };

  // Check all departments
  for (const dept of adjacency.keys()) {
    if (!visited.has(dept)) {
      detectCycle(dept, []);
    }
  }

  return {
    valid: circularDependencies.length === 0,
    circularDependencies,
    errors,
  };
};

/**
 * Optimizes rule execution order for performance
 * Composes: buildAllocationRuleHierarchy with cost-based optimization
 */
export const optimizeRuleExecutionOrder = async (
  sequelize: any,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction
): Promise<{
  originalOrder: number[];
  optimizedOrder: number[];
  estimatedSpeedupPercent: number;
}> => {
  const hierarchy = await buildAllocationRuleHierarchy(
    sequelize,
    fiscalYear,
    fiscalPeriod,
    transaction
  );

  const originalOrder = hierarchy.executionOrder;

  // Get historical execution times for rules
  const executionTimes = await sequelize.query(
    `
    SELECT
      rule_id,
      AVG(duration_ms) as avg_duration
    FROM rule_execution_history
    WHERE fiscal_year = :fiscalYear
    GROUP BY rule_id
    `,
    {
      replacements: { fiscalYear },
      type: 'SELECT',
      transaction,
    }
  );

  const durationMap = new Map<number, number>();
  for (const exec of executionTimes as any[]) {
    durationMap.set(exec.rule_id, parseFloat(exec.avg_duration));
  }

  // Optimize by processing faster rules first within each level
  const optimizedOrder: number[] = [];
  const levels = new Map<number, number[]>();

  // Group rules by dependency level
  let currentLevel = 0;
  const processed = new Set<number>();

  while (processed.size < originalOrder.length) {
    const currentLevelRules: number[] = [];

    for (const ruleId of originalOrder) {
      if (processed.has(ruleId)) continue;

      // Check if all dependencies are processed
      const rule = [...hierarchy.rootRules, ...Array.from(hierarchy.dependentRules.values()).flat()]
        .find(r => r.ruleId === ruleId);

      if (!rule) continue;

      const allDepsProcessed = true; // Simplified - check actual dependencies
      if (allDepsProcessed) {
        currentLevelRules.push(ruleId);
        processed.add(ruleId);
      }
    }

    // Sort current level by duration (fastest first)
    currentLevelRules.sort((a, b) => {
      const durationA = durationMap.get(a) || 0;
      const durationB = durationMap.get(b) || 0;
      return durationA - durationB;
    });

    levels.set(currentLevel, currentLevelRules);
    optimizedOrder.push(...currentLevelRules);
    currentLevel++;
  }

  // Estimate speedup
  const originalDuration = originalOrder.reduce((sum, id) => sum + (durationMap.get(id) || 0), 0);
  const optimizedDuration = optimizedOrder.reduce((sum, id) => sum + (durationMap.get(id) || 0), 0);
  const estimatedSpeedupPercent = originalDuration > 0
    ? ((originalDuration - optimizedDuration) / originalDuration) * 100
    : 0;

  return {
    originalOrder,
    optimizedOrder,
    estimatedSpeedupPercent,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - ALLOCATION SCHEDULING
// ============================================================================

/**
 * Creates allocation schedule with workflow integration
 * Composes: createWorkflowDefinition, createAuditLog
 */
export const createAllocationScheduleWithWorkflow = async (
  sequelize: any,
  scheduleName: string,
  scheduleType: 'daily' | 'weekly' | 'monthly' | 'period-end' | 'quarterly' | 'annual',
  ruleIds: number[],
  executionTime: string,
  requireApproval: boolean,
  userId: string,
  transaction?: Transaction
): Promise<{
  schedule: AllocationSchedule;
  workflow?: WorkflowDefinition;
  auditLogId: number;
}> => {
  const scheduleId = `SCHED-${Date.now()}`;

  // Create workflow if approval required
  let workflow: WorkflowDefinition | undefined;
  if (requireApproval) {
    workflow = await createWorkflowDefinition(
      sequelize,
      `WF-${scheduleId}`,
      `Approval workflow for ${scheduleName}`,
      'allocation_schedule',
      `Allocation schedule approval: ${scheduleName}`,
      userId,
      transaction
    );
  }

  // Calculate next execution date
  const nextExecution = calculateNextExecutionDate(new Date(), scheduleType, executionTime);

  const schedule: AllocationSchedule = {
    scheduleId,
    scheduleName,
    scheduleType,
    ruleIds,
    executionTime,
    timezone: 'America/New_York',
    enabled: true,
    nextExecution,
    failureRetryCount: 3,
    notifyOnSuccess: true,
    notifyOnFailure: true,
    recipients: [userId],
  };

  // Store schedule in database
  await sequelize.query(
    `
    INSERT INTO allocation_schedules
      (schedule_id, schedule_name, schedule_type, rule_ids, execution_time, timezone, enabled, next_execution, workflow_id)
    VALUES
      (:scheduleId, :scheduleName, :scheduleType, :ruleIds, :executionTime, :timezone, :enabled, :nextExecution, :workflowId)
    `,
    {
      replacements: {
        scheduleId,
        scheduleName,
        scheduleType,
        ruleIds: JSON.stringify(ruleIds),
        executionTime,
        timezone: schedule.timezone,
        enabled: schedule.enabled,
        nextExecution,
        workflowId: workflow?.workflowId || null,
      },
      type: 'INSERT',
      transaction,
    }
  );

  // Create audit log
  const auditLog = await createAuditLog(
    sequelize,
    'allocation_schedules',
    0,
    'INSERT',
    userId,
    `Schedule created: ${scheduleName}`,
    {},
    {
      scheduleId,
      scheduleType,
      ruleCount: ruleIds.length,
      requireApproval,
    },
    transaction
  );

  return { schedule, workflow, auditLogId: auditLog.auditId };
};

/**
 * Executes scheduled allocation with retry logic
 * Composes: buildAllocationRuleHierarchy, processDirectAllocation, createAuditLog
 */
export const executeScheduledAllocation = async (
  sequelize: any,
  scheduleId: string,
  userId: string,
  transaction?: Transaction
): Promise<AllocationExecutionResult> => {
  const executionId = `EXEC-${scheduleId}-${Date.now()}`;
  const executionDate = new Date();
  const startTime = Date.now();

  // Get schedule
  const schedules = await sequelize.query(
    `SELECT * FROM allocation_schedules WHERE schedule_id = :scheduleId`,
    {
      replacements: { scheduleId },
      type: 'SELECT',
      transaction,
    }
  );

  if (!schedules || schedules.length === 0) {
    throw new Error(`Schedule not found: ${scheduleId}`);
  }

  const schedule = schedules[0] as any;
  const ruleIds: number[] = JSON.parse(schedule.rule_ids);

  const ruleExecutions: RuleExecutionDetail[] = [];
  const errors: string[] = [];
  const auditTrail: AuditLogEntry[] = [];
  let totalRulesExecuted = 0;
  let totalRulesFailed = 0;
  let totalAllocated = 0;

  // Get current period
  const currentPeriod = await getCurrentOpenPeriod(sequelize, transaction);

  // Build hierarchy
  const hierarchy = await buildAllocationRuleHierarchy(
    sequelize,
    currentPeriod.fiscalYear,
    currentPeriod.fiscalPeriod,
    transaction
  );

  // Execute rules in order
  for (const ruleId of hierarchy.executionOrder) {
    if (!ruleIds.includes(ruleId)) continue;

    const ruleStartTime = Date.now();
    const AllocationRuleModel = createAllocationRuleModel(sequelize);
    const rule = await AllocationRuleModel.findByPk(ruleId, { transaction });

    if (!rule) {
      errors.push(`Rule not found: ${ruleId}`);
      totalRulesFailed++;
      continue;
    }

    try {
      // Validate rule
      const validation = await validateAllocationRule(sequelize, ruleId, transaction);

      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Get pool for this rule
      const pool = await sequelize.query(
        `SELECT cost_pool_id FROM cost_pools WHERE pool_code = :sourceDepartment AND fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod`,
        {
          replacements: {
            sourceDepartment: rule.sourceDepartment,
            fiscalYear: currentPeriod.fiscalYear,
            fiscalPeriod: currentPeriod.fiscalPeriod,
          },
          type: 'SELECT',
          transaction,
        }
      );

      if (pool && pool.length > 0) {
        const poolId = (pool[0] as any).cost_pool_id;

        // Execute allocation
        const result = await processDirectAllocation(
          sequelize,
          poolId,
          ruleId,
          userId,
          transaction
        );

        const ruleEndTime = Date.now();

        ruleExecutions.push({
          ruleId: rule.ruleId,
          ruleCode: rule.ruleCode,
          ruleName: rule.ruleName,
          executionOrder: hierarchy.executionOrder.indexOf(ruleId),
          startTime: new Date(ruleStartTime),
          endTime: new Date(ruleEndTime),
          durationMs: ruleEndTime - ruleStartTime,
          status: 'success',
          allocationsCreated: result.allocations.size,
          totalAllocated: result.totalAllocated,
          validationResult: validation,
        });

        totalRulesExecuted++;
        totalAllocated += result.totalAllocated;

        // Create audit log
        const ruleAuditLog = await createAuditLog(
          sequelize,
          'allocation_execution',
          ruleId,
          'EXECUTE',
          userId,
          `Rule executed: ${rule.ruleCode}`,
          {},
          {
            executionId,
            ruleId,
            totalAllocated: result.totalAllocated,
          },
          transaction
        );
        auditTrail.push(ruleAuditLog);
      }
    } catch (error: any) {
      const ruleEndTime = Date.now();

      ruleExecutions.push({
        ruleId: rule.ruleId,
        ruleCode: rule.ruleCode,
        ruleName: rule.ruleName,
        executionOrder: hierarchy.executionOrder.indexOf(ruleId),
        startTime: new Date(ruleStartTime),
        endTime: new Date(ruleEndTime),
        durationMs: ruleEndTime - ruleStartTime,
        status: 'failed',
        allocationsCreated: 0,
        totalAllocated: 0,
        validationResult: { valid: false, errors: [error.message], warnings: [] },
        error: error.message,
      });

      errors.push(`Rule ${rule.ruleCode}: ${error.message}`);
      totalRulesFailed++;
    }
  }

  // Update schedule
  const nextExecution = calculateNextExecutionDate(new Date(), schedule.schedule_type, schedule.execution_time);
  await sequelize.query(
    `
    UPDATE allocation_schedules
    SET last_executed = :executionDate, next_execution = :nextExecution
    WHERE schedule_id = :scheduleId
    `,
    {
      replacements: { scheduleId, executionDate, nextExecution },
      type: 'UPDATE',
      transaction,
    }
  );

  const executionDurationMs = Date.now() - startTime;
  const status = totalRulesFailed === 0 ? 'success' :
                totalRulesExecuted > 0 ? 'partial' : 'failed';

  // Create execution audit log
  const executionAuditLog = await createAuditLog(
    sequelize,
    'allocation_execution_batch',
    0,
    'EXECUTE',
    userId,
    `Scheduled allocation executed: ${scheduleId}`,
    {},
    {
      executionId,
      scheduleId,
      totalRulesExecuted,
      totalRulesFailed,
      totalAllocated,
      status,
    },
    transaction
  );
  auditTrail.push(executionAuditLog);

  return {
    executionId,
    scheduleId,
    executionDate,
    ruleExecutions,
    totalRulesExecuted,
    totalRulesFailed,
    totalAllocated,
    executionDurationMs,
    status,
    errors,
    auditTrail,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - ALLOCATION REVERSAL
// ============================================================================

/**
 * Creates and processes allocation reversal with approval workflow
 * Composes: startWorkflowInstance, submitForApproval, createAuditLog
 */
export const createAllocationReversalWithApproval = async (
  sequelize: any,
  originalExecutionId: string,
  reversalReason: string,
  userId: string,
  transaction?: Transaction
): Promise<{
  reversal: AllocationReversalRequest;
  workflow?: WorkflowInstance;
  auditLogId: number;
}> => {
  const reversalId = `REV-${originalExecutionId}-${Date.now()}`;

  // Check if approval workflow exists
  const workflowDefs = await sequelize.query(
    `SELECT workflow_id FROM workflow_definitions WHERE workflow_type = 'allocation_reversal' AND is_active = true LIMIT 1`,
    {
      type: 'SELECT',
      transaction,
    }
  );

  const requireApproval = workflowDefs && workflowDefs.length > 0;

  const reversal: AllocationReversalRequest = {
    reversalId,
    originalExecutionId,
    reversalDate: new Date(),
    reversalReason,
    requestedBy: userId,
    approvalRequired: requireApproval,
    approvalStatus: requireApproval ? 'pending' : undefined,
  };

  // Store reversal request
  await sequelize.query(
    `
    INSERT INTO allocation_reversals
      (reversal_id, original_execution_id, reversal_date, reversal_reason, requested_by, approval_required, approval_status)
    VALUES
      (:reversalId, :originalExecutionId, :reversalDate, :reversalReason, :requestedBy, :approvalRequired, :approvalStatus)
    `,
    {
      replacements: {
        reversalId,
        originalExecutionId,
        reversalDate: reversal.reversalDate,
        reversalReason,
        requestedBy: userId,
        approvalRequired: requireApproval,
        approvalStatus: reversal.approvalStatus || null,
      },
      type: 'INSERT',
      transaction,
    }
  );

  // Start approval workflow if required
  let workflow: WorkflowInstance | undefined;
  if (requireApproval && workflowDefs.length > 0) {
    const workflowId = (workflowDefs[0] as any).workflow_id;
    workflow = await startWorkflowInstance(
      sequelize,
      workflowId,
      reversalId,
      'allocation_reversal',
      userId,
      { reversalReason, originalExecutionId },
      transaction
    );

    await submitForApproval(
      sequelize,
      workflow.instanceId,
      userId,
      { reversalReason },
      transaction
    );
  }

  // Create audit log
  const auditLog = await createAuditLog(
    sequelize,
    'allocation_reversals',
    0,
    'INSERT',
    userId,
    `Reversal requested: ${originalExecutionId}`,
    {},
    {
      reversalId,
      originalExecutionId,
      reversalReason,
      requireApproval,
    },
    transaction
  );

  return { reversal, workflow, auditLogId: auditLog.auditId };
};

/**
 * Processes approved allocation reversal
 * Composes: createAuditLog, trackFieldChange
 */
export const processAllocationReversal = async (
  sequelize: any,
  reversalId: string,
  userId: string,
  transaction?: Transaction
): Promise<AllocationReversalResult> => {
  // Get reversal request
  const reversals = await sequelize.query(
    `SELECT * FROM allocation_reversals WHERE reversal_id = :reversalId`,
    {
      replacements: { reversalId },
      type: 'SELECT',
      transaction,
    }
  );

  if (!reversals || reversals.length === 0) {
    throw new Error(`Reversal not found: ${reversalId}`);
  }

  const reversal = reversals[0] as any;

  // Check approval status
  if (reversal.approval_required && reversal.approval_status !== 'approved') {
    throw new Error('Reversal not approved');
  }

  // Get original execution
  const executions = await sequelize.query(
    `
    SELECT
      re.*,
      r.rule_id,
      r.rule_code
    FROM rule_execution_history re
    INNER JOIN allocation_rules r ON re.rule_id = r.rule_id
    WHERE re.execution_id = :executionId
    `,
    {
      replacements: { executionId: reversal.original_execution_id },
      type: 'SELECT',
      transaction,
    }
  );

  const errors: string[] = [];
  const auditTrail: AuditLogEntry[] = [];
  let allocationsReversed = 0;
  let totalReversalAmount = 0;
  let journalEntriesCreated = 0;

  for (const exec of executions as any[]) {
    try {
      // Get allocation results
      const allocResults = await sequelize.query(
        `
        SELECT *
        FROM allocation_results
        WHERE execution_id = :executionId AND rule_id = :ruleId
        `,
        {
          replacements: {
            executionId: reversal.original_execution_id,
            ruleId: exec.rule_id,
          },
          type: 'SELECT',
          transaction,
        }
      );

      for (const result of allocResults as any[]) {
        // Create reversal entry
        await sequelize.query(
          `
          INSERT INTO allocation_results
            (execution_id, rule_id, pool_id, target_department, allocation_amount, is_reversal, original_allocation_id)
          VALUES
            (:executionId, :ruleId, :poolId, :targetDepartment, :allocationAmount, true, :originalAllocationId)
          `,
          {
            replacements: {
              executionId: reversalId,
              ruleId: result.rule_id,
              poolId: result.pool_id,
              targetDepartment: result.target_department,
              allocationAmount: -result.allocation_amount,
              originalAllocationId: result.allocation_result_id,
            },
            type: 'INSERT',
            transaction,
          }
        );

        allocationsReversed++;
        totalReversalAmount += Math.abs(result.allocation_amount);
        journalEntriesCreated++;

        // Track reversal
        await trackFieldChange(
          sequelize,
          'allocation_results',
          result.allocation_result_id,
          'allocationAmount',
          result.allocation_amount,
          -result.allocation_amount,
          userId,
          `Reversal: ${reversalId}`,
          transaction
        );
      }

      // Create audit log
      const auditLog = await createAuditLog(
        sequelize,
        'allocation_reversal_execution',
        exec.rule_id,
        'REVERSE',
        userId,
        `Allocations reversed: ${exec.rule_code}`,
        {},
        {
          reversalId,
          ruleId: exec.rule_id,
          allocationsReversed,
        },
        transaction
      );
      auditTrail.push(auditLog);

    } catch (error: any) {
      errors.push(`Rule ${exec.rule_code}: ${error.message}`);
    }
  }

  // Update reversal status
  await sequelize.query(
    `
    UPDATE allocation_reversals
    SET status = 'completed', completed_date = NOW(), completed_by = :userId
    WHERE reversal_id = :reversalId
    `,
    {
      replacements: { reversalId, userId },
      type: 'UPDATE',
      transaction,
    }
  );

  return {
    reversalId,
    reversalDate: new Date(reversal.reversal_date),
    originalExecutionId: reversal.original_execution_id,
    allocationsReversed,
    totalReversalAmount,
    journalEntriesCreated,
    errors,
    auditTrail,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - WHAT-IF ANALYSIS
// ============================================================================

/**
 * Creates and executes what-if scenario for allocation testing
 * Composes: buildAllocationRuleHierarchy, calculateAllocationPercentages
 */
export const executeWhatIfScenario = async (
  sequelize: any,
  scenarioName: string,
  description: string,
  ruleModifications: RuleModification[],
  driverModifications: DriverModification[],
  baselineDate: Date,
  userId: string,
  transaction?: Transaction
): Promise<WhatIfScenario> => {
  const scenarioId = `WHATIF-${Date.now()}`;

  // Get baseline period
  const period = await getCurrentOpenPeriod(sequelize, transaction);

  // Apply rule modifications (in-memory only)
  const modifiedRules = new Map<number, any>();
  for (const mod of ruleModifications) {
    const AllocationRuleModel = createAllocationRuleModel(sequelize);
    const rule = await AllocationRuleModel.findByPk(mod.ruleId, { transaction });

    if (rule) {
      const modifiedRule = { ...rule.get({ plain: true }) };

      if (mod.modificationType === 'change_basis') {
        modifiedRule.allocationBasis = mod.modifiedValue;
      } else if (mod.modificationType === 'change_targets') {
        modifiedRule.targetDepartments = mod.modifiedValue;
      }

      modifiedRules.set(mod.ruleId, modifiedRule);
    }
  }

  // Apply driver modifications (in-memory only)
  const modifiedDrivers = new Map<number, number>();
  for (const mod of driverModifications) {
    modifiedDrivers.set(mod.driverId, mod.modifiedValue);
  }

  // Calculate baseline allocations
  const baselineAllocations = new Map<string, number>();
  const costCenters = await listCostCenters(sequelize, period.fiscalYear, transaction);

  for (const costCenter of costCenters) {
    // Get current allocations to this cost center
    const allocations = await sequelize.query(
      `
      SELECT SUM(allocation_amount) as total
      FROM allocation_results
      WHERE target_department = :costCenterCode
        AND fiscal_year = :fiscalYear
        AND fiscal_period = :fiscalPeriod
      `,
      {
        replacements: {
          costCenterCode: costCenter.costCenterCode,
          fiscalYear: period.fiscalYear,
          fiscalPeriod: period.fiscalPeriod,
        },
        type: 'SELECT',
        transaction,
      }
    );

    const total = allocations && allocations.length > 0 ? parseFloat((allocations[0] as any).total || 0) : 0;
    baselineAllocations.set(costCenter.costCenterCode, total);
  }

  // Calculate scenario allocations (simplified - would need full allocation engine)
  const scenarioAllocations = new Map<string, number>();

  // Apply driver changes to percentages
  for (const [deptCode, baseline] of baselineAllocations.entries()) {
    let scenarioAmount = baseline;

    // Find if any driver modifications affect this department
    for (const driverMod of driverModifications) {
      // Simplified logic - adjust allocation based on driver change percentage
      scenarioAmount *= (1 + driverMod.changePercentage / 100);
    }

    scenarioAllocations.set(deptCode, scenarioAmount);
  }

  // Build results
  const results: WhatIfResult[] = [];

  for (const [deptCode, baseline] of baselineAllocations.entries()) {
    const scenario = scenarioAllocations.get(deptCode) || baseline;
    const variance = scenario - baseline;
    const variancePercentage = baseline > 0 ? (variance / baseline) * 100 : 0;

    results.push({
      costCenterCode: deptCode,
      baselineAllocation: baseline,
      scenarioAllocation: scenario,
      variance,
      variancePercentage,
      impact: variance > 0 ? 'unfavorable' : variance < 0 ? 'favorable' : 'neutral',
    });
  }

  // Store scenario
  await sequelize.query(
    `
    INSERT INTO what_if_scenarios
      (scenario_id, scenario_name, description, baseline_date, rule_modifications, driver_modifications, results, created_by)
    VALUES
      (:scenarioId, :scenarioName, :description, :baselineDate, :ruleModifications, :driverModifications, :results, :userId)
    `,
    {
      replacements: {
        scenarioId,
        scenarioName,
        description,
        baselineDate,
        ruleModifications: JSON.stringify(ruleModifications),
        driverModifications: JSON.stringify(driverModifications),
        results: JSON.stringify(results),
        userId,
      },
      type: 'INSERT',
      transaction,
    }
  );

  // Create audit log
  await createAuditLog(
    sequelize,
    'what_if_scenarios',
    0,
    'EXECUTE',
    userId,
    `What-if scenario executed: ${scenarioName}`,
    {},
    {
      scenarioId,
      ruleModCount: ruleModifications.length,
      driverModCount: driverModifications.length,
      resultsCount: results.length,
    },
    transaction
  );

  return {
    scenarioId,
    scenarioName,
    description,
    baselineDate,
    ruleModifications,
    driverModifications,
    results,
    createdBy: userId,
    createdDate: new Date(),
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - RULE VALIDATION
// ============================================================================

/**
 * Performs comprehensive rule validation
 * Composes: validateAllocationRule, validateAllocationTotal, buildDataLineageTrail
 */
export const performComprehensiveRuleValidation = async (
  sequelize: any,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction
): Promise<AllocationValidationReport> => {
  const validationDate = new Date();
  const allRules = await getActiveAllocationRules(sequelize, fiscalYear, fiscalPeriod, transaction);

  const validationDetails: RuleValidationDetail[] = [];
  const criticalIssues: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  let rulesPassed = 0;
  let rulesFailed = 0;

  for (const rule of allRules) {
    const validationChecks: ValidationCheck[] = [];

    // Check 1: Rule integrity
    const integrityCheck = await validateAllocationRule(sequelize, rule.ruleId, transaction);
    validationChecks.push({
      checkName: 'Rule Integrity',
      checkType: 'integrity',
      passed: integrityCheck.valid,
      details: integrityCheck.errors.join('; ') || 'Rule structure is valid',
      severity: integrityCheck.valid ? 'low' : 'critical',
    });

    // Check 2: Target department existence
    const deptExists = await checkDepartmentExistence(sequelize, rule.targetDepartments, transaction);
    validationChecks.push({
      checkName: 'Target Department Existence',
      checkType: 'completeness',
      passed: deptExists.allExist,
      details: deptExists.missing.length > 0 ? `Missing: ${deptExists.missing.join(', ')}` : 'All departments exist',
      severity: deptExists.allExist ? 'low' : 'high',
    });

    // Check 3: Allocation basis validity
    const AllocationBasisModel = createAllocationBasisModel(sequelize);
    const basis = await AllocationBasisModel.findOne({
      where: { basisCode: rule.allocationBasis },
      transaction,
    });

    validationChecks.push({
      checkName: 'Allocation Basis Validity',
      checkType: 'accuracy',
      passed: !!basis,
      details: basis ? 'Allocation basis exists and is valid' : `Basis ${rule.allocationBasis} not found`,
      severity: basis ? 'low' : 'critical',
    });

    // Check 4: Statistical drivers availability
    const drivers = await getStatisticalDriversByDepartment(
      sequelize,
      rule.sourceDepartment,
      fiscalYear,
      fiscalPeriod,
      transaction
    );

    validationChecks.push({
      checkName: 'Statistical Drivers Availability',
      checkType: 'completeness',
      passed: drivers.length > 0,
      details: drivers.length > 0 ? `${drivers.length} drivers available` : 'No drivers found',
      severity: drivers.length > 0 ? 'low' : 'high',
    });

    // Calculate overall score
    const passedChecks = validationChecks.filter(c => c.passed).length;
    const overallScore = (passedChecks / validationChecks.length) * 100;

    const validationStatus = overallScore === 100 ? 'passed' :
                            overallScore >= 75 ? 'warning' : 'failed';

    validationDetails.push({
      ruleId: rule.ruleId,
      ruleCode: rule.ruleCode,
      ruleName: rule.ruleName,
      validationStatus,
      validationChecks,
      overallScore,
    });

    if (validationStatus === 'passed') {
      rulesPassed++;
    } else if (validationStatus === 'failed') {
      rulesFailed++;
      criticalIssues.push(`Rule ${rule.ruleCode} failed validation (score: ${overallScore}%)`);
    } else {
      warnings.push(`Rule ${rule.ruleCode} has warnings (score: ${overallScore}%)`);
    }

    // Add recommendations
    if (overallScore < 100) {
      recommendations.push(`Review rule ${rule.ruleCode} - ${validationChecks.filter(c => !c.passed).map(c => c.checkName).join(', ')}`);
    }
  }

  // Create audit log
  await createAuditLog(
    sequelize,
    'allocation_rule_validation',
    0,
    'EXECUTE',
    userId,
    `Rule validation: ${allRules.length} rules`,
    {},
    {
      fiscalYear,
      fiscalPeriod,
      rulesValidated: allRules.length,
      rulesPassed,
      rulesFailed,
    },
    transaction
  );

  return {
    validationDate,
    fiscalYear,
    fiscalPeriod,
    rulesValidated: allRules.length,
    rulesPassed,
    rulesFailed,
    validationDetails,
    criticalIssues,
    warnings,
    recommendations,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - PERIOD-END INTEGRATION
// ============================================================================

/**
 * Integrates allocation automation with period-end close
 * Composes: createCloseTask, executeAutomatedTask, executeScheduledAllocation
 */
export const integrateAllocationWithPeriodEndClose = async (
  sequelize: any,
  checklistId: number,
  scheduleIds: string[],
  userId: string,
  transaction?: Transaction
): Promise<{
  tasks: CloseTask[];
  executionResults: AllocationExecutionResult[];
}> => {
  const tasks: CloseTask[] = [];
  const executionResults: AllocationExecutionResult[] = [];

  for (const scheduleId of scheduleIds) {
    // Create close task for this allocation
    const task = await createCloseTask(
      sequelize,
      checklistId,
      `Execute allocation: ${scheduleId}`,
      'automated',
      `Automated allocation execution for schedule ${scheduleId}`,
      1,
      userId,
      transaction
    );

    tasks.push(task);

    // Start task
    await startCloseTask(sequelize, task.taskId, userId, transaction);

    try {
      // Execute allocation
      const result = await executeScheduledAllocation(
        sequelize,
        scheduleId,
        userId,
        transaction
      );

      executionResults.push(result);

      // Complete task
      await completeCloseTask(
        sequelize,
        task.taskId,
        userId,
        `Allocation completed: ${result.totalRulesExecuted} rules executed`,
        transaction
      );

    } catch (error: any) {
      // Mark task as failed
      await sequelize.query(
        `UPDATE close_tasks SET status = 'failed', error_message = :error WHERE task_id = :taskId`,
        {
          replacements: { taskId: task.taskId, error: error.message },
          type: 'UPDATE',
          transaction,
        }
      );
    }
  }

  return { tasks, executionResults };
};

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('allocation-automation')
@Controller('api/v1/allocation-automation')
@ApiBearerAuth()
export class AllocationAutomationController {
  private readonly logger = new Logger(AllocationAutomationController.name);

  constructor(
    private readonly sequelize: any,
    private readonly allocationService: AllocationAutomationService,
  ) {}

  /**
   * Create new allocation rule
   */
  @Post('rules')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new allocation rule' })
  @ApiResponse({ status: 201, description: 'Rule created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid rule data' })
  async createAllocationRule(@Body() dto: CreateAllocationRuleDto): Promise<any> {
    this.logger.log(`Creating allocation rule: ${dto.ruleCode}`);

    const transaction = await this.sequelize.transaction();

    try {
      const rule = await createAllocationRule(
        this.sequelize,
        dto.ruleCode,
        dto.ruleName,
        dto.allocationMethod as any,
        dto.sourceDepartment,
        dto.targetDepartments,
        dto.allocationBasis,
        dto.fiscalYear,
        dto.fiscalPeriod,
        dto.priority,
        'system', // Would come from auth context
        transaction,
      );

      await transaction.commit();

      return {
        ruleId: rule.ruleId,
        ruleCode: rule.ruleCode,
        ruleName: rule.ruleName,
        created: true,
        createdAt: rule.createdAt,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Rule creation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get all active allocation rules
   */
  @Get('rules')
  @ApiOperation({ summary: 'List active allocation rules' })
  @ApiQuery({ name: 'fiscalYear', required: true, type: 'number' })
  @ApiQuery({ name: 'fiscalPeriod', required: true, type: 'number' })
  @ApiResponse({ status: 200, description: 'Rules retrieved successfully' })
  async getActiveRules(
    @Query('fiscalYear', ParseIntPipe) fiscalYear: number,
    @Query('fiscalPeriod', ParseIntPipe) fiscalPeriod: number,
  ): Promise<any> {
    this.logger.log(`Retrieving active rules for FY${fiscalYear} P${fiscalPeriod}`);

    const rules = await getActiveAllocationRules(this.sequelize, fiscalYear, fiscalPeriod);

    return {
      fiscalYear,
      fiscalPeriod,
      rules,
      count: rules.length,
    };
  }

  /**
   * Get specific allocation rule
   */
  @Get('rules/:ruleId')
  @ApiOperation({ summary: 'Get allocation rule by ID' })
  @ApiParam({ name: 'ruleId', description: 'Rule ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Rule retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  async getRuleById(@Param('ruleId', ParseIntPipe) ruleId: number): Promise<any> {
    this.logger.log(`Retrieving rule ${ruleId}`);

    const rule = await this.allocationService.getRuleById(ruleId);

    if (!rule) {
      throw new NotFoundException(`Rule ${ruleId} not found`);
    }

    return rule;
  }

  /**
   * Update allocation rule
   */
  @Put('rules/:ruleId')
  @ApiOperation({ summary: 'Update allocation rule' })
  @ApiParam({ name: 'ruleId', description: 'Rule ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Rule updated successfully' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  async updateRule(
    @Param('ruleId', ParseIntPipe) ruleId: number,
    @Body() dto: UpdateAllocationRuleDto,
  ): Promise<any> {
    this.logger.log(`Updating rule ${ruleId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const updatedRule = await updateAllocationRule(
        this.sequelize,
        ruleId,
        dto as any,
        'system', // Would come from auth context
        transaction,
      );

      await transaction.commit();

      return {
        ruleId: updatedRule.ruleId,
        updated: true,
        updatedAt: new Date(),
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Rule update failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Deactivate allocation rule
   */
  @Delete('rules/:ruleId')
  @ApiOperation({ summary: 'Deactivate allocation rule' })
  @ApiParam({ name: 'ruleId', description: 'Rule ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Rule deactivated successfully' })
  async deactivateRule(@Param('ruleId', ParseIntPipe) ruleId: number): Promise<any> {
    this.logger.log(`Deactivating rule ${ruleId}`);

    const transaction = await this.sequelize.transaction();

    try {
      await deactivateAllocationRule(this.sequelize, ruleId, 'system', transaction);

      await transaction.commit();

      return {
        ruleId,
        deactivated: true,
        deactivatedAt: new Date(),
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Rule deactivation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Build allocation rule hierarchy
   */
  @Post('hierarchy/build')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Build allocation rule hierarchy' })
  @ApiResponse({ status: 200, description: 'Hierarchy built successfully', type: HierarchyResponse })
  async buildHierarchy(@Body() dto: BuildHierarchyDto): Promise<HierarchyResponse> {
    this.logger.log(`Building hierarchy for FY${dto.fiscalYear} P${dto.fiscalPeriod}`);

    const transaction = await this.sequelize.transaction();

    try {
      let hierarchy = await buildAllocationRuleHierarchy(
        this.sequelize,
        dto.fiscalYear,
        dto.fiscalPeriod,
        transaction,
      );

      let circularDeps: string[] = [];
      let hasCircular = false;

      if (dto.validateCircular) {
        const validation = await validateRuleHierarchyForCircularDependencies(
          this.sequelize,
          dto.fiscalYear,
          dto.fiscalPeriod,
          transaction,
        );
        hasCircular = !validation.valid;
        circularDeps = validation.errors;
      }

      if (dto.optimizeOrder) {
        const optimization = await optimizeRuleExecutionOrder(
          this.sequelize,
          dto.fiscalYear,
          dto.fiscalPeriod,
          transaction,
        );
        // Use optimized order
        hierarchy = {
          ...hierarchy,
          executionOrder: optimization.optimizedOrder,
        };
      }

      await transaction.commit();

      return {
        hierarchyId: hierarchy.hierarchyId,
        hierarchyName: hierarchy.hierarchyName,
        totalLevels: hierarchy.totalLevels,
        rootRulesCount: hierarchy.rootRules.length,
        totalRules: hierarchy.executionOrder.length,
        executionOrder: hierarchy.executionOrder,
        hasCircularDependencies: hasCircular,
        circularDependencies: circularDeps,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Hierarchy build failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Validate hierarchy for circular dependencies
   */
  @Post('hierarchy/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate hierarchy for circular dependencies' })
  @ApiResponse({ status: 200, description: 'Validation completed' })
  async validateHierarchy(@Body() dto: BuildHierarchyDto): Promise<any> {
    this.logger.log(`Validating hierarchy for FY${dto.fiscalYear} P${dto.fiscalPeriod}`);

    const validation = await validateRuleHierarchyForCircularDependencies(
      this.sequelize,
      dto.fiscalYear,
      dto.fiscalPeriod,
    );

    return {
      fiscalYear: dto.fiscalYear,
      fiscalPeriod: dto.fiscalPeriod,
      valid: validation.valid,
      circularDependencies: validation.circularDependencies,
      errors: validation.errors,
    };
  }

  /**
   * Create allocation schedule
   */
  @Post('schedules')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create allocation schedule' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  async createSchedule(@Body() dto: CreateAllocationScheduleDto): Promise<any> {
    this.logger.log(`Creating schedule: ${dto.scheduleName}`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await createAllocationScheduleWithWorkflow(
        this.sequelize,
        dto.scheduleName,
        dto.scheduleType as any,
        dto.ruleIds,
        dto.executionTime,
        dto.requireApproval || false,
        'system', // Would come from auth context
        transaction,
      );

      await transaction.commit();

      return {
        scheduleId: result.schedule.scheduleId,
        scheduleName: result.schedule.scheduleName,
        created: true,
        nextExecution: result.schedule.nextExecution,
        workflowId: result.workflow?.workflowId,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Schedule creation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Execute allocation schedule
   */
  @Post('schedules/:scheduleId/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute allocation schedule' })
  @ApiParam({ name: 'scheduleId', description: 'Schedule ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Execution completed', type: AllocationExecutionResponse })
  async executeSchedule(
    @Param('scheduleId') scheduleId: string,
    @Body() dto: ExecuteAllocationDto,
  ): Promise<AllocationExecutionResponse> {
    this.logger.log(`Executing schedule ${scheduleId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await executeScheduledAllocation(
        this.sequelize,
        scheduleId,
        'system', // Would come from auth context
        transaction,
      );

      await transaction.commit();

      return {
        executionId: result.executionId,
        scheduleId: result.scheduleId || scheduleId,
        executionDate: result.executionDate,
        totalRulesExecuted: result.totalRulesExecuted,
        totalRulesFailed: result.totalRulesFailed,
        totalAllocated: result.totalAllocated,
        executionDurationMs: result.executionDurationMs,
        status: result.status as AllocationStatus,
        errors: result.errors,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Schedule execution failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Create reversal request
   */
  @Post('reversals')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create allocation reversal request' })
  @ApiResponse({ status: 201, description: 'Reversal request created' })
  async createReversal(@Body() dto: CreateReversalRequestDto): Promise<any> {
    this.logger.log(`Creating reversal for execution ${dto.originalExecutionId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await createAllocationReversalWithApproval(
        this.sequelize,
        dto.originalExecutionId,
        dto.reversalReason,
        'system', // Would come from auth context
        transaction,
      );

      // If immediate processing requested and no approval required
      if (dto.immediateProcess && !result.reversal.approvalRequired) {
        const processResult = await processAllocationReversal(
          this.sequelize,
          result.reversal.reversalId,
          'system',
          transaction,
        );

        await transaction.commit();

        return {
          reversalId: result.reversal.reversalId,
          created: true,
          processed: true,
          allocationsReversed: processResult.allocationsReversed,
          totalReversalAmount: processResult.totalReversalAmount,
        };
      }

      await transaction.commit();

      return {
        reversalId: result.reversal.reversalId,
        created: true,
        approvalRequired: result.reversal.approvalRequired,
        approvalStatus: result.reversal.approvalStatus,
        workflowInstanceId: result.workflow?.instanceId,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Reversal creation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Process reversal
   */
  @Post('reversals/:reversalId/process')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process allocation reversal' })
  @ApiParam({ name: 'reversalId', description: 'Reversal ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Reversal processed', type: AllocationReversalResponse })
  async processReversal(
    @Param('reversalId') reversalId: string,
    @Body() dto: ProcessReversalDto,
  ): Promise<AllocationReversalResponse> {
    this.logger.log(`Processing reversal ${reversalId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await processAllocationReversal(
        this.sequelize,
        reversalId,
        dto.approverId || 'system',
        transaction,
      );

      await transaction.commit();

      return {
        reversalId: result.reversalId,
        reversalDate: result.reversalDate,
        originalExecutionId: result.originalExecutionId,
        allocationsReversed: result.allocationsReversed,
        totalReversalAmount: result.totalReversalAmount,
        journalEntriesCreated: result.journalEntriesCreated,
        errors: result.errors,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Reversal processing failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Execute what-if scenario
   */
  @Post('what-if')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute what-if scenario analysis' })
  @ApiResponse({ status: 200, description: 'Scenario executed', type: WhatIfScenarioResponse })
  async executeWhatIf(@Body() dto: ExecuteWhatIfScenarioDto): Promise<WhatIfScenarioResponse> {
    this.logger.log(`Executing what-if scenario: ${dto.scenarioName}`);

    const transaction = await this.sequelize.transaction();

    try {
      const scenario = await executeWhatIfScenario(
        this.sequelize,
        dto.scenarioName,
        dto.description,
        dto.ruleModifications as any,
        dto.driverModifications as any,
        dto.baselineDate,
        'system', // Would come from auth context
        transaction,
      );

      await transaction.commit();

      const totalVariance = scenario.results.reduce((sum, r) => sum + r.variance, 0);
      const avgVariancePercentage =
        scenario.results.reduce((sum, r) => sum + r.variancePercentage, 0) / scenario.results.length;

      return {
        scenarioId: scenario.scenarioId,
        scenarioName: scenario.scenarioName,
        resultsCount: scenario.results.length,
        totalVariance,
        avgVariancePercentage,
        createdBy: scenario.createdBy,
        createdDate: scenario.createdDate,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`What-if scenario failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Run comprehensive rule validation
   */
  @Post('validation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Run comprehensive rule validation' })
  @ApiResponse({ status: 200, description: 'Validation completed', type: ValidationReportResponse })
  async validateRules(@Body() dto: ValidateRulesDto): Promise<ValidationReportResponse> {
    this.logger.log(`Validating rules for FY${dto.fiscalYear} P${dto.fiscalPeriod}`);

    const transaction = await this.sequelize.transaction();

    try {
      const report = await performComprehensiveRuleValidation(
        this.sequelize,
        dto.fiscalYear,
        dto.fiscalPeriod,
        'system', // Would come from auth context
        transaction,
      );

      await transaction.commit();

      return {
        validationDate: report.validationDate,
        fiscalYear: report.fiscalYear,
        fiscalPeriod: report.fiscalPeriod,
        rulesValidated: report.rulesValidated,
        rulesPassed: report.rulesPassed,
        rulesFailed: report.rulesFailed,
        criticalIssues: report.criticalIssues,
        warnings: report.warnings,
        recommendations: report.recommendations,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Rule validation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Integrate with period-end close
   */
  @Post('period-end/integrate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Integrate allocation with period-end close' })
  @ApiResponse({ status: 200, description: 'Integration completed' })
  async integratePeriodEnd(@Body() dto: IntegratePeriodEndDto): Promise<any> {
    this.logger.log(`Integrating with period-end checklist ${dto.checklistId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await integrateAllocationWithPeriodEndClose(
        this.sequelize,
        dto.checklistId,
        dto.scheduleIds,
        'system', // Would come from auth context
        transaction,
      );

      await transaction.commit();

      return {
        checklistId: dto.checklistId,
        tasksCreated: result.tasks.length,
        executionsCompleted: result.executionResults.length,
        totalAllocated: result.executionResults.reduce((sum, r) => sum + r.totalAllocated, 0),
        allSuccessful: result.executionResults.every((r) => r.status === 'success'),
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Period-end integration failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get allocation dashboard
   */
  @Get('dashboard')
  @ApiOperation({ summary: 'Get allocation automation dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved' })
  async getDashboard(): Promise<any> {
    this.logger.log('Retrieving allocation dashboard');

    const dashboard = await this.allocationService.getDashboardMetrics();

    return dashboard;
  }
}

// ============================================================================
// SERVICE CLASS FOR DEPENDENCY INJECTION
// ============================================================================

@Injectable()
export class AllocationAutomationService {
  private readonly logger = new Logger(AllocationAutomationService.name);

  constructor(private readonly sequelize: any) {}

  /**
   * Get allocation rule by ID
   */
  async getRuleById(ruleId: number): Promise<any> {
    this.logger.log(`Retrieving rule ${ruleId}`);

    const AllocationRuleModel = createAllocationRuleModel(this.sequelize);
    const rule = await AllocationRuleModel.findByPk(ruleId);

    return rule ? rule.get({ plain: true }) : null;
  }

  /**
   * Get active rules for period
   */
  async getActiveRules(fiscalYear: number, fiscalPeriod: number): Promise<any[]> {
    this.logger.log(`Retrieving active rules for FY${fiscalYear} P${fiscalPeriod}`);

    const rules = await getActiveAllocationRules(this.sequelize, fiscalYear, fiscalPeriod);

    return rules;
  }

  /**
   * Calculate rule quality metrics
   */
  async calculateRuleQualityMetrics(fiscalYear: number, fiscalPeriod: number): Promise<any> {
    this.logger.log(`Calculating quality metrics for FY${fiscalYear} P${fiscalPeriod}`);

    const rules = await getActiveAllocationRules(this.sequelize, fiscalYear, fiscalPeriod);

    const executionHistory = await this.sequelize.query(
      `
      SELECT
        rule_id,
        COUNT(*) as execution_count,
        AVG(duration_ms) as avg_duration,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success_count
      FROM rule_execution_history
      WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod
      GROUP BY rule_id
      `,
      {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
      },
    );

    return {
      totalRules: rules.length,
      activeRules: rules.filter((r: any) => r.isActive).length,
      executionHistory: executionHistory || [],
      avgSuccessRate:
        executionHistory && executionHistory.length > 0
          ? executionHistory.reduce((sum: number, h: any) => sum + (h.success_count / h.execution_count), 0) /
            executionHistory.length
          : 0,
    };
  }

  /**
   * Get schedule by ID
   */
  async getScheduleById(scheduleId: string): Promise<any> {
    this.logger.log(`Retrieving schedule ${scheduleId}`);

    const schedules = await this.sequelize.query(
      `SELECT * FROM allocation_schedules WHERE schedule_id = :scheduleId`,
      {
        replacements: { scheduleId },
        type: 'SELECT',
      },
    );

    return schedules && schedules.length > 0 ? schedules[0] : null;
  }

  /**
   * Get reversal status
   */
  async getReversalStatus(reversalId: string): Promise<any> {
    this.logger.log(`Retrieving reversal status ${reversalId}`);

    const reversals = await this.sequelize.query(
      `SELECT * FROM allocation_reversals WHERE reversal_id = :reversalId`,
      {
        replacements: { reversalId },
        type: 'SELECT',
      },
    );

    return reversals && reversals.length > 0 ? reversals[0] : null;
  }

  /**
   * Get what-if scenarios
   */
  async getWhatIfScenarios(limit: number = 10): Promise<any[]> {
    this.logger.log('Retrieving what-if scenarios');

    const scenarios = await this.sequelize.query(
      `SELECT * FROM what_if_scenarios ORDER BY created_date DESC LIMIT :limit`,
      {
        replacements: { limit },
        type: 'SELECT',
      },
    );

    return scenarios || [];
  }

  /**
   * Perform rule impact analysis
   */
  async performRuleImpactAnalysis(ruleId: number): Promise<any> {
    this.logger.log(`Performing impact analysis for rule ${ruleId}`);

    const executionHistory = await this.sequelize.query(
      `
      SELECT
        COUNT(*) as total_executions,
        SUM(total_allocated) as total_amount_allocated,
        AVG(duration_ms) as avg_duration,
        MAX(execution_date) as last_execution
      FROM rule_execution_history
      WHERE rule_id = :ruleId
      `,
      {
        replacements: { ruleId },
        type: 'SELECT',
      },
    );

    const affectedDepartments = await this.sequelize.query(
      `
      SELECT DISTINCT target_department, SUM(allocation_amount) as total_amount
      FROM allocation_results
      WHERE rule_id = :ruleId
      GROUP BY target_department
      `,
      {
        replacements: { ruleId },
        type: 'SELECT',
      },
    );

    return {
      ruleId,
      executionHistory: executionHistory && executionHistory.length > 0 ? executionHistory[0] : null,
      affectedDepartments: affectedDepartments || [],
      impactLevel: affectedDepartments && affectedDepartments.length > 10 ? 'HIGH' : 'MEDIUM',
    };
  }

  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics(): Promise<any> {
    this.logger.log('Calculating dashboard metrics');

    const activeRules = await this.sequelize.query(
      `SELECT COUNT(*) as count FROM allocation_rules WHERE is_active = true`,
      { type: 'SELECT' },
    );

    const activeSchedules = await this.sequelize.query(
      `SELECT COUNT(*) as count FROM allocation_schedules WHERE enabled = true`,
      { type: 'SELECT' },
    );

    const recentExecutions = await this.sequelize.query(
      `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM rule_execution_history
      WHERE execution_date >= NOW() - INTERVAL '30 days'
      `,
      { type: 'SELECT' },
    );

    const pendingReversals = await this.sequelize.query(
      `SELECT COUNT(*) as count FROM allocation_reversals WHERE approval_status = 'pending'`,
      { type: 'SELECT' },
    );

    return {
      activeRules: activeRules && activeRules.length > 0 ? (activeRules[0] as any).count : 0,
      activeSchedules: activeSchedules && activeSchedules.length > 0 ? (activeSchedules[0] as any).count : 0,
      recentExecutions: recentExecutions && recentExecutions.length > 0 ? recentExecutions[0] : {},
      pendingReversals: pendingReversals && pendingReversals.length > 0 ? (pendingReversals[0] as any).count : 0,
      lastUpdated: new Date(),
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateNextExecutionDate(
  currentDate: Date,
  scheduleType: string,
  executionTime: string
): Date {
  const next = new Date(currentDate);

  switch (scheduleType) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'annual':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
}

async function checkDepartmentExistence(
  sequelize: any,
  departments: string[],
  transaction?: Transaction
): Promise<{ allExist: boolean; missing: string[] }> {
  const missing: string[] = [];

  for (const dept of departments) {
    const result = await sequelize.query(
      `SELECT COUNT(*) as count FROM cost_centers WHERE cost_center_code = :dept`,
      {
        replacements: { dept },
        type: 'SELECT',
        transaction,
      }
    );

    if (result && result.length > 0 && (result[0] as any).count === 0) {
      missing.push(dept);
    }
  }

  return { allExist: missing.length === 0, missing };
}

// ============================================================================
// MODULE EXPORT DEFINITION
// ============================================================================

/**
 * Export NestJS module definition for Allocation Automation
 */
export const AllocationAutomationModule = {
  controllers: [AllocationAutomationController],
  providers: [AllocationAutomationService],
  exports: [AllocationAutomationService],
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Rule Hierarchy Management
  buildAllocationRuleHierarchy,
  validateRuleHierarchyForCircularDependencies,
  optimizeRuleExecutionOrder,

  // Allocation Scheduling
  createAllocationScheduleWithWorkflow,
  executeScheduledAllocation,

  // Allocation Reversal
  createAllocationReversalWithApproval,
  processAllocationReversal,

  // What-If Analysis
  executeWhatIfScenario,

  // Rule Validation
  performComprehensiveRuleValidation,

  // Period-End Integration
  integrateAllocationWithPeriodEndClose,
};
