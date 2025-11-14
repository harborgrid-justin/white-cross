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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedBaseApiClient = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const circuit_breaker_service_1 = require("../services/circuit-breaker.service");
const rate_limiter_service_1 = require("../services/rate-limiter.service");
let EnhancedBaseApiClient = class EnhancedBaseApiClient {
    circuitBreaker;
    rateLimiter;
    client;
    logger;
    serviceName;
    constructor(serviceName, baseURL, circuitBreaker, rateLimiter, config) {
        this.circuitBreaker = circuitBreaker;
        this.rateLimiter = rateLimiter;
        this.serviceName = serviceName;
        this.logger = new common_1.Logger(`${serviceName}ApiClient`);
        this.client = axios_1.default.create({
            baseURL,
            timeout: config?.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers,
            },
        });
        this.circuitBreaker.initialize(serviceName, config?.circuitBreaker);
        this.rateLimiter.initialize(serviceName, config?.rateLimit);
        (0, axios_retry_1.default)(this.client, {
            retries: config?.retryAttempts || 3,
            retryDelay: axios_retry_1.default.exponentialDelay,
            retryCondition: (error) => {
                return (axios_retry_1.default.isNetworkOrIdempotentRequestError(error) ||
                    (error.response?.status !== undefined && error.response.status >= 500));
            },
            onRetry: (retryCount, error, requestConfig) => {
                this.logger.warn(`${this.serviceName} API retry attempt ${retryCount}`, {
                    url: requestConfig.url,
                    method: requestConfig.method,
                    error: error.message,
                });
            },
        });
        this.client.interceptors.request.use((config) => {
            this.logger.debug(`${this.serviceName} API request`, {
                method: config.method,
                url: config.url,
                params: config.params,
            });
            return config;
        }, (error) => {
            this.logger.error(`${this.serviceName} API request error`, error);
            return Promise.reject(error);
        });
        this.client.interceptors.response.use((response) => {
            this.logger.debug(`${this.serviceName} API response`, {
                status: response.status,
                url: response.config.url,
            });
            return response;
        }, (error) => {
            this.logger.error(`${this.serviceName} API response error`, {
                status: error.response?.status,
                message: error.message,
                url: error.config?.url,
            });
            return Promise.reject(error);
        });
    }
    async request(config) {
        await this.rateLimiter.checkLimit(this.serviceName);
        return this.circuitBreaker.execute(this.serviceName, async () => {
            return this.client.request(config);
        });
    }
    async get(url, config) {
        return this.request({ ...config, method: 'GET', url });
    }
    async post(url, data, config) {
        return this.request({ ...config, method: 'POST', url, data });
    }
    async put(url, data, config) {
        return this.request({ ...config, method: 'PUT', url, data });
    }
    async delete(url, config) {
        return this.request({ ...config, method: 'DELETE', url });
    }
    async patch(url, data, config) {
        return this.request({ ...config, method: 'PATCH', url, data });
    }
    getCircuitStatus() {
        return this.circuitBreaker.getStatus(this.serviceName);
    }
    getRateLimitStatus() {
        return this.rateLimiter.getStatus(this.serviceName);
    }
    resetCircuitBreaker() {
        this.circuitBreaker.reset(this.serviceName);
    }
    resetRateLimiter() {
        this.rateLimiter.reset(this.serviceName);
    }
};
exports.EnhancedBaseApiClient = EnhancedBaseApiClient;
exports.EnhancedBaseApiClient = EnhancedBaseApiClient = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String, String, circuit_breaker_service_1.CircuitBreakerService,
        rate_limiter_service_1.RateLimiterService, Object])
], EnhancedBaseApiClient);
//# sourceMappingURL=enhanced-base-api-client.js.map