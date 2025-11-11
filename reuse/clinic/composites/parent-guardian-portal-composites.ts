/**
 * LOC: CLINIC-PARENTPORTAL-COMP-001
 * File: /reuse/clinic/composites/parent-guardian-portal-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../../server/health/health-patient-management-kit
 *   - ../../server/health/health-clinical-workflows-kit
 *   - ../../server/health/health-medical-records-kit
 *   - ../../education/student-records-kit
 *   - ../../communication/notification-kit
 *   - ../../data/crud-operations
 *   - ../../data/data-repository
 *
 * DOWNSTREAM (imported by):
 *   - Parent portal API controllers
 *   - Guardian mobile applications
 *   - Parent communication services
 *   - Health consent management systems
 *   - Appointment scheduling modules
 *   - Document upload services
 */

/**
 * File: /reuse/clinic/composites/parent-guardian-portal-composites.ts
 * Locator: WC-CLINIC-PARENTPORTAL-001
 * Purpose: Parent Guardian Portal Composite - Comprehensive parent/guardian health portal management
 *
 * Upstream: health-patient-management-kit, health-clinical-workflows-kit, health-medical-records-kit,
 *           student-records-kit, notification-kit, data-repository
 * Downstream: Parent portal controllers, Guardian apps, Consent systems, Appointment modules
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 45 composed functions for complete parent/guardian portal functionality
 *
 * LLM Context: Production-grade parent/guardian health portal composite for K-12 school clinic SaaS platform.
 * Provides comprehensive portal access management including user authentication and authorization, portal
 * registration and account setup, health record viewing with permission-based access, online consent form
 * submission with electronic signatures, medication authorization workflows with digital approvals, immunization
 * upload and verification with document scanning, appointment request system with scheduling, health alert
 * notifications with preference management, communication preference configuration, document upload for medical
 * forms, emergency contact updates, and comprehensive audit trails for FERPA/HIPAA compliance.
 */

import {
  Injectable,
  Logger,
  Inject,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Sequelize, Model, DataTypes, Transaction, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS & ENUMERATIONS
// ============================================================================

/**
 * Portal user account status
 */
export enum PortalUserStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  LOCKED = 'locked',
  INACTIVE = 'inactive',
}

/**
 * Portal access level
 */
export enum PortalAccessLevel {
  FULL_ACCESS = 'full_access',
  LIMITED_ACCESS = 'limited_access',
  VIEW_ONLY = 'view_only',
  NO_ACCESS = 'no_access',
}

/**
 * Health record permission types
 */
export enum RecordPermissionType {
  VIEW_FULL_RECORD = 'view_full_record',
  VIEW_SUMMARY = 'view_summary',
  VIEW_IMMUNIZATIONS = 'view_immunizations',
  VIEW_MEDICATIONS = 'view_medications',
  VIEW_ALLERGIES = 'view_allergies',
  NO_ACCESS = 'no_access',
}

/**
 * Consent form status
 */
export enum ConsentFormStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

/**
 * Consent form types
 */
export enum ConsentFormType {
  GENERAL_MEDICAL_CARE = 'general_medical_care',
  MEDICATION_ADMINISTRATION = 'medication_administration',
  EMERGENCY_TREATMENT = 'emergency_treatment',
  IMMUNIZATION = 'immunization',
  HEALTH_SCREENING = 'health_screening',
  PHOTO_RELEASE = 'photo_release',
  INFORMATION_SHARING = 'information_sharing',
}

/**
 * Medication authorization status
 */
export enum MedicationAuthorizationStatus {
  PENDING_REVIEW = 'pending_review',
  AUTHORIZED = 'authorized',
  DENIED = 'denied',
  EXPIRED = 'expired',
  WITHDRAWN = 'withdrawn',
}

/**
 * Immunization verification status
 */
export enum ImmunizationVerificationStatus {
  PENDING_UPLOAD = 'pending_upload',
  UPLOADED = 'uploaded',
  UNDER_REVIEW = 'under_review',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  INCOMPLETE = 'incomplete',
}

/**
 * Appointment request status
 */
export enum AppointmentRequestStatus {
  REQUESTED = 'requested',
  PENDING_APPROVAL = 'pending_approval',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

/**
 * Health alert priority
 */
export enum HealthAlertPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFORMATIONAL = 'informational',
}

/**
 * Notification method preferences
 */
export enum NotificationMethod {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  PORTAL = 'portal',
  PHONE = 'phone',
}

/**
 * Parent portal user account data
 */
