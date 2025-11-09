"use strict";
/**
 * LOC: LOG_MONITOR_KIT_001
 * File: /reuse/logging-monitoring-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize-typescript
 *   - express
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - Logger services
 *   - Monitoring middleware
 *   - APM integrations
 *   - Health check endpoints
 *   - Observability dashboards
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditMiddleware = exports.logDataAccess = exports.createAuditLog = exports.createStartupProbe = exports.createReadinessProbe = exports.createLivenessProbe = exports.checkMemoryHealth = exports.checkDatabaseHealth = exports.propagateTraceHeaders = exports.finishTrace = exports.createTraceContext = exports.generateSpanId = exports.generateTraceId = exports.recordPrometheusHistogram = exports.setPrometheusGauge = exports.incrementPrometheusCounter = exports.createPrometheusRegistry = exports.formatPrometheusMetric = exports.createPerformanceTimer = exports.collectSystemMetrics = exports.measureExecutionTime = exports.createResponseLog = exports.createRequestLog = exports.RequestLoggingInterceptor = exports.createMultiTransport = exports.createHttpTransport = exports.createFileTransport = exports.createConsoleTransport = exports.createAdaptiveSampler = exports.shouldSampleLog = exports.redactLogEntry = exports.createPHIRedactionConfig = exports.redactPII = exports.propagateCorrelationId = exports.extractCorrelationId = exports.generateCorrelationId = exports.setDynamicLogLevel = exports.parseLogLevel = exports.shouldLog = exports.createErrorLog = exports.enrichLogWithContext = exports.formatLogAsText = exports.formatLogAsJSON = exports.createStructuredLog = exports.AuditLog = exports.ApplicationLog = exports.HealthStatus = exports.LOG_LEVEL_PRIORITY = exports.LogLevel = void 0;
/**
 * File: /reuse/logging-monitoring-kit.ts
 * Locator: WC-LOG-MONITOR-KIT-001
 * Purpose: Comprehensive Logging & Monitoring Kit - Enterprise observability toolkit
 *
 * Upstream: NestJS, Sequelize, Express, RxJS
 * Downstream: ../backend/monitoring/*, Observability, APM, Health checks
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45 logging/monitoring functions for structured logging, metrics, tracing, health
 *
 * LLM Context: Enterprise-grade logging and monitoring utilities for White Cross platform.
 * Provides structured logging with PII/PHI redaction, distributed tracing, performance metrics
 * collection, Prometheus format support, APM integration, error tracking, custom metrics,
 * histogram tracking, log aggregation, contextual logging, audit trails, database query logging,
 * comprehensive health checks, log sampling, custom transports, and correlation IDs.
 * HIPAA-compliant audit logging and observability patterns for healthcare applications.
 */
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const sequelize_typescript_1 = require("sequelize-typescript");
const os = __importStar(require("os"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Log levels enumeration
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["TRACE"] = "trace";
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
    LogLevel["FATAL"] = "fatal";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Log level priority mapping
 */
exports.LOG_LEVEL_PRIORITY = {
    [LogLevel.TRACE]: 0,
    [LogLevel.DEBUG]: 1,
    [LogLevel.INFO]: 2,
    [LogLevel.WARN]: 3,
    [LogLevel.ERROR]: 4,
    [LogLevel.FATAL]: 5,
};
/**
 * Health check status
 */
var HealthStatus;
(function (HealthStatus) {
    HealthStatus["HEALTHY"] = "healthy";
    HealthStatus["DEGRADED"] = "degraded";
    HealthStatus["UNHEALTHY"] = "unhealthy";
})(HealthStatus || (exports.HealthStatus = HealthStatus = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Application log model for persistence
 */
let ApplicationLog = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'application_logs',
            timestamps: true,
            indexes: [
                { fields: ['level'] },
                { fields: ['timestamp'] },
                { fields: ['traceId'] },
                { fields: ['correlationId'] },
                { fields: ['userId'] },
                { fields: ['tenantId'] },
                { fields: ['context'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _level_decorators;
    let _level_initializers = [];
    let _level_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _context_decorators;
    let _context_initializers = [];
    let _context_extraInitializers = [];
    let _traceId_decorators;
    let _traceId_initializers = [];
    let _traceId_extraInitializers = [];
    let _spanId_decorators;
    let _spanId_initializers = [];
    let _spanId_extraInitializers = [];
    let _correlationId_decorators;
    let _correlationId_initializers = [];
    let _correlationId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _requestId_decorators;
    let _requestId_initializers = [];
    let _requestId_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _error_decorators;
    let _error_initializers = [];
    let _error_extraInitializers = [];
    let _performance_decorators;
    let _performance_initializers = [];
    let _performance_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ApplicationLog = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.timestamp = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.level = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _level_initializers, void 0));
            this.message = (__runInitializers(this, _level_extraInitializers), __runInitializers(this, _message_initializers, void 0));
            this.context = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _context_initializers, void 0));
            this.traceId = (__runInitializers(this, _context_extraInitializers), __runInitializers(this, _traceId_initializers, void 0));
            this.spanId = (__runInitializers(this, _traceId_extraInitializers), __runInitializers(this, _spanId_initializers, void 0));
            this.correlationId = (__runInitializers(this, _spanId_extraInitializers), __runInitializers(this, _correlationId_initializers, void 0));
            this.userId = (__runInitializers(this, _correlationId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.tenantId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.requestId = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _requestId_initializers, void 0));
            this.metadata = (__runInitializers(this, _requestId_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.error = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _error_initializers, void 0));
            this.performance = (__runInitializers(this, _error_extraInitializers), __runInitializers(this, _performance_initializers, void 0));
            this.createdAt = (__runInitializers(this, _performance_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ApplicationLog");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _timestamp_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _level_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(LogLevel)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _message_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _context_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
            }), sequelize_typescript_1.Index];
        _traceId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(64),
            }), sequelize_typescript_1.Index];
        _spanId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(64),
            })];
        _correlationId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(64),
            }), sequelize_typescript_1.Index];
        _userId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
            }), sequelize_typescript_1.Index];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
            }), sequelize_typescript_1.Index];
        _requestId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(64),
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
            })];
        _error_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
            })];
        _performance_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _level_decorators, { kind: "field", name: "level", static: false, private: false, access: { has: obj => "level" in obj, get: obj => obj.level, set: (obj, value) => { obj.level = value; } }, metadata: _metadata }, _level_initializers, _level_extraInitializers);
        __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
        __esDecorate(null, null, _context_decorators, { kind: "field", name: "context", static: false, private: false, access: { has: obj => "context" in obj, get: obj => obj.context, set: (obj, value) => { obj.context = value; } }, metadata: _metadata }, _context_initializers, _context_extraInitializers);
        __esDecorate(null, null, _traceId_decorators, { kind: "field", name: "traceId", static: false, private: false, access: { has: obj => "traceId" in obj, get: obj => obj.traceId, set: (obj, value) => { obj.traceId = value; } }, metadata: _metadata }, _traceId_initializers, _traceId_extraInitializers);
        __esDecorate(null, null, _spanId_decorators, { kind: "field", name: "spanId", static: false, private: false, access: { has: obj => "spanId" in obj, get: obj => obj.spanId, set: (obj, value) => { obj.spanId = value; } }, metadata: _metadata }, _spanId_initializers, _spanId_extraInitializers);
        __esDecorate(null, null, _correlationId_decorators, { kind: "field", name: "correlationId", static: false, private: false, access: { has: obj => "correlationId" in obj, get: obj => obj.correlationId, set: (obj, value) => { obj.correlationId = value; } }, metadata: _metadata }, _correlationId_initializers, _correlationId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _requestId_decorators, { kind: "field", name: "requestId", static: false, private: false, access: { has: obj => "requestId" in obj, get: obj => obj.requestId, set: (obj, value) => { obj.requestId = value; } }, metadata: _metadata }, _requestId_initializers, _requestId_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _error_decorators, { kind: "field", name: "error", static: false, private: false, access: { has: obj => "error" in obj, get: obj => obj.error, set: (obj, value) => { obj.error = value; } }, metadata: _metadata }, _error_initializers, _error_extraInitializers);
        __esDecorate(null, null, _performance_decorators, { kind: "field", name: "performance", static: false, private: false, access: { has: obj => "performance" in obj, get: obj => obj.performance, set: (obj, value) => { obj.performance = value; } }, metadata: _metadata }, _performance_initializers, _performance_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApplicationLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApplicationLog = _classThis;
})();
exports.ApplicationLog = ApplicationLog;
/**
 * Audit logs model for compliance
 */
