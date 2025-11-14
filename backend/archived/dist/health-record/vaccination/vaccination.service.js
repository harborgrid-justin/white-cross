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
exports.VaccinationService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const vaccination_schedule_helper_1 = require("./vaccination-schedule.helper");
const vaccination_compliance_helper_1 = require("./vaccination-compliance.helper");
const vaccination_crud_helper_1 = require("./vaccination-crud.helper");
let VaccinationService = class VaccinationService extends base_1.BaseService {
    vaccinationModel;
    studentModel;
    scheduleHelper;
    complianceHelper;
    crudHelper;
    constructor(vaccinationModel, studentModel, scheduleHelper, complianceHelper, crudHelper) {
        super("VaccinationService");
        this.vaccinationModel = vaccinationModel;
        this.studentModel = studentModel;
        this.scheduleHelper = scheduleHelper;
        this.complianceHelper = complianceHelper;
        this.crudHelper = crudHelper;
    }
    async addVaccination(data) {
        this.logInfo(`Adding vaccination for student ${data.studentId}`);
        const student = await this.studentModel.findByPk(data.studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        if (data.cvxCode && !this.complianceHelper.validateCVXCode(data.cvxCode)) {
            this.logWarning(`Invalid CVX code provided: ${data.cvxCode}`);
        }
        const seriesComplete = data.doseNumber && data.totalDoses
            ? data.doseNumber >= data.totalDoses
            : false;
        let nextDueDate = null;
        if (!seriesComplete && data.doseNumber && data.totalDoses) {
            nextDueDate = this.scheduleHelper.calculateNextDueDate(data.administrationDate, data.vaccineType || null, data.doseNumber);
        }
        const complianceStatus = this.complianceHelper.determineComplianceStatus(data.administrationDate, nextDueDate, seriesComplete, data.exemptionStatus || false);
        const vaccination = this.vaccinationModel.build({
            ...data,
            seriesComplete,
            nextDueDate,
            complianceStatus,
        });
        const savedVaccination = await vaccination.save();
        const vaccinationWithRelations = await this.vaccinationModel.findByPk(savedVaccination.id, { include: ['student'] });
        this.logInfo(`PHI Created: Vaccination ${data.vaccineName} (CVX: ${data.cvxCode || 'N/A'}) for student ${student.firstName} ${student.lastName}, dose ${data.doseNumber || 'N/A'}/${data.totalDoses || 'N/A'}`);
        if (data.adverseEvents || data.reactions) {
            this.logWarning(`Adverse event reported for vaccination ${vaccinationWithRelations?.id}: ${data.reactions || JSON.stringify(data.adverseEvents)}`);
        }
        if (!vaccinationWithRelations) {
            throw new Error('Failed to reload vaccination after creation');
        }
        return vaccinationWithRelations;
    }
    async getVaccinationHistory(studentId) {
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const vaccinations = await this.vaccinationModel.findAll({
            where: { studentId },
            include: ['student'],
            order: [['administrationDate', 'DESC']],
        });
        this.logInfo(`PHI Access: Vaccination history retrieved for student ${studentId} (${student.firstName} ${student.lastName}), count: ${vaccinations.length}`);
        return vaccinations;
    }
    async checkComplianceStatus(studentId) {
        return this.complianceHelper.checkComplianceStatus(studentId);
    }
    async updateVaccination(id, data) {
        const existingVaccination = await this.vaccinationModel.findByPk(id, {
            include: ['student'],
        });
        if (!existingVaccination) {
            throw new common_1.NotFoundException('Vaccination not found');
        }
        if (data.cvxCode && !this.complianceHelper.validateCVXCode(data.cvxCode)) {
            this.logWarning(`Invalid CVX code provided: ${data.cvxCode}`);
        }
        if (data.doseNumber !== undefined || data.totalDoses !== undefined) {
            const doseNumber = data.doseNumber ?? existingVaccination.doseNumber;
            const totalDoses = data.totalDoses ?? existingVaccination.totalDoses;
            if (doseNumber && totalDoses) {
                data.seriesComplete = doseNumber >= totalDoses;
                if (!data.seriesComplete) {
                    const adminDate = data.administrationDate ?? existingVaccination.administrationDate;
                    data.nextDueDate = this.scheduleHelper.calculateNextDueDate(adminDate, (data.vaccineType ?? existingVaccination.vaccineType) || null, doseNumber);
                }
                else {
                    data.nextDueDate = null;
                }
            }
        }
        if (data.nextDueDate !== undefined ||
            data.seriesComplete !== undefined ||
            data.exemptionStatus !== undefined) {
            const adminDate = data.administrationDate ?? existingVaccination.administrationDate;
            const nextDueDate = data.nextDueDate ?? existingVaccination.nextDueDate;
            const seriesComplete = data.seriesComplete ?? existingVaccination.seriesComplete;
            const exemptionStatus = data.exemptionStatus ?? existingVaccination.exemptionStatus;
            data.complianceStatus = this.complianceHelper.determineComplianceStatus(adminDate, nextDueDate, seriesComplete, exemptionStatus);
        }
        Object.assign(existingVaccination, data);
        const updatedVaccination = await existingVaccination.save();
        const vaccinationWithRelations = await this.vaccinationModel.findByPk(updatedVaccination.id, { include: ['student'] });
        if (!vaccinationWithRelations) {
            throw new Error('Failed to reload vaccination after update');
        }
        this.logInfo(`PHI Modified: Vaccination ${vaccinationWithRelations.vaccineName} updated for student ${vaccinationWithRelations.student?.firstName ?? 'Unknown'} ${vaccinationWithRelations.student?.lastName ?? 'Unknown'}`);
        return vaccinationWithRelations;
    }
    async deleteVaccination(id) {
        const vaccination = await this.vaccinationModel.findByPk(id, {
            include: ['student'],
        });
        if (!vaccination) {
            throw new common_1.NotFoundException('Vaccination not found');
        }
        await vaccination.destroy();
        this.logWarning(`Vaccination deleted: ${vaccination.vaccineName} for ${vaccination.student?.firstName ?? 'Unknown'} ${vaccination.student?.lastName ?? 'Unknown'}`);
        return { success: true };
    }
    async getOverdueVaccinations(limit = 100) {
        return this.crudHelper.getOverdueVaccinations(limit);
    }
    async getDueVaccinations(studentId) {
        return this.complianceHelper.getDueVaccinations(studentId);
    }
    async getOverdueVaccinationsForStudent(studentId) {
        return this.complianceHelper.getOverdueVaccinationsForStudent(studentId);
    }
    async batchImport(vaccinations) {
        this.logInfo(`Batch importing ${vaccinations.length} vaccinations`);
        const results = {
            successCount: 0,
            errorCount: 0,
            importedIds: [],
            errors: [],
        };
        for (const vaccinationData of vaccinations) {
            try {
                const vaccination = await this.addVaccination(vaccinationData);
                results.successCount++;
                results.importedIds.push(vaccination.id);
            }
            catch (error) {
                results.errorCount++;
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                results.errors.push(`Failed to import vaccination for student ${vaccinationData.studentId}: ${errorMessage}`);
                this.logError(`Batch import error: ${errorMessage}`);
            }
        }
        this.logInfo(`Batch import completed: ${results.successCount} successful, ${results.errorCount} failed`);
        return results;
    }
    getCDCSchedule(query) {
        return this.scheduleHelper.getCDCSchedule(query);
    }
    async createExemption(studentId, exemptionDto) {
        return this.crudHelper.createExemption(studentId, exemptionDto);
    }
    async getComplianceReport(query) {
        return this.complianceHelper.getComplianceReport(query);
    }
    getDoseSchedule(vaccineType, currentDose) {
        return this.scheduleHelper.getDoseSchedule(vaccineType, currentDose);
    }
};
exports.VaccinationService = VaccinationService;
exports.VaccinationService = VaccinationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Vaccination)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Student)),
    __metadata("design:paramtypes", [Object, Object, vaccination_schedule_helper_1.VaccinationScheduleHelper,
        vaccination_compliance_helper_1.VaccinationComplianceHelper,
        vaccination_crud_helper_1.VaccinationCrudHelper])
], VaccinationService);
//# sourceMappingURL=vaccination.service.js.map