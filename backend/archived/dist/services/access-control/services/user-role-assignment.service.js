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
exports.UserRoleAssignmentService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const audit_service_1 = require("../../../database/services/audit.service");
const permission_cache_service_1 = require("./permission-cache.service");
const create_security_incident_dto_1 = require("../dto/create-security-incident.dto");
const base_1 = require("../../../common/base");
var SecurityIncidentStatus;
(function (SecurityIncidentStatus) {
    SecurityIncidentStatus["OPEN"] = "OPEN";
    SecurityIncidentStatus["INVESTIGATING"] = "INVESTIGATING";
    SecurityIncidentStatus["RESOLVED"] = "RESOLVED";
    SecurityIncidentStatus["CLOSED"] = "CLOSED";
})(SecurityIncidentStatus || (SecurityIncidentStatus = {}));
let UserRoleAssignmentService = class UserRoleAssignmentService extends base_1.BaseService {
    sequelize;
    auditService;
    cacheService;
    constructor(sequelize, auditService, cacheService) {
        super("UserRoleAssignmentService");
        this.sequelize = sequelize;
        this.auditService = auditService;
        this.cacheService = cacheService;
    }
    getModel(modelName) {
        return this.sequelize.models[modelName];
    }
    async assignRoleToUser(userId, roleId, auditUserId, bypassPrivilegeCheck = false) {
        const transaction = await this.sequelize.transaction();
        try {
            const User = this.getModel('User');
            const Role = this.getModel('Role');
            const UserRoleAssignment = this.getModel('UserRoleAssignment');
            const SecurityIncident = this.getModel('SecurityIncident');
            const targetUser = await this.findEntityOrFail(User, userId, 'User');
            const role = await Role.findByPk(roleId, {
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
            if (!role) {
                throw new common_1.NotFoundException('Role not found');
            }
            if (!bypassPrivilegeCheck && auditUserId) {
                const assigningUserPermissions = await this.getUserPermissions(auditUserId);
                const canManageUsers = assigningUserPermissions.permissions.some((p) => p.resource === 'users' && p.action === 'manage');
                if (!canManageUsers) {
                    throw new common_1.BadRequestException('You do not have permission to assign roles to users');
                }
                const rolePermissions = role.permissions || [];
                const hasCriticalPermissions = rolePermissions.some((rp) => {
                    const perm = rp.permission;
                    return ((perm.resource === 'security' && perm.action === 'manage') ||
                        (perm.resource === 'system' && perm.action === 'configure'));
                });
                if (hasCriticalPermissions) {
                    const canManageSecurity = assigningUserPermissions.permissions.some((p) => p.resource === 'security' && p.action === 'manage');
                    if (!canManageSecurity) {
                        throw new common_1.BadRequestException('You do not have sufficient privileges to assign this role. Security management permission required.');
                    }
                }
            }
            const existingAssignment = await UserRoleAssignment.findOne({
                where: {
                    userId,
                    roleId,
                },
                transaction,
            });
            if (existingAssignment) {
                throw new common_1.BadRequestException('Role already assigned to user');
            }
            const userRole = await UserRoleAssignment.create({
                userId,
                roleId,
            }, { transaction });
            await userRole.reload({
                include: [
                    {
                        model: Role,
                        as: 'role',
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
                    },
                ],
                transaction,
            });
            await transaction.commit();
            this.cacheService.invalidateUserPermissions(userId);
            const rolePermissions = role.permissions || [];
            const hasHighPrivilege = rolePermissions.some((rp) => {
                const perm = rp.permission;
                return perm.resource === 'security' || perm.resource === 'system';
            });
            this.auditService.logCreate('UserRoleAssignment', userRole.id, {
                userId: auditUserId || null,
                userName: auditUserId ? 'User' : 'SYSTEM',
                userRole: 'SYSTEM',
                ipAddress: null,
                userAgent: null,
                timestamp: new Date(),
            }, {
                targetUserId: userId,
                targetUserEmail: targetUser.email,
                roleId,
                roleName: role.name,
                isHighPrivilege: hasHighPrivilege,
            });
            if (hasHighPrivilege) {
                await SecurityIncident.create({
                    type: create_security_incident_dto_1.SecurityIncidentType.POLICY_VIOLATION,
                    severity: create_security_incident_dto_1.IncidentSeverity.LOW,
                    description: `High-privilege role '${role.name}' assigned to user ${targetUser.email}`,
                    affectedResources: [`user:${userId}`, `role:${roleId}`],
                    detectedBy: auditUserId || 'SYSTEM',
                    status: SecurityIncidentStatus.CLOSED,
                    resolution: 'Role assignment completed successfully. Review for compliance.',
                });
            }
            this.logInfo(`Assigned role ${roleId} (${role.name}) to user ${userId} (${targetUser.email}) by user ${auditUserId || 'SYSTEM'}`);
            return userRole;
        }
        catch (error) {
            await transaction.rollback();
            this.logError('Error assigning role to user:', error);
            throw error;
        }
    }
    async removeRoleFromUser(userId, roleId) {
        try {
            const UserRoleAssignment = this.getModel('UserRoleAssignment');
            const deletedCount = await UserRoleAssignment.destroy({
                where: {
                    userId,
                    roleId,
                },
            });
            if (deletedCount === 0) {
                throw new common_1.NotFoundException('Role assignment not found');
            }
            this.cacheService.invalidateUserPermissions(userId);
            this.logInfo(`Removed role ${roleId} from user ${userId}`);
            return { success: true };
        }
        catch (error) {
            this.logError('Error removing role from user:', error);
            throw error;
        }
    }
    async getUserPermissions(userId, bypassCache = false) {
        try {
            if (!bypassCache) {
                const cached = this.cacheService.getUserPermissions(userId);
                if (cached) {
                    this.logDebug(`Using cached permissions for user ${userId}`);
                    return cached;
                }
            }
            const UserRoleAssignment = this.getModel('UserRoleAssignment');
            const userRoles = await UserRoleAssignment.findAll({
                where: { userId },
                include: [
                    {
                        model: this.getModel('Role'),
                        as: 'role',
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
                    },
                ],
            });
            const roles = userRoles.map((ur) => ur.role).filter((r) => !!r);
            const permissionsMap = new Map();
            for (const userRole of userRoles) {
                if (userRole.role && userRole.role.permissions) {
                    for (const rolePermission of userRole.role.permissions) {
                        if (rolePermission.permission) {
                            const perm = rolePermission.permission;
                            permissionsMap.set(perm.id, perm);
                        }
                    }
                }
            }
            const permissions = Array.from(permissionsMap.values());
            const result = {
                roles,
                permissions,
            };
            this.cacheService.setUserPermissions(userId, result);
            await this.auditService.logRead('UserPermissions', userId, {
                userId: userId,
                userName: 'User',
                userRole: 'USER',
                ipAddress: null,
                userAgent: null,
                timestamp: new Date(),
            });
            this.logInfo(`Retrieved ${permissions.length} permissions for user ${userId}`);
            return result;
        }
        catch (error) {
            this.logError(`Error getting user permissions for ${userId}:`, error);
            throw error;
        }
    }
    async checkPermission(userId, resource, action) {
        try {
            const userPermissions = await this.getUserPermissions(userId);
            const hasPermission = userPermissions.permissions.some((p) => p.resource === resource && p.action === action);
            await this.auditService.logRead('Permission', `${resource}:${action}`, {
                userId: userId,
                userName: 'User',
                userRole: 'USER',
                ipAddress: null,
                userAgent: null,
                timestamp: new Date(),
            });
            this.logInfo(`Permission check for user ${userId} on ${resource}.${action}: ${hasPermission}`);
            return hasPermission;
        }
        catch (error) {
            this.logError('Error checking permission:', error);
            return false;
        }
    }
};
exports.UserRoleAssignmentService = UserRoleAssignmentService;
exports.UserRoleAssignmentService = UserRoleAssignmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __metadata("design:paramtypes", [sequelize_2.Sequelize,
        audit_service_1.AuditService,
        permission_cache_service_1.PermissionCacheService])
], UserRoleAssignmentService);
//# sourceMappingURL=user-role-assignment.service.js.map