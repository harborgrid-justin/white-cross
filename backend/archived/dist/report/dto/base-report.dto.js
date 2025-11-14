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
exports.BaseReportDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const report_constants_1 = require("../constants/report.constants");
class BaseReportDto {
    startDate;
    endDate;
    outputFormat = report_constants_1.OutputFormat.JSON;
    static _OPENAPI_METADATA_FACTORY() {
        return { startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date }, outputFormat: { required: false, default: report_constants_1.OutputFormat.JSON, enum: require("../constants/report.constants").OutputFormat } };
    }
}
exports.BaseReportDto = BaseReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date for report filtering' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], BaseReportDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date for report filtering' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], BaseReportDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: report_constants_1.OutputFormat,
        description: 'Desired output format',
        default: report_constants_1.OutputFormat.JSON,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(report_constants_1.OutputFormat),
    __metadata("design:type", String)
], BaseReportDto.prototype, "outputFormat", void 0);
//# sourceMappingURL=base-report.dto.js.map