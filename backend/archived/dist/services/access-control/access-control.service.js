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
exports.AccessControlService = void 0;
const common_1 = require("@nestjs/common");
const role_management_service_1 = require("./services/role-management.service");
const permission_management_service_1 = require("./services/permission-management.service");
const user_role_assignment_service_1 = require("./services/user-role-assignment.service");
const session_management_service_1 = require("./services/session-management.service");
const security_monitoring_service_1 = require("./services/security-monitoring.service");
const ip_restriction_management_service_1 = require("./services/ip-restriction-management.service");
const system_initialization_service_1 = require("./services/system-initialization.service");
const base_1 = require("../../common/base");
let AccessControlService = class AccessControlService extends base_1.BaseService {
    roleManagementService;
    permissionManagementService;
    userRoleAssignmentService;
    sessionManagementService;
    securityMonitoringService;
    ipRestrictionManagementService;
    systemInitializationService;
    constructor(roleManagementService, permissionManagementService, userRoleAssignmentService, sessionManagementService, securityMonitoringService, ipRestrictionManagementService, systemInitializationService) {
        super("AccessControlService");
        this.roleManagementService = roleManagementService;
        this.permissionManagementService = permissionManagementService;
        this.userRoleAssignmentService = userRoleAssignmentService;
        this.sessionManagementService = sessionManagementService;
        this.securityMonitoringService = securityMonitoringService;
        this.ipRestrictionManagementService = ipRestrictionManagementService;
        this.systemInitializationService = systemInitializationService;
    }
    async getRoles() {
        return this.roleManagementService.getRoles();
    }
    async getRoleById(id) {
        return this.roleManagementService.getRoleById(id);
    }
    async createRole(data, auditUserId) {
        return this.roleManagementService.createRole(data, auditUserId);
    }
    async updateRole(id, data, auditUserId) {
        return this.roleManagementService.updateRole(id, data, auditUserId);
    }
    async deleteRole(id, auditUserId) {
        return this.roleManagementService.deleteRole(id, auditUserId);
    }
    async getPermissions() {
        return this.permissionManagementService.getPermissions();
    }
    async createPermission(data) {
        return this.permissionManagementService.createPermission(data);
    }
    async assignPermissionToRole(roleId, permissionId, auditUserId) {
        return this.permissionManagementService.assignPermissionToRole(roleId, permissionId, auditUserId);
    }
    async removePermissionFromRole(roleId, permissionId, auditUserId) {
        return this.permissionManagementService.removePermissionFromRole(roleId, permissionId, auditUserId);
    }
    async assignRoleToUser(userId, roleId, auditUserId, bypassPrivilegeCheck = false) {
        return this.userRoleAssignmentService.assignRoleToUser(userId, roleId, auditUserId, bypassPrivilegeCheck);
    }
    async removeRoleFromUser(userId, roleId) {
        return this.userRoleAssignmentService.removeRoleFromUser(userId, roleId);
    }
    async getUserPermissions(userId, bypassCache = false) {
        return this.userRoleAssignmentService.getUserPermissions(userId, bypassCache);
    }
    async checkPermission(userId, resource, action) {
        return this.userRoleAssignmentService.checkPermission(userId, resource, action);
    }
    async createSession(data) {
        return this.sessionManagementService.createSession(data);
    }
    async getUserSessions(userId) {
        return this.sessionManagementService.getUserSessions(userId);
    }
    async updateSessionActivity(token, ipAddress) {
        return this.sessionManagementService.updateSessionActivity(token, ipAddress);
    }
    async deleteSession(token) {
        return this.sessionManagementService.deleteSession(token);
    }
    async deleteAllUserSessions(userId) {
        return this.sessionManagementService.deleteAllUserSessions(userId);
    }
    async cleanupExpiredSessions() {
        return this.sessionManagementService.cleanupExpiredSessions();
    }
    async logLoginAttempt(data) {
        return this.securityMonitoringService.logLoginAttempt(data);
    }
    async getFailedLoginAttempts(email, minutes = 15) {
        return this.securityMonitoringService.getFailedLoginAttempts(email, minutes);
    }
    async getIpRestrictions() {
        return this.ipRestrictionManagementService.getIpRestrictions();
    }
    async addIpRestriction(data) {
        return this.ipRestrictionManagementService.addIpRestriction(data);
    }
    async removeIpRestriction(id) {
        return this.ipRestrictionManagementService.removeIpRestriction(id);
    }
    async checkIpRestriction(ipAddress, userId) {
        return this.ipRestrictionManagementService.checkIpRestriction(ipAddress, userId);
    }
    async createSecurityIncident(data) {
        return this.securityMonitoringService.createSecurityIncident(data);
    }
    async updateSecurityIncident(id, data) {
        return this.securityMonitoringService.updateSecurityIncident(id, data);
    }
    async getSecurityIncidents(page = 1, limit = 20, filters = {}) {
        return this.securityMonitoringService.getSecurityIncidents(page, limit, filters);
    }
    async getSecurityStatistics() {
        return this.securityMonitoringService.getSecurityStatistics();
    }
    async initializeDefaultRoles() {
        return this.systemInitializationService.initializeDefaultRoles();
    }
};
exports.AccessControlService = AccessControlService;
exports.AccessControlService = AccessControlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [role_management_service_1.RoleManagementService,
        permission_management_service_1.PermissionManagementService,
        user_role_assignment_service_1.UserRoleAssignmentService,
        session_management_service_1.SessionManagementService,
        security_monitoring_service_1.SecurityMonitoringService,
        ip_restriction_management_service_1.IpRestrictionManagementService,
        system_initialization_service_1.SystemInitializationService])
], AccessControlService);
//# sourceMappingURL=access-control.service.js.map