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
 * File: /reuse/server/human-capital/employee-self-service-kit.ts
 * Locator: WC-HCM-ESS-001
 * Purpose: Comprehensive Employee Self-Service Utilities - SAP SuccessFactors Employee Central parity
 *
 * Upstream: Error handling, validation, file storage utilities
 * Downstream: ../backend/*, Employee portal controllers, HR services, mobile apps
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 47+ utility functions for employee profile, benefits, time off, expenses, performance, learning
 *
 * LLM Context: Enterprise-grade employee self-service system competing with SAP SuccessFactors Employee Central.
 * Provides profile management, personal information updates, emergency contacts, payslip access, tax documents,
 * benefits enrollment, time off requests, timesheet submission, expense reporting, performance self-assessment,
 * goal management, learning enrollment, document management, and e-signatures.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  IsEmail,
  IsPhoneNumber,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { faker } from '@faker-js/faker';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Employee profile status
 */
export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
  SUSPENDED = 'suspended',
}

/**
 * Marital status options
 */
export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
  DOMESTIC_PARTNER = 'domestic_partner',
}

/**
 * Gender options
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
  OTHER = 'other',
}

/**
 * Emergency contact relationship
 */
export enum EmergencyContactRelationship {
  SPOUSE = 'spouse',
  PARENT = 'parent',
  CHILD = 'child',
  SIBLING = 'sibling',
  FRIEND = 'friend',
  OTHER = 'other',
}

/**
 * Time off request status
 */
export enum TimeOffStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  WITHDRAWN = 'withdrawn',
}

/**
 * Time off types
 */
export enum TimeOffType {
  VACATION = 'vacation',
  SICK_LEAVE = 'sick_leave',
  PERSONAL = 'personal',
  BEREAVEMENT = 'bereavement',
  JURY_DUTY = 'jury_duty',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  PARENTAL = 'parental',
  MILITARY = 'military',
  UNPAID = 'unpaid',
  SABBATICAL = 'sabbatical',
  COMPENSATORY = 'compensatory',
}

/**
 * Expense status
 */
export enum ExpenseStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

/**
 * Expense categories
 */
export enum ExpenseCategory {
  TRAVEL = 'travel',
  MEALS = 'meals',
  LODGING = 'lodging',
  TRANSPORTATION = 'transportation',
  ENTERTAINMENT = 'entertainment',
  OFFICE_SUPPLIES = 'office_supplies',
  TRAINING = 'training',
  EQUIPMENT = 'equipment',
  OTHER = 'other',
}

/**
 * Benefits enrollment status
 */
export enum BenefitsEnrollmentStatus {
  NOT_ENROLLED = 'not_enrolled',
  PENDING = 'pending',
  ENROLLED = 'enrolled',
  WAIVED = 'waived',
  TERMINATED = 'terminated',
}

/**
 * Benefits plan types
 */
export enum BenefitsPlanType {
  HEALTH_INSURANCE = 'health_insurance',
  DENTAL_INSURANCE = 'dental_insurance',
  VISION_INSURANCE = 'vision_insurance',
  LIFE_INSURANCE = 'life_insurance',
  DISABILITY_INSURANCE = 'disability_insurance',
  RETIREMENT_401K = 'retirement_401k',
  HSA = 'hsa',
  FSA = 'fsa',
  COMMUTER = 'commuter',
  WELLNESS = 'wellness',
}

/**
 * Performance review status
 */
export enum PerformanceReviewStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  MANAGER_REVIEW = 'manager_review',
  CALIBRATION = 'calibration',
  COMPLETED = 'completed',
  CLOSED = 'closed',
}

/**
 * Goal status
 */
export enum GoalStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  BEHIND = 'behind',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Learning enrollment status
 */
export enum LearningEnrollmentStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  WITHDRAWN = 'withdrawn',
  EXPIRED = 'expired',
}

/**
 * Document signature status
 */
export enum DocumentSignatureStatus {
  PENDING = 'pending',
  SIGNED = 'signed',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}

/**
 * Timesheet status
 */
export enum TimesheetStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

// ============================================================================
// INTERFACES
// ============================================================================

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

// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================

/**
 * DTO for updating employee profile
 */
export class UpdateEmployeeProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  preferredName?: string;

  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsPhoneNumber()
  mobilePhone?: string;

  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  biography?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];
}

/**
 * DTO for address
 */
export class AddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  street1: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  street2?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country: string;
}

/**
 * DTO for creating emergency contact
 */
export class CreateEmergencyContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsEnum(EmergencyContactRelationship)
  relationship: EmergencyContactRelationship;

  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsPhoneNumber()
  alternatePhone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsBoolean()
  isPrimary: boolean;
}

