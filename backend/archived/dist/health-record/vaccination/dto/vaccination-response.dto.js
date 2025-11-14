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
exports.VaccinationSummaryListResponseDto = exports.VaccinationListResponseDto = exports.ImmunizationRecordDto = exports.CDCScheduleComplianceDto = exports.VaccinationResponseDto = exports.VaccinationSummaryDto = exports.VaccinationAdministeredByDto = exports.VaccinationStudentSummaryDto = void 0;
exports.mapToVaccinationResponseDto = mapToVaccinationResponseDto;
exports.mapToVaccinationSummaryDto = mapToVaccinationSummaryDto;
exports.mapToVaccinationListResponseDto = mapToVaccinationListResponseDto;
exports.mapToVaccinationSummaryListResponseDto = mapToVaccinationSummaryListResponseDto;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const vaccination_model_1 = require("../../../database/models/vaccination.model");
const paginated_response_dto_1 = require("../../../common/dto/paginated-response.dto");
let VaccinationStudentSummaryDto = class VaccinationStudentSummaryDto {
    id;
    firstName;
    lastName;
    dateOfBirth;
    grade;
    studentNumber;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, dateOfBirth: { required: false, type: () => Date }, grade: { required: false, type: () => String }, studentNumber: { required: false, type: () => String } };
    }
};
exports.VaccinationStudentSummaryDto = VaccinationStudentSummaryDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], VaccinationStudentSummaryDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student first name',
        example: 'Emily',
    }),
    __metadata("design:type", String)
], VaccinationStudentSummaryDto.prototype, "firstName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student last name',
        example: 'Johnson',
    }),
    __metadata("design:type", String)
], VaccinationStudentSummaryDto.prototype, "lastName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student date of birth',
        example: '2015-08-15',
        type: 'string',
        format: 'date',
    }),
    __metadata("design:type", Date)
], VaccinationStudentSummaryDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student grade level',
        example: '3',
    }),
    __metadata("design:type", String)
], VaccinationStudentSummaryDto.prototype, "grade", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student number or ID',
        example: 'STU-2024-001234',
    }),
    __metadata("design:type", String)
], VaccinationStudentSummaryDto.prototype, "studentNumber", void 0);
exports.VaccinationStudentSummaryDto = VaccinationStudentSummaryDto = __decorate([
    (0, class_transformer_1.Exclude)()
], VaccinationStudentSummaryDto);
let VaccinationAdministeredByDto = class VaccinationAdministeredByDto {
    id;
    firstName;
    lastName;
    role;
    email;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, role: { required: false, type: () => String }, email: { required: false, type: () => String } };
    }
};
exports.VaccinationAdministeredByDto = VaccinationAdministeredByDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'User unique identifier',
        example: '650e8400-e29b-41d4-a716-446655440001',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], VaccinationAdministeredByDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Healthcare provider first name',
        example: 'Sarah',
    }),
    __metadata("design:type", String)
], VaccinationAdministeredByDto.prototype, "firstName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Healthcare provider last name',
        example: 'Williams',
    }),
    __metadata("design:type", String)
], VaccinationAdministeredByDto.prototype, "lastName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Provider role or credentials',
        example: 'Registered Nurse',
    }),
    __metadata("design:type", String)
], VaccinationAdministeredByDto.prototype, "role", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Provider email',
        example: 'sarah.williams@schoolhealth.edu',
    }),
    __metadata("design:type", String)
], VaccinationAdministeredByDto.prototype, "email", void 0);
exports.VaccinationAdministeredByDto = VaccinationAdministeredByDto = __decorate([
    (0, class_transformer_1.Exclude)()
], VaccinationAdministeredByDto);
let VaccinationSummaryDto = class VaccinationSummaryDto {
    id;
    studentId;
    vaccineName;
    vaccineType;
    administrationDate;
    doseNumber;
    totalDoses;
    seriesComplete;
    complianceStatus;
    nextDueDate;
    isOverdue;
    createdAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, vaccineName: { required: true, type: () => String }, vaccineType: { required: false, enum: require("../../../database/models/vaccination.model").VaccineType }, administrationDate: { required: true, type: () => Date }, doseNumber: { required: false, type: () => Number }, totalDoses: { required: false, type: () => Number }, seriesComplete: { required: true, type: () => Boolean }, complianceStatus: { required: true, enum: require("../../../database/models/vaccination.model").ComplianceStatus }, nextDueDate: { required: false, type: () => Date, nullable: true }, isOverdue: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date } };
    }
};
exports.VaccinationSummaryDto = VaccinationSummaryDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Vaccination record unique identifier',
        example: '750e8400-e29b-41d4-a716-446655440002',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], VaccinationSummaryDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], VaccinationSummaryDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Vaccine name',
        example: 'COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose',
    }),
    __metadata("design:type", String)
], VaccinationSummaryDto.prototype, "vaccineName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vaccine type classification',
        enum: vaccination_model_1.VaccineType,
        example: vaccination_model_1.VaccineType.COVID_19,
    }),
    __metadata("design:type", String)
], VaccinationSummaryDto.prototype, "vaccineType", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Date vaccine was administered',
        example: '2024-10-15T14:30:00Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], VaccinationSummaryDto.prototype, "administrationDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dose number in vaccination series (e.g., 1 for first dose, 2 for second)',
        example: 1,
        minimum: 1,
    }),
    __metadata("design:type", Number)
], VaccinationSummaryDto.prototype, "doseNumber", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total number of doses required in series',
        example: 2,
        minimum: 1,
    }),
    __metadata("design:type", Number)
], VaccinationSummaryDto.prototype, "totalDoses", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether the vaccination series is complete',
        example: false,
    }),
    __metadata("design:type", Boolean)
], VaccinationSummaryDto.prototype, "seriesComplete", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Compliance status for school requirements',
        enum: vaccination_model_1.ComplianceStatus,
        example: vaccination_model_1.ComplianceStatus.COMPLIANT,
    }),
    __metadata("design:type", String)
], VaccinationSummaryDto.prototype, "complianceStatus", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Next dose due date for series completion',
        example: '2025-01-15',
        type: 'string',
        format: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], VaccinationSummaryDto.prototype, "nextDueDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether next dose is overdue',
        example: false,
    }),
    __metadata("design:type", Boolean)
], VaccinationSummaryDto.prototype, "isOverdue", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Record created timestamp',
        example: '2024-10-15T14:35:00Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], VaccinationSummaryDto.prototype, "createdAt", void 0);
