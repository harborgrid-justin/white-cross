"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdministrationModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const administration_controller_1 = require("./administration.controller");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const models_5 = require("../../database/models");
const models_6 = require("../../database/models");
const models_7 = require("../../database/models");
const models_8 = require("../../database/models");
const models_9 = require("../../database/models");
const audit_service_1 = require("./services/audit.service");
const backup_service_1 = require("./services/backup.service");
const configuration_service_1 = require("./services/configuration.service");
const district_service_1 = require("./services/district.service");
const school_service_1 = require("./services/school.service");
const license_service_1 = require("./services/license.service");
const performance_service_1 = require("./services/performance.service");
const settings_service_1 = require("./services/settings.service");
const system_health_service_1 = require("./services/system-health.service");
const training_service_1 = require("./services/training.service");
const user_management_service_1 = require("./services/user-management.service");
let AdministrationModule = class AdministrationModule {
};
exports.AdministrationModule = AdministrationModule;
exports.AdministrationModule = AdministrationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                models_1.District,
                models_2.School,
                models_3.License,
                models_4.SystemConfig,
                models_5.ConfigurationHistory,
                models_6.AuditLog,
                models_7.BackupLog,
                models_8.PerformanceMetric,
                models_9.TrainingModule,
            ]),
        ],
        controllers: [administration_controller_1.AdministrationController],
        providers: [
            audit_service_1.AuditService,
            backup_service_1.BackupService,
            configuration_service_1.ConfigurationService,
            district_service_1.DistrictService,
            school_service_1.SchoolService,
            license_service_1.LicenseService,
            performance_service_1.PerformanceService,
            settings_service_1.SettingsService,
            system_health_service_1.SystemHealthService,
            training_service_1.TrainingService,
            user_management_service_1.UserManagementService,
        ],
        exports: [
            audit_service_1.AuditService,
            configuration_service_1.ConfigurationService,
            district_service_1.DistrictService,
            school_service_1.SchoolService,
            license_service_1.LicenseService,
        ],
    })
], AdministrationModule);
//# sourceMappingURL=administration.module.js.map