let AuditLog = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'audit_logs',
            timestamps: true,
            indexes: [
                { fields: ['userId'] },
                { fields: ['tenantId'] },
                { fields: ['action'] },
                { fields: ['resource'] },
                { fields: ['timestamp'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _resource_decorators;
    let _resource_initializers = [];
    let _resource_extraInitializers = [];
    let _resourceId_decorators;
    let _resourceId_initializers = [];
    let _resourceId_extraInitializers = [];
    let _changes_decorators;
    let _changes_initializers = [];
    let _changes_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _userAgent_decorators;
    let _userAgent_initializers = [];
    let _userAgent_extraInitializers = [];
    let _outcome_decorators;
    let _outcome_initializers = [];
    let _outcome_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var AuditLog = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.timestamp = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.userId = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.tenantId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.action = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.resource = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _resource_initializers, void 0));
            this.resourceId = (__runInitializers(this, _resource_extraInitializers), __runInitializers(this, _resourceId_initializers, void 0));
            this.changes = (__runInitializers(this, _resourceId_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
            this.outcome = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _outcome_initializers, void 0));
            this.reason = (__runInitializers(this, _outcome_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.createdAt = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AuditLog");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _timestamp_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _userId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
            }), sequelize_typescript_1.Index];
        _action_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _resource_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _resourceId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
            })];
        _changes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
            })];
        _ipAddress_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(45),
            })];
        _userAgent_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
            })];
        _outcome_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('success', 'failure'),
                allowNull: false,
            })];
        _reason_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _resource_decorators, { kind: "field", name: "resource", static: false, private: false, access: { has: obj => "resource" in obj, get: obj => obj.resource, set: (obj, value) => { obj.resource = value; } }, metadata: _metadata }, _resource_initializers, _resource_extraInitializers);
        __esDecorate(null, null, _resourceId_decorators, { kind: "field", name: "resourceId", static: false, private: false, access: { has: obj => "resourceId" in obj, get: obj => obj.resourceId, set: (obj, value) => { obj.resourceId = value; } }, metadata: _metadata }, _resourceId_initializers, _resourceId_extraInitializers);
        __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: obj => "changes" in obj, get: obj => obj.changes, set: (obj, value) => { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: obj => "userAgent" in obj, get: obj => obj.userAgent, set: (obj, value) => { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
        __esDecorate(null, null, _outcome_decorators, { kind: "field", name: "outcome", static: false, private: false, access: { has: obj => "outcome" in obj, get: obj => obj.outcome, set: (obj, value) => { obj.outcome = value; } }, metadata: _metadata }, _outcome_initializers, _outcome_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditLog = _classThis;
})();
exports.AuditLog = AuditLog;
// ============================================================================
// STRUCTURED LOGGING HELPERS
// ============================================================================
/**
 * @function createStructuredLog
 * @description Creates a structured log entry with consistent formatting
 * @param {LogLevel} level - Log level
 * @param {string} message - Log message
 * @param {Partial<LogEntry>} context - Additional context
 * @returns {LogEntry} Structured log entry
 *
 * @example
 * ```typescript
 * const log = createStructuredLog(LogLevel.INFO, 'User logged in', {
 *   userId: 'user-123',
 *   traceId: 'trace-abc',
 *   metadata: { loginMethod: 'oauth' }
 * });
 * ```
 */
const createStructuredLog = (level, message, context) => {
    return {
        timestamp: new Date(),
        level,
        message,
        ...context,
    };
};
exports.createStructuredLog = createStructuredLog;
/**
 * @function formatLogAsJSON
 * @description Formats log entry as JSON string for external systems
 * @param {LogEntry} entry - Log entry to format
 * @returns {string} JSON formatted log message
 *
 * @example
 * ```typescript
 * const formatted = formatLogAsJSON(logEntry);
 * console.log(formatted); // {"timestamp":"2025-01-01T00:00:00.000Z",...}
 * ```
 */
const formatLogAsJSON = (entry) => {
    return JSON.stringify({
        ...entry,
        timestamp: entry.timestamp.toISOString(),
    });
};
exports.formatLogAsJSON = formatLogAsJSON;
/**
 * @function formatLogAsText
 * @description Formats log entry as human-readable text
 * @param {LogEntry} entry - Log entry to format
 * @returns {string} Text formatted log message
 *
 * @example
 * ```typescript
 * const formatted = formatLogAsText(logEntry);
 * // [2025-01-01 00:00:00] INFO [UserService] User logged in
 * ```
 */
const formatLogAsText = (entry) => {
    const timestamp = entry.timestamp.toISOString();
    const context = entry.context ? `[${entry.context}]` : '';
    const traceId = entry.traceId ? `trace=${entry.traceId}` : '';
    return `[${timestamp}] ${entry.level.toUpperCase()} ${context} ${entry.message} ${traceId}`.trim();
};
exports.formatLogAsText = formatLogAsText;
/**
 * @function enrichLogWithContext
 * @description Enriches log entry with additional contextual information
 * @param {LogEntry} entry - Base log entry
 * @param {Request} req - Express request object
 * @returns {LogEntry} Enriched log entry
 *
 * @example
 * ```typescript
 * const enrichedLog = enrichLogWithContext(baseLog, request);
 * ```
 */
const enrichLogWithContext = (entry, req) => {
    return {
        ...entry,
        requestId: req.headers['x-request-id'],
        correlationId: req.headers['x-correlation-id'],
        userId: req.user?.id,
        tenantId: req.tenant?.id,
        metadata: {
            ...entry.metadata,
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
        },
    };
};
exports.enrichLogWithContext = enrichLogWithContext;
/**
 * @function createErrorLog
 * @description Creates structured log entry for errors with stack traces
 * @param {Error} error - Error object
 * @param {string} context - Error context
 * @param {Partial<LogEntry>} additional - Additional log data
 * @returns {LogEntry} Error log entry
 *
 * @security Sanitizes stack traces for production
 *
 * @example
 * ```typescript
 * try {
 *   // ... operation
 * } catch (error) {
 *   const errorLog = createErrorLog(error, 'UserService.createUser');
 *   logger.error(errorLog);
 * }
 * ```
 */
const createErrorLog = (error, context, additional) => {
    return (0, exports.createStructuredLog)(LogLevel.ERROR, error.message, {
        context,
        error: {
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
            code: error.code,
            statusCode: error.statusCode,
            details: error.details,
        },
        ...additional,
    });
};
exports.createErrorLog = createErrorLog;
// ============================================================================
// LOG LEVEL MANAGEMENT
// ============================================================================
/**
 * @function shouldLog
 * @description Determines if a message should be logged based on configured level
 * @param {LogLevel} messageLevel - Level of the message
 * @param {LogLevel} configuredLevel - Configured minimum log level
 * @returns {boolean} True if message should be logged
 *
 * @example
 * ```typescript
 * if (shouldLog(LogLevel.DEBUG, LogLevel.INFO)) {
 *   // This returns false, DEBUG is lower priority than INFO
 * }
 * ```
 */
const shouldLog = (messageLevel, configuredLevel) => {
    return (exports.LOG_LEVEL_PRIORITY[messageLevel] >= exports.LOG_LEVEL_PRIORITY[configuredLevel]);
};
exports.shouldLog = shouldLog;
/**
 * @function parseLogLevel
 * @description Parses string log level to enum value
 * @param {string} level - Log level string
 * @returns {LogLevel} Parsed log level or INFO as default
 *
 * @example
 * ```typescript
 * const level = parseLogLevel(process.env.LOG_LEVEL || 'info');
 * ```
 */
const parseLogLevel = (level) => {
    const normalized = level.toLowerCase();
    return Object.values(LogLevel).includes(normalized)
        ? normalized
        : LogLevel.INFO;
};
exports.parseLogLevel = parseLogLevel;
/**
 * @function setDynamicLogLevel
 * @description Creates a function to dynamically adjust log level
 * @param {LogLevel} initialLevel - Initial log level
 * @returns {object} Log level getter and setter
 *
 * @example
 * ```typescript
 * const { getLevel, setLevel } = setDynamicLogLevel(LogLevel.INFO);
 * setLevel(LogLevel.DEBUG); // Enable debug logging
 * ```
 */
const setDynamicLogLevel = (initialLevel) => {
    let currentLevel = initialLevel;
    return {
        getLevel: () => currentLevel,
        setLevel: (newLevel) => {
            currentLevel = newLevel;
        },
        shouldLog: (messageLevel) => (0, exports.shouldLog)(messageLevel, currentLevel),
    };
};
exports.setDynamicLogLevel = setDynamicLogLevel;
// ============================================================================
// CORRELATION ID MANAGEMENT
// ============================================================================
/**
 * @function generateCorrelationId
 * @description Generates a unique correlation ID for request tracking
 * @returns {string} Correlation ID
 *
 * @example
 * ```typescript
 * const correlationId = generateCorrelationId();
 * // Returns: "corr-1234567890abcdef"
 * ```
 */
const generateCorrelationId = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `corr-${timestamp}-${randomPart}`;
};
exports.generateCorrelationId = generateCorrelationId;
/**
 * @function extractCorrelationId
 * @description Extracts correlation ID from request headers
 * @param {Request} req - Express request object
 * @returns {string} Correlation ID or newly generated one
 *
 * @example
 * ```typescript
 * const correlationId = extractCorrelationId(req);
 * ```
 */
