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
exports.EmailRateLimiterService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
const config_1 = require("@nestjs/config");
let EmailRateLimiterService = class EmailRateLimiterService extends base_1.BaseService {
    configService;
    enabled;
    globalConfig;
    perRecipientConfig;
    store = new Map();
    cleanupIntervalId;
    constructor(logger, configService) {
        super({
            serviceName: 'EmailRateLimiterService',
            logger,
            enableAuditLogging: true,
        });
        this.configService = configService;
        this.enabled = this.configService.get('EMAIL_RATE_LIMIT_ENABLED', true);
        this.globalConfig = {
            maxEmails: this.configService.get('EMAIL_RATE_LIMIT_GLOBAL_MAX', 100),
            windowMs: this.configService.get('EMAIL_RATE_LIMIT_GLOBAL_WINDOW', 3600000),
            scope: 'global',
        };
        this.perRecipientConfig = {
            maxEmails: this.configService.get('EMAIL_RATE_LIMIT_RECIPIENT_MAX', 10),
            windowMs: this.configService.get('EMAIL_RATE_LIMIT_RECIPIENT_WINDOW', 3600000),
            scope: 'recipient',
        };
        this.cleanupIntervalId = setInterval(() => this.cleanup(), 300000);
        this.logInfo(`EmailRateLimiterService initialized (enabled: ${this.enabled}, ` +
            `global: ${this.globalConfig.maxEmails}/${this.globalConfig.windowMs}ms, ` +
            `recipient: ${this.perRecipientConfig.maxEmails}/${this.perRecipientConfig.windowMs}ms)`);
    }
    onModuleDestroy() {
        if (this.cleanupIntervalId) {
            clearInterval(this.cleanupIntervalId);
        }
    }
    checkLimit(recipients) {
        if (!this.enabled) {
            return {
                allowed: true,
                remaining: Infinity,
                resetAt: new Date(Date.now() + this.globalConfig.windowMs),
                identifier: 'disabled',
            };
        }
        const recipientArray = Array.isArray(recipients) ? recipients : [recipients];
        const globalStatus = this.checkGlobalLimit(recipientArray.length);
        if (!globalStatus.allowed) {
            return globalStatus;
        }
        for (const recipient of recipientArray) {
            const recipientStatus = this.checkRecipientLimit(recipient);
            if (!recipientStatus.allowed) {
                return recipientStatus;
            }
        }
        return globalStatus;
    }
    recordSent(recipients) {
        if (!this.enabled) {
            return;
        }
        const recipientArray = Array.isArray(recipients) ? recipients : [recipients];
        this.incrementCounter('global', recipientArray.length, this.globalConfig.windowMs);
        for (const recipient of recipientArray) {
            this.incrementCounter(`recipient:${recipient.toLowerCase()}`, 1, this.perRecipientConfig.windowMs);
        }
        this.logDebug(`Recorded ${recipientArray.length} email(s) sent`);
    }
    checkGlobalLimit(count = 1) {
        const key = 'global';
        const config = this.globalConfig;
        const entry = this.getOrCreateEntry(key, config.windowMs);
        const allowed = entry.count + count <= config.maxEmails;
        const remaining = Math.max(0, config.maxEmails - entry.count - count);
        return {
            allowed,
            remaining,
            resetAt: entry.resetAt,
            identifier: key,
        };
    }
    checkRecipientLimit(recipient) {
        const key = `recipient:${recipient.toLowerCase()}`;
        const config = this.perRecipientConfig;
        const entry = this.getOrCreateEntry(key, config.windowMs);
        const allowed = entry.count + 1 <= config.maxEmails;
        const remaining = Math.max(0, config.maxEmails - entry.count - 1);
        return {
            allowed,
            remaining,
            resetAt: entry.resetAt,
            identifier: recipient,
        };
    }
    getOrCreateEntry(key, windowMs) {
        const now = Date.now();
        const existing = this.store.get(key);
        if (existing && existing.resetAt.getTime() > now) {
            return existing;
        }
        const entry = {
            count: 0,
            resetAt: new Date(now + windowMs),
        };
        this.store.set(key, entry);
        return entry;
    }
    incrementCounter(key, count, windowMs) {
        const entry = this.getOrCreateEntry(key, windowMs);
        entry.count += count;
        this.store.set(key, entry);
    }
    cleanup() {
        const now = Date.now();
        let cleanedCount = 0;
        for (const [key, entry] of this.store.entries()) {
            if (entry.resetAt.getTime() <= now) {
                this.store.delete(key);
                cleanedCount++;
            }
        }
        if (cleanedCount > 0) {
            this.logDebug(`Cleaned up ${cleanedCount} expired rate limit entries`);
        }
    }
    resetLimit(identifier) {
        const key = identifier === 'global' ? 'global' : `recipient:${identifier.toLowerCase()}`;
        this.store.delete(key);
        this.logDebug(`Reset rate limit for: ${identifier}`);
    }
    resetAll() {
        this.store.clear();
        this.logInfo('Reset all rate limits');
    }
    getStatus(identifier, scope = 'recipient') {
        const key = scope === 'global' ? 'global' : `recipient:${identifier.toLowerCase()}`;
        const config = scope === 'global' ? this.globalConfig : this.perRecipientConfig;
        const entry = this.store.get(key);
        if (!entry || entry.resetAt.getTime() <= Date.now()) {
            return {
                allowed: true,
                remaining: config.maxEmails,
                resetAt: new Date(Date.now() + config.windowMs),
                identifier,
            };
        }
        const remaining = Math.max(0, config.maxEmails - entry.count);
        const allowed = remaining > 0;
        return {
            allowed,
            remaining,
            resetAt: entry.resetAt,
            identifier,
        };
    }
    getAllLimits() {
        this.cleanup();
        return new Map(this.store);
    }
    getStats() {
        return {
            enabled: this.enabled,
            totalTracked: this.store.size,
            globalLimit: this.globalConfig,
            recipientLimit: this.perRecipientConfig,
        };
    }
    async waitForLimit(recipients) {
        if (!this.enabled) {
            return;
        }
        let status = this.checkLimit(recipients);
        while (!status.allowed) {
            const waitTime = status.resetAt.getTime() - Date.now();
            if (waitTime > 0) {
                this.logDebug(`Rate limit exceeded, waiting ${waitTime}ms for: ${status.identifier}`);
                await new Promise((resolve) => setTimeout(resolve, Math.min(waitTime, 60000)));
            }
            status = this.checkLimit(recipients);
        }
    }
    isEnabled() {
        return this.enabled;
    }
    getConfig() {
        return {
            enabled: this.enabled,
            global: this.globalConfig,
            perRecipient: this.perRecipientConfig,
        };
    }
};
exports.EmailRateLimiterService = EmailRateLimiterService;
exports.EmailRateLimiterService = EmailRateLimiterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService])
], EmailRateLimiterService);
//# sourceMappingURL=email-rate-limiter.service.js.map