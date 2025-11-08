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

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiProduces,
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
import * as bcrypt from 'bcrypt';
import { Op, Transaction, FindOptions, WhereOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Employee status enumeration
 */
export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated',
  RETIRED = 'retired',
  DECEASED = 'deceased',
}

/**
 * Employment type enumeration
 */
export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  TEMPORARY = 'temporary',
  INTERN = 'intern',
  CONSULTANT = 'consultant',
}

/**
 * Gender enumeration
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
  OTHER = 'other',
}

/**
 * Marital status enumeration
 */
export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
  DOMESTIC_PARTNERSHIP = 'domestic_partnership',
}

/**
 * Document type enumeration
 */
export enum DocumentType {
  RESUME = 'resume',
  CONTRACT = 'contract',
  ID_PROOF = 'id_proof',
  EDUCATION = 'education',
  CERTIFICATION = 'certification',
  PERFORMANCE_REVIEW = 'performance_review',
  DISCIPLINARY = 'disciplinary',
  MEDICAL = 'medical',
  OTHER = 'other',
}

/**
 * Emergency contact relationship
 */
export enum EmergencyRelationship {
  SPOUSE = 'spouse',
  PARENT = 'parent',
  CHILD = 'child',
  SIBLING = 'sibling',
  FRIEND = 'friend',
  RELATIVE = 'relative',
  OTHER = 'other',
}

/**
 * Employee classification
 */
export enum EmployeeClassification {
  EXECUTIVE = 'executive',
  MANAGEMENT = 'management',
  PROFESSIONAL = 'professional',
  TECHNICAL = 'technical',
  ADMINISTRATIVE = 'administrative',
  SUPPORT = 'support',
  OPERATIONS = 'operations',
}

/**
 * Leave type enumeration
 */
export enum LeaveType {
  ANNUAL = 'annual',
  SICK = 'sick',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  PARENTAL = 'parental',
  BEREAVEMENT = 'bereavement',
  SABBATICAL = 'sabbatical',
  UNPAID = 'unpaid',
  MEDICAL = 'medical',
  DISABILITY = 'disability',
}

/**
 * Data privacy consent type
 */
export enum ConsentType {
  DATA_PROCESSING = 'data_processing',
  MARKETING = 'marketing',
  THIRD_PARTY_SHARING = 'third_party_sharing',
  PHOTO_USAGE = 'photo_usage',
  EMERGENCY_CONTACT = 'emergency_contact',
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

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Address validation schema
 */
export const AddressSchema = z.object({
  street1: z.string().min(1).max(255),
  street2: z.string().max(255).optional(),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(2).max(2), // ISO 2-letter country code
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
});

/**
 * Emergency contact validation schema
 */
export const EmergencyContactSchema = z.object({
  name: z.string().min(1).max(255),
  relationship: z.nativeEnum(EmergencyRelationship),
  phoneNumber: z.string().min(1).max(20),
  alternatePhone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  address: AddressSchema.optional(),
  isPrimary: z.boolean().default(false),
  notes: z.string().max(1000).optional(),
});

/**
 * Dependent validation schema
 */
export const DependentSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.coerce.date(),
  relationship: z.string().min(1).max(50),
  gender: z.nativeEnum(Gender).optional(),
  nationalId: z.string().max(50).optional(),
  isStudent: z.boolean().optional(),
  isDisabled: z.boolean().optional(),
  coverageStartDate: z.coerce.date().optional(),
  coverageEndDate: z.coerce.date().optional(),
});

/**
 * GDPR consent validation schema
 */
export const GDPRConsentSchema = z.object({
  consentType: z.nativeEnum(ConsentType),
  granted: z.boolean(),
  grantedAt: z.coerce.date().optional(),
  revokedAt: z.coerce.date().optional(),
  version: z.string().min(1),
  ipAddress: z.string().ip().optional(),
  notes: z.string().max(500).optional(),
});

/**
 * Employee profile validation schema
 */
