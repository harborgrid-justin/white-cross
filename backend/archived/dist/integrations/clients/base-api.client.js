"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApiClient = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const interfaces_1 = require("../interfaces");
class BaseApiClient {
    name;
    baseURL;
    httpService;
    logger;
    config;
    circuitState = interfaces_1.CircuitState.CLOSED;
    failureCount = 0;
    successCount = 0;
    nextAttempt = Date.now();
    circuitConfig = {
        failureThreshold: 5,
        successThreshold: 2,
        timeout: 60000,
    };
    requestTimestamps = [];
    rateLimitConfig = {
        maxRequests: 100,
        windowMs: 60000,
    };
    constructor(name, baseURL, httpService, logger, config) {
        this.name = name;
        this.baseURL = baseURL;
        this.httpService = httpService;
        this.logger = logger;
        this.config = {
            timeout: config?.timeout || 30000,
            headers: config?.headers || {},
            retryAttempts: config?.retryAttempts || 3,
            retryDelay: config?.retryDelay || 1000,
            ...config,
        };
        if (config?.circuitBreaker) {
            this.circuitConfig = {
                ...this.circuitConfig,
                ...config.circuitBreaker,
            };
        }
        if (config?.rateLimit) {
            this.rateLimitConfig = {
                ...this.rateLimitConfig,
                ...config.rateLimit,
            };
        }
    }
    checkCircuitBreaker() {
        if (this.circuitState === interfaces_1.CircuitState.OPEN) {
            if (Date.now() < this.nextAttempt) {
                const retryAfter = new Date(this.nextAttempt).toISOString();
                throw new Error(`Circuit breaker is OPEN for ${this.name} API. Retry after ${retryAfter}`);
            }
            this.circuitState = interfaces_1.CircuitState.HALF_OPEN;
            this.successCount = 0;
            this.logger.log(`${this.name} API circuit breaker: OPEN -> HALF_OPEN`, BaseApiClient.name);
        }
    }
    recordSuccess() {
        this.failureCount = 0;
        if (this.circuitState === interfaces_1.CircuitState.HALF_OPEN) {
            this.successCount++;
            if (this.successCount >= this.circuitConfig.successThreshold) {
                this.circuitState = interfaces_1.CircuitState.CLOSED;
                this.successCount = 0;
                this.logger.log(`${this.name} API circuit breaker: HALF_OPEN -> CLOSED`, BaseApiClient.name);
            }
        }
    }
    recordFailure() {
        this.failureCount++;
        if (this.failureCount >= this.circuitConfig.failureThreshold) {
            this.circuitState = interfaces_1.CircuitState.OPEN;
            this.nextAttempt = Date.now() + this.circuitConfig.timeout;
            this.logger.error(`${this.name} API circuit breaker: CLOSED -> OPEN. ` +
                `Failures: ${this.failureCount}, Next attempt: ${new Date(this.nextAttempt).toISOString()}`, undefined, BaseApiClient.name);
        }
    }
    checkRateLimit() {
        const now = Date.now();
        const windowStart = now - this.rateLimitConfig.windowMs;
        this.requestTimestamps = this.requestTimestamps.filter((ts) => ts > windowStart);
        if (this.requestTimestamps.length >= this.rateLimitConfig.maxRequests) {
            const oldestTimestamp = this.requestTimestamps[0];
            const waitTime = oldestTimestamp + this.rateLimitConfig.windowMs - now;
            throw new Error(`Rate limit exceeded for ${this.name} API. ` +
                `Max ${this.rateLimitConfig.maxRequests} requests per ${this.rateLimitConfig.windowMs}ms. ` +
                `Retry after ${waitTime}ms`);
        }
        this.requestTimestamps.push(now);
    }
    buildUrl(url) {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        const baseUrl = this.baseURL.endsWith('/')
            ? this.baseURL.slice(0, -1)
            : this.baseURL;
        const path = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${path}`;
    }
    async request(config) {
        this.checkCircuitBreaker();
        this.checkRateLimit();
        const url = this.buildUrl(config.url || '');
        const requestConfig = {
            ...config,
            url,
            timeout: config.timeout || this.config.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...this.config.headers,
                ...config.headers,
            },
        };
        this.logger.debug(`${this.name} API request: ${requestConfig.method?.toUpperCase()} ${url}`, BaseApiClient.name);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.request(requestConfig).pipe((0, operators_1.retry)({
                count: this.config.retryAttempts,
                delay: (error, retryCount) => {
                    const shouldRetry = !error.response ||
                        (error.response.status >= 500 && error.response.status < 600);
                    if (shouldRetry) {
                        const delayMs = this.config.retryDelay * Math.pow(2, retryCount - 1);
                        this.logger.warn(`${this.name} API retry attempt ${retryCount} after ${delayMs}ms. Error: ${error.message}`, BaseApiClient.name);
                        return (0, rxjs_1.throwError)(() => error).pipe((0, operators_1.delay)(delayMs));
                    }
                    return (0, rxjs_1.throwError)(() => error);
                },
            }), (0, operators_1.map)((response) => {
                this.logger.debug(`${this.name} API response: ${response.status} ${url}`, BaseApiClient.name);
                return response;
            }), (0, operators_1.catchError)((error) => {
                this.logger.error(`${this.name} API error: ${error.message} ${url}`, error.stack, BaseApiClient.name);
                return (0, rxjs_1.throwError)(() => error);
            })));
            this.recordSuccess();
            return response;
        }
        catch (error) {
            this.recordFailure();
            throw error;
        }
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
    getCircuitStatus() {
        return {
            state: this.circuitState,
            failures: this.failureCount,
            nextAttempt: this.circuitState === interfaces_1.CircuitState.OPEN
                ? new Date(this.nextAttempt)
                : undefined,
        };
    }
    getRateLimitStatus() {
        const now = Date.now();
        const windowStart = now - this.rateLimitConfig.windowMs;
        const currentRequests = this.requestTimestamps.filter((ts) => ts > windowStart).length;
        return {
            current: currentRequests,
            max: this.rateLimitConfig.maxRequests,
            window: this.rateLimitConfig.windowMs,
        };
    }
    resetCircuitBreaker() {
        this.circuitState = interfaces_1.CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.logger.log(`${this.name} API circuit breaker reset to CLOSED`, BaseApiClient.name);
    }
}
exports.BaseApiClient = BaseApiClient;
//# sourceMappingURL=base-api.client.js.map