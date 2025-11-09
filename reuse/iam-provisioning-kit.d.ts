/**
 * LOC: IAM-PROV-001
 * File: /reuse/iam-provisioning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common (v10.x)
 *   - crypto (node built-in)
 *
 * DOWNSTREAM (imported by):
 *   - IAM provisioning services
 *   - User onboarding modules
 *   - Account management controllers
 *   - Identity provider integrations
 */
/**
 * File: /reuse/iam-provisioning-kit.ts
 * Locator: WC-IAM-PROV-001
 * Purpose: IAM Provisioning Kit - Comprehensive user provisioning and lifecycle management
 *
 * Upstream: sequelize v6.x, @nestjs/common, crypto, uuid
 * Downstream: All IAM provisioning services, onboarding workflows, IdP integrations
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, NestJS 10.x
 * Exports: 40 functions for provisioning, deprovisioning, JIT, onboarding, templates, IdP
 *
 * LLM Context: Production-grade IAM user provisioning utilities for White Cross healthcare platform.
 * Provides comprehensive user provisioning workflows, account creation and initialization,
 * deprovisioning, just-in-time provisioning, automated account setup, user onboarding flows,
 * account suspension and reactivation, bulk provisioning operations, provisioning templates,
 * and integration with external identity providers (SAML, OAuth, LDAP). HIPAA-compliant
 * with audit trails and secure credential management.
 */
import { ModelStatic, Transaction } from 'sequelize';
/**
 * Provisioning request
 */
export interface ProvisioningRequest {
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    department?: string;
    organizationId?: string;
    managerId?: string;
    attributes?: Record<string, any>;
    sendWelcomeEmail?: boolean;
    autoActivate?: boolean;
    templateId?: string;
}
/**
 * Provisioning result
 */
export interface ProvisioningResult {
    userId: string;
    username?: string;
    email: string;
    temporaryPassword?: string;
    activationToken?: string;
    status: 'success' | 'pending' | 'failed';
    message?: string;
    metadata?: any;
}
/**
 * Deprovisioning options
 */
export interface DeprovisioningOptions {
    userId: string;
    reason: string;
    deprovisionedBy: string;
    softDelete?: boolean;
    revokeAccess?: boolean;
    transferOwnership?: string;
    archiveData?: boolean;
    notifyUser?: boolean;
}
/**
 * JIT provisioning configuration
 */
export interface JITProvisioningConfig {
    enabled: boolean;
    defaultRole: string;
    autoActivate: boolean;
    attributeMapping?: Record<string, string>;
    requiredAttributes?: string[];
    roleMapping?: Record<string, string>;
}
/**
 * Onboarding workflow
 */
export interface OnboardingWorkflow {
    id: string;
    name: string;
    steps: OnboardingStep[];
    assignedRoles?: string[];
    requiredFor?: string[];
}
/**
 * Onboarding step
 */
export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    order: number;
    required: boolean;
    type: 'form' | 'approval' | 'training' | 'document' | 'verification';
    config?: any;
    completedBy?: string;
    completedAt?: Date;
}
/**
 * Provisioning template
 */
export interface ProvisioningTemplate {
    id: string;
    name: string;
    description?: string;
    role: string;
    defaultAttributes?: Record<string, any>;
    permissions?: string[];
    resources?: string[];
    workflows?: string[];
    autoActivate?: boolean;
}
/**
 * Bulk provisioning request
 */
export interface BulkProvisioningRequest {
    users: ProvisioningRequest[];
    templateId?: string;
    dryRun?: boolean;
    continueOnError?: boolean;
}
/**
 * Bulk provisioning result
 */
export interface BulkProvisioningResult {
    total: number;
    successful: number;
    failed: number;
    results: ProvisioningResult[];
    errors: Array<{
        email: string;
        error: string;
    }>;
}
/**
 * External identity provider configuration
 */
export interface ExternalIdPConfig {
    type: 'saml' | 'oauth' | 'ldap' | 'oidc';
    name: string;
    enabled: boolean;
    config: any;
    attributeMapping?: Record<string, string>;
    jitProvisioning?: JITProvisioningConfig;
}
/**
 * Account activation data
 */
