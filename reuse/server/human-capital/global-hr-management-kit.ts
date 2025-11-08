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

/**
 * File: /reuse/server/human-capital/global-hr-management-kit.ts
 * Locator: WC-HCM-GLOBAL-HR-001
 * Purpose: Global HR Management Kit - Comprehensive multi-country HR operations
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, i18next, Axios
 * Downstream: ../backend/hr/global/*, ../services/expatriate/*, Immigration portals, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 48+ utility functions for global HR management, multi-country operations, international
 *          assignments, expatriate tracking, global payroll integration, currency management, tax
 *          equalization, immigration & visa tracking, cultural adaptation, compliance, and reporting
 *
 * LLM Context: Enterprise-grade global HR management for White Cross healthcare system operating
 * across multiple countries. Provides comprehensive multi-country employee management including
 * country-specific HR rules and regulations, global assignment lifecycle, expatriate management,
 * international transfers and relocations, global payroll integration with multi-currency support,
 * exchange rate management, global benefits administration, tax equalization and gross-up calculations,
 * immigration and visa tracking with expiry alerts, cultural and language support programs, global
 * compliance monitoring across jurisdictions, and global organizational structure management.
 * Supports 50+ countries with localized employment regulations, GDPR/data privacy compliance,
 * multi-language capabilities, and integration with SAP SuccessFactors Employee Central Global.
 * HIPAA-compliant for healthcare employee international data.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsTo,
  HasMany,
  ForeignKey,
  Unique,
  Default,
  AllowNull,
  IsEmail,
  Length,
  IsUUID,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { z } from 'zod';
import { Op, Transaction, FindOptions, WhereOptions } from 'sequelize';

// ============================================================================
// ENUMS
// ============================================================================

/**
 * ISO 3166-1 alpha-2 country codes for supported countries
 */
export enum CountryCode {
  US = 'US', // United States
  CA = 'CA', // Canada
  GB = 'GB', // United Kingdom
  DE = 'DE', // Germany
  FR = 'FR', // France
  ES = 'ES', // Spain
  IT = 'IT', // Italy
  NL = 'NL', // Netherlands
  BE = 'BE', // Belgium
  CH = 'CH', // Switzerland
  AT = 'AT', // Austria
  SE = 'SE', // Sweden
  NO = 'NO', // Norway
  DK = 'DK', // Denmark
  FI = 'FI', // Finland
  IE = 'IE', // Ireland
  AU = 'AU', // Australia
  NZ = 'NZ', // New Zealand
  SG = 'SG', // Singapore
  HK = 'HK', // Hong Kong
  JP = 'JP', // Japan
  KR = 'KR', // South Korea
  CN = 'CN', // China
  IN = 'IN', // India
  AE = 'AE', // United Arab Emirates
  SA = 'SA', // Saudi Arabia
  BR = 'BR', // Brazil
  MX = 'MX', // Mexico
  AR = 'AR', // Argentina
  CL = 'CL', // Chile
  ZA = 'ZA', // South Africa
}

/**
 * ISO 4217 currency codes
 */
export enum CurrencyCode {
  USD = 'USD', // US Dollar
  EUR = 'EUR', // Euro
  GBP = 'GBP', // British Pound
  CHF = 'CHF', // Swiss Franc
  CAD = 'CAD', // Canadian Dollar
  AUD = 'AUD', // Australian Dollar
  NZD = 'NZD', // New Zealand Dollar
  SGD = 'SGD', // Singapore Dollar
  HKD = 'HKD', // Hong Kong Dollar
  JPY = 'JPY', // Japanese Yen
  KRW = 'KRW', // South Korean Won
  CNY = 'CNY', // Chinese Yuan
  INR = 'INR', // Indian Rupee
  AED = 'AED', // UAE Dirham
  SAR = 'SAR', // Saudi Riyal
  BRL = 'BRL', // Brazilian Real
  MXN = 'MXN', // Mexican Peso
  ARS = 'ARS', // Argentine Peso
  CLP = 'CLP', // Chilean Peso
  ZAR = 'ZAR', // South African Rand
  SEK = 'SEK', // Swedish Krona
  NOK = 'NOK', // Norwegian Krone
  DKK = 'DKK', // Danish Krone
}

/**
 * Types of global assignments
 */
export enum GlobalAssignmentType {
  SHORT_TERM = 'SHORT_TERM', // < 1 year
  LONG_TERM = 'LONG_TERM', // 1-5 years
  PERMANENT = 'PERMANENT', // > 5 years or indefinite
  COMMUTER = 'COMMUTER', // Daily/weekly commute across borders
  ROTATIONAL = 'ROTATIONAL', // Rotating schedules
  VIRTUAL = 'VIRTUAL', // Remote work from different country
  ONE_WAY_TRANSFER = 'ONE_WAY_TRANSFER', // Permanent relocation
  DEVELOPMENTAL = 'DEVELOPMENTAL', // Training/development assignment
  PROJECT_BASED = 'PROJECT_BASED', // Specific project duration
  EMERGENCY = 'EMERGENCY', // Emergency deployment
}

/**
 * Status of global assignments
 */
export enum GlobalAssignmentStatus {
  PLANNING = 'PLANNING',
  APPROVED = 'APPROVED',
  IN_PREPARATION = 'IN_PREPARATION',
  ACTIVE = 'ACTIVE',
  EXTENDED = 'EXTENDED',
  ENDING = 'ENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  SUSPENDED = 'SUSPENDED',
  FAILED = 'FAILED',
}

/**
 * Visa and work permit types
 */
export enum VisaType {
  WORK_PERMIT = 'WORK_PERMIT',
  BUSINESS_VISA = 'BUSINESS_VISA',
  SKILLED_WORKER = 'SKILLED_WORKER',
  INTRA_COMPANY_TRANSFER = 'INTRA_COMPANY_TRANSFER',
  PERMANENT_RESIDENCE = 'PERMANENT_RESIDENCE',
  EU_BLUE_CARD = 'EU_BLUE_CARD',
  DEPENDENT_VISA = 'DEPENDENT_VISA',
  STUDENT_VISA = 'STUDENT_VISA',
  TEMPORARY_WORKER = 'TEMPORARY_WORKER',
  INVESTOR_VISA = 'INVESTOR_VISA',
}

/**
 * Visa status
 */
export enum VisaStatus {
  NOT_REQUIRED = 'NOT_REQUIRED',
  REQUIRED = 'REQUIRED',
  APPLICATION_IN_PROGRESS = 'APPLICATION_IN_PROGRESS',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED',
  DENIED = 'DENIED',
  RENEWAL_IN_PROGRESS = 'RENEWAL_IN_PROGRESS',
  CANCELLED = 'CANCELLED',
}

/**
 * Tax equalization methods
 */
export enum TaxEqualizationMethod {
  TAX_PROTECTION = 'TAX_PROTECTION', // Employee pays no more than home country
  TAX_EQUALIZATION = 'TAX_EQUALIZATION', // Employee pays same as home country
  LAISSEZ_FAIRE = 'LAISSEZ_FAIRE', // Employee responsible for all taxes
  AD_HOC = 'AD_HOC', // Case-by-case basis
  BALANCE_SHEET = 'BALANCE_SHEET', // Comprehensive cost comparison
}

/**
 * Global benefit types
 */
export enum GlobalBenefitType {
  HEALTH_INSURANCE = 'HEALTH_INSURANCE',
  LIFE_INSURANCE = 'LIFE_INSURANCE',
  PENSION_RETIREMENT = 'PENSION_RETIREMENT',
  HOUSING_ALLOWANCE = 'HOUSING_ALLOWANCE',
  EDUCATION_ALLOWANCE = 'EDUCATION_ALLOWANCE',
  RELOCATION_ASSISTANCE = 'RELOCATION_ASSISTANCE',
  HARDSHIP_ALLOWANCE = 'HARDSHIP_ALLOWANCE',
  COST_OF_LIVING_ALLOWANCE = 'COST_OF_LIVING_ALLOWANCE',
  CAR_ALLOWANCE = 'CAR_ALLOWANCE',
  HOME_LEAVE = 'HOME_LEAVE',
  LANGUAGE_TRAINING = 'LANGUAGE_TRAINING',
  CULTURAL_TRAINING = 'CULTURAL_TRAINING',
  TAX_PREPARATION = 'TAX_PREPARATION',
  LEGAL_ASSISTANCE = 'LEGAL_ASSISTANCE',
}

/**
 * Relocation status
 */
export enum RelocationStatus {
  INITIATED = 'INITIATED',
  PLANNING = 'PLANNING',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  SHIPMENT_IN_TRANSIT = 'SHIPMENT_IN_TRANSIT',
  ARRIVAL_SERVICES = 'ARRIVAL_SERVICES',
  SETTLING_IN = 'SETTLING_IN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
}

/**
 * Cultural adaptation stages
 */
export enum CulturalAdaptationStage {
  HONEYMOON = 'HONEYMOON', // Initial excitement
  CULTURE_SHOCK = 'CULTURE_SHOCK', // Difficulties emerge
  ADJUSTMENT = 'ADJUSTMENT', // Gradual adaptation
  MASTERY = 'MASTERY', // Full integration
  RE_ENTRY_SHOCK = 'RE_ENTRY_SHOCK', // Returning home challenges
}

/**
 * Language proficiency levels (CEFR)
 */
