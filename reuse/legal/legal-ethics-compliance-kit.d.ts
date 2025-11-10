/**
 * LOC: LEGAL_ETHICS_KIT_001
 * File: /reuse/legal/legal-ethics-compliance-kit.ts
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
 *   - Legal ethics management modules
 *   - Professional responsibility services
 *   - Conflict of interest controllers
 *   - Client confidentiality services
 *   - Fee compliance services
 *   - Ethics monitoring dashboards
 */
import { DynamicModule } from '@nestjs/common';
import { Model } from 'sequelize-typescript';
/**
 * Ethics rule categories based on ABA Model Rules of Professional Conduct
 */
export declare enum EthicsRuleCategory {
    CLIENT_LAWYER_RELATIONSHIP = "client_lawyer_relationship",
    COUNSELOR = "counselor",
    ADVOCATE = "advocate",
    TRANSACTIONS_WITH_OTHERS = "transactions_with_others",
    LAW_FIRMS = "law_firms",
    PUBLIC_SERVICE = "public_service",
    INFORMATION_ABOUT_SERVICES = "information_about_services",
    MAINTAINING_INTEGRITY = "maintaining_integrity"
}
/**
 * Violation severity levels
 */
export declare enum ViolationSeverity {
    MINOR = "minor",
    MODERATE = "moderate",
    SERIOUS = "serious",
    SEVERE = "severe",
    DISBARMENT_LEVEL = "disbarment_level"
}
/**
 * Violation status tracking
 */
export declare enum ViolationStatus {
    REPORTED = "reported",
    UNDER_INVESTIGATION = "under_investigation",
    SUBSTANTIATED = "substantiated",
    UNSUBSTANTIATED = "unsubstantiated",
    REMEDIATED = "remediated",
    PENDING_DISCIPLINE = "pending_discipline",
    CLOSED = "closed"
}
/**
 * Conflict of interest types
 */
export declare enum ConflictType {
    DIRECT_ADVERSITY = "direct_adversity",
    MATERIAL_LIMITATION = "material_limitation",
    FORMER_CLIENT = "former_client",
    IMPUTED_CONFLICT = "imputed_conflict",
    PERSONAL_INTEREST = "personal_interest",
    THIRD_PARTY_PAYER = "third_party_payer",
    PROSPECTIVE_CLIENT = "prospective_client",
    BUSINESS_TRANSACTION = "business_transaction"
}
/**
 * Conflict resolution status
 */
export declare enum ConflictResolution {
    WAIVED_BY_CLIENT = "waived_by_client",
    SCREENING_IMPLEMENTED = "screening_implemented",
    REPRESENTATION_DECLINED = "representation_declined",
    REPRESENTATION_TERMINATED = "representation_terminated",
    NO_CONFLICT = "no_conflict",
    PENDING_REVIEW = "pending_review"
}
/**
 * Fee arrangement types
 */
export declare enum FeeArrangementType {
    HOURLY = "hourly",
    FLAT_FEE = "flat_fee",
    CONTINGENT = "contingent",
    RETAINER = "retainer",
    HYBRID = "hybrid",
    STATUTORY = "statutory",
    COURT_AWARDED = "court_awarded"
}
/**
 * Confidentiality classification levels
 */
export declare enum ConfidentialityLevel {
    PUBLIC = "public",
    CONFIDENTIAL = "confidential",
    ATTORNEY_CLIENT_PRIVILEGE = "attorney_client_privilege",
    WORK_PRODUCT = "work_product",
    TRADE_SECRET = "trade_secret"
}
/**
 * Professional conduct areas
 */
export declare enum ConductArea {
    COMPETENCE = "competence",
    DILIGENCE = "diligence",
    COMMUNICATION = "communication",
    CONFIDENTIALITY = "confidentiality",
    CONFLICTS = "conflicts",
    FEES = "fees",
    ADVERTISING = "advertising",
    CANDOR_TO_TRIBUNAL = "candor_to_tribunal",
    FAIRNESS_TO_OPPOSING_PARTY = "fairness_to_opposing_party",
    TRANSACTIONS_WITH_NONLAWYERS = "transactions_with_nonlawyers"
}
/**
 * Bar association reporting types
 */
