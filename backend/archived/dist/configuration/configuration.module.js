"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_module_1 = require("../database/database.module");
const models_1 = require("../database/models");
const models_2 = require("../database/models");
const configuration_service_1 = require("./services/configuration.service");
const config_crud_service_1 = require("./services/config-crud.service");
const config_validation_service_1 = require("./services/config-validation.service");
const config_history_service_1 = require("./services/config-history.service");
const config_import_export_service_1 = require("./services/config-import-export.service");
const config_statistics_service_1 = require("./services/config-statistics.service");
const configuration_controller_1 = require("./configuration.controller");
let ConfigurationModule = class ConfigurationModule {
};
exports.ConfigurationModule = ConfigurationModule;
exports.ConfigurationModule = ConfigurationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([models_1.SystemConfig, models_2.ConfigurationHistory]),
            database_module_1.DatabaseModule,
        ],
        controllers: [configuration_controller_1.ConfigurationController],
        providers: [
            configuration_service_1.ConfigurationService,
            config_crud_service_1.ConfigCrudService,
            config_validation_service_1.ConfigValidationService,
            config_history_service_1.ConfigHistoryService,
            config_import_export_service_1.ConfigImportExportService,
            config_statistics_service_1.ConfigStatisticsService,
        ],
        exports: [configuration_service_1.ConfigurationService],
    })
], ConfigurationModule);
//# sourceMappingURL=configuration.module.js.map