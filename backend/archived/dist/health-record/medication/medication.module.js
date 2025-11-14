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
const medication_controller_1 = require("./medication.controller");
const medication_service_1 = require("./medication.service");
const models_1 = require("../../database/models");
let MedicationModule = class MedicationModule {
};
exports.MedicationModule = MedicationModule;
exports.MedicationModule = MedicationModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([models_1.Medication])],
        controllers: [medication_controller_1.HealthRecordMedicationController],
        providers: [medication_service_1.MedicationService],
        exports: [medication_service_1.MedicationService],
    })
], MedicationModule);
//# sourceMappingURL=medication.module.js.map