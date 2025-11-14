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
exports.ViolationService = void 0;
const common_1 = require("@nestjs/common");
const violation_repository_1 = require("../repositories/violation.repository");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const base_1 = require("../../common/base");
let ViolationService = class ViolationService extends base_1.BaseService {
    violationRepository;
    constructor(violationRepository) {
        super("ViolationService");
        this.violationRepository = violationRepository;
    }
    async listViolations(query) {
        const { page = 1, limit = 20, ...filters } = query;
        const { data, total } = await this.violationRepository.findAllViolations(filters, page, limit);
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getViolationById(id) {
        const violation = await this.violationRepository.findViolationById(id);
        if (!violation) {
            throw new common_1.NotFoundException(`Violation with ID ${id} not found`);
        }
        return violation;
    }
    async createViolation(dto, reportedBy) {
        return this.violationRepository.createViolation({
            ...dto,
            reportedBy,
            status: models_1.ViolationStatus.REPORTED,
            discoveredAt: new Date(dto.discoveredAt),
        });
    }
    async updateViolation(id, dto) {
        await this.getViolationById(id);
        const updateData = { ...dto };
        if (dto.status === models_1.ViolationStatus.RESOLVED && !updateData.resolvedAt) {
            updateData.resolvedAt = new Date();
        }
        return this.violationRepository.updateViolation(id, updateData);
    }
    async createRemediation(dto) {
        return this.violationRepository.createRemediation({
            ...dto,
            status: models_2.RemediationStatus.PLANNED,
            dueDate: new Date(dto.dueDate),
        });
    }
    async updateRemediation(id, dto) {
        const remediation = await this.violationRepository.findRemediationById(id);
        if (!remediation) {
            throw new common_1.NotFoundException(`Remediation action with ID ${id} not found`);
        }
        const updateData = { ...dto };
        if (dto.status === models_2.RemediationStatus.COMPLETED && !updateData.completedAt) {
            updateData.completedAt = new Date();
        }
        if (dto.verifiedBy && !updateData.verifiedAt) {
            updateData.verifiedAt = new Date();
        }
        return this.violationRepository.updateRemediation(id, updateData);
    }
    async getRemediationsByViolation(violationId) {
        return this.violationRepository.findRemediationsByViolation(violationId);
    }
};
exports.ViolationService = ViolationService;
exports.ViolationService = ViolationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [violation_repository_1.ViolationRepository])
], ViolationService);
//# sourceMappingURL=violation.service.js.map