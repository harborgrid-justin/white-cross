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
exports.HealthRecordChronicConditionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const base_1 = require("../../common/base");
let HealthRecordChronicConditionService = class HealthRecordChronicConditionService extends base_1.BaseService {
    chronicConditionModel;
    studentModel;
    constructor(chronicConditionModel, studentModel) {
        super("HealthRecordChronicConditionService");
        this.chronicConditionModel = chronicConditionModel;
        this.studentModel = studentModel;
    }
    async addChronicCondition(data) {
        const student = await this.studentModel.findByPk(data.studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const conditionData = {
            ...data,
            isActive: true,
        };
        const savedCondition = await this.chronicConditionModel.create(conditionData);
        const conditionWithRelations = await this.chronicConditionModel.findByPk(savedCondition.id, {
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!conditionWithRelations) {
            throw new Error('Failed to reload chronic condition after creation');
        }
        this.logInfo(`PHI Created: Chronic condition ${data.condition} for student ${student.firstName} ${student.lastName}`);
        return conditionWithRelations;
    }
    async getStudentChronicConditions(studentId) {
        const conditions = await this.chronicConditionModel.findAll({
            where: { studentId, isActive: true },
            include: [{ model: this.studentModel, as: 'student' }],
            order: [
                ['status', 'ASC'],
                ['diagnosedDate', 'DESC'],
            ],
        });
        this.logInfo(`PHI Access: Chronic conditions retrieved for student ${studentId}, count: ${conditions.length}`);
        return conditions;
    }
    async updateChronicCondition(id, data) {
        const existingCondition = await this.chronicConditionModel.findOne({
            where: { id },
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!existingCondition) {
            throw new common_1.NotFoundException('Chronic condition not found');
        }
        await existingCondition.update(data);
        const conditionWithRelations = await this.chronicConditionModel.findByPk(id, {
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!conditionWithRelations) {
            throw new Error('Failed to reload chronic condition after update');
        }
        this.logInfo(`PHI Modified: Chronic condition ${conditionWithRelations.condition} updated for student ${conditionWithRelations.studentId}`);
        return conditionWithRelations;
    }
    async deleteChronicCondition(id) {
        const condition = await this.chronicConditionModel.findOne({
            where: { id },
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!condition) {
            throw new common_1.NotFoundException('Chronic condition not found');
        }
        await this.chronicConditionModel.destroy({ where: { id } });
        this.logWarning(`Chronic condition deleted: ${condition.condition} for student ${condition.studentId}`);
        return { success: true };
    }
};
exports.HealthRecordChronicConditionService = HealthRecordChronicConditionService;
exports.HealthRecordChronicConditionService = HealthRecordChronicConditionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.ChronicCondition)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Student)),
    __metadata("design:paramtypes", [Object, Object])
], HealthRecordChronicConditionService);
//# sourceMappingURL=health-record-chronic-condition.service.js.map