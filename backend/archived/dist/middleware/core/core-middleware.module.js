"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreMiddlewareModule = void 0;
const common_1 = require("@nestjs/common");
const session_middleware_1 = require("./middleware/session.middleware");
const rbac_guard_1 = require("./guards/rbac.guard");
const permissions_guard_1 = require("./guards/permissions.guard");
const rbac_permission_service_1 = require("./services/rbac-permission.service");
const request_context_middleware_1 = require("../../common/middleware/request-context.middleware");
let CoreMiddlewareModule = class CoreMiddlewareModule {
    configure(consumer) {
        consumer
            .apply(request_context_middleware_1.RequestContextMiddleware)
            .forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
        consumer
            .apply(session_middleware_1.SessionMiddleware)
            .exclude({ path: 'auth/login', method: common_1.RequestMethod.POST }, { path: 'auth/register', method: common_1.RequestMethod.POST }, { path: 'auth/logout', method: common_1.RequestMethod.POST }, { path: 'auth/refresh', method: common_1.RequestMethod.POST }, { path: 'health', method: common_1.RequestMethod.GET }, { path: 'api/health', method: common_1.RequestMethod.GET }, { path: 'api/docs', method: common_1.RequestMethod.GET }, { path: 'api/docs-json', method: common_1.RequestMethod.GET }, { path: 'webhook/*path', method: common_1.RequestMethod.ALL }, { path: 'public/*path', method: common_1.RequestMethod.ALL })
            .forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
    }
};
exports.CoreMiddlewareModule = CoreMiddlewareModule;
exports.CoreMiddlewareModule = CoreMiddlewareModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            request_context_middleware_1.RequestContextMiddleware,
            session_middleware_1.SessionMiddleware,
            rbac_permission_service_1.RbacPermissionService,
            rbac_guard_1.RbacGuard,
            permissions_guard_1.PermissionsGuard,
        ],
        exports: [
            request_context_middleware_1.RequestContextMiddleware,
            session_middleware_1.SessionMiddleware,
            rbac_permission_service_1.RbacPermissionService,
            rbac_guard_1.RbacGuard,
            permissions_guard_1.PermissionsGuard,
        ],
    })
], CoreMiddlewareModule);
//# sourceMappingURL=core-middleware.module.js.map