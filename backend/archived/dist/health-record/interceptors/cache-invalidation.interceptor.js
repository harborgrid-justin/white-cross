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
exports.BulkCacheInvalidationInterceptor = exports.CacheInvalidationInterceptor = void 0;
exports.InvalidateCache = InvalidateCache;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const base_interceptor_1 = require("../../common/interceptors/base.interceptor");
const health_data_cache_service_1 = require("../services/health-data-cache.service");
function InvalidateCache(config) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        Reflect.defineMetadata('cache:invalidate', config, target, propertyKey);
        return descriptor;
    };
}
let CacheInvalidationInterceptor = class CacheInvalidationInterceptor extends base_interceptor_1.BaseInterceptor {
    cacheService;
    constructor(cacheService) {
        super();
        this.cacheService = cacheService;
    }
    intercept(context, next) {
        const handler = context.getHandler();
        const config = Reflect.getMetadata('cache:invalidate', context.getClass().prototype, handler.name);
        if (!config) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            try {
                await this.invalidateCache(config, request, response);
            }
            catch (error) {
                this.logError('Error invalidating cache', error, {
                    operation: 'CACHE_INVALIDATION',
                    handler: handler.name,
                });
            }
        }));
    }
    async invalidateCache(config, request, response) {
        const studentId = this.extractStudentId(config, request, response);
        if (!studentId) {
            this.logRequest('warn', 'Could not extract student ID for cache invalidation', {
                operation: 'CACHE_INVALIDATION',
                config: JSON.stringify(config),
            });
            return;
        }
        if (config.invalidateAll) {
            await this.cacheService.invalidateStudentHealthData(studentId);
            this.logRequest('debug', `Invalidated all cache for student ${studentId}`, {
                operation: 'CACHE_INVALIDATION',
                studentId,
                invalidateAll: true,
            });
            return;
        }
        if (config.invalidateTypes) {
            const promises = [];
            for (const type of config.invalidateTypes) {
                switch (type) {
                    case 'vaccinations':
                        promises.push(this.cacheService.delete(`student:vaccinations:${studentId}`));
                        break;
                    case 'allergies':
                        promises.push(this.cacheService.delete(`student:allergies:${studentId}`));
                        break;
                    case 'chronic-conditions':
                        promises.push(this.cacheService.delete(`student:chronic-conditions:${studentId}`));
                        break;
                    case 'health-summary':
                        promises.push(this.cacheService.delete(`student:health:${studentId}`));
                        break;
                }
            }
            await Promise.all(promises);
            this.logRequest('debug', `Invalidated cache types [${config.invalidateTypes.join(', ')}] for student ${studentId}`, {
                operation: 'CACHE_INVALIDATION',
                studentId,
                invalidateTypes: config.invalidateTypes,
            });
        }
    }
    extractStudentId(config, request, response) {
        const path = config.studentIdPath || 'params.studentId';
        const parts = path.split('.');
        let value = request;
        for (const part of parts) {
            value = value?.[part];
            if (value === undefined) {
                break;
            }
        }
        if (value) {
            return value;
        }
        value = response;
        for (const part of parts) {
            value = value?.[part];
            if (value === undefined) {
                break;
            }
        }
        return value || null;
    }
};
exports.CacheInvalidationInterceptor = CacheInvalidationInterceptor;
exports.CacheInvalidationInterceptor = CacheInvalidationInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [health_data_cache_service_1.HealthDataCacheService])
], CacheInvalidationInterceptor);
let BulkCacheInvalidationInterceptor = class BulkCacheInvalidationInterceptor extends base_interceptor_1.BaseInterceptor {
    cacheService;
    constructor(cacheService) {
        super();
        this.cacheService = cacheService;
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            try {
                await this.invalidateBulkCache(response);
            }
            catch (error) {
                this.logError('Error invalidating bulk cache', error, {
                    operation: 'BULK_CACHE_INVALIDATION',
                });
            }
        }));
    }
    async invalidateBulkCache(response) {
        const studentIds = this.extractStudentIds(response);
        if (studentIds.length === 0) {
            return;
        }
        await Promise.all(studentIds.map((studentId) => this.cacheService.invalidateStudentHealthData(studentId)));
        this.logRequest('debug', `Invalidated cache for ${studentIds.length} students`, {
            operation: 'BULK_CACHE_INVALIDATION',
            studentIds,
        });
    }
    extractStudentIds(response) {
        const ids = [];
        if (Array.isArray(response)) {
            response.forEach((item) => {
                if (item?.studentId) {
                    ids.push(item.studentId);
                }
            });
        }
        else if (response?.records && Array.isArray(response.records)) {
            response.records.forEach((item) => {
                if (item?.studentId) {
                    ids.push(item.studentId);
                }
            });
        }
        else if (response?.studentId) {
            ids.push(response.studentId);
        }
        return [...new Set(ids)];
    }
};
exports.BulkCacheInvalidationInterceptor = BulkCacheInvalidationInterceptor;
exports.BulkCacheInvalidationInterceptor = BulkCacheInvalidationInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [health_data_cache_service_1.HealthDataCacheService])
], BulkCacheInvalidationInterceptor);
//# sourceMappingURL=cache-invalidation.interceptor.js.map