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
exports.DashboardMetricResponseDto = exports.GetHealthTrendsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GetHealthTrendsDto {
    period;
    static _OPENAPI_METADATA_FACTORY() {
        return { period: { required: true, type: () => Object } };
    }
}
exports.GetHealthTrendsDto = GetHealthTrendsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['day', 'week', 'month'],
        description: 'Time period for trends',
    }),
    (0, class_validator_1.IsEnum)(['day', 'week', 'month']),
    __metadata("design:type", String)
], GetHealthTrendsDto.prototype, "period", void 0);
class DashboardMetricResponseDto {
    name;
    value;
    trend;
    change;
    unit;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, value: { required: true, type: () => Number }, trend: { required: true, type: () => Object }, change: { required: true, type: () => Number }, unit: { required: true, type: () => String } };
    }
}
exports.DashboardMetricResponseDto = DashboardMetricResponseDto;
//# sourceMappingURL=analytics.dto.js.map