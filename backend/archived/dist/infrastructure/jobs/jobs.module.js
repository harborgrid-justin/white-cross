"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsModule = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const config_1 = require("@nestjs/config");
const job_type_enum_1 = require("./enums/job-type.enum");
const services_1 = require("./services");
const reminder_generator_service_1 = require("./services/reminder-generator.service");
const reminder_cache_service_1 = require("./services/reminder-cache.service");
const reminder_notification_service_1 = require("./services/reminder-notification.service");
const processors_1 = require("./processors");
const email_module_1 = require("../email/email.module");
const inventory_module_1 = require("../../services/inventory/inventory.module");
let JobsModule = class JobsModule {
};
exports.JobsModule = JobsModule;
exports.JobsModule = JobsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            email_module_1.EmailModule,
            inventory_module_1.InventoryModule,
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    redis: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                        username: configService.get('REDIS_USERNAME'),
                        password: configService.get('REDIS_PASSWORD'),
                        maxRetriesPerRequest: 20,
                    },
                    defaultJobOptions: {
                        attempts: 3,
                        backoff: {
                            type: 'exponential',
                            delay: 2000,
                        },
                        removeOnComplete: {
                            count: 100,
                            age: 24 * 3600,
                        },
                        removeOnFail: {
                            count: 1000,
                            age: 7 * 24 * 3600,
                        },
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            bull_1.BullModule.registerQueue({ name: job_type_enum_1.JobType.MEDICATION_REMINDER }, { name: job_type_enum_1.JobType.IMMUNIZATION_ALERT }, { name: job_type_enum_1.JobType.APPOINTMENT_REMINDER }, { name: job_type_enum_1.JobType.INVENTORY_MAINTENANCE }, { name: job_type_enum_1.JobType.REPORT_GENERATION }, { name: job_type_enum_1.JobType.DATA_EXPORT }, { name: job_type_enum_1.JobType.NOTIFICATION_BATCH }, { name: job_type_enum_1.JobType.CLEANUP_TASK }),
        ],
        providers: [
            services_1.QueueManagerService,
            reminder_generator_service_1.ReminderGeneratorService,
            reminder_cache_service_1.ReminderCacheService,
            reminder_notification_service_1.ReminderNotificationService,
            processors_1.MedicationReminderProcessor,
            processors_1.InventoryMaintenanceProcessor,
        ],
        exports: [services_1.QueueManagerService, bull_1.BullModule],
    })
], JobsModule);
//# sourceMappingURL=jobs.module.js.map