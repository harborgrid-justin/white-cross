"use strict";
/**
 * LOC: DOCCOLLAB001
 * File: /reuse/document/composites/document-collaboration-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-collaboration-kit
 *   - ../document-annotation-kit
 *   - ../document-advanced-annotations-kit
 *   - ../document-realtime-collaboration-kit
 *   - ../document-workflow-kit
 *
 * DOWNSTREAM (imported by):
 *   - Real-time collaboration services
 *   - Annotation management modules
 *   - Review workflow engines
 *   - Comment tracking systems
 *   - Shared editing services
 *   - Healthcare document collaboration dashboards
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endCollaborationSession = exports.validateParticipantPermission = exports.calculateCollaborationMetrics = exports.exportSessionActivityLog = exports.filterAnnotationsByPage = exports.countAnnotationsByType = exports.getActiveParticipants = exports.resolveCollaborationConflict = exports.detectCollaborationConflicts = exports.updateParticipantCursor = exports.createRealtimeUpdate = exports.createChangeEntry = exports.isWorkflowApproved = exports.isCurrentStageComplete = exports.advanceReviewWorkflow = exports.recordReviewDecision = exports.createReviewer = exports.createReviewWorkflow = exports.resolveComment = exports.addCommentReaction = exports.addCommentReply = exports.extractMentions = exports.createComment = exports.deleteAnnotation = exports.resolveAnnotation = exports.addAnnotationReply = exports.createAnnotation = exports.updateParticipantStatus = exports.getPermissionsForRole = exports.createParticipant = exports.removeParticipantFromSession = exports.addParticipantToSession = exports.createCollaborationSession = exports.ReviewWorkflowModel = exports.AnnotationModel = exports.CollaborationSessionModel = exports.ResolutionStrategy = exports.ConflictType = exports.UpdateType = exports.ChangeType = exports.ReviewDecision = exports.ReviewStatus = exports.ReactionType = exports.CommentStatus = exports.AnnotationStatus = exports.ShapeType = exports.AnnotationType = exports.ParticipantStatus = exports.ParticipantRole = exports.SessionStatus = void 0;
exports.DocumentCollaborationService = void 0;
/**
 * File: /reuse/document/composites/document-collaboration-composite.ts
 * Locator: WC-DOC-COLLABORATION-001
 * Purpose: Comprehensive Document Collaboration Toolkit - Production-ready real-time collaboration and annotation
 *
 * Upstream: Composed from document-collaboration-kit, document-annotation-kit, document-advanced-annotations-kit, document-realtime-collaboration-kit, document-workflow-kit
 * Downstream: ../backend/*, Collaboration services, Annotation management, Review workflows, Comment tracking, Shared editing
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 46 utility functions for real-time collaboration, annotations, comments, review workflows, shared editing
 *
 * LLM Context: Enterprise-grade document collaboration toolkit for White Cross healthcare platform.
 * Provides comprehensive collaboration capabilities including real-time multi-user editing, annotation
 * management with markup tools, threaded commenting systems, review and approval workflows, version
 * tracking for collaborative edits, presence awareness, conflict resolution, and HIPAA-compliant audit
 * trails for all collaboration activities. Composes functions from multiple document kits to provide
 * unified collaboration operations for medical chart reviews, peer consultations, multi-disciplinary
 * team discussions, and clinical documentation workflows.
 */
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
/**
 * Session status
 */
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["ACTIVE"] = "ACTIVE";
    SessionStatus["PAUSED"] = "PAUSED";
    SessionStatus["ENDED"] = "ENDED";
    SessionStatus["ARCHIVED"] = "ARCHIVED";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
/**
 * Participant roles
 */
var ParticipantRole;
(function (ParticipantRole) {
    ParticipantRole["OWNER"] = "OWNER";
    ParticipantRole["EDITOR"] = "EDITOR";
    ParticipantRole["REVIEWER"] = "REVIEWER";
    ParticipantRole["COMMENTER"] = "COMMENTER";
    ParticipantRole["VIEWER"] = "VIEWER";
})(ParticipantRole || (exports.ParticipantRole = ParticipantRole = {}));
/**
 * Participant status
 */
var ParticipantStatus;
(function (ParticipantStatus) {
    ParticipantStatus["ONLINE"] = "ONLINE";
    ParticipantStatus["IDLE"] = "IDLE";
    ParticipantStatus["OFFLINE"] = "OFFLINE";
})(ParticipantStatus || (exports.ParticipantStatus = ParticipantStatus = {}));
/**
 * Annotation types
 */
var AnnotationType;
(function (AnnotationType) {
    AnnotationType["HIGHLIGHT"] = "HIGHLIGHT";
    AnnotationType["STRIKETHROUGH"] = "STRIKETHROUGH";
    AnnotationType["UNDERLINE"] = "UNDERLINE";
    AnnotationType["TEXT_NOTE"] = "TEXT_NOTE";
    AnnotationType["STICKY_NOTE"] = "STICKY_NOTE";
    AnnotationType["FREEHAND_DRAWING"] = "FREEHAND_DRAWING";
    AnnotationType["SHAPE"] = "SHAPE";
    AnnotationType["ARROW"] = "ARROW";
    AnnotationType["STAMP"] = "STAMP";
    AnnotationType["REDACTION"] = "REDACTION";
})(AnnotationType || (exports.AnnotationType = AnnotationType = {}));
/**
 * Shape types for annotations
 */
