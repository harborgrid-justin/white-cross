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
var AuditMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditMiddleware = exports.AUDIT_CONFIGS = exports.AuditSeverity = exports.AuditEventType = void 0;
exports.createAuditMiddleware = createAuditMiddleware;
exports.createHealthcareAudit = createHealthcareAudit;
exports.createProductionAudit = createProductionAudit;
const common_1 = require("@nestjs/common");
var AuditEventType;
(function (AuditEventType) {
    AuditEventType["LOGIN"] = "LOGIN";
    AuditEventType["LOGOUT"] = "LOGOUT";
    AuditEventType["LOGIN_FAILED"] = "LOGIN_FAILED";
    AuditEventType["SESSION_CREATED"] = "SESSION_CREATED";
    AuditEventType["SESSION_EXPIRED"] = "SESSION_EXPIRED";
    AuditEventType["ACCESS_GRANTED"] = "ACCESS_GRANTED";
    AuditEventType["ACCESS_DENIED"] = "ACCESS_DENIED";
    AuditEventType["PERMISSION_ESCALATION"] = "PERMISSION_ESCALATION";
    AuditEventType["PHI_ACCESSED"] = "PHI_ACCESSED";
    AuditEventType["PHI_MODIFIED"] = "PHI_MODIFIED";
    AuditEventType["PHI_CREATED"] = "PHI_CREATED";
    AuditEventType["PHI_DELETED"] = "PHI_DELETED";
    AuditEventType["PHI_EXPORTED"] = "PHI_EXPORTED";
    AuditEventType["SYSTEM_ACCESS"] = "SYSTEM_ACCESS";
    AuditEventType["CONFIGURATION_CHANGED"] = "CONFIGURATION_CHANGED";
    AuditEventType["EMERGENCY_ACCESS"] = "EMERGENCY_ACCESS";
    AuditEventType["MEDICATION_ADMINISTERED"] = "MEDICATION_ADMINISTERED";
    AuditEventType["ALLERGY_UPDATED"] = "ALLERGY_UPDATED";
    AuditEventType["EMERGENCY_CONTACT_ACCESSED"] = "EMERGENCY_CONTACT_ACCESSED";
    AuditEventType["HEALTH_RECORD_VIEWED"] = "HEALTH_RECORD_VIEWED";
    AuditEventType["VACCINATION_RECORDED"] = "VACCINATION_RECORDED";
})(AuditEventType || (exports.AuditEventType = AuditEventType = {}));
var AuditSeverity;
(function (AuditSeverity) {
    AuditSeverity["INFO"] = "INFO";
    AuditSeverity["WARNING"] = "WARNING";
    AuditSeverity["ERROR"] = "ERROR";
    AuditSeverity["CRITICAL"] = "CRITICAL";
})(AuditSeverity || (exports.AuditSeverity = AuditSeverity = {}));
exports.AUDIT_CONFIGS = {
    healthcare: {
        enablePHITracking: true,
        enableDetailedLogging: true,
        retentionPeriodDays: 2190,
        enableRealTimeAlerts: true,
        sensitiveActions: [
            AuditEventType.PHI_ACCESSED,
            AuditEventType.PHI_MODIFIED,
            AuditEventType.PHI_EXPORTED,
            AuditEventType.EMERGENCY_ACCESS,
            AuditEventType.LOGIN_FAILED,
        ],
        excludedPaths: ['/health', '/metrics', '/favicon.ico'],
        maxAuditHistory: 100000,
    },
    development: {
        enablePHITracking: false,
        enableDetailedLogging: false,
        retentionPeriodDays: 30,
        enableRealTimeAlerts: false,
        sensitiveActions: [AuditEventType.LOGIN_FAILED],
        excludedPaths: ['/health', '/metrics', '/favicon.ico', '/api/docs'],
        maxAuditHistory: 1000,
    },
    production: {
        enablePHITracking: true,
        enableDetailedLogging: false,
        retentionPeriodDays: 2190,
        enableRealTimeAlerts: true,
        sensitiveActions: [
            AuditEventType.PHI_ACCESSED,
            AuditEventType.PHI_MODIFIED,
            AuditEventType.PHI_EXPORTED,
            AuditEventType.EMERGENCY_ACCESS,
            AuditEventType.ACCESS_DENIED,
            AuditEventType.LOGIN_FAILED,
        ],
        excludedPaths: ['/health', '/metrics'],
        maxAuditHistory: 500000,
    },
};
let AuditMiddleware = AuditMiddleware_1 = class AuditMiddleware {
    logger = new common_1.Logger(AuditMiddleware_1.name);
    config;
    auditEvents = [];
    alertCallbacks = [];
    cleanupInterval;
    constructor() {
        this.config = exports.AUDIT_CONFIGS.healthcare;
        this.cleanupInterval = setInterval(() => {
            this.cleanupOldEvents();
        }, 24 * 60 * 60 * 1000);
    }
    use(req, res, next) {
        if (this.config.excludedPaths.some((path) => req.path.includes(path))) {
            return next();
        }
        const user = req.user;
        const ipAddress = this.getClientIP(req);
        const userAgent = req.get('user-agent');
        const phiAccessed = this.isPHIAccess(req.path);
        this.logEvent(phiAccessed ? AuditEventType.PHI_ACCESSED : AuditEventType.SYSTEM_ACCESS, `${req.method} ${req.path}`, 'SUCCESS', {
            userId: user?.userId,
            userEmail: user?.email,
            userRole: user?.role,
            sessionId: req.sessionID,
            ipAddress,
            userAgent,
            resource: req.path,
            phiAccessed,
            details: {
                method: req.method,
                query: req.query,
                timestamp: new Date().toISOString(),
            },
        }).catch((err) => {
            this.logger.error('Failed to log audit event', err);
        });
        next();
    }
    async logEvent(eventType, action, result, context) {
        const eventId = this.generateEventId();
        const severity = this.determineSeverity(eventType, result);
        const auditEvent = {
            eventId,
            timestamp: Date.now(),
            eventType,
            severity,
            action,
            result,
            ...context,
        };
        this.auditEvents.push(auditEvent);
        const logLevel = severity === AuditSeverity.CRITICAL || severity === AuditSeverity.ERROR
            ? 'error'
            : severity === AuditSeverity.WARNING
                ? 'warn'
                : 'log';
        this.logger[logLevel]('Audit Event', {
            eventId,
            eventType,
            severity,
            action,
            result,
            userId: context.userId,
            userEmail: context.userEmail,
            ipAddress: context.ipAddress,
            resource: context.resource,
            phiAccessed: context.phiAccessed,
            studentId: context.studentId,
            error: context.error,
        });
        if (this.config.enablePHITracking && context.phiAccessed) {
            await this.handlePHIAccess(auditEvent);
        }
        if (this.config.enableRealTimeAlerts && this.isSensitiveAction(eventType)) {
            await this.triggerAlert(auditEvent);
        }
        if (this.auditEvents.length > this.config.maxAuditHistory) {
            this.cleanupOldEvents();
        }
    }
    async logAuthentication(success, ipAddress, userId, email, userAgent, error) {
        const eventType = success
            ? AuditEventType.LOGIN
            : AuditEventType.LOGIN_FAILED;
        await this.logEvent(eventType, 'User Authentication', success ? 'SUCCESS' : 'FAILURE', {
            userId,
            userEmail: email,
            ipAddress,
            userAgent,
            error,
            details: { timestamp: new Date().toISOString() },
        });
    }
    async logPHIAccess(action, studentId, userId, userEmail, userRole, ipAddress, resource, reasoning) {
        let eventType;
        switch (action) {
            case 'VIEW':
                eventType = AuditEventType.PHI_ACCESSED;
                break;
            case 'EDIT':
                eventType = AuditEventType.PHI_MODIFIED;
                break;
            case 'CREATE':
                eventType = AuditEventType.PHI_CREATED;
                break;
            case 'DELETE':
                eventType = AuditEventType.PHI_DELETED;
                break;
            case 'EXPORT':
                eventType = AuditEventType.PHI_EXPORTED;
                break;
        }
        await this.logEvent(eventType, `PHI ${action}`, 'SUCCESS', {
            userId,
            userEmail,
            userRole,
            ipAddress,
            resource,
            phiAccessed: true,
            studentId,
            reasoning,
            details: {
                action,
                timestamp: new Date().toISOString(),
                resource,
            },
        });
    }
    async logEmergencyAccess(userId, userEmail, userRole, studentId, ipAddress, reasoning) {
        await this.logEvent(AuditEventType.EMERGENCY_ACCESS, 'Emergency PHI Access', 'SUCCESS', {
            userId,
            userEmail,
            userRole,
            ipAddress,
            resource: `student/${studentId}`,
            phiAccessed: true,
            studentId,
            reasoning,
            details: {
                emergencyAccess: true,
                timestamp: new Date().toISOString(),
            },
        });
    }
    async logAccessDenied(userId, userEmail, userRole, resource, ipAddress, reason) {
        await this.logEvent(AuditEventType.ACCESS_DENIED, 'Access Denied', 'FAILURE', {
            userId,
            userEmail,
            userRole,
            ipAddress,
            resource,
            error: reason,
            details: {
                deniedReason: reason,
                timestamp: new Date().toISOString(),
            },
        });
    }
    getAuditSummary(timeWindow) {
        const now = Date.now();
        const windowStart = timeWindow ? now - timeWindow : 0;
        const relevantEvents = this.auditEvents.filter((e) => e.timestamp >= windowStart);
        const phiAccess = relevantEvents.filter((e) => e.phiAccessed).length;
        const failedAttempts = relevantEvents.filter((e) => e.result === 'FAILURE').length;
        const emergencyAccess = relevantEvents.filter((e) => e.eventType === AuditEventType.EMERGENCY_ACCESS).length;
        const criticalEvents = relevantEvents.filter((e) => e.severity === AuditSeverity.CRITICAL).length;
        const uniqueUsers = new Set(relevantEvents.map((e) => e.userId).filter(Boolean)).size;
        const timestamps = relevantEvents.map((e) => e.timestamp);
        const timeRange = {
            start: timestamps.length > 0 ? Math.min(...timestamps) : now,
            end: timestamps.length > 0 ? Math.max(...timestamps) : now,
        };
        return {
            totalEvents: relevantEvents.length,
            phiAccess,
            failedAttempts,
            emergencyAccess,
            criticalEvents,
            uniqueUsers,
            timeRange,
        };
    }
    getEventsByType(eventType, limit = 100) {
        return this.auditEvents
            .filter((e) => e.eventType === eventType)
            .slice(-limit);
    }
    getEventsByUser(userId, limit = 100) {
        return this.auditEvents.filter((e) => e.userId === userId).slice(-limit);
    }
    getPHIAccessEvents(studentId, limit = 100) {
        let events = this.auditEvents.filter((e) => e.phiAccessed);
        if (studentId) {
            events = events.filter((e) => e.studentId === studentId);
        }
        return events.slice(-limit);
    }
    getFailedAttempts(limit = 100) {
        return this.auditEvents.filter((e) => e.result === 'FAILURE').slice(-limit);
    }
    searchEvents(criteria, limit = 100) {
        return this.auditEvents
            .filter((event) => {
            if (criteria.eventType && event.eventType !== criteria.eventType)
                return false;
            if (criteria.userId && event.userId !== criteria.userId)
                return false;
            if (criteria.studentId && event.studentId !== criteria.studentId)
                return false;
            if (criteria.ipAddress && event.ipAddress !== criteria.ipAddress)
                return false;
            if (criteria.severity && event.severity !== criteria.severity)
                return false;
            if (criteria.startTime && event.timestamp < criteria.startTime)
                return false;
            if (criteria.endTime && event.timestamp > criteria.endTime)
                return false;
            if (criteria.phiAccessed !== undefined &&
                event.phiAccessed !== criteria.phiAccessed)
                return false;
            return true;
        })
            .slice(-limit);
    }
    exportAuditLog() {
        return {
            events: [...this.auditEvents],
            summary: this.getAuditSummary(),
            exportedAt: Date.now(),
            config: { ...this.config },
        };
    }
    onAlert(callback) {
        this.alertCallbacks.push(callback);
    }
    generateEventId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `audit_${timestamp}_${random}`;
    }
    determineSeverity(eventType, result) {
        if (eventType === AuditEventType.EMERGENCY_ACCESS ||
            eventType === AuditEventType.PHI_DELETED ||
            eventType === AuditEventType.CONFIGURATION_CHANGED) {
            return AuditSeverity.CRITICAL;
        }
        if (result === 'FAILURE' ||
            eventType === AuditEventType.ACCESS_DENIED ||
            eventType === AuditEventType.LOGIN_FAILED) {
            return AuditSeverity.ERROR;
        }
        if (eventType === AuditEventType.PHI_ACCESSED ||
            eventType === AuditEventType.PHI_MODIFIED ||
            eventType === AuditEventType.PHI_EXPORTED) {
            return AuditSeverity.WARNING;
        }
        return AuditSeverity.INFO;
    }
    isSensitiveAction(eventType) {
        return this.config.sensitiveActions.includes(eventType);
    }
    async handlePHIAccess(event) {
        this.logger.log('PHI Access Detected', {
            eventId: event.eventId,
            userId: event.userId,
            studentId: event.studentId,
            resource: event.resource,
            timestamp: new Date(event.timestamp).toISOString(),
        });
    }
    async triggerAlert(event) {
        for (const callback of this.alertCallbacks) {
            try {
                callback(event);
            }
            catch (error) {
                this.logger.error('Alert callback failed', {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    eventId: event.eventId,
                });
            }
        }
    }
    cleanupOldEvents() {
        const cutoffTime = Date.now() - this.config.retentionPeriodDays * 24 * 60 * 60 * 1000;
        const initialCount = this.auditEvents.length;
        this.auditEvents = this.auditEvents.filter((e) => e.timestamp > cutoffTime);
        const cleaned = initialCount - this.auditEvents.length;
        if (cleaned > 0) {
            this.logger.log('Cleaned up old audit events', {
                removed: cleaned,
                remaining: this.auditEvents.length,
            });
        }
    }
    isPHIAccess(path) {
        const phiPaths = [
            '/api/patients',
            '/api/health-records',
            '/api/medical-history',
            '/api/medications',
            '/api/immunizations',
            '/api/allergies',
            '/api/diagnoses',
        ];
        return phiPaths.some((phiPath) => path.startsWith(phiPath));
    }
    getClientIP(req) {
        return (req.headers['x-forwarded-for']?.split(',')[0] ||
            req.headers['x-real-ip'] ||
            req.ip ||
            'unknown');
    }
    onModuleDestroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
};
exports.AuditMiddleware = AuditMiddleware;
exports.AuditMiddleware = AuditMiddleware = AuditMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuditMiddleware);
function createAuditMiddleware(config) {
    const middleware = new AuditMiddleware();
    if (config) {
        middleware.config = config;
    }
    return middleware;
}
function createHealthcareAudit() {
    const middleware = new AuditMiddleware();
    middleware.config = exports.AUDIT_CONFIGS.healthcare;
    return middleware;
}
function createProductionAudit() {
    const middleware = new AuditMiddleware();
    middleware.config = exports.AUDIT_CONFIGS.production;
    return middleware;
}
exports.default = AuditMiddleware;
//# sourceMappingURL=audit.middleware.js.map