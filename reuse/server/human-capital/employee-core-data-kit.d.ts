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
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Employee status enumeration
 */
export declare enum EmployeeStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    ON_LEAVE = "on_leave",
    SUSPENDED = "suspended",
    TERMINATED = "terminated",
    RETIRED = "retired",
    DECEASED = "deceased"
}
/**
 * Employment type enumeration
 */
export declare enum EmploymentType {
    FULL_TIME = "full_time",
    PART_TIME = "part_time",
    CONTRACT = "contract",
    TEMPORARY = "temporary",
    INTERN = "intern",
    CONSULTANT = "consultant"
}
/**
 * Gender enumeration
 */
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    NON_BINARY = "non_binary",
    PREFER_NOT_TO_SAY = "prefer_not_to_say",
    OTHER = "other"
}
/**
 * Marital status enumeration
 */
export declare enum MaritalStatus {
    SINGLE = "single",
    MARRIED = "married",
    DIVORCED = "divorced",
    WIDOWED = "widowed",
    SEPARATED = "separated",
    DOMESTIC_PARTNERSHIP = "domestic_partnership"
}
/**
 * Document type enumeration
 */
export declare enum DocumentType {
    RESUME = "resume",
    CONTRACT = "contract",
    ID_PROOF = "id_proof",
    EDUCATION = "education",
    CERTIFICATION = "certification",
    PERFORMANCE_REVIEW = "performance_review",
    DISCIPLINARY = "disciplinary",
    MEDICAL = "medical",
    OTHER = "other"
}
/**
 * Emergency contact relationship
 */
export declare enum EmergencyRelationship {
    SPOUSE = "spouse",
    PARENT = "parent",
    CHILD = "child",
    SIBLING = "sibling",
    FRIEND = "friend",
    RELATIVE = "relative",
    OTHER = "other"
}
/**
 * Employee classification
 */
export declare enum EmployeeClassification {
    EXECUTIVE = "executive",
    MANAGEMENT = "management",
    PROFESSIONAL = "professional",
    TECHNICAL = "technical",
    ADMINISTRATIVE = "administrative",
    SUPPORT = "support",
    OPERATIONS = "operations"
}
/**
 * Leave type enumeration
 */
export declare enum LeaveType {
    ANNUAL = "annual",
    SICK = "sick",
    MATERNITY = "maternity",
    PATERNITY = "paternity",
    PARENTAL = "parental",
    BEREAVEMENT = "bereavement",
    SABBATICAL = "sabbatical",
    UNPAID = "unpaid",
    MEDICAL = "medical",
    DISABILITY = "disability"
}
/**
 * Data privacy consent type
 */
export declare enum ConsentType {
    DATA_PROCESSING = "data_processing",
    MARKETING = "marketing",
    THIRD_PARTY_SHARING = "third_party_sharing",
    PHOTO_USAGE = "photo_usage",
    EMERGENCY_CONTACT = "emergency_contact"
}
/**
 * Employee profile interface
 */
export interface EmployeeProfile {
    id: string;
    employeeNumber: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    preferredName?: string;
    email: string;
    personalEmail?: string;
    phoneNumber?: string;
    mobileNumber?: string;
    dateOfBirth: Date;
    gender: Gender;
    maritalStatus?: MaritalStatus;
    nationality?: string;
    nationalId?: string;
    passportNumber?: string;
    taxId?: string;
    socialSecurityNumber?: string;
    photoUrl?: string;
    status: EmployeeStatus;
    employmentType: EmploymentType;
    classification: EmployeeClassification;
    hireDate: Date;
    terminationDate?: Date;
    probationEndDate?: Date;
    departmentId?: string;
    positionId?: string;
    managerId?: string;
    workLocation?: string;
    homeAddress?: Address;
    emergencyContacts?: EmergencyContact[];
    dependents?: Dependent[];
    languagePreference?: string;
    currency?: string;
    timezone?: string;
    gdprConsents?: GDPRConsent[];
    metadata?: Record<string, any>;
}
/**
 * Address interface
 */
export interface Address {
    street1: string;
    street2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}
/**
 * Emergency contact interface
 */
export interface EmergencyContact {
    id?: string;
    name: string;
    relationship: EmergencyRelationship;
    phoneNumber: string;
    alternatePhone?: string;
    email?: string;
    address?: Address;
    isPrimary: boolean;
    notes?: string;
}
/**
 * Dependent interface
 */
export interface Dependent {
    id?: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    relationship: string;
    gender?: Gender;
    nationalId?: string;
    isStudent?: boolean;
    isDisabled?: boolean;
    coverageStartDate?: Date;
    coverageEndDate?: Date;
}
/**
 * GDPR consent interface
 */
