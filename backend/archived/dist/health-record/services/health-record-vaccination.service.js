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
exports.HealthRecordVaccinationService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const base_1 = require("../../common/base");
let HealthRecordVaccinationService = class HealthRecordVaccinationService extends base_1.BaseService {
    vaccinationModel;
    studentModel;
    constructor(vaccinationModel, studentModel) {
        super("HealthRecordVaccinationService");
        this.vaccinationModel = vaccinationModel;
        this.studentModel = studentModel;
    }
    async addVaccination(data) {
        const student = await this.studentModel.findByPk(data.studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const seriesComplete = data.doseNumber && data.totalDoses
            ? data.doseNumber >= data.totalDoses
            : false;
        const vaccinationData = {
            ...data,
            seriesComplete,
        };
        const savedVaccination = await this.vaccinationModel.create(vaccinationData);
        const vaccinationWithRelations = await this.vaccinationModel.findByPk(savedVaccination.id, {
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!vaccinationWithRelations) {
            throw new Error('Failed to reload vaccination after creation');
        }
        this.logInfo(`PHI Created: Vaccination ${data.vaccineName} for student ${student.firstName} ${student.lastName}`);
        return vaccinationWithRelations;
    }
    async getStudentVaccinations(studentId) {
        const vaccinations = await this.vaccinationModel.findAll({
            where: { studentId },
            include: [{ model: this.studentModel, as: 'student' }],
            order: [['administrationDate', 'DESC']],
        });
        this.logInfo(`PHI Access: Vaccinations retrieved for student ${studentId}, count: ${vaccinations.length}`);
        return vaccinations;
    }
    async updateVaccination(id, data) {
        const existingVaccination = await this.vaccinationModel.findOne({
            where: { id },
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!existingVaccination) {
            throw new common_1.NotFoundException('Vaccination not found');
        }
        const updateData = { ...data };
        if (data.doseNumber || data.totalDoses) {
            const doseNumber = data.doseNumber || existingVaccination.doseNumber;
            const totalDoses = data.totalDoses || existingVaccination.totalDoses;
            if (doseNumber && totalDoses) {
                updateData.seriesComplete = doseNumber >= totalDoses;
            }
        }
        await existingVaccination.update(updateData);
        const vaccinationWithRelations = await this.vaccinationModel.findByPk(id, {
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!vaccinationWithRelations) {
            throw new Error('Failed to reload vaccination after update');
        }
        this.logInfo(`PHI Modified: Vaccination ${vaccinationWithRelations.vaccineName} updated for student ${vaccinationWithRelations.student.firstName} ${vaccinationWithRelations.student.lastName}`);
        return vaccinationWithRelations;
    }
    async deleteVaccination(id) {
        const vaccination = await this.vaccinationModel.findOne({
            where: { id },
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!vaccination) {
            throw new common_1.NotFoundException('Vaccination not found');
        }
        await this.vaccinationModel.destroy({ where: { id } });
        this.logWarning(`Vaccination deleted: ${vaccination.vaccineName} for ${vaccination.student.firstName} ${vaccination.student.lastName}`);
        return { success: true };
    }
};
exports.HealthRecordVaccinationService = HealthRecordVaccinationService;
exports.HealthRecordVaccinationService = HealthRecordVaccinationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Vaccination)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Student)),
    __metadata("design:paramtypes", [Object, Object])
], HealthRecordVaccinationService);
//# sourceMappingURL=health-record-vaccination.service.js.map