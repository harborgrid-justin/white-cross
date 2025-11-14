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
exports.DiscoveryCacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const discovery_cache_service_1 = require("../services/discovery-cache.service");
const cache_config_decorator_1 = require("../decorators/cache-config.decorator");
const crypto = __importStar(require("crypto"));
const base_interceptor_1 = require("../../common/interceptors/base.interceptor");
let DiscoveryCacheInterceptor = class DiscoveryCacheInterceptor extends base_interceptor_1.BaseInterceptor {
    cacheService;
    reflector;
    constructor(cacheService, reflector) {
        this.cacheService = cacheService;
        this.reflector = reflector;
    }
    async intercept(context, next) {
        const cacheConfig = this.reflector.getAllAndOverride(cache_config_decorator_1.CACHE_CONFIG_KEY, [context.getHandler(), context.getClass()]);
        if (!cacheConfig?.enabled) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const cacheKey = this.generateCacheKey(request, cacheConfig);
        try {
            const cachedResult = await this.cacheService.get(cacheKey);
            if (cachedResult !== null) {
                this.logRequest('debug', `Cache HIT: ${cacheKey}`, {
                    operation: 'CACHE_HIT',
                    cacheKey: cacheKey.substring(0, 50),
                });
                return (0, rxjs_1.of)(cachedResult);
            }
            return next.handle().pipe((0, operators_1.tap)(async (response) => {
                if (response !== null && response !== undefined) {
                    await this.cacheService.set(cacheKey, response, cacheConfig.ttl);
                    this.logRequest('debug', `Cache SET: ${cacheKey}`, {
                        operation: 'CACHE_SET',
                        cacheKey: cacheKey.substring(0, 50),
                        ttl: cacheConfig.ttl,
                    });
                }
            }));
        }
        catch (error) {
            this.logError(`Cache operation failed for key ${cacheKey}`, error, {
                operation: 'CACHE_OPERATION',
                cacheKey: cacheKey.substring(0, 50),
            });
            return next.handle();
        }
    }
    generateCacheKey(request, config) {
        const keyParts = [];
        if (config.keyPrefix) {
            keyParts.push(config.keyPrefix);
        }
        keyParts.push(request.method);
        keyParts.push(request.route?.path || request.path);
        if (config.includeQuery && Object.keys(request.query).length > 0) {
            const sortedQuery = this.sortObject(request.query);
            keyParts.push('query', JSON.stringify(sortedQuery));
        }
        if (config.includeParams && Object.keys(request.params).length > 0) {
            const sortedParams = this.sortObject(request.params);
            keyParts.push('params', JSON.stringify(sortedParams));
        }
        if (config.includeUser && request.user) {
            const user = request.user;
            keyParts.push('user', user.id || 'anonymous');
            if (user.role) {
                keyParts.push('role', user.role);
            }
        }
        const rawKey = keyParts.join('|');
        return crypto.createHash('md5').update(rawKey).digest('hex');
    }
    sortObject(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => this.sortObject(item));
        }
        const sortedKeys = Object.keys(obj).sort();
        const sortedObj = {};
        for (const key of sortedKeys) {
            sortedObj[key] = this.sortObject(obj[key]);
        }
        return sortedObj;
    }
};
exports.DiscoveryCacheInterceptor = DiscoveryCacheInterceptor;
exports.DiscoveryCacheInterceptor = DiscoveryCacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [discovery_cache_service_1.DiscoveryCacheService,
        core_1.Reflector])
], DiscoveryCacheInterceptor);
//# sourceMappingURL=discovery-cache.interceptor.js.map