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
var TracingMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracingMiddleware = exports.DEFAULT_TRACING_CONFIG = exports.SpanStatus = void 0;
exports.createTracingMiddleware = createTracingMiddleware;
const common_1 = require("@nestjs/common");
var SpanStatus;
(function (SpanStatus) {
    SpanStatus["OK"] = "OK";
    SpanStatus["CANCELLED"] = "CANCELLED";
    SpanStatus["UNKNOWN"] = "UNKNOWN";
    SpanStatus["INVALID_ARGUMENT"] = "INVALID_ARGUMENT";
    SpanStatus["DEADLINE_EXCEEDED"] = "DEADLINE_EXCEEDED";
    SpanStatus["NOT_FOUND"] = "NOT_FOUND";
    SpanStatus["ALREADY_EXISTS"] = "ALREADY_EXISTS";
    SpanStatus["PERMISSION_DENIED"] = "PERMISSION_DENIED";
    SpanStatus["UNAUTHENTICATED"] = "UNAUTHENTICATED";
    SpanStatus["RESOURCE_EXHAUSTED"] = "RESOURCE_EXHAUSTED";
    SpanStatus["FAILED_PRECONDITION"] = "FAILED_PRECONDITION";
    SpanStatus["ABORTED"] = "ABORTED";
    SpanStatus["OUT_OF_RANGE"] = "OUT_OF_RANGE";
    SpanStatus["UNIMPLEMENTED"] = "UNIMPLEMENTED";
    SpanStatus["INTERNAL"] = "INTERNAL";
    SpanStatus["UNAVAILABLE"] = "UNAVAILABLE";
    SpanStatus["DATA_LOSS"] = "DATA_LOSS";
})(SpanStatus || (exports.SpanStatus = SpanStatus = {}));
exports.DEFAULT_TRACING_CONFIG = {
    enabled: true,
    serviceName: 'white-cross-healthcare',
    sampleRate: 0.1,
    enableHealthcareTracing: true,
    enablePerformanceTracing: true,
    enableDatabaseTracing: true,
    enableExternalServiceTracing: true,
    maxSpanDuration: 30000,
    batchExport: {
        maxQueueSize: 2048,
        batchTimeout: 5000,
        maxExportBatchSize: 512,
    },
    defaultTags: {
        service: 'white-cross-healthcare',
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
    },
    excludeFields: ['password', 'ssn', 'creditCard', 'medicalRecord', 'token'],
    hipaaCompliant: true,
};
class SpanStorage {
    onExport;
    spans = [];
    exportTimer;
    config;
    constructor(config, onExport) {
        this.onExport = onExport;
        this.config = config;
        this.startExportTimer();
    }
    addSpan(span) {
        if (this.config.hipaaCompliant) {
            span = this.sanitizeSpan(span);
        }
        this.spans.push(span);
        if (this.spans.length >= this.config.batchExport.maxQueueSize) {
            this.export();
        }
    }
    startExportTimer() {
        this.exportTimer = setInterval(() => {
            if (this.spans.length > 0) {
                this.export();
            }
        }, this.config.batchExport.batchTimeout);
    }
    async export() {
        if (this.spans.length === 0)
            return;
        const batchSize = Math.min(this.spans.length, this.config.batchExport.maxExportBatchSize);
        const spansToExport = this.spans.splice(0, batchSize);
        try {
            await this.onExport(spansToExport);
        }
        catch (error) {
            console.error('[SpanStorage] Error exporting spans:', error);
            this.spans.unshift(...spansToExport);
        }
    }
    sanitizeSpan(span) {
        const sanitized = { ...span };
        sanitized.tags = this.sanitizeObject(span.tags);
        sanitized.logs = span.logs.map((log) => ({
            ...log,
            fields: log.fields ? this.sanitizeObject(log.fields) : undefined,
        }));
        return sanitized;
    }
    sanitizeObject(obj) {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (this.config.excludeFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
                sanitized[key] = '[REDACTED]';
            }
            else if (typeof value === 'object' && value !== null) {
                sanitized[key] = this.sanitizeObject(value);
            }
            else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
    async forceExport() {
        await this.export();
    }
    destroy() {
        if (this.exportTimer) {
            clearInterval(this.exportTimer);
        }
        this.export();
    }
}
class TraceIdGenerator {
    static generateTraceId() {
        return this.generateId(32);
    }
    static generateSpanId() {
        return this.generateId(16);
    }
    static generateId(length) {
        let result = '';
        const chars = '0123456789abcdef';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}
class HealthcareTraceUtils {
    static extractHealthcareContext(req, user) {
        const context = {};
        if (user) {
            context['healthcare.user.id'] = user.userId;
            context['healthcare.user.role'] = user.role;
            context['healthcare.facility.id'] = user.facilityId || 'unknown';
            if (user.npiNumber) {
                context['healthcare.provider.npi'] = user.npiNumber;
            }
        }
        const patientId = this.extractPatientId(req);
        if (patientId) {
            context['healthcare.patient.id'] = patientId;
        }
        if (this.isPhiAccess(req.path)) {
            context['healthcare.phi.access'] = true;
            context['healthcare.access.type'] = this.getAccessType(req.path);
        }
        if (this.isEmergencyAccess(req.path)) {
            context['healthcare.emergency.access'] = true;
        }
        return context;
    }
    static extractPatientId(req) {
        const pathMatch = req.path.match(/\/patients\/([^\/]+)/);
        if (pathMatch) {
            return pathMatch[1];
        }
        if (req.query?.patientId) {
            return req.query.patientId;
        }
        const patientHeader = req.headers['x-patient-id'];
        if (patientHeader) {
            return Array.isArray(patientHeader) ? patientHeader[0] : patientHeader;
        }
        return null;
    }
    static isPhiAccess(path) {
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
    static getAccessType(path) {
        if (path.includes('/emergency'))
            return 'emergency';
        if (path.includes('/break-glass'))
            return 'break-glass';
        return 'routine';
    }
    static isEmergencyAccess(path) {
        return path.includes('/emergency') || path.includes('/break-glass');
    }
}
let TracingMiddleware = TracingMiddleware_1 = class TracingMiddleware {
    logger = new common_1.Logger(TracingMiddleware_1.name);
    config;
    spanStorage;
    activeSpans = new Map();
    constructor() {
        this.config = exports.DEFAULT_TRACING_CONFIG;
        if (this.config.enabled) {
            this.spanStorage = new SpanStorage(this.config, this.onSpanExport.bind(this));
        }
    }
    use(req, res, next) {
        if (!this.config.enabled || !this.shouldSample()) {
            return next();
        }
        const tracingContext = this.createTracingContext(req);
        this.startSpan(tracingContext);
        this.injectTracingHeaders(req, tracingContext);
        this.instrumentResponse(res, tracingContext);
        next();
    }
    createTracingContext(req) {
        const user = req.user;
        const traceId = this.extractOrGenerateTraceId(req);
        const spanId = TraceIdGenerator.generateSpanId();
        const parentSpanId = this.extractParentSpanId(req);
        const operation = this.buildOperationName(req);
        const healthcareContext = this.config.enableHealthcareTracing
            ? HealthcareTraceUtils.extractHealthcareContext(req, user)
            : {};
        const tags = {
            ...this.config.defaultTags,
            'http.method': req.method,
            'http.url': req.url,
            'http.path': req.path,
            'user.agent': req.headers['user-agent'] || 'unknown',
            'client.ip': this.getClientIP(req),
            ...healthcareContext,
        };
        if (user) {
            tags['user.id'] = user.userId;
            tags['user.role'] = user.role;
        }
        return {
            traceId,
            spanId,
            parentSpanId,
            user,
            facility: user?.facilityId,
            operation,
            startTime: Date.now(),
            tags,
            logs: [],
        };
    }
    extractOrGenerateTraceId(req) {
        const traceHeader = req.headers['x-trace-id'] ||
            req.headers['traceparent'] ||
            req.headers['x-request-id'];
        if (traceHeader) {
            const traceId = Array.isArray(traceHeader) ? traceHeader[0] : traceHeader;
            if (traceId.startsWith('00-')) {
                return traceId.split('-')[1];
            }
            return traceId;
        }
        return TraceIdGenerator.generateTraceId();
    }
    extractParentSpanId(req) {
        const parentSpanHeader = req.headers['x-parent-span-id'];
        if (parentSpanHeader) {
            return Array.isArray(parentSpanHeader)
                ? parentSpanHeader[0]
                : parentSpanHeader;
        }
        const traceparent = req.headers['traceparent'];
        if (traceparent) {
            const tp = Array.isArray(traceparent) ? traceparent[0] : traceparent;
            const parts = tp.split('-');
            if (parts.length >= 3) {
                return parts[2];
            }
        }
        return undefined;
    }
    buildOperationName(req) {
        const method = req.method.toLowerCase();
        const path = this.normalizePath(req.path);
        return `${method} ${path}`;
    }
    normalizePath(path) {
        return path
            .replace(/\/\d+/g, '/:id')
            .replace(/\/[a-f0-9-]{36}/gi, '/:uuid')
            .replace(/\/[a-f0-9]{24}/gi, '/:objectid');
    }
    getClientIP(req) {
        return (req.headers['x-forwarded-for']?.toString().split(',')[0] ||
            req.headers['x-real-ip']?.toString() ||
            req.ip ||
            'unknown');
    }
    shouldSample() {
        return Math.random() < this.config.sampleRate;
    }
    startSpan(context) {
        this.activeSpans.set(context.spanId, context);
        this.addLog(context, 'INFO', 'Span started', {
            operation: context.operation,
            traceId: context.traceId,
            spanId: context.spanId,
        });
    }
    injectTracingHeaders(req, context) {
        req.traceId = context.traceId;
        req.spanId = context.spanId;
        req.tracingContext = context;
    }
    instrumentResponse(res, context) {
        const originalEnd = res.end;
        res.end = ((chunk, encoding, cb) => {
            const endTime = Date.now();
            context.tags['http.status_code'] = res.statusCode;
            const status = this.determineSpanStatus(res.statusCode);
            this.completeSpan(context, endTime, status);
            return originalEnd.call(res, chunk, encoding || 'utf8', cb);
        });
    }
    determineSpanStatus(statusCode) {
        if (statusCode >= 200 && statusCode < 400) {
            return SpanStatus.OK;
        }
        else if (statusCode === 401) {
            return SpanStatus.UNAUTHENTICATED;
        }
        else if (statusCode === 403) {
            return SpanStatus.PERMISSION_DENIED;
        }
        else if (statusCode === 404) {
            return SpanStatus.NOT_FOUND;
        }
        else if (statusCode === 408 || statusCode === 504) {
            return SpanStatus.DEADLINE_EXCEEDED;
        }
        else if (statusCode >= 400 && statusCode < 500) {
            return SpanStatus.INVALID_ARGUMENT;
        }
        else if (statusCode >= 500) {
            return SpanStatus.INTERNAL;
        }
        return SpanStatus.UNKNOWN;
    }
    completeSpan(context, endTime, status) {
        const duration = endTime - context.startTime;
        context.tags['span.duration'] = duration;
        context.tags['span.status'] = status;
        const span = {
            traceId: context.traceId,
            spanId: context.spanId,
            parentSpanId: context.parentSpanId,
            operationName: context.operation,
            startTime: context.startTime,
            endTime,
            duration,
            tags: context.tags,
            logs: context.logs,
            status,
            context: {
                traceId: context.traceId,
                spanId: context.spanId,
                traceFlags: 1,
                baggage: {},
            },
        };
        this.addLog(context, 'INFO', 'Span completed', {
            duration,
            status,
            endTime,
        });
        if (this.spanStorage) {
            this.spanStorage.addSpan(span);
        }
        this.activeSpans.delete(context.spanId);
    }
    addLog(context, level, message, fields) {
        context.logs.push({
            timestamp: Date.now(),
            level,
            message,
            fields,
        });
    }
    async onSpanExport(spans) {
        try {
            this.logger.debug(`Exporting ${spans.length} spans`);
            const groupedSpans = this.groupSpansByTrace(spans);
            for (const [traceId, traceSpans] of Object.entries(groupedSpans)) {
                this.logger.debug(`[TRACE][${traceId}] ${traceSpans.length} spans`, traceSpans);
            }
            if (this.config.exporterEndpoint) {
                await this.exportToEndpoint(spans);
            }
        }
        catch (error) {
            this.logger.error('Error in span export', error);
            throw error;
        }
    }
    groupSpansByTrace(spans) {
        return spans.reduce((groups, span) => {
            const traceId = span.traceId;
            if (!groups[traceId]) {
                groups[traceId] = [];
            }
            groups[traceId].push(span);
            return groups;
        }, {});
    }
    async exportToEndpoint(spans) {
        if (!this.config.exporterEndpoint)
            return;
        const exportData = {
            spans,
            service: this.config.serviceName,
            timestamp: new Date().toISOString(),
        };
        this.logger.debug(`Would export to ${this.config.exporterEndpoint}`, exportData);
    }
    getTracingSummary() {
        return {
            activeSpans: this.activeSpans.size,
            config: this.config,
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        };
    }
    onModuleDestroy() {
        if (this.spanStorage) {
            this.spanStorage.destroy();
        }
        this.activeSpans.clear();
    }
};
exports.TracingMiddleware = TracingMiddleware;
exports.TracingMiddleware = TracingMiddleware = TracingMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TracingMiddleware);
function createTracingMiddleware(config = {}) {
    const middleware = new TracingMiddleware();
    middleware.config = { ...exports.DEFAULT_TRACING_CONFIG, ...config };
    return middleware;
}
exports.default = TracingMiddleware;
//# sourceMappingURL=tracing.middleware.js.map