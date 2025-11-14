"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyContactModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const emergency_contact_service_1 = require("./emergency-contact.service");
const contact_validation_service_1 = require("./services/contact-validation.service");
const contact_management_service_1 = require("./services/contact-management.service");
const notification_delivery_service_1 = require("./services/notification-delivery.service");
const notification_orchestration_service_1 = require("./services/notification-orchestration.service");
const contact_verification_service_1 = require("./services/contact-verification.service");
const contact_statistics_service_1 = require("./services/contact-statistics.service");
const notification_queue_service_1 = require("./services/notification-queue.service");
const emergency_contact_controller_1 = require("./emergency-contact.controller");
let EmergencyContactModule = class EmergencyContactModule {
};
exports.EmergencyContactModule = EmergencyContactModule;
exports.EmergencyContactModule = EmergencyContactModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                models_1.EmergencyContact,
                models_2.Student,
            ]),
        ],
        controllers: [emergency_contact_controller_1.EmergencyContactController],
        providers: [
            emergency_contact_service_1.EmergencyContactService,
            contact_validation_service_1.ContactValidationService,
            contact_management_service_1.ContactManagementService,
            notification_delivery_service_1.NotificationDeliveryService,
            notification_orchestration_service_1.NotificationOrchestrationService,
            contact_verification_service_1.ContactVerificationService,
            contact_statistics_service_1.ContactStatisticsService,
            notification_queue_service_1.NotificationQueueService,
        ],
        exports: [
            emergency_contact_service_1.EmergencyContactService,
            contact_statistics_service_1.ContactStatisticsService,
        ],
    })
], EmergencyContactModule);
//# sourceMappingURL=emergency-contact.module.js.map