const extractCorrelationId = (req) => {
    return (req.headers['x-correlation-id'] ||
        req.headers['x-request-id'] ||
        (0, exports.generateCorrelationId)());
};
exports.extractCorrelationId = extractCorrelationId;
/**
 * @function propagateCorrelationId
 * @description Creates headers for correlation ID propagation
 * @param {string} correlationId - Correlation ID
 * @returns {Record<string, string>} HTTP headers
 *
 * @example
 * ```typescript
 * const headers = propagateCorrelationId(correlationId);
 * // Use in HTTP client: axios.get(url, { headers });
 * ```
 */
const propagateCorrelationId = (correlationId) => {
    return {
        'x-correlation-id': correlationId,
        'x-request-id': correlationId,
    };
};
exports.propagateCorrelationId = propagateCorrelationId;
// ============================================================================
// PII/PHI REDACTION
// ============================================================================
/**
 * @function redactPII
 * @description Redacts PII/PHI from log data for HIPAA compliance
 * @param {any} data - Data to redact
 * @param {RedactionConfig} config - Redaction configuration
 * @returns {any} Redacted data
 *
 * @security HIPAA-compliant PII/PHI redaction
 *
 * @example
 * ```typescript
 * const redacted = redactPII(userData, {
 *   enabled: true,
 *   fields: ['ssn', 'dateOfBirth', 'email'],
 *   replacement: '[REDACTED]'
 * });
 * ```
 */