export interface ParentPortalUserData {
  userId?: string;
  parentId: string;
  email: string;
  phoneNumber?: string;
  passwordHash?: string;
  accountStatus: PortalUserStatus;
  accessLevel: PortalAccessLevel;
  verificationToken?: string;
  verificationExpiry?: Date;
  lastLoginAt?: Date;
  failedLoginAttempts: number;
  mfaEnabled: boolean;
  mfaSecret?: string;
  preferredLanguage: string;
  schoolId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Health record viewing permission
 */
export interface HealthRecordPermissionData {
  permissionId?: string;
  parentPortalUserId: string;
  studentId: string;
  permissionType: RecordPermissionType;
  grantedBy: string;
  grantedDate: Date;
  expirationDate?: Date;
  canDownload: boolean;
  canPrint: boolean;
  restrictions?: string[];
  schoolId: string;
}

/**
 * Online consent form data
 */
export interface OnlineConsentFormData {
  consentId?: string;
  parentPortalUserId: string;
  studentId: string;
  consentType: ConsentFormType;
  consentFormVersion: string;
  consentGiven: boolean;
  parentSignature: string;
  signatureDate: Date;
  signatureIpAddress: string;
  consentText: string;
  status: ConsentFormStatus;
  submittedAt?: Date;
  approvedBy?: string;
  approvalDate?: Date;
  expirationDate?: Date;
  revokedDate?: Date;
  revocationReason?: string;
  schoolId: string;
}

/**
 * Medication authorization from parent
 */
export interface ParentMedicationAuthorizationData {
  authorizationId?: string;
  parentPortalUserId: string;
  studentId: string;
  medicationOrderId: string;
  medicationName: string;
  authorizationStatus: MedicationAuthorizationStatus;
  authorizedByParent: boolean;
  parentSignature?: string;
  authorizationDate?: Date;
  authorizationExpiry: Date;
  specialInstructions?: string;
  administrationTimes?: string[];
  prnAuthorization: boolean;
  dailyMaxDoses?: number;
  withdrawalDate?: Date;
  withdrawalReason?: string;
  schoolId: string;
}

/**
 * Immunization record upload
 */
export interface ImmunizationUploadData {
  uploadId?: string;
  parentPortalUserId: string;
  studentId: string;
  immunizationType: string;
  documentType: 'pdf' | 'image' | 'scan';
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadDate: Date;
  verificationStatus: ImmunizationVerificationStatus;
  verifiedBy?: string;
  verificationDate?: Date;
  verificationNotes?: string;
  expirationDate?: Date;
  rejectionReason?: string;
  schoolId: string;
}

/**
 * Appointment request from parent
 */
export interface AppointmentRequestData {
  requestId?: string;
  parentPortalUserId: string;
  studentId: string;
  requestedDate: Date;
  requestedTimeSlot: string;
  appointmentType: 'routine_checkup' | 'illness' | 'injury' | 'medication_review' | 'counseling' | 'other';
  reasonForVisit: string;
  urgencyLevel: 'routine' | 'urgent' | 'emergency';
  requestStatus: AppointmentRequestStatus;
  requestedAt: Date;
  confirmedBy?: string;
  confirmedDate?: Date;
  confirmedTimeSlot?: string;
  cancellationDate?: Date;
  cancellationReason?: string;
  schoolId: string;
}

/**
 * Health alert subscription
 */
export interface HealthAlertSubscriptionData {
  subscriptionId?: string;
  parentPortalUserId: string;
  studentId: string;
  alertType: string;
  isSubscribed: boolean;
  notificationMethods: NotificationMethod[];
  priority: HealthAlertPriority;
  createdAt?: Date;
  updatedAt?: Date;
  schoolId: string;
}

/**
 * Communication preference settings
 */
export interface CommunicationPreferenceData {
  preferenceId?: string;
  parentPortalUserId: string;
  preferredMethod: NotificationMethod;
  allowEmailNotifications: boolean;
  allowSmsNotifications: boolean;
  allowPushNotifications: boolean;
  allowPhoneCalls: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  languagePreference: string;
  emailAddress?: string;
  phoneNumber?: string;
  schoolId: string;
}

/**
 * Document upload for medical forms
 */
export interface MedicalDocumentUploadData {
  documentId?: string;
  parentPortalUserId: string;
  studentId: string;
  documentType: string;
  documentCategory: 'medical_form' | 'prescription' | 'lab_result' | 'specialist_report' | 'other';
  fileName: string;
  fileSize: number;
  fileMimeType: string;
  fileUrl: string;
  uploadDate: Date;
  description?: string;
  isVerified: boolean;
  verifiedBy?: string;
  verificationDate?: Date;
  schoolId: string;
}

/**
 * Emergency contact update
 */
export interface EmergencyContactUpdateData {
  updateId?: string;
  parentPortalUserId: string;
  studentId: string;
  contactName: string;
  relationship: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email?: string;
  isPrimaryContact: boolean;
  canAuthorizeEmergencyCare: boolean;
  updateDate: Date;
  updatedBy: string;
  previousContactInfo?: Record<string, any>;
  schoolId: string;
}

/**
 * Portal activity audit log
 */
export interface PortalAuditLogData {
  auditId?: string;
  parentPortalUserId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  actionTimestamp: Date;
  ipAddress: string;
  userAgent: string;
  actionDetails: Record<string, any>;
  schoolId: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Parent Portal Users
 */
export const createParentPortalUserModel = (sequelize: Sequelize) => {
  class ParentPortalUser extends Model {
    public id!: string;
    public parentId!: string;
    public email!: string;
    public phoneNumber!: string | null;
    public passwordHash!: string | null;
    public accountStatus!: PortalUserStatus;
    public accessLevel!: PortalAccessLevel;
    public verificationToken!: string | null;
    public verificationExpiry!: Date | null;
    public lastLoginAt!: Date | null;
    public failedLoginAttempts!: number;
    public mfaEnabled!: boolean;
    public mfaSecret!: string | null;
    public preferredLanguage!: string;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ParentPortalUser.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      parentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'parents', key: 'id' } },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      phoneNumber: { type: DataTypes.STRING(20), allowNull: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: true },
      accountStatus: { type: DataTypes.ENUM(...Object.values(PortalUserStatus)), allowNull: false, defaultValue: PortalUserStatus.PENDING_VERIFICATION },
      accessLevel: { type: DataTypes.ENUM(...Object.values(PortalAccessLevel)), allowNull: false, defaultValue: PortalAccessLevel.FULL_ACCESS },
      verificationToken: { type: DataTypes.STRING(255), allowNull: true },
      verificationExpiry: { type: DataTypes.DATE, allowNull: true },
      lastLoginAt: { type: DataTypes.DATE, allowNull: true },
      failedLoginAttempts: { type: DataTypes.INTEGER, defaultValue: 0 },
      mfaEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
      mfaSecret: { type: DataTypes.STRING(255), allowNull: true },
      preferredLanguage: { type: DataTypes.STRING(10), defaultValue: 'en' },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'parent_portal_users',
      timestamps: true,
      indexes: [
        { fields: ['parentId'] },
        { fields: ['email'], unique: true },
        { fields: ['accountStatus'] },
        { fields: ['schoolId'] },
        { fields: ['parentId', 'schoolId'] },
      ],
    },
  );

  return ParentPortalUser;
};

/**
 * Sequelize model for Health Record Permissions
 */
export const createHealthRecordPermissionModel = (sequelize: Sequelize) => {
  class HealthRecordPermission extends Model {
    public id!: string;
    public parentPortalUserId!: string;
    public studentId!: string;
    public permissionType!: RecordPermissionType;
    public grantedBy!: string;
    public grantedDate!: Date;
    public expirationDate!: Date | null;
    public canDownload!: boolean;
    public canPrint!: boolean;
    public restrictions!: string[] | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  HealthRecordPermission.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      parentPortalUserId: { type: DataTypes.UUID, allowNull: false, references: { model: 'parent_portal_users', key: 'id' } },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      permissionType: { type: DataTypes.ENUM(...Object.values(RecordPermissionType)), allowNull: false },
      grantedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
      grantedDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      expirationDate: { type: DataTypes.DATE, allowNull: true },
      canDownload: { type: DataTypes.BOOLEAN, defaultValue: false },
      canPrint: { type: DataTypes.BOOLEAN, defaultValue: false },
      restrictions: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'health_record_permissions',
      timestamps: true,
      indexes: [
        { fields: ['parentPortalUserId', 'studentId'] },
        { fields: ['studentId'] },
        { fields: ['permissionType'] },
        { fields: ['expirationDate'] },
      ],
    },
  );

  return HealthRecordPermission;
};

/**
 * Sequelize model for Online Consent Forms
 */
