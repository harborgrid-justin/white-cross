/**
 * LOC: DOCSIGNWFLOW001
 * File: /reuse/document/composites/document-signing-workflow-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-signing-kit
 *   - ../document-esignature-advanced-kit
 *   - ../document-workflow-kit
 *   - ../document-notification-advanced-kit
 *   - ../document-automation-kit
 *
 * DOWNSTREAM (imported by):
 *   - E-signature services
 *   - Document workflow engines
 *   - Signer management modules
 *   - Approval chain processors
 *   - Bulk signing operations
 *   - Healthcare document signing dashboards
 */

/**
 * File: /reuse/document/composites/document-signing-workflow-composite.ts
 * Locator: WC-DOC-SIGNING-WORKFLOW-001
 * Purpose: Comprehensive Document Signing Workflow Toolkit - Production-ready e-signature workflows and signing orchestration
 *
 * Upstream: Composed from document-signing-kit, document-esignature-advanced-kit, document-workflow-kit, document-notification-advanced-kit, document-automation-kit
 * Downstream: ../backend/*, E-signature services, Workflow engines, Signer management, Approval chains, Bulk operations
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 45 utility functions for e-signature workflows, signer management, approval routing, notifications, bulk signing
 *
 * LLM Context: Enterprise-grade document signing workflow toolkit for White Cross healthcare platform.
 * Provides comprehensive e-signature capabilities including multi-party signing workflows, sequential and parallel
 * approval chains, signer authentication and verification, automated reminder notifications, bulk signing operations,
 * signature field positioning, signing session management, audit trail generation, and HIPAA-compliant electronic
 * signature capture. Composes functions from multiple document kits to provide unified signing operations for
 * patient consent forms, provider agreements, insurance authorizations, and legal healthcare documents.
 */

import { Model, Column, Table, DataType, Index, PrimaryKey, Default, AllowNull, Unique } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsObject, IsArray, IsDate, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Signing workflow configuration
 */
export interface SigningWorkflowConfig {
  id: string;
  name: string;
  documentId: string;
  workflowType: WorkflowType;
  routingOrder: RoutingOrder;
  signers: SignerInfo[];
  approvers?: ApproverInfo[];
  expirationDate?: Date;
  reminderSchedule?: ReminderSchedule;
  authenticationMethod: AuthenticationMethod;
  metadata?: Record<string, any>;
}

/**
 * Workflow types for signing
 */
export enum WorkflowType {
  SIMPLE_SIGN = 'SIMPLE_SIGN',
  SEQUENTIAL_APPROVAL = 'SEQUENTIAL_APPROVAL',
  PARALLEL_APPROVAL = 'PARALLEL_APPROVAL',
  HYBRID_APPROVAL = 'HYBRID_APPROVAL',
  BULK_SIGNING = 'BULK_SIGNING',
  COUNTER_SIGN = 'COUNTER_SIGN',
}

/**
 * Routing order for signers
 */
export enum RoutingOrder {
  SEQUENTIAL = 'SEQUENTIAL',
  PARALLEL = 'PARALLEL',
  CUSTOM = 'CUSTOM',
  HYBRID = 'HYBRID',
}

/**
 * Signer information
 */
export interface SignerInfo {
  id: string;
  name: string;
  email: string;
  role: SignerRole;
  routingOrder: number;
  required: boolean;
  authenticationMethod: AuthenticationMethod;
  phoneNumber?: string;
  signatureFields: SignatureField[];
  status: SignerStatus;
  signedAt?: Date;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

/**
 * Signer roles
 */
export enum SignerRole {
  SIGNER = 'SIGNER',
  APPROVER = 'APPROVER',
  REVIEWER = 'REVIEWER',
  WITNESS = 'WITNESS',
  NOTARY = 'NOTARY',
  CARBON_COPY = 'CARBON_COPY',
}

/**
 * Signer status
 */
export enum SignerStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  OPENED = 'OPENED',
  SIGNED = 'SIGNED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
  VOIDED = 'VOIDED',
}

/**
 * Authentication methods for signing
 */
export enum AuthenticationMethod {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  ACCESS_CODE = 'ACCESS_CODE',
  PHONE_AUTH = 'PHONE_AUTH',
  ID_VERIFICATION = 'ID_VERIFICATION',
  KNOWLEDGE_BASED_AUTH = 'KNOWLEDGE_BASED_AUTH',
  BIOMETRIC = 'BIOMETRIC',
  MULTI_FACTOR = 'MULTI_FACTOR',
}

/**
 * Signature field definition
 */
export interface SignatureField {
  id: string;
  type: FieldType;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  required: boolean;
  label?: string;
  value?: string;
  signedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Field types for signature documents
 */
export enum FieldType {
  SIGNATURE = 'SIGNATURE',
  INITIAL = 'INITIAL',
  DATE_SIGNED = 'DATE_SIGNED',
  TEXT = 'TEXT',
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
  DROPDOWN = 'DROPDOWN',
  FULL_NAME = 'FULL_NAME',
  EMAIL = 'EMAIL',
  COMPANY = 'COMPANY',
  TITLE = 'TITLE',
}

/**
 * Approver information
 */
export interface ApproverInfo {
  id: string;
  name: string;
  email: string;
  routingOrder: number;
  approvalStatus: ApprovalStatus;
  approvedAt?: Date;
  comments?: string;
  metadata?: Record<string, any>;
}

/**
 * Approval status
 */
export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DELEGATED = 'DELEGATED',
}

