"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const request_context_service_1 = require("./request-context.service");
const context_interceptor_1 = require("./context.interceptor");
let ContextModule = class ContextModule {
    configure(consumer) {
        consumer.apply(context_interceptor_1.ContextMiddleware).forRoutes('*');
    }
};
exports.ContextModule = ContextModule;
exports.ContextModule = ContextModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            request_context_service_1.RequestContextService,
            context_interceptor_1.ContextInterceptor,
            context_interceptor_1.ContextMiddleware,
            context_interceptor_1.ContextGuard,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: context_interceptor_1.ContextInterceptor,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: context_interceptor_1.ContextGuard,
            },
        ],
        exports: [
            request_context_service_1.RequestContextService,
            context_interceptor_1.ContextInterceptor,
            context_interceptor_1.ContextMiddleware,
            context_interceptor_1.ContextGuard,
        ],
    })
], ContextModule);
//# sourceMappingURL=context.module.js.map