export const EmployeeProfileSchema = z.object({
  employeeNumber: z.string().min(1).max(50),
  firstName: z.string().min(1).max(100),
  middleName: z.string().max(100).optional(),
  lastName: z.string().min(1).max(100),
  preferredName: z.string().max(100).optional(),
  email: z.string().email(),
  personalEmail: z.string().email().optional(),
  phoneNumber: z.string().max(20).optional(),
  mobileNumber: z.string().max(20).optional(),
  dateOfBirth: z.coerce.date(),
  gender: z.nativeEnum(Gender),
  maritalStatus: z.nativeEnum(MaritalStatus).optional(),
  nationality: z.string().min(2).max(2).optional(),
  nationalId: z.string().max(50).optional(),
  passportNumber: z.string().max(50).optional(),
  taxId: z.string().max(50).optional(),
  socialSecurityNumber: z.string().max(50).optional(),
  photoUrl: z.string().url().optional(),
  status: z.nativeEnum(EmployeeStatus),
  employmentType: z.nativeEnum(EmploymentType),
  classification: z.nativeEnum(EmployeeClassification),
  hireDate: z.coerce.date(),
  terminationDate: z.coerce.date().optional(),
  probationEndDate: z.coerce.date().optional(),
  departmentId: z.string().uuid().optional(),
  positionId: z.string().uuid().optional(),
  managerId: z.string().uuid().optional(),
  workLocation: z.string().max(255).optional(),
  homeAddress: AddressSchema.optional(),
  languagePreference: z.string().max(10).optional(),
  currency: z.string().length(3).optional(),
  timezone: z.string().max(50).optional(),
}).refine(
  (data) => {
    if (data.terminationDate && data.hireDate) {
      return data.terminationDate >= data.hireDate;
    }
    return true;
  },
  { message: 'Termination date must be after hire date' }
);

/**
 * Compensation validation schema
 */
