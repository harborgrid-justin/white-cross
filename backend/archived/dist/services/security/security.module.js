"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const security_controller_1 = require("./security.controller");
const services_1 = require("./services");
const guards_1 = require("./guards");
const interceptors_1 = require("./interceptors");
const models_1 = require("../../database/models");
let SecurityModule = class SecurityModule {
};
exports.SecurityModule = SecurityModule;
exports.SecurityModule = SecurityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                models_1.IpRestriction,
                models_1.SecurityIncident,
                models_1.LoginAttempt,
                models_1.Session,
            ]),
        ],
        controllers: [security_controller_1.SecurityController],
        providers: [
            services_1.IpRestrictionService,
            services_1.SecurityIncidentService,
            services_1.ThreatDetectionService,
            services_1.SessionManagementService,
            guards_1.IpRestrictionGuard,
            guards_1.SecurityPolicyGuard,
            interceptors_1.SecurityLoggingInterceptor,
        ],
        exports: [
            services_1.IpRestrictionService,
            services_1.SecurityIncidentService,
            services_1.ThreatDetectionService,
            services_1.SessionManagementService,
            guards_1.IpRestrictionGuard,
            guards_1.SecurityPolicyGuard,
            interceptors_1.SecurityLoggingInterceptor,
        ],
    })
], SecurityModule);
//# sourceMappingURL=security.module.js.map