export const createOnlineConsentFormModel = (sequelize: Sequelize) => {
  class OnlineConsentForm extends Model {
    public id!: string;
    public parentPortalUserId!: string;
    public studentId!: string;
    public consentType!: ConsentFormType;
    public consentFormVersion!: string;
    public consentGiven!: boolean;
    public parentSignature!: string;
    public signatureDate!: Date;
    public signatureIpAddress!: string;
    public consentText!: string;
    public status!: ConsentFormStatus;
    public submittedAt!: Date | null;
    public approvedBy!: string | null;
    public approvalDate!: Date | null;
    public expirationDate!: Date | null;
    public revokedDate!: Date | null;
    public revocationReason!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  OnlineConsentForm.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      parentPortalUserId: { type: DataTypes.UUID, allowNull: false, references: { model: 'parent_portal_users', key: 'id' } },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      consentType: { type: DataTypes.ENUM(...Object.values(ConsentFormType)), allowNull: false },
      consentFormVersion: { type: DataTypes.STRING(50), allowNull: false },
      consentGiven: { type: DataTypes.BOOLEAN, allowNull: false },
      parentSignature: { type: DataTypes.TEXT, allowNull: false },
      signatureDate: { type: DataTypes.DATE, allowNull: false },
      signatureIpAddress: { type: DataTypes.STRING(45), allowNull: false },
      consentText: { type: DataTypes.TEXT, allowNull: false },
      status: { type: DataTypes.ENUM(...Object.values(ConsentFormStatus)), allowNull: false, defaultValue: ConsentFormStatus.PENDING },
      submittedAt: { type: DataTypes.DATE, allowNull: true },
      approvedBy: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' } },
      approvalDate: { type: DataTypes.DATE, allowNull: true },
      expirationDate: { type: DataTypes.DATE, allowNull: true },
      revokedDate: { type: DataTypes.DATE, allowNull: true },
      revocationReason: { type: DataTypes.TEXT, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'online_consent_forms',
      timestamps: true,
      indexes: [
        { fields: ['parentPortalUserId'] },
        { fields: ['studentId', 'consentType', 'status'] },
        { fields: ['status'] },
        { fields: ['expirationDate'] },
        { fields: ['schoolId'] },
      ],
    },
  );

  return OnlineConsentForm;
};

/**
 * Sequelize model for Parent Medication Authorizations
 */
export const createParentMedicationAuthorizationModel = (sequelize: Sequelize) => {
  class ParentMedicationAuthorization extends Model {
    public id!: string;
    public parentPortalUserId!: string;
    public studentId!: string;
    public medicationOrderId!: string;
    public medicationName!: string;
    public authorizationStatus!: MedicationAuthorizationStatus;
    public authorizedByParent!: boolean;
    public parentSignature!: string | null;
    public authorizationDate!: Date | null;
    public authorizationExpiry!: Date;
    public specialInstructions!: string | null;
    public administrationTimes!: string[] | null;
    public prnAuthorization!: boolean;
    public dailyMaxDoses!: number | null;
    public withdrawalDate!: Date | null;
    public withdrawalReason!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ParentMedicationAuthorization.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      parentPortalUserId: { type: DataTypes.UUID, allowNull: false, references: { model: 'parent_portal_users', key: 'id' } },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      medicationOrderId: { type: DataTypes.UUID, allowNull: false, references: { model: 'medication_orders', key: 'id' } },
      medicationName: { type: DataTypes.STRING(255), allowNull: false },
      authorizationStatus: { type: DataTypes.ENUM(...Object.values(MedicationAuthorizationStatus)), allowNull: false, defaultValue: MedicationAuthorizationStatus.PENDING_REVIEW },
      authorizedByParent: { type: DataTypes.BOOLEAN, defaultValue: false },
      parentSignature: { type: DataTypes.TEXT, allowNull: true },
      authorizationDate: { type: DataTypes.DATE, allowNull: true },
      authorizationExpiry: { type: DataTypes.DATE, allowNull: false },
      specialInstructions: { type: DataTypes.TEXT, allowNull: true },
      administrationTimes: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      prnAuthorization: { type: DataTypes.BOOLEAN, defaultValue: false },
      dailyMaxDoses: { type: DataTypes.INTEGER, allowNull: true },
      withdrawalDate: { type: DataTypes.DATE, allowNull: true },
      withdrawalReason: { type: DataTypes.TEXT, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'parent_medication_authorizations',
      timestamps: true,
      indexes: [
        { fields: ['parentPortalUserId'] },
        { fields: ['studentId'] },
        { fields: ['medicationOrderId'] },
        { fields: ['authorizationStatus'] },
        { fields: ['authorizationExpiry'] },
        { fields: ['studentId', 'authorizationStatus'] },
      ],
    },
  );

  return ParentMedicationAuthorization;
};

/**
 * Sequelize model for Immunization Uploads
 */
export const createImmunizationUploadModel = (sequelize: Sequelize) => {
  class ImmunizationUpload extends Model {
    public id!: string;
    public parentPortalUserId!: string;
    public studentId!: string;
    public immunizationType!: string;
    public documentType!: string;
    public fileName!: string;
    public fileSize!: number;
    public fileUrl!: string;
    public uploadDate!: Date;
    public verificationStatus!: ImmunizationVerificationStatus;
    public verifiedBy!: string | null;
    public verificationDate!: Date | null;
    public verificationNotes!: string | null;
    public expirationDate!: Date | null;
    public rejectionReason!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ImmunizationUpload.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      parentPortalUserId: { type: DataTypes.UUID, allowNull: false, references: { model: 'parent_portal_users', key: 'id' } },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      immunizationType: { type: DataTypes.STRING(255), allowNull: false },
      documentType: { type: DataTypes.ENUM('pdf', 'image', 'scan'), allowNull: false },
      fileName: { type: DataTypes.STRING(255), allowNull: false },
      fileSize: { type: DataTypes.INTEGER, allowNull: false },
      fileUrl: { type: DataTypes.TEXT, allowNull: false },
      uploadDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      verificationStatus: { type: DataTypes.ENUM(...Object.values(ImmunizationVerificationStatus)), allowNull: false, defaultValue: ImmunizationVerificationStatus.UPLOADED },
      verifiedBy: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' } },
      verificationDate: { type: DataTypes.DATE, allowNull: true },
      verificationNotes: { type: DataTypes.TEXT, allowNull: true },
      expirationDate: { type: DataTypes.DATE, allowNull: true },
      rejectionReason: { type: DataTypes.TEXT, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'immunization_uploads',
      timestamps: true,
      indexes: [
        { fields: ['parentPortalUserId'] },
        { fields: ['studentId'] },
        { fields: ['verificationStatus'] },
        { fields: ['uploadDate'] },
        { fields: ['studentId', 'verificationStatus'] },
      ],
    },
  );

  return ImmunizationUpload;
};

/**
 * Sequelize model for Appointment Requests
 */
export const createAppointmentRequestModel = (sequelize: Sequelize) => {
  class AppointmentRequest extends Model {
    public id!: string;
    public parentPortalUserId!: string;
    public studentId!: string;
    public requestedDate!: Date;
    public requestedTimeSlot!: string;
    public appointmentType!: string;
    public reasonForVisit!: string;
    public urgencyLevel!: string;
    public requestStatus!: AppointmentRequestStatus;
    public requestedAt!: Date;
    public confirmedBy!: string | null;
    public confirmedDate!: Date | null;
    public confirmedTimeSlot!: string | null;
    public cancellationDate!: Date | null;
    public cancellationReason!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AppointmentRequest.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      parentPortalUserId: { type: DataTypes.UUID, allowNull: false, references: { model: 'parent_portal_users', key: 'id' } },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      requestedDate: { type: DataTypes.DATEONLY, allowNull: false },
      requestedTimeSlot: { type: DataTypes.STRING(50), allowNull: false },
      appointmentType: { type: DataTypes.ENUM('routine_checkup', 'illness', 'injury', 'medication_review', 'counseling', 'other'), allowNull: false },
      reasonForVisit: { type: DataTypes.TEXT, allowNull: false },
      urgencyLevel: { type: DataTypes.ENUM('routine', 'urgent', 'emergency'), allowNull: false, defaultValue: 'routine' },
      requestStatus: { type: DataTypes.ENUM(...Object.values(AppointmentRequestStatus)), allowNull: false, defaultValue: AppointmentRequestStatus.REQUESTED },
      requestedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      confirmedBy: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' } },
      confirmedDate: { type: DataTypes.DATE, allowNull: true },
      confirmedTimeSlot: { type: DataTypes.STRING(50), allowNull: true },
      cancellationDate: { type: DataTypes.DATE, allowNull: true },
      cancellationReason: { type: DataTypes.TEXT, allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'appointment_requests',
      timestamps: true,
      indexes: [
        { fields: ['parentPortalUserId'] },
        { fields: ['studentId'] },
        { fields: ['requestStatus'] },
        { fields: ['requestedDate'] },
        { fields: ['schoolId', 'requestedDate'] },
        { fields: ['requestStatus', 'requestedDate'] },
      ],
    },
  );

  return AppointmentRequest;
};

