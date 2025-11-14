"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueueModule = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const enums_1 = require("./enums");
const queue_config_1 = require("./queue.config");
const message_queue_service_1 = require("./message-queue.service");
const message_delivery_processor_1 = require("./processors/message-delivery.processor");
const message_notification_processor_1 = require("./processors/message-notification.processor");
const message_encryption_processor_1 = require("./processors/message-encryption.processor");
const message_indexing_processor_1 = require("./processors/message-indexing.processor");
const batch_message_processor_1 = require("./processors/batch-message.processor");
const message_cleanup_processor_1 = require("./processors/message-cleanup.processor");
const encryption_1 = require("../encryption");
const websocket_1 = require("../websocket");
const database_1 = require("../../database");
let MessageQueueModule = class MessageQueueModule {
};
exports.MessageQueueModule = MessageQueueModule;
exports.MessageQueueModule = MessageQueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            encryption_1.EncryptionModule,
            websocket_1.WebSocketModule,
            sequelize_1.SequelizeModule.forFeature([database_1.Message, database_1.MessageDelivery]),
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useClass: queue_config_1.QueueConfigService,
            }),
            bull_1.BullModule.registerQueue({
                name: enums_1.QueueName.MESSAGE_DELIVERY,
                processors: [],
                defaultJobOptions: {
                    attempts: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_DELIVERY].maxAttempts,
                    backoff: {
                        type: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_DELIVERY].backoffType,
                        delay: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_DELIVERY].backoffDelay,
                    },
                    timeout: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_DELIVERY].timeout,
                    removeOnComplete: {
                        count: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_DELIVERY].removeOnCompleteCount,
                        age: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_DELIVERY].removeOnCompleteAge,
                    },
                    removeOnFail: {
                        count: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_DELIVERY].removeOnFailCount,
                        age: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_DELIVERY].removeOnFailAge,
                    },
                },
            }, {
                name: enums_1.QueueName.MESSAGE_NOTIFICATION,
                defaultJobOptions: {
                    attempts: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_NOTIFICATION].maxAttempts,
                    backoff: {
                        type: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_NOTIFICATION].backoffType,
                        delay: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_NOTIFICATION].backoffDelay,
                    },
                    timeout: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_NOTIFICATION].timeout,
                    removeOnComplete: {
                        count: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_NOTIFICATION]
                            .removeOnCompleteCount,
                        age: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_NOTIFICATION]
                            .removeOnCompleteAge,
                    },
                    removeOnFail: {
                        count: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_NOTIFICATION].removeOnFailCount,
                        age: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_NOTIFICATION].removeOnFailAge,
                    },
                },
            }, {
                name: enums_1.QueueName.MESSAGE_INDEXING,
                defaultJobOptions: {
                    attempts: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_INDEXING].maxAttempts,
                    backoff: {
                        type: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_INDEXING].backoffType,
                        delay: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_INDEXING].backoffDelay,
                    },
                    timeout: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_INDEXING].timeout,
                    removeOnComplete: {
                        count: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_INDEXING].removeOnCompleteCount,
                        age: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_INDEXING].removeOnCompleteAge,
                    },
                    removeOnFail: {
                        count: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_INDEXING].removeOnFailCount,
                        age: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_INDEXING].removeOnFailAge,
                    },
                },
            }, {
                name: enums_1.QueueName.MESSAGE_ENCRYPTION,
                defaultJobOptions: {
                    attempts: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_ENCRYPTION].maxAttempts,
                    backoff: {
                        type: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_ENCRYPTION].backoffType,
                        delay: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_ENCRYPTION].backoffDelay,
                    },
                    timeout: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_ENCRYPTION].timeout,
                    removeOnComplete: {
                        count: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_ENCRYPTION].removeOnCompleteCount,
                        age: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_ENCRYPTION]
                            .removeOnCompleteAge,
                    },
                    removeOnFail: {
                        count: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_ENCRYPTION].removeOnFailCount,
                        age: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_ENCRYPTION].removeOnFailAge,
                    },
                },
            }, {
                name: enums_1.QueueName.BATCH_MESSAGE_SENDING,
                defaultJobOptions: {
                    attempts: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.BATCH_MESSAGE_SENDING].maxAttempts,
                    backoff: {
                        type: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.BATCH_MESSAGE_SENDING].backoffType,
                        delay: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.BATCH_MESSAGE_SENDING].backoffDelay,
                    },
                    timeout: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.BATCH_MESSAGE_SENDING].timeout,
                    removeOnComplete: {
                        count: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.BATCH_MESSAGE_SENDING]
                            .removeOnCompleteCount,
                        age: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.BATCH_MESSAGE_SENDING]
                            .removeOnCompleteAge,
                    },
                    removeOnFail: {
                        count: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.BATCH_MESSAGE_SENDING].removeOnFailCount,
                        age: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.BATCH_MESSAGE_SENDING].removeOnFailAge,
                    },
                },
            }, {
                name: enums_1.QueueName.MESSAGE_CLEANUP,
                defaultJobOptions: {
                    attempts: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_CLEANUP].maxAttempts,
                    backoff: {
                        type: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_CLEANUP].backoffType,
                        delay: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_CLEANUP].backoffDelay,
                    },
                    timeout: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_CLEANUP].timeout,
                    removeOnComplete: {
                        count: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_CLEANUP].removeOnCompleteCount,
                        age: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_CLEANUP].removeOnCompleteAge,
                    },
                    removeOnFail: {
                        count: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_CLEANUP].removeOnFailCount,
                        age: queue_config_1.QUEUE_CONFIGS[enums_1.QueueName.MESSAGE_CLEANUP].removeOnFailAge,
                    },
                },
            }),
        ],
        providers: [
            queue_config_1.QueueConfigService,
            message_queue_service_1.MessageQueueService,
            message_delivery_processor_1.MessageDeliveryProcessor,
            message_notification_processor_1.MessageNotificationProcessor,
            message_encryption_processor_1.MessageEncryptionProcessor,
            message_indexing_processor_1.MessageIndexingProcessor,
            batch_message_processor_1.BatchMessageProcessor,
            message_cleanup_processor_1.MessageCleanupProcessor,
        ],
        exports: [message_queue_service_1.MessageQueueService, bull_1.BullModule],
    })
], MessageQueueModule);
//# sourceMappingURL=message-queue.module.js.map