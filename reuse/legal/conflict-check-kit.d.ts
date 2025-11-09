/**
 * LOC: CONFLICT_CHECK_KIT_001
 * File: /reuse/legal/conflict-check-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Conflict of interest management modules
 *   - Client intake services
 *   - Matter management controllers
 *   - Ethics compliance dashboards
 *   - Lateral hire onboarding services
 *   - Waiver management modules
 */
import { DynamicModule } from '@nestjs/common';
import { Model } from 'sequelize-typescript';
/**
 * Conflict check status
 */
export declare enum ConflictCheckStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    CLEARED = "cleared",
    CONFLICT_FOUND = "conflict_found",
    WAIVED = "waived",
    DECLINED = "declined",
    REQUIRES_REVIEW = "requires_review"
}
/**
 * Conflict type classification
 */
export declare enum ConflictType {
    DIRECT_ADVERSITY = "direct_adversity",
    MATERIAL_LIMITATION = "material_limitation",
    FORMER_CLIENT = "former_client",
    IMPUTED_CONFLICT = "imputed_conflict",
    PERSONAL_INTEREST = "personal_interest",
    THIRD_PARTY_PAYER = "third_party_payer",
    PROSPECTIVE_CLIENT = "prospective_client",
    BUSINESS_TRANSACTION = "business_transaction",
    FAMILY_RELATIONSHIP = "family_relationship",
    FINANCIAL_INTEREST = "financial_interest",
    ADVERSE_WITNESS = "adverse_witness"
}
/**
 * Conflict severity rating
 */
export declare enum ConflictSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical",
    ABSOLUTE = "absolute"
}
/**
 * Conflict resolution method
 */
export declare enum ConflictResolution {
    WAIVED_BY_CLIENT = "waived_by_client",
    ETHICAL_WALL_IMPLEMENTED = "ethical_wall_implemented",
    REPRESENTATION_DECLINED = "representation_declined",
    REPRESENTATION_TERMINATED = "representation_terminated",
    NO_CONFLICT = "no_conflict",
    PENDING_REVIEW = "pending_review",
    SCREENING_IMPLEMENTED = "screening_implemented",
    ATTORNEY_RECUSED = "attorney_recused"
}
/**
 * Waiver status
 */
export declare enum WaiverStatus {
    DRAFT = "draft",
    SENT_TO_CLIENT = "sent_to_client",
    EXECUTED = "executed",
    DECLINED = "declined",
    REVOKED = "revoked",
    EXPIRED = "expired"
}
/**
 * Ethical wall status
 */
export declare enum EthicalWallStatus {
    PROPOSED = "proposed",
    ACTIVE = "active",
    BREACHED = "breached",
    LIFTED = "lifted",
    INEFFECTIVE = "ineffective"
}
/**
 * Lateral hire check status
 */
export declare enum LateralHireStatus {
    INITIATED = "initiated",
    PRELIMINARY_REVIEW = "preliminary_review",
    DETAILED_ANALYSIS = "detailed_analysis",
    CONFLICTS_IDENTIFIED = "conflicts_identified",
    CLEARED = "cleared",
    CONDITIONAL_APPROVAL = "conditional_approval",
    HIRE_DECLINED = "hire_declined"
}
/**
 * Entity relationship type
 */
export declare enum EntityRelationshipType {
    PARENT_COMPANY = "parent_company",
    SUBSIDIARY = "subsidiary",
    AFFILIATE = "affiliate",
    COMPETITOR = "competitor",
    PARTNER = "partner",
    VENDOR = "vendor",
    CUSTOMER = "customer",
    INVESTOR = "investor",
    OFFICER = "officer",
    DIRECTOR = "director"
}
/**
 * Screening scope
 */
export declare enum ScreeningScope {
    NEW_MATTER = "new_matter",
    LATERAL_HIRE = "lateral_hire",
    MERGER_ACQUISITION = "merger_acquisition",
    PERIODIC_REVIEW = "periodic_review",
    AD_HOC = "ad_hoc",
    PROSPECTIVE_CLIENT = "prospective_client"
}
/**
 * Conflict check request interface
 */
