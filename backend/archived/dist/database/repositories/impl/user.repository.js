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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
const user_model_1 = require("../../models/user.model");
let UserRepository = class UserRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'User');
    }
    async findByEmail(email) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, email, 'by-email');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for user email: ${email}`);
                return cached;
            }
            const user = await this.model.findOne({ where: { email } });
            if (!user)
                return null;
            const entity = this.mapToEntity(user);
            await this.cacheManager.set(cacheKey, entity, 1800);
            return entity;
        }
        catch (error) {
            this.logger.error('Error finding user by email:', error);
            throw new base_repository_1.RepositoryError('Failed to find user by email', 'FIND_BY_EMAIL_ERROR', 500, { email, error: error.message });
        }
    }
    async findByUsername(username) {
        try {
            const user = await this.model.findOne({ where: { username } });
            return user ? this.mapToEntity(user) : null;
        }
        catch (error) {
            this.logger.error('Error finding user by username:', error);
            throw new base_repository_1.RepositoryError('Failed to find user by username', 'FIND_BY_USERNAME_ERROR', 500, { username, error: error.message });
        }
    }
    async findByRole(roleId) {
        try {
            const users = await this.model.findAll({
                where: { roleId, isActive: true },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
            });
            return users.map((u) => this.mapToEntity(u));
        }
        catch (error) {
            this.logger.error('Error finding users by role:', error);
            throw new base_repository_1.RepositoryError('Failed to find users by role', 'FIND_BY_ROLE_ERROR', 500, { roleId, error: error.message });
        }
    }
    async updateLastLogin(userId) {
        try {
            await this.model.update({ lastLoginAt: new Date(), failedLoginAttempts: 0 }, { where: { id: userId } });
            await this.invalidateCaches(await this.model.findByPk(userId));
        }
        catch (error) {
            this.logger.error('Error updating last login:', error);
        }
    }
    async incrementFailedLogins(userId) {
        try {
            const user = await this.model.findByPk(userId);
            if (!user)
                throw new base_repository_1.RepositoryError('User not found', 'NOT_FOUND', 404);
            const failedAttempts = (user.failedLoginAttempts || 0) + 1;
            const updates = { failedLoginAttempts: failedAttempts };
            if (failedAttempts >= 5) {
                updates.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
            }
            await this.model.update(updates, { where: { id: userId } });
            await this.invalidateCaches(user);
            return failedAttempts;
        }
        catch (error) {
            this.logger.error('Error incrementing failed logins:', error);
            throw new base_repository_1.RepositoryError('Failed to increment failed logins', 'INCREMENT_FAILED_LOGINS_ERROR', 500, { userId, error: error.message });
        }
    }
    async unlockAccount(userId) {
        try {
            await this.model.update({ lockedUntil: null, failedLoginAttempts: 0 }, { where: { id: userId } });
            await this.invalidateCaches(await this.model.findByPk(userId));
        }
        catch (error) {
            this.logger.error('Error unlocking account:', error);
            throw new base_repository_1.RepositoryError('Failed to unlock account', 'UNLOCK_ACCOUNT_ERROR', 500, { userId, error: error.message });
        }
    }
    async validateCreate(data) {
        const existingEmail = await this.model.findOne({
            where: { email: data.email },
        });
        if (existingEmail) {
            throw new base_repository_1.RepositoryError('Email already exists', 'DUPLICATE_EMAIL', 409, { email: data.email });
        }
        const existingUsername = await this.model.findOne({
            where: { username: data.username },
        });
        if (existingUsername) {
            throw new base_repository_1.RepositoryError('Username already exists', 'DUPLICATE_USERNAME', 409, { username: data.username });
        }
    }
    async validateUpdate(id, data) {
        if (data.email) {
            const existing = await this.model.findOne({
                where: { email: data.email, id: { [sequelize_2.Op.ne]: id } },
            });
            if (existing) {
                throw new base_repository_1.RepositoryError('Email already exists', 'DUPLICATE_EMAIL', 409, { email: data.email });
            }
        }
        if (data.username) {
            const existing = await this.model.findOne({
                where: { username: data.username, id: { [sequelize_2.Op.ne]: id } },
            });
            if (existing) {
                throw new base_repository_1.RepositoryError('Username already exists', 'DUPLICATE_USERNAME', 409, { username: data.username });
            }
        }
    }
    async invalidateCaches(user) {
        try {
            const userData = user.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, userData.id));
            if (userData.email) {
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, userData.email, 'by-email'));
            }
            if (userData.username) {
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, userData.username, 'by-username'));
            }
        }
        catch (error) {
            this.logger.warn('Error invalidating user caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({
            ...data,
            passwordHash: '[REDACTED]',
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserRepository);
//# sourceMappingURL=user.repository.js.map