export interface AccountActivation {
    userId: string;
    activationToken: string;
    expiresAt: Date;
    email: string;
    metadata?: any;
}
/**
 * Provisions a new user account with complete setup.
 * Creates user, profile, assigns roles, and initializes resources.
 *
 * @param {any} User - User model
 * @param {any} UserProfile - UserProfile model
 * @param {ProvisioningRequest} request - Provisioning request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProvisioningResult>} Provisioning result
 *
 * @example
 * ```typescript
 * const result = await provisionUser(User, UserProfile, {
 *   email: 'doctor@hospital.com',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   role: 'doctor',
 *   department: 'Cardiology',
 *   sendWelcomeEmail: true,
 *   autoActivate: false
 * });
 * console.log('Activation token:', result.activationToken);
 * ```
 */
export declare function provisionUser(User: ModelStatic<any>, UserProfile: ModelStatic<any>, request: ProvisioningRequest, transaction?: Transaction): Promise<ProvisioningResult>;
/**
 * Provisions a user with a specific template.
 * Applies template configuration during provisioning.
 *
 * @param {any} User - User model
 * @param {any} UserProfile - UserProfile model
 * @param {ProvisioningRequest} request - Provisioning request
 * @param {ProvisioningTemplate} template - Provisioning template
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProvisioningResult>} Provisioning result
 *
 * @example
 * ```typescript
 * const template = await getProvisioningTemplate('doctor-template');
 * const result = await provisionUserWithTemplate(User, UserProfile, request, template);
 * ```
 */
export declare function provisionUserWithTemplate(User: ModelStatic<any>, UserProfile: ModelStatic<any>, request: ProvisioningRequest, template: ProvisioningTemplate, transaction?: Transaction): Promise<ProvisioningResult>;
/**
 * Initializes a newly provisioned user account.
 * Sets up default preferences, resources, and permissions.
 *
 * @param {any} user - User instance
 * @param {any} profile - UserProfile instance
 * @param {Record<string, any>} [config] - Initialization config
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await initializeUserAccount(user, profile, {
 *   defaultPreferences: { theme: 'light', notifications: true },
 *   assignedResources: ['resource-1', 'resource-2']
 * });
 * ```
 */
export declare function initializeUserAccount(user: any, profile: any, config?: Record<string, any>): Promise<void>;
/**
 * Sends welcome email with activation link and credentials.
 * Includes account setup instructions.
 *
 * @param {ProvisioningResult} result - Provisioning result
 * @param {string} baseUrl - Application base URL
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendWelcomeEmail(provisioningResult, 'https://app.whitecross.com');
 * ```
 */
export declare function sendWelcomeEmail(result: ProvisioningResult, baseUrl: string): Promise<void>;
/**
 * Creates a minimal user account.
 * Creates user without profile or extended setup.
 *
 * @param {any} User - User model
 * @param {Partial<any>} userData - User data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created user
 *
 * @example
 * ```typescript
 * const user = await createMinimalAccount(User, {
 *   email: 'user@example.com',
 *   password: 'tempPass123',
 *   role: 'patient'
 * });
 * ```
 */
export declare function createMinimalAccount(User: ModelStatic<any>, userData: Partial<any>, transaction?: Transaction): Promise<any>;
/**
 * Creates a complete user account with profile.
 * Creates both user and profile in single transaction.
 *
 * @param {any} User - User model
 * @param {any} UserProfile - UserProfile model
 * @param {Partial<any>} userData - User data
 * @param {Partial<any>} profileData - Profile data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{user: any, profile: any}>} Created user and profile
 *
 * @example
 * ```typescript
 * const { user, profile } = await createCompleteAccount(
 *   User,
 *   UserProfile,
 *   { email: 'doc@hospital.com', role: 'doctor' },
 *   { department: 'Cardiology', licenseNumber: 'MD123456' }
 * );
 * ```
 */
