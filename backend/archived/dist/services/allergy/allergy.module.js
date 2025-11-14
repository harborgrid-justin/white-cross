"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllergyModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../../database");
const models_1 = require("../../database/models");
const allergy_crud_service_1 = require("./services/allergy-crud.service");
const allergy_query_service_1 = require("./services/allergy-query.service");
const allergy_safety_service_1 = require("./services/allergy-safety.service");
const allergy_controller_1 = require("./allergy.controller");
let AllergyModule = class AllergyModule {
};
exports.AllergyModule = AllergyModule;
exports.AllergyModule = AllergyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                database_1.Allergy,
                models_1.Student,
            ]),
        ],
        controllers: [allergy_controller_1.AllergyController],
        providers: [
            allergy_crud_service_1.AllergyCrudService,
            allergy_query_service_1.AllergyQueryService,
            allergy_safety_service_1.AllergySafetyService,
        ],
        exports: [
            allergy_crud_service_1.AllergyCrudService,
            allergy_query_service_1.AllergyQueryService,
            allergy_safety_service_1.AllergySafetyService,
        ],
    })
], AllergyModule);
//# sourceMappingURL=allergy.module.js.map