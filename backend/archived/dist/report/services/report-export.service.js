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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportExportService = void 0;
const common_1 = require("@nestjs/common");
const report_constants_1 = require("../constants/report.constants");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const base_1 = require("../../common/base");
let ReportExportService = class ReportExportService extends base_1.BaseService {
    outputDir = path.join(process.cwd(), 'reports', 'generated');
    constructor() {
        super('ReportExportService');
        this.ensureOutputDirectory();
    }
    async exportReport(data, options) {
        try {
            const { format, reportType } = options;
            let filePath;
            let buffer;
            switch (format) {
                case report_constants_1.OutputFormat.PDF:
                    buffer = await this.exportToPdf(data);
                    filePath = await this.saveFile(buffer, reportType, 'pdf');
                    break;
                case report_constants_1.OutputFormat.EXCEL:
                    buffer = await this.exportToExcel(data, options);
                    filePath = await this.saveFile(buffer, reportType, 'xlsx');
                    break;
                case report_constants_1.OutputFormat.CSV:
                    buffer = await this.exportToCsv(data, options);
                    filePath = await this.saveFile(buffer, reportType, 'csv');
                    break;
                case report_constants_1.OutputFormat.JSON:
                    buffer = Buffer.from(JSON.stringify(data, null, 2));
                    filePath = await this.saveFile(buffer, reportType, 'json');
                    break;
                default:
                    throw new common_1.BadRequestException(`Unsupported format: ${format}`);
            }
            const fileSize = buffer.length;
            const downloadUrl = `/api/reports/download/${path.basename(filePath)}`;
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            this.logInfo(`Report exported: ${reportType} as ${format}, size: ${fileSize} bytes`);
            return {
                format,
                filePath,
                downloadUrl,
                fileSize,
                generatedAt: new Date(),
                expiresAt,
            };
        }
        catch (error) {
            this.logError('Error exporting report:', error);
            throw error;
        }
    }
    async exportToPdf(data) {
        this.logWarning('PDF export not fully implemented - returning JSON as fallback');
        return Buffer.from(JSON.stringify(data, null, 2));
    }
    async exportToExcel(data, options) {
        try {
            const XLSX = require('xlsx');
            const worksheet = XLSX.utils.json_to_sheet(this.flattenData(data));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, options.reportType);
            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            return buffer;
        }
        catch (error) {
            this.logWarning('Excel library not available - returning JSON as fallback');
            return Buffer.from(JSON.stringify(data, null, 2));
        }
    }
    async exportToCsv(data, options) {
        try {
            const flatData = this.flattenData(data);
            if (flatData.length === 0) {
                return Buffer.from('No data available\n');
            }
            const headers = options.columns || Object.keys(flatData[0]);
            let csv = headers.join(',') + '\n';
            for (const row of flatData) {
                const values = headers.map((header) => {
                    const value = row[header];
                    if (value === null || value === undefined)
                        return '';
                    const stringValue = String(value);
                    if (stringValue.includes(',') || stringValue.includes('"')) {
                        return `"${stringValue.replace(/"/g, '""')}"`;
                    }
                    return stringValue;
                });
                csv += values.join(',') + '\n';
            }
            return Buffer.from(csv, 'utf-8');
        }
        catch (error) {
            this.logError('Error generating CSV:', error);
            throw error;
        }
    }
    flattenData(data) {
        if (Array.isArray(data)) {
            return data.map((item) => this.flattenObject(item));
        }
        else if (typeof data === 'object' && data !== null) {
            const arrayProps = Object.keys(data).filter((key) => Array.isArray(data[key]));
            if (arrayProps.length > 0) {
                const arrayData = data[arrayProps[0]];
                return Array.isArray(arrayData) ? arrayData.map((item) => this.flattenObject(item)) : [this.flattenObject(data)];
            }
            return [this.flattenObject(data)];
        }
        return [];
    }
    flattenObject(obj, prefix = '') {
        const flattened = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const newKey = prefix ? `${prefix}.${key}` : key;
                if (value === null || value === undefined) {
                    flattened[newKey] = '';
                }
                else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                    Object.assign(flattened, this.flattenObject(value, newKey));
                }
                else if (Array.isArray(value)) {
                    flattened[newKey] = value.join('; ');
                }
                else if (value instanceof Date) {
                    flattened[newKey] = value.toISOString();
                }
                else {
                    flattened[newKey] = value;
                }
            }
        }
        return flattened;
    }
    async saveFile(buffer, reportType, extension) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${reportType}_${timestamp}.${extension}`;
        const filePath = path.join(this.outputDir, filename);
        await fs.writeFile(filePath, buffer);
        return filePath;
    }
    async ensureOutputDirectory() {
        try {
            await fs.mkdir(this.outputDir, { recursive: true });
        }
        catch (error) {
            this.logError('Error creating output directory:', error);
        }
    }
    async cleanupOldReports(daysOld = 7) {
        try {
            const files = await fs.readdir(this.outputDir);
            const now = Date.now();
            const maxAge = daysOld * 24 * 60 * 60 * 1000;
            for (const file of files) {
                const filePath = path.join(this.outputDir, file);
                const stats = await fs.stat(filePath);
                if (now - stats.mtimeMs > maxAge) {
                    await fs.unlink(filePath);
                    this.logInfo(`Deleted old report file: ${file}`);
                }
            }
        }
        catch (error) {
            this.logError('Error cleaning up old reports:', error);
        }
    }
};
exports.ReportExportService = ReportExportService;
exports.ReportExportService = ReportExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ReportExportService);
//# sourceMappingURL=report-export.service.js.map