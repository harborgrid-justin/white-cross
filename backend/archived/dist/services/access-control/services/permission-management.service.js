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
exports.PermissionManagementService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const audit_service_1 = require("../../../database/services/audit.service");
const permission_cache_service_1 = require("./permission-cache.service");
let PermissionManagementService = class PermissionManagementService extends base_1.BaseService {
    requestContext;
    sequelize;
    auditService;
    cacheService;
    constructor(requestContext, sequelize, auditService, cacheService) {
        super(requestContext);
        this.requestContext = requestContext;
        this.sequelize = sequelize;
        this.auditService = auditService;
        this.cacheService = cacheService;
    }
    getModel(modelName) {
        return this.sequelize.models[modelName];
    }
    async getPermissions() {
        try {
            const Permission = this.getModel('Permission');
            const permissions = await Permission.findAll({
                order: [
                    ['resource', 'ASC'],
                    ['action', 'ASC'],
                ],
            });
            this.logger.log(`Retrieved ${permissions.length} permissions`);
            return permissions;
        }
        catch (error) {
            this.logger.error('Error getting permissions:', error);
            throw error;
        }
    }
    async createPermission(data) {
        try {
            const Permission = this.getModel('Permission');
            const permission = await Permission.create({
                resource: data.resource,
                action: data.action,
                description: data.description,
            });
            this.logger.log(`Created permission: ${permission.id}`);
            return permission;
        }
        catch (error) {
            this.logger.error('Error creating permission:', error);
            throw error;
        }
    }
    async assignPermissionToRole(roleId, permissionId, auditUserId) {
        const transaction = await this.sequelize.transaction();
        try {
            const Role = this.getModel('Role');
            const Permission = this.getModel('Permission');
            const RolePermission = this.getModel('RolePermission');
            const [role, permission] = await Promise.all([
                Role.findByPk(roleId, { transaction }),
                Permission.findByPk(permissionId, { transaction }),
            ]);
            if (!role) {
                throw new common_1.NotFoundException('Role not found');
            }
            if (!permission) {
                throw new common_1.NotFoundException('Permission not found');
            }
            if (role.isSystem) {
                throw new common_1.BadRequestException('Cannot modify permissions of system roles');
            }
            const existingAssignment = await RolePermission.findOne({
                where: {
                    roleId,
                    permissionId,
                },
                transaction,
            });
            if (existingAssignment) {
                throw new common_1.BadRequestException('Permission already assigned to role');
            }
            const rolePermission = await RolePermission.create({
                roleId,
                permissionId,
            }, { transaction });
            await rolePermission.reload({
                include: [
                    {
                        model: Role,
                        as: 'role',
                    },
                    {
                        model: Permission,
                        as: 'permission',
                    },
                ],
                transaction,
            });
            await transaction.commit();
            this.cacheService.invalidateRolePermissions(roleId);
            await this.auditService.logCreate('RolePermission', rolePermission.id, {
                userId: auditUserId || null,
                userName: auditUserId ? 'User' : 'SYSTEM',
                userRole: 'SYSTEM',
                ipAddress: null,
                userAgent: null,
                timestamp: new Date(),
            }, rolePermission);
            this.logger.log(`Assigned permission ${permissionId} (${permission.resource}.${permission.action}) to role ${roleId} (${role.name}) by user ${auditUserId || 'SYSTEM'}`);
            return rolePermission;
        }
        catch (error) {
            await transaction.rollback();
            this.logger.error('Error assigning permission to role:', error);
            throw error;
        }
    }
    async removePermissionFromRole(roleId, permissionId, auditUserId) {
        const transaction = await this.sequelize.transaction();
        try {
            const Role = this.getModel('Role');
            const Permission = this.getModel('Permission');
            const RolePermission = this.getModel('RolePermission');
            const [role, permission] = await Promise.all([
                Role.findByPk(roleId, { transaction }),
                Permission.findByPk(permissionId, { transaction }),
            ]);
            const deletedCount = await RolePermission.destroy({
                where: {
                    roleId,
                    permissionId,
                },
                transaction,
            });
            if (deletedCount === 0) {
                throw new common_1.NotFoundException('Permission assignment not found');
            }
            await transaction.commit();
            this.cacheService.invalidateRolePermissions(roleId);
            if (role && permission) {
                await this.auditService.logDelete('RolePermission', `${roleId}:${permissionId}`, {
                    userId: auditUserId || null,
                    userName: auditUserId ? 'User' : 'SYSTEM',
                    userRole: 'SYSTEM',
                    ipAddress: null,
                    userAgent: null,
                    timestamp: new Date(),
                }, { roleId, permissionId });
            }
            this.logger.log(`Removed permission ${permissionId} from role ${roleId} by user ${auditUserId || 'SYSTEM'}`);
            return { success: true };
        }
        catch (error) {
            await transaction.rollback();
            this.logger.error('Error removing permission from role:', error);
            throw error;
        }
    }
};
exports.PermissionManagementService = PermissionManagementService;
exports.PermissionManagementService = PermissionManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectConnection)()),
    __param(2, (0, common_1.Inject)('IAuditLogger')),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService,
        sequelize_2.Sequelize,
        audit_service_1.AuditService,
        permission_cache_service_1.PermissionCacheService])
], PermissionManagementService);
//# sourceMappingURL=permission-management.service.js.map