"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRiskAssessmentModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const health_risk_assessment_controller_1 = require("./health-risk-assessment.controller");
const health_risk_assessment_service_1 = require("./health-risk-assessment.service");
const models_1 = require("../database/models");
const models_2 = require("../database/models");
const models_3 = require("../database/models");
const models_4 = require("../database/models");
const models_5 = require("../database/models");
let HealthRiskAssessmentModule = class HealthRiskAssessmentModule {
};
exports.HealthRiskAssessmentModule = HealthRiskAssessmentModule;
exports.HealthRiskAssessmentModule = HealthRiskAssessmentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                models_1.Student,
                models_2.Allergy,
                models_3.ChronicCondition,
                models_4.StudentMedication,
                models_5.IncidentReport,
            ]),
        ],
        controllers: [health_risk_assessment_controller_1.HealthRiskAssessmentController],
        providers: [health_risk_assessment_service_1.HealthRiskAssessmentService],
    })
], HealthRiskAssessmentModule);
//# sourceMappingURL=health-risk-assessment.module.js.map