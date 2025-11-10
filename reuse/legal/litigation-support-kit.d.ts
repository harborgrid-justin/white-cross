/**
 * LOC: LITIGATION_SUPPORT_KIT_001
 * File: /reuse/legal/litigation-support-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - pdf-lib
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Legal litigation modules
 *   - Court management controllers
 *   - Trial preparation services
 *   - Evidence management services
 *   - Witness coordination services
 */
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model, Sequelize } from 'sequelize-typescript';
import { z } from 'zod';
/**
 * Litigation matter status lifecycle
 */
export declare enum MatterStatus {
    INITIAL_CONSULTATION = "initial_consultation",
    INVESTIGATION = "investigation",
    PRE_LITIGATION = "pre_litigation",
    COMPLAINT_FILED = "complaint_filed",
    DISCOVERY = "discovery",
    MEDIATION = "mediation",
    ARBITRATION = "arbitration",
    PRE_TRIAL = "pre_trial",
    TRIAL = "trial",
    POST_TRIAL = "post_trial",
    APPEAL = "appeal",
    SETTLED = "settled",
    DISMISSED = "dismissed",
    JUDGMENT_ENTERED = "judgment_entered",
    CLOSED = "closed"
}
/**
 * Types of litigation matters
 */
export declare enum MatterType {
    MEDICAL_MALPRACTICE = "medical_malpractice",
    PERSONAL_INJURY = "personal_injury",
    EMPLOYMENT = "employment",
    CONTRACT_DISPUTE = "contract_dispute",
    INTELLECTUAL_PROPERTY = "intellectual_property",
    REGULATORY_COMPLIANCE = "regulatory_compliance",
    PROFESSIONAL_LIABILITY = "professional_liability",
    INSURANCE_DEFENSE = "insurance_defense",
    CLASS_ACTION = "class_action",
    PRODUCT_LIABILITY = "product_liability",
    CIVIL_RIGHTS = "civil_rights",
    HIPAA_VIOLATION = "hipaa_violation",
    OTHER = "other"
}
/**
 * Witness types and roles
 */
export declare enum WitnessType {
    FACT_WITNESS = "fact_witness",
    EXPERT_WITNESS = "expert_witness",
    CHARACTER_WITNESS = "character_witness",
    MEDICAL_EXPERT = "medical_expert",
    TECHNICAL_EXPERT = "technical_expert",
    PERCIPIENT_WITNESS = "percipient_witness",
    REBUTTAL_WITNESS = "rebuttal_witness",
    ADVERSE_WITNESS = "adverse_witness"
}
/**
 * Witness status tracking
 */
export declare enum WitnessStatus {
    IDENTIFIED = "identified",
    CONTACTED = "contacted",
    INTERVIEW_SCHEDULED = "interview_scheduled",
    INTERVIEWED = "interviewed",
    DEPOSITION_SCHEDULED = "deposition_scheduled",
    DEPOSED = "deposed",
    TRIAL_READY = "trial_ready",
    TESTIFIED = "testified",
    UNAVAILABLE = "unavailable",
    HOSTILE = "hostile"
}
/**
 * Evidence categorization
 */
export declare enum EvidenceCategory {
    DOCUMENTARY = "documentary",
    PHYSICAL = "physical",
    ELECTRONIC = "electronic",
    TESTIMONIAL = "testimonial",
    DEMONSTRATIVE = "demonstrative",
    MEDICAL_RECORDS = "medical_records",
    FINANCIAL_RECORDS = "financial_records",
    CORRESPONDENCE = "correspondence",
    PHOTOGRAPHS = "photographs",
    VIDEO = "video",
    AUDIO = "audio",
    EXPERT_REPORT = "expert_report",
    SCIENTIFIC = "scientific",
    REAL_EVIDENCE = "real_evidence"
}
/**
 * Chain of custody status
 */
export declare enum ChainOfCustodyStatus {
    COLLECTED = "collected",
    SECURED = "secured",
    ANALYZED = "analyzed",
    STORED = "stored",
    TRANSFERRED = "transferred",
    PRESENTED = "presented",
    RETURNED = "returned",
    DESTROYED = "destroyed"
}
/**
 * Timeline event types
 */
