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
exports.CacheInvalidationService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_config_1 = require("./cache.config");
const cache_storage_service_1 = require("./cache-storage.service");
const cache_interfaces_1 = require("./cache.interfaces");
const base_1 = require("../../common/base");
let CacheInvalidationService = class CacheInvalidationService extends base_1.BaseService {
    cacheConfig;
    storageService;
    eventEmitter;
    tagIndex = new Map();
    constructor(cacheConfig, storageService, eventEmitter) {
        super("CacheInvalidationService");
        this.cacheConfig = cacheConfig;
        this.storageService = storageService;
        this.eventEmitter = eventEmitter;
    }
    indexTags(key, tags) {
        for (const tag of tags) {
            if (!this.tagIndex.has(tag)) {
                this.tagIndex.set(tag, new Set());
            }
            this.tagIndex.get(tag).add(key);
        }
    }
    removeFromTagIndex(key) {
        for (const [tag, keys] of this.tagIndex.entries()) {
            keys.delete(key);
            if (keys.size === 0) {
                this.tagIndex.delete(tag);
            }
        }
    }
    clearTagIndex() {
        this.tagIndex.clear();
    }
    async invalidate(pattern, deleteCallback) {
        let count = 0;
        try {
            switch (pattern.type) {
                case 'key':
                    const deleted = await deleteCallback(pattern.value);
                    count = deleted ? 1 : 0;
                    break;
                case 'prefix':
                    count = await this.invalidateByPrefix(pattern.value, deleteCallback);
                    break;
                case 'tag':
                    count = await this.invalidateByTag(pattern.value, deleteCallback);
                    break;
                case 'pattern':
                    count = await this.invalidateByPattern(pattern.value, deleteCallback);
                    break;
                case 'cascade':
                    count = await this.invalidateCascade(pattern.value, deleteCallback);
                    break;
                default:
                    this.logWarning(`Unknown invalidation pattern type: ${pattern.type}`);
            }
            this.emitEvent(cache_interfaces_1.CacheEvent.INVALIDATE, pattern.value, {
                type: pattern.type,
                count,
            });
            return count;
        }
        catch (error) {
            this.logError('Cache invalidation error:', error);
            return 0;
        }
    }
    async invalidateByPrefix(prefix, deleteCallback) {
        const fullPrefix = this.cacheConfig.buildKey(prefix);
        let count = 0;
        const l1Keys = this.storageService.getL1Keys();
        for (const key of l1Keys) {
            if (key.startsWith(fullPrefix)) {
                this.storageService.deleteFromL1(key);
                this.removeFromTagIndex(key);
                count++;
            }
        }
        const l2Keys = await this.storageService.getL2KeysByPattern(`${fullPrefix}*`);
        if (l2Keys.length > 0) {
            for (const key of l2Keys) {
                await this.storageService.deleteFromL2(key);
                this.removeFromTagIndex(key);
            }
            count += l2Keys.length;
        }
        return count;
    }
    async invalidateByTag(tag, deleteCallback) {
        const keys = this.tagIndex.get(tag);
        if (!keys || keys.size === 0) {
            return 0;
        }
        let count = 0;
        for (const key of Array.from(keys)) {
            const deleted = await deleteCallback(key);
            if (deleted) {
                count++;
            }
        }
        this.tagIndex.delete(tag);
        return count;
    }
    async invalidateByPattern(pattern, deleteCallback) {
        const fullPattern = this.cacheConfig.buildKey(pattern);
        let count = 0;
        const regex = new RegExp(`^${fullPattern.replace(/\*/g, '.*').replace(/\?/g, '.')}$`);
        const l1Keys = this.storageService.getL1Keys();
        for (const key of l1Keys) {
            if (regex.test(key)) {
                this.storageService.deleteFromL1(key);
                this.removeFromTagIndex(key);
                count++;
            }
        }
        const l2Keys = await this.storageService.getL2KeysByPattern(fullPattern);
        if (l2Keys.length > 0) {
            for (const key of l2Keys) {
                await this.storageService.deleteFromL2(key);
                this.removeFromTagIndex(key);
            }
            count += l2Keys.length;
        }
        return count;
    }
    async invalidateCascade(key, deleteCallback) {
        await deleteCallback(key);
        const pattern = `*:${key}:*`;
        return (await this.invalidateByPattern(pattern, deleteCallback)) + 1;
    }
    emitEvent(event, key, metadata) {
        this.eventEmitter.emit(event, {
            event,
            key,
            timestamp: Date.now(),
            metadata,
        });
    }
};
exports.CacheInvalidationService = CacheInvalidationService;
exports.CacheInvalidationService = CacheInvalidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_config_1.CacheConfigService,
        cache_storage_service_1.CacheStorageService,
        event_emitter_1.EventEmitter2])
], CacheInvalidationService);
//# sourceMappingURL=cache-invalidation.service.js.map