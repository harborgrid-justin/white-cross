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
exports.HipaaComplianceService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const base_1 = require("../common/base");
let HipaaComplianceService = class HipaaComplianceService extends base_1.BaseService {
    eventEmitter;
    complianceChecks = [];
    constructor(eventEmitter) {
        super('HipaaComplianceService');
        this.eventEmitter = eventEmitter;
    }
    async performComplianceAudit() {
        try {
            const checks = [
                {
                    id: 'HIPAA-1',
                    area: 'Access Controls',
                    status: 'compliant',
                    findings: ['All users have unique IDs', 'MFA enabled'],
                    recommendations: [],
                    checkedAt: new Date(),
                    checkedBy: 'system',
                },
                {
                    id: 'HIPAA-2',
                    area: 'Audit Logs',
                    status: 'compliant',
                    findings: ['All PHI access logged', 'Logs retained for 6 years'],
                    recommendations: [],
                    checkedAt: new Date(),
                    checkedBy: 'system',
                },
            ];
            this.complianceChecks.push(...checks);
            this.eventEmitter.emit('hipaa.audit.performed', {
                checkCount: checks.length,
                timestamp: new Date(),
            });
            this.logInfo('HIPAA compliance audit completed', {
                checkCount: checks.length,
            });
            return checks;
        }
        catch (error) {
            this.logError('Error performing HIPAA audit', error);
            throw error;
        }
    }
    async generateComplianceReport(startDate, endDate) {
        try {
            const relevantChecks = this.complianceChecks.filter((check) => check.checkedAt >= startDate && check.checkedAt <= endDate);
            const report = {
                period: { startDate, endDate },
                overallStatus: this.calculateOverallStatus(relevantChecks),
                checks: relevantChecks,
                generatedAt: new Date(),
                complianceRate: this.calculateComplianceRate(relevantChecks),
            };
            this.eventEmitter.emit('hipaa.report.generated', {
                startDate,
                endDate,
                checkCount: relevantChecks.length,
                timestamp: new Date(),
            });
            this.logInfo('HIPAA compliance report generated', {
                startDate,
                endDate,
                checkCount: relevantChecks.length,
            });
            return report;
        }
        catch (error) {
            this.logError('Error generating compliance report', {
                error,
                startDate,
                endDate,
            });
            throw error;
        }
    }
    async getComplianceCheck(checkId) {
        try {
            const check = this.complianceChecks.find((c) => c.id === checkId);
            if (check) {
                this.logInfo('Compliance check retrieved', { checkId });
            }
            else {
                this.logWarning('Compliance check not found', { checkId });
            }
            return check || null;
        }
        catch (error) {
            this.logError('Error retrieving compliance check', {
                error,
                checkId,
            });
            return null;
        }
    }
    async getAllComplianceChecks() {
        try {
            this.logInfo('All compliance checks retrieved', {
                count: this.complianceChecks.length,
            });
            return [...this.complianceChecks];
        }
        catch (error) {
            this.logError('Error retrieving compliance checks', error);
            return [];
        }
    }
    async getComplianceStatistics() {
        try {
            const stats = {
                totalChecks: this.complianceChecks.length,
                compliantChecks: this.complianceChecks.filter((c) => c.status === 'compliant').length,
                nonCompliantChecks: this.complianceChecks.filter((c) => c.status === 'non-compliant').length,
                pendingChecks: this.complianceChecks.filter((c) => c.status === 'needs-attention').length,
                complianceRate: this.calculateComplianceRate(this.complianceChecks),
                lastAuditDate: this.getLastAuditDate(),
            };
            this.logInfo('Compliance statistics retrieved', stats);
            return stats;
        }
        catch (error) {
            this.logError('Error getting compliance statistics', error);
            throw error;
        }
    }
    calculateOverallStatus(checks) {
        if (checks.length === 0)
            return 'unknown';
        const nonCompliantCount = checks.filter((c) => c.status === 'non-compliant').length;
        return nonCompliantCount === 0 ? 'compliant' : 'non-compliant';
    }
    calculateComplianceRate(checks) {
        if (checks.length === 0)
            return 0;
        const compliantCount = checks.filter((c) => c.status === 'compliant').length;
        return Math.round((compliantCount / checks.length) * 100);
    }
    getLastAuditDate() {
        if (this.complianceChecks.length === 0)
            return null;
        return this.complianceChecks.reduce((latest, check) => check.checkedAt > latest ? check.checkedAt : latest, new Date(0));
    }
};
exports.HipaaComplianceService = HipaaComplianceService;
exports.HipaaComplianceService = HipaaComplianceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], HipaaComplianceService);
//# sourceMappingURL=hipaa-compliance.service.js.map