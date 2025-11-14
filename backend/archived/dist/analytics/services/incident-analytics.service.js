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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const time_period_enum_1 = require("../enums/time-period.enum");
const trend_direction_enum_1 = require("../enums/trend-direction.enum");
const models_1 = require("../../database/models");
const date_range_service_1 = require("./date-range.service");
const base_1 = require("../../common/base");
let IncidentAnalyticsService = class IncidentAnalyticsService extends base_1.BaseService {
    incidentReportModel;
    dateRangeService;
    constructor(incidentReportModel, dateRangeService) {
        super("IncidentAnalyticsService");
        this.incidentReportModel = incidentReportModel;
        this.dateRangeService = dateRangeService;
    }
    async getIncidentAnalytics(schoolId, period = time_period_enum_1.TimePeriod.LAST_90_DAYS) {
        try {
            const dateRange = this.dateRangeService.getDateRange(period);
            const { start, end } = dateRange;
            const incidents = await this.incidentReportModel.findAll({
                where: {
                    occurredAt: { [sequelize_2.Op.between]: [start, end] },
                },
                order: [['occurredAt', 'ASC']],
            });
            const typeMap = new Map();
            const locationMap = new Map();
            const hourMap = new Map();
            for (const incident of incidents) {
                const type = incident.type || 'Unknown';
                typeMap.set(type, (typeMap.get(type) || 0) + 1);
                const location = incident.location || 'Unknown';
                locationMap.set(location, (locationMap.get(location) || 0) + 1);
                const hour = new Date(incident.occurredAt).getHours();
                hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
            }
            const byType = {
                chartType: 'PIE',
                title: 'Incidents by Type',
                datasets: [
                    {
                        label: 'Incidents',
                        data: Array.from(typeMap.entries()).map(([label, value]) => ({
                            label,
                            value,
                        })),
                        color: '#EF4444',
                    },
                ],
            };
            const byLocation = {
                chartType: 'BAR',
                title: 'Incidents by Location',
                xAxisLabel: 'Location',
                yAxisLabel: 'Count',
                datasets: [
                    {
                        label: 'Incidents',
                        data: Array.from(locationMap.entries())
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 10)
                            .map(([label, value]) => ({ label, value })),
                        color: '#F59E0B',
                    },
                ],
            };
            const byTimeOfDay = {
                chartType: 'LINE',
                title: 'Incidents by Time of Day',
                xAxisLabel: 'Hour',
                yAxisLabel: 'Count',
                datasets: [
                    {
                        label: 'Incidents',
                        data: Array.from(hourMap.entries())
                            .sort((a, b) => a[0] - b[0])
                            .map(([hour, count]) => ({
                            date: new Date(2000, 0, 1, hour),
                            value: count,
                            label: `${hour}:00`,
                        })),
                        color: '#8B5CF6',
                    },
                ],
            };
            const trends = Array.from(typeMap.entries()).map(([type, count]) => ({
                incidentType: type,
                count,
                severity: this.assessIncidentSeverity(type),
                trend: trend_direction_enum_1.TrendDirection.STABLE,
                commonLocations: this.getCommonLocationsForType(incidents, type),
                timeOfDayDistribution: this.getTimeDistribution(incidents, type),
            }));
            return {
                byType,
                byLocation,
                byTimeOfDay,
                trends,
            };
        }
        catch (error) {
            this.logError('Error getting incident analytics', error.stack);
            throw error;
        }
    }
    getCommonLocationsForType(incidents, type) {
        return incidents
            .filter((i) => i.type === type)
            .map((i) => i.location || 'Unknown')
            .filter((loc, idx, arr) => arr.indexOf(loc) === idx)
            .slice(0, 3);
    }
    assessIncidentSeverity(type) {
        const lower = type.toLowerCase();
        if (lower.includes('severe') ||
            lower.includes('serious') ||
            lower.includes('emergency')) {
            return 'SERIOUS';
        }
        if (lower.includes('moderate') || lower.includes('injury')) {
            return 'MODERATE';
        }
        return 'MINOR';
    }
    getTimeDistribution(incidents, type) {
        const hourMap = new Map();
        incidents
            .filter((i) => i.type === type)
            .forEach((i) => {
            const hour = new Date(i.occurredAt).getHours();
            hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
        });
        return Array.from(hourMap.entries())
            .map(([hour, count]) => ({ hour, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }
    async identifyHighRiskLocations(schoolId, period) {
        const dateRange = this.dateRangeService.getDateRange(period);
        const incidents = await this.incidentReportModel.findAll({
            where: {
                occurredAt: { [sequelize_2.Op.between]: [dateRange.start, dateRange.end] },
            },
        });
        const locationCounts = new Map();
        for (const incident of incidents) {
            const location = incident.location || 'Unknown';
            locationCounts.set(location, (locationCounts.get(location) || 0) + 1);
        }
        return Array.from(locationCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([location, incidentCount]) => ({
            location,
            incidentCount,
            severity: incidentCount > 10 ? 'HIGH' : incidentCount > 5 ? 'MEDIUM' : 'LOW',
        }));
    }
};
exports.IncidentAnalyticsService = IncidentAnalyticsService;
exports.IncidentAnalyticsService = IncidentAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.IncidentReport)),
    __metadata("design:paramtypes", [Object, date_range_service_1.DateRangeService])
], IncidentAnalyticsService);
//# sourceMappingURL=incident-analytics.service.js.map