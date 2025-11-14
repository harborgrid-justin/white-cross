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
exports.ViolationRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
let ViolationRepository = class ViolationRepository {
    violationModel;
    remediationModel;
    constructor(violationModel, remediationModel) {
        this.violationModel = violationModel;
        this.remediationModel = remediationModel;
    }
    async findAllViolations(filters = {}, page = 1, limit = 20) {
        const whereClause = {};
        if (filters.violationType) {
            whereClause.violationType = filters.violationType;
        }
        if (filters.severity) {
            whereClause.severity = filters.severity;
        }
        if (filters.status) {
            whereClause.status = filters.status;
        }
        const { rows: data, count: total } = await this.violationModel.findAndCountAll({
            where: whereClause,
            order: [['discoveredAt', 'DESC']],
            limit,
            offset: (page - 1) * limit,
        });
        return { data, total };
    }
    async findViolationById(id) {
        return this.violationModel.findByPk(id);
    }
    async createViolation(data) {
        return this.violationModel.create(data);
    }
    async updateViolation(id, data) {
        const [affectedCount] = await this.violationModel.update(data, {
            where: { id },
        });
        if (affectedCount > 0) {
            return this.findViolationById(id);
        }
        return null;
    }
    async createRemediation(data) {
        return this.remediationModel.create(data);
    }
    async findRemediationById(id) {
        return this.remediationModel.findByPk(id);
    }
    async updateRemediation(id, data) {
        const [affectedCount] = await this.remediationModel.update(data, {
            where: { id },
        });
        if (affectedCount > 0) {
            return this.findRemediationById(id);
        }
        return null;
    }
    async findRemediationsByViolation(violationId) {
        return this.remediationModel.findAll({
            where: { violationId },
        });
    }
};
exports.ViolationRepository = ViolationRepository;
exports.ViolationRepository = ViolationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.ComplianceViolation)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.RemediationAction)),
    __metadata("design:paramtypes", [Object, Object])
], ViolationRepository);
//# sourceMappingURL=violation.repository.js.map