/**
 * DTO for creating time off request
 */
export class CreateTimeOffRequestDto {
  @IsEnum(TimeOffType)
  type: TimeOffType;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}

/**
 * DTO for creating expense report
 */
export class CreateExpenseReportDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  currency: string;
}

/**
 * DTO for creating expense item
 */
export class CreateExpenseItemDto {
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  merchant: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @MaxLength(3)
  currency: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @IsBoolean()
  billable: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  projectCode?: string;
}

/**
 * DTO for benefits enrollment
 */
export class EnrollBenefitsDto {
  @IsString()
  @IsNotEmpty()
  planId: string;

  @IsEnum(BenefitsPlanType)
  planType: BenefitsPlanType;

  @IsDate()
  @Type(() => Date)
  effectiveDate: Date;

  @IsEnum(['employee', 'employee_spouse', 'employee_children', 'family'])
  coverageLevel: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BenefitsDependentDto)
  dependents?: BenefitsDependentDto[];
}

/**
 * DTO for benefits dependent
 */
export class BenefitsDependentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsEnum(['spouse', 'child', 'domestic_partner'])
  relationship: string;
}

/**
 * DTO for performance self-assessment
 */
export class SubmitSelfAssessmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  achievements: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  challenges: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  developmentAreas: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  careerGoals: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompetencyRatingDto)
  competencyRatings: CompetencyRatingDto[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  overallRating?: number;
}

/**
 * DTO for competency rating
 */
export class CompetencyRatingDto {
  @IsString()
  @IsNotEmpty()
  competencyName: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  selfRating: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comments?: string;
}

/**
 * DTO for creating employee goal
 */
export class CreateEmployeeGoalDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @IsEnum(['performance', 'development', 'project', 'stretch'])
  category: string;

  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  targetDate: Date;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  metrics?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GoalMilestoneDto)
  milestones?: GoalMilestoneDto[];
}

/**
 * DTO for goal milestone
 */
export class GoalMilestoneDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsDate()
  @Type(() => Date)
  targetDate: Date;
}

/**
 * DTO for enrolling in learning course
 */
export class EnrollLearningCourseDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;
}

/**
 * DTO for creating timesheet
 */
export class CreateTimesheetDto {
  @IsDate()
  @Type(() => Date)
  periodStart: Date;

  @IsDate()
  @Type(() => Date)
  periodEnd: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimesheetEntryDto)
  entries: TimesheetEntryDto[];
}

/**
 * DTO for timesheet entry
 */
export class TimesheetEntryDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  projectCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  taskCode?: string;

  @IsNumber()
  @Min(0)
  @Max(24)
  hours: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsBoolean()
  isBillable: boolean;

  @IsBoolean()
  isOvertime: boolean;
}

/**
 * DTO for uploading document
 */
export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  documentType: string;

  @IsEnum(['personal', 'employment', 'benefits', 'performance', 'compliance', 'other'])
  category: string;

  @IsBoolean()
  requiresSignature: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;
}

