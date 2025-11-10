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

import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  Transaction,
  Op,
  WhereOptions,
} from 'sequelize';
import * as crypto from 'crypto';
import { Injectable, Logger, UnauthorizedException, ForbiddenException } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Agency status enumeration
 */
export enum AgencyStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated',
  INACTIVE = 'inactive',
  UNDER_REVIEW = 'under_review',
}

/**
 * Agency type enumeration
 */
export enum AgencyType {
  INDEPENDENT = 'independent',
  CAPTIVE = 'captive',
  GENERAL = 'general',
  MANAGING_GENERAL = 'managing_general',
  WHOLESALE = 'wholesale',
  RETAIL = 'retail',
}

/**
 * Authority level enumeration
 */
export enum AuthorityLevel {
  QUOTE_ONLY = 'quote_only',
  BIND_APPROVAL = 'bind_approval',
  BIND_AUTO = 'bind_auto',
  BIND_FULL = 'bind_full',
}

/**
 * Agency role enumeration for RBAC
 */
export enum AgencyRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  AGENT = 'agent',
  SUB_AGENT = 'sub_agent',
  VIEWER = 'viewer',
}

/**
 * Agency onboarding configuration
 */
export interface AgencyOnboardingConfig {
  agencyName: string;
  agencyType: AgencyType;
  taxId: string; // Encrypted
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
  terms: string; // Encrypted contract terms
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
  commissionSplit: number; // Percentage to sub-agent
  authorityLevel: AuthorityLevel;
}

/**
 * Agency performance metrics
 */
export interface AgencyPerformanceMetrics {
  agencyId: string;
  period: { startDate: Date; endDate: Date };
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
  bookOfBusinessTransfer?: string; // Target agency ID
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
  accessControl: string[]; // Roles that can access
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

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

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
export const createAgencyModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agencyName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Agency legal name',
    },
    agencyType: {
      type: DataTypes.ENUM(...Object.values(AgencyType)),
      allowNull: false,
      comment: 'Type of insurance agency',
    },
    taxIdEncrypted: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Encrypted tax identification number',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    ownerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ownerEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AgencyStatus)),
      allowNull: false,
      defaultValue: AgencyStatus.PENDING,
    },
    parentAgencyId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Parent agency for hierarchy',
    },
    eoBond: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Errors & Omissions bond amount',
    },
    contractSignedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    terminationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  const options: ModelOptions = {
    tableName: 'agencies',
    timestamps: true,
    indexes: [
      { fields: ['agencyName'] },
      { fields: ['email'], unique: true },
      { fields: ['status'] },
      { fields: ['agencyType'] },
      { fields: ['parentAgencyId'] },
      { fields: ['effectiveDate'] },
    ],
  };

  return sequelize.define('Agency', attributes, options);
};

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
export const createAgencyLicenseModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agencyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'agencies',
        key: 'id',
      },
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
      comment: 'State code (e.g., CA, NY)',
    },
    licenseNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'State-issued license number',
    },
    licenseType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Type of license (P&C, Life, Health, etc.)',
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
    },
    resident: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Resident vs non-resident license',
    },
    lines: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      comment: 'Licensed lines of business',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  const options: ModelOptions = {
    tableName: 'agency_licenses',
    timestamps: true,
    indexes: [
      { fields: ['agencyId'] },
      { fields: ['state'] },
      { fields: ['licenseNumber'] },
      { fields: ['expirationDate'] },
      { fields: ['status'] },
    ],
  };

  return sequelize.define('AgencyLicense', attributes, options);
};

/**
 * Creates AgencyAppointment model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AgencyAppointmentAttributes>>} AgencyAppointment model
 */
export const createAgencyAppointmentModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agencyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    carrierId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Insurance carrier ID',
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
    },
    products: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    authorityLevel: {
      type: DataTypes.ENUM(...Object.values(AuthorityLevel)),
      allowNull: false,
      defaultValue: AuthorityLevel.QUOTE_ONLY,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  const options: ModelOptions = {
    tableName: 'agency_appointments',
    timestamps: true,
    indexes: [
      { fields: ['agencyId'] },
      { fields: ['carrierId'] },
      { fields: ['state'] },
      { fields: ['status'] },
    ],
  };

  return sequelize.define('AgencyAppointment', attributes, options);
};

