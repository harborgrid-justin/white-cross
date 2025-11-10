/**
 * Financial Aid Kit - Comprehensive SIS Financial Aid System
 *
 * Production-ready Sequelize models and functions for managing:
 * - Financial aid records and awards
 * - FAFSA integration and processing
 * - Award packaging and disbursements
 * - COD (Common Origination and Disbursement) reporting
 * - Satisfactory Academic Progress (SAP) tracking
 * - Return of Title IV (R2T4) calculations
 * - Professional judgment and adjustments
 *
 * Database: PostgreSQL 14+ optimized with comprehensive indexing
 * ORM: Sequelize 6.x with TypeScript
 * Compliance: FERPA, Title IV, PCI DSS
 */
import { Sequelize, Model, Optional, Association, Transaction } from 'sequelize';
export interface FinancialAidAttributes {
    id: number;
    student_id: number;
    academic_year: string;
    award_year: string;
    term_id?: number;
    enrollment_status: 'full-time' | 'half-time' | 'less-than-half' | 'not-enrolled';
    dependency_status: 'dependent' | 'independent';
    efc: number;
    cost_of_attendance: number;
    financial_need: number;
    total_awarded: number;
    total_disbursed: number;
    status: 'pending' | 'packaged' | 'accepted' | 'declined' | 'cancelled';
    packaging_date?: Date;
    acceptance_date?: Date;
    verification_status?: 'not-selected' | 'selected' | 'completed' | 'exempted';
    verification_completed_date?: Date;
    housing_status?: 'on-campus' | 'off-campus' | 'with-parents';
    special_circumstances?: string;
    notes?: string;
    created_by?: number;
    updated_by?: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}
export interface AwardAttributes {
    id: number;
    financial_aid_id: number;
    student_id: number;
    academic_year: string;
    award_type: 'pell' | 'seog' | 'perkins' | 'subsidized' | 'unsubsidized' | 'plus' | 'work-study' | 'institutional' | 'state' | 'external';
    fund_source: string;
    fund_code: string;
    award_name: string;
    offered_amount: number;
    accepted_amount: number;
    disbursed_amount: number;
    remaining_amount: number;
    award_status: 'offered' | 'accepted' | 'declined' | 'cancelled' | 'disbursed' | 'completed';
    offer_date: Date;
    acceptance_date?: Date;
    decline_reason?: string;
    is_need_based: boolean;
    is_federal: boolean;
    is_loan: boolean;
    interest_rate?: number;
    origination_fee_percent?: number;
    grace_period_months?: number;
    max_eligibility_amount?: number;
    enrollment_requirement?: string;
    renewal_eligible: boolean;
    metadata?: Record<string, any>;
    created_by?: number;
    updated_by?: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}
export interface DisbursementAttributes {
    id: number;
    award_id: number;
    student_id: number;
    financial_aid_id: number;
    disbursement_number: number;
    scheduled_date: Date;
    actual_date?: Date;
    amount: number;
    net_amount: number;
    origination_fee?: number;
    enrollment_status: string;
    credits_enrolled?: number;
    status: 'scheduled' | 'pending' | 'processing' | 'released' | 'returned' | 'cancelled';
    release_method: 'direct-deposit' | 'check' | 'credit-to-account' | 'book-advance';
    transaction_id?: string;
    external_reference?: string;
    cod_reported: boolean;
    cod_report_date?: Date;
    cod_accepted: boolean;
    return_amount?: number;
    return_reason?: string;
    return_date?: Date;
    notes?: string;
    created_by?: number;
    updated_by?: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}