export interface ConflictCheckRequest {
    id?: string;
    requestType: ScreeningScope;
    matterId?: string;
    clientId?: string;
    clientName: string;
    opposingParties: OpposingParty[];
    relatedEntities: RelatedEntity[];
    matterDescription: string;
    practiceArea: string;
    requestedBy: string;
    requestDate: Date;
    urgency: 'low' | 'normal' | 'high' | 'critical';
    jurisdictions: string[];
    estimatedValue?: number;
    metadata?: Record<string, any>;
}
/**
 * Opposing party interface
 */
export interface OpposingParty {
    name: string;
    aliases?: string[];
    entityType: 'individual' | 'corporation' | 'partnership' | 'government' | 'other';
    jurisdiction?: string;
    identifiers?: {
        taxId?: string;
        registrationNumber?: string;
        other?: Record<string, string>;
    };
    counsel?: string[];
}
/**
 * Related entity interface
 */
export interface RelatedEntity {
    name: string;
    relationshipType: EntityRelationshipType;
    description?: string;
    significance: 'low' | 'medium' | 'high';
}
/**
 * Conflict detail interface
 */
export interface ConflictDetail {
    id?: string;
    conflictType: ConflictType;
    severity: ConflictSeverity;
    description: string;
    involvedParties: string[];
    affectedAttorneys: string[];
    conflictingMatterId?: string;
    conflictingClientId?: string;
    riskAssessment: string;
    recommendation: string;
    waiverPossible: boolean;
    ethicalRulesViolated?: string[];
    identifiedDate: Date;
    identifiedBy: string;
    metadata?: Record<string, any>;
}
/**
 * Waiver document interface
 */
export interface WaiverDocument {
    id?: string;
    conflictCheckId: string;
    conflictId: string;
    clientId: string;
    waiverType: 'informed_consent' | 'advance_waiver' | 'limited_waiver';
    status: WaiverStatus;
    documentText: string;
    disclosureProvided: string;
    sentDate?: Date;
    executedDate?: Date;
    signatories: Array<{
        name: string;
        title: string;
        signedDate?: Date;
        signature?: string;
    }>;
    expirationDate?: Date;
    conditions?: string[];
    revokedDate?: Date;
    revokedReason?: string;
    reviewedBy: string;
    approvedBy?: string;
    metadata?: Record<string, any>;
}
/**
 * Ethical wall interface
 */
export interface EthicalWall {
    id?: string;
    conflictCheckId: string;
    matterId: string;
    status: EthicalWallStatus;
    screenedAttorneys: string[];
    restrictedInformation: string[];
    implementationDate: Date;
    implementedBy: string;
    protocols: Array<{
        description: string;
        responsible: string;
        verificationMethod: string;
    }>;
    physicalMeasures?: string[];
    technicalMeasures?: string[];
    trainingCompleted: boolean;
    monitoringFrequency: string;
    lastReviewDate?: Date;
    breaches?: Array<{
        date: Date;
        description: string;
        remediation: string;
        reportedBy: string;
    }>;
    liftedDate?: Date;
    liftedReason?: string;
    metadata?: Record<string, any>;
}
/**
 * Lateral hire check interface
 */
export interface LateralHireCheck {
    id?: string;
    candidateId: string;
    candidateName: string;
    currentFirm: string;
    proposedStartDate: Date;
    status: LateralHireStatus;
    priorMatters: PriorMatter[];
    currentMatters: CurrentMatter[];
    conflictsIdentified: ConflictDetail[];
    screeningNotes: string;
    performedBy: string;
    reviewDate: Date;
    approvalRequired: boolean;
    approvedBy?: string;
    approvalDate?: Date;
    conditions?: string[];
    ethicalWallsRequired?: string[];
    clientNotificationsRequired?: string[];
    metadata?: Record<string, any>;
}
/**
 * Prior matter interface
 */
