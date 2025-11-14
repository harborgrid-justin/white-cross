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
exports.PolicyRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
let PolicyRepository = class PolicyRepository {
    policyModel;
    acknowledgmentModel;
    constructor(policyModel, acknowledgmentModel) {
        this.policyModel = policyModel;
        this.acknowledgmentModel = acknowledgmentModel;
    }
    async findAllPolicies(filters = {}) {
        const whereClause = {};
        if (filters.category) {
            whereClause.category = filters.category;
        }
        if (filters.status) {
            whereClause.status = filters.status;
        }
        return this.policyModel.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
        });
    }
    async findPolicyById(id) {
        return this.policyModel.findByPk(id, {
            include: [{ model: models_2.PolicyAcknowledgment, as: 'acknowledgments' }],
        });
    }
    async createPolicy(data) {
        return this.policyModel.create(data);
    }
    async updatePolicy(id, data) {
        const [affectedCount] = await this.policyModel.update(data, {
            where: { id },
        });
        if (affectedCount > 0) {
            return this.findPolicyById(id);
        }
        return null;
    }
    async deletePolicy(id) {
        return this.policyModel.destroy({ where: { id } });
    }
    async createAcknowledgment(data) {
        return this.acknowledgmentModel.create(data);
    }
    async findAcknowledgment(policyId, userId) {
        return this.acknowledgmentModel.findOne({
            where: { policyId, userId },
        });
    }
};
exports.PolicyRepository = PolicyRepository;
exports.PolicyRepository = PolicyRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.PolicyDocument)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.PolicyAcknowledgment)),
    __metadata("design:paramtypes", [Object, Object])
], PolicyRepository);
//# sourceMappingURL=policy.repository.js.map