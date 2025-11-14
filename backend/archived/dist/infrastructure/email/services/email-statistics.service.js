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
exports.EmailStatisticsService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
let EmailStatisticsService = class EmailStatisticsService extends base_1.BaseService {
    constructor() {
        super("EmailStatisticsService");
    }
    stats = {
        sent: 0,
        failed: 0,
        queued: 0,
        totalDeliveryTime: 0,
    };
    startTime = Date.now();
    recordSent(deliveryTime) {
        this.stats.sent++;
        this.stats.totalDeliveryTime += deliveryTime;
    }
    recordFailed() {
        this.stats.failed++;
    }
    recordQueued() {
        this.stats.queued++;
    }
    getStatistics() {
        const total = this.stats.sent + this.stats.failed;
        const successRate = total > 0 ? (this.stats.sent / total) * 100 : 0;
        const avgDeliveryTime = this.stats.sent > 0 ? this.stats.totalDeliveryTime / this.stats.sent : 0;
        return {
            totalSent: this.stats.sent,
            totalFailed: this.stats.failed,
            totalQueued: this.stats.queued,
            averageDeliveryTime: avgDeliveryTime,
            successRate,
            period: {
                start: new Date(this.startTime),
                end: new Date(),
            },
        };
    }
    getSuccessRate() {
        const total = this.stats.sent + this.stats.failed;
        return total > 0 ? (this.stats.sent / total) * 100 : 0;
    }
    getAverageDeliveryTime() {
        return this.stats.sent > 0 ? this.stats.totalDeliveryTime / this.stats.sent : 0;
    }
    getTotalProcessed() {
        return this.stats.sent + this.stats.failed + this.stats.queued;
    }
    reset() {
        this.stats = {
            sent: 0,
            failed: 0,
            queued: 0,
            totalDeliveryTime: 0,
        };
        this.logInfo('Email statistics reset');
    }
    getStatsSummary() {
        return {
            sent: this.stats.sent,
            failed: this.stats.failed,
            queued: this.stats.queued,
            totalProcessed: this.getTotalProcessed(),
            successRate: this.getSuccessRate(),
            averageDeliveryTime: this.getAverageDeliveryTime(),
        };
    }
};
exports.EmailStatisticsService = EmailStatisticsService;
exports.EmailStatisticsService = EmailStatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailStatisticsService);
//# sourceMappingURL=email-statistics.service.js.map