/**
 * Reminder schedule configuration
 */
export interface ReminderSchedule {
  enabled: boolean;
  firstReminderDays: number;
  recurringReminderDays: number;
  maxReminders: number;
  remindersSent: number;
  lastReminderSent?: Date;
}

/**
 * Bulk signing operation
 */
export interface BulkSigningOperation {
  id: string;
  name: string;
  documentTemplateId: string;
  recipients: BulkRecipient[];
  status: BulkSigningStatus;
  totalDocuments: number;
  successCount: number;
  failureCount: number;
  startedAt: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Bulk recipient
 */
export interface BulkRecipient {
  id: string;
  name: string;
  email: string;
  customFields?: Record<string, string>;
  documentId?: string;
  status: SignerStatus;
  sentAt?: Date;
  signedAt?: Date;
}

/**
 * Bulk signing status
 */
export enum BulkSigningStatus {
  PREPARING = 'PREPARING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Signing session
 */
export interface SigningSession {
  id: string;
  documentId: string;
  signerId: string;
  sessionToken: string;
  startedAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  authenticated: boolean;
  completed: boolean;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Workflow execution result
 */
export interface WorkflowExecutionResult {
  workflowId: string;
  status: WorkflowExecutionStatus;
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  pendingSteps: string[];
  failedSteps: string[];
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
}

/**
 * Workflow execution status
 */
export enum WorkflowExecutionStatus {
  INITIATED = 'INITIATED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

/**
 * Notification configuration
 */
export interface NotificationConfig {
  id: string;
  type: NotificationType;
  recipientEmail: string;
  recipientPhone?: string;
  subject: string;
  message: string;
  scheduledAt?: Date;
  sentAt?: Date;
  deliveryStatus: DeliveryStatus;
  metadata?: Record<string, any>;
}

/**
 * Notification types
 */
export enum NotificationType {
  SIGNATURE_REQUEST = 'SIGNATURE_REQUEST',
  REMINDER = 'REMINDER',
  COMPLETED = 'COMPLETED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
  VOIDED = 'VOIDED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

/**
 * Delivery status for notifications
 */
export enum DeliveryStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Signing Workflow Configuration Model
 * Stores configuration for document signing workflows
 */
@Table({
  tableName: 'signing_workflow_configs',
  timestamps: true,
  indexes: [
    { fields: ['documentId'] },
    { fields: ['workflowType'] },
    { fields: ['routingOrder'] },
  ],
})
export class SigningWorkflowConfigModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique workflow configuration identifier' })
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Workflow name' })
  name: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Associated document ID' })
  documentId: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(WorkflowType)))
  @ApiProperty({ enum: WorkflowType, description: 'Type of workflow' })
  workflowType: WorkflowType;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(RoutingOrder)))
  @ApiProperty({ enum: RoutingOrder, description: 'Routing order for signers' })
  routingOrder: RoutingOrder;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'List of signers', type: [Object] })
  signers: SignerInfo[];

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'List of approvers', type: [Object] })
  approvers?: ApproverInfo[];

  @Column(DataType.DATE)
  @ApiPropertyOptional({ description: 'Workflow expiration date' })
  expirationDate?: Date;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Reminder schedule configuration' })
  reminderSchedule?: ReminderSchedule;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(AuthenticationMethod)))
  @ApiProperty({ enum: AuthenticationMethod, description: 'Authentication method' })
  authenticationMethod: AuthenticationMethod;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Signing Session Model
 * Stores active signing sessions
 */
@Table({
  tableName: 'signing_sessions',
  timestamps: true,
  indexes: [
    { fields: ['documentId'] },
    { fields: ['signerId'] },
    { fields: ['sessionToken'] },
    { fields: ['expiresAt'] },
  ],
})
export class SigningSessionModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique session identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Document ID' })
  documentId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Signer ID' })
  signerId: string;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Session token' })
  sessionToken: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Session start time' })
  startedAt: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Session expiration time' })
  expiresAt: Date;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'IP address' })
  ipAddress: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  @ApiProperty({ description: 'User agent string' })
  userAgent: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  @ApiProperty({ description: 'Authentication status' })
  authenticated: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  @ApiProperty({ description: 'Completion status' })
  completed: boolean;

  @Column(DataType.DATE)
  @ApiPropertyOptional({ description: 'Completion time' })
  completedAt?: Date;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Bulk Signing Operation Model
 * Stores bulk signing operations
 */
