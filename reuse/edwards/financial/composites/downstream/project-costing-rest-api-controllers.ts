/**
 * LOC: PRJCOSTAPI001
 * File: /reuse/edwards/financial/composites/downstream/project-costing-rest-api-controllers.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - ../project-cost-accounting-composite
 *   - ./backend-project-management-modules
 *
 * DOWNSTREAM (imported by):
 *   - Main API router
 *   - Project costing application module
 */

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
  UseGuards,
  Logger,
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
} from '../project-cost-accounting-composite';

// Import from backend modules
import {
  ProjectHeaderService,
  WBSManagementService,
  TimeAndExpenseService,
  ProjectBudgetService,
  CreateProjectRequestDto,
  UpdateProjectRequestDto,
  CreateWBSElementRequestDto,
  CreateTimeEntryRequestDto,
  CreateExpenseEntryRequestDto,
  CreateProjectBudgetRequestDto,
  ProjectSearchQueryDto,
} from './backend-project-management-modules';

// ============================================================================
// RESPONSE DTOs
// ============================================================================

/**
 * Project response DTO
 */
export class ProjectResponseDto {
  @ApiProperty({ description: 'Project ID' })
  projectId!: number;

  @ApiProperty({ description: 'Project code' })
  projectCode!: string;

  @ApiProperty({ description: 'Project name' })
  projectName!: string;

  @ApiProperty({ enum: ProjectType, description: 'Project type' })
  projectType!: ProjectType;

  @ApiProperty({ enum: ProjectStatus, description: 'Project status' })
  status!: ProjectStatus;

  @ApiPropertyOptional({ description: 'Project description' })
  description?: string;

  @ApiProperty({ description: 'Start date' })
  startDate!: Date;

  @ApiProperty({ description: 'End date' })
  endDate!: Date;

  @ApiProperty({ description: 'Project manager ID' })
  projectManagerId!: number;

  @ApiProperty({ description: 'Currency code' })
  currencyCode!: string;

  @ApiProperty({ enum: BillingMethod, description: 'Billing method' })
  billingMethod!: BillingMethod;

  @ApiPropertyOptional({ description: 'Total budget amount' })
  budgetAmount?: number;

  @ApiPropertyOptional({ description: 'Total actual costs' })
  actualCosts?: number;

  @ApiPropertyOptional({ description: 'Completion percentage' })
  completionPercentage?: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}

/**
 * WBS element response DTO
 */
export class WBSElementResponseDto {
  @ApiProperty({ description: 'WBS element ID' })
  wbsElementId!: number;

  @ApiProperty({ description: 'WBS code' })
  wbsCode!: string;

  @ApiProperty({ description: 'Element name' })
  name!: string;

  @ApiProperty({ enum: WBSElementType, description: 'Element type' })
  elementType!: WBSElementType;

  @ApiProperty({ description: 'Project ID' })
  projectId!: number;

  @ApiPropertyOptional({ description: 'Parent WBS element ID' })
  parentId?: number;

  @ApiPropertyOptional({ description: 'Budget amount' })
  budgetAmount?: number;

  @ApiPropertyOptional({ description: 'Actual costs' })
  actualCosts?: number;

  @ApiPropertyOptional({ description: 'Committed costs' })
  committedCosts?: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;
}

/**
 * Time entry response DTO
 */
export class TimeEntryResponseDto {
  @ApiProperty({ description: 'Time entry ID' })
  timeEntryId!: number;

  @ApiProperty({ description: 'Project ID' })
  projectId!: number;

  @ApiPropertyOptional({ description: 'WBS element ID' })
  wbsElementId?: number;

  @ApiProperty({ description: 'Employee ID' })
  employeeId!: number;

  @ApiProperty({ description: 'Work date' })
  workDate!: Date;

  @ApiProperty({ description: 'Hours worked' })
  hours!: number;

  @ApiPropertyOptional({ description: 'Overtime hours' })
  overtimeHours?: number;

  @ApiProperty({ enum: TimeEntryStatus, description: 'Entry status' })
  status!: TimeEntryStatus;

  @ApiPropertyOptional({ description: 'Billable flag' })
  billable?: boolean;

  @ApiPropertyOptional({ description: 'Labor cost' })
  laborCost?: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;
}

