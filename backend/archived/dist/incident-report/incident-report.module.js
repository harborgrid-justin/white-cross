"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentReportModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const incident_report_controller_1 = require("./incident-report.controller");
const incident_core_controller_1 = require("./controllers/incident-core.controller");
const incident_status_controller_1 = require("./controllers/incident-status.controller");
const incident_query_controller_1 = require("./controllers/incident-query.controller");
const incident_core_service_1 = require("./services/incident-core.service");
const incident_follow_up_service_1 = require("./services/incident-follow-up.service");
const incident_notification_service_1 = require("./services/incident-notification.service");
const incident_statistics_service_1 = require("./services/incident-statistics.service");
const incident_validation_service_1 = require("./services/incident-validation.service");
const incident_witness_service_1 = require("./services/incident-witness.service");
const incident_read_service_1 = require("./services/incident-read.service");
const incident_write_service_1 = require("./services/incident-write.service");
const incident_status_service_1 = require("./services/incident-status.service");
const models_1 = require("../database/models");
const models_2 = require("../database/models");
const models_3 = require("../database/models");
const models_4 = require("../database/models");
let IncidentReportModule = class IncidentReportModule {
};
exports.IncidentReportModule = IncidentReportModule;
exports.IncidentReportModule = IncidentReportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                models_1.IncidentReport,
                models_2.FollowUpAction,
                models_3.WitnessStatement,
                models_4.EmergencyContact,
            ]),
        ],
        controllers: [
            incident_report_controller_1.IncidentReportController,
            incident_core_controller_1.IncidentCoreController,
            incident_status_controller_1.IncidentStatusController,
            incident_query_controller_1.IncidentQueryController,
        ],
        providers: [
            incident_core_service_1.IncidentCoreService,
            incident_validation_service_1.IncidentValidationService,
            incident_notification_service_1.IncidentNotificationService,
            incident_follow_up_service_1.IncidentFollowUpService,
            incident_witness_service_1.IncidentWitnessService,
            incident_statistics_service_1.IncidentStatisticsService,
            incident_read_service_1.IncidentReadService,
            incident_write_service_1.IncidentWriteService,
            incident_status_service_1.IncidentStatusService,
        ],
        exports: [
            incident_core_service_1.IncidentCoreService,
            incident_validation_service_1.IncidentValidationService,
            incident_notification_service_1.IncidentNotificationService,
            incident_follow_up_service_1.IncidentFollowUpService,
            incident_witness_service_1.IncidentWitnessService,
            incident_statistics_service_1.IncidentStatisticsService,
            incident_read_service_1.IncidentReadService,
            incident_write_service_1.IncidentWriteService,
            incident_status_service_1.IncidentStatusService,
        ],
    })
], IncidentReportModule);
//# sourceMappingURL=incident-report.module.js.map