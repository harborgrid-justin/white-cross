/**
 * LOC: CREDMGMT001
 * File: /reuse/edwards/financial/credit-management-risk-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./financial-accounts-receivable-kit (AR operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend credit management modules
 *   - Collections services
 *   - Risk assessment systems
 *   - Customer credit workflows
 */
/**
 * File: /reuse/edwards/financial/credit-management-risk-kit.ts
 * Locator: WC-EDWARDS-CREDMGMT-001
 * Purpose: Comprehensive Credit Management & Risk Assessment - Oracle JD Edwards EnterpriseOne-level credit limits, scoring, collections, dunning, risk mitigation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, financial-accounts-receivable-kit
 * Downstream: ../backend/credit/*, Collections Services, Risk Assessment, Customer Credit Workflows
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 44 functions for credit limits, credit scoring, credit holds, credit reviews, collections, dunning, aging analysis, credit insurance, risk mitigation
 *
 * LLM Context: Enterprise-grade credit management for Oracle JD Edwards EnterpriseOne compliance.
 * Provides comprehensive credit limit management with approval workflows, credit scoring integration
 * with credit bureaus (Experian, Equifax, TransUnion), credit hold automation, periodic credit reviews,
 * collections case management, dunning level progression, AR aging analysis, credit insurance tracking,
 * and risk mitigation strategies. Supports FCRA and FDCPA compliance.
 *
 * Database Schema Design:
 * - customer_credit_limits: Credit limit master with effective dating and approval workflow
 * - credit_scoring_models: Configurable scoring algorithm definitions
 * - credit_scores: Customer credit score history (time series)
 * - credit_holds: Active credit holds with release workflow
 * - credit_reviews: Periodic credit review records and decisions
 * - credit_risk_assessments: Comprehensive risk evaluation results
 * - collections_cases: Collections case management with assignment
 * - dunning_levels: Dunning configuration by level and severity
 * - dunning_history: Customer dunning communications audit trail
 * - aging_analysis: AR aging bucket snapshots for reporting
 * - credit_insurance_policies: Credit insurance coverage tracking
 * - risk_mitigation_actions: Risk mitigation plan execution
 *
 * Indexing Strategy:
 * - Composite indexes: (customer_id, effective_date), (customer_id, score_date)
 * - Partial indexes: WHERE hold_status = 'active', WHERE collections_status IN ('active', 'escalated')
 * - Covering indexes: Collections dashboard with (status, assigned_to, priority)
 * - GIN indexes: JSON metadata for flexible risk factor queries
 * - Expression indexes: UPPER(customer_name) for case-insensitive search
 *
 * Query Optimization:
 * - Materialized views for aging analysis summary (refreshed daily)
 * - Denormalized current credit limit in customer master table
 * - Partitioning aging_analysis by fiscal period for historical data
 * - Batch credit score calculation with parallel processing
 * - Prepared statements for collections workload queries
 */
