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
exports.DateRangeService = void 0;
const common_1 = require("@nestjs/common");
const time_period_enum_1 = require("../enums/time-period.enum");
const base_1 = require("../../common/base");
let DateRangeService = class DateRangeService extends base_1.BaseService {
    constructor() {
        super("DateRangeService");
    }
    getDateRange(period, customRange) {
        const end = new Date();
        let start = new Date();
        switch (period) {
            case time_period_enum_1.TimePeriod.LAST_7_DAYS:
                start.setDate(end.getDate() - 7);
                break;
            case time_period_enum_1.TimePeriod.LAST_30_DAYS:
                start.setDate(end.getDate() - 30);
                break;
            case time_period_enum_1.TimePeriod.LAST_90_DAYS:
                start.setDate(end.getDate() - 90);
                break;
            case time_period_enum_1.TimePeriod.LAST_6_MONTHS:
                start.setMonth(end.getMonth() - 6);
                break;
            case time_period_enum_1.TimePeriod.LAST_YEAR:
                start.setFullYear(end.getFullYear() - 1);
                break;
            case time_period_enum_1.TimePeriod.CURRENT_SCHOOL_YEAR:
                const currentYear = end.getFullYear();
                const schoolYearStart = end.getMonth() >= 8 ? currentYear : currentYear - 1;
                start = new Date(schoolYearStart, 8, 1);
                break;
            case time_period_enum_1.TimePeriod.CUSTOM:
                if (customRange)
                    return customRange;
                break;
        }
        return { start, end };
    }
    getPreviousPeriod(start, end) {
        const duration = end.getTime() - start.getTime();
        return {
            start: new Date(start.getTime() - duration),
            end: new Date(start.getTime()),
        };
    }
    generateDateRange(start, end) {
        const dates = [];
        const current = new Date(start);
        while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return dates;
    }
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    }
    getPeriodDays(period) {
        switch (period) {
            case time_period_enum_1.TimePeriod.LAST_7_DAYS:
                return 7;
            case time_period_enum_1.TimePeriod.LAST_30_DAYS:
                return 30;
            case time_period_enum_1.TimePeriod.LAST_90_DAYS:
                return 90;
            case time_period_enum_1.TimePeriod.LAST_6_MONTHS:
                return 180;
            case time_period_enum_1.TimePeriod.LAST_YEAR:
                return 365;
            default:
                return 30;
        }
    }
};
exports.DateRangeService = DateRangeService;
exports.DateRangeService = DateRangeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DateRangeService);
//# sourceMappingURL=date-range.service.js.map