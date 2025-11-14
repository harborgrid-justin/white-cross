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
var VaccinationComplianceHelper_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccinationComplianceHelper = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const vaccination_constants_1 = require("./vaccination.constants");
let VaccinationComplianceHelper = VaccinationComplianceHelper_1 = class VaccinationComplianceHelper {
    vaccinationModel;
    studentModel;
    logger = new common_1.Logger(VaccinationComplianceHelper_1.name);
    constructor(vaccinationModel, studentModel) {
        this.vaccinationModel = vaccinationModel;
        this.studentModel = studentModel;
    }
    validateCVXCode(cvxCode) {
        return cvxCode in vaccination_constants_1.CDC_CVX_CODES;
    }
    determineComplianceStatus(administrationDate, nextDueDate, seriesComplete, exemptionStatus) {
        if (exemptionStatus) {
            return 'EXEMPT';
        }
        if (seriesComplete) {
            return 'COMPLIANT';
        }
        if (!nextDueDate) {
            return 'PARTIALLY_COMPLIANT';
        }
        const today = new Date();
        if (today > nextDueDate) {
            return 'OVERDUE';
        }
        return 'PARTIALLY_COMPLIANT';
    }
    async checkComplianceStatus(studentId) {
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const vaccinations = await this.vaccinationModel.findAll({
            where: { studentId },
            order: [['administrationDate', 'DESC']],
        });
        const birthDate = new Date(student.dateOfBirth);
        const today = new Date();
        const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 +
            (today.getMonth() - birthDate.getMonth());
        const complianceReport = {
            studentId,
            studentName: `${student.firstName} ${student.lastName}`,
            ageInMonths,
            compliant: true,
            missing: [],
            upcoming: [],
            complete: [],
            exemptions: [],
        };
        const exemptedVaccinations = vaccinations.filter((v) => v.exemptionStatus);
        complianceReport.exemptions = exemptedVaccinations.map((v) => ({
            vaccineName: v.vaccineName,
            exemptionReason: v.exemptionReason,
        }));
        for (const requirement of vaccination_constants_1.SCHOOL_REQUIREMENTS) {
            if (requirement.ageRequirement && ageInMonths > requirement.ageRequirement) {
                continue;
            }
            const matchingVaccines = vaccinations.filter((v) => (v.vaccineName &&
                v.vaccineName.toLowerCase().includes(requirement.vaccineName.toLowerCase())) ||
                (v.vaccineType &&
                    requirement.vaccineName.toLowerCase().includes(v.vaccineType.toLowerCase())));
            const hasExemption = exemptedVaccinations.some((v) => v.vaccineName &&
                v.vaccineName.toLowerCase().includes(requirement.vaccineName.toLowerCase()));
            if (hasExemption) {
                continue;
            }
            const completedDoses = matchingVaccines.length;
            if (completedDoses >= requirement.requiredDoses) {
                complianceReport.complete.push({
                    vaccineName: requirement.vaccineName,
                    requiredDoses: requirement.requiredDoses,
                    completedDoses,
                });
            }
            else if (completedDoses === 0) {
                complianceReport.missing.push({
                    vaccineName: requirement.vaccineName,
                    requiredDoses: requirement.requiredDoses,
                    completedDoses: 0,
                    status: 'NOT_STARTED',
                });
                complianceReport.compliant = false;
            }
            else {
                const latestVaccine = matchingVaccines[0];
                const isOverdue = latestVaccine.nextDueDate
                    ? new Date() > latestVaccine.nextDueDate
                    : false;
                if (isOverdue) {
                    complianceReport.missing.push({
                        vaccineName: requirement.vaccineName,
                        requiredDoses: requirement.requiredDoses,
                        completedDoses,
                        nextDose: completedDoses + 1,
                        dueDate: latestVaccine.nextDueDate,
                        status: 'OVERDUE',
                    });
                    complianceReport.compliant = false;
                }
                else {
                    complianceReport.upcoming.push({
                        vaccineName: requirement.vaccineName,
                        requiredDoses: requirement.requiredDoses,
                        completedDoses,
                        nextDose: completedDoses + 1,
                        dueDate: latestVaccine.nextDueDate,
                        status: 'IN_PROGRESS',
                    });
                }
            }
        }
        this.logger.log(`PHI Access: Compliance status checked for student ${studentId}, compliant: ${complianceReport.compliant}`);
        return complianceReport;
    }
    async getDueVaccinations(studentId) {
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const complianceReport = await this.checkComplianceStatus(studentId);
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        const dueVaccinations = complianceReport.upcoming.filter((vax) => {
            if (!vax.dueDate)
                return false;
            const dueDate = new Date(vax.dueDate);
            return dueDate >= today && dueDate <= thirtyDaysFromNow;
        });
        this.logger.log(`PHI Access: Due vaccinations retrieved for student ${studentId}`);
        return {
            studentId,
            studentName: `${student.firstName} ${student.lastName}`,
            dueVaccinations: dueVaccinations.map((vax) => ({
                vaccineName: vax.vaccineName,
                doseNumber: vax.nextDose,
                totalDoses: vax.requiredDoses,
                dueDate: vax.dueDate,
                status: 'DUE',
            })),
        };
    }
    async getOverdueVaccinationsForStudent(studentId) {
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const complianceReport = await this.checkComplianceStatus(studentId);
        const today = new Date();
        const overdueVaccinations = complianceReport.missing.filter((vax) => vax.status === 'OVERDUE' && vax.dueDate);
        this.logger.log(`PHI Access: Overdue vaccinations retrieved for student ${studentId}`);
        return {
            studentId,
            studentName: `${student.firstName} ${student.lastName}`,
            dueVaccinations: overdueVaccinations.map((vax) => {
                const dueDate = new Date(vax.dueDate);
                const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000));
                return {
                    vaccineName: vax.vaccineName,
                    doseNumber: vax.nextDose || vax.completedDoses + 1,
                    totalDoses: vax.requiredDoses,
                    dueDate: vax.dueDate,
                    status: 'OVERDUE',
                    daysOverdue,
                };
            }),
        };
    }
    async getComplianceReport(query) {
        const { schoolId, gradeLevel, vaccineType, onlyNonCompliant } = query;
        const whereClause = {};
        if (vaccineType) {
            whereClause.vaccineName = { [sequelize_2.Op.iLike]: `%${vaccineType}%` };
        }
        const vaccinations = await this.vaccinationModel.findAll({
            where: whereClause,
            include: ['student'],
            limit: 100,
        });
        const studentGroups = vaccinations.reduce((acc, vax) => {
            const studentId = vax.studentId;
            if (!acc[studentId]) {
                acc[studentId] = {
                    student: vax.student,
                    vaccinations: [],
                };
            }
            acc[studentId].vaccinations.push(vax);
            return acc;
        }, {});
        const complianceData = Object.values(studentGroups).map((group) => {
            const compliantCount = group.vaccinations.filter((v) => v.complianceStatus === 'COMPLIANT' || v.complianceStatus === 'EXEMPT').length;
            const totalVaccinations = group.vaccinations.length;
            const compliancePercentage = totalVaccinations > 0 ? (compliantCount / totalVaccinations) * 100 : 0;
            return {
                studentId: group.student.id,
                studentName: `${group.student.firstName} ${group.student.lastName}`,
                totalVaccinations,
                compliantCount,
                compliancePercentage: Math.round(compliancePercentage),
                status: compliancePercentage >= 100
                    ? 'COMPLIANT'
                    : compliancePercentage >= 50
                        ? 'PARTIALLY_COMPLIANT'
                        : 'NON_COMPLIANT',
            };
        });
        const filteredData = onlyNonCompliant
            ? complianceData.filter((d) => d.status !== 'COMPLIANT')
            : complianceData;
        this.logger.log(`Compliance report generated: ${filteredData.length} students`);
        return {
            reportDate: new Date().toISOString(),
            filters: { schoolId, gradeLevel, vaccineType, onlyNonCompliant },
            totalStudents: filteredData.length,
            summary: {
                compliant: filteredData.filter((d) => d.status === 'COMPLIANT').length,
                partiallyCompliant: filteredData.filter((d) => d.status === 'PARTIALLY_COMPLIANT').length,
                nonCompliant: filteredData.filter((d) => d.status === 'NON_COMPLIANT').length,
            },
            students: filteredData,
        };
    }
};
exports.VaccinationComplianceHelper = VaccinationComplianceHelper;
exports.VaccinationComplianceHelper = VaccinationComplianceHelper = VaccinationComplianceHelper_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Vaccination)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.Student)),
    __metadata("design:paramtypes", [Object, Object])
], VaccinationComplianceHelper);
//# sourceMappingURL=vaccination-compliance.helper.js.map