import { Sequelize, Transaction } from 'sequelize';
interface CustomerCreditLimit {
    creditLimitId: number;
    customerId: number;
    customerName: string;
    creditLimit: number;
    effectiveDate: Date;
    expirationDate: Date | null;
    previousLimit: number;
    currency: string;
    status: 'active' | 'expired' | 'pending' | 'rejected';
    requestedBy: string;
    approvedBy: string | null;
    approvedAt: Date | null;
    rejectionReason: string | null;
    reviewDate: Date;
    metadata: Record<string, any>;
}
interface CreditScore {
    scoreId: number;
    customerId: number;
    scoreDate: Date;
    scoreValue: number;
    scoreModel: string;
    scoreSource: 'experian' | 'equifax' | 'transunion' | 'internal';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    scoreFactors: Record<string, any>;
    bureauResponse: Record<string, any>;
    calculatedBy: string;
}
interface CreditHold {
    holdId: number;
    customerId: number;
    customerName: string;
    holdType: 'manual' | 'auto_overlimit' | 'auto_pastdue' | 'auto_nsf' | 'fraud';
    holdReason: string;
    holdDate: Date;
    holdStatus: 'active' | 'released' | 'expired';
    releasedDate: Date | null;
    releasedBy: string | null;
    releaseReason: string | null;
    impactedOrders: number[];
    autoRelease: boolean;
    releaseConditions: Record<string, any>;
}
interface CreditReview {
    reviewId: number;
    customerId: number;
    reviewDate: Date;
    reviewType: 'periodic' | 'triggered' | 'ad_hoc';
    reviewStatus: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    currentCreditLimit: number;
    recommendedLimit: number;
    currentRiskLevel: string;
    assessedRiskLevel: string;
    reviewNotes: string;
    reviewedBy: string;
    approvedBy: string | null;
    completedAt: Date | null;
    nextReviewDate: Date;
}
interface CreditRiskAssessment {
    assessmentId: number;
    customerId: number;
    assessmentDate: Date;
    assessmentType: 'initial' | 'periodic' | 'triggered';
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    financialRatios: Record<string, number>;
    paymentHistory: Record<string, any>;
    exposureAmount: number;
    daysPayableOutstanding: number;
    delinquencyRate: number;
    riskFactors: string[];
    mitigationRecommendations: string[];
    assessedBy: string;
}
interface CollectionsCase {
    caseId: number;
    customerId: number;
    customerName: string;
    caseNumber: string;
    caseType: 'overdue' | 'dispute' | 'bankruptcy' | 'legal';
    caseStatus: 'new' | 'active' | 'escalated' | 'resolved' | 'written_off';
    priority: 'low' | 'medium' | 'high' | 'critical';
    totalOutstanding: number;
    oldestInvoiceDate: Date;
    daysOutstanding: number;
    assignedTo: string;
    openedDate: Date;
    closedDate: Date | null;
    resolutionType: string | null;
    resolutionNotes: string | null;
    nextActionDate: Date;
    nextActionType: string;
}
interface DunningHistory {
    dunningId: number;
    customerId: number;
    caseId: number | null;
    dunningLevel: number;
    dunningDate: Date;
    invoiceNumbers: string[];
    totalAmount: number;
    daysOverdue: number;
    messageSubject: string;
    messageBody: string;
    deliveryMethod: 'email' | 'mail' | 'phone' | 'sms';
    deliveryStatus: 'sent' | 'delivered' | 'failed' | 'bounced';
    sentBy: string;
    responseReceived: boolean;
    responseDate: Date | null;
    responseNotes: string | null;
}
interface AgingAnalysis {
    agingId: number;
    analysisDate: Date;
    customerId: number;
    customerName: string;
    totalOutstanding: number;
    current: number;
    days1to30: number;
    days31to60: number;
    days61to90: number;
    days91to120: number;
    over120: number;
    creditLimit: number;
    creditAvailable: number;
    riskLevel: string;
    agingBucket: 'current' | '1-30' | '31-60' | '61-90' | '91-120' | '120+';
}
interface CreditDashboard {
    customerId: number;
    customerName: string;
    creditLimit: number;
    currentBalance: number;
    creditAvailable: number;
    utilizationPercent: number;
    latestCreditScore: number;
    riskLevel: string;
    holdStatus: 'none' | 'active';
    daysPayableOutstanding: number;
    totalPastDue: number;
    activeCases: number;
    lastPaymentDate: Date | null;
    nextReviewDate: Date;
}
interface CollectionsWorkload {
    assignedTo: string;
    activeCases: number;
    totalOutstanding: number;
    highPriorityCases: number;
    overdueActions: number;
    resolvedThisMonth: number;
    collectionRate: number;
}
export declare class CreateCreditLimitDto {
    customerId: number;
    creditLimit: number;
    effectiveDate: Date;
    expirationDate?: Date;
    currency: string;
    requestedBy: string;
    reviewDate: Date;
}
export declare class ApproveCreditLimitDto {
    creditLimitId: number;
    approvedBy: string;
    approvalNotes?: string;
}
export declare class CreateCreditHoldDto {
    customerId: number;
    holdType: string;
    holdReason: string;
    autoRelease?: boolean;
    releaseConditions?: Record<string, any>;
}
export declare class CalculateCreditScoreDto {
    customerId: number;
    modelId: number;
    includeBureau?: boolean;
    bureauSource?: string;
}
export declare class CreateCollectionsCaseDto {
    customerId: number;
    caseType: string;
    priority: string;
    assignedTo: string;
    nextActionDate: Date;
    nextActionType: string;
}
export declare class SendDunningNoticeDto {
    customerId: number;
    dunningLevel: number;
    invoiceNumbers: string[];
    deliveryMethod: string;
    overrideMessage?: string;
}
export declare class AgingAnalysisRequestDto {
    asOfDate: Date;
    customerIds?: number[];
    agingBucket?: string;
    minAmount?: number;
}
export declare class CreateCreditReviewDto {
    customerId: number;
    reviewType: string;
    reviewDate: Date;
    reviewedBy: string;
}
export declare class RiskAssessmentRequestDto {
    customerId: number;
    assessmentType: string;
    includeFinancialAnalysis?: boolean;
}
/**
 * Sequelize model for Customer Credit Limits with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CustomerCreditLimit model
 *
 * @example
 * ```typescript
 * const CreditLimit = createCustomerCreditLimitModel(sequelize);
 * const limit = await CreditLimit.create({
 *   customerId: 12345,
 *   customerName: 'Acme Corp',
 *   creditLimit: 100000,
 *   effectiveDate: new Date(),
 *   currency: 'USD',
 *   requestedBy: 'user123'
 * });
 * ```
 */