export interface FAFSADataAttributes {
    id: number;
    student_id: number;
    award_year: string;
    transaction_number: number;
    dob: Date;
    ssn_encrypted: string;
    citizenship_status: string;
    email: string;
    phone?: string;
    marital_status: string;
    state_of_residence: string;
    household_size: number;
    num_in_college: number;
    student_agi: number;
    parent_agi?: number;
    student_income_tax: number;
    parent_income_tax?: number;
    student_assets: number;
    parent_assets?: number;
    efc: number;
    dependency_status: 'dependent' | 'independent';
    automatic_zero_efc: boolean;
    simplified_needs_test: boolean;
    pell_eligible: boolean;
    pell_lifetime_eligibility_used: number;
    application_type: 'web' | 'paper' | 'correction';
    correction_number: number;
    isir_received_date: Date;
    processed_date: Date;
    verification_selection: boolean;
    verification_tracking_flags?: string;
    reject_codes?: string;
    comment_codes?: string;
    housing_code: string;
    special_circumstances?: string;
    fafsa_raw_data?: Record<string, any>;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}
export interface SAPRecordAttributes {
    id: number;
    student_id: number;
    academic_year: string;
    evaluation_date: Date;
    evaluation_term_id: number;
    sap_status: 'satisfactory' | 'warning' | 'probation' | 'suspension' | 'dismissed';
    gpa_requirement: number;
    current_gpa: number;
    gpa_met: boolean;
    pace_requirement: number;
    current_pace: number;
    pace_met: boolean;
    max_timeframe_credits: number;
    attempted_credits: number;
    completed_credits: number;
    max_timeframe_met: boolean;
    overall_sap_met: boolean;
    appeal_submitted: boolean;
    appeal_approved?: boolean;
    appeal_date?: Date;
    appeal_reason?: string;
    academic_plan_required: boolean;
    academic_plan_submitted?: boolean;
    reinstatement_date?: Date;
    probation_terms?: number;
    financial_aid_eligible: boolean;
    next_evaluation_date?: Date;
    notes?: string;
    evaluator_id?: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}
export interface ProfessionalJudgmentAttributes {
    id: number;
    student_id: number;
    financial_aid_id: number;
    award_year: string;
    judgment_type: 'dependency-override' | 'income-adjustment' | 'special-circumstance' | 'cost-adjustment' | 'efc-adjustment';
    reason: string;
    documentation?: string;
    original_efc: number;
    adjusted_efc: number;
    original_coa?: number;
    adjusted_coa?: number;
    original_income?: number;
    adjusted_income?: number;
    approval_status: 'pending' | 'approved' | 'denied';
    submitted_date: Date;
    reviewed_date?: Date;
    reviewer_id?: number;
    effective_date?: Date;
    expiration_date?: Date;
    notes?: string;
    supporting_documents?: string[];
    created_by?: number;
    updated_by?: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}
export interface CODReportAttributes {
    id: number;
    report_type: 'origination' | 'disbursement' | 'change' | 'correction';
    batch_id: string;
    report_date: Date;
    academic_year: string;
    school_code: string;
    total_records: number;
    total_amount: number;
    file_name: string;
    file_path?: string;
    submission_date?: Date;
    submission_method: 'saig' | 'edconnect' | 'manual';
    acknowledgment_received: boolean;
    acknowledgment_date?: Date;
    acknowledgment_file?: string;
    errors_count: number;
    warnings_count: number;
    accepted_count: number;
    rejected_count: number;
    status: 'pending' | 'submitted' | 'accepted' | 'rejected' | 'corrected';
    error_details?: Record<string, any>[];
    resubmission_of?: number;
    notes?: string;
    created_by?: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}
export interface R2T4CalculationAttributes {
    id: number;
    student_id: number;
    financial_aid_id: number;
    academic_year: string;
    term_id: number;
    withdrawal_date: Date;
    determination_date: Date;
    last_attendance_date?: Date;
    withdrawal_type: 'official' | 'unofficial' | 'administrative';
    total_days_in_period: number;
    days_completed: number;
    completion_percentage: number;
    total_aid_disbursed: number;
    total_aid_could_disburse: number;
    earned_aid: number;
    unearned_aid: number;
    aid_to_return: number;
    student_return_amount: number;
    school_return_amount: number;
    post_withdrawal_disbursement?: number;
    return_allocation: Record<string, number>;
    return_deadline: Date;
    return_completed: boolean;
    return_completion_date?: Date;
    nslds_reported: boolean;
    nslds_report_date?: Date;
    status: 'calculated' | 'pending-return' | 'completed' | 'appealed';
    calculation_details: Record<string, any>;
    notes?: string;
    calculated_by?: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}