export interface GDPRConsent {
    consentType: ConsentType;
    granted: boolean;
    grantedAt?: Date;
    revokedAt?: Date;
    version: string;
    ipAddress?: string;
    notes?: string;
}
/**
 * Employee document interface
 */
export interface EmployeeDocument {
    id: string;
    employeeId: string;
    documentType: DocumentType;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: string;
    uploadedAt: Date;
    expiryDate?: Date;
    isConfidential: boolean;
    metadata?: Record<string, any>;
}
/**
 * Employee audit log entry
 */
export interface AuditLogEntry {
    id: string;
    employeeId: string;
    action: string;
    field?: string;
    oldValue?: any;
    newValue?: any;
    performedBy: string;
    performedAt: Date;
    ipAddress?: string;
    userAgent?: string;
    reason?: string;
}
/**
 * Bulk import result
 */
export interface BulkImportResult {
    total: number;
    successful: number;
    failed: number;
    errors: Array<{
        row: number;
        employeeNumber?: string;
        error: string;
    }>;
    createdIds: string[];
}
/**
 * Employee search filters
 */
export interface EmployeeSearchFilters {
    status?: EmployeeStatus[];
    employmentType?: EmploymentType[];
    classification?: EmployeeClassification[];
    departmentId?: string[];
    managerId?: string[];
    hiredAfter?: Date;
    hiredBefore?: Date;
    searchTerm?: string;
    location?: string;
    hasPhoto?: boolean;
    onProbation?: boolean;
}
/**
 * Compensation info
 */
export interface CompensationInfo {
    baseSalary: number;
    currency: string;
    payFrequency: 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'annual';
    effectiveDate: Date;
    endDate?: Date;
    bonusEligible: boolean;
    commissionEligible: boolean;
    grade?: string;
    step?: string;
}
/**
 * Address validation schema
 */
export declare const AddressSchema: any;
/**
 * Emergency contact validation schema
 */
export declare const EmergencyContactSchema: any;
/**
 * Dependent validation schema
 */
export declare const DependentSchema: any;
/**
 * GDPR consent validation schema
 */
export declare const GDPRConsentSchema: any;
/**
 * Employee profile validation schema
 */
export declare const EmployeeProfileSchema: any;
/**
 * Compensation validation schema
 */
export declare const CompensationSchema: any;
/**
 * Employee Model - Core employee master data
 */
export declare class EmployeeModel extends Model {
    id: string;
    employeeNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    preferredName: string;
    email: string;
    personalEmail: string;
    phoneNumber: string;
    mobileNumber: string;
    dateOfBirth: Date;
    gender: Gender;
    maritalStatus: MaritalStatus;
    nationality: string;
    nationalId: string;
    passportNumber: string;
    taxId: string;
    socialSecurityNumber: string;
    photoUrl: string;
    status: EmployeeStatus;
    employmentType: EmploymentType;
    classification: EmployeeClassification;
    hireDate: Date;
    terminationDate: Date;
    probationEndDate: Date;
    managerId: string;
    departmentId: string;
    positionId: string;
    workLocation: string;
    homeAddress: Address;
    languagePreference: string;
    currency: string;
    timezone: string;
    metadata: Record<string, any>;
    manager: EmployeeModel;
    emergencyContacts: EmergencyContactModel[];
    dependents: DependentModel[];
    documents: EmployeeDocumentModel[];
    gdprConsents: GDPRConsentModel[];
    auditLogs: EmployeeAuditLogModel[];
    compensationHistory: CompensationHistoryModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    static hashSensitiveData(instance: EmployeeModel): Promise<void>;
    static hashSensitiveDataOnUpdate(instance: EmployeeModel): Promise<void>;
}
/**
 * Emergency Contact Model
 */
