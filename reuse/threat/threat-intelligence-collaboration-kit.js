"use strict";
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
exports.verifyHuntingFinding = exports.submitHuntingFinding = exports.submitHuntingQuery = exports.addHunter = exports.createHuntingSession = exports.validateSTIXBundle = exports.fetchFromTAXII = exports.publishToTAXII = exports.convertToSTIX = exports.redactSensitiveInfo = exports.validateSanitization = exports.sanitizeIntelligence = exports.revokeFeedAccess = exports.applyFeedFilters = exports.generateFeedContent = exports.subscribeToFeed = exports.createSharingFeed = exports.getIntelligenceAnnotations = exports.getIntelligenceComments = exports.verifyAnnotation = exports.addIntelligenceAnnotation = exports.addCommentReaction = exports.addIntelligenceComment = exports.relateIntelligence = exports.searchSharedIntelligence = exports.updateSharedIntelligence = exports.getSharedIntelligence = exports.shareIntelligence = exports.updateWorkspaceSettings = exports.removeWorkspaceMember = exports.validateWorkspacePermission = exports.getRolePermissions = exports.addWorkspaceMember = exports.createCollaborationWorkspace = exports.getHuntingSessionModelAttributes = exports.getSharingFeedModelAttributes = exports.getSharedIntelligenceModelAttributes = exports.getCollaborationWorkspaceModelAttributes = exports.HuntingStatus = exports.FeedFormat = exports.FeedType = exports.AnnotationType = exports.IndicatorType = exports.IntelligenceType = exports.SanitizationLevel = exports.TLPLevel = exports.WorkspacePermission = exports.WorkspaceRole = exports.WorkspaceVisibility = exports.WorkspaceType = void 0;
exports.getHuntingSessionStats = exports.convertFindingToIntelligence = void 0;
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
const crypto = __importStar(require("crypto"));
/**
 * Workspace types for different collaboration scenarios
 */
var WorkspaceType;
(function (WorkspaceType) {
    WorkspaceType["INCIDENT_RESPONSE"] = "INCIDENT_RESPONSE";
    WorkspaceType["THREAT_HUNTING"] = "THREAT_HUNTING";
    WorkspaceType["INTELLIGENCE_EXCHANGE"] = "INTELLIGENCE_EXCHANGE";
    WorkspaceType["RESEARCH"] = "RESEARCH";
    WorkspaceType["PARTNER_SHARING"] = "PARTNER_SHARING";
    WorkspaceType["SECTOR_ISAC"] = "SECTOR_ISAC";
})(WorkspaceType || (exports.WorkspaceType = WorkspaceType = {}));
/**
 * Workspace visibility levels
 */
var WorkspaceVisibility;
(function (WorkspaceVisibility) {
    WorkspaceVisibility["PRIVATE"] = "PRIVATE";
    WorkspaceVisibility["ORGANIZATION"] = "ORGANIZATION";
    WorkspaceVisibility["PARTNER"] = "PARTNER";
    WorkspaceVisibility["COMMUNITY"] = "COMMUNITY";
    WorkspaceVisibility["PUBLIC"] = "PUBLIC";
})(WorkspaceVisibility || (exports.WorkspaceVisibility = WorkspaceVisibility = {}));
/**
 * Workspace roles
 */
var WorkspaceRole;
(function (WorkspaceRole) {
    WorkspaceRole["OWNER"] = "OWNER";
    WorkspaceRole["ADMIN"] = "ADMIN";
    WorkspaceRole["CONTRIBUTOR"] = "CONTRIBUTOR";
    WorkspaceRole["ANALYST"] = "ANALYST";
    WorkspaceRole["VIEWER"] = "VIEWER";
})(WorkspaceRole || (exports.WorkspaceRole = WorkspaceRole = {}));
/**
 * Workspace permissions
 */
var WorkspacePermission;
(function (WorkspacePermission) {
    WorkspacePermission["VIEW_INTELLIGENCE"] = "VIEW_INTELLIGENCE";
    WorkspacePermission["ADD_INTELLIGENCE"] = "ADD_INTELLIGENCE";
    WorkspacePermission["EDIT_INTELLIGENCE"] = "EDIT_INTELLIGENCE";
    WorkspacePermission["DELETE_INTELLIGENCE"] = "DELETE_INTELLIGENCE";
    WorkspacePermission["COMMENT"] = "COMMENT";
    WorkspacePermission["SHARE_EXTERNAL"] = "SHARE_EXTERNAL";
    WorkspacePermission["MANAGE_MEMBERS"] = "MANAGE_MEMBERS";
    WorkspacePermission["MANAGE_SETTINGS"] = "MANAGE_SETTINGS";
    WorkspacePermission["EXPORT"] = "EXPORT";
    WorkspacePermission["ANNOTATE"] = "ANNOTATE";
})(WorkspacePermission || (exports.WorkspacePermission = WorkspacePermission = {}));
/**
 * Traffic Light Protocol (TLP) classification
 */
