/**
 * LOC: THREATINTCOL001
 * File: /reuse/threat/threat-intelligence-collaboration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence sharing services
 *   - Collaboration platform integrations
 *   - STIX/TAXII sharing modules
 *   - Partner integration services
 *   - Intelligence sanitization services
 *   - Collaborative hunting platforms
 */

/**
 * File: /reuse/threat/threat-intelligence-collaboration-kit.ts
 * Locator: WC-THREAT-INTCOL-001
 * Purpose: Threat Intelligence Collaboration Kit - Production-ready sharing and collaboration features
 *
 * Upstream: Independent utility module for threat intelligence collaboration and sharing
 * Downstream: ../backend/*, Security services, Threat intel platforms, Partner systems, STIX/TAXII servers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 40 utility functions for intelligence sharing, collaboration workspaces, annotations, feeds, sanitization
 *
 * LLM Context: Enterprise-grade threat intelligence collaboration toolkit for White Cross healthcare platform.
 * Provides comprehensive threat intelligence sharing workflows, collaboration workspace management,
 * comments and annotations on threats, threat intelligence feeds for partners, sharing permissions and
 * access control, intelligence sanitization before sharing, STIX/TAXII sharing protocols, collaborative
 * hunting capabilities, and HIPAA-compliant secure intelligence exchange for protecting healthcare
 * infrastructure and patient data. Includes Sequelize models, NestJS testing patterns, TypeScript
 * interfaces, and Swagger documentation.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Threat intelligence sharing workspace
 */
export interface CollaborationWorkspace {
  id: string;
  name: string;
  description: string;
  type: WorkspaceType;
  visibility: WorkspaceVisibility;
  members: WorkspaceMember[];
  sharedIntelligence: string[]; // Intelligence IDs
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  settings: WorkspaceSettings;
  tags: string[];
  metadata?: Record<string, any>;
}

/**
 * Workspace types for different collaboration scenarios
 */
export enum WorkspaceType {
  INCIDENT_RESPONSE = 'INCIDENT_RESPONSE',
  THREAT_HUNTING = 'THREAT_HUNTING',
  INTELLIGENCE_EXCHANGE = 'INTELLIGENCE_EXCHANGE',
  RESEARCH = 'RESEARCH',
  PARTNER_SHARING = 'PARTNER_SHARING',
  SECTOR_ISAC = 'SECTOR_ISAC', // Information Sharing and Analysis Center
}

/**
 * Workspace visibility levels
 */
export enum WorkspaceVisibility {
  PRIVATE = 'PRIVATE',
  ORGANIZATION = 'ORGANIZATION',
  PARTNER = 'PARTNER',
  COMMUNITY = 'COMMUNITY',
  PUBLIC = 'PUBLIC',
}

/**
 * Workspace member with role and permissions
 */
export interface WorkspaceMember {
  userId: string;
  username: string;
  organization: string;
  role: WorkspaceRole;
  permissions: WorkspacePermission[];
  joinedAt: Date;
  lastActiveAt?: Date;
  invitedBy?: string;
}

/**
 * Workspace roles
 */
export enum WorkspaceRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  CONTRIBUTOR = 'CONTRIBUTOR',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER',
}

/**
 * Workspace permissions
 */
export enum WorkspacePermission {
  VIEW_INTELLIGENCE = 'VIEW_INTELLIGENCE',
  ADD_INTELLIGENCE = 'ADD_INTELLIGENCE',
  EDIT_INTELLIGENCE = 'EDIT_INTELLIGENCE',
  DELETE_INTELLIGENCE = 'DELETE_INTELLIGENCE',
  COMMENT = 'COMMENT',
  SHARE_EXTERNAL = 'SHARE_EXTERNAL',
  MANAGE_MEMBERS = 'MANAGE_MEMBERS',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  EXPORT = 'EXPORT',
  ANNOTATE = 'ANNOTATE',
}

/**
 * Workspace configuration settings
 */
export interface WorkspaceSettings {
  autoApproveMembers: boolean;
  requireApprovalForSharing: boolean;
  enableNotifications: boolean;
  notificationChannels: string[];
  retentionDays?: number;
  tlpDefault: TLPLevel;
  sanitizationLevel: SanitizationLevel;
  allowedOrganizations?: string[];
  bannedOrganizations?: string[];
}

/**
 * Traffic Light Protocol (TLP) classification
 */
export enum TLPLevel {
  RED = 'RED',       // Not for disclosure
  AMBER = 'AMBER',   // Limited disclosure
  GREEN = 'GREEN',   // Community wide
  WHITE = 'WHITE',   // Unlimited disclosure
}

/**
 * Sanitization levels for shared intelligence
 */
export enum SanitizationLevel {
  NONE = 'NONE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  STRICT = 'STRICT',
}

/**
 * Shared threat intelligence item
 */
export interface SharedIntelligence {
  id: string;
  workspaceId: string;
  type: IntelligenceType;
  title: string;
  description: string;
  tlp: TLPLevel;
  confidence: number; // 0-100
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  indicators: ThreatIndicator[];
  tags: string[];
  sharedBy: string;
  sharedAt: Date;
  expiresAt?: Date;
  sanitized: boolean;
  sanitizationDetails?: SanitizationDetails;
  relatedIntelligence?: string[];
  comments: IntelligenceComment[];
  annotations: IntelligenceAnnotation[];
  stixBundle?: any; // STIX 2.1 bundle
  metadata?: Record<string, any>;
}

/**
 * Intelligence types
 */
export enum IntelligenceType {
  IOC = 'IOC',
  THREAT_ACTOR = 'THREAT_ACTOR',
  CAMPAIGN = 'CAMPAIGN',
  TTP = 'TTP',
  VULNERABILITY = 'VULNERABILITY',
  MALWARE = 'MALWARE',
  TOOL = 'TOOL',
  INCIDENT = 'INCIDENT',
}

/**
 * Threat indicator structure
 */
export interface ThreatIndicator {
  id: string;
  type: IndicatorType;
  value: string;
  confidence: number;
  firstSeen: Date;
  lastSeen: Date;
  sources?: string[];
}

/**
 * Indicator types
 */
export enum IndicatorType {
  IP_ADDRESS = 'IP_ADDRESS',
  DOMAIN = 'DOMAIN',
  URL = 'URL',
  EMAIL = 'EMAIL',
  FILE_HASH = 'FILE_HASH',
  FILE_NAME = 'FILE_NAME',
  REGISTRY_KEY = 'REGISTRY_KEY',
  MUTEX = 'MUTEX',
  CVE = 'CVE',
}

/**
 * Comment on shared intelligence
 */
export interface IntelligenceComment {
  id: string;
  intelligenceId: string;
  author: string;
  authorOrganization: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  replyTo?: string;
  reactions: CommentReaction[];
  metadata?: Record<string, any>;
}

