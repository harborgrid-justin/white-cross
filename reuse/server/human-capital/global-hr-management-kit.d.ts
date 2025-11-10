/**
 * LOC: HCM_GLOBAL_HR_001
 * File: /reuse/server/human-capital/global-hr-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *   - axios (for exchange rate APIs)
 *
 * DOWNSTREAM (imported by):
 *   - Global HR service implementations
 *   - International assignment controllers
 *   - Expatriate management services
 *   - Global payroll integrations
 *   - Immigration & visa tracking systems
 *   - Multi-country compliance services
 */
import { Model } from 'sequelize-typescript';
import { z } from 'zod';
import { Transaction } from 'sequelize';
/**
 * ISO 3166-1 alpha-2 country codes for supported countries
 */
export declare enum CountryCode {
    US = "US",// United States
    CA = "CA",// Canada
    GB = "GB",// United Kingdom
    DE = "DE",// Germany
    FR = "FR",// France
    ES = "ES",// Spain
    IT = "IT",// Italy
    NL = "NL",// Netherlands
    BE = "BE",// Belgium
    CH = "CH",// Switzerland
    AT = "AT",// Austria
    SE = "SE",// Sweden
    NO = "NO",// Norway
    DK = "DK",// Denmark
    FI = "FI",// Finland
    IE = "IE",// Ireland
    AU = "AU",// Australia
    NZ = "NZ",// New Zealand
    SG = "SG",// Singapore
    HK = "HK",// Hong Kong
    JP = "JP",// Japan
    KR = "KR",// South Korea
    CN = "CN",// China
    IN = "IN",// India
    AE = "AE",// United Arab Emirates
    SA = "SA",// Saudi Arabia
    BR = "BR",// Brazil
    MX = "MX",// Mexico
    AR = "AR",// Argentina
    CL = "CL",// Chile
    ZA = "ZA"
}
/**
 * ISO 4217 currency codes
 */
export declare enum CurrencyCode {
    USD = "USD",// US Dollar
    EUR = "EUR",// Euro
    GBP = "GBP",// British Pound
    CHF = "CHF",// Swiss Franc
    CAD = "CAD",// Canadian Dollar
    AUD = "AUD",// Australian Dollar
    NZD = "NZD",// New Zealand Dollar
    SGD = "SGD",// Singapore Dollar
    HKD = "HKD",// Hong Kong Dollar
    JPY = "JPY",// Japanese Yen
    KRW = "KRW",// South Korean Won
    CNY = "CNY",// Chinese Yuan
    INR = "INR",// Indian Rupee
    AED = "AED",// UAE Dirham
    SAR = "SAR",// Saudi Riyal
    BRL = "BRL",// Brazilian Real
    MXN = "MXN",// Mexican Peso
    ARS = "ARS",// Argentine Peso
    CLP = "CLP",// Chilean Peso
    ZAR = "ZAR",// South African Rand
    SEK = "SEK",// Swedish Krona
    NOK = "NOK",// Norwegian Krone
    DKK = "DKK"
}
/**
 * Types of global assignments
 */
export declare enum GlobalAssignmentType {
    SHORT_TERM = "SHORT_TERM",// < 1 year
    LONG_TERM = "LONG_TERM",// 1-5 years
    PERMANENT = "PERMANENT",// > 5 years or indefinite
    COMMUTER = "COMMUTER",// Daily/weekly commute across borders
    ROTATIONAL = "ROTATIONAL",// Rotating schedules
    VIRTUAL = "VIRTUAL",// Remote work from different country
    ONE_WAY_TRANSFER = "ONE_WAY_TRANSFER",// Permanent relocation
    DEVELOPMENTAL = "DEVELOPMENTAL",// Training/development assignment
    PROJECT_BASED = "PROJECT_BASED",// Specific project duration
    EMERGENCY = "EMERGENCY"
}
/**
 * Status of global assignments
 */
export declare enum GlobalAssignmentStatus {
    PLANNING = "PLANNING",
    APPROVED = "APPROVED",
    IN_PREPARATION = "IN_PREPARATION",
    ACTIVE = "ACTIVE",
    EXTENDED = "EXTENDED",
    ENDING = "ENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    SUSPENDED = "SUSPENDED",
    FAILED = "FAILED"
}
/**
 * Visa and work permit types
 */
export declare enum VisaType {
    WORK_PERMIT = "WORK_PERMIT",
    BUSINESS_VISA = "BUSINESS_VISA",
    SKILLED_WORKER = "SKILLED_WORKER",
    INTRA_COMPANY_TRANSFER = "INTRA_COMPANY_TRANSFER",
    PERMANENT_RESIDENCE = "PERMANENT_RESIDENCE",
    EU_BLUE_CARD = "EU_BLUE_CARD",
    DEPENDENT_VISA = "DEPENDENT_VISA",
    STUDENT_VISA = "STUDENT_VISA",
    TEMPORARY_WORKER = "TEMPORARY_WORKER",
    INVESTOR_VISA = "INVESTOR_VISA"
}
/**
 * Visa status
 */
export declare enum VisaStatus {
    NOT_REQUIRED = "NOT_REQUIRED",
    REQUIRED = "REQUIRED",
    APPLICATION_IN_PROGRESS = "APPLICATION_IN_PROGRESS",
    APPROVED = "APPROVED",
    ACTIVE = "ACTIVE",
    EXPIRING_SOON = "EXPIRING_SOON",
    EXPIRED = "EXPIRED",
    DENIED = "DENIED",
    RENEWAL_IN_PROGRESS = "RENEWAL_IN_PROGRESS",
    CANCELLED = "CANCELLED"
}
/**
 * Tax equalization methods
 */
export declare enum TaxEqualizationMethod {
    TAX_PROTECTION = "TAX_PROTECTION",// Employee pays no more than home country
    TAX_EQUALIZATION = "TAX_EQUALIZATION",// Employee pays same as home country
    LAISSEZ_FAIRE = "LAISSEZ_FAIRE",// Employee responsible for all taxes
    AD_HOC = "AD_HOC",// Case-by-case basis
    BALANCE_SHEET = "BALANCE_SHEET"
}
/**
 * Global benefit types
 */
