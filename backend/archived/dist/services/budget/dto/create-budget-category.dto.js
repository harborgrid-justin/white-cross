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
exports.CreateBudgetCategoryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBudgetCategoryDto {
    name;
    description;
    fiscalYear;
    allocatedAmount;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, maxLength: 255 }, description: { required: false, type: () => String }, fiscalYear: { required: true, type: () => Number, minimum: 2000 }, allocatedAmount: { required: true, type: () => Number, minimum: 0 } };
    }
}
exports.CreateBudgetCategoryDto = CreateBudgetCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the budget category',
        example: 'Medical Supplies',
        maxLength: 255,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateBudgetCategoryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detailed description of the budget category',
        example: 'Budget allocation for bandages, medications, and first aid supplies',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBudgetCategoryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fiscal year for this budget category (YYYY)',
        example: 2025,
        minimum: 2000,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2000),
    __metadata("design:type", Number)
], CreateBudgetCategoryDto.prototype, "fiscalYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount allocated for this category in dollars',
        example: 50000.0,
        minimum: 0,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBudgetCategoryDto.prototype, "allocatedAmount", void 0);
//# sourceMappingURL=create-budget-category.dto.js.map