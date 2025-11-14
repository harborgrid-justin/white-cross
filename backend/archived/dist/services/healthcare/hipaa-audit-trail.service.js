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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HipaaAuditTrailService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const base_1 = require("../../common/base");
let HipaaAuditTrailService = class HipaaAuditTrailService extends base_1.BaseService {
    auditLogModel;
    userModel;
    patientModel;
    sequelize;
    constructor(auditLogModel, userModel, patientModel, sequelize) {
        super("HipaaAuditTrailService");
        this.auditLogModel = auditLogModel;
        this.userModel = userModel;
        this.patientModel = patientModel;
        this.sequelize = sequelize;
    }
    async logPhiAccess(event) {
        const transaction = await this.sequelize.transaction();
        try {
            const auditEntry = await this.auditLogModel.create({
                id: this.generateAuditId(),
                action: 'READ',
                entityType: event.resourceType,
                entityId: event.resourceId,
                userId: event.userId,
                userName: null,
                changes: null,
                previousValues: null,
                newValues: null,
                ipAddress: event.ipAddress,
                userAgent: event.userAgent,
                requestId: null,
                sessionId: event.sessionId,
                isPHI: true,
                complianceType: models_1.ComplianceType.HIPAA,
                severity: models_1.AuditSeverity.MEDIUM,
                success: true,
                errorMessage: null,
                metadata: {
                    fieldsAccessed: event.fieldsAccessed,
                    purpose: event.purpose,
                    authorizationMethod: event.authorizationMethod,
                    patientId: event.patientId,
                },
                tags: ['phi-access', 'hipaa', 'audit'],
                createdAt: new Date(),
            }, { transaction });
            await this.detectSuspiciousActivity(auditEntry, transaction);
            await this.updateUserAccessPatterns(event.userId, auditEntry, transaction);
            await transaction.commit();
            this.logInfo(`PHI access logged: ${auditEntry.id} - User: ${event.userId}, Patient: ${event.patientId}`);
        }
        catch (error) {
            await transaction.rollback();
            this.logError(`Failed to log PHI access: ${error.message}`, error.stack);
            throw error;
        }
    }
    async logSecurityEvent(event) {
        const auditEntry = await this.auditLogModel.create({
            id: this.generateAuditId(),
            eventType: 'SECURITY',
            userId: event.userId,
            action: event.action,
            timestamp: new Date(),
            ipAddress: event.ipAddress,
            userAgent: event.userAgent,
            location: event.location,
            severity: event.severity,
            complianceStatus: this.determineComplianceStatus(event),
            metadata: {
                details: event.details,
                affectedResources: event.affectedResources,
                remediation: event.remediation,
            },
        });
        if (event.severity === 'HIGH' || event.severity === 'CRITICAL') {
            await this.triggerSecurityAlert(auditEntry);
        }
        this.logWarning(`Security event logged: ${auditEntry.id} - ${event.action}`);
    }
    async generateComplianceReport(startDate, endDate, filters) {
        const whereClause = {
            timestamp: {
                [this.sequelize.Op.between]: [startDate, endDate],
            },
        };
        if (filters?.userId) {
            whereClause.userId = filters.userId;
        }
        if (filters?.patientId) {
            whereClause.patientId = filters.patientId;
        }
        if (filters?.eventType) {
            whereClause.eventType = filters.eventType;
        }
        const auditLogs = await this.auditLogModel.findAll({
            where: whereClause,
            include: [
                { model: models_2.User, attributes: ['id', 'email', 'role'] },
                { model: models_3.Patient, attributes: ['id', 'firstName', 'lastName'] },
            ],
            order: [['timestamp', 'DESC']],
        });
        const violations = auditLogs.filter((log) => log.complianceStatus === 'VIOLATION');
        const phiAccesses = auditLogs.filter((log) => log.phiAccessed);
        return {
            period: { startDate, endDate },
            totalEvents: auditLogs.length,
            phiAccessCount: phiAccesses.length,
            violationCount: violations.length,
            complianceRate: auditLogs.length > 0
                ? ((auditLogs.length - violations.length) / auditLogs.length) * 100
                : 100,
            topViolations: this.analyzeTopViolations(violations),
            userActivitySummary: this.summarizeUserActivity(auditLogs),
            recommendations: this.generateRecommendations(auditLogs),
            auditLogs: auditLogs.map((log) => ({
                id: log.id,
                timestamp: log.timestamp,
                user: log.user ? `${log.user.email} (${log.user.role})` : 'Unknown',
                patient: log.patient ? `${log.patient.firstName} ${log.patient.lastName}` : null,
                action: log.action,
                resourceType: log.resourceType,
                complianceStatus: log.complianceStatus,
                severity: this.calculateSeverity(log),
            })),
        };
    }
    async verifyAuditIntegrity(startDate, endDate) {
        const logs = await this.auditLogModel.findAll({
            where: {
                timestamp: {
                    [this.sequelize.Op.between]: [startDate, endDate],
                },
            },
            order: [['timestamp', 'ASC']],
        });
        const gaps = this.detectGaps(logs);
        const tampering = await this.detectTampering(logs);
        const completeness = this.checkCompleteness(logs);
        return {
            period: { startDate, endDate },
            totalLogs: logs.length,
            gapsDetected: gaps.length,
            tamperingDetected: tampering.length > 0,
            completenessScore: completeness.score,
            issues: [...gaps, ...tampering, ...completeness.issues],
            verified: gaps.length === 0 && tampering.length === 0 && completeness.score >= 95,
        };
    }
    async getUserAccessPatterns(userId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const logs = await this.auditLogModel.findAll({
            where: {
                userId,
                timestamp: {
                    [this.sequelize.Op.gte]: startDate,
                },
                phiAccessed: true,
            },
            order: [['timestamp', 'DESC']],
        });
        const accessFrequency = this.calculateAccessFrequency(logs);
        const unusualPatterns = this.detectUnusualPatterns(logs);
        const riskScore = this.calculateRiskScore(logs, unusualPatterns);
        return {
            userId,
            period: { startDate, endDate: new Date() },
            totalPhiAccesses: logs.length,
            accessFrequency,
            unusualPatterns,
            riskScore,
            recommendations: this.generateUserRecommendations(riskScore, unusualPatterns),
        };
    }
    generateAuditId() {
        return `AUDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    async detectSuspiciousActivity(auditEntry, transaction) {
        const recentLogs = await this.auditLogModel.findAll({
            where: {
                userId: auditEntry.userId,
                timestamp: {
                    [this.sequelize.Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
            transaction,
        });
        const suspiciousPatterns = this.analyzeSuspiciousPatterns(recentLogs, auditEntry);
        if (suspiciousPatterns.length > 0) {
            await this.auditLogModel.create({
                id: this.generateAuditId(),
                eventType: 'SUSPICIOUS_ACTIVITY',
                userId: auditEntry.userId,
                action: 'SUSPICIOUS_PHI_ACCESS',
                timestamp: new Date(),
                severity: 'HIGH',
                complianceStatus: 'VIOLATION',
                metadata: {
                    patterns: suspiciousPatterns,
                    relatedAuditId: auditEntry.id,
                },
            }, { transaction });
        }
    }
    analyzeSuspiciousPatterns(logs, currentEntry) {
        const patterns = [];
        const recentAccesses = logs.filter((log) => log.timestamp > new Date(Date.now() - 5 * 60 * 1000));
        if (recentAccesses.length > 10) {
            patterns.push('RAPID_SUCCESSIVE_ACCESSES');
        }
        const hour = currentEntry.timestamp.getHours();
        if (hour < 6 || hour > 22) {
            patterns.push('OFF_HOURS_ACCESS');
        }
        return patterns;
    }
    async updateUserAccessPatterns(userId, auditEntry, transaction) {
    }
    determineComplianceStatus(event) {
        if (event.action.includes('FAILED_LOGIN')) {
            return 'VIOLATION';
        }
        return 'COMPLIANT';
    }
    async triggerSecurityAlert(auditEntry) {
        this.logError(`SECURITY ALERT: ${auditEntry.action} - ${auditEntry.id}`);
    }
    analyzeTopViolations(violations) {
        const violationCounts = violations.reduce((acc, violation) => {
            const key = `${violation.action}-${violation.complianceStatus}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(violationCounts)
            .map(([violation, count]) => ({ violation, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }
    summarizeUserActivity(logs) {
        const userActivity = logs.reduce((acc, log) => {
            const userId = log.userId;
            if (!acc[userId]) {
                acc[userId] = {
                    userId,
                    totalActions: 0,
                    phiAccesses: 0,
                    violations: 0,
                    lastActivity: log.timestamp,
                };
            }
            acc[userId].totalActions++;
            if (log.phiAccessed)
                acc[userId].phiAccesses++;
            if (log.complianceStatus === 'VIOLATION')
                acc[userId].violations++;
            if (log.timestamp > acc[userId].lastActivity) {
                acc[userId].lastActivity = log.timestamp;
            }
            return acc;
        }, {});
        return Object.values(userActivity);
    }
    generateRecommendations(logs) {
        const recommendations = [];
        const violationRate = logs.filter((log) => log.complianceStatus === 'VIOLATION').length / logs.length;
        if (violationRate > 0.1) {
            recommendations.push('High violation rate detected. Consider additional training and monitoring.');
        }
        const offHoursAccess = logs.filter((log) => {
            const hour = log.timestamp.getHours();
            return hour < 6 || hour > 22;
        });
        if (offHoursAccess.length > logs.length * 0.05) {
            recommendations.push('Significant off-hours access detected. Review access policies.');
        }
        return recommendations;
    }
    calculateSeverity(log) {
        if (log.complianceStatus === 'VIOLATION' && log.phiAccessed) {
            return 'CRITICAL';
        }
        if (log.complianceStatus === 'VIOLATION') {
            return 'HIGH';
        }
        if (log.phiAccessed) {
            return 'MEDIUM';
        }
        return 'LOW';
    }
    detectGaps(logs) {
        const gaps = [];
        const expectedInterval = 5 * 60 * 1000;
        for (let i = 1; i < logs.length; i++) {
            const timeDiff = logs[i].timestamp.getTime() - logs[i - 1].timestamp.getTime();
            if (timeDiff > expectedInterval) {
                gaps.push({
                    type: 'TIME_GAP',
                    startTime: logs[i - 1].timestamp,
                    endTime: logs[i].timestamp,
                    duration: timeDiff,
                    severity: timeDiff > 60 * 60 * 1000 ? 'HIGH' : 'MEDIUM',
                });
            }
        }
        return gaps;
    }
    async detectTampering(logs) {
        const tampering = [];
        for (const log of logs) {
            if (log.metadata?.tampered) {
                tampering.push({
                    type: 'LOG_MODIFICATION',
                    auditId: log.id,
                    timestamp: log.timestamp,
                    details: 'Log entry appears to have been modified',
                    severity: 'CRITICAL',
                });
            }
        }
        return tampering;
    }
    checkCompleteness(logs) {
        const totalExpectedLogs = this.calculateExpectedLogCount(logs);
        const actualLogs = logs.length;
        const completenessScore = totalExpectedLogs > 0 ? (actualLogs / totalExpectedLogs) * 100 : 100;
        const issues = [];
        if (completenessScore < 95) {
            issues.push(`Log completeness is ${completenessScore.toFixed(1)}%`);
        }
        return { score: completenessScore, issues };
    }
    calculateExpectedLogCount(logs) {
        return logs.length * 1.1;
    }
    calculateAccessFrequency(logs) {
        const totalDays = 30;
        const accessesPerDay = logs.length / totalDays;
        let frequency;
        if (accessesPerDay < 5)
            frequency = 'LOW';
        else if (accessesPerDay < 15)
            frequency = 'MEDIUM';
        else if (accessesPerDay < 30)
            frequency = 'HIGH';
        else
            frequency = 'VERY_HIGH';
        return {
            accessesPerDay,
            frequency,
            trend: this.calculateTrend(logs),
        };
    }
    calculateTrend(logs) {
        if (logs.length < 10)
            return 'STABLE';
        const firstHalf = logs.slice(0, Math.floor(logs.length / 2));
        const secondHalf = logs.slice(Math.floor(logs.length / 2));
        const firstHalfAvg = firstHalf.length / 15;
        const secondHalfAvg = secondHalf.length / 15;
        const change = (secondHalfAvg - firstHalfAvg) / firstHalfAvg;
        if (change > 0.2)
            return 'INCREASING';
        if (change < -0.2)
            return 'DECREASING';
        return 'STABLE';
    }
    detectUnusualPatterns(logs) {
        const patterns = [];
        const bulkExports = logs.filter((log) => log.action === 'EXPORT' && log.metadata?.recordCount > 100);
        if (bulkExports.length > 0) {
            patterns.push({
                type: 'BULK_EXPORT',
                description: `${bulkExports.length} bulk data exports detected`,
                severity: 'HIGH',
                occurrences: bulkExports.length,
            });
        }
        const patientAccesses = logs.reduce((acc, log) => {
            if (log.patientId) {
                acc[log.patientId] = (acc[log.patientId] || 0) + 1;
            }
            return acc;
        }, {});
        const highAccessPatients = Object.entries(patientAccesses).filter(([, count]) => count > 10).length;
        if (highAccessPatients > 5) {
            patterns.push({
                type: 'MULTIPLE_PATIENT_ACCESS',
                description: `Access to ${highAccessPatients} patients with high frequency`,
                severity: 'MEDIUM',
                occurrences: highAccessPatients,
            });
        }
        return patterns;
    }
    calculateRiskScore(logs, patterns) {
        let score = 0;
        const violations = logs.filter((log) => log.complianceStatus === 'VIOLATION').length;
        score += violations * 10;
        patterns.forEach((pattern) => {
            switch (pattern.severity) {
                case 'CRITICAL':
                    score += 50;
                    break;
                case 'HIGH':
                    score += 25;
                    break;
                case 'MEDIUM':
                    score += 10;
                    break;
                case 'LOW':
                    score += 5;
                    break;
            }
        });
        const frequency = this.calculateAccessFrequency(logs);
        switch (frequency.frequency) {
            case 'VERY_HIGH':
                score += 30;
                break;
            case 'HIGH':
                score += 15;
                break;
            case 'MEDIUM':
                score += 5;
                break;
        }
        return Math.min(score, 100);
    }
    generateUserRecommendations(riskScore, patterns) {
        const recommendations = [];
        if (riskScore > 70) {
            recommendations.push('Immediate security review required due to high risk score');
        }
        else if (riskScore > 40) {
            recommendations.push('Additional monitoring recommended');
        }
        if (patterns.some((p) => p.type === 'BULK_EXPORT')) {
            recommendations.push('Review bulk export activities for business justification');
        }
        if (patterns.some((p) => p.type === 'MULTIPLE_PATIENT_ACCESS')) {
            recommendations.push('Consider additional training on PHI access policies');
        }
        return recommendations;
    }
};
exports.HipaaAuditTrailService = HipaaAuditTrailService;
exports.HipaaAuditTrailService = HipaaAuditTrailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.AuditLog)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.User)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.Patient)),
    __metadata("design:paramtypes", [Object, Object, Object, sequelize_typescript_1.Sequelize])
], HipaaAuditTrailService);
//# sourceMappingURL=hipaa-audit-trail.service.js.map