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
exports.AdminDiscoveryGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const admin_only_decorator_1 = require("../decorators/admin-only.decorator");
const discovery_exceptions_1 = require("../exceptions/discovery.exceptions");
let AdminDiscoveryGuard = class AdminDiscoveryGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRole = this.reflector.getAllAndOverride(admin_only_decorator_1.ADMIN_ONLY_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRole) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new discovery_exceptions_1.UnauthorizedDiscoveryAccessException(request.url, requiredRole);
        }
        if (!this.hasRequiredRole(user, requiredRole)) {
            throw new discovery_exceptions_1.UnauthorizedDiscoveryAccessException(request.url, requiredRole);
        }
        return true;
    }
    hasRequiredRole(user, requiredRole) {
        const roleHierarchy = {
            user: 1,
            moderator: 2,
            admin: 3,
            super_admin: 4,
        };
        const userRoleLevel = roleHierarchy[user.role] || 0;
        const requiredRoleLevel = roleHierarchy[requiredRole] || 999;
        if (userRoleLevel >= requiredRoleLevel) {
            return true;
        }
        if (user.permissions) {
            const discoveryPermissions = [
                'discovery:read',
                'discovery:admin',
                'system:admin',
            ];
            return discoveryPermissions.some((permission) => user.permissions.includes(permission));
        }
        return false;
    }
};
exports.AdminDiscoveryGuard = AdminDiscoveryGuard;
exports.AdminDiscoveryGuard = AdminDiscoveryGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], AdminDiscoveryGuard);
//# sourceMappingURL=admin-discovery.guard.js.map