var ShapeType;
(function (ShapeType) {
    ShapeType["RECTANGLE"] = "RECTANGLE";
    ShapeType["CIRCLE"] = "CIRCLE";
    ShapeType["ELLIPSE"] = "ELLIPSE";
    ShapeType["LINE"] = "LINE";
    ShapeType["ARROW"] = "ARROW";
    ShapeType["POLYGON"] = "POLYGON";
})(ShapeType || (exports.ShapeType = ShapeType = {}));
/**
 * Annotation status
 */
var AnnotationStatus;
(function (AnnotationStatus) {
    AnnotationStatus["ACTIVE"] = "ACTIVE";
    AnnotationStatus["RESOLVED"] = "RESOLVED";
    AnnotationStatus["DELETED"] = "DELETED";
    AnnotationStatus["ARCHIVED"] = "ARCHIVED";
})(AnnotationStatus || (exports.AnnotationStatus = AnnotationStatus = {}));
/**
 * Comment status
 */
var CommentStatus;
(function (CommentStatus) {
    CommentStatus["ACTIVE"] = "ACTIVE";
    CommentStatus["RESOLVED"] = "RESOLVED";
    CommentStatus["DELETED"] = "DELETED";
    CommentStatus["EDITED"] = "EDITED";
})(CommentStatus || (exports.CommentStatus = CommentStatus = {}));
/**
 * Reaction types
 */
var ReactionType;
(function (ReactionType) {
    ReactionType["LIKE"] = "LIKE";
    ReactionType["AGREE"] = "AGREE";
    ReactionType["DISAGREE"] = "DISAGREE";
    ReactionType["QUESTION"] = "QUESTION";
    ReactionType["IMPORTANT"] = "IMPORTANT";
})(ReactionType || (exports.ReactionType = ReactionType = {}));
/**
 * Review status
 */
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PENDING"] = "PENDING";
    ReviewStatus["IN_REVIEW"] = "IN_REVIEW";
    ReviewStatus["APPROVED"] = "APPROVED";
    ReviewStatus["REJECTED"] = "REJECTED";
    ReviewStatus["CHANGES_REQUESTED"] = "CHANGES_REQUESTED";
    ReviewStatus["COMPLETED"] = "COMPLETED";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
/**
 * Review decision
 */
var ReviewDecision;
(function (ReviewDecision) {
    ReviewDecision["APPROVE"] = "APPROVE";
    ReviewDecision["REJECT"] = "REJECT";
    ReviewDecision["REQUEST_CHANGES"] = "REQUEST_CHANGES";
    ReviewDecision["ABSTAIN"] = "ABSTAIN";
})(ReviewDecision || (exports.ReviewDecision = ReviewDecision = {}));
/**
 * Change types
 */
var ChangeType;
(function (ChangeType) {
    ChangeType["CONTENT_EDIT"] = "CONTENT_EDIT";
    ChangeType["ANNOTATION_ADDED"] = "ANNOTATION_ADDED";
    ChangeType["ANNOTATION_REMOVED"] = "ANNOTATION_REMOVED";
    ChangeType["COMMENT_ADDED"] = "COMMENT_ADDED";
    ChangeType["COMMENT_REMOVED"] = "COMMENT_REMOVED";
    ChangeType["PARTICIPANT_JOINED"] = "PARTICIPANT_JOINED";
    ChangeType["PARTICIPANT_LEFT"] = "PARTICIPANT_LEFT";
    ChangeType["PERMISSION_CHANGED"] = "PERMISSION_CHANGED";
    ChangeType["STATUS_CHANGED"] = "STATUS_CHANGED";
})(ChangeType || (exports.ChangeType = ChangeType = {}));
/**
 * Update types for real-time synchronization
 */
var UpdateType;
(function (UpdateType) {
    UpdateType["CURSOR_MOVE"] = "CURSOR_MOVE";
    UpdateType["SELECTION_CHANGE"] = "SELECTION_CHANGE";
    UpdateType["CONTENT_CHANGE"] = "CONTENT_CHANGE";
    UpdateType["ANNOTATION_CHANGE"] = "ANNOTATION_CHANGE";
    UpdateType["COMMENT_CHANGE"] = "COMMENT_CHANGE";
    UpdateType["PARTICIPANT_UPDATE"] = "PARTICIPANT_UPDATE";
    UpdateType["PRESENCE_UPDATE"] = "PRESENCE_UPDATE";
})(UpdateType || (exports.UpdateType = UpdateType = {}));
/**
 * Conflict types
 */
var ConflictType;
(function (ConflictType) {
    ConflictType["CONCURRENT_EDIT"] = "CONCURRENT_EDIT";
    ConflictType["OVERLAPPING_ANNOTATION"] = "OVERLAPPING_ANNOTATION";
    ConflictType["PERMISSION_CONFLICT"] = "PERMISSION_CONFLICT";
    ConflictType["VERSION_MISMATCH"] = "VERSION_MISMATCH";
})(ConflictType || (exports.ConflictType = ConflictType = {}));
/**
 * Resolution strategies
 */