export declare enum BarReportingType {
    ANNUAL_REGISTRATION = "annual_registration",
    CLE_COMPLIANCE = "cle_compliance",
    TRUST_ACCOUNT_CERTIFICATION = "trust_account_certification",
    MALPRACTICE_INSURANCE = "malpractice_insurance",
    DISCIPLINARY_ACTION = "disciplinary_action",
    PRO_BONO_HOURS = "pro_bono_hours",
    IOLTA_REPORT = "iolta_report"
}
/**
 * Ethics rule interface
 */
export interface EthicsRule {
    id?: string;
    ruleNumber: string;
    title: string;
    category: EthicsRuleCategory;
    jurisdiction: string;
    ruleText: string;
    commentary?: string;
    effectiveDate: Date;
    amendments?: Array<{
        date: Date;
        description: string;
        amendedText: string;
    }>;
    relatedRules?: string[];
    caseAnnotations?: Array<{
        caseName: string;
        citation: string;
        summary: string;
        year: number;
    }>;
    disciplinaryStandard?: string;
    metadata?: Record<string, any>;
}
/**
 * Ethics violation interface
 */
export interface EthicsViolation {
    id?: string;
    violationType: string;
    ruleViolated: string;
    severity: ViolationSeverity;
    status: ViolationStatus;
    lawyerId: string;
    matterId?: string;
    clientId?: string;
    reportedBy?: string;
    reportedDate: Date;
    incidentDate: Date;
    description: string;
    evidence?: string[];
    investigationNotes?: string;
    remediationPlanId?: string;
    disciplinaryAction?: string;
    closedDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Conflict of interest check interface
 */
export interface ConflictCheck {
    id?: string;
    matterId: string;
    clientId: string;
    opposingParties: string[];
    relatedEntities: string[];
    checkDate: Date;
    checkedBy: string;
    conflictsFound: ConflictDetail[];
    resolution?: ConflictResolution;
    waiverObtained?: boolean;
    waiverDate?: Date;
    screeningMeasures?: string[];
    reviewDate?: Date;
    status: 'pending' | 'cleared' | 'conflict_exists' | 'waived';
    notes?: string;
}
/**
 * Conflict detail interface
 */
export interface ConflictDetail {
    conflictType: ConflictType;
    description: string;
    involvedParties: string[];
    affectedLawyers: string[];
    matterReference?: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    recommendation: string;
}
/**
 * Fee arrangement compliance interface
 */
export interface FeeArrangementCompliance {
    id?: string;
    matterId: string;
    clientId: string;
    arrangementType: FeeArrangementType;
    writtenAgreement: boolean;
    agreementDate?: Date;
    rate?: number;
    contingencyPercentage?: number;
    flatFeeAmount?: number;
    retainerAmount?: number;
    scopeOfRepresentation: string;
    billingFrequency?: string;
    advancedCosts?: number;
    reasonablenessAnalysis?: {
        factorsConsidered: string[];
        marketComparison: string;
        complexityJustification: string;
        approvedBy: string;
        approvedDate: Date;
    };
    prohibitedFeeTypes?: string[];
    divisionOfFees?: {
        sharedWith: string;
        percentage: number;
        clientConsent: boolean;
        jurisdictionPermits: boolean;
    };
    complianceStatus: 'compliant' | 'under_review' | 'non_compliant';
    lastReviewDate: Date;
}
/**
 * Client confidentiality record interface
 */
export interface ConfidentialityRecord {
    id?: string;
    clientId: string;
    matterId: string;
    documentId?: string;
    communicationId?: string;
    classificationLevel: ConfidentialityLevel;
    subject: string;
    createdDate: Date;
    accessLog: Array<{
        accessedBy: string;
        accessDate: Date;
        purpose: string;
        authorized: boolean;
    }>;
    disclosures?: Array<{
        disclosedTo: string;
        disclosureDate: Date;
        purpose: string;
        clientConsent: boolean;
        legalException?: string;
    }>;
    retentionPeriod?: number;
    destructionDate?: Date;
    privilegeClaim: boolean;
    workProductClaim: boolean;
    exceptions?: string[];
}
/**
 * Remediation plan interface
 */
export interface RemediationPlan {
    id?: string;
    violationId: string;
    lawyerId: string;
    createdDate: Date;
    createdBy: string;
    objectives: string[];
    actions: Array<{
        description: string;
        assignedTo: string;
        dueDate: Date;
        completedDate?: Date;
        status: 'pending' | 'in_progress' | 'completed' | 'overdue';
        evidence?: string;
    }>;
    trainingRequired?: string[];
    supervisoryReview: boolean;
    reviewFrequency: string;
    completionDate?: Date;
    effectiveness?: string;
    status: 'active' | 'completed' | 'suspended';
}
/**
 * Continuing Legal Education (CLE) record interface
 */
export interface CLERecord {
    id?: string;
    lawyerId: string;
    jurisdiction: string;
    reportingPeriod: string;
    periodStart: Date;
    periodEnd: Date;
    requiredHours: number;
    completedHours: number;
    ethicsHoursRequired: number;
    ethicsHoursCompleted: number;
    courses: Array<{
        courseId: string;
        title: string;
        provider: string;
        date: Date;
        hours: number;
        ethicsHours: number;
        certificateNumber: string;
    }>;
    complianceStatus: 'compliant' | 'deficient' | 'pending';
    reportedToBar: boolean;
    reportDate?: Date;
}
/**
 * Trust account transaction interface
 */
export interface TrustAccountTransaction {
    id?: string;
    accountId: string;
    clientId: string;
    matterId: string;
    transactionDate: Date;
    transactionType: 'deposit' | 'withdrawal' | 'transfer' | 'interest';
    amount: number;
    balance: number;
    description: string;
    checkNumber?: string;
    reference?: string;
    reconciled: boolean;
    reconciliationDate?: Date;
    threeWayReconciliation?: {
        bankBalance: number;
        bookBalance: number;
        clientLedgerTotal: number;
        reconciled: boolean;
        discrepancies?: string[];
    };
    complianceFlags?: string[];
}
/**
 * Professional conduct assessment interface
 */
export interface ConductAssessment {
    id?: string;
    lawyerId: string;
    assessmentDate: Date;
    assessedBy: string;
    conductArea: ConductArea;
    findings: string;
    score?: number;
    strengths: string[];
    areasForImprovement: string[];
    actionItems: string[];
    followUpDate?: Date;
    completed: boolean;
}
/**
 * Bar reporting submission interface
 */
export interface BarReportingSubmission {
    id?: string;
    lawyerId: string;
    jurisdiction: string;
    reportingType: BarReportingType;
    reportingPeriod: string;
    submissionDate: Date;
    confirmationNumber?: string;
    data: Record<string, any>;
    status: 'draft' | 'submitted' | 'accepted' | 'rejected';
    rejectionReason?: string;
    attestation: {
        attestedBy: string;
        attestedDate: Date;
        signature: string;
    };
}
/**
 * Ethics rule validation schema
 */
export declare const EthicsRuleSchema: any;
/**
 * Ethics violation validation schema
 */
export declare const EthicsViolationSchema: any;
/**
 * Conflict check validation schema
 */
export declare const ConflictCheckSchema: any;
/**
 * Fee arrangement validation schema
 */
export declare const FeeArrangementSchema: any;
/**
 * Confidentiality record validation schema
 */
export declare const ConfidentialityRecordSchema: any;
/**
 * Ethics Rule Model
 * Stores jurisdiction-specific ethics rules and professional conduct standards
 */
export declare class EthicsRuleModel extends Model {
    id: string;
    ruleNumber: string;
    title: string;
    category: EthicsRuleCategory;
    jurisdiction: string;
    ruleText: string;
    commentary?: string;
    effectiveDate: Date;
    amendments?: Array<{
        date: Date;
        description: string;
        amendedText: string;
    }>;
    relatedRules?: string[];
    caseAnnotations?: Array<{
        caseName: string;
        citation: string;
        summary: string;
        year: number;
    }>;
    disciplinaryStandard?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    violations?: EthicsViolationModel[];
}
/**
 * Ethics Violation Model
 * Tracks ethics violations, investigations, and disciplinary actions
 */
export declare class EthicsViolationModel extends Model {
    id: string;
    violationType: string;
    ruleViolated: string;
    severity: ViolationSeverity;
    status: ViolationStatus;
    lawyerId: string;
    matterId?: string;
    clientId?: string;
    reportedBy?: string;
    reportedDate: Date;
    incidentDate: Date;
    description: string;
    evidence?: string[];
    investigationNotes?: string;
    remediationPlanId?: string;
    disciplinaryAction?: string;
    closedDate?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    rule?: EthicsRuleModel;
    remediationPlan?: RemediationPlanModel;
}
/**
 * Conflict of Interest Model
 * Manages conflict checks and screening for legal matters
 */
export declare class ConflictCheckModel extends Model {
    id: string;
    matterId: string;
    clientId: string;
    opposingParties: string[];
    relatedEntities: string[];
    checkDate: Date;
    checkedBy: string;
    conflictsFound: ConflictDetail[];
    resolution?: ConflictResolution;
    waiverObtained?: boolean;
    waiverDate?: Date;
    screeningMeasures?: string[];
    reviewDate?: Date;
    status: 'pending' | 'cleared' | 'conflict_exists' | 'waived';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Remediation Plan Model
 * Tracks remediation plans for ethics violations
 */
export declare class RemediationPlanModel extends Model {
    id: string;
    violationId: string;
    lawyerId: string;
    createdDate: Date;
    createdBy: string;
    objectives: string[];
    actions: Array<{
        description: string;
        assignedTo: string;
        dueDate: Date;
        completedDate?: Date;
        status: 'pending' | 'in_progress' | 'completed' | 'overdue';
        evidence?: string;
    }>;
    trainingRequired?: string[];
    supervisoryReview: boolean;
    reviewFrequency: string;
    completionDate?: Date;
    effectiveness?: string;
    status: 'active' | 'completed' | 'suspended';
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    violations?: EthicsViolationModel[];
}
/**
 * Fee Arrangement Compliance Model
 * Tracks and validates fee arrangements for compliance
 */
export declare class FeeArrangementComplianceModel extends Model {
    id: string;
    matterId: string;
    clientId: string;
    arrangementType: FeeArrangementType;
    writtenAgreement: boolean;
    agreementDate?: Date;
    rate?: number;
    contingencyPercentage?: number;
    flatFeeAmount?: number;
    retainerAmount?: number;
    scopeOfRepresentation: string;
    billingFrequency?: string;
    advancedCosts?: number;
    reasonablenessAnalysis?: {
        factorsConsidered: string[];
        marketComparison: string;
        complexityJustification: string;
        approvedBy: string;
        approvedDate: Date;
    };
    prohibitedFeeTypes?: string[];
    divisionOfFees?: {
        sharedWith: string;
        percentage: number;
        clientConsent: boolean;
        jurisdictionPermits: boolean;
    };
    complianceStatus: 'compliant' | 'under_review' | 'non_compliant';
    lastReviewDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Confidentiality Record Model
 * Tracks client confidential information and privilege claims
 */
export declare class ConfidentialityRecordModel extends Model {
    id: string;
    clientId: string;
    matterId: string;
    documentId?: string;
    communicationId?: string;
    classificationLevel: ConfidentialityLevel;
    subject: string;
    createdDate: Date;
    accessLog: Array<{
        accessedBy: string;
        accessDate: Date;
        purpose: string;
        authorized: boolean;
    }>;
    disclosures?: Array<{
        disclosedTo: string;
        disclosureDate: Date;
        purpose: string;
        clientConsent: boolean;
        legalException?: string;
    }>;
    retentionPeriod?: number;
    destructionDate?: Date;
    privilegeClaim: boolean;
    workProductClaim: boolean;
    exceptions?: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Ethics Rule Service
 * Manages ethics rules tracking, monitoring, and updates
 */
export declare class EthicsRuleService {
    private readonly ethicsRuleRepository;
    private readonly logger;
    constructor(ethicsRuleRepository: typeof EthicsRuleModel);
    /**
     * 1. Create a new ethics rule
     */
    createEthicsRule(ruleData: EthicsRule): Promise<EthicsRuleModel>;
    /**
     * 2. Get ethics rule by ID
     */
    getEthicsRuleById(id: string): Promise<EthicsRuleModel>;
    /**
     * 3. Get ethics rules by jurisdiction
     */
    getEthicsRulesByJurisdiction(jurisdiction: string, category?: EthicsRuleCategory): Promise<EthicsRuleModel[]>;
    /**
     * 4. Search ethics rules
     */
    searchEthicsRules(searchText: string, jurisdiction?: string): Promise<EthicsRuleModel[]>;
    /**
     * 5. Update ethics rule (for amendments)
     */
    updateEthicsRule(id: string, updates: Partial<EthicsRule>): Promise<EthicsRuleModel>;
    /**
     * 6. Get rules requiring attention (recently amended)
     */
    getRecentlyAmendedRules(days?: number): Promise<EthicsRuleModel[]>;
}
/**
 * Ethics Violation Service
 * Manages ethics violation tracking, investigation, and remediation
 */
export declare class EthicsViolationService {
    private readonly violationRepository;
    private readonly remediationRepository;
    private readonly logger;
    constructor(violationRepository: typeof EthicsViolationModel, remediationRepository: typeof RemediationPlanModel);
    /**
     * 7. Report an ethics violation
     */
    reportViolation(violationData: EthicsViolation): Promise<EthicsViolationModel>;
    /**
     * 8. Get violations by lawyer
     */
    getViolationsByLawyer(lawyerId: string, status?: ViolationStatus): Promise<EthicsViolationModel[]>;
    /**
     * 9. Update violation status
     */
    updateViolationStatus(id: string, status: ViolationStatus, notes?: string): Promise<EthicsViolationModel>;
    /**
     * 10. Get violations by severity
     */
    getViolationsBySeverity(severity: ViolationSeverity): Promise<EthicsViolationModel[]>;
    /**
     * 11. Analyze violation patterns
     */
    analyzeViolationPatterns(lawyerId?: string, startDate?: Date, endDate?: Date): Promise<{
        totalViolations: number;
        byCategory: Record<string, number>;
        bySeverity: Record<string, number>;
        trends: any[];
    }>;
    /**
     * 12. Create remediation plan for violation
     */
    createRemediationPlan(violationId: string, planData: Partial<RemediationPlan>): Promise<RemediationPlanModel>;
}
/**
 * Conflict of Interest Service
 * Manages conflict checks and screening
 */
export declare class ConflictOfInterestService {
    private readonly conflictRepository;
    private readonly logger;
    constructor(conflictRepository: typeof ConflictCheckModel);
    /**
     * 13. Perform conflict check
     */
    performConflictCheck(checkData: ConflictCheck): Promise<ConflictCheckModel>;
    /**
     * 14. Screen for conflicts (advanced algorithm)
     */
    screenForConflicts(clientId: string, opposingParties: string[], relatedEntities: string[]): Promise<ConflictDetail[]>;
    /**
     * 15. Check for direct adversity conflicts
     */
    private checkDirectAdversity;
    /**
     * 16. Check for former client conflicts
     */
    private checkFormerClientConflicts;
    /**
     * 17. Check for imputed conflicts
     */
    private checkImputedConflicts;
    /**
     * 18. Resolve conflict with waiver
     */
    resolveWithWaiver(conflictCheckId: string, waiverData: {
        waiverObtained: boolean;
        waiverDate: Date;
        notes: string;
    }): Promise<ConflictCheckModel>;
    /**
     * 19. Implement screening measures
     */
    implementScreening(conflictCheckId: string, screeningMeasures: string[]): Promise<ConflictCheckModel>;
    /**
     * 20. Get conflicts requiring review
     */
    getConflictsRequiringReview(): Promise<ConflictCheckModel[]>;
}
/**
 * Client Confidentiality Service
 * Manages client confidential information protection
 */
export declare class ClientConfidentialityService {
    private readonly confidentialityRepository;
    private readonly logger;
    constructor(confidentialityRepository: typeof ConfidentialityRecordModel);
    /**
     * 21. Create confidentiality record
     */
    createConfidentialityRecord(recordData: ConfidentialityRecord): Promise<ConfidentialityRecordModel>;
    /**
     * 22. Log access to confidential information
     */
    logAccess(recordId: string, accessData: {
        accessedBy: string;
        purpose: string;
        authorized: boolean;
    }): Promise<ConfidentialityRecordModel>;
    /**
     * 23. Record disclosure of confidential information
     */
    recordDisclosure(recordId: string, disclosureData: {
        disclosedTo: string;
        purpose: string;
        clientConsent: boolean;
        legalException?: string;
    }): Promise<ConfidentialityRecordModel>;
    /**
     * 24. Verify privilege claim
     */
    verifyPrivilegeClaim(recordId: string): Promise<{
        valid: boolean;
        reason: string;
        recommendations: string[];
    }>;
    /**
     * 25. Get confidential records by matter
     */
    getRecordsByMatter(matterId: string, classificationLevel?: ConfidentialityLevel): Promise<ConfidentialityRecordModel[]>;
    /**
     * 26. Audit confidentiality compliance
     */
    auditConfidentialityCompliance(clientId: string): Promise<{
        totalRecords: number;
        privilegedRecords: number;
        disclosuresWithConsent: number;
        disclosuresWithoutConsent: number;
        unauthorizedAccess: number;
        complianceScore: number;
    }>;
}
/**
 * Fee Arrangement Compliance Service
 * Manages fee arrangement compliance and validation
 */
export declare class FeeArrangementComplianceService {
    private readonly feeArrangementRepository;
    private readonly logger;
    constructor(feeArrangementRepository: typeof FeeArrangementComplianceModel);
    /**
     * 27. Create fee arrangement
     */
    createFeeArrangement(arrangementData: FeeArrangementCompliance): Promise<FeeArrangementComplianceModel>;
    /**
     * 28. Validate fee reasonableness
     */
    validateFeeReasonableness(arrangement: Partial<FeeArrangementCompliance>): Promise<'compliant' | 'under_review' | 'non_compliant'>;
    /**
     * 29. Review fee arrangement compliance
     */
    reviewFeeCompliance(arrangementId: string, reviewData: {
        complianceStatus: 'compliant' | 'under_review' | 'non_compliant';
        notes: string;
        reviewedBy: string;
    }): Promise<FeeArrangementComplianceModel>;
    /**
     * 30. Get non-compliant fee arrangements
     */
    getNonCompliantArrangements(): Promise<FeeArrangementComplianceModel[]>;
    /**
     * 31. Calculate fee statistics
     */
    calculateFeeStatistics(matterId?: string): Promise<{
        averageHourlyRate: number;
        averageContingencyPercentage: number;
        totalFlatFees: number;
        arrangementTypeDistribution: Record<string, number>;
        complianceRate: number;
    }>;
    /**
     * 32. Validate fee division
     */
    validateFeeDivision(arrangementId: string, divisionData: {
        sharedWith: string;
        percentage: number;
        clientConsent: boolean;
        jurisdictionPermits: boolean;
    }): Promise<{
        valid: boolean;
        issues: string[];
    }>;
}
/**
 * Professional Conduct Service
 * Manages professional conduct assessments and monitoring
 */
export declare class ProfessionalConductService {
    private readonly logger;
    /**
     * 33. Assess lawyer competency
     */
    assessCompetency(lawyerId: string, matterId: string): Promise<{
        competent: boolean;
        factors: Array<{
            factor: string;
            met: boolean;
            notes: string;
        }>;
        recommendations: string[];
    }>;
    /**
     * 34. Monitor client communication compliance
     */
    monitorCommunicationCompliance(lawyerId: string, matterId: string): Promise<{
        compliant: boolean;
        lastCommunication: Date | null;
        daysSinceLastContact: number;
        promptnessScore: number;
        recommendations: string[];
    }>;
    /**
     * 35. Validate matter acceptance
     */
    validateMatterAcceptance(matterData: {
        clientId: string;
        matterType: string;
        jurisdiction: string;
        lawyerId: string;
        estimatedDuration: number;
        complexity: string;
    }): Promise<{
        shouldAccept: boolean;
        conflicts: string[];
        competencyIssues: string[];
        capacityIssues: string[];
        recommendations: string[];
    }>;
    /**
     * 36. Generate ethics compliance report
     */
    generateEthicsComplianceReport(lawyerId: string, startDate: Date, endDate: Date): Promise<{
        lawyerId: string;
        reportPeriod: {
            start: Date;
            end: Date;
        };
        violations: {
            total: number;
            bySeverity: Record<string, number>;
            pending: number;
            resolved: number;
        };
        conflicts: {
            total: number;
            cleared: number;
            waived: number;
            declined: number;
        };
        confidentiality: {
            totalRecords: number;
            privilegedRecords: number;
            disclosures: number;
            complianceScore: number;
        };
        fees: {
            totalArrangements: number;
            compliant: number;
            underReview: number;
            nonCompliant: number;
        };
        overallComplianceScore: number;
        recommendations: string[];
    }>;
}
/**
 * Legal Ethics Compliance Module
 * Provides comprehensive ethics and professional responsibility services
 */
export declare class LegalEthicsComplianceModule {
    static forRoot(options?: {
        defaultJurisdiction?: string;
        autoLoadRules?: boolean;
        strictConflictChecking?: boolean;
    }): DynamicModule;
}
/**
 * Legal ethics configuration
 */
export declare const legalEthicsConfig: any;
/**
 * Generate ethics compliance hash for audit trail
 */
export declare function generateEthicsComplianceHash(data: any): string;
/**
 * Calculate ethics violation risk score
 */
export declare function calculateViolationRiskScore(violation: EthicsViolation): number;
/**
 * Format ethics rule citation
 */
export declare function formatRuleCitation(rule: EthicsRule): string;
/**
 * Validate conflict waiver requirements
 */
export declare function validateConflictWaiver(conflict: ConflictDetail, waiver: {
    informed: boolean;
    written: boolean;
    signed: boolean;
}): {
    valid: boolean;
    issues: string[];
};
export { EthicsRuleModel, EthicsViolationModel, ConflictCheckModel, RemediationPlanModel, FeeArrangementComplianceModel, ConfidentialityRecordModel, EthicsRuleService, EthicsViolationService, ConflictOfInterestService, ClientConfidentialityService, FeeArrangementComplianceService, ProfessionalConductService, LegalEthicsComplianceModule, legalEthicsConfig, EthicsRuleSchema, EthicsViolationSchema, ConflictCheckSchema, FeeArrangementSchema, ConfidentialityRecordSchema, };
//# sourceMappingURL=legal-ethics-compliance-kit.d.ts.map