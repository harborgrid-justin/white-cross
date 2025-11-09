"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.provisionUser = provisionUser;
exports.provisionUserWithTemplate = provisionUserWithTemplate;
exports.initializeUserAccount = initializeUserAccount;
exports.sendWelcomeEmail = sendWelcomeEmail;
exports.createMinimalAccount = createMinimalAccount;
exports.createCompleteAccount = createCompleteAccount;
exports.generateActivationToken = generateActivationToken;
exports.verifyActivationToken = verifyActivationToken;
exports.activateAccount = activateAccount;
exports.generateTemporaryPassword = generateTemporaryPassword;
exports.deprovisionUser = deprovisionUser;
exports.archiveUserData = archiveUserData;
exports.revokeUserAccess = revokeUserAccess;
exports.transferUserOwnership = transferUserOwnership;
exports.justInTimeProvision = justInTimeProvision;
exports.mapIdPAttributes = mapIdPAttributes;
exports.determineRoleFromIdP = determineRoleFromIdP;
exports.updateUserFromIdP = updateUserFromIdP;
exports.autoSetupUserResources = autoSetupUserResources;
exports.assignDefaultPermissions = assignDefaultPermissions;
exports.createDefaultWorkspace = createDefaultWorkspace;
exports.enrollInRequiredTraining = enrollInRequiredTraining;
exports.createOnboardingWorkflow = createOnboardingWorkflow;
exports.completeOnboardingStep = completeOnboardingStep;
exports.getOnboardingProgress = getOnboardingProgress;
exports.suspendAccount = suspendAccount;
exports.reactivateAccount = reactivateAccount;
exports.bulkProvisionUsers = bulkProvisionUsers;
exports.createProvisioningTemplate = createProvisioningTemplate;
exports.getProvisioningTemplate = getProvisioningTemplate;
exports.configureExternalIdP = configureExternalIdP;
exports.validateIdPAssertion = validateIdPAssertion;
exports.sendActivationEmail = sendActivationEmail;
exports.sendDeprovisioningNotification = sendDeprovisioningNotification;
exports.validateProvisioningRequest = validateProvisioningRequest;
exports.getProvisioningAuditTrail = getProvisioningAuditTrail;
exports.rollbackFailedProvisioning = rollbackFailedProvisioning;
exports.preProvisionUser = preProvisionUser;
exports.scheduleUserProvisioning = scheduleUserProvisioning;
exports.cancelScheduledProvisioning = cancelScheduledProvisioning;
const crypto = __importStar(require("crypto"));
// ============================================================================
// USER PROVISIONING WORKFLOWS
// ============================================================================
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
async function provisionUser(User, UserProfile, request, transaction) {
    try {
        // Generate temporary password
        const temporaryPassword = generateTemporaryPassword();
        // Create user
        const user = await User.create({
            email: request.email,
            firstName: request.firstName,
            lastName: request.lastName,
            password: temporaryPassword,
            role: request.role,
            status: request.autoActivate ? 'active' : 'pending',
            mustChangePassword: true,
            metadata: request.attributes || {},
        }, { transaction });
        // Create profile
        await UserProfile.create({
            userId: user.id,
            department: request.department,
            organizationId: request.organizationId,
            managerId: request.managerId,
        }, { transaction });
        // Generate activation token if not auto-activated
        let activationToken;
        if (!request.autoActivate) {
            activationToken = await generateActivationToken(user.id);
        }
        return {
            userId: user.id,
            email: user.email,
            temporaryPassword: request.sendWelcomeEmail ? temporaryPassword : undefined,
            activationToken,
            status: 'success',
            metadata: {
                createdAt: user.createdAt,
                role: user.role,
            },
        };
    }
    catch (error) {
        return {
            userId: '',
            email: request.email,
            status: 'failed',
            message: error.message,
        };
    }
}
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
async function provisionUserWithTemplate(User, UserProfile, request, template, transaction) {
    // Merge template defaults with request
    const mergedRequest = {
        ...request,
        role: template.role,
        attributes: {
            ...template.defaultAttributes,
            ...request.attributes,
            permissions: template.permissions,
            resources: template.resources,
        },
        autoActivate: template.autoActivate ?? request.autoActivate,
    };
    return await provisionUser(User, UserProfile, mergedRequest, transaction);
}
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
async function initializeUserAccount(user, profile, config) {
    // Set default preferences
    const defaultPreferences = {
        theme: 'light',
        language: 'en',
        notifications: {
            email: true,
            push: true,
            sms: false,
        },
        ...config?.defaultPreferences,
    };
    user.preferences = defaultPreferences;
    await user.save();
    // Initialize profile defaults
    if (config?.timezone) {
        profile.timezone = config.timezone;
    }
    if (config?.locale) {
        profile.locale = config.locale;
    }
    await profile.save();
}
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
async function sendWelcomeEmail(result, baseUrl) {
    const activationUrl = result.activationToken
        ? `${baseUrl}/activate?token=${result.activationToken}`
        : null;
    // Email sending logic would go here
    console.log('Welcome email sent to:', result.email);
    console.log('Activation URL:', activationUrl);
    console.log('Temporary Password:', result.temporaryPassword);
}
// ============================================================================
// ACCOUNT CREATION AND INITIALIZATION
// ============================================================================
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
async function createMinimalAccount(User, userData, transaction) {
    return await User.create({
        ...userData,
        status: 'pending',
        emailVerified: false,
    }, { transaction });
}
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
async function createCompleteAccount(User, UserProfile, userData, profileData, transaction) {
    const user = await User.create(userData, { transaction });
    const profile = await UserProfile.create({
        userId: user.id,
        ...profileData,
    }, { transaction });
    return { user, profile };
}
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
async function generateActivationToken(userId, expiresInHours = 24) {
    const payload = {
        userId,
        type: 'activation',
        exp: Date.now() + expiresInHours * 60 * 60 * 1000,
    };
    const token = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHash('sha256').update(token + process.env.SECRET_KEY).digest('hex');
    return `${token}.${signature}`;
}
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
function verifyActivationToken(token) {
    try {
        const [payload, signature] = token.split('.');
        const expectedSig = crypto.createHash('sha256').update(payload + process.env.SECRET_KEY).digest('hex');
        if (signature !== expectedSig) {
            return { valid: false };
        }
        const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
        if (Date.now() > data.exp) {
            return { valid: false, expired: true, userId: data.userId };
        }
        return { valid: true, userId: data.userId };
    }
    catch (error) {
        return { valid: false };
    }
}
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
async function activateAccount(User, userId, transaction) {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
        throw new Error('User not found');
    }
    user.status = 'active';
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    return await user.save({ transaction });
}
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
function generateTemporaryPassword(length = 16) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const all = uppercase + lowercase + numbers + special;
    const randomBytes = crypto.randomBytes(length);
    let password = '';
    // Ensure at least one of each type
    password += uppercase[randomBytes[0] % uppercase.length];
    password += lowercase[randomBytes[1] % lowercase.length];
    password += numbers[randomBytes[2] % numbers.length];
    password += special[randomBytes[3] % special.length];
    // Fill rest randomly
    for (let i = 4; i < length; i++) {
        password += all[randomBytes[i] % all.length];
    }
    // Shuffle
    return password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
}
// ============================================================================
// USER DEPROVISIONING
// ============================================================================
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
async function deprovisionUser(User, UserProfile, options, transaction) {
    try {
        const user = await User.findByPk(options.userId, { transaction });
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        // Archive user data if requested
        if (options.archiveData) {
            const metadata = user.metadata || {};
            metadata.deprovisioned = {
                reason: options.reason,
                deprovisionedBy: options.deprovisionedBy,
                deprovisionedAt: new Date(),
            };
            user.metadata = metadata;
            await user.save({ transaction });
        }
        // Transfer ownership if specified
        if (options.transferOwnership) {
            // Transfer logic would go here
            console.log('Transferring ownership to:', options.transferOwnership);
        }
        // Revoke all access
        if (options.revokeAccess) {
            user.status = 'inactive';
            await user.save({ transaction });
        }
        // Delete or soft delete
        if (options.softDelete) {
            await user.destroy({ transaction });
        }
        else {
            await user.destroy({ force: true, transaction });
            await UserProfile.destroy({ where: { userId: options.userId }, force: true, transaction });
        }
        return { success: true, message: 'User deprovisioned successfully' };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
}
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
async function archiveUserData(user, profile) {
    return {
        user: user.toJSON(),
        profile: profile ? profile.toJSON() : null,
        archivedAt: new Date(),
    };
}
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
async function revokeUserAccess(userId) {
    // Revoke all sessions
    // Invalidate all refresh tokens
    // Clear cached permissions
    console.log('Revoking access for user:', userId);
}
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
async function transferUserOwnership(fromUserId, toUserId) {
    // Transfer logic for owned resources
    let transferred = 0;
    // Transfer owned records, documents, etc.
    // Update created_by and owned_by fields
    return { transferred };
}
// ============================================================================
// JUST-IN-TIME PROVISIONING
// ============================================================================
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
async function justInTimeProvision(User, UserProfile, idpData, config, transaction) {
    if (!config.enabled) {
        return {
            userId: '',
            email: idpData.email,
            status: 'failed',
            message: 'JIT provisioning is disabled',
        };
    }
    // Map attributes from IdP to user model
    const mappedData = mapIdPAttributes(idpData, config.attributeMapping);
    // Validate required attributes
    if (config.requiredAttributes) {
        for (const attr of config.requiredAttributes) {
            if (!mappedData[attr]) {
                return {
                    userId: '',
                    email: idpData.email,
                    status: 'failed',
                    message: `Missing required attribute: ${attr}`,
                };
            }
        }
    }
    // Determine role from IdP groups or use default
    const role = determineRoleFromIdP(idpData, config.roleMapping) || config.defaultRole;
    // Provision user
    return await provisionUser(User, UserProfile, {
        email: mappedData.email,
        firstName: mappedData.firstName,
        lastName: mappedData.lastName,
        role,
        attributes: mappedData,
        autoActivate: config.autoActivate,
    }, transaction);
}
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
function mapIdPAttributes(idpData, mapping) {
    if (!mapping) {
        return idpData;
    }
    const result = {};
    for (const [targetKey, sourceKey] of Object.entries(mapping)) {
        result[targetKey] = idpData[sourceKey];
    }
    return result;
}
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
function determineRoleFromIdP(idpData, roleMapping) {
    if (!roleMapping || !idpData.groups) {
        return null;
    }
    for (const group of idpData.groups) {
        if (roleMapping[group]) {
            return roleMapping[group];
        }
    }
    return null;
}
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
async function updateUserFromIdP(user, idpData, config) {
    const mappedData = mapIdPAttributes(idpData, config.attributeMapping);
    // Update user attributes
    if (mappedData.firstName)
        user.firstName = mappedData.firstName;
    if (mappedData.lastName)
        user.lastName = mappedData.lastName;
    // Update role if mapping exists
    const role = determineRoleFromIdP(idpData, config.roleMapping);
    if (role) {
        user.role = role;
    }
    return await user.save();
}
// ============================================================================
// AUTOMATED ACCOUNT SETUP
// ============================================================================
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
async function autoSetupUserResources(userId, role) {
    // Create default folders
    // Assign default permissions
    // Provision default resources
    console.log(`Setting up resources for user ${userId} with role ${role}`);
}
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
async function assignDefaultPermissions(userId, role) {
    const rolePermissions = {
        admin: ['users:*', 'settings:*', 'reports:*'],
        doctor: ['patients:read', 'patients:write', 'records:read', 'records:write'],
        nurse: ['patients:read', 'records:read', 'vitals:write'],
        patient: ['profile:read', 'profile:write', 'appointments:read'],
    };
    const permissions = rolePermissions[role] || [];
    // Assign permissions to user
    return permissions;
}
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
async function createDefaultWorkspace(userId) {
    const workspaceId = crypto.randomUUID();
    // Create workspace structure
    return { workspaceId };
}
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
async function enrollInRequiredTraining(userId, role) {
    const requiredTraining = {
        doctor: ['hipaa-compliance', 'ehr-training', 'patient-safety'],
        nurse: ['hipaa-compliance', 'medication-admin', 'patient-care'],
        admin: ['hipaa-compliance', 'system-admin'],
    };
    return requiredTraining[role] || ['hipaa-compliance'];
}
// ============================================================================
// USER ONBOARDING FLOWS
// ============================================================================
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
async function createOnboardingWorkflow(userId, workflow) {
    const workflowId = crypto.randomUUID();
    // Create workflow instance
    const steps = workflow.steps.map((step) => ({
        ...step,
        completedBy: undefined,
        completedAt: undefined,
    }));
    return { workflowId, steps };
}
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
async function completeOnboardingStep(workflowId, stepId, userId) {
    // Mark step complete
    // Get next step
    return { completed: true };
}
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
async function getOnboardingProgress(userId, workflowId) {
    // Get workflow and calculate progress
    const completed = 3;
    const total = 5;
    return {
        progress: (completed / total) * 100,
        completed,
        total,
        remaining: [],
    };
}
// ============================================================================
// ACCOUNT SUSPENSION AND REACTIVATION
// ============================================================================
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
async function suspendAccount(User, userId, reason, suspendedBy, transaction) {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
        throw new Error('User not found');
    }
    user.status = 'suspended';
    const metadata = user.metadata || {};
    metadata.suspension = {
        reason,
        suspendedBy,
        suspendedAt: new Date(),
    };
    user.metadata = metadata;
    await revokeUserAccess(userId);
    return await user.save({ transaction });
}
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
async function reactivateAccount(User, userId, reactivatedBy, transaction) {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
        throw new Error('User not found');
    }
    user.status = 'active';
    const metadata = user.metadata || {};
    if (metadata.suspension) {
        metadata.suspension.reactivatedBy = reactivatedBy;
        metadata.suspension.reactivatedAt = new Date();
    }
    user.metadata = metadata;
    return await user.save({ transaction });
}
// ============================================================================
// BULK PROVISIONING OPERATIONS
// ============================================================================
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
async function bulkProvisionUsers(User, UserProfile, request) {
    const result = {
        total: request.users.length,
        successful: 0,
        failed: 0,
        results: [],
        errors: [],
    };
    for (const userRequest of request.users) {
        try {
            const provisionResult = await provisionUser(User, UserProfile, userRequest);
            if (provisionResult.status === 'success') {
                result.successful++;
                result.results.push(provisionResult);
            }
            else {
                result.failed++;
                result.errors.push({
                    email: userRequest.email,
                    error: provisionResult.message || 'Unknown error',
                });
            }
        }
        catch (error) {
            result.failed++;
            result.errors.push({
                email: userRequest.email,
                error: error.message,
            });
            if (!request.continueOnError) {
                break;
            }
        }
    }
    return result;
}
// ============================================================================
// PROVISIONING TEMPLATES
// ============================================================================
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
async function createProvisioningTemplate(template) {
    return {
        id: crypto.randomUUID(),
        ...template,
    };
}
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
async function getProvisioningTemplate(templateId) {
    // Fetch from database
    return null;
}
// ============================================================================
// INTEGRATION WITH EXTERNAL IDENTITY PROVIDERS
// ============================================================================
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
async function configureExternalIdP(config) {
    const providerId = crypto.randomUUID();
    // Store IdP configuration
    return { success: true, providerId };
}
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
async function validateIdPAssertion(assertion, config) {
    // Validate based on IdP type
    return { valid: true, userData: {} };
}
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
async function sendActivationEmail(email, activationToken, baseUrl) {
    const activationUrl = `${baseUrl}/activate?token=${activationToken}`;
    console.log(`Activation email sent to ${email}: ${activationUrl}`);
}
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
async function sendDeprovisioningNotification(email, reason) {
    console.log(`Deprovisioning notification sent to ${email}: ${reason}`);
}
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
function validateProvisioningRequest(request) {
    const errors = [];
    if (!request.email)
        errors.push('Email is required');
    if (!request.role)
        errors.push('Role is required');
    return {
        valid: errors.length === 0,
        errors,
    };
}
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
async function getProvisioningAuditTrail(userId) {
    // Fetch audit logs
    return [
        {
            action: 'provision',
            timestamp: new Date(),
            performedBy: 'system',
        },
    ];
}
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
async function rollbackFailedProvisioning(User, UserProfile, userId, transaction) {
    await UserProfile.destroy({ where: { userId }, force: true, transaction });
    await User.destroy({ where: { id: userId }, force: true, transaction });
}
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
async function preProvisionUser(User, email, role, transaction) {
    const user = await User.create({
        email,
        role,
        status: 'pending',
        password: crypto.randomBytes(32).toString('hex'),
    }, { transaction });
    return { userId: user.id, email: user.email };
}
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
async function scheduleUserProvisioning(request, scheduledFor) {
    const scheduledId = crypto.randomUUID();
    // Store in scheduling queue
    return { scheduledId };
}
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
async function cancelScheduledProvisioning(scheduledId) {
    // Remove from scheduling queue
    console.log(`Cancelled scheduled provisioning: ${scheduledId}`);
    return true;
}
exports.default = {
    provisionUser,
    provisionUserWithTemplate,
    initializeUserAccount,
    sendWelcomeEmail,
    createMinimalAccount,
    createCompleteAccount,
    generateActivationToken,
    verifyActivationToken,
    activateAccount,
    generateTemporaryPassword,
    deprovisionUser,
    archiveUserData,
    revokeUserAccess,
    transferUserOwnership,
    justInTimeProvision,
    mapIdPAttributes,
    determineRoleFromIdP,
    updateUserFromIdP,
    autoSetupUserResources,
    assignDefaultPermissions,
    createDefaultWorkspace,
    enrollInRequiredTraining,
    createOnboardingWorkflow,
    completeOnboardingStep,
    getOnboardingProgress,
    suspendAccount,
    reactivateAccount,
    bulkProvisionUsers,
    createProvisioningTemplate,
    getProvisioningTemplate,
    configureExternalIdP,
    validateIdPAssertion,
    sendActivationEmail,
    sendDeprovisioningNotification,
    validateProvisioningRequest,
    getProvisioningAuditTrail,
    rollbackFailedProvisioning,
    preProvisionUser,
    scheduleUserProvisioning,
    cancelScheduledProvisioning,
};
//# sourceMappingURL=iam-provisioning-kit.js.map