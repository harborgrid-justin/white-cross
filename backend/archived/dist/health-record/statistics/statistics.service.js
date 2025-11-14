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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const models_5 = require("../../database/models");
const models_6 = require("../../database/models");
const models_7 = require("../../database/models");
const base_1 = require("../../common/base");
let StatisticsService = class StatisticsService extends base_1.BaseService {
    studentModel;
    vaccinationModel;
    allergyModel;
    chronicConditionModel;
    vitalSignsModel;
    clinicVisitModel;
    schoolModel;
    constructor(studentModel, vaccinationModel, allergyModel, chronicConditionModel, vitalSignsModel, clinicVisitModel, schoolModel) {
        super("StatisticsService");
        this.studentModel = studentModel;
        this.vaccinationModel = vaccinationModel;
        this.allergyModel = allergyModel;
        this.chronicConditionModel = chronicConditionModel;
        this.vitalSignsModel = vitalSignsModel;
        this.clinicVisitModel = clinicVisitModel;
        this.schoolModel = schoolModel;
    }
    async getStudentStatistics(studentId) {
        this.logInfo(`Getting statistics for student ${studentId}`);
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
        }
        const [vaccinations, allergies, chronicConditions, vitals, visits] = await Promise.all([
            this.vaccinationModel.findAll({
                where: { studentId },
                attributes: ['id', 'vaccineName', 'administeredAt'],
            }),
            this.allergyModel.findAll({
                where: { studentId, active: true },
                attributes: ['id', 'allergen', 'severity'],
            }),
            this.chronicConditionModel.findAll({
                where: { studentId, status: 'ACTIVE' },
                attributes: ['id', 'conditionName', 'severity'],
            }),
            this.vitalSignsModel.findAll({
                where: { studentId },
                attributes: [
                    'measurementDate',
                    'height',
                    'weight',
                    'bmi',
                    'bloodPressureSystolic',
                    'bloodPressureDiastolic',
                ],
                order: [['measurementDate', 'DESC']],
                limit: 1,
            }),
            this.clinicVisitModel.findAll({
                where: { studentId },
                attributes: ['id', 'visitDate'],
            }),
        ]);
        const latestVital = vitals[0];
        return {
            studentId,
            totalVaccinations: vaccinations.length,
            totalAllergies: allergies.length,
            activeChronicConditions: chronicConditions.length,
            totalVisits: visits.length,
            latestVitals: latestVital
                ? {
                    recordedAt: latestVital.measurementDate,
                    height: latestVital.height,
                    weight: latestVital.weight,
                    bmi: latestVital.bmi,
                    bloodPressure: latestVital.bloodPressureSystolic &&
                        latestVital.bloodPressureDiastolic
                        ? `${latestVital.bloodPressureSystolic}/${latestVital.bloodPressureDiastolic}`
                        : null,
                }
                : null,
            vaccinationStatus: this.calculateVaccinationStatus(vaccinations),
            healthRiskLevel: this.calculateHealthRiskLevel({
                allergies: allergies.length,
                chronicConditions: chronicConditions.length,
            }),
        };
    }
    async getSchoolStatistics(schoolId) {
        this.logInfo(`Getting statistics for school ${schoolId}`);
        const school = await this.schoolModel.findByPk(schoolId);
        if (!school) {
            throw new common_1.NotFoundException(`School with ID ${schoolId} not found`);
        }
        const students = await this.studentModel.findAll({
            where: { schoolId },
            attributes: ['id'],
        });
        const studentIds = students.map((s) => s.id);
        if (studentIds.length === 0) {
            return {
                schoolId,
                totalStudents: 0,
                totalVaccinations: 0,
                totalAllergies: 0,
                activeChronicConditions: 0,
                vaccinationRate: 0,
                fullyVaccinatedCount: 0,
                studentsWithAllergies: 0,
                studentsWithChronicConditions: 0,
            };
        }
        const [vaccinations, allergies, chronicConditions] = await Promise.all([
            this.vaccinationModel.findAll({
                where: { studentId: { [sequelize_2.Op.in]: studentIds } },
                attributes: ['studentId', 'vaccineName', 'administeredAt'],
            }),
            this.allergyModel.findAll({
                where: { studentId: { [sequelize_2.Op.in]: studentIds }, active: true },
                attributes: ['studentId'],
            }),
            this.chronicConditionModel.findAll({
                where: { studentId: { [sequelize_2.Op.in]: studentIds }, status: 'ACTIVE' },
                attributes: ['studentId'],
            }),
        ]);
        const studentVaccinationMap = new Map();
        vaccinations.forEach((v) => {
            if (!studentVaccinationMap.has(v.studentId)) {
                studentVaccinationMap.set(v.studentId, []);
            }
            studentVaccinationMap.get(v.studentId).push(v);
        });
        let fullyVaccinatedCount = 0;
        studentVaccinationMap.forEach((vaccs) => {
            if (this.calculateVaccinationStatus(vaccs) === 'COMPLIANT') {
                fullyVaccinatedCount++;
            }
        });
        const vaccinationRate = studentIds.length > 0
            ? (fullyVaccinatedCount / studentIds.length) * 100
            : 0;
        const uniqueStudentsWithAllergies = Array.from(new Set(allergies.map((a) => a.studentId)));
        const uniqueStudentsWithChronicConditions = Array.from(new Set(chronicConditions.map((c) => c.studentId)));
        return {
            schoolId,
            totalStudents: studentIds.length,
            totalVaccinations: vaccinations.length,
            totalAllergies: allergies.length,
            activeChronicConditions: chronicConditions.length,
            vaccinationRate: parseFloat(vaccinationRate.toFixed(2)),
            fullyVaccinatedCount,
            studentsWithAllergies: uniqueStudentsWithAllergies.length,
            studentsWithChronicConditions: uniqueStudentsWithChronicConditions.length,
        };
    }
    async getTrendAnalysis(type, timeframe) {
        this.logInfo(`Analyzing trends: ${type} over ${timeframe}`);
        const days = this.parseTimeframe(timeframe);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        let data = [];
        let dateField;
        switch (type) {
            case 'vaccinations':
                dateField = 'administrationDate';
                data = await this.vaccinationModel.findAll({
                    where: { administrationDate: { [sequelize_2.Op.gte]: cutoffDate } },
                    attributes: ['administrationDate'],
                    raw: true,
                });
                break;
            case 'visits':
                dateField = 'checkInTime';
                data = await this.clinicVisitModel.findAll({
                    where: { checkInTime: { [sequelize_2.Op.gte]: cutoffDate } },
                    attributes: ['checkInTime'],
                    raw: true,
                });
                break;
            case 'allergies':
                data = await this.allergyModel.findAll({
                    where: {
                        active: true,
                        diagnosedDate: { [sequelize_2.Op.gte]: cutoffDate },
                    },
                    attributes: ['diagnosedDate'],
                    raw: true,
                });
                dateField = 'diagnosedDate';
                break;
            default:
                return {
                    type,
                    timeframe,
                    trend: 'unsupported_type',
                    data: [],
                    totalCount: 0,
                };
        }
        const groupedByDay = this.groupByDay(data, dateField);
        const trend = this.calculateTrend(groupedByDay);
        return {
            type,
            timeframe,
            trend,
            data: groupedByDay,
            totalCount: data.length,
        };
    }
    async getOverallStatistics() {
        this.logInfo('Getting overall system statistics');
        const [totalStudents, totalVaccinations, totalAllergies, totalChronicConditions, totalVisits, totalVitalRecords, studentsWithAllergies, studentsWithChronicConditions,] = await Promise.all([
            this.studentModel.count(),
            this.vaccinationModel.count(),
            this.allergyModel.count({ where: { active: true } }),
            this.chronicConditionModel.count({ where: { status: 'ACTIVE' } }),
            this.clinicVisitModel.count(),
            this.vitalSignsModel.count(),
            this.allergyModel.count({
                where: { active: true },
                distinct: true,
                col: 'studentId',
            }),
            this.chronicConditionModel.count({
                where: { status: 'ACTIVE' },
                distinct: true,
                col: 'studentId',
            }),
        ]);
        return {
            totalStudents,
            totalVaccinations,
            totalAllergies,
            totalChronicConditions,
            totalVisits,
            totalVitalRecords,
            averageVaccinationsPerStudent: totalStudents > 0
                ? (totalVaccinations / totalStudents).toFixed(2)
                : '0',
            studentsWithAllergies,
            studentsWithChronicConditions,
        };
    }
    async getHealthAlerts(schoolId) {
        this.logInfo(`Getting health alerts${schoolId ? ` for school ${schoolId}` : ''}`);
        let studentIds;
        if (schoolId) {
            const school = await this.schoolModel.findByPk(schoolId);
            if (!school) {
                throw new common_1.NotFoundException(`School with ID ${schoolId} not found`);
            }
            const students = await this.studentModel.findAll({
                where: { schoolId },
                attributes: ['id'],
            });
            studentIds = students.map((s) => s.id);
        }
        else {
            const students = await this.studentModel.findAll({
                attributes: ['id'],
            });
            studentIds = students.map((s) => s.id);
        }
        if (studentIds.length === 0) {
            return {
                criticalAllergies: { count: 0, students: [] },
                overdueVaccinations: { count: 0, students: [] },
                unmanagedConditions: { count: 0, students: [] },
            };
        }
        const criticalAllergies = await this.allergyModel.findAll({
            where: {
                studentId: { [sequelize_2.Op.in]: studentIds },
                active: true,
                severity: { [sequelize_2.Op.in]: ['SEVERE', 'LIFE_THREATENING'] },
            },
            attributes: ['studentId'],
        });
        const allVaccinations = await this.vaccinationModel.findAll({
            where: { studentId: { [sequelize_2.Op.in]: studentIds } },
            attributes: ['studentId', 'vaccineName', 'administeredAt'],
        });
        const studentVaccinationMap = new Map();
        allVaccinations.forEach((v) => {
            if (!studentVaccinationMap.has(v.studentId)) {
                studentVaccinationMap.set(v.studentId, []);
            }
            studentVaccinationMap.get(v.studentId).push(v);
        });
        const overdueVaccinations = studentIds.filter((studentId) => {
            const vaccs = studentVaccinationMap.get(studentId) || [];
            return this.calculateVaccinationStatus(vaccs) === 'OVERDUE';
        });
        const allActiveConditions = await this.chronicConditionModel.findAll({
            where: {
                studentId: { [sequelize_2.Op.in]: studentIds },
                status: 'ACTIVE',
            },
            attributes: ['studentId', 'carePlan'],
        });
        const unmanagedConditions = allActiveConditions.filter((condition) => !condition.carePlan || condition.carePlan.trim() === '');
        return {
            criticalAllergies: {
                count: criticalAllergies.length,
                students: Array.from(new Set(criticalAllergies.map((a) => a.studentId))),
            },
            overdueVaccinations: {
                count: overdueVaccinations.length,
                students: overdueVaccinations,
            },
            unmanagedConditions: {
                count: unmanagedConditions.length,
                students: Array.from(new Set(unmanagedConditions.map((c) => c.studentId))),
            },
        };
    }
    calculateVaccinationStatus(vaccinations) {
        if (vaccinations.length === 0)
            return 'NONE';
        if (vaccinations.length < 5)
            return 'OVERDUE';
        if (vaccinations.length < 10)
            return 'PARTIAL';
        return 'COMPLIANT';
    }
    calculateHealthRiskLevel(factors) {
        const riskScore = factors.allergies * 2 + factors.chronicConditions * 3;
        if (riskScore === 0)
            return 'LOW';
        if (riskScore < 5)
            return 'MEDIUM';
        return 'HIGH';
    }
    parseTimeframe(timeframe) {
        const match = timeframe.match(/(\d+)\s*(day|week|month|year)s?/);
        if (!match)
            return 30;
        const [, value, unit] = match;
        const multipliers = { day: 1, week: 7, month: 30, year: 365 };
        return parseInt(value) * (multipliers[unit] || 1);
    }
    groupByDay(data, dateField) {
        const grouped = new Map();
        data.forEach((item) => {
            const date = new Date(item[dateField]);
            const dateKey = date.toISOString().split('T')[0];
            grouped.set(dateKey, (grouped.get(dateKey) || 0) + 1);
        });
        return Array.from(grouped.entries()).map(([date, count]) => ({
            date,
            count,
        }));
    }
    calculateTrend(data) {
        if (data.length < 2)
            return 'insufficient_data';
        const counts = data.map((d) => d.count);
        const firstHalf = counts.slice(0, Math.floor(counts.length / 2));
        const secondHalf = counts.slice(Math.floor(counts.length / 2));
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        if (secondAvg > firstAvg * 1.1)
            return 'increasing';
        if (secondAvg < firstAvg * 0.9)
            return 'decreasing';
        return 'stable';
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Vaccination)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.Allergy)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.ChronicCondition)),
    __param(4, (0, sequelize_1.InjectModel)(models_5.VitalSigns)),
    __param(5, (0, sequelize_1.InjectModel)(models_6.ClinicVisit)),
    __param(6, (0, sequelize_1.InjectModel)(models_7.School)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map