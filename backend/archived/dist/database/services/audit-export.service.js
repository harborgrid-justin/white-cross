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
exports.AuditExportService = void 0;
const common_1 = require("@nestjs/common");
const audit_query_service_1 = require("./audit-query.service");
const base_1 = require("../../common/base");
let AuditExportService = class AuditExportService extends base_1.BaseService {
    auditQuery;
    constructor(auditQuery) {
        super("AuditExportService");
        this.auditQuery = auditQuery;
    }
    async exportToCSV(filters = {}, includeFullDetails = false) {
        try {
            const result = await this.auditQuery.queryAuditLogs(filters, { limit: 10000 });
            const logs = result.logs;
            if (logs.length === 0) {
                return 'No audit logs found matching the filters';
            }
            const headers = includeFullDetails
                ? [
                    'ID',
                    'Timestamp',
                    'Action',
                    'Entity Type',
                    'Entity ID',
                    'User ID',
                    'User Name',
                    'IP Address',
                    'Is PHI',
                    'Compliance Type',
                    'Severity',
                    'Success',
                    'Error Message',
                    'Changes',
                ]
                : [
                    'ID',
                    'Timestamp',
                    'Action',
                    'Entity Type',
                    'Entity ID',
                    'User Name',
                    'Is PHI',
                    'Compliance Type',
                    'Success',
                ];
            let csv = headers.join(',') + '\n';
            for (const log of logs) {
                const row = includeFullDetails
                    ? [
                        log.id,
                        log.createdAt.toISOString(),
                        log.action,
                        log.entityType,
                        log.entityId || '',
                        log.userId || '',
                        log.userName || '',
                        log.ipAddress || '',
                        log.isPHI,
                        log.complianceType,
                        log.severity,
                        log.success,
                        log.errorMessage
                            ? `"${log.errorMessage.replace(/"/g, '""')}"`
                            : '',
                        log.changes
                            ? `"${JSON.stringify(log.changes).replace(/"/g, '""')}"`
                            : '',
                    ]
                    : [
                        log.id,
                        log.createdAt.toISOString(),
                        log.action,
                        log.entityType,
                        log.entityId || '',
                        log.userName || '',
                        log.isPHI,
                        log.complianceType,
                        log.success,
                    ];
                csv += row.join(',') + '\n';
            }
            return csv;
        }
        catch (error) {
            this.logError(`Failed to export audit logs to CSV: ${error.message}`, error.stack);
            throw error;
        }
    }
    async exportToJSON(filters = {}, includeFullDetails = false) {
        try {
            const result = await this.auditQuery.queryAuditLogs(filters, { limit: 10000 });
            const logs = result.logs.map((log) => log.toExportObject(includeFullDetails));
            return JSON.stringify({
                exportedAt: new Date().toISOString(),
                total: logs.length,
                filters,
                logs,
            }, null, 2);
        }
        catch (error) {
            this.logError(`Failed to export audit logs to JSON: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.AuditExportService = AuditExportService;
exports.AuditExportService = AuditExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_query_service_1.AuditQueryService])
], AuditExportService);
//# sourceMappingURL=audit-export.service.js.map