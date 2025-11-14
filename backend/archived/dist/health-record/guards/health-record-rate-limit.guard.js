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
var HealthRecordRateLimitGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRecordRateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const health_record_metrics_service_1 = require("../services/health-record-metrics.service");
const phi_access_logger_service_1 = require("../services/phi-access-logger.service");
const enterprise_decorators_1 = require("../../common/enterprise/decorators/enterprise-decorators");
let HealthRecordRateLimitGuard = HealthRecordRateLimitGuard_1 = class HealthRecordRateLimitGuard {
    reflector;
    metricsService;
    phiAccessLogger;
    logger = new common_1.Logger(HealthRecordRateLimitGuard_1.name);
    rateLimitStore = new Map();
    cleanupInterval;
    rateLimitTiers = {
        PHI_READ: {
            limit: 100,
            windowMs: 60 * 1000,
            blockDuration: 5 * 60 * 1000,
            escalationThreshold: 3,
        },
        PHI_WRITE: {
            limit: 50,
            windowMs: 60 * 1000,
            blockDuration: 10 * 60 * 1000,
            escalationThreshold: 2,
        },
        PHI_EXPORT: {
            limit: 10,
            windowMs: 60 * 60 * 1000,
            blockDuration: 30 * 60 * 1000,
            escalationThreshold: 1,
        },
        SENSITIVE_PHI: {
            limit: 25,
            windowMs: 60 * 1000,
            blockDuration: 15 * 60 * 1000,
            escalationThreshold: 2,
        },
        PHI_SEARCH: {
            limit: 30,
            windowMs: 60 * 1000,
            blockDuration: 10 * 60 * 1000,
            escalationThreshold: 2,
        },
        INTERNAL: {
            limit: 200,
            windowMs: 60 * 1000,
            blockDuration: 2 * 60 * 1000,
            escalationThreshold: 5,
        },
        PUBLIC: {
            limit: 500,
            windowMs: 60 * 1000,
            blockDuration: 1 * 60 * 1000,
            escalationThreshold: 10,
        },
    };
    constructor(reflector, metricsService, phiAccessLogger) {
        this.reflector = reflector;
        this.metricsService = metricsService;
        this.phiAccessLogger = phiAccessLogger;
        this.startCleanupInterval();
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const handler = context.getHandler();
        const controller = context.getClass();
        const rateLimitConfig = this.reflector.getAllAndOverride(enterprise_decorators_1.ENTERPRISE_RATE_LIMIT_KEY, [handler, controller]);
        if (!rateLimitConfig) {
            return true;
        }
        const clientKey = this.generateClientKey(request);
        const operationType = this.determineOperationType(request);
        const tier = this.rateLimitTiers[operationType];
        try {
            const allowed = await this.checkRateLimit(clientKey, tier, request, operationType);
            if (!allowed) {
                this.logRateLimitViolation(request, operationType, tier);
                this.recordSecurityIncident(request, operationType);
                throw new common_1.HttpException({
                    error: 'Rate Limit Exceeded',
                    message: 'Too many requests. Please try again later.',
                    rateLimitType: operationType,
                    retryAfter: Math.ceil(tier.blockDuration / 1000),
                }, common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
            return true;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error(`Rate limit check failed for ${clientKey}:`, error);
            return true;
        }
    }
    async checkRateLimit(clientKey, tier, request, operationType) {
        const now = Date.now();
        const entry = this.rateLimitStore.get(clientKey) || {
            count: 0,
            resetTime: now + tier.windowMs,
            blocked: false,
            violations: 0,
        };
        if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
            this.logger.warn(`Blocked client ${clientKey} attempted ${operationType} operation. Block expires: ${new Date(entry.blockUntil).toISOString()}`);
            return false;
        }
        if (now > entry.resetTime) {
            entry.count = 0;
            entry.resetTime = now + tier.windowMs;
            entry.blocked = false;
            delete entry.blockUntil;
        }
        entry.count++;
        if (entry.count > tier.limit) {
            entry.violations++;
            const blockMultiplier = Math.min(entry.violations, 5);
            const blockDuration = tier.blockDuration * blockMultiplier;
            entry.blocked = true;
            entry.blockUntil = now + blockDuration;
            this.rateLimitStore.set(clientKey, entry);
            if (entry.violations >= tier.escalationThreshold) {
                this.logSecurityEscalation(request, operationType, entry.violations);
            }
            return false;
        }
        this.rateLimitStore.set(clientKey, entry);
        this.recordRateLimitMetrics(operationType, entry.count, tier.limit);
        return true;
    }
    generateClientKey(request) {
        if (request.user?.id) {
            return `user:${request.user.id}`;
        }
        const clientIP = this.getClientIP(request);
        return `ip:${clientIP}`;
    }
    determineOperationType(request) {
        const method = request.method.toUpperCase();
        const path = request.originalUrl || request.url;
        if (path.includes('/public')) {
            return 'PUBLIC';
        }
        if (path.includes('/export')) {
            return 'PHI_EXPORT';
        }
        if (path.includes('/search')) {
            return 'PHI_SEARCH';
        }
        if (path.includes('/summary') ||
            path.includes('/complete-profile') ||
            path.includes('/comprehensive')) {
            return 'SENSITIVE_PHI';
        }
        const phiEndpoints = [
            '/health-record',
            '/allergies',
            '/vaccinations',
            '/conditions',
            '/vitals',
        ];
        const isPHIEndpoint = phiEndpoints.some((endpoint) => path.includes(endpoint));
        if (isPHIEndpoint) {
            if (method === 'GET') {
                return 'PHI_READ';
            }
            else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
                return 'PHI_WRITE';
            }
        }
        return 'INTERNAL';
    }
    getClientIP(request) {
        return (request.headers['x-forwarded-for'] ||
            request.headers['x-real-ip'] ||
            request.socket?.remoteAddress ||
            'unknown');
    }
    logRateLimitViolation(request, operationType, tier) {
        const clientKey = this.generateClientKey(request);
        const entry = this.rateLimitStore.get(clientKey);
        this.logger.warn(`Rate limit exceeded: ${clientKey} | Operation: ${operationType} | ` +
            `Count: ${entry?.count}/${tier.limit} | Violations: ${entry?.violations || 0} | ` +
            `Path: ${request.originalUrl || request.url}`);
    }
    logSecurityEscalation(request, operationType, violations) {
        const clientKey = this.generateClientKey(request);
        this.logger.error(`SECURITY ESCALATION: Repeated rate limit violations detected | ` +
            `Client: ${clientKey} | Operation: ${operationType} | ` +
            `Violations: ${violations} | Path: ${request.originalUrl || request.url}`);
        this.phiAccessLogger.logSecurityIncident({
            correlationId: request.correlationId || 'unknown',
            timestamp: new Date(),
            incidentType: 'RATE_LIMIT_VIOLATION_ESCALATION',
            userId: request.user?.id,
            ipAddress: this.getClientIP(request),
            operation: operationType,
            errorMessage: `Repeated rate limit violations: ${violations}`,
            severity: violations >= 5 ? 'CRITICAL' : 'HIGH',
        });
    }
    recordSecurityIncident(request, operationType) {
        this.metricsService.recordSecurityMetric('suspicious_pattern', 1, {
            incident_type: 'rate_limit_violation',
            operation_type: operationType,
            client_type: request.user?.id ? 'authenticated' : 'anonymous',
        });
    }
    recordRateLimitMetrics(operationType, currentCount, limit) {
        const usagePercentage = (currentCount / limit) * 100;
        this.metricsService.recordCacheMetrics('SET', 'SEARCH', 0);
        if (usagePercentage > 80) {
            this.logger.warn(`Rate limit approaching: ${operationType} at ${usagePercentage.toFixed(1)}% (${currentCount}/${limit})`);
        }
    }
    getRateLimitStatus(clientKey) {
        const entry = this.rateLimitStore.get(clientKey);
        if (!entry)
            return null;
        const tier = this.rateLimitTiers.PHI_READ;
        return {
            current: entry.count,
            limit: tier.limit,
            resetTime: entry.resetTime,
            blocked: entry.blocked,
            blockUntil: entry.blockUntil,
        };
    }
    clearRateLimit(clientKey) {
        return this.rateLimitStore.delete(clientKey);
    }
    getRateLimitStatistics() {
        let blockedClients = 0;
        const violators = [];
        for (const [clientKey, entry] of this.rateLimitStore.entries()) {
            if (entry.blocked)
                blockedClients++;
            if (entry.violations > 0) {
                violators.push({
                    clientKey,
                    violations: entry.violations,
                    blocked: entry.blocked,
                });
            }
        }
        violators.sort((a, b) => b.violations - a.violations);
        return {
            totalClients: this.rateLimitStore.size,
            blockedClients,
            topViolators: violators.slice(0, 10),
        };
    }
    startCleanupInterval() {
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredEntries();
        }, 5 * 60 * 1000);
        this.logger.debug('Rate limit cleanup interval started');
    }
    cleanupExpiredEntries() {
        const now = Date.now();
        let cleanedCount = 0;
        for (const [clientKey, entry] of this.rateLimitStore.entries()) {
            if (now > entry.resetTime && !entry.blocked) {
                this.rateLimitStore.delete(clientKey);
                cleanedCount++;
            }
            else if (entry.blocked && entry.blockUntil && now > entry.blockUntil) {
                entry.blocked = false;
                entry.count = 0;
                entry.resetTime = now + this.rateLimitTiers.PHI_READ.windowMs;
                delete entry.blockUntil;
                this.rateLimitStore.set(clientKey, entry);
            }
        }
        if (cleanedCount > 0) {
            this.logger.debug(`Cleaned up ${cleanedCount} expired rate limit entries`);
        }
    }
    onModuleDestroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.rateLimitStore.clear();
        this.logger.log('Health Record Rate Limit Guard destroyed');
    }
};
exports.HealthRecordRateLimitGuard = HealthRecordRateLimitGuard;
exports.HealthRecordRateLimitGuard = HealthRecordRateLimitGuard = HealthRecordRateLimitGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        health_record_metrics_service_1.HealthRecordMetricsService,
        phi_access_logger_service_1.PHIAccessLogger])
], HealthRecordRateLimitGuard);
//# sourceMappingURL=health-record-rate-limit.guard.js.map