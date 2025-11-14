"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SessionMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionMiddleware = exports.MemorySessionStore = void 0;
exports.createHealthcareSessionMiddleware = createHealthcareSessionMiddleware;
exports.createAdminSessionMiddleware = createAdminSessionMiddleware;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const session_types_1 = require("../types/session.types");
class MemorySessionStore {
    sessions = new Map();
    userSessions = new Map();
    async create(session) {
        this.sessions.set(session.sessionId, session);
        if (!this.userSessions.has(session.userId)) {
            this.userSessions.set(session.userId, new Set());
        }
        this.userSessions.get(session.userId).add(session.sessionId);
    }
    async get(sessionId) {
        return this.sessions.get(sessionId) || null;
    }
    async update(sessionId, data) {
        const session = this.sessions.get(sessionId);
        if (session) {
            Object.assign(session, data);
        }
    }
    async delete(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            this.sessions.delete(sessionId);
            const userSessions = this.userSessions.get(session.userId);
            if (userSessions) {
                userSessions.delete(sessionId);
                if (userSessions.size === 0) {
                    this.userSessions.delete(session.userId);
                }
            }
        }
    }
    async getUserSessions(userId) {
        const sessionIds = this.userSessions.get(userId);
        if (!sessionIds)
            return [];
        const sessions = [];
        for (const sessionId of sessionIds) {
            const session = this.sessions.get(sessionId);
            if (session) {
                sessions.push(session);
            }
        }
        return sessions;
    }
    async cleanup() {
        const now = Date.now();
        let cleaned = 0;
        const entries = Array.from(this.sessions.entries());
        for (const [sessionId, session] of entries) {
            if (!session.isActive &&
                now - session.lastActivity > 24 * 60 * 60 * 1000) {
                await this.delete(sessionId);
                cleaned++;
            }
        }
        return cleaned;
    }
}
exports.MemorySessionStore = MemorySessionStore;
let SessionMiddleware = SessionMiddleware_1 = class SessionMiddleware {
    logger = new common_1.Logger(SessionMiddleware_1.name);
    config;
    store;
    constructor() {
        this.config = session_types_1.SESSION_CONFIGS.healthcare;
        this.store = this.config.store || new MemorySessionStore();
        if (this.store instanceof MemorySessionStore) {
            setInterval(() => {
                this.store.cleanup().then((cleaned) => {
                    if (cleaned > 0) {
                        this.logger.debug(`Cleaned up ${cleaned} expired sessions`);
                    }
                });
            }, 60 * 60 * 1000);
        }
    }
    setConfig(newConfig) {
        this.config = newConfig;
    }
    async use(req, res, next) {
        if (this.isPublicRoute(req.path)) {
            return next();
        }
        const sessionId = this.extractSessionId(req);
        if (!sessionId) {
            return next();
        }
        try {
            const result = await this.validateSession(sessionId);
            if (!result.valid) {
                throw new common_1.UnauthorizedException(result.error?.message || 'Invalid session');
            }
            req.session = result.session;
            if (result.warning) {
                res.setHeader('X-Session-Warning', JSON.stringify(result.warning));
            }
            next();
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error('Session middleware error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                sessionId,
            });
            throw new common_1.UnauthorizedException('Session validation failed');
        }
    }
    async createSession(userId, email, role, ipAddress, userAgent, permissions) {
        const userSessions = await this.store.getUserSessions(userId);
        const activeSessions = userSessions.filter((s) => s.isActive);
        if (activeSessions.length >= this.config.maxConcurrentSessions) {
            const oldestSession = activeSessions.sort((a, b) => a.lastActivity - b.lastActivity)[0];
            await this.store.update(oldestSession.sessionId, { isActive: false });
            if (this.config.auditSessions) {
                this.logger.log('Deactivated session due to concurrent limit', {
                    userId,
                    deactivatedSessionId: oldestSession.sessionId,
                });
            }
        }
        const sessionId = this.generateSessionId();
        const now = Date.now();
        const session = {
            sessionId,
            userId,
            email,
            role,
            createdAt: now,
            lastActivity: now,
            ipAddress,
            userAgent,
            isActive: true,
            permissions,
        };
        await this.store.create(session);
        if (this.config.auditSessions) {
            this.logger.log('Session created', {
                sessionId,
                userId,
                email,
                role,
                ipAddress,
            });
        }
        return session;
    }
    async validateSession(sessionId) {
        try {
            const session = await this.store.get(sessionId);
            if (!session) {
                return {
                    valid: false,
                    error: {
                        code: 'SESSION_NOT_FOUND',
                        message: 'Session not found',
                    },
                };
            }
            if (!session.isActive) {
                return {
                    valid: false,
                    error: {
                        code: 'SESSION_INACTIVE',
                        message: 'Session is no longer active',
                    },
                };
            }
            const now = Date.now();
            const timeSinceActivity = now - session.lastActivity;
            if (timeSinceActivity > this.config.sessionTimeout) {
                await this.store.update(sessionId, { isActive: false });
                if (this.config.auditSessions) {
                    this.logger.log('Session expired', {
                        sessionId,
                        userId: session.userId,
                        timeSinceActivity,
                    });
                }
                return {
                    valid: false,
                    error: {
                        code: 'SESSION_EXPIRED',
                        message: 'Session has expired',
                    },
                };
            }
            if (this.config.trackActivity) {
                await this.store.update(sessionId, { lastActivity: now });
            }
            const timeRemaining = this.config.sessionTimeout - timeSinceActivity;
            const warning = timeRemaining <= this.config.warningTime
                ? {
                    message: 'Your session will expire soon',
                    timeRemaining,
                }
                : undefined;
            return {
                valid: true,
                session,
                warning,
            };
        }
        catch (error) {
            this.logger.error('Session validation failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                sessionId,
            });
            return {
                valid: false,
                error: {
                    code: 'SESSION_VALIDATION_ERROR',
                    message: 'Session validation failed',
                },
            };
        }
    }
    extractSessionId(req) {
        if (req.cookies && req.cookies.sessionId) {
            return req.cookies.sessionId;
        }
        const sessionHeader = req.headers['x-session-id'];
        if (sessionHeader && typeof sessionHeader === 'string') {
            return sessionHeader;
        }
        return null;
    }
    isPublicRoute(path) {
        const publicRoutes = [
            '/auth/login',
            '/auth/register',
            '/health',
            '/api/health',
        ];
        return publicRoutes.some((route) => path.startsWith(route));
    }
    generateSessionId() {
        return crypto.randomBytes(32).toString('hex');
    }
    async endSession(sessionId) {
        try {
            const session = await this.store.get(sessionId);
            if (session) {
                await this.store.update(sessionId, { isActive: false });
                if (this.config.auditSessions) {
                    this.logger.log('Session ended', {
                        sessionId,
                        userId: session.userId,
                        duration: Date.now() - session.createdAt,
                    });
                }
            }
        }
        catch (error) {
            this.logger.error('Failed to end session', {
                error: error instanceof Error ? error.message : 'Unknown error',
                sessionId,
            });
        }
    }
    async endUserSessions(userId) {
        try {
            const sessions = await this.store.getUserSessions(userId);
            for (const session of sessions) {
                if (session.isActive) {
                    await this.store.update(session.sessionId, { isActive: false });
                }
            }
            if (this.config.auditSessions) {
                this.logger.log('All user sessions ended', {
                    userId,
                    sessionCount: sessions.length,
                });
            }
        }
        catch (error) {
            this.logger.error('Failed to end user sessions', {
                error: error instanceof Error ? error.message : 'Unknown error',
                userId,
            });
        }
    }
};
exports.SessionMiddleware = SessionMiddleware;
exports.SessionMiddleware = SessionMiddleware = SessionMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SessionMiddleware);
function createHealthcareSessionMiddleware() {
    const middleware = new SessionMiddleware();
    middleware.setConfig(session_types_1.SESSION_CONFIGS.healthcare);
    return middleware;
}
function createAdminSessionMiddleware() {
    const middleware = new SessionMiddleware();
    middleware.setConfig(session_types_1.SESSION_CONFIGS.admin);
    return middleware;
}
//# sourceMappingURL=session.middleware.js.map