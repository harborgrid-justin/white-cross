"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyBroadcastModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../../database/database.module");
const communication_module_1 = require("../communication.module");
const emergency_broadcast_controller_1 = require("./emergency-broadcast.controller");
const emergency_broadcast_service_1 = require("./emergency-broadcast.service");
const broadcast_priority_service_1 = require("./services/broadcast-priority.service");
const broadcast_recipient_service_1 = require("./services/broadcast-recipient.service");
const broadcast_delivery_service_1 = require("./services/broadcast-delivery.service");
const broadcast_management_service_1 = require("./services/broadcast-management.service");
const broadcast_template_service_1 = require("./services/broadcast-template.service");
let EmergencyBroadcastModule = class EmergencyBroadcastModule {
};
exports.EmergencyBroadcastModule = EmergencyBroadcastModule;
exports.EmergencyBroadcastModule = EmergencyBroadcastModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, communication_module_1.CommunicationModule],
        controllers: [emergency_broadcast_controller_1.EmergencyBroadcastController],
        providers: [
            emergency_broadcast_service_1.EmergencyBroadcastService,
            broadcast_priority_service_1.BroadcastPriorityService,
            broadcast_recipient_service_1.BroadcastRecipientService,
            broadcast_delivery_service_1.BroadcastDeliveryService,
            broadcast_management_service_1.BroadcastManagementService,
            broadcast_template_service_1.BroadcastTemplateService,
        ],
        exports: [emergency_broadcast_service_1.EmergencyBroadcastService],
    })
], EmergencyBroadcastModule);
//# sourceMappingURL=emergency-broadcast.module.js.map