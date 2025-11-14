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
exports.SessionRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
let SessionRepository = class SessionRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'Session');
    }
    async findByToken(token) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, token, 'by-token');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for session token`);
                return cached;
            }
            const session = await this.model.findOne({
                where: { token, isActive: true, expiresAt: { [sequelize_2.Op.gt]: new Date() } },
            });
            if (!session)
                return null;
            const entity = this.mapToEntity(session);
            await this.cacheManager.set(cacheKey, entity, 900);
            return entity;
        }
        catch (error) {
            this.logger.error('Error finding session by token:', error);
            throw new base_repository_1.RepositoryError('Failed to find session by token', 'FIND_BY_TOKEN_ERROR', 500, { error: error.message });
        }
    }
    async findByUserId(userId) {
        try {
            const sessions = await this.model.findAll({
                where: {
                    userId,
                    isActive: true,
                    expiresAt: { [sequelize_2.Op.gt]: new Date() },
                },
                order: [['lastActivityAt', 'DESC']],
            });
            return sessions.map((s) => this.mapToEntity(s));
        }
        catch (error) {
            this.logger.error('Error finding sessions by user:', error);
            throw new base_repository_1.RepositoryError('Failed to find sessions by user', 'FIND_BY_USER_ERROR', 500, { userId, error: error.message });
        }
    }
    async updateActivity(sessionId) {
        try {
            await this.model.update({ lastActivityAt: new Date() }, { where: { id: sessionId } });
            const session = await this.model.findByPk(sessionId);
            if (session) {
                await this.invalidateCaches(session);
            }
        }
        catch (error) {
            this.logger.error('Error updating session activity:', error);
        }
    }
    async invalidateSession(sessionId, context) {
        try {
            await this.model.update({ isActive: false }, { where: { id: sessionId } });
            await this.auditLogger.logUpdate(this.entityName, sessionId, context, {
                isActive: { before: true, after: false },
            });
            const session = await this.model.findByPk(sessionId);
            if (session) {
                await this.invalidateCaches(session);
            }
            this.logger.log(`Invalidated session ${sessionId}`);
        }
        catch (error) {
            this.logger.error('Error invalidating session:', error);
            throw new base_repository_1.RepositoryError('Failed to invalidate session', 'INVALIDATE_SESSION_ERROR', 500, { sessionId, error: error.message });
        }
    }
    async invalidateUserSessions(userId, context) {
        let transaction;
        try {
            transaction = await this.model.sequelize.transaction();
            await this.model.update({ isActive: false }, { where: { userId, isActive: true }, transaction });
            await this.auditLogger.logBulkOperation('INVALIDATE_USER_SESSIONS', this.entityName, context, { userId });
            if (transaction) {
                await transaction.commit();
            }
            await this.cacheManager.deletePattern(`white-cross:session:user:${userId}:*`);
            this.logger.log(`Invalidated all sessions for user ${userId}`);
        }
        catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            this.logger.error('Error invalidating user sessions:', error);
            throw new base_repository_1.RepositoryError('Failed to invalidate user sessions', 'INVALIDATE_USER_SESSIONS_ERROR', 500, { userId, error: error.message });
        }
    }
    async cleanupExpiredSessions() {
        try {
            const result = await this.model.destroy({
                where: {
                    [sequelize_2.Op.or]: [
                        { expiresAt: { [sequelize_2.Op.lt]: new Date() } },
                        { isActive: false },
                    ],
                },
            });
            this.logger.log(`Cleaned up ${result} expired sessions`);
            return result;
        }
        catch (error) {
            this.logger.error('Error cleaning up expired sessions:', error);
            return 0;
        }
    }
    async validateCreate(data) {
    }
    async validateUpdate(id, data) {
    }
    async invalidateCaches(session) {
        try {
            const sessionData = session.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, sessionData.id));
            if (sessionData.token) {
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, sessionData.token, 'by-token'));
            }
            if (sessionData.userId) {
                await this.cacheManager.deletePattern(`white-cross:session:user:${sessionData.userId}:*`);
            }
        }
        catch (error) {
            this.logger.warn('Error invalidating session caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({
            ...data,
            token: '[REDACTED]',
            refreshToken: '[REDACTED]',
        });
    }
};
exports.SessionRepository = SessionRepository;
exports.SessionRepository = SessionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)('')),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], SessionRepository);
//# sourceMappingURL=session.repository.js.map