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
exports.TrendCalculationService = void 0;
const common_1 = require("@nestjs/common");
const trend_direction_enum_1 = require("../enums/trend-direction.enum");
const date_range_service_1 = require("./date-range.service");
const base_1 = require("../../common/base");
let TrendCalculationService = class TrendCalculationService extends base_1.BaseService {
    dateRangeService;
    constructor(dateRangeService) {
        super("TrendCalculationService");
        this.dateRangeService = dateRangeService;
    }
    calculateTrend(previous, current) {
        if (previous === 0)
            return trend_direction_enum_1.TrendDirection.STABLE;
        const percentChange = ((current - previous) / previous) * 100;
        if (percentChange > 5)
            return trend_direction_enum_1.TrendDirection.INCREASING;
        if (percentChange < -5)
            return trend_direction_enum_1.TrendDirection.DECREASING;
        return trend_direction_enum_1.TrendDirection.STABLE;
    }
    applyMovingAverage(data, window) {
        return data.map((point, index) => {
            const start = Math.max(0, index - Math.floor(window / 2));
            const end = Math.min(data.length, index + Math.ceil(window / 2));
            const subset = data.slice(start, end);
            const avg = subset.reduce((sum, p) => sum + p.value, 0) / subset.length;
            return { ...point, value: Number(avg.toFixed(2)) };
        });
    }
    calculateExponentialMovingAverage(values, alpha) {
        if (values.length === 0)
            return [];
        const ema = [values[0]];
        for (let i = 1; i < values.length; i++) {
            ema.push(alpha * values[i] + (1 - alpha) * ema[i - 1]);
        }
        return ema;
    }
    aggregateByWeek(records) {
        const weekMap = new Map();
        for (const record of records) {
            const weekNum = this.dateRangeService.getWeekNumber(record.recordDate);
            weekMap.set(weekNum, (weekMap.get(weekNum) || 0) + 1);
        }
        return Array.from(weekMap.values());
    }
    calculatePercentageChange(previous, current) {
        if (previous === 0)
            return current > 0 ? 100 : 0;
        return Number((((current - previous) / previous) * 100).toFixed(1));
    }
    calculateMean(values) {
        if (values.length === 0)
            return 0;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return Number((sum / values.length).toFixed(2));
    }
    calculateStandardDeviation(values) {
        if (values.length === 0)
            return 0;
        const mean = this.calculateMean(values);
        const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
        const variance = this.calculateMean(squaredDiffs);
        return Number(Math.sqrt(variance).toFixed(2));
    }
    isOutlier(value, values, threshold = 2) {
        const mean = this.calculateMean(values);
        const stdDev = this.calculateStandardDeviation(values);
        return Math.abs(value - mean) > threshold * stdDev;
    }
};
exports.TrendCalculationService = TrendCalculationService;
exports.TrendCalculationService = TrendCalculationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [date_range_service_1.DateRangeService])
], TrendCalculationService);
//# sourceMappingURL=trend-calculation.service.js.map