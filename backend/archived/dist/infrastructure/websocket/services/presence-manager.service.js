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
exports.PresenceManagerService = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const base_1 = require("../../../common/base");
let PresenceManagerService = class PresenceManagerService extends base_1.BaseService {
    constructor() {
        super("PresenceManagerService");
    }
    presenceMap = new Map();
    handlePresenceUpdate(client, server, status) {
        const user = client.user;
        if (!user) {
            throw new websockets_1.WsException('Authentication required');
        }
        try {
            if (!['online', 'offline', 'away'].includes(status)) {
                throw new websockets_1.WsException('Invalid presence status');
            }
            this.updatePresence(user.userId, status);
            this.broadcastPresenceUpdate(server, user.userId, user.organizationId, status);
            this.logDebug(`User ${user.userId} presence updated to ${status}`);
        }
        catch (error) {
            this.logError(`Presence update error for user ${user.userId}:`, error);
        }
    }
    setUserOnline(userId, server, organizationId) {
        this.updatePresence(userId, 'online');
        this.broadcastPresenceUpdate(server, userId, organizationId, 'online');
    }
    setUserOffline(userId, server, organizationId) {
        this.updatePresence(userId, 'offline');
        this.broadcastPresenceUpdate(server, userId, organizationId, 'offline');
    }
    getUserPresence(userId) {
        return this.presenceMap.get(userId) || null;
    }
    getOrganizationPresence() {
        return new Map(this.presenceMap);
    }
    updatePresence(userId, status) {
        this.presenceMap.set(userId, {
            status,
            lastSeen: new Date().toISOString(),
        });
    }
    broadcastPresenceUpdate(server, userId, organizationId, status) {
        const orgRoom = `org:${organizationId}`;
        server.to(orgRoom).emit('presence:update', {
            userId,
            status,
            timestamp: new Date().toISOString(),
        });
    }
    cleanupStalePresence(maxAge = 24 * 60 * 60 * 1000) {
        const now = Date.now();
        let cleanedCount = 0;
        for (const [userId, presence] of this.presenceMap.entries()) {
            const lastSeenTime = new Date(presence.lastSeen).getTime();
            if (now - lastSeenTime > maxAge) {
                this.presenceMap.delete(userId);
                cleanedCount++;
            }
        }
        if (cleanedCount > 0) {
            this.logDebug(`Cleaned up ${cleanedCount} stale presence entries`);
        }
        return cleanedCount;
    }
    getOnlineUserCount() {
        let count = 0;
        for (const presence of this.presenceMap.values()) {
            if (presence.status === 'online') {
                count++;
            }
        }
        return count;
    }
    getPresenceStats() {
        const stats = { total: 0, online: 0, offline: 0, away: 0 };
        for (const presence of this.presenceMap.values()) {
            stats.total++;
            switch (presence.status) {
                case 'online':
                    stats.online++;
                    break;
                case 'offline':
                    stats.offline++;
                    break;
                case 'away':
                    stats.away++;
                    break;
            }
        }
        return stats;
    }
};
exports.PresenceManagerService = PresenceManagerService;
exports.PresenceManagerService = PresenceManagerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PresenceManagerService);
//# sourceMappingURL=presence-manager.service.js.map