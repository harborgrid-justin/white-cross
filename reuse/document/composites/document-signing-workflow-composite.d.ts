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
import { Model } from 'sequelize-typescript';
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
export declare enum WorkflowType {
    SIMPLE_SIGN = "SIMPLE_SIGN",
    SEQUENTIAL_APPROVAL = "SEQUENTIAL_APPROVAL",
    PARALLEL_APPROVAL = "PARALLEL_APPROVAL",
    HYBRID_APPROVAL = "HYBRID_APPROVAL",
    BULK_SIGNING = "BULK_SIGNING",
    COUNTER_SIGN = "COUNTER_SIGN"
}
/**
 * Routing order for signers
 */
export declare enum RoutingOrder {
    SEQUENTIAL = "SEQUENTIAL",
    PARALLEL = "PARALLEL",
    CUSTOM = "CUSTOM",
    HYBRID = "HYBRID"
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
export declare enum SignerRole {
    SIGNER = "SIGNER",
    APPROVER = "APPROVER",
    REVIEWER = "REVIEWER",
    WITNESS = "WITNESS",
    NOTARY = "NOTARY",
    CARBON_COPY = "CARBON_COPY"
}
/**
 * Signer status
 */
export declare enum SignerStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    OPENED = "OPENED",
    SIGNED = "SIGNED",
    DECLINED = "DECLINED",
    EXPIRED = "EXPIRED",
    VOIDED = "VOIDED"
}
/**
 * Authentication methods for signing
 */
