"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptersModule = void 0;
const common_1 = require("@nestjs/common");
const express_adapter_1 = require("./express/express.adapter");
const hapi_adapter_1 = require("./hapi/hapi.adapter");
const base_adapter_1 = require("./shared/base.adapter");
let AdaptersModule = class AdaptersModule {
};
exports.AdaptersModule = AdaptersModule;
exports.AdaptersModule = AdaptersModule = __decorate([
    (0, common_1.Module)({
        providers: [
            express_adapter_1.ExpressMiddlewareAdapter,
            express_adapter_1.ExpressMiddlewareUtils,
            hapi_adapter_1.HapiMiddlewareAdapter,
            hapi_adapter_1.HapiMiddlewareUtils,
            base_adapter_1.HealthcareMiddlewareUtils,
            base_adapter_1.ResponseUtils,
            base_adapter_1.RequestValidationUtils,
        ],
        exports: [
            express_adapter_1.ExpressMiddlewareAdapter,
            express_adapter_1.ExpressMiddlewareUtils,
            hapi_adapter_1.HapiMiddlewareAdapter,
            hapi_adapter_1.HapiMiddlewareUtils,
            base_adapter_1.HealthcareMiddlewareUtils,
            base_adapter_1.ResponseUtils,
            base_adapter_1.RequestValidationUtils,
        ],
    })
], AdaptersModule);
//# sourceMappingURL=adapters.module.js.map