var ResolutionStrategy;
(function (ResolutionStrategy) {
    ResolutionStrategy["LAST_WRITE_WINS"] = "LAST_WRITE_WINS";
    ResolutionStrategy["MERGE"] = "MERGE";
    ResolutionStrategy["MANUAL"] = "MANUAL";
    ResolutionStrategy["REJECT"] = "REJECT";
})(ResolutionStrategy || (exports.ResolutionStrategy = ResolutionStrategy = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Collaboration Session Model
 * Stores active and historical collaboration sessions
 */
let CollaborationSessionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'collaboration_sessions',
            timestamps: true,
            indexes: [
                { fields: ['documentId'] },
                { fields: ['status'] },
                { fields: ['startedAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _participants_decorators;
    let _participants_initializers = [];
    let _participants_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _endedAt_decorators;
    let _endedAt_initializers = [];
    let _endedAt_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _permissions_decorators;
    let _permissions_initializers = [];
    let _permissions_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var CollaborationSessionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.name = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.participants = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _participants_initializers, void 0));
            this.startedAt = (__runInitializers(this, _participants_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.endedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _endedAt_initializers, void 0));
            this.status = (__runInitializers(this, _endedAt_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.permissions = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _permissions_initializers, void 0));
            this.metadata = (__runInitializers(this, _permissions_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CollaborationSessionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique session identifier' })];
        _documentId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Document ID' })];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Session name' })];
        _participants_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Session participants', type: [Object] })];
        _startedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Session start time' })];
        _endedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Session end time' })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(SessionStatus))), (0, swagger_1.ApiProperty)({ enum: SessionStatus, description: 'Session status' })];
        _permissions_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Session permissions' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _participants_decorators, { kind: "field", name: "participants", static: false, private: false, access: { has: obj => "participants" in obj, get: obj => obj.participants, set: (obj, value) => { obj.participants = value; } }, metadata: _metadata }, _participants_initializers, _participants_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _endedAt_decorators, { kind: "field", name: "endedAt", static: false, private: false, access: { has: obj => "endedAt" in obj, get: obj => obj.endedAt, set: (obj, value) => { obj.endedAt = value; } }, metadata: _metadata }, _endedAt_initializers, _endedAt_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _permissions_decorators, { kind: "field", name: "permissions", static: false, private: false, access: { has: obj => "permissions" in obj, get: obj => obj.permissions, set: (obj, value) => { obj.permissions = value; } }, metadata: _metadata }, _permissions_initializers, _permissions_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CollaborationSessionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CollaborationSessionModel = _classThis;
})();
exports.CollaborationSessionModel = CollaborationSessionModel;
/**
 * Annotation Model
 * Stores document annotations
 */
let AnnotationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'annotations',
            timestamps: true,
            indexes: [
                { fields: ['documentId'] },
                { fields: ['type'] },
                { fields: ['status'] },
                { fields: ['pageNumber'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _pageNumber_decorators;
    let _pageNumber_initializers = [];
    let _pageNumber_extraInitializers = [];
    let _position_decorators;
    let _position_initializers = [];
    let _position_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _author_decorators;
    let _author_initializers = [];
    let _author_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _replies_decorators;
    let _replies_initializers = [];
    let _replies_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var AnnotationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.type = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.pageNumber = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _pageNumber_initializers, void 0));
            this.position = (__runInitializers(this, _pageNumber_extraInitializers), __runInitializers(this, _position_initializers, void 0));
            this.content = (__runInitializers(this, _position_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.author = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _author_initializers, void 0));
            this.status = (__runInitializers(this, _author_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.replies = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _replies_initializers, void 0));
            this.metadata = (__runInitializers(this, _replies_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AnnotationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique annotation identifier' })];
        _documentId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Document ID' })];
        _type_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(AnnotationType))), (0, swagger_1.ApiProperty)({ enum: AnnotationType, description: 'Annotation type' })];
        _pageNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Page number' })];
        _position_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Annotation position' })];
        _content_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Annotation content' })];
        _author_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Author information' })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(AnnotationStatus))), (0, swagger_1.ApiProperty)({ enum: AnnotationStatus, description: 'Annotation status' })];
        _replies_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Annotation replies', type: [Object] })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _pageNumber_decorators, { kind: "field", name: "pageNumber", static: false, private: false, access: { has: obj => "pageNumber" in obj, get: obj => obj.pageNumber, set: (obj, value) => { obj.pageNumber = value; } }, metadata: _metadata }, _pageNumber_initializers, _pageNumber_extraInitializers);
        __esDecorate(null, null, _position_decorators, { kind: "field", name: "position", static: false, private: false, access: { has: obj => "position" in obj, get: obj => obj.position, set: (obj, value) => { obj.position = value; } }, metadata: _metadata }, _position_initializers, _position_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _author_decorators, { kind: "field", name: "author", static: false, private: false, access: { has: obj => "author" in obj, get: obj => obj.author, set: (obj, value) => { obj.author = value; } }, metadata: _metadata }, _author_initializers, _author_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _replies_decorators, { kind: "field", name: "replies", static: false, private: false, access: { has: obj => "replies" in obj, get: obj => obj.replies, set: (obj, value) => { obj.replies = value; } }, metadata: _metadata }, _replies_initializers, _replies_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnnotationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnnotationModel = _classThis;
})();
exports.AnnotationModel = AnnotationModel;
/**
 * Review Workflow Model
 * Stores document review workflows
 */
let ReviewWorkflowModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'review_workflows',
            timestamps: true,
            indexes: [
                { fields: ['documentId'] },
                { fields: ['status'] },
                { fields: ['dueDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _reviewers_decorators;
    let _reviewers_initializers = [];
    let _reviewers_extraInitializers = [];
    let _currentStage_decorators;
    let _currentStage_initializers = [];
    let _currentStage_extraInitializers = [];
    let _totalStages_decorators;
    let _totalStages_initializers = [];
    let _totalStages_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var ReviewWorkflowModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.name = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.reviewers = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _reviewers_initializers, void 0));
            this.currentStage = (__runInitializers(this, _reviewers_extraInitializers), __runInitializers(this, _currentStage_initializers, void 0));
            this.totalStages = (__runInitializers(this, _currentStage_extraInitializers), __runInitializers(this, _totalStages_initializers, void 0));
            this.status = (__runInitializers(this, _totalStages_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.dueDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.startedAt = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ReviewWorkflowModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique workflow identifier' })];
        _documentId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Document ID' })];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Workflow name' })];
        _reviewers_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'List of reviewers', type: [Object] })];
        _currentStage_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Current review stage' })];
        _totalStages_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Total review stages' })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(ReviewStatus))), (0, swagger_1.ApiProperty)({ enum: ReviewStatus, description: 'Review status' })];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Review due date' })];
        _startedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Workflow start time' })];
        _completedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiPropertyOptional)({ description: 'Workflow completion time' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _reviewers_decorators, { kind: "field", name: "reviewers", static: false, private: false, access: { has: obj => "reviewers" in obj, get: obj => obj.reviewers, set: (obj, value) => { obj.reviewers = value; } }, metadata: _metadata }, _reviewers_initializers, _reviewers_extraInitializers);
        __esDecorate(null, null, _currentStage_decorators, { kind: "field", name: "currentStage", static: false, private: false, access: { has: obj => "currentStage" in obj, get: obj => obj.currentStage, set: (obj, value) => { obj.currentStage = value; } }, metadata: _metadata }, _currentStage_initializers, _currentStage_extraInitializers);
        __esDecorate(null, null, _totalStages_decorators, { kind: "field", name: "totalStages", static: false, private: false, access: { has: obj => "totalStages" in obj, get: obj => obj.totalStages, set: (obj, value) => { obj.totalStages = value; } }, metadata: _metadata }, _totalStages_initializers, _totalStages_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReviewWorkflowModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReviewWorkflowModel = _classThis;
})();
exports.ReviewWorkflowModel = ReviewWorkflowModel;
// ============================================================================
// CORE COLLABORATION FUNCTIONS
// ============================================================================
/**
 * Creates a new collaboration session.
 *
 * @param {string} documentId - Document identifier
 * @param {string} name - Session name
 * @param {Partial<CollaborationSession>} options - Additional options
 * @returns {CollaborationSession} Collaboration session
 *
 * @example
 * ```typescript
 * const session = createCollaborationSession('doc123', 'Medical Chart Review');
 * ```
 */
const createCollaborationSession = (documentId, name, options) => {
    return {
        id: crypto.randomUUID(),
        documentId,
        name,
        participants: options?.participants || [],
        startedAt: new Date(),
        endedAt: options?.endedAt,
        status: SessionStatus.ACTIVE,
        permissions: options?.permissions || {
            allowEditing: true,
            allowAnnotations: true,
            allowComments: true,
            allowDownload: false,
            allowSharing: false,
            requireApproval: false,
        },
        metadata: options?.metadata,
    };
};
exports.createCollaborationSession = createCollaborationSession;
/**
 * Adds a participant to collaboration session.
 *
 * @param {CollaborationSession} session - Collaboration session
 * @param {Participant} participant - Participant to add
 * @returns {CollaborationSession} Updated session
 *
 * @example
 * ```typescript
 * const updated = addParticipantToSession(session, participant);
 * ```
 */
const addParticipantToSession = (session, participant) => {
    return {
        ...session,
        participants: [...session.participants, participant],
    };
};
exports.addParticipantToSession = addParticipantToSession;
/**
 * Removes a participant from session.
 *
 * @param {CollaborationSession} session - Collaboration session
 * @param {string} participantId - Participant ID to remove
 * @returns {CollaborationSession} Updated session
 *
 * @example
 * ```typescript
 * const updated = removeParticipantFromSession(session, 'participant123');
 * ```
 */
const removeParticipantFromSession = (session, participantId) => {
    return {
        ...session,
        participants: session.participants.filter((p) => p.id !== participantId),
    };
};
exports.removeParticipantFromSession = removeParticipantFromSession;
/**
 * Creates a participant for collaboration session.
 *
 * @param {string} userId - User identifier
 * @param {string} name - Participant name
 * @param {string} email - Participant email
 * @param {ParticipantRole} role - Participant role
 * @returns {Participant} Participant
 *
 * @example
 * ```typescript
 * const participant = createParticipant('user123', 'Dr. Smith', 'smith@example.com', ParticipantRole.EDITOR);
 * ```
 */
const createParticipant = (userId, name, email, role) => {
    return {
        id: crypto.randomUUID(),
        userId,
        name,
        email,
        role,
        permissions: (0, exports.getPermissionsForRole)(role),
        joinedAt: new Date(),
        lastActiveAt: new Date(),
        status: ParticipantStatus.ONLINE,
    };
};
exports.createParticipant = createParticipant;
/**
 * Gets default permissions for a participant role.
 *
 * @param {ParticipantRole} role - Participant role
 * @returns {ParticipantPermissions} Permissions
 *
 * @example
 * ```typescript
 * const permissions = getPermissionsForRole(ParticipantRole.REVIEWER);
 * ```
 */
const getPermissionsForRole = (role) => {
    switch (role) {
        case ParticipantRole.OWNER:
            return {
                canEdit: true,
                canAnnotate: true,
                canComment: true,
                canDelete: true,
                canShare: true,
                canApprove: true,
            };
        case ParticipantRole.EDITOR:
            return {
                canEdit: true,
                canAnnotate: true,
                canComment: true,
                canDelete: false,
                canShare: false,
                canApprove: false,
            };
        case ParticipantRole.REVIEWER:
            return {
                canEdit: false,
                canAnnotate: true,
                canComment: true,
                canDelete: false,
                canShare: false,
                canApprove: true,
            };
        case ParticipantRole.COMMENTER:
            return {
                canEdit: false,
                canAnnotate: false,
                canComment: true,
                canDelete: false,
                canShare: false,
                canApprove: false,
            };
        case ParticipantRole.VIEWER:
            return {
                canEdit: false,
                canAnnotate: false,
                canComment: false,
                canDelete: false,
                canShare: false,
                canApprove: false,
            };
    }
};
exports.getPermissionsForRole = getPermissionsForRole;
/**
 * Updates participant status and activity.
 *
 * @param {Participant} participant - Participant to update
 * @param {ParticipantStatus} status - New status
 * @returns {Participant} Updated participant
 *
 * @example
 * ```typescript
 * const updated = updateParticipantStatus(participant, ParticipantStatus.IDLE);
 * ```
 */
