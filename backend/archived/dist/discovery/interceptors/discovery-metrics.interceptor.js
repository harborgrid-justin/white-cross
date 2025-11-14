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
exports.DiscoveryMetricsInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const discovery_metrics_service_1 = require("../services/discovery-metrics.service");
const base_interceptor_1 = require("../../common/interceptors/base.interceptor");
let DiscoveryMetricsInterceptor = class DiscoveryMetricsInterceptor extends base_interceptor_1.BaseInterceptor {
    metricsService;
    constructor(metricsService) {
        this.metricsService = metricsService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const startTime = process.hrtime.bigint();
        const { method, url, route } = request;
        const user = this.getUserContext(context);
        const endpoint = route?.path || url;
        this.metricsService.incrementCounter('discovery_requests_total', {
            method,
            endpoint,
            user_role: user?.role || 'anonymous',
        });
        return next.handle().pipe((0, operators_1.tap)({
            next: (responseData) => {
                const duration = this.calculateDuration(startTime);
                const statusCode = response.statusCode;
                this.recordSuccessMetrics(method, endpoint, duration, statusCode, responseData, user);
            },
            error: (error) => {
                const duration = this.calculateDuration(startTime);
                const statusCode = error.status || 500;
                this.recordErrorMetrics(method, endpoint, duration, statusCode, error, user);
            },
        }), (0, operators_1.catchError)((error) => {
            throw error;
        }));
    }
    calculateDuration(startTime) {
        return Number(process.hrtime.bigint() - startTime) / 1000000;
    }
    recordSuccessMetrics(method, endpoint, duration, statusCode, responseData, user) {
        const labels = {
            method,
            endpoint,
            status: 'success',
            status_code: statusCode.toString(),
        };
        this.metricsService.recordHistogram('discovery_request_duration_ms', duration, labels);
        if (responseData) {
            const responseSize = this.calculateResponseSize(responseData);
            this.metricsService.recordHistogram('discovery_response_size_bytes', responseSize, {
                endpoint,
                method,
            });
        }
        this.metricsService.incrementCounter('discovery_response_status_total', {
            method,
            endpoint,
            status_code: statusCode.toString(),
        });
        if (user) {
            this.metricsService.incrementCounter('discovery_user_requests_total', {
                user_role: user.role || 'unknown',
                endpoint,
            });
        }
        if (duration > 1000) {
            this.metricsService.incrementCounter('discovery_slow_requests_total', {
                method,
                endpoint,
                category: 'very_slow',
            });
        }
        else if (duration > 500) {
            this.metricsService.incrementCounter('discovery_slow_requests_total', {
                method,
                endpoint,
                category: 'slow',
            });
        }
    }
    recordErrorMetrics(method, endpoint, duration, statusCode, error, user) {
        const labels = {
            method,
            endpoint,
            status: 'error',
            status_code: statusCode.toString(),
            error_type: error.constructor.name,
        };
        this.metricsService.incrementCounter('discovery_errors_total', labels);
        this.metricsService.recordHistogram('discovery_request_duration_ms', duration, {
            method,
            endpoint,
            status: 'error',
        });
        const errorCategory = this.categorizeError(statusCode);
        this.metricsService.incrementCounter('discovery_errors_by_category_total', {
            method,
            endpoint,
            category: errorCategory,
        });
        if (user) {
            this.metricsService.incrementCounter('discovery_user_errors_total', {
                user_role: user.role || 'unknown',
                endpoint,
                error_type: error.constructor.name,
            });
        }
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
    categorizeError(statusCode) {
        if (statusCode >= 400 && statusCode < 500) {
            return 'client_error';
        }
        else if (statusCode >= 500) {
            return 'server_error';
        }
        else {
            return 'unknown';
        }
    }
};
exports.DiscoveryMetricsInterceptor = DiscoveryMetricsInterceptor;
exports.DiscoveryMetricsInterceptor = DiscoveryMetricsInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [discovery_metrics_service_1.DiscoveryMetricsService])
], DiscoveryMetricsInterceptor);
//# sourceMappingURL=discovery-metrics.interceptor.js.map