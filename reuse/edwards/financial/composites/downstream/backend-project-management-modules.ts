/**
 * LOC: PRJMGMT001
 * File: /reuse/edwards/financial/composites/downstream/backend-project-management-modules.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *   - ../project-cost-accounting-composite
 *
 * DOWNSTREAM (imported by):
 *   - Backend application modules
 *   - Project management API routes
 *   - NestJS application bootstrap
 */

import {
  Module,
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction } from 'sequelize';

// Import from parent composite
import {
  ProjectType,
  ProjectStatus,
  BudgetType,
  CostCategory,
  BillingMethod,
  WBSElementType,
  TimeEntryStatus,
  ExpenseEntryStatus,
  CommitmentStatus,
  EncumbranceStatus,
  ProjectPerformanceStatus,
} from '../project-cost-accounting-composite';

// ============================================================================
// DTOs - PROJECT MANAGEMENT REQUESTS
// ============================================================================

/**
 * Project creation request DTO
 */
export class CreateProjectRequestDto {
  @ApiProperty({ description: 'Project name', example: 'Hospital Expansion Phase 1' })
  @IsString()
  @IsNotEmpty()
  projectName!: string;

  @ApiProperty({ description: 'Project code', example: 'HOSP-EXP-2024-001' })
  @IsString()
  @IsNotEmpty()
  projectCode!: string;

  @ApiProperty({ enum: ProjectType, description: 'Project type' })
  @IsEnum(ProjectType)
  @IsNotEmpty()
  projectType!: ProjectType;

