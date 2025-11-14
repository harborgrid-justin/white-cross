"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionExceptionFilter = exports.ProductionErrorHandler = exports.ErrorMetricsCollector = exports.ErrorAggregationService = exports.CircuitBreakerRecoveryStrategy = exports.IntegrationRecoveryStrategy = exports.DatabaseRecoveryStrategy = exports.BaseRecoveryStrategy = exports.ErrorCategory = exports.ErrorSeverity = exports.TimeoutError = exports.NotFoundError = exports.ConfigurationError = exports.RateLimitError = exports.SecurityError = exports.ValidationError = exports.IntegrationError = exports.DatabaseError = exports.BusinessLogicError = exports.BaseError = void 0;
exports.createProductionErrorHandler = createProductionErrorHandler;
exports.HandleErrors = HandleErrors;
const common_1 = require("@nestjs/common");
const winston = __importStar(require("winston"));
const prom_client_1 = require("prom-client");
const base_1 = require("../base");
class BaseError extends Error {
    timestamp;
    errorId;
    context;
    severity;
    category;
    retryable;
    constructor(message, context = {}, severity = ErrorSeverity.ERROR, category = ErrorCategory.APPLICATION, retryable = false) {
        super(message);
        this.name = this.constructor.name;
        this.timestamp = new Date();
        this.errorId = this.generateErrorId();
        this.context = { ...this.getDefaultContext(), ...context };
        this.severity = severity;
        this.category = category;
        this.retryable = retryable;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    generateErrorId() {
        return `err_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
    getDefaultContext() {
        return {
            service: 'white-cross-backend',
            version: process.env.APP_VERSION || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            nodeId: process.env.NODE_ID || 'unknown',
        };
    }
    toLogFormat() {
        return {
            errorId: this.errorId,
            timestamp: this.timestamp,
            name: this.name,
            message: this.message,
            stack: this.stack,
            context: this.context,
            severity: this.severity,
            category: this.category,
            retryable: this.retryable,
        };
    }
    toApiFormat(includeStack = false) {
        return {
            error: {
                id: this.errorId,
                type: this.name,
                message: this.message,
                code: this.getErrorCode(),
                timestamp: this.timestamp.toISOString(),
                context: this.sanitizeContext(),
                ...(includeStack && { stack: this.stack }),
            },
        };
    }
    sanitizeContext() {
        const { sensitiveData, ...safeContext } = this.context;
        return safeContext;
    }
}
exports.BaseError = BaseError;
class BusinessLogicError extends BaseError {
    constructor(message, context = {}, retryable = false) {
        super(message, context, ErrorSeverity.WARN, ErrorCategory.BUSINESS, retryable);
    }
    getErrorCode() {
        return 'BUSINESS_LOGIC_ERROR';
    }
}
exports.BusinessLogicError = BusinessLogicError;
class DatabaseError extends BaseError {
    query;
    parameters;
    constructor(message, context = {}, retryable = true) {
        super(message, context, ErrorSeverity.ERROR, ErrorCategory.DATABASE, retryable);
        this.query = context.query;
        this.parameters = context.parameters;
    }
    getErrorCode() {
        return 'DATABASE_ERROR';
    }
}
exports.DatabaseError = DatabaseError;
class IntegrationError extends BaseError {
    service;
    endpoint;
    httpStatus;
    constructor(message, service, context = {}, retryable = true) {
        super(message, context, ErrorSeverity.ERROR, ErrorCategory.INTEGRATION, retryable);
        this.service = service;
        this.endpoint = context.endpoint;
        this.httpStatus = context.httpStatus;
    }
    getErrorCode() {
        return 'INTEGRATION_ERROR';
    }
}
exports.IntegrationError = IntegrationError;
class ValidationError extends BaseError {
    violations;
    constructor(message, violations = [], context = {}) {
        super(message, context, ErrorSeverity.WARN, ErrorCategory.VALIDATION, false);
        this.violations = violations;
    }
    getErrorCode() {
        return 'VALIDATION_ERROR';
    }
}
exports.ValidationError = ValidationError;
class SecurityError extends BaseError {
    authenticationFailed;
    authorizationFailed;
    requiredPermissions;
    constructor(message, context = {}) {
        super(message, context, ErrorSeverity.WARN, ErrorCategory.SECURITY, false);
        this.authenticationFailed = context.authenticationFailed;
        this.authorizationFailed = context.authorizationFailed;
        this.requiredPermissions = context.requiredPermissions;
    }
    getErrorCode() {
        return 'SECURITY_ERROR';
    }
}
exports.SecurityError = SecurityError;
class RateLimitError extends BaseError {
    limit;
    remaining;
    resetTime;
    constructor(message, limit, remaining, resetTime, context = {}) {
        super(message, context, ErrorSeverity.WARN, ErrorCategory.RATE_LIMIT, true);
        this.limit = limit;
        this.remaining = remaining;
        this.resetTime = resetTime;
    }
    getErrorCode() {
        return 'RATE_LIMIT_ERROR';
    }
}
exports.RateLimitError = RateLimitError;
class ConfigurationError extends BaseError {
    configKey;
    expectedType;
    constructor(message, context = {}) {
        super(message, context, ErrorSeverity.ERROR, ErrorCategory.CONFIGURATION, false);
        this.configKey = context.configKey;
        this.expectedType = context.expectedType;
    }
    getErrorCode() {
        return 'CONFIGURATION_ERROR';
    }
}
exports.ConfigurationError = ConfigurationError;
class NotFoundError extends BaseError {
    resourceType;
    resourceId;
    constructor(resourceType, resourceId, context = {}) {
        const message = resourceId
            ? `${resourceType} with ID '${resourceId}' not found`
            : `${resourceType} not found`;
        super(message, context, ErrorSeverity.WARN, ErrorCategory.NOT_FOUND, false);
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }
    getErrorCode() {
        return 'NOT_FOUND_ERROR';
    }
}
exports.NotFoundError = NotFoundError;
class TimeoutError extends BaseError {
    timeoutMs;
    operation;
    constructor(operation, timeoutMs, context = {}) {
        super(`Operation '${operation}' timed out after ${timeoutMs}ms`, context, ErrorSeverity.ERROR, ErrorCategory.TIMEOUT, true);
        this.timeoutMs = timeoutMs;
        this.operation = operation;
    }
    getErrorCode() {
        return 'TIMEOUT_ERROR';
    }
}
exports.TimeoutError = TimeoutError;
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["DEBUG"] = "debug";
    ErrorSeverity["INFO"] = "info";
    ErrorSeverity["WARN"] = "warn";
    ErrorSeverity["ERROR"] = "error";
    ErrorSeverity["FATAL"] = "fatal";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
var ErrorCategory;
(function (ErrorCategory) {
    ErrorCategory["APPLICATION"] = "application";
    ErrorCategory["BUSINESS"] = "business";
    ErrorCategory["DATABASE"] = "database";
    ErrorCategory["INTEGRATION"] = "integration";
    ErrorCategory["VALIDATION"] = "validation";
    ErrorCategory["SECURITY"] = "security";
    ErrorCategory["RATE_LIMIT"] = "rate_limit";
    ErrorCategory["CONFIGURATION"] = "configuration";
    ErrorCategory["NOT_FOUND"] = "not_found";
    ErrorCategory["TIMEOUT"] = "timeout";
    ErrorCategory["UNKNOWN"] = "unknown";
})(ErrorCategory || (exports.ErrorCategory = ErrorCategory = {}));
class BaseRecoveryStrategy {
    getRetryDelay(attempt) {
        return Math.min(1000 * Math.pow(2, attempt), 30000);
    }
    getMaxRetries() {
        return 3;
    }
}
exports.BaseRecoveryStrategy = BaseRecoveryStrategy;
let DatabaseRecoveryStrategy = class DatabaseRecoveryStrategy extends BaseRecoveryStrategy {
    canRecover(error) {
        return error instanceof DatabaseError && error.retryable;
    }
    async recover(error) {
        this.logWarning(`Attempting database recovery for error: ${error.errorId}`);
        await this.resetConnectionPool();
        await this.waitForHealthyConnection();
    }
    async resetConnectionPool() {
        this.logInfo('Resetting database connection pool');
    }
    async waitForHealthyConnection() {
        this.logInfo('Waiting for healthy database connection');
    }
};
exports.DatabaseRecoveryStrategy = DatabaseRecoveryStrategy;
exports.DatabaseRecoveryStrategy = DatabaseRecoveryStrategy = __decorate([
    (0, common_1.Injectable)()
], DatabaseRecoveryStrategy);
let IntegrationRecoveryStrategy = class IntegrationRecoveryStrategy extends BaseRecoveryStrategy {
    logger = new common_1.Logger('IntegrationRecoveryStrategy');
    canRecover(error) {
        if (!(error instanceof IntegrationError))
            return false;
        return !error.httpStatus || error.httpStatus >= 500;
    }
    async recover(error) {
        this.logWarning(`Attempting integration recovery for error: ${error.errorId}`);
        if (error instanceof IntegrationError) {
            await this.refreshServiceConnection(error.service);
        }
    }
    async refreshServiceConnection(service) {
        this.logInfo(`Refreshing connection to service: ${service}`);
    }
};
exports.IntegrationRecoveryStrategy = IntegrationRecoveryStrategy;
exports.IntegrationRecoveryStrategy = IntegrationRecoveryStrategy = __decorate([
    (0, common_1.Injectable)()
], IntegrationRecoveryStrategy);
let CircuitBreakerRecoveryStrategy = class CircuitBreakerRecoveryStrategy extends BaseRecoveryStrategy {
    circuitStates = new Map();
    logger = new common_1.Logger('CircuitBreakerRecoveryStrategy');
    canRecover(error) {
        return error.retryable && this.getCircuitState(error.name) !== 'OPEN';
    }
    async recover(error) {
        const circuitKey = error.name;
        const circuit = this.getOrCreateCircuit(circuitKey);
        circuit.failures++;
        circuit.lastFailure = new Date();
        if (circuit.failures >= 5 && this.isWithinTimeWindow(circuit.lastFailure, 60000)) {
            circuit.state = 'OPEN';
            this.logWarning(`Circuit breaker opened for ${circuitKey}`);
        }
    }
    getCircuitState(circuitKey) {
        const circuit = this.circuitStates.get(circuitKey);
        if (!circuit)
            return 'CLOSED';
        if (circuit.state === 'OPEN' && !this.isWithinTimeWindow(circuit.lastFailure, 300000)) {
            circuit.state = 'HALF_OPEN';
            circuit.failures = 0;
        }
        return circuit.state;
    }
    getOrCreateCircuit(circuitKey) {
        if (!this.circuitStates.has(circuitKey)) {
            this.circuitStates.set(circuitKey, {
                failures: 0,
                lastFailure: new Date(),
                state: 'CLOSED',
            });
        }
        return this.circuitStates.get(circuitKey);
    }
    isWithinTimeWindow(date, windowMs) {
        return Date.now() - date.getTime() < windowMs;
    }
};
exports.CircuitBreakerRecoveryStrategy = CircuitBreakerRecoveryStrategy;
exports.CircuitBreakerRecoveryStrategy = CircuitBreakerRecoveryStrategy = __decorate([
    (0, common_1.Injectable)()
], CircuitBreakerRecoveryStrategy);
let ErrorAggregationService = class ErrorAggregationService extends base_1.BaseService {
    logger = new common_1.Logger('ErrorAggregationService');
    errorCounts = new Map();
    maxSamples = 10;
    constructor() {
        super("ErrorAggregationService");
    }
    recordError(error) {
        const key = `${error.category}:${error.name}`;
        const logEntry = error.toLogFormat();
        let aggregation = this.errorCounts.get(key);
        if (!aggregation) {
            aggregation = {
                errorType: error.name,
                count: 0,
                firstSeen: error.timestamp,
                lastSeen: error.timestamp,
                samples: [],
            };
            this.errorCounts.set(key, aggregation);
        }
        aggregation.count++;
        aggregation.lastSeen = error.timestamp;
        aggregation.samples.push(logEntry);
        if (aggregation.samples.length > this.maxSamples) {
            aggregation.samples.shift();
        }
        this.checkForAnomalies(key, aggregation);
    }
    getAggregations() {
        return new Map(this.errorCounts);
    }
    getTopErrors(limit = 10) {
        return Array.from(this.errorCounts.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
    getErrorSpikes(timeWindowMs = 300000) {
        const cutoff = new Date(Date.now() - timeWindowMs);
        return Array.from(this.errorCounts.values())
            .filter((agg) => agg.lastSeen > cutoff)
            .filter((agg) => agg.count > 10)
            .sort((a, b) => b.count - a.count);
    }
    cleanup(maxAgeMs = 86400000) {
        const cutoff = new Date(Date.now() - maxAgeMs);
        for (const [key, aggregation] of this.errorCounts.entries()) {
            if (aggregation.lastSeen < cutoff) {
                this.errorCounts.delete(key);
            }
        }
    }
    checkForAnomalies(key, aggregation) {
        const recentSamples = aggregation.samples.filter(sample => Date.now() - sample.timestamp.getTime() < 300000);
        if (recentSamples.length > 50) {
            this.logError(`Error spike detected for ${key}: ${recentSamples.length} errors in 5 minutes`);
        }
    }
};
exports.ErrorAggregationService = ErrorAggregationService;
exports.ErrorAggregationService = ErrorAggregationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ErrorAggregationService);
let ErrorMetricsCollector = class ErrorMetricsCollector {
    errorCounter = new prom_client_1.Counter({
        name: 'application_errors_total',
        help: 'Total number of application errors',
        labelNames: ['error_type', 'category', 'severity', 'service'],
        registers: [prom_client_1.register],
    });
    errorDuration = new prom_client_1.Histogram({
        name: 'error_handling_duration_seconds',
        help: 'Time spent handling errors',
        labelNames: ['error_type', 'recovery_attempted'],
        registers: [prom_client_1.register],
    });
    recoveryAttempts = new prom_client_1.Counter({
        name: 'error_recovery_attempts_total',
        help: 'Total number of error recovery attempts',
        labelNames: ['error_type', 'recovery_strategy', 'success'],
        registers: [prom_client_1.register],
    });
    recordError(error) {
        this.errorCounter
            .labels({
            error_type: error.name,
            category: error.category,
            severity: error.severity,
            service: error.context.service || 'unknown',
        })
            .inc();
    }
    recordHandlingDuration(error, durationMs, recoveryAttempted) {
        this.errorDuration
            .labels({
            error_type: error.name,
            recovery_attempted: recoveryAttempted.toString(),
        })
            .observe(durationMs / 1000);
    }
    recordRecoveryAttempt(error, strategyName, success) {
        this.recoveryAttempts
            .labels({
            error_type: error.name,
            recovery_strategy: strategyName,
            success: success.toString(),
        })
            .inc();
    }
};
exports.ErrorMetricsCollector = ErrorMetricsCollector;
exports.ErrorMetricsCollector = ErrorMetricsCollector = __decorate([
    (0, common_1.Injectable)()
], ErrorMetricsCollector);
let ProductionErrorHandler = class ProductionErrorHandler {
    aggregationService;
    metricsCollector;
    recoveryStrategies;
    logger = new common_1.Logger('ProductionErrorHandler');
    winstonLogger;
    constructor(aggregationService, metricsCollector, recoveryStrategies = []) {
        this.aggregationService = aggregationService;
        this.metricsCollector = metricsCollector;
        this.recoveryStrategies = recoveryStrategies;
        this.winstonLogger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'error.log' }),
            ],
        });
    }
    async handleError(error, context = {}) {
        const startTime = Date.now();
        const structuredError = this.ensureStructuredError(error, context);
        try {
            this.logError(structuredError);
            this.metricsCollector.recordError(structuredError);
            this.aggregationService.recordError(structuredError);
            const recoveryAttempted = await this.attemptRecovery(structuredError);
            const duration = Date.now() - startTime;
            this.metricsCollector.recordHandlingDuration(structuredError, duration, recoveryAttempted);
        }
        catch (handlingError) {
            this.logError(`Error occurred while handling error ${structuredError.errorId}`, handlingError);
        }
    }
    async handleErrorWithRetry(operation, context = {}, maxRetries = 3) {
        let lastError;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = this.ensureStructuredError(error, {
                    ...context,
                    operation: context.operation || 'unknown',
                    additionalData: { ...context.additionalData, attempt }
                });
                if (attempt === maxRetries || !lastError.retryable) {
                    await this.handleError(lastError, context);
                    throw lastError;
                }
                const strategy = this.findRecoveryStrategy(lastError);
                const delay = strategy?.getRetryDelay(attempt) || 1000 * Math.pow(2, attempt);
                this.logWarning(`Operation failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms`, { errorId: lastError.errorId });
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        throw lastError;
    }
    createSafeApiResponse(error, includeStack = false) {
        const structuredError = this.ensureStructuredError(error);
        return structuredError.toApiFormat(includeStack);
    }
    ensureStructuredError(error, context = {}) {
        if (error instanceof BaseError) {
            return error;
        }
        if (error.name === 'ValidationError') {
            return new ValidationError(error.message, [], context);
        }
        if (error.message.indexOf('timeout') !== -1) {
            return new TimeoutError(context.operation || 'unknown', 30000, context);
        }
        if (error.message.indexOf('database') !== -1 || error.message.indexOf('connection') !== -1) {
            return new DatabaseError(error.message, context, true);
        }
        return new class extends BaseError {
            getErrorCode() {
                return 'UNKNOWN_ERROR';
            }
        }(error.message, context, ErrorSeverity.ERROR, ErrorCategory.UNKNOWN, true);
    }
    logError(error) {
        const logEntry = error.toLogFormat();
        switch (error.severity) {
            case ErrorSeverity.FATAL:
            case ErrorSeverity.ERROR:
                this.winstonLogger.error(logEntry);
                break;
            case ErrorSeverity.WARN:
                this.winstonLogger.warn(logEntry);
                break;
            case ErrorSeverity.INFO:
                this.winstonLogger.info(logEntry);
                break;
            case ErrorSeverity.DEBUG:
                this.winstonLogger.debug(logEntry);
                break;
        }
    }
    async attemptRecovery(error) {
        if (!error.retryable) {
            return false;
        }
        const strategy = this.findRecoveryStrategy(error);
        if (!strategy) {
            return false;
        }
        try {
            this.logInfo(`Attempting recovery for error: ${error.errorId}`);
            await strategy.recover(error);
            this.metricsCollector.recordRecoveryAttempt(error, strategy.constructor.name, true);
            this.logInfo(`Recovery successful for error: ${error.errorId}`);
            return true;
        }
        catch (recoveryError) {
            this.metricsCollector.recordRecoveryAttempt(error, strategy.constructor.name, false);
            this.logError(`Recovery failed for error: ${error.errorId}`, recoveryError);
            return false;
        }
    }
    findRecoveryStrategy(error) {
        for (const strategy of this.recoveryStrategies) {
            if (strategy.canRecover(error)) {
                return strategy;
            }
        }
        return undefined;
    }
};
exports.ProductionErrorHandler = ProductionErrorHandler;
exports.ProductionErrorHandler = ProductionErrorHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ErrorAggregationService,
        ErrorMetricsCollector, Array])
], ProductionErrorHandler);
let ProductionExceptionFilter = class ProductionExceptionFilter {
    errorHandler;
    constructor(errorHandler) {
        this.errorHandler = errorHandler;
    }
    async catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const error = exception instanceof Error ? exception : new Error(String(exception));
        const context = {
            requestId: request.headers['x-request-id'],
            userId: request.user?.id,
            operation: `${request.method} ${request.path}`,
            additionalData: {
                userAgent: request.headers['user-agent'],
                ip: request.ip,
                query: request.query,
            },
        };
        await this.errorHandler.handleError(error, context);
        const structuredError = this.errorHandler.createSafeApiResponse(error);
        const statusCode = this.getHttpStatusCode(exception);
        response.status(statusCode).json(structuredError);
    }
    getHttpStatusCode(exception) {
        if (exception instanceof common_1.HttpException) {
            return exception.getStatus();
        }
        if (exception instanceof ValidationError) {
            return common_1.HttpStatus.BAD_REQUEST;
        }
        if (exception instanceof NotFoundError) {
            return common_1.HttpStatus.NOT_FOUND;
        }
        if (exception instanceof SecurityError) {
            return common_1.HttpStatus.UNAUTHORIZED;
        }
        if (exception instanceof RateLimitError) {
            return common_1.HttpStatus.TOO_MANY_REQUESTS;
        }
        return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    }
};
exports.ProductionExceptionFilter = ProductionExceptionFilter;
exports.ProductionExceptionFilter = ProductionExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [ProductionErrorHandler])
], ProductionExceptionFilter);
function createProductionErrorHandler() {
    const aggregationService = new ErrorAggregationService();
    const metricsCollector = new ErrorMetricsCollector();
    const recoveryStrategies = [
        new DatabaseRecoveryStrategy(),
        new IntegrationRecoveryStrategy(),
        new CircuitBreakerRecoveryStrategy(),
    ];
    return new ProductionErrorHandler(aggregationService, metricsCollector, recoveryStrategies);
}
function HandleErrors(context) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const errorHandler = createProductionErrorHandler();
            return errorHandler.handleErrorWithRetry(() => originalMethod.apply(this, args), { ...context, operation: `${target.constructor.name}.${propertyKey}` });
        };
        return descriptor;
    };
}
//# sourceMappingURL=enhanced-error-handling.service.js.map