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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiterService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const base_1 = require("../../../common/base");
let RateLimiterService = class RateLimiterService extends base_1.BaseService {
    configService;
    limitStore = new Map();
    DEFAULT_PER_PHONE_LIMIT = 10;
    DEFAULT_PER_ACCOUNT_LIMIT = 1000;
    DEFAULT_WINDOW_SECONDS = 3600;
    constructor(configService) {
        super("RateLimiterService");
        this.configService = configService;
        this.DEFAULT_PER_PHONE_LIMIT = this.configService.get('SMS_RATE_LIMIT_PER_PHONE', 10);
        this.DEFAULT_PER_ACCOUNT_LIMIT = this.configService.get('SMS_RATE_LIMIT_PER_ACCOUNT', 1000);
        this.logInfo(`Rate limiter initialized - Per phone: ${this.DEFAULT_PER_PHONE_LIMIT}/hr, Per account: ${this.DEFAULT_PER_ACCOUNT_LIMIT}/hr`);
        setInterval(() => this.cleanupExpiredEntries(), 300000);
    }
    async checkPhoneNumberLimit(phoneNumber, maxMessages = this.DEFAULT_PER_PHONE_LIMIT, windowSeconds = this.DEFAULT_WINDOW_SECONDS) {
        const key = `phone:${phoneNumber}`;
        return this.checkLimit(key, maxMessages, windowSeconds);
    }
    async checkAccountLimit(accountId, maxMessages = this.DEFAULT_PER_ACCOUNT_LIMIT, windowSeconds = this.DEFAULT_WINDOW_SECONDS) {
        const key = `account:${accountId}`;
        return this.checkLimit(key, maxMessages, windowSeconds);
    }
    async incrementPhoneNumber(phoneNumber) {
        const key = `phone:${phoneNumber}`;
        return this.increment(key, this.DEFAULT_PER_PHONE_LIMIT, this.DEFAULT_WINDOW_SECONDS);
    }
    async incrementAccount(accountId) {
        const key = `account:${accountId}`;
        return this.increment(key, this.DEFAULT_PER_ACCOUNT_LIMIT, this.DEFAULT_WINDOW_SECONDS);
    }
    async resetPhoneNumber(phoneNumber) {
        const key = `phone:${phoneNumber}`;
        this.limitStore.delete(key);
        this.logDebug(`Reset rate limit for ${phoneNumber}`);
    }
    async resetAccount(accountId) {
        const key = `account:${accountId}`;
        this.limitStore.delete(key);
        this.logDebug(`Reset rate limit for account ${accountId}`);
    }
    async getStatistics() {
        let phoneNumbers = 0;
        let accounts = 0;
        for (const key of this.limitStore.keys()) {
            if (key.startsWith('phone:'))
                phoneNumbers++;
            if (key.startsWith('account:'))
                accounts++;
        }
        return {
            totalTracked: this.limitStore.size,
            phoneNumbers,
            accounts,
        };
    }
    async checkLimit(key, maxMessages, windowSeconds) {
        const now = Date.now();
        const windowMs = windowSeconds * 1000;
        const windowStart = now - windowMs;
        let timestamps = this.limitStore.get(key) || [];
        timestamps = timestamps.filter((ts) => ts > windowStart);
        this.limitStore.set(key, timestamps);
        const currentCount = timestamps.length;
        const remainingMessages = Math.max(0, maxMessages - currentCount);
        const isLimited = currentCount >= maxMessages;
        const oldestTimestamp = timestamps.length > 0 ? timestamps[0] : now;
        const resetAt = new Date(oldestTimestamp + windowMs);
        const resetInSeconds = Math.ceil((resetAt.getTime() - now) / 1000);
        return {
            isLimited,
            currentCount,
            maxMessages,
            remainingMessages,
            resetInSeconds: Math.max(0, resetInSeconds),
            resetAt: resetAt.toISOString(),
        };
    }
    async increment(key, maxMessages, windowSeconds) {
        const now = Date.now();
        const timestamps = this.limitStore.get(key) || [];
        timestamps.push(now);
        this.limitStore.set(key, timestamps);
        return this.checkLimit(key, maxMessages, windowSeconds);
    }
    cleanupExpiredEntries() {
        const now = Date.now();
        const maxAge = this.DEFAULT_WINDOW_SECONDS * 1000;
        let cleanedCount = 0;
        for (const [key, timestamps] of this.limitStore.entries()) {
            const validTimestamps = timestamps.filter((ts) => now - ts < maxAge);
            if (validTimestamps.length === 0) {
                this.limitStore.delete(key);
                cleanedCount++;
            }
            else if (validTimestamps.length !== timestamps.length) {
                this.limitStore.set(key, validTimestamps);
            }
        }
        if (cleanedCount > 0) {
            this.logDebug(`Cleaned up ${cleanedCount} expired rate limit entries`);
        }
    }
};
exports.RateLimiterService = RateLimiterService;
exports.RateLimiterService = RateLimiterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RateLimiterService);
//# sourceMappingURL=rate-limiter.service.js.map