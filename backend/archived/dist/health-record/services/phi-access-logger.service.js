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
var PHIAccessLogger_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHIAccessLogger = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const database_enums_1 = require("../../database/types/database.enums");
const models_2 = require("../../database/models");
let PHIAccessLogger = PHIAccessLogger_1 = class PHIAccessLogger {
    auditLogModel;
    phiDisclosureAuditModel;
    logger = new common_1.Logger(PHIAccessLogger_1.name);
    constructor(auditLogModel, phiDisclosureAuditModel) {
        this.auditLogModel = auditLogModel;
        this.phiDisclosureAuditModel = phiDisclosureAuditModel;
        this.logger.log('PHI Access Logger Service initialized with database persistence');
    }
    async logPHIAccess(entry) {
        try {
            const auditEntry = {
                action: this.mapOperationToAuditAction(entry.operation),
                entityType: 'PHI_ACCESS',
                entityId: entry.studentId || entry.correlationId,
                userId: entry.userId || null,
                userName: null,
                changes: {
                    operation: entry.operation,
                    dataTypes: entry.dataTypes,
                    recordCount: entry.recordCount,
                    sensitivityLevel: entry.sensitivityLevel,
                    ipAddress: entry.ipAddress,
                    userAgent: entry.userAgent,
                    success: entry.success,
                },
                ipAddress: entry.ipAddress,
                userAgent: entry.userAgent,
                isPHI: true,
                complianceType: models_1.ComplianceType.HIPAA,
                severity: this.determineSeverity(entry),
                success: entry.success,
                tags: ['phi-access', entry.sensitivityLevel.toLowerCase()],
                metadata: {
                    correlationId: entry.correlationId,
                    studentId: entry.studentId,
                    dataTypes: entry.dataTypes,
                    sensitivityLevel: entry.sensitivityLevel,
                },
            };
            await this.auditLogModel.create(auditEntry);
            const logMessage = this.formatPHIAccessLog(entry);
            if (entry.sensitivityLevel === 'SENSITIVE_PHI') {
                this.logger.warn(`[PHI_SENSITIVE] ${logMessage}`);
            }
            else {
                this.logger.log(`[PHI_ACCESS] ${logMessage}`);
            }
            await this.detectSuspiciousActivity(entry);
            await this.logToComplianceSystem(entry);
        }
        catch (error) {
            this.logger.error(`Failed to log PHI access for correlationId ${entry.correlationId}:`, error);
            console.error('PHI ACCESS LOGGING FAILURE:', entry);
        }
    }
    async logSecurityIncident(incident) {
        try {
            const auditEntry = {
                action: database_enums_1.AuditAction.UPDATE,
                entityType: 'PHI_SECURITY',
                entityId: incident.correlationId,
                userId: incident.userId || null,
                userName: null,
                changes: {
                    incidentType: incident.incidentType,
                    operation: incident.operation,
                    errorMessage: incident.errorMessage,
                    severity: incident.severity,
                },
                ipAddress: incident.ipAddress,
                userAgent: null,
                isPHI: true,
                complianceType: models_1.ComplianceType.HIPAA,
                severity: this.mapIncidentSeverityToAuditSeverity(incident.severity),
                success: false,
                tags: ['security-incident', incident.severity.toLowerCase()],
                metadata: {
                    incidentType: incident.incidentType,
                    correlationId: incident.correlationId,
                },
            };
            await this.auditLogModel.create(auditEntry);
            const incidentMessage = this.formatSecurityIncidentLog(incident);
            this.logger.error(`[SECURITY_INCIDENT] ${incidentMessage}`);
            await this.triggerSecurityAlert(incident);
        }
        catch (error) {
            this.logger.error(`Failed to log security incident for correlationId ${incident.correlationId}:`, error);
            console.error('SECURITY INCIDENT LOGGING FAILURE:', incident);
        }
    }
    async getPHIAccessStatistics(startDate, endDate, userId, studentId) {
        try {
            const whereClause = {
                createdAt: {
                    [sequelize_2.Op.between]: [startDate, endDate],
                },
                entityType: 'PHI_ACCESS',
            };
            if (userId) {
                whereClause.userId = userId;
            }
            if (studentId) {
                whereClause.entityId = studentId;
            }
            const auditLogs = await this.auditLogModel.findAll({
                where: whereClause,
                attributes: ['userId', 'entityId', 'changes', 'action'],
            });
            const uniqueUsers = new Set();
            const uniqueStudents = new Set();
            const operationCounts = {};
            const dataTypeCounts = {};
            auditLogs.forEach((log) => {
                if (log.userId)
                    uniqueUsers.add(log.userId);
                if (log.entityId)
                    uniqueStudents.add(log.entityId);
                const changes = log.changes;
                if (changes?.operation) {
                    operationCounts[changes.operation] =
                        (operationCounts[changes.operation] || 0) + 1;
                }
                if (changes?.dataTypes) {
                    changes.dataTypes.forEach((dataType) => {
                        dataTypeCounts[dataType] = (dataTypeCounts[dataType] || 0) + 1;
                    });
                }
            });
            const securityIncidents = await this.auditLogModel.count({
                where: {
                    createdAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                    action: database_enums_1.AuditAction.UPDATE,
                    entityType: 'PHI_SECURITY',
                },
            });
            return {
                totalAccesses: auditLogs.length,
                uniqueUsers: uniqueUsers.size,
                uniqueStudents: uniqueStudents.size,
                operationCounts,
                dataTypeCounts,
                securityIncidents,
                period: {
                    start: startDate,
                    end: endDate,
                },
            };
        }
        catch (error) {
            this.logger.error('Failed to retrieve PHI access statistics:', error);
            return {
                totalAccesses: 0,
                uniqueUsers: 0,
                uniqueStudents: 0,
                operationCounts: {},
                dataTypeCounts: {},
                securityIncidents: 0,
                period: { start: startDate, end: endDate },
            };
        }
    }
    async getRecentPHIAccessLogs(limit = 100, offset = 0, userId, studentId) {
        try {
            const whereClause = {
                entityType: 'PHI_ACCESS',
            };
            if (userId) {
                whereClause.userId = userId;
            }
            if (studentId) {
                whereClause.entityId = studentId;
            }
            const auditLogs = await this.auditLogModel.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
            return auditLogs.map((log) => {
                const changes = log.changes;
                return {
                    correlationId: changes?.correlationId || log.id || '',
                    timestamp: log.createdAt || new Date(),
                    userId: log.userId || undefined,
                    studentId: log.entityId || undefined,
                    operation: changes?.operation || 'UNKNOWN',
                    dataTypes: changes?.dataTypes || [],
                    recordCount: changes?.recordCount || 1,
                    sensitivityLevel: changes?.sensitivityLevel || 'PHI',
                    ipAddress: changes?.ipAddress || log.ipAddress || '',
                    userAgent: changes?.userAgent || log.userAgent || '',
                    success: changes?.success !== false,
                };
            });
        }
        catch (error) {
            this.logger.error('Failed to retrieve recent PHI access logs:', error);
            return [];
        }
    }
    async logPHIDisclosure(disclosureId, action, changes, performedBy, ipAddress, userAgent) {
        try {
            await this.phiDisclosureAuditModel.create({
                disclosureId,
                action,
                changes,
                performedBy: performedBy || 'system',
                ipAddress,
                userAgent,
            });
            this.logger.log(`PHI disclosure logged: ${disclosureId}, action: ${action}`);
        }
        catch (error) {
            this.logger.error(`Failed to log PHI disclosure for ${disclosureId}:`, error);
        }
    }
    async searchPHIAccessLogs(filters) {
        try {
            const whereClause = {
                entityType: 'PHI_ACCESS',
            };
            if (filters.userId) {
                whereClause.userId = filters.userId;
            }
            if (filters.studentId) {
                whereClause.entityId = filters.studentId;
            }
            if (filters.startDate || filters.endDate) {
                whereClause.createdAt = {};
                if (filters.startDate) {
                    whereClause.createdAt[sequelize_2.Op.gte] = filters.startDate;
                }
                if (filters.endDate) {
                    whereClause.createdAt[sequelize_2.Op.lte] = filters.endDate;
                }
            }
            const auditLogs = await this.auditLogModel.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']],
                limit: filters.limit || 100,
            });
            return auditLogs.map((log) => {
                const changes = log.changes;
                return {
                    correlationId: changes?.correlationId || log.id || '',
                    timestamp: log.createdAt || new Date(),
                    userId: log.userId || undefined,
                    studentId: log.entityId || undefined,
                    operation: changes?.operation || 'UNKNOWN',
                    dataTypes: changes?.dataTypes || [],
                    recordCount: changes?.recordCount || 1,
                    sensitivityLevel: changes?.sensitivityLevel || 'PHI',
                    ipAddress: changes?.ipAddress || log.ipAddress || '',
                    userAgent: changes?.userAgent || log.userAgent || '',
                    success: changes?.success !== false,
                };
            });
        }
        catch (error) {
            this.logger.error('Failed to search PHI access logs:', error);
            return [];
        }
    }
    async getSecurityIncidents(limit = 50) {
        try {
            const auditLogs = await this.auditLogModel.findAll({
                where: {
                    entityType: 'PHI_SECURITY',
                    action: database_enums_1.AuditAction.UPDATE,
                },
                order: [['createdAt', 'DESC']],
                limit,
            });
            return auditLogs.map((log) => {
                const changes = log.changes;
                return {
                    correlationId: changes?.correlationId || log.id || '',
                    timestamp: log.createdAt || new Date(),
                    incidentType: changes?.incidentType || 'UNKNOWN',
                    userId: log.userId || undefined,
                    ipAddress: log.ipAddress || '',
                    operation: changes?.operation || 'UNKNOWN',
                    errorMessage: changes?.errorMessage || '',
                    severity: changes?.severity || 'MEDIUM',
                };
            });
        }
        catch (error) {
            this.logger.error('Failed to retrieve security incidents:', error);
            return [];
        }
    }
    async generateComplianceReport(startDate, endDate) {
        try {
            const phiAccessSummary = await this.getPHIAccessStatistics(startDate, endDate);
            const securityIncidents = await this.getSecurityIncidents(100);
            let complianceScore = 100;
            const recommendations = [];
            if (securityIncidents.length > 0) {
                const deduction = Math.min(securityIncidents.length * 5, 40);
                complianceScore -= deduction;
                recommendations.push(`Address ${securityIncidents.length} security incidents to improve compliance score`);
            }
            if (phiAccessSummary.totalAccesses > 1000) {
                complianceScore -= 10;
                recommendations.push('Implement rate limiting for high-volume PHI access');
            }
            if (phiAccessSummary.totalAccesses === 0 &&
                securityIncidents.length === 0) {
                complianceScore -= 20;
                recommendations.push('Ensure audit logging is properly configured and active');
            }
            const sensitiveAccessCount = phiAccessSummary.dataTypeCounts['SENSITIVE_PHI'] || 0;
            if (sensitiveAccessCount > phiAccessSummary.totalAccesses * 0.1) {
                complianceScore -= 15;
                recommendations.push('Review access controls for sensitive PHI data');
            }
            return {
                phiAccessSummary,
                securityIncidents,
                complianceScore: Math.max(complianceScore, 0),
                recommendations,
                period: { start: startDate, end: endDate },
            };
        }
        catch (error) {
            this.logger.error('Failed to generate compliance report:', error);
            return {
                phiAccessSummary: {
                    totalAccesses: 0,
                    uniqueUsers: 0,
                    uniqueStudents: 0,
                    operationCounts: {},
                    dataTypeCounts: {},
                    securityIncidents: 0,
                    period: { start: startDate, end: endDate },
                },
                securityIncidents: [],
                complianceScore: 0,
                recommendations: [
                    'Unable to generate compliance report due to system error',
                ],
                period: { start: startDate, end: endDate },
            };
        }
    }
    mapOperationToAuditAction(operation) {
        const operationMap = {
            READ: database_enums_1.AuditAction.READ,
            CREATE: database_enums_1.AuditAction.CREATE,
            UPDATE: database_enums_1.AuditAction.UPDATE,
            DELETE: database_enums_1.AuditAction.DELETE,
            EXPORT: database_enums_1.AuditAction.EXPORT,
            SEARCH: database_enums_1.AuditAction.VIEW,
            CACHE_READ: database_enums_1.AuditAction.READ,
            CACHE_WRITE: database_enums_1.AuditAction.UPDATE,
        };
        return operationMap[operation] || database_enums_1.AuditAction.READ;
    }
    determineSeverity(entry) {
        if (entry.sensitivityLevel === 'SENSITIVE_PHI') {
            return models_1.AuditSeverity.HIGH;
        }
        if (entry.recordCount > 100) {
            return models_1.AuditSeverity.MEDIUM;
        }
        if (!entry.success) {
            return models_1.AuditSeverity.MEDIUM;
        }
        return models_1.AuditSeverity.LOW;
    }
    mapIncidentSeverityToAuditSeverity(severity) {
        const severityMap = {
            LOW: models_1.AuditSeverity.LOW,
            MEDIUM: models_1.AuditSeverity.MEDIUM,
            HIGH: models_1.AuditSeverity.HIGH,
            CRITICAL: models_1.AuditSeverity.CRITICAL,
        };
        return severityMap[severity] || models_1.AuditSeverity.MEDIUM;
    }
    formatPHIAccessLog(entry) {
        return (`PHI Access - User: ${entry.userId || 'unknown'}, Student: ${entry.studentId || 'unknown'}, ` +
            `Operation: ${entry.operation}, DataTypes: [${entry.dataTypes.join(', ')}], ` +
            `Records: ${entry.recordCount}, Level: ${entry.sensitivityLevel}, ` +
            `Success: ${entry.success}, IP: ${entry.ipAddress}`);
    }
    formatSecurityIncidentLog(incident) {
        return (`Security Incident - Type: ${incident.incidentType}, User: ${incident.userId || 'unknown'}, ` +
            `Operation: ${incident.operation}, Severity: ${incident.severity}, ` +
            `IP: ${incident.ipAddress}, Message: ${incident.errorMessage}`);
    }
    async detectSuspiciousActivity(entry) {
        try {
            const recentAccesses = await this.auditLogModel.count({
                where: {
                    userId: entry.userId,
                    entityType: 'PHI_ACCESS',
                    createdAt: {
                        [sequelize_2.Op.gte]: new Date(Date.now() - 60 * 60 * 1000),
                    },
                },
            });
            if (recentAccesses > 50) {
                await this.logSecurityIncident({
                    correlationId: entry.correlationId,
                    timestamp: new Date(),
                    incidentType: 'HIGH_FREQUENCY_PHI_ACCESS',
                    userId: entry.userId,
                    ipAddress: entry.ipAddress,
                    operation: entry.operation,
                    errorMessage: `High frequency PHI access detected: ${recentAccesses} accesses in last hour`,
                    severity: 'MEDIUM',
                });
            }
            if (entry.studentId) {
                const studentAccesses = await this.auditLogModel.count({
                    where: {
                        userId: entry.userId,
                        entityType: 'PHI_ACCESS',
                        createdAt: {
                            [sequelize_2.Op.gte]: new Date(Date.now() - 30 * 60 * 1000),
                        },
                    },
                });
                if (studentAccesses > 20) {
                    await this.logSecurityIncident({
                        correlationId: entry.correlationId,
                        timestamp: new Date(),
                        incidentType: 'MULTIPLE_STUDENT_ACCESS',
                        userId: entry.userId,
                        ipAddress: entry.ipAddress,
                        operation: entry.operation,
                        errorMessage: `Multiple student access detected: ${studentAccesses} students in last 30 minutes`,
                        severity: 'HIGH',
                    });
                }
            }
        }
        catch (error) {
            this.logger.error('Failed to detect suspicious activity:', error);
        }
    }
    async logToComplianceSystem(entry) {
        this.logger.debug(`Compliance system logging for PHI access: ${entry.correlationId}`);
    }
    async triggerSecurityAlert(incident) {
        this.logger.warn(`Security alert triggered for incident: ${incident.incidentType}`);
    }
    onModuleDestroy() {
        this.logger.log('PHI Access Logger Service destroyed');
    }
};
exports.PHIAccessLogger = PHIAccessLogger;
exports.PHIAccessLogger = PHIAccessLogger = PHIAccessLogger_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.AuditLog)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.PhiDisclosureAudit)),
    __metadata("design:paramtypes", [Object, Object])
], PHIAccessLogger);
//# sourceMappingURL=phi-access-logger.service.js.map