export declare function createCompleteAccount(User: ModelStatic<any>, UserProfile: ModelStatic<any>, userData: Partial<any>, profileData: Partial<any>, transaction?: Transaction): Promise<{
    user: any;
    profile: any;
}>;
/**
 * Generates a secure activation token.
 * Creates time-limited token for account activation.
 *
 * @param {string} userId - User ID
 * @param {number} [expiresInHours=24] - Expiration time in hours
 * @returns {Promise<string>} Activation token
 *
 * @example
 * ```typescript
 * const token = await generateActivationToken(userId, 48);
 * // Token valid for 48 hours
 * ```
 */
export declare function generateActivationToken(userId: string, expiresInHours?: number): Promise<string>;
/**
 * Verifies an activation token.
 * Validates token signature and expiration.
 *
 * @param {string} token - Activation token
 * @returns {{valid: boolean, userId?: string, expired?: boolean}} Validation result
 *
 * @example
 * ```typescript
 * const result = verifyActivationToken(token);
 * if (result.valid) {
 *   await activateAccount(result.userId);
 * }
 * ```
 */
export declare function verifyActivationToken(token: string): {
    valid: boolean;
    userId?: string;
    expired?: boolean;
};
/**
 * Activates a user account.
 * Changes status to active and verifies email.
 *
 * @param {any} User - User model
 * @param {string} userId - User ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Activated user
 *
 * @example
 * ```typescript
 * const user = await activateAccount(User, userId);
 * ```
 */
