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
exports.RbacGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../../../services/auth/decorators/roles.decorator");
const rbac_permission_service_1 = require("../services/rbac-permission.service");
const base_authorization_guard_1 = require("./base-authorization.guard");
let RbacGuard = class RbacGuard extends base_authorization_guard_1.BaseAuthorizationGuard {
    constructor(reflector, rbacPermissionService, config) {
        super(reflector, rbacPermissionService, config);
    }
    canActivate(context) {
        const requiredRoles = this.getRequiredRoles(context);
        const requiredPermissions = this.getRequiredPermissions(context);
        if ((!requiredRoles || requiredRoles.length === 0) &&
            (!requiredPermissions || requiredPermissions.length === 0)) {
            return true;
        }
        const user = this.getUserFromContext(context);
        if (requiredRoles && requiredRoles.length > 0) {
            const hasRole = this.rbacPermissionService.hasAnyRole(user, requiredRoles, this.config);
            if (!hasRole) {
                if (this.config.enableAuditLogging) {
                    this.rbacPermissionService.logAuthorizationAttempt('role', false, user, requiredRoles);
                }
                throw new common_1.ForbiddenException(`Insufficient role privileges. Required: ${requiredRoles.join(', ')}, Current: ${user.role}`);
            }
        }
        if (requiredPermissions && requiredPermissions.length > 0) {
            this.checkPermissions(user, requiredPermissions, context, 'rbac');
        }
        if (this.config.enableAuditLogging) {
            this.rbacPermissionService.logAuthorizationAttempt('rbac', true, user, [...(requiredRoles || []), ...(requiredPermissions || [])]);
        }
        return true;
    }
    getRequiredRoles(context) {
        return this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
    }
};
exports.RbacGuard = RbacGuard;
exports.RbacGuard = RbacGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [core_1.Reflector,
        rbac_permission_service_1.RbacPermissionService, Object])
], RbacGuard);
//# sourceMappingURL=rbac.guard.js.map