export declare enum TimelineEventType {
    INCIDENT = "incident",
    CONSULTATION = "consultation",
    FILING = "filing",
    SERVICE = "service",
    RESPONSE = "response",
    DISCOVERY_REQUEST = "discovery_request",
    DISCOVERY_RESPONSE = "discovery_response",
    DEPOSITION = "deposition",
    MOTION = "motion",
    HEARING = "hearing",
    SETTLEMENT_DISCUSSION = "settlement_discussion",
    MEDIATION = "mediation",
    ARBITRATION = "arbitration",
    TRIAL_DATE = "trial_date",
    VERDICT = "verdict",
    JUDGMENT = "judgment",
    APPEAL = "appeal",
    DEADLINE = "deadline"
}
/**
 * Trial preparation phases
 */
export declare enum TrialPhase {
    INITIAL_PREP = "initial_prep",
    WITNESS_PREP = "witness_prep",
    EXHIBIT_PREP = "exhibit_prep",
    VOIR_DIRE = "voir_dire",
    OPENING_STATEMENTS = "opening_statements",
    PLAINTIFF_CASE = "plaintiff_case",
    DEFENDANT_CASE = "defendant_case",
    REBUTTAL = "rebuttal",
    CLOSING_ARGUMENTS = "closing_arguments",
    JURY_INSTRUCTIONS = "jury_instructions",
    DELIBERATION = "deliberation",
    VERDICT = "verdict",
    POST_TRIAL_MOTIONS = "post_trial_motions"
}
/**
 * Litigation matter interface
 */
