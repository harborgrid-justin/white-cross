"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseReportGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_manager_1 = require("@nestjs/cache-manager");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const analytics_constants_1 = require("../analytics-constants");
let BaseReportGeneratorService = class BaseReportGeneratorService {
    eventEmitter;
    cacheManager;
    logger;
    reportsDir;
    constructor(eventEmitter, cacheManager, serviceName) {
        this.eventEmitter = eventEmitter;
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(serviceName);
        this.reportsDir = path.join(process.cwd(), 'reports', 'analytics');
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }
    async generateReport(schoolId, reportType, period, options = {}, generateContentFn) {
        try {
            const reportId = this.generateReportId();
            const cacheKey = analytics_constants_1.ANALYTICS_CACHE_KEYS.REPORT_DATA(reportId);
            if (!options.forceRegenerate) {
                const cached = await this.cacheManager.get(cacheKey);
                if (cached) {
                    return { success: true, data: cached };
                }
            }
            const { data, content } = await generateContentFn();
            const formattedReport = await this.formatReport(content, options.format || 'JSON');
            const report = {
                id: reportId,
                schoolId,
                type: reportType,
                period,
                data,
                content,
                formattedContent,
                metadata: this.generateReportMetadata(reportId, schoolId, reportType, period, options),
                generatedAt: new Date(),
            };
            await this.cacheManager.set(cacheKey, report, analytics_constants_1.ANALYTICS_CONSTANTS.CACHE_TTL.REPORT_DATA);
            if (options.saveToFile) {
                await this.saveReportToFile(report, options.format || 'JSON');
            }
            this.eventEmitter.emit(analytics_constants_1.ANALYTICS_EVENTS.REPORT_GENERATED, {
                reportId,
                schoolId,
                type: reportType,
                format: options.format || 'JSON',
            });
            return { success: true, data: report };
        }
        catch (error) {
            this.logger.error(`Failed to generate ${reportType} report for school ${schoolId}`, error);
            return {
                success: false,
                error: `Failed to generate report: ${error.message}`,
            };
        }
    }
    async exportReport(reportData, formats = ['JSON']) {
        try {
            const exports = {};
            for (const format of formats) {
                exports[format] = await this.formatReport(reportData.content, format);
            }
            return { success: true, data: exports };
        }
        catch (error) {
            this.logger.error(`Failed to export report ${reportData.id}`, error);
            return {
                success: false,
                error: `Failed to export report: ${error.message}`,
            };
        }
    }
    async formatReport(content, format) {
        switch (format.toUpperCase()) {
            case 'JSON':
                return JSON.stringify(content, null, 2);
            case 'CSV':
                return this.convertToCSV(content);
            case 'XML':
                return this.convertToXML(content);
            default:
                return JSON.stringify(content, null, 2);
        }
    }
    convertToCSV(data) {
        const rows = [];
        const flattenObject = (obj, prefix = '') => {
            const result = [];
            for (const [key, value] of Object.entries(obj)) {
                const newKey = prefix ? `${prefix}.${key}` : key;
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    result.push(...flattenObject(value, newKey));
                }
                else {
                    result.push(`${newKey},${value}`);
                }
            }
            return result;
        };
        rows.push(...flattenObject(data));
        return rows.join('\n');
    }
    convertToXML(data) {
        const convertToXML = (obj, rootName = 'report') => {
            let xml = `<${rootName}>`;
            for (const [key, value] of Object.entries(obj)) {
                if (Array.isArray(value)) {
                    xml += `<${key}>`;
                    value.forEach((item, index) => {
                        xml += convertToXML(item, `item${index}`);
                    });
                    xml += `</${key}>`;
                }
                else if (typeof value === 'object' && value !== null) {
                    xml += convertToXML(value, key);
                }
                else {
                    xml += `<${key}>${value}</${key}>`;
                }
            }
            xml += `</${rootName}>`;
            return xml;
        };
        return convertToXML(data);
    }
    async saveReportToFile(report, format) {
        const fileName = `${report.id}.${format.toLowerCase()}`;
        const filePath = path.join(this.reportsDir, fileName);
        try {
            await fs.promises.writeFile(filePath, report.formattedContent, 'utf8');
            this.logger.log(`Report saved to ${filePath}`);
        }
        catch (error) {
            this.logger.error(`Failed to save report to file: ${error}`);
            throw error;
        }
    }
    generateReportId() {
        return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateReportMetadata(reportId, schoolId, reportType, period, options) {
        return {
            id: reportId,
            title: `${reportType.replace('_', ' ')} Report - ${schoolId}`,
            type: reportType,
            generatedAt: new Date(),
            period,
            format: options.format || 'JSON',
            size: 0,
        };
    }
};
exports.BaseReportGeneratorService = BaseReportGeneratorService;
exports.BaseReportGeneratorService = BaseReportGeneratorService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2, Object, String])
], BaseReportGeneratorService);
//# sourceMappingURL=base-report-generator.service.js.map