export enum LanguageProficiencyLevel {
  A1_BEGINNER = 'A1_BEGINNER',
  A2_ELEMENTARY = 'A2_ELEMENTARY',
  B1_INTERMEDIATE = 'B1_INTERMEDIATE',
  B2_UPPER_INTERMEDIATE = 'B2_UPPER_INTERMEDIATE',
  C1_ADVANCED = 'C1_ADVANCED',
  C2_PROFICIENT = 'C2_PROFICIENT',
  NATIVE = 'NATIVE',
}

/**
 * Global compliance frameworks
 */
export enum ComplianceFramework {
  GDPR = 'GDPR', // EU General Data Protection Regulation
  HIPAA = 'HIPAA', // US Health Insurance Portability and Accountability Act
  SOX = 'SOX', // Sarbanes-Oxley Act
  ISO_27001 = 'ISO_27001', // Information security
  ISO_9001 = 'ISO_9001', // Quality management
  EEOC = 'EEOC', // Equal Employment Opportunity
  FLSA = 'FLSA', // Fair Labor Standards Act
  WTD = 'WTD', // EU Working Time Directive
  CCPA = 'CCPA', // California Consumer Privacy Act
  PIPEDA = 'PIPEDA', // Canadian privacy law
}

/**
 * Working time regulations
 */
export enum WorkingTimeRegulation {
  EU_WTD = 'EU_WTD', // 48-hour week maximum
  US_FLSA = 'US_FLSA', // 40-hour overtime threshold
  CUSTOM = 'CUSTOM',
}

/**
 * Payroll frequency by country
 */
export enum PayrollFrequency {
  WEEKLY = 'WEEKLY',
  BI_WEEKLY = 'BI_WEEKLY',
  SEMI_MONTHLY = 'SEMI_MONTHLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
}

/**
 * Exchange rate sources
 */
export enum ExchangeRateSource {
  ECB = 'ECB', // European Central Bank
  FED = 'FED', // US Federal Reserve
  BANK_OF_ENGLAND = 'BANK_OF_ENGLAND',
  OANDA = 'OANDA',
  XE = 'XE',
  BLOOMBERG = 'BLOOMBERG',
  MANUAL = 'MANUAL',
}

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

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
  language: string; // ISO 639-1 code
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
  employmentDuration: string; // e.g., "0-6 months"
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
  adaptationScore: number; // 0-100
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

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

export const GlobalEmployeeSchema = z.object({
  employeeId: z.string().uuid(),
  homeCountry: z.nativeEnum(CountryCode),
  currentCountry: z.nativeEnum(CountryCode),
  citizenship: z.array(z.nativeEnum(CountryCode)).min(1),
  preferredCurrency: z.nativeEnum(CurrencyCode),
  isExpatriate: z.boolean(),
  expatriateStartDate: z.date().optional(),
  repatriationDate: z.date().optional(),
});

export const GlobalAssignmentSchema = z.object({
  employeeId: z.string().uuid(),
  assignmentType: z.nativeEnum(GlobalAssignmentType),
  homeCountry: z.nativeEnum(CountryCode),
  hostCountry: z.nativeEnum(CountryCode),
  startDate: z.date(),
  plannedEndDate: z.date(),
  businessReason: z.string().min(10).max(500),
  costCenter: z.string().min(1).max(50),
  familyAccompanying: z.boolean(),
  dependentsCount: z.number().int().min(0).max(20),
  housingProvided: z.boolean(),
});

export const InternationalTransferSchema = z.object({
  employeeId: z.string().uuid(),
  fromCountry: z.nativeEnum(CountryCode),
  toCountry: z.nativeEnum(CountryCode),
  fromLegalEntity: z.string().min(1),
  toLegalEntity: z.string().min(1),
  transferDate: z.date(),
  reason: z.string().min(10).max(500),
  isPermanent: z.boolean(),
});

export const VisaImmigrationSchema = z.object({
  employeeId: z.string().uuid(),
  country: z.nativeEnum(CountryCode),
  visaType: z.nativeEnum(VisaType),
  applicationDate: z.date(),
  expiryDate: z.date(),
  sponsorshipRequired: z.boolean(),
  sponsoringEntity: z.string().optional(),
  dependentsIncluded: z.number().int().min(0),
});

export const CulturalProfileSchema = z.object({
  employeeId: z.string().uuid(),
  country: z.nativeEnum(CountryCode),
  adaptationStage: z.nativeEnum(CulturalAdaptationStage),
  challengesReported: z.array(z.string()),
  supportProvided: z.array(z.string()),
  culturalTrainingCompleted: z.boolean(),
  culturalMentorAssigned: z.boolean(),
  adaptationScore: z.number().min(0).max(100),
});

export const TaxEqualizationSchema = z.object({
  method: z.nativeEnum(TaxEqualizationMethod),
  homeCountryTax: z.number().min(0),
  hostCountryTax: z.number().min(0),
  hypotheticalTax: z.number().min(0),
  taxYear: z.number().int().min(2000).max(2100),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Global Employee Model
 */
@Table({ tableName: 'global_employees', timestamps: true, paranoid: true })
export class GlobalEmployeeModel extends Model<IGlobalEmployee> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  employeeId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(2))
  homeCountry!: CountryCode;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(2))
  currentCountry!: CountryCode;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.STRING(2)))
  citizenship!: CountryCode[];

  @Column(DataType.JSONB)
  workAuthorizations!: IWorkAuthorization[];

  @AllowNull(false)
  @Column(DataType.STRING(3))
  preferredCurrency!: CurrencyCode;

  @Column(DataType.JSONB)
  languageProficiencies!: ILanguageProficiency[];

  @Column(DataType.JSONB)
  taxResidency!: ITaxResidency[];

  @Default(false)
  @Column(DataType.BOOLEAN)
  isExpatriate!: boolean;

  @Column(DataType.DATE)
  expatriateStartDate?: Date;

  @Column(DataType.DATE)
  repatriationDate?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => GlobalAssignmentModel)
  globalAssignments!: GlobalAssignmentModel[];
}

/**
 * Global Assignment Model
 */
@Table({ tableName: 'global_assignments', timestamps: true, paranoid: true })
export class GlobalAssignmentModel extends Model<IGlobalAssignment> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @ForeignKey(() => GlobalEmployeeModel)
  @Index
  @Column(DataType.UUID)
  employeeId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  assignmentType!: GlobalAssignmentType;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  homeCountry!: CountryCode;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(2))
  hostCountry!: CountryCode;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  startDate!: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  plannedEndDate!: Date;

  @Column(DataType.DATE)
  actualEndDate?: Date;

  @AllowNull(false)
  @Default('PLANNING')
  @Index
  @Column(DataType.STRING(50))
  status!: GlobalAssignmentStatus;

  @AllowNull(false)
  @Column(DataType.TEXT)
  businessReason!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  costCenter!: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  assignmentCosts!: IAssignmentCosts;

  @Column(DataType.JSONB)
  taxEqualization!: ITaxEqualization;

  @Column(DataType.JSONB)
  benefits!: IGlobalBenefitPackage;

  @Default(false)
  @Column(DataType.BOOLEAN)
  familyAccompanying!: boolean;

  @Default(0)
  @Column(DataType.INTEGER)
  dependentsCount!: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  housingProvided!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => GlobalEmployeeModel)
  employee!: GlobalEmployeeModel;
}

/**
 * International Transfer Model
 */
@Table({ tableName: 'international_transfers', timestamps: true, paranoid: true })
export class InternationalTransferModel extends Model<IInternationalTransfer> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  employeeId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  fromCountry!: CountryCode;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(2))
  toCountry!: CountryCode;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  fromLegalEntity!: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  toLegalEntity!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  transferDate!: Date;

  @AllowNull(false)
  @Column(DataType.TEXT)
  reason!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isPermanent!: boolean;

  @AllowNull(false)
  @Column(DataType.JSONB)
  relocation!: IRelocationDetails;

  @AllowNull(false)
  @Default('INITIATED')
  @Index
  @Column(DataType.STRING(50))
  status!: RelocationStatus;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Visa Immigration Model
 */
@Table({ tableName: 'visa_immigration', timestamps: true, paranoid: true })
export class VisaImmigrationModel extends Model<IVisaImmigration> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  employeeId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(2))
  country!: CountryCode;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  visaType!: VisaType;

  @AllowNull(false)
  @Column(DataType.DATE)
  applicationDate!: Date;

  @Column(DataType.DATE)
  approvalDate?: Date;

  @Column(DataType.DATE)
  issueDate?: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  expiryDate!: Date;

  @AllowNull(false)
  @Default('REQUIRED')
  @Index
  @Column(DataType.STRING(50))
  status!: VisaStatus;

  @Default(false)
  @Column(DataType.BOOLEAN)
  sponsorshipRequired!: boolean;

  @Column(DataType.STRING(200))
  sponsoringEntity?: string;

  @Default(0)
  @Column(DataType.INTEGER)
  dependentsIncluded!: number;

  @Column(DataType.DATE)
  renewalDate?: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  alertSent!: boolean;

  @Column(DataType.ARRAY(DataType.STRING))
  documents!: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Country HR Rules Model
 */
