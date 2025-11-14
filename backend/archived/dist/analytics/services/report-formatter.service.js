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
exports.ReportFormatterService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
let ReportFormatterService = class ReportFormatterService extends base_1.BaseService {
    constructor() {
        super("ReportFormatterService");
    }
    async formatReport(content, format) {
        try {
            switch (format.toUpperCase()) {
                case 'JSON':
                    return this.formatAsJSON(content);
                case 'CSV':
                    return this.formatAsCSV(content);
                case 'PDF':
                    return this.formatAsPDF(content);
                case 'XLSX':
                    return this.formatAsXLSX(content);
                default:
                    return this.formatAsJSON(content);
            }
        }
        catch (error) {
            this.logError(`Failed to format report as ${format}`, error);
            return this.formatAsJSON(content);
        }
    }
    formatAsJSON(content) {
        return JSON.stringify(content, null, 2);
    }
    formatAsCSV(content) {
        const rows = [];
        const flattenObject = (obj, prefix = '') => {
            const result = [];
            for (const [key, value] of Object.entries(obj)) {
                const newKey = prefix ? `${prefix}.${key}` : key;
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    result.push(...flattenObject(value, newKey));
                }
                else if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        if (typeof item === 'object' && item !== null) {
                            result.push(...flattenObject(item, `${newKey}[${index}]`));
                        }
                        else {
                            result.push(`${newKey}[${index}],${item}`);
                        }
                    });
                }
                else {
                    result.push(`${newKey},${value}`);
                }
            }
            return result;
        };
        rows.push(...flattenObject(content));
        return rows.join('\n');
    }
    formatAsPDF(content) {
        try {
            const PDFDocument = require('pdfkit');
            const chunks = [];
            const doc = new PDFDocument({
                size: 'LETTER',
                margins: { top: 50, bottom: 50, left: 50, right: 50 },
                info: {
                    Title: content.title || 'Health Report',
                    Author: 'White Cross Health Platform',
                    Subject: 'Healthcare Analytics Report',
                    Keywords: 'health, analytics, report',
                    CreationDate: new Date(),
                },
            });
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.fontSize(8)
                .fillColor('#999999')
                .text('CONFIDENTIAL - HIPAA Protected Health Information', 50, 20, {
                align: 'center',
            });
            doc.fontSize(20)
                .fillColor('#000000')
                .text(content.title || 'Analytics Report', 50, 60);
            doc.fontSize(10)
                .fillColor('#666666')
                .text(`Generated: ${new Date().toLocaleString()}`, 50, 95)
                .text(`Report Period: ${content.period || 'N/A'}`, 50, 110);
            doc.moveTo(50, 130).lineTo(562, 130).stroke();
            let yPosition = 150;
            if (content.metrics || content.data) {
                const dataToFormat = content.metrics || content.data;
                if (Array.isArray(dataToFormat)) {
                    dataToFormat.forEach((item, index) => {
                        if (yPosition > 700) {
                            doc.addPage();
                            yPosition = 50;
                        }
                        doc.fontSize(12).fillColor('#000000');
                        doc.text(`${index + 1}. ${this.formatObjectForPDF(item)}`, 50, yPosition);
                        yPosition += 25;
                    });
                }
                else if (typeof dataToFormat === 'object') {
                    Object.entries(dataToFormat).forEach(([key, value]) => {
                        if (yPosition > 700) {
                            doc.addPage();
                            yPosition = 50;
                        }
                        doc.fontSize(11).fillColor('#333333');
                        const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
                        const formattedValue = this.formatValueForPDF(value);
                        doc.text(`${formattedKey}:`, 50, yPosition, { continued: true });
                        doc.fillColor('#000000').text(` ${formattedValue}`);
                        yPosition += 20;
                    });
                }
            }
            const pageCount = doc.bufferedPageRange().count;
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);
                doc.fontSize(8)
                    .fillColor('#999999')
                    .text(`Page ${i + 1} of ${pageCount} | White Cross Health Platform`, 50, 750, { align: 'center' });
            }
            doc.end();
            return new Promise((resolve) => {
                doc.on('end', () => {
                    const pdfBuffer = Buffer.concat(chunks);
                    resolve(pdfBuffer.toString('base64'));
                });
            });
        }
        catch (error) {
            this.logError('Error generating PDF', error);
            return JSON.stringify(content, null, 2);
        }
    }
    formatObjectForPDF(obj) {
        if (typeof obj === 'object' && obj !== null) {
            return Object.entries(obj)
                .map(([k, v]) => `${k}: ${this.formatValueForPDF(v)}`)
                .join(', ');
        }
        return String(obj);
    }
    formatValueForPDF(value) {
        if (value === null || value === undefined)
            return 'N/A';
        if (typeof value === 'number')
            return this.formatNumber(value);
        if (typeof value === 'boolean')
            return value ? 'Yes' : 'No';
        if (value instanceof Date)
            return value.toLocaleDateString();
        if (Array.isArray(value))
            return value.join(', ');
        if (typeof value === 'object')
            return JSON.stringify(value);
        return String(value);
    }
    formatAsXLSX(content) {
        try {
            const XLSX = require('xlsx');
            const workbook = XLSX.utils.book_new();
            let worksheetData = [];
            if (content.data && Array.isArray(content.data)) {
                worksheetData = content.data;
            }
            else if (content.metrics) {
                worksheetData = Array.isArray(content.metrics)
                    ? content.metrics
                    : [content.metrics];
            }
            else if (typeof content === 'object') {
                worksheetData = [content];
            }
            const worksheet = XLSX.utils.json_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');
            const metadata = [
                { Property: 'Title', Value: content.title || 'Analytics Report' },
                { Property: 'Generated', Value: new Date().toISOString() },
                { Property: 'Period', Value: content.period || 'N/A' },
                { Property: 'Source', Value: 'White Cross Health Platform' },
            ];
            const metadataSheet = XLSX.utils.json_to_sheet(metadata);
            XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');
            const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            return xlsxBuffer.toString('base64');
        }
        catch (error) {
            this.logError('Error generating XLSX', error);
            return JSON.stringify(content, null, 2);
        }
    }
    generateCSVFromTable(data, headers) {
        if (!data || data.length === 0) {
            return '';
        }
        const csvRows = [];
        if (headers && headers.length > 0) {
            csvRows.push(headers.join(','));
        }
        else if (data.length > 0) {
            const firstRow = data[0];
            if (typeof firstRow === 'object' && firstRow !== null) {
                csvRows.push(Object.keys(firstRow).join(','));
            }
        }
        data.forEach(row => {
            if (typeof row === 'object' && row !== null) {
                const values = Object.values(row).map(value => {
                    const stringValue = String(value || '');
                    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                        return `"${stringValue.replace(/"/g, '""')}"`;
                    }
                    return stringValue;
                });
                csvRows.push(values.join(','));
            }
        });
        return csvRows.join('\n');
    }
    formatNumber(value, decimals = 2) {
        return value.toFixed(decimals);
    }
    formatPercentage(value, decimals = 1) {
        return `${(value).toFixed(decimals)}%`;
    }
    formatCurrency(value, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(value);
    }
    formatDate(date, format = 'iso') {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        switch (format) {
            case 'short':
                return dateObj.toLocaleDateString();
            case 'long':
                return dateObj.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            case 'iso':
            default:
                return dateObj.toISOString().split('T')[0];
        }
    }
    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            return `${days}d ${hours % 24}h`;
        }
        else if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        }
        else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        else {
            return `${seconds}s`;
        }
    }
};
exports.ReportFormatterService = ReportFormatterService;
exports.ReportFormatterService = ReportFormatterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ReportFormatterService);
//# sourceMappingURL=report-formatter.service.js.map