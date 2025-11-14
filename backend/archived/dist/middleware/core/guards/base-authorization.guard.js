"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAuthorizationGuard = void 0;
const common_1 = require("@nestjs/common");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
class BaseAuthorizationGuard {
    reflector;
    rbacPermissionService;
    logger;
    config;
    constructor(reflector, rbacPermissionService, config) {
        this.reflector = reflector;
        this.rbacPermissionService = rbacPermissionService;
        this.config = {
            enableHierarchy: config?.enableHierarchy ?? true,
            enableAuditLogging: config?.enableAuditLogging ?? true,
            customPermissions: config?.customPermissions ?? {},
        };
    }
    getUserFromContext(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        return user;
    }
    checkPermissions(user, requiredPermissions, context, auditType = 'permission') {
        const permissionsMode = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_MODE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) || 'all';
        const hasPermission = permissionsMode === 'all'
            ? this.rbacPermissionService.hasAllPermissions(user, requiredPermissions, this.config)
            : this.rbacPermissionService.hasAnyPermission(user, requiredPermissions, this.config);
        if (!hasPermission) {
            const missingPermissions = this.rbacPermissionService.getMissingPermissions(user, requiredPermissions, this.config);
            if (this.config.enableAuditLogging) {
                this.rbacPermissionService.logAuthorizationAttempt(auditType, false, user, requiredPermissions, missingPermissions, permissionsMode);
            }
            throw new common_1.ForbiddenException(`Insufficient permissions. Required (${permissionsMode}): ${requiredPermissions.join(', ')}`);
        }
        if (this.config.enableAuditLogging) {
            this.rbacPermissionService.logAuthorizationAttempt(auditType, true, user, requiredPermissions, [], permissionsMode);
        }
        return true;
    }
    getRequiredPermissions(context) {
        return this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    }
}
exports.BaseAuthorizationGuard = BaseAuthorizationGuard;
//# sourceMappingURL=base-authorization.guard.js.map