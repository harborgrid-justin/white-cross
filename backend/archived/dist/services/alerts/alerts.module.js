"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const alerts_service_1 = require("./alerts.service");
const alerts_controller_1 = require("./alerts.controller");
const alert_delivery_service_1 = require("./services/alert-delivery.service");
const alert_preferences_service_1 = require("./services/alert-preferences.service");
const alert_statistics_service_1 = require("./services/alert-statistics.service");
const alert_retry_service_1 = require("./services/alert-retry.service");
const database_1 = require("../../database");
const auth_1 = require("../auth");
let AlertsModule = class AlertsModule {
};
exports.AlertsModule = AlertsModule;
exports.AlertsModule = AlertsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_1.AuthModule,
            config_1.ConfigModule,
            sequelize_1.SequelizeModule.forFeature([database_1.Alert, database_1.AlertPreferences, database_1.DeliveryLog]),
        ],
        controllers: [alerts_controller_1.AlertsController],
        providers: [
            alerts_service_1.AlertsService,
            alert_delivery_service_1.AlertDeliveryService,
            alert_preferences_service_1.AlertPreferencesService,
            alert_statistics_service_1.AlertStatisticsService,
            alert_retry_service_1.AlertRetryService,
        ],
        exports: [alerts_service_1.AlertsService],
    })
], AlertsModule);
//# sourceMappingURL=alerts.module.js.map