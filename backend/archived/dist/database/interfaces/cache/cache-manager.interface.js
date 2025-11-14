"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheKeyBuilder = void 0;
class CacheKeyBuilder {
    static PREFIX = 'white-cross';
    entity(entityType, id) {
        return `${CacheKeyBuilder.PREFIX}:${entityType.toLowerCase()}:${id}`;
    }
    list(entityType, filters) {
        const filterHash = this.hashFilters(filters);
        return `${CacheKeyBuilder.PREFIX}:${entityType.toLowerCase()}:list:${filterHash}`;
    }
    summary(entityType, id, summaryType) {
        return `${CacheKeyBuilder.PREFIX}:${entityType.toLowerCase()}:${id}:summary:${summaryType}`;
    }
    search(query, filters) {
        const filterHash = this.hashFilters({ query, ...filters });
        return `${CacheKeyBuilder.PREFIX}:search:${filterHash}`;
    }
    hashFilters(filters) {
        const normalized = JSON.stringify(filters, Object.keys(filters).sort());
        return Buffer.from(normalized).toString('base64').substring(0, 16);
    }
}
exports.CacheKeyBuilder = CacheKeyBuilder;
//# sourceMappingURL=cache-manager.interface.js.map