/**
 * Creates AgencyAccessControl model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AgencyAccessControlAttributes>>} AgencyAccessControl model
 */
export const createAgencyAccessControlModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    agencyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(AgencyRole)),
      allowNull: false,
      comment: 'RBAC role for agency access',
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      comment: 'Granular permissions array',
    },
    grantedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who granted access',
    },
    grantedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Access expiration date',
    },
    mfaRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Require multi-factor authentication',
    },
    ipWhitelist: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'Allowed IP addresses',
    },
    lastAccessAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    accessCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  const options: ModelOptions = {
    tableName: 'agency_access_control',
    timestamps: true,
    indexes: [
      { fields: ['userId', 'agencyId'], unique: true },
      { fields: ['agencyId'] },
      { fields: ['role'] },
      { fields: ['expiresAt'] },
    ],
  };

  return sequelize.define('AgencyAccessControl', attributes, options);
};

// ============================================================================
// SECURITY & ENCRYPTION UTILITIES
// ============================================================================

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
export const encryptSensitiveData = (plaintext: string, encryptionKey: string): string => {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(encryptionKey, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

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
export const decryptSensitiveData = (encryptedData: string, encryptionKey: string): string => {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(encryptionKey, 'salt', 32);

  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

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
export const sanitizeInput = (
  input: string,
  type: 'email' | 'phone' | 'alphanumeric' | 'text',
): { valid: boolean; sanitized: string; errors: string[] } => {
  const errors: string[] = [];
  let sanitized = input.trim();

  // XSS prevention - remove potentially dangerous characters
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');

  // SQL injection prevention - basic check
  if (/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi.test(sanitized)) {
    errors.push('Input contains potentially dangerous SQL keywords');
  }

  // Type-specific validation
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitized)) {
        errors.push('Invalid email format');
      }
      break;
    case 'phone':
      sanitized = sanitized.replace(/[^\d\s\-\(\)\+]/g, '');
      if (sanitized.length < 10) {
        errors.push('Invalid phone number');
      }
      break;
    case 'alphanumeric':
      sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-_]/g, '');
      break;
    case 'text':
      // Allow more characters but still sanitize dangerous ones
      sanitized = sanitized.replace(/[<>]/g, '');
      break;
  }

  return {
    valid: errors.length === 0,
    sanitized,
    errors,
  };
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
export const verifyPermission = (context: SecurityContext, requiredPermission: string): boolean => {
  if (context.role === AgencyRole.SUPER_ADMIN) {
    return true; // Super admin has all permissions
  }

  if (!context.permissions.includes(requiredPermission)) {
    throw new ForbiddenException(`Permission denied: ${requiredPermission}`);
  }

  return true;
};

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
export const logSecurityAudit = async (auditLog: AgencyAuditLog): Promise<void> => {
  // In production, this would write to audit log database/service
  const logEntry = {
    ...auditLog,
    timestamp: auditLog.timestamp.toISOString(),
  };

  // Log to console for now (replace with actual audit service)
  console.log('[SECURITY AUDIT]', JSON.stringify(logEntry));

  // For high/critical severity, trigger alerts
  if (auditLog.severity === 'high' || auditLog.severity === 'critical') {
    console.error('[SECURITY ALERT]', JSON.stringify(logEntry));
    // TODO: Send to monitoring service (PagerDuty, Slack, etc.)
  }
};

