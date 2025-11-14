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
exports.PolicyService = void 0;
const common_1 = require("@nestjs/common");
const policy_repository_1 = require("../repositories/policy.repository");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let PolicyService = class PolicyService extends base_1.BaseService {
    policyRepository;
    constructor(policyRepository) {
        super("PolicyService");
        this.policyRepository = policyRepository;
    }
    async listPolicies(query) {
        return this.policyRepository.findAllPolicies(query);
    }
    async getPolicyById(id) {
        const policy = await this.policyRepository.findPolicyById(id);
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${id} not found`);
        }
        return policy;
    }
    async createPolicy(dto) {
        return this.policyRepository.createPolicy({
            ...dto,
            status: models_1.PolicyStatus.DRAFT,
            effectiveDate: new Date(dto.effectiveDate),
            reviewDate: dto.reviewDate ? new Date(dto.reviewDate) : undefined,
        });
    }
    async updatePolicy(id, dto) {
        await this.getPolicyById(id);
        const updateData = { ...dto };
        if (dto.status === models_1.PolicyStatus.ACTIVE &&
            dto.approvedBy &&
            !updateData.approvedAt) {
            updateData.approvedAt = new Date();
        }
        if (dto.reviewDate) {
            updateData.reviewDate = new Date(dto.reviewDate);
        }
        return this.policyRepository.updatePolicy(id, updateData);
    }
    async deletePolicy(id) {
        await this.getPolicyById(id);
        return this.policyRepository.deletePolicy(id);
    }
    async acknowledgePolicy(policyId, userId, ipAddress) {
        const policy = await this.getPolicyById(policyId);
        if (policy.status !== models_1.PolicyStatus.ACTIVE) {
            throw new common_1.BadRequestException('Only active policies can be acknowledged');
        }
        const existing = await this.policyRepository.findAcknowledgment(policyId, userId);
        if (existing) {
            throw new common_1.BadRequestException('Policy already acknowledged by this user');
        }
        return this.policyRepository.createAcknowledgment({
            policyId,
            userId,
            ipAddress,
            acknowledgedAt: new Date(),
        });
    }
};
exports.PolicyService = PolicyService;
exports.PolicyService = PolicyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [policy_repository_1.PolicyRepository])
], PolicyService);
//# sourceMappingURL=policy.service.js.map