export type FinancialAidCreationAttributes = Optional<FinancialAidAttributes, 'id' | 'created_at' | 'updated_at'>;
export type AwardCreationAttributes = Optional<AwardAttributes, 'id' | 'created_at' | 'updated_at'>;
export type DisbursementCreationAttributes = Optional<DisbursementAttributes, 'id' | 'created_at' | 'updated_at'>;
export type FAFSADataCreationAttributes = Optional<FAFSADataAttributes, 'id' | 'created_at' | 'updated_at'>;
export type SAPRecordCreationAttributes = Optional<SAPRecordAttributes, 'id' | 'created_at' | 'updated_at'>;
export type ProfessionalJudgmentCreationAttributes = Optional<ProfessionalJudgmentAttributes, 'id' | 'created_at' | 'updated_at'>;
export type CODReportCreationAttributes = Optional<CODReportAttributes, 'id' | 'created_at' | 'updated_at'>;
export type R2T4CalculationCreationAttributes = Optional<R2T4CalculationAttributes, 'id' | 'created_at' | 'updated_at'>;
export declare class FinancialAid extends Model<FinancialAidAttributes, FinancialAidCreationAttributes> implements FinancialAidAttributes {
    id: number;
    student_id: number;
    academic_year: string;
    award_year: string;
    term_id?: number;
    enrollment_status: 'full-time' | 'half-time' | 'less-than-half' | 'not-enrolled';
    dependency_status: 'dependent' | 'independent';
    efc: number;
    cost_of_attendance: number;
    financial_need: number;
    total_awarded: number;
    total_disbursed: number;
    status: 'pending' | 'packaged' | 'accepted' | 'declined' | 'cancelled';
    packaging_date?: Date;
    acceptance_date?: Date;
    verification_status?: 'not-selected' | 'selected' | 'completed' | 'exempted';
    verification_completed_date?: Date;
    housing_status?: 'on-campus' | 'off-campus' | 'with-parents';
    special_circumstances?: string;
    notes?: string;
    created_by?: number;
    updated_by?: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    deleted_at?: Date;
    readonly awards?: Award[];
    readonly fafsaData?: FAFSAData;
    readonly sapRecords?: SAPRecord[];
    readonly professionalJudgments?: ProfessionalJudgment[];
    readonly r2t4Calculations?: R2T4Calculation[];
    static associations: {
        awards: Association<FinancialAid, Award>;
        fafsaData: Association<FinancialAid, FAFSAData>;
        sapRecords: Association<FinancialAid, SAPRecord>;
        professionalJudgments: Association<FinancialAid, ProfessionalJudgment>;
        r2t4Calculations: Association<FinancialAid, R2T4Calculation>;
    };
}
export declare class Award extends Model<AwardAttributes, AwardCreationAttributes> implements AwardAttributes {
    id: number;
    financial_aid_id: number;
    student_id: number;
    academic_year: string;
    award_type: 'pell' | 'seog' | 'perkins' | 'subsidized' | 'unsubsidized' | 'plus' | 'work-study' | 'institutional' | 'state' | 'external';
    fund_source: string;
    fund_code: string;
    award_name: string;
    offered_amount: number;
    accepted_amount: number;
    disbursed_amount: number;
    remaining_amount: number;
    award_status: 'offered' | 'accepted' | 'declined' | 'cancelled' | 'disbursed' | 'completed';
    offer_date: Date;
    acceptance_date?: Date;
    decline_reason?: string;
    is_need_based: boolean;
    is_federal: boolean;
    is_loan: boolean;
    interest_rate?: number;
    origination_fee_percent?: number;
    grace_period_months?: number;
    max_eligibility_amount?: number;
    enrollment_requirement?: string;
    renewal_eligible: boolean;
    metadata?: Record<string, any>;
    created_by?: number;
    updated_by?: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    deleted_at?: Date;
    readonly financialAid?: FinancialAid;
    readonly disbursements?: Disbursement[];
    static associations: {
        financialAid: Association<Award, FinancialAid>;
        disbursements: Association<Award, Disbursement>;
    };
}
export declare class Disbursement extends Model<DisbursementAttributes, DisbursementCreationAttributes> implements DisbursementAttributes {
    id: number;
    award_id: number;
    student_id: number;
    financial_aid_id: number;
    disbursement_number: number;
    scheduled_date: Date;
    actual_date?: Date;
    amount: number;
    net_amount: number;
    origination_fee?: number;
    enrollment_status: string;
    credits_enrolled?: number;
    status: 'scheduled' | 'pending' | 'processing' | 'released' | 'returned' | 'cancelled';
    release_method: 'direct-deposit' | 'check' | 'credit-to-account' | 'book-advance';
    transaction_id?: string;
    external_reference?: string;
    cod_reported: boolean;
    cod_report_date?: Date;
    cod_accepted: boolean;
    return_amount?: number;
    return_reason?: string;
    return_date?: Date;
    notes?: string;
    created_by?: number;
    updated_by?: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    deleted_at?: Date;
    readonly award?: Award;
    static associations: {
        award: Association<Disbursement, Award>;
    };
}
export declare class FAFSAData extends Model<FAFSADataAttributes, FAFSADataCreationAttributes> implements FAFSADataAttributes {
    id: number;
    student_id: number;
    award_year: string;
    transaction_number: number;
    dob: Date;
    ssn_encrypted: string;
    citizenship_status: string;
    email: string;
    phone?: string;
    marital_status: string;
    state_of_residence: string;
    household_size: number;
    num_in_college: number;
    student_agi: number;
    parent_agi?: number;
    student_income_tax: number;
    parent_income_tax?: number;
    student_assets: number;
    parent_assets?: number;
    efc: number;
    dependency_status: 'dependent' | 'independent';
    automatic_zero_efc: boolean;
    simplified_needs_test: boolean;
    pell_eligible: boolean;
    pell_lifetime_eligibility_used: number;
    application_type: 'web' | 'paper' | 'correction';
    correction_number: number;
    isir_received_date: Date;
    processed_date: Date;
    verification_selection: boolean;
    verification_tracking_flags?: string;
    reject_codes?: string;
    comment_codes?: string;
    housing_code: string;
    special_circumstances?: string;
    fafsa_raw_data?: Record<string, any>;
    readonly created_at: Date;
    readonly updated_at: Date;
    deleted_at?: Date;
    static associations: {
        financialAid: Association<FAFSAData, FinancialAid>;
    };
}
export declare class SAPRecord extends Model<SAPRecordAttributes, SAPRecordCreationAttributes> implements SAPRecordAttributes {
    id: number;
    student_id: number;
    academic_year: string;
    evaluation_date: Date;
    evaluation_term_id: number;
    sap_status: 'satisfactory' | 'warning' | 'probation' | 'suspension' | 'dismissed';
    gpa_requirement: number;
    current_gpa: number;
    gpa_met: boolean;
    pace_requirement: number;
    current_pace: number;
    pace_met: boolean;
    max_timeframe_credits: number;
    attempted_credits: number;
    completed_credits: number;
    max_timeframe_met: boolean;
    overall_sap_met: boolean;
    appeal_submitted: boolean;
    appeal_approved?: boolean;
    appeal_date?: Date;
    appeal_reason?: string;
    academic_plan_required: boolean;
    academic_plan_submitted?: boolean;
    reinstatement_date?: Date;
    probation_terms?: number;
    financial_aid_eligible: boolean;
    next_evaluation_date?: Date;
    notes?: string;
    evaluator_id?: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    deleted_at?: Date;
    static associations: {
        financialAid: Association<SAPRecord, FinancialAid>;
    };
}
export declare class ProfessionalJudgment extends Model<ProfessionalJudgmentAttributes, ProfessionalJudgmentCreationAttributes> implements ProfessionalJudgmentAttributes {
    id: number;
    student_id: number;
    financial_aid_id: number;
    award_year: string;
    judgment_type: 'dependency-override' | 'income-adjustment' | 'special-circumstance' | 'cost-adjustment' | 'efc-adjustment';
    reason: string;
    documentation?: string;
    original_efc: number;
    adjusted_efc: number;
    original_coa?: number;
    adjusted_coa?: number;
    original_income?: number;
    adjusted_income?: number;
    approval_status: 'pending' | 'approved' | 'denied';
    submitted_date: Date;
    reviewed_date?: Date;
    reviewer_id?: number;
    effective_date?: Date;
    expiration_date?: Date;
    notes?: string;
    supporting_documents?: string[];
    created_by?: number;
    updated_by?: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    deleted_at?: Date;
    static associations: {
        financialAid: Association<ProfessionalJudgment, FinancialAid>;
    };
}
export declare class CODReport extends Model<CODReportAttributes, CODReportCreationAttributes> implements CODReportAttributes {
    id: number;
    report_type: 'origination' | 'disbursement' | 'change' | 'correction';
    batch_id: string;
    report_date: Date;
    academic_year: string;
    school_code: string;
    total_records: number;
    total_amount: number;
    file_name: string;
    file_path?: string;
    submission_date?: Date;
    submission_method: 'saig' | 'edconnect' | 'manual';
    acknowledgment_received: boolean;
    acknowledgment_date?: Date;
    acknowledgment_file?: string;
    errors_count: number;
    warnings_count: number;
    accepted_count: number;
    rejected_count: number;
    status: 'pending' | 'submitted' | 'accepted' | 'rejected' | 'corrected';
    error_details?: Record<string, any>[];
    resubmission_of?: number;
    notes?: string;
    created_by?: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    deleted_at?: Date;
}
export declare class R2T4Calculation extends Model<R2T4CalculationAttributes, R2T4CalculationCreationAttributes> implements R2T4CalculationAttributes {
    id: number;
    student_id: number;
    financial_aid_id: number;
    academic_year: string;
    term_id: number;
    withdrawal_date: Date;
    determination_date: Date;
    last_attendance_date?: Date;
    withdrawal_type: 'official' | 'unofficial' | 'administrative';
    total_days_in_period: number;
    days_completed: number;
    completion_percentage: number;
    total_aid_disbursed: number;
    total_aid_could_disburse: number;
    earned_aid: number;
    unearned_aid: number;
    aid_to_return: number;
    student_return_amount: number;
    school_return_amount: number;
    post_withdrawal_disbursement?: number;
    return_allocation: Record<string, number>;
    return_deadline: Date;
    return_completed: boolean;
    return_completion_date?: Date;
    nslds_reported: boolean;
    nslds_report_date?: Date;
    status: 'calculated' | 'pending-return' | 'completed' | 'appealed';
    calculation_details: Record<string, any>;
    notes?: string;
    calculated_by?: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    deleted_at?: Date;
    static associations: {
        financialAid: Association<R2T4Calculation, FinancialAid>;
    };
}
/**
 * Initialize all Financial Aid Sequelize models
 * @param sequelize - Sequelize instance
 * @returns Object containing all initialized models
 */
