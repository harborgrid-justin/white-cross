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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../../common/config");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
const broadcast_service_1 = require("./services/broadcast.service");
const alert_service_1 = require("./services/alert.service");
const message_service_1 = require("./services/message.service");
const presence_service_1 = require("./services/presence.service");
let WebSocketService = class WebSocketService extends base_1.BaseService {
    config;
    broadcastService;
    alertService;
    messageService;
    presenceService;
    constructor(logger, config, broadcastService, alertService, messageService, presenceService) {
        super({
            serviceName: 'WebSocketService',
            logger,
            enableAuditLogging: true,
        });
        this.config = config;
        this.broadcastService = broadcastService;
        this.alertService = alertService;
        this.messageService = messageService;
        this.presenceService = presenceService;
        this.logInfo('WebSocketService initialized');
    }
    async onModuleDestroy() {
        this.logInfo('WebSocketService shutting down - cleaning up resources');
        const connectedSockets = this.getConnectedSocketsCount();
        if (connectedSockets > 0) {
            this.logInfo(`Disconnecting ${connectedSockets} active WebSocket connections`);
            if (this.config.get('websocket.notifyOnShutdown', true)) {
                this.logInfo('Shutdown notification sent to connected clients');
            }
        }
        this.logInfo('WebSocketService destroyed, resources cleaned up');
    }
    async broadcastToRoom(room, event, data) {
        return this.broadcastService.broadcastToRoom(room, event, data);
    }
    async broadcastToRooms(rooms, event, data) {
        return this.broadcastService.broadcastToRooms(rooms, event, data);
    }
    async broadcastToSchool(schoolId, event, data) {
        return this.broadcastService.broadcastToSchool(schoolId, event, data);
    }
    async broadcastToUser(userId, event, data) {
        return this.broadcastService.broadcastToUser(userId, event, data);
    }
    async broadcastToStudent(studentId, event, data) {
        return this.broadcastService.broadcastToStudent(studentId, event, data);
    }
    async broadcastEmergencyAlert(organizationId, alert) {
        return this.alertService.broadcastEmergencyAlert(organizationId, alert);
    }
    async broadcastStudentHealthAlert(organizationId, alert) {
        return this.alertService.broadcastStudentHealthAlert(organizationId, alert);
    }
    async broadcastMedicationReminder(organizationId, reminder) {
        return this.alertService.broadcastMedicationReminder(organizationId, reminder);
    }
    async sendUserNotification(userId, notification) {
        return this.alertService.sendUserNotification(userId, notification);
    }
    async sendMessageToConversation(conversationId, message) {
        return this.messageService.sendMessageToConversation(conversationId, message);
    }
    async sendMessageToUsers(userIds, message) {
        return this.messageService.sendMessageToUsers(userIds, message);
    }
    async broadcastTypingIndicator(conversationId, typingIndicator) {
        return this.messageService.broadcastTypingIndicator(conversationId, typingIndicator);
    }
    async broadcastReadReceipt(conversationId, readReceipt) {
        return this.messageService.broadcastReadReceipt(conversationId, readReceipt);
    }
    async broadcastMessageDelivery(senderId, delivery) {
        return this.messageService.broadcastMessageDelivery(senderId, delivery);
    }
    async updateUserPresence(userId, organizationId, status) {
        return this.presenceService.updateUserPresence(userId, organizationId, status);
    }
    getUserPresence(userId) {
        return this.presenceService.getUserPresence(userId);
    }
    getConnectedSocketsCount() {
        return this.presenceService.getConnectedSocketsCount();
    }
    isInitialized() {
        return this.presenceService.isInitialized();
    }
};
exports.WebSocketService = WebSocketService;
exports.WebSocketService = WebSocketService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.AppConfigService,
        broadcast_service_1.BroadcastService,
        alert_service_1.AlertService,
        message_service_1.MessageService,
        presence_service_1.PresenceService])
], WebSocketService);
//# sourceMappingURL=websocket.service.js.map