const redactPII = (data, config) => {
    if (!config.enabled || !data) {
        return data;
    }
    if (typeof data !== 'object') {
        return data;
    }
    const redacted = Array.isArray(data) ? [...data] : { ...data };
    const replacement = config.replacement || '[REDACTED]';
    const redactObject = (obj) => {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        const result = Array.isArray(obj) ? [...obj] : { ...obj };
        for (const key in result) {
            // Redact specific fields
            if (config.fields.includes(key.toLowerCase())) {
                result[key] = replacement;
                continue;
            }
            // Apply pattern matching
            if (config.patterns && typeof result[key] === 'string') {
                for (const pattern of config.patterns) {
                    result[key] = result[key].replace(pattern, replacement);
                }
            }
            // Recursively redact nested objects
            if (typeof result[key] === 'object' && result[key] !== null) {
                result[key] = redactObject(result[key]);
            }
        }
        return result;
    };
    return redactObject(redacted);
};
exports.redactPII = redactPII;
/**
 * @function createPHIRedactionConfig
 * @description Creates standard PHI redaction configuration for healthcare
 * @returns {RedactionConfig} PHI redaction configuration
 *
 * @example
 * ```typescript
 * const config = createPHIRedactionConfig();
 * const safeLog = redactPII(logData, config);
 * ```
 */
const createPHIRedactionConfig = () => {
    return {
        enabled: true,
        fields: [
            'ssn',
            'socialsecuritynumber',
            'dateofbirth',
            'dob',
            'email',
            'phone',
            'phonenumber',
            'address',
            'medicalrecordnumber',
            'mrn',
            'healthplanbeneficiarynumber',
            'accountnumber',
            'certificatenumber',
            'licensenumber',
            'vehicleidentifier',
            'deviceidentifier',
            'biometricidentifier',
            'fullface',
            'ipaddress',
            'password',
            'token',
            'apikey',
        ],
        patterns: [
            /\b\d{3}-\d{2}-\d{4}\b/g, // SSN pattern
            /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone pattern
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email pattern
        ],
        replacement: '[PHI_REDACTED]',
    };
};
exports.createPHIRedactionConfig = createPHIRedactionConfig;
/**
 * @function redactLogEntry
 * @description Redacts sensitive data from log entry
 * @param {LogEntry} entry - Log entry
 * @param {RedactionConfig} config - Redaction configuration
 * @returns {LogEntry} Redacted log entry
 *
 * @example
 * ```typescript
 * const safeLog = redactLogEntry(logEntry, createPHIRedactionConfig());
 * ```
 */
const redactLogEntry = (entry, config) => {
    return {
        ...entry,
        metadata: entry.metadata ? (0, exports.redactPII)(entry.metadata, config) : undefined,
        error: entry.error
            ? {
                ...entry.error,
                details: entry.error.details
                    ? (0, exports.redactPII)(entry.error.details, config)
                    : undefined,
            }
            : undefined,
    };
};
exports.redactLogEntry = redactLogEntry;
// ============================================================================
// LOG SAMPLING
// ============================================================================
/**
 * @function shouldSampleLog
 * @description Determines if a log should be sampled (kept) based on configuration
 * @param {LogEntry} entry - Log entry
 * @param {SamplingConfig} config - Sampling configuration
 * @returns {boolean} True if log should be kept
 *
 * @example
 * ```typescript
 * const config = { enabled: true, rate: 0.1, excludeLevels: [LogLevel.ERROR] };
 * if (shouldSampleLog(logEntry, config)) {
 *   persistLog(logEntry);
 * }
 * ```
 */
const shouldSampleLog = (entry, config) => {
    if (!config.enabled) {
        return true;
    }
    // Never sample excluded levels (e.g., always keep errors)
    if (config.excludeLevels?.includes(entry.level)) {
        return true;
    }
    // Sample based on rate
    return Math.random() < config.rate;
};
exports.shouldSampleLog = shouldSampleLog;
/**
 * @function createAdaptiveSampler
 * @description Creates an adaptive sampler that adjusts rate based on volume
 * @param {number} targetRatePerMinute - Target logs per minute
 * @returns {object} Adaptive sampler with shouldSample method
 *
 * @example
 * ```typescript
 * const sampler = createAdaptiveSampler(1000);
 * if (sampler.shouldSample(logEntry)) {
 *   logger.log(logEntry);
 * }
 * ```
 */
