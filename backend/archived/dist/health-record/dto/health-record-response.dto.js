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
exports.HealthRecordListResponseDto = exports.HealthSummaryDto = exports.HealthRecordSummaryDto = exports.HealthRecordResponseDto = exports.StudentSummaryDto = exports.HealthRecordType = void 0;
exports.mapHealthRecordToResponseDto = mapHealthRecordToResponseDto;
exports.mapHealthRecordToSummaryDto = mapHealthRecordToSummaryDto;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const paginated_response_dto_1 = require("../../common/dto/paginated-response.dto");
var HealthRecordType;
(function (HealthRecordType) {
    HealthRecordType["CHECKUP"] = "CHECKUP";
    HealthRecordType["VACCINATION"] = "VACCINATION";
    HealthRecordType["ILLNESS"] = "ILLNESS";
    HealthRecordType["INJURY"] = "INJURY";
    HealthRecordType["SCREENING"] = "SCREENING";
    HealthRecordType["PHYSICAL_EXAM"] = "PHYSICAL_EXAM";
    HealthRecordType["MENTAL_HEALTH"] = "MENTAL_HEALTH";
    HealthRecordType["DENTAL"] = "DENTAL";
    HealthRecordType["VISION"] = "VISION";
    HealthRecordType["HEARING"] = "HEARING";
    HealthRecordType["EXAMINATION"] = "EXAMINATION";
    HealthRecordType["ALLERGY_DOCUMENTATION"] = "ALLERGY_DOCUMENTATION";
    HealthRecordType["CHRONIC_CONDITION_REVIEW"] = "CHRONIC_CONDITION_REVIEW";
    HealthRecordType["GROWTH_ASSESSMENT"] = "GROWTH_ASSESSMENT";
    HealthRecordType["VITAL_SIGNS_CHECK"] = "VITAL_SIGNS_CHECK";
    HealthRecordType["EMERGENCY_VISIT"] = "EMERGENCY_VISIT";
    HealthRecordType["FOLLOW_UP"] = "FOLLOW_UP";
    HealthRecordType["CONSULTATION"] = "CONSULTATION";
    HealthRecordType["DIAGNOSTIC_TEST"] = "DIAGNOSTIC_TEST";
    HealthRecordType["PROCEDURE"] = "PROCEDURE";
    HealthRecordType["HOSPITALIZATION"] = "HOSPITALIZATION";
    HealthRecordType["SURGERY"] = "SURGERY";
    HealthRecordType["COUNSELING"] = "COUNSELING";
    HealthRecordType["THERAPY"] = "THERAPY";
    HealthRecordType["NUTRITION"] = "NUTRITION";
    HealthRecordType["MEDICATION_REVIEW"] = "MEDICATION_REVIEW";
    HealthRecordType["IMMUNIZATION"] = "IMMUNIZATION";
    HealthRecordType["LAB_RESULT"] = "LAB_RESULT";
    HealthRecordType["RADIOLOGY"] = "RADIOLOGY";
    HealthRecordType["OTHER"] = "OTHER";
})(HealthRecordType || (exports.HealthRecordType = HealthRecordType = {}));
class StudentSummaryDto {
    id;
    firstName;
    lastName;
    dateOfBirth;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String, description: "Unique identifier for the student\n@type {string}\n@format uuid" }, firstName: { required: true, type: () => String, description: "Student's first name\n@type {string}" }, lastName: { required: true, type: () => String, description: "Student's last name\n@type {string}" }, dateOfBirth: { required: false, type: () => Date, description: "Student's date of birth (for identity verification)\n@type {Date}" } };
    }
}
exports.StudentSummaryDto = StudentSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
        type: String,
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Student's first name",
        example: 'Emma',
        type: String,
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Student's last name",
        example: 'Johnson',
        type: String,
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Student's date of birth (PHI - Protected Health Information)",
        example: '2010-05-15',
        type: Date,
        format: 'date',
    }),
    __metadata("design:type", Date)
], StudentSummaryDto.prototype, "dateOfBirth", void 0);
class HealthRecordResponseDto {
    id;
    studentId;
    recordType;
    title;
    description;
    recordDate;
    provider;
    providerNpi;
    facility;
    facilityNpi;
    diagnosis;
    diagnosisCode;
    treatment;
    followUpRequired;
    followUpDate;
    followUpCompleted;
    attachments;
    metadata;
    isConfidential;
    notes;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
    student;
    isFollowUpOverdue;
    daysUntilFollowUp;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String, description: "Unique identifier for the health record\n@type {string}\n@format uuid" }, studentId: { required: true, type: () => String, description: "Reference to the student this health record belongs to\n@type {string}\n@format uuid" }, recordType: { required: true, description: "Type of health record\n@type {HealthRecordType}\n@enum {HealthRecordType}", enum: require("./health-record-response.dto").HealthRecordType }, title: { required: true, type: () => String, description: "Brief title or summary of the health record\n@type {string}\n@maxLength 200" }, description: { required: true, type: () => String, description: "Detailed description of the health record\n@type {string}" }, recordDate: { required: true, type: () => Date, description: "Date when the health record or visit occurred\n@type {Date}" }, provider: { required: false, type: () => String, description: "Name of the healthcare provider\n@type {string}\n@optional" }, providerNpi: { required: false, type: () => String, description: "National Provider Identifier for the healthcare provider\n\n**Format:** 10-digit number assigned by CMS\n**Validation:** Must match pattern /^\\d{10}$/\n\n@type {string}\n@optional\n@pattern ^\\d{10}$" }, facility: { required: false, type: () => String, description: "Name of the healthcare facility or location\n@type {string}\n@optional" }, facilityNpi: { required: false, type: () => String, description: "National Provider Identifier for the healthcare facility\n\n**Format:** 10-digit number assigned by CMS\n**Validation:** Must match pattern /^\\d{10}$/\n\n@type {string}\n@optional\n@pattern ^\\d{10}$" }, diagnosis: { required: false, type: () => String, description: "Clinical diagnosis description\n@type {string}\n@optional" }, diagnosisCode: { required: false, type: () => String, description: "ICD-10 diagnosis code\n\n**Format:** One letter (A-Z) followed by 2 digits, with optional decimal extensions\n**Pattern:** /^[A-Z]\\d{2}(\\.\\d{1,4})?$/\n**Examples:**\n- J06.9 - Acute upper respiratory infection, unspecified\n- E11.9 - Type 2 diabetes mellitus without complications\n- I10 - Essential (primary) hypertension\n\n@type {string}\n@optional\n@pattern ^[A-Z]\\d{2}(\\.\\d{1,4})?$" }, treatment: { required: false, type: () => String, description: "Treatment provided or prescribed\n@type {string}\n@optional" }, followUpRequired: { required: true, type: () => Boolean, description: "Indicates if follow-up care is required\n@type {boolean}\n@default false" }, followUpDate: { required: false, type: () => Date, description: "Scheduled date for follow-up care\n\n**Validation:** Must be after recordDate\n**Required when:** followUpRequired is true\n\n@type {Date}\n@optional" }, followUpCompleted: { required: true, type: () => Boolean, description: "Indicates if the follow-up has been completed\n@type {boolean}\n@default false" }, attachments: { required: true, type: () => [String], description: "Array of attachment file paths or URLs\n\n**Security:** Ensure proper access controls on attachment storage\n**Privacy:** May contain PHI (lab reports, images, documents)\n\n@type {string[]}" }, metadata: { required: false, type: () => Object, description: "Additional structured metadata\n\n**Usage:** Store structured clinical data, custom fields, or integration data\n**Format:** JSON object with flexible schema\n\n@type {Record<string, any>}\n@optional" }, isConfidential: { required: true, type: () => Boolean, description: "HIPAA confidentiality flag\n\n**Purpose:** Mark highly sensitive records requiring heightened access controls\n**Use Cases:**\n- Mental health treatment\n- Substance abuse treatment\n- Sexual health\n- HIV/AIDS status\n- Domestic violence\n\n**Access Control:** Implement stricter role-based access when true\n\n@type {boolean}\n@default false" }, notes: { required: false, type: () => String, description: "Additional clinical notes\n\n**Purpose:** Free-form clinical documentation\n**PHI Warning:** All notes are Protected Health Information\n\n@type {string}\n@optional" }, createdBy: { required: false, type: () => String, description: "User ID of the record creator\n\n**Audit Trail:** Track who created the health record\n**HIPAA:** Part of required audit logging\n\n@type {string}\n@optional\n@format uuid" }, updatedBy: { required: false, type: () => String, description: "User ID of the last updater\n\n**Audit Trail:** Track who last modified the health record\n**HIPAA:** Part of required audit logging\n\n@type {string}\n@optional\n@format uuid" }, createdAt: { required: true, type: () => Date, description: "Timestamp when the record was created\n@type {Date}" }, updatedAt: { required: true, type: () => Date, description: "Timestamp when the record was last updated\n@type {Date}" }, student: { required: false, type: () => require("./health-record-response.dto").StudentSummaryDto, description: "Associated student information\n\n**Included when:** Sequelize query includes Student association\n**Privacy:** Only include when user has authorization\n\n@type {StudentSummaryDto}\n@optional" }, isFollowUpOverdue: { required: false, type: () => Boolean, description: "Virtual/computed field: Is follow-up overdue?\n\n**Computation Logic:**\n- Returns false if followUpRequired is false\n- Returns false if followUpCompleted is true\n- Returns false if followUpDate is null\n- Returns true if current date > followUpDate\n\n**Use Case:** Alert notifications, dashboard widgets, overdue reports\n\n@type {boolean}" }, daysUntilFollowUp: { required: false, type: () => Number, nullable: true, description: "Virtual/computed field: Days until follow-up (negative if overdue)\n\n**Computation Logic:**\n- Returns null if followUpRequired is false\n- Returns null if followUpCompleted is true\n- Returns null if followUpDate is null\n- Returns positive number for days remaining\n- Returns negative number for days overdue\n\n**Use Case:** Sort by urgency, prioritize follow-ups, calculate metrics\n\n@type {number}\n@optional" } };
    }
}
exports.HealthRecordResponseDto = HealthRecordResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Health record unique identifier (UUID)',
        example: '987fcdeb-51a2-4321-b9c8-123456789abc',
        format: 'uuid',
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier (UUID) - Foreign key reference',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of health record entry',
        enum: HealthRecordType,
        example: HealthRecordType.CHECKUP,
        enumName: 'HealthRecordType',
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "recordType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Brief title or summary of the health record (max 200 characters)',
        example: 'Annual Physical Examination',
        maxLength: 200,
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed description of the health encounter, findings, and observations',
        example: 'Student presented for annual physical examination. General health assessment performed including growth measurements, vital signs, and review of systems.',
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of health record, visit, or encounter',
        example: '2024-10-15T14:30:00Z',
        type: Date,
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], HealthRecordResponseDto.prototype, "recordDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Healthcare provider name (physician, nurse practitioner, school nurse)',
        example: 'Dr. Sarah Mitchell, MD',
        maxLength: 200,
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'National Provider Identifier (NPI) - 10-digit unique identifier for healthcare provider. Required for insurance billing and HIPAA compliance.',
        example: '1234567890',
        pattern: '^\\d{10}$',
        minLength: 10,
        maxLength: 10,
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "providerNpi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Healthcare facility name (hospital, clinic, school health office)',
        example: 'Lincoln Elementary School Health Office',
        maxLength: 200,
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "facility", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Facility National Provider Identifier (NPI) - 10-digit unique identifier for healthcare organization. Required for institutional billing.',
        example: '9876543210',
        pattern: '^\\d{10}$',
        minLength: 10,
        maxLength: 10,
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "facilityNpi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Clinical diagnosis or assessment in descriptive text form. Use diagnosisCode for standardized ICD-10 coding.',
        example: 'Acute viral upper respiratory infection',
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "diagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ICD-10 diagnosis code for standardized medical coding. Format: Letter + 2 digits + optional decimal extension (e.g., J06.9, E11.9)',
        example: 'J06.9',
        pattern: '^[A-Z]\\d{2}(\\.\\d{1,4})?$',
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "diagnosisCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Treatment, intervention, or care plan provided. Include medications, procedures, referrals, and recommendations.',
        example: 'Rest and increased fluid intake recommended. Acetaminophen 500mg as needed for fever. Return if symptoms worsen or persist beyond 7 days.',
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "treatment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Flag indicating whether follow-up care or re-evaluation is required. When true, followUpDate should be specified.',
        example: true,
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], HealthRecordResponseDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Scheduled date for follow-up visit or re-evaluation. Required when followUpRequired is true. Must be after recordDate.',
        example: '2024-10-22T14:30:00Z',
        type: Date,
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], HealthRecordResponseDto.prototype, "followUpDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Flag indicating whether the scheduled follow-up has been completed. Set to true once follow-up visit occurs.',
        example: false,
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], HealthRecordResponseDto.prototype, "followUpCompleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of file paths or URLs to attachments (lab reports, images, consent forms, medical documents). All attachments are PHI.',
        example: [
            '/uploads/health-records/lab-results-2024-10-15.pdf',
            '/uploads/health-records/consent-form-signed.pdf',
        ],
        type: [String],
        isArray: true,
        default: [],
    }),
    __metadata("design:type", Array)
], HealthRecordResponseDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Flexible JSON metadata field for storing additional structured information, custom fields, or integration data.',
        example: {
            vitalSigns: { temperature: 98.6, bloodPressure: '120/80', pulse: 72 },
            immunizationLot: 'LOT-12345',
            referralSent: true,
        },
        type: 'object',
        additionalProperties: true,
    }),
    __metadata("design:type", Object)
], HealthRecordResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HIPAA confidentiality flag for highly sensitive health information requiring heightened access controls (mental health, substance abuse, sexual health). When true, implement stricter access restrictions.',
        example: false,
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], HealthRecordResponseDto.prototype, "isConfidential", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional clinical notes, observations, or documentation not captured in other structured fields. All notes are PHI.',
        example: 'Parent notified of findings via phone. Student reports feeling much better. Will monitor for recurrence.',
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UUID of the user who created this health record. Used for audit trail and HIPAA compliance tracking.',
        example: '456e7890-e12b-34d5-a678-901234567def',
        format: 'uuid',
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UUID of the user who last updated this health record. Used for audit trail and HIPAA compliance tracking.',
        example: '456e7890-e12b-34d5-a678-901234567def',
        format: 'uuid',
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordResponseDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the health record was created in the system',
        example: '2024-10-15T14:35:00Z',
        type: Date,
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], HealthRecordResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the health record was last modified',
        example: '2024-10-15T14:35:00Z',
        type: Date,
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], HealthRecordResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student information (included when explicitly requested with associations). Only returned if user has appropriate authorization.',
        type: () => StudentSummaryDto,
    }),
    (0, class_transformer_1.Type)(() => StudentSummaryDto),
    __metadata("design:type", StudentSummaryDto)
], HealthRecordResponseDto.prototype, "student", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Computed field indicating if the follow-up appointment is overdue. True when followUpRequired=true, followUpCompleted=false, and current date > followUpDate.',
        example: false,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], HealthRecordResponseDto.prototype, "isFollowUpOverdue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Computed field showing days until follow-up appointment. Positive values indicate future appointments, negative values indicate overdue days. Null if not applicable.',
        example: 7,
        type: Number,
    }),
    __metadata("design:type", Number)
], HealthRecordResponseDto.prototype, "daysUntilFollowUp", void 0);
class HealthRecordSummaryDto {
    id;
    title;
    recordType;
    recordDate;
    isConfidential;
    followUpRequired;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String, description: "Unique identifier for the health record\n@type {string}\n@format uuid" }, title: { required: true, type: () => String, description: "Brief title or summary\n@type {string}" }, recordType: { required: true, description: "Type of health record\n@type {HealthRecordType}", enum: require("./health-record-response.dto").HealthRecordType }, recordDate: { required: true, type: () => Date, description: "Date of the health record\n@type {Date}" }, isConfidential: { required: true, type: () => Boolean, description: "HIPAA confidentiality flag\n@type {boolean}" }, followUpRequired: { required: true, type: () => Boolean, description: "Follow-up required flag\n@type {boolean}" } };
    }
}
exports.HealthRecordSummaryDto = HealthRecordSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Health record unique identifier (UUID)',
        example: '987fcdeb-51a2-4321-b9c8-123456789abc',
        format: 'uuid',
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Brief title or summary of the health record',
        example: 'Annual Physical Examination',
        type: String,
    }),
    __metadata("design:type", String)
], HealthRecordSummaryDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of health record entry',
        enum: HealthRecordType,
        example: HealthRecordType.CHECKUP,
    }),
    __metadata("design:type", String)
], HealthRecordSummaryDto.prototype, "recordType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of health record or visit',
        example: '2024-10-15T14:30:00Z',
        type: Date,
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], HealthRecordSummaryDto.prototype, "recordDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Confidentiality flag indicating heightened sensitivity requiring stricter access controls',
        example: false,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], HealthRecordSummaryDto.prototype, "isConfidential", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if follow-up care is required',
        example: false,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], HealthRecordSummaryDto.prototype, "followUpRequired", void 0);