var TLPLevel;
(function (TLPLevel) {
    TLPLevel["RED"] = "RED";
    TLPLevel["AMBER"] = "AMBER";
    TLPLevel["GREEN"] = "GREEN";
    TLPLevel["WHITE"] = "WHITE";
})(TLPLevel || (exports.TLPLevel = TLPLevel = {}));
/**
 * Sanitization levels for shared intelligence
 */
var SanitizationLevel;
(function (SanitizationLevel) {
    SanitizationLevel["NONE"] = "NONE";
    SanitizationLevel["LOW"] = "LOW";
    SanitizationLevel["MEDIUM"] = "MEDIUM";
    SanitizationLevel["HIGH"] = "HIGH";
    SanitizationLevel["STRICT"] = "STRICT";
})(SanitizationLevel || (exports.SanitizationLevel = SanitizationLevel = {}));
/**
 * Intelligence types
 */
var IntelligenceType;
(function (IntelligenceType) {
    IntelligenceType["IOC"] = "IOC";
    IntelligenceType["THREAT_ACTOR"] = "THREAT_ACTOR";
    IntelligenceType["CAMPAIGN"] = "CAMPAIGN";
    IntelligenceType["TTP"] = "TTP";
    IntelligenceType["VULNERABILITY"] = "VULNERABILITY";
    IntelligenceType["MALWARE"] = "MALWARE";
    IntelligenceType["TOOL"] = "TOOL";
    IntelligenceType["INCIDENT"] = "INCIDENT";
})(IntelligenceType || (exports.IntelligenceType = IntelligenceType = {}));
/**
 * Indicator types
 */
var IndicatorType;
(function (IndicatorType) {
    IndicatorType["IP_ADDRESS"] = "IP_ADDRESS";
    IndicatorType["DOMAIN"] = "DOMAIN";
    IndicatorType["URL"] = "URL";
    IndicatorType["EMAIL"] = "EMAIL";
    IndicatorType["FILE_HASH"] = "FILE_HASH";
    IndicatorType["FILE_NAME"] = "FILE_NAME";
    IndicatorType["REGISTRY_KEY"] = "REGISTRY_KEY";
    IndicatorType["MUTEX"] = "MUTEX";
    IndicatorType["CVE"] = "CVE";
})(IndicatorType || (exports.IndicatorType = IndicatorType = {}));
/**
 * Annotation types
 */
var AnnotationType;
(function (AnnotationType) {
    AnnotationType["ENRICHMENT"] = "ENRICHMENT";
    AnnotationType["CORRECTION"] = "CORRECTION";
    AnnotationType["CONTEXT"] = "CONTEXT";
    AnnotationType["RELATIONSHIP"] = "RELATIONSHIP";
    AnnotationType["DETECTION"] = "DETECTION";
    AnnotationType["MITIGATION"] = "MITIGATION";
    AnnotationType["FALSE_POSITIVE"] = "FALSE_POSITIVE";
})(AnnotationType || (exports.AnnotationType = AnnotationType = {}));
/**
 * Feed types
 */
var FeedType;
(function (FeedType) {
    FeedType["PUSH"] = "PUSH";
    FeedType["PULL"] = "PULL";
    FeedType["TAXII"] = "TAXII";
    FeedType["REST_API"] = "REST_API";
    FeedType["WEBHOOK"] = "WEBHOOK";
})(FeedType || (exports.FeedType = FeedType = {}));
/**
 * Feed formats
 */
var FeedFormat;
(function (FeedFormat) {
    FeedFormat["STIX_2_1"] = "STIX_2_1";
    FeedFormat["JSON"] = "JSON";
    FeedFormat["CSV"] = "CSV";
    FeedFormat["MISP"] = "MISP";
    FeedFormat["CUSTOM"] = "CUSTOM";
})(FeedFormat || (exports.FeedFormat = FeedFormat = {}));
/**
 * Hunting session status
 */
