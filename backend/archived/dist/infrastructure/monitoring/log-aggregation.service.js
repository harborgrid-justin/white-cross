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
exports.LogAggregationService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
let LogAggregationService = class LogAggregationService extends base_1.BaseService {
    constructor() {
        super("LogAggregationService");
    }
    logBuffer = [];
    maxLogEntries = 10000;
    async initialize() {
        this.logInfo('Log aggregation service initialized');
    }
    addLogEntry(entry) {
        this.logBuffer.push(entry);
        if (this.logBuffer.length > this.maxLogEntries) {
            this.logBuffer.shift();
        }
    }
    queryLogs(params) {
        let logs = [...this.logBuffer];
        if (params.level) {
            logs = logs.filter((log) => log.level === params.level);
        }
        if (params.context) {
            logs = logs.filter((log) => log.context.includes(params.context));
        }
        if (params.startTime) {
            const startTime = new Date(params.startTime).getTime();
            logs = logs.filter((log) => new Date(log.timestamp).getTime() >= startTime);
        }
        if (params.endTime) {
            const endTime = new Date(params.endTime).getTime();
            logs = logs.filter((log) => new Date(log.timestamp).getTime() <= endTime);
        }
        if (params.search) {
            const search = params.search.toLowerCase();
            logs = logs.filter((log) => log.message.toLowerCase().includes(search) ||
                log.context.toLowerCase().includes(search));
        }
        if (params.limit) {
            logs = logs.slice(-params.limit);
        }
        return logs;
    }
    getAllLogs() {
        return [...this.logBuffer];
    }
    getRecentLogs(limit = 100) {
        return this.logBuffer.slice(-limit);
    }
    getLogsByLevel(level, limit) {
        const filtered = this.logBuffer.filter((log) => log.level === level);
        return limit ? filtered.slice(-limit) : filtered;
    }
    getLogsByContext(context, limit) {
        const filtered = this.logBuffer.filter((log) => log.context.includes(context));
        return limit ? filtered.slice(-limit) : filtered;
    }
    searchLogs(searchTerm, limit) {
        const search = searchTerm.toLowerCase();
        const filtered = this.logBuffer.filter((log) => log.message.toLowerCase().includes(search) ||
            log.context.toLowerCase().includes(search));
        return limit ? filtered.slice(-limit) : filtered;
    }
    getLogStats() {
        const stats = {};
        const total = this.logBuffer.length;
        this.logBuffer.forEach((log) => {
            stats[log.level] = (stats[log.level] || 0) + 1;
        });
        const result = {};
        Object.entries(stats).forEach(([level, count]) => {
            result[level] = {
                count,
                percentage: total > 0 ? (count / total) * 100 : 0,
            };
        });
        return result;
    }
    clearLogs() {
        this.logBuffer = [];
        this.logInfo('All logs cleared');
    }
    clearOldLogs(olderThanMs) {
        const cutoffTime = Date.now() - olderThanMs;
        const initialLength = this.logBuffer.length;
        this.logBuffer = this.logBuffer.filter((log) => {
            const logTime = new Date(log.timestamp).getTime();
            return logTime >= cutoffTime;
        });
        const removedCount = initialLength - this.logBuffer.length;
        this.logInfo(`Cleared ${removedCount} old log entries`);
    }
    getLogCount() {
        return this.logBuffer.length;
    }
    getLogsByTimeRange(startTime, endTime) {
        const start = typeof startTime === 'string'
            ? new Date(startTime).getTime()
            : startTime;
        const end = typeof endTime === 'string' ? new Date(endTime).getTime() : endTime;
        return this.logBuffer.filter((log) => {
            const logTime = new Date(log.timestamp).getTime();
            return logTime >= start && logTime <= end;
        });
    }
    exportLogsAsJson(params) {
        const logs = params ? this.queryLogs(params) : this.logBuffer;
        return JSON.stringify(logs, null, 2);
    }
    getErrorLogs(limit) {
        return this.getLogsByLevel('error', limit);
    }
    getWarningLogs(limit) {
        return this.getLogsByLevel('warn', limit);
    }
};
exports.LogAggregationService = LogAggregationService;
exports.LogAggregationService = LogAggregationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LogAggregationService);
//# sourceMappingURL=log-aggregation.service.js.map