export declare const createCustomerCreditLimitModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        customerId: number;
        customerName: string;
        creditLimit: number;
        effectiveDate: Date;
        expirationDate: Date | null;
        previousLimit: number;
        currency: string;
        status: string;
        requestedBy: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectionReason: string | null;
        reviewDate: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Credit Scoring Models.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditScoringModel model
 */
export declare const createCreditScoringModelModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        modelName: string;
        modelVersion: string;
        modelType: string;
        isActive: boolean;
        scoringFactors: Record<string, number>;
        weightings: Record<string, number>;
        scoreMin: number;
        scoreMax: number;
        riskThresholds: Record<string, number>;
        effectiveDate: Date;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Credit Scores (time series).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditScore model
 */
export declare const createCreditScoreModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        customerId: number;
        scoreDate: Date;
        scoreValue: number;
        scoreModel: string;
        scoreSource: string;
        riskLevel: string;
        scoreFactors: Record<string, any>;
        bureauResponse: Record<string, any>;
        calculatedBy: string;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Credit Holds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditHold model
 */
export declare const createCreditHoldModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        customerId: number;
        customerName: string;
        holdType: string;
        holdReason: string;
        holdDate: Date;
        holdStatus: string;
        releasedDate: Date | null;
        releasedBy: string | null;
        releaseReason: string | null;
        impactedOrders: number[];
        autoRelease: boolean;
        releaseConditions: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Credit Reviews.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditReview model
 */
export declare const createCreditReviewModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        customerId: number;
        reviewDate: Date;
        reviewType: string;
        reviewStatus: string;
        currentCreditLimit: number;
        recommendedLimit: number;
        currentRiskLevel: string;
        assessedRiskLevel: string;
        reviewNotes: string;
        reviewedBy: string;
        approvedBy: string | null;
        completedAt: Date | null;
        nextReviewDate: Date;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Credit Risk Assessments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditRiskAssessment model
 */
export declare const createCreditRiskAssessmentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        customerId: number;
        assessmentDate: Date;
        assessmentType: string;
        riskScore: number;
        riskLevel: string;
        financialRatios: Record<string, number>;
        paymentHistory: Record<string, any>;
        exposureAmount: number;
        daysPayableOutstanding: number;
        delinquencyRate: number;
        riskFactors: string[];
        mitigationRecommendations: string[];
        assessedBy: string;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Collections Cases.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CollectionsCase model
 */
