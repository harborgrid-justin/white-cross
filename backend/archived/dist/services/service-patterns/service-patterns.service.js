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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRateLimiter = exports.ServiceDependencyGraph = exports.Transaction = exports.TransactionCoordinator = exports.RequestContext = exports.ServiceMetrics = exports.RetryPolicy = exports.CircuitBreaker = exports.CircuitBreakerState = exports.ServiceHealthMonitor = exports.EventHandlerRegistry = exports.DomainEventPublisher = exports.EventSourcedAggregate = exports.SagaOrchestrator = exports.ServiceOrchestrator = exports.InfrastructureService = exports.ApplicationService = exports.DomainService = exports.RepositoryService = void 0;
exports.createCommandHandler = createCommandHandler;
exports.createQueryHandler = createQueryHandler;
exports.createEventHandler = createEventHandler;
exports.createSagaStep = createSagaStep;
exports.createCircuitBreaker = createCircuitBreaker;
exports.createRetryPolicy = createRetryPolicy;
exports.WithCircuitBreaker = WithCircuitBreaker;
exports.WithRetry = WithRetry;
exports.Cacheable = Cacheable;
exports.TrackMetrics = TrackMetrics;
exports.createRequestContext = createRequestContext;
exports.createDependencyGraph = createDependencyGraph;
exports.createRateLimiter = createRateLimiter;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const event_emitter_1 = require("@nestjs/event-emitter");
class RepositoryService {
    repository;
    logger;
    constructor(serviceName, repository) {
        this.repository = repository;
        this.logger = new common_1.Logger(serviceName);
    }
}
exports.RepositoryService = RepositoryService;
class DomainService {
    logger;
    domainEvents = [];
    constructor(serviceName) {
        this.logger = new common_1.Logger(serviceName);
    }
    addDomainEvent(event) {
        this.domainEvents.push(event);
        this.logger.debug(`Domain event added: ${event.constructor.name}`);
    }
    clearDomainEvents() {
        const events = [...this.domainEvents];
        this.domainEvents = [];
        return events;
    }
    getDomainEvents() {
        return [...this.domainEvents];
    }
}
exports.DomainService = DomainService;
let ApplicationService = class ApplicationService {
    transactionManager;
    logger;
    constructor(serviceName, transactionManager) {
        this.transactionManager = transactionManager;
        this.logger = new common_1.Logger(serviceName);
    }
    async executeInTransaction(operation) {
        if (!this.transactionManager) {
            return operation();
        }
        return this.transactionManager.transaction(async () => {
            return operation();
        });
    }
};
exports.ApplicationService = ApplicationService;
exports.ApplicationService = ApplicationService = __decorate([
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)('TRANSACTION_MANAGER')),
    __metadata("design:paramtypes", [String, Object])
], ApplicationService);
class InfrastructureService {
    logger;
    retryAttempts = 3;
    retryDelayMs = 1000;
    constructor(serviceName) {
        this.logger = new common_1.Logger(serviceName);
    }
    async withRetry(operation, attempts = this.retryAttempts) {
        let lastError;
        for (let i = 0; i < attempts; i++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                this.logger.warn(`Attempt ${i + 1}/${attempts} failed: ${error.message}`);
                if (i < attempts - 1) {
                    await this.delay(this.retryDelayMs * Math.pow(2, i));
                }
            }
        }
        throw lastError;
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.InfrastructureService = InfrastructureService;
function createCommandHandler(commandType, handler) {
    let GenericCommandHandler = class GenericCommandHandler {
        async execute(command) {
            return handler(command);
        }
    };
    GenericCommandHandler = __decorate([
        (0, cqrs_1.CommandHandler)(commandType)
    ], GenericCommandHandler);
    return GenericCommandHandler;
}
function createQueryHandler(queryType, handler) {
    let GenericQueryHandler = class GenericQueryHandler {
        async execute(query) {
            return handler(query);
        }
    };
    GenericQueryHandler = __decorate([
        (0, cqrs_1.QueryHandler)(queryType)
    ], GenericQueryHandler);
    return GenericQueryHandler;
}
function createEventHandler(eventType, handler) {
    let GenericEventHandler = class GenericEventHandler {
        async handle(event) {
            return handler(event);
        }
    };
    GenericEventHandler = __decorate([
        (0, cqrs_1.EventsHandler)(eventType)
    ], GenericEventHandler);
    return GenericEventHandler;
}
let ServiceOrchestrator = class ServiceOrchestrator {
    logger;
    services = new Map();
    constructor() {
        this.logger = new common_1.Logger('ServiceOrchestrator');
    }
    registerService(name, service) {
        this.services.set(name, service);
        this.logger.debug(`Service registered: ${name}`);
    }
    getService(name) {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Service not found: ${name}`);
        }
        return service;
    }
    hasService(name) {
        return this.services.has(name);
    }
    async executeWorkflow(steps) {
        const results = [];
        for (const step of steps) {
            const result = await step(this);
            results.push(result);
        }
        return results[results.length - 1];
    }
};
exports.ServiceOrchestrator = ServiceOrchestrator;
exports.ServiceOrchestrator = ServiceOrchestrator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ServiceOrchestrator);
class SagaOrchestrator {
    logger;
    steps = [];
    completedSteps = [];
    constructor(sagaName) {
        this.logger = new common_1.Logger(sagaName);
    }
    addStep(step) {
        this.steps.push(step);
    }
    async execute(context) {
        this.logger.log(`Starting saga: ${this.constructor.name}`);
        try {
            for (const step of this.steps) {
                this.logger.debug(`Executing step: ${step.name}`);
                await step.execute(context);
                this.completedSteps.push(step);
            }
            this.logger.log('Saga completed successfully');
            return context.result;
        }
        catch (error) {
            this.logger.error(`Saga failed: ${error.message}`, error.stack);
            await this.compensate(context);
            throw error;
        }
    }
    async compensate(context) {
        this.logger.warn('Starting compensation...');
        const stepsToCompensate = [...this.completedSteps].reverse();
        for (const step of stepsToCompensate) {
            if (step.compensate) {
                try {
                    this.logger.debug(`Compensating step: ${step.name}`);
                    await step.compensate(context);
                }
                catch (error) {
                    this.logger.error(`Compensation failed for ${step.name}: ${error.message}`);
                }
            }
        }
        this.logger.warn('Compensation complete');
    }
}
exports.SagaOrchestrator = SagaOrchestrator;
function createSagaStep(name, execute, compensate) {
    return { name, execute, compensate };
}
class EventSourcedAggregate {
    state;
    uncommittedEvents = [];
    version = 0;
    constructor(state) {
        this.state = state;
    }
    applyEvent(event) {
        this.uncommittedEvents.push(event);
        this.mutateState(event);
        this.version++;
    }
    getUncommittedEvents() {
        return [...this.uncommittedEvents];
    }
    markEventsAsCommitted() {
        this.uncommittedEvents = [];
    }
    loadFromHistory(events) {
        events.forEach(event => {
            this.mutateState(event);
            this.version++;
        });
    }
    getVersion() {
        return this.version;
    }
    getState() {
        return { ...this.state };
    }
}
exports.EventSourcedAggregate = EventSourcedAggregate;
let DomainEventPublisher = class DomainEventPublisher {
    eventBus;
    eventEmitter;
    logger;
    constructor(eventBus, eventEmitter) {
        this.eventBus = eventBus;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger('DomainEventPublisher');
    }
    async publish(event) {
        this.logger.debug(`Publishing event: ${event.constructor.name}`);
        try {
            if (this.eventBus) {
                await this.eventBus.publish(event);
            }
            if (this.eventEmitter) {
                this.eventEmitter.emit(event.constructor.name, event);
            }
            this.logger.debug(`Event published successfully: ${event.constructor.name}`);
        }
        catch (error) {
            this.logger.error(`Failed to publish event: ${error.message}`, error.stack);
            throw error;
        }
    }
    async publishAll(events) {
        this.logger.debug(`Publishing ${events.length} events`);
        for (const event of events) {
            await this.publish(event);
        }
        this.logger.debug('All events published successfully');
    }
};
exports.DomainEventPublisher = DomainEventPublisher;
exports.DomainEventPublisher = DomainEventPublisher = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)('EVENT_BUS')),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [Object, event_emitter_1.EventEmitter2])
], DomainEventPublisher);
class EventHandlerRegistry {
    handlers = new Map();
    logger = new common_1.Logger('EventHandlerRegistry');
    registerHandler(eventName, handler) {
        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, []);
        }
        this.handlers.get(eventName).push(handler);
        this.logger.debug(`Handler registered for event: ${eventName}`);
    }
    async dispatch(eventName, event) {
        const handlers = this.handlers.get(eventName) || [];
        this.logger.debug(`Dispatching event ${eventName} to ${handlers.length} handlers`);
        await Promise.all(handlers.map(handler => handler(event)));
    }
    getHandlerCount(eventName) {
        return this.handlers.get(eventName)?.length || 0;
    }
    clear() {
        this.handlers.clear();
        this.logger.debug('All handlers cleared');
    }
}
exports.EventHandlerRegistry = EventHandlerRegistry;
let ServiceHealthMonitor = class ServiceHealthMonitor {
    logger;
    services = new Map();
    lastCheckResults = new Map();
    constructor() {
        this.logger = new common_1.Logger('ServiceHealthMonitor');
    }
    registerService(name, service) {
        this.services.set(name, service);
        this.logger.debug(`Service registered for health monitoring: ${name}`);
    }
    async checkService(name) {
        const service = this.services.get(name);
        if (!service) {
            return {
                status: 'unhealthy',
                message: `Service not found: ${name}`,
                timestamp: new Date(),
            };
        }
        try {
            const result = await service.checkHealth();
            this.lastCheckResults.set(name, result);
            return result;
        }
        catch (error) {
            const result = {
                status: 'unhealthy',
                message: error.message,
                timestamp: new Date(),
            };
            this.lastCheckResults.set(name, result);
            return result;
        }
    }
    async checkAll() {
        const results = new Map();
        for (const [name] of this.services) {
            const result = await this.checkService(name);
            results.set(name, result);
        }
        return results;
    }
    getLastCheckResult(name) {
        return this.lastCheckResults.get(name);
    }
};
exports.ServiceHealthMonitor = ServiceHealthMonitor;
exports.ServiceHealthMonitor = ServiceHealthMonitor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ServiceHealthMonitor);
var CircuitBreakerState;
(function (CircuitBreakerState) {
    CircuitBreakerState["CLOSED"] = "CLOSED";
    CircuitBreakerState["OPEN"] = "OPEN";
    CircuitBreakerState["HALF_OPEN"] = "HALF_OPEN";
})(CircuitBreakerState || (exports.CircuitBreakerState = CircuitBreakerState = {}));
class CircuitBreaker {
    name;
    config;
    state = CircuitBreakerState.CLOSED;
    failureCount = 0;
    successCount = 0;
    nextAttempt = Date.now();
    logger = new common_1.Logger('CircuitBreaker');
    constructor(name, config) {
        this.name = name;
        this.config = config;
    }
    async execute(operation) {
        if (this.state === CircuitBreakerState.OPEN) {
            if (Date.now() < this.nextAttempt) {
                throw new Error(`Circuit breaker ${this.name} is OPEN`);
            }
            this.state = CircuitBreakerState.HALF_OPEN;
            this.logger.log(`Circuit breaker ${this.name} transitioning to HALF_OPEN`);
        }
        try {
            const result = await Promise.race([
                operation(),
                this.timeout(),
            ]);
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    async timeout() {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Operation timeout')), this.config.timeout);
        });
    }
    onSuccess() {
        this.failureCount = 0;
        if (this.state === CircuitBreakerState.HALF_OPEN) {
            this.successCount++;
            if (this.successCount >= this.config.successThreshold) {
                this.state = CircuitBreakerState.CLOSED;
                this.successCount = 0;
                this.logger.log(`Circuit breaker ${this.name} closed`);
            }
        }
    }
    onFailure() {
        this.failureCount++;
        this.successCount = 0;
        if (this.failureCount >= this.config.failureThreshold) {
            this.state = CircuitBreakerState.OPEN;
            this.nextAttempt = Date.now() + this.config.resetTimeout;
            this.logger.warn(`Circuit breaker ${this.name} opened`);
        }
    }
    getState() {
        return this.state;
    }
    reset() {
        this.state = CircuitBreakerState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.logger.log(`Circuit breaker ${this.name} reset`);
    }
}
exports.CircuitBreaker = CircuitBreaker;
function createCircuitBreaker(name, config) {
    const defaultConfig = {
        failureThreshold: 5,
        successThreshold: 2,
        timeout: 5000,
        resetTimeout: 60000,
    };
    return new CircuitBreaker(name, { ...defaultConfig, ...config });
}
class RetryPolicy {
    config;
    logger = new common_1.Logger('RetryPolicy');
    constructor(config) {
        this.config = config;
    }
    async execute(operation, context) {
        let lastError;
        let delay = this.config.initialDelayMs;
        for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                if (!this.isRetryable(error)) {
                    this.logger.warn(`Non-retryable error: ${error.message}`);
                    throw error;
                }
                if (attempt === this.config.maxAttempts) {
                    break;
                }
                this.logger.warn(`Attempt ${attempt}/${this.config.maxAttempts} failed${context ? ` (${context})` : ''}: ${error.message}`);
                await this.delay(delay);
                delay = Math.min(delay * this.config.backoffMultiplier, this.config.maxDelayMs);
            }
        }
        throw lastError;
    }
    isRetryable(error) {
        if (!this.config.retryableErrors || this.config.retryableErrors.length === 0) {
            return true;
        }
        return this.config.retryableErrors.some(errorType => error instanceof errorType);
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.RetryPolicy = RetryPolicy;
function createRetryPolicy(config) {
    const defaultConfig = {
        maxAttempts: 3,
        initialDelayMs: 1000,
        maxDelayMs: 10000,
        backoffMultiplier: 2,
    };
    return new RetryPolicy({ ...defaultConfig, ...config });
}
function WithCircuitBreaker(circuitBreaker) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            return circuitBreaker.execute(() => originalMethod.apply(this, args));
        };
        return descriptor;
    };
}
function WithRetry(retryPolicy) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            return retryPolicy.execute(() => originalMethod.apply(this, args), `${target.constructor.name}.${propertyKey}`);
        };
        return descriptor;
    };
}
function Cacheable(ttlSeconds = 300) {
    const cache = new Map();
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const cacheKey = `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;
            const now = Date.now();
            const cached = cache.get(cacheKey);
            if (cached && cached.expiresAt > now) {
                return cached.value;
            }
            const result = await originalMethod.apply(this, args);
            cache.set(cacheKey, {
                value: result,
                expiresAt: now + ttlSeconds * 1000,
            });
            return result;
        };
        return descriptor;
    };
}
class ServiceMetrics {
    metrics = new Map();
    logger = new common_1.Logger('ServiceMetrics');
    increment(metric, value = 1) {
        const current = this.metrics.get(metric) || 0;
        this.metrics.set(metric, current + value);
    }
    decrement(metric, value = 1) {
        const current = this.metrics.get(metric) || 0;
        this.metrics.set(metric, current - value);
    }
    set(metric, value) {
        this.metrics.set(metric, value);
    }
    get(metric) {
        return this.metrics.get(metric) || 0;
    }
    getAll() {
        return new Map(this.metrics);
    }
    reset() {
        this.metrics.clear();
        this.logger.debug('Metrics reset');
    }
    recordExecutionTime(metric, startTime) {
        const duration = Date.now() - startTime;
        this.set(`${metric}.duration`, duration);
    }
}
exports.ServiceMetrics = ServiceMetrics;
function TrackMetrics(metrics) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const metricName = `${target.constructor.name}.${propertyKey}`;
            const startTime = Date.now();
            metrics.increment(`${metricName}.calls`);
            try {
                const result = await originalMethod.apply(this, args);
                metrics.increment(`${metricName}.success`);
                metrics.recordExecutionTime(metricName, startTime);
                return result;
            }
            catch (error) {
                metrics.increment(`${metricName}.errors`);
                throw error;
            }
        };
        return descriptor;
    };
}
class RequestContext {
    requestId;
    userId;
    userRoles;
    metadata;
    constructor(requestId, userId, userRoles = [], metadata = {}) {
        this.requestId = requestId;
        this.userId = userId;
        this.userRoles = userRoles;
        this.metadata = metadata;
    }
    hasRole(role) {
        return this.userRoles.includes(role);
    }
    hasAnyRole(roles) {
        return roles.some(role => this.hasRole(role));
    }
    isAuthenticated() {
        return !!this.userId;
    }
}
exports.RequestContext = RequestContext;
function createRequestContext(data) {
    return new RequestContext(data.requestId, data.userId, data.userRoles || [], data.metadata || {});
}
class TransactionCoordinator {
    logger = new common_1.Logger('TransactionCoordinator');
    activeTransactions = new Map();
    beginTransaction(transactionId) {
        if (this.activeTransactions.has(transactionId)) {
            throw new Error(`Transaction ${transactionId} already exists`);
        }
        const transaction = new Transaction(transactionId);
        this.activeTransactions.set(transactionId, transaction);
        this.logger.debug(`Transaction started: ${transactionId}`);
        return transaction;
    }
    async commitTransaction(transactionId) {
        const transaction = this.activeTransactions.get(transactionId);
        if (!transaction) {
            throw new Error(`Transaction ${transactionId} not found`);
        }
        await transaction.commit();
        this.activeTransactions.delete(transactionId);
        this.logger.debug(`Transaction committed: ${transactionId}`);
    }
    async rollbackTransaction(transactionId) {
        const transaction = this.activeTransactions.get(transactionId);
        if (!transaction) {
            throw new Error(`Transaction ${transactionId} not found`);
        }
        await transaction.rollback();
        this.activeTransactions.delete(transactionId);
        this.logger.warn(`Transaction rolled back: ${transactionId}`);
    }
    getTransaction(transactionId) {
        return this.activeTransactions.get(transactionId);
    }
}
exports.TransactionCoordinator = TransactionCoordinator;
class Transaction {
    id;
    operations = [];
    compensations = [];
    committed = false;
    constructor(id) {
        this.id = id;
    }
    addOperation(operation, compensation) {
        if (this.committed) {
            throw new Error('Cannot add operation to committed transaction');
        }
        this.operations.push(operation);
        this.compensations.unshift(compensation);
    }
    async commit() {
        if (this.committed) {
            throw new Error('Transaction already committed');
        }
        for (const operation of this.operations) {
            await operation();
        }
        this.committed = true;
    }
    async rollback() {
        for (const compensation of this.compensations) {
            try {
                await compensation();
            }
            catch (error) {
                console.error('Compensation failed:', error);
            }
        }
    }
}
exports.Transaction = Transaction;
class ServiceDependencyGraph {
    dependencies = new Map();
    logger = new common_1.Logger('ServiceDependencyGraph');
    addDependency(service, dependsOn) {
        if (!this.dependencies.has(service)) {
            this.dependencies.set(service, new Set());
        }
        this.dependencies.get(service).add(dependsOn);
        this.logger.debug(`Dependency added: ${service} -> ${dependsOn}`);
    }
    getDependencies(service) {
        return Array.from(this.dependencies.get(service) || []);
    }
    getAllDependencies(service) {
        const visited = new Set();
        const result = [];
        const traverse = (current) => {
            if (visited.has(current))
                return;
            visited.add(current);
            const deps = this.dependencies.get(current) || new Set();
            for (const dep of deps) {
                result.push(dep);
                traverse(dep);
            }
        };
        traverse(service);
        return result;
    }
    hasCircularDependency(service) {
        const visited = new Set();
        const recursionStack = new Set();
        const hasCycle = (current) => {
            if (recursionStack.has(current))
                return true;
            if (visited.has(current))
                return false;
            visited.add(current);
            recursionStack.add(current);
            const deps = this.dependencies.get(current) || new Set();
            for (const dep of deps) {
                if (hasCycle(dep))
                    return true;
            }
            recursionStack.delete(current);
            return false;
        };
        return hasCycle(service);
    }
    getTopologicalOrder() {
        const visited = new Set();
        const result = [];
        const visit = (service) => {
            if (visited.has(service))
                return;
            visited.add(service);
            const deps = this.dependencies.get(service) || new Set();
            for (const dep of deps) {
                visit(dep);
            }
            result.push(service);
        };
        for (const service of this.dependencies.keys()) {
            visit(service);
        }
        return result.reverse();
    }
}
exports.ServiceDependencyGraph = ServiceDependencyGraph;
function createDependencyGraph(modules) {
    const graph = new ServiceDependencyGraph();
    for (const module of modules) {
        for (const dependency of module.imports) {
            graph.addDependency(module.name, dependency);
        }
    }
    return graph;
}
class ServiceRateLimiter {
    maxRequests;
    windowMs;
    requests = new Map();
    logger = new common_1.Logger('ServiceRateLimiter');
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }
    async checkLimit(key) {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        if (!this.requests.has(key)) {
            this.requests.set(key, []);
        }
        const requests = this.requests.get(key);
        const validRequests = requests.filter(timestamp => timestamp > windowStart);
        if (validRequests.length >= this.maxRequests) {
            this.logger.warn(`Rate limit exceeded for key: ${key}`);
            return false;
        }
        validRequests.push(now);
        this.requests.set(key, validRequests);
        return true;
    }
    reset(key) {
        if (key) {
            this.requests.delete(key);
        }
        else {
            this.requests.clear();
        }
    }
    getRemainingRequests(key) {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        const requests = this.requests.get(key) || [];
        const validRequests = requests.filter(timestamp => timestamp > windowStart);
        return Math.max(0, this.maxRequests - validRequests.length);
    }
}
exports.ServiceRateLimiter = ServiceRateLimiter;
function createRateLimiter(maxRequests, windowMs = 60000) {
    return new ServiceRateLimiter(maxRequests, windowMs);
}
//# sourceMappingURL=service-patterns.service.js.map