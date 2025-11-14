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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextGuard = exports.ContextMiddleware = exports.ContextInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const request_context_service_1 = require("./request-context.service");
const base_interceptor_1 = require("../interceptors/base.interceptor");
let ContextInterceptor = class ContextInterceptor extends base_interceptor_1.BaseInterceptor {
    contextService;
    constructor(contextService) {
        super();
        this.contextService = contextService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const requestContext = this.contextInitializer.createContext(request);
        this.logRequest('debug', `Request context initialized: ${requestContext.correlationId}`, {
            method: requestContext.request.method,
            url: requestContext.request.url,
            correlationId: requestContext.correlationId,
        });
        return request_context_service_1.RequestContextService.run(requestContext, async () => {
            return next.handle().pipe((0, operators_1.tap)(() => {
                request_context_service_1.RequestContextService.setResponseMetadata(response.statusCode);
                const duration = request_context_service_1.RequestContextService.getRequestDuration();
                this.logResponse('debug', `Request completed: ${requestContext.correlationId}`, {
                    statusCode: response.statusCode,
                    duration,
                    correlationId: requestContext.correlationId,
                });
            }), (0, operators_1.catchError)((error) => {
                request_context_service_1.RequestContextService.setResponseMetadata(error.status || 500);
                const duration = request_context_service_1.RequestContextService.getRequestDuration();
                this.logError(`Request failed: ${requestContext.correlationId}`, error, {
                    statusCode: error.status || 500,
                    duration,
                    correlationId: requestContext.correlationId,
                });
                throw error;
            }));
        });
    }
};
exports.ContextInterceptor = ContextInterceptor;
exports.ContextInterceptor = ContextInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService])
], ContextInterceptor);
let ContextMiddleware = class ContextMiddleware {
    contextService;
    constructor(contextService) {
        this.contextService = contextService;
    }
    use(req, res, next) {
        next();
    }
};
exports.ContextMiddleware = ContextMiddleware;
exports.ContextMiddleware = ContextMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService])
], ContextMiddleware);
const core_1 = require("@nestjs/core");
let ContextGuard = class ContextGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requestContext = request_context_service_1.RequestContextService.current;
        if (!requestContext) {
            return false;
        }
        const requiredPermissions = this.reflector.get('permissions', context.getHandler());
        if (requiredPermissions) {
            const user = request_context_service_1.RequestContextService.getCurrentUser();
            if (!user) {
                return false;
            }
            const hasAllPermissions = requiredPermissions.every(permission => user.permissions.includes(permission));
            if (!hasAllPermissions) {
                return false;
            }
        }
        const requiredRoles = this.reflector.get('roles', context.getHandler());
        if (requiredRoles) {
            const user = request_context_service_1.RequestContextService.getCurrentUser();
            if (!user) {
                return false;
            }
            const hasAllRoles = requiredRoles.every(role => user.roles.includes(role));
            if (!hasAllRoles) {
                return false;
            }
        }
        return true;
    }
};
exports.ContextGuard = ContextGuard;
exports.ContextGuard = ContextGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], ContextGuard);
//# sourceMappingURL=context.interceptor.js.map