const updateParticipantStatus = (participant, status) => {
    return {
        ...participant,
        status,
        lastActiveAt: new Date(),
    };
};
exports.updateParticipantStatus = updateParticipantStatus;
/**
 * Creates an annotation.
 *
 * @param {string} documentId - Document identifier
 * @param {AnnotationType} type - Annotation type
 * @param {number} pageNumber - Page number
 * @param {AnnotationPosition} position - Annotation position
 * @param {AnnotationContent} content - Annotation content
 * @param {AuthorInfo} author - Author information
 * @returns {Annotation} Annotation
 *
 * @example
 * ```typescript
 * const annotation = createAnnotation('doc123', AnnotationType.HIGHLIGHT, 1, position, content, author);
 * ```
 */
const createAnnotation = (documentId, type, pageNumber, position, content, author) => {
    return {
        id: crypto.randomUUID(),
        documentId,
        type,
        pageNumber,
        position,
        content,
        author,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: AnnotationStatus.ACTIVE,
        replies: [],
    };
};
exports.createAnnotation = createAnnotation;
/**
 * Adds a reply to an annotation.
 *
 * @param {Annotation} annotation - Annotation to reply to
 * @param {string} content - Reply content
 * @param {AuthorInfo} author - Reply author
 * @returns {Annotation} Updated annotation
 *
 * @example
 * ```typescript
 * const updated = addAnnotationReply(annotation, 'I agree with this note', author);
 * ```
 */
const addAnnotationReply = (annotation, content, author) => {
    const reply = {
        id: crypto.randomUUID(),
        annotationId: annotation.id,
        author,
        content,
        createdAt: new Date(),
    };
    return {
        ...annotation,
        replies: [...annotation.replies, reply],
        updatedAt: new Date(),
    };
};
exports.addAnnotationReply = addAnnotationReply;
/**
 * Resolves an annotation.
 *
 * @param {Annotation} annotation - Annotation to resolve
 * @returns {Annotation} Resolved annotation
 *
 * @example
 * ```typescript
 * const resolved = resolveAnnotation(annotation);
 * ```
 */
const resolveAnnotation = (annotation) => {
    return {
        ...annotation,
        status: AnnotationStatus.RESOLVED,
        updatedAt: new Date(),
    };
};
exports.resolveAnnotation = resolveAnnotation;
/**
 * Deletes an annotation.
 *
 * @param {Annotation} annotation - Annotation to delete
 * @returns {Annotation} Deleted annotation
 *
 * @example
 * ```typescript
 * const deleted = deleteAnnotation(annotation);
 * ```
 */
const deleteAnnotation = (annotation) => {
    return {
        ...annotation,
        status: AnnotationStatus.DELETED,
        updatedAt: new Date(),
    };
};
exports.deleteAnnotation = deleteAnnotation;
/**
 * Creates a comment.
 *
 * @param {string} documentId - Document identifier
 * @param {string} content - Comment content
 * @param {AuthorInfo} author - Author information
 * @param {Partial<Comment>} options - Additional options
 * @returns {Comment} Comment
 *
 * @example
 * ```typescript
 * const comment = createComment('doc123', 'Please review this section', author);
 * ```
 */
const createComment = (documentId, content, author, options) => {
    return {
        id: crypto.randomUUID(),
        documentId,
        parentCommentId: options?.parentCommentId,
        content,
        author,
        createdAt: new Date(),
        updatedAt: options?.updatedAt,
        status: CommentStatus.ACTIVE,
        mentions: (0, exports.extractMentions)(content),
        replies: options?.replies || [],
        reactions: options?.reactions || [],
        metadata: options?.metadata,
    };
};
exports.createComment = createComment;
/**
 * Extracts mentions from comment content.
 *
 * @param {string} content - Comment content
 * @returns {Array<string>} Mentioned user IDs
 *
 * @example
 * ```typescript
 * const mentions = extractMentions('@user123 please review @user456');
 * ```
 */
const extractMentions = (content) => {
    const mentionRegex = /@(\w+)/g;
    const matches = content.match(mentionRegex);
    return matches ? matches.map((m) => m.substring(1)) : [];
};
exports.extractMentions = extractMentions;
/**
 * Adds a reply to a comment.
 *
 * @param {Comment} comment - Parent comment
 * @param {Comment} reply - Reply comment
 * @returns {Comment} Updated parent comment
 *
 * @example
 * ```typescript
 * const updated = addCommentReply(parentComment, replyComment);
 * ```
 */
const addCommentReply = (comment, reply) => {
    return {
        ...comment,
        replies: [...comment.replies, reply],
        updatedAt: new Date(),
    };
};
exports.addCommentReply = addCommentReply;
/**
 * Adds a reaction to a comment.
 *
 * @param {Comment} comment - Comment to react to
 * @param {string} userId - User ID
 * @param {ReactionType} reactionType - Reaction type
 * @returns {Comment} Updated comment
 *
 * @example
 * ```typescript
 * const updated = addCommentReaction(comment, 'user123', ReactionType.AGREE);
 * ```
 */