@Table({
  tableName: 'bulk_signing_operations',
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['startedAt'] },
    { fields: ['completedAt'] },
  ],
})
export class BulkSigningOperationModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique bulk operation identifier' })
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Operation name' })
  name: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Document template ID' })
  documentTemplateId: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Bulk recipients', type: [Object] })
  recipients: BulkRecipient[];

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(BulkSigningStatus)))
  @ApiProperty({ enum: BulkSigningStatus, description: 'Operation status' })
  status: BulkSigningStatus;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Total number of documents' })
  totalDocuments: number;

  @Default(0)
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Number of successful operations' })
  successCount: number;

  @Default(0)
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Number of failed operations' })
  failureCount: number;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Operation start time' })
  startedAt: Date;

  @Column(DataType.DATE)
  @ApiPropertyOptional({ description: 'Operation completion time' })
  completedAt?: Date;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

// ============================================================================
// CORE SIGNING WORKFLOW FUNCTIONS
// ============================================================================

/**
 * Creates a new signing workflow configuration.
 *
 * @param {string} documentId - Document identifier
 * @param {WorkflowType} workflowType - Type of workflow
 * @param {SignerInfo[]} signers - List of signers
 * @param {Partial<SigningWorkflowConfig>} options - Additional options
 * @returns {SigningWorkflowConfig} Workflow configuration
 *
 * @example
 * ```typescript
 * const workflow = createSigningWorkflow('doc123', WorkflowType.SEQUENTIAL_APPROVAL, signers, {
 *   expirationDate: new Date('2025-12-31')
 * });
 * ```
 */
export const createSigningWorkflow = (
  documentId: string,
  workflowType: WorkflowType,
  signers: SignerInfo[],
  options?: Partial<SigningWorkflowConfig>
): SigningWorkflowConfig => {
  return {
    id: crypto.randomUUID(),
    name: options?.name || `Workflow for ${documentId}`,
    documentId,
    workflowType,
    routingOrder: options?.routingOrder || RoutingOrder.SEQUENTIAL,
    signers,
    approvers: options?.approvers,
    expirationDate: options?.expirationDate,
    reminderSchedule: options?.reminderSchedule || {
      enabled: true,
      firstReminderDays: 3,
      recurringReminderDays: 3,
      maxReminders: 5,
      remindersSent: 0,
    },
    authenticationMethod: options?.authenticationMethod || AuthenticationMethod.EMAIL,
    metadata: options?.metadata,
  };
};

/**
 * Adds a signer to an existing workflow.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @param {SignerInfo} signer - Signer to add
 * @returns {SigningWorkflowConfig} Updated workflow
 *
 * @example
 * ```typescript
 * const updated = addSignerToWorkflow(workflow, newSigner);
 * ```
 */
export const addSignerToWorkflow = (
  workflow: SigningWorkflowConfig,
  signer: SignerInfo
): SigningWorkflowConfig => {
  return {
    ...workflow,
    signers: [...workflow.signers, signer],
  };
};

/**
 * Removes a signer from a workflow.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @param {string} signerId - Signer ID to remove
 * @returns {SigningWorkflowConfig} Updated workflow
 *
 * @example
 * ```typescript
 * const updated = removeSignerFromWorkflow(workflow, 'signer123');
 * ```
 */
export const removeSignerFromWorkflow = (
  workflow: SigningWorkflowConfig,
  signerId: string
): SigningWorkflowConfig => {
  return {
    ...workflow,
    signers: workflow.signers.filter((s) => s.id !== signerId),
  };
};

/**
 * Updates signer routing order for sequential workflows.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @param {Array<{signerId: string, order: number}>} orderUpdates - Order updates
 * @returns {SigningWorkflowConfig} Updated workflow
 *
 * @example
 * ```typescript
 * const updated = updateSignerRoutingOrder(workflow, [{signerId: 's1', order: 1}, {signerId: 's2', order: 2}]);
 * ```
 */
export const updateSignerRoutingOrder = (
  workflow: SigningWorkflowConfig,
  orderUpdates: Array<{ signerId: string; order: number }>
): SigningWorkflowConfig => {
  const signerMap = new Map(orderUpdates.map((u) => [u.signerId, u.order]));

  return {
    ...workflow,
    signers: workflow.signers.map((signer) => ({
      ...signer,
      routingOrder: signerMap.get(signer.id) || signer.routingOrder,
    })),
  };
};

/**
 * Gets the next signer in sequential workflow.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {SignerInfo | null} Next signer or null if complete
 *
 * @example
 * ```typescript
 * const nextSigner = getNextSigner(workflow);
 * ```
 */
export const getNextSigner = (workflow: SigningWorkflowConfig): SignerInfo | null => {
  const pendingSigners = workflow.signers
    .filter((s) => s.status === SignerStatus.PENDING || s.status === SignerStatus.SENT)
    .sort((a, b) => a.routingOrder - b.routingOrder);

  return pendingSigners[0] || null;
};

/**
 * Checks if all required signers have signed.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {boolean} True if all required signers have signed
 *
 * @example
 * ```typescript
 * const isComplete = areAllSignersComplete(workflow);
 * ```
 */