export interface PriorMatter {
    matterName: string;
    clientName: string;
    opposingParties: string[];
    practiceArea: string;
    startDate: Date;
    endDate?: Date;
    role: string;
    jurisdiction: string;
    confidentialInformation?: string[];
}
/**
 * Current matter interface
 */
export interface CurrentMatter {
    matterName: string;
    clientName: string;
    practiceArea: string;
    startDate: Date;
    expectedDuration?: number;
    portability: 'portable' | 'non_portable' | 'uncertain';
    clientConsent?: boolean;
}
/**
 * Screening report interface
 */
export interface ScreeningReport {
    id?: string;
    conflictCheckId: string;
    generatedDate: Date;
    generatedBy: string;
    summary: string;
    conflictsFound: number;
    conflictDetails: ConflictDetail[];
    recommendation: 'approve' | 'approve_with_conditions' | 'decline' | 'needs_review';
    conditions?: string[];
    waivers?: WaiverDocument[];
    ethicalWalls?: EthicalWall[];
    reviewedBy?: string[];
    finalDecision?: string;
    decisionDate?: Date;
    notificationsRequired: string[];
    followUpActions: Array<{
        action: string;
        responsible: string;
        dueDate: Date;
    }>;
    metadata?: Record<string, any>;
}
/**
 * Conflict notification interface
 */
export interface ConflictNotification {
    id?: string;
    conflictCheckId: string;
    recipientId: string;
    recipientType: 'attorney' | 'client' | 'admin' | 'ethics_partner';
    notificationType: 'new_conflict' | 'waiver_request' | 'ethical_wall' | 'periodic_review';
    subject: string;
    message: string;
    sentDate: Date;
    readDate?: Date;
    acknowledged?: boolean;
    acknowledgedDate?: Date;
    responseRequired: boolean;
    responseReceived?: string;
    metadata?: Record<string, any>;
}
/**
 * Conflict statistics interface
 */
export interface ConflictStatistics {
    period: {
        startDate: Date;
        endDate: Date;
    };
    totalChecks: number;
    checksCleared: number;
    conflictsFound: number;
    waiverRate: number;
    declineRate: number;
    byType: Record<ConflictType, number>;
    bySeverity: Record<ConflictSeverity, number>;
    byPracticeArea: Record<string, number>;
    averageResolutionTime: number;
    ethicalWallsImplemented: number;
    lateralHireChecks: number;
    trends: Array<{
        date: Date;
        checks: number;
        conflicts: number;
    }>;
}
/**
 * Opposing party validation schema
 */
export declare const OpposingPartySchema: any;
/**
 * Related entity validation schema
 */
export declare const RelatedEntitySchema: any;
/**
 * Conflict check request validation schema
 */
export declare const ConflictCheckRequestSchema: any;
/**
 * Conflict detail validation schema
 */
export declare const ConflictDetailSchema: any;
/**
 * Waiver document validation schema
 */
export declare const WaiverDocumentSchema: any;
/**
 * Ethical wall validation schema
 */
export declare const EthicalWallSchema: any;
/**
 * Prior matter validation schema
 */
export declare const PriorMatterSchema: any;
/**
 * Lateral hire check validation schema
 */
export declare const LateralHireCheckSchema: any;
/**
 * Conflict Check Request Model
 * Stores conflict check requests and their outcomes
 */