export declare enum GlobalBenefitType {
    HEALTH_INSURANCE = "HEALTH_INSURANCE",
    LIFE_INSURANCE = "LIFE_INSURANCE",
    PENSION_RETIREMENT = "PENSION_RETIREMENT",
    HOUSING_ALLOWANCE = "HOUSING_ALLOWANCE",
    EDUCATION_ALLOWANCE = "EDUCATION_ALLOWANCE",
    RELOCATION_ASSISTANCE = "RELOCATION_ASSISTANCE",
    HARDSHIP_ALLOWANCE = "HARDSHIP_ALLOWANCE",
    COST_OF_LIVING_ALLOWANCE = "COST_OF_LIVING_ALLOWANCE",
    CAR_ALLOWANCE = "CAR_ALLOWANCE",
    HOME_LEAVE = "HOME_LEAVE",
    LANGUAGE_TRAINING = "LANGUAGE_TRAINING",
    CULTURAL_TRAINING = "CULTURAL_TRAINING",
    TAX_PREPARATION = "TAX_PREPARATION",
    LEGAL_ASSISTANCE = "LEGAL_ASSISTANCE"
}
/**
 * Relocation status
 */
export declare enum RelocationStatus {
    INITIATED = "INITIATED",
    PLANNING = "PLANNING",
    APPROVED = "APPROVED",
    IN_PROGRESS = "IN_PROGRESS",
    SHIPMENT_IN_TRANSIT = "SHIPMENT_IN_TRANSIT",
    ARRIVAL_SERVICES = "ARRIVAL_SERVICES",
    SETTLING_IN = "SETTLING_IN",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    ON_HOLD = "ON_HOLD"
}
/**
 * Cultural adaptation stages
 */
export declare enum CulturalAdaptationStage {
    HONEYMOON = "HONEYMOON",// Initial excitement
    CULTURE_SHOCK = "CULTURE_SHOCK",// Difficulties emerge
    ADJUSTMENT = "ADJUSTMENT",// Gradual adaptation
    MASTERY = "MASTERY",// Full integration
    RE_ENTRY_SHOCK = "RE_ENTRY_SHOCK"
}
/**
 * Language proficiency levels (CEFR)
 */
export declare enum LanguageProficiencyLevel {
    A1_BEGINNER = "A1_BEGINNER",
    A2_ELEMENTARY = "A2_ELEMENTARY",
    B1_INTERMEDIATE = "B1_INTERMEDIATE",
    B2_UPPER_INTERMEDIATE = "B2_UPPER_INTERMEDIATE",
    C1_ADVANCED = "C1_ADVANCED",
    C2_PROFICIENT = "C2_PROFICIENT",
    NATIVE = "NATIVE"
}
/**
 * Global compliance frameworks
 */
export declare enum ComplianceFramework {
    GDPR = "GDPR",// EU General Data Protection Regulation
    HIPAA = "HIPAA",// US Health Insurance Portability and Accountability Act
    SOX = "SOX",// Sarbanes-Oxley Act
    ISO_27001 = "ISO_27001",// Information security
    ISO_9001 = "ISO_9001",// Quality management
    EEOC = "EEOC",// Equal Employment Opportunity
    FLSA = "FLSA",// Fair Labor Standards Act
    WTD = "WTD",// EU Working Time Directive
    CCPA = "CCPA",// California Consumer Privacy Act
    PIPEDA = "PIPEDA"
}
/**
 * Working time regulations
 */
export declare enum WorkingTimeRegulation {
    EU_WTD = "EU_WTD",// 48-hour week maximum
    US_FLSA = "US_FLSA",// 40-hour overtime threshold
    CUSTOM = "CUSTOM"
}
/**
 * Payroll frequency by country
 */
export declare enum PayrollFrequency {
    WEEKLY = "WEEKLY",
    BI_WEEKLY = "BI_WEEKLY",
    SEMI_MONTHLY = "SEMI_MONTHLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    ANNUALLY = "ANNUALLY"
}
/**
 * Exchange rate sources
 */
export declare enum ExchangeRateSource {
    ECB = "ECB",// European Central Bank
    FED = "FED",// US Federal Reserve
    BANK_OF_ENGLAND = "BANK_OF_ENGLAND",
    OANDA = "OANDA",
    XE = "XE",
    BLOOMBERG = "BLOOMBERG",
    MANUAL = "MANUAL"
}
/**
 * Global employee profile extending base employee
 */
