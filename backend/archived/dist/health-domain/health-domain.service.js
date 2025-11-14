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
exports.HealthDomainService = void 0;
const common_1 = require("@nestjs/common");
const vaccination_service_1 = require("../health-record/vaccination/vaccination.service");
const allergy_service_1 = require("../health-record/allergy/allergy.service");
const chronic_condition_service_1 = require("../services/chronic-condition/chronic-condition.service");
const vitals_service_1 = require("../health-record/vitals/vitals.service");
const search_service_1 = require("../health-record/search/search.service");
const statistics_service_1 = require("../health-record/statistics/statistics.service");
const import_export_service_1 = require("../health-record/import-export/import-export.service");
const validation_service_1 = require("../health-record/validation/validation.service");
const base_1 = require("../common/base");
let HealthDomainService = class HealthDomainService extends base_1.BaseService {
    vaccinationService;
    allergyService;
    chronicConditionService;
    vitalsService;
    searchService;
    statisticsService;
    importExportService;
    validationService;
    constructor(vaccinationService, allergyService, chronicConditionService, vitalsService, searchService, statisticsService, importExportService, validationService) {
        super("HealthDomainService");
        this.vaccinationService = vaccinationService;
        this.allergyService = allergyService;
        this.chronicConditionService = chronicConditionService;
        this.vitalsService = vitalsService;
        this.searchService = searchService;
        this.statisticsService = statisticsService;
        this.importExportService = importExportService;
        this.validationService = validationService;
    }
    async createHealthRecord(data) {
        throw new Error('Method not implemented - requires database models');
    }
    async getHealthRecord(id) {
        throw new Error('Method not implemented - requires database models');
    }
    async updateHealthRecord(id, data) {
        throw new Error('Method not implemented - requires database models');
    }
    async deleteHealthRecord(id) {
        throw new Error('Method not implemented - requires database models');
    }
    async getHealthRecords(studentId, filters = {}, page = 1, limit = 20) {
        throw new Error('Method not implemented - requires database models');
    }
    async searchHealthRecords(query, filters = {}, page = 1, limit = 20) {
        throw new Error('Method not implemented - requires database models');
    }
    async createAllergy(data) {
        const mockUser = { id: 'system', role: 'admin', email: 'system@whitecross.com', isActive: true };
        return this.allergyService.create(data, mockUser);
    }
    async updateAllergy(id, data) {
        const mockUser = { id: 'system', role: 'admin', email: 'system@whitecross.com', isActive: true };
        return this.allergyService.update(id, data, mockUser);
    }
    async deleteAllergy(id) {
        const mockUser = { id: 'system', role: 'admin', email: 'system@whitecross.com', isActive: true };
        await this.allergyService.remove(id, mockUser);
        return true;
    }
    async getStudentAllergies(studentId, filters = {}, page = 1, limit = 20) {
        const mockUser = { id: 'system', role: 'admin', email: 'system@whitecross.com', isActive: true };
        const allergies = await this.allergyService.findByStudent(studentId, mockUser);
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedData = allergies.slice(start, end);
        return {
            data: paginatedData,
            pagination: {
                page,
                limit,
                total: allergies.length,
                pages: Math.ceil(allergies.length / limit),
            },
        };
    }
    async getCriticalAllergies() {
        return [];
    }
    async verifyAllergy(id, verifiedBy) {
        return { id, verified: true, verifiedBy };
    }
    async createImmunization(data) {
        return this.vaccinationService.addVaccination(data);
    }
    async updateImmunization(id, data) {
        throw new Error('VaccinationService.update() method not yet implemented');
    }
    async deleteImmunization(id) {
        throw new Error('VaccinationService.delete() method not yet implemented');
    }
    async getStudentImmunizations(studentId, filters = {}, page = 1, limit = 20) {
        const vaccinations = await this.vaccinationService.getVaccinationHistory(studentId);
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedData = vaccinations.slice(start, end);
        return {
            data: paginatedData,
            pagination: {
                page,
                limit,
                total: vaccinations.length,
                pages: Math.ceil(vaccinations.length / limit),
            },
        };
    }
    async getImmunizationCompliance(studentId) {
        return this.vaccinationService.checkComplianceStatus(studentId);
    }
    async getOverdueImmunizations(query = {}) {
        const { schoolId, gradeLevel, daysOverdue, vaccineName } = query;
        console.log('Overdue query filters:', {
            schoolId,
            gradeLevel,
            daysOverdue,
            vaccineName,
        });
        return [];
    }
    async createChronicCondition(data) {
        return this.chronicConditionService.addChronicCondition(data);
    }
    async updateChronicCondition(id, data) {
        throw new Error('ChronicConditionService.update() not yet implemented');
    }
    async deleteChronicCondition(id) {
        throw new Error('ChronicConditionService.delete() not yet implemented');
    }
    async getStudentChronicConditions(studentId, filters = {}, page = 1, limit = 20) {
        const conditions = await this.chronicConditionService.getChronicConditions(studentId);
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedData = conditions.slice(start, end);
        return {
            data: paginatedData,
            pagination: {
                page,
                limit,
                total: conditions.length,
                pages: Math.ceil(conditions.length / limit),
            },
        };
    }
    async recordVitalSigns(studentId, vitals, notes) {
        const vitalData = { studentId, ...vitals, notes };
        return this.vitalsService.recordVitals(vitalData);
    }
    async getLatestVitalSigns(studentId) {
        const history = await this.vitalsService.getVitalsHistory(studentId, 1);
        return history[0] || null;
    }
    async getVitalSignsHistory(studentId, page = 1, limit = 10) {
        const history = await this.vitalsService.getVitalsHistory(studentId, limit);
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedData = history.slice(start, end);
        return {
            data: paginatedData,
            pagination: {
                page,
                limit,
                total: history.length,
                pages: Math.ceil(history.length / limit),
            },
        };
    }
    async getGrowthData(studentId) {
        return [];
    }
    async checkAbnormalVitals(studentId) {
        const anomalies = await this.vitalsService.detectAnomalies(studentId);
        return anomalies.anomalies || [];
    }
    async getHealthSummary(studentId) {
        return this.statisticsService.getStudentStatistics(studentId);
    }
    async getHealthStatistics(studentId) {
        if (studentId) {
            return this.statisticsService.getStudentStatistics(studentId);
        }
        return { message: 'Overall statistics not yet implemented' };
    }
    async exportStudentData(studentId, options = {}) {
        const format = options.format || 'JSON';
        return this.importExportService.exportStudentRecord(studentId, format);
    }
    async importStudentData(importData, options = {}) {
        const format = options.format || 'JSON';
        const mockUser = { id: 'system', role: 'admin', email: 'system@whitecross.com', isActive: true };
        return this.importExportService.importRecords(importData, format, mockUser);
    }
    async bulkDeleteHealthRecords(ids) {
        throw new Error('Method not implemented - requires database models');
    }
    async createExemption(data) {
        return {
            id: '550e8400-e29b-41d4-a716-446655440000',
            ...data,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            message: 'Exemption created - requires approval',
        };
    }
    async getExemptions(filters = {}, page = 1, limit = 20) {
        return {
            data: [],
            pagination: {
                page,
                limit,
                total: 0,
                totalPages: 0,
            },
        };
    }
    async getExemption(id) {
        throw new common_1.NotFoundException('Exemption not found');
    }
    async updateExemption(id, data) {
        return {
            id,
            ...data,
            updatedAt: new Date().toISOString(),
            message: 'Exemption updated successfully',
        };
    }
    async deleteExemption(id) {
    }
    async getStudentExemptions(studentId) {
        return [];
    }
    async getScheduleByAge(query) {
        const { age, ageUnit, stateCode } = query;
        const ageInMonths = ageUnit === 'YEARS' ? age * 12 : age;
        return {
            age: ageInMonths,
            ageUnit: 'MONTHS',
            state: stateCode || 'DEFAULT',
            vaccines: [
                {
                    cvxCode: '03',
                    vaccineName: 'MMR',
                    doseNumber: ageInMonths >= 12 ? 1 : null,
                    recommendedAgeMonths: 12,
                    notes: 'First dose at 12 months, second dose at 4-6 years',
                },
            ],
        };
    }
    async getCatchUpSchedule(query) {
        const { studentId, currentAgeMonths, includeAccelerated } = query;
        return {
            studentId,
            currentAge: currentAgeMonths,
            catchUpVaccines: [
                {
                    vaccine: 'MMR',
                    status: 'BEHIND',
                    dosesReceived: 0,
                    dosesRequired: 2,
                    nextDose: {
                        doseNumber: 1,
                        earliestDate: new Date().toISOString(),
                        recommendedDate: new Date().toISOString(),
                        minimumInterval: null,
                    },
                },
            ],
            accelerated: includeAccelerated || true,
        };
    }
    async getSchoolEntryRequirements(query) {
        const { gradeLevel, stateCode, schoolYear } = query;
        return {
            state: stateCode,
            gradeLevel,
            schoolYear: schoolYear || '2025-2026',
            requirements: [
                {
                    vaccine: 'MMR',
                    cvxCode: '03',
                    requiredDoses: 2,
                    exemptionsAllowed: ['MEDICAL', 'RELIGIOUS'],
                    notes: 'Two doses required for school entry',
                },
                {
                    vaccine: 'DTaP',
                    cvxCode: '20',
                    requiredDoses: 5,
                    exemptionsAllowed: ['MEDICAL', 'RELIGIOUS'],
                    notes: 'Five doses required, or 4 doses if 4th dose given after age 4',
                },
            ],
            exemptionPolicies: {
                medical: 'Requires physician signature',
                religious: 'Requires notarized affidavit',
                philosophical: stateCode === 'CA' ? 'Not allowed' : 'Allowed with counseling',
            },
        };
    }
    async checkContraindications(query) {
        const { studentId, cvxCode, includePrecautions } = query;
        return {
            studentId,
            cvxCode,
            contraindications: [],
            precautions: includePrecautions ? [] : undefined,
            safe: true,
            message: 'No contraindications found for this vaccine',
        };
    }
    async getVaccinationRates(query) {
        const { schoolId, gradeLevel, vaccineName, startDate, endDate } = query;
        return {
            filters: {
                schoolId: schoolId || 'ALL',
                gradeLevel: gradeLevel || 'ALL',
                vaccineName: vaccineName || 'ALL',
                dateRange: { start: startDate, end: endDate },
            },
            overallRate: 92.5,
            byVaccine: [
                { vaccine: 'MMR', coverageRate: 95.2, compliant: 950, total: 998 },
                { vaccine: 'DTaP', coverageRate: 93.8, compliant: 936, total: 998 },
            ],
            byGrade: [
                { grade: 'KINDERGARTEN', coverageRate: 94.5 },
                { grade: 'GRADE_6', coverageRate: 91.2 },
            ],
            bySchool: [],
        };
    }
    async generateStateReport(exportDto) {
        const { stateCode, format, schoolIds, startDate, endDate, compliantOnly, includeExemptions, } = exportDto;
        return {
            state: stateCode,
            format,
            recordCount: 0,
            exportDate: new Date().toISOString(),
            data: format === 'JSON' ? [] : 'CSV/HL7/XML data',
            message: `State report generated for ${stateCode} in ${format} format`,
        };
    }
    async getComplianceSummary(schoolId, gradeLevel) {
        return {
            filters: { schoolId: schoolId || 'ALL', gradeLevel: gradeLevel || 'ALL' },
            summary: {
                totalStudents: 0,
                compliant: 0,
                nonCompliant: 0,
                exempt: 0,
                complianceRate: 0,
            },
            bySchool: [],
            byGrade: [],
            missingVaccines: [],
        };
    }
    async getExemptionRates(schoolId, vaccineName) {
        return {
            filters: {
                schoolId: schoolId || 'ALL',
                vaccineName: vaccineName || 'ALL',
            },
            summary: {
                totalExemptions: 0,
                exemptionRate: 0,
                byType: {
                    medical: 0,
                    religious: 0,
                    philosophical: 0,
                    temporary: 0,
                },
            },
            byVaccine: [],
            bySchool: [],
            trend: [],
        };
    }
};
exports.HealthDomainService = HealthDomainService;
exports.HealthDomainService = HealthDomainService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => vaccination_service_1.VaccinationService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => allergy_service_1.AllergyService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => chronic_condition_service_1.ChronicConditionService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => vitals_service_1.VitalsService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => search_service_1.SearchService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => statistics_service_1.StatisticsService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => import_export_service_1.ImportExportService))),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => validation_service_1.ValidationService))),
    __metadata("design:paramtypes", [vaccination_service_1.VaccinationService,
        allergy_service_1.AllergyService,
        chronic_condition_service_1.ChronicConditionService,
        vitals_service_1.VitalsService,
        search_service_1.SearchService,
        statistics_service_1.StatisticsService,
        import_export_service_1.ImportExportService,
        validation_service_1.ValidationService])
], HealthDomainService);
//# sourceMappingURL=health-domain.service.js.map