export declare class ConflictCheckRequestModel extends Model {
    id: string;
    requestType: ScreeningScope;
    matterId?: string;
    clientId?: string;
    clientName: string;
    opposingParties: OpposingParty[];
    relatedEntities: RelatedEntity[];
    matterDescription: string;
    practiceArea: string;
    requestedBy: string;
    requestDate: Date;
    urgency: 'low' | 'normal' | 'high' | 'critical';
    jurisdictions: string[];
    estimatedValue?: number;
    status: ConflictCheckStatus;
    performedBy?: string;
    completedDate?: Date;
    metadata?: Record<string, any>;
    conflicts?: ConflictDetailModel[];
    waivers?: WaiverDocumentModel[];
    ethicalWalls?: EthicalWallModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Conflict Detail Model
 * Stores identified conflicts and their analysis
 */
export declare class ConflictDetailModel extends Model {
    id: string;
    conflictCheckId: string;
    conflictCheck?: ConflictCheckRequestModel;
    conflictType: ConflictType;
    severity: ConflictSeverity;
    description: string;
    involvedParties: string[];
    affectedAttorneys: string[];
    conflictingMatterId?: string;
    conflictingClientId?: string;
    riskAssessment: string;
    recommendation: string;
    waiverPossible: boolean;
    ethicalRulesViolated?: string[];
    identifiedDate: Date;
    identifiedBy: string;
    resolution?: ConflictResolution;
    resolvedDate?: Date;
    metadata?: Record<string, any>;
    waivers?: WaiverDocumentModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Waiver Document Model
 * Stores conflict waiver documentation and status
 */
export declare class WaiverDocumentModel extends Model {
    id: string;
    conflictCheckId: string;
    conflictCheck?: ConflictCheckRequestModel;
    conflictId: string;
    conflict?: ConflictDetailModel;
    clientId: string;
    waiverType: 'informed_consent' | 'advance_waiver' | 'limited_waiver';
    status: WaiverStatus;
    documentText: string;
    disclosureProvided: string;
    sentDate?: Date;
    executedDate?: Date;
    signatories: Array<{
        name: string;
        title: string;
        signedDate?: Date;
        signature?: string;
    }>;
    expirationDate?: Date;
    conditions?: string[];
    revokedDate?: Date;
    revokedReason?: string;
    reviewedBy: string;
    approvedBy?: string;
    approvalDate?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Ethical Wall Model
 * Stores ethical wall (Chinese Wall) implementations and monitoring
 */
export declare class EthicalWallModel extends Model {
    id: string;
    conflictCheckId: string;
    conflictCheck?: ConflictCheckRequestModel;
    matterId: string;
    status: EthicalWallStatus;
    screenedAttorneys: string[];
    restrictedInformation: string[];
    implementationDate: Date;
    implementedBy: string;
    protocols: Array<{
        description: string;
        responsible: string;
        verificationMethod: string;
    }>;
    physicalMeasures?: string[];
    technicalMeasures?: string[];
    trainingCompleted: boolean;
    monitoringFrequency: string;
    lastReviewDate?: Date;
    breaches?: Array<{
        date: Date;
        description: string;
        remediation: string;
        reportedBy: string;
    }>;
    liftedDate?: Date;
    liftedReason?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Lateral Hire Check Model
 * Stores lateral hire conflict screening data
 */
export declare class LateralHireCheckModel extends Model {
    id: string;
    candidateId: string;
    candidateName: string;
    currentFirm: string;
    proposedStartDate: Date;
    status: LateralHireStatus;
    priorMatters: PriorMatter[];
    currentMatters: CurrentMatter[];
    conflictsIdentified?: ConflictDetail[];
    screeningNotes: string;
    performedBy: string;
    reviewDate: Date;
    approvalRequired: boolean;
    approvedBy?: string;
    approvalDate?: Date;
    conditions?: string[];
    ethicalWallsRequired?: string[];
    clientNotificationsRequired?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Conflict Notification Model
 * Stores notification records for conflict-related communications
 */
export declare class ConflictNotificationModel extends Model {
    id: string;
    conflictCheckId: string;
    recipientId: string;
    recipientType: 'attorney' | 'client' | 'admin' | 'ethics_partner';
    notificationType: 'new_conflict' | 'waiver_request' | 'ethical_wall' | 'periodic_review';
    subject: string;
    message: string;
    sentDate: Date;
    readDate?: Date;
    acknowledged: boolean;
    acknowledgedDate?: Date;
    responseRequired: boolean;
    responseReceived?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Conflict Screening Service
 * Manages comprehensive conflict of interest screening
 */
export declare class ConflictScreeningService {
    private readonly requestRepository;
    private readonly conflictRepository;
    private readonly logger;
    constructor(requestRepository: typeof ConflictCheckRequestModel, conflictRepository: typeof ConflictDetailModel);
    /**
     * 1. Initiate conflict check
     */
    initiateConflictCheck(requestData: ConflictCheckRequest): Promise<ConflictCheckRequestModel>;
    /**
     * 2. Perform comprehensive conflict screening
     */
    performConflictScreening(checkId: string, performedBy: string): Promise<{
        request: ConflictCheckRequestModel;
        conflicts: ConflictDetailModel[];
    }>;
    /**
     * 3. Screen for direct adversity conflicts
     */
    private screenDirectAdversity;
    /**
     * 4. Screen for former client conflicts
     */
    private screenFormerClients;
    /**
     * 5. Screen for imputed conflicts
     */
    private screenImputedConflicts;
    /**
     * 6. Screen for personal interest conflicts
     */
    private screenPersonalInterests;
    /**
     * 7. Search for adverse parties
     */
    searchAdverseParties(searchTerm: string, options?: {
        fuzzyMatch?: boolean;
        includeAliases?: boolean;
    }): Promise<Array<{
        party: OpposingParty;
        checkId: string;
        matterId?: string;
    }>>;
    /**
     * 8. Get conflict check status
     */
    getConflictCheckStatus(checkId: string): Promise<ConflictCheckRequestModel>;
    /**
     * 9. Update conflict check status
     */
    updateConflictCheckStatus(checkId: string, status: ConflictCheckStatus, notes?: string): Promise<ConflictCheckRequestModel>;
    /**
     * 10. Get conflicts by matter
     */
    getConflictsByMatter(matterId: string): Promise<ConflictDetailModel[]>;
    /**
     * 11. Get conflicts by client
     */
    getConflictsByClient(clientId: string): Promise<ConflictDetailModel[]>;
}
/**
 * Waiver Management Service
 * Manages conflict waivers and informed consent
 */
export declare class WaiverManagementService {
    private readonly waiverRepository;
    private readonly conflictRepository;
    private readonly logger;
    constructor(waiverRepository: typeof WaiverDocumentModel, conflictRepository: typeof ConflictDetailModel);
    /**
     * 12. Generate waiver document
     */
    generateWaiver(waiverData: WaiverDocument): Promise<WaiverDocumentModel>;
    /**
     * 13. Send waiver to client
     */
    sendWaiverToClient(waiverId: string, senderId: string): Promise<WaiverDocumentModel>;
    /**
     * 14. Execute waiver
     */
    executeWaiver(waiverId: string, signatoryInfo: Array<{
        name: string;
        title: string;
        signedDate: Date;
        signature: string;
    }>): Promise<WaiverDocumentModel>;
    /**
     * 15. Revoke waiver
     */
    revokeWaiver(waiverId: string, reason: string, revokedBy: string): Promise<WaiverDocumentModel>;
    /**
     * 16. Track waiver expiration
     */
    trackWaiverExpiration(): Promise<WaiverDocumentModel[]>;
    /**
     * 17. Get waivers by conflict
     */
    getWaiversByConflict(conflictId: string): Promise<WaiverDocumentModel[]>;
    /**
     * 18. Get active waivers
     */
    getActiveWaivers(clientId?: string): Promise<WaiverDocumentModel[]>;
}
/**
 * Ethical Wall Service
 * Manages ethical walls (Chinese Walls) and information barriers
 */
export declare class EthicalWallService {
    private readonly wallRepository;
    private readonly conflictRepository;
    private readonly logger;
    constructor(wallRepository: typeof EthicalWallModel, conflictRepository: typeof ConflictDetailModel);
    /**
     * 19. Implement ethical wall
     */
    implementEthicalWall(wallData: EthicalWall): Promise<EthicalWallModel>;
    /**
     * 20. Monitor ethical wall compliance
     */
    monitorEthicalWall(wallId: string, reviewNotes: string): Promise<EthicalWallModel>;
    /**
     * 21. Report ethical wall breach
     */
    reportBreach(wallId: string, breachData: {
        description: string;
        remediation: string;
        reportedBy: string;
    }): Promise<EthicalWallModel>;
    /**
     * 22. Lift ethical wall
     */
    liftEthicalWall(wallId: string, reason: string, liftedBy: string): Promise<EthicalWallModel>;
    /**
     * 23. Get ethical walls by matter
     */
    getEthicalWallsByMatter(matterId: string): Promise<EthicalWallModel[]>;
    /**
     * 24. Get ethical walls by attorney
     */
    getEthicalWallsByAttorney(attorneyId: string): Promise<EthicalWallModel[]>;
    /**
     * 25. Check if attorney is screened
     */
    isAttorneyScreened(attorneyId: string, matterId: string): Promise<boolean>;
}
/**
 * Lateral Hire Service
 * Manages lateral hire conflict checks
 */
export declare class LateralHireService {
    private readonly lateralRepository;
    private readonly conflictRepository;
    private readonly logger;
    constructor(lateralRepository: typeof LateralHireCheckModel, conflictRepository: typeof ConflictDetailModel);
    /**
     * 26. Initiate lateral hire check
     */
    initiateLateralHireCheck(checkData: LateralHireCheck): Promise<LateralHireCheckModel>;
    /**
     * 27. Analyze prior matters for conflicts
     */
    analyzePriorMatters(checkId: string): Promise<{
        conflicts: ConflictDetail[];
        riskScore: number;
    }>;
    /**
     * 28. Check opposing party conflicts for lateral hire
     */
    private checkOpposingPartyConflicts;
    /**
     * 29. Approve lateral hire
     */
    approveLateralHire(checkId: string, approvedBy: string, conditions?: string[]): Promise<LateralHireCheckModel>;
    /**
     * 30. Decline lateral hire
     */
    declineLateralHire(checkId: string, reason: string): Promise<LateralHireCheckModel>;
    /**
     * 31. Get lateral hire checks by status
     */
    getLateralHireChecksByStatus(status: LateralHireStatus): Promise<LateralHireCheckModel[]>;
}
/**
 * Conflict Reporting Service
 * Generates conflict reports and analytics
 */
export declare class ConflictReportingService {
    private readonly requestRepository;
    private readonly conflictRepository;
    private readonly logger;
    constructor(requestRepository: typeof ConflictCheckRequestModel, conflictRepository: typeof ConflictDetailModel);
    /**
     * 32. Generate screening report
     */
    generateScreeningReport(checkId: string): Promise<ScreeningReport>;
    /**
     * 33. Get conflict statistics
     */
    getConflictStatistics(startDate: Date, endDate: Date): Promise<ConflictStatistics>;
    /**
     * 34. Periodic conflict review
     */
    performPeriodicReview(matterId: string): Promise<{
        conflicts: ConflictDetailModel[];
        reviewDate: Date;
    }>;
    /**
     * 35. Export conflict data for compliance
     */
    exportConflictData(startDate: Date, endDate: Date): Promise<{
        checks: ConflictCheckRequestModel[];
        conflicts: ConflictDetailModel[];
        waivers: WaiverDocumentModel[];
        exportDate: Date;
    }>;
}
/**
 * Conflict check kit configuration
 */
export declare const conflictCheckConfig: any;
/**
 * Conflict Check Module
 * Provides comprehensive conflict of interest management
 */
export declare class ConflictCheckModule {
    static forRoot(): DynamicModule;
}
//# sourceMappingURL=conflict-check-kit.d.ts.map