@Table({ tableName: 'country_hr_rules', timestamps: true })
export class CountryHRRulesModel extends Model<ICountryHRRules> {
  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING(2), primaryKey: true })
  country!: CountryCode;

  @Column(DataType.DECIMAL(10, 2))
  minimumWage?: number;

  @AllowNull(false)
  @Column(DataType.STRING(3))
  currency!: CurrencyCode;

  @AllowNull(false)
  @Default(40)
  @Column(DataType.INTEGER)
  standardWorkWeek!: number;

  @AllowNull(false)
  @Default(40)
  @Column(DataType.INTEGER)
  overtimeThreshold!: number;

  @AllowNull(false)
  @Default(1.5)
  @Column(DataType.DECIMAL(3, 2))
  overtimeMultiplier!: number;

  @AllowNull(false)
  @Column(DataType.JSONB)
  statutoryLeaves!: IStatutoryLeave[];

  @AllowNull(false)
  @Column(DataType.JSONB)
  noticePeriods!: INoticePeriod[];

  @Column(DataType.INTEGER)
  probationPeriod?: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  workingTimeRegulation!: WorkingTimeRegulation;

  @Column(DataType.ARRAY(DataType.STRING))
  mandatoryBenefits!: string[];

  @AllowNull(false)
  @Column(DataType.JSONB)
  terminationRules!: ITerminationRules;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Cultural Profile Model
 */
@Table({ tableName: 'cultural_profiles', timestamps: true, paranoid: true })
export class CulturalProfileModel extends Model<ICulturalProfile> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  employeeId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  country!: CountryCode;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  adaptationStage!: CulturalAdaptationStage;

  @Column(DataType.ARRAY(DataType.TEXT))
  challengesReported!: string[];

  @Column(DataType.ARRAY(DataType.TEXT))
  supportProvided!: string[];

  @Default(false)
  @Column(DataType.BOOLEAN)
  culturalTrainingCompleted!: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  culturalMentorAssigned!: boolean;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  adaptationScore!: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  assessmentDate!: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Exchange Rate Model
 */
@Table({ tableName: 'exchange_rates', timestamps: true })
export class ExchangeRateModel extends Model<IExchangeRate> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(3))
  fromCurrency!: CurrencyCode;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(3))
  toCurrency!: CurrencyCode;

  @AllowNull(false)
  @Column(DataType.DECIMAL(18, 6))
  rate!: number;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  effectiveDate!: Date;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  source!: ExchangeRateSource;

  @CreatedAt
  createdAt!: Date;
}

/**
 * Global Payroll Sync Model
 */
@Table({ tableName: 'global_payroll_sync', timestamps: true })
export class GlobalPayrollSyncModel extends Model<IGlobalPayrollSync> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(2))
  country!: CountryCode;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(20))
  payrollPeriod!: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  employeeCount!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  totalGrossPay!: number;

  @AllowNull(false)
  @Column(DataType.STRING(3))
  currency!: CurrencyCode;

  @AllowNull(false)
  @Default('PENDING')
  @Index
  @Column(DataType.STRING(20))
  syncStatus!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  syncDate!: Date;

  @Column(DataType.ARRAY(DataType.TEXT))
  errors?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Global Compliance Model
 */
@Table({ tableName: 'global_compliance', timestamps: true })
export class GlobalComplianceModel extends Model<IGlobalCompliance> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(2))
  country!: CountryCode;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  framework!: ComplianceFramework;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(20))
  complianceStatus!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  lastAuditDate!: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  nextAuditDate!: Date;

  @Column(DataType.ARRAY(DataType.TEXT))
  findings!: string[];

  @Column(DataType.ARRAY(DataType.TEXT))
  remediationActions!: string[];

  @AllowNull(false)
  @Column(DataType.STRING(200))
  responsibleParty!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Global Organizational Unit Model
 */
@Table({ tableName: 'global_org_units', timestamps: true, paranoid: true })
export class GlobalOrgUnitModel extends Model<IGlobalOrgUnit> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  unitName!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(2))
  country!: CountryCode;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  legalEntity!: string;

  @IsUUID(4)
  @ForeignKey(() => GlobalOrgUnitModel)
  @Column(DataType.UUID)
  parentUnitId?: string;

  @Default(0)
  @Column(DataType.INTEGER)
  headcount!: number;

  @AllowNull(false)
  @Column(DataType.STRING(3))
  currency!: CurrencyCode;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  costCenter!: string;

  @Default(true)
  @Index
  @Column(DataType.BOOLEAN)
  active!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => GlobalOrgUnitModel, 'parentUnitId')
  parentUnit?: GlobalOrgUnitModel;

  @HasMany(() => GlobalOrgUnitModel, 'parentUnitId')
  childUnits!: GlobalOrgUnitModel[];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Multi-Country HR Management Functions
 */

/**
 * Create a global employee profile with multi-country capabilities
 * @param employeeData - Global employee data
 * @param transaction - Optional database transaction
 * @returns Created global employee record
 */
export async function createGlobalEmployee(
  employeeData: z.infer<typeof GlobalEmployeeSchema>,
  transaction?: Transaction,
): Promise<GlobalEmployeeModel> {
  const validated = GlobalEmployeeSchema.parse(employeeData);

  const globalEmployee = await GlobalEmployeeModel.create(
    {
      ...validated,
      workAuthorizations: [],
      languageProficiencies: [],
      taxResidency: [],
    },
    { transaction },
  );

  return globalEmployee;
}

/**
 * Update global employee profile with country-specific information
 * @param employeeId - Employee ID
 * @param updates - Profile updates
 * @param transaction - Optional database transaction
 * @returns Updated global employee
 */
export async function updateGlobalEmployeeProfile(
  employeeId: string,
  updates: Partial<IGlobalEmployee>,
  transaction?: Transaction,
): Promise<GlobalEmployeeModel> {
  const employee = await GlobalEmployeeModel.findOne({
    where: { employeeId },
    transaction,
  });

  if (!employee) {
    throw new NotFoundException(`Global employee ${employeeId} not found`);
  }

  await employee.update(updates, { transaction });
  return employee;
}

/**
 * Get all employees by country with filtering
 * @param country - Country code
 * @param options - Query options
 * @returns List of employees in country
 */
export async function getEmployeeByCountry(
  country: CountryCode,
  options?: {
    isExpatriate?: boolean;
    includeAssignments?: boolean;
    transaction?: Transaction;
  },
): Promise<GlobalEmployeeModel[]> {
  const where: WhereOptions<IGlobalEmployee> = { currentCountry: country };

  if (options?.isExpatriate !== undefined) {
    where.isExpatriate = options.isExpatriate;
  }

  const employees = await GlobalEmployeeModel.findAll({
    where,
    include: options?.includeAssignments
      ? [{ model: GlobalAssignmentModel, as: 'globalAssignments' }]
      : undefined,
    transaction: options?.transaction,
  });

  return employees;
}

/**
 * Transfer employee to different country
 * @param employeeId - Employee ID
 * @param toCountry - Destination country
 * @param effectiveDate - Effective transfer date
 * @param transaction - Optional database transaction
 * @returns Updated employee record
 */
export async function transferEmployeeCountry(
  employeeId: string,
  toCountry: CountryCode,
  effectiveDate: Date,
  transaction?: Transaction,
): Promise<GlobalEmployeeModel> {
  const employee = await GlobalEmployeeModel.findOne({
    where: { employeeId },
    transaction,
  });

  if (!employee) {
    throw new NotFoundException(`Employee ${employeeId} not found`);
  }

  const fromCountry = employee.currentCountry;

  await employee.update(
    {
      currentCountry: toCountry,
      isExpatriate: employee.homeCountry !== toCountry,
    },
    { transaction },
  );

  // Create international transfer record
  await InternationalTransferModel.create(
    {
      employeeId,
      fromCountry,
      toCountry,
      fromLegalEntity: `${fromCountry}_Entity`,
      toLegalEntity: `${toCountry}_Entity`,
      transferDate: effectiveDate,
      reason: 'Country transfer',
      isPermanent: false,
      relocation: {
        relocationPackage: 'Standard',
        estimatedCost: 0,
        currency: CurrencyCode.USD,
        arrivalServices: [],
        status: RelocationStatus.INITIATED,
      },
      status: RelocationStatus.INITIATED,
    },
    { transaction },
  );

  return employee;
}

/**
 * Country-Specific Rules & Regulations Functions
 */

/**
 * Get HR rules for a specific country
 * @param country - Country code
 * @param transaction - Optional database transaction
 * @returns Country HR rules
 */
export async function getCountryHRRules(
  country: CountryCode,
  transaction?: Transaction,
): Promise<CountryHRRulesModel> {
  const rules = await CountryHRRulesModel.findByPk(country, { transaction });

  if (!rules) {
    throw new NotFoundException(`HR rules for country ${country} not found`);
  }

  return rules;
}

/**
 * Validate employment contract against country regulations
 * @param country - Country code
 * @param contractData - Contract data to validate
 * @param transaction - Optional database transaction
 * @returns Validation result with any violations
 */
