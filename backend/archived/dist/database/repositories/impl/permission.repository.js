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
exports.PermissionRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
let PermissionRepository = class PermissionRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'Permission');
    }
    async findByName(name) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, name, 'by-name');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for permission name: ${name}`);
                return cached;
            }
            const permission = await this.model.findOne({ where: { name } });
            if (!permission)
                return null;
            const entity = this.mapToEntity(permission);
            await this.cacheManager.set(cacheKey, entity, 3600);
            return entity;
        }
        catch (error) {
            this.logger.error('Error finding permission by name:', error);
            throw new base_repository_1.RepositoryError('Failed to find permission by name', 'FIND_BY_NAME_ERROR', 500, { name, error: error.message });
        }
    }
    async findByResource(resource) {
        try {
            const permissions = await this.model.findAll({
                where: { resource },
                order: [['action', 'ASC']],
            });
            return permissions.map((p) => this.mapToEntity(p));
        }
        catch (error) {
            this.logger.error('Error finding permissions by resource:', error);
            throw new base_repository_1.RepositoryError('Failed to find permissions by resource', 'FIND_BY_RESOURCE_ERROR', 500, { resource, error: error.message });
        }
    }
    async findByResourceAndAction(resource, action) {
        try {
            const permission = await this.model.findOne({
                where: { resource, action },
            });
            return permission ? this.mapToEntity(permission) : null;
        }
        catch (error) {
            this.logger.error('Error finding permission by resource and action:', error);
            throw new base_repository_1.RepositoryError('Failed to find permission by resource and action', 'FIND_BY_RESOURCE_ACTION_ERROR', 500, { resource, action, error: error.message });
        }
    }
    async findSystemPermissions() {
        try {
            const permissions = await this.model.findAll({
                where: { isSystemPermission: true },
                order: [
                    ['resource', 'ASC'],
                    ['action', 'ASC'],
                ],
            });
            return permissions.map((p) => this.mapToEntity(p));
        }
        catch (error) {
            this.logger.error('Error finding system permissions:', error);
            throw new base_repository_1.RepositoryError('Failed to find system permissions', 'FIND_SYSTEM_PERMISSIONS_ERROR', 500, { error: error.message });
        }
    }
    async bulkAssignToRole(permissionIds, roleId, context) {
        let transaction;
        try {
            transaction = await this.model.sequelize.transaction();
            await this.auditLogger.logBulkOperation('BULK_ASSIGN_PERMISSIONS', this.entityName, context, { permissionIds, roleId, count: permissionIds.length });
            if (transaction) {
                await transaction.commit();
            }
            this.logger.log(`Bulk assigned ${permissionIds.length} permissions to role ${roleId}`);
        }
        catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            this.logger.error('Error bulk assigning permissions:', error);
            throw new base_repository_1.RepositoryError('Failed to bulk assign permissions to role', 'BULK_ASSIGN_ERROR', 500, { error: error.message });
        }
    }
    async validateCreate(data) {
        const existing = await this.model.findOne({
            where: { resource: data.resource, action: data.action },
        });
        if (existing) {
            throw new base_repository_1.RepositoryError('Permission already exists for this resource and action', 'DUPLICATE_PERMISSION', 409, { resource: data.resource, action: data.action });
        }
    }
    async validateUpdate(id, data) {
        const permission = await this.model.findByPk(id);
        if (permission && permission.isSystemPermission) {
            throw new base_repository_1.RepositoryError('Cannot modify system permission', 'SYSTEM_PERMISSION_IMMUTABLE', 403, { id });
        }
    }
    async invalidateCaches(permission) {
        try {
            const permissionData = permission.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, permissionData.id));
            if (permissionData.name) {
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, permissionData.name, 'by-name'));
            }
            await this.cacheManager.deletePattern(`white-cross:permission:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating permission caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({ ...data });
    }
};
exports.PermissionRepository = PermissionRepository;
exports.PermissionRepository = PermissionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)('')),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], PermissionRepository);
//# sourceMappingURL=permission.repository.js.map