const createAdaptiveSampler = (targetRatePerMinute) => {
    let windowStart = Date.now();
    let logCount = 0;
    let currentRate = 1.0;
    return {
        shouldSample: (entry) => {
            const now = Date.now();
            const windowDuration = 60000; // 1 minute
            // Reset window if needed
            if (now - windowStart >= windowDuration) {
                const actualRate = logCount / (windowDuration / 60000);
                currentRate = Math.min(1.0, targetRatePerMinute / Math.max(1, actualRate));
                windowStart = now;
                logCount = 0;
            }
            logCount++;
            // Always keep high-priority logs
            if (entry.level === LogLevel.ERROR ||
                entry.level === LogLevel.FATAL ||
                entry.level === LogLevel.WARN) {
                return true;
            }
            return Math.random() < currentRate;
        },
        getStats: () => ({
            currentRate,
            logCount,
            windowAge: Date.now() - windowStart,
        }),
    };
};
exports.createAdaptiveSampler = createAdaptiveSampler;
// ============================================================================
// CUSTOM LOG TRANSPORTS
// ============================================================================
/**
 * @function createConsoleTransport
 * @description Creates a console log transport
 * @param {LogLevel} minLevel - Minimum log level
 * @param {boolean} colorize - Enable color output
 * @returns {LogTransport} Console transport
 *
 * @example
 * ```typescript
 * const transport = createConsoleTransport(LogLevel.INFO, true);
 * transport.log(logEntry);
 * ```
 */
const createConsoleTransport = (minLevel = LogLevel.INFO, colorize = true) => {
    const colors = {
        [LogLevel.TRACE]: '\x1b[90m', // Gray
        [LogLevel.DEBUG]: '\x1b[36m', // Cyan
        [LogLevel.INFO]: '\x1b[32m', // Green
        [LogLevel.WARN]: '\x1b[33m', // Yellow
        [LogLevel.ERROR]: '\x1b[31m', // Red
        [LogLevel.FATAL]: '\x1b[35m', // Magenta
    };
    const reset = '\x1b[0m';
    return {
        name: 'console',
        level: minLevel,
        log: (entry) => {
            if (!(0, exports.shouldLog)(entry.level, minLevel)) {
                return;
            }
            const message = (0, exports.formatLogAsText)(entry);
            const color = colorize ? colors[entry.level] : '';
            console.log(`${color}${message}${colorize ? reset : ''}`);
        },
    };
};
exports.createConsoleTransport = createConsoleTransport;
/**
 * @function createFileTransport
 * @description Creates a file log transport
 * @param {string} filePath - Log file path
 * @param {LogLevel} minLevel - Minimum log level
 * @returns {LogTransport} File transport
 *
 * @example
 * ```typescript
 * const transport = createFileTransport('/var/log/app.log', LogLevel.DEBUG);
 * transport.log(logEntry);
 * ```
 */
const createFileTransport = (filePath, minLevel = LogLevel.INFO) => {
    const fs = require('fs');
    const stream = fs.createWriteStream(filePath, { flags: 'a' });
    return {
        name: 'file',
        level: minLevel,
        log: (entry) => {
            if (!(0, exports.shouldLog)(entry.level, minLevel)) {
                return;
            }
            stream.write((0, exports.formatLogAsJSON)(entry) + '\n');
        },
    };
};
exports.createFileTransport = createFileTransport;
/**
 * @function createHttpTransport
 * @description Creates an HTTP log transport for external services
 * @param {string} url - HTTP endpoint URL
 * @param {LogLevel} minLevel - Minimum log level
 * @returns {LogTransport} HTTP transport
 *
 * @example
 * ```typescript
 * const transport = createHttpTransport('https://logs.example.com/ingest', LogLevel.WARN);
 * await transport.log(logEntry);
 * ```
 */
const createHttpTransport = (url, minLevel = LogLevel.WARN) => {
    return {
        name: 'http',
        level: minLevel,
        log: async (entry) => {
            if (!(0, exports.shouldLog)(entry.level, minLevel)) {
                return;
            }
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: (0, exports.formatLogAsJSON)(entry),
                });
                if (!response.ok) {
                    console.error(`HTTP transport failed: ${response.statusText}`);
                }
            }
            catch (error) {
                console.error(`HTTP transport error:`, error);
            }
        },
    };
};
exports.createHttpTransport = createHttpTransport;
/**
 * @function createMultiTransport
 * @description Combines multiple transports into one
 * @param {LogTransport[]} transports - Array of transports
 * @returns {LogTransport} Multi transport
 *
 * @example
 * ```typescript
 * const transport = createMultiTransport([
 *   createConsoleTransport(LogLevel.DEBUG),
 *   createFileTransport('/var/log/app.log', LogLevel.INFO)
 * ]);
 * ```
 */
const createMultiTransport = (transports) => {
    return {
        name: 'multi',
        level: LogLevel.TRACE, // Let individual transports filter
        log: async (entry) => {
            await Promise.all(transports.map((transport) => {
                try {
                    return transport.log(entry);
                }
                catch (error) {
                    console.error(`Transport ${transport.name} failed:`, error);
                }
            }));
        },
    };
};
exports.createMultiTransport = createMultiTransport;
// ============================================================================
// REQUEST/RESPONSE LOGGING
// ============================================================================
/**
 * @class RequestLoggingInterceptor
 * @description NestJS interceptor for automatic request/response logging
 *
 * @example
 * ```typescript
 * @UseInterceptors(RequestLoggingInterceptor)
 * @Controller('users')
 * export class UsersController {}
 * ```
 */
let RequestLoggingInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RequestLoggingInterceptor = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger('HTTP');
        }
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            const startTime = Date.now();
            const requestLog = (0, exports.createRequestLog)(request);
            this.logger.log((0, exports.formatLogAsJSON)(requestLog));
            return next.handle().pipe((0, operators_1.tap)(() => {
                const duration = Date.now() - startTime;
                const responseLog = (0, exports.createResponseLog)(response, duration);
                this.logger.log((0, exports.formatLogAsJSON)(responseLog));
            }), (0, operators_1.catchError)((error) => {
                const duration = Date.now() - startTime;
                const errorLog = (0, exports.createErrorLog)(error, 'RequestLoggingInterceptor', {
                    performance: { duration, timestamp: new Date() },
                });
                this.logger.error((0, exports.formatLogAsJSON)(errorLog));
                throw error;
            }));
        }
    };
    __setFunctionName(_classThis, "RequestLoggingInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RequestLoggingInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RequestLoggingInterceptor = _classThis;
})();
exports.RequestLoggingInterceptor = RequestLoggingInterceptor;
/**
 * @function createRequestLog
 * @description Creates structured log entry for HTTP requests
 * @param {Request} req - Express request object
 * @returns {LogEntry} Request log entry
 *
 * @example
 * ```typescript
 * const requestLog = createRequestLog(req);
 * logger.log(requestLog);
 * ```
 */