export declare const createCollectionsCaseModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        customerId: number;
        customerName: string;
        caseNumber: string;
        caseType: string;
        caseStatus: string;
        priority: string;
        totalOutstanding: number;
        oldestInvoiceDate: Date;
        daysOutstanding: number;
        assignedTo: string;
        openedDate: Date;
        closedDate: Date | null;
        resolutionType: string | null;
        resolutionNotes: string | null;
        nextActionDate: Date;
        nextActionType: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Dunning Levels configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DunningLevel model
 */
export declare const createDunningLevelModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        levelNumber: number;
        levelName: string;
        daysOverdue: number;
        severity: string;
        messageTemplate: string;
        deliveryMethods: string[];
        escalationRules: Record<string, any>;
        autoHold: boolean;
        autoEscalate: boolean;
        escalationDays: number;
        isActive: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Dunning History (audit trail).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DunningHistory model
 */
export declare const createDunningHistoryModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        customerId: number;
        caseId: number | null;
        dunningLevel: number;
        dunningDate: Date;
        invoiceNumbers: string[];
        totalAmount: number;
        daysOverdue: number;
        messageSubject: string;
        messageBody: string;
        deliveryMethod: string;
        deliveryStatus: string;
        sentBy: string;
        responseReceived: boolean;
        responseDate: Date | null;
        responseNotes: string | null;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Aging Analysis snapshots.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AgingAnalysis model
 */
export declare const createAgingAnalysisModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        analysisDate: Date;
        customerId: number;
        customerName: string;
        totalOutstanding: number;
        current: number;
        days1to30: number;
        days31to60: number;
        days61to90: number;
        days91to120: number;
        over120: number;
        creditLimit: number;
        creditAvailable: number;
        riskLevel: string;
        agingBucket: string;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Credit Insurance Policies.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditInsurancePolicy model
 */
export declare const createCreditInsurancePolicyModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        customerId: number;
        policyNumber: string;
        insuranceProvider: string;
        coverageAmount: number;
        deductible: number;
        premiumRate: number;
        effectiveDate: Date;
        expirationDate: Date;
        status: string;
        claimHistory: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Risk Mitigation Actions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RiskMitigationAction model
 */
export declare const createRiskMitigationActionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        customerId: number;
        assessmentId: number;
        actionType: string;
        actionDescription: string;
        actionDate: Date;
        actionStatus: string;
        completedDate: Date | null;
        expectedImpact: string;
        actualImpact: string | null;
        implementedBy: string;
        notes: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Create new credit limit request (pending approval).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCreditLimitDto} limitData - Credit limit data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CustomerCreditLimit>} Created credit limit
 *
 * @example
 * ```typescript
 * const limit = await createCreditLimit(sequelize, {
 *   customerId: 12345,
 *   creditLimit: 100000,
 *   effectiveDate: new Date('2024-01-01'),
 *   currency: 'USD',
 *   requestedBy: 'user123',
 *   reviewDate: new Date('2024-07-01')
 * });
 * ```
 */
export declare function createCreditLimit(sequelize: Sequelize, limitData: CreateCreditLimitDto, transaction?: Transaction): Promise<CustomerCreditLimit>;
/**
 * Approve credit limit and activate.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ApproveCreditLimitDto} approvalData - Approval data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function approveCreditLimit(sequelize: Sequelize, approvalData: ApproveCreditLimitDto, transaction?: Transaction): Promise<void>;
/**
 * Reject credit limit request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} creditLimitId - Credit limit ID
 * @param {string} rejectionReason - Rejection reason
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function rejectCreditLimit(sequelize: Sequelize, creditLimitId: number, rejectionReason: string, transaction?: Transaction): Promise<void>;
/**
 * Get current active credit limit for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<CustomerCreditLimit | null>} Active credit limit
 */
