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
exports.BudgetRecommendationDto = exports.BudgetRecommendationType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
var BudgetRecommendationType;
(function (BudgetRecommendationType) {
    BudgetRecommendationType["INCREASE"] = "INCREASE";
    BudgetRecommendationType["DECREASE"] = "DECREASE";
    BudgetRecommendationType["MAINTAIN"] = "MAINTAIN";
})(BudgetRecommendationType || (exports.BudgetRecommendationType = BudgetRecommendationType = {}));
class BudgetRecommendationDto {
    categoryName;
    currentAllocated;
    currentSpent;
    currentUtilization;
    recommendation;
    suggestedAmount;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { categoryName: { required: true, type: () => String }, currentAllocated: { required: true, type: () => Number }, currentSpent: { required: true, type: () => Number }, currentUtilization: { required: true, type: () => Number }, recommendation: { required: true, enum: require("./budget-recommendation.dto").BudgetRecommendationType }, suggestedAmount: { required: true, type: () => Number }, reason: { required: true, type: () => String } };
    }
}
exports.BudgetRecommendationDto = BudgetRecommendationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the budget category',
        example: 'Medical Supplies',
    }),
    __metadata("design:type", String)
], BudgetRecommendationDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currently allocated amount for this category in dollars',
        example: 50000.0,
    }),
    __metadata("design:type", Number)
], BudgetRecommendationDto.prototype, "currentAllocated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount spent so far in dollars',
        example: 47500.0,
    }),
    __metadata("design:type", Number)
], BudgetRecommendationDto.prototype, "currentSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current utilization percentage',
        example: 95.0,
    }),
    __metadata("design:type", Number)
], BudgetRecommendationDto.prototype, "currentUtilization", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recommended budget action',
        enum: BudgetRecommendationType,
        example: BudgetRecommendationType.INCREASE,
    }),
    __metadata("design:type", String)
], BudgetRecommendationDto.prototype, "recommendation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Suggested budget amount for next fiscal year in dollars',
        example: 60000.0,
    }),
    __metadata("design:type", Number)
], BudgetRecommendationDto.prototype, "suggestedAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Explanation for the recommendation',
        example: 'Category consistently operates near capacity with 95% utilization. Suggest 20% increase to prevent budget overruns.',
    }),
    __metadata("design:type", String)
], BudgetRecommendationDto.prototype, "reason", void 0);
//# sourceMappingURL=budget-recommendation.dto.js.map