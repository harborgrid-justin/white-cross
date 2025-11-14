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
exports.RbacPermissionService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
const rbac_types_1 = require("../types/rbac.types");
let RbacPermissionService = class RbacPermissionService extends base_1.BaseService {
    constructor() {
        super('RbacPermissionService');
    }
    hasPermission(user, requiredPermission, config) {
        const userRole = user.role;
        if (user.permissions && user.permissions.includes(requiredPermission)) {
            return true;
        }
        const rolePermissions = rbac_types_1.ROLE_PERMISSIONS[userRole] || [];
        if (rolePermissions.includes(requiredPermission)) {
            return true;
        }
        if (config.enableHierarchy) {
            const userLevel = rbac_types_1.ROLE_HIERARCHY[userRole];
            for (const [role, level] of Object.entries(rbac_types_1.ROLE_HIERARCHY)) {
                if (level < userLevel) {
                    const inheritedPermissions = rbac_types_1.ROLE_PERMISSIONS[role] || [];
                    if (inheritedPermissions.includes(requiredPermission)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    hasAnyPermission(user, requiredPermissions, config) {
        return requiredPermissions.some((permission) => this.hasPermission(user, permission, config));
    }
    hasAllPermissions(user, requiredPermissions, config) {
        return requiredPermissions.every((permission) => this.hasPermission(user, permission, config));
    }
    hasRole(user, requiredRole, config) {
        const userRole = user.role;
        if (!config.enableHierarchy) {
            return userRole === requiredRole;
        }
        const userLevel = rbac_types_1.ROLE_HIERARCHY[userRole];
        const requiredLevel = rbac_types_1.ROLE_HIERARCHY[requiredRole];
        return userLevel >= requiredLevel;
    }
    hasAnyRole(user, requiredRoles, config) {
        return requiredRoles.some((role) => this.hasRole(user, role, config));
    }
    getMissingPermissions(user, requiredPermissions, config) {
        return requiredPermissions.filter((permission) => !this.hasPermission(user, permission, config));
    }
    logAuthorizationAttempt(type, success, user, required, missing = [], mode) {
        const logLevel = success ? 'debug' : 'warn';
        const message = `${type.charAt(0).toUpperCase() + type.slice(1)} authorization ${success ? 'successful' : 'failed'}`;
        const logData = {
            userId: user.userId,
            userRole: user.role,
            [`required${type.charAt(0).toUpperCase() + type.slice(1)}s`]: required,
            ...(mode && { mode }),
            ...(missing.length > 0 && { [`missing${type.charAt(0).toUpperCase() + type.slice(1)}s`]: missing }),
        };
        this.logger[logLevel](message, logData);
    }
};
exports.RbacPermissionService = RbacPermissionService;
exports.RbacPermissionService = RbacPermissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RbacPermissionService);
//# sourceMappingURL=rbac-permission.service.js.map