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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRecordService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../common/base");
const health_record_crud_service_1 = require("./services/health-record-crud.service");
const health_record_allergy_service_1 = require("./services/health-record-allergy.service");
const health_record_chronic_condition_service_1 = require("./services/health-record-chronic-condition.service");
const health_record_vaccination_service_1 = require("./services/health-record-vaccination.service");
const health_record_vitals_service_1 = require("./services/health-record-vitals.service");
const health_record_summary_service_1 = require("./services/health-record-summary.service");
const health_record_batch_service_1 = require("./services/health-record-batch.service");
let HealthRecordService = class HealthRecordService extends base_1.BaseService {
    crudService;
    allergyService;
    chronicConditionService;
    vaccinationService;
    vitalsService;
    summaryService;
    batchService;
    constructor(crudService, allergyService, chronicConditionService, vaccinationService, vitalsService, summaryService, batchService) {
        super("HealthRecordService");
        this.crudService = crudService;
        this.allergyService = allergyService;
        this.chronicConditionService = chronicConditionService;
        this.vaccinationService = vaccinationService;
        this.vitalsService = vitalsService;
        this.summaryService = summaryService;
        this.batchService = batchService;
    }
    async getStudentHealthRecords(studentId, page = 1, limit = 20, filters = {}) {
        return this.crudService.getStudentHealthRecords(studentId, page, limit, filters);
    }
    async createHealthRecord(data) {
        return this.crudService.createHealthRecord(data);
    }
    async updateHealthRecord(id, data) {
        return this.crudService.updateHealthRecord(id, data);
    }
    async getVaccinationRecords(studentId) {
        return this.crudService.getVaccinationRecords(studentId);
    }
    async bulkDeleteHealthRecords(recordIds) {
        return this.crudService.bulkDeleteHealthRecords(recordIds);
    }
    async addAllergy(data) {
        return this.allergyService.addAllergy(data);
    }
    async updateAllergy(id, data) {
        return this.allergyService.updateAllergy(id, data);
    }
    async getStudentAllergies(studentId) {
        return this.allergyService.getStudentAllergies(studentId);
    }
    async deleteAllergy(id) {
        return this.allergyService.deleteAllergy(id);
    }
    async addChronicCondition(data) {
        return this.chronicConditionService.addChronicCondition(data);
    }
    async getStudentChronicConditions(studentId) {
        return this.chronicConditionService.getStudentChronicConditions(studentId);
    }
    async updateChronicCondition(id, data) {
        return this.chronicConditionService.updateChronicCondition(id, data);
    }
    async deleteChronicCondition(id) {
        return this.chronicConditionService.deleteChronicCondition(id);
    }
    async addVaccination(data) {
        return this.vaccinationService.addVaccination(data);
    }
    async getStudentVaccinations(studentId) {
        return this.vaccinationService.getStudentVaccinations(studentId);
    }
    async updateVaccination(id, data) {
        return this.vaccinationService.updateVaccination(id, data);
    }
    async deleteVaccination(id) {
        return this.vaccinationService.deleteVaccination(id);
    }
    async getGrowthChartData(studentId) {
        return this.vitalsService.getGrowthChartData(studentId);
    }
    async getRecentVitals(studentId, limit = 10) {
        return this.vitalsService.getRecentVitals(studentId, limit);
    }
    async getHealthSummary(studentId) {
        const summary = await this.summaryService.getHealthSummary(studentId);
        summary.recentVitals = await this.vitalsService.getRecentVitals(studentId, 5);
        return summary;
    }
    async searchHealthRecords(query, type, page = 1, limit = 20) {
        return this.summaryService.searchHealthRecords(query, type, page, limit);
    }
    async exportHealthHistory(studentId) {
        return this.summaryService.exportHealthHistory(studentId);
    }
    async importHealthRecords(studentId, importData) {
        return this.summaryService.importHealthRecords(studentId, importData);
    }
    async getAllHealthRecords(page = 1, limit = 20, filters = {}) {
        return this.crudService.getAllHealthRecords(page, limit, filters);
    }
    async getHealthRecordStatistics() {
        return this.summaryService.getHealthRecordStatistics();
    }
    async getHealthRecord(studentId) {
        return this.crudService.getHealthRecord(studentId);
    }
    async getHealthRecordById(id) {
        return this.crudService.getHealthRecordById(id);
    }
    async deleteHealthRecord(id) {
        return this.crudService.deleteHealthRecord(id);
    }
    async getCompleteHealthProfile(studentId) {
        return this.summaryService.getCompleteHealthProfile(studentId);
    }
    async findAll(page = 1, limit = 20, filters = {}) {
        return this.getAllHealthRecords(page, limit, filters);
    }
    async findOne(id) {
        return this.getHealthRecordById(id);
    }
    async findByStudent(studentId, page = 1, limit = 20, filters = {}) {
        return this.getStudentHealthRecords(studentId, page, limit, filters);
    }
    async create(data) {
        return this.createHealthRecord(data);
    }
    async update(id, data) {
        return this.updateHealthRecord(id, data);
    }
    async remove(id) {
        return this.deleteHealthRecord(id);
    }
    async findByIds(ids) {
        return this.batchService.findByIds(ids);
    }
    async findByStudentIds(studentIds) {
        return this.batchService.findByStudentIds(studentIds);
    }
};
exports.HealthRecordService = HealthRecordService;
exports.HealthRecordService = HealthRecordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [health_record_crud_service_1.HealthRecordCrudService,
        health_record_allergy_service_1.HealthRecordAllergyService,
        health_record_chronic_condition_service_1.HealthRecordChronicConditionService,
        health_record_vaccination_service_1.HealthRecordVaccinationService,
        health_record_vitals_service_1.HealthRecordVitalsService,
        health_record_summary_service_1.HealthRecordSummaryService,
        health_record_batch_service_1.HealthRecordBatchService])
], HealthRecordService);
//# sourceMappingURL=health-record.service.js.map