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
exports.RiskFactorDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RiskFactorDto {
    category;
    severity;
    description;
    weight;
    static _OPENAPI_METADATA_FACTORY() {
        return { category: { required: true, type: () => String }, severity: { required: true, type: () => Number, minimum: 0, maximum: 10 }, description: { required: true, type: () => String }, weight: { required: true, type: () => Number } };
    }
}
exports.RiskFactorDto = RiskFactorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category of the risk factor',
        example: 'Allergies',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RiskFactorDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Severity level (0-10 scale)',
        example: 8,
        minimum: 0,
        maximum: 10,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], RiskFactorDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed description of the risk factor',
        example: '3 allergies documented, including severe reactions',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RiskFactorDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Weight of this factor in overall score calculation',
        example: 0.3,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RiskFactorDto.prototype, "weight", void 0);
//# sourceMappingURL=risk-factor.dto.js.map