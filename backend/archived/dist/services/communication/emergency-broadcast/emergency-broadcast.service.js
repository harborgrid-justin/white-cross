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
exports.EmergencyBroadcastService = void 0;
const common_1 = require("@nestjs/common");
const emergency_broadcast_repository_1 = require("../../../database/repositories/impl/emergency-broadcast.repository");
const student_repository_1 = require("../../../database/repositories/impl/student.repository");
const communication_service_1 = require("../services/communication.service");
const broadcast_priority_service_1 = require("./services/broadcast-priority.service");
const broadcast_recipient_service_1 = require("./services/broadcast-recipient.service");
const broadcast_delivery_service_1 = require("./services/broadcast-delivery.service");
const broadcast_management_service_1 = require("./services/broadcast-management.service");
const broadcast_template_service_1 = require("./services/broadcast-template.service");
const base_1 = require("../../../common/base");
let EmergencyBroadcastService = class EmergencyBroadcastService extends base_1.BaseService {
    broadcastRepository;
    studentRepository;
    communicationService;
    priorityService;
    recipientService;
    deliveryService;
    managementService;
    templateService;
    constructor(broadcastRepository, studentRepository, communicationService, priorityService, recipientService, deliveryService, managementService, templateService) {
        super("EmergencyBroadcastService");
        this.broadcastRepository = broadcastRepository;
        this.studentRepository = studentRepository;
        this.communicationService = communicationService;
        this.priorityService = priorityService;
        this.recipientService = recipientService;
        this.deliveryService = deliveryService;
        this.managementService = managementService;
        this.templateService = templateService;
    }
    determinePriority(type) {
        return this.priorityService.determinePriority(type);
    }
    getDeliveryChannels(priority) {
        return this.priorityService.getDeliveryChannels(priority);
    }
    async createBroadcast(createDto) {
        return this.managementService.createBroadcast(createDto);
    }
    async updateBroadcast(id, updateDto, userId = 'system') {
        return this.managementService.updateBroadcast(id, updateDto, userId);
    }
    async sendBroadcast(broadcastId, userId = 'system') {
        return this.managementService.sendBroadcast(broadcastId, userId);
    }
    async getBroadcastStatus(broadcastId) {
        return this.managementService.getBroadcastStatus(broadcastId);
    }
    async cancelBroadcast(broadcastId, reason, userId = 'system') {
        return this.managementService.cancelBroadcast(broadcastId, reason, userId);
    }
    async recordAcknowledgment(broadcastId, recipientId, acknowledgedAt = new Date()) {
        return this.managementService.recordAcknowledgment(broadcastId, recipientId, acknowledgedAt);
    }
    getTemplates() {
        return this.templateService.getTemplates();
    }
    mapToResponseDto(broadcast) {
        return {
            id: broadcast.id,
            type: broadcast.type,
            priority: broadcast.priority,
            title: broadcast.title,
            message: broadcast.message,
            audience: broadcast.audience,
            schoolId: broadcast.schoolId,
            gradeLevel: broadcast.gradeLevel,
            classId: broadcast.classId,
            groupIds: broadcast.groupIds,
            channels: broadcast.channels,
            requiresAcknowledgment: broadcast.requiresAcknowledgment,
            expiresAt: broadcast.expiresAt,
            sentBy: broadcast.sentBy,
            sentAt: broadcast.sentAt,
            status: broadcast.status,
            totalRecipients: broadcast.totalRecipients,
            deliveredCount: broadcast.deliveredCount,
            failedCount: broadcast.failedCount,
            acknowledgedCount: broadcast.acknowledgedCount,
            followUpRequired: broadcast.followUpRequired,
            followUpInstructions: broadcast.followUpInstructions,
        };
    }
};
exports.EmergencyBroadcastService = EmergencyBroadcastService;
exports.EmergencyBroadcastService = EmergencyBroadcastService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(emergency_broadcast_repository_1.EmergencyBroadcastRepository)),
    __param(1, (0, common_1.Inject)(student_repository_1.StudentRepository)),
    __metadata("design:paramtypes", [emergency_broadcast_repository_1.EmergencyBroadcastRepository,
        student_repository_1.StudentRepository,
        communication_service_1.CommunicationService,
        broadcast_priority_service_1.BroadcastPriorityService,
        broadcast_recipient_service_1.BroadcastRecipientService,
        broadcast_delivery_service_1.BroadcastDeliveryService,
        broadcast_management_service_1.BroadcastManagementService,
        broadcast_template_service_1.BroadcastTemplateService])
], EmergencyBroadcastService);
//# sourceMappingURL=emergency-broadcast.service.js.map