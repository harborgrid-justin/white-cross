"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseFeaturesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const enterprise_features_service_1 = require("./enterprise-features.service");
const base_1 = require("../common/base");
let EnterpriseFeaturesController = class EnterpriseFeaturesController extends base_1.BaseController {
    enterpriseFeaturesService;
    constructor(enterpriseFeaturesService) {
        super();
        this.enterpriseFeaturesService = enterpriseFeaturesService;
    }
};
exports.EnterpriseFeaturesController = EnterpriseFeaturesController;
exports.EnterpriseFeaturesController = EnterpriseFeaturesController = __decorate([
    (0, swagger_1.ApiTags)('Enterprise Features'),
    (0, common_1.Controller)('enterprise-features'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [enterprise_features_service_1.EnterpriseFeaturesService])
], EnterpriseFeaturesController);
//# sourceMappingURL=enterprise-features.controller.js.map