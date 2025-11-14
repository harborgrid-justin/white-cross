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
exports.ChecklistRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
let ChecklistRepository = class ChecklistRepository {
    checklistItemModel;
    constructor(checklistItemModel) {
        this.checklistItemModel = checklistItemModel;
    }
    async findAll(filters = {}, page = 1, limit = 20) {
        const whereClause = {};
        if (filters.reportId) {
            whereClause.reportId = filters.reportId;
        }
        if (filters.category) {
            whereClause.category = filters.category;
        }
        if (filters.status) {
            whereClause.status = filters.status;
        }
        const { rows: data, count: total } = await this.checklistItemModel.findAndCountAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit,
        });
        return { data, total };
    }
    async findById(id) {
        return this.checklistItemModel.findByPk(id);
    }
    async create(data) {
        return this.checklistItemModel.create(data);
    }
    async update(id, data) {
        const [affectedCount] = await this.checklistItemModel.update(data, {
            where: { id },
        });
        if (affectedCount > 0) {
            return this.findById(id);
        }
        return null;
    }
    async delete(id) {
        return this.checklistItemModel.destroy({ where: { id } });
    }
};
exports.ChecklistRepository = ChecklistRepository;
exports.ChecklistRepository = ChecklistRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.ComplianceChecklistItem)),
    __metadata("design:paramtypes", [Object])
], ChecklistRepository);
//# sourceMappingURL=checklist.repository.js.map