const createRequestLog = (req) => {
    return (0, exports.createStructuredLog)(LogLevel.INFO, 'Incoming request', {
        context: 'HTTP',
        requestId: req.headers['x-request-id'],
        correlationId: (0, exports.extractCorrelationId)(req),
        metadata: {
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            contentLength: req.headers['content-length'],
        },
    });
};
exports.createRequestLog = createRequestLog;
/**
 * @function createResponseLog
 * @description Creates structured log entry for HTTP responses
 * @param {Response} res - Express response object
 * @param {number} duration - Request duration in ms
 * @returns {LogEntry} Response log entry
 *
 * @example
 * ```typescript
 * const responseLog = createResponseLog(res, 125);
 * logger.log(responseLog);
 * ```
 */
const createResponseLog = (res, duration) => {
    const statusCode = res.statusCode;
    const level = statusCode >= 500
        ? LogLevel.ERROR
        : statusCode >= 400
            ? LogLevel.WARN
            : LogLevel.INFO;
    return (0, exports.createStructuredLog)(level, 'Response sent', {
        context: 'HTTP',
        performance: { duration, timestamp: new Date() },
        metadata: {
            statusCode,
            contentLength: res.getHeader('content-length'),
        },
    });
};
exports.createResponseLog = createResponseLog;
// ============================================================================
// PERFORMANCE METRICS
// ============================================================================
/**
 * @function measureExecutionTime
 * @description Measures execution time of async function
 * @param {Function} fn - Async function to measure
 * @returns {Promise} Result and duration
 *
 * @example
 * ```typescript
 * const { result, duration } = await measureExecutionTime(async () => {
 *   return await expensiveOperation();
 * });
 * console.log(`Operation took ${duration}ms`);
 * ```
 */
const measureExecutionTime = async (fn) => {
    const startTime = performance.now();
    const result = await fn();
    const duration = performance.now() - startTime;
    return { result, duration };
};
exports.measureExecutionTime = measureExecutionTime;
/**
 * @function collectSystemMetrics
 * @description Collects current system resource metrics
 * @returns {object} System metrics including CPU and memory
 *
 * @example
 * ```typescript
 * const metrics = collectSystemMetrics();
 * console.log(`Memory usage: ${metrics.memoryUsage.heapUsed}MB`);
 * ```
 */
const collectSystemMetrics = () => {
    return {
        cpuUsage: process.cpuUsage(),
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
        loadAverage: os.loadavg(),
    };
};
exports.collectSystemMetrics = collectSystemMetrics;
/**
 * @function createPerformanceTimer
 * @description Creates a reusable performance timer
 * @returns {object} Timer with start, stop, and reset methods
 *
 * @example
 * ```typescript
 * const timer = createPerformanceTimer();
 * timer.start();
 * // ... operation
 * const duration = timer.stop();
 * ```
 */
const createPerformanceTimer = () => {
    let startTime = null;
    let endTime = null;
    return {
        start: () => {
            startTime = performance.now();
            endTime = null;
        },
        stop: () => {
            if (startTime === null) {
                throw new Error('Timer not started');
            }
            endTime = performance.now();
            return endTime - startTime;
        },
        reset: () => {
            startTime = null;
            endTime = null;
        },
        getDuration: () => {
            if (startTime === null || endTime === null) {
                return null;
            }
            return endTime - startTime;
        },
    };
};
exports.createPerformanceTimer = createPerformanceTimer;
// ============================================================================
// PROMETHEUS METRICS
// ============================================================================
/**
 * @function formatPrometheusMetric
 * @description Formats metric in Prometheus exposition format
 * @param {PrometheusMetric} metric - Metric to format
 * @returns {string} Prometheus format string
 *
 * @example
 * ```typescript
 * const formatted = formatPrometheusMetric({
 *   name: 'http_requests_total',
 *   help: 'Total HTTP requests',
 *   type: 'counter',
 *   values: [{ value: 100, labels: { method: 'GET' } }]
 * });
 * ```
 */
const formatPrometheusMetric = (metric) => {
    const lines = [];
    // Add HELP and TYPE
    lines.push(`# HELP ${metric.name} ${metric.help}`);
    lines.push(`# TYPE ${metric.name} ${metric.type}`);
    // Add values
    for (const value of metric.values) {
        const labelsStr = value.labels
            ? `{${Object.entries(value.labels)
                .map(([k, v]) => `${k}="${v}"`)
                .join(',')}}`
            : '';
        const timestampStr = value.timestamp ? ` ${value.timestamp}` : '';
        lines.push(`${metric.name}${labelsStr} ${value.value}${timestampStr}`);
    }
    return lines.join('\n');
};
exports.formatPrometheusMetric = formatPrometheusMetric;
/**
 * @function createPrometheusRegistry
 * @description Creates a registry for Prometheus metrics
 * @returns {object} Registry with register/collect methods
 *
 * @example
 * ```typescript
 * const registry = createPrometheusRegistry();
 * registry.register({ name: 'http_requests_total', ... });
 * const output = registry.collect();
 * ```
 */
const createPrometheusRegistry = () => {
    const metrics = new Map();
    return {
        register: (metric) => {
            metrics.set(metric.name, metric);
        },
        collect: () => {
            const output = [];
            for (const metric of metrics.values()) {
                output.push((0, exports.formatPrometheusMetric)(metric));
            }
            return output.join('\n\n');
        },
        getMetric: (name) => metrics.get(name),
        clear: () => metrics.clear(),
    };
};
exports.createPrometheusRegistry = createPrometheusRegistry;
/**
 * @function incrementPrometheusCounter
 * @description Increments a Prometheus counter metric
 * @param {string} name - Counter name
 * @param {number} value - Increment value
 * @param {Record<string, string>} labels - Metric labels
 * @returns {PrometheusMetric} Updated counter metric
 *
 * @example
 * ```typescript
 * const counter = incrementPrometheusCounter('http_requests_total', 1, {
 *   method: 'GET',
 *   status: '200'
 * });
 * ```
 */
