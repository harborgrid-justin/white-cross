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
exports.BaseWebSocketEventListener = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const websocket_service_1 = require("../websocket.service");
let BaseWebSocketEventListener = class BaseWebSocketEventListener {
    moduleRef;
    logger;
    websocketService;
    constructor(moduleRef, loggerContext) {
        this.moduleRef = moduleRef;
        this.logger = new common_1.Logger(loggerContext);
    }
    async onModuleInit() {
        try {
            this.websocketService = this.moduleRef.get(websocket_service_1.WebSocketService, {
                strict: false,
            });
        }
        catch (error) {
            this.logger.warn('WebSocket service not available, notifications disabled');
        }
    }
    async broadcastEvent(eventName, eventId, payload, rooms, useParallelBroadcast = true) {
        this.logger.log(`Broadcasting ${eventName}: ${eventId}`);
        if (!this.websocketService || !this.websocketService.isInitialized()) {
            this.logger.warn('WebSocket service not initialized, skipping notification');
            return;
        }
        try {
            const broadcastPromises = rooms.map((room) => this.websocketService.broadcastToRoom(room, eventName, payload));
            if (useParallelBroadcast) {
                await Promise.all(broadcastPromises);
            }
            else {
                for (const promise of broadcastPromises) {
                    await promise;
                }
            }
            this.logger.log(`Successfully broadcasted ${eventName}: ${eventId}`);
        }
        catch (error) {
            this.logger.error(`Failed to broadcast ${eventName} event: ${error.message}`, error.stack);
        }
    }
    isWebSocketAvailable() {
        return !!(this.websocketService && this.websocketService.isInitialized());
    }
    createPayload(basePayload, timestamp, eventType) {
        return {
            ...basePayload,
            timestamp: timestamp || new Date().toISOString(),
            ...(eventType && { eventType }),
        };
    }
};
exports.BaseWebSocketEventListener = BaseWebSocketEventListener;
exports.BaseWebSocketEventListener = BaseWebSocketEventListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.ModuleRef, String])
], BaseWebSocketEventListener);
//# sourceMappingURL=base-websocket-event.listener.js.map