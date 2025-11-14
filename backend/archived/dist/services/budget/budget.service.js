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
exports.BudgetService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../database");
const base_1 = require("../../common/base");
const dto_1 = require("./dto");
let BudgetService = class BudgetService extends base_1.BaseService {
    budgetCategoryModel;
    budgetTransactionModel;
    constructor(budgetCategoryModel, budgetTransactionModel) {
        super('BudgetService');
        this.budgetCategoryModel = budgetCategoryModel;
        this.budgetTransactionModel = budgetTransactionModel;
    }
    async getBudgetCategories(fiscalYear, activeOnly = true) {
        const currentYear = fiscalYear || new Date().getFullYear();
        const where = { fiscalYear: currentYear };
        if (activeOnly) {
            where.isActive = true;
        }
        const categories = await this.budgetCategoryModel.findAll({
            where,
            include: [
                {
                    model: this.budgetTransactionModel,
                    as: 'transactions',
                    order: [['transactionDate', 'DESC']],
                },
            ],
            order: [['name', 'ASC']],
        });
        categories.forEach((category) => {
            if (category.transactions) {
                category.transactions = category.transactions.slice(0, 5);
            }
        });
        return categories;
    }
    async getBudgetCategoryById(id) {
        const category = await this.budgetCategoryModel.findOne({
            where: { id },
            include: [
                {
                    model: this.budgetTransactionModel,
                    as: 'transactions',
                    order: [['transactionDate', 'DESC']],
                },
            ],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Budget category with ID ${id} not found`);
        }
        return category;
    }
    async createBudgetCategory(createDto) {
        const existing = await this.budgetCategoryModel.findOne({
            where: {
                name: createDto.name,
                fiscalYear: createDto.fiscalYear,
                isActive: true,
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Budget category '${createDto.name}' already exists for fiscal year ${createDto.fiscalYear}`);
        }
        const category = await this.budgetCategoryModel.create({
            name: createDto.name,
            description: createDto.description || null,
            fiscalYear: createDto.fiscalYear,
            allocatedAmount: createDto.allocatedAmount,
            spentAmount: 0,
            isActive: true,
        });
        this.logInfo(`Budget category created: ${category.name} for FY${category.fiscalYear}`);
        return category;
    }
    async updateBudgetCategory(id, updateDto) {
        const category = await this.getBudgetCategoryById(id);
        if (updateDto.name && updateDto.name !== category.name) {
            const existing = await this.budgetCategoryModel.findOne({
                where: {
                    name: updateDto.name,
                    fiscalYear: category.fiscalYear,
                    isActive: true,
                    id: { [sequelize_2.Op.ne]: id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException(`Budget category '${updateDto.name}' already exists for fiscal year ${category.fiscalYear}`);
            }
        }
        Object.assign(category, updateDto);
        await category.save();
        this.logInfo(`Budget category updated: ${category.name}`);
        return category;
    }
    async deleteBudgetCategory(id) {
        const category = await this.getBudgetCategoryById(id);
        category.isActive = false;
        await category.save();
        this.logInfo(`Budget category soft deleted: ${category.name}`);
        return { success: true };
    }
    async createBudgetTransaction(createDto) {
        const sequelize = this.budgetCategoryModel.sequelize;
        return await sequelize.transaction(async (transaction) => {
            const category = await this.budgetCategoryModel.findOne({
                where: { id: createDto.categoryId },
                transaction,
            });
            if (!category) {
                throw new common_1.NotFoundException(`Budget category with ID ${createDto.categoryId} not found`);
            }
            if (!category.isActive) {
                throw new common_1.BadRequestException('Cannot add transactions to inactive budget category');
            }
            const newSpent = Number(category.spentAmount) + createDto.amount;
            const allocated = Number(category.allocatedAmount);
            if (newSpent > allocated) {
                this.logWarning(`Transaction would exceed budget for ${category.name}: $${newSpent} > $${allocated}`);
            }
            const transactionRecord = await this.budgetTransactionModel.create({
                categoryId: createDto.categoryId,
                amount: createDto.amount,
                description: createDto.description,
                transactionDate: new Date(),
                referenceId: createDto.referenceId || null,
                referenceType: createDto.referenceType || null,
                notes: createDto.notes || null,
            }, { transaction });
            category.spentAmount = Number(category.spentAmount) + createDto.amount;
            await category.save({ transaction });
            this.logInfo(`Budget transaction created: $${createDto.amount} for ${category.name}`);
            const result = await this.budgetTransactionModel.findOne({
                where: { id: transactionRecord.id },
                include: [
                    {
                        model: this.budgetCategoryModel,
                        as: 'category',
                    },
                ],
                transaction,
            });
            if (!result) {
                throw new Error('Failed to reload transaction after creation');
            }
            return result;
        });
    }
    async updateBudgetTransaction(id, updateDto) {
        const sequelize = this.budgetTransactionModel.sequelize;
        return await sequelize.transaction(async (transaction) => {
            const transactionRecord = await this.budgetTransactionModel.findOne({
                where: { id },
                include: [
                    {
                        model: this.budgetCategoryModel,
                        as: 'category',
                    },
                ],
                transaction,
            });
            if (!transactionRecord) {
                throw new common_1.NotFoundException(`Budget transaction with ID ${id} not found`);
            }
            const oldAmount = Number(transactionRecord.amount);
            const newAmount = updateDto.amount !== undefined ? updateDto.amount : oldAmount;
            const amountDifference = newAmount - oldAmount;
            if (amountDifference !== 0) {
                const category = await this.budgetCategoryModel.findOne({
                    where: { id: transactionRecord.categoryId },
                    transaction,
                });
                if (category) {
                    category.spentAmount =
                        Number(category.spentAmount) + amountDifference;
                    await category.save({ transaction });
                }
            }
            Object.assign(transactionRecord, updateDto);
            await transactionRecord.save({ transaction });
            this.logInfo(`Budget transaction updated: ${transactionRecord.id}`);
            const result = await this.budgetTransactionModel.findOne({
                where: { id: transactionRecord.id },
                include: [
                    {
                        model: this.budgetCategoryModel,
                        as: 'category',
                    },
                ],
                transaction,
            });
            if (!result) {
                throw new Error('Failed to reload transaction after update');
            }
            return result;
        });
    }
    async deleteBudgetTransaction(id) {
        const sequelize = this.budgetTransactionModel.sequelize;
        return await sequelize.transaction(async (transaction) => {
            const transactionRecord = await this.budgetTransactionModel.findOne({
                where: { id },
                transaction,
            });
            if (!transactionRecord) {
                throw new common_1.NotFoundException(`Budget transaction with ID ${id} not found`);
            }
            const amount = Number(transactionRecord.amount);
            const category = await this.budgetCategoryModel.findOne({
                where: { id: transactionRecord.categoryId },
                transaction,
            });
            if (category) {
                category.spentAmount = Math.max(0, Number(category.spentAmount) - amount);
                await category.save({ transaction });
            }
            await transactionRecord.destroy({ transaction });
            this.logInfo(`Budget transaction deleted: ${id} ($${amount})`);
            return { success: true };
        });
    }
    async getBudgetTransactions(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const offset = (page - 1) * limit;
        const where = {};
        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters.startDate) {
            where.transactionDate = {
                ...where.transactionDate,
                [sequelize_2.Op.gte]: new Date(filters.startDate),
            };
        }
        if (filters.endDate) {
            where.transactionDate = {
                ...where.transactionDate,
                [sequelize_2.Op.lte]: new Date(filters.endDate),
            };
        }
        const { rows: transactions, count: total } = await this.budgetTransactionModel.findAndCountAll({
            where,
            include: [
                {
                    model: this.budgetCategoryModel,
                    as: 'category',
                },
            ],
            order: [['transactionDate', 'DESC']],
            offset,
            limit,
        });
        return {
            transactions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getBudgetSummary(fiscalYear) {
        const currentYear = fiscalYear || new Date().getFullYear();
        const result = await this.budgetCategoryModel.findAll({
            where: {
                fiscalYear: currentYear,
                isActive: true,
            },
            attributes: [
                [
                    this.budgetCategoryModel.sequelize.fn('SUM', this.budgetCategoryModel.sequelize.col('allocatedAmount')),
                    'totalAllocated',
                ],
                [
                    this.budgetCategoryModel.sequelize.fn('SUM', this.budgetCategoryModel.sequelize.col('spentAmount')),
                    'totalSpent',
                ],
                [
                    this.budgetCategoryModel.sequelize.fn('COUNT', this.budgetCategoryModel.sequelize.col('id')),
                    'categoryCount',
                ],
            ],
            raw: true,
        });
        const categories = await this.budgetCategoryModel.findAll({
            where: { fiscalYear: currentYear, isActive: true },
        });
        const overBudget = categories.filter((c) => Number(c.spentAmount) > Number(c.allocatedAmount)).length;
        const totalAllocated = Number(result[0].totalAllocated) || 0;
        const totalSpent = Number(result[0].totalSpent) || 0;
        const totalRemaining = totalAllocated - totalSpent;
        const utilizationPercentage = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
        return {
            fiscalYear: currentYear,
            totalAllocated,
            totalSpent,
            totalRemaining,
            utilizationPercentage: Math.round(utilizationPercentage * 100) / 100,
            categoryCount: parseInt(result[0].categoryCount, 10) || 0,
            overBudgetCount: overBudget,
        };
    }
    async getSpendingTrends(fiscalYear, categoryId) {
        const currentYear = fiscalYear || new Date().getFullYear();
        const where = {};
        where['$category.fiscalYear$'] = currentYear;
        if (categoryId) {
            where.categoryId = categoryId;
        }
        const results = await this.budgetTransactionModel.findAll({
            where,
            include: [
                {
                    model: this.budgetCategoryModel,
                    as: 'category',
                    attributes: [],
                },
            ],
            attributes: [
                [
                    this.budgetTransactionModel.sequelize.fn('DATE_TRUNC', 'month', this.budgetTransactionModel.sequelize.col('transactionDate')),
                    'month',
                ],
                [
                    this.budgetTransactionModel.sequelize.fn('SUM', this.budgetTransactionModel.sequelize.col('amount')),
                    'totalSpent',
                ],
                [
                    this.budgetTransactionModel.sequelize.fn('COUNT', this.budgetTransactionModel.sequelize.col('id')),
                    'transactionCount',
                ],
            ],
            group: [
                this.budgetTransactionModel.sequelize.fn('DATE_TRUNC', 'month', this.budgetTransactionModel.sequelize.col('transactionDate')),
            ],
            order: [
                [
                    this.budgetTransactionModel.sequelize.fn('DATE_TRUNC', 'month', this.budgetTransactionModel.sequelize.col('transactionDate')),
                    'ASC',
                ],
            ],
            raw: true,
        });
        return results.map((result) => ({
            month: new Date(result.month),
            totalSpent: Number(result.totalSpent),
            transactionCount: parseInt(result.transactionCount, 10),
        }));
    }
    async getOverBudgetCategories(fiscalYear) {
        const currentYear = fiscalYear || new Date().getFullYear();
        const categories = await this.budgetCategoryModel.findAll({
            where: { fiscalYear: currentYear, isActive: true },
            include: [
                {
                    model: this.budgetTransactionModel,
                    as: 'transactions',
                    order: [['transactionDate', 'DESC']],
                },
            ],
        });
        const overBudget = categories
            .filter((c) => Number(c.spentAmount) > Number(c.allocatedAmount))
            .map((category) => {
            const allocated = Number(category.allocatedAmount);
            const spent = Number(category.spentAmount);
            const overAmount = spent - allocated;
            const overPercentage = (overAmount / allocated) * 100;
            if (category.transactions) {
                category.transactions = category.transactions.slice(0, 10);
            }
            return {
                ...category,
                overAmount,
                overPercentage: Math.round(overPercentage * 100) / 100,
            };
        });
        overBudget.sort((a, b) => b.overAmount - a.overAmount);
        return overBudget;
    }
    async getCategoryYearComparison(categoryName, years) {
        const categories = await this.budgetCategoryModel.findAll({
            where: {
                name: categoryName,
                fiscalYear: years,
                isActive: true,
            },
            order: [['fiscalYear', 'ASC']],
        });
        return categories.map((category) => ({
            fiscalYear: category.fiscalYear,
            allocatedAmount: Number(category.allocatedAmount),
            spentAmount: Number(category.spentAmount),
            remainingAmount: category.remainingAmount,
            utilizationPercentage: category.utilizationPercentage,
        }));
    }
    async getBudgetRecommendations(fiscalYear) {
        const currentYear = fiscalYear || new Date().getFullYear();
        const previousYear = currentYear - 1;
        const [currentCategories, previousCategories] = await Promise.all([
            this.budgetCategoryModel.findAll({
                where: { fiscalYear: currentYear, isActive: true },
            }),
            this.budgetCategoryModel.findAll({
                where: { fiscalYear: previousYear, isActive: true },
            }),
        ]);
        return currentCategories.map((current) => {
            const previous = previousCategories.find((p) => p.name === current.name);
            const currentAllocated = Number(current.allocatedAmount);
            const currentSpent = Number(current.spentAmount);
            const currentUtilization = currentAllocated > 0 ? (currentSpent / currentAllocated) * 100 : 0;
            let recommendation = dto_1.BudgetRecommendationType.MAINTAIN;
            let suggestedAmount = currentAllocated;
            let reason = 'Current allocation is appropriate';
            if (previous) {
                const previousSpent = Number(previous.spentAmount);
                const previousAllocated = Number(previous.allocatedAmount);
                const previousUtilization = previousAllocated > 0
                    ? (previousSpent / previousAllocated) * 100
                    : 0;
                if (currentUtilization > 90) {
                    recommendation = dto_1.BudgetRecommendationType.INCREASE;
                    suggestedAmount = Math.ceil(currentSpent * 1.1);
                    reason = `High utilization (${Math.round(currentUtilization)}%) indicates budget pressure`;
                }
                else if (currentUtilization < 60 && previousUtilization < 60) {
                    recommendation = dto_1.BudgetRecommendationType.DECREASE;
                    suggestedAmount = Math.ceil(((currentSpent + previousSpent) / 2) * 1.05);
                    reason = `Consistent low utilization (${Math.round(currentUtilization)}%) across years`;
                }
                else if (currentSpent > previousSpent * 1.2) {
                    recommendation = dto_1.BudgetRecommendationType.INCREASE;
                    suggestedAmount = Math.ceil(currentSpent * 1.15);
                    reason = 'Spending trending upward compared to previous year';
                }
            }
            return {
                categoryName: current.name,
                currentAllocated,
                currentSpent,
                currentUtilization: Math.round(currentUtilization * 100) / 100,
                recommendation,
                suggestedAmount,
                reason,
            };
        });
    }
    async exportBudgetData(fiscalYear) {
        const currentYear = fiscalYear || new Date().getFullYear();
        const [categories, summary] = await Promise.all([
            this.getBudgetCategories(currentYear, false),
            this.getBudgetSummary(currentYear),
        ]);
        const categoriesWithTransactions = await Promise.all(categories.map(async (category) => {
            const { transactions } = await this.getBudgetTransactions({
                categoryId: category.id,
                page: 1,
                limit: 10000,
            });
            return {
                ...category,
                transactions,
            };
        }));
        this.logInfo(`Budget data exported for FY${currentYear}`);
        return {
            exportDate: new Date().toISOString(),
            fiscalYear: currentYear,
            summary,
            categories: categoriesWithTransactions,
        };
    }
};
exports.BudgetService = BudgetService;
exports.BudgetService = BudgetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.BudgetCategory)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.BudgetTransaction)),
    __metadata("design:paramtypes", [Object, Object])
], BudgetService);
//# sourceMappingURL=budget.service.js.map