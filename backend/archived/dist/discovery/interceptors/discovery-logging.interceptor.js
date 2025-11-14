"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryLoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const base_interceptor_1 = require("../../common/interceptors/base.interceptor");
let DiscoveryLoggingInterceptor = class DiscoveryLoggingInterceptor extends base_interceptor_1.BaseInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, url } = request;
        const correlationId = this.getOrGenerateRequestId(request);
        request.headers['x-correlation-id'] = correlationId;
        this.setRequestIdHeader(response, correlationId);
        const startTime = Date.now();
        const user = this.getUserContext(context);
        this.logRequest('log', `Discovery API Request Started: ${method} ${url}`, {
            correlationId,
            method,
            url,
            userId: user?.id,
            userRole: user?.role,
        });
        return next.handle().pipe((0, operators_1.tap)({
            next: (responseData) => {
                const duration = Date.now() - startTime;
                const responseSize = this.calculateResponseSize(responseData);
                const statusCode = response.statusCode;
                this.logResponse('log', `Discovery API Request Completed: ${method} ${url} - ${statusCode} (${duration}ms)`, {
                    correlationId,
                    duration,
                    responseSize,
                    statusCode,
                    success: true,
                });
                if (duration > 1000) {
                    this.logRequest('warn', `Slow Discovery API Request: ${method} ${url} took ${duration}ms`, {
                        correlationId,
                        method,
                        url,
                        duration,
                    });
                }
            },
            error: (error) => {
                const duration = Date.now() - startTime;
                const statusCode = error.status || 500;
                this.logError(`Discovery API Request Failed: ${method} ${url} - ${statusCode} (${duration}ms)`, error, {
                    correlationId,
                    method,
                    url,
                    duration,
                    statusCode,
                    success: false,
                });
            },
        }), (0, operators_1.catchError)((error) => {
            throw error;
        }));
    }
    calculateResponseSize(data) {
        if (!data)
            return 0;
        try {
            return JSON.stringify(data).length;
        }
        catch {
            return 0;
        }
    }
};
exports.DiscoveryLoggingInterceptor = DiscoveryLoggingInterceptor;
exports.DiscoveryLoggingInterceptor = DiscoveryLoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], DiscoveryLoggingInterceptor);
//# sourceMappingURL=discovery-logging.interceptor.js.map