const incrementPrometheusCounter = (name, value = 1, labels) => {
    return {
        name,
        help: `${name} counter`,
        type: 'counter',
        values: [{ value, labels }],
    };
};
exports.incrementPrometheusCounter = incrementPrometheusCounter;
/**
 * @function setPrometheusGauge
 * @description Sets a Prometheus gauge metric value
 * @param {string} name - Gauge name
 * @param {number} value - Gauge value
 * @param {Record<string, string>} labels - Metric labels
 * @returns {PrometheusMetric} Gauge metric
 *
 * @example
 * ```typescript
 * const gauge = setPrometheusGauge('memory_usage_bytes', 1024000, {
 *   type: 'heap'
 * });
 * ```
 */
const setPrometheusGauge = (name, value, labels) => {
    return {
        name,
        help: `${name} gauge`,
        type: 'gauge',
        values: [{ value, labels }],
    };
};
exports.setPrometheusGauge = setPrometheusGauge;
/**
 * @function recordPrometheusHistogram
 * @description Records observation in Prometheus histogram
 * @param {string} name - Histogram name
 * @param {number} value - Observed value
 * @param {number[]} buckets - Histogram buckets
 * @param {Record<string, string>} labels - Metric labels
 * @returns {PrometheusMetric} Histogram metric
 *
 * @example
 * ```typescript
 * const histogram = recordPrometheusHistogram(
 *   'http_request_duration_seconds',
 *   0.125,
 *   [0.1, 0.5, 1, 2, 5],
 *   { endpoint: '/users' }
 * );
 * ```
 */
const recordPrometheusHistogram = (name, value, buckets, labels) => {
    const values = buckets.map((bucket) => ({
        value: value <= bucket ? 1 : 0,
        labels: { ...labels, le: bucket.toString() },
    }));
    // Add +Inf bucket
    values.push({
        value: 1,
        labels: { ...labels, le: '+Inf' },
    });
    return {
        name: `${name}_bucket`,
        help: `${name} histogram`,
        type: 'histogram',
        values,
    };
};
exports.recordPrometheusHistogram = recordPrometheusHistogram;
// ============================================================================
// DISTRIBUTED TRACING
// ============================================================================
/**
 * @function generateTraceId
 * @description Generates unique trace ID for distributed tracing
 * @returns {string} Hexadecimal trace ID
 *
 * @example
 * ```typescript
 * const traceId = generateTraceId();
 * // Returns: "a1b2c3d4e5f678901234567890abcdef"
 * ```
 */
const generateTraceId = () => {
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};
exports.generateTraceId = generateTraceId;
/**
 * @function generateSpanId
 * @description Generates unique span ID for distributed tracing
 * @returns {string} Hexadecimal span ID
 *
 * @example
 * ```typescript
 * const spanId = generateSpanId();
 * // Returns: "a1b2c3d4e5f67890"
 * ```
 */
const generateSpanId = () => {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};
exports.generateSpanId = generateSpanId;
/**
 * @function createTraceContext
 * @description Creates a new trace context for distributed tracing
 * @param {string} serviceName - Name of the service
 * @param {string} operationName - Name of the operation
 * @param {string} parentSpanId - Parent span ID if exists
 * @returns {TraceContext} Trace context object
 *
 * @example
 * ```typescript
 * const trace = createTraceContext('user-service', 'createUser');
 * ```
 */
const createTraceContext = (serviceName, operationName, parentSpanId) => {
    return {
        traceId: (0, exports.generateTraceId)(),
        spanId: (0, exports.generateSpanId)(),
        parentSpanId,
        serviceName,
        operationName,
        startTime: new Date(),
        tags: {},
        logs: [],
    };
};
exports.createTraceContext = createTraceContext;
/**
 * @function finishTrace
 * @description Completes a trace span with end time and duration
 * @param {TraceContext} trace - Trace context to finish
 * @returns {TraceContext} Completed trace context
 *
 * @example
 * ```typescript
 * const completedTrace = finishTrace(trace);
 * await persistTrace(completedTrace);
 * ```
 */
const finishTrace = (trace) => {
    const endTime = new Date();
    return {
        ...trace,
        endTime,
        duration: endTime.getTime() - trace.startTime.getTime(),
    };
};
exports.finishTrace = finishTrace;
/**
 * @function propagateTraceHeaders
 * @description Creates HTTP headers for trace propagation
 * @param {TraceContext} trace - Trace context
 * @returns {Record<string, string>} HTTP headers
 *
 * @example
 * ```typescript
 * const headers = propagateTraceHeaders(trace);
 * // Use in HTTP client: axios.get(url, { headers });
 * ```
 */
const propagateTraceHeaders = (trace) => {
    return {
        'x-trace-id': trace.traceId,
        'x-span-id': trace.spanId,
        ...(trace.parentSpanId && { 'x-parent-span-id': trace.parentSpanId }),
    };
};
exports.propagateTraceHeaders = propagateTraceHeaders;
// ============================================================================
// HEALTH CHECKS
// ============================================================================
/**
 * @function checkDatabaseHealth
 * @description Checks database connection health
 * @param {any} sequelize - Sequelize instance
 * @returns {Promise<ComponentHealth>} Database health status
 *
 * @example
 * ```typescript
 * const dbHealth = await checkDatabaseHealth(sequelize);
 * ```
 */