  @ApiPropertyOptional({ description: 'Project description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Start date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate!: Date;

  @ApiProperty({ description: 'End date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate!: Date;

  @ApiProperty({ description: 'Project manager ID' })
  @IsNumber()
  @IsNotEmpty()
  projectManagerId!: number;

  @ApiPropertyOptional({ description: 'Customer ID' })
  @IsNumber()
  @IsOptional()
  customerId?: number;

  @ApiPropertyOptional({ description: 'Department ID' })
  @IsNumber()
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({ description: 'Cost center' })
  @IsString()
  @IsOptional()
  costCenter?: string;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currencyCode!: string;

  @ApiProperty({ enum: BillingMethod, description: 'Billing method' })
  @IsEnum(BillingMethod)
  @IsNotEmpty()
  billingMethod!: BillingMethod;

  @ApiPropertyOptional({ description: 'Billing rate', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  billingRate?: number;
}

/**
 * Project update request DTO
 */
export class UpdateProjectRequestDto {
  @ApiPropertyOptional({ description: 'Project name' })
  @IsString()
  @IsOptional()
  projectName?: string;

  @ApiPropertyOptional({ enum: ProjectStatus, description: 'Project status' })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional({ description: 'Project description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Start date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'End date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Project manager ID' })
  @IsNumber()
  @IsOptional()
  projectManagerId?: number;

  @ApiPropertyOptional({ description: 'Completion percentage', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  completionPercentage?: number;
}

/**
 * WBS element creation request DTO
 */
export class CreateWBSElementRequestDto {
  @ApiProperty({ description: 'Project ID' })
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;

  @ApiProperty({ description: 'WBS code', example: '1.1.1' })
  @IsString()
  @IsNotEmpty()
  wbsCode!: string;

  @ApiProperty({ description: 'WBS element name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ enum: WBSElementType, description: 'Element type' })
  @IsEnum(WBSElementType)
  @IsNotEmpty()
  elementType!: WBSElementType;

  @ApiPropertyOptional({ description: 'Parent WBS element ID' })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Budget amount', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetAmount?: number;

  @ApiPropertyOptional({ description: 'Planned start date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  plannedStartDate?: Date;

  @ApiPropertyOptional({ description: 'Planned end date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  plannedEndDate?: Date;

  @ApiPropertyOptional({ description: 'Responsible person ID' })
  @IsNumber()
  @IsOptional()
  responsiblePersonId?: number;
}

/**
 * Time entry creation request DTO
 */
export class CreateTimeEntryRequestDto {
  @ApiProperty({ description: 'Project ID' })
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;

  @ApiPropertyOptional({ description: 'WBS element ID' })
  @IsNumber()
  @IsOptional()
  wbsElementId?: number;

  @ApiProperty({ description: 'Employee ID' })
  @IsNumber()
  @IsNotEmpty()
  employeeId!: number;

  @ApiProperty({ description: 'Work date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  workDate!: Date;

  @ApiProperty({ description: 'Hours worked', minimum: 0, maximum: 24 })
  @IsNumber()
  @Min(0)
  @Max(24)
  @IsNotEmpty()
  hours!: number;

  @ApiPropertyOptional({ description: 'Overtime hours', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  overtimeHours?: number;

  @ApiPropertyOptional({ description: 'Work description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Billable flag' })
  @IsBoolean()
  @IsOptional()
  billable?: boolean;

  @ApiPropertyOptional({ description: 'Billing rate override' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  billingRateOverride?: number;
}

/**
 * Expense entry creation request DTO
 */
export class CreateExpenseEntryRequestDto {
  @ApiProperty({ description: 'Project ID' })
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;

  @ApiPropertyOptional({ description: 'WBS element ID' })
  @IsNumber()
  @IsOptional()
  wbsElementId?: number;

  @ApiProperty({ description: 'Employee ID' })
  @IsNumber()
  @IsNotEmpty()
  employeeId!: number;

  @ApiProperty({ description: 'Expense date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  expenseDate!: Date;

  @ApiProperty({ enum: CostCategory, description: 'Cost category' })
  @IsEnum(CostCategory)
  @IsNotEmpty()
  category!: CostCategory;

  @ApiProperty({ description: 'Amount', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount!: number;

  @ApiPropertyOptional({ description: 'Expense description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Merchant/vendor name' })
  @IsString()
  @IsOptional()
  merchant?: string;

  @ApiPropertyOptional({ description: 'Receipt URL' })
  @IsString()
  @IsOptional()
  receiptUrl?: string;

  @ApiPropertyOptional({ description: 'Billable flag' })
  @IsBoolean()
  @IsOptional()
  billable?: boolean;

  @ApiPropertyOptional({ description: 'Reimbursable flag' })
  @IsBoolean()
  @IsOptional()
  reimbursable?: boolean;
}

/**
 * Project budget creation request DTO
 */
export class CreateProjectBudgetRequestDto {
  @ApiProperty({ description: 'Project ID' })
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;

  @ApiPropertyOptional({ description: 'WBS element ID' })
  @IsNumber()
  @IsOptional()
  wbsElementId?: number;

  @ApiProperty({ enum: BudgetType, description: 'Budget type' })
  @IsEnum(BudgetType)
  @IsNotEmpty()
  budgetType!: BudgetType;

  @ApiProperty({ description: 'Fiscal year' })
  @IsNumber()
  @IsNotEmpty()
  fiscalYear!: number;

  @ApiProperty({ description: 'Budget amount', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  budgetAmount!: number;

  @ApiPropertyOptional({ description: 'Labor budget', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  laborBudget?: number;

  @ApiPropertyOptional({ description: 'Material budget', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  materialBudget?: number;

  @ApiPropertyOptional({ description: 'Equipment budget', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  equipmentBudget?: number;

  @ApiPropertyOptional({ description: 'Overhead budget', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  overheadBudget?: number;

  @ApiPropertyOptional({ description: 'Contingency percentage', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  contingencyPercentage?: number;
}

/**
 * Project search query DTO
 */
export class ProjectSearchQueryDto {
  @ApiPropertyOptional({ description: 'Search term for project name or code' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: ProjectType, description: 'Filter by project type' })
  @IsEnum(ProjectType)
  @IsOptional()
  projectType?: ProjectType;

  @ApiPropertyOptional({ enum: ProjectStatus, description: 'Filter by project status' })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional({ description: 'Filter by project manager ID' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  projectManagerId?: number;

  @ApiPropertyOptional({ description: 'Filter by customer ID' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  customerId?: number;

  @ApiPropertyOptional({ description: 'Filter by department ID' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({ description: 'Start date from' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDateFrom?: Date;

  @ApiPropertyOptional({ description: 'Start date to' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDateTo?: Date;

  @ApiPropertyOptional({ description: 'Page number', minimum: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Page size', minimum: 1, maximum: 100 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  pageSize?: number = 20;
}

// ============================================================================
// SERVICES - PROJECT MANAGEMENT CORE
// ============================================================================

/**
 * Project header service
 * Manages project lifecycle, headers, and core operations
 */
@Injectable()
export class ProjectHeaderService {
  private readonly logger = new Logger(ProjectHeaderService.name);

  /**
   * Creates a new project header
   * @param dto - Project creation request
   * @param transaction - Optional database transaction
   * @returns Created project with ID
   */
  async createProject(
    dto: CreateProjectRequestDto,
    transaction?: Transaction
  ): Promise<{ projectId: number; projectCode: string; status: ProjectStatus }> {
    try {
      this.logger.log(`Creating project: ${dto.projectName} (${dto.projectCode})`);

      // Validate project dates
      if (dto.endDate <= dto.startDate) {
        throw new BadRequestException('End date must be after start date');
      }

      // Validate project code uniqueness
      const existingProject = await this.checkProjectCodeExists(dto.projectCode);
      if (existingProject) {
        throw new ConflictException(`Project code ${dto.projectCode} already exists`);
      }

      // Create project header (integrate with composite function)
      const project = {
        projectId: Math.floor(Math.random() * 1000000), // Would be generated by database
        projectCode: dto.projectCode,
        projectName: dto.projectName,
        projectType: dto.projectType,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        projectManagerId: dto.projectManagerId,
        customerId: dto.customerId,
        departmentId: dto.departmentId,
        costCenter: dto.costCenter,
        currencyCode: dto.currencyCode,
        billingMethod: dto.billingMethod,
        billingRate: dto.billingRate,
        status: ProjectStatus.PLANNING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.logger.log(`Project ${project.projectCode} created with ID ${project.projectId}`);

      return {
        projectId: project.projectId,
        projectCode: project.projectCode,
        status: project.status,
      };
    } catch (error) {
      this.logger.error(`Failed to create project: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates an existing project
   * @param projectId - Project identifier
   * @param dto - Project update request
   * @param transaction - Optional database transaction
   * @returns Updated project status
   */
  async updateProject(
    projectId: number,
    dto: UpdateProjectRequestDto,
    transaction?: Transaction
  ): Promise<{ success: boolean; projectCode: string }> {
    try {
      this.logger.log(`Updating project ID: ${projectId}`);

      // Verify project exists
      const project = await this.getProjectById(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Validate status transitions
      if (dto.status) {
        this.validateStatusTransition(project.status, dto.status);
      }

      // Validate dates if provided
      if (dto.startDate && dto.endDate && dto.endDate <= dto.startDate) {
        throw new BadRequestException('End date must be after start date');
      }

      this.logger.log(`Project ${projectId} updated successfully`);

      return {
        success: true,
        projectCode: project.projectCode,
      };
    } catch (error) {
      this.logger.error(`Failed to update project ${projectId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves a project by ID
   * @param projectId - Project identifier
   * @returns Project details
   */
  async getProjectById(projectId: number): Promise<any> {
    try {
      // Database query would go here
      return {
        projectId,
        projectCode: `PRJ-${projectId}`,
        projectName: 'Sample Project',
        status: ProjectStatus.ACTIVE,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve project ${projectId}: ${error.message}`, error.stack);
      throw new NotFoundException(`Project ${projectId} not found`);
    }
  }

  /**
   * Searches for projects based on criteria
   * @param query - Search parameters
   * @returns Paginated project list
   */
  async searchProjects(query: ProjectSearchQueryDto): Promise<{
    projects: any[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    try {
      this.logger.log(`Searching projects with filters: ${JSON.stringify(query)}`);

      // Database query would go here with filters
      const projects: any[] = [];
      const total = 0;

      return {
        projects,
        total,
        page: query.page || 1,
        pageSize: query.pageSize || 20,
      };
    } catch (error) {
      this.logger.error(`Failed to search projects: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to search projects');
    }
  }

  /**
   * Closes a project
   * @param projectId - Project identifier
   * @param transaction - Optional database transaction
   * @returns Closure status
   */
  async closeProject(
    projectId: number,
    transaction?: Transaction
  ): Promise<{ success: boolean; closedDate: Date }> {
    try {
      this.logger.log(`Closing project ID: ${projectId}`);

      const project = await this.getProjectById(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      if (project.status === ProjectStatus.CLOSED) {
        throw new BadRequestException(`Project ${projectId} is already closed`);
      }

      // Validate all WBS elements are closed
      // Validate all commitments are liquidated
      // Validate all costs are posted
      // Close project in database

      const closedDate = new Date();

      this.logger.log(`Project ${projectId} closed on ${closedDate.toISOString()}`);

      return {
        success: true,
        closedDate,
      };
    } catch (error) {
      this.logger.error(`Failed to close project ${projectId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Reopens a closed project
   * @param projectId - Project identifier
   * @param transaction - Optional database transaction
   * @returns Reopening status
   */
  async reopenProject(
    projectId: number,
    transaction?: Transaction
  ): Promise<{ success: boolean; reopenedDate: Date }> {
    try {
      this.logger.log(`Reopening project ID: ${projectId}`);

      const project = await this.getProjectById(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      if (project.status !== ProjectStatus.CLOSED) {
        throw new BadRequestException(`Project ${projectId} is not closed`);
      }

      const reopenedDate = new Date();

      this.logger.log(`Project ${projectId} reopened on ${reopenedDate.toISOString()}`);

      return {
        success: true,
        reopenedDate,
      };
    } catch (error) {
      this.logger.error(`Failed to reopen project ${projectId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Checks if a project code already exists
   * @param projectCode - Project code to check
   * @returns True if exists, false otherwise
   */
  private async checkProjectCodeExists(projectCode: string): Promise<boolean> {
    // Database query would go here
    return false;
  }

  /**
   * Validates project status transitions
   * @param currentStatus - Current project status
   * @param newStatus - New project status
   * @throws BadRequestException if transition is invalid
   */
  private validateStatusTransition(currentStatus: ProjectStatus, newStatus: ProjectStatus): void {
    const validTransitions: Record<ProjectStatus, ProjectStatus[]> = {
      [ProjectStatus.PLANNING]: [ProjectStatus.APPROVED, ProjectStatus.CANCELLED],
      [ProjectStatus.APPROVED]: [ProjectStatus.ACTIVE, ProjectStatus.CANCELLED],
      [ProjectStatus.ACTIVE]: [ProjectStatus.ON_HOLD, ProjectStatus.COMPLETED, ProjectStatus.CANCELLED],
      [ProjectStatus.ON_HOLD]: [ProjectStatus.ACTIVE, ProjectStatus.CANCELLED],
      [ProjectStatus.COMPLETED]: [ProjectStatus.CLOSED],
      [ProjectStatus.CLOSED]: [ProjectStatus.ARCHIVED],
      [ProjectStatus.CANCELLED]: [ProjectStatus.ARCHIVED],
      [ProjectStatus.ARCHIVED]: [],
    };

    const allowedTransitions = validTransitions[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }
}

/**
 * WBS management service
 * Manages work breakdown structure elements
 */
@Injectable()
export class WBSManagementService {
  private readonly logger = new Logger(WBSManagementService.name);

  /**
   * Creates a new WBS element
   * @param dto - WBS creation request
   * @param transaction - Optional database transaction
   * @returns Created WBS element
   */
  async createWBSElement(
    dto: CreateWBSElementRequestDto,
    transaction?: Transaction
  ): Promise<{ wbsElementId: number; wbsCode: string }> {
    try {
      this.logger.log(`Creating WBS element: ${dto.wbsCode} for project ${dto.projectId}`);

      // Validate project exists
      // Validate parent element exists if specified
      // Validate WBS code uniqueness within project
      // Validate WBS hierarchy

      const wbsElement = {
        wbsElementId: Math.floor(Math.random() * 1000000),
        wbsCode: dto.wbsCode,
        name: dto.name,
        elementType: dto.elementType,
        projectId: dto.projectId,
        parentId: dto.parentId,
        budgetAmount: dto.budgetAmount,
        createdAt: new Date(),
      };

      this.logger.log(`WBS element ${wbsElement.wbsCode} created with ID ${wbsElement.wbsElementId}`);

      return {
        wbsElementId: wbsElement.wbsElementId,
        wbsCode: wbsElement.wbsCode,
      };
    } catch (error) {
      this.logger.error(`Failed to create WBS element: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves WBS hierarchy for a project
   * @param projectId - Project identifier
   * @returns WBS tree structure
   */
  async getWBSHierarchy(projectId: number): Promise<any[]> {
    try {
      this.logger.log(`Retrieving WBS hierarchy for project ${projectId}`);

      // Database query to get WBS elements in hierarchical order
      const wbsElements: any[] = [];

      return wbsElements;
    } catch (error) {
      this.logger.error(`Failed to retrieve WBS hierarchy: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve WBS hierarchy');
    }
  }
}

/**
 * Time and expense service
 * Manages time entries and expense entries
 */
@Injectable()
export class TimeAndExpenseService {
  private readonly logger = new Logger(TimeAndExpenseService.name);

  /**
   * Creates a time entry
   * @param dto - Time entry request
   * @param transaction - Optional database transaction
   * @returns Created time entry
   */
  async createTimeEntry(
    dto: CreateTimeEntryRequestDto,
    transaction?: Transaction
  ): Promise<{ timeEntryId: number; status: TimeEntryStatus }> {
    try {
      this.logger.log(`Creating time entry for employee ${dto.employeeId} on project ${dto.projectId}`);

      // Validate project exists and is active
      // Validate WBS element if specified
      // Validate employee exists
      // Validate work date is within project dates
      // Validate hours are reasonable

      if (dto.hours < 0 || dto.hours > 24) {
        throw new BadRequestException('Hours must be between 0 and 24');
      }

      const timeEntry = {
        timeEntryId: Math.floor(Math.random() * 1000000),
        projectId: dto.projectId,
        wbsElementId: dto.wbsElementId,
        employeeId: dto.employeeId,
        workDate: dto.workDate,
        hours: dto.hours,
        overtimeHours: dto.overtimeHours,
        description: dto.description,
        billable: dto.billable ?? true,
        status: TimeEntryStatus.DRAFT,
        createdAt: new Date(),
      };

      this.logger.log(`Time entry ${timeEntry.timeEntryId} created with status ${timeEntry.status}`);

      return {
        timeEntryId: timeEntry.timeEntryId,
        status: timeEntry.status,
      };
    } catch (error) {
      this.logger.error(`Failed to create time entry: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Creates an expense entry
   * @param dto - Expense entry request
   * @param transaction - Optional database transaction
   * @returns Created expense entry
   */
  async createExpenseEntry(
    dto: CreateExpenseEntryRequestDto,
    transaction?: Transaction
  ): Promise<{ expenseEntryId: number; status: ExpenseEntryStatus }> {
    try {
      this.logger.log(`Creating expense entry for employee ${dto.employeeId} on project ${dto.projectId}`);

      // Validate project exists and is active
      // Validate WBS element if specified
      // Validate employee exists
      // Validate expense amount

      if (dto.amount < 0) {
        throw new BadRequestException('Expense amount must be non-negative');
      }

      const expenseEntry = {
        expenseEntryId: Math.floor(Math.random() * 1000000),
        projectId: dto.projectId,
        wbsElementId: dto.wbsElementId,
        employeeId: dto.employeeId,
        expenseDate: dto.expenseDate,
        category: dto.category,
        amount: dto.amount,
        description: dto.description,
        merchant: dto.merchant,
        receiptUrl: dto.receiptUrl,
        billable: dto.billable ?? true,
        reimbursable: dto.reimbursable ?? true,
        status: ExpenseEntryStatus.DRAFT,
        createdAt: new Date(),
      };

      this.logger.log(`Expense entry ${expenseEntry.expenseEntryId} created with status ${expenseEntry.status}`);

      return {
        expenseEntryId: expenseEntry.expenseEntryId,
        status: expenseEntry.status,
      };
    } catch (error) {
      this.logger.error(`Failed to create expense entry: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Approves a time entry
   * @param timeEntryId - Time entry identifier
   * @param approverId - Approver user ID
   * @param transaction - Optional database transaction
   * @returns Approval status
   */
  async approveTimeEntry(
    timeEntryId: number,
    approverId: number,
    transaction?: Transaction
  ): Promise<{ success: boolean; approvedDate: Date }> {
    try {
      this.logger.log(`Approving time entry ${timeEntryId} by user ${approverId}`);

      // Validate time entry exists
      // Validate current status is SUBMITTED
      // Update status to APPROVED
      // Record approver and approval date

      const approvedDate = new Date();

      this.logger.log(`Time entry ${timeEntryId} approved on ${approvedDate.toISOString()}`);

      return {
        success: true,
        approvedDate,
      };
    } catch (error) {
      this.logger.error(`Failed to approve time entry ${timeEntryId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Approves an expense entry
   * @param expenseEntryId - Expense entry identifier
   * @param approverId - Approver user ID
   * @param transaction - Optional database transaction
   * @returns Approval status
   */
  async approveExpenseEntry(
    expenseEntryId: number,
    approverId: number,
    transaction?: Transaction
  ): Promise<{ success: boolean; approvedDate: Date }> {
    try {
      this.logger.log(`Approving expense entry ${expenseEntryId} by user ${approverId}`);

      // Validate expense entry exists
      // Validate current status is SUBMITTED
      // Update status to APPROVED
      // Record approver and approval date

      const approvedDate = new Date();

      this.logger.log(`Expense entry ${expenseEntryId} approved on ${approvedDate.toISOString()}`);

      return {
        success: true,
        approvedDate,
      };
    } catch (error) {
      this.logger.error(`Failed to approve expense entry ${expenseEntryId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}

/**
 * Project budget service
 * Manages project budgets and budget control
 */
@Injectable()
export class ProjectBudgetService {
  private readonly logger = new Logger(ProjectBudgetService.name);

  /**
   * Creates a project budget
   * @param dto - Budget creation request
   * @param transaction - Optional database transaction
   * @returns Created budget
   */
  async createBudget(
    dto: CreateProjectBudgetRequestDto,
    transaction?: Transaction
  ): Promise<{ budgetId: number; budgetAmount: number }> {
    try {
      this.logger.log(`Creating budget for project ${dto.projectId}`);

      // Validate project exists
      // Validate WBS element if specified
      // Validate budget amounts
      // Check for existing budgets of same type

      const budget = {
        budgetId: Math.floor(Math.random() * 1000000),
        projectId: dto.projectId,
        wbsElementId: dto.wbsElementId,
        budgetType: dto.budgetType,
        fiscalYear: dto.fiscalYear,
        budgetAmount: dto.budgetAmount,
        laborBudget: dto.laborBudget,
        materialBudget: dto.materialBudget,
        equipmentBudget: dto.equipmentBudget,
        overheadBudget: dto.overheadBudget,
        contingencyPercentage: dto.contingencyPercentage,
        createdAt: new Date(),
      };

      this.logger.log(`Budget ${budget.budgetId} created with amount ${budget.budgetAmount}`);

      return {
        budgetId: budget.budgetId,
        budgetAmount: budget.budgetAmount,
      };
    } catch (error) {
      this.logger.error(`Failed to create budget: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Checks budget availability
   * @param projectId - Project identifier
   * @param wbsElementId - Optional WBS element identifier
   * @param amount - Amount to check
   * @returns Availability status
   */
  async checkBudgetAvailability(
    projectId: number,
    amount: number,
    wbsElementId?: number
  ): Promise<{ available: boolean; remainingBudget: number }> {
    try {
      this.logger.log(`Checking budget availability for project ${projectId}, amount ${amount}`);

      // Query current budget
      // Query consumed budget
      // Calculate remaining budget
      // Check if amount is available

      const budgetAmount = 100000;
      const consumedAmount = 45000;
      const remainingBudget = budgetAmount - consumedAmount;
      const available = amount <= remainingBudget;

      return {
        available,
        remainingBudget,
      };
    } catch (error) {
      this.logger.error(`Failed to check budget availability: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to check budget availability');
    }
  }
}

// ============================================================================
// MODULE DEFINITION
// ============================================================================

/**
 * Project management module
 * Exports all project management services
 */
@Module({
  providers: [
    ProjectHeaderService,
    WBSManagementService,
    TimeAndExpenseService,
    ProjectBudgetService,
  ],
  exports: [
    ProjectHeaderService,
    WBSManagementService,
    TimeAndExpenseService,
    ProjectBudgetService,
  ],
})
export class ProjectManagementModule {}