exports.VaccinationSummaryDto = VaccinationSummaryDto = __decorate([
    (0, class_transformer_1.Exclude)()
], VaccinationSummaryDto);
let VaccinationResponseDto = class VaccinationResponseDto {
    id;
    studentId;
    healthRecordId;
    vaccineName;
    vaccineType;
    manufacturer;
    lotNumber;
    cvxCode;
    ndcCode;
    doseNumber;
    totalDoses;
    seriesComplete;
    seriesCompletionPercentage;
    administrationDate;
    administeredBy;
    administeredByRole;
    facility;
    siteOfAdministration;
    routeOfAdministration;
    dosageAmount;
    expirationDate;
    nextDueDate;
    daysUntilNextDose;
    isOverdue;
    reactions;
    adverseEvents;
    exemptionStatus;
    exemptionReason;
    exemptionDocument;
    complianceStatus;
    vfcEligibility;
    visProvided;
    visDate;
    consentObtained;
    consentBy;
    notes;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
    deletedAt;
    student;
    administeredByUser;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, healthRecordId: { required: false, type: () => String, nullable: true }, vaccineName: { required: true, type: () => String }, vaccineType: { required: false, enum: require("../../../database/models/vaccination.model").VaccineType }, manufacturer: { required: false, type: () => String }, lotNumber: { required: false, type: () => String }, cvxCode: { required: false, type: () => String }, ndcCode: { required: false, type: () => String }, doseNumber: { required: false, type: () => Number }, totalDoses: { required: false, type: () => Number }, seriesComplete: { required: true, type: () => Boolean }, seriesCompletionPercentage: { required: false, type: () => Number, nullable: true }, administrationDate: { required: true, type: () => Date }, administeredBy: { required: true, type: () => String }, administeredByRole: { required: false, type: () => String }, facility: { required: false, type: () => String }, siteOfAdministration: { required: false, enum: require("../../../database/models/vaccination.model").SiteOfAdministration }, routeOfAdministration: { required: false, enum: require("../../../database/models/vaccination.model").RouteOfAdministration }, dosageAmount: { required: false, type: () => String }, expirationDate: { required: false, type: () => Date, nullable: true }, nextDueDate: { required: false, type: () => Date, nullable: true }, daysUntilNextDose: { required: false, type: () => Number, nullable: true }, isOverdue: { required: true, type: () => Boolean }, reactions: { required: false, type: () => String }, adverseEvents: { required: false, type: () => Object }, exemptionStatus: { required: true, type: () => Boolean }, exemptionReason: { required: false, type: () => String }, exemptionDocument: { required: false, type: () => String }, complianceStatus: { required: true, enum: require("../../../database/models/vaccination.model").ComplianceStatus }, vfcEligibility: { required: true, type: () => Boolean }, visProvided: { required: true, type: () => Boolean }, visDate: { required: false, type: () => Date, nullable: true }, consentObtained: { required: true, type: () => Boolean }, consentBy: { required: false, type: () => String }, notes: { required: false, type: () => String }, createdBy: { required: false, type: () => String }, updatedBy: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, deletedAt: { required: false, type: () => Date, nullable: true }, student: { required: false, type: () => require("./vaccination-response.dto").VaccinationStudentSummaryDto }, administeredByUser: { required: false, type: () => require("./vaccination-response.dto").VaccinationAdministeredByDto } };
    }
};
exports.VaccinationResponseDto = VaccinationResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Vaccination record unique identifier',
        example: '750e8400-e29b-41d4-a716-446655440002',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Health record unique identifier if vaccination was part of clinic visit',
        example: '850e8400-e29b-41d4-a716-446655440003',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "healthRecordId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Vaccine name (full descriptive name)',
        example: 'COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose',
        maxLength: 200,
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "vaccineName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vaccine type classification',
        enum: vaccination_model_1.VaccineType,
        example: vaccination_model_1.VaccineType.COVID_19,
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "vaccineType", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vaccine manufacturer',
        example: 'Pfizer-BioNTech',
        maxLength: 100,
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "manufacturer", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vaccine lot number for recall tracking',
        example: 'EK9231',
        maxLength: 50,
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "lotNumber", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'CDC CVX code (Vaccine Administered code) - standardized vaccine identifier. Examples: 03 (MMR), 08 (Hep B), 20 (DTaP), 21 (Varicella), 208 (COVID-19 Pfizer)',
        example: '208',
        maxLength: 10,
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "cvxCode", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'NDC code (National Drug Code) - identifies specific vaccine product',
        example: '59267-1000-01',
        maxLength: 20,
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "ndcCode", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dose number in vaccination series (e.g., 1 for first dose, 2 for second)',
        example: 1,
        minimum: 1,
    }),
    __metadata("design:type", Number)
], VaccinationResponseDto.prototype, "doseNumber", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total number of doses required in series',
        example: 2,
        minimum: 1,
    }),
    __metadata("design:type", Number)
], VaccinationResponseDto.prototype, "totalDoses", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether the vaccination series is complete',
        example: false,
    }),
    __metadata("design:type", Boolean)
], VaccinationResponseDto.prototype, "seriesComplete", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Series completion percentage (0-100)',
        example: 50,
        minimum: 0,
        maximum: 100,
        nullable: true,
    }),
    __metadata("design:type", Number)
], VaccinationResponseDto.prototype, "seriesCompletionPercentage", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Date and time vaccine was administered',
        example: '2024-10-15T14:30:00Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], VaccinationResponseDto.prototype, "administrationDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Name of person who administered vaccine',
        example: 'Sarah Williams, RN',
        maxLength: 200,
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "administeredBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Role or credentials of administrator (RN, MD, NP, PA, LPN)',
        example: 'RN',
        maxLength: 50,
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "administeredByRole", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Facility where vaccine was administered',
        example: 'Lincoln Elementary School Health Office',
        maxLength: 200,
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "facility", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Body site where vaccine was administered',
        enum: vaccination_model_1.SiteOfAdministration,
        example: vaccination_model_1.SiteOfAdministration.DELTOID_LEFT,
        enumName: 'SiteOfAdministration',
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "siteOfAdministration", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Route of administration - method by which vaccine was given',
        enum: vaccination_model_1.RouteOfAdministration,
        example: vaccination_model_1.RouteOfAdministration.INTRAMUSCULAR,
        enumName: 'RouteOfAdministration',
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "routeOfAdministration", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dosage amount administered',
        example: '0.5 mL',
        maxLength: 50,
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "dosageAmount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vaccine expiration date (for expired vaccine tracking and quality control)',
        example: '2025-12-31',
        type: 'string',
        format: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], VaccinationResponseDto.prototype, "expirationDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Next dose due date for series completion',
        example: '2025-01-15',
        type: 'string',
        format: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], VaccinationResponseDto.prototype, "nextDueDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Days until next dose (negative if overdue)',
        example: 45,
        nullable: true,
    }),
    __metadata("design:type", Number)
], VaccinationResponseDto.prototype, "daysUntilNextDose", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether next dose is overdue',
        example: false,
    }),
    __metadata("design:type", Boolean)
], VaccinationResponseDto.prototype, "isOverdue", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Any reactions to the vaccine observed',
        example: 'Mild soreness at injection site for 24 hours',
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "reactions", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Adverse events (structured data for VAERS reporting)',
        example: {
            type: 'LOCAL_REACTION',
            severity: 'MILD',
            onset: '2024-10-15T18:00:00Z',
            duration: '24 hours',
            description: 'Injection site soreness',
        },
        type: 'object',
    }),
    __metadata("design:type", Object)
], VaccinationResponseDto.prototype, "adverseEvents", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether student has medical or religious exemption for this vaccine',
        example: false,
    }),
    __metadata("design:type", Boolean)
], VaccinationResponseDto.prototype, "exemptionStatus", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for exemption if applicable',
        example: 'Medical exemption - severe allergic reaction to vaccine components',
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "exemptionReason", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Exemption document URL or file reference',
        example: 'exemptions/medical-550e8400.pdf',
        maxLength: 500,
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "exemptionDocument", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Compliance status for school requirements',
        enum: vaccination_model_1.ComplianceStatus,
        example: vaccination_model_1.ComplianceStatus.COMPLIANT,
        enumName: 'ComplianceStatus',
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "complianceStatus", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'VFC (Vaccines for Children) program eligibility - federally funded vaccine program for eligible children',
        example: false,
    }),
    __metadata("design:type", Boolean)
], VaccinationResponseDto.prototype, "vfcEligibility", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether VIS (Vaccine Information Statement) was provided to parent/guardian - required by federal law',
        example: true,
    }),
    __metadata("design:type", Boolean)
], VaccinationResponseDto.prototype, "visProvided", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date VIS was provided to parent/guardian',
        example: '2024-10-15',
        type: 'string',
        format: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], VaccinationResponseDto.prototype, "visDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether parental/guardian consent was obtained',
        example: true,
    }),
    __metadata("design:type", Boolean)
], VaccinationResponseDto.prototype, "consentObtained", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of person who provided consent (parent/guardian)',
        example: 'Jennifer Johnson (Mother)',
        maxLength: 200,
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "consentBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional clinical notes or observations',
        example: 'Patient tolerated vaccine well. No immediate adverse reactions observed.',
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "notes", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID who created this record',
        example: '650e8400-e29b-41d4-a716-446655440001',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID who last updated this record',
        example: '650e8400-e29b-41d4-a716-446655440001',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], VaccinationResponseDto.prototype, "updatedBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Record created timestamp',
        example: '2024-10-15T14:35:00Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], VaccinationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Record last updated timestamp',
        example: '2024-10-15T14:35:00Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], VaccinationResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Record soft-delete timestamp (null if not deleted)',
        example: null,
        type: 'string',
        format: 'date-time',
        nullable: true,
    }),
    __metadata("design:type", Date)
], VaccinationResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => VaccinationStudentSummaryDto),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student information',
        type: () => VaccinationStudentSummaryDto,
    }),
    __metadata("design:type", VaccinationStudentSummaryDto)
], VaccinationResponseDto.prototype, "student", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => VaccinationAdministeredByDto),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Healthcare provider who administered the vaccine',
        type: () => VaccinationAdministeredByDto,
    }),
    __metadata("design:type", VaccinationAdministeredByDto)
], VaccinationResponseDto.prototype, "administeredByUser", void 0);
exports.VaccinationResponseDto = VaccinationResponseDto = __decorate([
    (0, class_transformer_1.Exclude)()
], VaccinationResponseDto);
let CDCScheduleComplianceDto = class CDCScheduleComplianceDto {
    studentId;
    studentName;
    dateOfBirth;
    ageInMonths;
    isCompliant;
    compliancePercentage;
    missingVaccines;
    upcomingVaccines;
    completeVaccines;
    exemptedVaccines;
    nextAppointmentRecommended;
    reportGeneratedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, studentName: { required: true, type: () => String }, dateOfBirth: { required: false, type: () => Date }, ageInMonths: { required: true, type: () => Number }, isCompliant: { required: true, type: () => Boolean }, compliancePercentage: { required: true, type: () => Number }, missingVaccines: { required: true }, upcomingVaccines: { required: true }, completeVaccines: { required: true }, exemptedVaccines: { required: true }, nextAppointmentRecommended: { required: false, type: () => Date, nullable: true }, reportGeneratedAt: { required: true, type: () => Date } };
    }
};
exports.CDCScheduleComplianceDto = CDCScheduleComplianceDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], CDCScheduleComplianceDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student full name',
        example: 'Emily Johnson',
    }),
    __metadata("design:type", String)
], CDCScheduleComplianceDto.prototype, "studentName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student date of birth',
        example: '2015-08-15',
        type: 'string',
        format: 'date',
    }),
    __metadata("design:type", Date)
], CDCScheduleComplianceDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student age in months (for CDC schedule calculations)',
        example: 110,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], CDCScheduleComplianceDto.prototype, "ageInMonths", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Overall compliance status',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CDCScheduleComplianceDto.prototype, "isCompliant", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Overall compliance percentage (0-100)',
        example: 85,
        minimum: 0,
        maximum: 100,
    }),
    __metadata("design:type", Number)
], CDCScheduleComplianceDto.prototype, "compliancePercentage", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'List of vaccines that are missing or incomplete',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                vaccineName: { type: 'string', example: 'DTaP' },
                vaccineType: { type: 'string', enum: Object.values(vaccination_model_1.VaccineType), example: vaccination_model_1.VaccineType.DTAP },
                requiredDoses: { type: 'number', example: 5 },
                completedDoses: { type: 'number', example: 3 },
                nextDoseNumber: { type: 'number', example: 4 },
                recommendedDueDate: { type: 'string', format: 'date', example: '2024-12-15' },
                status: { type: 'string', enum: ['NOT_STARTED', 'IN_PROGRESS', 'OVERDUE'], example: 'IN_PROGRESS' },
                daysOverdue: { type: 'number', example: 0, nullable: true },
            },
        },
    }),
    __metadata("design:type", Array)
], CDCScheduleComplianceDto.prototype, "missingVaccines", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'List of vaccines with upcoming doses due',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                vaccineName: { type: 'string', example: 'Hepatitis B' },
                vaccineType: { type: 'string', enum: Object.values(vaccination_model_1.VaccineType), example: vaccination_model_1.VaccineType.HEPATITIS_B },
                nextDoseNumber: { type: 'number', example: 3 },
                totalDoses: { type: 'number', example: 3 },
                dueDate: { type: 'string', format: 'date', example: '2024-12-01' },
                daysUntilDue: { type: 'number', example: 30 },
            },
        },
    }),
    __metadata("design:type", Array)
], CDCScheduleComplianceDto.prototype, "upcomingVaccines", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'List of vaccines with completed series',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                vaccineName: { type: 'string', example: 'MMR' },
                vaccineType: { type: 'string', enum: Object.values(vaccination_model_1.VaccineType), example: vaccination_model_1.VaccineType.MMR },
                requiredDoses: { type: 'number', example: 2 },
                completedDoses: { type: 'number', example: 2 },
                lastAdministered: { type: 'string', format: 'date', example: '2023-06-15' },
            },
        },
    }),
    __metadata("design:type", Array)
], CDCScheduleComplianceDto.prototype, "completeVaccines", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'List of vaccines with exemptions',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                vaccineName: { type: 'string', example: 'Varicella' },
                vaccineType: { type: 'string', enum: Object.values(vaccination_model_1.VaccineType), example: vaccination_model_1.VaccineType.VARICELLA },
                exemptionReason: { type: 'string', example: 'Medical exemption - severe allergic reaction' },
                exemptionType: { type: 'string', enum: ['MEDICAL', 'RELIGIOUS', 'PHILOSOPHICAL'], example: 'MEDICAL' },
                exemptionDate: { type: 'string', format: 'date', example: '2024-01-15' },
            },
        },
    }),
    __metadata("design:type", Array)
], CDCScheduleComplianceDto.prototype, "exemptedVaccines", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Next recommended appointment date for vaccinations',
        example: '2024-12-01',
        type: 'string',
        format: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], CDCScheduleComplianceDto.prototype, "nextAppointmentRecommended", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Compliance report generation timestamp',
        example: '2024-11-14T10:00:00Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], CDCScheduleComplianceDto.prototype, "reportGeneratedAt", void 0);