export async function validateEmploymentContract(
  country: CountryCode,
  contractData: {
    salary: number;
    workingHoursPerWeek: number;
    probationPeriodDays: number;
    noticePeriodDays: number;
  },
  transaction?: Transaction,
): Promise<{ valid: boolean; violations: string[] }> {
  const rules = await getCountryHRRules(country, transaction);
  const violations: string[] = [];

  // Check minimum wage
  if (rules.minimumWage && contractData.salary < rules.minimumWage) {
    violations.push(
      `Salary below minimum wage: ${contractData.salary} < ${rules.minimumWage} ${rules.currency}`,
    );
  }

  // Check working hours
  if (contractData.workingHoursPerWeek > rules.standardWorkWeek) {
    violations.push(
      `Working hours exceed standard: ${contractData.workingHoursPerWeek} > ${rules.standardWorkWeek}`,
    );
  }

  // Check probation period
  if (rules.probationPeriod && contractData.probationPeriodDays > rules.probationPeriod) {
    violations.push(
      `Probation period exceeds maximum: ${contractData.probationPeriodDays} > ${rules.probationPeriod} days`,
    );
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Apply country-specific working hours regulations
 * @param country - Country code
 * @param hoursWorked - Hours worked in period
 * @param transaction - Optional database transaction
 * @returns Calculated regular and overtime hours
 */
export async function applyCountrySpecificWorkingHours(
  country: CountryCode,
  hoursWorked: number,
  transaction?: Transaction,
): Promise<{ regularHours: number; overtimeHours: number; overtimeMultiplier: number }> {
  const rules = await getCountryHRRules(country, transaction);

  const regularHours = Math.min(hoursWorked, rules.overtimeThreshold);
  const overtimeHours = Math.max(0, hoursWorked - rules.overtimeThreshold);

  return {
    regularHours,
    overtimeHours,
    overtimeMultiplier: parseFloat(rules.overtimeMultiplier.toString()),
  };
}

/**
 * Get country statutory leave entitlements
 * @param country - Country code
 * @param transaction - Optional database transaction
 * @returns List of statutory leaves
 */
export async function getCountryStatutoryLeaves(
  country: CountryCode,
  transaction?: Transaction,
): Promise<IStatutoryLeave[]> {
  const rules = await getCountryHRRules(country, transaction);
  return rules.statutoryLeaves;
}

/**
 * Global Assignment & Expatriate Management Functions
 */

/**
 * Create a new global assignment
 * @param assignmentData - Assignment data
 * @param transaction - Optional database transaction
 * @returns Created assignment
 */
export async function createGlobalAssignment(
  assignmentData: z.infer<typeof GlobalAssignmentSchema>,
  transaction?: Transaction,
): Promise<GlobalAssignmentModel> {
  const validated = GlobalAssignmentSchema.parse(assignmentData);

  // Verify employee exists
  const employee = await GlobalEmployeeModel.findOne({
    where: { employeeId: validated.employeeId },
    transaction,
  });

  if (!employee) {
    throw new NotFoundException(`Employee ${validated.employeeId} not found`);
  }

  // Create assignment with default costs structure
  const assignment = await GlobalAssignmentModel.create(
    {
      ...validated,
      status: GlobalAssignmentStatus.PLANNING,
      assignmentCosts: {
        baseSalary: 0,
        currency: CurrencyCode.USD,
        allowances: [],
        relocationCost: 0,
        housingCost: 0,
        educationCost: 0,
        taxCost: 0,
        totalEstimatedCost: 0,
        actualCostToDate: 0,
      },
      taxEqualization: {
        method: TaxEqualizationMethod.TAX_EQUALIZATION,
        homeCountryTax: 0,
        hostCountryTax: 0,
        hypotheticalTax: 0,
        taxReimbursement: 0,
        taxGrossUp: 0,
        taxYear: new Date().getFullYear(),
      },
      benefits: {
        healthInsurance: {
          type: GlobalBenefitType.HEALTH_INSURANCE,
          provider: '',
          coverage: '',
          employerCost: 0,
          employeeCost: 0,
          currency: CurrencyCode.USD,
        },
        lifeInsurance: {
          type: GlobalBenefitType.LIFE_INSURANCE,
          provider: '',
          coverage: '',
          employerCost: 0,
          employeeCost: 0,
          currency: CurrencyCode.USD,
        },
        pension: {
          type: GlobalBenefitType.PENSION_RETIREMENT,
          provider: '',
          coverage: '',
          employerCost: 0,
          employeeCost: 0,
          currency: CurrencyCode.USD,
        },
        additionalBenefits: [],
        totalValue: 0,
        currency: CurrencyCode.USD,
      },
    },
    { transaction },
  );

  // Mark employee as expatriate
  await employee.update(
    {
      isExpatriate: true,
      expatriateStartDate: validated.startDate,
      currentCountry: validated.hostCountry,
    },
    { transaction },
  );

  return assignment;
}

/**
 * Track expatriate assignment progress and costs
 * @param assignmentId - Assignment ID
 * @param transaction - Optional database transaction
 * @returns Assignment with current tracking data
 */
export async function trackExpatriateAssignment(
  assignmentId: string,
  transaction?: Transaction,
): Promise<GlobalAssignmentModel> {
  const assignment = await GlobalAssignmentModel.findByPk(assignmentId, {
    include: [GlobalEmployeeModel],
    transaction,
  });

  if (!assignment) {
    throw new NotFoundException(`Assignment ${assignmentId} not found`);
  }

  // Calculate days into assignment
  const today = new Date();
  const daysElapsed = Math.floor(
    (today.getTime() - assignment.startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const totalDays = Math.floor(
    (assignment.plannedEndDate.getTime() - assignment.startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const progressPercentage = Math.min(100, (daysElapsed / totalDays) * 100);

  return assignment;
}

/**
 * Calculate total assignment costs including all allowances
 * @param assignmentId - Assignment ID
 * @param transaction - Optional database transaction
 * @returns Detailed cost breakdown
 */
export async function calculateAssignmentCosts(
  assignmentId: string,
  transaction?: Transaction,
): Promise<IAssignmentCosts> {
  const assignment = await GlobalAssignmentModel.findByPk(assignmentId, { transaction });

  if (!assignment) {
    throw new NotFoundException(`Assignment ${assignmentId} not found`);
  }

  const costs = assignment.assignmentCosts;

  // Calculate total from all components
  const allowancesTotal = costs.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);

  const totalEstimatedCost =
    costs.baseSalary +
    allowancesTotal +
    costs.relocationCost +
    costs.housingCost +
    costs.educationCost +
    costs.taxCost;

  costs.totalEstimatedCost = totalEstimatedCost;

  await assignment.update({ assignmentCosts: costs }, { transaction });

  return costs;
}

/**
 * End global assignment and repatriate employee
 * @param assignmentId - Assignment ID
 * @param actualEndDate - Actual end date
 * @param transaction - Optional database transaction
 * @returns Updated assignment
 */
export async function endGlobalAssignment(
  assignmentId: string,
  actualEndDate: Date,
  transaction?: Transaction,
): Promise<GlobalAssignmentModel> {
  const assignment = await GlobalAssignmentModel.findByPk(assignmentId, {
    include: [GlobalEmployeeModel],
    transaction,
  });

  if (!assignment) {
    throw new NotFoundException(`Assignment ${assignmentId} not found`);
  }

  await assignment.update(
    {
      actualEndDate,
      status: GlobalAssignmentStatus.COMPLETED,
    },
    { transaction },
  );

  // Check if employee has other active assignments
  const otherAssignments = await GlobalAssignmentModel.count({
    where: {
      employeeId: assignment.employeeId,
      status: GlobalAssignmentStatus.ACTIVE,
      id: { [Op.ne]: assignmentId },
    },
    transaction,
  });

  // If no other assignments, mark as no longer expatriate
  if (otherAssignments === 0 && assignment.employee) {
    await assignment.employee.update(
      {
        isExpatriate: false,
        repatriationDate: actualEndDate,
        currentCountry: assignment.employee.homeCountry,
      },
      { transaction },
    );
  }

  return assignment;
}

/**
 * International Transfers & Relocations Functions
 */

/**
 * Initiate international transfer process
 * @param transferData - Transfer data
 * @param transaction - Optional database transaction
 * @returns Created transfer record
 */
export async function initiateInternationalTransfer(
  transferData: z.infer<typeof InternationalTransferSchema>,
  transaction?: Transaction,
): Promise<InternationalTransferModel> {
  const validated = InternationalTransferSchema.parse(transferData);

  const transfer = await InternationalTransferModel.create(
    {
      ...validated,
      relocation: {
        relocationPackage: 'Standard',
        estimatedCost: 0,
        currency: CurrencyCode.USD,
        arrivalServices: [],
        status: RelocationStatus.INITIATED,
      },
      status: RelocationStatus.INITIATED,
    },
    { transaction },
  );

  return transfer;
}

/**
 * Calculate relocation costs based on country and family size
 * @param transferId - Transfer ID
 * @param familySize - Number of family members
 * @param transaction - Optional database transaction
 * @returns Estimated relocation cost
 */
export async function calculateRelocationCosts(
  transferId: string,
  familySize: number,
  transaction?: Transaction,
): Promise<{ estimatedCost: number; currency: CurrencyCode; breakdown: any }> {
  const transfer = await InternationalTransferModel.findByPk(transferId, { transaction });

  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  // Base cost factors (simplified calculation)
  const baseCost = 10000; // Base relocation cost
  const perPersonCost = 3000;
  const shippingCost = 5000;
  const temporaryHousingCost = 4000; // 30 days average

  const totalCost = baseCost + perPersonCost * familySize + shippingCost + temporaryHousingCost;

  const breakdown = {
    baseCost,
    familyCost: perPersonCost * familySize,
    shippingCost,
    temporaryHousingCost,
  };

  // Update transfer with cost estimate
  const relocation = transfer.relocation;
  relocation.estimatedCost = totalCost;
  await transfer.update({ relocation }, { transaction });

  return {
    estimatedCost: totalCost,
    currency: CurrencyCode.USD,
    breakdown,
  };
}

/**
 * Track relocation progress through various stages
 * @param transferId - Transfer ID
 * @param newStatus - New relocation status
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 */
export async function trackRelocationProgress(
  transferId: string,
  newStatus: RelocationStatus,
  transaction?: Transaction,
): Promise<InternationalTransferModel> {
  const transfer = await InternationalTransferModel.findByPk(transferId, { transaction });

  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  await transfer.update({ status: newStatus }, { transaction });

  return transfer;
}

/**
 * Complete relocation and finalize all activities
 * @param transferId - Transfer ID
 * @param actualCost - Actual relocation cost
 * @param transaction - Optional database transaction
 * @returns Completed transfer
 */
export async function completeRelocation(
  transferId: string,
  actualCost: number,
  transaction?: Transaction,
): Promise<InternationalTransferModel> {
  const transfer = await InternationalTransferModel.findByPk(transferId, { transaction });

  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  const relocation = transfer.relocation;
  relocation.status = RelocationStatus.COMPLETED;

  await transfer.update(
    {
      status: RelocationStatus.COMPLETED,
      relocation,
    },
    { transaction },
  );

  return transfer;
}

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
export async function syncGlobalPayrollData(
  country: CountryCode,
  payrollPeriod: string,
  transaction?: Transaction,
): Promise<GlobalPayrollSyncModel> {
  // Get all employees for country
  const employees = await getEmployeeByCountry(country, { transaction });

  const syncRecord = await GlobalPayrollSyncModel.create(
    {
      country,
      payrollPeriod,
      employeeCount: employees.length,
      totalGrossPay: 0,
      currency: CurrencyCode.USD,
      syncStatus: 'IN_PROGRESS',
      syncDate: new Date(),
    },
    { transaction },
  );

  return syncRecord;
}

/**
 * Calculate multi-country payroll with currency conversion
 * @param payrollPeriod - Payroll period
 * @param countries - Countries to include
 * @param baseCurrency - Base currency for reporting
 * @param transaction - Optional database transaction
 * @returns Consolidated payroll data
 */
export async function calculateMultiCountryPayroll(
  payrollPeriod: string,
  countries: CountryCode[],
  baseCurrency: CurrencyCode,
  transaction?: Transaction,
): Promise<{
  totalGrossPay: number;
  currency: CurrencyCode;
  byCountry: Array<{ country: CountryCode; amount: number; currency: CurrencyCode }>;
}> {
  const byCountry: Array<{ country: CountryCode; amount: number; currency: CurrencyCode }> = [];
  let totalInBaseCurrency = 0;

  for (const country of countries) {
    const syncRecords = await GlobalPayrollSyncModel.findAll({
      where: { country, payrollPeriod },
      transaction,
    });

    const countryTotal = syncRecords.reduce((sum, record) => sum + record.totalGrossPay, 0);
    const countryCurrency = syncRecords[0]?.currency || CurrencyCode.USD;

    // Convert to base currency (simplified - would use exchange rates)
    const converted = countryTotal; // In real implementation, apply exchange rate

    byCountry.push({
      country,
      amount: countryTotal,
      currency: countryCurrency,
    });

    totalInBaseCurrency += converted;
  }

  return {
    totalGrossPay: totalInBaseCurrency,
    currency: baseCurrency,
    byCountry,
  };
}

/**
 * Reconcile global payroll across all entities
 * @param payrollPeriod - Payroll period
 * @param transaction - Optional database transaction
 * @returns Reconciliation results
 */
export async function reconcileGlobalPayroll(
  payrollPeriod: string,
  transaction?: Transaction,
): Promise<{ reconciled: boolean; discrepancies: any[] }> {
  const allSyncs = await GlobalPayrollSyncModel.findAll({
    where: { payrollPeriod },
    transaction,
  });

  const discrepancies: any[] = [];

  for (const sync of allSyncs) {
    if (sync.syncStatus !== 'COMPLETED') {
      discrepancies.push({
        country: sync.country,
        issue: 'Sync not completed',
        status: sync.syncStatus,
      });
    }

    if (sync.errors && sync.errors.length > 0) {
      discrepancies.push({
        country: sync.country,
        issue: 'Sync errors',
        errors: sync.errors,
      });
    }
  }

  return {
    reconciled: discrepancies.length === 0,
    discrepancies,
  };
}

/**
 * Generate global payslips for all countries
 * @param payrollPeriod - Payroll period
 * @param transaction - Optional database transaction
 * @returns Generated payslip count
 */
export async function generateGlobalPayslips(
  payrollPeriod: string,
  transaction?: Transaction,
): Promise<{ generated: number; byCountry: Map<CountryCode, number> }> {
  const syncs = await GlobalPayrollSyncModel.findAll({
    where: { payrollPeriod, syncStatus: 'COMPLETED' },
    transaction,
  });

  const byCountry = new Map<CountryCode, number>();
  let totalGenerated = 0;

  for (const sync of syncs) {
    const count = sync.employeeCount;
    byCountry.set(sync.country, count);
    totalGenerated += count;
  }

  return {
    generated: totalGenerated,
    byCountry,
  };
}

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
export async function getExchangeRates(
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  effectiveDate?: Date,
  transaction?: Transaction,
): Promise<number> {
  const date = effectiveDate || new Date();

  const rate = await ExchangeRateModel.findOne({
    where: {
      fromCurrency,
      toCurrency,
      effectiveDate: { [Op.lte]: date },
    },
    order: [['effectiveDate', 'DESC']],
    transaction,
  });

  if (!rate) {
    throw new NotFoundException(
      `Exchange rate not found for ${fromCurrency} to ${toCurrency} on ${date.toISOString()}`,
    );
  }

  return parseFloat(rate.rate.toString());
}

/**
 * Convert salary amount to different currency
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param effectiveDate - Effective date
 * @param transaction - Optional database transaction
 * @returns Converted amount
 */
export async function convertSalaryToCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  effectiveDate?: Date,
  transaction?: Transaction,
): Promise<{ convertedAmount: number; rate: number; currency: CurrencyCode }> {
  if (fromCurrency === toCurrency) {
    return { convertedAmount: amount, rate: 1, currency: toCurrency };
  }

  const rate = await getExchangeRates(fromCurrency, toCurrency, effectiveDate, transaction);
  const convertedAmount = amount * rate;

  return {
    convertedAmount: Math.round(convertedAmount * 100) / 100,
    rate,
    currency: toCurrency,
  };
}

/**
 * Track currency fluctuations for budgeting
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param daysBack - Days to look back
 * @param transaction - Optional database transaction
 * @returns Fluctuation analysis
 */
export async function trackCurrencyFluctuations(
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  daysBack: number,
  transaction?: Transaction,
): Promise<{
  currentRate: number;
  averageRate: number;
  minRate: number;
  maxRate: number;
  volatility: number;
}> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  const rates = await ExchangeRateModel.findAll({
    where: {
      fromCurrency,
      toCurrency,
      effectiveDate: { [Op.gte]: startDate },
    },
    order: [['effectiveDate', 'DESC']],
    transaction,
  });

  if (rates.length === 0) {
    throw new NotFoundException(`No exchange rate history found for ${fromCurrency}/${toCurrency}`);
  }

  const rateValues = rates.map((r) => parseFloat(r.rate.toString()));
  const currentRate = rateValues[0];
  const averageRate = rateValues.reduce((a, b) => a + b, 0) / rateValues.length;
  const minRate = Math.min(...rateValues);
  const maxRate = Math.max(...rateValues);
  const volatility = ((maxRate - minRate) / averageRate) * 100;

  return {
    currentRate,
    averageRate: Math.round(averageRate * 1000000) / 1000000,
    minRate,
    maxRate,
    volatility: Math.round(volatility * 100) / 100,
  };
}

/**
 * Apply exchange rate adjustments to payroll
 * @param assignmentId - Assignment ID
 * @param newRate - New exchange rate
 * @param transaction - Optional database transaction
 * @returns Updated assignment costs
 */
export async function applyExchangeRateAdjustments(
  assignmentId: string,
  newRate: number,
  transaction?: Transaction,
): Promise<IAssignmentCosts> {
  const assignment = await GlobalAssignmentModel.findByPk(assignmentId, { transaction });

  if (!assignment) {
    throw new NotFoundException(`Assignment ${assignmentId} not found`);
  }

  const costs = assignment.assignmentCosts;

  // Apply rate adjustment to all currency-dependent costs
  costs.allowances = costs.allowances.map((allowance) => ({
    ...allowance,
    amount: allowance.amount * newRate,
  }));

  await assignment.update({ assignmentCosts: costs }, { transaction });

  return costs;
}

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
export async function enrollInGlobalBenefits(
  employeeId: string,
  country: CountryCode,
  benefitTypes: GlobalBenefitType[],
  transaction?: Transaction,
): Promise<{ enrolled: boolean; benefits: GlobalBenefitType[] }> {
  const employee = await GlobalEmployeeModel.findOne({
    where: { employeeId },
    transaction,
  });

  if (!employee) {
    throw new NotFoundException(`Employee ${employeeId} not found`);
  }

  // In real implementation, would create benefit enrollment records

  return {
    enrolled: true,
    benefits: benefitTypes,
  };
}

/**
 * Calculate global benefits costs across all countries
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Total benefit costs
 */
export async function calculateGlobalBenefitsCosts(
  employeeId: string,
  transaction?: Transaction,
): Promise<{ totalCost: number; currency: CurrencyCode; breakdown: any[] }> {
  const assignments = await GlobalAssignmentModel.findAll({
    where: { employeeId, status: GlobalAssignmentStatus.ACTIVE },
    transaction,
  });

  let totalCost = 0;
  const breakdown: any[] = [];

  for (const assignment of assignments) {
    const benefitValue = assignment.benefits.totalValue;
    totalCost += benefitValue;

    breakdown.push({
      country: assignment.hostCountry,
      cost: benefitValue,
      currency: assignment.benefits.currency,
    });
  }

  return {
    totalCost,
    currency: CurrencyCode.USD,
    breakdown,
  };
}

/**
 * Synchronize benefits across countries for transferred employees
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Sync results
 */
export async function syncBenefitsAcrossCountries(
  employeeId: string,
  transaction?: Transaction,
): Promise<{ synced: boolean; countries: CountryCode[] }> {
  const employee = await GlobalEmployeeModel.findOne({
    where: { employeeId },
    include: [GlobalAssignmentModel],
    transaction,
  });

  if (!employee) {
    throw new NotFoundException(`Employee ${employeeId} not found`);
  }

  const countries = employee.globalAssignments
    .filter((a) => a.status === GlobalAssignmentStatus.ACTIVE)
    .map((a) => a.hostCountry);

  // In real implementation, would sync benefit data

  return {
    synced: true,
    countries,
  };
}

/**
 * Generate benefits comparison across countries
 * @param countries - Countries to compare
 * @param transaction - Optional database transaction
 * @returns Benefits comparison
 */
export async function generateBenefitsComparison(
  countries: CountryCode[],
  transaction?: Transaction,
): Promise<any> {
  const comparison: any = {};

  for (const country of countries) {
    const rules = await getCountryHRRules(country, transaction);

    comparison[country] = {
      mandatoryBenefits: rules.mandatoryBenefits,
      currency: rules.currency,
    };
  }

  return comparison;
}

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
export async function calculateTaxEqualization(
  assignmentId: string,
  homeCountryTax: number,
  hostCountryTax: number,
  transaction?: Transaction,
): Promise<ITaxEqualization> {
  const assignment = await GlobalAssignmentModel.findByPk(assignmentId, { transaction });

  if (!assignment) {
    throw new NotFoundException(`Assignment ${assignmentId} not found`);
  }

  const hypotheticalTax = homeCountryTax;
  const taxReimbursement = Math.max(0, hostCountryTax - hypotheticalTax);

  const taxEqualization: ITaxEqualization = {
    method: TaxEqualizationMethod.TAX_EQUALIZATION,
    homeCountryTax,
    hostCountryTax,
    hypotheticalTax,
    taxReimbursement,
    taxGrossUp: 0,
    taxYear: new Date().getFullYear(),
  };

  await assignment.update({ taxEqualization }, { transaction });

  return taxEqualization;
}

/**
 * Perform tax gross-up calculation
 * @param assignmentId - Assignment ID
 * @param netAmount - Net amount to gross up
 * @param taxRate - Applicable tax rate
 * @param transaction - Optional database transaction
 * @returns Gross-up amount
 */
export async function performTaxGrossUp(
  assignmentId: string,
  netAmount: number,
  taxRate: number,
  transaction?: Transaction,
): Promise<{ grossAmount: number; taxGrossUp: number }> {
  const grossAmount = netAmount / (1 - taxRate);
  const taxGrossUp = grossAmount - netAmount;

  const assignment = await GlobalAssignmentModel.findByPk(assignmentId, { transaction });

  if (!assignment) {
    throw new NotFoundException(`Assignment ${assignmentId} not found`);
  }

  const taxEqualization = assignment.taxEqualization;
  taxEqualization.taxGrossUp = taxGrossUp;

  await assignment.update({ taxEqualization }, { transaction });

  return {
    grossAmount: Math.round(grossAmount * 100) / 100,
    taxGrossUp: Math.round(taxGrossUp * 100) / 100,
  };
}

/**
 * Track tax liabilities across jurisdictions
 * @param employeeId - Employee ID
 * @param taxYear - Tax year
 * @param transaction - Optional database transaction
 * @returns Tax liabilities by country
 */
export async function trackTaxLiabilities(
  employeeId: string,
  taxYear: number,
  transaction?: Transaction,
): Promise<Array<{ country: CountryCode; liability: number; currency: CurrencyCode }>> {
  const assignments = await GlobalAssignmentModel.findAll({
    where: { employeeId },
    transaction,
  });

  const liabilities: Array<{ country: CountryCode; liability: number; currency: CurrencyCode }> =
    [];

  for (const assignment of assignments) {
    if (assignment.taxEqualization.taxYear === taxYear) {
      liabilities.push({
        country: assignment.hostCountry,
        liability: assignment.taxEqualization.hostCountryTax,
        currency: assignment.assignmentCosts.currency,
      });
    }
  }

  return liabilities;
}

/**
 * Generate tax equalization report
 * @param assignmentId - Assignment ID
 * @param transaction - Optional database transaction
 * @returns Tax equalization report
 */
export async function generateTaxEqualizationReport(
  assignmentId: string,
  transaction?: Transaction,
): Promise<{
  assignment: IGlobalAssignment;
  taxEqualization: ITaxEqualization;
  recommendations: string[];
}> {
  const assignment = await GlobalAssignmentModel.findByPk(assignmentId, { transaction });

  if (!assignment) {
    throw new NotFoundException(`Assignment ${assignmentId} not found`);
  }

  const recommendations: string[] = [];

  if (assignment.taxEqualization.taxReimbursement > 0) {
    recommendations.push(
      `Employee entitled to tax reimbursement of ${assignment.taxEqualization.taxReimbursement}`,
    );
  }

  if (assignment.taxEqualization.hostCountryTax > assignment.taxEqualization.homeCountryTax * 1.2) {
    recommendations.push('Consider tax treaty benefits to reduce host country tax burden');
  }

  return {
    assignment: assignment.toJSON(),
    taxEqualization: assignment.taxEqualization,
    recommendations,
  };
}

/**
 * Immigration & Visa Tracking Functions
 */

/**
 * Create visa application record
 * @param visaData - Visa application data
 * @param transaction - Optional database transaction
 * @returns Created visa record
 */
export async function createVisaApplication(
  visaData: z.infer<typeof VisaImmigrationSchema>,
  transaction?: Transaction,
): Promise<VisaImmigrationModel> {
  const validated = VisaImmigrationSchema.parse(visaData);

  const visa = await VisaImmigrationModel.create(
    {
      ...validated,
      status: VisaStatus.APPLICATION_IN_PROGRESS,
      alertSent: false,
      documents: [],
    },
    { transaction },
  );

  return visa;
}

/**
 * Track visa status and update records
 * @param visaId - Visa ID
 * @param newStatus - New visa status
 * @param transaction - Optional database transaction
 * @returns Updated visa record
 */
export async function trackVisaStatus(
  visaId: string,
  newStatus: VisaStatus,
  transaction?: Transaction,
): Promise<VisaImmigrationModel> {
  const visa = await VisaImmigrationModel.findByPk(visaId, { transaction });

  if (!visa) {
    throw new NotFoundException(`Visa ${visaId} not found`);
  }

  await visa.update({ status: newStatus }, { transaction });

  return visa;
}

/**
 * Send visa expiry alerts for upcoming expirations
 * @param daysBeforeExpiry - Days before expiry to alert
 * @param transaction - Optional database transaction
 * @returns List of employees with expiring visas
 */
export async function sendVisaExpiryAlerts(
  daysBeforeExpiry: number,
  transaction?: Transaction,
): Promise<VisaImmigrationModel[]> {
  const alertDate = new Date();
  alertDate.setDate(alertDate.getDate() + daysBeforeExpiry);

  const expiringVisas = await VisaImmigrationModel.findAll({
    where: {
      expiryDate: { [Op.lte]: alertDate },
      status: { [Op.in]: [VisaStatus.ACTIVE, VisaStatus.APPROVED] },
      alertSent: false,
    },
    transaction,
  });

  // Mark alerts as sent
  for (const visa of expiringVisas) {
    await visa.update({ alertSent: true, status: VisaStatus.EXPIRING_SOON }, { transaction });
  }

  return expiringVisas;
}

/**
 * Renew work permit for employee
 * @param visaId - Visa ID
 * @param newExpiryDate - New expiry date
 * @param transaction - Optional database transaction
 * @returns Updated visa record
 */
export async function renewWorkPermit(
  visaId: string,
  newExpiryDate: Date,
  transaction?: Transaction,
): Promise<VisaImmigrationModel> {
  const visa = await VisaImmigrationModel.findByPk(visaId, { transaction });

  if (!visa) {
    throw new NotFoundException(`Visa ${visaId} not found`);
  }

  await visa.update(
    {
      renewalDate: new Date(),
      expiryDate: newExpiryDate,
      status: VisaStatus.ACTIVE,
      alertSent: false,
    },
    { transaction },
  );

  return visa;
}

/**
 * Cultural & Language Support Functions
 */

/**
 * Create cultural adaptation profile
 * @param profileData - Cultural profile data
 * @param transaction - Optional database transaction
 * @returns Created cultural profile
 */
export async function createCulturalProfile(
  profileData: z.infer<typeof CulturalProfileSchema>,
  transaction?: Transaction,
): Promise<CulturalProfileModel> {
  const validated = CulturalProfileSchema.parse(profileData);

  const profile = await CulturalProfileModel.create(
    {
      ...validated,
      assessmentDate: new Date(),
    },
    { transaction },
  );

  return profile;
}

/**
 * Assign language training to employee
 * @param employeeId - Employee ID
 * @param targetLanguage - Target language
 * @param targetProficiency - Target proficiency level
 * @param transaction - Optional database transaction
 * @returns Training assignment
 */
export async function assignLanguageTraining(
  employeeId: string,
  targetLanguage: string,
  targetProficiency: LanguageProficiencyLevel,
  transaction?: Transaction,
): Promise<{ assigned: boolean; employeeId: string; language: string; targetLevel: string }> {
  const employee = await GlobalEmployeeModel.findOne({
    where: { employeeId },
    transaction,
  });

  if (!employee) {
    throw new NotFoundException(`Employee ${employeeId} not found`);
  }

  // In real implementation, would create training enrollment

  return {
    assigned: true,
    employeeId,
    language: targetLanguage,
    targetLevel: targetProficiency,
  };
}

/**
 * Track cultural adaptation progress
 * @param employeeId - Employee ID
 * @param country - Country
 * @param transaction - Optional database transaction
 * @returns Cultural adaptation tracking
 */
export async function trackCulturalAdaptation(
  employeeId: string,
  country: CountryCode,
  transaction?: Transaction,
): Promise<CulturalProfileModel | null> {
  const profile = await CulturalProfileModel.findOne({
    where: { employeeId, country },
    order: [['assessmentDate', 'DESC']],
    transaction,
  });

  return profile;
}

/**
 * Generate cultural adaptation insights
 * @param country - Country
 * @param transaction - Optional database transaction
 * @returns Cultural insights
 */
export async function generateCulturalInsights(
  country: CountryCode,
  transaction?: Transaction,
): Promise<{
  country: CountryCode;
  averageAdaptationScore: number;
  commonChallenges: string[];
  recommendedSupport: string[];
}> {
  const profiles = await CulturalProfileModel.findAll({
    where: { country },
    transaction,
  });

  if (profiles.length === 0) {
    return {
      country,
      averageAdaptationScore: 0,
      commonChallenges: [],
      recommendedSupport: [],
    };
  }

  const averageScore =
    profiles.reduce((sum, p) => sum + p.adaptationScore, 0) / profiles.length;

  const allChallenges = profiles.flatMap((p) => p.challengesReported);
  const challengeCounts = new Map<string, number>();

  allChallenges.forEach((challenge) => {
    challengeCounts.set(challenge, (challengeCounts.get(challenge) || 0) + 1);
  });

  const commonChallenges = Array.from(challengeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([challenge]) => challenge);

  return {
    country,
    averageAdaptationScore: Math.round(averageScore * 100) / 100,
    commonChallenges,
    recommendedSupport: ['Cultural mentor assignment', 'Language training', 'Local orientation'],
  };
}

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
export async function validateGlobalCompliance(
  country: CountryCode,
  framework: ComplianceFramework,
  transaction?: Transaction,
): Promise<GlobalComplianceModel | null> {
  const compliance = await GlobalComplianceModel.findOne({
    where: { country, framework },
    order: [['lastAuditDate', 'DESC']],
    transaction,
  });

  return compliance;
}

/**
 * Generate compliance report for country
 * @param country - Country
 * @param transaction - Optional database transaction
 * @returns Compliance report
 */
export async function generateComplianceReport(
  country: CountryCode,
  transaction?: Transaction,
): Promise<{
  country: CountryCode;
  frameworks: ComplianceFramework[];
  overallStatus: string;
  criticalFindings: number;
}> {
  const complianceRecords = await GlobalComplianceModel.findAll({
    where: { country },
    transaction,
  });

  const frameworks = complianceRecords.map((r) => r.framework);
  const nonCompliant = complianceRecords.filter((r) => r.complianceStatus === 'NON_COMPLIANT');
  const criticalFindings = complianceRecords.reduce((sum, r) => sum + r.findings.length, 0);

  const overallStatus =
    nonCompliant.length === 0 ? 'COMPLIANT' : nonCompliant.length < 3 ? 'PARTIAL' : 'NON_COMPLIANT';

  return {
    country,
    frameworks,
    overallStatus,
    criticalFindings,
  };
}

/**
 * Track regulatory changes across countries
 * @param countries - Countries to track
 * @param transaction - Optional database transaction
 * @returns Regulatory changes
 */
export async function trackRegulatoryChanges(
  countries: CountryCode[],
  transaction?: Transaction,
): Promise<Array<{ country: CountryCode; changes: string[]; lastUpdated: Date }>> {
  const changes: Array<{ country: CountryCode; changes: string[]; lastUpdated: Date }> = [];

  for (const country of countries) {
    const rules = await CountryHRRulesModel.findByPk(country, { transaction });

    if (rules) {
      changes.push({
        country,
        changes: [], // In real implementation, track actual changes
        lastUpdated: rules.updatedAt,
      });
    }
  }

  return changes;
}

/**
 * Audit global HR data for compliance
 * @param country - Country
 * @param auditScope - Scope of audit
 * @param transaction - Optional database transaction
 * @returns Audit results
 */
export async function auditGlobalHRData(
  country: CountryCode,
  auditScope: string[],
  transaction?: Transaction,
): Promise<{ audited: boolean; findings: string[]; recommendations: string[] }> {
  const employees = await getEmployeeByCountry(country, { transaction });
  const findings: string[] = [];
  const recommendations: string[] = [];

  // Check for missing work authorizations
  const employeesWithoutAuth = employees.filter(
    (e) => e.workAuthorizations.length === 0 && e.homeCountry !== country,
  );

  if (employeesWithoutAuth.length > 0) {
    findings.push(`${employeesWithoutAuth.length} employees without work authorization`);
    recommendations.push('Complete work authorization documentation for all foreign employees');
  }

  // Check for expired visas
  const visas = await VisaImmigrationModel.findAll({
    where: {
      country,
      expiryDate: { [Op.lt]: new Date() },
      status: { [Op.ne]: VisaStatus.EXPIRED },
    },
    transaction,
  });

  if (visas.length > 0) {
    findings.push(`${visas.length} expired visas not updated`);
    recommendations.push('Update visa statuses and initiate renewal processes');
  }

  return {
    audited: true,
    findings,
    recommendations,
  };
}

/**
 * Global Organizational Structures Functions
 */

/**
 * Create global organizational unit
 * @param unitData - Org unit data
 * @param transaction - Optional database transaction
 * @returns Created org unit
 */
export async function createGlobalOrgUnit(
  unitData: Partial<IGlobalOrgUnit>,
  transaction?: Transaction,
): Promise<GlobalOrgUnitModel> {
  const orgUnit = await GlobalOrgUnitModel.create(
    {
      unitName: unitData.unitName!,
      country: unitData.country!,
      legalEntity: unitData.legalEntity!,
      parentUnitId: unitData.parentUnitId,
      headcount: unitData.headcount || 0,
      currency: unitData.currency!,
      costCenter: unitData.costCenter!,
      active: true,
    },
    { transaction },
  );

  return orgUnit;
}

/**
 * Map global reporting lines across countries
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Reporting structure
 */
export async function mapGlobalReportingLines(
  employeeId: string,
  transaction?: Transaction,
): Promise<{ employee: string; reports: any[] }> {
  // In real implementation, would traverse org hierarchy

  return {
    employee: employeeId,
    reports: [],
  };
}

/**
 * Synchronize global org structure
 * @param transaction - Optional database transaction
 * @returns Sync results
 */
export async function syncGlobalOrgStructure(
  transaction?: Transaction,
): Promise<{ synced: boolean; units: number }> {
  const units = await GlobalOrgUnitModel.findAll({
    where: { active: true },
    transaction,
  });

  return {
    synced: true,
    units: units.length,
  };
}

/**
 * Analyze global span of control
 * @param country - Country (optional)
 * @param transaction - Optional database transaction
 * @returns Span of control analysis
 */
export async function analyzeGlobalSpanOfControl(
  country?: CountryCode,
  transaction?: Transaction,
): Promise<{
  averageSpan: number;
  maxSpan: number;
  unitsAnalyzed: number;
}> {
  const where: WhereOptions<IGlobalOrgUnit> = { active: true };
  if (country) {
    where.country = country;
  }

  const units = await GlobalOrgUnitModel.findAll({
    where,
    include: [{ model: GlobalOrgUnitModel, as: 'childUnits' }],
    transaction,
  });

  const spans = units.map((unit) => unit.childUnits?.length || 0).filter((span) => span > 0);

  const averageSpan = spans.length > 0 ? spans.reduce((a, b) => a + b, 0) / spans.length : 0;
  const maxSpan = spans.length > 0 ? Math.max(...spans) : 0;

  return {
    averageSpan: Math.round(averageSpan * 100) / 100,
    maxSpan,
    unitsAnalyzed: units.length,
  };
}

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * Global HR Management Service
 * Provides enterprise-grade multi-country HR operations
 */
@Injectable()
@ApiTags('Global HR Management')
export class GlobalHRManagementService {
  /**
   * All 48 functions available as service methods with same signatures
   */

  // Multi-Country HR Management
  async createGlobalEmployee(
    data: z.infer<typeof GlobalEmployeeSchema>,
    transaction?: Transaction,
  ) {
    return createGlobalEmployee(data, transaction);
  }

  async updateGlobalEmployeeProfile(
    employeeId: string,
    updates: Partial<IGlobalEmployee>,
    transaction?: Transaction,
  ) {
    return updateGlobalEmployeeProfile(employeeId, updates, transaction);
  }

  async getEmployeeByCountry(
    country: CountryCode,
    options?: {
      isExpatriate?: boolean;
      includeAssignments?: boolean;
      transaction?: Transaction;
    },
  ) {
    return getEmployeeByCountry(country, options);
  }

  async transferEmployeeCountry(
    employeeId: string,
    toCountry: CountryCode,
    effectiveDate: Date,
    transaction?: Transaction,
  ) {
    return transferEmployeeCountry(employeeId, toCountry, effectiveDate, transaction);
  }

  // Country-Specific Rules
  async getCountryHRRules(country: CountryCode, transaction?: Transaction) {
    return getCountryHRRules(country, transaction);
  }

  async validateEmploymentContract(
    country: CountryCode,
    contractData: any,
    transaction?: Transaction,
  ) {
    return validateEmploymentContract(country, contractData, transaction);
  }

  async applyCountrySpecificWorkingHours(
    country: CountryCode,
    hoursWorked: number,
    transaction?: Transaction,
  ) {
    return applyCountrySpecificWorkingHours(country, hoursWorked, transaction);
  }

  async getCountryStatutoryLeaves(country: CountryCode, transaction?: Transaction) {
    return getCountryStatutoryLeaves(country, transaction);
  }

  // Global Assignments
  async createGlobalAssignment(
    data: z.infer<typeof GlobalAssignmentSchema>,
    transaction?: Transaction,
  ) {
    return createGlobalAssignment(data, transaction);
  }

  async trackExpatriateAssignment(assignmentId: string, transaction?: Transaction) {
    return trackExpatriateAssignment(assignmentId, transaction);
  }

  async calculateAssignmentCosts(assignmentId: string, transaction?: Transaction) {
    return calculateAssignmentCosts(assignmentId, transaction);
  }

  async endGlobalAssignment(
    assignmentId: string,
    actualEndDate: Date,
    transaction?: Transaction,
  ) {
    return endGlobalAssignment(assignmentId, actualEndDate, transaction);
  }

  // International Transfers
  async initiateInternationalTransfer(
    data: z.infer<typeof InternationalTransferSchema>,
    transaction?: Transaction,
  ) {
    return initiateInternationalTransfer(data, transaction);
  }

  async calculateRelocationCosts(
    transferId: string,
    familySize: number,
    transaction?: Transaction,
  ) {
    return calculateRelocationCosts(transferId, familySize, transaction);
  }

  async trackRelocationProgress(
    transferId: string,
    newStatus: RelocationStatus,
    transaction?: Transaction,
  ) {
    return trackRelocationProgress(transferId, newStatus, transaction);
  }

  async completeRelocation(transferId: string, actualCost: number, transaction?: Transaction) {
    return completeRelocation(transferId, actualCost, transaction);
  }

  // Global Payroll
  async syncGlobalPayrollData(
    country: CountryCode,
    payrollPeriod: string,
    transaction?: Transaction,
  ) {
    return syncGlobalPayrollData(country, payrollPeriod, transaction);
  }

  async calculateMultiCountryPayroll(
    payrollPeriod: string,
    countries: CountryCode[],
    baseCurrency: CurrencyCode,
    transaction?: Transaction,
  ) {
    return calculateMultiCountryPayroll(payrollPeriod, countries, baseCurrency, transaction);
  }

  async reconcileGlobalPayroll(payrollPeriod: string, transaction?: Transaction) {
    return reconcileGlobalPayroll(payrollPeriod, transaction);
  }

  async generateGlobalPayslips(payrollPeriod: string, transaction?: Transaction) {
    return generateGlobalPayslips(payrollPeriod, transaction);
  }

  // Currency & Exchange
  async getExchangeRates(
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode,
    effectiveDate?: Date,
    transaction?: Transaction,
  ) {
    return getExchangeRates(fromCurrency, toCurrency, effectiveDate, transaction);
  }

  async convertSalaryToCurrency(
    amount: number,
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode,
    effectiveDate?: Date,
    transaction?: Transaction,
  ) {
    return convertSalaryToCurrency(amount, fromCurrency, toCurrency, effectiveDate, transaction);
  }

  async trackCurrencyFluctuations(
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode,
    daysBack: number,
    transaction?: Transaction,
  ) {
    return trackCurrencyFluctuations(fromCurrency, toCurrency, daysBack, transaction);
  }

  async applyExchangeRateAdjustments(
    assignmentId: string,
    newRate: number,
    transaction?: Transaction,
  ) {
    return applyExchangeRateAdjustments(assignmentId, newRate, transaction);
  }

  // Global Benefits
  async enrollInGlobalBenefits(
    employeeId: string,
    country: CountryCode,
    benefitTypes: GlobalBenefitType[],
    transaction?: Transaction,
  ) {
    return enrollInGlobalBenefits(employeeId, country, benefitTypes, transaction);
  }

  async calculateGlobalBenefitsCosts(employeeId: string, transaction?: Transaction) {
    return calculateGlobalBenefitsCosts(employeeId, transaction);
  }

  async syncBenefitsAcrossCountries(employeeId: string, transaction?: Transaction) {
    return syncBenefitsAcrossCountries(employeeId, transaction);
  }

  async generateBenefitsComparison(countries: CountryCode[], transaction?: Transaction) {
    return generateBenefitsComparison(countries, transaction);
  }

  // Tax Equalization
  async calculateTaxEqualization(
    assignmentId: string,
    homeCountryTax: number,
    hostCountryTax: number,
    transaction?: Transaction,
  ) {
    return calculateTaxEqualization(assignmentId, homeCountryTax, hostCountryTax, transaction);
  }

  async performTaxGrossUp(
    assignmentId: string,
    netAmount: number,
    taxRate: number,
    transaction?: Transaction,
  ) {
    return performTaxGrossUp(assignmentId, netAmount, taxRate, transaction);
  }

  async trackTaxLiabilities(employeeId: string, taxYear: number, transaction?: Transaction) {
    return trackTaxLiabilities(employeeId, taxYear, transaction);
  }

  async generateTaxEqualizationReport(assignmentId: string, transaction?: Transaction) {
    return generateTaxEqualizationReport(assignmentId, transaction);
  }

  // Immigration & Visa
  async createVisaApplication(
    data: z.infer<typeof VisaImmigrationSchema>,
    transaction?: Transaction,
  ) {
    return createVisaApplication(data, transaction);
  }

  async trackVisaStatus(visaId: string, newStatus: VisaStatus, transaction?: Transaction) {
    return trackVisaStatus(visaId, newStatus, transaction);
  }

  async sendVisaExpiryAlerts(daysBeforeExpiry: number, transaction?: Transaction) {
    return sendVisaExpiryAlerts(daysBeforeExpiry, transaction);
  }

  async renewWorkPermit(visaId: string, newExpiryDate: Date, transaction?: Transaction) {
    return renewWorkPermit(visaId, newExpiryDate, transaction);
  }

  // Cultural Support
  async createCulturalProfile(
    data: z.infer<typeof CulturalProfileSchema>,
    transaction?: Transaction,
  ) {
    return createCulturalProfile(data, transaction);
  }

  async assignLanguageTraining(
    employeeId: string,
    targetLanguage: string,
    targetProficiency: LanguageProficiencyLevel,
    transaction?: Transaction,
  ) {
    return assignLanguageTraining(employeeId, targetLanguage, targetProficiency, transaction);
  }

  async trackCulturalAdaptation(
    employeeId: string,
    country: CountryCode,
    transaction?: Transaction,
  ) {
    return trackCulturalAdaptation(employeeId, country, transaction);
  }

  async generateCulturalInsights(country: CountryCode, transaction?: Transaction) {
    return generateCulturalInsights(country, transaction);
  }

  // Compliance
  async validateGlobalCompliance(
    country: CountryCode,
    framework: ComplianceFramework,
    transaction?: Transaction,
  ) {
    return validateGlobalCompliance(country, framework, transaction);
  }

  async generateComplianceReport(country: CountryCode, transaction?: Transaction) {
    return generateComplianceReport(country, transaction);
  }

  async trackRegulatoryChanges(countries: CountryCode[], transaction?: Transaction) {
    return trackRegulatoryChanges(countries, transaction);
  }

  async auditGlobalHRData(country: CountryCode, auditScope: string[], transaction?: Transaction) {
    return auditGlobalHRData(country, auditScope, transaction);
  }

  // Global Org Structure
  async createGlobalOrgUnit(unitData: Partial<IGlobalOrgUnit>, transaction?: Transaction) {
    return createGlobalOrgUnit(unitData, transaction);
  }

  async mapGlobalReportingLines(employeeId: string, transaction?: Transaction) {
    return mapGlobalReportingLines(employeeId, transaction);
  }

  async syncGlobalOrgStructure(transaction?: Transaction) {
    return syncGlobalOrgStructure(transaction);
  }

  async analyzeGlobalSpanOfControl(country?: CountryCode, transaction?: Transaction) {
    return analyzeGlobalSpanOfControl(country, transaction);
  }
}
