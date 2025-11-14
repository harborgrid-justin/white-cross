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
exports.PresenceService = void 0;
const common_1 = require("@nestjs/common");
const websocket_gateway_1 = require("../websocket.gateway");
const broadcast_service_1 = require("./broadcast.service");
const base_1 = require("../../../common/base");
let PresenceService = class PresenceService extends base_1.BaseService {
    websocketGateway;
    broadcastService;
    constructor(websocketGateway, broadcastService) {
        super("PresenceService");
        this.websocketGateway = websocketGateway;
        this.broadcastService = broadcastService;
    }
    async updateUserPresence(userId, organizationId, status) {
        try {
            const presenceData = {
                userId,
                status,
                timestamp: new Date().toISOString(),
            };
            await this.broadcastService.broadcastToOrganization(organizationId, 'presence:update', presenceData);
            this.logDebug(`Presence update broadcasted for user ${userId}`, {
                status,
                organizationId,
            });
        }
        catch (error) {
            this.logError(`Failed to broadcast presence update for user ${userId}`, error);
            throw error;
        }
    }
    getUserPresence(userId) {
        return this.websocketGateway.getUserPresence(userId);
    }
    async broadcastUserOnline(userId, organizationId) {
        await this.updateUserPresence(userId, organizationId, 'online');
    }
    async broadcastUserOffline(userId, organizationId) {
        await this.updateUserPresence(userId, organizationId, 'offline');
    }
    async broadcastUserAway(userId, organizationId) {
        await this.updateUserPresence(userId, organizationId, 'away');
    }
    getConnectedSocketsCount() {
        return this.websocketGateway.getConnectedSocketsCount();
    }
    isInitialized() {
        return this.websocketGateway.isInitialized();
    }
};
exports.PresenceService = PresenceService;
exports.PresenceService = PresenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [websocket_gateway_1.WebSocketGateway,
        broadcast_service_1.BroadcastService])
], PresenceService);
//# sourceMappingURL=presence.service.js.map