export declare enum AuthenticationMethod {
    EMAIL = "EMAIL",
    SMS = "SMS",
    ACCESS_CODE = "ACCESS_CODE",
    PHONE_AUTH = "PHONE_AUTH",
    ID_VERIFICATION = "ID_VERIFICATION",
    KNOWLEDGE_BASED_AUTH = "KNOWLEDGE_BASED_AUTH",
    BIOMETRIC = "BIOMETRIC",
    MULTI_FACTOR = "MULTI_FACTOR"
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
export declare enum FieldType {
    SIGNATURE = "SIGNATURE",
    INITIAL = "INITIAL",
    DATE_SIGNED = "DATE_SIGNED",
    TEXT = "TEXT",
    CHECKBOX = "CHECKBOX",
    RADIO = "RADIO",
    DROPDOWN = "DROPDOWN",
    FULL_NAME = "FULL_NAME",
    EMAIL = "EMAIL",
    COMPANY = "COMPANY",
    TITLE = "TITLE"
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
export declare enum ApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    DELEGATED = "DELEGATED"
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
export declare enum BulkSigningStatus {
    PREPARING = "PREPARING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
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
export declare enum WorkflowExecutionStatus {
    INITIATED = "INITIATED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED"
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
export declare enum NotificationType {
    SIGNATURE_REQUEST = "SIGNATURE_REQUEST",
    REMINDER = "REMINDER",
    COMPLETED = "COMPLETED",
    DECLINED = "DECLINED",
    EXPIRED = "EXPIRED",
    VOIDED = "VOIDED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
/**
 * Delivery status for notifications
 */
export declare enum DeliveryStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    FAILED = "FAILED",
    BOUNCED = "BOUNCED"
}
/**
 * Signing Workflow Configuration Model
 * Stores configuration for document signing workflows
 */
export declare class SigningWorkflowConfigModel extends Model {
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
 * Signing Session Model
 * Stores active signing sessions
 */
export declare class SigningSessionModel extends Model {
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
 * Bulk Signing Operation Model
 * Stores bulk signing operations
 */
export declare class BulkSigningOperationModel extends Model {
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
export declare const createSigningWorkflow: (documentId: string, workflowType: WorkflowType, signers: SignerInfo[], options?: Partial<SigningWorkflowConfig>) => SigningWorkflowConfig;
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
export declare const addSignerToWorkflow: (workflow: SigningWorkflowConfig, signer: SignerInfo) => SigningWorkflowConfig;
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
export declare const removeSignerFromWorkflow: (workflow: SigningWorkflowConfig, signerId: string) => SigningWorkflowConfig;
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
export declare const updateSignerRoutingOrder: (workflow: SigningWorkflowConfig, orderUpdates: Array<{
    signerId: string;
    order: number;
}>) => SigningWorkflowConfig;
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
export declare const getNextSigner: (workflow: SigningWorkflowConfig) => SignerInfo | null;
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
export declare const areAllSignersComplete: (workflow: SigningWorkflowConfig) => boolean;
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
export declare const createSignatureField: (type: FieldType, pageNumber: number, x: number, y: number, options?: Partial<SignatureField>) => SignatureField;
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
export declare const validateSignatureFieldPlacement: (field: SignatureField, pageWidth: number, pageHeight: number) => boolean;
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
export declare const generateSigningSession: (documentId: string, signerId: string, expirationMinutes?: number) => SigningSession;
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
export declare const validateSigningSession: (session: SigningSession, token: string) => boolean;
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
export declare const markSignerComplete: (signer: SignerInfo, ipAddress: string) => SignerInfo;
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
export declare const createSigningReminder: (signer: SignerInfo, documentName: string) => NotificationConfig;
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
export declare const scheduleAutomaticReminders: (workflow: SigningWorkflowConfig, documentName: string) => NotificationConfig[];
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
export declare const sendSignatureRequest: (signer: SignerInfo, documentName: string, signingUrl: string) => NotificationConfig;
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
export declare const createBulkSigningOperation: (templateId: string, recipients: BulkRecipient[], operationName: string) => BulkSigningOperation;
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
export declare const processBulkRecipient: (operation: BulkSigningOperation, recipientId: string) => BulkSigningOperation;
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
export declare const isBulkOperationComplete: (operation: BulkSigningOperation) => boolean;
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
export declare const updateBulkOperationStats: (operation: BulkSigningOperation, success: boolean) => BulkSigningOperation;
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
export declare const createApprovalChain: (approvers: ApproverInfo[], routingOrder: RoutingOrder) => ApproverInfo[];
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
export declare const getNextApprover: (approvers: ApproverInfo[]) => ApproverInfo | null;
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
export declare const markApproverDecision: (approver: ApproverInfo, decision: ApprovalStatus, comments?: string) => ApproverInfo;
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
export declare const areAllApproversApproved: (approvers: ApproverInfo[]) => boolean;
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
export declare const delegateApproval: (approver: ApproverInfo, delegate: ApproverInfo) => ApproverInfo;
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
export declare const authenticateSignerWithCode: (providedCode: string, expectedCode: string) => boolean;
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
export declare const generateAccessCode: (length?: number) => string;
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
export declare const validateSignerEmail: (email: string) => boolean;
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
export declare const validateSignerPhone: (phone: string) => boolean;
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
export declare const calculateWorkflowCompletionPercentage: (workflow: SigningWorkflowConfig) => number;
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
export declare const getWorkflowExecutionStatus: (workflow: SigningWorkflowConfig) => WorkflowExecutionStatus;
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
export declare const createCounterSignatureWorkflow: (originalDocumentId: string, counterSigner: SignerInfo) => SigningWorkflowConfig;
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
export declare const voidSigningWorkflow: (workflow: SigningWorkflowConfig, reason: string) => NotificationConfig[];
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
export declare const exportWorkflowAuditTrail: (workflow: SigningWorkflowConfig) => Record<string, any>;
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
export declare const isWorkflowExpired: (workflow: SigningWorkflowConfig) => boolean;
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
export declare const extendWorkflowExpiration: (workflow: SigningWorkflowConfig, extensionDays: number) => SigningWorkflowConfig;
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
export declare const calculateTimeUntilExpiration: (workflow: SigningWorkflowConfig) => number;
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
export declare const generateWorkflowSummary: (workflow: SigningWorkflowConfig) => Record<string, any>;
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
export declare const validateWorkflowConfiguration: (workflow: SigningWorkflowConfig) => string[];
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
export declare const cloneWorkflow: (workflow: SigningWorkflowConfig, newDocumentId: string) => SigningWorkflowConfig;
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
export declare const mergeWorkflows: (workflows: SigningWorkflowConfig[], documentId: string) => SigningWorkflowConfig;
/**
 * Signing Workflow Service
 * Production-ready NestJS service for document signing workflow operations
 */
export declare class SigningWorkflowService {
    /**
     * Initiates a new signing workflow
     */
    initiateWorkflow(documentId: string, workflowType: WorkflowType, signers: SignerInfo[]): Promise<SigningWorkflowConfig>;
    /**
     * Processes signer action
     */
    processSignerAction(workflowId: string, signerId: string, action: 'sign' | 'decline'): Promise<WorkflowExecutionStatus>;
}
declare const _default: {
    SigningWorkflowConfigModel: typeof SigningWorkflowConfigModel;
    SigningSessionModel: typeof SigningSessionModel;
    BulkSigningOperationModel: typeof BulkSigningOperationModel;
    createSigningWorkflow: (documentId: string, workflowType: WorkflowType, signers: SignerInfo[], options?: Partial<SigningWorkflowConfig>) => SigningWorkflowConfig;
    addSignerToWorkflow: (workflow: SigningWorkflowConfig, signer: SignerInfo) => SigningWorkflowConfig;
    removeSignerFromWorkflow: (workflow: SigningWorkflowConfig, signerId: string) => SigningWorkflowConfig;
    updateSignerRoutingOrder: (workflow: SigningWorkflowConfig, orderUpdates: Array<{
        signerId: string;
        order: number;
    }>) => SigningWorkflowConfig;
    getNextSigner: (workflow: SigningWorkflowConfig) => SignerInfo | null;
    areAllSignersComplete: (workflow: SigningWorkflowConfig) => boolean;
    createSignatureField: (type: FieldType, pageNumber: number, x: number, y: number, options?: Partial<SignatureField>) => SignatureField;
    validateSignatureFieldPlacement: (field: SignatureField, pageWidth: number, pageHeight: number) => boolean;
    generateSigningSession: (documentId: string, signerId: string, expirationMinutes?: number) => SigningSession;
    validateSigningSession: (session: SigningSession, token: string) => boolean;
    markSignerComplete: (signer: SignerInfo, ipAddress: string) => SignerInfo;
    createSigningReminder: (signer: SignerInfo, documentName: string) => NotificationConfig;
    scheduleAutomaticReminders: (workflow: SigningWorkflowConfig, documentName: string) => NotificationConfig[];
    sendSignatureRequest: (signer: SignerInfo, documentName: string, signingUrl: string) => NotificationConfig;
    createBulkSigningOperation: (templateId: string, recipients: BulkRecipient[], operationName: string) => BulkSigningOperation;
    processBulkRecipient: (operation: BulkSigningOperation, recipientId: string) => BulkSigningOperation;
    isBulkOperationComplete: (operation: BulkSigningOperation) => boolean;
    updateBulkOperationStats: (operation: BulkSigningOperation, success: boolean) => BulkSigningOperation;
    createApprovalChain: (approvers: ApproverInfo[], routingOrder: RoutingOrder) => ApproverInfo[];
    getNextApprover: (approvers: ApproverInfo[]) => ApproverInfo | null;
    markApproverDecision: (approver: ApproverInfo, decision: ApprovalStatus, comments?: string) => ApproverInfo;
    areAllApproversApproved: (approvers: ApproverInfo[]) => boolean;
    delegateApproval: (approver: ApproverInfo, delegate: ApproverInfo) => ApproverInfo;
    authenticateSignerWithCode: (providedCode: string, expectedCode: string) => boolean;
    generateAccessCode: (length?: number) => string;
    validateSignerEmail: (email: string) => boolean;
    validateSignerPhone: (phone: string) => boolean;
    calculateWorkflowCompletionPercentage: (workflow: SigningWorkflowConfig) => number;
    getWorkflowExecutionStatus: (workflow: SigningWorkflowConfig) => WorkflowExecutionStatus;
    createCounterSignatureWorkflow: (originalDocumentId: string, counterSigner: SignerInfo) => SigningWorkflowConfig;
    voidSigningWorkflow: (workflow: SigningWorkflowConfig, reason: string) => NotificationConfig[];
    exportWorkflowAuditTrail: (workflow: SigningWorkflowConfig) => Record<string, any>;
    isWorkflowExpired: (workflow: SigningWorkflowConfig) => boolean;
    extendWorkflowExpiration: (workflow: SigningWorkflowConfig, extensionDays: number) => SigningWorkflowConfig;
    calculateTimeUntilExpiration: (workflow: SigningWorkflowConfig) => number;
    generateWorkflowSummary: (workflow: SigningWorkflowConfig) => Record<string, any>;
    validateWorkflowConfiguration: (workflow: SigningWorkflowConfig) => string[];
    cloneWorkflow: (workflow: SigningWorkflowConfig, newDocumentId: string) => SigningWorkflowConfig;
    mergeWorkflows: (workflows: SigningWorkflowConfig[], documentId: string) => SigningWorkflowConfig;
    SigningWorkflowService: typeof SigningWorkflowService;
};
export default _default;
//# sourceMappingURL=document-signing-workflow-composite.d.ts.map