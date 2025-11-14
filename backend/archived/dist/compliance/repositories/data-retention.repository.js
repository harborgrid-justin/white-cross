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
exports.DataRetentionRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
let DataRetentionRepository = class DataRetentionRepository {
    dataRetentionModel;
    constructor(dataRetentionModel) {
        this.dataRetentionModel = dataRetentionModel;
    }
    async findAll(filters = {}) {
        const whereClause = {};
        if (filters.category) {
            whereClause.category = filters.category;
        }
        if (filters.status) {
            whereClause.status = filters.status;
        }
        return this.dataRetentionModel.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
        });
    }
    async findById(id) {
        return this.dataRetentionModel.findByPk(id);
    }
    async create(data) {
        return this.dataRetentionModel.create(data);
    }
    async update(id, data) {
        const [affectedCount] = await this.dataRetentionModel.update(data, {
            where: { id },
        });
        if (affectedCount > 0) {
            return this.findById(id);
        }
        return null;
    }
    async delete(id) {
        return this.dataRetentionModel.destroy({ where: { id } });
    }
};
exports.DataRetentionRepository = DataRetentionRepository;
exports.DataRetentionRepository = DataRetentionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.DataRetentionPolicy)),
    __metadata("design:paramtypes", [Object])
], DataRetentionRepository);
//# sourceMappingURL=data-retention.repository.js.map