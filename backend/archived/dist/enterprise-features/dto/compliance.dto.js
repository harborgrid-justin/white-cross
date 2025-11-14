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
exports.HIPAAComplianceCheckResponseDto = exports.GenerateComplianceReportDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GenerateComplianceReportDto {
    startDate;
    endDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { startDate: { required: true, type: () => String }, endDate: { required: true, type: () => String } };
    }
}
exports.GenerateComplianceReportDto = GenerateComplianceReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date for report period' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GenerateComplianceReportDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date for report period' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GenerateComplianceReportDto.prototype, "endDate", void 0);
class HIPAAComplianceCheckResponseDto {
    id;
    area;
    status;
    findings;
    recommendations;
    checkedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, area: { required: true, type: () => String }, status: { required: true, type: () => Object }, findings: { required: true, type: () => [String] }, recommendations: { required: true, type: () => [String] }, checkedAt: { required: true, type: () => Date } };
    }
}
exports.HIPAAComplianceCheckResponseDto = HIPAAComplianceCheckResponseDto;
//# sourceMappingURL=compliance.dto.js.map