/**
 * LOC: HCMESS1234567
 * File: /reuse/server/human-capital/employee-self-service-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../file-storage-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Employee portal controllers
 *   - Mobile HR applications
 */
/**
 * Employee profile status
 */
export declare enum EmployeeStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    ON_LEAVE = "on_leave",
    TERMINATED = "terminated",
    SUSPENDED = "suspended"
}
/**
 * Marital status options
 */
export declare enum MaritalStatus {
    SINGLE = "single",
    MARRIED = "married",
    DIVORCED = "divorced",
    WIDOWED = "widowed",
    SEPARATED = "separated",
    DOMESTIC_PARTNER = "domestic_partner"
}
/**
 * Gender options
 */
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    NON_BINARY = "non_binary",
    PREFER_NOT_TO_SAY = "prefer_not_to_say",
    OTHER = "other"
}
/**
 * Emergency contact relationship
 */
export declare enum EmergencyContactRelationship {
    SPOUSE = "spouse",
    PARENT = "parent",
    CHILD = "child",
    SIBLING = "sibling",
    FRIEND = "friend",
    OTHER = "other"
}
/**
 * Time off request status
 */
export declare enum TimeOffStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    REJECTED = "rejected",
    CANCELLED = "cancelled",
    WITHDRAWN = "withdrawn"
}
/**
 * Time off types
 */
export declare enum TimeOffType {
    VACATION = "vacation",
    SICK_LEAVE = "sick_leave",
    PERSONAL = "personal",
    BEREAVEMENT = "bereavement",
    JURY_DUTY = "jury_duty",
    MATERNITY = "maternity",
    PATERNITY = "paternity",
    PARENTAL = "parental",
    MILITARY = "military",
    UNPAID = "unpaid",
    SABBATICAL = "sabbatical",
    COMPENSATORY = "compensatory"
}
/**
 * Expense status
 */
export declare enum ExpenseStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    REJECTED = "rejected",
    PAID = "paid",
    CANCELLED = "cancelled"
}
/**
 * Expense categories
 */
export declare enum ExpenseCategory {
    TRAVEL = "travel",
    MEALS = "meals",
    LODGING = "lodging",
    TRANSPORTATION = "transportation",
    ENTERTAINMENT = "entertainment",
    OFFICE_SUPPLIES = "office_supplies",
    TRAINING = "training",
    EQUIPMENT = "equipment",
    OTHER = "other"
}
/**
 * Benefits enrollment status
 */
export declare enum BenefitsEnrollmentStatus {
    NOT_ENROLLED = "not_enrolled",
    PENDING = "pending",
    ENROLLED = "enrolled",
    WAIVED = "waived",
    TERMINATED = "terminated"
}
/**
 * Benefits plan types
 */
export declare enum BenefitsPlanType {
    HEALTH_INSURANCE = "health_insurance",
    DENTAL_INSURANCE = "dental_insurance",
    VISION_INSURANCE = "vision_insurance",
    LIFE_INSURANCE = "life_insurance",
    DISABILITY_INSURANCE = "disability_insurance",
    RETIREMENT_401K = "retirement_401k",
    HSA = "hsa",
    FSA = "fsa",
    COMMUTER = "commuter",
    WELLNESS = "wellness"
}
/**
 * Performance review status
 */
export declare enum PerformanceReviewStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    SUBMITTED = "submitted",
    MANAGER_REVIEW = "manager_review",
    CALIBRATION = "calibration",
    COMPLETED = "completed",
    CLOSED = "closed"
}
/**
 * Goal status
 */
export declare enum GoalStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    ON_TRACK = "on_track",
    AT_RISK = "at_risk",
    BEHIND = "behind",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Learning enrollment status
 */
export declare enum LearningEnrollmentStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    WITHDRAWN = "withdrawn",
    EXPIRED = "expired"
}
/**
 * Document signature status
 */
export declare enum DocumentSignatureStatus {
    PENDING = "pending",
    SIGNED = "signed",
    DECLINED = "declined",
    EXPIRED = "expired"
}
/**
 * Timesheet status
 */
export declare enum TimesheetStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    APPROVED = "approved",
    REJECTED = "rejected",
    PAID = "paid"
}
/**
 * Employee profile interface
 */
