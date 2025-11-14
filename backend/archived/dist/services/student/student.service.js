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
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const student_crud_service_1 = require("./services/student-crud.service");
const student_query_service_1 = require("./services/student-query.service");
const student_health_records_service_1 = require("./services/student-health-records.service");
const student_academic_service_1 = require("./services/student-academic.service");
const student_photo_service_1 = require("./services/student-photo.service");
const student_barcode_service_1 = require("./services/student-barcode.service");
const student_waitlist_service_1 = require("./services/student-waitlist.service");
const student_validation_service_1 = require("./services/student-validation.service");
const base_1 = require("../../common/base");
let StudentService = class StudentService extends base_1.BaseService {
    crudService;
    queryService;
    healthRecordsService;
    academicService;
    photoService;
    barcodeService;
    waitlistService;
    validationService;
    constructor(crudService, queryService, healthRecordsService, academicService, photoService, barcodeService, waitlistService, validationService) {
        super('StudentService');
        this.crudService = crudService;
        this.queryService = queryService;
        this.healthRecordsService = healthRecordsService;
        this.academicService = academicService;
        this.photoService = photoService;
        this.barcodeService = barcodeService;
        this.waitlistService = waitlistService;
        this.validationService = validationService;
    }
    async create(createStudentDto) {
        return this.crudService.create(createStudentDto);
    }
    async findOne(id) {
        return this.crudService.findOne(id);
    }
    async update(id, updateStudentDto) {
        return this.crudService.update(id, updateStudentDto);
    }
    async remove(id) {
        return this.crudService.remove(id);
    }
    async deactivate(id, reason) {
        return this.crudService.deactivate(id, reason);
    }
    async reactivate(id) {
        return this.crudService.reactivate(id);
    }
    async transfer(id, transferDto) {
        return this.crudService.transfer(id, transferDto);
    }
    async bulkUpdate(bulkUpdateDto) {
        return this.crudService.bulkUpdate(bulkUpdateDto);
    }
    async getStatistics(studentId) {
        return this.crudService.getStatistics(studentId);
    }
    async exportData(studentId) {
        return this.crudService.exportData(studentId);
    }
    async findByIds(ids) {
        return this.crudService.findByIds(ids);
    }
    async findAll(filterDto) {
        return this.queryService.findAll(filterDto);
    }
    async search(query, limit) {
        return this.queryService.search(query, limit);
    }
    async findByGrade(grade) {
        return this.queryService.findByGrade(grade);
    }
    async findAllGrades() {
        return this.queryService.findAllGrades();
    }
    async findAssignedStudents(nurseId) {
        return this.queryService.findAssignedStudents(nurseId);
    }
    async findBySchoolIds(schoolIds) {
        return this.queryService.findBySchoolIds(schoolIds);
    }
    async getStudentHealthRecords(studentId, page, limit) {
        return this.healthRecordsService.getStudentHealthRecords(studentId, page, limit);
    }
    async getStudentMentalHealthRecords(studentId, page, limit) {
        return this.healthRecordsService.getStudentMentalHealthRecords(studentId, page, limit);
    }
    async uploadStudentPhoto(studentId, uploadPhotoDto) {
        return this.photoService.uploadStudentPhoto(studentId, uploadPhotoDto);
    }
    async searchStudentsByPhoto(searchPhotoDto) {
        return this.photoService.searchStudentsByPhoto(searchPhotoDto);
    }
    async importAcademicTranscript(studentId, importTranscriptDto) {
        return this.academicService.importAcademicTranscript(studentId, importTranscriptDto);
    }
    async getAcademicHistory(studentId, query) {
        return this.academicService.getAcademicHistory(studentId, query);
    }
    async getPerformanceTrends(studentId, query) {
        return this.academicService.getPerformanceTrends(studentId, query);
    }
    async performBulkGradeTransition(bulkGradeTransitionDto) {
        return this.academicService.performBulkGradeTransition(bulkGradeTransitionDto);
    }
    async getGraduatingStudents(query) {
        return this.academicService.getGraduatingStudents(query);
    }
    async advanceStudentGrade(id, gradeTransitionDto) {
        return this.academicService.advanceStudentGrade(id, gradeTransitionDto);
    }
    async retainStudentGrade(id, gradeTransitionDto) {
        return this.academicService.retainStudentGrade(id, gradeTransitionDto);
    }
    async processStudentGraduation(id, graduationDto) {
        return this.academicService.processStudentGraduation(id, graduationDto);
    }
    async getGradeTransitionHistory(id) {
        return this.academicService.getGradeTransitionHistory(id);
    }
    async scanBarcode(scanBarcodeDto) {
        return this.barcodeService.scanBarcode(scanBarcodeDto);
    }
    async verifyMedicationAdministration(verifyMedicationDto) {
        return this.barcodeService.verifyMedication(verifyMedicationDto);
    }
    async addStudentToWaitlist(addWaitlistDto) {
        return this.waitlistService.addStudentToWaitlist(addWaitlistDto);
    }
    async getStudentWaitlistStatus(studentId, query) {
        return this.waitlistService.getStudentWaitlistStatus(studentId, query);
    }
    validateUUID(id) {
        return this.validationService.validateUUID(id);
    }
    validateDateOfBirth(dateOfBirth) {
        return this.validationService.validateDateOfBirth(dateOfBirth);
    }
    calculateAge(dateOfBirth) {
        return this.validationService.calculateAge(dateOfBirth);
    }
    async generateStudentBarcode(id, generateBarcodeDto) {
        return await this.barcodeService.generateBarcode(id, generateBarcodeDto);
    }
    async verifyStudentBarcode(verifyBarcodeDto) {
        return await this.barcodeService.verifyBarcode(verifyBarcodeDto);
    }
    async addStudentToWaitlist(id, addWaitlistDto) {
        const dtoWithStudentId = { ...addWaitlistDto, studentId: id };
        return await this.waitlistService.addStudentToWaitlist(dtoWithStudentId);
    }
    async updateWaitlistPriority(id, priorityDto) {
        return await this.waitlistService.updateWaitlistPriority(id, priorityDto);
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [student_crud_service_1.StudentCrudService,
        student_query_service_1.StudentQueryService,
        student_health_records_service_1.StudentHealthRecordsService,
        student_academic_service_1.StudentAcademicService,
        student_photo_service_1.StudentPhotoService,
        student_barcode_service_1.StudentBarcodeService,
        student_waitlist_service_1.StudentWaitlistService,
        student_validation_service_1.StudentValidationService])
], StudentService);
//# sourceMappingURL=student.service.js.map