const addCommentReaction = (comment, userId, reactionType) => {
    const reaction = {
        userId,
        type: reactionType,
        timestamp: new Date(),
    };
    // Remove existing reaction from this user
    const filteredReactions = comment.reactions.filter((r) => r.userId !== userId);
    return {
        ...comment,
        reactions: [...filteredReactions, reaction],
        updatedAt: new Date(),
    };
};
exports.addCommentReaction = addCommentReaction;
/**
 * Resolves a comment.
 *
 * @param {Comment} comment - Comment to resolve
 * @returns {Comment} Resolved comment
 *
 * @example
 * ```typescript
 * const resolved = resolveComment(comment);
 * ```
 */
const resolveComment = (comment) => {
    return {
        ...comment,
        status: CommentStatus.RESOLVED,
        updatedAt: new Date(),
    };
};
exports.resolveComment = resolveComment;
/**
 * Creates a review workflow.
 *
 * @param {string} documentId - Document identifier
 * @param {string} name - Workflow name
 * @param {Reviewer[]} reviewers - List of reviewers
 * @param {Partial<ReviewWorkflow>} options - Additional options
 * @returns {ReviewWorkflow} Review workflow
 *
 * @example
 * ```typescript
 * const workflow = createReviewWorkflow('doc123', 'Clinical Review', reviewers, {dueDate: new Date('2025-12-31')});
 * ```
 */
const createReviewWorkflow = (documentId, name, reviewers, options) => {
    return {
        id: crypto.randomUUID(),
        documentId,
        name,
        reviewers,
        currentStage: 1,
        totalStages: Math.max(...reviewers.map((r) => r.stage)),
        status: ReviewStatus.PENDING,
        dueDate: options?.dueDate,
        startedAt: new Date(),
        completedAt: options?.completedAt,
        metadata: options?.metadata,
    };
};
exports.createReviewWorkflow = createReviewWorkflow;
/**
 * Creates a reviewer.
 *
 * @param {string} userId - User identifier
 * @param {string} name - Reviewer name
 * @param {string} email - Reviewer email
 * @param {number} stage - Review stage
 * @returns {Reviewer} Reviewer
 *
 * @example
 * ```typescript
 * const reviewer = createReviewer('user123', 'Dr. Johnson', 'johnson@example.com', 1);
 * ```
 */
const createReviewer = (userId, name, email, stage) => {
    return {
        id: crypto.randomUUID(),
        userId,
        name,
        email,
        stage,
    };
};
exports.createReviewer = createReviewer;
/**
 * Records a reviewer's decision.
 *
 * @param {Reviewer} reviewer - Reviewer
 * @param {ReviewDecision} decision - Review decision
 * @param {string} comments - Optional comments
 * @returns {Reviewer} Updated reviewer
 *
 * @example
 * ```typescript
 * const updated = recordReviewDecision(reviewer, ReviewDecision.APPROVE, 'Looks good');
 * ```
 */
const recordReviewDecision = (reviewer, decision, comments) => {
    return {
        ...reviewer,
        decision,
        comments,
        reviewedAt: new Date(),
    };
};
exports.recordReviewDecision = recordReviewDecision;
/**
 * Advances review workflow to next stage.
 *
 * @param {ReviewWorkflow} workflow - Review workflow
 * @returns {ReviewWorkflow} Updated workflow
 *
 * @example
 * ```typescript
 * const advanced = advanceReviewWorkflow(workflow);
 * ```
 */
const advanceReviewWorkflow = (workflow) => {
    const nextStage = workflow.currentStage + 1;
    if (nextStage > workflow.totalStages) {
        return {
            ...workflow,
            status: ReviewStatus.COMPLETED,
            completedAt: new Date(),
        };
    }
    return {
        ...workflow,
        currentStage: nextStage,
        status: ReviewStatus.IN_REVIEW,
    };
};
exports.advanceReviewWorkflow = advanceReviewWorkflow;
/**
 * Checks if all reviewers at current stage have completed review.
 *
 * @param {ReviewWorkflow} workflow - Review workflow
 * @returns {boolean} True if stage is complete
 *
 * @example
 * ```typescript
 * const isComplete = isCurrentStageComplete(workflow);
 * ```
 */
const isCurrentStageComplete = (workflow) => {
    const currentStageReviewers = workflow.reviewers.filter((r) => r.stage === workflow.currentStage);
    return currentStageReviewers.every((r) => r.decision !== undefined);
};
exports.isCurrentStageComplete = isCurrentStageComplete;
/**
 * Checks if workflow is approved by all reviewers.
 *
 * @param {ReviewWorkflow} workflow - Review workflow
 * @returns {boolean} True if fully approved
 *
 * @example
 * ```typescript
 * const isApproved = isWorkflowApproved(workflow);
 * ```
 */
const isWorkflowApproved = (workflow) => {
    return workflow.reviewers.every((r) => r.decision === ReviewDecision.APPROVE || r.decision === ReviewDecision.ABSTAIN);
};
exports.isWorkflowApproved = isWorkflowApproved;
/**
 * Creates a change tracking entry.
 *
 * @param {string} documentId - Document identifier
 * @param {ChangeType} type - Change type
 * @param {string} userId - User identifier
 * @param {string} userName - User name
 * @param {string} description - Change description
 * @param {Partial<ChangeEntry>} options - Additional options
 * @returns {ChangeEntry} Change entry
 *
 * @example
 * ```typescript
 * const change = createChangeEntry('doc123', ChangeType.CONTENT_EDIT, 'user123', 'Dr. Smith', 'Updated diagnosis');
 * ```
 */