export declare function activateAccount(User: ModelStatic<any>, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Generates a temporary password.
 * Creates secure random password.
 *
 * @param {number} [length=16] - Password length
 * @returns {string} Temporary password
 *
 * @example
 * ```typescript
 * const tempPass = generateTemporaryPassword(20);
 * ```
 */
export declare function generateTemporaryPassword(length?: number): string;
/**
 * Deprovisions a user account.
 * Removes or archives user with complete cleanup.
 *
 * @param {any} User - User model
 * @param {any} UserProfile - UserProfile model
 * @param {DeprovisioningOptions} options - Deprovisioning options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{success: boolean, message: string}>} Deprovisioning result
 *
 * @example
 * ```typescript
 * await deprovisionUser(User, UserProfile, {
 *   userId: 'user-id',
 *   reason: 'Employee termination',
 *   deprovisionedBy: 'admin-id',
 *   softDelete: true,
 *   archiveData: true
 * });
 * ```
 */
export declare function deprovisionUser(User: ModelStatic<any>, UserProfile: ModelStatic<any>, options: DeprovisioningOptions, transaction?: Transaction): Promise<{
    success: boolean;
    message: string;
}>;
/**
 * Archives user data before deprovisioning.
 * Creates backup of user information.
 *
 * @param {any} user - User instance
 * @param {any} profile - UserProfile instance
 * @returns {Promise<any>} Archived data
 *
 * @example
 * ```typescript
 * const archive = await archiveUserData(user, profile);
 * // Store archive in long-term storage
 * ```
 */
export declare function archiveUserData(user: any, profile: any): Promise<any>;
/**
 * Revokes all user access and sessions.
 * Invalidates tokens and sessions.
 *
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeUserAccess(userId);
 * ```
 */
export declare function revokeUserAccess(userId: string): Promise<void>;
/**
 * Transfers user ownership to another user.
 * Reassigns owned resources and data.
 *
 * @param {string} fromUserId - Source user ID
 * @param {string} toUserId - Target user ID
 * @returns {Promise<{transferred: number}>} Transfer result
 *
 * @example
 * ```typescript
 * const result = await transferUserOwnership(departingUserId, replacementUserId);
 * console.log(`Transferred ${result.transferred} resources`);
 * ```
 */
export declare function transferUserOwnership(fromUserId: string, toUserId: string): Promise<{
    transferred: number;
}>;
/**
 * Provisions user just-in-time from external IdP.
 * Creates user account on first SSO login.
 *
 * @param {any} User - User model
 * @param {any} UserProfile - UserProfile model
 * @param {any} idpData - Identity provider data
 * @param {JITProvisioningConfig} config - JIT config
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProvisioningResult>} Provisioning result
 *
 * @example
 * ```typescript
 * const result = await justInTimeProvision(User, UserProfile, {
 *   email: 'user@company.com',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   groups: ['doctors']
 * }, jitConfig);
 * ```
 */
export declare function justInTimeProvision(User: ModelStatic<any>, UserProfile: ModelStatic<any>, idpData: any, config: JITProvisioningConfig, transaction?: Transaction): Promise<ProvisioningResult>;
/**
 * Maps IdP attributes to user attributes.
 * Applies attribute mapping configuration.
 *
 * @param {any} idpData - IdP data
 * @param {Record<string, string>} [mapping] - Attribute mapping
 * @returns {Record<string, any>} Mapped attributes
 *
 * @example
 * ```typescript
 * const mapped = mapIdPAttributes(samlData, {
 *   'email': 'emailAddress',
 *   'firstName': 'givenName',
 *   'lastName': 'surname'
 * });
 * ```
 */
export declare function mapIdPAttributes(idpData: any, mapping?: Record<string, string>): Record<string, any>;
/**
 * Determines user role from IdP groups or claims.
 * Maps external groups to internal roles.
 *
 * @param {any} idpData - IdP data
 * @param {Record<string, string>} [roleMapping] - Role mapping
 * @returns {string | null} Determined role
 *
 * @example
 * ```typescript
 * const role = determineRoleFromIdP(idpData, {
 *   'Doctors': 'doctor',
 *   'Nurses': 'nurse',
 *   'Admins': 'admin'
 * });
 * ```
 */
export declare function determineRoleFromIdP(idpData: any, roleMapping?: Record<string, string>): string | null;
/**
 * Updates existing user from IdP data.
 * Synchronizes user attributes with IdP.
 *
 * @param {any} user - User instance
 * @param {any} idpData - IdP data
 * @param {JITProvisioningConfig} config - JIT config
 * @returns {Promise<any>} Updated user
 *
 * @example
 * ```typescript
 * await updateUserFromIdP(user, idpData, jitConfig);
 * ```
 */
export declare function updateUserFromIdP(user: any, idpData: any, config: JITProvisioningConfig): Promise<any>;
/**
 * Automatically sets up user resources.
 * Creates default folders, permissions, and resources.
 *
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await autoSetupUserResources(userId, 'doctor');
 * ```
 */
export declare function autoSetupUserResources(userId: string, role: string): Promise<void>;
/**
 * Assigns default permissions based on role.
 * Applies role-based permission templates.
 *
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {Promise<string[]>} Assigned permissions
 *
 * @example
 * ```typescript
 * const permissions = await assignDefaultPermissions(userId, 'doctor');
 * console.log('Assigned permissions:', permissions);
 * ```
 */
export declare function assignDefaultPermissions(userId: string, role: string): Promise<string[]>;
/**
 * Creates default user workspace.
 * Sets up personal workspace and folders.
 *
 * @param {string} userId - User ID
 * @returns {Promise<{workspaceId: string}>} Workspace info
 *
 * @example
 * ```typescript
 * const { workspaceId } = await createDefaultWorkspace(userId);
 * ```
 */
export declare function createDefaultWorkspace(userId: string): Promise<{
    workspaceId: string;
}>;
/**
 * Enrolls user in required training.
 * Assigns mandatory training courses.
 *
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {Promise<string[]>} Assigned training IDs
 *
 * @example
 * ```typescript
 * const courses = await enrollInRequiredTraining(userId, 'doctor');
 * ```
 */
export declare function enrollInRequiredTraining(userId: string, role: string): Promise<string[]>;
/**
 * Creates an onboarding workflow for a user.
 * Initializes step-by-step onboarding process.
 *
 * @param {string} userId - User ID
 * @param {OnboardingWorkflow} workflow - Workflow definition
 * @returns {Promise<{workflowId: string, steps: OnboardingStep[]}>} Created workflow
 *
 * @example
 * ```typescript
 * const onboarding = await createOnboardingWorkflow(userId, doctorOnboardingWorkflow);
 * ```
 */
export declare function createOnboardingWorkflow(userId: string, workflow: OnboardingWorkflow): Promise<{
    workflowId: string;
    steps: OnboardingStep[];
}>;
/**
 * Completes an onboarding step.
 * Marks step as complete and progresses workflow.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} stepId - Step ID
 * @param {string} userId - User ID completing the step
 * @returns {Promise<{completed: boolean, nextStep?: OnboardingStep}>} Completion result
 *
 * @example
 * ```typescript
 * const result = await completeOnboardingStep(workflowId, stepId, userId);
 * if (result.nextStep) {
 *   console.log('Next step:', result.nextStep.title);
 * }
 * ```
 */
export declare function completeOnboardingStep(workflowId: string, stepId: string, userId: string): Promise<{
    completed: boolean;
    nextStep?: OnboardingStep;
}>;
/**
 * Gets onboarding progress for a user.
 * Returns completion status and remaining steps.
 *
 * @param {string} userId - User ID
 * @param {string} workflowId - Workflow ID
 * @returns {Promise<{progress: number, completed: number, total: number, remaining: OnboardingStep[]}>} Progress info
 *
 * @example
 * ```typescript
 * const progress = await getOnboardingProgress(userId, workflowId);
 * console.log(`${progress.completed}/${progress.total} steps completed`);
 * ```
 */
export declare function getOnboardingProgress(userId: string, workflowId: string): Promise<{
    progress: number;
    completed: number;
    total: number;
    remaining: OnboardingStep[];
}>;
/**
 * Suspends a user account with reason.
 * Temporarily disables account access.
 *
 * @param {any} User - User model
 * @param {string} userId - User ID
 * @param {string} reason - Suspension reason
 * @param {string} [suspendedBy] - Admin user ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Suspended user
 *
 * @example
 * ```typescript
 * await suspendAccount(User, userId, 'Policy violation', adminId);
 * ```
 */
export declare function suspendAccount(User: ModelStatic<any>, userId: string, reason: string, suspendedBy?: string, transaction?: Transaction): Promise<any>;
/**
 * Reactivates a suspended user account.
 * Restores account access.
 *
 * @param {any} User - User model
 * @param {string} userId - User ID
 * @param {string} [reactivatedBy] - Admin user ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reactivated user
 *
 * @example
 * ```typescript
 * await reactivateAccount(User, userId, adminId);
 * ```
 */
export declare function reactivateAccount(User: ModelStatic<any>, userId: string, reactivatedBy?: string, transaction?: Transaction): Promise<any>;
/**
 * Bulk provisions multiple users.
 * Creates multiple user accounts in batch.
 *
 * @param {any} User - User model
 * @param {any} UserProfile - UserProfile model
 * @param {BulkProvisioningRequest} request - Bulk provisioning request
 * @returns {Promise<BulkProvisioningResult>} Bulk provisioning result
 *
 * @example
 * ```typescript
 * const result = await bulkProvisionUsers(User, UserProfile, {
 *   users: [
 *     { email: 'user1@example.com', role: 'doctor' },
 *     { email: 'user2@example.com', role: 'nurse' }
 *   ],
 *   continueOnError: true
 * });
 * console.log(`Success: ${result.successful}, Failed: ${result.failed}`);
 * ```
 */
export declare function bulkProvisionUsers(User: ModelStatic<any>, UserProfile: ModelStatic<any>, request: BulkProvisioningRequest): Promise<BulkProvisioningResult>;
/**
 * Creates a provisioning template.
 * Defines reusable provisioning configuration.
 *
 * @param {Omit<ProvisioningTemplate, 'id'>} template - Template definition
 * @returns {Promise<ProvisioningTemplate>} Created template
 *
 * @example
 * ```typescript
 * const template = await createProvisioningTemplate({
 *   name: 'Doctor Template',
 *   role: 'doctor',
 *   defaultAttributes: { department: 'General' },
 *   permissions: ['patients:*', 'records:*']
 * });
 * ```
 */
export declare function createProvisioningTemplate(template: Omit<ProvisioningTemplate, 'id'>): Promise<ProvisioningTemplate>;
/**
 * Gets a provisioning template by ID.
 * Retrieves template configuration.
 *
 * @param {string} templateId - Template ID
 * @returns {Promise<ProvisioningTemplate | null>} Template or null
 *
 * @example
 * ```typescript
 * const template = await getProvisioningTemplate('template-id');
 * ```
 */
export declare function getProvisioningTemplate(templateId: string): Promise<ProvisioningTemplate | null>;
/**
 * Configures external identity provider.
 * Sets up IdP integration.
 *
 * @param {ExternalIdPConfig} config - IdP configuration
 * @returns {Promise<{success: boolean, providerId: string}>} Configuration result
 *
 * @example
 * ```typescript
 * await configureExternalIdP({
 *   type: 'saml',
 *   name: 'Corporate SSO',
 *   enabled: true,
 *   config: { entityId: '...', ssoUrl: '...' },
 *   jitProvisioning: { enabled: true, defaultRole: 'patient' }
 * });
 * ```
 */
export declare function configureExternalIdP(config: ExternalIdPConfig): Promise<{
    success: boolean;
    providerId: string;
}>;
/**
 * Validates external IdP assertion.
 * Verifies SAML/OAuth assertion from IdP.
 *
 * @param {string} assertion - IdP assertion
 * @param {ExternalIdPConfig} config - IdP configuration
 * @returns {Promise<{valid: boolean, userData?: any}>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateIdPAssertion(samlAssertion, idpConfig);
 * if (result.valid) {
 *   // Proceed with user authentication
 * }
 * ```
 */
export declare function validateIdPAssertion(assertion: string, config: ExternalIdPConfig): Promise<{
    valid: boolean;
    userData?: any;
}>;
/**
 * Sends account activation email.
 * Sends email with activation link to new user.
 *
 * @param {string} email - User email
 * @param {string} activationToken - Activation token
 * @param {string} baseUrl - Application base URL
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendActivationEmail('user@example.com', token, 'https://app.whitecross.com');
 * ```
 */
export declare function sendActivationEmail(email: string, activationToken: string, baseUrl: string): Promise<void>;
/**
 * Sends deprovisioning notification.
 * Notifies user of account deprovisioning.
 *
 * @param {string} email - User email
 * @param {string} reason - Deprovisioning reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendDeprovisioningNotification('user@example.com', 'Account closure requested');
 * ```
 */
export declare function sendDeprovisioningNotification(email: string, reason: string): Promise<void>;
/**
 * Validates provisioning request.
 * Checks if request has all required fields.
 *
 * @param {ProvisioningRequest} request - Provisioning request
 * @returns {{valid: boolean, errors: string[]}} Validation result
 *
 * @example
 * ```typescript
 * const result = validateProvisioningRequest(request);
 * if (!result.valid) {
 *   console.log('Errors:', result.errors);
 * }
 * ```
 */
export declare function validateProvisioningRequest(request: ProvisioningRequest): {
    valid: boolean;
    errors: string[];
};
/**
 * Gets provisioning audit trail.
 * Returns history of provisioning operations for a user.
 *
 * @param {string} userId - User ID
 * @returns {Promise<any[]>} Audit trail
 *
 * @example
 * ```typescript
 * const history = await getProvisioningAuditTrail(userId);
 * ```
 */
export declare function getProvisioningAuditTrail(userId: string): Promise<any[]>;
/**
 * Rolls back failed provisioning.
 * Cleans up partially created resources.
 *
 * @param {any} User - User model
 * @param {any} UserProfile - UserProfile model
 * @param {string} userId - User ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackFailedProvisioning(User, UserProfile, userId, transaction);
 * ```
 */
export declare function rollbackFailedProvisioning(User: ModelStatic<any>, UserProfile: ModelStatic<any>, userId: string, transaction?: Transaction): Promise<void>;
/**
 * Pre-provisions user account.
 * Creates placeholder account for future activation.
 *
 * @param {any} User - User model
 * @param {string} email - User email
 * @param {string} role - User role
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{userId: string, email: string}>} Pre-provisioning result
 *
 * @example
 * ```typescript
 * const result = await preProvisionUser(User, 'future@example.com', 'patient');
 * ```
 */
export declare function preProvisionUser(User: ModelStatic<any>, email: string, role: string, transaction?: Transaction): Promise<{
    userId: string;
    email: string;
}>;
/**
 * Schedules user provisioning.
 * Queues provisioning for future execution.
 *
 * @param {ProvisioningRequest} request - Provisioning request
 * @param {Date} scheduledFor - Schedule date/time
 * @returns {Promise<{scheduledId: string}>} Schedule info
 *
 * @example
 * ```typescript
 * const schedule = await scheduleUserProvisioning(request, new Date('2024-12-01'));
 * ```
 */
export declare function scheduleUserProvisioning(request: ProvisioningRequest, scheduledFor: Date): Promise<{
    scheduledId: string;
}>;
/**
 * Cancels scheduled provisioning.
 * Removes user from provisioning queue.
 *
 * @param {string} scheduledId - Scheduled provisioning ID
 * @returns {Promise<boolean>} True if cancelled successfully
 *
 * @example
 * ```typescript
 * await cancelScheduledProvisioning(scheduledId);
 * ```
 */
export declare function cancelScheduledProvisioning(scheduledId: string): Promise<boolean>;
declare const _default: {
    provisionUser: typeof provisionUser;
    provisionUserWithTemplate: typeof provisionUserWithTemplate;
    initializeUserAccount: typeof initializeUserAccount;
    sendWelcomeEmail: typeof sendWelcomeEmail;
    createMinimalAccount: typeof createMinimalAccount;
    createCompleteAccount: typeof createCompleteAccount;
    generateActivationToken: typeof generateActivationToken;
    verifyActivationToken: typeof verifyActivationToken;
    activateAccount: typeof activateAccount;
    generateTemporaryPassword: typeof generateTemporaryPassword;
    deprovisionUser: typeof deprovisionUser;
    archiveUserData: typeof archiveUserData;
    revokeUserAccess: typeof revokeUserAccess;
    transferUserOwnership: typeof transferUserOwnership;
    justInTimeProvision: typeof justInTimeProvision;
    mapIdPAttributes: typeof mapIdPAttributes;
    determineRoleFromIdP: typeof determineRoleFromIdP;
    updateUserFromIdP: typeof updateUserFromIdP;
    autoSetupUserResources: typeof autoSetupUserResources;
    assignDefaultPermissions: typeof assignDefaultPermissions;
    createDefaultWorkspace: typeof createDefaultWorkspace;
    enrollInRequiredTraining: typeof enrollInRequiredTraining;
    createOnboardingWorkflow: typeof createOnboardingWorkflow;
    completeOnboardingStep: typeof completeOnboardingStep;
    getOnboardingProgress: typeof getOnboardingProgress;
    suspendAccount: typeof suspendAccount;
    reactivateAccount: typeof reactivateAccount;
    bulkProvisionUsers: typeof bulkProvisionUsers;
    createProvisioningTemplate: typeof createProvisioningTemplate;
    getProvisioningTemplate: typeof getProvisioningTemplate;
    configureExternalIdP: typeof configureExternalIdP;
    validateIdPAssertion: typeof validateIdPAssertion;
    sendActivationEmail: typeof sendActivationEmail;
    sendDeprovisioningNotification: typeof sendDeprovisioningNotification;
    validateProvisioningRequest: typeof validateProvisioningRequest;
    getProvisioningAuditTrail: typeof getProvisioningAuditTrail;
    rollbackFailedProvisioning: typeof rollbackFailedProvisioning;
    preProvisionUser: typeof preProvisionUser;
    scheduleUserProvisioning: typeof scheduleUserProvisioning;
    cancelScheduledProvisioning: typeof cancelScheduledProvisioning;
};
export default _default;
//# sourceMappingURL=iam-provisioning-kit.d.ts.map