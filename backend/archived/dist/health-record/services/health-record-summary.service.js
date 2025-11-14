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
exports.HealthRecordSummaryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const models_5 = require("../../database/models");
const base_1 = require("../../common/base");
let HealthRecordSummaryService = class HealthRecordSummaryService extends base_1.BaseService {
    healthRecordModel;
    allergyModel;
    studentModel;
    chronicConditionModel;
    vaccinationModel;
    constructor(healthRecordModel, allergyModel, studentModel, chronicConditionModel, vaccinationModel) {
        super("HealthRecordSummaryService");
        this.healthRecordModel = healthRecordModel;
        this.allergyModel = allergyModel;
        this.studentModel = studentModel;
        this.chronicConditionModel = chronicConditionModel;
        this.vaccinationModel = vaccinationModel;
    }
    async getHealthSummary(studentId) {
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const allergies = await this.allergyModel.findAll({
            where: { studentId },
            order: [['severity', 'DESC']],
        });
        const recentVitals = [];
        const recentVaccinations = await this.vaccinationModel.findAll({
            where: { studentId },
            order: [['administrationDate', 'DESC']],
            limit: 5,
        });
        const recordCounts = {};
        const countsByType = (await this.healthRecordModel.findAll({
            attributes: ['recordType', [this.healthRecordModel.sequelize.fn('COUNT', '*'), 'count']],
            where: { studentId },
            group: ['recordType'],
            raw: true,
        }));
        countsByType.forEach((row) => {
            recordCounts[row.recordType] = parseInt(row.count, 10);
        });
        this.logInfo(`PHI Access: Health summary retrieved for student ${studentId}`);
        return {
            student,
            allergies,
            recentVitals,
            recentVaccinations,
            recordCounts,
        };
    }
    async searchHealthRecords(query, type, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const whereClause = {
            [sequelize_2.Op.or]: [
                { title: { [sequelize_2.Op.iLike]: `%${query}%` } },
                { description: { [sequelize_2.Op.iLike]: `%${query}%` } },
                { diagnosis: { [sequelize_2.Op.iLike]: `%${query}%` } },
                { treatment: { [sequelize_2.Op.iLike]: `%${query}%` } },
            ],
        };
        if (type) {
            whereClause.recordType = type;
        }
        const { rows: records, count: total } = await this.healthRecordModel.findAndCountAll({
            where: whereClause,
            include: [{ model: this.studentModel, as: 'student' }],
            order: [['recordDate', 'DESC']],
            limit,
            offset,
        });
        this.logInfo(`PHI Access: Health records search performed, query: "${query}", results: ${records.length}`);
        return {
            records,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async exportHealthHistory(studentId) {
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const healthRecords = await this.healthRecordModel.findAll({
            where: { studentId },
            order: [['recordDate', 'DESC']],
        });
        const allergies = await this.allergyModel.findAll({
            where: { studentId },
            order: [['severity', 'DESC']],
        });
        const vaccinations = await this.vaccinationModel.findAll({
            where: { studentId },
            order: [['administrationDate', 'DESC']],
        });
        const chronicConditions = await this.chronicConditionModel.findAll({
            where: { studentId },
            order: [['diagnosedDate', 'DESC']],
        });
        this.logInfo(`PHI Export: Complete health history exported for student ${studentId}`);
        return {
            exportDate: new Date(),
            student: {
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                dateOfBirth: student.dateOfBirth,
            },
            healthRecords,
            allergies,
            vaccinations,
            chronicConditions,
            summary: {
                totalRecords: healthRecords.length,
                totalAllergies: allergies.length,
                totalVaccinations: vaccinations.length,
                totalChronicConditions: chronicConditions.length,
            },
        };
    }
    async importHealthRecords(studentId, importData) {
        const results = {
            imported: 0,
            skipped: 0,
            errors: [],
        };
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            results.errors.push('Student not found');
            return results;
        }
        if (importData.healthRecords && Array.isArray(importData.healthRecords)) {
            for (const recordData of importData.healthRecords) {
                try {
                    await this.healthRecordModel.create({
                        ...recordData,
                        studentId,
                    });
                    results.imported++;
                }
                catch (error) {
                    results.errors.push(`Failed to import health record: ${error.message}`);
                    results.skipped++;
                }
            }
        }
        if (importData.allergies && Array.isArray(importData.allergies)) {
            for (const allergyData of importData.allergies) {
                try {
                    const existing = await this.allergyModel.findOne({
                        where: {
                            studentId,
                            allergen: allergyData.allergen,
                        },
                    });
                    if (existing) {
                        results.skipped++;
                        continue;
                    }
                    await this.allergyModel.create({
                        ...allergyData,
                        studentId,
                    });
                    results.imported++;
                }
                catch (error) {
                    results.errors.push(`Failed to import allergy: ${error.message}`);
                    results.skipped++;
                }
            }
        }
        if (importData.vaccinations && Array.isArray(importData.vaccinations)) {
            for (const vaccinationData of importData.vaccinations) {
                try {
                    await this.vaccinationModel.create({
                        ...vaccinationData,
                        studentId,
                    });
                    results.imported++;
                }
                catch (error) {
                    results.errors.push(`Failed to import vaccination: ${error.message}`);
                    results.skipped++;
                }
            }
        }
        this.logInfo(`PHI Import: Health data imported for student ${studentId}, imported: ${results.imported}, skipped: ${results.skipped}`);
        return results;
    }
    async getHealthRecordStatistics() {
        const totalRecords = await this.healthRecordModel.count();
        const activeAllergies = await this.allergyModel.count({
            where: { active: true },
        });
        const chronicConditions = await this.chronicConditionModel.count({
            where: { isActive: true },
        });
        const today = new Date();
        const vaccinationsDue = await this.vaccinationModel.count({
            where: {
                nextDueDate: { [sequelize_2.Op.lt]: today },
                seriesComplete: false,
            },
        });
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentRecords = await this.healthRecordModel.count({
            where: {
                recordDate: { [sequelize_2.Op.between]: [thirtyDaysAgo, new Date()] },
            },
        });
        this.logInfo('System statistics retrieved for health records');
        return {
            totalRecords,
            activeAllergies,
            chronicConditions,
            vaccinationsDue,
            recentRecords,
        };
    }
    async getCompleteHealthProfile(studentId) {
        const healthRecord = await this.healthRecordModel.findOne({
            where: { studentId },
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!healthRecord) {
            throw new common_1.NotFoundException(`Health record for student ${studentId} not found`);
        }
        const allergies = await this.allergyModel.findAll({
            where: { studentId },
        });
        const vaccinations = await this.vaccinationModel.findAll({
            where: { studentId },
        });
        const chronicConditions = await this.chronicConditionModel.findAll({
            where: { studentId },
        });
        return {
            healthRecord,
            allergies,
            vaccinations,
            chronicConditions,
        };
    }
};
exports.HealthRecordSummaryService = HealthRecordSummaryService;
exports.HealthRecordSummaryService = HealthRecordSummaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.HealthRecord)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Allergy)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.Student)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.ChronicCondition)),
    __param(4, (0, sequelize_1.InjectModel)(models_5.Vaccination)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], HealthRecordSummaryService);
//# sourceMappingURL=health-record-summary.service.js.map