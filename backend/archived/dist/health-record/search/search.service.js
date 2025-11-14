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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const models_5 = require("../../database/models");
const models_6 = require("../../database/models");
let SearchService = class SearchService extends base_1.BaseService {
    studentModel;
    vaccinationModel;
    allergyModel;
    chronicConditionModel;
    vitalSignsModel;
    clinicVisitModel;
    constructor(studentModel, vaccinationModel, allergyModel, chronicConditionModel, vitalSignsModel, clinicVisitModel) {
        super("SearchService");
        this.studentModel = studentModel;
        this.vaccinationModel = vaccinationModel;
        this.allergyModel = allergyModel;
        this.chronicConditionModel = chronicConditionModel;
        this.vitalSignsModel = vitalSignsModel;
        this.clinicVisitModel = clinicVisitModel;
    }
    async searchHealthRecords(query, filters) {
        this.logInfo(`Searching health records: ${query}, filters: ${JSON.stringify(filters)}`);
        const searchTerm = query.trim();
        if (!searchTerm) {
            return [];
        }
        let results = [];
        const baseWhere = {};
        if (filters?.studentId) {
            baseWhere.studentId = filters.studentId;
        }
        if (filters?.schoolId) {
            const students = await this.studentModel.findAll({
                where: { schoolId: filters.schoolId },
                attributes: ['id'],
            });
            baseWhere.studentId = { [sequelize_2.Op.in]: students.map((s) => s.id) };
        }
        if (filters?.dateFrom || filters?.dateTo) {
        }
        const vaccinationResults = await this.searchVaccinations(searchTerm, baseWhere, filters);
        results.push(...vaccinationResults);
        const allergyResults = await this.searchAllergies(searchTerm, baseWhere, filters);
        results.push(...allergyResults);
        const conditionResults = await this.searchChronicConditions(searchTerm, baseWhere, filters);
        results.push(...conditionResults);
        const vitalResults = await this.searchVitalSigns(searchTerm, baseWhere, filters);
        results.push(...vitalResults);
        const visitResults = await this.searchClinicVisits(searchTerm, baseWhere, filters);
        results.push(...visitResults);
        if (filters?.type) {
            results = results.filter((r) => r.type === filters.type);
        }
        return results.sort((a, b) => b.relevance - a.relevance);
    }
    async advancedSearch(criteria) {
        this.logInfo('Performing advanced health record search');
        const { query, studentIds, types, severity, status, dateRange, schoolId, limit = 50, offset = 0, } = criteria;
        const baseWhere = {};
        if (studentIds && studentIds.length > 0) {
            baseWhere.studentId = { [sequelize_2.Op.in]: studentIds };
        }
        if (schoolId) {
            const students = await this.studentModel.findAll({
                where: { schoolId },
                attributes: ['id'],
            });
            const schoolStudentIds = students.map((s) => s.id);
            if (baseWhere.studentId) {
                baseWhere.studentId = {
                    [sequelize_2.Op.in]: baseWhere.studentId[sequelize_2.Op.in].filter((id) => schoolStudentIds.includes(id)),
                };
            }
            else {
                baseWhere.studentId = { [sequelize_2.Op.in]: schoolStudentIds };
            }
        }
        let allResults = [];
        if (query) {
            allResults = await this.searchHealthRecords(query, {
                studentIds,
                schoolId,
            });
        }
        else {
            const [vaccinations, allergies, chronicConditions, vitals, visits] = await Promise.all([
                this.vaccinationModel.findAll({
                    where: baseWhere,
                    include: [
                        { model: models_1.Student, attributes: ['firstName', 'lastName'] },
                    ],
                    limit: 1000,
                }),
                this.allergyModel.findAll({
                    where: { ...baseWhere, active: true },
                    include: [
                        { model: models_1.Student, attributes: ['firstName', 'lastName'] },
                    ],
                    limit: 1000,
                }),
                this.chronicConditionModel.findAll({
                    where: { ...baseWhere, status: 'ACTIVE' },
                    include: [
                        { model: models_1.Student, attributes: ['firstName', 'lastName'] },
                    ],
                    limit: 1000,
                }),
                this.vitalSignsModel.findAll({
                    where: baseWhere,
                    include: [
                        { model: models_1.Student, attributes: ['firstName', 'lastName'] },
                    ],
                    limit: 1000,
                }),
                this.clinicVisitModel.findAll({
                    where: baseWhere,
                    include: [
                        { model: models_1.Student, attributes: ['firstName', 'lastName'] },
                    ],
                    limit: 1000,
                }),
            ]);
            vaccinations.forEach((v) => allResults.push({
                ...v.toJSON(),
                type: 'vaccination',
                studentName: `${v.student?.firstName} ${v.student?.lastName}`,
                relevance: 1,
            }));
            allergies.forEach((a) => allResults.push({
                ...a.toJSON(),
                type: 'allergy',
                studentName: `${a.student?.firstName} ${a.student?.lastName}`,
                relevance: 1,
            }));
            chronicConditions.forEach((c) => allResults.push({
                ...c.toJSON(),
                type: 'chronic_condition',
                studentName: `${c.student?.firstName} ${c.student?.lastName}`,
                relevance: 1,
            }));
            vitals.forEach((v) => allResults.push({
                ...v.toJSON(),
                type: 'vital_signs',
                studentName: `${v.student?.firstName} ${v.student?.lastName}`,
                relevance: 1,
            }));
            visits.forEach((v) => allResults.push({
                ...v.toJSON(),
                type: 'clinic_visit',
                studentName: `${v.student?.firstName} ${v.student?.lastName}`,
                relevance: 1,
            }));
        }
        if (types && types.length > 0) {
            allResults = allResults.filter((r) => types.includes(r.type));
        }
        if (severity) {
            allResults = allResults.filter((r) => r.severity === severity);
        }
        if (status) {
            allResults = allResults.filter((r) => r.status === status);
        }
        if (dateRange?.from) {
            const dateFrom = new Date(dateRange.from);
            allResults = allResults.filter((r) => {
                const recordDate = new Date(r.createdAt ||
                    r.administrationDate ||
                    r.measurementDate ||
                    r.checkInTime);
                return recordDate >= dateFrom;
            });
        }
        if (dateRange?.to) {
            const dateTo = new Date(dateRange.to);
            allResults = allResults.filter((r) => {
                const recordDate = new Date(r.createdAt ||
                    r.administrationDate ||
                    r.measurementDate ||
                    r.checkInTime);
                return recordDate <= dateTo;
            });
        }
        const total = allResults.length;
        const paginated = allResults.slice(offset, offset + limit);
        return {
            results: paginated,
            total,
            limit,
            offset,
            hasMore: offset + limit < total,
        };
    }
    async searchByDiagnosis(diagnosis) {
        this.logInfo(`Searching by diagnosis: ${diagnosis}`);
        const conditions = await this.chronicConditionModel.findAll({
            where: {
                [sequelize_2.Op.or]: [
                    { condition: { [sequelize_2.Op.iLike]: `%${diagnosis}%` } },
                    { icdCode: { [sequelize_2.Op.iLike]: `%${diagnosis}%` } },
                ],
                status: 'ACTIVE',
            },
            include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
        });
        return conditions.map((c) => ({
            ...c.toJSON(),
            studentName: `${c.student?.firstName} ${c.student?.lastName}`,
        }));
    }
    async searchByICDCode(icdCode) {
        this.logInfo(`Searching by ICD code: ${icdCode}`);
        const conditions = await this.chronicConditionModel.findAll({
            where: {
                icdCode: {
                    [sequelize_2.Op.or]: [{ [sequelize_2.Op.eq]: icdCode }, { [sequelize_2.Op.like]: `${icdCode}%` }],
                },
                status: 'ACTIVE',
            },
            include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
        });
        return conditions.map((c) => ({
            ...c.toJSON(),
            studentName: `${c.student?.firstName} ${c.student?.lastName}`,
        }));
    }
    async searchByCVXCode(cvxCode) {
        this.logInfo(`Searching by CVX code: ${cvxCode}`);
        const vaccinations = await this.vaccinationModel.findAll({
            where: { cvxCode },
            include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
        });
        return vaccinations.map((v) => ({
            ...v.toJSON(),
            studentName: `${v.student?.firstName} ${v.student?.lastName}`,
        }));
    }
    async findStudentsWithCondition(conditionName) {
        this.logInfo(`Finding students with condition: ${conditionName}`);
        const conditions = await this.chronicConditionModel.findAll({
            where: {
                condition: { [sequelize_2.Op.iLike]: `%${conditionName}%` },
                status: 'ACTIVE',
            },
            attributes: ['studentId'],
        });
        return Array.from(new Set(conditions.map((c) => c.studentId)));
    }
    async findStudentsWithAllergen(allergen) {
        this.logInfo(`Finding students with allergen: ${allergen}`);
        const allergies = await this.allergyModel.findAll({
            where: {
                allergen: { [sequelize_2.Op.iLike]: `%${allergen}%` },
                active: true,
            },
            attributes: ['studentId'],
        });
        return Array.from(new Set(allergies.map((a) => a.studentId)));
    }
    async getRecentUpdates(days = 7, limit = 20) {
        this.logInfo(`Getting records updated in last ${days} days, limit ${limit}`);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const [vaccinations, allergies, chronicConditions, vitals, visits] = await Promise.all([
            this.vaccinationModel.findAll({
                where: { updatedAt: { [sequelize_2.Op.gte]: cutoffDate } },
                include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
                order: [['updatedAt', 'DESC']],
                limit: Math.ceil(limit / 5),
            }),
            this.allergyModel.findAll({
                where: { active: true },
                include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
                order: [['diagnosedDate', 'DESC']],
                limit: Math.ceil(limit / 5),
            }),
            this.chronicConditionModel.findAll({
                where: { updatedAt: { [sequelize_2.Op.gte]: cutoffDate }, status: 'ACTIVE' },
                include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
                order: [['updatedAt', 'DESC']],
                limit: Math.ceil(limit / 5),
            }),
            this.vitalSignsModel.findAll({
                where: { updatedAt: { [sequelize_2.Op.gte]: cutoffDate } },
                include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
                order: [['updatedAt', 'DESC']],
                limit: Math.ceil(limit / 5),
            }),
            this.clinicVisitModel.findAll({
                where: { updatedAt: { [sequelize_2.Op.gte]: cutoffDate } },
                include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
                order: [['updatedAt', 'DESC']],
                limit: Math.ceil(limit / 5),
            }),
        ]);
        const allRecords = [];
        vaccinations.forEach((v) => allRecords.push({
            ...v.toJSON(),
            type: 'vaccination',
            studentName: `${v.student?.firstName} ${v.student?.lastName}`,
            updatedAt: v.updatedAt,
        }));
        allergies.forEach((a) => allRecords.push({
            ...a.toJSON(),
            type: 'allergy',
            studentName: `${a.student?.firstName} ${a.student?.lastName}`,
            updatedAt: a.updatedAt,
        }));
        chronicConditions.forEach((c) => allRecords.push({
            ...c.toJSON(),
            type: 'chronic_condition',
            studentName: `${c.student?.firstName} ${c.student?.lastName}`,
            updatedAt: c.updatedAt,
        }));
        vitals.forEach((v) => allRecords.push({
            ...v.toJSON(),
            type: 'vital_signs',
            studentName: `${v.student?.firstName} ${v.student?.lastName}`,
            updatedAt: v.updatedAt,
        }));
        visits.forEach((v) => allRecords.push({
            ...v.toJSON(),
            type: 'clinic_visit',
            studentName: `${v.student?.firstName} ${v.student?.lastName}`,
            updatedAt: v.updatedAt,
        }));
        return allRecords
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, limit);
    }
    async searchVaccinations(searchTerm, baseWhere, filters) {
        const whereClause = { ...baseWhere };
        if (filters?.dateFrom || filters?.dateTo) {
            whereClause.administrationDate = {};
            if (filters.dateFrom) {
                whereClause.administrationDate[sequelize_2.Op.gte] = new Date(filters.dateFrom);
            }
            if (filters.dateTo) {
                whereClause.administrationDate[sequelize_2.Op.lte] = new Date(filters.dateTo);
            }
        }
        whereClause[sequelize_2.Op.or] = [
            { vaccineName: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
            { cvxCode: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
            { manufacturer: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
            { lotNumber: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
        ];
        const vaccinations = await this.vaccinationModel.findAll({
            where: whereClause,
            include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
        });
        return vaccinations.map((v) => ({
            ...v.toJSON(),
            type: 'vaccination',
            studentName: `${v.student?.firstName} ${v.student?.lastName}`,
            relevance: this.calculateRelevance(v, searchTerm, [
                'vaccineName',
                'cvxCode',
                'manufacturer',
                'lotNumber',
            ]),
        }));
    }
    async searchAllergies(searchTerm, baseWhere, filters) {
        const whereClause = { ...baseWhere, active: true };
        if (filters?.dateFrom || filters?.dateTo) {
            whereClause.diagnosedDate = {};
            if (filters.dateFrom) {
                whereClause.diagnosedDate[sequelize_2.Op.gte] = new Date(filters.dateFrom);
            }
            if (filters.dateTo) {
                whereClause.diagnosedDate[sequelize_2.Op.lte] = new Date(filters.dateTo);
            }
        }
        whereClause[sequelize_2.Op.or] = [
            { allergen: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
            { symptoms: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
            { reactions: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
        ];
        const allergies = await this.allergyModel.findAll({
            where: whereClause,
            include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
        });
        return allergies.map((a) => ({
            ...a.toJSON(),
            type: 'allergy',
            studentName: `${a.student?.firstName} ${a.student?.lastName}`,
            relevance: this.calculateRelevance(a, searchTerm, [
                'allergen',
                'symptoms',
                'reactions',
            ]),
        }));
    }
    async searchChronicConditions(searchTerm, baseWhere, filters) {
        const whereClause = { ...baseWhere, status: 'ACTIVE' };
        if (filters?.dateFrom || filters?.dateTo) {
            whereClause.diagnosedDate = {};
            if (filters.dateFrom) {
                whereClause.diagnosedDate[sequelize_2.Op.gte] = new Date(filters.dateFrom);
            }
            if (filters.dateTo) {
                whereClause.diagnosedDate[sequelize_2.Op.lte] = new Date(filters.dateTo);
            }
        }
        whereClause[sequelize_2.Op.or] = [
            { condition: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
            { icdCode: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
            { notes: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
        ];
        const conditions = await this.chronicConditionModel.findAll({
            where: whereClause,
            include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
        });
        return conditions.map((c) => ({
            ...c.toJSON(),
            type: 'chronic_condition',
            studentName: `${c.student?.firstName} ${c.student?.lastName}`,
            relevance: this.calculateRelevance(c, searchTerm, [
                'condition',
                'icdCode',
                'notes',
            ]),
        }));
    }
    async searchVitalSigns(searchTerm, baseWhere, filters) {
        const whereClause = { ...baseWhere };
        if (filters?.dateFrom || filters?.dateTo) {
            whereClause.measurementDate = {};
            if (filters.dateFrom) {
                whereClause.measurementDate[sequelize_2.Op.gte] = new Date(filters.dateFrom);
            }
            if (filters.dateTo) {
                whereClause.measurementDate[sequelize_2.Op.lte] = new Date(filters.dateTo);
            }
        }
        whereClause.notes = { [sequelize_2.Op.iLike]: `%${searchTerm}%` };
        const vitals = await this.vitalSignsModel.findAll({
            where: whereClause,
            include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
        });
        return vitals.map((v) => ({
            ...v.toJSON(),
            type: 'vital_signs',
            studentName: `${v.student?.firstName} ${v.student?.lastName}`,
            relevance: this.calculateRelevance(v, searchTerm, ['notes']),
        }));
    }
    async searchClinicVisits(searchTerm, baseWhere, filters) {
        const whereClause = { ...baseWhere };
        if (filters?.dateFrom || filters?.dateTo) {
            whereClause.checkInTime = {};
            if (filters.dateFrom) {
                whereClause.checkInTime[sequelize_2.Op.gte] = new Date(filters.dateFrom);
            }
            if (filters.dateTo) {
                whereClause.checkInTime[sequelize_2.Op.lte] = new Date(filters.dateTo);
            }
        }
        whereClause[sequelize_2.Op.or] = [
            { reasonForVisit: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
            { symptoms: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
            { treatment: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
            { notes: { [sequelize_2.Op.iLike]: `%${searchTerm}%` } },
        ];
        const visits = await this.clinicVisitModel.findAll({
            where: whereClause,
            include: [{ model: models_1.Student, attributes: ['firstName', 'lastName'] }],
        });
        return visits.map((v) => ({
            ...v.toJSON(),
            type: 'clinic_visit',
            studentName: `${v.student?.firstName} ${v.student?.lastName}`,
            relevance: this.calculateRelevance(v, searchTerm, [
                'reasonForVisit',
                'symptoms',
                'treatment',
                'notes',
            ]),
        }));
    }
    calculateRelevance(record, query, searchableFields) {
        const searchLower = query.toLowerCase();
        let score = 0;
        searchableFields.forEach((field) => {
            const fieldValue = record[field];
            if (typeof fieldValue === 'string') {
                const fieldLower = fieldValue.toLowerCase();
                if (fieldLower === searchLower) {
                    score += 10;
                }
                else if (fieldLower.startsWith(searchLower)) {
                    score += 5;
                }
                else if (fieldLower.includes(searchLower)) {
                    score += 2;
                }
            }
        });
        return score;
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Vaccination)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.Allergy)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.ChronicCondition)),
    __param(4, (0, sequelize_1.InjectModel)(models_5.VitalSigns)),
    __param(5, (0, sequelize_1.InjectModel)(models_6.ClinicVisit)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], SearchService);
//# sourceMappingURL=search.service.js.map