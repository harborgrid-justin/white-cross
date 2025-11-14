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
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const base_interceptor_1 = require("./base.interceptor");
let LoggingInterceptor = class LoggingInterceptor extends base_interceptor_1.BaseInterceptor {
    constructor() {
        super();
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const requestId = this.getOrGenerateRequestId(request);
        this.setRequestIdHeader(response, requestId);
        const { method, url, body, query, params } = request;
        const userAgent = request.headers['user-agent'] || 'unknown';
        const { userId, organizationId } = this.getUserContext(request);
        const ipAddress = this.getClientIp(request);
        const startTime = Date.now();
        this.logRequest('info', `${method} ${url}`, {
            requestId,
            method,
            url,
            userId,
            organizationId,
            userAgent,
            ipAddress,
            body: this.redactSensitiveData(body),
            query: this.redactSensitiveData(query),
            params: this.redactSensitiveData(params),
        });
        this.addSentryBreadcrumb(`${method} ${url}`, 'http.request', 'info', {
            requestId,
            method,
            url,
            userId: userId !== 'anonymous' ? userId : undefined,
        });
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const { duration, durationMs } = this.getDurationString(startTime);
                this.logResponse('info', `${method} ${url} - ${response.statusCode}`, {
                    requestId,
                    method,
                    url,
                    statusCode: response.statusCode,
                    duration,
                    durationMs,
                    userId,
                    organizationId,
                });
                this.addSentryBreadcrumb(`${method} ${url} - ${response.statusCode}`, 'http.response', 'info', {
                    requestId,
                    statusCode: response.statusCode,
                    duration,
                });
            },
            error: (error) => {
                const { duration, durationMs } = this.getDurationString(startTime);
                const statusCode = error.status || 500;
                this.logError(`${method} ${url} - ${statusCode}`, error, {
                    requestId,
                    method,
                    url,
                    statusCode,
                    duration,
                    durationMs,
                    userId,
                    organizationId,
                });
                if (statusCode >= 500) {
                    this.reportToSentry(error, {
                        userId: userId !== 'anonymous' ? userId : undefined,
                        organizationId,
                        tags: {
                            method,
                            url,
                            statusCode: String(statusCode),
                        },
                        extra: {
                            requestId,
                            duration,
                            userAgent,
                        },
                    });
                }
            },
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map