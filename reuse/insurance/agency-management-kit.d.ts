/**
 * LOC: INS-AGN-001
 * File: /reuse/insurance/agency-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - bcrypt
 *   - crypto (Node.js)
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Agency management controllers
 *   - Insurance services
 *   - Agent portal modules
 *   - Compliance services
 *   - Commission calculation services
 */
/**
 * File: /reuse/insurance/agency-management-kit.ts
 * Locator: WC-UTL-AGENCYMGMT-001
 * Purpose: Agency Management Kit - Comprehensive agency lifecycle, hierarchy, licensing, and compliance
 *
 * Upstream: @nestjs/common, sequelize, bcrypt, crypto, class-validator
 * Downstream: Agency controllers, insurance services, agent portals, compliance modules, commission services
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, bcrypt 5.x
 * Exports: 40 utility functions for agency onboarding, licensing, hierarchy, performance, compliance, and security
 *
 * LLM Context: Production-grade agency management utilities for White Cross insurance platform.
 * Provides agency onboarding, contracting, licensing management, appointment tracking, hierarchy management,
 * sub-agent operations, performance metrics, production quotas, termination workflows, agreement management,
 * portal access control with RBAC, territory assignments, product authorization, authority levels (binding/quoting),
 * audit trails, compliance checking, marketing materials, multi-agency distribution, and comprehensive security
 * with encryption, authentication guards, input validation, and HIPAA compliance for healthcare insurance.
 */
import { Sequelize } from 'sequelize';
/**
 * Agency status enumeration
 */
export declare enum AgencyStatus {
    PENDING = "pending",
    ACTIVE = "active",
    SUSPENDED = "suspended",
    TERMINATED = "terminated",
    INACTIVE = "inactive",
    UNDER_REVIEW = "under_review"
}
/**
 * Agency type enumeration
 */
export declare enum AgencyType {
    INDEPENDENT = "independent",
    CAPTIVE = "captive",
    GENERAL = "general",
    MANAGING_GENERAL = "managing_general",
    WHOLESALE = "wholesale",
    RETAIL = "retail"
}
/**
 * Authority level enumeration
 */
export declare enum AuthorityLevel {
    QUOTE_ONLY = "quote_only",
    BIND_APPROVAL = "bind_approval",
    BIND_AUTO = "bind_auto",
    BIND_FULL = "bind_full"
}
/**
 * Agency role enumeration for RBAC
 */
export declare enum AgencyRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    MANAGER = "manager",
    AGENT = "agent",
    SUB_AGENT = "sub_agent",
    VIEWER = "viewer"
}
/**
 * Agency onboarding configuration
 */
export interface AgencyOnboardingConfig {
    agencyName: string;
    agencyType: AgencyType;
    taxId: string;
    email: string;
    phone: string;
    address: AgencyAddress;
    ownerName: string;
    ownerEmail: string;
    licenseNumbers: string[];
    states: string[];
    eoBond?: number;
    initialProducts: string[];
}
/**
 * Agency address information
 */
export interface AgencyAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
/**
 * Agency contract configuration
 */
export interface AgencyContractConfig {
    agencyId: string;
    contractType: 'standard' | 'custom' | 'master' | 'sub_agent';
    effectiveDate: Date;
    expirationDate?: Date;
    commissionStructure: CommissionStructure;
    products: string[];
    territories: string[];
    authorityLevel: AuthorityLevel;
    eoRequirement: number;
    bondRequirement: number;
    terms: string;
}
/**
 * Commission structure configuration
 */
export interface CommissionStructure {
    newBusinessRate: number;
    renewalRate: number;
    tiered: boolean;
    tiers?: CommissionTier[];
    overrides?: boolean;
    bonusEligible?: boolean;
}
/**
 * Commission tier configuration
 */
export interface CommissionTier {
    minVolume: number;
    maxVolume?: number;
    rate: number;
}
/**
 * Agency licensing information
 */
export interface AgencyLicenseInfo {
    agencyId: string;
    state: string;
    licenseNumber: string;
    licenseType: string;
    issueDate: Date;
    expirationDate: Date;
    status: 'active' | 'expired' | 'suspended' | 'pending';
    resident: boolean;
    lines: string[];
}
/**
 * Agency appointment information
 */
export interface AgencyAppointment {
    agencyId: string;
    carrierId: string;
    state: string;
    appointmentDate: Date;
    expirationDate?: Date;
    status: 'active' | 'pending' | 'terminated';
    products: string[];
    authorityLevel: AuthorityLevel;
}
/**
 * Agency hierarchy node
 */
export interface AgencyHierarchyNode {
    agencyId: string;
    agencyName: string;
    agencyType: AgencyType;
    parentAgencyId?: string;
    level: number;
    childAgencies: AgencyHierarchyNode[];
    totalAgents: number;
    totalSubAgents: number;
}
/**
 * Sub-agent configuration
 */
export interface SubAgentConfig {
    parentAgencyId: string;
    subAgentName: string;
    subAgentEmail: string;
    licenseNumber: string;
    states: string[];
    products: string[];
    commissionSplit: number;
    authorityLevel: AuthorityLevel;
}
/**
 * Agency performance metrics
 */
export interface AgencyPerformanceMetrics {
    agencyId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    totalPolicies: number;
    newBusinessPolicies: number;
    renewalPolicies: number;
    totalPremium: number;
    totalCommission: number;
    lossRatio: number;
    retentionRate: number;
    quoteToBindRatio: number;
    averagePolicyValue: number;
    productMix: Record<string, number>;
}
/**
 * Production quota configuration
 */