exports.CDCScheduleComplianceDto = CDCScheduleComplianceDto = __decorate([
    (0, class_transformer_1.Exclude)()
], CDCScheduleComplianceDto);
let ImmunizationRecordDto = class ImmunizationRecordDto {
    studentId;
    student;
    totalVaccinations;
    completedSeries;
    incompleteSeries;
    overdueCount;
    overallComplianceStatus;
    compliancePercentage;
    vaccinations;
    cdcCompliance;
    hasExemptions;
    exemptionCount;
    lastVaccinationDate;
    nextVaccinationDue;
    generatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, student: { required: true, type: () => require("./vaccination-response.dto").VaccinationStudentSummaryDto }, totalVaccinations: { required: true, type: () => Number }, completedSeries: { required: true, type: () => Number }, incompleteSeries: { required: true, type: () => Number }, overdueCount: { required: true, type: () => Number }, overallComplianceStatus: { required: true, enum: require("../../../database/models/vaccination.model").ComplianceStatus }, compliancePercentage: { required: true, type: () => Number }, vaccinations: { required: true, type: () => [require("./vaccination-response.dto").VaccinationResponseDto] }, cdcCompliance: { required: false, type: () => require("./vaccination-response.dto").CDCScheduleComplianceDto }, hasExemptions: { required: true, type: () => Boolean }, exemptionCount: { required: true, type: () => Number }, lastVaccinationDate: { required: false, type: () => Date, nullable: true }, nextVaccinationDue: { required: false, type: () => Date, nullable: true }, generatedAt: { required: true, type: () => Date } };
    }
};
exports.ImmunizationRecordDto = ImmunizationRecordDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], ImmunizationRecordDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => VaccinationStudentSummaryDto),
    (0, swagger_1.ApiProperty)({
        description: 'Student information',
        type: () => VaccinationStudentSummaryDto,
    }),
    __metadata("design:type", VaccinationStudentSummaryDto)
], ImmunizationRecordDto.prototype, "student", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Total number of vaccination records',
        example: 15,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], ImmunizationRecordDto.prototype, "totalVaccinations", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Total number of completed vaccine series',
        example: 8,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], ImmunizationRecordDto.prototype, "completedSeries", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Total number of incomplete vaccine series',
        example: 2,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], ImmunizationRecordDto.prototype, "incompleteSeries", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Total number of overdue vaccinations',
        example: 1,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], ImmunizationRecordDto.prototype, "overdueCount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Overall compliance status',
        enum: vaccination_model_1.ComplianceStatus,
        example: vaccination_model_1.ComplianceStatus.PARTIALLY_COMPLIANT,
    }),
    __metadata("design:type", String)
], ImmunizationRecordDto.prototype, "overallComplianceStatus", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Compliance percentage (0-100)',
        example: 85,
        minimum: 0,
        maximum: 100,
    }),
    __metadata("design:type", Number)
], ImmunizationRecordDto.prototype, "compliancePercentage", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => VaccinationResponseDto),
    (0, swagger_1.ApiProperty)({
        description: 'All vaccination records for the student',
        type: [VaccinationResponseDto],
        isArray: true,
    }),
    __metadata("design:type", Array)
], ImmunizationRecordDto.prototype, "vaccinations", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => CDCScheduleComplianceDto),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'CDC schedule compliance details',
        type: () => CDCScheduleComplianceDto,
    }),
    __metadata("design:type", CDCScheduleComplianceDto)
], ImmunizationRecordDto.prototype, "cdcCompliance", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether student has any exemptions',
        example: false,
    }),
    __metadata("design:type", Boolean)
], ImmunizationRecordDto.prototype, "hasExemptions", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Total number of exemptions',
        example: 0,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], ImmunizationRecordDto.prototype, "exemptionCount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last vaccination date',
        example: '2024-10-15',
        type: 'string',
        format: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], ImmunizationRecordDto.prototype, "lastVaccinationDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Next recommended vaccination date',
        example: '2025-01-15',
        type: 'string',
        format: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], ImmunizationRecordDto.prototype, "nextVaccinationDue", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Record generated timestamp',
        example: '2024-11-14T10:00:00Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], ImmunizationRecordDto.prototype, "generatedAt", void 0);
