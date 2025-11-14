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
exports.AccessControlController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const access_control_service_1 = require("./access-control.service");
const permission_cache_service_1 = require("./services/permission-cache.service");
const create_role_dto_1 = require("./dto/create-role.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
const create_permission_dto_1 = require("./dto/create-permission.dto");
const assign_permission_to_role_dto_1 = require("./dto/assign-permission-to-role.dto");
const assign_role_to_user_dto_1 = require("./dto/assign-role-to-user.dto");
const check_permission_dto_1 = require("./dto/check-permission.dto");
const create_ip_restriction_dto_1 = require("./dto/create-ip-restriction.dto");
const create_security_incident_dto_1 = require("./dto/create-security-incident.dto");
const permissions_guard_1 = require("./guards/permissions.guard");
const roles_guard_1 = require("./guards/roles.guard");
const permissions_decorator_1 = require("./decorators/permissions.decorator");
const base_1 = require("../../common/base");
let AccessControlController = class AccessControlController extends base_1.BaseController {
    accessControlService;
    cacheService;
    constructor(accessControlService, cacheService) {
        super();
        this.accessControlService = accessControlService;
        this.cacheService = cacheService;
    }
    async getRoles() {
        return this.accessControlService.getRoles();
    }
    async getRoleById(id) {
        return this.accessControlService.getRoleById(id);
    }
    async createRole(createRoleDto, req) {
        return this.accessControlService.createRole(createRoleDto, req.user?.id);
    }
    async updateRole(id, updateRoleDto, req) {
        return this.accessControlService.updateRole(id, updateRoleDto, req.user?.id);
    }
    async deleteRole(id, req) {
        return this.accessControlService.deleteRole(id, req.user?.id);
    }
    async getPermissions() {
        return this.accessControlService.getPermissions();
    }
    async createPermission(createPermissionDto) {
        return this.accessControlService.createPermission(createPermissionDto);
    }
    async assignPermissionToRole(roleId, dto, req) {
        return this.accessControlService.assignPermissionToRole(roleId, dto.permissionId, req.user?.id);
    }
    async removePermissionFromRole(roleId, permissionId) {
        return this.accessControlService.removePermissionFromRole(roleId, permissionId);
    }
    async assignRoleToUser(userId, dto, req) {
        return this.accessControlService.assignRoleToUser(userId, dto.roleId, req.user?.id);
    }
    async removeRoleFromUser(userId, roleId) {
        return this.accessControlService.removeRoleFromUser(userId, roleId);
    }
    async getUserPermissions(userId, req) {
        if (userId !== req.user?.id) {
            const hasPermission = await this.accessControlService.checkPermission(req.user?.id, 'users', 'manage');
            if (!hasPermission) {
                throw new common_1.ForbiddenException('Insufficient permissions to view other users permissions');
            }
        }
        return this.accessControlService.getUserPermissions(userId);
    }
    async checkPermission(dto, req) {
        const hasPermission = await this.accessControlService.checkPermission(req.user?.id, dto.resource, dto.action);
        return { hasPermission };
    }
    async getUserSessions(userId, req) {
        if (userId !== req.user?.id) {
            const hasPermission = await this.accessControlService.checkPermission(req.user?.id, 'sessions', 'manage');
            if (!hasPermission) {
                throw new common_1.ForbiddenException('Insufficient permissions to view other users sessions');
            }
        }
        return this.accessControlService.getUserSessions(userId);
    }
    async deleteSession(token) {
        return this.accessControlService.deleteSession(token);
    }
    async deleteAllUserSessions(userId) {
        return this.accessControlService.deleteAllUserSessions(userId);
    }
    async getSecurityIncidents(page, limit, type, severity, status) {
        const filters = {};
        if (type)
            filters.type = type;
        if (severity)
            filters.severity = severity;
        if (status)
            filters.status = status;
        return this.accessControlService.getSecurityIncidents(Number(page) || 1, Number(limit) || 20, filters);
    }
    async createSecurityIncident(dto, req) {
        return this.accessControlService.createSecurityIncident({
            ...dto,
            detectedBy: dto.detectedBy || req.user?.id,
        });
    }
    async getSecurityStatistics() {
        return this.accessControlService.getSecurityStatistics();
    }
    async getIpRestrictions() {
        return this.accessControlService.getIpRestrictions();
    }
    async addIpRestriction(dto, req) {
        return this.accessControlService.addIpRestriction({
            ...dto,
            createdBy: dto.createdBy || req.user?.id,
        });
    }
    async removeIpRestriction(id) {
        return this.accessControlService.removeIpRestriction(id);
    }
    async initializeDefaultRoles() {
        await this.accessControlService.initializeDefaultRoles();
        return {
            message: 'Default roles and permissions initialized successfully',
        };
    }
    async getCacheStatistics() {
        return this.cacheService.getStatistics();
    }
    async clearCache() {
        this.cacheService.clearAll();
        return { message: 'All caches cleared' };
    }
    async clearUserCache(userId) {
        this.cacheService.invalidateUserPermissions(userId);
        return { message: 'User cache cleared' };
    }
};
exports.AccessControlController = AccessControlController;
__decorate([
    (0, common_1.Get)('roles'),
    (0, permissions_decorator_1.Permissions)('roles', 'read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all roles with permissions and assignments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Roles retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Get)('roles/:id'),
    (0, permissions_decorator_1.Permissions)('roles', 'read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get role by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role UUID', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "getRoleById", null);
__decorate([
    (0, common_1.Post)('roles'),
    (0, permissions_decorator_1.Permissions)('roles', 'create'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new role' }),
    (0, swagger_1.ApiBody)({ type: create_role_dto_1.CreateRoleDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Role created successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation error or duplicate name',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_dto_1.CreateRoleDto, Object]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "createRole", null);
__decorate([
    (0, common_1.Patch)('roles/:id'),
    (0, permissions_decorator_1.Permissions)('roles', 'update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing role' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role UUID', type: 'string' }),
    (0, swagger_1.ApiBody)({ type: update_role_dto_1.UpdateRoleDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role updated successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - cannot modify system roles',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_role_dto_1.UpdateRoleDto, Object]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)('roles/:id'),
    (0, permissions_decorator_1.Permissions)('roles', 'delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a role' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role UUID', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Role deleted successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot delete system role or role with users',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.Get)('permissions'),
    (0, permissions_decorator_1.Permissions)('permissions', 'read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all permissions' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permissions retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "getPermissions", null);
__decorate([
    (0, common_1.Post)('permissions'),
    (0, permissions_decorator_1.Permissions)('permissions', 'create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new permission' }),
    (0, swagger_1.ApiBody)({ type: create_permission_dto_1.CreatePermissionDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Permission created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_permission_dto_1.CreatePermissionDto]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "createPermission", null);
__decorate([
    (0, common_1.Post)('roles/:roleId/permissions'),
    (0, permissions_decorator_1.Permissions)('roles', 'update'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Assign permission to role' }),
    (0, swagger_1.ApiParam)({ name: 'roleId', description: 'Role UUID', type: 'string' }),
    (0, swagger_1.ApiBody)({ type: assign_permission_to_role_dto_1.AssignPermissionToRoleDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Permission assigned successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot modify system role or permission already assigned',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role or permission not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('roleId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_permission_to_role_dto_1.AssignPermissionToRoleDto, Object]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "assignPermissionToRole", null);
__decorate([
    (0, common_1.Delete)('roles/:roleId/permissions/:permissionId'),
    (0, permissions_decorator_1.Permissions)('roles', 'update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove permission from role' }),
    (0, swagger_1.ApiParam)({ name: 'roleId', description: 'Role UUID', type: 'string' }),
    (0, swagger_1.ApiParam)({
        name: 'permissionId',
        description: 'Permission UUID',
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Permission removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Permission assignment not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('roleId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Param)('permissionId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "removePermissionFromRole", null);
__decorate([
    (0, common_1.Post)('users/:userId/roles'),
    (0, permissions_decorator_1.Permissions)('users', 'manage'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Assign role to user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID', type: 'string' }),
    (0, swagger_1.ApiBody)({ type: assign_role_to_user_dto_1.AssignRoleToUserDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Role assigned successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - role already assigned or insufficient privileges',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User or role not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_role_to_user_dto_1.AssignRoleToUserDto, Object]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "assignRoleToUser", null);
__decorate([
    (0, common_1.Delete)('users/:userId/roles/:roleId'),
    (0, permissions_decorator_1.Permissions)('users', 'manage'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove role from user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID', type: 'string' }),
    (0, swagger_1.ApiParam)({ name: 'roleId', description: 'Role UUID', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Role removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role assignment not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Param)('roleId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "removeRoleFromUser", null);
__decorate([
    (0, common_1.Get)('users/:userId/permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user permissions' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User permissions retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "getUserPermissions", null);
__decorate([
    (0, common_1.Post)('check-permission'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if current user has a specific permission' }),
    (0, swagger_1.ApiBody)({ type: check_permission_dto_1.CheckPermissionDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permission check result' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_permission_dto_1.CheckPermissionDto, Object]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "checkPermission", null);
__decorate([
    (0, common_1.Get)('sessions/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active sessions for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sessions retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "getUserSessions", null);
__decorate([
    (0, common_1.Delete)('sessions/:token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specific session' }),
    (0, swagger_1.ApiParam)({ name: 'token', description: 'Session token', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Session deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "deleteSession", null);
__decorate([
    (0, common_1.Delete)('sessions/user/:userId/all'),
    (0, permissions_decorator_1.Permissions)('sessions', 'manage'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete all sessions for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'All sessions deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "deleteAllUserSessions", null);
__decorate([
    (0, common_1.Get)('security/incidents'),
    (0, permissions_decorator_1.Permissions)('security', 'read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get security incidents with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'severity', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Security incidents retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('severity')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "getSecurityIncidents", null);
__decorate([
    (0, common_1.Post)('security/incidents'),
    (0, permissions_decorator_1.Permissions)('security', 'manage'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a security incident' }),
    (0, swagger_1.ApiBody)({ type: create_security_incident_dto_1.AccessControlCreateIncidentDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Security incident created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_security_incident_dto_1.AccessControlCreateIncidentDto, Object]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "createSecurityIncident", null);
__decorate([
    (0, common_1.Get)('security/statistics'),
    (0, permissions_decorator_1.Permissions)('security', 'read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get security statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Security statistics retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "getSecurityStatistics", null);
__decorate([
    (0, common_1.Get)('security/ip-restrictions'),
    (0, permissions_decorator_1.Permissions)('security', 'manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all IP restrictions' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'IP restrictions retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "getIpRestrictions", null);
__decorate([
    (0, common_1.Post)('security/ip-restrictions'),
    (0, permissions_decorator_1.Permissions)('security', 'manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Add an IP restriction' }),
    (0, swagger_1.ApiBody)({ type: create_ip_restriction_dto_1.AccessControlCreateIpRestrictionDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'IP restriction added successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'IP restriction already exists' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ip_restriction_dto_1.AccessControlCreateIpRestrictionDto, Object]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "addIpRestriction", null);
__decorate([
    (0, common_1.Delete)('security/ip-restrictions/:id'),
    (0, permissions_decorator_1.Permissions)('security', 'manage'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove an IP restriction' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'IP Restriction UUID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'IP restriction removed successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'IP restriction not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "removeIpRestriction", null);
__decorate([
    (0, common_1.Post)('initialize'),
    (0, permissions_decorator_1.Permissions)('system', 'configure'),
    (0, swagger_1.ApiOperation)({ summary: 'Initialize default roles and permissions' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Default roles and permissions initialized',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Roles already initialized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "initializeDefaultRoles", null);
__decorate([
    (0, common_1.Get)('cache/statistics'),
    (0, permissions_decorator_1.Permissions)('system', 'configure'),
    (0, swagger_1.ApiOperation)({ summary: 'Get permission cache statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cache statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "getCacheStatistics", null);
__decorate([
    (0, common_1.Delete)('cache/clear'),
    (0, permissions_decorator_1.Permissions)('system', 'configure'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Clear all permission caches' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Caches cleared successfully' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "clearCache", null);
__decorate([
    (0, common_1.Delete)('cache/users/:userId'),
    (0, permissions_decorator_1.Permissions)('users', 'manage'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Clear cache for specific user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'User cache cleared successfully' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "clearUserCache", null);
exports.AccessControlController = AccessControlController = __decorate([
    (0, swagger_1.ApiTags)('Access Control'),
    (0, common_1.Controller)('access-control'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(permissions_guard_1.PermissionsGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [access_control_service_1.AccessControlService,
        permission_cache_service_1.PermissionCacheService])
], AccessControlController);
//# sourceMappingURL=access-control.controller.js.map