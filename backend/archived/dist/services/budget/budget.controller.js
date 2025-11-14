"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const budget_service_1 = require("./budget.service");
const base_1 = require("../../common/base");
const dto_1 = require("./dto");
let BudgetController = class BudgetController extends base_1.BaseController {
    budgetService;
    constructor(budgetService) {
        super();
        this.budgetService = budgetService;
    }
    async getBudgetCategories(fiscalYear, activeOnly) {
        const active = activeOnly !== 'false';
        return this.budgetService.getBudgetCategories(fiscalYear, active);
    }
    async getBudgetCategoryById(id) {
        return this.budgetService.getBudgetCategoryById(id);
    }
    async createBudgetCategory(createDto) {
        return this.budgetService.createBudgetCategory(createDto);
    }
    async updateBudgetCategory(id, updateDto) {
        return this.budgetService.updateBudgetCategory(id, updateDto);
    }
    async deleteBudgetCategory(id) {
        return this.budgetService.deleteBudgetCategory(id);
    }
    async getBudgetTransactions(filters) {
        return this.budgetService.getBudgetTransactions(filters);
    }
    async createBudgetTransaction(createDto) {
        return this.budgetService.createBudgetTransaction(createDto);
    }
    async updateBudgetTransaction(id, updateDto) {
        return this.budgetService.updateBudgetTransaction(id, updateDto);
    }
    async deleteBudgetTransaction(id) {
        return this.budgetService.deleteBudgetTransaction(id);
    }
    async getBudgetSummary(fiscalYear) {
        return this.budgetService.getBudgetSummary(fiscalYear);
    }
    async getSpendingTrends(fiscalYear, categoryId) {
        return this.budgetService.getSpendingTrends(fiscalYear, categoryId);
    }
    async getOverBudgetCategories(fiscalYear) {
        return this.budgetService.getOverBudgetCategories(fiscalYear);
    }
    async getCategoryYearComparison(categoryName, years) {
        return this.budgetService.getCategoryYearComparison(categoryName, years);
    }
    async getBudgetRecommendations(fiscalYear) {
        return this.budgetService.getBudgetRecommendations(fiscalYear);
    }
    async exportBudgetData(fiscalYear) {
        return this.budgetService.exportBudgetData(fiscalYear);
    }
};
exports.BudgetController = BudgetController;
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get budget categories',
        description: 'Retrieves budget categories for a specific fiscal year with optional filtering',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'fiscalYear',
        required: false,
        type: Number,
        description: 'Fiscal year (defaults to current year)',
        example: 2024,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'activeOnly',
        required: false,
        type: Boolean,
        description: 'Filter to active categories only',
        example: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Budget categories retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/budget-category.model").BudgetCategory] }),
    __param(0, (0, common_1.Query)('fiscalYear', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('activeOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getBudgetCategories", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get a single budget category by ID\nGET /budget/categories/:id", summary: 'Get budget category by ID',
        description: 'Retrieves a single budget category with detailed information' }),
    (0, common_1.Get)('categories/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Budget category UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Budget category retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Budget category not found',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/budget-category.model").BudgetCategory }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getBudgetCategoryById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a new budget category\nPOST /budget/categories", summary: 'Create budget category',
        description: 'Creates a new budget category with allocated budget amount' }),
    (0, common_1.Post)('categories'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({
        type: dto_1.CreateBudgetCategoryDto,
        description: 'Budget category creation data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Budget category created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data - validation error',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - admin privileges required',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../../database/models/budget-category.model").BudgetCategory }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBudgetCategoryDto]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "createBudgetCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update a budget category\nPATCH /budget/categories/:id", summary: 'Update budget category',
        description: 'Updates an existing budget category with new information' }),
    (0, common_1.Patch)('categories/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Budget category UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiBody)({
        type: dto_1.UpdateBudgetCategoryDto,
        description: 'Budget category update data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Budget category updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data - validation error',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - admin privileges required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Budget category not found',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/budget-category.model").BudgetCategory }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateBudgetCategoryDto]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "updateBudgetCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete a budget category (soft delete)\nDELETE /budget/categories/:id", summary: 'Delete budget category',
        description: 'Soft deletes a budget category (marks as inactive)' }),
    (0, common_1.Delete)('categories/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Budget category UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Budget category deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - admin privileges required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Budget category not found',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "deleteBudgetCategory", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get budget transactions',
        description: 'Retrieves budget transactions with filtering and pagination',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Budget transactions retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BudgetTransactionFiltersDto]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getBudgetTransactions", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a new budget transaction\nPOST /budget/transactions", summary: 'Create budget transaction',
        description: 'Records a new budget transaction (income or expense)' }),
    (0, common_1.Post)('transactions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({
        type: dto_1.CreateBudgetTransactionDto,
        description: 'Budget transaction creation data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Budget transaction created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data - validation error',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - admin privileges required',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../../database/models/budget-transaction.model").BudgetTransaction }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBudgetTransactionDto]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "createBudgetTransaction", null);
__decorate([
    openapi.ApiOperation({ summary: "Update a budget transaction\nPATCH /budget/transactions/:id" }),
    (0, common_1.Patch)('transactions/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/budget-transaction.model").BudgetTransaction }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateBudgetTransactionDto]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "updateBudgetTransaction", null);
__decorate([
    openapi.ApiOperation({ summary: "Delete a budget transaction\nDELETE /budget/transactions/:id" }),
    (0, common_1.Delete)('transactions/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "deleteBudgetTransaction", null);
__decorate([
    (0, common_1.Get)('summary'),
    openapi.ApiResponse({ status: 200, type: require("./dto/budget-summary.dto").BudgetSummaryDto }),
    __param(0, (0, common_1.Query)('fiscalYear', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getBudgetSummary", null);
__decorate([
    openapi.ApiOperation({ summary: "Get spending trends by month\nGET /budget/trends?fiscalYear=2024&categoryId=uuid" }),
    (0, common_1.Get)('trends'),
    openapi.ApiResponse({ status: 200, type: [require("./dto/spending-trend.dto").SpendingTrendDto] }),
    __param(0, (0, common_1.Query)('fiscalYear', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('categoryId', new common_1.ParseUUIDPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getSpendingTrends", null);
__decorate([
    openapi.ApiOperation({ summary: "Get over-budget categories\nGET /budget/over-budget?fiscalYear=2024" }),
    (0, common_1.Get)('over-budget'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('fiscalYear', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getOverBudgetCategories", null);
__decorate([
    openapi.ApiOperation({ summary: "Get category year-over-year comparison\nGET /budget/comparison/Medical%20Supplies?years=2023,2024" }),
    (0, common_1.Get)('comparison/:categoryName'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('categoryName')),
    __param(1, (0, common_1.Query)('years', new common_1.ParseArrayPipe({ items: Number, separator: ',' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getCategoryYearComparison", null);
__decorate([
    openapi.ApiOperation({ summary: "Get budget recommendations\nGET /budget/recommendations?fiscalYear=2024" }),
    (0, common_1.Get)('recommendations'),
    openapi.ApiResponse({ status: 200, type: [require("./dto/budget-recommendation.dto").BudgetRecommendationDto] }),
    __param(0, (0, common_1.Query)('fiscalYear', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "getBudgetRecommendations", null);
__decorate([
    openapi.ApiOperation({ summary: "Export complete budget data for a fiscal year\nGET /budget/export?fiscalYear=2024" }),
    (0, common_1.Get)('export'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('fiscalYear', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BudgetController.prototype, "exportBudgetData", null);
exports.BudgetController = BudgetController = __decorate([
    (0, swagger_1.ApiTags)('Budget'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('budget'),
    __metadata("design:paramtypes", [budget_service_1.BudgetService])
], BudgetController);
//# sourceMappingURL=budget.controller.js.map