export interface ProductionQuota {
    agencyId: string;
    period: 'monthly' | 'quarterly' | 'annual';
    year: number;
    quarter?: number;
    month?: number;
    targetPolicies: number;
    targetPremium: number;
    targetNewBusiness: number;
    minRetentionRate: number;
}
/**
 * Agency termination workflow
 */
export interface AgencyTerminationWorkflow {
    agencyId: string;
    terminationType: 'voluntary' | 'involuntary' | 'non_renewal';
    terminationDate: Date;
    reason: string;
    initiatedBy: string;
    noticeDate: Date;
    policiesInForce: number;
    commissionsDue: number;
    finalSettlement: number;
    bookOfBusinessTransfer?: string;
}
/**
 * Agency access control entry
 */
export interface AgencyAccessControl {
    userId: string;
    agencyId: string;
    role: AgencyRole;
    permissions: string[];
    grantedBy: string;
    grantedAt: Date;
    expiresAt?: Date;
    mfaRequired: boolean;
    ipWhitelist?: string[];
}
/**
 * Territory assignment
 */
export interface TerritoryAssignment {
    agencyId: string;
    territories: Territory[];
    exclusive: boolean;
    assignedDate: Date;
    effectiveDate: Date;
}
/**
 * Territory definition
 */
export interface Territory {
    state: string;
    counties?: string[];
    zipCodes?: string[];
    exclusive: boolean;
}
/**
 * Product authorization
 */
export interface ProductAuthorization {
    agencyId: string;
    productId: string;
    productName: string;
    authorityLevel: AuthorityLevel;
    effectiveDate: Date;
    expirationDate?: Date;
    maxBindLimit?: number;
    requiresApproval: boolean;
}
/**
 * Agency audit log entry
 */
export interface AgencyAuditLog {
    agencyId: string;
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, any>;
    severity: 'low' | 'medium' | 'high' | 'critical';
    complianceLevel?: 'HIPAA' | 'SOC2' | 'PCI';
}
/**
 * Marketing material metadata
 */
export interface MarketingMaterial {
    agencyId: string;
    materialId: string;
    materialType: 'brochure' | 'flyer' | 'email' | 'landing_page' | 'social_media';
    title: string;
    description: string;
    products: string[];
    complianceApproved: boolean;
    approvedBy?: string;
    approvedDate?: Date;
    expirationDate?: Date;
    fileUrl?: string;
    accessControl: string[];
}
/**
 * Multi-agency quote distribution
 */
export interface MultiAgencyQuoteDistribution {
    quoteId: string;
    primaryAgencyId: string;
    distributedAgencies: string[];
    distributionMethod: 'broadcast' | 'round_robin' | 'rule_based';
    distributionDate: Date;
    responses: QuoteResponse[];
}
/**
 * Quote response from agency
 */
export interface QuoteResponse {
    agencyId: string;
    responseDate: Date;
    status: 'quoted' | 'declined' | 'pending';
    quotedPremium?: number;
    carrierId?: string;
    notes?: string;
}
/**
 * Security context for operations
 */
export interface SecurityContext {
    userId: string;
    agencyId: string;
    role: AgencyRole;
    permissions: string[];
    ipAddress: string;
    sessionId: string;
    mfaVerified: boolean;
}
/**
 * Agency attributes
 */
