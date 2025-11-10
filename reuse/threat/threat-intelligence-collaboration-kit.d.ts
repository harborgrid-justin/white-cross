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
 * Threat intelligence sharing workspace
 */
export interface CollaborationWorkspace {
    id: string;
    name: string;
    description: string;
    type: WorkspaceType;
    visibility: WorkspaceVisibility;
    members: WorkspaceMember[];
    sharedIntelligence: string[];
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
export declare enum WorkspaceType {
    INCIDENT_RESPONSE = "INCIDENT_RESPONSE",
    THREAT_HUNTING = "THREAT_HUNTING",
    INTELLIGENCE_EXCHANGE = "INTELLIGENCE_EXCHANGE",
    RESEARCH = "RESEARCH",
    PARTNER_SHARING = "PARTNER_SHARING",
    SECTOR_ISAC = "SECTOR_ISAC"
}
/**
 * Workspace visibility levels
 */
export declare enum WorkspaceVisibility {
    PRIVATE = "PRIVATE",
    ORGANIZATION = "ORGANIZATION",
    PARTNER = "PARTNER",
    COMMUNITY = "COMMUNITY",
    PUBLIC = "PUBLIC"
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
export declare enum WorkspaceRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    CONTRIBUTOR = "CONTRIBUTOR",
    ANALYST = "ANALYST",
    VIEWER = "VIEWER"
}
/**
 * Workspace permissions
 */
export declare enum WorkspacePermission {
    VIEW_INTELLIGENCE = "VIEW_INTELLIGENCE",
    ADD_INTELLIGENCE = "ADD_INTELLIGENCE",
    EDIT_INTELLIGENCE = "EDIT_INTELLIGENCE",
    DELETE_INTELLIGENCE = "DELETE_INTELLIGENCE",
    COMMENT = "COMMENT",
    SHARE_EXTERNAL = "SHARE_EXTERNAL",
    MANAGE_MEMBERS = "MANAGE_MEMBERS",
    MANAGE_SETTINGS = "MANAGE_SETTINGS",
    EXPORT = "EXPORT",
    ANNOTATE = "ANNOTATE"
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
export declare enum TLPLevel {
    RED = "RED",// Not for disclosure
    AMBER = "AMBER",// Limited disclosure
    GREEN = "GREEN",// Community wide
    WHITE = "WHITE"
}
/**
 * Sanitization levels for shared intelligence
 */
export declare enum SanitizationLevel {
    NONE = "NONE",
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    STRICT = "STRICT"
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
    confidence: number;
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
    stixBundle?: any;
    metadata?: Record<string, any>;
}
/**
 * Intelligence types
 */
export declare enum IntelligenceType {
    IOC = "IOC",
    THREAT_ACTOR = "THREAT_ACTOR",
    CAMPAIGN = "CAMPAIGN",
    TTP = "TTP",
    VULNERABILITY = "VULNERABILITY",
    MALWARE = "MALWARE",
    TOOL = "TOOL",
    INCIDENT = "INCIDENT"
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
export declare enum IndicatorType {
    IP_ADDRESS = "IP_ADDRESS",
    DOMAIN = "DOMAIN",
    URL = "URL",
    EMAIL = "EMAIL",
    FILE_HASH = "FILE_HASH",
    FILE_NAME = "FILE_NAME",
    REGISTRY_KEY = "REGISTRY_KEY",
    MUTEX = "MUTEX",
    CVE = "CVE"
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
    target: string;
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
export declare enum AnnotationType {
    ENRICHMENT = "ENRICHMENT",
    CORRECTION = "CORRECTION",
    CONTEXT = "CONTEXT",
    RELATIONSHIP = "RELATIONSHIP",
    DETECTION = "DETECTION",
    MITIGATION = "MITIGATION",
    FALSE_POSITIVE = "FALSE_POSITIVE"
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
    updateInterval: number;
    enabled: boolean;
    authentication: FeedAuthentication;
    endpoint?: string;
    createdAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Feed types
 */
export declare enum FeedType {
    PUSH = "PUSH",
    PULL = "PULL",
    TAXII = "TAXII",
    REST_API = "REST_API",
    WEBHOOK = "WEBHOOK"
}
/**
 * Feed formats
 */
export declare enum FeedFormat {
    STIX_2_1 = "STIX_2_1",
    JSON = "JSON",
    CSV = "CSV",
    MISP = "MISP",
    CUSTOM = "CUSTOM"
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
    grantedTo: string;
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
export declare enum HuntingStatus {
    PLANNING = "PLANNING",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED"
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
export declare const getCollaborationWorkspaceModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    type: {
        type: string;
        allowNull: boolean;
    };
    visibility: {
        type: string;
        allowNull: boolean;
    };
    members: {
        type: string;
        defaultValue: never[];
    };
    sharedIntelligence: {
        type: string;
        defaultValue: never[];
    };
    createdBy: {
        type: string;
        allowNull: boolean;
    };
    settings: {
        type: string;
        defaultValue: {};
    };
    tags: {
        type: string;
        defaultValue: never[];
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const getSharedIntelligenceModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    workspaceId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    type: {
        type: string;
        allowNull: boolean;
    };
    title: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    tlp: {
        type: string;
        allowNull: boolean;
        defaultValue: TLPLevel;
    };
    confidence: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
    };
    severity: {
        type: string;
        allowNull: boolean;
    };
    indicators: {
        type: string;
        defaultValue: never[];
    };
    tags: {
        type: string;
        defaultValue: never[];
    };
    sharedBy: {
        type: string;
        allowNull: boolean;
    };
    sharedAt: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
    };
    sanitized: {
        type: string;
        defaultValue: boolean;
    };
    sanitizationDetails: {
        type: string;
        allowNull: boolean;
    };
    relatedIntelligence: {
        type: string;
        defaultValue: never[];
    };
    comments: {
        type: string;
        defaultValue: never[];
    };
    annotations: {
        type: string;
        defaultValue: never[];
    };
    stixBundle: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const getSharingFeedModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    type: {
        type: string;
        allowNull: boolean;
    };
    format: {
        type: string;
        allowNull: boolean;
    };
    workspaceId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    subscribers: {
        type: string;
        defaultValue: never[];
    };
    filters: {
        type: string;
        defaultValue: never[];
    };
    updateInterval: {
        type: string;
        defaultValue: number;
    };
    enabled: {
        type: string;
        defaultValue: boolean;
    };
    authentication: {
        type: string;
        defaultValue: {
            type: string;
        };
    };
    endpoint: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const getHuntingSessionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    workspaceId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    name: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    hypothesis: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        allowNull: boolean;
        defaultValue: HuntingStatus;
    };
    hunters: {
        type: string;
        defaultValue: never[];
    };
    queries: {
        type: string;
        defaultValue: never[];
    };
    findings: {
        type: string;
        defaultValue: never[];
    };
    startedAt: {
        type: string;
        allowNull: boolean;
    };
    completedAt: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const createCollaborationWorkspace: (workspaceData: Partial<CollaborationWorkspace>) => Promise<CollaborationWorkspace>;
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
export declare const addWorkspaceMember: (workspaceId: string, userId: string, role: WorkspaceRole, invitedBy: string) => Promise<WorkspaceMember>;
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
export declare const getRolePermissions: (role: WorkspaceRole) => WorkspacePermission[];
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
export declare const validateWorkspacePermission: (workspaceId: string, userId: string, permission: WorkspacePermission) => Promise<boolean>;
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
export declare const removeWorkspaceMember: (workspaceId: string, userId: string) => Promise<boolean>;
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
export declare const updateWorkspaceSettings: (workspaceId: string, settings: Partial<WorkspaceSettings>) => Promise<WorkspaceSettings>;
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
export declare const shareIntelligence: (intelligenceData: Partial<SharedIntelligence>) => Promise<SharedIntelligence>;
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
export declare const getSharedIntelligence: (intelligenceId: string, userId: string) => Promise<SharedIntelligence | null>;
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
export declare const updateSharedIntelligence: (intelligenceId: string, updates: Partial<SharedIntelligence>) => Promise<SharedIntelligence>;
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
export declare const searchSharedIntelligence: (workspaceId: string, filters: Record<string, any>) => Promise<SharedIntelligence[]>;
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
export declare const relateIntelligence: (intelligenceId: string, relatedIds: string[]) => Promise<boolean>;
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
export declare const addIntelligenceComment: (intelligenceId: string, author: string, content: string, replyTo?: string) => Promise<IntelligenceComment>;
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
export declare const addCommentReaction: (commentId: string, userId: string, reactionType: "LIKE" | "HELPFUL" | "CONFIRMED" | "DISPUTED") => Promise<CommentReaction>;
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
export declare const addIntelligenceAnnotation: (intelligenceId: string, annotator: string, annotationType: AnnotationType, target: string, content: string) => Promise<IntelligenceAnnotation>;
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
export declare const verifyAnnotation: (annotationId: string, verifierId: string) => Promise<boolean>;
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
export declare const getIntelligenceComments: (intelligenceId: string) => Promise<IntelligenceComment[]>;
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
export declare const getIntelligenceAnnotations: (intelligenceId: string) => Promise<IntelligenceAnnotation[]>;
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
export declare const createSharingFeed: (feedData: Partial<SharingFeed>) => Promise<SharingFeed>;
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
export declare const subscribeToFeed: (feedId: string, organization: string, contactEmail: string) => Promise<FeedSubscriber>;
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
export declare const generateFeedContent: (feedId: string, since?: Date) => Promise<any>;
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
export declare const applyFeedFilters: (intelligence: SharedIntelligence[], filters: FeedFilter[]) => Promise<SharedIntelligence[]>;
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
export declare const revokeFeedAccess: (feedId: string, subscriberId: string) => Promise<boolean>;
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
export declare const sanitizeIntelligence: (intelligence: SharedIntelligence, level: SanitizationLevel) => Promise<{
    sanitized: SharedIntelligence;
    details: SanitizationDetails;
}>;
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
export declare const validateSanitization: (intelligence: SharedIntelligence, tlp: TLPLevel) => Promise<{
    compliant: boolean;
    violations: string[];
}>;
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
export declare const redactSensitiveInfo: (content: string, patterns: string[]) => Promise<{
    redacted: string;
    redactionCount: number;
}>;
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
export declare const convertToSTIX: (intelligence: SharedIntelligence) => Promise<any>;
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
export declare const publishToTAXII: (taxiiEndpoint: string, stixBundle: any, authentication: Record<string, any>) => Promise<{
    success: boolean;
    statusId?: string;
}>;
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
export declare const fetchFromTAXII: (taxiiEndpoint: string, collectionId: string, authentication: Record<string, any>) => Promise<any[]>;
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
export declare const validateSTIXBundle: (bundle: any) => Promise<{
    valid: boolean;
    errors: string[];
}>;
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
export declare const createHuntingSession: (sessionData: Partial<HuntingSession>) => Promise<HuntingSession>;
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
export declare const addHunter: (sessionId: string, userId: string, role: "LEAD" | "HUNTER" | "OBSERVER") => Promise<HunterParticipant>;
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
export declare const submitHuntingQuery: (sessionId: string, queryData: Partial<HuntingQuery>) => Promise<HuntingQuery>;
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
export declare const submitHuntingFinding: (sessionId: string, findingData: Partial<HuntingFinding>) => Promise<HuntingFinding>;
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
export declare const verifyHuntingFinding: (findingId: string, verifierId: string) => Promise<boolean>;
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
export declare const convertFindingToIntelligence: (finding: HuntingFinding, workspaceId: string) => Promise<SharedIntelligence>;
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
export declare const getHuntingSessionStats: (sessionId: string) => Promise<{
    queries: number;
    findings: number;
    hunters: number;
    duration: number;
}>;
//# sourceMappingURL=threat-intelligence-collaboration-kit.d.ts.map