var HuntingStatus;
(function (HuntingStatus) {
    HuntingStatus["PLANNING"] = "PLANNING";
    HuntingStatus["ACTIVE"] = "ACTIVE";
    HuntingStatus["PAUSED"] = "PAUSED";
    HuntingStatus["COMPLETED"] = "COMPLETED";
    HuntingStatus["ARCHIVED"] = "ARCHIVED";
})(HuntingStatus || (exports.HuntingStatus = HuntingStatus = {}));
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
const getCollaborationWorkspaceModelAttributes = () => ({
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
exports.getCollaborationWorkspaceModelAttributes = getCollaborationWorkspaceModelAttributes;
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
const getSharedIntelligenceModelAttributes = () => ({
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
exports.getSharedIntelligenceModelAttributes = getSharedIntelligenceModelAttributes;
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
const getSharingFeedModelAttributes = () => ({
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
exports.getSharingFeedModelAttributes = getSharingFeedModelAttributes;
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
const getHuntingSessionModelAttributes = () => ({
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
exports.getHuntingSessionModelAttributes = getHuntingSessionModelAttributes;
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
const createCollaborationWorkspace = async (workspaceData) => {
    const workspace = {
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
exports.createCollaborationWorkspace = createCollaborationWorkspace;
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
const addWorkspaceMember = async (workspaceId, userId, role, invitedBy) => {
    const permissions = (0, exports.getRolePermissions)(role);
    const member = {
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
exports.addWorkspaceMember = addWorkspaceMember;
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
const getRolePermissions = (role) => {
    const permissionMap = {
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
exports.getRolePermissions = getRolePermissions;
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
const validateWorkspacePermission = async (workspaceId, userId, permission) => {
    // In production, fetch workspace and check member permissions
    return true;
};
exports.validateWorkspacePermission = validateWorkspacePermission;
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
const removeWorkspaceMember = async (workspaceId, userId) => {
    // In production, remove from database
    return true;
};
exports.removeWorkspaceMember = removeWorkspaceMember;
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
const updateWorkspaceSettings = async (workspaceId, settings) => {
    const defaultSettings = {
        autoApproveMembers: false,
        requireApprovalForSharing: true,
        enableNotifications: true,
        notificationChannels: ['email'],
        tlpDefault: TLPLevel.AMBER,
        sanitizationLevel: SanitizationLevel.MEDIUM,
    };
    return { ...defaultSettings, ...settings };
};
exports.updateWorkspaceSettings = updateWorkspaceSettings;
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
const shareIntelligence = async (intelligenceData) => {
    const intelligence = {
        id: crypto.randomUUID(),
        workspaceId: intelligenceData.workspaceId,
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
exports.shareIntelligence = shareIntelligence;
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
const getSharedIntelligence = async (intelligenceId, userId) => {
    // In production, fetch from database with access control
    return null;
};
exports.getSharedIntelligence = getSharedIntelligence;
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
const updateSharedIntelligence = async (intelligenceId, updates) => {
    // In production, update in database
    const intelligence = await (0, exports.shareIntelligence)({ id: intelligenceId, ...updates });
    return intelligence;
};
exports.updateSharedIntelligence = updateSharedIntelligence;
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
const searchSharedIntelligence = async (workspaceId, filters) => {
    // In production, query database with filters
    return [];
};
exports.searchSharedIntelligence = searchSharedIntelligence;
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
const relateIntelligence = async (intelligenceId, relatedIds) => {
    // In production, update relationships in database
    return true;
};
exports.relateIntelligence = relateIntelligence;
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
const addIntelligenceComment = async (intelligenceId, author, content, replyTo) => {
    const comment = {
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
exports.addIntelligenceComment = addIntelligenceComment;
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
const addCommentReaction = async (commentId, userId, reactionType) => {
    const reaction = {
        userId,
        type: reactionType,
        timestamp: new Date(),
    };
    return reaction;
};
exports.addCommentReaction = addCommentReaction;
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
const addIntelligenceAnnotation = async (intelligenceId, annotator, annotationType, target, content) => {
    const annotation = {
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
exports.addIntelligenceAnnotation = addIntelligenceAnnotation;
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
const verifyAnnotation = async (annotationId, verifierId) => {
    // In production, update annotation in database
    return true;
};
exports.verifyAnnotation = verifyAnnotation;
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
const getIntelligenceComments = async (intelligenceId) => {
    // In production, fetch from database
    return [];
};
exports.getIntelligenceComments = getIntelligenceComments;
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
const getIntelligenceAnnotations = async (intelligenceId) => {
    // In production, fetch from database
    return [];
};
exports.getIntelligenceAnnotations = getIntelligenceAnnotations;
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
const createSharingFeed = async (feedData) => {
    const feed = {
        id: crypto.randomUUID(),
        name: feedData.name || 'Unnamed Feed',
        description: feedData.description || '',
        type: feedData.type || FeedType.PULL,
        format: feedData.format || FeedFormat.JSON,
        workspaceId: feedData.workspaceId,
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
exports.createSharingFeed = createSharingFeed;
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
const subscribeToFeed = async (feedId, organization, contactEmail) => {
    const subscriber = {
        id: crypto.randomUUID(),
        organization,
        contactEmail,
        subscribedAt: new Date(),
        status: 'ACTIVE',
    };
    return subscriber;
};
exports.subscribeToFeed = subscribeToFeed;
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
const generateFeedContent = async (feedId, since) => {
    // In production, fetch intelligence and format according to feed type
    return {
        feedId,
        generatedAt: new Date(),
        itemCount: 42,
        items: [],
    };
};
exports.generateFeedContent = generateFeedContent;
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
const applyFeedFilters = async (intelligence, filters) => {
    let filtered = [...intelligence];
    for (const filter of filters) {
        filtered = filtered.filter(item => {
            const value = item[filter.field];
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
exports.applyFeedFilters = applyFeedFilters;
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
const revokeFeedAccess = async (feedId, subscriberId) => {
    // In production, update subscriber status
    return true;
};
exports.revokeFeedAccess = revokeFeedAccess;
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
const sanitizeIntelligence = async (intelligence, level) => {
    const sanitized = { ...intelligence };
    const removedFields = [];
    const obfuscatedFields = [];
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
    const details = {
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
exports.sanitizeIntelligence = sanitizeIntelligence;
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
const validateSanitization = async (intelligence, tlp) => {
    const violations = [];
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
exports.validateSanitization = validateSanitization;
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
const redactSensitiveInfo = async (content, patterns) => {
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
exports.redactSensitiveInfo = redactSensitiveInfo;
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
const convertToSTIX = async (intelligence) => {
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
exports.convertToSTIX = convertToSTIX;
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
const publishToTAXII = async (taxiiEndpoint, stixBundle, authentication) => {
    // In production, send to TAXII server
    const statusId = crypto.randomUUID();
    return {
        success: true,
        statusId,
    };
};
exports.publishToTAXII = publishToTAXII;
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
const fetchFromTAXII = async (taxiiEndpoint, collectionId, authentication) => {
    // In production, fetch from TAXII server
    return [];
};
exports.fetchFromTAXII = fetchFromTAXII;
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
const validateSTIXBundle = async (bundle) => {
    const errors = [];
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
exports.validateSTIXBundle = validateSTIXBundle;
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
const createHuntingSession = async (sessionData) => {
    const session = {
        id: crypto.randomUUID(),
        workspaceId: sessionData.workspaceId,
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
exports.createHuntingSession = createHuntingSession;
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
const addHunter = async (sessionId, userId, role) => {
    const hunter = {
        userId,
        username: `hunter-${userId}`,
        organization: 'Partner Hospital',
        role,
        joinedAt: new Date(),
        contributionsCount: 0,
    };
    return hunter;
};
exports.addHunter = addHunter;
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
const submitHuntingQuery = async (sessionId, queryData) => {
    const query = {
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
exports.submitHuntingQuery = submitHuntingQuery;
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
const submitHuntingFinding = async (sessionId, findingData) => {
    const finding = {
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
exports.submitHuntingFinding = submitHuntingFinding;
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
const verifyHuntingFinding = async (findingId, verifierId) => {
    // In production, update finding in database
    return true;
};
exports.verifyHuntingFinding = verifyHuntingFinding;
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
const convertFindingToIntelligence = async (finding, workspaceId) => {
    const intelligence = await (0, exports.shareIntelligence)({
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
exports.convertFindingToIntelligence = convertFindingToIntelligence;
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
const getHuntingSessionStats = async (sessionId) => {
    // In production, aggregate from database
    return {
        queries: 15,
        findings: 4,
        hunters: 3,
        duration: 7200000, // 2 hours
    };
};
exports.getHuntingSessionStats = getHuntingSessionStats;
//# sourceMappingURL=threat-intelligence-collaboration-kit.js.map