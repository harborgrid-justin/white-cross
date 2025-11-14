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
exports.SessionManagementService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../database/models");
const crypto_1 = require("crypto");
const base_1 = require("../../../common/base");
let SessionManagementService = class SessionManagementService extends base_1.BaseService {
    sessionModel;
    MAX_CONCURRENT_SESSIONS = 5;
    SESSION_DURATION_HOURS = 24;
    constructor(sessionModel) {
        super("SessionManagementService");
        this.sessionModel = sessionModel;
    }
    async createSession(data) {
        try {
            await this.enforceConcurrentSessionLimit(data.userId);
            const sessionToken = this.generateSessionToken();
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + this.SESSION_DURATION_HOURS);
            const session = await this.sessionModel.create({
                sessionToken,
                userId: data.userId,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                expiresAt,
                lastAccessedAt: new Date(),
                isActive: true,
                metadata: data.metadata,
            });
            this.logInfo('Session created', {
                userId: data.userId,
                sessionId: session.id,
            });
            return session;
        }
        catch (error) {
            this.logError('Error creating session', { error });
            throw error;
        }
    }
    async validateSession(sessionToken) {
        try {
            const session = await this.sessionModel.findOne({
                where: {
                    sessionToken,
                    isActive: true,
                },
            });
            if (!session) {
                return null;
            }
            if (session.expiresAt < new Date()) {
                await this.invalidateSession(session.id);
                return null;
            }
            session.lastAccessedAt = new Date();
            await session.save();
            return session;
        }
        catch (error) {
            this.logError('Error validating session', { error, sessionToken });
            return null;
        }
    }
    async invalidateSession(sessionId) {
        try {
            await this.sessionModel.update({ isActive: false }, { where: { id: sessionId } });
            this.logInfo('Session invalidated', { sessionId });
            return true;
        }
        catch (error) {
            this.logError('Error invalidating session', { error, sessionId });
            return false;
        }
    }
    async invalidateUserSessions(userId) {
        try {
            const [affectedCount] = await this.sessionModel.update({ isActive: false }, { where: { userId, isActive: true } });
            this.logInfo('User sessions invalidated', {
                userId,
                count: affectedCount,
            });
            return affectedCount;
        }
        catch (error) {
            this.logError('Error invalidating user sessions', { error, userId });
            return 0;
        }
    }
    async getActiveSessions(userId) {
        try {
            return await this.sessionModel.findAll({
                where: {
                    userId,
                    isActive: true,
                    expiresAt: {
                        [sequelize_2.Op.gt]: new Date(),
                    },
                },
                order: [['createdAt', 'DESC']],
            });
        }
        catch (error) {
            this.logError('Error fetching active sessions', { error, userId });
            return [];
        }
    }
    async enforceConcurrentSessionLimit(userId) {
        try {
            const activeSessions = await this.getActiveSessions(userId);
            if (activeSessions.length >= this.MAX_CONCURRENT_SESSIONS) {
                const oldestSession = activeSessions[activeSessions.length - 1];
                await this.invalidateSession(oldestSession.id);
                this.logWarning('Concurrent session limit reached, oldest session invalidated', {
                    userId,
                    limit: this.MAX_CONCURRENT_SESSIONS,
                });
            }
        }
        catch (error) {
            this.logError('Error enforcing session limit', { error, userId });
        }
    }
    generateSessionToken() {
        return (0, crypto_1.randomBytes)(32).toString('hex');
    }
    async cleanupExpiredSessions() {
        try {
            const [affectedCount] = await this.sessionModel.update({ isActive: false }, {
                where: {
                    expiresAt: {
                        [sequelize_2.Op.lt]: new Date(),
                    },
                    isActive: true,
                },
            });
            if (affectedCount > 0) {
                this.logInfo('Expired sessions cleaned up', {
                    count: affectedCount,
                });
            }
            return affectedCount;
        }
        catch (error) {
            this.logError('Error cleaning up expired sessions', { error });
            return 0;
        }
    }
};
exports.SessionManagementService = SessionManagementService;
exports.SessionManagementService = SessionManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Session)),
    __metadata("design:paramtypes", [Object])
], SessionManagementService);
//# sourceMappingURL=session-management.service.js.map