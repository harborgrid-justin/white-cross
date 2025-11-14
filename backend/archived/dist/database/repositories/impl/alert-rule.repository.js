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
exports.AlertRuleRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
const alert_rule_model_1 = require("../../models/alert-rule.model");
let AlertRuleRepository = class AlertRuleRepository extends base_repository_1.BaseRepository {
    alertRuleModel;
    constructor(alertRuleModel, auditLogger, cacheManager) {
        super(alertRuleModel, auditLogger, cacheManager, 'AlertRule');
        this.alertRuleModel = alertRuleModel;
    }
    async validateCreate(data) {
        if (!data.name) {
            throw new base_repository_1.RepositoryError('Alert rule name is required', 'VALIDATION_ERROR');
        }
        if (!data.category) {
            throw new base_repository_1.RepositoryError('Alert category is required', 'VALIDATION_ERROR');
        }
        if (!data.severity) {
            throw new base_repository_1.RepositoryError('Alert severity is required', 'VALIDATION_ERROR');
        }
        if (!Array.isArray(data.triggerConditions) ||
            data.triggerConditions.length === 0) {
            throw new base_repository_1.RepositoryError('At least one trigger condition is required', 'VALIDATION_ERROR');
        }
        for (const condition of data.triggerConditions) {
            if (!condition.field || !condition.operator) {
                throw new base_repository_1.RepositoryError('Trigger condition must have field and operator', 'VALIDATION_ERROR');
            }
        }
        if (!Array.isArray(data.notificationChannels) ||
            data.notificationChannels.length === 0) {
            throw new base_repository_1.RepositoryError('At least one notification channel is required', 'VALIDATION_ERROR');
        }
        if (data.priority !== undefined &&
            (data.priority < 0 || data.priority > 100)) {
            throw new base_repository_1.RepositoryError('Priority must be between 0 and 100', 'VALIDATION_ERROR');
        }
        const existing = await this.alertRuleModel.findOne({
            where: { name: data.name },
        });
        if (existing) {
            throw new base_repository_1.RepositoryError(`Alert rule with name '${data.name}' already exists`, 'DUPLICATE_RECORD');
        }
    }
    async validateUpdate(id, data) {
        if (data.priority !== undefined &&
            (data.priority < 0 || data.priority > 100)) {
            throw new base_repository_1.RepositoryError('Priority must be between 0 and 100', 'VALIDATION_ERROR');
        }
        if (data.triggerConditions !== undefined) {
            if (!Array.isArray(data.triggerConditions) ||
                data.triggerConditions.length === 0) {
                throw new base_repository_1.RepositoryError('At least one trigger condition is required', 'VALIDATION_ERROR');
            }
            for (const condition of data.triggerConditions) {
                if (!condition.field || !condition.operator) {
                    throw new base_repository_1.RepositoryError('Trigger condition must have field and operator', 'VALIDATION_ERROR');
                }
            }
        }
        if (data.notificationChannels !== undefined) {
            if (!Array.isArray(data.notificationChannels) ||
                data.notificationChannels.length === 0) {
                throw new base_repository_1.RepositoryError('At least one notification channel is required', 'VALIDATION_ERROR');
            }
        }
        if (data.name) {
            const existing = await this.alertRuleModel.findOne({
                where: { name: data.name },
            });
            if (existing && existing.id !== id) {
                throw new base_repository_1.RepositoryError(`Alert rule with name '${data.name}' already exists`, 'DUPLICATE_RECORD');
            }
        }
    }
    async invalidateCaches(entity) {
        try {
            const entityData = entity.get ? entity.get() : entity;
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, entityData.id));
            await this.cacheManager.delete(`white-cross:alert-rules:category:${entityData.category}`);
            await this.cacheManager.delete(`white-cross:alert-rules:severity:${entityData.severity}`);
            await this.cacheManager.delete(`white-cross:alert-rules:active`);
            if (entityData.schoolId) {
                await this.cacheManager.delete(`white-cross:alert-rules:school:${entityData.schoolId}`);
            }
            if (entityData.districtId) {
                await this.cacheManager.delete(`white-cross:alert-rules:district:${entityData.districtId}`);
            }
            await this.cacheManager.deletePattern(`white-cross:${this.entityName.toLowerCase()}:*`);
        }
        catch (error) {
            this.logger.warn(`Error invalidating ${this.entityName} caches:`, error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({ ...data });
    }
    async findActiveByCategory(category) {
        const cacheKey = `white-cross:alert-rules:category:${category}:active`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const rules = await this.alertRuleModel.findAll({
            where: {
                category,
                isActive: true,
            },
            order: [['priority', 'DESC']],
        });
        await this.cacheManager.set(cacheKey, rules, 1800);
        return rules;
    }
    async findActiveBySeverity(severity) {
        const cacheKey = `white-cross:alert-rules:severity:${severity}:active`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const rules = await this.alertRuleModel.findAll({
            where: {
                severity,
                isActive: true,
            },
            order: [['priority', 'DESC']],
        });
        await this.cacheManager.set(cacheKey, rules, 1800);
        return rules;
    }
    async findAllActive() {
        const cacheKey = `white-cross:alert-rules:active`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const rules = await this.alertRuleModel.findAll({
            where: { isActive: true },
            order: [
                ['priority', 'DESC'],
                ['category', 'ASC'],
            ],
        });
        await this.cacheManager.set(cacheKey, rules, 1800);
        return rules;
    }
};
exports.AlertRuleRepository = AlertRuleRepository;
exports.AlertRuleRepository = AlertRuleRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(alert_rule_model_1.AlertRule)),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], AlertRuleRepository);
//# sourceMappingURL=alert-rule.repository.js.map