class HealthSummaryDto {
    studentId;
    totalRecords;
    recordsByType;
    recentRecords;
    pendingFollowUps;
    overdueFollowUps;
    lastRecordDate;
    confidentialRecordsCount;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, description: "Student identifier\n@type {string}\n@format uuid" }, totalRecords: { required: true, type: () => Number, description: "Total count of health records for this student\n@type {number}" }, recordsByType: { required: true, type: () => Object, description: "Count of health records by type\n\n**Structure:** Object mapping HealthRecordType to count\n**Use Case:** Visualize health record distribution, identify patterns\n\n@type {Record<string, number>}" }, recentRecords: { required: true, type: () => [require("./health-record-response.dto").HealthRecordSummaryDto], description: "Most recent health records\n\n**Limit:** Typically 5-10 most recent records\n**Sort:** Descending by recordDate\n\n@type {HealthRecordSummaryDto[]}" }, pendingFollowUps: { required: true, type: () => Number, description: "Count of pending follow-ups\n\n**Definition:** Health records where:\n- followUpRequired = true\n- followUpCompleted = false\n\n@type {number}" }, overdueFollowUps: { required: true, type: () => Number, description: "Count of overdue follow-ups\n\n**Definition:** Health records where:\n- followUpRequired = true\n- followUpCompleted = false\n- followUpDate < current date\n\n**Alert:** This should trigger notifications\n\n@type {number}" }, lastRecordDate: { required: false, type: () => Date, description: "Date of most recent health record\n@type {Date}\n@optional" }, confidentialRecordsCount: { required: true, type: () => Number, description: "Count of confidential records\n\n**Privacy:** Number only, no details\n**Use Case:** Compliance reporting, access audit requirements\n\n@type {number}" } };
    }
}
exports.HealthSummaryDto = HealthSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
        type: String,
    }),
    __metadata("design:type", String)
], HealthSummaryDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of health records for this student',
        example: 42,
        type: Number,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], HealthSummaryDto.prototype, "totalRecords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Breakdown of health record counts by type',
        example: {
            CHECKUP: 5,
            VACCINATION: 12,
            ILLNESS: 8,
            INJURY: 3,
            SCREENING: 7,
        },
        type: 'object',
        additionalProperties: {
            type: 'number',
        },
    }),
    __metadata("design:type", Object)
], HealthSummaryDto.prototype, "recordsByType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Most recent health records (limited to last 10)',
        type: [HealthRecordSummaryDto],
        isArray: true,
    }),
    (0, class_transformer_1.Type)(() => HealthRecordSummaryDto),
    __metadata("design:type", Array)
], HealthSummaryDto.prototype, "recentRecords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of health records with pending follow-ups (followUpRequired=true, followUpCompleted=false)',
        example: 2,
        type: Number,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], HealthSummaryDto.prototype, "pendingFollowUps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of overdue follow-ups (followUpRequired=true, followUpCompleted=false, followUpDate < now). Requires immediate attention.',
        example: 0,
        type: Number,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], HealthSummaryDto.prototype, "overdueFollowUps", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date of the most recent health record entry',
        example: '2024-10-15T14:30:00Z',
        type: Date,
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], HealthSummaryDto.prototype, "lastRecordDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of health records marked as confidential (isConfidential=true). Count only for privacy.',
        example: 3,
        type: Number,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], HealthSummaryDto.prototype, "confidentialRecordsCount", void 0);
