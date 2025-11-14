"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const cache_service_1 = require("./cache.service");
const cache_config_1 = require("./cache.config");
const cache_connection_service_1 = require("./cache-connection.service");
const cache_storage_service_1 = require("./cache-storage.service");
const cache_serialization_service_1 = require("./cache-serialization.service");
const cache_invalidation_service_1 = require("./cache-invalidation.service");
const cache_operations_service_1 = require("./cache-operations.service");
const cache_warming_service_1 = require("./cache-warming.service");
const rate_limiter_service_1 = require("./rate-limiter.service");
const cache_statistics_service_1 = require("./cache-statistics.service");
let CacheModule = class CacheModule {
};
exports.CacheModule = CacheModule;
exports.CacheModule = CacheModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
        ],
        providers: [
            cache_config_1.CacheConfigService,
            cache_serialization_service_1.CacheSerializationService,
            cache_connection_service_1.CacheConnectionService,
            cache_storage_service_1.CacheStorageService,
            cache_invalidation_service_1.CacheInvalidationService,
            cache_operations_service_1.CacheOperationsService,
            cache_service_1.CacheService,
            cache_warming_service_1.CacheWarmingService,
            rate_limiter_service_1.RateLimiterService,
            cache_statistics_service_1.CacheStatisticsService,
        ],
        exports: [
            cache_service_1.CacheService,
            cache_warming_service_1.CacheWarmingService,
            rate_limiter_service_1.RateLimiterService,
            cache_statistics_service_1.CacheStatisticsService,
            cache_config_1.CacheConfigService,
        ],
    })
], CacheModule);
//# sourceMappingURL=cache.module.js.map