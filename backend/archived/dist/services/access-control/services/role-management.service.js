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
exports.RoleManagementService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const audit_service_1 = require("../../../database/services/audit.service");
const permission_cache_service_1 = require("./permission-cache.service");
let RoleManagementService = class RoleManagementService extends base_1.BaseService {
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
    async getRoles() {
        try {
            const Role = this.getModel('Role');
            const roles = await Role.findAll({
                include: [
                    {
                        model: this.getModel('RolePermission'),
                        as: 'permissions',
                        include: [
                            {
                                model: this.getModel('Permission'),
                                as: 'permission',
                            },
                        ],
                    },
                    {
                        model: this.getModel('UserRoleAssignment'),
                        as: 'userRoles',
                    },
                ],
                order: [['name', 'ASC']],
            });
            this.logger.log(`Retrieved ${roles.length} roles`);
            return roles;
        }
        catch (error) {
            this.logger.error('Error getting roles:', error);
            throw error;
        }
    }
    async getRoleById(id) {
        try {
            const Role = this.getModel('Role');
            const role = await Role.findByPk(id, {
                include: [
                    {
                        model: this.getModel('RolePermission'),
                        as: 'permissions',
                        include: [
                            {
                                model: this.getModel('Permission'),
                                as: 'permission',
                            },
                        ],
                    },
                    {
                        model: this.getModel('UserRoleAssignment'),
                        as: 'userRoles',
                    },
                ],
            });
            if (!role) {
                throw new common_1.NotFoundException('Role not found');
            }
            this.logger.log(`Retrieved role: ${id}`);
            return role;
        }
        catch (error) {
            this.logger.error(`Error getting role ${id}:`, error);
            throw error;
        }
    }
    async createRole(data, auditUserId) {
        const transaction = await this.sequelize.transaction();
        try {
            const Role = this.getModel('Role');
            const existingRole = await Role.findOne({
                where: this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('name')), this.sequelize.fn('LOWER', data.name)),
                transaction,
            });
            if (existingRole) {
                throw new common_1.BadRequestException(`Role with name '${data.name}' already exists`);
            }
            const role = await Role.create({
                name: data.name.trim(),
                description: data.description?.trim(),
                isSystem: false,
            }, { transaction });
            await role.reload({
                include: [
                    {
                        model: this.getModel('RolePermission'),
                        as: 'permissions',
                        include: [
                            {
                                model: this.getModel('Permission'),
                                as: 'permission',
                            },
                        ],
                    },
                ],
                transaction,
            });
            await transaction.commit();
            this.cacheService.invalidateAllUserPermissions();
            await this.auditService.logCreate('Role', role.id, {
                userId: auditUserId || null,
                userName: auditUserId ? 'User' : 'SYSTEM',
                userRole: 'SYSTEM',
                ipAddress: null,
                userAgent: null,
                timestamp: new Date(),
            }, role);
            this.logger.log(`Created role: ${role.id} (${role.name}) by user ${auditUserId || 'SYSTEM'}`);
            return role;
        }
        catch (error) {
            await transaction.rollback();
            this.logger.error('Error creating role:', error);
            throw error;
        }
    }
    async updateRole(id, data, auditUserId) {
        const transaction = await this.sequelize.transaction();
        try {
            const Role = this.getModel('Role');
            const role = await this.findEntityOrFail(Role, id, 'Role');
            if (role.isSystem) {
                throw new common_1.BadRequestException('Cannot modify system roles');
            }
            const originalValues = {
                name: role.name,
                description: role.description,
            };
            if (data.name && data.name.trim() !== role.name) {
                const trimmedName = data.name.trim();
                const existingRole = await Role.findOne({
                    where: {
                        id: { [sequelize_2.Op.ne]: id },
                        [sequelize_2.Op.and]: this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('name')), this.sequelize.fn('LOWER', trimmedName)),
                    },
                    transaction,
                });
                if (existingRole) {
                    throw new common_1.BadRequestException(`Role with name '${trimmedName}' already exists`);
                }
            }
            const updateData = {};
            if (data.name)
                updateData.name = data.name.trim();
            if (data.description !== undefined)
                updateData.description = data.description?.trim();
            await role.update(updateData, { transaction });
            await role.reload({
                include: [
                    {
                        model: this.getModel('RolePermission'),
                        as: 'permissions',
                        include: [
                            {
                                model: this.getModel('Permission'),
                                as: 'permission',
                            },
                        ],
                    },
                ],
                transaction,
            });
            await transaction.commit();
            this.cacheService.invalidateAllUserPermissions();
            const changes = {};
            if (data.name && data.name !== originalValues.name) {
                changes.name = { before: originalValues.name, after: data.name };
            }
            if (data.description !== undefined &&
                data.description !== originalValues.description) {
                changes.description = {
                    before: originalValues.description,
                    after: data.description,
                };
            }
            await this.auditService.logUpdate('Role', id, {
                userId: auditUserId || null,
                userName: auditUserId ? 'User' : 'SYSTEM',
                userRole: 'SYSTEM',
                ipAddress: null,
                userAgent: null,
                timestamp: new Date(),
            }, changes);
            this.logger.log(`Updated role: ${id} by user ${auditUserId || 'SYSTEM'}`);
            return role;
        }
        catch (error) {
            await transaction.rollback();
            this.logger.error(`Error updating role ${id}:`, error);
            throw error;
        }
    }
    async deleteRole(id, auditUserId) {
        const transaction = await this.sequelize.transaction();
        try {
            const Role = this.getModel('Role');
            const UserRoleAssignment = this.getModel('UserRoleAssignment');
            const role = await Role.findByPk(id, {
                include: [
                    {
                        model: UserRoleAssignment,
                        as: 'userRoles',
                    },
                ],
                transaction,
            });
            if (!role) {
                throw new common_1.NotFoundException('Role not found');
            }
            if (role.isSystem) {
                throw new common_1.BadRequestException('Cannot delete system role');
            }
            const assignedUsers = await UserRoleAssignment.count({
                where: { roleId: id },
                transaction,
            });
            if (assignedUsers > 0) {
                throw new common_1.BadRequestException(`Cannot delete role: It is currently assigned to ${assignedUsers} user(s). Remove all user assignments first.`);
            }
            const roleData = {
                id: role.id,
                name: role.name,
                description: role.description,
                isSystem: role.isSystem,
            };
            await role.destroy({ transaction });
            await transaction.commit();
            this.cacheService.invalidateAllUserPermissions();
            await this.auditService.logDelete('Role', id, {
                userId: auditUserId || null,
                userName: auditUserId ? 'User' : 'SYSTEM',
                userRole: 'SYSTEM',
                ipAddress: null,
                userAgent: null,
                timestamp: new Date(),
            }, roleData);
            this.logger.log(`Deleted role: ${id} (${roleData.name}) by user ${auditUserId || 'SYSTEM'}`);
            return { success: true };
        }
        catch (error) {
            await transaction.rollback();
            this.logger.error(`Error deleting role ${id}:`, error);
            throw error;
        }
    }
};
exports.RoleManagementService = RoleManagementService;
exports.RoleManagementService = RoleManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectConnection)()),
    __param(2, (0, common_1.Inject)('IAuditLogger')),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService,
        sequelize_2.Sequelize,
        audit_service_1.AuditService,
        permission_cache_service_1.PermissionCacheService])
], RoleManagementService);
//# sourceMappingURL=role-management.service.js.map