export declare function getCurrentCreditLimit(sequelize: Sequelize, customerId: number): Promise<CustomerCreditLimit | null>;
/**
 * Get credit limit history for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<CustomerCreditLimit[]>} Credit limit history
 */
export declare function getCreditLimitHistory(sequelize: Sequelize, customerId: number): Promise<CustomerCreditLimit[]>;
/**
 * Check if customer exceeds credit limit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {number} currentBalance - Current AR balance
 * @returns {Promise<boolean>} True if over limit
 */
export declare function isOverCreditLimit(sequelize: Sequelize, customerId: number, currentBalance: number): Promise<boolean>;
/**
 * Get pending credit limit approvals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CustomerCreditLimit[]>} Pending approvals
 */
export declare function getPendingCreditLimitApprovals(sequelize: Sequelize): Promise<CustomerCreditLimit[]>;
/**
 * Calculate credit utilization percentage.
 *
 * @param {number} creditLimit - Credit limit
 * @param {number} currentBalance - Current balance
 * @returns {number} Utilization percentage (0-100)
 */
export declare function calculateCreditUtilization(creditLimit: number, currentBalance: number): number;
/**
 * Calculate internal credit score for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CalculateCreditScoreDto} request - Scoring request
 * @param {string} userId - User calculating score
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CreditScore>} Calculated credit score
 *
 * @description
 * Calculates credit score using configured scoring model.
 * Factors: payment history, credit utilization, account age, delinquency rate.
 */
export declare function calculateCreditScore(sequelize: Sequelize, request: CalculateCreditScoreDto, userId: string, transaction?: Transaction): Promise<CreditScore>;
/**
 * Pull credit score from bureau (Experian, Equifax, TransUnion).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {string} bureauSource - Bureau source
 * @param {string} userId - User requesting pull
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CreditScore>} Bureau credit score
 */
export declare function pullBureauCreditScore(sequelize: Sequelize, customerId: number, bureauSource: 'experian' | 'equifax' | 'transunion', userId: string, transaction?: Transaction): Promise<CreditScore>;
/**
 * Get latest credit score for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<CreditScore | null>} Latest credit score
 */
export declare function getLatestCreditScore(sequelize: Sequelize, customerId: number): Promise<CreditScore | null>;
/**
 * Get credit score history for trending.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<CreditScore[]>} Score history
 */
export declare function getCreditScoreHistory(sequelize: Sequelize, customerId: number, startDate?: Date, endDate?: Date): Promise<CreditScore[]>;
/**
 * Place credit hold on customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCreditHoldDto} holdData - Hold data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CreditHold>} Created credit hold
 */
export declare function placeCreditHold(sequelize: Sequelize, holdData: CreateCreditHoldDto, transaction?: Transaction): Promise<CreditHold>;
/**
 * Release credit hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} holdId - Hold ID
 * @param {string} releasedBy - User releasing hold
 * @param {string} releaseReason - Release reason
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function releaseCreditHold(sequelize: Sequelize, holdId: number, releasedBy: string, releaseReason: string, transaction?: Transaction): Promise<void>;
/**
 * Check if customer has active credit hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<boolean>} True if hold active
 */
export declare function hasActiveCreditHold(sequelize: Sequelize, customerId: number): Promise<boolean>;
/**
 * Get active credit holds for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<CreditHold[]>} Active holds
 */
export declare function getActiveCreditHolds(sequelize: Sequelize, customerId: number): Promise<CreditHold[]>;
/**
 * Auto-release holds based on conditions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<number>} Number of holds released
 */
export declare function processAutoReleaseCreditHolds(sequelize: Sequelize, transaction?: Transaction): Promise<number>;
/**
 * Create credit review for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCreditReviewDto} reviewData - Review data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CreditReview>} Created review
 */