export interface IGlobalEmployee {
    id: string;
    employeeId: string;
    homeCountry: CountryCode;
    currentCountry: CountryCode;
    citizenship: CountryCode[];
    workAuthorizations: IWorkAuthorization[];
    preferredCurrency: CurrencyCode;
    languageProficiencies: ILanguageProficiency[];
    taxResidency: ITaxResidency[];
    globalAssignments: IGlobalAssignment[];
    isExpatriate: boolean;
    expatriateStartDate?: Date;
    repatriationDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Work authorization details
 */
export interface IWorkAuthorization {
    country: CountryCode;
    visaType: VisaType;
    visaNumber: string;
    issueDate: Date;
    expiryDate: Date;
    status: VisaStatus;
    sponsorRequired: boolean;
    restrictions?: string;
}
/**
 * Language proficiency
 */
export interface ILanguageProficiency {
    language: string;
    proficiencyLevel: LanguageProficiencyLevel;
    certified: boolean;
    certificationDate?: Date;
    certificationBody?: string;
}
/**
 * Tax residency information
 */
export interface ITaxResidency {
    country: CountryCode;
    taxId: string;
    startDate: Date;
    endDate?: Date;
    isPrimary: boolean;
}
/**
 * Global assignment details
 */
export interface IGlobalAssignment {
    id: string;
    employeeId: string;
    assignmentType: GlobalAssignmentType;
    homeCountry: CountryCode;
    hostCountry: CountryCode;
    startDate: Date;
    plannedEndDate: Date;
    actualEndDate?: Date;
    status: GlobalAssignmentStatus;
    businessReason: string;
    costCenter: string;
    assignmentCosts: IAssignmentCosts;
    taxEqualization: ITaxEqualization;
    benefits: IGlobalBenefitPackage;
    familyAccompanying: boolean;
    dependentsCount: number;
    housingProvided: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Assignment cost breakdown
 */
export interface IAssignmentCosts {
    baseSalary: number;
    currency: CurrencyCode;
    allowances: IAllowance[];
    relocationCost: number;
    housingCost: number;
    educationCost: number;
    taxCost: number;
    totalEstimatedCost: number;
    actualCostToDate: number;
}
/**
 * Allowance details
 */
export interface IAllowance {
    type: GlobalBenefitType;
    amount: number;
    currency: CurrencyCode;
    frequency: PayrollFrequency;
    startDate: Date;
    endDate?: Date;
}
/**
 * Tax equalization details
 */
export interface ITaxEqualization {
    method: TaxEqualizationMethod;
    homeCountryTax: number;
    hostCountryTax: number;
    hypotheticalTax: number;
    taxReimbursement: number;
    taxGrossUp: number;
    taxYear: number;
}
/**
 * Global benefit package
 */
export interface IGlobalBenefitPackage {
    healthInsurance: IBenefitDetail;
    lifeInsurance: IBenefitDetail;
    pension: IBenefitDetail;
    additionalBenefits: IBenefitDetail[];
    totalValue: number;
    currency: CurrencyCode;
}
/**
 * Benefit detail
 */
export interface IBenefitDetail {
    type: GlobalBenefitType;
    provider: string;
    coverage: string;
    employerCost: number;
    employeeCost: number;
    currency: CurrencyCode;
}
/**
 * International transfer details
 */
export interface IInternationalTransfer {
    id: string;
    employeeId: string;
    fromCountry: CountryCode;
    toCountry: CountryCode;
    fromLegalEntity: string;
    toLegalEntity: string;
    transferDate: Date;
    reason: string;
    isPermanent: boolean;
    relocation: IRelocationDetails;
    status: RelocationStatus;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Relocation details
 */
export interface IRelocationDetails {
    relocationPackage: string;
    estimatedCost: number;
    currency: CurrencyCode;
    shipmentDetails?: IShipmentDetails;
    temporaryHousing?: ITemporaryHousing;
    arrivalServices: IArrivalService[];
    status: RelocationStatus;
}
/**
 * Shipment details
 */
export interface IShipmentDetails {
    shipmentDate: Date;
    estimatedArrival: Date;
    actualArrival?: Date;
    volume: number;
    weight: number;
    carrier: string;
    trackingNumber: string;
}
/**
 * Temporary housing
 */
export interface ITemporaryHousing {
    startDate: Date;
    endDate: Date;
    location: string;
    costPerDay: number;
    currency: CurrencyCode;
}
/**
 * Arrival services
 */
export interface IArrivalService {
    service: string;
    provider: string;
    scheduledDate: Date;
    completed: boolean;
    cost: number;
    currency: CurrencyCode;
}
/**
 * Country HR rules
 */
export interface ICountryHRRules {
    country: CountryCode;
    minimumWage?: number;
    currency: CurrencyCode;
    standardWorkWeek: number;
    overtimeThreshold: number;
    overtimeMultiplier: number;
    statutoryLeaves: IStatutoryLeave[];
    noticePeriods: INoticePeriod[];
    probationPeriod?: number;
    workingTimeRegulation: WorkingTimeRegulation;
    mandatoryBenefits: string[];
    terminationRules: ITerminationRules;
    updatedAt: Date;
}
/**
 * Statutory leave
 */
export interface IStatutoryLeave {
    leaveType: string;
    entitlementDays: number;
    paid: boolean;
    eligibilityCriteria: string;
}
/**
 * Notice period requirements
 */
export interface INoticePeriod {
    employmentDuration: string;
    noticeDays: number;
    whoInitiates: 'EMPLOYER' | 'EMPLOYEE' | 'BOTH';
}
/**
 * Termination rules
 */
export interface ITerminationRules {
    atWillEmployment: boolean;
    severanceRequired: boolean;
    severanceFormula?: string;
    legalApprovalRequired: boolean;
    consultationRequired: boolean;
}
/**
 * Visa/immigration tracking
 */
export interface IVisaImmigration {
    id: string;
    employeeId: string;
    country: CountryCode;
    visaType: VisaType;
    applicationDate: Date;
    approvalDate?: Date;
    issueDate?: Date;
    expiryDate: Date;
    status: VisaStatus;
    sponsorshipRequired: boolean;
    sponsoringEntity?: string;
    dependentsIncluded: number;
    renewalDate?: Date;
    alertSent: boolean;
    documents: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Cultural profile
 */
export interface ICulturalProfile {
    id: string;
    employeeId: string;
    country: CountryCode;
    adaptationStage: CulturalAdaptationStage;
    challengesReported: string[];
    supportProvided: string[];
    culturalTrainingCompleted: boolean;
    culturalMentorAssigned: boolean;
    adaptationScore: number;
    assessmentDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Exchange rate data
 */
export interface IExchangeRate {
    id: string;
    fromCurrency: CurrencyCode;
    toCurrency: CurrencyCode;
    rate: number;
    effectiveDate: Date;
    source: ExchangeRateSource;
    createdAt: Date;
}
/**
 * Global payroll sync data
 */
export interface IGlobalPayrollSync {
    id: string;
    country: CountryCode;
    payrollPeriod: string;
    employeeCount: number;
    totalGrossPay: number;
    currency: CurrencyCode;
    syncStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    syncDate: Date;
    errors?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Global compliance record
 */
export interface IGlobalCompliance {
    id: string;
    country: CountryCode;
    framework: ComplianceFramework;
    complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW';
    lastAuditDate: Date;
    nextAuditDate: Date;
    findings: string[];
    remediationActions: string[];
    responsibleParty: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Global organizational unit
 */
export interface IGlobalOrgUnit {
    id: string;
    unitName: string;
    country: CountryCode;
    legalEntity: string;
    parentUnitId?: string;
    headcount: number;
    currency: CurrencyCode;
    costCenter: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const GlobalEmployeeSchema: any;
export declare const GlobalAssignmentSchema: any;
export declare const InternationalTransferSchema: any;
export declare const VisaImmigrationSchema: any;
export declare const CulturalProfileSchema: any;
export declare const TaxEqualizationSchema: any;
/**
 * Global Employee Model
 */
export declare class GlobalEmployeeModel extends Model<IGlobalEmployee> {
    id: string;
    employeeId: string;
    homeCountry: CountryCode;
    currentCountry: CountryCode;
    citizenship: CountryCode[];
    workAuthorizations: IWorkAuthorization[];
    preferredCurrency: CurrencyCode;
    languageProficiencies: ILanguageProficiency[];
    taxResidency: ITaxResidency[];
    isExpatriate: boolean;
    expatriateStartDate?: Date;
    repatriationDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    globalAssignments: GlobalAssignmentModel[];
}
/**
 * Global Assignment Model
 */
export declare class GlobalAssignmentModel extends Model<IGlobalAssignment> {
    id: string;
    employeeId: string;
    assignmentType: GlobalAssignmentType;
    homeCountry: CountryCode;
    hostCountry: CountryCode;
    startDate: Date;
    plannedEndDate: Date;
    actualEndDate?: Date;
    status: GlobalAssignmentStatus;
    businessReason: string;
    costCenter: string;
    assignmentCosts: IAssignmentCosts;
    taxEqualization: ITaxEqualization;
    benefits: IGlobalBenefitPackage;
    familyAccompanying: boolean;
    dependentsCount: number;
    housingProvided: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    employee: GlobalEmployeeModel;
}
/**
 * International Transfer Model
 */
export declare class InternationalTransferModel extends Model<IInternationalTransfer> {
    id: string;
    employeeId: string;
    fromCountry: CountryCode;
    toCountry: CountryCode;
    fromLegalEntity: string;
    toLegalEntity: string;
    transferDate: Date;
    reason: string;
    isPermanent: boolean;
    relocation: IRelocationDetails;
    status: RelocationStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Visa Immigration Model
 */
export declare class VisaImmigrationModel extends Model<IVisaImmigration> {
    id: string;
    employeeId: string;
    country: CountryCode;
    visaType: VisaType;
    applicationDate: Date;
    approvalDate?: Date;
    issueDate?: Date;
    expiryDate: Date;
    status: VisaStatus;
    sponsorshipRequired: boolean;
    sponsoringEntity?: string;
    dependentsIncluded: number;
    renewalDate?: Date;
    alertSent: boolean;
    documents: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Country HR Rules Model
 */
export declare class CountryHRRulesModel extends Model<ICountryHRRules> {
    country: CountryCode;
    minimumWage?: number;
    currency: CurrencyCode;
    standardWorkWeek: number;
    overtimeThreshold: number;
    overtimeMultiplier: number;
    statutoryLeaves: IStatutoryLeave[];
    noticePeriods: INoticePeriod[];
    probationPeriod?: number;
    workingTimeRegulation: WorkingTimeRegulation;
    mandatoryBenefits: string[];
    terminationRules: ITerminationRules;
    updatedAt: Date;
}
/**
 * Cultural Profile Model
 */
export declare class CulturalProfileModel extends Model<ICulturalProfile> {
    id: string;
    employeeId: string;
    country: CountryCode;
    adaptationStage: CulturalAdaptationStage;
    challengesReported: string[];
    supportProvided: string[];
    culturalTrainingCompleted: boolean;
    culturalMentorAssigned: boolean;
    adaptationScore: number;
    assessmentDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Exchange Rate Model
 */
export declare class ExchangeRateModel extends Model<IExchangeRate> {
    id: string;
    fromCurrency: CurrencyCode;
    toCurrency: CurrencyCode;
    rate: number;
    effectiveDate: Date;
    source: ExchangeRateSource;
    createdAt: Date;
}
/**
 * Global Payroll Sync Model
 */
export declare class GlobalPayrollSyncModel extends Model<IGlobalPayrollSync> {
    id: string;
    country: CountryCode;
    payrollPeriod: string;
    employeeCount: number;
    totalGrossPay: number;
    currency: CurrencyCode;
    syncStatus: string;
    syncDate: Date;
    errors?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Global Compliance Model
 */
export declare class GlobalComplianceModel extends Model<IGlobalCompliance> {
    id: string;
    country: CountryCode;
    framework: ComplianceFramework;
    complianceStatus: string;
    lastAuditDate: Date;
    nextAuditDate: Date;
    findings: string[];
    remediationActions: string[];
    responsibleParty: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Global Organizational Unit Model
 */
export declare class GlobalOrgUnitModel extends Model<IGlobalOrgUnit> {
    id: string;
    unitName: string;
    country: CountryCode;
    legalEntity: string;
    parentUnitId?: string;
    headcount: number;
    currency: CurrencyCode;
    costCenter: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    parentUnit?: GlobalOrgUnitModel;
    childUnits: GlobalOrgUnitModel[];
}
/**
 * Multi-Country HR Management Functions
 */
/**
 * Create a global employee profile with multi-country capabilities
 * @param employeeData - Global employee data
 * @param transaction - Optional database transaction
 * @returns Created global employee record
 */
export declare function createGlobalEmployee(employeeData: z.infer<typeof GlobalEmployeeSchema>, transaction?: Transaction): Promise<GlobalEmployeeModel>;
/**
 * Update global employee profile with country-specific information
 * @param employeeId - Employee ID
 * @param updates - Profile updates
 * @param transaction - Optional database transaction
 * @returns Updated global employee
 */
export declare function updateGlobalEmployeeProfile(employeeId: string, updates: Partial<IGlobalEmployee>, transaction?: Transaction): Promise<GlobalEmployeeModel>;
/**
 * Get all employees by country with filtering
 * @param country - Country code
 * @param options - Query options
 * @returns List of employees in country
 */
export declare function getEmployeeByCountry(country: CountryCode, options?: {
    isExpatriate?: boolean;
    includeAssignments?: boolean;
    transaction?: Transaction;
}): Promise<GlobalEmployeeModel[]>;
/**
 * Transfer employee to different country
 * @param employeeId - Employee ID
 * @param toCountry - Destination country
 * @param effectiveDate - Effective transfer date
 * @param transaction - Optional database transaction
 * @returns Updated employee record
 */
export declare function transferEmployeeCountry(employeeId: string, toCountry: CountryCode, effectiveDate: Date, transaction?: Transaction): Promise<GlobalEmployeeModel>;
/**
 * Country-Specific Rules & Regulations Functions
 */
/**
 * Get HR rules for a specific country
 * @param country - Country code
 * @param transaction - Optional database transaction
 * @returns Country HR rules
 */
export declare function getCountryHRRules(country: CountryCode, transaction?: Transaction): Promise<CountryHRRulesModel>;
/**
 * Validate employment contract against country regulations
 * @param country - Country code
 * @param contractData - Contract data to validate
 * @param transaction - Optional database transaction
 * @returns Validation result with any violations
 */
export declare function validateEmploymentContract(country: CountryCode, contractData: {
    salary: number;
    workingHoursPerWeek: number;
    probationPeriodDays: number;
    noticePeriodDays: number;
}, transaction?: Transaction): Promise<{
    valid: boolean;
    violations: string[];
}>;
/**
 * Apply country-specific working hours regulations
 * @param country - Country code
 * @param hoursWorked - Hours worked in period
 * @param transaction - Optional database transaction
 * @returns Calculated regular and overtime hours
 */
export declare function applyCountrySpecificWorkingHours(country: CountryCode, hoursWorked: number, transaction?: Transaction): Promise<{
    regularHours: number;
    overtimeHours: number;
    overtimeMultiplier: number;
}>;
/**
 * Get country statutory leave entitlements
 * @param country - Country code
 * @param transaction - Optional database transaction
 * @returns List of statutory leaves
 */
export declare function getCountryStatutoryLeaves(country: CountryCode, transaction?: Transaction): Promise<IStatutoryLeave[]>;
/**
 * Global Assignment & Expatriate Management Functions
 */
/**
 * Create a new global assignment
 * @param assignmentData - Assignment data
 * @param transaction - Optional database transaction
 * @returns Created assignment
 */
export declare function createGlobalAssignment(assignmentData: z.infer<typeof GlobalAssignmentSchema>, transaction?: Transaction): Promise<GlobalAssignmentModel>;
/**
 * Track expatriate assignment progress and costs
 * @param assignmentId - Assignment ID
 * @param transaction - Optional database transaction
 * @returns Assignment with current tracking data
 */
export declare function trackExpatriateAssignment(assignmentId: string, transaction?: Transaction): Promise<GlobalAssignmentModel>;
/**
 * Calculate total assignment costs including all allowances
 * @param assignmentId - Assignment ID
 * @param transaction - Optional database transaction
 * @returns Detailed cost breakdown
 */
export declare function calculateAssignmentCosts(assignmentId: string, transaction?: Transaction): Promise<IAssignmentCosts>;
/**
 * End global assignment and repatriate employee
 * @param assignmentId - Assignment ID
 * @param actualEndDate - Actual end date
 * @param transaction - Optional database transaction
 * @returns Updated assignment
 */
export declare function endGlobalAssignment(assignmentId: string, actualEndDate: Date, transaction?: Transaction): Promise<GlobalAssignmentModel>;
/**
 * International Transfers & Relocations Functions
 */
/**
 * Initiate international transfer process
 * @param transferData - Transfer data
 * @param transaction - Optional database transaction
 * @returns Created transfer record
 */
export declare function initiateInternationalTransfer(transferData: z.infer<typeof InternationalTransferSchema>, transaction?: Transaction): Promise<InternationalTransferModel>;
/**
 * Calculate relocation costs based on country and family size
 * @param transferId - Transfer ID
 * @param familySize - Number of family members
 * @param transaction - Optional database transaction
 * @returns Estimated relocation cost
 */
export declare function calculateRelocationCosts(transferId: string, familySize: number, transaction?: Transaction): Promise<{
    estimatedCost: number;
    currency: CurrencyCode;
    breakdown: any;
}>;
/**
 * Track relocation progress through various stages
 * @param transferId - Transfer ID
 * @param newStatus - New relocation status
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 */
export declare function trackRelocationProgress(transferId: string, newStatus: RelocationStatus, transaction?: Transaction): Promise<InternationalTransferModel>;
/**
 * Complete relocation and finalize all activities
 * @param transferId - Transfer ID
 * @param actualCost - Actual relocation cost
 * @param transaction - Optional database transaction
 * @returns Completed transfer
 */
export declare function completeRelocation(transferId: string, actualCost: number, transaction?: Transaction): Promise<InternationalTransferModel>;
/**
 * Global Payroll Integration Functions
 */
/**
 * Synchronize global payroll data across countries
 * @param country - Country to sync
 * @param payrollPeriod - Payroll period
 * @param transaction - Optional database transaction
 * @returns Sync record
 */
export declare function syncGlobalPayrollData(country: CountryCode, payrollPeriod: string, transaction?: Transaction): Promise<GlobalPayrollSyncModel>;
/**
 * Calculate multi-country payroll with currency conversion
 * @param payrollPeriod - Payroll period
 * @param countries - Countries to include
 * @param baseCurrency - Base currency for reporting
 * @param transaction - Optional database transaction
 * @returns Consolidated payroll data
 */
export declare function calculateMultiCountryPayroll(payrollPeriod: string, countries: CountryCode[], baseCurrency: CurrencyCode, transaction?: Transaction): Promise<{
    totalGrossPay: number;
    currency: CurrencyCode;
    byCountry: Array<{
        country: CountryCode;
        amount: number;
        currency: CurrencyCode;
    }>;
}>;
/**
 * Reconcile global payroll across all entities
 * @param payrollPeriod - Payroll period
 * @param transaction - Optional database transaction
 * @returns Reconciliation results
 */
export declare function reconcileGlobalPayroll(payrollPeriod: string, transaction?: Transaction): Promise<{
    reconciled: boolean;
    discrepancies: any[];
}>;
/**
 * Generate global payslips for all countries
 * @param payrollPeriod - Payroll period
 * @param transaction - Optional database transaction
 * @returns Generated payslip count
 */
export declare function generateGlobalPayslips(payrollPeriod: string, transaction?: Transaction): Promise<{
    generated: number;
    byCountry: Map<CountryCode, number>;
}>;
/**
 * Currency & Exchange Rate Management Functions
 */
/**
 * Get current exchange rates for currency pair
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param effectiveDate - Effective date (defaults to today)
 * @param transaction - Optional database transaction
 * @returns Exchange rate
 */
export declare function getExchangeRates(fromCurrency: CurrencyCode, toCurrency: CurrencyCode, effectiveDate?: Date, transaction?: Transaction): Promise<number>;
/**
 * Convert salary amount to different currency
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param effectiveDate - Effective date
 * @param transaction - Optional database transaction
 * @returns Converted amount
 */
export declare function convertSalaryToCurrency(amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode, effectiveDate?: Date, transaction?: Transaction): Promise<{
    convertedAmount: number;
    rate: number;
    currency: CurrencyCode;
}>;
/**
 * Track currency fluctuations for budgeting
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param daysBack - Days to look back
 * @param transaction - Optional database transaction
 * @returns Fluctuation analysis
 */
export declare function trackCurrencyFluctuations(fromCurrency: CurrencyCode, toCurrency: CurrencyCode, daysBack: number, transaction?: Transaction): Promise<{
    currentRate: number;
    averageRate: number;
    minRate: number;
    maxRate: number;
    volatility: number;
}>;
/**
 * Apply exchange rate adjustments to payroll
 * @param assignmentId - Assignment ID
 * @param newRate - New exchange rate
 * @param transaction - Optional database transaction
 * @returns Updated assignment costs
 */
export declare function applyExchangeRateAdjustments(assignmentId: string, newRate: number, transaction?: Transaction): Promise<IAssignmentCosts>;
/**
 * Global Benefits Administration Functions
 */
/**
 * Enroll employee in global benefits program
 * @param employeeId - Employee ID
 * @param country - Country
 * @param benefitTypes - Benefit types to enroll
 * @param transaction - Optional database transaction
 * @returns Enrollment confirmation
 */
export declare function enrollInGlobalBenefits(employeeId: string, country: CountryCode, benefitTypes: GlobalBenefitType[], transaction?: Transaction): Promise<{
    enrolled: boolean;
    benefits: GlobalBenefitType[];
}>;
/**
 * Calculate global benefits costs across all countries
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Total benefit costs
 */
export declare function calculateGlobalBenefitsCosts(employeeId: string, transaction?: Transaction): Promise<{
    totalCost: number;
    currency: CurrencyCode;
    breakdown: any[];
}>;
/**
 * Synchronize benefits across countries for transferred employees
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Sync results
 */
export declare function syncBenefitsAcrossCountries(employeeId: string, transaction?: Transaction): Promise<{
    synced: boolean;
    countries: CountryCode[];
}>;
/**
 * Generate benefits comparison across countries
 * @param countries - Countries to compare
 * @param transaction - Optional database transaction
 * @returns Benefits comparison
 */
export declare function generateBenefitsComparison(countries: CountryCode[], transaction?: Transaction): Promise<any>;
/**
 * Tax Equalization & Gross-up Functions
 */
/**
 * Calculate tax equalization for expatriate
 * @param assignmentId - Assignment ID
 * @param homeCountryTax - Home country tax amount
 * @param hostCountryTax - Host country tax amount
 * @param transaction - Optional database transaction
 * @returns Tax equalization calculation
 */
export declare function calculateTaxEqualization(assignmentId: string, homeCountryTax: number, hostCountryTax: number, transaction?: Transaction): Promise<ITaxEqualization>;
/**
 * Perform tax gross-up calculation
 * @param assignmentId - Assignment ID
 * @param netAmount - Net amount to gross up
 * @param taxRate - Applicable tax rate
 * @param transaction - Optional database transaction
 * @returns Gross-up amount
 */
export declare function performTaxGrossUp(assignmentId: string, netAmount: number, taxRate: number, transaction?: Transaction): Promise<{
    grossAmount: number;
    taxGrossUp: number;
}>;
/**
 * Track tax liabilities across jurisdictions
 * @param employeeId - Employee ID
 * @param taxYear - Tax year
 * @param transaction - Optional database transaction
 * @returns Tax liabilities by country
 */
export declare function trackTaxLiabilities(employeeId: string, taxYear: number, transaction?: Transaction): Promise<Array<{
    country: CountryCode;
    liability: number;
    currency: CurrencyCode;
}>>;
/**
 * Generate tax equalization report
 * @param assignmentId - Assignment ID
 * @param transaction - Optional database transaction
 * @returns Tax equalization report
 */
export declare function generateTaxEqualizationReport(assignmentId: string, transaction?: Transaction): Promise<{
    assignment: IGlobalAssignment;
    taxEqualization: ITaxEqualization;
    recommendations: string[];
}>;
/**
 * Immigration & Visa Tracking Functions
 */
/**
 * Create visa application record
 * @param visaData - Visa application data
 * @param transaction - Optional database transaction
 * @returns Created visa record
 */
export declare function createVisaApplication(visaData: z.infer<typeof VisaImmigrationSchema>, transaction?: Transaction): Promise<VisaImmigrationModel>;
/**
 * Track visa status and update records
 * @param visaId - Visa ID
 * @param newStatus - New visa status
 * @param transaction - Optional database transaction
 * @returns Updated visa record
 */
export declare function trackVisaStatus(visaId: string, newStatus: VisaStatus, transaction?: Transaction): Promise<VisaImmigrationModel>;
/**
 * Send visa expiry alerts for upcoming expirations
 * @param daysBeforeExpiry - Days before expiry to alert
 * @param transaction - Optional database transaction
 * @returns List of employees with expiring visas
 */
export declare function sendVisaExpiryAlerts(daysBeforeExpiry: number, transaction?: Transaction): Promise<VisaImmigrationModel[]>;
/**
 * Renew work permit for employee
 * @param visaId - Visa ID
 * @param newExpiryDate - New expiry date
 * @param transaction - Optional database transaction
 * @returns Updated visa record
 */
export declare function renewWorkPermit(visaId: string, newExpiryDate: Date, transaction?: Transaction): Promise<VisaImmigrationModel>;
/**
 * Cultural & Language Support Functions
 */
/**
 * Create cultural adaptation profile
 * @param profileData - Cultural profile data
 * @param transaction - Optional database transaction
 * @returns Created cultural profile
 */
export declare function createCulturalProfile(profileData: z.infer<typeof CulturalProfileSchema>, transaction?: Transaction): Promise<CulturalProfileModel>;
/**
 * Assign language training to employee
 * @param employeeId - Employee ID
 * @param targetLanguage - Target language
 * @param targetProficiency - Target proficiency level
 * @param transaction - Optional database transaction
 * @returns Training assignment
 */
export declare function assignLanguageTraining(employeeId: string, targetLanguage: string, targetProficiency: LanguageProficiencyLevel, transaction?: Transaction): Promise<{
    assigned: boolean;
    employeeId: string;
    language: string;
    targetLevel: string;
}>;
/**
 * Track cultural adaptation progress
 * @param employeeId - Employee ID
 * @param country - Country
 * @param transaction - Optional database transaction
 * @returns Cultural adaptation tracking
 */
export declare function trackCulturalAdaptation(employeeId: string, country: CountryCode, transaction?: Transaction): Promise<CulturalProfileModel | null>;
/**
 * Generate cultural adaptation insights
 * @param country - Country
 * @param transaction - Optional database transaction
 * @returns Cultural insights
 */
export declare function generateCulturalInsights(country: CountryCode, transaction?: Transaction): Promise<{
    country: CountryCode;
    averageAdaptationScore: number;
    commonChallenges: string[];
    recommendedSupport: string[];
}>;
/**
 * Global Compliance & Reporting Functions
 */
/**
 * Validate global compliance across jurisdictions
 * @param country - Country
 * @param framework - Compliance framework
 * @param transaction - Optional database transaction
 * @returns Compliance validation results
 */
export declare function validateGlobalCompliance(country: CountryCode, framework: ComplianceFramework, transaction?: Transaction): Promise<GlobalComplianceModel | null>;
/**
 * Generate compliance report for country
 * @param country - Country
 * @param transaction - Optional database transaction
 * @returns Compliance report
 */
export declare function generateComplianceReport(country: CountryCode, transaction?: Transaction): Promise<{
    country: CountryCode;
    frameworks: ComplianceFramework[];
    overallStatus: string;
    criticalFindings: number;
}>;
/**
 * Track regulatory changes across countries
 * @param countries - Countries to track
 * @param transaction - Optional database transaction
 * @returns Regulatory changes
 */
export declare function trackRegulatoryChanges(countries: CountryCode[], transaction?: Transaction): Promise<Array<{
    country: CountryCode;
    changes: string[];
    lastUpdated: Date;
}>>;
/**
 * Audit global HR data for compliance
 * @param country - Country
 * @param auditScope - Scope of audit
 * @param transaction - Optional database transaction
 * @returns Audit results
 */
export declare function auditGlobalHRData(country: CountryCode, auditScope: string[], transaction?: Transaction): Promise<{
    audited: boolean;
    findings: string[];
    recommendations: string[];
}>;
/**
 * Global Organizational Structures Functions
 */
/**
 * Create global organizational unit
 * @param unitData - Org unit data
 * @param transaction - Optional database transaction
 * @returns Created org unit
 */
export declare function createGlobalOrgUnit(unitData: Partial<IGlobalOrgUnit>, transaction?: Transaction): Promise<GlobalOrgUnitModel>;
/**
 * Map global reporting lines across countries
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Reporting structure
 */
export declare function mapGlobalReportingLines(employeeId: string, transaction?: Transaction): Promise<{
    employee: string;
    reports: any[];
}>;
/**
 * Synchronize global org structure
 * @param transaction - Optional database transaction
 * @returns Sync results
 */
export declare function syncGlobalOrgStructure(transaction?: Transaction): Promise<{
    synced: boolean;
    units: number;
}>;
/**
 * Analyze global span of control
 * @param country - Country (optional)
 * @param transaction - Optional database transaction
 * @returns Span of control analysis
 */
export declare function analyzeGlobalSpanOfControl(country?: CountryCode, transaction?: Transaction): Promise<{
    averageSpan: number;
    maxSpan: number;
    unitsAnalyzed: number;
}>;
/**
 * Global HR Management Service
 * Provides enterprise-grade multi-country HR operations
 */
export declare class GlobalHRManagementService {
    /**
     * All 48 functions available as service methods with same signatures
     */
    createGlobalEmployee(data: z.infer<typeof GlobalEmployeeSchema>, transaction?: Transaction): Promise<GlobalEmployeeModel>;
    updateGlobalEmployeeProfile(employeeId: string, updates: Partial<IGlobalEmployee>, transaction?: Transaction): Promise<GlobalEmployeeModel>;
    getEmployeeByCountry(country: CountryCode, options?: {
        isExpatriate?: boolean;
        includeAssignments?: boolean;
        transaction?: Transaction;
    }): Promise<GlobalEmployeeModel[]>;
    transferEmployeeCountry(employeeId: string, toCountry: CountryCode, effectiveDate: Date, transaction?: Transaction): Promise<GlobalEmployeeModel>;
    getCountryHRRules(country: CountryCode, transaction?: Transaction): Promise<CountryHRRulesModel>;
    validateEmploymentContract(country: CountryCode, contractData: any, transaction?: Transaction): Promise<{
        valid: boolean;
        violations: string[];
    }>;
    applyCountrySpecificWorkingHours(country: CountryCode, hoursWorked: number, transaction?: Transaction): Promise<{
        regularHours: number;
        overtimeHours: number;
        overtimeMultiplier: number;
    }>;
    getCountryStatutoryLeaves(country: CountryCode, transaction?: Transaction): Promise<IStatutoryLeave[]>;
    createGlobalAssignment(data: z.infer<typeof GlobalAssignmentSchema>, transaction?: Transaction): Promise<GlobalAssignmentModel>;
    trackExpatriateAssignment(assignmentId: string, transaction?: Transaction): Promise<GlobalAssignmentModel>;
    calculateAssignmentCosts(assignmentId: string, transaction?: Transaction): Promise<IAssignmentCosts>;
    endGlobalAssignment(assignmentId: string, actualEndDate: Date, transaction?: Transaction): Promise<GlobalAssignmentModel>;
    initiateInternationalTransfer(data: z.infer<typeof InternationalTransferSchema>, transaction?: Transaction): Promise<InternationalTransferModel>;
    calculateRelocationCosts(transferId: string, familySize: number, transaction?: Transaction): Promise<{
        estimatedCost: number;
        currency: CurrencyCode;
        breakdown: any;
    }>;
    trackRelocationProgress(transferId: string, newStatus: RelocationStatus, transaction?: Transaction): Promise<InternationalTransferModel>;
    completeRelocation(transferId: string, actualCost: number, transaction?: Transaction): Promise<InternationalTransferModel>;
    syncGlobalPayrollData(country: CountryCode, payrollPeriod: string, transaction?: Transaction): Promise<GlobalPayrollSyncModel>;
    calculateMultiCountryPayroll(payrollPeriod: string, countries: CountryCode[], baseCurrency: CurrencyCode, transaction?: Transaction): Promise<{
        totalGrossPay: number;
        currency: CurrencyCode;
        byCountry: Array<{
            country: CountryCode;
            amount: number;
            currency: CurrencyCode;
        }>;
    }>;
    reconcileGlobalPayroll(payrollPeriod: string, transaction?: Transaction): Promise<{
        reconciled: boolean;
        discrepancies: any[];
    }>;
    generateGlobalPayslips(payrollPeriod: string, transaction?: Transaction): Promise<{
        generated: number;
        byCountry: Map<CountryCode, number>;
    }>;
    getExchangeRates(fromCurrency: CurrencyCode, toCurrency: CurrencyCode, effectiveDate?: Date, transaction?: Transaction): Promise<number>;
    convertSalaryToCurrency(amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode, effectiveDate?: Date, transaction?: Transaction): Promise<{
        convertedAmount: number;
        rate: number;
        currency: CurrencyCode;
    }>;
    trackCurrencyFluctuations(fromCurrency: CurrencyCode, toCurrency: CurrencyCode, daysBack: number, transaction?: Transaction): Promise<{
        currentRate: number;
        averageRate: number;
        minRate: number;
        maxRate: number;
        volatility: number;
    }>;
    applyExchangeRateAdjustments(assignmentId: string, newRate: number, transaction?: Transaction): Promise<IAssignmentCosts>;
    enrollInGlobalBenefits(employeeId: string, country: CountryCode, benefitTypes: GlobalBenefitType[], transaction?: Transaction): Promise<{
        enrolled: boolean;
        benefits: GlobalBenefitType[];
    }>;
    calculateGlobalBenefitsCosts(employeeId: string, transaction?: Transaction): Promise<{
        totalCost: number;
        currency: CurrencyCode;
        breakdown: any[];
    }>;
    syncBenefitsAcrossCountries(employeeId: string, transaction?: Transaction): Promise<{
        synced: boolean;
        countries: CountryCode[];
    }>;
    generateBenefitsComparison(countries: CountryCode[], transaction?: Transaction): Promise<any>;
    calculateTaxEqualization(assignmentId: string, homeCountryTax: number, hostCountryTax: number, transaction?: Transaction): Promise<ITaxEqualization>;
    performTaxGrossUp(assignmentId: string, netAmount: number, taxRate: number, transaction?: Transaction): Promise<{
        grossAmount: number;
        taxGrossUp: number;
    }>;
    trackTaxLiabilities(employeeId: string, taxYear: number, transaction?: Transaction): Promise<{
        country: CountryCode;
        liability: number;
        currency: CurrencyCode;
    }[]>;
    generateTaxEqualizationReport(assignmentId: string, transaction?: Transaction): Promise<{
        assignment: IGlobalAssignment;
        taxEqualization: ITaxEqualization;
        recommendations: string[];
    }>;
    createVisaApplication(data: z.infer<typeof VisaImmigrationSchema>, transaction?: Transaction): Promise<VisaImmigrationModel>;
    trackVisaStatus(visaId: string, newStatus: VisaStatus, transaction?: Transaction): Promise<VisaImmigrationModel>;
    sendVisaExpiryAlerts(daysBeforeExpiry: number, transaction?: Transaction): Promise<VisaImmigrationModel[]>;
    renewWorkPermit(visaId: string, newExpiryDate: Date, transaction?: Transaction): Promise<VisaImmigrationModel>;
    createCulturalProfile(data: z.infer<typeof CulturalProfileSchema>, transaction?: Transaction): Promise<CulturalProfileModel>;
    assignLanguageTraining(employeeId: string, targetLanguage: string, targetProficiency: LanguageProficiencyLevel, transaction?: Transaction): Promise<{
        assigned: boolean;
        employeeId: string;
        language: string;
        targetLevel: string;
    }>;
    trackCulturalAdaptation(employeeId: string, country: CountryCode, transaction?: Transaction): Promise<CulturalProfileModel | null>;
    generateCulturalInsights(country: CountryCode, transaction?: Transaction): Promise<{
        country: CountryCode;
        averageAdaptationScore: number;
        commonChallenges: string[];
        recommendedSupport: string[];
    }>;
    validateGlobalCompliance(country: CountryCode, framework: ComplianceFramework, transaction?: Transaction): Promise<GlobalComplianceModel | null>;
    generateComplianceReport(country: CountryCode, transaction?: Transaction): Promise<{
        country: CountryCode;
        frameworks: ComplianceFramework[];
        overallStatus: string;
        criticalFindings: number;
    }>;
    trackRegulatoryChanges(countries: CountryCode[], transaction?: Transaction): Promise<{
        country: CountryCode;
        changes: string[];
        lastUpdated: Date;
    }[]>;
    auditGlobalHRData(country: CountryCode, auditScope: string[], transaction?: Transaction): Promise<{
        audited: boolean;
        findings: string[];
        recommendations: string[];
    }>;
    createGlobalOrgUnit(unitData: Partial<IGlobalOrgUnit>, transaction?: Transaction): Promise<GlobalOrgUnitModel>;
    mapGlobalReportingLines(employeeId: string, transaction?: Transaction): Promise<{
        employee: string;
        reports: any[];
    }>;
    syncGlobalOrgStructure(transaction?: Transaction): Promise<{
        synced: boolean;
        units: number;
    }>;
    analyzeGlobalSpanOfControl(country?: CountryCode, transaction?: Transaction): Promise<{
        averageSpan: number;
        maxSpan: number;
        unitsAnalyzed: number;
    }>;
}
//# sourceMappingURL=global-hr-management-kit.d.ts.map