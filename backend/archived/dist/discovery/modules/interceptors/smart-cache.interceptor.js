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
exports.SmartCacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const memory_optimized_cache_service_1 = require("../services/memory-optimized-cache.service");
const base_interceptor_1 = require("../../../common/interceptors/base.interceptor");
let SmartCacheInterceptor = class SmartCacheInterceptor extends base_interceptor_1.BaseInterceptor {
    discoveryService;
    reflector;
    cacheService;
    constructor(discoveryService, reflector, cacheService) {
        this.discoveryService = discoveryService;
        this.reflector = reflector;
        this.cacheService = cacheService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const handler = context.getHandler();
        const controller = context.getClass();
        const cacheMetadata = this.reflector.get('cacheable', controller) ||
            this.reflector.get('cacheable', handler);
        if (!cacheMetadata?.enabled) {
            return next.handle();
        }
        const cacheKey = this.generateCacheKey(request, controller.name, handler.name);
        return new rxjs_1.Observable((observer) => {
            this.cacheService
                .get(cacheKey)
                .then((cachedResult) => {
                if (cachedResult !== null) {
                    this.logRequest('debug', `Cache hit for ${cacheKey}`, {
                        operation: 'CACHE_HIT',
                        cacheKey: cacheKey.substring(0, 50),
                    });
                    observer.next(cachedResult);
                    observer.complete();
                    return;
                }
                next
                    .handle()
                    .pipe((0, operators_1.tap)((result) => {
                    this.cacheService
                        .set(cacheKey, result, controller.name, cacheMetadata.ttl)
                        .catch((error) => {
                        this.logError(`Failed to cache result for ${cacheKey}`, error, {
                            operation: 'CACHE_SET',
                            cacheKey: cacheKey.substring(0, 50),
                        });
                    });
                }))
                    .subscribe({
                    next: (result) => observer.next(result),
                    error: (error) => observer.error(error),
                    complete: () => observer.complete(),
                });
            })
                .catch((error) => {
                this.logError(`Cache lookup failed for ${cacheKey}`, error, {
                    operation: 'CACHE_LOOKUP',
                    cacheKey: cacheKey.substring(0, 50),
                });
                next.handle().subscribe({
                    next: (result) => observer.next(result),
                    error: (error) => observer.error(error),
                    complete: () => observer.complete(),
                });
            });
        });
    }
    generateCacheKey(request, controllerName, handlerName) {
        const method = request.method;
        const url = request.url;
        const queryString = JSON.stringify(request.query || {});
        const bodyHash = request.body
            ? JSON.stringify(request.body).slice(0, 100)
            : '';
        return `${controllerName}:${handlerName}:${method}:${url}:${queryString}:${bodyHash}`;
    }
};
exports.SmartCacheInterceptor = SmartCacheInterceptor;
exports.SmartCacheInterceptor = SmartCacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.Reflector,
        memory_optimized_cache_service_1.MemoryOptimizedCacheService])
], SmartCacheInterceptor);
//# sourceMappingURL=smart-cache.interceptor.js.map