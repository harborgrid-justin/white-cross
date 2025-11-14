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
exports.SecurityLoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const threat_detection_service_1 = require("../services/threat-detection.service");
const base_interceptor_1 = require("../../../common/interceptors/base.interceptor");
let SecurityLoggingInterceptor = class SecurityLoggingInterceptor extends base_interceptor_1.BaseInterceptor {
    threatDetectionService;
    constructor(threatDetectionService) {
        super();
        this.threatDetectionService = threatDetectionService;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const startTime = Date.now();
        const { userId } = this.getUserContext(request);
        const { handler, controller } = this.getHandlerInfo(context);
        const securityContext = {
            userId,
            ipAddress: this.getClientIp(request),
            userAgent: request.headers['user-agent'],
            requestPath: request.url,
            requestMethod: request.method,
            timestamp: new Date(),
        };
        this.logRequest('info', `Security interception started for ${controller}.${handler}`, {
            controller,
            handler,
            userId,
            ipAddress: securityContext.ipAddress,
            requestPath: securityContext.requestPath,
            requestMethod: securityContext.requestMethod,
        });
        await this.performThreatDetection(request, securityContext);
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const { duration, durationMs } = this.getDurationString(startTime);
                this.logResponse('info', `Security request completed for ${controller}.${handler}`, {
                    controller,
                    handler,
                    userId,
                    duration,
                    durationMs,
                    status: 'success',
                });
            },
            error: (error) => {
                const { duration, durationMs } = this.getDurationString(startTime);
                this.logError(`Security request failed in ${controller}.${handler}`, error, {
                    controller,
                    handler,
                    userId,
                    duration,
                    durationMs,
                    status: 'error',
                });
            },
        }));
    }
    async performThreatDetection(request, context) {
        try {
            const queryString = JSON.stringify(request.query);
            if (queryString.length > 2) {
                await this.threatDetectionService.scanInput(queryString, context);
            }
            if (request.body && Object.keys(request.body).length > 0) {
                const bodyString = JSON.stringify(request.body);
                await this.threatDetectionService.scanInput(bodyString, context);
            }
        }
        catch (error) {
            this.logError('Error in threat detection', error);
        }
    }
};
exports.SecurityLoggingInterceptor = SecurityLoggingInterceptor;
exports.SecurityLoggingInterceptor = SecurityLoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [threat_detection_service_1.ThreatDetectionService])
], SecurityLoggingInterceptor);
//# sourceMappingURL=security-logging.interceptor.js.map