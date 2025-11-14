"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChronicConditionModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const chronic_condition_controller_1 = require("./chronic-condition.controller");
const chronic_condition_service_1 = require("./chronic-condition.service");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
let ChronicConditionModule = class ChronicConditionModule {
};
exports.ChronicConditionModule = ChronicConditionModule;
exports.ChronicConditionModule = ChronicConditionModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([models_1.ChronicCondition, models_2.Student])],
        controllers: [chronic_condition_controller_1.HealthRecordChronicConditionController],
        providers: [chronic_condition_service_1.ChronicConditionService],
        exports: [chronic_condition_service_1.ChronicConditionService],
    })
], ChronicConditionModule);
//# sourceMappingURL=chronic-condition.module.js.map