export interface ILitigationMatter {
    id: string;
    matterNumber: string;
    matterName: string;
    matterType: MatterType;
    status: MatterStatus;
    clientId: string;
    clientName: string;
    opposingParty: string;
    opposingCounsel?: string;
    jurisdiction: string;
    courtName?: string;
    caseNumber?: string;
    filingDate?: Date;
    trialDate?: Date;
    leadAttorneyId: string;
    assignedAttorneys: string[];
    description: string;
    estimatedValue?: number;
    actualCosts?: number;
    budgetLimit?: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Witness information interface
 */
export interface IWitness {
    id: string;
    matterId: string;
    witnessType: WitnessType;
    status: WitnessStatus;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    address?: string;
    organization?: string;
    role: string;
    credibilityScore?: number;
    interviewDate?: Date;
    depositionDate?: Date;
    depositionTranscript?: string;
    testimonyNotes?: string;
    availability: Record<string, boolean>;
    isOpposing: boolean;
    isExpert: boolean;
    expertiseArea?: string;
    expertFees?: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Evidence item interface
 */
export interface IEvidence {
    id: string;
    matterId: string;
    exhibitNumber?: string;
    category: EvidenceCategory;
    description: string;
    source: string;
    collectionDate: Date;
    collectedBy: string;
    location: string;
    fileHash?: string;
    filePath?: string;
    fileSize?: number;
    mimeType?: string;
    chainOfCustody: IChainOfCustodyEntry[];
    linkedWitnessIds: string[];
    tags: string[];
    isAdmitted: boolean;
    admissionDate?: Date;
    notes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Chain of custody entry
 */
export interface IChainOfCustodyEntry {
    timestamp: Date;
    action: ChainOfCustodyStatus;
    performedBy: string;
    location: string;
    notes?: string;
    signature?: string;
}
/**
 * Timeline event interface
 */
export interface ITimelineEvent {
    id: string;
    matterId: string;
    eventType: TimelineEventType;
    eventDate: Date;
    title: string;
    description: string;
    participants: string[];
    relatedDocuments: string[];
    relatedWitnesses: string[];
    relatedEvidence: string[];
    location?: string;
    outcome?: string;
    isDeadline: boolean;
    deadlineDate?: Date;
    completed: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Trial preparation interface
 */
export interface ITrialPreparation {
    id: string;
    matterId: string;
    trialDate: Date;
    currentPhase: TrialPhase;
    readinessScore: number;
    witnessListComplete: boolean;
    exhibitListComplete: boolean;
    trialBinderComplete: boolean;
    openingStatementDrafted: boolean;
    closingArgumentDrafted: boolean;
    witnessExaminationOutlines: Record<string, any>;
    trialStrategy: string;
    jurySelectionNotes?: string;
    estimatedDuration: number;
    checklist: ITrialChecklistItem[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Trial checklist item
 */
export interface ITrialChecklistItem {
    id: string;
    task: string;
    category: string;
    completed: boolean;
    completedBy?: string;
    completedAt?: Date;
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
    notes?: string;
}
export declare const CreateMatterSchema: any;
export declare const CreateWitnessSchema: any;
export declare const CreateEvidenceSchema: any;
export declare const CreateTimelineEventSchema: any;
/**
 * LitigationMatter Sequelize Model
 * Represents a litigation case or matter with full lifecycle tracking
 */
export declare class LitigationMatter extends Model<ILitigationMatter> {
    id: string;
    matterNumber: string;
    matterName: string;
    matterType: MatterType;
    status: MatterStatus;
    clientId: string;
    clientName: string;
    opposingParty: string;
    opposingCounsel?: string;
    jurisdiction: string;
    courtName?: string;
    caseNumber?: string;
    filingDate?: Date;
    trialDate?: Date;
    leadAttorneyId: string;
    assignedAttorneys: string[];
    description: string;
    estimatedValue?: number;
    actualCosts?: number;
    budgetLimit?: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    witnesses?: Witness[];
    evidence?: Evidence[];
    timelineEvents?: TimelineEvent[];
    trialPreparations?: TrialPreparation[];
}
/**
 * Witness Sequelize Model
 * Represents witnesses associated with litigation matters
 */
export declare class Witness extends Model<IWitness> {
    id: string;
    matterId: string;
    matter?: LitigationMatter;
    witnessType: WitnessType;
    status: WitnessStatus;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    address?: string;
    organization?: string;
    role: string;
    credibilityScore?: number;
    interviewDate?: Date;
    depositionDate?: Date;
    depositionTranscript?: string;
    testimonyNotes?: string;
    availability: Record<string, boolean>;
    isOpposing: boolean;
    isExpert: boolean;
    expertiseArea?: string;
    expertFees?: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Evidence Sequelize Model
 * Represents evidence items with chain of custody tracking
 */
export declare class Evidence extends Model<IEvidence> {
    id: string;
    matterId: string;
    matter?: LitigationMatter;
    exhibitNumber?: string;
    category: EvidenceCategory;
    description: string;
    source: string;
    collectionDate: Date;
    collectedBy: string;
    location: string;
    fileHash?: string;
    filePath?: string;
    fileSize?: number;
    mimeType?: string;
    chainOfCustody: IChainOfCustodyEntry[];
    linkedWitnessIds: string[];
    tags: string[];
    isAdmitted: boolean;
    admissionDate?: Date;
    notes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * TimelineEvent Sequelize Model
 * Represents events in the litigation timeline
 */
export declare class TimelineEvent extends Model<ITimelineEvent> {
    id: string;
    matterId: string;
    matter?: LitigationMatter;
    eventType: TimelineEventType;
    eventDate: Date;
    title: string;
    description: string;
    participants: string[];
    relatedDocuments: string[];
    relatedWitnesses: string[];
    relatedEvidence: string[];
    location?: string;
    outcome?: string;
    isDeadline: boolean;
    deadlineDate?: Date;
    completed: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * TrialPreparation Sequelize Model
 * Represents trial preparation and readiness tracking
 */
export declare class TrialPreparation extends Model<ITrialPreparation> {
    id: string;
    matterId: string;
    matter?: LitigationMatter;
    trialDate: Date;
    currentPhase: TrialPhase;
    readinessScore: number;
    witnessListComplete: boolean;
    exhibitListComplete: boolean;
    trialBinderComplete: boolean;
    openingStatementDrafted: boolean;
    closingArgumentDrafted: boolean;
    witnessExaminationOutlines: Record<string, any>;
    trialStrategy: string;
    jurySelectionNotes?: string;
    estimatedDuration: number;
    checklist: ITrialChecklistItem[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Generate unique matter number
 */
export declare function generateMatterNumber(prefix?: string): string;
/**
 * Calculate file hash for integrity verification
 */
export declare function calculateFileHash(content: Buffer | string): string;
/**
 * Generate exhibit number
 */
export declare function generateExhibitNumber(side: 'plaintiff' | 'defendant', sequence: number): string;
/**
 * LitigationMatterService
 * Injectable service for matter management operations
 */
export declare class LitigationMatterService {
    private sequelize;
    private configService;
    private readonly logger;
    constructor(sequelize: Sequelize, configService: ConfigService);
    /**
     * 1. Create new litigation matter
     */
    createLitigationMatter(data: z.infer<typeof CreateMatterSchema>, createdBy: string): Promise<LitigationMatter>;
    /**
     * 2. Update matter details
     */
    updateMatterDetails(matterId: string, updates: Partial<ILitigationMatter>, updatedBy: string): Promise<LitigationMatter>;
    /**
     * 3. Get matter by ID
     */
    getMatterById(matterId: string): Promise<LitigationMatter>;
    /**
     * 4. Search matters with filters
     */
    searchMatters(filters: {
        status?: MatterStatus[];
        matterType?: MatterType[];
        clientId?: string;
        leadAttorneyId?: string;
        keyword?: string;
        filingDateFrom?: Date;
        filingDateTo?: Date;
        trialDateFrom?: Date;
        trialDateTo?: Date;
        limit?: number;
        offset?: number;
    }): Promise<{
        rows: LitigationMatter[];
        count: number;
    }>;
    /**
     * 5. Update matter status
     */
    updateMatterStatus(matterId: string, newStatus: MatterStatus, updatedBy: string, notes?: string): Promise<LitigationMatter>;
    /**
     * 6. Assign matter to attorney
     */
    assignMatterToAttorney(matterId: string, attorneyId: string, isLead: boolean, assignedBy: string): Promise<LitigationMatter>;
    /**
     * 7. Calculate matter costs
     */
    calculateMatterCosts(matterId: string): Promise<{
        actualCosts: number;
        budgetLimit: number | null;
        budgetRemaining: number | null;
        percentageUsed: number | null;
        breakdown: {
            witnessExpenses: number;
            filingFees: number;
            expertFees: number;
            otherExpenses: number;
        };
    }>;
    /**
     * 8. Generate matter summary
     */
    generateMatterSummary(matterId: string): Promise<{
        matter: ILitigationMatter;
        statistics: {
            totalWitnesses: number;
            expertWitnesses: number;
            totalEvidence: number;
            admittedEvidence: number;
            timelineEvents: number;
            upcomingDeadlines: number;
        };
        status: {
            daysActive: number;
            daysUntilTrial: number | null;
            currentPhase: string;
        };
    }>;
}
/**
 * TimelineVisualizationService
 * Injectable service for timeline management
 */
export declare class TimelineVisualizationService {
    private sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 9. Create timeline event
     */
    createTimelineEvent(data: z.infer<typeof CreateTimelineEventSchema>, createdBy: string): Promise<TimelineEvent>;
    /**
     * 10. Update timeline event
     */
    updateTimelineEvent(eventId: string, updates: Partial<ITimelineEvent>, updatedBy: string): Promise<TimelineEvent>;
    /**
     * 11. Get timeline for matter
     */
    getTimelineForMatter(matterId: string, options?: {
        eventTypes?: TimelineEventType[];
        includeCompleted?: boolean;
        sortOrder?: 'ASC' | 'DESC';
    }): Promise<TimelineEvent[]>;
    /**
     * 12. Generate timeline visualization data
     */
    generateTimelineVisualization(matterId: string): Promise<{
        events: Array<{
            id: string;
            date: Date;
            title: string;
            type: TimelineEventType;
            description: string;
            isDeadline: boolean;
            completed: boolean;
        }>;
        milestones: Array<{
            date: Date;
            label: string;
            significance: 'low' | 'medium' | 'high';
        }>;
        deadlines: Array<{
            date: Date;
            title: string;
            overdue: boolean;
            daysRemaining: number;
        }>;
    }>;
    /**
     * 13. Detect timeline conflicts
     */
    detectTimelineConflicts(matterId: string): Promise<Array<{
        conflict: string;
        events: string[];
        severity: 'low' | 'medium' | 'high';
        suggestion: string;
    }>>;
    /**
     * 14. Export timeline data
     */
    exportTimelineData(matterId: string, format: 'json' | 'csv'): Promise<string>;
}
/**
 * WitnessManagementService
 * Injectable service for witness operations
 */
export declare class WitnessManagementService {
    private sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 15. Add witness to matter
     */
    addWitnessToMatter(data: z.infer<typeof CreateWitnessSchema>, addedBy: string): Promise<Witness>;
    /**
     * 16. Update witness information
     */
    updateWitnessInformation(witnessId: string, updates: Partial<IWitness>, updatedBy: string): Promise<Witness>;
    /**
     * 17. Schedule witness interview
     */
    scheduleWitnessInterview(witnessId: string, interviewDate: Date, scheduledBy: string, notes?: string): Promise<Witness>;
    /**
     * 18. Record witness testimony
     */
    recordWitnessTestimony(witnessId: string, testimony: {
        type: 'interview' | 'deposition' | 'trial';
        date: Date;
        notes: string;
        transcriptPath?: string;
    }, recordedBy: string): Promise<Witness>;
    /**
     * 19. Assess witness credibility
     */
    assessWitnessCredibility(witnessId: string, score: number, assessmentNotes: string, assessedBy: string): Promise<Witness>;
    /**
     * 20. Generate witness list
     */
    generateWitnessList(matterId: string, options?: {
        includeOpposing?: boolean;
        witnessTypes?: WitnessType[];
        sortBy?: 'name' | 'type' | 'credibility';
    }): Promise<Array<{
        id: string;
        name: string;
        type: WitnessType;
        status: WitnessStatus;
        isExpert: boolean;
        isOpposing: boolean;
        credibilityScore?: number;
        contact: {
            email?: string;
            phone?: string;
        };
    }>>;
    /**
     * 21. Track witness availability
     */
    trackWitnessAvailability(witnessId: string, availability: Record<string, boolean>, updatedBy: string): Promise<Witness>;
}
/**
 * EvidenceTrackingService
 * Injectable service for evidence management
 */
export declare class EvidenceTrackingService {
    private sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 22. Add evidence to matter
     */
    addEvidenceToMatter(data: z.infer<typeof CreateEvidenceSchema>, addedBy: string): Promise<Evidence>;
    /**
     * 23. Update evidence details
     */
    updateEvidenceDetails(evidenceId: string, updates: Partial<IEvidence>, updatedBy: string): Promise<Evidence>;
    /**
     * 24. Record chain of custody
     */
    recordChainOfCustody(evidenceId: string, entry: {
        action: ChainOfCustodyStatus;
        location: string;
        notes?: string;
        signature?: string;
    }, performedBy: string): Promise<Evidence>;
    /**
     * 25. Search evidence
     */
    searchEvidence(filters: {
        matterId?: string;
        category?: EvidenceCategory[];
        keyword?: string;
        collectedFrom?: Date;
        collectedTo?: Date;
        isAdmitted?: boolean;
        tags?: string[];
        limit?: number;
        offset?: number;
    }): Promise<{
        rows: Evidence[];
        count: number;
    }>;
    /**
     * 26. Generate exhibit list
     */
    generateExhibitList(matterId: string, side: 'plaintiff' | 'defendant'): Promise<Array<{
        exhibitNumber: string;
        description: string;
        category: EvidenceCategory;
        source: string;
        isAdmitted: boolean;
        notes: string;
    }>>;
    /**
     * 27. Validate evidence integrity
     */
    validateEvidenceIntegrity(evidenceId: string): Promise<{
        isValid: boolean;
        expectedHash?: string;
        actualHash?: string;
        chainIntact: boolean;
        issues: string[];
    }>;
    /**
     * 28. Link evidence to witness
     */
    linkEvidenceToWitness(evidenceId: string, witnessId: string, linkedBy: string): Promise<Evidence>;
    /**
     * 29. Export evidence log
     */
    exportEvidenceLog(matterId: string, format: 'json' | 'csv'): Promise<string>;
}
/**
 * TrialPreparationService
 * Injectable service for trial preparation operations
 */
export declare class TrialPreparationService {
    private sequelize;
    private witnessService;
    private evidenceService;
    private readonly logger;
    constructor(sequelize: Sequelize, witnessService: WitnessManagementService, evidenceService: EvidenceTrackingService);
    /**
     * 30. Create trial preparation plan
     */
    createTrialPreparationPlan(matterId: string, trialDate: Date, createdBy: string): Promise<TrialPreparation>;
    /**
     * 31. Update trial readiness
     */
    updateTrialReadiness(trialPrepId: string, updates: Partial<ITrialPreparation>, updatedBy: string): Promise<TrialPreparation>;
    /**
     * 32. Generate trial binder
     */
    generateTrialBinder(trialPrepId: string): Promise<{
        sections: Array<{
            title: string;
            order: number;
            documents: Array<{
                name: string;
                type: string;
                path?: string;
            }>;
        }>;
        tableOfContents: string;
    }>;
    /**
     * 33. Schedule trial date
     */
    scheduleTrialDate(matterId: string, trialDate: Date, scheduledBy: string, courtroom?: string): Promise<LitigationMatter>;
    /**
     * 34. Assess trial readiness
     */
    assessTrialReadiness(trialPrepId: string): Promise<{
        readinessScore: number;
        assessmentDate: Date;
        completionStatus: {
            witnessList: boolean;
            exhibitList: boolean;
            trialBinder: boolean;
            openingStatement: boolean;
            closingArgument: boolean;
        };
        checklistProgress: {
            total: number;
            completed: number;
            percentComplete: number;
        };
        upcomingTasks: Array<{
            task: string;
            dueDate: Date;
            priority: string;
            overdue: boolean;
        }>;
        recommendations: string[];
    }>;
    /**
     * 35. Generate opening statement framework
     */
    generateOpeningStatement(trialPrepId: string, theme: string): Promise<{
        theme: string;
        structure: Array<{
            section: string;
            purpose: string;
            keyPoints: string[];
        }>;
        template: string;
    }>;
    /**
     * 36. Create examination outline
     */
    createExaminationOutline(trialPrepId: string, witnessId: string, examinationType: 'direct' | 'cross'): Promise<{
        witnessName: string;
        examinationType: 'direct' | 'cross';
        objectives: string[];
        outline: Array<{
            topic: string;
            questions: string[];
            expectedAnswers?: string[];
            exhibits?: string[];
        }>;
    }>;
    /**
     * Helper: Calculate readiness score
     */
    private calculateReadinessScore;
}
/**
 * DocumentGenerationService
 * Injectable service for legal document generation
 */
export declare class DocumentGenerationService {
    private sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 37. Generate pleading
     */
    generatePleading(matterId: string, pleadingType: 'complaint' | 'answer' | 'reply', claims: Array<{
        claim: string;
        allegations: string[];
    }>): Promise<{
        pleadingType: string;
        document: string;
        dateGenerated: Date;
    }>;
    /**
     * 38. Create motion
     */
    createMotion(matterId: string, motionType: string, grounds: string[], reliefSought: string): Promise<{
        motionType: string;
        document: string;
        dateGenerated: Date;
    }>;
    /**
     * 39. Assemble trial exhibits
     */
    assembleTrialExhibits(matterId: string, side: 'plaintiff' | 'defendant'): Promise<{
        totalExhibits: number;
        exhibits: Array<{
            exhibitNumber: string;
            description: string;
            category: string;
            filePath?: string;
        }>;
        coverSheet: string;
    }>;
    /**
     * 40. Generate discovery request
     */
    generateDiscoveryRequest(matterId: string, requestType: 'interrogatories' | 'requests_for_production' | 'requests_for_admission', requests: string[]): Promise<{
        requestType: string;
        document: string;
        dateGenerated: Date;
    }>;
    /**
     * 41. Create settlement demand
     */
    createSettlementDemand(matterId: string, demandAmount: number, damages: Array<{
        category: string;
        amount: number;
        description: string;
    }>, deadline: Date): Promise<{
        demandAmount: number;
        document: string;
        dateGenerated: Date;
    }>;
    /**
     * 42. Generate case chronology
     */
    generateCaseChronology(matterId: string): Promise<{
        matterName: string;
        events: Array<{
            date: Date;
            event: string;
            description: string;
            category: string;
        }>;
        document: string;
        dateGenerated: Date;
    }>;
}
/**
 * Configuration factory for litigation support
 */
export declare const litigationSupportConfig: any;
/**
 * LitigationSupportModule
 * NestJS module providing litigation management services
 */
export declare class LitigationSupportModule {
    static forRoot(sequelize: Sequelize): DynamicModule;
}
export { LitigationMatter, Witness, Evidence, TimelineEvent, TrialPreparation, LitigationMatterService, TimelineVisualizationService, WitnessManagementService, EvidenceTrackingService, TrialPreparationService, DocumentGenerationService, generateMatterNumber, calculateFileHash, generateExhibitNumber, };
//# sourceMappingURL=litigation-support-kit.d.ts.map