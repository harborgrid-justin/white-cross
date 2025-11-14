"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const appointment_core_controller_1 = require("./controllers/appointment-core.controller");
const appointment_status_controller_1 = require("./controllers/appointment-status.controller");
const appointment_query_controller_1 = require("./controllers/appointment-query.controller");
const appointment_statistics_controller_1 = require("./controllers/appointment-statistics.controller");
const appointment_advanced_controller_1 = require("./controllers/appointment-advanced.controller");
const waitlist_controller_1 = require("./controllers/waitlist.controller");
const reminder_controller_1 = require("./controllers/reminder.controller");
const appointment_service_1 = require("./appointment.service");
const appointment_read_service_1 = require("./services/appointment-read.service");
const appointment_write_service_1 = require("./services/appointment-write.service");
const appointment_status_service_1 = require("./services/appointment-status.service");
const appointment_query_service_1 = require("./services/appointment-query.service");
const appointment_scheduling_service_1 = require("./services/appointment-scheduling.service");
const appointment_statistics_service_1 = require("./services/appointment-statistics.service");
const appointment_recurring_service_1 = require("./services/appointment-recurring.service");
const waitlist_service_1 = require("./services/waitlist.service");
const reminder_service_1 = require("./services/reminder.service");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const websocket_module_1 = require("../../infrastructure/websocket/websocket.module");
const email_module_1 = require("../../infrastructure/email/email.module");
const app_config_service_1 = require("../../common/config/app-config.service");
let AppointmentModule = class AppointmentModule {
};
exports.AppointmentModule = AppointmentModule;
exports.AppointmentModule = AppointmentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([models_1.Appointment, models_2.AppointmentReminder, models_3.AppointmentWaitlist, models_4.User]),
            config_1.ConfigModule,
            websocket_module_1.WebSocketModule,
            email_module_1.EmailModule,
        ],
        controllers: [
            appointment_core_controller_1.AppointmentCoreController,
            appointment_status_controller_1.AppointmentStatusController,
            appointment_query_controller_1.AppointmentQueryController,
            appointment_statistics_controller_1.AppointmentStatisticsController,
            appointment_advanced_controller_1.AppointmentAdvancedController,
            waitlist_controller_1.WaitlistController,
            reminder_controller_1.ReminderController,
        ],
        providers: [
            appointment_service_1.AppointmentService,
            appointment_read_service_1.AppointmentReadService,
            appointment_write_service_1.AppointmentWriteService,
            appointment_status_service_1.AppointmentStatusService,
            appointment_query_service_1.AppointmentQueryService,
            appointment_scheduling_service_1.AppointmentSchedulingService,
            appointment_statistics_service_1.AppointmentStatisticsService,
            appointment_recurring_service_1.AppointmentRecurringService,
            waitlist_service_1.WaitlistService,
            reminder_service_1.ReminderService,
            app_config_service_1.AppConfigService,
        ],
        exports: [
            appointment_service_1.AppointmentService,
            appointment_read_service_1.AppointmentReadService,
            appointment_write_service_1.AppointmentWriteService,
            appointment_status_service_1.AppointmentStatusService,
            appointment_query_service_1.AppointmentQueryService,
            appointment_scheduling_service_1.AppointmentSchedulingService,
            appointment_statistics_service_1.AppointmentStatisticsService,
            appointment_recurring_service_1.AppointmentRecurringService,
            waitlist_service_1.WaitlistService,
            reminder_service_1.ReminderService,
        ],
    })
], AppointmentModule);
//# sourceMappingURL=appointment.module.js.map