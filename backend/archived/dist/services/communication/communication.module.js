"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const models_5 = require("../../database/models");
const models_6 = require("../../database/models");
const models_7 = require("../../database/models");
const encryption_module_1 = require("../../infrastructure/encryption/encryption.module");
const message_queue_module_1 = require("../../infrastructure/queue/message-queue.module");
const auth_module_1 = require("../auth/auth.module");
const message_controller_1 = require("./controllers/message.controller");
const broadcast_controller_1 = require("./controllers/broadcast.controller");
const template_controller_1 = require("./controllers/template.controller");
const enhanced_message_controller_1 = require("./controllers/enhanced-message.controller");
const message_service_1 = require("./services/message.service");
const broadcast_service_1 = require("./services/broadcast.service");
const template_service_1 = require("./services/template.service");
const communication_service_1 = require("./services/communication.service");
const enhanced_message_service_1 = require("./services/enhanced-message.service");
const message_sender_service_1 = require("./services/message-sender.service");
const message_management_service_1 = require("./services/message-management.service");
const message_query_service_1 = require("./services/message-query.service");
const conversation_service_1 = require("./services/conversation.service");
const queue_integration_helper_1 = require("./helpers/queue-integration.helper");
const communication_gateway_1 = require("./gateways/communication.gateway");
let CommunicationModule = class CommunicationModule {
};
exports.CommunicationModule = CommunicationModule;
exports.CommunicationModule = CommunicationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                models_1.Message,
                models_2.MessageTemplate,
                models_3.MessageDelivery,
                models_4.MessageRead,
                models_5.MessageReaction,
                models_6.Conversation,
                models_7.ConversationParticipant,
            ]),
            encryption_module_1.EncryptionModule,
            message_queue_module_1.MessageQueueModule,
            auth_module_1.AuthModule,
        ],
        controllers: [
            message_controller_1.MessageController,
            broadcast_controller_1.BroadcastController,
            template_controller_1.TemplateController,
            enhanced_message_controller_1.EnhancedMessageController,
        ],
        providers: [
            message_service_1.MessageService,
            broadcast_service_1.BroadcastService,
            template_service_1.TemplateService,
            communication_service_1.CommunicationService,
            enhanced_message_service_1.EnhancedMessageService,
            message_sender_service_1.MessageSenderService,
            message_management_service_1.MessageManagementService,
            message_query_service_1.MessageQueryService,
            conversation_service_1.ConversationService,
            queue_integration_helper_1.QueueIntegrationHelper,
            communication_gateway_1.CommunicationGateway,
        ],
        exports: [
            message_service_1.MessageService,
            broadcast_service_1.BroadcastService,
            template_service_1.TemplateService,
            communication_service_1.CommunicationService,
            enhanced_message_service_1.EnhancedMessageService,
            conversation_service_1.ConversationService,
            communication_gateway_1.CommunicationGateway,
        ],
    })
], CommunicationModule);
//# sourceMappingURL=communication.module.js.map