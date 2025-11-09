"use strict";
/**
 * LOC: HCM_EMP_CORE_001
 * File: /reuse/server/human-capital/employee-core-data-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - bcrypt
 *   - i18next
 *
 * DOWNSTREAM (imported by):
 *   - Employee service implementations
 *   - HR management controllers
 *   - Payroll integration services
 *   - Compliance & audit systems
 *   - Employee self-service portals
 */
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = exports.EmployeeService = exports.CompensationHistoryModel = exports.EmployeeAuditLogModel = exports.GDPRConsentModel = exports.EmployeeDocumentModel = exports.DependentModel = exports.EmergencyContactModel = exports.EmployeeModel = exports.CompensationSchema = exports.EmployeeProfileSchema = exports.GDPRConsentSchema = exports.DependentSchema = exports.EmergencyContactSchema = exports.AddressSchema = exports.ConsentType = exports.LeaveType = exports.EmployeeClassification = exports.EmergencyRelationship = exports.DocumentType = exports.MaritalStatus = exports.Gender = exports.EmploymentType = exports.EmployeeStatus = void 0;
exports.createEmployee = createEmployee;
exports.updateEmployee = updateEmployee;
exports.getEmployeeById = getEmployeeById;
exports.getEmployeeByNumber = getEmployeeByNumber;
exports.getEmployeeByEmail = getEmployeeByEmail;
exports.deleteEmployee = deleteEmployee;
exports.searchEmployees = searchEmployees;
exports.updateEmployeeStatus = updateEmployeeStatus;
exports.terminateEmployee = terminateEmployee;
exports.reactivateEmployee = reactivateEmployee;
exports.isEmployeeActive = isEmployeeActive;
exports.getEmployeesByStatus = getEmployeesByStatus;
exports.addEmergencyContact = addEmergencyContact;
exports.updateEmergencyContact = updateEmergencyContact;
exports.removeEmergencyContact = removeEmergencyContact;
exports.getEmergencyContacts = getEmergencyContacts;
exports.getPrimaryEmergencyContact = getPrimaryEmergencyContact;
exports.addDependent = addDependent;
exports.updateDependent = updateDependent;
exports.removeDependent = removeDependent;
exports.getDependents = getDependents;
exports.getMinorDependents = getMinorDependents;
exports.uploadEmployeeDocument = uploadEmployeeDocument;
exports.getEmployeeDocuments = getEmployeeDocuments;
exports.deleteEmployeeDocument = deleteEmployeeDocument;
exports.getExpiringDocuments = getExpiringDocuments;
exports.recordGDPRConsent = recordGDPRConsent;
exports.revokeGDPRConsent = revokeGDPRConsent;
exports.getGDPRConsents = getGDPRConsents;
exports.hasGDPRConsent = hasGDPRConsent;
exports.exportEmployeeData = exportEmployeeData;
exports.anonymizeEmployeeData = anonymizeEmployeeData;
exports.logEmployeeAction = logEmployeeAction;
exports.getEmployeeAuditTrail = getEmployeeAuditTrail;
exports.getFieldChangeHistory = getFieldChangeHistory;
exports.addCompensation = addCompensation;
exports.getCurrentCompensation = getCurrentCompensation;
exports.getCompensationHistory = getCompensationHistory;
exports.bulkImportEmployees = bulkImportEmployees;
exports.bulkExportEmployees = bulkExportEmployees;
exports.bulkUpdateStatus = bulkUpdateStatus;
exports.calculateTenure = calculateTenure;
exports.calculateAge = calculateAge;
exports.generateEmployeeNumber = generateEmployeeNumber;
exports.formatEmployeeName = formatEmployeeName;
exports.validateEmployeeData = validateEmployeeData;
/**
 * File: /reuse/server/human-capital/employee-core-data-kit.ts
 * Locator: WC-HCM-EMP-CORE-001
 * Purpose: Employee Core Data Kit - Comprehensive employee master data management
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, Bcrypt, i18next
 * Downstream: ../backend/hr/*, ../services/payroll/*, Employee portals, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 45+ utility functions for employee data management, profile CRUD, status management,
 *          contact management, emergency contacts, dependents, documents, audit trails, GDPR compliance,
 *          bulk operations, multi-language support, validation, and reporting
 *
 * LLM Context: Enterprise-grade employee master data management for White Cross healthcare system.
 * Provides comprehensive employee lifecycle management including profile creation/updates, employment
 * status tracking (active, inactive, leave, terminated), contact information management, emergency
 * contacts and dependents, document attachments, complete audit trails, GDPR-compliant data privacy
 * controls, multi-language and multi-currency support, bulk import/export capabilities, employee
 * classification and categorization, compensation tracking, benefits enrollment, performance management
 * integration, and SAP SuccessFactors feature parity. HIPAA-compliant for healthcare employee data.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const zod_1 = require("zod");
const bcrypt = __importStar(require("bcrypt"));
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Employee status enumeration
 */
var EmployeeStatus;
(function (EmployeeStatus) {
    EmployeeStatus["ACTIVE"] = "active";
    EmployeeStatus["INACTIVE"] = "inactive";
    EmployeeStatus["ON_LEAVE"] = "on_leave";
    EmployeeStatus["SUSPENDED"] = "suspended";
    EmployeeStatus["TERMINATED"] = "terminated";
    EmployeeStatus["RETIRED"] = "retired";
    EmployeeStatus["DECEASED"] = "deceased";
})(EmployeeStatus || (exports.EmployeeStatus = EmployeeStatus = {}));
/**
 * Employment type enumeration
 */
var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULL_TIME"] = "full_time";
    EmploymentType["PART_TIME"] = "part_time";
    EmploymentType["CONTRACT"] = "contract";
    EmploymentType["TEMPORARY"] = "temporary";
    EmploymentType["INTERN"] = "intern";
    EmploymentType["CONSULTANT"] = "consultant";
})(EmploymentType || (exports.EmploymentType = EmploymentType = {}));
/**
 * Gender enumeration
 */
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["NON_BINARY"] = "non_binary";
    Gender["PREFER_NOT_TO_SAY"] = "prefer_not_to_say";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
/**
 * Marital status enumeration
 */
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["SINGLE"] = "single";
    MaritalStatus["MARRIED"] = "married";
    MaritalStatus["DIVORCED"] = "divorced";
    MaritalStatus["WIDOWED"] = "widowed";
    MaritalStatus["SEPARATED"] = "separated";
    MaritalStatus["DOMESTIC_PARTNERSHIP"] = "domestic_partnership";
})(MaritalStatus || (exports.MaritalStatus = MaritalStatus = {}));
/**
 * Document type enumeration
 */
