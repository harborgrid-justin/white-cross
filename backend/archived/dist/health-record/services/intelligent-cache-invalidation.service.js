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
exports.IntelligentCacheInvalidationService = exports.DependencyType = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const event_emitter_1 = require("@nestjs/event-emitter");
const health_record_metrics_service_1 = require("./health-record-metrics.service");
const phi_access_logger_service_1 = require("./phi-access-logger.service");
const cache_strategy_service_1 = require("./cache-strategy.service");
const models_1 = require("../../database/models");
const database_enums_1 = require("../../database/types/database.enums");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
var DependencyType;
(function (DependencyType) {
    DependencyType["DIRECT"] = "DIRECT";
    DependencyType["AGGREGATE"] = "AGGREGATE";
    DependencyType["RELATED"] = "RELATED";
    DependencyType["DERIVED"] = "DERIVED";
    DependencyType["CROSS_ENTITY"] = "CROSS_ENTITY";
})(DependencyType || (exports.DependencyType = DependencyType = {}));
let IntelligentCacheInvalidationService = class IntelligentCacheInvalidationService extends base_1.BaseService {
    metricsService;
    phiLogger;
    cacheService;
    eventEmitter;
    auditLogModel;
    dependencyGraph = new Map();
    reverseIndex = new Map();
    invalidationRules = new Map();
    pendingInvalidations = new Map();
    tagIndex = new Map();
    keyTags = new Map();
    batchInvalidations = new Map();
    batchTimeout = null;
    batchDelayMs = 100;
    invalidationMetrics = {
        totalInvalidations: 0,
        eventDrivenInvalidations: 0,
        manualInvalidations: 0,
        dependencyInvalidations: 0,
        averageInvalidationTime: 0,
        invalidationsByType: {},
        invalidationsByCompliance: {
            PUBLIC: 0,
            INTERNAL: 0,
            PHI: 0,
            SENSITIVE_PHI: 0,
        },
    };
    constructor(logger, metricsService, phiLogger, cacheService, eventEmitter, auditLogModel) {
        super({
            serviceName: 'IntelligentCacheInvalidationService',
            logger,
            enableAuditLogging: true,
        });
        this.metricsService = metricsService;
        this.phiLogger = phiLogger;
        this.cacheService = cacheService;
        this.eventEmitter = eventEmitter;
        this.auditLogModel = auditLogModel;
        this.initializeService();
        this.setupDefaultRules();
    }
    initializeService() {
        this.logInfo('Initializing Intelligent Cache Invalidation Service with database persistence');
        this.setupEventListeners();
        this.logInfo('Intelligent Cache Invalidation Service initialized successfully');
    }
    async registerDependency(sourceKey, dependentKeys, relationshipType, strength = 1.0, complianceLevel = 'INTERNAL') {
        const dependencyId = this.generateDependencyId(sourceKey, dependentKeys);
        const dependency = {
            id: dependencyId,
            sourceKey,
            dependentKeys,
            relationshipType,
            strength,
            lastUpdated: new Date(),
            complianceLevel,
        };
        this.dependencyGraph.set(dependencyId, dependency);
        dependentKeys.forEach((depKey) => {
            if (!this.reverseIndex.has(depKey)) {
                this.reverseIndex.set(depKey, new Set());
            }
            this.reverseIndex.get(depKey).add(sourceKey);
        });
        await this.logInvalidationEvent({
            eventId: dependencyId,
            eventType: 'DEPENDENCY_REGISTERED',
            sourceEntity: 'CACHE_DEPENDENCY',
            entityId: dependencyId,
            timestamp: new Date(),
            metadata: {
                sourceKey,
                dependentKeys,
                relationshipType,
                strength,
                complianceLevel,
            },
        });
        this.logDebug(`Registered cache dependency: ${sourceKey} -> [${dependentKeys.join(', ')}]`);
        return dependencyId;
    }
    async invalidateKey(cacheKey, reason = 'manual', complianceLevel = 'INTERNAL') {
        const startTime = Date.now();
        try {
            await this.cacheService.invalidate(cacheKey);
            this.invalidationMetrics.totalInvalidations++;
            this.invalidationMetrics.manualInvalidations++;
            if (!this.invalidationMetrics.invalidationsByCompliance[complianceLevel]) {
                this.invalidationMetrics.invalidationsByCompliance[complianceLevel] = 0;
            }
            this.invalidationMetrics.invalidationsByCompliance[complianceLevel]++;
            await this.logInvalidationEvent({
                eventId: this.generateEventId(),
                eventType: 'CACHE_INVALIDATION',
                sourceEntity: 'CACHE_KEY',
                entityId: cacheKey,
                timestamp: new Date(),
                metadata: {
                    reason,
                    complianceLevel,
                    invalidationType: 'single',
                },
            });
            if (complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI') {
                this.phiLogger.logPHIAccess({
                    correlationId: this.generateEventId(),
                    timestamp: new Date(),
                    operation: 'CACHE_INVALIDATE',
                    dataTypes: ['cache'],
                    recordCount: 1,
                    sensitivityLevel: complianceLevel,
                    ipAddress: 'internal',
                    userAgent: 'cache-invalidation-service',
                    success: true,
                });
            }
            const invalidationTime = Date.now() - startTime;
            this.updateAverageInvalidationTime(invalidationTime);
            this.logDebug(`Invalidated cache key: ${cacheKey}, reason: ${reason}, time: ${invalidationTime}ms`);
        }
        catch (error) {
            this.logError(`Failed to invalidate cache key ${cacheKey}:`, error);
        }
    }
    async invalidateByTags(tags, reason = 'tag_based', complianceLevel = 'INTERNAL') {
        const startTime = Date.now();
        const keysToInvalidate = new Set();
        tags.forEach((tag) => {
            const taggedKeys = this.tagIndex.get(tag);
            if (taggedKeys) {
                taggedKeys.forEach((key) => keysToInvalidate.add(key));
            }
        });
        if (keysToInvalidate.size === 0) {
            return;
        }
        try {
            const invalidationPromises = Array.from(keysToInvalidate).map((key) => this.cacheService.invalidate(key));
            await Promise.all(invalidationPromises);
            this.invalidationMetrics.totalInvalidations += keysToInvalidate.size;
            this.invalidationMetrics.manualInvalidations += keysToInvalidate.size;
            if (!this.invalidationMetrics.invalidationsByCompliance[complianceLevel]) {
                this.invalidationMetrics.invalidationsByCompliance[complianceLevel] = 0;
            }
            this.invalidationMetrics.invalidationsByCompliance[complianceLevel] +=
                keysToInvalidate.size;
            await this.logInvalidationEvent({
                eventId: this.generateEventId(),
                eventType: 'BULK_CACHE_INVALIDATION',
                sourceEntity: 'CACHE_TAGS',
                entityId: tags.join(','),
                timestamp: new Date(),
                metadata: {
                    tags,
                    reason,
                    complianceLevel,
                    keysInvalidated: keysToInvalidate.size,
                    invalidationType: 'bulk',
                },
            });
            if (complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI') {
                this.phiLogger.logPHIAccess({
                    correlationId: this.generateEventId(),
                    timestamp: new Date(),
                    operation: 'BULK_CACHE_INVALIDATE',
                    dataTypes: ['cache'],
                    recordCount: keysToInvalidate.size,
                    sensitivityLevel: complianceLevel,
                    ipAddress: 'internal',
                    userAgent: 'cache-invalidation-service',
                    success: true,
                });
            }
            const invalidationTime = Date.now() - startTime;
            this.updateAverageInvalidationTime(invalidationTime / keysToInvalidate.size);
            this.logDebug(`Invalidated ${keysToInvalidate.size} cache keys by tags [${tags.join(', ')}], time: ${invalidationTime}ms`);
        }
        catch (error) {
            this.logError(`Failed to invalidate cache by tags [${tags.join(', ')}]:`, error);
        }
    }
    async handleDataChangeEvent(event) {
        try {
            this.invalidationMetrics.eventDrivenInvalidations++;
            await this.logInvalidationEvent(event);
            const applicableRules = this.findApplicableRules(event);
            for (const rule of applicableRules) {
                if (rule.condition && !rule.condition(event)) {
                    continue;
                }
                if (rule.delay && rule.delay > 0) {
                    this.scheduleDelayedInvalidation(rule, event);
                }
                else {
                    await this.applyInvalidationRule(rule, event);
                }
            }
            await this.handleDependencyInvalidation(event);
        }
        catch (error) {
            this.logError(`Failed to handle data change event:`, error);
        }
    }
    getInvalidationMetrics() {
        return { ...this.invalidationMetrics };
    }
    async getRecentInvalidationEvents(limit = 100) {
        try {
            const auditLogs = await this.auditLogModel.findAll({
                where: {
                    entityType: 'CACHE_INVALIDATION',
                },
                order: [['createdAt', 'DESC']],
                limit,
            });
            return auditLogs.map((log) => ({
                eventId: log.id || '',
                eventType: log.action === database_enums_1.AuditAction.CACHE_DELETE
                    ? 'CACHE_INVALIDATION'
                    : 'UNKNOWN',
                sourceEntity: log.entityType,
                entityId: log.entityId || '',
                timestamp: log.createdAt || new Date(),
                metadata: log.metadata || {},
            }));
        }
        catch (error) {
            this.logError('Failed to retrieve recent invalidation events:', error);
            return [];
        }
    }
    async logInvalidationEvent(event) {
        try {
            const auditEntry = {
                action: this.mapEventTypeToAuditAction(event.eventType),
                entityType: 'CACHE_INVALIDATION',
                entityId: event.entityId,
                userId: null,
                userName: null,
                changes: event.metadata,
                ipAddress: 'internal',
                userAgent: 'cache-invalidation-service',
                isPHI: event.metadata?.complianceLevel === 'PHI' ||
                    event.metadata?.complianceLevel === 'SENSITIVE_PHI',
                complianceType: models_1.ComplianceType.HIPAA,
                severity: models_1.AuditSeverity.LOW,
                success: true,
                tags: ['cache-invalidation', event.eventType.toLowerCase()],
                metadata: event.metadata,
            };
            await this.auditLogModel.create(auditEntry);
        }
        catch (error) {
            this.logError(`Failed to log invalidation event ${event.eventId}:`, error);
        }
    }
    mapEventTypeToAuditAction(eventType) {
        const actionMap = {
            CACHE_INVALIDATION: database_enums_1.AuditAction.CACHE_DELETE,
            BULK_CACHE_INVALIDATION: database_enums_1.AuditAction.CACHE_DELETE,
            DEPENDENCY_REGISTERED: database_enums_1.AuditAction.UPDATE,
            DATA_CHANGED: database_enums_1.AuditAction.UPDATE,
        };
        return actionMap[eventType] || database_enums_1.AuditAction.UPDATE;
    }
    findApplicableRules(event) {
        const applicableRules = [];
        for (const rule of Array.from(this.invalidationRules.values())) {
            if (!rule.enabled)
                continue;
            if (this.matchesPattern(event.eventType, rule.eventPattern)) {
                applicableRules.push(rule);
            }
        }
        return applicableRules;
    }
    async applyInvalidationRule(rule, event) {
        const keysToInvalidate = [];
        for (const pattern of rule.targetPatterns) {
            const matchingKeys = this.findKeysMatchingPattern(pattern);
            keysToInvalidate.push(...matchingKeys);
        }
        if (keysToInvalidate.length > 0) {
            await this.invalidateByTags(keysToInvalidate, `rule_${rule.name}`, event.metadata?.complianceLevel || 'INTERNAL');
        }
    }
    async handleDependencyInvalidation(event) {
        const sourceKey = this.generateCacheKey(event.sourceEntity, event.entityId);
        const dependentKeys = this.findDependentKeys(sourceKey);
        if (dependentKeys.length > 0) {
            this.invalidationMetrics.dependencyInvalidations += dependentKeys.length;
            for (const depKey of dependentKeys) {
                await this.invalidateKey(depKey, 'dependency_cascade', event.metadata?.complianceLevel || 'INTERNAL');
            }
        }
    }
    findDependentKeys(sourceKey) {
        const dependentKeys = [];
        for (const [depKey, sources] of this.reverseIndex.entries()) {
            if (sources.has(sourceKey)) {
                dependentKeys.push(depKey);
            }
        }
        return dependentKeys;
    }
    scheduleDelayedInvalidation(rule, event) {
        const timeoutKey = `${rule.id}_${event.eventId}`;
        if (this.pendingInvalidations.has(timeoutKey)) {
            clearTimeout(this.pendingInvalidations.get(timeoutKey));
        }
        const timeout = setTimeout(async () => {
            await this.applyInvalidationRule(rule, event);
            this.pendingInvalidations.delete(timeoutKey);
        }, rule.delay);
        this.pendingInvalidations.set(timeoutKey, timeout);
    }
    findKeysMatchingPattern(pattern) {
        const matchingKeys = [];
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        for (const key of this.keyTags.keys()) {
            if (regex.test(key)) {
                matchingKeys.push(key);
            }
        }
        return matchingKeys;
    }
    matchesPattern(str, pattern) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(str);
    }
    generateCacheKey(entityType, entityId) {
        return `${entityType}:${entityId}`;
    }
    generateDependencyId(sourceKey, dependentKeys) {
        return `dep_${sourceKey}_${dependentKeys.join('_')}_${Date.now()}`;
    }
    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    updateAverageInvalidationTime(newTime) {
        const currentAvg = this.invalidationMetrics.averageInvalidationTime;
        const totalInvalidations = this.invalidationMetrics.totalInvalidations;
        this.invalidationMetrics.averageInvalidationTime =
            (currentAvg * (totalInvalidations - 1) + newTime) / totalInvalidations;
    }
    setupEventListeners() {
        this.eventEmitter.on('health-record.*.changed', (event) => {
            this.handleDataChangeEvent(event);
        });
    }
    setupDefaultRules() {
        this.invalidationRules.set('student_data_changed', {
            id: 'student_data_changed',
            name: 'Student Data Changed',
            eventPattern: 'health-record.student.changed',
            targetPatterns: ['student:*', 'health-record:student:*'],
            priority: 'HIGH',
            enabled: true,
            complianceRequired: true,
        });
        this.invalidationRules.set('allergy_changed', {
            id: 'allergy_changed',
            name: 'Allergy Data Changed',
            eventPattern: 'health-record.allergy.changed',
            targetPatterns: ['allergy:*', 'health-record:allergy:*'],
            priority: 'HIGH',
            enabled: true,
            complianceRequired: true,
        });
        this.invalidationRules.set('chronic_condition_changed', {
            id: 'chronic_condition_changed',
            name: 'Chronic Condition Changed',
            eventPattern: 'health-record.chronic-condition.changed',
            targetPatterns: [
                'chronic-condition:*',
                'health-record:chronic-condition:*',
            ],
            priority: 'MEDIUM',
            enabled: true,
            complianceRequired: true,
        });
    }
    onModuleDestroy() {
        for (const timeout of Array.from(this.pendingInvalidations.values())) {
            clearTimeout(timeout);
        }
        if (this.batchTimeout) {
            clearTimeout(this.batchTimeout);
        }
        this.logInfo('Intelligent Cache Invalidation Service destroyed');
    }
};
exports.IntelligentCacheInvalidationService = IntelligentCacheInvalidationService;
__decorate([
    (0, event_emitter_1.OnEvent)('health-record.*.changed', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntelligentCacheInvalidationService.prototype, "handleDataChangeEvent", null);
exports.IntelligentCacheInvalidationService = IntelligentCacheInvalidationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(5, (0, sequelize_1.InjectModel)(models_1.AuditLog)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        health_record_metrics_service_1.HealthRecordMetricsService,
        phi_access_logger_service_1.PHIAccessLogger,
        cache_strategy_service_1.CacheStrategyService,
        event_emitter_1.EventEmitter2, Object])
], IntelligentCacheInvalidationService);
//# sourceMappingURL=intelligent-cache-invalidation.service.js.map