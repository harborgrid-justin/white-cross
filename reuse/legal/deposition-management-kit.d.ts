/**
 * LOC: DEPOSITION_MANAGEMENT_KIT_001
 * File: /reuse/legal/deposition-management-kit.ts
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
 *   - node-schedule
 *
 * DOWNSTREAM (imported by):
 *   - Legal deposition modules
 *   - Litigation support controllers
 *   - Discovery management services
 *   - Court reporting services
 *   - Transcript management services
 */
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model, Sequelize } from 'sequelize-typescript';
import { z } from 'zod';
import { Transaction } from 'sequelize';
/**
 * Deposition status lifecycle
 */
export declare enum DepositionStatus {
    SCHEDULED = "scheduled",
    NOTICE_SENT = "notice_sent",
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in_progress",
    RECESSED = "recessed",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    RESCHEDULED = "rescheduled",
    TRANSCRIPT_ORDERED = "transcript_ordered",
    TRANSCRIPT_RECEIVED = "transcript_received",
    REVIEWED = "reviewed",
    FINALIZED = "finalized"
}
/**
 * Deposition types
 */
export declare enum DepositionType {
    ORAL = "oral",
    WRITTEN = "written",
    VIDEO = "video",
    TELEPHONE = "telephone",
    REMOTE = "remote",
    EXPERT_WITNESS = "expert_witness",
    PARTY = "party",
    NON_PARTY = "non_party",
    CORPORATE_REPRESENTATIVE = "corporate_representative",
    RULE_30_B_6 = "rule_30_b_6"
}
/**
 * Exhibit status
 */
export declare enum ExhibitStatus {
    IDENTIFIED = "identified",
    PREPARED = "prepared",
    MARKED = "marked",
    INTRODUCED = "introduced",
    AUTHENTICATED = "authenticated",
    ADMITTED = "admitted",
    EXCLUDED = "excluded",
    WITHDRAWN = "withdrawn"
}
/**
 * Objection types
 */
export declare enum ObjectionType {
    FORM = "form",
    RELEVANCE = "relevance",
    HEARSAY = "hearsay",
    SPECULATION = "speculation",
    PRIVILEGE = "privilege",
    ATTORNEY_CLIENT = "attorney_client",
    WORK_PRODUCT = "work_product",
    FOUNDATION = "foundation",
    COMPOUND = "compound",
    ARGUMENTATIVE = "argumentative",
    ASKED_AND_ANSWERED = "asked_and_answered",
    VAGUE = "vague",
    AMBIGUOUS = "ambiguous",
    CONFIDENTIAL = "confidential",
    PROPRIETARY = "proprietary",
    PRIVACY = "privacy",
    HARASSING = "harassing",
    OPPRESSIVE = "oppressive"
}
/**
 * Objection ruling
 */
export declare enum ObjectionRuling {
    PENDING = "pending",
    SUSTAINED = "sustained",
    OVERRULED = "overruled",
    DEFERRED = "deferred",
    WITHDRAWN = "withdrawn",
    INSTRUCTION_TO_ANSWER = "instruction_to_answer",
    INSTRUCTION_NOT_TO_ANSWER = "instruction_not_to_answer"
}
/**
 * Transcript status
 */
export declare enum TranscriptStatus {
    ORDERED = "ordered",
    IN_PRODUCTION = "in_production",
    DRAFT_RECEIVED = "draft_received",
    UNDER_REVIEW = "under_review",
    ERRATA_SUBMITTED = "errata_submitted",
    CERTIFIED = "certified",
    FINALIZED = "finalized"
}
/**
 * Deposition interface
 */
