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
exports.PermissionCacheService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
let PermissionCacheService = class PermissionCacheService extends base_1.BaseService {
    userPermissionsCache = new Map();
    rolePermissionsCache = new Map();
    stats = {
        userPermissions: { hits: 0, misses: 0, sets: 0, invalidations: 0 },
        rolePermissions: { hits: 0, misses: 0, sets: 0, invalidations: 0 },
    };
    USER_PERMISSIONS_TTL = 5 * 60 * 1000;
    ROLE_PERMISSIONS_TTL = 15 * 60 * 1000;
    constructor() {
        super('PermissionCacheService');
        this.startCleanupInterval();
        this.logInfo('Permission cache service initialized');
    }
    getUserPermissions(userId) {
        const cached = this.userPermissionsCache.get(userId);
        if (!cached) {
            this.stats.userPermissions.misses++;
            return null;
        }
        if (Date.now() > cached.expiresAt) {
            this.userPermissionsCache.delete(userId);
            this.stats.userPermissions.misses++;
            return null;
        }
        this.stats.userPermissions.hits++;
        this.logDebug(`Cache HIT for user permissions: ${userId}`);
        return cached.data;
    }
    setUserPermissions(userId, permissions, ttl) {
        const expiresAt = Date.now() + (ttl || this.USER_PERMISSIONS_TTL);
        this.userPermissionsCache.set(userId, {
            data: permissions,
            expiresAt,
        });
        this.stats.userPermissions.sets++;
        this.logDebug(`Cache SET for user permissions: ${userId}`);
    }
    invalidateUserPermissions(userId) {
        this.userPermissionsCache.delete(userId);
        this.stats.userPermissions.invalidations++;
        this.logDebug(`Cache INVALIDATE for user permissions: ${userId}`);
    }
    invalidateAllUserPermissions() {
        const count = this.userPermissionsCache.size;
        this.userPermissionsCache.clear();
        this.stats.userPermissions.invalidations += count;
        this.logInfo(`Cache INVALIDATE ALL user permissions: ${count} entries`);
    }
    getRolePermissions(roleId) {
        const cached = this.rolePermissionsCache.get(roleId);
        if (!cached) {
            this.stats.rolePermissions.misses++;
            return null;
        }
        if (Date.now() > cached.expiresAt) {
            this.rolePermissionsCache.delete(roleId);
            this.stats.rolePermissions.misses++;
            return null;
        }
        this.stats.rolePermissions.hits++;
        this.logDebug(`Cache HIT for role permissions: ${roleId}`);
        return cached.data;
    }
    setRolePermissions(roleId, permissions, ttl) {
        const expiresAt = Date.now() + (ttl || this.ROLE_PERMISSIONS_TTL);
        this.rolePermissionsCache.set(roleId, {
            data: permissions,
            expiresAt,
        });
        this.stats.rolePermissions.sets++;
        this.logDebug(`Cache SET for role permissions: ${roleId}`);
    }
    invalidateRolePermissions(roleId) {
        this.rolePermissionsCache.delete(roleId);
        this.stats.rolePermissions.invalidations++;
        this.logDebug(`Cache INVALIDATE for role permissions: ${roleId}`);
        this.invalidateAllUserPermissions();
    }
    invalidateAllRolePermissions() {
        const count = this.rolePermissionsCache.size;
        this.rolePermissionsCache.clear();
        this.stats.rolePermissions.invalidations += count;
        this.logInfo(`Cache INVALIDATE ALL role permissions: ${count} entries`);
        this.invalidateAllUserPermissions();
    }
    clearAll() {
        this.invalidateAllUserPermissions();
        this.invalidateAllRolePermissions();
        this.logInfo('All caches cleared');
    }
    getStatistics() {
        const userHitRate = this.stats.userPermissions.hits + this.stats.userPermissions.misses > 0
            ? ((this.stats.userPermissions.hits /
                (this.stats.userPermissions.hits +
                    this.stats.userPermissions.misses)) *
                100).toFixed(2)
            : '0.00';
        const roleHitRate = this.stats.rolePermissions.hits + this.stats.rolePermissions.misses > 0
            ? ((this.stats.rolePermissions.hits /
                (this.stats.rolePermissions.hits +
                    this.stats.rolePermissions.misses)) *
                100).toFixed(2)
            : '0.00';
        return {
            userPermissions: {
                ...this.stats.userPermissions,
                hitRate: `${userHitRate}%`,
                size: this.userPermissionsCache.size,
            },
            rolePermissions: {
                ...this.stats.rolePermissions,
                hitRate: `${roleHitRate}%`,
                size: this.rolePermissionsCache.size,
            },
            totalSize: this.userPermissionsCache.size + this.rolePermissionsCache.size,
        };
    }
    resetStatistics() {
        this.stats = {
            userPermissions: { hits: 0, misses: 0, sets: 0, invalidations: 0 },
            rolePermissions: { hits: 0, misses: 0, sets: 0, invalidations: 0 },
        };
        this.logInfo('Cache statistics reset');
    }
    startCleanupInterval() {
        setInterval(() => {
            this.cleanupExpired();
        }, 60 * 1000);
    }
    cleanupExpired() {
        const now = Date.now();
        let userRemoved = 0;
        let roleRemoved = 0;
        for (const [key, value] of this.userPermissionsCache.entries()) {
            if (now > value.expiresAt) {
                this.userPermissionsCache.delete(key);
                userRemoved++;
            }
        }
        for (const [key, value] of this.rolePermissionsCache.entries()) {
            if (now > value.expiresAt) {
                this.rolePermissionsCache.delete(key);
                roleRemoved++;
            }
        }
        if (userRemoved > 0 || roleRemoved > 0) {
            this.logDebug(`Cache cleanup: removed ${userRemoved} user permissions, ${roleRemoved} role permissions`);
        }
    }
    async warmCache(getUserPermissionsFn, userIds) {
        this.logInfo(`Warming cache for ${userIds.length} users`);
        for (const userId of userIds) {
            try {
                const permissions = await getUserPermissionsFn(userId);
                this.setUserPermissions(userId, permissions);
            }
            catch (error) {
                this.logError(`Error warming cache for user ${userId}:`, error);
            }
        }
        this.logInfo('Cache warming completed');
    }
};
exports.PermissionCacheService = PermissionCacheService;
exports.PermissionCacheService = PermissionCacheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PermissionCacheService);
//# sourceMappingURL=permission-cache.service.js.map