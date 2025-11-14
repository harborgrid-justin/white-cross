"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseLogger = exports.LOGGING_METADATA = void 0;
exports.LogMethod = LogMethod;
exports.LogController = LogController;
exports.LogService = LogService;
exports.LogErrors = LogErrors;
const common_1 = require("@nestjs/common");
const types_1 = require("./types");
exports.LOGGING_METADATA = 'enterprise:logging';
let EnterpriseLogger = class EnterpriseLogger extends common_1.Logger {
    formatMessage(level, message, context, metadata) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            context: context || 'EnterpriseLogger',
            ...metadata,
        };
        return JSON.stringify(logEntry);
    }
    debug(message, context, metadata) {
        super.debug(this.formatMessage(types_1.LogLevel.DEBUG, message, context, metadata));
    }
    log(message, context, metadata) {
        super.log(this.formatMessage(types_1.LogLevel.INFO, message, context, metadata));
    }
    warn(message, context, metadata) {
        super.warn(this.formatMessage(types_1.LogLevel.WARN, message, context, metadata));
    }
    error(message, trace, context, metadata) {
        super.error(this.formatMessage(types_1.LogLevel.ERROR, message, context, { trace, ...metadata }));
    }
    critical(message, context, metadata) {
        super.error(this.formatMessage(types_1.LogLevel.CRITICAL, `CRITICAL: ${message}`, context, metadata));
    }
    logRequest(request, responseTime) {
        const metadata = {
            correlationId: request.correlationId,
            method: request.method,
            url: request.url,
            userAgent: request.get('User-Agent'),
            ip: request.ip,
            responseTime,
            userId: request.userContext?.id
        };
        this.log(`HTTP ${request.method} ${request.url}`, 'HTTP', metadata);
    }
    logPerformance(methodName, executionTime, metadata) {
        const level = executionTime > 1000 ? types_1.LogLevel.WARN : types_1.LogLevel.DEBUG;
        const message = `Method ${methodName} executed in ${executionTime}ms`;
        if (level === types_1.LogLevel.WARN) {
            this.warn(message, 'Performance', { executionTime, ...metadata });
        }
        else {
            this.debug(message, 'Performance', { executionTime, ...metadata });
        }
    }
};
exports.EnterpriseLogger = EnterpriseLogger;
exports.EnterpriseLogger = EnterpriseLogger = __decorate([
    (0, common_1.Injectable)()
], EnterpriseLogger);
function LogMethod(level = types_1.LogLevel.INFO, options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const logger = new EnterpriseLogger();
            const startTime = Date.now();
            const entryMessage = options.customMessage || `Executing ${methodName}`;
            const entryMetadata = {
                method: methodName,
                includeArgs: options.includeArgs
            };
            if (options.includeArgs) {
                entryMetadata.args = args.map((arg, index) => ({
                    index,
                    type: typeof arg,
                    value: typeof arg === 'object' ? '[Object]' : String(arg)
                }));
            }
            logger.log(entryMessage, 'MethodEntry', entryMetadata);
            try {
                const result = await originalMethod.apply(this, args);
                const executionTime = Date.now() - startTime;
                const successMetadata = {
                    method: methodName,
                    executionTime,
                    success: true
                };
                if (options.includeResult) {
                    successMetadata.result = typeof result === 'object' ? '[Object]' : String(result);
                }
                if (options.includeExecutionTime) {
                    successMetadata.executionTime = executionTime;
                }
                const successMessage = options.customMessage
                    ? `${options.customMessage} completed`
                    : `${methodName} completed successfully`;
                logger.log(successMessage, 'MethodSuccess', successMetadata);
                return result;
            }
            catch (error) {
                const executionTime = Date.now() - startTime;
                const errorMetadata = {
                    method: methodName,
                    executionTime,
                    error: error.message,
                    stack: error.stack
                };
                logger.error(`${methodName} failed: ${error.message}`, error.stack, 'MethodError', errorMetadata);
                throw error;
            }
        };
        (0, common_1.SetMetadata)(exports.LOGGING_METADATA, { level, ...options })(target, propertyKey, descriptor);
    };
}
function LogController(options = {}) {
    return function (target) {
        const logger = new EnterpriseLogger();
        const controllerName = target.name;
        logger.log(`Controller ${controllerName} initialized`, 'ControllerInit', {
            controller: controllerName
        });
        (0, common_1.SetMetadata)(exports.LOGGING_METADATA, { controller: true, ...options })(target);
    };
}
function LogService(options = {}) {
    return function (target) {
        const logger = new EnterpriseLogger();
        const serviceName = target.name;
        logger.log(`Service ${serviceName} initialized`, 'ServiceInit', {
            service: serviceName
        });
        (0, common_1.SetMetadata)(exports.LOGGING_METADATA, { service: true, ...options })(target);
    };
}
function LogErrors(options = { rethrow: true }) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        const logger = new EnterpriseLogger();
        descriptor.value = async function (...args) {
            try {
                return await originalMethod.apply(this, args);
            }
            catch (error) {
                const errorMetadata = {
                    method: methodName,
                    error: error.message,
                    args: options.includeStack ? args : undefined,
                    stack: options.includeStack ? error.stack : undefined
                };
                logger.error(`Error in ${methodName}: ${error.message}`, options.includeStack ? error.stack : undefined, 'ErrorBoundary', errorMetadata);
                if (options.rethrow !== false) {
                    throw error;
                }
            }
        };
    };
}
//# sourceMappingURL=logging.decorators.js.map