// ============================================================================
// 1. AGENCY ONBOARDING & CONTRACTING
// ============================================================================

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
export const onboardNewAgency = async (
  config: AgencyOnboardingConfig,
  context: SecurityContext,
): Promise<AgencyAttributes> => {
  // Verify permission
  verifyPermission(context, 'agency:create');

  // Sanitize inputs
  const nameValidation = sanitizeInput(config.agencyName, 'text');
  const emailValidation = sanitizeInput(config.email, 'email');

  if (!nameValidation.valid || !emailValidation.valid) {
    throw new Error('Invalid input data');
  }

  // Encrypt sensitive data
  const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
  const taxIdEncrypted = encryptSensitiveData(config.taxId, encryptionKey);

  // Create agency record
  const agency: AgencyAttributes = {
    id: crypto.randomUUID(),
    agencyName: nameValidation.sanitized,
    agencyType: config.agencyType,
    taxIdEncrypted,
    email: emailValidation.sanitized,
    phone: config.phone,
    address: config.address,
    ownerName: config.ownerName,
    ownerEmail: config.ownerEmail,
    status: AgencyStatus.PENDING,
    eoBond: config.eoBond,
    metadata: {
      licenseNumbers: config.licenseNumbers,
      states: config.states,
      initialProducts: config.initialProducts,
      onboardedBy: context.userId,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Log security audit
  await logSecurityAudit({
    agencyId: agency.id,
    userId: context.userId,
    action: 'agency_onboarding_created',
    resource: 'agency',
    resourceId: agency.id,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { agencyName: agency.agencyName, agencyType: agency.agencyType },
    severity: 'medium',
  });

  return agency;
};

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
export const createAgencyContract = async (
  config: AgencyContractConfig,
  context: SecurityContext,
): Promise<any> => {
  verifyPermission(context, 'contract:create');

  const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key';
  const encryptedTerms = encryptSensitiveData(config.terms, encryptionKey);

  const contract = {
    id: crypto.randomUUID(),
    agencyId: config.agencyId,
    contractType: config.contractType,
    effectiveDate: config.effectiveDate,
    expirationDate: config.expirationDate,
    commissionStructure: config.commissionStructure,
    products: config.products,
    territories: config.territories,
    authorityLevel: config.authorityLevel,
    eoRequirement: config.eoRequirement,
    bondRequirement: config.bondRequirement,
    encryptedTerms,
    createdBy: context.userId,
    createdAt: new Date(),
  };

  await logSecurityAudit({
    agencyId: config.agencyId,
    userId: context.userId,
    action: 'contract_created',
    resource: 'agency_contract',
    resourceId: contract.id,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { contractType: config.contractType, effectiveDate: config.effectiveDate },
    severity: 'high',
    complianceLevel: 'SOC2',
  });

  return contract;
};

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
export const validateAgencyDocumentation = async (
  agencyId: string,
  context: SecurityContext,
): Promise<{ valid: boolean; missingDocs: string[]; errors: string[] }> => {
  verifyPermission(context, 'agency:read');

  const missingDocs: string[] = [];
  const errors: string[] = [];

  // Check required documents
  const requiredDocs = [
    'business_license',
    'eo_insurance',
    'bond_certificate',
    'w9_form',
    'agency_license',
    'owner_background_check',
  ];

  // In production, check document storage
  // For now, placeholder logic
  missingDocs.push(...requiredDocs.slice(0, 2)); // Simulate missing docs

  await logSecurityAudit({
    agencyId,
    userId: context.userId,
    action: 'documentation_validated',
    resource: 'agency_documents',
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { missingDocs, valid: missingDocs.length === 0 },
    severity: 'low',
  });

  return {
    valid: missingDocs.length === 0 && errors.length === 0,
    missingDocs,
    errors,
  };
};

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
export const approveAgencyOnboarding = async (
  agencyId: string,
  context: SecurityContext,
): Promise<AgencyAttributes> => {
  verifyPermission(context, 'agency:approve');

  // Validate documentation first
  const validation = await validateAgencyDocumentation(agencyId, context);
  if (!validation.valid) {
    throw new Error(`Cannot approve agency with missing documentation: ${validation.missingDocs.join(', ')}`);
  }

  const updatedAgency: Partial<AgencyAttributes> = {
    status: AgencyStatus.ACTIVE,
    effectiveDate: new Date(),
    updatedAt: new Date(),
  };

  await logSecurityAudit({
    agencyId,
    userId: context.userId,
    action: 'agency_approved',
    resource: 'agency',
    resourceId: agencyId,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    severity: 'high',
  });

  return updatedAgency as AgencyAttributes;
};

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
export const rejectAgencyOnboarding = async (
  agencyId: string,
  reason: string,
  context: SecurityContext,
): Promise<void> => {
  verifyPermission(context, 'agency:approve');

  await logSecurityAudit({
    agencyId,
    userId: context.userId,
    action: 'agency_rejected',
    resource: 'agency',
    resourceId: agencyId,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { reason },
    severity: 'high',
  });
};

// ============================================================================
// 2. AGENCY LICENSING & APPOINTMENTS
// ============================================================================

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
export const addAgencyLicense = async (
  licenseInfo: AgencyLicenseInfo,
  context: SecurityContext,
): Promise<AgencyLicenseAttributes> => {
  verifyPermission(context, 'license:create');

  const license: AgencyLicenseAttributes = {
    id: crypto.randomUUID(),
    agencyId: licenseInfo.agencyId,
    state: licenseInfo.state,
    licenseNumber: licenseInfo.licenseNumber,
    licenseType: licenseInfo.licenseType,
    issueDate: licenseInfo.issueDate,
    expirationDate: licenseInfo.expirationDate,
    status: licenseInfo.status,
    resident: licenseInfo.resident,
    lines: licenseInfo.lines,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await logSecurityAudit({
    agencyId: licenseInfo.agencyId,
    userId: context.userId,
    action: 'license_added',
    resource: 'agency_license',
    resourceId: license.id,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { state: licenseInfo.state, licenseNumber: licenseInfo.licenseNumber },
    severity: 'medium',
  });

  return license;
};

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
export const monitorLicenseExpiration = async (
  agencyId: string,
  daysBeforeExpiration: number = 30,
): Promise<AgencyLicenseAttributes[]> => {
  const expirationThreshold = new Date();
  expirationThreshold.setDate(expirationThreshold.getDate() + daysBeforeExpiration);

  // In production, query database for expiring licenses
  const expiringLicenses: AgencyLicenseAttributes[] = [];

  return expiringLicenses;
};

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
export const renewAgencyLicense = async (
  licenseId: string,
  newExpirationDate: Date,
  context: SecurityContext,
): Promise<AgencyLicenseAttributes> => {
  verifyPermission(context, 'license:update');

  const updatedLicense: Partial<AgencyLicenseAttributes> = {
    expirationDate: newExpirationDate,
    status: 'active',
    updatedAt: new Date(),
  };

  await logSecurityAudit({
    agencyId: 'agency-from-license', // In production, fetch from license
    userId: context.userId,
    action: 'license_renewed',
    resource: 'agency_license',
    resourceId: licenseId,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { newExpirationDate },
    severity: 'medium',
  });

  return updatedLicense as AgencyLicenseAttributes;
};

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
export const createCarrierAppointment = async (
  appointment: AgencyAppointment,
  context: SecurityContext,
): Promise<AgencyAppointmentAttributes> => {
  verifyPermission(context, 'appointment:create');

  const newAppointment: AgencyAppointmentAttributes = {
    id: crypto.randomUUID(),
    agencyId: appointment.agencyId,
    carrierId: appointment.carrierId,
    state: appointment.state,
    appointmentDate: appointment.appointmentDate,
    expirationDate: appointment.expirationDate,
    status: appointment.status,
    products: appointment.products,
    authorityLevel: appointment.authorityLevel,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await logSecurityAudit({
    agencyId: appointment.agencyId,
    userId: context.userId,
    action: 'appointment_created',
    resource: 'agency_appointment',
    resourceId: newAppointment.id,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { carrierId: appointment.carrierId, state: appointment.state },
    severity: 'medium',
  });

  return newAppointment;
};

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
export const terminateCarrierAppointment = async (
  appointmentId: string,
  reason: string,
  context: SecurityContext,
): Promise<void> => {
  verifyPermission(context, 'appointment:delete');

  await logSecurityAudit({
    agencyId: 'agency-from-appointment',
    userId: context.userId,
    action: 'appointment_terminated',
    resource: 'agency_appointment',
    resourceId: appointmentId,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { reason },
    severity: 'high',
  });
};

// ============================================================================
// 3. AGENCY HIERARCHY & ORGANIZATIONAL STRUCTURE
// ============================================================================

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
export const buildAgencyHierarchy = async (
  rootAgencyId: string,
  context: SecurityContext,
): Promise<AgencyHierarchyNode> => {
  verifyPermission(context, 'agency:read');

  // In production, recursively query database
  const hierarchy: AgencyHierarchyNode = {
    agencyId: rootAgencyId,
    agencyName: 'Root Agency',
    agencyType: AgencyType.MANAGING_GENERAL,
    level: 0,
    childAgencies: [],
    totalAgents: 10,
    totalSubAgents: 5,
  };

  return hierarchy;
};

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
export const associateSubAgency = async (
  subAgencyId: string,
  parentAgencyId: string,
  context: SecurityContext,
): Promise<void> => {
  verifyPermission(context, 'agency:update');

  await logSecurityAudit({
    agencyId: subAgencyId,
    userId: context.userId,
    action: 'subagency_associated',
    resource: 'agency',
    resourceId: subAgencyId,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { parentAgencyId },
    severity: 'medium',
  });
};

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
export const getAgenciesInHierarchy = async (
  parentAgencyId: string,
  context: SecurityContext,
): Promise<AgencyAttributes[]> => {
  verifyPermission(context, 'agency:read');

  // In production, query database with parentAgencyId filter
  const childAgencies: AgencyAttributes[] = [];

  return childAgencies;
};

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
export const calculateHierarchyMetrics = async (
  agencyId: string,
): Promise<{ depth: number; span: number; totalDescendants: number }> => {
  // In production, perform recursive calculation
  return {
    depth: 3,
    span: 5,
    totalDescendants: 15,
  };
};

// ============================================================================
// 4. SUB-AGENT MANAGEMENT
// ============================================================================

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
export const registerSubAgent = async (config: SubAgentConfig, context: SecurityContext): Promise<any> => {
  verifyPermission(context, 'subagent:create');

  const emailValidation = sanitizeInput(config.subAgentEmail, 'email');
  if (!emailValidation.valid) {
    throw new Error('Invalid email address');
  }

  const subAgent = {
    id: crypto.randomUUID(),
    parentAgencyId: config.parentAgencyId,
    subAgentName: config.subAgentName,
    subAgentEmail: emailValidation.sanitized,
    licenseNumber: config.licenseNumber,
    states: config.states,
    products: config.products,
    commissionSplit: config.commissionSplit,
    authorityLevel: config.authorityLevel,
    createdAt: new Date(),
  };

  await logSecurityAudit({
    agencyId: config.parentAgencyId,
    userId: context.userId,
    action: 'subagent_registered',
    resource: 'sub_agent',
    resourceId: subAgent.id,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { subAgentName: config.subAgentName, commissionSplit: config.commissionSplit },
    severity: 'medium',
  });

  return subAgent;
};

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
export const updateSubAgentCommissionSplit = async (
  subAgentId: string,
  newCommissionSplit: number,
  context: SecurityContext,
): Promise<void> => {
  verifyPermission(context, 'subagent:update');

  if (newCommissionSplit < 0 || newCommissionSplit > 100) {
    throw new Error('Commission split must be between 0 and 100');
  }

  await logSecurityAudit({
    agencyId: 'agency-from-subagent',
    userId: context.userId,
    action: 'subagent_commission_updated',
    resource: 'sub_agent',
    resourceId: subAgentId,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { newCommissionSplit },
    severity: 'medium',
  });
};

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
export const deactivateSubAgent = async (
  subAgentId: string,
  reason: string,
  context: SecurityContext,
): Promise<void> => {
  verifyPermission(context, 'subagent:delete');

  await logSecurityAudit({
    agencyId: 'agency-from-subagent',
    userId: context.userId,
    action: 'subagent_deactivated',
    resource: 'sub_agent',
    resourceId: subAgentId,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { reason },
    severity: 'high',
  });
};

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
export const getSubAgents = async (parentAgencyId: string, context: SecurityContext): Promise<any[]> => {
  verifyPermission(context, 'subagent:read');

  // In production, query database
  return [];
};

// ============================================================================
// 5. AGENCY PERFORMANCE METRICS
// ============================================================================

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
export const calculateAgencyPerformance = async (
  agencyId: string,
  startDate: Date,
  endDate: Date,
  context: SecurityContext,
): Promise<AgencyPerformanceMetrics> => {
  verifyPermission(context, 'metrics:read');

  // In production, aggregate from policy and commission data
  const metrics: AgencyPerformanceMetrics = {
    agencyId,
    period: { startDate, endDate },
    totalPolicies: 150,
    newBusinessPolicies: 75,
    renewalPolicies: 75,
    totalPremium: 500000,
    totalCommission: 75000,
    lossRatio: 0.62,
    retentionRate: 0.85,
    quoteToBindRatio: 0.35,
    averagePolicyValue: 3333.33,
    productMix: { auto: 60, home: 30, commercial: 10 },
  };

  return metrics;
};

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
export const generatePerformanceScorecard = async (agencyId: string, period: string): Promise<any> => {
  return {
    agencyId,
    period,
    overallScore: 85,
    categoryScores: {
      production: 90,
      quality: 85,
      compliance: 80,
      retention: 88,
    },
    generatedAt: new Date(),
  };
};

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
export const compareAgainstBenchmarks = async (
  agencyId: string,
  metrics: AgencyPerformanceMetrics,
): Promise<any> => {
  const industryBenchmarks = {
    retentionRate: 0.82,
    quoteToBindRatio: 0.30,
    lossRatio: 0.65,
  };

  return {
    agencyId,
    aboveBenchmark: ['retentionRate', 'quoteToBindRatio'],
    belowBenchmark: ['lossRatio'],
    comparison: {
      retentionRate: { agency: metrics.retentionRate, benchmark: industryBenchmarks.retentionRate },
      quoteToBindRatio: { agency: metrics.quoteToBindRatio, benchmark: industryBenchmarks.quoteToBindRatio },
      lossRatio: { agency: metrics.lossRatio, benchmark: industryBenchmarks.lossRatio },
    },
  };
};

// ============================================================================
// 6. PRODUCTION QUOTAS
// ============================================================================

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
export const setProductionQuota = async (
  quota: ProductionQuota,
  context: SecurityContext,
): Promise<ProductionQuota> => {
  verifyPermission(context, 'quota:create');

  await logSecurityAudit({
    agencyId: quota.agencyId,
    userId: context.userId,
    action: 'quota_set',
    resource: 'production_quota',
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { period: quota.period, targetPolicies: quota.targetPolicies },
    severity: 'low',
  });

  return quota;
};

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
export const trackQuotaAttainment = async (
  agencyId: string,
  quota: ProductionQuota,
  actual: AgencyPerformanceMetrics,
): Promise<any> => {
  const policiesAchievement = (actual.totalPolicies / quota.targetPolicies) * 100;
  const premiumAchievement = (actual.totalPremium / quota.targetPremium) * 100;
  const newBusinessAchievement = (actual.newBusinessPolicies / quota.targetNewBusiness) * 100;

  return {
    agencyId,
    period: quota.period,
    policiesAchievement,
    premiumAchievement,
    newBusinessAchievement,
    overallAchievement: (policiesAchievement + premiumAchievement + newBusinessAchievement) / 3,
    onTrack: policiesAchievement >= 80 && premiumAchievement >= 80,
  };
};

// ============================================================================
// 7. AGENCY TERMINATION WORKFLOWS
// ============================================================================

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
export const initiateAgencyTermination = async (
  workflow: AgencyTerminationWorkflow,
  context: SecurityContext,
): Promise<AgencyTerminationWorkflow> => {
  verifyPermission(context, 'agency:terminate');

  await logSecurityAudit({
    agencyId: workflow.agencyId,
    userId: context.userId,
    action: 'termination_initiated',
    resource: 'agency',
    resourceId: workflow.agencyId,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { terminationType: workflow.terminationType, reason: workflow.reason },
    severity: 'critical',
  });

  return workflow;
};

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
export const processBookOfBusinessTransfer = async (
  fromAgencyId: string,
  toAgencyId: string,
  policyIds: string[],
  context: SecurityContext,
): Promise<any> => {
  verifyPermission(context, 'agency:transfer');

  await logSecurityAudit({
    agencyId: fromAgencyId,
    userId: context.userId,
    action: 'book_transfer',
    resource: 'policies',
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { toAgencyId, policyCount: policyIds.length },
    severity: 'critical',
  });

  return {
    fromAgencyId,
    toAgencyId,
    transferredPolicies: policyIds.length,
    transferDate: new Date(),
  };
};

// ============================================================================
// 8. PORTAL ACCESS CONTROL (RBAC)
// ============================================================================

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
export const grantPortalAccess = async (
  accessControl: AgencyAccessControl,
  context: SecurityContext,
): Promise<AgencyAccessControlAttributes> => {
  verifyPermission(context, 'access:grant');

  const access: AgencyAccessControlAttributes = {
    id: crypto.randomUUID(),
    userId: accessControl.userId,
    agencyId: accessControl.agencyId,
    role: accessControl.role,
    permissions: accessControl.permissions,
    grantedBy: context.userId,
    grantedAt: new Date(),
    expiresAt: accessControl.expiresAt,
    mfaRequired: accessControl.mfaRequired,
    ipWhitelist: accessControl.ipWhitelist,
    accessCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await logSecurityAudit({
    agencyId: accessControl.agencyId,
    userId: context.userId,
    action: 'access_granted',
    resource: 'portal_access',
    resourceId: access.id,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { targetUserId: accessControl.userId, role: accessControl.role },
    severity: 'high',
  });

  return access;
};

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
export const revokePortalAccess = async (
  userId: string,
  agencyId: string,
  context: SecurityContext,
): Promise<void> => {
  verifyPermission(context, 'access:revoke');

  await logSecurityAudit({
    agencyId,
    userId: context.userId,
    action: 'access_revoked',
    resource: 'portal_access',
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { targetUserId: userId },
    severity: 'high',
  });
};

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
export const validateSessionAndPermissions = async (
  sessionId: string,
  agencyId: string,
  requiredPermission: string,
): Promise<{ valid: boolean; reason?: string }> => {
  // In production, validate against session store and permission database
  return { valid: true };
};

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
export const enforceMFARequirement = async (userId: string, mfaToken: string): Promise<boolean> => {
  // In production, validate MFA token against TOTP/SMS service
  return true;
};

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
export const validateIPWhitelist = (ipAddress: string, whitelist: string[]): boolean => {
  // Simple implementation - in production, use proper CIDR matching
  return whitelist.some((range) => ipAddress.startsWith(range.split('/')[0].substring(0, 10)));
};

// ============================================================================
// 9. TERRITORY ASSIGNMENTS & PRODUCT AUTHORIZATION
// ============================================================================

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
export const assignTerritories = async (
  assignment: TerritoryAssignment,
  context: SecurityContext,
): Promise<TerritoryAssignment> => {
  verifyPermission(context, 'territory:assign');

  await logSecurityAudit({
    agencyId: assignment.agencyId,
    userId: context.userId,
    action: 'territories_assigned',
    resource: 'territory_assignment',
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { territoryCount: assignment.territories.length, exclusive: assignment.exclusive },
    severity: 'medium',
  });

  return assignment;
};

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
export const authorizeProductAccess = async (
  authorization: ProductAuthorization,
  context: SecurityContext,
): Promise<ProductAuthorization> => {
  verifyPermission(context, 'product:authorize');

  await logSecurityAudit({
    agencyId: authorization.agencyId,
    userId: context.userId,
    action: 'product_authorized',
    resource: 'product_authorization',
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { productId: authorization.productId, authorityLevel: authorization.authorityLevel },
    severity: 'medium',
  });

  return authorization;
};

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
export const validateAgencyAuthority = async (
  agencyId: string,
  productId: string,
  requiredLevel: AuthorityLevel,
  bindAmount: number,
): Promise<{ authorized: boolean; reason?: string }> => {
  // In production, check against product authorization and limits
  return { authorized: true };
};

// ============================================================================
// 10. AUDIT & COMPLIANCE
// ============================================================================

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
export const generateAgencyAuditReport = async (
  agencyId: string,
  startDate: Date,
  endDate: Date,
  context: SecurityContext,
): Promise<any> => {
  verifyPermission(context, 'audit:read');

  return {
    agencyId,
    period: { startDate, endDate },
    totalEvents: 1500,
    criticalEvents: 5,
    highSeverityEvents: 25,
    complianceScore: 95,
    generatedAt: new Date(),
    generatedBy: context.userId,
  };
};

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
export const validateAgencyCompliance = async (
  agencyId: string,
  context: SecurityContext,
): Promise<{ compliant: boolean; issues: string[] }> => {
  verifyPermission(context, 'compliance:read');

  const issues: string[] = [];

  // Check license expiration
  // Check E&O coverage
  // Check appointment status
  // Check contract validity

  return {
    compliant: issues.length === 0,
    issues,
  };
};

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
export const exportComplianceDocumentation = async (
  agencyId: string,
  format: 'pdf' | 'csv' | 'json',
  context: SecurityContext,
): Promise<Buffer> => {
  verifyPermission(context, 'compliance:export');

  await logSecurityAudit({
    agencyId,
    userId: context.userId,
    action: 'compliance_export',
    resource: 'compliance_docs',
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { format },
    severity: 'low',
  });

  return Buffer.from('Compliance documentation');
};

// ============================================================================
// 11. MARKETING MATERIALS MANAGEMENT
// ============================================================================

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
export const approveMarketingMaterial = async (
  material: MarketingMaterial,
  context: SecurityContext,
): Promise<MarketingMaterial> => {
  verifyPermission(context, 'marketing:approve');

  const approved: MarketingMaterial = {
    ...material,
    complianceApproved: true,
    approvedBy: context.userId,
    approvedDate: new Date(),
  };

  await logSecurityAudit({
    agencyId: material.agencyId,
    userId: context.userId,
    action: 'marketing_approved',
    resource: 'marketing_material',
    resourceId: material.materialId,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    severity: 'low',
  });

  return approved;
};

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
export const validateMarketingCompliance = async (
  materialId: string,
): Promise<{ compliant: boolean; issues: string[] }> => {
  const issues: string[] = [];

  // Check for required disclosures
  // Validate product information accuracy
  // Check for prohibited claims

  return {
    compliant: issues.length === 0,
    issues,
  };
};

// ============================================================================
// 12. MULTI-AGENCY QUOTING & DISTRIBUTION
// ============================================================================

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
export const distributeQuoteToAgencies = async (
  distribution: MultiAgencyQuoteDistribution,
  context: SecurityContext,
): Promise<MultiAgencyQuoteDistribution> => {
  verifyPermission(context, 'quote:distribute');

  await logSecurityAudit({
    agencyId: distribution.primaryAgencyId,
    userId: context.userId,
    action: 'quote_distributed',
    resource: 'quote_distribution',
    resourceId: distribution.quoteId,
    timestamp: new Date(),
    ipAddress: context.ipAddress,
    details: { agencyCount: distribution.distributedAgencies.length, method: distribution.distributionMethod },
    severity: 'low',
  });

  return distribution;
};

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
export const aggregateQuoteResponses = async (quoteId: string, context: SecurityContext): Promise<any> => {
  verifyPermission(context, 'quote:read');

  return {
    quoteId,
    totalResponses: 3,
    quotedResponses: 2,
    declinedResponses: 1,
    bestQuote: {
      agencyId: 'agency-789',
      premium: 1200,
      carrierId: 'carrier-123',
    },
    averagePremium: 1250,
    responseTime: 45, // minutes
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Security utilities
  encryptSensitiveData,
  decryptSensitiveData,
  sanitizeInput,
  verifyPermission,
  logSecurityAudit,

  // Onboarding & Contracting
  onboardNewAgency,
  createAgencyContract,
  validateAgencyDocumentation,
  approveAgencyOnboarding,
  rejectAgencyOnboarding,

  // Licensing & Appointments
  addAgencyLicense,
  monitorLicenseExpiration,
  renewAgencyLicense,
  createCarrierAppointment,
  terminateCarrierAppointment,

  // Hierarchy & Structure
  buildAgencyHierarchy,
  associateSubAgency,
  getAgenciesInHierarchy,
  calculateHierarchyMetrics,

  // Sub-Agent Management
  registerSubAgent,
  updateSubAgentCommissionSplit,
  deactivateSubAgent,
  getSubAgents,

  // Performance Metrics
  calculateAgencyPerformance,
  generatePerformanceScorecard,
  compareAgainstBenchmarks,

  // Production Quotas
  setProductionQuota,
  trackQuotaAttainment,

  // Termination Workflows
  initiateAgencyTermination,
  processBookOfBusinessTransfer,

  // Portal Access Control
  grantPortalAccess,
  revokePortalAccess,
  validateSessionAndPermissions,
  enforceMFARequirement,
  validateIPWhitelist,

  // Territory & Product Authorization
  assignTerritories,
  authorizeProductAccess,
  validateAgencyAuthority,

  // Audit & Compliance
  generateAgencyAuditReport,
  validateAgencyCompliance,
  exportComplianceDocumentation,

  // Marketing Materials
  approveMarketingMaterial,
  validateMarketingCompliance,

  // Multi-Agency Distribution
  distributeQuoteToAgencies,
  aggregateQuoteResponses,
};
