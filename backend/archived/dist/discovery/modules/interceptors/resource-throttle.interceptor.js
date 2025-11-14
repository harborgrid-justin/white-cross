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
exports.ResourceThrottleInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const dynamic_resource_pool_service_1 = require("../services/dynamic-resource-pool.service");
const base_interceptor_1 = require("../../../common/interceptors/base.interceptor");
let ResourceThrottleInterceptor = class ResourceThrottleInterceptor extends base_interceptor_1.BaseInterceptor {
    reflector;
    resourcePoolService;
    activeRequests = new Map();
    requestQueue = new Map();
    resourceCounters = new Map();
    constructor(reflector, resourcePoolService) {
        this.reflector = reflector;
        this.resourcePoolService = resourcePoolService;
    }
    async intercept(context, next) {
        const handler = context.getHandler();
        const controllerClass = context.getClass();
        const methodThrottleConfig = this.reflector.get('resource-throttle', handler);
        const classThrottleConfig = this.reflector.get('resource-throttle', controllerClass);
        const throttleConfig = methodThrottleConfig || classThrottleConfig;
        if (!throttleConfig) {
            return next.handle();
        }
        const requestId = this.getOrGenerateRequestId(context.switchToHttp().getRequest());
        const resourceType = throttleConfig.resourceType || 'default';
        this.logRequest('debug', `Throttling request ${requestId} for resource type: ${resourceType}`, {
            operation: 'RESOURCE_THROTTLE',
            requestId,
            resourceType,
        });
        try {
            const canProceed = await this.tryAcquireResources(requestId, throttleConfig);
            if (!canProceed) {
                if (this.getQueueSize(resourceType) < throttleConfig.queueSize) {
                    return new rxjs_1.Observable((subscriber) => {
                        this.addToQueue(requestId, throttleConfig, subscriber);
                    });
                }
                else {
                    this.logRequest('warn', `Resource throttle queue full for ${resourceType}, rejecting request ${requestId}`, {
                        operation: 'QUEUE_FULL_REJECTION',
                        requestId,
                        resourceType,
                    });
                    return (0, rxjs_1.throwError)(() => new Error(`Resource limit exceeded for ${resourceType}`));
                }
            }
            this.recordRequestStart(requestId, resourceType);
            return next.handle().pipe((0, operators_1.tap)(() => {
                this.recordRequestSuccess(requestId);
            }), (0, operators_1.catchError)((error) => {
                this.recordRequestError(requestId, error);
                return (0, rxjs_1.throwError)(() => error);
            }), (0, operators_1.tap)(() => {
                this.releaseResources(requestId, throttleConfig);
                this.processQueue(resourceType);
            }));
        }
        catch (error) {
            this.logError(`Error in resource throttle interceptor for request ${requestId}`, error, {
                operation: 'RESOURCE_THROTTLE_ERROR',
                requestId,
            });
            return (0, rxjs_1.throwError)(() => error);
        }
    }
    async tryAcquireResources(requestId, config) {
        const resourceType = config.resourceType || 'default';
        const currentCount = this.resourceCounters.get(resourceType) || 0;
        if (currentCount >= config.maxConcurrent) {
            this.logRequest('debug', `Max concurrent limit reached for ${resourceType}: ${currentCount}/${config.maxConcurrent}`, {
                operation: 'MAX_CONCURRENT_REACHED',
                resourceType,
                currentCount,
                maxConcurrent: config.maxConcurrent,
            });
            return false;
        }
        try {
            const resource = await this.resourcePoolService.getResource(resourceType, config.timeoutMs);
            if (resource) {
                this.resourceCounters.set(resourceType, currentCount + 1);
                this.logRequest('debug', `Acquired resource for ${requestId}, count: ${currentCount + 1}/${config.maxConcurrent}`, {
                    operation: 'RESOURCE_ACQUIRED',
                    requestId,
                    resourceType,
                    currentCount: currentCount + 1,
                    maxConcurrent: config.maxConcurrent,
                });
                return true;
            }
        }
        catch (error) {
            this.logError(`Failed to acquire resource from pool for ${requestId}`, error, {
                operation: 'RESOURCE_ACQUISITION_FAILED',
                requestId,
                resourceType,
            });
        }
        return false;
    }
    addToQueue(requestId, config, subscriber) {
        const resourceType = config.resourceType || 'default';
        if (!this.requestQueue.has(resourceType)) {
            this.requestQueue.set(resourceType, []);
        }
        const queue = this.requestQueue.get(resourceType);
        const queueItem = {
            resolve: (result) => {
                subscriber.next(result);
                subscriber.complete();
            },
            reject: (error) => {
                subscriber.error(error);
            },
            config,
        };
        let insertIndex = queue.length;
        for (let i = 0; i < queue.length; i++) {
            if (config.priority > queue[i].config.priority) {
                insertIndex = i;
                break;
            }
        }
        queue.splice(insertIndex, 0, queueItem);
        this.logRequest('debug', `Added request ${requestId} to queue at position ${insertIndex}, queue size: ${queue.length}`, {
            operation: 'REQUEST_QUEUED',
            requestId,
            queuePosition: insertIndex,
            queueSize: queue.length,
        });
        setTimeout(() => {
            const index = queue.indexOf(queueItem);
            if (index !== -1) {
                queue.splice(index, 1);
                queueItem.reject(new Error(`Request ${requestId} timed out in queue`));
                this.logRequest('warn', `Request ${requestId} timed out in queue after ${config.timeoutMs}ms`, {
                    operation: 'QUEUE_TIMEOUT',
                    requestId,
                    timeoutMs: config.timeoutMs,
                });
            }
        }, config.timeoutMs);
    }
    async processQueue(resourceType) {
        const queue = this.requestQueue.get(resourceType);
        if (!queue || queue.length === 0) {
            return;
        }
        const currentCount = this.resourceCounters.get(resourceType) || 0;
        const nextRequest = queue.shift();
        if (nextRequest && currentCount < nextRequest.config.maxConcurrent) {
            try {
                const resource = await this.resourcePoolService.getResource(resourceType, nextRequest.config.timeoutMs);
                if (resource) {
                    this.resourceCounters.set(resourceType, currentCount + 1);
                    this.logRequest('debug', `Processing queued request for ${resourceType}, count: ${currentCount + 1}`, {
                        operation: 'PROCESSING_QUEUED_REQUEST',
                        resourceType,
                        currentCount: currentCount + 1,
                    });
                    nextRequest.resolve(resource);
                }
                else {
                    nextRequest.reject(new Error('Failed to acquire resource from pool'));
                }
            }
            catch (error) {
                nextRequest.reject(error);
            }
        }
        else if (nextRequest) {
            queue.unshift(nextRequest);
        }
    }
    async releaseResources(requestId, config) {
        const resourceType = config.resourceType || 'default';
        const currentCount = this.resourceCounters.get(resourceType) || 0;
        if (currentCount > 0) {
            this.resourceCounters.set(resourceType, currentCount - 1);
            this.logRequest('debug', `Released resource for ${requestId}, count: ${currentCount - 1}`, {
                operation: 'RESOURCE_RELEASED',
                requestId,
                resourceType,
                currentCount: currentCount - 1,
            });
        }
        try {
            this.logRequest('debug', `Resource released for ${resourceType}`, {
                operation: 'RESOURCE_POOL_RELEASE',
                resourceType,
            });
        }
        catch (error) {
            this.logError(`Error releasing resource to pool for ${requestId}`, error, {
                operation: 'RESOURCE_RELEASE_ERROR',
                requestId,
                resourceType,
            });
        }
        this.activeRequests.delete(requestId);
    }
    recordRequestStart(requestId, resourceType) {
        this.activeRequests.set(requestId, {
            startTime: Date.now(),
            resourcesUsed: [resourceType],
            success: false,
        });
    }
    recordRequestSuccess(requestId) {
        const metrics = this.activeRequests.get(requestId);
        if (metrics) {
            metrics.endTime = Date.now();
            metrics.executionTime = metrics.endTime - metrics.startTime;
            metrics.success = true;
            this.logRequest('debug', `Request ${requestId} completed successfully in ${metrics.executionTime}ms`, {
                operation: 'REQUEST_SUCCESS',
                requestId,
                executionTime: metrics.executionTime,
            });
        }
    }
    recordRequestError(requestId, error) {
        const metrics = this.activeRequests.get(requestId);
        if (metrics) {
            metrics.endTime = Date.now();
            metrics.executionTime = metrics.endTime - metrics.startTime;
            metrics.success = false;
            this.logRequest('warn', `Request ${requestId} failed after ${metrics.executionTime}ms: ${error.message}`, {
                operation: 'REQUEST_ERROR',
                requestId,
                executionTime: metrics.executionTime,
                errorMessage: error.message,
            });
        }
    }
    getQueueSize(resourceType) {
        const queue = this.requestQueue.get(resourceType);
        return queue ? queue.length : 0;
    }
    getResourceStats() {
        const stats = [];
        for (const [resourceType, count] of this.resourceCounters.entries()) {
            const queueSize = this.getQueueSize(resourceType);
            const completedRequests = Array.from(this.activeRequests.values()).filter((m) => m.resourcesUsed.includes(resourceType) && m.executionTime);
            const averageExecutionTime = completedRequests.length > 0
                ? completedRequests.reduce((sum, m) => sum + (m.executionTime || 0), 0) / completedRequests.length
                : 0;
            stats.push({
                resourceType,
                activeRequests: count,
                queuedRequests: queueSize,
                totalProcessed: completedRequests.length,
                averageExecutionTime,
            });
        }
        return stats;
    }
    reset() {
        this.requestQueue.clear();
        this.resourceCounters.clear();
        this.activeRequests.clear();
        this.logRequest('log', 'Resource throttle interceptor reset', {
            operation: 'RESOURCE_THROTTLE_RESET',
        });
    }
};
exports.ResourceThrottleInterceptor = ResourceThrottleInterceptor;
exports.ResourceThrottleInterceptor = ResourceThrottleInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        dynamic_resource_pool_service_1.DynamicResourcePoolService])
], ResourceThrottleInterceptor);
//# sourceMappingURL=resource-throttle.interceptor.js.map