export const CompensationSchema = z.object({
  baseSalary: z.number().positive(),
  currency: z.string().length(3),
  payFrequency: z.enum(['hourly', 'daily', 'weekly', 'biweekly', 'monthly', 'annual']),
  effectiveDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  bonusEligible: z.boolean().default(false),
  commissionEligible: z.boolean().default(false),
  grade: z.string().max(10).optional(),
  step: z.string().max(10).optional(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Employee Model - Core employee master data
 */
@Table({
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
})
export class EmployeeModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Unique
  @Length({ min: 1, max: 50 })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'employee_number',
    comment: 'Unique employee identifier',
  })
  employeeNumber: string;

  @Length({ min: 1, max: 100 })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'first_name',
    comment: 'Employee first name',
  })
  firstName: string;

  @Length({ max: 100 })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'middle_name',
    comment: 'Employee middle name',
  })
  middleName: string;

  @Length({ min: 1, max: 100 })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'last_name',
    comment: 'Employee last name',
  })
  lastName: string;

  @Length({ max: 100 })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'preferred_name',
    comment: 'Preferred name or nickname',
  })
  preferredName: string;

  @Unique
  @IsEmail
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Work email address',
  })
  email: string;

  @IsEmail
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'personal_email',
    comment: 'Personal email address',
  })
  personalEmail: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'phone_number',
    comment: 'Work phone number',
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'mobile_number',
    comment: 'Mobile phone number',
  })
  mobileNumber: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'date_of_birth',
    comment: 'Date of birth',
  })
  dateOfBirth: Date;

  @Column({
    type: DataType.ENUM(...Object.values(Gender)),
    allowNull: false,
    comment: 'Gender',
  })
  gender: Gender;

  @Column({
    type: DataType.ENUM(...Object.values(MaritalStatus)),
    allowNull: true,
    field: 'marital_status',
    comment: 'Marital status',
  })
  maritalStatus: MaritalStatus;

  @Column({
    type: DataType.STRING(2),
    allowNull: true,
    comment: 'Nationality (ISO 2-letter code)',
  })
  nationality: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'national_id',
    comment: 'National ID number',
  })
  nationalId: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'passport_number',
    comment: 'Passport number',
  })
  passportNumber: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'tax_id',
    comment: 'Tax identification number',
  })
  taxId: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'social_security_number',
    comment: 'Social security number (encrypted)',
  })
  socialSecurityNumber: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'photo_url',
    comment: 'Profile photo URL',
  })
  photoUrl: string;

  @Column({
    type: DataType.ENUM(...Object.values(EmployeeStatus)),
    allowNull: false,
    defaultValue: EmployeeStatus.ACTIVE,
    comment: 'Current employment status',
  })
  status: EmployeeStatus;

  @Column({
    type: DataType.ENUM(...Object.values(EmploymentType)),
    allowNull: false,
    field: 'employment_type',
    comment: 'Type of employment',
  })
  employmentType: EmploymentType;

  @Column({
    type: DataType.ENUM(...Object.values(EmployeeClassification)),
    allowNull: false,
    comment: 'Employee classification',
  })
  classification: EmployeeClassification;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'hire_date',
    comment: 'Date of hire',
  })
  hireDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'termination_date',
    comment: 'Date of termination',
  })
  terminationDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'probation_end_date',
    comment: 'End date of probation period',
  })
  probationEndDate: Date;

  @ForeignKey(() => EmployeeModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'manager_id',
    comment: 'Manager employee ID',
  })
  managerId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'department_id',
    comment: 'Department ID',
  })
  departmentId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'position_id',
    comment: 'Position/Job title ID',
  })
  positionId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'work_location',
    comment: 'Primary work location',
  })
  workLocation: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'home_address',
    comment: 'Home address',
  })
  homeAddress: Address;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: 'en',
    field: 'language_preference',
    comment: 'Preferred language (ISO code)',
  })
  languagePreference: string;

  @Column({
    type: DataType.STRING(3),
    allowNull: true,
    defaultValue: 'USD',
    comment: 'Preferred currency (ISO code)',
  })
  currency: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    defaultValue: 'UTC',
    comment: 'Timezone preference',
  })
  timezone: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Additional metadata',
  })
  metadata: Record<string, any>;

  @BelongsTo(() => EmployeeModel, 'manager_id')
  manager: EmployeeModel;

  @HasMany(() => EmergencyContactModel)
  emergencyContacts: EmergencyContactModel[];

  @HasMany(() => DependentModel)
  dependents: DependentModel[];

  @HasMany(() => EmployeeDocumentModel)
  documents: EmployeeDocumentModel[];

  @HasMany(() => GDPRConsentModel)
  gdprConsents: GDPRConsentModel[];

  @HasMany(() => EmployeeAuditLogModel)
  auditLogs: EmployeeAuditLogModel[];

  @HasMany(() => CompensationHistoryModel)
  compensationHistory: CompensationHistoryModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @BeforeCreate
  static async hashSensitiveData(instance: EmployeeModel) {
    if (instance.socialSecurityNumber) {
      instance.socialSecurityNumber = await bcrypt.hash(instance.socialSecurityNumber, 10);
    }
  }

  @BeforeUpdate
  static async hashSensitiveDataOnUpdate(instance: EmployeeModel) {
    if (instance.changed('socialSecurityNumber') && instance.socialSecurityNumber) {
      instance.socialSecurityNumber = await bcrypt.hash(instance.socialSecurityNumber, 10);
    }
  }
}

/**
 * Emergency Contact Model
 */
@Table({
  tableName: 'employee_emergency_contacts',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['is_primary'] },
  ],
})
export class EmergencyContactModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => EmployeeModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Contact name',
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(EmergencyRelationship)),
    allowNull: false,
    comment: 'Relationship to employee',
  })
  relationship: EmergencyRelationship;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    field: 'phone_number',
    comment: 'Primary phone number',
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'alternate_phone',
    comment: 'Alternate phone number',
  })
  alternatePhone: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Email address',
  })
  email: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Contact address',
  })
  address: Address;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_primary',
    comment: 'Primary emergency contact',
  })
  isPrimary: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Additional notes',
  })
  notes: string;

  @BelongsTo(() => EmployeeModel)
  employee: EmployeeModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Dependent Model
 */