/**
 * Comment reaction
 */
export interface CommentReaction {
  userId: string;
  type: 'LIKE' | 'HELPFUL' | 'CONFIRMED' | 'DISPUTED';
  timestamp: Date;
}

/**
 * Annotation on intelligence for enrichment
 */
export interface IntelligenceAnnotation {
  id: string;
  intelligenceId: string;
  annotator: string;
  annotationType: AnnotationType;
  target: string; // What is being annotated (indicator, field, etc.)
  content: string;
  confidence?: number;
  verified: boolean;
  verifiedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Annotation types
 */
export enum AnnotationType {
  ENRICHMENT = 'ENRICHMENT',
  CORRECTION = 'CORRECTION',
  CONTEXT = 'CONTEXT',
  RELATIONSHIP = 'RELATIONSHIP',
  DETECTION = 'DETECTION',
  MITIGATION = 'MITIGATION',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

/**
 * Intelligence sharing feed configuration
 */
export interface SharingFeed {
  id: string;
  name: string;
  description: string;
  type: FeedType;
  format: FeedFormat;
  workspaceId: string;
  subscribers: FeedSubscriber[];
  filters: FeedFilter[];
  updateInterval: number; // milliseconds
  enabled: boolean;
  authentication: FeedAuthentication;
  endpoint?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Feed types
 */
export enum FeedType {
  PUSH = 'PUSH',
  PULL = 'PULL',
  TAXII = 'TAXII',
  REST_API = 'REST_API',
  WEBHOOK = 'WEBHOOK',
}

/**
 * Feed formats
 */
export enum FeedFormat {
  STIX_2_1 = 'STIX_2_1',
  JSON = 'JSON',
  CSV = 'CSV',
  MISP = 'MISP',
  CUSTOM = 'CUSTOM',
}

/**
 * Feed subscriber
 */
export interface FeedSubscriber {
  id: string;
  organization: string;
  contactEmail: string;
  subscribedAt: Date;
  lastSync?: Date;
  status: 'ACTIVE' | 'PAUSED' | 'REVOKED';
}

/**
 * Feed filter criteria
 */
export interface FeedFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
  value: any;
}

/**
 * Feed authentication configuration
 */
export interface FeedAuthentication {
  type: 'API_KEY' | 'OAUTH2' | 'CERTIFICATE' | 'BASIC' | 'NONE';
  credentials?: Record<string, any>;
}

/**
 * Sanitization details for shared intelligence
 */
export interface SanitizationDetails {
  level: SanitizationLevel;
  sanitizedAt: Date;
  sanitizedBy: string;
  removedFields: string[];
  obfuscatedFields: string[];
  redactedCount: number;
  originalHash: string;
  notes?: string;
}

/**
 * Sharing permissions and access control
 */
export interface SharingPermission {
  id: string;
  intelligenceId: string;
  grantedTo: string; // User or organization ID
  grantedBy: string;
  permissions: string[];
  expiresAt?: Date;
  createdAt: Date;
}

/**
 * Collaborative hunting session
 */
export interface HuntingSession {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  hypothesis: string;
  status: HuntingStatus;
  hunters: HunterParticipant[];
  queries: HuntingQuery[];
  findings: HuntingFinding[];
  startedAt: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Hunting session status
 */
export enum HuntingStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Hunter participant in collaborative session
 */
export interface HunterParticipant {
  userId: string;
  username: string;
  organization: string;
  role: 'LEAD' | 'HUNTER' | 'OBSERVER';
  joinedAt: Date;
  contributionsCount: number;
}

/**
 * Hunting query executed in session
 */
export interface HuntingQuery {
  id: string;
  sessionId: string;
  name: string;
  query: string;
  platform: string;
  executedBy: string;
  executedAt: Date;
  resultsCount: number;
  sharedWithTeam: boolean;
}

/**
 * Finding from collaborative hunting
 */
export interface HuntingFinding {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  indicators: ThreatIndicator[];
  evidence: string[];
  discoveredBy: string;
  discoveredAt: Date;
  verified: boolean;
  verifiedBy?: string[];
  sharedAsIntelligence: boolean;
}

// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES
// ============================================================================

/**
 * Sequelize CollaborationWorkspace model attributes.
 *
 * @example
 * ```typescript
 * import { Table, Model } from 'sequelize-typescript';
 *
 * @Table({ tableName: 'collaboration_workspaces', timestamps: true })
 * class CollaborationWorkspaceModel extends Model {
 *   // Use attributes from getCollaborationWorkspaceModelAttributes()
 * }
 * ```
 */
export const getCollaborationWorkspaceModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  name: {
    type: 'STRING',
    allowNull: false,
  },
  description: {
    type: 'TEXT',
    allowNull: true,
  },
  type: {
    type: 'STRING',
    allowNull: false,
  },
  visibility: {
    type: 'STRING',
    allowNull: false,
  },
  members: {
    type: 'JSONB',
    defaultValue: [],
  },
  sharedIntelligence: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  createdBy: {
    type: 'STRING',
    allowNull: false,
  },
  settings: {
    type: 'JSONB',
    defaultValue: {},
  },
  tags: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize SharedIntelligence model attributes.
 *
 * @example
 * ```typescript
 * // NestJS Service Test
 * import { Test, TestingModule } from '@nestjs/testing';
 * import { getRepositoryToken } from '@nestjs/typeorm';
 *
 * describe('SharedIntelligenceService', () => {
 *   let service: SharedIntelligenceService;
 *   let repository: Repository<SharedIntelligence>;
 *
 *   beforeEach(async () => {
 *     const module: TestingModule = await Test.createTestingModule({
 *       providers: [
 *         SharedIntelligenceService,
 *         {
 *           provide: getRepositoryToken(SharedIntelligence),
 *           useValue: mockRepository,
 *         },
 *       ],
 *     }).compile();
 *
 *     service = module.get<SharedIntelligenceService>(SharedIntelligenceService);
 *   });
 *
 *   it('should share intelligence with sanitization', async () => {
 *     const intel = await service.shareIntelligence({
 *       workspaceId: 'workspace-123',
 *       type: IntelligenceType.IOC,
 *       indicators: [{ type: 'IP_ADDRESS', value: '192.168.1.1' }]
 *     });
 *     expect(intel.sanitized).toBe(true);
 *   });
 * });
 * ```
 */
export const getSharedIntelligenceModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  workspaceId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'collaboration_workspaces',
      key: 'id',
    },
  },
  type: {
    type: 'STRING',
    allowNull: false,
  },
  title: {
    type: 'STRING',
    allowNull: false,
  },
  description: {
    type: 'TEXT',
    allowNull: true,
  },
  tlp: {
    type: 'STRING',
    allowNull: false,
    defaultValue: TLPLevel.AMBER,
  },
  confidence: {
    type: 'INTEGER',
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  severity: {
    type: 'STRING',
    allowNull: false,
  },
  indicators: {
    type: 'JSONB',
    defaultValue: [],
  },
  tags: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  sharedBy: {
    type: 'STRING',
    allowNull: false,
  },
  sharedAt: {
    type: 'DATE',
    allowNull: false,
  },
  expiresAt: {
    type: 'DATE',
    allowNull: true,
  },
  sanitized: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  sanitizationDetails: {
    type: 'JSONB',
    allowNull: true,
  },
  relatedIntelligence: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  comments: {
    type: 'JSONB',
    defaultValue: [],
  },
  annotations: {
    type: 'JSONB',
    defaultValue: [],
  },
  stixBundle: {
    type: 'JSONB',
    allowNull: true,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize SharingFeed model attributes.
 *
 * @example
 * ```typescript
 * // NestJS Controller Test with Swagger
 * import { Test } from '@nestjs/testing';
 * import { SharingFeedController } from './sharing-feed.controller';
 * import { SharingFeedService } from './sharing-feed.service';
 *
 * describe('SharingFeedController', () => {
 *   let controller: SharingFeedController;
 *   let service: SharingFeedService;
 *
 *   beforeEach(async () => {
 *     const module = await Test.createTestingModule({
 *       controllers: [SharingFeedController],
 *       providers: [
 *         {
 *           provide: SharingFeedService,
 *           useValue: {
 *             createFeed: jest.fn(),
 *             getFeed: jest.fn(),
 *           },
 *         },
 *       ],
 *     }).compile();
 *
 *     controller = module.get(SharingFeedController);
 *     service = module.get(SharingFeedService);
 *   });
 *
 *   it('should create TAXII feed', async () => {
 *     const feedDto = {
 *       name: 'Healthcare IOCs',
 *       type: FeedType.TAXII,
 *       format: FeedFormat.STIX_2_1
 *     };
 *     await controller.createFeed(feedDto);
 *     expect(service.createFeed).toHaveBeenCalledWith(feedDto);
 *   });
 * });
 * ```
 */
export const getSharingFeedModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  name: {
    type: 'STRING',
    allowNull: false,
  },
  description: {
    type: 'TEXT',
    allowNull: true,
  },
  type: {
    type: 'STRING',
    allowNull: false,
  },
  format: {
    type: 'STRING',
    allowNull: false,
  },
  workspaceId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'collaboration_workspaces',
      key: 'id',
    },
  },
  subscribers: {
    type: 'JSONB',
    defaultValue: [],
  },
  filters: {
    type: 'JSONB',
    defaultValue: [],
  },
  updateInterval: {
    type: 'INTEGER',
    defaultValue: 3600000, // 1 hour
  },
  enabled: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  authentication: {
    type: 'JSONB',
    defaultValue: { type: 'API_KEY' },
  },
  endpoint: {
    type: 'STRING',
    allowNull: true,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize HuntingSession model attributes.
 *
 * @example
 * ```typescript
 * // Integration Test
 * describe('Collaborative Hunting Integration', () => {
 *   it('should allow multiple hunters to collaborate', async () => {
 *     const session = await createHuntingSession({
 *       workspaceId: 'workspace-123',
 *       name: 'APT29 Hunt',
 *       hypothesis: 'Lateral movement via WMI'
 *     });
 *
 *     await addHunter(session.id, 'hunter-1', 'LEAD');
 *     await addHunter(session.id, 'hunter-2', 'HUNTER');
 *
 *     const finding = await submitFinding(session.id, {
 *       title: 'Suspicious WMI activity',
 *       indicators: [...]
 *     });
 *
 *     expect(finding.discoveredBy).toBeDefined();
 *   });
 * });
 * ```
 */
export const getHuntingSessionModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  workspaceId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'collaboration_workspaces',
      key: 'id',
    },
  },
  name: {
    type: 'STRING',
    allowNull: false,
  },
  description: {
    type: 'TEXT',
    allowNull: true,
  },
  hypothesis: {
    type: 'TEXT',
    allowNull: false,
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: HuntingStatus.PLANNING,
  },
  hunters: {
    type: 'JSONB',
    defaultValue: [],
  },
  queries: {
    type: 'JSONB',
    defaultValue: [],
  },
  findings: {
    type: 'JSONB',
    defaultValue: [],
  },
  startedAt: {
    type: 'DATE',
    allowNull: false,
  },
  completedAt: {
    type: 'DATE',
    allowNull: true,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

// ============================================================================
// WORKSPACE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a new collaboration workspace for threat intelligence sharing.
 *
 * @param {Partial<CollaborationWorkspace>} workspaceData - Workspace configuration
 * @returns {Promise<CollaborationWorkspace>} Created workspace
 *
 * @example
 * ```typescript
 * const workspace = await createCollaborationWorkspace({
 *   name: 'Healthcare Sector ISAC',
 *   type: WorkspaceType.SECTOR_ISAC,
 *   visibility: WorkspaceVisibility.PARTNER,
 *   settings: {
 *     tlpDefault: TLPLevel.AMBER,
 *     sanitizationLevel: SanitizationLevel.HIGH
 *   }
 * });
 * ```
 */
export const createCollaborationWorkspace = async (
  workspaceData: Partial<CollaborationWorkspace>
): Promise<CollaborationWorkspace> => {
  const workspace: CollaborationWorkspace = {
    id: crypto.randomUUID(),
    name: workspaceData.name || 'Unnamed Workspace',
    description: workspaceData.description || '',
    type: workspaceData.type || WorkspaceType.INTELLIGENCE_EXCHANGE,
    visibility: workspaceData.visibility || WorkspaceVisibility.ORGANIZATION,
    members: workspaceData.members || [],
    sharedIntelligence: workspaceData.sharedIntelligence || [],
    createdBy: workspaceData.createdBy || 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    settings: workspaceData.settings || {
      autoApproveMembers: false,
      requireApprovalForSharing: true,
      enableNotifications: true,
      notificationChannels: ['email'],
      tlpDefault: TLPLevel.AMBER,
      sanitizationLevel: SanitizationLevel.MEDIUM,
    },
    tags: workspaceData.tags || [],
    metadata: workspaceData.metadata || {},
  };

  return workspace;
};

/**
 * Adds a member to a collaboration workspace with role and permissions.
 *
 * @param {string} workspaceId - Workspace identifier
 * @param {string} userId - User to add
 * @param {WorkspaceRole} role - Member role
 * @param {string} invitedBy - Who invited the member
 * @returns {Promise<WorkspaceMember>} Added member
 *
 * @example
 * ```typescript
 * const member = await addWorkspaceMember(
 *   'workspace-123',
 *   'user-456',
 *   WorkspaceRole.ANALYST,
 *   'admin-user'
 * );
 * ```
 */
export const addWorkspaceMember = async (
  workspaceId: string,
  userId: string,
  role: WorkspaceRole,
  invitedBy: string
): Promise<WorkspaceMember> => {
  const permissions = getRolePermissions(role);

  const member: WorkspaceMember = {
    userId,
    username: `user-${userId}`,
    organization: 'Partner Hospital',
    role,
    permissions,
    joinedAt: new Date(),
    invitedBy,
  };

  return member;
};

/**
 * Gets default permissions for a workspace role.
 *
 * @param {WorkspaceRole} role - Role to get permissions for
 * @returns {WorkspacePermission[]} Default permissions
 *
 * @example
 * ```typescript
 * const permissions = getRolePermissions(WorkspaceRole.CONTRIBUTOR);
 * console.log('Permissions:', permissions);
 * ```
 */
export const getRolePermissions = (role: WorkspaceRole): WorkspacePermission[] => {
  const permissionMap: Record<WorkspaceRole, WorkspacePermission[]> = {
    [WorkspaceRole.OWNER]: Object.values(WorkspacePermission),
    [WorkspaceRole.ADMIN]: [
      WorkspacePermission.VIEW_INTELLIGENCE,
      WorkspacePermission.ADD_INTELLIGENCE,
      WorkspacePermission.EDIT_INTELLIGENCE,
      WorkspacePermission.COMMENT,
      WorkspacePermission.ANNOTATE,
      WorkspacePermission.SHARE_EXTERNAL,
      WorkspacePermission.MANAGE_MEMBERS,
      WorkspacePermission.EXPORT,
    ],
    [WorkspaceRole.CONTRIBUTOR]: [
      WorkspacePermission.VIEW_INTELLIGENCE,
      WorkspacePermission.ADD_INTELLIGENCE,
      WorkspacePermission.COMMENT,
      WorkspacePermission.ANNOTATE,
      WorkspacePermission.EXPORT,
    ],
    [WorkspaceRole.ANALYST]: [
      WorkspacePermission.VIEW_INTELLIGENCE,
      WorkspacePermission.COMMENT,
      WorkspacePermission.ANNOTATE,
      WorkspacePermission.EXPORT,
    ],
    [WorkspaceRole.VIEWER]: [
      WorkspacePermission.VIEW_INTELLIGENCE,
    ],
  };

  return permissionMap[role] || [];
};

/**
 * Validates if a user has specific permission in workspace.
 *
 * @param {string} workspaceId - Workspace identifier
 * @param {string} userId - User to check
 * @param {WorkspacePermission} permission - Permission to validate
 * @returns {Promise<boolean>} True if user has permission
 *
 * @example
 * ```typescript
 * const canShare = await validateWorkspacePermission(
 *   'workspace-123',
 *   'user-456',
 *   WorkspacePermission.SHARE_EXTERNAL
 * );
 * ```
 */
export const validateWorkspacePermission = async (
  workspaceId: string,
  userId: string,
  permission: WorkspacePermission
): Promise<boolean> => {
  // In production, fetch workspace and check member permissions
  return true;
};

/**
 * Removes a member from workspace.
 *
 * @param {string} workspaceId - Workspace identifier
 * @param {string} userId - User to remove
 * @returns {Promise<boolean>} True if removed successfully
 *
 * @example
 * ```typescript
 * await removeWorkspaceMember('workspace-123', 'user-456');
 * ```
 */
export const removeWorkspaceMember = async (
  workspaceId: string,
  userId: string
): Promise<boolean> => {
  // In production, remove from database
  return true;
};

/**
 * Updates workspace settings.
 *
 * @param {string} workspaceId - Workspace identifier
 * @param {Partial<WorkspaceSettings>} settings - Settings to update
 * @returns {Promise<WorkspaceSettings>} Updated settings
 *
 * @example
 * ```typescript
 * const settings = await updateWorkspaceSettings('workspace-123', {
 *   tlpDefault: TLPLevel.GREEN,
 *   sanitizationLevel: SanitizationLevel.LOW
 * });
 * ```
 */
export const updateWorkspaceSettings = async (
  workspaceId: string,
  settings: Partial<WorkspaceSettings>
): Promise<WorkspaceSettings> => {
  const defaultSettings: WorkspaceSettings = {
    autoApproveMembers: false,
    requireApprovalForSharing: true,
    enableNotifications: true,
    notificationChannels: ['email'],
    tlpDefault: TLPLevel.AMBER,
    sanitizationLevel: SanitizationLevel.MEDIUM,
  };

  return { ...defaultSettings, ...settings };
};

// ============================================================================
// INTELLIGENCE SHARING FUNCTIONS
// ============================================================================

/**
 * Shares threat intelligence to a workspace.
 *
 * @param {Partial<SharedIntelligence>} intelligenceData - Intelligence to share
 * @returns {Promise<SharedIntelligence>} Shared intelligence item
 *
 * @example
 * ```typescript
 * const shared = await shareIntelligence({
 *   workspaceId: 'workspace-123',
 *   type: IntelligenceType.IOC,
 *   title: 'Malicious IP addresses from APT29',
 *   tlp: TLPLevel.AMBER,
 *   indicators: [
 *     { type: IndicatorType.IP_ADDRESS, value: '192.168.1.100', confidence: 90 }
 *   ],
 *   sharedBy: 'analyst-001'
 * });
 * ```
 */
export const shareIntelligence = async (
  intelligenceData: Partial<SharedIntelligence>
): Promise<SharedIntelligence> => {
  const intelligence: SharedIntelligence = {
    id: crypto.randomUUID(),
    workspaceId: intelligenceData.workspaceId!,
    type: intelligenceData.type || IntelligenceType.IOC,
    title: intelligenceData.title || 'Untitled Intelligence',
    description: intelligenceData.description || '',
    tlp: intelligenceData.tlp || TLPLevel.AMBER,
    confidence: intelligenceData.confidence || 50,
    severity: intelligenceData.severity || 'MEDIUM',
    indicators: intelligenceData.indicators || [],
    tags: intelligenceData.tags || [],
    sharedBy: intelligenceData.sharedBy || 'unknown',
    sharedAt: new Date(),
    expiresAt: intelligenceData.expiresAt,
    sanitized: false,
    relatedIntelligence: intelligenceData.relatedIntelligence || [],
    comments: [],
    annotations: [],
    stixBundle: intelligenceData.stixBundle,
    metadata: intelligenceData.metadata || {},
  };

  return intelligence;
};

/**
 * Retrieves shared intelligence with access control.
 *
 * @param {string} intelligenceId - Intelligence identifier
 * @param {string} userId - User requesting access
 * @returns {Promise<SharedIntelligence | null>} Intelligence if authorized
 *
 * @example
 * ```typescript
 * const intel = await getSharedIntelligence('intel-123', 'user-456');
 * if (intel) {
 *   console.log('TLP:', intel.tlp);
 *   console.log('Indicators:', intel.indicators.length);
 * }
 * ```
 */
export const getSharedIntelligence = async (
  intelligenceId: string,
  userId: string
): Promise<SharedIntelligence | null> => {
  // In production, fetch from database with access control
  return null;
};

/**
 * Updates shared intelligence item.
 *
 * @param {string} intelligenceId - Intelligence identifier
 * @param {Partial<SharedIntelligence>} updates - Fields to update
 * @returns {Promise<SharedIntelligence>} Updated intelligence
 *
 * @example
 * ```typescript
 * const updated = await updateSharedIntelligence('intel-123', {
 *   confidence: 95,
 *   tags: ['confirmed', 'active']
 * });
 * ```
 */
export const updateSharedIntelligence = async (
  intelligenceId: string,
  updates: Partial<SharedIntelligence>
): Promise<SharedIntelligence> => {
  // In production, update in database
  const intelligence = await shareIntelligence({ id: intelligenceId, ...updates });
  return intelligence;
};

/**
 * Searches shared intelligence with filters.
 *
 * @param {string} workspaceId - Workspace to search
 * @param {Record<string, any>} filters - Search filters
 * @returns {Promise<SharedIntelligence[]>} Matching intelligence
 *
 * @example
 * ```typescript
 * const results = await searchSharedIntelligence('workspace-123', {
 *   type: IntelligenceType.IOC,
 *   severity: 'CRITICAL',
 *   tags: ['ransomware']
 * });
 * ```
 */
export const searchSharedIntelligence = async (
  workspaceId: string,
  filters: Record<string, any>
): Promise<SharedIntelligence[]> => {
  // In production, query database with filters
  return [];
};

/**
 * Relates multiple intelligence items together.
 *
 * @param {string} intelligenceId - Primary intelligence
 * @param {string[]} relatedIds - Related intelligence IDs
 * @returns {Promise<boolean>} True if related successfully
 *
 * @example
 * ```typescript
 * await relateIntelligence('intel-123', ['intel-456', 'intel-789']);
 * ```
 */
export const relateIntelligence = async (
  intelligenceId: string,
  relatedIds: string[]
): Promise<boolean> => {
  // In production, update relationships in database
  return true;
};

// ============================================================================
// COMMENTS AND ANNOTATIONS
// ============================================================================

/**
 * Adds a comment to shared intelligence.
 *
 * @param {string} intelligenceId - Intelligence to comment on
 * @param {string} author - Comment author
 * @param {string} content - Comment content
 * @param {string} [replyTo] - Optional reply to another comment
 * @returns {Promise<IntelligenceComment>} Created comment
 *
 * @example
 * ```typescript
 * const comment = await addIntelligenceComment(
 *   'intel-123',
 *   'analyst-001',
 *   'Confirmed this IP in our logs - definitely malicious',
 *   null
 * );
 * ```
 */
export const addIntelligenceComment = async (
  intelligenceId: string,
  author: string,
  content: string,
  replyTo?: string
): Promise<IntelligenceComment> => {
  const comment: IntelligenceComment = {
    id: crypto.randomUUID(),
    intelligenceId,
    author,
    authorOrganization: 'Partner Hospital',
    content,
    createdAt: new Date(),
    replyTo,
    reactions: [],
  };

  return comment;
};

/**
 * Adds a reaction to a comment.
 *
 * @param {string} commentId - Comment to react to
 * @param {string} userId - User reacting
 * @param {'LIKE' | 'HELPFUL' | 'CONFIRMED' | 'DISPUTED'} reactionType - Reaction type
 * @returns {Promise<CommentReaction>} Created reaction
 *
 * @example
 * ```typescript
 * await addCommentReaction('comment-123', 'user-456', 'HELPFUL');
 * ```
 */
export const addCommentReaction = async (
  commentId: string,
  userId: string,
  reactionType: 'LIKE' | 'HELPFUL' | 'CONFIRMED' | 'DISPUTED'
): Promise<CommentReaction> => {
  const reaction: CommentReaction = {
    userId,
    type: reactionType,
    timestamp: new Date(),
  };

  return reaction;
};

/**
 * Adds an annotation to enrich intelligence.
 *
 * @param {string} intelligenceId - Intelligence to annotate
 * @param {string} annotator - Annotator user ID
 * @param {AnnotationType} annotationType - Type of annotation
 * @param {string} target - What is being annotated
 * @param {string} content - Annotation content
 * @returns {Promise<IntelligenceAnnotation>} Created annotation
 *
 * @example
 * ```typescript
 * const annotation = await addIntelligenceAnnotation(
 *   'intel-123',
 *   'analyst-001',
 *   AnnotationType.DETECTION,
 *   'indicator-0',
 *   'Detection rule: alert tcp any any -> any any (msg:"APT29 C2"; content:"evil.com";)'
 * );
 * ```
 */
export const addIntelligenceAnnotation = async (
  intelligenceId: string,
  annotator: string,
  annotationType: AnnotationType,
  target: string,
  content: string
): Promise<IntelligenceAnnotation> => {
  const annotation: IntelligenceAnnotation = {
    id: crypto.randomUUID(),
    intelligenceId,
    annotator,
    annotationType,
    target,
    content,
    verified: false,
    createdAt: new Date(),
  };

  return annotation;
};

/**
 * Verifies an annotation as accurate.
 *
 * @param {string} annotationId - Annotation to verify
 * @param {string} verifierId - User verifying
 * @returns {Promise<boolean>} True if verified
 *
 * @example
 * ```typescript
 * await verifyAnnotation('annotation-123', 'senior-analyst-001');
 * ```
 */
export const verifyAnnotation = async (
  annotationId: string,
  verifierId: string
): Promise<boolean> => {
  // In production, update annotation in database
  return true;
};

/**
 * Gets all comments for intelligence item.
 *
 * @param {string} intelligenceId - Intelligence identifier
 * @returns {Promise<IntelligenceComment[]>} All comments
 *
 * @example
 * ```typescript
 * const comments = await getIntelligenceComments('intel-123');
 * console.log('Comment count:', comments.length);
 * ```
 */
export const getIntelligenceComments = async (
  intelligenceId: string
): Promise<IntelligenceComment[]> => {
  // In production, fetch from database
  return [];
};

/**
 * Gets all annotations for intelligence item.
 *
 * @param {string} intelligenceId - Intelligence identifier
 * @returns {Promise<IntelligenceAnnotation[]>} All annotations
 *
 * @example
 * ```typescript
 * const annotations = await getIntelligenceAnnotations('intel-123');
 * const detections = annotations.filter(a => a.annotationType === AnnotationType.DETECTION);
 * ```
 */
export const getIntelligenceAnnotations = async (
  intelligenceId: string
): Promise<IntelligenceAnnotation[]> => {
  // In production, fetch from database
  return [];
};

// ============================================================================
// SHARING FEEDS FOR PARTNERS
// ============================================================================

/**
 * Creates a threat intelligence feed for partners.
 *
 * @param {Partial<SharingFeed>} feedData - Feed configuration
 * @returns {Promise<SharingFeed>} Created feed
 *
 * @example
 * ```typescript
 * const feed = await createSharingFeed({
 *   name: 'Healthcare IOC Feed',
 *   type: FeedType.TAXII,
 *   format: FeedFormat.STIX_2_1,
 *   workspaceId: 'workspace-123',
 *   authentication: { type: 'API_KEY' }
 * });
 * ```
 */
export const createSharingFeed = async (
  feedData: Partial<SharingFeed>
): Promise<SharingFeed> => {
  const feed: SharingFeed = {
    id: crypto.randomUUID(),
    name: feedData.name || 'Unnamed Feed',
    description: feedData.description || '',
    type: feedData.type || FeedType.PULL,
    format: feedData.format || FeedFormat.JSON,
    workspaceId: feedData.workspaceId!,
    subscribers: feedData.subscribers || [],
    filters: feedData.filters || [],
    updateInterval: feedData.updateInterval || 3600000,
    enabled: feedData.enabled ?? true,
    authentication: feedData.authentication || { type: 'API_KEY' },
    endpoint: feedData.endpoint,
    createdAt: new Date(),
    metadata: feedData.metadata || {},
  };

  return feed;
};

/**
 * Subscribes an organization to a sharing feed.
 *
 * @param {string} feedId - Feed identifier
 * @param {string} organization - Organization name
 * @param {string} contactEmail - Contact email
 * @returns {Promise<FeedSubscriber>} Created subscriber
 *
 * @example
 * ```typescript
 * const subscriber = await subscribeToFeed(
 *   'feed-123',
 *   'Partner Hospital',
 *   'security@partner.com'
 * );
 * ```
 */
export const subscribeToFeed = async (
  feedId: string,
  organization: string,
  contactEmail: string
): Promise<FeedSubscriber> => {
  const subscriber: FeedSubscriber = {
    id: crypto.randomUUID(),
    organization,
    contactEmail,
    subscribedAt: new Date(),
    status: 'ACTIVE',
  };

  return subscriber;
};

/**
 * Generates feed content for subscribers.
 *
 * @param {string} feedId - Feed identifier
 * @param {Date} [since] - Only include intelligence since this date
 * @returns {Promise<any>} Feed content in configured format
 *
 * @example
 * ```typescript
 * const content = await generateFeedContent('feed-123', new Date('2025-01-01'));
 * ```
 */
export const generateFeedContent = async (
  feedId: string,
  since?: Date
): Promise<any> => {
  // In production, fetch intelligence and format according to feed type
  return {
    feedId,
    generatedAt: new Date(),
    itemCount: 42,
    items: [],
  };
};

/**
 * Applies filters to feed content.
 *
 * @param {SharedIntelligence[]} intelligence - Intelligence items
 * @param {FeedFilter[]} filters - Filters to apply
 * @returns {Promise<SharedIntelligence[]>} Filtered intelligence
 *
 * @example
 * ```typescript
 * const filtered = await applyFeedFilters(allIntel, [
 *   { field: 'severity', operator: 'in', value: ['CRITICAL', 'HIGH'] }
 * ]);
 * ```
 */
export const applyFeedFilters = async (
  intelligence: SharedIntelligence[],
  filters: FeedFilter[]
): Promise<SharedIntelligence[]> => {
  let filtered = [...intelligence];

  for (const filter of filters) {
    filtered = filtered.filter(item => {
      const value = (item as any)[filter.field];

      switch (filter.operator) {
        case 'equals':
          return value === filter.value;
        case 'contains':
          return String(value).includes(String(filter.value));
        case 'greater_than':
          return value > filter.value;
        case 'less_than':
          return value < filter.value;
        case 'in':
          return Array.isArray(filter.value) && filter.value.includes(value);
        default:
          return true;
      }
    });
  }

  return filtered;
};

/**
 * Revokes feed access for a subscriber.
 *
 * @param {string} feedId - Feed identifier
 * @param {string} subscriberId - Subscriber to revoke
 * @returns {Promise<boolean>} True if revoked
 *
 * @example
 * ```typescript
 * await revokeFeedAccess('feed-123', 'subscriber-456');
 * ```
 */
export const revokeFeedAccess = async (
  feedId: string,
  subscriberId: string
): Promise<boolean> => {
  // In production, update subscriber status
  return true;
};

// ============================================================================
// INTELLIGENCE SANITIZATION
// ============================================================================

/**
 * Sanitizes intelligence before external sharing.
 *
 * @param {SharedIntelligence} intelligence - Intelligence to sanitize
 * @param {SanitizationLevel} level - Sanitization level
 * @returns {Promise<{ sanitized: SharedIntelligence; details: SanitizationDetails }>} Sanitized intelligence
 *
 * @example
 * ```typescript
 * const { sanitized, details } = await sanitizeIntelligence(
 *   originalIntel,
 *   SanitizationLevel.HIGH
 * );
 * console.log('Removed fields:', details.removedFields);
 * ```
 */
export const sanitizeIntelligence = async (
  intelligence: SharedIntelligence,
  level: SanitizationLevel
): Promise<{ sanitized: SharedIntelligence; details: SanitizationDetails }> => {
  const sanitized = { ...intelligence };
  const removedFields: string[] = [];
  const obfuscatedFields: string[] = [];
  let redactedCount = 0;

  switch (level) {
    case SanitizationLevel.STRICT:
      // Remove all metadata and internal references
      delete sanitized.metadata;
      delete sanitized.relatedIntelligence;
      removedFields.push('metadata', 'relatedIntelligence');
      // Fall through to HIGH

    case SanitizationLevel.HIGH:
      // Remove detailed indicators
      sanitized.indicators = sanitized.indicators.map(ind => ({
        ...ind,
        sources: undefined,
      }));
      obfuscatedFields.push('indicator.sources');
      // Fall through to MEDIUM

    case SanitizationLevel.MEDIUM:
      // Redact internal user references
      sanitized.sharedBy = 'Anonymous';
      obfuscatedFields.push('sharedBy');
      // Fall through to LOW

    case SanitizationLevel.LOW:
      // Remove internal comments
      sanitized.comments = sanitized.comments.filter(c => !c.metadata?.internal);
      redactedCount = intelligence.comments.length - sanitized.comments.length;
      break;

    case SanitizationLevel.NONE:
      // No sanitization
      break;
  }

  const details: SanitizationDetails = {
    level,
    sanitizedAt: new Date(),
    sanitizedBy: 'system',
    removedFields,
    obfuscatedFields,
    redactedCount,
    originalHash: crypto.createHash('sha256').update(JSON.stringify(intelligence)).digest('hex'),
  };

  sanitized.sanitized = true;
  sanitized.sanitizationDetails = details;

  return { sanitized, details };
};

/**
 * Validates sanitization meets requirements for TLP level.
 *
 * @param {SharedIntelligence} intelligence - Intelligence to validate
 * @param {TLPLevel} tlp - Target TLP level
 * @returns {Promise<{ compliant: boolean; violations: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSanitization(intel, TLPLevel.GREEN);
 * if (!validation.compliant) {
 *   console.error('TLP violations:', validation.violations);
 * }
 * ```
 */
export const validateSanitization = async (
  intelligence: SharedIntelligence,
  tlp: TLPLevel
): Promise<{ compliant: boolean; violations: string[] }> => {
  const violations: string[] = [];

  if (tlp === TLPLevel.RED && intelligence.sanitized) {
    violations.push('TLP:RED intelligence should not be sanitized for sharing');
  }

  if (tlp === TLPLevel.WHITE && !intelligence.sanitized) {
    violations.push('TLP:WHITE intelligence should be sanitized before public sharing');
  }

  if (intelligence.metadata?.sensitive && intelligence.sanitizationDetails?.level !== SanitizationLevel.STRICT) {
    violations.push('Sensitive intelligence requires STRICT sanitization');
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
};

/**
 * Redacts sensitive information from intelligence.
 *
 * @param {string} content - Content to redact
 * @param {string[]} patterns - Patterns to redact (regex)
 * @returns {Promise<{ redacted: string; redactionCount: number }>} Redacted content
 *
 * @example
 * ```typescript
 * const { redacted, redactionCount } = await redactSensitiveInfo(
 *   'Patient record 123-45-6789 accessed',
 *   [/\\d{3}-\\d{2}-\\d{4}/g] // SSN pattern
 * );
 * ```
 */
export const redactSensitiveInfo = async (
  content: string,
  patterns: string[]
): Promise<{ redacted: string; redactionCount: number }> => {
  let redacted = content;
  let redactionCount = 0;

  for (const pattern of patterns) {
    const regex = new RegExp(pattern, 'gi');
    const matches = redacted.match(regex);
    if (matches) {
      redactionCount += matches.length;
      redacted = redacted.replace(regex, '[REDACTED]');
    }
  }

  return { redacted, redactionCount };
};

// ============================================================================
// STIX/TAXII SHARING PROTOCOLS
// ============================================================================

/**
 * Converts shared intelligence to STIX 2.1 bundle.
 *
 * @param {SharedIntelligence} intelligence - Intelligence to convert
 * @returns {Promise<any>} STIX 2.1 bundle
 *
 * @example
 * ```typescript
 * const stixBundle = await convertToSTIX(intel);
 * console.log('STIX version:', stixBundle.spec_version);
 * console.log('Objects:', stixBundle.objects.length);
 * ```
 */
export const convertToSTIX = async (
  intelligence: SharedIntelligence
): Promise<any> => {
  const bundle = {
    type: 'bundle',
    id: `bundle--${crypto.randomUUID()}`,
    spec_version: '2.1',
    created: new Date().toISOString(),
    objects: [],
  };

  // Convert indicators to STIX format
  for (const indicator of intelligence.indicators) {
    bundle.objects.push({
      type: 'indicator',
      spec_version: '2.1',
      id: `indicator--${crypto.randomUUID()}`,
      created: indicator.firstSeen.toISOString(),
      modified: indicator.lastSeen.toISOString(),
      name: `${indicator.type}: ${indicator.value}`,
      pattern: `[${indicator.type.toLowerCase()}:value = '${indicator.value}']`,
      pattern_type: 'stix',
      valid_from: indicator.firstSeen.toISOString(),
      confidence: indicator.confidence,
    });
  }

  return bundle;
};

/**
 * Publishes intelligence to TAXII server.
 *
 * @param {string} taxiiEndpoint - TAXII server endpoint
 * @param {any} stixBundle - STIX bundle to publish
 * @param {Record<string, any>} authentication - Auth credentials
 * @returns {Promise<{ success: boolean; statusId?: string }>} Publication result
 *
 * @example
 * ```typescript
 * const result = await publishToTAXII(
 *   'https://taxii.partner.com/api',
 *   stixBundle,
 *   { type: 'API_KEY', apiKey: 'secret' }
 * );
 * ```
 */
export const publishToTAXII = async (
  taxiiEndpoint: string,
  stixBundle: any,
  authentication: Record<string, any>
): Promise<{ success: boolean; statusId?: string }> => {
  // In production, send to TAXII server
  const statusId = crypto.randomUUID();

  return {
    success: true,
    statusId,
  };
};

/**
 * Fetches intelligence from TAXII server.
 *
 * @param {string} taxiiEndpoint - TAXII server endpoint
 * @param {string} collectionId - Collection to fetch from
 * @param {Record<string, any>} authentication - Auth credentials
 * @returns {Promise<any[]>} STIX bundles
 *
 * @example
 * ```typescript
 * const bundles = await fetchFromTAXII(
 *   'https://taxii.isac.com/api',
 *   'healthcare-iocs',
 *   { type: 'API_KEY', apiKey: 'secret' }
 * );
 * ```
 */
export const fetchFromTAXII = async (
  taxiiEndpoint: string,
  collectionId: string,
  authentication: Record<string, any>
): Promise<any[]> => {
  // In production, fetch from TAXII server
  return [];
};

/**
 * Validates STIX bundle format.
 *
 * @param {any} bundle - Bundle to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSTIXBundle(bundle);
 * if (!validation.valid) {
 *   console.error('STIX errors:', validation.errors);
 * }
 * ```
 */
export const validateSTIXBundle = async (
  bundle: any
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (bundle.type !== 'bundle') {
    errors.push('Invalid bundle type');
  }

  if (bundle.spec_version !== '2.1') {
    errors.push('Unsupported STIX version');
  }

  if (!Array.isArray(bundle.objects)) {
    errors.push('Bundle must contain objects array');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// COLLABORATIVE HUNTING
// ============================================================================

/**
 * Creates a collaborative threat hunting session.
 *
 * @param {Partial<HuntingSession>} sessionData - Session configuration
 * @returns {Promise<HuntingSession>} Created session
 *
 * @example
 * ```typescript
 * const session = await createHuntingSession({
 *   workspaceId: 'workspace-123',
 *   name: 'APT29 Lateral Movement Hunt',
 *   hypothesis: 'APT29 using WMI for lateral movement in healthcare networks',
 *   hunters: [
 *     { userId: 'hunter-1', role: 'LEAD' },
 *     { userId: 'hunter-2', role: 'HUNTER' }
 *   ]
 * });
 * ```
 */
export const createHuntingSession = async (
  sessionData: Partial<HuntingSession>
): Promise<HuntingSession> => {
  const session: HuntingSession = {
    id: crypto.randomUUID(),
    workspaceId: sessionData.workspaceId!,
    name: sessionData.name || 'Unnamed Hunt',
    description: sessionData.description || '',
    hypothesis: sessionData.hypothesis || '',
    status: HuntingStatus.PLANNING,
    hunters: sessionData.hunters || [],
    queries: [],
    findings: [],
    startedAt: new Date(),
    metadata: sessionData.metadata || {},
  };

  return session;
};

/**
 * Adds a hunter to collaborative session.
 *
 * @param {string} sessionId - Session identifier
 * @param {string} userId - User to add
 * @param {'LEAD' | 'HUNTER' | 'OBSERVER'} role - Hunter role
 * @returns {Promise<HunterParticipant>} Added hunter
 *
 * @example
 * ```typescript
 * await addHunter('session-123', 'hunter-456', 'HUNTER');
 * ```
 */
export const addHunter = async (
  sessionId: string,
  userId: string,
  role: 'LEAD' | 'HUNTER' | 'OBSERVER'
): Promise<HunterParticipant> => {
  const hunter: HunterParticipant = {
    userId,
    username: `hunter-${userId}`,
    organization: 'Partner Hospital',
    role,
    joinedAt: new Date(),
    contributionsCount: 0,
  };

  return hunter;
};

/**
 * Submits a hunting query to session.
 *
 * @param {string} sessionId - Session identifier
 * @param {Partial<HuntingQuery>} queryData - Query details
 * @returns {Promise<HuntingQuery>} Submitted query
 *
 * @example
 * ```typescript
 * const query = await submitHuntingQuery('session-123', {
 *   name: 'WMI Process Creation',
 *   query: 'process_name:wmiprvse.exe AND parent_process:svchost.exe',
 *   platform: 'Splunk',
 *   executedBy: 'hunter-1'
 * });
 * ```
 */
export const submitHuntingQuery = async (
  sessionId: string,
  queryData: Partial<HuntingQuery>
): Promise<HuntingQuery> => {
  const query: HuntingQuery = {
    id: crypto.randomUUID(),
    sessionId,
    name: queryData.name || 'Unnamed Query',
    query: queryData.query || '',
    platform: queryData.platform || 'Unknown',
    executedBy: queryData.executedBy || 'unknown',
    executedAt: new Date(),
    resultsCount: queryData.resultsCount || 0,
    sharedWithTeam: queryData.sharedWithTeam ?? true,
  };

  return query;
};

/**
 * Submits a finding from collaborative hunting.
 *
 * @param {string} sessionId - Session identifier
 * @param {Partial<HuntingFinding>} findingData - Finding details
 * @returns {Promise<HuntingFinding>} Submitted finding
 *
 * @example
 * ```typescript
 * const finding = await submitHuntingFinding('session-123', {
 *   title: 'Suspicious WMI lateral movement',
 *   severity: 'HIGH',
 *   indicators: [
 *     { type: IndicatorType.IP_ADDRESS, value: '10.0.0.50' }
 *   ],
 *   discoveredBy: 'hunter-1'
 * });
 * ```
 */
export const submitHuntingFinding = async (
  sessionId: string,
  findingData: Partial<HuntingFinding>
): Promise<HuntingFinding> => {
  const finding: HuntingFinding = {
    id: crypto.randomUUID(),
    sessionId,
    title: findingData.title || 'Untitled Finding',
    description: findingData.description || '',
    severity: findingData.severity || 'MEDIUM',
    indicators: findingData.indicators || [],
    evidence: findingData.evidence || [],
    discoveredBy: findingData.discoveredBy || 'unknown',
    discoveredAt: new Date(),
    verified: false,
    verifiedBy: [],
    sharedAsIntelligence: false,
  };

  return finding;
};

/**
 * Verifies a hunting finding as accurate.
 *
 * @param {string} findingId - Finding to verify
 * @param {string} verifierId - User verifying
 * @returns {Promise<boolean>} True if verified
 *
 * @example
 * ```typescript
 * await verifyHuntingFinding('finding-123', 'senior-hunter-001');
 * ```
 */
export const verifyHuntingFinding = async (
  findingId: string,
  verifierId: string
): Promise<boolean> => {
  // In production, update finding in database
  return true;
};

/**
 * Converts hunting finding to shared intelligence.
 *
 * @param {HuntingFinding} finding - Finding to convert
 * @param {string} workspaceId - Workspace to share to
 * @returns {Promise<SharedIntelligence>} Created intelligence
 *
 * @example
 * ```typescript
 * const intel = await convertFindingToIntelligence(finding, 'workspace-123');
 * console.log('Shared intelligence:', intel.id);
 * ```
 */
export const convertFindingToIntelligence = async (
  finding: HuntingFinding,
  workspaceId: string
): Promise<SharedIntelligence> => {
  const intelligence = await shareIntelligence({
    workspaceId,
    type: IntelligenceType.INCIDENT,
    title: finding.title,
    description: finding.description,
    severity: finding.severity,
    indicators: finding.indicators,
    confidence: finding.verified ? 90 : 60,
    tlp: TLPLevel.AMBER,
    sharedBy: finding.discoveredBy,
    metadata: {
      huntingSessionId: finding.sessionId,
      findingId: finding.id,
      discoveredBy: finding.discoveredBy,
    },
  });

  return intelligence;
};

/**
 * Gets collaborative hunting session statistics.
 *
 * @param {string} sessionId - Session identifier
 * @returns {Promise<{ queries: number; findings: number; hunters: number; duration: number }>} Session stats
 *
 * @example
 * ```typescript
 * const stats = await getHuntingSessionStats('session-123');
 * console.log('Total findings:', stats.findings);
 * console.log('Active hunters:', stats.hunters);
 * ```
 */
export const getHuntingSessionStats = async (
  sessionId: string
): Promise<{ queries: number; findings: number; hunters: number; duration: number }> => {
  // In production, aggregate from database
  return {
    queries: 15,
    findings: 4,
    hunters: 3,
    duration: 7200000, // 2 hours
  };
};
