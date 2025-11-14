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
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const base_1 = require("../../../common/base");
let ExportService = class ExportService extends base_1.BaseService {
    eventEmitter;
    constructor(eventEmitter) {
        super('ExportService');
        this.eventEmitter = eventEmitter;
    }
    exportDashboardData(period, format) {
        try {
            this.validatePeriod(period);
            this.validateExportFormat(format);
            const filename = `dashboard-${period}-${Date.now()}.${format}`;
            const filepath = `/exports/${filename}`;
            this.logInfo('Dashboard data exported', {
                period,
                format,
                filename,
            });
            this.eventEmitter.emit('analytics.dashboard.exported', {
                period,
                format,
                filename,
                timestamp: new Date(),
            });
            return filepath;
        }
        catch (error) {
            this.logError('Error exporting dashboard data', {
                error: error instanceof Error ? error.message : String(error),
                period,
                format,
            });
            throw error;
        }
    }
    validatePeriod(period) {
        const validPeriods = ['day', 'week', 'month'];
        if (!validPeriods.includes(period)) {
            throw new Error(`Invalid period: ${period}. Must be one of: ${validPeriods.join(', ')}`);
        }
    }
    validateExportFormat(format) {
        const validFormats = ['json', 'csv', 'pdf'];
        if (!validFormats.includes(format)) {
            throw new Error(`Invalid format: ${format}. Must be one of: ${validFormats.join(', ')}`);
        }
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], ExportService);
//# sourceMappingURL=export.service.js.map