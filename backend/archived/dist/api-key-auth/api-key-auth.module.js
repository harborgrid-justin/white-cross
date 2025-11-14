"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyAuthModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const api_key_auth_service_1 = require("./api-key-auth.service");
const api_key_auth_controller_1 = require("./api-key-auth.controller");
const api_key_guard_1 = require("./guards/api-key.guard");
const models_1 = require("../database/models");
let ApiKeyAuthModule = class ApiKeyAuthModule {
};
exports.ApiKeyAuthModule = ApiKeyAuthModule;
exports.ApiKeyAuthModule = ApiKeyAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([models_1.ApiKey]), config_1.ConfigModule],
        controllers: [api_key_auth_controller_1.ApiKeyAuthController],
        providers: [api_key_auth_service_1.ApiKeyAuthService, api_key_guard_1.ApiKeyGuard],
        exports: [api_key_auth_service_1.ApiKeyAuthService, api_key_guard_1.ApiKeyGuard],
    })
], ApiKeyAuthModule);
//# sourceMappingURL=api-key-auth.module.js.map