exports.ImmunizationRecordDto = ImmunizationRecordDto = __decorate([
    (0, class_transformer_1.Exclude)()
], ImmunizationRecordDto);
class VaccinationListResponseDto extends paginated_response_dto_1.PaginatedResponseDto {
    data;
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./vaccination-response.dto").VaccinationResponseDto] } };
    }
}
exports.VaccinationListResponseDto = VaccinationListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of vaccination records for the current page',
        type: [VaccinationResponseDto],
        isArray: true,
    }),
    (0, class_transformer_1.Type)(() => VaccinationResponseDto),
    __metadata("design:type", Array)
], VaccinationListResponseDto.prototype, "data", void 0);
class VaccinationSummaryListResponseDto extends paginated_response_dto_1.PaginatedResponseDto {
    data;
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./vaccination-response.dto").VaccinationSummaryDto] } };
    }
}
exports.VaccinationSummaryListResponseDto = VaccinationSummaryListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of vaccination summary records for the current page',
        type: [VaccinationSummaryDto],
        isArray: true,
    }),
    (0, class_transformer_1.Type)(() => VaccinationSummaryDto),
    __metadata("design:type", Array)
], VaccinationSummaryListResponseDto.prototype, "data", void 0);
function mapToVaccinationResponseDto(vaccination) {
    const dto = {
        id: vaccination.id,
        studentId: vaccination.studentId,
        healthRecordId: vaccination.healthRecordId || null,
        vaccineName: vaccination.vaccineName,
        vaccineType: vaccination.vaccineType,
        manufacturer: vaccination.manufacturer,
        lotNumber: vaccination.lotNumber,
        cvxCode: vaccination.cvxCode,
        ndcCode: vaccination.ndcCode,
        doseNumber: vaccination.doseNumber,
        totalDoses: vaccination.totalDoses,
        seriesComplete: vaccination.seriesComplete,
        seriesCompletionPercentage: vaccination.getSeriesCompletionPercentage(),
        administrationDate: vaccination.administrationDate,
        administeredBy: vaccination.administeredBy,
        administeredByRole: vaccination.administeredByRole,
        facility: vaccination.facility,
        siteOfAdministration: vaccination.siteOfAdministration,
        routeOfAdministration: vaccination.routeOfAdministration,
        dosageAmount: vaccination.dosageAmount,
        expirationDate: vaccination.expirationDate || null,
        nextDueDate: vaccination.nextDueDate || null,
        daysUntilNextDose: vaccination.getDaysUntilNextDose(),
        isOverdue: vaccination.isOverdue(),
        reactions: vaccination.reactions,
        adverseEvents: vaccination.adverseEvents,
        exemptionStatus: vaccination.exemptionStatus,
        exemptionReason: vaccination.exemptionReason,
        exemptionDocument: vaccination.exemptionDocument,
        complianceStatus: vaccination.complianceStatus,
        vfcEligibility: vaccination.vfcEligibility,
        visProvided: vaccination.visProvided,
        visDate: vaccination.visDate || null,
        consentObtained: vaccination.consentObtained,
        consentBy: vaccination.consentBy,
        notes: vaccination.notes,
        createdBy: vaccination.createdBy,
        updatedBy: vaccination.updatedBy,
        createdAt: vaccination.createdAt,
        updatedAt: vaccination.updatedAt,
        deletedAt: vaccination.deletedAt || null,
    };
    if (vaccination.student) {
        dto.student = {
            id: vaccination.student.id,
            firstName: vaccination.student.firstName,
            lastName: vaccination.student.lastName,
            dateOfBirth: vaccination.student.dateOfBirth,
            grade: vaccination.student.grade,
            studentNumber: vaccination.student.studentNumber,
        };
    }
    if (vaccination.administeredByUser) {
        dto.administeredByUser = {
            id: vaccination.administeredByUser.id,
            firstName: vaccination.administeredByUser.firstName,
            lastName: vaccination.administeredByUser.lastName,
            role: vaccination.administeredByUser.role,
            email: vaccination.administeredByUser.email,
        };
    }
    return dto;
}
function mapToVaccinationSummaryDto(vaccination) {
    return {
        id: vaccination.id,
        studentId: vaccination.studentId,
        vaccineName: vaccination.vaccineName,
        vaccineType: vaccination.vaccineType,
        administrationDate: vaccination.administrationDate,
        doseNumber: vaccination.doseNumber,
        totalDoses: vaccination.totalDoses,
        seriesComplete: vaccination.seriesComplete,
        complianceStatus: vaccination.complianceStatus,
        nextDueDate: vaccination.nextDueDate || null,
        isOverdue: vaccination.isOverdue(),
        createdAt: vaccination.createdAt,
    };
}
function mapToVaccinationListResponseDto(vaccinations, total, page, limit) {
    return paginated_response_dto_1.PaginatedResponseDto.create({
        data: vaccinations.map(mapToVaccinationResponseDto),
        page,
        limit,
        total,
    });
}
function mapToVaccinationSummaryListResponseDto(vaccinations, total, page, limit) {
    return paginated_response_dto_1.PaginatedResponseDto.create({
        data: vaccinations.map(mapToVaccinationSummaryDto),
        page,
        limit,
        total,
    });
}
//# sourceMappingURL=vaccination-response.dto.js.map