class HealthRecordListResponseDto extends paginated_response_dto_1.PaginatedResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./health-record-response.dto").HealthRecordResponseDto] } };
    }
}
exports.HealthRecordListResponseDto = HealthRecordListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of health records for the current page',
        type: [HealthRecordResponseDto],
        isArray: true,
    }),
    (0, class_transformer_1.Type)(() => HealthRecordResponseDto),
    __metadata("design:type", Array)
], HealthRecordListResponseDto.prototype, "data", void 0);
function mapHealthRecordToResponseDto(record) {
    let isFollowUpOverdue = false;
    if (record.followUpRequired &&
        !record.followUpCompleted &&
        record.followUpDate) {
        isFollowUpOverdue = new Date() > new Date(record.followUpDate);
    }
    let daysUntilFollowUp = null;
    if (record.followUpRequired &&
        !record.followUpCompleted &&
        record.followUpDate) {
        const diff = new Date(record.followUpDate).getTime() - new Date().getTime();
        daysUntilFollowUp = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    let student;
    if (record.student) {
        student = {
            id: record.student.id,
            firstName: record.student.firstName,
            lastName: record.student.lastName,
            dateOfBirth: record.student.dateOfBirth,
        };
    }
    const dto = {
        id: record.id,
        studentId: record.studentId,
        recordType: record.recordType,
        title: record.title,
        description: record.description,
        recordDate: record.recordDate,
        provider: record.provider,
        providerNpi: record.providerNpi,
        facility: record.facility,
        facilityNpi: record.facilityNpi,
        diagnosis: record.diagnosis,
        diagnosisCode: record.diagnosisCode,
        treatment: record.treatment,
        followUpRequired: record.followUpRequired,
        followUpDate: record.followUpDate,
        followUpCompleted: record.followUpCompleted,
        attachments: record.attachments || [],
        metadata: record.metadata,
        isConfidential: record.isConfidential,
        notes: record.notes,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        student,
        isFollowUpOverdue,
        daysUntilFollowUp,
    };
    return dto;
}
function mapHealthRecordToSummaryDto(record) {
    return {
        id: record.id,
        title: record.title,
        recordType: record.recordType,
        recordDate: record.recordDate,
        isConfidential: record.isConfidential,
        followUpRequired: record.followUpRequired,
    };
}
//# sourceMappingURL=health-record-response.dto.js.map