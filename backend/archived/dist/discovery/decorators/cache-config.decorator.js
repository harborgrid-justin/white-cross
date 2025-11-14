"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoCache = exports.CacheAdmin = exports.CacheUser = exports.CacheLong = exports.CacheMedium = exports.CacheShort = exports.CacheConfiguration = exports.CACHE_CONFIG_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.CACHE_CONFIG_KEY = 'cache-config';
const CacheConfiguration = (config) => (0, common_1.SetMetadata)(exports.CACHE_CONFIG_KEY, config);
exports.CacheConfiguration = CacheConfiguration;
const CacheShort = (includeQuery = false, includeParams = false) => (0, exports.CacheConfiguration)({
    enabled: true,
    ttl: 60,
    includeQuery,
    includeParams,
    keyPrefix: 'short',
});
exports.CacheShort = CacheShort;
const CacheMedium = (includeQuery = true, includeParams = false) => (0, exports.CacheConfiguration)({
    enabled: true,
    ttl: 300,
    includeQuery,
    includeParams,
    keyPrefix: 'medium',
});
exports.CacheMedium = CacheMedium;
const CacheLong = (includeQuery = true, includeParams = true) => (0, exports.CacheConfiguration)({
    enabled: true,
    ttl: 1800,
    includeQuery,
    includeParams,
    keyPrefix: 'long',
});
exports.CacheLong = CacheLong;
const CacheUser = (ttl = 300) => (0, exports.CacheConfiguration)({
    enabled: true,
    ttl,
    includeQuery: true,
    includeParams: true,
    includeUser: true,
    keyPrefix: 'user',
});
exports.CacheUser = CacheUser;
const CacheAdmin = () => (0, exports.CacheConfiguration)({
    enabled: true,
    ttl: 60,
    includeQuery: false,
    includeParams: false,
    includeUser: true,
    keyPrefix: 'admin',
});
exports.CacheAdmin = CacheAdmin;
const NoCache = () => (0, exports.CacheConfiguration)({
    enabled: false,
    ttl: 0,
});
exports.NoCache = NoCache;
//# sourceMappingURL=cache-config.decorator.js.map