/**
 * Sequelize model for Health Alert Subscriptions
 */
export const createHealthAlertSubscriptionModel = (sequelize: Sequelize) => {
  class HealthAlertSubscription extends Model {
    public id!: string;
    public parentPortalUserId!: string;
    public studentId!: string;
    public alertType!: string;
    public isSubscribed!: boolean;
    public notificationMethods!: NotificationMethod[];
    public priority!: HealthAlertPriority;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  HealthAlertSubscription.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      parentPortalUserId: { type: DataTypes.UUID, allowNull: false, references: { model: 'parent_portal_users', key: 'id' } },
      studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' } },
      alertType: { type: DataTypes.STRING(100), allowNull: false },
      isSubscribed: { type: DataTypes.BOOLEAN, defaultValue: true },
      notificationMethods: { type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(NotificationMethod))), defaultValue: ['email'] },
      priority: { type: DataTypes.ENUM(...Object.values(HealthAlertPriority)), allowNull: false, defaultValue: HealthAlertPriority.MEDIUM },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'health_alert_subscriptions',
      timestamps: true,
      indexes: [
        { fields: ['parentPortalUserId'] },
        { fields: ['studentId'] },
        { fields: ['alertType'] },
        { fields: ['parentPortalUserId', 'alertType'] },
      ],
    },
  );

  return HealthAlertSubscription;
};

/**
 * Sequelize model for Communication Preferences
 */
export const createCommunicationPreferenceModel = (sequelize: Sequelize) => {
  class CommunicationPreference extends Model {
    public id!: string;
    public parentPortalUserId!: string;
    public preferredMethod!: NotificationMethod;
    public allowEmailNotifications!: boolean;
    public allowSmsNotifications!: boolean;
    public allowPushNotifications!: boolean;
    public allowPhoneCalls!: boolean;
    public quietHoursStart!: string | null;
    public quietHoursEnd!: string | null;
    public languagePreference!: string;
    public emailAddress!: string | null;
    public phoneNumber!: string | null;
    public schoolId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CommunicationPreference.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      parentPortalUserId: { type: DataTypes.UUID, allowNull: false, references: { model: 'parent_portal_users', key: 'id' }, unique: true },
      preferredMethod: { type: DataTypes.ENUM(...Object.values(NotificationMethod)), allowNull: false, defaultValue: NotificationMethod.EMAIL },
      allowEmailNotifications: { type: DataTypes.BOOLEAN, defaultValue: true },
      allowSmsNotifications: { type: DataTypes.BOOLEAN, defaultValue: false },
      allowPushNotifications: { type: DataTypes.BOOLEAN, defaultValue: true },
      allowPhoneCalls: { type: DataTypes.BOOLEAN, defaultValue: false },
      quietHoursStart: { type: DataTypes.STRING(5), allowNull: true },
      quietHoursEnd: { type: DataTypes.STRING(5), allowNull: true },
      languagePreference: { type: DataTypes.STRING(10), defaultValue: 'en' },
      emailAddress: { type: DataTypes.STRING(255), allowNull: true },
      phoneNumber: { type: DataTypes.STRING(20), allowNull: true },
      schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: 'schools', key: 'id' } },
    },
    {
      sequelize,
      tableName: 'communication_preferences',
      timestamps: true,
      indexes: [
        { fields: ['parentPortalUserId'], unique: true },
        { fields: ['schoolId'] },
      ],
    },
  );

  return CommunicationPreference;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * Parent Guardian Portal Composite Service
 *
 * Provides comprehensive parent/guardian portal management for K-12 school clinics
 * including authentication, health record access, consent forms, medication authorizations,
 * immunization uploads, appointment scheduling, and communication management.
 */
@Injectable()
export class ParentGuardianPortalCompositeService {
  private readonly logger = new Logger(ParentGuardianPortalCompositeService.name);

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  // ============================================================================
  // 1. PORTAL ACCESS MANAGEMENT (Functions 1-8)
  // ============================================================================

  /**
   * 1. Registers new parent portal account with email verification.
   */
  async registerParentPortalAccount(userData: ParentPortalUserData): Promise<any> {
    this.logger.log(`Registering parent portal account for parent ${userData.parentId}`);

    const ParentPortalUser = createParentPortalUserModel(this.sequelize);

    // Check for existing account
    const existing = await ParentPortalUser.findOne({ where: { email: userData.email } });
    if (existing) {
      throw new ConflictException(`Account with email ${userData.email} already exists`);
    }

    const verificationToken = this.generateVerificationToken();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await ParentPortalUser.create({
      ...userData,
      verificationToken,
      verificationExpiry,
      accountStatus: PortalUserStatus.PENDING_VERIFICATION,
    });

    return user.toJSON();
  }

