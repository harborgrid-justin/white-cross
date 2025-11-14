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
exports.MetricQueryDto = exports.RecordMetricDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const administration_enums_1 = require("../enums/administration.enums");
class RecordMetricDto {
    metricType;
    value;
    unit;
    tags;
    recordedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { metricType: { required: true, enum: require("../enums/administration.enums").MetricType }, value: { required: true, type: () => Number }, unit: { required: false, type: () => String }, tags: { required: false, type: () => Object }, recordedAt: { required: false, type: () => Date } };
    }
}
exports.RecordMetricDto = RecordMetricDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric type', enum: administration_enums_1.MetricType }),
    (0, class_validator_1.IsEnum)(administration_enums_1.MetricType),
    __metadata("design:type", String)
], RecordMetricDto.prototype, "metricType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric value' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RecordMetricDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unit of measurement (e.g., %, ms, count)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordMetricDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata tags' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RecordMetricDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When metric was recorded' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], RecordMetricDto.prototype, "recordedAt", void 0);
class MetricQueryDto {
    metricType;
    startDate;
    endDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { metricType: { required: false, enum: require("../enums/administration.enums").MetricType }, startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date } };
    }
}
exports.MetricQueryDto = MetricQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by metric type',
        enum: administration_enums_1.MetricType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(administration_enums_1.MetricType),
    __metadata("design:type", String)
], MetricQueryDto.prototype, "metricType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date for filtering' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], MetricQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date for filtering' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], MetricQueryDto.prototype, "endDate", void 0);
//# sourceMappingURL=performance.dto.js.map