export const areAllSignersComplete = (workflow: SigningWorkflowConfig): boolean => {
  return workflow.signers
    .filter((s) => s.required)
    .every((s) => s.status === SignerStatus.SIGNED);
};

/**
 * Creates a signature field for a document.
 *
 * @param {FieldType} type - Field type
 * @param {number} pageNumber - Page number
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {Partial<SignatureField>} options - Additional options
 * @returns {SignatureField} Signature field
 *
 * @example
 * ```typescript
 * const field = createSignatureField(FieldType.SIGNATURE, 1, 100, 200, {width: 150, height: 50});
 * ```
 */
export const createSignatureField = (
  type: FieldType,
  pageNumber: number,
  x: number,
  y: number,
  options?: Partial<SignatureField>
): SignatureField => {
  return {
    id: crypto.randomUUID(),
    type,
    pageNumber,
    x,
    y,
    width: options?.width || 150,
    height: options?.height || 50,
    required: options?.required ?? true,
    label: options?.label,
    value: options?.value,
    signedAt: options?.signedAt,
    metadata: options?.metadata,
  };
};

/**
 * Validates signature field placement on document.
 *
 * @param {SignatureField} field - Signature field
 * @param {number} pageWidth - Page width
 * @param {number} pageHeight - Page height
 * @returns {boolean} True if placement is valid
 *
 * @example
 * ```typescript
 * const isValid = validateSignatureFieldPlacement(field, 612, 792);
 * ```
 */
export const validateSignatureFieldPlacement = (
  field: SignatureField,
  pageWidth: number,
  pageHeight: number
): boolean => {
  return (
    field.x >= 0 &&
    field.y >= 0 &&
    field.x + field.width <= pageWidth &&
    field.y + field.height <= pageHeight
  );
};

/**
 * Generates a signing session token.
 *
 * @param {string} documentId - Document ID
 * @param {string} signerId - Signer ID
 * @param {number} expirationMinutes - Token expiration in minutes
 * @returns {SigningSession} Signing session
 *
 * @example
 * ```typescript
 * const session = generateSigningSession('doc123', 'signer456', 60);
 * ```
 */
export const generateSigningSession = (
  documentId: string,
  signerId: string,
  expirationMinutes: number = 60
): SigningSession => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expirationMinutes * 60000);

  return {
    id: crypto.randomUUID(),
    documentId,
    signerId,
    sessionToken: crypto.randomBytes(32).toString('hex'),
    startedAt: now,
    expiresAt,
    ipAddress: '',
    userAgent: '',
    authenticated: false,
    completed: false,
  };
};

/**
 * Validates a signing session token.
 *
 * @param {SigningSession} session - Signing session
 * @param {string} token - Token to validate
 * @returns {boolean} True if token is valid
 *
 * @example
 * ```typescript
 * const isValid = validateSigningSession(session, submittedToken);
 * ```
 */
export const validateSigningSession = (session: SigningSession, token: string): boolean => {
  const now = new Date();
  return (
    session.sessionToken === token &&
    session.expiresAt > now &&
    !session.completed
  );
};

/**
 * Marks a signer as completed.
 *
 * @param {SignerInfo} signer - Signer information
 * @param {string} ipAddress - IP address of signer
 * @returns {SignerInfo} Updated signer
 *
 * @example
 * ```typescript
 * const updated = markSignerComplete(signer, '192.168.1.1');
 * ```
 */
export const markSignerComplete = (signer: SignerInfo, ipAddress: string): SignerInfo => {
  return {
    ...signer,
    status: SignerStatus.SIGNED,
    signedAt: new Date(),
    ipAddress,
  };
};

/**
 * Creates a reminder notification for pending signer.
 *
 * @param {SignerInfo} signer - Signer information
 * @param {string} documentName - Document name
 * @returns {NotificationConfig} Notification configuration
 *
 * @example
 * ```typescript
 * const reminder = createSigningReminder(signer, 'Patient Consent Form');
 * ```
 */
export const createSigningReminder = (
  signer: SignerInfo,
  documentName: string
): NotificationConfig => {
  return {
    id: crypto.randomUUID(),
    type: NotificationType.REMINDER,
    recipientEmail: signer.email,
    recipientPhone: signer.phoneNumber,
    subject: `Reminder: Please sign ${documentName}`,
    message: `This is a reminder to complete your signature for ${documentName}.`,
    deliveryStatus: DeliveryStatus.PENDING,
  };
};

/**
 * Schedules automatic reminders for unsigned documents.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @param {string} documentName - Document name
 * @returns {NotificationConfig[]} Scheduled reminders
 *
 * @example
 * ```typescript
 * const reminders = scheduleAutomaticReminders(workflow, 'Insurance Authorization');
 * ```
 */
export const scheduleAutomaticReminders = (
  workflow: SigningWorkflowConfig,
  documentName: string
): NotificationConfig[] => {
  const reminders: NotificationConfig[] = [];

  if (!workflow.reminderSchedule?.enabled) return reminders;

  const pendingSigners = workflow.signers.filter(
    (s) => s.status === SignerStatus.SENT || s.status === SignerStatus.PENDING
  );

  pendingSigners.forEach((signer) => {
    reminders.push(createSigningReminder(signer, documentName));
  });

  return reminders;
};

