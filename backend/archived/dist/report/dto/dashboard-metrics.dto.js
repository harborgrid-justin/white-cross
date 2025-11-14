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
exports.DashboardMetricsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class DashboardMetricsDto {
    detailed = false;
    refresh = false;
    static _OPENAPI_METADATA_FACTORY() {
        return { detailed: { required: false, type: () => Boolean, default: false }, refresh: { required: false, type: () => Boolean, default: false } };
    }
}
exports.DashboardMetricsDto = DashboardMetricsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include detailed breakdown',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DashboardMetricsDto.prototype, "detailed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bypass cache and get fresh data',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DashboardMetricsDto.prototype, "refresh", void 0);
//# sourceMappingURL=dashboard-metrics.dto.js.map