export interface AgencyAttributes {
    id: string;
    agencyName: string;
    agencyType: AgencyType;
    taxIdEncrypted: string;
    email: string;
    phone: string;
    address: Record<string, any>;
    ownerName: string;
    ownerEmail: string;
    status: AgencyStatus;
    parentAgencyId?: string;
    eoBond?: number;
    contractSignedDate?: Date;
    effectiveDate?: Date;
    terminationDate?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Agency license attributes
 */
export interface AgencyLicenseAttributes {
    id: string;
    agencyId: string;
    state: string;
    licenseNumber: string;
    licenseType: string;
    issueDate: Date;
    expirationDate: Date;
    status: string;
    resident: boolean;
    lines: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Agency appointment attributes
 */
export interface AgencyAppointmentAttributes {
    id: string;
    agencyId: string;
    carrierId: string;
    state: string;
    appointmentDate: Date;
    expirationDate?: Date;
    status: string;
    products: string[];
    authorityLevel: AuthorityLevel;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Agency access control attributes
 */
export interface AgencyAccessControlAttributes {
    id: string;
    userId: string;
    agencyId: string;
    role: AgencyRole;
    permissions: string[];
    grantedBy: string;
    grantedAt: Date;
    expiresAt?: Date;
    mfaRequired: boolean;
    ipWhitelist?: string[];
    lastAccessAt?: Date;
    accessCount: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates Agency model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AgencyAttributes>>} Agency model
 *
 * @example
 * ```typescript
 * const AgencyModel = createAgencyModel(sequelize);
 * const agency = await AgencyModel.create({
 *   agencyName: 'ABC Insurance Agency',
 *   agencyType: AgencyType.INDEPENDENT,
 *   email: 'contact@abcinsurance.com',
 *   status: AgencyStatus.ACTIVE
 * });
 * ```
 */
export declare const createAgencyModel: (sequelize: Sequelize) => any;
/**
 * Creates AgencyLicense model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AgencyLicenseAttributes>>} AgencyLicense model
 *
 * @example
 * ```typescript
 * const LicenseModel = createAgencyLicenseModel(sequelize);
 * const license = await LicenseModel.create({
 *   agencyId: 'agency-123',
 *   state: 'CA',
 *   licenseNumber: 'CA-123456',
 *   licenseType: 'Property & Casualty',
 *   status: 'active'
 * });
 * ```
 */
export declare const createAgencyLicenseModel: (sequelize: Sequelize) => any;
/**
 * Creates AgencyAppointment model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AgencyAppointmentAttributes>>} AgencyAppointment model
 */
export declare const createAgencyAppointmentModel: (sequelize: Sequelize) => any;
/**
 * Creates AgencyAccessControl model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AgencyAccessControlAttributes>>} AgencyAccessControl model
 */
export declare const createAgencyAccessControlModel: (sequelize: Sequelize) => any;
/**
 * Encrypts sensitive data using AES-256-GCM.
 *
 * @param {string} plaintext - Data to encrypt
 * @param {string} encryptionKey - Encryption key
 * @returns {string} Encrypted data with IV and auth tag
 *
 * @example
 * ```typescript
 * const encrypted = encryptSensitiveData('123-45-6789', process.env.ENCRYPTION_KEY);
 * ```
 */
export declare const encryptSensitiveData: (plaintext: string, encryptionKey: string) => string;
/**
 * Decrypts sensitive data encrypted with AES-256-GCM.
 *
 * @param {string} encryptedData - Encrypted data string
 * @param {string} encryptionKey - Decryption key
 * @returns {string} Decrypted plaintext
 *
 * @example
 * ```typescript
 * const decrypted = decryptSensitiveData(encryptedTaxId, process.env.ENCRYPTION_KEY);
 * ```
 */
export declare const decryptSensitiveData: (encryptedData: string, encryptionKey: string) => string;
/**
 * Validates and sanitizes input to prevent injection attacks.
 *
 * @param {string} input - User input to sanitize
 * @param {string} type - Input type (email, phone, alphanumeric, etc.)
 * @returns {{ valid: boolean; sanitized: string; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = sanitizeInput(userEmail, 'email');
 * if (!result.valid) throw new Error(result.errors.join(', '));
 * ```
 */
export declare const sanitizeInput: (input: string, type: "email" | "phone" | "alphanumeric" | "text") => {
    valid: boolean;
    sanitized: string;
    errors: string[];
};
/**
 * Verifies user has required permission for operation.
 *
 * @param {SecurityContext} context - Security context
 * @param {string} requiredPermission - Required permission
 * @returns {boolean} True if user has permission
 * @throws {ForbiddenException} If permission denied
 *
 * @example
 * ```typescript
 * verifyPermission(securityContext, 'agency:write');
 * ```
 */
export declare const verifyPermission: (context: SecurityContext, requiredPermission: string) => boolean;
/**
 * Logs security audit event.
 *
 * @param {AgencyAuditLog} auditLog - Audit log entry
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logSecurityAudit({
 *   agencyId: 'agency-123',
 *   userId: 'user-456',
 *   action: 'license_updated',
 *   resource: 'agency_license',
 *   timestamp: new Date(),
 *   severity: 'medium'
 * });
 * ```
 */
export declare const logSecurityAudit: (auditLog: AgencyAuditLog) => Promise<void>;
/**
 * 1. Creates new agency onboarding application with security validation.
 *
 * @param {AgencyOnboardingConfig} config - Onboarding configuration
 * @param {SecurityContext} context - Security context
 * @returns {Promise<AgencyAttributes>} Created agency
 *
 * @example
 * ```typescript
 * const agency = await onboardNewAgency({
 *   agencyName: 'ABC Insurance',
 *   agencyType: AgencyType.INDEPENDENT,
 *   taxId: '12-3456789',
 *   email: 'contact@abcins.com',
 *   phone: '555-0100',
 *   address: { street: '123 Main St', city: 'Boston', state: 'MA', zipCode: '02101', country: 'USA' },
 *   ownerName: 'John Doe',
 *   ownerEmail: 'john@abcins.com',
 *   licenseNumbers: ['MA-123456'],
 *   states: ['MA', 'NH'],
 *   eoBond: 500000,
 *   initialProducts: ['auto', 'home']
 * }, securityContext);
 * ```
 */
export declare const onboardNewAgency: (config: AgencyOnboardingConfig, context: SecurityContext) => Promise<AgencyAttributes>;
/**
 * 2. Creates agency contract with encryption and audit trail.
 *
 * @param {AgencyContractConfig} config - Contract configuration
 * @param {SecurityContext} context - Security context
 * @returns {Promise<any>} Created contract
 *
 * @example
 * ```typescript
 * const contract = await createAgencyContract({
 *   agencyId: 'agency-123',
 *   contractType: 'standard',
 *   effectiveDate: new Date('2024-01-01'),
 *   commissionStructure: { newBusinessRate: 15, renewalRate: 10, tiered: false },
 *   products: ['auto', 'home'],
 *   territories: ['MA', 'NH'],
 *   authorityLevel: AuthorityLevel.BIND_AUTO,
 *   eoRequirement: 500000,
 *   bondRequirement: 100000,
 *   terms: 'Standard agency agreement...'
 * }, securityContext);
 * ```
 */
export declare const createAgencyContract: (config: AgencyContractConfig, context: SecurityContext) => Promise<any>;
/**
 * 3. Validates agency onboarding documentation.
 *
 * @param {string} agencyId - Agency ID
 * @param {SecurityContext} context - Security context
 * @returns {Promise<{ valid: boolean; missingDocs: string[]; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateAgencyDocumentation('agency-123', securityContext);
 * if (!validation.valid) console.log('Missing:', validation.missingDocs);
 * ```
 */
export declare const validateAgencyDocumentation: (agencyId: string, context: SecurityContext) => Promise<{
    valid: boolean;
    missingDocs: string[];
    errors: string[];
}>;
/**
 * 4. Approves agency onboarding application.
 *
 * @param {string} agencyId - Agency ID
 * @param {SecurityContext} context - Security context
 * @returns {Promise<AgencyAttributes>} Updated agency
 *
 * @example
 * ```typescript
 * const agency = await approveAgencyOnboarding('agency-123', securityContext);
 * ```
 */
export declare const approveAgencyOnboarding: (agencyId: string, context: SecurityContext) => Promise<AgencyAttributes>;
/**
 * 5. Rejects agency onboarding application.
 *
 * @param {string} agencyId - Agency ID
 * @param {string} reason - Rejection reason
 * @param {SecurityContext} context - Security context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rejectAgencyOnboarding('agency-123', 'Insufficient E&O coverage', securityContext);
 * ```
 */
export declare const rejectAgencyOnboarding: (agencyId: string, reason: string, context: SecurityContext) => Promise<void>;
/**
 * 6. Adds agency license with validation.
 *
 * @param {AgencyLicenseInfo} licenseInfo - License information
 * @param {SecurityContext} context - Security context
 * @returns {Promise<AgencyLicenseAttributes>} Created license
 *
 * @example
 * ```typescript
 * const license = await addAgencyLicense({
 *   agencyId: 'agency-123',
 *   state: 'CA',
 *   licenseNumber: 'CA-123456',
 *   licenseType: 'Property & Casualty',
 *   issueDate: new Date('2023-01-01'),
 *   expirationDate: new Date('2025-12-31'),
 *   status: 'active',
 *   resident: true,
 *   lines: ['auto', 'home', 'commercial']
 * }, securityContext);
 * ```
 */
export declare const addAgencyLicense: (licenseInfo: AgencyLicenseInfo, context: SecurityContext) => Promise<AgencyLicenseAttributes>;
/**
 * 7. Monitors license expiration and sends alerts.
 *
 * @param {string} agencyId - Agency ID
 * @param {number} daysBeforeExpiration - Days before expiration to alert
 * @returns {Promise<AgencyLicenseAttributes[]>} Expiring licenses
 *
 * @example
 * ```typescript
 * const expiringLicenses = await monitorLicenseExpiration('agency-123', 30);
 * ```
 */
export declare const monitorLicenseExpiration: (agencyId: string, daysBeforeExpiration?: number) => Promise<AgencyLicenseAttributes[]>;
/**
 * 8. Renews agency license.
 *
 * @param {string} licenseId - License ID
 * @param {Date} newExpirationDate - New expiration date
 * @param {SecurityContext} context - Security context
 * @returns {Promise<AgencyLicenseAttributes>} Updated license
 *
 * @example
 * ```typescript
 * const renewed = await renewAgencyLicense('license-123', new Date('2026-12-31'), securityContext);
 * ```
 */
export declare const renewAgencyLicense: (licenseId: string, newExpirationDate: Date, context: SecurityContext) => Promise<AgencyLicenseAttributes>;
/**
 * 9. Creates carrier appointment for agency.
 *
 * @param {AgencyAppointment} appointment - Appointment information
 * @param {SecurityContext} context - Security context
 * @returns {Promise<AgencyAppointmentAttributes>} Created appointment
 *
 * @example
 * ```typescript
 * const appointment = await createCarrierAppointment({
 *   agencyId: 'agency-123',
 *   carrierId: 'carrier-456',
 *   state: 'CA',
 *   appointmentDate: new Date(),
 *   status: 'active',
 *   products: ['auto', 'home'],
 *   authorityLevel: AuthorityLevel.BIND_AUTO
 * }, securityContext);
 * ```
 */
export declare const createCarrierAppointment: (appointment: AgencyAppointment, context: SecurityContext) => Promise<AgencyAppointmentAttributes>;
/**
 * 10. Terminates carrier appointment.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {string} reason - Termination reason
 * @param {SecurityContext} context - Security context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await terminateCarrierAppointment('appointment-123', 'Voluntary termination', securityContext);
 * ```
 */
export declare const terminateCarrierAppointment: (appointmentId: string, reason: string, context: SecurityContext) => Promise<void>;
/**
 * 11. Builds agency hierarchy tree.
 *
 * @param {string} rootAgencyId - Root agency ID
 * @param {SecurityContext} context - Security context
 * @returns {Promise<AgencyHierarchyNode>} Hierarchy tree
 *
 * @example
 * ```typescript
 * const hierarchy = await buildAgencyHierarchy('agency-123', securityContext);
 * console.log('Total child agencies:', hierarchy.childAgencies.length);
 * ```
 */
export declare const buildAgencyHierarchy: (rootAgencyId: string, context: SecurityContext) => Promise<AgencyHierarchyNode>;
/**
 * 12. Associates sub-agency with parent agency.
 *
 * @param {string} subAgencyId - Sub-agency ID
 * @param {string} parentAgencyId - Parent agency ID
 * @param {SecurityContext} context - Security context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await associateSubAgency('sub-agency-123', 'parent-agency-456', securityContext);
 * ```
 */
export declare const associateSubAgency: (subAgencyId: string, parentAgencyId: string, context: SecurityContext) => Promise<void>;
/**
 * 13. Retrieves all agencies in hierarchy.
 *
 * @param {string} parentAgencyId - Parent agency ID
 * @param {SecurityContext} context - Security context
 * @returns {Promise<AgencyAttributes[]>} Child agencies
 *
 * @example
 * ```typescript
 * const childAgencies = await getAgenciesInHierarchy('parent-agency-123', securityContext);
 * ```
 */
export declare const getAgenciesInHierarchy: (parentAgencyId: string, context: SecurityContext) => Promise<AgencyAttributes[]>;
/**
 * 14. Calculates hierarchy depth and span.
 *
 * @param {string} agencyId - Agency ID
 * @returns {Promise<{ depth: number; span: number; totalDescendants: number }>} Hierarchy metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateHierarchyMetrics('agency-123');
 * console.log('Hierarchy depth:', metrics.depth);
 * ```
 */
export declare const calculateHierarchyMetrics: (agencyId: string) => Promise<{
    depth: number;
    span: number;
    totalDescendants: number;
}>;
/**
 * 15. Registers sub-agent under parent agency.
 *
 * @param {SubAgentConfig} config - Sub-agent configuration
 * @param {SecurityContext} context - Security context
 * @returns {Promise<any>} Created sub-agent
 *
 * @example
 * ```typescript
 * const subAgent = await registerSubAgent({
 *   parentAgencyId: 'agency-123',
 *   subAgentName: 'Jane Smith',
 *   subAgentEmail: 'jane@example.com',
 *   licenseNumber: 'CA-789012',
 *   states: ['CA'],
 *   products: ['auto', 'home'],
 *   commissionSplit: 50,
 *   authorityLevel: AuthorityLevel.QUOTE_ONLY
 * }, securityContext);
 * ```
 */
export declare const registerSubAgent: (config: SubAgentConfig, context: SecurityContext) => Promise<any>;
/**
 * 16. Updates sub-agent commission split.
 *
 * @param {string} subAgentId - Sub-agent ID
 * @param {number} newCommissionSplit - New commission split percentage
 * @param {SecurityContext} context - Security context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateSubAgentCommissionSplit('subagent-123', 55, securityContext);
 * ```
 */
export declare const updateSubAgentCommissionSplit: (subAgentId: string, newCommissionSplit: number, context: SecurityContext) => Promise<void>;
/**
 * 17. Deactivates sub-agent.
 *
 * @param {string} subAgentId - Sub-agent ID
 * @param {string} reason - Deactivation reason
 * @param {SecurityContext} context - Security context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deactivateSubAgent('subagent-123', 'License expired', securityContext);
 * ```
 */
export declare const deactivateSubAgent: (subAgentId: string, reason: string, context: SecurityContext) => Promise<void>;
/**
 * 18. Retrieves sub-agents for parent agency.
 *
 * @param {string} parentAgencyId - Parent agency ID
 * @param {SecurityContext} context - Security context
 * @returns {Promise<any[]>} Sub-agents list
 *
 * @example
 * ```typescript
 * const subAgents = await getSubAgents('agency-123', securityContext);
 * ```
 */
export declare const getSubAgents: (parentAgencyId: string, context: SecurityContext) => Promise<any[]>;
/**
 * 19. Calculates agency performance metrics.
 *
 * @param {string} agencyId - Agency ID
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @param {SecurityContext} context - Security context
 * @returns {Promise<AgencyPerformanceMetrics>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateAgencyPerformance(
 *   'agency-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   securityContext
 * );
 * console.log('Total premium:', metrics.totalPremium);
 * ```
 */
export declare const calculateAgencyPerformance: (agencyId: string, startDate: Date, endDate: Date, context: SecurityContext) => Promise<AgencyPerformanceMetrics>;
/**
 * 20. Generates performance scorecard.
 *
 * @param {string} agencyId - Agency ID
 * @param {string} period - Period (monthly, quarterly, annual)
 * @returns {Promise<any>} Performance scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generatePerformanceScorecard('agency-123', 'quarterly');
 * ```
 */
export declare const generatePerformanceScorecard: (agencyId: string, period: string) => Promise<any>;
/**
 * 21. Compares agency performance against benchmarks.
 *
 * @param {string} agencyId - Agency ID
 * @param {AgencyPerformanceMetrics} metrics - Agency metrics
 * @returns {Promise<any>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareAgainstBenchmarks('agency-123', metrics);
 * console.log('Above benchmark in:', comparison.aboveBenchmark);
 * ```
 */
export declare const compareAgainstBenchmarks: (agencyId: string, metrics: AgencyPerformanceMetrics) => Promise<any>;
/**
 * 22. Sets production quota for agency.
 *
 * @param {ProductionQuota} quota - Production quota
 * @param {SecurityContext} context - Security context
 * @returns {Promise<ProductionQuota>} Created quota
 *
 * @example
 * ```typescript
 * const quota = await setProductionQuota({
 *   agencyId: 'agency-123',
 *   period: 'quarterly',
 *   year: 2024,
 *   quarter: 1,
 *   targetPolicies: 100,
 *   targetPremium: 500000,
 *   targetNewBusiness: 50,
 *   minRetentionRate: 0.85
 * }, securityContext);
 * ```
 */
export declare const setProductionQuota: (quota: ProductionQuota, context: SecurityContext) => Promise<ProductionQuota>;
/**
 * 23. Tracks quota attainment progress.
 *
 * @param {string} agencyId - Agency ID
 * @param {ProductionQuota} quota - Target quota
 * @param {AgencyPerformanceMetrics} actual - Actual performance
 * @returns {Promise<any>} Quota progress
 *
 * @example
 * ```typescript
 * const progress = await trackQuotaAttainment('agency-123', quota, actualMetrics);
 * console.log('Quota achievement:', progress.achievementPercentage);
 * ```
 */
export declare const trackQuotaAttainment: (agencyId: string, quota: ProductionQuota, actual: AgencyPerformanceMetrics) => Promise<any>;
/**
 * 24. Initiates agency termination workflow.
 *
 * @param {AgencyTerminationWorkflow} workflow - Termination workflow
 * @param {SecurityContext} context - Security context
 * @returns {Promise<AgencyTerminationWorkflow>} Created workflow
 *
 * @example
 * ```typescript
 * const termination = await initiateAgencyTermination({
 *   agencyId: 'agency-123',
 *   terminationType: 'voluntary',
 *   terminationDate: new Date('2024-12-31'),
 *   reason: 'Business closure',
 *   initiatedBy: 'user-456',
 *   noticeDate: new Date(),
 *   policiesInForce: 50,
 *   commissionsDue: 5000,
 *   finalSettlement: 5000
 * }, securityContext);
 * ```
 */
export declare const initiateAgencyTermination: (workflow: AgencyTerminationWorkflow, context: SecurityContext) => Promise<AgencyTerminationWorkflow>;
/**
 * 25. Processes book of business transfer.
 *
 * @param {string} fromAgencyId - Source agency ID
 * @param {string} toAgencyId - Target agency ID
 * @param {string[]} policyIds - Policies to transfer
 * @param {SecurityContext} context - Security context
 * @returns {Promise<any>} Transfer result
 *
 * @example
 * ```typescript
 * const result = await processBookOfBusinessTransfer(
 *   'agency-123',
 *   'agency-456',
 *   ['policy-1', 'policy-2'],
 *   securityContext
 * );
 * ```
 */
export declare const processBookOfBusinessTransfer: (fromAgencyId: string, toAgencyId: string, policyIds: string[], context: SecurityContext) => Promise<any>;
/**
 * 26. Grants portal access with role-based permissions.
 *
 * @param {AgencyAccessControl} accessControl - Access control configuration
 * @param {SecurityContext} context - Security context
 * @returns {Promise<AgencyAccessControlAttributes>} Created access control
 *
 * @example
 * ```typescript
 * const access = await grantPortalAccess({
 *   userId: 'user-123',
 *   agencyId: 'agency-456',
 *   role: AgencyRole.MANAGER,
 *   permissions: ['policy:read', 'policy:create', 'quote:manage'],
 *   grantedBy: 'admin-789',
 *   grantedAt: new Date(),
 *   mfaRequired: true,
 *   ipWhitelist: ['192.168.1.0/24']
 * }, securityContext);
 * ```
 */
export declare const grantPortalAccess: (accessControl: AgencyAccessControl, context: SecurityContext) => Promise<AgencyAccessControlAttributes>;
/**
 * 27. Revokes portal access.
 *
 * @param {string} userId - User ID
 * @param {string} agencyId - Agency ID
 * @param {SecurityContext} context - Security context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokePortalAccess('user-123', 'agency-456', securityContext);
 * ```
 */
export declare const revokePortalAccess: (userId: string, agencyId: string, context: SecurityContext) => Promise<void>;
/**
 * 28. Validates user session and permissions.
 *
 * @param {string} sessionId - Session ID
 * @param {string} agencyId - Agency ID
 * @param {string} requiredPermission - Required permission
 * @returns {Promise<{ valid: boolean; reason?: string }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSessionAndPermissions(
 *   'session-123',
 *   'agency-456',
 *   'policy:create'
 * );
 * if (!validation.valid) throw new UnauthorizedException(validation.reason);
 * ```
 */
export declare const validateSessionAndPermissions: (sessionId: string, agencyId: string, requiredPermission: string) => Promise<{
    valid: boolean;
    reason?: string;
}>;
/**
 * 29. Enforces MFA requirement for sensitive operations.
 *
 * @param {string} userId - User ID
 * @param {string} mfaToken - MFA token
 * @returns {Promise<boolean>} True if MFA valid
 *
 * @example
 * ```typescript
 * const mfaValid = await enforceMFARequirement('user-123', '123456');
 * if (!mfaValid) throw new UnauthorizedException('Invalid MFA token');
 * ```
 */
export declare const enforceMFARequirement: (userId: string, mfaToken: string) => Promise<boolean>;
/**
 * 30. Validates IP whitelist for access control.
 *
 * @param {string} ipAddress - Client IP address
 * @param {string[]} whitelist - Allowed IP addresses/ranges
 * @returns {boolean} True if IP is whitelisted
 *
 * @example
 * ```typescript
 * const allowed = validateIPWhitelist('192.168.1.100', ['192.168.1.0/24']);
 * if (!allowed) throw new ForbiddenException('IP not whitelisted');
 * ```
 */
export declare const validateIPWhitelist: (ipAddress: string, whitelist: string[]) => boolean;
/**
 * 31. Assigns territories to agency.
 *
 * @param {TerritoryAssignment} assignment - Territory assignment
 * @param {SecurityContext} context - Security context
 * @returns {Promise<TerritoryAssignment>} Created assignment
 *
 * @example
 * ```typescript
 * const assignment = await assignTerritories({
 *   agencyId: 'agency-123',
 *   territories: [
 *     { state: 'MA', counties: ['Suffolk', 'Middlesex'], exclusive: true },
 *     { state: 'NH', zipCodes: ['03801', '03802'], exclusive: false }
 *   ],
 *   exclusive: false,
 *   assignedDate: new Date(),
 *   effectiveDate: new Date()
 * }, securityContext);
 * ```
 */
export declare const assignTerritories: (assignment: TerritoryAssignment, context: SecurityContext) => Promise<TerritoryAssignment>;
/**
 * 32. Authorizes product access for agency.
 *
 * @param {ProductAuthorization} authorization - Product authorization
 * @param {SecurityContext} context - Security context
 * @returns {Promise<ProductAuthorization>} Created authorization
 *
 * @example
 * ```typescript
 * const auth = await authorizeProductAccess({
 *   agencyId: 'agency-123',
 *   productId: 'product-456',
 *   productName: 'Commercial Auto',
 *   authorityLevel: AuthorityLevel.BIND_AUTO,
 *   effectiveDate: new Date(),
 *   maxBindLimit: 100000,
 *   requiresApproval: false
 * }, securityContext);
 * ```
 */
export declare const authorizeProductAccess: (authorization: ProductAuthorization, context: SecurityContext) => Promise<ProductAuthorization>;
/**
 * 33. Validates agency authority for operation.
 *
 * @param {string} agencyId - Agency ID
 * @param {string} productId - Product ID
 * @param {AuthorityLevel} requiredLevel - Required authority level
 * @param {number} bindAmount - Bind amount
 * @returns {Promise<{ authorized: boolean; reason?: string }>} Authorization result
 *
 * @example
 * ```typescript
 * const result = await validateAgencyAuthority(
 *   'agency-123',
 *   'product-456',
 *   AuthorityLevel.BIND_AUTO,
 *   50000
 * );
 * if (!result.authorized) throw new ForbiddenException(result.reason);
 * ```
 */
export declare const validateAgencyAuthority: (agencyId: string, productId: string, requiredLevel: AuthorityLevel, bindAmount: number) => Promise<{
    authorized: boolean;
    reason?: string;
}>;
/**
 * 34. Generates agency audit report.
 *
 * @param {string} agencyId - Agency ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {SecurityContext} context - Security context
 * @returns {Promise<any>} Audit report
 *
 * @example
 * ```typescript
 * const report = await generateAgencyAuditReport(
 *   'agency-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   securityContext
 * );
 * ```
 */
export declare const generateAgencyAuditReport: (agencyId: string, startDate: Date, endDate: Date, context: SecurityContext) => Promise<any>;
/**
 * 35. Validates agency compliance status.
 *
 * @param {string} agencyId - Agency ID
 * @param {SecurityContext} context - Security context
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await validateAgencyCompliance('agency-123', securityContext);
 * if (!compliance.compliant) console.log('Issues:', compliance.issues);
 * ```
 */
export declare const validateAgencyCompliance: (agencyId: string, context: SecurityContext) => Promise<{
    compliant: boolean;
    issues: string[];
}>;
/**
 * 36. Exports compliance documentation.
 *
 * @param {string} agencyId - Agency ID
 * @param {string} format - Export format
 * @param {SecurityContext} context - Security context
 * @returns {Promise<Buffer>} Exported documentation
 *
 * @example
 * ```typescript
 * const pdf = await exportComplianceDocumentation('agency-123', 'pdf', securityContext);
 * ```
 */
export declare const exportComplianceDocumentation: (agencyId: string, format: "pdf" | "csv" | "json", context: SecurityContext) => Promise<Buffer>;
/**
 * 37. Approves marketing material for agency.
 *
 * @param {MarketingMaterial} material - Marketing material
 * @param {SecurityContext} context - Security context
 * @returns {Promise<MarketingMaterial>} Approved material
 *
 * @example
 * ```typescript
 * const approved = await approveMarketingMaterial({
 *   agencyId: 'agency-123',
 *   materialId: 'material-456',
 *   materialType: 'brochure',
 *   title: 'Auto Insurance Guide',
 *   description: 'Comprehensive auto insurance information',
 *   products: ['auto'],
 *   complianceApproved: true,
 *   accessControl: ['agent', 'manager']
 * }, securityContext);
 * ```
 */
export declare const approveMarketingMaterial: (material: MarketingMaterial, context: SecurityContext) => Promise<MarketingMaterial>;
/**
 * 38. Validates marketing material compliance.
 *
 * @param {string} materialId - Material ID
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Compliance check
 *
 * @example
 * ```typescript
 * const validation = await validateMarketingCompliance('material-123');
 * if (!validation.compliant) console.log('Issues:', validation.issues);
 * ```
 */
export declare const validateMarketingCompliance: (materialId: string) => Promise<{
    compliant: boolean;
    issues: string[];
}>;
/**
 * 39. Distributes quote to multiple agencies.
 *
 * @param {MultiAgencyQuoteDistribution} distribution - Quote distribution
 * @param {SecurityContext} context - Security context
 * @returns {Promise<MultiAgencyQuoteDistribution>} Distribution result
 *
 * @example
 * ```typescript
 * const distribution = await distributeQuoteToAgencies({
 *   quoteId: 'quote-123',
 *   primaryAgencyId: 'agency-456',
 *   distributedAgencies: ['agency-789', 'agency-012'],
 *   distributionMethod: 'broadcast',
 *   distributionDate: new Date(),
 *   responses: []
 * }, securityContext);
 * ```
 */
export declare const distributeQuoteToAgencies: (distribution: MultiAgencyQuoteDistribution, context: SecurityContext) => Promise<MultiAgencyQuoteDistribution>;
/**
 * 40. Aggregates and compares agency quote responses.
 *
 * @param {string} quoteId - Quote ID
 * @param {SecurityContext} context - Security context
 * @returns {Promise<any>} Aggregated responses
 *
 * @example
 * ```typescript
 * const comparison = await aggregateQuoteResponses('quote-123', securityContext);
 * console.log('Best quote:', comparison.bestQuote);
 * ```
 */
export declare const aggregateQuoteResponses: (quoteId: string, context: SecurityContext) => Promise<any>;
declare const _default: {
    encryptSensitiveData: (plaintext: string, encryptionKey: string) => string;
    decryptSensitiveData: (encryptedData: string, encryptionKey: string) => string;
    sanitizeInput: (input: string, type: "email" | "phone" | "alphanumeric" | "text") => {
        valid: boolean;
        sanitized: string;
        errors: string[];
    };
    verifyPermission: (context: SecurityContext, requiredPermission: string) => boolean;
    logSecurityAudit: (auditLog: AgencyAuditLog) => Promise<void>;
    onboardNewAgency: (config: AgencyOnboardingConfig, context: SecurityContext) => Promise<AgencyAttributes>;
    createAgencyContract: (config: AgencyContractConfig, context: SecurityContext) => Promise<any>;
    validateAgencyDocumentation: (agencyId: string, context: SecurityContext) => Promise<{
        valid: boolean;
        missingDocs: string[];
        errors: string[];
    }>;
    approveAgencyOnboarding: (agencyId: string, context: SecurityContext) => Promise<AgencyAttributes>;
    rejectAgencyOnboarding: (agencyId: string, reason: string, context: SecurityContext) => Promise<void>;
    addAgencyLicense: (licenseInfo: AgencyLicenseInfo, context: SecurityContext) => Promise<AgencyLicenseAttributes>;
    monitorLicenseExpiration: (agencyId: string, daysBeforeExpiration?: number) => Promise<AgencyLicenseAttributes[]>;
    renewAgencyLicense: (licenseId: string, newExpirationDate: Date, context: SecurityContext) => Promise<AgencyLicenseAttributes>;
    createCarrierAppointment: (appointment: AgencyAppointment, context: SecurityContext) => Promise<AgencyAppointmentAttributes>;
    terminateCarrierAppointment: (appointmentId: string, reason: string, context: SecurityContext) => Promise<void>;
    buildAgencyHierarchy: (rootAgencyId: string, context: SecurityContext) => Promise<AgencyHierarchyNode>;
    associateSubAgency: (subAgencyId: string, parentAgencyId: string, context: SecurityContext) => Promise<void>;
    getAgenciesInHierarchy: (parentAgencyId: string, context: SecurityContext) => Promise<AgencyAttributes[]>;
    calculateHierarchyMetrics: (agencyId: string) => Promise<{
        depth: number;
        span: number;
        totalDescendants: number;
    }>;
    registerSubAgent: (config: SubAgentConfig, context: SecurityContext) => Promise<any>;
    updateSubAgentCommissionSplit: (subAgentId: string, newCommissionSplit: number, context: SecurityContext) => Promise<void>;
    deactivateSubAgent: (subAgentId: string, reason: string, context: SecurityContext) => Promise<void>;
    getSubAgents: (parentAgencyId: string, context: SecurityContext) => Promise<any[]>;
    calculateAgencyPerformance: (agencyId: string, startDate: Date, endDate: Date, context: SecurityContext) => Promise<AgencyPerformanceMetrics>;
    generatePerformanceScorecard: (agencyId: string, period: string) => Promise<any>;
    compareAgainstBenchmarks: (agencyId: string, metrics: AgencyPerformanceMetrics) => Promise<any>;
    setProductionQuota: (quota: ProductionQuota, context: SecurityContext) => Promise<ProductionQuota>;
    trackQuotaAttainment: (agencyId: string, quota: ProductionQuota, actual: AgencyPerformanceMetrics) => Promise<any>;
    initiateAgencyTermination: (workflow: AgencyTerminationWorkflow, context: SecurityContext) => Promise<AgencyTerminationWorkflow>;
    processBookOfBusinessTransfer: (fromAgencyId: string, toAgencyId: string, policyIds: string[], context: SecurityContext) => Promise<any>;
    grantPortalAccess: (accessControl: AgencyAccessControl, context: SecurityContext) => Promise<AgencyAccessControlAttributes>;
    revokePortalAccess: (userId: string, agencyId: string, context: SecurityContext) => Promise<void>;
    validateSessionAndPermissions: (sessionId: string, agencyId: string, requiredPermission: string) => Promise<{
        valid: boolean;
        reason?: string;
    }>;
    enforceMFARequirement: (userId: string, mfaToken: string) => Promise<boolean>;
    validateIPWhitelist: (ipAddress: string, whitelist: string[]) => boolean;
    assignTerritories: (assignment: TerritoryAssignment, context: SecurityContext) => Promise<TerritoryAssignment>;
    authorizeProductAccess: (authorization: ProductAuthorization, context: SecurityContext) => Promise<ProductAuthorization>;
    validateAgencyAuthority: (agencyId: string, productId: string, requiredLevel: AuthorityLevel, bindAmount: number) => Promise<{
        authorized: boolean;
        reason?: string;
    }>;
    generateAgencyAuditReport: (agencyId: string, startDate: Date, endDate: Date, context: SecurityContext) => Promise<any>;
    validateAgencyCompliance: (agencyId: string, context: SecurityContext) => Promise<{
        compliant: boolean;
        issues: string[];
    }>;
    exportComplianceDocumentation: (agencyId: string, format: "pdf" | "csv" | "json", context: SecurityContext) => Promise<Buffer>;
    approveMarketingMaterial: (material: MarketingMaterial, context: SecurityContext) => Promise<MarketingMaterial>;
    validateMarketingCompliance: (materialId: string) => Promise<{
        compliant: boolean;
        issues: string[];
    }>;
    distributeQuoteToAgencies: (distribution: MultiAgencyQuoteDistribution, context: SecurityContext) => Promise<MultiAgencyQuoteDistribution>;
    aggregateQuoteResponses: (quoteId: string, context: SecurityContext) => Promise<any>;
};
export default _default;
//# sourceMappingURL=agency-management-kit.d.ts.map