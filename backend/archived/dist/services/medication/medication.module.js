"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const event_emitter_1 = require("@nestjs/event-emitter");
const medication_controller_1 = require("./medication.controller");
const medication_service_1 = require("./services/medication.service");
const medication_repository_1 = require("./medication.repository");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const audit_module_1 = require("../audit/audit.module");
let MedicationModule = class MedicationModule {
};
exports.MedicationModule = MedicationModule;
exports.MedicationModule = MedicationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([models_1.StudentMedication, models_2.Medication]),
            event_emitter_1.EventEmitterModule.forRoot(),
            audit_module_1.AuditModule,
        ],
        controllers: [medication_controller_1.MedicationController],
        providers: [medication_service_1.MedicationService, medication_repository_1.MedicationRepository],
        exports: [medication_service_1.MedicationService],
    })
], MedicationModule);
//# sourceMappingURL=medication.module.js.map