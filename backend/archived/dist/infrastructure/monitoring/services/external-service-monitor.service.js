"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalServiceMonitorService = void 0;
const common_1 = require("@nestjs/common");
const https = __importStar(require("https"));
const http = __importStar(require("http"));
const url_1 = require("url");
const base_1 = require("../../../common/base");
var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "CLOSED";
    CircuitState["OPEN"] = "OPEN";
    CircuitState["HALF_OPEN"] = "HALF_OPEN";
})(CircuitState || (CircuitState = {}));
let ExternalServiceMonitorService = class ExternalServiceMonitorService extends base_1.BaseService {
    circuitBreakers = new Map();
    failureThreshold = 5;
    successThreshold = 2;
    timeout = 60000;
    constructor() {
        super("ExternalServiceMonitorService");
    }
    getCircuitBreaker(serviceName) {
        if (!this.circuitBreakers.has(serviceName)) {
            this.circuitBreakers.set(serviceName, {
                state: CircuitState.CLOSED,
                failureCount: 0,
                successCount: 0,
                lastFailureTime: 0,
                nextAttemptTime: 0,
            });
        }
        return this.circuitBreakers.get(serviceName);
    }
    canAttempt(breaker) {
        if (breaker.state === CircuitState.CLOSED) {
            return true;
        }
        if (breaker.state === CircuitState.OPEN) {
            if (Date.now() >= breaker.nextAttemptTime) {
                breaker.state = CircuitState.HALF_OPEN;
                breaker.successCount = 0;
                return true;
            }
            return false;
        }
        return true;
    }
    recordSuccess(breaker) {
        breaker.failureCount = 0;
        if (breaker.state === CircuitState.HALF_OPEN) {
            breaker.successCount++;
            if (breaker.successCount >= this.successThreshold) {
                breaker.state = CircuitState.CLOSED;
                this.logInfo('Circuit breaker CLOSED - service recovered');
            }
        }
    }
    recordFailure(breaker, serviceName) {
        breaker.failureCount++;
        breaker.lastFailureTime = Date.now();
        breaker.successCount = 0;
        if (breaker.state === CircuitState.HALF_OPEN) {
            breaker.state = CircuitState.OPEN;
            breaker.nextAttemptTime = Date.now() + this.timeout;
            this.logWarning(`Circuit breaker OPEN for ${serviceName} - service still failing`);
        }
        else if (breaker.failureCount >= this.failureThreshold) {
            breaker.state = CircuitState.OPEN;
            breaker.nextAttemptTime = Date.now() + this.timeout;
            this.logError(`Circuit breaker OPEN for ${serviceName} after ${breaker.failureCount} failures`);
        }
    }
    async checkExternalServicesHealth(timeout) {
        const services = [
            {
                name: 'auth_service',
                url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001/health',
            },
            {
                name: 'notification_service',
                url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3002/health',
            },
            {
                name: 'sis_integration',
                url: process.env.SIS_INTEGRATION_URL || 'http://localhost:3003/health',
            },
        ];
        const results = [];
        for (const service of services) {
            try {
                const healthInfo = await this.checkSingleService(service.name, service.url, timeout);
                results.push(healthInfo);
            }
            catch (error) {
                results.push({
                    name: service.name,
                    url: service.url,
                    status: 'DOWN',
                    responseTime: timeout,
                    lastChecked: new Date(),
                    lastError: error instanceof Error ? error.message : 'Unknown error',
                    consecutiveFailures: 1,
                });
            }
        }
        return results;
    }
    async checkSingleService(name, url, timeout) {
        const startTime = Date.now();
        const breaker = this.getCircuitBreaker(name);
        if (!this.canAttempt(breaker)) {
            const responseTime = Date.now() - startTime;
            return {
                name,
                url,
                status: 'DOWN',
                responseTime,
                lastChecked: new Date(),
                lastError: 'Circuit breaker OPEN - too many failures',
                consecutiveFailures: breaker.failureCount,
            };
        }
        try {
            const response = await this.performHttpCheck(url, timeout);
            const responseTime = Date.now() - startTime;
            this.recordSuccess(breaker);
            return {
                name,
                url,
                status: response.statusCode >= 200 && response.statusCode < 300 ? 'UP' : 'DEGRADED',
                responseTime,
                lastChecked: new Date(),
                consecutiveFailures: 0,
            };
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            this.recordFailure(breaker, name);
            throw new Error(`Service ${name} health check failed: ${error}`);
        }
    }
    async performHttpCheck(urlString, timeout) {
        return new Promise((resolve, reject) => {
            try {
                const parsedUrl = new url_1.URL(urlString);
                const isHttps = parsedUrl.protocol === 'https:';
                const client = isHttps ? https : http;
                const options = {
                    hostname: parsedUrl.hostname,
                    port: parsedUrl.port || (isHttps ? 443 : 80),
                    path: parsedUrl.pathname + parsedUrl.search,
                    method: 'GET',
                    timeout,
                    headers: {
                        'User-Agent': 'WhiteCross-HealthCheck/1.0',
                        'Accept': 'application/json',
                    },
                };
                const req = client.request(options, (res) => {
                    res.on('data', () => { });
                    res.on('end', () => {
                        resolve({ statusCode: res.statusCode || 500 });
                    });
                });
                req.on('error', (error) => {
                    reject(error);
                });
                req.on('timeout', () => {
                    req.destroy();
                    reject(new Error(`Request timeout after ${timeout}ms`));
                });
                req.end();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getCircuitBreakerStatus() {
        const status = [];
        for (const [serviceName, breaker] of this.circuitBreakers.entries()) {
            status.push({
                serviceName,
                state: breaker.state,
                failureCount: breaker.failureCount,
                successCount: breaker.successCount,
            });
        }
        return status;
    }
    resetCircuitBreaker(serviceName) {
        const breaker = this.circuitBreakers.get(serviceName);
        if (breaker) {
            breaker.state = CircuitState.CLOSED;
            breaker.failureCount = 0;
            breaker.successCount = 0;
            this.logInfo(`Circuit breaker manually reset for ${serviceName}`);
            return true;
        }
        return false;
    }
    getServiceHealthSummary(services) {
        const up = services.filter(s => s.status === 'UP').length;
        const down = services.filter(s => s.status === 'DOWN').length;
        const degraded = services.filter(s => s.status === 'DEGRADED').length;
        const totalResponseTime = services.reduce((sum, s) => sum + s.responseTime, 0);
        const averageResponseTime = services.length > 0 ? totalResponseTime / services.length : 0;
        return {
            total: services.length,
            up,
            down,
            degraded,
            averageResponseTime,
        };
    }
};
exports.ExternalServiceMonitorService = ExternalServiceMonitorService;
exports.ExternalServiceMonitorService = ExternalServiceMonitorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ExternalServiceMonitorService);
//# sourceMappingURL=external-service-monitor.service.js.map