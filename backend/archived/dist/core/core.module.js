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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const audit_1 = require("../services/audit");
const auth_1 = require("../services/auth");
const common_2 = require("../common");
const transform_interceptor_1 = require("../common/interceptors/transform.interceptor");
const error_mapping_interceptor_1 = require("../common/interceptors/error-mapping.interceptor");
let CoreModule = class CoreModule {
    constructor(parentModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it ONLY in AppModule.');
        }
    }
};
exports.CoreModule = CoreModule;
exports.CoreModule = CoreModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [audit_1.AuditModule],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: auth_1.RolesGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: common_2.LoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: common_2.SanitizationInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: common_2.TimeoutInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: error_mapping_interceptor_1.ErrorMappingInterceptor,
            },
            {
                provide: core_1.APP_PIPE,
                useFactory: () => new common_1.ValidationPipe({
                    transform: true,
                    whitelist: true,
                    forbidNonWhitelisted: true,
                    transformOptions: {
                        enableImplicitConversion: true,
                    },
                    disableErrorMessages: process.env.NODE_ENV === 'production',
                    validationError: {
                        target: false,
                        value: false,
                    },
                }),
            },
            {
                provide: core_1.APP_FILTER,
                useClass: common_2.AllExceptionsFilter,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: common_2.HttpExceptionFilter,
            },
        ],
        exports: [],
    }),
    __param(0, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [CoreModule])
], CoreModule);
//# sourceMappingURL=core.module.js.map