var DocumentType;
(function (DocumentType) {
    DocumentType["RESUME"] = "resume";
    DocumentType["CONTRACT"] = "contract";
    DocumentType["ID_PROOF"] = "id_proof";
    DocumentType["EDUCATION"] = "education";
    DocumentType["CERTIFICATION"] = "certification";
    DocumentType["PERFORMANCE_REVIEW"] = "performance_review";
    DocumentType["DISCIPLINARY"] = "disciplinary";
    DocumentType["MEDICAL"] = "medical";
    DocumentType["OTHER"] = "other";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
/**
 * Emergency contact relationship
 */
var EmergencyRelationship;
(function (EmergencyRelationship) {
    EmergencyRelationship["SPOUSE"] = "spouse";
    EmergencyRelationship["PARENT"] = "parent";
    EmergencyRelationship["CHILD"] = "child";
    EmergencyRelationship["SIBLING"] = "sibling";
    EmergencyRelationship["FRIEND"] = "friend";
    EmergencyRelationship["RELATIVE"] = "relative";
    EmergencyRelationship["OTHER"] = "other";
})(EmergencyRelationship || (exports.EmergencyRelationship = EmergencyRelationship = {}));
/**
 * Employee classification
 */
var EmployeeClassification;
(function (EmployeeClassification) {
    EmployeeClassification["EXECUTIVE"] = "executive";
    EmployeeClassification["MANAGEMENT"] = "management";
    EmployeeClassification["PROFESSIONAL"] = "professional";
    EmployeeClassification["TECHNICAL"] = "technical";
    EmployeeClassification["ADMINISTRATIVE"] = "administrative";
    EmployeeClassification["SUPPORT"] = "support";
    EmployeeClassification["OPERATIONS"] = "operations";
})(EmployeeClassification || (exports.EmployeeClassification = EmployeeClassification = {}));
/**
 * Leave type enumeration
 */
var LeaveType;
(function (LeaveType) {
    LeaveType["ANNUAL"] = "annual";
    LeaveType["SICK"] = "sick";
    LeaveType["MATERNITY"] = "maternity";
    LeaveType["PATERNITY"] = "paternity";
    LeaveType["PARENTAL"] = "parental";
    LeaveType["BEREAVEMENT"] = "bereavement";
    LeaveType["SABBATICAL"] = "sabbatical";
    LeaveType["UNPAID"] = "unpaid";
    LeaveType["MEDICAL"] = "medical";
    LeaveType["DISABILITY"] = "disability";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
/**
 * Data privacy consent type
 */
var ConsentType;
(function (ConsentType) {
    ConsentType["DATA_PROCESSING"] = "data_processing";
    ConsentType["MARKETING"] = "marketing";
    ConsentType["THIRD_PARTY_SHARING"] = "third_party_sharing";
    ConsentType["PHOTO_USAGE"] = "photo_usage";
    ConsentType["EMERGENCY_CONTACT"] = "emergency_contact";
})(ConsentType || (exports.ConsentType = ConsentType = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Address validation schema
 */
exports.AddressSchema = zod_1.z.object({
    street1: zod_1.z.string().min(1).max(255),
    street2: zod_1.z.string().max(255).optional(),
    city: zod_1.z.string().min(1).max(100),
    state: zod_1.z.string().max(100).optional(),
    postalCode: zod_1.z.string().min(1).max(20),
    country: zod_1.z.string().min(2).max(2), // ISO 2-letter country code
    coordinates: zod_1.z.object({
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180),
    }).optional(),
});
/**
 * Emergency contact validation schema
 */
exports.EmergencyContactSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    relationship: zod_1.z.nativeEnum(EmergencyRelationship),
    phoneNumber: zod_1.z.string().min(1).max(20),
    alternatePhone: zod_1.z.string().max(20).optional(),
    email: zod_1.z.string().email().optional(),
    address: exports.AddressSchema.optional(),
    isPrimary: zod_1.z.boolean().default(false),
    notes: zod_1.z.string().max(1000).optional(),
});
/**
 * Dependent validation schema
 */
exports.DependentSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(100),
    lastName: zod_1.z.string().min(1).max(100),
    dateOfBirth: zod_1.z.coerce.date(),
    relationship: zod_1.z.string().min(1).max(50),
    gender: zod_1.z.nativeEnum(Gender).optional(),
    nationalId: zod_1.z.string().max(50).optional(),
    isStudent: zod_1.z.boolean().optional(),
    isDisabled: zod_1.z.boolean().optional(),
    coverageStartDate: zod_1.z.coerce.date().optional(),
    coverageEndDate: zod_1.z.coerce.date().optional(),
});
/**
 * GDPR consent validation schema
 */
exports.GDPRConsentSchema = zod_1.z.object({
    consentType: zod_1.z.nativeEnum(ConsentType),
    granted: zod_1.z.boolean(),
    grantedAt: zod_1.z.coerce.date().optional(),
    revokedAt: zod_1.z.coerce.date().optional(),
    version: zod_1.z.string().min(1),
    ipAddress: zod_1.z.string().ip().optional(),
    notes: zod_1.z.string().max(500).optional(),
});
/**
 * Employee profile validation schema
 */
exports.EmployeeProfileSchema = zod_1.z.object({
    employeeNumber: zod_1.z.string().min(1).max(50),
    firstName: zod_1.z.string().min(1).max(100),
    middleName: zod_1.z.string().max(100).optional(),
    lastName: zod_1.z.string().min(1).max(100),
    preferredName: zod_1.z.string().max(100).optional(),
    email: zod_1.z.string().email(),
    personalEmail: zod_1.z.string().email().optional(),
    phoneNumber: zod_1.z.string().max(20).optional(),
    mobileNumber: zod_1.z.string().max(20).optional(),
    dateOfBirth: zod_1.z.coerce.date(),
    gender: zod_1.z.nativeEnum(Gender),
    maritalStatus: zod_1.z.nativeEnum(MaritalStatus).optional(),
    nationality: zod_1.z.string().min(2).max(2).optional(),
    nationalId: zod_1.z.string().max(50).optional(),
    passportNumber: zod_1.z.string().max(50).optional(),
    taxId: zod_1.z.string().max(50).optional(),
    socialSecurityNumber: zod_1.z.string().max(50).optional(),
    photoUrl: zod_1.z.string().url().optional(),
    status: zod_1.z.nativeEnum(EmployeeStatus),
    employmentType: zod_1.z.nativeEnum(EmploymentType),
    classification: zod_1.z.nativeEnum(EmployeeClassification),
    hireDate: zod_1.z.coerce.date(),
    terminationDate: zod_1.z.coerce.date().optional(),
    probationEndDate: zod_1.z.coerce.date().optional(),
    departmentId: zod_1.z.string().uuid().optional(),
    positionId: zod_1.z.string().uuid().optional(),
    managerId: zod_1.z.string().uuid().optional(),
    workLocation: zod_1.z.string().max(255).optional(),
    homeAddress: exports.AddressSchema.optional(),
    languagePreference: zod_1.z.string().max(10).optional(),
    currency: zod_1.z.string().length(3).optional(),
    timezone: zod_1.z.string().max(50).optional(),
}).refine((data) => {
    if (data.terminationDate && data.hireDate) {
        return data.terminationDate >= data.hireDate;
    }
    return true;
}, { message: 'Termination date must be after hire date' });
/**
 * Compensation validation schema
 */
exports.CompensationSchema = zod_1.z.object({
    baseSalary: zod_1.z.number().positive(),
    currency: zod_1.z.string().length(3),
    payFrequency: zod_1.z.enum(['hourly', 'daily', 'weekly', 'biweekly', 'monthly', 'annual']),
    effectiveDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date().optional(),
    bonusEligible: zod_1.z.boolean().default(false),
    commissionEligible: zod_1.z.boolean().default(false),
    grade: zod_1.z.string().max(10).optional(),
    step: zod_1.z.string().max(10).optional(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Employee Model - Core employee master data
 */
let EmployeeModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'employees',
            timestamps: true,
            paranoid: true, // Soft deletes
            indexes: [
                { fields: ['employee_number'], unique: true },
                { fields: ['email'], unique: true },
                { fields: ['status'] },
                { fields: ['employment_type'] },
                { fields: ['classification'] },
                { fields: ['department_id'] },
                { fields: ['manager_id'] },
                { fields: ['hire_date'] },
                { fields: ['first_name', 'last_name'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_hashSensitiveData_decorators;
    let _static_hashSensitiveDataOnUpdate_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeNumber_decorators;
    let _employeeNumber_initializers = [];
    let _employeeNumber_extraInitializers = [];
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _middleName_decorators;
    let _middleName_initializers = [];
    let _middleName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _preferredName_decorators;
    let _preferredName_initializers = [];
    let _preferredName_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _personalEmail_decorators;
    let _personalEmail_initializers = [];
    let _personalEmail_extraInitializers = [];
    let _phoneNumber_decorators;
    let _phoneNumber_initializers = [];
    let _phoneNumber_extraInitializers = [];
    let _mobileNumber_decorators;
    let _mobileNumber_initializers = [];
    let _mobileNumber_extraInitializers = [];
    let _dateOfBirth_decorators;
    let _dateOfBirth_initializers = [];
    let _dateOfBirth_extraInitializers = [];
    let _gender_decorators;
    let _gender_initializers = [];
    let _gender_extraInitializers = [];
    let _maritalStatus_decorators;
    let _maritalStatus_initializers = [];
    let _maritalStatus_extraInitializers = [];
    let _nationality_decorators;
    let _nationality_initializers = [];
    let _nationality_extraInitializers = [];
    let _nationalId_decorators;
    let _nationalId_initializers = [];
    let _nationalId_extraInitializers = [];
    let _passportNumber_decorators;
    let _passportNumber_initializers = [];
    let _passportNumber_extraInitializers = [];
    let _taxId_decorators;
    let _taxId_initializers = [];
    let _taxId_extraInitializers = [];
    let _socialSecurityNumber_decorators;
    let _socialSecurityNumber_initializers = [];
    let _socialSecurityNumber_extraInitializers = [];
    let _photoUrl_decorators;
    let _photoUrl_initializers = [];
    let _photoUrl_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _employmentType_decorators;
    let _employmentType_initializers = [];
    let _employmentType_extraInitializers = [];
    let _classification_decorators;
    let _classification_initializers = [];
    let _classification_extraInitializers = [];
    let _hireDate_decorators;
    let _hireDate_initializers = [];
    let _hireDate_extraInitializers = [];
    let _terminationDate_decorators;
    let _terminationDate_initializers = [];
    let _terminationDate_extraInitializers = [];
    let _probationEndDate_decorators;
    let _probationEndDate_initializers = [];
    let _probationEndDate_extraInitializers = [];
    let _managerId_decorators;
    let _managerId_initializers = [];
    let _managerId_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _positionId_decorators;
    let _positionId_initializers = [];
    let _positionId_extraInitializers = [];
    let _workLocation_decorators;
    let _workLocation_initializers = [];
    let _workLocation_extraInitializers = [];
    let _homeAddress_decorators;
    let _homeAddress_initializers = [];
    let _homeAddress_extraInitializers = [];
    let _languagePreference_decorators;
    let _languagePreference_initializers = [];
    let _languagePreference_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _timezone_decorators;
    let _timezone_initializers = [];
    let _timezone_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _manager_decorators;
    let _manager_initializers = [];
    let _manager_extraInitializers = [];
    let _emergencyContacts_decorators;
    let _emergencyContacts_initializers = [];
    let _emergencyContacts_extraInitializers = [];
    let _dependents_decorators;
    let _dependents_initializers = [];
    let _dependents_extraInitializers = [];
    let _documents_decorators;
    let _documents_initializers = [];
    let _documents_extraInitializers = [];
    let _gdprConsents_decorators;
    let _gdprConsents_initializers = [];
    let _gdprConsents_extraInitializers = [];
    let _auditLogs_decorators;
    let _auditLogs_initializers = [];
    let _auditLogs_extraInitializers = [];
    let _compensationHistory_decorators;
    let _compensationHistory_initializers = [];
    let _compensationHistory_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var EmployeeModel = _classThis = class extends _classSuper {
        static async hashSensitiveData(instance) {
            if (instance.socialSecurityNumber) {
                instance.socialSecurityNumber = await bcrypt.hash(instance.socialSecurityNumber, 10);
            }
        }
        static async hashSensitiveDataOnUpdate(instance) {
            if (instance.changed('socialSecurityNumber') && instance.socialSecurityNumber) {
                instance.socialSecurityNumber = await bcrypt.hash(instance.socialSecurityNumber, 10);
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeNumber_initializers, void 0));
            this.firstName = (__runInitializers(this, _employeeNumber_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
            this.middleName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _middleName_initializers, void 0));
            this.lastName = (__runInitializers(this, _middleName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
            this.preferredName = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _preferredName_initializers, void 0));
            this.email = (__runInitializers(this, _preferredName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.personalEmail = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _personalEmail_initializers, void 0));
            this.phoneNumber = (__runInitializers(this, _personalEmail_extraInitializers), __runInitializers(this, _phoneNumber_initializers, void 0));
            this.mobileNumber = (__runInitializers(this, _phoneNumber_extraInitializers), __runInitializers(this, _mobileNumber_initializers, void 0));
            this.dateOfBirth = (__runInitializers(this, _mobileNumber_extraInitializers), __runInitializers(this, _dateOfBirth_initializers, void 0));
            this.gender = (__runInitializers(this, _dateOfBirth_extraInitializers), __runInitializers(this, _gender_initializers, void 0));
            this.maritalStatus = (__runInitializers(this, _gender_extraInitializers), __runInitializers(this, _maritalStatus_initializers, void 0));
            this.nationality = (__runInitializers(this, _maritalStatus_extraInitializers), __runInitializers(this, _nationality_initializers, void 0));
            this.nationalId = (__runInitializers(this, _nationality_extraInitializers), __runInitializers(this, _nationalId_initializers, void 0));
            this.passportNumber = (__runInitializers(this, _nationalId_extraInitializers), __runInitializers(this, _passportNumber_initializers, void 0));
            this.taxId = (__runInitializers(this, _passportNumber_extraInitializers), __runInitializers(this, _taxId_initializers, void 0));
            this.socialSecurityNumber = (__runInitializers(this, _taxId_extraInitializers), __runInitializers(this, _socialSecurityNumber_initializers, void 0));
            this.photoUrl = (__runInitializers(this, _socialSecurityNumber_extraInitializers), __runInitializers(this, _photoUrl_initializers, void 0));
            this.status = (__runInitializers(this, _photoUrl_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.employmentType = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _employmentType_initializers, void 0));
            this.classification = (__runInitializers(this, _employmentType_extraInitializers), __runInitializers(this, _classification_initializers, void 0));
            this.hireDate = (__runInitializers(this, _classification_extraInitializers), __runInitializers(this, _hireDate_initializers, void 0));
            this.terminationDate = (__runInitializers(this, _hireDate_extraInitializers), __runInitializers(this, _terminationDate_initializers, void 0));
            this.probationEndDate = (__runInitializers(this, _terminationDate_extraInitializers), __runInitializers(this, _probationEndDate_initializers, void 0));
            this.managerId = (__runInitializers(this, _probationEndDate_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
            this.departmentId = (__runInitializers(this, _managerId_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
            this.positionId = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _positionId_initializers, void 0));
            this.workLocation = (__runInitializers(this, _positionId_extraInitializers), __runInitializers(this, _workLocation_initializers, void 0));
            this.homeAddress = (__runInitializers(this, _workLocation_extraInitializers), __runInitializers(this, _homeAddress_initializers, void 0));
            this.languagePreference = (__runInitializers(this, _homeAddress_extraInitializers), __runInitializers(this, _languagePreference_initializers, void 0));
            this.currency = (__runInitializers(this, _languagePreference_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.timezone = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _timezone_initializers, void 0));
            this.metadata = (__runInitializers(this, _timezone_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.manager = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _manager_initializers, void 0));
            this.emergencyContacts = (__runInitializers(this, _manager_extraInitializers), __runInitializers(this, _emergencyContacts_initializers, void 0));
            this.dependents = (__runInitializers(this, _emergencyContacts_extraInitializers), __runInitializers(this, _dependents_initializers, void 0));
            this.documents = (__runInitializers(this, _dependents_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
            this.gdprConsents = (__runInitializers(this, _documents_extraInitializers), __runInitializers(this, _gdprConsents_initializers, void 0));
            this.auditLogs = (__runInitializers(this, _gdprConsents_extraInitializers), __runInitializers(this, _auditLogs_initializers, void 0));
            this.compensationHistory = (__runInitializers(this, _auditLogs_extraInitializers), __runInitializers(this, _compensationHistory_initializers, void 0));
            this.createdAt = (__runInitializers(this, _compensationHistory_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EmployeeModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _employeeNumber_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Length)({ min: 1, max: 50 }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                field: 'employee_number',
                comment: 'Unique employee identifier',
            })];
        _firstName_decorators = [(0, sequelize_typescript_1.Length)({ min: 1, max: 100 }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'first_name',
                comment: 'Employee first name',
            })];
        _middleName_decorators = [(0, sequelize_typescript_1.Length)({ max: 100 }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
                field: 'middle_name',
                comment: 'Employee middle name',
            })];
        _lastName_decorators = [(0, sequelize_typescript_1.Length)({ min: 1, max: 100 }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'last_name',
                comment: 'Employee last name',
            })];
        _preferredName_decorators = [(0, sequelize_typescript_1.Length)({ max: 100 }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
                field: 'preferred_name',
                comment: 'Preferred name or nickname',
            })];
        _email_decorators = [sequelize_typescript_1.Unique, sequelize_typescript_1.IsEmail, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                comment: 'Work email address',
            })];
        _personalEmail_decorators = [sequelize_typescript_1.IsEmail, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'personal_email',
                comment: 'Personal email address',
            })];
        _phoneNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: true,
                field: 'phone_number',
                comment: 'Work phone number',
            })];
        _mobileNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: true,
                field: 'mobile_number',
                comment: 'Mobile phone number',
            })];
        _dateOfBirth_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: false,
                field: 'date_of_birth',
                comment: 'Date of birth',
            })];
        _gender_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(Gender)),
                allowNull: false,
                comment: 'Gender',
            })];
        _maritalStatus_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(MaritalStatus)),
                allowNull: true,
                field: 'marital_status',
                comment: 'Marital status',
            })];
        _nationality_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(2),
                allowNull: true,
                comment: 'Nationality (ISO 2-letter code)',
            })];
        _nationalId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
                field: 'national_id',
                comment: 'National ID number',
            })];
        _passportNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
                field: 'passport_number',
                comment: 'Passport number',
            })];
        _taxId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
                field: 'tax_id',
                comment: 'Tax identification number',
            })];
        _socialSecurityNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
                field: 'social_security_number',
                comment: 'Social security number (encrypted)',
            })];
        _photoUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'photo_url',
                comment: 'Profile photo URL',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EmployeeStatus)),
                allowNull: false,
                defaultValue: EmployeeStatus.ACTIVE,
                comment: 'Current employment status',
            })];
        _employmentType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EmploymentType)),
                allowNull: false,
                field: 'employment_type',
                comment: 'Type of employment',
            })];
        _classification_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EmployeeClassification)),
                allowNull: false,
                comment: 'Employee classification',
            })];
        _hireDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: false,
                field: 'hire_date',
                comment: 'Date of hire',
            })];
        _terminationDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'termination_date',
                comment: 'Date of termination',
            })];
        _probationEndDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'probation_end_date',
                comment: 'End date of probation period',
            })];
        _managerId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => EmployeeModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'manager_id',
                comment: 'Manager employee ID',
            })];
        _departmentId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'department_id',
                comment: 'Department ID',
            })];
        _positionId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'position_id',
                comment: 'Position/Job title ID',
            })];
        _workLocation_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'work_location',
                comment: 'Primary work location',
            })];
        _homeAddress_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                field: 'home_address',
                comment: 'Home address',
            })];
        _languagePreference_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(10),
                allowNull: true,
                defaultValue: 'en',
                field: 'language_preference',
                comment: 'Preferred language (ISO code)',
            })];
        _currency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                allowNull: true,
                defaultValue: 'USD',
                comment: 'Preferred currency (ISO code)',
            })];
        _timezone_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
                defaultValue: 'UTC',
                comment: 'Timezone preference',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                comment: 'Additional metadata',
            })];
        _manager_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => EmployeeModel, 'manager_id')];
        _emergencyContacts_decorators = [(0, sequelize_typescript_1.HasMany)(() => EmergencyContactModel)];
        _dependents_decorators = [(0, sequelize_typescript_1.HasMany)(() => DependentModel)];
        _documents_decorators = [(0, sequelize_typescript_1.HasMany)(() => EmployeeDocumentModel)];
        _gdprConsents_decorators = [(0, sequelize_typescript_1.HasMany)(() => GDPRConsentModel)];
        _auditLogs_decorators = [(0, sequelize_typescript_1.HasMany)(() => EmployeeAuditLogModel)];
        _compensationHistory_decorators = [(0, sequelize_typescript_1.HasMany)(() => CompensationHistoryModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _static_hashSensitiveData_decorators = [sequelize_typescript_1.BeforeCreate];
        _static_hashSensitiveDataOnUpdate_decorators = [sequelize_typescript_1.BeforeUpdate];
        __esDecorate(_classThis, null, _static_hashSensitiveData_decorators, { kind: "method", name: "hashSensitiveData", static: true, private: false, access: { has: obj => "hashSensitiveData" in obj, get: obj => obj.hashSensitiveData }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(_classThis, null, _static_hashSensitiveDataOnUpdate_decorators, { kind: "method", name: "hashSensitiveDataOnUpdate", static: true, private: false, access: { has: obj => "hashSensitiveDataOnUpdate" in obj, get: obj => obj.hashSensitiveDataOnUpdate }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeNumber_decorators, { kind: "field", name: "employeeNumber", static: false, private: false, access: { has: obj => "employeeNumber" in obj, get: obj => obj.employeeNumber, set: (obj, value) => { obj.employeeNumber = value; } }, metadata: _metadata }, _employeeNumber_initializers, _employeeNumber_extraInitializers);
        __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
        __esDecorate(null, null, _middleName_decorators, { kind: "field", name: "middleName", static: false, private: false, access: { has: obj => "middleName" in obj, get: obj => obj.middleName, set: (obj, value) => { obj.middleName = value; } }, metadata: _metadata }, _middleName_initializers, _middleName_extraInitializers);
        __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
        __esDecorate(null, null, _preferredName_decorators, { kind: "field", name: "preferredName", static: false, private: false, access: { has: obj => "preferredName" in obj, get: obj => obj.preferredName, set: (obj, value) => { obj.preferredName = value; } }, metadata: _metadata }, _preferredName_initializers, _preferredName_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _personalEmail_decorators, { kind: "field", name: "personalEmail", static: false, private: false, access: { has: obj => "personalEmail" in obj, get: obj => obj.personalEmail, set: (obj, value) => { obj.personalEmail = value; } }, metadata: _metadata }, _personalEmail_initializers, _personalEmail_extraInitializers);
        __esDecorate(null, null, _phoneNumber_decorators, { kind: "field", name: "phoneNumber", static: false, private: false, access: { has: obj => "phoneNumber" in obj, get: obj => obj.phoneNumber, set: (obj, value) => { obj.phoneNumber = value; } }, metadata: _metadata }, _phoneNumber_initializers, _phoneNumber_extraInitializers);
        __esDecorate(null, null, _mobileNumber_decorators, { kind: "field", name: "mobileNumber", static: false, private: false, access: { has: obj => "mobileNumber" in obj, get: obj => obj.mobileNumber, set: (obj, value) => { obj.mobileNumber = value; } }, metadata: _metadata }, _mobileNumber_initializers, _mobileNumber_extraInitializers);
        __esDecorate(null, null, _dateOfBirth_decorators, { kind: "field", name: "dateOfBirth", static: false, private: false, access: { has: obj => "dateOfBirth" in obj, get: obj => obj.dateOfBirth, set: (obj, value) => { obj.dateOfBirth = value; } }, metadata: _metadata }, _dateOfBirth_initializers, _dateOfBirth_extraInitializers);
        __esDecorate(null, null, _gender_decorators, { kind: "field", name: "gender", static: false, private: false, access: { has: obj => "gender" in obj, get: obj => obj.gender, set: (obj, value) => { obj.gender = value; } }, metadata: _metadata }, _gender_initializers, _gender_extraInitializers);
        __esDecorate(null, null, _maritalStatus_decorators, { kind: "field", name: "maritalStatus", static: false, private: false, access: { has: obj => "maritalStatus" in obj, get: obj => obj.maritalStatus, set: (obj, value) => { obj.maritalStatus = value; } }, metadata: _metadata }, _maritalStatus_initializers, _maritalStatus_extraInitializers);
        __esDecorate(null, null, _nationality_decorators, { kind: "field", name: "nationality", static: false, private: false, access: { has: obj => "nationality" in obj, get: obj => obj.nationality, set: (obj, value) => { obj.nationality = value; } }, metadata: _metadata }, _nationality_initializers, _nationality_extraInitializers);
        __esDecorate(null, null, _nationalId_decorators, { kind: "field", name: "nationalId", static: false, private: false, access: { has: obj => "nationalId" in obj, get: obj => obj.nationalId, set: (obj, value) => { obj.nationalId = value; } }, metadata: _metadata }, _nationalId_initializers, _nationalId_extraInitializers);
        __esDecorate(null, null, _passportNumber_decorators, { kind: "field", name: "passportNumber", static: false, private: false, access: { has: obj => "passportNumber" in obj, get: obj => obj.passportNumber, set: (obj, value) => { obj.passportNumber = value; } }, metadata: _metadata }, _passportNumber_initializers, _passportNumber_extraInitializers);
        __esDecorate(null, null, _taxId_decorators, { kind: "field", name: "taxId", static: false, private: false, access: { has: obj => "taxId" in obj, get: obj => obj.taxId, set: (obj, value) => { obj.taxId = value; } }, metadata: _metadata }, _taxId_initializers, _taxId_extraInitializers);
        __esDecorate(null, null, _socialSecurityNumber_decorators, { kind: "field", name: "socialSecurityNumber", static: false, private: false, access: { has: obj => "socialSecurityNumber" in obj, get: obj => obj.socialSecurityNumber, set: (obj, value) => { obj.socialSecurityNumber = value; } }, metadata: _metadata }, _socialSecurityNumber_initializers, _socialSecurityNumber_extraInitializers);
        __esDecorate(null, null, _photoUrl_decorators, { kind: "field", name: "photoUrl", static: false, private: false, access: { has: obj => "photoUrl" in obj, get: obj => obj.photoUrl, set: (obj, value) => { obj.photoUrl = value; } }, metadata: _metadata }, _photoUrl_initializers, _photoUrl_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _employmentType_decorators, { kind: "field", name: "employmentType", static: false, private: false, access: { has: obj => "employmentType" in obj, get: obj => obj.employmentType, set: (obj, value) => { obj.employmentType = value; } }, metadata: _metadata }, _employmentType_initializers, _employmentType_extraInitializers);
        __esDecorate(null, null, _classification_decorators, { kind: "field", name: "classification", static: false, private: false, access: { has: obj => "classification" in obj, get: obj => obj.classification, set: (obj, value) => { obj.classification = value; } }, metadata: _metadata }, _classification_initializers, _classification_extraInitializers);
        __esDecorate(null, null, _hireDate_decorators, { kind: "field", name: "hireDate", static: false, private: false, access: { has: obj => "hireDate" in obj, get: obj => obj.hireDate, set: (obj, value) => { obj.hireDate = value; } }, metadata: _metadata }, _hireDate_initializers, _hireDate_extraInitializers);
        __esDecorate(null, null, _terminationDate_decorators, { kind: "field", name: "terminationDate", static: false, private: false, access: { has: obj => "terminationDate" in obj, get: obj => obj.terminationDate, set: (obj, value) => { obj.terminationDate = value; } }, metadata: _metadata }, _terminationDate_initializers, _terminationDate_extraInitializers);
        __esDecorate(null, null, _probationEndDate_decorators, { kind: "field", name: "probationEndDate", static: false, private: false, access: { has: obj => "probationEndDate" in obj, get: obj => obj.probationEndDate, set: (obj, value) => { obj.probationEndDate = value; } }, metadata: _metadata }, _probationEndDate_initializers, _probationEndDate_extraInitializers);
        __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: obj => "managerId" in obj, get: obj => obj.managerId, set: (obj, value) => { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
        __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
        __esDecorate(null, null, _positionId_decorators, { kind: "field", name: "positionId", static: false, private: false, access: { has: obj => "positionId" in obj, get: obj => obj.positionId, set: (obj, value) => { obj.positionId = value; } }, metadata: _metadata }, _positionId_initializers, _positionId_extraInitializers);
        __esDecorate(null, null, _workLocation_decorators, { kind: "field", name: "workLocation", static: false, private: false, access: { has: obj => "workLocation" in obj, get: obj => obj.workLocation, set: (obj, value) => { obj.workLocation = value; } }, metadata: _metadata }, _workLocation_initializers, _workLocation_extraInitializers);
        __esDecorate(null, null, _homeAddress_decorators, { kind: "field", name: "homeAddress", static: false, private: false, access: { has: obj => "homeAddress" in obj, get: obj => obj.homeAddress, set: (obj, value) => { obj.homeAddress = value; } }, metadata: _metadata }, _homeAddress_initializers, _homeAddress_extraInitializers);
        __esDecorate(null, null, _languagePreference_decorators, { kind: "field", name: "languagePreference", static: false, private: false, access: { has: obj => "languagePreference" in obj, get: obj => obj.languagePreference, set: (obj, value) => { obj.languagePreference = value; } }, metadata: _metadata }, _languagePreference_initializers, _languagePreference_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _timezone_decorators, { kind: "field", name: "timezone", static: false, private: false, access: { has: obj => "timezone" in obj, get: obj => obj.timezone, set: (obj, value) => { obj.timezone = value; } }, metadata: _metadata }, _timezone_initializers, _timezone_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _manager_decorators, { kind: "field", name: "manager", static: false, private: false, access: { has: obj => "manager" in obj, get: obj => obj.manager, set: (obj, value) => { obj.manager = value; } }, metadata: _metadata }, _manager_initializers, _manager_extraInitializers);
        __esDecorate(null, null, _emergencyContacts_decorators, { kind: "field", name: "emergencyContacts", static: false, private: false, access: { has: obj => "emergencyContacts" in obj, get: obj => obj.emergencyContacts, set: (obj, value) => { obj.emergencyContacts = value; } }, metadata: _metadata }, _emergencyContacts_initializers, _emergencyContacts_extraInitializers);
        __esDecorate(null, null, _dependents_decorators, { kind: "field", name: "dependents", static: false, private: false, access: { has: obj => "dependents" in obj, get: obj => obj.dependents, set: (obj, value) => { obj.dependents = value; } }, metadata: _metadata }, _dependents_initializers, _dependents_extraInitializers);
        __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: obj => "documents" in obj, get: obj => obj.documents, set: (obj, value) => { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
        __esDecorate(null, null, _gdprConsents_decorators, { kind: "field", name: "gdprConsents", static: false, private: false, access: { has: obj => "gdprConsents" in obj, get: obj => obj.gdprConsents, set: (obj, value) => { obj.gdprConsents = value; } }, metadata: _metadata }, _gdprConsents_initializers, _gdprConsents_extraInitializers);
        __esDecorate(null, null, _auditLogs_decorators, { kind: "field", name: "auditLogs", static: false, private: false, access: { has: obj => "auditLogs" in obj, get: obj => obj.auditLogs, set: (obj, value) => { obj.auditLogs = value; } }, metadata: _metadata }, _auditLogs_initializers, _auditLogs_extraInitializers);
        __esDecorate(null, null, _compensationHistory_decorators, { kind: "field", name: "compensationHistory", static: false, private: false, access: { has: obj => "compensationHistory" in obj, get: obj => obj.compensationHistory, set: (obj, value) => { obj.compensationHistory = value; } }, metadata: _metadata }, _compensationHistory_initializers, _compensationHistory_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmployeeModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmployeeModel = _classThis;
})();
exports.EmployeeModel = EmployeeModel;
/**
 * Emergency Contact Model
 */
let EmergencyContactModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'employee_emergency_contacts',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['is_primary'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _relationship_decorators;
    let _relationship_initializers = [];
    let _relationship_extraInitializers = [];
    let _phoneNumber_decorators;
    let _phoneNumber_initializers = [];
    let _phoneNumber_extraInitializers = [];
    let _alternatePhone_decorators;
    let _alternatePhone_initializers = [];
    let _alternatePhone_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _isPrimary_decorators;
    let _isPrimary_initializers = [];
    let _isPrimary_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var EmergencyContactModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.name = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.relationship = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _relationship_initializers, void 0));
            this.phoneNumber = (__runInitializers(this, _relationship_extraInitializers), __runInitializers(this, _phoneNumber_initializers, void 0));
            this.alternatePhone = (__runInitializers(this, _phoneNumber_extraInitializers), __runInitializers(this, _alternatePhone_initializers, void 0));
            this.email = (__runInitializers(this, _alternatePhone_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.address = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _address_initializers, void 0));
            this.isPrimary = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _isPrimary_initializers, void 0));
            this.notes = (__runInitializers(this, _isPrimary_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.employee = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            this.createdAt = (__runInitializers(this, _employee_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EmergencyContactModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => EmployeeModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                comment: 'Contact name',
            })];
        _relationship_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EmergencyRelationship)),
                allowNull: false,
                comment: 'Relationship to employee',
            })];
        _phoneNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: false,
                field: 'phone_number',
                comment: 'Primary phone number',
            })];
        _alternatePhone_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: true,
                field: 'alternate_phone',
                comment: 'Alternate phone number',
            })];
        _email_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                comment: 'Email address',
            })];
        _address_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                comment: 'Contact address',
            })];
        _isPrimary_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_primary',
                comment: 'Primary emergency contact',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                comment: 'Additional notes',
            })];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => EmployeeModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _relationship_decorators, { kind: "field", name: "relationship", static: false, private: false, access: { has: obj => "relationship" in obj, get: obj => obj.relationship, set: (obj, value) => { obj.relationship = value; } }, metadata: _metadata }, _relationship_initializers, _relationship_extraInitializers);
        __esDecorate(null, null, _phoneNumber_decorators, { kind: "field", name: "phoneNumber", static: false, private: false, access: { has: obj => "phoneNumber" in obj, get: obj => obj.phoneNumber, set: (obj, value) => { obj.phoneNumber = value; } }, metadata: _metadata }, _phoneNumber_initializers, _phoneNumber_extraInitializers);
        __esDecorate(null, null, _alternatePhone_decorators, { kind: "field", name: "alternatePhone", static: false, private: false, access: { has: obj => "alternatePhone" in obj, get: obj => obj.alternatePhone, set: (obj, value) => { obj.alternatePhone = value; } }, metadata: _metadata }, _alternatePhone_initializers, _alternatePhone_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _isPrimary_decorators, { kind: "field", name: "isPrimary", static: false, private: false, access: { has: obj => "isPrimary" in obj, get: obj => obj.isPrimary, set: (obj, value) => { obj.isPrimary = value; } }, metadata: _metadata }, _isPrimary_initializers, _isPrimary_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmergencyContactModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmergencyContactModel = _classThis;
})();
exports.EmergencyContactModel = EmergencyContactModel;
/**
 * Dependent Model
 */
let DependentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'employee_dependents',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['date_of_birth'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _dateOfBirth_decorators;
    let _dateOfBirth_initializers = [];
    let _dateOfBirth_extraInitializers = [];
    let _relationship_decorators;
    let _relationship_initializers = [];
    let _relationship_extraInitializers = [];
    let _gender_decorators;
    let _gender_initializers = [];
    let _gender_extraInitializers = [];
    let _nationalId_decorators;
    let _nationalId_initializers = [];
    let _nationalId_extraInitializers = [];
    let _isStudent_decorators;
    let _isStudent_initializers = [];
    let _isStudent_extraInitializers = [];
    let _isDisabled_decorators;
    let _isDisabled_initializers = [];
    let _isDisabled_extraInitializers = [];
    let _coverageStartDate_decorators;
    let _coverageStartDate_initializers = [];
    let _coverageStartDate_extraInitializers = [];
    let _coverageEndDate_decorators;
    let _coverageEndDate_initializers = [];
    let _coverageEndDate_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var DependentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.firstName = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
            this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
            this.dateOfBirth = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _dateOfBirth_initializers, void 0));
            this.relationship = (__runInitializers(this, _dateOfBirth_extraInitializers), __runInitializers(this, _relationship_initializers, void 0));
            this.gender = (__runInitializers(this, _relationship_extraInitializers), __runInitializers(this, _gender_initializers, void 0));
            this.nationalId = (__runInitializers(this, _gender_extraInitializers), __runInitializers(this, _nationalId_initializers, void 0));
            this.isStudent = (__runInitializers(this, _nationalId_extraInitializers), __runInitializers(this, _isStudent_initializers, void 0));
            this.isDisabled = (__runInitializers(this, _isStudent_extraInitializers), __runInitializers(this, _isDisabled_initializers, void 0));
            this.coverageStartDate = (__runInitializers(this, _isDisabled_extraInitializers), __runInitializers(this, _coverageStartDate_initializers, void 0));
            this.coverageEndDate = (__runInitializers(this, _coverageStartDate_extraInitializers), __runInitializers(this, _coverageEndDate_initializers, void 0));
            this.employee = (__runInitializers(this, _coverageEndDate_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            this.createdAt = (__runInitializers(this, _employee_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DependentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => EmployeeModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _firstName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'first_name',
            })];
        _lastName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'last_name',
            })];
        _dateOfBirth_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: false,
                field: 'date_of_birth',
            })];
        _relationship_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                comment: 'Relationship to employee',
            })];
        _gender_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(Gender)),
                allowNull: true,
            })];
        _nationalId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
                field: 'national_id',
            })];
        _isStudent_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: true,
                defaultValue: false,
                field: 'is_student',
            })];
        _isDisabled_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: true,
                defaultValue: false,
                field: 'is_disabled',
            })];
        _coverageStartDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'coverage_start_date',
            })];
        _coverageEndDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'coverage_end_date',
            })];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => EmployeeModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
        __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
        __esDecorate(null, null, _dateOfBirth_decorators, { kind: "field", name: "dateOfBirth", static: false, private: false, access: { has: obj => "dateOfBirth" in obj, get: obj => obj.dateOfBirth, set: (obj, value) => { obj.dateOfBirth = value; } }, metadata: _metadata }, _dateOfBirth_initializers, _dateOfBirth_extraInitializers);
        __esDecorate(null, null, _relationship_decorators, { kind: "field", name: "relationship", static: false, private: false, access: { has: obj => "relationship" in obj, get: obj => obj.relationship, set: (obj, value) => { obj.relationship = value; } }, metadata: _metadata }, _relationship_initializers, _relationship_extraInitializers);
        __esDecorate(null, null, _gender_decorators, { kind: "field", name: "gender", static: false, private: false, access: { has: obj => "gender" in obj, get: obj => obj.gender, set: (obj, value) => { obj.gender = value; } }, metadata: _metadata }, _gender_initializers, _gender_extraInitializers);
        __esDecorate(null, null, _nationalId_decorators, { kind: "field", name: "nationalId", static: false, private: false, access: { has: obj => "nationalId" in obj, get: obj => obj.nationalId, set: (obj, value) => { obj.nationalId = value; } }, metadata: _metadata }, _nationalId_initializers, _nationalId_extraInitializers);
        __esDecorate(null, null, _isStudent_decorators, { kind: "field", name: "isStudent", static: false, private: false, access: { has: obj => "isStudent" in obj, get: obj => obj.isStudent, set: (obj, value) => { obj.isStudent = value; } }, metadata: _metadata }, _isStudent_initializers, _isStudent_extraInitializers);
        __esDecorate(null, null, _isDisabled_decorators, { kind: "field", name: "isDisabled", static: false, private: false, access: { has: obj => "isDisabled" in obj, get: obj => obj.isDisabled, set: (obj, value) => { obj.isDisabled = value; } }, metadata: _metadata }, _isDisabled_initializers, _isDisabled_extraInitializers);
        __esDecorate(null, null, _coverageStartDate_decorators, { kind: "field", name: "coverageStartDate", static: false, private: false, access: { has: obj => "coverageStartDate" in obj, get: obj => obj.coverageStartDate, set: (obj, value) => { obj.coverageStartDate = value; } }, metadata: _metadata }, _coverageStartDate_initializers, _coverageStartDate_extraInitializers);
        __esDecorate(null, null, _coverageEndDate_decorators, { kind: "field", name: "coverageEndDate", static: false, private: false, access: { has: obj => "coverageEndDate" in obj, get: obj => obj.coverageEndDate, set: (obj, value) => { obj.coverageEndDate = value; } }, metadata: _metadata }, _coverageEndDate_initializers, _coverageEndDate_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DependentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DependentModel = _classThis;
})();
exports.DependentModel = DependentModel;
/**
 * Employee Document Model
 */
let EmployeeDocumentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'employee_documents',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['document_type'] },
                { fields: ['expiry_date'] },
                { fields: ['is_confidential'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _fileName_decorators;
    let _fileName_initializers = [];
    let _fileName_extraInitializers = [];
    let _filePath_decorators;
    let _filePath_initializers = [];
    let _filePath_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _mimeType_decorators;
    let _mimeType_initializers = [];
    let _mimeType_extraInitializers = [];
    let _uploadedBy_decorators;
    let _uploadedBy_initializers = [];
    let _uploadedBy_extraInitializers = [];
    let _uploadedAt_decorators;
    let _uploadedAt_initializers = [];
    let _uploadedAt_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _isConfidential_decorators;
    let _isConfidential_initializers = [];
    let _isConfidential_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var EmployeeDocumentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.documentType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
            this.fileName = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _fileName_initializers, void 0));
            this.filePath = (__runInitializers(this, _fileName_extraInitializers), __runInitializers(this, _filePath_initializers, void 0));
            this.fileSize = (__runInitializers(this, _filePath_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
            this.mimeType = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _mimeType_initializers, void 0));
            this.uploadedBy = (__runInitializers(this, _mimeType_extraInitializers), __runInitializers(this, _uploadedBy_initializers, void 0));
            this.uploadedAt = (__runInitializers(this, _uploadedBy_extraInitializers), __runInitializers(this, _uploadedAt_initializers, void 0));
            this.expiryDate = (__runInitializers(this, _uploadedAt_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
            this.isConfidential = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _isConfidential_initializers, void 0));
            this.metadata = (__runInitializers(this, _isConfidential_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.employee = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            this.createdAt = (__runInitializers(this, _employee_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EmployeeDocumentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => EmployeeModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _documentType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(DocumentType)),
                allowNull: false,
                field: 'document_type',
            })];
        _fileName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'file_name',
            })];
        _filePath_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
                field: 'file_path',
            })];
        _fileSize_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                field: 'file_size',
                comment: 'File size in bytes',
            })];
        _mimeType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'mime_type',
            })];
        _uploadedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'uploaded_by',
            })];
        _uploadedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
                field: 'uploaded_at',
            })];
        _expiryDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'expiry_date',
            })];
        _isConfidential_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_confidential',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => EmployeeModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
        __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: obj => "fileName" in obj, get: obj => obj.fileName, set: (obj, value) => { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
        __esDecorate(null, null, _filePath_decorators, { kind: "field", name: "filePath", static: false, private: false, access: { has: obj => "filePath" in obj, get: obj => obj.filePath, set: (obj, value) => { obj.filePath = value; } }, metadata: _metadata }, _filePath_initializers, _filePath_extraInitializers);
        __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
        __esDecorate(null, null, _mimeType_decorators, { kind: "field", name: "mimeType", static: false, private: false, access: { has: obj => "mimeType" in obj, get: obj => obj.mimeType, set: (obj, value) => { obj.mimeType = value; } }, metadata: _metadata }, _mimeType_initializers, _mimeType_extraInitializers);
        __esDecorate(null, null, _uploadedBy_decorators, { kind: "field", name: "uploadedBy", static: false, private: false, access: { has: obj => "uploadedBy" in obj, get: obj => obj.uploadedBy, set: (obj, value) => { obj.uploadedBy = value; } }, metadata: _metadata }, _uploadedBy_initializers, _uploadedBy_extraInitializers);
        __esDecorate(null, null, _uploadedAt_decorators, { kind: "field", name: "uploadedAt", static: false, private: false, access: { has: obj => "uploadedAt" in obj, get: obj => obj.uploadedAt, set: (obj, value) => { obj.uploadedAt = value; } }, metadata: _metadata }, _uploadedAt_initializers, _uploadedAt_extraInitializers);
        __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
        __esDecorate(null, null, _isConfidential_decorators, { kind: "field", name: "isConfidential", static: false, private: false, access: { has: obj => "isConfidential" in obj, get: obj => obj.isConfidential, set: (obj, value) => { obj.isConfidential = value; } }, metadata: _metadata }, _isConfidential_initializers, _isConfidential_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmployeeDocumentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmployeeDocumentModel = _classThis;
})();
exports.EmployeeDocumentModel = EmployeeDocumentModel;
/**
 * GDPR Consent Model
 */
let GDPRConsentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'employee_gdpr_consents',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['consent_type'] },
                { fields: ['granted'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _consentType_decorators;
    let _consentType_initializers = [];
    let _consentType_extraInitializers = [];
    let _granted_decorators;
    let _granted_initializers = [];
    let _granted_extraInitializers = [];
    let _grantedAt_decorators;
    let _grantedAt_initializers = [];
    let _grantedAt_extraInitializers = [];
    let _revokedAt_decorators;
    let _revokedAt_initializers = [];
    let _revokedAt_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var GDPRConsentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.consentType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _consentType_initializers, void 0));
            this.granted = (__runInitializers(this, _consentType_extraInitializers), __runInitializers(this, _granted_initializers, void 0));
            this.grantedAt = (__runInitializers(this, _granted_extraInitializers), __runInitializers(this, _grantedAt_initializers, void 0));
            this.revokedAt = (__runInitializers(this, _grantedAt_extraInitializers), __runInitializers(this, _revokedAt_initializers, void 0));
            this.version = (__runInitializers(this, _revokedAt_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.notes = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.employee = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            this.createdAt = (__runInitializers(this, _employee_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GDPRConsentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => EmployeeModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _consentType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ConsentType)),
                allowNull: false,
                field: 'consent_type',
            })];
        _granted_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
            })];
        _grantedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'granted_at',
            })];
        _revokedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'revoked_at',
            })];
        _version_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: false,
                comment: 'Consent policy version',
            })];
        _ipAddress_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INET,
                allowNull: true,
                field: 'ip_address',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => EmployeeModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _consentType_decorators, { kind: "field", name: "consentType", static: false, private: false, access: { has: obj => "consentType" in obj, get: obj => obj.consentType, set: (obj, value) => { obj.consentType = value; } }, metadata: _metadata }, _consentType_initializers, _consentType_extraInitializers);
        __esDecorate(null, null, _granted_decorators, { kind: "field", name: "granted", static: false, private: false, access: { has: obj => "granted" in obj, get: obj => obj.granted, set: (obj, value) => { obj.granted = value; } }, metadata: _metadata }, _granted_initializers, _granted_extraInitializers);
        __esDecorate(null, null, _grantedAt_decorators, { kind: "field", name: "grantedAt", static: false, private: false, access: { has: obj => "grantedAt" in obj, get: obj => obj.grantedAt, set: (obj, value) => { obj.grantedAt = value; } }, metadata: _metadata }, _grantedAt_initializers, _grantedAt_extraInitializers);
        __esDecorate(null, null, _revokedAt_decorators, { kind: "field", name: "revokedAt", static: false, private: false, access: { has: obj => "revokedAt" in obj, get: obj => obj.revokedAt, set: (obj, value) => { obj.revokedAt = value; } }, metadata: _metadata }, _revokedAt_initializers, _revokedAt_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GDPRConsentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GDPRConsentModel = _classThis;
})();
exports.GDPRConsentModel = GDPRConsentModel;
/**
 * Employee Audit Log Model
 */
let EmployeeAuditLogModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'employee_audit_logs',
            timestamps: false,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['action'] },
                { fields: ['performed_by'] },
                { fields: ['performed_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _field_decorators;
    let _field_initializers = [];
    let _field_extraInitializers = [];
    let _oldValue_decorators;
    let _oldValue_initializers = [];
    let _oldValue_extraInitializers = [];
    let _newValue_decorators;
    let _newValue_initializers = [];
    let _newValue_extraInitializers = [];
    let _performedBy_decorators;
    let _performedBy_initializers = [];
    let _performedBy_extraInitializers = [];
    let _performedAt_decorators;
    let _performedAt_initializers = [];
    let _performedAt_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _userAgent_decorators;
    let _userAgent_initializers = [];
    let _userAgent_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    var EmployeeAuditLogModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.action = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.field = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _field_initializers, void 0));
            this.oldValue = (__runInitializers(this, _field_extraInitializers), __runInitializers(this, _oldValue_initializers, void 0));
            this.newValue = (__runInitializers(this, _oldValue_extraInitializers), __runInitializers(this, _newValue_initializers, void 0));
            this.performedBy = (__runInitializers(this, _newValue_extraInitializers), __runInitializers(this, _performedBy_initializers, void 0));
            this.performedAt = (__runInitializers(this, _performedBy_extraInitializers), __runInitializers(this, _performedAt_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _performedAt_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
            this.reason = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.employee = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            __runInitializers(this, _employee_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EmployeeAuditLogModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => EmployeeModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _action_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                comment: 'Action performed',
            })];
        _field_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
                comment: 'Field that was changed',
            })];
        _oldValue_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                field: 'old_value',
            })];
        _newValue_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                field: 'new_value',
            })];
        _performedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'performed_by',
            })];
        _performedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
                field: 'performed_at',
            })];
        _ipAddress_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INET,
                allowNull: true,
                field: 'ip_address',
            })];
        _userAgent_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'user_agent',
            })];
        _reason_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => EmployeeModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _field_decorators, { kind: "field", name: "field", static: false, private: false, access: { has: obj => "field" in obj, get: obj => obj.field, set: (obj, value) => { obj.field = value; } }, metadata: _metadata }, _field_initializers, _field_extraInitializers);
        __esDecorate(null, null, _oldValue_decorators, { kind: "field", name: "oldValue", static: false, private: false, access: { has: obj => "oldValue" in obj, get: obj => obj.oldValue, set: (obj, value) => { obj.oldValue = value; } }, metadata: _metadata }, _oldValue_initializers, _oldValue_extraInitializers);
        __esDecorate(null, null, _newValue_decorators, { kind: "field", name: "newValue", static: false, private: false, access: { has: obj => "newValue" in obj, get: obj => obj.newValue, set: (obj, value) => { obj.newValue = value; } }, metadata: _metadata }, _newValue_initializers, _newValue_extraInitializers);
        __esDecorate(null, null, _performedBy_decorators, { kind: "field", name: "performedBy", static: false, private: false, access: { has: obj => "performedBy" in obj, get: obj => obj.performedBy, set: (obj, value) => { obj.performedBy = value; } }, metadata: _metadata }, _performedBy_initializers, _performedBy_extraInitializers);
        __esDecorate(null, null, _performedAt_decorators, { kind: "field", name: "performedAt", static: false, private: false, access: { has: obj => "performedAt" in obj, get: obj => obj.performedAt, set: (obj, value) => { obj.performedAt = value; } }, metadata: _metadata }, _performedAt_initializers, _performedAt_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: obj => "userAgent" in obj, get: obj => obj.userAgent, set: (obj, value) => { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmployeeAuditLogModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmployeeAuditLogModel = _classThis;
})();
exports.EmployeeAuditLogModel = EmployeeAuditLogModel;
/**
 * Compensation History Model
 */
let CompensationHistoryModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'compensation_history',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['effective_date'] },
                { fields: ['end_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _baseSalary_decorators;
    let _baseSalary_initializers = [];
    let _baseSalary_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _payFrequency_decorators;
    let _payFrequency_initializers = [];
    let _payFrequency_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _bonusEligible_decorators;
    let _bonusEligible_initializers = [];
    let _bonusEligible_extraInitializers = [];
    let _commissionEligible_decorators;
    let _commissionEligible_initializers = [];
    let _commissionEligible_extraInitializers = [];
    let _grade_decorators;
    let _grade_initializers = [];
    let _grade_extraInitializers = [];
    let _step_decorators;
    let _step_initializers = [];
    let _step_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var CompensationHistoryModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.baseSalary = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _baseSalary_initializers, void 0));
            this.currency = (__runInitializers(this, _baseSalary_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.payFrequency = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _payFrequency_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _payFrequency_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.bonusEligible = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _bonusEligible_initializers, void 0));
            this.commissionEligible = (__runInitializers(this, _bonusEligible_extraInitializers), __runInitializers(this, _commissionEligible_initializers, void 0));
            this.grade = (__runInitializers(this, _commissionEligible_extraInitializers), __runInitializers(this, _grade_initializers, void 0));
            this.step = (__runInitializers(this, _grade_extraInitializers), __runInitializers(this, _step_initializers, void 0));
            this.notes = (__runInitializers(this, _step_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.employee = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            this.createdAt = (__runInitializers(this, _employee_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CompensationHistoryModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => EmployeeModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _baseSalary_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                field: 'base_salary',
            })];
        _currency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                allowNull: false,
            })];
        _payFrequency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('hourly', 'daily', 'weekly', 'biweekly', 'monthly', 'annual'),
                allowNull: false,
                field: 'pay_frequency',
            })];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: false,
                field: 'effective_date',
            })];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'end_date',
            })];
        _bonusEligible_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'bonus_eligible',
            })];
        _commissionEligible_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'commission_eligible',
            })];
        _grade_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(10),
                allowNull: true,
            })];
        _step_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(10),
                allowNull: true,
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => EmployeeModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _baseSalary_decorators, { kind: "field", name: "baseSalary", static: false, private: false, access: { has: obj => "baseSalary" in obj, get: obj => obj.baseSalary, set: (obj, value) => { obj.baseSalary = value; } }, metadata: _metadata }, _baseSalary_initializers, _baseSalary_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _payFrequency_decorators, { kind: "field", name: "payFrequency", static: false, private: false, access: { has: obj => "payFrequency" in obj, get: obj => obj.payFrequency, set: (obj, value) => { obj.payFrequency = value; } }, metadata: _metadata }, _payFrequency_initializers, _payFrequency_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _bonusEligible_decorators, { kind: "field", name: "bonusEligible", static: false, private: false, access: { has: obj => "bonusEligible" in obj, get: obj => obj.bonusEligible, set: (obj, value) => { obj.bonusEligible = value; } }, metadata: _metadata }, _bonusEligible_initializers, _bonusEligible_extraInitializers);
        __esDecorate(null, null, _commissionEligible_decorators, { kind: "field", name: "commissionEligible", static: false, private: false, access: { has: obj => "commissionEligible" in obj, get: obj => obj.commissionEligible, set: (obj, value) => { obj.commissionEligible = value; } }, metadata: _metadata }, _commissionEligible_initializers, _commissionEligible_extraInitializers);
        __esDecorate(null, null, _grade_decorators, { kind: "field", name: "grade", static: false, private: false, access: { has: obj => "grade" in obj, get: obj => obj.grade, set: (obj, value) => { obj.grade = value; } }, metadata: _metadata }, _grade_initializers, _grade_extraInitializers);
        __esDecorate(null, null, _step_decorators, { kind: "field", name: "step", static: false, private: false, access: { has: obj => "step" in obj, get: obj => obj.step, set: (obj, value) => { obj.step = value; } }, metadata: _metadata }, _step_initializers, _step_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CompensationHistoryModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CompensationHistoryModel = _classThis;
})();
exports.CompensationHistoryModel = CompensationHistoryModel;
// ============================================================================
// CORE EMPLOYEE FUNCTIONS - PROFILE MANAGEMENT
// ============================================================================
/**
 * Create new employee profile
 *
 * @param profileData - Employee profile data
 * @param transaction - Optional transaction
 * @returns Created employee
 *
 * @example
 * ```typescript
 * const employee = await createEmployee({
 *   employeeNumber: 'EMP001',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@company.com',
 *   ...
 * });
 * ```
 */
async function createEmployee(profileData, transaction) {
    // Validate input
    const validated = exports.EmployeeProfileSchema.parse(profileData);
    // Check for duplicate employee number
    const existing = await EmployeeModel.findOne({
        where: { employeeNumber: validated.employeeNumber },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`Employee number ${validated.employeeNumber} already exists`);
    }
    // Check for duplicate email
    const existingEmail = await EmployeeModel.findOne({
        where: { email: validated.email },
        transaction,
    });
    if (existingEmail) {
        throw new common_1.ConflictException(`Email ${validated.email} already exists`);
    }
    // Create employee
    const employee = await EmployeeModel.create(validated, { transaction });
    // Log creation
    await logEmployeeAction({
        employeeId: employee.id,
        action: 'CREATED',
        performedBy: 'system',
        performedAt: new Date(),
    }, transaction);
    return employee;
}
/**
 * Update employee profile
 *
 * @param employeeId - Employee ID
 * @param updates - Fields to update
 * @param performedBy - User performing update
 * @param transaction - Optional transaction
 * @returns Updated employee
 *
 * @example
 * ```typescript
 * await updateEmployee('uuid', { status: EmployeeStatus.INACTIVE }, 'admin-id');
 * ```
 */
