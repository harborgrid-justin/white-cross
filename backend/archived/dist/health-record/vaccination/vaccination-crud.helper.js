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
var VaccinationCrudHelper_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccinationCrudHelper = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const vaccination_interface_1 = require("../interfaces/vaccination.interface");
let VaccinationCrudHelper = VaccinationCrudHelper_1 = class VaccinationCrudHelper {
    vaccinationModel;
    studentModel;
    logger = new common_1.Logger(VaccinationCrudHelper_1.name);
    constructor(vaccinationModel, studentModel) {
        this.vaccinationModel = vaccinationModel;
        this.studentModel = studentModel;
    }
    async getOverdueVaccinations(limit = 100) {
        const today = new Date();
        const overdueVaccinations = await this.vaccinationModel.findAll({
            where: {
                nextDueDate: { [sequelize_2.Op.lt]: today },
                seriesComplete: false,
            },
            include: ['student'],
            order: [['nextDueDate', 'ASC']],
            limit,
        });
        this.logger.log(`PHI Access: Overdue vaccinations query performed, results: ${overdueVaccinations.length}`);
        return overdueVaccinations;
    }
    async createExemption(studentId, exemptionDto) {
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const exemption = await this.vaccinationModel.create({
            id: require('uuid').v4(),
            studentId,
            vaccineName: exemptionDto.vaccineName,
            vaccineType: exemptionDto.vaccineName,
            seriesComplete: false,
            administrationDate: new Date(),
            administeredBy: 'EXEMPT',
            exemptionStatus: true,
            exemptionReason: exemptionDto.reason,
            complianceStatus: vaccination_interface_1.ComplianceStatus.EXEMPT,
            vfcEligibility: false,
            visProvided: false,
            consentObtained: false,
            notes: `Exemption: ${exemptionDto.exemptionType} - ${exemptionDto.reason}`,
        });
        this.logger.log(`PHI Created: Vaccination exemption created for student ${studentId} (${exemptionDto.vaccineName})`);
        return exemption;
    }
};
exports.VaccinationCrudHelper = VaccinationCrudHelper;
exports.VaccinationCrudHelper = VaccinationCrudHelper = VaccinationCrudHelper_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Vaccination)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Student)),
    __metadata("design:paramtypes", [Object, Object])
], VaccinationCrudHelper);
//# sourceMappingURL=vaccination-crud.helper.js.map