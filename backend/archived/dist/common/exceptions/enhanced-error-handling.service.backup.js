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
var ErrorAggregationService_1, DatabaseRecoveryStrategy_1, CircuitBreakerRecoveryStrategy_1, EnhancedErrorHandlingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedErrorHandlingService = exports.CircuitBreakerRecoveryStrategy = exports.DatabaseRecoveryStrategy = exports.ErrorMetricsCollector = exports.ErrorAggregationService = exports.EnhancedIntegrationError = exports.EnhancedDatabaseError = exports.EnhancedBaseError = exports.ErrorCategory = exports.ErrorSeverity = void 0;
exports.createEnhancedErrorHandler = createEnhancedErrorHandler;
exports.HandleEnhancedErrors = HandleEnhancedErrors;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prom_client_1 = require("prom-client");
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
class EnhancedBaseError extends Error {
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
exports.EnhancedBaseError = EnhancedBaseError;
class EnhancedDatabaseError extends EnhancedBaseError {
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
exports.EnhancedDatabaseError = EnhancedDatabaseError;
class EnhancedIntegrationError extends EnhancedBaseError {
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
exports.EnhancedIntegrationError = EnhancedIntegrationError;
let ErrorAggregationService = ErrorAggregationService_1 = class ErrorAggregationService {
    logger = new common_1.Logger(ErrorAggregationService_1.name);
    errorCounts = new Map();
    maxSamples = 10;
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
    checkForAnomalies(key, aggregation) {
        const recentSamples = aggregation.samples.filter(sample => Date.now() - sample.timestamp.getTime() < 300000);
        if (recentSamples.length > 50) {
            this.logger.error(`Error spike detected for ${key}: ${recentSamples.length} errors in 5 minutes`);
        }
    }
};
exports.ErrorAggregationService = ErrorAggregationService;
exports.ErrorAggregationService = ErrorAggregationService = ErrorAggregationService_1 = __decorate([
    (0, common_1.Injectable)()
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
};
exports.ErrorMetricsCollector = ErrorMetricsCollector;
exports.ErrorMetricsCollector = ErrorMetricsCollector = __decorate([
    (0, common_1.Injectable)()
], ErrorMetricsCollector);
let DatabaseRecoveryStrategy = DatabaseRecoveryStrategy_1 = class DatabaseRecoveryStrategy {
    logger = new common_1.Logger(DatabaseRecoveryStrategy_1.name);
    canRecover(error) {
        return error instanceof EnhancedDatabaseError && error.retryable;
    }
    async recover(error) {
        this.logger.warn(`Attempting database recovery for error: ${error.errorId}`);
        await this.resetConnectionPool();
        await this.waitForHealthyConnection();
    }
    getRetryDelay(attempt) {
        return Math.min(1000 * Math.pow(2, attempt), 30000);
    }
    getMaxRetries() {
        return 3;
    }
    async resetConnectionPool() {
        this.logger.log('Resetting database connection pool');
    }
    async waitForHealthyConnection() {
        this.logger.log('Waiting for healthy database connection');
    }
};
exports.DatabaseRecoveryStrategy = DatabaseRecoveryStrategy;
exports.DatabaseRecoveryStrategy = DatabaseRecoveryStrategy = DatabaseRecoveryStrategy_1 = __decorate([
    (0, common_1.Injectable)()
], DatabaseRecoveryStrategy);
let CircuitBreakerRecoveryStrategy = CircuitBreakerRecoveryStrategy_1 = class CircuitBreakerRecoveryStrategy {
    circuitStates = new Map();
    logger = new common_1.Logger(CircuitBreakerRecoveryStrategy_1.name);
    canRecover(error) {
        return error instanceof EnhancedBaseError && error.retryable && this.getCircuitState(error.name) !== 'OPEN';
    }
    async recover(error) {
        const circuitKey = error.name;
        const circuit = this.getOrCreateCircuit(circuitKey);
        circuit.failures++;
        circuit.lastFailure = new Date();
        if (circuit.failures >= 5 && this.isWithinTimeWindow(circuit.lastFailure, 60000)) {
            circuit.state = 'OPEN';
            this.logger.warn(`Circuit breaker opened for ${circuitKey}`);
        }
    }
    getRetryDelay(attempt) {
        return Math.min(1000 * Math.pow(2, attempt), 30000);
    }
    getMaxRetries() {
        return 3;
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
exports.CircuitBreakerRecoveryStrategy = CircuitBreakerRecoveryStrategy = CircuitBreakerRecoveryStrategy_1 = __decorate([
    (0, common_1.Injectable)()
], CircuitBreakerRecoveryStrategy);
let EnhancedErrorHandlingService = EnhancedErrorHandlingService_1 = class EnhancedErrorHandlingService {
    configService;
    aggregationService;
    metricsCollector;
    recoveryStrategies;
    logger = new common_1.Logger(EnhancedErrorHandlingService_1.name);
    constructor(configService, aggregationService, metricsCollector, recoveryStrategies = []) {
        this.configService = configService;
        this.aggregationService = aggregationService;
        this.metricsCollector = metricsCollector;
        this.recoveryStrategies = recoveryStrategies;
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
            this.logger.error(`Error occurred while handling error ${structuredError.errorId}`, handlingError);
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
                    additionalData: { ...context.additionalData, attempt },
                });
                if (attempt === maxRetries || !lastError.retryable) {
                    await this.handleError(lastError, context);
                    throw lastError;
                }
                const strategy = this.findRecoveryStrategy(lastError);
                const delay = strategy?.getRetryDelay(attempt) || 1000 * Math.pow(2, attempt);
                this.logger.warn(`Operation failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms`, { errorId: lastError.errorId });
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
        if (error instanceof EnhancedBaseError) {
            return error;
        }
        if (error.message.indexOf('database') !== -1 || error.message.indexOf('connection') !== -1) {
            return new EnhancedDatabaseError(error.message, context, true);
        }
        if (error.message.indexOf('integration') !== -1 || error.message.indexOf('external') !== -1) {
            return new EnhancedIntegrationError(error.message, 'unknown', context, true);
        }
        return new class extends EnhancedBaseError {
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
                this.logger.error(logEntry);
                break;
            case ErrorSeverity.WARN:
                this.logger.warn(logEntry);
                break;
            case ErrorSeverity.INFO:
                this.logger.log(logEntry);
                break;
            case ErrorSeverity.DEBUG:
                this.logger.debug(logEntry);
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
            this.logger.log(`Attempting recovery for error: ${error.errorId}`);
            await strategy.recover(error);
            this.logger.log(`Recovery successful for error: ${error.errorId}`);
            return true;
        }
        catch (recoveryError) {
            this.logger.error(`Recovery failed for error: ${error.errorId}`, recoveryError);
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
exports.EnhancedErrorHandlingService = EnhancedErrorHandlingService;
exports.EnhancedErrorHandlingService = EnhancedErrorHandlingService = EnhancedErrorHandlingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        ErrorAggregationService,
        ErrorMetricsCollector, Array])
], EnhancedErrorHandlingService);
function createEnhancedErrorHandler(configService) {
    const aggregationService = new ErrorAggregationService();
    const metricsCollector = new ErrorMetricsCollector();
    const recoveryStrategies = [
        new DatabaseRecoveryStrategy(),
        new CircuitBreakerRecoveryStrategy(),
    ];
    return new EnhancedErrorHandlingService(configService, aggregationService, metricsCollector, recoveryStrategies);
}
function HandleEnhancedErrors(context) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const errorHandler = createEnhancedErrorHandler(this.configService);
            return errorHandler.handleErrorWithRetry(() => originalMethod.apply(this, args), { ...context, operation: `${target.constructor.name}.${propertyKey}` });
        };
        return descriptor;
    };
}
//# sourceMappingURL=enhanced-error-handling.service.backup.js.map