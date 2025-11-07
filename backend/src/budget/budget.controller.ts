import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  ParseArrayPipe,
  ValidationPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { CreateBudgetCategoryDto } from './dto/create-budget-category.dto';
import { UpdateBudgetCategoryDto } from './dto/update-budget-category.dto';
import { CreateBudgetTransactionDto } from './dto/create-budget-transaction.dto';
import { UpdateBudgetTransactionDto } from './dto/update-budget-transaction.dto';
import { BudgetTransactionFiltersDto } from './dto/budget-transaction-filters.dto';

/**
 * Budget Controller
 *
 * Handles all budget-related HTTP requests including:
 * - Budget category CRUD operations
 * - Budget transaction management
 * - Financial reporting and analytics
 * - Budget recommendations and exports
 *
 * All endpoints require authentication.
 * Write operations (POST, PATCH, DELETE) require admin role.
 */
@ApiTags('Budget')
@ApiBearerAuth()
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  // ==================== Budget Category Endpoints ====================

  /**
   * Get all budget categories for a fiscal year
   * GET /budget/categories?fiscalYear=2024&activeOnly=true
   */
  @Get('categories')
  @ApiOperation({
    summary: 'Get budget categories',
    description:
      'Retrieves budget categories for a specific fiscal year with optional filtering',
  })
  @ApiQuery({
    name: 'fiscalYear',
    required: false,
    type: Number,
    description: 'Fiscal year (defaults to current year)',
    example: 2024,
  })
  @ApiQuery({
    name: 'activeOnly',
    required: false,
    type: Boolean,
    description: 'Filter to active categories only',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Budget categories retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async getBudgetCategories(
    @Query('fiscalYear', new ParseIntPipe({ optional: true }))
    fiscalYear?: number,
    @Query('activeOnly') activeOnly?: string,
  ) {
    const active = activeOnly !== 'false';
    return this.budgetService.getBudgetCategories(fiscalYear, active);
  }

  /**
   * Get a single budget category by ID
   * GET /budget/categories/:id
   */
  @Get('categories/:id')
  @ApiOperation({
    summary: 'Get budget category by ID',
    description: 'Retrieves a single budget category with detailed information',
  })
  @ApiParam({
    name: 'id',
    description: 'Budget category UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Budget category retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Budget category not found',
  })
  async getBudgetCategoryById(@Param('id', ParseUUIDPipe) id: string) {
    return this.budgetService.getBudgetCategoryById(id);
  }

  /**
   * Create a new budget category
   * POST /budget/categories
   */
  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create budget category',
    description: 'Creates a new budget category with allocated budget amount',
  })
  @ApiBody({
    type: CreateBudgetCategoryDto,
    description: 'Budget category creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Budget category created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data - validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin privileges required',
  })
  async createBudgetCategory(
    @Body(ValidationPipe) createDto: CreateBudgetCategoryDto,
  ) {
    return this.budgetService.createBudgetCategory(createDto);
  }

  /**
   * Update a budget category
   * PATCH /budget/categories/:id
   */
  @Patch('categories/:id')
  @ApiOperation({
    summary: 'Update budget category',
    description: 'Updates an existing budget category with new information',
  })
  @ApiParam({
    name: 'id',
    description: 'Budget category UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    type: UpdateBudgetCategoryDto,
    description: 'Budget category update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Budget category updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data - validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin privileges required',
  })
  @ApiResponse({
    status: 404,
    description: 'Budget category not found',
  })
  async updateBudgetCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: UpdateBudgetCategoryDto,
  ) {
    return this.budgetService.updateBudgetCategory(id, updateDto);
  }

  /**
   * Delete a budget category (soft delete)
   * DELETE /budget/categories/:id
   */
  @Delete('categories/:id')
  @ApiOperation({
    summary: 'Delete budget category',
    description: 'Soft deletes a budget category (marks as inactive)',
  })
  @ApiParam({
    name: 'id',
    description: 'Budget category UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Budget category deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin privileges required',
  })
  @ApiResponse({
    status: 404,
    description: 'Budget category not found',
  })
  async deleteBudgetCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.budgetService.deleteBudgetCategory(id);
  }

  // ==================== Budget Transaction Endpoints ====================

  /**
   * Get budget transactions with filters
   * GET /budget/transactions?categoryId=uuid&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=20
   */
  @Get('transactions')
  @ApiOperation({
    summary: 'Get budget transactions',
    description: 'Retrieves budget transactions with filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Budget transactions retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async getBudgetTransactions(
    @Query(new ValidationPipe({ transform: true }))
    filters: BudgetTransactionFiltersDto,
  ) {
    return this.budgetService.getBudgetTransactions(filters);
  }

  /**
   * Create a new budget transaction
   * POST /budget/transactions
   */
  @Post('transactions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create budget transaction',
    description: 'Records a new budget transaction (income or expense)',
  })
  @ApiBody({
    type: CreateBudgetTransactionDto,
    description: 'Budget transaction creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Budget transaction created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data - validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin privileges required',
  })
  async createBudgetTransaction(
    @Body(ValidationPipe) createDto: CreateBudgetTransactionDto,
  ) {
    return this.budgetService.createBudgetTransaction(createDto);
  }

  /**
   * Update a budget transaction
   * PATCH /budget/transactions/:id
   */
  @Patch('transactions/:id')
  async updateBudgetTransaction(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: UpdateBudgetTransactionDto,
  ) {
    return this.budgetService.updateBudgetTransaction(id, updateDto);
  }

  /**
   * Delete a budget transaction
   * DELETE /budget/transactions/:id
   */
  @Delete('transactions/:id')
  async deleteBudgetTransaction(@Param('id', ParseUUIDPipe) id: string) {
    return this.budgetService.deleteBudgetTransaction(id);
  }

  // ==================== Financial Reporting Endpoints ====================

  /**
   * Get budget summary for a fiscal year
   * GET /budget/summary?fiscalYear=2024
   */
  @Get('summary')
  async getBudgetSummary(
    @Query('fiscalYear', new ParseIntPipe({ optional: true }))
    fiscalYear?: number,
  ) {
    return this.budgetService.getBudgetSummary(fiscalYear);
  }

  /**
   * Get spending trends by month
   * GET /budget/trends?fiscalYear=2024&categoryId=uuid
   */
  @Get('trends')
  async getSpendingTrends(
    @Query('fiscalYear', new ParseIntPipe({ optional: true }))
    fiscalYear?: number,
    @Query('categoryId', new ParseUUIDPipe({ optional: true }))
    categoryId?: string,
  ) {
    return this.budgetService.getSpendingTrends(fiscalYear, categoryId);
  }

  /**
   * Get over-budget categories
   * GET /budget/over-budget?fiscalYear=2024
   */
  @Get('over-budget')
  async getOverBudgetCategories(
    @Query('fiscalYear', new ParseIntPipe({ optional: true }))
    fiscalYear?: number,
  ) {
    return this.budgetService.getOverBudgetCategories(fiscalYear);
  }

  /**
   * Get category year-over-year comparison
   * GET /budget/comparison/Medical%20Supplies?years=2023,2024
   */
  @Get('comparison/:categoryName')
  async getCategoryYearComparison(
    @Param('categoryName') categoryName: string,
    @Query('years', new ParseArrayPipe({ items: Number, separator: ',' }))
    years: number[],
  ) {
    return this.budgetService.getCategoryYearComparison(categoryName, years);
  }

  /**
   * Get budget recommendations
   * GET /budget/recommendations?fiscalYear=2024
   */
  @Get('recommendations')
  async getBudgetRecommendations(
    @Query('fiscalYear', new ParseIntPipe({ optional: true }))
    fiscalYear?: number,
  ) {
    return this.budgetService.getBudgetRecommendations(fiscalYear);
  }

  /**
   * Export complete budget data for a fiscal year
   * GET /budget/export?fiscalYear=2024
   */
  @Get('export')
  async exportBudgetData(
    @Query('fiscalYear', new ParseIntPipe({ optional: true }))
    fiscalYear?: number,
  ) {
    return this.budgetService.exportBudgetData(fiscalYear);
  }
}
