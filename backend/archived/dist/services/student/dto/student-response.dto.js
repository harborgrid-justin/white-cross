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
exports.StudentListResponseDto = exports.StudentResponseDto = exports.StudentSummaryDto = exports.MentalHealthRecordSummaryDto = exports.AcademicTranscriptSummaryDto = exports.IncidentReportSummaryDto = exports.ClinicalNoteSummaryDto = exports.VitalSignsSummaryDto = exports.ClinicVisitSummaryDto = exports.PrescriptionSummaryDto = exports.VaccinationSummaryDto = exports.ChronicConditionSummaryDto = exports.AllergySummaryDto = exports.AppointmentSummaryDto = exports.HealthRecordSummaryDto = exports.SchoolSummaryDto = exports.DistrictSummaryDto = exports.UserSummaryDto = exports.GenderDto = void 0;
exports.mapStudentToResponseDto = mapStudentToResponseDto;
exports.mapStudentToSummaryDto = mapStudentToSummaryDto;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const paginated_response_dto_1 = require("../../../common/dto/paginated-response.dto");
var GenderDto;
(function (GenderDto) {
    GenderDto["MALE"] = "MALE";
    GenderDto["FEMALE"] = "FEMALE";
    GenderDto["OTHER"] = "OTHER";
    GenderDto["PREFER_NOT_TO_SAY"] = "PREFER_NOT_TO_SAY";
})(GenderDto || (exports.GenderDto = GenderDto = {}));
class UserSummaryDto {
    id;
    firstName;
    lastName;
    email;
    role;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, email: { required: true, type: () => String }, role: { required: true, type: () => String } };
    }
}
exports.UserSummaryDto = UserSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], UserSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User first name',
        example: 'Jane',
    }),
    __metadata("design:type", String)
], UserSummaryDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User last name',
        example: 'Smith',
    }),
    __metadata("design:type", String)
], UserSummaryDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'jane.smith@school.edu',
        format: 'email',
    }),
    __metadata("design:type", String)
], UserSummaryDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User role in the system',
        example: 'nurse',
        enum: ['nurse', 'admin', 'staff', 'principal', 'teacher'],
    }),
    __metadata("design:type", String)
], UserSummaryDto.prototype, "role", void 0);
class DistrictSummaryDto {
    id;
    name;
    code;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, code: { required: false, type: () => String, nullable: true } };
    }
}
exports.DistrictSummaryDto = DistrictSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'District unique identifier',
        example: '660e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], DistrictSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'District name',
        example: 'Springfield Unified School District',
    }),
    __metadata("design:type", String)
], DistrictSummaryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'District code or identifier',
        example: 'SUSD-001',
        nullable: true,
    }),
    __metadata("design:type", String)
], DistrictSummaryDto.prototype, "code", void 0);
class SchoolSummaryDto {
    id;
    name;
    districtId;
    address;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, districtId: { required: false, type: () => String, nullable: true }, address: { required: false, type: () => String, nullable: true } };
    }
}
exports.SchoolSummaryDto = SchoolSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School unique identifier',
        example: '770e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], SchoolSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School name',
        example: 'Lincoln Elementary School',
    }),
    __metadata("design:type", String)
], SchoolSummaryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'District ID the school belongs to',
        example: '660e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], SchoolSummaryDto.prototype, "districtId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'School address',
        example: '123 Main St, Springfield, IL 62701',
        nullable: true,
    }),
    __metadata("design:type", String)
], SchoolSummaryDto.prototype, "address", void 0);
class HealthRecordSummaryDto {
    id;
    recordType;
    recordDate;
    chiefComplaint;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, recordType: { required: true, type: () => String }, recordDate: { required: true, type: () => Date }, chiefComplaint: { required: false, type: () => String, nullable: true } };
    }
}
exports.HealthRecordSummaryDto = HealthRecordSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Health record unique identifier',
        example: '880e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], HealthRecordSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of health record',
        example: 'CHECKUP',
        enum: ['CHECKUP', 'ILLNESS', 'INJURY', 'MEDICATION', 'IMMUNIZATION', 'SCREENING', 'OTHER'],
    }),
    __metadata("design:type", String)
], HealthRecordSummaryDto.prototype, "recordType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of the health record',
        example: '2024-11-14',
        format: 'date',
    }),
    __metadata("design:type", Date)
], HealthRecordSummaryDto.prototype, "recordDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Chief complaint or reason for visit',
        example: 'Routine physical examination',
        nullable: true,
    }),
    __metadata("design:type", String)
], HealthRecordSummaryDto.prototype, "chiefComplaint", void 0);
class AppointmentSummaryDto {
    id;
    appointmentDate;
    appointmentType;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, appointmentDate: { required: true, type: () => Date }, appointmentType: { required: true, type: () => String }, status: { required: true, type: () => String } };
    }
}
exports.AppointmentSummaryDto = AppointmentSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Appointment unique identifier',
        example: '990e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AppointmentSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Appointment date and time',
        example: '2024-11-20T10:00:00.000Z',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], AppointmentSummaryDto.prototype, "appointmentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Appointment type',
        example: 'CHECKUP',
        enum: ['CHECKUP', 'FOLLOWUP', 'SCREENING', 'VACCINATION', 'EMERGENCY', 'OTHER'],
    }),
    __metadata("design:type", String)
], AppointmentSummaryDto.prototype, "appointmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Appointment status',
        example: 'SCHEDULED',
        enum: ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
    }),
    __metadata("design:type", String)
], AppointmentSummaryDto.prototype, "status", void 0);
class AllergySummaryDto {
    id;
    allergen;
    severity;
    reaction;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, allergen: { required: true, type: () => String }, severity: { required: true, type: () => String }, reaction: { required: false, type: () => String, nullable: true } };
    }
}
exports.AllergySummaryDto = AllergySummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allergy unique identifier',
        example: 'aa0e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AllergySummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allergen name',
        example: 'Peanuts',
    }),
    __metadata("design:type", String)
], AllergySummaryDto.prototype, "allergen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Severity level',
        example: 'SEVERE',
        enum: ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'],
    }),
    __metadata("design:type", String)
], AllergySummaryDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reaction description',
        example: 'Anaphylaxis, difficulty breathing',
        nullable: true,
    }),
    __metadata("design:type", String)
], AllergySummaryDto.prototype, "reaction", void 0);
class ChronicConditionSummaryDto {
    id;
    conditionName;
    icd10Code;
    diagnosedDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, conditionName: { required: true, type: () => String }, icd10Code: { required: false, type: () => String, nullable: true }, diagnosedDate: { required: true, type: () => Date } };
    }
}
exports.ChronicConditionSummaryDto = ChronicConditionSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Chronic condition unique identifier',
        example: 'bb0e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], ChronicConditionSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Condition name',
        example: 'Asthma',
    }),
    __metadata("design:type", String)
], ChronicConditionSummaryDto.prototype, "conditionName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ICD-10 diagnosis code',
        example: 'J45.909',
        nullable: true,
    }),
    __metadata("design:type", String)
], ChronicConditionSummaryDto.prototype, "icd10Code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date diagnosed',
        example: '2020-03-15',
        format: 'date',
    }),
    __metadata("design:type", Date)
], ChronicConditionSummaryDto.prototype, "diagnosedDate", void 0);
class VaccinationSummaryDto {
    id;
    vaccineName;
    administeredDate;
    doseNumber;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, vaccineName: { required: true, type: () => String }, administeredDate: { required: true, type: () => Date }, doseNumber: { required: false, type: () => Number, nullable: true } };
    }
}
exports.VaccinationSummaryDto = VaccinationSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Vaccination unique identifier',
        example: 'cc0e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], VaccinationSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Vaccine name',
        example: 'MMR (Measles, Mumps, Rubella)',
    }),
    __metadata("design:type", String)
], VaccinationSummaryDto.prototype, "vaccineName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date administered',
        example: '2024-09-15',
        format: 'date',
    }),
    __metadata("design:type", Date)
], VaccinationSummaryDto.prototype, "administeredDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dose number (e.g., 1st dose, 2nd dose)',
        example: 1,
        nullable: true,
    }),
    __metadata("design:type", Number)
], VaccinationSummaryDto.prototype, "doseNumber", void 0);
class PrescriptionSummaryDto {
    id;
    medicationName;
    dosage;
    startDate;
    endDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, medicationName: { required: true, type: () => String }, dosage: { required: true, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: false, type: () => Date, nullable: true } };
    }
}
exports.PrescriptionSummaryDto = PrescriptionSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prescription unique identifier',
        example: 'dd0e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], PrescriptionSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medication name',
        example: 'Albuterol Inhaler',
    }),
    __metadata("design:type", String)
], PrescriptionSummaryDto.prototype, "medicationName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dosage instructions',
        example: '2 puffs every 4-6 hours as needed',
    }),
    __metadata("design:type", String)
], PrescriptionSummaryDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prescription start date',
        example: '2024-01-15',
        format: 'date',
    }),
    __metadata("design:type", Date)
], PrescriptionSummaryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Prescription end date',
        example: '2025-01-15',
        format: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], PrescriptionSummaryDto.prototype, "endDate", void 0);
