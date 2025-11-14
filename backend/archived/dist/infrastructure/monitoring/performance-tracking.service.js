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
exports.PerformanceTrackingService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
let PerformanceTrackingService = class PerformanceTrackingService extends base_1.BaseService {
    constructor() {
        super("PerformanceTrackingService");
    }
    performanceHistory = [];
    maxPerformanceEntries = 1000;
    trackPerformance(entry) {
        this.performanceHistory.push(entry);
        if (this.performanceHistory.length > this.maxPerformanceEntries) {
            this.performanceHistory.shift();
        }
    }
    getRecentPerformance(limit = 100) {
        return this.performanceHistory.slice(-limit);
    }
    getAllPerformance() {
        return [...this.performanceHistory];
    }
    getPerformanceByName(name, limit) {
        const filtered = this.performanceHistory.filter((entry) => entry.name === name);
        return limit ? filtered.slice(-limit) : filtered;
    }
    getPerformanceByTimeRange(startTime, endTime) {
        const start = typeof startTime === 'string'
            ? new Date(startTime).getTime()
            : startTime;
        const end = typeof endTime === 'string' ? new Date(endTime).getTime() : endTime;
        return this.performanceHistory.filter((entry) => {
            const entryTime = new Date(entry.timestamp).getTime();
            return entryTime >= start && entryTime <= end;
        });
    }
    getAverageDuration(name, limit) {
        const entries = this.getPerformanceByName(name, limit);
        if (entries.length === 0) {
            return 0;
        }
        const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
        return totalDuration / entries.length;
    }
    getPerformanceStats(name, limit) {
        const entries = this.getPerformanceByName(name, limit);
        if (entries.length === 0) {
            return {
                count: 0,
                avgDuration: 0,
                minDuration: 0,
                maxDuration: 0,
                p50Duration: 0,
                p95Duration: 0,
                p99Duration: 0,
            };
        }
        const durations = entries.map((e) => e.duration).sort((a, b) => a - b);
        const sum = durations.reduce((a, b) => a + b, 0);
        const p50Index = Math.floor(durations.length * 0.5);
        const p95Index = Math.floor(durations.length * 0.95);
        const p99Index = Math.floor(durations.length * 0.99);
        return {
            count: entries.length,
            avgDuration: sum / entries.length,
            minDuration: durations[0],
            maxDuration: durations[durations.length - 1],
            p50Duration: durations[p50Index],
            p95Duration: durations[p95Index],
            p99Duration: durations[p99Index],
        };
    }
    clearPerformance() {
        this.performanceHistory = [];
        this.logInfo('Performance history cleared');
    }
    clearOldPerformance(olderThanMs) {
        const cutoffTime = Date.now() - olderThanMs;
        const initialLength = this.performanceHistory.length;
        this.performanceHistory = this.performanceHistory.filter((entry) => {
            const entryTime = new Date(entry.timestamp).getTime();
            return entryTime >= cutoffTime;
        });
        const removedCount = initialLength - this.performanceHistory.length;
        this.logInfo(`Cleared ${removedCount} old performance entries`);
    }
    getPerformanceCount() {
        return this.performanceHistory.length;
    }
    setMaxPerformanceEntries(max) {
        if (max < 1) {
            throw new Error('Maximum performance entries must be at least 1');
        }
        const oldMax = this.maxPerformanceEntries;
        this.maxPerformanceEntries = max;
        if (this.performanceHistory.length > max) {
            this.performanceHistory = this.performanceHistory.slice(-max);
        }
        this.logInfo(`Maximum performance entries changed from ${oldMax} to ${max}`);
    }
};
exports.PerformanceTrackingService = PerformanceTrackingService;
exports.PerformanceTrackingService = PerformanceTrackingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PerformanceTrackingService);
//# sourceMappingURL=performance-tracking.service.js.map