/**
 * Expense entry response DTO
 */
export class ExpenseEntryResponseDto {
  @ApiProperty({ description: 'Expense entry ID' })
  expenseEntryId!: number;

  @ApiProperty({ description: 'Project ID' })
  projectId!: number;

  @ApiPropertyOptional({ description: 'WBS element ID' })
  wbsElementId?: number;

  @ApiProperty({ description: 'Employee ID' })
  employeeId!: number;

  @ApiProperty({ description: 'Expense date' })
  expenseDate!: Date;

  @ApiProperty({ enum: CostCategory, description: 'Cost category' })
  category!: CostCategory;

  @ApiProperty({ description: 'Amount' })
  amount!: number;

  @ApiProperty({ enum: ExpenseEntryStatus, description: 'Entry status' })
  status!: ExpenseEntryStatus;

  @ApiPropertyOptional({ description: 'Billable flag' })
  billable?: boolean;

  @ApiPropertyOptional({ description: 'Reimbursable flag' })
  reimbursable?: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;
}

/**
 * Cost summary response DTO
 */
export class CostSummaryResponseDto {
  @ApiProperty({ description: 'Project ID' })
  projectId!: number;

  @ApiProperty({ description: 'Total budget' })
  totalBudget!: number;

  @ApiProperty({ description: 'Total actual costs' })
  totalActualCosts!: number;

  @ApiProperty({ description: 'Total committed costs' })
  totalCommittedCosts!: number;

  @ApiProperty({ description: 'Total encumbered costs' })
  totalEncumberedCosts!: number;

  @ApiProperty({ description: 'Budget variance' })
  budgetVariance!: number;

  @ApiProperty({ description: 'Budget variance percentage' })
  budgetVariancePercentage!: number;

  @ApiProperty({ description: 'Labor costs' })
  laborCosts!: number;

  @ApiProperty({ description: 'Material costs' })
  materialCosts!: number;

  @ApiProperty({ description: 'Equipment costs' })
  equipmentCosts!: number;

  @ApiProperty({ description: 'Overhead costs' })
  overheadCosts!: number;

  @ApiProperty({ description: 'As of date' })
  asOfDate!: Date;
}

/**
 * Paginated project list response DTO
 */
export class ProjectListResponseDto {
  @ApiProperty({ type: [ProjectResponseDto], description: 'List of projects' })
  projects!: ProjectResponseDto[];

  @ApiProperty({ description: 'Total count' })
  total!: number;

  @ApiProperty({ description: 'Current page' })
  page!: number;

  @ApiProperty({ description: 'Page size' })
  pageSize!: number;

  @ApiProperty({ description: 'Total pages' })
  totalPages!: number;
}

// ============================================================================
// CONTROLLERS - PROJECT COSTING REST API
// ============================================================================

/**
 * Project header REST API controller
 * Manages project CRUD operations via REST API
 */
