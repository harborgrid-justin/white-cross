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
var WsJwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsJwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const auth_1 = require("../../../services/auth");
let WsJwtAuthGuard = WsJwtAuthGuard_1 = class WsJwtAuthGuard {
    jwtService;
    configService;
    tokenBlacklistService;
    logger = new common_1.Logger(WsJwtAuthGuard_1.name);
    constructor(jwtService, configService, tokenBlacklistService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.tokenBlacklistService = tokenBlacklistService;
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        try {
            const token = this.extractToken(client);
            if (!token) {
                this.logger.warn('WebSocket connection attempt without token', {
                    socketId: client.id,
                    remoteAddress: client.handshake.address,
                });
                throw new websockets_1.WsException('Authentication token required');
            }
            const payload = await this.verifyToken(token);
            const isBlacklisted = await this.tokenBlacklistService.isTokenBlacklisted(token);
            if (isBlacklisted) {
                this.logger.warn('Blacklisted token attempted WebSocket connection', {
                    socketId: client.id,
                    userId: payload.sub || payload.userId,
                    remoteAddress: client.handshake.address,
                });
                throw new websockets_1.WsException('Token has been revoked');
            }
            const userId = payload.sub || payload.userId || payload.id;
            if (userId && payload.iat) {
                const userTokensBlacklisted = await this.tokenBlacklistService.areUserTokensBlacklisted(userId, payload.iat);
                if (userTokensBlacklisted) {
                    this.logger.warn('User tokens invalidated - WebSocket connection denied', {
                        socketId: client.id,
                        userId,
                        tokenIssuedAt: new Date(payload.iat * 1000).toISOString(),
                        remoteAddress: client.handshake.address,
                    });
                    throw new websockets_1.WsException('Session invalidated. Please login again.');
                }
            }
            client.user = this.mapToAuthPayload(payload);
            this.logger.log(`WebSocket authenticated successfully`, {
                socketId: client.id,
                userId: client.user.userId,
                organizationId: client.user.organizationId,
                role: client.user.role,
                remoteAddress: client.handshake.address,
            });
            return true;
        }
        catch (error) {
            this.logger.error('WebSocket authentication failed', {
                socketId: client.id,
                error: error instanceof Error ? error.message : 'Unknown error',
                remoteAddress: client.handshake.address,
                errorType: error?.constructor?.name,
            });
            client.disconnect(true);
            if (error instanceof websockets_1.WsException) {
                throw error;
            }
            throw new websockets_1.WsException(error instanceof Error ? error.message : 'Authentication failed');
        }
    }
    extractToken(client) {
        const authToken = client.handshake.auth?.token;
        if (authToken) {
            return authToken;
        }
        const authHeader = client.handshake.headers?.authorization;
        if (authHeader) {
            if (authHeader.startsWith('Bearer ')) {
                return authHeader.replace('Bearer ', '');
            }
            if (Array.isArray(authHeader) && authHeader[0]?.startsWith('Bearer ')) {
                return authHeader[0].replace('Bearer ', '');
            }
        }
        const queryToken = client.handshake.query?.token;
        if (queryToken) {
            this.logger.warn('Token provided via query parameter (less secure)', {
                socketId: client.id,
                remoteAddress: client.handshake.address,
            });
            return typeof queryToken === 'string' ? queryToken : (Array.isArray(queryToken) && queryToken.length > 0 ? queryToken[0] : null) || null;
        }
        return null;
    }
    async verifyToken(token) {
        const secret = this.configService.get('JWT_SECRET');
        if (!secret) {
            this.logger.error('JWT_SECRET not configured - cannot verify WebSocket tokens');
            throw new Error('JWT_SECRET not configured');
        }
        try {
            return this.jwtService.verify(token, { secret });
        }
        catch (error) {
            this.logger.warn('JWT token verification failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                errorType: error?.constructor?.name,
            });
            if (error instanceof Error) {
                if (error.name === 'TokenExpiredError') {
                    throw new Error('Token has expired');
                }
                else if (error.name === 'JsonWebTokenError') {
                    throw new Error('Invalid token');
                }
                else if (error.name === 'NotBeforeError') {
                    throw new Error('Token not yet valid');
                }
            }
            throw new Error('Token verification failed');
        }
    }
    mapToAuthPayload(payload) {
        const userId = payload.sub || payload.userId || payload.id;
        if (!userId) {
            throw new Error('User ID not found in token payload');
        }
        return {
            userId,
            organizationId: payload.organizationId || payload.schoolId || payload.districtId || '',
            role: payload.role || 'user',
            email: payload.email || '',
        };
    }
};
exports.WsJwtAuthGuard = WsJwtAuthGuard;
exports.WsJwtAuthGuard = WsJwtAuthGuard = WsJwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        auth_1.TokenBlacklistService])
], WsJwtAuthGuard);
//# sourceMappingURL=ws-jwt-auth.guard.js.map