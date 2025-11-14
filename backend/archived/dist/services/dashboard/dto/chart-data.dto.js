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
exports.DashboardChartDataDto = exports.ChartDataPointDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ChartDataPointDto {
    date;
    value;
    label;
    static _OPENAPI_METADATA_FACTORY() {
        return { date: { required: true, type: () => String }, value: { required: true, type: () => Number }, label: { required: false, type: () => String } };
    }
}
exports.ChartDataPointDto = ChartDataPointDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Formatted date string',
        example: 'Oct 15',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChartDataPointDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numeric value for the data point',
        example: 12,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ChartDataPointDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional label for the data point',
        example: 'Oct 15',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ChartDataPointDto.prototype, "label", void 0);
class DashboardChartDataDto {
    enrollmentTrend;
    medicationAdministration;
    incidentFrequency;
    appointmentTrends;
    static _OPENAPI_METADATA_FACTORY() {
        return { enrollmentTrend: { required: true, type: () => [require("./chart-data.dto").ChartDataPointDto] }, medicationAdministration: { required: true, type: () => [require("./chart-data.dto").ChartDataPointDto] }, incidentFrequency: { required: true, type: () => [require("./chart-data.dto").ChartDataPointDto] }, appointmentTrends: { required: true, type: () => [require("./chart-data.dto").ChartDataPointDto] } };
    }
}
exports.DashboardChartDataDto = DashboardChartDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student enrollment trend over time',
        type: [ChartDataPointDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ChartDataPointDto),
    __metadata("design:type", Array)
], DashboardChartDataDto.prototype, "enrollmentTrend", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medication administration frequency over time',
        type: [ChartDataPointDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ChartDataPointDto),
    __metadata("design:type", Array)
], DashboardChartDataDto.prototype, "medicationAdministration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Incident report frequency over time',
        type: [ChartDataPointDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ChartDataPointDto),
    __metadata("design:type", Array)
], DashboardChartDataDto.prototype, "incidentFrequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Appointment scheduling trends over time',
        type: [ChartDataPointDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ChartDataPointDto),
    __metadata("design:type", Array)
], DashboardChartDataDto.prototype, "appointmentTrends", void 0);
//# sourceMappingURL=chart-data.dto.js.map