@Table({
  tableName: 'employee_dependents',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['date_of_birth'] },
  ],
})
export class DependentModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => EmployeeModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'first_name',
  })
  firstName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'last_name',
  })
  lastName: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'date_of_birth',
  })
  dateOfBirth: Date;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'Relationship to employee',
  })
  relationship: string;

  @Column({
    type: DataType.ENUM(...Object.values(Gender)),
    allowNull: true,
  })
  gender: Gender;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'national_id',
  })
  nationalId: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'is_student',
  })
  isStudent: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'is_disabled',
  })
  isDisabled: boolean;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'coverage_start_date',
  })
  coverageStartDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'coverage_end_date',
  })
  coverageEndDate: Date;

  @BelongsTo(() => EmployeeModel)
  employee: EmployeeModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Employee Document Model
 */
@Table({
  tableName: 'employee_documents',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['document_type'] },
    { fields: ['expiry_date'] },
    { fields: ['is_confidential'] },
  ],
})
export class EmployeeDocumentModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => EmployeeModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.ENUM(...Object.values(DocumentType)),
    allowNull: false,
    field: 'document_type',
  })
  documentType: DocumentType;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'file_name',
  })
  fileName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'file_path',
  })
  filePath: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'file_size',
    comment: 'File size in bytes',
  })
  fileSize: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'mime_type',
  })
  mimeType: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'uploaded_by',
  })
  uploadedBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'uploaded_at',
  })
  uploadedAt: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'expiry_date',
  })
  expiryDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_confidential',
  })
  isConfidential: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @BelongsTo(() => EmployeeModel)
  employee: EmployeeModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * GDPR Consent Model
 */
@Table({
  tableName: 'employee_gdpr_consents',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['consent_type'] },
    { fields: ['granted'] },
  ],
})
export class GDPRConsentModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => EmployeeModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.ENUM(...Object.values(ConsentType)),
    allowNull: false,
    field: 'consent_type',
  })
  consentType: ConsentType;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  granted: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'granted_at',
  })
  grantedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'revoked_at',
  })
  revokedAt: Date;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    comment: 'Consent policy version',
  })
  version: string;

  @Column({
    type: DataType.INET,
    allowNull: true,
    field: 'ip_address',
  })
  ipAddress: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @BelongsTo(() => EmployeeModel)
  employee: EmployeeModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Employee Audit Log Model
 */
@Table({
  tableName: 'employee_audit_logs',
  timestamps: false,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['action'] },
    { fields: ['performed_by'] },
    { fields: ['performed_at'] },
  ],
})
export class EmployeeAuditLogModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => EmployeeModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: 'Action performed',
  })
  action: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: 'Field that was changed',
  })
  field: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'old_value',
  })
  oldValue: any;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'new_value',
  })
  newValue: any;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'performed_by',
  })
  performedBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'performed_at',
  })
  performedAt: Date;

  @Column({
    type: DataType.INET,
    allowNull: true,
    field: 'ip_address',
  })
  ipAddress: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'user_agent',
  })
  userAgent: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reason: string;

  @BelongsTo(() => EmployeeModel)
  employee: EmployeeModel;
}

/**
 * Compensation History Model
 */
