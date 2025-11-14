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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var DataLoaderFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLoaderFactory = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const common_1 = require("@nestjs/common");
const student_1 = require("../../../services/student");
const contact_1 = require("../../../services/communication/contact");
const medication_1 = require("../../../services/medication");
const health_record_1 = require("../../../health-record");
const emergency_contact_1 = require("../../../services/communication/emergency-contact");
const chronic_condition_1 = require("../../../services/chronic-condition");
const incident_report_1 = require("../../../incident-report");
const allergy_1 = require("../../../health-record/allergy");
let DataLoaderFactory = DataLoaderFactory_1 = class DataLoaderFactory {
    studentService;
    contactService;
    medicationService;
    healthRecordService;
    emergencyContactService;
    chronicConditionService;
    incidentCoreService;
    allergyService;
    logger = new common_1.Logger(DataLoaderFactory_1.name);
    constructor(studentService, contactService, medicationService, healthRecordService, emergencyContactService, chronicConditionService, incidentCoreService, allergyService) {
        this.studentService = studentService;
        this.contactService = contactService;
        this.medicationService = medicationService;
        this.healthRecordService = healthRecordService;
        this.emergencyContactService = emergencyContactService;
        this.chronicConditionService = chronicConditionService;
        this.incidentCoreService = incidentCoreService;
        this.allergyService = allergyService;
    }
    createStudentLoader() {
        return new dataloader_1.default(async (studentIds) => {
            try {
                const ids = [...studentIds];
                const students = await this.studentService.findByIds(ids);
                const studentMap = new Map(students
                    .filter((student) => student !== null)
                    .map((student) => [student.id, student]));
                return ids.map((id) => studentMap.get(id) || null);
            }
            catch (error) {
                this.logger.error('Error in student DataLoader:', error);
                return studentIds.map(() => null);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createContactsByStudentLoader() {
        return new dataloader_1.default(async (studentIds) => {
            try {
                const ids = [...studentIds];
                return await this.contactService.findByStudentIds(ids);
            }
            catch (error) {
                this.logger.error('Error in contacts-by-student DataLoader:', error);
                return studentIds.map(() => []);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createContactLoader() {
        return new dataloader_1.default(async (contactIds) => {
            try {
                const ids = [...contactIds];
                const contacts = await this.contactService.findByIds(ids);
                const contactMap = new Map(contacts
                    .filter((contact) => contact !== null)
                    .map((contact) => [contact.id, contact]));
                return ids.map((id) => contactMap.get(id) || null);
            }
            catch (error) {
                this.logger.error('Error in contact DataLoader:', error);
                return contactIds.map(() => null);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createMedicationsByStudentLoader() {
        return new dataloader_1.default(async (studentIds) => {
            try {
                const ids = [...studentIds];
                return await this.medicationService.findByStudentIds(ids);
            }
            catch (error) {
                this.logger.error('Error in medications-by-student DataLoader:', error);
                return studentIds.map(() => []);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createMedicationLoader() {
        return new dataloader_1.default(async (medicationIds) => {
            try {
                const ids = [...medicationIds];
                const medications = await this.medicationService.findByIds(ids);
                const medicationMap = new Map(medications
                    .filter((medication) => medication !== null)
                    .map((medication) => [medication.id, medication]));
                return ids.map((id) => medicationMap.get(id) || null);
            }
            catch (error) {
                this.logger.error('Error in medication DataLoader:', error);
                return medicationIds.map(() => null);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createHealthRecordsByStudentLoader() {
        return new dataloader_1.default(async (studentIds) => {
            try {
                const ids = [...studentIds];
                return await this.healthRecordService.findByStudentIds(ids);
            }
            catch (error) {
                this.logger.error('Error in health-records-by-student DataLoader:', error);
                return studentIds.map(() => []);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createHealthRecordLoader() {
        return new dataloader_1.default(async (healthRecordIds) => {
            try {
                const ids = [...healthRecordIds];
                return await this.healthRecordService.findByIds(ids);
            }
            catch (error) {
                this.logger.error('Error in health-record DataLoader:', error);
                return healthRecordIds.map(() => null);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createEmergencyContactsByStudentLoader() {
        return new dataloader_1.default(async (studentIds) => {
            try {
                const ids = [...studentIds];
                return await this.emergencyContactService.findByStudentIds(ids);
            }
            catch (error) {
                this.logger.error('Error in emergency-contacts-by-student DataLoader:', error);
                return studentIds.map(() => []);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createEmergencyContactLoader() {
        return new dataloader_1.default(async (contactIds) => {
            try {
                const ids = [...contactIds];
                return await this.emergencyContactService.findByIds(ids);
            }
            catch (error) {
                this.logger.error('Error in emergency-contact DataLoader:', error);
                return contactIds.map(() => null);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createChronicConditionsByStudentLoader() {
        return new dataloader_1.default(async (studentIds) => {
            try {
                const ids = [...studentIds];
                return await this.chronicConditionService.findByStudentIds(ids);
            }
            catch (error) {
                this.logger.error('Error in chronic-conditions-by-student DataLoader:', error);
                return studentIds.map(() => []);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createChronicConditionLoader() {
        return new dataloader_1.default(async (conditionIds) => {
            try {
                const ids = [...conditionIds];
                return await this.chronicConditionService.findByIds(ids);
            }
            catch (error) {
                this.logger.error('Error in chronic-condition DataLoader:', error);
                return conditionIds.map(() => null);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createIncidentsByStudentLoader() {
        return new dataloader_1.default(async (studentIds) => {
            try {
                const ids = [...studentIds];
                return await this.incidentCoreService.findByStudentIds(ids);
            }
            catch (error) {
                this.logger.error('Error in incidents-by-student DataLoader:', error);
                return studentIds.map(() => []);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createIncidentLoader() {
        return new dataloader_1.default(async (incidentIds) => {
            try {
                const ids = [...incidentIds];
                return await this.incidentCoreService.findByIds(ids);
            }
            catch (error) {
                this.logger.error('Error in incident DataLoader:', error);
                return incidentIds.map(() => null);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createAllergiesByStudentLoader() {
        return new dataloader_1.default(async (studentIds) => {
            try {
                const ids = [...studentIds];
                return await this.allergyService.findByStudentIds(ids);
            }
            catch (error) {
                this.logger.error('Error in allergies-by-student DataLoader:', error);
                return studentIds.map(() => []);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createAllergyLoader() {
        return new dataloader_1.default(async (allergyIds) => {
            try {
                const ids = [...allergyIds];
                return await this.allergyService.findByIds(ids);
            }
            catch (error) {
                this.logger.error('Error in allergy DataLoader:', error);
                return allergyIds.map(() => null);
            }
        }, {
            cache: true,
            batchScheduleFn: (callback) => setTimeout(callback, 1),
            maxBatchSize: 100,
        });
    }
    createLoaders() {
        return {
            studentLoader: this.createStudentLoader(),
            contactLoader: this.createContactLoader(),
            contactsByStudentLoader: this.createContactsByStudentLoader(),
            medicationLoader: this.createMedicationLoader(),
            medicationsByStudentLoader: this.createMedicationsByStudentLoader(),
            healthRecordLoader: this.createHealthRecordLoader(),
            healthRecordsByStudentLoader: this.createHealthRecordsByStudentLoader(),
            emergencyContactLoader: this.createEmergencyContactLoader(),
            emergencyContactsByStudentLoader: this.createEmergencyContactsByStudentLoader(),
            chronicConditionLoader: this.createChronicConditionLoader(),
            chronicConditionsByStudentLoader: this.createChronicConditionsByStudentLoader(),
            incidentLoader: this.createIncidentLoader(),
            incidentsByStudentLoader: this.createIncidentsByStudentLoader(),
            allergyLoader: this.createAllergyLoader(),
            allergiesByStudentLoader: this.createAllergiesByStudentLoader(),
        };
    }
};
exports.DataLoaderFactory = DataLoaderFactory;
exports.DataLoaderFactory = DataLoaderFactory = DataLoaderFactory_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __metadata("design:paramtypes", [student_1.StudentService,
        contact_1.ContactService,
        medication_1.MedicationService,
        health_record_1.HealthRecordService,
        emergency_contact_1.EmergencyContactService,
        chronic_condition_1.ChronicConditionService,
        incident_report_1.IncidentCoreService,
        allergy_1.AllergyService])
], DataLoaderFactory);
//# sourceMappingURL=dataloader.factory.js.map