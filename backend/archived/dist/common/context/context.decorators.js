"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextProperty = exports.CurrentUser = exports.CorrelationId = exports.Context = void 0;
exports.RequirePermissions = RequirePermissions;
exports.RequireRoles = RequireRoles;
exports.RequireFacility = RequireFacility;
exports.AuditAction = AuditAction;
exports.ContextLog = ContextLog;
exports.TraceRequest = TraceRequest;
const common_1 = require("@nestjs/common");
const request_context_service_1 = require("./request-context.service");
exports.Context = (0, common_1.createParamDecorator)((data, ctx) => {
    return request_context_service_1.RequestContextService.current;
});
exports.CorrelationId = (0, common_1.createParamDecorator)((data, ctx) => {
    return request_context_service_1.RequestContextService.getCorrelationId();
});
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    return request_context_service_1.RequestContextService.getCurrentUser();
});
exports.ContextProperty = (0, common_1.createParamDecorator)((propertyKey, ctx) => {
    return request_context_service_1.RequestContextService.getCustomProperty(propertyKey);
});
function RequirePermissions(...permissions) {
    return (0, common_1.SetMetadata)('permissions', permissions);
}
function RequireRoles(...roles) {
    return (0, common_1.SetMetadata)('roles', roles);
}
function RequireFacility(facilityId) {
    return (0, common_1.SetMetadata)('facility', facilityId);
}
function AuditAction(action, resource) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            request_context_service_1.RequestContextService.addAuditEntry(action, resource, {
                method: propertyKey,
                args: args.length,
            });
            try {
                const result = await originalMethod.apply(this, args);
                request_context_service_1.RequestContextService.addAuditEntry(`${action}_success`, resource, {
                    method: propertyKey,
                    success: true,
                });
                return result;
            }
            catch (error) {
                request_context_service_1.RequestContextService.addAuditEntry(`${action}_failed`, resource, {
                    method: propertyKey,
                    error: error.message,
                    success: false,
                });
                throw error;
            }
        };
    };
}
function ContextLog(level = 'info') {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const correlationId = request_context_service_1.RequestContextService.getCorrelationId();
            const user = request_context_service_1.RequestContextService.getCurrentUser();
            const logContext = {
                method: methodName,
                correlationId,
                userId: user?.id,
                timestamp: new Date().toISOString(),
            };
            console[level](`[${level.toUpperCase()}] ${methodName}`, logContext);
            try {
                const result = await originalMethod.apply(this, args);
                if (level === 'debug') {
                    console.debug(`[DEBUG] ${methodName} completed`, {
                        ...logContext,
                        duration: request_context_service_1.RequestContextService.getRequestDuration(),
                    });
                }
                return result;
            }
            catch (error) {
                console.error(`[ERROR] ${methodName} failed`, {
                    ...logContext,
                    error: error.message,
                    stack: error.stack,
                });
                throw error;
            }
        };
    };
}
function TraceRequest(operation) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const correlationId = request_context_service_1.RequestContextService.getCorrelationId();
            const startTime = Date.now();
            request_context_service_1.RequestContextService.setCustomProperty('currentOperation', operation);
            console.log(`[TRACE] Starting ${operation}`, {
                correlationId,
                operation,
                timestamp: new Date().toISOString(),
            });
            try {
                const result = await originalMethod.apply(this, args);
                const duration = Date.now() - startTime;
                console.log(`[TRACE] Completed ${operation}`, {
                    correlationId,
                    operation,
                    duration,
                    timestamp: new Date().toISOString(),
                });
                return result;
            }
            catch (error) {
                const duration = Date.now() - startTime;
                console.error(`[TRACE] Failed ${operation}`, {
                    correlationId,
                    operation,
                    duration,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
                throw error;
            }
            finally {
                request_context_service_1.RequestContextService.setCustomProperty('currentOperation', undefined);
            }
        };
    };
}
//# sourceMappingURL=context.decorators.js.map