"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeTransitionModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const grade_transition_controller_1 = require("./grade-transition.controller");
const grade_transition_service_1 = require("./grade-transition.service");
const models_1 = require("../database/models");
let GradeTransitionModule = class GradeTransitionModule {
};
exports.GradeTransitionModule = GradeTransitionModule;
exports.GradeTransitionModule = GradeTransitionModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([models_1.Student])],
        controllers: [grade_transition_controller_1.GradeTransitionController],
        providers: [grade_transition_service_1.GradeTransitionService],
        exports: [grade_transition_service_1.GradeTransitionService],
    })
], GradeTransitionModule);
//# sourceMappingURL=grade-transition.module.js.map