const createChangeEntry = (documentId, type, userId, userName, description, options) => {
    return {
        id: crypto.randomUUID(),
        documentId,
        type,
        userId,
        userName,
        timestamp: new Date(),
        description,
        oldValue: options?.oldValue,
        newValue: options?.newValue,
        metadata: options?.metadata,
    };
};
exports.createChangeEntry = createChangeEntry;
/**
 * Creates a real-time update message.
 *
 * @param {string} sessionId - Session identifier
 * @param {UpdateType} type - Update type
 * @param {string} userId - User identifier
 * @param {any} payload - Update payload
 * @returns {RealtimeUpdate} Real-time update
 *
 * @example
 * ```typescript
 * const update = createRealtimeUpdate('session123', UpdateType.CURSOR_MOVE, 'user123', cursorData);
 * ```
 */
const createRealtimeUpdate = (sessionId, type, userId, payload) => {
    return {
        id: crypto.randomUUID(),
        sessionId,
        type,
        userId,
        timestamp: new Date(),
        payload,
    };
};
exports.createRealtimeUpdate = createRealtimeUpdate;
/**
 * Updates participant cursor position.
 *
 * @param {Participant} participant - Participant
 * @param {CursorPosition} position - New cursor position
 * @returns {Participant} Updated participant
 *
 * @example
 * ```typescript
 * const updated = updateParticipantCursor(participant, {pageNumber: 2, x: 100, y: 200, timestamp: new Date()});
 * ```
 */
const updateParticipantCursor = (participant, position) => {
    return {
        ...participant,
        cursorPosition: position,
        lastActiveAt: new Date(),
        status: ParticipantStatus.ONLINE,
    };
};
exports.updateParticipantCursor = updateParticipantCursor;
/**
 * Detects collaboration conflicts.
 *
 * @param {ChangeEntry[]} recentChanges - Recent change entries
 * @param {number} timeWindowMs - Time window for conflict detection
 * @returns {ConflictResolution[]} Detected conflicts
 *
 * @example
 * ```typescript
 * const conflicts = detectCollaborationConflicts(changes, 5000);
 * ```
 */
const detectCollaborationConflicts = (recentChanges, timeWindowMs = 5000) => {
    const conflicts = [];
    const now = Date.now();
    // Group changes by document
    const changesByDoc = new Map();
    recentChanges.forEach((change) => {
        const changes = changesByDoc.get(change.documentId) || [];
        changes.push(change);
        changesByDoc.set(change.documentId, changes);
    });
    // Detect concurrent edits
    changesByDoc.forEach((changes, documentId) => {
        const concurrentEdits = changes.filter((c) => c.type === ChangeType.CONTENT_EDIT &&
            now - c.timestamp.getTime() <= timeWindowMs);
        if (concurrentEdits.length > 1) {
            conflicts.push({
                id: crypto.randomUUID(),
                documentId,
                conflictType: ConflictType.CONCURRENT_EDIT,
                detectedAt: new Date(),
                resolution: ResolutionStrategy.LAST_WRITE_WINS,
                participants: concurrentEdits.map((c) => c.userId),
                description: `${concurrentEdits.length} concurrent edits detected`,
            });
        }
    });
    return conflicts;
};
exports.detectCollaborationConflicts = detectCollaborationConflicts;
/**
 * Resolves a collaboration conflict.
 *
 * @param {ConflictResolution} conflict - Conflict to resolve
 * @param {ResolutionStrategy} strategy - Resolution strategy
 * @returns {ConflictResolution} Resolved conflict
 *
 * @example
 * ```typescript
 * const resolved = resolveCollaborationConflict(conflict, ResolutionStrategy.MERGE);
 * ```
 */
const resolveCollaborationConflict = (conflict, strategy) => {
    return {
        ...conflict,
        resolution: strategy,
        resolvedAt: new Date(),
    };
};
exports.resolveCollaborationConflict = resolveCollaborationConflict;
/**
 * Gets active participants in session.
 *
 * @param {CollaborationSession} session - Collaboration session
 * @returns {Participant[]} Active participants
 *
 * @example
 * ```typescript
 * const active = getActiveParticipants(session);
 * ```
 */
const getActiveParticipants = (session) => {
    return session.participants.filter((p) => p.status === ParticipantStatus.ONLINE);
};
exports.getActiveParticipants = getActiveParticipants;
/**
 * Counts annotations by type.
 *
 * @param {Annotation[]} annotations - Annotations to count
 * @returns {Record<AnnotationType, number>} Count by type
 *
 * @example
 * ```typescript
 * const counts = countAnnotationsByType(annotations);
 * ```
 */
const countAnnotationsByType = (annotations) => {
    const counts = {};
    annotations.forEach((annotation) => {
        counts[annotation.type] = (counts[annotation.type] || 0) + 1;
    });
    return counts;
};
exports.countAnnotationsByType = countAnnotationsByType;
/**
 * Filters annotations by page number.
 *
 * @param {Annotation[]} annotations - Annotations to filter
 * @param {number} pageNumber - Page number
 * @returns {Annotation[]} Filtered annotations
 *
 * @example
 * ```typescript
 * const pageAnnotations = filterAnnotationsByPage(annotations, 1);
 * ```
 */
const filterAnnotationsByPage = (annotations, pageNumber) => {
    return annotations.filter((a) => a.pageNumber === pageNumber);
};
exports.filterAnnotationsByPage = filterAnnotationsByPage;
/**
 * Exports session activity log.
 *
 * @param {CollaborationSession} session - Collaboration session
 * @param {ChangeEntry[]} changes - Change entries
 * @returns {Record<string, any>} Activity log
 *
 * @example
 * ```typescript
 * const log = exportSessionActivityLog(session, changes);
 * ```
 */
