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
exports.EmergencyContactService = void 0;
const common_1 = require("@nestjs/common");
const contact_management_service_1 = require("./services/contact-management.service");
const contact_verification_service_1 = require("./services/contact-verification.service");
const contact_statistics_service_1 = require("./services/contact-statistics.service");
const notification_orchestration_service_1 = require("./services/notification-orchestration.service");
const notification_queue_service_1 = require("./services/notification-queue.service");
const base_1 = require("../../../common/base");
const logger_service_1 = require("../../../common/logging/logger.service");
const common_2 = require("@nestjs/common");
let EmergencyContactService = class EmergencyContactService extends base_1.BaseService {
    contactManagementService;
    contactVerificationService;
    contactStatisticsService;
    notificationOrchestrationService;
    notificationQueueService;
    constructor(logger, contactManagementService, contactVerificationService, contactStatisticsService, notificationOrchestrationService, notificationQueueService) {
        super({
            serviceName: 'EmergencyContactService',
            logger,
            enableAuditLogging: true,
        });
        this.contactManagementService = contactManagementService;
        this.contactVerificationService = contactVerificationService;
        this.contactStatisticsService = contactStatisticsService;
        this.notificationOrchestrationService = notificationOrchestrationService;
        this.notificationQueueService = notificationQueueService;
        this.logInfo('Emergency contact service initialized');
    }
    async onModuleDestroy() {
        this.logInfo('EmergencyContactService shutting down');
        await this.notificationQueueService.onModuleDestroy();
        this.logInfo('EmergencyContactService destroyed');
    }
    async getStudentEmergencyContacts(studentId) {
        return this.contactManagementService.getStudentEmergencyContacts(studentId);
    }
    async getEmergencyContactById(id) {
        return this.contactManagementService.getEmergencyContactById(id);
    }
    async createEmergencyContact(data) {
        return this.contactManagementService.createEmergencyContact(data);
    }
    async updateEmergencyContact(id, data) {
        return this.contactManagementService.updateEmergencyContact(id, data);
    }
    async deleteEmergencyContact(id) {
        return this.contactManagementService.deleteEmergencyContact(id);
    }
    async sendEmergencyNotification(studentId, notificationData) {
        return this.notificationOrchestrationService.sendEmergencyNotification(studentId, notificationData);
    }
    async sendContactNotification(contactId, notificationData) {
        return this.notificationOrchestrationService.sendContactNotification(contactId, notificationData);
    }
    async verifyContact(contactId, verificationMethod) {
        return this.contactVerificationService.verifyContact(contactId, verificationMethod);
    }
    async getContactStatistics() {
        return this.contactStatisticsService.getContactStatistics();
    }
    async findByIds(ids) {
        return this.contactStatisticsService.findByIds(ids);
    }
    async findByStudentIds(studentIds) {
        return this.contactStatisticsService.findByStudentIds(studentIds);
    }
};
exports.EmergencyContactService = EmergencyContactService;
exports.EmergencyContactService = EmergencyContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        contact_management_service_1.ContactManagementService,
        contact_verification_service_1.ContactVerificationService,
        contact_statistics_service_1.ContactStatisticsService,
        notification_orchestration_service_1.NotificationOrchestrationService,
        notification_queue_service_1.NotificationQueueService])
], EmergencyContactService);
//# sourceMappingURL=emergency-contact.service.js.map