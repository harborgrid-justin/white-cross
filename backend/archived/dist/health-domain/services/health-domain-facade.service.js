"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthDomainFacadeService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const event_emitter_1 = require("@nestjs/event-emitter");
const request_context_service_1 = require("../../common/context/request-context.service");
const base_1 = require("../../common/base");
const Events = __importStar(require("../events/health-domain.events"));
let HealthDomainFacadeService = class HealthDomainFacadeService extends base_1.BaseService {
    requestContext;
    moduleRef;
    eventEmitter;
    vaccinationService;
    allergyService;
    chronicConditionService;
    vitalsService;
    searchService;
    statisticsService;
    importExportService;
    validationService;
    constructor(requestContext, moduleRef, eventEmitter) {
        super(requestContext ||
            {
                requestId: 'system',
                userId: undefined,
                getLogContext: () => ({ requestId: 'system' }),
                getAuditContext: () => ({
                    requestId: 'system',
                    timestamp: new Date(),
                }),
            });
        this.requestContext = requestContext;
        this.moduleRef = moduleRef;
        this.eventEmitter = eventEmitter;
    }
    async getVaccinationService() {
        if (!this.vaccinationService) {
            const { VaccinationService } = await Promise.resolve().then(() => __importStar(require('../../health-record/vaccination/vaccination.service.js')));
            this.vaccinationService = this.moduleRef.get(VaccinationService, {
                strict: false,
            });
        }
        return this.vaccinationService;
    }
    async getAllergyService() {
        if (!this.allergyService) {
            const { AllergyService } = await Promise.resolve().then(() => __importStar(require('../../health-record/allergy/allergy.service.js')));
            this.allergyService = this.moduleRef.get(AllergyService, {
                strict: false,
            });
        }
        return this.allergyService;
    }
    async getChronicConditionService() {
        if (!this.chronicConditionService) {
            const { ChronicConditionService } = await Promise.resolve().then(() => __importStar(require('../../health-record/chronic-condition/chronic-condition.service.js')));
            this.chronicConditionService = this.moduleRef.get(ChronicConditionService, { strict: false });
        }
        return this.chronicConditionService;
    }
    async getVitalsService() {
        if (!this.vitalsService) {
            const { VitalsService } = await Promise.resolve().then(() => __importStar(require('../../health-record/vitals/vitals.service.js')));
            this.vitalsService = this.moduleRef.get(VitalsService, { strict: false });
        }
        return this.vitalsService;
    }
    async getStatisticsService() {
        if (!this.statisticsService) {
            const { StatisticsService } = await Promise.resolve().then(() => __importStar(require('../../health-record/statistics/statistics.service.js')));
            this.statisticsService = this.moduleRef.get(StatisticsService, {
                strict: false,
            });
        }
        return this.statisticsService;
    }
    async getImportExportService() {
        if (!this.importExportService) {
            const { ImportExportService } = await Promise.resolve().then(() => __importStar(require('../../health-record/import-export/import-export.service.js')));
            this.importExportService = this.moduleRef.get(ImportExportService, {
                strict: false,
            });
        }
        return this.importExportService;
    }
    async createHealthRecord(data) {
        try {
            const result = { id: 'generated-id', ...data };
            this.eventEmitter.emit('health-record.created', new Events.HealthRecordCreatedEvent(result.id, data.studentId, data, this.requestContext?.userId));
            this.logInfo('Health record created', { healthRecordId: result.id });
            return result;
        }
        catch (error) {
            this.handleError('Failed to create health record', error);
        }
    }
    async getHealthRecord(id) {
        try {
            this.validateUUID(id, 'Health record ID');
            throw new common_1.NotFoundException(`Health record with ID ${id} not found`);
        }
        catch (error) {
            this.handleError('Failed to get health record', error);
        }
    }
    async updateHealthRecord(id, data) {
        try {
            this.validateUUID(id, 'Health record ID');
            this.eventEmitter.emit('health-record.updated', new Events.HealthRecordUpdatedEvent(id, data.studentId || '', data, this.requestContext?.userId));
            this.logInfo('Health record updated', { healthRecordId: id });
            return { id, ...data };
        }
        catch (error) {
            this.handleError('Failed to update health record', error);
        }
    }
    async deleteHealthRecord(id) {
        try {
            this.validateUUID(id, 'Health record ID');
            this.eventEmitter.emit('health-record.deleted', new Events.HealthRecordDeletedEvent(id, 'unknown', this.requestContext?.userId));
            this.logInfo('Health record deleted', { healthRecordId: id });
            return true;
        }
        catch (error) {
            this.handleError('Failed to delete health record', error);
        }
    }
    async createAllergy(data) {
        try {
            const allergyService = await this.getAllergyService();
            const mockUser = {
                id: this.requestContext?.userId || 'system',
                role: 'admin',
            };
            const result = await allergyService.create(data, mockUser);
            this.eventEmitter.emit('allergy.created', new Events.AllergyCreatedEvent(result.id, data.studentId, data, this.requestContext?.userId));
            this.logInfo('Allergy created', { allergyId: result.id });
            return result;
        }
        catch (error) {
            this.handleError('Failed to create allergy', error);
        }
    }
    async updateAllergy(id, data) {
        try {
            this.validateUUID(id, 'Allergy ID');
            const allergyService = await this.getAllergyService();
            const mockUser = {
                id: this.requestContext?.userId || 'system',
                role: 'admin',
            };
            const result = await allergyService.update(id, data, mockUser);
            this.eventEmitter.emit('allergy.updated', new Events.AllergyUpdatedEvent(id, data.studentId || '', data, this.requestContext?.userId));
            this.logInfo('Allergy updated', { allergyId: id });
            return result;
        }
        catch (error) {
            this.handleError('Failed to update allergy', error);
        }
    }
    async deleteAllergy(id) {
        try {
            this.validateUUID(id, 'Allergy ID');
            const allergyService = await this.getAllergyService();
            const mockUser = {
                id: this.requestContext?.userId || 'system',
                role: 'admin',
            };
            await allergyService.remove(id, mockUser);
            this.logInfo('Allergy deleted', { allergyId: id });
            return true;
        }
        catch (error) {
            this.handleError('Failed to delete allergy', error);
        }
    }
    async getStudentAllergies(studentId, filters = {}, page = 1, limit = 20) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const allergyService = await this.getAllergyService();
            const mockUser = {
                id: this.requestContext?.userId || 'system',
                role: 'admin',
            };
            const allergies = await allergyService.findByStudent(studentId, mockUser);
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
        catch (error) {
            this.handleError('Failed to get student allergies', error);
        }
    }
    async createImmunization(data) {
        try {
            const vaccinationService = await this.getVaccinationService();
            const result = await vaccinationService.addVaccination(data);
            this.eventEmitter.emit('immunization.created', new Events.ImmunizationCreatedEvent(result.id, data.studentId, data, this.requestContext?.userId));
            this.logInfo('Immunization created', { immunizationId: result.id });
            return result;
        }
        catch (error) {
            this.handleError('Failed to create immunization', error);
        }
    }
    async getStudentImmunizations(studentId, filters = {}, page = 1, limit = 20) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const vaccinationService = await this.getVaccinationService();
            const vaccinations = await vaccinationService.getVaccinationHistory(studentId);
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
        catch (error) {
            this.handleError('Failed to get student immunizations', error);
        }
    }
    async getImmunizationCompliance(studentId) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const vaccinationService = await this.getVaccinationService();
            return await vaccinationService.checkComplianceStatus(studentId);
        }
        catch (error) {
            this.handleError('Failed to get immunization compliance', error);
        }
    }
    async createChronicCondition(data) {
        try {
            const chronicConditionService = await this.getChronicConditionService();
            const result = await chronicConditionService.addChronicCondition(data);
            this.eventEmitter.emit('chronic-condition.created', new Events.ChronicConditionCreatedEvent(result.id, data.studentId, data, this.requestContext?.userId));
            this.logInfo('Chronic condition created', { conditionId: result.id });
            return result;
        }
        catch (error) {
            this.handleError('Failed to create chronic condition', error);
        }
    }
    async getStudentChronicConditions(studentId, filters = {}, page = 1, limit = 20) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const chronicConditionService = await this.getChronicConditionService();
            const conditions = await chronicConditionService.getChronicConditions(studentId);
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
        catch (error) {
            this.handleError('Failed to get student chronic conditions', error);
        }
    }
    async recordVitalSigns(studentId, vitals, notes) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const vitalsService = await this.getVitalsService();
            const vitalData = { studentId, ...vitals, notes };
            const result = await vitalsService.recordVitals(vitalData);
            this.eventEmitter.emit('vital-signs.recorded', new Events.VitalSignsRecordedEvent(result.id, studentId, vitals, this.requestContext?.userId));
            this.logInfo('Vital signs recorded', { vitalSignsId: result.id });
            return result;
        }
        catch (error) {
            this.handleError('Failed to record vital signs', error);
        }
    }
    async getLatestVitalSigns(studentId) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const vitalsService = await this.getVitalsService();
            const history = await vitalsService.getVitalsHistory(studentId, 1);
            return history[0] || null;
        }
        catch (error) {
            this.handleError('Failed to get latest vital signs', error);
        }
    }
    async checkAbnormalVitals(studentId) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const vitalsService = await this.getVitalsService();
            const anomalies = await vitalsService.detectAnomalies(studentId);
            if (anomalies.anomalies && anomalies.anomalies.length > 0) {
                this.eventEmitter.emit('abnormal-vitals.detected', new Events.AbnormalVitalsDetectedEvent(studentId, anomalies.latestVitals, anomalies.anomalies, this.requestContext?.userId));
            }
            return anomalies.anomalies || [];
        }
        catch (error) {
            this.handleError('Failed to check abnormal vitals', error);
        }
    }
    async getHealthSummary(studentId) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const statisticsService = await this.getStatisticsService();
            return await statisticsService.getStudentStatistics(studentId);
        }
        catch (error) {
            this.handleError('Failed to get health summary', error);
        }
    }
    async exportStudentData(studentId, options = {}) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const importExportService = await this.getImportExportService();
            const format = options.format || 'JSON';
            return await importExportService.exportStudentRecord(studentId, format);
        }
        catch (error) {
            this.handleError('Failed to export student data', error);
        }
    }
    async importStudentData(importData, options = {}) {
        try {
            const importExportService = await this.getImportExportService();
            const format = options.format || 'JSON';
            const mockUser = {
                id: this.requestContext?.userId || 'system',
                role: 'admin',
            };
            return await importExportService.importRecords(importData, format, mockUser);
        }
        catch (error) {
            this.handleError('Failed to import student data', error);
        }
    }
};
exports.HealthDomainFacadeService = HealthDomainFacadeService;
exports.HealthDomainFacadeService = HealthDomainFacadeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService,
        core_1.ModuleRef,
        event_emitter_1.EventEmitter2])
], HealthDomainFacadeService);
//# sourceMappingURL=health-domain-facade.service.js.map