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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetSummaryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class BudgetSummaryDto {
    fiscalYear;
    totalAllocated;
    totalSpent;
    totalRemaining;
    utilizationPercentage;
    categoryCount;
    overBudgetCount;
    static _OPENAPI_METADATA_FACTORY() {
        return { fiscalYear: { required: true, type: () => Number }, totalAllocated: { required: true, type: () => Number }, totalSpent: { required: true, type: () => Number }, totalRemaining: { required: true, type: () => Number }, utilizationPercentage: { required: true, type: () => Number }, categoryCount: { required: true, type: () => Number }, overBudgetCount: { required: true, type: () => Number } };
    }
}
exports.BudgetSummaryDto = BudgetSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fiscal year for this budget summary',
        example: 2025,
    }),
    __metadata("design:type", Number)
], BudgetSummaryDto.prototype, "fiscalYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount allocated across all categories in dollars',
        example: 250000.0,
    }),
    __metadata("design:type", Number)
], BudgetSummaryDto.prototype, "totalAllocated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount spent across all categories in dollars',
        example: 187500.5,
    }),
    __metadata("design:type", Number)
], BudgetSummaryDto.prototype, "totalSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total remaining budget in dollars',
        example: 62499.5,
    }),
    __metadata("design:type", Number)
], BudgetSummaryDto.prototype, "totalRemaining", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Percentage of budget utilized',
        example: 75.0,
    }),
    __metadata("design:type", Number)
], BudgetSummaryDto.prototype, "utilizationPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of budget categories',
        example: 12,
    }),
    __metadata("design:type", Number)
], BudgetSummaryDto.prototype, "categoryCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of categories that have exceeded their budget',
        example: 2,
    }),
    __metadata("design:type", Number)
], BudgetSummaryDto.prototype, "overBudgetCount", void 0);
//# sourceMappingURL=budget-summary.dto.js.map