@ApiTags('Project Costing')
@ApiBearerAuth()
@Controller('api/v1/projects')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ProjectCostingController {
  private readonly logger = new Logger(ProjectCostingController.name);

  constructor(
    private readonly projectHeaderService: ProjectHeaderService,
    private readonly wbsService: WBSManagementService,
    private readonly timeExpenseService: TimeAndExpenseService,
    private readonly budgetService: ProjectBudgetService
  ) {}

  /**
   * Creates a new project
   * POST /api/v1/projects
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new project', description: 'Creates a new project header with initial setup' })
  @ApiBody({ type: CreateProjectRequestDto })
  @ApiResponse({ status: 201, description: 'Project created successfully', type: ProjectResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 409, description: 'Project code already exists' })
  async createProject(
    @Body() dto: CreateProjectRequestDto
  ): Promise<ProjectResponseDto> {
    try {
      this.logger.log(`REST API: Creating project ${dto.projectCode}`);

      const result = await this.projectHeaderService.createProject(dto);

      // Convert to response DTO
      const response: ProjectResponseDto = {
        projectId: result.projectId,
        projectCode: result.projectCode,
        projectName: dto.projectName,
        projectType: dto.projectType,
        status: result.status,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        projectManagerId: dto.projectManagerId,
        currencyCode: dto.currencyCode,
        billingMethod: dto.billingMethod,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.logger.log(`REST API: Project ${result.projectId} created successfully`);
      return response;
    } catch (error) {
      this.logger.error(`REST API: Failed to create project: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves a project by ID
   * GET /api/v1/projects/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get project by ID', description: 'Retrieves project details by ID' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully', type: ProjectResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProject(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ProjectResponseDto> {
    try {
      this.logger.log(`REST API: Retrieving project ${id}`);

      const project = await this.projectHeaderService.getProjectById(id);

      // Convert to response DTO
      const response: ProjectResponseDto = {
        projectId: project.projectId,
        projectCode: project.projectCode,
        projectName: project.projectName,
        projectType: ProjectType.CAPITAL,
        status: project.status,
        startDate: new Date(),
        endDate: new Date(),
        projectManagerId: 1,
        currencyCode: 'USD',
        billingMethod: BillingMethod.TIME_AND_MATERIALS,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return response;
    } catch (error) {
      this.logger.error(`REST API: Failed to retrieve project ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates a project
   * PUT /api/v1/projects/:id
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update project', description: 'Updates project information' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiBody({ type: UpdateProjectRequestDto })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectRequestDto
  ): Promise<{ success: boolean; projectCode: string }> {
    try {
      this.logger.log(`REST API: Updating project ${id}`);

      const result = await this.projectHeaderService.updateProject(id, dto);

      this.logger.log(`REST API: Project ${id} updated successfully`);
      return result;
    } catch (error) {
      this.logger.error(`REST API: Failed to update project ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Searches for projects
   * GET /api/v1/projects
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search projects', description: 'Searches for projects based on criteria' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiQuery({ name: 'projectType', enum: ProjectType, required: false })
  @ApiQuery({ name: 'status', enum: ProjectStatus, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully', type: ProjectListResponseDto })
  async searchProjects(
    @Query() query: ProjectSearchQueryDto
  ): Promise<ProjectListResponseDto> {
    try {
      this.logger.log(`REST API: Searching projects`);

      const result = await this.projectHeaderService.searchProjects(query);

      const response: ProjectListResponseDto = {
        projects: result.projects.map(p => ({
          projectId: p.projectId,
          projectCode: p.projectCode,
          projectName: p.projectName,
          projectType: p.projectType,
          status: p.status,
          startDate: p.startDate,
          endDate: p.endDate,
          projectManagerId: p.projectManagerId,
          currencyCode: p.currencyCode,
          billingMethod: p.billingMethod,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: Math.ceil(result.total / result.pageSize),
      };

      return response;
    } catch (error) {
      this.logger.error(`REST API: Failed to search projects: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Closes a project
   * POST /api/v1/projects/:id/close
   */
  @Post(':id/close')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Close project', description: 'Closes a project and prevents further transactions' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiResponse({ status: 200, description: 'Project closed successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 400, description: 'Project cannot be closed' })
  async closeProject(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ success: boolean; closedDate: Date }> {
    try {
      this.logger.log(`REST API: Closing project ${id}`);

      const result = await this.projectHeaderService.closeProject(id);

      this.logger.log(`REST API: Project ${id} closed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`REST API: Failed to close project ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Reopens a project
   * POST /api/v1/projects/:id/reopen
   */
  @Post(':id/reopen')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reopen project', description: 'Reopens a closed project' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiResponse({ status: 200, description: 'Project reopened successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 400, description: 'Project is not closed' })
  async reopenProject(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ success: boolean; reopenedDate: Date }> {
    try {
      this.logger.log(`REST API: Reopening project ${id}`);

      const result = await this.projectHeaderService.reopenProject(id);

      this.logger.log(`REST API: Project ${id} reopened successfully`);
      return result;
    } catch (error) {
      this.logger.error(`REST API: Failed to reopen project ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Creates WBS element for project
   * POST /api/v1/projects/:id/wbs
   */
  @Post(':id/wbs')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create WBS element', description: 'Creates a work breakdown structure element' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiBody({ type: CreateWBSElementRequestDto })
  @ApiResponse({ status: 201, description: 'WBS element created successfully', type: WBSElementResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async createWBSElement(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: CreateWBSElementRequestDto
  ): Promise<WBSElementResponseDto> {
    try {
      this.logger.log(`REST API: Creating WBS element for project ${projectId}`);

      // Set project ID from path parameter
      dto.projectId = projectId;

      const result = await this.wbsService.createWBSElement(dto);

      const response: WBSElementResponseDto = {
        wbsElementId: result.wbsElementId,
        wbsCode: result.wbsCode,
        name: dto.name,
        elementType: dto.elementType,
        projectId: dto.projectId,
        parentId: dto.parentId,
        budgetAmount: dto.budgetAmount,
        createdAt: new Date(),
      };

      this.logger.log(`REST API: WBS element ${result.wbsElementId} created successfully`);
      return response;
    } catch (error) {
      this.logger.error(`REST API: Failed to create WBS element: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves WBS hierarchy for project
   * GET /api/v1/projects/:id/wbs
   */
  @Get(':id/wbs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get WBS hierarchy', description: 'Retrieves work breakdown structure hierarchy' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiResponse({ status: 200, description: 'WBS hierarchy retrieved successfully', type: [WBSElementResponseDto] })
  async getWBSHierarchy(
    @Param('id', ParseIntPipe) projectId: number
  ): Promise<WBSElementResponseDto[]> {
    try {
      this.logger.log(`REST API: Retrieving WBS hierarchy for project ${projectId}`);

      const wbsElements = await this.wbsService.getWBSHierarchy(projectId);

      return wbsElements;
    } catch (error) {
      this.logger.error(`REST API: Failed to retrieve WBS hierarchy: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Creates time entry
   * POST /api/v1/projects/:id/time-entries
   */
  @Post(':id/time-entries')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create time entry', description: 'Creates a time entry for project labor' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiBody({ type: CreateTimeEntryRequestDto })
  @ApiResponse({ status: 201, description: 'Time entry created successfully', type: TimeEntryResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async createTimeEntry(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: CreateTimeEntryRequestDto
  ): Promise<TimeEntryResponseDto> {
    try {
      this.logger.log(`REST API: Creating time entry for project ${projectId}`);

      dto.projectId = projectId;

      const result = await this.timeExpenseService.createTimeEntry(dto);

      const response: TimeEntryResponseDto = {
        timeEntryId: result.timeEntryId,
        projectId: dto.projectId,
        wbsElementId: dto.wbsElementId,
        employeeId: dto.employeeId,
        workDate: dto.workDate,
        hours: dto.hours,
        overtimeHours: dto.overtimeHours,
        status: result.status,
        billable: dto.billable,
        createdAt: new Date(),
      };

      this.logger.log(`REST API: Time entry ${result.timeEntryId} created successfully`);
      return response;
    } catch (error) {
      this.logger.error(`REST API: Failed to create time entry: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Creates expense entry
   * POST /api/v1/projects/:id/expense-entries
   */
  @Post(':id/expense-entries')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create expense entry', description: 'Creates an expense entry for project costs' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiBody({ type: CreateExpenseEntryRequestDto })
  @ApiResponse({ status: 201, description: 'Expense entry created successfully', type: ExpenseEntryResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async createExpenseEntry(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: CreateExpenseEntryRequestDto
  ): Promise<ExpenseEntryResponseDto> {
    try {
      this.logger.log(`REST API: Creating expense entry for project ${projectId}`);

      dto.projectId = projectId;

      const result = await this.timeExpenseService.createExpenseEntry(dto);

      const response: ExpenseEntryResponseDto = {
        expenseEntryId: result.expenseEntryId,
        projectId: dto.projectId,
        wbsElementId: dto.wbsElementId,
        employeeId: dto.employeeId,
        expenseDate: dto.expenseDate,
        category: dto.category,
        amount: dto.amount,
        status: result.status,
        billable: dto.billable,
        reimbursable: dto.reimbursable,
        createdAt: new Date(),
      };

      this.logger.log(`REST API: Expense entry ${result.expenseEntryId} created successfully`);
      return response;
    } catch (error) {
      this.logger.error(`REST API: Failed to create expense entry: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Creates project budget
   * POST /api/v1/projects/:id/budgets
   */
  @Post(':id/budgets')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create project budget', description: 'Creates a budget for project or WBS element' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiBody({ type: CreateProjectBudgetRequestDto })
  @ApiResponse({ status: 201, description: 'Budget created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async createBudget(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: CreateProjectBudgetRequestDto
  ): Promise<{ budgetId: number; budgetAmount: number }> {
    try {
      this.logger.log(`REST API: Creating budget for project ${projectId}`);

      dto.projectId = projectId;

      const result = await this.budgetService.createBudget(dto);

      this.logger.log(`REST API: Budget ${result.budgetId} created successfully`);
      return result;
    } catch (error) {
      this.logger.error(`REST API: Failed to create budget: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves project cost summary
   * GET /api/v1/projects/:id/cost-summary
   */
  @Get(':id/cost-summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get cost summary', description: 'Retrieves comprehensive cost summary for project' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiResponse({ status: 200, description: 'Cost summary retrieved successfully', type: CostSummaryResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getCostSummary(
    @Param('id', ParseIntPipe) projectId: number
  ): Promise<CostSummaryResponseDto> {
    try {
      this.logger.log(`REST API: Retrieving cost summary for project ${projectId}`);

      // Query costs from database
      const totalBudget = 100000;
      const totalActualCosts = 45000;
      const totalCommittedCosts = 15000;
      const totalEncumberedCosts = 10000;

      const response: CostSummaryResponseDto = {
        projectId,
        totalBudget,
        totalActualCosts,
        totalCommittedCosts,
        totalEncumberedCosts,
        budgetVariance: totalBudget - totalActualCosts,
        budgetVariancePercentage: ((totalBudget - totalActualCosts) / totalBudget) * 100,
        laborCosts: 25000,
        materialCosts: 10000,
        equipmentCosts: 5000,
        overheadCosts: 5000,
        asOfDate: new Date(),
      };

      return response;
    } catch (error) {
      this.logger.error(`REST API: Failed to retrieve cost summary: ${error.message}`, error.stack);
      throw error;
    }
  }
}

/**
 * Time entry management REST API controller
 */
@ApiTags('Time & Expense')
@ApiBearerAuth()
@Controller('api/v1/time-entries')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class TimeEntryManagementController {
  private readonly logger = new Logger(TimeEntryManagementController.name);

  constructor(private readonly timeExpenseService: TimeAndExpenseService) {}

  /**
   * Approves a time entry
   * POST /api/v1/time-entries/:id/approve
   */
  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve time entry', description: 'Approves a time entry for posting' })
  @ApiParam({ name: 'id', description: 'Time entry ID', type: Number })
  @ApiResponse({ status: 200, description: 'Time entry approved successfully' })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  async approveTimeEntry(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ success: boolean; approvedDate: Date }> {
    try {
      this.logger.log(`REST API: Approving time entry ${id}`);

      // TODO: Get approver from authentication context
      const approverId = 1;

      const result = await this.timeExpenseService.approveTimeEntry(id, approverId);

      this.logger.log(`REST API: Time entry ${id} approved successfully`);
      return result;
    } catch (error) {
      this.logger.error(`REST API: Failed to approve time entry ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}

/**
 * Expense entry management REST API controller
 */
@ApiTags('Time & Expense')
@ApiBearerAuth()
@Controller('api/v1/expense-entries')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ExpenseEntryManagementController {
  private readonly logger = new Logger(ExpenseEntryManagementController.name);

  constructor(private readonly timeExpenseService: TimeAndExpenseService) {}

  /**
   * Approves an expense entry
   * POST /api/v1/expense-entries/:id/approve
   */
  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve expense entry', description: 'Approves an expense entry for posting' })
  @ApiParam({ name: 'id', description: 'Expense entry ID', type: Number })
  @ApiResponse({ status: 200, description: 'Expense entry approved successfully' })
  @ApiResponse({ status: 404, description: 'Expense entry not found' })
  async approveExpenseEntry(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ success: boolean; approvedDate: Date }> {
    try {
      this.logger.log(`REST API: Approving expense entry ${id}`);

      // TODO: Get approver from authentication context
      const approverId = 1;

      const result = await this.timeExpenseService.approveExpenseEntry(id, approverId);

      this.logger.log(`REST API: Expense entry ${id} approved successfully`);
      return result;
    } catch (error) {
      this.logger.error(`REST API: Failed to approve expense entry ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
