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
exports.ChronicConditionRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const chronic_condition_model_1 = require("../../models/chronic-condition.model");
let ChronicConditionRepository = class ChronicConditionRepository {
    chronicConditionModel;
    constructor(chronicConditionModel) {
        this.chronicConditionModel = chronicConditionModel;
    }
    async findAll() {
        return this.chronicConditionModel.findAll();
    }
    async findById(id) {
        return this.chronicConditionModel.findByPk(id);
    }
    async create(data) {
        return this.chronicConditionModel.create(data);
    }
    async update(id, data) {
        return this.chronicConditionModel.update(data, {
            where: { id },
        });
    }
    async delete(id) {
        return this.chronicConditionModel.destroy({
            where: { id },
        });
    }
    async findByStudent(studentId) {
        return this.chronicConditionModel.findAll({
            where: { studentId, isActive: true },
            order: [['diagnosedDate', 'DESC']],
        });
    }
    async findBySeverity(severity) {
        return this.chronicConditionModel.findAll({
            where: { severity, isActive: true },
            order: [['condition', 'ASC']],
        });
    }
};
exports.ChronicConditionRepository = ChronicConditionRepository;
exports.ChronicConditionRepository = ChronicConditionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(chronic_condition_model_1.ChronicCondition)),
    __metadata("design:paramtypes", [Object])
], ChronicConditionRepository);
//# sourceMappingURL=chronic-condition.repository.js.map