const checkDatabaseHealth = async (sequelize) => {
    const startTime = performance.now();
    try {
        await sequelize.authenticate();
        const responseTime = performance.now() - startTime;
        return {
            status: responseTime > 1000 ? HealthStatus.DEGRADED : HealthStatus.HEALTHY,
            message: 'Database connection is healthy',
            responseTime,
        };
    }
    catch (error) {
        return {
            status: HealthStatus.UNHEALTHY,
            message: error.message,
            responseTime: performance.now() - startTime,
        };
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
/**
 * @function checkMemoryHealth
 * @description Checks memory usage health
 * @param {number} threshold - Memory threshold percentage (0-1)
 * @returns {ComponentHealth} Memory health status
 *
 * @example
 * ```typescript
 * const memHealth = checkMemoryHealth(0.85); // 85% threshold
 * ```
 */
const checkMemoryHealth = (threshold = 0.85) => {
    const usage = process.memoryUsage();
    const heapUsedPercent = usage.heapUsed / usage.heapTotal;
    let status = HealthStatus.HEALTHY;
    if (heapUsedPercent > threshold) {
        status = HealthStatus.DEGRADED;
    }
    if (heapUsedPercent > 0.95) {
        status = HealthStatus.UNHEALTHY;
    }
    return {
        status,
        message: `Memory usage: ${(heapUsedPercent * 100).toFixed(2)}%`,
        metadata: {
            heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
            heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
            rss: Math.round(usage.rss / 1024 / 1024),
        },
    };
};
exports.checkMemoryHealth = checkMemoryHealth;
/**
 * @function createLivenessProbe
 * @description Creates a liveness probe for Kubernetes
 * @returns {Function} Express middleware for liveness
 *
 * @example
 * ```typescript
 * app.get('/healthz/live', createLivenessProbe());
 * ```
 */
const createLivenessProbe = () => {
    return (req, res) => {
        res.status(200).json({
            status: 'alive',
            timestamp: new Date().toISOString(),
        });
    };
};
exports.createLivenessProbe = createLivenessProbe;
/**
 * @function createReadinessProbe
 * @description Creates a readiness probe for Kubernetes
 * @param {object} checks - Health check functions
 * @returns {Function} Express middleware for readiness
 *
 * @example
 * ```typescript
 * app.get('/healthz/ready', createReadinessProbe({
 *   database: () => checkDatabaseHealth(sequelize)
 * }));
 * ```
 */
const createReadinessProbe = (checks) => {
    return async (req, res) => {
        const results = {};
        for (const [name, check] of Object.entries(checks)) {
            try {
                results[name] = await check();
            }
            catch (error) {
                results[name] = {
                    status: HealthStatus.UNHEALTHY,
                    message: error.message,
                };
            }
        }
        const isReady = Object.values(results).every((r) => r.status === HealthStatus.HEALTHY || r.status === HealthStatus.DEGRADED);
        res.status(isReady ? 200 : 503).json({
            status: isReady ? 'ready' : 'not_ready',
            checks: results,
            timestamp: new Date().toISOString(),
        });
    };
};
exports.createReadinessProbe = createReadinessProbe;
/**
 * @function createStartupProbe
 * @description Creates a startup probe for Kubernetes
 * @param {Function} initCheck - Initialization check function
 * @returns {Function} Express middleware for startup
 *
 * @example
 * ```typescript
 * app.get('/healthz/startup', createStartupProbe(async () => {
 *   return await checkAppInitialized();
 * }));
 * ```
 */
const createStartupProbe = (initCheck) => {
    let isStarted = false;
    return async (req, res) => {
        if (!isStarted) {
            try {
                isStarted = await initCheck();
            }
            catch (error) {
                res.status(503).json({
                    status: 'starting',
                    message: error.message,
                    timestamp: new Date().toISOString(),
                });
                return;
            }
        }
        res.status(200).json({
            status: 'started',
            timestamp: new Date().toISOString(),
        });
    };
};
exports.createStartupProbe = createStartupProbe;
// ============================================================================
// AUDIT LOGGING
// ============================================================================
/**
 * @function createAuditLog
 * @description Creates HIPAA-compliant audit log entry
 * @param {Partial<AuditLogEntry>} entry - Audit log data
 * @returns {AuditLogEntry} Complete audit log entry
 *
 * @security HIPAA-compliant audit trail
 *
 * @example
 * ```typescript
 * const auditLog = createAuditLog({
 *   userId: 'user-123',
 *   action: 'VIEW_PATIENT_RECORD',
 *   resource: 'patient',
 *   resourceId: 'patient-456',
 *   outcome: 'success'
 * });
 * ```
 */
const createAuditLog = (entry) => {
    return {
        timestamp: new Date(),
        outcome: 'success',
        ...entry,
    };
};
exports.createAuditLog = createAuditLog;
/**
 * @function logDataAccess
 * @description Logs data access for compliance
 * @param {string} userId - User ID
 * @param {string} resource - Resource type
 * @param {string} resourceId - Resource ID
 * @param {string} action - Action performed
 * @returns {AuditLogEntry} Audit log entry
 *
 * @security Required for HIPAA compliance
 *
 * @example
 * ```typescript
 * const audit = logDataAccess('user-123', 'patient', 'patient-456', 'READ');
 * await persistAuditLog(audit);
 * ```
 */
const logDataAccess = (userId, resource, resourceId, action) => {
    return (0, exports.createAuditLog)({
        userId,
        resource,
        resourceId,
        action,
        outcome: 'success',
    });
};
exports.logDataAccess = logDataAccess;
/**
 * @function createAuditMiddleware
 * @description Creates Express middleware for automatic audit logging
 * @param {Function} persistFn - Function to persist audit logs
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(createAuditMiddleware(async (log) => {
 *   await AuditLog.create(log);
 * }));
 * ```
 */
const createAuditMiddleware = (persistFn) => {
    return async (req, res, next) => {
        const startTime = Date.now();
        res.on('finish', async () => {
            const auditLog = (0, exports.createAuditLog)({
                userId: req.user?.id || 'anonymous',
                tenantId: req.tenant?.id,
                action: `${req.method} ${req.path}`,
                resource: req.path.split('/')[1] || 'unknown',
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                outcome: res.statusCode < 400 ? 'success' : 'failure',
            });
            try {
                await persistFn(auditLog);
            }
            catch (error) {
                console.error('Failed to persist audit log:', error);
            }
        });
        next();
    };
};
exports.createAuditMiddleware = createAuditMiddleware;
//# sourceMappingURL=logging-monitoring-kit.js.map