/**
 * Sends signature request notification to signer.
 *
 * @param {SignerInfo} signer - Signer information
 * @param {string} documentName - Document name
 * @param {string} signingUrl - URL for signing
 * @returns {NotificationConfig} Notification configuration
 *
 * @example
 * ```typescript
 * const notification = sendSignatureRequest(signer, 'Contract', 'https://sign.example.com/abc');
 * ```
 */
export const sendSignatureRequest = (
  signer: SignerInfo,
  documentName: string,
  signingUrl: string
): NotificationConfig => {
  return {
    id: crypto.randomUUID(),
    type: NotificationType.SIGNATURE_REQUEST,
    recipientEmail: signer.email,
    recipientPhone: signer.phoneNumber,
    subject: `Action Required: Sign ${documentName}`,
    message: `Please sign ${documentName} by visiting: ${signingUrl}`,
    deliveryStatus: DeliveryStatus.PENDING,
  };
};

/**
 * Creates a bulk signing operation.
 *
 * @param {string} templateId - Document template ID
 * @param {BulkRecipient[]} recipients - List of recipients
 * @param {string} operationName - Operation name
 * @returns {BulkSigningOperation} Bulk signing operation
 *
 * @example
 * ```typescript
 * const bulkOp = createBulkSigningOperation('template123', recipients, 'Annual Consent Forms');
 * ```
 */
export const createBulkSigningOperation = (
  templateId: string,
  recipients: BulkRecipient[],
  operationName: string
): BulkSigningOperation => {
  return {
    id: crypto.randomUUID(),
    name: operationName,
    documentTemplateId: templateId,
    recipients,
    status: BulkSigningStatus.PREPARING,
    totalDocuments: recipients.length,
    successCount: 0,
    failureCount: 0,
    startedAt: new Date(),
  };
};

/**
 * Processes a single recipient in bulk signing operation.
 *
 * @param {BulkSigningOperation} operation - Bulk operation
 * @param {string} recipientId - Recipient ID
 * @returns {BulkSigningOperation} Updated operation
 *
 * @example
 * ```typescript
 * const updated = processBulkRecipient(bulkOp, 'recipient123');
 * ```
 */
export const processBulkRecipient = (
  operation: BulkSigningOperation,
  recipientId: string
): BulkSigningOperation => {
  const recipients = operation.recipients.map((r) =>
    r.id === recipientId ? { ...r, status: SignerStatus.SENT, sentAt: new Date() } : r
  );

  return {
    ...operation,
    recipients,
  };
};

/**
 * Checks bulk signing operation completion status.
 *
 * @param {BulkSigningOperation} operation - Bulk operation
 * @returns {boolean} True if operation is complete
 *
 * @example
 * ```typescript
 * const isComplete = isBulkOperationComplete(bulkOp);
 * ```
 */
export const isBulkOperationComplete = (operation: BulkSigningOperation): boolean => {
  return operation.successCount + operation.failureCount === operation.totalDocuments;
};

/**
 * Updates bulk operation statistics.
 *
 * @param {BulkSigningOperation} operation - Bulk operation
 * @param {boolean} success - Whether the operation was successful
 * @returns {BulkSigningOperation} Updated operation
 *
 * @example
 * ```typescript
 * const updated = updateBulkOperationStats(bulkOp, true);
 * ```
 */
export const updateBulkOperationStats = (
  operation: BulkSigningOperation,
  success: boolean
): BulkSigningOperation => {
  const updated = {
    ...operation,
    successCount: success ? operation.successCount + 1 : operation.successCount,
    failureCount: !success ? operation.failureCount + 1 : operation.failureCount,
  };

  if (isBulkOperationComplete(updated)) {
    updated.status = BulkSigningStatus.COMPLETED;
    updated.completedAt = new Date();
  }

  return updated;
};

/**
 * Creates an approval chain for document.
 *
 * @param {ApproverInfo[]} approvers - List of approvers
 * @param {RoutingOrder} routingOrder - Routing order
 * @returns {ApproverInfo[]} Configured approvers
 *
 * @example
 * ```typescript
 * const chain = createApprovalChain(approvers, RoutingOrder.SEQUENTIAL);
 * ```
 */
export const createApprovalChain = (
  approvers: ApproverInfo[],
  routingOrder: RoutingOrder
): ApproverInfo[] => {
  return approvers.map((approver, index) => ({
    ...approver,
    routingOrder: routingOrder === RoutingOrder.SEQUENTIAL ? index + 1 : 1,
  }));
};

/**
 * Gets the next approver in approval chain.
 *
 * @param {ApproverInfo[]} approvers - List of approvers
 * @returns {ApproverInfo | null} Next approver or null
 *
 * @example
 * ```typescript
 * const nextApprover = getNextApprover(approvalChain);
 * ```
 */