const exportSessionActivityLog = (session, changes) => {
    return {
        sessionId: session.id,
        documentId: session.documentId,
        name: session.name,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        participants: session.participants.map((p) => ({
            name: p.name,
            email: p.email,
            role: p.role,
            joinedAt: p.joinedAt,
            lastActiveAt: p.lastActiveAt,
        })),
        changes: changes.map((c) => ({
            type: c.type,
            userName: c.userName,
            timestamp: c.timestamp,
            description: c.description,
        })),
    };
};
exports.exportSessionActivityLog = exportSessionActivityLog;
/**
 * Calculates collaboration metrics.
 *
 * @param {CollaborationSession} session - Collaboration session
 * @param {Annotation[]} annotations - Annotations
 * @param {Comment[]} comments - Comments
 * @returns {Record<string, any>} Collaboration metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateCollaborationMetrics(session, annotations, comments);
 * ```
 */
const calculateCollaborationMetrics = (session, annotations, comments) => {
    return {
        sessionId: session.id,
        participantCount: session.participants.length,
        activeParticipants: (0, exports.getActiveParticipants)(session).length,
        annotationCount: annotations.length,
        commentCount: comments.length,
        resolvedAnnotations: annotations.filter((a) => a.status === AnnotationStatus.RESOLVED).length,
        resolvedComments: comments.filter((c) => c.status === CommentStatus.RESOLVED).length,
        sessionDuration: session.endedAt
            ? session.endedAt.getTime() - session.startedAt.getTime()
            : Date.now() - session.startedAt.getTime(),
    };
};
exports.calculateCollaborationMetrics = calculateCollaborationMetrics;
/**
 * Validates participant permissions for action.
 *
 * @param {Participant} participant - Participant
 * @param {string} action - Action to validate
 * @returns {boolean} True if permitted
 *
 * @example
 * ```typescript
 * const canEdit = validateParticipantPermission(participant, 'edit');
 * ```
 */
const validateParticipantPermission = (participant, action) => {
    const permissionMap = {
        edit: 'canEdit',
        annotate: 'canAnnotate',
        comment: 'canComment',
        delete: 'canDelete',
        share: 'canShare',
        approve: 'canApprove',
    };
    const permission = permissionMap[action];
    return permission ? participant.permissions[permission] : false;
};
exports.validateParticipantPermission = validateParticipantPermission;
/**
 * Ends a collaboration session.
 *
 * @param {CollaborationSession} session - Session to end
 * @returns {CollaborationSession} Ended session
 *
 * @example
 * ```typescript
 * const ended = endCollaborationSession(session);
 * ```
 */
const endCollaborationSession = (session) => {
    return {
        ...session,
        status: SessionStatus.ENDED,
        endedAt: new Date(),
    };
};
exports.endCollaborationSession = endCollaborationSession;
// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================
/**
 * Document Collaboration Service
 * Production-ready NestJS service for document collaboration operations
 */
let DocumentCollaborationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DocumentCollaborationService = _classThis = class {
        /**
         * Initiates a new collaboration session
         */
        async startCollaboration(documentId, sessionName, participants) {
            const session = (0, exports.createCollaborationSession)(documentId, sessionName, {
                participants,
            });
            return session;
        }
        /**
         * Adds annotation to document
         */
        async addAnnotation(documentId, type, pageNumber, position, content, author) {
            const annotation = (0, exports.createAnnotation)(documentId, type, pageNumber, position, content, author);
            return annotation;
        }
    };
    __setFunctionName(_classThis, "DocumentCollaborationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentCollaborationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentCollaborationService = _classThis;
})();
exports.DocumentCollaborationService = DocumentCollaborationService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    CollaborationSessionModel,
    AnnotationModel,
    ReviewWorkflowModel,
    // Core Functions
    createCollaborationSession: exports.createCollaborationSession,
    addParticipantToSession: exports.addParticipantToSession,
    removeParticipantFromSession: exports.removeParticipantFromSession,
    createParticipant: exports.createParticipant,
    getPermissionsForRole: exports.getPermissionsForRole,
    updateParticipantStatus: exports.updateParticipantStatus,
    createAnnotation: exports.createAnnotation,
    addAnnotationReply: exports.addAnnotationReply,
    resolveAnnotation: exports.resolveAnnotation,
    deleteAnnotation: exports.deleteAnnotation,
    createComment: exports.createComment,
    extractMentions: exports.extractMentions,
    addCommentReply: exports.addCommentReply,
    addCommentReaction: exports.addCommentReaction,
    resolveComment: exports.resolveComment,
    createReviewWorkflow: exports.createReviewWorkflow,
    createReviewer: exports.createReviewer,
    recordReviewDecision: exports.recordReviewDecision,
    advanceReviewWorkflow: exports.advanceReviewWorkflow,
    isCurrentStageComplete: exports.isCurrentStageComplete,
    isWorkflowApproved: exports.isWorkflowApproved,
    createChangeEntry: exports.createChangeEntry,
    createRealtimeUpdate: exports.createRealtimeUpdate,
    updateParticipantCursor: exports.updateParticipantCursor,
    detectCollaborationConflicts: exports.detectCollaborationConflicts,
    resolveCollaborationConflict: exports.resolveCollaborationConflict,
    getActiveParticipants: exports.getActiveParticipants,
    countAnnotationsByType: exports.countAnnotationsByType,
    filterAnnotationsByPage: exports.filterAnnotationsByPage,
    exportSessionActivityLog: exports.exportSessionActivityLog,
    calculateCollaborationMetrics: exports.calculateCollaborationMetrics,
    validateParticipantPermission: exports.validateParticipantPermission,
    endCollaborationSession: exports.endCollaborationSession,
    // Services
    DocumentCollaborationService,
};
//# sourceMappingURL=document-collaboration-composite.js.map