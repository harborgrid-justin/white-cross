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
exports.BroadcastService = void 0;
const common_1 = require("@nestjs/common");
const websocket_gateway_1 = require("../websocket.gateway");
const base_1 = require("../../../common/base");
let BroadcastService = class BroadcastService extends base_1.BaseService {
    websocketGateway;
    constructor(websocketGateway) {
        super("BroadcastService");
        this.websocketGateway = websocketGateway;
    }
    async broadcastToRoom(room, event, data) {
        try {
            const server = this.getServer();
            if (!server) {
                this.logWarning('WebSocket server not initialized, cannot broadcast message');
                return;
            }
            const message = {
                data: data,
                timestamp: new Date().toISOString(),
            };
            server.to(room).emit(event, message);
            this.logDebug(`Broadcasted ${event} to room ${room}`, {
                event,
                room,
                dataKeys: Object.keys(data),
            });
        }
        catch (error) {
            this.logError(`Failed to broadcast to room ${room}`, error);
            throw error;
        }
    }
    async broadcastToRooms(rooms, event, data) {
        try {
            const server = this.getServer();
            if (!server) {
                this.logWarning('WebSocket server not initialized, cannot broadcast message');
                return;
            }
            const message = {
                data: data,
                timestamp: new Date().toISOString(),
            };
            for (const room of rooms) {
                server.to(room).emit(event, message);
            }
            this.logDebug(`Broadcasted ${event} to ${rooms.length} rooms`, {
                event,
                rooms,
                dataKeys: Object.keys(data),
            });
        }
        catch (error) {
            this.logError('Failed to broadcast to multiple rooms', error);
            throw error;
        }
    }
    async broadcastToSchool(schoolId, event, data) {
        await this.broadcastToRoom(`school:${schoolId}`, event, data);
    }
    async broadcastToUser(userId, event, data) {
        await this.broadcastToRoom(`user:${userId}`, event, data);
    }
    async broadcastToStudent(studentId, event, data) {
        await this.broadcastToRoom(`student:${studentId}`, event, data);
    }
    async broadcastToOrganization(organizationId, event, data) {
        await this.broadcastToRoom(`org:${organizationId}`, event, data);
    }
    getServer() {
        return this.websocketGateway?.server || null;
    }
};
exports.BroadcastService = BroadcastService;
exports.BroadcastService = BroadcastService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [websocket_gateway_1.WebSocketGateway])
], BroadcastService);
//# sourceMappingURL=broadcast.service.js.map