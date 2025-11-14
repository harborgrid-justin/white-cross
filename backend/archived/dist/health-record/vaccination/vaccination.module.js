"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccinationModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const vaccination_service_1 = require("./vaccination.service");
const vaccination_controller_1 = require("./vaccination.controller");
const vaccination_schedule_helper_1 = require("./vaccination-schedule.helper");
const vaccination_compliance_helper_1 = require("./vaccination-compliance.helper");
const vaccination_crud_helper_1 = require("./vaccination-crud.helper");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
let VaccinationModule = class VaccinationModule {
};
exports.VaccinationModule = VaccinationModule;
exports.VaccinationModule = VaccinationModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([models_1.Vaccination, models_2.Student])],
        controllers: [vaccination_controller_1.VaccinationController],
        providers: [
            vaccination_service_1.VaccinationService,
            vaccination_schedule_helper_1.VaccinationScheduleHelper,
            vaccination_compliance_helper_1.VaccinationComplianceHelper,
            vaccination_crud_helper_1.VaccinationCrudHelper,
        ],
        exports: [vaccination_service_1.VaccinationService],
    })
], VaccinationModule);
//# sourceMappingURL=vaccination.module.js.map