export declare function initFinancialAidModels(sequelize: Sequelize): {
    FinancialAid: typeof FinancialAid;
    Award: typeof Award;
    Disbursement: typeof Disbursement;
    FAFSAData: typeof FAFSAData;
    SAPRecord: typeof SAPRecord;
    ProfessionalJudgment: typeof ProfessionalJudgment;
    CODReport: typeof CODReport;
    R2T4Calculation: typeof R2T4Calculation;
};
/**
 * Sync Financial Aid schema with database (creates tables)
 * @param sequelize - Sequelize instance
 * @param options - Sync options (alter, force)
 */
export declare function syncFinancialAidSchema(sequelize: Sequelize, options?: {
    alter?: boolean;
    force?: boolean;
}): Promise<void>;
/**
 * Create a new financial aid record
 */
export declare function createFinancialAidRecord(data: FinancialAidCreationAttributes, transaction?: Transaction): Promise<FinancialAid>;
/**
 * Update a financial aid record
 */
export declare function updateFinancialAidRecord(id: number, updates: Partial<FinancialAidAttributes>, transaction?: Transaction): Promise<[number, FinancialAid[]]>;
/**
 * Soft delete a financial aid record
 */
export declare function deleteFinancialAidRecord(id: number, transaction?: Transaction): Promise<number>;
/**
 * Get financial aid record by ID with associations
 */
