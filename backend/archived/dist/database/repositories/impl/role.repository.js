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
exports.RoleRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
let RoleRepository = class RoleRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'Role');
    }
    async findByName(name) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, name, 'by-name');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for role name: ${name}`);
                return cached;
            }
            const role = await this.model.findOne({ where: { name } });
            if (!role)
                return null;
            const entity = this.mapToEntity(role);
            await this.cacheManager.set(cacheKey, entity, 3600);
            return entity;
        }
        catch (error) {
            this.logger.error('Error finding role by name:', error);
            throw new base_repository_1.RepositoryError('Failed to find role by name', 'FIND_BY_NAME_ERROR', 500, { name, error: error.message });
        }
    }
    async findByLevel(level) {
        try {
            const roles = await this.model.findAll({
                where: { level, isActive: true },
                order: [['name', 'ASC']],
            });
            return roles.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding roles by level:', error);
            throw new base_repository_1.RepositoryError('Failed to find roles by level', 'FIND_BY_LEVEL_ERROR', 500, { level, error: error.message });
        }
    }
    async findSystemRoles() {
        try {
            const roles = await this.model.findAll({
                where: { isSystemRole: true, isActive: true },
                order: [
                    ['level', 'ASC'],
                    ['name', 'ASC'],
                ],
            });
            return roles.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding system roles:', error);
            throw new base_repository_1.RepositoryError('Failed to find system roles', 'FIND_SYSTEM_ROLES_ERROR', 500, { error: error.message });
        }
    }
    async findActiveRoles() {
        try {
            const cacheKey = `${this.entityName}:active:all`;
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug('Cache hit for active roles');
                return cached;
            }
            const roles = await this.model.findAll({
                where: { isActive: true },
                order: [
                    ['level', 'ASC'],
                    ['name', 'ASC'],
                ],
            });
            const entities = roles.map((r) => this.mapToEntity(r));
            await this.cacheManager.set(cacheKey, entities, 3600);
            return entities;
        }
        catch (error) {
            this.logger.error('Error finding active roles:', error);
            throw new base_repository_1.RepositoryError('Failed to find active roles', 'FIND_ACTIVE_ROLES_ERROR', 500, { error: error.message });
        }
    }
    async validateCreate(data) {
        const existing = await this.model.findOne({ where: { name: data.name } });
        if (existing) {
            throw new base_repository_1.RepositoryError('Role name already exists', 'DUPLICATE_ROLE_NAME', 409, { name: data.name });
        }
    }
    async validateUpdate(id, data) {
        if (data.name) {
            const existing = await this.model.findOne({
                where: { name: data.name, id: { [sequelize_2.Op.ne]: id } },
            });
            if (existing) {
                throw new base_repository_1.RepositoryError('Role name already exists', 'DUPLICATE_ROLE_NAME', 409, { name: data.name });
            }
        }
        const role = await this.model.findByPk(id);
        if (role && role.isSystemRole) {
            throw new base_repository_1.RepositoryError('Cannot modify system role', 'SYSTEM_ROLE_IMMUTABLE', 403, { id });
        }
    }
    async invalidateCaches(role) {
        try {
            const roleData = role.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, roleData.id));
            if (roleData.name) {
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, roleData.name, 'by-name'));
            }
            await this.cacheManager.delete(`${this.entityName}:active:all`);
            await this.cacheManager.deletePattern(`white-cross:role:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating role caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({ ...data });
    }
};
exports.RoleRepository = RoleRepository;
exports.RoleRepository = RoleRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)('')),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], RoleRepository);
//# sourceMappingURL=role.repository.js.map