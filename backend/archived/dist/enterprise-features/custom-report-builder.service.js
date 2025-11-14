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
exports.CustomReportBuilderService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const base_1 = require("../common/base");
let CustomReportBuilderService = class CustomReportBuilderService extends base_1.BaseService {
    eventEmitter;
    constructor(eventEmitter) {
        super('CustomReportBuilderService');
        this.eventEmitter = eventEmitter;
    }
    createReportDefinition(data) {
        try {
            if (!data.name || typeof data.name !== 'string') {
                throw new Error('Report name is required and must be a string');
            }
            if (!data.dataSource || typeof data.dataSource !== 'string') {
                throw new Error('Data source is required and must be a string');
            }
            if (!Array.isArray(data.fields) || data.fields.length === 0) {
                throw new Error('At least one field must be specified');
            }
            if (!data.createdBy || typeof data.createdBy !== 'string') {
                throw new Error('Created by field is required');
            }
            const report = {
                ...data,
                id: `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            };
            const validVisualizations = ['table', 'chart', 'graph'];
            if (!validVisualizations.includes(report.visualization)) {
                throw new Error(`Invalid visualization type. Must be one of: ${validVisualizations.join(', ')}`);
            }
            if (report.schedule) {
                const validFrequencies = ['daily', 'weekly', 'monthly'];
                if (!validFrequencies.includes(report.schedule.frequency)) {
                    throw new Error(`Invalid schedule frequency. Must be one of: ${validFrequencies.join(', ')}`);
                }
                if (!Array.isArray(report.schedule.recipients) || report.schedule.recipients.length === 0) {
                    throw new Error('Schedule recipients must be a non-empty array');
                }
            }
            this.eventEmitter.emit('report.created', {
                reportId: report.id,
                reportName: report.name,
                createdBy: report.createdBy,
                timestamp: new Date(),
                service: 'CustomReportBuilderService',
            });
            this.logInfo('Custom report definition created', {
                reportId: report.id,
                reportName: report.name,
                fieldCount: report.fields.length,
                dataSource: report.dataSource,
            });
            return report;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logError('Error creating report definition', {
                error: errorMessage,
                reportName: data?.name,
            });
            throw error;
        }
    }
    async executeReport(reportId) {
        try {
            if (!reportId || typeof reportId !== 'string') {
                throw new Error('Valid report ID is required');
            }
            const startTime = Date.now();
            const mockData = await this.generateMockReportData(reportId);
            const executionTime = Date.now() - startTime;
            const result = {
                reportId,
                data: mockData,
                metadata: {
                    totalRecords: mockData.length,
                    executionTime,
                    generatedAt: new Date(),
                    filters: {},
                },
            };
            this.eventEmitter.emit('report.executed', {
                reportId,
                recordCount: result.metadata.totalRecords,
                executionTime,
                timestamp: new Date(),
                service: 'CustomReportBuilderService',
            });
            this.logInfo('Custom report executed successfully', {
                reportId,
                recordCount: result.metadata.totalRecords,
                executionTimeMs: executionTime,
            });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logError('Error executing report', {
                error: errorMessage,
                reportId,
            });
            throw error;
        }
    }
    async exportReport(reportId, format) {
        try {
            if (!reportId || typeof reportId !== 'string') {
                throw new Error('Valid report ID is required');
            }
            const validFormats = ['pdf', 'excel', 'csv'];
            if (!validFormats.includes(format)) {
                throw new Error(`Invalid export format. Must be one of: ${validFormats.join(', ')}`);
            }
            const reportResult = await this.executeReport(reportId);
            const exportPath = await this.generateExportFile(reportResult, format);
            this.eventEmitter.emit('report.exported', {
                reportId,
                format,
                recordCount: reportResult.metadata.totalRecords,
                exportPath,
                timestamp: new Date(),
                service: 'CustomReportBuilderService',
            });
            this.logInfo('Report exported successfully', {
                reportId,
                format,
                recordCount: reportResult.metadata.totalRecords,
                exportPath,
            });
            return exportPath;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logError('Error exporting report', {
                error: errorMessage,
                reportId,
                format,
            });
            throw error;
        }
    }
    async generateMockReportData(reportId) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        if (reportId.includes('student')) {
            return [
                {
                    studentId: 'STU-001',
                    name: 'John Doe',
                    grade: '10th',
                    appointmentCount: 5,
                    lastVisit: '2024-01-15',
                    status: 'active',
                },
                {
                    studentId: 'STU-002',
                    name: 'Jane Smith',
                    grade: '9th',
                    appointmentCount: 3,
                    lastVisit: '2024-01-10',
                    status: 'active',
                },
            ];
        }
        if (reportId.includes('medication')) {
            return [
                {
                    medicationId: 'MED-001',
                    name: 'Ibuprofen',
                    administeredCount: 25,
                    studentCount: 15,
                    lastAdministered: '2024-01-15',
                    status: 'active',
                },
                {
                    medicationId: 'MED-002',
                    name: 'Acetaminophen',
                    administeredCount: 18,
                    studentCount: 12,
                    lastAdministered: '2024-01-14',
                    status: 'active',
                },
            ];
        }
        return [
            {
                id: 'REC-001',
                type: 'appointment',
                count: 45,
                date: '2024-01-15',
                status: 'completed',
            },
            {
                id: 'REC-002',
                type: 'medication',
                count: 120,
                date: '2024-01-15',
                status: 'administered',
            },
        ];
    }
    async generateExportFile(reportResult, format) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `report_${reportResult.reportId}_${timestamp}.${format}`;
        return `/secure/exports/${filename}`;
    }
    validateReportDefinition(data) {
        try {
            if (!data.name || typeof data.name !== 'string')
                return false;
            if (!data.dataSource || typeof data.dataSource !== 'string')
                return false;
            if (!Array.isArray(data.fields) || data.fields.length === 0)
                return false;
            if (!data.createdBy || typeof data.createdBy !== 'string')
                return false;
            const validVisualizations = ['table', 'chart', 'graph'];
            if (data.visualization && !validVisualizations.includes(data.visualization))
                return false;
            return true;
        }
        catch {
            return false;
        }
    }
    getAvailableDataSources() {
        return [
            'students',
            'appointments',
            'medications',
            'health_records',
            'incidents',
            'consent_forms',
            'communications',
            'analytics',
        ];
    }
    getAvailableFields(dataSource) {
        const fieldMap = {
            students: ['id', 'name', 'grade', 'status', 'enrollment_date', 'contact_info'],
            appointments: ['id', 'student_id', 'type', 'date', 'duration', 'status', 'notes'],
            medications: ['id', 'name', 'dosage', 'student_id', 'administered_at', 'administered_by'],
            health_records: ['id', 'student_id', 'type', 'date', 'notes', 'attachments'],
            incidents: ['id', 'student_id', 'type', 'date', 'description', 'severity'],
            consent_forms: ['id', 'student_id', 'type', 'status', 'signed_at', 'expires_at'],
            communications: ['id', 'type', 'recipient', 'sent_at', 'status', 'template_id'],
            analytics: ['metric_name', 'value', 'date', 'category', 'trend'],
        };
        return fieldMap[dataSource] || [];
    }
};
exports.CustomReportBuilderService = CustomReportBuilderService;
exports.CustomReportBuilderService = CustomReportBuilderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], CustomReportBuilderService);
//# sourceMappingURL=custom-report-builder.service.js.map