@Table({
  tableName: 'compensation_history',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['effective_date'] },
    { fields: ['end_date'] },
  ],
})
export class CompensationHistoryModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => EmployeeModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    field: 'base_salary',
  })
  baseSalary: number;

  @Column({
    type: DataType.STRING(3),
    allowNull: false,
  })
  currency: string;

  @Column({
    type: DataType.ENUM('hourly', 'daily', 'weekly', 'biweekly', 'monthly', 'annual'),
    allowNull: false,
    field: 'pay_frequency',
  })
  payFrequency: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'effective_date',
  })
  effectiveDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'end_date',
  })
  endDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'bonus_eligible',
  })
  bonusEligible: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'commission_eligible',
  })
  commissionEligible: boolean;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  grade: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  step: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @BelongsTo(() => EmployeeModel)
  employee: EmployeeModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

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
export async function createEmployee(
  profileData: Partial<EmployeeProfile>,
  transaction?: Transaction,
): Promise<EmployeeModel> {
  // Validate input
  const validated = EmployeeProfileSchema.parse(profileData);

  // Check for duplicate employee number
  const existing = await EmployeeModel.findOne({
    where: { employeeNumber: validated.employeeNumber },
    transaction,
  });

  if (existing) {
    throw new ConflictException(`Employee number ${validated.employeeNumber} already exists`);
  }

  // Check for duplicate email
  const existingEmail = await EmployeeModel.findOne({
    where: { email: validated.email },
    transaction,
  });

  if (existingEmail) {
    throw new ConflictException(`Email ${validated.email} already exists`);
  }

  // Create employee
  const employee = await EmployeeModel.create(validated as any, { transaction });

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
export async function updateEmployee(
  employeeId: string,
  updates: Partial<EmployeeProfile>,
  performedBy: string,
  transaction?: Transaction,
): Promise<EmployeeModel> {
  const employee = await EmployeeModel.findByPk(employeeId, { transaction });

  if (!employee) {
    throw new NotFoundException(`Employee ${employeeId} not found`);
  }

  // Track changes for audit
  const changes: Array<{ field: string; oldValue: any; newValue: any }> = [];

  Object.keys(updates).forEach((key) => {
    if ((employee as any)[key] !== (updates as any)[key]) {
      changes.push({
        field: key,
        oldValue: (employee as any)[key],
        newValue: (updates as any)[key],
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
export async function getEmployeeById(
  employeeId: string,
  includeRelations: boolean = false,
): Promise<EmployeeModel | null> {
  const options: FindOptions = {
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
export async function getEmployeeByNumber(employeeNumber: string): Promise<EmployeeModel | null> {
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
export async function getEmployeeByEmail(email: string): Promise<EmployeeModel | null> {
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
export async function deleteEmployee(
  employeeId: string,
  performedBy: string,
  reason: string,
  transaction?: Transaction,
): Promise<void> {
  const employee = await EmployeeModel.findByPk(employeeId, { transaction });

  if (!employee) {
    throw new NotFoundException(`Employee ${employeeId} not found`);
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
export async function searchEmployees(
  filters: EmployeeSearchFilters,
  page: number = 1,
  limit: number = 20,
): Promise<{ employees: EmployeeModel[]; total: number; pages: number }> {
  const where: WhereOptions = {};

  if (filters.status && filters.status.length > 0) {
    where.status = { [Op.in]: filters.status };
  }

  if (filters.employmentType && filters.employmentType.length > 0) {
    where.employmentType = { [Op.in]: filters.employmentType };
  }

  if (filters.classification && filters.classification.length > 0) {
    where.classification = { [Op.in]: filters.classification };
  }

  if (filters.departmentId && filters.departmentId.length > 0) {
    where.departmentId = { [Op.in]: filters.departmentId };
  }

  if (filters.managerId && filters.managerId.length > 0) {
    where.managerId = { [Op.in]: filters.managerId };
  }

  if (filters.hiredAfter) {
    where.hireDate = { [Op.gte]: filters.hiredAfter };
  }

  if (filters.hiredBefore) {
    where.hireDate = { ...where.hireDate, [Op.lte]: filters.hiredBefore };
  }

  if (filters.location) {
    where.workLocation = { [Op.iLike]: `%${filters.location}%` };
  }

  if (filters.hasPhoto !== undefined) {
    if (filters.hasPhoto) {
      where.photoUrl = { [Op.ne]: null };
    } else {
      where.photoUrl = { [Op.is]: null };
    }
  }

  if (filters.onProbation) {
    where.probationEndDate = { [Op.gte]: new Date() };
  }

  if (filters.searchTerm) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${filters.searchTerm}%` } },
      { lastName: { [Op.iLike]: `%${filters.searchTerm}%` } },
      { email: { [Op.iLike]: `%${filters.searchTerm}%` } },
      { employeeNumber: { [Op.iLike]: `%${filters.searchTerm}%` } },
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
export async function updateEmployeeStatus(
  employeeId: string,
  newStatus: EmployeeStatus,
  performedBy: string,
  reason?: string,
  effectiveDate?: Date,
  transaction?: Transaction,
): Promise<void> {
  const employee = await EmployeeModel.findByPk(employeeId, { transaction });

  if (!employee) {
    throw new NotFoundException(`Employee ${employeeId} not found`);
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
export async function terminateEmployee(
  employeeId: string,
  terminationDate: Date,
  performedBy: string,
  reason: string,
  transaction?: Transaction,
): Promise<void> {
  const employee = await EmployeeModel.findByPk(employeeId, { transaction });

  if (!employee) {
    throw new NotFoundException(`Employee ${employeeId} not found`);
  }

  if (employee.status === EmployeeStatus.TERMINATED) {
    throw new BadRequestException('Employee is already terminated');
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
export async function reactivateEmployee(
  employeeId: string,
  performedBy: string,
  reason: string,
  transaction?: Transaction,
): Promise<void> {
  const employee = await EmployeeModel.findByPk(employeeId, { transaction });

  if (!employee) {
    throw new NotFoundException(`Employee ${employeeId} not found`);
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
export async function isEmployeeActive(employeeId: string): Promise<boolean> {
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
export async function getEmployeesByStatus(
  status: EmployeeStatus,
  limit?: number,
): Promise<EmployeeModel[]> {
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
export async function addEmergencyContact(
  employeeId: string,
  contactData: Omit<EmergencyContact, 'id'>,
  transaction?: Transaction,
): Promise<EmergencyContactModel> {
  const validated = EmergencyContactSchema.parse(contactData);

  // If this is primary, unset other primary contacts
  if (validated.isPrimary) {
    await EmergencyContactModel.update(
      { isPrimary: false },
      { where: { employeeId, isPrimary: true }, transaction },
    );
  }

  return EmergencyContactModel.create({
    employeeId,
    ...validated,
  } as any, { transaction });
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
export async function updateEmergencyContact(
  contactId: string,
  updates: Partial<EmergencyContact>,
  transaction?: Transaction,
): Promise<EmergencyContactModel> {
  const contact = await EmergencyContactModel.findByPk(contactId, { transaction });

  if (!contact) {
    throw new NotFoundException(`Emergency contact ${contactId} not found`);
  }

  // If setting as primary, unset other primary contacts
  if (updates.isPrimary) {
    await EmergencyContactModel.update(
      { isPrimary: false },
      { where: { employeeId: contact.employeeId, isPrimary: true }, transaction },
    );
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
export async function removeEmergencyContact(
  contactId: string,
  transaction?: Transaction,
): Promise<void> {
  const contact = await EmergencyContactModel.findByPk(contactId, { transaction });

  if (!contact) {
    throw new NotFoundException(`Emergency contact ${contactId} not found`);
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
export async function getEmergencyContacts(employeeId: string): Promise<EmergencyContactModel[]> {
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
export async function getPrimaryEmergencyContact(
  employeeId: string,
): Promise<EmergencyContactModel | null> {
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
export async function addDependent(
  employeeId: string,
  dependentData: Omit<Dependent, 'id'>,
  transaction?: Transaction,
): Promise<DependentModel> {
  const validated = DependentSchema.parse(dependentData);

  return DependentModel.create({
    employeeId,
    ...validated,
  } as any, { transaction });
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
export async function updateDependent(
  dependentId: string,
  updates: Partial<Dependent>,
  transaction?: Transaction,
): Promise<DependentModel> {
  const dependent = await DependentModel.findByPk(dependentId, { transaction });

  if (!dependent) {
    throw new NotFoundException(`Dependent ${dependentId} not found`);
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
export async function removeDependent(
  dependentId: string,
  transaction?: Transaction,
): Promise<void> {
  const dependent = await DependentModel.findByPk(dependentId, { transaction });

  if (!dependent) {
    throw new NotFoundException(`Dependent ${dependentId} not found`);
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
export async function getDependents(employeeId: string): Promise<DependentModel[]> {
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
export async function getMinorDependents(
  employeeId: string,
  ageLimit: number = 18,
): Promise<DependentModel[]> {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - ageLimit);

  return DependentModel.findAll({
    where: {
      employeeId,
      dateOfBirth: { [Op.gte]: cutoffDate },
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
export async function uploadEmployeeDocument(
  employeeId: string,
  documentData: Omit<EmployeeDocument, 'id' | 'uploadedAt'>,
  uploadedBy: string,
  transaction?: Transaction,
): Promise<EmployeeDocumentModel> {
  return EmployeeDocumentModel.create({
    employeeId,
    ...documentData,
    uploadedBy,
    uploadedAt: new Date(),
  } as any, { transaction });
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
export async function getEmployeeDocuments(
  employeeId: string,
  documentType?: DocumentType,
): Promise<EmployeeDocumentModel[]> {
  const where: WhereOptions = { employeeId };

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
export async function deleteEmployeeDocument(
  documentId: string,
  transaction?: Transaction,
): Promise<void> {
  const document = await EmployeeDocumentModel.findByPk(documentId, { transaction });

  if (!document) {
    throw new NotFoundException(`Document ${documentId} not found`);
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
export async function getExpiringDocuments(daysAhead: number = 30): Promise<EmployeeDocumentModel[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return EmployeeDocumentModel.findAll({
    where: {
      expiryDate: {
        [Op.between]: [new Date(), futureDate],
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
export async function recordGDPRConsent(
  employeeId: string,
  consentData: Omit<GDPRConsent, 'id'>,
  transaction?: Transaction,
): Promise<GDPRConsentModel> {
  const validated = GDPRConsentSchema.parse(consentData);

  return GDPRConsentModel.create({
    employeeId,
    ...validated,
  } as any, { transaction });
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
export async function revokeGDPRConsent(
  employeeId: string,
  consentType: ConsentType,
  transaction?: Transaction,
): Promise<void> {
  await GDPRConsentModel.update(
    { granted: false, revokedAt: new Date() },
    { where: { employeeId, consentType }, transaction },
  );
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
export async function getGDPRConsents(employeeId: string): Promise<GDPRConsentModel[]> {
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
export async function hasGDPRConsent(
  employeeId: string,
  consentType: ConsentType,
): Promise<boolean> {
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
export async function exportEmployeeData(employeeId: string): Promise<any> {
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
    throw new NotFoundException(`Employee ${employeeId} not found`);
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
export async function anonymizeEmployeeData(
  employeeId: string,
  performedBy: string,
  transaction?: Transaction,
): Promise<void> {
  const employee = await EmployeeModel.findByPk(employeeId, { transaction });

  if (!employee) {
    throw new NotFoundException(`Employee ${employeeId} not found`);
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
export async function logEmployeeAction(
  logData: Omit<AuditLogEntry, 'id'>,
  transaction?: Transaction,
): Promise<EmployeeAuditLogModel> {
  return EmployeeAuditLogModel.create(logData as any, { transaction });
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
export async function getEmployeeAuditTrail(
  employeeId: string,
  limit: number = 100,
): Promise<EmployeeAuditLogModel[]> {
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
export async function getFieldChangeHistory(
  employeeId: string,
  fieldName: string,
): Promise<EmployeeAuditLogModel[]> {
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
export async function addCompensation(
  employeeId: string,
  compensationData: CompensationInfo,
  transaction?: Transaction,
): Promise<CompensationHistoryModel> {
  const validated = CompensationSchema.parse(compensationData);

  // End current compensation record
  await CompensationHistoryModel.update(
    { endDate: validated.effectiveDate },
    {
      where: {
        employeeId,
        endDate: null,
      },
      transaction,
    },
  );

  return CompensationHistoryModel.create({
    employeeId,
    ...validated,
  } as any, { transaction });
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
export async function getCurrentCompensation(
  employeeId: string,
): Promise<CompensationHistoryModel | null> {
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
export async function getCompensationHistory(
  employeeId: string,
): Promise<CompensationHistoryModel[]> {
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
export async function bulkImportEmployees(
  employees: Partial<EmployeeProfile>[],
  performedBy: string,
): Promise<BulkImportResult> {
  const result: BulkImportResult = {
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
    } catch (error) {
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
export async function bulkExportEmployees(employeeIds: string[]): Promise<any[]> {
  const employees = await EmployeeModel.findAll({
    where: { id: { [Op.in]: employeeIds } },
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
export async function bulkUpdateStatus(
  employeeIds: string[],
  newStatus: EmployeeStatus,
  performedBy: string,
  reason?: string,
): Promise<number> {
  const [affectedCount] = await EmployeeModel.update(
    { status: newStatus },
    { where: { id: { [Op.in]: employeeIds } } },
  );

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
export function calculateTenure(hireDate: Date, endDate: Date = new Date()): number {
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
export function calculateAge(dateOfBirth: Date): number {
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
export function generateEmployeeNumber(
  prefix: string,
  sequenceNumber: number,
  length: number = 8,
): string {
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
export function formatEmployeeName(
  employee: { firstName: string; middleName?: string; lastName: string; preferredName?: string },
  includeMiddle: boolean = false,
): string {
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
export function validateEmployeeData(data: Partial<EmployeeProfile>): {
  valid: boolean;
  errors: string[];
} {
  try {
    EmployeeProfileSchema.parse(data);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
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
@Injectable()
export class EmployeeService {
  async create(data: Partial<EmployeeProfile>): Promise<EmployeeModel> {
    return createEmployee(data);
  }

  async findById(id: string, includeRelations: boolean = false): Promise<EmployeeModel | null> {
    return getEmployeeById(id, includeRelations);
  }

  async findByNumber(employeeNumber: string): Promise<EmployeeModel | null> {
    return getEmployeeByNumber(employeeNumber);
  }

  async update(id: string, updates: Partial<EmployeeProfile>, performedBy: string): Promise<EmployeeModel> {
    return updateEmployee(id, updates, performedBy);
  }

  async delete(id: string, performedBy: string, reason: string): Promise<void> {
    return deleteEmployee(id, performedBy, reason);
  }

  async search(filters: EmployeeSearchFilters, page: number, limit: number) {
    return searchEmployees(filters, page, limit);
  }

  async terminate(id: string, date: Date, performedBy: string, reason: string): Promise<void> {
    return terminateEmployee(id, date, performedBy, reason);
  }

  async addEmergencyContact(employeeId: string, contact: Omit<EmergencyContact, 'id'>): Promise<EmergencyContactModel> {
    return addEmergencyContact(employeeId, contact);
  }

  async addDependent(employeeId: string, dependent: Omit<Dependent, 'id'>): Promise<DependentModel> {
    return addDependent(employeeId, dependent);
  }

  async exportData(employeeId: string): Promise<any> {
    return exportEmployeeData(employeeId);
  }
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

/**
 * Employee Controller
 */
@ApiTags('Employees')
@Controller('employees')
@ApiBearerAuth()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new employee' })
  @ApiResponse({ status: 201, description: 'Employee created' })
  async create(@Body() data: Partial<EmployeeProfile>): Promise<EmployeeModel> {
    return this.employeeService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'includeRelations', required: false, type: 'boolean' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeRelations') includeRelations?: boolean,
  ): Promise<EmployeeModel> {
    const employee = await this.employeeService.findById(id, includeRelations);
    if (!employee) {
      throw new NotFoundException(`Employee ${id} not found`);
    }
    return employee;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update employee' })
  @ApiParam({ name: 'id', type: 'string' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updates: Partial<EmployeeProfile>,
  ): Promise<EmployeeModel> {
    return this.employeeService.update(id, updates, 'current-user-id');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete employee' })
  @ApiParam({ name: 'id', type: 'string' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
  ): Promise<void> {
    return this.employeeService.delete(id, 'current-user-id', reason);
  }

  @Get()
  @ApiOperation({ summary: 'Search employees' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  async search(
    @Query() filters: EmployeeSearchFilters,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.employeeService.search(filters, page, limit);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  EmployeeModel,
  EmergencyContactModel,
  DependentModel,
  EmployeeDocumentModel,
  GDPRConsentModel,
  EmployeeAuditLogModel,
  CompensationHistoryModel,
  EmployeeService,
  EmployeeController,
};
