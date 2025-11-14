"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthDomainModule = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const health_domain_service_1 = require("./health-domain.service");
const health_domain_facade_service_1 = require("./services/health-domain-facade.service");
const health_domain_controller_1 = require("./health-domain.controller");
const vaccination_module_1 = require("../health-record/vaccination/vaccination.module");
const allergy_module_1 = require("../health-record/allergy/allergy.module");
const chronic_condition_module_1 = require("../services/chronic-condition/chronic-condition.module");
const vitals_module_1 = require("../health-record/vitals/vitals.module");
const search_module_1 = require("../health-record/search/search.module");
const statistics_module_1 = require("../health-record/statistics/statistics.module");
const import_export_module_1 = require("../health-record/import-export/import-export.module");
const validation_module_1 = require("../health-record/validation/validation.module");
let HealthDomainModule = class HealthDomainModule {
};
exports.HealthDomainModule = HealthDomainModule;
exports.HealthDomainModule = HealthDomainModule = __decorate([
    (0, common_1.Module)({
        imports: [
            vaccination_module_1.VaccinationModule,
            allergy_module_1.AllergyModule,
            chronic_condition_module_1.ChronicConditionModule,
            vitals_module_1.VitalsModule,
            search_module_1.SearchModule,
            statistics_module_1.StatisticsModule,
            import_export_module_1.ImportExportModule,
            validation_module_1.ValidationModule,
            event_emitter_1.EventEmitterModule.forRoot(),
        ],
        providers: [health_domain_service_1.HealthDomainService, health_domain_facade_service_1.HealthDomainFacadeService],
        controllers: [health_domain_controller_1.HealthDomainController],
        exports: [health_domain_service_1.HealthDomainService, health_domain_facade_service_1.HealthDomainFacadeService],
    })
], HealthDomainModule);
//# sourceMappingURL=health-domain.module.js.map