export declare function createCreditReview(sequelize: Sequelize, reviewData: CreateCreditReviewDto, transaction?: Transaction): Promise<CreditReview>;
/**
 * Complete credit review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reviewId - Review ID
 * @param {number} recommendedLimit - Recommended credit limit
 * @param {string} assessedRiskLevel - Assessed risk level
 * @param {string} reviewNotes - Review notes
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function completeCreditReview(sequelize: Sequelize, reviewId: number, recommendedLimit: number, assessedRiskLevel: string, reviewNotes: string, transaction?: Transaction): Promise<void>;
/**
 * Get pending credit reviews.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CreditReview[]>} Pending reviews
 */
export declare function getPendingCreditReviews(sequelize: Sequelize): Promise<CreditReview[]>;
/**
 * Perform comprehensive credit risk assessment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RiskAssessmentRequestDto} request - Assessment request
 * @param {string} userId - User performing assessment
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CreditRiskAssessment>} Risk assessment
 */
export declare function performCreditRiskAssessment(sequelize: Sequelize, request: RiskAssessmentRequestDto, userId: string, transaction?: Transaction): Promise<CreditRiskAssessment>;
/**
 * Get latest risk assessment for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<CreditRiskAssessment | null>} Latest assessment
 */
export declare function getLatestRiskAssessment(sequelize: Sequelize, customerId: number): Promise<CreditRiskAssessment | null>;
/**
 * Create collections case for overdue customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCollectionsCaseDto} caseData - Case data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CollectionsCase>} Created case
 */
export declare function createCollectionsCase(sequelize: Sequelize, caseData: CreateCollectionsCaseDto, transaction?: Transaction): Promise<CollectionsCase>;
/**
 * Update collections case status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} caseId - Case ID
 * @param {string} newStatus - New status
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function updateCollectionsCaseStatus(sequelize: Sequelize, caseId: number, newStatus: string, transaction?: Transaction): Promise<void>;
/**
 * Close collections case.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} caseId - Case ID
 * @param {string} resolutionType - Resolution type
 * @param {string} resolutionNotes - Resolution notes
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function closeCollectionsCase(sequelize: Sequelize, caseId: number, resolutionType: string, resolutionNotes: string, transaction?: Transaction): Promise<void>;
/**
 * Get collections workload by agent.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} assignedTo - Agent user ID
 * @returns {Promise<CollectionsWorkload>} Workload summary
 */
export declare function getCollectionsWorkload(sequelize: Sequelize, assignedTo: string): Promise<CollectionsWorkload>;
/**
 * Send dunning notice to customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SendDunningNoticeDto} noticeData - Notice data
 * @param {string} userId - User sending notice
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<DunningHistory>} Dunning history record
 */
export declare function sendDunningNotice(sequelize: Sequelize, noticeData: SendDunningNoticeDto, userId: string, transaction?: Transaction): Promise<DunningHistory>;
/**
 * Get dunning history for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<DunningHistory[]>} Dunning history
 */
export declare function getDunningHistory(sequelize: Sequelize, customerId: number): Promise<DunningHistory[]>;
/**
 * Process automatic dunning for overdue invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<number>} Number of notices sent
 */
export declare function processAutoDunning(sequelize: Sequelize, transaction?: Transaction): Promise<number>;
/**
 * Generate aging analysis snapshot for all customers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AgingAnalysisRequestDto} request - Analysis request
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<AgingAnalysis[]>} Aging analysis
 */
export declare function generateAgingAnalysis(sequelize: Sequelize, request: AgingAnalysisRequestDto, transaction?: Transaction): Promise<AgingAnalysis[]>;
/**
 * Get aging analysis summary by bucket.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Analysis date
 * @returns {Promise<Record<string, number>>} Summary by bucket
 */
export declare function getAgingAnalysisSummary(sequelize: Sequelize, asOfDate: Date): Promise<Record<string, number>>;
/**
 * Get comprehensive credit dashboard for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @returns {Promise<CreditDashboard>} Credit dashboard
 */
export declare function getCreditDashboard(sequelize: Sequelize, customerId: number): Promise<CreditDashboard>;
export {};
//# sourceMappingURL=credit-management-risk-kit.d.ts.map