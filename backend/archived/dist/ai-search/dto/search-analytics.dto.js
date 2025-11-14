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
exports.SearchAnalyticsDto = exports.AnalyticsPeriod = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var AnalyticsPeriod;
(function (AnalyticsPeriod) {
    AnalyticsPeriod["DAY"] = "day";
    AnalyticsPeriod["WEEK"] = "week";
    AnalyticsPeriod["MONTH"] = "month";
    AnalyticsPeriod["YEAR"] = "year";
})(AnalyticsPeriod || (exports.AnalyticsPeriod = AnalyticsPeriod = {}));
class SearchAnalyticsDto {
    period;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { period: { required: false, enum: require("./search-analytics.dto").AnalyticsPeriod }, limit: { required: false, type: () => Number, minimum: 1, maximum: 50 } };
    }
}
exports.SearchAnalyticsDto = SearchAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time period for analytics',
        enum: AnalyticsPeriod,
        default: AnalyticsPeriod.WEEK,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AnalyticsPeriod),
    __metadata("design:type", String)
], SearchAnalyticsDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum number of top queries to return',
        default: 10,
        required: false,
        minimum: 1,
        maximum: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], SearchAnalyticsDto.prototype, "limit", void 0);
//# sourceMappingURL=search-analytics.dto.js.map