export declare function getFinancialAidById(id: number, includeAssociations?: boolean): Promise<FinancialAid | null>;
/**
 * Query financial aid records with filters
 */
export declare function queryFinancialAidRecords(filters: {
    student_id?: number;
    academic_year?: string;
    award_year?: string;
    status?: string;
    limit?: number;
    offset?: number;
}): Promise<{
    rows: FinancialAid[];
    count: number;
}>;
/**
 * Bulk import financial aid records
 */
export declare function bulkImportFinancialAid(records: FinancialAidCreationAttributes[], transaction?: Transaction): Promise<FinancialAid[]>;
/**
 * Import FAFSA data from ISIR file
 */
export declare function importFAFSAData(fafsaData: FAFSADataCreationAttributes, transaction?: Transaction): Promise<FAFSAData>;
/**
 * Validate FAFSA data for completeness and accuracy
 */
export declare function validateFAFSA(student_id: number, award_year: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Calculate EFC (Expected Family Contribution) from FAFSA data
 */
export declare function calculateEFC(student_id: number, award_year: string): Promise<number>;
/**
 * Parse FAFSA ISIR XML/JSON data
 */
export declare function parseFAFSAISIR(isirData: Record<string, any>, student_id: number): Promise<FAFSADataCreationAttributes>;
/**
 * Track FAFSA verification status and requirements
 */
export declare function trackFAFSAVerification(student_id: number, award_year: string, verificationData: {
    status: 'completed' | 'pending' | 'exempted';
    completed_date?: Date;
    documents_received?: string[];
}, transaction?: Transaction): Promise<FAFSAData>;
/**
 * Create a complete award package for a student
 */
export declare function createAwardPackage(financial_aid_id: number, awards: AwardCreationAttributes[], transaction?: Transaction): Promise<Award[]>;
/**
 * Calculate financial need (COA - EFC)
 */
export declare function calculateNeed(student_id: number, academic_year: string): Promise<{
    coa: number;
    efc: number;
    need: number;
}>;
/**
 * Allocate awards based on eligibility and need
 */
export declare function allocateAwards(financial_aid_id: number, availableFunds: {
    fund_code: string;
    fund_source: string;
    award_type: string;
    max_amount: number;
    is_need_based: boolean;
}[]): Promise<AwardCreationAttributes[]>;
/**
 * Check award limits and eligibility
 */
export declare function checkAwardLimits(student_id: number, academic_year: string, award_type: string): Promise<{
    eligible: boolean;
    remaining_eligibility: number;
    reason?: string;
}>;
/**
 * Generate award letter document
 */
export declare function generateAwardLetter(financial_aid_id: number): Promise<{
    student_info: any;
    awards: any[];
    summary: {
        total_coa: number;
        total_efc: number;
        total_need: number;
        total_awarded: number;
        unmet_need: number;
    };
}>;
/**
 * Compare award packages across years
 */
export declare function compareAwardYears(student_id: number, year1: string, year2: string): Promise<{
    year1_summary: any;
    year2_summary: any;
    differences: any;
}>;
/**
 * Schedule disbursements for an award
 */
export declare function scheduleDisbursements(award_id: number, disbursement_schedule: {
    disbursement_number: number;
    scheduled_date: Date;
    amount: number;
    enrollment_status: string;
}[], transaction?: Transaction): Promise<Disbursement[]>;
/**
 * Process a disbursement (release funds)
 */
export declare function processDisbursement(disbursement_id: number, release_method: 'direct-deposit' | 'check' | 'credit-to-account' | 'book-advance', transaction?: Transaction): Promise<Disbursement>;
/**
 * Reverse a disbursement (return funds)
 */
export declare function reverseDisbursement(disbursement_id: number, return_reason: string, return_amount: number, transaction?: Transaction): Promise<Disbursement>;
/**
 * Track disbursement status and updates
 */
export declare function trackDisbursementStatus(filters: {
    student_id?: number;
    award_id?: number;
    status?: string;
    date_range?: {
        start: Date;
        end: Date;
    };
}): Promise<Disbursement[]>;
/**
 * Calculate disbursement dates based on term calendar
 */
export declare function calculateDisbursementDates(award_id: number, term_dates: {
    term_id: number;
    start_date: Date;
    end_date: Date;
}[]): Promise<{
    disbursement_number: number;
    scheduled_date: Date;
    amount: number;
}[]>;
/**
 * Reconcile disbursements with accounting system
 */
export declare function reconcileDisbursements(academic_year: string, report_date: Date): Promise<{
    total_scheduled: number;
    total_released: number;
    total_returned: number;
    pending_count: number;
    discrepancies: any[];
}>;
/**
 * Generate COD report file
 */
export declare function generateCODFile(academic_year: string, report_type: 'origination' | 'disbursement' | 'change' | 'correction', school_code: string): Promise<CODReport>;
/**
 * Validate COD data before submission
 */
export declare function validateCODData(report_id: number): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Submit COD report to federal system
 */
export declare function submitCODReport(report_id: number, transaction?: Transaction): Promise<CODReport>;
/**
 * Process COD acknowledgment response
 */
export declare function processCODResponse(report_id: number, response_data: {
    acknowledgment_file: string;
    accepted_count: number;
    rejected_count: number;
    errors: any[];
    warnings: any[];
}, transaction?: Transaction): Promise<CODReport>;
/**
 * Track COD submission status
 */
export declare function trackCODStatus(academic_year?: string): Promise<CODReport[]>;
/**
 * Calculate SAP status for a student
 */
export declare function calculateSAPStatus(student_id: number, academic_year: string, term_id: number, academic_data: {
    gpa: number;
    attempted_credits: number;
    completed_credits: number;
    program_credits_required: number;
}): Promise<SAPRecordCreationAttributes>;
/**
 * Evaluate SAP criteria and create record
 */
export declare function evaluateSAPCriteria(student_id: number, academic_year: string, term_id: number, transaction?: Transaction): Promise<SAPRecord>;
/**
 * Create SAP appeal
 */
export declare function createSAPAppeal(sap_record_id: number, appeal_reason: string, supporting_documents?: string[], transaction?: Transaction): Promise<SAPRecord>;
/**
 * Track SAP probation status
 */
export declare function trackSAPProbation(student_id: number): Promise<{
    current_status: string;
    probation_terms: number;
    requires_plan: boolean;
    eligible_for_aid: boolean;
}>;
/**
 * Generate SAP report for a term or year
 */
export declare function generateSAPReport(academic_year: string, term_id?: number): Promise<{
    total_students: number;
    satisfactory: number;
    warning: number;
    probation: number;
    suspension: number;
    dismissed: number;
}>;
/**
 * Adjust an award amount
 */
export declare function adjustAward(award_id: number, new_amount: number, reason: string, transaction?: Transaction): Promise<Award>;
/**
 * Process repackaging (recalculate entire package)
 */
export declare function processRepackaging(financial_aid_id: number, reason: string, transaction?: Transaction): Promise<FinancialAid>;
/**
 * Apply professional judgment adjustment
 */
export declare function applyProfessionalJudgment(pj_id: number, transaction?: Transaction): Promise<{
    financial_aid: FinancialAid;
    professional_judgment: ProfessionalJudgment;
}>;
/**
 * Track award change history
 */
export declare function trackAwardChanges(award_id: number): Promise<any[]>;
/**
 * Notify student of award changes
 */
export declare function notifyAwardChange(award_id: number, notification_type: 'increase' | 'decrease' | 'cancellation' | 'new-award'): Promise<{
    notification_sent: boolean;
    notification_id?: string;
}>;
/**
 * Calculate R2T4 for a withdrawn student
 */
export declare function calculateR2T4(financial_aid_id: number, withdrawal_date: Date, term_id: number, term_start_date: Date, term_end_date: Date): Promise<R2T4CalculationCreationAttributes>;
/**
 * Determine withdrawal date for R2T4
 */
export declare function determineWithdrawalDate(student_id: number, term_id: number, withdrawal_type: 'official' | 'unofficial' | 'administrative', last_attendance_date?: Date): Promise<Date>;
/**
 * Calculate earned aid amount
 */
export declare function calculateEarnedAid(total_aid: number, completion_percentage: number): Promise<number>;
/**
 * Calculate return amount by fund type
 */
export declare function calculateReturnAmount(r2t4_id: number): Promise<Record<string, number>>;
/**
 * Generate R2T4 worksheet report
 */
export declare function generateR2T4Report(r2t4_id: number): Promise<{
    student_info: any;
    withdrawal_info: any;
    calculation: any;
    return_schedule: any;
}>;
declare const _default: {
    FinancialAid: typeof FinancialAid;
    Award: typeof Award;
    Disbursement: typeof Disbursement;
    FAFSAData: typeof FAFSAData;
    SAPRecord: typeof SAPRecord;
    ProfessionalJudgment: typeof ProfessionalJudgment;
    CODReport: typeof CODReport;
    R2T4Calculation: typeof R2T4Calculation;
    initFinancialAidModels: typeof initFinancialAidModels;
    syncFinancialAidSchema: typeof syncFinancialAidSchema;
    createFinancialAidRecord: typeof createFinancialAidRecord;
    updateFinancialAidRecord: typeof updateFinancialAidRecord;
    deleteFinancialAidRecord: typeof deleteFinancialAidRecord;
    getFinancialAidById: typeof getFinancialAidById;
    queryFinancialAidRecords: typeof queryFinancialAidRecords;
    bulkImportFinancialAid: typeof bulkImportFinancialAid;
    importFAFSAData: typeof importFAFSAData;
    validateFAFSA: typeof validateFAFSA;
    calculateEFC: typeof calculateEFC;
    parseFAFSAISIR: typeof parseFAFSAISIR;
    trackFAFSAVerification: typeof trackFAFSAVerification;
    createAwardPackage: typeof createAwardPackage;
    calculateNeed: typeof calculateNeed;
    allocateAwards: typeof allocateAwards;
    checkAwardLimits: typeof checkAwardLimits;
    generateAwardLetter: typeof generateAwardLetter;
    compareAwardYears: typeof compareAwardYears;
    scheduleDisbursements: typeof scheduleDisbursements;
    processDisbursement: typeof processDisbursement;
    reverseDisbursement: typeof reverseDisbursement;
    trackDisbursementStatus: typeof trackDisbursementStatus;
    calculateDisbursementDates: typeof calculateDisbursementDates;
    reconcileDisbursements: typeof reconcileDisbursements;
    generateCODFile: typeof generateCODFile;
    validateCODData: typeof validateCODData;
    submitCODReport: typeof submitCODReport;
    processCODResponse: typeof processCODResponse;
    trackCODStatus: typeof trackCODStatus;
    calculateSAPStatus: typeof calculateSAPStatus;
    evaluateSAPCriteria: typeof evaluateSAPCriteria;
    createSAPAppeal: typeof createSAPAppeal;
    trackSAPProbation: typeof trackSAPProbation;
    generateSAPReport: typeof generateSAPReport;
    adjustAward: typeof adjustAward;
    processRepackaging: typeof processRepackaging;
    applyProfessionalJudgment: typeof applyProfessionalJudgment;
    trackAwardChanges: typeof trackAwardChanges;
    notifyAwardChange: typeof notifyAwardChange;
    calculateR2T4: typeof calculateR2T4;
    determineWithdrawalDate: typeof determineWithdrawalDate;
    calculateEarnedAid: typeof calculateEarnedAid;
    calculateReturnAmount: typeof calculateReturnAmount;
    generateR2T4Report: typeof generateR2T4Report;
};
export default _default;
//# sourceMappingURL=financial-aid-kit.d.ts.map