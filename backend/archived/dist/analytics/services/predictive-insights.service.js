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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PredictiveInsightsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictiveInsightsService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const time_period_enum_1 = require("../enums/time-period.enum");
const models_1 = require("../../database/models");
const date_range_service_1 = require("./date-range.service");
const trend_calculation_service_1 = require("./trend-calculation.service");
let PredictiveInsightsService = PredictiveInsightsService_1 = class PredictiveInsightsService extends base_1.BaseService {
    healthRecordModel;
    dateRangeService;
    trendCalculationService;
    constructor(healthRecordModel, dateRangeService, trendCalculationService) {
        super(PredictiveInsightsService_1.name);
        this.healthRecordModel = healthRecordModel;
        this.dateRangeService = dateRangeService;
        this.trendCalculationService = trendCalculationService;
    }
    async getPredictiveInsights(schoolId) {
        try {
            const dateRange = this.dateRangeService.getDateRange(time_period_enum_1.TimePeriod.LAST_90_DAYS);
            const recentRecords = await this.healthRecordModel.findAll({
                where: {
                    recordDate: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
                },
            });
            const insights = [];
            const outbreakInsight = this.detectOutbreakRisk(recentRecords);
            if (outbreakInsight) {
                insights.push(outbreakInsight);
            }
            const stockInsight = this.detectStockShortageRisk(recentRecords);
            if (stockInsight) {
                insights.push(stockInsight);
            }
            this.logger.log(`Generated ${insights.length} predictive insights for school ${schoolId}`);
            return insights;
        }
        catch (error) {
            this.logger.error('Error generating predictive insights', error.stack);
            throw error;
        }
    }
    detectOutbreakRisk(records) {
        const illnessCounts = this.trendCalculationService.aggregateByWeek(records.filter((r) => r.recordType === 'ILLNESS'));
        if (illnessCounts.length < 2)
            return null;
        const trend = this.trendCalculationService.calculateExponentialMovingAverage(illnessCounts, 0.3);
        const recentTrend = trend.slice(-2);
        if (recentTrend.length === 2 && recentTrend[1] > recentTrend[0] * 1.2) {
            return {
                insightType: 'OUTBREAK_RISK',
                severity: recentTrend[1] > recentTrend[0] * 1.5 ? 'HIGH' : 'MEDIUM',
                title: 'Potential Illness Outbreak',
                description: `Illness cases trending ${((recentTrend[1] / recentTrend[0] - 1) * 100).toFixed(0)}% above previous week`,
                prediction: {
                    timeframe: 'Next 7-14 days',
                    probability: Math.min(95, Math.round((recentTrend[1] / recentTrend[0]) * 50)),
                    impactedCount: Math.round(recentTrend[1] * 1.3),
                },
                recommendations: [
                    'Increase health monitoring frequency',
                    'Notify parents of symptoms to watch for',
                    'Ensure adequate supply of medications and PPE',
                    'Review isolation protocols with staff',
                ],
            };
        }
        return null;
    }
    detectStockShortageRisk(records) {
        const medicationRecords = records.filter((r) => r.treatment?.toLowerCase().includes('medication') ||
            r.recordType === 'MEDICATION_REVIEW');
        if (medicationRecords.length > 100) {
            return {
                insightType: 'STOCK_SHORTAGE',
                severity: 'MEDIUM',
                title: 'High Medication Demand',
                description: 'Medication administration rates above normal - monitor inventory',
                prediction: {
                    timeframe: 'Next 14-21 days',
                    probability: 65,
                    impactedCount: Math.round(medicationRecords.length * 0.15),
                },
                recommendations: [
                    'Review medication inventory levels',
                    'Order additional stock for high-use medications',
                    'Audit medication administration records',
                ],
            };
        }
        return null;
    }
    analyzeSeasonalTrend(records, currentMonth) {
        const fluSeasonMonths = [11, 0, 1, 2];
        const isFluSeason = fluSeasonMonths.includes(currentMonth);
        const allergySeasonMonths = [2, 3, 4, 8];
        const isAllergySeason = allergySeasonMonths.includes(currentMonth);
        let expectedIncrease = 0;
        if (isFluSeason) {
            expectedIncrease = 35;
        }
        else if (isAllergySeason) {
            expectedIncrease = 25;
        }
        return {
            isPeakSeason: isFluSeason || isAllergySeason,
            expectedIncrease,
        };
    }
    calculateConditionRiskScore(currentCount, historicalAverage, growthRate) {
        const deviationFactor = currentCount / historicalAverage;
        const growthFactor = 1 + growthRate / 100;
        const riskScore = Math.min(100, (deviationFactor * growthFactor) * 50);
        return Math.round(riskScore);
    }
};
exports.PredictiveInsightsService = PredictiveInsightsService;
exports.PredictiveInsightsService = PredictiveInsightsService = PredictiveInsightsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.HealthRecord)),
    __metadata("design:paramtypes", [Object, date_range_service_1.DateRangeService,
        trend_calculation_service_1.TrendCalculationService])
], PredictiveInsightsService);
//# sourceMappingURL=predictive-insights.service.js.map