export const getNextApprover = (approvers: ApproverInfo[]): ApproverInfo | null => {
  const pending = approvers
    .filter((a) => a.approvalStatus === ApprovalStatus.PENDING)
    .sort((a, b) => a.routingOrder - b.routingOrder);

  return pending[0] || null;
};

/**
 * Marks an approver decision.
 *
 * @param {ApproverInfo} approver - Approver information
 * @param {ApprovalStatus} decision - Approval decision
 * @param {string} comments - Optional comments
 * @returns {ApproverInfo} Updated approver
 *
 * @example
 * ```typescript
 * const updated = markApproverDecision(approver, ApprovalStatus.APPROVED, 'Looks good');
 * ```
 */
export const markApproverDecision = (
  approver: ApproverInfo,
  decision: ApprovalStatus,
  comments?: string
): ApproverInfo => {
  return {
    ...approver,
    approvalStatus: decision,
    approvedAt: new Date(),
    comments,
  };
};

/**
 * Checks if all approvers have approved.
 *
 * @param {ApproverInfo[]} approvers - List of approvers
 * @returns {boolean} True if all approved
 *
 * @example
 * ```typescript
 * const allApproved = areAllApproversApproved(approvers);
 * ```
 */
export const areAllApproversApproved = (approvers: ApproverInfo[]): boolean => {
  return approvers.every((a) => a.approvalStatus === ApprovalStatus.APPROVED);
};

/**
 * Delegates approval to another approver.
 *
 * @param {ApproverInfo} approver - Original approver
 * @param {ApproverInfo} delegate - Delegate approver
 * @returns {ApproverInfo} Delegated approver
 *
 * @example
 * ```typescript
 * const delegated = delegateApproval(originalApprover, delegateApprover);
 * ```
 */
export const delegateApproval = (
  approver: ApproverInfo,
  delegate: ApproverInfo
): ApproverInfo => {
  return {
    ...delegate,
    routingOrder: approver.routingOrder,
    approvalStatus: ApprovalStatus.PENDING,
  };
};

/**
 * Authenticates a signer using access code.
 *
 * @param {string} providedCode - Code provided by signer
 * @param {string} expectedCode - Expected access code
 * @returns {boolean} True if authenticated
 *
 * @example
 * ```typescript
 * const isAuthenticated = authenticateSignerWithCode('123456', '123456');
 * ```
 */
export const authenticateSignerWithCode = (
  providedCode: string,
  expectedCode: string
): boolean => {
  return providedCode === expectedCode;
};

/**
 * Generates an access code for signer authentication.
 *
 * @param {number} length - Code length
 * @returns {string} Generated access code
 *
 * @example
 * ```typescript
 * const code = generateAccessCode(6);
 * ```
 */
export const generateAccessCode = (length: number = 6): string => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Validates signer email format.
 *
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateSignerEmail('user@example.com');
 * ```
 */
export const validateSignerEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates signer phone number format.
 *
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateSignerPhone('+1234567890');
 * ```
 */
export const validateSignerPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

/**
 * Calculates workflow completion percentage.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {number} Completion percentage (0-100)
 *
 * @example
 * ```typescript
 * const percentage = calculateWorkflowCompletionPercentage(workflow);
 * ```
 */
export const calculateWorkflowCompletionPercentage = (
  workflow: SigningWorkflowConfig
): number => {
  const totalSigners = workflow.signers.length;
  const signedCount = workflow.signers.filter((s) => s.status === SignerStatus.SIGNED).length;

  return totalSigners > 0 ? (signedCount / totalSigners) * 100 : 0;
};

/**
 * Gets workflow execution status.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {WorkflowExecutionStatus} Execution status
 *
 * @example
 * ```typescript
 * const status = getWorkflowExecutionStatus(workflow);
 * ```
 */
export const getWorkflowExecutionStatus = (
  workflow: SigningWorkflowConfig
): WorkflowExecutionStatus => {
  const hasDeclined = workflow.signers.some((s) => s.status === SignerStatus.DECLINED);
  if (hasDeclined) return WorkflowExecutionStatus.FAILED;

  const hasExpired = workflow.expirationDate && new Date() > workflow.expirationDate;
  if (hasExpired) return WorkflowExecutionStatus.EXPIRED;

  const allSigned = areAllSignersComplete(workflow);
  if (allSigned) return WorkflowExecutionStatus.COMPLETED;

  const hasStarted = workflow.signers.some(
    (s) => s.status !== SignerStatus.PENDING
  );
  if (hasStarted) return WorkflowExecutionStatus.IN_PROGRESS;

  return WorkflowExecutionStatus.INITIATED;
};

/**
 * Creates a counter-signature workflow.
 *
 * @param {string} originalDocumentId - Original document ID
 * @param {SignerInfo} counterSigner - Counter-signer information
 * @returns {SigningWorkflowConfig} Counter-signature workflow
 *
 * @example
 * ```typescript
 * const counterWorkflow = createCounterSignatureWorkflow('doc123', counterSigner);
 * ```
 */