export interface EmployeeProfile {
    id: string;
    employeeId: string;
    userId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    preferredName?: string;
    email: string;
    personalEmail?: string;
    phone?: string;
    mobilePhone?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    maritalStatus?: MaritalStatus;
    nationality?: string;
    address?: Address;
    emergencyContacts: EmergencyContact[];
    status: EmployeeStatus;
    hireDate: Date;
    terminationDate?: Date;
    department: string;
    jobTitle: string;
    reportsTo?: string;
    location: string;
    workSchedule?: string;
    employmentType: 'full_time' | 'part_time' | 'contractor' | 'intern';
    profilePictureUrl?: string;
    biography?: string;
    skills?: string[];
    certifications?: string[];
    languages?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Address interface
 */
export interface Address {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
/**
 * Emergency contact interface
 */
export interface EmergencyContact {
    id: string;
    employeeId: string;
    name: string;
    relationship: EmergencyContactRelationship;
    phone: string;
    alternatePhone?: string;
    email?: string;
    address?: Address;
    isPrimary: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Time off request interface
 */
export interface TimeOffRequest {
    id: string;
    employeeId: string;
    type: TimeOffType;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    reason?: string;
    status: TimeOffStatus;
    approver?: string;
    approverComments?: string;
    approvedDate?: Date;
    rejectedReason?: string;
    attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
    submittedAt?: Date;
}
/**
 * Time off balance interface
 */
export interface TimeOffBalance {
    employeeId: string;
    type: TimeOffType;
    totalAllotted: number;
    used: number;
    pending: number;
    available: number;
    carryOver: number;
    expirationDate?: Date;
    accrualRate?: number;
    fiscalYear: number;
}
/**
 * Expense report interface
 */
export interface ExpenseReport {
    id: string;
    employeeId: string;
    reportNumber: string;
    title: string;
    description?: string;
    totalAmount: number;
    currency: string;
    status: ExpenseStatus;
    expenses: ExpenseItem[];
    approver?: string;
    approverComments?: string;
    approvedDate?: Date;
    paidDate?: Date;
    rejectedReason?: string;
    createdAt: Date;
    updatedAt: Date;
    submittedAt?: Date;
}
/**
 * Expense item interface
 */
export interface ExpenseItem {
    id: string;
    expenseReportId: string;
    category: ExpenseCategory;
    date: Date;
    merchant: string;
    description: string;
    amount: number;
    currency: string;
    receiptUrl?: string;
    billable: boolean;
    projectCode?: string;
    tags?: string[];
    createdAt: Date;
}
/**
 * Payslip interface
 */
export interface Payslip {
    id: string;
    employeeId: string;
    payPeriodStart: Date;
    payPeriodEnd: Date;
    payDate: Date;
    grossPay: number;
    netPay: number;
    deductions: PayDeduction[];
    earnings: PayEarning[];
    taxes: PayTax[];
    yearToDateGross: number;
    yearToDateNet: number;
    documentUrl: string;
    currency: string;
    createdAt: Date;
}
/**
 * Pay deduction interface
 */
export interface PayDeduction {
    code: string;
    description: string;
    amount: number;
    yearToDate: number;
}
/**
 * Pay earning interface
 */
export interface PayEarning {
    code: string;
    description: string;
    hours?: number;
    rate?: number;
    amount: number;
    yearToDate: number;
}
/**
 * Pay tax interface
 */
export interface PayTax {
    type: string;
    description: string;
    amount: number;
    yearToDate: number;
}
/**
 * Tax document interface
 */
export interface TaxDocument {
    id: string;
    employeeId: string;
    documentType: 'W2' | 'W4' | '1099' | 'OTHER';
    taxYear: number;
    documentUrl: string;
    generatedDate: Date;
    downloaded: boolean;
    downloadedAt?: Date;
}
/**
 * Benefits enrollment interface
 */
export interface BenefitsEnrollment {
    id: string;
    employeeId: string;
    planType: BenefitsPlanType;
    planName: string;
    planId: string;
    status: BenefitsEnrollmentStatus;
    effectiveDate: Date;
    terminationDate?: Date;
    employeeContribution: number;
    employerContribution: number;
    coverageLevel: 'employee' | 'employee_spouse' | 'employee_children' | 'family';
    dependents?: BenefitsDependent[];
    enrollmentDate: Date;
    lastModified: Date;
}
/**
 * Benefits dependent interface
 */
export interface BenefitsDependent {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    relationship: 'spouse' | 'child' | 'domestic_partner';
    ssn?: string;
}
/**
 * Performance self-assessment interface
 */
export interface PerformanceSelfAssessment {
    id: string;
    employeeId: string;
    reviewPeriodStart: Date;
    reviewPeriodEnd: Date;
    status: PerformanceReviewStatus;
    overallRating?: number;
    achievements: string;
    challenges: string;
    developmentAreas: string;
    careerGoals: string;
    competencyRatings: CompetencyRating[];
    submittedDate?: Date;
    managerFeedback?: string;
    finalRating?: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Competency rating interface
 */
export interface CompetencyRating {
    competencyName: string;
    competencyDescription: string;
    selfRating: number;
    managerRating?: number;
    comments?: string;
}
/**
 * Employee goal interface
 */
export interface EmployeeGoal {
    id: string;
    employeeId: string;
    title: string;
    description: string;
    category: 'performance' | 'development' | 'project' | 'stretch';
    status: GoalStatus;
    priority: 'low' | 'medium' | 'high' | 'critical';
    startDate: Date;
    targetDate: Date;
    completionDate?: Date;
    progress: number;
    milestones: GoalMilestone[];
    metrics?: string;
    alignedToObjective?: string;
    managerId?: string;
    managerComments?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Goal milestone interface
 */
export interface GoalMilestone {
    id: string;
    title: string;
    targetDate: Date;
    completionDate?: Date;
    isCompleted: boolean;
}
/**
 * Learning course interface
 */
export interface LearningCourse {
    id: string;
    courseCode: string;
    title: string;
    description: string;
    category: string;
    duration: number;
    durationUnit: 'hours' | 'days' | 'weeks';
    provider: string;
    format: 'online' | 'classroom' | 'blended' | 'workshop';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    prerequisites?: string[];
    skills?: string[];
    certificationOffered: boolean;
    isActive: boolean;
}
/**
 * Learning enrollment interface
 */
export interface LearningEnrollment {
    id: string;
    employeeId: string;
    courseId: string;
    courseTitle: string;
    status: LearningEnrollmentStatus;
    enrollmentDate: Date;
    startDate?: Date;
    completionDate?: Date;
    dueDate?: Date;
    progress: number;
    score?: number;
    certificateUrl?: string;
    isRequired: boolean;
    assignedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Employee document interface
 */
export interface EmployeeDocument {
    id: string;
    employeeId: string;
    documentType: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    category: 'personal' | 'employment' | 'benefits' | 'performance' | 'compliance' | 'other';
    requiresSignature: boolean;
    signatureStatus?: DocumentSignatureStatus;
    signedDate?: Date;
    signatureUrl?: string;
    expirationDate?: Date;
    isConfidential: boolean;
    uploadedBy: string;
    uploadedAt: Date;
    lastAccessedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Timesheet interface
 */
export interface Timesheet {
    id: string;
    employeeId: string;
    periodStart: Date;
    periodEnd: Date;
    totalHours: number;
    regularHours: number;
    overtimeHours: number;
    entries: TimesheetEntry[];
    status: TimesheetStatus;
    submittedDate?: Date;
    approvedDate?: Date;
    approver?: string;
    approverComments?: string;
    rejectedReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Timesheet entry interface
 */
export interface TimesheetEntry {
    id: string;
    timesheetId: string;
    date: Date;
    projectCode?: string;
    taskCode?: string;
    hours: number;
    description?: string;
    isBillable: boolean;
    isOvertime: boolean;
}
/**
 * DTO for updating employee profile
 */
export declare class UpdateEmployeeProfileDto {
    preferredName?: string;
    personalEmail?: string;
    phone?: string;
    mobilePhone?: string;
    maritalStatus?: MaritalStatus;
    address?: AddressDto;
    biography?: string;
    skills?: string[];
    languages?: string[];
}
/**
 * DTO for address
 */
export declare class AddressDto {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
/**
 * DTO for creating emergency contact
 */
export declare class CreateEmergencyContactDto {
    name: string;
    relationship: EmergencyContactRelationship;
    phone: string;
    alternatePhone?: string;
    email?: string;
    address?: AddressDto;
    isPrimary: boolean;
}
/**
 * DTO for creating time off request
 */
export declare class CreateTimeOffRequestDto {
    type: TimeOffType;
    startDate: Date;
    endDate: Date;
    reason?: string;
    attachments?: string[];
}
/**
 * DTO for creating expense report
 */
export declare class CreateExpenseReportDto {
    title: string;
    description?: string;
    currency: string;
}
/**
 * DTO for creating expense item
 */
export declare class CreateExpenseItemDto {
    category: ExpenseCategory;
    date: Date;
    merchant: string;
    description: string;
    amount: number;
    currency: string;
    receiptUrl?: string;
    billable: boolean;
    projectCode?: string;
}
/**
 * DTO for benefits enrollment
 */
export declare class EnrollBenefitsDto {
    planId: string;
    planType: BenefitsPlanType;
    effectiveDate: Date;
    coverageLevel: string;
    dependents?: BenefitsDependentDto[];
}
/**
 * DTO for benefits dependent
 */
export declare class BenefitsDependentDto {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    relationship: string;
}
/**
 * DTO for performance self-assessment
 */
export declare class SubmitSelfAssessmentDto {
    achievements: string;
    challenges: string;
    developmentAreas: string;
    careerGoals: string;
    competencyRatings: CompetencyRatingDto[];
    overallRating?: number;
}
/**
 * DTO for competency rating
 */
export declare class CompetencyRatingDto {
    competencyName: string;
    selfRating: number;
    comments?: string;
}
/**
 * DTO for creating employee goal
 */
export declare class CreateEmployeeGoalDto {
    title: string;
    description: string;
    category: string;
    priority: string;
    startDate: Date;
    targetDate: Date;
    metrics?: string;
    milestones?: GoalMilestoneDto[];
}
/**
 * DTO for goal milestone
 */
export declare class GoalMilestoneDto {
    title: string;
    targetDate: Date;
}
/**
 * DTO for enrolling in learning course
 */
export declare class EnrollLearningCourseDto {
    courseId: string;
    startDate?: Date;
}
/**
 * DTO for creating timesheet
 */
export declare class CreateTimesheetDto {
    periodStart: Date;
    periodEnd: Date;
    entries: TimesheetEntryDto[];
}
/**
 * DTO for timesheet entry
 */
export declare class TimesheetEntryDto {
    date: Date;
    projectCode?: string;
    taskCode?: string;
    hours: number;
    description?: string;
    isBillable: boolean;
    isOvertime: boolean;
}
/**
 * DTO for uploading document
 */
export declare class UploadDocumentDto {
    documentType: string;
    category: string;
    requiresSignature: boolean;
    expirationDate?: Date;
}
/**
 * Gets employee profile by ID
 *
 * @param employeeId - Employee identifier
 * @returns Employee profile
 *
 * @example
 * ```typescript
 * const profile = await getEmployeeProfile('emp-123');
 * console.log(profile.firstName, profile.lastName);
 * ```
 */
export declare function getEmployeeProfile(employeeId: string): Promise<EmployeeProfile>;
/**
 * Updates employee profile
 *
 * @param employeeId - Employee identifier
 * @param updates - Profile updates
 * @returns Updated profile
 *
 * @example
 * ```typescript
 * const updated = await updateEmployeeProfile('emp-123', {
 *   preferredName: 'Mike',
 *   mobilePhone: '+1-555-0100'
 * });
 * ```
 */
export declare function updateEmployeeProfile(employeeId: string, updates: Partial<EmployeeProfile>): Promise<EmployeeProfile>;
/**
 * Gets employee profile picture URL
 *
 * @param employeeId - Employee identifier
 * @returns Profile picture URL
 *
 * @example
 * ```typescript
 * const pictureUrl = await getEmployeeProfilePicture('emp-123');
 * ```
 */
export declare function getEmployeeProfilePicture(employeeId: string): Promise<string | null>;
/**
 * Updates employee profile picture
 *
 * @param employeeId - Employee identifier
 * @param fileUrl - New profile picture URL
 * @returns Updated profile
 *
 * @example
 * ```typescript
 * await updateEmployeeProfilePicture('emp-123', 'https://storage.example.com/profile.jpg');
 * ```
 */
export declare function updateEmployeeProfilePicture(employeeId: string, fileUrl: string): Promise<EmployeeProfile>;
/**
 * Gets employee work history
 *
 * @param employeeId - Employee identifier
 * @returns Work history records
 *
 * @example
 * ```typescript
 * const history = await getEmployeeWorkHistory('emp-123');
 * ```
 */
export declare function getEmployeeWorkHistory(employeeId: string): Promise<Array<{
    jobTitle: string;
    department: string;
    startDate: Date;
    endDate?: Date;
}>>;
/**
 * Creates emergency contact
 *
 * @param employeeId - Employee identifier
 * @param contactData - Emergency contact data
 * @returns Created emergency contact
 *
 * @example
 * ```typescript
 * const contact = await createEmergencyContact('emp-123', {
 *   name: 'Jane Doe',
 *   relationship: EmergencyContactRelationship.SPOUSE,
 *   phone: '+1-555-0100',
 *   isPrimary: true
 * });
 * ```
 */
export declare function createEmergencyContact(employeeId: string, contactData: Omit<EmergencyContact, 'id' | 'employeeId' | 'createdAt' | 'updatedAt'>): Promise<EmergencyContact>;
/**
 * Gets employee emergency contacts
 *
 * @param employeeId - Employee identifier
 * @returns List of emergency contacts
 *
 * @example
 * ```typescript
 * const contacts = await getEmergencyContacts('emp-123');
 * ```
 */
export declare function getEmergencyContacts(employeeId: string): Promise<EmergencyContact[]>;
/**
 * Updates emergency contact
 *
 * @param contactId - Contact identifier
 * @param updates - Contact updates
 * @returns Updated emergency contact
 *
 * @example
 * ```typescript
 * await updateEmergencyContact('contact-123', { phone: '+1-555-0200' });
 * ```
 */
export declare function updateEmergencyContact(contactId: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact>;
/**
 * Deletes emergency contact
 *
 * @param contactId - Contact identifier
 * @returns Success status
 *
 * @example
 * ```typescript
 * await deleteEmergencyContact('contact-123');
 * ```
 */
export declare function deleteEmergencyContact(contactId: string): Promise<boolean>;
/**
 * Sets primary emergency contact
 *
 * @param employeeId - Employee identifier
 * @param contactId - Contact identifier
 * @returns Updated contact
 *
 * @example
 * ```typescript
 * await setPrimaryEmergencyContact('emp-123', 'contact-456');
 * ```
 */
export declare function setPrimaryEmergencyContact(employeeId: string, contactId: string): Promise<EmergencyContact>;
/**
 * Validates address format
 *
 * @param address - Address to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const isValid = validateAddress({ street1: '123 Main St', city: 'Boston', state: 'MA', postalCode: '02101', country: 'USA' });
 * ```
 */
export declare function validateAddress(address: Address): boolean;
/**
 * Gets employee payslips
 *
 * @param employeeId - Employee identifier
 * @param year - Optional year filter
 * @returns List of payslips
 *
 * @example
 * ```typescript
 * const payslips = await getEmployeePayslips('emp-123', 2025);
 * ```
 */
export declare function getEmployeePayslips(employeeId: string, year?: number): Promise<Payslip[]>;
/**
 * Gets single payslip by ID
 *
 * @param payslipId - Payslip identifier
 * @returns Payslip details
 *
 * @example
 * ```typescript
 * const payslip = await getPayslipById('payslip-123');
 * ```
 */
export declare function getPayslipById(payslipId: string): Promise<Payslip>;
/**
 * Downloads payslip document
 *
 * @param payslipId - Payslip identifier
 * @returns Document URL
 *
 * @example
 * ```typescript
 * const url = await downloadPayslip('payslip-123');
 * ```
 */
export declare function downloadPayslip(payslipId: string): Promise<string>;
/**
 * Gets employee tax documents
 *
 * @param employeeId - Employee identifier
 * @param taxYear - Tax year
 * @returns List of tax documents
 *
 * @example
 * ```typescript
 * const taxDocs = await getEmployeeTaxDocuments('emp-123', 2024);
 * ```
 */
export declare function getEmployeeTaxDocuments(employeeId: string, taxYear: number): Promise<TaxDocument[]>;
/**
 * Downloads tax document
 *
 * @param documentId - Document identifier
 * @returns Document URL
 *
 * @example
 * ```typescript
 * const url = await downloadTaxDocument('tax-doc-123');
 * ```
 */
export declare function downloadTaxDocument(documentId: string): Promise<string>;
/**
 * Gets year-to-date earnings summary
 *
 * @param employeeId - Employee identifier
 * @returns YTD summary
 *
 * @example
 * ```typescript
 * const ytd = await getYearToDateSummary('emp-123');
 * ```
 */
export declare function getYearToDateSummary(employeeId: string): Promise<{
    grossPay: number;
    netPay: number;
    taxes: number;
    deductions: number;
}>;
/**
 * Gets employee benefits enrollments
 *
 * @param employeeId - Employee identifier
 * @returns List of benefits enrollments
 *
 * @example
 * ```typescript
 * const benefits = await getEmployeeBenefitsEnrollments('emp-123');
 * ```
 */
export declare function getEmployeeBenefitsEnrollments(employeeId: string): Promise<BenefitsEnrollment[]>;
/**
 * Gets available benefits plans
 *
 * @param employeeId - Employee identifier
 * @returns List of available plans
 *
 * @example
 * ```typescript
 * const plans = await getAvailableBenefitsPlans('emp-123');
 * ```
 */
export declare function getAvailableBenefitsPlans(employeeId: string): Promise<Array<{
    id: string;
    planType: BenefitsPlanType;
    planName: string;
    description: string;
    employeeContribution: number;
    employerContribution: number;
}>>;
/**
 * Enrolls employee in benefits plan
 *
 * @param employeeId - Employee identifier
 * @param enrollmentData - Enrollment data
 * @returns Created enrollment
 *
 * @example
 * ```typescript
 * const enrollment = await enrollInBenefitsPlan('emp-123', {
 *   planId: 'plan-456',
 *   planType: BenefitsPlanType.HEALTH_INSURANCE,
 *   effectiveDate: new Date('2025-01-01'),
 *   coverageLevel: 'family'
 * });
 * ```
 */
export declare function enrollInBenefitsPlan(employeeId: string, enrollmentData: Omit<BenefitsEnrollment, 'id' | 'employeeId' | 'status' | 'enrollmentDate' | 'lastModified'>): Promise<BenefitsEnrollment>;
/**
 * Updates benefits enrollment
 *
 * @param enrollmentId - Enrollment identifier
 * @param updates - Enrollment updates
 * @returns Updated enrollment
 *
 * @example
 * ```typescript
 * await updateBenefitsEnrollment('enrollment-123', { coverageLevel: 'employee_spouse' });
 * ```
 */
export declare function updateBenefitsEnrollment(enrollmentId: string, updates: Partial<BenefitsEnrollment>): Promise<BenefitsEnrollment>;
/**
 * Terminates benefits enrollment
 *
 * @param enrollmentId - Enrollment identifier
 * @param terminationDate - Termination date
 * @returns Updated enrollment
 *
 * @example
 * ```typescript
 * await terminateBenefitsEnrollment('enrollment-123', new Date('2025-12-31'));
 * ```
 */
export declare function terminateBenefitsEnrollment(enrollmentId: string, terminationDate: Date): Promise<BenefitsEnrollment>;
/**
 * Waives benefits plan
 *
 * @param employeeId - Employee identifier
 * @param planType - Plan type to waive
 * @param reason - Waiver reason
 * @returns Waived enrollment record
 *
 * @example
 * ```typescript
 * await waiveBenefitsPlan('emp-123', BenefitsPlanType.HEALTH_INSURANCE, 'Covered by spouse');
 * ```
 */
export declare function waiveBenefitsPlan(employeeId: string, planType: BenefitsPlanType, reason: string): Promise<BenefitsEnrollment>;
/**
 * Gets benefits enrollment summary
 *
 * @param employeeId - Employee identifier
 * @returns Enrollment summary
 *
 * @example
 * ```typescript
 * const summary = await getBenefitsEnrollmentSummary('emp-123');
 * ```
 */
export declare function getBenefitsEnrollmentSummary(employeeId: string): Promise<{
    totalEmployeeContribution: number;
    totalEmployerContribution: number;
    enrolledPlans: number;
    waivedPlans: number;
}>;
/**
 * Creates time off request
 *
 * @param employeeId - Employee identifier
 * @param requestData - Time off request data
 * @returns Created time off request
 *
 * @example
 * ```typescript
 * const request = await createTimeOffRequest('emp-123', {
 *   type: TimeOffType.VACATION,
 *   startDate: new Date('2025-06-01'),
 *   endDate: new Date('2025-06-05'),
 *   reason: 'Family vacation'
 * });
 * ```
 */
export declare function createTimeOffRequest(employeeId: string, requestData: Omit<TimeOffRequest, 'id' | 'employeeId' | 'status' | 'createdAt' | 'updatedAt' | 'totalDays'>): Promise<TimeOffRequest>;
/**
 * Submits time off request
 *
 * @param requestId - Request identifier
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await submitTimeOffRequest('request-123');
 * ```
 */
export declare function submitTimeOffRequest(requestId: string): Promise<TimeOffRequest>;
/**
 * Gets employee time off requests
 *
 * @param employeeId - Employee identifier
 * @param status - Optional status filter
 * @returns List of time off requests
 *
 * @example
 * ```typescript
 * const requests = await getEmployeeTimeOffRequests('emp-123', TimeOffStatus.APPROVED);
 * ```
 */
export declare function getEmployeeTimeOffRequests(employeeId: string, status?: TimeOffStatus): Promise<TimeOffRequest[]>;
/**
 * Cancels time off request
 *
 * @param requestId - Request identifier
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await cancelTimeOffRequest('request-123');
 * ```
 */
export declare function cancelTimeOffRequest(requestId: string): Promise<TimeOffRequest>;
/**
 * Gets employee time off balances
 *
 * @param employeeId - Employee identifier
 * @returns Time off balances by type
 *
 * @example
 * ```typescript
 * const balances = await getEmployeeTimeOffBalances('emp-123');
 * ```
 */
export declare function getEmployeeTimeOffBalances(employeeId: string): Promise<TimeOffBalance[]>;
/**
 * Calculates available time off balance
 *
 * @param employeeId - Employee identifier
 * @param type - Time off type
 * @returns Available balance
 *
 * @example
 * ```typescript
 * const available = await calculateAvailableTimeOff('emp-123', TimeOffType.VACATION);
 * ```
 */
export declare function calculateAvailableTimeOff(employeeId: string, type: TimeOffType): Promise<number>;
/**
 * Gets time off request history
 *
 * @param employeeId - Employee identifier
 * @param year - Year filter
 * @returns Time off history
 *
 * @example
 * ```typescript
 * const history = await getTimeOffRequestHistory('emp-123', 2025);
 * ```
 */
export declare function getTimeOffRequestHistory(employeeId: string, year: number): Promise<TimeOffRequest[]>;
/**
 * Creates timesheet
 *
 * @param employeeId - Employee identifier
 * @param timesheetData - Timesheet data
 * @returns Created timesheet
 *
 * @example
 * ```typescript
 * const timesheet = await createTimesheet('emp-123', {
 *   periodStart: new Date('2025-11-01'),
 *   periodEnd: new Date('2025-11-07'),
 *   entries: [...]
 * });
 * ```
 */
export declare function createTimesheet(employeeId: string, timesheetData: Omit<Timesheet, 'id' | 'employeeId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Timesheet>;
/**
 * Submits timesheet
 *
 * @param timesheetId - Timesheet identifier
 * @returns Updated timesheet
 *
 * @example
 * ```typescript
 * await submitTimesheet('timesheet-123');
 * ```
 */
export declare function submitTimesheet(timesheetId: string): Promise<Timesheet>;
/**
 * Gets employee timesheets
 *
 * @param employeeId - Employee identifier
 * @param status - Optional status filter
 * @returns List of timesheets
 *
 * @example
 * ```typescript
 * const timesheets = await getEmployeeTimesheets('emp-123');
 * ```
 */
export declare function getEmployeeTimesheets(employeeId: string, status?: TimesheetStatus): Promise<Timesheet[]>;
/**
 * Calculates timesheet totals
 *
 * @param entries - Timesheet entries
 * @returns Calculated totals
 *
 * @example
 * ```typescript
 * const totals = calculateTimesheetTotals(entries);
 * ```
 */
export declare function calculateTimesheetTotals(entries: TimesheetEntry[]): {
    totalHours: number;
    regularHours: number;
    overtimeHours: number;
};
/**
 * Creates expense report
 *
 * @param employeeId - Employee identifier
 * @param reportData - Expense report data
 * @returns Created expense report
 *
 * @example
 * ```typescript
 * const report = await createExpenseReport('emp-123', {
 *   title: 'Business Trip - Boston',
 *   currency: 'USD',
 *   expenses: []
 * });
 * ```
 */
export declare function createExpenseReport(employeeId: string, reportData: Omit<ExpenseReport, 'id' | 'employeeId' | 'reportNumber' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ExpenseReport>;
/**
 * Adds expense item to report
 *
 * @param reportId - Report identifier
 * @param expenseData - Expense item data
 * @returns Created expense item
 *
 * @example
 * ```typescript
 * const expense = await addExpenseItem('report-123', {
 *   category: ExpenseCategory.MEALS,
 *   date: new Date(),
 *   merchant: 'Restaurant',
 *   description: 'Client dinner',
 *   amount: 125.50,
 *   currency: 'USD',
 *   billable: true
 * });
 * ```
 */
export declare function addExpenseItem(reportId: string, expenseData: Omit<ExpenseItem, 'id' | 'expenseReportId' | 'createdAt'>): Promise<ExpenseItem>;
/**
 * Submits expense report
 *
 * @param reportId - Report identifier
 * @returns Updated report
 *
 * @example
 * ```typescript
 * await submitExpenseReport('report-123');
 * ```
 */
export declare function submitExpenseReport(reportId: string): Promise<ExpenseReport>;
/**
 * Gets employee expense reports
 *
 * @param employeeId - Employee identifier
 * @param status - Optional status filter
 * @returns List of expense reports
 *
 * @example
 * ```typescript
 * const reports = await getEmployeeExpenseReports('emp-123');
 * ```
 */
export declare function getEmployeeExpenseReports(employeeId: string, status?: ExpenseStatus): Promise<ExpenseReport[]>;
/**
 * Calculates expense report total
 *
 * @param expenses - Expense items
 * @returns Total amount
 *
 * @example
 * ```typescript
 * const total = calculateExpenseReportTotal(expenses);
 * ```
 */
export declare function calculateExpenseReportTotal(expenses: ExpenseItem[]): number;
/**
 * Gets employee self-assessments
 *
 * @param employeeId - Employee identifier
 * @returns List of self-assessments
 *
 * @example
 * ```typescript
 * const assessments = await getEmployeeSelfAssessments('emp-123');
 * ```
 */
export declare function getEmployeeSelfAssessments(employeeId: string): Promise<PerformanceSelfAssessment[]>;
/**
 * Creates self-assessment
 *
 * @param employeeId - Employee identifier
 * @param assessmentData - Assessment data
 * @returns Created assessment
 *
 * @example
 * ```typescript
 * const assessment = await createSelfAssessment('emp-123', {
 *   reviewPeriodStart: new Date('2025-01-01'),
 *   reviewPeriodEnd: new Date('2025-12-31'),
 *   achievements: '...',
 *   challenges: '...',
 *   developmentAreas: '...',
 *   careerGoals: '...',
 *   competencyRatings: []
 * });
 * ```
 */
export declare function createSelfAssessment(employeeId: string, assessmentData: Omit<PerformanceSelfAssessment, 'id' | 'employeeId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<PerformanceSelfAssessment>;
/**
 * Submits self-assessment
 *
 * @param assessmentId - Assessment identifier
 * @returns Updated assessment
 *
 * @example
 * ```typescript
 * await submitSelfAssessment('assessment-123');
 * ```
 */
export declare function submitSelfAssessment(assessmentId: string): Promise<PerformanceSelfAssessment>;
/**
 * Updates competency rating
 *
 * @param assessmentId - Assessment identifier
 * @param competencyName - Competency name
 * @param rating - Rating value
 * @returns Updated assessment
 *
 * @example
 * ```typescript
 * await updateCompetencyRating('assessment-123', 'Communication', 4);
 * ```
 */
export declare function updateCompetencyRating(assessmentId: string, competencyName: string, rating: number): Promise<PerformanceSelfAssessment>;
/**
 * Calculates average self-rating
 *
 * @param assessment - Performance assessment
 * @returns Average rating
 *
 * @example
 * ```typescript
 * const avgRating = calculateAverageSelfRating(assessment);
 * ```
 */
export declare function calculateAverageSelfRating(assessment: PerformanceSelfAssessment): number;
/**
 * Creates employee goal
 *
 * @param employeeId - Employee identifier
 * @param goalData - Goal data
 * @returns Created goal
 *
 * @example
 * ```typescript
 * const goal = await createEmployeeGoal('emp-123', {
 *   title: 'Complete AWS Certification',
 *   description: 'Obtain AWS Solutions Architect certification',
 *   category: 'development',
 *   priority: 'high',
 *   startDate: new Date(),
 *   targetDate: new Date('2025-12-31'),
 *   progress: 0,
 *   milestones: []
 * });
 * ```
 */
export declare function createEmployeeGoal(employeeId: string, goalData: Omit<EmployeeGoal, 'id' | 'employeeId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<EmployeeGoal>;
/**
 * Gets employee goals
 *
 * @param employeeId - Employee identifier
 * @param status - Optional status filter
 * @returns List of goals
 *
 * @example
 * ```typescript
 * const goals = await getEmployeeGoals('emp-123', GoalStatus.ACTIVE);
 * ```
 */
export declare function getEmployeeGoals(employeeId: string, status?: GoalStatus): Promise<EmployeeGoal[]>;
/**
 * Updates goal progress
 *
 * @param goalId - Goal identifier
 * @param progress - Progress percentage (0-100)
 * @returns Updated goal
 *
 * @example
 * ```typescript
 * await updateGoalProgress('goal-123', 75);
 * ```
 */
export declare function updateGoalProgress(goalId: string, progress: number): Promise<EmployeeGoal>;
/**
 * Completes milestone
 *
 * @param goalId - Goal identifier
 * @param milestoneId - Milestone identifier
 * @returns Updated goal
 *
 * @example
 * ```typescript
 * await completeMilestone('goal-123', 'milestone-456');
 * ```
 */
export declare function completeMilestone(goalId: string, milestoneId: string): Promise<EmployeeGoal>;
/**
 * Completes goal
 *
 * @param goalId - Goal identifier
 * @returns Updated goal
 *
 * @example
 * ```typescript
 * await completeGoal('goal-123');
 * ```
 */
export declare function completeGoal(goalId: string): Promise<EmployeeGoal>;
/**
 * Gets available learning courses
 *
 * @param category - Optional category filter
 * @returns List of courses
 *
 * @example
 * ```typescript
 * const courses = await getAvailableLearningCourses('technical');
 * ```
 */
export declare function getAvailableLearningCourses(category?: string): Promise<LearningCourse[]>;
/**
 * Enrolls in learning course
 *
 * @param employeeId - Employee identifier
 * @param courseId - Course identifier
 * @returns Created enrollment
 *
 * @example
 * ```typescript
 * const enrollment = await enrollInLearningCourse('emp-123', 'course-456');
 * ```
 */
export declare function enrollInLearningCourse(employeeId: string, courseId: string): Promise<LearningEnrollment>;
/**
 * Gets employee learning enrollments
 *
 * @param employeeId - Employee identifier
 * @param status - Optional status filter
 * @returns List of enrollments
 *
 * @example
 * ```typescript
 * const enrollments = await getEmployeeLearningEnrollments('emp-123');
 * ```
 */
export declare function getEmployeeLearningEnrollments(employeeId: string, status?: LearningEnrollmentStatus): Promise<LearningEnrollment[]>;
/**
 * Updates learning course progress
 *
 * @param enrollmentId - Enrollment identifier
 * @param progress - Progress percentage (0-100)
 * @returns Updated enrollment
 *
 * @example
 * ```typescript
 * await updateLearningCourseProgress('enrollment-123', 50);
 * ```
 */
export declare function updateLearningCourseProgress(enrollmentId: string, progress: number): Promise<LearningEnrollment>;
/**
 * Gets employee documents
 *
 * @param employeeId - Employee identifier
 * @param category - Optional category filter
 * @returns List of documents
 *
 * @example
 * ```typescript
 * const docs = await getEmployeeDocuments('emp-123', 'benefits');
 * ```
 */
export declare function getEmployeeDocuments(employeeId: string, category?: string): Promise<EmployeeDocument[]>;
/**
 * Uploads employee document
 *
 * @param employeeId - Employee identifier
 * @param documentData - Document data
 * @returns Created document
 *
 * @example
 * ```typescript
 * const doc = await uploadEmployeeDocument('emp-123', {
 *   documentType: 'Resume',
 *   fileName: 'resume.pdf',
 *   fileUrl: 'https://storage.example.com/resume.pdf',
 *   fileSize: 102400,
 *   mimeType: 'application/pdf',
 *   category: 'personal',
 *   requiresSignature: false,
 *   isConfidential: false,
 *   uploadedBy: 'emp-123'
 * });
 * ```
 */
export declare function uploadEmployeeDocument(employeeId: string, documentData: Omit<EmployeeDocument, 'id' | 'employeeId' | 'uploadedAt'>): Promise<EmployeeDocument>;
/**
 * Signs document electronically
 *
 * @param documentId - Document identifier
 * @param signatureData - Signature data
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await signDocument('doc-123', 'base64-signature-data');
 * ```
 */
export declare function signDocument(documentId: string, signatureData: string): Promise<EmployeeDocument>;
/**
 * Gets documents requiring signature
 *
 * @param employeeId - Employee identifier
 * @returns List of documents
 *
 * @example
 * ```typescript
 * const docs = await getDocumentsRequiringSignature('emp-123');
 * ```
 */
export declare function getDocumentsRequiringSignature(employeeId: string): Promise<EmployeeDocument[]>;
/**
 * Declines document signature
 *
 * @param documentId - Document identifier
 * @param reason - Decline reason
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await declineDocumentSignature('doc-123', 'Need to review with legal counsel');
 * ```
 */
export declare function declineDocumentSignature(documentId: string, reason: string): Promise<EmployeeDocument>;
/**
 * Employee Self-Service Controller
 * Provides RESTful API endpoints for employee self-service operations
 */
export declare class EmployeeSelfServiceController {
    /**
     * Get employee profile
     */
    getProfile(employeeId: string): Promise<EmployeeProfile>;
    /**
     * Update employee profile
     */
    updateProfile(employeeId: string, updateDto: UpdateEmployeeProfileDto): Promise<EmployeeProfile>;
    /**
     * Get time off requests
     */
    getTimeOffRequests(employeeId: string): Promise<TimeOffRequest[]>;
    /**
     * Create time off request
     */
    createTimeOff(employeeId: string, createDto: CreateTimeOffRequestDto): Promise<TimeOffRequest>;
    /**
     * Get expense reports
     */
    getExpenses(employeeId: string): Promise<ExpenseReport[]>;
    /**
     * Create expense report
     */
    createExpense(employeeId: string, createDto: CreateExpenseReportDto): Promise<ExpenseReport>;
    /**
     * Get employee goals
     */
    getGoals(employeeId: string): Promise<EmployeeGoal[]>;
    /**
     * Create employee goal
     */
    createGoal(employeeId: string, createDto: CreateEmployeeGoalDto): Promise<EmployeeGoal>;
}
//# sourceMappingURL=employee-self-service-kit.d.ts.map