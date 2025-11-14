"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const websocket_gateway_1 = require("./websocket.gateway");
const websocket_service_1 = require("./websocket.service");
const guards_1 = require("./guards");
const services_1 = require("./services");
const connection_manager_service_1 = require("./services/connection-manager.service");
const message_handler_service_1 = require("./services/message-handler.service");
const conversation_handler_service_1 = require("./services/conversation-handler.service");
const presence_manager_service_1 = require("./services/presence-manager.service");
const broadcast_service_1 = require("./services/broadcast.service");
const alert_service_1 = require("./services/alert.service");
const message_service_1 = require("./services/message.service");
const presence_service_1 = require("./services/presence.service");
const gateways_1 = require("./gateways");
const auth_1 = require("../../services/auth");
const appointment_listener_1 = require("./listeners/appointment.listener");
const app_config_service_1 = require("../../common/config/app-config.service");
const logger_service_1 = require("../../common/logging/logger.service");
let WebSocketModule = class WebSocketModule {
};
exports.WebSocketModule = WebSocketModule;
exports.WebSocketModule = WebSocketModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            auth_1.AuthModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const jwtSecret = configService.get('JWT_SECRET');
                    if (!jwtSecret) {
                        throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET not configured for WebSocket module');
                    }
                    return {
                        secret: jwtSecret,
                        signOptions: {
                            expiresIn: 86400,
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [
            websocket_gateway_1.WebSocketGateway,
            websocket_service_1.WebSocketService,
            guards_1.WsJwtAuthGuard,
            services_1.RateLimiterService,
            services_1.AdminMetricsService,
            gateways_1.AdminWebSocketGateway,
            app_config_service_1.AppConfigService,
            logger_service_1.LoggerService,
            connection_manager_service_1.ConnectionManagerService,
            message_handler_service_1.MessageHandlerService,
            conversation_handler_service_1.ConversationHandlerService,
            presence_manager_service_1.PresenceManagerService,
            broadcast_service_1.BroadcastService,
            alert_service_1.AlertService,
            message_service_1.MessageService,
            presence_service_1.PresenceService,
            appointment_listener_1.AppointmentWebSocketListener,
        ],
        exports: [
            websocket_service_1.WebSocketService,
            websocket_gateway_1.WebSocketGateway,
            services_1.AdminMetricsService,
            gateways_1.AdminWebSocketGateway,
            appointment_listener_1.AppointmentWebSocketListener,
        ],
    })
], WebSocketModule);
//# sourceMappingURL=websocket.module.js.map