"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessControlModule = void 0;
const common_1 = require("@nestjs/common");
const access_control_service_1 = require("./access-control.service");
const access_control_controller_1 = require("./access-control.controller");
const permission_cache_service_1 = require("./services/permission-cache.service");
const role_management_service_1 = require("./services/role-management.service");
const permission_management_service_1 = require("./services/permission-management.service");
const user_role_assignment_service_1 = require("./services/user-role-assignment.service");
const session_management_service_1 = require("./services/session-management.service");
const security_monitoring_service_1 = require("./services/security-monitoring.service");
const ip_restriction_management_service_1 = require("./services/ip-restriction-management.service");
const system_initialization_service_1 = require("./services/system-initialization.service");
const roles_guard_1 = require("./guards/roles.guard");
const permissions_guard_1 = require("./guards/permissions.guard");
const ip_restriction_guard_1 = require("./guards/ip-restriction.guard");
let AccessControlModule = class AccessControlModule {
};
exports.AccessControlModule = AccessControlModule;
exports.AccessControlModule = AccessControlModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [
            access_control_service_1.AccessControlService,
            role_management_service_1.RoleManagementService,
            permission_management_service_1.PermissionManagementService,
            user_role_assignment_service_1.UserRoleAssignmentService,
            session_management_service_1.SessionManagementService,
            security_monitoring_service_1.SecurityMonitoringService,
            ip_restriction_management_service_1.IpRestrictionManagementService,
            system_initialization_service_1.SystemInitializationService,
            permission_cache_service_1.PermissionCacheService,
            roles_guard_1.RolesGuard,
            permissions_guard_1.PermissionsGuard,
            ip_restriction_guard_1.IpRestrictionGuard,
        ],
        controllers: [access_control_controller_1.AccessControlController],
        exports: [
            access_control_service_1.AccessControlService,
            permission_cache_service_1.PermissionCacheService,
            roles_guard_1.RolesGuard,
            permissions_guard_1.PermissionsGuard,
            ip_restriction_guard_1.IpRestrictionGuard,
        ],
    })
], AccessControlModule);
//# sourceMappingURL=access-control.module.js.map