async function updateEmployee(employeeId, updates, performedBy, transaction) {
    const employee = await EmployeeModel.findByPk(employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    // Track changes for audit
    const changes = [];
    Object.keys(updates).forEach((key) => {
        if (employee[key] !== updates[key]) {
            changes.push({
                field: key,
                oldValue: employee[key],
                newValue: updates[key],
            });
        }
    });
    // Update employee
    await employee.update(updates, { transaction });
    // Log changes
    for (const change of changes) {
        await logEmployeeAction({
            employeeId,
            action: 'UPDATED',
            field: change.field,
            oldValue: change.oldValue,
            newValue: change.newValue,
            performedBy,
            performedAt: new Date(),
        }, transaction);
    }
    return employee;
}
/**
 * Get employee by ID
 *
 * @param employeeId - Employee ID
 * @param includeRelations - Include related data
 * @returns Employee or null
 *
 * @example
 * ```typescript
 * const employee = await getEmployeeById('uuid', true);
 * ```
 */
async function getEmployeeById(employeeId, includeRelations = false) {
    const options = {
        where: { id: employeeId },
    };
    if (includeRelations) {
        options.include = [
            { model: EmergencyContactModel, as: 'emergencyContacts' },
            { model: DependentModel, as: 'dependents' },
            { model: GDPRConsentModel, as: 'gdprConsents' },
            { model: CompensationHistoryModel, as: 'compensationHistory' },
        ];
    }
    return EmployeeModel.findOne(options);
}
/**
 * Get employee by employee number
 *
 * @param employeeNumber - Employee number
 * @returns Employee or null
 *
 * @example
 * ```typescript
 * const employee = await getEmployeeByNumber('EMP001');
 * ```
 */
async function getEmployeeByNumber(employeeNumber) {
    return EmployeeModel.findOne({
        where: { employeeNumber },
    });
}
/**
 * Get employee by email
 *
 * @param email - Email address
 * @returns Employee or null
 *
 * @example
 * ```typescript
 * const employee = await getEmployeeByEmail('john@company.com');
 * ```
 */
async function getEmployeeByEmail(email) {
    return EmployeeModel.findOne({
        where: { email },
    });
}
/**
 * Delete employee (soft delete)
 *
 * @param employeeId - Employee ID
 * @param performedBy - User performing deletion
 * @param reason - Reason for deletion
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await deleteEmployee('uuid', 'admin-id', 'Terminated');
 * ```
 */
async function deleteEmployee(employeeId, performedBy, reason, transaction) {
    const employee = await EmployeeModel.findByPk(employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    await employee.destroy({ transaction });
    await logEmployeeAction({
        employeeId,
        action: 'DELETED',
        performedBy,
        performedAt: new Date(),
        reason,
    }, transaction);
}
/**
 * Search employees with filters
 *
 * @param filters - Search filters
 * @param page - Page number
 * @param limit - Results per page
 * @returns Search results
 *
 * @example
 * ```typescript
 * const results = await searchEmployees({ status: [EmployeeStatus.ACTIVE] }, 1, 20);
 * ```
 */
async function searchEmployees(filters, page = 1, limit = 20) {
    const where = {};
    if (filters.status && filters.status.length > 0) {
        where.status = { [sequelize_1.Op.in]: filters.status };
    }
    if (filters.employmentType && filters.employmentType.length > 0) {
        where.employmentType = { [sequelize_1.Op.in]: filters.employmentType };
    }
    if (filters.classification && filters.classification.length > 0) {
        where.classification = { [sequelize_1.Op.in]: filters.classification };
    }
    if (filters.departmentId && filters.departmentId.length > 0) {
        where.departmentId = { [sequelize_1.Op.in]: filters.departmentId };
    }
    if (filters.managerId && filters.managerId.length > 0) {
        where.managerId = { [sequelize_1.Op.in]: filters.managerId };
    }
    if (filters.hiredAfter) {
        where.hireDate = { [sequelize_1.Op.gte]: filters.hiredAfter };
    }
    if (filters.hiredBefore) {
        where.hireDate = { ...where.hireDate, [sequelize_1.Op.lte]: filters.hiredBefore };
    }
    if (filters.location) {
        where.workLocation = { [sequelize_1.Op.iLike]: `%${filters.location}%` };
    }
    if (filters.hasPhoto !== undefined) {
        if (filters.hasPhoto) {
            where.photoUrl = { [sequelize_1.Op.ne]: null };
        }
        else {
            where.photoUrl = { [sequelize_1.Op.is]: null };
        }
    }
    if (filters.onProbation) {
        where.probationEndDate = { [sequelize_1.Op.gte]: new Date() };
    }
    if (filters.searchTerm) {
        where[sequelize_1.Op.or] = [
            { firstName: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { lastName: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { email: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { employeeNumber: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
        ];
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await EmployeeModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    });
    return {
        employees: rows,
        total: count,
        pages: Math.ceil(count / limit),
    };
}
// ============================================================================
// EMPLOYEE STATUS MANAGEMENT
// ============================================================================
/**
 * Update employee status
 *
 * @param employeeId - Employee ID
 * @param newStatus - New status
 * @param performedBy - User performing action
 * @param reason - Reason for status change
 * @param effectiveDate - Effective date
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await updateEmployeeStatus('uuid', EmployeeStatus.ON_LEAVE, 'manager-id', 'Medical leave');
 * ```
 */
async function updateEmployeeStatus(employeeId, newStatus, performedBy, reason, effectiveDate, transaction) {
    const employee = await EmployeeModel.findByPk(employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    const oldStatus = employee.status;
    await employee.update({ status: newStatus }, { transaction });
    await logEmployeeAction({
        employeeId,
        action: 'STATUS_CHANGED',
        field: 'status',
        oldValue: oldStatus,
        newValue: newStatus,
        performedBy,
        performedAt: effectiveDate || new Date(),
        reason,
    }, transaction);
}
/**
 * Terminate employee
 *
 * @param employeeId - Employee ID
 * @param terminationDate - Termination date
 * @param performedBy - User performing action
 * @param reason - Termination reason
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await terminateEmployee('uuid', new Date(), 'hr-id', 'Resigned');
 * ```
 */
async function terminateEmployee(employeeId, terminationDate, performedBy, reason, transaction) {
    const employee = await EmployeeModel.findByPk(employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    if (employee.status === EmployeeStatus.TERMINATED) {
        throw new common_1.BadRequestException('Employee is already terminated');
    }
    await employee.update({
        status: EmployeeStatus.TERMINATED,
        terminationDate,
    }, { transaction });
    await logEmployeeAction({
        employeeId,
        action: 'TERMINATED',
        performedBy,
        performedAt: terminationDate,
        reason,
    }, transaction);
}
/**
 * Reactivate terminated employee
 *
 * @param employeeId - Employee ID
 * @param performedBy - User performing action
 * @param reason - Reactivation reason
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await reactivateEmployee('uuid', 'hr-id', 'Re-hired');
 * ```
 */
async function reactivateEmployee(employeeId, performedBy, reason, transaction) {
    const employee = await EmployeeModel.findByPk(employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    await employee.update({
        status: EmployeeStatus.ACTIVE,
        terminationDate: null,
    }, { transaction });
    await logEmployeeAction({
        employeeId,
        action: 'REACTIVATED',
        performedBy,
        performedAt: new Date(),
        reason,
    }, transaction);
}
/**
 * Check if employee is active
 *
 * @param employeeId - Employee ID
 * @returns True if active
 *
 * @example
 * ```typescript
 * const active = await isEmployeeActive('uuid');
 * ```
 */
async function isEmployeeActive(employeeId) {
    const employee = await EmployeeModel.findByPk(employeeId);
    return employee?.status === EmployeeStatus.ACTIVE;
}
/**
 * Get employees by status
 *
 * @param status - Employee status
 * @param limit - Max results
 * @returns Employees
 *
 * @example
 * ```typescript
 * const active = await getEmployeesByStatus(EmployeeStatus.ACTIVE, 100);
 * ```
 */
async function getEmployeesByStatus(status, limit) {
    return EmployeeModel.findAll({
        where: { status },
        limit,
        order: [['lastName', 'ASC']],
    });
}
// ============================================================================
// EMERGENCY CONTACTS MANAGEMENT
// ============================================================================
/**
 * Add emergency contact
 *
 * @param employeeId - Employee ID
 * @param contactData - Contact data
 * @param transaction - Optional transaction
 * @returns Created contact
 *
 * @example
 * ```typescript
 * await addEmergencyContact('uuid', { name: 'Jane Doe', ... });
 * ```
 */
async function addEmergencyContact(employeeId, contactData, transaction) {
    const validated = exports.EmergencyContactSchema.parse(contactData);
    // If this is primary, unset other primary contacts
    if (validated.isPrimary) {
        await EmergencyContactModel.update({ isPrimary: false }, { where: { employeeId, isPrimary: true }, transaction });
    }
    return EmergencyContactModel.create({
        employeeId,
        ...validated,
    }, { transaction });
}
/**
 * Update emergency contact
 *
 * @param contactId - Contact ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated contact
 *
 * @example
 * ```typescript
 * await updateEmergencyContact('uuid', { phoneNumber: '555-1234' });
 * ```
 */
async function updateEmergencyContact(contactId, updates, transaction) {
    const contact = await EmergencyContactModel.findByPk(contactId, { transaction });
    if (!contact) {
        throw new common_1.NotFoundException(`Emergency contact ${contactId} not found`);
    }
    // If setting as primary, unset other primary contacts
    if (updates.isPrimary) {
        await EmergencyContactModel.update({ isPrimary: false }, { where: { employeeId: contact.employeeId, isPrimary: true }, transaction });
    }
    await contact.update(updates, { transaction });
    return contact;
}
/**
 * Remove emergency contact
 *
 * @param contactId - Contact ID
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await removeEmergencyContact('uuid');
 * ```
 */
async function removeEmergencyContact(contactId, transaction) {
    const contact = await EmergencyContactModel.findByPk(contactId, { transaction });
    if (!contact) {
        throw new common_1.NotFoundException(`Emergency contact ${contactId} not found`);
    }
    await contact.destroy({ transaction });
}
/**
 * Get employee emergency contacts
 *
 * @param employeeId - Employee ID
 * @returns Emergency contacts
 *
 * @example
 * ```typescript
 * const contacts = await getEmergencyContacts('uuid');
 * ```
 */
async function getEmergencyContacts(employeeId) {
    return EmergencyContactModel.findAll({
        where: { employeeId },
        order: [['isPrimary', 'DESC'], ['name', 'ASC']],
    });
}
/**
 * Get primary emergency contact
 *
 * @param employeeId - Employee ID
 * @returns Primary contact or null
 *
 * @example
 * ```typescript
 * const primary = await getPrimaryEmergencyContact('uuid');
 * ```
 */
async function getPrimaryEmergencyContact(employeeId) {
    return EmergencyContactModel.findOne({
        where: { employeeId, isPrimary: true },
    });
}
// ============================================================================
// DEPENDENTS MANAGEMENT
// ============================================================================
/**
 * Add dependent
 *
 * @param employeeId - Employee ID
 * @param dependentData - Dependent data
 * @param transaction - Optional transaction
 * @returns Created dependent
 *
 * @example
 * ```typescript
 * await addDependent('uuid', { firstName: 'Child', ... });
 * ```
 */
async function addDependent(employeeId, dependentData, transaction) {
    const validated = exports.DependentSchema.parse(dependentData);
    return DependentModel.create({
        employeeId,
        ...validated,
    }, { transaction });
}
/**
 * Update dependent
 *
 * @param dependentId - Dependent ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated dependent
 *
 * @example
 * ```typescript
 * await updateDependent('uuid', { isStudent: true });
 * ```
 */
async function updateDependent(dependentId, updates, transaction) {
    const dependent = await DependentModel.findByPk(dependentId, { transaction });
    if (!dependent) {
        throw new common_1.NotFoundException(`Dependent ${dependentId} not found`);
    }
    await dependent.update(updates, { transaction });
    return dependent;
}
/**
 * Remove dependent
 *
 * @param dependentId - Dependent ID
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await removeDependent('uuid');
 * ```
 */
async function removeDependent(dependentId, transaction) {
    const dependent = await DependentModel.findByPk(dependentId, { transaction });
    if (!dependent) {
        throw new common_1.NotFoundException(`Dependent ${dependentId} not found`);
    }
    await dependent.destroy({ transaction });
}
/**
 * Get employee dependents
 *
 * @param employeeId - Employee ID
 * @returns Dependents
 *
 * @example
 * ```typescript
 * const dependents = await getDependents('uuid');
 * ```
 */
async function getDependents(employeeId) {
    return DependentModel.findAll({
        where: { employeeId },
        order: [['dateOfBirth', 'ASC']],
    });
}
/**
 * Get minor dependents
 *
 * @param employeeId - Employee ID
 * @param ageLimit - Age limit (default 18)
 * @returns Minor dependents
 *
 * @example
 * ```typescript
 * const minors = await getMinorDependents('uuid');
 * ```
 */
async function getMinorDependents(employeeId, ageLimit = 18) {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - ageLimit);
    return DependentModel.findAll({
        where: {
            employeeId,
            dateOfBirth: { [sequelize_1.Op.gte]: cutoffDate },
        },
    });
}
// ============================================================================
// DOCUMENT MANAGEMENT
// ============================================================================
/**
 * Upload employee document
 *
 * @param employeeId - Employee ID
 * @param documentData - Document data
 * @param uploadedBy - User uploading
 * @param transaction - Optional transaction
 * @returns Created document
 *
 * @example
 * ```typescript
 * await uploadEmployeeDocument('uuid', { ... }, 'admin-id');
 * ```
 */
async function uploadEmployeeDocument(employeeId, documentData, uploadedBy, transaction) {
    return EmployeeDocumentModel.create({
        employeeId,
        ...documentData,
        uploadedBy,
        uploadedAt: new Date(),
    }, { transaction });
}
/**
 * Get employee documents
 *
 * @param employeeId - Employee ID
 * @param documentType - Optional filter by type
 * @returns Documents
 *
 * @example
 * ```typescript
 * const docs = await getEmployeeDocuments('uuid', DocumentType.CONTRACT);
 * ```
 */
async function getEmployeeDocuments(employeeId, documentType) {
    const where = { employeeId };
    if (documentType) {
        where.documentType = documentType;
    }
    return EmployeeDocumentModel.findAll({
        where,
        order: [['uploadedAt', 'DESC']],
    });
}
/**
 * Delete employee document
 *
 * @param documentId - Document ID
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await deleteEmployeeDocument('uuid');
 * ```
 */
async function deleteEmployeeDocument(documentId, transaction) {
    const document = await EmployeeDocumentModel.findByPk(documentId, { transaction });
    if (!document) {
        throw new common_1.NotFoundException(`Document ${documentId} not found`);
    }
    await document.destroy({ transaction });
}
/**
 * Get expiring documents
 *
 * @param daysAhead - Days to look ahead
 * @returns Expiring documents
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringDocuments(30);
 * ```
 */
async function getExpiringDocuments(daysAhead = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return EmployeeDocumentModel.findAll({
        where: {
            expiryDate: {
                [sequelize_1.Op.between]: [new Date(), futureDate],
            },
        },
        order: [['expiryDate', 'ASC']],
    });
}
// ============================================================================
// GDPR COMPLIANCE
// ============================================================================
/**
 * Record GDPR consent
 *
 * @param employeeId - Employee ID
 * @param consentData - Consent data
 * @param transaction - Optional transaction
 * @returns Created consent
 *
 * @example
 * ```typescript
 * await recordGDPRConsent('uuid', { ... });
 * ```
 */
async function recordGDPRConsent(employeeId, consentData, transaction) {
    const validated = exports.GDPRConsentSchema.parse(consentData);
    return GDPRConsentModel.create({
        employeeId,
        ...validated,
    }, { transaction });
}
/**
 * Revoke GDPR consent
 *
 * @param employeeId - Employee ID
 * @param consentType - Consent type
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await revokeGDPRConsent('uuid', ConsentType.MARKETING);
 * ```
 */
async function revokeGDPRConsent(employeeId, consentType, transaction) {
    await GDPRConsentModel.update({ granted: false, revokedAt: new Date() }, { where: { employeeId, consentType }, transaction });
}
/**
 * Get GDPR consents
 *
 * @param employeeId - Employee ID
 * @returns Consents
 *
 * @example
 * ```typescript
 * const consents = await getGDPRConsents('uuid');
 * ```
 */
async function getGDPRConsents(employeeId) {
    return GDPRConsentModel.findAll({
        where: { employeeId },
        order: [['createdAt', 'DESC']],
    });
}
/**
 * Check specific consent
 *
 * @param employeeId - Employee ID
 * @param consentType - Consent type
 * @returns True if granted
 *
 * @example
 * ```typescript
 * const hasConsent = await hasGDPRConsent('uuid', ConsentType.MARKETING);
 * ```
 */
async function hasGDPRConsent(employeeId, consentType) {
    const consent = await GDPRConsentModel.findOne({
        where: { employeeId, consentType, granted: true },
    });
    return !!consent;
}
/**
 * Export employee data (GDPR right to data portability)
 *
 * @param employeeId - Employee ID
 * @returns Complete employee data
 *
 * @example
 * ```typescript
 * const data = await exportEmployeeData('uuid');
 * ```
 */
async function exportEmployeeData(employeeId) {
    const employee = await EmployeeModel.findByPk(employeeId, {
        include: [
            { model: EmergencyContactModel, as: 'emergencyContacts' },
            { model: DependentModel, as: 'dependents' },
            { model: EmployeeDocumentModel, as: 'documents' },
            { model: GDPRConsentModel, as: 'gdprConsents' },
            { model: CompensationHistoryModel, as: 'compensationHistory' },
        ],
    });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    return employee.toJSON();
}
/**
 * Anonymize employee data (GDPR right to be forgotten)
 *
 * @param employeeId - Employee ID
 * @param performedBy - User performing action
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await anonymizeEmployeeData('uuid', 'admin-id');
 * ```
 */
async function anonymizeEmployeeData(employeeId, performedBy, transaction) {
    const employee = await EmployeeModel.findByPk(employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    await employee.update({
        firstName: 'ANONYMIZED',
        middleName: null,
        lastName: 'EMPLOYEE',
        preferredName: null,
        email: `anonymized-${employeeId}@deleted.local`,
        personalEmail: null,
        phoneNumber: null,
        mobileNumber: null,
        nationalId: null,
        passportNumber: null,
        taxId: null,
        socialSecurityNumber: null,
        photoUrl: null,
        homeAddress: null,
        metadata: { anonymized: true, anonymizedAt: new Date() },
    }, { transaction });
    await logEmployeeAction({
        employeeId,
        action: 'ANONYMIZED',
        performedBy,
        performedAt: new Date(),
        reason: 'GDPR right to be forgotten',
    }, transaction);
}
// ============================================================================
// AUDIT LOGGING
// ============================================================================
/**
 * Log employee action
 *
 * @param logData - Log entry data
 * @param transaction - Optional transaction
 * @returns Created log entry
 *
 * @example
 * ```typescript
 * await logEmployeeAction({ employeeId: 'uuid', action: 'UPDATED', ... });
 * ```
 */
async function logEmployeeAction(logData, transaction) {
    return EmployeeAuditLogModel.create(logData, { transaction });
}
/**
 * Get employee audit trail
 *
 * @param employeeId - Employee ID
 * @param limit - Max records
 * @returns Audit logs
 *
 * @example
 * ```typescript
 * const logs = await getEmployeeAuditTrail('uuid', 50);
 * ```
 */
async function getEmployeeAuditTrail(employeeId, limit = 100) {
    return EmployeeAuditLogModel.findAll({
        where: { employeeId },
        limit,
        order: [['performedAt', 'DESC']],
    });
}
/**
 * Get field change history
 *
 * @param employeeId - Employee ID
 * @param fieldName - Field name
 * @returns Change history
 *
 * @example
 * ```typescript
 * const history = await getFieldChangeHistory('uuid', 'status');
 * ```
 */
async function getFieldChangeHistory(employeeId, fieldName) {
    return EmployeeAuditLogModel.findAll({
        where: { employeeId, field: fieldName },
        order: [['performedAt', 'DESC']],
    });
}
// ============================================================================
// COMPENSATION MANAGEMENT
// ============================================================================
/**
 * Add compensation record
 *
 * @param employeeId - Employee ID
 * @param compensationData - Compensation data
 * @param transaction - Optional transaction
 * @returns Created record
 *
 * @example
 * ```typescript
 * await addCompensation('uuid', { baseSalary: 100000, ... });
 * ```
 */
async function addCompensation(employeeId, compensationData, transaction) {
    const validated = exports.CompensationSchema.parse(compensationData);
    // End current compensation record
    await CompensationHistoryModel.update({ endDate: validated.effectiveDate }, {
        where: {
            employeeId,
            endDate: null,
        },
        transaction,
    });
    return CompensationHistoryModel.create({
        employeeId,
        ...validated,
    }, { transaction });
}
/**
 * Get current compensation
 *
 * @param employeeId - Employee ID
 * @returns Current compensation
 *
 * @example
 * ```typescript
 * const comp = await getCurrentCompensation('uuid');
 * ```
 */
async function getCurrentCompensation(employeeId) {
    return CompensationHistoryModel.findOne({
        where: { employeeId, endDate: null },
    });
}
/**
 * Get compensation history
 *
 * @param employeeId - Employee ID
 * @returns Compensation history
 *
 * @example
 * ```typescript
 * const history = await getCompensationHistory('uuid');
 * ```
 */
async function getCompensationHistory(employeeId) {
    return CompensationHistoryModel.findAll({
        where: { employeeId },
        order: [['effectiveDate', 'DESC']],
    });
}
// ============================================================================
// BULK OPERATIONS
// ============================================================================
/**
 * Bulk import employees
 *
 * @param employees - Array of employee data
 * @param performedBy - User performing import
 * @returns Import result
 *
 * @example
 * ```typescript
 * const result = await bulkImportEmployees([...], 'admin-id');
 * ```
 */
async function bulkImportEmployees(employees, performedBy) {
    const result = {
        total: employees.length,
        successful: 0,
        failed: 0,
        errors: [],
        createdIds: [],
    };
    for (let i = 0; i < employees.length; i++) {
        const employeeData = employees[i];
        try {
            const employee = await createEmployee(employeeData);
            result.successful++;
            result.createdIds.push(employee.id);
        }
        catch (error) {
            result.failed++;
            result.errors.push({
                row: i + 1,
                employeeNumber: employeeData.employeeNumber,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    return result;
}
/**
 * Bulk export employees
 *
 * @param employeeIds - Array of employee IDs
 * @returns Employee data
 *
 * @example
 * ```typescript
 * const data = await bulkExportEmployees(['uuid1', 'uuid2']);
 * ```
 */
async function bulkExportEmployees(employeeIds) {
    const employees = await EmployeeModel.findAll({
        where: { id: { [sequelize_1.Op.in]: employeeIds } },
        include: [
            { model: EmergencyContactModel, as: 'emergencyContacts' },
            { model: DependentModel, as: 'dependents' },
        ],
    });
    return employees.map((emp) => emp.toJSON());
}
/**
 * Bulk update employee status
 *
 * @param employeeIds - Array of employee IDs
 * @param newStatus - New status
 * @param performedBy - User performing action
 * @param reason - Reason for change
 * @returns Number updated
 *
 * @example
 * ```typescript
 * await bulkUpdateStatus(['uuid1', 'uuid2'], EmployeeStatus.INACTIVE, 'admin-id');
 * ```
 */
async function bulkUpdateStatus(employeeIds, newStatus, performedBy, reason) {
    const [affectedCount] = await EmployeeModel.update({ status: newStatus }, { where: { id: { [sequelize_1.Op.in]: employeeIds } } });
    // Log each change
    for (const employeeId of employeeIds) {
        await logEmployeeAction({
            employeeId,
            action: 'BULK_STATUS_UPDATE',
            field: 'status',
            newValue: newStatus,
            performedBy,
            performedAt: new Date(),
            reason,
        });
    }
    return affectedCount;
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Calculate employee tenure
 *
 * @param hireDate - Hire date
 * @param endDate - End date (defaults to today)
 * @returns Tenure in years
 *
 * @example
 * ```typescript
 * const tenure = calculateTenure(new Date('2020-01-01'));
 * ```
 */
function calculateTenure(hireDate, endDate = new Date()) {
    const years = endDate.getFullYear() - hireDate.getFullYear();
    const monthDiff = endDate.getMonth() - hireDate.getMonth();
    const dayDiff = endDate.getDate() - hireDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        return years - 1;
    }
    return years;
}
/**
 * Calculate age
 *
 * @param dateOfBirth - Date of birth
 * @returns Age in years
 *
 * @example
 * ```typescript
 * const age = calculateAge(new Date('1990-01-01'));
 * ```
 */
function calculateAge(dateOfBirth) {
    return calculateTenure(dateOfBirth);
}
/**
 * Generate employee number
 *
 * @param prefix - Prefix (e.g., 'EMP')
 * @param sequenceNumber - Sequence number
 * @param length - Total length (default 8)
 * @returns Employee number
 *
 * @example
 * ```typescript
 * const empNo = generateEmployeeNumber('EMP', 123); // EMP00123
 * ```
 */
function generateEmployeeNumber(prefix, sequenceNumber, length = 8) {
    const numberPart = String(sequenceNumber).padStart(length - prefix.length, '0');
    return `${prefix}${numberPart}`;
}
/**
 * Format employee full name
 *
 * @param employee - Employee
 * @param includeMiddle - Include middle name
 * @returns Formatted name
 *
 * @example
 * ```typescript
 * const name = formatEmployeeName(employee, true);
 * ```
 */
function formatEmployeeName(employee, includeMiddle = false) {
    const first = employee.preferredName || employee.firstName;
    const middle = includeMiddle && employee.middleName ? ` ${employee.middleName}` : '';
    return `${first}${middle} ${employee.lastName}`;
}
/**
 * Validate employee data
 *
 * @param data - Employee data
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const valid = validateEmployeeData(data);
 * ```
 */
function validateEmployeeData(data) {
    try {
        exports.EmployeeProfileSchema.parse(data);
        return { valid: true, errors: [] };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return {
                valid: false,
                errors: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
            };
        }
        return { valid: false, errors: ['Unknown validation error'] };
    }
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
/**
 * Employee Service
 */
let EmployeeService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EmployeeService = _classThis = class {
        async create(data) {
            return createEmployee(data);
        }
        async findById(id, includeRelations = false) {
            return getEmployeeById(id, includeRelations);
        }
        async findByNumber(employeeNumber) {
            return getEmployeeByNumber(employeeNumber);
        }
        async update(id, updates, performedBy) {
            return updateEmployee(id, updates, performedBy);
        }
        async delete(id, performedBy, reason) {
            return deleteEmployee(id, performedBy, reason);
        }
        async search(filters, page, limit) {
            return searchEmployees(filters, page, limit);
        }
        async terminate(id, date, performedBy, reason) {
            return terminateEmployee(id, date, performedBy, reason);
        }
        async addEmergencyContact(employeeId, contact) {
            return addEmergencyContact(employeeId, contact);
        }
        async addDependent(employeeId, dependent) {
            return addDependent(employeeId, dependent);
        }
        async exportData(employeeId) {
            return exportEmployeeData(employeeId);
        }
    };
    __setFunctionName(_classThis, "EmployeeService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmployeeService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmployeeService = _classThis;
})();
exports.EmployeeService = EmployeeService;
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Employee Controller
 */
let EmployeeController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Employees'), (0, common_1.Controller)('employees'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findOne_decorators;
    let _update_decorators;
    let _delete_decorators;
    let _search_decorators;
    var EmployeeController = _classThis = class {
        constructor(employeeService) {
            this.employeeService = (__runInitializers(this, _instanceExtraInitializers), employeeService);
        }
        async create(data) {
            return this.employeeService.create(data);
        }
        async findOne(id, includeRelations) {
            const employee = await this.employeeService.findById(id, includeRelations);
            if (!employee) {
                throw new common_1.NotFoundException(`Employee ${id} not found`);
            }
            return employee;
        }
        async update(id, updates) {
            return this.employeeService.update(id, updates, 'current-user-id');
        }
        async delete(id, reason) {
            return this.employeeService.delete(id, 'current-user-id', reason);
        }
        async search(filters, page = 1, limit = 20) {
            return this.employeeService.search(filters, page, limit);
        }
    };
    __setFunctionName(_classThis, "EmployeeController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create new employee' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Employee created' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get employee by ID' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }), (0, swagger_1.ApiQuery)({ name: 'includeRelations', required: false, type: 'boolean' })];
        _update_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update employee' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' })];
        _delete_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary: 'Delete employee' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' })];
        _search_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Search employees' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: 'number' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: 'number' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _delete_decorators, { kind: "method", name: "delete", static: false, private: false, access: { has: obj => "delete" in obj, get: obj => obj.delete }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _search_decorators, { kind: "method", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmployeeController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmployeeController = _classThis;
})();
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=employee-core-data-kit.js.map