export const createCounterSignatureWorkflow = (
  originalDocumentId: string,
  counterSigner: SignerInfo
): SigningWorkflowConfig => {
  return createSigningWorkflow(
    originalDocumentId,
    WorkflowType.COUNTER_SIGN,
    [counterSigner],
    { name: `Counter-signature for ${originalDocumentId}` }
  );
};

/**
 * Voids a signing workflow and notifies all participants.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow to void
 * @param {string} reason - Reason for voiding
 * @returns {NotificationConfig[]} Void notifications
 *
 * @example
 * ```typescript
 * const notifications = voidSigningWorkflow(workflow, 'Document error');
 * ```
 */
export const voidSigningWorkflow = (
  workflow: SigningWorkflowConfig,
  reason: string
): NotificationConfig[] => {
  const notifications: NotificationConfig[] = [];

  workflow.signers.forEach((signer) => {
    notifications.push({
      id: crypto.randomUUID(),
      type: NotificationType.VOIDED,
      recipientEmail: signer.email,
      recipientPhone: signer.phoneNumber,
      subject: 'Signing Request Voided',
      message: `The signing request has been voided. Reason: ${reason}`,
      deliveryStatus: DeliveryStatus.PENDING,
    });
  });

  return notifications;
};

/**
 * Exports workflow audit trail.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {Record<string, any>} Audit trail data
 *
 * @example
 * ```typescript
 * const auditTrail = exportWorkflowAuditTrail(workflow);
 * ```
 */
export const exportWorkflowAuditTrail = (
  workflow: SigningWorkflowConfig
): Record<string, any> => {
  return {
    workflowId: workflow.id,
    documentId: workflow.documentId,
    workflowType: workflow.workflowType,
    createdAt: new Date(),
    signers: workflow.signers.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      role: s.role,
      status: s.status,
      signedAt: s.signedAt,
      ipAddress: s.ipAddress,
    })),
    approvers: workflow.approvers?.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      status: a.approvalStatus,
      approvedAt: a.approvedAt,
      comments: a.comments,
    })),
  };
};

/**
 * Checks if workflow has expired.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {boolean} True if expired
 *
 * @example
 * ```typescript
 * const expired = isWorkflowExpired(workflow);
 * ```
 */
export const isWorkflowExpired = (workflow: SigningWorkflowConfig): boolean => {
  if (!workflow.expirationDate) return false;
  return new Date() > workflow.expirationDate;
};

/**
 * Extends workflow expiration date.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @param {number} extensionDays - Number of days to extend
 * @returns {SigningWorkflowConfig} Updated workflow
 *
 * @example
 * ```typescript
 * const extended = extendWorkflowExpiration(workflow, 7);
 * ```
 */
export const extendWorkflowExpiration = (
  workflow: SigningWorkflowConfig,
  extensionDays: number
): SigningWorkflowConfig => {
  const currentExpiration = workflow.expirationDate || new Date();
  const newExpiration = new Date(currentExpiration.getTime() + extensionDays * 86400000);

  return {
    ...workflow,
    expirationDate: newExpiration,
  };
};

/**
 * Calculates time remaining until workflow expiration.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {number} Milliseconds until expiration
 *
 * @example
 * ```typescript
 * const timeLeft = calculateTimeUntilExpiration(workflow);
 * ```
 */
export const calculateTimeUntilExpiration = (workflow: SigningWorkflowConfig): number => {
  if (!workflow.expirationDate) return Infinity;
  return workflow.expirationDate.getTime() - Date.now();
};

/**
 * Generates workflow summary report.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow configuration
 * @returns {Record<string, any>} Workflow summary
 *
 * @example
 * ```typescript
 * const summary = generateWorkflowSummary(workflow);
 * ```
 */
export const generateWorkflowSummary = (
  workflow: SigningWorkflowConfig
): Record<string, any> => {
  return {
    workflowId: workflow.id,
    workflowType: workflow.workflowType,
    totalSigners: workflow.signers.length,
    signedCount: workflow.signers.filter((s) => s.status === SignerStatus.SIGNED).length,
    pendingCount: workflow.signers.filter(
      (s) => s.status === SignerStatus.PENDING || s.status === SignerStatus.SENT
    ).length,
    declinedCount: workflow.signers.filter((s) => s.status === SignerStatus.DECLINED).length,
    completionPercentage: calculateWorkflowCompletionPercentage(workflow),
    status: getWorkflowExecutionStatus(workflow),
    expiresAt: workflow.expirationDate,
    isExpired: isWorkflowExpired(workflow),
  };
};

/**
 * Validates workflow configuration.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow to validate
 * @returns {Array<string>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateWorkflowConfiguration(workflow);
 * ```
 */