// ============================================================================
// EMPLOYEE PROFILE MANAGEMENT FUNCTIONS
// ============================================================================

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
export async function getEmployeeProfile(employeeId: string): Promise<EmployeeProfile> {
  // In production, fetch from database
  return {
    id: faker.string.uuid(),
    employeeId,
    userId: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    status: EmployeeStatus.ACTIVE,
    hireDate: faker.date.past(),
    department: faker.commerce.department(),
    jobTitle: faker.person.jobTitle(),
    location: faker.location.city(),
    employmentType: 'full_time',
    emergencyContacts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

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
export async function updateEmployeeProfile(
  employeeId: string,
  updates: Partial<EmployeeProfile>,
): Promise<EmployeeProfile> {
  // In production, update in database
  await logAuditTrail(employeeId, 'update_profile', updates);
  const profile = await getEmployeeProfile(employeeId);
  return { ...profile, ...updates, updatedAt: new Date() };
}

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
export async function getEmployeeProfilePicture(employeeId: string): Promise<string | null> {
  const profile = await getEmployeeProfile(employeeId);
  return profile.profilePictureUrl || null;
}

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
export async function updateEmployeeProfilePicture(
  employeeId: string,
  fileUrl: string,
): Promise<EmployeeProfile> {
  return updateEmployeeProfile(employeeId, { profilePictureUrl: fileUrl });
}

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
export async function getEmployeeWorkHistory(
  employeeId: string,
): Promise<Array<{ jobTitle: string; department: string; startDate: Date; endDate?: Date }>> {
  // In production, fetch from database
  return [
    {
      jobTitle: 'Senior Engineer',
      department: 'Engineering',
      startDate: new Date('2020-01-01'),
    },
  ];
}

// ============================================================================
// PERSONAL INFORMATION & EMERGENCY CONTACTS
// ============================================================================

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
export async function createEmergencyContact(
  employeeId: string,
  contactData: Omit<EmergencyContact, 'id' | 'employeeId' | 'createdAt' | 'updatedAt'>,
): Promise<EmergencyContact> {
  const contact: EmergencyContact = {
    id: faker.string.uuid(),
    employeeId,
    ...contactData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await logAuditTrail(employeeId, 'create_emergency_contact', contact);
  return contact;
}

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
export async function getEmergencyContacts(employeeId: string): Promise<EmergencyContact[]> {
  // In production, fetch from database
  return [];
}

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
export async function updateEmergencyContact(
  contactId: string,
  updates: Partial<EmergencyContact>,
): Promise<EmergencyContact> {
  // In production, update in database
  const contact = await getEmergencyContactById(contactId);
  return { ...contact, ...updates, updatedAt: new Date() };
}

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
export async function deleteEmergencyContact(contactId: string): Promise<boolean> {
  // In production, delete from database
  await logAuditTrail('', 'delete_emergency_contact', { contactId });
  return true;
}

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
export async function setPrimaryEmergencyContact(
  employeeId: string,
  contactId: string,
): Promise<EmergencyContact> {
  // Reset all contacts to non-primary
  const contacts = await getEmergencyContacts(employeeId);
  for (const contact of contacts) {
    if (contact.isPrimary) {
      await updateEmergencyContact(contact.id, { isPrimary: false });
    }
  }
  return updateEmergencyContact(contactId, { isPrimary: true });
}

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
export function validateAddress(address: Address): boolean {
  return !!(
    address.street1 &&
    address.city &&
    address.state &&
    address.postalCode &&
    address.country
  );
}

// ============================================================================
// PAYSLIP & TAX DOCUMENTS
// ============================================================================

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
export async function getEmployeePayslips(
  employeeId: string,
  year?: number,
): Promise<Payslip[]> {
  // In production, fetch from database with year filter
  return [];
}

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
export async function getPayslipById(payslipId: string): Promise<Payslip> {
  // In production, fetch from database
  return {
    id: payslipId,
    employeeId: 'emp-1',
    payPeriodStart: new Date(),
    payPeriodEnd: new Date(),
    payDate: new Date(),
    grossPay: 5000,
    netPay: 3500,
    deductions: [],
    earnings: [],
    taxes: [],
    yearToDateGross: 50000,
    yearToDateNet: 35000,
    documentUrl: 'https://storage.example.com/payslip.pdf',
    currency: 'USD',
    createdAt: new Date(),
  };
}

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
export async function downloadPayslip(payslipId: string): Promise<string> {
  const payslip = await getPayslipById(payslipId);
  await logAuditTrail('', 'download_payslip', { payslipId });
  return payslip.documentUrl;
}

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
export async function getEmployeeTaxDocuments(
  employeeId: string,
  taxYear: number,
): Promise<TaxDocument[]> {
  // In production, fetch from database
  return [];
}

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
export async function downloadTaxDocument(documentId: string): Promise<string> {
  // In production, fetch from database and generate URL
  await logAuditTrail('', 'download_tax_document', { documentId });
  return 'https://storage.example.com/tax-document.pdf';
}

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
export async function getYearToDateSummary(
  employeeId: string,
): Promise<{ grossPay: number; netPay: number; taxes: number; deductions: number }> {
  const payslips = await getEmployeePayslips(employeeId, new Date().getFullYear());
  return {
    grossPay: payslips.reduce((sum, p) => sum + p.grossPay, 0),
    netPay: payslips.reduce((sum, p) => sum + p.netPay, 0),
    taxes: payslips.reduce((sum, p) => sum + p.taxes.reduce((t, tax) => t + tax.amount, 0), 0),
    deductions: payslips.reduce(
      (sum, p) => sum + p.deductions.reduce((d, deduction) => d + deduction.amount, 0),
      0,
    ),
  };
}

// ============================================================================
// BENEFITS ENROLLMENT & MANAGEMENT
// ============================================================================

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
export async function getEmployeeBenefitsEnrollments(
  employeeId: string,
): Promise<BenefitsEnrollment[]> {
  // In production, fetch from database
  return [];
}

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
export async function getAvailableBenefitsPlans(
  employeeId: string,
): Promise<
  Array<{
    id: string;
    planType: BenefitsPlanType;
    planName: string;
    description: string;
    employeeContribution: number;
    employerContribution: number;
  }>
> {
  // In production, fetch from database
  return [];
}

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
export async function enrollInBenefitsPlan(
  employeeId: string,
  enrollmentData: Omit<
    BenefitsEnrollment,
    'id' | 'employeeId' | 'status' | 'enrollmentDate' | 'lastModified'
  >,
): Promise<BenefitsEnrollment> {
  const enrollment: BenefitsEnrollment = {
    id: faker.string.uuid(),
    employeeId,
    status: BenefitsEnrollmentStatus.PENDING,
    enrollmentDate: new Date(),
    lastModified: new Date(),
    ...enrollmentData,
  };
  await logAuditTrail(employeeId, 'enroll_benefits', enrollment);
  return enrollment;
}

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
export async function updateBenefitsEnrollment(
  enrollmentId: string,
  updates: Partial<BenefitsEnrollment>,
): Promise<BenefitsEnrollment> {
  // In production, update in database
  const enrollment = await getBenefitsEnrollmentById(enrollmentId);
  return { ...enrollment, ...updates, lastModified: new Date() };
}

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
export async function terminateBenefitsEnrollment(
  enrollmentId: string,
  terminationDate: Date,
): Promise<BenefitsEnrollment> {
  return updateBenefitsEnrollment(enrollmentId, {
    status: BenefitsEnrollmentStatus.TERMINATED,
    terminationDate,
  });
}

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
export async function waiveBenefitsPlan(
  employeeId: string,
  planType: BenefitsPlanType,
  reason: string,
): Promise<BenefitsEnrollment> {
  const enrollment: BenefitsEnrollment = {
    id: faker.string.uuid(),
    employeeId,
    planType,
    planName: 'Waived',
    planId: 'waived',
    status: BenefitsEnrollmentStatus.WAIVED,
    effectiveDate: new Date(),
    employeeContribution: 0,
    employerContribution: 0,
    coverageLevel: 'employee',
    enrollmentDate: new Date(),
    lastModified: new Date(),
  };
  await logAuditTrail(employeeId, 'waive_benefits', { planType, reason });
  return enrollment;
}

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
export async function getBenefitsEnrollmentSummary(
  employeeId: string,
): Promise<{
  totalEmployeeContribution: number;
  totalEmployerContribution: number;
  enrolledPlans: number;
  waivedPlans: number;
}> {
  const enrollments = await getEmployeeBenefitsEnrollments(employeeId);
  return {
    totalEmployeeContribution: enrollments.reduce(
      (sum, e) => sum + e.employeeContribution,
      0,
    ),
    totalEmployerContribution: enrollments.reduce(
      (sum, e) => sum + e.employerContribution,
      0,
    ),
    enrolledPlans: enrollments.filter((e) => e.status === BenefitsEnrollmentStatus.ENROLLED)
      .length,
    waivedPlans: enrollments.filter((e) => e.status === BenefitsEnrollmentStatus.WAIVED).length,
  };
}

// ============================================================================
// TIME OFF REQUESTS & TRACKING
// ============================================================================

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
export async function createTimeOffRequest(
  employeeId: string,
  requestData: Omit<
    TimeOffRequest,
    'id' | 'employeeId' | 'status' | 'createdAt' | 'updatedAt' | 'totalDays'
  >,
): Promise<TimeOffRequest> {
  const totalDays = calculateBusinessDays(requestData.startDate, requestData.endDate);
  const request: TimeOffRequest = {
    id: faker.string.uuid(),
    employeeId,
    totalDays,
    status: TimeOffStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...requestData,
  };
  await logAuditTrail(employeeId, 'create_time_off_request', request);
  return request;
}

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
export async function submitTimeOffRequest(requestId: string): Promise<TimeOffRequest> {
  const request = await getTimeOffRequestById(requestId);
  return {
    ...request,
    status: TimeOffStatus.SUBMITTED,
    submittedAt: new Date(),
    updatedAt: new Date(),
  };
}

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
export async function getEmployeeTimeOffRequests(
  employeeId: string,
  status?: TimeOffStatus,
): Promise<TimeOffRequest[]> {
  // In production, fetch from database with optional status filter
  return [];
}

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
export async function cancelTimeOffRequest(requestId: string): Promise<TimeOffRequest> {
  const request = await getTimeOffRequestById(requestId);
  return {
    ...request,
    status: TimeOffStatus.CANCELLED,
    updatedAt: new Date(),
  };
}

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
export async function getEmployeeTimeOffBalances(
  employeeId: string,
): Promise<TimeOffBalance[]> {
  // In production, fetch from database
  return [];
}

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
export async function calculateAvailableTimeOff(
  employeeId: string,
  type: TimeOffType,
): Promise<number> {
  const balances = await getEmployeeTimeOffBalances(employeeId);
  const balance = balances.find((b) => b.type === type);
  return balance ? balance.available : 0;
}

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
export async function getTimeOffRequestHistory(
  employeeId: string,
  year: number,
): Promise<TimeOffRequest[]> {
  const requests = await getEmployeeTimeOffRequests(employeeId);
  return requests.filter((r) => r.createdAt.getFullYear() === year);
}

// ============================================================================
// TIMESHEET SUBMISSION
// ============================================================================

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
export async function createTimesheet(
  employeeId: string,
  timesheetData: Omit<Timesheet, 'id' | 'employeeId' | 'status' | 'createdAt' | 'updatedAt'>,
): Promise<Timesheet> {
  const timesheet: Timesheet = {
    id: faker.string.uuid(),
    employeeId,
    status: TimesheetStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...timesheetData,
  };
  await logAuditTrail(employeeId, 'create_timesheet', timesheet);
  return timesheet;
}

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
export async function submitTimesheet(timesheetId: string): Promise<Timesheet> {
  const timesheet = await getTimesheetById(timesheetId);
  return {
    ...timesheet,
    status: TimesheetStatus.SUBMITTED,
    submittedDate: new Date(),
    updatedAt: new Date(),
  };
}

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
export async function getEmployeeTimesheets(
  employeeId: string,
  status?: TimesheetStatus,
): Promise<Timesheet[]> {
  // In production, fetch from database with optional status filter
  return [];
}

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
export function calculateTimesheetTotals(
  entries: TimesheetEntry[],
): { totalHours: number; regularHours: number; overtimeHours: number } {
  return {
    totalHours: entries.reduce((sum, e) => sum + e.hours, 0),
    regularHours: entries.filter((e) => !e.isOvertime).reduce((sum, e) => sum + e.hours, 0),
    overtimeHours: entries.filter((e) => e.isOvertime).reduce((sum, e) => sum + e.hours, 0),
  };
}

// ============================================================================
// EXPENSE REPORT SUBMISSION
// ============================================================================

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
export async function createExpenseReport(
  employeeId: string,
  reportData: Omit<
    ExpenseReport,
    'id' | 'employeeId' | 'reportNumber' | 'status' | 'createdAt' | 'updatedAt'
  >,
): Promise<ExpenseReport> {
  const reportNumber = generateExpenseReportNumber(employeeId);
  const report: ExpenseReport = {
    id: faker.string.uuid(),
    employeeId,
    reportNumber,
    status: ExpenseStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...reportData,
  };
  await logAuditTrail(employeeId, 'create_expense_report', report);
  return report;
}

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
export async function addExpenseItem(
  reportId: string,
  expenseData: Omit<ExpenseItem, 'id' | 'expenseReportId' | 'createdAt'>,
): Promise<ExpenseItem> {
  const expense: ExpenseItem = {
    id: faker.string.uuid(),
    expenseReportId: reportId,
    createdAt: new Date(),
    ...expenseData,
  };
  return expense;
}

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
export async function submitExpenseReport(reportId: string): Promise<ExpenseReport> {
  const report = await getExpenseReportById(reportId);
  return {
    ...report,
    status: ExpenseStatus.SUBMITTED,
    submittedAt: new Date(),
    updatedAt: new Date(),
  };
}

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
export async function getEmployeeExpenseReports(
  employeeId: string,
  status?: ExpenseStatus,
): Promise<ExpenseReport[]> {
  // In production, fetch from database with optional status filter
  return [];
}

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
export function calculateExpenseReportTotal(expenses: ExpenseItem[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

// ============================================================================
// PERFORMANCE SELF-ASSESSMENT
// ============================================================================

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
export async function getEmployeeSelfAssessments(
  employeeId: string,
): Promise<PerformanceSelfAssessment[]> {
  // In production, fetch from database
  return [];
}

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
export async function createSelfAssessment(
  employeeId: string,
  assessmentData: Omit<
    PerformanceSelfAssessment,
    'id' | 'employeeId' | 'status' | 'createdAt' | 'updatedAt'
  >,
): Promise<PerformanceSelfAssessment> {
  const assessment: PerformanceSelfAssessment = {
    id: faker.string.uuid(),
    employeeId,
    status: PerformanceReviewStatus.NOT_STARTED,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...assessmentData,
  };
  await logAuditTrail(employeeId, 'create_self_assessment', assessment);
  return assessment;
}

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
export async function submitSelfAssessment(
  assessmentId: string,
): Promise<PerformanceSelfAssessment> {
  const assessment = await getSelfAssessmentById(assessmentId);
  return {
    ...assessment,
    status: PerformanceReviewStatus.SUBMITTED,
    submittedDate: new Date(),
    updatedAt: new Date(),
  };
}

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
export async function updateCompetencyRating(
  assessmentId: string,
  competencyName: string,
  rating: number,
): Promise<PerformanceSelfAssessment> {
  const assessment = await getSelfAssessmentById(assessmentId);
  const competency = assessment.competencyRatings.find((c) => c.competencyName === competencyName);
  if (competency) {
    competency.selfRating = rating;
  }
  return { ...assessment, updatedAt: new Date() };
}

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
export function calculateAverageSelfRating(assessment: PerformanceSelfAssessment): number {
  if (assessment.competencyRatings.length === 0) return 0;
  const sum = assessment.competencyRatings.reduce((total, c) => total + c.selfRating, 0);
  return sum / assessment.competencyRatings.length;
}

// ============================================================================
// GOAL MANAGEMENT & TRACKING
// ============================================================================

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
export async function createEmployeeGoal(
  employeeId: string,
  goalData: Omit<EmployeeGoal, 'id' | 'employeeId' | 'status' | 'createdAt' | 'updatedAt'>,
): Promise<EmployeeGoal> {
  const goal: EmployeeGoal = {
    id: faker.string.uuid(),
    employeeId,
    status: GoalStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...goalData,
  };
  await logAuditTrail(employeeId, 'create_goal', goal);
  return goal;
}

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
export async function getEmployeeGoals(
  employeeId: string,
  status?: GoalStatus,
): Promise<EmployeeGoal[]> {
  // In production, fetch from database with optional status filter
  return [];
}

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
export async function updateGoalProgress(goalId: string, progress: number): Promise<EmployeeGoal> {
  const goal = await getEmployeeGoalById(goalId);
  const newStatus = determineGoalStatusFromProgress(progress, goal.targetDate);
  return { ...goal, progress, status: newStatus, updatedAt: new Date() };
}

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
export async function completeMilestone(
  goalId: string,
  milestoneId: string,
): Promise<EmployeeGoal> {
  const goal = await getEmployeeGoalById(goalId);
  const milestone = goal.milestones.find((m) => m.id === milestoneId);
  if (milestone) {
    milestone.isCompleted = true;
    milestone.completionDate = new Date();
  }
  return { ...goal, updatedAt: new Date() };
}

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
export async function completeGoal(goalId: string): Promise<EmployeeGoal> {
  const goal = await getEmployeeGoalById(goalId);
  return {
    ...goal,
    status: GoalStatus.COMPLETED,
    progress: 100,
    completionDate: new Date(),
    updatedAt: new Date(),
  };
}

// ============================================================================
// LEARNING ENROLLMENT & TRACKING
// ============================================================================

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
export async function getAvailableLearningCourses(category?: string): Promise<LearningCourse[]> {
  // In production, fetch from database with optional category filter
  return [];
}

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
export async function enrollInLearningCourse(
  employeeId: string,
  courseId: string,
): Promise<LearningEnrollment> {
  const course = await getLearningCourseById(courseId);
  const enrollment: LearningEnrollment = {
    id: faker.string.uuid(),
    employeeId,
    courseId,
    courseTitle: course.title,
    status: LearningEnrollmentStatus.NOT_STARTED,
    enrollmentDate: new Date(),
    progress: 0,
    isRequired: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await logAuditTrail(employeeId, 'enroll_learning_course', enrollment);
  return enrollment;
}

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
export async function getEmployeeLearningEnrollments(
  employeeId: string,
  status?: LearningEnrollmentStatus,
): Promise<LearningEnrollment[]> {
  // In production, fetch from database with optional status filter
  return [];
}

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
export async function updateLearningCourseProgress(
  enrollmentId: string,
  progress: number,
): Promise<LearningEnrollment> {
  const enrollment = await getLearningEnrollmentById(enrollmentId);
  const status =
    progress === 100
      ? LearningEnrollmentStatus.COMPLETED
      : LearningEnrollmentStatus.IN_PROGRESS;
  return { ...enrollment, progress, status, updatedAt: new Date() };
}

// ============================================================================
// DOCUMENT MANAGEMENT & E-SIGNATURES
// ============================================================================

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
export async function getEmployeeDocuments(
  employeeId: string,
  category?: string,
): Promise<EmployeeDocument[]> {
  // In production, fetch from database with optional category filter
  return [];
}

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
export async function uploadEmployeeDocument(
  employeeId: string,
  documentData: Omit<EmployeeDocument, 'id' | 'employeeId' | 'uploadedAt'>,
): Promise<EmployeeDocument> {
  const document: EmployeeDocument = {
    id: faker.string.uuid(),
    employeeId,
    uploadedAt: new Date(),
    ...documentData,
  };
  await logAuditTrail(employeeId, 'upload_document', document);
  return document;
}

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
export async function signDocument(
  documentId: string,
  signatureData: string,
): Promise<EmployeeDocument> {
  const document = await getEmployeeDocumentById(documentId);
  return {
    ...document,
    signatureStatus: DocumentSignatureStatus.SIGNED,
    signedDate: new Date(),
    signatureUrl: signatureData,
  };
}

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
export async function getDocumentsRequiringSignature(
  employeeId: string,
): Promise<EmployeeDocument[]> {
  const documents = await getEmployeeDocuments(employeeId);
  return documents.filter(
    (d) =>
      d.requiresSignature &&
      (!d.signatureStatus || d.signatureStatus === DocumentSignatureStatus.PENDING),
  );
}

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
export async function declineDocumentSignature(
  documentId: string,
  reason: string,
): Promise<EmployeeDocument> {
  const document = await getEmployeeDocumentById(documentId);
  await logAuditTrail('', 'decline_document_signature', { documentId, reason });
  return {
    ...document,
    signatureStatus: DocumentSignatureStatus.DECLINED,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculates business days between two dates
 */
function calculateBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

/**
 * Generates unique expense report number
 */
function generateExpenseReportNumber(employeeId: string): string {
  const timestamp = Date.now();
  return `EXP-${employeeId.slice(0, 6).toUpperCase()}-${timestamp}`;
}

/**
 * Determines goal status from progress and target date
 */
function determineGoalStatusFromProgress(progress: number, targetDate: Date): GoalStatus {
  if (progress === 100) return GoalStatus.COMPLETED;
  if (progress === 0) return GoalStatus.DRAFT;

  const now = new Date();
  const daysRemaining = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) return GoalStatus.BEHIND;
  if (progress < 50 && daysRemaining < 30) return GoalStatus.AT_RISK;
  return GoalStatus.ON_TRACK;
}

/**
 * Logs audit trail entry
 */
async function logAuditTrail(
  employeeId: string,
  action: string,
  data: any,
): Promise<void> {
  // In production, log to audit database
  console.log(`Audit: ${employeeId} - ${action}`, data);
}

/**
 * Gets time off request by ID
 */
async function getTimeOffRequestById(requestId: string): Promise<TimeOffRequest> {
  return {
    id: requestId,
    employeeId: 'emp-1',
    type: TimeOffType.VACATION,
    startDate: new Date(),
    endDate: new Date(),
    totalDays: 5,
    status: TimeOffStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Gets emergency contact by ID
 */
async function getEmergencyContactById(contactId: string): Promise<EmergencyContact> {
  return {
    id: contactId,
    employeeId: 'emp-1',
    name: 'Contact Name',
    relationship: EmergencyContactRelationship.SPOUSE,
    phone: '+1-555-0100',
    isPrimary: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Gets benefits enrollment by ID
 */
async function getBenefitsEnrollmentById(enrollmentId: string): Promise<BenefitsEnrollment> {
  return {
    id: enrollmentId,
    employeeId: 'emp-1',
    planType: BenefitsPlanType.HEALTH_INSURANCE,
    planName: 'Health Plan',
    planId: 'plan-1',
    status: BenefitsEnrollmentStatus.ENROLLED,
    effectiveDate: new Date(),
    employeeContribution: 100,
    employerContribution: 200,
    coverageLevel: 'employee',
    enrollmentDate: new Date(),
    lastModified: new Date(),
  };
}

/**
 * Gets expense report by ID
 */
async function getExpenseReportById(reportId: string): Promise<ExpenseReport> {
  return {
    id: reportId,
    employeeId: 'emp-1',
    reportNumber: 'EXP-001',
    title: 'Expense Report',
    totalAmount: 0,
    currency: 'USD',
    status: ExpenseStatus.DRAFT,
    expenses: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Gets self-assessment by ID
 */
async function getSelfAssessmentById(assessmentId: string): Promise<PerformanceSelfAssessment> {
  return {
    id: assessmentId,
    employeeId: 'emp-1',
    reviewPeriodStart: new Date(),
    reviewPeriodEnd: new Date(),
    status: PerformanceReviewStatus.NOT_STARTED,
    achievements: '',
    challenges: '',
    developmentAreas: '',
    careerGoals: '',
    competencyRatings: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Gets employee goal by ID
 */
async function getEmployeeGoalById(goalId: string): Promise<EmployeeGoal> {
  return {
    id: goalId,
    employeeId: 'emp-1',
    title: 'Goal',
    description: '',
    category: 'performance',
    status: GoalStatus.DRAFT,
    priority: 'medium',
    startDate: new Date(),
    targetDate: new Date(),
    progress: 0,
    milestones: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Gets learning course by ID
 */
async function getLearningCourseById(courseId: string): Promise<LearningCourse> {
  return {
    id: courseId,
    courseCode: 'COURSE-001',
    title: 'Course Title',
    description: '',
    category: 'technical',
    duration: 40,
    durationUnit: 'hours',
    provider: 'Provider',
    format: 'online',
    difficulty: 'intermediate',
    certificationOffered: false,
    isActive: true,
  };
}

/**
 * Gets learning enrollment by ID
 */
async function getLearningEnrollmentById(enrollmentId: string): Promise<LearningEnrollment> {
  return {
    id: enrollmentId,
    employeeId: 'emp-1',
    courseId: 'course-1',
    courseTitle: 'Course',
    status: LearningEnrollmentStatus.NOT_STARTED,
    enrollmentDate: new Date(),
    progress: 0,
    isRequired: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Gets employee document by ID
 */
async function getEmployeeDocumentById(documentId: string): Promise<EmployeeDocument> {
  return {
    id: documentId,
    employeeId: 'emp-1',
    documentType: 'Document',
    fileName: 'document.pdf',
    fileUrl: 'https://storage.example.com/document.pdf',
    fileSize: 102400,
    mimeType: 'application/pdf',
    category: 'personal',
    requiresSignature: false,
    isConfidential: false,
    uploadedBy: 'emp-1',
    uploadedAt: new Date(),
  };
}

/**
 * Gets timesheet by ID
 */
async function getTimesheetById(timesheetId: string): Promise<Timesheet> {
  return {
    id: timesheetId,
    employeeId: 'emp-1',
    periodStart: new Date(),
    periodEnd: new Date(),
    totalHours: 0,
    regularHours: 0,
    overtimeHours: 0,
    entries: [],
    status: TimesheetStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

/**
 * Employee Self-Service Controller
 * Provides RESTful API endpoints for employee self-service operations
 */
@ApiTags('employee-self-service')
@Controller('employee-self-service')
@ApiBearerAuth()
export class EmployeeSelfServiceController {
  /**
   * Get employee profile
   */
  @Get('profile/:employeeId')
  @ApiOperation({ summary: 'Get employee profile' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  async getProfile(@Param('employeeId') employeeId: string) {
    return getEmployeeProfile(employeeId);
  }

  /**
   * Update employee profile
   */
  @Patch('profile/:employeeId')
  @ApiOperation({ summary: 'Update employee profile' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateProfile(
    @Param('employeeId') employeeId: string,
    @Body() updateDto: UpdateEmployeeProfileDto,
  ) {
    return updateEmployeeProfile(employeeId, updateDto);
  }

  /**
   * Get time off requests
   */
  @Get('time-off/:employeeId')
  @ApiOperation({ summary: 'Get employee time off requests' })
  async getTimeOffRequests(@Param('employeeId') employeeId: string) {
    return getEmployeeTimeOffRequests(employeeId);
  }

  /**
   * Create time off request
   */
  @Post('time-off/:employeeId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create time off request' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createTimeOff(
    @Param('employeeId') employeeId: string,
    @Body() createDto: CreateTimeOffRequestDto,
  ) {
    return createTimeOffRequest(employeeId, createDto);
  }

  /**
   * Get expense reports
   */
  @Get('expenses/:employeeId')
  @ApiOperation({ summary: 'Get employee expense reports' })
  async getExpenses(@Param('employeeId') employeeId: string) {
    return getEmployeeExpenseReports(employeeId);
  }

  /**
   * Create expense report
   */
  @Post('expenses/:employeeId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create expense report' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createExpense(
    @Param('employeeId') employeeId: string,
    @Body() createDto: CreateExpenseReportDto,
  ) {
    return createExpenseReport(employeeId, createDto as any);
  }

  /**
   * Get employee goals
   */
  @Get('goals/:employeeId')
  @ApiOperation({ summary: 'Get employee goals' })
  async getGoals(@Param('employeeId') employeeId: string) {
    return getEmployeeGoals(employeeId);
  }

  /**
   * Create employee goal
   */
  @Post('goals/:employeeId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create employee goal' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createGoal(
    @Param('employeeId') employeeId: string,
    @Body() createDto: CreateEmployeeGoalDto,
  ) {
    return createEmployeeGoal(employeeId, createDto as any);
  }
}
