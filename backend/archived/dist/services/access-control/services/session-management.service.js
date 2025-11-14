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
const audit_service_1 = require("../../../database/services/audit.service");
const base_1 = require("../../../common/base");
let SessionManagementService = class SessionManagementService extends base_1.BaseService {
    sequelize;
    auditService;
    constructor(sequelize, auditService) {
        super("SessionManagementService");
        this.sequelize = sequelize;
        this.auditService = auditService;
    }
    getModel(modelName) {
        return this.sequelize.models[modelName];
    }
    async createSession(data) {
        try {
            const Session = this.getModel('Session');
            const session = await Session.create({
                userId: data.userId,
                token: data.token,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                expiresAt: data.expiresAt,
                lastActivity: new Date(),
            });
            this.logInfo(`Created session for user ${data.userId}`);
            return session;
        }
        catch (error) {
            this.logError('Error creating session:', error);
            throw error;
        }
    }
    async getUserSessions(userId) {
        try {
            const Session = this.getModel('Session');
            const sessions = await Session.findAll({
                where: {
                    userId,
                    expiresAt: {
                        [sequelize_2.Op.gt]: new Date(),
                    },
                },
                order: [['createdAt', 'DESC']],
            });
            this.logInfo(`Retrieved ${sessions.length} active sessions for user ${userId}`);
            return sessions;
        }
        catch (error) {
            this.logError(`Error getting sessions for user ${userId}:`, error);
            throw error;
        }
    }
    async updateSessionActivity(token, ipAddress) {
        try {
            const Session = this.getModel('Session');
            const session = await Session.findOne({
                where: { token },
            });
            if (session) {
                await session.update({
                    lastActivity: new Date(),
                });
                await this.auditService.logUpdate('Session', session.id, {
                    userId: session.userId,
                    userName: 'User',
                    userRole: 'USER',
                    ipAddress: ipAddress || session.ipAddress,
                    userAgent: session.userAgent,
                    timestamp: new Date(),
                }, { lastActivity: { before: session.lastActivity, after: new Date() } });
            }
        }
        catch (error) {
            this.logError('Error updating session activity:', error);
        }
    }
    async deleteSession(token) {
        try {
            const Session = this.getModel('Session');
            const deletedCount = await Session.destroy({
                where: { token },
            });
            if (deletedCount === 0) {
                throw new common_1.NotFoundException('Session not found');
            }
            this.logInfo('Session deleted');
            return { success: true };
        }
        catch (error) {
            this.logError('Error deleting session:', error);
            throw error;
        }
    }
    async deleteAllUserSessions(userId) {
        try {
            const Session = this.getModel('Session');
            const deletedCount = await Session.destroy({
                where: { userId },
            });
            this.logInfo(`Deleted ${deletedCount} sessions for user ${userId}`);
            return { deleted: deletedCount };
        }
        catch (error) {
            this.logError(`Error deleting sessions for user ${userId}:`, error);
            throw error;
        }
    }
    async cleanupExpiredSessions() {
        try {
            const Session = this.getModel('Session');
            const deletedCount = await Session.destroy({
                where: {
                    expiresAt: {
                        [sequelize_2.Op.lt]: new Date(),
                    },
                },
            });
            this.logInfo(`Cleaned up ${deletedCount} expired sessions`);
            return { deleted: deletedCount };
        }
        catch (error) {
            this.logError('Error cleaning up expired sessions:', error);
            throw error;
        }
    }
};
exports.SessionManagementService = SessionManagementService;
exports.SessionManagementService = SessionManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __metadata("design:paramtypes", [sequelize_2.Sequelize,
        audit_service_1.AuditService])
], SessionManagementService);
//# sourceMappingURL=session-management.service.js.map