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
exports.DataRetentionService = void 0;
const common_1 = require("@nestjs/common");
const data_retention_repository_1 = require("../repositories/data-retention.repository");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let DataRetentionService = class DataRetentionService extends base_1.BaseService {
    retentionRepository;
    constructor(retentionRepository) {
        super("DataRetentionService");
        this.retentionRepository = retentionRepository;
    }
    async listPolicies(query) {
        return this.retentionRepository.findAll(query);
    }
    async getPolicyById(id) {
        const policy = await this.retentionRepository.findById(id);
        if (!policy) {
            throw new common_1.NotFoundException(`Data retention policy with ID ${id} not found`);
        }
        return policy;
    }
    async createPolicy(dto) {
        return this.retentionRepository.create({
            ...dto,
            status: models_1.RetentionStatus.ACTIVE,
            autoDelete: dto.autoDelete ?? false,
        });
    }
    async updatePolicy(id, dto, reviewedBy) {
        await this.getPolicyById(id);
        return this.retentionRepository.update(id, {
            ...dto,
            lastReviewedAt: new Date(),
            lastReviewedBy: reviewedBy,
        });
    }
    async deletePolicy(id) {
        await this.getPolicyById(id);
        return this.retentionRepository.delete(id);
    }
};
exports.DataRetentionService = DataRetentionService;
exports.DataRetentionService = DataRetentionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [data_retention_repository_1.DataRetentionRepository])
], DataRetentionService);
//# sourceMappingURL=data-retention.service.js.map