export interface IDeposition {
    id: string;
    depositionNumber: string;
    matterId: string;
    witnessId: string;
    witnessName: string;
    depositionType: DepositionType;
    status: DepositionStatus;
    scheduledDate: Date;
    scheduledTime: string;
    duration: number;
    location: string;
    isRemote: boolean;
    remoteLink?: string;
    roomNumber?: string;
    defendingAttorneyId: string;
    examiningAttorneyId: string;
    attendees: string[];
    courtReporterId?: string;
    courtReporterName?: string;
    courtReporterFirm?: string;
    videographerId?: string;
    videographerName?: string;
    noticeServedDate?: Date;
    noticeMethod?: string;
    estimatedCost: number;
    actualCost?: number;
    isExpert: boolean;
    expertFee?: number;
    materialsProvided: string[];
    topics: string[];
    priority: 'low' | 'medium' | 'high' | 'urgent';
    notes: string;
    cancelledReason?: string;
    rescheduledFrom?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Deposition exhibit interface
 */
export interface IDepositionExhibit {
    id: string;
    depositionId: string;
    exhibitNumber: string;
    exhibitLabel: string;
    description: string;
    status: ExhibitStatus;
    documentId?: string;
    documentPath?: string;
    documentType: string;
    fileSize?: number;
    pageCount?: number;
    markedAt?: Date;
    markedBy?: string;
    introducedAt?: Date;
    authenticatedBy?: string;
    batesRange?: string;
    isConfidential: boolean;
    isPriorArt: boolean;
    objections: string[];
    admissionNotes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Deposition transcript interface
 */
export interface IDepositionTranscript {
    id: string;
    depositionId: string;
    status: TranscriptStatus;
    courtReporterId: string;
    orderedDate: Date;
    expectedDate?: Date;
    receivedDate?: Date;
    certifiedDate?: Date;
    transcriptType: 'rough' | 'expedited' | 'daily' | 'standard' | 'certified';
    format: 'pdf' | 'word' | 'text' | 'ptx' | 'ascii';
    filePath?: string;
    fileSize?: number;
    pageCount?: number;
    totalCost: number;
    rushFee?: number;
    copyFee?: number;
    videoCost?: number;
    errataDeadline?: Date;
    errataSubmitted?: Date;
    errataPath?: string;
    reviewAssignedTo?: string;
    reviewCompletedDate?: Date;
    isConfidential: boolean;
    accessRestrictions: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Deposition objection interface
 */
export interface IDepositionObjection {
    id: string;
    depositionId: string;
    transcriptPage?: number;
    transcriptLine?: number;
    timestamp: Date;
    objectionType: ObjectionType;
    objectingAttorneyId: string;
    objectingAttorneyName: string;
    question: string;
    grounds: string;
    ruling: ObjectionRuling;
    rulingJudge?: string;
    rulingDate?: Date;
    rulingNotes?: string;
    isPreserved: boolean;
    relatedMotion?: string;
    impeachmentValue: 'low' | 'medium' | 'high';
    followUpRequired: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Deposition summary interface
 */
export interface IDepositionSummary {
    id: string;
    depositionId: string;
    summaryType: 'page-line' | 'narrative' | 'topical' | 'issue-focused' | 'impeachment';
    createdBy: string;
    reviewedBy?: string;
    approvedBy?: string;
    summaryText: string;
    keyTestimony: Array<{
        topic: string;
        pageRange: string;
        lineRange: string;
        testimony: string;
        significance: string;
        tags: string[];
    }>;
    admissions: string[];
    contradictions: string[];
    impeachmentOpportunities: string[];
    exhibits: string[];
    credibilityAssessment: string;
    strengthScore: number;
    overallImpact: 'positive' | 'neutral' | 'negative' | 'mixed';
    followUpQuestions: string[];
    trialUseNotes: string;
    isConfidential: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Deposition outline interface
 */
export interface IDepositionOutline {
    id: string;
    depositionId: string;
    createdBy: string;
    title: string;
    version: number;
    topics: Array<{
        order: number;
        topic: string;
        subtopics: string[];
        questions: string[];
        exhibitsToUse: string[];
        estimatedTime: number;
        priority: 'high' | 'medium' | 'low';
        notes: string;
    }>;
    objectives: string[];
    documentsToReview: string[];
    impeachmentMaterial: string[];
    estimatedDuration: number;
    actualDuration?: number;
    completionStatus: Record<string, boolean>;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const DepositionScheduleSchema: any;
export declare const ExhibitPrepSchema: any;
export declare const TranscriptOrderSchema: any;
export declare const ObjectionSchema: any;
export declare const SummaryCreationSchema: any;
export declare class DepositionModel extends Model<IDeposition> {
    id: string;
    depositionNumber: string;
    matterId: string;
    witnessId: string;
    witnessName: string;
    depositionType: DepositionType;
    status: DepositionStatus;
    scheduledDate: Date;
    scheduledTime: string;
    duration: number;
    location: string;
    isRemote: boolean;
    remoteLink?: string;
    roomNumber?: string;
    defendingAttorneyId: string;
    examiningAttorneyId: string;
    attendees: string[];
    courtReporterId?: string;
    courtReporterName?: string;
    courtReporterFirm?: string;
    videographerId?: string;
    videographerName?: string;
    noticeServedDate?: Date;
    noticeMethod?: string;
    estimatedCost: number;
    actualCost?: number;
    isExpert: boolean;
    expertFee?: number;
    materialsProvided: string[];
    topics: string[];
    priority: 'low' | 'medium' | 'high' | 'urgent';
    notes: string;
    cancelledReason?: string;
    rescheduledFrom?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    exhibits?: DepositionExhibitModel[];
    transcripts?: DepositionTranscriptModel[];
    objections?: DepositionObjectionModel[];
    summaries?: DepositionSummaryModel[];
}
export declare class DepositionExhibitModel extends Model<IDepositionExhibit> {
    id: string;
    depositionId: string;
    exhibitNumber: string;
    exhibitLabel: string;
    description: string;
    status: ExhibitStatus;
    documentId?: string;
    documentPath?: string;
    documentType: string;
    fileSize?: number;
    pageCount?: number;
    markedAt?: Date;
    markedBy?: string;
    introducedAt?: Date;
    authenticatedBy?: string;
    batesRange?: string;
    isConfidential: boolean;
    isPriorArt: boolean;
    objections: string[];
    admissionNotes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deposition?: DepositionModel;
}
export declare class DepositionTranscriptModel extends Model<IDepositionTranscript> {
    id: string;
    depositionId: string;
    status: TranscriptStatus;
    courtReporterId: string;
    orderedDate: Date;
    expectedDate?: Date;
    receivedDate?: Date;
    certifiedDate?: Date;
    transcriptType: 'rough' | 'expedited' | 'daily' | 'standard' | 'certified';
    format: 'pdf' | 'word' | 'text' | 'ptx' | 'ascii';
    filePath?: string;
    fileSize?: number;
    pageCount?: number;
    totalCost: number;
    rushFee?: number;
    copyFee?: number;
    videoCost?: number;
    errataDeadline?: Date;
    errataSubmitted?: Date;
    errataPath?: string;
    reviewAssignedTo?: string;
    reviewCompletedDate?: Date;
    isConfidential: boolean;
    accessRestrictions: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deposition?: DepositionModel;
}
export declare class DepositionObjectionModel extends Model<IDepositionObjection> {
    id: string;
    depositionId: string;
    transcriptPage?: number;
    transcriptLine?: number;
    timestamp: Date;
    objectionType: ObjectionType;
    objectingAttorneyId: string;
    objectingAttorneyName: string;
    question: string;
    grounds: string;
    ruling: ObjectionRuling;
    rulingJudge?: string;
    rulingDate?: Date;
    rulingNotes?: string;
    isPreserved: boolean;
    relatedMotion?: string;
    impeachmentValue: 'low' | 'medium' | 'high';
    followUpRequired: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deposition?: DepositionModel;
}
export declare class DepositionSummaryModel extends Model<IDepositionSummary> {
    id: string;
    depositionId: string;
    summaryType: 'page-line' | 'narrative' | 'topical' | 'issue-focused' | 'impeachment';
    createdBy: string;
    reviewedBy?: string;
    approvedBy?: string;
    summaryText: string;
    keyTestimony: Array<{
        topic: string;
        pageRange: string;
        lineRange: string;
        testimony: string;
        significance: string;
        tags: string[];
    }>;
    admissions: string[];
    contradictions: string[];
    impeachmentOpportunities: string[];
    exhibits: string[];
    credibilityAssessment: string;
    strengthScore: number;
    overallImpact: 'positive' | 'neutral' | 'negative' | 'mixed';
    followUpQuestions: string[];
    trialUseNotes: string;
    isConfidential: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deposition?: DepositionModel;
}
export declare class DepositionOutlineModel extends Model<IDepositionOutline> {
    id: string;
    depositionId: string;
    createdBy: string;
    title: string;
    version: number;
    topics: Array<{
        order: number;
        topic: string;
        subtopics: string[];
        questions: string[];
        exhibitsToUse: string[];
        estimatedTime: number;
        priority: 'high' | 'medium' | 'low';
        notes: string;
    }>;
    objectives: string[];
    documentsToReview: string[];
    impeachmentMaterial: string[];
    estimatedDuration: number;
    actualDuration?: number;
    completionStatus: Record<string, boolean>;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deposition?: DepositionModel;
}
/**
 * Schedule a new deposition with calendar integration and conflict detection
 *
 * @param params - Deposition scheduling parameters
 * @param transaction - Optional database transaction
 * @returns Created deposition record
 * @throws BadRequestException if scheduling conflicts exist
 * @throws NotFoundException if witness or attorneys not found
 */
export declare function scheduleDeposition(params: z.infer<typeof DepositionScheduleSchema>, transaction?: Transaction): Promise<DepositionModel>;
/**
 * Generate unique deposition number for a matter
 *
 * @param matterId - Matter identifier
 * @param transaction - Optional database transaction
 * @returns Unique deposition number
 */
export declare function generateDepositionNumber(matterId: string, transaction?: Transaction): Promise<string>;
/**
 * Calculate estimated deposition cost based on parameters
 *
 * @param params - Deposition parameters
 * @returns Estimated cost in dollars
 */
export declare function calculateEstimatedCost(params: z.infer<typeof DepositionScheduleSchema>): number;
/**
 * Prepare and mark an exhibit for deposition use
 *
 * @param params - Exhibit preparation parameters
 * @param transaction - Optional database transaction
 * @returns Created exhibit record
 * @throws NotFoundException if deposition not found
 */
export declare function prepareDepositionExhibit(params: z.infer<typeof ExhibitPrepSchema>, transaction?: Transaction): Promise<DepositionExhibitModel>;
/**
 * Generate sequential exhibit number for a deposition
 *
 * @param depositionId - Deposition identifier
 * @param transaction - Optional database transaction
 * @returns Exhibit number (e.g., "1", "2", "3")
 */
export declare function generateExhibitNumber(depositionId: string, transaction?: Transaction): Promise<string>;
/**
 * Order deposition transcript from court reporter
 *
 * @param params - Transcript order parameters
 * @param transaction - Optional database transaction
 * @returns Created transcript order record
 * @throws NotFoundException if deposition or court reporter not found
 */
export declare function orderDepositionTranscript(params: z.infer<typeof TranscriptOrderSchema>, transaction?: Transaction): Promise<DepositionTranscriptModel>;
/**
 * Calculate transcript cost based on type and duration
 *
 * @param transcriptType - Type of transcript
 * @param duration - Deposition duration in minutes
 * @returns Total cost in dollars
 */
export declare function calculateTranscriptCost(transcriptType: 'rough' | 'expedited' | 'daily' | 'standard' | 'certified', duration: number): number;
/**
 * Calculate expected delivery date for transcript based on type
 *
 * @param transcriptType - Type of transcript
 * @returns Expected delivery date
 */
export declare function calculateExpectedDate(transcriptType: 'rough' | 'expedited' | 'daily' | 'standard' | 'certified'): Date;
/**
 * Track and log objection during deposition
 *
 * @param params - Objection parameters
 * @param transaction - Optional database transaction
 * @returns Created objection record
 * @throws NotFoundException if deposition not found
 */
export declare function trackDepositionObjection(params: z.infer<typeof ObjectionSchema>, transaction?: Transaction): Promise<DepositionObjectionModel>;
/**
 * Create comprehensive deposition summary with key testimony
 *
 * @param params - Summary creation parameters
 * @param transaction - Optional database transaction
 * @returns Created summary record
 * @throws NotFoundException if deposition not found
 */
export declare function createDepositionSummary(params: z.infer<typeof SummaryCreationSchema>, transaction?: Transaction): Promise<DepositionSummaryModel>;
/**
 * Mark exhibit as introduced during deposition
 *
 * @param exhibitId - Exhibit identifier
 * @param markedBy - Attorney marking the exhibit
 * @param transaction - Optional database transaction
 * @returns Updated exhibit record
 */
export declare function markExhibit(exhibitId: string, markedBy: string, transaction?: Transaction): Promise<DepositionExhibitModel>;
/**
 * Mark exhibit as introduced into the deposition record
 *
 * @param exhibitId - Exhibit identifier
 * @param transaction - Optional database transaction
 * @returns Updated exhibit record
 */
export declare function introduceExhibit(exhibitId: string, transaction?: Transaction): Promise<DepositionExhibitModel>;
/**
 * Mark exhibit as authenticated by witness
 *
 * @param exhibitId - Exhibit identifier
 * @param authenticatedBy - Witness authenticating the exhibit
 * @param transaction - Optional database transaction
 * @returns Updated exhibit record
 */
export declare function authenticateExhibit(exhibitId: string, authenticatedBy: string, transaction?: Transaction): Promise<DepositionExhibitModel>;
/**
 * Update ruling on deposition objection
 *
 * @param objectionId - Objection identifier
 * @param ruling - Ruling decision
 * @param rulingJudge - Judge name (optional)
 * @param notes - Ruling notes (optional)
 * @param transaction - Optional database transaction
 * @returns Updated objection record
 */
export declare function updateObjectionRuling(objectionId: string, ruling: ObjectionRuling, rulingJudge?: string, notes?: string, transaction?: Transaction): Promise<DepositionObjectionModel>;
/**
 * Generate formal deposition notice document
 *
 * @param depositionId - Deposition identifier
 * @returns Notice document content
 */
export declare function generateDepositionNotice(depositionId: string): Promise<string>;
/**
 * Create structured deposition outline with topics and questions
 *
 * @param depositionId - Deposition identifier
 * @param createdBy - Attorney creating the outline
 * @param title - Outline title
 * @param topics - Topic structure
 * @param transaction - Optional database transaction
 * @returns Created outline record
 */
export declare function createDepositionOutline(depositionId: string, createdBy: string, title: string, topics: Array<{
    order: number;
    topic: string;
    subtopics: string[];
    questions: string[];
    exhibitsToUse: string[];
    estimatedTime: number;
    priority: 'high' | 'medium' | 'low';
    notes: string;
}>, transaction?: Transaction): Promise<DepositionOutlineModel>;
/**
 * Update deposition status with validation
 *
 * @param depositionId - Deposition identifier
 * @param status - New status
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export declare function updateDepositionStatus(depositionId: string, status: DepositionStatus, transaction?: Transaction): Promise<DepositionModel>;
/**
 * Cancel scheduled deposition with reason
 *
 * @param depositionId - Deposition identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export declare function cancelDeposition(depositionId: string, reason: string, transaction?: Transaction): Promise<DepositionModel>;
/**
 * Reschedule deposition to new date/time
 *
 * @param depositionId - Original deposition identifier
 * @param newDate - New scheduled date
 * @param newTime - New scheduled time
 * @param transaction - Optional database transaction
 * @returns New deposition record
 */
export declare function rescheduleDeposition(depositionId: string, newDate: Date, newTime: string, transaction?: Transaction): Promise<DepositionModel>;
/**
 * Assign court reporter to deposition
 *
 * @param depositionId - Deposition identifier
 * @param courtReporterId - Court reporter identifier
 * @param courtReporterName - Court reporter name
 * @param courtReporterFirm - Court reporter firm
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export declare function assignCourtReporter(depositionId: string, courtReporterId: string, courtReporterName: string, courtReporterFirm: string, transaction?: Transaction): Promise<DepositionModel>;
/**
 * Assign videographer to video deposition
 *
 * @param depositionId - Deposition identifier
 * @param videographerId - Videographer identifier
 * @param videographerName - Videographer name
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export declare function assignVideographer(depositionId: string, videographerId: string, videographerName: string, transaction?: Transaction): Promise<DepositionModel>;
/**
 * Add attendee to deposition
 *
 * @param depositionId - Deposition identifier
 * @param attendeeId - Attendee identifier
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export declare function addDepositionAttendee(depositionId: string, attendeeId: string, transaction?: Transaction): Promise<DepositionModel>;
/**
 * Remove attendee from deposition
 *
 * @param depositionId - Deposition identifier
 * @param attendeeId - Attendee identifier
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export declare function removeDepositionAttendee(depositionId: string, attendeeId: string, transaction?: Transaction): Promise<DepositionModel>;
/**
 * Record service of deposition notice
 *
 * @param depositionId - Deposition identifier
 * @param serviceDate - Date notice was served
 * @param serviceMethod - Method of service
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export declare function recordNoticeService(depositionId: string, serviceDate: Date, serviceMethod: string, transaction?: Transaction): Promise<DepositionModel>;
/**
 * Confirm deposition attendance and readiness
 *
 * @param depositionId - Deposition identifier
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export declare function confirmDeposition(depositionId: string, transaction?: Transaction): Promise<DepositionModel>;
/**
 * Mark deposition as in progress
 *
 * @param depositionId - Deposition identifier
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export declare function startDeposition(depositionId: string, transaction?: Transaction): Promise<DepositionModel>;
/**
 * Mark deposition as completed
 *
 * @param depositionId - Deposition identifier
 * @param actualCost - Actual cost incurred (optional)
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export declare function completeDeposition(depositionId: string, actualCost?: number, transaction?: Transaction): Promise<DepositionModel>;
/**
 * Update transcript status throughout production lifecycle
 *
 * @param transcriptId - Transcript identifier
 * @param status - New status
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
export declare function updateTranscriptStatus(transcriptId: string, status: TranscriptStatus, transaction?: Transaction): Promise<DepositionTranscriptModel>;
/**
 * Attach transcript file to record
 *
 * @param transcriptId - Transcript identifier
 * @param filePath - File path
 * @param fileSize - File size in bytes
 * @param pageCount - Number of pages
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
export declare function attachTranscriptFile(transcriptId: string, filePath: string, fileSize: number, pageCount: number, transaction?: Transaction): Promise<DepositionTranscriptModel>;
/**
 * Submit witness errata sheet for transcript corrections
 *
 * @param transcriptId - Transcript identifier
 * @param errataPath - Path to errata sheet
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
export declare function submitErrataSheet(transcriptId: string, errataPath: string, transaction?: Transaction): Promise<DepositionTranscriptModel>;
/**
 * Assign attorney to review transcript
 *
 * @param transcriptId - Transcript identifier
 * @param reviewerId - Reviewer identifier
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
export declare function assignTranscriptReviewer(transcriptId: string, reviewerId: string, transaction?: Transaction): Promise<DepositionTranscriptModel>;
/**
 * Mark transcript review as complete
 *
 * @param transcriptId - Transcript identifier
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
export declare function completeTranscriptReview(transcriptId: string, transaction?: Transaction): Promise<DepositionTranscriptModel>;
/**
 * Retrieve deposition with all related records
 *
 * @param depositionId - Deposition identifier
 * @returns Deposition with exhibits, transcripts, objections, and summaries
 */
export declare function getDepositionWithRelations(depositionId: string): Promise<DepositionModel>;
/**
 * Search depositions with advanced filtering
 *
 * @param filters - Search filters
 * @returns Matching deposition records
 */
export declare function searchDepositions(filters: {
    matterId?: string;
    witnessId?: string;
    status?: DepositionStatus;
    depositionType?: DepositionType;
    fromDate?: Date;
    toDate?: Date;
    priority?: string;
    isExpert?: boolean;
}): Promise<DepositionModel[]>;
/**
 * Get upcoming depositions within specified days
 *
 * @param matterId - Matter identifier (optional)
 * @param days - Number of days to look ahead (default: 30)
 * @returns Upcoming deposition records
 */
export declare function getUpcomingDepositions(matterId?: string, days?: number): Promise<DepositionModel[]>;
/**
 * Calculate deposition statistics for a matter
 *
 * @param matterId - Matter identifier
 * @returns Deposition statistics
 */
export declare function calculateDepositionStatistics(matterId: string): Promise<{
    totalDepositions: number;
    completedDepositions: number;
    scheduledDepositions: number;
    cancelledDepositions: number;
    totalCost: number;
    averageDuration: number;
    totalObjections: number;
    expertDepositions: number;
    totalExhibits: number;
    transcriptsOrdered: number;
    transcriptsReceived: number;
}>;
export declare class DepositionManagementService {
    private sequelize;
    private configService;
    private readonly logger;
    constructor(sequelize: Sequelize, configService: ConfigService);
    scheduleDeposition(params: z.infer<typeof DepositionScheduleSchema>): Promise<any>;
    prepareExhibit(params: z.infer<typeof ExhibitPrepSchema>): Promise<any>;
    orderTranscript(params: z.infer<typeof TranscriptOrderSchema>): Promise<any>;
    trackObjection(params: z.infer<typeof ObjectionSchema>): Promise<any>;
    createSummary(params: z.infer<typeof SummaryCreationSchema>): Promise<any>;
    getDeposition(id: string): Promise<DepositionModel>;
    searchDepositions(filters: Parameters<typeof searchDepositions>[0]): Promise<DepositionModel[]>;
    getUpcoming(matterId?: string, days?: number): Promise<DepositionModel[]>;
    getStatistics(matterId: string): Promise<{
        totalDepositions: number;
        completedDepositions: number;
        scheduledDepositions: number;
        cancelledDepositions: number;
        totalCost: number;
        averageDuration: number;
        totalObjections: number;
        expertDepositions: number;
        totalExhibits: number;
        transcriptsOrdered: number;
        transcriptsReceived: number;
    }>;
}
export declare class DepositionManagementModule {
    static forRoot(options?: {
        sequelize?: Sequelize;
    }): DynamicModule;
}
export declare class ScheduleDepositionDto {
    matterId: string;
    witnessId: string;
    witnessName: string;
    depositionType: DepositionType;
    scheduledDate: Date;
    scheduledTime: string;
    duration: number;
    location: string;
    isRemote?: boolean;
    remoteLink?: string;
    defendingAttorneyId: string;
    examiningAttorneyId: string;
    courtReporterId?: string;
    topics?: string[];
    priority?: 'low' | 'medium' | 'high' | 'urgent';
}
export declare class PrepareExhibitDto {
    depositionId: string;
    description: string;
    documentId?: string;
    documentPath?: string;
    documentType: string;
    batesRange?: string;
    isConfidential?: boolean;
}
export declare class OrderTranscriptDto {
    depositionId: string;
    courtReporterId: string;
    transcriptType: 'rough' | 'expedited' | 'daily' | 'standard' | 'certified';
    format: 'pdf' | 'word' | 'text' | 'ptx' | 'ascii';
    expectedDate?: Date;
    isConfidential?: boolean;
}
export declare class TrackObjectionDto {
    depositionId: string;
    transcriptPage?: number;
    transcriptLine?: number;
    objectionType: ObjectionType;
    objectingAttorneyId: string;
    question: string;
    grounds: string;
    isPreserved?: boolean;
}
export declare class CreateSummaryDto {
    depositionId: string;
    summaryType: 'page-line' | 'narrative' | 'topical' | 'issue-focused' | 'impeachment';
    createdBy: string;
    summaryText: string;
    keyTestimony?: Array<{
        topic: string;
        pageRange: string;
        lineRange: string;
        testimony: string;
        significance: string;
        tags: string[];
    }>;
    overallImpact: 'positive' | 'neutral' | 'negative' | 'mixed';
}
//# sourceMappingURL=deposition-management-kit.d.ts.map