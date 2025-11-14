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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CommunicationGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const ws_exception_filter_1 = require("../../../infrastructure/websocket/filters/ws-exception.filter");
const ws_jwt_auth_guard_1 = require("../../../infrastructure/websocket/guards/ws-jwt-auth.guard");
const ws_logging_interceptor_1 = require("../../../infrastructure/websocket/interceptors/ws-logging.interceptor");
let CommunicationGateway = CommunicationGateway_1 = class CommunicationGateway {
    server;
    logger = new common_1.Logger(CommunicationGateway_1.name);
    afterInit(server) {
        this.logger.log('Communication Gateway initialized');
    }
    handleConnection(client) {
        this.logger.log(`Client connected to communication namespace: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected from communication namespace: ${client.id}`);
    }
    handleSubscribeDeliveryUpdates(data, client) {
        this.logger.log(`Client ${client.id} subscribed to delivery updates for message ${data.messageId}`);
        client.join('message-' + data.messageId);
        return { success: true };
    }
    emitDeliveryStatusUpdate(messageId, status) {
        this.server
            .to('message-' + messageId)
            .emit('delivery-status-update', status);
    }
};
exports.CommunicationGateway = CommunicationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CommunicationGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('subscribe-delivery-updates'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], CommunicationGateway.prototype, "handleSubscribeDeliveryUpdates", null);
exports.CommunicationGateway = CommunicationGateway = CommunicationGateway_1 = __decorate([
    (0, common_1.UseFilters)(new ws_exception_filter_1.WsExceptionFilter()),
    (0, common_1.UseInterceptors)(ws_logging_interceptor_1.WsLoggingInterceptor),
    (0, websockets_1.WebSocketGateway)({
        namespace: '/communication',
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            credentials: true,
            methods: ['GET', 'POST'],
        },
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000,
    })
], CommunicationGateway);
//# sourceMappingURL=communication.gateway.js.map