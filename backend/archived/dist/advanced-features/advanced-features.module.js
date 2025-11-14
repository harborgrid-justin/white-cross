"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedFeaturesModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const advanced_features_controller_1 = require("./advanced-features.controller");
const advanced_features_service_1 = require("./advanced-features.service");
let AdvancedFeaturesModule = class AdvancedFeaturesModule {
};
exports.AdvancedFeaturesModule = AdvancedFeaturesModule;
exports.AdvancedFeaturesModule = AdvancedFeaturesModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [advanced_features_controller_1.AdvancedFeaturesController],
        providers: [advanced_features_service_1.AdvancedFeaturesService],
        exports: [advanced_features_service_1.AdvancedFeaturesService],
    })
], AdvancedFeaturesModule);
//# sourceMappingURL=advanced-features.module.js.map