export declare class EmergencyContactModel extends Model {
    id: string;
    employeeId: string;
    name: string;
    relationship: EmergencyRelationship;
    phoneNumber: string;
    alternatePhone: string;
    email: string;
    address: Address;
    isPrimary: boolean;
    notes: string;
    employee: EmployeeModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Dependent Model
 */
export declare class DependentModel extends Model {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    relationship: string;
    gender: Gender;
    nationalId: string;
    isStudent: boolean;
    isDisabled: boolean;
    coverageStartDate: Date;
    coverageEndDate: Date;
    employee: EmployeeModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Employee Document Model
 */
export declare class EmployeeDocumentModel extends Model {
    id: string;
    employeeId: string;
    documentType: DocumentType;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: string;
    uploadedAt: Date;
    expiryDate: Date;
    isConfidential: boolean;
    metadata: Record<string, any>;
    employee: EmployeeModel;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * GDPR Consent Model
 */
export declare class GDPRConsentModel extends Model {
    id: string;
    employeeId: string;
    consentType: ConsentType;
    granted: boolean;
    grantedAt: Date;
    revokedAt: Date;
    version: string;
    ipAddress: string;
    notes: string;
    employee: EmployeeModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Employee Audit Log Model
 */
export declare class EmployeeAuditLogModel extends Model {
    id: string;
    employeeId: string;
    action: string;
    field: string;
    oldValue: any;
    newValue: any;
    performedBy: string;
    performedAt: Date;
    ipAddress: string;
    userAgent: string;
    reason: string;
    employee: EmployeeModel;
}
/**
 * Compensation History Model
 */
export declare class CompensationHistoryModel extends Model {
    id: string;
    employeeId: string;
    baseSalary: number;
    currency: string;
    payFrequency: string;
    effectiveDate: Date;
    endDate: Date;
    bonusEligible: boolean;
    commissionEligible: boolean;
    grade: string;
    step: string;
    notes: string;
    employee: EmployeeModel;
    createdAt: Date;
    updatedAt: Date;
}
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
export declare function createEmployee(profileData: Partial<EmployeeProfile>, transaction?: Transaction): Promise<EmployeeModel>;
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
export declare function updateEmployee(employeeId: string, updates: Partial<EmployeeProfile>, performedBy: string, transaction?: Transaction): Promise<EmployeeModel>;
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
export declare function getEmployeeById(employeeId: string, includeRelations?: boolean): Promise<EmployeeModel | null>;
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
export declare function getEmployeeByNumber(employeeNumber: string): Promise<EmployeeModel | null>;
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
export declare function getEmployeeByEmail(email: string): Promise<EmployeeModel | null>;
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
export declare function deleteEmployee(employeeId: string, performedBy: string, reason: string, transaction?: Transaction): Promise<void>;
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
export declare function searchEmployees(filters: EmployeeSearchFilters, page?: number, limit?: number): Promise<{
    employees: EmployeeModel[];
    total: number;
    pages: number;
}>;
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
export declare function updateEmployeeStatus(employeeId: string, newStatus: EmployeeStatus, performedBy: string, reason?: string, effectiveDate?: Date, transaction?: Transaction): Promise<void>;
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
export declare function terminateEmployee(employeeId: string, terminationDate: Date, performedBy: string, reason: string, transaction?: Transaction): Promise<void>;
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
export declare function reactivateEmployee(employeeId: string, performedBy: string, reason: string, transaction?: Transaction): Promise<void>;
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
export declare function isEmployeeActive(employeeId: string): Promise<boolean>;
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
export declare function getEmployeesByStatus(status: EmployeeStatus, limit?: number): Promise<EmployeeModel[]>;
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
export declare function addEmergencyContact(employeeId: string, contactData: Omit<EmergencyContact, 'id'>, transaction?: Transaction): Promise<EmergencyContactModel>;
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
export declare function updateEmergencyContact(contactId: string, updates: Partial<EmergencyContact>, transaction?: Transaction): Promise<EmergencyContactModel>;
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
export declare function removeEmergencyContact(contactId: string, transaction?: Transaction): Promise<void>;
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
export declare function getEmergencyContacts(employeeId: string): Promise<EmergencyContactModel[]>;
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
export declare function getPrimaryEmergencyContact(employeeId: string): Promise<EmergencyContactModel | null>;
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
export declare function addDependent(employeeId: string, dependentData: Omit<Dependent, 'id'>, transaction?: Transaction): Promise<DependentModel>;
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
export declare function updateDependent(dependentId: string, updates: Partial<Dependent>, transaction?: Transaction): Promise<DependentModel>;
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
export declare function removeDependent(dependentId: string, transaction?: Transaction): Promise<void>;
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
export declare function getDependents(employeeId: string): Promise<DependentModel[]>;
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
export declare function getMinorDependents(employeeId: string, ageLimit?: number): Promise<DependentModel[]>;
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
export declare function uploadEmployeeDocument(employeeId: string, documentData: Omit<EmployeeDocument, 'id' | 'uploadedAt'>, uploadedBy: string, transaction?: Transaction): Promise<EmployeeDocumentModel>;
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
export declare function getEmployeeDocuments(employeeId: string, documentType?: DocumentType): Promise<EmployeeDocumentModel[]>;
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
export declare function deleteEmployeeDocument(documentId: string, transaction?: Transaction): Promise<void>;
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
export declare function getExpiringDocuments(daysAhead?: number): Promise<EmployeeDocumentModel[]>;
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
export declare function recordGDPRConsent(employeeId: string, consentData: Omit<GDPRConsent, 'id'>, transaction?: Transaction): Promise<GDPRConsentModel>;
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
export declare function revokeGDPRConsent(employeeId: string, consentType: ConsentType, transaction?: Transaction): Promise<void>;
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
export declare function getGDPRConsents(employeeId: string): Promise<GDPRConsentModel[]>;
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
export declare function hasGDPRConsent(employeeId: string, consentType: ConsentType): Promise<boolean>;
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
export declare function exportEmployeeData(employeeId: string): Promise<any>;
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
export declare function anonymizeEmployeeData(employeeId: string, performedBy: string, transaction?: Transaction): Promise<void>;
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
export declare function logEmployeeAction(logData: Omit<AuditLogEntry, 'id'>, transaction?: Transaction): Promise<EmployeeAuditLogModel>;
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
export declare function getEmployeeAuditTrail(employeeId: string, limit?: number): Promise<EmployeeAuditLogModel[]>;
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
export declare function getFieldChangeHistory(employeeId: string, fieldName: string): Promise<EmployeeAuditLogModel[]>;
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
export declare function addCompensation(employeeId: string, compensationData: CompensationInfo, transaction?: Transaction): Promise<CompensationHistoryModel>;
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
export declare function getCurrentCompensation(employeeId: string): Promise<CompensationHistoryModel | null>;
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
export declare function getCompensationHistory(employeeId: string): Promise<CompensationHistoryModel[]>;
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
export declare function bulkImportEmployees(employees: Partial<EmployeeProfile>[], performedBy: string): Promise<BulkImportResult>;
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
export declare function bulkExportEmployees(employeeIds: string[]): Promise<any[]>;
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
export declare function bulkUpdateStatus(employeeIds: string[], newStatus: EmployeeStatus, performedBy: string, reason?: string): Promise<number>;
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
export declare function calculateTenure(hireDate: Date, endDate?: Date): number;
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
export declare function calculateAge(dateOfBirth: Date): number;
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
export declare function generateEmployeeNumber(prefix: string, sequenceNumber: number, length?: number): string;
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
export declare function formatEmployeeName(employee: {
    firstName: string;
    middleName?: string;
    lastName: string;
    preferredName?: string;
}, includeMiddle?: boolean): string;
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
export declare function validateEmployeeData(data: Partial<EmployeeProfile>): {
    valid: boolean;
    errors: string[];
};
/**
 * Employee Service
 */
export declare class EmployeeService {
    create(data: Partial<EmployeeProfile>): Promise<EmployeeModel>;
    findById(id: string, includeRelations?: boolean): Promise<EmployeeModel | null>;
    findByNumber(employeeNumber: string): Promise<EmployeeModel | null>;
    update(id: string, updates: Partial<EmployeeProfile>, performedBy: string): Promise<EmployeeModel>;
    delete(id: string, performedBy: string, reason: string): Promise<void>;
    search(filters: EmployeeSearchFilters, page: number, limit: number): Promise<{
        employees: EmployeeModel[];
        total: number;
        pages: number;
    }>;
    terminate(id: string, date: Date, performedBy: string, reason: string): Promise<void>;
    addEmergencyContact(employeeId: string, contact: Omit<EmergencyContact, 'id'>): Promise<EmergencyContactModel>;
    addDependent(employeeId: string, dependent: Omit<Dependent, 'id'>): Promise<DependentModel>;
    exportData(employeeId: string): Promise<any>;
}
/**
 * Employee Controller
 */
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    create(data: Partial<EmployeeProfile>): Promise<EmployeeModel>;
    findOne(id: string, includeRelations?: boolean): Promise<EmployeeModel>;
    update(id: string, updates: Partial<EmployeeProfile>): Promise<EmployeeModel>;
    delete(id: string, reason: string): Promise<void>;
    search(filters: EmployeeSearchFilters, page?: number, limit?: number): Promise<{
        employees: EmployeeModel[];
        total: number;
        pages: number;
    }>;
}
export { EmployeeModel, EmergencyContactModel, DependentModel, EmployeeDocumentModel, GDPRConsentModel, EmployeeAuditLogModel, CompensationHistoryModel, EmployeeService, EmployeeController, };
//# sourceMappingURL=employee-core-data-kit.d.ts.map