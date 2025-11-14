"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiSearchModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ai_search_service_1 = require("./ai-search.service");
const ai_search_controller_1 = require("./ai-search.controller");
let AiSearchModule = class AiSearchModule {
};
exports.AiSearchModule = AiSearchModule;
exports.AiSearchModule = AiSearchModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [ai_search_controller_1.AiSearchController],
        providers: [ai_search_service_1.AiSearchService],
        exports: [ai_search_service_1.AiSearchService],
    })
], AiSearchModule);
//# sourceMappingURL=ai-search.module.js.map