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
exports.CircuitBreakerService = exports.CircuitState = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "CLOSED";
    CircuitState["OPEN"] = "OPEN";
    CircuitState["HALF_OPEN"] = "HALF_OPEN";
})(CircuitState || (exports.CircuitState = CircuitState = {}));
let CircuitBreakerService = class CircuitBreakerService extends base_1.BaseService {
    constructor() {
        super("CircuitBreakerService");
    }
    circuits = new Map();
    initialize(serviceName, config = {}) {
        const defaultConfig = {
            failureThreshold: 5,
            successThreshold: 2,
            timeout: 60000,
        };
        this.circuits.set(serviceName, {
            state: CircuitState.CLOSED,
            failureCount: 0,
            successCount: 0,
            nextAttempt: Date.now(),
            config: { ...defaultConfig, ...config },
        });
        this.logInfo(`Circuit breaker initialized for ${serviceName}`);
    }
    async execute(serviceName, fn) {
        if (!this.circuits.has(serviceName)) {
            this.initialize(serviceName);
        }
        const circuit = this.circuits.get(serviceName);
        if (circuit.state === CircuitState.OPEN) {
            if (Date.now() < circuit.nextAttempt) {
                throw new Error(`Circuit breaker is OPEN for ${serviceName}. Retry after ${new Date(circuit.nextAttempt).toISOString()}`);
            }
            circuit.state = CircuitState.HALF_OPEN;
            circuit.successCount = 0;
            this.logInfo(`${serviceName} circuit breaker: OPEN -> HALF_OPEN`);
        }
        try {
            const result = await fn();
            this.recordSuccess(serviceName);
            return result;
        }
        catch (error) {
            this.recordFailure(serviceName);
            throw error;
        }
    }
    recordSuccess(serviceName) {
        const circuit = this.circuits.get(serviceName);
        if (!circuit)
            return;
        circuit.failureCount = 0;
        if (circuit.state === CircuitState.HALF_OPEN) {
            circuit.successCount++;
            if (circuit.successCount >= circuit.config.successThreshold) {
                circuit.state = CircuitState.CLOSED;
                circuit.successCount = 0;
                this.logInfo(`${serviceName} circuit breaker: HALF_OPEN -> CLOSED`);
            }
        }
    }
    recordFailure(serviceName) {
        const circuit = this.circuits.get(serviceName);
        if (!circuit)
            return;
        circuit.failureCount++;
        if (circuit.failureCount >= circuit.config.failureThreshold) {
            circuit.state = CircuitState.OPEN;
            circuit.nextAttempt = Date.now() + circuit.config.timeout;
            this.logError(`${serviceName} circuit breaker: CLOSED -> OPEN`, {
                failures: circuit.failureCount,
                nextAttempt: new Date(circuit.nextAttempt).toISOString(),
            });
        }
    }
    getStatus(serviceName) {
        const circuit = this.circuits.get(serviceName);
        if (!circuit)
            return null;
        return {
            state: circuit.state,
            failures: circuit.failureCount,
            nextAttempt: circuit.state === CircuitState.OPEN
                ? new Date(circuit.nextAttempt)
                : undefined,
        };
    }
    reset(serviceName) {
        const circuit = this.circuits.get(serviceName);
        if (!circuit)
            return;
        circuit.state = CircuitState.CLOSED;
        circuit.failureCount = 0;
        circuit.successCount = 0;
        this.logInfo(`${serviceName} circuit breaker reset to CLOSED`);
    }
};
exports.CircuitBreakerService = CircuitBreakerService;
exports.CircuitBreakerService = CircuitBreakerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CircuitBreakerService);
//# sourceMappingURL=circuit-breaker.service.js.map