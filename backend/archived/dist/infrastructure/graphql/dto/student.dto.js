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
exports.StudentFilterInputDto = exports.StudentUpdateInputDto = exports.StudentInputDto = exports.StudentListResponseDto = exports.StudentDto = exports.Gender = void 0;
const openapi = require("@nestjs/swagger");
const graphql_1 = require("@nestjs/graphql");
const pagination_dto_1 = require("./pagination.dto");
const class_validator_1 = require("class-validator");
const contact_dto_1 = require("./contact.dto");
const medication_dto_1 = require("./medication.dto");
const health_record_dto_1 = require("./health-record.dto");
const emergency_contact_dto_1 = require("./emergency-contact.dto");
const chronic_condition_dto_1 = require("./chronic-condition.dto");
const incident_report_dto_1 = require("./incident-report.dto");
const base_healthcare_dto_1 = require("./base/base-healthcare.dto");
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHER"] = "OTHER";
    Gender["PREFER_NOT_TO_SAY"] = "PREFER_NOT_TO_SAY";
})(Gender || (exports.Gender = Gender = {}));
(0, graphql_1.registerEnumType)(Gender, {
    name: 'Gender',
    description: 'Student gender',
});
let StudentDto = class StudentDto {
    id;
    studentNumber;
    firstName;
    lastName;
    fullName;
    dateOfBirth;
    grade;
    gender;
    photo;
    medicalRecordNum;
    isActive;
    enrollmentDate;
    nurseId;
    createdAt;
    updatedAt;
    contacts;
    medications;
    healthRecord;
    contactCount;
    emergencyContacts;
    chronicConditions;
    recentIncidents;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentNumber: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, fullName: { required: true, type: () => String }, dateOfBirth: { required: true, type: () => Date }, grade: { required: true, type: () => String }, gender: { required: true, enum: require("./student.dto").Gender }, photo: { required: false, type: () => String }, medicalRecordNum: { required: false, type: () => String }, isActive: { required: true, type: () => Boolean }, enrollmentDate: { required: true, type: () => Date }, nurseId: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, contacts: { required: false, type: () => [require("./contact.dto").ContactDto] }, medications: { required: false, type: () => [require("./medication.dto").MedicationDto] }, healthRecord: { required: false, type: () => require("./health-record.dto").HealthRecordDto }, contactCount: { required: false, type: () => Number }, emergencyContacts: { required: false, type: () => [require("./emergency-contact.dto").EmergencyContactDto] }, chronicConditions: { required: false, type: () => [require("./chronic-condition.dto").ChronicConditionDto] }, recentIncidents: { required: false, type: () => [require("./incident-report.dto").IncidentReportDto] } };
    }
};
exports.StudentDto = StudentDto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], StudentDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], StudentDto.prototype, "studentNumber", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], StudentDto.prototype, "firstName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], StudentDto.prototype, "lastName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], StudentDto.prototype, "fullName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], StudentDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], StudentDto.prototype, "grade", void 0);
__decorate([
    (0, graphql_1.Field)(() => Gender),
    __metadata("design:type", String)
], StudentDto.prototype, "gender", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], StudentDto.prototype, "photo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], StudentDto.prototype, "medicalRecordNum", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], StudentDto.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], StudentDto.prototype, "enrollmentDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], StudentDto.prototype, "nurseId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], StudentDto.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], StudentDto.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [contact_dto_1.ContactDto], { nullable: 'items', description: 'Guardian contacts for the student' }),
    __metadata("design:type", Array)
], StudentDto.prototype, "contacts", void 0);
__decorate([
    (0, graphql_1.Field)(() => [medication_dto_1.MedicationDto], { nullable: 'items', description: 'Medications assigned to the student' }),
    __metadata("design:type", Array)
], StudentDto.prototype, "medications", void 0);
__decorate([
    (0, graphql_1.Field)(() => health_record_dto_1.HealthRecordDto, { nullable: true, description: 'Health record for the student' }),
    __metadata("design:type", health_record_dto_1.HealthRecordDto)
], StudentDto.prototype, "healthRecord", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number, { description: 'Count of contacts' }),
    __metadata("design:type", Number)
], StudentDto.prototype, "contactCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => [emergency_contact_dto_1.EmergencyContactDto], { nullable: 'items', description: 'Emergency contacts for the student' }),
    __metadata("design:type", Array)
], StudentDto.prototype, "emergencyContacts", void 0);
__decorate([
    (0, graphql_1.Field)(() => [chronic_condition_dto_1.ChronicConditionDto], { nullable: 'items', description: 'Chronic conditions for the student' }),
    __metadata("design:type", Array)
], StudentDto.prototype, "chronicConditions", void 0);
__decorate([
    (0, graphql_1.Field)(() => [incident_report_dto_1.IncidentReportDto], { nullable: 'items', description: 'Recent incident reports for the student' }),
    __metadata("design:type", Array)
], StudentDto.prototype, "recentIncidents", void 0);
exports.StudentDto = StudentDto = __decorate([
    (0, graphql_1.ObjectType)()
], StudentDto);
let StudentListResponseDto = class StudentListResponseDto {
    students;
    pagination;
    static _OPENAPI_METADATA_FACTORY() {
        return { students: { required: true, type: () => [require("./student.dto").StudentDto] }, pagination: { required: true, type: () => require("./pagination.dto").PaginationDto } };
    }
};
exports.StudentListResponseDto = StudentListResponseDto;
__decorate([
    (0, graphql_1.Field)(() => [StudentDto]),
    __metadata("design:type", Array)
], StudentListResponseDto.prototype, "students", void 0);
__decorate([
    (0, graphql_1.Field)(() => pagination_dto_1.PaginationDto),
    __metadata("design:type", pagination_dto_1.PaginationDto)
], StudentListResponseDto.prototype, "pagination", void 0);
exports.StudentListResponseDto = StudentListResponseDto = __decorate([
    (0, graphql_1.ObjectType)()
], StudentListResponseDto);
let StudentInputDto = class StudentInputDto extends base_healthcare_dto_1.BaseHealthcareInputDto {
    studentNumber;
    grade;
    gender;
    medicalRecordNum;
    enrollmentDate;
    nurseId;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentNumber: { required: true, type: () => String, minLength: 1, maxLength: 20 }, grade: { required: true, type: () => String, pattern: "/^(K|[1-9]|1[0-2])$/" }, gender: { required: true, enum: require("./student.dto").Gender }, medicalRecordNum: { required: false, type: () => String, maxLength: 50 }, enrollmentDate: { required: true, type: () => Date }, nurseId: { required: false, type: () => String } };
    }
};
exports.StudentInputDto = StudentInputDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Student number must not be empty' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Student number must not exceed 20 characters' }),
    __metadata("design:type", String)
], StudentInputDto.prototype, "studentNumber", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(K|[1-9]|1[0-2])$/, { message: 'Grade must be K or 1-12' }),
    __metadata("design:type", String)
], StudentInputDto.prototype, "grade", void 0);
__decorate([
    (0, graphql_1.Field)(() => Gender),
    (0, class_validator_1.IsEnum)(Gender, { message: 'Invalid gender value' }),
    __metadata("design:type", String)
], StudentInputDto.prototype, "gender", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, {
        message: 'Medical record number must not exceed 50 characters',
    }),
    __metadata("design:type", String)
], StudentInputDto.prototype, "medicalRecordNum", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid date format for enrollment date' }),
    __metadata("design:type", Date)
], StudentInputDto.prototype, "enrollmentDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StudentInputDto.prototype, "nurseId", void 0);
exports.StudentInputDto = StudentInputDto = __decorate([
    (0, graphql_1.InputType)()
], StudentInputDto);
let StudentUpdateInputDto = class StudentUpdateInputDto extends base_healthcare_dto_1.BaseHealthcareUpdateInputDto {
    studentNumber;
    grade;
    gender;
    medicalRecordNum;
    enrollmentDate;
    nurseId;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentNumber: { required: false, type: () => String, minLength: 1, maxLength: 20 }, grade: { required: false, type: () => String, pattern: "/^(K|[1-9]|1[0-2])$/" }, gender: { required: false, enum: require("./student.dto").Gender }, medicalRecordNum: { required: false, type: () => String, maxLength: 50 }, enrollmentDate: { required: false, type: () => Date }, nurseId: { required: false, type: () => String } };
    }
};
exports.StudentUpdateInputDto = StudentUpdateInputDto;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Student number must not be empty' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Student number must not exceed 20 characters' }),
    __metadata("design:type", String)
], StudentUpdateInputDto.prototype, "studentNumber", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(K|[1-9]|1[0-2])$/, { message: 'Grade must be K or 1-12' }),
    __metadata("design:type", String)
], StudentUpdateInputDto.prototype, "grade", void 0);
__decorate([
    (0, graphql_1.Field)(() => Gender, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Gender, { message: 'Invalid gender value' }),
    __metadata("design:type", String)
], StudentUpdateInputDto.prototype, "gender", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, {
        message: 'Medical record number must not exceed 50 characters',
    }),
    __metadata("design:type", String)
], StudentUpdateInputDto.prototype, "medicalRecordNum", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid date format for enrollment date' }),
    __metadata("design:type", Date)
], StudentUpdateInputDto.prototype, "enrollmentDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StudentUpdateInputDto.prototype, "nurseId", void 0);
exports.StudentUpdateInputDto = StudentUpdateInputDto = __decorate([
    (0, graphql_1.InputType)()
], StudentUpdateInputDto);
let StudentFilterInputDto = class StudentFilterInputDto extends base_healthcare_dto_1.BaseHealthcareFilterInputDto {
    grade;
    nurseId;
    static _OPENAPI_METADATA_FACTORY() {
        return { grade: { required: false, type: () => String }, nurseId: { required: false, type: () => String } };
    }
};
exports.StudentFilterInputDto = StudentFilterInputDto;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StudentFilterInputDto.prototype, "grade", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StudentFilterInputDto.prototype, "nurseId", void 0);
exports.StudentFilterInputDto = StudentFilterInputDto = __decorate([
    (0, graphql_1.InputType)()
], StudentFilterInputDto);
//# sourceMappingURL=student.dto.js.map