class ClinicVisitSummaryDto {
    id;
    visitDate;
    reasonForVisit;
    outcome;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, visitDate: { required: true, type: () => Date }, reasonForVisit: { required: false, type: () => String, nullable: true }, outcome: { required: false, type: () => String, nullable: true } };
    }
}
exports.ClinicVisitSummaryDto = ClinicVisitSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clinic visit unique identifier',
        example: 'ee0e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], ClinicVisitSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Visit date and time',
        example: '2024-11-14T09:30:00.000Z',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], ClinicVisitSummaryDto.prototype, "visitDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for visit',
        example: 'Headache and nausea',
        nullable: true,
    }),
    __metadata("design:type", String)
], ClinicVisitSummaryDto.prototype, "reasonForVisit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Visit outcome',
        example: 'Sent home with parent',
        nullable: true,
    }),
    __metadata("design:type", String)
], ClinicVisitSummaryDto.prototype, "outcome", void 0);
class VitalSignsSummaryDto {
    id;
    recordedAt;
    temperature;
    bloodPressure;
    heartRate;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, recordedAt: { required: true, type: () => Date }, temperature: { required: false, type: () => Number, nullable: true }, bloodPressure: { required: false, type: () => String, nullable: true }, heartRate: { required: false, type: () => Number, nullable: true } };
    }
}
exports.VitalSignsSummaryDto = VitalSignsSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Vital signs record unique identifier',
        example: 'ff0e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], VitalSignsSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date vital signs were recorded',
        example: '2024-11-14T09:30:00.000Z',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], VitalSignsSummaryDto.prototype, "recordedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Temperature in Fahrenheit',
        example: 98.6,
        nullable: true,
    }),
    __metadata("design:type", Number)
], VitalSignsSummaryDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Blood pressure (systolic/diastolic)',
        example: '120/80',
        nullable: true,
    }),
    __metadata("design:type", String)
], VitalSignsSummaryDto.prototype, "bloodPressure", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Heart rate (beats per minute)',
        example: 72,
        nullable: true,
    }),
    __metadata("design:type", Number)
], VitalSignsSummaryDto.prototype, "heartRate", void 0);
class ClinicalNoteSummaryDto {
    id;
    noteType;
    createdAt;
    summary;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, noteType: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, summary: { required: false, type: () => String, nullable: true } };
    }
}
exports.ClinicalNoteSummaryDto = ClinicalNoteSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clinical note unique identifier',
        example: '110e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], ClinicalNoteSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Note type',
        example: 'PROGRESS_NOTE',
        enum: ['PROGRESS_NOTE', 'ASSESSMENT', 'TREATMENT_PLAN', 'CONSULTATION', 'OTHER'],
    }),
    __metadata("design:type", String)
], ClinicalNoteSummaryDto.prototype, "noteType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date note was created',
        example: '2024-11-14T10:00:00.000Z',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], ClinicalNoteSummaryDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Note summary or title',
        example: 'Follow-up after clinic visit',
        nullable: true,
    }),
    __metadata("design:type", String)
], ClinicalNoteSummaryDto.prototype, "summary", void 0);
class IncidentReportSummaryDto {
    id;
    incidentDate;
    incidentType;
    description;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, incidentDate: { required: true, type: () => Date }, incidentType: { required: true, type: () => String }, description: { required: false, type: () => String, nullable: true } };
    }
}
exports.IncidentReportSummaryDto = IncidentReportSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Incident report unique identifier',
        example: '220e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], IncidentReportSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Incident date and time',
        example: '2024-11-14T11:00:00.000Z',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], IncidentReportSummaryDto.prototype, "incidentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Incident type',
        example: 'INJURY',
        enum: ['INJURY', 'ILLNESS', 'BEHAVIORAL', 'SAFETY', 'OTHER'],
    }),
    __metadata("design:type", String)
], IncidentReportSummaryDto.prototype, "incidentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Brief description of incident',
        example: 'Student fell on playground',
        nullable: true,
    }),
    __metadata("design:type", String)
], IncidentReportSummaryDto.prototype, "description", void 0);
class AcademicTranscriptSummaryDto {
    id;
    academicYear;
    grade;
    gpa;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, academicYear: { required: true, type: () => String }, grade: { required: true, type: () => String }, gpa: { required: false, type: () => Number, nullable: true } };
    }
}
exports.AcademicTranscriptSummaryDto = AcademicTranscriptSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Academic transcript unique identifier',
        example: '330e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AcademicTranscriptSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Academic year',
        example: '2024-2025',
    }),
    __metadata("design:type", String)
], AcademicTranscriptSummaryDto.prototype, "academicYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Grade level for this transcript',
        example: '5',
    }),
    __metadata("design:type", String)
], AcademicTranscriptSummaryDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'GPA (Grade Point Average)',
        example: 3.5,
        nullable: true,
    }),
    __metadata("design:type", Number)
], AcademicTranscriptSummaryDto.prototype, "gpa", void 0);
class MentalHealthRecordSummaryDto {
    id;
    assessmentDate;
    assessmentType;
    riskLevel;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, assessmentDate: { required: true, type: () => Date }, assessmentType: { required: false, type: () => String, nullable: true }, riskLevel: { required: false, type: () => String, nullable: true } };
    }
}
exports.MentalHealthRecordSummaryDto = MentalHealthRecordSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mental health record unique identifier',
        example: '440e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], MentalHealthRecordSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Assessment date',
        example: '2024-10-15',
        format: 'date',
    }),
    __metadata("design:type", Date)
], MentalHealthRecordSummaryDto.prototype, "assessmentDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Assessment type',
        example: 'SCREENING',
        enum: ['SCREENING', 'ASSESSMENT', 'COUNSELING', 'INTERVENTION', 'OTHER'],
        nullable: true,
    }),
    __metadata("design:type", String)
], MentalHealthRecordSummaryDto.prototype, "assessmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Risk level',
        example: 'LOW',
        enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
        nullable: true,
    }),
    __metadata("design:type", String)
], MentalHealthRecordSummaryDto.prototype, "riskLevel", void 0);
class StudentSummaryDto {
    id;
    studentNumber;
    firstName;
    lastName;
    fullName;
    grade;
    dateOfBirth;
    age;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentNumber: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, fullName: { required: true, type: () => String }, grade: { required: true, type: () => String }, dateOfBirth: { required: true, type: () => Date }, age: { required: true, type: () => Number }, isActive: { required: true, type: () => Boolean } };
    }
}
exports.StudentSummaryDto = StudentSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School-assigned student number (unique identifier)',
        example: 'STU-2024-001',
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "studentNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student first name',
        example: 'John',
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student last name',
        example: 'Doe',
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student full name (computed field)',
        example: 'John Doe',
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current grade level',
        example: '5',
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student date of birth',
        example: '2010-05-15',
        format: 'date',
    }),
    __metadata("design:type", Date)
], StudentSummaryDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student age in years (computed field)',
        example: 14,
        minimum: 3,
        maximum: 22,
    }),
    __metadata("design:type", Number)
], StudentSummaryDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether student is currently active/enrolled',
        example: true,
    }),
    __metadata("design:type", Boolean)
], StudentSummaryDto.prototype, "isActive", void 0);
class StudentResponseDto {
    id;
    studentNumber;
    firstName;
    lastName;
    dateOfBirth;
    grade;
    gender;
    photo;
    medicalRecordNum;
    isActive;
    enrollmentDate;
    nurseId;
    schoolId;
    districtId;
    createdBy;
    updatedBy;
    fullName;
    age;
    nurse;
    school;
    district;
    healthRecords;
    academicTranscripts;
    mentalHealthRecords;
    appointments;
    prescriptions;
    clinicVisits;
    allergies;
    chronicConditions;
    vaccinations;
    vitalSigns;
    clinicalNotes;
    incidentReports;
    createdAt;
    updatedAt;
    deletedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentNumber: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, dateOfBirth: { required: true, type: () => Date }, grade: { required: true, type: () => String }, gender: { required: true, enum: require("./student-response.dto").GenderDto }, photo: { required: false, type: () => String, nullable: true }, medicalRecordNum: { required: false, type: () => String, nullable: true }, isActive: { required: true, type: () => Boolean }, enrollmentDate: { required: true, type: () => Date }, nurseId: { required: false, type: () => String, nullable: true }, schoolId: { required: false, type: () => String, nullable: true }, districtId: { required: false, type: () => String, nullable: true }, createdBy: { required: false, type: () => String, nullable: true }, updatedBy: { required: false, type: () => String, nullable: true }, fullName: { required: true, type: () => String }, age: { required: true, type: () => Number }, nurse: { required: false, type: () => require("./student-response.dto").UserSummaryDto, nullable: true }, school: { required: false, type: () => require("./student-response.dto").SchoolSummaryDto, nullable: true }, district: { required: false, type: () => require("./student-response.dto").DistrictSummaryDto, nullable: true }, healthRecords: { required: false, type: () => [require("./student-response.dto").HealthRecordSummaryDto], nullable: true }, academicTranscripts: { required: false, type: () => [require("./student-response.dto").AcademicTranscriptSummaryDto], nullable: true }, mentalHealthRecords: { required: false, type: () => [require("./student-response.dto").MentalHealthRecordSummaryDto], nullable: true }, appointments: { required: false, type: () => [require("./student-response.dto").AppointmentSummaryDto], nullable: true }, prescriptions: { required: false, type: () => [require("./student-response.dto").PrescriptionSummaryDto], nullable: true }, clinicVisits: { required: false, type: () => [require("./student-response.dto").ClinicVisitSummaryDto], nullable: true }, allergies: { required: false, type: () => [require("./student-response.dto").AllergySummaryDto], nullable: true }, chronicConditions: { required: false, type: () => [require("./student-response.dto").ChronicConditionSummaryDto], nullable: true }, vaccinations: { required: false, type: () => [require("./student-response.dto").VaccinationSummaryDto], nullable: true }, vitalSigns: { required: false, type: () => [require("./student-response.dto").VitalSignsSummaryDto], nullable: true }, clinicalNotes: { required: false, type: () => [require("./student-response.dto").ClinicalNoteSummaryDto], nullable: true }, incidentReports: { required: false, type: () => [require("./student-response.dto").IncidentReportSummaryDto], nullable: true }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, deletedAt: { required: false, type: () => Date, nullable: true } };
    }
}
exports.StudentResponseDto = StudentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier (UUID v4)',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School-assigned student number (unique identifier). PHI - Protected Health Information.',
        example: 'STU-2024-001',
        maxLength: 50,
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "studentNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student first name. PHI - Protected Health Information.',
        example: 'John',
        maxLength: 100,
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student last name. PHI - Protected Health Information.',
        example: 'Doe',
        maxLength: 100,
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student date of birth. PHI - Protected Health Information. Must be between 3 and 22 years old.',
        example: '2010-05-15',
        format: 'date',
    }),
    __metadata("design:type", Date)
], StudentResponseDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current grade level (e.g., K, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)',
        example: '5',
        maxLength: 10,
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student gender',
        example: 'MALE',
        enum: GenderDto,
        enumName: 'GenderDto',
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Profile photo URL (must point to encrypted storage). PHI - Protected Health Information.',
        example: 'https://cdn.whitecross.health/photos/student-550e8400.jpg',
        maxLength: 500,
        nullable: true,
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "photo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Medical record number (unique identifier for healthcare). PHI - Protected Health Information. Format: 6-12 alphanumeric characters, optionally separated by hyphen.',
        example: 'MRN-12345678',
        pattern: '^[A-Z0-9]{2,4}-?[A-Z0-9]{4,8}$',
        minLength: 6,
        maxLength: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "medicalRecordNum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Active enrollment status. Indicates if student is currently enrolled.',
        example: true,
        default: true,
    }),
    __metadata("design:type", Boolean)
], StudentResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School enrollment date',
        example: '2024-09-01',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], StudentResponseDto.prototype, "enrollmentDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Assigned nurse ID (foreign key to users table)',
        example: '660e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "nurseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'School ID (foreign key to schools table)',
        example: '770e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'District ID (foreign key to districts table)',
        example: '880e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "districtId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID who created this record',
        example: '990e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID who last updated this record',
        example: 'aa0e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student full name (computed field: firstName + lastName)',
        example: 'John Doe',
    }),
    __metadata("design:type", String)
], StudentResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student age in years (computed from dateOfBirth)',
        example: 14,
        minimum: 3,
        maximum: 22,
    }),
    __metadata("design:type", Number)
], StudentResponseDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Assigned nurse details (included when ?include=nurse is specified)',
        type: () => UserSummaryDto,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => UserSummaryDto),
    __metadata("design:type", UserSummaryDto)
], StudentResponseDto.prototype, "nurse", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'School details (included when ?include=school is specified)',
        type: () => SchoolSummaryDto,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => SchoolSummaryDto),
    __metadata("design:type", SchoolSummaryDto)
], StudentResponseDto.prototype, "school", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'District details (included when ?include=district is specified)',
        type: () => DistrictSummaryDto,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => DistrictSummaryDto),
    __metadata("design:type", DistrictSummaryDto)
], StudentResponseDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Health records (included when ?include=healthRecords is specified)',
        type: [HealthRecordSummaryDto],
        isArray: true,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => HealthRecordSummaryDto),
    __metadata("design:type", Array)
], StudentResponseDto.prototype, "healthRecords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Academic transcripts (included when ?include=academicTranscripts is specified)',
        type: [AcademicTranscriptSummaryDto],
        isArray: true,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => AcademicTranscriptSummaryDto),
    __metadata("design:type", Array)
], StudentResponseDto.prototype, "academicTranscripts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Mental health records (included when ?include=mentalHealthRecords is specified)',
        type: [MentalHealthRecordSummaryDto],
        isArray: true,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => MentalHealthRecordSummaryDto),
    __metadata("design:type", Array)
], StudentResponseDto.prototype, "mentalHealthRecords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Appointments (included when ?include=appointments is specified)',
        type: [AppointmentSummaryDto],
        isArray: true,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => AppointmentSummaryDto),
    __metadata("design:type", Array)
], StudentResponseDto.prototype, "appointments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Prescriptions (included when ?include=prescriptions is specified)',
        type: [PrescriptionSummaryDto],
        isArray: true,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => PrescriptionSummaryDto),
    __metadata("design:type", Array)
], StudentResponseDto.prototype, "prescriptions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Clinic visits (included when ?include=clinicVisits is specified)',
        type: [ClinicVisitSummaryDto],
        isArray: true,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => ClinicVisitSummaryDto),
    __metadata("design:type", Array)
], StudentResponseDto.prototype, "clinicVisits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Allergies (included when ?include=allergies is specified)',
        type: [AllergySummaryDto],
        isArray: true,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => AllergySummaryDto),
    __metadata("design:type", Array)
], StudentResponseDto.prototype, "allergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Chronic conditions (included when ?include=chronicConditions is specified)',
        type: [ChronicConditionSummaryDto],
        isArray: true,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => ChronicConditionSummaryDto),
    __metadata("design:type", Array)
], StudentResponseDto.prototype, "chronicConditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vaccinations (included when ?include=vaccinations is specified)',
        type: [VaccinationSummaryDto],
        isArray: true,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => VaccinationSummaryDto),
    __metadata("design:type", Array)
], StudentResponseDto.prototype, "vaccinations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vital signs records (included when ?include=vitalSigns is specified)',
        type: [VitalSignsSummaryDto],
        isArray: true,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => VitalSignsSummaryDto),
    __metadata("design:type", Array)
], StudentResponseDto.prototype, "vitalSigns", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Clinical notes (included when ?include=clinicalNotes is specified)',
        type: [ClinicalNoteSummaryDto],
        isArray: true,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => ClinicalNoteSummaryDto),
    __metadata("design:type", Array)
], StudentResponseDto.prototype, "clinicalNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Incident reports (included when ?include=incidentReports is specified)',
        type: [IncidentReportSummaryDto],
        isArray: true,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => IncidentReportSummaryDto),
    __metadata("design:type", Array)
], StudentResponseDto.prototype, "incidentReports", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Record creation timestamp',
        example: '2024-09-01T08:00:00.000Z',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], StudentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Record last update timestamp',
        example: '2024-11-14T15:30:00.000Z',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], StudentResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Soft delete timestamp (null if not deleted). HIPAA compliance - audit trail for PHI.',
        example: null,
        format: 'date-time',
        nullable: true,
    }),
    __metadata("design:type", Date)
], StudentResponseDto.prototype, "deletedAt", void 0);
class StudentListResponseDto extends paginated_response_dto_1.PaginatedResponseDto {
    data;
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./student-response.dto").StudentResponseDto] } };
    }
}
exports.StudentListResponseDto = StudentListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of students for the current page',
        type: [StudentResponseDto],
        isArray: true,
    }),
    (0, class_transformer_1.Type)(() => StudentResponseDto),
    __metadata("design:type", Array)
], StudentListResponseDto.prototype, "data", void 0);
function mapStudentToResponseDto(student) {
    return {
        id: student.id,
        studentNumber: student.studentNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth,
        grade: student.grade,
        gender: student.gender,
        photo: student.photo ?? null,
        medicalRecordNum: student.medicalRecordNum ?? null,
        isActive: student.isActive,
        enrollmentDate: student.enrollmentDate,
        nurseId: student.nurseId ?? null,
        schoolId: student.schoolId ?? null,
        districtId: student.districtId ?? null,
        createdBy: student.createdBy ?? null,
        updatedBy: student.updatedBy ?? null,
        fullName: student.fullName,
        age: student.age,
        nurse: student.nurse
            ? {
                id: student.nurse.id,
                firstName: student.nurse.firstName,
                lastName: student.nurse.lastName,
                email: student.nurse.email,
                role: student.nurse.role,
            }
            : null,
        school: student.school
            ? {
                id: student.school.id,
                name: student.school.name,
                districtId: student.school.districtId,
                address: student.school.address,
            }
            : null,
        district: student.district
            ? {
                id: student.district.id,
                name: student.district.name,
                code: student.district.code,
            }
            : null,
        healthRecords: student.healthRecords
            ? student.healthRecords.map((record) => ({
                id: record.id,
                recordType: record.recordType,
                recordDate: record.recordDate,
                chiefComplaint: record.chiefComplaint ?? null,
            }))
            : null,
        academicTranscripts: student.academicTranscripts
            ? student.academicTranscripts.map((transcript) => ({
                id: transcript.id,
                academicYear: transcript.academicYear,
                grade: transcript.grade,
                gpa: transcript.gpa ?? null,
            }))
            : null,
        mentalHealthRecords: student.mentalHealthRecords
            ? student.mentalHealthRecords.map((record) => ({
                id: record.id,
                assessmentDate: record.assessmentDate,
                assessmentType: record.assessmentType ?? null,
                riskLevel: record.riskLevel ?? null,
            }))
            : null,
        appointments: student.appointments
            ? student.appointments.map((appointment) => ({
                id: appointment.id,
                appointmentDate: appointment.appointmentDate,
                appointmentType: appointment.appointmentType,
                status: appointment.status,
            }))
            : null,
        prescriptions: student.prescriptions
            ? student.prescriptions.map((prescription) => ({
                id: prescription.id,
                medicationName: prescription.medicationName,
                dosage: prescription.dosage,
                startDate: prescription.startDate,
                endDate: prescription.endDate ?? null,
            }))
            : null,
        clinicVisits: student.clinicVisits
            ? student.clinicVisits.map((visit) => ({
                id: visit.id,
                visitDate: visit.visitDate,
                reasonForVisit: visit.reasonForVisit ?? null,
                outcome: visit.outcome ?? null,
            }))
            : null,
        allergies: student.allergies
            ? student.allergies.map((allergy) => ({
                id: allergy.id,
                allergen: allergy.allergen,
                severity: allergy.severity,
                reaction: allergy.reaction ?? null,
            }))
            : null,
        chronicConditions: student.chronicConditions
            ? student.chronicConditions.map((condition) => ({
                id: condition.id,
                conditionName: condition.conditionName,
                icd10Code: condition.icd10Code ?? null,
                diagnosedDate: condition.diagnosedDate,
            }))
            : null,
        vaccinations: student.vaccinations
            ? student.vaccinations.map((vaccination) => ({
                id: vaccination.id,
                vaccineName: vaccination.vaccineName,
                administeredDate: vaccination.administeredDate,
                doseNumber: vaccination.doseNumber ?? null,
            }))
            : null,
        vitalSigns: student.vitalSigns
            ? student.vitalSigns.map((vitals) => ({
                id: vitals.id,
                recordedAt: vitals.recordedAt,
                temperature: vitals.temperature ?? null,
                bloodPressure: vitals.bloodPressure ?? null,
                heartRate: vitals.heartRate ?? null,
            }))
            : null,
        clinicalNotes: student.clinicalNotes
            ? student.clinicalNotes.map((note) => ({
                id: note.id,
                noteType: note.noteType,
                createdAt: note.createdAt,
                summary: note.summary ?? null,
            }))
            : null,
        incidentReports: student.incidentReports
            ? student.incidentReports.map((report) => ({
                id: report.id,
                incidentDate: report.incidentDate,
                incidentType: report.incidentType,
                description: report.description ?? null,
            }))
            : null,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
        deletedAt: student.deletedAt ?? null,
    };
}
function mapStudentToSummaryDto(student) {
    return {
        id: student.id,
        studentNumber: student.studentNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        fullName: student.fullName,
        grade: student.grade,
        dateOfBirth: student.dateOfBirth,
        age: student.age,
        isActive: student.isActive,
    };
}
//# sourceMappingURL=student-response.dto.js.map