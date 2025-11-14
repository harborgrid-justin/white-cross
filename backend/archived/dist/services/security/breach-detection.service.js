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
exports.BreachDetectionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../database");
const schedule_1 = require("@nestjs/schedule");
const base_1 = require("../../common/base");
let BreachDetectionService = class BreachDetectionService extends base_1.BaseService {
    auditLogModel;
    FAILED_AUTH_THRESHOLD = 5;
    FAILED_AUTH_WINDOW_MINUTES = 15;
    BULK_EXPORT_THRESHOLD = 100;
    PHI_ACCESS_RATE_THRESHOLD = 50;
    UNUSUAL_HOUR_START = 22;
    UNUSUAL_HOUR_END = 6;
    constructor(auditLogModel) {
        super("BreachDetectionService");
        this.auditLogModel = auditLogModel;
    }
    async performBreachScan() {
        this.logInfo('Starting scheduled breach detection scan');
        const alerts = [];
        try {
            const failedAuthAlerts = await this.detectFailedAuthenticationSpikes();
            const unauthorizedAccessAlerts = await this.detectUnauthorizedAccess();
            const suspiciousPatternAlerts = await this.detectSuspiciousPatterns();
            const bulkExportAlerts = await this.detectBulkDataExport();
            const privilegeEscalationAlerts = await this.detectPrivilegeEscalation();
            alerts.push(...failedAuthAlerts, ...unauthorizedAccessAlerts, ...suspiciousPatternAlerts, ...bulkExportAlerts, ...privilegeEscalationAlerts);
            if (alerts.length > 0) {
                this.logWarning(`Breach detection found ${alerts.length} potential security incidents`);
                const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL');
                if (criticalAlerts.length > 0) {
                    await this.sendCriticalAlerts(criticalAlerts);
                }
            }
            else {
                this.logInfo('Breach detection scan completed - no threats detected');
            }
            return alerts;
        }
        catch (error) {
            this.logError('Error during breach detection scan:', error);
            throw error;
        }
    }
    async detectFailedAuthenticationSpikes() {
        const alerts = [];
        const windowStart = new Date(Date.now() - this.FAILED_AUTH_WINDOW_MINUTES * 60 * 1000);
        try {
            const failedLogins = await this.auditLogModel.findAll({
                where: {
                    action: 'LOGIN',
                    success: false,
                    createdAt: {
                        [sequelize_2.Op.gte]: windowStart,
                    },
                },
                attributes: ['userId', 'ipAddress', 'createdAt', 'metadata'],
            });
            const failuresByUser = new Map();
            const failuresByIP = new Map();
            failedLogins.forEach((log) => {
                const userId = log.userId || 'UNKNOWN';
                const ipAddress = log.ipAddress || 'UNKNOWN';
                if (!failuresByUser.has(userId)) {
                    failuresByUser.set(userId, []);
                }
                failuresByUser.get(userId).push(log);
                if (!failuresByIP.has(ipAddress)) {
                    failuresByIP.set(ipAddress, []);
                }
                failuresByIP.get(ipAddress).push(log);
            });
            for (const [userId, failures] of failuresByUser) {
                if (failures.length >= this.FAILED_AUTH_THRESHOLD) {
                    alerts.push({
                        id: `FAILED_AUTH_USER_${userId}_${Date.now()}`,
                        type: 'FAILED_AUTH',
                        severity: failures.length >= 10 ? 'CRITICAL' : 'HIGH',
                        description: `User ${userId} has ${failures.length} failed login attempts in ${this.FAILED_AUTH_WINDOW_MINUTES} minutes`,
                        affectedRecords: 0,
                        affectedUsers: [userId],
                        detectedAt: new Date(),
                        evidence: {
                            failures: failures.map((f) => ({
                                timestamp: f.createdAt,
                                ipAddress: f.ipAddress,
                            })),
                        },
                        requiresBreachNotification: false,
                        recommendedActions: [
                            'Lock user account temporarily',
                            'Contact user to verify legitimate access attempt',
                            'Investigate IP address for malicious activity',
                            'Review account for compromise indicators',
                        ],
                    });
                }
            }
            for (const [ipAddress, failures] of failuresByIP) {
                if (failures.length >= this.FAILED_AUTH_THRESHOLD) {
                    alerts.push({
                        id: `FAILED_AUTH_IP_${ipAddress}_${Date.now()}`,
                        type: 'FAILED_AUTH',
                        severity: failures.length >= 20 ? 'CRITICAL' : 'HIGH',
                        description: `IP ${ipAddress} has ${failures.length} failed login attempts in ${this.FAILED_AUTH_WINDOW_MINUTES} minutes`,
                        affectedRecords: 0,
                        affectedUsers: [...new Set(failures.map((f) => f.userId).filter(Boolean))],
                        detectedAt: new Date(),
                        evidence: {
                            ipAddress,
                            failures: failures.map((f) => ({
                                timestamp: f.createdAt,
                                userId: f.userId,
                            })),
                        },
                        requiresBreachNotification: false,
                        recommendedActions: [
                            'Block IP address temporarily',
                            'Add IP to security monitoring watchlist',
                            'Investigate geographic location of IP',
                            'Check for distributed attack pattern',
                        ],
                    });
                }
            }
        }
        catch (error) {
            this.logError('Error detecting failed authentication spikes:', error);
        }
        return alerts;
    }
    async detectUnauthorizedAccess() {
        const alerts = [];
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        try {
            const unauthorizedAttempts = await this.auditLogModel.findAll({
                where: {
                    isPHI: true,
                    success: false,
                    createdAt: {
                        [sequelize_2.Op.gte]: last24Hours,
                    },
                },
                order: [['createdAt', 'DESC']],
            });
            if (unauthorizedAttempts.length > 0) {
                const attemptsByUser = new Map();
                unauthorizedAttempts.forEach((attempt) => {
                    const userId = attempt.userId || 'UNKNOWN';
                    if (!attemptsByUser.has(userId)) {
                        attemptsByUser.set(userId, []);
                    }
                    attemptsByUser.get(userId).push(attempt);
                });
                for (const [userId, attempts] of attemptsByUser) {
                    if (attempts.length >= 3) {
                        alerts.push({
                            id: `UNAUTH_ACCESS_${userId}_${Date.now()}`,
                            type: 'UNAUTHORIZED_ACCESS',
                            severity: 'HIGH',
                            description: `User ${userId} has ${attempts.length} unauthorized PHI access attempts in 24 hours`,
                            affectedRecords: attempts.length,
                            affectedUsers: [userId],
                            detectedAt: new Date(),
                            evidence: {
                                attempts: attempts.map((a) => ({
                                    timestamp: a.createdAt,
                                    entityType: a.entityType,
                                    entityId: a.entityId,
                                    action: a.action,
                                    errorMessage: a.errorMessage,
                                })),
                            },
                            requiresBreachNotification: false,
                            recommendedActions: [
                                'Review user permissions and access rights',
                                'Contact user to verify legitimate access need',
                                'Investigate reason for access denials',
                                'Consider additional access training',
                            ],
                        });
                    }
                }
            }
        }
        catch (error) {
            this.logError('Error detecting unauthorized access:', error);
        }
        return alerts;
    }
    async detectSuspiciousPatterns() {
        const alerts = [];
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        try {
            const unusualTimeAccess = await this.auditLogModel.findAll({
                where: {
                    isPHI: true,
                    success: true,
                    createdAt: {
                        [sequelize_2.Op.gte]: last24Hours,
                    },
                },
                attributes: ['userId', 'userName', 'createdAt', 'entityType', 'ipAddress'],
            });
            const suspiciousByUser = new Map();
            unusualTimeAccess.forEach((log) => {
                const hour = log.createdAt.getHours();
                if (hour >= this.UNUSUAL_HOUR_START || hour < this.UNUSUAL_HOUR_END) {
                    const userId = log.userId || 'UNKNOWN';
                    if (!suspiciousByUser.has(userId)) {
                        suspiciousByUser.set(userId, []);
                    }
                    suspiciousByUser.get(userId).push(log);
                }
            });
            for (const [userId, accesses] of suspiciousByUser) {
                if (accesses.length >= 10) {
                    alerts.push({
                        id: `SUSPICIOUS_TIME_${userId}_${Date.now()}`,
                        type: 'SUSPICIOUS_PATTERN',
                        severity: 'MEDIUM',
                        description: `User ${userId} accessed ${accesses.length} PHI records during unusual hours (${this.UNUSUAL_HOUR_START}:00-${this.UNUSUAL_HOUR_END}:00)`,
                        affectedRecords: accesses.length,
                        affectedUsers: [userId],
                        detectedAt: new Date(),
                        evidence: {
                            accesses: accesses.map((a) => ({
                                timestamp: a.createdAt,
                                entityType: a.entityType,
                                ipAddress: a.ipAddress,
                            })),
                        },
                        requiresBreachNotification: false,
                        recommendedActions: [
                            'Contact user to verify legitimate after-hours access',
                            'Review justification for unusual access times',
                            'Check if user is authorized for after-hours access',
                            'Monitor for continued pattern',
                        ],
                    });
                }
            }
            const lastHour = new Date(Date.now() - 60 * 60 * 1000);
            const recentPHIAccess = await this.auditLogModel.findAll({
                where: {
                    isPHI: true,
                    success: true,
                    createdAt: {
                        [sequelize_2.Op.gte]: lastHour,
                    },
                },
                attributes: ['userId', 'userName'],
            });
            const accessByUser = new Map();
            recentPHIAccess.forEach((log) => {
                const userId = log.userId || 'UNKNOWN';
                accessByUser.set(userId, (accessByUser.get(userId) || 0) + 1);
            });
            for (const [userId, count] of accessByUser) {
                if (count >= this.PHI_ACCESS_RATE_THRESHOLD) {
                    alerts.push({
                        id: `HIGH_VOLUME_${userId}_${Date.now()}`,
                        type: 'SUSPICIOUS_PATTERN',
                        severity: 'HIGH',
                        description: `User ${userId} accessed ${count} PHI records in the last hour (threshold: ${this.PHI_ACCESS_RATE_THRESHOLD})`,
                        affectedRecords: count,
                        affectedUsers: [userId],
                        detectedAt: new Date(),
                        evidence: { count, threshold: this.PHI_ACCESS_RATE_THRESHOLD },
                        requiresBreachNotification: false,
                        recommendedActions: [
                            'Verify legitimate bulk access need',
                            'Review access purpose and authorization',
                            'Check for automated scraping or data mining',
                            'Consider rate limiting for user',
                        ],
                    });
                }
            }
        }
        catch (error) {
            this.logError('Error detecting suspicious patterns:', error);
        }
        return alerts;
    }
    async detectBulkDataExport() {
        const alerts = [];
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        try {
            const exportActions = await this.auditLogModel.findAll({
                where: {
                    action: {
                        [sequelize_2.Op.in]: ['EXPORT', 'BULK_READ'],
                    },
                    isPHI: true,
                    success: true,
                    createdAt: {
                        [sequelize_2.Op.gte]: last24Hours,
                    },
                },
            });
            const exportsByUser = new Map();
            exportActions.forEach((action) => {
                const userId = action.userId || 'UNKNOWN';
                if (!exportsByUser.has(userId)) {
                    exportsByUser.set(userId, []);
                }
                exportsByUser.get(userId).push(action);
            });
            for (const [userId, exports] of exportsByUser) {
                const totalRecords = exports.reduce((sum, exp) => {
                    return sum + (exp.metadata?.recordCount || 1);
                }, 0);
                if (totalRecords >= this.BULK_EXPORT_THRESHOLD) {
                    alerts.push({
                        id: `BULK_EXPORT_${userId}_${Date.now()}`,
                        type: 'DATA_EXPORT',
                        severity: totalRecords >= 500 ? 'CRITICAL' : 'HIGH',
                        description: `User ${userId} exported ${totalRecords} PHI records in 24 hours`,
                        affectedRecords: totalRecords,
                        affectedUsers: [userId],
                        detectedAt: new Date(),
                        evidence: {
                            exports: exports.map((e) => ({
                                timestamp: e.createdAt,
                                recordCount: e.metadata?.recordCount || 1,
                                entityType: e.entityType,
                            })),
                        },
                        requiresBreachNotification: totalRecords >= 500,
                        recommendedActions: [
                            'Contact user immediately to verify export purpose',
                            'Review export authorization and approval',
                            'Investigate export destination and handling',
                            'If unauthorized, initiate breach response protocol',
                            totalRecords >= 500 ? 'Prepare HHS breach notification (500+ records)' : '',
                        ].filter(Boolean),
                    });
                }
            }
        }
        catch (error) {
            this.logError('Error detecting bulk data export:', error);
        }
        return alerts;
    }
    async detectPrivilegeEscalation() {
        const alerts = [];
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        try {
            const privilegeChanges = await this.auditLogModel.findAll({
                where: {
                    entityType: {
                        [sequelize_2.Op.in]: ['User', 'Role', 'Permission'],
                    },
                    action: 'UPDATE',
                    createdAt: {
                        [sequelize_2.Op.gte]: last24Hours,
                    },
                },
            });
            privilegeChanges.forEach((change) => {
                const changedFields = change.newValues?.changedFields || [];
                const hasPrivilegeChange = changedFields.some((field) => ['role', 'permissions', 'isAdmin', 'accessLevel'].includes(field.toLowerCase()));
                if (hasPrivilegeChange) {
                    alerts.push({
                        id: `PRIV_ESC_${change.id}_${Date.now()}`,
                        type: 'PRIVILEGE_ESCALATION',
                        severity: 'CRITICAL',
                        description: `Privilege escalation detected for ${change.entityType} ${change.entityId}`,
                        affectedRecords: 1,
                        affectedUsers: [change.userId || 'SYSTEM'],
                        detectedAt: new Date(),
                        evidence: {
                            entityType: change.entityType,
                            entityId: change.entityId,
                            changedBy: change.userId,
                            previousValues: change.previousValues,
                            newValues: change.newValues,
                        },
                        requiresBreachNotification: false,
                        recommendedActions: [
                            'Verify authorization for privilege change',
                            'Review change approval documentation',
                            'Audit account for unauthorized activities',
                            'Revert changes if unauthorized',
                        ],
                    });
                }
            });
        }
        catch (error) {
            this.logError('Error detecting privilege escalation:', error);
        }
        return alerts;
    }
    async getSuspiciousActivitySummary(startDate, endDate) {
        try {
            const suspiciousLogs = await this.auditLogModel.findAll({
                where: {
                    severity: {
                        [sequelize_2.Op.in]: [database_1.AuditSeverity.HIGH, database_1.AuditSeverity.CRITICAL],
                    },
                    createdAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                order: [['createdAt', 'DESC']],
            });
            const activitiesByUser = new Map();
            suspiciousLogs.forEach((log) => {
                const key = `${log.userId}_${log.action}_${log.entityType}`;
                if (!activitiesByUser.has(key)) {
                    activitiesByUser.set(key, {
                        userId: log.userId || 'UNKNOWN',
                        userName: log.userName || 'UNKNOWN',
                        activityType: `${log.action} ${log.entityType}`,
                        occurrences: 0,
                        firstOccurrence: log.createdAt,
                        lastOccurrence: log.createdAt,
                        details: {
                            severity: log.severity,
                            isPHI: log.isPHI,
                            success: log.success,
                        },
                    });
                }
                const activity = activitiesByUser.get(key);
                activity.occurrences++;
                if (log.createdAt < activity.firstOccurrence) {
                    activity.firstOccurrence = log.createdAt;
                }
                if (log.createdAt > activity.lastOccurrence) {
                    activity.lastOccurrence = log.createdAt;
                }
            });
            return Array.from(activitiesByUser.values()).sort((a, b) => b.occurrences - a.occurrences);
        }
        catch (error) {
            this.logError('Error getting suspicious activity summary:', error);
            throw error;
        }
    }
    async sendCriticalAlerts(alerts) {
        this.logError('CRITICAL SECURITY ALERTS:', JSON.stringify(alerts, null, 2));
        for (const alert of alerts) {
            this.logError(`[CRITICAL BREACH ALERT] ${alert.type}: ${alert.description}`);
            if (alert.requiresBreachNotification) {
                this.logError(`[HIPAA BREACH NOTIFICATION REQUIRED] Alert ID: ${alert.id}`);
            }
            const notificationPayload = {
                title: `CRITICAL SECURITY BREACH: ${alert.type}`,
                message: alert.description,
                severity: alert.severity,
                alert: {
                    id: alert.id,
                    type: alert.type,
                    detectedAt: alert.detectedAt.toISOString(),
                    confirmedBreach: alert.confirmedBreach,
                    affectedRecords: alert.affectedRecords,
                    indicators: alert.indicators,
                    requiresBreachNotification: alert.requiresBreachNotification,
                },
                actionRequired: alert.requiresBreachNotification ? 'IMMEDIATE - HIPAA BREACH' : 'URGENT',
            };
            await Promise.allSettled([
                this.sendEmailNotification(notificationPayload),
                this.sendSlackNotification(notificationPayload),
                alert.severity === 'critical' || alert.confirmedBreach ? this.sendSMSNotification(notificationPayload) : Promise.resolve(),
                alert.confirmedBreach ? this.sendPagerDutyNotification(notificationPayload) : Promise.resolve(),
                this.persistAlertNotification(notificationPayload),
            ]);
        }
    }
    async sendEmailNotification(payload) {
        try {
            const emailConfig = {
                to: process.env.SECURITY_TEAM_EMAIL || 'security@whitecross.health',
                cc: process.env.SECURITY_CC_EMAILS?.split(',') || [],
                subject: payload.title,
                body: this.formatAlertEmailBody(payload),
                priority: 'high',
            };
            this.logInfo(`Email alert queued for: ${emailConfig.to}`);
        }
        catch (error) {
            this.logError('Failed to send email notification:', error);
        }
    }
    async sendSlackNotification(payload) {
        try {
            const slackWebhook = process.env.SLACK_SECURITY_WEBHOOK;
            if (!slackWebhook)
                return;
            const alert = payload.alert;
            this.logInfo('Slack alert queued for incident:', alert.id);
        }
        catch (error) {
            this.logError('Failed to send Slack notification:', error);
        }
    }
    async sendSMSNotification(payload) {
        try {
            const smsNumbers = process.env.SECURITY_TEAM_SMS?.split(',') || [];
            if (smsNumbers.length === 0)
                return;
            this.logInfo(`SMS alert queued for ${smsNumbers.length} recipients`);
        }
        catch (error) {
            this.logError('Failed to send SMS notification:', error);
        }
    }
    async sendPagerDutyNotification(payload) {
        try {
            const pagerDutyKey = process.env.PAGERDUTY_INTEGRATION_KEY;
            if (!pagerDutyKey)
                return;
            this.logInfo('PagerDuty alert queued');
        }
        catch (error) {
            this.logError('Failed to send PagerDuty notification:', error);
        }
    }
    async persistAlertNotification(payload) {
        try {
            const notification = {
                id: crypto.randomUUID(),
                type: 'critical_breach_alert',
                payload,
                sentAt: new Date(),
            };
        }
        catch (error) {
            this.logError('Failed to persist notification:', error);
        }
    }
    formatAlertEmailBody(payload) {
        const alert = payload.alert;
        return `
==============================================
WHITE CROSS SECURITY BREACH ALERT
==============================================

Title: ${payload.title}
Description: ${payload.message}

ALERT DETAILS:
-----------------------
Alert ID: ${alert.id}
Type: ${alert.type}
Severity: ${payload.severity}
Detected At: ${alert.detectedAt}
Confirmed Breach: ${alert.confirmedBreach ? 'YES' : 'NO'}
Affected Records: ${alert.affectedRecords || 'Unknown'}
HIPAA Notification Required: ${alert.requiresBreachNotification ? 'YES' : 'NO'}

INDICATORS:
-----------------------
${JSON.stringify(alert.indicators, null, 2)}

ACTION REQUIRED: ${payload.actionRequired}

This is an automated alert from the White Cross Security System.
Please review and respond immediately.
==============================================
    `.trim();
    }
    async getBreachAlerts(startDate, endDate) {
        return this.performBreachScan();
    }
};
exports.BreachDetectionService = BreachDetectionService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BreachDetectionService.prototype, "performBreachScan", null);
exports.BreachDetectionService = BreachDetectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.AuditLog)),
    __metadata("design:paramtypes", [Object])
], BreachDetectionService);
//# sourceMappingURL=breach-detection.service.js.map