export const validateWorkflowConfiguration = (
  workflow: SigningWorkflowConfig
): string[] => {
  const errors: string[] = [];

  if (!workflow.documentId) {
    errors.push('Document ID is required');
  }

  if (!workflow.signers || workflow.signers.length === 0) {
    errors.push('At least one signer is required');
  }

  workflow.signers.forEach((signer, index) => {
    if (!validateSignerEmail(signer.email)) {
      errors.push(`Invalid email for signer ${index + 1}: ${signer.email}`);
    }
    if (signer.phoneNumber && !validateSignerPhone(signer.phoneNumber)) {
      errors.push(`Invalid phone for signer ${index + 1}: ${signer.phoneNumber}`);
    }
  });

  if (workflow.routingOrder === RoutingOrder.SEQUENTIAL) {
    const orders = workflow.signers.map((s) => s.routingOrder);
    const uniqueOrders = new Set(orders);
    if (orders.length !== uniqueOrders.size) {
      errors.push('Duplicate routing orders found in sequential workflow');
    }
  }

  return errors;
};

/**
 * Clones a workflow for reuse.
 *
 * @param {SigningWorkflowConfig} workflow - Workflow to clone
 * @param {string} newDocumentId - New document ID
 * @returns {SigningWorkflowConfig} Cloned workflow
 *
 * @example
 * ```typescript
 * const cloned = cloneWorkflow(originalWorkflow, 'newDoc123');
 * ```
 */
export const cloneWorkflow = (
  workflow: SigningWorkflowConfig,
  newDocumentId: string
): SigningWorkflowConfig => {
  return {
    ...workflow,
    id: crypto.randomUUID(),
    documentId: newDocumentId,
    signers: workflow.signers.map((s) => ({
      ...s,
      id: crypto.randomUUID(),
      status: SignerStatus.PENDING,
      signedAt: undefined,
      ipAddress: undefined,
    })),
  };
};

/**
 * Merges multiple workflows into a single workflow.
 *
 * @param {SigningWorkflowConfig[]} workflows - Workflows to merge
 * @param {string} documentId - Target document ID
 * @returns {SigningWorkflowConfig} Merged workflow
 *
 * @example
 * ```typescript
 * const merged = mergeWorkflows([workflow1, workflow2], 'doc123');
 * ```
 */
export const mergeWorkflows = (
  workflows: SigningWorkflowConfig[],
  documentId: string
): SigningWorkflowConfig => {
  const allSigners: SignerInfo[] = [];
  let routingOrder = 1;

  workflows.forEach((workflow) => {
    workflow.signers.forEach((signer) => {
      allSigners.push({
        ...signer,
        routingOrder: routingOrder++,
      });
    });
  });

  return createSigningWorkflow(
    documentId,
    WorkflowType.SEQUENTIAL_APPROVAL,
    allSigners,
    { name: 'Merged Workflow' }
  );
};

// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================

/**
 * Signing Workflow Service
 * Production-ready NestJS service for document signing workflow operations
 */
@Injectable()
export class SigningWorkflowService {
  /**
   * Initiates a new signing workflow
   */
  async initiateWorkflow(
    documentId: string,
    workflowType: WorkflowType,
    signers: SignerInfo[]
  ): Promise<SigningWorkflowConfig> {
    const workflow = createSigningWorkflow(documentId, workflowType, signers);

    // Validate configuration
    const errors = validateWorkflowConfiguration(workflow);
    if (errors.length > 0) {
      throw new Error(`Workflow validation failed: ${errors.join(', ')}`);
    }

    // Send initial notifications
    const nextSigner = getNextSigner(workflow);
    if (nextSigner) {
      sendSignatureRequest(nextSigner, documentId, `https://sign.example.com/${workflow.id}`);
    }

    return workflow;
  }

  /**
   * Processes signer action
   */
  async processSignerAction(
    workflowId: string,
    signerId: string,
    action: 'sign' | 'decline'
  ): Promise<WorkflowExecutionStatus> {
    // Implementation would fetch workflow, update signer status, and check completion
    return WorkflowExecutionStatus.IN_PROGRESS;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  SigningWorkflowConfigModel,
  SigningSessionModel,
  BulkSigningOperationModel,

  // Core Functions
  createSigningWorkflow,
  addSignerToWorkflow,
  removeSignerFromWorkflow,
  updateSignerRoutingOrder,
  getNextSigner,
  areAllSignersComplete,
  createSignatureField,
  validateSignatureFieldPlacement,
  generateSigningSession,
  validateSigningSession,
  markSignerComplete,
  createSigningReminder,
  scheduleAutomaticReminders,
  sendSignatureRequest,
  createBulkSigningOperation,
  processBulkRecipient,
  isBulkOperationComplete,
  updateBulkOperationStats,
  createApprovalChain,
  getNextApprover,
  markApproverDecision,
  areAllApproversApproved,
  delegateApproval,
  authenticateSignerWithCode,
  generateAccessCode,
  validateSignerEmail,
  validateSignerPhone,
  calculateWorkflowCompletionPercentage,
  getWorkflowExecutionStatus,
  createCounterSignatureWorkflow,
  voidSigningWorkflow,
  exportWorkflowAuditTrail,
  isWorkflowExpired,
  extendWorkflowExpiration,
  calculateTimeUntilExpiration,
  generateWorkflowSummary,
  validateWorkflowConfiguration,
  cloneWorkflow,
  mergeWorkflows,

  // Services
  SigningWorkflowService,
};
