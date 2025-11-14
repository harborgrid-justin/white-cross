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
exports.GetTrendsQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class GetTrendsQueryDto {
    metrics;
    timeRange;
    granularity;
    static _OPENAPI_METADATA_FACTORY() {
        return { metrics: { required: true, type: () => [String] }, timeRange: { required: true, type: () => String, enum: ['1h', '6h', '24h', '7d', '30d', '90d'] }, granularity: { required: true, type: () => String, enum: ['hour', 'day', 'week'] } };
    }
}
exports.GetTrendsQueryDto = GetTrendsQueryDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.split(',');
        }
        return value;
    }),
    __metadata("design:type", Array)
], GetTrendsQueryDto.prototype, "metrics", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['1h', '6h', '24h', '7d', '30d', '90d']),
    __metadata("design:type", String)
], GetTrendsQueryDto.prototype, "timeRange", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['hour', 'day', 'week']),
    __metadata("design:type", String)
], GetTrendsQueryDto.prototype, "granularity", void 0);
//# sourceMappingURL=get-trends-query.dto.js.map