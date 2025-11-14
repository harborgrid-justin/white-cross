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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBlacklistService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const ioredis_1 = __importDefault(require("ioredis"));
const base_1 = require("../../../common/base");
const logger_service_1 = require("../../../common/logging/logger.service");
const common_2 = require("@nestjs/common");
let TokenBlacklistService = class TokenBlacklistService extends base_1.BaseService {
    configService;
    jwtService;
    redisClient = null;
    BLACKLIST_PREFIX = 'token:blacklist:';
    constructor(logger, configService, jwtService) {
        super({
            serviceName: 'TokenBlacklistService',
            logger,
            enableAuditLogging: true,
        });
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async onModuleInit() {
        await this.initializeRedis();
    }
    async initializeRedis() {
        try {
            const redisHost = this.configService.get('REDIS_HOST', 'localhost');
            const redisPort = this.configService.get('REDIS_PORT', 6379);
            const redisPassword = this.configService.get('REDIS_PASSWORD');
            this.redisClient = new ioredis_1.default({
                host: redisHost,
                port: redisPort,
                password: redisPassword || undefined,
                db: 0,
                retryStrategy: (times) => {
                    if (times > 3) {
                        this.logError('Failed to connect to Redis after 3 attempts');
                        return null;
                    }
                    return Math.min(times * 200, 1000);
                },
                enableReadyCheck: true,
                maxRetriesPerRequest: 3,
            });
            this.redisClient.on('connect', () => {
                this.logInfo('Token Blacklist Redis connected');
            });
            this.redisClient.on('error', (error) => {
                this.logError('Token Blacklist Redis error:', error);
            });
            await this.redisClient.ping();
            this.logInfo('Token Blacklist Service initialized with Redis');
        }
        catch (error) {
            this.logError('Failed to initialize Redis for token blacklist:', error);
            this.logWarning('SECURITY WARNING: Token blacklist will use in-memory storage. ' +
                'This is NOT suitable for production with multiple instances.');
        }
    }
    async blacklistToken(token, userId) {
        try {
            const decoded = this.jwtService.decode(token);
            if (!decoded || !decoded.exp) {
                this.logWarning('Cannot blacklist token without expiration');
                return;
            }
            const now = Math.floor(Date.now() / 1000);
            const ttl = decoded.exp - now;
            if (ttl <= 0) {
                this.logDebug('Token already expired, skipping blacklist');
                return;
            }
            const key = this.getBlacklistKey(token);
            if (this.redisClient) {
                await this.redisClient.setex(key, ttl, JSON.stringify({
                    userId: userId || decoded.sub,
                    blacklistedAt: new Date().toISOString(),
                    expiresAt: new Date(decoded.exp * 1000).toISOString(),
                }));
                this.logInfo(`Token blacklisted for user ${userId || decoded.sub}, expires in ${ttl}s`);
            }
            else {
                this.logWarning('Redis not available, token not blacklisted');
            }
        }
        catch (error) {
            this.logError('Failed to blacklist token:', error);
            throw error;
        }
    }
    async isTokenBlacklisted(token) {
        try {
            if (!this.redisClient) {
                this.logWarning('Redis not available, cannot verify token blacklist');
                return false;
            }
            const key = this.getBlacklistKey(token);
            const exists = await this.redisClient.exists(key);
            return exists === 1;
        }
        catch (error) {
            this.logError('Failed to check token blacklist:', error);
            return false;
        }
    }
    async blacklistAllUserTokens(userId) {
        try {
            if (!this.redisClient) {
                this.logWarning('Redis not available, cannot blacklist user tokens');
                return;
            }
            const key = `${this.BLACKLIST_PREFIX}user:${userId}`;
            const timestamp = Date.now();
            await this.redisClient.setex(key, 7 * 24 * 60 * 60, timestamp.toString());
            this.logInfo(`All tokens blacklisted for user ${userId}`);
        }
        catch (error) {
            this.logError('Failed to blacklist user tokens:', error);
            throw error;
        }
    }
    async areUserTokensBlacklisted(userId, tokenIssuedAt) {
        try {
            if (!this.redisClient) {
                return false;
            }
            const key = `${this.BLACKLIST_PREFIX}user:${userId}`;
            const blacklistTimestamp = await this.redisClient.get(key);
            if (!blacklistTimestamp) {
                return false;
            }
            const blacklistTime = parseInt(blacklistTimestamp, 10);
            const tokenTime = tokenIssuedAt * 1000;
            return tokenTime < blacklistTime;
        }
        catch (error) {
            this.logError('Failed to check user token blacklist:', error);
            return false;
        }
    }
    getBlacklistKey(token) {
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256').update(token).digest('hex');
        return `${this.BLACKLIST_PREFIX}${hash}`;
    }
    async onModuleDestroy() {
        if (this.redisClient) {
            await this.redisClient.quit();
        }
    }
};
exports.TokenBlacklistService = TokenBlacklistService;
exports.TokenBlacklistService = TokenBlacklistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService,
        jwt_1.JwtService])
], TokenBlacklistService);
//# sourceMappingURL=token-blacklist.service.js.map