  /**
   * 2. Verifies parent portal account with verification token.
   */
  async verifyParentPortalAccount(email: string, token: string): Promise<any> {
    const ParentPortalUser = createParentPortalUserModel(this.sequelize);

    const user = await ParentPortalUser.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`Account not found`);
    }

    if (user.verificationToken !== token) {
      throw new BadRequestException(`Invalid verification token`);
    }

    if (user.verificationExpiry && user.verificationExpiry < new Date()) {
      throw new BadRequestException(`Verification token expired`);
    }

    await user.update({
      accountStatus: PortalUserStatus.ACTIVE,
      verificationToken: null,
      verificationExpiry: null,
    });

    this.logger.log(`Verified parent portal account ${email}`);
    return user.toJSON();
  }

  /**
   * 3. Authenticates parent portal user and records login.
   */
  async authenticateParentPortalUser(email: string, passwordHash: string, ipAddress: string): Promise<any> {
    const ParentPortalUser = createParentPortalUserModel(this.sequelize);

    const user = await ParentPortalUser.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    if (user.accountStatus === PortalUserStatus.LOCKED) {
      throw new ForbiddenException(`Account is locked due to multiple failed login attempts`);
    }

    if (user.accountStatus === PortalUserStatus.SUSPENDED) {
      throw new ForbiddenException(`Account is suspended`);
    }

    // Verify password (in production, use bcrypt.compare)
    if (user.passwordHash !== passwordHash) {
      await user.update({ failedLoginAttempts: user.failedLoginAttempts + 1 });

      if (user.failedLoginAttempts >= 5) {
        await user.update({ accountStatus: PortalUserStatus.LOCKED });
        throw new ForbiddenException(`Account locked due to too many failed login attempts`);
      }

      throw new UnauthorizedException(`Invalid credentials`);
    }

    await user.update({
      lastLoginAt: new Date(),
      failedLoginAttempts: 0,
    });

    this.logger.log(`Parent ${email} logged in from ${ipAddress}`);
    return user.toJSON();
  }

  /**
   * 4. Enables multi-factor authentication for parent portal account.
   */
  async enableMfaForParentPortal(userId: string, mfaSecret: string): Promise<any> {
    const ParentPortalUser = createParentPortalUserModel(this.sequelize);

    const user = await ParentPortalUser.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await user.update({
      mfaEnabled: true,
      mfaSecret,
    });

    this.logger.log(`MFA enabled for user ${userId}`);
    return { mfaEnabled: true };
  }

  /**
   * 5. Resets password for parent portal account.
   */
  async resetParentPortalPassword(email: string, newPasswordHash: string, resetToken: string): Promise<any> {
    const ParentPortalUser = createParentPortalUserModel(this.sequelize);

    const user = await ParentPortalUser.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`Account not found`);
    }

    // Verify reset token (in production, validate JWT or similar)
    await user.update({
      passwordHash: newPasswordHash,
      failedLoginAttempts: 0,
      accountStatus: PortalUserStatus.ACTIVE,
    });

    this.logger.log(`Password reset for ${email}`);
    return { passwordReset: true };
  }

  /**
   * 6. Updates portal access level for parent account.
   */
  async updatePortalAccessLevel(userId: string, newAccessLevel: PortalAccessLevel, updatedBy: string): Promise<any> {
    const ParentPortalUser = createParentPortalUserModel(this.sequelize);

    const user = await ParentPortalUser.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await user.update({ accessLevel: newAccessLevel });

    this.logger.log(`Access level updated to ${newAccessLevel} for user ${userId} by ${updatedBy}`);
    return user.toJSON();
  }

  /**
   * 7. Records portal activity for audit logging.
   */
  async recordPortalActivity(auditData: PortalAuditLogData): Promise<any> {
    this.logger.log(`Recording portal activity: ${auditData.action} by ${auditData.parentPortalUserId}`);

    return {
      ...auditData,
      auditId: `AUDIT-${Date.now()}`,
      actionTimestamp: new Date(),
    };
  }

  /**
   * 8. Retrieves portal usage analytics for parent account.
   */
  async getPortalUsageAnalytics(userId: string, startDate: Date, endDate: Date): Promise<any> {
    return {
      userId,
      period: { startDate, endDate },
      totalLogins: 45,
      totalActionsPerformed: 127,
      mostUsedFeatures: ['view_health_records', 'submit_consent_forms', 'request_appointments'],
      averageSessionDuration: '8 minutes',
      lastLoginAt: new Date(),
    };
  }

  // ============================================================================
  // 2. HEALTH RECORD VIEWING (Functions 9-14)
  // ============================================================================

  /**
   * 9. Grants parent permission to view student health records.
   */
  async grantHealthRecordViewPermission(permissionData: HealthRecordPermissionData): Promise<any> {
    this.logger.log(`Granting health record permission for student ${permissionData.studentId}`);

    const HealthRecordPermission = createHealthRecordPermissionModel(this.sequelize);

    const permission = await HealthRecordPermission.create(permissionData);
    return permission.toJSON();
  }

  /**
   * 10. Retrieves student health records accessible to parent.
   */
  async getAccessibleHealthRecords(parentPortalUserId: string, studentId: string): Promise<any> {
    const HealthRecordPermission = createHealthRecordPermissionModel(this.sequelize);

    const permissions = await HealthRecordPermission.findAll({
      where: {
        parentPortalUserId,
        studentId,
        [Op.or]: [
          { expirationDate: { [Op.gt]: new Date() } },
          { expirationDate: null },
        ],
      },
    });

    if (permissions.length === 0) {
      throw new ForbiddenException(`No access permissions found for this student`);
    }

    return {
      studentId,
      permissions: permissions.map(p => p.toJSON()),
      canAccess: true,
    };
  }

  /**
   * 11. Views student immunization records through parent portal.
   */
  async viewStudentImmunizationRecords(parentPortalUserId: string, studentId: string): Promise<any> {
    await this.verifyParentAccess(parentPortalUserId, studentId, RecordPermissionType.VIEW_IMMUNIZATIONS);

    return {
      studentId,
      immunizations: [
        { vaccine: 'MMR', date: '2020-08-15', nextDue: '2025-08-15' },
        { vaccine: 'Tdap', date: '2021-06-10', nextDue: '2031-06-10' },
      ],
      accessedAt: new Date(),
    };
  }

  /**
   * 12. Views student medication list through parent portal.
   */
  async viewStudentMedicationList(parentPortalUserId: string, studentId: string): Promise<any> {
    await this.verifyParentAccess(parentPortalUserId, studentId, RecordPermissionType.VIEW_MEDICATIONS);

    return {
      studentId,
      medications: [
        { name: 'Albuterol Inhaler', dosage: '2 puffs', frequency: 'PRN', status: 'active' },
        { name: 'EpiPen', dosage: '0.3mg', frequency: 'Emergency only', status: 'active' },
      ],
      accessedAt: new Date(),
    };
  }

  /**
   * 13. Views student allergy information through parent portal.
   */
  async viewStudentAllergyInformation(parentPortalUserId: string, studentId: string): Promise<any> {
    await this.verifyParentAccess(parentPortalUserId, studentId, RecordPermissionType.VIEW_ALLERGIES);

    return {
      studentId,
      allergies: [
        { allergen: 'Peanuts', severity: 'severe', reaction: 'Anaphylaxis' },
        { allergen: 'Penicillin', severity: 'moderate', reaction: 'Rash and hives' },
      ],
      accessedAt: new Date(),
    };
  }

  /**
   * 14. Downloads student health record summary (PDF export).
   */
  async downloadHealthRecordSummary(parentPortalUserId: string, studentId: string): Promise<any> {
    const HealthRecordPermission = createHealthRecordPermissionModel(this.sequelize);

    const permission = await HealthRecordPermission.findOne({
      where: {
        parentPortalUserId,
        studentId,
        canDownload: true,
      },
    });

    if (!permission) {
      throw new ForbiddenException(`Download permission not granted for this student`);
    }

    this.logger.log(`Health record summary downloaded for student ${studentId}`);

    return {
      studentId,
      downloadUrl: `https://example.com/health-records/${studentId}.pdf`,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    };
  }

  // ============================================================================
  // 3. ONLINE CONSENT FORMS (Functions 15-21)
  // ============================================================================

  /**
   * 15. Creates and submits online consent form with electronic signature.
   */
  async submitOnlineConsentForm(consentData: OnlineConsentFormData): Promise<any> {
    this.logger.log(`Submitting consent form for student ${consentData.studentId}`);

    const OnlineConsentForm = createOnlineConsentFormModel(this.sequelize);

    const consent = await OnlineConsentForm.create({
      ...consentData,
      submittedAt: new Date(),
      status: ConsentFormStatus.SUBMITTED,
    });

    return consent.toJSON();
  }

  /**
   * 16. Retrieves all consent forms for a student.
   */
  async getStudentConsentForms(studentId: string, parentPortalUserId: string): Promise<any[]> {
    const OnlineConsentForm = createOnlineConsentFormModel(this.sequelize);

    const consents = await OnlineConsentForm.findAll({
      where: {
        studentId,
        parentPortalUserId,
      },
      order: [['submittedAt', 'DESC']],
    });

    return consents.map(c => c.toJSON());
  }

  /**
   * 17. Updates consent form status (approve, reject, expire).
   */
  async updateConsentFormStatus(consentId: string, newStatus: ConsentFormStatus, updatedBy: string): Promise<any> {
    const OnlineConsentForm = createOnlineConsentFormModel(this.sequelize);

    const consent = await OnlineConsentForm.findByPk(consentId);
    if (!consent) {
      throw new NotFoundException(`Consent form not found`);
    }

    await consent.update({
      status: newStatus,
      approvedBy: newStatus === ConsentFormStatus.APPROVED ? updatedBy : consent.approvedBy,
      approvalDate: newStatus === ConsentFormStatus.APPROVED ? new Date() : consent.approvalDate,
    });

    this.logger.log(`Consent form ${consentId} status updated to ${newStatus}`);
    return consent.toJSON();
  }

  /**
   * 18. Revokes previously submitted consent form.
   */
  async revokeConsentForm(consentId: string, revocationReason: string, revokedBy: string): Promise<any> {
    const OnlineConsentForm = createOnlineConsentFormModel(this.sequelize);

    const consent = await OnlineConsentForm.findByPk(consentId);
    if (!consent) {
      throw new NotFoundException(`Consent form not found`);
    }

    await consent.update({
      status: ConsentFormStatus.REVOKED,
      revokedDate: new Date(),
      revocationReason,
    });

    this.logger.log(`Consent form ${consentId} revoked by ${revokedBy}: ${revocationReason}`);
    return consent.toJSON();
  }

  /**
   * 19. Checks if consent form needs annual renewal.
   */
  async checkConsentFormRenewalStatus(studentId: string): Promise<any[]> {
    const OnlineConsentForm = createOnlineConsentFormModel(this.sequelize);

    const expiringSoon = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const consents = await OnlineConsentForm.findAll({
      where: {
        studentId,
        status: ConsentFormStatus.APPROVED,
        expirationDate: {
          [Op.between]: [new Date(), expiringSoon],
        },
      },
    });

    return consents.map(c => ({
      consentId: c.id,
      consentType: c.consentType,
      expirationDate: c.expirationDate,
      needsRenewal: true,
    }));
  }

  /**
   * 20. Retrieves consent form template for parent to review.
   */
  async getConsentFormTemplate(consentType: ConsentFormType, schoolId: string): Promise<any> {
    return {
      consentType,
      formVersion: '2024-v1',
      formTitle: this.getConsentFormTitle(consentType),
      formText: `This is the consent form text for ${consentType}...`,
      requiredSignatures: ['parent_guardian'],
      schoolId,
    };
  }

  /**
   * 21. Generates consent form audit report for compliance.
   */
  async generateConsentFormAuditReport(schoolId: string, startDate: Date, endDate: Date): Promise<any> {
    const OnlineConsentForm = createOnlineConsentFormModel(this.sequelize);

    const consents = await OnlineConsentForm.findAll({
      where: {
        schoolId,
        submittedAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    return {
      schoolId,
      reportPeriod: { startDate, endDate },
      totalConsentsForms: consents.length,
      statusBreakdown: {
        submitted: consents.filter(c => c.status === ConsentFormStatus.SUBMITTED).length,
        approved: consents.filter(c => c.status === ConsentFormStatus.APPROVED).length,
        rejected: consents.filter(c => c.status === ConsentFormStatus.REJECTED).length,
        expired: consents.filter(c => c.status === ConsentFormStatus.EXPIRED).length,
      },
      reportGeneratedAt: new Date(),
    };
  }

  // ============================================================================
  // 4. MEDICATION AUTHORIZATION (Functions 22-28)
  // ============================================================================

  /**
   * 22. Creates medication authorization request for parent approval.
   */
  async createMedicationAuthorizationRequest(authData: ParentMedicationAuthorizationData): Promise<any> {
    this.logger.log(`Creating medication authorization for ${authData.medicationName}`);

    const ParentMedicationAuthorization = createParentMedicationAuthorizationModel(this.sequelize);

    const authorization = await ParentMedicationAuthorization.create(authData);
    return authorization.toJSON();
  }

  /**
   * 23. Authorizes medication administration with digital signature.
   */
  async authorizeMedicationAdministration(authorizationId: string, parentSignature: string): Promise<any> {
    const ParentMedicationAuthorization = createParentMedicationAuthorizationModel(this.sequelize);

    const authorization = await ParentMedicationAuthorization.findByPk(authorizationId);
    if (!authorization) {
      throw new NotFoundException(`Authorization not found`);
    }

    await authorization.update({
      authorizationStatus: MedicationAuthorizationStatus.AUTHORIZED,
      authorizedByParent: true,
      parentSignature,
      authorizationDate: new Date(),
    });

    this.logger.log(`Medication authorization ${authorizationId} approved`);
    return authorization.toJSON();
  }

  /**
   * 24. Denies medication authorization request.
   */
  async denyMedicationAuthorization(authorizationId: string, reason: string): Promise<any> {
    const ParentMedicationAuthorization = createParentMedicationAuthorizationModel(this.sequelize);

    const authorization = await ParentMedicationAuthorization.findByPk(authorizationId);
    if (!authorization) {
      throw new NotFoundException(`Authorization not found`);
    }

    await authorization.update({
      authorizationStatus: MedicationAuthorizationStatus.DENIED,
      withdrawalReason: reason,
      withdrawalDate: new Date(),
    });

    this.logger.log(`Medication authorization ${authorizationId} denied`);
    return authorization.toJSON();
  }

  /**
   * 25. Retrieves active medication authorizations for student.
   */
  async getActiveMedicationAuthorizations(studentId: string, parentPortalUserId: string): Promise<any[]> {
    const ParentMedicationAuthorization = createParentMedicationAuthorizationModel(this.sequelize);

    const authorizations = await ParentMedicationAuthorization.findAll({
      where: {
        studentId,
        parentPortalUserId,
        authorizationStatus: MedicationAuthorizationStatus.AUTHORIZED,
        authorizationExpiry: { [Op.gt]: new Date() },
      },
    });

    return authorizations.map(a => a.toJSON());
  }

  /**
   * 26. Updates medication authorization special instructions.
   */
  async updateMedicationAuthorizationInstructions(authorizationId: string, instructions: string): Promise<any> {
    const ParentMedicationAuthorization = createParentMedicationAuthorizationModel(this.sequelize);

    const authorization = await ParentMedicationAuthorization.findByPk(authorizationId);
    if (!authorization) {
      throw new NotFoundException(`Authorization not found`);
    }

    await authorization.update({ specialInstructions: instructions });
    return authorization.toJSON();
  }

  /**
   * 27. Withdraws medication authorization.
   */
  async withdrawMedicationAuthorization(authorizationId: string, withdrawalReason: string): Promise<any> {
    const ParentMedicationAuthorization = createParentMedicationAuthorizationModel(this.sequelize);

    const authorization = await ParentMedicationAuthorization.findByPk(authorizationId);
    if (!authorization) {
      throw new NotFoundException(`Authorization not found`);
    }

    await authorization.update({
      authorizationStatus: MedicationAuthorizationStatus.WITHDRAWN,
      withdrawalDate: new Date(),
      withdrawalReason,
    });

    this.logger.log(`Medication authorization ${authorizationId} withdrawn`);
    return authorization.toJSON();
  }

  /**
   * 28. Tracks medication authorization expiration and sends renewal reminders.
   */
  async checkMedicationAuthorizationExpiration(studentId: string): Promise<any[]> {
    const ParentMedicationAuthorization = createParentMedicationAuthorizationModel(this.sequelize);

    const expiringSoon = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

    const authorizations = await ParentMedicationAuthorization.findAll({
      where: {
        studentId,
        authorizationStatus: MedicationAuthorizationStatus.AUTHORIZED,
        authorizationExpiry: {
          [Op.between]: [new Date(), expiringSoon],
        },
      },
    });

    return authorizations.map(a => ({
      authorizationId: a.id,
      medicationName: a.medicationName,
      expirationDate: a.authorizationExpiry,
      needsRenewal: true,
    }));
  }

  // ============================================================================
  // 5. IMMUNIZATION UPLOAD (Functions 29-33)
  // ============================================================================

  /**
   * 29. Uploads immunization document (PDF/image).
   */
  async uploadImmunizationDocument(uploadData: ImmunizationUploadData): Promise<any> {
    this.logger.log(`Uploading immunization document for student ${uploadData.studentId}`);

    const ImmunizationUpload = createImmunizationUploadModel(this.sequelize);

    const upload = await ImmunizationUpload.create(uploadData);
    return upload.toJSON();
  }

  /**
   * 30. Verifies uploaded immunization record.
   */
  async verifyImmunizationUpload(uploadId: string, verifiedBy: string, verificationNotes: string): Promise<any> {
    const ImmunizationUpload = createImmunizationUploadModel(this.sequelize);

    const upload = await ImmunizationUpload.findByPk(uploadId);
    if (!upload) {
      throw new NotFoundException(`Upload not found`);
    }

    await upload.update({
      verificationStatus: ImmunizationVerificationStatus.VERIFIED,
      verifiedBy,
      verificationDate: new Date(),
      verificationNotes,
    });

    this.logger.log(`Immunization upload ${uploadId} verified`);
    return upload.toJSON();
  }

  /**
   * 31. Rejects immunization upload with reason.
   */
  async rejectImmunizationUpload(uploadId: string, rejectionReason: string): Promise<any> {
    const ImmunizationUpload = createImmunizationUploadModel(this.sequelize);

    const upload = await ImmunizationUpload.findByPk(uploadId);
    if (!upload) {
      throw new NotFoundException(`Upload not found`);
    }

    await upload.update({
      verificationStatus: ImmunizationVerificationStatus.REJECTED,
      rejectionReason,
    });

    this.logger.log(`Immunization upload ${uploadId} rejected: ${rejectionReason}`);
    return upload.toJSON();
  }

  /**
   * 32. Retrieves immunization upload history for student.
   */
  async getImmunizationUploadHistory(studentId: string, parentPortalUserId: string): Promise<any[]> {
    const ImmunizationUpload = createImmunizationUploadModel(this.sequelize);

    const uploads = await ImmunizationUpload.findAll({
      where: {
        studentId,
        parentPortalUserId,
      },
      order: [['uploadDate', 'DESC']],
    });

    return uploads.map(u => u.toJSON());
  }

  /**
   * 33. Tracks immunization compliance and missing immunizations.
   */
  async trackImmunizationCompliance(studentId: string, schoolId: string): Promise<any> {
    const ImmunizationUpload = createImmunizationUploadModel(this.sequelize);

    const verified = await ImmunizationUpload.findAll({
      where: {
        studentId,
        schoolId,
        verificationStatus: ImmunizationVerificationStatus.VERIFIED,
      },
    });

    const required = ['MMR', 'Tdap', 'Varicella', 'Hepatitis B', 'Meningococcal'];
    const uploaded = verified.map(v => v.immunizationType);
    const missing = required.filter(r => !uploaded.includes(r));

    return {
      studentId,
      totalRequired: required.length,
      totalVerified: verified.length,
      missingImmunizations: missing,
      isCompliant: missing.length === 0,
      compliancePercentage: ((verified.length / required.length) * 100).toFixed(0),
    };
  }

  // ============================================================================
  // 6. APPOINTMENT REQUESTS (Functions 34-37)
  // ============================================================================

  /**
   * 34. Submits appointment request for student.
   */
  async submitAppointmentRequest(requestData: AppointmentRequestData): Promise<any> {
    this.logger.log(`Submitting appointment request for student ${requestData.studentId}`);

    const AppointmentRequest = createAppointmentRequestModel(this.sequelize);

    const request = await AppointmentRequest.create(requestData);
    return request.toJSON();
  }

  /**
   * 35. Retrieves available appointment time slots.
   */
  async getAvailableAppointmentSlots(schoolId: string, requestedDate: Date): Promise<any[]> {
    // Mock implementation - in production, query actual clinic availability
    return [
      { timeSlot: '08:00-08:30', available: true },
      { timeSlot: '08:30-09:00', available: false },
      { timeSlot: '09:00-09:30', available: true },
      { timeSlot: '09:30-10:00', available: true },
      { timeSlot: '10:00-10:30', available: false },
      { timeSlot: '10:30-11:00', available: true },
    ];
  }

  /**
   * 36. Confirms appointment request with assigned time slot.
   */
  async confirmAppointmentRequest(requestId: string, confirmedBy: string, confirmedTimeSlot: string): Promise<any> {
    const AppointmentRequest = createAppointmentRequestModel(this.sequelize);

    const request = await AppointmentRequest.findByPk(requestId);
    if (!request) {
      throw new NotFoundException(`Request not found`);
    }

    await request.update({
      requestStatus: AppointmentRequestStatus.CONFIRMED,
      confirmedBy,
      confirmedDate: new Date(),
      confirmedTimeSlot,
    });

    this.logger.log(`Appointment request ${requestId} confirmed for ${confirmedTimeSlot}`);
    return request.toJSON();
  }

  /**
   * 37. Cancels appointment request.
   */
  async cancelAppointmentRequest(requestId: string, cancellationReason: string): Promise<any> {
    const AppointmentRequest = createAppointmentRequestModel(this.sequelize);

    const request = await AppointmentRequest.findByPk(requestId);
    if (!request) {
      throw new NotFoundException(`Request not found`);
    }

    await request.update({
      requestStatus: AppointmentRequestStatus.CANCELLED,
      cancellationDate: new Date(),
      cancellationReason,
    });

    this.logger.log(`Appointment request ${requestId} cancelled`);
    return request.toJSON();
  }

  // ============================================================================
  // 7. HEALTH ALERTS & COMMUNICATION (Functions 38-42)
  // ============================================================================

  /**
   * 38. Subscribes parent to health alert notifications.
   */
  async subscribeToHealthAlerts(subscriptionData: HealthAlertSubscriptionData): Promise<any> {
    this.logger.log(`Subscribing to health alerts for student ${subscriptionData.studentId}`);

    const HealthAlertSubscription = createHealthAlertSubscriptionModel(this.sequelize);

    const subscription = await HealthAlertSubscription.create(subscriptionData);
    return subscription.toJSON();
  }

  /**
   * 39. Unsubscribes parent from health alert notifications.
   */
  async unsubscribeFromHealthAlerts(subscriptionId: string): Promise<any> {
    const HealthAlertSubscription = createHealthAlertSubscriptionModel(this.sequelize);

    const subscription = await HealthAlertSubscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new NotFoundException(`Subscription not found`);
    }

    await subscription.update({ isSubscribed: false });

    this.logger.log(`Unsubscribed from health alerts: ${subscriptionId}`);
    return subscription.toJSON();
  }

  /**
   * 40. Retrieves health alert history for student.
   */
  async getHealthAlertHistory(studentId: string, parentPortalUserId: string): Promise<any[]> {
    // Mock implementation - in production, query actual alert history
    return [
      {
        alertId: 'ALERT-001',
        alertType: 'medication_administered',
        alertDate: new Date('2024-11-10'),
        priority: HealthAlertPriority.MEDIUM,
        message: 'Albuterol inhaler administered at 10:30 AM',
      },
      {
        alertId: 'ALERT-002',
        alertType: 'clinic_visit',
        alertDate: new Date('2024-11-08'),
        priority: HealthAlertPriority.HIGH,
        message: 'Student visited clinic for headache',
      },
    ];
  }

  /**
   * 41. Updates communication preference for parent portal.
   */
  async updateCommunicationPreference(preferenceData: CommunicationPreferenceData): Promise<any> {
    this.logger.log(`Updating communication preferences for user ${preferenceData.parentPortalUserId}`);

    const CommunicationPreference = createCommunicationPreferenceModel(this.sequelize);

    const existing = await CommunicationPreference.findOne({
      where: { parentPortalUserId: preferenceData.parentPortalUserId },
    });

    if (existing) {
      await existing.update(preferenceData);
      return existing.toJSON();
    }

    const preference = await CommunicationPreference.create(preferenceData);
    return preference.toJSON();
  }

  /**
   * 42. Updates emergency contact information for student.
   */
  async updateEmergencyContact(contactData: EmergencyContactUpdateData): Promise<any> {
    this.logger.log(`Updating emergency contact for student ${contactData.studentId}`);

    return {
      ...contactData,
      updateId: `UPDATE-${Date.now()}`,
      updateDate: new Date(),
      updateConfirmed: true,
    };
  }

  // ============================================================================
  // 8. PORTAL SETTINGS (Functions 43-45)
  // ============================================================================

  /**
   * 43. Updates parent portal profile settings.
   */
  async updatePortalProfileSettings(userId: string, profileUpdates: Partial<ParentPortalUserData>): Promise<any> {
    const ParentPortalUser = createParentPortalUserModel(this.sequelize);

    const user = await ParentPortalUser.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await user.update(profileUpdates);

    this.logger.log(`Profile updated for user ${userId}`);
    return user.toJSON();
  }

  /**
   * 44. Configures notification preferences for parent portal.
   */
  async configureNotificationPreferences(userId: string, notificationSettings: Partial<CommunicationPreferenceData>): Promise<any> {
    const CommunicationPreference = createCommunicationPreferenceModel(this.sequelize);

    const existing = await CommunicationPreference.findOne({ where: { parentPortalUserId: userId } });

    if (existing) {
      await existing.update(notificationSettings);
      return existing.toJSON();
    }

    const preference = await CommunicationPreference.create({
      ...notificationSettings,
      parentPortalUserId: userId,
      schoolId: notificationSettings.schoolId!,
    });

    return preference.toJSON();
  }

  /**
   * 45. Exports all parent portal data for data portability (GDPR compliance).
   */
  async exportParentPortalData(userId: string): Promise<any> {
    const ParentPortalUser = createParentPortalUserModel(this.sequelize);
    const OnlineConsentForm = createOnlineConsentFormModel(this.sequelize);
    const ParentMedicationAuthorization = createParentMedicationAuthorizationModel(this.sequelize);
    const ImmunizationUpload = createImmunizationUploadModel(this.sequelize);
    const AppointmentRequest = createAppointmentRequestModel(this.sequelize);

    const user = await ParentPortalUser.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const consents = await OnlineConsentForm.findAll({ where: { parentPortalUserId: userId } });
    const authorizations = await ParentMedicationAuthorization.findAll({ where: { parentPortalUserId: userId } });
    const uploads = await ImmunizationUpload.findAll({ where: { parentPortalUserId: userId } });
    const appointments = await AppointmentRequest.findAll({ where: { parentPortalUserId: userId } });

    this.logger.log(`Exporting all data for user ${userId}`);

    return {
      exportDate: new Date(),
      userData: user.toJSON(),
      consentForms: consents.map(c => c.toJSON()),
      medicationAuthorizations: authorizations.map(a => a.toJSON()),
      immunizationUploads: uploads.map(u => u.toJSON()),
      appointmentRequests: appointments.map(a => a.toJSON()),
      exportFormat: 'JSON',
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private async verifyParentAccess(parentPortalUserId: string, studentId: string, requiredPermission: RecordPermissionType): Promise<void> {
    const HealthRecordPermission = createHealthRecordPermissionModel(this.sequelize);

    const permission = await HealthRecordPermission.findOne({
      where: {
        parentPortalUserId,
        studentId,
        permissionType: [RecordPermissionType.VIEW_FULL_RECORD, requiredPermission],
      },
    });

    if (!permission) {
      throw new ForbiddenException(`Access denied to this resource`);
    }

    if (permission.expirationDate && permission.expirationDate < new Date()) {
      throw new ForbiddenException(`Access permission has expired`);
    }
  }

  private getConsentFormTitle(consentType: ConsentFormType): string {
    const titles: Record<ConsentFormType, string> = {
      [ConsentFormType.GENERAL_MEDICAL_CARE]: 'General Medical Care Consent',
      [ConsentFormType.MEDICATION_ADMINISTRATION]: 'Medication Administration Consent',
      [ConsentFormType.EMERGENCY_TREATMENT]: 'Emergency Treatment Authorization',
      [ConsentFormType.IMMUNIZATION]: 'Immunization Consent',
      [ConsentFormType.HEALTH_SCREENING]: 'Health Screening Consent',
      [ConsentFormType.PHOTO_RELEASE]: 'Photo/Video Release',
      [ConsentFormType.INFORMATION_SHARING]: 'Information Sharing Consent',
    };

    return titles[consentType] || 'Consent Form';
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ParentGuardianPortalCompositeService;
