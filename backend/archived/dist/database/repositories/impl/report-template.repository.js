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
exports.ReportTemplateRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
let ReportTemplateRepository = class ReportTemplateRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'ReportTemplate');
    }
    async validateCreate(data) { }
    async validateUpdate(id, data) { }
    async invalidateCaches(entity) {
        try {
            const entityData = entity.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, entityData.id));
            await this.cacheManager.deletePattern(`white-cross:${this.entityName.toLowerCase()}:*`);
        }
        catch (error) {
            this.logger.warn(`Error invalidating ${this.entityName} caches:`, error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({ ...data });
    }
};
exports.ReportTemplateRepository = ReportTemplateRepository;
exports.ReportTemplateRepository = ReportTemplateRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)('')),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ReportTemplateRepository);
//# sourceMappingURL=report-template.repository.js.map