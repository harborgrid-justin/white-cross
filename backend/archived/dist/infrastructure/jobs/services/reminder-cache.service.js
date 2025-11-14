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
exports.ReminderCacheService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
const logger_service_1 = require("../../../common/logging/logger.service");
const cache_service_1 = require("../../cache/cache.service");
const CACHE_TTL = 3600000;
const CACHE_TAG_PREFIX = 'reminders';
let ReminderCacheService = class ReminderCacheService extends base_1.BaseService {
    cacheService;
    constructor(logger, cacheService) {
        super({
            serviceName: 'ReminderCacheService',
            logger,
            enableAuditLogging: true,
        });
        this.cacheService = cacheService;
    }
    cacheReminders(reminders, date, organizationId, studentId) {
        const cacheKey = this.buildCacheKey(date, organizationId, studentId);
        const tags = this.buildCacheTags(organizationId, studentId, reminders);
        this.cacheService.set(cacheKey, reminders, CACHE_TTL, tags);
        this.logDebug(`Cached ${reminders.length} reminders with key: ${cacheKey}`);
    }
    getCachedReminders(date, organizationId, studentId) {
        const cacheKey = this.buildCacheKey(date, organizationId, studentId);
        const cached = this.cacheService.get(cacheKey);
        if (cached) {
            this.logDebug(`Returning cached reminders for ${cacheKey}`);
            return cached;
        }
        return undefined;
    }
    buildCacheKey(date, organizationId, studentId) {
        const dateKey = date.toISOString().split('T')[0];
        const parts = [CACHE_TAG_PREFIX, dateKey];
        if (organizationId) {
            parts.push(`org:${organizationId}`);
        }
        if (studentId) {
            parts.push(`student:${studentId}`);
        }
        return parts.join(':');
    }
    buildCacheTags(organizationId, studentId, reminders) {
        const tags = [CACHE_TAG_PREFIX, 'medication'];
        if (organizationId) {
            tags.push(`org:${organizationId}`);
        }
        if (studentId) {
            tags.push(`student:${studentId}`);
        }
        if (reminders && reminders.length > 0) {
            const uniqueStudentIds = new Set(reminders.map((r) => `student:${r.studentId}`));
            tags.push(...Array.from(uniqueStudentIds));
        }
        return tags;
    }
    async invalidateStudentReminders(studentId) {
        const tag = `student:${studentId}`;
        const count = this.cacheService.invalidateByTag(tag);
        this.logDebug(`Invalidated ${count} cached reminder entries for student ${studentId}`);
    }
    async invalidateOrganizationReminders(organizationId) {
        const tag = `org:${organizationId}`;
        const count = this.cacheService.invalidateByTag(tag);
        this.logDebug(`Invalidated ${count} cached reminder entries for organization ${organizationId}`);
    }
};
exports.ReminderCacheService = ReminderCacheService;
exports.ReminderCacheService = ReminderCacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        cache_service_1.CacheService])
], ReminderCacheService);
//# sourceMappingURL=reminder-cache.service.js.map